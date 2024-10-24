document.addEventListener('DOMContentLoaded', () => {
    const dateElement = document.getElementById('date');
    const sunTimesDiv = document.getElementById('sun-times');
    const latitudeElement = document.getElementById('latitude');
    const longitudeElement = document.getElementById('longitude');
    const currentSaatInfo = document.getElementById('current-saat-info');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');

    let userLatitude = null;
    let userLongitude = null;

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
                             <td>${slot.name}</td>
                             <td>${slot.number}</td>`;
            tableBody.appendChild(row);
            startTime += slotDuration;
        }
    };

    const fetchSunTimes = async () => {
        try {
            const apiUrl = `https://api.sunrise-sunset.org/json?lat=${userLatitude}&lng=${userLongitude}&formatted=0`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === 'OK') {
                const sunrise = new Date(data.results.sunrise).toLocaleString("en-US", { timeZone: "Asia/Karachi" });
                const sunset = new Date(data.results.sunset).toLocaleString("en-US", { timeZone: "Asia/Karachi" });

                updateSunTimes(sunrise, sunset);
                createTimeSlots('day-table', sunrise, sunset); // Day slots
                createTimeSlots('night-table', sunset, new Date(new Date(sunset).getTime() + 24*60*60*1000)); // Night slots
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
        sunTimesDiv.innerText = `Sunrise: ${formattedSunrise} | Sunset: ${formattedSunset}`;
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                userLatitude = position.coords.latitude;
                userLongitude = position.coords.longitude;
                latitudeElement.innerText = `Latitude: ${userLatitude}`;
                longitudeElement.innerText = `Longitude: ${userLongitude}`;
                fetchSunTimes();
            }, (error) => {
                sunTimesDiv.innerText = 'Error fetching location.';
            });
        } else {
            sunTimesDiv.innerText = 'Geolocation is not supported by this browser.';
        }
    };

    // Tab functionality
    dayTab.addEventListener('click', () => {
        dayTab.classList.add('active');
        nightTab.classList.remove('active');
        dayTime.style.display = 'block';
        nightTime.style.display = 'none';
    });

    nightTab.addEventListener('click', () => {
        nightTab.classList.add('active');
        dayTab.classList.remove('active');
        dayTime.style.display = 'none';
        nightTime.style.display = 'block';
    });

    // Initialize with current location
    getCurrentLocation();
});
