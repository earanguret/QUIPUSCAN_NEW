import { Request, Response } from "express";
import db from '../database/database';

class ReporteController {

    public async datos_estaticos(req: Request, res: Response) {
        try {
            const consulta = `
               SELECT
                    -- Totales simples
                    (SELECT COUNT(*) 
                    FROM archivo.t_inventario) AS total_inventarios,

                    (SELECT COUNT(*) 
                    FROM archivo.t_expediente) AS total_expedientes,

                    (SELECT COUNT(*) 
                    FROM archivo.t_estado_expediente 
                    WHERE estado_digitalizado = 'T') AS total_digitalizados,

                    (SELECT SUM(fojas_total) 
                    FROM archivo.t_digitalizacion) AS total_fojas,

                    -- Altura (m)
                    (SELECT ROUND(SUM(fojas_total) * 0.0001, 2) 
                    FROM archivo.t_preparacion) AS altura_m,

                    -- Volumen (m³)
                    (SELECT ROUND(SUM(fojas_total) * 0.000006237, 2) 
                    FROM archivo.t_preparacion) AS volumen_m3,

                    -- Peso (kg)
                    (SELECT ROUND(SUM(fojas_total) * 4.99 / 1000.0, 2) 
                    FROM archivo.t_preparacion) AS peso_kg,

                    -- Tamaño digital en GB
                    (SELECT ROUND(SUM(peso_doc) / 1024.0 / 1024.0 / 1024.0, 2) 
                    FROM archivo.t_digitalizacion) AS peso_gb,

                    -- total de discos
                    (SELECT COUNT(*) from archivo.t_disco) AS total_discos,

                    -- total de usuarios activos
                    (SELECT COUNT(*) from archivo.t_usuario where estado= true) AS usuarios_activos;
            `;

            db.query(consulta, (error, result) => {
                if (error) {
                    console.error("Error en la consulta:", error);
                    res.status(500).json({ error: "Error interno del servidor" });
                } else {
                    res.status(200).json(result.rows[0]);
                }
            });
        } catch (error) {
            console.error("Error al crear el reporte de datos estaticos:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async producionTotal(req: Request, res: Response)  {
        try {
            const consulta = `
                    SELECT
                        COUNT(*) AS total_expedientes,

                        ROUND(100.0 * COUNT(*) FILTER (WHERE estado_preparado = 'T') / COUNT(*), 2)      AS pct_preparados,
                        ROUND(100.0 * COUNT(*) FILTER (WHERE estado_digitalizado = 'T') / COUNT(*), 2)   AS pct_digitalizados,
                        ROUND(100.0 * COUNT(*) FILTER (WHERE estado_indizado = 'T') / COUNT(*), 2)       AS pct_indizados,
                        ROUND(100.0 * COUNT(*) FILTER (WHERE estado_controlado = 'T') / COUNT(*), 2)     AS pct_controlados,
                        ROUND(100.0 * COUNT(*) FILTER (WHERE estado_fedatado = 'T') / COUNT(*), 2)       AS pct_fedatados
                    FROM archivo.t_estado_expediente;
            `;

            db.query(consulta, (error, result) => {
                if (error) {
                    console.error("Error en la consulta:", error);
                    res.status(500).json({ error: "Error interno del servidor" });
                } else {
                    res.status(200).json(result.rows[0]);
                }
            });
        } catch (error) {
            console.error("Error al crear el reporte:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }


    public async produccionAnual(req: Request, res: Response): Promise<any> {
        try {
            const consulta = `
                WITH meses AS (
                    SELECT generate_series(
                        DATE_TRUNC('year', CURRENT_DATE),
                        DATE_TRUNC('year', CURRENT_DATE) + interval '11 month',
                        interval '1 month'
                    ) AS mes
                )
                SELECT 
                    TO_CHAR(m.mes, 'YYYY-MM') AS periodo,
                    
                    CASE EXTRACT(MONTH FROM m.mes)::int
                        WHEN 1 THEN 'Ene'
                        WHEN 2 THEN 'Feb'
                        WHEN 3 THEN 'Mar'
                        WHEN 4 THEN 'Abr'
                        WHEN 5 THEN 'May'
                        WHEN 6 THEN 'Jun'
                        WHEN 7 THEN 'Jul'
                        WHEN 8 THEN 'Ago'
                        WHEN 9 THEN 'Sep'
                        WHEN 10 THEN 'Oct'
                        WHEN 11 THEN 'Nov'
                        WHEN 12 THEN 'Dic'
                    END AS mes_nombre,

                    (SELECT COUNT(*) FROM archivo.t_preparacion p 
                    WHERE DATE_TRUNC('month', p.f_aud) = m.mes) AS expedientes_preparacion,

                    (SELECT COUNT(*) FROM archivo.t_digitalizacion d 
                    WHERE DATE_TRUNC('month', d.f_aud) = m.mes) AS expedientes_digitalizacion,

                    (SELECT COUNT(*) FROM archivo.t_indizacion i 
                    WHERE DATE_TRUNC('month', i.f_aud) = m.mes) AS expedientes_indizacion,

                    (SELECT COUNT(*) FROM archivo.t_control c 
                    WHERE DATE_TRUNC('month', c.f_aud) = m.mes) AS expedientes_control,

                    (SELECT COUNT(*) FROM archivo.t_fedatar f 
                    WHERE DATE_TRUNC('month', f.f_aud) = m.mes) AS expedientes_fedatario

                FROM meses m
                ORDER BY m.mes;
            `;

            db.query(consulta, (error, result) => {
                if (error) {
                    console.error("Error al insertar datos de anual de producción:", error);
                    res.status(500).json({ error: "Error interno del servidor" });
                } else {
                    res.status(200).json(result.rows);
                }
            });
        }
        catch (error) {
            console.error("Error al crear el reporte de datos estaticos:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

const reporteController = new ReporteController();
export default reporteController;

