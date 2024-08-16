//Written by Payton Grundy, Student ID 40101784, for SOEN 287

function displayDateTime() {
    const now = new Date();
    const datetimeElement = document.getElementById('datetime');
    datetimeElement.innerHTML = now.toLocaleString();
    datetimeElement.style.visibility = "visible";
}

setInterval(displayDateTime, 1000);