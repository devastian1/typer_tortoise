App.IndexRoute = Ember.Route.extend(App.SnippetPlayingRoute, {
  model: function (params) {
    // TODO: This is done more for the side-effect than to return a 'model'.
    return this.controllerFor('typing_area').newSnippet();
  }
});