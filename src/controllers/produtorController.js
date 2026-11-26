var produtorModel = require("../models/produtorModel");

function buscarDados(req, res) {
    Promise.all([
        produtorModel.buscarIndicadores(),
        produtorModel.buscarArtistas(),
        produtorModel.buscarGenerosMaisConsumidos()
    ])
        .then(function (resultados) {
            res.status(200).json({
                indicadores: resultados[0][0] || {
                    totalArtistas: 0,
                    totalGeneros: 0,
                    totalRegistros: 0,
                    regioesComDados: 0
                },
                artistas: resultados[1],
                generos: resultados[2]
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar dados do produtor:", erro);
            res.status(500).json({ mensagem: "Não foi possível carregar os dados do produtor." });
        });
}

function compararArtistas(req, res) {
    var artistaA = Number(req.query.artistaA);
    var artistaB = Number(req.query.artistaB);

    if (
        !Number.isInteger(artistaA) || artistaA <= 0 ||
        !Number.isInteger(artistaB) || artistaB <= 0 ||
        artistaA === artistaB
    ) {
        return res.status(400).json({
            mensagem: "Selecione dois artistas diferentes."
        });
    }

    produtorModel.compararArtistas(artistaA, artistaB)
        .then(function (registros) {
            res.status(200).json(registros);
        })
        .catch(function (erro) {
            console.error("Erro ao comparar artistas:", erro);
            res.status(500).json({
                mensagem: "Não foi possível comparar os artistas."
            });
        });
}

module.exports = { buscarDados, compararArtistas };