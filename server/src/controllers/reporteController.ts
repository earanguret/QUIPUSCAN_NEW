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


    public async produccionMensual(req: Request, res: Response): Promise<any> {
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

    public async UsuariosReporte(req: Request, res: Response): Promise<any> {
        try {
            const consulta = `
                SELECT
                    u.id_usuario,
                    u.username,
                    u.perfil,
                    u.estado,
                    p.nombre,
                    p.ap_paterno,
                    p.ap_materno,
                    p.dni,
                    u.create_at
                FROM
                    archivo.t_usuario u
                JOIN
                    archivo.t_persona p ON u.id_persona = p.id_persona
                ORDER BY u.estado desc;
            `;
            db.query(consulta, (error, result) => {
                if (error) {
                    console.error("Error al insertar datos de anual de producción:", error);
                    res.status(500).json({ error: "Error interno del servidor" });
                } else {
                    res.status(200).json(result.rows);
                }
            });
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async SerieDocumentalReporte(req: Request, res: Response): Promise<any> {
        try {
            const consulta = `
                SELECT id_inventario, anio, cantidad, serie_doc, especialidad, codigo, sede FROM archivo.t_inventario
            `;

            db.query(consulta, (error, result) => {
                if (error) {
                    console.error("Error al insertar datos de anual de producción:", error);
                    res.status(500).json({ error: "Error interno del servidor" });
                } else {
                    res.status(200).json(result.rows);
                }
            });
        } catch (error) {
            console.error("Error al crear el reporte de datos estaticos:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }       

    }

    public async ProduccionSerieDocumental(req: Request, res: Response) {
        try {
            const consulta = `
                SELECT 
                    i.id_inventario,
                    i.serie_doc,
                    i.codigo,
                    i.sede,
                    i.anio,
                    i.cantidad,
                    i.tipo_doc,
                    i.especialidad,

                    -- Información del responsable
                    u.id_usuario AS id_responsable,
                    CONCAT_WS(' ', p.nombre, p.ap_paterno, p.ap_materno) AS nombre_responsable,

                    COUNT(DISTINCT e.id_expediente) AS total_expedientes,

                    COUNT(*) FILTER (WHERE ee.estado_preparado = 'T')    AS expedientes_preparados,
                    COUNT(*) FILTER (WHERE ee.estado_digitalizado = 'T') AS expedientes_digitalizados,
                    COUNT(*) FILTER (WHERE ee.estado_indizado = 'T')     AS expedientes_indizados,
                    COUNT(*) FILTER (WHERE ee.estado_controlado = 'T')   AS expedientes_controlados,
                    COUNT(*) FILTER (WHERE ee.estado_fedatado = 'T')     AS expedientes_fedatados,

                    COUNT(DISTINCT d.id_disco) AS total_discos_cerrados

                FROM archivo.t_inventario i
                JOIN archivo.t_expediente e 
                    ON i.id_inventario = e.id_inventario
                JOIN archivo.t_estado_expediente ee
                    ON e.id_expediente = ee.id_expediente
                LEFT JOIN archivo.t_disco d 
                    ON i.id_inventario = d.id_inventario
                AND d.estado_cerrado = TRUE   -- solo discos cerrados
                LEFT JOIN archivo.t_usuario u
                    ON i.id_responsable = u.id_usuario
                LEFT JOIN archivo.t_persona p
                    ON u.id_persona = p.id_persona

                GROUP BY 
                    i.id_inventario, 
                    i.serie_doc,
                    i.codigo, 
                    i.sede,
                    i.anio, 
                    i.cantidad,
                    i.tipo_doc,
                    i.especialidad,
                    u.id_usuario,
                    p.nombre,
                    p.ap_paterno,
                    p.ap_materno

                ORDER BY i.anio, i.codigo;
            `;

            db.query(consulta, (error, result) => {
                if (error) {
                    console.error("Error al insertar datos de anual de producción:", error);
                    res.status(500).json({ error: "Error interno del servidor" });
                } else {
                    res.status(200).json(result.rows);
                }
            });
          
        } catch (error) {
            console.error("Error al obtener la producción de serie documental:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async ProduccionUsuario(req: Request, res: Response) {
        try {
            const consulta = `
                    SELECT 
                        u.id_usuario,
                        u.username,
                        u.perfil,
                        CONCAT_WS(' ', p.nombre, p.ap_paterno, p.ap_materno) AS nombre_usuario,

                        -- Expedientes preparados por el usuario
                        COUNT(DISTINCT pr.id_expediente) FILTER (WHERE ee.estado_preparado = 'T')    AS expedientes_preparados,

                        -- Expedientes digitalizados por el usuario
                        COUNT(DISTINCT di.id_expediente) FILTER (WHERE ee.estado_digitalizado = 'T') AS expedientes_digitalizados,

                        -- Expedientes indizados por el usuario
                        COUNT(DISTINCT ind.id_expediente) FILTER (WHERE ee.estado_indizado = 'T')    AS expedientes_indizados,

                        -- Expedientes controlados por el usuario
                        COUNT(DISTINCT co.id_expediente) FILTER (WHERE ee.estado_controlado = 'T')   AS expedientes_controlados,

                        -- Expedientes fedatados por el usuario
                        COUNT(DISTINCT fe.id_expediente) FILTER (WHERE ee.estado_fedatado = 'T')     AS expedientes_fedatados

                    FROM archivo.t_usuario u
                    JOIN archivo.t_persona p 
                        ON u.id_persona = p.id_persona

                    -- Unimos cada módulo con el responsable
                    LEFT JOIN archivo.t_preparacion pr 
                        ON pr.id_responsable = u.id_usuario
                    LEFT JOIN archivo.t_digitalizacion di
                        ON di.id_responsable = u.id_usuario
                    LEFT JOIN archivo.t_indizacion ind
                        ON ind.id_responsable = u.id_usuario
                    LEFT JOIN archivo.t_control co
                        ON co.id_responsable = u.id_usuario
                    LEFT JOIN archivo.t_fedatar fe
                        ON fe.id_responsable = u.id_usuario

                    -- Estados (para validar que realmente esté en 'T')
                    LEFT JOIN archivo.t_estado_expediente ee
                        ON ee.id_expediente IN (
                            pr.id_expediente, di.id_expediente, ind.id_expediente, co.id_expediente, fe.id_expediente
                        )

                    WHERE u.estado = true
                    GROUP BY u.id_usuario,u.username,u.perfil, p.nombre, p.ap_paterno, p.ap_materno
                    ORDER BY perfil;
            `;

            db.query(consulta, (error, result) => {
                if (error) {
                    console.error("Error obtener produccion por usuarios:", error);
                    res.status(500).json({ error: "Error interno del servidor" });
                } else {
                    res.status(200).json(result.rows);
                }
            });
          
        } catch (error) {
            console.error("Error al obtener la producción de usuarios:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }



    public async ProduccionUsuarioUlitmosDias(req: Request, res: Response) : Promise<any> {
        try {
            const { perfil, usuario } = req.body;
    
            // Definir las tablas por módulo
            const tablas: Record<string, string> = {
                PREPARADOR: "archivo.t_preparacion",
                DIGITALIZADOR: "archivo.t_digitalizacion",
                INDIZADOR: "archivo.t_indizacion",
                CONTROLADOR: "archivo.t_control",
                FEDATARIO: "archivo.t_fedatar"
            };
    
            if (!tablas[perfil]) {
                return res.status(400).json({ error: "Perfil inválido" });
            }
    
            const consulta = `
                WITH fechas AS (
                    SELECT generate_series(
                        CURRENT_DATE - interval '9 day', 
                        CURRENT_DATE, 
                        interval '1 day'
                    )::date AS fecha
                )
                SELECT 
                    f.fecha,
                    COALESCE(COUNT(m.id_expediente), 0) AS total_expedientes
                FROM fechas f
                LEFT JOIN ${tablas[perfil]} m
                    ON m.f_aud::date = f.fecha
                   AND m.c_aud_uidred = $1
                GROUP BY f.fecha
                ORDER BY f.fecha;
            `;
    
            db.query(consulta, [usuario], (error, result) => {
                if (error) {
                    console.error("Error obtener produccion por usuarios en los ultimos 10 dias:", error);
                    res.status(500).json({ error: "Error interno del servidor" });
                } else {
                    res.status(200).json(result.rows);
                }
            });
    
        } catch (error) {
            console.error("Error al obtener la producción de usuarios en los ultimos 10 dias:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    

   

}

const reporteController = new ReporteController();
export default reporteController;

