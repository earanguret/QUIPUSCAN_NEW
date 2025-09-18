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
        this.router.get('/api/reporte/produccion_mensual', reporteController.produccionMensual.bind(reporteController));
        this.router.get('/api/reporte/usuarios', reporteController.UsuariosReporte.bind(reporteController));
        this.router.get('/api/reporte/serie_documental', reporteController.SerieDocumentalReporte.bind(reporteController));
        this.router.get('/api/reporte/produccion_serie_documental', reporteController.ProduccionSerieDocumental.bind(reporteController));
        this.router.get('/api/reporte/produccion_usuario', reporteController.ProduccionUsuario.bind(reporteController));
        this.router.post('/api/reporte/produccion_usuario_ultimos_dias', reporteController.ProduccionUsuarioUlitmosDias.bind(reporteController));
    }
}

const reporteRoutes = new ReporteRoutes
export default reporteRoutes.router;