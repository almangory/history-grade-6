/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Mic, 
  MicOff, 
  X, 
  BookOpen, 
  Sparkles, 
  Calendar, 
  HelpCircle, 
  Compass, 
  Volume2, 
  ArrowLeft,
  CheckCircle2,
  BookmarkCheck,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UNITS } from "../data";
import { playSound } from "./SoundEffects";

interface SearchResultItem {
  id: string;
  type: "direct_answer" | "lesson" | "timeline" | "flashcard" | "keypoint";
  unitId: number;
  unitTitle: string;
  lessonTitle?: string;
  title: string;
  snippet: string;
  fullContent?: string[];
  year?: string;
  score: number;
}

// Arabic normalization helper for high-precision search
const normalizeArabic = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "") // remove harakat / tashkeel
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\.,\/#!$%\^&\*;:{}=\-_`~()؟?،]/g, " ")
    .replace(/\s+/g, " ");
};

const STOP_WORDS = new Set([
  "من", "في", "على", "الى", "إلى", "عن", "مع", "ما", "ماذا", "كيف", "لماذا", 
  "هو", "هي", "هل", "اين", "أين", "التي", "الذي", "الذين", "كان", "كانت", 
  "يكون", "تكون", "كم", "متى", "اذكر", "وضح", "عرف", "اشرح", "عدد", "بين"
]);

export const searchCurriculumEngine = (queryText: string): {
  results: SearchResultItem[];
  directSummary: string | null;
  matchedKeywords: string[];
} => {
  const normQuery = normalizeArabic(queryText);
  if (!normQuery || normQuery.length < 2) {
    return { results: [], directSummary: null, matchedKeywords: [] };
  }

  const rawTokens = normQuery.split(" ").filter(t => t.length > 1);
  const keywords = rawTokens.filter(t => !STOP_WORDS.has(t));
  const searchTokens = keywords.length > 0 ? keywords : rawTokens;

  const results: SearchResultItem[] = [];

  UNITS.forEach(unit => {
    const normUnitTitle = normalizeArabic(unit.title);

    // 1. Check Lessons & Paragraphs
    unit.lessons.forEach(lesson => {
      const normLessonTitle = normalizeArabic(lesson.title);
      let lessonScore = 0;

      searchTokens.forEach(token => {
        if (normLessonTitle.includes(token)) lessonScore += 25;
        if (normUnitTitle.includes(token)) lessonScore += 5;
      });

      // Best matching paragraph in this lesson
      lesson.content.forEach((paragraph, pIdx) => {
        const normPara = normalizeArabic(paragraph);
        let paraScore = 0;
        searchTokens.forEach(token => {
          if (normPara.includes(token)) paraScore += 10;
        });

        // Boost if matches multiple tokens together
        if (searchTokens.length > 1 && searchTokens.every(token => normPara.includes(token))) {
          paraScore += 30;
        }

        if (paraScore > 0) {
          results.push({
            id: `${lesson.id}_p${pIdx}`,
            type: "lesson",
            unitId: unit.id,
            unitTitle: unit.title,
            lessonTitle: lesson.title,
            title: `من درس: ${lesson.title}`,
            snippet: paragraph,
            fullContent: lesson.content,
            score: paraScore + (lessonScore > 0 ? 10 : 0)
          });
        }
      });

      // Key points
      lesson.keyPoints.forEach((kp, kpIdx) => {
        const normKp = normalizeArabic(kp);
        let kpScore = 0;
        searchTokens.forEach(token => {
          if (normKp.includes(token)) kpScore += 12;
        });
        if (kpScore > 0) {
          results.push({
            id: `${lesson.id}_kp${kpIdx}`,
            type: "keypoint",
            unitId: unit.id,
            unitTitle: unit.title,
            lessonTitle: lesson.title,
            title: `خلاصة هامة: ${lesson.title}`,
            snippet: kp,
            score: kpScore + 8
          });
        }
      });
    });

    // 2. Timeline Events
    unit.timeline.forEach((event, eIdx) => {
      const normEventTitle = normalizeArabic(event.title);
      const normDesc = normalizeArabic(event.description);
      const normYear = normalizeArabic(event.year);

      let eventScore = 0;
      searchTokens.forEach(token => {
        if (normEventTitle.includes(token)) eventScore += 20;
        if (normDesc.includes(token)) eventScore += 15;
        if (normYear.includes(token)) eventScore += 30;
      });

      if (eventScore > 0) {
        results.push({
          id: `u${unit.id}_ev${eIdx}`,
          type: "timeline",
          unitId: unit.id,
          unitTitle: unit.title,
          title: `حدث تاريخي (${event.year}): ${event.title}`,
          snippet: event.description,
          year: event.year,
          score: eventScore + 10
        });
      }
    });

    // 3. Flashcards (Direct Q&A)
    unit.flashcards.forEach(card => {
      const normFront = normalizeArabic(card.front);
      const normBack = normalizeArabic(card.back);

      let cardScore = 0;
      searchTokens.forEach(token => {
        if (normFront.includes(token)) cardScore += 25;
        if (normBack.includes(token)) cardScore += 18;
      });

      if (cardScore > 0) {
        results.push({
          id: card.id,
          type: "flashcard",
          unitId: unit.id,
          unitTitle: unit.title,
          title: card.front,
          snippet: card.back,
          score: cardScore + 15
        });
      }
    });
  });

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Deduplicate and get top results
  const uniqueResults: SearchResultItem[] = [];
  const seenSnippets = new Set<string>();

  for (const item of results) {
    const key = item.snippet.substring(0, 45);
    if (!seenSnippets.has(key)) {
      seenSnippets.add(key);
      uniqueResults.push(item);
    }
    if (uniqueResults.length >= 10) break;
  }

  // Generate direct summary from best result
  let directSummary: string | null = null;
  if (uniqueResults.length > 0 && uniqueResults[0].score >= 20) {
    const best = uniqueResults[0];
    if (best.type === "flashcard") {
      directSummary = `💡 **إجابة مباشرة:** ${best.snippet}`;
    } else if (best.type === "timeline") {
      directSummary = `📅 **سنة ${best.year || ""}:** ${best.snippet}`;
    } else {
      directSummary = `📖 **من كتاب التاريخ:** ${best.snippet}`;
    }
  }

  return {
    results: uniqueResults,
    directSummary,
    matchedKeywords: searchTokens
  };
};

const SUGGESTIONS = [
  "متى تأسست الدولة العباسية؟",
  "ما هي أسباب غزو محمد علي للسودان؟",
  "من هو مؤسس سلطنة كلوة؟",
  "ما هي واجبات المواطن تجاه الدولة؟",
  "من بنى مدينة بغداد الدائرية؟",
  "كيف سقطت سلطنة الفونج؟",
  "ما هي مقومات الدولة الأربعة؟",
  "من هو مخترع الآلة البخارية؟"
];

interface SmartScholarSearchProps {
  onSelectLesson?: (unitId: number, lessonId?: string) => void;
}

export const SmartScholarSearch: React.FC<SmartScholarSearchProps> = ({ onSelectLesson }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [queryInput, setQueryInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{
    results: SearchResultItem[];
    directSummary: string | null;
    matchedKeywords: string[];
  }>({ results: [], directSummary: null, matchedKeywords: [] });

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Real-time search evaluation
  useEffect(() => {
    if (!queryInput.trim()) {
      setSearchResults({ results: [], directSummary: null, matchedKeywords: [] });
      return;
    }
    const result = searchCurriculumEngine(queryInput);
    setSearchResults(result);
  }, [queryInput]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "ar-SA";

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQueryInput(transcript);
          playSound("click");
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setSpeechError("يرجى السماح بصلاحية الميكروفون للبحث الصوتي");
        } else {
          setSpeechError("تعذر التقاط الصوت، يمكنك الكتابة في المربع");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setSpeechError("البحث الصوتي غير مدعوم في هذا المتصفح");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleOpenSearch = () => {
    playSound("click");
    setIsOpen(true);
  };

  const handleCloseSearch = () => {
    playSound("click");
    setIsOpen(false);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <>
      {/* Floating Action Button at bottom matching historical Sudan theme */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <motion.button
          id="btn-smart-curriculum-search"
          onClick={handleOpenSearch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-100 font-serif font-bold text-sm rounded-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.8)] border-2 border-amber-500/50 hover:border-amber-400 cursor-pointer transition-all duration-300 ring-4 ring-amber-950/40"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-amber-950/80 border border-amber-400/40 text-amber-300">
            <Search className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline font-serif text-xs md:text-sm tracking-wide">
            الباحث المنهجي الذكي 🔍
          </span>
          <span className="sm:hidden font-serif text-xs">
            بحث المنهج
          </span>
          {/* Subtle glow badge */}
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
        </motion.button>
      </div>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl max-h-[85vh] bg-[#FAF6EE] text-[#2c221a] rounded-3xl border-4 border-[#3e2e21] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col ring-8 ring-amber-950/30"
              dir="rtl"
            >
              {/* Header */}
              <div className="p-4 md:p-5 bg-[#ebdcb4]/50 border-b border-[#3e2e21]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#3e2e21] text-amber-200 flex items-center justify-center shadow">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base md:text-lg text-[#2c221a]">
                      الباحث المنهجي الذكي
                    </h3>
                    <p className="text-xs text-[#5c4a38] font-sans">
                      محرك بحث منهجي فوري من كتاب التاريخ والتربية الوطنية للصف السادس
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseSearch}
                  className="p-1.5 rounded-full hover:bg-amber-900/10 text-[#3e2e21] transition cursor-pointer"
                  title="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Input bar with voice button */}
              <div className="p-4 border-b border-[#3e2e21]/15 bg-[#F4EDE0]">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-amber-800 absolute right-3.5 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="اكتب سؤالك أو ابحث عن شخصية، معركة، تاريخ أو مفهوم..."
                    className="w-full bg-[#FAF6EE] text-[#2c221a] placeholder:text-[#8c7a68] text-sm md:text-base pr-11 pl-20 py-3 rounded-2xl border-2 border-[#3e2e21]/30 focus:border-amber-700 focus:outline-none shadow-inner font-serif"
                  />
                  <div className="absolute left-2.5 flex items-center gap-1">
                    {queryInput && (
                      <button
                        onClick={() => setQueryInput("")}
                        className="p-1 text-[#8c7a68] hover:text-[#2c221a] rounded-full"
                        title="مسح"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={toggleVoiceInput}
                      className={`p-2 rounded-xl border transition cursor-pointer ${
                        isListening
                          ? "bg-red-600 border-red-700 text-white animate-pulse"
                          : "bg-[#ebdcb4] border-[#3e2e21]/20 text-[#3e2e21] hover:bg-[#dfcca1]"
                      }`}
                      title={isListening ? "جاري الاستماع... انقر للإيقاف" : "تحدث بالصوت"}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Voice listening indicator or error */}
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2.5 flex items-center justify-center gap-2 text-xs font-bold text-red-700 bg-red-100/80 py-1.5 px-3 rounded-xl border border-red-300"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    <span>جاري الاستماع لصوتك الآن... تحدث بسؤالك بوضوح</span>
                  </motion.div>
                )}

                {speechError && (
                  <div className="mt-2 text-xs text-red-700 bg-red-100 py-1 px-2.5 rounded-lg border border-red-200">
                    {speechError}
                  </div>
                )}
              </div>

              {/* Quick suggestions when input is empty */}
              {!queryInput.trim() && (
                <div className="p-4 md:p-5 overflow-y-auto space-y-4">
                  <span className="text-xs font-bold text-[#5c4a38] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    أسئلة شائعة يمكنك النقر عليها للبحث الفوري:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUGGESTIONS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          playSound("click");
                          setQueryInput(item);
                        }}
                        className="text-right p-2.5 rounded-xl bg-[#F4EDE0] hover:bg-[#ebdcb4] border border-[#3e2e21]/15 text-xs text-[#2c221a] font-serif transition flex items-center justify-between cursor-pointer"
                      >
                        <span>{item}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-800 shrink-0 mr-1 rotate-180" />
                      </button>
                    ))}
                  </div>

                  <div className="bg-[#ebdcb4]/30 rounded-2xl p-3 border border-[#3e2e21]/10 text-xs text-[#5c4a38] leading-relaxed">
                    💡 <strong>دقة منهجية 100%:</strong> تم استخراج وفهرسة جميع محتويات الكتاب المدرسي (الوحدات، التواريخ، المفاهيم، القادة، وأسئلة الاختبارات) لتقديم إجابات موثوقة ومطابقة للمنهج الوزاري.
                  </div>
                </div>
              )}

              {/* Results area */}
              {queryInput.trim() && (
                <div className="p-4 md:p-5 overflow-y-auto space-y-3.5 flex-1 max-h-[55vh]">
                  {/* Direct answer summary highlight */}
                  {searchResults.directSummary && (
                    <div className="p-3.5 rounded-2xl bg-amber-100/90 border-2 border-amber-600/40 text-[#2c221a] shadow-sm">
                      <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-amber-900">
                        <CheckCircle2 className="w-4 h-4 text-amber-800" />
                        <span>الإجابة المنهجية المباشرة:</span>
                      </div>
                      <p className="text-sm font-serif leading-relaxed text-[#2c221a]">
                        {searchResults.directSummary}
                      </p>
                    </div>
                  )}

                  {/* Result cards */}
                  {searchResults.results.length > 0 ? (
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold text-[#5c4a38] block">
                        نتائج البحث في دروس الكتاب ({searchResults.results.length}):
                      </span>
                      {searchResults.results.map((res) => (
                        <div
                          key={res.id}
                          className="p-3.5 rounded-2xl bg-[#F4EDE0] border border-[#3e2e21]/20 hover:border-amber-700/50 transition space-y-1.5 shadow-sm"
                        >
                          <div className="flex items-center justify-between text-xs text-amber-900 font-bold">
                            <span className="flex items-center gap-1.5">
                              {res.type === "timeline" && <Calendar className="w-3.5 h-3.5" />}
                              {res.type === "flashcard" && <HelpCircle className="w-3.5 h-3.5" />}
                              {res.type === "lesson" && <BookOpen className="w-3.5 h-3.5" />}
                              {res.type === "keypoint" && <BookmarkCheck className="w-3.5 h-3.5" />}
                              {res.title}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#ebdcb4] text-[#3e2e21]">
                              الوحدة {res.unitId}
                            </span>
                          </div>

                          <p className="text-xs md:text-sm font-serif text-[#2c221a] leading-relaxed">
                            {res.snippet}
                          </p>

                          <div className="pt-1 flex items-center justify-between text-[11px] text-[#7a6552]">
                            <span>من: {res.unitTitle}</span>
                            {onSelectLesson && (
                              <button
                                onClick={() => {
                                  playSound("click");
                                  handleCloseSearch();
                                  onSelectLesson(res.unitId);
                                }}
                                className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                              >
                                الانتقال للدرس ⬅
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-2 text-[#5c4a38]">
                      <Search className="w-8 h-8 mx-auto text-amber-800/60" />
                      <p className="font-serif text-sm">
                        لم يتم العثور على نتائج مطابقة لـ "{queryInput}" في المنهج.
                      </p>
                      <p className="text-xs">
                        جرّب البحث بكلمات أبسط مثل: "المك نمر"، "سنار"، "بغداد"، "المواطنة"، "كلوة".
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer */}
              <div className="p-3 bg-[#ebdcb4]/40 border-t border-[#3e2e21]/15 text-center text-xs text-[#5c4a38] font-sans">
                محرك بحث منهجي داخلي خالص يعمل بدون إنترنت وبدون أدوات الذكاء الاصطناعي الخارجية
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
