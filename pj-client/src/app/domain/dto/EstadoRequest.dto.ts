export interface EstadoRequest{
    id_expediente: number;
    estado_recepcionado?: boolean;
    estado_preparado?: boolean;
    estado_digitalizado?: boolean;
    estado_indizado?: boolean;
    estado_controlado?: boolean;
    estado_fedatado?: boolean;
    estado_rechazado?: boolean;
    estado_finalizado?: boolean;
    id_cd?: number;
    app_user: string;
}