export interface DigitalizacionResponseDataView {
    id_digitalizacion?: number;
    id_expediente: number;
    id_responsable: number;
    fojas_total: number | null;
    ocr: boolean | null;
    escala_gris: boolean | null;
    color: boolean | null;
    observaciones: string | null;
    dir_ftp: string | null;
    hash_doc: string | null;
    peso_doc: number | null;
    create_at: Date | null;
    responsable: string | null;
    username: string | null;
    
}

export interface DigitalizacionDataResponse {
    id_digitalizacion?: number;
    id_expediente: number;
    id_responsable: number;
    fojas_total: number | null;
    ocr: boolean | null;
    escala_gris: boolean | null;
    color: boolean | null;
    observaciones: string | null;
    dir_ftp: string | null;
    hash_doc: string | null;
    peso_doc: number | null;
}

export interface CrearDigitalizacionResponse {
    message: string;
}

export interface ModificarDigitalizacionResponse {
    message: string;
}

export interface DigitalizacionTotalImagenesResponse {
    total_imagenes: string;
}