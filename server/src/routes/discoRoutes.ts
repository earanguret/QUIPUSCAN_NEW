import { Router } from "express";
import discoController from "../controllers/discoController";

class DiscoRoutes {

    public router: Router;

    constructor() {
        this.router = Router();
        this.config();

    }
    config(): void {
        this.router.get('/api/disco/lista/:id_inventario', discoController.listarDiscosByInventario.bind(discoController));
        this.router.post('/api/disco/create', discoController.crearDisco.bind(discoController));
        this.router.post('/api/disco/agregar/acta-apertura/:id_disco', discoController.agregarDataDiscoActaApertura.bind(discoController));
        this.router.post('/api/disco/agregar/acta-cierre/:id_disco', discoController.agregarDataDiscoActaCierre.bind(discoController));
        this.router.post('/api/disco/agregar/tarjeta-apertura/:id_disco', discoController.agregarDataDiscoTarjetaApertura.bind(discoController));
        this.router.post('/api/disco/agregar/tarjeta-cierre/:id_disco', discoController.agregarDataDiscoTarjetaCierre.bind(discoController));
        this.router.post('/api/disco/cerrar/:id_disco', discoController.cerrarDisco.bind(discoController));
    }
}

const discoRoutes = new DiscoRoutes
export default discoRoutes.router;