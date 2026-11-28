var relatorioModel = require("../models/relatorioModel");

var TIPOS_RELATORIO = {
    artistas: relatorioModel.buscarArtistas,
    generos: relatorioModel.buscarGeneros,
    cidades: relatorioModel.buscarCidades,
    resumo: relatorioModel.buscarResumoRegioes
};

function buscarIndicadores(req, res) {
    relatorioModel.buscarIndicadores()
        .then(function (resultado) {
            res.status(200).json(resultado[0] || {
                pontuacaoTotal: 0,
                registrosAnalisados: 0,
                cidadesCobertas: 0,
                musicasMapeadas: 0
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar indicadores dos relatórios:", erro);
            res.status(500).json({ mensagem: "Não foi possível carregar os indicadores dos relatórios." });
        });
}

function buscarRegioes(req, res) {
    relatorioModel.buscarRegioes()
        .then(function (regioes) {
            res.status(200).json(regioes);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar regiões dos relatórios:", erro);
            res.status(500).json({ mensagem: "Não foi possível carregar as regiões." });
        });
}

function buscarDados(req, res) {
    var tipo = String(req.query.tipo || "artistas").toLowerCase();
    var regiao = String(req.query.regiao || "").trim();

    if (!Object.prototype.hasOwnProperty.call(TIPOS_RELATORIO, tipo)) {
        return res.status(400).json({ mensagem: "Tipo de relatório inválido." });
    }

    if (regiao.length > 45) {
        return res.status(400).json({ mensagem: "Região inválida." });
    }

    TIPOS_RELATORIO[tipo](regiao || null)
        .then(function (registros) {
            res.status(200).json({
                tipo: tipo,
                regiao: regiao || "todas",
                total: registros.length,
                registros: registros
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar relatório:", erro);
            res.status(500).json({ mensagem: "Não foi possível carregar os dados do relatório." });
        });
}

module.exports = { buscarIndicadores, buscarRegioes, buscarDados };
