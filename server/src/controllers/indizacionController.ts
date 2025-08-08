import { Request, Response } from 'express';
import db from '../database/database';
import { key } from '../database/key';

class IndizacionController {



    public async ObtenerIndizacionDataViewXidExpediente(req: Request, res: Response): Promise<any> {
        try {
            const { id_expediente } = req.params;
            const consulta = `
                            SELECT
                                i.create_at,
                                i.id_indizacion,
                                i.id_expediente,
                                i.id_responsable,
                                i.indice,
                                i.observaciones,
                                i.juzgado_origen,
                                i.tipo_proceso,
                                i.materia,
                                i.demandante,
                                i.demandado,
                                i.fecha_inicial,
                                i.fecha_final,
                                i.create_at,
                                u.username,
                                CONCAT(p.nombre, ' ', p.ap_paterno, ' ', p.ap_materno) AS responsable
                            FROM
                                archivo.t_indizacion i
                            JOIN
                                archivo.t_usuario u ON i.id_responsable = u.id_usuario
                            JOIN
                                archivo.t_persona p ON u.id_persona = p.id_persona
                            JOIN
                                archivo.t_expediente e ON i.id_expediente = e.id_expediente
                            WHERE 
                                e.id_expediente=$1
                                    `;
            const indizacion = await db.query(consulta, [id_expediente]);

            if (indizacion && indizacion["rows"].length > 0) {
                res.json(indizacion["rows"][0]);
            } else {
                res.status(404).json({ text: "el indizacion detalle no existe" });
            }
        } catch (error) {
            console.error("Error al obtener indizacion detalle:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }

    }

    public async ObtenerIndizacionById_expediente(req: Request, res: Response): Promise<void> {
        try {
            const { id_expediente } = req.params;
            const consulta = `
                            SELECT
                                i.create_at,
                                i.id_indizacion,
                                i.id_expediente,
                                i.id_responsable,
                                i.indice,
                                i.observaciones,
                                i.juzgado_origen,
                                i.tipo_proceso,
                                i.materia,
                                i.demandante,
                                i.demandado,
                                i.fecha_inicial,
                                i.fecha_final
                            FROM
                                archivo.t_indizacion i
                            JOIN
                                archivo.t_expediente e ON i.id_expediente = e.id_expediente
                            WHERE 
                                e.id_expediente=$1
                                 `;
            const indizacion = await db.query(consulta, [id_expediente]);

            if (indizacion && indizacion["rows"].length > 0) {
                res.json(indizacion["rows"][0]);
            } else {
                res.status(404).json({ text: "indizacion no existe" });
            }
        } catch (error) {
            console.error("Error al obtener indizacion detalle:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async CrearIndizacion(req: Request, res: Response): Promise<void> {
        try {
            const {
                id_expediente,
                id_responsable,
                indice,
                observaciones,
                juzgado_origen,
                tipo_proceso,
                materia,
                demandante,
                demandado,
                fecha_inicial,
                fecha_final,
                app_user,
            } = req.body;

            const ipAddressClient =  req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const expediente = await db.query('select * from archivo.t_expediente where id_expediente=$1',[id_expediente]);
            const consulta = `
                        INSERT INTO archivo.t_indizacion(

                            f_aud,        -- fecha de la transaccion
                            b_aud,        -- tipo de transaccion ('I')
                            c_aud_uid,    -- usuario de base de datos
                            c_aud_uidred, -- usuario del sistema
                            c_aud_pc,     -- nombre de la pc 
                            c_aud_ip,     -- ip de la pc
                            c_aud_mac,

                            create_at,
                            id_expediente, 
                            id_responsable, 
                            indice, 
                            observaciones, 
                            juzgado_origen, 
                            tipo_proceso, 
                            materia, 
                            demandante, 
                            demandado, 
                            fecha_inicial, 
                            fecha_final)    
                        VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6,$7, $8, $9, $10, $11, $12, $13, $14, $15);
                `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,

                id_expediente,
                id_responsable,
                indice,
                observaciones,
                juzgado_origen,
                tipo_proceso,
                materia,
                demandante,
                demandado,
                fecha_inicial,
                fecha_final
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al insertar indizacion:", error);
                    res.status(500).json({ error: "Error interno del servidor" });
                } else {
                    res.locals.body = {
                        direccion_ip: ipAddressClient,
                        usuario: app_user,
                        modulo: "INDIZACION",
                        detalle: `Expediente indizado`,
                        expediente: expediente["rows"][0]["nro_expediente"]
                    };
                    res.status(200).json({  message: "el indizacion se creó correctamente" });
                }
            });
        } catch (error) {
            console.error("Error al crear indizacion:", error);
            res.locals.body = { text: `"Error al crear el indizacion:"${error}`};
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async ModificarIndizacion(req: Request, res: Response): Promise<void> {
        try {
            const { id_expediente } = req.params;
            const {
                indice,
                observaciones,
                juzgado_origen,
                tipo_proceso,
                materia,
                demandante,
                demandado,
                fecha_inicial,
                fecha_final,
                app_user,
            } = req.body;

            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const expediente = await db.query('select * from archivo.t_expediente where id_expediente=$1',[id_expediente]);
            const consulta = `
                        UPDATE archivo.t_indizacion
                            SET 
                                f_aud=CURRENT_TIMESTAMP, 
                                b_aud='U', 
                                c_aud_uid='${key.user}', 
                                c_aud_uidred=$1, 
                                c_aud_pc=$2, 
                                c_aud_ip=$3, 
                                c_aud_mac=$4,
        
                                indice=$5, 
                                observaciones=$6, 
                                juzgado_origen=$7, 
                                tipo_proceso=$8, 
                                materia=$9, 
                                demandante=$10, 
                                demandado=$11, 
                                fecha_inicial=$12, 
                                fecha_final=$13
                            WHERE id_expediente=$14;
                `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,

                indice,
                observaciones,
                juzgado_origen,
                tipo_proceso,
                materia,
                demandante,
                demandado,
                fecha_inicial,
                fecha_final,
                id_expediente,
            ];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error("Error al modificar indizacion:", error);
                } else {
                    console.log("indizacion modificado correctamente");
                    res.locals.body = {
                        direccion_ip: ipAddressClient,
                        usuario: app_user,
                        modulo: "INDIZACION",
                        detalle: `Expediente modificado`,
                        expediente: expediente["rows"][0]["nro_expediente"]
                    };
                    res.json({ message: "el indizacion se modifico correctamente" });
                }
            });
        } catch (error) {
            console.error("Error al modificar indizacion:", error);
            res.locals.body = { text: `"Error al crear el indizacion:"${error}` };
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }


}


const indizacionController = new IndizacionController();
export default indizacionController;
