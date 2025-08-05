import { Mensaje } from "../models/Mensaje.model";

export interface EstadoResponse {
    id_estado_expediente: number;
    id_expediente: number;
    estado_recepcionado: boolean;
    estado_preparado: boolean;
    estado_digitalizado: boolean;
    estado_indizado: boolean;
    estado_controlado: boolean;
    estado_fedatado: boolean;
    estado_rechazado: boolean;
    estado_finalizado: boolean;
    id_cd: number;
    mensajes: string;
}

export interface CrearEstadoResponse {
    message: string;
}  

export interface ModificarEstadoResponse {
    message: string;
}

export interface EliminarEstadoResponse {
    message: string;
}

export interface AsociarExpedientesADiscoResponse {
    message: string;
}

export interface MensajeGuardarResponse {
    message: string;
}

export interface EstadoMensajesResponse {
    mensajes: Mensaje[];
}