const createTimeSlots = (tableBody, startTime, endTime) => {
    tableBody.innerHTML = '';  // Clear any existing rows

    let currentTime = new Date().getTime();
    let slotDuration = (endTime - startTime) / timeSlots.length;

    for (let i = 0; i < timeSlots.length; i++) {
        const slot = timeSlots[i];
        const row = document.createElement('tr');
        const slotStartTime = startTime + (i * slotDuration);
        const slotEndTime = slotStartTime + slotDuration;

        row.innerHTML = `
            <td>${convertToLocalTime(slotStartTime)} - ${convertToLocalTime(slotEndTime)}</td>
            <td>${slot.name}</td>  // Planet Name
            <td>${slot.number}</td> // Planet Number
        `;

        // Highlight the current saat
        if (currentTime >= slotStartTime && currentTime < slotEndTime) {
            row.classList.add('highlight-current');
        }

        tableBody.appendChild(row);
    }
};
