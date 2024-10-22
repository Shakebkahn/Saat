javascript
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-picker');
    const dayTab = document.getElementById('day-tab');
    const nightTab = document.getElementById('night-tab');
    const dayTime = document.getElementById('day-time');
    const nightTime = document.getElementById('night-time');

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

    const fetchSunTimes = async (date, coordinates) => {
        const apiUrl = `https://api.sunrise-sunset.org/json?lat=${coordinates.lat}&lng=${coordinates.lng}&date=${date}&formatted=0`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        updateSunTimes(data.results);
    };

    const updateSunTimes = (sunTimes) => {
        const sunrise = new Date(sunTimes.sunrise).toLocaleTimeString();
        const sunset = new Date(sunTimes.sunset).toLocaleTimeString();
        document.getElementById('sun-times').innerText = `Sunrise: ${sunrise}, Sunset: ${sunset}`;
        // Update your tables with the new sun times...
    };

    dateInput.addEventListener('change', async (e) => {
        const selectedDate = e.target.value;
        const coordinates = await getCoordinates();
        await fetchSunTimes(selectedDate, coordinates);
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
    dateInput.dispatchEvent(new Event('change'));
});
