/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Download, Sparkles, X, Smartphone, Check, Share, PlusSquare, Monitor } from "lucide-react";

interface PWAInstallPromptProps {
  onPlaySound?: (type: "click" | "success" | "fail" | "levelup") => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onPlaySound }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // Check if already in standalone mode (already installed)
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes("android-app://");

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      setIsInstallable(true);
    }

    // Listen for beforeinstallprompt event (Android / Chrome / Edge / Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowModal(false);
      if (onPlaySound) onPlaySound("success");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (onPlaySound) onPlaySound("click");

    if (deferredPrompt) {
      // Trigger native browser install prompt
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
        if (onPlaySound) onPlaySound("success");
      }
      setDeferredPrompt(null);
      setShowModal(false);
    } else {
      // Open modal with instructions (especially for iOS or manual install)
      setShowModal(true);
    }
  };

  if (isInstalled) {
    return null; // Don't clutter UI if already installed
  }

  return (
    <>
      {/* Top Bar / Header Install Button */}
      <button
        type="button"
        id="pwa-install-button"
        onClick={() => {
          if (deferredPrompt) {
            handleInstallClick();
          } else {
            if (onPlaySound) onPlaySound("click");
            setShowModal(true);
          }
        }}
        className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 px-3.5 py-1.5 rounded-xl font-serif font-black text-xs shadow-lg hover:shadow-amber-500/20 transition-all duration-200 cursor-pointer border border-amber-300/40 select-none shrink-0 animate-pulse"
        title="تثبيت المنصة كتطبيق على هاتفك أو حاسوبك"
      >
        <span className="w-5 h-5 rounded-lg bg-slate-950/10 flex items-center justify-center">
          <Download className="w-3.5 h-3.5 text-slate-950 group-hover:-translate-y-0.5 transition-transform" />
        </span>
        <span className="whitespace-nowrap">تثبيت التطبيق 📲</span>
      </button>

      {/* Instructional Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          dir="rtl"
        >
          <div className="bg-[#15122b] border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-right relative">
            {/* Close Button */}
            <button
              onClick={() => {
                if (onPlaySound) onPlaySound("click");
                setShowModal(false);
              }}
              className="absolute left-4 top-4 text-slate-400 hover:text-white bg-slate-800/60 p-2 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* App Icon & Badge */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border border-amber-500/40 bg-[#121020] p-1 shrink-0 flex items-center justify-center">
                <img 
                  src="/icon.svg" 
                  alt="أيقونة تطبيق تاريخ السودان" 
                  className="w-full h-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  تطبيق الويب التفاعلي PWA
                </span>
                <h3 className="font-serif font-black text-lg text-amber-400">
                  تاريخ السودان والتربية الوطنية
                </h3>
                <p className="text-xs text-slate-300">الصف السادس الابتدائي 🇸🇩</p>
              </div>
            </div>

            {/* Benefits of Installing */}
            <div className="bg-[#0f0d1c] p-3.5 rounded-2xl border border-indigo-950/80 space-y-2 text-xs text-slate-200">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Check className="w-4 h-4 shrink-0" />
                <span>فتح فوري بشاشة كاملة وبدون أشرطة المتصفح المزعجة</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Check className="w-4 h-4 shrink-0" />
                <span>أيقونة تاريخية مخصصة تزين شاشة هاتفك الرئيسية</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Check className="w-4 h-4 shrink-0" />
                <span>وصول سريع وحفظ مستمر لدروسك ونتائجك</span>
              </div>
            </div>

            {/* Specific Instructions based on OS */}
            {isIOS ? (
              <div className="space-y-2.5 bg-amber-950/20 border border-amber-500/30 p-4 rounded-2xl text-xs text-amber-200 font-sans">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>خطوات التثبيت على أجهزة آيفون / آيباد (Safari):</span>
                </p>
                <ol className="space-y-2 list-decimal list-inside text-slate-200 pr-1">
                  <li>
                    اضغط على زر <strong className="text-amber-400">المشاركة (Share)</strong> <Share className="w-3.5 h-3.5 inline mx-1 text-sky-400" /> في أسفل شاشة المتصفح.
                  </li>
                  <li>
                    مرر للأسفل واختر <strong className="text-amber-400">"إضافة إلى الشاشة الرئيسية"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-amber-400" /> (Add to Home Screen).
                  </li>
                  <li>
                    اضغط على كلمة <strong className="text-emerald-400">"إضافة" (Add)</strong> في أعلى الزاوية.
                  </li>
                </ol>
              </div>
            ) : deferredPrompt ? (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 py-3 rounded-2xl font-serif font-black text-sm shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>تثبيت التطبيق على جهازي الآن 🚀</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 bg-[#121020] border border-indigo-950 p-4 rounded-2xl text-xs text-slate-300">
                <p className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4" />
                  <span>لتثبيت التطبيق على الحاسوب أو الأندرويد:</span>
                </p>
                <p>
                  اضغط على قائمة خيارات المتصفح (⋮ أو ⋯) في الأعلى، ثم اختر <strong className="text-amber-400">"تثبيت التطبيق" (Install app)</strong> أو <strong className="text-amber-400">"إضافة إلى الشاشة الرئيسية"</strong>.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (onPlaySound) onPlaySound("click");
                setShowModal(false);
              }}
              className="w-full bg-[#1b1736] hover:bg-[#221d42] text-slate-300 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              إغلاق ومتابعة التصفح
            </button>
          </div>
        </div>
      )}
    </>
  );
};
