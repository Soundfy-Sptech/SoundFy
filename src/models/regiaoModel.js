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

// O ranking exibe apenas os artistas mais bem colocados (limite). Os indicadores da
// região (resumo, totais) continuam sendo calculados sobre toda a base.
// O limite entra como inteiro validado no SQL (LIMIT não aceita parâmetro em execute()).
function buscarArtistas(nomeRegiao, limite) {
    var limiteSeguro = Math.max(1, parseInt(limite, 10) || 50);

    return database.executar(`
        SELECT a.idArtista, a.nome AS artista,
               SUM(ca.qtd_streams) AS totalStreams,
               MIN(ca.ranking) AS melhorRanking
        FROM ConsumoArtista ca
        INNER JOIN Regiao r ON r.idRegiao = ca.idRegiao
        INNER JOIN Artista a ON a.idArtista = ca.idArtista
        WHERE r.idRegiao = ?
        GROUP BY a.idArtista, a.nome
        ORDER BY totalStreams DESC, a.nome ASC
        LIMIT ${limiteSeguro}
    `, [nomeRegiao]);
}

// Total de streams de artistas da região, considerando todos os artistas (base completa).
function buscarTotalStreamsArtistas(nomeRegiao) {
    return database.executar(`
        SELECT COALESCE(SUM(qtd_streams), 0) AS totalStreams
        FROM ConsumoArtista
        WHERE idRegiao = ?
    `, [nomeRegiao]);
}

// Total de streams por região (mesma base do resumo: ConsumoGenero), para comparar regiões.
function buscarTotaisPorRegiao() {
    return database.executar(`
        SELECT r.idRegiao, r.nome AS regiao,
               COALESCE(SUM(cg.qtd_streams), 0) AS totalStreams
        FROM Regiao r
        LEFT JOIN ConsumoGenero cg ON cg.idRegiao = r.idRegiao
        GROUP BY r.idRegiao, r.nome
    `);
}

module.exports = {
    buscarRegioes,
    buscarResumo,
    buscarGeneros,
    buscarArtistas,
    buscarTotalStreamsArtistas,
    buscarTotaisPorRegiao
};