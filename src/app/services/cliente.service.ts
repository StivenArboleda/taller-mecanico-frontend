// src/app/services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from '../models/cliente.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/clients';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  registrarCliente(cliente: Cliente): Observable<Cliente> {
    const clienteRequest = {
      cedula: cliente.cedula,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion 
    };

    return this.http.post<Cliente>(this.apiUrl, clienteRequest, { headers: this.getAuthHeaders() });
  }

  actualizarCliente(cliente: Cliente): Observable<Cliente> {
    const clienteRequest = {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      fechaRegistro: cliente.fechaRegistro
    };
  
    return this.http.put<Cliente>(
      `${this.apiUrl}/${cliente.cedula}`,
      clienteRequest,
      { headers: this.getAuthHeaders() }
    );
  }

  
  eliminarCliente(cedula: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cedula}`, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerClientePorCedula(cedula: string): Observable<Cliente> {
    console.log(`Buscando cliente con cédula: ${cedula}`);
    console.log("RUTA USADA", `${this.apiUrl}/cedula/${cedula}`);
    return this.http.get<Cliente>(`${this.apiUrl}/cedula/${cedula}`, 
      {
        headers: this.getAuthHeaders()
      }
    );
  }
  
}
