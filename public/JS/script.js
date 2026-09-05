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
