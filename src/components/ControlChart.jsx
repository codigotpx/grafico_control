import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

export default function ControlChart({ means, limits }) {
  if (!means || !Array.isArray(means) || means.length === 0 || !limits) {
    return <p className="text-gray-500">Cargando datos o sin datos disponibles...</p>;
  }

  // 🔍 Identificar puntos fuera de los límites
  const outOfControl = means.map((value) => value > limits.UCL || value < limits.LCL);

  const labels = means.map((_, i) => `Muestra ${i + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: "Valores",
        data: means,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        tension: 0.3,
        pointBackgroundColor: outOfControl.map((flag) => (flag ? "red" : "rgb(75,192,192)")),
        pointRadius: outOfControl.map((flag) => (flag ? 6 : 4)),
      },
      {
        label: "Límite Superior (UCL)",
        data: means.map(() => limits.UCL),
        borderColor: "rgb(255, 99, 132)",
        borderDash: [5, 5],
        pointRadius: 0,
      },
      {
        label: "Límite Inferior (LCL)",
        data: means.map(() => limits.LCL),
        borderColor: "rgb(255, 159, 64)",
        borderDash: [5, 5],
        pointRadius: 0,
      },
    ],
  };

  // 🔔 Mostrar alerta visual si hay puntos fuera de control
  const fueraDeControl = outOfControl.some((v) => v);

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      {fueraDeControl && (
        <div className="absolute -top-8 left-0 text-red-600 font-semibold pt-4">
          ⚠️ ¡Atención! Hay puntos fuera de control
        </div>
      )}
      <Line data={data} />
    </div>
  );
}
