var dashboardModel = require("../models/dashboardModel");

function buscarDados(req, res) {
    Promise.all([
        dashboardModel.buscarIndicadores(),
        dashboardModel.buscarGeneroLider(),
        dashboardModel.buscarConsumoPorRegiao(),
        dashboardModel.buscarArtistaLiderPorRegiao(),
        dashboardModel.buscarRankingGeneros()
    ])
        .then(function (resultados) {
            var indicadores = resultados[0][0] || {
                totalGeneros: 0,
                totalRegioes: 0,
                totalArtistas: 0,
                totalStreams: 0
            };

            res.status(200).json({
                indicadores: indicadores,
                generoLider: resultados[1][0] || null,
                consumoPorRegiao: resultados[2],
                artistasLideresPorRegiao: selecionarArtistasLideres(resultados[3]),
                rankingGeneros: resultados[4]
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar dados da dashboard:", erro);
            res.status(500).json({
                mensagem: "Não foi possível carregar os dados do painel principal."
            });
        });
}

function selecionarArtistasLideres(registros) {
    var artistasPorRegiao = {};

    registros.forEach(function (registro) {
        if (!artistasPorRegiao[registro.regiao]) {
            artistasPorRegiao[registro.regiao] = registro;
        }
    });

    return Object.keys(artistasPorRegiao).map(function (regiao) {
        return artistasPorRegiao[regiao];
    });
}

module.exports = {
    buscarDados
};
