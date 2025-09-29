import { Mensaje } from "../models/Mensaje.model";

export interface EstadoExpedienteResponse {
    id_estado_expediente: number;
    id_expediente: number;
    id_inventario: number;
    estado_recepcionado: string | null;  // char(1)
    estado_preparado: string | null;     // char(1)
    estado_digitalizado: string | null;  // char(1)
    estado_indizado: string | null;      // char(1)
    estado_controlado: string | null;    // char(1)
    estado_fedatado: string | null;      // char(1)
    id_disco: number | null;      // puede ser null si aún no se asignó
    mensajes: Mensaje[];               // jsonb → mejor tipar como any, o un objeto si tienes el schema
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