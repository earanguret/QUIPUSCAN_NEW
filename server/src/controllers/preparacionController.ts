import { Request, Response } from "express";
import db from '../database/database';
import { key } from '../database/key';

class PreparacionController {
    public async listarPreparacion(req: Request, res: Response): Promise<any> {
        try {
            const personas = await db.query("select * from archivo.t_preparacion");
            res.json(personas['rows']);
        } catch (error) {
            console.error('Error al obtener personas:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async listarPreparacionDetalle(req: Request, res: Response): Promise<any> {
        try {
            const consulta = `
                            SELECT
                                p.id_preparacion,
                                p.id_responsable,
                                p.fojas_total,
                                p.fojas_unacara,
                                p.fojas_doscaras,
                                p.observaciones,
                                p.copias_originales,
                                p.copias_simples,
                                u.username,
                                p.create_at,
                                u.perfil,
                                u.estado,
                                p.id_inventario
                            FROM
                                archivo.t_preparacion p
                            JOIN
                                archivo.t_usuario u ON p.id_responsable = u.id_usuario
                            JOIN
                                archivo.t_inventario i ON p.id_inventario = i.id_inventario
                            ORDER BY p.id_preparacion DESC 
                                `;
            const personas = await db.query(consulta);
            res.json(personas["rows"]);
        } catch (error) {
            console.error("Error al obtener personas:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async ObtenerPreparacionXidExpediente(req: Request, res: Response): Promise<void> {
        try {
            const { id_expediente } = req.params;
            const consulta = `
                            SELECT
                                p.id_preparacion,
                                p.id_responsable,
                                p.fojas_total,
                                p.fojas_unacara,
                                p.fojas_doscaras,
                                p.observaciones,
                                p.copias_originales,
                                p.copias_simples,
                                p.create_at,
                                p.id_expediente,
                                u.username
                            FROM
                                archivo.t_preparacion p
                            JOIN
                                archivo.t_usuario u ON p.id_responsable = u.id_usuario
                            WHERE 
                                id_expediente=$1
                                 `;
            const persona = await db.query(consulta, [id_expediente]);
            if (persona && persona["rows"].length > 0) {
                res.json(persona["rows"][0]);
            } else {
                res.status(404).json({ text: "La persona no existe" });
            }
        } catch (error) {
            console.error("Error al obtener persona:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async CrearPreparacion(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { id_responsable, id_expediente, fojas_total, fojas_unacara, fojas_doscaras, observaciones, copias_originales, copias_simples, app_user } = req.body;
            const consulta = `
                    INSERT INTO archivo.t_preparacion(
                            f_aud,        -- fecha de la transaccion
                            b_aud,        -- tipo de transaccion ('I')
                            c_aud_uid,    -- usuario de base de datos
                            c_aud_uidred, -- usuario del sistema
                            c_aud_pc,     -- nombre de la pc 
                            c_aud_ip,     -- ip de la pc
                            c_aud_mac,

                            create_at,
                            id_responsable, 
                            id_expediente,
                            fojas_total, 
                            fojas_unacara, 
                            fojas_doscaras, 
                            observaciones, 
                            copias_originales, 
                            copias_simples)    
                        VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6,$7, $8, $9, $10, $11, $12)

                `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                id_responsable,
                id_expediente,
                fojas_total,
                fojas_unacara,
                fojas_doscaras,
                observaciones,
                copias_originales,
                copias_simples,
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al insertar preparación:", error);
                    if ((error as any).code === '23505') {
                        res.status(409).json({ text: 'Ya existe expediente con ese nombre en preparacion' });
                    } else {
                        res.status(500).json({ error: 'Error al insertar la persona' });
                    }
                } else {
                    
                    console.log('datos de usuario en BD:', );
                    res.status(200).json({ message: 'Datos de preparacion creado correctamente' });
                }
            });
        } catch (error) {
            console.error('Error al crear preparación:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async ModificarPreparacion(req: Request, res: Response) {
        try {
            const {id_expediente} = req.params;
            const { fojas_total, fojas_unacara, fojas_doscaras, observaciones, copias_originales, copias_simples, app_user } = req.body;
            const ipAddressClient =  req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const consulta = `
                        UPDATE archivo.t_preparacion
                            SET 
                                f_aud=CURRENT_TIMESTAMP, 
                                b_aud='U', 
                                c_aud_uid='${key.user}', 
                                c_aud_uidred=$1, 
                                c_aud_pc=$2, 
                                c_aud_ip=$3, 
                                c_aud_mac=$4,

                                fojas_total=$5, 
                                fojas_unacara=$6, 
                                fojas_doscaras=$7, 
                                observaciones=$8, 
                                copias_originales=$9, 
                                copias_simples=$10
                            WHERE id_expediente=$11;
                `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                fojas_total,
                fojas_unacara,
                fojas_doscaras,
                observaciones,
                copias_originales,
                copias_simples,                
                id_expediente,
            ];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error("Error al modificar preparación:", error);
                } else {                    
                    console.log("preparación modificada correctamente");
                    res.json({ message: "preparación modificada correctamente" });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

}

const preparacionController = new PreparacionController();
export default preparacionController;