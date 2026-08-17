import React, { createContext, useContext, useState, useEffect } from 'react';
import { PatientState, TransitionStage } from '../types/schemas';

interface AppContextType {
  pacienteLucia: PatientState;
  otrosPacientes: PatientState[];
  todosLosPacientes: PatientState[];
  etapaActual: TransitionStage;
  // Acciones de transición
  simularExtraccionIA: () => Promise<void>;
  medicoAprobarYSugerir: (hospitalId: string) => void;
  adminAprobarQA: (observaciones: string) => void;
  refconConfirmarReceptor: (hospitalId: string, fechaCita: string, horaCita: string) => void;
  medicoExternoLeerEpicrisis: () => void;
  medicoExternoConfirmarRecepcion: (notas: string) => void;
  adminRegistrarAsistencia: () => void;
  adminRegistrarSeguimiento: (meses: '3m' | '6m', estado: 'EN_TRATAMIENTO' | 'PENDIENTE' | 'PERDIDA') => void;
  resetDemo: () => void;
  isLoadingIA: boolean;
}

const PACIENTE_INICIAL_LUCIA: PatientState = {
  id: 'PAC-001',
  nombre: 'Lucía Mendoza Rivera',
  edad: 17,
  sexo: 'Femenino',
  dni: '76543210',
  diagnostico_principal: 'Cardiopatía Congénita (Defecto del Tabique Ventricular Corregido) + Parche Protésico',
  diagnostico_cie10: 'Q21.0 / Z95.2',
  etapa_actual: '1_IDENTIFICACION',
  etapa_numero: 1,
  prioridad: 'ALTA',
  motivo_prioridad: 'Mayoría de edad inminente (17a 10m) + Cardiopatía congénita requiere transición a Unidad GUCH Adultos',
  dias_sin_avance: 2,
  medico_tratante: 'Dr. Carlos Ruiz (CMP 45678)',
  servicio_origen: 'Cardiología Pediátrica',
  instituto_sugerido_id: 'H001',
  resumen_clinico_validado: false,
  ficha_refcon_qa: false,
  epicrisis_generada: false,
  epicrisis_leida: false,
  recepcion_confirmada: false,
};

const OTROS_PACIENTES_MOCK: PatientState[] = [
  {
    id: 'PAC-002',
    nombre: 'Mateo Quispe Gómez',
    edad: 17,
    sexo: 'Masculino',
    dni: '71239845',
    diagnostico_principal: 'Lupus Eritematoso Sistémico en Remisión',
    diagnostico_cie10: 'M32.1',
    etapa_actual: '4_QA_ADMIN_APROBADO',
    etapa_numero: 4,
    prioridad: 'MEDIA',
    motivo_prioridad: 'Cumple 18 años en 3 meses, requiere control reumatológico',
    dias_sin_avance: 8,
    medico_tratante: 'Dra. Patricia Silva',
    servicio_origen: 'Reumatología Pediátrica',
    instituto_sugerido_id: 'H002',
    resumen_clinico_validado: true,
    ficha_refcon_qa: true,
  },
  {
    id: 'PAC-003',
    nombre: 'Sofía Valdivia Cruz',
    edad: 17,
    sexo: 'Femenino',
    dni: '78451290',
    diagnostico_principal: 'Epilepsia Refractaria + Retraso del Desarrollo',
    diagnostico_cie10: 'G40.9',
    etapa_actual: '6_RECEPTOR_CONFIRMADO',
    etapa_numero: 6,
    prioridad: 'ALTA',
    motivo_prioridad: 'Polimedicación anticonvulsiva de alta complejidad',
    dias_sin_avance: 16,
    medico_tratante: 'Dr. Hugo Paredes',
    servicio_origen: 'Neurología Pediátrica',
    instituto_sugerido_id: 'H003',
    instituto_confirmado_id: 'H003',
    fecha_cita_adulta: '2026-08-28',
    hora_cita_adulta: '10:00 AM',
    resumen_clinico_validado: true,
    ficha_refcon_qa: true,
    epicrisis_generada: true,
  },
  {
    id: 'PAC-004',
    nombre: 'Joaquín Benítez Ramos',
    edad: 18,
    sexo: 'Masculino',
    dni: '70984532',
    diagnostico_principal: 'Insuficiencia Renal Crónica Terminal en Hemodiálisis',
    diagnostico_cie10: 'N18.5',
    etapa_actual: '8_SEGUIMIENTO_ACTIVO',
    etapa_numero: 7,
    prioridad: 'ALTA',
    motivo_prioridad: 'Transferido a Hospital Loayza. En seguimiento post-transferencia.',
    dias_sin_avance: 0,
    medico_tratante: 'Dr. Carlos Ruiz',
    servicio_origen: 'Nefrología Pediátrica',
    instituto_confirmado_id: 'H001',
    fecha_cita_adulta: '2026-07-10',
    asistencia_primera_cita: true,
    seguimiento_3m: 'EN_TRATAMIENTO',
    resumen_clinico_validado: true,
    ficha_refcon_qa: true,
    epicrisis_generada: true,
    recepcion_confirmada: true,
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pacienteLucia, setPacienteLucia] = useState<PatientState>(() => {
    const saved = localStorage.getItem('puente18_lucia_state');
    return saved ? JSON.parse(saved) : PACIENTE_INICIAL_LUCIA;
  });

  const [isLoadingIA, setIsLoadingIA] = useState(false);

  useEffect(() => {
    localStorage.setItem('puente18_lucia_state', JSON.stringify(pacienteLucia));
  }, [pacienteLucia]);

  const simularExtraccionIA = async () => {
    setIsLoadingIA(true);
    await new Promise((resolve) => setTimeout(resolve, 2200));
    setPacienteLucia((prev) => ({
      ...prev,
      etapa_actual: '2_EXTRACCION_IA',
      etapa_numero: 2,
    }));
    setIsLoadingIA(false);
  };

  const medicoAprobarYSugerir = (hospitalId: string) => {
    setPacienteLucia((prev) => ({
      ...prev,
      etapa_actual: '3_MEDICO_VALIDADO',
      etapa_numero: 3,
      instituto_sugerido_id: hospitalId,
      resumen_clinico_validado: true,
      dias_sin_avance: 0,
    }));
  };

  const adminAprobarQA = (observaciones: string) => {
    setPacienteLucia((prev) => ({
      ...prev,
      etapa_actual: '4_QA_ADMIN_APROBADO',
      etapa_numero: 4,
      ficha_refcon_qa: true,
      qa_observaciones: observaciones,
      dias_sin_avance: 0,
    }));
  };

  const refconConfirmarReceptor = (hospitalId: string, fechaCita: string, horaCita: string) => {
    setPacienteLucia((prev) => ({
      ...prev,
      etapa_actual: '6_RECEPTOR_CONFIRMADO',
      etapa_numero: 5,
      instituto_confirmado_id: hospitalId,
      fecha_cita_adulta: fechaCita,
      hora_cita_adulta: horaCita,
      epicrisis_generada: true, // Trigger de la arquitectura: Epicrisis se genera tras confirmar cupo
      dias_sin_avance: 0,
    }));
  };

  const medicoExternoLeerEpicrisis = () => {
    setPacienteLucia((prev) => ({
      ...prev,
      epicrisis_leida: true,
    }));
  };

  const medicoExternoConfirmarRecepcion = (notas: string) => {
    setPacienteLucia((prev) => ({
      ...prev,
      etapa_actual: '7_MEDICO_EXTERNO_ACEPTADO',
      etapa_numero: 6,
      recepcion_confirmada: true,
      fecha_recepcion: new Date().toISOString(),
      notas_medico_externo: notas,
      dias_sin_avance: 0,
    }));
  };

  const adminRegistrarAsistencia = () => {
    setPacienteLucia((prev) => ({
      ...prev,
      asistencia_primera_cita: true,
      etapa_actual: '8_SEGUIMIENTO_ACTIVO',
      etapa_numero: 7,
      seguimiento_3m: 'PENDIENTE',
    }));
  };

  const adminRegistrarSeguimiento = (meses: '3m' | '6m', estado: 'EN_TRATAMIENTO' | 'PENDIENTE' | 'PERDIDA') => {
    setPacienteLucia((prev) => ({
      ...prev,
      ...(meses === '3m' ? { seguimiento_3m: estado } : { seguimiento_6m: estado }),
    }));
  };

  const resetDemo = () => {
    setPacienteLucia(PACIENTE_INICIAL_LUCIA);
    localStorage.removeItem('puente18_lucia_state');
  };

  const todosLosPacientes = [pacienteLucia, ...OTROS_PACIENTES_MOCK];

  return (
    <AppContext.Provider
      value={{
        pacienteLucia,
        otrosPacientes: OTROS_PACIENTES_MOCK,
        todosLosPacientes,
        etapaActual: pacienteLucia.etapa_actual,
        simularExtraccionIA,
        medicoAprobarYSugerir,
        adminAprobarQA,
        refconConfirmarReceptor,
        medicoExternoLeerEpicrisis,
        medicoExternoConfirmarRecepcion,
        adminRegistrarAsistencia,
        adminRegistrarSeguimiento,
        resetDemo,
        isLoadingIA,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};
