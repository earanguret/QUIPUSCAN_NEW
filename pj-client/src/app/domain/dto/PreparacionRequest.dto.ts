export interface PreparacionRequest{
    id_responsable: number;
    id_expediente: number;
    fojas_total: number | null;
    fojas_unacara: number | null;
    fojas_doscaras: number | null;
    observaciones: string | null;
    copias_originales: boolean | null;
    copias_simples: boolean | null;
    app_user: string;
}