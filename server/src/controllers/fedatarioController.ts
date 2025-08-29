import { Request, Response } from "express";
import db from '../database/database';
import { key } from '../database/key';

class FedatarioController {
    public async listarFedatario(req: Request, res: Response): Promise<any> {
        try {
            const personas = await db.query("select * from archivo.t_fedatar");
            res.json(personas['rows']);
        } catch (error) {
            console.error('Error al obtener personas:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
    public async crearFedatario(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { id_responsable, id_expediente, observaciones, app_user } = req.body;
            const expediente = await db.query('select * from archivo.t_expediente where id_expediente=$1',[id_expediente]);
            const consulta = `
                    INSERT INTO archivo.t_fedatar(
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
                            observaciones)    
                        VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6, $7)
                        RETURNING id_fedatar; -- Devolver el ID del expediente insertado
                `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                
                id_responsable,
                id_expediente,
                observaciones,
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al insertar fedatario:", error);
                    if ((error as any).code === '23505') {
                        res.status(409).json({ text: 'Ya existe expediente con ese nombre en fedatario' });
                    } else {
                        res.status(500).json({ error: 'Error al insertar la persona' });
                    }
                } else {
                    console.log('Datos de fedatario en BD:', );
                    res.locals.body = {
                        direccion_ip: ipAddressClient,
                        usuario: app_user,
                        modulo: "FEDATARIO",
                        detalle: `Expediente fedatado`,
                        expediente: expediente["rows"][0]["nro_expediente"]
                    };
                    res.status(200).json({ message: 'Datos de fedatario creado correctamente' });
                }
            });
        } catch (error) {
            console.error('Error al crear fedatario:', error);
            res.locals.body = { text: `"Error al crear el expediente:" ${error}` };
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async ObtenerFedatarioDataViewXidExpediente(req: Request, res: Response): Promise<any> {
        try {
            const { id_expediente } = req.params;
            const consulta = `
                            SELECT
                                f.id_fedatar,
                                f.id_responsable,
                                f.id_expediente,
                                f.create_at,
                                CONCAT(p.nombre, ' ', p.ap_paterno, ' ', p.ap_materno) AS responsable,
                                u.username
                                
                            FROM
                                archivo.t_fedatar f
                            JOIN
                                archivo.t_usuario u ON f.id_responsable = u.id_usuario
                            JOIN
                                archivo.t_persona p ON u.id_persona = p.id_persona
                            WHERE 
                                f.id_expediente=$1
                                 `;
            const fedatario = await db.query(consulta, [id_expediente]);
            if (fedatario && fedatario["rows"].length > 0) {
                res.json(fedatario["rows"][0]);
            } else {
                res.status(404).json({ text: "El fedatario no existe" });
            }
        } catch (error) {
            console.error("Error al obtener fedatario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

}

const fedatarioController = new FedatarioController();
export default fedatarioController;