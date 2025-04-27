import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges  } from '@angular/core';
import { VehiculoService } from '../../../services/vehiculo.service'; 
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-modal-vehiculo-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-vehiculo-info.component.html',
  styleUrls: ['./modal-vehiculo-info.component.scss']
})
export class ModalVehiculoInfoComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() vehiculo: any = null;
  @Input() cliente: any = null;
  @Output() cerrar = new EventEmitter<void>();

  historialVehiculo: any[] = [];

  constructor(private vehiculoService: VehiculoService, private clienteService: ClienteService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehiculo'] && this.vehiculo) {
      //this.obtenerHistorial();
    }
    if (changes['cliente'] && this.cliente) {
      console.log('Cliente recibido:', this.cliente);  
    }
  }

  obtenerHistorial(): void {
    if (this.vehiculo && this.vehiculo.placa) {
      console.log('Obteniendo historial para placa:', this.vehiculo.placa);
      this.vehiculoService.obtenerHistorialVehiculo(this.vehiculo.placa).subscribe((data: any[]) => {
        this.historialVehiculo = data;
        console.log('Historial de mantenimiento:', this.historialVehiculo);
      });
    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }
}
