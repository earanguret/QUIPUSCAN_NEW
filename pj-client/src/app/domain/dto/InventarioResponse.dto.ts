export interface InventarioResponse {
    
    id_inventario: number;
    id_responsable: number;
    especialidad: string;
    anio: number | null;
    tipo_doc: string;
    serie_doc: string;
    sede: string;
    cantidad: number;
    codigo: string;
    
}

export interface InventarioDetalleResponse {
    
    id_inventario: number;
    id_responsable: number;
    especialidad: string;
    anio: number;
    tipo_doc: string;
    serie_doc: string;
    sede: string;
    cantidad: number;
    codigo: string;
    create_at : Date | null ,
    username : string;
    nombre : string;
    ap_paterno : string;
    ap_materno : string;
    
}

export interface InventarioCrearResponse{
    id_inventario: number;
    text: string;
}