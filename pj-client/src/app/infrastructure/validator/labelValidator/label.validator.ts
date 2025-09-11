export class Validators {
  static patronDni: RegExp = /^([0-9]*)$/;
  static patronTelefono: RegExp = /^\d{6,9}$/;
  static patronEmail: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  static anioCompuesto: RegExp = /^(\d{4})(?:-(\d{4}))?(?:,(\d{4}))*$/;
  static patronExpediente: RegExp = /^\d{5}-(199[0-9]|20[0-1][0-9]|202[0-6])-\d{1,4}-(220[1-9]|2210|2211|2213|2214|2215|2216|2217|2218|2219)-(JM|JN|JP|JR|SP|SU)-(CA|CI|CO|CP|DC|ED|FA|FC|FP|FT|LA|PD|PE|TA|TC|TI|TR|TS)-\d{2}$/;

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

  static validarExpediente(expediente: string): boolean {
    //Valida lo siguiente:
    // 5 dígitos iniciales.
    // Un año válido (1990–2026).
    // Un número de 1 a 4 dígitos.
    // Un código específico (2201–2219, excepto 2212).
    // Una categoría de juzgado (JM, JN, JP, JR, SP, SU).
    // Una materia (CA, CI, CO, etc.).
    // Dos dígitos finales.
   
    return this.patronExpediente.test(expediente);
  }
}
