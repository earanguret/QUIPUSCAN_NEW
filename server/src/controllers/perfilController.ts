import { Response, Request } from "express";
import db from '../database/database';
import { key } from '../database/key';

class PerfilController{

    public async listarPerfiles(req: Request, res: Response): Promise<any> {
        try {
            const perfiles = await db.query('select * from archivo.t_perfil')
            res.json(perfiles['rows']);
        } catch (error) {
            console.error('Error al obtener perfiles:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async obtenerPerfilesDetalleById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const consulta = `
                        SELECT 
                            p.id_perfil,
                            p.perfil,
                            p.mdl_recepcion,
                            p.mdl_preparacion,
                            p.mdl_digitalizacion,
                            p.mdl_indizacion,
                            p.mdl_control_calidad,
                            p.mdl_fedatar,
                            p.mdl_boveda,
                            p.mdl_reportes,
                            p.mdl_usuarios,                            
                            p.mdl_configuracion
                        FROM 
                            archivo.t_perfil p
                        WHERE
                            p.id_perfil = $1;
                `;
            const perfil = await db.query(consulta, [id]);
            if (perfil && perfil["rows"].length > 0) {
                res.status(200).json(perfil["rows"][0]);
            } else {
                res.status(404).json({ text: "El perfil no existe" });
            }
        } catch (error) {
            console.error("Error al obtener perfiles:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async CrearPerfil(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const { perfil, user_app} = req.body;
            const consulta = `                    
                    INSERT INTO archivo.t_perfil(
                            f_aud, 
                            b_aud, 
                            c_aud_uid, 
                            c_aud_uidred, 
                            c_aud_pc, 
                            c_aud_ip, 
                            c_aud_mac,

                            perfil
                           ) 
                    VALUES (CURRENT_TIMESTAMP, 'I', '${key.user}', $1, $2, $3, $4, $5);
                `;
            const valores = [
                user_app,
                null,
                ipAddressClient,
                null,
                perfil
            ];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Error al crear perfil:', error);
                    if ((error as any).code === '23505') {
                        res.status(409).json({ text: 'Ya existe una perfil con ese nombre' });
                    } else {
                        res.status(500).json({ error: 'Error al crear perfil' });
                    }
                } else {
                    res.status(200).json({ text: 'El perfil se creó correctamente' });
                }
            });

        } catch (error) {            
            console.error("Error al crear perfil:", error);            
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async ModificarPerfil(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const { 
                perfil,
                mdl_recepcion,
                mdl_preparacion,
                mdl_digitalizacion,
                mdl_indizacion,
                mdl_control_calidad,
                mdl_fedatar,
                mdl_boveda,
                mdl_reportes,
                mdl_usuarios,                            
                mdl_configuracion, 
                user_app } = req.body;
            const consulta = `
                        UPDATE archivo.t_perfil
                        SET 
                            f_aud=CURRENT_TIMESTAMP, 
                            b_aud='U', 
                            c_aud_uid='${key.user}', 
                            c_aud_uidred=$1, 
                            c_aud_pc=$2, 
                            c_aud_ip=$3, 
                            c_aud_mac=$4,

                            perfil=$5,
                            mdl_recepcion=$6,
                            mdl_preparacion=$7,
                            mdl_digitalizacion=$8,
                            mdl_indizacion=$9,
                            mdl_control_calidad=$10,
                            mdl_fedatar=$11,
                            mdl_boveda=$12,
                            mdl_reportes=$13,
                            mdl_usuarios=$14,
                            mdl_configuracion=$15
                        WHERE 
                            id_perfil=$16;
                `;
            const valores = [
                user_app,
                null,
                ipAddressClient,
                null,
                perfil,
                mdl_recepcion,
                mdl_preparacion,
                mdl_digitalizacion,
                mdl_indizacion,
                mdl_control_calidad,
                mdl_fedatar,
                mdl_boveda,
                mdl_reportes,
                mdl_usuarios,                            
                mdl_configuracion, 
                id,
            ];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Error al modificar perfil:', error);
                } else {
                    console.log('perfil modificado correctamente');
                    res.json({ text: 'El perfil se modifico correctamente' });
                }
            });
        } catch (error) {
            console.error('Error al modificar perfil:', error);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

const perfilController = new PerfilController();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
export default perfilController;    