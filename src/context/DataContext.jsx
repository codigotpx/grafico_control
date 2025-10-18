import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [datos, setDatos] = useState(null);

  // Función helper para validar datos antes de guardar
  const setDatosValidated = (newData) => {
    if (!newData) {
      setDatos(null);
      return;
    }

    // Validación básica de estructura
    const requiredFields = [
      'means', 'ranges', 'stds', 
      'limitsXR', 'limitsXS', 'limitsR', 'limitsS'
    ];

    const isValid = requiredFields.every(field => 
      Object.prototype.hasOwnProperty.call(newData, field) && newData[field] !== null
    );

    if (isValid) {
      setDatos(newData);
    } else {
      console.error('Datos inválidos:', newData);
      console.error('Campos faltantes:', requiredFields.filter(f => !Object.prototype.hasOwnProperty.call(newData, f)));
    }
  };

  return (
    <DataContext.Provider value={{ datos, setDatos: setDatosValidated }}>
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe usarse dentro de DataProvider');
  }
  return context;
};