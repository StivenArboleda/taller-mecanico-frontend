import { Component } from '@angular/core';
import { CalendarCitasComponent } from '../calendar/calendar-citas.component';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CalendarCitasComponent],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
})
export class CitasComponent {}
