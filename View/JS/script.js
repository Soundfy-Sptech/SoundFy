const themeButton = document.getElementById("theme");
const menuButton = document.getElementById("menu");
const sidebar = document.querySelector(".sidebar");

function setTheme(themeName) {
    document.documentElement.setAttribute("data-theme", themeName);

    if (themeButton) {
        themeButton.textContent = themeName === "light" ? "☾" : "☀";
    }

    document.querySelectorAll("[data-theme-choice]").forEach(function(choice) {
        choice.classList.toggle(
            "selected",
            choice.dataset.themeChoice === themeName
        );
    });
}

const savedTheme = localStorage.getItem("soundfy-theme") || "dark";
setTheme(savedTheme);

if (themeButton) {
    themeButton.onclick = function() {
        const nextTheme =
            document.documentElement.dataset.theme === "dark"
                ? "light"
                : "dark";

        localStorage.setItem("soundfy-theme", nextTheme);
        setTheme(nextTheme);
    };
}

document.querySelectorAll("[data-theme-choice]").forEach(function(choice) {
    choice.onclick = function() {
        const selectedTheme = choice.dataset.themeChoice;

        localStorage.setItem("soundfy-theme", selectedTheme);
        setTheme(selectedTheme);
    };
});

if (menuButton && sidebar) {
    menuButton.onclick = function() {
        sidebar.classList.toggle("mobile-open");
    };
}

document.querySelectorAll(".primary").forEach(function(button) {
    if (button.id === "openAppointment") {
        return;
    }

    button.addEventListener("click", function() {
        if (button.textContent.includes("Salvar alterações")) {
            const originalText = button.textContent;
            button.textContent = "Salvo ✓";

            setTimeout(function() {
                button.textContent = originalText;
            }, 1500);
        }
    });
});

/* Agenda */

const appointmentStorageKey = "soundfy-appointments";

const defaultAppointments = [
    {
        id: 1,
        title: "Reunião com gravadora",
        date: "2026-08-27",
        time: "14:30",
        type: "Reunião",
        note: "Apresentar análise de tendências eletrônicas.",
        status: "scheduled"
    },
    {
        id: 2,
        title: "Sessão de produção",
        date: "2026-08-28",
        time: "16:00",
        type: "Gravação",
        note: "Finalização do projeto Brazilian Phonk.",
        status: "scheduled"
    },
    {
        id: 3,
        title: "Festival SoundFy",
        date: "2026-08-30",
        time: "19:00",
        type: "Show / Evento",
        note: "Revisar line-up e oportunidades.",
        status: "scheduled"
    }
];

let appointments = JSON.parse(
    localStorage.getItem(appointmentStorageKey) || "null"
) || defaultAppointments;

let calendarDate = new Date(2026, 7, 1);

function saveAppointments() {
    localStorage.setItem(
        appointmentStorageKey,
        JSON.stringify(appointments)
    );
}

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short"
    });
}

function getStatusLabel(status) {
    if (status === "completed") {
        return "Concluído";
    }

    if (status === "cancelled") {
        return "Cancelado";
    }

    return "Agendado";
}

function renderCalendar() {
    const calendar = document.getElementById("calendar");

    if (!calendar) {
        return;
    }

    calendar.innerHTML = "";

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let index = 0; index < firstDay; index++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "calendar-day";
        calendar.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        const number = document.createElement("span");

        cell.className = "calendar-day current-month";
        number.className = "calendar-number";
        number.textContent = day;

        const dateKey =
            year +
            "-" +
            String(month + 1).padStart(2, "0") +
            "-" +
            String(day).padStart(2, "0");

        if (dateKey === "2026-08-27") {
            cell.classList.add("today");
        }

        const hasAppointment = appointments.some(function(appointment) {
            return (
                appointment.date === dateKey &&
                appointment.status !== "cancelled"
            );
        });

        if (hasAppointment) {
            const dot = document.createElement("i");
            dot.className = "calendar-event-dot";
            cell.appendChild(dot);
        }

        cell.appendChild(number);

        cell.onclick = function() {
            document.getElementById("appointmentDate").value = dateKey;
            openAppointmentModal();
        };

        calendar.appendChild(cell);
    }
}

function renderAppointments() {
    const list = document.getElementById("appointmentList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    const orderedAppointments = appointments.slice().sort(function(a, b) {
        return (
            new Date(a.date + "T" + a.time) -
            new Date(b.date + "T" + b.time)
        );
    });

    document.getElementById("appointmentCount").textContent =
        orderedAppointments.length;

    if (orderedAppointments.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "Nenhum compromisso cadastrado.";
        list.appendChild(empty);
    }

    orderedAppointments.forEach(function(appointment) {
        const card = document.createElement("div");
        const top = document.createElement("div");
        const title = document.createElement("strong");
        const status = document.createElement("span");
        const meta = document.createElement("div");

        card.className = "appointment " + appointment.status;
        top.className = "appointment-top";
        title.className = "appointment-title";
        status.className = "appointment-status " + appointment.status;
        meta.className = "appointment-meta";

        title.textContent = appointment.title;
        status.textContent = getStatusLabel(appointment.status);

        meta.innerHTML =
            "<span>◷ " +
            formatDate(appointment.date) +
            "</span>" +
            "<span>• " +
            appointment.time +
            "</span>" +
            "<span>• " +
            appointment.type +
            "</span>";

        top.appendChild(title);
        top.appendChild(status);

        card.appendChild(top);
        card.appendChild(meta);

        if (appointment.note) {
            const note = document.createElement("p");
            note.className = "appointment-note";
            note.textContent = appointment.note;
            card.appendChild(note);
        }

        if (appointment.status === "scheduled") {
            const actions = document.createElement("div");
            const completeButton = document.createElement("button");
            const cancelButton = document.createElement("button");

            actions.className = "appointment-actions";

            completeButton.className = "small-action complete";
            completeButton.textContent = "Marcar como concluído";

            cancelButton.className = "small-action cancel";
            cancelButton.textContent = "Cancelar";

            completeButton.onclick = function() {
                updateAppointmentStatus(appointment.id, "completed");
            };

            cancelButton.onclick = function() {
                updateAppointmentStatus(appointment.id, "cancelled");
            };

            actions.appendChild(completeButton);
            actions.appendChild(cancelButton);
            card.appendChild(actions);
        }

        list.appendChild(card);
    });

    updateAgendaStats();
}

function updateAppointmentStatus(id, status) {
    appointments = appointments.map(function(appointment) {
        if (appointment.id === id) {
            return {
                ...appointment,
                status: status
            };
        }

        return appointment;
    });

    saveAppointments();
    renderCalendar();
    renderAppointments();
}

function updateAgendaStats() {
    const scheduled = appointments.filter(function(appointment) {
        return appointment.status === "scheduled";
    }).length;

    const completed = appointments.filter(function(appointment) {
        return appointment.status === "completed";
    }).length;

    const cancelled = appointments.filter(function(appointment) {
        return appointment.status === "cancelled";
    }).length;

    const scheduledElement = document.getElementById("scheduledCount");
    const completedElement = document.getElementById("completedCount");
    const cancelledElement = document.getElementById("cancelledCount");

    if (scheduledElement) {
        scheduledElement.textContent = scheduled;
    }

    if (completedElement) {
        completedElement.textContent = completed;
    }

    if (cancelledElement) {
        cancelledElement.textContent = cancelled;
    }
}

function openAppointmentModal() {
    const modal = document.getElementById("appointmentModal");

    if (modal) {
        modal.classList.add("open");
    }
}

function closeAppointmentModal() {
    const modal = document.getElementById("appointmentModal");

    if (modal) {
        modal.classList.remove("open");
    }
}

const openAppointmentButton = document.getElementById("openAppointment");
const closeAppointmentButton = document.getElementById("closeAppointment");
const cancelModalButton = document.getElementById("cancelModal");
const appointmentForm = document.getElementById("appointmentForm");

if (openAppointmentButton) {
    openAppointmentButton.onclick = openAppointmentModal;
}

if (closeAppointmentButton) {
    closeAppointmentButton.onclick = closeAppointmentModal;
}

if (cancelModalButton) {
    cancelModalButton.onclick = closeAppointmentModal;
}

if (appointmentForm) {
    appointmentForm.onsubmit = function(event) {
        event.preventDefault();

        const newAppointment = {
            id: Date.now(),
            title: document.getElementById("appointmentTitle").value,
            date: document.getElementById("appointmentDate").value,
            time: document.getElementById("appointmentTime").value,
            type: document.getElementById("appointmentType").value,
            note: document.getElementById("appointmentNote").value,
            status: "scheduled"
        };

        appointments.push(newAppointment);
        saveAppointments();
        renderCalendar();
        renderAppointments();

        appointmentForm.reset();
        closeAppointmentModal();
    };
}

const previousMonthButton = document.getElementById("previousMonth");
const nextMonthButton = document.getElementById("nextMonth");

if (previousMonthButton) {
    previousMonthButton.onclick = function() {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderCalendar();
    };
}

if (nextMonthButton) {
    nextMonthButton.onclick = function() {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderCalendar();
    };
}

renderCalendar();
renderAppointments();
