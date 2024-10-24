let saatain = [];

fetch('saatdb.json') // Aapka JSON database ka path
    .then(response => response.json())
    .then(data => {
        saatain = data.saatain; // JSON file se saatain data le lo
        fetchLocationAndTime(); // Location aur time ko fetch karne ka function call karein
    })
    .catch(error => console.error("Error fetching the saatain database:", error));

function fetchLocationAndTime() {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        document.getElementById('coordinates').textContent = `Longitude: ${longitude.toFixed(4)} | Latitude: ${latitude.toFixed(4)}`;
        document.getElementById('location').textContent = `Location: Detected Automatically`;

        // Fetch sunrise and sunset data
        fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
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
                console.error(error);
            });
    }, () => {
        alert("Unable to retrieve your location.");
    });
}

function calculateSaatain(sunrise, sunset) {
    const daySaatain = [];
    const nightSaatain = [];
    const now = new Date();

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
            number: saat.number[0] // First number for simplicity
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
            number: nightSaat.number[0] // First number for simplicity
        });
    }

    displaySaatain(daySaatain, 'day-saat');
    displaySaatain(nightSaatain, 'night-saat');
}

function displaySaatain(saatainArray, tableId) {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = ''; // Clear previous entries

    saatainArray.forEach((saatData) => {
        const row = document.createElement('tr');
        const startTime = saatData.start.toLocaleTimeString();
        const endTime = saatData.end.toLocaleTimeString();
        row.innerHTML = `<td>${startTime} - ${endTime}</td>
                         <td>${saatData.name}</td>
                         <td>${saatData.planet}</td>
                         <td>${saatData.number}</td>`;

        // Highlight current saat
        if (new Date() >= saatData.start && new Date() < saatData.end) {
            row.classList.add('highlight');
            document.getElementById('current-saat').textContent = saatData.name;
        }

        tableBody.appendChild(row);
    });
}

function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach((content) => {
        content.style.display = 'none';
    });
    document.querySelectorAll('.tab').forEach((tabElement) => {
        tabElement.classList.remove('active');
    });

    document.getElementById(tab).style.display = 'block';
    document.querySelector(`.tab[onclick="showTab('${tab}')"]`).classList.add('active');
}
