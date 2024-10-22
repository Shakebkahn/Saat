document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-picker');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');
    const sunTimesDiv = document.getElementById('sun-times');

    const timeSlots = [
        "Mushtari", "Marekh", "Shams", "Zohra", "Attarad", "Qamar", "Zuhal"
    ];
    
    const planets = ["Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn"];

    const createTimeSlots = (tableId, sunrise, sunset) => {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = '';  // Clear any existing rows

        let startTime = new Date(sunrise).getTime();
        let endTime = new Date(sunset).getTime();
        let totalDuration = endTime - startTime;
        let slotDuration = totalDuration / timeSlots.length;

        timeSlots.forEach((saat, index) => {
            const row = document.createElement('tr');
            const endSlotTime = new Date(startTime + slotDuration).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            row.innerHTML = `<td>${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endSlotTime}</td><td>${saat}</td><td>${planets[index]}</td>`;
            tableBody.appendChild(row);
            startTime += slotDuration;
        });
    };

    const createNightTimeSlots = (tableId, sunset, sunrise) => {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = '';  // Clear any existing rows

        let startTime = new Date(sunset).getTime();
        let endTime = new Date(new Date(sunset).setDate(new Date(sunset).getDate() + 1) + " " + sunrise.split("T")[1]).getTime(); // Next day for sunrise
        let totalDuration = endTime - startTime;
        let slotDuration = totalDuration / timeSlots.length;

        timeSlots.forEach((saat, index) => {
            const row = document.createElement('tr');
            const endSlotTime = new Date(startTime + slotDuration).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            row.innerHTML = `<td>${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endSlotTime}</td><td>${saat}</td><td>${planets[index]}</td>`;
            tableBody.appendChild(row);
            startTime += slotDuration;
        });
    };

    const fetchSunTimes = async (date) => {
        try {
            const coordinates = { lat: 24.8607, lng: 67.0011 }; // Coordinates for Karachi, Pakistan
            const apiUrl = `https://api.sunrise-sunset.org/json?lat=${coordinates.lat}&lng=${coordinates.lng}&date=${date}&formatted=0`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === 'OK') {
                updateSunTimes(data.results);
                createTimeSlots('day-table', data.results.sunrise, data.results.sunset);
                createNightTimeSlots('night-table', data.results.sunset, data.results.sunrise);
                highlightCurrentSaat(data.results.sunrise, data.results.sunset);
            } else {
                sunTimesDiv.innerText = 'Error fetching sun times.';
            }
        } catch (error) {
            sunTimesDiv.innerText = 'Error fetching sun times.';
        }
    };

    const updateSunTimes = (sunTimes) => {
        const sunrise = new Date(sunTimes.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(sunTimes.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        sunTimesDiv.innerText = `Sunrise: ${sunrise}, Sunset: ${sunset}`;
    };

    const highlightCurrentSaat = (sunrise, sunset) => {
        const now = new Date().getTime();
        const sunriseTime = new Date(sunrise).getTime();
        const sunsetTime = new Date(sunset).getTime();

        const dayTableBody = document.getElementById('day-table').querySelector('tbody');
        const nightTableBody = document.getElementById('night-table').querySelector('tbody');

        // Highlight current saat in the day table
        for (let row of dayTableBody.rows) {
            const cells = row.cells;
            const start = new Date(`1970-01-01T${cells[0].innerText.split(' - ')[0]}Z`).getTime();
            const end = new Date(`1970-01-01T${cells[0].innerText.split(' - ')[1]}Z`).getTime();
            if (now >= start && now < end) {
                row.classList.add('current-saat');
            }
        }

        // Highlight current saat in the night table
        for (let row of nightTableBody.rows) {
            const cells = row.cells;
            const start = new Date(`1970-01-01T${cells[0].innerText.split(' - ')[0]}Z`).getTime();
            const end = new Date(`1970-01-01T${cells[0].innerText.split(' - ')[1]}Z`).getTime();
            if (now >= start && now < end) {
                row.classList.add('current-saat');
            }
        }
    };

    dateInput.addEventListener('change', async (e) => {
        const selectedDate = e.target.value;
        fetchSunTimes(selectedDate);
    });

    dayTab.addEventListener('click', () => {
        dayTab.classList.add('active');
        nightTab.classList.remove('active');
        dayTime.classList.add('active');
        nightTime.classList.remove('active');
    });

    nightTab.addEventListener('click', () => {
        nightTab.classList.add('active');
        dayTab.classList.remove('active');
        nightTime.classList.add('active');
        dayTime.classList.remove('active');
    });

    // Initialize with current date
    dateInput.value = new Date().toISOString().split('T')[0];
    fetchSunTimes(dateInput.value);
});
