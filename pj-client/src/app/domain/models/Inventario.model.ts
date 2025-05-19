export interface InventarioModel{
    
    id_inventario: number;
    id_responsable: number;
    especialidad: string;
    cantidad: number;
    anio: number | null;
    tipo_doc: string;
    serie_doc: string;
    sede: string;
    codigo: string;
    
}