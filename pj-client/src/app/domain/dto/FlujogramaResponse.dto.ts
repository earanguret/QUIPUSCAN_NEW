export interface FlujogramaResponse {
    id_flujograma?: number;
    create_at: Date | null;
    id_expediente: number;
    id_responsable: number;
    area: string;
}

export interface CrearFlujogramaResponse {
    message: string;
}

export interface EliminarFlujogramaResponse {
    message: string;
}