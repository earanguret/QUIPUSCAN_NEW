export interface IndizacionModel {
    id_responsable: number,
    id_expediente: number,
    indice: string,
    observaciones: string,
    juzgado_origen: string,
    tipo_proceso: string,
    materia: string,
    demandante: string,
    demandado: string,
    fecha_inicial: Date | null,
    fecha_final: Date | null,
}