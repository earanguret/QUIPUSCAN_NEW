export interface ControlRequest{
    id_responsable: number;
    id_expediente: number;
    observaciones: string | null;
    val_observaciones: boolean | null;
    val_datos: boolean | null;
    val_nitidez: boolean | null;
    val_pruebas_impresion: boolean | null;
    val_copia_fiel: boolean | null;
    app_user: string;
}