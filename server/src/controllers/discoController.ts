import { Response, Request } from "express";
import { Client } from "basic-ftp";
import archiver from "archiver";
import { Writable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
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
            const { id_inventario, id_responsable_crear, nombre, capacidad_gb, volumen, app_user } = req.body;
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
            const { id_responsable_cierre, espacio_ocupado, user_app } = req.body;
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
                    id_responsable_cierre=$5,
                    espacio_ocupado=$6

                    WHERE id_disco=$7;
                         `;
            const valores = [
                user_app,
                null,
                ipAddressClient,
                null,
                id_responsable_cierre,
                espacio_ocupado,
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


    public async descargarDiscoZip(req: Request, res: Response): Promise<any> {
        const { id_disco } = req.params;

        const ftpClient = new Client();
        await ftpClient.access({
            host: process.env.FTP_HOST || "172.17.70.118",
            user: process.env.FTP_USER || "user1",
            password: process.env.FTP_PASS || "123",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });


        

        try {
            // Configura el ZIP como respuesta HTTP
            res.setHeader("Content-Type", "application/zip");
            res.setHeader("Content-Disposition", `attachment; filename=disco_${id_disco}.zip`);

            const archive = archiver("zip", { zlib: { level: 9 } });
            archive.pipe(res);

            const downloadAndAppend = async (
                remotePath: string,
                zipPath: string
            ): Promise<void> => {
                try {
                    const chunks: Buffer[] = [];
                    const writable = new Writable({
                        write(chunk, _encoding, callback) {
                            chunks.push(chunk);
                            callback();
                        }
                    });
        
                    await ftpClient.downloadTo(writable, remotePath);
                    const buffer = Buffer.concat(chunks);
                    archive.append(buffer, { name: zipPath });
                } catch (err: any) {
                    console.warn(`❌ No se pudo descargar ${remotePath}, se omite.`, err.message);
                }
            };


            // 1. Agregar el entorno de ejecucion JavaScript (datos de la carpeta visor)
            const projectRoot = path.resolve(__dirname, '../'); // Sube dos niveles desde build/controllers
            const filesToLoad = [
                'visor/bootstrap-icons.min.css',
                'visor/bootstrap.min.css',
                'visor/index.html',
                'visor/jquery-3.6.0.min.js',
                'visor/script.js',
                'visor/styles.css',
                'visor/visor.bat'
            ];

            for (const relativePath of filesToLoad) {
                const fullPath = path.join(projectRoot, relativePath); // ✅ desde la raíz real
                const fileName = path.basename(relativePath);
                const zipPath = `VISOR/${fileName}`; // ZIP interno

                if (fs.existsSync(fullPath)) {
                    archive.file(fullPath, { name: zipPath });
                } else {
                    console.warn(`⚠️ Archivo no encontrado y omitido: ${fullPath}`);
                }
            }
            
            // 2. Obtener los datos del disco desde la base de datos 
            const data_disco = await db.query(
                `select 
                        d.*,
                        i.especialidad,
                        i.anio,
                        i.sede,
                        i.tipo_doc,
                        i.serie_doc
                    from 
                        archivo.t_disco d
                    join 
                        archivo.t_inventario i on d.id_inventario = i.id_inventario
                    where 
                        d.id_disco = $1`,
                [id_disco]
            );

            if (!data_disco.rows.length) {
                return res.status(404).json({ error: "No se encontro disco" });
            }

            console.log(data_disco.rows[0].dir_ftp_acta_apertura)

            // archive.file(`${data_disco.rows[0].dir_ftp_acta_apertura}/`, { name: `VISOR/DOCUMENTOS/.bat` });


            // 3. Obtener los expedientes asociados al disco desde la base de datos
            const resultado = await db.query(
                `SELECT 
                    e.id_expediente, 
                    e.nro_expediente, 
                    d.dir_ftp,
                    i.fecha_inicial,
                    i.fecha_final,
                    es.id_disco,
                    i.juzgado_origen,
                    p.create_at as fecha_preparacion,
                    d.create_at as fecha_digitalizacion,
                    i.create_at as fecha_indizacion,
                    cc.create_at as fecha_control,
                    f.create_at as fecha_fedatario,
                    d.peso_doc
                FROM 
                    archivo.t_expediente e
                JOIN 
                    archivo.t_estado_expediente es ON e.id_expediente = es.id_expediente
                JOIN 
                    archivo.t_preparacion p ON e.id_expediente = p.id_expediente
                JOIN
                    archivo.t_digitalizacion d ON e.id_expediente = d.id_expediente
                JOIN
                    archivo.t_indizacion i ON e.id_expediente = i.id_expediente
                JOIN
                    archivo.t_control cc ON e.id_expediente = cc.id_expediente
                JOIN
                    archivo.t_fedatar f ON e.id_expediente = f.id_expediente
                WHERE 
                    es.id_disco = $1`,
                [id_disco]
            );
            const expedientes = resultado.rows;

            if (!expedientes.length) {
                return res.status(404).json({ error: "No se encontraron expedientes" });
            }
        
            // Agrega los archivos al ZIP desde el FTP
            for (const exp of expedientes) {
                const remotePath = `${exp.dir_ftp}/${exp.nro_expediente}.pdf`;
                try {
                    const chunks: Buffer[] = [];

                    const writable = new Writable({
                        write(chunk, _encoding, callback) {
                            chunks.push(chunk);
                            callback(); // ✔️ importante
                        }
                    });

                    await ftpClient.downloadTo(writable, remotePath);
                    const buffer = Buffer.concat(chunks);
                    archive.append(buffer, { name: `VISOR/ADJUNTOS/MICROFORMAS/${exp.nro_expediente}.pdf` });
                } catch (err: any) {
                    console.warn(`❌ No se pudo descargar ${remotePath}, se omite.`, err.message);
                }
            }

            const documentos = [
                { name: 'TCA.pdf', zipName: 'TCA.pdf' },
                { name: 'TCC.pdf', zipName: 'TCC.pdf' },
                { name: 'AA.pdf', zipName: 'AA.pdf' },
                { name: 'AC.pdf', zipName: 'AC.pdf' }  // Aquí puede estar el error: revisa si AC.pdf realmente está en el FTP o si es AA.pdf duplicado
            ];
    
            for (const doc of documentos) {
                const remotePath = `${data_disco.rows[0].dir_ftp_acta_apertura}/${doc.name}`;
                const zipPath = `VISOR/ADJUNTOS/DOCUMENTOS/${doc.zipName}`;
                await downloadAndAppend(remotePath, zipPath);
            }

            // Agregar archivo JSON
            const inventario = {
                especialidad: data_disco.rows[0].especialidad,
                anio: data_disco.rows[0].anio,
                sede: data_disco.rows[0].sede,
                tipoDoc: data_disco.rows[0].tipo_doc,
                serieDoc: data_disco.rows[0].serie_doc,
                volumen: data_disco.rows[0].volumen,
                fecha_acta_apertura:data_disco.rows[0].fecha_acta_apertura,
                fecha_acta_cierre:data_disco.rows[0].fecha_acta_cierre,
                fecha_tarjeta_apertura:data_disco.rows[0].fecha_tarjeta_apertura,
                fecha_tarjeta_cierre:data_disco.rows[0].fecha_tarjeta_cierre,
                total_fojas:data_disco.rows[0].capacidad_gb, //corregir dato
                cantidad_expedientes:expedientes.length
              };

              
                

              archive.append(
                JSON.stringify({datosGenerales: inventario,
                    expedientes: expedientes}, null, 2), // null, 2 para formato legible
                { name: 'VISOR/ADJUNTOS/metadata.json' }
            );
    
            // Finaliza el archivo ZIP
            archive.finalize();
        } catch (error) {
            console.error("Error generando ZIP:", error);
            res.status(500).json({ error: "Error generando el ZIP" });
        } finally {
            ftpClient.close();
        }
    }
  
}

const discoController = new DiscoController();
export default discoController;