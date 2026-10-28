/* Perfil Analítico do Artista: dados estáticos extraídos da base "musica_brasil_por_regiao".
   Sem back-end: tudo é renderizado no navegador a partir dos objetos abaixo.
   Os textos (rótulos, insights, tooltips) vêm do sistema de idiomas (JS/i18n.js + locales/*.json);
   as chaves de região continuam em português apenas como identificadores dos dados. */
(function () {
    'use strict';

    var ORDEM = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

    // Régua por região: pontuação do 10º, 50º e 100º colocados e mediana dos artistas listados.
    var REFERENCIAS = {
    "Norte": {
        "cidades": 2,
        "artistas": 581,
        "top10": 14821,
        "top50": 5979,
        "top100": 3624,
        "mediana": 696.0
    },
    "Nordeste": {
        "cidades": 3,
        "artistas": 630,
        "top10": 22602,
        "top50": 9238,
        "top100": 5346,
        "mediana": 873.0
    },
    "Centro-Oeste": {
        "cidades": 4,
        "artistas": 690,
        "top10": 34757,
        "top50": 10622,
        "top100": 6442,
        "mediana": 620.5
    },
    "Sudeste": {
        "cidades": 4,
        "artistas": 779,
        "top10": 25135,
        "top50": 11139,
        "top100": 6876,
        "mediana": 629.0
    },
    "Sul": {
        "cidades": 3,
        "artistas": 577,
        "top10": 23720,
        "top50": 8435,
        "top100": 5791,
        "mediana": 991.0
    }
};

    // Dados por artista e região (pts = pontuação, ap = aparições, mus = músicas distintas,
    // cid = cidades da região em que aparece, rank = posição na região, media = pts por cidade onde aparece).
    var ARTISTAS = {
    "a1": {
        "nome": "Henrique & Juliano",
        "grupo": "Maiores pontuações",
        "regioes": {
            "Centro-Oeste": {
                "pts": 161422,
                "ap": 3329,
                "mus": 38,
                "cid": 4,
                "rank": 1,
                "media": 40356.0
            },
            "Nordeste": {
                "pts": 38754,
                "ap": 713,
                "mus": 12,
                "cid": 3,
                "rank": 4,
                "media": 12918.0
            },
            "Norte": {
                "pts": 34310,
                "ap": 679,
                "mus": 18,
                "cid": 2,
                "rank": 1,
                "media": 17155.0
            },
            "Sudeste": {
                "pts": 97022,
                "ap": 1894,
                "mus": 27,
                "cid": 4,
                "rank": 1,
                "media": 24256.0
            },
            "Sul": {
                "pts": 74269,
                "ap": 1427,
                "mus": 22,
                "cid": 3,
                "rank": 1,
                "media": 24756.0
            }
        },
        "kpi": {
            "total": 405777,
            "regioes": 5,
            "melhorRank": 1,
            "melhorRegiao": "Centro-Oeste",
            "melhorN": 690,
            "cidades": 16
        }
    },
    "a2": {
        "nome": "Felipe Amorim",
        "grupo": "Maiores pontuações",
        "regioes": {
            "Centro-Oeste": {
                "pts": 34757,
                "ap": 546,
                "mus": 5,
                "cid": 4,
                "rank": 10,
                "media": 8689.0
            },
            "Nordeste": {
                "pts": 53200,
                "ap": 826,
                "mus": 11,
                "cid": 3,
                "rank": 1,
                "media": 17733.0
            },
            "Norte": {
                "pts": 26335,
                "ap": 406,
                "mus": 8,
                "cid": 2,
                "rank": 3,
                "media": 13168.0
            },
            "Sudeste": {
                "pts": 31700,
                "ap": 496,
                "mus": 5,
                "cid": 4,
                "rank": 9,
                "media": 7925.0
            },
            "Sul": {
                "pts": 23772,
                "ap": 359,
                "mus": 5,
                "cid": 3,
                "rank": 9,
                "media": 7924.0
            }
        },
        "kpi": {
            "total": 169764,
            "regioes": 5,
            "melhorRank": 1,
            "melhorRegiao": "Nordeste",
            "melhorN": 630,
            "cidades": 16
        }
    },
    "a3": {
        "nome": "Gusttavo Lima",
        "grupo": "Maiores pontuações",
        "regioes": {
            "Centro-Oeste": {
                "pts": 101378,
                "ap": 1683,
                "mus": 27,
                "cid": 4,
                "rank": 2,
                "media": 25344.0
            },
            "Nordeste": {
                "pts": 39908,
                "ap": 710,
                "mus": 15,
                "cid": 3,
                "rank": 3,
                "media": 13303.0
            },
            "Norte": {
                "pts": 33089,
                "ap": 573,
                "mus": 16,
                "cid": 2,
                "rank": 2,
                "media": 16544.0
            },
            "Sudeste": {
                "pts": 75757,
                "ap": 1289,
                "mus": 18,
                "cid": 4,
                "rank": 2,
                "media": 18939.0
            },
            "Sul": {
                "pts": 58887,
                "ap": 975,
                "mus": 16,
                "cid": 3,
                "rank": 2,
                "media": 19629.0
            }
        },
        "kpi": {
            "total": 309019,
            "regioes": 5,
            "melhorRank": 2,
            "melhorRegiao": "Centro-Oeste",
            "melhorN": 690,
            "cidades": 16
        }
    },
    "a4": {
        "nome": "Raphaela Santos",
        "grupo": "Presença em uma região",
        "regioes": {
            "Nordeste": {
                "pts": 2823,
                "ap": 54,
                "mus": 3,
                "cid": 2,
                "rank": 180,
                "media": 1412.0
            }
        },
        "kpi": {
            "total": 2823,
            "regioes": 1,
            "melhorRank": 180,
            "melhorRegiao": "Nordeste",
            "melhorN": 630,
            "cidades": 2
        }
    },
    "a5": {
        "nome": "Heitor Costa",
        "grupo": "Presença em uma região",
        "regioes": {
            "Nordeste": {
                "pts": 2790,
                "ap": 65,
                "mus": 8,
                "cid": 1,
                "rank": 181,
                "media": 2790.0
            }
        },
        "kpi": {
            "total": 2790,
            "regioes": 1,
            "melhorRank": 181,
            "melhorRegiao": "Nordeste",
            "melhorN": 630,
            "cidades": 1
        }
    },
    "a6": {
        "nome": "Iguinho e Lulinha",
        "grupo": "Presença em uma região",
        "regioes": {
            "Nordeste": {
                "pts": 1538,
                "ap": 59,
                "mus": 4,
                "cid": 3,
                "rank": 251,
                "media": 513.0
            }
        },
        "kpi": {
            "total": 1538,
            "regioes": 1,
            "melhorRank": 251,
            "melhorRegiao": "Nordeste",
            "melhorN": 630,
            "cidades": 3
        }
    },
    "a7": {
        "nome": "Manu",
        "grupo": "Presença em uma região",
        "regioes": {
            "Norte": {
                "pts": 1779,
                "ap": 51,
                "mus": 4,
                "cid": 2,
                "rank": 194,
                "media": 890.0
            }
        },
        "kpi": {
            "total": 1779,
            "regioes": 1,
            "melhorRank": 194,
            "melhorRegiao": "Norte",
            "melhorN": 581,
            "cidades": 2
        }
    },
    "a8": {
        "nome": "IZA",
        "grupo": "Presença em várias regiões, posições mais baixas",
        "regioes": {
            "Centro-Oeste": {
                "pts": 70,
                "ap": 8,
                "mus": 2,
                "cid": 1,
                "rank": 567,
                "media": 70.0
            },
            "Sudeste": {
                "pts": 419,
                "ap": 21,
                "mus": 3,
                "cid": 1,
                "rank": 440,
                "media": 419.0
            }
        },
        "kpi": {
            "total": 489,
            "regioes": 2,
            "melhorRank": 440,
            "melhorRegiao": "Sudeste",
            "melhorN": 779,
            "cidades": 2
        }
    },
    "a9": {
        "nome": "Metallica",
        "grupo": "Presença em várias regiões, posições mais baixas",
        "regioes": {
            "Nordeste": {
                "pts": 62,
                "ap": 3,
                "mus": 1,
                "cid": 2,
                "rank": 518,
                "media": 31.0
            },
            "Norte": {
                "pts": 117,
                "ap": 5,
                "mus": 1,
                "cid": 2,
                "rank": 430,
                "media": 58.0
            },
            "Sudeste": {
                "pts": 52,
                "ap": 2,
                "mus": 1,
                "cid": 1,
                "rank": 637,
                "media": 52.0
            },
            "Sul": {
                "pts": 27,
                "ap": 2,
                "mus": 1,
                "cid": 1,
                "rank": 510,
                "media": 27.0
            }
        },
        "kpi": {
            "total": 258,
            "regioes": 4,
            "melhorRank": 430,
            "melhorRegiao": "Norte",
            "melhorN": 581,
            "cidades": 6
        }
    }
};

    var fmt = function (n) { return formatNumber(n); };
    var el = function (id) { return document.getElementById(id); };
    var regiao = function (nome) { return t('regionNames.' + nome); };

    function iniciais(nome) {
        var p = nome.split(/\s+/).filter(function (w) { return /^[A-Za-zÀ-ÿ]/.test(w) && w.toLowerCase() !== 'e'; });
        return ((p[0] ? p[0][0] : '?') + (p[1] ? p[1][0] : '')).toUpperCase();
    }

    // Ordinal no idioma atual: 1º (pt), 1st (en), 1.º / 1.er (es, apócope antes de substantivo).
    function ordinal(n, antesDoSubstantivo) {
        var idioma = window.currentLanguage();
        var resto10 = n % 10;
        var resto100 = n % 100;

        if (idioma === 'en') {
            var sufixo = (resto100 >= 11 && resto100 <= 13) ? 'th'
                : resto10 === 1 ? 'st'
                : resto10 === 2 ? 'nd'
                : resto10 === 3 ? 'rd' : 'th';
            return n + sufixo;
        }

        if (idioma === 'es') {
            var apocope = antesDoSubstantivo && ((resto10 === 1 && resto100 !== 11) || resto10 === 3);
            return n + (apocope ? '.er' : '.º');
        }

        return n + 'º';
    }

    // "A, B e C" / "A, B and C" / "A, B y C"
    function listar(itens) {
        if (itens.length <= 1) { return itens.join(''); }
        return itens.slice(0, -1).join(', ') + ' ' + t('common.and') + ' ' + itens[itens.length - 1];
    }

    var estilo = getComputedStyle(document.documentElement);
    var corBase = (estilo.getPropertyValue('--primary') || estilo.getPropertyValue('--roxo') || '').trim() || '#8b5cf6';
    var corTexto = getComputedStyle(document.body).color || '#888';
    var corGrade = 'rgba(128,128,128,0.18)';

    function opcoes(chaveTooltip) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (ctx) {
                            return ctx.parsed.y === null ? t('artist.tooltipNotPresent') : t(chaveTooltip, { n: ctx.parsed.y });
                        }
                    }
                }
            },
            scales: {
                x: { ticks: { color: corTexto }, grid: { display: false } },
                y: { beginAtZero: true, ticks: { color: corTexto, callback: function (v) { return fmt(v); } }, grid: { color: corGrade } }
            }
        };
    }

    var graficoPontos = null;
    var graficoMusicas = null;

    function criarGraficos() {
        if (typeof Chart === 'undefined' || graficoPontos) { return; }
        graficoPontos = new Chart(el('grafico-popularidade'), {
            type: 'bar',
            data: { labels: ORDEM.map(regiao), datasets: [{ data: [], backgroundColor: corBase, borderRadius: 6 }] },
            options: opcoes('artist.tooltipAvg')
        });
        graficoMusicas = new Chart(el('grafico-generos'), {
            type: 'bar',
            data: { labels: ORDEM.map(regiao), datasets: [{ data: [], backgroundColor: corBase, borderRadius: 6 }] },
            options: opcoes('artist.tooltipTracks')
        });
    }

    function atualizarGraficos(art) {
        if (!graficoPontos) { return; }
        var nomes = ORDEM.map(regiao);
        graficoPontos.data.labels = nomes;
        graficoMusicas.data.labels = nomes;
        graficoPontos.data.datasets[0].data = ORDEM.map(function (r) { return art.regioes[r] ? art.regioes[r].media : null; });
        graficoMusicas.data.datasets[0].data = ORDEM.map(function (r) { return art.regioes[r] ? art.regioes[r].mus : null; });
        graficoPontos.update();
        graficoMusicas.update();
    }

    function renderTabela(art) {
        var linhas = ORDEM.slice().sort(function (a, b) {
            var pa = art.regioes[a] ? art.regioes[a].pts : -1;
            var pb = art.regioes[b] ? art.regioes[b].pts : -1;
            return pb - pa;
        }).map(function (r) {
            var v = art.regioes[r];
            var ref = REFERENCIAS[r];
            if (!v) {
                return '<tr><td>' + regiao(r) + '</td><td>—</td><td>—</td><td>—</td><td>—</td><td>' + t('artist.notPresent') +
                    '</td><td>' + t('artist.missingPts', { n: ref.top10 }) + '</td></tr>';
            }
            var meta = v.rank <= 10 ? t('artist.inTop10') : t('artist.missingPts', { n: ref.top10 - v.pts });
            return '<tr><td>' + regiao(r) + '</td><td>' + t('common.pts', { n: v.pts }) + '</td><td>' + fmt(v.ap) + '</td><td>' + fmt(v.mus) + '</td><td>' +
                t('artist.citiesOf', { a: v.cid, b: ref.cidades }) + '</td><td>' + ordinal(v.rank) + '</td><td>' + meta + '</td></tr>';
        });
        el('tabela-faixas').innerHTML = linhas.join('');
    }

    function textoMusicas(n) { return t(n === 1 ? 'artist.trackOne' : 'artist.trackOther', { n: n }); }
    function textoAparicoes(n) { return t(n === 1 ? 'artist.appearanceOne' : 'artist.appearanceOther', { n: n }); }

    // Insight analítico montado a partir dos dados, no idioma selecionado.
    function montarInsight(art) {
        var k = art.kpi;
        var presentes = ORDEM.filter(function (r) { return art.regioes[r]; });
        var ausentes = ORDEM.filter(function (r) { return !art.regioes[r]; });
        var principal = art.regioes[k.melhorRegiao];
        var refPrincipal = REFERENCIAS[k.melhorRegiao];
        var unica = k.regioes === 1;

        var titulo = t(unica ? 'artist.insightTitleSingle' : 'artist.insightTitleMain', { region: regiao(k.melhorRegiao) });

        var frases = [t('artist.insightMain', {
            region: regiao(k.melhorRegiao),
            pts: principal.pts,
            avg: principal.media,
            rank: ordinal(principal.rank, true),
            total: k.melhorN,
            tracks: textoMusicas(principal.mus),
            apps: textoAparicoes(principal.ap)
        })];

        if (unica) {
            frases.push(t('artist.insightSingle', {
                c: principal.cid,
                total: refPrincipal.cidades,
                gap: refPrincipal.top10 - principal.pts,
                median: refPrincipal.mediana
            }));
        } else {
            var pior = presentes.reduce(function (acc, r) {
                return art.regioes[r].rank > art.regioes[acc].rank ? r : acc;
            }, presentes[0]);
            var vPior = art.regioes[pior];
            var refPior = REFERENCIAS[pior];

            if (vPior.rank <= 10) {
                frases.push(t('artist.insightLowestInTop10', { region: regiao(pior), rank: ordinal(vPior.rank, true) }));
            } else {
                frases.push(t('artist.insightLowestFar', {
                    region: regiao(pior),
                    rank: ordinal(vPior.rank, true),
                    gap: refPior.top10 - vPior.pts,
                    median: refPior.mediana
                }));
            }
        }

        if (ausentes.length) {
            frases.push(t('artist.insightMissing', { list: listar(ausentes.map(regiao)) }));
        }

        return { titulo: titulo, descricao: frases.join(' ') };
    }

    function render(id) {
        var art = ARTISTAS[id];
        if (!art) { return; }
        var k = art.kpi;
        var insight = montarInsight(art);
        el('artista-avatar').textContent = iniciais(art.nome);
        el('artista-nome').textContent = art.nome;
        el('artista-regioes').textContent = t('artist.presentIn', { n: k.regioes });
        el('pontuacao-total').textContent = fmt(k.total);
        el('pontuacao-total-nota').textContent = k.regioes === 1 ? t('artist.totalNoteOne') : t('artist.totalNoteMany', { n: k.regioes });
        el('melhor-posicao').textContent = ordinal(k.melhorRank);
        el('melhor-posicao-nota').textContent = t('artist.bestPositionNote', { region: regiao(k.melhorRegiao), n: k.melhorN });
        el('alcance-cidades').textContent = fmt(k.cidades);
        renderTabela(art);
        atualizarGraficos(art);
        el('insight-titulo').textContent = insight.titulo;
        el('insight-descricao').textContent = insight.descricao;
    }

    var select = el('artista-select');
    if (select) {
        select.addEventListener('change', function () { render(select.value); });

        // Roda quando o idioma termina de carregar e a cada troca de idioma:
        // mantém o artista selecionado e refaz todos os textos, tabela e gráficos.
        onLanguageReady(function () {
            criarGraficos();
            render(select.value || 'a1');
        });
    }
})();
