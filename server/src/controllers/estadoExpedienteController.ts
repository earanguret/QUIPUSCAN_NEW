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
            const { app_user } = req.body;

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
            const valores = [app_user, null, ipAddressClient, null, 'A', id_expediente];

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
            const { app_user } = req.body;

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
            const valores = [app_user, null, ipAddressClient, null, 'T', id_expediente];

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
            const { app_user } = req.body;

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
            const valores = [app_user, null, ipAddressClient, null, 'A', id_expediente];

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
            const { app_user } = req.body;

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
            const valores = [app_user, null, ipAddressClient, null, 'T', id_expediente];

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
            const { app_user } = req.body;

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
            const valores = [app_user, null, ipAddressClient, null, 'A', id_expediente];

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
            const { app_user } = req.body;

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
            const valores = [app_user, null, ipAddressClient, null, 'T', id_expediente];
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
            const { app_user } = req.body;

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
            const valores = [app_user, null, ipAddressClient, null, 'A', id_expediente];

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
            const { app_user } = req.body;

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
            const valores = [app_user, null, ipAddressClient, null, 'T', id_expediente];
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
            const { app_user } = req.body;

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
            const valores = [app_user, null, ipAddressClient, null, 'A', id_expediente];

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
            const { app_user } = req.body;

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
            const valores = [app_user, null, ipAddressClient, null, 'T', id_expediente];
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
        try {
            const { id_expediente } = req.params;
            const { app_user } = req.body;
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const expediente = await db.query('select * from archivo.t_expediente where id_expediente=$1',[id_expediente]);
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

                            estado_digitalizado=$5,
                            estado_indizado=$6,
                            estado_controlado=$7

	                    WHERE id_expediente=$8;
                
                `;
            const valores = [app_user, null, ipAddressClient, null, 'R', 'R', 'R', id_expediente];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Rechazo de control a digitalizacion:', error);
                } else {
                    console.log('Rechazo de control a digitalizacion exitosa');
                    res.locals.body = {
                        direccion_ip: ipAddressClient,
                        usuario: app_user,
                        modulo: "CONTROL",
                        detalle: `Expediente rechazado - digitalización`,
                        expediente: expediente["rows"][0]["nro_expediente"]
                    };
                    res.json({ text: 'Rechazo de control a digitalizacion exitosa' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.locals.body = { text: `"Error al modificar el expediente:" ${error}` };
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    public async RechazarControlIndizacion(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const { app_user } = req.body;

            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const expediente = await db.query('select * from archivo.t_expediente where id_expediente=$1',[id_expediente]);
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

    
                            estado_indizado=$5,
                            estado_controlado=$6

	                    WHERE id_expediente=$7;
                
                `;
            const valores = [app_user, null, ipAddressClient, null, 'R', 'R', id_expediente];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Rechazo de control a indizacion:', error);
                } else {
                    console.log('Rechazo de control a indizacion exitosa');
                    res.locals.body = {
                        direccion_ip: ipAddressClient,
                        usuario: app_user,
                        modulo: "CONTROL",
                        detalle: `Expediente rechazado - indización`,
                        expediente: expediente["rows"][0]["nro_expediente"]
                    };
                    res.json({ text: 'Rechazo de control a indizacion exitosa' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.locals.body = { text: `"Error al modificar el expediente:" ${error}` };
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async RechazarFedatarioDigitalizacion(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const { app_user } = req.body;

            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const expediente = await db.query('select * from archivo.t_expediente where id_expediente=$1',[id_expediente]);
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

                            estado_digitalizado=$5,
                            estado_indizado=$6,
                            estado_controlado=$7,
                            estado_fedatado=$8

	                    WHERE id_expediente=$9;
                `;
            const valores = [app_user, null, ipAddressClient, null, 'R', 'R', 'R', 'R', id_expediente];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Rechazo de Fedatario a digitalizacion:', error);
                } else {
                    console.log('Rechazo de Fedatario a digitalizacion exitosa');
                    res.locals.body = {
                        direccion_ip: ipAddressClient,
                        usuario: app_user,
                        modulo: "FEDATARIO",
                        detalle: `Expediente rechazado - digitalización`,
                        expediente: expediente["rows"][0]["nro_expediente"]
                    };
                    res.json({ text: 'Rechazo de Fedatario a digitalizacion exitosa' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.locals.body = { text: `"Error al modificar el expediente :" ${error}` };
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    public async RechazarFedatarioIndizacion(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const { app_user } = req.body;

            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const expediente = await db.query('select * from archivo.t_expediente where id_expediente=$1',[id_expediente]);
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

                            estado_indizado=$5,
                            estado_controlado=$6,
                            estado_fedatado=$7

	                    WHERE id_expediente=$8;
                `;
            const valores = [app_user, null, ipAddressClient, null, 'R', 'R', 'R', id_expediente];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Rechazo de Fedatario a indización:', error);
                } else {
                    console.log('Rechazo de Fedatario a digitalizacion exitosa');
                    res.locals.body = {
                        direccion_ip: ipAddressClient,
                        usuario: app_user,
                        modulo: "FEDATARIO",
                        detalle: `Expediente rechazado - indización`,
                        expediente: expediente["rows"][0]["nro_expediente"]
                    };
                    res.json({ text: 'Rechazo de Fedatario a indización exitosa' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.locals.body = { text: `"Error al modificar el expediente:" ${error}` };
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async obtenerMensajesById_expediente(req: Request, res: Response): Promise<any> {
        try {
            const { id_expediente } = req.params;
    
            const consulta = `
                SELECT mensajes
                FROM archivo.t_estado_expediente
                WHERE id_expediente = $1
            `;
    
            const resultado = await db.query(consulta, [id_expediente]);
    
            if (resultado.rows.length > 0) {
                res.json(resultado.rows[0].mensajes);
            } else {
                res.status(404).json({ error: "No se encontraron mensajes para este expediente." });
            }
        } catch (error) {
            console.error("Error al obtener mensaje:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    

    public async guardarMensajeById_expediente(req: Request, res: Response): Promise<any> {
        try {
            const { id_expediente } = req.params;
            const { mensaje, app_user } = req.body;
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            
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

                            mensajes=$5

                        WHERE id_expediente=$6;
                        `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                mensaje,
                id_expediente,

            ];
            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al insertar mensaje:", error);
                    if ((error as any).code === '23505') {
                        res.status(409).json({ text: 'Ya existe mensaje con ese nombre' });
                    } else {
                        res.status(500).json({ error: 'Error al insertar la persona' });
                    }
                } else {
                    console.log('Datos de mensaje en BD:',);
                    res.status(200).json({ message: 'Mensaje agregado correctamente' });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }


    public async AsociarExpedientesADisco(req: Request, res: Response) {
        try {
            const { lista_expedientes, id_disco, app_user } = req.body;
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            // Extraer solo los ID de expediente
            const idsExpedientes = lista_expedientes.map((e: any) => e.id_expediente);

            const consulta = `
            UPDATE archivo.t_estado_expediente
            SET 
              f_aud = CURRENT_TIMESTAMP,
              b_aud = 'U',
              c_aud_uid = '${key.user}',
              c_aud_uidred = $1,
              c_aud_pc = $2,
              c_aud_ip = $3,
              c_aud_mac = $4,

              id_disco = $5
            WHERE id_expediente = ANY($6);
          `;

            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                id_disco,
                idsExpedientes
            ];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Error al asociar expedientes:', error);
                    res.status(500).json({ error: 'Error al asociar expedientes' });
                } else {
                    console.log('Expedientes asociados correctamente');
                    res.json({ text: 'Expedientes asociados correctamente' });
                }
            });

        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }


    public async ObternerExpedientesRechazadosFedatario(req: Request, res: Response): Promise<any> {
        try {
            const { id_inventario } = req.params;
            const consulta = `
                            SELECT      
                                e.id_expediente,
                                e.nro_expediente,
                                e.cod_paquete,
                                es.mensajes,
                                es.estado_fedatado,
                                es.estado_controlado,
                                es.estado_indizado,
                                es.estado_digitalizado,
                            FROM
                                archivo.t_expediente e
                            JOIN
                                archivo.t_estado_expediente es ON e.id_expediente = es.id_expediente
                            JOIN
                                archivo.t_inventario i ON e.id_inventario = i.id_inventario
                            JOIN
                                archivo.t_persona p ON i.id_responsable = p.id_persona
                            JOIN
                                archivo.t_usuario u ON i.id_responsable = u.id_usuario
                            WHERE 
                                i.id_inventario = $1
                                AND (es.estado_fedatado = 'R' OR es.estado_fedatado IS NULL);
                                 `;
            const expedientes = await db.query(consulta, [id_inventario]);
            if (expedientes && expedientes["rows"].length > 0) {
                res.json(expedientes["rows"]);
            } else {
                res.status(404).json({ text: "no existe el total de imagenes" }); 
            }
        } catch (error) {
            console.error("Error al obtener total de imagenes:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }



}

const estadoExpedienteController = new EstadoExpedienteController();
export default estadoExpedienteController;