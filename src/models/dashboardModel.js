
var database = require("../database/config");

function buscarIndicadores() {
    var instrucaoSql = `
        SELECT
            (SELECT COUNT(*) FROM Genero) AS totalGeneros,
            (SELECT COUNT(*) FROM Regiao) AS totalRegioes,
            (SELECT COUNT(*) FROM Artista) AS totalArtistas,
            (SELECT COALESCE(SUM(qtd_streams), 0)
             FROM ConsumoGenero) AS totalStreams
    `;

    return database.executar(instrucaoSql);
}

function buscarGeneroLider() {
    var instrucaoSql = `
        SELECT
            g.nome AS genero,
            SUM(cg.qtd_streams) AS totalStreams
        FROM ConsumoGenero cg
        INNER JOIN Genero g ON cg.idGenero = g.idGenero
        GROUP BY g.idGenero, g.nome
        ORDER BY totalStreams DESC
        LIMIT 1
    `;

    return database.executar(instrucaoSql);
}

function buscarConsumoPorRegiao() {
    var instrucaoSql = `
        SELECT
            r.nome AS regiao,
            g.nome AS genero,
            SUM(cg.qtd_streams) AS totalStreams
        FROM ConsumoGenero cg
        INNER JOIN Regiao r ON cg.idRegiao = r.idRegiao
        INNER JOIN Genero g ON cg.idGenero = g.idGenero
        GROUP BY r.idRegiao, r.nome, g.idGenero, g.nome
        ORDER BY r.nome, totalStreams DESC
    `;

    return database.executar(instrucaoSql);
}

function buscarArtistaLiderPorRegiao() {
    var instrucaoSql = `
        SELECT
            r.nome AS regiao,
            a.nome AS artista,
            SUM(ca.qtd_streams) AS totalStreams
        FROM ConsumoArtista ca
        INNER JOIN Regiao r ON ca.idRegiao = r.idRegiao
        INNER JOIN Artista a ON ca.idArtista = a.idArtista
        GROUP BY r.idRegiao, r.nome, a.idArtista, a.nome
        ORDER BY r.nome, totalStreams DESC
    `;

    return database.executar(instrucaoSql);
}

function buscarRankingGeneros() {
    var instrucaoSql = `
        SELECT
            g.nome AS genero,
            SUM(cg.qtd_streams) AS totalStreams,
            COUNT(*) AS quantidadeRegistros
        FROM ConsumoGenero cg
        INNER JOIN Genero g ON cg.idGenero = g.idGenero
        GROUP BY g.idGenero, g.nome
        ORDER BY totalStreams DESC
        LIMIT 5
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    buscarIndicadores,
    buscarGeneroLider,
    buscarConsumoPorRegiao,
    buscarArtistaLiderPorRegiao,
    buscarRankingGeneros
};
