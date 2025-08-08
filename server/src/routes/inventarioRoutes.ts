import {Router} from "express";
import inventarioController from "../controllers/inventarioController";
import CreateMiddleware from "../middlewares/log_evento/create.middleware";
import UpdateMiddleware from "../middlewares/log_evento/update.middleware";

class InventarioRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/inventario',inventarioController.listarInventarioDetalle)
        this.router.get('/api/inventario/:id',inventarioController.ObtenerInventarioDetalleXid)
        this.router.post('/api/inventario', CreateMiddleware ,inventarioController.CrearInventario)
        this.router.put('/api/inventario/:id', UpdateMiddleware ,inventarioController.ModificarInventario)
    }
}

const inventarioRoutes=new InventarioRoutes
export default inventarioRoutes.router;