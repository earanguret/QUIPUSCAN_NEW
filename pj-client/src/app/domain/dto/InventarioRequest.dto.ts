export interface InventarioRequest{
    
    id_inventario: number;
    id_responsable: number;
    especialidad: string;
    anio: number | null;
    tipo_doc: string;
    serie_doc: string;
    sede: string;
    cantidad: number;
    codigo: string;
    app_user: string;
    
}