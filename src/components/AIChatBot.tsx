/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { playSound } from "./SoundEffects";
import { Send, Bot, User, Sparkles, Loader2, RefreshCw, AlertCircle } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "لماذا غزا الأتراك السودان عام 1821م؟",
  "من هو جعفر المنصور وما قصة بناء بغداد؟",
  "أخبرني عن ثروة وحج ملك مالي منسا موسى!",
  "كيف تأسس الجامع الأزهر ومدينة القاهرة؟",
  "ما هي حقوق وواجبات المواطنة للصف السادس؟"
];

export const AIChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "أهلاً بك يا بطل التاريخ الحبيب! 🌟 أنا 'أستاذ التاريخ الذكي'. اسألني عن أي معركة، ملك، مملكة إسلامية أو إفريقية، أو عن دروس المواطنة للصف السادس، وسأشرحها لك فوراً بطريقة ممتعة للغاية!",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserAnswerInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    playSound("click");
    setErrorFeedback(null);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setUserAnswerInput("");
    setIsLoading(true);

    try {
      // Map existing messages to format expected by API if any
      const formatHistory = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: m.text }]
        }));

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
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.text || "أنا بانتظار استرجاع الإجابة يا بطل.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
      playSound("success");

    } catch (err: any) {
      console.error("Error communicating with Gemini Tutor:", err);
      setErrorFeedback("المعلم الذكي منشغل حالياً، سيقوم بالرد عليك فوراً عند توفر الاتصال.");
      
      // Add a fallback offline response so they are never stuck
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

  const handleResetChat = () => {
    playSound("click");
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: "أهلاً بك مجدداً يا بطل التاريخ! 🌟 أعدت ترتيب دفاتري القديمة. اسألني عن أي حدث في الدروس وسأجيبك فوراً بدقة وحب!",
        timestamp: new Date()
      }
    ]);
    setErrorFeedback(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-xl overflow-hidden flex flex-col h-[550px]">
      {/* Mini Chat Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 px-6 py-4 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-600/30 p-2 rounded-lg border border-amber-500/20">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg">المعلِّم الذكي المساعد 🤖</h2>
            <p className="text-[11px] text-amber-200">مستشارك الخاص بمادة التاريخ والتربية الوطنية للصف السادس</p>
          </div>
        </div>
        <button
          onClick={handleResetChat}
          title="مسح المحادثة وحفظها"
          className="text-amber-200 hover:text-white hover:bg-amber-800/40 p-1.5 rounded-lg transition"
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
            disabled={isLoading}
            className="bg-white hover:bg-amber-900 hover:text-white border border-amber-200/80 text-amber-900 rounded-full px-3.5 py-1 text-xs font-medium cursor-pointer transition whitespace-nowrap shadow-sm disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-amber-50/20">
        {messages.map((msg, idx) => {
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
                  <p className="font-serif whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            </div>
          );
        })}
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
          disabled={isLoading}
          className="flex-1 bg-amber-50/50 hover:bg-amber-50 border border-amber-200/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-900 focus:bg-white text-gray-900 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!userInput.trim() || isLoading}
          className="bg-amber-800 hover:bg-amber-900 disabled:bg-amber-200 text-white p-3.5 rounded-xl transition shadow-md disabled:cursor-not-allowed shrink-0"
        >
          <Send className="w-4 h-4 transform rotate-180" />
        </button>
      </form>
    </div>
  );
};
