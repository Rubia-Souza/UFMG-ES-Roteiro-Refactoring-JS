const { readFileSync } = require('fs');

const RepositorioPecas = require('./RepositorioPecas.js');
const ServicoCalculoFatura = require('./ServicoCalculoFatura.js');
const gerarFaturaStr = require('./Apresentacao.js');
//const gerarFaturaHTML = require('./Apresentacao.js');

const faturas = JSON.parse(readFileSync('./faturas.json'));

const repositorioPecas = new RepositorioPecas();
const servicoCalculoFatura = new ServicoCalculoFatura(repositorioPecas);

const faturaStr = gerarFaturaStr(faturas, servicoCalculoFatura);
console.log(faturaStr);

/*
const faturaHtml = gerarFaturaHTML(faturas, servicoCalculoFatura);
console.log(faturaHtml);*/
