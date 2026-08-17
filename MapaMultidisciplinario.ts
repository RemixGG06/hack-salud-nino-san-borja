import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Typography, Box, Chip } from '@mui/material';

// Importas el JSON que armaste desde el Excel
import institutosData from '../../data/institutos_mapa.json';
import { InstitutoMapa } from '../../types/schemas';

// Configuración de íconos de colores para Leaflet
const iconVerde = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const iconRojo = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export const MapaMultidisciplinario = () => {
  // Centro de Lima (INSN San Borja aprox)
  const positionINSN: [number, number] = [-12.1065, -76.9953];

  return (
    <Box sx={{ height: '500px', width: '100%', borderRadius: 2, overflow: 'hidden' }}>
      <MapContainer center={positionINSN} zoom={13} style={{ height: '100%', width: '100%' }}>
        
        {/* Capa de OpenStreetMap (Gratis y Serverless) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Pin del INSN San Borja (Origen) */}
        <Marker position={positionINSN}>
          <Popup>INSN San Borja (Origen)</Popup>
        </Marker>

        {/* Mapeo de Institutos desde el JSON */}
        {institutosData.map((hospital: InstitutoMapa) => (
          <Marker 
            key={hospital.id} 
            position={[hospital.lat, hospital.lng]}
            icon={hospital.match_score > 80 ? iconVerde : iconRojo} // Semáforo de la IA
          >
            <Popup>
              <Typography variant="subtitle2" fontWeight="bold">
                {hospital.nombre}
              </Typography>
              <Chip size="small" label={`Cat: ${hospital.categoria}`} sx={{ mb: 1 }} />
              
              <Typography variant="body2" color="success.main" fontWeight="bold">
                Match Score: {hospital.match_score}%
              </Typography>
              
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                <b>Capacidad:</b> {hospital.capacidad}
              </Typography>
              <Typography variant="caption" display="block" color="error">
                <b>Limitación:</b> {hospital.limitacion}
              </Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};