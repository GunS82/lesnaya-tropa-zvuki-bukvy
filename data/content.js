/** Третья лесная тропа: звуки, буквы и алфавит (2 класс, ч. 1, с. 78–87). */
(function () {
  "use strict";
  var alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("");
  var vowels = "АЕЁИОУЫЭЮЯ".split("");
  var letters = ["А", "Б", "Ё", "Ш", "Ы", "Ф", "Ъ", "Ь", "Ю"];
  var letterGroups = letters.map(function (letter, i) {
    return { id: "letter-" + i, text: letter, group: "ЪЬ".indexOf(letter) >= 0 ? "sign" : vowels.indexOf(letter) >= 0 ? "vowel" : "consonant" };
  });
  function choice(question, options, answer, extra) {
    var step = { type: "singleChoice", question: question, options: options, answer: answer };
    return Object.assign(step, extra || {});
  }
  function order(items, answer, question) {
    return { type: "alphabetOrder", question: question || "Нажми карточки в порядке алфавита.", items: items, answer: answer, showAlphabet: true };
  }
  var names = [
    { id: "moscow", text: "Москва", scene: "moscow", group: "cities" },
    { id: "vladimir", text: "Владимир", groups: ["names", "cities"] },
    { id: "pushkin", text: "Пушкин", group: "surnames" },
    { id: "marshak", text: "Маршак", group: "surnames" },
    { id: "tomsk", text: "Томск", scene: "tomsk", group: "cities" },
    { id: "aibolit", text: "Айболит", scene: "doctor-aibolit", group: "heroes" },
    { id: "tatiana", text: "Татьяна", group: "names" },
    { id: "thumbelina", text: "Дюймовочка", scene: "thumbelina", group: "heroes" },
    { id: "andersen", text: "Андерсен", group: "surnames" },
    { id: "sergey", text: "Сергей", group: "names" },
    { id: "yaroslavl", text: "Ярославль", scene: "yaroslavl", group: "cities" },
    { id: "chukovsky", text: "Чуковский", group: "surnames" },
    { id: "andrey", text: "Андрей", group: "names" },
    { id: "neznaika", text: "Незнайка", scene: "neznaika", group: "heroes" }
  ];
  var soundSteps = [
    { type: "soundSequence", word: "шар", written: "шар", letters: ["ш", "а", "р"], sounds: ["ш", "а", "р"], distractors: ["ф", "о"], scene: "ball", question: "Произнеси «шар» и нажми его звуки по порядку." },
    { type: "soundSequence", word: "шарф", written: "шарф", letters: ["ш", "а", "р", "ф"], sounds: ["ш", "а", "р", "ф"], distractors: ["о", "л"], scene: "scarf", question: "Какой звук добавился в слове «шарф»? Собери всю цепочку." },
    { type: "soundSequence", word: "лодка", written: "лодка", letters: ["л", "о", "д", "к", "а"], sounds: ["л", "о", "т", "к", "а"], distractors: ["д", "ш"], scene: "boat", question: "Произнеси «лодка». Какой звук слышен перед [к]?", note: "Пишем Д, а перед К слышим [т]." },
    { type: "soundSequence", word: "ложка", written: "ложка", letters: ["л", "о", "ж", "к", "а"], sounds: ["л", "о", "ш", "к", "а"], distractors: ["ж", "т"], scene: "spoon", question: "Произнеси «ложка». Какой звук слышен перед [к]?", note: "Пишем Ж, а перед К слышим [ш]." }
  ];
  var alphabetGapSteps = [
    { type: "alphabetGap", before: "АБВ", after: "Д", answer: "Г", options: ["Г", "Е", "Ж"], question: "Какая буква пропала?" },
    { type: "alphabetGap", before: "ЖЗ", after: "Й", answer: "И", options: ["И", "Ы", "К"], question: "Какая буква стоит после З?" },
    { type: "alphabetGap", before: "ШЩ", after: "ЫЬ", answer: "Ъ", options: ["Ъ", "Ь", "Э"], question: "Какая буква стоит после Щ?" },
    { type: "alphabetGap", before: "Ь", after: "ЮЯ", answer: "Э", options: ["Э", "Е", "Ы"], question: "Какая буква стоит между Ь и Ю?" }
  ];
  var alphabetBefore = [
    choice("Какая буква раньше: З или С?", ["З", "С"], "З", { showAlphabet: true }),
    choice("Какая буква раньше: В или Д?", ["В", "Д"], "В", { showAlphabet: true }),
    choice("Какая буква раньше: М или Н?", ["М", "Н"], "М", { showAlphabet: true }),
    choice("Какая буква раньше: П или Р?", ["П", "Р"], "П", { showAlphabet: true }),
    choice("Какая буква раньше: Э или Ю?", ["Э", "Ю"], "Э", { showAlphabet: true }),
    choice("Что раньше в словаре? Сравни седьмую букву.", ["изморозь", "изморось"], "изморозь", { showAlphabet: true })
  ];
  var capitalWhy = [
    choice("Почему «Москва» начинается с большой буквы?", ["название города", "начало предложения", "просто красиво"], "название города"),
    choice("Почему «Вася» начинается с большой буквы?", ["имя человека", "название города", "начало предложения"], "имя человека"),
    choice("Почему «Пушкин» начинается с большой буквы?", ["фамилия", "название месяца", "начало предложения"], "фамилия"),
    choice("Почему «Дюймовочка» начинается с большой буквы?", ["имя персонажа", "название предмета", "начало предложения"], "имя персонажа"),
    choice("Почему «Осенью» начинается с большой буквы в «Осенью выпал первый снег.»?", ["начало предложения", "имя человека", "название города"], "начало предложения")
  ];
  var splitRounds = [
    { type: "splitText", raw: "МАЛЬЧИКВАСЯМУРАВЬЁВСТРОИТДОМДЛЯМУРАВЬЁВ", words: ["Мальчик", "Вася", "Муравьёв", "строит", "дом", "для", "муравьёв"], capitals: [0, 1, 2], question: "Раздели строку на слова, затем отметь слова с большой буквы.", scene: "ant-house" },
    { type: "splitText", raw: "НАШАМАРТАВЕРНУЛАСЬИЗМОСКВЫВКОНЦЕМАРТА", words: ["Наша", "Марта", "вернулась", "из", "Москвы", "в", "конце", "марта"], capitals: [0, 1, 4], question: "Где границы слов? Почему «Марта» и «марта» пишутся по-разному?", scene: "march-spring" },
    { type: "splitText", raw: "ЛЁВАСКВОРЦОВСДЕЛАЛДОМДЛЯСКВОРЦОВ", words: ["Лёва", "Скворцов", "сделал", "дом", "для", "скворцов"], capitals: [0, 1], question: "Раздели слова и найди имя, фамилию и название птиц.", scene: "birdhouse" }
  ];
  var tower = [
    choice("Что мы слышим и произносим?", ["звук", "букву", "слово на бумаге"], "звук"),
    soundSteps[0],
    { type: "soundSwap", word: "дом", position: 0, target: "сом", answer: "с", options: ["с", "к", "л"], question: "Замени первый звук, чтобы получился «сом»." },
    choice("Что идёт после Ж?", ["З", "И", "Е"], "З", { showAlphabet: true }),
    choice("Что стоит между Н и П?", ["О", "Р", "М"], "О", { showAlphabet: true }),
    order(["язык", "яблоко", "ягода"], ["яблоко", "ягода", "язык"]),
    choice("Что раньше в словаре?", ["изморозь", "изморось"], "изморозь", { showAlphabet: true }),
    choice("Какая буква сама звука не обозначает?", ["Б", "О", "Ь"], "Ь"),
    choice("Сколько букв в русском алфавите?", ["33", "32", "31"], "33"),
    choice("Как пишется название города?", ["Москва", "москва"], "Москва"),
    choice("Почему «Марта» пишется с большой буквы в «Наша Марта вернулась»?", ["это имя", "это месяц", "это начало предложения"], "это имя"),
    choice("Почему «марта» с маленькой в «в конце марта»?", ["это название месяца", "это имя", "это фамилия"], "это название месяца")
  ];
  window.FOREST_DATA = {
    title: "Лесная тропа знаний: звуки, буквы и алфавит",
    subject: "Русский язык",
    grade: "2 класс",
    storageKey: "forestSoundsAlphabetProgress",
    alphabet: alphabet,
    vowels: vowels,
    topics: [
      { id: "sounds", title: "Звуки, буквы и алфавит", subtitle: "Звук · Алфавит · Заглавная буква", available: true },
      { id: "sentence", title: "Предложение", subtitle: "Другая тропа", available: true, href: "https://guns82.github.io/lesnaya-tropa-znaniy/" },
      { id: "words", title: "Слова и их значения", subtitle: "Другая тропа", available: true, href: "https://guns82.github.io/lesnaya-tropa-slova/" }
    ],
    scenes: {
      ball: { emoji: "🎈", alt: "Воздушный шар" }, scarf: { emoji: "🧣", alt: "Шарф" },
      spoon: { emoji: "🥄", alt: "Ложка" }, boat: { emoji: "⛵", alt: "Лодка" },
      lamp: { emoji: "💡", alt: "Лампа" }, dew: { emoji: "💧", alt: "Роса на траве" },
      dictionary: { emoji: "📖", alt: "Большой словарь" }, library: { emoji: "📚", alt: "Библиотека" },
      "ant-house": { emoji: "🐜", alt: "Муравьи у домика" }, birdhouse: { emoji: "🐦", alt: "Скворечник" },
      moscow: { emoji: "🏙️", alt: "Москва: Кремль у реки" }, tomsk: { emoji: "🏘️", alt: "Томск: деревянные дома с резными окнами" },
      yaroslavl: { emoji: "🏙️", alt: "Ярославль на берегу Волги" }, thumbelina: { emoji: "🌸", alt: "Дюймовочка в цветке" },
      "doctor-aibolit": { emoji: "🩺", alt: "Доктор Айболит лечит зверей" }, neznaika: { emoji: "🎩", alt: "Незнайка в большой шляпе" },
      "march-spring": { emoji: "🌱", alt: "Весенний март: тает снег" }
    },
    medals: [
      { id: "sound-explorer", title: "Исследователь звуков", icon: "🔊", afterId: "sound_06", text: "Звук слышим и произносим. Букву видим и пишем." },
      { id: "alphabet-keeper", title: "Хранитель алфавита", icon: "🔤", afterId: "alphabet_13", text: "Ты знаешь порядок 33 букв и умеешь искать слова." },
      { id: "letter-master", title: "Мастер букв", icon: "🏆", afterId: "final_18", text: "Ты различаешь звуки и буквы и знаешь, когда нужна большая буква." }
    ],
    finish: {
      title: "Мастер букв",
      lead: "Ты прошёл лабораторию звуков, алфавитную тропу и город больших букв.",
      abilities: [
        { icon: "🔊", text: "Я различаю звуки и буквы" },
        { icon: "🔤", text: "Я знаю алфавит" },
        { icon: "📚", text: "Я умею искать слова по алфавиту" },
        { icon: "🔠", text: "Я знаю, когда нужна большая буква" }
      ],
      notes: [
        { title: "Звук", text: "Слышим и произносим. В заданиях записываем в квадратных скобках.", example: "[ш]" },
        { title: "Буква", text: "Видим, читаем, пишем и называем.", example: "Ш" },
        { title: "Алфавит", text: "В русском алфавите 33 буквы. Ъ и Ь сами звуков не обозначают." }
      ]
    },
    maps: { sounds: [
      { id: "start", title: "Старт", icon: "🏠", kind: "start" },
      { id: "zone_sound", title: "Лаборатория звуков", icon: "🔊", kind: "bridge" },
      { id: "sound_01", title: "Слышу или вижу?", icon: "👂", zone: "words" },
      { id: "sound_02", title: "Звук или буква?", icon: "🔡", zone: "words" },
      { id: "sound_03", title: "Разбери слово", icon: "🎈", zone: "words" },
      { id: "sound_04", title: "Общий звук", icon: "🔎", zone: "words" },
      { id: "sound_05", title: "Один звук изменился", icon: "🔄", zone: "words" },
      { id: "sound_06", title: "Собери слово", icon: "💡", zone: "words" },
      { id: "zone_alphabet", title: "Алфавитная тропа", icon: "🔤", kind: "bridge" },
      { id: "alphabet_07", title: "Алфавитная дорожка", icon: "🛤️", zone: "valley" },
      { id: "alphabet_08", title: "Пропавшие буквы", icon: "❓", zone: "valley" },
      { id: "alphabet_09", title: "Три домика букв", icon: "🏠", zone: "valley" },
      { id: "alphabet_10", title: "Кто раньше?", icon: "⏩", zone: "valley" },
      { id: "alphabet_11", title: "Слова по алфавиту", icon: "📚", zone: "valley" },
      { id: "alphabet_12", title: "Словарная полка", icon: "📖", zone: "valley" },
      { id: "alphabet_13", title: "Алфавитный шифр", icon: "🔐", zone: "valley" },
      { id: "zone_capital", title: "Город больших букв", icon: "🔠", kind: "bridge" },
      { id: "capital_14", title: "Большая или маленькая?", icon: "🔠", zone: "forest" },
      { id: "capital_15", title: "Почему большая?", icon: "💬", zone: "forest" },
      { id: "capital_16", title: "Разложи имена", icon: "🧺", zone: "forest" },
      { id: "capital_17", title: "Расшифруй предложение", icon: "✍️", zone: "forest" },
      { id: "final_18", title: "Башня букв", icon: "🏰", zone: "forest" },
      { id: "finish", title: "Финиш", icon: "🏆", kind: "finish" }
    ] },
    finalChallengePool: [
      choice("Как называется буква Б?", ["бэ", "б", "бе"], "бэ"),
      choice("Как называется буква Й?", ["и краткое", "йот", "и большое"], "и краткое"),
      choice("Где число букв и звуков различается?", ["гусь", "шар", "дом"], "гусь"),
      choice("Какая запись обозначает звук?", ["[м]", "М", "м"], "[м]"),
      choice("Какая буква следует за Е?", ["Ё", "Ж", "И"], "Ё"),
      choice("Какая буква следует за И?", ["Й", "К", "Ы"], "Й"),
      choice("Что раньше по алфавиту?", ["берёза", "библиотека"], "берёза"),
      choice("Где искать слово «шарф»?", ["в конце словаря", "в начале словаря"], "в конце словаря"),
      choice("Какая буква сама не обозначает звука?", ["Ъ", "Ю", "Я"], "Ъ"),
      choice("Что меняется при замене [д] на [с] в «дом»?", ["получается «сом»", "получается «дым»"], "получается «сом»")
    ],
    exercises: {
      sound_01: { type: "classification", title: "Слышу или вижу?", question: "Разложи звуки и буквы по домикам.", owl: "Квадратные скобки показывают звук.", groups: [{ id: "sound", title: "👂 СЛЫШУ" }, { id: "letter", title: "✏️ ВИЖУ И ПИШУ" }], items: ["[м]", "М", "[а]", "А", "[ш]", "Ш"].map(function (s, i) { return { id: "symbol-" + i, text: s, group: s[0] === "[" ? "sound" : "letter" }; }), hint: "Звуки заключены в квадратные скобки.", hint2: "[м], [а], [ш] — звуки. М, А, Ш — буквы.", success: "Звуки произносим и слышим. Буквы видим, пишем, читаем и называем." },
      sound_02: { type: "rounds", title: "Звук или буква?", owl: "Смотри на квадратные скобки.", hint: "В квадратных скобках записан звук.", success: "Ты различаешь звук и букву.", rounds: ["[р]", "Р", "[а]", "А", "[ш]", "Ш", "[л]", "Л", "[о]", "О"].map(function (s) { return choice("Что перед тобой: " + s + "?", ["ЗВУК", "БУКВА"], s[0] === "[" ? "ЗВУК" : "БУКВА", { prompt: s }); }) },
      sound_03: { type: "rounds", title: "Разбери слово на звуки", owl: "Сначала произнеси слово медленно.", hint: "Начни с первого звука слова.", hint2: "Нажимай звуки по порядку, без лишних.", success: "Ты собрал звуковые цепочки.", rounds: soundSteps },
      sound_04: { type: "rounds", title: "Найди общий звук", owl: "Произнеси оба слова.", hint: "Слушай звук, который есть в обоих словах.", success: "Общий звук найден.", rounds: [
        { type: "findSounds", gallery: ["ball", "scarf"], question: "Какой звук есть в «шар» и «шарф»?", options: ["[ш]", "[л]", "[ф]", "[о]"], answers: ["[ш]"] },
        { type: "findSounds", gallery: ["spoon", "boat"], question: "Какие звуки есть и в «ложка», и в «лодка»?", options: ["[л]", "[к]", "[ш]", "[д]"], answers: ["[л]", "[к]"] }
      ] },
      sound_05: { type: "rounds", title: "Один звук меняет слово", owl: "Посмотри, как меняется слово.", hint: "Замени только указанный звук.", success: "Изменили один звук — получилось другое слово.", rounds: [
        { type: "soundSwap", word: "дом", position: 0, target: "сом", answer: "с", options: ["с", "к", "л"], question: "Замени [д], чтобы получилось «сом»." },
        { type: "soundSwap", word: "дом", position: 0, target: "ком", answer: "к", options: ["к", "с", "л"], question: "Замени [д], чтобы получилось «ком»." },
        { type: "soundSwap", word: "дом", position: 0, target: "лом", answer: "л", options: ["л", "к", "с"], question: "Замени [д], чтобы получилось «лом»." },
        { type: "soundSwap", word: "дым", position: 1, target: "дом", answer: "о", options: ["о", "а", "е"], question: "Замени [ы], чтобы получилось «дом»." },
        choice("Что произошло при переходе от «кот» к «крот»?", ["добавился звук [р]", "заменился звук [к]", "исчез звук [т]"], "добавился звук [р]")
      ] },
      sound_06: { type: "rounds", title: "Собери слово из звуков", owl: "Нажми «Произнести быстро», затем выбери картинку.", hint: "Соедини звуки в одно слово.", success: "Мы слышим звуки, а записываем слово буквами.", rounds: [
        { type: "soundBlend", sounds: ["л", "а", "м", "п", "а"], word: "лампа", question: "Какое слово получилось?", options: [{ id: "лампа", scene: "lamp", label: "лампа" }, { id: "ложка", scene: "spoon", label: "ложка" }, { id: "лодка", scene: "boat", label: "лодка" }], answer: "лампа" },
        { type: "soundBlend", sounds: ["р", "а", "с", "а"], word: "роса", question: "Какое слово слышишь?", options: [{ id: "роса", scene: "dew", label: "роса" }, { id: "лампа", scene: "lamp", label: "лампа" }, { id: "ложка", scene: "spoon", label: "ложка" }], answer: "роса", note: "Слышим [раса], а пишем «роса». Звуковая и буквенная запись различаются." }
      ] },
      alphabet_07: { type: "rounds", title: "Алфавитная дорожка", owl: "Буквы идут в определённом порядке.", hint: "Посмотри на соседние буквы в алфавите.", success: "Ты знаешь соседей букв.", rounds: alphabetGapSteps },
      alphabet_08: { type: "alphabetFill", title: "Какие буквы пропали?", question: "Вставь девять гласных букв на свои места.", owl: "Буквы идут по порядку. Одна гласная уже открыта: У.", missing: ["А", "Е", "Ё", "И", "О", "Ы", "Э", "Ю", "Я"], hint: "Выбери следующую пропущенную букву в алфавите.", hint2: "Смотри на соседей пустой клетки.", success: "В русском алфавите 33 буквы: 10 букв для гласных, 21 для согласных, Ъ и Ь сами звуков не обозначают." },
      alphabet_09: { type: "classification", title: "Три домика букв", question: "Разложи буквы по трём домикам.", owl: "Ъ и Ь сами звуков не обозначают.", groups: [{ id: "vowel", title: "Гласные" }, { id: "consonant", title: "Согласные" }, { id: "sign", title: "Звука не обозначают" }], items: letterGroups, hint: "А, Ё, Ы, Ю — буквы для гласных звуков.", hint2: "Б, Ш, Ф — согласные. Ъ и Ь — знаки.", success: "Гласные, согласные и знаки разложены верно." },
      alphabet_10: { type: "rounds", title: "Кто раньше?", owl: "Если первые буквы одинаковые, сравни следующие.", hint: "Посмотри на алфавитную ленту.", success: "Ты сравнил буквы и слова по алфавиту.", rounds: alphabetBefore },
      alphabet_11: { type: "rounds", title: "Расставь слова по алфавиту", owl: "Нажми слова в нужном порядке.", hint: "Если начало совпадает, сравни следующую букву.", success: "Слова расставлены по алфавиту.", rounds: [
        order(["деревня", "девочка", "дежурный"], ["девочка", "дежурный", "деревня"]),
        order(["пенал", "пальто", "петух"], ["пальто", "пенал", "петух"]),
        order(["ягода", "язык", "яблоко"], ["яблоко", "ягода", "язык"])
      ] },
      alphabet_12: { type: "rounds", title: "Словарная полка", owl: "Словарь упорядочен по алфавиту.", hint: "Посмотри на первую букву слова.", success: "Теперь ты знаешь, как искать слово в словаре.", rounds: [
        choice("На какой полке искать слово «эскалатор»?", ["А–Д", "Е–К", "Л–Р", "С–Я"], "С–Я", { scene: "dictionary", showAlphabet: true }),
        order(["эскалатор", "изморось", "изморозь"], ["изморозь", "изморось", "эскалатор"], "Поставь словарные слова по алфавиту.")
      ] },
      alphabet_13: { type: "alphabetCipher", title: "Алфавитный шифр", question: "Разгадай шесть букв — получится название месяца.", owl: "Ориентируйся по алфавитной ленте.", hint: "Найди букву рядом с указанной.", success: "Получилось слово НОЯБРЬ!", clues: [
        { text: "После М", answer: "Н", options: ["Н", "Л", "О"] },
        { text: "Перед П", answer: "О", options: ["О", "Н", "Р"] },
        { text: "После Ю", answer: "Я", options: ["Я", "Э", "Ь"] },
        { text: "Перед В", answer: "Б", options: ["Б", "А", "Г"] },
        { text: "Между П и С", answer: "Р", options: ["Р", "Т", "О"] },
        { text: "Мягкий знак, который сам звука не обозначает", answer: "Ь", options: ["Ь", "Ъ", "Ы"] }
      ], bonus: { question: "Какие слова одинаково читаются в обе стороны?", options: ["шалаш", "топот", "комок", "дом"], answers: ["шалаш", "топот", "комок"] } },
      capital_14: { type: "matchPairs", title: "Большая или маленькая?", question: "Соедини заглавную и строчную форму одной буквы.", owl: "Это одна и та же буква в двух формах.", left: [{ id: "А", text: "А" }, { id: "Б", text: "Б" }, { id: "Д", text: "Д" }, { id: "Р", text: "Р" }], right: [{ id: "а", text: "а" }, { id: "б", text: "б" }, { id: "д", text: "д" }, { id: "р", text: "р" }], pairs: { "А": "а", "Б": "б", "Д": "д", "Р": "р" }, hint: "У каждой большой буквы есть маленькая пара.", success: "Все пары найдены." },
      capital_15: { type: "rounds", title: "Почему большая?", owl: "Большая буква нужна в начале предложения и в именах собственных.", hint: "Это имя, название или начало предложения?", success: "Ты знаешь случаи заглавной буквы.", rounds: capitalWhy },
      capital_16: { type: "classification", title: "Разложи имена", question: "Определи, что обозначают слова. «Владимир» можно положить в два домика.", owl: "Некоторые слова называют и человека, и город.", groups: [{ id: "cities", title: "Города" }, { id: "names", title: "Имена" }, { id: "surnames", title: "Фамилии" }, { id: "heroes", title: "Сказочные герои" }], items: names, hint: "Владимир бывает именем человека и названием города.", hint2: "Прочитай название каждого домика.", success: "Все имена собственные разложены верно." },
      capital_17: { type: "rounds", title: "Расшифруй предложение", owl: "Сначала расставь пробелы, затем выбери слова с большой буквы.", hint: "Ищи границу между словами. Потом найди начало предложения и имена.", success: "Большая буква помогает различать имена и обычные слова.", rounds: splitRounds },
      final_18: { type: "rounds", title: "Башня букв", owl: "Двенадцать коротких вопросов по всей тропе.", hint: "Вспомни правило каждой зоны.", success: "Ты прошёл башню букв!", rounds: tower }
    }
  };
})();
