import { Router } from "express";
import discoController from "../controllers/discoController";
import CreateMiddleware from "../middlewares/log_evento/create.middleware";
import GetMiddleware from "../middlewares/log_evento/get.middleware";
import PostMiddleware from "../middlewares/log_evento/post.middleware";

class DiscoRoutes {

    public router: Router;

    constructor() {
        this.router = Router();
        this.config();

    }
    config(): void {
        this.router.get('/api/disco/lista/:id_inventario', discoController.listarDiscosByInventario.bind(discoController));
        this.router.post('/api/disco/create', CreateMiddleware , discoController.crearDisco.bind(discoController));
        this.router.post('/api/disco/agregar/acta-apertura/:id_disco', discoController.agregarDataDiscoActaApertura.bind(discoController));
        this.router.post('/api/disco/agregar/acta-cierre/:id_disco', discoController.agregarDataDiscoActaCierre.bind(discoController));
        this.router.post('/api/disco/agregar/tarjeta-apertura/:id_disco', discoController.agregarDataDiscoTarjetaApertura.bind(discoController));
        this.router.post('/api/disco/agregar/tarjeta-cierre/:id_disco', discoController.agregarDataDiscoTarjetaCierre.bind(discoController));
        this.router.post('/api/disco/cerrar/:id_disco', PostMiddleware, discoController.cerrarDisco.bind(discoController));
        this.router.get('/api/disco/descargar-zip/:id_disco/:app_user', GetMiddleware ,discoController.descargarDiscoZip.bind(discoController));
        
    }
}

const discoRoutes = new DiscoRoutes
export default discoRoutes.router;