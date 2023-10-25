import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DadosService } from '../dados.service';
import { Dados } from '../dados';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  dado: Dados = {modeloCarro: '', marcaCarro: '', anoCarro: '', aluno: '', matriculaAluno: '', codigoEtiqueta: '', CNHvalida: '', placaCarro: ''};

  constructor(
    private activaRoute: ActivatedRoute,
    private dadosServico: DadosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activaRoute.paramMap.subscribe({
      next: (rota: any) => {
        this.dado.matriculaAluno = rota.params.matricula;
        console.log(this.dado.matriculaAluno)
        this.dadosServico.getDadosporMatricula(this.dado.matriculaAluno).subscribe({
          next: (retorno: any) => {
            this.dado.modeloCarro = retorno[0].Modelo;
            this.dado.marcaCarro = retorno[0].Marca;
            this.dado.placaCarro = retorno[0].Placa;
            this.dado.anoCarro = retorno[0].Ano;
            this.dado.aluno = retorno[0].Aluno;
            this.dado.codigoEtiqueta = retorno[0].codigoEtiqueta;
            this.dado.CNHvalida = retorno[0].CNHvalida;
            if (this.dado.CNHvalida = 1) {
              this.dado.CNHvalida = true
            } else {
              this.dado.CNHvalida = false
            }
          },
          
          error: (erro: any) => console.log(erro)
        });
      },
    });
  }

  editarDados() {
    this.dadosServico.editarDados(this.dado).subscribe({
      error: (erro: any) => console.log(erro)
    });
    this.router.navigate(['/lista']);
  }  
}
