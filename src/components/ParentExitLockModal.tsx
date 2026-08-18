/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Lock, Unlock, ShieldAlert, KeyRound, Check, X, AlertCircle, HelpCircle, Eye, EyeOff, Sparkles } from "lucide-react";

interface ParentExitLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmUnlock: () => void;
  parentPin: string;
  onUpdateParentPin: (newPin: string) => void;
  onPlaySound: (type: "click" | "success" | "fail" | "levelup") => void;
  quizTitle?: string;
}

export const ParentExitLockModal: React.FC<ParentExitLockModalProps> = ({
  isOpen,
  onClose,
  onConfirmUnlock,
  parentPin,
  onUpdateParentPin,
  onPlaySound,
  quizTitle = "الاختبار التفاعلي"
}) => {
  const [pinInput, setPinInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  // Math Failsafe Recovery States (For Parent only)
  const [showMathRecovery, setShowMathRecovery] = useState(false);
  const [mathQuestion, setMathQuestion] = useState<{ q: string; a: number }>({ q: "19 × 14", a: 266 });
  const [mathInput, setMathInput] = useState("");

  // Change PIN mode
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [newPinConfirm, setNewPinConfirm] = useState("");
  const [changeSuccessMessage, setChangeSuccessMessage] = useState("");

  // Reset states on open
  useEffect(() => {
    if (isOpen) {
      setPinInput("");
      setErrorMessage("");
      setShowMathRecovery(false);
      setIsChangingPin(false);
      setNewPin("");
      setNewPinConfirm("");
      setChangeSuccessMessage("");
      setMathInput("");

      // Generate a distinct multiplication question for the parent failsafe
      const challenges = [
        { q: "17 × 16", a: 272 },
        { q: "24 × 12", a: 288 },
        { q: "18 × 15", a: 270 },
        { q: "22 × 13", a: 286 },
        { q: "25 × 14", a: 350 },
        { q: "19 × 18", a: 342 },
        { q: "32 × 11", a: 352 }
      ];
      setMathQuestion(challenges[Math.floor(Math.random() * challenges.length)]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (pinInput.trim() === parentPin.trim()) {
      onPlaySound("success");
      setErrorMessage("");
      onConfirmUnlock();
    } else {
      onPlaySound("fail");
      setErrorMessage("❌ كلمة المرور غير صحيحة! يرجى إدخال كلمة المرور الصحيحة المعتمدة من ولي الأمر.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleVerifyMathRecovery = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const ans = parseInt(mathInput.trim(), 10);
    if (ans === mathQuestion.a) {
      onPlaySound("success");
      setIsChangingPin(true);
      setShowMathRecovery(false);
      setErrorMessage("");
    } else {
      onPlaySound("fail");
      setErrorMessage("❌ ناتج المسألة الحسابية غير صحيح، حاول مجدداً لطفاً!");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleSaveNewPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPin.trim() || newPin.trim().length < 3) {
      onPlaySound("fail");
      setErrorMessage("⚠️ يجب أن تتكون كلمة المرور الجديدة من 3 أحرف أو أرقام على الأقل.");
      return;
    }
    if (newPin.trim() !== newPinConfirm.trim()) {
      onPlaySound("fail");
      setErrorMessage("⚠️ تأكيد كلمة المرور غير متطابق مع الكلمة الجديدة!");
      return;
    }

    onPlaySound("levelup");
    onUpdateParentPin(newPin.trim());
    setChangeSuccessMessage("✅ تم تحديث وحفظ كلمة مرور ولي الأمر بنجاح!");
    setErrorMessage("");
    setTimeout(() => {
      setIsChangingPin(false);
      setPinInput(newPin.trim());
      setChangeSuccessMessage("");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div 
        className={`bg-[#141024] border-2 border-amber-500/60 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden text-right font-sans transition-transform ${
          isShaking ? "animate-shake ring-4 ring-rose-500/50" : ""
        }`}
      >
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-rose-950 via-[#261324] to-amber-950 px-6 py-4 border-b border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/40">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-100 flex items-center gap-2">
                <span>قفل ولي الأمر 🔒</span>
                <span className="text-[10px] bg-rose-900/60 text-rose-200 border border-rose-700/50 px-2 py-0.5 rounded-full font-sans">
                  ممنوع الخروج
                </span>
              </h3>
              <p className="text-[11px] text-rose-200/80">الاختبار قيد الحل والتقييم المدرسي</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="الاستمرار في حل الاختبار"
            className="p-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer border border-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Main Notice */}
          <div className="bg-[#1b1228] border border-amber-500/20 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-sm">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>تنبيه تربوي للطالب وولي الأمر:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-serif">
              عزيزي الطالب، هذا الاختبار (<span className="text-amber-300 font-bold">{quizTitle}</span>) قيد التقدم. لمنع التشتت ولضمان اكتمال التقييم بأمانة، <span className="text-rose-300 font-bold">يمنع الخروج أو مغادرة الشاشة إلا بإذن ولي الأمر وإدخال كلمة المرور الخاصة به</span>.
            </p>
          </div>

          {!isChangingPin && !showMathRecovery && (
            /* PIN Verification Form */
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-200 font-serif">
                  أدخل كلمة مرور ولي الأمر لفك القفل والخروج:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setErrorMessage("");
                    }}
                    autoFocus
                    placeholder="اكتب كلمة المرور السرية هنا..."
                    className="w-full bg-[#0d0a19] border border-indigo-900/80 rounded-2xl p-3.5 pr-11 text-slate-100 font-mono text-center tracking-widest text-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                  <div className="absolute right-3.5 top-3.5 text-slate-500">
                    <KeyRound className="w-5 h-5 text-amber-500" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-rose-950/70 text-rose-200 border border-rose-800 p-3 rounded-xl text-xs flex items-center gap-2 leading-relaxed animate-[fadeIn_0.2s_ease-out]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-gradient-to-r from-rose-700 to-amber-700 hover:from-rose-600 hover:to-amber-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg cursor-pointer border border-rose-500/30"
                >
                  <Unlock className="w-4 h-4" />
                  <span>فك القفل وتأكيد خروج ولي الأمر</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    onPlaySound("click");
                    onClose();
                  }}
                  className="w-full sm:w-auto bg-[#1b1932] hover:bg-[#252244] text-slate-200 py-3 px-5 rounded-xl text-xs font-bold transition border border-indigo-900 cursor-pointer"
                >
                  الاستمرار في حل الاختبار ✍️
                </button>
              </div>

              {/* Parent Helpers */}
              <div className="pt-3 border-t border-indigo-950/60 flex items-center justify-between text-[11px] text-slate-400">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySound("click");
                    setShowMathRecovery(true);
                    setErrorMessage("");
                  }}
                  className="text-amber-400 hover:text-amber-300 underline font-bold cursor-pointer transition flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>هل أنت ولي الأمر وتريد تعيين/تعديل كلمة المرور؟</span>
                </button>

                <span className="text-slate-500 text-[10px]">الافتراضية: 1234</span>
              </div>
            </form>
          )}

          {/* Adult Math Challenge Verification for Parent Reset */}
          {showMathRecovery && !isChangingPin && (
            <form onSubmit={handleVerifyMathRecovery} className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-[#0f0b1d] border border-amber-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>التحقق الأمني للوالدين (تخطي / تعديل كلمة المرور):</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  لتأكيد أنك ولي الأمر وتعديل أو تجاوز كلمة المرور، يرجى حل العملية الحسابية السريعة التالية:
                </p>

                <div className="bg-[#18132d] p-3.5 rounded-xl border border-indigo-900 flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-amber-300 font-serif">ما هو ناتج: {mathQuestion.q} = ؟</span>
                  <input
                    type="number"
                    value={mathInput}
                    onChange={(e) => {
                      setMathInput(e.target.value);
                      setErrorMessage("");
                    }}
                    autoFocus
                    placeholder="الناتج"
                    className="w-24 p-2 text-center rounded-xl bg-[#0e0a1b] border border-indigo-700 text-white font-bold font-serif focus:outline-none focus:border-amber-400 text-sm"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="bg-rose-950/70 text-rose-200 border border-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex gap-2.5">
                <button
                  type="submit"
                  className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer shadow"
                >
                  تأكيد التحقق والمتابعة 🔓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPlaySound("click");
                    setShowMathRecovery(false);
                    setErrorMessage("");
                  }}
                  className="bg-[#1b1932] hover:bg-[#252244] text-slate-300 py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  رجوع
                </button>
              </div>
            </form>
          )}

          {/* Change PIN View */}
          {isChangingPin && (
            <form onSubmit={handleSaveNewPin} className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-[#0f0b1d] border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold text-xs">
                  <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تعيين كلمة مرور جديدة لقفل الاختبارات:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  قم بإنشاء كلمة مرور خاصة بك كولي أمر لمنع طفلك من الخروج من الامتحانات حتى ينتهي:
                </p>

                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] text-slate-300 font-bold mb-1">كلمة المرور الجديدة (أرقام أو حروف):</label>
                    <input
                      type="text"
                      value={newPin}
                      onChange={(e) => {
                        setNewPin(e.target.value);
                        setErrorMessage("");
                      }}
                      autoFocus
                      placeholder="مثال: 5566 أو sudan2026"
                      className="w-full bg-[#18132d] border border-indigo-900 rounded-xl p-2.5 text-white font-mono text-center text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-bold mb-1">تأكيد كلمة المرور الجديدة:</label>
                    <input
                      type="text"
                      value={newPinConfirm}
                      onChange={(e) => {
                        setNewPinConfirm(e.target.value);
                        setErrorMessage("");
                      }}
                      placeholder="أعد كتابة نفس الكلمة للتأكيد"
                      className="w-full bg-[#18132d] border border-indigo-900 rounded-xl p-2.5 text-white font-mono text-center text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {changeSuccessMessage && (
                <div className="bg-emerald-950/70 text-emerald-200 border border-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{changeSuccessMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="bg-rose-950/70 text-rose-200 border border-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex gap-2.5">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer shadow flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ كلمة المرور الجديدة</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPlaySound("click");
                    setIsChangingPin(false);
                    setErrorMessage("");
                  }}
                  className="bg-[#1b1932] hover:bg-[#252244] text-slate-300 py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
