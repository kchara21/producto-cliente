import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelService } from '../../core/services/excel.service';
import { MsalService } from '@azure/msal-angular';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

type DataRow = Record<string, unknown>;

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
})
export class Productos implements AfterViewInit {
  private excelSrv = inject(ExcelService);
  private msal = inject(MsalService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  datos: DataRow[] = [];
  dataSource = new MatTableDataSource<DataRow>([]);
  columnas: string[] = [];

  filtroGlobal = '';
  cargando = false;
  error: string | null = null;

  // paginación Material
  pageSize = 100;
  pageSizeOptions = [50, 100, 200, 500];

  totalRegistros = 0;
  totalFiltrados = 0;

  private filtroTimeout: any = null;

  constructor() {
    this.configurarFiltroGlobal();
  }

  async ngOnInit() {
    this.cargando = true;
    this.error = null;

    try {
      console.time('[Productos] cargaDatos');
      const data = await this.excelSrv.leerDatos();
      this.datos = data;
      this.totalRegistros = data.length;

      if (data.length > 0) {
        this.columnas = Object.keys(data[0]);
      }

      this.dataSource.data = data;
      this.actualizarTotales();

      console.log('[Productos] registros cargados:', this.totalRegistros);
      console.timeEnd('[Productos] cargaDatos');
    } catch (e: any) {
      console.error('[Productos] Error al cargar datos:', e);
      this.error = e?.message ?? 'Error al cargar datos';
    } finally {
      this.cargando = false;
    }
  }

  ngAfterViewInit() {
    // conectar paginator cuando ya exista en el DOM
    this.dataSource.paginator = this.paginator;
  }

  // 🧹 filtro global con debounce
  onFiltroGlobal(valor: string) {
    this.filtroGlobal = valor;

    if (this.filtroTimeout) {
      clearTimeout(this.filtroTimeout);
    }

    this.filtroTimeout = setTimeout(() => {
      const term = this.filtroGlobal.trim().toLowerCase();
      this.dataSource.filter = term;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      this.actualizarTotales();
    }, 300);
  }

  private configurarFiltroGlobal() {
    this.dataSource.filterPredicate = (row: DataRow, filter: string): boolean => {
      const term = filter.trim().toLowerCase();
      if (!term) return true;

      return Object.values(row).some((valor) =>
        (valor ?? '').toString().toLowerCase().includes(term)
      );
    };
  }

  private actualizarTotales() {
    this.totalFiltrados = this.dataSource.filteredData.length || this.dataSource.data.length;
  }

  onLogout() {
    this.msal.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200/login',
    });
  }
}
