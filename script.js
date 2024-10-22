// List of saatain and their planets
const timeSlots = [
    { name: "Mushtari", planet: "Jupiter" },
    { name: "Marekh", planet: "Mars" },
    { name: "Shams", planet: "Sun" },
    { name: "Zohra", planet: "Venus" },
    { name: "Attarad", planet: "Mercury" },
    { name: "Qamar", planet: "Moon" },
    { name: "Zuhal", planet: "Saturn" }
];

// Function to get the planet for the first saat of each day
const getFirstSaatForDay = (dayOfWeek) => {
    switch (dayOfWeek) {
        case 0: return "Shams";    // Sunday
        case 1: return "Qamar";    // Monday
        case 2: return "Marekh";   // Tuesday
        case 3: return "Attarad";  // Wednesday
        case 4: return "Mushtari"; // Thursday
        case 5: return "Zohra";    // Friday
        case 6: return "Zuhal";    // Saturday
    }
};

// Function to shift saatain according to the day of the week
const getDayBasedSaatain = (dayOfWeek) => {
    const firstSaat = getFirstSaatForDay(dayOfWeek);
    const firstIndex = timeSlots.findIndex(slot => slot.name === firstSaat);
    return [...timeSlots.slice(firstIndex), ...timeSlots.slice(0, firstIndex)];
};

// Function to create time slots for the day and night
const createTimeSlots = (tableId, sunrise, sunset, dayOfWeek) => {
    const tableBody = document.getElementById(tableId).querySelector('tbody');
    tableBody.innerHTML = '';  // Clear any existing rows

    let startTime = new Date(`1970-01-01T${sunrise}Z`).getTime();
    let endTime = new Date(`1970-01-01T${sunset}Z`).getTime();
    let totalDuration = endTime - startTime; // Total time in milliseconds
    let slotDuration = totalDuration / 7; // Divide by 7 saatain

    const saatain = getDayBasedSaatain(dayOfWeek);

    saatain.forEach((saat, index) => {
        const row = document.createElement('tr');
        const endSlotTime = new Date(startTime + slotDuration).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        row.innerHTML = `<td>${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endSlotTime}</td><td>${saat.name}</td><td>${saat.planet}</td>`;
        tableBody.appendChild(row);
        startTime += slotDuration; // Update start time for next saat
    });
};

// Function to fetch sunrise and sunset times using an API
const fetchSunTimes = async (date) => {
    try {
        const coordinates = { lat: 24.8607, lng: 67.0011 }; // Coordinates for Karachi, Pakistan
        const apiUrl = `https://api.sunrise-sunset.org/json?lat=${coordinates.lat}&lng=${coordinates.lng}&date=${date}&formatted=0`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if(data.status === 'OK') {
            const today = new Date(date);
            const dayOfWeek = today.getUTCDay();
            updateSunTimes(data.results);
            createTimeSlots('day-table', data.results.sunrise, data.results.sunset, dayOfWeek);
        } else {
            sunTimesDiv.innerText = 'Error fetching sun times.';
        }
    } catch (error) {
        sunTimesDiv.innerText = 'Error fetching sun times.';
    }
};

// Function to update sunrise and sunset times in the UI
const updateSunTimes = (sunTimes) => {
    const sunrise = new Date(sunTimes.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(sunTimes.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    sunTimesDiv.innerText = `Sunrise: ${sunrise}, Sunset: ${sunset}`;
};

// Event listener for date change
dateInput.addEventListener('change', async (e) => {
    const selectedDate = e.target.value;
    fetchSunTimes(selectedDate);
});

// Initialize with current date
dateInput.value = new Date().toISOString().split('T')[0];
fetchSunTimes(dateInput.value);
