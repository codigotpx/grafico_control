import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import { constants } from "../utils/constants";
import { calculateCapability } from "../utils/calculations";
import { useData } from "../context/DataContext";

function Card({ title, children, color, icon }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow border border-gray-100">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {icon && <span className="text-2xl">{icon}</span>}
          <h2 className={`text-lg font-bold ${color || "text-blue-600"}`}>
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
}

function SpecLimitsEditor({ usl, lsl, onChangeUSL, onChangeLSL, suggestedUSL, suggestedLSL }) {
  return (
    <div className="space-y-4">
      {/* Valores sugeridos como referencia */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📋</span>
          <p className="text-sm font-bold text-blue-900">Referencia Calculada (±3σ)</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="bg-white/70 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">USL Sugerida</p>
            <p className="text-2xl font-bold text-blue-700">{suggestedUSL.toFixed(3)}</p>
          </div>
          <div className="bg-white/70 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">LSL Sugerida</p>
            <p className="text-2xl font-bold text-blue-700">{suggestedLSL.toFixed(3)}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <span className="text-yellow-600 text-lg">⚠️</span>
          <p className="text-xs text-yellow-800 leading-relaxed">
            <strong>Importante:</strong> Estos valores son solo orientativos basados en tus datos. 
            Debes ingresar los límites reales de especificación de tu proceso.
          </p>
        </div>
      </div>

      {/* Campos para ingresar límites reales */}
      <div className="border-t-2 border-gray-200 pt-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">⚙️</span>
          <p className="text-sm font-bold text-gray-800">Ingresa los Límites de Especificación</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              USL - Límite Superior de Especificación
            </label>
            <div className="relative">
              <input
                type="number"
                value={usl || ""}
                onChange={(e) => onChangeUSL(parseFloat(e.target.value) || 0)}
                step="0.001"
                className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg font-semibold"
                placeholder="Ej: 10.500"
              />
              {usl === 0 && (
                <div className="absolute right-3 top-3 text-red-500 text-xl">⚠️</div>
              )}
            </div>
            <p className="text-xs text-gray-500">Valor máximo permitido</p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              LSL - Límite Inferior de Especificación
            </label>
            <div className="relative">
              <input
                type="number"
                value={lsl || ""}
                onChange={(e) => onChangeLSL(parseFloat(e.target.value) || 0)}
                step="0.001"
                className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg font-semibold"
                placeholder="Ej: 9.500"
              />
              {lsl === 0 && (
                <div className="absolute right-3 top-3 text-red-500 text-xl">⚠️</div>
              )}
            </div>
            <p className="text-xs text-gray-500">Valor mínimo permitido</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataPreviewTable({ rawData }) {
  if (!rawData || rawData.length === 0) return null;

  const maxRows = 10;
  const displayData = rawData.slice(0, maxRows);
  const n = rawData[0].length;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h3 className="text-base font-bold text-gray-800">
            Vista Previa de los Datos
          </h3>
        </div>
        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
          {displayData.length} de {rawData.length} subgrupos
        </span>
      </div>
      
      <div className="overflow-x-auto border-2 border-gray-200 rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                #
              </th>
              {Array.from({ length: n }, (_, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  V{i + 1}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50">
                X̄
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-orange-700 uppercase tracking-wider bg-orange-50">
                R
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {displayData.map((row, idx) => {
              const mean = row.reduce((a, b) => a + b, 0) / row.length;
              const range = Math.max(...row) - Math.min(...row);
              
              return (
                <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 bg-gray-50">
                    {idx + 1}
                  </td>
                  {row.map((val, i) => (
                    <td key={i} className="px-4 py-3 text-sm text-center text-gray-700 font-mono">
                      {val.toFixed(3)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm text-center font-bold text-blue-700 bg-blue-50/50">
                    {mean.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-sm text-center font-bold text-orange-700 bg-orange-50/50">
                    {range.toFixed(3)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {rawData.length > maxRows && (
        <div className="text-center mt-3">
          <span className="text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            ... y {rawData.length - maxRows} subgrupos más
          </span>
        </div>
      )}
    </div>
  );
}

function DataSummary({ rawData, chartType }) {
  if (!rawData || rawData.length === 0) return null;

  const n = rawData[0].length;
  const totalObservations = rawData.length * n;
  const allValues = rawData.flat();
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const mean = allValues.reduce((a, b) => a + b, 0) / allValues.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs text-blue-700 mb-1 font-semibold uppercase">Subgrupos</p>
          <p className="text-3xl font-bold text-blue-900">{rawData.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs text-green-700 mb-1 font-semibold uppercase">Tamaño (n)</p>
          <p className="text-3xl font-bold text-green-900">{n}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs text-purple-700 mb-1 font-semibold uppercase">Observaciones</p>
          <p className="text-3xl font-bold text-purple-900">{totalObservations}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs text-orange-700 mb-1 font-semibold uppercase">Tipo</p>
          <p className="text-3xl font-bold text-orange-900">
            {chartType === "xr" ? "X̄-R" : "X̄-S"}
          </p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-gray-50 to-slate-100 p-5 rounded-xl border-2 border-gray-200 shadow-sm">
        <p className="text-xs font-bold text-gray-600 mb-3 uppercase">Estadísticas Globales</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-600 mb-1">Mínimo</p>
            <p className="text-xl font-bold text-gray-900">{min.toFixed(3)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-1">Media</p>
            <p className="text-xl font-bold text-blue-700">{mean.toFixed(3)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-1">Máximo</p>
            <p className="text-xl font-bold text-gray-900">{max.toFixed(3)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnterData() {
  const navigate = useNavigate();
  const [rawData, setRawData] = useState([]);
  const [usl, setUSL] = useState(0);
  const [lsl, setLSL] = useState(0);
  const [suggestedUSL, setSuggestedUSL] = useState(0);
  const [suggestedLSL, setSuggestedLSL] = useState(0);
  const [chartType, setChartType] = useState("xr");
  const [inputMode, setInputMode] = useState("file");
  const [manualText, setManualText] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [calculatedData, setCalculatedData] = useState(null);
  const { setDatos } = useData();

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 4000);
  };

  const validateData = (datos) => {
    if (!datos || !Array.isArray(datos) || datos.length === 0) {
      throw new Error("No se recibieron datos válidos");
    }
    if (datos.length < 2) {
      throw new Error("Se requieren al menos 2 subgrupos");
    }
    const firstLength = datos[0].length;
    if (firstLength < 2) {
      throw new Error("Cada subgrupo debe tener al menos 2 observaciones");
    }
    const allSameLength = datos.every((row) => row.length === firstLength);
    if (!allSameLength) {
      throw new Error("Todos los subgrupos deben tener el mismo tamaño");
    }
    return true;
  };

  const procesarDatos = (datos) => {
    try {
      validateData(datos);

      const n = datos[0].length;
      const constantsForN = constants[String(n)];

      if (!constantsForN) {
        throw new Error(`No hay constantes definidas para n=${n}`);
      }

      const { A2, D3, D4, A3, B3, B4 } = constantsForN;

      const medias = datos.map((m) => {
        const suma = m.reduce((a, b) => a + b, 0);
        return parseFloat((suma / m.length).toFixed(3));
      });

      const rangos = datos.map((m) =>
        parseFloat((Math.max(...m) - Math.min(...m)).toFixed(3))
      );

      const desviaciones = datos.map((m) => {
        const mean = m.reduce((a, b) => a + b, 0) / m.length;
        const variance =
          m.reduce((s, v) => s + (v - mean) ** 2, 0) / (m.length - 1);
        return parseFloat(Math.sqrt(variance).toFixed(3));
      });

      const promedioX = parseFloat(
        (medias.reduce((a, b) => a + b, 0) / medias.length).toFixed(3)
      );
      const promedioR = parseFloat(
        (rangos.reduce((a, b) => a + b, 0) / rangos.length).toFixed(3)
      );
      const promedioS = parseFloat(
        (desviaciones.reduce((a, b) => a + b, 0) / desviaciones.length).toFixed(3)
      );

      const limitsXRCalc = {
        UCL: parseFloat((promedioX + A2 * promedioR).toFixed(3)),
        LCL: parseFloat((promedioX - A2 * promedioR).toFixed(3)),
        CL: promedioX,
      };

      const limitsRCalc = {
        UCL: parseFloat((D4 * promedioR).toFixed(3)),
        LCL: parseFloat((D3 * promedioR).toFixed(3)),
        CL: promedioR,
      };

      const limitsXSCalc = {
        UCL: parseFloat((promedioX + A3 * promedioS).toFixed(3)),
        LCL: parseFloat((promedioX - A3 * promedioS).toFixed(3)),
        CL: promedioX,
      };

      const limitsSCalc = {
        UCL: parseFloat((B4 * promedioS).toFixed(3)),
        LCL: parseFloat((B3 * promedioS).toFixed(3)),
        CL: promedioS,
      };

      const allValues = datos.flat();
      const meanGlobal = allValues.reduce((a, b) => a + b, 0) / allValues.length;
      const sigmaGlobal = Math.sqrt(
        allValues.reduce((s, v) => s + (v - meanGlobal) ** 2, 0) /
          (allValues.length - 1)
      );

      const suggestedUSLCalc = parseFloat(
        (meanGlobal + 3 * sigmaGlobal).toFixed(3)
      );
      const suggestedLSLCalc = parseFloat(
        (meanGlobal - 3 * sigmaGlobal).toFixed(3)
      );

      const datosCalculados = {
        means: medias,
        ranges: rangos,
        stds: desviaciones,
        limitsXR: limitsXRCalc,
        limitsXS: limitsXSCalc,
        limitsR: limitsRCalc,
        limitsS: limitsSCalc,
      };

      setCalculatedData(datosCalculados);
      setRawData(datos);
      setSuggestedUSL(suggestedUSLCalc);
      setSuggestedLSL(suggestedLSLCalc);
      setUSL(0);
      setLSL(0);

      showNotification(
        `✓ ${datos.length} subgrupos procesados correctamente (n=${n})`,
        "success"
      );
    } catch (error) {
      showNotification(`⚠️ ${error.message}`, "error");
    }
  };

  const handleManualSubmit = () => {
    try {
      const rows = manualText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)
        .map((line) =>
          line
            .replace(/"/g, "")
            .split(",")
            .map((v) => {
              const num = parseFloat(v.trim());
              if (isNaN(num)) throw new Error(`Valor inválido: "${v}"`);
              return num;
            })
        );
      procesarDatos(rows);
    } catch (e) {
      showNotification(`⚠️ ${e.message}`, "error");
    }
  };

  const handleGenerateAnalysis = () => {
    if (rawData.length === 0) {
      showNotification("⚠️ Debes cargar datos primero", "error");
      return;
    }
    if (usl === 0 || lsl === 0) {
      showNotification(
        "⚠️ Debes ingresar los límites de especificación (USL/LSL)",
        "error"
      );
      return;
    }
    if (usl <= lsl) {
      showNotification("⚠️ USL debe ser mayor que LSL", "error");
      return;
    }
    if (!calculatedData) {
      showNotification("⚠️ Error: Datos calculados no disponibles", "error");
      return;
    }

    try {
      let newCapability;
      try {
        newCapability = calculateCapability(rawData, usl, lsl, chartType);
      } catch (capError) {
        console.warn("Error calculando capacidad:", capError.message);
        const allValues = rawData.flat();
        const meanGlobal = allValues.reduce((a, b) => a + b, 0) / allValues.length;
        const sigmaGlobal = Math.sqrt(
          allValues.reduce((s, v) => s + (v - meanGlobal) ** 2, 0) /
            (allValues.length - 1)
        );
        newCapability = { Cp: 0, Cpk: 0, Cpm: 0, mean: meanGlobal, sigma: sigmaGlobal };
      }
      
      setDatos({
        ...calculatedData,
        rawData,
        chartType,
        usl,
        lsl,
        capability: newCapability,
      });
      
      navigate("/graphics");
    } catch (error) {
      showNotification(`⚠️ Error: ${error.message}`, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📊</span>
            <h1 className="text-4xl font-bold text-gray-900">
              Configuración de Datos
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Carga tus datos y configura los parámetros para el análisis de control estadístico de procesos.
          </p>
        </div>

        {/* Notification */}
        {notification.message && (
          <div
            className={`px-6 py-4 rounded-xl border-2 shadow-lg animate-pulse ${
              notification.type === "success"
                ? "bg-green-50 border-green-400 text-green-900"
                : "bg-red-50 border-red-400 text-red-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{notification.type === "success" ? "✅" : "❌"}</span>
              <span className="font-semibold">{notification.message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de Configuración */}
          <div className="space-y-6">
            <Card title="Modo de Ingreso" icon="📁">
              <select
                value={inputMode}
                onChange={(e) => setInputMode(e.target.value)}
                className="border-2 border-gray-300 rounded-xl px-4 py-3 bg-white w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold"
              >
                <option value="file">📁 Archivo CSV</option>
                <option value="manual">⌨️ Ingreso Manual</option>
              </select>
            </Card>

            <Card title="Tipo de Gráfico" icon="📈">
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="border-2 border-gray-300 rounded-xl px-4 py-3 bg-white w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-semibold"
              >
                <option value="xr">X̄–R (Rangos)</option>
                <option value="xs">X̄–S (Desviaciones)</option>
              </select>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">
                  {chartType === "xr"
                    ? "✓ Recomendado para n ≤ 10"
                    : "✓ Recomendado para n > 10"}
                </p>
              </div>
            </Card>
          </div>

          {/* Área Principal */}
          <div className="space-y-6 lg:col-span-3">
            {/* Carga de Datos */}
            {inputMode === "file" ? (
              <Card title="Cargar Archivo CSV" icon="📁">
                <FileUploader onDataLoaded={procesarDatos} />
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-sm border-2 border-blue-200">
                  <p className="font-bold mb-2 text-blue-900 flex items-center gap-2">
                    <span>💡</span> Formato Esperado
                  </p>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Cada fila representa un subgrupo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Cada columna es una observación</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Sin encabezados en el archivo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Valores separados por comas</span>
                    </li>
                  </ul>
                </div>
              </Card>
            ) : (
              <Card title="Ingreso Manual de Datos" icon="⌨️" color="text-blue-600">
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Ejemplo:&#10;10.2,10.5,10.3,10.4&#10;10.1,10.6,10.2,10.5&#10;10.3,10.4,10.6,10.3"
                  className="border-2 border-gray-300 rounded-xl w-full h-48 p-4 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <button
                  onClick={handleManualSubmit}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  🚀 Procesar Datos
                </button>
              </Card>
            )}

            {/* Resumen y Preview */}
            {rawData.length > 0 && (
              <>
                <Card title="Resumen de Datos Cargados" icon="📈">
                  <DataSummary rawData={rawData} chartType={chartType} />
                  <DataPreviewTable rawData={rawData} />
                </Card>

                {/* Límites de Especificación */}
                <Card title="Límites de Especificación" icon="⚙️" color="text-purple-600">
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    Define los límites de especificación del proceso para calcular los índices de capacidad (Cp, Cpk, Cpm).
                  </p>
                  <SpecLimitsEditor
                    usl={usl}
                    lsl={lsl}
                    onChangeUSL={setUSL}
                    onChangeLSL={setLSL}
                    suggestedUSL={suggestedUSL}
                    suggestedLSL={suggestedLSL}
                  />
                </Card>

                {/* Botón CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl border-2 border-blue-400">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">✅</span>
                    <h3 className="text-2xl font-bold text-white">
                      ¡Todo Listo para el Análisis!
                    </h3>
                  </div>
                  <p className="text-blue-50 mb-6 text-lg leading-relaxed">
                    Tus datos han sido cargados exitosamente. Verifica que los límites de especificación 
                    sean correctos y genera el análisis completo con gráficos de control estadístico.
                  </p>
                  <button
                    onClick={handleGenerateAnalysis}
                    className="w-full bg-white hover:bg-gray-50 text-blue-700 font-bold px-8 py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl text-lg"
                  >
                    🚀 Generar Dashboard de Análisis
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}