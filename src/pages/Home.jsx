import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, Target, CheckCircle, ArrowRight, FileText, LineChart, AlertTriangle, Sparkles, Brain } from "lucide-react";

// eslint-disable-next-line no-unused-vars
function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4" style={{ borderTopColor: color }}>
      <div className="flex items-center gap-4 mb-3">
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20` }}>
          <Icon size={28} style={{ color }} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function StepCard({ number, title, description, icon: Icon }) {
  return (
    <div className="relative">
      <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {number}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={20} className="text-blue-600" />
              <h4 className="text-lg font-bold text-gray-800">{title}</h4>
            </div>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ text }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
      <p className="text-gray-700">{text}</p>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <BarChart3 size={18} />
              Control Estadístico de Procesos
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Monitorea y Optimiza tus
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Procesos</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Herramienta profesional para análisis de gráficos de control X̄-R y X̄-S con inteligencia artificial. 
              Identifica variaciones, detecta patrones anormales y mejora la calidad de tus procesos con insights automáticos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/enterData")}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Comenzar Análisis
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              
              <button
                onClick={() => navigate("/graphics")}
                className="bg-white hover:bg-gray-50 text-gray-800 font-semibold px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-gray-200"
              >
                Ver Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ¿Qué son los Gráficos de Control? */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                ¿Qué son los Gráficos de Control?
              </h2>
              <p className="text-blue-50 leading-relaxed mb-6">
                Los gráficos de control son herramientas estadísticas que permiten monitorear 
                un proceso a lo largo del tiempo para detectar variaciones anormales. 
                Fueron desarrollados por Walter Shewhart en la década de 1920 y son 
                fundamentales en el Control Estadístico de Procesos (SPC).
              </p>
              <div className="space-y-3">
                <BenefitItem text="Detecta variaciones especiales vs. comunes" />
                <BenefitItem text="Previene defectos antes de que ocurran" />
                <BenefitItem text="Mejora continua de la calidad" />
                <BenefitItem text="Reduce costos por retrabajos" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-center mb-4">
                <TrendingUp size={48} className="mx-auto mb-3" />
                <h3 className="text-xl font-bold">Análisis en Tiempo Real</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                  <span>Índice Cp</span>
                  <span className="font-bold">Capacidad Potencial</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                  <span>Índice Cpk</span>
                  <span className="font-bold">Capacidad Real</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                  <span>Alertas Western Electric</span>
                  <span className="font-bold">Detección Automática</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Características Principales */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Características Principales
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Todo lo que necesitas para un análisis profesional de control estadístico
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={LineChart}
            title="Gráficos X̄-R y X̄-S"
            description="Visualiza medias y rangos/desviaciones con límites de control calculados automáticamente según constantes estadísticas."
            color="#3B82F6"
          />
          
          <FeatureCard
            icon={Target}
            title="Análisis de Capacidad"
            description="Calcula índices Cp, Cpk y Cpm para evaluar si tu proceso cumple con las especificaciones requeridas."
            color="#8B5CF6"
          />
          
          <FeatureCard
            icon={AlertTriangle}
            title="Detección de Anomalías"
            description="Alertas automáticas basadas en reglas de Western Electric para identificar puntos fuera de control."
            color="#F59E0B"
          />
          
          <FeatureCard
            icon={FileText}
            title="Carga Flexible"
            description="Importa datos desde archivos CSV o ingresalos manualmente. Compatible con cualquier tamaño de muestra."
            color="#10B981"
          />
          
          <FeatureCard
            icon={BarChart3}
            title="Dashboard Interactivo"
            description="Visualización completa con gráficos dinámicos, KPIs y resumen estadístico en tiempo real."
            color="#EF4444"
          />
          
          <FeatureCard
            icon={Sparkles}
            title="Análisis con IA"
            description="Recibe recomendaciones automáticas basadas en inteligencia artificial para optimizar tu proceso."
            color="#06B6D4"
          />
        </div>
      </div>

      {/* Nueva sección: Análisis con IA */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-purple-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 flex items-center justify-center min-h-64">
                  <Brain size={120} className="text-purple-600 opacity-80" />
                </div>
              </div>
              
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Sparkles size={32} className="text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Análisis Inteligente con IA</h3>
                </div>
                
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Con implementación de inteligencia artificial analiza automáticamente tus resultados y te proporciona 
                  recomendaciones personalizadas para optimizar tus procesos.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Interpretación Automática</h4>
                      <p className="text-gray-600 text-sm">La IA analiza tus índices de capacidad y te explica qué significan en tu contexto</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Recomendaciones Personalizadas</h4>
                      <p className="text-gray-600 text-sm">Recibe sugerencias específicas para mejorar tu proceso basadas en los datos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Alertas Inteligentes</h4>
                      <p className="text-gray-600 text-sm">Detecta patrones y tendencias que podrían indicar problemas antes de que ocurran</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Insights Accionables</h4>
                      <p className="text-gray-600 text-sm">Información clara y directa sobre qué acciones tomar para optimizar calidad</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cómo Usar la Aplicación */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-xl text-gray-600">
              Sigue estos simples pasos para analizar tus datos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <StepCard
              number="1"
              icon={FileText}
              title="Carga tus Datos"
              description="Importa un archivo CSV o ingresa manualmente tus mediciones. Cada fila representa un subgrupo de observaciones."
            />
            
            <StepCard
              number="2"
              icon={Target}
              title="Configura Parámetros"
              description="Selecciona el tipo de gráfico (X̄-R o X̄-S) y define los límites de especificación superior (USL) e inferior (LSL)."
            />
            
            <StepCard
              number="3"
              icon={TrendingUp}
              title="Genera el Análisis"
              description="La aplicación calcula automáticamente límites de control, estadísticas y detecta puntos anormales."
            />
            
            <StepCard
              number="4"
              icon={Brain}
              title="Obtén Insights IA"
              description="Recibe análisis inteligente y recomendaciones personalizadas para optimizar tu proceso de forma continua."
            />
          </div>
        </div>
      </div>

      {/* Tipos de Gráficos */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tipos de Gráficos Soportados
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* X̄-R */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">R</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Gráficos X̄-R</h3>
            </div>
            <p className="text-gray-600 mb-4">
              <strong>Media y Rango:</strong> Ideal para tamaños de muestra pequeños (n ≤ 10).
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                <span>Usa constantes A2, D3, D4</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                <span>Monitorea el centro y la dispersión del proceso</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                <span>Cálculo rápido y sencillo</span>
              </li>
            </ul>
          </div>

          {/* X̄-S */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">S</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Gráficos X̄-S</h3>
            </div>
            <p className="text-gray-600 mb-4">
              <strong>Media y Desviación Estándar:</strong> Recomendado para muestras grandes (n {">"} 10).
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                <span>Usa constantes A3, B3, B4</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                <span>Más sensible a cambios en la variabilidad</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                <span>Mayor precisión estadística</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action Final */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            ¿Listo para Optimizar tus Procesos?
          </h2>
          <p className="text-xl text-blue-50 mb-8 leading-relaxed">
            Comienza ahora y descubre cómo el control estadístico con inteligencia artificial puede transformar 
            la calidad de tus productos y servicios.
          </p>
          <button
            onClick={() => navigate("/enterData")}
            className="group bg-white hover:bg-gray-100 text-blue-600 font-bold px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-3"
          >
            Iniciar Análisis Ahora
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            Control Estadístico de Procesos © 2025 | Desarrollado con IA para análisis profesional de calidad
          </p>
        </div>
      </div>
    </div>
  );
}