import { Component } from '@angular/core';
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


@Component({
  selector: 'app-calendar-citas',
  standalone: true,
  imports: [CommonModule, CalendarConfigModule, CalendarMonthModule],
  providers: [CalendarUtils],
  templateUrl: './calendar-citas.component.html',
  styleUrls: ['./calendar-citas.component.scss'],

})
export class CalendarCitasComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  events: CalendarEvent[] = [
    {
      start: new Date(2025, 3, 6, 9, 30),
      end: new Date(2025, 3, 6, 10, 30),
      title: 'Revisión Motor',
      color: { primary: '#42a5f5', secondary: '#bbdefb' },
      meta: {
        cliente: 'Juan Pérez',
        vehiculo: 'Renault Duster - 2022',
        placa: 'XYZ-123',
        mecanico: 'Sebastian Torres'
      },
    },
    {
      start: new Date(2025, 3, 6, 14, 0),
      end: new Date(2025, 3, 6, 15, 0),
      title: 'Cambio de aceite',
      color: { primary: '#66bb6a', secondary: '#c8e6c9' },
      meta: {
        cliente: 'Laura Gómez',
        vehiculo: 'Hero Hunk 160R - 2025',
        placa: 'ABC-456',
        mecanico: 'Sebastian Torres'
      },
    },
    {
      start: new Date(2025, 3, 9, 11, 0),
      end: new Date(2025, 3, 9, 12, 0),
      title: 'Revisión general',
      color: { primary: '#ffa726', secondary: '#ffecb3' },
      meta: {
        cliente: 'Carlos Ramos',
        vehiculo: 'Honda Civic - 2022',
        placa: 'DEF-789',
        mecanico: 'Miguel Ramos'
      },
    },
    {
      start: new Date(2025, 3, 12, 16, 0),
      end: new Date(2025, 3, 12, 17, 30),
      title: 'Combo Viajero',
      color: { primary: '#8e24aa', secondary: '#f3e5f5' },
      meta: {
        cliente: 'Ana Torres',
        vehiculo: 'Suzuki Gixxer 250 - 2021',
        placa: 'GHI-321',
        mecanico: 'Felipe Zapata'
      },
    }
  ];

  CalendarView = CalendarView;
  refresh: Subject<any> = new Subject();

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
