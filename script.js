document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-picker');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');
    const sunTimesDiv = document.getElementById('sun-times');
    const latitudeElement = document.getElementById('latitude');
    const longitudeElement = document.getElementById('longitude');
    const locationAddressElement = document.getElementById('location-address');
    
    let userLatitude = 24.8607;  // Default: Karachi
    let userLongitude = 67.0011; // Default: Karachi

    const timeSlots = [
        "Mushtari", "Marekh", "Shams", "Zohra", "Attarad", "Qamar", "Zuhal"
    ];

    const planets = ["Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn"]; // Planets for each saat

    const convertToLocalTime = (utcTime) => {
        const date = new Date(utcTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const createTimeSlots = (tableId, startTime, endTime) => {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = '';  // Clear any existing rows

        let totalDuration = endTime - startTime;
        let slotDuration = totalDuration / timeSlots.length;

        const currentTime = new Date().getTime();

        timeSlots.forEach((saat, index) => {
            const row = document.createElement('tr');
            const endSlotTime = convertToLocalTime(startTime + slotDuration);
            row.innerHTML = `<td>${convertToLocalTime(startTime)} - ${endSlotTime}</td><td>${saat}</td><td>${planets[index]}</td>`;
            
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
                const sunrise = new Date(data.results.sunrise).toLocaleString("en-US", { timeZone: "Asia/Karachi" });
                const sunset = new Date(data.results.sunset).toLocaleString("en-US", { timeZone: "Asia/Karachi" });
                
                updateSunTimes(sunrise, sunset);
                createTimeSlots('day-table', new Date(sunrise).getTime(), new Date(sunset).getTime());
                
                const nextSunrise = await fetchNextDaySunrise(date);
                createTimeSlots('night-table', new Date(sunset).getTime(), new Date(nextSunrise).getTime());
            } else {
                sunTimesDiv.innerText = 'Error fetching sun times.';
            }
        } catch (error) {
            sunTimesDiv.innerText = 'Error fetching sun times.';
        }
    };

    const fetchNextDaySunrise = async (date) => {
        const nextDay = new Date(new Date(date).getTime() + (24 * 60 * 60 * 1000)); // Add 1 day
        const formattedDate = nextDay.toISOString().split('T')[0];
        const coordinates = { lat: userLatitude, lng: userLongitude };
        const apiUrl = `https://api.sunrise-sunset.org/json?lat=${coordinates.lat}&lng=${coordinates.lng}&date=${formattedDate}&formatted=0`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.status === 'OK') {
            return new Date(data.results.sunrise).toLocaleString("en-US", { timeZone: "Asia/Karachi" });
        }
        return null;
    };

    const updateSunTimes = (sunrise, sunset) => {
        const formattedSunrise = new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const formattedSunset = new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        sunTimesDiv.innerText = `Sunrise: ${formattedSunrise}, Sunset: ${formattedSunset}`;
    };

    const fetchLocationAddress = async (latitude, longitude) => {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        const address = data.display_name; // Extract address
        locationAddressElement.innerText = `Location: ${address}`; // Show address on the page
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                userLatitude = position.coords.latitude;
                userLongitude = position.coords.longitude;
                latitudeElement.innerText = `Latitude: ${userLatitude}`;
                longitudeElement.innerText = `Longitude: ${userLongitude}`;
                
                fetchLocationAddress(userLatitude, userLongitude); // Fetch and display address
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
