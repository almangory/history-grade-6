/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { UNITS, QUESTIONS, BADGES_LIST } from "./data";
import { QuestionType, Unit, Question } from "./types";
import { playSound } from "./components/SoundEffects";
import { SVGIllustration } from "./components/SVGIllustrations";
import { MapExplorer } from "./components/MapExplorer";
import { AIChatBot } from "./components/AIChatBot";
import { WorksheetGenerator } from "./components/WorksheetGenerator";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, signInWithGoogle, logoutUser, db } from "./firebase";
import {
  Compass,
  BookOpen,
  Globe,
  Lightbulb,
  Heart,
  Award,
  Volume2,
  VolumeX,
  Home,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Trophy,
  Gamepad2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Book,
  FileText,
  User,
  Star,
  MapPin,
  Sparkles,
  Bot,
  Clock,
  Sun,
  Moon,
  Play
} from "lucide-react";

export default function App() {
  // Firebase Auth states
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [loadingAuth, setLoadingAuth] = React.useState<boolean>(true);

  // Game & User Progression States
  const [useSound, setUseSound] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("sub_historian_theme") as "dark" | "light") || "dark";
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("sub_historian_name") || "";
  });
  const [userAvatar, setUserAvatar] = useState<string>(() => {
    return localStorage.getItem("sub_historian_avatar") || "explorer";
  });
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem("sub_historian_score");
    return saved ? parseInt(saved, 10) : 100; // Start with 100 points
  });
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem("sub_historian_badges");
    return saved ? JSON.parse(saved) : [];
  });
  const [favoriteLessons, setFavoriteLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem("sub_historian_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const onToggleFavoriteLesson = (lessonId: string) => {
    handlePlaySound("click");
    setFavoriteLessons(prev => {
      const isFav = prev.includes(lessonId);
      if (isFav) {
        return prev.filter(id => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
  };

  // 1. Google Sign-In & Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(data.name || user.displayName || "مستكشف");
            setUserAvatar(data.avatar || "explorer");
            setScore(data.score ?? 100);
            setUnlockedBadges(data.unlockedBadges || []);
          } else {
            // New user login with Google - create profile in Firestore
            const defaultName = user.displayName || "بطل تاريخي";
            const defaultAvatar = "explorer";
            const initialScore = 100;
            const initialBadges: string[] = [];

            await setDoc(userDocRef, {
              uid: user.uid,
              name: defaultName,
              avatar: defaultAvatar,
              score: initialScore,
              unlockedBadges: initialBadges,
              updatedAt: serverTimestamp()
            });

            setUserName(defaultName);
            setUserAvatar(defaultAvatar);
            setScore(initialScore);
            setUnlockedBadges(initialBadges);
          }
        } catch (error) {
          console.error("Error fetching or creating user profile in Firestore:", error);
        }
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Debounced Cloud Sync when progress updates
  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const syncToCloud = async () => {
        try {
          await setDoc(userDocRef, {
            uid: currentUser.uid,
            name: userName,
            avatar: userAvatar,
            score: score,
            unlockedBadges: unlockedBadges,
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          console.error("Error syncing progress to Firestore:", error);
        }
      };

      const timer = setTimeout(() => {
        syncToCloud();
      }, 1500); // 1.5s debounce ensures we don't bombard Firestore with quick micro-updates
      return () => clearTimeout(timer);
    }
  }, [userName, userAvatar, score, unlockedBadges, currentUser]);

  // App Navigation States
  const [currentTab, setCurrentTab] = useState<"dashboard" | "unit" | "map" | "chat" | "quiz_hub" | "badges" | "worksheets">("dashboard");
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  
  // Lesson Inner Navigation States
  const [lessonActiveSubTab, setLessonActiveSubTab] = useState<"lessons" | "timeline" | "flashcards">("lessons");
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  // Play Mode States
  const [quizMode, setQuizMode] = useState<"none" | "curriculum" | "speedrun" | "match">("none");
  const [quizType, setQuizType] = useState<"lesson" | "unit" | "comprehensive">("unit");
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizCorrectAnswers, setQuizAnswersCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answeredQuestionInGroup, setAnsweredQuestionInGroup] = useState<Record<string, { userOption: string, correct: boolean }>>({});
  const [speedrunTimer, setSpeedrunTimer] = useState(15);
  const [activeSpeedrunStatement, setActiveSpeedrunStatement] = useState<Question | null>(null);
  const [speedrunIntervalId, setSpeedrunIntervalId] = useState<any>(null);

  // Drag & Match Mini-Game States
  const [matchLeft, setMatchLeft] = useState<{ id: string, text: string }[]>([]);
  const [matchRight, setMatchRight] = useState<{ id: string, text: string }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({}); // Mapping representing LeftID -> RightID
  const [wrongMatchLeft, setWrongMatchLeft] = useState<string | null>(null);
  const [wrongMatchRight, setWrongMatchRight] = useState<string | null>(null);

  // Initial user setup state (Temporary draft holding name)
  const [inputName, setInputName] = useState("");
  const [selectedAvatarDraft, setSelectedAvatarDraft] = useState("explorer");

  // Quiz Hub States
  const [qhCategory, setQhCategory] = useState<"lesson" | "unit" | "comprehensive">("comprehensive");
  const [qhUnitId, setQhUnitId] = useState<number>(1);
  const [qhLessonId, setQhLessonId] = useState<string>("u1_l1");
  const [qhSize, setQhSize] = useState<number>(10);
  const [qhChallengeType, setQhChallengeType] = useState<"mcq" | "speedrun" | "match">("mcq");

  // Sync lesson ID when Unit selection changes in Quiz Hub
  useEffect(() => {
    const parentUnit = UNITS.find(u => u.id === qhUnitId);
    if (parentUnit && parentUnit.lessons.length > 0) {
      setQhLessonId(parentUnit.lessons[0].id);
    }
  }, [qhUnitId]);

  // Save progress automatically
  useEffect(() => {
    localStorage.setItem("sub_historian_name", userName);
    localStorage.setItem("sub_historian_avatar", userAvatar);
    localStorage.setItem("sub_historian_score", score.toString());
    localStorage.setItem("sub_historian_badges", JSON.stringify(unlockedBadges));
    localStorage.setItem("sub_historian_theme", theme);
    localStorage.setItem("sub_historian_favorites", JSON.stringify(favoriteLessons));
  }, [userName, userAvatar, score, unlockedBadges, theme, favoriteLessons]);

  // Achievement unlock triggers
  const unlockBadge = (badgeId: string) => {
    if (!unlockedBadges.includes(badgeId)) {
      setUnlockedBadges(prev => [...prev, badgeId]);
      setScore(prev => prev + 50); // Big point bump!
      if (useSound) playSound("levelup");
    }
  };

  // Check achievements automatically based on score milestones
  useEffect(() => {
    if (score >= 200) unlockBadge("perfect_score"); // Marks an early high score milestone
  }, [score]);

  // Speedrun timer effect
  useEffect(() => {
    if (quizMode === "speedrun" && speedrunTimer > 0) {
      const timer = setTimeout(() => {
        setSpeedrunTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (quizMode === "speedrun" && speedrunTimer === 0) {
      handleSpeedrunAnswer(null); // Time out
    }
  }, [speedrunTimer, quizMode]);

  // Sound play wrapper helper
  const handlePlaySound = (type: "click" | "success" | "fail" | "levelup") => {
    if (useSound) playSound(type);
  };

  // Avatar Icons helper
  const renderAvatar = (avatarType: string, sz: string = "w-12 h-12") => {
    const list: Record<string, string> = {
      explorer: "🤠",
      scholar: "👳",
      knight: "🛡️",
      teacher: "👩‍🏫"
    };
    return (
      <div className={`${sz} bg-amber-100 rounded-full flex items-center justify-center text-2xl border border-amber-300 shadow-sm shrink-0`}>
        {list[avatarType] || "🤠"}
      </div>
    );
  };

  // Unit Icon Map
  const renderUnitIcon = (iconName: string) => {
    switch (iconName) {
      case "Compass": return <Compass className="w-8 h-8" />;
      case "BookOpen": return <BookOpen className="w-8 h-8" />;
      case "Globe": return <Globe className="w-8 h-8" />;
      case "Lightbulb": return <Lightbulb className="w-8 h-8" />;
      case "Heart": return <Heart className="w-8 h-8" />;
      default: return <BookOpen className="w-8 h-8" />;
    }
  };

  // Setup / Welcome parsed
  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    setUserName(inputName.trim());
    setUserAvatar(selectedAvatarDraft);
    setScore(100); // Starter points
    setUnlockedBadges([]);
    handlePlaySound("levelup");
  };

  const handleUnitSelect = (unit: Unit) => {
    handlePlaySound("click");
    setSelectedUnitId(unit.id);
    setCurrentLessonIdx(0);
    setTimelineIndex(0);
    setFlashcardIdx(0);
    setFlashcardFlipped(false);
    setLessonActiveSubTab("lessons");
    setQuizMode("none");
    setCurrentTab("unit");
  };

  // Quiz Mode Initiators
  const startComprehensiveQuiz = (unitId: number) => {
    handlePlaySound("click");
    const matchingUnit = UNITS.find(u => u.id === unitId);
    const titleText = matchingUnit ? matchingUnit.title : "";
    const filtered = QUESTIONS.filter(q => q.unitId === unitId);
    setQuizQuestions(filtered);
    setQuizIdx(0);
    setQuizAnswersCount(0);
    setSelectedOption(null);
    setAnsweredQuestionInGroup({});
    setQuizType("unit");
    setQuizTitle(`الاختبار النهائي للوحدة: ${titleText}`);
    setQuizMode("curriculum");
  };

  const startLessonQuiz = (lessonId: string, lessonTitle: string) => {
    handlePlaySound("click");
    const filtered = QUESTIONS.filter(q => q.lessonId === lessonId);
    setQuizQuestions(filtered);
    setQuizIdx(0);
    setQuizAnswersCount(0);
    setSelectedOption(null);
    setAnsweredQuestionInGroup({});
    setQuizType("lesson");
    setQuizTitle(`اختبار فهم الدرس: ${lessonTitle}`);
    setQuizMode("curriculum");
  };

  const startComprehensiveSubjectQuiz = () => {
    handlePlaySound("click");
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 15);
    setQuizQuestions(selected);
    setQuizIdx(0);
    setQuizAnswersCount(0);
    setSelectedOption(null);
    setAnsweredQuestionInGroup({});
    setQuizType("comprehensive");
    setQuizTitle("الامتحان الشامل والنهائي لكامل كتاب التاريخ");
    setQuizMode("curriculum");
  };

  const startQuizHubCustom = (config: {
    type: "lesson" | "unit" | "comprehensive";
    unitId?: number;
    lessonId?: string;
    lessonTitle?: string;
    questionCount: number;
    challengeType: "mcq" | "speedrun" | "match";
  }) => {
    handlePlaySound("click");
    
    // 1. Gather pool of questions
    let pool: Question[] = [];
    let titleText = "";
    
    if (config.type === "comprehensive") {
      pool = [...QUESTIONS];
      titleText = "الامتحان النهائي الشامل لكامل كتاب التاريخ";
    } else if (config.type === "unit") {
      const matchUnit = UNITS.find(u => u.id === config.unitId);
      pool = QUESTIONS.filter(q => q.unitId === config.unitId);
      titleText = `الاختبار النهائي للوحدة: ${matchUnit ? matchUnit.title : ""}`;
    } else if (config.type === "lesson") {
      pool = QUESTIONS.filter(q => q.lessonId === config.lessonId);
      titleText = `اختبار فهم الدرس: ${config.lessonTitle || ""}`;
    }
    
    // Filter by type if speedrun or match
    if (config.challengeType === "speedrun") {
      pool = pool.filter(q => q.type === QuestionType.TRUE_FALSE);
      if (pool.length === 0) {
        // Fallback to general True/False
        pool = QUESTIONS.filter(q => q.type === QuestionType.TRUE_FALSE);
      }
    } else if (config.challengeType === "match") {
      pool = pool.filter(q => q.type === QuestionType.MATCH);
      if (pool.length === 0) {
        // Fallback to general Match
        pool = QUESTIONS.filter(q => q.type === QuestionType.MATCH);
      }
    }
    
    if (pool.length === 0) {
      pool = [...QUESTIONS];
    }
    
    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    
    // Slice to the requested question count
    const selected = shuffled.slice(0, Math.min(config.questionCount, shuffled.length));
    
    if (selected.length === 0) {
      return;
    }

    // Set up standard keys
    setQuizQuestions(selected);
    setQuizIdx(0);
    setQuizAnswersCount(0);
    setSelectedOption(null);
    setAnsweredQuestionInGroup({});
    setQuizType(config.type);
    
    // Now trigger the appropriate mode!
    if (config.challengeType === "speedrun") {
      setSpeedrunTimer(15);
      setActiveSpeedrunStatement(selected[0]);
      setQuizMode("speedrun");
      setQuizTitle(`تحدي السرعة (صح أو خطأ): ${titleText}`);
    } else if (config.challengeType === "match") {
      const sourceMatch = selected[0];
      if (sourceMatch && sourceMatch.matchPairs) {
        const leftSide = sourceMatch.matchPairs.map((p, idx) => ({ id: `L_${idx}`, text: p.left }));
        const rightSide = sourceMatch.matchPairs.map((p, idx) => ({ id: `R_${idx}`, text: p.right }));
        
        const shuffledLeft = [...leftSide].sort(() => Math.random() - 0.5);
        const shuffledRight = [...rightSide].sort(() => Math.random() - 0.5);

        setMatchLeft(shuffledLeft);
        setMatchRight(shuffledRight);
        setSelectedLeft(null);
        setMatchedPairs({});
        setQuizMode("match");
        setQuizTitle(`لعبة التوصيل الذكي: ${titleText}`);
      } else {
        // fallback to standard quiz if no match pairs found
        setQuizMode("curriculum");
        setQuizTitle(titleText);
      }
    } else {
      // standard curriculum quiz
      setQuizMode("curriculum");
      setQuizTitle(titleText);
    }
  };

  const startSpeedrunQuiz = (unitId: number) => {
    handlePlaySound("click");
    // Speedrun is True/False questions only
    const filtered = QUESTIONS.filter(q => q.unitId === unitId && q.type === QuestionType.TRUE_FALSE);
    if (filtered.length === 0) return;
    setQuizQuestions(filtered);
    setQuizIdx(0);
    setQuizAnswersCount(0);
    setSpeedrunTimer(15);
    setActiveSpeedrunStatement(filtered[0]);
    setQuizMode("speedrun");
  };

  const startMatchGame = (unitId: number) => {
    handlePlaySound("click");
    const filtered = QUESTIONS.filter(q => q.unitId === unitId && q.type === QuestionType.MATCH);
    if (filtered.length === 0) return;
    
    // Setup Left & Right lists of selected match set
    const sourceMatch = filtered[0]; // Take first match set
    if (!sourceMatch.matchPairs) return;
    
    const leftSide = sourceMatch.matchPairs.map((p, idx) => ({ id: `L_${idx}`, text: p.left }));
    const rightSide = sourceMatch.matchPairs.map((p, idx) => ({ id: `R_${idx}`, text: p.right }));
    
    // Shuffle lists
    const shuffledLeft = [...leftSide].sort(() => Math.random() - 0.5);
    const shuffledRight = [...rightSide].sort(() => Math.random() - 0.5);

    setMatchLeft(shuffledLeft);
    setMatchRight(shuffledRight);
    setSelectedLeft(null);
    setMatchedPairs({});
    setQuizQuestions(filtered);
    setQuizMode("match");
  };

  // Handle MCQ / True-False choices
  const handleAnswerSelection = (option: string) => {
    if (selectedOption || quizMode !== "curriculum") return;
    
    const currentQ = quizQuestions[quizIdx];
    setSelectedOption(option);
    
    const isCorrect = option === currentQ.correctAnswer;
    setAnsweredQuestionInGroup(prev => ({
      ...prev,
      [currentQ.id]: { userOption: option, correct: isCorrect }
    }));

    if (isCorrect) {
      handlePlaySound("success");
      setQuizAnswersCount(prev => prev + 1);
      const pts = quizType === "comprehensive" ? 15 : 10;
      setScore(prev => prev + pts);
    } else {
      handlePlaySound("fail");
    }
  };

  const handleNextQuiz = () => {
    handlePlaySound("click");
    setSelectedOption(null);
    if (quizIdx + 1 < quizQuestions.length) {
      setQuizIdx(prev => prev + 1);
    } else {
      // Quiz complete! Assess score
      const scorePercentage = (quizCorrectAnswers / quizQuestions.length) * 100;
      if (scorePercentage >= 80) {
        if (quizType === "comprehensive") {
          unlockBadge("grand_historian");
        } else if (quizType === "unit") {
          // Unlock badge related to unit
          const matchingUnit = UNITS.find(u => u.id === selectedUnitId);
          if (matchingUnit) {
            unlockBadge(`u${matchingUnit.id}`);
          }
        }
      }
      setSelectedOption(null);
    }
  };

  // Handle Speedrun Answer (True/False)
  const handleSpeedrunAnswer = (answer: string | null) => {
    const currentQ = quizQuestions[quizIdx];
    const isCorrect = answer === currentQ.correctAnswer;

    if (isCorrect) {
      handlePlaySound("success");
      setQuizAnswersCount(prev => prev + 1);
      setScore(prev => prev + 15); // Harder challenge, more points
    } else {
      handlePlaySound("fail");
    }

    if (quizIdx + 1 < quizQuestions.length) {
      setQuizIdx(prev => prev + 1);
      setSpeedrunTimer(15);
      setActiveSpeedrunStatement(quizQuestions[quizIdx + 1]);
    } else {
      // End speedrun
      if (quizCorrectAnswers + 1 >= quizQuestions.length) {
        unlockBadge(`u${selectedUnitId}`);
      }
      setQuizIdx(quizQuestions.length); // trigger end card
    }
  };

  // Handle Matching tap
  const handleLeftTap = (leftId: string) => {
    if (matchedPairs[leftId]) return; // Already matched
    handlePlaySound("click");
    setSelectedLeft(leftId);
    setWrongMatchLeft(null);
    setWrongMatchRight(null);
  };

  const handleRightTap = (rightId: string) => {
    if (!selectedLeft) return; // No left selected
    
    // Check if correct match
    // Source index from LeftID & RightID: "L_0", "R_0", left with index equal to right
    const leftIndex = selectedLeft.split("_")[1];
    const rightIndex = rightId.split("_")[1];
    
    if (leftIndex === rightIndex) {
      // Correct!
      handlePlaySound("success");
      setMatchedPairs(prev => ({ ...prev, [selectedLeft]: rightId }));
      setScore(prev => prev + 20); // matching awards higher points
      setSelectedLeft(null);

      // Check if all matched
      const totalPairs = quizQuestions[0].matchPairs?.length || 0;
      if (Object.keys(matchedPairs).length + 1 === totalPairs) {
        unlockBadge(`u${selectedUnitId}`);
      }
    } else {
      // Wrong match
      handlePlaySound("fail");
      setWrongMatchLeft(selectedLeft);
      setWrongMatchRight(rightId);
      setTimeout(() => {
        setWrongMatchLeft(null);
        setWrongMatchRight(null);
      }, 800);
      setSelectedLeft(null);
    }
  };

  // Loading check
  if (loadingAuth) {
    return (
      <div className={`min-h-screen bg-[#09080f] flex flex-col items-center justify-center font-serif text-slate-100 gap-3 ${theme === "light" ? "light-theme" : ""}`}>
        <Sparkles className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-sm font-sans text-slate-400">جاري تحميل سجل البطل...</p>
      </div>
    );
  }

  // Logged-out Welcome Parchment Style Form
  if (!userName) {
    return (
      <div className={`min-h-screen bg-[#09080f] flex items-center justify-center p-4 relative overflow-hidden font-serif ${theme === "light" ? "light-theme" : ""}`}>
        {/* Floating Theme Switcher on onboarding */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => {
              playSound("click");
              setTheme(theme === "dark" ? "light" : "dark");
            }}
            title={theme === "dark" ? "التحويل للوضع النهاري" : "التحويل للوضع الليلي"}
            className="p-2.5 rounded-xl border border-indigo-950 bg-[#18152c] text-amber-400 hover:scale-110 active:scale-95 transition cursor-pointer shadow-md"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>

        {/* Animated Background Ornaments */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-indigo-900/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-900/10 rounded-full filter blur-2xl opacity-40 animate-pulse"></div>

        <div className="bg-[#121020] border border-slate-800/50 max-w-xl w-full rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-8 md:p-12 relative text-right">
          {/* Internal Vintage Border */}
          <div className="absolute inset-3 border border-slate-800/30 rounded-2xl pointer-events-none"></div>

          <div className="text-center space-y-6 relative">
            {/* Header Stamp */}
            <div className="mx-auto w-16 h-16 bg-[#1b192e] text-amber-400 rounded-full flex items-center justify-center shadow-lg border border-slate-700/50">
              <Compass className="w-9 h-9 animate-[spin_120s_linear_infinite]" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-amber-400 font-serif leading-tight">
                المُؤرِّخ الصَّغير التفاعلي
              </h1>
              <p className="text-slate-300 text-sm md:text-base font-sans">
                باصِرة رقمية ذكية لكتاب التاريخ المعتمد للصف السادس الابتدائي
              </p>
            </div>

            {/* Google Sign-In Wall Option */}
            <div className="bg-[#18152c]/90 border border-indigo-950 rounded-2xl p-6 text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-sm font-sans">التسجيل السحابي والذكاء الاصطناعي</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                سجل دخولك باستخدام Google لحفظ نقاط وتقدم دراستك في السحاب ولتفعيل حوار المعلم التاريخي الذكي فورا!
              </p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    handlePlaySound("click");
                    await signInWithGoogle();
                  } catch (e) {
                    console.error("Popup Sign in fail", e);
                  }
                }}
                className="mx-auto w-fit bg-white hover:bg-slate-100 text-slate-900 font-sans font-bold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2.5 transition active:scale-[0.98] cursor-pointer shadow-md"
              >
                {/* Google Logo SVG */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.7 0 3.23.58 4.43 1.73l3.31-3.3C17.74 1.54 15.01 1 12 1 7.15 1 3.1 3.94 1.25 8.16l3.96 3.07C6.15 7.6 8.78 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.56l3.66 2.84c2.14-1.97 3.75-4.87 3.75-8.51z" />
                  <path fill="#FBBC05" d="M5.21 11.23c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.25 8.16C.45 9.77 0 11.58 0 13.5s.45 3.73 1.25 5.34l3.96-3.07c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.96-1.07 7.95-2.91l-3.66-2.84c-1.01.68-2.31 1.09-3.79 1.09-3.22 0-5.85-2.56-6.79-6.19l-3.96 3.07C3.1 20.06 7.15 23 12 23z" />
                </svg>
                <span>الدخول الفوري السريع بحساب Google</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800/40"></div>
              <span className="flex-shrink mx-4 text-xs text-slate-500 font-sans">أو الاستمرار كضيف دون مزايا الذكاء الاصطناعي</span>
              <div className="flex-grow border-t border-slate-800/40"></div>
            </div>

            <form onSubmit={handleStartGame} className="space-y-6">
              <div className="space-y-2 text-right">
                <label className="block text-sm font-bold text-slate-200 pr-1">
                  مرحباً بك يا بطل! ما هو اسمك الكريم؟
                </label>
                <input
                  type="text"
                  required
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="أدخل اسمك الكريم هنا لتبدأ المغامرة..."
                  className="w-full bg-[#18162b] hover:bg-[#1a1833] border-2 border-indigo-950 rounded-xl px-4 py-3.5 text-center text-slate-100 text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-[#1a1833] transition font-sans"
                />
              </div>

              {/* Avatar Selector */}
              <div className="space-y-3">
                <span className="block text-sm font-bold text-slate-200 text-right pr-1">
                  اختر رمز شخصية بطل التاريخ الخاص بك:
                </span>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: "explorer", label: "المستكشف", emoji: "🤠" },
                    { id: "scholar", label: "المؤرخ", emoji: "👳" },
                    { id: "knight", label: "الفارس", emoji: "🛡️" },
                    { id: "teacher", label: "الرسام", emoji: "👩‍🏫" }
                  ].map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        handlePlaySound("click");
                        setSelectedAvatarDraft(av.id);
                      }}
                      className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition ${
                        selectedAvatarDraft === av.id
                          ? "bg-amber-800/80 text-white border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-105"
                          : "bg-[#18152c]/50 border-indigo-950 hover:bg-[#1f1b3d] text-slate-300"
                      }`}
                    >
                      <span className="text-3xl">{av.emoji}</span>
                      <span className="text-[11px] font-sans font-bold">{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-serif font-bold text-lg py-4 rounded-xl shadow-lg border border-transparent hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer"
              >
                انطلاق في رحلة التاريخ الممتعة 🚀
              </button>
            </form>

            <p className="text-[11px] text-slate-400 font-sans pt-2 leading-relaxed">
              استكشف بوابات التاريخ الإسلامي وعصر السودان الذهبي، أحدث التغييرات بالألغاز والألعاب مع نقاط المعرفة!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active student logged in
  const selectedUnit = selectedUnitId ? UNITS.find(u => u.id === selectedUnitId) : null;

  return (
    <div className={`min-h-screen bg-[#09080f] text-slate-150 font-sans flex flex-col ${theme === "light" ? "light-theme" : ""}`}>
      {/* Visual top bar */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-indigo-600 to-amber-700 shrink-0"></div>

      {/* Main Top Header Navigation */}
      <header className="bg-[#121020] border-b border-indigo-950/60 px-4 md:px-8 py-4 sticky top-0 z-40 shadow-md shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                handlePlaySound("click");
                setCurrentTab("dashboard");
                setSelectedUnitId(null);
              }}
              className="bg-[#1b1930] hover:bg-[#252244] border border-indigo-900/50 text-amber-400 p-2.5 rounded-xl shadow-md hover:scale-105 transition cursor-pointer"
            >
              <Compass className="w-6 h-6 animate-[spin_40s_linear_infinite]" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-amber-400 flex items-center gap-1.5">
                <span>المُؤرِّخ الصَّغير 🏛️</span>
                <span className="text-xs md:text-sm bg-[#1e1422] text-amber-400 border border-amber-950 px-2.5 py-0.5 rounded-full font-sans font-bold">الصف السادس</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">سافر في التاريخ وعش غمار المغامرة الذكية</p>
            </div>
          </div>

          {/* User Score Ribbon */}
          <div className="flex items-center gap-3 select-none flex-wrap justify-center font-sans">
            {/* Theme Toggle */}
            <button
              onClick={() => {
                handlePlaySound("click");
                setTheme(theme === "dark" ? "light" : "dark");
              }}
              title={theme === "dark" ? "التحويل للوضع النهاري" : "التحويل للوضع الليلي"}
              className="p-2.5 rounded-xl border border-indigo-950/60 bg-[#18152c] text-amber-400 hover:scale-105 active:scale-95 transition cursor-pointer shadow-sm flex items-center justify-center"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setUseSound(!useSound)}
              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                useSound ? "bg-[#1d121c] text-amber-400 border-amber-900/30" : "bg-[#18152c] text-slate-500 border-indigo-950"
              }`}
            >
              {useSound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Achievements Card */}
            <button
              onClick={() => {
                handlePlaySound("click");
                setCurrentTab("badges");
              }}
              className="bg-[#19152b] hover:bg-[#231d3d] border border-indigo-950/60 rounded-xl px-3 py-2 flex items-center gap-1.5 transition text-yellow-400 cursor-pointer"
            >
              <Trophy className="w-5 h-5 text-yellow-500 shrink-0" />
              <div className="text-right">
                <div className="text-[10px] font-bold text-yellow-600 leading-none">الأوسمة</div>
                <div className="text-xs font-bold font-serif text-slate-100">{unlockedBadges.length} / {BADGES_LIST.length}</div>
              </div>
            </button>

            {/* Knowledge points total badge */}
            <div className="bg-[#1e131d] text-white border border-amber-950/50 rounded-xl px-4 py-2 flex items-center gap-2 shadow-inner">
              <Star className="w-5 h-5 text-amber-400 animate-pulse shrink-0 fill-amber-400" />
              <div className="text-right">
                <div className="text-[10px] text-amber-500 leading-none">نقاط المعرفة</div>
                <div className="text-sm font-bold font-serif text-slate-50">{score}</div>
              </div>
            </div>

            {/* Avatar display with Google status & log-out */}
            <div className="flex items-center gap-2 border-r pr-3 border-indigo-950/60 mr-1">
              {renderAvatar(userAvatar, "w-10 h-10")}
              <div className="text-right hidden sm:block">
                <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1 justify-end">
                  {currentUser && (
                    <span className="bg-amber-400/15 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-sans scale-90 order-last">
                      جوجل
                    </span>
                  )}
                  <span>{userName}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-end gap-2">
                  {currentUser && (
                    <button
                      onClick={async () => {
                        handlePlaySound("click");
                        await logoutUser();
                        setUserName("");
                        localStorage.removeItem("sub_historian_name");
                      }}
                      className="text-red-400 hover:text-red-300 underline font-bold cursor-pointer transition text-[9px]"
                    >
                      خروج
                    </button>
                  )}
                  <span>مستوى {Math.floor(score / 300) + 1}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Real-time Global Navigation Tabs */}
      <div className="bg-[#121020]/95 border-b border-indigo-950/60 sticky top-[73px] z-30 backdrop-blur-md px-4 shrink-0 transition select-none shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-3 gap-4">
          <div className="flex items-center gap-1.5 md:gap-3 overflow-x-auto no-scrollbar pb-1 sm:pb-0 scrollbar-none">
            <button
              id="nav-dashboard"
              onClick={() => {
                handlePlaySound("click");
                setCurrentTab("dashboard");
                setSelectedUnitId(null);
                setQuizMode("none");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                (currentTab === "dashboard" || currentTab === "unit") && quizMode === "none"
                  ? "bg-amber-800 text-slate-100 shadow-md border border-amber-600/30 scale-102"
                  : "bg-[#18152c]/65 text-slate-300 hover:bg-[#201c3e]/80 border border-transparent hover:text-slate-100"
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0 text-amber-500" />
              <span>المنهج والوحدات 📖</span>
            </button>

            <button
              id="nav-quiz-hub"
              onClick={() => {
                handlePlaySound("click");
                setCurrentTab("quiz_hub");
                setQuizMode("none");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                currentTab === "quiz_hub" && quizMode === "none"
                  ? "bg-amber-800 text-slate-100 shadow-md border border-amber-600/30 scale-102"
                  : "bg-[#18152c]/65 text-slate-300 hover:bg-[#201c3e]/80 border border-transparent hover:text-slate-100"
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>مِنَصَّةُ الِاخْتِبَارَاتِ 📝</span>
            </button>

            <button
              id="nav-worksheets"
              onClick={() => {
                handlePlaySound("click");
                setCurrentTab("worksheets");
                setQuizMode("none");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                currentTab === "worksheets" && quizMode === "none"
                  ? "bg-amber-800 text-slate-100 shadow-md border border-amber-600/30 scale-102"
                  : "bg-[#18152c]/65 text-slate-300 hover:bg-[#201c3e]/80 border border-transparent hover:text-slate-100"
              }`}
            >
              <FileText className="w-4 h-4 text-sky-400 shrink-0" />
              <span>أَوْرَاقُ العَمَلِ وَالطبَاعَة 🖨️</span>
            </button>

            <button
              id="nav-map"
              onClick={() => {
                handlePlaySound("click");
                setCurrentTab("map");
                setQuizMode("none");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                currentTab === "map" && quizMode === "none"
                  ? "bg-amber-800 text-slate-100 shadow-md border border-amber-600/30 scale-102"
                  : "bg-[#18152c]/65 text-slate-300 hover:bg-[#201c3e]/80 border border-transparent hover:text-slate-100"
              }`}
            >
              <Compass className="w-4 h-4 text-teal-400 shrink-0" />
              <span>خريطة المعرفة 🗺️</span>
            </button>

            <button
              id="nav-chat"
              onClick={() => {
                handlePlaySound("click");
                setCurrentTab("chat");
                setQuizMode("none");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                currentTab === "chat" && quizMode === "none"
                  ? "bg-amber-800 text-slate-100 shadow-md border border-amber-600/30 scale-102"
                  : "bg-[#18152c]/65 text-slate-300 hover:bg-[#201c3e]/80 border border-transparent hover:text-slate-100"
              }`}
            >
              <Bot className="w-4 h-4 text-purple-400 shrink-0" />
              <span>المعلم الذكي 🤖</span>
            </button>

            <button
              id="nav-badges"
              onClick={() => {
                handlePlaySound("click");
                setCurrentTab("badges");
                setQuizMode("none");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                currentTab === "badges" && quizMode === "none"
                  ? "bg-amber-800 text-slate-100 shadow-md border border-amber-600/30 scale-102"
                  : "bg-[#18152c]/65 text-slate-300 hover:bg-[#201c3e]/80 border border-transparent hover:text-slate-100"
              }`}
            >
              <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>لوحة الأوسمة 🏆</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold bg-[#141221] py-1 px-3 rounded-lg border border-indigo-950">
              رصيد الأسئلة: {QUESTIONS.length} سؤال وبطاقة 📚
            </span>
          </div>
        </div>
      </div>

      {/* Main Container Wrapper */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* TAB 1: DASHBOARD / UNITS GRID */}
        {currentTab === "dashboard" && quizMode === "none" && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            {/* Quick Hero Banner */}
            <div className="relative bg-gradient-to-br from-[#1b1236] to-[#2e1d13] rounded-3xl p-6 md:p-10 text-white shadow-xl overflow-hidden border border-indigo-900/50">
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="relative max-w-2xl space-y-3 text-right">
                <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>بداية عام دراسي حافل ومتألق!</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-serif leading-tight text-amber-400">
                  أهلاً بك معنا في مغامرة التاريخ يا بطل، {userName}! 🎯
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                  هذا الموقع التفاعلي يختصر لك كتاب التاريخ للصف السادس الابتدائي بطريقة شيّقة وممتعة بالصور، والخطوط الزمنية التفاعلية، والألعاب وحل الخرائط للتقدم في لوحة الشرف! يمكنك أيضاً الدردشة الفورية مع "المعلم التاريخي الذكي" للإجابة عن أسئلتك.
                </p>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      handlePlaySound("click");
                      setCurrentTab("map");
                    }}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border border-transparent rounded-xl px-4 py-2 text-xs font-extrabold transition shadow flex items-center gap-1.5 cursor-pointer h-10 text-white"
                  >
                    <Compass className="w-4 h-4" />
                    <span>تصفح خريطة المدن</span>
                  </button>
                  <button
                    onClick={() => {
                      handlePlaySound("click");
                      setCurrentTab("quiz_hub");
                    }}
                    className="bg-gradient-to-r from-fuchsia-700 to-fuchsia-800 hover:from-fuchsia-600 hover:to-fuchsia-750 text-slate-100 border border-transparent rounded-xl px-4 py-2 text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer h-10 shadow-sm"
                  >
                    <Gamepad2 className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>منصة الاختبارات 📝</span>
                  </button>
                  <button
                    onClick={() => {
                      handlePlaySound("click");
                      setCurrentTab("chat");
                    }}
                    className="bg-white/10 hover:bg-white/20 text-slate-100 border border-slate-700/40 rounded-xl px-4 py-2 text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer h-10"
                  >
                    <Bot className="w-4 h-4 text-amber-400" />
                    <span>اسأل المعلم الذكي</span>
                  </button>
                </div>
              </div>

              {/* Absolute illustration representing historical scroll */}
              <div className="absolute left-6 bottom-4 lg:bottom-2 w-32 h-32 md:w-44 md:h-44 opacity-15 lg:opacity-30 hidden md:block text-amber-300 pointer-events-none transform -rotate-12 translate-y-6">
                <Book className="w-full h-full" />
              </div>
            </div>

            {/* FAVORITE LESSONS QUICK ACCESS */}
            {favoriteLessons.length > 0 && (
              <div className="bg-[#15122b]/40 rounded-2xl border border-indigo-950/60 p-5 space-y-3">
                <h4 className="text-sm font-sans font-extrabold text-amber-400 flex items-center gap-1.5 border-b border-indigo-950/30 pb-2">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />
                  <span>فهرس الدروس والوحدات المفضلة لديك ({favoriteLessons.length}) ⭐</span>
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {UNITS.flatMap(u => u.lessons)
                    .filter(l => favoriteLessons.includes(l.id))
                    .map(l => {
                      const unit = UNITS.find(u => u.lessons.some(les => les.id === l.id));
                      return (
                        <button
                          key={l.id}
                          onClick={() => {
                            if (unit) {
                              handlePlaySound("click");
                              setSelectedUnitId(unit.id);
                              const idx = unit.lessons.findIndex(les => les.id === l.id);
                              setCurrentLessonIdx(idx >= 0 ? idx : 0);
                              setCurrentTab("unit");
                            }
                          }}
                          className="bg-[#18152c] hover:bg-[#201c3e] border border-indigo-950 px-3 py-2 rounded-xl text-xs text-slate-200 transition flex items-center gap-1.5 cursor-pointer max-w-xs truncate"
                        >
                          <span className="text-[10px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded leading-none">
                            الوحدة {unit?.id || "6"}
                          </span>
                          <span className="font-serif font-semibold truncate text-[11px]">{l.title}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Lessons Curriculum Units Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-950/60 pb-2">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-amber-400" />
                  منهج التاريخ التفاعلي (5 وحدات كاملة)
                </h3>
                <span className="text-xs text-slate-400 font-medium font-sans">اختر وحدة لتقرأ دروسها وتخوض اختباراتها وتجني الأوسمة</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {UNITS.map((unit) => {
                  const unitBadgeUnlocked = unlockedBadges.includes(`u${unit.id}`);

                  return (
                    <div
                      key={unit.id}
                      onClick={() => handleUnitSelect(unit)}
                      className="group bg-[#121020] rounded-2xl border border-indigo-950/80 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)] hover:scale-[1.01] hover:border-amber-500/40 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full relative"
                    >
                      {/* Accent color bar */}
                      <div className={`h-1.5 w-full bg-${unit.themeColor}-600/70`}></div>
                      
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          {/* Unit Title & Icon */}
                          <div className="flex items-center justify-between">
                            <div className="p-3 rounded-xl bg-[#17142d] text-amber-400 border border-slate-800/60 group-hover:scale-105 transition">
                              {renderUnitIcon(unit.icon)}
                            </div>
                            {unitBadgeUnlocked ? (
                              <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm font-sans">
                                <Award className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                                <span>تم فتح الوسام</span>
                              </span>
                            ) : (
                              <span className="bg-slate-900/60 text-slate-400 border border-slate-800/40 text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 font-sans">
                                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                                <span>الوسام مغلق</span>
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-right">
                            <span className="text-[11px] text-amber-500/80 font-bold uppercase tracking-wider font-sans">الوحدة {unit.id}</span>
                            <h4 className="text-xl font-bold font-serif text-slate-100 leading-snug group-hover:text-amber-400 transition">
                              {unit.title}
                            </h4>
                            <p className="text-xs text-slate-400 leading-none">
                              {unit.subtitle}
                            </p>
                          </div>

                          <p className="text-xs text-slate-300 font-serif leading-relaxed line-clamp-2">
                            {unit.description}
                          </p>
                        </div>

                        {/* Extra indicators */}
                        <div className="pt-3 border-t border-indigo-950/40 flex items-center justify-between text-xs font-medium text-slate-300">
                          <span className="font-sans text-slate-400">الدروس: {unit.lessons.length}</span>
                          <span className="font-sans flex items-center gap-1 text-slate-200 font-bold group-hover:translate-x-[-4px] transition duration-200">
                            <span>تصحف تفاعلياً</span>
                            <ArrowRight className="w-3.5 h-3.5 transform rotate-180" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Play options / Mini games */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Interactive Map preview card */}
              <div className="bg-[#14122d]/60 border border-indigo-950/80 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="space-y-2 text-right">
                  <h4 className="text-lg font-bold font-serif text-amber-400 flex items-center gap-1.5 justify-end">
                    <span>البوصلة التفاعلية: خريطة الممالك والمدن</span>
                    <Compass className="w-5 h-5 text-amber-400" />
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    هل ترغب في السفر عبر الزمان إلى سنار عاصمة الفونج، أو بغداد الدائرية، أو تيمبكتو عاصمة العلم، أو صقلية الأغالبة؟ انقر وحل اختبارات المدن لتجني نقاطاً إضافية!
                  </p>
                  <button
                    onClick={() => {
                      handlePlaySound("click");
                      setCurrentTab("map");
                    }}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow mt-1 inline-flex items-center gap-1 text-right cursor-pointer border-transparent"
                  >
                    <span>افتح البوصلة التاريخية والخرائط</span>
                  </button>
                </div>
                <div className="w-24 h-24 stroke-amber-500 text-amber-400 shrink-0">
                  <Compass className="w-full h-full opacity-40 animate-[spin_180s_linear_infinite]" />
                </div>
              </div>

              {/* Box 2: Smart Chatbot helper */}
              <div className="bg-[#1a1226]/60 border border-indigo-950/80 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="space-y-2 text-right">
                  <h4 className="text-lg font-bold font-serif text-amber-400 flex items-center gap-1.5 justify-end">
                    <span>احصل على إجابات ذكية فورية!</span>
                    <Bot className="w-5 h-5 text-amber-400" strokeWidth="2.5" />
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    سواء كنت مندهشاً من حرق إسماعيل باشا في شندي، أو متشوّقاً لقصة بناء بغداد الدائرية، أو تريد معرفة فتون الفاطميين وقنوات النهضة، فإن المعلم الذكي هنا للإجابة عليك فوراً وتوضيح المنهج بشكل بسيط!
                  </p>
                  <button
                    onClick={() => {
                      handlePlaySound("click");
                      setCurrentTab("chat");
                    }}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow mt-1 inline-flex items-center gap-1 text-right cursor-pointer border-transparent"
                  >
                    <span>دردش مع أستاذ التاريخ الذكي</span>
                  </button>
                </div>
                <div className="w-24 h-24 stroke-amber-500 text-amber-400 shrink-0 flex items-center justify-center">
                  <Bot className="w-20 h-20 opacity-40 text-amber-400 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MAP EXPLORER */}
        {currentTab === "map" && quizMode === "none" && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <button
              onClick={() => {
                handlePlaySound("click");
                setCurrentTab("dashboard");
              }}
              className="bg-[#1b1930] hover:bg-[#252244] text-slate-100 text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 border border-indigo-900/40 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 transform rotate-180" />
              <span>العودة للرئيسية</span>
            </button>
            <MapExplorer score={score} setScore={setScore} onUnlockBadge={unlockBadge} />
          </div>
        )}

        {/* TAB 3: SMART CHATBOT */}
        {currentTab === "chat" && quizMode === "none" && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <button
              onClick={() => {
                handlePlaySound("click");
                setCurrentTab("dashboard");
              }}
              className="bg-[#1b1930] hover:bg-[#252244] text-slate-100 text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 border border-indigo-900/40 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 transform rotate-180" />
              <span>العودة للرئيسية</span>
            </button>
            <AIChatBot currentUser={currentUser} onSignInWithGoogle={signInWithGoogle} />
          </div>
        )}

        {/* TAB 4: BADGES CABINET */}
        {currentTab === "badges" && quizMode === "none" && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center justify-between border-b border-indigo-950/60 pb-4">
              <h2 className="text-2xl font-bold font-serif text-slate-100 flex items-center gap-2">
                <Trophy className="w-7 h-7 text-amber-400 animate-pulse" />
                لوحة الشرف والأوسمة الذهبية
              </h2>
              <button
                onClick={() => {
                  handlePlaySound("click");
                  setCurrentTab("dashboard");
                }}
                className="bg-[#1b1930] hover:bg-[#252244] border border-indigo-900/40 text-slate-100 text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                العودة للرئيسية
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
              {BADGES_LIST.map((badge) => {
                const isUnlocked = unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`rounded-2xl border p-5 flex items-center gap-4 transition-all ${
                      isUnlocked
                        ? "bg-[#1f162e]/75 border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.1)] animate-[pulse_5s_infinite]"
                        : "bg-[#121020]/40 border-indigo-950/40 text-slate-500 opacity-60"
                    }`}
                  >
                    {/* Badge Icon */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow border ${
                      isUnlocked
                        ? "bg-gradient-to-tr from-yellow-400 to-amber-600 border-yellow-300 text-white animate-spin-once"
                        : "bg-slate-900 border-slate-800 text-slate-600"
                    }`}>
                      <Award className="w-9 h-9 fill-current" />
                    </div>

                    <div className="space-y-1 text-right flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold font-serif text-slate-100 text-base">{badge.title}</h4>
                        {isUnlocked ? (
                          <span className="bg-emerald-950 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-bold border border-emerald-900/40">تم الفتح</span>
                        ) : (
                          <span className="bg-slate-900 text-slate-400 text-[9px] px-1.5 py-0.5 rounded font-bold border border-slate-800/40">الفتح: {badge.condition}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB WORKSHEETS: WORKSHEETS GENERATOR & PRINT OUTS */}
        {currentTab === "worksheets" && quizMode === "none" && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <WorksheetGenerator
              units={UNITS}
              questions={QUESTIONS}
              favoriteLessons={favoriteLessons}
              onToggleFavoriteLesson={onToggleFavoriteLesson}
              onPlaySound={handlePlaySound}
              score={score}
              setScore={setScore}
            />
          </div>
        )}

        {/* TAB 5: LESSON READER & QUIZ TRAY */}
        {currentTab === "unit" && selectedUnit && quizMode === "none" && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            {/* Unit Cover Header */}
            <div className="bg-gradient-to-br from-[#121020] to-[#1a1122] rounded-3xl p-6 border border-indigo-950 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute inset-5 border border-slate-800/20 rounded-2xl pointer-events-none"></div>

              <div className="space-y-3 relative text-right flex-1 z-10">
                <span className="bg-[#1e121e] text-amber-400 border border-amber-900/40 text-xs px-2.5 py-0.5 rounded-full font-bold">الوحدة {selectedUnit.id}</span>
                <h2 className="text-2xl md:text-3xl font-bold font-serif text-amber-400">{selectedUnit.title}</h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans max-w-2xl">{selectedUnit.description}</p>
                
                {/* Visual subtab navigator */}
                <div className="flex flex-wrap gap-2 pt-2 select-none">
                  <button
                    onClick={() => {
                      handlePlaySound("click");
                      setLessonActiveSubTab("lessons");
                      setQuizMode("none");
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      lessonActiveSubTab === "lessons" && quizMode === "none"
                        ? "bg-amber-800/90 text-white border-amber-500/50 shadow-md"
                        : "bg-[#18152c] hover:bg-[#201c3e] text-slate-300 border-indigo-950/60"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>مطالعة الدروس</span>
                  </button>
                  <button
                    onClick={() => {
                      handlePlaySound("click");
                      setLessonActiveSubTab("timeline");
                      setQuizMode("none");
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      lessonActiveSubTab === "timeline" && quizMode === "none"
                        ? "bg-amber-800/90 text-white border-amber-500/50 shadow-md"
                        : "bg-[#18152c] hover:bg-[#201c3e] text-slate-300 border-indigo-950/60"
                    }`}
                  >
                    <Star className="w-4 h-4" />
                    <span>الخط الزمني</span>
                  </button>
                  <button
                    onClick={() => {
                      handlePlaySound("click");
                      setLessonActiveSubTab("flashcards");
                      setQuizMode("none");
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      lessonActiveSubTab === "flashcards" && quizMode === "none"
                        ? "bg-amber-800/90 text-white border-amber-500/50 shadow-md"
                        : "bg-[#18152c] hover:bg-[#201c3e] text-slate-300 border-indigo-950/60"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>بطاقات المراجعة</span>
                  </button>
                </div>
              </div>

              {/* Quiz and Challenges Buttons */}
              <div className="bg-[#121020]/90 rounded-2xl border border-indigo-950/80 p-5 shrink-0 w-full md:w-64 flex flex-col gap-2.5 shadow-sm">
                <span className="text-slate-100 font-bold block text-sm border-b border-indigo-950 pb-2 text-center">🏆 مركز التحديات والاختبارات</span>
                <button
                  onClick={() => startComprehensiveQuiz(selectedUnit.id)}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border-none"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>الاختبار النهائي للوحدة</span>
                </button>
                {QUESTIONS.some(q => q.unitId === selectedUnit.id && q.type === QuestionType.TRUE_FALSE) && (
                  <button
                    onClick={() => startSpeedrunQuiz(selectedUnit.id)}
                    className="w-full bg-gradient-to-r from-indigo-700 to-indigo-800 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border-none"
                  >
                    <Clock className="w-4 h-4" />
                    <span>تحدي الصح والخطأ السريع</span>
                  </button>
                )}
                {QUESTIONS.some(q => q.unitId === selectedUnit.id && q.type === QuestionType.MATCH) && (
                  <button
                    onClick={() => startMatchGame(selectedUnit.id)}
                    className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border-none"
                  >
                    <Award className="w-4 h-4" />
                    <span>لعبة التوصيل الذكي</span>
                  </button>
                )}
              </div>
            </div>

            {/* CURRICULUM READING SUBTAB */}
            {quizMode === "none" && lessonActiveSubTab === "lessons" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
                <div className="bg-[#121020] border border-indigo-950 rounded-xl p-4 flex flex-col gap-2 h-fit">
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider pr-1 block">قائمة فصول الوحدة:</span>
                  {selectedUnit.lessons.map((less, idx) => (
                    <button
                      key={less.id}
                      onClick={() => {
                        handlePlaySound("click");
                        setCurrentLessonIdx(idx);
                      }}
                      className={`w-full text-right p-3 rounded-lg border text-sm transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        currentLessonIdx === idx
                          ? "bg-amber-800 text-white border-amber-600 font-serif font-bold shadow"
                          : "bg-[#18152c] hover:bg-[#201c3e] text-slate-200 border-indigo-950/60"
                      }`}
                    >
                      <span className="truncate">{idx + 1}. {less.title}</span>
                      {favoriteLessons.includes(less.id) && <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-2 space-y-6">
                  {/* Current Selected Lesson Details */}
                  <div className="bg-[#121020] rounded-2xl border border-indigo-950/80 shadow p-6 md:p-8 space-y-6">
                    <div className="border-b border-indigo-950 pb-4 flex items-center justify-between">
                      <div>
                        <span className="text-amber-500 text-xs font-bold uppercase block tracking-wider font-sans">الفصل {currentLessonIdx + 1}</span>
                        <h3 className="text-2xl font-bold font-serif text-slate-100 mt-1">{selectedUnit.lessons[currentLessonIdx].title}</h3>
                      </div>
                      <button
                        onClick={() => {
                          onToggleFavoriteLesson(selectedUnit.lessons[currentLessonIdx].id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          favoriteLessons.includes(selectedUnit.lessons[currentLessonIdx].id)
                            ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                            : "bg-[#18152c]/50 border-indigo-950/50 text-slate-400 hover:text-slate-200"
                        }`}
                        title={favoriteLessons.includes(selectedUnit.lessons[currentLessonIdx].id) ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                      >
                        <Heart className={`w-3.5 h-3.5 ${favoriteLessons.includes(selectedUnit.lessons[currentLessonIdx].id) ? "fill-red-500 text-red-500" : ""}`} />
                        <span>{favoriteLessons.includes(selectedUnit.lessons[currentLessonIdx].id) ? "في المفضلة ❤️" : "تفضيل المادة 🤍"}</span>
                      </button>
                    </div>

                    {/* Integrated custom synthesized SVG vector illustrations describing events */}
                    <SVGIllustration type={selectedUnit.lessons[currentLessonIdx].illustration} className="w-full h-52 bg-slate-950/40 rounded-xl border border-indigo-950/40" />

                    <div className="space-y-4 text-slate-200 text-base leading-relaxed text-right md:text-justify font-serif">
                      {selectedUnit.lessons[currentLessonIdx].content.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>

                    {/* Key points box (أهم ما نستخلصه) */}
                    <div className="bg-[#171120] border border-indigo-950/60 rounded-xl p-5 space-y-3">
                      <span className="font-serif font-bold text-slate-100 text-sm flex items-center gap-1.5 justify-end">
                        <span>أهَمُّ ملامِحِ الدَّرسِ لِلحفظِ السَّريع:</span>
                        <Award className="w-4 h-4 text-amber-400 fill-amber-950" />
                      </span>
                      <ul className="space-y-2 text-xs md:text-sm text-slate-300 list-disc list-inside">
                        {selectedUnit.lessons[currentLessonIdx].keyPoints.map((kp, kpIdx) => (
                          <li key={kpIdx} className="leading-relaxed list-none text-right flex items-center justify-end gap-1 font-serif">
                            <span>{kp}</span>
                            <span className="text-amber-400 shrink-0 select-none font-bold">✔</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer navigate buttons inside lessons */}
                    <div className="flex items-center justify-between border-t border-indigo-950/40 pt-4 shrink-0 font-sans">
                      <button
                        disabled={currentLessonIdx === 0}
                        onClick={() => {
                          handlePlaySound("click");
                          setCurrentLessonIdx(prev => prev - 1);
                        }}
                        className="bg-[#1b1930] hover:bg-[#252244] disabled:opacity-50 text-slate-100 px-4 py-2 rounded-xl border border-indigo-900/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4 transform rotate-180" />
                        <span>الدرس السابق</span>
                      </button>
                      <span className="text-xs font-bold text-slate-400 font-sans">
                        {currentLessonIdx + 1} / {selectedUnit.lessons.length}
                      </span>
                      <button
                        disabled={currentLessonIdx === selectedUnit.lessons.length - 1}
                        onClick={() => {
                          handlePlaySound("click");
                          setCurrentLessonIdx(prev => prev + 1);
                        }}
                        className="bg-amber-800 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>الدرس التالي</span>
                        <ChevronLeft className="w-4 h-4 transform rotate-180" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CURRICULUM TIMELINE SUBTAB */}
            {quizMode === "none" && lessonActiveSubTab === "timeline" && (
              <div className="bg-[#121020] rounded-2xl border border-indigo-950/80 shadow p-6 md:p-8 space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold font-serif text-slate-100">الخط الزمني التاريخي لأحداث الوحدة</h3>
                  <p className="text-xs text-slate-400 font-sans">تصفّح الأحداث الكبرى وتواريخ الملوك والمعارك والنهضات مرتبة زمانياً</p>
                </div>

                {/* Horizontal scroll timeline track list */}
                <div className="flex items-center justify-between border-b border-indigo-950/60 pb-8 overflow-x-auto whitespace-nowrap scrollbar-none py-4 px-2 select-none gap-6">
                  {selectedUnit.timeline.map((ev, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handlePlaySound("click");
                        setTimelineIndex(idx);
                      }}
                      className="relative flex flex-col items-center shrink-0 cursor-pointer focus:outline-none transition group"
                    >
                      {/* Connection Line */}
                      {idx > 0 && (
                        <div className={`absolute right-1/2 translate-x-[50%] top-4 w-[120px] md:w-[150px] h-0.5 -z-10 ${
                          timelineIndex >= idx ? "bg-amber-500" : "bg-[#18152c] h-0.5"
                        }`}></div>
                      )}
                      
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        timelineIndex === idx
                          ? "bg-amber-950 border-amber-400 scale-125 shadow-md"
                          : "bg-[#18152c] hover:bg-[#201c3e] border-indigo-950/80 group-hover:scale-110"
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${timelineIndex === idx ? "bg-white" : "bg-amber-500"}`}></div>
                      </div>
                      
                      <span className={`text-sm font-bold font-serif mt-2 block ${timelineIndex === idx ? "text-amber-400 font-extrabold" : "text-slate-300"}`}>
                        {ev.year}
                      </span>
                      <span className="text-[10px] text-slate-500 font-sans block max-w-[80px] truncate">{ev.title}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Timeline Card Description */}
                <div className="bg-[#1a1122]/90 rounded-2xl border border-indigo-950/60 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-3 text-right">
                    <span className="bg-[#110e1a] border border-amber-900/40 text-amber-400 font-serif text-sm font-bold px-3 py-1 rounded-full">{selectedUnit.timeline[timelineIndex].year}</span>
                    <h4 className="text-xl font-bold font-serif text-amber-400 mt-2">{selectedUnit.timeline[timelineIndex].title}</h4>
                    <p className="text-sm md:text-base text-slate-200 leading-relaxed font-serif">{selectedUnit.timeline[timelineIndex].description}</p>
                  </div>
                  {/* Decorative badge box */}
                  <div className="bg-[#110e1a]/80 rounded-xl border border-indigo-950/50 p-4 aspect-square flex flex-col items-center justify-center h-full text-center">
                    <Star className="w-14 h-14 text-amber-400 animate-spin-slow mb-2 fill-amber-400" />
                    <span className="text-slate-100 font-serif font-bold text-xs uppercase tracking-wider">سجل المؤرخ</span>
                    <span className="text-[10px] text-slate-400 font-sans">الوحدة {selectedUnit.id} • السنة {selectedUnit.timeline[timelineIndex].year}</span>
                  </div>
                </div>
              </div>
            )}

            {/* CURRICULUM FLASHCARDS SUBTAB */}
            {quizMode === "none" && lessonActiveSubTab === "flashcards" && (
              <div className="bg-[#121020] rounded-2xl border border-indigo-950/80 shadow p-6 md:p-8 space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold font-serif text-slate-100">بطاقات المراجعة السريعة والذكية</h3>
                  <p className="text-xs text-slate-400 font-sans">انتقِر البطاقة لعرض الإجابة السريعة واختبار معلوماتك</p>
                </div>

                {/* Flipcard Wrapper */}
                <div className="flex flex-col items-center justify-center py-6 select-none font-sans">
                  <div
                    onClick={() => {
                      handlePlaySound("click");
                      setFlashcardFlipped(!flashcardFlipped);
                    }}
                    className="w-full max-w-lg h-56 cursor-pointer relative transition-all duration-500 perspective-1000 shadow-xl rounded-2xl border border-indigo-950"
                  >
                    {/* card face */}
                    <div className={`absolute inset-0 w-full h-full rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                      flashcardFlipped
                        ? "bg-gradient-to-br from-[#1b1236]/90 to-[#2e1d13]/90 text-white border-amber-500/30 shadow-inner"
                        : "bg-gradient-to-br from-[#121020] to-[#18152c] text-slate-100 border-indigo-950"
                    }`}>
                      <span className="text-[10px] tracking-wider uppercase font-bold text-amber-400 block mb-2">
                        {flashcardFlipped ? "الإجابة الصحيحة" : "سؤال التحدي والذكاء"}
                      </span>
                      
                      <h4 className="text-lg md:text-xl font-bold font-serif leading-relaxed font-sans">
                        {flashcardFlipped
                          ? selectedUnit.flashcards[flashcardIdx].back
                          : selectedUnit.flashcards[flashcardIdx].front}
                      </h4>

                      <span className={`text-[10px] absolute bottom-4 bg-[#1b1930] text-slate-200 px-3 py-1 rounded-full font-bold border border-indigo-900/30 ${flashcardFlipped ? "bg-amber-900/40 text-amber-200" : ""}`}>
                        {flashcardFlipped ? "انقر لرؤية السؤال ↩" : "انقر لرؤية الإجابة ↪"}
                      </span>
                    </div>
                  </div>

                  {/* Flashcard nav controller */}
                  <div className="flex items-center gap-6 mt-6 justify-center">
                    <button
                      disabled={flashcardIdx === 0}
                      onClick={() => {
                        handlePlaySound("click");
                        setFlashcardIdx(prev => prev - 1);
                        setFlashcardFlipped(false);
                      }}
                      className="bg-[#1b1930] hover:bg-[#252244] border border-indigo-900/50 disabled:opacity-50 text-slate-100 p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                    >
                      <ChevronRight className="w-5 h-5 animate-pulse" />
                    </button>
                    <span className="text-xs font-bold text-slate-300 font-sans">
                      البطاقة {flashcardIdx + 1} من {selectedUnit.flashcards.length}
                    </span>
                    <button
                      disabled={flashcardIdx === selectedUnit.flashcards.length - 1}
                      onClick={() => {
                        handlePlaySound("click");
                        setFlashcardIdx(prev => prev + 1);
                        setFlashcardFlipped(false);
                      }}
                      className="bg-[#1b1930] hover:bg-[#252244] border border-indigo-900/50 disabled:opacity-50 text-slate-100 p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                    >
                      <ChevronLeft className="w-5 h-5 animate-pulse" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: NEW DEDICATED QUIZ HUB PLATFORM */}
        {currentTab === "quiz_hub" && quizMode === "none" && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-indigo-950/60 pb-5">
              <div className="text-right space-y-1">
                <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-amber-400 flex items-center gap-2">
                  <Gamepad2 className="w-8 h-8 text-amber-500 animate-[bounce_5s_infinite]" />
                  <span>مِنَصَّةُ الِاخْتِبَارَاتِ التَّفَاعُلِيَّةِ</span>
                </h2>
                <p className="text-xs md:text-sm text-slate-400 font-sans">
                  صمّم اختبارك المخصص بتقرير عدد الأسئلة ونطاق الفحص (درس، وحدة، أو كامل المنهج الدراسي) واختبر مقدرتك الفورية!
                </p>
              </div>
              <div className="bg-[#18152c] border border-indigo-950/70 py-2.5 px-4 rounded-2xl flex items-center gap-3.5 shadow">
                <Trophy className="w-7 h-7 text-yellow-400" />
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold">نقاط المؤرخ الإجمالية</div>
                  <div className="text-base font-sans font-black text-amber-300">{score} نقطة ⭐</div>
                </div>
              </div>
            </div>

            {/* Configuration Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
              {/* Left part: Choices - 8 columns */}
              <div className="lg:col-span-8 space-y-6 text-right">
                
                {/* step 1: Select Quiz Scope / Category */}
                <div className="bg-[#121020]/90 border border-indigo-950/80 rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-serif font-bold text-slate-200 flex items-center gap-2 border-b border-indigo-950 pb-2">
                    <span className="bg-amber-500/10 text-amber-400 w-6 h-6 rounded-lg text-xs flex items-center justify-center font-bold">١</span>
                    <span>اختر نطاق الأسئلة والاختبار:</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        handlePlaySound("click");
                        setQhCategory("comprehensive");
                      }}
                      className={`p-4 rounded-xl border text-right transition-all flex flex-col gap-1.5 cursor-pointer ${
                        qhCategory === "comprehensive"
                          ? "bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/30"
                          : "bg-[#18152c]/50 border-indigo-950 hover:bg-[#201c3e]/70"
                      }`}
                    >
                      <Book className="w-5 h-5 text-amber-400" />
                      <span className="font-serif font-bold text-sm text-slate-100">شامل لكتاب المنهج</span>
                      <span className="text-[10px] text-slate-400 leading-relaxed font-sans">
                        امتحان شامل ومتكامل على كافة فصول ووحدات الكتاب المدرسي للتحدي الأعظم!
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        handlePlaySound("click");
                        setQhCategory("unit");
                      }}
                      className={`p-4 rounded-xl border text-right transition-all flex flex-col gap-1.5 cursor-pointer ${
                        qhCategory === "unit"
                          ? "bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/30"
                          : "bg-[#18152c]/50 border-indigo-950 hover:bg-[#201c3e]/70"
                      }`}
                    >
                      <Trophy className="w-5 h-5 text-indigo-400" />
                      <span className="font-serif font-bold text-sm text-slate-100">مستوى الوحدة الدراسية</span>
                      <span className="text-[10px] text-slate-400 leading-relaxed font-sans">
                        اختبر معرفتك في وحدة جغرافية وتاريخية كاملة من وحدات المنهج الخمسة.
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        handlePlaySound("click");
                        setQhCategory("lesson");
                      }}
                      className={`p-4 rounded-xl border text-right transition-all flex flex-col gap-1.5 cursor-pointer ${
                        qhCategory === "lesson"
                          ? "bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/30"
                          : "bg-[#18152c]/50 border-indigo-950 hover:bg-[#201c3e]/70"
                      }`}
                    >
                      <FileText className="w-5 h-5 text-emerald-400" />
                      <span className="font-serif font-bold text-sm text-slate-100">مستوى درس مخصص</span>
                      <span className="text-[10px] text-slate-400 leading-relaxed font-sans">
                        اختبر استيعابك الدقيق لدرس تاريخي محدد تزيد به من محصولك الفوري.
                      </span>
                    </button>
                  </div>

                  {/* Scope Detail Selectors based on selection */}
                  {qhCategory === "unit" && (
                    <div className="bg-[#18152c]/40 border border-indigo-950 rounded-xl p-4 space-y-2 animate-[fadeIn_0.2s_ease-out]">
                      <label className="text-[11px] text-slate-400 font-bold block">اختر الوحدة المستهدفة:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {UNITS.map(u => (
                          <button
                            key={u.id}
                            onClick={() => {
                              handlePlaySound("click");
                              setQhUnitId(u.id);
                            }}
                            className={`text-right p-2.5 rounded-lg border text-xs font-semibold font-serif transition-colors ${
                              parseInt(qhUnitId as any) === u.id
                                ? "bg-indigo-950 text-indigo-300 border-indigo-500 font-bold"
                                : "bg-[#110e1a]/80 text-slate-300 border-[#1c1a30]/65 hover:bg-[#1c1a30]"
                            }`}
                          >
                            {u.id}. {u.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {qhCategory === "lesson" && (
                    <div className="bg-[#18152c]/40 border border-indigo-950 rounded-xl p-4 space-y-3 animate-[fadeIn_0.2s_ease-out]">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-bold block">١. اختر الوحدة أولاً:</label>
                        <select
                          value={qhUnitId}
                          onChange={(e) => {
                            handlePlaySound("click");
                            setQhUnitId(parseInt(e.target.value));
                          }}
                          className="w-full bg-[#110e1a] text-slate-200 border border-indigo-950/80 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none font-serif cursor-pointer"
                        >
                          {UNITS.map(u => (
                            <option key={u.id} value={u.id}>الوحدة {u.id}: {u.title}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-bold block">٢. اختر الدرس المطلوب للفحص البؤري:</label>
                        <select
                          value={qhLessonId}
                          onChange={(e) => {
                            handlePlaySound("click");
                            setQhLessonId(e.target.value);
                          }}
                          className="w-full bg-[#110e1a] text-slate-200 border border-[#1c1a30]/65 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none font-serif cursor-pointer"
                        >
                          {(UNITS.find(u => u.id === qhUnitId)?.lessons || []).map(l => (
                            <option key={l.id} value={l.id}>{l.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Choose Size (Length) */}
                <div className="bg-[#121020]/90 border border-indigo-950/80 rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-serif font-bold text-slate-200 flex items-center gap-2 border-b border-indigo-950 pb-2">
                    <span className="bg-amber-500/10 text-amber-400 w-6 h-6 rounded-lg text-xs flex items-center justify-center font-bold">٢</span>
                    <span>حدد حجم وطول الاختبار (عدد الأسئلة):</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[5, 10, 15, 20].map((size) => {
                      let labelText = "سريع";
                      if (size === 10) labelText = "قياسي";
                      if (size === 15) labelText = "شامل";
                      if (size === 20) labelText = "امتحان التحدي الأقصى!";

                      return (
                        <button
                          key={size}
                          onClick={() => {
                            handlePlaySound("click");
                            setQhSize(size);
                          }}
                          className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            qhSize === size
                              ? "bg-indigo-950 text-indigo-300 border-indigo-500 shadow"
                              : "bg-[#18152c]/50 border-indigo-950 hover:bg-[#201c3e]/70"
                          }`}
                        >
                          <span className="font-sans font-black text-lg">{size} أسئلة</span>
                          <span className="text-[10px] text-slate-400 font-serif">{labelText}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Choose Challenge Style */}
                <div className="bg-[#121020]/90 border border-indigo-950/80 rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-serif font-bold text-slate-200 flex items-center gap-2 border-b border-indigo-950 pb-2">
                    <span className="bg-amber-500/10 text-amber-400 w-6 h-6 rounded-lg text-xs flex items-center justify-center font-bold">٣</span>
                    <span>اختر نمط وطبيعة التحدي:</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        handlePlaySound("click");
                        setQhChallengeType("mcq");
                      }}
                      className={`p-4 rounded-xl border text-right transition-all flex flex-col gap-1.5 cursor-pointer ${
                        qhChallengeType === "mcq"
                          ? "bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/30"
                          : "bg-[#18152c]/50 border-indigo-950 hover:bg-[#201c3e]/70"
                      }`}
                    >
                      <HelpCircle className="w-5 h-5 text-amber-400" />
                      <span className="font-serif font-bold text-sm text-slate-100">نمط الامتحان المنهجي 📋</span>
                      <span className="text-[10px] text-slate-400 leading-relaxed font-sans mt-1">
                        أسئلة متنوعة (اختيار من متعدد وصح وخطأ) مع شروحات تاريخية غنية فورية.
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        handlePlaySound("click");
                        setQhChallengeType("speedrun");
                      }}
                      className={`p-4 rounded-xl border text-right transition-all flex flex-col gap-1.5 cursor-pointer ${
                        qhChallengeType === "speedrun"
                          ? "bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/30"
                          : "bg-[#18152c]/50 border-indigo-950 hover:bg-[#201c3e]/70"
                      }`}
                    >
                      <Clock className="w-5 h-5 text-indigo-400" />
                      <span className="font-serif font-bold text-sm text-slate-100 font-bold">تحدي السرعة الخاطف ⚡</span>
                      <span className="text-[10px] text-slate-400 leading-relaxed font-sans mt-1">
                        أسئلة صح وخطأ متسارعة مع عد تنازلي ضاغط من ١٥ ثانية لرفع حماستك وتركيزك!
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        handlePlaySound("click");
                        setQhChallengeType("match");
                      }}
                      className={`p-4 rounded-xl border text-right transition-all flex flex-col gap-1.5 cursor-pointer ${
                        qhChallengeType === "match"
                          ? "bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/30"
                          : "bg-[#18152c]/50 border-indigo-950 hover:bg-[#201c3e]/70"
                      }`}
                    >
                      <Award className="w-5 h-5 text-emerald-400" />
                      <span className="font-serif font-bold text-sm text-slate-100 font-bold">لعبة التوصيل الذكي 🧩</span>
                      <span className="text-[10px] text-slate-400 leading-relaxed font-sans mt-1">
                        قم بربط كل شخصية أو مدينة أو تاريخ بعبارتها المقابلة بطريقة مسلية وتدريبية!
                      </span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Summaries & Button - 4 columns */}
              <div className="lg:col-span-4 space-y-6">
                {/* Information summary box */}
                <div className="bg-[#121020]/90 border border-indigo-950 rounded-2xl p-6 text-right space-y-4">
                  <h4 className="text-sm font-serif font-bold text-amber-400 border-b border-indigo-950 pb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span>ملخص إعدادات التحدي</span>
                  </h4>
                  
                  <div className="space-y-3.5 text-xs font-serif leading-relaxed">
                    <div className="flex justify-between items-center border-b border-indigo-950/30 pb-2">
                      <span className="text-slate-400">النطاق الدراسي:</span>
                      <span className="text-slate-100 font-bold">
                        {qhCategory === "comprehensive" ? "الكتاب المنهجي كاملاً ✨" : qhCategory === "unit" ? `الوحدة ${qhUnitId} 🏆` : "درس مخصص 📝"}
                      </span>
                    </div>
                    {qhCategory === "lesson" && (
                      <div className="flex justify-between items-start border-b border-indigo-950/30 pb-2 gap-2 text-left">
                        <span className="text-slate-400 text-right shrink-0">الدرس المختار:</span>
                        <span className="text-indigo-300 font-bold leading-snug">
                          {UNITS.find(u => u.id === qhUnitId)?.lessons.find(l => l.id === qhLessonId)?.title || ""}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center border-b border-indigo-950/30 pb-2">
                      <span className="text-slate-400">طول الاختبار:</span>
                      <span className="text-amber-500 font-bold">{qhSize} سؤالاً تاريخياً</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-indigo-950/30 pb-2">
                      <span className="text-slate-400">طريقة التحدي:</span>
                      <span className="text-slate-100 font-bold">
                        {qhChallengeType === "mcq" ? "النمط المنهجي (شامل)" : qhChallengeType === "speedrun" ? "صح وخطأ متسارع سريع" : "مطابقة وتوصيل المفاهيم"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">مجموع نقاط التحدي:</span>
                      <span className="text-emerald-400 font-bold font-sans">+{qhSize * 10} نقاط معرفة ⭐</span>
                    </div>
                  </div>

                  {/* Ready to go button */}
                  <button
                    onClick={() => {
                      const rawLesson = qhCategory === "lesson" 
                        ? UNITS.find(u => u.id === qhUnitId)?.lessons.find(l => l.id === qhLessonId)
                        : undefined;
                      
                      startQuizHubCustom({
                        type: qhCategory,
                        unitId: qhUnitId,
                        lessonId: qhLessonId,
                        lessonTitle: rawLesson ? rawLesson.title : undefined,
                        questionCount: qhSize,
                        challengeType: qhChallengeType
                      });
                    }}
                    className="w-full py-4 text-center text-sm font-black font-serif bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border border-transparent text-white rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-current text-white animate-pulse" />
                    <span>ابدأ التحدي والامتحان الآن 🚀</span>
                  </button>
                </div>

                {/* Fun advice card */}
                <div className="bg-[#110e1a]/80 border border-indigo-950 p-5 rounded-2xl text-right text-xs">
                  <p className="text-amber-400 font-serif font-bold text-center mb-2.5">💡 إرشادات المؤرخ الصغير</p>
                  <p className="text-slate-300 leading-relaxed font-serif">
                    جميع أسئلتنا مشتقة من المناهج السودانية المعتمدة لمدارس مرحلة الأساس والابتدائي، وصممت لتنمي تفكيرك وتربطك بالعمق الوطني السوداني والرموز القيادية التاريخية!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {quizMode !== "none" && (
          <div className="flex items-center justify-between border-b border-indigo-950/60 pb-3 mb-6 animate-[fadeIn_0.3s_ease-out]">
            <button
              onClick={() => {
                handlePlaySound("click");
                setQuizMode("none");
              }}
              className="bg-[#1b1930] hover:bg-[#252244] text-slate-100 text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-indigo-950/75 cursor-pointer shadow-sm"
            >
              <ArrowRight className="w-4 h-4 transform rotate-180 text-amber-500" />
              <span>الخروج من الاختبار والعودة ↩</span>
            </button>
            <div className="text-left font-serif text-[11px] text-amber-500 font-bold bg-[#141221] py-1.5 px-4 rounded-full border border-indigo-950/80 shadow-inner">
              {quizTitle || "اختبار تفاعلي"}
            </div>
          </div>
        )}

            {/* CURRICULUM LIVE CHALLENGES: A) MCQ & True-False QUIZ */}
            {quizMode === "curriculum" && (
              <div className="bg-[#121020] rounded-2xl border border-indigo-950/80 shadow p-6 md:p-8 space-y-6">
                {quizIdx < quizQuestions.length ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-indigo-950 pb-4">
                      <div>
                        <h4 className="text-lg font-bold font-serif text-slate-100">{quizTitle || "اختبار المنهج"}</h4>
                        <p className="text-xs text-slate-400 mt-1 font-sans">السؤال {quizIdx + 1} من {quizQuestions.length}</p>
                      </div>
                      <span className="bg-amber-900 text-white font-sans text-xs px-2.5 py-1 rounded border border-amber-600/30">المرحلة {quizIdx + 1}</span>
                    </div>

                    <p className="text-lg md:text-xl font-bold font-serif text-slate-200 leading-relaxed text-right">
                      {quizQuestions[quizIdx].text}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Render statement option values based on MCQ or Yes/No */}
                      {(quizQuestions[quizIdx].options || ["صواب", "خطأ"]).map((option, oIdx) => {
                        const isSelected = selectedOption === option;
                        const isCorrectAnswer = option === quizQuestions[quizIdx].correctAnswer;
                        
                        let optStyle = "bg-[#18152c] hover:bg-[#221e3f] border-indigo-950 text-slate-200 hover:scale-[1.01] cursor-pointer";
                        if (selectedOption) {
                          if (isCorrectAnswer) {
                            optStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-300 scale-[1.01] font-bold";
                          } else if (isSelected) {
                            optStyle = "bg-red-950/80 border-red-500 text-red-350";
                          } else {
                            optStyle = "bg-[#121020] border-indigo-950/20 text-slate-400/80 opacity-70 cursor-not-allowed";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={!!selectedOption}
                            onClick={() => handleAnswerSelection(option)}
                            className={`w-full text-right p-4 rounded-xl border text-sm font-bold transition flex items-center justify-between ${optStyle}`}
                          >
                            <span>{option}</span>
                            {selectedOption && isCorrectAnswer && <span className="text-emerald-400 text-xs font-semibold">✔ صواب</span>}
                            {selectedOption && isSelected && !isCorrectAnswer && <span className="text-red-400 text-xs font-semibold">✘ خطأ</span>}
                          </button>
                        );
                      })}
                    </div>

                    {selectedOption && (
                      <div className="bg-[#171120] p-4 rounded-xl border border-indigo-950/65 animate-[fadeIn_0.5s_ease-out] text-right space-y-1.5 shrink-0 font-serif">
                        <span className="text-amber-400 font-bold block text-sm">💡 الشرح والتبسيط من منهج الصف السَّادس:</span>
                        <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                          {quizQuestions[quizIdx].explanation || "الإجابة الصحيحة مذكورة بالدروس لتعزيز كفاءتك المعرفية."}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end pt-3">
                      <button
                        disabled={!selectedOption}
                        onClick={handleNextQuiz}
                        className="bg-amber-800 disabled:opacity-50 text-white px-6 py-3 rounded-xl hover:bg-amber-700 text-sm font-bold flex items-center gap-1.5 shadow cursor-pointer transition border border-amber-600/20"
                      >
                        <span>{quizIdx + 1 === quizQuestions.length ? "رؤية النتائج النهائية 🏁" : "السؤال التالي"}</span>
                        <ChevronLeft className="w-4 h-4 transform rotate-180" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Quiz completed card
                  <div className="text-center p-8 space-y-6">
                    <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce fill-amber-500/20" />
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-serif text-slate-100">
                        {quizType === "comprehensive"
                          ? "أتممت الامتحان الشامل والنهائي لكامل كتاب التاريخ بنجاح! 🎓"
                          : quizType === "lesson"
                          ? "أتممت اختبار الدرس المنهجي بنجاح! 📝"
                          : "أتممت الاختبار النهائي للوحدة بنجاح! 🎉"}
                      </h3>
                      <p className="text-xs text-slate-400">لقد أحرزت {quizCorrectAnswers} إجابات صحيحة من أصل {quizQuestions.length}</p>
                    </div>

                    {/* Progress score feedback reward */}
                    <div className="inline-flex items-center gap-2.5 bg-[#1b1226] px-6 py-3 rounded-2xl border border-indigo-950/80">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-serif font-bold text-amber-300 text-right">
                        لقد نلت +{quizCorrectAnswers * (quizType === "comprehensive" ? 15 : 10)} نقاط معرفة إضافية تضاف لرصيدك!
                      </span>
                    </div>

                    {/* Badge unlock reward */}
                    {(((quizCorrectAnswers / quizQuestions.length) * 100) >= 80) ? (
                      <div className="bg-[#11241a] text-emerald-400 p-4 rounded-xl border border-[#1b3d2b] text-sm font-semibold max-w-md mx-auto leading-relaxed">
                        {quizType === "comprehensive"
                          ? "🎖️ رائع! نظراً لتحقيقك نسبة نجاح تتجاوز 80% في الامتحان الشامل، تم تزيين ملفك الشخصي بوسام 'المؤرخ العبقري الشامل' المرموق بنجاح!"
                          : quizType === "lesson"
                          ? "🎖️ رائع! لقد استوعبت هذا الدرس المنهجي بامتياز وحققت نسبة نجاح ممتازة تفوق 80% في الأسئلة!"
                          : "🎖️ رائع! نظراً لتحقيقك نسبة فوز تتجاوز 80%، تم فتح وسام الوحدة الخاص بك وإضافته لملفك الشخصي بنجاح!"}
                      </div>
                    ) : (
                      <div className="bg-[#241a11] text-amber-400 p-4 rounded-xl border border-[#3b291a] text-xs font-medium max-w-md mx-auto leading-relaxed">
                        📖 لم تحقق 80% للحصول على الجائزة الكبرى هذه المرة، لكن واصل مطالعة الدروس والخطوط الزمنية وتحدّ مرة أخرى بثقة!
                      </div>
                    )}

                    <div className="flex justify-center gap-3 pt-4">
                      <button
                        onClick={() => {
                          handlePlaySound("click");
                          setQuizMode("none");
                        }}
                        className="bg-amber-800 text-white px-5 py-2.5 rounded-xl hover:bg-amber-700 text-xs font-bold transition shadow border border-amber-600/30 cursor-pointer"
                      >
                        العودة لقراءة المنهج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CURRICULUM LIVE CHALLENGES: B) TRUE/FALSE SPEEDRUN */}
            {quizMode === "speedrun" && (
              <div className="bg-[#121020] rounded-2xl border border-indigo-950/80 shadow p-6 md:p-8 space-y-6 max-w-2xl mx-auto">
                {quizIdx < quizQuestions.length ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-indigo-950 pb-4">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Clock className="w-5 h-5 animate-pulse" />
                        <span className="font-sans font-bold text-sm">تحدي السرعة (صح أو خطأ)</span>
                      </div>
                      <span className="text-xs font-sans text-slate-400">مرحلة {quizIdx + 1} من {quizQuestions.length}</span>
                    </div>

                    {/* Visual countdown timer */}
                    <div className="space-y-1 text-center">
                      <span className={`text-base font-serif font-extrabold ${speedrunTimer <= 5 ? "text-red-400 animate-pulse" : "text-amber-400"}`}>
                        متبقي {speedrunTimer} ثوانٍ!
                      </span>
                      <div className="w-full bg-[#18152c] h-2.5 rounded-full overflow-hidden border border-indigo-950/40">
                        <div
                          className={`h-full transition-all duration-1000 ${speedrunTimer <= 5 ? "bg-red-500" : "bg-amber-500"}`}
                          style={{ width: `${(speedrunTimer / 15) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question prompt statement */}
                    <div className="bg-[#1b1930] hover:bg-[#201c3e] border border-indigo-950/80 rounded-2xl p-6 text-center select-none shadow-inner">
                      <p className="text-lg md:text-xl font-bold font-serif text-slate-100 leading-relaxed">
                        {quizQuestions[quizIdx].text}
                      </p>
                    </div>

                    {/* Options buttons */}
                    <div className="grid grid-cols-2 gap-4 font-serif">
                      <button
                        onClick={() => handleSpeedrunAnswer("صواب")}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white text-base py-4 rounded-xl shadow-md border border-emerald-600/30 hover:scale-[1.01] active:scale-[0.99] font-bold transition duration-200 cursor-pointer"
                      >
                        صواب (✔)
                      </button>
                      <button
                        onClick={() => handleSpeedrunAnswer("خطأ")}
                        className="bg-red-700 hover:bg-red-600 text-white text-base py-4 rounded-xl shadow-md border border-red-600/30 hover:scale-[1.01] active:scale-[0.99] font-bold transition duration-200 cursor-pointer"
                      >
                        خطأ (✘)
                      </button>
                    </div>
                  </div>
                ) : (
                  // Speedrun ended card
                  <div className="text-center p-8 space-y-6">
                    <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-serif text-slate-100">انتهى تحدي السرعة الخارق! ⭐</h3>
                      <p className="text-xs text-slate-400 font-sans">صبت إجابات صحيحة في {quizCorrectAnswers} ثوانٍ من أصل {quizQuestions.length}</p>
                    </div>

                    <div className="bg-[#1b1226] border border-indigo-950/80 p-4 rounded-xl max-w-sm mx-auto text-amber-300 text-sm font-serif">
                      لقد نلت +{quizCorrectAnswers * 15} نقاط معرفة مضافة لملفك الشخصي لقاء شجاعتك وسرعتك الفورية!
                    </div>

                    <button
                      onClick={() => {
                        handlePlaySound("click");
                        setQuizMode("none");
                      }}
                      className="bg-amber-800 text-white px-5 py-2.5 rounded-xl hover:bg-amber-700 text-xs font-bold transition shadow border border-amber-600/30 cursor-pointer"
                    >
                      الرجوع لقراءة الفصول
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CURRICULUM LIVE CHALLENGES: C) TAP MATCHING PAIRS */}
            {quizMode === "match" && (
              <div className="bg-[#121020] rounded-2xl border border-indigo-950/80 shadow p-6 md:p-8 space-y-6">
                <div className="text-center space-y-1 border-b border-indigo-950 pb-4">
                  <h3 className="text-lg font-bold font-serif text-slate-100">لعبة التوصيل الذكية والألقاب</h3>
                  <p className="text-xs text-slate-400 font-sans">انقر على المربع من العمود الأيمن ثم شريكه المناسب من العمود الأيسر</p>
                </div>

                {/* Left & Right Grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right select-none font-sans">
                  {/* Left Column (Historical names or events) */}
                  <div className="space-y-3">
                    <span className="text-xs text-slate-400 font-bold block mb-1">العمود الأيسر:</span>
                    {matchLeft.map((leftNode) => {
                      const isMatched = !!matchedPairs[leftNode.id];
                      const isSelected = selectedLeft === leftNode.id;
                      const isWrong = wrongMatchLeft === leftNode.id;

                      let boxStyle = "bg-[#18152c] border-indigo-950/40 text-slate-200 hover:bg-[#201c3e] cursor-pointer";
                      if (isMatched) {
                        boxStyle = "bg-emerald-950/40 border-emerald-800/60 text-emerald-300 opacity-50 pointer-events-none";
                      } else if (isSelected) {
                        boxStyle = "bg-indigo-950/90 border-indigo-500 text-indigo-300 scale-[1.02] ring-2 ring-indigo-500/40 font-bold";
                      } else if (isWrong) {
                        boxStyle = "bg-red-950 border-red-500 text-red-300 scale-[1.02] animate-shake";
                      }

                      return (
                        <div
                          key={leftNode.id}
                          onClick={() => handleLeftTap(leftNode.id)}
                          className={`p-3.5 rounded-xl border text-sm font-serif font-semibold transition-all flex items-center justify-between ${boxStyle}`}
                        >
                          <span>{leftNode.text}</span>
                          {isMatched && <span className="bg-emerald-600 text-white rounded-full p-0.5 text-[8px]">✔</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column (Descriptions/Matches) */}
                  <div className="space-y-3">
                    <span className="text-xs text-slate-400 font-bold block mb-1">العمود الأيمن:</span>
                    {matchRight.map((rightNode) => {
                      const isMatched = Object.values(matchedPairs).includes(rightNode.id);
                      const isWrong = wrongMatchRight === rightNode.id;
                      const isDisabled = !selectedLeft;

                      let boxStyle = "bg-[#18152c] border-indigo-950/40 text-slate-200 hover:bg-[#201c3e] cursor-pointer";
                      if (isMatched) {
                        boxStyle = "bg-emerald-950/40 border-emerald-800/60 text-emerald-300 opacity-50 pointer-events-none";
                      } else if (isDisabled) {
                        boxStyle = "bg-[#121020] border-indigo-950/20 text-slate-400/80 opacity-70 cursor-not-allowed";
                      } else if (isWrong) {
                        boxStyle = "bg-red-950 border-red-500 text-red-200 scale-[1.02] animate-shake";
                      }

                      return (
                        <div
                          key={rightNode.id}
                          onClick={() => handleRightTap(rightNode.id)}
                          className={`p-3.5 rounded-xl border text-sm font-serif transition-all flex items-center justify-between ${boxStyle}`}
                        >
                          <span>{rightNode.text}</span>
                          {isMatched && <span className="bg-emerald-600 text-white rounded-full p-0.5 text-[8px]">✔</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Match game completed check */}
                {Object.keys(matchedPairs).length === matchLeft.length && (
                  <div className="bg-[#11241a] text-emerald-400 p-5 rounded-2xl border border-[#1b3d2b] text-center space-y-4 max-w-md mx-auto animate-[fadeIn_0.5s_ease-out]">
                    <Trophy className="w-12 h-12 text-emerald-400 mx-auto" />
                    <div>
                      <h4 className="font-serif font-bold text-lg">أحسنت التوصيل يا بطل! 🎖️</h4>
                      <p className="text-xs text-slate-300 mt-1">طابقت كافة الشخصيات والحقائق بالوصف والتواريخ المطابقة لها بنجاح!</p>
                    </div>
                    <span className="bg-[#1b1226] text-amber-300 font-bold text-sm px-4 py-1.5 rounded-full inline-block border border-indigo-950">
                      ربحت +50 نقاط معرفة إضافية!
                    </span>
                    <button
                      onClick={() => {
                        handlePlaySound("click");
                        setQuizMode("none");
                      }}
                      className="bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow mx-auto block cursor-pointer border border-amber-600/20"
                    >
                      الرجوع لدروس الفصل
                    </button>
                  </div>
                )}
              </div>
            )}
      </main>

      {/* Visual bottom parchment style design separator */}
      <footer className="bg-[#09080f]/90 border-t border-indigo-950/65 py-6 text-center text-slate-400 text-xs shrink-0 font-sans mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-serif text-slate-300 select-none">© {new Date().getFullYear()} المُؤَرِّخ الصَّغِير – جُمْهُورِيَّةُ السُّودَانِ - مَنَاهِجُ المَرْكَزُ القَوْمِي لِلمَنَاهِجِ وَالبَحْثِ التَّرْبَوِي بِبَخْتِ الرِّضَا</p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                handlePlaySound("click");
                setCurrentTab("badges");
              }}
              className="hover:text-amber-400 font-bold transition cursor-pointer"
            >
              لوحة الأوسمة
            </button>
            <span className="text-slate-500">•</span>
            <button
              onClick={() => {
                handlePlaySound("click");
                setCurrentTab("map");
              }}
              className="hover:text-amber-400 font-bold transition cursor-pointer"
            >
              خريطة المعرفة التفاعلية
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
