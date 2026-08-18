/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  X, 
  BookOpen, 
  MapPin, 
  Search, 
  Sparkles, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  Printer,
  Compass,
  Layers,
  Award,
  ArrowRight
} from "lucide-react";
import { SVGIllustration } from "./SVGIllustrations";
import { Unit } from "../types";

export interface GalleryItem {
  id: string;
  title: string;
  unitId: number;
  unitTitle: string;
  lessonId?: string;
  lessonTitle?: string;
  category: "illustration" | "map" | "architecture" | "invention" | "monument";
  type: string;
  period: string;
  location: string;
  description: string;
  historicalDetails: {
    title: string;
    description: string;
    curriculumFact: string;
  }[];
  hotspots?: {
    id: string;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    label: string;
    text: string;
  }[];
}

interface GalleryViewProps {
  units: Unit[];
  onSelectLesson: (unitId: number, lessonIdx: number) => void;
  onPlaySound?: (sound: "click" | "success" | "fail" | "levelup" | "pageflip") => void;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // --- الوحدة الأولى: تاريخ السودان الحديث ---
  {
    id: "gal_meroë_pyramids",
    title: "أهرامات مروي (البجراوية) والتراث الكوشي العريق",
    unitId: 1,
    unitTitle: "الوحدة الأولى: تاريخ السودان الحديث (١٨٢١ - ١٨٨٥م)",
    lessonId: "u1_l1",
    lessonTitle: "الدرس الأول: الغزو التركي المصري للسودان (١٨٢٠ - ١٨٢١م)",
    category: "monument",
    type: "SudanPyramids",
    period: "عصور السودان القديمة ومملكة مروي",
    location: "شندي - البجراوية - ولاية نهر النيل",
    description: "الأهرامات النوبية الخالدة في مروي والبجراوية، شواهد حضارة كوش ومروي القديمة على ضفاف نهر النيل الخالد، والتي عكست عراقة الدولة السودانية قبل الغزو التركي.",
    historicalDetails: [
      {
        title: "العمارة الهندسية المميزة",
        description: "تتميز أهرامات مروي بزواياها الحادة وبواباتها الشرقية المنحوتة المخصصة للطقوس الجنائزية وتخليد ملوك وملكات كوش (الكنداكات).",
        curriculumFact: "تاريخ الدولة في السودان قديم يمتد لحضارات كرمة ونبتة ومروي وسلطنة الفونج والفور قبل عام ١٨٢١م."
      },
      {
        title: "نهر النيل شريان الحياة والنقل",
        description: "كان نهر النيل وسيلة المواصلات والتجارة الرئيسية التي ربطت أقاليم السودان، وسار بمحاذاته جيش إسماعيل باشا في حملة الغزو سنة ١٨٢٠م.",
        curriculumFact: "سلك الجيش الغازي مسار النيل عبر دنقلا والبركل وكورتي حتى شندي وسنار."
      }
    ],
    hotspots: [
      { id: "h1", x: 42, y: 48, label: "الهرم المروي الرئيسي", text: "بني بحجارة رملية مصقولة بزاوية ميلان تقارب ٧٠ درجة مع صالة جنائزية بالمدخل." },
      { id: "h2", x: 68, y: 85, label: "مركب النيل التقليدي", text: "سفن الملاحة النهرية التي استخدمت لنقل البضائع والمحاصيل والجنود عبر شلالات النيل." },
      { id: "h3", x: 50, y: 35, label: "شمس السودان المشرقة", text: "رمز الضياء والخلود والحضارة الإنسانية الضاربة في جذور التاريخ الإفريقي." }
    ]
  },
  {
    id: "gal_khartoum_palace",
    title: "سراي الحكمدارية وتأسيس مدينة الخرطوم عاصمة",
    unitId: 1,
    unitTitle: "الوحدة الأولى: تاريخ السودان الحديث (١٨٢١ - ١٨٨٥م)",
    lessonId: "u1_l2",
    lessonTitle: "الدرس الثاني: تأسيس مدينة الخرطوم عاصمة للسودان وتطورها",
    category: "architecture",
    type: "KhartoumCpt",
    period: "١٨٢٤ - ١٨٣٨م (عهد عثمان بك جركس وخورشيد باشا)",
    location: "الخرطوم - مقرن النيلين الأبيض والأزرق",
    description: "مقر الحكمدارية ودواوين الحكومة المركزية في الخرطوم بعد اختيارها عاصمة للسودان عام ١٨٢٤م بدلاً من سنار لموقعها الاستراتيجي عند ملتقى النيلين.",
    historicalDetails: [
      {
        title: "أسباب اختيار الخرطوم عاصمة",
        description: "توسطها الجغرافي لأقاليم السودان، وموقعها الحربي الممتاز المحاط بالمياه الطبيعية، وسهولة الاتصال بالمديريات عبر الملاحة النهرية.",
        curriculumFact: "اختارها عثمان بك جركس سنة ١٨٢٤م وعمرها خورشيد باشا ببناء السراي والمسجد والترسانة النهرية."
      },
      {
        title: "التطور العمراني والإداري",
        description: "شجع خورشيد باشا الأهالي على البناء بالآجر والطوب الأحمر وزودهم بمواد البناء مجاناً وأنشأ ترسانة لصناعة المراكب والسفن النيلية.",
        curriculumFact: "تطورت الخرطوم من قرية صيادين صغيرة إلى مركز تجاري وعسكري وإداري ضخم."
      }
    ],
    hotspots: [
      { id: "k1", x: 50, y: 45, label: "قبة سراي الحكمدارية", text: "مقر الحكمدار العام لإدارة مديريات السودان واستقبال البعثات الدبلوماسية والتجارية." },
      { id: "k2", x: 30, y: 70, label: "أعمدة البناء المشيد بالآجر", text: "الطراز المعماري الذي أدخله خورشيد باشا لتحويل مباني العاصمة إلى مبانٍ ثابتة." },
      { id: "k3", x: 50, y: 92, label: "مقرن النيلين الأزرق والأبيض", text: "ملتقى النهرين العظيمين الذي وفر الحماية العسكرية وسهولة الإمداد المائي والملاحي." }
    ]
  },
  {
    id: "gal_sudan_map_1821",
    title: "خريطة مسار الغزو وحملات السودان (١٨٢٠ - ١٨٨٥م)",
    unitId: 1,
    unitTitle: "الوحدة الأولى: تاريخ السودان الحديث (١٨٢١ - ١٨٨٥م)",
    lessonId: "u1_l1",
    lessonTitle: "الدرس الأول: الغزو التركي المصري للسودان (١٨٢٠ - ١٨٢١م)",
    category: "map",
    type: "HistoricSudanMap",
    period: "١٨٢٠ - ١٨٧٤م",
    location: "جمهورية السودان (النيل، سنار، كردفان، دارفور، التاكا)",
    description: "خريطة جغرافية تاريخية توضح أهم المدن والمواقع: دنقلا، كورتي، بربر، المتمة، شندي، الخرطوم، سنار، بارا، الأبيض، والفاشر بدارفور.",
    historicalDetails: [
      {
        title: "محاور الحملة العسكرية",
        description: "انطلقت الحملة الأولى بقيادة إسماعيل باشا بمحاذاة النيل حتى سنار، بينما قاد محمد بك الدفتدار حملة كردفان عبر الصحراء حتى الأبيض.",
        curriculumFact: "وقعت معركة كورتي في نوفمبر ١٨٢٠م ضد الشايقية، وسقطت سنار في يونيو ١٨٢١م، وبارا في كردفان."
      },
      {
        title: "ضم دارفور عام ١٨٧٤م",
        description: "قاد الزبير ود رحمة جيشه لضم سلطنة دارفور بعد معركة منواشي واستشهاد السلطان إبراهيم قرض لتكتمل حدود السودان الإدارية.",
        curriculumFact: "حكمت سلطنة الفور إقليم دارفور منذ ١٦٤٠م وعاصمتها الفاشر حتى ضمت سنة ١٨٧٤م."
      }
    ],
    hotspots: [
      { id: "sm1", x: 52, y: 48, label: "الخرطوم - العاصمة", text: "تأسست ١٨٢٤م عند ملتقى النيلين الأبيض والأزرق." },
      { id: "sm2", x: 56, y: 64, label: "سنار - عاصمة الفونج", text: "سقطت سلطنة الفونج (السلطنة الزرقاء) بدخول جيش إسماعيل باشا في يونيو ١٨٢١م." },
      { id: "sm3", x: 54, y: 38, label: "شندي والمك نمر", text: "شهدت حرق إسماعيل باشا عام ١٨٢٢م رداً على غطرسته وطلباته التعجيزية." },
      { id: "sm4", x: 28, y: 55, label: "الفاشر - سلطنة الفور", text: "عاصمة سلطنة الفور المستقلة منذ ١٦٤٠م وضمت للحكمدارية عام ١٨٧٤م." }
    ]
  },

  // --- الوحدة الثانية: العصر العباسي ---
  {
    id: "gal_baghdad_round",
    title: "مخطط مدينة بغداد الدائرية وأبوابها الأربعة (مدينة السلام)",
    unitId: 2,
    unitTitle: "الوحدة الثانية: من التاريخ الإسلامي - العصر العباسي",
    lessonId: "u2_l3",
    lessonTitle: "الدرس الثالث: عاصمة الخلافة: بغداد المدورة",
    category: "map",
    type: "BaghdadRound",
    period: "١٤٥ هـ / ٧٦٢ م (عهد الخليفة أبي جعفر المنصور)",
    location: "بغداد - ضفاف نهر دجلة بالعراق",
    description: "التصميم الدائري الفريد لمدينة بغداد بقطر ميلين، يتوسطها قصر الذهب والمسجد الجامع، محاطة بأسوار دفاعية وخندق مائي وأربعة أبواب رئيسية.",
    historicalDetails: [
      {
        title: "المركز الهندسي: قصر الذهب والجامع",
        description: "وضع الخليفة أبو جعفر المنصور قصره الشهير (قصر الذهب) ذي القبة الخضراء والمسجد الجامع في المركز التام للدائرة، وتحيط بهما دواوين الدولة وثكنات الجند.",
        curriculumFact: "تأسست بغداد سنة ١٤٥هـ بموقع استراتيجي على نهر دجلة لتكون عاصمة الخلافة العباسية."
      },
      {
        title: "الأبواب الأربعة الشاخصة",
        description: "باب الكوفة (جنوباً)، باب البصرة (جنوب شرق)، باب خراسان (شمال شرق)، وباب الشام (شمال غرب)، تخرج منها طرق الإمبراطورية الإسلامية.",
        curriculumFact: "صممت الأبواب على أبعاد متساوية هندسياً لتأمين المراقبة والدفاع والتجارة."
      }
    ],
    hotspots: [
      { id: "b1", x: 50, y: 55, label: "قصر الذهب والمسجد الجامع", text: "قلب المدينة الدائرية حيث أقيم قصر الخلافة بقبته الخضراء ومقر إدارة الدولة." },
      { id: "b2", x: 50, y: 22, label: "باب الشام (شمال غرب)", text: "البوابة المؤدية لبلاد الشام والثغور الشمالية للصوائف والشواتي." },
      { id: "b3", x: 50, y: 88, label: "باب الكوفة (جنوباً)", text: "البوابة الجنوبية الرابطة بطريق الحج والكوفة والحجاز." },
      { id: "b4", x: 80, y: 55, label: "باب خراسان (شمال شرق)", text: "البوابة الرابطة بإقليم خراسان وبلاد ما وراء النهر وطريق الحرير." },
      { id: "b5", x: 20, y: 55, label: "باب البصرة (جنوب شرق)", text: "البوابة المؤدية لميناء البصرة والخليج العربي وتجارة المحيط الهندي." }
    ]
  },
  {
    id: "gal_house_of_wisdom",
    title: "دار بيت الحكمة والمخطوطات العباسية وحركة الترجمة",
    unitId: 2,
    unitTitle: "الوحدة الثانية: من التاريخ الإسلامي - العصر العباسي",
    lessonId: "u2_l2",
    lessonTitle: "الدرس الثاني: أبرز خلفاء الدولة العباسية",
    category: "illustration",
    type: "HouseOfWisdom",
    period: "العصر الذهبي (عهد هارون الرشيد والخليفة المأمون ١٩٨ - ٢١٨هـ)",
    location: "بغداد - دار الحكمة والمكتبات العامة",
    description: "أعظم مجمع علمي وترجمي في العالم الوسيط؛ جمع المخطوطات والعلماء من شتى الأصقاع لترجمة أمهات الكتب في الطب، الفلك، الفلسفة، والرياضيات إلى العربية.",
    historicalDetails: [
      {
        title: "النهضة العلمية وترجمة العلوم",
        description: "أنفق الخليفة المأمون بسخاء على العلماء والمترجمين ودفع وزن الكتب المترجمة ذهباً، مما حفظ التراث الإنساني وطور العلوم التجريبية.",
        curriculumFact: "اشتهر المأمون بتأسيس ودعم بيت الحكمة ببغداد وحركة ترجمة الكتب اليونانية والفارسية والسريانية."
      },
      {
        title: "المخطوطات وأدوات التدوين",
        description: "استخدم الورق والمداد والريش في نسخ آلاف المجلدات التي استعارت منها جامعات أوربا لاحقاً في عصر نهضتها الأدبية.",
        curriculumFact: "تدمير بيت الحكمة وإلقاء كتبه في دجلة على يد المغول عام ٦٥٦هـ كان نكسة كبرى للحضارة."
      }
    ],
    hotspots: [
      { id: "hw1", x: 30, y: 55, label: "المخطوطة المترجمة", text: "تدوين العلوم الطبية والفلكية باللسان العربي وتصحيح نظريات القدماء." },
      { id: "hw2", x: 88, y: 65, label: "المحبرة والريشة التقليدية", text: "أدوات التدوين والخط العربي الفاخر المزخرف بماء الذهب." },
      { id: "hw3", x: 50, y: 40, label: "الخطوط الإنسانية الجامعة", text: "تكامل جهود علماء الأمة في بيت الحكمة من شتى القوميات واللغات." }
    ]
  },

  // --- الوحدة الثالثة: الممالك الإسلامية بإفريقيا ---
  {
    id: "gal_islamic_fleet",
    title: "أسطول الأغالبة وسفن الممالك الإسلامية في البحر المتوسط",
    unitId: 3,
    unitTitle: "الوحدة الثالثة: من تاريخ إفريقيا - الممالك الإسلامية",
    lessonId: "u3_l1",
    lessonTitle: "الدرس الأول: ظهور الدويلات المستقلة في شمال إفريقيا (الأغالبة)",
    category: "illustration",
    type: "IslamicShip",
    period: "١٨٤ - ٢٩٦ هـ / ٨٠٠ - ٩٠٩ م (دولة الأغالبة بالقيروان)",
    location: "تونس، صقلية، البحر الأبيض المتوسط",
    description: "الأسطول البحري الحربي الإسلامي القوي الذي شيده الأغالبة في تونس، والذي خاض معارك مظفرة في البحر المتوسط وفتح جزيرة صقلية وسردينيا ومالطا.",
    historicalDetails: [
      {
        title: "السيادة البحرية وفتح صقلية",
        description: "انطلقت الحملات البحرية بقيادة القاضي أسد بن الفرات في عهد زيادة الله بن الأغلب سنة ٢١٢هـ لفتح صقلية ونشر الإسلام وحماية السواحل.",
        curriculumFact: "أنشأ الأغالبة أسطولاً بحرياً قوياً في المتوسط فتحوا به جزيرة صقلية سنة ٢١٢هـ وسردينيا ومالطا."
      },
      {
        title: "تصميم السفينة الإسلامية (الشيني والداو)",
        description: "تميزت بالأشرعة المثلثية اللاتينية المقاومة للرياح، والمجاديف المزدوجة للمناورة السريعة في المعارك البحرية والإنزال الساحلي.",
        curriculumFact: "دولة الأغالبة أسسها إبراهيم بن الأغلب عام ١٨٤هـ وعاصمتها القيروان."
      }
    ],
    hotspots: [
      { id: "f1", x: 50, y: 35, label: "الشراع المثلثي اللاتيني", text: "ابتكار ملاحي إسلامي سمح بالإبحار ضد اتجاه الريح واقتبسه الأوربيون في كشوفهم." },
      { id: "f2", x: 45, y: 72, label: "مجاديف المناورة السريعة", text: "وفرت قوة دفع إضافية أثناء المعارك والرياح الهادئة في البحر المتوسط." },
      { id: "f3", x: 75, y: 88, label: "أمواج البحر الأبيض المتوسط", text: "مسرح الفتوحات والتجارة بين موانئ شمال إفريقيا وجزر وجنوب أوربا." }
    ]
  },
  {
    id: "gal_mali_caravan",
    title: "قوافل تجارة الذهب وإمبراطورية مالي وحج منسا موسى",
    unitId: 3,
    unitTitle: "الوحدة الثالثة: من تاريخ إفريقيا - الممالك الإسلامية",
    lessonId: "u3_l4",
    lessonTitle: "الدرس الرابع: نماذج للممالك الإسلامية في السودان الأوسط والغربي (مالي)",
    category: "illustration",
    type: "GoldMali",
    period: "١٣١٢ - ١٣٣٧ م (عهد الملك منسا موسى)",
    location: "حوض نهر النيجر - تمبكتو - نياني",
    description: "قوافل الجمال العابرة للصحراء الكبرى المحملة بذهب مالي والملح؛ وموكب الحج الأسطوري للملك منسا موسى عام ١٣٢٤م الذي أبهر العالم بثروته وسخائه.",
    historicalDetails: [
      {
        title: "رحلة الحج الكبرى (١٣٢٤م)",
        description: "سار منسا موسى بموكب ضم آلاف الحراس ومائة جمل محملة بالذهب الخالص، ووزع الصدقات في القاهرة ومكة والمدينة حتى انخفض سعر الذهب بمصر.",
        curriculumFact: "وضع حج منسا موسى إمبراطورية مالي على الخرائط العالمية وجلب العلماء لبناء مساجد تمبكتو وجينيه."
      },
      {
        title: "طرق التجارة عبر الصحراء",
        description: "ربطت تجارة القوافل بين مناجم الذهب بالجنوب وموانئ الملح بشمال إفريقيا ومصر، ورافقتها حركة نشر الإسلام واللغة العربية.",
        curriculumFact: "زار الرحالة ابن بطوطة مالي ووصف أمنها التام وحرص أهلها على حفظ القرآن وأداء الصلوات."
      }
    ],
    hotspots: [
      { id: "m1", x: 30, y: 65, label: "قافلة الجمال الذهبية", text: "سفن الصحراء التي حملت سبائك الذهب الخالص وقوالب الملح عبر الصحراء الكبرى." },
      { id: "m2", x: 75, y: 35, label: "شمس السافانا الإفريقية", text: "مناخ إقليم السافانا الغنية بالمراعي والزراعة ومناجم المعادن الثمينة." },
      { id: "m3", x: 50, y: 88, label: "رمال الصحراء الكبرى", text: "شبكة الطرق التجارية الرابطة بين بلاد السودان ومصر وبلاد المغرب العربي." }
    ]
  },

  // --- الوحدة الرابعة: عصر النهضة والثورة الصناعية ---
  {
    id: "gal_renaissance_art",
    title: "رواد عصر النهضة الأدبية والفنية والعمارة الإيطالية",
    unitId: 4,
    unitTitle: "الوحدة الرابعة: علم النهضة الأوربية",
    lessonId: "u4_l1",
    lessonTitle: "الدرس الأول: النهضة الأدبية والفنية في أوربا",
    category: "architecture",
    type: "RenaissanceArts",
    period: "القرن ١٤ - ١٧ الميلادي (إيطاليا وأوربا)",
    location: "فلورنسا، روما، البندقية، باريس، لندن",
    description: "رموز الإحياء الفني والعلمي: لوحة الموناليزا والعشاء الأخير لدافنشي، قبة القديس بطرس لمايكل أنجلو، واستخدام اللغات القومية في الآداب.",
    historicalDetails: [
      {
        title: "عبقرية ليوناردو دافنشي وميكائيل أنجلو",
        description: "أحدث رواد النهضة الإيطالية ثورة في المنظور الثلاثي الأبعاد والتشريح والنحت وتصميم القباب الكبرى في العمارة الكلاسيكية.",
        curriculumFact: "أشهر لوحات دافنشي: الموناليزا وعذراء الصخور والعشاء الأخير؛ وصمم أنجلو قبة كنيسة القديس بطرس بروما."
      },
      {
        title: "النهضة الأدبية واختراع الطباعة",
        description: "ساهم اختراع جوتنبرج لآلة الطباعة واستخدام اللغات القومية في تحرير الفكر ونشر مؤلفات دانتي وشكسبير ومكيافللي وتوماس مور.",
        curriculumFact: "ثورة كوبرنيكس الفلكية أثبتت دوران الأرض والكواكب حول الشمس داحضة النظريات القديمة."
      }
    ],
    hotspots: [
      { id: "r1", x: 68, y: 65, label: "القبة المعمارية الكبرى", text: "تصميم القباب الهندسية المرتفعة المستوحاة من العمارة الكلاسيكية مثل قبة بطرس بروما." },
      { id: "r2", x: 25, y: 68, label: "لوحة الألوان والفن التشكيلي", text: "إتقان مزج الألوان الزيتية والظلال لإبراز ملامح الإنسان والطبيعة بواقعية تامة." },
      { id: "r3", x: 68, y: 48, label: "برج الفانوس العلوي", text: "قمة القبة المعمارية لإدخال النور الطبيعي لبهو الصرح." }
    ]
  },
  {
    id: "gal_steam_engine",
    title: "محرك جيمس وات البخاري وقاطرة السكك الحديدية",
    unitId: 4,
    unitTitle: "الوحدة الرابعة: علم النهضة الأوربية",
    lessonId: "u4_l3",
    lessonTitle: "الدرس الثالث: الثورة الصناعية ومخترعات العصر",
    category: "invention",
    type: "SteamEngine",
    period: "١٧٦٩ - ١٨٣٠ م (بريطانيا وأوربا)",
    location: "بريطانيا، مانشستر، لندن",
    description: "الآلة البخارية التي طورها جيمس وات سنة ١٧٦٩م وقاطرة جورج ستيفنسون، المحركان الرئيسيان لانطلاق الثورة الصناعية وثورة النقل والتعدين.",
    historicalDetails: [
      {
        title: "تطوير الآلة البخارية (جيمس وات ١٧٦٩م)",
        description: "حررت الآلة البخارية المصانع من الاعتماد على مجاري الأنهار، وشغلت مناجم الفحم والحديد ومغازل النسيج بكفاءة وإنتاج ضخم غير مسبوق.",
        curriculumFact: "بدأت الثورة الصناعية في إنجلترا لتوفر الفحم والحديد ورؤوس الأموال والأيدي العاملة والاستقرار."
      },
      {
        title: "ثورة النقل والسكك الحديدية",
        description: "صمم جورج ستيفنسون القاطرة البخارية لربط المدن والموانئ ونقل البضائع والمواد الخام بأسعار منخفضة وسرعات مذهلة.",
        curriculumFact: "أعقبت البخار اختراعات القرن التاسع عشر: دينامو فارادي، هاتف غراهام بيل، لاسلكي ماركوني، ومحرك ديزل."
      }
    ],
    hotspots: [
      { id: "s1", x: 70, y: 35, label: "سحب الدخان وعادم البخار", text: "البخار المولد من غليان الماء بحرق الفحم الحجري لتوليد ضغط حركي جبار." },
      { id: "s2", x: 55, y: 55, label: "مرجل الغليان والأسطوانة", text: "جسم المرجل الصلب المقاوم للضغط العالي لتحريك المكبس." },
      { id: "s3", x: 50, y: 78, label: "العجلات الفولاذية والمكبس", text: "تحويل الحركة الترددية للمكبس إلى حركة دورانية لتسيير القاطرات والمصانع." },
      { id: "s4", x: 50, y: 90, label: "قضبان السكك الحديدية", text: "شبكة المواصلات الحديثة التي غيرت جغرافية العالم وربطت القارات بالموانئ." }
    ]
  },

  // --- الوحدة الخامسة: التربية الوطنية والمواطنة ---
  {
    id: "gal_citizenship_symbols",
    title: "أركان ومقومات الدولة السودانية وحقوق وواجبات المواطنة",
    unitId: 5,
    unitTitle: "الوحدة الخامسة: التربية الوطنية - الدولة والمواطنة",
    lessonId: "u5_l2",
    lessonTitle: "الدرس الثاني: مقومات الدولة (عناصر تكوينها)",
    category: "monument",
    type: "Citizenship",
    period: "المعاصرة والدستور الوطني",
    location: "جمهورية السودان - الخرطوم وكافة الولايات",
    description: "رموز الوحدة الوطنية، سيادة الدولة واستقلالها، مقومات تكوينها الأربعة (الشعب، الأرض، الحكومة، الدستور)، والحقوق والواجبات الدستورية المتساوية.",
    historicalDetails: [
      {
        title: "المقومات الأربعة لقيام الدولة",
        description: "الشعب الحامل للجنسية السودانية، الأرض بحدودها ومياهها وأجوائها، الحكومة الراعية للأمن والخدمات، والدستور القانون الأعلى المنظم لشكل الحكم.",
        curriculumFact: "سيادة الدولة تعني استقلالها الكامل وعدم خضوعها أو تدخل أي دولة أجنبية في قراراتها الداخلية."
      },
      {
        title: "حقوق وواجبات المواطنة الصالحة",
        description: "الحقوق السبعة: الحياة الكريمة، العمل، السكن والتنقل، التعبير، الانتخاب، التعليم، والصحة. يقابلها الواجبات الثمانية كالالتزام بالقوانين والدفاع عن الوطن والوحدة الوطنية.",
        curriculumFact: "جميع المواطنين في الدولة متساوون في الحقوق والواجبات دون أي تمييز."
      }
    ],
    hotspots: [
      { id: "c1", x: 50, y: 35, label: "قلب الوحدة والتضامن", text: "رمز التماسك الاجتماعي ونبذ القبلية والتعصب والعمل المخلص من أجل نماء السودان." },
      { id: "c2", x: 50, y: 65, label: "أيادي التلاحم والمواطنة", text: "رابطة المواطنة الدستورية التي تجمع كافة أبناء الشعب في مساواة كاملة." },
      { id: "c3", x: 30, y: 40, label: "رايات الوطن الخفاقة", text: "رمز السيادة الوطنية والاستقلال والاعتراف الدولي في المحافل الإقليمية والأمم المتحدة." }
    ]
  }
];

export const GalleryView: React.FC<GalleryViewProps> = ({
  units,
  onSelectLesson,
  onPlaySound = (_sound: "click" | "success" | "fail" | "levelup" | "pageflip") => {}
}) => {
  // Filtering states
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<number | "all">("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Lightbox Zoom Modal States
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = 100%, 1.5 = 150%, 2 = 200%, 2.5 = 250%, 3 = 300%
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const zoomContainerRef = useRef<HTMLDivElement>(null);

  // Filtered gallery items
  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      // Unit filter
      if (selectedUnitFilter !== "all" && item.unitId !== selectedUnitFilter) {
        return false;
      }
      // Category filter
      if (selectedCategoryFilter !== "all" && item.category !== selectedCategoryFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchPeriod = item.period.toLowerCase().includes(q);
        const matchUnit = item.unitTitle.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchLoc || matchPeriod || matchUnit;
      }
      return true;
    });
  }, [selectedUnitFilter, selectedCategoryFilter, searchQuery]);

  // Open Lightbox
  const handleOpenItem = (item: GalleryItem) => {
    onPlaySound("click");
    setActiveItem(item);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setActiveHotspot(null);
  };

  // Close Lightbox
  const handleCloseItem = () => {
    onPlaySound("click");
    setActiveItem(null);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setActiveHotspot(null);
  };

  // Zoom handlers
  const handleZoomIn = () => {
    onPlaySound("click");
    setZoomLevel((prev) => Math.min(prev + 0.35, 3));
  };

  const handleZoomOut = () => {
    onPlaySound("click");
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    onPlaySound("click");
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Drag / Pan handlers for zoomed image
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Navigate to corresponding lesson
  const handleGoToLesson = (unitId: number, lessonId?: string) => {
    onPlaySound("levelup");
    handleCloseItem();
    // Find index of lesson in unit
    const unitObj = units.find((u) => u.id === unitId);
    let lessonIdx = 0;
    if (unitObj && lessonId) {
      const foundIdx = unitObj.lessons.findIndex((l) => l.id === lessonId);
      if (foundIdx !== -1) {
        lessonIdx = foundIdx;
      }
    }
    onSelectLesson(unitId, lessonIdx);
  };

  // Print single artwork
  const handlePrintArtwork = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] text-slate-100 font-sans pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#17142b] via-[#1d1633] to-[#251528] rounded-3xl p-6 md:p-8 border border-amber-500/20 shadow-xl relative overflow-hidden text-right">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-serif">
              <Sparkles className="w-3.5 h-3.5" />
              <span>الأطلس التاريخي والمرئي المعتمد</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-serif text-slate-100 flex items-center gap-3">
              <span>معرض الصور والخرائط والمخططات التاريخية</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
              استكشف كافة اللوحات الفنية والمخططات الهندسية والخرائط المعتمدة لمنهج التاريخ للصف السادس. انقر على أي لوحة لتكبيرها بدقة فائقة وفحص التفاصيل الأثرية والتاريخية الدقيقة.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#110f1e]/80 p-3 rounded-2xl border border-indigo-950/60 shadow shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-6 h-6 animate-spin-once" />
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-serif">المعروضات المرئية</span>
              <span className="text-lg font-bold text-amber-300 font-serif">{GALLERY_ITEMS.length} لوحات ومخططات</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-[#141224] p-4 md:p-5 rounded-2xl border border-indigo-950/60 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Live Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن رسم، خريطة، مدينة، أو حدث..."
              className="w-full bg-[#0a0913] border border-indigo-950/80 rounded-xl pr-10 pl-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition text-right font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => {
                onPlaySound("click");
                setSelectedCategoryFilter("all");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategoryFilter === "all"
                  ? "bg-amber-700 text-white shadow"
                  : "bg-[#1d1933] text-slate-400 hover:text-slate-200"
              }`}
            >
              جميع المعروضات ({GALLERY_ITEMS.length})
            </button>
            <button
              onClick={() => {
                onPlaySound("click");
                setSelectedCategoryFilter("map");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                selectedCategoryFilter === "map"
                  ? "bg-amber-700 text-white shadow"
                  : "bg-[#1d1933] text-slate-400 hover:text-slate-200"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>خرائط ومخططات</span>
            </button>
            <button
              onClick={() => {
                onPlaySound("click");
                setSelectedCategoryFilter("architecture");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                selectedCategoryFilter === "architecture"
                  ? "bg-amber-700 text-white shadow"
                  : "bg-[#1d1933] text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>عمارة وصروح</span>
            </button>
            <button
              onClick={() => {
                onPlaySound("click");
                setSelectedCategoryFilter("invention");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                selectedCategoryFilter === "invention"
                  ? "bg-amber-700 text-white shadow"
                  : "bg-[#1d1933] text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>مخترعات وآثار</span>
            </button>
          </div>
        </div>

        {/* Unit Filter Horizontal Pills */}
        <div className="border-t border-indigo-950/40 pt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] text-slate-500 font-bold ml-2 shrink-0 font-serif">الوحدات:</span>
          <button
            onClick={() => {
              onPlaySound("click");
              setSelectedUnitFilter("all");
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedUnitFilter === "all"
                ? "bg-indigo-900/80 text-amber-300 border border-indigo-700/60"
                : "bg-[#110f1e] text-slate-400 hover:text-slate-200 border border-indigo-950"
            }`}
          >
            كافة الوحدات
          </button>
          {units.map((unit) => (
            <button
              key={unit.id}
              onClick={() => {
                onPlaySound("click");
                setSelectedUnitFilter(unit.id);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedUnitFilter === unit.id
                  ? "bg-indigo-900/80 text-amber-300 border border-indigo-700/60"
                : "bg-[#110f1e] text-slate-400 hover:text-slate-200 border border-indigo-950"
              }`}
            >
              {unit.id === 1 && "🇸🇩 الوحدة الأولى (السودان)"}
              {unit.id === 2 && "🕌 الوحدة الثانية (العباسي)"}
              {unit.id === 3 && "🌍 الوحدة الثالثة (إفريقيا)"}
              {unit.id === 4 && "🎨 الوحدة الرابعة (النهضة)"}
              {unit.id === 5 && "🛡️ الوحدة الخامسة (المواطنة)"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Gallery Cards */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-[#131122] rounded-3xl border border-indigo-950/60 space-y-3">
          <Info className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold font-serif text-slate-300">لم يتم العثور على معروضات مطابقة</h3>
          <p className="text-xs text-slate-500 font-sans">جرّب كتابة اسم مدينة أخرى أو تصفير شريط البحث والمرشحات.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedUnitFilter("all");
              setSelectedCategoryFilter("all");
            }}
            className="bg-amber-700 hover:bg-amber-600 text-white text-xs px-4 py-2 rounded-xl transition font-bold"
          >
            إعادة تعيين المرشحات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenItem(item)}
              className="group bg-[#151326] hover:bg-[#1b1833] rounded-2xl border border-indigo-950/70 hover:border-amber-500/40 p-4 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              {/* Illustration Thumbnail Container */}
              <div className="relative rounded-xl overflow-hidden bg-amber-50/90 border border-amber-200/60 p-2 group-hover:scale-[1.01] transition-transform duration-300">
                <SVGIllustration type={item.type} className="w-full h-44 pointer-events-none" />

                {/* Floating Category Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#09080f]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-indigo-900/40 text-[10px] text-amber-300 font-bold font-serif">
                  {item.category === "map" && <MapPin className="w-3 h-3 text-teal-400" />}
                  {item.category === "monument" && <Award className="w-3 h-3 text-amber-400" />}
                  {item.category === "architecture" && <Layers className="w-3 h-3 text-indigo-400" />}
                  {item.category === "invention" && <Sparkles className="w-3 h-3 text-rose-400" />}
                  <span>{item.period}</span>
                </div>

                {/* Zoom Hint Icon */}
                <div className="absolute bottom-3 left-3 bg-[#09080f]/85 backdrop-blur-md p-2 rounded-xl border border-indigo-900/40 text-amber-300 group-hover:bg-amber-600 group-hover:text-white transition shadow">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              {/* Card Meta & Texts */}
              <div className="space-y-2 text-right flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-serif">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </span>
                    <span className="text-slate-500">الوحدة {item.unitId}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-100 group-hover:text-amber-300 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Card Action footer */}
                <div className="border-t border-indigo-950/50 pt-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px] text-slate-500 font-serif">
                    {item.historicalDetails.length} نقاط تاريخية دقيقة
                  </span>
                  <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                    <span>انقر للتكبير والتفاصيل</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* LIGHTBOX MODAL WITH FULLSCREEN ZOOM & HISTORICAL HOTSPOTS */}
      {/* ========================================================= */}
      {activeItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-[fadeIn_0.2s_ease-out]"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseItem();
          }}
        >
          <div className="bg-[#121020] border border-amber-500/30 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative text-right">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-indigo-950/80 bg-[#16142a] flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseItem}
                  className="p-2 rounded-xl bg-[#0d0c18] hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 transition border border-indigo-950 cursor-pointer"
                  title="إغلاق المعاينة"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={handlePrintArtwork}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d0c18] hover:bg-[#1a1730] text-slate-300 hover:text-amber-300 transition border border-indigo-950 text-xs font-bold cursor-pointer"
                  title="طباعة اللوحة التعليمية"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة</span>
                </button>
              </div>

              <div className="text-right flex-1 min-w-0">
                <span className="text-[11px] text-amber-400 font-bold font-serif block truncate">
                  {activeItem.unitTitle}
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-100 truncate">
                  {activeItem.title}
                </h3>
              </div>
            </div>

            {/* Modal Main Body: Zoom Canvas & Details Panel */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Column (Canvas & Interactive Zoom View) */}
              <div className="lg:col-span-7 bg-[#0b0a14] p-4 sm:p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-l border-indigo-950/70 relative select-none min-h-[340px]">
                {/* Floating Zoom Control Bar */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#17142c]/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-indigo-900/60 shadow-lg">
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    className="p-1.5 rounded-lg bg-[#0d0c18] hover:bg-[#201c3d] text-slate-200 hover:text-amber-300 disabled:opacity-40 transition cursor-pointer"
                    title="تكبير (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold text-amber-300 px-2 min-w-[45px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className="p-1.5 rounded-lg bg-[#0d0c18] hover:bg-[#201c3d] text-slate-200 hover:text-amber-300 disabled:opacity-40 transition cursor-pointer"
                    title="تصغير (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-4 bg-indigo-950/80 mx-0.5" />
                  <button
                    onClick={handleResetZoom}
                    className="p-1.5 rounded-lg bg-[#0d0c18] hover:bg-[#201c3d] text-slate-200 hover:text-amber-300 transition cursor-pointer"
                    title="إعادة ضبط الحجم (100%)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  {activeItem.hotspots && (
                    <button
                      onClick={() => setShowHotspots(!showHotspots)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                        showHotspots
                          ? "bg-amber-600 text-white"
                          : "bg-[#0d0c18] text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {showHotspots ? "إخفاء المعالم" : "إظهار المعالم"}
                    </button>
                  )}
                </div>

                {/* The Interactive Zoomable Canvas Container */}
                <div
                  ref={zoomContainerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className={`w-full max-w-lg aspect-[16/10] bg-amber-50 rounded-2xl border-2 border-amber-200 overflow-hidden relative shadow-inner flex items-center justify-center ${
                    zoomLevel > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                  }`}
                >
                  <div
                    style={{
                      transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                      transition: isPanning ? "none" : "transform 0.2s ease-out",
                      transformOrigin: "center center"
                    }}
                    className="w-full h-full relative flex items-center justify-center p-2"
                  >
                    <SVGIllustration type={activeItem.type} className="w-full h-full" />

                    {/* Historical Hotspot Pins */}
                    {showHotspots && activeItem.hotspots && activeItem.hotspots.map((spot, idx) => (
                      <div
                        key={spot.id}
                        style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlaySound("click");
                          setActiveHotspot(activeHotspot === spot.id ? null : spot.id);
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
                      >
                        {/* Pin Dot with pulsing aura */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg transition-transform ${
                          activeHotspot === spot.id
                            ? "bg-amber-500 text-slate-950 scale-125 ring-4 ring-amber-400/40 animate-pulse"
                            : "bg-indigo-900 text-amber-300 border border-amber-400/60 hover:scale-110"
                        }`}>
                          {idx + 1}
                        </div>

                        {/* Hover/Active Tooltip */}
                        {(activeHotspot === spot.id) && (
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#121020] text-slate-100 p-2.5 rounded-xl border border-amber-500/50 shadow-2xl w-48 text-right z-40 pointer-events-auto animate-[fadeIn_0.15s_ease-out]">
                            <span className="font-serif font-bold text-amber-300 text-xs block mb-1">
                              {spot.label}
                            </span>
                            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                              {spot.text}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Canvas Advice */}
                <span className="text-[11px] text-slate-500 font-sans mt-3">
                  {zoomLevel > 1 
                    ? "💡 يمكنك سحب اللوحة بالماوس أو اللمس للتحرك وتفحص التفاصيل الدقيقة." 
                    : "💡 انقر على أزرار التكبير (+) أو أرقام المعالم لاستكشاف الشرح التاريخي."}
                </span>
              </div>

              {/* Right Column (Historical Deep-Dive & Curriculum Lesson Connection) */}
              <div className="lg:col-span-5 p-5 sm:p-6 space-y-5 bg-[#141224] text-right overflow-y-auto">
                {/* Location & Period metadata */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0b0a14] p-3 rounded-xl border border-indigo-950/60 space-y-1">
                    <span className="text-[10px] text-slate-500 font-serif block">الحقبة التاريخية:</span>
                    <span className="text-xs font-bold text-slate-200 block">{activeItem.period}</span>
                  </div>
                  <div className="bg-[#0b0a14] p-3 rounded-xl border border-indigo-950/60 space-y-1">
                    <span className="text-[10px] text-slate-500 font-serif block">الموقع الجغرافي:</span>
                    <span className="text-xs font-bold text-amber-400 block truncate">{activeItem.location}</span>
                  </div>
                </div>

                {/* Detailed Overview */}
                <div className="space-y-1.5">
                  <h4 className="font-serif font-bold text-sm text-slate-200">نبذة تاريخية شاملة:</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans bg-[#0b0a14] p-3.5 rounded-xl border border-indigo-950/50">
                    {activeItem.description}
                  </p>
                </div>

                {/* Educational Curriculum Breakdown Points */}
                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>شواهد وحقائق من صميم المنهج:</span>
                  </h4>

                  <div className="space-y-2.5">
                    {activeItem.historicalDetails.map((detail, idx) => (
                      <div
                        key={idx}
                        className="bg-[#0b0a14] p-3 rounded-xl border border-indigo-950/60 space-y-1.5"
                      >
                        <h5 className="font-serif font-bold text-xs text-slate-200 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span>{detail.title}</span>
                        </h5>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          {detail.description}
                        </p>
                        <div className="bg-amber-500/5 p-2 rounded-lg border border-amber-500/15 text-[11px] text-amber-200/90 font-sans">
                          <span className="font-bold text-amber-400 ml-1 font-serif">المعلومة المقررة:</span>
                          {detail.curriculumFact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call-to-action: Go to Lesson Button */}
                <div className="border-t border-indigo-950/60 pt-4">
                  <button
                    onClick={() => handleGoToLesson(activeItem.unitId, activeItem.lessonId)}
                    className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white p-3 rounded-xl font-bold font-serif text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>الذهاب إلى الدرس في الكتاب المدرسي 📖</span>
                  </button>
                  {activeItem.lessonTitle && (
                    <span className="text-[11px] text-slate-400 block text-center mt-2 font-serif">
                      {activeItem.lessonTitle}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
