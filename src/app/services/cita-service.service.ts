import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = 'http://localhost:8080/appointments';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  registrarCita(cita: Cita): Observable<Cita> {
    const citaRequest = {
      fechaCita: cita.fechaCita,
      motivo: cita.motivo,
      estado: cita.estado,
      clienteCedula: cita.clienteCedula,  
      vehiculoPlaca: cita.vehiculoPlaca
    };

    return this.http.post<Cita>(this.apiUrl, citaRequest, { headers: this.getAuthHeaders() });
  }

  obtenerCitaPorId(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarEstadoCita(id: number, estado: string): Observable<Cita> {
    const body = { estado: estado };
    return this.http.put<Cita>(`${this.apiUrl}/${id}`, body, { headers: this.getAuthHeaders() });
  }

  eliminarCita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  marcarCitaComoCompletada(id: number): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/${id}/complete`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}

