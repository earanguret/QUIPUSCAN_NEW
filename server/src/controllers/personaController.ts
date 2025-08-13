import { Request, Response } from "express";
import db from '../database/database';
import { key } from '../database/key';

class PersonaController{

    public async listarPersonas(req: Request, res: Response): Promise<any> {
        try {
            const personas = await db.query('select * from archivo.t_persona')
            res.json(personas['rows']);
        } catch (error) {
            console.error('Error al obtener personas:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async ObtenerPersonaById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const consulta = 'select * from archivo.t_persona where id_persona = $1';
            const persona = await db.query(consulta, [id]);
            if (persona && persona['rows'].length > 0) {
                res.json(persona['rows'][0]);
            } else {
                res.status(404).json({ text: 'La persona no existe' });
            }
        } catch (error) {
            console.error('Error al obtener persona:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async ObtenerPersonaByDNI(req: Request, res: Response): Promise<any> {
        try {
            const { dni } = req.params;
            const consulta = 'select * from archivo.t_persona where dni = $1';
            const persona = await db.query(consulta, [dni]);
            if (persona && persona['rows'].length > 0) {
                res.status(200).json(persona['rows'][0]);
            } else {
                res.status(404).json({ text: 'La persona no existe' });
            }
        } catch (error) {
            console.error('Error al obtener persona:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    CrearPersona(req:Request,res:Response){
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { nombre, ap_paterno, ap_materno, dni, app_user} = req.body;
            const consulta = `
                    INSERT INTO archivo.t_persona(
                            f_aud,        -- fecha de la transaccion
                            b_aud,        -- tipo de transaccion ('I')
                            c_aud_uid,    -- usuario de base de datos
                            c_aud_uidred, -- 1 usuario del sistema
                            c_aud_pc,     -- 2 nombre de la pc 
                            c_aud_ip,     -- 3 ip de la pc
                            c_aud_mac,    -- 4 mac de la pc
                    
                            create_at,
                            nombre, 
                            ap_paterno, 
                            ap_materno, 
                            dni) 

                            VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP ,$5, $6, $7, $8)
                            RETURNING id_persona;
            `;
            const valores = [app_user, null, ipAddressClient, null, nombre, ap_paterno, ap_materno, dni];
            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                   
                    console.error('Error al insertar persona:', error);
                    if ((error as any).code === '23505') {
                        res.status(409).json({ text: 'Ya existe una persona con ese nombre' });
                    } else {
                        res.status(500).json({ error: 'Error al insertar la persona' });
                    }
                } else {
                    const idPersona = resultado.rows[0]['id_persona']; // ID se encuentra en la primera fila
                    console.log('datos de usuario en BD:', idPersona);
                    res.status(200).json({ id_persona: idPersona, text: 'La persona se creó correctamente' });
                }
            });
        } catch (error) {
            console.error('Error al crear persona:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async ModificarPersona(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { nombre, ap_paterno, ap_materno, dni, app_user} = req.body;
            
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log(ipAddressClient);
            const consulta = `
                     UPDATE archivo.t_persona
	                     SET 
                            f_aud=CURRENT_TIMESTAMP, 
                            b_aud='U', 
                            c_aud_uid='${key.user}', 
                            c_aud_uidred=$1, 
                            c_aud_pc=$2, 
                            c_aud_ip=$3, 
                            c_aud_mac=$4,

                            nombre=$5, 
                            ap_paterno=$6, 
                            ap_materno=$7, 
                            dni=$8
	                 WHERE id_persona=$9;
                
                `;
            const valores = [app_user, null, ipAddressClient, null, nombre, ap_paterno, ap_materno, dni, id];
            console.log('datos persona:',valores)

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Error al modificar persona:', error);
                } else {
                    console.log('persona modificada correctamente');
                    res.json({ text: 'La persona se modifico correctamente' });
                }
            });
        } catch (error) {
            console.error('Error al modificar persona:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

}

const personaController=new PersonaController();
export default personaController;