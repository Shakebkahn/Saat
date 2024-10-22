document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-picker');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');
    const sunTimesDiv = document.getElementById('sun-times');
    const moonLocationDiv = document.getElementById('moon-location');
    const latitudeElement = document.getElementById('latitude');
    const longitudeElement = document.getElementById('longitude');
    const customizeSunrise = document.getElementById('customize-sunrise');
    const customizeSunset = document.getElementById('customize-sunset');

    let userLatitude = 24.9411;  // Default: Karachi
    let userLongitude = 67.0965; // Default: Karachi

    const timeSlots = [
        { name: "Mushtari", planet: "Jupiter" }, 
        { name: "Marekh", planet: "Mars" }, 
        { name: "Shams", planet: "Sun" }, 
        { name: "Zohra", planet: "Venus" }, 
        { name: "Attarad", planet: "Mercury" }, 
        { name: "Qamar", planet: "Moon" }, 
        { name: "Zuhal", planet: "Saturn" }
    ];

    const createTimeSlots = (tableId, startTime, endTime) => {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = '';  // Clear any existing rows

        let totalDuration = endTime - startTime;
        let slotDuration = totalDuration / timeSlots.length;

        const currentTime = new Date().getTime();

        timeSlots.forEach((saat, index) => {
            const row = document.createElement('tr');
            const endSlotTime = new Date(startTime + slotDuration).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            row.innerHTML = `<td>${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endSlotTime}</td><td>${saat.name}</td><td>${saat.planet}</td>`;
            if (currentTime >= startTime && currentTime <= startTime + slotDuration) {
                row.classList.add('highlight-current'); // Highlight the current saat
            }
            tableBody.appendChild(row);
            startTime += slotDuration;
        });
    };

    const fetchSunTimes = async (date) => {
        try {
            const coordinates = { lat: userLatitude, lng: userLongitude };
            const apiUrl = `https://api.sunrise-sunset.org/json?lat=${coordinates.lat}&lng=${coordinates.lng}&date=${date}&formatted=0`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === 'OK') {
                const sunrise = customizeSunrise.value || new Date(data.results.sunrise).getTime();
                const sunset = customizeSunset.value || new Date(data.results.sunset).getTime();
                updateSunTimes(new Date(data.results.sunrise), new Date(data.results.sunset));
                createTimeSlots('day-table', sunrise, sunset);
                createTimeSlots('night-table', sunset, sunrise + 24 * 60 * 60 * 1000); // Night slots adjusted
            } else {
                sunTimesDiv.innerText = 'Error fetching sun times.';
            }
        } catch (error) {
            sunTimesDiv.innerText = 'Error fetching sun times.';
        }
    };

    const updateSunTimes = (sunrise, sunset) => {
        const formattedSunrise = sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedSunset = sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        sunTimesDiv.innerText = `Sunrise: ${formattedSunrise}, Sunset: ${formattedSunset}`;
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                userLatitude = position.coords.latitude;
                userLongitude = position.coords.longitude;
                latitudeElement.innerText = `Latitude: ${userLatitude.toFixed(6)}`;
                longitudeElement.innerText = `Longitude: ${userLongitude.toFixed(6)}`;
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
    fetchSunTimes(dateInput.value);
    getCurrentLocation();
});
