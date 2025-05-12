import { Pool } from 'pg'; //importamos la libreria de postgres 
import {key} from './key'
const pool = new Pool(key);

pool.connect((error)=>{
    if(error){
        console.log('el error de conexion a la base de datos es: '+error);
        return;    
    }
    console.log('¡conexion con exito a la base de datos!')
})

export default pool;