import { Response, Request } from "express";
import db from '../database/database';
import { key } from '../database/key';

class DiscoController {

    public async listarDiscosByInventario(req: Request, res: Response): Promise<any> {
        const { id_inventario } = req.params;
        try {
            const consulta = `
                SELECT
                    d.id_disco,
                    d.id_inventario,
                    d.id_responsable_crear,
                    d.nombre,
                    d.volumen,
                    d.capacidad_gb,
                    d.espacio_ocupado,
                    d.dir_ftp_acta_apertura,
                    d.dir_ftp_acta_cierre,
                    d.dir_ftp_tarjeta_apertura,
                    d.dir_ftp_tarjeta_cierre,
                    d.peso_acta_apertura,
                    d.peso_acta_cierre,
                    d.peso_tarjeta_apertura,
                    d.peso_tarjeta_cierre,
                    d.fecha_acta_apertura,
                    d.fecha_acta_cierre,
                    d.fecha_tarjeta_apertura,
                    d.fecha_tarjeta_cierre,
                    d.id_responsable_tca,
                    d.id_responsable_tcc,
                    d.id_responsable_aa,
                    d.id_responsable_ac,
                    d.estado_cerrado,
                    d.id_responsable_cierre
                FROM
                    archivo.t_disco d
                WHERE 
                    d.id_inventario=$1
                ORDER BY d.volumen ASC
                `;
            const disco = await db.query(consulta, [id_inventario]);
            res.status(200).json(disco['rows']);
        } catch (error) {
            console.error('Error al obtener disco:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async crearDisco(req: Request, res: Response): Promise<any> {
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { id_inventario,id_responsable_crear, nombre, capacidad_gb, volumen, app_user } = req.body;
            const consulta = `
                INSERT INTO archivo.t_disco(
                    f_aud,        -- fecha de la transaccion
                    b_aud,        -- tipo de transaccion ('I')
                    c_aud_uid,    -- usuario de base de datos
                    c_aud_uidred, -- usuario del sistema
                    c_aud_pc,     -- nombre de la pc 
                    c_aud_ip,     -- ip de la pc
                    c_aud_mac,

                    create_at,
                    id_inventario, 
                    id_responsable_crear,
                    nombre, 
                    capacidad_gb,
                    volumen
                    )   
                VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4,CURRENT_TIMESTAMP, $5, $6, $7, $8, $9)
                `;
                     
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                id_inventario,
                id_responsable_crear,
                nombre,
                capacidad_gb,
                volumen
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al insertar disco:", error);
                    if ((error as any).code === '23505') {
                        res.status(409).json({ text: 'Ya existe disco con ese nombre' });
                    } else {
                        res.status(500).json({ error: 'Error al insertar disco' });
                    }
                } else {
                    console.log('Datos de disco creado correctamente:',);
                    res.status(200).json({ message: 'Datos de disco creado correctamente' });
                }
            });
        } catch (error) {
            console.error('Error al crear disco:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async agregarDataDiscoActaApertura(req: Request, res: Response): Promise<any> {
        try {
            const { id_disco } = req.params;
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { dir_ftp_acta_apertura, peso_acta_apertura, fecha_acta_apertura, id_responsable_aa, app_user } = req.body;
            const consulta = `
                UPDATE archivo.t_disco
                SET 
                    f_aud=CURRENT_TIMESTAMP, 
                    b_aud='U', 
                    c_aud_uid='${key.user}', 
                    c_aud_uidred=$1, 
                    c_aud_pc=$2, 
                    c_aud_ip=$3, 
                    c_aud_mac=$4,

                    dir_ftp_acta_apertura=$5,
                    peso_acta_apertura=$6,
                    fecha_acta_apertura=$7,
                    id_responsable_aa=$8

                    WHERE id_disco=$9;
                         `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,

                dir_ftp_acta_apertura,
                peso_acta_apertura,
                fecha_acta_apertura,
                id_responsable_aa,
                id_disco
               
            ];  
            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al registrar acta de apertura", error);
                } else {
                    console.log('Acta de apertura registrada correctamente:',);
                    res.status(200).json({ message: 'Acta de apertura registrada correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async agregarDataDiscoActaCierre(req: Request, res: Response): Promise<any> {
        try {
            const { id_disco } = req.params;
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { dir_ftp_acta_cierre, peso_acta_cierre, fecha_acta_cierre, id_responsable_ac, app_user } = req.body;
            const consulta = `
                UPDATE archivo.t_disco
                SET 
                    f_aud=CURRENT_TIMESTAMP, 
                    b_aud='U', 
                    c_aud_uid='${key.user}', 
                    c_aud_uidred=$1, 
                    c_aud_pc=$2, 
                    c_aud_ip=$3, 
                    c_aud_mac=$4,

                    dir_ftp_acta_cierre=$5,
                    peso_acta_cierre=$6,
                    fecha_acta_cierre=$7,
                    id_responsable_ac=$8

                    WHERE id_disco=$9;
                         `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,

                dir_ftp_acta_cierre, 
                peso_acta_cierre, 
                fecha_acta_cierre,
                id_responsable_ac,
                id_disco
               
            ];  
            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al registrar acta de cierre", error);
                } else {
                    console.log('Acta de cierre registrada correctamente:',);
                    res.status(200).json({ message: 'Acta de cierre registrada correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async agregarDataDiscoTarjetaApertura(req: Request, res: Response): Promise<any> {
        try {
            const { id_disco } = req.params;
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { dir_ftp_tarjeta_apertura, peso_tarjeta_apertura, fecha_tarjeta_apertura, id_responsable_tca, app_user } = req.body;
            const consulta = `
                UPDATE archivo.t_disco
                SET 
                    f_aud=CURRENT_TIMESTAMP, 
                    b_aud='U', 
                    c_aud_uid='${key.user}', 
                    c_aud_uidred=$1, 
                    c_aud_pc=$2, 
                    c_aud_ip=$3, 
                    c_aud_mac=$4,

                    dir_ftp_tarjeta_apertura=$5,
                    peso_tarjeta_apertura=$6,
                    fecha_tarjeta_apertura=$7,
                    id_responsable_tca=$8

                    WHERE id_disco=$9;
                         `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,

                dir_ftp_tarjeta_apertura, 
                peso_tarjeta_apertura, 
                fecha_tarjeta_apertura,
                id_responsable_tca,
                id_disco
               
            ];                      
            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al registrar tarjeta de apertura", error);
                } else {
                    console.log('Tarjeta de apertura registrada correctamente:',);
                    res.status(200).json({ message: 'Tarjeta de apertura registrada correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async agregarDataDiscoTarjetaCierre(req: Request, res: Response): Promise<any> {
        try {
            const { id_disco } = req.params;
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { dir_ftp_tarjeta_cierre, peso_tarjeta_cierre, fecha_tarjeta_cierre, id_responsable_tcc, app_user } = req.body;
            const consulta = `
                UPDATE archivo.t_disco
                SET 
                    f_aud=CURRENT_TIMESTAMP, 
                    b_aud='U', 
                    c_aud_uid='${key.user}', 
                    c_aud_uidred=$1, 
                    c_aud_pc=$2, 
                    c_aud_ip=$3, 
                    c_aud_mac=$4,

                    dir_ftp_tarjeta_cierre=$5,
                    peso_tarjeta_cierre=$6,
                    fecha_tarjeta_cierre=$7,
                    id_responsable_tcc=$8
                    WHERE id_disco=$9;
                         `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,

                dir_ftp_tarjeta_cierre, 
                peso_tarjeta_cierre, 
                fecha_tarjeta_cierre,
                id_responsable_tcc,
                id_disco
               
            ];                      
            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al registrar tarjeta de cierre", error);
                } else {
                    console.log('Tarjeta de cierre registrada correctamente:',);
                    res.status(200).json({ message: 'Tarjeta de cierre registrada correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async cerrarDisco(req: Request, res: Response): Promise<any> {
        try {
            const { id_disco } = req.params;
            const {  id_responsable_cierre, user_app } = req.body;
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const consulta = `
                UPDATE archivo.t_disco
                SET 
                    f_aud=CURRENT_TIMESTAMP, 
                    b_aud='U', 
                    c_aud_uid='${key.user}', 
                    c_aud_uidred=$1, 
                    c_aud_pc=$2, 
                    c_aud_ip=$3, 
                    c_aud_mac=$4,

                    estado_cerrado=true,
                    id_responsable_cierre=$5

                    WHERE id_disco=$6;
                         `;
            const valores = [
                user_app,
                null,
                ipAddressClient,
                null,
                id_responsable_cierre,
                id_disco
            ];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Error al cerrar disco:', error);
                } else {
                    console.log('Disco cerrado correctamente:',);
                    res.status(200).json({ message: 'Disco cerrado correctamente' });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    

}

const discoController = new DiscoController();  
export default discoController;