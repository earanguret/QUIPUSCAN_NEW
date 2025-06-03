import { Request, Response } from "express";
import db from '../database/database';
import { key } from '../database/key';

class ExpedienteController {
    public async listarExpedientes(req: Request, res: Response): Promise<any> {
        try {
            const expedientes = await db.query('select * from archivo.t_expediente ')
            res.json(expedientes['rows']);
        } catch (error) {
            console.error('Error al obtener expedientes:', error);
            res.status(500).json({ error: 'Error interno del servidor'});
        }
    }
    public async listarExpedientesDetalle(req: Request, res: Response): Promise<any> {
        try {
            const consulta = `
                            SELECT
                                e.id_expediente,
                                e.nro_expediente,
                                e.id_inventario,
                                i.id_responsable,
                                i.anio,
                                i.cantidad,
                                i.tipo_doc,
                                i.serie_doc,
                                i.especialidad,
                                i.codigo,
                                i.sede,
                                i.create_at,
                                u.username,
                                p.nombre,
                                p.ap_paterno,
                                p.ap_materno
                            FROM
                                archivo.t_expediente e
                            JOIN
                                archivo.t_inventario i ON e.id_inventario = i.id_inventario
                            JOIN
                                archivo.t_usuario u ON i.id_responsable = u.id_usuario
                            JOIN
                                archivo.t_persona p ON u.id_persona = p.id_persona
                            ORDER BY e.nro_expediente DESC 
                                `;
            const expedientes = await db.query(consulta);
            res.json(expedientes["rows"]);
        } catch (error) {
            console.error("Error al obtener expedientes:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

 

    public async ObtenerExpedientesById_inventario(req: Request, res: Response): Promise<any> {
        try {
            const { id_inventario } = req.params;
            const consulta = `
                            SELECT
                                e.id_expediente,
                                e.nro_expediente,
                                e.id_inventario,
                                e.id_responsable,
								 s.estado_preparado,
								 s.estado_recepcionado,
							    s.estado_preparado,
							    s.estado_digitalizado,
							    s.estado_indizado,
							    s.estado_controlado,
							    s.estado_fedatado,
							    s.estado_finalizado
                            FROM
                                archivo.t_expediente e
							JOIN 
								archivo.t_estado_expediente s on e.id_expediente = s.id_expediente
                            WHERE 
                                e.id_inventario=$1
                            ORDER BY e.id_expediente
                                 `;
            const expedientes = await db.query(consulta, [id_inventario]);
            res.status(200).json(expedientes["rows"]);
        } catch (error) {
            console.error("Error al obtener expedientes:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async ObtenerExpedienteDetalleXid(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const consulta = `
                            SELECT
                                e.id_expediente,
                                e.nro_expediente,
                                e.id_inventario,
                                i.id_responsable,
                                i.anio,
                                i.cantidad,
                                i.tipo_doc,
                                i.serie_doc,
                                i.especialidad,
                                i.codigo,
                                i.sede,
                                i.create_at,
                                u.username,
                                u.perfil,
                                u.estado,
                                p.nombre,
                                p.ap_paterno,
                                p.ap_materno
                            FROM
                                archivo.t_expediente e
                            JOIN
                                archivo.t_inventario i ON e.id_inventario = i.id_inventario
                            JOIN
                                archivo.t_usuario u ON i.id_responsable = u.id_usuario
                            JOIN
                                archivo.t_persona p ON u.id_persona = p.id_persona
                            WHERE 
                                e.id_expediente=$1
                                 `;
            const expediente = await db.query(consulta, [id]);
            if (expediente && expediente["rows"].length > 0) {
                res.json(expediente["rows"][0]);
            } else {
                res.status(404).json({ text: "El expediente no existe" });
            }
        } catch (error) {
            console.error("Error al obtener expediente:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async CrearExpediente(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const { nro_expediente, id_inventario, id_responsable, app_user } = req.body;
            const consulta = `
                    INSERT INTO archivo.t_expediente(
                            f_aud,        -- fecha de la transaccion
                            b_aud,        -- tipo de transaccion ('I')
                            c_aud_uid,    -- usuario de base de datos
                            c_aud_uidred, -- usuario del sistema
                            c_aud_pc,     -- nombre de la pc 
                            c_aud_ip,     -- ip de la pc
                            c_aud_mac,
                            
                            create_at,
                            nro_expediente, 
                            id_inventario, 
                            id_responsable
                           )    
                        VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6, $7)
                        RETURNING id_expediente, nro_expediente, id_inventario, id_responsable; -- Devolver el ID del expediente insertado
                `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                nro_expediente,
                id_inventario,
                id_responsable,
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al insertar expediente:", error);   
                    if ((error as any).code === '23505') {
                        res.status(409).json({ text: 'Ya existe un expediente registrado con ese nombre' });
                    } else {
                        res.status(500).json({ error: 'Error al registrar expediente' });
                    }                                     
                } else {
                    const id_expediente = resultado.rows[0]["id_expediente"]; // ID se encuentra en la primera fila
                    console.log("datos de expediente en BD:", id_expediente);
                    res.status(201).json({
                        message: "Expediente creado correctamente",
                        expediente: {
                          id_expediente,
                          nro_expediente,
                          id_inventario,
                          id_responsable
                        }
                      });
                }
            });
        } catch (error) {            
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async EliminarExpediente(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const { id } = req.params;
            const consulta = `
                            DELETE FROM archivo.t_expediente WHERE id_expediente=$1;
                        `;
            const valores = [id];
            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error("Error al eliminar expediente:", error);
                } else {
                    console.log("expediente eliminado correctamente");
                    res.status(200).json({ message: "expediente eliminado correctamente" });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async ModificarExpediente(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const { id } = req.params;
            const {  nro_expediente, app_user } = req.body;
            const consulta = `
                            UPDATE archivo.t_expediente
                            SET 
                                f_aud=CURRENT_TIMESTAMP, 
                                b_aud='U', 
                                c_aud_uid='${key.user}', 
                                c_aud_uidred=$1, 
                                c_aud_pc=$2, 
                                c_aud_ip=$3, 
                                c_aud_mac=$4,

                                nro_expediente=$5
                            WHERE id_expediente=$6;
                        `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                nro_expediente,
                id,
            ];

            db.query(consulta, valores, (error) => {                
                if (error) {
                    console.error("Error al modificar expediente:", error);
                } else {
                    console.log("expediente modificado correctamente");
                    res.status(200).json({ message: "expediente modificado correctamente" });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    
}
const expedienteController = new ExpedienteController();
export default expedienteController;