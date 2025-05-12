import { Request, Response } from "express";
import db from '../database/database';
import { key } from '../database/key';
import { encriptar, comparar } from "../encrytor/encryptor";

class UsuarioController {
    public async listarUsuarios(req: Request, res: Response): Promise<any> {
        try {
            const usuarios = await db.query('select * from archivo.t_usuario')
            res.json(usuarios['rows']);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async listarUsuariosDetalle(req: Request, res: Response): Promise<any> {
        try {
            const consulta = `
                        SELECT 
                            u.id_usuario,
                            u.username,
                            u.estado,
                            u.intentos_login,
                            p.id_persona,
                            p.nombre,
                            p.ap_paterno,
                            p.ap_materno,
                            p.dni
                        FROM 
                            archivo.t_usuario u
                        JOIN 
                            archivo.t_persona p ON u.id_persona = p.id_persona;
                `;
            const usuarios = await db.query(consulta);
            res.json(usuarios["rows"]);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async obtenerUsuariosDetalleById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const consulta = `
                        SELECT 
                            u.id_usuario,
                            u.username,
                            u.estado,
                            u.intentos_login,
                            p.id_persona,
                            p.nombre,
                            p.ap_paterno,
                            p.ap_materno,
                            p.dni
                        FROM 
                            archivo.t_usuario u
                        JOIN 
                            archivo.t_persona p ON u.id_persona = p.id_persona
                        WHERE
                            u.id_usuario = $1;
                `;
            const usuario = await db.query(consulta, [id]);
            if (usuario && usuario["rows"].length > 0) {
                res.status(200).json(usuario["rows"][0]);
            } else {
                res.status(404).json({ text: "El usuario no existe" });
            }
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async CrearUsuario(req: Request, res: Response) {
        try {
            //el campo del password siempre tiene que estar lleno, la validacion se debe hacer desde el fronend
            const { usuario, id_perfil, password, id_persona, estado, user_app } = req.body;
            const passwordcifrado = await encriptar(password);
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            console.log(ipAddressClient);
            const consulta = `
                    INSERT INTO archivo.t_usuario(
                            f_aud, 
                            b_aud, 
                            c_aud_uid, 
                            c_aud_uidred, 
                            c_aud_pc, 
                            c_aud_ip, 
                            c_aud_mac

                            id_persona, 
                            usuario, 
                            password, 
                            id_perfil, 
                            estado)
                    VALUES (CURRENT_TIMESTAMP, 'I', '${key.user}',$1, $2, $3, $4, $5, $6 , $7, $8, $9);
                `;
            const valores = [
                user_app,
                null,
                ipAddressClient,
                null,
                id_persona,
                usuario,
                passwordcifrado,
                id_perfil,
                estado,
            ];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Error al crear usuario:', error);
                    if ((error as any).code === '23505') {
                        res.status(409).json({ text: 'Ya existe una usuario con ese nombre' });
                    } else {
                        res.status(500).json({ error: 'Error al crear usuario' });
                    }
                } else {
                    res.status(200).json({ text: 'El usuario se creó correctamente' });
                }
            });

        } catch (error) {
            console.error("Error al crear usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

const usuarioController = new UsuarioController();
export default usuarioController;