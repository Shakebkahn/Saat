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

    const timeSlots = [
        { name: "Mushtari", number: 2, planet: "Jupiter" },
        { name: "Marekh", number: 7, planet: "Mars" },
        { name: "Shams", number: "1, 4", planet: "Sun" },
        { name: "Zohra", number: 6, planet: "Venus" },
        { name: "Attarad", number: 5, planet: "Mercury" },
        { name: "Qamar", number: 3, planet: "Moon" },
        { name: "Zuhal", number: 4, planet: "Saturn" }
    ];

    const convertToLocalTime = (utcTime) => {
        const date = new Date(utcTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const createTimeSlots = (tableId, sunrise, sunset, isNight = false) => {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = '';  // Clear any existing rows

        let startTime = new Date(sunrise).getTime();
        let endTime = new Date(sunset).getTime();
        let totalDuration = endTime - startTime;
        let slotDuration = totalDuration / timeSlots.length;

        for (let i = 0; i < timeSlots.length; i++) {
            const row = document.createElement('tr');
            const endSlotTime = convertToLocalTime(startTime + slotDuration);
            const slot = timeSlots[i];
            row.innerHTML = `<td>${convertToLocalTime(startTime)} - ${endSlotTime}</td>
                             <td>${slot.name}</td>
                             <td>${slot.planet}</td>
                             <td>${slot.number}</td>`;
            tableBody.appendChild(row);
            startTime += slotDuration;
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
                createTimeSlots('night-table', sunset, sunrise); // Night slots
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
                latitudeElement.innerText = `Latitude: ${userLatitude}`;
                longitudeElement.innerText = `Longitude: ${userLongitude}`;
            }, (error) => {
                sunTimesDiv.innerText = 'Error fetching location.';
            });
        } else {
            sunTimesDiv.innerText = 'Geolocation is not supported by this browser.';
        }
    };

    dateInput.addEventListener('change', async (e) => {
        const selectedDate = e.target.value;
        fetchSunTimes(selectedDate);
    });

    // Initialize with current date and location
    dateInput.value = new Date().toISOString().split('T')[0];
    fetchSunTimes(dateInput.value);
    getCurrentLocation();
});
