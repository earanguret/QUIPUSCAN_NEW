import { ErrorValidacion } from "../../../domain/dto/ErrorValidacion.dto";
import { LoginRequest } from "../../../domain/dto/LoginRequest.dto";

export function LoginValidator(loginRequest: LoginRequest): ErrorValidacion[] {
    const errores: ErrorValidacion[] = [];
    if (!loginRequest.username) {
        errores.push({ campo: 'username', mensaje: 'Campo requerido' });
    }
    if (!loginRequest.password) {
        errores.push({ campo: 'password', mensaje: 'Campo requerido' });
    }
    return errores;
}