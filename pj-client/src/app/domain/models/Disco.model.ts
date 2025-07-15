export interface DiscoModel {
    id_disco: number;
    id_inventario: number;
    id_responsable: number;
    nombre: string;
    capacidad_GB: number;
    peso_ocupado: number;
    dir_ftp_acta_apertura: string;
    dir_ftp_acta_cierre: string;
    dir_ftp_tarjeta_apertura: string;
    dir_ftp_tarjeta_cierre: string;
    peso_acta_apertura: number;
    peso_acta_cierre: number;
    peso_tarjeta_apertura: number;
    peso_tarjeta_cierre: number;
    fecha_acta_apertura: Date;
    fecha_acta_cierre: Date;
    fecha_tarjeta_apertura: Date;
    fecha_tarjeta_cierre: Date;
  }