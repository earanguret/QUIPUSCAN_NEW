import { Request, Response, NextFunction} from "express";
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
                            u.perfil,
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

    public async obtenerUsuarioDetalleById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const consulta = `
                        SELECT 
                            u.id_usuario,
                            u.username,
                            u.estado,
                            u.perfil,
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
            const { username, perfil, password, id_persona, estado, app_user } = req.body;
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
                            c_aud_mac,

                            id_persona, 
                            username, 
                            password, 
                            perfil, 
                            estado)
                    VALUES (CURRENT_TIMESTAMP, 'I', '${key.user}',$1, $2, $3, $4, $5, $6 , $7, $8, $9);
                `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                id_persona,
                username,
                passwordcifrado,
                perfil,
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

    public async validarLogin_(req: Request, res: Response): Promise<void> {
        try {
            // Validación de los datos de entrada
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({ error: 'Debe proporcionar nombre de usuario y contraseña.' });
                return; // Asegúrate de retornar después de cada res.status()
            }

            // Verificar si el usuario existe
            const usuarioQuery = 'SELECT * FROM archivo.t_usuario WHERE username = $1';
            const usuarioResult = await db.query(usuarioQuery, [username]);

            if (usuarioResult.rows.length !== 1) {
                res.status(404).json({ error: 'Usuario no encontrado.' });
                return;
            }

            const usuario = usuarioResult.rows[0];

            // Verificar estado del usuario
            if (usuario.estado === false) {
                res.status(403).json({ error: 'El usuario no está activo.' });
                return;
            }

            // Comparar contraseñas
            const esPasswordCorrecto = await comparar(password, usuario.password);

            if (!esPasswordCorrecto) {
                res.status(401).json({ error: 'Contraseña incorrecta.' });
                return; // Agrega el return aquí para evitar continuar con el código
            }

            // Si todo está correcto, responder con datos del usuario
            res.json({
                success: true,
                id_usuario: usuario.id_usuario,
                id_persona: usuario.id_persona,
                username: usuario.username,
                perfil: usuario.perfil,
            });

        } catch (error) {
            console.error('Error fatal al validar el login:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }

    public async ValidarLogin(req: Request, res: Response, next: NextFunction) {
        try {
          const { username, password } = req.body; //optenemos el usuario del cuerpo de envio
          const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
          //BUSCAMOS EL USUARIO-------------
          const sqlusuario = await db.query(` SELECT * from archivo.t_usuario WHERE username=$1`, [username]);
          if (sqlusuario["rows"].length == 1) {
            // el usuario existe
    
            const booleanvalue = await comparar(password, sqlusuario["rows"][0]["password"]);
            if (booleanvalue) {
              //si esta activo
              if (sqlusuario["rows"][0]["estado"] === true) {
                //esta activo: acceso al sistema dejar en 0 el contardor logging
                db.query(` UPDATE archivo.t_usuario SET intentos_login=0  WHERE  id_usuario=$1`, [sqlusuario["rows"][0]["id_usuario"]]);
                res.json({
                    success: true,
                    id_usuario: sqlusuario["rows"][0]["id_usuario"],
                    id_persona: sqlusuario["rows"][0]["id_persona"],
                    username: sqlusuario["rows"][0]["username"],
                    perfil: sqlusuario["rows"][0]["perfil"],
                    mensaje: 'Credenciales correctos'
                });
                res.locals.body = {
                    usuario: username,
                    direccion_ip: ipAddressClient,
                    detalle: 'Acceso al sistema',
                  };
              }
              //no esta activo
              else {
    
                res.json({
                    success: false,
                    id_usuario: sqlusuario["rows"][0]["id_usuario"],
                    id_persona: sqlusuario["rows"][0]["id_persona"],
                    username: sqlusuario["rows"][0]["username"],
                    perfil: sqlusuario["rows"][0]["perfil"],
                    mensaje: 'USUARIO INACTIVO, comunicarse con el area de informática'
                });
                res.locals.body = {
                    usuario: username,
                    direccion_ip: ipAddressClient,
                    detalle: 'Acceso denegado, usuario inactivo',
                };

              }
            }
            else {
              // la contraseña no es correcta
    
              if ((sqlusuario["rows"][0]["intentos_login"] < 3)) {
                db.query(` UPDATE archivo.t_usuario SET intentos_login=intentos_login + 1  WHERE  id_usuario=$1`, [sqlusuario["rows"][0]["id_usuario"]]);
                res.json({
                    success: false,
                    id_usuario: sqlusuario["rows"][0]["id_usuario"],
                    id_persona: sqlusuario["rows"][0]["id_persona"],
                    username: sqlusuario["rows"][0]["username"],
                    perfil: sqlusuario["rows"][0]["perfil"],
                    mensaje: `Acceso denegado, contraseña incorrecta, le quedan ${2-sqlusuario["rows"][0]["intentos_login"]} intento(s)`  
                });
                res.locals.body = {
                    usuario: username,
                    direccion_ip: ipAddressClient,
                    detalle: `Acceso denegado, contraseña incorrecta, intento nro ${sqlusuario["rows"][0]["intentos_login"]+1}`,
                };
              }
              if ((sqlusuario["rows"][0]["intentos_login"] == 3)) {
                db.query(` UPDATE archivo.t_usuario SET estado=false  WHERE  id_usuario=$1`, [sqlusuario["rows"][0]["id_usuario"]]);
                res.json({
                    success: false,
                    id_usuario: sqlusuario["rows"][0]["id_usuario"],
                    id_persona: sqlusuario["rows"][0]["id_persona"],
                    username: sqlusuario["rows"][0]["username"],
                    perfil: sqlusuario["rows"][0]["perfil"],
                    mensaje: 'Acceso denegado, ha superado el numero de intentos, comunicarse con su jefe inmediato con el area de informática '
                }); 
                res.locals.body = {
                    usuario: username,
                    direccion_ip: ipAddressClient,
                    detalle: 'Acceso denegado, contraseña incorrecta, usuario bloqueado',
                };
              }
            }
          }
          else {
            //el usuario no existe
            console.log('el usuario no existe')
            res.json({
                success: false,
                id_usuario: null,
                id_persona: null,
                username: null,
                perfil: null,
                mensaje: 'El usuario no existe'
            });
            res.locals.body = {
                usuario: username,
                direccion_ip: ipAddressClient,
                detalle: 'Acceso denegado, usuario incorrecto',
            };  
          }
        } catch (error) {
          console.error("Error al loguear usuario:", error);
          res.status(500).json({ error: "Error interno del servidor" });
        } finally {
            next();
          }
    }

    public async ModificarDatosUsuario(req: Request, res: Response): Promise<void> {
        try {
            const { id_usuario } = req.params;
            const { username, perfil, estado, user_app } = req.body;
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const consulta = `
                UPDATE archivo.t_usuario
                        SET 
                            f_aud=CURRENT_TIMESTAMP, 
                            b_aud='U', 
                            c_aud_uid='${key.user}', 
                            c_aud_uidred=$1, 
                            c_aud_pc=$2, 
                            c_aud_ip=$3, 
                            c_aud_mac=$4,

                            username=$5, 
                            perfil=$6, 
                            estado=$7,
                            intentos_login=0
                    
                        WHERE id_usuario=$8;`;

            const valores = [
                user_app,
                null,
                ipAddressClient,
                null,
                username,
                perfil,
                estado,
                id_usuario,
            ];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Error al modificar usuario:', error);
                } else {
                    console.log('usuario modificado correctamente');
                    res.json({ text: 'El usurio se modifico correctamente' });
                }
            });
        } catch (error) {
            console.error('Error fatal al modificar usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }

    }

    public async ModificarPasswordUsuario(req: Request, res: Response): Promise<void> {
        try {
            const { id_usuario } = req.params;
            const { password, user_app } = req.body;
            const passwordcifrado = await encriptar(password);
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

            const consulta = `
                UPDATE archivo.t_usuario
                            SET 
                            f_aud=CURRENT_TIMESTAMP, 
                                b_aud='U', 
                                c_aud_uid='${key.user}', 
                                c_aud_uidred=$1, 
                                c_aud_pc=$2, 
                                c_aud_ip=$3, 
                                c_aud_mac=$4,

                                password=$5 
                        WHERE id_usuario=$6;
                     `;
            const valores = [
                user_app,
                null,
                ipAddressClient,
                null,
                passwordcifrado,
                id_usuario,
            ];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error("Error al modificar password usuario:", error);
                } else {
                    console.log("password modificado correctamente");
                    res.json({ text: "El password del usuario modifico correctamente" });
                }
            });
        } catch (error) {
            console.error("Error al modificar password de usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

const usuarioController = new UsuarioController();
export default usuarioController;