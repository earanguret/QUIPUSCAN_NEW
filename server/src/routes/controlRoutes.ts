import { Router} from "express";
import controlController from "../controllers/controlController";
import CreateMiddleware from "../middlewares/log_evento/create.middleware";
import UpdateMiddleware from "../middlewares/log_evento/update.middleware";


class ControlRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.post('/api/control' , CreateMiddleware,controlController.crearControlCalidad)
        this.router.put('/api/control/:id_expediente', UpdateMiddleware ,controlController.ModificarControlCalidad)
        this.router.get('/api/control/:id_expediente',controlController.ObtenerDatosControl)
        this.router.get('/api/control/dataview/:id_expediente',controlController.ObtenerControlDataViewXidExpediente)
    }
}

const controlRoutes = new ControlRoutes
export default controlRoutes.router;