import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Alert,
  MenuItem
} from '@mui/material';
import {
  Building2,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  MessageSquare,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Hospital,
  Stethoscope,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Layout } from '../../components/common/Layout';
import { JudgeNote } from '../../components/common/JudgeNote';
import { NextStageModal } from '../../components/common/NextStageModal';
import { MapaMultidisciplinario, getCompatibilidadData } from '../../components/maps/MapaMultidisciplinario';
import { useApp } from '../../context/AppContext';
import { InstitutoMapa } from '../../types/schemas';
import institutosData from '../../data/institutos_mapa.json';

export const RefconPage: React.FC = () => {
  const { pacienteLucia, refconConfirmarReceptor } = useApp();
  const [currentTab, setCurrentTab] = useState(0);
  const [openModalConfirmar, setOpenModalConfirmar] = useState(false);
  const [showNextModal, setShowNextModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState('H001'); // Dos de Mayo
  const [fechaCita, setFechaCita] = useState('2026-09-02');
  const [horaCita, setHoraCita] = useState('08:30');
  const [isConfirmed, setIsConfirmed] = useState(pacienteLucia.etapa_numero >= 5);

  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'Dr. Carlos Ruiz (INSN)',
      role: 'Médico Tratante',
      time: '10:05 AM',
      text: 'Se solicita cupo prioritario en Reumatología y Nefrología para paciente Lucía Mendoza (17a 10m). Caso estable con biopsia adjunta.',
    },
    {
      sender: 'Lic. Carmen Flores (Admisión INSN)',
      role: 'Personal ADM',
      time: '10:30 AM',
      text: 'Ficha REFCON revisada con QA conforme. Seguro SIS Activo y DNI validado con RENIEC.',
    },
    {
      sender: 'Dr. Manuel Vargas (REFCON)',
      role: 'Coordinador REFCON',
      time: '11:15 AM',
      text: 'Recibido en bandeja central. Verificando disponibilidad de cupo en Hospital Dos de Mayo (Óptimo / Ideal).',
    }
  ]);
  const [newMsg, setNewMsg] = useState('');

  const handleSendMessage = () => {
    if (!newMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'Dr. Manuel Vargas (REFCON)',
        role: 'Coordinador REFCON',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: newMsg,
      }
    ]);
    setNewMsg('');
  };

  const handleConfirmarCupo = () => {
    refconConfirmarReceptor(selectedHospital, fechaCita, horaCita);
    setIsConfirmed(true);
    setOpenModalConfirmar(false);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setShowNextModal(true);
    }, 600);
  };

  return (
    <Layout actorTitle="Dr. Manuel Vargas" actorRole="Oficina Central de Referencias y Contrarreferencias (REFCON MINSA)">
      {/* Nota para el Jurado */}
      <JudgeNote
        visCode={currentTab === 0 ? "Central REFCON" : currentTab === 1 ? "Centros de Salud" : "Canal Oficial"}
        enfoque={currentTab === 0 ? "E1 - Central de Referencias y Kanban" : currentTab === 1 ? "E3 - Capacidad Resolutiva de Hospitales y Asignación de Cupo" : "E3 - Canal de Coordinación Oficial"}
        problemaReal="La coordinación entre hospitales y REFCON se hace mediante llamadas telefónicas que se pierden o correos sin registro, retrasando la asignación de citas en adultos."
        solucionPuente="REFCON tiene la última palabra sobre el destino del paciente: evalúa hospitales con cartera compatible en el mapa, coordina formalmente y registra la cita confirmada, activando la ruta para el paciente y el médico receptor."
      />

      {/* Tabs con nombres instructivos claros */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, bgcolor: '#FFFFFF', borderRadius: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, val) => setCurrentTab(val)} 
          textColor="primary" 
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              minHeight: 56,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              fontWeight: 'bold',
              textTransform: 'none'
            }
          }}
        >
          <Tab
            icon={<Building2 size={18} />}
            iconPosition="start"
            label="Central de Referencias (Bandeja / Kanban)"
          />
          <Tab
            icon={<Hospital size={18} />}
            iconPosition="start"
            label="Ver Centros de Salud (Especialidades)"
          />
          <Tab
            icon={<MessageSquare size={18} />}
            iconPosition="start"
            label="Comunicación Interna y Coordinación"
          />
        </Tabs>
      </Paper>

      {/* ========================================================================= */}
      {/* PESTAÑA 1: CENTRAL DE REFERENCIAS (KANBAN OPERATIVO) */}
      {/* ========================================================================= */}
      {currentTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="h6" fontWeight="700" color="primary.main">
                Central de Referencias: Bandeja de Pacientes en Transición
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supervisión nacional de referencias pediátrico-adultos para garantizar cupos antes de los 18 años.
              </Typography>
            </Box>

            {pacienteLucia.etapa_numero < 5 && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<MapPin size={18} />}
                onClick={() => setCurrentTab(1)}
                sx={{ fontWeight: 'bold' }}
              >
                Ir al Mapeo de Hospitales Receptores ➔
              </Button>
            )}
          </Box>

          <Grid container spacing={2}>
            {/* Columna 1: Pendiente */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0', minHeight: 400 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="700" color="text.secondary">1. PENDIENTE GESTIÓN</Typography>
                  <Chip label="1" size="small" />
                </Box>
                <Card sx={{ mb: 1.5, borderLeft: '4px solid #CBD5E1' }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography variant="subtitle2" fontWeight="bold">Mateo Quispe (17a)</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">Cardiopatía Congénita</Typography>
                    <Chip label="Prioridad Media" size="small" color="warning" sx={{ mt: 1, fontSize: '0.65rem' }} />
                  </CardContent>
                </Card>
              </Paper>
            </Grid>

            {/* Columna 2: Admisión SIS */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0', minHeight: 400 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="700" color="text.secondary">2. EN ADMISIÓN SIS</Typography>
                  <Chip label="1" size="small" />
                </Box>
                <Card sx={{ mb: 1.5, borderLeft: '4px solid #F59E0B' }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography variant="subtitle2" fontWeight="bold">Sofía Valdivia (17a)</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">Epilepsia Refractaria</Typography>
                    <Chip label="Revisión Documentos" size="small" sx={{ mt: 1, fontSize: '0.65rem' }} />
                  </CardContent>
                </Card>
              </Paper>
            </Grid>

            {/* Columna 3: En Evaluación REFCON */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#EFF6FF', borderRadius: 2.5, border: '1px solid #BFDBFE', minHeight: 400 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="700" color="primary.main">3. EVALUANDO RECEPTOR</Typography>
                  <Chip label={pacienteLucia.etapa_numero < 5 ? "1" : "0"} size="small" color="primary" />
                </Box>

                {pacienteLucia.etapa_numero < 5 && (
                  <Card sx={{ mb: 1.5, borderLeft: '4px solid #0065FF', boxShadow: '0 4px 12px rgba(0, 101, 255, 0.15)' }}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" fontWeight="bold">Lucía Mendoza (17a)</Typography>
                        <Chip label="Prioridad ALTA" size="small" color="error" sx={{ fontSize: '0.65rem' }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        Cardiopatía Congénita Corregida + Parche
                      </Typography>
                      <Typography variant="caption" color="primary.main" fontWeight="600" display="block" sx={{ mt: 0.5 }}>
                        Sugerido: Hosp. Dos de Mayo (Óptimo / Ideal)
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<MapPin size={15} />}
                        sx={{ mt: 1.5, fontWeight: 'bold' }}
                        onClick={() => setCurrentTab(1)}
                      >
                        Ir al Mapeo del Paciente ➔
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </Paper>
            </Grid>

            {/* Columna 4: Confirmado */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#F0FDF4', borderRadius: 2.5, border: '1px solid #BBF7D0', minHeight: 400 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="700" color="#047857">4. CITA CONFIRMADA</Typography>
                  <Chip label={pacienteLucia.etapa_numero >= 5 ? "2" : "1"} size="small" color="success" />
                </Box>

                {pacienteLucia.etapa_numero >= 5 && (
                  <Card sx={{ mb: 1.5, borderLeft: '4px solid #00875A', bgcolor: '#FFFFFF' }}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" fontWeight="bold">Lucía Mendoza (17a)</Typography>
                        <Chip label="Confirmada ✓" size="small" color="success" sx={{ fontSize: '0.65rem' }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        🏛️ {(institutosData as InstitutoMapa[]).find((h) => h.id === (pacienteLucia.instituto_confirmado_id || pacienteLucia.instituto_sugerido_id))?.nombre || 'Hospital Nacional Dos de Mayo'}
                      </Typography>
                      <Typography variant="caption" color="success.main" fontWeight="bold" display="block">
                        📅 Cita: {pacienteLucia.fecha_cita_adulta || fechaCita} - {pacienteLucia.hora_cita_adulta || horaCita}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        ⚡ Resumen Médico Diferido Habilitado
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                <Card sx={{ mb: 1.5, borderLeft: '4px solid #00875A', bgcolor: '#FFFFFF' }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography variant="subtitle2" fontWeight="bold">Joaquín Benítez (18a)</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">IRC en Hemodiálisis</Typography>
                    <Typography variant="caption" color="success.main" fontWeight="bold" display="block">
                      📅 Cita en Hosp. Loayza
                    </Typography>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 2: VER CENTROS DE SALUD (CAPACIDAD RESOLUTIVA Y ASIGNACIÓN DE CITA) */}
      {/* ========================================================================= */}
      {currentTab === 1 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
          {/* Banner Instructivo e Informativo */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              bgcolor: '#F0F7FF',
              border: '1px solid #BAE3FF',
              borderLeft: '5px solid #0065FF',
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ maxWidth: 800 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Hospital size={20} color="#0065FF" />
                  <Typography variant="subtitle1" fontWeight="800" color="primary.main">
                    Hospitales que cumplen con las especialidades requeridas para Lucía Mendoza:
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: '#1E293B', mb: 1.5, lineHeight: 1.6 }}>
                  Especialidades Requeridas: <b>⭐ Cardiología Adultos (Troncal / Unidad GUCH)</b> + <b>Cirugía Cardiovascular Adultos</b>.
                </Typography>

                <Alert severity="info" sx={{ bgcolor: '#FFFFFF', border: '1px solid #BAE3FF', py: 0.8, fontSize: '0.85rem' }}>
                  <b>Protocolo Operativo REFCON:</b> Una vez que el personal de REFCON establece comunicación con el centro de salud (mediante verificación de cartera o coordinación directa) y el centro confirma que puede atender al paciente, <b>se registra la cita</b> para habilitar el traslado y continuar con los demás procesos del sistema.
                </Alert>
              </Box>

              {pacienteLucia.etapa_numero < 5 ? (
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<PhoneCall size={18} />}
                  onClick={() => setOpenModalConfirmar(true)}
                  sx={{ fontWeight: '800', px: 3, py: 1.2, boxShadow: '0 4px 14px rgba(0, 135, 90, 0.3)' }}
                >
                  Registrar Cita Confirmada con Hospital Dos de Mayo
                </Button>
              ) : (
                <Chip
                  icon={<CheckCircle2 size={18} color="#00875A" />}
                  label="Cita Confirmada en Hosp. Dos de Mayo (02/09/2026)"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 'bold', p: 1.5, fontSize: '0.85rem' }}
                />
              )}
            </Box>
          </Paper>

          {/* Mapa Multidisciplinario Espacioso */}
          <MapaMultidisciplinario
            selectedHospitalId={selectedHospital}
            onSelectHospital={(h: InstitutoMapa) => {
              setSelectedHospital(h.id);
              setOpenModalConfirmar(true);
            }}
            buttonText="Agendar Cita Ya Confirmada por el Instituto Externo"
          />
        </Paper>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 3: COMUNICACIÓN INTERNA Y COORDINACIÓN */}
      {/* ========================================================================= */}
      {currentTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', height: 480 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1.5, borderBottom: '1px solid #E2E8F0' }}>
                <MessageSquare size={20} color="#0065FF" />
                <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                  Canal de Comunicación Interna: Caso Lucía Mendoza (REF-2026-04982)
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2, pr: 1 }}>
                {chatMessages.map((msg, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: msg.role.includes('REFCON') ? '#EFF6FF' : '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderLeft: msg.role.includes('REFCON') ? '4px solid #0065FF' : '4px solid #00875A',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight="bold" color="primary.main">
                        {msg.sender} <Chip label={msg.role} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{msg.time}</Typography>
                    </Box>
                    <Typography variant="body2">{msg.text}</Typography>
                  </Paper>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="Escribir mensaje formal de coordinación interna..."
                  size="small"
                  fullWidth
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button variant="contained" color="primary" onClick={handleSendMessage}>
                  <Send size={16} />
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
                Trazabilidad Legal REFCON
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Cada comunicación entre INSN San Borja, Admisión y la Central REFCON queda registrada formalmente con timestamp oficial para auditoría SUSALUD.
              </Typography>
              <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
                Reemplaza cadenas informales de WhatsApp o llamadas telefónicas sin acuse de recibo.
              </Alert>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Modal Asignar Cita y Registrar Cupo */}
      <Dialog open={openModalConfirmar} onClose={() => setOpenModalConfirmar(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShieldCheck size={22} color="#00875A" />
          Registro de Cita y Confirmación de Cupo
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Seleccione el hospital receptor que confirmó la disponibilidad de cupo y registre la fecha y hora de la primera cita para formalizar la transferencia de <b>Lucía Mendoza</b>:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="select-hospital-receptor"
                select
                label="Hospital Receptor Confirmado (Selección Libre de la Red)"
                fullWidth
                size="small"
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                helperText="Si el hospital propuesto no dispone de cupo, puede reasignar a cualquier otro centro con capacidad"
              >
                {(institutosData as InstitutoMapa[]).map((h) => {
                  const compat = getCompatibilidadData(h.match_score);
                  return (
                    <MenuItem key={h.id} value={h.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', py: 0.3 }}>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {h.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            📍 {h.direccion || 'Lima'} • Capacidad: {h.capacidad}
                          </Typography>
                        </Box>
                        <Chip
                          label={compat.nivel}
                          size="small"
                          color={compat.color}
                          sx={{ ml: 1.5, height: 22, fontSize: '0.7rem', fontWeight: 'bold' }}
                        />
                      </Box>
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="fecha-primera-cita"
                label="Fecha de Primera Cita"
                type="date"
                fullWidth
                size="small"
                value={fechaCita}
                onChange={(e) => setFechaCita(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="hora-atencion-cita"
                label="Hora de Atención"
                type="time"
                fullWidth
                size="small"
                value={horaCita}
                onChange={(e) => setHoraCita(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="success" sx={{ fontSize: '0.8rem' }}>
                <b>Efecto en el Sistema:</b> Al registrar la cita, se genera el <b>Resumen Médico-a-Médico</b> para el especialista de adultos y se habilita la <b>Ruta Geográfica 18+</b> en el celular del paciente.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenModalConfirmar(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleConfirmarCupo}
            startIcon={<CheckCircle2 size={16} />}
          >
            Registrar Cita y Confirmar Cupo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Alerta Guia para el Jurado para pasar a Medico Adultos */}
      <NextStageModal
        open={showNextModal}
        onClose={() => setShowNextModal(false)}
        titulo="Cupo Aprobado y Cita Registrada en Dos de Mayo"
        etapaCompletada="Etapa 5 Completada"
        siguienteActor="Dr. Fernando Morales (Reumatología Adultos)"
        siguienteVistaNombre="Médico Adultos (Dos de Mayo)"
        siguienteVistaRuta="/medico-externo"
        explicacionJurado="REFCON ha confirmado el cupo en el Hospital Dos de Mayo para el 02/09/2026 a las 08:30 AM. Al confirmarse el cupo, el sistema generó automáticamente el Resumen Médico Diferido para que el médico de adultos lo revise y recepcione el caso."
      />
    </Layout>
  );
};
