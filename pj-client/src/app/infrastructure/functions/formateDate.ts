export function FechaConFormato(fechaISO: string | Date): string {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0'); 
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); 
    const anio = fecha.getFullYear(); 
    return `${anio}-${mes}-${dia}`;
}


export function FechaConFormato_ddMMyyyy(fechaISO: string | Date): string {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0'); 
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); 
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

// export function formatDateToInput(dateString: string): string {
//     const date = new Date(dateString);
//     return date.toISOString().split('T')[0]; // Resultado: "2025-06-03"
//   }