var regiaoModel = require("../models/regiaoModel");

function buscarRegioes(req, res) {
    regiaoModel.buscarRegioes()
        .then(function (regioes) {
            res.status(200).json(regioes);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar regiões:", erro);
            res.status(500).json({ mensagem: "Não foi possível carregar as regiões." });
        });
}

function buscarDados(req, res) {
    var nomeRegiao = Number(req.params.id);

    if (!Number.isInteger(nomeRegiao) || nomeRegiao <= 0) {
        return res.status(400).json({ mensagem: "Região inválida." });
    }

    Promise.all([
        regiaoModel.buscarResumo(nomeRegiao),
        regiaoModel.buscarGeneros(nomeRegiao),
        regiaoModel.buscarArtistas(nomeRegiao)
    ])
        .then(function (resultados) {
            if (!resultados[0].length) {
                return res.status(404).json({ mensagem: "Região não encontrada." });
            }

            var resumo = resultados[0][0];
            var totalStreams = Number(resumo.totalStreams) || 0;
            var quantidadeRegistros = Number(resumo.quantidadeRegistros) || 0;

            res.status(200).json({
                resumo: {
                    regiao: resumo.regiao,
                    totalStreams: totalStreams,
                    quantidadeRegistros: quantidadeRegistros,
                    totalGeneros: Number(resumo.totalGeneros) || 0,
                    totalArtistas: Number(resumo.totalArtistas) || 0,
                    mediaStreams: quantidadeRegistros
                        ? Math.round(totalStreams / quantidadeRegistros)
                        : 0
                },
                generos: resultados[1],
                artistas: resultados[2]
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar dados da região:", erro);
            res.status(500).json({ mensagem: "Não foi possível carregar os dados da região." });
        });
}

module.exports = { buscarRegioes, buscarDados };