import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface JudgeNoteProps {
  visCode: string; // ej: "VIS 1.2", "VIS 2.1"
  enfoque: string; // ej: "E2 - Análisis de IA sobre Historial"
  problemaReal: string;
  solucionPuente: string;
}

export const JudgeNote: React.FC<JudgeNoteProps> = ({
  visCode,
  enfoque,
  problemaReal,
  solucionPuente,
}) => {
  return (
    <Paper
      elevation={0}
      className="judge-note-paper"
      sx={{
        p: 2,
        mb: 3,
        bgcolor: '#F0F7FF',
        border: '1px solid #BAE3FF',
        borderLeft: '5px solid #0065FF',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lightbulb size={18} color="#0065FF" />
          <Typography variant="subtitle2" fontWeight="700" color="primary.main">
            💡 NOTA PARA EL JURADO
          </Typography>
          <Chip label={visCode} size="small" color="primary" sx={{ fontWeight: 'bold', height: 22 }} />
        </Box>
        <Chip label={enfoque} size="small" variant="outlined" sx={{ borderColor: '#0065FF', color: '#0065FF', height: 22, fontWeight: 500 }} />
      </Box>

      <Typography variant="body2" sx={{ color: '#334155', mb: 0.8 }}>
        <b>🔴 Problema Real:</b> {problemaReal}
      </Typography>
      <Typography variant="body2" sx={{ color: '#0F5132', display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
        <CheckCircle2 size={16} color="#0F5132" style={{ marginTop: 2, flexShrink: 0 }} />
        <span><b>🟢 Innovación PUENTE 18+:</b> {solucionPuente}</span>
      </Typography>
    </Paper>
  );
};
