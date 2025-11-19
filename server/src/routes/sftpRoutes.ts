import { Router } from "express";
import sftpServerController from "../controllers/sftpController";

class SftpServerRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.config();
  }

  config(): void {
    this.router.post('/api/sftp/upload',sftpServerController.uploadFile.bind(sftpServerController));
    this.router.get('/api/sftp/download', sftpServerController.downloadFile.bind(sftpServerController));
  }
}

const sftpServerRoutes = new SftpServerRoutes();
export default sftpServerRoutes.router;
