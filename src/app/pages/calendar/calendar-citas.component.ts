import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CalendarEvent,
  CalendarMonthModule,
  CalendarView,
} from 'angular-calendar';
import { startOfDay, addMonths, subMonths } from 'date-fns'; 
import { Subject } from 'rxjs';
import { CalendarConfigModule } from './calendar-config.module';
import { Cita } from './../../models/cita.model';

@Component({
  selector: 'app-calendar-citas',
  standalone: true,
  imports: [CommonModule, CalendarConfigModule, CalendarMonthModule],
  providers: [],
  templateUrl: './calendar-citas.component.html',
  styleUrls: ['./calendar-citas.component.scss']
})
export class CalendarCitasComponent implements OnChanges{
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  CalendarView = CalendarView;
  refresh: Subject<any> = new Subject();

  @Input() citas: Cita[] = [];

  selectedEvent: CalendarEvent | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['citas']) {
      this.refresh.next(null);
      this.cdr.detectChanges();
    }
  }

  get events(): CalendarEvent[] {
    return this.citas.map(cita => ({
      start: new Date(cita.fechaCita),
      title: cita.motivo,
      color: this.getColorByStatus(cita.estado), 
      meta: {
        cliente: cita.clienteNombre,
        placa: cita.vehiculoPlaca,
        estado: cita.estado,  
        vehiculo: "",
        mecanico: "",
      }
    }));
  }

  private getColorByStatus(status: string): { primary: string, secondary: string } {
    const colorMap: { [key: string]: { primary: string, secondary: string } } = {
      'PENDIENTE': { primary: 'orange', secondary: '#ffcc80' },
      'CONFIRMADA': { primary: 'green', secondary: '#a5d6a7' },
      'CANCELADA': { primary: 'red', secondary: '#ef9a9a' },
      'COMPLETADA': { primary: 'gray', secondary: '#f5f5f5' }
    };

    const normalizedStatus = status.toUpperCase();

    return colorMap[normalizedStatus] || { primary: 'gray', secondary: '#e0e0e0' };
  }

  onEventClick(event: CalendarEvent): void {
    this.selectedEvent = event;  
    if (this.selectedEvent) {
      console.log("Detalles del evento seleccionando:", this.selectedEvent);
    }
  }

  cerrarDetalle(): void {
    this.selectedEvent = null;
  }

  changeMonth(direction: number): void {
    this.viewDate = direction === 1 ? addMonths(this.viewDate, 1) : subMonths(this.viewDate, 1);
  }

  getMonthName(date: Date): string {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return monthNames[date.getMonth()];
  }

  dayClicked(day: { date: Date; events: CalendarEvent[] }): void {
    console.log('Día clickeado:', day);
  }
}
