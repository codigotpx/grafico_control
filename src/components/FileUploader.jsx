import { useState } from "react";

function FileUploader({ onDataLoaded }) {
  const [, setData] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result.trim();
      const rows = text
        .split(/\r?\n/) 
        .filter(line => line.trim() !== "")
        .map(row =>
          row
            .split(/[;,]/) // acepta coma o punto y coma
            .map(x => parseFloat(x))
            .filter(num => !isNaN(num))
        );

      console.log("📂 Datos cargados:", rows);
      setData(rows);
      onDataLoaded(rows);
    };
    reader.readAsText(file);
  };

  const generateSimulated = () => {
    const simulated = Array.from({ length: 10 }, () =>
      Array.from({ length: 5 }, () => parseFloat((49 + Math.random() * 2).toFixed(2)))
    );
    console.log("⚙️ Datos simulados:", simulated);
    setData(simulated);
    onDataLoaded(simulated);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <label className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700">
        Cargar CSV
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="hidden"
        />
      </label>
      <button
        onClick={generateSimulated}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generar Datos Simulados
      </button>
    </div>
  );
}

export default FileUploader;
