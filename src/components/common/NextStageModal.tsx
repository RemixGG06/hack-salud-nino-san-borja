import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  Chip, 
  Avatar 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

interface NextStageModalProps {
  open: boolean;
  onClose: () => void;
  titulo: string;
  etapaCompletada: string;
  siguienteVistaNombre: string;
  siguienteVistaRuta: string;
  siguienteActor: string;
  explicacionJurado: string;
}

export const NextStageModal: React.FC<NextStageModalProps> = ({
  open,
  onClose,
  titulo,
  etapaCompletada,
  siguienteVistaNombre,
  siguienteVistaRuta,
  siguienteActor,
  explicacionJurado,
}) => {
  const navigate = useNavigate();

  const handleNavigateNext = () => {
    onClose();
    window.scrollTo(0, 0);
    navigate(siguienteVistaRuta);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          border: '2px solid #00875A',
          overflow: 'hidden'
        }
      }}
    >
      {/* Banner Superior de Celebración */}
      <Box sx={{ bgcolor: '#00875A', p: 2.5, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
          <CheckCircle2 size={30} color="#FFFFFF" />
        </Avatar>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Chip 
              icon={<Sparkles size={14} color="#FEF08A" />} 
              label="¡PROCESO COMPLETADO!" 
              size="small" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#FEF08A', fontWeight: 'bold' }} 
            />
            <Chip 
              label={etapaCompletada} 
              size="small" 
              sx={{ bgcolor: '#FFFFFF', color: '#00875A', fontWeight: 'bold' }} 
            />
          </Box>
          <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2 }}>
            {titulo}
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 2.5, 
            bgcolor: '#F0FDF4', 
            border: '1px solid #BBF7D0', 
            borderRadius: 2 
          }}
        >
          <Typography variant="caption" fontWeight="bold" color="#047857" display="block" sx={{ mb: 0.5 }}>
            💡 GUÍA PARA EL JURADO EVALUADOR:
          </Typography>
          <Typography variant="body2" color="#166534" sx={{ lineHeight: 1.5 }}>
            {explicacionJurado}
          </Typography>
        </Paper>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            bgcolor: '#F8FAFC', 
            border: '1px solid #E2E8F0', 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 1, bgcolor: '#EFF6FF', borderRadius: 2, color: '#1D4ED8' }}>
              <UserCheck size={24} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Siguiente Actor Responsable:</Typography>
              <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                {siguienteActor}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Vista: <b>{siguienteVistaNombre}</b>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 0, justifyContent: 'space-between' }}>
        <Button onClick={onClose} sx={{ color: '#64748B' }}>
          Quedarme en esta vista
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="large"
          endIcon={<ArrowRight size={18} />}
          onClick={handleNavigateNext}
          sx={{ 
            fontWeight: '800', 
            px: 3, 
            py: 1.2,
            boxShadow: '0 4px 14px rgba(0, 135, 90, 0.35)'
          }}
        >
          Ir a {siguienteVistaNombre} ➔
        </Button>
      </DialogActions>
    </Dialog>
  );
};
