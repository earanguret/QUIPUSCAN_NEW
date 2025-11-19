export interface FlujogramaResponse {
    id_flujograma?: number;
    create_at: Date | null;
    username: string | null;
    ip: string | null;
    area: string;
}

export interface CrearFlujogramaResponse {
    message: string;
}

export interface EliminarFlujogramaResponse {
    message: string;
}