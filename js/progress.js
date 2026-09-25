(function (global) {
  "use strict";

  function emptyState() {
    return {
      version: 1,
      started: false,
      activeTopic: "",
      currentId: "",
      currentByTopic: {},
      completed: {},
      medals: [],
      totalStars: 0,
      sound: true
    };
  }

  function Progress(storage, data) {
    this.storage = storage;
    this.data = data;
    this.state = emptyState();
    this.load();
  }

  Progress.prototype.load = function () {
    var saved = this.storage.read();
    if (saved && saved.version === 1) {
      this.state = Object.assign(emptyState(), saved);
    }
  };

  Progress.prototype.save = function () {
    this.storage.write(this.state);
  };

  Progress.prototype.reset = function () {
    var sound = this.state.sound;
    this.state = emptyState();
    this.state.sound = sound;
    this.save();
  };

  Progress.prototype.hasProgress = function () {
    return this.state.started && Object.keys(this.state.completed).length > 0;
  };

  Progress.prototype.defaultTopic = function () {
    var topics = this.data.topics || [];
    for (var i = 0; i < topics.length; i += 1) {
      if (topics[i].available && !topics[i].href) return topics[i].id;
    }
    return "";
  };

  Progress.prototype.trail = function () {
    var topic = this.state.activeTopic || this.defaultTopic();
    if (this.data.maps && this.data.maps[topic]) return this.data.maps[topic];
    return this.data.map || [];
  };

  Progress.prototype.useTopic = function (topicId) {
    this.state.activeTopic = topicId;
    this.state.started = true;
    var ids = this.exerciseIds();
    if (!this.state.currentByTopic[topicId]) {
      this.state.currentByTopic[topicId] = ids[0] || "";
    }
    this.state.currentId = this.state.currentByTopic[topicId];
    this.save();
  };

  Progress.prototype.exerciseIds = function () {
    return this.trail()
      .filter(function (node) {
        return !node.kind;
      })
      .map(function (node) {
        return node.id;
      });
  };

  Progress.prototype.isCompleted = function (id) {
    return Boolean(this.state.completed[id]);
  };

  Progress.prototype.starsFor = function (id) {
    var rec = this.state.completed[id];
    return rec ? rec.stars : 0;
  };

  Progress.prototype.firstOpenId = function () {
    var ids = this.exerciseIds();
    for (var i = 0; i < ids.length; i += 1) {
      if (!this.isCompleted(ids[i])) return ids[i];
    }
    return "finish";
  };

  Progress.prototype.isUnlocked = function (id) {
    if (id === "start") return true;
    if (id === "finish") {
      return this.exerciseIds().every(this.isCompleted.bind(this));
    }
    var ids = this.exerciseIds();
    var index = ids.indexOf(id);
    if (index <= 0) return true;
    return this.isCompleted(ids[index - 1]);
  };

  Progress.prototype.complete = function (id, stars, mistakes) {
    var prev = this.state.completed[id];
    var best = prev && prev.stars > stars ? prev.stars : stars;
    var prevStars = prev ? prev.stars : 0;
    this.state.completed[id] = {
      stars: best,
      mistakes: mistakes
    };
    this.state.totalStars = this.state.totalStars - prevStars + best;
    this.state.started = true;
    var topic = this.state.activeTopic || this.defaultTopic();
    var ids = this.exerciseIds();
    var index = ids.indexOf(id);
    if (index >= 0 && index < ids.length - 1) {
      this.state.currentId = ids[index + 1];
    } else {
      this.state.currentId = "finish";
    }
    if (topic) this.state.currentByTopic[topic] = this.state.currentId;
    this.save();
    return best;
  };

  Progress.prototype.awardMedal = function (medalId) {
    if (this.state.medals.indexOf(medalId) !== -1) return false;
    this.state.medals.push(medalId);
    this.save();
    return true;
  };

  Progress.prototype.hasMedal = function (medalId) {
    return this.state.medals.indexOf(medalId) !== -1;
  };

  global.ForestProgress = Progress;
})(window);
