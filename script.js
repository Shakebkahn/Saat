document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-picker');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');
    const sunTimesDiv = document.getElementById('sun-times');
    const latitudeElement = document.getElementById('latitude');
    const longitudeElement = document.getElementById('longitude');

    let userLatitude = 24.8607;  // Default: Karachi
    let userLongitude = 67.0011; // Default: Karachi

    // 12 saatain for day and 12 for night
    const saatain = [
        { naam: "Mushtari", planet: "Jupiter" },
        { naam: "Marekh", planet: "Mars" },
        { naam: "Shams", planet: "Sun" },
        { naam: "Zohra", planet: "Venus" },
        { naam: "Attarad", planet: "Mercury" },
        { naam: "Qamar", planet: "Moon" },
        { naam: "Zuhal", planet: "Saturn" },
        { naam: "Mushtari", planet: "Jupiter" },
        { naam: "Marekh", planet: "Mars" },
        { naam: "Shams", planet: "Sun" },
        { naam: "Zohra", planet: "Venus" },
        { naam: "Attarad", planet: "Mercury" }
    ];

    const convertToLocalTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    // Create the time slots for day and night
    const createTimeSlots = (tableId, startTime, endTime) => {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = '';  // Clear any existing rows

        let currentTime = new Date(startTime);
        let endDate = new Date(endTime);
        const totalDuration = endDate - currentTime;
        const slotDuration = totalDuration / saatain.length;

        const highlightTime = new Date(); // Current time for highlighting

        saatain.forEach((saat) => {
            const row = document.createElement('tr');
            const slotEndTime = new Date(currentTime.getTime() + slotDuration);

            row.innerHTML = `<td>${convertToLocalTime(currentTime)} - ${convertToLocalTime(slotEndTime)}</td><td>${saat.naam}</td><td>${saat.planet}</td>`;

            // Highlight the current saat if it's within the time range
            if (highlightTime >= currentTime && highlightTime < slotEndTime) {
                row.classList.add('highlight-current');
            }

            tableBody.appendChild(row);
            currentTime = slotEndTime; // Move to the next time slot
        });
    };

    // Fetch sunrise and sunset times
    const fetchSunTimes = async (date) => {
        try {
            const coordinates = { lat: userLatitude, lng: userLongitude };
            const apiUrl = `https://api.sunrise-sunset.org/json?lat=${coordinates.lat}&lng=${coordinates.lng}&date=${date}&formatted=0`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === 'OK') {
                const sunrise = new Date(data.results.sunrise).toLocaleString("en-US", { timeZone: "Asia/Karachi" });
                const sunset = new Date(data.results.sunset).toLocaleString("en-US", { timeZone: "Asia/Karachi" });

                // Update sun times and create slots
                updateSunTimes(sunrise, sunset);
                createTimeSlots('day-table', sunrise, sunset);
                createTimeSlots('night-table', sunset, new Date(new Date(sunrise).getTime() + 24 * 60 * 60 * 1000)); // Night slots for next day's sunrise
            } else {
                sunTimesDiv.innerText = 'Error fetching sun times.';
            }
        } catch (error) {
            sunTimesDiv.innerText = 'Error fetching sun times.';
        }
    };

    const updateSunTimes = (sunrise, sunset) => {
        const formattedSunrise = new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const formattedSunset = new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        sunTimesDiv.innerText = `Sunrise: ${formattedSunrise}, Sunset: ${formattedSunset}`;
    };

    // Initialize with current date and fetch sun times
    dateInput.value = new Date().toISOString().split('T')[0];
    fetchSunTimes(dateInput.value);

    // Add event listeners for tab switching
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

    // Change event for date picker
    dateInput.addEventListener('change', (e) => {
        const selectedDate = e.target.value;
        fetchSunTimes(selectedDate);
    });
});
