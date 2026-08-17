import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip, 
  TextField, 
  Divider, 
  Alert, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Grid, 
  IconButton, 
  Autocomplete 
} from '@mui/material';
import { 
  Sparkles, 
  FileCheck2, 
  Stethoscope, 
  ShieldAlert, 
  Pill, 
  CheckCircle2, 
  FileText, 
  Edit3, 
  Lock, 
  Stamp, 
  Calendar, 
  Plus, 
  Trash2, 
  PlusCircle, 
  Send 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Layout } from '../../components/common/Layout';
import { JudgeNote } from '../../components/common/JudgeNote';
import { NextStageModal } from '../../components/common/NextStageModal';
import { useApp } from '../../context/AppContext';
import catalogoCie10 from '../../data/catalogo_cie10.json';

export const MedicoPage: React.FC = () => {
  const { pacienteLucia, simularExtraccionIA, medicoAprobarYSugerir, isLoadingIA } = useApp();
  
  const [openSignDialog, setOpenSignDialog] = useState(false);
  const [pinFirma, setPinFirma] = useState('45678');
  const [isSigned, setIsSigned] = useState(pacienteLucia.resumen_clinico_validado || false);
  const [showNextModal, setShowNextModal] = useState(false);

  // Estados editables de la Ficha (Estilo Word)
  const [anamnesis, setAnamnesis] = useState(
    'Paciente mujer de 17 años y 10 meses con diagnóstico de Cardiopatía Congénita (Defecto del tabique ventricular grande con estenosis pulmonar infundibular) sometida a corrección quirúrgica total con parche de pericardio a los 4 años. Ha cursado seguimiento anual en Cardiología Pediátrica del INSN San Borja. Actualmente en clase funcional NYHA I, hemodinámicamente compensada, sin signos de falla cardíaca.'
  );
  const [cie10Principal, setCie10Principal] = useState('Q21.0 - Defecto del tabique ventricular / Cardiopatía congénita corregida');
  
  // Array de Diagnósticos Secundarios (CIE-10) editables y ampliables
  const [diagnosticosSecundarios, setDiagnosticosSecundarios] = useState([
    { id: '1', codigo: 'Z95.2', descripcion: 'Presencia de parche intracardíaco protésico / Implante vascular' },
    { id: '2', codigo: 'I49.8', descripcion: 'Arritmia supraventricular paroxística en control (Holter normal)' },
    { id: '3', codigo: 'I27.0', descripcion: 'Hipertensión pulmonar leve residual posquirúrgica' }
  ]);

  const [nuevoCieCodigo, setNuevoCieCodigo] = useState('');
  const [nuevoCieDesc, setNuevoCieDesc] = useState('');
  const [openModalAddCie, setOpenModalAddCie] = useState(false);

  // Auto-relleno inteligente al ingresar o cambiar el código CIE-10
  const handleCodigoInput = (input: string) => {
    setNuevoCieCodigo(input);
    const clean = input.trim().toUpperCase().replace('*', '').replace('.', '');
    const match = catalogoCie10.find((c) => 
      c.codigo.toUpperCase().replace('*', '').replace('.', '') === clean ||
      c.codigo.toUpperCase() === input.trim().toUpperCase()
    );
    if (match) {
      setNuevoCieDesc(match.descripcion);
    }
  };

  const handleAgregarCie10 = () => {
    if (!nuevoCieDesc.trim()) return;
    const nuevoItem = {
      id: Date.now().toString(),
      codigo: nuevoCieCodigo.trim() || 'R69',
      descripcion: nuevoCieDesc.trim()
    };
    setDiagnosticosSecundarios((prev) => [...prev, nuevoItem]);
    setNuevoCieCodigo('');
    setNuevoCieDesc('');
    setOpenModalAddCie(false);
  };

  const handleEliminarCie10 = (id: string) => {
    setDiagnosticosSecundarios((prev) => prev.filter((d) => d.id !== id));
  };

  const handleEditarCie10 = (id: string, campo: 'codigo' | 'descripcion', valor: string) => {
    setDiagnosticosSecundarios((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          if (campo === 'codigo') {
            const clean = valor.trim().toUpperCase().replace('*', '').replace('.', '');
            const match = catalogoCie10.find((c) => 
              c.codigo.toUpperCase().replace('*', '').replace('.', '') === clean ||
              c.codigo.toUpperCase() === valor.trim().toUpperCase()
            );
            return {
              ...d,
              codigo: valor,
              descripcion: match ? match.descripcion : d.descripcion
            };
          }
          return { ...d, [campo]: valor };
        }
        return d;
      })
    );
  };

  const [alertasCriticas, setAlertasCriticas] = useState(
    'Alergia severa a Penicilinas (Urticaria y broncoespasmo). Requiere profilaxis antibiótica obligatoria para Endocarditis Infecciosa antes de procedimientos dentales o invasivos.'
  );
  const [medicacionActiva, setMedicacionActiva] = useState(
    '1. Enalapril 5mg/día VO (Mañana - Optimización de poscarga y función ventricular)\n2. Bisoprolol 2.5mg/día VO (Mañana - Control cronotrópico y profilaxis antiarrítmica)\n3. Ácido Acetilsalicílico 100mg/día VO (Almuerzo - Antiagregación por parche protésico)'
  );
  const [recomendacionesAdulto, setRecomendacionesAdulto] = useState(
    '1. Control ecocardiográfico anual para vigilancia de función biventricular y gradiente residual.\n2. Monitoreo Holter 24h cada 12-18 meses para detección de arritmias.\n3. Mantener pautas de profilaxis de endocarditis y evaluación preconcepcional especializada.'
  );

  const hasExtractedData = pacienteLucia.etapa_numero >= 2;

  const handleRunIA = async () => {
    await simularExtraccionIA();
  };

  const handleConfirmSignature = () => {
    setIsSigned(true);
    setOpenSignDialog(false);
    medicoAprobarYSugerir('H001'); // Dos de Mayo

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
    <Layout actorTitle="Dr. Carlos Ruiz (CMP 45678)" actorRole="Cardiología Pediátrica - INSN San Borja">
      {/* Nota para el Jurado */}
      <JudgeNote
        visCode="VIS 2.1 / VIS 2.3"
        enfoque="E2 - Extracción Asistida por IA y Ficha Clínica Estructurada Oficial"
        problemaReal="El médico debe transcribir manualmente datos extensos desde el expediente a la ficha de referencia, arriesgando omisiones de antecedentes vitales."
        solucionPuente="La IA pre-llena la ficha en formato de documento estructurado (editable). El médico revisa los diagnósticos CIE-10, ajusta la medicación y firma con su DNI Electrónico / Token PKI, enviando el caso directamente a Admisión / QA."
      />

      {/* Cabecera del Caso Clínico */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 1.2, bgcolor: '#EFF6FF', borderRadius: 2, color: '#1D4ED8' }}>
              <Stethoscope size={24} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" fontWeight="700" color="primary.main">
                  Expediente Pediátrico: {pacienteLucia.nombre}
                </Typography>
                <Chip label="17a 10m" color="warning" size="small" sx={{ fontWeight: 'bold' }} />
                <Chip label="Prioridad ALTA" color="error" size="small" sx={{ fontWeight: 'bold' }} />
              </Box>
              <Typography variant="caption" color="text.secondary">
                DNI: {pacienteLucia.dni} • Servicio: <b>Reumatología Pediátrica (INSN San Borja)</b>
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={<FileCheck2 size={16} color={isSigned ? "#00875A" : "#1D4ED8"} />}
            label={isSigned ? "Ficha Médica Firmada Digitalmente ✓" : "Pendiente de Firma Médica"}
            color={isSigned ? "success" : "primary"}
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
      </Paper>

      {/* ========================================================================= */}
      {/* ASISTENTE CLÍNICO IA Y FICHA EDITABLE ESTILO WORD */}
      {/* ========================================================================= */}
      <Box>
        {!hasExtractedData ? (
          /* Estado Inicial: Carga de Historia y Botón RAG */
          <Paper elevation={0} sx={{ p: 5, borderRadius: 3, border: '2px dashed #CBD5E1', bgcolor: '#FFFFFF', textAlign: 'center', maxWidth: 750, mx: 'auto', my: 2 }}>
            <Box sx={{ width: 64, height: 64, bgcolor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, color: '#1D4ED8' }}>
              <Sparkles size={32} />
            </Box>
            <Typography variant="h5" fontWeight="700" color="primary.main" gutterBottom>
              Historial Clínico Pediátrico Disponible (5 Años de Seguimiento)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 580, mx: 'auto', mb: 3, lineHeight: 1.6 }}>
              El expediente contiene: Informe Quirúrgico de Corrección con Parche (4 años), Ecocardiogramas Transtorácicos seriados (2024-2025), Holter ECG de 24 horas y Esquema Cardioprotector. Presione el botón para que el Asistente IA estructure la ficha automáticamente.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={isLoadingIA ? <CircularProgress size={20} color="inherit" /> : <Sparkles size={20} />}
              disabled={isLoadingIA}
              onClick={handleRunIA}
              sx={{ fontWeight: 'bold', px: 4, py: 1.5, fontSize: '1rem', boxShadow: '0 4px 14px rgba(0, 101, 255, 0.3)' }}
            >
              {isLoadingIA ? 'Analizando Historia Clínica con RAG...' : '⚡ Extraer y Estructurar Ficha con IA'}
            </Button>
          </Paper>
        ) : (
          /* Estado 2: Ficha Clínica Estructurada y Editable (Estilo Word) */
          <Box>
            {/* Banner de Estado IA */}
            <Alert
              severity="success"
              icon={<Sparkles size={20} />}
              sx={{ mb: 3, borderRadius: 2, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}
            >
              <b>Extracción Asistida por IA Completada:</b> La información del expediente ha sido sintetizada en la ficha oficial. Como médico tratante, usted puede <b>editar directamente</b> cualquier sección antes de firmar con su DNI electrónico.
            </Alert>

            {/* Documento Estilo Hoja Word Oficial */}
            <Paper
              elevation={2}
              sx={{
                p: { xs: 3, md: 5 },
                maxWidth: 950,
                mx: 'auto',
                bgcolor: '#FFFFFF',
                borderRadius: 2,
                border: '1px solid #CBD5E1',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                position: 'relative',
              }}
            >
              {/* Membrete Oficial */}
              <Box sx={{ borderBottom: '2px solid #0B3B60', pb: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5, fontWeight: 'bold' }}>
                    MINISTERIO DE SALUD • INSTITUTO NACIONAL DE SALUD DEL NIÑO SAN BORJA
                  </Typography>
                  <Typography variant="h6" fontWeight="800" color="primary.main">
                    INFORME RESUMEN DE TRANSICIÓN Y DERIVACIÓN A SERVICIO DE ADULTOS
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Documento Clínico Oficial de Transferencia • Código: <b>INSN-TRANS-2026-04982</b>
                  </Typography>
                </Box>
                <Chip label="Ficha Oficial Pediátrica" color="primary" sx={{ fontWeight: 'bold' }} />
              </Box>

              {/* 1. Datos de Filiación */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="800" color="primary.main" sx={{ bgcolor: '#F1F5F9', p: 1, borderRadius: 1, mb: 1.5 }}>
                  1. DATOS DE IDENTIFICACIÓN DEL PACIENTE
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Paciente" fullWidth size="small" defaultValue={pacienteLucia.nombre} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField label="DNI" fullWidth size="small" defaultValue={pacienteLucia.dni} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField label="Edad" fullWidth size="small" defaultValue="17 años 10 meses" InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Tipo de Seguro" fullWidth size="small" defaultValue="SIS Gratuito (Activo)" InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Domicilio de Residencia" fullWidth size="small" defaultValue="Jr. Las Gardenias 342, Surquillo, Lima" />
                  </Grid>
                </Grid>
              </Box>

              {/* 2. Diagnósticos CIE-10 (Editables y Dinámicos) */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="800" color="primary.main" sx={{ bgcolor: '#F1F5F9', p: 1, borderRadius: 1, mb: 1.5 }}>
                  2. DIAGNÓSTICOS DE REFERENCIA (CIE-10)
                </Typography>

                {/* Diagnóstico Principal */}
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="⭐ Diagnóstico Troncal (Principal CIE-10)"
                    fullWidth
                    size="small"
                    value={cie10Principal}
                    onChange={(e) => setCie10Principal(e.target.value)}
                    helperText="Diagnóstico de fondo que motiva la transferencia especializada"
                    sx={{ bgcolor: '#FFFFFF' }}
                  />
                </Box>

                {/* Diagnósticos Secundarios Múltiples */}
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                        Diagnósticos Secundarios y Comorbilidades ({diagnosticosSecundarios.length}):
                      </Typography>
                      <Chip label="CIE-10 Múltiples" size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<Plus size={15} />}
                      onClick={() => setOpenModalAddCie(true)}
                      sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                    >
                      + Agregar Diagnóstico Secundario (CIE-10)
                    </Button>
                  </Box>

                  {/* Lista de Diagnósticos Secundarios */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 2 }}>
                    {diagnosticosSecundarios.map((diag, index) => (
                      <Paper
                        key={diag.id}
                        elevation={0}
                        sx={{
                          p: 1.2,
                          bgcolor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 1.5,
                          display: 'flex',
                          alignItems: { xs: 'stretch', sm: 'center' },
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 1.5
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            sx={{ height: 22, fontSize: '0.7rem', fontWeight: 'bold', bgcolor: '#F1F5F9' }}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleEliminarCie10(diag.id)}
                            title="Eliminar este diagnóstico"
                            sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                        <TextField
                          size="small"
                          label="Código CIE-10"
                          value={diag.codigo}
                          onChange={(e) => handleEditarCie10(diag.id, 'codigo', e.target.value)}
                          sx={{ width: { xs: '100%', sm: 130 } }}
                        />
                        <TextField
                          size="small"
                          fullWidth
                          label="Descripción Diagnóstica / Afectación Orgánica"
                          value={diag.descripcion}
                          onChange={(e) => handleEditarCie10(diag.id, 'descripcion', e.target.value)}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleEliminarCie10(diag.id)}
                          title="Eliminar este diagnóstico"
                          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Paper>
                    ))}
                  </Box>

                  {/* Sugerencias Rápidas de CIE-10 Frecuentes */}
                  <Box sx={{ pt: 1, borderTop: '1px dashed #CBD5E1' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                      💡 Diagnósticos frecuentes en transición pediátrica (clic para añadir):
                    </Typography>
                    <Box sx={{ display: 'inline-flex', gap: 0.8, flexWrap: 'wrap', mt: 0.5 }}>
                      <Chip
                        label="+ M81.4 Osteopenia por corticoides"
                        size="small"
                        onClick={() => {
                          setDiagnosticosSecundarios((prev) => [
                            ...prev,
                            { id: Date.now().toString(), codigo: 'M81.4', descripcion: 'Osteopenia / Osteoporosis inducida por corticoterapia prolongada' }
                          ]);
                        }}
                        sx={{ cursor: 'pointer', fontSize: '0.7rem' }}
                      />
                      <Chip
                        label="+ I15.1 HTA secundaria renal"
                        size="small"
                        onClick={() => {
                          setDiagnosticosSecundarios((prev) => [
                            ...prev,
                            { id: Date.now().toString(), codigo: 'I15.1', descripcion: 'Hipertensión arterial secundaria a nefropatía / afección renal' }
                          ]);
                        }}
                        sx={{ cursor: 'pointer', fontSize: '0.7rem' }}
                      />
                      <Chip
                        label="+ D63.0 Anemia de enfermedad crónica"
                        size="small"
                        onClick={() => {
                          setDiagnosticosSecundarios((prev) => [
                            ...prev,
                            { id: Date.now().toString(), codigo: 'D63.0', descripcion: 'Anemia en enfermedades autoinmunes y neoplásicas crónicas' }
                          ]);
                        }}
                        sx={{ cursor: 'pointer', fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </Box>

              {/* 3. Anamnesis y Evolución Clínica (Editable) */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="800" color="primary.main" sx={{ bgcolor: '#F1F5F9', p: 1, borderRadius: 1, mb: 1.5 }}>
                  3. RESUMEN DEL CURSO CLÍNICO Y ANTECEDENTES
                </Typography>
                <TextField
                  label="Anamnesis, Evolución y Procedimientos Relevantes"
                  multiline
                  rows={3}
                  fullWidth
                  size="small"
                  value={anamnesis}
                  onChange={(e) => setAnamnesis(e.target.value)}
                />
              </Box>

              {/* 4. Alertas Críticas (Editable) */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="800" color="#CF1322" sx={{ bgcolor: '#FFF1F0', p: 1, borderRadius: 1, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldAlert size={18} /> 4. ALERTAS CLÍNICAS CRÍTICAS Y ALERGIAS
                </Typography>
                <TextField
                  label="Alertas y Contraindicaciones"
                  multiline
                  rows={2}
                  fullWidth
                  size="small"
                  value={alertasCriticas}
                  onChange={(e) => setAlertasCriticas(e.target.value)}
                />
              </Box>

              {/* 5. Medicación Activa (Editable) */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="800" color="#047857" sx={{ bgcolor: '#F0FDF4', p: 1, borderRadius: 1, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Pill size={18} /> 5. ESQUEMA TERAPÉUTICO AL TRASLADO
                </Typography>
                <TextField
                  label="Fármacos, Dosis y Vía de Administración"
                  multiline
                  rows={3}
                  fullWidth
                  size="small"
                  value={medicacionActiva}
                  onChange={(e) => setMedicacionActiva(e.target.value)}
                />
              </Box>

              {/* 6. Recomendaciones (Editable) */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" fontWeight="800" color="primary.main" sx={{ bgcolor: '#F1F5F9', p: 1, borderRadius: 1, mb: 1.5 }}>
                  6. RECOMENDACIONES PARA EL EQUIPO RECEPTOR DE ADULTOS
                </Typography>
                <TextField
                  label="Pautas de Manejo Inicial y Controles"
                  multiline
                  rows={3}
                  fullWidth
                  size="small"
                  value={recomendacionesAdulto}
                  onChange={(e) => setRecomendacionesAdulto(e.target.value)}
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Sello de Firma Digital y Botón de Envío */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                {isSigned ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: '#F0FDF4',
                      border: '2px solid #00875A',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Stamp size={32} color="#00875A" />
                    <Box>
                      <Typography variant="subtitle2" fontWeight="800" color="#047857">
                        FIRMADO DIGITALMENTE CON DNI ELECTRÓNICO (DNIe)
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Firmante: Dr. Carlos Ruiz • CMP 45678 • Certificado PKI MINSA Válido
                      </Typography>
                      <Typography variant="caption" color="#047857" fontWeight="bold">
                        Hash Digital: INSN-FD-2026-8923-LMR ✓ • Enviado a Admisión / QA
                      </Typography>
                    </Box>
                  </Paper>
                ) : (
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Estado del Documento:
                    </Typography>
                    <Typography variant="body2" color="warning.main" fontWeight="bold">
                      ⚠️ Resumen Clínico Pendiente de Firma Digital
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {!isSigned ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      startIcon={<FileCheck2 size={20} />}
                      onClick={() => setOpenSignDialog(true)}
                      sx={{ px: 3.5, py: 1.3, fontWeight: '800', boxShadow: '0 4px 14px rgba(0, 135, 90, 0.3)' }}
                    >
                      Firmar Digitalmente con DNIe y Derivar a Admisión SIS
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<CheckCircle2 size={20} />}
                      onClick={() => setShowNextModal(true)}
                      sx={{ px: 3.5, py: 1.3, fontWeight: '800' }}
                    >
                      Ver Guía de Siguiente Etapa (Admisión SIS) ➔
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>

      {/* Alerta / Modal Guía para el Jurado para pasar a Admisión */}
      <NextStageModal
        open={showNextModal}
        onClose={() => setShowNextModal(false)}
        titulo="Ficha Clínica Firmada y Derivada con Éxito"
        etapaCompletada="Etapa 3 Completada"
        siguienteActor="Lic. Carmen Flores (Admisión SIS)"
        siguienteVistaNombre="Admisión SIS"
        siguienteVistaRuta="/admin"
        explicacionJurado="El Dr. Ruiz ha validado la extracción de IA, revisado los diagnósticos CIE-10 y firmado el resumen clínico con su DNI electrónico. El expediente pasa inmediatamente a la bandeja de Admisión SIS para la verificación de seguro y anexos."
      />

      {/* Modal de Firma Digital Oficial con DNIe */}
      <Dialog open={openSignDialog} onClose={() => setOpenSignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileCheck2 size={22} color="#00875A" />
          Firma Digital Oficial con DNI Electrónico (DNIe)
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Está a punto de firmar digitalmente el documento de referencia oficial para la paciente <b>Lucía Mendoza Rivera</b>. Esta acción sellará el resumen clínico y lo enviará directamente al área de Admisión / QA.
          </Typography>

          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, mb: 2, border: '1px solid #E2E8F0' }}>
            <Typography variant="caption" color="text.secondary">Firmante Titular:</Typography>
            <Typography variant="body2" fontWeight="bold">Dr. Carlos Ruiz - CMP 45678 (RNE 23456)</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Entidad Emisora de Certificado:</Typography>
            <Typography variant="caption" fontWeight="bold">RENIEC PKI / Entidad de Certificación del Estado Peruano</Typography>
          </Paper>

          <TextField
            label="PIN de Firma Digital / DNIe"
            type="password"
            fullWidth
            size="small"
            value={pinFirma}
            onChange={(e) => setPinFirma(e.target.value)}
            helperText="PIN precargado para la evaluación del jurado"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenSignDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmSignature}
            startIcon={<Stamp size={16} />}
            sx={{ fontWeight: 'bold' }}
          >
            Estampar Firma y Derivar a Admisión
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Agregar Diagnóstico Secundario CIE-10 con Auto-relleno */}
      <Dialog open={openModalAddCie} onClose={() => setOpenModalAddCie(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlusCircle size={22} color="#0065FF" />
          Agregar Diagnóstico Secundario (CIE-10)
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Seleccione del catálogo o escriba el código CIE-10. La descripción oficial se <b>auto-rellenará de inmediato</b> y podrá personalizarla antes de añadirla a la ficha:
          </Typography>

          {/* Buscador Rápido del Catálogo CIE-10 */}
          <Box sx={{ mb: 2 }}>
            <Autocomplete
              options={catalogoCie10}
              getOptionLabel={(option) => `${option.codigo} - ${option.descripcion}`}
              onChange={(_, value) => {
                if (value) {
                  setNuevoCieCodigo(value.codigo);
                  setNuevoCieDesc(value.descripcion);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="buscar-catalogo-cie10"
                  label="🔍 Buscar en Catálogo Oficial CIE-10 (Código o Nombre)"
                  size="small"
                  fullWidth
                  placeholder="Ej: M81.4, Hipertensión, Osteopenia, Anemia..."
                />
              )}
            />
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary">O INGRESO DIRECTO</Typography>
          </Divider>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="codigo-cie10-modal-input"
                label="Código CIE-10"
                fullWidth
                size="small"
                value={nuevoCieCodigo}
                onChange={(e) => handleCodigoInput(e.target.value)}
                placeholder="Ej: M81.4"
                helperText="Auto-rellena la descripción al escribir"
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                id="desc-cie10-modal-input"
                label="Descripción Diagnóstica (Auto-rellenada / Modificable)"
                multiline
                rows={2.5}
                fullWidth
                size="small"
                value={nuevoCieDesc}
                onChange={(e) => setNuevoCieDesc(e.target.value)}
                placeholder="Descripción médica que acompaña al código"
                helperText="El médico puede complementar con notas adicionales"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenModalAddCie(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAgregarCie10}
            disabled={!nuevoCieDesc.trim()}
            startIcon={<Plus size={16} />}
            sx={{ fontWeight: 'bold', px: 2.5 }}
          >
            Añadir a la Ficha
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};
