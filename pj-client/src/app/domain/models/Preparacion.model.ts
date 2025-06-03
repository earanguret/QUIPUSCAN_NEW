export interface PreparacionModel {
   id_preparacion?: number;
   id_expediente: number;
   id_responsable: number;
   fojas_total: number | null;
   fojas_unacara: number | null;
   fojas_doscaras: number | null;
   observaciones: string | null;
   copias_originales: boolean | null;
   copias_simples: boolean  | null;
}