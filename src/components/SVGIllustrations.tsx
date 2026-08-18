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
  // Common container with vintage border shadow
  const containerClass = `relative overflow-hidden rounded-xl bg-amber-50/60 p-4 border border-amber-100 flex items-center justify-center ${className}`;

  switch (type) {
    case "SudanPyramids":
    case "Phone": { // Sudan History - Pyramids of Meroe / Nile Navigation
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 400 200" className="w-full h-full text-amber-700 max-h-40" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Sun in background */}
            <circle cx="200" cy="80" r="45" strokeDasharray="4 4" className="animate-[spin_40s_linear_infinite]" fill="#FEF3C7" />
            <path d="M50 170 h300" strokeWidth="3" />
            {/* Pyramids */}
            <polygon points="120,170 170,80 220,170" fill="#FDE68A" />
            <polygon points="170,170 200,105 230,170" fill="#FCD34D" opacity="0.8" />
            <polygon points="70,170 110,110 150,170" fill="#FEF3C7" opacity="0.6" />
            {/* The Nile River */}
            <path d="M50 170 C120 170, 180 185, 250 175 C310 167, 340 185, 380 180" stroke="#60A5FA" strokeWidth="4" />
            {/* Small traditional Nile boat */}
            <path d="M260 171 c10 -3, 25 -3, 35 0 c1 3, -5 6, -15 6 s-19 -3, -20 -6 Z" fill="#92400E" />
            <line x1="278" y1="171" x2="278" y2="150" />
            <polygon points="278,150 295,158 278,165" fill="#F8FAFC" />
          </svg>
        </div>
      );
    }

    case "HistoricSudanMap":
    case "Map": { // Sudan Historical Map showing Nile, Blue Nile, White Nile, Khartoum, Sennar, Shendi, Darfur, Kordofan
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 400 200" className="w-full h-full text-emerald-800 max-h-40" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Background landmass shading */}
            <path d="M60 20 C120 15, 260 20, 340 30 C350 70, 360 120, 330 180 C260 190, 140 185, 70 170 C50 120, 45 60, 60 20 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" opacity="0.7" />
            
            {/* Red Sea Coast */}
            <path d="M300 20 C320 60, 340 100, 360 140" stroke="#0284C7" strokeWidth="4" />
            <text x="345" y="45" textAnchor="middle" className="text-[9px] font-bold" stroke="none" fill="#0369A1">البحر الأحمر</text>

            {/* Main Nile River with confluence */}
            <path d="M210 20 Q200 45 200 70" stroke="#3B82F6" strokeWidth="3" />
            {/* Blue Nile heading southeast */}
            <path d="M200 70 Q230 110 260 160" stroke="#2563EB" strokeWidth="2.5" />
            {/* White Nile heading south */}
            <path d="M200 70 Q190 120 185 180" stroke="#60A5FA" strokeWidth="2.5" />

            {/* Historic Cities markers */}
            {/* Khartoum (Confluence) */}
            <circle cx="200" cy="70" r="4" fill="#DC2626" stroke="#FEF2F2" strokeWidth="1.5" />
            <text x="170" y="68" textAnchor="middle" className="text-[10px] font-extrabold" stroke="none" fill="#991B1B">الخرطوم</text>

            {/* Sennar (Blue Nile) */}
            <circle cx="230" cy="115" r="3.5" fill="#15803D" stroke="#FEF2F2" strokeWidth="1" />
            <text x="255" y="118" textAnchor="middle" className="text-[9px] font-bold" stroke="none" fill="#166534">سنار</text>

            {/* Shendi */}
            <circle cx="205" cy="45" r="3" fill="#D97706" stroke="#FEF2F2" strokeWidth="1" />
            <text x="225" y="45" textAnchor="middle" className="text-[9px] font-bold" stroke="none" fill="#B45309">شندي</text>

            {/* El Obeid (Kordofan) */}
            <circle cx="140" cy="110" r="3" fill="#9333EA" stroke="#FEF2F2" strokeWidth="1" />
            <text x="110" y="112" textAnchor="middle" className="text-[9px] font-bold" stroke="none" fill="#7E22CE">الأبيض</text>

            {/* El Fasher (Darfur) */}
            <circle cx="90" cy="95" r="3" fill="#EA580C" stroke="#FEF2F2" strokeWidth="1" />
            <text x="80" y="85" textAnchor="middle" className="text-[9px] font-bold" stroke="none" fill="#C2410C">الفاشر</text>

            {/* Compass Rose */}
            <g transform="translate(350, 160) scale(0.6)">
              <circle cx="0" cy="0" r="20" fill="#FFFBEB" stroke="#92400E" strokeWidth="1.5" />
              <polygon points="0,-18 5,-4 0,0 -5,-4" fill="#DC2626" />
              <polygon points="0,18 5,4 0,0 -5,4" fill="#1E293B" />
              <polygon points="18,0 4,5 0,0 4,-5" fill="#1E293B" />
              <polygon points="-18,0 -4,5 0,0 -4,-5" fill="#1E293B" />
              <text x="0" y="-22" textAnchor="middle" className="text-[10px] font-bold" stroke="none" fill="#DC2626">ش</text>
            </g>
          </svg>
        </div>
      );
    }

    case "KhartoumCpt":
    case "Building": { // Khartoum as capital, government departments
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 400 200" className="w-full h-full text-emerald-800 max-h-40" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Clouds */}
            <path d="M50 50 Q75 35 100 50 Q110 35 125 50" opacity="0.4" />
            <path d="M280 40 Q305 25 330 40 Q340 25 355 40" opacity="0.4" />
            
            {/* Palace representation */}
            <rect x="100" y="110" width="200" height="70" fill="#E2E8F0" rx="3" />
            <line x1="100" y1="135" x2="300" y2="135" />
            {/* Pillars */}
            <line x1="120" y1="135" x2="120" y2="180" />
            <line x1="150" y1="135" x2="150" y2="180" />
            <line x1="180" y1="135" x2="180" y2="180" />
            <line x1="220" y1="135" x2="220" y2="180" />
            <line x1="250" y1="135" x2="250" y2="180" />
            <line x1="280" y1="135" x2="280" y2="180" />
            {/* Dome on top */}
            <path d="M170 110 A30 30 0 0 1 230 110 Z" fill="#10B981" />
            {/* Flagpole and Flag */}
            <line x1="200" y1="80" x2="200" y2="60" strokeWidth="3" />
            <polygon points="200,60 225,67 200,75" fill="#EF4444" />
            {/* Nile background */}
            <path d="M20 185 h360" strokeWidth="3" />
            <path d="M20 190 Q90 193 170 191 Q270 188 380 192" stroke="#3B82F6" strokeWidth="2" />
          </svg>
        </div>
      );
    }

    case "BaghdadRound":
    case "Tower": { // Unit 2: Baghdad Round City or Minaret
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 400 200" className="w-full h-full text-sky-800 max-h-40" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Starry Night Sky backgrounds */}
            <circle cx="50" cy="50" r="1" fill="#BAE6FD" />
            <circle cx="120" cy="30" r="1.5" fill="#BAE6FD" />
            <circle cx="280" cy="40" r="1" fill="#BAE6FD" />
            <circle cx="340" cy="60" r="2" fill="#BAE6FD" />
            {/* Crescent moon */}
            <path d="M300 40 A15 15 0 1 0 315 25 A12 12 0 1 1 300 40" fill="#F1F5F9" />

            {/* Concentric Circle city representation */}
            <circle cx="200" cy="110" r="70" strokeWidth="3" fill="#F0F9FF" opacity="0.4" />
            <circle cx="200" cy="110" r="45" strokeWidth="2" />
            <circle cx="200" cy="110" r="15" fill="#38BDF8" /> {/* Qasr Al-Dhahab */}
            
            {/* Major Gates lines */}
            <line x1="200" y1="40" x2="200" y2="180" strokeDasharray="3 3" /> {/* North-South gates */}
            <line x1="130" y1="110" x2="270" y2="110" strokeDasharray="3 3" /> {/* East-West gates */}

            {/* Little dome houses along the circular path */}
            <path d="M125 110 h10 v-8 a5 5 0 0 0 -10 0 Z" fill="#BAE6FD" />
            <path d="M265 110 h10 v-8 a5 5 0 0 0 -10 0 Z" fill="#BAE6FD" />
            <path d="M195 40 h10 v-8 a5 5 0 0 0 -10 0 Z" fill="#BAE6FD" />
            <path d="M195 180 h10 v-8 a5 5 0 0 0 -10 0 Z" fill="#BAE6FD" />
            
            {/* Labels in Arabic */}
            <text x="200" y="100" textAnchor="middle" className="text-[10px] font-bold" stroke="none" fill="#0369A1">قصر الذهب</text>
          </svg>
        </div>
      );
    }

    case "HouseOfWisdom":
    case "Book": { // Unit 2: House of Wisdom (بيت الحكمة) & Manuscripts
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 400 200" className="w-full h-full text-indigo-800 max-h-40" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Opened vintage scroll / book */}
            <path d="M60 160 C120 150, 180 180, 200 170 C220 180, 280 150, 340 160 v-110 C280 40, 220 70, 200 60 C180 70, 120 40, 60 50 Z" fill="#FFFBEB" strokeWidth="2" />
            <line x1="200" y1="60" x2="200" y2="170" strokeWidth="2" />
            
            {/* Arabic dummy script lines in book */}
            <line x1="80" y1="80" x2="170" y2="80" stroke="#A78BFA" strokeWidth="2" />
            <line x1="80" y1="105" x2="160" y2="105" stroke="#A78BFA" strokeWidth="2" />
            <line x1="80" y1="130" x2="175" y2="130" stroke="#A78BFA" strokeWidth="2" />

            <line x1="230" y1="80" x2="320" y2="80" stroke="#818CF8" strokeWidth="2" />
            <line x1="230" y1="105" x2="310" y2="105" stroke="#818CF8" strokeWidth="2" />
            <line x1="230" y1="130" x2="325" y2="130" stroke="#818CF8" strokeWidth="2" />

            {/* Traditional ink pot and feather quill */}
            <rect x="345" y="120" width="20" height="35" rx="2" fill="#E2E8F0" />
            <line x1="355" y1="120" x2="355" y2="140" />
            <path d="M355 120 C340 90, 310 80, 290 85" strokeWidth="1.5" className="animate-[wiggle_4s_ease-in-out_infinite]" />
            <path d="M290 85 l5 8" />
          </svg>
        </div>
      );
    }

    case "IslamicShip":
    case "Ship":
    case "Compass": { // Unit 3: Islamic Kingdoms (Agilabids, sicily invasion)
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 400 200" className="w-full h-full text-emerald-800 max-h-40" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Ocean Waves */}
            <path d="M10 180 Q40 173 70 180 T130 180 T190 180 T250 180 T310 180 T370 180" stroke="#34D399" strokeWidth="3" className="animate-[pulse_2s_infinite]" />
            <path d="M20 188 Q60 181 100 188 T180 188 T260 188 T340 188" stroke="#059669" strokeWidth="2" />
            
            {/* The Ship (Dhow/Galley) */}
            <path d="M100 145 c40 0, 160 0, 180 -18 c-10 25, -165 25, -180 18 Z" fill="#78350F" />
            
            {/* Tall Mast and Sails */}
            <line x1="180" y1="135" x2="180" y2="40" strokeWidth="4" />
            {/* Lateen triangular sail */}
            <polygon points="180,45 250,110 180,120 M180,55 235,110" fill="#ECFDF5" opacity="0.9" />
            
            {/* Islamic flag on sailboat mast */}
            <polygon points="180,40 160,47 180,54" fill="#10B981" />
            
            {/* Oars along the side */}
            <line x1="120" y1="145" x2="110" y2="165" />
            <line x1="140" y1="145" x2="130" y2="165" />
            <line x1="160" y1="145" x2="150" y2="165" />
            <line x1="200" y1="145" x2="190" y2="165" />
            <line x1="220" y1="145" x2="210" y2="165" />
            <line x1="240" y1="145" x2="230" y2="165" />
          </svg>
        </div>
      );
    }

    case "GoldMali":
    case "Scroll": { // West African Kingdoms, Mali Caravan
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 400 200" className="w-full h-full text-yellow-800 max-h-40" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Sand dunes */}
            <path d="M10 180 Q80 150 165 170 T310 160 T390 180" stroke="#F59E0B" strokeWidth="2" fill="#FEF3C7" opacity="0.6" />
            <path d="M30 185 Q110 165 195 180 T350 170" stroke="#D97706" strokeWidth="1" fill="#FDE68A" opacity="0.4" />
            <line x1="10" y1="180" x2="390" y2="180" strokeWidth="3" />

            {/* Caravan of camels (simplified silhouettes) */}
            {/* Camel 1 */}
            <g transform="translate(100, 120)">
              <ellipse cx="25" cy="20" rx="12" ry="7" fill="#D97706" />
              {/* neck & head */}
              <path d="M37 20 c5 -10, 8 -7, 6 -15 l-3 -2" fill="none" stroke="#D97706" strokeWidth="3" />
              {/* hump */}
              <circle cx="23" cy="11" r="5" fill="#D97706" />
              {/* legs */}
              <line x1="18" y1="26" x2="16" y2="38" strokeWidth="2" />
              <line x1="22" y1="26" x2="21" y2="38" strokeWidth="2" />
              <line x1="30" y1="26" x2="29" y2="38" strokeWidth="2" />
              <line x1="33" y1="26" x2="35" y2="38" strokeWidth="2" />
            </g>

            {/* Camel 2 */}
            <g transform="translate(170, 125) scale(0.85)">
              <ellipse cx="25" cy="20" rx="12" ry="7" fill="#D97706" />
              <path d="M37 20 c5 -10, 8 -7, 6 -15 l-3 -2" fill="none" stroke="#D97706" strokeWidth="3" />
              <circle cx="23" cy="11" r="5" fill="#D97706" />
              <line x1="18" y1="26" x2="16" y2="38" strokeWidth="2" />
              <line x1="22" y1="26" x2="21" y2="38" strokeWidth="2" />
              <line x1="30" y1="26" x2="29" y2="38" strokeWidth="2" />
              <line x1="33" y1="26" x2="35" y2="38" strokeWidth="2" />
            </g>

            {/* Rope connecting them */}
            <path d="M140 142 C150 148, 160 148, 172 144" stroke="#92400E" strokeDasharray="2 2" />

            {/* Big Sun */}
            <circle cx="300" cy="70" r="28" fill="#FBBF24" opacity="0.9" />
          </svg>
        </div>
      );
    }

    case "RenaissanceArts":
    case "Palette": { // Unit 4: Renaissance Art and Sculpture (Mona Lisa palette, Cathedral)
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 400 200" className="w-full h-full text-indigo-700 max-h-40" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Dome outline (Santa Maria del Fiore / St. Peter) */}
            <path d="M220 180 h100 v-20 c0 -40, -100 -40, -100 0 v20 Z" fill="#F1F5F9" strokeWidth="2" />
            <path d="M270 110 v50" />
            <path d="M250 120 v40" />
            <path d="M290 120 v40" />
            <circle cx="270" cy="110" r="10" fill="#E6C200" />
            <line x1="270" y1="100" x2="270" y2="90" strokeWidth="3" />
            
            {/* Painter's Palette foreground */}
            <path d="M40 130 c10 -40, 80 -45, 120 -10 c30 25, 10 55, -20 55 c-15 0, -10 -15, -20 -20 c-15 -5, -45 5, -70 -15 c-5 -5, -15 -5, -10 -10 Z" fill="#FFFBEB" strokeWidth="2.5" />
            {/* Paint drops */}
            <circle cx="70" cy="115" r="7" fill="#EF4444" stroke="none" />
            <circle cx="100" cy="120" r="7" fill="#3B82F6" stroke="none" />
            <circle cx="120" cy="140" r="7" fill="#10B981" stroke="none" />
            <circle cx="95" cy="155" r="7" fill="#F59E0B" stroke="none" />
            <circle cx="140" cy="115" r="5" fill="#EF4444" stroke="none" />
            {/* Brush handle */}
            <path d="M125 150 l45 35 c4 4, 10 1, 8 -3 l-13 -35" fill="#78350F" />
          </svg>
        </div>
      );
    }

    case "SteamEngine":
    case "Lightbulb": { // Industrial Revolution - Steam Engine / Train
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 400 200" className="w-full h-full text-zinc-800 max-h-40" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Tracks */}
            <line x1="20" y1="170" x2="380" y2="170" strokeWidth="3" />
            <line x1="50" y1="170" x2="35" y2="185" strokeWidth="2" />
            <line x1="100" y1="170" x2="85" y2="185" strokeWidth="2" />
            <line x1="150" y1="170" x2="135" y2="185" strokeWidth="2" />
            <line x1="200" y1="170" x2="185" y2="185" strokeWidth="2" />
            <line x1="250" y1="170" x2="235" y2="185" strokeWidth="2" />
            <line x1="300" y1="170" x2="285" y2="185" strokeWidth="2" />
            <line x1="350" y1="170" x2="335" y2="185" strokeWidth="2" />

            {/* Train Cabin */}
            <rect x="75" y="85" width="85" height="55" fill="#D1D5DB" />
            {/* Windows */}
            <rect x="90" y="95" width="20" height="20" rx="2" fill="#FFF" />
            <rect x="125" y="95" width="20" height="20" rx="2" fill="#FFF" />

            {/* Boiler barrel */}
            <rect x="160" y="95" width="120" height="45" rx="3" fill="#9CA3AF" />
            {/* Chimney smoke pipe */}
            <rect x="240" y="70" width="20" height="25" fill="#4B5563" />
            {/* Piston mechanism */}
            <line x1="200" y1="140" x2="260" y2="140" strokeWidth="3" />
            
            {/* Big wheels */}
            <circle cx="110" cy="150" r="20" fill="#374151" />
            <circle cx="110" cy="150" r="10" fill="#FFF" />
            <circle cx="170" cy="150" r="20" fill="#374151" />
            <circle cx="170" cy="150" r="10" fill="#FFF" />
            <circle cx="230" cy="150" r="20" fill="#374151" />
            <circle cx="230" cy="150" r="10" fill="#FFF" />
            
            {/* Small front wheel */}
            <circle cx="290" cy="155" r="12" fill="#4B5563" />

            {/* Puffy Steam clouds */}
            <path d="M255 55 Q270 40 285 52 Q300 37 315 50 Q310 65 295 62 Z" fill="#F3F4F6" opacity="0.85" className="animate-[bounce_3s_infinite]" />
            <path d="M280 40 Q290 27 305 35 Q320 22 335 34" fill="none" stroke="#E5E7EB" strokeWidth="3" />
          </svg>
        </div>
      );
    }

    case "Citizenship":
    case "Heart": { // Civics - Handshake / Flag / Globe
      return (
        <div className={containerClass}>
          <svg viewBox="0 0 400 200" className="w-full h-full text-rose-700 max-h-40" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Sudanese outline/emblem representation */}
            {/* Giant beating heart of unity */}
            <path d="M200,160 C150,110 110,80 110,50 C110,25 130,5 155,5 C175,5 190,15 200,25 C210,15 225,5 245,5 C270,5 290,25 290,50 C290,80 250,110 200,160 Z" fill="#FFE4E6" strokeWidth="3" className="animate-[pulse_1.5s_infinite]" />
            
            {/* Flags crossing behind */}
            {/* Flag 1 flagpole */}
            <line x1="120" y1="160" x2="280" y2="40" strokeWidth="3" stroke="#92400E" />
            <polygon points="240,70 270,50 250,90" fill="#10B981" /> {/* Green flag */}
            
            {/* Flag 2 flagpole */}
            <line x1="280" y1="160" x2="120" y2="40" strokeWidth="3" stroke="#92400E" />
            <polygon points="160,70 130,50 150,90" fill="#3B82F6" /> {/* Blue/White/Yellow flag */}

            {/* United hands handshake */}
            <rect x="150" y="115" width="100" height="30" rx="15" fill="#FFF" strokeWidth="2.5" />
            <text x="200" y="135" textAnchor="middle" className="text-xs font-bold" stroke="none" fill="#E11D48">سوداننا الحبيب</text>
          </svg>
        </div>
      );
    }

    default: {
      return (
        <div className={containerClass}>
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center border border-amber-200">
            <span className="text-amber-700 text-3xl font-serif">؟</span>
          </div>
        </div>
      );
    }
  }
};
