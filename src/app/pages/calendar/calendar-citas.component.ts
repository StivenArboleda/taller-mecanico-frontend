import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CalendarEvent,
  CalendarMonthModule,
  CalendarUtils,
  CalendarView,
} from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarConfigModule } from './calendar-config.module';
import { Cita } from './../../models/cita.model';

@Component({
  selector: 'app-calendar-citas',
  standalone: true,
  imports: [CommonModule, CalendarConfigModule, CalendarMonthModule],
  providers: [CalendarUtils],
  templateUrl: './calendar-citas.component.html',
  styleUrls: ['./calendar-citas.component.scss']
})
export class CalendarCitasComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  CalendarView = CalendarView;
  refresh: Subject<any> = new Subject();

  @Input() citas: Cita[] = [];

  get events(): CalendarEvent[] {
    return this.citas.map(cita => ({
      start: new Date(cita.fechaCita),
      title: cita.motivo,
      color: { primary: '#42a5f5', secondary: '#bbdefb' },
      meta: {
        cliente: cita.clienteNombre,
        placa: cita.vehiculoPlaca,
        // vehiculo y mecanico no vienen en la cita actualmente
      }
    }));
  }

  crearCita() {
    alert('Crear nueva cita');
  }

  selectedEvent: CalendarEvent | null = null;

  onEventClick(event: CalendarEvent): void {
    this.selectedEvent = event;
  }

  cerrarDetalle(): void {
    this.selectedEvent = null;
  }
}
