const botaoTema = document.getElementById("tema");
const botaoMenu = document.getElementById("menu");
const barraLateral = document.querySelector(".barra-lateral");

function definirTema(nomeTema) {
    document.documentElement.setAttribute("data-theme", nomeTema);

    if (botaoTema) {
        botaoTema.textContent = nomeTema === "light" ? "☾" : "☀";
    }

    document.querySelectorAll("[data-theme-choice]").forEach(function(opcao) {
        opcao.classList.toggle(
            "selecionado",
            opcao.dataset.themeChoice === nomeTema
        );
    });
}

const temaSalvo = localStorage.getItem("soundfy-theme") || "dark";
definirTema(temaSalvo);

if (botaoTema) {
    botaoTema.onclick = function() {
        const proximoTema =
            document.documentElement.dataset.theme === "dark"
                ? "light"
                : "dark";

        localStorage.setItem("soundfy-theme", proximoTema);
        definirTema(proximoTema);
    };
}

document.querySelectorAll("[data-theme-choice]").forEach(function(opcao) {
    opcao.onclick = function() {
        const temaSelecionado = opcao.dataset.themeChoice;

        localStorage.setItem("soundfy-theme", temaSelecionado);
        definirTema(temaSelecionado);
    };
});

if (botaoMenu && barraLateral) {
    botaoMenu.onclick = function() {
        barraLateral.classList.toggle("mobile-aberto");
    };
}

document.querySelectorAll(".primario").forEach(function(botao) {
    if (botao.id === "abrirCompromisso") {
        return;
    }

    botao.addEventListener("click", function() {
        if (botao.textContent.includes("Salvar alterações")) {
            const textoOriginal = botao.textContent;
            botao.textContent = "Salvo ✓";

            setTimeout(function() {
                botao.textContent = textoOriginal;
            }, 1500);
        }
    });
});

/* Agenda */

const chaveArmazenamentoCompromissos = "soundfy-appointments";

const compromissosPadrao = [
    {
        id: 1,
        titulo: "Reunião com gravadora",
        data: "2026-08-27",
        horario: "14:30",
        tipo: "Reunião",
        nota: "Apresentar análise de tendências eletrônicas.",
        status: "agendado"
    },
    {
        id: 2,
        titulo: "Sessão de produção",
        data: "2026-08-28",
        horario: "16:00",
        tipo: "Gravação",
        nota: "Finalização do projeto Brazilian Phonk.",
        status: "agendado"
    },
    {
        id: 3,
        titulo: "Festival SoundFy",
        data: "2026-08-30",
        horario: "19:00",
        tipo: "Show / Evento",
        nota: "Revisar line-up e oportunidades.",
        status: "agendado"
    }
];

let compromissos = JSON.parse(
    localStorage.getItem(chaveArmazenamentoCompromissos) || "null"
) || compromissosPadrao;

let dataCalendario = new Date(2026, 7, 1);

function salvarCompromissos() {
    localStorage.setItem(
        chaveArmazenamentoCompromissos,
        JSON.stringify(compromissos)
    );
}

function formatarData(dataTexto) {
    const data = new Date(dataTexto + "T00:00:00");

    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short"
    });
}

function obterRotuloStatus(status) {
    if (status === "concluido") {
        return "Concluído";
    }

    if (status === "cancelado") {
        return "Cancelado";
    }

    return "Agendado";
}

function renderizarCalendario() {
    const calendario = document.getElementById("calendario");

    if (!calendario) {
        return;
    }

    calendario.innerHTML = "";

    const ano = dataCalendario.getFullYear();
    const mes = dataCalendario.getMonth();

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    for (let indice = 0; indice < primeiroDia; indice++) {
        const diaVazio = document.createElement("div");
        diaVazio.className = "calendario-dia";
        calendario.appendChild(diaVazio);
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const celula = document.createElement("div");
        const numero = document.createElement("span");

        celula.className = "calendario-dia mes-atual";
        numero.className = "calendario-numero";
        numero.textContent = dia;

        const chaveData =
            ano +
            "-" +
            String(mes + 1).padStart(2, "0") +
            "-" +
            String(dia).padStart(2, "0");

        if (chaveData === "2026-08-27") {
            celula.classList.add("hoje");
        }

        const temCompromisso = compromissos.some(function(compromisso) {
            return (
                compromisso.data === chaveData &&
                compromisso.status !== "cancelado"
            );
        });

        if (temCompromisso) {
            const ponto = document.createElement("i");
            ponto.className = "calendario-ponto-evento";
            celula.appendChild(ponto);
        }

        celula.appendChild(numero);

        celula.onclick = function() {
            document.getElementById("dataCompromisso").value = chaveData;
            abrirModalCompromisso();
        };

        calendario.appendChild(celula);
    }
}

function renderizarCompromissos() {
    const lista = document.getElementById("listaCompromissos");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    const compromissosOrdenados = compromissos.slice().sort(function(a, b) {
        return (
            new Date(a.data + "T" + a.horario) -
            new Date(b.data + "T" + b.horario)
        );
    });

    document.getElementById("contagemCompromissos").textContent =
        compromissosOrdenados.length;

    if (compromissosOrdenados.length === 0) {
        const vazio = document.createElement("div");
        vazio.className = "estado-vazio";
        vazio.textContent = "Nenhum compromisso cadastrado.";
        lista.appendChild(vazio);
    }

    compromissosOrdenados.forEach(function(compromisso) {
        const cartao = document.createElement("div");
        const topo = document.createElement("div");
        const titulo = document.createElement("strong");
        const status = document.createElement("span");
        const meta = document.createElement("div");

        cartao.className = "compromisso " + compromisso.status;
        topo.className = "compromisso-topo";
        titulo.className = "compromisso-titulo";
        status.className = "compromisso-status " + compromisso.status;
        meta.className = "compromisso-meta";

        titulo.textContent = compromisso.titulo;
        status.textContent = obterRotuloStatus(compromisso.status);

        meta.innerHTML =
            "<span>◷ " +
            formatarData(compromisso.data) +
            "</span>" +
            "<span>• " +
            compromisso.horario +
            "</span>" +
            "<span>• " +
            compromisso.tipo +
            "</span>";

        topo.appendChild(titulo);
        topo.appendChild(status);

        cartao.appendChild(topo);
        cartao.appendChild(meta);

        if (compromisso.nota) {
            const nota = document.createElement("p");
            nota.className = "compromisso-nota";
            nota.textContent = compromisso.nota;
            cartao.appendChild(nota);
        }

        if (compromisso.status === "agendado") {
            const acoes = document.createElement("div");
            const botaoConcluir = document.createElement("button");
            const botaoCancelar = document.createElement("button");

            acoes.className = "compromisso-acoes";

            botaoConcluir.className = "acao-pequena concluir";
            botaoConcluir.textContent = "Marcar como concluído";

            botaoCancelar.className = "acao-pequena cancelar";
            botaoCancelar.textContent = "Cancelar";

            botaoConcluir.onclick = function() {
                atualizarStatusCompromisso(compromisso.id, "concluido");
            };

            botaoCancelar.onclick = function() {
                atualizarStatusCompromisso(compromisso.id, "cancelado");
            };

            acoes.appendChild(botaoConcluir);
            acoes.appendChild(botaoCancelar);
            cartao.appendChild(acoes);
        }

        lista.appendChild(cartao);
    });

    atualizarEstatisticasAgenda();
}

function atualizarStatusCompromisso(id, status) {
    compromissos = compromissos.map(function(compromisso) {
        if (compromisso.id === id) {
            return {
                ...compromisso,
                status: status
            };
        }

        return compromisso;
    });

    salvarCompromissos();
    renderizarCalendario();
    renderizarCompromissos();
}

function atualizarEstatisticasAgenda() {
    const agendados = compromissos.filter(function(compromisso) {
        return compromisso.status === "agendado";
    }).length;

    const concluidos = compromissos.filter(function(compromisso) {
        return compromisso.status === "concluido";
    }).length;

    const cancelados = compromissos.filter(function(compromisso) {
        return compromisso.status === "cancelado";
    }).length;

    const elementoAgendados = document.getElementById("contagemAgendados");
    const elementoConcluidos = document.getElementById("contagemConcluidos");
    const elementoCancelados = document.getElementById("contagemCancelados");

    if (elementoAgendados) {
        elementoAgendados.textContent = agendados;
    }

    if (elementoConcluidos) {
        elementoConcluidos.textContent = concluidos;
    }

    if (elementoCancelados) {
        elementoCancelados.textContent = cancelados;
    }
}

function abrirModalCompromisso() {
    const modal = document.getElementById("modalCompromisso");

    if (modal) {
        modal.classList.add("aberto");
    }
}

function fecharModalCompromisso() {
    const modal = document.getElementById("modalCompromisso");

    if (modal) {
        modal.classList.remove("aberto");
    }
}

const botaoAbrirCompromisso = document.getElementById("abrirCompromisso");
const botaoFecharCompromisso = document.getElementById("fecharCompromisso");
const botaoCancelarModal = document.getElementById("cancelarModal");
const formularioCompromisso = document.getElementById("formularioCompromisso");

if (botaoAbrirCompromisso) {
    botaoAbrirCompromisso.onclick = abrirModalCompromisso;
}

if (botaoFecharCompromisso) {
    botaoFecharCompromisso.onclick = fecharModalCompromisso;
}

if (botaoCancelarModal) {
    botaoCancelarModal.onclick = fecharModalCompromisso;
}

if (formularioCompromisso) {
    formularioCompromisso.onsubmit = function(evento) {
        evento.preventDefault();

        const novoCompromisso = {
            id: Date.now(),
            titulo: document.getElementById("tituloCompromisso").value,
            data: document.getElementById("dataCompromisso").value,
            horario: document.getElementById("horarioCompromisso").value,
            tipo: document.getElementById("tipoCompromisso").value,
            nota: document.getElementById("notaCompromisso").value,
            status: "agendado"
        };

        compromissos.push(novoCompromisso);
        salvarCompromissos();
        renderizarCalendario();
        renderizarCompromissos();

        formularioCompromisso.reset();
        fecharModalCompromisso();
    };
}

const botaoMesAnterior = document.getElementById("mesAnterior");
const botaoProximoMes = document.getElementById("proximoMes");

if (botaoMesAnterior) {
    botaoMesAnterior.onclick = function() {
        dataCalendario.setMonth(dataCalendario.getMonth() - 1);
        renderizarCalendario();
    };
}

if (botaoProximoMes) {
    botaoProximoMes.onclick = function() {
        dataCalendario.setMonth(dataCalendario.getMonth() + 1);
        renderizarCalendario();
    };
}

renderizarCalendario();
renderizarCompromissos();
const dadosRegioes = {
    "Norte": {
        resumo: { pontuacaoTotal: 1199350, registros: 23766, cidades: 2, musicas: 855, mediaPorCidade: 599675 },
        generos: [{ nome: "Arrocha", pontos: 271702 }, { nome: "Sertanejo", pontos: 244869 }, { nome: "Outros", pontos: 156204 }, { nome: "Forró/Piseiro", pontos: 147480 }, { nome: "Funk", pontos: 116310 }, { nome: "Trap/Rap/Hip-Hop", pontos: 105450 }, { nome: "Pop", pontos: 79192 }, { nome: "Não identificado", pontos: 20018 }, { nome: "Samba/Pagode", pontos: 18337 }, { nome: "R&B/Soul", pontos: 15391 }],
        artistas: [{ nome: "Henrique & Juliano", pontos: 34310 }, { nome: "Gusttavo Lima", pontos: 33089 }, { nome: "Felipe Amorim", pontos: 26335 }, { nome: "Marília Mendonça, Maiara & Maraisa", pontos: 25399 }, { nome: "João Gomes", pontos: 25140 }, { nome: "Zé Neto & Cristiano", pontos: 23610 }, { nome: "Marília Mendonça", pontos: 20544 }, { nome: "Jorge & Mateus", pontos: 17977 }, { nome: "MC Rogerinho", pontos: 14897 }, { nome: "Kadu Martins", pontos: 14821 }],
        cidades: [{ cidade: "Manaus", pontuacao: 599679 }, { cidade: "Belém", pontuacao: 599671 }]
    },
    "Nordeste": {
        resumo: { pontuacaoTotal: 1798715, registros: 35646, cidades: 3, musicas: 990, mediaPorCidade: 599572 },
        generos: [{ nome: "Arrocha", pontos: 386233 }, { nome: "Sertanejo", pontos: 303250 }, { nome: "Forró/Piseiro", pontos: 300036 }, { nome: "Trap/Rap/Hip-Hop", pontos: 212023 }, { nome: "Outros", pontos: 197857 }, { nome: "Funk", pontos: 164163 }, { nome: "Pop", pontos: 106049 }, { nome: "Não identificado", pontos: 35223 }, { nome: "Samba/Pagode", pontos: 33904 }, { nome: "R&B/Soul", pontos: 32854 }],
        artistas: [{ nome: "Felipe Amorim", pontos: 53200 }, { nome: "João Gomes", pontos: 51032 }, { nome: "Gusttavo Lima", pontos: 39908 }, { nome: "Henrique & Juliano", pontos: 38754 }, { nome: "NATTAN", pontos: 33047 }, { nome: "Marília Mendonça, Maiara & Maraisa", pontos: 31360 }, { nome: "Marília Mendonça", pontos: 26974 }, { nome: "Zé Neto & Cristiano", pontos: 25186 }, { nome: "MC Rogerinho", pontos: 24495 }, { nome: "Jorge & Mateus", pontos: 22602 }],
        cidades: [{ cidade: "Fortaleza", pontuacao: 599606 }, { cidade: "Salvador", pontuacao: 599566 }, { cidade: "Recife", pontuacao: 599543 }]
    },
    "Centro-Oeste": {
        resumo: { pontuacaoTotal: 2400386, registros: 47544, cidades: 4, musicas: 1039, mediaPorCidade: 600096 },
        generos: [{ nome: "Sertanejo", pontos: 815703 }, { nome: "Arrocha", pontos: 737248 }, { nome: "Outros", pontos: 235833 }, { nome: "Funk", pontos: 177169 }, { nome: "Forró/Piseiro", pontos: 157074 }, { nome: "Trap/Rap/Hip-Hop", pontos: 112371 }, { nome: "Pop", pontos: 94988 }, { nome: "Não identificado", pontos: 21823 }, { nome: "Samba/Pagode", pontos: 20078 }, { nome: "R&B/Soul", pontos: 11579 }],
        artistas: [{ nome: "Henrique & Juliano", pontos: 161422 }, { nome: "Gusttavo Lima", pontos: 101378 }, { nome: "Zé Neto & Cristiano", pontos: 88694 }, { nome: "Jorge & Mateus", pontos: 60327 }, { nome: "Marília Mendonça, Maiara & Maraisa", pontos: 58701 }, { nome: "Hugo & Guilherme", pontos: 51801 }, { nome: "Luan Santana", pontos: 46821 }, { nome: "Matheus & Kauan", pontos: 46392 }, { nome: "Marília Mendonça", pontos: 36674 }, { nome: "Felipe Amorim", pontos: 34757 }],
        cidades: [{ cidade: "Goiânia", pontuacao: 600189 }, { cidade: "Campo Grande", pontuacao: 600154 }, { cidade: "Cuiabá", pontuacao: 600112 }, { cidade: "Brasília", pontuacao: 599931 }]
    },
    "Sudeste": {
        resumo: { pontuacaoTotal: 2389315, registros: 47336, cidades: 4, musicas: 1091, mediaPorCidade: 597329 },
        generos: [{ nome: "Sertanejo", pontos: 578388 }, { nome: "Arrocha", pontos: 539341 }, { nome: "Outros", pontos: 336926 }, { nome: "Trap/Rap/Hip-Hop", pontos: 285994 }, { nome: "Funk", pontos: 267330 }, { nome: "Forró/Piseiro", pontos: 137129 }, { nome: "Pop", pontos: 133524 }, { nome: "Samba/Pagode", pontos: 37639 }, { nome: "R&B/Soul", pontos: 31454 }, { nome: "Não identificado", pontos: 17835 }],
        artistas: [{ nome: "Henrique & Juliano", pontos: 97022 }, { nome: "Gusttavo Lima", pontos: 75757 }, { nome: "Zé Neto & Cristiano", pontos: 65771 }, { nome: "Marília Mendonça, Maiara & Maraisa", pontos: 51832 }, { nome: "Jorge & Mateus", pontos: 47603 }, { nome: "Luan Santana", pontos: 37598 }, { nome: "Marília Mendonça", pontos: 36169 }, { nome: "Matheus & Kauan", pontos: 33226 }, { nome: "Felipe Amorim", pontos: 31700 }, { nome: "Ana Castela", pontos: 25135 }],
        cidades: [{ cidade: "Campinas", pontuacao: 599976 }, { cidade: "São Paulo", pontuacao: 599785 }, { cidade: "Belo Horizonte", pontuacao: 594873 }, { cidade: "Rio de Janeiro", pontuacao: 594681 }]
    },
    "Sul": {
        resumo: { pontuacaoTotal: 1794943, registros: 35557, cidades: 3, musicas: 796, mediaPorCidade: 598314 },
        generos: [{ nome: "Sertanejo", pontos: 493251 }, { nome: "Arrocha", pontos: 440882 }, { nome: "Outros", pontos: 273321 }, { nome: "Funk", pontos: 189967 }, { nome: "Trap/Rap/Hip-Hop", pontos: 138636 }, { nome: "Forró/Piseiro", pontos: 100406 }, { nome: "Pop", pontos: 90377 }, { nome: "Samba/Pagode", pontos: 20370 }, { nome: "R&B/Soul", pontos: 16835 }, { nome: "Não identificado", pontos: 12909 }],
        artistas: [{ nome: "Henrique & Juliano", pontos: 74269 }, { nome: "Gusttavo Lima", pontos: 58887 }, { nome: "Zé Neto & Cristiano", pontos: 53558 }, { nome: "Jorge & Mateus", pontos: 38539 }, { nome: "Marília Mendonça, Maiara & Maraisa", pontos: 38428 }, { nome: "Luan Santana", pontos: 33758 }, { nome: "Matheus & Kauan", pontos: 29071 }, { nome: "Marília Mendonça", pontos: 25688 }, { nome: "Felipe Amorim", pontos: 23772 }, { nome: "Ana Castela", pontos: 23720 }],
        cidades: [{ cidade: "Curitiba", pontuacao: 600077 }, { cidade: "Porto Alegre", pontuacao: 599961 }, { cidade: "Florianópolis", pontuacao: 594905 }]
    },
};
function normalizarTextoRegiao(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[\s-]/g, "");
}

const chaveNormalizadaRegioes = {};
Object.keys(dadosRegioes).forEach(function(nomeRegiao) {
    chaveNormalizadaRegioes[normalizarTextoRegiao(nomeRegiao)] = nomeRegiao;
});

function formatarNumeroRegiao(numero) {
    return numero.toLocaleString("pt-BR");
}

function renderizarBarraRegiao(nome, pontos, maiorValor) {
    const largura = Math.max(4, Math.round((pontos / maiorValor) * 100));

    return (
        '<div class="regiao">' +
        "<strong>" + nome + "</strong>" +
        '<span><i style="width:' + largura + '%"></i></span>' +
        "<b>" + formatarNumeroRegiao(pontos) + "</b>" +
        "</div>"
    );
}

function buscarRegiao() {
    const campo = document.getElementById("campoRegiao");
    const mensagem = document.getElementById("mensagemRegiao");
    const resultado = document.getElementById("resultadoRegiao");

    if (!campo) {
        return;
    }

    const chave = normalizarTextoRegiao(campo.value || "");
    const nomeRegiao = chaveNormalizadaRegioes[chave];

    if (!nomeRegiao) {
        resultado.style.display = "none";
        mensagem.style.display = "block";
        mensagem.textContent =
            "Região não encontrada. Tente: Norte, Nordeste, Centro-Oeste, Sudeste ou Sul.";
        return;
    }

    mensagem.style.display = "none";
    resultado.style.display = "block";

    const dados = dadosRegioes[nomeRegiao];

    document.getElementById("kpiPontuacao").textContent = formatarNumeroRegiao(dados.resumo.pontuacaoTotal);
    document.getElementById("kpiRegistros").textContent = formatarNumeroRegiao(dados.resumo.registros);
    document.getElementById("kpiCidades").textContent = dados.resumo.cidades;
    document.getElementById("kpiMusicas").textContent = formatarNumeroRegiao(dados.resumo.musicas);
    document.getElementById("kpiMedia").textContent = formatarNumeroRegiao(dados.resumo.mediaPorCidade);

    document.getElementById("tituloGenerosRegiao").textContent = "Gêneros em alta — " + nomeRegiao;
    document.getElementById("tituloArtistasRegiao").textContent = "Artistas em alta — " + nomeRegiao;
    document.getElementById("tituloCidadesRegiao").textContent = "Cidades analisadas — " + nomeRegiao;

    const maiorGenero = dados.generos[0].pontos;
    document.getElementById("listaGenerosRegiao").innerHTML = dados.generos
        .map(function(g) { return renderizarBarraRegiao(g.nome, g.pontos, maiorGenero); })
        .join("");

    const maiorArtista = dados.artistas[0].pontos;
    document.getElementById("listaArtistasRegiao").innerHTML = dados.artistas
        .map(function(a) { return renderizarBarraRegiao(a.nome, a.pontos, maiorArtista); })
        .join("");

    const maiorCidade = dados.cidades[0].pontuacao;
    document.getElementById("listaCidadesRegiao").innerHTML = dados.cidades
        .map(function(c) { return renderizarBarraRegiao(c.cidade, c.pontuacao, maiorCidade); })
        .join("");
}

const botaoBuscarRegiao = document.getElementById("botaoBuscarRegiao");
const campoRegiao = document.getElementById("campoRegiao");

if (botaoBuscarRegiao && campoRegiao) {
    botaoBuscarRegiao.onclick = buscarRegiao;

    campoRegiao.addEventListener("keydown", function(evento) {
        if (evento.key === "Enter") {
            buscarRegiao();
        }
    });

    buscarRegiao();
}
