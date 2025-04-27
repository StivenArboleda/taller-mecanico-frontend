import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { VehiculoService } from '../../../services/vehiculo.service';
import { ClienteService } from '../../../services/cliente.service';
import { Vehiculo } from '../../../models/vehiculo.model';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-formulario-cita',
  templateUrl: './formulario-citas.component.html',
  styleUrls: ['./formulario-citas.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FormularioCitaComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() modoEdicion: boolean = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  constructor(
    private vehiculoService: VehiculoService,
    private clienteService: ClienteService
  ) {}

  cita: any = {
    fechaCita: '',
    motivo: '',
    vehiculoPlaca: '',
    clienteCedula: '',
    clienteNombre: '',
    estado: 'Pendiente'
  };

  vehiculos: Vehiculo[] = [];  
  clientes: Cliente[] = []; 
  clienteEncontrado: any = null;
  vehiculoEncontrado: Vehiculo | null = null;


  ngOnInit(): void {
    this.cargarVehiculos();
    this.cargarClientes(); 
  }

  cargarVehiculos(): void {
    this.vehiculoService.obtenerVehiculos().subscribe((data) => {
      this.vehiculos = data;
    });
  }

  cargarClientes(): void {
    this.clienteService.obtenerClientes().subscribe((data) => {
      this.clientes = data;
    });
  }


  onVehiculoSeleccionado(): void {
    const vehiculo = this.vehiculos.find(v => v.placa === this.cita.vehiculoPlaca);
    if (vehiculo) {
      this.vehiculoEncontrado = vehiculo;
  
      const cliente = this.clientes.find(c => c.cedula === vehiculo.clienteCedula);
      if (cliente) {
        this.cita.clienteCedula = cliente.cedula;
        this.cita.clienteNombre = `${cliente.nombre} ${cliente.apellido}`;

        console.log('CEDULA DEL CLIENTE:', cliente.cedula )
        this.clienteEncontrado = cliente;
      } else {
        this.cita.clienteCedula = '';
        this.cita.clienteNombre = '';
        this.clienteEncontrado = null;
      }
    }
  }
  

  onSubmit(form: NgForm) {
    if (form.valid) {

      const citaEnviada = {
        fechaCita: this.cita.fechaCita,
        motivo: this.cita.motivo,
        estado: this.cita.estado,
        clienteCedula: this.cita.clienteCedula,  
        vehiculoPlaca: this.cita.vehiculoPlaca
      };
  
      console.log('Cita enviada:', citaEnviada); 
  
      this.guardar.emit(citaEnviada);
    } else {
      alert('Por favor completa todos los campos correctamente.');
    }
  }

  onCancel() {
    this.cerrar.emit();
  }
}
