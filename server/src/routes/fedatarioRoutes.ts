import { Router } from "express";
import fedatarioController from "../controllers/fedatarioController";


class FedatarioRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/fedatario',fedatarioController.listarFedatario)
        this.router.post('/api/fedatario',fedatarioController.crearFedatario)
    }

}
const fedatarioRoutes = new FedatarioRoutes 
export default fedatarioRoutes.router;