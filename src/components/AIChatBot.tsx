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

  // Load chat history from Firestore if logged in, or localStorage if guest
  useEffect(() => {
    if (!currentUser) {
      const guestHistory = localStorage.getItem("guestChatHistory");
      if (guestHistory) {
        try {
          const parsed = JSON.parse(guestHistory);
          setMessages([
            WELCOME_MESSAGE,
            ...parsed.map((m: any) => ({
              ...m,
              timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
            }))
          ]);
        } catch {
          setMessages([WELCOME_MESSAGE]);
        }
      } else {
        setMessages([WELCOME_MESSAGE]);
      }
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
    if (!text.trim() || isLoading) return;
    
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

    const chatPath = currentUser ? `users/${currentUser.uid}/chatHistory` : null;

    try {
      // 1. Save user's message to Firestore if logged in
      if (chatPath) {
        try {
          await addDoc(collection(db, chatPath), {
            sender: "user",
            text: text,
            timestamp: serverTimestamp()
          });
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.CREATE, chatPath);
        }
      }

      // 2. Format history into model format for backend API communication
      const formatHistory = [...messages, userMsgLocal]
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

      // 4. Save AI response to Firestore if logged in
      if (chatPath) {
        try {
          await addDoc(collection(db, chatPath), {
            sender: "bot",
            text: botResponseText,
            timestamp: serverTimestamp()
          });
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.CREATE, chatPath);
        }
      }

      const botMsgLocal: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResponseText,
        timestamp: new Date()
      };

      setMessages(prev => {
        const nextMsgs = [...prev, botMsgLocal];
        if (!currentUser) {
          localStorage.setItem("guestChatHistory", JSON.stringify(nextMsgs.filter(m => m.id !== "welcome")));
        }
        return nextMsgs;
      });
      playSound("success");

    } catch (err: any) {
      console.error("Error communicating with Gemini Tutor:", err);
      setErrorFeedback("المعلم الذكي منشغل حالياً، سيقوم بالرد عليك فوراً عند توفر الاتصال.");
      
      // Standby local fallback response
      setTimeout(() => {
        let fallbackReply = "أنا معك يا بطل! يبدو أن الاتصال بشبكة الإنترنت منخفض، لكن إليك ملخص الدرس: غزو السودان حدث بحثاً عن الذهب والرجال، وبغداد شيدها المنصور دائرية، ومنسا موسى وزع الذهب بمكة، والجامع الأزهر شيده جوهر الصقلي بالقاهرة!";
        const fallbackMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          sender: "bot",
          text: fallbackReply,
          timestamp: new Date()
        };
        setMessages(prev => {
          const nextMsgs = [...prev, fallbackMsg];
          if (!currentUser) {
            localStorage.setItem("guestChatHistory", JSON.stringify(nextMsgs.filter(m => m.id !== "welcome")));
          }
          return nextMsgs;
        });
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

    if (!currentUser) {
      localStorage.removeItem("guestChatHistory");
      return;
    }

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

  return (
    <div className="bg-[#121020] rounded-2xl border border-indigo-950/80 shadow-xl overflow-hidden flex flex-col h-[550px] text-right">
      {/* Mini Chat Header */}
      <div className="bg-gradient-to-r from-[#1c132b] to-[#121020] border-b border-indigo-950 px-6 py-4 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div className="text-right">
            <h2 className="font-serif font-bold text-base md:text-lg text-amber-400">المعلِّم التاريخي الذكي 🤖</h2>
            <p className="text-[11px] text-slate-300 font-sans">
              طالِب كفء للصف السادس • {currentUser ? (
                <>السجل السحابي للمشترك: <span className="underline text-amber-300">{currentUser.email}</span></>
              ) : (
                <span className="text-amber-400 font-bold">زائِر ذكيّ 🌟 (محادثة محلية لعدم التسجيل)</span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleResetChat}
          title={currentUser ? "مسح محادثتي السحابية" : "مسح محادثتي المحلية"}
          disabled={isHistoryLoading || isLoading}
          className="text-slate-400 hover:text-amber-400 hover:bg-indigo-950/60 p-1.5 rounded-lg transition disabled:opacity-55 cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested trigger words ribbon */}
      <div className="bg-[#16132b] border-b border-indigo-950/60 px-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 shrink-0">
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading || isHistoryLoading}
            className="bg-[#1f1a3a] hover:bg-amber-500 hover:text-slate-950 border border-indigo-950 text-slate-100 rounded-full px-3.5 py-1 text-xs font-medium cursor-pointer transition whitespace-nowrap shadow-sm disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Body */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#0f0d1c]">
        {isHistoryLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-xs text-slate-300 font-medium font-sans">جاري مزامنة وتلافي المحادثات المسجلة من السحاب...</p>
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
                      ? "bg-amber-950/40 border-amber-700/60 text-amber-400" 
                      : "bg-[#1f1a3a] border-indigo-950 text-indigo-300"
                  }`}>
                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Text Bubble */}
                  <div className={`p-4 rounded-2xl shadow-sm leading-relaxed text-sm ${
                    isBot 
                      ? "bg-[#18152c] text-slate-100 rounded-tl-none border border-indigo-950" 
                      : "bg-gradient-to-br from-indigo-800 to-indigo-950 text-white rounded-tr-none border border-indigo-900/30"
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
              <div className="w-8 h-8 rounded-full bg-amber-950/40 border border-amber-700/50 text-amber-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#18152c] p-3 rounded-2xl border border-indigo-950/80 rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="text-xs text-slate-300 font-medium font-sans">المعلم الذكي يطالع صفحات التاريخ بتمهل...</span>
              </div>
            </div>
          </div>
        )}
        {errorFeedback && (
          <div className="bg-red-950/30 text-red-300 border border-red-900/40 p-3 rounded-xl flex items-center gap-2 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
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
        className="p-4 border-t border-[#1b1736] bg-[#121020] flex gap-2 shrink-0 items-center"
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserAnswerInput(e.target.value)}
          placeholder="اسأل المعلم الذكي: 'من شيد الأزهر؟' أو 'لماذا مات إسماعيل باشا حرقاً؟'..."
          disabled={isLoading || isHistoryLoading}
          className="flex-grow bg-[#17142d] hover:bg-[#1d193a] border border-[#1d193a] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/60 focus:bg-[#1a1634] text-slate-100 placeholder-slate-500 disabled:opacity-50 text-right font-sans"
        />
        <button
          type="submit"
          disabled={!userInput.trim() || isLoading || isHistoryLoading}
          className="bg-amber-500 hover:bg-amber-400 disabled:bg-[#191530] text-slate-950 disabled:text-slate-600 p-3.5 rounded-xl transition shadow-md disabled:cursor-not-allowed shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4 transform rotate-180" />
        </button>
      </form>
    </div>
  );
};
