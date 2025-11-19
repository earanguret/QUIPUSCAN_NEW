import { Request, Response } from "express";
import db from '../database/database';
import { key } from '../database/key';

class ConfiguracionController {
    // GENERAL
    public async crearGeneral(req: Request, res: Response): Promise<any> {
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { institucion, direccion, ruc, departamento, app_user } = req.body;
            const consulta = `
                INSERT INTO maestro.t_general(
                    f_aud,        -- fecha de la transaccion
                    b_aud,        -- tipo de transaccion ('I')
                    c_aud_uid,    -- usuario de base de datos
                    c_aud_uidred, -- usuario del sistema
                    c_aud_pc,     -- nombre de la pc 
                    c_aud_ip,     -- ip de la pc
                    c_aud_mac,

                    create_at,
                    institucion,
                    direccion,
                    ruc,
                    departamento
                    )
                VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6, $7, $8);
    `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                institucion,
                direccion,
                ruc,
                departamento,
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error('Error al insertar configuracion:', error);
                    res.status(500).json({ error: 'Error interno del servidor' });
                } else {
                    res.status(200).json({ message: 'Configuracion creada correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async modificarGeneral(req: Request, res: Response): Promise<any> {
        try {
            const { id_general } = req.params;
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { institucion, direccion, ruc, departamento, app_user } = req.body;
            const consulta = `
                UPDATE maestro.t_general
                SET 
                    f_aud=CURRENT_TIMESTAMP, 
                    b_aud='U', 
                    c_aud_uid='${key.user}', 
                    c_aud_uidred=$1, 
                    c_aud_pc=$2, 
                    c_aud_ip=$3, 
                    c_aud_mac=$4,

                    institucion=$5,
                    direccion=$6,
                    ruc=$7,
                    departamento=$8
                    
                WHERE id_general=$9;
            `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                institucion,
                direccion,
                ruc,
                departamento,
                id_general,
            ];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Error al modificar configuracion:', error);
                } else {
                    console.log('configuracion modificada correctamente');
                    res.json({ message: 'configuracion modificada correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async obtenerDatosGeneral(req: Request, res: Response): Promise<any> {
        try {
            const consulta = `
            SELECT
                id_general,
                create_at,
                institucion,
                direccion,
                ruc,
                departamento
            FROM maestro.t_general
            LIMIT 1;
        `;

            const { rows } = await db.query(consulta);

            if (rows.length === 0) {
                return res.status(404).json({ text: 'La configuración general no existe' });
            }

            return res.json(rows[0]);

        } catch (error) {
            console.error('Error al obtener configuración:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }


    // EXPECIALIDAD
    public async listarEspecialidad(req: Request, res: Response): Promise<any> {
        try {
            const consulta = `
                select create_at, id_especialidad, especialidad from maestro.t_especialidad
            `;
            const configuracion = await db.query(consulta);
            res.status(200).json(configuracion['rows']);
        } catch (error) {
            console.error('Error al obtener configuracion:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async crearEspecialidad(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { especialidad, app_user } = req.body;
            const consulta = `
                INSERT INTO maestro.t_especialidad(
                    f_aud,        -- fecha de la transaccion
                    b_aud,        -- tipo de transaccion ('I')
                    c_aud_uid,    -- usuario de base de datos
                    c_aud_uidred, -- usuario del sistema
                    c_aud_pc,     -- nombre de la pc 
                    c_aud_ip,     -- ip de la pc
                    c_aud_mac,

                    create_at,
                    especialidad
                    )
                VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5)
            `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                especialidad
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error('Error al insertar configuracion:', error);
                    res.status(500).json({ error: 'Error interno del servidor' });
                } else {

                    res.status(200).json({ message: 'Especialidad creada correctamente' });
                }
            });
        } catch (error) {
            console.error('Error al crear configuracion:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async modificarEspecialidad(req: Request, res: Response) {
        try {
            const { id_especialidad } = req.params;
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { especialidad, app_user } = req.body;
            const consulta = `
                UPDATE maestro.t_especialidad
                SET 
                    f_aud=CURRENT_TIMESTAMP, 
                    b_aud='U', 
                    c_aud_uid='${key.user}', 
                    c_aud_uidred=$1, 
                    c_aud_pc=$2, 
                    c_aud_ip=$3, 
                    c_aud_mac=$4,

                    especialidad=$5
                    
                WHERE id_especialidad=$6;
            `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                especialidad,
                id_especialidad,
            ];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Error al modificar especialidad:', error);
                } else {
                    console.log('especialidad modificada correctamente');
                    res.json({ message: 'especialidad modificada correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async obtenerEspecialidadById(req: Request, res: Response): Promise<any> {
        try {
            const { id_especialidad } = req.params;
            const consulta = `
                SELECT
                   id_especialidad,
                   create_at,
                   especialidad
                FROM
                   maestro.t_especialidad
                WHERE 
                   id_especialidad=$1
                 `;
            const especialidad = await db.query(consulta, [id_especialidad]);
            if (especialidad && especialidad['rows'].length > 0) {
                res.json(especialidad['rows'][0]);
            } else {
                res.status(404).json({ text: 'La especialidad no existe' });
            }
        } catch (error) {
            console.error('Error al obtener especialidad:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async eliminarEspecialidad(req: Request, res: Response) {
        try {
            const { id_especialidad, app_user } = req.params;
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const consulta = `
                DO $$
                        DECLARE
                            p_uidred TEXT := '${app_user}';  -- UID del cliente
                            p_ip TEXT := '${ipAddressClient}';   -- IP del cliente
                        BEGIN
                            -- Establecer las variables de sesión
                            EXECUTE 'SET myapp.c_trns_uidred = ' || quote_literal(p_uidred);
                            EXECUTE 'SET myapp.c_trns_ip = ' || quote_literal(p_ip);
                
                            -- Eliminar el registro de sede
                            DELETE FROM maestro.t_especialidad
                            WHERE id_especialidad = ${id_especialidad};
                
                            -- Verificar si no se encontró ningún registro para eliminar
                            IF NOT FOUND THEN
                                RAISE EXCEPTION 'sede no encontrado';
                            END IF;
                
                            -- Limpiar las variables de sesión
                            EXECUTE 'RESET myapp.c_trns_uidred';
                            EXECUTE 'RESET myapp.c_trns_ip';
                
                        END $$;
            `;

            db.query(consulta, (error) => {
                if (error) {
                    console.error('Error al eliminar especialidad:', error);
                } else {
                    console.log('especialidad eliminada correctamente');
                    res.json({ message: 'especialidad eliminada correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // SEDE

    public async listarSedes(req: Request, res: Response): Promise<any> {
        try {
            const consulta = `
                SELECT
                    create_at,
                    id_sede,
                    sede
                FROM
                    maestro.t_sede
                ORDER BY sede ASC
            `;
            const sedes = await db.query(consulta);
            res.status(200).json(sedes['rows']);
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async crearSede(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { sede, app_user } = req.body;
            const consulta = `
                INSERT INTO maestro.t_sede(
                    f_aud,        -- fecha de la transaccion
                    b_aud,        -- tipo de transaccion ('I')
                    c_aud_uid,    -- usuario de base de datos
                    c_aud_uidred, -- usuario del sistema
                    c_aud_pc,     -- nombre de la pc 
                    c_aud_ip,     -- ip de la pc
                    c_aud_mac,

                    create_at,
                    sede
                    )
                VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5);
    `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                sede,
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error('Error al insertar sede:', error);
                    res.status(500).json({ error: 'Error interno del servidor' });
                } else {
                    res.status(200).json({ message: 'Sede creada correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async eliminarSede(req: Request, res: Response) {
        try {
            const { id_sede, app_user } = req.params;
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const consulta = `
                        DO $$
                        DECLARE
                            p_uidred TEXT := '${app_user}';  -- UID del cliente
                            p_ip TEXT := '${ipAddressClient}';   -- IP del cliente
                        BEGIN
                            -- Establecer las variables de sesión
                            EXECUTE 'SET myapp.c_trns_uidred = ' || quote_literal(p_uidred);
                            EXECUTE 'SET myapp.c_trns_ip = ' || quote_literal(p_ip);
                
                            -- Eliminar el registro de sede
                            DELETE FROM maestro.t_sede
                            WHERE id_sede = ${id_sede};
                
                            -- Verificar si no se encontró ningún registro para eliminar
                            IF NOT FOUND THEN
                                RAISE EXCEPTION 'sede no encontrado';
                            END IF;
                
                            -- Limpiar las variables de sesión
                            EXECUTE 'RESET myapp.c_trns_uidred';
                            EXECUTE 'RESET myapp.c_trns_ip';
                
                        END $$;
                    `;


            db.query(consulta, (error) => {
                if (error) {
                    console.error('Error al eliminar sede:', error);
                } else {
                    console.log('sede elimino correctamente');
                    res.json({ message: 'sede eliminada correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // TIPO DE DOCUMENTO

    public async listarTipoDocumento(req: Request, res: Response): Promise<any> {
        try {
            const consulta = `
                SELECT
                    create_at,
                    id_tipo_documento,
                    tipo_documento
                FROM
                    maestro.t_tipo_documento
                ORDER BY tipo_documento ASC
            `;
            const tipos = await db.query(consulta);
            res.status(200).json(tipos['rows']);
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async crearTipoDocumento(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { tipo_documento, app_user } = req.body;
            const consulta = `
                INSERT INTO maestro.t_tipo_documento(
                    f_aud,        -- fecha de la transaccion
                    b_aud,        -- tipo de transaccion ('I')
                    c_aud_uid,    -- usuario de base de datos
                    c_aud_uidred, -- usuario del sistema
                    c_aud_pc,     -- nombre de la pc 
                    c_aud_ip,     -- ip de la pc
                    c_aud_mac,

                    create_at,
                    tipo_documento
                    )
                VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5);
    `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                tipo_documento,
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error('Error al insertar tipo de documento:', error);
                    res.status(500).json({ error: 'Error interno del servidor' });
                } else {
                    res.status(200).json({ message: 'Tipo de documento creado correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async eliminarTipoDocumento(req: Request, res: Response) {
        try {
            const { id_tipo_documento, app_user } = req.params;
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const consulta = `
                        DO $$
                        DECLARE
                            p_uidred TEXT := '${app_user}';  -- UID del cliente
                            p_ip TEXT := '${ipAddressClient}';   -- IP del cliente
                        BEGIN
                            -- Establecer las variables de sesión
                            EXECUTE 'SET myapp.c_trns_uidred = ' || quote_literal(p_uidred);
                            EXECUTE 'SET myapp.c_trns_ip = ' || quote_literal(p_ip);
                
                            -- Eliminar el registro de sede
                            DELETE FROM maestro.t_tipo_documento
                            WHERE id_tipo_documento = ${id_tipo_documento};
                
                            -- Verificar si no se encontró ningún registro para eliminar
                            IF NOT FOUND THEN
                                RAISE EXCEPTION 'sede no encontrado';
                            END IF;
                
                            -- Limpiar las variables de sesión
                            EXECUTE 'RESET myapp.c_trns_uidred';
                            EXECUTE 'RESET myapp.c_trns_ip';
                
                        END $$;
            `;

            db.query(consulta, (error) => {
                if (error) {
                    console.error('Error al eliminar tipo de documento:', error);
                } else {
                    console.log('tipo de documento eliminado correctamente');
                    res.status(200).json({ message: 'Tipo de documento eliminado correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }



    // JUZGADO DE ORIGEN

    public async listarJuzgado(req: Request, res: Response): Promise<any> {
        try {
            const consulta = `
                SELECT
                    create_at,
                    id_juzgado,
                    juzgado
                FROM
                    maestro.t_juzgado
                ORDER BY juzgado ASC
            `;
            const juzgados = await db.query(consulta);
            res.status(200).json(juzgados['rows']);
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async crearJuzgado(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { juzgado, app_user } = req.body;
            const consulta = `
                INSERT INTO maestro.t_juzgado(
                    f_aud,        -- fecha de la transaccion
                    b_aud,        -- tipo de transaccion ('I')
                    c_aud_uid,    -- usuario de base de datos
                    c_aud_uidred, -- usuario del sistema
                    c_aud_pc,     -- nombre de la pc 
                    c_aud_ip,     -- ip de la pc
                    c_aud_mac,

                    create_at,
                    juzgado
                    )
                VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5);
    `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                juzgado,
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error('Error al insertar juzgado:', error);
                    res.status(500).json({ error: 'Error interno del servidor' });
                } else {
                    res.status(200).json({ message: 'Juzgado creado correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async eliminarJuzgado(req: Request, res: Response) {
        try {
            const { id_juzgado, app_user } = req.params;
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const consulta = `
                        DO $$
                        DECLARE
                            p_uidred TEXT := '${app_user}';  -- UID del cliente
                            p_ip TEXT := '${ipAddressClient}';   -- IP del cliente
                        BEGIN
                            -- Establecer las variables de sesión
                            EXECUTE 'SET myapp.c_trns_uidred = ' || quote_literal(p_uidred);
                            EXECUTE 'SET myapp.c_trns_ip = ' || quote_literal(p_ip);
                
                            -- Eliminar el registro de sede
                            DELETE FROM maestro.t_juzgado
                            WHERE id_juzgado = ${id_juzgado};
                
                            -- Verificar si no se encontró ningún registro para eliminar
                            IF NOT FOUND THEN
                                RAISE EXCEPTION 'sede no encontrado';
                            END IF;
                
                            -- Limpiar las variables de sesión
                            EXECUTE 'RESET myapp.c_trns_uidred';
                            EXECUTE 'RESET myapp.c_trns_ip';
                
                        END $$;
            `;

            db.query(consulta, (error) => {
                if (error) {
                    console.error('Error al eliminar juzgado:', error);
                } else {
                    console.log('juzgado eliminado correctamente');
                    res.status(200).json({ message: 'Juzgado eliminado correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // MATERIA
    public async listarMateria(req: Request, res: Response): Promise<any> {
        try {
            const consulta = `
                SELECT
                    create_at,
                    id_materia,
                    materia
                FROM
                    maestro.t_materia
                ORDER BY materia ASC
            `;
            const materias = await db.query(consulta);
            res.status(200).json(materias['rows']);
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async crearMateria(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { materia, app_user } = req.body;
            const consulta = `
                INSERT INTO maestro.t_materia(
                    f_aud,        -- fecha de la transaccion
                    b_aud,        -- tipo de transaccion ('I')
                    c_aud_uid,    -- usuario de base de datos
                    c_aud_uidred, -- usuario del sistema
                    c_aud_pc,     -- nombre de la pc 
                    c_aud_ip,     -- ip de la pc
                    c_aud_mac,

                    create_at,
                    materia
                    )
                VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5);
    `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                materia,
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error('Error al insertar materia:', error);
                    res.status(500).json({ error: 'Error interno del servidor' });
                } else {
                    res.status(200).json({ message: 'Materia creada correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async eliminarMateria(req: Request, res: Response) {
        try {
            const { id_materia, app_user } = req.params;
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const consulta = `
                        DO $$
                        DECLARE
                            p_uidred TEXT := '${app_user}';  -- UID del cliente
                            p_ip TEXT := '${ipAddressClient}';   -- IP del cliente
                        BEGIN
                            -- Establecer las variables de sesión
                            EXECUTE 'SET myapp.c_trns_uidred = ' || quote_literal(p_uidred);
                            EXECUTE 'SET myapp.c_trns_ip = ' || quote_literal(p_ip);
                
                            -- Eliminar el registro de sede
                            DELETE FROM maestro.t_materia
                            WHERE id_materia = ${id_materia};
                
                            -- Verificar si no se encontró ningún registro para eliminar
                            IF NOT FOUND THEN
                                RAISE EXCEPTION 'sede no encontrado';
                            END IF;
                
                            -- Limpiar las variables de sesión
                            EXECUTE 'RESET myapp.c_trns_uidred';
                            EXECUTE 'RESET myapp.c_trns_ip';
                
                        END $$;
            `;

            db.query(consulta, (error) => {
                if (error) {
                    console.error('Error al eliminar materia:', error);
                } else {
                    console.log('materia eliminada correctamente');
                    res.status(200).json({ message: 'Materia eliminada correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // TIPO DE PROCESO

    public async listarTipoProceso(req: Request, res: Response): Promise<any> {
        try {
            const consulta = `
                SELECT
                    create_at,
                    id_tipo_proceso,
                    tipo_proceso
                FROM
                    maestro.t_tipo_proceso
                ORDER BY tipo_proceso ASC
            `;
            const tipos = await db.query(consulta);
            res.status(200).json(tipos['rows']);
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async crearTipoProceso(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { tipo_proceso, app_user } = req.body;
            const consulta = `
                INSERT INTO maestro.t_tipo_proceso(
                    f_aud,        -- fecha de la transaccion
                    b_aud,        -- tipo de transaccion ('I')
                    c_aud_uid,    -- usuario de base de datos
                    c_aud_uidred, -- usuario del sistema
                    c_aud_pc,     -- nombre de la pc 
                    c_aud_ip,     -- ip de la pc
                    c_aud_mac,

                    create_at,
                    tipo_proceso
                    )
                VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5);
    `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                tipo_proceso,
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error('Error al insertar tipo de proceso:', error);
                    res.status(500).json({ error: 'Error interno del servidor' });
                } else {
                    res.status(200).json({ message: 'Tipo de proceso creado correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async eliminarTipoProceso(req: Request, res: Response) {
        try {
            const { id_tipo_proceso, app_user } = req.params;
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const consulta = `
               
                DO $$
                        DECLARE
                            p_uidred TEXT := '${app_user}';  -- UID del cliente
                            p_ip TEXT := '${ipAddressClient}';   -- IP del cliente
                        BEGIN
                            -- Establecer las variables de sesión
                            EXECUTE 'SET myapp.c_trns_uidred = ' || quote_literal(p_uidred);
                            EXECUTE 'SET myapp.c_trns_ip = ' || quote_literal(p_ip);
                
                            -- Eliminar el registro de sede
                            DELETE FROM maestro.t_tipo_proceso
                            WHERE id_tipo_proceso=${id_tipo_proceso};
                
                            -- Verificar si no se encontró ningún registro para eliminar
                            IF NOT FOUND THEN
                                RAISE EXCEPTION 'sede no encontrado';
                            END IF;
                
                            -- Limpiar las variables de sesión
                            EXECUTE 'RESET myapp.c_trns_uidred';
                            EXECUTE 'RESET myapp.c_trns_ip';
                
                        END $$;
            `;

            db.query(consulta, (error) => {
                if (error) {
                    console.error('Error al eliminar tipo de proceso:', error);
                } else {
                    console.log('tipo de proceso eliminado correctamente');
                    res.status(200).json({ message: 'Tipo de proceso eliminado correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }


}

const configuracionController = new ConfiguracionController();
export default configuracionController;

