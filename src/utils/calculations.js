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
  console.log("=== DEBUG calculateCapability ===");
  console.log("data:", data);
  console.log("USL:", USL);
  console.log("LSL:", LSL);
  console.log("chartType:", chartType);

  // Validación de datos
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error("❌ Error: Datos inválidos");
    throw new Error("Datos inválidos para calcular capacidad");
  }

  if (USL === LSL) {
    console.error("❌ Error: USL === LSL");
    throw new Error("USL y LSL no pueden ser iguales");
  }

  if (USL < LSL) {
    console.error("❌ Error: USL < LSL");
    throw new Error("USL debe ser mayor que LSL");
  }

  const n = data[0].length;
  console.log("n (tamaño subgrupo):", n);

  const constForN = constants[n];
  console.log("constForN:", constForN);

  if (!constForN) {
    console.error(`❌ Error: No hay constantes para n=${n}`);
    console.log("Constantes disponibles:", Object.keys(constants));
    throw new Error(`No hay constantes definidas para n=${n}`);
  }

  // Calcular media global
  const allValues = data.flat();
  console.log("allValues.length:", allValues.length);
  console.log("Primeros valores:", allValues.slice(0, 10));

  const mean = allValues.reduce((a, b) => a + b, 0) / allValues.length;
  console.log("mean (μ):", mean);

  // Obtener sigma según el tipo de gráfico
  let sigma;

  if (chartType === 'xr') {
    console.log("Usando método X̄-R");
    // Para X̄-R: σ = R̄ / d2
    const ranges = data.map(row => Math.max(...row) - Math.min(...row));
    console.log("ranges:", ranges.slice(0, 10));
    
    const Rbar = ranges.reduce((a, b) => a + b, 0) / ranges.length;
    console.log("Rbar (promedio rangos):", Rbar);
    console.log("d2:", constForN.d2);
    
    sigma = Rbar / constForN.d2;
    console.log("sigma (X̄-R):", sigma);
    
  } else if (chartType === 'xs') {
    console.log("Usando método X̄-S");
    // Para X̄-S: σ = S̄ / c4
    const stds = data.map(row => {
      const rowMean = row.reduce((a, b) => a + b, 0) / row.length;
      const variance = row.reduce((sum, v) => sum + (v - rowMean) ** 2, 0) / (row.length - 1);
      return Math.sqrt(variance);
    });
    console.log("stds:", stds.slice(0, 10));
    
    const Sbar = stds.reduce((a, b) => a + b, 0) / stds.length;
    console.log("Sbar (promedio desviaciones):", Sbar);
    console.log("c4:", constForN.c4);
    
    sigma = Sbar / constForN.c4;
    console.log("sigma (X̄-S):", sigma);
  } else {
    console.error("❌ chartType inválido:", chartType);
    throw new Error(`chartType inválido: ${chartType}`);
  }

  // Validar sigma
  if (!sigma || sigma === 0 || sigma < 0) {
    console.error("❌ Error: Sigma inválida", sigma);
    throw new Error("Desviación estándar inválida o datos sin variación");
  }

  // Calcular Cp: (USL - LSL) / (6 * σ)
  const Cp = (USL - LSL) / (6 * sigma);
  console.log("Cp = (USL - LSL) / (6 * sigma)");
  console.log(`Cp = (${USL} - ${LSL}) / (6 * ${sigma})`);
  console.log("Cp:", Cp);

  // Calcular Cpk: min[(USL - μ) / (3σ), (μ - LSL) / (3σ)]
  const Cpu = (USL - mean) / (3 * sigma); // Capacidad superior
  const Cpl = (mean - LSL) / (3 * sigma); // Capacidad inferior
  console.log("Cpu (superior):", Cpu);
  console.log("Cpl (inferior):", Cpl);
  
  const Cpk = Math.min(Cpu, Cpl);
  console.log("Cpk = min(Cpu, Cpl) =", Cpk);

  // Calcular Cpm (Taguchi): (USL - LSL) / (6 * √[σ² + (μ - target)²])
  const target = (USL + LSL) / 2;
  const sigmaT = Math.sqrt(sigma ** 2 + (mean - target) ** 2);
  const Cpm = (USL - LSL) / (6 * sigmaT);
  console.log("Cpm:", Cpm);

  const resultado = {
    Cp: parseFloat(Cp.toFixed(4)),
    Cpk: parseFloat(Cpk.toFixed(4)),
    Cpm: parseFloat(Cpm.toFixed(4)),
    mean: parseFloat(mean.toFixed(4)),
    sigma: parseFloat(sigma.toFixed(4))
  };

  console.log("=== RESULTADO FINAL ===", resultado);
  console.log("================================");

  return resultado;
}