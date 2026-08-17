import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Paper, 
  Divider, 
  LinearProgress,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  ClipboardCheck, 
  Building2, 
  UserCheck, 
  Smartphone, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  MapPin, 
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Layout } from '../../components/common/Layout';
import { useApp } from '../../context/AppContext';
import logoHealthTech from '../../assets/logo.png';

export const HomeJurado: React.FC = () => {
  const navigate = useNavigate();
  const { pacienteLucia, resetDemo } = useApp();

  const getProgressPercentage = () => {
    switch (pacienteLucia.etapa_actual) {
      case '1_IDENTIFICACION': return 15;
      case '2_EXTRACCION_IA': return 30;
      case '3_MEDICO_VALIDADO': return 45;
      case '4_QA_ADMIN_APROBADO': return 65;
      case '6_RECEPTOR_CONFIRMADO': return 80;
      case '7_MEDICO_EXTERNO_ACEPTADO': return 90;
      case '8_SEGUIMIENTO_ACTIVO': return 100;
      default: return 15;
    }
  };

  return (
    <Layout actorTitle="Panel de Evaluación" actorRole="Modo Hackatón 2026">
      {/* Banner Principal de Bienvenida */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0B3B60 0%, #154D7A 60%, #00875A 100%)',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ maxWidth: 800 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                icon={<Sparkles size={14} color="#FDE047" />}
                label="Prototipo Interactivo Funcional"
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#FEF08A', fontWeight: 'bold' }}
              />
              <Chip
                label="INSN San Borja ➔ Hospital Dos de Mayo"
                size="small"
                sx={{ bgcolor: 'rgba(0, 135, 90, 0.4)', color: '#A7F3D0', fontWeight: 'bold' }}
              />
            </Box>

            <Typography variant="h3" fontWeight="800" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, mb: 1.5 }}>
              PUENTE 18+: Continuidad Clínica sin Brechas
            </Typography>

            <Typography variant="body1" sx={{ color: '#E0F2FE', fontSize: '1.05rem', lineHeight: 1.6, mb: 3 }}>
              Sistema integral que conecta al <b>Médico Pediátrico</b>, <b>Personal de Admisión (QA)</b>, <b>REFCON MINSA</b>, <b>Médico Receptor de Adultos</b> y a la <b>Adolescente</b> para garantizar que ningún paciente pierda su tratamiento al cumplir la mayoría de edad.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                sx={{ bgcolor: '#00875A', '&:hover': { bgcolor: '#006644' }, px: 3, py: 1.2, fontWeight: 'bold' }}
                endIcon={<ArrowRight size={18} />}
                onClick={() => navigate('/medico')}
              >
                Iniciar Flujo como Médico INSN
              </Button>
              <Button
                variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.5)', color: '#FFFFFF', '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' } }}
                startIcon={<RotateCcw size={16} />}
                onClick={resetDemo}
              >
                Reiniciar Demo
              </Button>
            </Box>
          </Box>

          <Box
            component="img"
            src={logoHealthTech}
            alt="PUENTE 18+ Health Tech"
            sx={{
              width: { xs: 130, md: 175 },
              height: 'auto',
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.35))',
              display: { xs: 'none', sm: 'block' }
            }}
          />
        </Box>
      </Paper>

      {/* Caso Clínico Guía: Lucía Mendoza */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
              <Avatar sx={{ bgcolor: '#E0F2FE', color: '#0369A1', width: 48, height: 48, fontWeight: 'bold' }}>
                LM
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" fontWeight="700">
                    {pacienteLucia.nombre}
                  </Typography>
                  <Chip label="17 años 10 meses" size="small" color="warning" sx={{ fontWeight: 'bold' }} />
                  <Chip label="DNI 76543210" size="small" variant="outlined" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Diagnóstico: <b>{pacienteLucia.diagnostico_principal}</b>
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
              Lucía está a 60 días de cumplir 18 años. Requiere transferencia prioritaria a Reumatología y Nefrología de adultos para evitar la reactivación de su nefritis lúpica clase IV.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip icon={<FileText size={14} />} label="3 Contratos JSON Activos" size="small" />
              <Chip icon={<MapPin size={14} />} label="Georreferenciación Leaflet" size="small" />
              <Chip icon={<Sparkles size={14} />} label="Extracción IA RAG Asistida" size="small" />
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="700">
                  Progreso del Trámite de Lucía:
                </Typography>
                <Typography variant="caption" fontWeight="bold" color="primary.main">
                  {getProgressPercentage()}% Completado
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getProgressPercentage()}
                sx={{ height: 10, borderRadius: 5, mb: 1.5, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#00875A' } }}
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Estado Actual: <b>{pacienteLucia.etapa_actual.replace(/_/g, ' ')}</b>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Grid de Accesos Rápidos por Actor del Sistema */}
      <Typography variant="h5" fontWeight="700" sx={{ mb: 2, color: 'primary.main' }}>
        Acceso Directo a las 5 Vistas del Ecosistema
      </Typography>

      <Grid container spacing={2.5}>
        {/* Rol 1: Médico Tratante */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(11, 59, 96, 0.12)' },
              borderTop: '4px solid #0B3B60',
            }}
            onClick={() => navigate('/medico')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Avatar sx={{ bgcolor: '#EFF6FF', color: '#1D4ED8' }}>
                  <Stethoscope size={22} />
                </Avatar>
                <Chip label="Enfoques E1, E2, E3" size="small" sx={{ fontWeight: 600 }} />
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                1. Médico Tratante INSN
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                • VIS 1.2: Panel de 7 etapas<br />
                • VIS 2.1: Extracción RAG por IA<br />
                • VIS 3.1: Sugerencia de receptor y firma
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button fullWidth variant="outlined" endIcon={<ArrowRight size={16} />}>
                Entrar como Médico
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Rol 2: Admisión / Personal ADM */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(11, 59, 96, 0.12)' },
              borderTop: '4px solid #00875A',
            }}
            onClick={() => navigate('/admin')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Avatar sx={{ bgcolor: '#ECFDF5', color: '#047857' }}>
                  <ClipboardCheck size={22} />
                </Avatar>
                <Chip label="Enfoques E1, E2" size="small" sx={{ fontWeight: 600 }} />
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                2. Personal Admisión SIS
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                • Tablero general de pacientes en transición<br />
                • Ficha REFCON Oficial y Validación SIS<br />
                • Seguimiento Post-Transferencia (3 y 6 meses)
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button fullWidth variant="outlined" color="secondary" endIcon={<ArrowRight size={16} />}>
                Entrar a Admisión SIS
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Rol 3: REFCON MINSA */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(11, 59, 96, 0.12)' },
              borderTop: '4px solid #7C3AED',
            }}
            onClick={() => navigate('/refcon')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Avatar sx={{ bgcolor: '#F5F3FF', color: '#7C3AED' }}>
                  <Building2 size={22} />
                </Avatar>
                <Chip label="Enfoques E1, E3" size="small" sx={{ fontWeight: 600 }} />
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                3. Central REFCON MINSA
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                • Central de Referencias y Kanban<br />
                • Mapa georreferenciado de hospitales receptores<br />
                • Evaluación de Especialidades y Registro de Cita
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button fullWidth variant="outlined" sx={{ color: '#7C3AED', borderColor: '#7C3AED' }} endIcon={<ArrowRight size={16} />}>
                Entrar a REFCON
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Rol 4: Médico Adulto Receptor */}
        <Grid item xs={12} sm={6} md={6}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(11, 59, 96, 0.12)' },
              borderTop: '4px solid #EA580C',
            }}
            onClick={() => navigate('/medico-externo')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Avatar sx={{ bgcolor: '#FFF7ED', color: '#C2410C' }}>
                  <UserCheck size={22} />
                </Avatar>
                <Chip label="Enfoque E5 (Cierre de Ciclo)" size="small" sx={{ fontWeight: 600 }} />
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                4. Médico Receptor (Hospital Dos de Mayo)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                • VIS 5.2: Lectura de Resumen Médico-a-Médico (Epicrisis Diferida)<br />
                • VIS 5.3: Confirmación de recepción y preparación de la consulta
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button fullWidth variant="outlined" sx={{ color: '#EA580C', borderColor: '#EA580C' }} endIcon={<ArrowRight size={16} />}>
                Entrar como Médico Dos de Mayo
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Rol 5: Portal Paciente (Lucía) */}
        <Grid item xs={12} sm={6} md={6}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(11, 59, 96, 0.12)' },
              borderTop: '4px solid #059669',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #ECFDF5 100%)',
            }}
            onClick={() => navigate('/paciente')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Avatar sx={{ bgcolor: '#D1FAE5', color: '#047857' }}>
                  <Smartphone size={22} />
                </Avatar>
                <Chip label="Enfoque E4 (App Ciudadana)" color="success" size="small" sx={{ fontWeight: 600 }} />
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                5. App Móvil Paciente / Familia (Lucía)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                • VIS 4.1: Estado sin jerga clínica ni tecnicismos<br />
                • VIS 4.2: Módulo interactivo de asimilación psicológica y adherencia<br />
                • VIS 4.3: Ruta en transporte público y guía de llegada
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button fullWidth variant="contained" color="success" endIcon={<ArrowRight size={16} />}>
                Abrir App de Lucía (Mobile View)
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};
