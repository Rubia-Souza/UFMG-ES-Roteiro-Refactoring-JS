module.exports = class ServicoCalculoFatura {
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
