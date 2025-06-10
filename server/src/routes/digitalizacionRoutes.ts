import { Router} from "express";
import digitalizacionController from "../controllers/digitalizacionCotroller";


class DigitalizacionRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/digitalizacion',digitalizacionController.listarDigitalizacion)
        this.router.get('/api/digitalizacion/lista/:id_expediente',digitalizacionController.obtenerDigitalizacionDetalle)
        this.router.post('/api/digitalizacion',digitalizacionController.crearDigitalizacion)
        
    }
}

const digitalizacionRoutes = new DigitalizacionRoutes
export default digitalizacionRoutes.router;