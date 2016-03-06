import Ember from 'ember';
import KeyHandling from 'frontend/keys';

export default Ember.View.extend({
  templateName: 'typing-area',
  classNames: 'type-area-container',
  textBinding: Ember.Binding.oneWay('controller.controllers.typing_area.current_snippet'),

  focused: false,

  keyDown: function (e) {
    KeyHandling.setPreventDefaultForKey(e);
    if (e.which === KeyHandling.CODES.BACKSPACE) {
      this.text.backUp();
    }
    if (e.which === KeyHandling.CODES.TAB) {
      this.text.tabPressed();
    }
    if (e.which === KeyHandling.CODES.SPACE) {
      this.text.typeOn(' ');
    }
  },

  keyPress: function (e) { // keyDown doesn't account for shift key
    KeyHandling.setPreventDefaultForKey(e);
    if (KeyHandling.notAKeypress(e)) {
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
      KeyHandling.setPreventDefaultForKey(e);
    });
  },

  willDestroyElement: function () {
    $(document).off('.typingArea');
  },

  focusIn: function (e) { this.set('focused', true); },
  focusOut: function (e) { this.set('focused', false); }
});