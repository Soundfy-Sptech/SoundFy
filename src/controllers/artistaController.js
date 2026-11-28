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
        artistaModel.buscarGeneros(idArtista)
    ])
        .then(function (resultados) {
            if (!resultados[0].length) {
                return res.status(404).json({ mensagem: "Artista não encontrado." });
            }

            res.status(200).json({
                artista: resultados[0][0],
                generos: resultados[1]
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar perfil do artista:", erro);
            res.status(500).json({
                mensagem: "Não foi possível carregar o perfil do artista."
            });
        });
}

function comparar(req, res) {
    const artistaA = Number(req.query.artistaA);
    const artistaB = Number(req.query.artistaB);
    if (!Number.isInteger(artistaA) || artistaA <= 0 || !Number.isInteger(artistaB) || artistaB <= 0 || artistaA === artistaB) {
        return res.status(400).json({ mensagem: "Selecione dois artistas diferentes." });
    }

    artistaModel.compararArtistas(artistaA, artistaB)
        .then(function (artistas) {
            if (artistas.length !== 2) {
                return res.status(404).json({ mensagem: "Um ou mais artistas não foram encontrados." });
            }
            const porId = new Map(artistas.map(artista => [Number(artista.idArtista), artista]));
            return res.status(200).json({
                artistaA: porId.get(artistaA),
                artistaB: porId.get(artistaB)
            });
        })
        .catch(function (erro) {
            console.error("Erro ao comparar artistas:", erro);
            res.status(500).json({ mensagem: "Não foi possível comparar os artistas." });
        });
}

module.exports = { buscarTodos, buscarDados, comparar };