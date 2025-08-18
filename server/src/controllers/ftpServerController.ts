import { Request, Response } from "express";
import { createFtpClientConexion } from "../ftp/ftp_conexion";

class FtpServerController {
    

    public async createFolder (req: Request, res: Response):Promise<any> {
        const { folderName } = req.body;
    
        if (!folderName) {
            return res.status(400).json({ error: "El nombre de la carpeta es obligatorio" });
        }
    
        let client
        try {
            client = await createFtpClientConexion();
            await client.ensureDir(folderName);
            res.status(200).json({ message: `📁 Carpeta creada: ${folderName}` });
        } catch (err) {
            res.status(500).json({ error: "Error al crear la carpeta", details: err });
        } finally {
            client?.close();
        }
    };

    public async uploadFile(req: Request, res: Response): Promise<any> {
        const fileName = req.headers["file-name"] as string;
        const folderPath = req.headers["folder-path"] as string;
    
        if (!fileName || !folderPath) {
            return res.status(400).json({
                error: "El nombre del archivo y la ruta de la carpeta son obligatorios en los headers (file-name, folder-path)"
            });
        }
    
        let client
        try {
            client = await createFtpClientConexion();
            await client.ensureDir(folderPath);
            await client.uploadFrom(req, fileName);
    
            console.log(` Archivo subido correctamente: ${fileName}`);
            return res.status(200).json({ message: ` Archivo ${fileName} subido exitosamente` });
    
        } catch (err: any) {
            console.error("Error al subir el archivo:", err);
            // Detecta el error específico lanzado en connect()
            if (err.message === "Error al conectar al servidor FTP") {
                return res.status(503).json({
                    error: "No se pudo establecer conexión con el servidor FTP."
                });
            }
            // Otro error
            return res.status(500).json({
                error: "Error al subir el archivo",
                details: err.message
            });
        } finally {
            client?.close();
        }
    }

    // public async uploadFile(req: Request, res: Response): Promise<any> {
    //     const fileName = req.headers["file-name"] as string;
    //     const folderPath = req.headers["folder-path"] as string;
    
    //     if (!fileName || !folderPath) {
    //         return res.status(400).json({
    //             error: "El nombre del archivo y la ruta de la carpeta son obligatorios en los headers (file-name, folder-path)"
    //         });
    //     }
    
    //     let client;
    //     const startTime = Date.now();
    //     let bytesReceived = 0;
    
    //     try {
    //         console.log(`📂 [FTP] Iniciando subida: ${fileName} → ${folderPath}`);
    
    //         // Medir bytes que llegan desde el cliente
    //         req.on("data", chunk => {
    //             bytesReceived += chunk.length;
    //         });
    
    //         // Crear cliente FTP con timeout de 60s
    //         client = await createFtpClientConexion();
    
    //         await client.ensureDir(folderPath);
    //         await client.uploadFrom(req, fileName);
    
    //         const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    //         console.log(`✅ Subida exitosa: ${fileName} (${bytesReceived} bytes en ${duration} s)`);
    
    //         return res.status(200).json({
    //             message: `Archivo ${fileName} subido correctamente`,
    //             size: bytesReceived,
    //             duration: `${duration} segundos`
    //         });
    
    //     } catch (err: any) {
    //         const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    //         console.error(`❌ Error subiendo ${fileName} después de ${duration} s:`, err);
    
    //         if (!res.headersSent) {
    //             if (err.code === "ECONNRESET") {
    //                 return res.status(502).json({
    //                     error: "Conexión FTP interrumpida",
    //                     code: err.code,
    //                     duration: `${duration} segundos`
    //                 });
    //             }
    //             if (err.message === "Error al conectar al servidor FTP") {
    //                 return res.status(503).json({
    //                     error: "No se pudo establecer conexión con el servidor FTP",
    //                     duration: `${duration} segundos`
    //                 });
    //             }
    //             return res.status(500).json({
    //                 error: "Error al subir el archivo",
    //                 details: err.message || "Error desconocido",
    //                 duration: `${duration} segundos`
    //             });
    //         }
    //     } finally {
    //         client?.close();
    //     }
    // }
    
    
    
    public async downloadFile(req: Request, res: Response): Promise<any> {
        const fileName = req.query.fileName as string;
        const folderPath = req.query.folderPath as string;
    
        if (!fileName || !folderPath) {
            return res.status(400).json({
                error: "Se requieren los parámetros 'fileName' y 'folderPath'"
            });
        }
    
        let client
        try {
            client = await createFtpClientConexion();
            const fullPath = `${folderPath}/${fileName}`;
    
            // Headers para visualizar en navegador
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
            res.setHeader("Accept-Ranges", "bytes");
    
            // Streaming desde FTP hacia el navegador
            await client.downloadTo(res, fullPath);
    
            console.log(`📤 Archivo enviado: ${fileName}`);
        } catch (err: any) {
            console.error("❌ Error al descargar el archivo:", err);
            res.status(500).json({ error: "No se pudo descargar el archivo", details: err.message });
        } finally {
            client?.close();
        }
    }

    public async listFiles(req: Request, res: Response): Promise<any> {
        const { folderPath } = req.body;
    
        if (!folderPath) {
            return res.status(400).json({ error: "El campo 'folderPath' es obligatorio en el cuerpo de la solicitud" });
        }

        let client
        try {
            client = await createFtpClientConexion();
    
            // Cambiar al directorio solicitado
            await client.cd(folderPath);
            const fileList = await client.list();
    
            // Formatear la respuesta
            const result = fileList.map(file => ({
                name: file.name,
                size: file.size,
                modifiedAt: file.modifiedAt,
            }));
    
            res.status(200).json({ path: folderPath, contents: result });
        } catch (err) {
            console.error(" Error al listar archivos:", err);
            res.status(500).json({ error: "Error al listar los archivos", details: err });
        } finally {
            client?.close();
        }
    }

    public async deleteFile(req: Request, res: Response):Promise<any> {
        const { fileName, folderPath } = req.body;
    
        // Validación básica
        if (!fileName || !folderPath) {
            return res.status(400).json({ error: "Se requieren los campos 'fileName' y 'folderPath'" });
        }
    
        const filePath = `${folderPath}/${fileName}`;
        let client
        try {
            client = await createFtpClientConexion();

            await client.remove(filePath);
    
            console.log(` Archivo eliminado: ${filePath}`);
            res.status(200).json({ message: `Archivo ${fileName} eliminado exitosamente` });
        } catch (err) {
            console.error("Error al eliminar archivo:", err);
            res.status(500).json({ error: "Error al eliminar el archivo", details: err });
        } finally {
            client?.close();
        }
    }

    public async renameFile(req: Request, res: Response):Promise<any> {
        const { folderPath, oldFileName, newFileName } = req.body;
    
        // Validaciones básicas
        if (!folderPath || !oldFileName || !newFileName) {
            return res.status(400).json({
                error: "Se requieren los campos 'folderPath', 'oldFileName' y 'newFileName'"
            });
        }

        const oldFilePath = `${folderPath}/${oldFileName}`;
        const newFilePath = `${folderPath}/${newFileName}`;
        let client
        try {
            client = await createFtpClientConexion();
    
            // Renombrar el archivo
            await client.rename(oldFilePath, newFilePath);
    
            console.log(` Archivo renombrado: ${oldFileName} → ${newFileName}`);
            res.status(200).json({ message: `Archivo renombrado exitosamente a ${newFileName}` });
        } catch (err) {
            console.error(" Error al renombrar archivo:", err);
            res.status(500).json({ error: "Error al renombrar el archivo", details: err });
        } finally {
            client?.close();
        }
    }

}

const ftpServerController = new FtpServerController();
export default ftpServerController;