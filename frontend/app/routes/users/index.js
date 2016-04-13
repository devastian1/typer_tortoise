import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    if (!this.controllerFor('session').user) {
      this.transitionTo('/');
    }
  },

  model: function () {
    return this.store.findAll('user');
  },

  setupController: function (controller, model) {
    controller.set('model', model);
  }
});
