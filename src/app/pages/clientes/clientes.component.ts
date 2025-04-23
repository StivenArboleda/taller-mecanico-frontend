import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormularioClienteComponent } from './formulario-cliente/formulario-cliente.component';
import { ClienteService } from './../../services/cliente.service';
import { Cliente } from './../../models/cliente.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, FormularioClienteComponent],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  mostrarFormulario: boolean = false;
  clienteEditando: Cliente | null = null;
  modoEdicion: boolean = false;

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];

  filtro: string = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.clienteService.obtenerClientes().subscribe((data) => {
      this.clientes = data;
      this.clientesFiltrados = [...data];
    });
  }

  abrirFormulario(): void {
    this.modoEdicion = false;
    this.clienteEditando = {
      id: undefined,
      cedula: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      fechaRegistro: ''
    };
    this.mostrarFormulario = true;
  }

  editarCliente(cliente: Cliente): void {
    this.modoEdicion = true;
    this.clienteEditando = { ...cliente };
    this.mostrarFormulario = true;
  }

  guardarCliente(cliente: Cliente): void {
    const index = this.clientes.findIndex(c => c.cedula === cliente.cedula);
  
    if (index > -1 && cliente.id) {
      this.clienteService.actualizarCliente(cliente).subscribe({
        next: (actualizado) => {
          this.clientes[index] = actualizado;
          this.buscarCliente();
          this.mostrarFormulario = false;
          Swal.fire('Actualizado', 'El cliente fue actualizado correctamente.', 'success');
        },
        error: (error) => {
          Swal.fire('Error al actualizar', error?.error.message || 'Ocurrió un error inesperado', 'error');
        }
      });
    } else {
      this.clienteService.registrarCliente(cliente).subscribe({
        next: (nuevo) => {
          this.clientes.push(nuevo);
          this.buscarCliente();
          this.mostrarFormulario = false;
          Swal.fire('Registrado', 'El cliente fue registrado exitosamente.', 'success');
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

  buscarCliente(): void {
    const term = this.filtro.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.cedula.includes(term) ||
      cliente.nombre.toLowerCase().includes(term) ||
      cliente.apellido.toLowerCase().includes(term)
    );
  }

  eliminarCliente(cliente: Cliente): void {
    Swal.fire({
      title: `¿Eliminar a ${cliente.nombre} ${cliente.apellido}?`,
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && cliente.cedula) {
        this.clienteService.eliminarCliente(cliente.cedula).subscribe({
          next: () => {
            this.clientes = this.clientes.filter(c => c.cedula !== cliente.cedula);
            this.buscarCliente();
            Swal.fire('Eliminado', `${cliente.nombre} ha sido eliminado.`, 'success');
          },
          error: (error) => {
            Swal.fire('Error al eliminar', error?.error.message || 'No se pudo eliminar al cliente. Intenta de nuevo.', 'error');
          }
        });
      }
    });
  }
  
  
}
