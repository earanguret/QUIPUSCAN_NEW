import { Router } from "express";
import configuracionController from "../controllers/configuracionController";

class ConfiguracionRoutes{

    public router: Router;

    constructor(){  

        this.router=Router();
        this.config();

    }
    
    config():void {
        // GENERAL
        this.router.get('/api/configuracion/general',configuracionController.obtenerDatosGeneral)
        this.router.post('/api/configuracion/general',configuracionController.crearGeneral)
        this.router.put('/api/configuracion/general/:id_general',configuracionController.modificarGeneral)

        // ESPECIALIDAD
        this.router.get('/api/configuracion/especialidad',configuracionController.listarEspecialidad)
        this.router.post('/api/configuracion/especialidad',configuracionController.crearEspecialidad)
        this.router.put('/api/configuracion/especialidad/:id_especialidad',configuracionController.modificarEspecialidad)
        this.router.get('/api/configuracion/especialidad/:id_especialidad',configuracionController.obtenerEspecialidadById)
        this.router.delete('/api/configuracion/especialidad/:id_especialidad/:app_user',configuracionController.eliminarEspecialidad)

        // SEDE
        this.router.get('/api/configuracion/sede',configuracionController.listarSedes)
        this.router.post('/api/configuracion/sede',configuracionController.crearSede)
        this.router.delete('/api/configuracion/sede/:id_sede/:app_user',configuracionController.eliminarSede)

        // TIPO DE DOCUMENTO
        this.router.get('/api/configuracion/tipo_documento',configuracionController.listarTipoDocumento)
        this.router.post('/api/configuracion/tipo_documento',configuracionController.crearTipoDocumento)     
        this.router.delete('/api/configuracion/tipo_documento/:id_tipo_documento/:app_user',configuracionController.eliminarTipoDocumento)

        // JUZGADO DE ORIGEN
        this.router.get('/api/configuracion/juzgado',configuracionController.listarJuzgado)
        this.router.post('/api/configuracion/juzgado',configuracionController.crearJuzgado)     
        this.router.delete('/api/configuracion/juzgado/:id_juzgado/:app_user',configuracionController.eliminarJuzgado)

        // MATERIA
        this.router.get('/api/configuracion/materia',configuracionController.listarMateria)
        this.router.post('/api/configuracion/materia',configuracionController.crearMateria)     
        this.router.delete('/api/configuracion/materia/:id_materia/:app_user',configuracionController.eliminarMateria)

        // TIPO DE PROCESO
        this.router.get('/api/configuracion/tipo_proceso',configuracionController.listarTipoProceso)
        this.router.post('/api/configuracion/tipo_proceso',configuracionController.crearTipoProceso)        
        this.router.delete('/api/configuracion/tipo_proceso/:id_tipo_proceso/:app_user',configuracionController.eliminarTipoProceso)
    }

}

const configuracionRoutes = new ConfiguracionRoutes
export default configuracionRoutes.router;