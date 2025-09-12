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