import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormularioVehiculoComponent } from './formulario-vehiculo/formulario-vehiculo.component';
import { ModalVehiculoInfoComponent } from './modal-vehiculo-info/modal-vehiculo-info.component'; 
import { VehiculoService } from './../../services/vehiculo.service';
import { ClienteService } from '../../services/cliente.service';
import { Vehiculo } from '../../models/vehiculo.model';
import { Cliente } from '../../models/cliente.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule, FormularioVehiculoComponent, ModalVehiculoInfoComponent],
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {

  mostrarFormulario: boolean = false;
  vehiculoEditando: Vehiculo | null = null;
  modoEdicion: boolean = false;

  vehiculos: Vehiculo[] = [];
  vehiculoInfo: Vehiculo | null = null; 
  vehiculosFiltrados: Vehiculo[] = [];

  clienteEditando: Cliente | null = null;

  clientes: Cliente[] = [];
  cliente: Cliente | null = null;
  clientesFiltrados: Cliente[] = [];
  clienteInfo: Cliente | null = null;
  mostrarModalVehiculoInfo: boolean = false;

  filtro: string = '';

  constructor(private vehiculoService: VehiculoService, private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.obtenerVehiculos();
  }

  obtenerVehiculos(): void {
    this.vehiculoService.obtenerVehiculos().subscribe((data) => {
      this.vehiculos = data;
      this.vehiculosFiltrados = [...data];
    });
  }

  abrirFormulario(): void {
    this.modoEdicion = false;
    this.vehiculoEditando = {
      placa: '',
      marca: '',
      modelo: '',
      anio: 0,
      color: '',
      clienteCedula: ''
    };
    this.mostrarFormulario = true;
  }

  editarVehiculo(vehiculo: Vehiculo): void {
    this.modoEdicion = true;
    this.vehiculoEditando = { ...vehiculo };
    this.mostrarFormulario = true;
  }

  guardarVehiculo(vehiculo: Vehiculo): void {
    if (this.modoEdicion) {
      this.vehiculoService.actualizarVehiculo(vehiculo).subscribe({
        next: (actualizado) => {
          const index = this.vehiculos.findIndex(v => v.placa === actualizado.placa);
          if (index > -1) {
            this.vehiculos[index] = actualizado; 
          }
          this.buscarVehiculo(); 
          this.mostrarFormulario = false;
          Swal.fire('Actualizado', 'El vehículo fue actualizado correctamente.', 'success');
        },
        error: (error) => {
          Swal.fire('Error al actualizar', error?.error.message || 'Ocurrió un error inesperado', 'error');
        }
      });
    } else {
      this.vehiculoService.registrarVehiculo(vehiculo).subscribe({
        next: (nuevo) => {
          this.vehiculos.push(nuevo);
          this.buscarVehiculo();
          this.mostrarFormulario = false;
          Swal.fire('Registrado', 'El vehículo fue registrado exitosamente.', 'success');
        },
        error: (error) => {
          Swal.fire('Error al registrar', error?.error.message || 'Ocurrió un error inesperado', 'error');
        }
      });
    }
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  buscarVehiculo(): void {
    const term = this.filtro.toLowerCase();
    this.vehiculosFiltrados = this.vehiculos.filter(vehiculo =>
      vehiculo.placa.includes(term) ||
      vehiculo.marca.toLowerCase().includes(term)
    );
  }

  eliminarVehiculo(vehiculo: Vehiculo): void {
    Swal.fire({
      title: `¿Eliminar el vehículo con placa ${vehiculo.placa}?`,
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && vehiculo.placa) {
        this.vehiculoService.eliminarVehiculo(vehiculo.placa).subscribe({
          next: () => {
            this.vehiculos = this.vehiculos.filter(v => v.placa !== vehiculo.placa);
            this.buscarVehiculo();
            Swal.fire('Eliminado', `El vehículo con placa ${vehiculo.placa} ha sido eliminado.`, 'success');
          },
          error: (error) => {
            Swal.fire('Error al eliminar', error?.error.message || 'No se pudo eliminar el vehículo. Intenta de nuevo.', 'error');
          }
        });
      }
    });
  }

  verInfoVehiculo(vehiculo: Vehiculo): void {
    this.vehiculoInfo = vehiculo;
    this.mostrarModalVehiculoInfo = true;
    this.buscarCliente(vehiculo.clienteCedula);  
    console.log('Cliente:', this.cliente); 
  }
  
  buscarCliente(cedula: string): void {
    this.clienteService.obtenerClientePorCedula(cedula).subscribe({
      next: (cliente) => {
        console.log('Cliente encontrado:', cliente);
        this.cliente = cliente;
      },
      error: (err) => {
        console.error('Error al obtener cliente:', err);
      }
    });
  }

  cerrarModalVehiculoInfo(): void {
    this.mostrarModalVehiculoInfo = false;
  }

}
