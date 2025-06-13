import { Router } from "express";
import ftpServerController from "../controllers/ftpServerController";

class FtpServerRoutes {

    public router: Router;

    constructor() {
        this.router = Router();
        this.config();

    }
    config(): void {
        this.router.post('/api/ftp/upload', ftpServerController.uploadFile.bind(ftpServerController));
        this.router.post('/api/ftp/folder', ftpServerController.createFolder.bind(ftpServerController));
        // this.router.post('/api/ftp/download', ftpServerController.downloadFile.bind(ftpServerController));
        this.router.get('/api/ftp/download', ftpServerController.downloadFile.bind(ftpServerController));
        this.router.post('/api/ftp/list', ftpServerController.listFiles.bind(ftpServerController));
        this.router.post('/api/ftp/delete', ftpServerController.deleteFile.bind(ftpServerController));
        this.router.post('/api/ftp/rename', ftpServerController.renameFile.bind(ftpServerController));
    }
}

const ftpServerRoutes = new FtpServerRoutes
export default ftpServerRoutes.router;