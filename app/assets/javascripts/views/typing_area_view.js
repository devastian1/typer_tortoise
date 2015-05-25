App.TypingAreaView = Em.View.extend({
  templateName: 'typing-area',
  classNames: 'type-area-container',
  // TODO: bind to something like controller.model. Doesn't work now because
  // prefs category change must be able to change the snippet.
  textBinding: Em.Binding.oneWay('App.typingAreaController.current_snippet'),

  focused: false,

  keyDown: function (e) {
    App.setPreventDefaultForKey(e);
    if (e.which == App.keyCodes.BACKSPACE) {
      this.text.backUp();
    }
    if (e.which == App.keyCodes.TAB) {
      this.text.tabPressed();
    }
    if (e.which == App.keyCodes.SPACE) {
      this.text.typeOn(' ');
    }
  },

  keyPress: function (e) { // keyDown doesn't account for shift key
    App.setPreventDefaultForKey(e);
    if (App.notAKeypress(e)) {
      return;
    }

    var chr = String.fromCharCode(e.which);

    // normalize newlines
    if (chr === '\r') { chr = '\n'; }

    this.text.typeOn(chr);
  },

  didInsertElement: function () {
    this._super();
    this.$().fadeIn();
    this.$().find('.type-panel').focus();
    $(document).on('keypress.typingArea keydown.typingArea', function (e) {
      App.setPreventDefaultForKey(e);
    });
  },

  willDestroyElement: function () {
    $(document).off('.typingArea');
  },

  focusIn: function (e) { this.set('focused', true); },
  focusOut: function (e) { this.set('focused', false); }
});
