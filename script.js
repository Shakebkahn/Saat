const saatain = [
    { name: 'Shams', planet: 'Shams', number: [1, 4] },
    { name: 'Zohra', planet: 'Zohra', number: [6] },
    { name: 'Marekh', planet: 'Marekh', number: [7] },
    { name: 'Mushtari', planet: 'Mushtari', number: [2] },
    { name: 'Attarad', planet: 'Attarad', number: [5] },
    { name: 'Zuhal', planet: 'Zuhal', number: [8] },
    { name: 'Qamar', planet: 'Qamar', number: [3] }
];

function calculateCurrentDaySaat(sunrise, sunset) {
    const now = new Date();
    const dayStart = sunrise;
    const dayEnd = sunset;

    if (now >= dayStart && now < dayEnd) {
        const dayDuration = (dayEnd - dayStart) / 12;
        for (let i = 0; i < 12; i++) {
            const saatStart = new Date(dayStart.getTime() + i * dayDuration);
            const saatEnd = new Date(saatStart.getTime() + dayDuration);

            // Check if current time is within the saat duration
            if (now >= saatStart && now < saatEnd) {
                return {
                    name: saatain[i].name,
                    planet: saatain[i].planet,
                    number: saatain[i].number[0], // First number for simplicity
                };
            }
        }
    }
    return null; // No current saat found
}

function displayCurrentDaySaat(currentDaySaat) {
    if (currentDaySaat) {
        const currentDaySaatDiv = document.getElementById('current-day-saat');
        currentDaySaatDiv.innerHTML = `
            Current Day Saat: ${currentDaySaat.name} (Planet: ${currentDaySaat.planet}, Number: ${currentDaySaat.number})
        `;
    } else {
        document.getElementById('current-day-saat').innerHTML = "Current Day Saat: Not Available";
    }
}

function displaySaatain(saatainList, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <table>
            <tr>
                <th>Time</th>
                <th>Saat</th>
                <th>Planet</th>
                <th>#</th>
            </tr>
            ${saatainList.map(saat => `
                <tr>
                    <td>${saat.time}</td>
                    <td>${saat.name || 'undefined'}</td>
                    <td>${saat.planet || 'undefined'}</td>
                    <td>${saat.number || 'undefined'}</td>
                </tr>
            `).join('')}
        </table>
    `;
}

function showTab(tab) {
    document.getElementById('day-saat').style.display = tab === 'day' ? 'block' : 'none';
    document.getElementById('night-saat').style.display = tab === 'night' ? 'block' : 'none';

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => {
        t.classList.remove('active');
    });
    const activeTab = document.querySelector(`.tab.${tab}`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

function calculateSaatain(sunrise, sunset) {
    const daySaatain = [];
    const nightSaatain = [];
    
    // Your logic to populate daySaatain and nightSaatain goes here...

    const currentDaySaat = calculateCurrentDaySaat(sunrise, sunset);
    displayCurrentDaySaat(currentDaySaat); // Show current day saat
    displaySaatain(daySaatain, 'day-saat');
    displaySaatain(nightSaatain, 'night-saat');
}

// Example sunrise and sunset times
const sunrise = new Date("2024-10-24T06:33:23");
const sunset = new Date("2024-10-24T17:58:08");

// Call the calculate function
calculateSaatain(sunrise, sunset);
