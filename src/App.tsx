import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { AppProvider } from './context/AppContext';

import { HomeJurado } from './pages/HomeJurado/HomeJurado';
import { MedicoPage } from './pages/Medico/MedicoPage';
import { AdminPage } from './pages/Admin/AdminPage';
import { RefconPage } from './pages/Refcon/RefconPage';
import { MedicoExternoPage } from './pages/MedicoExterno/MedicoExternoPage';
import { PacientePage } from './pages/Paciente/PacientePage';
import { ScrollToTop } from './components/common/ScrollToTop';

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomeJurado />} />
            <Route path="/medico" element={<MedicoPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/refcon" element={<RefconPage />} />
            <Route path="/medico-externo" element={<MedicoExternoPage />} />
            <Route path="/paciente" element={<PacientePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
