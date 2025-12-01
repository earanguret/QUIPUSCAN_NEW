import { ExpedienteModel } from "../models/expediente.model";
export interface ExpedienteResponse {
    id_expediente: number;
    nro_expediente: string;
    id_inventario: number;
    id_responsable: number;
    cod_paquete: string;
    estado_recepcionado?: string;
    estado_preparado?: string;
    estado_digitalizado?: string;
    estado_indizado?: string;
    estado_controlado?: string;
    estado_fedatado?: string;
    estado_finalizado?: string;
}

export interface ExpedienteCoincidenciaResponse{
    id_expediente: number;
    nro_expediente: string;
    id_inventario: number;
    codigo_inventario: string | null;
}

export interface ExpedienteResponseDataView {
    id_expediente: number;
    nro_expediente: string;
    id_inventario: number;
    codigo_inventario: string;
    id_responsable: number;
    cod_paquete: string;
    responsable: string | null;
    create_at: Date | null;
    username: string | null;
}

export interface ExpedienteSinDiscoResponse {
    id_expediente: number;
    nro_expediente: string;
    id_inventario: number;
    estado_fedatado: string;
    peso_doc: number;
    fojas_total: number;
}

export interface ExpedientesDiscoResponse {
    id_expediente: number;
    nro_expediente: string;
    id_inventario: number;
    estado_fedatado: string;
    peso_doc: number;
    fojas_total: number;
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