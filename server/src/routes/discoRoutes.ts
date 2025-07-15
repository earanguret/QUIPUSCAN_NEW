import { Router } from "express";
import discoController from "../controllers/discoController";

class DiscoRoutes {

    public router: Router;

    constructor() {
        this.router = Router();
        this.config();

    }
    config(): void {
        this.router.get('/api/disco/lista', discoController.listarDiscosByInventario.bind(discoController));
        this.router.post('/api/disco/create', discoController.crearDisco.bind(discoController));
        this.router.post('/api/disco/agregar/acta-apertura/:id_disco', discoController.agregarDireccionFTPActaApertura.bind(discoController));
        this.router.post('/api/disco/agregar/acta-cierre/:id_disco', discoController.agregarDireccionFTPActaCierre.bind(discoController));
        this.router.post('/api/disco/agregar/tarjeta-apertura/:id_disco', discoController.agregarDireccionFTPTarjetaApertura.bind(discoController));
        this.router.post('/api/disco/agregar/tarjeta-cierre/:id_disco', discoController.agregarDireccionFTPTarjetaCierre.bind(discoController));
    }
}

const discoRoutes = new DiscoRoutes
export default discoRoutes.router;