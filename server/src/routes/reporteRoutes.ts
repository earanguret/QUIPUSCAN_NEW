import { Router } from "express";
import reporteController from "../controllers/reporteController";

class ReporteRoutes {

    public router: Router;

    constructor() {
        this.router = Router();
        this.config();

    }
    config(): void {
        this.router.get('/api/reporte/datos_estaticos', reporteController.datos_estaticos.bind(reporteController));
        this.router.get('/api/reporte/estado_produccion_total', reporteController.producionTotal.bind(reporteController));
        this.router.get('/api/reporte/produccion_anual', reporteController.produccionAnual.bind(reporteController));
    }
}

const reporteRoutes = new ReporteRoutes
export default reporteRoutes.router;