App.PrefsPopupBackgroundView = Em.View.extend({
  classNames: ['prefs-popup-bg'],

  click: function () {
    this.get('controller').send('closeModal');
  }
});