var database = require("../database/config");

function buscarRegioes() {
    return database.executar(`
        SELECT idRegiao, nome
        FROM Regiao
        ORDER BY nome
    `);
}

function buscarResumo(nomeRegiao) {
    return database.executar(`
        SELECT
            r.idRegiao,
            r.nome AS regiao,
            COALESCE(g.totalStreams, 0) AS totalStreams,
            COALESCE(g.quantidadeRegistros, 0) AS quantidadeRegistros,
            COALESCE(g.totalGeneros, 0) AS totalGeneros,
            COALESCE(a.totalArtistas, 0) AS totalArtistas
        FROM Regiao r
        LEFT JOIN (
            SELECT idRegiao, SUM(qtd_streams) AS totalStreams,
                   COUNT(*) AS quantidadeRegistros,
                   COUNT(DISTINCT idGenero) AS totalGeneros
            FROM ConsumoGenero
            GROUP BY idRegiao
        ) g ON g.idRegiao = r.idRegiao
        LEFT JOIN (
            SELECT idRegiao, COUNT(DISTINCT idArtista) AS totalArtistas
            FROM ConsumoArtista
            GROUP BY idRegiao
        ) a ON a.idRegiao = r.idRegiao
        WHERE r.idRegiao = ?
    `, [nomeRegiao]);
}

function buscarGeneros(nomeRegiao) {
    return database.executar(`
        SELECT g.nome AS genero,
               SUM(cg.qtd_streams) AS totalStreams,
               MIN(cg.ranking) AS melhorRanking,
               COUNT(*) AS quantidadeRegistros
        FROM ConsumoGenero cg
        INNER JOIN Regiao r ON r.idRegiao = cg.idRegiao
        INNER JOIN Genero g ON g.idGenero = cg.idGenero
        WHERE r.idRegiao = ?
        GROUP BY g.idGenero, g.nome
        ORDER BY totalStreams DESC
    `, [nomeRegiao]);
}

function buscarArtistas(nomeRegiao) {
    return database.executar(`
        SELECT a.idArtista, a.nome AS artista,
               SUM(ca.qtd_streams) AS totalStreams,
               MIN(ca.ranking) AS melhorRanking
        FROM ConsumoArtista ca
        INNER JOIN Regiao r ON r.idRegiao = ca.idRegiao
        INNER JOIN Artista a ON a.idArtista = ca.idArtista
        WHERE r.idRegiao = ?
        GROUP BY a.idArtista, a.nome
        ORDER BY totalStreams DESC
    `, [nomeRegiao]);
}

module.exports = {
    buscarRegioes,
    buscarResumo,
    buscarGeneros,
    buscarArtistas
};