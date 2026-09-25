(function (global) {
  "use strict";

  function StorageBox(key) {
    this.key = key;
  }

  StorageBox.prototype.read = function () {
    try {
      var raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  };

  StorageBox.prototype.write = function (value) {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  };

  StorageBox.prototype.clear = function () {
    try {
      localStorage.removeItem(this.key);
    } catch (err) {
      /* ignore */
    }
  };

  global.ForestStorage = StorageBox;
})(window);
