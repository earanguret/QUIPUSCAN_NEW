import {Router} from "express";
import inventarioController from "../controllers/inventarioController";

class InventarioRoutes{

    public router: Router;

    constructor(){
        this.router=Router();
        this.config();
        
    }
    config():void{
        this.router.get('/api/inventario',inventarioController.listarInventarioDetalle)
        this.router.get('/api/inventario/:id',inventarioController.ObtenerInventarioDetalleXid)
        this.router.post('/api/inventario',inventarioController.CrearInventario)
    }
}

const inventarioRoutes=new InventarioRoutes
export default inventarioRoutes.router;