(function (global) {
  "use strict";

  function shuffle(list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function normalize(text) {
    return String(text)
      .replace(/\s+/g, " ")
      .replace(/[!.?]+$/g, "")
      .trim()
      .toLowerCase()
      .replace(/ё/g, "е");
  }

  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    var left = a.slice().sort();
    var right = b.slice().sort();
    for (var i = 0; i < left.length; i += 1) {
      if (left[i] !== right[i]) return false;
    }
    return true;
  }

  function starsFromMistakes(mistakes, steps) {
    var room = Math.max(1, Math.floor((steps || 1) / 2));
    if (mistakes <= 0) return 3;
    if (mistakes <= room) return 2;
    return 1;
  }

  function Game(data, progress) {
    this.data = data;
    this.progress = progress;
    this.currentId = null;
    this.mistakes = 0;
    this.hintLevel = 0;
  }

  Game.prototype.exercise = function (id) {
    if (id === "bonus_challenge") {
      return {
        type: "quiz", title: "Проверь себя", count: 8,
        pool: this.data.finalChallengePool,
        owl: "Восемь случайных вопросов после пройденной тропы.",
        hint: "Вспомни изученные правила.",
        success: "Дополнительная проверка пройдена!"
      };
    }
    return this.data.exercises[id];
  };

  Game.prototype.begin = function (id) {
    this.currentId = id;
    this.mistakes = 0;
    this.hintLevel = 0;
    var exercise = this.exercise(id);
    this.steps = null;
    if (exercise && exercise.type === "quiz") {
      var count = exercise.count || exercise.pool.length;
      this.steps = shuffle(exercise.pool.slice()).slice(0, count);
    } else if (exercise && (exercise.type === "multiStep" || exercise.type === "rounds")) {
      this.steps = exercise.steps || exercise.rounds;
    }
    return exercise;
  };

  Game.prototype.currentSteps = function () {
    return this.steps || null;
  };

  Game.prototype.stepCount = function (exercise) {
    if (!exercise) return 1;
    if (exercise.type === "rounds") return exercise.rounds.length;
    if (exercise.type === "multiStep") return exercise.steps.length;
    if (exercise.type === "quiz") return exercise.count || (exercise.pool ? exercise.pool.length : 1);
    return 1;
  };

  Game.prototype.isFinishedStep = function (exercise, stepIndex) {
    return stepIndex >= this.stepCount(exercise) - 1;
  };

  Game.prototype.registerMistake = function () {
    this.mistakes += 1;
    this.hintLevel = Math.min(3, this.mistakes);
    return this.hintLevel;
  };

  Game.prototype.hintText = function (exercise, parent) {
    var hint2 = exercise.hint2 || (parent && parent.hint2);
    var hint = exercise.hint || (parent && parent.hint);
    if (this.hintLevel >= 2 && hint2) return hint2;
    return hint || "Попробуй ещё раз.";
  };

  Game.prototype.completeCurrent = function () {
    var exercise = this.exercise(this.currentId);
    var steps = this.stepCount(exercise);
    var stars = starsFromMistakes(this.mistakes, steps);
    this.progress.complete(this.currentId, stars, this.mistakes);
    return stars;
  };

  Game.prototype.medalFor = function (id) {
    var medals = this.data.medals || [];
    for (var i = 0; i < medals.length; i += 1) {
      if (medals[i].afterId === id) return medals[i];
    }
    return null;
  };

  Game.prototype.checkSingle = function (exercise, value) {
    if (Array.isArray(exercise.answer)) {
      return exercise.answer.indexOf(value) !== -1;
    }
    return value === exercise.answer;
  };

  Game.prototype.checkSceneMultiple = function (exercise, selected) {
    var needed = exercise.answers || [];
    var extras = selected.filter(function (id) {
      return needed.indexOf(id) === -1;
    });
    if (extras.length) return { ok: false, reason: "extra" };
    if (!sameSet(selected, needed)) return { ok: false, reason: "missing" };
    return { ok: true };
  };

  Game.prototype.checkBuild = function (exercise, words) {
    var built = words.join(" ") + ".";
    var answers = exercise.answers || [];
    var builtNorm = normalize(built);
    for (var i = 0; i < answers.length; i += 1) {
      if (normalize(answers[i]) === builtNorm) return true;
    }
    return false;
  };

  Game.prototype.nextExpectedWord = function (exercise, chosen) {
    var target = (exercise.answers && exercise.answers[0]) || "";
    var expected = normalize(target).split(" ");
    return expected[chosen.length] || "";
  };

  Game.prototype.neededTexts = function (exercise) {
    if (exercise.answers && exercise.answers.length) return exercise.answers.slice();
    return (exercise.tokens || [])
      .filter(function (token) {
        return token.role === "secondary" || token.role === "synonym";
      })
      .map(function (token) {
        return token.text;
      });
  };

  Game.prototype.checkMultiple = function (exercise, selected) {
    var needed = this.neededTexts(exercise);
    var extras = selected.filter(function (text) {
      return needed.indexOf(text) === -1;
    });
    if (extras.length) {
      return { ok: false, reason: "main" };
    }
    if (!sameSet(selected, needed)) {
      return { ok: false, reason: "missing" };
    }
    return { ok: true };
  };

  Game.prototype.checkPairs = function (exercise, chosen) {
    var pairs = exercise.pairs;
    var keys = Object.keys(pairs);
    if (Object.keys(chosen).length !== keys.length) return false;
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      if (chosen[key] !== pairs[key]) return false;
    }
    return true;
  };

  Game.prototype.checkClass = function (exercise, placed) {
    for (var i = 0; i < exercise.items.length; i += 1) {
      var item = exercise.items[i];
      var allowed = item.groups || [item.group];
      if (allowed.indexOf(placed[item.id]) === -1) return false;
    }
    return true;
  };

  Game.prototype.canPlace = function (item, groupId) {
    return (item.groups || [item.group]).indexOf(groupId) !== -1;
  };

  Game.prototype.checkSoundSequence = function (exercise, chosen) {
    return sameSet(chosen.map(function (sound, index) { return index + ":" + sound; }),
      exercise.sounds.map(function (sound, index) { return index + ":" + sound; }));
  };

  Game.prototype.swapSound = function (exercise, replacement) {
    var letters = exercise.word.split("");
    letters[exercise.position] = replacement;
    return letters.join("");
  };

  Game.prototype.checkAlphabetOrder = function (exercise, chosen) {
    return chosen.length === exercise.answer.length && chosen.every(function (value, index) {
      return value === exercise.answer[index];
    });
  };

  Game.prototype.alphabetCompare = function (left, right) {
    var alphabet = this.data.alphabet;
    var a = String(left).toUpperCase();
    var b = String(right).toUpperCase();
    for (var i = 0; i < Math.min(a.length, b.length); i += 1) {
      var diff = alphabet.indexOf(a[i]) - alphabet.indexOf(b[i]);
      if (diff) return diff;
    }
    return a.length - b.length;
  };

  Game.prototype.splitBoundaries = function (exercise) {
    var total = 0;
    return exercise.words.slice(0, -1).map(function (word) {
      total += word.length;
      return total;
    });
  };

  Game.prototype.checkSplit = function (exercise, boundaries) {
    return sameSet(boundaries, this.splitBoundaries(exercise));
  };

  Game.prototype.checkCapitals = function (exercise, selected) {
    return sameSet(selected, exercise.capitals);
  };

  Game.prototype.checkWordFamily = function (exercise, selected) {
    return this.checkMultiple(exercise, selected);
  };

  Game.prototype.checkWordPart = function (exercise, start, end) {
    var answer = exercise.answer;
    if (!answer || answer.length < 2) return false;
    var lo = Math.min(Number(start), Number(end));
    var hi = Math.max(Number(start), Number(end));
    return lo === Number(answer[0]) && hi === Number(answer[1]);
  };

  Game.prototype.relationKind = function (left, right) {
    var list = this.data.relations || [];
    var a = normalize(left);
    var b = normalize(right);
    for (var i = 0; i < list.length; i += 1) {
      var ra = normalize(list[i].a);
      var rb = normalize(list[i].b);
      if ((ra === a && rb === b) || (ra === b && rb === a)) return list[i].kind;
    }
    return "";
  };

  Game.prototype.lemmaId = function (word) {
    var list = this.data.words || [];
    var wanted = normalize(word);
    for (var i = 0; i < list.length; i += 1) {
      if (normalize(list[i].word) === wanted) return list[i].lemmaId || "";
    }
    return "";
  };

  Game.prototype.checkRelation = function (relation, question) {
    return normalize(question) === normalize(relation.question);
  };

  Game.prototype.buildExpanded = function (exercise, placedIds) {
    var layout = exercise.layout;
    var parts = [];
    if (layout && layout.length) {
      layout.forEach(function (piece) {
        if (piece.extraIndex === undefined || placedIds.indexOf(piece.extraIndex) !== -1) {
          parts.push(piece.text);
        }
      });
    } else {
      parts = exercise.base.slice();
    }
    if (!parts.length) return "";
    var first = parts[0];
    parts[0] = first.charAt(0).toUpperCase() + first.slice(1);
    return parts.join(" ") + ".";
  };

  Game.prototype.checkExpand = function (exercise, placedIds) {
    if (placedIds.length !== exercise.extra.length) return false;
    var built = this.buildExpanded(exercise, placedIds);
    var answers = exercise.answers || [exercise.result];
    var builtNorm = normalize(built);
    return answers.some(function (answer) {
      return normalize(answer) === builtNorm;
    });
  };

  Game.shuffle = shuffle;
  Game.normalize = normalize;
  Game.starsFromMistakes = starsFromMistakes;

  global.ForestGame = Game;
})(window);
