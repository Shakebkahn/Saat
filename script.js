document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-picker');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');
    const sunTimesDiv = document.getElementById('sun-times');
    const latitudeElement = document.getElementById('latitude');
    const longitudeElement = document.getElementById('longitude');

    let userLatitude = 24.9411;  // Default: Karachi
    let userLongitude = 67.0964; // Default: Karachi

    const timeSlots = [
        "Mushtari", "Marekh", "Shams", "Zohra", "Attarad", "Qamar", "Zuhal"
    ];

    const convertToLocalTime = (utcTime) => {
        const date = new Date(utcTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const createTimeSlots = (tableId, startTime, endTime) => {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = '';  // Clear any existing rows

        let startSlotTime = new Date(startTime).getTime();
        let endSlotTime = new Date(endTime).getTime();
        let totalDuration = endSlotTime - startSlotTime;
        let slotDuration = totalDuration / timeSlots.length;

        const currentTime = new Date().getTime();

        timeSlots.forEach((saat, index) => {
            const row = document.createElement('tr');
            const endSlotTimeStr = convertToLocalTime(startSlotTime + slotDuration);
            row.innerHTML = `<td>${convertToLocalTime(startSlotTime)} - ${endSlotTimeStr}</td><td>${saat}</td><td>Planet</td>`;
            
            if (currentTime >= startSlotTime && currentTime <= startSlotTime + slotDuration) {
                row.classList.add('highlight-current'); // Highlight the current saat
            }
            
            tableBody.appendChild(row);
            startSlotTime += slotDuration;
        });
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

                updateSunTimes(sunrise, sunset);
                createTimeSlots('day-table', sunrise, sunset);
                createTimeSlots('night-table', sunset, sunrise); // Night slots
            } else {
                sunTimesDiv.innerText = 'Sun times fetch nahi ho rahe.';
            }
        } catch (error) {
            sunTimesDiv.innerText = 'Sun times fetch karne mein koi error hai.';
        }
    };

    const updateSunTimes = (sunrise, sunset) => {
        const formattedSunrise = new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const formattedSunset = new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        sunTimesDiv.innerText = `Sunrise: ${formattedSunrise}, Sunset: ${formattedSunset}`;
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                userLatitude = position.coords.latitude;
                userLongitude = position.coords.longitude;
                latitudeElement.innerText = `Latitude: ${userLatitude}`;
                longitudeElement.innerText = `Longitude: ${userLongitude}`;
            }, (error) => {
                sunTimesDiv.innerText = 'Location fetch nahi ho rahi, please location access allow karain ya manually input karain.';
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
