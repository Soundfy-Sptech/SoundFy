var database = require("../database/config");

function buscarIndicadores() {
    return database.executar(`
        SELECT
            (SELECT COUNT(*) FROM Artista) AS totalArtistas,
            (SELECT COUNT(*) FROM Genero) AS totalGeneros,
            (SELECT COUNT(*) FROM ConsumoArtista) +
            (SELECT COUNT(*) FROM ConsumoGenero) AS totalRegistros,
            (SELECT COUNT(DISTINCT idRegiao) FROM (
                SELECT idRegiao FROM ConsumoArtista
                UNION
                SELECT idRegiao FROM ConsumoGenero
            ) AS regioesComDados) AS regioesComDados
    `);
}

function buscarArtistas() {
    return database.executar(`
        SELECT a.idArtista, a.nome,
               COALESCE(SUM(ca.qtd_streams), 0) AS totalStreams
        FROM Artista a
        LEFT JOIN ConsumoArtista ca ON ca.idArtista = a.idArtista
        GROUP BY a.idArtista, a.nome
        ORDER BY a.nome
    `);
}

function compararArtistas(idArtistaA, idArtistaB) {
    return database.executar(`
        SELECT
            a.idArtista,
            a.nome AS artista,
            r.nome AS regiao,
            SUM(ca.qtd_streams) AS totalStreams,
            MIN(ca.ranking) AS melhorRanking
        FROM ConsumoArtista ca
        INNER JOIN Artista a ON a.idArtista = ca.idArtista
        INNER JOIN Regiao r ON r.idRegiao = ca.idRegiao
        WHERE ca.idArtista IN (?, ?)
        GROUP BY a.idArtista, a.nome, r.idRegiao, r.nome
        ORDER BY r.nome, totalStreams DESC
    `, [idArtistaA, idArtistaB]);
}

function buscarGenerosMaisConsumidos() {
    return database.executar(`
        SELECT g.nome AS genero, SUM(cg.qtd_streams) AS totalStreams
        FROM ConsumoGenero cg
        INNER JOIN Genero g ON g.idGenero = cg.idGenero
        GROUP BY g.idGenero, g.nome
        ORDER BY totalStreams DESC
        LIMIT 5
    `);
}

module.exports = {
    buscarIndicadores,
    buscarArtistas,
    compararArtistas,
    buscarGenerosMaisConsumidos
};