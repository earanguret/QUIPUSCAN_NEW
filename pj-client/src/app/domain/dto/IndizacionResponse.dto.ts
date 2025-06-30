export interface IndizacionDataResponse {
    create_at: Date | null;
    id_indizacion: number;
    id_expediente: number;
    id_responsable: number;
    indice: string | null;
    observaciones: string | null;
    juzgado_origen: string | null;
    tipo_proceso : string | null;
    materia: string | null;
    demandante: string | null;
    demandado: string | null;
    fecha_inicial : Date | null;
    fecha_final : Date | null;
    
}
export interface IndizacionDataDetalleResponse {
    create_at: Date | null;
    id_indizacion: number;
    id_expediente: number;
    id_responsable: number;
    indice: string | null;
    observaciones: string | null;
    juzgado_origen: string | null;
    tipo_proceso : string | null;
    materia: string | null;
    demandante: string | null;
    demandado: string | null;
    fecha_inicial : Date | null;
    fecha_final : Date | null;
    username: string;
    nombre: string;
    ap_paterno: string;
    ap_materno: string;
}

export interface CrearIndizacionResponse {
    message: string;
}

export interface ModificarIndizacionResponse {
    message: string;
}