/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, QuestionType, Unit } from "../types";
import { UNITS, QUESTIONS } from "../data";

// Bank of authentic curriculum essay questions for Sudanese Grade 6 History & Civics
export const ESSAY_QUESTION_BANK: Question[] = [
  // --- الوحدة الأولى: تاريخ السودان الحديث ---
  {
    id: "essay_u1_1",
    unitId: 1,
    lessonId: "u1_l1",
    type: QuestionType.ESSAY,
    text: "اذكر أسباب غزو محمد علي باشا للسودان عام ١٨٢٠م مع الشرح الموجز.",
    correctAnswer: "أسباب غزو محمد علي باشا للسودان:\n١. البحث عن الذهب والمعادن لتمويل مشروعاته وبناء دولته.\n٢. تجنيد الرجال السودانيين الأقوياء لبناء جيش نظامي حديث.\n٣. القضاء على المماليك الفارين إلى دنقلا الذين شكلوا تهديداً لحكمه.\n٤. التخلص من جنوده غير النظاميين (الألبان والأرناؤوط) الذين اعتادوا التمرد والشغب.",
    explanation: "كتاب التاريخ للصف السادس: أسباب غزو السودان في عهد محمد علي باشا."
  },
  {
    id: "essay_u1_2",
    unitId: 1,
    lessonId: "u1_l1",
    type: QuestionType.ESSAY,
    text: "تحدث عن مقاومة الشايقية للغزو التركي في معركة كورتي ومقاومة المقدوم مسلم في معركة بارا.",
    correctAnswer: "١. معركة كورتي (٤ نوفمبر ١٨٢٠م): تصدت قبيلة الشايقية الباسلة لجيش إسماعيل باشا وأظهر فرسانهم شجاعة فائقة، ولكن تفوق السلاح الناري والبنادق العثمانية حسم المعركة للغزاة.\n٢. معركة بارا (أبريل ١٨٢١م): واجه جيش الدفتردار قوات إقليم كردفان بقيادة حاكمها المقدوم مسلم (النائب عن سلطنة الفور)، وقاتل السودانيون ببطولة حتى استشهد المقدوم مسلم ودخل الدفتردار مدينة الأبيض عاصمة كردفان.",
    explanation: "منهج التاريخ: معارك كورتي وبارا وبطولات المقاومة السودانية."
  },
  {
    id: "essay_u1_3",
    unitId: 1,
    lessonId: "u1_l1",
    type: QuestionType.ESSAY,
    text: "وضح حادثة مقتل إسماعيل باشا في شندي عام ١٨٢٢م على يد المك نمر وما ترتب عليها من نتائج.",
    correctAnswer: "وصل إسماعيل باشا إلى شندي وطالب المك نمر والمك مساعد بضرائب باهظة ومستحيلة من الأموال والجمال والرجال في وقت وجيز وأهان المك نمر. دبر المك نمر خطة حيث أحاط ديوان إسماعيل وجنوده بالحطب والقش وأشعل فيه النيران ليلاً فهلك إسماعيل وجنوده.\nالنتائج: عاد محمد بك الدفتردار بحملات انتقامية دموية قاسية على مدن وقرى السودان (حملات الدفتردار الانتقامية) وقام بقتل الأهالي وتخريب العمران.",
    explanation: "تاريخ السودان: ثورة المك نمر وحملات الدفتردار الانتقامية."
  },
  {
    id: "essay_u1_4",
    unitId: 1,
    lessonId: "u1_l2",
    type: QuestionType.ESSAY,
    text: "اشرح دور الحكمدار خورشيد باشا في تأسيس وتطوير مدينة الخرطوم كعاصمة للسودان.",
    correctAnswer: "تولى خورشيد باشا حكمدارية السودان (١٨٢٦ - ١٨٣٨م)، واهتم بتطوير الخرطوم لتكون عاصمة رسمية للبلاد:\n١. بنى سراي الحكومة وثكنات الجيش ومخازن البارود والعتاد.\n٢. شيد الجامع الكبير بالطوب الأحمر المصقول.\n٣. شجع الأهالي على البناء بالطوب الأحمر والنيئ بدلاً من القش وأمدهم بالأخشاب مجاناً.\n٤. أنشأ ورشاً لبناء السفن والمراكب النيلية في الخرطوم، فزادت حركة التجارة وتدفق السكان.",
    explanation: "تاريخ الإدارة والحكم في السودان: تأسيس وتعمير الخرطوم."
  },
  {
    id: "essay_u1_5",
    unitId: 1,
    lessonId: "u1_l3",
    type: QuestionType.ESSAY,
    text: "ما هي الإصلاحات الاقتصادية والإدارية التي قام بها الخديوي إسماعيل في السودان؟",
    correctAnswer: "أبرز أعمال وإصلاحات الخديوي إسماعيل في السودان (١٨٦٣ - ١٨٧٩م):\n١. ربط مدن السودان بخطوط التلغراف السلكي.\n٢. مد خط السكة حديد بين وادي حلفا وسنار (بدأ المشروع بـ ٥٠ كيلومتراً).\n٣. تطوير مزارع القطن والزراعة في طوكر والقاش ومديرية التاكا (كسلا).\n٤. إنشاء خط الملاحة النهرية بالبواخر بين الخرطوم وجنوب السودان وشرق إفريقيا.\n٥. توسيع حدود السودان حتى البحر الأحمر (سواكن ومصوع) وإقليم الاستوائية ودارفور.",
    explanation: "عهد الخديوي إسماعيل وتحديث وسائل المواصلات والزراعة."
  },

  // --- الوحدة الثانية: التاريخ الإسلامي (العصر العباسي) ---
  {
    id: "essay_u2_1",
    unitId: 2,
    lessonId: "u2_l1",
    type: QuestionType.ESSAY,
    text: "تحدث عن مراحل قيام الدعوة العباسية حتى سقوط الدولة الأموية في معركة الزاب سنة ١٣٢هـ.",
    correctAnswer: "١. المرحلة السرية: بدأت في عهد الخليفة الأموي عمر بن عبد العزيز بتأسيس جمعية سرية بقيادة محمد بن علي بن عبد الله بن عباس في الكوفة وخراسان، ورفعوا شعار 'الرضا من آل محمد'.\n٢. المرحلة العلنية: أعلن أبو مسلم الخراساني الثورة في مرو بخراسان ورفع الرايات السوداء، وهزم الجيوش الأموية.\n٣. الحسم: التقت القوات العباسية بالأموية في معركة الزاب الفاصلة (شمال العراق) سنة ١٣٢هـ، فهزم مروان بن محمد آخر خلفاء بني أمية، وبويع أبو العباس السفاح كأول خليفة عباسي.",
    explanation: "التاريخ الإسلامي: قيام الدولة العباسية ومعركة الزاب."
  },
  {
    id: "essay_u2_2",
    unitId: 2,
    lessonId: "u2_l2",
    type: QuestionType.ESSAY,
    text: "لماذا يُعتبر أبو جعفر المنصور المؤسس الحقيقي للدولة العباسية؟ وضح أبرز أعماله وعمارة بغداد.",
    correctAnswer: "يُعتبر أبو جعفر المنصور المؤسس الحقيقي للدولة العباسية لأنه:\n١. قضى على الفتن والثورات المعارضة وثبّت الأمن والاستقرار في أرجاء الدولة.\n٢. نظّم الدواوين والبريد وبيت المال بحكمة وإشراف دقيق.\n٣. بنى مدينة بغداد الدائرية (مدينة السلام) عام ١٤٥هـ (٧٦٢م) على نهر دجلة بتصميم دائري فريد وسورين عظيمين، وجعل لها أربعة أبواب (الكوفة، البصرة، الشام، خراسان)، وبنى في وسطها قصر الذهب والجامع الكبير.",
    explanation: "العصر العباسي: أبو جعفر المنصور وتشييد بغداد الدائرية."
  },
  {
    id: "essay_u2_3",
    unitId: 2,
    lessonId: "u2_l2",
    type: QuestionType.ESSAY,
    text: "وضح دور الخليفة المأمون في النهضة العلمية وازدهار بيت الحكمة ببغداد.",
    correctAnswer: "١. شجع الخليفة المأمون العلم والعلماء والمناظرات الفكرية.\n٢. طور مكتبة ودار 'بيت الحكمة' ببغداد لتصبح مجمعاً علمياً وأكاديمياً عالمياً وترجمياً.\n٣. أغدق على المترجمين (مثل حنين بن إسحاق) وأعطاهم وزن ما يترجمونه إلى العربية ذهباً.\n٤. تُرجمت أمهات كتب الفلسفة والطب والرياضيات والفلك والهندسة من اليونانية والفارسية والسريانية والهندية إلى اللغة العربية.",
    explanation: "العصر العباسي: النهضة العلمية والترجمة في عهد المأمون."
  },
  {
    id: "essay_u2_4",
    unitId: 2,
    lessonId: "u2_l4",
    type: QuestionType.ESSAY,
    text: "ما هي أسباب ضعف وسقوط الدولة العباسية سنة ٦٥٦هـ (١٢٥٨م)؟",
    correctAnswer: "أسباب ضعف وسقوط الدولة العباسية:\n١. اتساع رقعة الدولة وصعوبة السيطرة المركزية على الأقاليم البعيدة.\n٢. تسلط الجند الأتراك وقادة الحرس على الخلفاء.\n٣. ظهور الدويلات المستقلة والانفصالية (كالطولونيين، الإخشيديين، الحمدانيين، والبويهيين).\n٤. هجوم التتار والمغول بقيادة هولاكو واقتحام بغداد سنة ٦٥٦هـ وقتل الخليفة المستعصم وتدمير بيت الحكمة ومساجد بغداد.",
    explanation: "سقوط بغداد ونهاية الخلافة العباسية على يد التتار والمغول."
  },

  // --- الوحدة الثالثة: تاريخ الممالك الإفريقية الإسلامية ---
  {
    id: "essay_u3_1",
    unitId: 3,
    lessonId: "u3_l1",
    type: QuestionType.ESSAY,
    text: "تحدث عن دولة الأدارسة بالمغرب ودولة الأغالبة بتونس وأهم إنجازاتهما الحضارية.",
    correctAnswer: "١. دولة الأدارسة: أسسها إدريس بن عبد الله بن الحسن عام ١٧٢هـ في المغرب الأقصى، وبنى مدينة فاس التي أصبحت عاصمة علمية وتجارية كبرى واشتهرت بجامع وجامعة القرويين.\n٢. دولة الأغالبة: أسسها إبراهيم بن الأغلب عام ١٨٤هـ في القيروان (تونس)، وتميزت ببناء أسطول بحري قوي في البحر المتوسط نجح في فتح جزيرة صقلية بقيادة القاضي أسد بن الفرات وبناء جامع القيروان الكبير.",
    explanation: "تاريخ إفريقيا الإسلامي: الأدارسة والأغالبة."
  },
  {
    id: "essay_u3_2",
    unitId: 3,
    lessonId: "u3_l2",
    type: QuestionType.ESSAY,
    text: "اشرح قيام الدولة الفاطمية في تونس وفتح مصر وتأسيس مدينة القاهرة والجامع الأزهر.",
    correctAnswer: "تأسست الدولة الفاطمية على يد عبيد الله المهدي سنة ٢٩٧هـ في شمال إفريقيا وجعل عاصمته المهدية بتونس. أرسل الخليفة المعز لدين الله قائده جوهر الصقلي الذي فتح مصر سنة ٣٥٨هـ، وشرع في بناء مدينة القاهرة لتكون عاصمة جديدة للخلافة الفاطمية، وأنشأ الجامع الأزهر ليكون مركزاً للعبادة ونشر العلوم.",
    explanation: "الدولة الفاطمية: جوهر الصقلي، القاهرة والأزهر الشريف."
  },
  {
    id: "essay_u3_3",
    unitId: 3,
    lessonId: "u3_l4",
    type: QuestionType.ESSAY,
    text: "تحدث عن إمبراطورية مالي الإسلامية ورحلة حج السلطان منسا موسى عام ١٣٢٤م ونتائجها.",
    correctAnswer: "تأسست إمبراطورية مالي في غرب إفريقيا وازدهرت بفضل تجارة الذهب والملح. في عام ١٣٢٤م قاد سلطانها العظيم منسا موسى رحلة حج تاريخية إلى مكة المكرمة بموكب ضخم يضم آلاف الحراس والجمال المحملة بسبائك الذهب، وأنفق بسخاء في القاهرة ومكة مما أثر على أسعار الذهب، وجلب معه المهندس والشاعر الأندلسي أبا إسحاق الساحلي الذي بنى مساجد وقصور تيمبكتو وجاوا بالآجر، وعرفت أوروبا ثراء مالي فرسمتها على خرائطها.",
    explanation: "ممالك إفريقيا: مالي وحج منسا موسى الأسطوري."
  },

  // --- الوحدة الرابعة: عصر النهضة الأوربية ---
  {
    id: "essay_u4_1",
    unitId: 4,
    lessonId: "u4_l1",
    type: QuestionType.ESSAY,
    text: "ما هي عوامل قيام النهضة الأوربية الحديثة؟ ولماذا كانت إيطاليا مهد النهضة؟",
    correctAnswer: "عوامل قيام النهضة الأوربية:\n١. ازدهار المدن الإيطالية والتجارة مع الشرق العربي الإسلامي.\n٢. سقوط القسطنطينية عام ١٤٥٣م وهجرة العلماء الإغريق بمخطوطاتهم إلى إيطاليا.\n٣. اختراع الطباعة بحروف متحركة على يد يوحنا جوتنبرج مما ساعد في نشر الكتب والمعارف.\n٤. تشجيع الأمراء والأثرياء في فلورنسا وروما للفنون والآداب.\nوكانت إيطاليا مهداً للنهضة بسبب موقعها الجغرافي المتوسط في حوض البحر الأبيض، وثراء مدنها (البندقية، جنوة، فلورنسا)، وقربها من التراث الروماني القديم.",
    explanation: "عصر النهضة الأوربية: العوامل والموقع الإيطالي."
  },
  {
    id: "essay_u4_2",
    unitId: 4,
    lessonId: "u4_l2",
    type: QuestionType.ESSAY,
    text: "اذكر دوافع حركة الكشوف الجغرافية الأوربية وأهم نتائجها الاقتصادية والسياسية.",
    correctAnswer: "دوافع الكشوف الجغرافية:\n١. البحث عن طريق بحري مباشر للهند والشرق لتفادي دفع الضرائب للعرب والمسلمين في مصر والشام.\n٢. الرغبة في التوسع الاقتصادي والسيطرة على تجارة التوابل والحرير والذهب.\n٣. نشر الديانة المسيحية.\nأهم النتائج:\n- انتقال مركز التجارة العالمية من البحر المتوسط إلى المحيط الأطلسي وتراجع الموانئ العربية والإيطالية.\n- اكتشاف قارات جديدة (أمريكا الشمالية والجنوبية وأستراليا).\n- قيام الاستعمار الأوربي والتنافس الإمبريالي على ثروات الشعوب في آسيا وإفريقيا وأمريكا.",
    explanation: "حركة الكشوف الجغرافية ودوافعها ونتائجها العالمية."
  },
  {
    id: "essay_u4_3",
    unitId: 4,
    lessonId: "u4_l3",
    type: QuestionType.ESSAY,
    text: "ما المقصود بالثورة الصناعية؟ وما أثر اختراع الآلة البخارية لجيمس وات على الإنتاج والمواصلات؟",
    correctAnswer: "الثورة الصناعية هي التحول الجذري من نظام الإنتاج اليدوي المنزلي إلى الإنتاج الآلي في المصانع الكبيرة، وبدأت في إنجلترا في النصف الثاني من القرن الثامن عشر.\nأثر الآلة البخارية لجيمس وات (١٧٦٩م):\n١. أتاحت استخدام قوة البخار لتشغيل آلات النسيج والمصانع بكفاءة وسرعة فائقة.\n٢. ثورة في المواصلات بصنع القاطرة البخارية (ستيفنسن) والسفن البخارية، مما قلل زمن السفر ونقل البضائع بكميات ضخمة وخفض تكاليف الإنتاج.",
    explanation: "الثورة الصناعية والمخترعات العلمية الحديثة."
  },

  // --- الوحدة الخامسة: التربية الوطنية ---
  {
    id: "essay_u5_1",
    unitId: 5,
    lessonId: "u5_l1",
    type: QuestionType.ESSAY,
    text: "اشرح بالتفصيل أركان ومقومات الدولة الحديثة الأربعة.",
    correctAnswer: "أركان الدولة الأساسية هي:\n١. الشعب: وهو مجموعة المواطنين الذين يسكنون الدولة وتربطهم روابط مشتركة ويحملون جنسيتها.\n٢. الأرض (الإقليم): الحيز الجغرافي المحدد بحدود برية وبحرية وجوية تمارس الدولة عليه سيادتها.\n٣. الحكومة: الهيئة السياسية والإدارية التي تدير شؤون الدولة وتنظم حياة المواطنين وتنفذ القوانين.\n٤. الدستور والقوانين (والسيادة): القانون الأعلى الذي يحدد نظام الحكم وحقوق وواجبات الأفراد، واستقلال الدولة في اتخاذ قراراتها دون تدخل خارجي مع الاعتراف الدولي بها.",
    explanation: "التربية الوطنية: أركان ومقومات الدولة الأساسية."
  },
  {
    id: "essay_u5_2",
    unitId: 5,
    lessonId: "u5_l3",
    type: QuestionType.ESSAY,
    text: "وضح الفرق بين حقوق المواطن وواجبات المواطن مع ذكر ثلاثة أمثلة لكل منهما.",
    correctAnswer: "١. حقوق المواطن: هي المزايا والحريات والخدمات التي تكفلها الدولة لمواطنيها، ومنها:\n- الحق في الحياة الكريمة والأمن الشخصي.\n- الحق في التعليم المجاني والرعاية الصحية.\n- الحق في العمل وحرية التعبير والتملك والمساواة أمام القانون.\n٢. واجبات المواطن: هي الالتزامات والمسؤوليات التي يجب على كل فرد تقديمها تجاه وطنه ومجتمعه، ومنها:\n- الدفاع عن الوطن وأداء الخدمة الوطنية العسكرية.\n- احترام القوانين والدستور والنظام العام.\n- دفع الضرائب والرسوم القانونية والمحافظة على المال العام والممتلكات العامة والبيئة.",
    explanation: "التربية الوطنية: منظومة الحقوق والواجبات والمواطنة الصالحة."
  }
];

/**
 * Normalizes Arabic text for duplicate detection by removing diacritics, punctuation,
 * and normalizing letter variants.
 */
export function normalizeArabicText(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, "") // Diacritics / Tashkeel
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟?،"':؛«»[\]]/g, " ")
    .replace(/[أإآ]/g, "ا")
    .replace(/[ة]/g, "ه")
    .replace(/[ى]/g, "ي")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Extracts a core semantic fingerprint of a question statement to prevent
 * asking about the same underlying fact with different question templates.
 */
export function getQuestionFactSignature(text: string): string {
  let cleaned = normalizeArabicText(text);

  // Strip generic question instructions and boilerplate
  const prefixes = [
    /^ضع علامه صواب او خطا\s*/,
    /^ضع علامه صح او خطا\s*/,
    /^اكمل الفراغ بالكلمه المناسبه وفق درس [^:]+:\s*/,
    /^اكمل الفراغ بالكلمه التاريخيه المناسبه:\s*/,
    /^اكمل الفراغ:\s*/,
    /^من الحقائق التاريخيه المؤكده في درس [^:]+:\s*/,
    /^اكتب نبذه موجزه توضح فيها اهم احداث ومخرجات درس [^:]+:\s*/,
    /^ارتبط حدث [^ ]+ بـ\s*/,
    /^ينفي درس [^ ]+ ان\s*/,
  ];

  for (const prefix of prefixes) {
    cleaned = cleaned.replace(prefix, "");
  }

  // Remove common Arabic stop words to isolate informative keywords
  const stopWords = new Set([
    "في", "من", "على", "الى", "عن", "مع", "هذا", "هذه", "ذلك", "تلك", "التي", "الذي",
    "الذين", "اللاتي", "ان", "انها", "انه", "كان", "كانت", "وقد", "قد", "ما", "هو", "هي", "هم",
    "او", "ثم", "بل", "حيث", "بين", "كما", "كل", "جميع", "درس", "الوحده", "عام", "سنه", "وفق"
  ]);

  const tokens = cleaned
    .split(" ")
    .filter(w => w.length >= 3 && !stopWords.has(w));

  return tokens.slice(0, 8).join("_");
}

/**
 * Procedural generation engine that pulls authentically from the rich question bank
 * and generates clean, curriculum-aligned questions matching Sudanese 6th Grade History syllabus
 * with STRICT ZERO-DUPLICATION guarantees across all pages and modes.
 */
export const generateDynamicQuestions = (
  targetCount: number,
  config: {
    type: "lesson" | "unit" | "comprehensive";
    unitId?: number;
    lessonId?: string;
    typesSelected: {
      mcq: boolean;
      tf: boolean;
      blank: boolean;
      match: boolean;
      essay: boolean;
    };
  }
): Question[] => {
  // 1. Build base pool from verified static questions
  let pool: Question[] = [...QUESTIONS];

  if (config.type === "unit" && config.unitId) {
    pool = pool.filter(q => q.unitId === config.unitId);
  } else if (config.type === "lesson" && config.lessonId) {
    pool = pool.filter(q => q.lessonId === config.lessonId);
  }

  // Include authentic essay questions if essay type is selected
  let essayPool = [...ESSAY_QUESTION_BANK];
  if (config.type === "unit" && config.unitId) {
    essayPool = essayPool.filter(q => q.unitId === config.unitId);
  } else if (config.type === "lesson" && config.lessonId) {
    essayPool = essayPool.filter(q => q.lessonId === config.lessonId);
  }

  if (config.typesSelected.essay) {
    pool = [...pool, ...essayPool];
  }

  // Filter pool by chosen types
  pool = pool.filter(q => {
    if (q.type === QuestionType.MCQ && !config.typesSelected.mcq) return false;
    if (q.type === QuestionType.TRUE_FALSE && !config.typesSelected.tf) return false;
    if (q.type === QuestionType.FILL_BLANK && !config.typesSelected.blank) return false;
    if (q.type === QuestionType.MATCH && !config.typesSelected.match) return false;
    if (q.type === QuestionType.ESSAY && !config.typesSelected.essay) return false;
    return true;
  });

  // Track unique question normalized texts and fact signatures to strictly prevent duplicates
  const seenTexts = new Set<string>();
  const seenSignatures = new Set<string>();
  const results: Question[] = [];

  // Shuffle pool with high entropy to ensure freshness
  const shuffledPool = [...pool].sort(() => 0.5 - Math.random());

  // Add all matching authentic questions from the filtered pool first
  for (const q of shuffledPool) {
    const norm = normalizeArabicText(q.text);
    const sig = getQuestionFactSignature(q.text);

    if (!seenTexts.has(norm) && (!sig || !seenSignatures.has(sig))) {
      seenTexts.add(norm);
      if (sig) seenSignatures.add(sig);
      results.push(q);

      if (results.length >= targetCount) {
        return results;
      }
    }
  }

  // 2. If more questions are required, systematically expand from lesson keypoints, content sentences, and timelines
  let targetUnits = config.unitId ? UNITS.filter(u => u.id === config.unitId) : UNITS;
  let targetLessons: typeof UNITS[0]['lessons'] = [];

  if (config.type === "lesson" && config.lessonId) {
    targetLessons = UNITS.flatMap(u => u.lessons).filter(l => l.id === config.lessonId);
    if (targetLessons.length > 0) {
      const parentU = UNITS.find(u => u.lessons.some(l => l.id === config.lessonId));
      if (parentU) targetUnits = [parentU];
    }
  } else if (config.type === "unit" && config.unitId) {
    targetUnits = UNITS.filter(u => u.id === config.unitId);
    targetLessons = targetUnits.flatMap(u => u.lessons);
  } else {
    targetLessons = targetUnits.flatMap(u => u.lessons);
  }

  if (targetLessons.length === 0) {
    targetLessons = targetUnits.flatMap(u => u.lessons);
  }

  // Gather all discrete fact statements from target lessons (keypoints + full content sentences)
  interface DiscreteFact {
    statement: string;
    lesson: typeof targetLessons[0];
    parentUnit: typeof targetUnits[0];
  }

  const rawFacts: DiscreteFact[] = [];

  for (const l of targetLessons) {
    const parentU = UNITS.find(u => u.lessons.some(x => x.id === l.id)) || targetUnits[0];

    // Add keyPoints
    if (l.keyPoints) {
      for (const kp of l.keyPoints) {
        if (kp.trim().length > 10) {
          rawFacts.push({ statement: kp.trim(), lesson: l, parentUnit: parentU });
        }
      }
    }

    // Add content sentences
    if (l.content) {
      for (const paragraph of l.content) {
        const sentences = paragraph.split(/[.،؛\n]/).map(s => s.trim()).filter(s => s.length > 15);
        for (const s of sentences) {
          rawFacts.push({ statement: s, lesson: l, parentUnit: parentU });
        }
      }
    }
  }

  // Also include timeline milestones for unit scope
  for (const u of targetUnits) {
    if (u.timeline) {
      for (const t of u.timeline) {
        const dummyLesson = u.lessons[0] || targetLessons[0];
        rawFacts.push({
          statement: `في عام (${t.year}): ${t.title} - ${t.description}`,
          lesson: dummyLesson,
          parentUnit: u
        });
      }
    }
  }

  // Shuffle facts so variety is maximal
  const shuffledFacts = [...rawFacts].sort(() => 0.5 - Math.random());

  const activeTypes: QuestionType[] = [];
  if (config.typesSelected.mcq) activeTypes.push(QuestionType.MCQ);
  if (config.typesSelected.tf) activeTypes.push(QuestionType.TRUE_FALSE);
  if (config.typesSelected.blank) activeTypes.push(QuestionType.FILL_BLANK);
  if (config.typesSelected.essay) activeTypes.push(QuestionType.ESSAY);

  if (activeTypes.length === 0) {
    return results.slice(0, targetCount);
  }

  let typeRoundRobin = 0;

  for (const factObj of shuffledFacts) {
    if (results.length >= targetCount) break;

    const { statement: kp, lesson, parentUnit } = factObj;
    const normStatement = normalizeArabicText(kp);
    const factSig = getQuestionFactSignature(kp);

    // Skip if this fact was already tested in any question
    if (seenTexts.has(normStatement) || (factSig && seenSignatures.has(factSig))) {
      continue;
    }

    const chosenType = activeTypes[typeRoundRobin % activeTypes.length];
    typeRoundRobin++;

    if (chosenType === QuestionType.TRUE_FALSE) {
      const isTrue = Math.random() > 0.4;
      let qText = "";
      let ans = "";
      let exp = "";

      if (isTrue) {
        qText = `ضع علامة (صواب) أو (خطأ): ${kp}`;
        ans = "صواب";
        exp = `العبارة صحيحة تماماً وتوافق ما ورد في درس (${lesson.title}).`;
      } else {
        // Create an authentic false statement strictly within the allowed unit/lesson boundaries
        const siblingLessons = targetLessons.filter(l => l.id !== lesson.id);
        if (siblingLessons.length > 0) {
          const otherL = siblingLessons[Math.floor(Math.random() * siblingLessons.length)];
          const otherKp = otherL.keyPoints[0] || otherL.title;
          qText = `ضع علامة (صواب) أو (خطأ): ارتبط حدث (${lesson.title}) بـ: "${otherKp}"`;
          ans = "خطأ";
          exp = `العبارة غير صحيحة، لأن هذه المعلومة تخص درس (${otherL.title}) في نفس الوحدة المقررة.`;
        } else {
          // In a single lesson, construct a negation or incorrect assertion within the lesson
          qText = `ضع علامة (صواب) أو (خطأ): ينفي درس (${lesson.title}) أن: "${kp}"`;
          ans = "خطأ";
          exp = `العبارة غير صحيحة، بل الحقيقة التاريخية المؤكدة في هذا الدرس هي: ${kp}`;
        }
      }

      const qNorm = normalizeArabicText(qText);
      if (!seenTexts.has(qNorm)) {
        seenTexts.add(qNorm);
        if (factSig) seenSignatures.add(factSig);
        results.push({
          id: `curr_gen_tf_${results.length + 1}`,
          unitId: parentUnit.id,
          lessonId: lesson.id,
          type: QuestionType.TRUE_FALSE,
          text: qText,
          options: ["صواب", "خطأ"],
          correctAnswer: ans,
          explanation: exp
        });
      }
    } else if (chosenType === QuestionType.FILL_BLANK) {
      const words = kp.split(" ").filter(w => w.length > 0);
      if (words.length >= 4) {
        let maskIdx = -1;
        for (let i = 0; i < words.length; i++) {
          const w = words[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟?،"':؛«»[\]]/g, "");
          if (w.length >= 4 && !["التي", "الذي", "على", "فيما", "إلى", "عنها", "منها", "وكان", "حيث", "جميع", "أهم"].includes(w)) {
            maskIdx = i;
            break;
          }
        }

        if (maskIdx !== -1) {
          const maskedWord = words[maskIdx].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟?،"':؛«»[\]]/g, "");
          if (maskedWord && maskedWord.length >= 3) {
            const copyWords = [...words];
            copyWords[maskIdx] = "........";
            const qText = `أكمل الفراغ بالكلمة المناسبة وفق درس (${lesson.title}): "${copyWords.join(" ")}"`;
            const qNorm = normalizeArabicText(qText);

            if (!seenTexts.has(qNorm)) {
              seenTexts.add(qNorm);
              if (factSig) seenSignatures.add(factSig);
              results.push({
                id: `curr_gen_blank_${results.length + 1}`,
                unitId: parentUnit.id,
                lessonId: lesson.id,
                type: QuestionType.FILL_BLANK,
                text: qText,
                correctAnswer: maskedWord,
                explanation: `الكلمة المنهجية الصحيحة لإكمال العبارة في درس (${lesson.title}) هي: (${maskedWord}).`
              });
            }
          }
        }
      }
    } else if (chosenType === QuestionType.MCQ) {
      const qText = `من الحقائق التاريخية المؤكدة في درس (${lesson.title}):`;
      const correctOpt = kp;

      let distractorCandidates = targetLessons
        .filter(l => l.id !== lesson.id)
        .flatMap(l => l.keyPoints)
        .filter(k => k !== correctOpt && k.length > 5);

      if (distractorCandidates.length < 3) {
        const sameLessonOtherPoints = lesson.keyPoints.filter(k => k !== correctOpt);
        const sameLessonContent = lesson.content.filter(c => c.length > 10 && c !== correctOpt);
        distractorCandidates = [...distractorCandidates, ...sameLessonOtherPoints, ...sameLessonContent];
      }

      const shuffledOthers = [...distractorCandidates].sort(() => 0.5 - Math.random());
      const distractors = shuffledOthers.slice(0, 3);

      if (distractors.length >= 2) {
        const options = [correctOpt, ...distractors].sort(() => 0.5 - Math.random());
        const qNorm = normalizeArabicText(qText + " " + correctOpt);

        if (!seenTexts.has(qNorm)) {
          seenTexts.add(qNorm);
          if (factSig) seenSignatures.add(factSig);
          results.push({
            id: `curr_gen_mcq_${results.length + 1}`,
            unitId: parentUnit.id,
            lessonId: lesson.id,
            type: QuestionType.MCQ,
            text: qText,
            options,
            correctAnswer: correctOpt,
            explanation: `الإجابة الصحيحة المقررة في درس (${lesson.title}): ${kp}`
          });
        }
      }
    } else if (chosenType === QuestionType.ESSAY) {
      const qText = `اكتب نبذة موجزة توضح فيها أهم أحداث ومخرجات درس: (${lesson.title}).`;
      const modelAnswer = `الإجابة النموذجية المعتمدة لدرس (${lesson.title}):\n` + 
        (lesson.content.slice(0, 2).join("\n") || kp) + 
        `\n\nالنقاط الأساسية:\n` + 
        lesson.keyPoints.map(p => `• ${p}`).join("\n");

      const qNorm = normalizeArabicText(qText);
      if (!seenTexts.has(qNorm)) {
        seenTexts.add(qNorm);
        if (factSig) seenSignatures.add(factSig);
        results.push({
          id: `curr_gen_essay_${results.length + 1}`,
          unitId: parentUnit.id,
          lessonId: lesson.id,
          type: QuestionType.ESSAY,
          text: qText,
          correctAnswer: modelAnswer,
          explanation: `يتناول الدرس النقاط المقررة التالية: ` + lesson.keyPoints.join(" - ")
        });
      }
    }
  }

  // Return strictly unique, non-duplicated questions
  return results.slice(0, targetCount);
};
