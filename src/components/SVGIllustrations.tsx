/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface SVGProps {
  className?: string;
  type: string;
}

export const SVGIllustration: React.FC<SVGProps> = ({ className = "w-full h-48", type }) => {
  // Container with subtle parchment theme and vintage accents
  const containerClass = `relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#18142a]/95 to-[#100d1e]/95 p-3 md:p-4 border border-amber-500/20 shadow-lg flex items-center justify-center select-none ${className}`;

  switch (type) {
    // =========================================================================
    // الوحدة الأولى: تاريخ السودان الحديث (الحكم التركي المصري ١٨٢١ - ١٨٨٥م)
    // =========================================================================

    // الدرس الأول: الغزو التركي المصري وحملات سنار وكردفان ومقاومة الشايقية ١٨٢٠ - ١٨٢١م
    case "TurkoEgyptianInvasion":
    case "Invasion1821": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyInv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e1338" />
                <stop offset="60%" stopColor="#451a2e" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>
              <linearGradient id="duneInv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="nileInv" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="50%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#075985" />
              </linearGradient>
            </defs>
            {/* Background Sky & Sun */}
            <rect width="500" height="240" rx="12" fill="url(#skyInv)" />
            <circle cx="250" cy="90" r="38" fill="#fef08a" opacity="0.85" className="animate-pulse" />
            <circle cx="250" cy="90" r="50" fill="#fef08a" opacity="0.2" />

            {/* Desert Dunes */}
            <path d="M0 160 Q120 130 250 155 T500 145 L500 240 L0 240 Z" fill="url(#duneInv)" />
            <path d="M0 180 Q160 165 320 185 T500 175 L500 240 L0 240 Z" fill="#92400e" opacity="0.8" />

            {/* Nile River Curve */}
            <path d="M0 200 C150 190, 220 225, 500 205 L500 240 L0 240 Z" fill="url(#nileInv)" />

            {/* Nile War Boats (اسطول مراكب إسماعيل باشا) */}
            <g transform="translate(60, 160) scale(0.85)">
              <path d="M10 30 C30 40, 90 40, 110 30 C100 45, 20 45, 10 30 Z" fill="#451a03" stroke="#b45309" strokeWidth="1.5" />
              <line x1="60" y1="32" x2="60" y2="0" stroke="#d97706" strokeWidth="2.5" />
              <polygon points="60,2 105,20 60,26" fill="#fef3c7" opacity="0.9" />
              <polygon points="60,0 48,5 60,10" fill="#ef4444" />
            </g>
            <g transform="translate(160, 175) scale(0.65)">
              <path d="M10 30 C30 40, 90 40, 110 30 C100 45, 20 45, 10 30 Z" fill="#451a03" stroke="#b45309" strokeWidth="1.5" />
              <line x1="60" y1="32" x2="60" y2="0" stroke="#d97706" strokeWidth="2.5" />
              <polygon points="60,2 105,20 60,26" fill="#fef3c7" opacity="0.9" />
            </g>

            {/* Cannon Artillery (المدفعية والسلاح الناري) */}
            <g transform="translate(340, 130) scale(0.9)">
              <line x1="20" y1="45" x2="70" y2="25" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
              <circle cx="35" cy="45" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
              <line x1="35" y1="31" x2="35" y2="59" stroke="#64748b" strokeWidth="1.5" />
              <line x1="21" y1="45" x2="49" y2="45" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="35" cy="45" r="4" fill="#cbd5e1" />
            </g>

            {/* Sudanese Traditional Shields & Spears (سلاح المقاومة الوطنية) */}
            <g transform="translate(425, 120)">
              {/* Crocodile skin oval shield */}
              <ellipse cx="20" cy="30" rx="14" ry="24" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="20" y1="8" x2="20" y2="52" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
              {/* Crossed Spears */}
              <line x1="-5" y1="55" x2="45" y2="5" stroke="#e2e8f0" strokeWidth="2" />
              <polygon points="45,5 48,1 42,4" fill="#94a3b8" />
              <line x1="45" y1="55" x2="-5" y2="5" stroke="#e2e8f0" strokeWidth="2" />
              <polygon points="-5,5 -8,1 -2,4" fill="#94a3b8" />
            </g>

            {/* Calligraphic Header Ribbon */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="serif">حملة سنار وكردفان والغزو التركي ١٨٢١م</text>
          </svg>
        </div>
      );
    }

    // الدرس الثاني: تأسيس الخرطوم عاصمة ١٨٢٤م وسراي الحكمدارية وخورشيد باشا
    case "KhartoumCpt":
    case "KhartoumFounding":
    case "Building": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyKh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="60%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
              <linearGradient id="palaceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyKh)" />

            {/* Confluence Waters (ملتقى النيل الأزرق والأبيض وجزيرة توتي) */}
            <path d="M0 170 Q140 160 220 185 L500 175 L500 240 L0 240 Z" fill="#0284c7" opacity="0.6" />
            <path d="M0 195 Q180 180 270 205 L500 190 L500 240 L0 240 Z" fill="#0369a1" />

            {/* Island of Tuti silhouette */}
            <path d="M60 175 C100 165, 140 165, 170 178 C140 183, 90 183, 60 175 Z" fill="#15803d" stroke="#166534" />
            {/* Palm trees on bank */}
            <g transform="translate(80, 145) scale(0.6)">
              <line x1="20" y1="50" x2="18" y2="15" stroke="#78350f" strokeWidth="3" />
              <path d="M18 15 Q0 5 -5 18 M18 15 Q15 -5 22 -15 M18 15 Q35 5 45 18 M18 15 Q30 -2 38 -8" stroke="#22c55e" strokeWidth="2.5" fill="none" />
            </g>
            <g transform="translate(125, 148) scale(0.5)">
              <line x1="20" y1="50" x2="18" y2="15" stroke="#78350f" strokeWidth="3" />
              <path d="M18 15 Q0 5 -5 18 M18 15 Q15 -5 22 -15 M18 15 Q35 5 45 18 M18 15 Q30 -2 38 -8" stroke="#16a34a" strokeWidth="2.5" fill="none" />
            </g>

            {/* Khartoum Government Saray (سراي الحكمدارية التاريخي بالطوب الأحمر) */}
            <g transform="translate(200, 75)">
              {/* Foundation & Base */}
              <rect x="0" y="60" width="220" height="50" fill="#b91c1c" rx="2" stroke="#7f1d1d" strokeWidth="1.5" />
              <rect x="15" y="30" width="190" height="30" fill="url(#palaceGrad)" stroke="#64748b" strokeWidth="1.5" />
              {/* Classical Pillars */}
              <line x1="35" y1="30" x2="35" y2="60" stroke="#475569" strokeWidth="3" />
              <line x1="65" y1="30" x2="65" y2="60" stroke="#475569" strokeWidth="3" />
              <line x1="95" y1="30" x2="95" y2="60" stroke="#475569" strokeWidth="3" />
              <line x1="125" y1="30" x2="125" y2="60" stroke="#475569" strokeWidth="3" />
              <line x1="155" y1="30" x2="155" y2="60" stroke="#475569" strokeWidth="3" />
              <line x1="185" y1="30" x2="185" y2="60" stroke="#475569" strokeWidth="3" />

              {/* Windows in rows */}
              <rect x="25" y="70" width="16" height="20" rx="3" fill="#1e293b" />
              <rect x="55" y="70" width="16" height="20" rx="3" fill="#1e293b" />
              <rect x="85" y="70" width="16" height="20" rx="3" fill="#1e293b" />
              <rect x="115" y="70" width="16" height="20" rx="3" fill="#1e293b" />
              <rect x="145" y="70" width="16" height="20" rx="3" fill="#1e293b" />
              <rect x="175" y="70" width="16" height="20" rx="3" fill="#1e293b" />

              {/* Grand Central Dome & Ottoman Flag */}
              <path d="M85 30 A25 25 0 0 1 135 30 Z" fill="#047857" stroke="#065f46" strokeWidth="1.5" />
              <line x1="110" y1="5" x2="110" y2="-12" stroke="#d97706" strokeWidth="2" />
              <polygon points="110,-12 132,-6 110,0" fill="#dc2626" />
            </g>

            {/* Steamer Boat in Nile (ترسانة المراكب) */}
            <g transform="translate(320, 185) scale(0.8)">
              <path d="M0 15 C20 25, 90 25, 110 15 L100 5 L10 5 Z" fill="#334155" stroke="#475569" />
              <rect x="30" y="-8" width="40" height="13" fill="#f8fafc" />
              <rect x="45" y="-20" width="8" height="12" fill="#0f172a" />
              {/* Puffy steam */}
              <circle cx="53" cy="-26" r="4" fill="#cbd5e1" opacity="0.7" />
              <circle cx="60" cy="-32" r="6" fill="#cbd5e1" opacity="0.5" />
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="serif">سراي الحكمدارية وتأسيس الخرطوم ١٨٢٤م</text>
          </svg>
        </div>
      );
    }

    // الدرس الثالث: السودان في عهد عباس وسعيد (مدرسة الخرطوم ١٨٥٣م ورفاعة الطهطاوي)
    case "AbbasSaidEra": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyEdu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#312e81" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyEdu)" />

            {/* School Building & Archway (أول مدرسة نظامية بالخرطوم ١٨٥٣م) */}
            <g transform="translate(60, 60)">
              <rect x="0" y="40" width="160" height="70" fill="#fde047" opacity="0.9" rx="3" stroke="#ca8a04" strokeWidth="1.5" />
              <polygon points="0,40 80,5 160,40" fill="#b45309" />
              {/* Arabic Archway Door */}
              <path d="M60 110 V75 A20 20 0 0 1 100 75 V110 Z" fill="#1e1b4b" stroke="#d97706" strokeWidth="2" />
              {/* Windows */}
              <rect x="20" y="60" width="22" height="25" rx="3" fill="#312e81" stroke="#ca8a04" />
              <rect x="118" y="60" width="22" height="25" rx="3" fill="#312e81" stroke="#ca8a04" />
              {/* Clock on facade */}
              <circle cx="80" cy="30" r="10" fill="#fff" stroke="#78350f" strokeWidth="1.5" />
              <line x1="80" y1="30" x2="80" y2="24" stroke="#000" />
              <line x1="80" y1="30" x2="85" y2="30" stroke="#000" />
            </g>

            {/* Open Book & Quill of Rifa'a al-Tahtawi (كتب ومخطوطات التعليم) */}
            <g transform="translate(250, 60)">
              {/* Stacked books */}
              <rect x="20" y="90" width="180" height="18" rx="3" fill="#dc2626" stroke="#991b1b" />
              <rect x="30" y="72" width="165" height="18" rx="3" fill="#059669" stroke="#047857" />
              {/* Open Book */}
              <path d="M40 70 C80 60, 110 75, 120 70 C130 75, 160 60, 200 70 L200 30 C160 20, 130 35, 120 30 C110 35, 80 20, 40 30 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
              <line x1="120" y1="30" x2="120" y2="70" stroke="#b45309" strokeWidth="1.5" />
              {/* Arabic script lines */}
              <line x1="55" y1="40" x2="105" y2="40" stroke="#a78bfa" strokeWidth="1.5" />
              <line x1="55" y1="50" x2="100" y2="50" stroke="#a78bfa" strokeWidth="1.5" />
              <line x1="55" y1="60" x2="108" y2="60" stroke="#a78bfa" strokeWidth="1.5" />
              <line x1="135" y1="40" x2="185" y2="40" stroke="#818cf8" strokeWidth="1.5" />
              <line x1="135" y1="50" x2="180" y2="50" stroke="#818cf8" strokeWidth="1.5" />
              <line x1="135" y1="60" x2="188" y2="60" stroke="#818cf8" strokeWidth="1.5" />

              {/* Inkpot and Feather Quill */}
              <rect x="185" y="80" width="22" height="28" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
              <path d="M196 80 Q215 30 230 15 Q218 35 200 75" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
            </g>

            {/* Decree Scroll of Said Pasha (إلغاء الحكمدارية وإصلاح الضرائب ١٨٥٧م) */}
            <g transform="translate(180, 145) scale(0.85)">
              <rect x="0" y="0" width="180" height="40" rx="6" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
              <text x="90" y="18" textAnchor="middle" fill="#78350f" fontSize="10" fontWeight="bold">إصلاحات سعيد وإعفاء الضرائب</text>
              <text x="90" y="32" textAnchor="middle" fill="#92400e" fontSize="9">مدرسة رفاعة الطهطاوي بالخرطوم ١٨٥٣م</text>
            </g>

            <rect x="120" y="14" width="260" height="26" rx="13" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="bold" fontFamily="serif">عهد عباس وسعيد وبداية التعليم النظامي</text>
          </svg>
        </div>
      );
    }

    // الدرس الرابع: عهد الخديوي إسماعيل (التلغراف والسكك الحديدية والنهضة الزراعية وضم دارفور)
    case "KhediveIsmailEra": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyIsmail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyIsmail)" />

            {/* Telegraph Poles & Wires (خطوط التلغراف بالسودان) */}
            <g transform="translate(40, 50)">
              {/* Pole 1 */}
              <line x1="30" y1="130" x2="30" y2="20" stroke="#78350f" strokeWidth="3.5" />
              <line x1="15" y1="35" x2="45" y2="35" stroke="#78350f" strokeWidth="2.5" />
              <circle cx="18" cy="35" r="2.5" fill="#f8fafc" />
              <circle cx="42" cy="35" r="2.5" fill="#f8fafc" />
              {/* Pole 2 */}
              <line x1="130" y1="130" x2="130" y2="35" stroke="#78350f" strokeWidth="3" />
              <line x1="118" y1="48" x2="142" y2="48" stroke="#78350f" strokeWidth="2" />
              <circle cx="120" cy="48" r="2" fill="#f8fafc" />
              <circle cx="140" cy="48" r="2" fill="#f8fafc" />
              {/* Pole 3 */}
              <line x1="210" y1="130" x2="210" y2="50" stroke="#78350f" strokeWidth="2.5" />
              {/* Connecting Telegraph Wires */}
              <path d="M18 35 Q74 50 120 48 Q165 60 210 50" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="4 2" />
              <path d="M42 35 Q86 52 140 48" fill="none" stroke="#fef08a" strokeWidth="1.5" />
            </g>

            {/* Railway Tracks (بداية مد السكة حديد من وادي حلفا) */}
            <g transform="translate(30, 160)">
              <line x1="0" y1="30" x2="220" y2="30" stroke="#94a3b8" strokeWidth="3" />
              <line x1="0" y1="45" x2="220" y2="45" stroke="#94a3b8" strokeWidth="3" />
              {/* Sleepers */}
              <line x1="20" y1="24" x2="20" y2="51" stroke="#78350f" strokeWidth="3" />
              <line x1="50" y1="24" x2="50" y2="51" stroke="#78350f" strokeWidth="3" />
              <line x1="80" y1="24" x2="80" y2="51" stroke="#78350f" strokeWidth="3" />
              <line x1="110" y1="24" x2="110" y2="51" stroke="#78350f" strokeWidth="3" />
              <line x1="140" y1="24" x2="140" y2="51" stroke="#78350f" strokeWidth="3" />
              <line x1="170" y1="24" x2="170" y2="51" stroke="#78350f" strokeWidth="3" />
              <line x1="200" y1="24" x2="200" y2="51" stroke="#78350f" strokeWidth="3" />
            </g>

            {/* Cotton Fields & Agriculture (زراعة القطن والسواقي) */}
            <g transform="translate(290, 80)">
              {/* Cotton Plant */}
              <path d="M70 90 Q65 60 70 35 Q75 60 70 90" fill="#15803d" />
              <path d="M70 65 Q45 50 35 60 M70 50 Q95 40 105 50" stroke="#16a34a" strokeWidth="2.5" fill="none" />
              {/* Cotton Bolls (كرات القطن الأبيض الناصع) */}
              <circle cx="35" cy="58" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="105" cy="48" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="70" cy="30" r="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="70" cy="27" r="4" fill="#f8fafc" />

              {/* Saqiya Water Wheel (الساقية السودانية) */}
              <circle cx="155" cy="65" r="24" fill="none" stroke="#b45309" strokeWidth="3" />
              <circle cx="155" cy="65" r="6" fill="#78350f" />
              <line x1="155" y1="41" x2="155" y2="89" stroke="#b45309" strokeWidth="2" />
              <line x1="131" y1="65" x2="179" y2="65" stroke="#b45309" strokeWidth="2" />
              <line x1="138" y1="48" x2="172" y2="82" stroke="#b45309" strokeWidth="2" />
              <line x1="138" y1="82" x2="172" y2="48" stroke="#b45309" strokeWidth="2" />
              {/* Water stream */}
              <path d="M155 75 Q165 95 190 95" stroke="#38bdf8" strokeWidth="3" fill="none" />
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="bold" fontFamily="serif">عهد الخديوي إسماعيل والنهضة العمرانية</text>
          </svg>
        </div>
      );
    }

    // الدرس الخامس: حكمدارية غردون باشا ١٨٧٧ - ١٨٧٩م ومكافحة تجارة الرقيق
    case "GordonPashaEra": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyGor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#18181b" />
                <stop offset="60%" stopColor="#27272a" />
                <stop offset="100%" stopColor="#3f3f46" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyGor)" />

            {/* Nile Water */}
            <path d="M0 160 Q200 145 500 165 L500 240 L0 240 Z" fill="#0284c7" opacity="0.7" />

            {/* Nile Steamer Patrol (باخرة غردون النيلية بمقرن الخرطوم) */}
            <g transform="translate(70, 115)">
              {/* Hull */}
              <path d="M0 35 C30 50, 180 50, 210 35 L190 15 L20 15 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              {/* Wooden Decks */}
              <rect x="35" y="-5" width="140" height="20" fill="#f8fafc" rx="2" stroke="#94a3b8" />
              <rect x="55" y="-22" width="95" height="18" fill="#f1f5f9" rx="2" stroke="#94a3b8" />
              {/* Paddle Wheel (عجلة التجديف الجانبية للباخرة النيلية) */}
              <circle cx="105" cy="30" r="18" fill="#78350f" stroke="#d97706" strokeWidth="2" />
              <circle cx="105" cy="30" r="5" fill="#fef3c7" />
              {/* Tall Steam Funnel */}
              <rect x="98" y="-45" width="14" height="25" fill="#0f172a" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="95" y1="-38" x2="115" y2="-38" stroke="#dc2626" strokeWidth="2.5" />
              {/* Steam Plume */}
              <circle cx="105" cy="-52" r="5" fill="#cbd5e1" opacity="0.8" />
              <circle cx="112" cy="-60" r="7" fill="#cbd5e1" opacity="0.6" />
              <circle cx="120" cy="-68" r="9" fill="#cbd5e1" opacity="0.4" />
            </g>

            {/* Broken Chains Emblem (رمز كسر قيود تجارة الرقيق) */}
            <g transform="translate(340, 65)">
              <circle cx="60" cy="50" r="42" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2" />
              {/* Broken Chain Links */}
              <rect x="25" y="44" width="25" height="12" rx="6" fill="none" stroke="#cbd5e1" strokeWidth="3" />
              <rect x="70" y="44" width="25" height="12" rx="6" fill="none" stroke="#cbd5e1" strokeWidth="3" />
              <path d="M48 40 L58 35 M52 60 L62 55" stroke="#f59e0b" strokeWidth="2.5" />
              {/* Scale of Justice */}
              <line x1="60" y1="20" x2="60" y2="75" stroke="#fbbf24" strokeWidth="2" />
              <line x1="38" y1="30" x2="82" y2="30" stroke="#fbbf24" strokeWidth="2" />
              <polygon points="38,30 30,45 46,45" fill="#fef08a" stroke="#d97706" />
              <polygon points="82,30 74,45 90,45" fill="#fef08a" stroke="#d97706" />
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#18181b" stroke="#e4e4e7" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#fafafa" fontSize="11" fontWeight="bold" fontFamily="serif">حكمدارية غردون ومحاربة تجارة الرقيق</text>
          </svg>
        </div>
      );
    }

    // =========================================================================
    // الوحدة الثانية: الدولة العباسية (١٣٢ - ٦٥٦هـ / ٧٥٠ - ١٢٥٨م)
    // =========================================================================

    // الدرس الأول: قيام الدولة العباسية ومعركة الزاب والدعوة السرية
    case "AbbasidRise": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyAbbRise" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#09090b" />
                <stop offset="100%" stopColor="#18181b" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyAbbRise)" />

            {/* Black Abbasid Standard / Banner (راية بني العباس السوداء الشهيرة) */}
            <g transform="translate(80, 45)">
              {/* Spear Staff */}
              <line x1="40" y1="160" x2="40" y2="10" stroke="#d97706" strokeWidth="4" />
              <polygon points="40,5 44,14 36,14" fill="#fbbf24" stroke="#d97706" />
              {/* Fluttering Black Silk Banner */}
              <path d="M40 18 Q90 10 140 22 Q120 45 145 65 Q90 55 40 68 Z" fill="#000000" stroke="#f59e0b" strokeWidth="1.5" />
              {/* Gold Calligraphy emblem */}
              <text x="85" y="46" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="serif">الرضا من آل محمد</text>
            </g>

            {/* Mosque of Kufa Minaret & Domes (الكوفة وبداية الخلافة) */}
            <g transform="translate(240, 50)">
              {/* Fortress Wall */}
              <rect x="0" y="80" width="190" height="60" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />
              {/* Crenellations */}
              <rect x="10" y="70" width="15" height="12" fill="#27272a" />
              <rect x="40" y="70" width="15" height="12" fill="#27272a" />
              <rect x="70" y="70" width="15" height="12" fill="#27272a" />
              <rect x="100" y="70" width="15" height="12" fill="#27272a" />
              <rect x="130" y="70" width="15" height="12" fill="#27272a" />
              <rect x="160" y="70" width="15" height="12" fill="#27272a" />

              {/* Minaret */}
              <rect x="140" y="10" width="30" height="70" fill="#3f3f46" stroke="#71717a" strokeWidth="1.5" />
              <polygon points="140,10 155,-5 170,10" fill="#eab308" />
              <circle cx="155" cy="-8" r="3" fill="#fbbf24" />

              {/* Islamic Archways */}
              <path d="M30 140 V105 A15 15 0 0 1 60 105 V140 Z" fill="#09090b" stroke="#eab308" strokeWidth="1.5" />
              <path d="M85 140 V105 A15 15 0 0 1 115 105 V140 Z" fill="#09090b" stroke="#eab308" strokeWidth="1.5" />
            </g>

            {/* Crossed Swords (معركة الزاب الكبير ١٣٢هـ) */}
            <g transform="translate(230, 155) scale(0.8)">
              <line x1="20" y1="60" x2="80" y2="10" stroke="#cbd5e1" strokeWidth="3" />
              <polygon points="80,10 83,7 77,9" fill="#f8fafc" />
              <line x1="80" y1="60" x2="20" y2="10" stroke="#cbd5e1" strokeWidth="3" />
              <polygon points="20,10 17,7 23,9" fill="#f8fafc" />
              <circle cx="50" cy="35" r="8" fill="#eab308" />
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#09090b" stroke="#eab308" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="bold" fontFamily="serif">قيام الدولة العباسية ومعركة الزاب ١٣٢هـ</text>
          </svg>
        </div>
      );
    }

    // الدرس الثاني: أبرز خلفاء بني العباس ومآثرهم (المنصور، الرشيد، المأمون، المعتصم وسامراء)
    case "AbbasidCaliphs": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyAbbCal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#172554" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyAbbCal)" />

            {/* Spiral Minaret of Samarra - Malwiya (مئذنة الملوية بسامراء - عصر المعتصم) */}
            <g transform="translate(60, 45)">
              {/* Square Base */}
              <rect x="10" y="125" width="100" height="20" fill="#b45309" rx="2" stroke="#d97706" />
              {/* Spiral Cone Tiers */}
              <ellipse cx="60" cy="120" rx="45" ry="12" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
              <ellipse cx="60" cy="98" rx="36" ry="10" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
              <ellipse cx="60" cy="78" rx="27" ry="8" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
              <ellipse cx="60" cy="60" rx="18" ry="6" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
              <ellipse cx="60" cy="44" rx="10" ry="4" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
              {/* Top Pavillion */}
              <rect x="55" y="24" width="10" height="18" fill="#fbbf24" />
              <circle cx="60" cy="20" r="4" fill="#fef08a" />
            </g>

            {/* Royal Golden Court & Astrolabe (بلاط الرشيد والنهضة الفلكية) */}
            <g transform="translate(230, 55)">
              {/* Astrolabe (الأسطرلاب الفلكي الإسلامي) */}
              <circle cx="60" cy="60" r="38" fill="#1e1b4b" stroke="#eab308" strokeWidth="3" />
              <circle cx="60" cy="60" r="30" fill="none" stroke="#fde047" strokeWidth="1" strokeDasharray="3 2" />
              <circle cx="60" cy="60" r="5" fill="#fde047" />
              {/* Pointers and rings */}
              <line x1="60" y1="22" x2="60" y2="98" stroke="#eab308" strokeWidth="1.5" />
              <line x1="22" y1="60" x2="98" y2="60" stroke="#eab308" strokeWidth="1.5" />
              <path d="M40 40 Q60 60 80 40 Q60 80 40 40" fill="none" stroke="#facc15" strokeWidth="1" />
              {/* Hanging ring */}
              <circle cx="60" cy="16" r="6" fill="none" stroke="#eab308" strokeWidth="2" />
            </g>

            {/* Caliph's Golden Crown & Seal (تاج وخاتم الخلافة) */}
            <g transform="translate(360, 80)">
              <path d="M10 55 L25 25 L45 42 L65 18 L85 42 L105 25 L120 55 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
              <rect x="10" y="55" width="110" height="14" rx="2" fill="#ca8a04" />
              {/* Jewels */}
              <circle cx="35" cy="62" r="3" fill="#ef4444" />
              <circle cx="65" cy="62" r="4" fill="#3b82f6" />
              <circle cx="95" cy="62" r="3" fill="#10b981" />
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#1e3a8a" stroke="#eab308" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="bold" fontFamily="serif">أبرز خلفاء بني العباس وعصر الازدهار</text>
          </svg>
        </div>
      );
    }

    // الدرس الثالث: تأسيس مدينة بغداد المدورة (قصر الذهب وأبواب بغداد الأربعة)
    case "BaghdadRound":
    case "BaghdadRoundCity":
    case "Tower": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyBaghdad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0c4a6e" />
                <stop offset="100%" stopColor="#075985" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyBaghdad)" />

            {/* Tigris River (نهر دجلة الخالد) */}
            <path d="M380 0 C340 70, 390 150, 350 240 L500 240 L500 0 Z" fill="#0284c7" opacity="0.5" />
            <text x="440" y="125" fill="#e0f2fe" fontSize="11" fontWeight="bold" fontFamily="serif">نهر دجلة</text>

            {/* Concentric 3-Tier Circular Walls of Baghdad (المدينة المدورة لأبي جعفر المنصور) */}
            <g transform="translate(180, 125)">
              {/* Outer Deep Ditch & Outer Wall */}
              <circle cx="0" cy="0" r="75" fill="#0369a1" opacity="0.3" />
              <circle cx="0" cy="0" r="68" fill="#0284c7" stroke="#f59e0b" strokeWidth="3" opacity="0.7" />
              {/* Inner Main Wall with battlements */}
              <circle cx="0" cy="0" r="48" fill="#075985" stroke="#fde047" strokeWidth="2.5" />
              {/* Central Courtyard & Golden Gate Palace */}
              <circle cx="0" cy="0" r="25" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" />

              {/* The Green Dome of Qasr Al-Dhahab (قصر الذهب ذو القبة الخضراء) */}
              <circle cx="0" cy="0" r="14" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="4" fill="#fbbf24" />

              {/* Four Main Gates Axes (أبواب بغداد الأربعة: الكوفة، البصرة، خراسان، الشام) */}
              {/* North-South Gate axis */}
              <line x1="0" y1="-72" x2="0" y2="72" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 2" />
              {/* East-West Gate axis */}
              <line x1="-72" y1="0" x2="72" y2="0" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 2" />

              {/* Gate Fortresses */}
              <rect x="-6" y="-74" width="12" height="8" fill="#f59e0b" rx="2" />
              <rect x="-6" y="66" width="12" height="8" fill="#f59e0b" rx="2" />
              <rect x="-74" y="-6" width="8" height="12" fill="#f59e0b" rx="2" />
              <rect x="66" y="-6" width="8" height="12" fill="#f59e0b" rx="2" />

              {/* Labels for Gates */}
              <text x="0" y="-80" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold">باب الشام</text>
              <text x="0" y="88" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold">باب البصرة</text>
              <text x="-85" y="3" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold">باب الكوفة</text>
              <text x="88" y="3" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold">باب خراسان</text>
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#0c4a6e" stroke="#facc15" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="serif">مدينة بغداد المدورة (مدينة السلام) ١٤٥هـ</text>
          </svg>
        </div>
      );
    }

    // الدرس الرابع: النهضة العلمية والحضارية وبيت الحكمة والمكتبات وحركة الترجمة
    case "HouseOfWisdom":
    case "Book": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyWisdom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2e1065" />
                <stop offset="100%" stopColor="#3b0764" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyWisdom)" />

            {/* Grand Library Bookcases (خزائن الكتب والمخطوطات في دار الحكمة) */}
            <g transform="translate(40, 50)">
              {/* Wooden Bookshelf */}
              <rect x="0" y="10" width="130" height="130" fill="#451a03" stroke="#78350f" strokeWidth="2" rx="3" />
              <line x1="0" y1="45" x2="130" y2="45" stroke="#78350f" strokeWidth="3" />
              <line x1="0" y1="85" x2="130" y2="85" stroke="#78350f" strokeWidth="3" />
              <line x1="0" y1="120" x2="130" y2="120" stroke="#78350f" strokeWidth="3" />
              {/* Row 1 Books */}
              <rect x="10" y="16" width="14" height="29" fill="#dc2626" />
              <rect x="26" y="18" width="12" height="27" fill="#2563eb" />
              <rect x="40" y="14" width="16" height="31" fill="#059669" />
              <rect x="58" y="19" width="14" height="26" fill="#d97706" />
              <rect x="74" y="15" width="15" height="30" fill="#7c3aed" />
              <rect x="91" y="20" width="12" height="25" fill="#e11d48" />
              <rect x="105" y="16" width="15" height="29" fill="#0891b2" />
              {/* Row 2 Books */}
              <rect x="10" y="52" width="16" height="33" fill="#ca8a04" />
              <rect x="28" y="55" width="14" height="30" fill="#4f46e5" />
              <rect x="44" y="50" width="18" height="35" fill="#16a34a" />
              <rect x="64" y="56" width="12" height="29" fill="#9333ea" />
              <rect x="78" y="52" width="15" height="33" fill="#ea580c" />
              <rect x="95" y="54" width="15" height="31" fill="#0284c7" />
            </g>

            {/* Translation Manuscript & Celestial Globe (حركة الترجمة والعلوم) */}
            <g transform="translate(190, 60)">
              {/* Open Parchment Scroll */}
              <path d="M20 100 C70 90, 110 110, 130 100 C150 110, 190 90, 240 100 L240 30 C190 20, 150 40, 130 30 C110 40, 70 20, 20 30 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
              <line x1="130" y1="30" x2="130" y2="100" stroke="#b45309" strokeWidth="2" />
              {/* Arabic Translation script */}
              <line x1="35" y1="45" x2="115" y2="45" stroke="#7c3aed" strokeWidth="2" />
              <line x1="35" y1="60" x2="105" y2="60" stroke="#7c3aed" strokeWidth="2" />
              <line x1="35" y1="75" x2="118" y2="75" stroke="#7c3aed" strokeWidth="2" />
              <line x1="35" y1="90" x2="100" y2="90" stroke="#7c3aed" strokeWidth="2" />

              <line x1="145" y1="45" x2="225" y2="45" stroke="#2563eb" strokeWidth="2" />
              <line x1="145" y1="60" x2="215" y2="60" stroke="#2563eb" strokeWidth="2" />
              <line x1="145" y1="75" x2="228" y2="75" stroke="#2563eb" strokeWidth="2" />
              <line x1="145" y1="90" x2="220" y2="90" stroke="#2563eb" strokeWidth="2" />

              {/* Inkpot with gold trim */}
              <rect x="220" y="110" width="26" height="30" rx="4" fill="#1e1b4b" stroke="#eab308" strokeWidth="2" />
              <circle cx="233" cy="110" r="5" fill="#eab308" />
              {/* Long Quill */}
              <path d="M233 110 Q260 50 275 30 Q258 60 238 105" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#2e1065" stroke="#c084fc" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold" fontFamily="serif">بيت الحكمة ببغداد وحركة الترجمة والعلوم</text>
          </svg>
        </div>
      );
    }

    // الدرس الخامس: سقوط الدولة العباسية وسقوط بغداد سنة ٦٥٦هـ / ١٢٥٨م
    case "FallOfBaghdad": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyFall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#450a0a" />
                <stop offset="60%" stopColor="#7f1d1d" />
                <stop offset="100%" stopColor="#18181b" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyFall)" />

            {/* Smoke & Destruction clouds */}
            <circle cx="150" cy="50" r="40" fill="#18181b" opacity="0.6" />
            <circle cx="230" cy="40" r="50" fill="#27272a" opacity="0.7" />
            <circle cx="320" cy="55" r="45" fill="#18181b" opacity="0.5" />

            {/* Flaming Walls of Baghdad (أسوار بغداد المتهاوية) */}
            <g transform="translate(60, 90)">
              <rect x="0" y="40" width="180" height="50" fill="#27272a" stroke="#71717a" strokeWidth="2" />
              <polygon points="40,40 60,10 80,40" fill="#dc2626" />
              <polygon points="120,40 140,15 160,40" fill="#ea580c" />
              {/* Flame tongues */}
              <path d="M50 40 Q55 20 60 10 Q65 25 70 40" fill="#facc15" />
              <path d="M130 40 Q135 25 140 15 Q145 28 150 40" fill="#facc15" />
            </g>

            {/* Tigris River with Floating Manuscripts (الكتب الملقاة في نهر دجلة) */}
            <path d="M0 170 Q250 155 500 175 L500 240 L0 240 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            {/* Floating Books in river */}
            <g transform="translate(260, 180) rotate(-15)">
              <rect x="0" y="0" width="30" height="20" rx="2" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
              <line x1="15" y1="0" x2="15" y2="20" stroke="#78350f" strokeWidth="1.5" />
            </g>
            <g transform="translate(340, 195) rotate(10)">
              <rect x="0" y="0" width="28" height="18" rx="2" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
              <line x1="14" y1="0" x2="14" y2="18" stroke="#78350f" strokeWidth="1.5" />
            </g>
            <g transform="translate(180, 190) rotate(5)">
              <rect x="0" y="0" width="32" height="22" rx="2" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold" fontFamily="serif">سقوط بغداد وغزو المغول ٦٥٦هـ / ١٢٥٨م</text>
          </svg>
        </div>
      );
    }

    // =========================================================================
    // الوحدة الثالثة: الدول الإسلامية المستقلة وممالك غرب إفريقيا
    // =========================================================================

    // الدرس الأول: الدول المستقلة بالمغرب (الأغالبة، الأدارسة، الفاطميون، المرابطون)
    case "MaghrebKingdoms":
    case "IslamicShip":
    case "Ship": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyMaghreb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#065f46" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyMaghreb)" />

            {/* Mediterranean Waves (البحر المتوسط وأسطول الأغالبة في فتح صقلية) */}
            <path d="M0 160 Q60 150 120 160 T240 160 T360 160 T480 160 L500 160 L500 240 L0 240 Z" fill="#0284c7" />
            <path d="M0 180 Q60 170 120 180 T240 180 T360 180 T480 180 L500 180 L500 240 L0 240 Z" fill="#0369a1" />

            {/* Islamic Dhow Warship (السفينة الحربية الإسلامية) */}
            <g transform="translate(100, 75)">
              {/* Wooden Hull */}
              <path d="M20 85 C60 100, 160 100, 200 85 C190 110, 30 110, 20 85 Z" fill="#78350f" stroke="#b45309" strokeWidth="2" />
              {/* Tall Central Mast */}
              <line x1="110" y1="88" x2="110" y2="15" stroke="#451a03" strokeWidth="4" />
              {/* Triangular Lateen Sail (الشراع المثلث الإسلامي) */}
              <polygon points="110,18 185,75 110,80" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
              {/* Islamic Green Crescent Flag on Mast */}
              <polygon points="110,15 85,22 110,30" fill="#10b981" />
              {/* Oars in Water */}
              <line x1="50" y1="90" x2="35" y2="115" stroke="#d97706" strokeWidth="2" />
              <line x1="75" y1="90" x2="60" y2="115" stroke="#d97706" strokeWidth="2" />
              <line x1="100" y1="90" x2="85" y2="115" stroke="#d97706" strokeWidth="2" />
              <line x1="125" y1="90" x2="110" y2="115" stroke="#d97706" strokeWidth="2" />
              <line x1="150" y1="90" x2="135" y2="115" stroke="#d97706" strokeWidth="2" />
              <line x1="175" y1="90" x2="160" y2="115" stroke="#d97706" strokeWidth="2" />
            </g>

            {/* Ribat Fortress & Keyhole Arches (رباط المنستير وقلعة القيروان) */}
            <g transform="translate(330, 60)">
              <rect x="0" y="30" width="130" height="75" fill="#fde047" opacity="0.9" stroke="#ca8a04" strokeWidth="2" rx="3" />
              {/* Horseshoe Arch (القوس المغاربي الأندلسي) */}
              <path d="M45 105 V70 A20 20 0 1 1 85 70 V105 Z" fill="#065f46" stroke="#ca8a04" strokeWidth="2" />
              {/* Watchtower */}
              <rect x="85" y="5" width="35" height="40" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
              <polygon points="85,5 102,-8 120,5" fill="#b45309" />
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#065f46" stroke="#6ee7b7" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold" fontFamily="serif">دول المغرب الإسلامي وأساطيل الأغالبة</text>
          </svg>
        </div>
      );
    }

    // الدرس الثاني: مملكة غانا الإسلامية وتجارة الذهب وعاصمة كومبي صالح
    case "GhanaKingdom": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyGhana" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="60%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyGhana)" />

            {/* Sahara Sand Dunes */}
            <path d="M0 160 Q150 130 300 160 T500 150 L500 240 L0 240 Z" fill="#f59e0b" opacity="0.9" />

            {/* Camel Caravan (قوافل تجارة الذهب والملح عبر الصحراء الكبرى) */}
            <g transform="translate(40, 115) scale(0.9)">
              {/* Camel 1 */}
              <ellipse cx="40" cy="35" rx="18" ry="11" fill="#78350f" />
              <circle cx="36" cy="22" r="8" fill="#78350f" /> {/* Hump */}
              <path d="M55 35 Q65 20 62 10 Q58 5 54 8" fill="none" stroke="#78350f" strokeWidth="4" />
              <line x1="30" y1="45" x2="26" y2="65" stroke="#78350f" strokeWidth="3" />
              <line x1="36" y1="45" x2="34" y2="65" stroke="#78350f" strokeWidth="3" />
              <line x1="46" y1="45" x2="44" y2="65" stroke="#78350f" strokeWidth="3" />
              <line x1="52" y1="45" x2="55" y2="65" stroke="#78350f" strokeWidth="3" />

              {/* Camel 2 */}
              <g transform="translate(70, 5) scale(0.85)">
                <ellipse cx="40" cy="35" rx="18" ry="11" fill="#78350f" />
                <circle cx="36" cy="22" r="8" fill="#78350f" />
                <path d="M55 35 Q65 20 62 10" fill="none" stroke="#78350f" strokeWidth="4" />
                <line x1="30" y1="45" x2="26" y2="65" stroke="#78350f" strokeWidth="3" />
                <line x1="36" y1="45" x2="34" y2="65" stroke="#78350f" strokeWidth="3" />
                <line x1="46" y1="45" x2="44" y2="65" stroke="#78350f" strokeWidth="3" />
                <line x1="52" y1="45" x2="55" y2="65" stroke="#78350f" strokeWidth="3" />
              </g>
              {/* Caravan Rope */}
              <path d="M50 35 Q85 45 110 38" stroke="#451a03" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
            </g>

            {/* Gold Balance Scale & Gold Nuggets (ميزان الذهب وتبر الذهب بغانا) */}
            <g transform="translate(270, 60)">
              {/* Balance Scale */}
              <line x1="90" y1="30" x2="90" y2="120" stroke="#fef08a" strokeWidth="3" />
              <line x1="40" y1="45" x2="140" y2="45" stroke="#fef08a" strokeWidth="3" />
              <circle cx="90" cy="30" r="5" fill="#fbbf24" />
              {/* Left Pan with Gold */}
              <line x1="40" y1="45" x2="25" y2="80" stroke="#fde047" strokeWidth="1.5" />
              <line x1="40" y1="45" x2="55" y2="80" stroke="#fde047" strokeWidth="1.5" />
              <ellipse cx="40" cy="80" rx="20" ry="6" fill="#ca8a04" stroke="#fef08a" strokeWidth="1.5" />
              {/* Gold Nuggets */}
              <circle cx="36" cy="76" r="4" fill="#fbbf24" />
              <circle cx="44" cy="75" r="5" fill="#facc15" />
              <circle cx="40" cy="71" r="4" fill="#fef08a" />

              {/* Right Pan with Salt Block (كتل الملح الصخري المقايض بالذهب) */}
              <line x1="140" y1="45" x2="125" y2="80" stroke="#fde047" strokeWidth="1.5" />
              <line x1="140" y1="45" x2="155" y2="80" stroke="#fde047" strokeWidth="1.5" />
              <ellipse cx="140" cy="80" rx="20" ry="6" fill="#ca8a04" stroke="#fef08a" strokeWidth="1.5" />
              <rect x="132" y="68" width="16" height="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#451a03" stroke="#facc15" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="serif">مملكة غانا (أرض الذهب) وتجارة الصحراء</text>
          </svg>
        </div>
      );
    }

    // الدرس الثالث: مملكة مالي ورحلة حج منسا موسى الذهبية ١٣٢٤م
    case "MaliEmpire":
    case "GoldMali":
    case "Scroll": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyMali" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="50%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyMali)" />

            {/* Desert Sun */}
            <circle cx="390" cy="65" r="32" fill="#fbbf24" opacity="0.85" className="animate-pulse" />

            {/* Golden Dunes */}
            <path d="M0 160 Q160 135 320 165 T500 155 L500 240 L0 240 Z" fill="#d97706" />

            {/* Mansa Musa Emperor Profile / Crown (إمبراطور مالي منسا موسى وحج ١٣٢٤م) */}
            <g transform="translate(60, 55)">
              {/* Royal Crown */}
              <polygon points="40,25 50,5 65,18 80,5 95,18 110,5 120,25" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
              <rect x="40" y="25" width="80" height="12" fill="#ca8a04" rx="2" />
              {/* Mansa Musa holding Gold Nugget & Sceptre */}
              <circle cx="80" cy="65" r="24" fill="#78350f" />
              {/* Golden Robe */}
              <path d="M40 125 C45 90, 115 90, 120 125 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
              {/* Gold Sceptre */}
              <line x1="125" y1="40" x2="125" y2="125" stroke="#fde047" strokeWidth="3.5" />
              <circle cx="125" cy="36" r="8" fill="#fbbf24" stroke="#ca8a04" />
            </g>

            {/* Golden Camel Train Carrying Tons of Gold (موكب الحج التاريخي المحمل بالذهب) */}
            <g transform="translate(210, 105)">
              {/* Camel with Gold Chest */}
              <ellipse cx="60" cy="40" rx="22" ry="14" fill="#92400e" />
              <circle cx="55" cy="24" r="10" fill="#92400e" />
              <path d="M80 40 Q92 20 88 8" fill="none" stroke="#92400e" strokeWidth="5" />
              <line x1="45" y1="52" x2="40" y2="78" stroke="#92400e" strokeWidth="3.5" />
              <line x1="55" y1="52" x2="52" y2="78" stroke="#92400e" strokeWidth="3.5" />
              <line x1="70" y1="52" x2="68" y2="78" stroke="#92400e" strokeWidth="3.5" />
              <line x1="80" y1="52" x2="84" y2="78" stroke="#92400e" strokeWidth="3.5" />

              {/* Gold Treasure Chest on Camel Back */}
              <rect x="45" y="16" width="28" height="18" rx="3" fill="#eab308" stroke="#78350f" strokeWidth="1.5" />
              <line x1="45" y1="24" x2="73" y2="24" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="59" cy="24" r="2.5" fill="#fef08a" />
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#451a03" stroke="#facc15" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="serif">مملكة مالي ورحلة حج منسا موسى ١٣٢٤م</text>
          </svg>
        </div>
      );
    }

    // الدرس الرابع: مملكة صنغي وأسكيا محمد وجامعة سنكوري بتمبكتو
    case "SonghaiEmpire": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skySonghai" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="60%" stopColor="#312e81" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skySonghai)" />

            {/* Mud-Brick Sankore Mosque / University Pyramid (جامعة وجامع سنكوري بتمبكتو) */}
            <g transform="translate(60, 45)">
              {/* Sankore Mud Pyramid Minaret with protruding wooden beams (تورن) */}
              <polygon points="100,20 60,135 140,135" fill="#b45309" stroke="#78350f" strokeWidth="2" />
              {/* Wooden protruding beams */}
              <line x1="88" y1="45" x2="112" y2="45" stroke="#451a03" strokeWidth="3" />
              <line x1="82" y1="65" x2="118" y2="65" stroke="#451a03" strokeWidth="3" />
              <line x1="75" y1="85" x2="125" y2="85" stroke="#451a03" strokeWidth="3" />
              <line x1="68" y1="105" x2="132" y2="105" stroke="#451a03" strokeWidth="3" />
              <line x1="62" y1="125" x2="138" y2="125" stroke="#451a03" strokeWidth="3" />
              {/* Ostrich egg top point */}
              <circle cx="100" cy="18" r="4" fill="#f8fafc" />
            </g>

            {/* University of Timbuktu Scholars & Manuscripts (علماء ومخطوطات تمبكتو) */}
            <g transform="translate(240, 60)">
              {/* Manuscript Scrolls Stack */}
              <rect x="20" y="80" width="160" height="20" rx="3" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
              <rect x="30" y="62" width="145" height="18" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
              <rect x="40" y="46" width="130" height="16" rx="3" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5" />
              {/* Timbuktu Arabic Seal */}
              <circle cx="100" cy="30" r="14" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
              <text x="100" y="34" textAnchor="middle" fill="#451a03" fontSize="8" fontWeight="bold">سنكوري</text>

              {/* Ink & Quill */}
              <rect x="185" y="70" width="22" height="30" rx="4" fill="#0f172a" stroke="#cbd5e1" />
              <path d="M196 70 Q215 25 230 10 Q218 30 200 65" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#c7d2fe" fontSize="11" fontWeight="bold" fontFamily="serif">مملكة صنغي وجامعة سنكوري بتمبكتو</text>
          </svg>
        </div>
      );
    }

    // =========================================================================
    // الوحدة الرابعة: النهضة الأوروبية والكشوف الجغرافية والثورة الصناعية
    // =========================================================================

    // الدرس الأول: عوامل قيام النهضة الأوروبية واختراع الطباعة والفنون
    case "RenaissanceArts":
    case "Palette": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyRen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#311042" />
                <stop offset="100%" stopColor="#4c1d95" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyRen)" />

            {/* Renaissance Cathedral Dome (كاتدرائية فلورنسا - برونليسكي) */}
            <g transform="translate(50, 45)">
              <rect x="20" y="90" width="130" height="50" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" rx="2" />
              {/* Grand Octagonal Dome */}
              <path d="M35 90 C35 30, 135 30, 135 90 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
              <line x1="85" y1="30" x2="85" y2="90" stroke="#c2410c" strokeWidth="1.5" />
              {/* Lantern on top */}
              <rect x="78" y="16" width="14" height="15" fill="#f8fafc" stroke="#64748b" />
              <circle cx="85" cy="12" r="3" fill="#eab308" />
            </g>

            {/* Gutenberg Printing Press (مطبعة غوتنبرغ وحروف الطباعة الرصاصية) */}
            <g transform="translate(210, 55)">
              <rect x="0" y="20" width="90" height="115" fill="#78350f" stroke="#451a03" strokeWidth="2" rx="3" />
              {/* Screw Press */}
              <line x1="45" y1="20" x2="45" y2="70" stroke="#cbd5e1" strokeWidth="5" />
              <line x1="20" y1="35" x2="70" y2="35" stroke="#d97706" strokeWidth="4" />
              {/* Printed Sheet */}
              <rect x="15" y="75" width="60" height="40" fill="#fef3c7" stroke="#b45309" />
              <line x1="22" y1="85" x2="68" y2="85" stroke="#000" strokeWidth="1.5" />
              <line x1="22" y1="95" x2="68" y2="95" stroke="#000" strokeWidth="1.5" />
              <line x1="22" y1="105" x2="58" y2="105" stroke="#000" strokeWidth="1.5" />
            </g>

            {/* Painter's Palette & Brushes (لوحة الفنون والألوان الزيتية) */}
            <g transform="translate(325, 60)">
              <path d="M40 85 C50 45, 120 40, 140 75 C160 100, 130 135, 100 135 C85 135, 80 120, 70 115 C55 110, 30 115, 40 85 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
              {/* Paint Dabs */}
              <circle cx="65" cy="70" r="7" fill="#ef4444" />
              <circle cx="95" cy="65" r="7" fill="#3b82f6" />
              <circle cx="120" cy="80" r="7" fill="#10b981" />
              <circle cx="115" cy="105" r="7" fill="#eab308" />
              <circle cx="85" cy="115" r="7" fill="#8b5cf6" />
              {/* Thumbhole */}
              <ellipse cx="65" cy="98" rx="6" ry="9" fill="#311042" />
              {/* Brush */}
              <line x1="120" y1="130" x2="160" y2="35" stroke="#78350f" strokeWidth="3" />
              <polygon points="160,35 163,28 157,32" fill="#ef4444" />
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#311042" stroke="#d8b4fe" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#f3e8ff" fontSize="11" fontWeight="bold" fontFamily="serif">عصر النهضة الأوروبية واختراع الطباعة والفنون</text>
          </svg>
        </div>
      );
    }

    // الدرس الثاني: حركة الكشوف الجغرافية الكبرى (ماجلان، كولمبس، فاسكو دا غاما)
    case "GeographicDiscoveries": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyGeo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#082f49" />
                <stop offset="100%" stopColor="#075985" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyGeo)" />

            {/* Ocean Waves */}
            <path d="M0 165 Q70 155 140 165 T280 165 T420 165 L500 165 L500 240 L0 240 Z" fill="#0284c7" />
            <path d="M0 185 Q70 175 140 185 T280 185 T420 185 L500 185 L500 240 L0 240 Z" fill="#0369a1" />

            {/* 15th-Century Caravel Sailing Ship (سفينة الكارافيل الاستكشافية) */}
            <g transform="translate(70, 60)">
              {/* Hull */}
              <path d="M20 95 C50 115, 170 115, 200 95 L190 70 L30 70 Z" fill="#78350f" stroke="#b45309" strokeWidth="2.5" />
              {/* High Stern Castle */}
              <rect x="150" y="45" width="40" height="25" fill="#92400e" stroke="#b45309" />
              {/* Masts */}
              <line x1="70" y1="80" x2="70" y2="15" stroke="#451a03" strokeWidth="3.5" />
              <line x1="130" y1="80" x2="130" y2="5" stroke="#451a03" strokeWidth="4" />
              {/* Square Sails with Red Cross (شراع صليب الاستكشاف الشهير) */}
              <rect x="45" y="25" width="50" height="40" fill="#f8fafc" rx="2" stroke="#cbd5e1" />
              <line x1="70" y1="28" x2="70" y2="62" stroke="#dc2626" strokeWidth="4" />
              <line x1="50" y1="45" x2="90" y2="45" stroke="#dc2626" strokeWidth="4" />

              <rect x="105" y="15" width="55" height="45" fill="#f8fafc" rx="2" stroke="#cbd5e1" />
              <line x1="132" y1="18" x2="132" y2="57" stroke="#dc2626" strokeWidth="4" />
              <line x1="110" y1="38" x2="155" y2="38" stroke="#dc2626" strokeWidth="4" />
            </g>

            {/* Giant Compass Rose (وردة البوصلة البحرية والاستكشاف) */}
            <g transform="translate(360, 110)">
              <circle cx="0" cy="0" r="42" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="0" cy="0" r="32" fill="none" stroke="#facc15" strokeWidth="1" strokeDasharray="3 2" />
              {/* North Arrow */}
              <polygon points="0,-38 7,-6 0,0 -7,-6" fill="#ef4444" stroke="#b91c1c" />
              {/* South Arrow */}
              <polygon points="0,38 7,6 0,0 -7,6" fill="#f8fafc" stroke="#64748b" />
              {/* East Arrow */}
              <polygon points="38,0 6,7 0,0 6,-7" fill="#f8fafc" stroke="#64748b" />
              {/* West Arrow */}
              <polygon points="-38,0 -6,7 0,0 -6,-7" fill="#f8fafc" stroke="#64748b" />
              <text x="0" y="-42" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">ش</text>
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#bae6fd" fontSize="11" fontWeight="bold" fontFamily="serif">حركة الكشوف الجغرافية الكبرى والبحارة</text>
          </svg>
        </div>
      );
    }

    // الدرس الثالث: الثورة الصناعية في إنجلترا وأوروبا والآلة البخارية
    case "SteamEngine":
    case "Lightbulb": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyInd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#18181b" />
                <stop offset="100%" stopColor="#3f3f46" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyInd)" />

            {/* Factory Chimneys with Billowing Steam (مصانع الثورة الصناعية) */}
            <g transform="translate(40, 45)">
              <polygon points="20,130 30,40 45,40 55,130" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />
              <polygon points="65,130 72,25 88,25 95,130" fill="#3f3f46" stroke="#71717a" strokeWidth="1.5" />
              {/* Puffy Steam */}
              <circle cx="40" cy="25" r="12" fill="#e4e4e7" opacity="0.7" />
              <circle cx="80" cy="12" r="16" fill="#e4e4e7" opacity="0.8" />
              <circle cx="105" cy="5" r="20" fill="#f4f4f5" opacity="0.6" />
            </g>

            {/* James Watt Steam Locomotive (قاطرة جيمس وات البخارية) */}
            <g transform="translate(180, 75)">
              {/* Train Cabin */}
              <rect x="0" y="30" width="75" height="60" fill="#18181b" rx="2" stroke="#52525b" strokeWidth="2" />
              <rect x="15" y="40" width="22" height="22" rx="2" fill="#38bdf8" />
              <rect x="45" y="40" width="22" height="22" rx="2" fill="#38bdf8" />
              {/* Boiler Barrel */}
              <rect x="75" y="45" width="110" height="45" rx="5" fill="#3f3f46" stroke="#71717a" strokeWidth="2" />
              {/* Funnel */}
              <rect x="150" y="20" width="18" height="25" fill="#09090b" stroke="#52525b" />
              {/* Big Wheels */}
              <circle cx="35" cy="100" r="18" fill="#09090b" stroke="#e4e4e7" strokeWidth="2.5" />
              <circle cx="35" cy="100" r="7" fill="#ea580c" />
              <circle cx="85" cy="100" r="18" fill="#09090b" stroke="#e4e4e7" strokeWidth="2.5" />
              <circle cx="85" cy="100" r="7" fill="#ea580c" />
              <circle cx="135" cy="100" r="18" fill="#09090b" stroke="#e4e4e7" strokeWidth="2.5" />
              <circle cx="135" cy="100" r="7" fill="#ea580c" />
              {/* Small front wheel */}
              <circle cx="185" cy="105" r="12" fill="#09090b" stroke="#e4e4e7" strokeWidth="2" />
              {/* Connecting Rod */}
              <line x1="35" y1="100" x2="135" y2="100" stroke="#f59e0b" strokeWidth="4" />
            </g>

            {/* Railroad Track (خطوط السكة الحديد) */}
            <g transform="translate(0, 190)">
              <line x1="0" y1="10" x2="500" y2="10" stroke="#a1a1aa" strokeWidth="3.5" />
              <line x1="0" y1="25" x2="500" y2="25" stroke="#a1a1aa" strokeWidth="3.5" />
              {/* Sleepers */}
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={i} x1={i * 32 + 10} y1="3" x2={i * 32 + 10} y2="32" stroke="#78350f" strokeWidth="3.5" />
              ))}
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#18181b" stroke="#fbbf24" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="serif">الثورة الصناعية والآلة البخارية لجيمس وات</text>
          </svg>
        </div>
      );
    }

    // =========================================================================
    // الوحدة الخامسة: جغرافية السودان والمواطنة والحكم المحلي
    // =========================================================================

    // الدرس الأول: موقع السودان وموارده الطبيعية والأنهار
    case "SudanGeography":
    case "HistoricSudanMap":
    case "Map": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyGeoSudan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyGeoSudan)" />

            {/* Sudan Geographic Landmass Outline */}
            <path d="M80 30 C160 20, 320 25, 420 40 C440 90, 450 150, 410 210 C320 225, 180 220, 90 200 C60 140, 60 70, 80 30 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="2" opacity="0.85" />

            {/* Red Sea Coast (ساحل البحر الأحمر) */}
            <path d="M380 35 C400 80, 425 130, 445 170" stroke="#0284c7" strokeWidth="6" />
            <text x="430" y="60" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">البحر الأحمر</text>

            {/* Nile Confluence (النيل الرئيسي، النيل الأزرق، النيل الأبيض) */}
            <path d="M260 30 Q250 65 250 95" stroke="#0284c7" strokeWidth="4" />
            {/* Blue Nile */}
            <path d="M250 95 Q290 140 330 190" stroke="#1d4ed8" strokeWidth="3.5" />
            {/* White Nile */}
            <path d="M250 95 Q235 150 230 215" stroke="#38bdf8" strokeWidth="3.5" />

            {/* Khartoum Confluence Marker */}
            <circle cx="250" cy="95" r="5" fill="#dc2626" stroke="#fff" strokeWidth="2" />
            <text x="215" y="94" fill="#991b1b" fontSize="11" fontWeight="bold">الخرطوم</text>

            {/* Major State Cities Markers */}
            <circle cx="290" cy="145" r="4" fill="#15803d" stroke="#fff" strokeWidth="1.5" />
            <text x="315" y="148" fill="#166534" fontSize="10" fontWeight="bold">سنار</text>

            <circle cx="170" cy="140" r="4" fill="#9333ea" stroke="#fff" strokeWidth="1.5" />
            <text x="140" y="142" fill="#7e22ce" fontSize="10" fontWeight="bold">الأبيض</text>

            <circle cx="115" cy="125" r="4" fill="#ea580c" stroke="#fff" strokeWidth="1.5" />
            <text x="105" y="115" fill="#c2410c" fontSize="10" fontWeight="bold">الفاشر</text>

            <circle cx="385" cy="115" r="4" fill="#0284c7" stroke="#fff" strokeWidth="1.5" />
            <text x="365" y="112" fill="#0369a1" fontSize="10" fontWeight="bold">بورتسودان</text>

            {/* Jebel Marra / Barkal Silhouette */}
            <g transform="translate(100, 160) scale(0.6)">
              <polygon points="10,50 35,10 60,50" fill="#78350f" stroke="#b45309" />
              <polygon points="40,50 65,20 90,50" fill="#92400e" stroke="#b45309" />
            </g>

            {/* Compass Rose */}
            <g transform="translate(440, 195) scale(0.65)">
              <circle cx="0" cy="0" r="22" fill="#fffbeb" stroke="#92400e" strokeWidth="2" />
              <polygon points="0,-20 5,-4 0,0 -5,-4" fill="#dc2626" />
              <polygon points="0,20 5,4 0,0 -5,4" fill="#1e293b" />
              <polygon points="20,0 4,5 0,0 4,-5" fill="#1e293b" />
              <polygon points="-20,0 -4,5 0,0 -4,-5" fill="#1e293b" />
              <text x="0" y="-24" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="bold">ش</text>
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold" fontFamily="serif">جغرافية السودان وموارده الطبيعية والأنهار</text>
          </svg>
        </div>
      );
    }

    // الدرس الثاني: هيكل الحكم المحلي والإدارة في السودان
    case "SudanLocalGovernance": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyGov" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#312e81" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyGov)" />

            {/* Governance Council Building (مبنى إدارة الحكم المحلي والمجالس الشعبية) */}
            <g transform="translate(60, 50)">
              <rect x="10" y="45" width="160" height="65" fill="#f8fafc" rx="3" stroke="#cbd5e1" strokeWidth="2" />
              <polygon points="10,45 90,15 170,45" fill="#1e3a8a" />
              {/* Pillars */}
              <line x1="30" y1="45" x2="30" y2="110" stroke="#64748b" strokeWidth="4" />
              <line x1="60" y1="45" x2="60" y2="110" stroke="#64748b" strokeWidth="4" />
              <line x1="120" y1="45" x2="120" y2="110" stroke="#64748b" strokeWidth="4" />
              <line x1="150" y1="45" x2="150" y2="110" stroke="#64748b" strokeWidth="4" />
              {/* Main Doorway */}
              <path d="M75 110 V75 A15 15 0 0 1 105 75 V110 Z" fill="#0f172a" />
            </g>

            {/* Decentralized State Structure & Balance of Justice (هيكل الحكم المحلي وميزان العدالة) */}
            <g transform="translate(260, 55)">
              {/* State & Locality Hierarchy Boxes */}
              <rect x="30" y="10" width="140" height="26" rx="4" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
              <text x="100" y="27" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">حكومة الولاية والوالي</text>

              <line x1="100" y1="36" x2="100" y2="50" stroke="#facc15" strokeWidth="2" />

              <rect x="30" y="50" width="140" height="26" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="100" y="67" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">المحلية والمدير التنفيذي</text>

              <line x1="100" y1="76" x2="100" y2="90" stroke="#facc15" strokeWidth="2" />

              <rect x="30" y="90" width="140" height="26" rx="4" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="100" y="107" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">المجالس الشعبية والأحياء</text>
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="serif">النظام الإداري وهيكل الحكم المحلي</text>
          </svg>
        </div>
      );
    }

    // الدرس الثالث: رموز السيادة الوطنية والدستور (علم وشعار ودستور السودان)
    case "NationalSovereignty": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skySov" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skySov)" />

            {/* Sudanese National Flag (علم السودان الوطني ذو الألوان الأربعة) */}
            <g transform="translate(70, 50)">
              {/* Flagpole */}
              <line x1="20" y1="140" x2="20" y2="10" stroke="#d97706" strokeWidth="4" />
              <circle cx="20" cy="8" r="4" fill="#fbbf24" />
              {/* 3 Horizontal Bands: Red, White, Black */}
              <rect x="20" y="15" width="130" height="22" fill="#dc2626" />
              <rect x="20" y="37" width="130" height="22" fill="#ffffff" />
              <rect x="20" y="59" width="130" height="22" fill="#000000" />
              {/* Green Triangle on hoist */}
              <polygon points="20,15 75,48 20,81" fill="#16a34a" />
              {/* Outer Border */}
              <rect x="20" y="15" width="130" height="66" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
            </g>

            {/* National Crest - Secretary Bird (شعار صقر الجديان والدستور) */}
            <g transform="translate(260, 45)">
              {/* Shield Crest */}
              <path d="M40 20 Q100 10 160 20 Q160 85 100 130 Q40 85 40 20 Z" fill="#1e1b4b" stroke="#eab308" strokeWidth="2.5" />
              {/* Secretary Bird silhouette emblem */}
              <path d="M100 35 Q115 50 100 75 Q85 50 100 35" fill="#facc15" />
              {/* Wings */}
              <path d="M60 55 Q100 40 100 75 Q100 40 140 55 Q110 90 100 80 Q90 90 60 55 Z" fill="#eab308" />
              {/* Banner Ribbon below crest */}
              <rect x="55" y="95" width="90" height="18" rx="4" fill="#dc2626" stroke="#facc15" strokeWidth="1" />
              <text x="100" y="108" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">جمهورية السودان</text>
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#1e293b" stroke="#22c55e" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="bold" fontFamily="serif">رموز السيادة الوطنية والدستور</text>
          </svg>
        </div>
      );
    }

    // الدرس الرابع: المواطنة وحقوق وواجبات المواطن والسلام
    case "Citizenship":
    case "CivicRights":
    case "Heart": {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyCit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#881337" />
                <stop offset="60%" stopColor="#9f1239" />
                <stop offset="100%" stopColor="#4c0519" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyCit)" />

            {/* Beating Heart of National Unity (قلب الوحدة والتآخي الوطني) */}
            <g transform="translate(180, 50)">
              <path d="M70 120 C20 75, -10 40, -10 15 C-10 -10, 10 -20, 35 -20 C50 -20, 65 -10, 70 0 C75 -10, 90 -20, 105 -20 C130 -20, 150 -10, 150 15 C150 40, 120 75, 70 120 Z" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="3" className="animate-pulse" />
            </g>

            {/* Peace Dove with Olive Branch (حمامة السلام وغصن الزيتون) */}
            <g transform="translate(90, 65)">
              <path d="M40 45 C55 25, 80 15, 105 25 C120 35, 130 55, 115 70 C100 80, 80 75, 65 65 C55 75, 35 75, 25 60 C35 55, 40 45, 40 45 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              {/* Eye & Beak */}
              <circle cx="118" cy="40" r="2.5" fill="#0f172a" />
              <polygon points="122,42 132,45 122,48" fill="#f59e0b" />
              {/* Olive Branch in Beak */}
              <path d="M125 45 Q140 35 150 42" stroke="#16a34a" strokeWidth="2" fill="none" />
              <ellipse cx="138" cy="38" rx="4" ry="2" fill="#22c55e" />
              <ellipse cx="148" cy="42" rx="4" ry="2" fill="#22c55e" />
            </g>

            {/* Diverse United Hands (تلاحم الأيدي والمواطنة المتساوية) */}
            <g transform="translate(300, 75)">
              <rect x="20" y="30" width="130" height="40" rx="20" fill="#ffffff" stroke="#e11d48" strokeWidth="2" />
              <text x="85" y="55" textAnchor="middle" fill="#be123c" fontSize="12" fontWeight="bold" fontFamily="serif">المواطنة والسلام</text>
            </g>

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#881337" stroke="#f43f5e" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#ffe4e6" fontSize="11" fontWeight="bold" fontFamily="serif">حقوق وواجبات المواطنة والوحدة الوطنية</text>
          </svg>
        </div>
      );
    }

    // أهرامات مروي والبجراوية وتاريخ كوش القديم
    case "SudanPyramids":
    case "Phone":
    default: {
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 500 240" className="w-full h-full max-h-48" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skyPyr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="60%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            <rect width="500" height="240" rx="12" fill="url(#skyPyr)" />

            {/* Glowing Desert Sun */}
            <circle cx="340" cy="70" r="34" fill="#fef08a" opacity="0.85" className="animate-pulse" />

            {/* Sand Dunes */}
            <path d="M0 160 Q150 135 300 165 T500 155 L500 240 L0 240 Z" fill="#d97706" />

            {/* Pyramids of Meroë (أهرامات البجراوية الحادة بالزاوية المميزة) */}
            <g transform="translate(90, 70)">
              {/* Pyramid 1 (Main Meroë Pyramid with Chapel Entrance) */}
              <polygon points="120,110 160,20 200,110" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
              <polygon points="160,20 200,110 160,110" fill="#f59e0b" opacity="0.7" />
              {/* Chapel Entrance Pylon */}
              <rect x="185" y="85" width="22" height="25" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
              <path d="M190 110 V95 A6 6 0 0 1 202 95 V110 Z" fill="#451a03" />

              {/* Pyramid 2 (Mid-size) */}
              <polygon points="60,110 95,40 130,110" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" opacity="0.9" />
              <polygon points="95,40 130,110 95,110" fill="#f59e0b" opacity="0.6" />

              {/* Pyramid 3 (Distant small) */}
              <polygon points="210,110 235,55 260,110" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" opacity="0.75" />
            </g>

            {/* Nile River Curve in Foreground */}
            <path d="M0 195 Q140 180 250 205 T500 195 L500 240 L0 240 Z" fill="#0284c7" />

            {/* Header Badge */}
            <rect x="120" y="14" width="260" height="26" rx="13" fill="#451a03" stroke="#facc15" strokeWidth="1.5" opacity="0.95" />
            <text x="250" y="32" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="serif">أهرامات مروي (البجراوية) والتراث السوداني</text>
          </svg>
        </div>
      );
    }
  }
};
