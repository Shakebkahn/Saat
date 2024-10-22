document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-picker');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');
    const sunTimesDiv = document.getElementById('sun-times');
    const latitudeElement = document.getElementById('latitude');
    const longitudeElement = document.getElementById('longitude');
    const customizeSunrise = document.getElementById('customize-sunrise');
    const customizeSunset = document.getElementById('customize-sunset');

    let userLatitude = 24.8607;  // Default: Karachi
    let userLongitude = 67.0011; // Default: Karachi

    const timeSlots = [
        "Mushtari", "Marekh", "Shams", "Zohra", "Attarad", "Qamar", "Zuhal"
    ];

    const convertToLocalTime = (utcTime) => {
        const date = new Date(utcTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const createTimeSlots = (tableId, sunrise, sunset) => {
    const tableBody = document.getElementById(tableId).querySelector('tbody');
    tableBody.innerHTML = '';  // Clear any existing rows

    let startTime = new Date(sunrise).getTime();
    let endTime = new Date(sunset).getTime();
    let totalDuration = endTime - startTime;
    let slotDuration = totalDuration / timeSlots.length;

    const currentTime = new Date().getTime();

    // Outer loop ko remove karein
    timeSlots.forEach(({ name, planet }) => { // Destructure to get name and planet
        const row = document.createElement('tr');
        const endSlotTime = convertToLocalTime(startTime + slotDuration);
        row.innerHTML = `<td>${convertToLocalTime(startTime)} - ${endSlotTime}</td><td>${name}</td><td>${planet}</td>`;
        
        if (currentTime >= startTime && currentTime <= startTime + slotDuration) {
            row.classList.add('highlight-current'); // Highlight the current saat
        }
        
        tableBody.appendChild(row);
        startTime +=     
    });
};

    const createTimeSlots = (tableId, sunrise, sunset) => {
    const tableBody = document.getElementById(tableId).querySelector('tbody');
    tableBody.innerHTML = '';  // Clear any existing rows

    let startTime = new Date(sunrise).getTime();
    let endTime = new Date(sunset).getTime();
    let totalDuration = endTime - startTime;
    let slotDuration = totalDuration / timeSlots.length;

    const currentTime = new Date().getTime();

    // Remove the outer for loop to prevent repetition
    timeSlots.forEach(({ name, planet }) => {
        const row = document.createElement('tr');
        const endSlotTime = convertToLocalTime(startTime + slotDuration);
        row.innerHTML = `<td>${convertToLocalTime(startTime)} - ${endSlotTime}</td><td>${name}</td><td>${planet}</td>`;
        
        if (currentTime >= startTime && currentTime <= startTime + slotDuration) {
            row.classList.add('highlight-current'); // Highlight the current saat
        }
        
        tableBody.appendChild(row);
        startTime += slotDuration;
    });
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
