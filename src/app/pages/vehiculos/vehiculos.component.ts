import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent {
  filtro: string = '';
  vehiculos = [
    { placa: 'ABC123', marca: 'Toyota', modelo: 'Corolla', anio: 2018, color: 'Rojo', clienteNombre: 'Juan Pérez' },
    { placa: 'XYZ789', marca: 'Chevrolet', modelo: 'Spark', anio: 2020, color: 'Azul', clienteNombre: 'Laura Gómez' },
    { placa: 'LMN456', marca: 'Mazda', modelo: '3', anio: 2021, color: 'Negro', clienteNombre: 'Carlos Ramos' }
  ];

  vehiculosFiltrados = [...this.vehiculos];

  buscarVehiculo() {
    const term = this.filtro.toLowerCase();
    this.vehiculosFiltrados = this.vehiculos.filter(vehiculo =>
      vehiculo.placa.toLowerCase().includes(term) ||
      vehiculo.clienteNombre.toLowerCase().includes(term)
    );
  }

  abrirFormulario() {
    alert('Abrir formulario de creación de vehículo (pendiente)');
  }

  editarVehiculo(vehiculo: any) {
    alert(`Editar vehículo ${vehiculo.placa} (pendiente)`);
  }

  eliminarVehiculo(vehiculo: any) {
    if (confirm(`¿Eliminar el vehículo con placa ${vehiculo.placa}?`)) {
      this.vehiculos = this.vehiculos.filter(v => v !== vehiculo);
      this.buscarVehiculo();
    }
  }
}
