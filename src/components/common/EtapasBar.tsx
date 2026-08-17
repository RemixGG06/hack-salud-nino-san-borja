import React from 'react';
import { Box, Typography, Paper, Chip, Tooltip } from '@mui/material';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export interface EtapaDef {
  num: number;
  id: string;
  nombre: string;
  subtitulo: string;
  actor: string;
  path: string;
}

export const ETAPAS_SISTEMA: EtapaDef[] = [
  { num: 1, id: '1_IDENTIFICACION', nombre: '1. Detección', subtitulo: 'Identificación INSN', actor: 'Sistema', path: '/medico' },
  { num: 2, id: '2_EXTRACCION_IA', nombre: '2. Extracción IA', subtitulo: 'Análisis RAG', actor: 'IA / Pediatra', path: '/medico' },
  { num: 3, id: '3_MEDICO_VALIDADO', nombre: '3. Validación', subtitulo: 'Firma Pediatra', actor: 'Dr. Ruiz', path: '/medico' },
  { num: 4, id: '4_QA_ADMIN_APROBADO', nombre: '4. Admisión SIS', subtitulo: 'Validación SIS / RENIEC', actor: 'Admisión INSN', path: '/admin?tab=0' },
  { num: 5, id: '6_RECEPTOR_CONFIRMADO', nombre: '5. REFCON Cupo', subtitulo: 'Cita Dos de Mayo', actor: 'REFCON MINSA', path: '/refcon' },
  { num: 6, id: '7_MEDICO_EXTERNO_ACEPTADO', nombre: '6. Recepción', subtitulo: 'Acuse de Recibo', actor: 'Dr. Morales', path: '/medico-externo' },
  { num: 7, id: '8_SEGUIMIENTO_ACTIVO', nombre: '7. Seguimiento', subtitulo: 'Post-Transferencia', actor: 'Trabajo Social', path: '/admin?tab=2' },
];

export const EtapasBar: React.FC = () => {
  const { pacienteLucia } = useApp();
  const navigate = useNavigate();
  const currentNum = pacienteLucia.etapa_numero;

  return (
    <Paper
      elevation={0}
      className="judge-note-paper"
      sx={{
        p: { xs: 1.5, md: 2 },
        mb: 3,
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 3,
        boxShadow: '0 2px 10px rgba(11, 59, 96, 0.04)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Sparkles size={18} color="#00875A" />
          <Typography variant="subtitle2" fontWeight="800" color="primary.main" sx={{ letterSpacing: '0.02em' }}>
            GUÍA DE ETAPAS DEL PROCESO (1 AL 7)
          </Typography>
          <Chip
            label={`Etapa Actual: ${currentNum} de 7`}
            size="small"
            color={currentNum >= 5 ? 'success' : 'primary'}
            sx={{ fontWeight: 'bold', height: 22 }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Haz clic en cualquier etapa para ir directamente a la vista responsable
        </Typography>
      </Box>

      {/* Grid horizontal interactivo de las 7 etapas */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(7, 1fr)' },
          gap: 1,
        }}
      >
        {ETAPAS_SISTEMA.map((etapa) => {
          const isCompleted = currentNum > etapa.num || (etapa.num === 7 && pacienteLucia.asistencia_primera_cita);
          const isCurrent = currentNum === etapa.num && !isCompleted;
          const isPending = currentNum < etapa.num;

          let bg = '#F8FAFC';
          let border = '1px solid #E2E8F0';
          let textCol = '#64748B';
          let badgeBg = '#E2E8F0';
          let badgeCol = '#475569';

          if (isCompleted) {
            bg = '#F0FDF4';
            border = '1px solid #86EFAC';
            textCol = '#166534';
            badgeBg = '#00875A';
            badgeCol = '#FFFFFF';
          } else if (isCurrent) {
            bg = '#EFF6FF';
            border = '2px solid #0065FF';
            textCol = '#1E40AF';
            badgeBg = '#0065FF';
            badgeCol = '#FFFFFF';
          }

          return (
            <Tooltip
              key={etapa.num}
              title={`Etapa ${etapa.num}: ${etapa.nombre} (${etapa.subtitulo}) - Responsable: ${etapa.actor}. Clic para ver vista.`}
              arrow
            >
              <Paper
                elevation={0}
                onClick={() => navigate(etapa.path)}
                sx={{
                  p: 1.2,
                  borderRadius: 2,
                  bgcolor: bg,
                  border: border,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  },
                }}
              >
                {/* Header etapa */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      bgcolor: badgeBg,
                      color: badgeCol,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={14} color="#fff" /> : etapa.num}
                  </Box>
                  <Typography
                    variant="caption"
                    fontWeight="700"
                    sx={{
                      fontSize: '0.65rem',
                      color: isCompleted ? '#00875A' : isCurrent ? '#0065FF' : '#94A3B8',
                    }}
                  >
                    {isCompleted ? 'COMPLETADO ✓' : isCurrent ? 'EN CURSO ⚡' : 'PENDIENTE'}
                  </Typography>
                </Box>

                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{
                    color: textCol,
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {etapa.nombre}
                </Typography>

                <Typography
                  variant="caption"
                  display="block"
                  sx={{
                    color: isCurrent ? '#3B82F6' : '#94A3B8',
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {etapa.actor}
                </Typography>
              </Paper>
            </Tooltip>
          );
        })}
      </Box>
    </Paper>
  );
};
