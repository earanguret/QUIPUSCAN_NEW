export class Validators {
    // Patrones para validaciones
    static patronDni: RegExp = /^([0-9]*)$/;
    static patronTelefono: RegExp = /^\d{6,9}$/;
    static patronEmail: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    static anioCompuesto: RegExp = /^(\d{4})(?:-(\d{4}))?(?:,(\d{4}))*$/;

  
  
    static validarDni(dni: string): boolean {
      return this.patronDni.test(dni);
    }
  
    static validarTelefono(telefono: string): boolean {
      return this.patronTelefono.test(telefono);
    }
    
    static validarCorreo(correo: string): boolean {
      return this.patronEmail.test(correo);
    }

    static validarAnioCompuesto(anio: string): boolean {
      return this.anioCompuesto.test(anio);
    }
  }