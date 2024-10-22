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
        { naam: "Mushtari", planet: "Jupiter" },
        { naam: "Marekh", planet: "Mars" },
        { naam: "Shams", planet: "Sun" },
        { naam: "Zohra", planet: "Venus" },
        { naam: "Attarad", planet: "Mercury" },
        { naam: "Qamar", planet: "Moon" },
        { naam: "Zuhal", planet: "Saturn" }
    ];

    const createTimeSlots = (tableId, startTime, endTime) => {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = '';  // Clear any existing rows

        let currentTime = new Date(startTime);
        let endDate = new Date(endTime);
        const totalDuration = endDate - currentTime;
        const slotDuration = totalDuration / timeSlots.length;

        // Current time for highlighting
        const highlightTime = new Date(); 

        timeSlots.forEach((saat, index) => {
            const row = document.createElement('tr');
            const slotEndTime = new Date(currentTime.getTime() + slotDuration);
            row.innerHTML = `<td>${convertToLocalTime(currentTime)} - ${convertToLocalTime(slotEndTime)}</td><td>${saat.naam}</td><td>${saat.planet}</td>`;
            
            // Highlight the current saat if it matches the time range
            if (highlightTime >= currentTime && highlightTime < slotEndTime) {
                row.classList.add('highlight-current'); // Highlight the current saat
            }
            
            tableBody.appendChild(row);
            currentTime = slotEndTime; // Move to the next time slot
        });
    };

    const convertToLocalTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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

                // Create time slots for day and night
                createTimeSlots('day-table', sunrise, sunset);
                
                // Night slots: starting from sunset and ending at the next day's sunrise
                const nextDaySunrise = new Date(new Date(sunrise).getTime() + 24 * 60 * 60 * 1000);
                createTimeSlots('night-table', sunset, nextDaySunrise);
            } else {
                sunTimesDiv.innerText = 'Error fetching sun times.';
            }
        } catch (error) {
            sunTimesDiv.innerText = 'Error fetching sun times.';
        }
    };

    dateInput.addEventListener('change', async (e) => {
        const selectedDate = e.target.value;
        fetchSunTimes(selectedDate);
    });

    // Initialize with current date and location
    dateInput.value = new Date().toISOString().split('T')[0];
    fetchSunTimes(dateInput.value);
    // Add geolocation handling if needed
});
