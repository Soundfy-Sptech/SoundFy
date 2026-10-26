
document.addEventListener("DOMContentLoaded", function () {
    const $ = (id) => document.getElementById(id);

    const elementos = {
        tipo: $("filtroTipo"),
        regiao: $("filtroRegiao"),
        limite: $("filtroLimite"),
        busca: $("filtroBusca"),
        cabecalho: $("cabecalhoTabela"),
        corpo: $("corpoTabela"),
        contador: $("contadorLinhas"),
        subtitulo: $("subtituloRelatorio"),
        csv: $("btnExportarCSV"),
        xlsx: $("btnExportarXLSX"),
        pdf: $("btnExportarPDF")
    };

    const colunas = {
        artistas: [
            { chave: "name", titulo: "reports.columnArtist", campo: "nome" },
            { chave: "region", titulo: "reports.columnRegion", campo: "regiao" },
            { chave: "city", titulo: "reports.columnCity", campo: "cidade" },
            { chave: "genre", titulo: "reports.columnGenre", campo: "genero" },
            { chave: "score", titulo: "reports.columnScore", campo: "pontuacao" },
            { chave: "popularity", titulo: "reports.columnPopularity", campo: "popularidade" }
        ],
        generos: [
            { chave: "genre", titulo: "reports.columnGenre", campo: "genero" },
            { chave: "region", titulo: "reports.columnRegion", campo: "regiao" },
            { chave: "artists", titulo: "reports.columnArtists", campo: "artistas" },
            { chave: "tracks", titulo: "reports.columnTracks", campo: "faixas" },
            { chave: "score", titulo: "reports.columnScore", campo: "pontuacao" }
        ],
        cidades: [
            { chave: "city", titulo: "reports.columnCity", campo: "cidade" },
            { chave: "region", titulo: "reports.columnRegion", campo: "regiao" },
            { chave: "artists", titulo: "reports.columnArtists", campo: "artistas" },
            { chave: "tracks", titulo: "reports.columnTracks", campo: "faixas" },
            { chave: "score", titulo: "reports.columnScore", campo: "pontuacao" }
        ],
        resumo: [
            { chave: "region", titulo: "reports.columnRegion", campo: "regiao" },
            { chave: "cities", titulo: "reports.columnCities", campo: "cidades" },
            { chave: "artists", titulo: "reports.columnArtists", campo: "artistas" },
            { chave: "tracks", titulo: "reports.columnTracks", campo: "faixas" },
            { chave: "score", titulo: "reports.columnScore", campo: "pontuacao" }
        ]
    };

    // Dados fictícios para demonstração. Substitua pela resposta da API quando disponível.
    const dados = {
        artistas: [
            { nome: "Luna Martins", regiao: "Sudeste", cidade: "São Paulo", genero: "Pop", pontuacao: 958270, popularidade: 92 },
            { nome: "Caio Mendes", regiao: "Nordeste", cidade: "Salvador", genero: "MPB", pontuacao: 842610, popularidade: 88 },
            { nome: "Aurora Beats", regiao: "Sul", cidade: "Curitiba", genero: "Eletrônica", pontuacao: 790450, popularidade: 85 },
            { nome: "Ritmo Livre", regiao: "Centro-Oeste", cidade: "Brasília", genero: "Hip-hop", pontuacao: 721380, popularidade: 82 },
            { nome: "Maré Alta", regiao: "Norte", cidade: "Belém", genero: "Regional", pontuacao: 689240, popularidade: 79 },
            { nome: "Nina Sol", regiao: "Sudeste", cidade: "Rio de Janeiro", genero: "R&B", pontuacao: 654100, popularidade: 77 },
            { nome: "Vitor Reis", regiao: "Nordeste", cidade: "Recife", genero: "Rock", pontuacao: 601720, popularidade: 74 },
            { nome: "Clube Neon", regiao: "Sul", cidade: "Porto Alegre", genero: "Pop", pontuacao: 578300, popularidade: 72 },
            { nome: "Duda Campos", regiao: "Centro-Oeste", cidade: "Goiânia", genero: "Sertanejo", pontuacao: 530980, popularidade: 70 },
            { nome: "Tom Nascimento", regiao: "Norte", cidade: "Manaus", genero: "MPB", pontuacao: 489650, popularidade: 67 }
        ],

        generos: [
            { genero: "Pop", regiao: "Sudeste", artistas: 420, faixas: 1250, pontuacao: 958270 },
            { genero: "MPB", regiao: "Nordeste", artistas: 315, faixas: 980, pontuacao: 842610 },
            { genero: "Eletrônica", regiao: "Sul", artistas: 280, faixas: 760, pontuacao: 790450 },
            { genero: "Hip-hop", regiao: "Centro-Oeste", artistas: 245, faixas: 690, pontuacao: 721380 },
            { genero: "Regional", regiao: "Norte", artistas: 190, faixas: 540, pontuacao: 689240 },
            { genero: "R&B", regiao: "Sudeste", artistas: 175, faixas: 430, pontuacao: 654100 },
            { genero: "Rock", regiao: "Nordeste", artistas: 160, faixas: 410, pontuacao: 601720 },
            { genero: "Sertanejo", regiao: "Centro-Oeste", artistas: 150, faixas: 390, pontuacao: 530980 }
        ],

        cidades: [
            { cidade: "São Paulo", regiao: "Sudeste", artistas: 850, faixas: 2100, pontuacao: 958270 },
            { cidade: "Rio de Janeiro", regiao: "Sudeste", artistas: 630, faixas: 1720, pontuacao: 854210 },
            { cidade: "Salvador", regiao: "Nordeste", artistas: 490, faixas: 1380, pontuacao: 842610 },
            { cidade: "Recife", regiao: "Nordeste", artistas: 420, faixas: 1170, pontuacao: 721380 },
            { cidade: "Curitiba", regiao: "Sul", artistas: 390, faixas: 1050, pontuacao: 790450 },
            { cidade: "Porto Alegre", regiao: "Sul", artistas: 350, faixas: 960, pontuacao: 578300 },
            { cidade: "Brasília", regiao: "Centro-Oeste", artistas: 310, faixas: 870, pontuacao: 721380 },
            { cidade: "Goiânia", regiao: "Centro-Oeste", artistas: 290, faixas: 810, pontuacao: 530980 },
            { cidade: "Belém", regiao: "Norte", artistas: 230, faixas: 650, pontuacao: 689240 },
            { cidade: "Manaus", regiao: "Norte", artistas: 210, faixas: 590, pontuacao: 489650 }
        ],

        resumo: [
            { regiao: "Sudeste", cidades: 4, artistas: 1480, faixas: 3820, pontuacao: 1812480 },
            { regiao: "Nordeste", cidades: 3, artistas: 910, faixas: 2550, pontuacao: 1444330 },
            { regiao: "Centro-Oeste", cidades: 3, artistas: 600, faixas: 1680, pontuacao: 1252360 },
            { regiao: "Sul", cidades: 3, artistas: 740, faixas: 2010, pontuacao: 1368750 },
            { regiao: "Norte", cidades: 3, artistas: 440, faixas: 1240, pontuacao: 1178890 }
        ]
    };

    function t(chave) {
        return typeof window.t === "function" ? window.t(chave) : chave;
    }

    function obterTipo() {
        return elementos.tipo.value;
    }

    function obterColunas() {
        return colunas[obterTipo()] || colunas.artistas;
    }

    function obterDadosFiltrados() {
        const tipo = obterTipo();
        const regiao = elementos.regiao.value;
        const busca = elementos.busca.value.trim().toLocaleLowerCase();
        const limite = elementos.limite.value;

        let resultado = (dados[tipo] || []).filter((item) => {
            const correspondeRegiao =
                regiao === "todas" || item.regiao === regiao;

            const textoBusca = Object.values(item)
                .join(" ")
                .toLocaleLowerCase();

            return correspondeRegiao && textoBusca.includes(busca);
        });

        resultado = resultado.slice().sort((a, b) => {
            const valorA = Number(a.pontuacao) || 0;
            const valorB = Number(b.pontuacao) || 0;
            return valorB - valorA;
        });

        if (limite !== "todos") {
            resultado = resultado.slice(0, Number(limite));
        }

        return resultado;
    }

    function formatarNumero(valor) {
        if (typeof valor !== "number") return valor ?? "";
        return new Intl.NumberFormat(obterLocale()).format(valor);
    }

    function obterLocale() {
        const idioma = document.documentElement.lang ||
            localStorage.getItem("soundfy-language") ||
            "pt-BR";

        if (idioma.startsWith("en")) return "en-US";
        if (idioma.startsWith("es")) return "es-ES";

        return "pt-BR";
    }

    function renderizarTabela() {
        if (!elementos.cabecalho || !elementos.corpo) return;

        const listaColunas = obterColunas();
        const registros = obterDadosFiltrados();

        elementos.cabecalho.replaceChildren();
        elementos.corpo.replaceChildren();

        const linhaCabecalho = document.createElement("tr");

        listaColunas.forEach((coluna) => {
            const th = document.createElement("th");
            th.textContent = t(coluna.titulo);
            linhaCabecalho.appendChild(th);
        });

        elementos.cabecalho.appendChild(linhaCabecalho);

        registros.forEach((registro) => {
            const tr = document.createElement("tr");

            listaColunas.forEach((coluna) => {
                const td = document.createElement("td");
                const valor = registro[coluna.campo];

                td.textContent = typeof valor === "number"
                    ? formatarNumero(valor)
                    : (valor ?? "");

                tr.appendChild(td);
            });

            elementos.corpo.appendChild(tr);
        });

        elementos.contador.textContent =
            `${formatarNumero(registros.length)} ${t("reports.recordsFound")}`;

        elementos.subtitulo.textContent = t(
            {
                artistas: "reports.typeArtists",
                generos: "reports.typeGenres",
                cidades: "reports.typeCities",
                resumo: "reports.typeRegions"
            }[obterTipo()] || "reports.detailedReport"
        );
    }

    function escaparCSV(valor) {
        const texto = String(valor ?? "");
        return `"${texto.replace(/"/g, '""')}"`;
    }

    function gerarMatrizExportacao() {
        const listaColunas = obterColunas();
        const registros = obterDadosFiltrados();

        return [
            listaColunas.map((coluna) => t(coluna.titulo)),
            ...registros.map((registro) =>
                listaColunas.map((coluna) => registro[coluna.campo] ?? "")
            )
        ];
    }

    function baixarArquivo(conteudo, tipoMime, nomeArquivo) {
        const blob = new Blob([conteudo], { type: tipoMime });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }

    function obterNomeArquivo(extensao) {
        const data = new Date().toISOString().slice(0, 10);
        return `soundfy-relatorio-${obterTipo()}-${data}.${extensao}`;
    }

    function exportarCSV() {
        const matriz = gerarMatrizExportacao();

        if (matriz.length <= 1) {
            alert(t("reports.noDataToExport"));
            return;
        }

        const csv = matriz
            .map((linha) => linha.map(escaparCSV).join(";"))
            .join("\r\n");

        // BOM melhora a leitura de caracteres acentuados no Excel.
        baixarArquivo(
            "\uFEFF" + csv,
            "text/csv;charset=utf-8;",
            obterNomeArquivo("csv")
        );
    }

    function exportarXLSX() {
        if (typeof XLSX === "undefined") {
            alert(t("reports.xlsxLibraryError"));
            return;
        }

        const matriz = gerarMatrizExportacao();

        if (matriz.length <= 1) {
            alert(t("reports.noDataToExport"));
            return;
        }

        const planilha = XLSX.utils.aoa_to_sheet(matriz);
        const livro = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            livro,
            planilha,
            obterTipo().slice(0, 31)
        );

        XLSX.writeFile(livro, obterNomeArquivo("xlsx"));
    }

    function exportarPDF() {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert(t("reports.pdfLibraryError"));
            return;
        }

        const matriz = gerarMatrizExportacao();

        if (matriz.length <= 1) {
            alert(t("reports.noDataToExport"));
            return;
        }

        const { jsPDF } = window.jspdf;
        const documento = new jsPDF({ orientation: "landscape" });

        documento.setFontSize(16);
        documento.text(t("reports.pdfTitle"), 14, 16);

        documento.setFontSize(9);
        documento.text(
            `${t("reports.pdfType")}: ${t(
                {
                    artistas: "reports.typeArtists",
                    generos: "reports.typeGenres",
                    cidades: "reports.typeCities",
                    resumo: "reports.typeRegions"
                }[obterTipo()]
            )}`,
            14,
            23
        );

        documento.text(
            `${t("reports.pdfGeneratedAt")}: ${new Date().toLocaleString(obterLocale())}`,
            14,
            29
        );

        if (typeof documento.autoTable !== "function") {
            alert(t("reports.pdfTableError"));
            return;
        }

        documento.autoTable({
            head: [matriz[0]],
            body: matriz.slice(1),
            startY: 35,
            styles: {
                fontSize: 8,
                cellPadding: 3
            },
            headStyles: {
                fillColor: [124, 58, 237]
            },
            alternateRowStyles: {
                fillColor: [245, 240, 250]
            }
        });

        documento.save(obterNomeArquivo("pdf"));
    }

    elementos.tipo.addEventListener("change", renderizarTabela);
    elementos.regiao.addEventListener("change", renderizarTabela);
    elementos.limite.addEventListener("change", renderizarTabela);
    elementos.busca.addEventListener("input", renderizarTabela);

    elementos.csv.addEventListener("click", exportarCSV);
    elementos.xlsx.addEventListener("click", exportarXLSX);
    elementos.pdf.addEventListener("click", exportarPDF);

    // Atualiza os títulos da tabela quando o idioma da página muda.
    const observadorIdioma = new MutationObserver(renderizarTabela);

    observadorIdioma.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"]
    });

    renderizarTabela();
});
