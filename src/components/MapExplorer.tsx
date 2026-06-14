/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { HISTORIC_CITIES } from "../data";
import { playSound } from "./SoundEffects";
import { MapPin, Award, Check, X, HelpCircle, Compass, Layers, RotateCcw } from "lucide-react";

interface MapExplorerProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onUnlockBadge: (badgeId: string) => void;
}

// Helper coordinate position tweaks to prevent map labels overlaying on each other
const getLabelPlacementClasses = (cityName: string) => {
  switch (cityName) {
    case "الخرطوم":
      return "left-7 top-1/2 -translate-y-1/2 whitespace-nowrap";
    case "كلوة":
      return "right-7 top-1/2 -translate-y-1/2 whitespace-nowrap";
    case "شندي":
      return "bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap";
    case "بغداد":
      return "bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap";
    default:
      return "top-7 left-1/2 -translate-x-1/2 whitespace-nowrap";
  }
};

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

  // Map settings
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [mapStyle, setMapStyle] = useState<"osm" | "satellite" | "voyager" | "dark">("voyager");
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Map styling choices dictionary
  const mapLayers = [
    { id: "voyager", label: "خريطة الألوان الأثرية", icon: Layers },
    { id: "osm", label: "خرائط الحدود السياسية", icon: Compass },
    { id: "satellite", label: "خريطة القمر الصناعي", icon: Layers },
    { id: "dark", label: "خرائط الفضاء الداكنة", icon: Layers }
  ] as const;

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

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create Leaflet instance centered at geographic centroid of the studied kingdoms
    const map = L.map(mapRef.current, {
      center: [20.0, 20.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 13,
      zoomControl: false, // Customized controls on right bottom instead
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);
    leafletMapRef.current = map;
    setMapInstance(map);

    // Initial tile layer setup
    const layer = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 18,
    }).addTo(map);
    tileLayerRef.current = layer;

    // Map resize handling
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapRef.current) {
      resizeObserver.observe(mapRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update Tile Layers when Style toggles
  useEffect(() => {
    if (!mapInstance) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    let tileUrl = "";
    let attribution = "";

    switch (mapStyle) {
      case "osm":
        tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        break;
      case "satellite":
        tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        attribution = "Tiles &copy; Esri &mdash; Source: Esri Shaded Imagery";
        break;
      case "dark":
        tileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
        attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
        break;
      case "voyager":
      default:
        tileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
        attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
        break;
    }

    const layer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 18,
    }).addTo(mapInstance);

    tileLayerRef.current = layer;
  }, [mapInstance, mapStyle]);

  const handleCitySelect = (city: typeof HISTORIC_CITIES[0]) => {
    playSound("click");
    setSelectedCity(city);
    setUserAnswer(null);
    setQuizResult(null);
    setCurrentCityQuestion(cityQuizzes[city.name] || null);

    // Animate map transition to center selected city beautifully
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([city.lat, city.lng], 5, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  // Populate Interactive Markers dynamically on Map Instance matching React State
  useEffect(() => {
    if (!mapInstance) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    HISTORIC_CITIES.forEach((city) => {
      const isSelected = selectedCity?.name === city.name;
      const isSolved = answeredCities[city.name];
      const labelPosClass = getLabelPlacementClasses(city.name);

      // Render the same visually gorgeous markup with custom dynamic coloring
      const markerHTML = `
        <div class="relative flex items-center justify-center cursor-pointer select-none" style="transform: translate(-16px, -16px); width: 32px; height: 32px;">
          ${!isSolved && !isSelected ? '<span class="absolute -inset-1 rounded-full bg-red-500/50 opacity-75 animate-ping"></span>' : ""}
          
          <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected
              ? "bg-amber-400 border-yellow-200 scale-125 shadow-lg ring-4 ring-amber-500/20 text-slate-950 font-bold"
              : isSolved
              ? "bg-emerald-600 border-emerald-400 text-white shadow-md"
              : "bg-red-600 border-red-300 text-white hover:bg-red-500 hover:scale-110 shadow-md"
          }">
            ${
              isSolved
                ? '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none" class="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                : `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" class="${
                    isSelected ? "text-slate-950" : "text-white"
                  }"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`
            }
          </div>
          
          <!-- Marker Tooltip Title Label - Richly styled and stable -->
          <span class="absolute px-2.5 py-0.5 rounded text-[10px] md:text-[11px] font-sans font-extrabold border shadow-md transition-all pointer-events-none ${labelPosClass} ${
            isSelected
              ? "bg-amber-400 border-yellow-200 text-slate-950 scale-110 z-30 font-black"
              : isSolved
              ? "bg-emerald-950/95 border-emerald-500/40 text-emerald-300 z-10"
              : "bg-[#110e1a]/95 border-indigo-950/90 text-amber-200/90"
          }">
            ${city.name}
          </span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHTML,
        className: "custom-leaflet-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([city.lat, city.lng], { icon: customIcon })
        .addTo(mapInstance)
        .on("click", () => {
          handleCitySelect(city);
        });

      markersRef.current.push(marker);
    });
  }, [mapInstance, selectedCity, answeredCities]);

  const handleResetView = () => {
    playSound("click");
    if (mapInstance) {
      mapInstance.setView([20.0, 20.0], 3, {
        animate: true,
        duration: 1.5,
      });
    }
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
        setScore((prev) => prev + 15);
        setAnsweredCities((prev) => ({ ...prev, [selectedCity.name]: true }));
      }

      // Check if all cities have been explored and solved
      const updatedAnswers = { ...answeredCities, [selectedCity.name]: true };
      const solvedCount = Object.keys(updatedAnswers).filter((k) => updatedAnswers[k]).length;
      if (solvedCount >= HISTORIC_CITIES.length) {
        onUnlockBadge("africa_explorer");
      }
    } else {
      playSound("fail");
      setQuizResult("wrong");
    }
  };

  return (
    <div id="map-explorer-container" className="bg-[#121020] rounded-2xl border border-indigo-950/80 shadow-xl p-6 overflow-hidden">
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-indigo-950/50 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans text-amber-400 flex items-center gap-2">
            <Compass className="w-7 h-7 text-amber-500 animate-pulse" />
            البوصلة التفاعلية: خريطة المعالم التاريخية المفتوحة
          </h2>
          <p className="text-slate-300 text-sm mt-1 font-sans">
            اكتشف حدود الدول والممالك بدقة الجغرافيا الواقعية مقارنة بالخرائط المعاصرة كما في كتب التاريخ. انقر على المدن لحل التحديات وكسب الجوائز!
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-[#1a1738] px-4 py-2 rounded-xl flex items-center gap-2 border border-indigo-950">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-slate-200 font-bold text-sm font-sans">
              المدن المستكشفة: {Object.keys(answeredCities).length} / {HISTORIC_CITIES.length}
            </span>
          </div>
        </div>
      </div>

      {/* Map Controls Panel */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#16132b]/50 p-3 rounded-xl border border-indigo-950/40 my-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none select-none">
          <span className="text-slate-400 text-xs font-semibold shrink-0">نمط العرض:</span>
          {mapLayers.map((layer) => {
            const TileIcon = layer.icon;
            const isSelected = mapStyle === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => {
                  playSound("click");
                  setMapStyle(layer.id);
                }}
                className={`text-[11px] px-3 py-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 shrink-0 ${
                  isSelected
                    ? "bg-amber-500 border-amber-400 text-slate-950 font-extrabold"
                    : "bg-[#121020] hover:bg-[#1a1738] border-indigo-950 text-slate-300"
                }`}
              >
                <TileIcon className="w-3.5 h-3.5" />
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleResetView}
          className="bg-indigo-950/60 hover:bg-indigo-950 text-slate-200 hover:text-amber-400 border border-indigo-900/50 hover:border-amber-500/40 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-1 shadow-sm shrink-0"
          title="إعادة ضبط التركيز الجغرافي"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          <span>إعادة تركيز الخريطة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Leaflet Map Wrapper */}
        <div className="lg:col-span-2 bg-[#09080f] border border-indigo-950/60 rounded-xl relative h-[480px] overflow-hidden shadow-inner">
          <div ref={mapRef} id="map-canvas" className="w-full h-full" />
        </div>

        {/* Informative City Details & Quiz Card */}
        <div className="bg-[#15122b]/90 border border-indigo-950/80 rounded-xl p-5 flex flex-col justify-start min-h-[300px]">
          {selectedCity ? (
            <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="pb-3 border-b border-indigo-950/50">
                <span className="bg-amber-500/10 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/20 font-sans">
                  {selectedCity.country}
                </span>
                <h3 className="text-2xl font-bold font-serif text-amber-400 mt-1">
                  مدينة {selectedCity.name}
                </h3>
              </div>

              <p className="text-slate-200 text-sm leading-relaxed font-serif">
                {selectedCity.description}
              </p>

              {/* Bonus Quiz Section */}
              {currentCityQuestion && (
                <div className="bg-[#181532]/90 rounded-xl border border-indigo-950 p-4 mt-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span className="font-sans">تحدي المعرفة الخاص بالمدينة:</span>
                  </div>

                  <p className="text-amber-300 text-sm font-semibold font-serif leading-relaxed">
                    {currentCityQuestion.text}
                  </p>

                  <div className="space-y-2 mt-2 font-serif">
                    {currentCityQuestion.options.map((option, oIdx) => {
                      const isUserChoice = userAnswer === option;
                      const isCorrectAnswer = option === currentCityQuestion.correct;

                      let btnStyle = "bg-[#131126] hover:bg-[#1c183a] border border-indigo-950/80 text-slate-100 hover:scale-[1.01]";
                      if (userAnswer) {
                        if (isCorrectAnswer) {
                          btnStyle = "bg-emerald-950/80 border-emerald-500/40 text-emerald-300";
                        } else if (isUserChoice) {
                          btnStyle = "bg-red-950/80 border-red-500/40 text-red-300";
                        } else {
                          btnStyle = "bg-[#131126]/30 border-indigo-950/30 text-slate-600 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={!!userAnswer}
                          onClick={() => handleAnswerSubmit(option)}
                          className={`w-full text-right p-2.5 rounded-lg border text-xs font-medium ease-out duration-150 transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {userAnswer && isCorrectAnswer && <Check className="w-4 h-4 text-emerald-400" />}
                          {userAnswer && isUserChoice && !isCorrectAnswer && <X className="w-4 h-4 text-red-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Message */}
                  {quizResult === "correct" && (
                    <div className="bg-emerald-950/60 text-emerald-300 border border-emerald-900/30 p-2.5 rounded-lg text-xs font-medium text-center animate-bounce font-sans">
                      🎉 مذهل! إجابة صحيحة. حصلت على 15+ نقاط معرفة!
                    </div>
                  )}
                  {quizResult === "wrong" && (
                    <div className="bg-red-950/60 text-red-300 border border-red-900/40 p-2.5 rounded-lg text-xs font-medium text-center font-sans">
                      ❌ أوه! حاول مجدداً مع تصفح معلومات المدينة جيداً.
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto text-slate-400">
              <Compass className="w-14 h-14 text-amber-500 animate-[spin_10s_linear_infinite] mb-3 opacity-80" />
              <h3 className="font-serif font-bold text-lg text-amber-400">
                بانتظار انطلاق المسافر
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-[200px] leading-relaxed font-sans">
                انقر على أي مدينة تاريخية على الخريطة لعرض تفاصيلها النادرة وحل تحدياتها وكسب أوسمة الأبطال!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
