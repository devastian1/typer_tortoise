App.SnippetsIndexController = Ember.Controller.extend({
  needs: ['session'],

  init: function () {
    this.set('category_id', App.storage.get('typer_tortoise.filtered_category_id'));
  },

  actionsCount: function () {
    return (this.get('controllers.session.user.admin')) ? 4 : 2;
  }.property('controllers.session.user'),

  snippetCategories: function () {
    var categories = {};
    this.get('model.snippets').forEach(function (snippet) {
      categories[snippet.category_id] = snippet.category_name;
    });
    return Object.keys(categories).map(function (id) {
      return {name: categories[id], id: id};
    });
  }.property('model.snippets'),

  filteredSnippets: function () {
    return this.get('model.snippets').filter((function (snippet) {
      return snippet.category_id == this.get('category_id');
    }).bind(this));
  }.property('model.snippets', 'category_id'),

  saveCategoryId: function () {
    App.storage.set('typer_tortoise.filtered_category_id', this.get('category_id'));
  }.observes('category_id'),

  actions: {
    destroy: function (snippet) {
      var answer = confirm('Are you sure?');
      if (answer) {
        Ember.$.ajax({
          url: '/snippets/' + snippet.id + '.json',
          method: 'DELETE'
        }).then((function () {
          var snippets = this.get('model.snippets');
          var newSnippets = [];
          snippets.forEach(function (s) {
            if (s.id != snippet.id) {
              newSnippets.push(s);
            }
          });
          this.set('model.snippets', newSnippets);
        }).bind(this));
      }
    }
  }
});
