/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { HISTORIC_CITIES, QUESTIONS } from "../data";
import { playSound } from "./SoundEffects";
import { MapPin, Award, BookOpen, Check, X, HelpCircle, Compass } from "lucide-react";

interface MapExplorerProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onUnlockBadge: (badgeId: string) => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({ score, setScore, onUnlockBadge }) => {
  const [selectedCity, setSelectedCity] = useState<typeof HISTORIC_CITIES[0] | null>(null);
  const [answeredCities, setAnsweredCities] = useState<Record<string, boolean>>({});
  const [currentCityQuestion, setCurrentCityQuestion] = useState<{
    text: string;
    options: string[];
    correct: string;
    description: string;
  } | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<"correct" | "wrong" | null>(null);

  // Bonus quizzes tied to cities
  const cityQuizzes: Record<string, { text: string; options: string[]; correct: string; description: string }> = {
    "سنار": {
      text: "أي مملكة عظيمة اتخذت من 'سنار' عاصمة لها وكان يطلق عليها السلطنة الزرقاء؟",
      options: ["مملكة الفونج", "دولة الأدارسة", "مملكة مالي", "دولة الأغالبة"],
      correct: "مملكة الفونج",
      description: "صحيح! سنار كانت العاصمة الشامخة لـ مملكة الفونج حتى سقوطها عام 1821م."
    },
    "الخرطوم": {
      text: "في أي ملتقى جرافي تقع مدينة الخرطوم عاصمة السودان الحبيبة؟",
      options: ["ملتقى البحر الأحمر والخليج العربي", "ملتقى النيلين الأبيض والأزرق", "ملتقى النهر والملح", "جبال النوبة"],
      correct: "ملتقى النيلين الأبيض والأزرق",
      description: "أحسنت! هذا الموقع الاستراتيجي المميز جعلها الميناء والعاصمة الإدارية الأهم منذ 1824م."
    },
    "شندي": {
      text: "ما اسم الملك الشجاع الذي قاد ثورة وغضب شندي التاريخي وحاصر ديوان إسماعيل باشا؟",
      options: ["الملك جعفر", "الملك نمر", "الملك عثمان", "سندياتا"],
      correct: "الملك نمر",
      description: "ممتاز! الملك نمر ملك الجعليين حرق إسماعيل باشا في شندي رداً على تهديداته للأهالي."
    },
    "فاس": {
      text: "من الذي أسس مدينة 'فاس' لتكون عاصمة لمملكته بشمال إفريقيا عام 789م؟",
      options: ["الأدارسة", "العباسيون", "الفاطميون", "صلاح الدين"],
      correct: "الأدارسة",
      description: "صحيح! الأدارسة اتخذوا فاس عاصمة أثرية مشعة بالعلم والمنشآت."
    },
    "القيروان": {
      text: "أي من الدويلات الإسلامية اتخذت من القيروان عاصمة وأثبتت ريادتها بالبحر الأبيض المتوسط؟",
      options: ["الأغالبة", "الأدارسة", "ممالك الهوسا", "سلطنة دارفور"],
      correct: "الأغالبة",
      description: "بالفعل! دولة الأغالبة أسست القيروان في تونس كقاعدة لفتوحاتها البحرية المذهلة."
    },
    "القاهرة": {
      text: "من القائد الفاطمي المغوار الذي شيد أسوار مدينة القاهرة وأسس الجامع الأزهر الشريف عام 969م؟",
      options: ["جوهر الصقلي", "هولاكو", "عبيد الله المهدي", "الزبير ود رحمة"],
      correct: "جوهر الصقلي",
      description: "بطل رائع! الأمير الصقلي جوهر شيد القاهرة وخط جامع الأزهر بأمر الخليفة المعز."
    },
    "بغداد": {
      text: "أي خليفة عباسي يعتبر باني ومصمم مدينة بغداد دائرية الشكل لسهولة حمايتها ودعم عمرانها؟",
      options: ["أبو جعفر المنصور", "أبو العباس السفاح", "المأمون", "المعتصم"],
      correct: "أبو جعفر المنصور",
      description: "عبقري تاريخي! أبو جعفر المنصور هو المصمم وباني بغداد لتصبح عاصمة الخلافة الشامخة."
    },
    "سامراء": {
      text: "لماذا قام الخليفة المعتصم ببناء مدينة سامراء (سر من رأى) العريقة كعاصمة ثانية؟",
      options: ["لجمع الكتب وتصفيتها", "لتكون عاصمة عسكرية بديلة لإسكان جنده الأتراك", "لمحاربة الرقيق بالهند", "لإدخال زراعة المنسوجات"],
      correct: "لتكون عاصمة عسكرية بديلة لإسكان جنده الأتراك",
      description: "رائع جداً! سامراء شُيدت خصوصاً لتجنب الاحتكاك والفتن وتوسعة السلاح التركي العتيد."
    },
    "تيمبكتو": {
      text: "من الملك الإفريقي الشهير الذي جلب المهندسين والعلماء لتشييد مساجد وقصور تيمبكتو عاصمة مالي العلمية؟",
      options: ["منسا موسى", "إبراهيم بن الأغلب", "إدريس بن عبد الله", "الخديوي عباس"],
      correct: "منسا موسى",
      description: "تاريخي مدهش! منسا موسى عاد من الحج ومعه نخبة المفكرين والمهندسين وجعل تيمبكتو عاصمة عالمية."
    },
    "كلوة": {
      text: "أي الأمير شيد سلطنة كلوة على الساحل الشرقي لإفريقيا لتتحكم في تجارة الذهب العظيمة؟",
      options: ["علي بن حسن الشيرازي", "عثمان دان فوديو", "الملك نمر", "الدفتدار"],
      correct: "علي بن حسن الشيرازي",
      description: "ممتاز! الأمير الشيرازي أسس هذه السلطنة الفارسية ونظم العمران والمنازل الحجرية بكلوة."
    }
  };

  const handleCitySelect = (city: typeof HISTORIC_CITIES[0]) => {
    playSound("click");
    setSelectedCity(city);
    setUserAnswer(null);
    setQuizResult(null);
    setCurrentCityQuestion(cityQuizzes[city.name] || null);
  };

  const handleAnswerSubmit = (option: string) => {
    if (!currentCityQuestion || !selectedCity) return;
    
    setUserAnswer(option);
    const isCorrect = option === currentCityQuestion.correct;
    
    if (isCorrect) {
      playSound("success");
      setQuizResult("correct");
      
      // Award points only if not previously awarded
      if (!answeredCities[selectedCity.name]) {
        setScore(prev => prev + 15);
        setAnsweredCities(prev => ({ ...prev, [selectedCity.name]: true }));
      }
      
      // Check if all cities have been explored and solved
      const updatedAnswers = { ...answeredCities, [selectedCity.name]: true };
      const solvedCount = Object.keys(updatedAnswers).filter(k => updatedAnswers[k]).length;
      if (solvedCount >= HISTORIC_CITIES.length) {
        onUnlockBadge("africa_explorer"); // Give Africa Explorer or unique milestone
      }
    } else {
      playSound("fail");
      setQuizResult("wrong");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-xl p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-amber-50 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans text-amber-900 flex items-center gap-2">
            <Compass className="w-7 h-7 text-amber-600 animate-pulse" />
            البوصلة التفاعلية: خريطة المنارات والمدن التاريخية
          </h2>
          <p className="text-amber-700 text-sm mt-1">
            سافِر عبر القارات واستكشف عواصم الممالك الإسلامية والإفريقية والسودانية القديمة. انقُر على النّقاط الحمراء لحل الأسئلة الممتعة وكسب +15 نقطة معرفة!
          </p>
        </div>
        <div className="bg-amber-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-amber-200">
          <Award className="w-5 h-5 text-amber-700" />
          <span className="text-amber-900 font-bold text-sm">
            المدن المستكشفة: {Object.keys(answeredCities).length} / {HISTORIC_CITIES.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Visual Simulated Stylized Map */}
        <div className="lg:col-span-2 bg-[#FDFBF7] rounded-xl border border-amber-100 p-4 relative min-h-[350px] flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {/* Grid Map Background */}
            <div className="w-full h-full bg-[radial-gradient(#d97706_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
          </div>

          {/* Compass Rose Graphic */}
          <div className="absolute top-4 right-4 w-16 h-16 pointer-events-none opacity-20 border-2 border-dashed border-amber-950 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
            <Compass className="w-10 h-10 text-amber-900" />
          </div>

          <div className="relative w-full h-[280px] mt-2">
            {/* Legend / Continent Labels */}
            <div className="absolute left-[8%] top-[12%] text-[10px] md:text-xs font-bold text-amber-800/40 tracking-wider">شمال إفريقيا والمغرب</div>
            <div className="absolute left-[38%] top-[14%] text-[10px] md:text-xs font-bold text-amber-800/40 tracking-wider">مصر والشام</div>
            <div className="absolute right-[12%] top-[8%] text-[10px] md:text-xs font-bold text-amber-800/40 tracking-wider">الخلافة والرافدين</div>
            <div className="absolute left-[20%] top-[45%] text-[10px] md:text-xs font-bold text-amber-800/40 tracking-wider">غرب إفريقيا والسافانا</div>
            <div className="absolute right-[25%] top-[55%] text-[10px] md:text-xs font-bold text-amber-800/40 tracking-wider">بلاد السودان والنيل</div>
            <div className="absolute right-[8%] top-[85%] text-[10px] md:text-xs font-bold text-amber-800/40 tracking-wider">ساحل شرق إفريقيا</div>

            {/* Simulated River Nile & Oceans */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Nile River winding */}
              <path d="M 160,110 C 158,130 178,160 174,180 C 170,195 182,210 180,240" fill="none" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
              {/* Nile delta in Cairo */}
              <path d="M 160,110 L 150,95 M 160,110 L 170,95" fill="none" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
              
              {/* Red Sea Outline */}
              <path d="M 195,110 Q 185,150 205,190 T 215,240" fill="none" stroke="#DBEAFE" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
              {/* Maritime shipping routes (dotted connection lines) */}
              <path d="M 70,85 C 90,80 140,80 155,90 M 155,94 C 180,105 210,120 220,100 M 195,240 Q 200,210 230,225" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            </svg>

            {/* Interactive City Nodes */}
            {HISTORIC_CITIES.map((city, idx) => {
              // Convert percentages or static coords to responsive grids
              const leftPercent = `${city.x}%`;
              const topPercent = `${city.y}%`;
              const isSelected = selectedCity?.name === city.name;
              const isSolved = answeredCities[city.name];

              return (
                <button
                  key={idx}
                  onClick={() => handleCitySelect(city)}
                  className="absolute group -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300 focus:outline-none"
                  style={{ left: leftPercent, top: topPercent }}
                >
                  <div className="relative">
                    {/* Ring ping animation if unsolved & not selected */}
                    {!isSolved && !isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                    )}

                    {/* Outer circle */}
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected 
                        ? "bg-amber-900 border-white scale-125 shadow-lg" 
                        : isSolved 
                        ? "bg-emerald-600 border-emerald-100" 
                        : "bg-red-600 border-red-100 hover:bg-red-500 hover:scale-110"
                    }`}>
                      {isSolved ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <MapPin className={`w-4 h-4 ${isSelected ? "text-amber-200" : "text-white"}`} />
                      )}
                    </div>

                    {/* Styled Marker Tooltip */}
                    <span className={`absolute bottom-9 left-1/2 -translate-x-1/2 bg-amber-950 text-white font-serif px-2.5 py-0.5 rounded text-[11px] shadow-md pointer-events-none transition-all whitespace-nowrap ${
                      isSelected 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                    }`}>
                      {city.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-amber-50/50 p-2 text-center rounded-lg border border-amber-950/5 mt-auto">
            <span className="text-amber-800 text-[11px] font-sans flex items-center justify-center gap-1.5">
              <span>● حمراء: بحاجة للاستكشاف والحل</span>
              <span>•</span>
              <span className="text-emerald-700">● خضراء: تم الاستكشاف بامتياز (+15 نقطة)</span>
            </span>
          </div>
        </div>

        {/* Informative City Details & Quiz Card */}
        <div className="bg-[#FCFAF7] rounded-xl border border-amber-100 p-5 flex flex-col justify-start min-h-[300px]">
          {selectedCity ? (
            <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="pb-3 border-b border-amber-100">
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {selectedCity.country}
                </span>
                <h3 className="text-2xl font-bold font-serif text-amber-950 mt-1">
                  مدينة {selectedCity.name}
                </h3>
              </div>

              <p className="text-amber-900 text-sm leading-relaxed">
                {selectedCity.description}
              </p>

              {/* Bonus Quiz Section */}
              {currentCityQuestion && (
                <div className="bg-white rounded-xl border border-amber-200/80 p-4 mt-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <span>تحدي المعرفة الخاص بالمدينة:</span>
                  </div>
                  
                  <p className="text-amber-950 text-sm font-semibold font-serif leading-relaxed">
                    {currentCityQuestion.text}
                  </p>

                  <div className="space-y-2 mt-2">
                    {currentCityQuestion.options.map((option, oIdx) => {
                      const isUserChoice = userAnswer === option;
                      const isCorrectAnswer = option === currentCityQuestion.correct;
                      
                      let btnStyle = "bg-amber-50/40 hover:bg-amber-50 border-amber-100 text-amber-900";
                      if (userAnswer) {
                        if (isCorrectAnswer) {
                          btnStyle = "bg-emerald-100 border-emerald-400 text-emerald-950";
                        } else if (isUserChoice) {
                          btnStyle = "bg-red-100 border-red-300 text-red-950";
                        } else {
                          btnStyle = "bg-gray-50 border-gray-100 text-gray-400 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={!!userAnswer}
                          onClick={() => handleAnswerSubmit(option)}
                          className={`w-full text-right p-2.5 rounded-lg border text-xs font-medium transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {userAnswer && isCorrectAnswer && <Check className="w-4 h-4 text-emerald-700" />}
                          {userAnswer && isUserChoice && !isCorrectAnswer && <X className="w-4 h-4 text-red-700" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Message */}
                  {quizResult === "correct" && (
                    <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg text-xs font-medium text-center animate-bounce">
                      🎉 مذهل! إجابة صحيحة. حصلت على 15+ نقاط معرفة!
                    </div>
                  )}
                  {quizResult === "wrong" && (
                    <div className="bg-red-50 text-red-800 p-2.5 rounded-lg text-xs font-medium text-center">
                      ❌ أوه! حاول مجدداً مع تصفح معلومات المدينة جيداً.
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto text-amber-800">
              <Compass className="w-14 h-14 text-amber-300 animate-[spin_10s_linear_infinite] mb-3" />
              <h3 className="font-serif font-bold text-lg text-amber-950">
                بانتظار انطلاق المسافر
              </h3>
              <p className="text-xs text-amber-700 mt-1 max-w-[200px]">
                انقر على أي مدينة تاريخية على الخريطة لعرض تفاصيلها النادرة وحل تحدياتها وكسب أوسمة الأبطال!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
