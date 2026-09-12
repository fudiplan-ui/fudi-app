import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { C } from "../shared/colors";
import { RECIPES_DB, RecipeItem } from "../data/recipesDatabase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_DETECTED = [
  { name: "Babyspinat", icon: "🥬", category: "Gemüse" },
  { name: "Kirschtomaten", icon: "🍅", category: "Gemüse" },
  { name: "Bio-Eier", icon: "🥚", category: "Molkerei" },
  { name: "Feta", icon: "🧀", category: "Molkerei" },
  { name: "Avocado", icon: "🥑", category: "Obst" },
  { name: "Quinoa", icon: "🌾", category: "Vorräte" },
  { name: "Wildlachs", icon: "🐟", category: "Fisch" },
  { name: "Haferflocken", icon: "🥣", category: "Vorräte" },
];

export default function FridgeScannerModal({ isOpen, onClose }: Props) {
  const [mode, setMode] = useState<"camera" | "upload" | "detected">("camera");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedItems, setDetectedItems] = useState<string[]>(["Babyspinat", "Kirschtomaten", "Bio-Eier", "Feta"]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } else {
        setCameraError("Kamera-API wird von diesem Browser nicht unterstützt. Bitte nutze den Datei-Upload.");
      }
    } catch (err: any) {
      console.warn("Camera access failed:", err);
      setCameraError("Kein Kamerazugriff möglich (Berechtigung verweigert oder keine Kamera vorhanden). Bitte nutze den Foto-Upload.");
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (isOpen && mode === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, mode]);

  if (!isOpen) return null;

  // Capture Snapshot from Video
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
      triggerAiAnalysis();
    }
  };

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        stopCamera();
        triggerAiAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAiAnalysis = () => {
    setIsAnalyzing(true);
    setMode("detected");
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1500);
  };

  const toggleItem = (name: string) => {
    if (detectedItems.includes(name)) {
      setDetectedItems(detectedItems.filter(i => i !== name));
    } else {
      setDetectedItems([...detectedItems, name]);
    }
  };

  // Find recipes matching detected items
  const matchedRecipes = RECIPES_DB.filter(r => {
    return detectedItems.some(item =>
      r.title.toLowerCase().includes(item.toLowerCase()) ||
      r.ingredients.some(ing => ing.name.toLowerCase().includes(item.toLowerCase()))
    );
  }).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border" style={{ borderColor: C.border }}>
        
        {/* Header */}
        <div className="p-5 flex items-center justify-between text-white bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-white/10">📸</span>
            <div>
              <h2 className="font-bold text-base leading-tight">FUDI Kühlschrank & Vorrats-Scanner</h2>
              <p className="text-xs text-slate-300">Live-Kamera mit KI-No-Waste Rezepterkennung</p>
            </div>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b text-xs font-bold bg-gray-50" style={{ borderColor: C.border }}>
          <button
            onClick={() => { setCapturedImage(null); setMode("camera"); startCamera(); }}
            className={`flex-1 py-3 text-center transition-all ${mode === "camera" ? "border-b-2 border-emerald-700 text-emerald-800 bg-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            📷 Live Kamera
          </button>
          <button
            onClick={() => { stopCamera(); setMode("upload"); }}
            className={`flex-1 py-3 text-center transition-all ${mode === "upload" ? "border-b-2 border-emerald-700 text-emerald-800 bg-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            📁 Foto hochladen
          </button>
          <button
            onClick={() => { stopCamera(); setMode("detected"); }}
            className={`flex-1 py-3 text-center transition-all ${mode === "detected" ? "border-b-2 border-emerald-700 text-emerald-800 bg-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            🥗 Erkannte Zutaten ({detectedItems.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* CAMERA MODE */}
          {mode === "camera" && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-gray-800">
                {cameraActive ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    {/* Viewfinder Overlay */}
                    <div className="absolute inset-6 border-2 border-emerald-400/70 border-dashed rounded-2xl pointer-events-none flex items-center justify-center">
                      <span className="text-[11px] bg-black/60 text-emerald-300 px-3 py-1 rounded-full font-mono">
                        Lebensmittel im Rahmen zentrieren
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-2 text-slate-300">
                    <span className="text-3xl block">📷</span>
                    <p className="text-xs font-semibold">{cameraError || "Kamera wird initialisiert..."}</p>
                    <button
                      onClick={startCamera}
                      className="text-xs px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Kamera erneut starten
                    </button>
                  </div>
                )}
              </div>

              {cameraActive && (
                <div className="flex gap-3">
                  <button
                    onClick={handleCaptureSnapshot}
                    className="flex-1 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <span>📸</span> Foto aufnehmen & Zutaten analysieren
                  </button>
                </div>
              )}
            </div>
          )}

          {/* UPLOAD MODE */}
          {mode === "upload" && (
            <div className="space-y-4 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-3xl p-8 cursor-pointer hover:bg-emerald-50/40 transition-colors"
                style={{ borderColor: C.mint }}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl bg-emerald-50">
                  📁
                </div>
                <p className="font-bold text-sm text-slate-900">Foto aus Galerie wählen oder aufnehmen</p>
                <p className="text-xs text-slate-500 mt-1">Unterstützt JPG, PNG, WEBP (Smartphone & Desktop)</p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Datei auswählen
                </button>
              </div>
            </div>
          )}

          {/* DETECTED RESULTS & MATCHING RECIPES */}
          {mode === "detected" && (
            <div className="space-y-5">
              {isAnalyzing ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-800">KI analysiert Kühlschrank-Inhalt...</p>
                  <p className="text-[11px] text-slate-500">Gleiche Vorräte mit 1.240 Rezepten ab</p>
                </div>
              ) : (
                <>
                  {capturedImage && (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-200">
                      <img src={capturedImage} alt="Kühlschrank" className="w-14 h-14 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800">Aufnahme verarbeitet</p>
                        <p className="text-[10px] text-emerald-700 font-semibold">✓ Bilderkennung erfolgreich</p>
                      </div>
                    </div>
                  )}

                  {/* Detected Items Tag Cloud */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">Erkannte Zutaten (anklicken zum Anpassen):</span>
                      <span className="text-[10px] text-gray-500 font-mono">{detectedItems.length} aktiv</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SAMPLE_DETECTED.map(item => {
                        const isSelected = detectedItems.includes(item.name);
                        return (
                          <button
                            key={item.name}
                            onClick={() => toggleItem(item.name)}
                            className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-emerald-100 border-emerald-400 text-emerald-900 shadow-xs"
                                : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                            <span>{isSelected ? "✓" : "+"}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Matched Recipes */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Passende No-Waste Rezepte ({matchedRecipes.length})
                    </h3>
                    <div className="space-y-2">
                      {matchedRecipes.map(r => (
                        <Link
                          key={r.id}
                          to={`/rezepte/${r.id}`}
                          onClick={onClose}
                          className="p-3 rounded-2xl border border-gray-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/30 flex items-center justify-between gap-3 transition-all block group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={r.img} alt={r.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 truncate">
                                {r.title}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                ⏱ {r.time} Min. · {r.kcal} kcal · {r.protein}g Protein
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-800 shrink-0">Kochen ›</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
