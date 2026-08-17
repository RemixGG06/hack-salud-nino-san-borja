export interface InstitutoMapa {
  id: string;
  nombre: string;
  categoria: string;
  patologias_cubiertas: string[];
  departamento: string;
  capacidad: string;
  limitacion: string;
  lat: number;
  lng: number;
  match_score: number;
  direccion?: string;
  servicios_disponibles?: string[];
  servicios_faltantes?: string[];
}

export type TransitionStage = 
  | '1_IDENTIFICACION'
  | '2_EXTRACCION_IA'
  | '3_MEDICO_VALIDADO'
  | '4_QA_ADMIN_APROBADO'
  | '5_REFCON_ENVIADO'
  | '6_RECEPTOR_CONFIRMADO'
  | '7_MEDICO_EXTERNO_ACEPTADO'
  | '8_SEGUIMIENTO_ACTIVO';

export interface PatientState {
  id: string;
  nombre: string;
  edad: number;
  sexo: string;
  dni: string;
  diagnostico_principal: string;
  diagnostico_cie10: string;
  etapa_actual: TransitionStage;
  etapa_numero: number; // 1 to 7
  prioridad: 'ALTA' | 'MEDIA' | 'NORMAL';
  motivo_prioridad: string;
  dias_sin_avance: number;
  medico_tratante: string;
  servicio_origen: string;
  instituto_sugerido_id?: string;
  instituto_confirmado_id?: string;
  fecha_cita_adulta?: string;
  hora_cita_adulta?: string;
  resumen_clinico_validado?: boolean;
  ficha_refcon_qa?: boolean;
  qa_observaciones?: string;
  epicrisis_generada?: boolean;
  epicrisis_leida?: boolean;
  recepcion_confirmada?: boolean;
  fecha_recepcion?: string;
  notas_medico_externo?: string;
  asistencia_primera_cita?: boolean;
  seguimiento_3m?: 'EN_TRATAMIENTO' | 'PENDIENTE' | 'PERDIDA';
  seguimiento_6m?: 'EN_TRATAMIENTO' | 'PENDIENTE' | 'PERDIDA';
}
