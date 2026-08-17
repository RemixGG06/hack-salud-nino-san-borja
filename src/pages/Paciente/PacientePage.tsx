import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Chip, 
  Avatar, 
  Card, 
  CardContent, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Alert,
  Divider,
  Checkbox
} from '@mui/material';
import { 
  Smartphone, 
  Calendar, 
  Clock, 
  MapPin, 
  Pill, 
  ShieldAlert, 
  Heart, 
  ChevronDown, 
  Navigation, 
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Layout } from '../../components/common/Layout';
import { JudgeNote } from '../../components/common/JudgeNote';
import { NextStageModal } from '../../components/common/NextStageModal';
import { MapaRutaPaciente } from '../../components/maps/MapaRutaPaciente';
import { useApp } from '../../context/AppContext';
import mockPacienteData from '../../data/mock_paciente_lucia.json';

export const PacientePage: React.FC = () => {
  const { pacienteLucia } = useApp();
  const [checkedPills, setCheckedPills] = useState<Record<number, boolean>>({ 0: true });
  const [showNextModal, setShowNextModal] = useState(false);

  const rutaData = mockPacienteData.ruta_18_paciente;
  const isConfirmado = pacienteLucia.etapa_numero >= 5;

  const togglePill = (idx: number) => {
    setCheckedPills((prev) => {
      const updated = { ...prev, [idx]: !prev[idx] };
      const totalMedicamentos = (rutaData.mis_medicamentos_diarios || []).length;
      if (Object.values(updated).filter(Boolean).length === totalMedicamentos && totalMedicamentos > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          setShowNextModal(true);
        }, 700);
      }
      return updated;
    });
  };

  return (
    <Layout actorTitle="Portal Ciudadano 18+" actorRole="Lucía Mendoza Rivera (17 años 10 meses)">
      {/* Nota para el Jurado */}
      <JudgeNote
        visCode="VIS 4.1 / VIS 4.2 / VIS 4.3"
        enfoque="E4 - Continuidad Clínica del Paciente Adolescente (App Móvil)"
        problemaReal="El 40% de los adolescentes abandonan el tratamiento al salir de pediatría por miedo al cambio, falta de comprensión de su enfermedad o por no saber cómo llegar físicamente al hospital."
        solucionPuente="Portal móvil sin jerga técnica con módulo psicológico de asimilación, checklist diario de medicamentos y ruta paso a paso en transporte público."
      />

      {/* Contenedor Central Mobile-First */}
      <Box sx={{ maxWidth: 700, mx: 'auto', pb: 4 }}>
        {/* Cabecera Móvil */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #047857 0%, #00875A 60%, #0B3B60 100%)',
            color: '#FFFFFF',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: '#FEF08A', color: '#854D0E', width: 44, height: 44, fontWeight: 'bold' }}>
                LM
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="800">
                  ¡Hola, Lucía! 👋
                </Typography>
                <Typography variant="caption" sx={{ color: '#D1FAE5' }}>
                  Tu transición guiada a la salud adulta
                </Typography>
              </Box>
            </Box>
            <Chip label="Pase Digital Activo" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 'bold' }} />
          </Box>

          {/* VIS 4.1: Estado de la Transición */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.95)', borderRadius: 2, color: '#172B4D' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Sparkles size={18} color="#00875A" />
              <Typography variant="subtitle2" fontWeight="bold" color="secondary.dark">
                ESTADO DE TU TRÁMITE
              </Typography>
            </Box>

            {isConfirmado ? (
              <Box>
                <Typography variant="body2" fontWeight="600" color="primary.main" gutterBottom>
                  🎉 ¡Tu cita en tu nuevo hospital ya está lista!
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Tus doctores del INSN San Borja ya enviaron toda tu historia clínica al <b>Hospital Nacional Dos de Mayo</b>.
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" fontWeight="600" color="warning.dark">
                  ⏳ Tu equipo médico está preparando tu traslado.
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Te avisaremos apenas tu cupo esté 100% confirmado.
                </Typography>
              </Box>
            )}
          </Paper>
        </Paper>

        {/* Tarjeta de Próxima Cita (Si está confirmado) */}
        {isConfirmado && (
          <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '2px solid #00875A', bgcolor: '#F0FDF4' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Calendar size={20} color="#00875A" />
              <Typography variant="subtitle1" fontWeight="bold" color="#047857">
                Tu Primera Cita en Adultos:
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Lugar:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {rutaData.mi_proximo_hospital.nombre_hospital}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {rutaData.mi_proximo_hospital.servicio_donde_ire}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Fecha y Hora:</Typography>
                <Typography variant="body2" fontWeight="bold" color="#047857">
                  📅 Miércoles 02 de Septiembre, 2026
                </Typography>
                <Typography variant="caption" fontWeight="600" color="primary.main">
                  ⏰ 08:30 AM (Llegar 08:00 AM)
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="caption" fontWeight="bold" color="text.secondary">
              ¿Qué debes llevar?
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {rutaData.mi_proximo_hospital.que_debo_llevar.map((item, idx) => (
                <Typography key={idx} variant="caption" display="block" color="text.primary">
                  ✓ {item}
                </Typography>
              ))}
            </Box>
          </Paper>
        )}

        {/* VIS 4.2: Módulo Psicológico y de Asimilación */}
        <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Heart size={20} color="#E11D48" />
            <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
              VIS 4.2: Módulo de Asimilación & Tu Condición
            </Typography>
          </Box>

          <Accordion defaultExpanded sx={{ mb: 1, border: '1px solid #E2E8F0', borderRadius: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ChevronDown size={18} />}>
              <Typography variant="subtitle2" fontWeight="bold">
                {rutaData.mi_diagnostico_explicado?.titulo || "¿Qué es mi Cardiopatía y qué cambia al cumplir 18?"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#334155', lineHeight: 1.6 }}>
                {rutaData.mi_diagnostico_explicado?.que_tengo}
              </Typography>
              <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#EFF6FF', borderRadius: 2, border: '1px solid #BFDBFE' }}>
                <Typography variant="caption" fontWeight="bold" color="primary.main">
                  A los 18 años:
                </Typography>
                <Typography variant="body2" color="#1E40AF">
                  {rutaData.mi_diagnostico_explicado?.que_significa_a_los_18}
                </Typography>
              </Paper>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 1, border: '1px solid #E2E8F0', borderRadius: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ChevronDown size={18} />}>
              <Typography variant="subtitle2" fontWeight="bold">
                Mitos y Verdades sobre tu Vida Diaria
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {(rutaData.mi_diagnostico_explicado?.mitos_y_verdades || []).map((item, idx) => (
                <Box key={idx} sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="error.main" fontWeight="bold">
                    ❌ Mito: "{item.mito}"
                  </Typography>
                  <Typography variant="body2" color="success.dark" fontWeight="500">
                    🟢 Realidad: {item.verdad}
                  </Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* Medicinas Diarias */}
        <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Pill size={20} color="#00875A" />
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                Tus Medicamentos Diarios
              </Typography>
            </Box>
            <Chip label="Marcar como tomada" size="small" variant="outlined" />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {rutaData.mis_medicamentos_diarios.map((med, idx) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: checkedPills[idx] ? '#F0FDF4' : '#F8FAFC',
                  border: checkedPills[idx] ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                onClick={() => togglePill(idx)}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Checkbox checked={!!checkedPills[idx]} color="success" sx={{ p: 0, mt: 0.2 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ textDecoration: checkedPills[idx] ? 'line-through' : 'none' }}>
                      {med.nombre_comercial_o_simple}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {med.para_que_sirve}
                    </Typography>
                    <Typography variant="caption" fontWeight="600" color="primary.main">
                      ⏰ {med.como_tomarlo}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            size="large"
            startIcon={<CheckCircle2 size={20} />}
            onClick={() => {
              confetti({ particleCount: 70, spread: 60 });
              setShowNextModal(true);
            }}
            sx={{ mt: 2, fontWeight: '800', py: 1.2, boxShadow: '0 4px 14px rgba(0, 135, 90, 0.3)' }}
          >
            Confirmar Medicación y Pasar a Etapa 7 (Seguimiento) ➔
          </Button>
        </Paper>

        {/* VIS 4.3: Ruta Geográfica al Hospital Dos de Mayo */}
        <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Navigation size={20} color="#0065FF" />
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                VIS 4.3: ¿Cómo llegar a tu nuevo hospital?
              </Typography>
            </Box>
            <Chip label="35 min en Metropolitano" color="info" size="small" sx={{ fontWeight: 'bold' }} />
          </Box>

          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
            Ruta calculada desde tu domicilio en Surquillo hasta el Pabellón 3 del Hospital Dos de Mayo.
          </Typography>

          <Box sx={{ mb: 2 }}>
            <MapaRutaPaciente />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            {(rutaData.ruta_como_llegar?.pasos_transporte || []).map((paso) => (
              <Box key={paso.paso} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: '#0B3B60' }}>
                  {paso.paso}
                </Avatar>
                <Typography variant="body2" sx={{ color: '#334155' }}>
                  {paso.detalle}
                </Typography>
              </Box>
            ))}
          </Box>

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            endIcon={<ExternalLink size={16} />}
            href={`https://www.google.com/maps/dir/?api=1&destination=-12.0558,-77.0142`}
            target="_blank"
          >
            Abrir Ruta en Google Maps
          </Button>
        </Paper>
      </Box>

      {/* Modal Alerta Guía para el Jurado para pasar a Etapa 7 */}
      <NextStageModal
        open={showNextModal}
        onClose={() => setShowNextModal(false)}
        titulo="Autonomía y Adherencia del Paciente Confirmada"
        etapaCompletada="Etapa 6 Completada"
        siguienteActor="Lic. Carmen Flores (Seguimiento Post-Transferencia)"
        siguienteVistaNombre="Seguimiento Post-Transferencia (Etapa 7)"
        siguienteVistaRuta="/admin?tab=2"
        explicacionJurado="Lucía ha revisado su guía educativa en la App Ruta 18+, aprendido sobre los cuidados de su cardiopatía congénita corregida y marcado sus medicamentos diarios. El caso pasa ahora a la Etapa 7 para la verificación telefónica con familiares y los controles longitudinales a 3 y 6 meses."
      />
    </Layout>
  );
};
