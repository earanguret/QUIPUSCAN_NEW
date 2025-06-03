import { ExpedienteModel } from "../models/expediente.model";
export interface ExpedienteResponse {
    id_expediente: number;
    nro_expediente: string;
    id_inventario: number;
    id_responsable: number;
    estado_recepcionado?: string;
    estado_preparado?: string;
    estado_digitalizado?: string;
    estado_indizado?: string;
    estado_controlado?: string;
    estado_fedatado?: string;
    estado_finalizado?: string;

}

export interface CrearExpedienteResponse {
    expediente: ExpedienteModel;
    message: string;
}

export interface EliminarExpedienteResponse {
    message: string;
}

export interface ModificarExpedienteResponse {
    message: string;
}