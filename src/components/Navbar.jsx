import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo_unimag.png";
import logoProgram from "../assets/logo_programa_industrial.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full ${
      isActive
        ? "bg-white text-[#268BC9] font-bold shadow-lg"
        : "text-white hover:bg-white/10 hover:translate-x-1 font-medium"
    }`;

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar - Lateral */}
      <nav className="hidden lg:flex fixed left-0 top-0 bg-gradient-to-b from-[#1B3A57] to-[#2C5282] w-64 h-screen shadow-2xl flex-col z-50 border-r-4 border-[#268BC9]">
        {/* Header con Logo */}
        <div className="p-6 border-b-2 border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <img
                src={logo}
                alt="Logo Universidad del Magdalena"
                className="w-16 h-16 object-contain rounded-xl bg-white/10 p-2 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1B3A57]"></div>
            </div>
            <div>
              <h1 className="text-white text-lg font-bold leading-tight">
                ControIMAG
              </h1>
              <p className="text-blue-200 text-xs font-medium">
                Sistema de Análisis
              </p>
            </div>
          </div>
          <div className="mt-3 h-1 bg-gradient-to-r from-[#268BC9] to-transparent rounded-full"></div>
        </div>

        {/* Enlaces de Navegación */}
        <div className="flex-1 py-6 px-4 overflow-y-auto">
          <div className="space-y-2">
            <NavLink to="/" className={linkStyle}>
              <span className="text-2xl">🏠</span>
              <span>Inicio</span>
            </NavLink>
            
            <NavLink to="/enterData" className={linkStyle}>
              <span className="text-2xl">📥</span>
              <span>Cargar Datos</span>
            </NavLink>
            
            <NavLink to="/graphics" className={linkStyle}>
              <span className="text-2xl">📊</span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/aiAnalysisTest" className={linkStyle}>
              <span className="text-2xl">✨</span>
              <span>Análisis IA</span>
            </NavLink>
          </div>

          {/* Sección de Ayuda */}
          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">💡</span>
              <h3 className="text-white text-sm font-bold">Ayuda Rápida</h3>
            </div>
            <p className="text-blue-200 text-xs leading-relaxed">
              Utiliza esta herramienta para analizar gráficos de control X̄-R y X̄-S de manera profesional.
            </p>
          </div>
        </div>

        {/* Footer - Facultad */}
        <div className="p-4 border-t-2 border-white/20">
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <img
                  src={logoProgram}
                  alt="Facultad de Ingeniería"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-white text-xs font-bold leading-tight">
                  Facultad de Ingeniería
                </p>
                <p className="text-blue-200 text-xs leading-tight mt-1">
                  Programa de Ingeniería Industrial
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-blue-200 text-xs font-medium">
              Universidad del Magdalena
            </p>
            <p className="text-blue-300 text-xs mt-1">
              © 2025
            </p>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar - Top */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-[#1B3A57] to-[#2C5282] shadow-2xl z-50 border-b-4 border-[#268BC9]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo y título */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={logo}
                alt="Logo Universidad del Magdalena"
                className="w-10 h-10 object-contain rounded-lg bg-white/10 p-1 shadow-lg"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1B3A57]"></div>
            </div>
            <div>
              <h1 className="text-white text-sm font-bold leading-tight">
                ControIMAG
              </h1>
              <p className="text-blue-200 text-xs">Análisis</p>
            </div>
          </div>

          {/* Botón de menú */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menú desplegable - Mobile */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-gradient-to-b from-[#1B3A57] to-[#2C5282] shadow-xl border-b-4 border-[#268BC9] animate-in fade-in slide-in-from-top-2">
            <div className="p-4 space-y-2">
              <NavLink
                to="/"
                className={linkStyle}
                onClick={handleLinkClick}
              >
                <span className="text-xl">🏠</span>
                <span>Inicio</span>
              </NavLink>
              
              <NavLink
                to="/enterData"
                className={linkStyle}
                onClick={handleLinkClick}
              >
                <span className="text-xl">📥</span>
                <span>Cargar Datos</span>
              </NavLink>
              
              <NavLink
                to="/graphics"
                className={linkStyle}
                onClick={handleLinkClick}
              >
                <span className="text-xl">📊</span>
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/aiAnalysisTest"
                className={linkStyle}
                onClick={handleLinkClick}
              >
                <span className="text-xl">✨</span>
                <span>Análisis IA</span>
              </NavLink>

              {/* Sección de Ayuda - Mobile */}
              <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💡</span>
                  <h3 className="text-white text-xs font-bold">Ayuda</h3>
                </div>
                <p className="text-blue-200 text-xs leading-relaxed">
                  Analiza gráficos de control X̄-R y X̄-S profesionalmente.
                </p>
              </div>

              {/* Footer - Mobile */}
              <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                    <img
                      src={logoProgram}
                      alt="Facultad"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-xs font-bold leading-tight">
                      Ingeniería Industrial
                    </p>
                    <p className="text-blue-200 text-xs leading-tight">
                      UNIMAGDALENA © 2025
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay para cerrar menú */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-40 mt-16"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Spacer para mobile */}
      <div className="lg:hidden h-16" />
    </>
  );
}