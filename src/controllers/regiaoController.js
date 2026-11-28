var regiaoModel = require("../models/regiaoModel");

// Quantidade de artistas exibidos no ranking regional (5 páginas de 10 no front-end).
var LIMITE_RANKING_ARTISTAS = 50;

function percentual(parte, total) {
    if (!total) return 0;
    return Math.round((parte / total) * 1000) / 10;
}

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
        regiaoModel.buscarArtistas(nomeRegiao, LIMITE_RANKING_ARTISTAS),
        regiaoModel.buscarTotalStreamsArtistas(nomeRegiao),
        regiaoModel.buscarTotaisPorRegiao()
    ])
        .then(function (resultados) {
            if (!resultados[0].length) {
                return res.status(404).json({ mensagem: "Região não encontrada." });
            }

            var resumo = resultados[0][0];
            var totalStreams = Number(resumo.totalStreams) || 0;
            var quantidadeRegistros = Number(resumo.quantidadeRegistros) || 0;

            var totalArtistas = Number(resumo.totalArtistas) || 0;
            var artistas = resultados[2];
            var totalStreamsArtistas = Number(resultados[3][0] && resultados[3][0].totalStreams) || 0;

            // Participação do artista líder e do Top 50 sobre o total de TODOS os artistas da região.
            var streamsTop50 = artistas.reduce(function (soma, item) {
                return soma + (Number(item.totalStreams) || 0);
            }, 0);
            var lider = artistas[0] || null;

            // Posição e peso da região no total nacional (mesma base do resumo).
            var totaisRegioes = resultados[4].map(function (item) {
                return { idRegiao: item.idRegiao, totalStreams: Number(item.totalStreams) || 0 };
            });
            var totalNacional = totaisRegioes.reduce(function (soma, item) {
                return soma + item.totalStreams;
            }, 0);
            var posicaoRegiao = totaisRegioes.filter(function (item) {
                return item.totalStreams > totalStreams;
            }).length + 1;

            res.status(200).json({
                resumo: {
                    regiao: resumo.regiao,
                    totalStreams: totalStreams,
                    quantidadeRegistros: quantidadeRegistros,
                    totalGeneros: Number(resumo.totalGeneros) || 0,
                    totalArtistas: totalArtistas,
                    mediaStreams: quantidadeRegistros
                        ? Math.round(totalStreams / quantidadeRegistros)
                        : 0
                },
                generos: resultados[1],
                // Somente o ranking é limitado; o resumo acima usa a base completa.
                artistas: artistas,
                ranking: {
                    limite: LIMITE_RANKING_ARTISTAS,
                    exibidos: artistas.length,
                    totalArtistas: totalArtistas,
                    participacaoTop: percentual(streamsTop50, totalStreamsArtistas)
                },
                destaques: {
                    artistaLider: lider ? {
                        nome: lider.artista,
                        totalStreams: Number(lider.totalStreams) || 0,
                        participacao: percentual(Number(lider.totalStreams) || 0, totalStreamsArtistas)
                    } : null,
                    cenarioNacional: {
                        participacao: percentual(totalStreams, totalNacional),
                        posicao: posicaoRegiao,
                        totalRegioes: totaisRegioes.length
                    }
                }
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar dados da região:", erro);
            res.status(500).json({ mensagem: "Não foi possível carregar os dados da região." });
        });
}

module.exports = { buscarRegioes, buscarDados };