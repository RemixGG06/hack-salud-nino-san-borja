import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Tabs, 
  Tab, 
  TextField, 
  Alert,
  Card, 
  CardContent, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Divider, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Tooltip
} from '@mui/material';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  Clock, 
  Send, 
  FileSearch, 
  HeartHandshake, 
  CalendarCheck,
  Printer,
  Download,
  Edit3,
  ShieldCheck,
  FileText,
  AlertCircle,
  Building,
  UserCheck,
  PhoneCall
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Layout } from '../../components/common/Layout';
import { JudgeNote } from '../../components/common/JudgeNote';
import { NextStageModal } from '../../components/common/NextStageModal';
import { FinProcesoModal } from '../../components/common/FinProcesoModal';
import { useApp } from '../../context/AppContext';
import mockRefconData from '../../data/mock_refcon_lucia.json';

export const AdminPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    pacienteLucia, 
    todosLosPacientes, 
    adminAprobarQA, 
    adminRegistrarAsistencia, 
    adminRegistrarSeguimiento 
  } = useApp();
  
  const [currentTab, setCurrentTab] = useState(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === '2' || tabParam === 'seguimiento') return 2;
    if (tabParam === '1' || tabParam === 'tablero') return 1;
    return 0; // QA por defecto
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === '2' || tabParam === 'seguimiento') {
      setCurrentTab(2);
    } else if (tabParam === '1' || tabParam === 'tablero') {
      setCurrentTab(1);
    } else if (tabParam === '0' || tabParam === 'qa') {
      setCurrentTab(0);
    }
  }, [searchParams]);

  const [openModalQA, setOpenModalQA] = useState(false);
  const [showNextModal, setShowNextModal] = useState(false);
  const [qaAprobado, setQaAprobado] = useState(pacienteLucia.ficha_refcon_qa || false);

  // Estados de Seguimiento y Llamada a Familiares
  const [llamadaRealizada, setLlamadaRealizada] = useState(pacienteLucia.asistencia_primera_cita || false);
  const [resultadoLlamada, setResultadoLlamada] = useState<'CONTESTADA' | 'NO_CONTESTA' | 'PENDIENTE'>('CONTESTADA');
  const [bitacoraLlamada, setBitacoraLlamada] = useState(
    'Contacto telefónico con Sra. Rosa Rivera (Madre). Confirma que asistieron juntas al Hospital Dos de Mayo el 02/09/2026. Fueron atendidas por el Dr. Morales en Reumatología, se aperturó la historia clínica de adultos y se entregó receta de mantenimiento.'
  );

  // Estados de bloqueo y apertura progresiva de 3 y 6 meses
  const [eval3mConfirmada, setEval3mConfirmada] = useState<boolean>(pacienteLucia.seguimiento_3m === 'EN_TRATAMIENTO');
  const [eval6mConfirmada, setEval6mConfirmada] = useState<boolean>(pacienteLucia.seguimiento_6m === 'EN_TRATAMIENTO');
  const [estado3m, setEstado3m] = useState<'EN_TRATAMIENTO' | 'PENDIENTE' | 'PERDIDA'>(pacienteLucia.seguimiento_3m || 'EN_TRATAMIENTO');
  const [estado6m, setEstado6m] = useState<'EN_TRATAMIENTO' | 'PENDIENTE' | 'PERDIDA'>(pacienteLucia.seguimiento_6m || 'EN_TRATAMIENTO');
  const [showFinProcesoModal, setShowFinProcesoModal] = useState(false);

  // Estados editables de la Ficha REFCON para subsanación administrativa
  const [nombresPaciente, setNombresPaciente] = useState(mockRefconData.ficha_referencia_minsa.datos_paciente.nombres);
  const [apellidosPaciente, setApellidosPaciente] = useState(mockRefconData.ficha_referencia_minsa.datos_paciente.apellidos);
  const [dniPaciente, setDniPaciente] = useState(mockRefconData.ficha_referencia_minsa.datos_paciente.dni);
  const [seguroSalud, setSeguroSalud] = useState(mockRefconData.ficha_referencia_minsa.datos_paciente.tipo_seguro);
  const [domicilio, setDomicilio] = useState(mockRefconData.ficha_referencia_minsa.datos_paciente.domicilio);
  const [telefono, setTelefono] = useState(mockRefconData.ficha_referencia_minsa.datos_paciente.telefono_contacto);
  const [apoderado, setApoderado] = useState(mockRefconData.ficha_referencia_minsa.datos_paciente.nombre_apoderado);
  
  const [origenRenaes, setOrigenRenaes] = useState(mockRefconData.ficha_referencia_minsa.datos_establecimientos.origen_renaes);
  const [upsOrigen, setUpsOrigen] = useState(mockRefconData.ficha_referencia_minsa.datos_establecimientos.ups_origen);
  const [destinoRenaes, setDestinoRenaes] = useState(mockRefconData.ficha_referencia_minsa.datos_establecimientos.destino_sugerido_renaes);
  const [upsDestino, setUpsDestino] = useState(mockRefconData.ficha_referencia_minsa.datos_establecimientos.ups_destino);

  const [anamnesisRefcon, setAnamnesisRefcon] = useState(mockRefconData.ficha_referencia_minsa.resumen_clinico_referencia.anamnesis_breve);
  const [examenFisico, setExamenFisico] = useState(mockRefconData.ficha_referencia_minsa.resumen_clinico_referencia.examen_fisico_breve);
  const [motivoReferencia, setMotivoReferencia] = useState(mockRefconData.ficha_referencia_minsa.condiciones_traslado.motivo_referencia);

  // Checklist de QA
  const [qaCheckedDni, setQaCheckedDni] = useState(true);
  const [qaCheckedSis, setQaCheckedSis] = useState(true);
  const [qaCheckedAnexos, setQaCheckedAnexos] = useState(true);
  const [qaCheckedConsentimiento, setQaCheckedConsentimiento] = useState(true);
  const [qaObservaciones, setQaObservaciones] = useState(
    'Ficha REFCON pre-llenada por IA validada y subsanada por Admisión. DNI consultado en RENIEC, SIS Gratuito Activo sin deuda y Biopsia Renal 2024 adjunta.'
  );

  const handlePrintDocument = () => {
    window.print();
  };

  const handleAprobarQA = () => {
    adminAprobarQA(qaObservaciones);
    setQaAprobado(true);
    setOpenModalQA(false);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setShowNextModal(true);
    }, 600);
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'ALTA': return 'error';
      case 'MEDIA': return 'warning';
      default: return 'success';
    }
  };

  return (
    <Layout actorTitle="Lic. Carmen Flores" actorRole="Coordinación de Admisión SIS y Referencias - INSN San Borja">
      {/* Nota para el Jurado */}
      <JudgeNote
        visCode="Admisión SIS / Subsanación"
        enfoque="E1 y E2 - Admisión SIS, Subsanación Administrativa y Validez en Papel"
        problemaReal="En el sistema de salud peruano, miles de referencias son rechazadas por errores subsanables (datos de filiación, código de seguro o falta de formato físico oficial)."
        solucionPuente="La Ficha REFCON aparece pre-llenada por IA. El personal de enfermería/licenciadas de Admisión SIS puede corregir y subsanar cualquier campo, descargar/imprimir el documento oficial para validez en papel, y remitir a REFCON."
      />

      {/* Selector de Pestañas */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, bgcolor: '#FFFFFF', borderRadius: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, val) => {
            setCurrentTab(val);
            setSearchParams({ tab: String(val) });
          }} 
          textColor="primary" 
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              minHeight: 56,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              fontWeight: 600
            }
          }}
        >
          <Tab icon={<FileSearch size={18} />} iconPosition="start" label="Ficha REFCON Oficial & Admisión SIS" />
          <Tab icon={<ClipboardCheck size={18} />} iconPosition="start" label="Tablero General de Transición" />
          <Tab icon={<HeartHandshake size={18} />} iconPosition="start" label="Seguimiento Post-Transferencia (3 y 6 meses)" />
        </Tabs>
      </Paper>

      {/* ========================================================================= */}
      {/* PESTAÑA 1: VIS 2.2 FICHA REFCON EDITABLE, QA Y DESCARGA OFICIAL */}
      {/* ========================================================================= */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
          {/* Columna Principal: Ficha Oficial MINSA / INSN pre-llenada y editable */}
          <Grid item xs={12} lg={8}>
            <Paper
              id="printable-refcon"
              elevation={2}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                bgcolor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                position: 'relative',
              }}
            >
              {/* Encabezado Formal de Ficha REFCON */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, borderBottom: '2px solid #0B3B60', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">
                    SISTEMA DE REFERENCIA Y CONTRARREFERENCIA - MINSA PERÚ
                  </Typography>
                  <Typography variant="h6" fontWeight="800" color="primary.main">
                    HOJA DE REFERENCIA OFICIAL DE SALUD (FORMATO REFCON N° 01)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Código Trámite: <b>REF-2026-INSN-04982</b> • Origen: <b>INSN San Borja</b>
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<Printer size={16} />}
                    onClick={handlePrintDocument}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Imprimir Físico (Validez de Papel)
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<Download size={16} />}
                    onClick={handlePrintDocument}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Descargar PDF Oficial
                  </Button>
                </Box>
              </Box>

              <Alert severity="info" sx={{ mb: 3, py: 0.5, fontSize: '0.82rem' }}>
                <b>Ficha Pre-llenada por IA:</b> La licenciada de admisión puede editar y subsanar cualquier campo antes de aprobar el QA y remitir a la Central REFCON.
              </Alert>

              {/* SECCIÓN 1: DATOS DEL PACIENTE (EDITABLE) */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="800" color="primary.main" sx={{ bgcolor: '#F1F5F9', p: 1, borderRadius: 1, mb: 1.5 }}>
                  I. DATOS DE IDENTIFICACIÓN Y FILIACIÓN DEL PACIENTE
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Nombres"
                      fullWidth
                      size="small"
                      value={nombresPaciente}
                      onChange={(e) => setNombresPaciente(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      label="Apellidos"
                      fullWidth
                      size="small"
                      value={apellidosPaciente}
                      onChange={(e) => setApellidosPaciente(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      label="DNI"
                      fullWidth
                      size="small"
                      value={dniPaciente}
                      onChange={(e) => setDniPaciente(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Tipo de Seguro"
                      fullWidth
                      size="small"
                      value={seguroSalud}
                      onChange={(e) => setSeguroSalud(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      label="Dirección / Domicilio Actual"
                      fullWidth
                      size="small"
                      value={domicilio}
                      onChange={(e) => setDomicilio(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      label="Teléfono Móvil"
                      fullWidth
                      size="small"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Nombre del Apoderado / Cuidadores"
                      fullWidth
                      size="small"
                      value={apoderado}
                      onChange={(e) => setApoderado(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* SECCIÓN 2: ESTABLECIMIENTOS DE ORIGEN Y DESTINO (EDITABLE) */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="800" color="primary.main" sx={{ bgcolor: '#F1F5F9', p: 1, borderRadius: 1, mb: 1.5 }}>
                  II. ESTABLECIMIENTOS DE ORIGEN Y DESTINO PROPUESTO
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Establecimiento Origen (RENAES)"
                      fullWidth
                      size="small"
                      value={origenRenaes}
                      onChange={(e) => setOrigenRenaes(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="UPS Origen"
                      fullWidth
                      size="small"
                      value={upsOrigen}
                      onChange={(e) => setUpsOrigen(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Establecimiento Destino Sugerido (RENAES)"
                      fullWidth
                      size="small"
                      value={destinoRenaes}
                      onChange={(e) => setDestinoRenaes(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="UPS Destino Requerida"
                      fullWidth
                      size="small"
                      value={upsDestino}
                      onChange={(e) => setUpsDestino(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* SECCIÓN 3: RESUMEN CLÍNICO Y MOTIVO (EDITABLE) */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="800" color="primary.main" sx={{ bgcolor: '#F1F5F9', p: 1, borderRadius: 1, mb: 1.5 }}>
                  III. RESUMEN CLÍNICO Y MOTIVO DE LA REFERENCIA
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={12}>
                    <TextField
                      label="Anamnesis Breve y Evolución"
                      multiline
                      rows={2}
                      fullWidth
                      size="small"
                      value={anamnesisRefcon}
                      onChange={(e) => setAnamnesisRefcon(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Examen Físico y Constantes"
                      multiline
                      rows={2}
                      fullWidth
                      size="small"
                      value={examenFisico}
                      onChange={(e) => setExamenFisico(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Motivo de la Referencia"
                      fullWidth
                      size="small"
                      value={motivoReferencia}
                      onChange={(e) => setMotivoReferencia(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* SECCIÓN 4: ANEXOS ADJUNTOS */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="800" color="primary.main" sx={{ bgcolor: '#F1F5F9', p: 1, borderRadius: 1, mb: 1 }}>
                  IV. DOCUMENTOS Y EXÁMENES AUXILIARES ADJUNTOS
                </Typography>
                <Box sx={{ pl: 1 }}>
                  {mockRefconData.ficha_referencia_minsa.resumen_clinico_referencia.apoyo_al_diagnostico_adjuntos.map((anexo, idx) => (
                    <Typography key={idx} variant="caption" display="block" color="text.primary" sx={{ mb: 0.3 }}>
                      ✓ {anexo}
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Firma del Médico Tratante */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Médico Tratante Solicitante:</Typography>
                  <Typography variant="body2" fontWeight="bold">Dr. Carlos Ruiz (CMP 45678 - RNE 23456)</Typography>
                  <Typography variant="caption" color="success.main" fontWeight="bold">Firmado Digitalmente con DNIe ✓</Typography>
                </Box>

                <Chip
                  icon={<ShieldCheck size={16} />}
                  label="Documento con Validez Oficial MINSA"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Columna Lateral: Panel de QA, Subsanación y Derivación */}
          <Grid item xs={12} lg={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', position: 'sticky', top: 80 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ClipboardCheck size={22} color="#00875A" />
                <Typography variant="h6" fontWeight="700" color="primary.main">
                  Control de Calidad (QA)
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Verifique los requisitos antes de derivar la ficha a la Central REFCON MINSA:
              </Typography>

              {/* Checklist de QA */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 2.5 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    bgcolor: qaCheckedDni ? '#F0FDF4' : '#FFF1F2',
                    border: qaCheckedDni ? '1px solid #BBF7D0' : '1px solid #FECDD3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  onClick={() => setQaCheckedDni(!qaCheckedDni)}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>DNI / RENIEC</Typography>
                    <Typography variant="caption" color="text.secondary">Padrón verificado</Typography>
                  </Box>
                  <Chip label={qaCheckedDni ? 'Conforme ✓' : 'Pendiente'} color={qaCheckedDni ? 'success' : 'default'} size="small" sx={{ height: 22 }} />
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    bgcolor: qaCheckedSis ? '#F0FDF4' : '#FFF1F2',
                    border: qaCheckedSis ? '1px solid #BBF7D0' : '1px solid #FECDD3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  onClick={() => setQaCheckedSis(!qaCheckedSis)}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>Vigencia SIS</Typography>
                    <Typography variant="caption" color="text.secondary">Asegurada activa</Typography>
                  </Box>
                  <Chip label={qaCheckedSis ? 'Activo ✓' : 'Pendiente'} color={qaCheckedSis ? 'success' : 'default'} size="small" sx={{ height: 22 }} />
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    bgcolor: qaCheckedAnexos ? '#F0FDF4' : '#FFF1F2',
                    border: qaCheckedAnexos ? '1px solid #BBF7D0' : '1px solid #FECDD3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  onClick={() => setQaCheckedAnexos(!qaCheckedAnexos)}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>Anexos Biopsia</Typography>
                    <Typography variant="caption" color="text.secondary">Informes adjuntos</Typography>
                  </Box>
                  <Chip label={qaCheckedAnexos ? 'Completos ✓' : 'Pendiente'} color={qaCheckedAnexos ? 'success' : 'default'} size="small" sx={{ height: 22 }} />
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    bgcolor: qaCheckedConsentimiento ? '#F0FDF4' : '#FFF1F2',
                    border: qaCheckedConsentimiento ? '1px solid #BBF7D0' : '1px solid #FECDD3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  onClick={() => setQaCheckedConsentimiento(!qaCheckedConsentimiento)}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>Consentimiento</Typography>
                    <Typography variant="caption" color="text.secondary">Autorización firmada</Typography>
                  </Box>
                  <Chip label={qaCheckedConsentimiento ? 'Firmado ✓' : 'Pendiente'} color={qaCheckedConsentimiento ? 'success' : 'default'} size="small" sx={{ height: 22 }} />
                </Paper>
              </Box>

              <TextField
                label="Informe de Subsanación y QA"
                multiline
                rows={3}
                fullWidth
                size="small"
                value={qaObservaciones}
                onChange={(e) => setQaObservaciones(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                disabled={qaAprobado || !qaCheckedDni || !qaCheckedSis || !qaCheckedAnexos || !qaCheckedConsentimiento}
                startIcon={<Send size={18} />}
                onClick={() => setOpenModalQA(true)}
                sx={{ fontWeight: 'bold', py: 1.2 }}
              >
                {qaAprobado ? 'QA Conforme y Enviado a REFCON ✓' : 'Aprobar QA y Derivar a REFCON'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 2: VIS 1.1 TABLERO GENERAL DE TRANSICIÓN */}
      {/* ========================================================================= */}
      {currentTab === 1 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="h6" fontWeight="700" color="primary.main">
                Tablero General de Pacientes en Transición (INSN San Borja)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Monitor en tiempo real de adolescentes entre 17 y 18 años candidatos a transferencia.
              </Typography>
            </Box>
            <Chip label={`${todosLosPacientes.length} Pacientes Activos`} color="primary" sx={{ fontWeight: 'bold' }} />
          </Box>

          <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Paciente</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Edad / DNI</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Diagnóstico Principal</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Médico Tratante</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Etapa Actual</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Prioridad</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Días sin Avance</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {todosLosPacientes.map((p) => (
                  <TableRow key={p.id} hover sx={{ bgcolor: p.id === 'PAC-001' ? '#F0F9FF' : 'inherit' }}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {p.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {p.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{p.edad} años</Typography>
                      <Typography variant="caption" color="text.secondary">{p.dni}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 220 }}>
                        {p.diagnostico_principal}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" fontWeight="500">{p.medico_tratante}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.etapa_actual.replace(/_/g, ' ')}
                        size="small"
                        color={p.etapa_numero >= 5 ? 'success' : 'info'}
                        sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.prioridad}
                        size="small"
                        color={getPriorityColor(p.prioridad) as any}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Clock size={14} color={p.dias_sin_avance > 10 ? '#DE350B' : '#64748B'} />
                        <Typography
                          variant="caption"
                          fontWeight={p.dias_sin_avance > 10 ? 'bold' : 'normal'}
                          color={p.dias_sin_avance > 10 ? 'error.main' : 'text.secondary'}
                        >
                          {p.dias_sin_avance} días
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {p.id === 'PAC-001' ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => setCurrentTab(0)}
                        >
                          Revisar QA
                        </Button>
                      ) : (
                        <Button size="small" variant="outlined" disabled>
                          Ver Detalle
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 3: VIS 1.4 SEGUIMIENTO POST-TRANSFERENCIA */}
      {/* ========================================================================= */}
      {currentTab === 2 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ p: 1.2, bgcolor: '#ECFDF5', borderRadius: 2, color: '#047857' }}>
                <HeartHandshake size={26} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="700" color="primary.main">
                  VIS 1.4: Módulo de Seguimiento Post-Transferencia (3 y 6 Meses)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cierre de brechas: Asegura que el adolescente no abandone el tratamiento tras salir de pediatría.
                </Typography>
              </Box>
            </Box>

            <Chip
              label="Indicador Clave de Impacto Hackatón"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          {/* Tarjeta del Caso en Seguimiento */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#F0F9FF', border: '1px solid #BAE3FF', borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Paciente Transferida:</Typography>
                <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                  {pacienteLucia.nombre} ({pacienteLucia.edad} años)
                </Typography>
                <Typography variant="caption" color="text.secondary">DNI: {pacienteLucia.dni} • SIS Gratuito</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Hospital Receptor Confirmado:</Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  🏛️ Hospital Nacional Dos de Mayo
                </Typography>
                <Typography variant="caption" color="text.secondary">Servicio: Reumatología y Nefrología Adultos</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Fecha de Primera Cita Adulta:</Typography>
                <Typography variant="subtitle2" fontWeight="bold" color="success.main">
                  📅 Miércoles 02/09/2026 - 08:30 AM
                </Typography>
                <Typography variant="caption" color="text.secondary">Pabellón 3 - Consultorio 12</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={3}>
            {/* 1. Llamada a Familiares y Confirmación de Asistencia */}
            <Grid item xs={12} md={7}>
              <Card sx={{ height: '100%', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 2.5 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
                    1. Contacto Telefónico con Familiares y Confirmación de Cita
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
                    Protocolo: La licenciada se comunica con el apoderado registrado para corroborar la asistencia y verificar si hubo alguna dificultad en la atención adulta.
                  </Typography>

                  {/* Bloque de Contacto Familiar */}
                  <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Familiar Responsable:</Typography>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Sra. Rosa Rivera (Madre de Lucía)
                        </Typography>
                        <Typography variant="caption" color="primary.main" fontWeight="bold">
                          📱 Teléfono: +51 987 654 321
                        </Typography>
                      </Box>

                      <Button
                        variant={llamadaRealizada ? "outlined" : "contained"}
                        color="primary"
                        size="small"
                        startIcon={<PhoneCall size={16} />}
                        onClick={() => {
                          setLlamadaRealizada(true);
                          setResultadoLlamada('CONTESTADA');
                        }}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {llamadaRealizada ? "Llamada Registrada ✓" : "📞 Iniciar Llamada al Familiar"}
                      </Button>
                    </Box>

                    {/* Bitácora de la llamada */}
                    <TextField
                      label="Bitácora de la Conversación con el Familiar"
                      multiline
                      rows={2.5}
                      fullWidth
                      size="small"
                      value={bitacoraLlamada}
                      onChange={(e) => setBitacoraLlamada(e.target.value)}
                      sx={{ mb: 1.5, bgcolor: '#FFFFFF' }}
                      helperText="Detalles de la llamada: atención médica recibida, receta y próximas indicaciones"
                    />

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography variant="caption" fontWeight="bold">Resultado de la llamada:</Typography>
                      <Chip
                        label="Llamada Contestada y Conforme ✓"
                        size="small"
                        color={resultadoLlamada === 'CONTESTADA' ? 'success' : 'default'}
                        onClick={() => setResultadoLlamada('CONTESTADA')}
                        sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                      />
                      <Chip
                        label="No contesta / Buzón"
                        size="small"
                        color={resultadoLlamada === 'NO_CONTESTA' ? 'error' : 'default'}
                        onClick={() => setResultadoLlamada('NO_CONTESTA')}
                        sx={{ cursor: 'pointer' }}
                      />
                    </Box>
                  </Paper>

                  {/* Confirmación Oficial de la Cita */}
                  <Divider sx={{ my: 2 }} />

                  {pacienteLucia.asistencia_primera_cita ? (
                    <Box>
                      <Alert severity="success" sx={{ mb: 1.5 }}>
                        <b>✓ Asistencia Confirmada en Sistema:</b> Se verificó la asistencia de Lucía al Hospital Dos de Mayo el 02/09/2026. Apertura de historia de adultos completada con éxito.
                      </Alert>
                      <Chip label="Cero Ausentismo Logrado ✓" color="success" size="small" sx={{ fontWeight: 'bold' }} />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Tras validar la llamada telefónica, confirme la asistencia formal:
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<CalendarCheck size={16} />}
                        onClick={() => {
                          adminRegistrarAsistencia();
                          setLlamadaRealizada(true);
                          confetti({ particleCount: 75, spread: 60 });
                        }}
                        sx={{ fontWeight: '800', px: 2.5 }}
                      >
                        Confirmar Asistencia a la Cita Programada
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* 2. Seguimiento Longitudinal 3 y 6 Meses */}
            <Grid item xs={12} md={5}>
              <Card sx={{ height: '100%', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 2.5 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
                    2. Seguimiento Longitudinal (3 y 6 Meses)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    Evaluación progresiva: Bloquea el hito al registrarse y habilita el siguiente control.
                  </Typography>

                  {/* HITO 1: EVALUACIÓN A LOS 3 MESES */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      borderRadius: 2, 
                      bgcolor: eval3mConfirmada ? '#F0FDF4' : '#F8FAFC',
                      border: eval3mConfirmada ? '1px solid #86EFAC' : '1px solid #E2E8F0' 
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" fontWeight="800" color={eval3mConfirmada ? '#047857' : 'primary.main'}>
                        📅 CONTROL 3 MESES (DICIEMBRE 2026):
                      </Typography>
                      {eval3mConfirmada && (
                        <Chip label="Registrado y Bloqueado ✓" size="small" color="success" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }} />
                      )}
                    </Box>

                    {eval3mConfirmada ? (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="#166534" fontWeight="600">
                          • Estado: {estado3m === 'EN_TRATAMIENTO' ? 'En Tratamiento Activo (Adherente)' : estado3m}
                        </Typography>
                        <Button 
                          size="small" 
                          sx={{ fontSize: '0.7rem', color: '#64748B' }}
                          onClick={() => setEval3mConfirmada(false)}
                        >
                          Modificar
                        </Button>
                      </Box>
                    ) : (
                      <Box>
                        <RadioGroup
                          row
                          value={estado3m}
                          onChange={(e) => setEstado3m(e.target.value as any)}
                          sx={{ mb: 1 }}
                        >
                          <FormControlLabel value="EN_TRATAMIENTO" control={<Radio size="small" color="success" />} label={<Typography variant="caption" fontWeight="500">En Tratamiento Activo</Typography>} />
                          <FormControlLabel value="PENDIENTE" control={<Radio size="small" />} label={<Typography variant="caption">En Espera</Typography>} />
                          <FormControlLabel value="PERDIDA" control={<Radio size="small" color="error" />} label={<Typography variant="caption">Pérdida</Typography>} />
                        </RadioGroup>

                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          fullWidth
                          startIcon={<CheckCircle2 size={15} />}
                          onClick={() => {
                            adminRegistrarSeguimiento('3m', estado3m);
                            setEval3mConfirmada(true);
                            confetti({ particleCount: 60, spread: 50 });
                          }}
                          sx={{ fontWeight: 'bold', py: 0.8 }}
                        >
                          Guardar y Bloquear 3 Meses ✓
                        </Button>
                      </Box>
                    )}
                  </Paper>

                  {/* HITO 2: EVALUACIÓN A LOS 6 MESES */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: !eval3mConfirmada 
                        ? '#F1F5F9' 
                        : eval6mConfirmada 
                        ? '#F0FDF4' 
                        : '#EFF6FF',
                      border: !eval3mConfirmada 
                        ? '1px dashed #CBD5E1' 
                        : eval6mConfirmada 
                        ? '1px solid #86EFAC' 
                        : '1px solid #BFDBFE',
                      opacity: !eval3mConfirmada ? 0.65 : 1
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" fontWeight="800" color={eval6mConfirmada ? '#047857' : eval3mConfirmada ? '#1D4ED8' : 'text.secondary'}>
                        📅 CONTROL 6 MESES (MARZO 2027):
                      </Typography>
                      {eval6mConfirmada ? (
                        <Chip label="Transición Consolidada ✓" size="small" color="success" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }} />
                      ) : !eval3mConfirmada ? (
                        <Chip label="Bloqueado 🔒" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                      ) : (
                        <Chip label="Aperturado 🔓" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }} />
                      )}
                    </Box>

                    {!eval3mConfirmada ? (
                      <Typography variant="caption" color="text.secondary" display="block">
                        🔒 Este control se habilitará automáticamente una vez registrada la evaluación de los 3 meses.
                      </Typography>
                    ) : eval6mConfirmada ? (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="body2" color="#166534" fontWeight="600">
                          • Estado: {estado6m === 'EN_TRATAMIENTO' ? 'Adherente, Estable y en Seguimiento Adulto' : estado6m}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => setShowFinProcesoModal(true)}
                            sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                          >
                            Ver Resumen de Fin de Proceso 🎓
                          </Button>
                          <Button 
                            size="small" 
                            sx={{ fontSize: '0.7rem', color: '#64748B' }}
                            onClick={() => setEval6mConfirmada(false)}
                          >
                            Modificar
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <RadioGroup
                          row
                          value={estado6m}
                          onChange={(e) => setEstado6m(e.target.value as any)}
                          sx={{ mb: 1 }}
                        >
                          <FormControlLabel value="EN_TRATAMIENTO" control={<Radio size="small" color="success" />} label={<Typography variant="caption" fontWeight="500">Adherente / Estable</Typography>} />
                          <FormControlLabel value="PENDIENTE" control={<Radio size="small" />} label={<Typography variant="caption">En Espera</Typography>} />
                          <FormControlLabel value="PERDIDA" control={<Radio size="small" color="error" />} label={<Typography variant="caption">Alerta Social</Typography>} />
                        </RadioGroup>

                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          fullWidth
                          startIcon={<CheckCircle2 size={15} />}
                          onClick={() => {
                            adminRegistrarSeguimiento('6m', estado6m);
                            setEval6mConfirmada(true);
                            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
                            setTimeout(() => {
                              setShowFinProcesoModal(true);
                            }, 700);
                          }}
                          sx={{ fontWeight: '800', py: 0.8 }}
                        >
                          Confirmar Evaluación a 6 Meses y Consolidar 🎓
                        </Button>
                      </Box>
                    )}
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Modal Confirmación QA */}
      <Dialog open={openModalQA} onClose={() => setOpenModalQA(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Confirmar Envío a REFCON</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Se enviará la Ficha REFCON oficial de <b>Lucía Mendoza</b> con los controles de calidad aprobados hacia la Central de Referencias MINSA.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModalQA(false)}>Cancelar</Button>
          <Button variant="contained" color="secondary" onClick={handleAprobarQA}>
            Confirmar y Enviar a REFCON
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Alerta Guia para el Jurado para pasar a REFCON */}
      <NextStageModal
        open={showNextModal}
        onClose={() => setShowNextModal(false)}
        titulo="Ficha REFCON Aprobada por Admisión SIS"
        etapaCompletada="Etapa 4: Admisión SIS Completada"
        siguienteActor="Dr. Manuel Vargas (REFCON MINSA)"
        siguienteVistaNombre="REFCON MINSA"
        siguienteVistaRuta="/refcon"
        explicacionJurado="Admisión SIS ha validado la filiación, el seguro SIS activo y los anexos de Lucía. La ficha oficial ya se encuentra en la bandeja nacional de REFCON para la confirmación de cupo y asignación de fecha de cita."
      />

      {/* Modal de Fin de Proceso y Cierre de las 7 Etapas */}
      <FinProcesoModal
        open={showFinProcesoModal}
        onClose={() => setShowFinProcesoModal(false)}
      />
    </Layout>
  );
};
