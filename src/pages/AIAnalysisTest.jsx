import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { generateAnalysis } from "../utils/generateAnalysis";

export default function AIAnalysisTest() {
  const { datos } = useData();
  const [iaAnalysis, setIaAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Cargar historial del localStorage
  useEffect(() => {
    const savedAnalysis = localStorage.getItem("iaAnalysisHistory");
    if (savedAnalysis) {
      try {
        setAnalysisHistory(JSON.parse(savedAnalysis));
      } catch (error) {
        console.error("Error loading analysis history:", error);
      }
    }
  }, []);

  // Guardar historial en localStorage
  const saveAnalysis = (analysis) => {
    const newAnalysis = {
      id: Date.now(),
      content: analysis,
      timestamp: new Date().toLocaleDateString('es-CO', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      dataPoints: datos?.means?.length || 0
    };

    const updatedHistory = [newAnalysis, ...analysisHistory];
    setAnalysisHistory(updatedHistory);
    localStorage.setItem("iaAnalysisHistory", JSON.stringify(updatedHistory));
    setIaAnalysis(analysis);
  };

  const handleAnalyze = async () => {
    if (!datos) {
      setIaAnalysis("⚠️ No hay datos disponibles para analizar.");
      return;
    }

    setLoading(true);
    try {
      const analysis = await generateAnalysis(datos);
      saveAnalysis(analysis);
    } catch (error) {
      setIaAnalysis(`❌ Error al generar el análisis: ${error.message}`);
    }
    setLoading(false);
  };

  const deleteAnalysis = (id) => {
    const updatedHistory = analysisHistory.filter(item => item.id !== id);
    setAnalysisHistory(updatedHistory);
    localStorage.setItem("iaAnalysisHistory", JSON.stringify(updatedHistory));
  };

  const clearAllAnalysis = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar todo el historial?")) {
      setAnalysisHistory([]);
      setIaAnalysis("");
      localStorage.removeItem("iaAnalysisHistory");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🧠</span>
            <h1 className="text-4xl font-bold text-gray-900">Análisis Inteligente</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Análisis automático de tus datos usando IA - Los resultados se guardan automáticamente
          </p>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de análisis principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de generación */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border-2 border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>📊</span> Generar Análisis
              </h2>

              {datos ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span>✓</span> Datos disponibles para análisis
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Subgrupos</p>
                        <p className="text-lg font-bold text-blue-700">{datos.means?.length || 0}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Media</p>
                        <p className="text-lg font-bold text-purple-700">{datos.capability?.mean?.toFixed(3) || 'N/A'}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Desviación σ</p>
                        <p className="text-lg font-bold text-orange-700">{datos.capability?.sigma?.toFixed(4) || 'N/A'}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Capacidad Cpk</p>
                        <p className="text-lg font-bold text-green-700">{datos.capability?.Cpk?.toFixed(4) || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⚙️</span>
                        Analizando con IA...
                      </>
                    ) : (
                      <>
                        <span>🤖</span>
                        Generar Análisis Inteligente
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-yellow-800 font-medium">
                    No hay datos cargados. Por favor, carga datos primero en la sección "Cargar Datos".
                  </p>
                </div>
              )}
            </div>

            {/* Análisis actual */}
            {iaAnalysis && (
              <div className="bg-white shadow-lg rounded-2xl p-6 border-2 border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span>💡</span> Análisis Actual
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                      ✓ Guardado
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-100 max-h-96 overflow-y-auto">
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed text-sm md:text-base">
                    {iaAnalysis}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Panel de historial */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>📜</span> Historial
              </h3>
              {analysisHistory.length > 0 && (
                <button
                  onClick={clearAllAnalysis}
                  className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition"
                  title="Limpiar historial"
                >
                  🗑️
                </button>
              )}
            </div>

            {analysisHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  Los análisis aparecerán aquí automáticamente
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {analysisHistory.map((item, index) => (
                  <div
                    key={item.id}
                    className="border-2 border-gray-200 rounded-lg p-3 hover:border-indigo-300 hover:shadow-md transition"
                  >
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">
                          {item.timestamp}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          📊 {item.dataPoints} subgrupos
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAnalysis(item.id);
                        }}
                        className="text-red-500 hover:text-red-700 transition ml-2"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>

                    {expandedIndex === index && (
                      <div className="mt-3 pt-3 border-t-2 border-gray-200">
                        <p className="text-gray-700 text-xs whitespace-pre-line leading-relaxed line-clamp-6">
                          {item.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {analysisHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Total: {analysisHistory.length} análisis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}