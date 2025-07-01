import { Router} from "express";
import controlController from "../controllers/controlController";


class ControlRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.post('/api/control',controlController.crearControlCalidad)
        this.router.put('/api/control/:id_expediente',controlController.ModificarControlCalidad)
        this.router.get('/api/control/:id_expediente',controlController.ObtenerDatosControl)
    }
}

const controlRoutes = new ControlRoutes
export default controlRoutes.router;