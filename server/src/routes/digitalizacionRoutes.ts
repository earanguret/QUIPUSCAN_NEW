import { Router} from "express";
import digitalizacionController from "../controllers/digitalizacionController";
import CreateMiddleware from "../middlewares/log_evento/create.middleware";
import UpdateMiddleware from "../middlewares/log_evento/update.middleware";


class DigitalizacionRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/digitalizacion',digitalizacionController.listarDigitalizacion)
        this.router.get('/api/digitalizacion/:id_expediente',digitalizacionController.obtenerDigitalizacionByIdExpediente)
        this.router.get('/api/digitalizacion/dataview/:id_expediente',digitalizacionController.obtenerDigitalizacionDataViewXidExpediente)
        this.router.post('/api/digitalizacion', CreateMiddleware ,digitalizacionController.crearDigitalizacion)
        this.router.put('/api/digitalizacion/:id_expediente',UpdateMiddleware,digitalizacionController.modificarDigitalizacion)
        this.router.get('/api/digitalizacion/total_imagenes/fedatario/:id_inventario',digitalizacionController.obtenerTotalImagenesEnFedatario)
        
    }
}

const digitalizacionRoutes = new DigitalizacionRoutes
export default digitalizacionRoutes.router;