/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import L from "leaflet";
import { 
  FileText, Printer, Check, CheckSquare, X, Lock, Unlock, 
  Heart, Layers, Eye, RefreshCw, Star, Info, HelpCircle, Save 
} from "lucide-react";
import { playSound } from "./SoundEffects";
import { Question, Unit, QuestionType } from "../types";
import { generateDynamicQuestions } from "../utils/questionGenerator";

interface WorksheetGeneratorProps {
  units: Unit[];
  questions: Question[];
  favoriteLessons: string[];
  onToggleFavoriteLesson: (lessonId: string) => void;
  onPlaySound: (type: "click" | "success" | "fail" | "levelup") => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

// Fixed Passcode for Watermark Removal
const WATERMARK_PASSCODE = "20302060";

// Diagram Options
interface DiagramConfig {
  id: string;
  title: string;
  description: string;
  imageAlt: string;
  labels: { id: string; name: string; x: number; y: number }[];
}

const DIAGRAMS_LIST: DiagramConfig[] = [
  {
    id: "admin_struct",
    title: "هيكل الحكم الإداري في عهد المديريات (شكل 1-4)",
    description: "وزع المكونات الحكومية الصحيحة في صناديق هيكل الحكم التركي المصري للمديرية.",
    imageAlt: "هيكل المديرية",
    labels: [
      { id: "lbl1", name: "مدير المديرية", x: 48, y: 15 },
      { id: "lbl2", name: "الوكيل والمعاونون والكتيبة", x: 18, y: 46 },
      { id: "lbl3", name: "القاضي والمفتي", x: 74, y: 46 },
      { id: "lbl4", name: "مجلس الأعيان", x: 20, y: 80 },
      { id: "lbl5", name: "الضبطية - قسم الشرطة", x: 75, y: 80 }
    ]
  },
  {
    id: "campaign_map",
    title: "خارطة بلاد السودان ومسار حملات الغزو (1820م - 1821م)",
    description: "حدد المحطات والمدن الإستراتيجية المهمة التي مرت بها قوّات محمد علي باشا.",
    imageAlt: "خريطة حملات الغزو",
    labels: [
      { id: "w1", name: "وادي حلفا", x: 42, y: 18 },
      { id: "w2", name: "دنقلا", x: 28, y: 36 },
      { id: "w3", name: "كورتي", x: 48, y: 46 },
      { id: "w4", name: "شندي", x: 55, y: 58 },
      { id: "w5", name: "الخرطوم", x: 53, y: 70 },
      { id: "w6", name: "سنار", x: 62, y: 84 }
    ]
  },
  {
    id: "sudan_states",
    title: "خريطة أقاليم ومديريات السودان التاريخية بجيرانه (شكل 1/5)",
    description: "تعرف على الأقاليم الكبرى لجمهورية السودان وحدود الجغرافيا الطبيعية.",
    imageAlt: "خريطة أقاليم السودان",
    labels: [
      { id: "reg1", name: "الولاية الشمالية", x: 38, y: 22 },
      { id: "reg2", name: "ولاية نهر النيل", x: 59, y: 34 },
      { id: "reg3", name: "ولاية الخرطوم", x: 55, y: 50 },
      { id: "reg4", name: "ولاية كسلا", x: 78, y: 46 },
      { id: "reg5", name: "بلاد كردفان", x: 40, y: 64 },
      { id: "reg6", name: "أقاليم دارفور", x: 15, y: 56 },
      { id: "reg7", name: "ولاية سنار", x: 65, y: 66 }
    ]
  }
];

// Helper to partition generated elements into printable mock "A4 Pages"
interface CompiledWorksheet {
  pageNumber: number;
  title: string;
  scopeText: string;
  questions: {
    type: string;
    text: string;
    options?: string[];
    correctAnswer: string;
    matchPairs?: { left: string; right: string }[];
    diagramData?: DiagramConfig;
  }[];
}

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({
  units,
  questions,
  favoriteLessons,
  onToggleFavoriteLesson,
  onPlaySound,
  score,
  setScore
}) => {
  // Filters Settings State
  const [scopeType, setScopeType] = useState<"all" | "unit" | "lesson" | "favorites">("all");
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);

  // Question type selections
  const [typesSelected, setTypesSelected] = useState({
    mcq: true,
    tf: true,
    blank: true,
    match: true,
    essay: true,
    diagram: true
  });

  // Watermark States
  const [removeWatermark, setRemoveWatermark] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [showPasswordBox, setShowPasswordBox] = useState<boolean>(false);

  // Mode state: Either Preview printable sheet or Interactive Play solving
  const [worksheetMode, setWorksheetMode] = useState<"print" | "interactive">("interactive");

  // Output Generated Sheets
  const [generatedPages, setGeneratedPages] = useState<CompiledWorksheet[]>([]);

  // Interactive Answers State (Map of composite key like "page-questionIndex" -> selected answer value)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  // Matching active selection tracker
  const [activeMatchSelection, setActiveMatchSelection] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [evaluationScore, setEvaluationScore] = useState<{ correct: number; total: number; percentage: number } | null>(null);

  // Keep lesson option synced when selectedUnitId shifts
  useEffect(() => {
    const parent = units.find(u => u.id === selectedUnitId);
    if (parent && parent.lessons.length > 0) {
      setSelectedLessonId(parent.lessons[0].id);
    }
  }, [selectedUnitId]);

  // Actually build the worksheet data according to filters
  const handleGenerateWorksheets = () => {
    onPlaySound("levelup");
    setIsEvaluated(false);
    setEvaluationScore(null);
    setUserAnswers({});

    // 1 & 2. Get dynamically generated non-repeating questions pool up to exact target quantity
    const itemsPerPage = 4; // neat density for worksheets
    const maxNeededQuestions = pageCount * itemsPerPage;

    const selectedQuestions = generateDynamicQuestions(maxNeededQuestions, {
      type: scopeType === "favorites" ? "comprehensive" : scopeType === "unit" ? "unit" : scopeType === "lesson" ? "lesson" : "comprehensive",
      unitId: scopeType === "unit" ? selectedUnitId : undefined,
      lessonId: scopeType === "lesson" ? selectedLessonId : undefined,
      typesSelected: {
        mcq: typesSelected.mcq,
        tf: typesSelected.tf,
        blank: typesSelected.blank,
        match: typesSelected.match,
        essay: typesSelected.essay
      }
    });

    const scopeLabel = 
      scopeType === "favorites" ? "الدروس المفضلة ⭐" : 
      scopeType === "unit" ? `الوحدة ${selectedUnitId} - ${units.find(u => u.id === selectedUnitId)?.title}` : 
      scopeType === "lesson" ? `درس محدد: ${units.flatMap(u => u.lessons).find(l => l.id === selectedLessonId)?.title}` : 
      "كامل المقرر الدراسي للمرحلة الابتدائية التاريخية";

    let compiled: CompiledWorksheet[] = [];

    for (let pNum = 1; pNum <= pageCount; pNum++) {
      const startIdx = (pNum - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const pageQuestions: CompiledWorksheet['questions'] = selectedQuestions.slice(startIdx, endIdx).map(q => ({
        type: q.type,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        matchPairs: q.matchPairs
      }));

      // If diagrams are toggled, we can insert exactly ONE diagram labeling question block on each page
      if (typesSelected.diagram && DIAGRAMS_LIST.length > 0) {
        const diagramIndex = (pNum - 1) % DIAGRAMS_LIST.length;
        pageQuestions.push({
          type: "diagram",
          text: `أعد تسمية وتوجيه البيانات على الشكل الهندسي التوضيحي التالي الخاص بـ: (${DIAGRAMS_LIST[diagramIndex].title})`,
          correctAnswer: "",
          diagramData: DIAGRAMS_LIST[diagramIndex]
        });
      }

      compiled.push({
        pageNumber: pNum,
        title: `ورقة العمل والتقييم الذاتي - صفحة ${pNum}`,
        scopeText: scopeLabel,
        questions: pageQuestions
      });
    }

    setGeneratedPages(compiled);
  };

  // Generate automatically on mount or tab focus
  useEffect(() => {
    if (generatedPages.length === 0) {
      handleGenerateWorksheets();
    }
  }, []);

  // Watermark removal authorization check
  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === WATERMARK_PASSCODE) {
      setRemoveWatermark(true);
      setPasswordError(false);
      setShowPasswordBox(false);
      onPlaySound("success");
    } else {
      setPasswordError(true);
      onPlaySound("fail");
    }
  };

  const handlePrint = () => {
    onPlaySound("click");
    window.print();
  };

  // Evaluate interactive answers
  const handleEvaluateInteractive = () => {
    onPlaySound("levelup");
    let correctCount = 0;
    let totalQuestionsGraded = 0;

    generatedPages.forEach((page) => {
      page.questions.forEach((q, idx) => {
        const k = `${page.pageNumber}-${idx}`;
        const answer = userAnswers[k];

        if (q.type === "diagram") {
          // Diagram verification
          q.diagramData?.labels.forEach((lbl) => {
            const compositeKey = `${k}-diagram-${lbl.id}`;
            const userChoice = userAnswers[compositeKey];
            if (userChoice === lbl.name) {
              correctCount++;
            }
            totalQuestionsGraded++;
          });
        } else {
          // Regular types
          totalQuestionsGraded++;
          if (answer && answer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
            correctCount++;
          }
        }
      });
    });

    const percent = totalQuestionsGraded > 0 ? Math.round((correctCount / totalQuestionsGraded) * 100) : 100;
    setEvaluationScore({
      correct: correctCount,
      total: totalQuestionsGraded,
      percentage: percent
    });
    setIsEvaluated(true);

    // Reward points for score boost!
    if (percent >= 50) {
      const earned = Math.round(percent / 2);
      setScore(prev => prev + earned);
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="no-print bg-[#121020] rounded-2xl border border-indigo-950/80 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none">
        <div>
          <span className="bg-amber-500/10 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/20 font-sans">
            منشئ الأوراق التعليمية المتكاملة
          </span>
          <h2 className="text-2xl font-bold font-serif text-amber-400 mt-1.5 flex items-center gap-2">
            <FileText className="w-7 h-7 text-amber-500 shrink-0" />
            توليد كراسات وأوراق العمل التفاعلية والتحضيرية
          </h2>
          <p className="text-slate-300 text-sm mt-1 font-sans">
            اختر نطاق المنهج، وصنف نوع الأسئلة المفضلة، من السواقي حتى الثورات، مع ميزات الطباعة الاحترافية A4 والحل التفاعلي الفوري!
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => {
              onPlaySound("click");
              setWorksheetMode("interactive");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
              worksheetMode === "interactive"
                ? "bg-amber-500 text-slate-950 font-black shadow-md"
                : "bg-[#18152c] text-indigo-200 border border-indigo-950/50 hover:bg-[#201c3e]"
            }`}
          >
            🧩 الحل التفاعلي بالموقع
          </button>
          <button
            onClick={() => {
              onPlaySound("click");
              setWorksheetMode("print");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
              worksheetMode === "print"
                ? "bg-amber-500 text-slate-950 font-black shadow-md"
                : "bg-[#18152c] text-indigo-200 border border-indigo-950/50 hover:bg-[#201c3e]"
            }`}
          >
            🖨️ نمط أوراق الطباعة A4
          </button>
        </div>
      </div>

      {/* FILTER & GENERATION PANEL */}
      <div className="no-print bg-[#15122b] rounded-2xl border border-indigo-950/80 p-5 space-y-4 shadow-lg">
        <h3 className="text-amber-400 font-serif font-bold text-lg flex items-center gap-1.5 border-b border-indigo-950/50 pb-2">
          <span>⚙️ إعدادات ورقة العمل والأسئلة</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Scope Filters */}
          <div className="space-y-1.5">
            <label className="text-slate-300 text-xs font-semibold">نطاق مادة الدرس للأسئلة:</label>
            <select
              value={scopeType}
              onChange={(e) => {
                onPlaySound("click");
                setScopeType(e.target.value as any);
              }}
              className="w-full bg-[#1b1930] border border-indigo-950 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="all">كامل المنهج الدراسي 📘</option>
              <option value="favorites">الدروس المفضلة فحسب ⭐ ({favoriteLessons.length})</option>
              <option value="unit">وحدة معينة كلياً 📓</option>
              <option value="lesson">درس معين بشكل مخصص 📄</option>
            </select>
          </div>

          {/* Unit Selection (conditional) */}
          {scopeType === "unit" && (
            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-semibold">اختر الوحدة كمصدر:</label>
              <select
                value={selectedUnitId}
                onChange={(e) => {
                  onPlaySound("click");
                  setSelectedUnitId(parseInt(e.target.value, 10));
                }}
                className="w-full bg-[#1b1930] border border-indigo-950 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    وحدة {unit.id}: {unit.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Lesson Selection (conditional) */}
          {scopeType === "lesson" && (
            <>
              <div className="space-y-1.5">
                <label className="text-slate-300 text-xs font-semibold">الوحدة الحاضنة:</label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => {
                    onPlaySound("click");
                    setSelectedUnitId(parseInt(e.target.value, 10));
                  }}
                  className="w-full bg-[#1b1930] border border-indigo-950 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      وحدة {unit.id}: {unit.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 text-xs font-semibold">الدرس المعين المستهدف:</label>
                <select
                  value={selectedLessonId}
                  onChange={(e) => {
                    onPlaySound("click");
                    setSelectedLessonId(e.target.value);
                  }}
                  className="w-full bg-[#1b1930] border border-indigo-950 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-sans"
                >
                  {units
                    .find((u) => u.id === selectedUnitId)
                    ?.lessons.map((les) => (
                      <option key={les.id} value={les.id}>
                        {les.title}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          {/* Lesson count up to 20 sheets */}
          <div className="space-y-1.5">
            <label className="text-slate-300 text-xs font-semibold">عدد أوراق عمل الكراسة (حتى 20):</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="20"
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#1b1930] rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="bg-[#1b1930] border border-indigo-950 px-3 py-1.5 text-xs text-amber-400 rounded-lg font-bold min-w-[40px] text-center">
                {pageCount} ورقة
              </span>
            </div>
          </div>
        </div>

        {/* Question Type Selection Checkboxes */}
        <div className="space-y-1.5">
          <label className="text-slate-300 text-xs font-semibold block">أنواع الأسئلة المضمنة:</label>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 bg-[#1b1930]/40 p-3 rounded-xl border border-indigo-950/45">
            <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={typesSelected.mcq}
                onChange={(e) => setTypesSelected({ ...typesSelected, mcq: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500 w-4 h-4"
              />
              <span>صح أو خطأ / اختيار متعدد (MCQ)</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={typesSelected.tf}
                onChange={(e) => setTypesSelected({ ...typesSelected, tf: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500 w-4 h-4"
              />
              <span>الصح والخطأ المباشر (T / F)</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={typesSelected.blank}
                onChange={(e) => setTypesSelected({ ...typesSelected, blank: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500 w-4 h-4"
              />
              <span>إكمال الهياكل والفراغات</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={typesSelected.essay}
                onChange={(e) => setTypesSelected({ ...typesSelected, essay: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500 w-4 h-4"
              />
              <span className="text-amber-400 font-semibold">الأسئلة المقالية (مقال تاريخي) ✍️</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={typesSelected.match}
                disabled // We utilize a clean dataset match pattern
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500 w-4 h-4 opacity-50"
              />
              <span className="opacity-50">توصيل الكلمات والقوائم (تلقائي)</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={typesSelected.diagram}
                onChange={(e) => setTypesSelected({ ...typesSelected, diagram: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500 w-4 h-4"
              />
              <span className="text-teal-400 font-semibold">إيضاح مكونات الرسم التاريخي (مهم) 🗺️</span>
            </label>
          </div>
        </div>

        {/* GENERATE SUBMIT BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerateWorksheets}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-sm px-6 py-3 rounded-xl transition duration-150 transform hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw className="w-4 h-4 shrink-0" />
            <span>تحديث وتوليد الأوراق التعليمية الحالية 🚀</span>
          </button>
        </div>
      </div>

      {/* NO QUESTIONS WARNING */}
      {scopeType === "favorites" && favoriteLessons.length === 0 && (
        <div className="no-print bg-amber-950/40 border border-amber-600/30 text-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">قائمة المفضلة لديك فارغة حالياً</h4>
            <p className="text-xs text-amber-300 font-sans leading-relaxed">
              يرجى الذهاب إلى قسم "المنهج والوحدات" والنقر على رمز القلب الشفاف المكتوب عليه (أضف للمفضلة) الموجود بجوار أي درس، وسوف يقوم هذا المولد فوراً باستخراج الأسئلة المطابقة لدروسك المفضلة!
            </p>
          </div>
        </div>
      )}

      {/* PASSWORD BOX & WATERMARK STATE BAR */}
      {worksheetMode === "print" && (
        <div className="no-print bg-[#181530] rounded-2xl p-4 border border-indigo-950 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${removeWatermark ? "bg-emerald-950/50 text-emerald-400" : "bg-amber-950/50 text-amber-400"}`}>
              {removeWatermark ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-200">وضعية أوراق العمل الاحترافية المائية العادلة</h4>
              <p className="text-xs text-slate-400">
                {removeWatermark 
                  ? "✅ تم إلغاء العلامة المائية بنجاح، الأوراق صالحة للحفظ والطباعة النظيفة." 
                  : "🔒 تحتوي الأوراق على علامة مائية للموقع. يمكنك إلغاء العلامة المائية بكلمة مرور المعلم السرية لعام 2030."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {!removeWatermark && !showPasswordBox && (
              <button
                onClick={() => {
                  onPlaySound("click");
                  setShowPasswordBox(true);
                }}
                className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 hover:text-white px-4 py-2 border border-indigo-900 rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
              >
                🔐 إدخال الباسورد لإزالة العلامة المائية
              </button>
            )}

            {showPasswordBox && (
              <form onSubmit={handleVerifyPasscode} className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="password"
                  placeholder="باسورد الحماية المكون من 8 أرقام..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="bg-[#110e1a] border border-indigo-950 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                >
                  تأكيد
                </button>
              </form>
            )}

            {removeWatermark && (
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-900 px-3 py-1 text-center font-bold rounded-lg leading-none shrink-0">
                العلامة المائية ملغاة 🔓
              </span>
            )}

            <button
              onClick={handlePrint}
              disabled={generatedPages.length === 0}
              className="bg-sky-600 hover:bg-sky-500 text-white font-serif font-bold text-xs px-4 py-2 bg-sky-700 hover:bg-sky-600 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>أمر الطباعة المباشر 🖨️</span>
            </button>
          </div>
        </div>
      )}

      {/* WORKSHTEET DISPLAY ZONE */}
      {generatedPages.length > 0 && (
        <div className="space-y-8">
          {worksheetMode === "interactive" ? (
            /* =======================================
               A. INTERACTIVE SOLVING MODE
               ======================================= */
            <div className="bg-[#121020] rounded-2xl border border-indigo-950 p-6 space-y-6 shadow-inner">
              <div className="border-b border-indigo-950/60 pb-4">
                <span className="text-amber-400 font-serif font-extrabold text-xl">
                  📝 حل الكراسة تفاعلياً بالموقع
                </span>
                <p className="text-slate-400 text-xs mt-1">
                  وفرنا لوحة ذكية لحل وتصحيح كامل محتوى أوراق العمل آلياً في المتصفح والحصول على التغذية الراجعة فوراً!
                </p>
              </div>

              {/* Loop generated virtual pages */}
              {generatedPages.map((page) => (
                <div key={page.pageNumber} className="bg-[#16132d]/40 rounded-xl p-5 border border-indigo-950/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-950/30 pb-2">
                    <h4 className="text-slate-200 font-bold text-sm flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#1b1930] border border-amber-500/20 text-amber-400 rounded flex items-center justify-center text-xs">
                        {page.pageNumber}
                      </span>
                      {page.title}
                    </h4>
                    <span className="text-xs text-slate-400">{page.scopeText}</span>
                  </div>

                  {/* Page questions */}
                  <div className="space-y-6">
                    {page.questions.map((q, idx) => {
                      const ansKey = `${page.pageNumber}-${idx}`;
                      const userChoice = userAnswers[ansKey];

                      return (
                        <div key={idx} className="bg-[#110e1a]/40 p-4 rounded-lg border border-indigo-950/30 space-y-3 font-sans">
                          {/* Question header */}
                          <div className="flex items-start gap-2">
                            <span className="text-slate-400 font-bold text-xs shrink-0 mt-0.5">
                              س{idx + 1}:
                            </span>
                            <span className="text-slate-100 font-semibold text-xs leading-relaxed">
                              {q.text}
                            </span>
                          </div>

                          {/* Render input elements according to type */}
                          {q.type === QuestionType.MCQ && q.options && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1.5 font-serif">
                              {q.options.map((opt) => {
                                const isSelected = userChoice === opt;
                                return (
                                  <button
                                    key={opt}
                                    disabled={isEvaluated}
                                    onClick={() => {
                                      onPlaySound("click");
                                      setUserAnswers({ ...userAnswers, [ansKey]: opt });
                                    }}
                                    className={`text-right p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                                      isSelected
                                        ? "bg-amber-500/10 border-amber-500 text-amber-300"
                                        : "bg-[#1b1930]/40 border-indigo-950 hover:border-amber-500/30 text-slate-300"
                                    }`}
                                  >
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {q.type === QuestionType.TRUE_FALSE && (
                            <div className="flex items-center gap-3 pt-1">
                              {["صواب", "خطأ"].map((opt) => {
                                const isSelected = userChoice === opt;
                                return (
                                  <button
                                    key={opt}
                                    disabled={isEvaluated}
                                    onClick={() => {
                                      onPlaySound("click");
                                      setUserAnswers({ ...userAnswers, [ansKey]: opt });
                                    }}
                                    className={`px-4 py-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                                      isSelected
                                        ? "bg-amber-500/10 border-amber-500 text-amber-300"
                                        : "bg-[#1b1930]/45 border-indigo-950 hover:border-amber-500/30 text-slate-300"
                                    }`}
                                  >
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {q.type === QuestionType.FILL_BLANK && (
                            <div className="pt-1.5">
                              <input
                                type="text"
                                disabled={isEvaluated}
                                placeholder="اكتب الكلمة أو العبارة المناسبة في الفراغ..."
                                value={userChoice || ""}
                                onChange={(e) => setUserAnswers({ ...userAnswers, [ansKey]: e.target.value })}
                                className="w-full font-serif bg-[#18152c]/80 border border-indigo-950 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                              />
                            </div>
                          )}

                          {q.type === QuestionType.ESSAY && (
                            <div className="pt-2 space-y-3">
                              <textarea
                                disabled={isEvaluated}
                                placeholder="اكتب مقالك التاريخي هنا بالتنمية والكفاءة العلمية والمقارنة..."
                                value={userChoice || ""}
                                onChange={(e) => setUserAnswers({ ...userAnswers, [ansKey]: e.target.value })}
                                className="w-full h-32 font-serif bg-[#18152c]/85 border border-indigo-950 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400 placeholder:text-slate-500 leading-relaxed outline-none"
                              />
                              {isEvaluated && (
                                <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-right space-y-2 animate-[fadeIn_0.4s_ease-out]">
                                  <h6 className="text-[11px] font-bold text-amber-400 font-serif">النموذج المقالي المعتمد للمراجعة والمقارنة:</h6>
                                  <p className="text-[11px] text-slate-250 whitespace-pre-wrap font-serif leading-relaxed">
                                    {q.correctAnswer}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {q.type === "diagram" && q.diagramData && (
                            <div className="space-y-4">
                              <p className="text-xs text-amber-300/90 font-serif leading-relaxed">
                                {q.diagramData.description}
                              </p>

                              {/* Simulated Diagram Container with Interactive overlays */}
                              <div className="relative bg-[#16132d] rounded-xl border border-indigo-950/80 p-4 overflow-hidden min-h-[300px] flex items-center justify-center font-serif">
                                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                
                                {/* SVG Illustration of Diagram */}
                                <div className="relative w-full max-w-md h-[240px] border border-dashed border-indigo-900/30 rounded-lg bg-[#0e0d1a]/80 p-4">
                                  {q.diagramData.id === "admin_struct" && (
                                    <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                                      <div className="w-full flex justify-center">
                                        <div className="w-32 h-10 border border-amber-500/40 rounded flex items-center justify-center bg-amber-500/5">
                                          <span className="text-[10px] text-slate-400">صندوق 1 (رئيس)</span>
                                        </div>
                                      </div>
                                      <div className="w-full flex justify-between">
                                        <div className="w-28 h-10 border border-indigo-500/40 rounded flex items-center justify-center bg-indigo-500/5">
                                          <span className="text-[10px] text-slate-400">صندوق 2 (مساعد يمين)</span>
                                        </div>
                                        <div className="w-28 h-10 border border-indigo-500/40 rounded flex items-center justify-center bg-indigo-500/5">
                                          <span className="text-[10px] text-slate-400">صندوق 3 (مساعد يسار)</span>
                                        </div>
                                      </div>
                                      <div className="w-full flex justify-between">
                                        <div className="w-28 h-10 border border-slate-500/40 rounded flex items-center justify-center bg-slate-500/5">
                                          <span className="text-[10px] text-slate-400">صندوق 4 (مجلس استشاري)</span>
                                        </div>
                                        <div className="w-28 h-10 border border-slate-500/40 rounded flex items-center justify-center bg-slate-500/5">
                                          <span className="text-[10px] text-slate-400">صندوق 5 (شرطة وضبطية)</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {q.diagramData.id === "campaign_map" && (
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                      {/* Vertical winding river Representation */}
                                      <svg viewBox="0 0 200 200" className="w-32 h-full stroke-blue-500 stroke-2 fill-none opacity-40 pointer-events-none">
                                        <path d="M 100,0 C 90,40 120,80 90,120 C 80,140 110,170 100,200" strokeWidth="4" />
                                        <path d="M 100,45 L 80,30 M 100,45 L 120,30" strokeWidth="3" />
                                      </svg>
                                    </div>
                                  )}

                                  {q.diagramData.id === "sudan_states" && (
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                      {/* Giant Map Shape placeholder */}
                                      <div className="w-24 h-32 border border-amber-500/20 bg-amber-500/5 rounded-full filter blur-[1px] opacity-35"></div>
                                    </div>
                                  )}

                                  {/* Dynamic Labels Dropdowns Placement */}
                                  {q.diagramData.labels.map((lbl) => {
                                    const selectKey = `${ansKey}-diagram-${lbl.id}`;
                                    const userSelected = userAnswers[selectKey] || "";

                                    return (
                                      <div
                                        key={lbl.id}
                                        className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                                        style={{ left: `${lbl.x}%`, top: `${lbl.y}%` }}
                                      >
                                        <select
                                          value={userSelected}
                                          disabled={isEvaluated}
                                          onChange={(e) => {
                                            onPlaySound("click");
                                            setUserAnswers({ ...userAnswers, [selectKey]: e.target.value });
                                          }}
                                          className={`bg-slate-900 border text-[10px] md:text-xs rounded px-2 py-1 focus:outline-none select-none max-w-[130px] shadow ${
                                            userSelected 
                                              ? "border-amber-500 text-amber-300 font-bold" 
                                              : "border-indigo-950 text-slate-400"
                                          }`}
                                        >
                                          <option value="">-- حدد المكون --</option>
                                          {q.diagramData?.labels.map((lOpt) => (
                                            <option key={lOpt.id} value={lOpt.name}>
                                              {lOpt.name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Instant answer corrections feedback (Shown only after evaluation) */}
                          {isEvaluated && (
                            <div className="mt-2 text-xs p-3 rounded-lg flex items-start gap-2 select-none">
                              {q.type !== "diagram" ? (
                                (userChoice || "").trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() ? (
                                  <div className="bg-emerald-950/60 border border-emerald-900 text-emerald-400 p-2 rounded-lg w-full flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>صحيح! الإجابة هي: ({q.correctAnswer})</span>
                                  </div>
                                ) : (
                                  <div className="bg-red-950/60 border border-red-900 text-red-400 p-2 rounded-lg w-full flex items-center gap-2">
                                    <X className="w-4 h-4 text-red-400 shrink-0" />
                                    <span>خطأ! الإجابة الصحيحة هي: ({q.correctAnswer}) {userChoice ? `وإجابتك: (${userChoice})` : ""}</span>
                                  </div>
                                )
                              ) : (
                                // Diagram grading review
                                <div className="bg-slate-900/40 border border-indigo-950/40 p-2.5 rounded-lg w-full space-y-1 text-slate-300">
                                  <h5 className="font-bold text-amber-500">تقييم البيانات على الرسمة:</h5>
                                  <ul className="list-disc list-inside space-y-1 font-serif">
                                    {q.diagramData?.labels.map((lbl) => {
                                      const selectKey = `${ansKey}-diagram-${lbl.id}`;
                                      const val = userAnswers[selectKey] || "";
                                      const isCorrect = val === lbl.name;

                                      return (
                                        <li key={lbl.id} className="text-[11px] flex items-center gap-1.5">
                                          {isCorrect ? (
                                            <span className="text-emerald-400">✔ (صحيح)</span>
                                          ) : (
                                            <span className="text-red-400">✘ (خطأ، الإجابة: {lbl.name})</span>
                                          )}
                                          <span>{lbl.name} {val ? `(حددت: ${val})` : `(لم تجب)`}</span>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* EVALUATION ACTION BAR */}
              <div className="flex flex-col items-center justify-center space-y-4 pt-6 border-t border-indigo-950 select-none">
                {!isEvaluated ? (
                  <button
                    onClick={handleEvaluateInteractive}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-black text-base px-10 py-4 rounded-xl shadow-lg border border-transparent hover:scale-102 active:scale-98 transition duration-150 cursor-pointer flex items-center gap-2"
                  >
                    <CheckSquare className="w-5 h-5 shrink-0" />
                    <span>تصحيح الإجابات تفاعلياً وحساب الدرجة 📊</span>
                  </button>
                ) : (
                  <div className="space-y-4 w-full text-center">
                    {evaluationScore && (
                      <div className="bg-[#19163d] border border-amber-500/20 max-w-md mx-auto rounded-2xl p-6 shadow-md space-y-3">
                        <div className="text-yellow-400 text-4xl font-black">
                          {evaluationScore.percentage}%
                        </div>
                        <h4 className="font-bold text-xl font-serif text-slate-200">
                          {evaluationScore.percentage >= 80 ? "🏆 أداء عبقري وممتاز!" : evaluationScore.percentage >= 50 ? "👍 عمل رائع وناجح!" : "📚 تحتاج لمزيد من المراجعة والدرس!"}
                        </h4>
                        <p className="text-xs text-slate-300 font-sans">
                          لقد أجبت بشكل صحيح على <strong className="text-emerald-400 font-bold">{evaluationScore.correct}</strong> من أصل <strong className="text-slate-100 font-bold">{evaluationScore.total}</strong> سؤال فرعي وتقييم بياني.
                        </p>
                        {evaluationScore.percentage >= 50 && (
                          <div className="bg-emerald-950/40 text-emerald-300 border border-emerald-900/20 p-2 rounded-lg text-xs font-semibold">
                            🎁 حصلت على +{Math.round(evaluationScore.percentage / 2)} نقاط معرفة إضافية تضاف لرصيدك!
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        onPlaySound("click");
                        setIsEvaluated(false);
                        setUserAnswers({});
                        setEvaluationScore(null);
                      }}
                      className="bg-indigo-950 hover:bg-indigo-900 text-slate-200 px-6 py-2.5 rounded-xl text-xs font-semibold transition border border-indigo-900 cursor-pointer"
                    >
                      إعادة المحاولة مجدداً والبدء من جديد 🔁
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* =======================================
               B. STRICT PRINTABLE WORKPLACE A4 LAYOUT
               ======================================= */
            <div className="space-y-8 select-none flex flex-col items-center">
              <div className="no-print text-center pb-2">
                <span className="text-amber-500 text-sm font-bold flex items-center justify-center gap-1">
                  💡 تلميح: أوراق العمل مهيأة تماماً ومظبوطة بمسافات الطباعة A4 المعتمدة
                </span>
              </div>

              {/* Loop and map simulated A4 sheets */}
              {generatedPages.map((page, pIdx) => (
                <div
                  key={page.pageNumber}
                  id={`printable-page-${page.pageNumber}`}
                  className="relative bg-white text-slate-900 p-8 md:p-12 border border-slate-300/80 shadow-2xl rounded-sm w-full max-w-[210mm] min-h-[297mm] overflow-hidden flex flex-col justify-between font-serif selection:bg-slate-200"
                >
                  {/* WATERMARK OVERLAYS */}
                  {!removeWatermark && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.06] select-none z-0">
                      <div className="text-center font-black text-slate-800 rotate-[-35deg] text-5xl tracking-widest whitespace-nowrap uppercase leading-none select-none">
                        نقلة للمناهج الالكترونية <br />
                        نقلة للمناهج الالكترونية <br />
                        نقلة للمناهج الالكترونية <br />
                        نقلة للمناهج الالكترونية <br />
                        نقلة للمناهج الالكترونية <br />
                        نقلة للمناهج الالكترونية
                      </div>
                    </div>
                  )}

                  <div className="relative z-10 space-y-6 flex-1">
                    {/* Header Section */}
                    <div className="border-b-4 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h1 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-1">
                          <span>المُؤرِّخ الصَّغير 🏛️</span>
                          <span className="text-xs border border-slate-900 text-slate-900 font-sans font-bold px-2 py-0.5 rounded ml-1">المرحلة الابتدائية</span>
                        </h1>
                        <p className="text-xs text-slate-600 font-sans mt-0.5 font-medium leading-none">شعارنا: جيل واعد، تاريخ عريق، معرفة ذكية</p>
                      </div>

                      <div className="text-right text-xs text-slate-700 font-sans space-y-1 border-r-2 sm:border-r-0 sm:border-l-2 border-slate-300 pr-2 sm:pr-0 sm:pl-3">
                        <div>التاريخ: .....................</div>
                        <div>اسم الطالب: .......................................</div>
                        <div>الصف: السادس الابتدائي</div>
                        <div className="text-[10px] text-slate-500 font-medium">رابط المنصة: <span className="font-sans font-bold">{window.location.host}</span></div>
                      </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="bg-slate-100 p-3.5 rounded border border-slate-200 flex justify-between items-center text-xs text-slate-800 font-sans">
                      <div>
                        <strong>الموضوع الأساسي:</strong> {page.scopeText}
                      </div>
                      <div>
                        <strong>الصفحة:</strong> {page.pageNumber} / {generatedPages.length}
                      </div>
                    </div>

                    {/* Questions loop strictly matching day theme text details */}
                    <div className="space-y-8 pt-4">
                      {page.questions.map((q, idx) => {
                        return (
                          <div key={idx} className="space-y-4">
                            {/* Question text */}
                            <div className="font-bold text-base text-slate-950 flex items-start leading-relaxed">
                              <span className="text-slate-800 font-sans pr-1">س{idx + 1}: </span>
                              <span>{q.text}</span>
                            </div>

                            {/* Render blanks / spaces based on question type */}
                            {q.type === QuestionType.MCQ && q.options && (
                              <div className="grid grid-cols-2 gap-4 pl-4 font-serif text-sm">
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx} className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full border border-slate-400 inline-block"></span>
                                    <span>{opt}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {q.type === QuestionType.TRUE_FALSE && (
                              <div className="flex gap-6 pl-4 text-sm font-sans font-bold text-slate-700">
                                <div className="flex items-center gap-1.5">
                                  <span>(  )</span>
                                  <span>صواب</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span>(  )</span>
                                  <span>خطأ</span>
                                </div>
                              </div>
                            )}

                            {q.type === QuestionType.FILL_BLANK && (
                              <div className="pl-4 font-serif">
                                <p className="text-xs text-slate-500 italic">اكتب الإجابة النموذجية المكتملة للتمرين في الفراغ أدناه:</p>
                                <div className="w-full border-b border-dashed border-slate-700 pt-3 h-8"></div>
                              </div>
                            )}

                            {q.type === QuestionType.ESSAY && (
                              <div className="pl-4 font-serif space-y-2">
                                <p className="text-xs text-slate-500 italic">مساحة كتابة المقال التاريخي والتعبير المعرفي (سجل صياغتك الدقيقة هنا):</p>
                                <div className="space-y-4 pt-2">
                                  <div className="border-b border-dashed border-slate-600 h-6"></div>
                                  <div className="border-b border-dashed border-slate-600 h-6"></div>
                                  <div className="border-b border-dashed border-slate-600 h-6"></div>
                                  <div className="border-b border-dashed border-slate-600 h-6"></div>
                                  <div className="border-b border-dashed border-slate-600 h-6"></div>
                                </div>
                              </div>
                            )}

                            {q.type === "diagram" && q.diagramData && (
                              <div className="space-y-4 pl-4">
                                <p className="text-xs text-slate-600 bg-slate-100 p-2 rounded">
                                  بناءً على الرسم التوضيحي أدناه، املأ أرقام الفراغات بما يقابلها من مدلولات تاريخية معتمدة:
                                </p>

                                <div className="relative border border-slate-300 rounded bg-slate-50/50 p-6 min-h-[220px] flex items-center justify-center">
                                  {/* Diagram labels list */}
                                  <div className="grid grid-cols-2 gap-4 w-full text-slate-800 text-xs font-serif">
                                    {q.diagramData.labels.map((lbl, lIdx) => (
                                      <div key={lbl.id} className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                                        <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                                          {lIdx + 1}
                                        </span>
                                        <span className="flex-1 text-slate-400">...................................................</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Worksheet Footer */}
                  <div className="relative z-10 border-t border-slate-300 pt-3 mt-8 flex justify-between items-center text-[10px] text-slate-500 font-sans">
                    <div>© منصة المؤرخ الصغير | حل الكراسة تفاعلياً عبر الموقع: <span className="font-bold underline text-slate-700">{window.location.origin}</span></div>
                    <div className="font-bold">كراسة أوراق العمل - الصف السادس الابتدائي</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
