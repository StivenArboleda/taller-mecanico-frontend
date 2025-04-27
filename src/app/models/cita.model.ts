export interface Cita {
    id?: number;
    fechaCita: string;
    motivo: string;
    estado: string;
    clienteCedula: number;
    vehiculoPlaca: string;
    fechaRecogida?: string | null;
    clienteNombre?: string;
  }
  