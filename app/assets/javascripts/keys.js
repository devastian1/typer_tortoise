App.KeyHandling = {
  // some reference for character codes:
  //   var chr_from_int = String.fromCharCode(34);
  //   var int_from_chr = '"'.charCodeAt(0)

  CODES: {
    BACKSPACE: 8,
    TAB: 9,
    RETURN: 13,
    SPACE: 32,
    SINGLE_QUOTE: 39,
    FORWARD_SLASH: 47
  },

  notAKeypress: function (e) {
    // Pressing 'ctrl-t' to open a new tab still sends that 't'
    //   to the typing area before the new tab opens, meaning
    //   you can unintentionally start 'typing' when you're
    //   really going away to do something else.
    // Don't accept any keystrokes with modifiers to avoid
    //   all these sort of problems.
    if (e.ctrlKey || e.altKey || e.metaKey) { return true; }

    if (e.which === App.KeyHandling.CODES.BACKSPACE) { return true; }
    // tab in keypress shows as 0
    if (e.which === 0)                 { return true; }
    return false;
  },

  setPreventDefaultForKey: function (e) {
    // in firefox delete/backspace goes back a page. undesirable!
    if (e.which === App.KeyHandling.CODES.BACKSPACE)       { e.preventDefault();   }

    // in firefox, single quote and forward slash do a "quick search"
    if (e.which === App.KeyHandling.CODES.SINGLE_QUOTE)    { e.preventDefault();   }
    if (e.which === App.KeyHandling.CODES.FORWARD_SLASH)   { e.preventDefault();   }

    // space will page down if the page is long enough, so don't do that
    if (e.which === App.KeyHandling.CODES.SPACE)           { e.preventDefault();   }

    // tab shouldn't take us out of the typing window
    if (e.which === App.KeyHandling.CODES.TAB)             { e.preventDefault();   }
  }
};
