// Calendar.js
document.addEventListener('DOMContentLoaded', () => {
    const nowButton = document.getElementById('now');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const addEventButton = document.getElementById('add-event');
    const currentMonthDiv = document.querySelector('.current-month');
    const datesDiv = document.querySelector('.dates');
    const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
    const eventForm = document.getElementById('eventForm');
    const saveEventButton = document.getElementById('saveEvent');
    const deleteEventButton = document.getElementById('deleteEvent');
    const closeEventButton = document.getElementById('closeEventButton');
    const closeModalButton = document.querySelector('.btn-close');

    let today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
    let editingEvent = null;

    function renderCalendar(year, month) {
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();
        const totalCalendarDays = 42; // 6 weeks * 7 days

        datesDiv.innerHTML = '';

        const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
        currentMonthDiv.textContent = `${year}, ${monthName}`;

        for (let i = 0; i < totalCalendarDays; i++) {
            const dateDiv = document.createElement('div');
            dateDiv.classList.add('date');

            const dayNumberDiv = document.createElement('div');
            dayNumberDiv.classList.add('day-number');

            if (i < firstDayOfMonth) {
                dateDiv.classList.add('prev-month');
                dayNumberDiv.textContent = prevMonthDays - firstDayOfMonth + 1 + i;
            } else if (i >= firstDayOfMonth + daysInMonth) {
                dateDiv.classList.add('next-month');
                dayNumberDiv.textContent = i - firstDayOfMonth - daysInMonth + 1;
            } else {
                const day = i - firstDayOfMonth + 1;
                dayNumberDiv.textContent = day;
                dateDiv.dataset.year = year;
                dateDiv.dataset.month = month + 1;
                dateDiv.dataset.day = day;

                if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                    dateDiv.classList.add('today');
                }

                dateDiv.addEventListener('click', () => openEventModal(year, month + 1, day));
            }

            dateDiv.appendChild(dayNumberDiv);
            datesDiv.appendChild(dateDiv);
        }

        displayEvents();
    }

    function openEventModal(year, month, day) {
        editingEvent = null;
        document.getElementById('eventModalLabel').textContent = 'Add Event';
        saveEventButton.textContent = 'Save';
        deleteEventButton.classList.add('d-none');
        eventForm.reset();
        document.getElementById('eventDate').value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        eventModal.show();
    }

    function openEditEventModal(eventData) {
        editingEvent = eventData;
        document.getElementById('eventModalLabel').textContent = 'Edit Event';
        saveEventButton.textContent = 'Edit';
        deleteEventButton.classList.remove('d-none');
        document.getElementById('eventDate').value = eventData.date;
        document.getElementById('eventTime').value = eventData.time;
        document.getElementById('eventDescription').value = eventData.description;
        eventModal.show();
    }

    function displayEvents() {
        let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

        events.forEach(eventData => {
            const { year, month, day, time, description } = eventData;
            const dateElement = document.querySelector(`[data-year='${year}'][data-month='${month}'][data-day='${day}']`);

            if (dateElement) {
                const eventElement = document.createElement('div');
                eventElement.innerHTML = `<strong>${time}</strong> ${description}`;
                eventElement.classList.add('event');
                eventElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openEditEventModal(eventData);
                });
                dateElement.appendChild(eventElement);
            }
        });
    }

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;
        const description = document.getElementById('eventDescription').value;

        const eventData = {
            year: parseInt(date.split('-')[0]),
            month: parseInt(date.split('-')[1]),
            day: parseInt(date.split('-')[2]),
            date: date,
            time: time,
            description: description
        };

        let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

        if (editingEvent) {
            const index = events.findIndex(event => event.date === editingEvent.date && event.time === editingEvent.time);
            events[index] = eventData;
        } else {
            events.push(eventData);
        }

        localStorage.setItem('calendarEvents', JSON.stringify(events));
        eventModal.hide();
        renderCalendar(currentYear, currentMonth);
    });

    deleteEventButton.addEventListener('click', () => {
        if (editingEvent) {
            let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
            events = events.filter(event => !(event.date === editingEvent.date && event.time === editingEvent.time));
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            eventModal.hide();
            renderCalendar(currentYear, currentMonth);
        }
    });

    const closeModal = () => {
        eventForm.reset();
        eventModal.hide();
    };

    closeEventButton.addEventListener('click', closeModal);
    closeModalButton.addEventListener('click', closeModal);

    nowButton.addEventListener('click', () => {
        today = new Date();
        currentYear = today.getFullYear();
        currentMonth = today.getMonth();
        renderCalendar(currentYear, currentMonth);
    });

    prevMonthButton.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentYear, currentMonth);
    });

    nextMonthButton.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentYear, currentMonth);
    });

    addEventButton.addEventListener('click', () => {
        openEventModal(currentYear, currentMonth + 1, today.getDate());
    });

    renderCalendar(currentYear, currentMonth);
});
