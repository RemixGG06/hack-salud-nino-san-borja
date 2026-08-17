import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Chip, 
  Grid,
  Divider 
} from '@mui/material';
import { 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  Home, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Network, 
  HeartHandshake 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface FinProcesoModalProps {
  open: boolean;
  onClose: () => void;
}

export const FinProcesoModal: React.FC<FinProcesoModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { resetDemo } = useApp();

  const handleReiniciar = () => {
    resetDemo();
    onClose();
    navigate('/');
  };

  const handleIrInicio = () => {
    onClose();
    navigate('/');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0'
        }
      }}
    >
      {/* Banner Superior de Celebración */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0B3B60 0%, #0065FF 50%, #00875A 100%)',
          color: '#FFFFFF',
          p: { xs: 3, sm: 4 },
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            border: '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Trophy size={38} color="#FFD700" />
        </Box>

        <Chip
          icon={<Sparkles size={14} color="#0B3B60" />}
          label="7 DE 7 ETAPAS COMPLETADAS CON ÉXITO"
          sx={{
            bgcolor: '#FEF08A',
            color: '#854D0E',
            fontWeight: '800',
            fontSize: '0.75rem',
            mb: 1.5,
            px: 1
          }}
        />

        <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: -0.5, mb: 1 }}>
          ¡Transición Clínica 100% Exitosa y Consolidada!
        </Typography>

        <Typography variant="body1" sx={{ opacity: 0.95, maxWidth: 620, mx: 'auto', fontSize: '1rem' }}>
          El ciclo de transferencia de <b>Lucía Mendoza Rivera</b> desde el <b>INSN San Borja</b> hacia el <b>Hospital Dos de Mayo</b> ha finalizado con cero deserción médica y adherencia garantizada.
        </Typography>
      </Box>

      {/* Contenido Principal: ¿Por qué este sistema es la mejor solución? */}
      <DialogContent sx={{ p: { xs: 3, sm: 4 }, bgcolor: '#F8FAFC' }}>
        <Typography 
          variant="subtitle1" 
          fontWeight="800" 
          color="primary.main" 
          align="center" 
          gutterBottom
        >
          🌟 ¿Por qué esta plataforma es la solución definitiva para el sector salud?
        </Typography>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 640, mx: 'auto', mb: 3 }}>
          Diseñada específicamente para resolver la fragmentación del sistema de salud peruano, eliminando las pérdidas de pacientes crónicos al cumplir la mayoría de edad:
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 2.5, border: '1px solid #E2E8F0', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ p: 1, bgcolor: '#EFF6FF', borderRadius: 2, color: '#0065FF' }}>
                  <Zap size={20} />
                </Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  1. Cero Pérdida de Información
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.5 }}>
                La <b>IA RAG médica</b> sintetiza años de historial pediátrico en segundos, evitando que el paciente deba repetir análisis costosos o reconstruir su historia de cero.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 2.5, border: '1px solid #E2E8F0', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ p: 1, bgcolor: '#F0FDF4', borderRadius: 2, color: '#047857' }}>
                  <ShieldCheck size={20} />
                </Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  2. Cero Rechazos Burocráticos
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.5 }}>
                El módulo de <b>Admisión SIS / QA</b> subsana errores de filiación, seguros y anexos antes del envío, impidiendo que las referencias reboten por trámites administrativos.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 2.5, border: '1px solid #E2E8F0', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ p: 1, bgcolor: '#FAF5FF', borderRadius: 2, color: '#9333EA' }}>
                  <Network size={20} />
                </Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  3. Interoperabilidad Real de Red
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.5 }}>
                Conecta al hospital emisor, la central REFCON nacional y al médico receptor de adultos con <b>Firma Digital DNIe (PKI MINSA)</b> y acuse de recibo formal.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 2.5, border: '1px solid #E2E8F0', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ p: 1, bgcolor: '#FFF1F2', borderRadius: 2, color: '#E11D48' }}>
                  <HeartHandshake size={20} />
                </Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  4. Enfoque Humano y Acompañamiento
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.5 }}>
                La <b>App Ruta 18+</b> y el <b>Seguimiento Longitudinal a 3 y 6 meses</b> empoderan al paciente joven para que no abandone su tratamiento en su vida adulta.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Botones de Acción para el Jurado */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<Home size={18} />}
            onClick={handleIrInicio}
            sx={{ fontWeight: 'bold', px: 3, py: 1.2, borderRadius: 2 }}
          >
            🏠 Regresar al Inicio (Portal del Jurado)
          </Button>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<RotateCcw size={18} />}
            onClick={handleReiniciar}
            sx={{ fontWeight: '800', px: 3.5, py: 1.2, borderRadius: 2, boxShadow: '0 4px 14px rgba(0, 135, 90, 0.3)' }}
          >
            🔄 Reiniciar Demo para Nueva Evaluación
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
