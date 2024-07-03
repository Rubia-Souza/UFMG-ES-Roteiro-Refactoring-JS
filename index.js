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

function getPeca(pecas, apresentacao) {
  return pecas[apresentacao.id];
}

class ServicoCalculoFatura {
  calcularCredito(pecas, apresentacao) {
    let creditos = 0;
  
    // créditos para próximas contratações
    creditos += Math.max(apresentacao.audiencia - 30, 0);
    if(getPeca(pecas, apresentacao).tipo === 'comedia') {
      creditos += Math.floor(apresentacao.audiencia / 5);
    }
  
    return creditos;
  }
  
  calcularTotalApresentacao(pecas, apresentacao) {
    let total = 0;
  
    switch(getPeca(pecas, apresentacao).tipo) {
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
        throw new Error(`Peça desconhecia: ${getPeca(pecas, apresentacao).tipo}`);
      }
    }
  
    return total;
  }
  
  calcularTotalFatura(pecas, apresentacoes) {
    let totalFatura = 0;
    for(let apresentacao of apresentacoes) {
      totalFatura += this.calcularTotalApresentacao(pecas, apresentacao);
    };
  
    return totalFatura;
  }
  
  calcularTotalCreditos(pecas, apresentacoes) {
    let totalCreditos = 0;
    for(let apresentacao of apresentacoes) {
      totalCreditos += this.calcularCredito(pecas, apresentacao);
    }
  
    return totalCreditos;
  }
};

function gerarFaturaStr(pecas, fatura, servicoCalculoFatura) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for(let apresentacao of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(pecas, apresentacao).nome}: ${formatarMoeda(servicoCalculoFatura.calcularTotalApresentacao(pecas, apresentacao))} (${apresentacao.audiencia} assentos)\n`;
  }

  faturaStr += `Valor total: ${formatarMoeda(servicoCalculoFatura.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${servicoCalculoFatura.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
  
  return faturaStr;
}

function gerarFaturaHTML(pecas, fatura, servicoCalculoFatura) {
  let faturaHtml = '<html>\n';
  faturaHtml += `<p> Fatura ${fatura.cliente} </p>\n`;
  
  faturaHtml += '<ul>\n';
  for(let apresentacao of fatura.apresentacoes) {
    faturaHtml += `<li>  ${getPeca(pecas, apresentacao).nome}: ${formatarMoeda(servicoCalculoFatura.calcularTotalApresentacao(pecas, apresentacao))} (${apresentacao.audiencia} assentos) </li>\n`;
  }
  faturaHtml += '</ul>\n';

  faturaHtml += `<p> Valor total: ${formatarMoeda(servicoCalculoFatura.calcularTotalFatura(pecas, fatura.apresentacoes))} </p>\n`;
  faturaHtml += `<p> Créditos acumulados: ${servicoCalculoFatura.calcularTotalCreditos(pecas, fatura.apresentacoes)} </p>\n`;
  
  faturaHtml += '</html>\n';
  return faturaHtml;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

const servicoCalculoFatura = new ServicoCalculoFatura();

const faturaStr = gerarFaturaStr(pecas, faturas, servicoCalculoFatura);
console.log(faturaStr);

/*
const faturaHtml = gerarFaturaHTML(pecas, faturas, servicoCalculoFatura);
console.log(faturaHtml); */
