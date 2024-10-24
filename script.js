document.addEventListener('DOMContentLoaded', () => {
    const dateInfo = document.getElementById('date-info');
    const sunTimesDiv = document.getElementById('sun-times');
    const locationInfo = document.getElementById('location-info');
    const coordinatesDiv = document.getElementById('coordinates');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');

    let userLatitude;
    let userLongitude;

    const timeSlots = [
        { name: "Shams", number: [1, 4] },
        { name: "Qamar", number: [3] },
        { name: "Mushtari", number: [2] },
        { name: "Zuhal", number: [4] },
        { name: "Marekh", number: [7] },
        { name: "Zohra", number: [6] },
        { name: "Attarad", number: [5] }
    ];

    const convertToLocalTime = (utcTime) => {
        const date = new Date(utcTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const createTimeSlots = (tableId, sunrise, sunset, isNight = false) => {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = ''; 

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
                             <td>${slot.number.join(', ')}</td>`;
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

                sunTimesDiv.innerText = `Sunrise: ${convertToLocalTime(sunrise)}, Sunset: ${convertToLocalTime(sunset)}`;
                createTimeSlots('day-table', sunrise, sunset); 
                createTimeSlots('night-table', sunset, sunrise);
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
                coordinatesDiv.innerText = `Longitude: ${userLongitude}, Latitude: ${userLatitude}`;
                fetchSunTimes();
            }, (error) => {
                sunTimesDiv.innerText = 'Error fetching location.';
            });
        } else {
            sunTimesDiv.innerText = 'Geolocation is not supported by this browser.';
        }
    };

    // Initialize with current date and location
    getCurrentLocation();
});

function showTab(tab) {
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');

    if (tab === 'day') {
        dayTab.classList.add('active');
        nightTab.classList.remove('active');
        dayTime.style.display = 'block';
        nightTime.style.display = 'none';
    } else {
        nightTab.classList.add('active');
        dayTab.classList.remove('active');
        dayTime.style.display = 'none';
        nightTime.style.display = 'block';
    }
}
