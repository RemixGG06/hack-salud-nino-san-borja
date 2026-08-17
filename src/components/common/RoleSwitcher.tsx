import React from 'react';
import { Box, Button, ButtonGroup, Tooltip, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Stethoscope, 
  ClipboardCheck, 
  Building2, 
  UserCheck, 
  Smartphone, 
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RoleSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetDemo } = useApp();

  return (
    <Box
      className="role-switcher-container"
      sx={{
        position: 'fixed',
        bottom: { xs: 10, sm: 16 },
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1300,
        bgcolor: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'blur(16px)',
        borderRadius: 50,
        px: { xs: 1, sm: 2 },
        py: { xs: 0.6, sm: 0.9 },
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        display: 'flex',
        alignItems: 'center',
        gap: 0.8,
        maxWidth: '96vw',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {/* Botones de Roles por Vista */}
      <ButtonGroup variant="text" size="small" sx={{ gap: 0.5 }}>
        <Button
          onClick={() => navigate('/')}
          sx={{
            color: location.pathname === '/' ? '#60A5FA' : '#CBD5E1',
            fontWeight: location.pathname === '/' ? '800' : '500',
            bgcolor: location.pathname === '/' ? 'rgba(96, 165, 250, 0.15)' : 'transparent',
            borderRadius: '20px !important',
            minWidth: 'auto',
            px: 1.5,
          }}
          startIcon={<Home size={16} />}
        >
          Jurado
        </Button>

        <Button
          onClick={() => navigate('/medico')}
          sx={{
            color: location.pathname.startsWith('/medico') && !location.pathname.includes('externo') ? '#60A5FA' : '#CBD5E1',
            fontWeight: location.pathname.startsWith('/medico') && !location.pathname.includes('externo') ? '800' : '500',
            bgcolor: location.pathname.startsWith('/medico') && !location.pathname.includes('externo') ? 'rgba(96, 165, 250, 0.15)' : 'transparent',
            borderRadius: '20px !important',
            minWidth: 'auto',
            px: 1.5,
          }}
          startIcon={<Stethoscope size={16} />}
        >
          Médico INSN
        </Button>

        <Button
          onClick={() => navigate('/admin')}
          sx={{
            color: location.pathname === '/admin' ? '#60A5FA' : '#CBD5E1',
            fontWeight: location.pathname === '/admin' ? '800' : '500',
            bgcolor: location.pathname === '/admin' ? 'rgba(96, 165, 250, 0.15)' : 'transparent',
            borderRadius: '20px !important',
            minWidth: 'auto',
            px: 1.5,
          }}
          startIcon={<ClipboardCheck size={16} />}
        >
          Admisión SIS
        </Button>

        <Button
          onClick={() => navigate('/refcon')}
          sx={{
            color: location.pathname === '/refcon' ? '#C084FC' : '#CBD5E1',
            fontWeight: location.pathname === '/refcon' ? '800' : '500',
            bgcolor: location.pathname === '/refcon' ? 'rgba(192, 132, 252, 0.15)' : 'transparent',
            borderRadius: '20px !important',
            minWidth: 'auto',
            px: 1.5,
          }}
          startIcon={<Building2 size={16} />}
        >
          REFCON
        </Button>

        <Button
          onClick={() => navigate('/medico-externo')}
          sx={{
            color: location.pathname === '/medico-externo' ? '#FB923C' : '#CBD5E1',
            fontWeight: location.pathname === '/medico-externo' ? '800' : '500',
            bgcolor: location.pathname === '/medico-externo' ? 'rgba(251, 146, 60, 0.15)' : 'transparent',
            borderRadius: '20px !important',
            minWidth: 'auto',
            px: 1.5,
          }}
          startIcon={<UserCheck size={16} />}
        >
          Médico Adultos
        </Button>

        <Button
          onClick={() => navigate('/paciente')}
          sx={{
            color: location.pathname === '/paciente' ? '#34D399' : '#CBD5E1',
            fontWeight: location.pathname === '/paciente' ? '800' : '500',
            bgcolor: location.pathname === '/paciente' ? 'rgba(52, 211, 153, 0.15)' : 'transparent',
            borderRadius: '20px !important',
            minWidth: 'auto',
            px: 1.5,
          }}
          startIcon={<Smartphone size={16} />}
        >
          Paciente (App)
        </Button>
      </ButtonGroup>

      <Tooltip title="Reiniciar caso de prueba a la Etapa 1">
        <IconButton
          size="small"
          onClick={() => {
            resetDemo();
            navigate('/');
          }}
          sx={{
            color: '#F87171',
            bgcolor: 'rgba(239, 68, 68, 0.15)',
            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.3)' }
          }}
        >
          <RotateCcw size={16} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
