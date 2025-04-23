import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-formulario-cliente',
  templateUrl: './formulario-cliente.component.html',
  styleUrls: ['./formulario-cliente.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FormularioClienteComponent {
  @Input() cliente: any = {
    id: null,
    cedula: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaRegistro: ''
  };

  @Input() visible: boolean = false;
  @Input() modoEdicion: boolean = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.guardar.emit(this.cliente);
    }
  }

  onCancel() {
    this.cerrar.emit();
  }
}
