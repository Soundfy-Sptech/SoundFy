var artistaModel = require("../models/artistaModel");

function buscarTodos(req, res) {
    artistaModel.buscarTodos()
        .then(function (artistas) {
            res.status(200).json(artistas);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar artistas:", erro);
            res.status(500).json({
                mensagem: "Não foi possível carregar os artistas."
            });
        });
}

function buscarDados(req, res) {
    var idArtista = Number(req.params.id);

    if (!Number.isInteger(idArtista) || idArtista <= 0) {
        return res.status(400).json({ mensagem: "Artista inválido." });
    }

    Promise.all([
        artistaModel.buscarPorId(idArtista),
        artistaModel.buscarGeneros(idArtista),
        artistaModel.buscarConsumoPorRegiao(idArtista)
    ])
        .then(function (resultados) {
            if (!resultados[0].length) {
                return res.status(404).json({
                    mensagem: "Artista não encontrado."
                });
            }

            res.status(200).json({
                artista: resultados[0][0],
                generos: resultados[1],
                consumoPorRegiao: resultados[2]
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar perfil do artista:", erro);
            res.status(500).json({
                mensagem: "Não foi possível carregar o perfil do artista."
            });
        });
}

module.exports = { buscarTodos, buscarDados };