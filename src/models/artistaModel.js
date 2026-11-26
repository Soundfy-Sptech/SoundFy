var database = require("../database/config");

function buscarTodos() {
    return database.executar(`
        SELECT idArtista, nome, pais_origem
        FROM Artista
        ORDER BY nome
    `);
}

function buscarPorId(idArtista) {
    return database.executar(`
        SELECT
            a.idArtista,
            a.nome,
            a.pais_origem AS paisOrigem,
            COALESCE(c.totalStreams, 0) AS totalStreams,
            COALESCE(c.totalRegioes, 0) AS totalRegioes,
            COALESCE(g.totalGeneros, 0) AS totalGeneros,
            c.melhorRanking
        FROM Artista a
        LEFT JOIN (
            SELECT idArtista, SUM(qtd_streams) AS totalStreams,
                   COUNT(DISTINCT idRegiao) AS totalRegioes,
                   MIN(ranking) AS melhorRanking
            FROM ConsumoArtista
            GROUP BY idArtista
        ) c ON c.idArtista = a.idArtista
        LEFT JOIN (
            SELECT idArtista, COUNT(*) AS totalGeneros
            FROM \`Genero dos artistas\`
            GROUP BY idArtista
        ) g ON g.idArtista = a.idArtista
        WHERE a.idArtista = ?
    `, [idArtista]);
}

function buscarGeneros(idArtista) {
    return database.executar(`
        SELECT g.nome AS genero
        FROM \`Genero dos artistas\` ga
        INNER JOIN Genero g ON g.idGenero = ga.idGenero
        WHERE ga.idArtista = ?
        ORDER BY g.nome
    `, [idArtista]);
}

function buscarConsumoPorRegiao(idArtista) {
    return database.executar(`
        SELECT r.nome AS regiao,
               SUM(ca.qtd_streams) AS totalStreams,
               MIN(ca.ranking) AS melhorRanking
        FROM ConsumoArtista ca
        INNER JOIN Regiao r ON r.idRegiao = ca.idRegiao
        WHERE ca.idArtista = ?
        GROUP BY r.idRegiao, r.nome
        ORDER BY totalStreams DESC
    `, [idArtista]);
}

module.exports = {
    buscarTodos,
    buscarPorId,
    buscarGeneros,
    buscarConsumoPorRegiao
};