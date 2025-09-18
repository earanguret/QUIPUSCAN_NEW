import { ApexOptions } from "apexcharts";

export interface datos_estaticos{
    total_inventarios: number;
    total_expedientes: number;
    total_digitalizados: number;
    total_fojas: number;
    altura_m: number;
    volumen_m3: number;
    peso_kg: number;
    peso_gb: number;
    total_discos: number;
    usuarios_activos: number;
}

export interface estado_produccion_total{
    total_expedientes: number;
    pct_preparados: number;
    pct_digitalizados: number;
    pct_indizados: number;
    pct_controlados: number;
    pct_fedatados: number;
}

export interface produccion_mensual {
    periodo: string;                   
    mes_nombre: string;                
    expedientes_preparacion: number;   
    expedientes_digitalizacion: number;
    expedientes_indizacion: number;    
    expedientes_control: number;       
    expedientes_fedatario: number;    
  }

export interface datos_usuarios {
    id_usuario: number;
    username: string;
    perfil: string;
    estado: boolean;
    nombre: string;
    ap_paterno: string;
    ap_materno: string;
    dni: string;
    create_at: Date;
}

export interface serie_documental_reporte {
    id_inventario: number;
    anio: number;
    cantidad: number;
    serie_doc: string;
    especialidad: string;
    codigo: string;
    sede: string;
}


export interface produccion_serie_documental_reporte {
    id_inventario: number;
    serie_doc: string;
    codigo: string;
    sede: string;
    anio: number;
    cantidad: number;
    tipo_doc: string;
    especialidad: string;
  
    id_responsable: number | null;
    nombre_responsable: string | null;
  
    total_expedientes: number;
    expedientes_preparados: number;
    expedientes_digitalizados: number;
    expedientes_indizados: number;
    expedientes_controlados: number;
    expedientes_fedatados: number;
  
    total_discos_cerrados: number;

    chartOptionsBar?: Partial<ApexOptions>;

  }


  export interface produccion_usuario {
    id_usuario: number;
    username: string;
    perfil: string;
    nombre_usuario: string;
    expedientes_preparados: number;
    expedientes_digitalizados: number;
    expedientes_indizados: number;
    expedientes_controlados: number;
    expedientes_fedatados: number;
  }
  

  export interface produccion_usuario_dias{
    fecha: string;
    total_expedientes: number;
  }