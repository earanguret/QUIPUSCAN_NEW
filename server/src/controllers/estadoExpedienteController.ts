import { Request, Response } from "express";
import db from '../database/database';
import { key } from '../database/key';

class EstadoExpedienteController {

    public async CrearEstadoExpediente(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const { id_expediente, app_user } = req.body;
            const consulta = `
                INSERT INTO archivo.t_estado_expediente(
                    f_aud,        -- fecha de la transaccion
                    b_aud,        -- tipo de transaccion ('I')
                    c_aud_uid,    -- usuario de base de datos
                    c_aud_uidred, -- usuario del sistema
                    c_aud_pc,     -- nombre de la pc 
                    c_aud_ip,     -- ip de la pc
                    c_aud_mac,

                    create_at,
                    id_expediente, 
                    estado_recepcionado
                    )
                VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6);
    `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                id_expediente,
                'T',
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al insertar estado expediente:", error);
                    res.status(500).json({ error: "Error interno del servidor" });
                } else {
                    console.log("Estado expediente creado correctamente");
                    res.status(200).json({ message: "Estado expediente creado correctamente" });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async EliminarEstadoExpediente(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const consulta = `
                            DELETE FROM archivo.t_estado_expediente WHERE id_expediente=$1;
                        `;
            const valores = [id_expediente];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Error al eliminar estado expediente:', error);
                } else {
                    console.log('estado expediente eliminado correctamente');
                    res.status(200).json({ message: 'estado expediente eliminado correctamente' });
                }
            });
        }
        catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });

        }
    }

    public async PreparacionAceptada(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const { user_app } = req.body;

            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log(ipAddressClient);
            const consulta = `
                     UPDATE archivo.t_estado_expediente
	                    SET 
                            f_aud=CURRENT_TIMESTAMP, 
                            b_aud='U', 
                            c_aud_uid='${key.user}', 
                            c_aud_uidred=$1, 
                            c_aud_pc=$2, 
                            c_aud_ip=$3, 
                            c_aud_mac=$4,

                            estado_preparado=$5
	                    WHERE id_expediente=$6;
                
                `;
            const valores = [user_app, null, ipAddressClient, null, 'A', id_expediente];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Preparacion aprobada:', error);
                } else {
                    console.log('Preparacion aprobada correctamente');
                    res.json({ text: 'Preparacion aprobada correctamente' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    public async PreparacionTrabajado(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const { user_app } = req.body;

            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log(ipAddressClient);
            const consulta = `
                     UPDATE archivo.t_estado_expediente
	                    SET 
                            f_aud=CURRENT_TIMESTAMP, 
                            b_aud='U', 
                            c_aud_uid='${key.user}', 
                            c_aud_uidred=$1, 
                            c_aud_pc=$2, 
                            c_aud_ip=$3, 
                            c_aud_mac=$4,

                            estado_preparado=$5
	                    WHERE id_expediente=$6;
                
                `;
            const valores = [user_app, null, ipAddressClient, null, 'T', id_expediente];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Preparacion aprobada:', error);
                } else {
                    console.log('Preparacion aprobada correctamente');
                    res.json({ text: 'Preparacion aprobada correctamente' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async DigitalizacionAceptada(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const { user_app } = req.body;

            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log(ipAddressClient);
            const consulta = `
                     UPDATE archivo.t_estado_expediente
	                    SET 
                            f_aud=CURRENT_TIMESTAMP, 
                            b_aud='U', 
                            c_aud_uid='${key.user}', 
                            c_aud_uidred=$1, 
                            c_aud_pc=$2, 
                            c_aud_ip=$3, 
                            c_aud_mac=$4,

                            estado_digitalizado=$5
	                    WHERE id_expediente=$6;
                
                `;
            const valores = [user_app, null, ipAddressClient, null, 'A', id_expediente];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Estado digitalizacion aprobada:', error);
                } else {
                    console.log('Estado digitalizacion aprobada correctamente');
                    res.json({ text: 'Estado digitalizacion aprobada correctamente' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    public async DigitalizacionTrabajado(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const { user_app } = req.body;

            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log(ipAddressClient);
            const consulta = `
                     UPDATE archivo.t_estado_expediente
	                    SET 
                            f_aud=CURRENT_TIMESTAMP, 
                            b_aud='U', 
                            c_aud_uid='${key.user}', 
                            c_aud_uidred=$1, 
                            c_aud_pc=$2, 
                            c_aud_ip=$3, 
                            c_aud_mac=$4,

                            estado_digitalizado=$5
	                    WHERE id_expediente=$6;
                
                `;
            const valores = [user_app, null, ipAddressClient, null, 'T', id_expediente];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Preparacion aprobada:', error);
                } else {
                    console.log('Preparacion aprobada correctamente');
                    res.json({ text: 'Preparacion aprobada correctamente' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async IndizacionAceptada(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const { user_app } = req.body;

            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log(ipAddressClient);
            const consulta = `
                     UPDATE archivo.t_estado_expediente
	                    SET 
                            f_aud=CURRENT_TIMESTAMP, 
                            b_aud='U', 
                            c_aud_uid='${key.user}', 
                            c_aud_uidred=$1, 
                            c_aud_pc=$2, 
                            c_aud_ip=$3, 
                            c_aud_mac=$4,

                            estado_indizado=$5
	                    WHERE id_expediente=$6;
                
                `;
            const valores = [user_app, null, ipAddressClient, null, 'A', id_expediente];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Indizacion aprobada:', error);
                } else {
                    console.log('Indizacion aprobada correctamente');
                    res.json({ text: 'Indizacion aprobada correctamente' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    public async IndizacionTrabajado(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const { user_app } = req.body;

            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log(ipAddressClient);
            const consulta = `
                     UPDATE archivo.t_estado_expediente
	                    SET 
                            f_aud=CURRENT_TIMESTAMP, 
                            b_aud='U', 
                            c_aud_uid='${key.user}', 
                            c_aud_uidred=$1, 
                            c_aud_pc=$2, 
                            c_aud_ip=$3, 
                            c_aud_mac=$4,                            
                            estado_indizado=$5
	                    WHERE id_expediente=$6;
                
                `;
            const valores = [user_app, null, ipAddressClient, null, 'T', id_expediente];
            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Indizacion aprobada:', error);
                } else {
                    console.log('Indizacion aprobada correctamente');
                    res.json({ text: 'Indizacion aprobada correctamente' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async ControlAceptada(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const { user_app } = req.body;

            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log(ipAddressClient);
            const consulta = `
                     UPDATE archivo.t_estado_expediente
	                    SET 
                            f_aud=CURRENT_TIMESTAMP, 
                            b_aud='U', 
                            c_aud_uid='${key.user}', 
                            c_aud_uidred=$1, 
                            c_aud_pc=$2, 
                            c_aud_ip=$3, 
                            c_aud_mac=$4,

                            estado_controlado=$5
	                    WHERE id_expediente=$6;
                
                `;
            const valores = [user_app, null, ipAddressClient, null, 'A', id_expediente];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Control aprobado:', error);
                } else {
                    console.log('Expedinte de control de calidad aprobado correctamente');
                    res.json({ text: 'Control de calidad  aceptado correctamente' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    public async ControlTrabajado(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const { user_app } = req.body;

            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log(ipAddressClient);
            const consulta = `
                     UPDATE archivo.t_estado_expediente
	                    SET 
                            f_aud=CURRENT_TIMESTAMP, 
                            b_aud='U', 
                            c_aud_uid='${key.user}', 
                            c_aud_uidred=$1, 
                            c_aud_pc=$2, 
                            c_aud_ip=$3, 
                            c_aud_mac=$4,                            
                            estado_controlado=$5
	                    WHERE id_expediente=$6;
                
                `;
            const valores = [user_app, null, ipAddressClient, null, 'T', id_expediente];
            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Control de calidad trabajado:', error);
                } else {
                    console.log('control de calidad trabajado correctamente');
                    res.json({ text: 'control de calidad trabajado correctamente' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async FedadoAceptado(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const { user_app } = req.body;

            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log(ipAddressClient);
            const consulta = `
                     UPDATE archivo.t_estado_expediente
	                    SET 
                            f_aud=CURRENT_TIMESTAMP, 
                            b_aud='U', 
                            c_aud_uid='${key.user}', 
                            c_aud_uidred=$1, 
                            c_aud_pc=$2, 
                            c_aud_ip=$3, 
                            c_aud_mac=$4,

                            estado_fedatado=$5
	                    WHERE id_expediente=$6;
                
                `;
            const valores = [user_app, null, ipAddressClient, null, 'A', id_expediente];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Fedatado aceptado:', error);
                } else {
                    console.log('Fedatado aceptado correctamente');
                    res.json({ text: 'Fedatado aceptado correctamente' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    public async FedadoTrabajado(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const { user_app } = req.body;
            
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log(ipAddressClient);
            const consulta = `
                     UPDATE archivo.t_estado_expediente
	                    SET 
                            f_aud=CURRENT_TIMESTAMP, 
                            b_aud='U', 
                            c_aud_uid='${key.user}', 
                            c_aud_uidred=$1, 
                            c_aud_pc=$2, 
                            c_aud_ip=$3, 
                            c_aud_mac=$4,                            
                            estado_fedatado=$5
	                    WHERE id_expediente=$6;
                
                `;        
            const valores = [user_app, null, ipAddressClient, null, 'T', id_expediente];            
            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Fedatado aprobado:', error);
                } else {
                    console.log('Fedatado aprobado correctamente');
                    res.json({ text: 'Fedatado aprobado correctamente' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }


    public async RechazarControlDigitalizacion(req: Request, res: Response) {

    }

    public async RechazarControlIndizacion(req: Request, res: Response) {

    }

    public async RechazarFedatarioDigitalizacion(req: Request, res: Response) {

    }

    public async RechazarFedatarioIndizacion(req: Request, res: Response) {

    }



}

const estadoExpedienteController = new EstadoExpedienteController();
export default estadoExpedienteController;