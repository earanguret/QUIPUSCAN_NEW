import bcrypt from 'bcryptjs'

// funciono para encriptar el password
export async function encriptar(textoPlano:string){
     const hash=await bcrypt.hash(textoPlano,10);
     return hash; 
}
//funcion para comparar el password con un texto plano 
export  function comparar(textoPlano:string,textoCifrado:string) {
    return  bcrypt.compare(textoPlano,textoCifrado)
    
}