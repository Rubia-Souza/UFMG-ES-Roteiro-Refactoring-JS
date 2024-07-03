const formatarMoeda = require('./Util.js');

module.exports = function gerarFaturaStr(fatura, servicoCalculoFatura) {
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
