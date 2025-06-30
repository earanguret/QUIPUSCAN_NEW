import { Request, Response } from "express";
import db from '../database/database';
import { key } from '../database/key';


class DigitalizacionCotroller {

    constructor() {

    }
  

    public async listarDigitalizacion(req: Request, res: Response): Promise<any> {
        try {
            const personas = await db.query("select * from archivo.t_digitalizacion");
            res.json(personas['rows']);
        } catch (error) {
            console.error('Error al obtener personas:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async crearDigitalizacion(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { id_responsable, id_expediente, fojas_total, ocr, escala_gris, color, observaciones, dir_ftp, hash_doc, peso_doc, app_user } = req.body;
            const consulta = `
                    INSERT INTO archivo.t_digitalizacion(
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
                            ocr, 
                            escala_gris, 
                            color, 
                            observaciones, 
                            dir_ftp, 
                            hash_doc, 
                            peso_doc)    
                        VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6,$7, $8, $9, $10, $11, $12, $13, $14)
                        RETURNING id_digitalizacion; -- Devolver el ID del expediente insertado
                `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                id_responsable,
                id_expediente,
                fojas_total,
                ocr,
                escala_gris,
                color,
                observaciones,
                dir_ftp,
                hash_doc,
                peso_doc,
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al insertar expediente:", error);
                    if ((error as any).code === '23505') {
                        res.status(409).json({ text: 'Ya existe expediente con ese nombre en digitalizacion' });
                    } else {
                        res.status(500).json({ error: 'Error al insertar la persona' });
                    }
                } else {
                    console.log('Datos de digitalizacion creado correctamente:',);
                    res.status(200).json({ message: 'Datos de digitalizacion creado correctamente' });
                }
            });
        } catch (error) {
            console.error('Error al crear digitalizacion:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async modificarDigitalizacion(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { fojas_total, ocr, escala_gris, color, observaciones, hash_doc, peso_doc, app_user } = req.body;
            const consulta = `
                    UPDATE archivo.t_digitalizacion
                    SET 
                        f_aud=CURRENT_TIMESTAMP, 
                        b_aud='U', 
                        c_aud_uid='${key.user}', 
                        c_aud_uidred=$1, 
                        c_aud_pc=$2, 
                        c_aud_ip=$3, 
                        c_aud_mac=$4,
 
                        fojas_total=$5, 
                        ocr=$6, 
                        escala_gris=$7, 
                        color=$8, 
                        observaciones=$9,  
                        hash_doc=$10, 
                        peso_doc=$11
                    WHERE id_expediente=$12;
                `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                fojas_total,                
                ocr,
                escala_gris,
                color,
                observaciones,
                hash_doc,
                peso_doc,
                id_expediente,
            ];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error("Error al modificar digitalizacion:", error);
                } else {
                    console.log("digitalizacion modificada correctamente");                    
                    res.status(200).json({ message: "digitalizacion modificada correctamente" });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }       

    public async obtenerDigitalizacionByIdExpediente(req: Request, res: Response): Promise<any> {
        try {
            const { id_expediente } = req.params;
            const consulta = `
                            SELECT
                                id_digitalizacion,
                                id_responsable,
                                id_expediente,
                                fojas_total,
                                ocr,
                                escala_gris,
                                color,
                                observaciones,
                                dir_ftp,
                                hash_doc,
                                peso_doc
                            FROM
                                archivo.t_digitalizacion d
                            WHERE 
                                id_expediente=$1
                                 `;
            const persona = await db.query(consulta, [id_expediente]);
            if (persona && persona["rows"].length > 0) {
                res.json(persona["rows"][0]);
            } else {
                res.status(404).json({ text: "Los datos de la digitalización no existen" });
            }
        } catch (error) {
            console.error("Error al obtener digitalización:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }

    }

    public async obtenerDigitalizacionDetalle(req: Request, res: Response): Promise<any> {
        try {
            const { id_expediente } = req.params;
            const consulta = `
                            SELECT
                                d.id_digitalizacion,
                                d.id_responsable,
                                d.id_expediente,
                                d.fojas_total,
                                d.ocr,
                                d.escala_gris,
                                d.color,
                                d.observaciones,
                                d.dir_ftp,
                                d.hash_doc,
                                d.peso_doc,
                                u.username,
                                p.nombre,
                                p.ap_paterno,
                                p.ap_materno
                            FROM
                                archivo.t_digitalizacion d
                            JOIN
                                archivo.t_usuario u ON d.id_responsable = u.id_usuario
                            JOIN
                                archivo.t_persona p ON u.id_persona = p.id_persona
                            WHERE 
                                d.id_expediente=$1
                                 `;
            const persona = await db.query(consulta, [id_expediente]);
            if (persona && persona["rows"].length > 0) {
                res.json(persona["rows"][0]);
            } else {
                res.status(404).json({ text: "El persona no existe" });
            }
        } catch (error) {
            console.error("Error al obtener persona:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }

    }

    


}

const digitalizacionCotroller = new DigitalizacionCotroller();
export default digitalizacionCotroller;