const { readFileSync } = require('fs');

function formatarMoeda(valor) {
  const formato = new Intl.NumberFormat('pt-BR',
    { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2 
    }
  ).format;

  return formato(valor / 100);
};

class ServicoCalculoFatura {
  constructor(repositorio) {
    this.repositorio = repositorio;
 }

  calcularCredito(apresentacao) {
    let creditos = 0;
  
    // créditos para próximas contratações
    creditos += Math.max(apresentacao.audiencia - 30, 0);
    if(this.repositorio.getPeca(apresentacao).tipo === 'comedia') {
      creditos += Math.floor(apresentacao.audiencia / 5);
    }
  
    return creditos;
  }
  
  calcularTotalApresentacao(apresentacao) {
    let total = 0;
  
    switch(this.repositorio.getPeca(apresentacao).tipo) {
      case('tragedia'): {
        total = 40000;
        if (apresentacao.audiencia > 30) {
          total += 1000 * (apresentacao.audiencia - 30);
        }
        
        break;
      }
      case('comedia'): {
        total = 30000;
        if (apresentacao.audiencia > 20) {
          total += 10000 + 500 * (apresentacao.audiencia - 20);
        }
        total += 300 * apresentacao.audiencia;
  
        break;
      }
      default: {
        throw new Error(`Peça desconhecia: ${this.repositorio.getPeca(apresentacao).tipo}`);
      }
    }
  
    return total;
  }
  
  calcularTotalFatura(apresentacoes) {
    let totalFatura = 0;
    for(let apresentacao of apresentacoes) {
      totalFatura += this.calcularTotalApresentacao(apresentacao);
    };
  
    return totalFatura;
  }
  
  calcularTotalCreditos(apresentacoes) {
    let totalCreditos = 0;
    for(let apresentacao of apresentacoes) {
      totalCreditos += this.calcularCredito(apresentacao);
    }
  
    return totalCreditos;
  }
};

class RepositorioPecas {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apresentacao) {
    return this.pecas[apresentacao.id];
  }
}

function gerarFaturaStr(fatura, servicoCalculoFatura) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for(let apresentacao of fatura.apresentacoes) {
    faturaStr += `  ${servicoCalculoFatura.repositorio.getPeca(apresentacao).nome}: ${formatarMoeda(servicoCalculoFatura.calcularTotalApresentacao(apresentacao))} (${apresentacao.audiencia} assentos)\n`;
  }

  faturaStr += `Valor total: ${formatarMoeda(servicoCalculoFatura.calcularTotalFatura(fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${servicoCalculoFatura.calcularTotalCreditos(fatura.apresentacoes)} \n`;
  
  return faturaStr;
}

function gerarFaturaHTML(fatura, servicoCalculoFatura) {
  let faturaHtml = '<html>\n';
  faturaHtml += `<p> Fatura ${fatura.cliente} </p>\n`;
  
  faturaHtml += '<ul>\n';
  for(let apresentacao of fatura.apresentacoes) {
    faturaHtml += `<li>  ${servicoCalculoFatura.repositorio.getPeca(apresentacao).nome}: ${formatarMoeda(servicoCalculoFatura.calcularTotalApresentacao(apresentacao))} (${apresentacao.audiencia} assentos) </li>\n`;
  }
  faturaHtml += '</ul>\n';

  faturaHtml += `<p> Valor total: ${formatarMoeda(servicoCalculoFatura.calcularTotalFatura(fatura.apresentacoes))} </p>\n`;
  faturaHtml += `<p> Créditos acumulados: ${servicoCalculoFatura.calcularTotalCreditos(fatura.apresentacoes)} </p>\n`;
  
  faturaHtml += '</html>\n';
  return faturaHtml;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));

const repositorioPecas = new RepositorioPecas();
const servicoCalculoFatura = new ServicoCalculoFatura(repositorioPecas);

const faturaStr = gerarFaturaStr(faturas, servicoCalculoFatura);
console.log(faturaStr);

/*
const faturaHtml = gerarFaturaHTML(faturas, servicoCalculoFatura);
console.log(faturaHtml);*/
