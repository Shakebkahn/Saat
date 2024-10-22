document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-picker');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');
    const sunTimesDiv = document.getElementById('sun-times');

    const timeSlots = [
        { name: "Mushtari", planet: "Jupiter" },
        { name: "Marekh", planet: "Mars" },
        { name: "Shams", planet: "Sun" },
        { name: "Zohra", planet: "Venus" },
        { name: "Attarad", planet: "Mercury" },
        { name: "Qamar", planet: "Moon" },
        { name: "Zuhal", planet: "Saturn" }
    ];

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

    const getDayBasedSaatain = (dayOfWeek) => {
        const firstSaat = getFirstSaatForDay(dayOfWeek);
        const firstIndex = timeSlots.findIndex(slot => slot.name === firstSaat);
        return [...timeSlots.slice(firstIndex), ...timeSlots.slice(0, firstIndex)];
    };

    const createTimeSlots = (tableId, sunrise, sunset, dayOfWeek) => {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = '';  // Clear any existing rows

        let startTime = new Date(sunrise).getTime();  // Use local time format
        let endTime = new Date(sunset).getTime();
        let totalDuration = endTime - startTime; // Total time in milliseconds
        let slotDuration = totalDuration / 7; // Divide by 7 saatain

        const saatain = getDayBasedSaatain(dayOfWeek);

        saatain.forEach((saat) => {
            const row = document.createElement('tr');
            const endSlotTime = new Date(startTime + slotDuration).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            row.innerHTML = `<td>${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endSlotTime}</td><td>${saat.name}</td><td>${saat.planet}</td>`;
            tableBody.appendChild(row);
            startTime += slotDuration; // Update start time for next saat
        });
    };

    const fetchSunTimes = async (date) => {
        try {
            const coordinates = { lat: 24.8607, lng: 67.0011 }; // Coordinates for Karachi, Pakistan
            const apiUrl = `https://api.sunrise-sunset.org/json?lat=${coordinates.lat}&lng=${coordinates.lng}&date=${date}&formatted=0`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if(data.status === 'OK') {
                const today = new Date(date);
                const dayOfWeek = today.getUTCDay();
                const sunrise = new Date(data.results.sunrise).toLocaleString("en-US", { timeZone: 'Asia/Karachi' });
                const sunset = new Date(data.results.sunset).toLocaleString("en-US", { timeZone: 'Asia/Karachi' });
                updateSunTimes(sunrise, sunset);
                createTimeSlots('day-table', sunrise, sunset, dayOfWeek);
            } else {
                sunTimesDiv.innerText = 'Error fetching sun times.';
            }
        } catch (error) {
            sunTimesDiv.innerText = 'Error fetching sun times.';
        }
    };

    const updateSunTimes = (sunrise, sunset) => {
        sunTimesDiv.innerText = `Sunrise: ${sunrise}, Sunset: ${sunset}`;
    };

    dateInput.addEventListener('change', async (e) => {
        const selectedDate = e.target.value;
        fetchSunTimes(selectedDate);
    });

    // Initialize with current date
    dateInput.value = new Date().toISOString().split('T')[0];
    fetchSunTimes(dateInput.value);
});
