document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-picker');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');
    const sunTimesDiv = document.getElementById('sun-times');

    const timeSlots = [
        { duration: 30, saat: "Mushtari", planet: "Jupiter" },
        { duration: 75, saat: "Marekh", planet: "Mars" },
        { duration: 75, saat: "Shams", planet: "Sun" },
        { duration: 75, saat: "Zohra", planet: "Venus" },
        { duration: 75, saat: "Attarad", planet: "Mercury" },
        { duration: 75, saat: "Qamar", planet: "Moon" },
        { duration: 75, saat: "Zuhal", planet: "Saturn" }
    ];

    const createTimeSlots = (tableId, sunrise, sunset) => {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = '';  // Clear any existing rows

        let startTime = new Date(`1970-01-01T${sunrise}Z`).getTime();
        let endTime = new Date(`1970-01-01T${sunset}Z`).getTime();

        timeSlots.forEach(slot => {
            const row = document.createElement('tr');
            const endSlotTime = new Date(startTime + slot.duration * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            row.innerHTML = `<td>${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endSlotTime}</td><td>${slot.saat}</td><td>${slot.planet}</td>`;
            tableBody.appendChild(row);
            startTime += slot.duration * 60 * 1000;
        });
    };

    const fetchSunTimes = async (date) => {
        try {
            const coordinates = { lat: 24.8607, lng: 67.0011 }; // Coordinates for Karachi, Pakistan
            const apiUrl = `https://api.sunrise-sunset.org/json?lat=${coordinates.lat}&lng=${coordinates.lng}&date=${date}&formatted=0`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if(data.status === 'OK') {
                updateSunTimes(data.results);
                createTimeSlots('day-table', data.results.sunrise, data.results.sunset);
                // You can add a similar function to calculate night slots from sunset to sunrise if needed
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

    dateInput.addEventListener('change', async (e) => {
        const selectedDate = e.target.value;
        fetchSunTimes(selectedDate);
    });

    dayTab.addEventListener('click', () => {
        dayTime.classList.add('active');
        nightTime.classList.remove('active');
    });

    nightTab.addEventListener('click', () => {
        nightTime.classList.add('active');
        dayTime.classList.remove('active');
    });

    // Initialize with current date
    dateInput.value = new Date().toISOString().split('T')[0];
    fetchSunTimes(dateInput.value);
});
