import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service'; // Importa el servicio de cliente

@Component({
  selector: 'app-formulario-vehiculo',
  templateUrl: './formulario-vehiculo.component.html',
  styleUrls: ['./formulario-vehiculo.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FormularioVehiculoComponent implements OnInit {
  @Input() vehiculo: any = {
    placa: '',
    marca: '',
    modelo: '',
    anio: 0,
    color: '',
    clienteCedula: ''
  };

  @Input() visible: boolean = false;
  @Input() modoEdicion: boolean = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  clientes: any[] = [];

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.obtenerClientes().subscribe((data) => {
      this.clientes = data;
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.guardar.emit(this.vehiculo);
    }
  }

  onCancel() {
    this.cerrar.emit();
  }
}
