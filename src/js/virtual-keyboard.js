class Key {
  constructor(keycode, symbol1, symbol2) {
    this.keycode = keycode;
    this.symbol1 = symbol1;
    let symbol2El = null;
    this.el = document.createElement("button");
    this.className = "key-" + keycode;
    this.el.className = this.className;

    if (symbol2) {
      this.symbol2 = symbol2;
      symbol2El = document.createElement("sup");
      symbol2El.innerText = this.symbol2;
      this.el.appendChild(symbol2El);
    }


    const symbol1El = document.createElement("span");
    symbol1El.innerText = this.symbol1;
    this.el.appendChild(symbol1El);

    this.el.addEventListener("mousedown", () => {
      this.press();
      this.hightlight();
    });

    this.el.addEventListener("mouseup", () => {
      this.release();
      this.unhightlight();
    });

  }
  setKeyboard(keyboard) {
    this.keyboard = keyboard;
  }

  press() {
    if (this.specialKey) {
      this.pressSpecial();
    } else {
      if (this.symbol2 && this.keyboard.shiftCase === 1) {
        this.insertChar(this.symbol2);
      } else {
        if (!this.symbol2 && (this.keyboard.case === 1 || this.keyboard.shiftCase === 1)) {
          this.insertChar(this.symbol1.toUpperCase());
        } else {
          this.insertChar(this.symbol1);
        }
      }
    }
  }

  insertChar(char) {
    const position = this.keyboard.textArea.selectionEnd;
    let arr = this.keyboard.textArea.value.split('');
    let firstPart = arr.splice(0, position);
    firstPart.push(char);

    this.keyboard.textArea.value = firstPart.concat(arr).join('');
    this.keyboard.textArea.selectionEnd = position + 1;
    this.keyboard.textArea.focus();
  }

  release() {}

  externalPress() {
    this.hightlight();
  }

  externalUnpress() {
    this.unhightlight();
  }

  hightlight() {
    this.el.className = this.className + " selected";
  }

  unhightlight() {
    setTimeout(() => {
      this.el.className = this.className;

    }, 200);
  }

}

class SpecialKey extends Key {
  constructor(keycode, symbol1) {
    super(keycode, symbol1);
    this.specialKey = true;
  }
}

class LetterKey extends Key {
  constructor(keycode, symbol1) {
    super(keycode, symbol1);
    this.letterKey = true;
  }
}

class TabKey extends SpecialKey {
  pressSpecial() {
    this.insertChar("\t");
  }
}

class CapsLockKey extends SpecialKey {
  pressSpecial() {
    this.keyboard.case = this.keyboard.case === 1 ? 0 : 1;
  }

  externalUnpress() {
    this.pressSpecial();
    if (this.keyboard.case) {
      this.hightlight();
    } else {
      this.unhightlight();
    }
  }
}

class DeleteKey extends SpecialKey {
  pressSpecial() {
    this.deleteChar();
  }

  deleteChar() {
    const position = this.keyboard.textArea.selectionEnd;

    if (position < this.keyboard.textArea.value.length) {
      let arr = this.keyboard.textArea.value.split('');
      arr.splice(position, 1);
      this.keyboard.textArea.value = arr.join('');
      this.keyboard.textArea.selectionEnd = position;
      this.keyboard.textArea.focus();
    }
  }
}


class BackSpaceKey extends SpecialKey {
  pressSpecial() {
    this.deleteChar();
  }

  deleteChar() {
    const position = this.keyboard.textArea.selectionEnd;
    if (position <= this.keyboard.textArea.value.length && position > 0) {
      let arr = this.keyboard.textArea.value.split('');
      arr.splice(position - 1, 1);
      this.keyboard.textArea.value = arr.join('');
      this.keyboard.textArea.selectionEnd = position;
      this.keyboard.textArea.focus();
    }
  }
}

class ShiftKey extends SpecialKey {
  pressSpecial() {
    this.keyboard.shiftCase = 1;
  }

  release() {
    this.keyboard.shiftCase = 0;
  }
}

class EnterKey extends SpecialKey {
  pressSpecial() {
    this.insertChar("\r");
  }
}

class ControlKey extends SpecialKey {
  pressSpecial() {}
}

class AltKey extends SpecialKey {
  pressSpecial() {}
}

class SpaceKey extends SpecialKey {
  pressSpecial() {
    this.insertChar(" ")
  }
}

const keyboardMapEn = [
  [new Key(192, "`", "~"), new Key(49, "1", "!"), new Key(50, "2", "@"), new Key(51, "3", "#"), new Key(52, "4", "$"), new Key(53, "5", "%"), new Key(54, "6", ":"), new Key(55, "7", "&"), new Key(56, "8", "*"), new Key(57, "9", "("), new Key(48, "0", ")"), new Key(189, "-", "_"), new Key(187, "=", "+"), new BackSpaceKey(8, "Back Space")],
  [new TabKey(9, "Tab"), new LetterKey(81, "q"), new LetterKey(87, "w"), new LetterKey(69, "e"), new LetterKey(82, "r"), new LetterKey(84, "t"), new LetterKey(89, "y"), new LetterKey(85, "u"), new LetterKey(73, "i"), new LetterKey(79, "o"), new LetterKey(80, "p"), new LetterKey(219, "["), new LetterKey(221, "]"), new Key(220, "\\", "/"), new DeleteKey(46, "Del")],
  [new CapsLockKey(20, "CapsLock"), new LetterKey(65, "a"), new LetterKey(83, "s"), new LetterKey(68, "d"), new LetterKey(70, "f"), new LetterKey(71, "g"), new LetterKey(72, "h"), new LetterKey(74, "j"), new LetterKey(75, "k"), new LetterKey(76, "l"), new LetterKey(186, ";"), new LetterKey(222, "'"), new EnterKey(13, "Enter")],
  [new ShiftKey(16, "Shift"), new LetterKey(226, "\\"), new LetterKey(90, "z"), new LetterKey(88, "x"), new LetterKey(67, "c"), new LetterKey(86, "v"), new LetterKey(66, "b"), new LetterKey(78, "n"), new LetterKey(77, "m"), new LetterKey(190, "."), new LetterKey(188, ","), new LetterKey(191, "/"), new LetterKey(38, "▲"), new ShiftKey(16, "Shift")],
  [new ControlKey(17, "Ctrl"), new SpecialKey(91, "Win"), new AltKey(18, "Alt"), new LetterKey(32, " "), new AltKey(18, "Alt"), new ControlKey(17, "Ctrl"), new LetterKey(37, "◄"), new LetterKey(40, "▼"), new LetterKey(39, "►")]
]

const keyboardMapPt = [
  [new Key(192, "\'", "\""), new Key(49, "1", "!"), new Key(50, "2", "@"), new Key(51, "3", "#"), new Key(52, "4", "$"), new Key(53, "5", "%"), new Key(54, "6", ":"), new Key(55, "7", "&"), new Key(56, "8", "*"), new Key(57, "9", "("), new Key(48, "0", ")"), new Key(189, "-", "_"), new Key(187, "=", "+"), new BackSpaceKey(8, "Back Space")],
  [new TabKey(9, "Tab"), new LetterKey(81, "q"), new LetterKey(87, "w"), new LetterKey(69, "e"), new LetterKey(82, "r"), new LetterKey(84, "t"), new LetterKey(89, "y"), new LetterKey(85, "u"), new LetterKey(73, "i"), new LetterKey(79, "o"), new LetterKey(80, "p"), new LetterKey(219, "["), new LetterKey(221, "]"), new Key(220, "\\", "/"), new DeleteKey(46, "Del")],
  [new CapsLockKey(20, "Fixa"), new LetterKey(65, "a"), new LetterKey(83, "s"), new LetterKey(68, "d"), new LetterKey(70, "f"), new LetterKey(71, "g"), new LetterKey(72, "h"), new LetterKey(74, "j"), new LetterKey(75, "k"), new LetterKey(76, "l"), new LetterKey(186, "ç"), new Key(222, "~", "^"), new Key(220, "]", "}"), new EnterKey(13, "Enter")],
  [new ShiftKey(16, "Shift"), new Key(226, "\\", "|"), new LetterKey(90, "z"), new LetterKey(88, "x"), new LetterKey(67, "c"), new LetterKey(86, "v"), new LetterKey(66, "b"), new LetterKey(78, "n"), new LetterKey(77, "m"), new Key(190, ",", "<"), new Key(188, ".", ">"), new Key(191, ";", ":"), new Key(193, "/", "?"), new LetterKey(38, "▲"), new ShiftKey(16, "Shift")],
  [new ControlKey(17, "Ctrl"), new SpecialKey(91, "Win"), new AltKey(18, "Alt"), new LetterKey(32, " "), new AltKey(18, "Alt"), new ControlKey(17, "Ctrl"), new LetterKey(37, "◄"), new LetterKey(40, "▼"), new LetterKey(39, "►")]
]

class Keyboard {
  constructor() {
    this.case = 0;
    this.shiftCase = 0;
    this.combKey1 = false;
    this.combKey2 = false;
    this.className = "keyboard";

    const storagedLanguage = localStorage.getItem("keyboardLanguage");

    if (storagedLanguage === "en" || !storagedLanguage) {
      this.language = keyboardMapEn;
    } else {
      this.language = keyboardMapPt;
    }

    document.addEventListener("DOMContentLoaded", () => {
      this.createKeyboard();
    });

    document.addEventListener("keydown", (e) => {
      this.hightlightKey(e.keyCode);
      this.textArea.focus();

      this.combKey1 = e.keyCode === 17 || this.combKey1;
      this.combKey2 = e.keyCode === 18 || this.combKey2;

      if (this.combKey1 && this.combKey2) {
        this.switchLanguage();
      }
    });

    document.addEventListener("keyup", (e) => {
      this.unhightlightKey(e.keyCode);

      this.combKey1 = this.combKey1 && e.keyCode === 17 ? false : this.combKey1;
      this.combKey2 = this.combKey2 && e.keyCode === 17 ? false : this.combKey2;
    })
  }

  switchLanguage() {
    if (this.language === keyboardMapEn) {
      this.language = keyboardMapPt;
      localStorage.setItem("keyboardLanguage", "pt")
    } else {
      this.language = keyboardMapEn;
      localStorage.setItem("keyboardLanguage", "en")
    }

    this.keyboardDOM.innerHTML = "";
    this.text = this.textArea.value;
    this.selectionPos = this.textArea.selectionEnd;
    this.createKeyboard();
  }

  hightlightKey(keycode) {
    let selectedKey = this.selectKeyByKeyCode(keycode);
    if (selectedKey) {
      selectedKey.externalPress();
    }
  }

  unhightlightKey(keycode) {
    let selectedKey = this.selectKeyByKeyCode(keycode);

    if (selectedKey) {
      selectedKey.externalUnpress();
    }
  }

  setClassName() {}

  selectKeyByKeyCode(keycode) {
    let selectedKey = null;

    this.keyboardMap.forEach(line => {
      if (!selectedKey) {
        selectedKey = line.find(el => el.keycode === keycode);
      }
    });

    return selectedKey;
  }

  createTextArea() {
    this.textArea = document.createElement("textarea");
    if(this.text) {
      this.textArea.value = this.text;
      this.textArea.selectionEnd = this.selectionPos;
    }
    this.keyboardDOM.appendChild(this.textArea);
  }

  createKeyboard() {
    if (!this.keyboardDOM) {
      this.keyboardDOM = document.createElement("div");
      const messageDOM = document.createElement("div");
      messageDOM.className = "message";
      messageDOM.innerText = "Press \"ctrl + alt\" to alternate languages, English and Potruguese.";
      document.body.appendChild(this.keyboardDOM);
      document.body.appendChild(messageDOM);
    }

    let newClassName = this.className;

    if (this.language === keyboardMapEn) {
      newClassName += " en";
    } else {
      newClassName += " pt";
    }

    this.keyboardDOM.className = newClassName;

    this.createTextArea();
    this.createKeys(this.language);
  }

  createKeys(keyboardMap) {
    this.keyboardMap = keyboardMap;

    keyboardMap.forEach((el, i) => {
      const line = document.createElement("div");
      this.keyboardDOM.appendChild(line);

      el.forEach(key => {
        line.appendChild(key.el);
        key.setKeyboard(this);
      });
    });
  }
}

const keyboard = new Keyboard();