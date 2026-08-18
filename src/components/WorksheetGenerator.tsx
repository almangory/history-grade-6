/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  FileText, Printer, Check, CheckSquare, X, Lock, Unlock, 
  RefreshCw, Info, Award, HelpCircle, Sparkles, CheckCircle2, XCircle
} from "lucide-react";
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
    explanation?: string;
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

  // Mode state: Either A4 Page view or Interactive Dark UI
  const [worksheetMode, setWorksheetMode] = useState<"print" | "interactive">("print");

  // Output Generated Sheets
  const [generatedPages, setGeneratedPages] = useState<CompiledWorksheet[]>([]);

  // Interactive Answers State (Map of composite key like "page-questionIndex" -> selected answer value)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [evaluationScore, setEvaluationScore] = useState<{ correct: number; total: number; percentage: number } | null>(null);

  // Keep lesson option synced when selectedUnitId shifts
  useEffect(() => {
    const parent = units.find(u => u.id === selectedUnitId);
    if (parent && parent.lessons.length > 0) {
      setSelectedLessonId(parent.lessons[0].id);
    }
  }, [selectedUnitId, units]);

  // Build the worksheet data according to filters
  const handleGenerateWorksheets = () => {
    onPlaySound("levelup");
    setIsEvaluated(false);
    setEvaluationScore(null);
    setUserAnswers({});

    const itemsPerPage = 4;
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
      "كامل المقرر الدراسي للصف السادس الابتدائي";

    const compiled: CompiledWorksheet[] = [];

    for (let pNum = 1; pNum <= pageCount; pNum++) {
      const startIdx = (pNum - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const pageQuestions: CompiledWorksheet['questions'] = selectedQuestions.slice(startIdx, endIdx).map(q => ({
        type: q.type,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        matchPairs: q.matchPairs
      }));

      // If diagrams are toggled, insert one diagram question per page
      if (typesSelected.diagram && DIAGRAMS_LIST.length > 0) {
        const diagramIndex = (pNum - 1) % DIAGRAMS_LIST.length;
        pageQuestions.push({
          type: "diagram",
          text: `أعد تسمية وتوجيه البيانات على الشكل التوضيحي التالي الخاص بـ: (${DIAGRAMS_LIST[diagramIndex].title})`,
          correctAnswer: DIAGRAMS_LIST[diagramIndex].labels.map(l => `${l.id}: ${l.name}`).join(" - "),
          diagramData: DIAGRAMS_LIST[diagramIndex]
        });
      }

      compiled.push({
        pageNumber: pNum,
        title: `ورقة العمل والتقييم - صفحة ${pNum}`,
        scopeText: scopeLabel,
        questions: pageQuestions
      });
    }

    setGeneratedPages(compiled);
  };

  // Generate automatically on mount
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
  const handleEvaluateWorksheet = () => {
    onPlaySound("levelup");
    let correctCount = 0;
    let totalQuestionsGraded = 0;

    generatedPages.forEach((page) => {
      page.questions.forEach((q, idx) => {
        const k = `${page.pageNumber}-${idx}`;
        const answer = userAnswers[k];

        if (q.type === "diagram") {
          q.diagramData?.labels.forEach((lbl) => {
            const compositeKey = `${k}-diagram-${lbl.id}`;
            const userChoice = userAnswers[compositeKey];
            if (userChoice && userChoice.trim() === lbl.name.trim()) {
              correctCount++;
            }
            totalQuestionsGraded++;
          });
        } else if (q.type === QuestionType.ESSAY) {
          totalQuestionsGraded++;
          // For essay, if answered with reasonable length, count as answered
          if (answer && answer.trim().length >= 10) {
            correctCount++;
          }
        } else {
          totalQuestionsGraded++;
          if (answer && answer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
            correctCount++;
          }
        }
      });
    });

    const percent = totalQuestionsGraded > 0 ? Math.round((correctCount / totalQuestionsGraded) * 100) : 0;
    setEvaluationScore({
      correct: correctCount,
      total: totalQuestionsGraded,
      percentage: percent
    });
    setIsEvaluated(true);

    if (percent >= 50) {
      const earned = Math.round(percent / 2);
      setScore(prev => prev + earned);
    }
  };

  const handleResetAnswers = () => {
    onPlaySound("click");
    setIsEvaluated(false);
    setUserAnswers({});
    setEvaluationScore(null);
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      {/* SECTION HEADER */}
      <div className="no-print bg-[#121020] rounded-2xl border border-indigo-950/80 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none">
        <div>
          <span className="bg-amber-500/10 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/20 font-sans">
            أوراق العمل والتقييم الذاتي A4
          </span>
          <h2 className="text-2xl font-bold font-serif text-amber-400 mt-1.5 flex items-center gap-2">
            <FileText className="w-7 h-7 text-amber-500 shrink-0" />
            حل وتصحيح أوراق العمل A4 تفاعلياً بالموقع
          </h2>
          <p className="text-slate-300 text-sm mt-1 font-sans">
            يمكنك حل الأسئلة مباشرة على الصفحة وتصحيحها فوراً للحصول على النتيجة والدرجة مع إظهار الإجابات النموذجية الصحيحة تحت كل سؤال!
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => {
              onPlaySound("click");
              setWorksheetMode("print");
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${
              worksheetMode === "print"
                ? "bg-amber-500 text-slate-950 font-black shadow-md"
                : "bg-[#18152c] text-indigo-200 border border-indigo-950/50 hover:bg-[#201c3e]"
            }`}
          >
            📄 نموذج ورقة A4 التفاعلية
          </button>
          <button
            onClick={() => {
              onPlaySound("click");
              setWorksheetMode("interactive");
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${
              worksheetMode === "interactive"
                ? "bg-amber-500 text-slate-950 font-black shadow-md"
                : "bg-[#18152c] text-indigo-200 border border-indigo-950/50 hover:bg-[#201c3e]"
            }`}
          >
            🧩 النمط الداكن السريع
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
            <label className="text-slate-300 text-xs font-semibold">نطاق المنهج المستهدف:</label>
            <select
              value={scopeType}
              onChange={(e) => {
                onPlaySound("click");
                setScopeType(e.target.value as any);
              }}
              className="w-full bg-[#1b1930] border border-indigo-950 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">كامل المنهج الدراسي 📘</option>
              <option value="favorites">الدروس المفضلة ⭐ ({favoriteLessons.length})</option>
              <option value="unit">وحدة كاملة 📓</option>
              <option value="lesson">درس مخصص 📄</option>
            </select>
          </div>

          {/* Unit Selection */}
          {scopeType === "unit" && (
            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-semibold">اختر الوحدة:</label>
              <select
                value={selectedUnitId}
                onChange={(e) => {
                  onPlaySound("click");
                  setSelectedUnitId(parseInt(e.target.value, 10));
                }}
                className="w-full bg-[#1b1930] border border-indigo-950 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    وحدة {unit.id}: {unit.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Lesson Selection */}
          {scopeType === "lesson" && (
            <>
              <div className="space-y-1.5">
                <label className="text-slate-300 text-xs font-semibold">الوحدة:</label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => {
                    onPlaySound("click");
                    setSelectedUnitId(parseInt(e.target.value, 10));
                  }}
                  className="w-full bg-[#1b1930] border border-indigo-950 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      وحدة {unit.id}: {unit.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 text-xs font-semibold">الدرس:</label>
                <select
                  value={selectedLessonId}
                  onChange={(e) => {
                    onPlaySound("click");
                    setSelectedLessonId(e.target.value);
                  }}
                  className="w-full bg-[#1b1930] border border-indigo-950 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-sans cursor-pointer"
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

          {/* Page count */}
          <div className="space-y-1.5">
            <label className="text-slate-300 text-xs font-semibold">عدد أوراق العمل (A4):</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="10"
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#1b1930] rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="bg-[#1b1930] border border-indigo-950 px-3 py-1.5 text-xs text-amber-400 rounded-lg font-bold min-w-[50px] text-center">
                {pageCount} صفحة
              </span>
            </div>
          </div>
        </div>

        {/* Question Type Selection Checkboxes */}
        <div className="space-y-1.5">
          <label className="text-slate-300 text-xs font-semibold block">أنواع الأسئلة في ورقة العمل:</label>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 bg-[#1b1930]/40 p-3 rounded-xl border border-indigo-950/45">
            <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={typesSelected.mcq}
                onChange={(e) => setTypesSelected({ ...typesSelected, mcq: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500 w-4 h-4"
              />
              <span>اختيار من متعدد (MCQ)</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={typesSelected.tf}
                onChange={(e) => setTypesSelected({ ...typesSelected, tf: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500 w-4 h-4"
              />
              <span>الصواب والخطأ (صواب / خطأ)</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={typesSelected.blank}
                onChange={(e) => setTypesSelected({ ...typesSelected, blank: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500 w-4 h-4"
              />
              <span>أكمل الفراغات</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={typesSelected.essay}
                onChange={(e) => setTypesSelected({ ...typesSelected, essay: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500 w-4 h-4"
              />
              <span className="text-amber-400 font-semibold">الأسئلة المقالية ✍️</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={typesSelected.diagram}
                onChange={(e) => setTypesSelected({ ...typesSelected, diagram: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500 w-4 h-4"
              />
              <span className="text-teal-400 font-semibold">الخرائط والرسوم الهندسية 🗺️</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleGenerateWorksheets}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-sm px-6 py-3 rounded-xl transition duration-150 transform hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw className="w-4 h-4 shrink-0" />
            <span>توليد ورقة عمل جديدة 🚀</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEvaluateWorksheet}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>{isEvaluated ? "إعادة التصحيح وحساب الدرجة" : "تصحيح ورقة العمل وإظهار الإجابات ✅"}</span>
            </button>

            {isEvaluated && (
              <button
                onClick={handleResetAnswers}
                className="bg-indigo-950/80 hover:bg-indigo-900 text-slate-200 border border-indigo-800 text-xs px-4 py-3 rounded-xl transition cursor-pointer"
              >
                مسح الإجابات 🔄
              </button>
            )}

            <button
              onClick={handlePrint}
              disabled={generatedPages.length === 0}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة A4 🖨️</span>
            </button>
          </div>
        </div>
      </div>

      {/* EVALUATION RESULTS CARD (Shown when graded) */}
      {isEvaluated && evaluationScore && (
        <div className="bg-gradient-to-r from-[#172033] via-[#1a1738] to-[#172033] border-2 border-amber-500/50 rounded-2xl p-6 shadow-2xl space-y-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl border ${
                evaluationScore.percentage >= 80 
                  ? "bg-emerald-950/80 border-emerald-500/60 text-emerald-400" 
                  : evaluationScore.percentage >= 50 
                  ? "bg-amber-950/80 border-amber-500/60 text-amber-400" 
                  : "bg-red-950/80 border-red-500/60 text-red-400"
              }`}>
                <Award className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-amber-400 font-serif">نتيجة التقييم الفوري:</span>
                  <span className={`text-2xl font-black px-3 py-0.5 rounded-lg ${
                    evaluationScore.percentage >= 80 
                      ? "bg-emerald-500/20 text-emerald-300" 
                      : evaluationScore.percentage >= 50 
                      ? "bg-amber-500/20 text-amber-300" 
                      : "bg-red-500/20 text-red-300"
                  }`}>
                    {evaluationScore.percentage}%
                  </span>
                </div>
                <p className="text-slate-200 text-sm">
                  أجبت بصحة على <strong className="text-emerald-400 text-base">{evaluationScore.correct}</strong> من إجمالي <strong className="text-slate-100 text-base">{evaluationScore.total}</strong> سؤال ونقطة تقييم.
                </p>
              </div>
            </div>

            <div className="text-center md:text-left space-y-2">
              <div className="text-xs text-slate-300 font-bold bg-[#121020] px-4 py-2 rounded-xl border border-indigo-950">
                {evaluationScore.percentage >= 80 ? "🌟 ممتاز جداً! فهمت الدرس بجدارة فائقة" : evaluationScore.percentage >= 50 ? "👍 جيد جداً! راجع الأسئلة الموضحة باللون الأحمر" : "📚 تحتاج لمراجعة فقرات الدرس والمحاولة ثانية"}
              </div>
              {evaluationScore.percentage >= 50 && (
                <div className="text-emerald-400 text-xs font-bold flex items-center justify-center md:justify-end gap-1">
                  <Sparkles className="w-4 h-4" />
                  <span>تم إضافة +{Math.round(evaluationScore.percentage / 2)} نقطة خبرة لرصيدك!</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full bg-[#110e1f] rounded-full h-3 overflow-hidden border border-indigo-950">
            <div 
              className={`h-full transition-all duration-500 ${
                evaluationScore.percentage >= 80 ? "bg-emerald-500" : evaluationScore.percentage >= 50 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${evaluationScore.percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-amber-300/90 text-center font-bold">
            👇 تم إظهار التصحيح والإجابة النموذجية المعتمدة لكل سؤال بالأسفل مباشرة سواء كانت إجابتك صحيحة أو خاطئة.
          </p>
        </div>
      )}

      {/* WATERMARK SETTINGS BAR (When in print mode) */}
      {worksheetMode === "print" && (
        <div className="no-print bg-[#181530] rounded-2xl p-4 border border-indigo-950 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${removeWatermark ? "bg-emerald-950/50 text-emerald-400" : "bg-amber-950/50 text-amber-400"}`}>
              {removeWatermark ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-200">التحكم في العلامة المائية للطباعة</h4>
              <p className="text-xs text-slate-400">
                {removeWatermark 
                  ? "✅ تم إلغاء العلامة المائية بنجاح، الأوراق جاهزة للطباعة الصافية." 
                  : "🔒 تحتوي الورقة على علامة مائية للموقع. يمكنك إلغاءها بكلمة المرور."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!removeWatermark && !showPasswordBox && (
              <button
                onClick={() => {
                  onPlaySound("click");
                  setShowPasswordBox(true);
                }}
                className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 hover:text-white px-4 py-2 border border-indigo-900 rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
              >
                🔐 إدخال رمز إزالة العلامة المائية
              </button>
            )}

            {showPasswordBox && (
              <form onSubmit={handleVerifyPasscode} className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="رمز المرور (20302060)..."
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
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-900 px-3 py-1 font-bold rounded-lg shrink-0">
                العلامة المائية ملغاة 🔓
              </span>
            )}
          </div>
        </div>
      )}

      {/* WORKSHEET DISPLAY ZONE */}
      {generatedPages.length > 0 && (
        <div className="space-y-8">
          {worksheetMode === "print" ? (
            /* =========================================================================
               A. INTERACTIVE A4 PRINTABLE WORKSHEET VIEW (Solvable on real A4 layout)
               ========================================================================= */
            <div className="space-y-8 flex flex-col items-center">
              <div className="no-print text-center pb-1">
                <span className="text-amber-400 text-xs font-bold bg-amber-950/30 border border-amber-900/40 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5">
                  💡 يمكنك حل الأسئلة مباشرة على ورقة A4 هذه ثم النقر على زر "تصحيح ورقة العمل" بالأعلى لمعرفة نتيجتك!
                </span>
              </div>

              {generatedPages.map((page) => (
                <div
                  key={page.pageNumber}
                  id={`printable-page-${page.pageNumber}`}
                  className="relative bg-white text-slate-900 p-6 md:p-10 border border-slate-300 shadow-2xl rounded-sm w-full max-w-[210mm] min-h-[297mm] overflow-hidden flex flex-col justify-between font-serif selection:bg-slate-200"
                >
                  {/* WATERMARK OVERLAY */}
                  {!removeWatermark && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.05] select-none z-0">
                      <div className="text-center font-black text-slate-800 rotate-[-35deg] text-5xl tracking-widest whitespace-nowrap uppercase leading-none select-none">
                        تاريخ الصف السادس الابتدائي <br />
                        تاريخ الصف السادس الابتدائي <br />
                        تاريخ الصف السادس الابتدائي <br />
                        تاريخ الصف السادس الابتدائي <br />
                        تاريخ الصف السادس الابتدائي
                      </div>
                    </div>
                  )}

                  <div className="relative z-10 space-y-5 flex-1">
                    {/* Header Section */}
                    <div className="border-b-4 border-slate-900 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h1 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-1.5">
                          <span>ورقة عمل التاريخ والتربية الوطنية 🏛️</span>
                          <span className="text-[11px] border border-slate-900 text-slate-900 font-sans font-bold px-2 py-0.5 rounded">الصف السادس</span>
                        </h1>
                        <p className="text-[11px] text-slate-600 font-sans mt-0.5 font-medium leading-none">وزارة التربية والتعليم - المركز القومي للمناهج والبحث التربوي (بخت الرضا)</p>
                      </div>

                      <div className="text-right text-[11px] text-slate-700 font-sans space-y-0.5 border-r-2 sm:border-r-0 sm:border-l-2 border-slate-300 pr-2 sm:pr-0 sm:pl-3">
                        <div>التاريخ: .....................</div>
                        <div>اسم التلميذ: .......................................</div>
                        <div>المدرسة: .......................................</div>
                      </div>
                    </div>

                    {/* Metadata Ribbon */}
                    <div className="bg-slate-100 p-2.5 rounded border border-slate-300 flex justify-between items-center text-[11px] text-slate-800 font-sans">
                      <div>
                        <strong>النطاق:</strong> {page.scopeText}
                      </div>
                      <div>
                        <strong>الصفحة:</strong> {page.pageNumber} / {generatedPages.length}
                      </div>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-6 pt-2">
                      {page.questions.map((q, idx) => {
                        const ansKey = `${page.pageNumber}-${idx}`;
                        const userChoice = userAnswers[ansKey] || "";
                        const isAnswerCorrect = userChoice.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                        return (
                          <div 
                            key={idx} 
                            className={`p-3.5 rounded-xl border transition-all ${
                              isEvaluated 
                                ? isAnswerCorrect 
                                  ? "bg-emerald-50/70 border-emerald-300" 
                                  : "bg-red-50/70 border-red-300"
                                : "bg-white border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            {/* Question Title */}
                            <div className="font-bold text-sm text-slate-950 flex items-start gap-2 leading-relaxed">
                              <span className="bg-slate-900 text-white font-sans text-xs px-2 py-0.5 rounded shrink-0">
                                س{idx + 1}
                              </span>
                              <span className="flex-1">{q.text}</span>
                            </div>

                            {/* Options according to type */}
                            <div className="mt-3 mr-7">
                              {/* MCQ */}
                              {q.type === QuestionType.MCQ && q.options && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                                  {q.options.map((opt, oIdx) => {
                                    const isSelected = userChoice === opt;
                                    const isThisCorrect = opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                                    return (
                                      <button
                                        type="button"
                                        key={oIdx}
                                        disabled={isEvaluated}
                                        onClick={() => {
                                          onPlaySound("click");
                                          setUserAnswers({ ...userAnswers, [ansKey]: opt });
                                        }}
                                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-right transition cursor-pointer ${
                                          isSelected
                                            ? "bg-amber-100 border-amber-600 font-bold text-slate-950"
                                            : "bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100"
                                        } ${isEvaluated && isThisCorrect ? "!border-emerald-600 !bg-emerald-100 font-bold" : ""}`}
                                      >
                                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                          isSelected ? "border-amber-600 bg-amber-600 text-white" : "border-slate-400 bg-white"
                                        }`}>
                                          {isSelected && <span className="w-2 h-2 bg-white rounded-full"></span>}
                                        </span>
                                        <span className="text-xs">{opt}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {/* TRUE / FALSE */}
                              {q.type === QuestionType.TRUE_FALSE && (
                                <div className="flex items-center gap-4 text-xs font-sans font-bold">
                                  {["صواب", "خطأ"].map((opt) => {
                                    const isSelected = userChoice === opt;
                                    const isThisCorrect = opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                                    return (
                                      <button
                                        type="button"
                                        key={opt}
                                        disabled={isEvaluated}
                                        onClick={() => {
                                          onPlaySound("click");
                                          setUserAnswers({ ...userAnswers, [ansKey]: opt });
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition cursor-pointer ${
                                          isSelected
                                            ? "bg-amber-100 border-amber-600 text-slate-950 font-black shadow-sm"
                                            : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100"
                                        } ${isEvaluated && isThisCorrect ? "!border-emerald-600 !bg-emerald-100 font-black" : ""}`}
                                      >
                                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                          isSelected ? "border-amber-600 bg-amber-600 text-white" : "border-slate-400 bg-white"
                                        }`}>
                                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                                        </span>
                                        <span>{opt}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {/* FILL IN THE BLANK */}
                              {q.type === QuestionType.FILL_BLANK && (
                                <div className="space-y-1 font-sans">
                                  <input
                                    type="text"
                                    disabled={isEvaluated}
                                    placeholder="اكتب الإجابة في الفراغ هنا..."
                                    value={userChoice}
                                    onChange={(e) => setUserAnswers({ ...userAnswers, [ansKey]: e.target.value })}
                                    className="w-full bg-slate-50 border-b-2 border-slate-400 focus:border-amber-600 px-3 py-1.5 text-xs text-slate-950 outline-none rounded-t"
                                  />
                                </div>
                              )}

                              {/* ESSAY */}
                              {q.type === QuestionType.ESSAY && (
                                <div className="space-y-1 font-sans">
                                  <textarea
                                    disabled={isEvaluated}
                                    placeholder="اكتب إجابتك وصياغتك التاريخية هنا..."
                                    value={userChoice}
                                    onChange={(e) => setUserAnswers({ ...userAnswers, [ansKey]: e.target.value })}
                                    className="w-full h-24 bg-slate-50 border border-slate-300 focus:border-amber-600 p-2.5 text-xs text-slate-950 outline-none rounded-lg leading-relaxed"
                                  />
                                </div>
                              )}

                              {/* DIAGRAM */}
                              {q.type === "diagram" && q.diagramData && (
                                <div className="space-y-3 font-sans">
                                  <p className="text-[11px] text-slate-700 bg-slate-100 p-2 rounded">
                                    {q.diagramData.description}
                                  </p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {q.diagramData.labels.map((lbl, lIdx) => {
                                      const selectKey = `${ansKey}-diagram-${lbl.id}`;
                                      const userSelected = userAnswers[selectKey] || "";
                                      const isLblCorrect = userSelected === lbl.name;

                                      return (
                                        <div key={lbl.id} className="flex items-center gap-2 border border-slate-200 bg-slate-50 p-2 rounded">
                                          <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                                            {lIdx + 1}
                                          </span>
                                          <select
                                            value={userSelected}
                                            disabled={isEvaluated}
                                            onChange={(e) => {
                                              onPlaySound("click");
                                              setUserAnswers({ ...userAnswers, [selectKey]: e.target.value });
                                            }}
                                            className={`w-full bg-white border text-xs rounded px-2 py-1 outline-none ${
                                              isEvaluated 
                                                ? isLblCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold" : "border-red-500 bg-red-50 text-red-800 font-bold"
                                                : "border-slate-300"
                                            }`}
                                          >
                                            <option value="">-- حدد المسمى الصحيح --</option>
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
                              )}
                            </div>

                            {/* MANDATORY ACCREDITED ANSWER CORRECTION BOX (Under EVERY Question) */}
                            {isEvaluated && (
                              <div className={`mt-3 mr-7 p-3 rounded-xl border text-xs font-sans space-y-1.5 animate-[fadeIn_0.3s_ease-out] ${
                                q.type === "diagram"
                                  ? "bg-slate-100 border-slate-300"
                                  : isAnswerCorrect
                                  ? "bg-emerald-100/90 border-emerald-400 text-emerald-950"
                                  : "bg-red-100/90 border-red-300 text-red-950"
                              }`}>
                                <div className="flex items-center gap-2 font-bold text-xs">
                                  {q.type === "diagram" ? (
                                    <span className="text-slate-800 flex items-center gap-1">
                                      <Info className="w-4 h-4 text-sky-600" />
                                      <span>مراجعة وتصحيح مكونات الشكل التوضيحي:</span>
                                    </span>
                                  ) : isAnswerCorrect ? (
                                    <span className="text-emerald-800 flex items-center gap-1">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                      <span>✔ إجابتك صحيحة ومطابقة للمنهج!</span>
                                    </span>
                                  ) : (
                                    <span className="text-red-800 flex items-center gap-1">
                                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                                      <span>✘ إجابة غير صحيحة {userChoice ? `(إجابتك: ${userChoice})` : "(لم يتم كتابة إجابة)"}</span>
                                    </span>
                                  )}
                                </div>

                                {q.type !== "diagram" && (
                                  <div className="bg-white/80 p-2.5 rounded-lg border border-slate-300/80 space-y-1">
                                    <div className="font-bold text-slate-900 flex items-start gap-1">
                                      <span className="text-emerald-700">✅ الإجابة النموذجية المعتمدة:</span>
                                      <span className="text-slate-950 font-serif whitespace-pre-wrap">{q.correctAnswer}</span>
                                    </div>
                                    {q.explanation && (
                                      <p className="text-[11px] text-slate-600 pt-0.5 border-t border-slate-200">
                                        💡 {q.explanation}
                                      </p>
                                    )}
                                  </div>
                                )}

                                {q.type === "diagram" && q.diagramData && (
                                  <div className="bg-white/80 p-2.5 rounded-lg border border-slate-300 space-y-1">
                                    <span className="font-bold text-slate-900 block mb-1">البيانات الصحيحة للرسم:</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                                      {q.diagramData.labels.map((lbl, lIdx) => {
                                        const selectKey = `${ansKey}-diagram-${lbl.id}`;
                                        const val = userAnswers[selectKey] || "";
                                        const isCorr = val === lbl.name;
                                        return (
                                          <div key={lbl.id} className="flex items-center gap-1">
                                            <span>{isCorr ? "🟢" : "🔴"}</span>
                                            <strong>{lIdx + 1}. {lbl.name}</strong>
                                            {!isCorr && <span className="text-red-600 font-sans"> (اخترت: {val || "فارغ"})</span>}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Worksheet Footer */}
                  <div className="relative z-10 border-t border-slate-300 pt-3 mt-6 flex justify-between items-center text-[10px] text-slate-500 font-sans">
                    <div>منصة تاريخ السودان والتربية الوطنية للصف السادس • تم الحل والتصحيح التفاعلي عبر الموقع</div>
                    <div className="font-bold">كراسة أوراق العمل - المنهج المعتمد</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* =========================================================================
               B. DARK THEME INTERACTIVE SOLVING MODE
               ========================================================================= */
            <div className="bg-[#121020] rounded-2xl border border-indigo-950 p-6 space-y-6 shadow-inner">
              <div className="border-b border-indigo-950/60 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-amber-400 font-serif font-extrabold text-xl">
                    📝 الحل والتصحيح بالنمط الداكن
                  </span>
                  <p className="text-slate-400 text-xs mt-1">
                    أجب على الأسئلة واضغط على "تصحيح ورقة العمل" لعرض الدرجة والإجابات النموذجية.
                  </p>
                </div>
              </div>

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

                  <div className="space-y-4">
                    {page.questions.map((q, idx) => {
                      const ansKey = `${page.pageNumber}-${idx}`;
                      const userChoice = userAnswers[ansKey] || "";
                      const isAnswerCorrect = userChoice.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                      return (
                        <div key={idx} className="bg-[#110e1a]/60 p-4 rounded-xl border border-indigo-950/40 space-y-3 font-sans">
                          <div className="flex items-start gap-2">
                            <span className="bg-amber-500/10 text-amber-400 font-bold text-xs px-2 py-0.5 rounded shrink-0">
                              س{idx + 1}
                            </span>
                            <span className="text-slate-100 font-semibold text-xs leading-relaxed">
                              {q.text}
                            </span>
                          </div>

                          {/* MCQ */}
                          {q.type === QuestionType.MCQ && q.options && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 font-serif">
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
                                    className={`text-right p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                                      isSelected
                                        ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                                        : "bg-[#1b1930]/40 border-indigo-950 hover:border-amber-500/30 text-slate-300"
                                    }`}
                                  >
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* TRUE / FALSE */}
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
                                    className={`px-5 py-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                                      isSelected
                                        ? "bg-amber-500/20 border-amber-500 text-amber-300 font-black"
                                        : "bg-[#1b1930]/45 border-indigo-950 hover:border-amber-500/30 text-slate-300"
                                    }`}
                                  >
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* FILL IN THE BLANK */}
                          {q.type === QuestionType.FILL_BLANK && (
                            <div className="pt-1">
                              <input
                                type="text"
                                disabled={isEvaluated}
                                placeholder="اكتب الإجابة في الفراغ..."
                                value={userChoice}
                                onChange={(e) => setUserAnswers({ ...userAnswers, [ansKey]: e.target.value })}
                                className="w-full bg-[#18152c] border border-indigo-950 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                              />
                            </div>
                          )}

                          {/* ESSAY */}
                          {q.type === QuestionType.ESSAY && (
                            <div className="pt-1 space-y-2">
                              <textarea
                                disabled={isEvaluated}
                                placeholder="اكتب مقالك التاريخي هنا..."
                                value={userChoice}
                                onChange={(e) => setUserAnswers({ ...userAnswers, [ansKey]: e.target.value })}
                                className="w-full h-24 bg-[#18152c] border border-indigo-950 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400 leading-relaxed"
                              />
                            </div>
                          )}

                          {/* CORRECTION FEEDBACK */}
                          {isEvaluated && (
                            <div className={`mt-2 p-3 rounded-xl border text-xs space-y-1.5 animate-[fadeIn_0.3s_ease-out] ${
                              isAnswerCorrect 
                                ? "bg-emerald-950/50 border-emerald-700/60 text-emerald-300" 
                                : "bg-red-950/50 border-red-700/60 text-red-300"
                            }`}>
                              <div className="flex items-center gap-1.5 font-bold">
                                {isAnswerCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span>إجابتك صحيحة وممتازة!</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 text-red-400" />
                                    <span>إجابة غير صحيحة {userChoice ? `(إجابتك: ${userChoice})` : "(لم تجب)"}</span>
                                  </>
                                )}
                              </div>
                              <div className="bg-[#0e0c1a]/80 p-2.5 rounded-lg border border-indigo-950/80 space-y-1 text-slate-200">
                                <div className="font-bold">
                                  <span className="text-amber-400">الإجابة النموذجية المعتمدة: </span>
                                  <span className="text-slate-100 font-serif whitespace-pre-wrap">{q.correctAnswer}</span>
                                </div>
                                {q.explanation && (
                                  <p className="text-[11px] text-slate-400 pt-0.5 border-t border-indigo-950/60">
                                    💡 {q.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
