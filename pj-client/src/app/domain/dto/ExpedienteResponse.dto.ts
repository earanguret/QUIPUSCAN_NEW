export interface ExpedienteResponse {
    id_expediente: number;
    nro_expediente: string;
    id_inventario: number;
    id_responsable: number;
}

export interface CrearExpedienteResponse {
    id_expediente: number;
    nro_expediente: string;
    id_inventario: number;
    id_responsable: number;
}

export interface EliminarExpedienteResponse {
    message: string;
}