const saatain = [
    { name: 'Shams', planet: 'Shams', number: [1, 4] },
    { name: 'Zohra', planet: 'Zohra', number: [6] },
    { name: 'Marekh', planet: 'Marekh', number: [2, 5] },
    { name: 'Mushtari', planet: 'Mushtari', number: [3, 7] },
    { name: 'Attarad', planet: 'Attarad', number: [8] },
    { name: 'Zuhal', planet: 'Zuhal', number: [9, 10] },
    { name: 'Qamar', planet: 'Qamar', number: [11, 12] }
];

function fetchLocationAndTime() {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        document.getElementById('coordinates').textContent = `Longitude: ${longitude.toFixed(4)} | Latitude: ${latitude.toFixed(4)}`;
        document.getElementById('location').textContent = `Location: Detected Automatically`;

        // Fetch sunrise and sunset data
        fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`)
            .then(response => response.json())
            .then(data => {
                const sunrise = new Date(data.results.sunrise);
                const sunset = new Date(data.results.sunset);

                document.getElementById('sunrise-time').textContent = sunrise.toLocaleTimeString();
                document.getElementById('sunset-time').textContent = sunset.toLocaleTimeString();
                document.getElementById('current-date').textContent = new Date().toLocaleDateString();

                // Calculate saatain and update the tables
                calculateSaatain(sunrise, sunset);
            })
            .catch(error => {
                alert("Unable to retrieve sunrise and sunset times.");
            });
    }, () => {
        alert("Unable to retrieve your location.");
    });
}

function calculateSaatain(sunrise, sunset) {
    const daySaatain = [];
    const nightSaatain = [];
    const now = new Date();

    // Duration for each saat
    const dayDuration = (sunset - sunrise) / 12;
    const nightDuration = (86400000 - (sunset - sunrise)) / 12;

    for (let i = 0; i < 12; i++) {
        // Day Saatain
        const dayStartTime = new Date(sunrise.getTime() + i * dayDuration);
        const dayEndTime = new Date(dayStartTime.getTime() + dayDuration);
        const saat = saatain[i % saatain.length];
        daySaatain.push({
            start: dayStartTime,
            end: dayEndTime,
            name: saat.name,
            planet: saat.planet,
            number: saat.number[i % saat.number.length]
        });

        // Night Saatain
        const nightStartTime = new Date(sunset.getTime() + i * nightDuration);
        const nightEndTime = new Date(nightStartTime.getTime() + nightDuration);
        const nightSaat = saatain[i % saatain.length];
        nightSaatain.push({
            start: nightStartTime,
            end: nightEndTime,
            name: nightSaat.name,
            planet: nightSaat.planet,
            number: nightSaat.number[i % nightSaat.number.length]
        });
    }

    // Display Day Saatain
    const dayTableBody = document.getElementById('day-saat');
    daySaatain.forEach((saatData) => {
        const row = document.createElement('tr');
        const startTime = saatData.start.toLocaleTimeString();
        const endTime = saatData.end.toLocaleTimeString();
        const timeCell = `<td>${startTime} - ${endTime}</td>`;
        const saatCell = `<td>${saatData.name}</td>`;
        const planetCell = `<td>${saatData.planet}</td>`;
        const numberCell = `<td>${saatData.number}</td>`;
        row.innerHTML = timeCell + saatCell + planetCell + numberCell;

        // Highlight current saat
        if (now >= saatData.start && now < saatData.end) {
            row.classList.add('highlight');
        }

        dayTableBody.appendChild(row);
    });

    // Display Night Saatain
    const nightTableBody = document.getElementById('night-saat');
    nightSaatain.forEach((saatData) => {
        const row = document.createElement('tr');
        const startTime = saatData.start.toLocaleTimeString();
        const endTime = saatData.end.toLocaleTimeString();
        const timeCell = `<td>${startTime} - ${endTime}</td>`;
        const saatCell = `<td>${saatData.name}</td>`;
        const planetCell = `<td>${saatData.planet}</td>`;
        const numberCell = `<td>${saatData.number}</td>`;
        row.innerHTML = timeCell + saatCell + planetCell + numberCell;

        // Highlight current saat
        if (now >= saatData.start && now < saatData.end) {
            row.classList.add('highlight');
        }

        nightTableBody.appendChild(row);
    });
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach((tab) => {
        tab.style.display = 'none';
    });
    document.querySelectorAll('.tab').forEach((tab) => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName).style.display = 'block';
    document.querySelector(`.tab[onclick="showTab('${tabName}')"]`).classList.add('active');
}

// Fetch location and time on load
window.onload = fetchLocationAndTime;
