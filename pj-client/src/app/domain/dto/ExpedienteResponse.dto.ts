import { ExpedienteModel } from "../models/expediente.model";
export interface ExpedienteResponse {
    id_expediente: number;
    nro_expediente: string;
    id_inventario: number;
    id_responsable: number;
    estado_recepcionado?: boolean;
    estado_preparado?: boolean;
    estado_digitalizado?: boolean;
    estado_indizado?: boolean;
    estado_controlado?: boolean;
    estado_fedatado?: boolean;
    estado_rechazado?: boolean;
    estado_finalizado?: boolean;     

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