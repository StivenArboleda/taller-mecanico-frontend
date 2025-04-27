// src/app/services/vehiculo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehiculo } from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private apiUrl = 'http://localhost:8080/vehicles'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  obtenerVehiculosPorCliente(clienteCedula: string): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.apiUrl}/cliente/${clienteCedula}`, { headers: this.getAuthHeaders() });
  }

  registrarVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    const vehiculoRequest = {
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      anio: vehiculo.anio,
      color: vehiculo.color,
      clienteCedula: vehiculo.clienteCedula
    };

    return this.http.post<Vehiculo>(this.apiUrl, vehiculoRequest, { headers: this.getAuthHeaders() });
  }

  actualizarVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    const vehiculoRequest = {
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      anio: vehiculo.anio,
      color: vehiculo.color,
      clienteCedula: vehiculo.clienteCedula
    };

    return this.http.put<Vehiculo>(`${this.apiUrl}/${vehiculo.placa}`, vehiculoRequest, { headers: this.getAuthHeaders() });
  }

  eliminarVehiculo(placa: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${placa}`, { headers: this.getAuthHeaders() });
  }

  obtenerVehiculoPorPlaca(placa: string): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.apiUrl}/placa/${placa}`, { headers: this.getAuthHeaders() });
  }

  obtenerHistorialVehiculo(placaVehiculo: string): Observable<any> {
    return this.http.get<any>(`/api/vehiculos/${placaVehiculo}/historial`);
  }
  
}

