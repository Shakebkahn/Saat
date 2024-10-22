document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-picker');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');
    const sunTimesDiv = document.getElementById('sun-times');

    const timeSlots = [
        { time: "5:30 AM - 6:00 AM", saat: "Mushtari", planet: "Jupiter" },
        { time: "6:00 AM - 7:15 AM", saat: "Marekh", planet: "Mars" },
        { time: "7:15 AM - 8:30 AM", saat: "Shams", planet: "Sun" },
        { time: "8:30 AM - 9:45 AM", saat: "Zohra", planet: "Venus" },
        { time: "9:45 AM - 11:00 AM", saat: "Attarad", planet: "Mercury" },
        { time: "11:00 AM - 12:15 PM", saat: "Qamar", planet: "Moon" },
        { time: "12:15 PM - 1:30 PM", saat: "Zuhal", planet: "Saturn" }
        // Add more slots as needed
    ];

    const createTimeSlots = (tableId) => {
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        timeSlots.forEach(slot => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${slot.time}</td><td>${slot.saat}</td><td>${slot.planet}</td>`;
            tableBody.appendChild(row);
        });
    };

    const getCoordinates = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    alert("Coordinates fetched: " + JSON.stringify(position.coords));
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                }, reject);
            } else {
                alert('Geolocation is not supported by this browser.');
                reject('Geolocation is not supported by this browser.');
            }
        });
    };

    const fetchSunTimes = async (date) => {
        try {
            const coordinates = await getCoordinates();
            alert("Fetching sun times for: " + JSON.stringify(coordinates));
            const apiUrl = `https://api.sunrise-sunset.org/json?lat=${coordinates.lat}&lng=${coordinates.lng}&date=${date}&formatted=0`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            alert("API response: " + JSON.stringify(data));
            updateSunTimes(data.results);
        } catch (error) {
            sunTimesDiv.innerText = 'Error fetching sun times.';
            alert('Error fetching sunrise and sunset times: ' + error);
            console.error('Error fetching sunrise and sunset times:', error);
        }
    };

    const updateSunTimes = (sunTimes) => {
        const sunrise = new Date(sunTimes.sunrise).toLocaleTimeString();
        const sunset = new Date(sunTimes.sunset).toLocaleTimeString();
        sunTimesDiv.innerText = `Sunrise: ${sunrise}, Sunset: ${sunset}`;
    };

    dateInput.addEventListener('change', async (e) => {
        const selectedDate = e.target.value;
        fetchSunTimes(selectedDate);
    });

    dayTab.addEventListener('click', () => {
        dayTime.classList.add('active');
        nightTime.classList.remove('active');
    });

    nightTab.addEventListener('click', () => {
        nightTime.classList.add('active');
        dayTime.classList.remove('active');
    });

    // Initialize with current date
    dateInput.value = new Date().toISOString().split('T')[0];
    fetchSunTimes(dateInput.value);
    createTimeSlots('day-table');
    createTimeSlots('night-table');
});
