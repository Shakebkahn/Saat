document.addEventListener("DOMContentLoaded", () => {
    // API se location aur time info fetch karna
    fetchLocationAndTime();

    // Tab switching functionality
    document.getElementById('day-tab').addEventListener('click', () => changeTab('day'));
    document.getElementById('night-tab').addEventListener('click', () => changeTab('night'));
});

// Function to fetch location and time
async function fetchLocationAndTime() {
    const response = await fetch('https://ipapi.co/json/'); // Fetch current location
    const data = await response.json();
    const latitude = data.latitude;
    const longitude = data.longitude;

    document.getElementById('location-info').textContent = `Location: Detected Automatically | Longitude: ${longitude} | Latitude: ${latitude}`;

    // Get current date
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString();

    // Display date
    document.getElementById('date-info').textContent = `Date: ${dateStr}`;

    // Get sunrise/sunset time using location
    const times = await fetchSunriseSunset(latitude, longitude);
    document.getElementById('sunrise-sunset').textContent = `Sunrise: ${times.sunrise} | Sunset: ${times.sunset}`;

    // Fetch saatain data based on the current day
    const saatainData = await fetchSaatain(currentDate);

    // Update day and night tables
    updateSaatTable(saatainData, times.sunrise, times.sunset);
}

// Function to fetch sunrise and sunset timings using latitude and longitude
async function fetchSunriseSunset(lat, lon) {
    const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`);
    const data = await response.json();
    const sunrise = new Date(data.results.sunrise).toLocaleTimeString();
    const sunset = new Date(data.results.sunset).toLocaleTimeString();
    return { sunrise, sunset };
}

// Function to fetch saatain from database
async function fetchSaatain(date) {
    // This would be replaced with actual database call or file read
    const response = await fetch('database.json'); // Fetch saatain from JSON file or database
    const data = await response.json();

    // Here you would filter data based on the current date or rules for determining saatain
    return data.saatain; // Assuming data structure has 'saatain' field
}

// Function to update the saat table based on the fetched data
function updateSaatTable(saatainData, sunrise, sunset) {
    const dayTable = document.getElementById('day-saat');
    const nightTable = document.getElementById('night-saat');

    // Clear previous tables
    dayTable.innerHTML = '';
    nightTable.innerHTML = '';

    // Populate day saat
    let currentTime = new Date(`1970-01-01T${sunrise}`);
    for (let i = 0; i < 12; i++) {
        const saat = saatainData[i];
        const nextTime = new Date(currentTime.getTime() + (60 * 60 * 1000)); // Add 1 hour for each saat
        dayTable.innerHTML += `<div>${currentTime.toLocaleTimeString()} - ${nextTime.toLocaleTimeString()} | ${saat.name} | ${saat.planet} | ${saat.number}</div>`;
        currentTime = nextTime;
    }

    // Populate night saat
    currentTime = new Date(`1970-01-01T${sunset}`);
    for (let i = 12; i < 24; i++) {
        const saat = saatainData[i % 12];
        const nextTime = new Date(currentTime.getTime() + (60 * 60 * 1000)); // Add 1 hour for each saat
        nightTable.innerHTML += `<div>${currentTime.toLocaleTimeString()} - ${nextTime.toLocaleTimeString()} | ${saat.name} | ${saat.planet} | ${saat.number}</div>`;
        currentTime = nextTime;
    }

    // Highlight current saat if applicable
    highlightCurrentSaat();
}

// Function to highlight the current saat
function highlightCurrentSaat() {
    const currentTime = new Date();
    const saatDivs = document.querySelectorAll('.saat-table div');
    saatDivs.forEach(div => {
        const timeRange = div.textContent.split(' | ')[0];
        const [startTime, endTime] = timeRange.split(' - ').map(t => new Date(`1970-01-01T${t}`));

        if (currentTime >= startTime && currentTime < endTime) {
            div.classList.add('highlight');
        } else {
            div.classList.remove('highlight');
        }
    });
}

// Tab switching function
function changeTab(tab) {
    const dayTab = document.getElementById('day-saat');
    const nightTab = document.getElementById('night-saat');

    if (tab === 'day') {
        dayTab.classList.remove('hidden');
        nightTab.classList.add('hidden');
    } else {
        dayTab.classList.add('hidden');
        nightTab.classList.remove('hidden');
    }
}