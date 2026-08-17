import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Chip 
} from '@mui/material';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RoleSwitcher } from './RoleSwitcher';
import { EtapasBar } from './EtapasBar';
import logoHealthTech from '../../assets/logo.png';

interface LayoutProps {
  children: React.ReactNode;
  actorTitle?: string;
  actorRole?: string;
  hideEtapasBar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  actorTitle = 'PUENTE 18+',
  actorRole = 'Sistema de Transición Especializada',
  hideEtapasBar = false,
}) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', pb: 12 }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#0B3B60', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: { xs: 0.8, sm: 1.2 }, minHeight: { xs: 64, sm: 76 }, px: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Logo Oficial PUENTE 18+ Agrandado */}
              <Box 
                component="img"
                src={logoHealthTech}
                alt="Logo PUENTE 18+"
                onClick={() => navigate('/')}
                sx={{
                  height: { xs: 50, sm: 64 },
                  width: 'auto',
                  objectFit: 'contain',
                  cursor: 'pointer',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="h6" 
                    fontWeight="800" 
                    onClick={() => navigate('/')}
                    sx={{ 
                      letterSpacing: '0.02em', 
                      color: '#fff', 
                      fontSize: { xs: '1.15rem', sm: '1.35rem' },
                      cursor: 'pointer',
                      lineHeight: 1.2
                    }}
                  >
                    PUENTE 18+
                  </Typography>
                  <Chip
                    label="INSN San Borja"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: '#E0F2FE',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      height: 20,
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#93C5FD', display: 'block', lineHeight: 1 }}>
                  Continuidad y Transición Clínica Pediátrico-Adulto
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                <Typography variant="subtitle2" fontWeight="700" sx={{ color: '#fff' }}>
                  {actorTitle}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  {actorRole}
                </Typography>
              </Box>
              <Chip
                icon={<ShieldCheck size={16} color="#34D399" />}
                label="MINSA / REFCON Conectado"
                size="small"
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  bgcolor: 'rgba(52, 211, 153, 0.12)',
                  color: '#34D399',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, flexGrow: 1, px: { xs: 1.5, sm: 3 } }}>
        {/* Barra Visual de las 7 Etapas */}
        {!hideEtapasBar && <EtapasBar />}
        {children}
      </Container>

      <RoleSwitcher />
    </Box>
  );
};
