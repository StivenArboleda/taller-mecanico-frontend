import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { VehiculoService } from '../../services/vehiculo.service';
import { CitaService } from '../../services/cita-service.service';
import { Cita } from '../../models/cita.model';
import { Chart } from 'chart.js/auto';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  clientesCount = 0;
  vehiculosCount = 0;
  citasHoyCount = 0;
  visitasCompletadasCount = 0;

  citasPorEstado: { estado: string, count: number }[] = [];
  citasPorMes: { mes: string, count: number }[] = [];
  vehiculosPorMarca: { marca: string, count: number }[] = [];

  private destroy$ = new Subject<void>();
  private charts: Record<string, Chart | null> = {
    bar: null,
    line: null,
    pie: null
  };

  constructor(
    private clienteService: ClienteService,
    private vehiculoService: VehiculoService,
    private citaService: CitaService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroyAllCharts();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    forkJoin({
      clientes: this.clienteService.obtenerClientes(),
      vehiculos: this.vehiculoService.obtenerVehiculos(),
      citas: this.citaService.obtenerCitas()
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe(({ clientes, vehiculos, citas }) => {
      this.setCounts(clientes.length, vehiculos.length, citas);
      this.processVehiculos(vehiculos);
      this.processCitas(citas);
      this.renderCharts();
    }, error => console.error('Error cargando datos del dashboard', error));
  }

  private setCounts(clientes: number, vehiculos: number, citas: Cita[]): void {
    this.clientesCount = clientes;
    this.vehiculosCount = vehiculos;
    this.citasHoyCount = citas.filter(c => this.isToday(new Date(c.fechaCita))).length;
    this.visitasCompletadasCount = citas.filter(c => c.estado.toUpperCase() === 'COMPLETADA').length;
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  private processVehiculos(vehiculos: any[]): void {
    const marcaCount: { [key: string]: number } = {}; 
    vehiculos.forEach(v => {
      marcaCount[v.marca] = (marcaCount[v.marca] || 0) + 1; 
    });
    this.vehiculosPorMarca = Object.entries(marcaCount).map(([marca, count]) => ({
      marca,
      count: count as number 
    }));
  }

  private processCitas(citas: Cita[]): void {
    const estados = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'];

    this.citasPorEstado = estados.map(estado => ({
      estado,
      count: citas.filter(c => c.estado.toUpperCase() === estado).length
    }));

    const meses = citas.reduce((acc, cita) => {
      const mes = new Date(cita.fechaCita).toLocaleString('default', { month: 'long' });
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.citasPorMes = Object.entries(meses).map(([mes, count]) => ({ mes, count }));
  }

  private renderCharts(): void {
    this.destroyAllCharts();

    this.createBarChart();
    this.createLineChart();
    this.createPieChart();
  }

  private createBarChart(): void {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.charts['bar'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.citasPorEstado.map(e => e.estado),
        datasets: [{
          label: 'Número de Citas',
          data: this.citasPorEstado.map(e => e.count),
          backgroundColor: this.citasPorEstado.map(e => this.getColorByStatus(e.estado).primary),
          borderColor: this.citasPorEstado.map(e => this.getColorByStatus(e.estado).primary),
          borderWidth: 1,
          borderRadius: 5, // Bordes redondeados
          hoverBackgroundColor: this.citasPorEstado.map(e => this.getColorByStatus(e.estado).secondary)
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  private createLineChart(): void {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.charts['line'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.citasPorMes.map(e => e.mes),
        datasets: [{
          label: 'Citas Programadas',
          data: this.citasPorMes.map(e => e.count),
          fill: true,
          backgroundColor: 'rgba(24, 119, 124, 0.2)',
          borderColor: '#18777C',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
      }
    });
  }

  private createPieChart(): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.charts['pie'] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.vehiculosPorMarca.map(e => e.marca),
        datasets: [{
          label: 'Distribución de Vehículos',
          data: this.vehiculosPorMarca.map(e => e.count),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5722', '#81C784', '#BA68C8'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  private destroyAllCharts(): void {
    Object.keys(this.charts).forEach(key => {
      const chart = this.charts[key];
      if (chart) {
        chart.destroy();
        this.charts[key] = null;
      }
    });
  }

  private getColorByStatus(status: string): { primary: string, secondary: string } {
    const colorMap: { [key: string]: { primary: string, secondary: string } } = {
      'PENDIENTE': { primary: 'orange', secondary: '#ffcc80' },
      'CONFIRMADA': { primary: 'green', secondary: '#a5d6a7' },
      'CANCELADA': { primary: 'red', secondary: '#ef9a9a' },
      'COMPLETADA': { primary: 'gray', secondary: '#f5f5f5' }
    };
  
    const normalizedStatus = status.toUpperCase();
  
    return colorMap[normalizedStatus] || { primary: 'gray', secondary: '#e0e0e0' };
  }
}
