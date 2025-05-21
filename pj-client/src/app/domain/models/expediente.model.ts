export interface ExpedienteModel{
    id_expediente: number;
    nro_expediente: string;
    id_inventario: number;
    id_responsable: number;
    juzgado_origen?: string;
    tipo_proceso?: string;
    materia?: string;
    demandante?: string;
    demandado?: string;
    fecha_inicial?: string;
    fecha_final?: string;

}