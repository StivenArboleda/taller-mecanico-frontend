import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarCitasComponent } from '../calendar/calendar-citas.component';
import { Cita } from '../../models/cita.model';
import { CitaService } from '../../services/cita-service.service';
import { FormularioCitaComponent } from './formulario-citas/formulario-citas.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarCitasComponent, FormularioCitaComponent],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss']
})
export class CitasComponent implements OnInit {

  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;

  citas: Cita[] = [];

  constructor(private citaService: CitaService) {}

  ngOnInit(): void {
    this.obtenerCitas();
  }

  obtenerCitas(): void {
    this.citaService.obtenerCitas().subscribe((data) => {
      this.citas = data;
    });
  }

  abrirFormulario(): void {
    this.modoEdicion = false;
    this.mostrarFormulario = true;
  }

  guardarCita(cita: Cita): void {
    this.citaService.registrarCita(cita).subscribe({
      next: (nuevaCita) => {
        this.citas.push(nuevaCita);
        this.mostrarFormulario = false;
        Swal.fire('Registrado', 'La cita fue creada exitosamente.', 'success');
      },
      error: (error) => {
        Swal.fire('Error al crear cita', error?.error.message || 'Ocurrió un error inesperado', 'error');
      }
    });
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }
}
