import { Request, Response } from "express";
import * as ftp from "basic-ftp";
import * as fs from "fs";
import * as path from "path";
import { PassThrough } from "stream";

class FtpServerController {
    private client: ftp.Client;
    constructor() {
        this.client = new ftp.Client();
        this.client.ftp.verbose = true; // Activar logs para depuración
    }
    public async connect() {
        if (!this.client.closed) return; // Evita reconectar si ya está conectado
        try {
            await this.client.access({
                host: process.env.FTP_HOST || "172.17.70.118",
                user: process.env.FTP_USER || "user1",
                password: process.env.FTP_PASS || "123",
                secure: true,
                secureOptions: { rejectUnauthorized: false } // ⚠️ Solo para certificados autofirmados
            });

            console.log("✅ Conectado al servidor FTP");
        } catch (err) {
            console.error("❌ Error al conectar al servidor FTP:", err);
            throw new Error("Error al conectar al servidor FTP");
        }
    }

    public async createFolder (req: Request, res: Response):Promise<any> {
        const { folderName } = req.body;
    
        if (!folderName) {
            return res.status(400).json({ error: "El nombre de la carpeta es obligatorio" });
        }
    
        try {
            await this.connect();
            await this.client.ensureDir(folderName);
            res.status(200).json({ message: `📁 Carpeta creada: ${folderName}` });
        } catch (err) {
            res.status(500).json({ error: "Error al crear la carpeta", details: err });
        } finally {
            this.client.close();
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
    
        try {
            await this.connect();
            await this.client.ensureDir(folderPath);
            await this.client.uploadFrom(req, fileName);
    
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
            this.client.close();
        }
    }
    

    public async downloadFile(req: Request, res: Response): Promise<any> {
        const fileName = req.query.fileName as string;
        const folderPath = req.query.folderPath as string;
    
        if (!fileName || !folderPath) {
            return res.status(400).json({
                error: "Se requieren los parámetros 'fileName' y 'folderPath'"
            });
        }
    
        try {
            await this.connect();
    
            const fullPath = `${folderPath}/${fileName}`;
    
            // Headers para descarga
            res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
            res.setHeader("Content-Type", "application/octet-stream");
    
            // ✅ Descargar directamente al response
            await this.client.downloadTo(res, fullPath);
    
            console.log(`📤 Archivo enviado: ${fileName}`);
        } catch (err: any) {
            console.error("❌ Error al descargar el archivo:", err);
            res.status(500).json({ error: "No se pudo descargar el archivo", details: err.message });
        } finally {
            this.client.close();
        }
    }
    // public async downloadFile(req: Request, res: Response): Promise<any> {
    //     const { fileName, folderPath } = req.body;
    
    //     if (!fileName) {
    //         return res.status(400).json({ error: "El nombre del archivo es obligatorio" });
    //     }
    
    //     try {
    //         await this.connect(); // Conectar al FTP
    
    //         if (folderPath) {
    //             await this.client.cd(folderPath); // Cambia a la carpeta especificada
    //         }
    
    //         // Verificar si el archivo existe en la carpeta del FTP
    //         const fileList = await this.client.list();
    //         const fileExists = fileList.some(file => file.name === fileName);
    
    //         if (!fileExists) {
    //             return res.status(404).json({ error: "El archivo no existe en el servidor FTP" });
    //         }
    
    //         // 📂 Ruta en el disco D dentro de la carpeta quipuscanFiles
    //         const localDir = "D:\\quipuscanFiles";
    
    //         // 📂 Crear la carpeta si no existe
    //         if (!fs.existsSync(localDir)) {
    //             fs.mkdirSync(localDir, { recursive: true });
    //         }
    
    //         // 📄 Ruta donde se guardará el archivo descargado
    //         const localFilePath = path.join(localDir, fileName);
    
    //         // 🔽 Descargar el archivo del FTP
    //         await this.client.downloadTo(localFilePath, fileName);
    
    //         // 📤 Enviar el archivo como respuesta
    //         res.download(localFilePath, fileName, (err) => {
    //             if (err) {
    //                 res.status(500).json({ error: "Error al enviar el archivo", details: err });
    //             }
    //         });
    
    //     } catch (err) {
    //         res.status(500).json({ error: "Error al descargar el archivo", details: err });
    //     } finally {
    //         this.client.close();
    //     }
    // };

    public async listFiles(req: Request, res: Response): Promise<any> {
        const { folderPath } = req.body;
    
        if (!folderPath) {
            return res.status(400).json({ error: "El campo 'folderPath' es obligatorio en el cuerpo de la solicitud" });
        }
    
        try {
            await this.connect();
    
            // Cambiar al directorio solicitado
            await this.client.cd(folderPath);
            const fileList = await this.client.list();
    
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
            this.client.close();
        }
    }

    public async deleteFile(req: Request, res: Response):Promise<any> {
        const { fileName, folderPath } = req.body;
    
        // Validación básica
        if (!fileName || !folderPath) {
            return res.status(400).json({ error: "Se requieren los campos 'fileName' y 'folderPath'" });
        }
    
        const filePath = `${folderPath}/${fileName}`;
    
        try {
            await this.connect();

            await this.client.remove(filePath);
    
            console.log(` Archivo eliminado: ${filePath}`);
            res.status(200).json({ message: `Archivo ${fileName} eliminado exitosamente` });
        } catch (err) {
            console.error("Error al eliminar archivo:", err);
            res.status(500).json({ error: "Error al eliminar el archivo", details: err });
        } finally {
            this.client.close();
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
    
        try {
            await this.connect();
    
            // Renombrar el archivo
            await this.client.rename(oldFilePath, newFilePath);
    
            console.log(` Archivo renombrado: ${oldFileName} → ${newFileName}`);
            res.status(200).json({ message: `Archivo renombrado exitosamente a ${newFileName}` });
        } catch (err) {
            console.error(" Error al renombrar archivo:", err);
            res.status(500).json({ error: "Error al renombrar el archivo", details: err });
        } finally {
            this.client.close();
        }
    }

}

const ftpServerController = new FtpServerController();
export default ftpServerController;