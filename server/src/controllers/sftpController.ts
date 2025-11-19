import { Request, Response } from "express";
import { useSftpConnection } from "../sftp/sftp_conexion";
import { getRemotePath } from "../sftp/key";


class SftpServerController {

public async uploadFile(req: Request, res: Response): Promise<void> {
  const fileName = req.headers["file-name"] as string;
  const folderPath = req.headers["folder-path"] as string;

  if (!fileName || !folderPath) {
    res.status(400).json({
      error: "Los headers 'file-name' y 'folder-path' son obligatorios",
    });
    return;
  }

  try {
    await useSftpConnection(async (sftp) => {
      await sftp.mkdir(folderPath, true);
      const remotePath = `${folderPath}/${fileName}`;
      await sftp.put(req, remotePath);
    });

    res.status(200).json({
      message: `✅ Archivo ${fileName} subido correctamente`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      error: "Error al subir archivo",
      details: message,
    });
  }
}

public async downloadFile(req: Request, res: Response): Promise<void> {
  const fileName = req.query.fileName as string;
  const folderPath = req.query.folderPath as string;

  if (!fileName || !folderPath) {
     res.status(400).json({
      error: "Se requieren los parámetros 'fileName' y 'folderPath'",
    });
    return;
  }

  // 🚀 Depuración: listar archivos en la carpeta
  // await useSftpConnection(async (sftp) => {
  //   const list = await sftp.list(folderPath);
  //   console.log("Archivos disponibles:", list.map(f => f.name));
  // });

  try {
    await useSftpConnection(async (sftp) => {
      const remotePath =getRemotePath( `${folderPath}/${fileName}`);
      console.log("remotePath:",remotePath)
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    //   await sftp.get("C:\Users\quipuscan_files_ssh\quipuscan_files\EJFT2012CUSCO\EXPEDIENT\nuevo-dcumento.pdf", res);
     await sftp.get(remotePath, res);

    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error al descargar archivo:", message);

    if (!res.headersSent) {
      res.status(500).json({
        error: "Error al descargar archivo",
        details: message,
      });
    }
  }
}

}

const sftpServerController = new SftpServerController();
export default sftpServerController;
