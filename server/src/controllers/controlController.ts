import { Request, Response } from "express";
import db from '../database/database';
import { key } from '../database/key';

class ControlController {
    public async crearControlCalidad(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { id_expediente, id_responsable, observaciones, val_observaciones, val_datos, val_nitidez, val_pruebas_impresion, val_copia_fiel, app_user } = req.body;
            const consulta = `
                   INSERT INTO archivo.t_control(
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
                        observaciones, 
                        val_observaciones, 
                        val_datos, 
                        val_nitidez, 
                        val_pruebas_impresion, 
                        val_copia_fiel)
                        VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP,$5,$6,$7,$8,$9,$10,$11,$12);
                `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                id_responsable,
                id_expediente,
                observaciones,
                val_datos, 
                val_nitidez, 
                val_observaciones, 
                val_pruebas_impresion, 
                val_copia_fiel
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al insertar datos de control:", error);
                    if ((error as any).code === '23505') {
                        res.status(409).json({ text: 'Ya existe expediente con ese nombre en control' });
                    } else {
                        res.status(500).json({ error: 'Error al insertar la datos de control' });
                    }
                } else {
                    console.log('Datos de control creado correctamente:',);
                    res.status(200).json({ message: 'Datos de control creado correctamente' });
                }
            });
        } catch (error) {
            console.error('Error al crear datos de control:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
    public async ModificarControlCalidad(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const {  observaciones, val_observaciones, val_datos, val_nitidez, val_pruebas_impresion, val_copia_fiel, app_user } = req.body;
            const consulta = `
                    UPDATE archivo.t_control
                    SET 
                        f_aud=CURRENT_TIMESTAMP, 
                        b_aud='U', 
                        c_aud_uid='${key.user}', 
                        c_aud_uidred=$1, 
                        c_aud_pc=$2, 
                        c_aud_ip=$3, 
                        c_aud_mac=$4,
 
                        observaciones=$5,
                        val_observaciones=$6,
                        val_datos=$7,
                        val_nitidez=$8,
                        val_pruebas_impresion=$9,
                        val_copia_fiel=$10
                    WHERE id_expediente=$11;
                        
                `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
            
                observaciones,
                val_datos, 
                val_nitidez, 
                val_observaciones, 
                val_pruebas_impresion, 
                val_copia_fiel,
                id_expediente
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

    public async ObtenerControlDataViewXidExpediente(req: Request, res: Response): Promise<any> {
        try {
            const { id_expediente } = req.params;
            const consulta = `
                            SELECT
                                c.id_control,
                                c.id_responsable,
                                c.id_expediente,
                                c.observaciones,
                                c.val_observaciones,
                                c.val_datos,
                                c.val_nitidez,
                                c.val_pruebas_impresion,
                                c.val_copia_fiel,
                                u.username,
                                c.create_at,
                                CONCAT(p.nombre, ' ', p.ap_paterno, ' ', p.ap_materno) AS responsable
                            FROM
                                archivo.t_control c
                            JOIN
                                archivo.t_usuario u ON c.id_responsable = u.id_usuario
                            JOIN
                                archivo.t_persona p ON u.id_persona = p.id_persona
                            WHERE 
                                c.id_expediente=$1
                                 `;
            const persona = await db.query(consulta, [id_expediente]);
            if (persona && persona["rows"].length > 0) {
                res.json(persona["rows"][0]);
            } else {
                res.status(404).json({ text: "Los datos de la control no existen" });
            }
        } catch (error) {
            console.error("Error al obtener control detalle:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }

    }

    public async ObtenerDatosControl(req: Request, res: Response): Promise<any> {
        try {
            const { id_expediente } = req.params;
            const consulta = `
                            SELECT
                                id_control,
                                id_responsable,
                                id_expediente,
                                observaciones,
                                val_observaciones,
                                val_datos,
                                val_nitidez,
                                val_pruebas_impresion,
                                val_copia_fiel
                            FROM
                                archivo.t_control
                            WHERE 
                                id_expediente=$1
                                 `;
            const control = await db.query(consulta, [id_expediente]);
            if (control && control["rows"].length > 0) {
                res.json(control["rows"][0]);
            } else {
                res.status(404).json({ text: "Los datos de control no existen" });
            }
        } catch (error) {
            console.error("Error al obtener datos de control:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }

    }
    
}

const controlController = new ControlController();
export default controlController;

    