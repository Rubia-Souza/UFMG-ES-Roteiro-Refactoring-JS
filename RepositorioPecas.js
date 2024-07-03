const { readFileSync } = require('fs');

module.exports = class RepositorioPecas {
    constructor() {
        this.pecas = JSON.parse(readFileSync('./pecas.json'));
    }

    getPeca(apresentacao) {
        return this.pecas[apresentacao.id];
    }
}
