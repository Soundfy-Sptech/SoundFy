
var database = require("../database/config");

function buscarTodos() {
    return database.executar(`
        SELECT
            idArtista,
            nome
        FROM Artista
        ORDER BY nome;
    `);
}

function buscarPorId(idArtista) {
    return database.executar(`
        SELECT
            a.idArtista,
            a.nome,
            COALESCE(c.totalStreams, 0) AS totalStreams,
            COALESCE(c.melhorRanking, 0) AS melhorRanking,
            COALESCE(g.totalGeneros, 0) AS totalGeneros
        FROM Artista a
        LEFT JOIN (
            SELECT
                idArtista,
                SUM(qtd_streams) AS totalStreams,
                MIN(ranking) AS melhorRanking
            FROM ConsumoArtista
            GROUP BY idArtista
        ) c ON c.idArtista = a.idArtista
        LEFT JOIN (
            SELECT
                idArtista,
                COUNT(*) AS totalGeneros
            FROM \`Genero dos artistas\`
            GROUP BY idArtista
        ) g ON g.idArtista = a.idArtista
        WHERE a.idArtista = ?;
    `, [idArtista]);
}

function buscarGeneros(idArtista) {
    return database.executar(`
        SELECT
            g.idGenero,
            g.nome AS genero
        FROM \`Genero dos artistas\` ga
        INNER JOIN Genero g
            ON g.idGenero = ga.idGenero
        WHERE ga.idArtista = ?
        ORDER BY g.nome;
    `, [idArtista]);
}

function compararArtistas(idArtistaA, idArtistaB) {
    return database.executar(`
        SELECT
            a.idArtista,
            a.nome,
            COALESCE(c.totalStreams, 0) AS totalStreams,
            COALESCE(c.melhorRanking, 0) AS melhorRanking,
            COALESCE(g.totalGeneros, 0) AS totalGeneros
        FROM Artista a
        LEFT JOIN (
            SELECT
                idArtista,
                SUM(qtd_streams) AS totalStreams,
                MIN(ranking) AS melhorRanking
            FROM ConsumoArtista
            GROUP BY idArtista
        ) c ON c.idArtista = a.idArtista
        LEFT JOIN (
            SELECT
                idArtista,
                COUNT(*) AS totalGeneros
            FROM \`Genero dos artistas\`
            GROUP BY idArtista
        ) g ON g.idArtista = a.idArtista
        WHERE a.idArtista IN (?, ?)
        ORDER BY a.idArtista;
    `, [idArtistaA, idArtistaB]);
}

module.exports = {
    buscarTodos,
    buscarPorId,
    buscarGeneros,
    compararArtistas
};
