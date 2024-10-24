const saatain = [
    { name: 'Shams', planet: 'Sun', number: [1, 4] },
    { name: 'Zohra', planet: 'Venus', number: [6] },
    { name: 'Marekh', planet: 'Mars', number: [7] },
    { name: 'Mushtari', planet: 'Jupiter', number: [2] },
    { name: 'Attarad', planet: 'Mercury', number: [5] },
    { name: 'Zuhal', planet: 'Saturn', number: [8] },
    { name: 'Qamar', planet: 'Moon', number: [3] }
];

// Function to fetch location
function fetchLocation() {
    navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        document.getElementById('location-info').innerText = `Location: Detected Automatically\nLongitude: ${longitude.toFixed(4)} | Latitude: ${latitude.toFixed(4)}`;
        calculateTimes(latitude, longitude);
    }, () => {
        document.getElementById('location-info').innerText = "Location: Not Available";
    });
}

// Function to calculate sunrise and sunset (Placeholder)
function calculateTimes(latitude, longitude) {
    // Placeholder values for sunrise and sunset (You can replace these with real calculations)
    const sunrise = new Date(); 
    sunrise.setHours(6, 33, 23); // 6:33:23 AM
    const sunset = new Date();
    sunset.setHours(17, 58, 8); // 5:58:08 PM

    const currentDate = new Date();
    document.getElementById('date-info').innerText = `Date: ${currentDate.toLocaleDateString()}`;
    document.getElementById('sunrise-sunset').innerText = `Sunrise: ${sunrise.toLocaleTimeString()} | Sunset: ${sunset.toLocaleTimeString()}`;

    calculateSaatain(sunrise, sunset);
}

// Function to display saatain in the table
function displaySaatain(saatain, elementId) {
    const saatTable = document.getElementById(elementId);
    let tableHTML = `
        <table>
            <tr>
                <th>Time</th>
                <th>Saat</th>
                <th>Planet</th>
                <th>#</th>
            </tr>
    `;
    for (const saat of saatain) {
        tableHTML += `
            <tr>
                <td>${saat.time}</td>
                <td>${saat.name || 'Not Available'}</td>
                <td>${saat.planet}</td>
                <td>${saat.number}</td>
            </tr>
        `;
    }
    tableHTML += `</table>`;
    saatTable.innerHTML = tableHTML;
}

// Function to calculate saatain
function calculateSaatain(sunrise, sunset) {
    const daySaatain = [];
    const nightSaatain = [];
    
    // Populate day saatain (using placeholder data)
    for (let i = 0; i < 12; i++) {
        const timeStart = new Date(sunrise.getTime() + (i * (sunset - sunrise) / 12));
        const timeEnd = new Date(sunrise.getTime() + ((i + 1) * (sunset - sunrise) / 12));
        daySaatain.push({
            time: `${timeStart.toLocaleTimeString()} - ${timeEnd.toLocaleTimeString()}`,
            name: saatain[i % 7].name,
            planet: saatain[i % 7].planet,
            number: saatain[i % 7].number[0],
        });
    }

    // Populate night saatain (using placeholder data)
    for (let i = 0; i < 12; i++) {
        const timeStart = new Date(sunset.getTime() + (i * (24 * 60 * 60 * 1000) / 12));
        const timeEnd = new Date(sunset.getTime() + ((i + 1) * (24 * 60 * 60 * 1000) / 12));
        nightSaatain.push({
            time: `${timeStart.toLocaleTimeString()} - ${timeEnd.toLocaleTimeString()}`,
            name: saatain[i % 7].name,
            planet: saatain[i % 7].planet,
            number: saatain[i % 7].number[0],
        });
    }

    displaySaatain(daySaatain, 'day-saat');
    displaySaatain(nightSaatain, 'night-saat');
}

// Function to change tab
function changeTab(tab) {
    if (tab === 'day') {
        document.getElementById('day-saat').classList.remove('hidden');
        document.getElementById('night-saat').classList.add('hidden');
        document.getElementById('day-tab').classList.add('active');
        document.getElementById('night-tab').classList.remove('active');
    } else {
        document.getElementById('day-saat').classList.add('hidden');
        document.getElementById('night-saat').classList.remove('hidden');
        document.getElementById('night-tab').classList.add('active');
        document.getElementById('day-tab').classList.remove('active');
    }
}

// Initialize
fetchLocation();