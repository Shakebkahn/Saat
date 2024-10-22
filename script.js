document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-picker');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');
    const sunTimesDiv = document.getElementById('sun-times');

    const getCoordinates = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                }, reject);
            } else {
                reject('Geolocation is not supported by this browser.');
            }
        });
    };

    const fetchSunTimes = async (date) => {
        try {
            const coordinates = await getCoordinates();
            const apiUrl = `https://api.sunrise-sunset.org/json?lat=${coordinates.lat}&lng=${coordinates.lng}&date=${date}&formatted=0`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            updateSunTimes(data.results);
        } catch (error) {
            sunTimesDiv.innerText = 'Error fetching sun times.';
            console.error('Error fetching sunrise and sunset times:', error);
        }
    };

    const updateSunTimes = (sunTimes) => {
        const sunrise = new Date(sunTimes.sunrise).toLocaleTimeString();
        const sunset = new Date(sunTimes.sunset).toLocaleTimeString();
        sunTimesDiv.innerText = `Sunrise: ${sunrise}, Sunset: ${sunset}`;
        // Update your tables with the new sun times...
    };

    dateInput.addEventListener('change', (e) => {
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
});
