import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Typography, Box, Chip, Button, Paper, Alert, Divider } from '@mui/material';
import { Building2, CheckCircle2, AlertTriangle, ArrowRight, Hospital, Info } from 'lucide-react';
import institutosData from '../../data/institutos_mapa.json';
import { InstitutoMapa } from '../../types/schemas';

// Configuración de íconos coloreados Leaflet
const iconOrigen = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconSize: [28, 45],
  iconAnchor: [14, 45],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const iconVerde = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [26, 42],
  iconAnchor: [13, 42],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const iconAmbar = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  iconSize: [26, 42],
  iconAnchor: [13, 42],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const iconRojo = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [26, 42],
  iconAnchor: [13, 42],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41]
});

interface MapaProps {
  onSelectHospital?: (hospital: InstitutoMapa) => void;
  selectedHospitalId?: string;
  buttonText?: string;
}

export const getCompatibilidadData = (score: number) => {
  if (score >= 85) {
    return {
      nivel: 'Óptimo / Ideal',
      color: 'success' as const,
      bg: '#DCFCE7',
      text: '#166534',
      icono: iconVerde,
      descripcion: 'Cumple con todas las especialidades requeridas (Reumatología + Nefrología Adultos).'
    };
  }
  if (score >= 70) {
    return {
      nivel: 'Aceptable',
      color: 'warning' as const,
      bg: '#FEF3C7',
      text: '#92400E',
      icono: iconAmbar,
      descripcion: 'Cuenta con especialidad troncal pero con tiempos de espera variables.'
    };
  }
  return {
    nivel: 'Incompleto',
    color: 'error' as const,
    bg: '#FEE2E2',
    text: '#991B1B',
    icono: iconRojo,
    descripcion: 'No cuenta con la cartera completa de subespecialidades para este caso.'
  };
};

export const MapaMultidisciplinario: React.FC<MapaProps> = ({
  onSelectHospital,
  selectedHospitalId = 'H001',
  buttonText = 'Agendar Cita Ya Confirmada por el Instituto Externo',
}) => {
  const positionINSN: [number, number] = [-12.1065, -76.9953]; // INSN San Borja
  const [activeHospital, setActiveHospital] = useState<InstitutoMapa | null>(() => {
    return (institutosData as InstitutoMapa[]).find((h) => h.id === selectedHospitalId) || null;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'stretch' }}>
      {/* Contenedor del Mapa Espacioso */}
      <Box sx={{ flex: 1, minHeight: { xs: 340, sm: 460 }, height: { xs: 360, sm: 480, md: 'auto' }, borderRadius: 2.5, overflow: 'hidden', border: '1px solid #E2E8F0', position: 'relative' }}>
        <MapContainer center={positionINSN} zoom={12} style={{ height: '100%', minHeight: '340px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Pin INSN Origen */}
          <Marker position={positionINSN} icon={iconOrigen}>
            <Popup>
              <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                🏥 INSN San Borja (Origen Pediátrico)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Punto de inicio de la transferencia de Lucía.
              </Typography>
            </Popup>
          </Marker>

          {/* Pines Hospitales Adultos */}
          {(institutosData as InstitutoMapa[]).map((hospital) => {
            const compat = getCompatibilidadData(hospital.match_score);
            return (
              <Marker
                key={hospital.id}
                position={[hospital.lat, hospital.lng]}
                icon={compat.icono}
                eventHandlers={{
                  click: () => {
                    setActiveHospital(hospital);
                  },
                }}
              >
                <Popup>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {hospital.nombre}
                  </Typography>
                  <Chip
                    size="small"
                    label={compat.nivel}
                    color={compat.color}
                    sx={{ my: 0.5, fontWeight: 'bold' }}
                  />
                  <Typography variant="caption" display="block">
                    {hospital.capacidad}
                  </Typography>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Leyenda Cualitativa Flotante */}
        <Paper
          elevation={2}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1000,
            p: 1.5,
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(6px)',
            borderRadius: 2,
            border: '1px solid #E2E8F0',
            maxWidth: 220
          }}
        >
          <Typography variant="caption" fontWeight="800" display="block" color="primary.main" sx={{ mb: 0.8, fontSize: '0.75rem' }}>
            Compatibilidad de Especialidades
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#00875A', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#166534' }}>
                Óptimo / Ideal
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FFAB00', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#92400E' }}>
                Aceptable
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#DE350B', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#991B1B' }}>
                Incompleto
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Panel Lateral: Sugerencia de Hospitales para REFCON */}
      <Box sx={{ width: { xs: '100%', md: 340, lg: 350 }, display: 'flex', flexDirection: 'column', gap: 1.5, flexShrink: 0 }}>
        {/* Banner Informativo para REFCON */}
        <Paper
          elevation={0}
          sx={{
            p: 1.8,
            bgcolor: '#F0F9FF',
            border: '1px solid #BAE3FF',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Hospital size={18} color="#0065FF" />
            <Typography variant="subtitle2" fontWeight="800" color="primary.main">
              Sugerencia de Hospitales para REFCON:
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.4 }}>
            Estos son los institutos que cuentan con las especialidades que requiere el paciente (<b>Cardiología Adultos</b> y <b>Cirugía Cardiovascular</b>).
          </Typography>
        </Paper>

        {activeHospital ? (
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
            {(() => {
              const compat = getCompatibilidadData(activeHospital.match_score);
              return (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                    <Chip
                      label={`Nivel ${activeHospital.categoria}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ height: 22, fontSize: '0.7rem' }}
                    />
                    <Chip
                      label={compat.nivel}
                      color={compat.color}
                      sx={{ fontWeight: 'bold', height: 22, fontSize: '0.7rem' }}
                    />
                  </Box>

                  <Typography variant="subtitle1" fontWeight="700" color="primary.main" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                    {activeHospital.nombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    📍 {activeHospital.direccion || 'Lima Metropolitana'}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="caption" fontWeight="700" sx={{ mb: 0.5, display: 'block' }}>
                    Especialidades Requeridas para el Caso:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
                    {activeHospital.servicios_disponibles?.map((srv, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <CheckCircle2 size={14} color="#00875A" style={{ flexShrink: 0 }} />
                        <Typography variant="caption" color="text.primary" fontWeight="500">
                          {srv}
                        </Typography>
                      </Box>
                    ))}
                    {activeHospital.servicios_faltantes && activeHospital.servicios_faltantes.length > 0 && (
                      activeHospital.servicios_faltantes.map((srv, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <AlertTriangle size={14} color="#DE350B" style={{ flexShrink: 0 }} />
                          <Typography variant="caption" color="error.main" fontWeight="600">
                            {srv}
                          </Typography>
                        </Box>
                      ))
                    )}
                  </Box>

                  <Alert severity="info" sx={{ mb: 1.5, py: 0.5, px: 1, fontSize: '0.75rem' }}>
                    <b>Capacidad y Cartera:</b> {activeHospital.capacidad}
                  </Alert>

                  {onSelectHospital && (
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      size="small"
                      endIcon={<ArrowRight size={14} />}
                      onClick={() => onSelectHospital(activeHospital)}
                      sx={{ py: 1, fontSize: '0.78rem', fontWeight: '800', mt: 1 }}
                    >
                      {buttonText}
                    </Button>
                  )}
                </>
              );
            })()}
          </Paper>
        ) : (
          <Paper elevation={0} sx={{ p: 2, border: '1px dashed #CBD5E1', borderRadius: 2.5, textAlign: 'center' }}>
            <Building2 size={24} color="#94A3B8" />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Selecciona un hospital en el mapa para ver la disponibilidad de sus especialidades.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};
