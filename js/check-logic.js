/** Run with: node js/check-logic.js */
const fs = require("fs");
const vm = require("vm");
const assert = require("assert");
const path = require("path");
const root = path.resolve(__dirname, "..");
const context = {};
context.window = context;
for (const file of ["data/content.js", "js/game.js", "js/progress.js", "js/renderer.js"]) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const data = context.window.FOREST_DATA;
const game = new context.window.ForestGame(data, { state: { sound: true } });
const renderer = new context.window.ForestRenderer({}, game);
const ids = Array.from(data.maps.sounds.filter(node => !node.kind), node => node.id);
assert.strictEqual(ids.length, 18);
assert.strictEqual(new Set(ids).size, 18);
assert.deepStrictEqual(ids.slice(0, 6), ["sound_01", "sound_02", "sound_03", "sound_04", "sound_05", "sound_06"]);
assert.strictEqual(data.exercises.final_18.rounds.length, 12);
assert(data.finalChallengePool.length >= 8);
for (const id of ids) assert(data.exercises[id], `missing exercise ${id}`);
assert.deepStrictEqual(Object.keys(data.exercises).sort(), ids.slice().sort());
assert.notStrictEqual(data.storageKey, "forestGrammarProgress");
assert.notStrictEqual(data.storageKey, "forestWordMeaningProgress");

function steps(exercise) {
  return exercise.rounds || exercise.steps || [exercise];
}
function walk(value, callback) {
  if (!value || typeof value !== "object") return;
  for (const [key, entry] of Object.entries(value)) {
    if (key === "scene" && typeof entry === "string") callback(entry);
    else walk(entry, callback);
  }
}
for (const id of ids) {
  const ex = data.exercises[id];
  assert(ex.title && ex.type, `incomplete ${id}`);
  for (const step of steps(ex)) {
    assert(step.type, `missing step type ${id}`);
    renderer.parentExercise = ex;
    renderer.view = {};
    const html = renderer.renderByType(step);
    assert(html.includes("<h1>") && !html.includes("Неизвестный тип"), `${id}: rendered ${step.type}`);
    if (step.type === "soundSequence") {
      assert(game.checkSoundSequence(step, step.sounds), `${id}: right sounds`);
      assert(!game.checkSoundSequence(step, step.sounds.concat(step.distractors[0])), `${id}: extra sound`);
    }
    if (step.type === "alphabetOrder") {
      assert(game.checkAlphabetOrder(step, step.answer), `${id}: order`);
      assert(!game.checkAlphabetOrder(step, step.answer.slice().reverse()), `${id}: wrong order`);
      for (let i = 1; i < step.answer.length; i += 1) {
        assert(game.alphabetCompare(step.answer[i - 1], step.answer[i]) < 0, `${id}: answer follows alphabet`);
      }
    }
    if (step.type === "splitText") {
      assert.strictEqual(step.words.join("").toUpperCase(), step.raw, `${id}: boundaries reproduce raw`);
      assert(game.checkSplit(step, game.splitBoundaries(step)), `${id}: word breaks`);
      assert(game.checkCapitals(step, step.capitals), `${id}: capitals`);
      assert(!game.checkCapitals(step, []), `${id}: missing capitals`);
    }
    if (step.type === "singleChoice") assert(step.options.includes(step.answer), `${id}: answer in options`);
    if (step.type === "soundSwap") assert.strictEqual(game.swapSound(step, step.answer), step.target, `${id}: swap`);
  }
  walk(ex, scene => assert(fs.existsSync(path.join(root, "assets", "scenes", scene + ".jpg")), `${id}: missing ${scene}.jpg`));
}
for (const step of data.finalChallengePool) {
  renderer.parentExercise = game.exercise("bonus_challenge");
  renderer.view = {};
  assert(renderer.renderByType(step).includes("<h1>"), "bonus question renders");
}

assert.strictEqual(data.alphabet.length, 33);
assert.strictEqual(new Set(data.alphabet).size, 33);
assert.strictEqual(data.alphabet.indexOf("Ё"), data.alphabet.indexOf("Е") + 1);
assert.strictEqual(data.alphabet.indexOf("Й"), data.alphabet.indexOf("И") + 1);
assert(!data.vowels.includes("Ъ") && !data.vowels.includes("Ь"));
for (const [left, right] of [["девочка", "дежурный"], ["дежурный", "деревня"], ["пальто", "пенал"], ["пенал", "петух"], ["яблоко", "ягода"], ["ягода", "язык"], ["изморозь", "изморось"]]) {
  assert(game.alphabetCompare(left, right) < 0, `${left} < ${right}`);
}
assert(game.canPlace(data.exercises.capital_16.items[1], "cities"));
assert(game.canPlace(data.exercises.capital_16.items[1], "names"));
assert(!game.canPlace(data.exercises.capital_16.items[1], "surnames"));
assert.strictEqual(data.exercises.capital_17.rounds[1].words[1], "Марта");
assert.strictEqual(data.exercises.capital_17.rounds[1].words.at(-1), "марта");
assert.strictEqual(data.exercises.capital_17.rounds[2].words[1], "Скворцов");
assert.strictEqual(data.exercises.capital_17.rounds[2].words.at(-1), "скворцов");

const progress = new context.window.ForestProgress({ read: () => null, write: () => true }, data);
progress.useTopic("sounds");
assert.strictEqual(progress.firstOpenId(), "sound_01");
ids.slice(0, -1).forEach(id => progress.complete(id, 3, 0));
assert.strictEqual(progress.firstOpenId(), "final_18");
progress.complete("final_18", 3, 0);
assert.strictEqual(progress.firstOpenId(), "finish");
console.log(`OK ${ids.length} exercises`);
