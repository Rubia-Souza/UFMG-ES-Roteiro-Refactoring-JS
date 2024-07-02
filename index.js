const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
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

  function calcularCredito(apresentacao) {
    let creditos = 0;

    // créditos para próximas contratações
    creditos += Math.max(apresentacao.audiencia - 30, 0);
    if(getPeca(apresentacao).tipo === 'comedia') {
      creditos += Math.floor(apresentacao.audiencia / 5);
    }

    return creditos;
  };

  function getPeca(apresentacao) {
    return pecas[apresentacao.id];
  }

  function calcularTotalApresentacao(apresentacao) {
    let total = 0;
  
    switch(getPeca(apresentacao).tipo) {
      case ('tragedia'): {
        total = 40000;
        if (apresentacao.audiencia > 30) {
          total += 1000 * (apresentacao.audiencia - 30);
        }
        
        break;
      }
      case ('comedia'): {
        total = 30000;
        if (apresentacao.audiencia > 20) {
          total += 10000 + 500 * (apresentacao.audiencia - 20);
        }
        total += 300 * apresentacao.audiencia;
  
        break;
      }
      default: {
        throw new Error(`Peça desconhecia: ${getPeca(apresentacao).tipo}`);
      }
    }
  
    return total;
  };

  let totalFatura = 0;
  let creditos = 0;
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  for(let apre of fatura.apresentacoes) {
    let total = calcularTotalApresentacao(apre);
    creditos += calcularCredito(apre);

    // mais uma linha da fatura
    faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
    totalFatura += total;
  }

  faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
  faturaStr += `Créditos acumulados: ${creditos} \n`;
  
  return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
