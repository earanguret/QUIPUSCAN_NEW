export interface DiscoRequest {
    id_inventario?: number | null;
    id_responsable_crear?: number | null;
    nombre?: string | null;
    volumen?: number | null;
    capacidad_gb?: number | null;
    peso_ocupado?: number | null;
    dir_ftp_acta_apertura?: string | null;
    dir_ftp_acta_cierre?: string | null;
    dir_ftp_tarjeta_apertura?: string | null;
    dir_ftp_tarjeta_cierre?: string | null;
    peso_acta_apertura?: number | null;
    peso_acta_cierre?: number | null;
    peso_tarjeta_apertura?: number | null;
    peso_tarjeta_cierre?: number | null;
    fecha_acta_apertura?: Date | null;
    fecha_acta_cierre?: Date | null;
    fecha_tarjeta_apertura?: Date | null;
    fecha_tarjeta_cierre?: Date | null;
    id_responsable_tca?: number | null;
    id_responsable_tcc?: number | null;
    id_responsable_aa?: number | null;
    id_responsable_ac?: number | null;
    estado_cerrado?: boolean;
    id_responsable_cierre?: number | null;
    app_user: string | null;
}