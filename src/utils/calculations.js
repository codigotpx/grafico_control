import { constants } from "./constants";

/**
 * Calcula los índices de capacidad del proceso (Cp y Cpk)
 * @param {Array<Array<number>>} data - Matriz de datos (subgrupos x observaciones)
 * @param {number} USL - Límite de especificación superior
 * @param {number} LSL - Límite de especificación inferior
 * @param {string} chartType - 'xr' para X̄-R o 'xs' para X̄-S
 * @returns {Object} Objeto con Cp, Cpk, Cpm, media y sigma
 */
export function calculateCapability(data, USL, LSL, chartType = 'xr') {

  // Validación de datos
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error("Datos inválidos para calcular capacidad");
  }

  if (USL === LSL) {
    throw new Error("USL y LSL no pueden ser iguales");
  }

  if (USL < LSL) {
    throw new Error("USL debe ser mayor que LSL");
  }

  const n = data[0].length;


  const constForN = constants[n];

  if (!constForN) {
    throw new Error(`No hay constantes definidas para n=${n}`);
  }

  // Calcular media global
  const allValues = data.flat();

  const mean = allValues.reduce((a, b) => a + b, 0) / allValues.length;

  // Obtener sigma según el tipo de gráfico
  let sigma;

  if (chartType === 'xr') {
    // Para X̄-R: σ = R̄ / d2
    const ranges = data.map(row => Math.max(...row) - Math.min(...row));
    
    const Rbar = ranges.reduce((a, b) => a + b, 0) / ranges.length;
    
    sigma = Rbar / constForN.d2;
    
  } else if (chartType === 'xs') {
    // Para X̄-S: σ = S̄ / c4
    const stds = data.map(row => {
      const rowMean = row.reduce((a, b) => a + b, 0) / row.length;
      const variance = row.reduce((sum, v) => sum + (v - rowMean) ** 2, 0) / (row.length - 1);
      return Math.sqrt(variance);
    });
    
    const Sbar = stds.reduce((a, b) => a + b, 0) / stds.length;
    sigma = Sbar / constForN.c4;

  } else {

    throw new Error(`chartType inválido: ${chartType}`);
  }

  // Validar sigma
  if (!sigma || sigma === 0 || sigma < 0) {
    throw new Error("Desviación estándar inválida o datos sin variación");
  }

  // Calcular Cp: (USL - LSL) / (6 * σ)
  const Cp = (USL - LSL) / (6 * sigma);


  // Calcular Cpk: min[(USL - μ) / (3σ), (μ - LSL) / (3σ)]
  const Cpu = (USL - mean) / (3 * sigma); // Capacidad superior
  const Cpl = (mean - LSL) / (3 * sigma); // Capacidad inferior

  
  const Cpk = Math.min(Cpu, Cpl);


  // Calcular Cpm (Taguchi): (USL - LSL) / (6 * √[σ² + (μ - target)²])
  const target = (USL + LSL) / 2;
  const sigmaT = Math.sqrt(sigma ** 2 + (mean - target) ** 2);
  const Cpm = (USL - LSL) / (6 * sigmaT);

  const resultado = {
    Cp: parseFloat(Cp.toFixed(4)),
    Cpk: parseFloat(Cpk.toFixed(4)),
    Cpm: parseFloat(Cpm.toFixed(4)),
    mean: parseFloat(mean.toFixed(4)),
    sigma: parseFloat(sigma.toFixed(4))
  };

  return resultado;
}