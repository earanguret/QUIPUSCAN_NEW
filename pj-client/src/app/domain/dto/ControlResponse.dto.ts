export interface ControlResponseDataView {
    id_control?: number;
    id_responsable: number;
    id_expediente: number;
    observaciones: string | null;
    val_observaciones: boolean | null;
    val_datos: boolean | null;
    val_nitidez: boolean | null;
    val_pruebas_impresion: boolean | null;
    val_copia_fiel: boolean | null;
    create_at: Date | null;
    responsable: string | null;
    username: string | null;
    
}

export interface ControlDataResponse {
    id_control?: number;
    id_responsable: number;
    id_expediente: number;
    observaciones: string | null;
    val_observaciones: boolean | null;
    val_datos: boolean | null;
    val_nitidez: boolean | null;
    val_pruebas_impresion: boolean | null;
    val_copia_fiel: boolean | null;
}

export interface CrearControlResponse {
    message: string;
}

export interface ModificarControlResponse {
    message: string;
}