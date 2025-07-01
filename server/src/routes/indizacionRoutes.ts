import { Router } from "express";
import indizacionController from "../controllers/indizacionController";

class IndizacionRoutes {

    public router: Router;

    constructor() {
        this.router = Router();
        this.config();

    }
    config(): void {
        this.router.get('/api/indizacion/dataview/:id_expediente', indizacionController.ObtenerIndizacionDataViewXidExpediente.bind(indizacionController));
        this.router.get('/api/indizacion/search/:id_expediente', indizacionController.ObtenerIndizacionById_expediente.bind(indizacionController));
        this.router.post('/api/indizacion/create', indizacionController.CrearIndizacion.bind(indizacionController));
        this.router.put('/api/indizacion/update/:id_expediente', indizacionController.ModificarIndizacion.bind(indizacionController));
    }
}

const indizacionRoutes = new IndizacionRoutes
export default indizacionRoutes.router;