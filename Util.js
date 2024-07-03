module.exports = function formatarMoeda(valor) {
    const formato = new Intl.NumberFormat('pt-BR',
      { 
        style: 'currency', 
        currency: 'BRL',
        minimumFractionDigits: 2 
      }
    ).format;
  
    return formato(valor / 100);
};
