
document.addEventListener("DOMContentLoaded", function () {
    const traducoesMock = {
        pt: {
            artista1: {
                nome: "Artista Demonstração",
                genero: "Pop · Música brasileira",
                insightTitulo: "Oportunidade de crescimento",
                insightDescricao:
                    "Neste cenário demonstrativo, o artista apresenta uma trajetória positiva de popularidade. Vale investigar quais faixas e gêneros acompanham esse crescimento."
            },
            artista2: {
                nome: "Artista Alternativo",
                genero: "Indie · Alternativo",
                insightTitulo: "Espaço para consolidar o público",
                insightDescricao:
                    "Neste exemplo fictício, o artista apresenta crescimento moderado. Comparar as faixas com melhor desempenho pode ajudar a identificar características recorrentes no catálogo."
            },
            artista3: {
                nome: "Artista Emergente",
                genero: "Trap · Hip-hop",
                insightTitulo: "Acompanhar a ascensão do artista",
                insightDescricao:
                    "Neste cenário fictício, o artista combina popularidade moderada com crescimento recente. É importante acompanhar os próximos resultados antes de concluir que existe uma tendência consolidada."
            }
        },
        en: {
            artista1: {
                nome: "Demo Artist",
                genero: "Pop · Brazilian music",
                insightTitulo: "Growth opportunity",
                insightDescricao:
                    "In this illustrative scenario, the artist shows a positive popularity trajectory. It is worth exploring which tracks and genres are contributing to this growth."
            },
            artista2: {
                nome: "Alternative Artist",
                genero: "Indie · Alternative",
                insightTitulo: "Room to build a stronger audience",
                insightDescricao:
                    "In this fictional example, the artist shows moderate growth. Comparing the best-performing tracks may help identify recurring characteristics in the catalog."
            },
            artista3: {
                nome: "Emerging Artist",
                genero: "Trap · Hip-hop",
                insightTitulo: "Track the artist's rise",
                insightDescricao:
                    "In this fictional scenario, the artist combines moderate popularity with recent growth. Follow upcoming results before concluding that a lasting trend has emerged."
            }
        },
        es: {
            artista1: {
                nome: "Artista de demostración",
                genero: "Pop · Música brasileña",
                insightTitulo: "Oportunidad de crecimiento",
                insightDescricao:
                    "En este escenario ilustrativo, el artista muestra una trayectoria positiva de popularidad. Conviene investigar qué canciones y géneros acompañan este crecimiento."
            },
            artista2: {
                nome: "Artista alternativo",
                genero: "Indie · Alternativo",
                insightTitulo: "Oportunidad para consolidar la audiencia",
                insightDescricao:
                    "En este ejemplo ficticio, el artista presenta un crecimiento moderado. Comparar las canciones con mejor rendimiento puede ayudar a identificar características recurrentes del catálogo."
            },
            artista3: {
                nome: "Artista emergente",
                genero: "Trap · Hip-hop",
                insightTitulo: "Seguir el crecimiento del artista",
                insightDescricao:
                    "En este escenario ficticio, el artista combina una popularidad moderada con un crecimiento reciente. Conviene observar los próximos resultados antes de concluir que existe una tendencia consolidada."
            }
        }
    };

    function obterIdiomaAtual() {
        const idiomaSalvo = localStorage.getItem("soundfy-language");
        const idiomaPagina = document.documentElement.lang;

        const idioma = idiomaSalvo || idiomaPagina || "pt";

        if (idioma.startsWith("en")) return "en";
        if (idioma.startsWith("es")) return "es";

        return "pt";
    }

    function obterTextoMock(idArtista) {
        const idioma = obterIdiomaAtual();

        return traducoesMock[idioma][idArtista] ||
            traducoesMock.pt[idArtista];
    }

    function traduzir(chave) {
        return typeof window.t === "function" ? window.t(chave) : chave;
    }

    const seletor = document.getElementById("artista-select");

    const elementos = {
        avatar: document.getElementById("artista-avatar"),
        nome: document.getElementById("artista-nome"),
        genero: document.getElementById("artista-genero"),
        popularidade: document.getElementById("popularidade"),
        crescimento: document.getElementById("crescimento"),
        faixas: document.getElementById("faixas"),
        tabela: document.getElementById("tabela-faixas"),
        insightTitulo: document.getElementById("insight-titulo"),
        insightDescricao: document.getElementById("insight-descricao")
    };

    // Dados fictícios: substituir pela integração com o banco futuramente.
    const artistas = {
        artista1: {
            iniciais: "AD",
            popularidade: 82,
            crescimento: 12.4,
            faixas: 24,
            historico: [48, 52, 49, 58, 61, 59, 67, 72, 75, 79, 76, 82],
            generos: {
                labels: ["Pop", "Dance", "R&B", "Outros"],
                valores: [45, 25, 18, 12]
            },
            musicas: [
                {
                    nome: "Horizonte",
                    genero: "Pop",
                    popularidade: 91,
                    tendencia: "Alta",
                    classe: "tendencia-positiva"
                },
                {
                    nome: "Noite Inteira",
                    genero: "Dance",
                    popularidade: 84,
                    tendencia: "Alta",
                    classe: "tendencia-positiva"
                },
                {
                    nome: "Entre Nós",
                    genero: "R&B",
                    popularidade: 76,
                    tendencia: "Estável",
                    classe: "tendencia-estavel"
                },
                {
                    nome: "Outro Lugar",
                    genero: "Pop",
                    popularidade: 68,
                    tendencia: "Em observação",
                    classe: "tendencia-estavel"
                }
            ]
        },

        artista2: {
            iniciais: "AA",
            popularidade: 67,
            crescimento: 5.8,
            faixas: 18,
            historico: [40, 44, 43, 48, 46, 51, 54, 53, 59, 61, 63, 67],
            generos: {
                labels: ["Indie", "Rock", "Pop", "Outros"],
                valores: [42, 28, 20, 10]
            },
            musicas: [
                {
                    nome: "Cidade Vazia",
                    genero: "Indie",
                    popularidade: 79,
                    tendencia: "Alta",
                    classe: "tendencia-positiva"
                },
                {
                    nome: "Último Trem",
                    genero: "Rock",
                    popularidade: 72,
                    tendencia: "Estável",
                    classe: "tendencia-estavel"
                },
                {
                    nome: "Fotografias",
                    genero: "Indie",
                    popularidade: 65,
                    tendencia: "Alta",
                    classe: "tendencia-positiva"
                },
                {
                    nome: "Distância",
                    genero: "Pop",
                    popularidade: 51,
                    tendencia: "Em queda",
                    classe: "tendencia-negativa"
                }
            ]
        },

        artista3: {
            iniciais: "AE",
            popularidade: 54,
            crescimento: 18.6,
            faixas: 12,
            historico: [20, 22, 25, 23, 31, 34, 32, 39, 43, 45, 50, 54],
            generos: {
                labels: ["Trap", "Hip-hop", "R&B", "Outros"],
                valores: [50, 25, 15, 10]
            },
            musicas: [
                {
                    nome: "Sem Limites",
                    genero: "Trap",
                    popularidade: 83,
                    tendencia: "Alta",
                    classe: "tendencia-positiva"
                },
                {
                    nome: "De Madrugada",
                    genero: "Hip-hop",
                    popularidade: 70,
                    tendencia: "Alta",
                    classe: "tendencia-positiva"
                },
                {
                    nome: "Perspectiva",
                    genero: "Trap",
                    popularidade: 56,
                    tendencia: "Estável",
                    classe: "tendencia-estavel"
                },
                {
                    nome: "Novo Ciclo",
                    genero: "R&B",
                    popularidade: 42,
                    tendencia: "Em observação",
                    classe: "tendencia-estavel"
                }
            ]
        }
    };

    let graficoPopularidade = null;
    let graficoGeneros = null;

    const cores = {
        roxo: "#7c3aed",
        roxoClaro: "#a78bfa",
        rosa: "#ff4fa3",
        texto: "#f5f0fa",
        cinza: "#9c8fb0",
        grade: "rgba(156, 143, 176, 0.15)"
    };

    function obterTema() {
        return document.documentElement.getAttribute("data-theme") || "dark";
    }

    function atualizarCoresGraficos() {
        const estiloClaro = obterTema() === "light";

        cores.texto = estiloClaro ? "#30243d" : "#f5f0fa";
        cores.cinza = estiloClaro ? "#71647f" : "#9c8fb0";
        cores.grade = estiloClaro
            ? "rgba(48, 36, 61, 0.12)"
            : "rgba(156, 143, 176, 0.15)";
    }

    function criarGraficoPopularidade(dados) {
        const canvas = document.getElementById("grafico-popularidade");

        if (!canvas || typeof Chart === "undefined") {
            console.error(
                "Chart.js não foi carregado. Verifique a conexão e o script no HTML."
            );
            return;
        }

        if (graficoPopularidade) {
            graficoPopularidade.destroy();
        }

        atualizarCoresGraficos();

        graficoPopularidade = new Chart(canvas, {
            type: "line",
            data: {
                labels: Array.from(
                    { length: 12 },
                    (_, i) => `${traduzir("artist.period")} ${i + 1}`
                ),
                datasets: [{
                    label: traduzir("artist.popularity"),
                    data: dados.historico,
                    borderColor: cores.roxoClaro,
                    backgroundColor: "rgba(124, 58, 237, 0.15)",
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: cores.rosa,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: "#170f24",
                        titleColor: "#f5f0fa",
                        bodyColor: "#f5f0fa",
                        padding: 12,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: cores.cinza,
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 6
                        },
                        border: {
                            display: false
                        }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        ticks: {
                            color: cores.cinza,
                            stepSize: 20
                        },
                        grid: {
                            color: cores.grade
                        },
                        border: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    function criarGraficoGeneros(dados) {
        const canvas = document.getElementById("grafico-generos");

        if (!canvas || typeof Chart === "undefined") {
            console.error(
                "Chart.js não foi carregado. Verifique a conexão e o script no HTML."
            );
            return;
        }

        if (graficoGeneros) {
            graficoGeneros.destroy();
        }

        atualizarCoresGraficos();

        graficoGeneros = new Chart(canvas, {
            type: "doughnut",
            data: {
                labels: dados.generos.labels.map(traduzirGenero),
                datasets: [{
                    data: dados.generos.valores,
                    backgroundColor: [
                        cores.roxo,
                        cores.rosa,
                        cores.roxoClaro,
                        "#514260"
                    ],
                    borderColor: obterTema() === "light"
                        ? "#ffffff"
                        : "#170f24",
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "68%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: cores.texto,
                            padding: 18,
                            usePointStyle: true,
                            pointStyle: "circle",
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (contexto) {
                                return contexto.label + ": " +
                                    contexto.raw + "%";
                            }
                        }
                    }
                }
            }
        });
    }

    function preencherTabela(musicas) {
        if (!elementos.tabela) return;

        elementos.tabela.replaceChildren();

        musicas.forEach(function (musica) {
            const linha = document.createElement("tr");

            const celulaNome = document.createElement("td");
            celulaNome.textContent = musica.nome;

            const celulaGenero = document.createElement("td");
            celulaGenero.textContent = traduzirGenero(musica.genero);

            const celulaPopularidade = document.createElement("td");
            celulaPopularidade.textContent = musica.popularidade + "/100";

            const celulaTendencia = document.createElement("td");

            const chavesTendencia = {
                "Alta": "artist.high",
                "Estável": "artist.stable",
                "Em observação": "artist.observing",
                "Em queda": "artist.falling"
            };

            celulaTendencia.textContent = traduzir(
                chavesTendencia[musica.tendencia] || musica.tendencia
            );

            celulaTendencia.classList.add(musica.classe);

            linha.append(
                celulaNome,
                celulaGenero,
                celulaPopularidade,
                celulaTendencia
            );

            elementos.tabela.appendChild(linha);
        });
    }

    function atualizarPerfil(idArtista) {
        const artista = artistas[idArtista];

        if (!artista) return;

        const texto = obterTextoMock(idArtista);

        elementos.avatar.textContent = artista.iniciais;
        elementos.nome.textContent = texto.nome;
        elementos.genero.textContent = texto.genero;
        elementos.popularidade.textContent = artista.popularidade + "/100";

        const sinalCrescimento = artista.crescimento > 0 ? "+" : "";

        elementos.crescimento.textContent =
            sinalCrescimento + artista.crescimento.toFixed(1) + "%";

        elementos.faixas.textContent = artista.faixas;
        elementos.insightTitulo.textContent = texto.insightTitulo;
        elementos.insightDescricao.textContent = texto.insightDescricao;

        preencherTabela(artista.musicas);
        criarGraficoPopularidade(artista);
        criarGraficoGeneros(artista);
    }

    if (seletor) {
        atualizarPerfil(seletor.value);

        seletor.addEventListener("change", function () {
            atualizarPerfil(seletor.value);
        });
    }

    // Atualiza os gráficos ao alternar entre tema claro e escuro.
    const observadorTema = new MutationObserver(function () {
        if (seletor && artistas[seletor.value]) {
            atualizarPerfil(seletor.value);
        }
    });

    observadorTema.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"]
    });

    // Atualiza o conteúdo dinâmico quando o idioma da página muda.
    const observadorIdioma = new MutationObserver(function () {
        if (seletor && artistas[seletor.value]) {
            atualizarPerfil(seletor.value);
        }
    });

    observadorIdioma.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"]
    });
});

function traduzirGenero(genero) {
    const chaves = {
        "Pop": "artist.pop",
        "Dance": "artist.dance",
        "R&B": "artist.rnb",
        "Outros": "artist.other",
        "Indie": "artist.indie",
        "Rock": "artist.rock",
        "Hip-hop": "artist.hipHop",
        "Trap": "artist.trap"
    };

    return typeof window.t === "function"
        ? window.t(chaves[genero] || genero)
        : genero;
}
