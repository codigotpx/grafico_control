import { Line, Bar } from "react-chartjs-2";
import { useData } from "../context/DataContext";
import { useEffect, useMemo, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

function KPICard({ title, value, color, emoji, subtitle }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-xl transition-all border-2 border-gray-100 hover:border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{emoji}</span>
        <div className={`w-3 h-3 rounded-full ${color === "#E53E3E" ? "bg-red-500" : color === "#48BB78" ? "bg-green-500" : "bg-blue-500"}`}></div>
      </div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {title}
      </h3>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

function ChartCard({ title, children, color, icon }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-xl font-bold" style={{ color }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

const getPointColors = (data, limits) =>
  data.map((val) =>
    val < limits.LCL || val > limits.UCL ? "#E53E3E" : "#268BC9"
  );

const countOutOfControl = (data, limits) => {
  if (!data || !limits) return 0;
  return data.filter(val => val < limits.LCL || val > limits.UCL).length;
};

// Función para exportar a PDF
const exportToPDF = async (ref, datos, limitsXToUse, capability, outOfControlCount, today) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 10;

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(38, 139, 201);
    pdf.text("📊 Dashboard de Control - Reporte", pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Fecha: ${today}`, pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 15;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(10, yPosition, pageWidth - 10, yPosition);
    yPosition += 8;

    // KPI Summary
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Resumen de KPIs:", 10, yPosition);
    yPosition += 8;

    const kpiData = [
      ["Subgrupos Analizados", datos.means.length.toString()],
      ["Media del Proceso", limitsXToUse.CL.toFixed(3)],
      ["Desviación σ", capability.sigma.toFixed(4)],
      ["Puntos Fuera de Control", outOfControlCount.toString()],
      ["Estado", outOfControlCount > 0 ? "⚠️ Revisar" : "✅ Estable"],
    ];

    autoTable(pdf, {
      startY: yPosition,
      head: [["Parámetro", "Valor"]],
      body: kpiData,
      theme: "grid",
      headStyles: {
        fillColor: [38, 139, 201],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: 0,
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
      margin: { left: 10, right: 10 },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 60 },
      },
    });

    yPosition = pdf.lastAutoTable.finalY + 15;

    // Límites de Control
    pdf.setFontSize(12);
    pdf.text("Límites de Control - Medias (X̄):", 10, yPosition);
    yPosition += 8;

    const limitsData = [
      ["Línea Central (CL)", limitsXToUse.CL.toFixed(4)],
      ["Límite Superior (UCL)", limitsXToUse.UCL.toFixed(4)],
      ["Límite Inferior (LCL)", limitsXToUse.LCL.toFixed(4)],
    ];

    autoTable(pdf, {
      startY: yPosition,
      head: [["Tipo", "Valor"]],
      body: limitsData,
      theme: "striped",
      headStyles: {
        fillColor: [246, 173, 85],
        textColor: 255,
        fontStyle: "bold",
      },
      margin: { left: 10, right: 10 },
    });

    yPosition = pdf.lastAutoTable.finalY + 15;

    // Índices de Capacidad
    pdf.setFontSize(12);
    pdf.text("Índices de Capacidad del Proceso:", 10, yPosition);
    yPosition += 8;

    const capabilityData = [
      ["Cp (Capacidad Potencial)", capability.Cp.toFixed(4)],
      ["Cpk (Capacidad Real)", capability.Cpk.toFixed(4)],
    ];

    autoTable(pdf, {
      startY: yPosition,
      head: [["Índice", "Valor"]],
      body: capabilityData,
      theme: "grid",
      headStyles: {
        fillColor: [139, 92, 246],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 240, 255],
      },
      margin: { left: 10, right: 10 },
    });

    yPosition = pdf.lastAutoTable.finalY + 15;

    // Capturar gráficos
    if (ref.current) {
      const charts = ref.current.querySelectorAll("[data-chart]");
      
      for (const chart of charts) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 10;
        }

        try {
          const canvas = await html2canvas(chart, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          });
          
          const imgData = canvas.toDataURL("image/png");
          const chartTitle = chart.getAttribute("data-chart-title") || "Gráfico";
          
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
          pdf.text(chartTitle, 10, yPosition);
          yPosition += 5;

          const chartHeight = 60;
          pdf.addImage(imgData, "PNG", 10, yPosition, pageWidth - 20, chartHeight);
          yPosition += chartHeight + 8;
        } catch (error) {
          console.error("Error capturando gráfico:", error);
        }
      }
    }

    // Guarda el PDF
    pdf.save(`Dashboard_Control_${today.replace(/\//g, "-")}.pdf`);
  } catch (error) {
    console.error("Error generando PDF:", error);
    alert("Error al generar el PDF: " + error.message);
  }
};

export default function Graphics() {
  const { datos } = useData();
  const dashboardRef = useRef(null);
  const chartsContainerRef = useRef(null);

  useEffect(() => {
    if (!datos) {
      console.log("No hay datos disponibles");
    }
  }, [datos]);

  const outOfControlCount = useMemo(() => {
    if (!datos) return 0;
    const xOutOfControl = countOutOfControl(datos.means, datos.limitsXR || datos.limitsXS);
    const rOutOfControl = countOutOfControl(datos.ranges, datos.limitsR);
    const sOutOfControl = countOutOfControl(datos.stds, datos.limitsS);
    return xOutOfControl + rOutOfControl + sOutOfControl;
  }, [datos]);

  if (!datos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-10">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md border-2 border-gray-200">
          <span className="text-6xl mb-4 block">⚠️</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Sin Datos Disponibles</h2>
          <p className="text-gray-600 mb-6">
            No hay datos cargados para mostrar en los gráficos. Por favor, ve a la sección 
            "Cargar Datos" para comenzar tu análisis.
          </p>
          <a 
            href="/enterData"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            📊 Cargar Datos
          </a>
        </div>
      </div>
    );
  }

  const labels = datos.means.map((_, i) => `${i + 1}`);
  const today = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const limitsXToUse = datos.limitsXR || datos.limitsXS;
  
  const dataX = {
    labels,
    datasets: [
      {
        label: "X̄ (Media)",
        data: datos.means,
        borderColor: "#268BC9",
        backgroundColor: "rgba(38,139,201,0.15)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: getPointColors(datos.means, limitsXToUse),
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
      },
      {
        label: "Línea Central",
        data: Array(datos.means.length).fill(limitsXToUse.CL),
        borderColor: "#2D3748",
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
        borderDash: [0],
      },
      {
        label: "UCL (Límite Superior)",
        data: Array(datos.means.length).fill(limitsXToUse.UCL),
        borderColor: "#E53E3E",
        borderDash: [8, 4],
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
      },
      {
        label: "LCL (Límite Inferior)",
        data: Array(datos.means.length).fill(limitsXToUse.LCL),
        borderColor: "#E53E3E",
        borderDash: [8, 4],
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
      },
      {
        label: "USL (Límite Superior Especificación)",
        data: Array(datos.means.length).fill(datos.usl),
        borderColor: "#10B981",
        borderDash: [5, 5],
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
      },
      {
        label: "LSL (Límite Inferior Especificación)",
        data: Array(datos.means.length).fill(datos.lsl),
        borderColor: "#10B981",
        borderDash: [5, 5],
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
      }
    ],
  };

  const dataR = {
    labels,
    datasets: [
      {
        label: "Rangos (R)",
        data: datos.ranges,
        borderColor: "#F6AD55",
        backgroundColor: "rgba(246,173,85,0.15)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: getPointColors(datos.ranges, datos.limitsR),
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
      },
      {
        label: "CL",
        data: Array(datos.ranges.length).fill(datos.limitsR.CL),
        borderColor: "#2D3748",
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
      },
      {
        label: "UCL",
        data: Array(datos.ranges.length).fill(datos.limitsR.UCL),
        borderColor: "#E53E3E",
        borderDash: [8, 4],
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
      },
      {
        label: "LCL",
        data: Array(datos.ranges.length).fill(datos.limitsR.LCL),
        borderColor: "#E53E3E",
        borderDash: [8, 4],
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
      }
    ],
  };

  const dataS = {
    labels,
    datasets: [
      {
        label: "Desviación (S)",
        data: datos.stds,
        borderColor: "#48BB78",
        backgroundColor: "rgba(72,187,120,0.15)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: getPointColors(datos.stds, datos.limitsS),
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
      },
      {
        label: "CL",
        data: Array(datos.stds.length).fill(datos.limitsS.CL),
        borderColor: "#2D3748",
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
      },
      {
        label: "UCL",
        data: Array(datos.stds.length).fill(datos.limitsS.UCL),
        borderColor: "#E53E3E",
        borderDash: [8, 4],
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
      },
      {
        label: "LCL",
        data: Array(datos.stds.length).fill(datos.limitsS.LCL),
        borderColor: "#E53E3E",
        borderDash: [8, 4],
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
      }
    ],
  };

  const capability = datos.capability || { mean: 0, sigma: 0, Cp: 0, Cpk: 0 };
  
  const dataTrend = {
    labels: ["Cp", "Cpk"],
    datasets: [
      {
        label: "Índices de Capacidad",
        data: [capability.Cp, capability.Cpk],
        backgroundColor: [
          capability.Cp >= 1.33 ? "rgba(72,187,120,0.8)" : capability.Cp >= 1.0 ? "rgba(246,173,85,0.8)" : "rgba(229,62,62,0.8)",
          capability.Cpk >= 1.33 ? "rgba(72,187,120,0.8)" : capability.Cpk >= 1.0 ? "rgba(246,173,85,0.8)" : "rgba(229,62,62,0.8)"
        ],
        borderColor: [
          capability.Cp >= 1.33 ? "#48BB78" : capability.Cp >= 1.0 ? "#F6AD55" : "#E53E3E",
          capability.Cpk >= 1.33 ? "#48BB78" : capability.Cpk >= 1.0 ? "#F6AD55" : "#E53E3E"
        ],
        borderWidth: 3,
        borderRadius: 8,
      },
    ],
  };

  const optionsCommon = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: true, 
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: 'bold' }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
      }
    },
    scales: {
      x: { 
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { font: { size: 12, weight: '600' } },
        title: {
          display: true,
          text: 'Subgrupos',
          font: { size: 13, weight: 'bold' }
        }
      },
      y: { 
        grid: { color: "rgba(0,0,0,0.08)" },
        ticks: { font: { size: 12 } },
        title: {
          display: true,
          text: 'Valor',
          font: { size: 13, weight: 'bold' }
        }
      },
    },
  };

  const optionsBar = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.y.toFixed(4)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.08)" },
        ticks: { font: { size: 12 } },
        title: {
          display: true,
          text: 'Valor del Índice',
          font: { size: 13, weight: 'bold' }
        }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 14, weight: 'bold' } }
      }
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 p-6" ref={dashboardRef}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header con botón de exportación */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📊</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Dashboard de Control</h1>
              <p className="text-gray-600 text-lg">
                Análisis estadístico de procesos - Gráficos de control y capacidad del proceso
              </p>
            </div>
          </div>
          <button
            onClick={() => exportToPDF(chartsContainerRef, datos, limitsXToUse, capability, outOfControlCount, today)}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            📥 Exportar PDF
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard 
            title="Subgrupos Analizados" 
            value={datos.means.length} 
            color="#268BC9"
            emoji="📦"
            subtitle="Total de muestras"
          />
          <KPICard 
            title="Último Análisis" 
            value={today.slice(0, 5)} 
            color="#8B5CF6"
            emoji="📅"
            subtitle={`Año ${today.slice(-4)}`}
          />
          <KPICard
            title="Media del Proceso"
            value={limitsXToUse.CL.toFixed(3)}
            color="#268BC9"
            emoji="📊"
            subtitle="Promedio X̄"
          />
          <KPICard 
            title="Fuera de Control" 
            value={outOfControlCount} 
            color={outOfControlCount > 0 ? "#E53E3E" : "#48BB78"}
            emoji={outOfControlCount > 0 ? "⚠️" : "✅"}
            subtitle={outOfControlCount > 0 ? "Revisar proceso" : "Proceso estable"}
          />
          <KPICard
            title="Desviación σ"
            value={capability.sigma.toFixed(4)}
            color="#F6AD55"
            emoji="📈"
            subtitle="Variabilidad"
          />
        </div>

        {/* Contenedor de gráficos */}
        <div ref={chartsContainerRef}>
          {/* Gráfico de Medias Principal */}
          <ChartCard 
            title="Gráfico de Control de Medias (X̄)" 
            color="#268BC9"
            icon="📈"
          >
            <div style={{ height: '400px' }} data-chart data-chart-title="Gráfico de Control de Medias (X̄)">
              <Line data={dataX} options={optionsCommon} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Línea Central</p>
                <p className="text-lg font-bold text-blue-700">{limitsXToUse.CL.toFixed(3)}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-xs text-gray-600 mb-1">UCL</p>
                <p className="text-lg font-bold text-red-700">{limitsXToUse.UCL.toFixed(3)}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-xs text-gray-600 mb-1">LCL</p>
                <p className="text-lg font-bold text-red-700">{limitsXToUse.LCL.toFixed(3)}</p>
              </div>
            </div>
          </ChartCard>

          {/* Gráficos R y S */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChartCard 
              title="Gráfico de Rangos (R)" 
              color="#F6AD55"
              icon="📊"
            >
              <div style={{ height: '320px' }} data-chart data-chart-title="Gráfico de Rangos (R)">
                <Line data={dataR} options={optionsCommon} />
              </div>
              <div className="mt-4 flex justify-around text-sm">
                <div className="text-center">
                  <p className="text-xs text-gray-600">CL</p>
                  <p className="text-base font-bold text-orange-700">{datos.limitsR.CL.toFixed(3)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">UCL</p>
                  <p className="text-base font-bold text-red-700">{datos.limitsR.UCL.toFixed(3)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">LCL</p>
                  <p className="text-base font-bold text-red-700">{datos.limitsR.LCL.toFixed(3)}</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard 
              title="Gráfico de Desviaciones (S)" 
              color="#48BB78"
              icon="📉"
            >
              <div style={{ height: '320px' }} data-chart data-chart-title="Gráfico de Desviaciones (S)">
                <Line data={dataS} options={optionsCommon} />
              </div>
              <div className="mt-4 flex justify-around text-sm">
                <div className="text-center">
                  <p className="text-xs text-gray-600">CL</p>
                  <p className="text-base font-bold text-green-700">{datos.limitsS.CL.toFixed(3)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">UCL</p>
                  <p className="text-base font-bold text-red-700">{datos.limitsS.UCL.toFixed(3)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">LCL</p>
                  <p className="text-base font-bold text-red-700">{datos.limitsS.LCL.toFixed(3)}</p>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Capacidad del Proceso */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChartCard 
              title="Índices de Capacidad del Proceso" 
              color="#8B5CF6"
              icon="🎯"
            >
              <div style={{ height: '320px' }} data-chart data-chart-title="Índices de Capacidad del Proceso">
                <Bar data={dataTrend} options={optionsBar} />
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <span className="font-semibold text-gray-700">Cp (Capacidad Potencial)</span>
                  <span className={`text-xl font-bold ${capability.Cp >= 1.33 ? 'text-green-700' : capability.Cp >= 1.0 ? 'text-yellow-700' : 'text-red-700'}`}>
                    {capability.Cp.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <span className="font-semibold text-gray-700">Cpk (Capacidad Real)</span>
                  <span className={`text-xl font-bold ${capability.Cpk >= 1.33 ? 'text-green-700' : capability.Cpk >= 1.0 ? 'text-yellow-700' : 'text-red-700'}`}>
                    {capability.Cpk.toFixed(4)}
                  </span>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <p className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span>💡</span> Interpretación
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className={`flex items-start gap-2 p-2 rounded ${capability.Cp >= 1.33 ? 'bg-green-100' : capability.Cp >= 1.0 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                      <span className="font-bold">Cp:</span>
                      <span>{capability.Cp >= 1.33 ? '✓ Proceso capaz (≥1.33)' : capability.Cp >= 1.0 ? '⚠️ Aceptable (≥1.0)' : '✗ No capaz (<1.0)'}</span>
                    </div>
                    <div className={`flex items-start gap-2 p-2 rounded ${capability.Cpk >= 1.33 ? 'bg-green-100' : capability.Cpk >= 1.0 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                      <span className="font-bold">Cpk:</span>
                      <span>{capability.Cpk >= 1.33 ? '✓ Bien centrado (≥1.33)' : capability.Cpk >= 1.0 ? '⚠️ Revisar centrado (≥1.0)' : '✗ Mal centrado (<1.0)'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ChartCard>

            {/* Tabla Resumen */}
            <ChartCard 
              title="Resumen Estadístico" 
              color="#268BC9"
              icon="📋"
            >
              <div className="overflow-hidden rounded-xl border-2 border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                      <th className="p-3 text-left font-bold text-gray-700">Parámetro</th>
                      <th className="p-3 text-center font-bold text-gray-700">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="p-3 font-medium text-gray-700">Media (μ)</td>
                      <td className="p-3 text-center font-bold text-blue-700">{capability.mean.toFixed(4)}</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="p-3 font-medium text-gray-700">Desviación (σ)</td>
                      <td className="p-3 text-center font-bold text-orange-700">{capability.sigma.toFixed(4)}</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="p-3 font-medium text-gray-700">X̄ (Promedio de medias)</td>
                      <td className="p-3 text-center font-semibold">{limitsXToUse.CL.toFixed(4)}</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="p-3 font-medium text-gray-700">R̄ (Promedio de rangos)</td>
                      <td className="p-3 text-center font-semibold">{datos.limitsR.CL.toFixed(4)}</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="p-3 font-medium text-gray-700">S̄ (Promedio de desv.)</td>
                      <td className="p-3 text-center font-semibold">{datos.limitsS.CL.toFixed(4)}</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="p-3 font-bold text-gray-800">USL (Límite Superior)</td>
                      <td className="p-3 text-center font-bold text-blue-700">{datos.usl?.toFixed(4) || 'N/A'}</td>
                    </tr>
                    <tr className="bg-purple-50">
                      <td className="p-3 font-bold text-gray-800">LSL (Límite Inferior)</td>
                      <td className="p-3 text-center font-bold text-purple-700">{datos.lsl?.toFixed(4) || 'N/A'}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="p-3 font-bold text-gray-800">Subgrupos Totales</td>
                      <td className="p-3 text-center font-bold text-gray-900">{datos.means.length}</td>
                    </tr>
                    <tr className={outOfControlCount > 0 ? 'bg-red-100' : 'bg-green-100'}>
                      <td className="p-3 font-bold text-gray-800">Puntos Fuera de Control</td>
                      <td className="p-3 text-center">
                        <span className={`font-bold text-xl ${outOfControlCount > 0 ? 'text-red-700' : 'text-green-700'}`}>
                          {outOfControlCount}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {outOfControlCount > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-bold text-yellow-900 mb-1">Atención Requerida</p>
                      <p className="text-sm text-yellow-800">
                        Se detectaron <strong>{outOfControlCount}</strong> punto(s) fuera de los límites de control. 
                        Investiga las causas especiales de variación en tu proceso.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}