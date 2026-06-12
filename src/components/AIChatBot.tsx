/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { playSound } from "./SoundEffects";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  RefreshCw, 
  AlertCircle, 
  LogIn 
} from "lucide-react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  deleteDoc 
} from "firebase/firestore";

const SUGGESTED_PROMPTS = [
  "لماذا غزا الأتراك السودان عام 1821م؟",
  "من هو جعفر المنصور وما قصة بناء بغداد؟",
  "أخبرني عن ثروة وحج ملك مالي منسا موسى!",
  "كيف تأسس الجامع الأزهر ومدينة القاهرة؟",
  "ما هي حقوق وواجبات المواطنة للصف السادس؟"
];

const WELCOME_MESSAGE = {
  id: "welcome",
  sender: "bot" as const,
  text: "أهلاً بك يا بطل التاريخ الحبيب! 🌟 أنا 'أستاذ التاريخ الذكي'. اسألني عن أي معركة، ملك، مملكة إسلامية أو إفريقية، أو عن دروس المواطنة للصف السادس، وسأشرحها لك فوراً بطريقة ممتعة للغاية!",
  timestamp: new Date()
};

interface AIChatBotProps {
  currentUser: any;
  onSignInWithGoogle: () => Promise<void>;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({ currentUser, onSignInWithGoogle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [userInput, setUserAnswerInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom when messages change or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isHistoryLoading]);

  // Load chat history from Firestore if logged in
  useEffect(() => {
    if (!currentUser) {
      setMessages([WELCOME_MESSAGE]);
      return;
    }

    const loadHistory = async () => {
      setIsHistoryLoading(true);
      setErrorFeedback(null);
      const chatPath = `users/${currentUser.uid}/chatHistory`;
      try {
        const q = query(collection(db, chatPath), orderBy("timestamp", "asc"));
        const querySnapshot = await getDocs(q);
        const fetchedMessages: ChatMessage[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedMessages.push({
            id: doc.id,
            sender: data.sender as "user" | "bot",
            text: data.text || "",
            timestamp: data.timestamp?.toDate() || new Date()
          });
        });

        if (fetchedMessages.length > 0) {
          setMessages([WELCOME_MESSAGE, ...fetchedMessages]);
        } else {
          setMessages([WELCOME_MESSAGE]);
        }
      } catch (err: any) {
        console.error("Error loading chat history from Firestore:", err);
        // Securely handle firestore read error as specified in requirements
        try {
          handleFirestoreError(err, OperationType.LIST, chatPath);
        } catch (jsonErr: any) {
          setErrorFeedback("تحذير: فشلت مزامنة السجلات السحابية للدراسة.");
        }
      } finally {
        setIsHistoryLoading(false);
      }
    };

    loadHistory();
  }, [currentUser]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading || !currentUser) return;
    
    playSound("click");
    setErrorFeedback(null);
    
    const userMsgLocal: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsgLocal]);
    setUserAnswerInput("");
    setIsLoading(true);

    const chatPath = `users/${currentUser.uid}/chatHistory`;

    try {
      // 1. Save user's message to Firestore
      try {
        await addDoc(collection(db, chatPath), {
          sender: "user",
          text: text,
          timestamp: serverTimestamp()
        });
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.CREATE, chatPath);
      }

      // 2. Format history into model format for backend API communication
      const formatHistory = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: m.text }]
        }));

      // 3. Request Gemini AI response from server backend API (hides keys)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: formatHistory
        })
      });

      if (!res.ok) {
        throw new Error("فشل الخادم في الرد بالشكل الصحيح.");
      }

      const data = await res.json();
      const botResponseText = data.text || "أنا بانتظار استرجاع الإجابة يا بطل.";

      // 4. Save AI response to Firestore
      try {
        await addDoc(collection(db, chatPath), {
          sender: "bot",
          text: botResponseText,
          timestamp: serverTimestamp()
        });
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.CREATE, chatPath);
      }

      const botMsgLocal: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResponseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsgLocal]);
      playSound("success");

    } catch (err: any) {
      console.error("Error communicating with Gemini Tutor:", err);
      setErrorFeedback("المعلم الذكي منشغل حالياً، سيقوم بالرد عليك فوراً عند توفر الاتصال.");
      
      // Standby local fallback response
      setTimeout(() => {
        let fallbackReply = "أنا معك يا بطل! يبدو أن الاتصال بشبكة الإنترنت منخفض، لكن إليك ملخص الدرس: غزو السودان حدث بحثاً عن الذهب والرجال، وبغداد شيدها المنصور دائرية، ومنسا موسى وزع الذهب بمكة، والجامع الأزهر شيده جوهر الصقلي بالقاهرة!";
        setMessages(prev => [...prev, {
          id: (Date.now() + 2).toString(),
          sender: "bot",
          text: fallbackReply,
          timestamp: new Date()
        }]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = async () => {
    playSound("click");
    setErrorFeedback(null);
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: "أهلاً بك مجدداً يا بطل التاريخ! 🌟 أعدت ترتيب دفاتري القديمة. اسألني عن أي حدث في الدروس وسأجيبك فوراً بدقة وحب!",
        timestamp: new Date()
      }
    ]);

    if (!currentUser) return;

    // Delete chat history from clouds
    setIsHistoryLoading(true);
    const chatPath = `users/${currentUser.uid}/chatHistory`;
    try {
      const qSnap = await getDocs(collection(db, chatPath));
      const deletePromises = qSnap.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (err) {
      console.error("Error resetting chat history:", err);
      try {
        handleFirestoreError(err, OperationType.DELETE, chatPath);
      } catch (jsonErr) {
        setErrorFeedback("فشل مسح المحادثة بالكامل من السحاب.");
      }
    } finally {
      setIsHistoryLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-[#121020] rounded-2xl border border-indigo-950/80 shadow-xl overflow-hidden flex flex-col justify-center items-center h-[550px] p-8 text-center space-y-6 relative">
        <div className="absolute inset-4 border border-indigo-900/10 pointer-events-none rounded-xl"></div>
        
        <div className="bg-amber-950/10 p-4 rounded-full border border-amber-950/30 text-amber-400">
          <Bot className="w-16 h-16 animate-bounce" />
        </div>

        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-serif font-bold text-amber-400">فَعِّل مَزايا الذّكاء الاصطِناعِي 🤖</h2>
          <p className="text-slate-300 text-sm leading-relaxed font-sans">
            من أجل حماية خصوصية دراستك والدردشة المستمرة مع "أستاذ التاريخ المساعد التفاعلي" المدعوم بـ Google Gemini، يُرجى تسجيل الدخول الآمن بحسابك على Google أولاً.
          </p>
        </div>

        <button
          onClick={onSignInWithGoogle}
          className="bg-white hover:bg-slate-100 text-slate-900 font-sans font-bold text-sm py-3.5 px-8 rounded-xl flex items-center justify-center gap-3 transition active:scale-[0.98] cursor-pointer shadow-lg hover:shadow-amber-500/10"
        >
          {/* Google Logo SVG */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.7 0 3.23.58 4.43 1.73l3.31-3.3C17.74 1.54 15.01 1 12 1 7.15 1 3.1 3.94 1.25 8.16l3.96 3.07C6.15 7.6 8.78 5.04 12 5.04z" />
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.56l3.66 2.84c2.14-1.97 3.75-4.87 3.75-8.51z" />
            <path fill="#FBBC05" d="M5.21 11.23c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.25 8.16C.45 9.77 0 11.58 0 13.5s.45 3.73 1.25 5.34l3.96-3.07c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3z" />
            <path fill="#34A853" d="M12 23c3.24 0 5.96-1.07 7.95-2.91l-3.66-2.84c-1.01.68-2.31 1.09-3.79 1.09-3.22 0-5.85-2.56-6.79-6.19l-3.96 3.07C3.1 20.06 7.15 23 12 23z" />
          </svg>
          <span>تسجيل الدخول الآمن بحساب Google</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-xl overflow-hidden flex flex-col h-[550px] text-right">
      {/* Mini Chat Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 px-6 py-4 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-600/30 p-2 rounded-lg border border-amber-500/20">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div className="text-right">
            <h2 className="font-serif font-bold text-base md:text-lg">المعلِّم التاريخي الذكي 🤖</h2>
            <p className="text-[11px] text-amber-200 font-sans">
              طالِب كفء للصف السادس • السجل السحابي للمشترك: <span className="underline">{currentUser.email}</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleResetChat}
          title="مسح محادثتي السحابية"
          disabled={isHistoryLoading || isLoading}
          className="text-amber-200 hover:text-white hover:bg-amber-800/40 p-1.5 rounded-lg transition disabled:opacity-55"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested trigger words ribbon */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 shrink-0">
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading || isHistoryLoading}
            className="bg-white hover:bg-amber-900 hover:text-white border border-amber-200/80 text-amber-900 rounded-full px-3.5 py-1 text-xs font-medium cursor-pointer transition whitespace-nowrap shadow-sm disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-amber-50/20">
        {isHistoryLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
            <Loader2 className="w-8 h-8 text-amber-700 animate-spin" />
            <p className="text-xs text-amber-800 font-medium font-sans">جاري مزامنة وتلافي المحادثات المسجلة من السحاب...</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isBot = msg.sender === "bot";
            return (
              <div key={idx} className={`flex ${isBot ? "justify-start" : "justify-end"} animate-[fadeIn_0.2s_ease-out]`}>
                <div className={`flex gap-2.5 max-w-[85%] ${isBot ? "flex-row" : "flex-row-reverse"}`}>
                  {/* Bubble Icon */}
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${
                    isBot 
                      ? "bg-amber-100 border-amber-200 text-amber-800" 
                      : "bg-indigo-100 border-indigo-200 text-indigo-800"
                  }`}>
                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Text Bubble */}
                  <div className={`p-4 rounded-2xl shadow-sm leading-relaxed text-sm ${
                    isBot 
                      ? "bg-white text-gray-900 rounded-tl-none border border-amber-100/50" 
                      : "bg-gradient-to-br from-indigo-800 to-indigo-900 text-white rounded-tr-none"
                  }`}>
                    <p className="font-serif whitespace-pre-line text-right">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white p-3 rounded-2xl border border-amber-100/80 rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-amber-700 animate-spin" />
                <span className="text-xs text-amber-800 font-medium">المعلم الذكي يطالع صفحات التاريخ بتمهل...</span>
              </div>
            </div>
          </div>
        )}
        {errorFeedback && (
          <div className="bg-red-50 text-red-800 border border-red-100 p-3 rounded-xl flex items-center gap-2 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorFeedback}</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Tray */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(userInput);
        }}
        className="p-4 border-t border-amber-100 bg-white flex gap-2 shrink-0 items-center"
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserAnswerInput(e.target.value)}
          placeholder="اسأل المعلم الذكي: 'من شيد الأزهر؟' أو 'لماذا مات إسماعيل باشا حرقاً؟'..."
          disabled={isLoading || isHistoryLoading}
          className="flex-grow bg-amber-50/50 hover:bg-amber-50 border border-amber-200/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-900 focus:bg-white text-gray-900 disabled:opacity-50 text-right"
        />
        <button
          type="submit"
          disabled={!userInput.trim() || isLoading || isHistoryLoading}
          className="bg-amber-800 hover:bg-amber-900 disabled:bg-amber-200 text-white p-3.5 rounded-xl transition shadow-md disabled:cursor-not-allowed shrink-0"
        >
          <Send className="w-4 h-4 transform rotate-180" />
        </button>
      </form>
    </div>
  );
};
