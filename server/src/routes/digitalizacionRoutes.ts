import { Router} from "express";
import digitalizacionController from "../controllers/digitalizacionController";


class DigitalizacionRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/digitalizacion',digitalizacionController.listarDigitalizacion)
        this.router.get('/api/digitalizacion/:id_expediente',digitalizacionController.obtenerDigitalizacionByIdExpediente)
       // this.router.get('/api/digitalizacion/detalle/:id_expediente',digitalizacionController.obtenerDigitalizacionDetalle)
        this.router.get('/api/digitalizacion/dataview/:id_expediente',digitalizacionController.obtenerDigitalizacionDataViewXidExpediente)
        this.router.post('/api/digitalizacion',digitalizacionController.crearDigitalizacion)
        this.router.put('/api/digitalizacion/:id_expediente',digitalizacionController.modificarDigitalizacion)
        
    }
}

const digitalizacionRoutes = new DigitalizacionRoutes
export default digitalizacionRoutes.router;