import { Component, Inject, OnInit } from '@angular/core';
import { DadosService } from '../dados.service';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  dadosFormulario: any[] = [];
  dadoSelecionado?: any;
  placaPesquisada: string = '';
  private placasPesquisadas = new Subject<string>();
  dadosCopia: any[] = [];

  constructor(private dadosService: DadosService, private router: Router) {
    this.placasPesquisadas.pipe(debounceTime(600)).subscribe(() => this.filtrarPlacas());
  }


  ngOnInit(): void {
    this.onListar();
  }

  onListar(): void {
    this.dadosService.getDados().subscribe({
      next: (resultado: any) => { (this.dadosFormulario = resultado), console.log(resultado) },
      error: (erro: any) => console.log(erro),
      complete: () => console.log('completo')
    });
    this.dadosService.getDados().subscribe({
      next: (resultado: any) => { (this.dadosCopia = resultado), console.log(resultado) },
      error: (erro: any) => console.log(erro),
      complete: () => console.log('completo')
    });
  }

  deletarDados(matricula: number): void {
    this.dadosService.deletarDados(matricula).subscribe({})
  }

  cadastrar(): void {
    this.router.navigate(['/forms']);
  }

  mqtt(): void {
    this.router.navigate(['/mqtt']);
  }

  editarDados(matricula: any) {
    this.router.navigate([`/editar/${matricula}`]);
  }

  filtrarPlacas() {
    if (this.placaPesquisada) {
      this.placaPesquisada = this.placaPesquisada.toUpperCase();

      this.dadosFormulario = this.dadosFormulario.filter((dados) => {
        return dados.Placa.toUpperCase().includes(this.placaPesquisada.toUpperCase());
      });
    } else {
      this.dadosFormulario = [...this.dadosCopia];
    }
  }

  onSearchInput() {
    this.placasPesquisadas.next(this.placaPesquisada);
  }
}
