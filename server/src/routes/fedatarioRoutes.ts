import { Router } from "express";
import fedatarioController from "../controllers/fedatarioController";
import CreateMiddleware from "../middlewares/log_evento/create.middleware";


class FedatarioRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/fedatario',fedatarioController.listarFedatario)
        this.router.post('/api/fedatario', CreateMiddleware ,fedatarioController.crearFedatario)
    }

}
const fedatarioRoutes = new FedatarioRoutes 
export default fedatarioRoutes.router;