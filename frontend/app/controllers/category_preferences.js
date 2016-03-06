import Ember from 'ember';
import Storage from 'frontend/storage'
import Category from 'frontend/models/category'

export default Ember.ArrayController.extend({
  init: function () {
    this._super();

    // TODO: Use controllers.session.user after figuring out how
    // to instantiate a CategoryPreferencesController in test
    if (window.currentUser && Storage.supported) {
      // Kill localStorage prefs every time someone logs in properly.
      Storage.remove('typer_tortoise.category_ids');
    }

    // if category ids are in local storage, optimistically
    //   load them into 'model' (as just ids, no 'name' attribute)
    //   as if we know they're correct.
    //
    // this is to optimize the initial pageload so we don't have
    //   to load /categories before /snippets/random.
    //
    // hopefully any discontinuities (a user with discontinued
    //   categories in their localStorage prefs) will be cleared
    //   up when that user next saves their prefs.
    if (!window.currentUser && Storage.supported) {
      var category_ids = Storage.get('typer_tortoise.category_ids');
      if (category_ids) {
        var categories = category_ids.split(',').map(function (cat_id) {
          return Category.create({id: parseInt(cat_id, 10), enabled: true});
        });
        this.set('model', categories);
      }
    }
  },

  noCategoriesSelected: function () {
    return this.enabledCategories().length === 0;
  }.property('model.@each.enabled'),

  findCategoryById: function (category_id) {
    var model = this.get('model');
    var length = model.length;
    for (var i = 0; i < length; i++) {
      if (model[i].get('id') === category_id) {
        return model[i];
      }
    }
    throw "Couldn't find an object with id " + category_id;
  },

  setCategory: function (category_id, enabled) {
    this.findCategoryById(category_id).set('enabled', enabled);
  },

  disableAll: function () {
    this.get('model').forEach(function (category) {
      category.set('enabled', false)
    });
  },

  enabledCategories: function () {
    return this.get('model').filter(function (el) { return el.enabled });
  },

  enabledCategoryIds: function () {
    return this.enabledCategories().map(function (cat) { return cat.get('id') });
  },

  saveCategories: function () {
    var enabledIds = this.enabledCategoryIds();
    if (window.currentUser) {
      return this._saveCategoriesToServer(enabledIds);
    } else {
      return this._saveCategoriesToStorage(enabledIds);
    }
  },

  _saveCategoriesToServer: function (enabledIds) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.ajax({
        type: 'POST',
        url: '/categories/set_preferences',
        data: {
          categories: enabledIds
        },
        dataType: 'json'
      }).then(resolve);
    });
  },

  _saveCategoriesToStorage: function (enabledIds) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (Storage.supported) {
        Storage.set('typer_tortoise.category_ids', enabledIds.join(','));
      }

      resolve();
    });
  },

  loadCategories: function () {
    var self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      return self._loadCategoriesFromServer().then(function (json) {
        self.set('model', json.map(function (el) {
          return Category.create(el);
        }));
        if (!window.currentUser) {
          self._loadCategoryPreferencesFromStorage();
        }
        resolve();
      });
    });
  },

  _loadCategoriesFromServer: function () {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.getJSON('/categories', function (data) {
        resolve(data);
      });
    });
  },

  _loadCategoryPreferencesFromStorage: function () {
    if (!Storage.supported) {
      return;
    }

    var category_id_csv = Storage.get('typer_tortoise.category_ids');
    if (!category_id_csv) {
      return;
    }

    this.disableAll();

    var category_ids = category_id_csv.split(',').map(function (id) { return parseInt(id, 10) });
    category_ids.forEach(function (cat_id) {
      this.setCategory(cat_id, true);
    }, this);
  }
});