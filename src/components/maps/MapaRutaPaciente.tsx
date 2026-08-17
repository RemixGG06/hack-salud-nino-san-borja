import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Typography, Box } from '@mui/material';

const iconCasa = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  iconSize: [26, 42],
  iconAnchor: [13, 42],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const iconHospital = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [28, 45],
  iconAnchor: [14, 45],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41]
});

export const MapaRutaPaciente: React.FC = () => {
  const posCasa: [number, number] = [-12.1158, -77.0175]; // Surquillo (Domicilio de Lucía)
  const posDosDeMayo: [number, number] = [-12.0558, -77.0142]; // Hospital Dos de Mayo
  const centroMapa: [number, number] = [-12.0858, -77.0158];

  // Coordenadas simplificadas del trayecto en transporte (Metropolitano / Vía Expresa)
  const rutaCoordenadas: [number, number][] = [
    posCasa,
    [-12.1120, -77.0220], // Estación Angamos
    [-12.0830, -77.0270], // Estación Canadá / Javier Prado
    [-12.0590, -77.0340], // Estación Central
    [-12.0570, -77.0200], // Av. Grau
    posDosDeMayo
  ];

  return (
    <Box sx={{ height: 280, width: '100%', borderRadius: 2.5, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
      <MapContainer center={centroMapa} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Marcador Casa */}
        <Marker position={posCasa} icon={iconCasa}>
          <Popup>
            <Typography variant="subtitle2" fontWeight="bold">
              🏠 Tu Casa
            </Typography>
            <Typography variant="caption">Jr. Las Gardenias 342, Surquillo</Typography>
          </Popup>
        </Marker>

        {/* Marcador Destino */}
        <Marker position={posDosDeMayo} icon={iconHospital}>
          <Popup>
            <Typography variant="subtitle2" fontWeight="bold" color="success.main">
              🏥 Hospital Dos de Mayo
            </Typography>
            <Typography variant="caption">Pabellón 3 - Consultorio Reumatología</Typography>
          </Popup>
        </Marker>

        {/* Línea de ruta */}
        <Polyline
          positions={rutaCoordenadas}
          pathOptions={{ color: '#00875A', weight: 4, opacity: 0.8, dashArray: '6, 8' }}
        />
      </MapContainer>
    </Box>
  );
};
