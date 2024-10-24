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
        { name: "Mushtari", number: 2 }, 
        { name: "Marekh", number: 7 }, 
        { name: "Shams", number: 1 }, 
        { name: "Zohra", number: 6 }, 
        { name: "Attarad", number: 5 }, 
        { name: "Qamar", number: 3 }, 
        { name: "Zuhal", number: 4 }
    ];

    const convertToLocalTime = (utcTime) => {
        const date = new Date(utcTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const createTimeSlots = (tableBody, startTime, endTime) => {
        tableBody.innerHTML = '';  // Clear any existing rows

        const totalDuration = endTime - startTime;
        const slotDuration = totalDuration / 12; // Total 12 slots for day and night

        for (let i = 0; i < 12; i++) {
            const slot = timeSlots[i % timeSlots.length]; // Rotate through the slots
            const row = document.createElement('tr');
            const slotStartTime = startTime + (i * slotDuration);
            const slotEndTime = slotStartTime + slotDuration;

            row.innerHTML = `
                <td>${convertToLocalTime(slotStartTime)} - ${convertToLocalTime(slotEndTime)}</td>
                <td>${slot.name}</td>
                <td>${slot.number}</td>
            `;

            tableBody.appendChild(row);
        }
    };

    const fetchSunTimes = async (date) => {
        try {
            const coordinates = { lat: userLatitude, lng: userLongitude };
            const apiUrl = `https://api.sunrise-sunset.org/json?lat=${coordinates.lat}&lng=${coordinates.lng}&date=${date}&formatted=0`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === 'OK') {
                const sunrise = new Date(data.results.sunrise).getTime();
                const sunset = new Date(data.results.sunset).getTime();
                
                createTimeSlots(document.getElementById('day-table').querySelector('tbody'), sunrise, sunset);
                createTimeSlots(document.getElementById('night-table').querySelector('tbody'), sunset, sunrise + 86400000); // Next day for night
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
