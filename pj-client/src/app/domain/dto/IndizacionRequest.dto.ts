export interface IndizacionRequest{
    id_expediente: number;
    id_responsable: number;
    indice: string | null;
    observaciones: string | null;
    juzgado_origen: string | null;
    tipo_proceso : string | null;
    materia: string | null;
    demandante: string | null;
    demandado: string | null;
    fecha_inicial : Date | string | null;
    fecha_final : Date| string | null;
    app_user: string;
}