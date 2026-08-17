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
}