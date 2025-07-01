
export interface DigitalizacionModel{
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