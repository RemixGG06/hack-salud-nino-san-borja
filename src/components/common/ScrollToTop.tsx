import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que asegura que al cambiar de ruta, vista o etapa,
 * la ventana del navegador siempre se posicione en la parte superior (top: 0),
 * permitiendo al usuario/jurado leer primero la guía y etapas antes de explorar el contenido.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Forzar scroll al inicio de la ventana de forma inmediata
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Asegurar compatibilidad en caso de scroll en contenedores específicos
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  return null;
};
