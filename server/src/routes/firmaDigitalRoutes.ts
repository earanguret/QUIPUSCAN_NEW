import { Router } from "express";
import firmaDigitalController from "../controllers/firmaDigitalController";

class FirmaDigitalRoutes {

    public router: Router;

    constructor() {
        this.router = Router();
        this.config();

    }
    config(): void {
        this.router.post('/api/firma/', firmaDigitalController.firmarDocumentoDesdeFTP.bind(firmaDigitalController));
        this.router.post('/api/firma/lote', firmaDigitalController.firmarLoteDesdeFTP.bind(firmaDigitalController));
        this.router.post('/api/firma/buscar', firmaDigitalController.buscarFirmaDigitalByUsername.bind(firmaDigitalController));
    }
}

const firmaDigitalRoutes = new FirmaDigitalRoutes
export default firmaDigitalRoutes.router;