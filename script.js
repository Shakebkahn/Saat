document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-picker');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');
    const sunTimesDiv = document.getElementById('sun-times');
    const latitudeElement = document.getElementById('latitude');
    const longitudeElement = document.getElementById('longitude');
    const dateDisplay = document.getElementById('current-date'); // Display current date

    let userLatitude = 24.8607;  // Default: Karachi
    let userLongitude = 67.0011; // Default: Karachi

    const timeSlots = [
        { name: "Mushtari", number: 2 },
        { name: "Marekh", number: 1 },
        { name: "Shams", number: 1 },
        { name: "Zohra", number: 6 },
        { name: "Attarad", number: 5 },
        { name: "Qamar", number: 3 },
        { name: "Zuhal", number: 7 },
    ];

    const convertToLocalTime = (utcTime) => {
        const date = new Date(utcTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const createTimeSlots = (tableId, startTime, endTime) => {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = '';  // Clear any existing rows

        let currentTime = new Date(startTime).getTime();
        let endSlotTime = new Date(endTime).getTime();
        const totalDuration = endSlotTime - currentTime;
        const slotDuration = totalDuration / 12; // 12 slots for day/night

        for (let i = 0; i < 12; i++) {
            const row = document.createElement('tr');
            const endSlot = new Date(currentTime + slotDuration);
            const slotTime = `${convertToLocalTime(currentTime)} - ${convertToLocalTime(endSlot)}`;
            const saat = timeSlots[i % timeSlots.length]; // Cycle through time slots

            row.innerHTML = `<td>${slotTime}</td><td>${saat.name}</td><td>${saat.number}</td>`;

            // Highlight the current saat
            if (new Date().getTime() >= currentTime && new Date().getTime() < endSlotTime) {
                row.classList.add('highlight-current');
            }

            tableBody.appendChild(row);
            currentTime += slotDuration;
        }
    };

    const fetchSunTimes = async (date) => {
        try {
            const coordinates = { lat: userLatitude, lng: userLongitude };
            const apiUrl = `https://api.sunrise-sunset.org/json?lat=${coordinates.lat}&lng=${coordinates.lng}&date=${date}&formatted=0`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === 'OK') {
                const sunrise = new Date(data.results.sunrise).toLocaleString("en-US", { timeZone: "Asia/Karachi" });
                const sunset = new Date(data.results.sunset).toLocaleString("en-US", { timeZone: "Asia/Karachi" });

                sunTimesDiv.innerText = `Sunrise: ${convertToLocalTime(sunrise)}, Sunset: ${convertToLocalTime(sunset)}`;
                createTimeSlots('day-table', sunrise, sunset); // Day slots
                createTimeSlots('night-table', sunset, new Date(new Date(sunset).getTime() + 86400000)); // Next day for night slots
            } else {
                sunTimesDiv.innerText = 'Error fetching sun times.';
            }
        } catch (error) {
            sunTimesDiv.innerText = 'Error fetching sun times.';
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                userLatitude = position.coords.latitude;
                userLongitude = position.coords.longitude;
                latitudeElement.innerText = `${userLatitude}`;
                longitudeElement.innerText = `${userLongitude}`;
                fetchSunTimes(dateInput.value); // Fetch sun times with new coordinates
            }, (error) => {
                sunTimesDiv.innerText = 'Error fetching location.';
            });
        } else {
            sunTimesDiv.innerText = 'Geolocation is not supported by this browser.';
        }
    };

    dateInput.addEventListener('change', async (e) => {
        const selectedDate = e.target.value;
        dateDisplay.innerText = `Current Date: ${selectedDate}`; // Display selected date
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

    // Initialize with current date and location
    dateInput.value = new Date().toISOString().split('T')[0];
    dateDisplay.innerText = `Current Date: ${dateInput.value}`; // Display current date
    fetchSunTimes(dateInput.value);
    getCurrentLocation();
});
