import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Chip, 
  Divider, 
  TextField, 
  Alert, 
  Card, 
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  UserCheck, 
  CheckCircle2, 
  FileText, 
  ShieldAlert, 
  Pill, 
  Activity, 
  Clock, 
  Building2,
  Stethoscope,
  Send,
  Mail,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Layout } from '../../components/common/Layout';
import { JudgeNote } from '../../components/common/JudgeNote';
import { NextStageModal } from '../../components/common/NextStageModal';
import { useApp } from '../../context/AppContext';
import mockEpicrisisData from '../../data/mock_epicrisis_lucia.json';

export const MedicoExternoPage: React.FC = () => {
  const { pacienteLucia, medicoExternoConfirmarRecepcion } = useApp();
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [showNextModal, setShowNextModal] = useState(false);
  const [notasRecepcion, setNotasRecepcion] = useState('Caso revisado. Se programa historia clínica de adultos y orden de analítica de control renal para su cita del 02/09/2026.');
  const [isAceptado, setIsAceptado] = useState(pacienteLucia.recepcion_confirmada || false);

  const handleConfirmarRecepcion = () => {
    medicoExternoConfirmarRecepcion(notasRecepcion);
    setIsAceptado(true);
    setOpenModalConfirm(false);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setShowNextModal(true);
    }, 600);
  };

  const epicrisis = mockEpicrisisData.informe_epicrisis_traslado;

  return (
    <Layout actorTitle="Dr. Fernando Morales (CMP 39812)" actorRole="Cardiología Adultos / Unidad GUCH - Hospital Nacional Dos de Mayo">
      {/* Nota para el Jurado */}
      <JudgeNote
        visCode="VIS 5.1 / VIS 5.2 / VIS 5.3"
        enfoque="E5 - Acceso del Médico Receptor de Adultos y Cierre de Ciclo"
        problemaReal="El médico de adultos recibe al paciente sin conocer su historia previa, obligando al paciente a repetir todo y aumentando el riesgo de descompensación clínica."
        solucionPuente="El médico de adultos accede a un Resumen Médico-a-Médico ultra especializado y confirma la recepción previa, garantizando que la atención comience exactamente donde pediatría la dejó."
      />

      {/* Cabecera del Caso Asignado */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: '#FFF7ED', borderRadius: 2, color: '#EA580C' }}>
              <UserCheck size={28} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="700" color="primary.main">
                Caso Derivado: {epicrisis.paciente.nombres_completos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                DNI: {epicrisis.paciente.documento_identidad} • Edad: {epicrisis.paciente.edad_anios} años {epicrisis.paciente.meses} meses • Derivado desde: <b>INSN San Borja</b>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              label="Cita Agendada: 02/09/2026 - 08:30 AM"
              color="primary"
              sx={{ fontWeight: 'bold' }}
            />
            {isAceptado ? (
              <Chip label="Recepción Confirmada ✓" color="success" sx={{ fontWeight: 'bold' }} />
            ) : (
              <Chip label="Pendiente de Acuse de Recibo" color="warning" sx={{ fontWeight: 'bold' }} />
            )}
          </Box>
        </Box>
      </Paper>

      {/* VIS 5.2: Resumen Médico a Médico */}
      <Grid container spacing={3}>
        {/* Columna Principal: Informe Técnico Médico */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileText size={20} color="#0B3B60" />
                <Typography variant="h6" fontWeight="700" color="primary.main">
                  VIS 5.2: Resumen Clínico Médico-a-Médico
                </Typography>
              </Box>
              <Chip label={`Validado por: ${epicrisis.metadatos_validacion.medico_validador}`} size="small" variant="outlined" />
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Alertas Críticas */}
              <Box sx={{ bgcolor: '#FFF1F0', p: 2, borderRadius: 2, border: '1px solid #FFA39E' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ShieldAlert size={18} color="#CF1322" />
                  <Typography variant="subtitle2" fontWeight="bold" color="#CF1322">
                    ALERTAS CLÍNICAS CRÍTICAS Y ANTECEDENTES RELEVANTES:
                  </Typography>
                </Box>
                {epicrisis.resumen_curso_clinico.antecedentes_relevantes.map((ant, idx) => (
                  <Typography key={idx} variant="body2" color="#A8071A" sx={{ ml: 1 }}>
                    • {ant}
                  </Typography>
                ))}
              </Box>

              {/* Evolución Hospitalaria */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
                  Evolución Clínica Pediátrica (INSN San Borja):
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {epicrisis.resumen_curso_clinico.evolucion_hospitalaria}
                  </Typography>
                </Paper>
              </Box>

              {/* Biopsias e Intervenciones */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
                  Procedimientos e Intervenciones Clave:
                </Typography>
                {epicrisis.resumen_curso_clinico.procedimientos_intervenciones_realizadas.map((proc, idx) => (
                  <Paper key={idx} elevation={0} sx={{ p: 1.5, mb: 1, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight="600">{proc.descripcion}</Typography>
                      <Chip label={proc.fecha} size="small" sx={{ fontSize: '0.7rem' }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      <b>Hallazgos:</b> {proc.hallazgos}
                    </Typography>
                  </Paper>
                ))}
              </Box>

              {/* Medicación Activa */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Pill size={18} color="#00875A" />
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    Esquema Terapéutico al Momento de la Transferencia:
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  {epicrisis.estado_actual_pre_traslado.medicacion_activa_al_traslado.map((med, idx) => (
                    <Paper 
                      key={idx} 
                      elevation={0} 
                      sx={{ 
                        px: 2.2, 
                        py: 1.2, 
                        bgcolor: '#F0FDF4', 
                        borderRadius: 2, 
                        border: '1px solid #BBF7D0', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.2 
                      }}
                    >
                      <Pill size={16} color="#047857" />
                      <Typography variant="subtitle2" fontWeight="bold" color="#047857">
                        {med.farmaco}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>

              {/* Recomendaciones */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
                  Recomendaciones del Pediatra para el Servicio de Adultos:
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#EFF6FF', borderRadius: 2, border: '1px solid #BFDBFE' }}>
                  {epicrisis.pendientes_y_plan.recomendaciones_receptor.map((rec, idx) => (
                    <Typography key={idx} variant="body2" color="#1E40AF" sx={{ mb: 0.5 }}>
                      ✓ {rec}
                    </Typography>
                  ))}
                </Paper>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Canal de Comunicación Directa Médico-a-Médico (Pediatra Emisor) */}
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid #CBD5E1' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, bgcolor: '#EFF6FF', borderRadius: 2, color: '#1D4ED8' }}>
                      <Stethoscope size={22} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                        Médico Pediatra Tratante (Emisor): Dr. Carlos Ruiz Medina
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        CMP 45678 • RNE 23456 (Reumatología Pediátrica - INSN San Borja)
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<Mail size={14} color="#0065FF" />}
                      label="carlos.ruiz@insnsb.gob.pe"
                      component="a"
                      href="mailto:carlos.ruiz@insnsb.gob.pe?subject=Consulta%20Médico-a-Médico%20Transición%20Lucía%20Mendoza%20(INSN-2026-04982)"
                      clickable
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: '600', fontSize: '0.75rem', cursor: 'pointer' }}
                    />
                    <Chip
                      icon={<Phone size={14} color="#047857" />}
                      label="(01) 230-0600 Anexo 4120"
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: '600', fontSize: '0.75rem' }}
                    />
                  </Box>
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                  💬 Para interconsultas médicas directas o aclaración sobre esquemas de desmonte de fármacos, puede escribir directamente al correo institucional del Dr. Ruiz.
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </Grid>

        {/* Columna Lateral: VIS 5.3 Confirmación de Recepción */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', position: 'sticky', top: 80 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CheckCircle2 size={20} color="#00875A" />
              <Typography variant="h6" fontWeight="700" color="primary.main">
                VIS 5.3: Acuse de Recibo y Cierre de Ciclo
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Al confirmar la recepción, el INSN San Borja recibe la confirmación automática de que el caso fue asumido por el Hospital Dos de Mayo.
            </Typography>

            {isAceptado ? (
              <Box>
                <Alert severity="success" sx={{ mb: 2 }}>
                  <b>¡Caso Recepcionado con Éxito!</b><br />
                  Se ha generado la historia de adultos en el Hospital Dos de Mayo y se ha cerrado el ciclo en el Kanban central.
                </Alert>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                  <Typography variant="caption" color="text.secondary">Notas Registradas:</Typography>
                  <Typography variant="body2">{notasRecepcion}</Typography>
                </Paper>
              </Box>
            ) : (
              <Box>
                <TextField
                  label="Notas de Preparación para la 1ra Cita"
                  multiline
                  rows={3}
                  fullWidth
                  size="small"
                  value={notasRecepcion}
                  onChange={(e) => setNotasRecepcion(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  startIcon={<CheckCircle2 size={18} />}
                  onClick={() => setOpenModalConfirm(true)}
                  sx={{ fontWeight: 'bold', py: 1.2 }}
                >
                  Confirmar Recepción del Paciente
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Modal Confirmar Recepción */}
      <Dialog open={openModalConfirm} onClose={() => setOpenModalConfirm(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Confirmar Recepción de Lucía Mendoza</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Usted confirmará al INSN San Borja que el Servicio de Reumatología Adultos del Hospital Dos de Mayo cuenta con el historial y espera a la paciente el <b>02/09/2026</b>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModalConfirm(false)}>Cancelar</Button>
          <Button variant="contained" color="secondary" onClick={handleConfirmarRecepcion}>
            Confirmar Recepción
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Alerta Guia para el Jurado para pasar a la App del Paciente */}
      <NextStageModal
        open={showNextModal}
        onClose={() => setShowNextModal(false)}
        titulo="Caso Recepcionado y Ciclo Cerrado"
        etapaCompletada="Etapa 6 Completada"
        siguienteActor="Lucía Mendoza (Paciente / Familia)"
        siguienteVistaNombre="App del Paciente (Lucía)"
        siguienteVistaRuta="/paciente"
        explicacionJurado="El Dr. Morales en el Hospital Dos de Mayo ha revisado el resumen médico y confirmado la recepción previa. Ahora explore el Portal Ciudadano / App Móvil para ver cómo Lucía asimila su condición y visualiza su ruta de llegada."
      />
    </Layout>
  );
};
