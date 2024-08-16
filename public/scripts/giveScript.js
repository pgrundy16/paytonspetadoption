//Written by Payton Grundy, Student ID 40101784, for SOEN 287

function clearForm() {
    document.getElementById("giveaway-form").reset();
    document.getElementById("error-message").innerText = "";
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validateForm() {
    const form = document.getElementById("giveaway-form");
    const petType = form.elements["pettype"].value;
    const breed = form.elements["breed"].value;
    const age = form.elements["age"].value;
    const gender = form.elements["gender"].value;
    const alongDogs = form.elements["getsalongdogs"].checked;
    const alongCats = form.elements["getsalongcats"].checked;
    const alongChild = form.elements["suitablechildren"].checked;
    const comments = form.elements["comments"].value;
    const name = form.elements["name"].value;
    const ownerName = form.elements["ownername"].value;
    const ownerEmail = form.elements["owneremail"].value;

    let errorMessage = "";

    if (petType === "" || age === "" || name === "" || ownerName === "" || ownerEmail === "") {
        errorMessage += "Please fill out all required fields.<br>";
    }

    if (!validateEmail(ownerEmail)) {
        errorMessage += "Please enter a valid email address.<br>";
    }

    if (errorMessage) {
        document.getElementById("error-message").innerHTML = errorMessage;
        return false;
    }

    return true;
}

document.getElementById("giveaway-form").addEventListener("submit", function(event) {
    event.preventDefault();
    document.getElementById("error-message").style.color = 'red';

    if (!validateForm()) {
        return; // Stop execution if the form is not valid
    }

    const form = document.getElementById("giveaway-form");
    const formData = {};
    const inputs = form.querySelectorAll("input, select, textarea");

    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        } else if (input.type === 'radio' && input.checked) {
            formData[input.name] = input.value;
        } else if (input.type !== 'radio') {
            formData[input.name] = input.value;
        }
    });

    // Send the form data to the server
    fetch('/give', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("error-message").style.color = 'green';
            document.getElementById("error-message").innerText = data.message;
            form.reset();
        } else {
            document.getElementById("error-message").style.color = 'red';
            document.getElementById("error-message").innerText = data.message || "An error occurred.";
        }
    })
    .catch(error => {
        document.getElementById("error-message").style.color = 'red';
        document.getElementById("error-message").innerText = "An error occurred.";
        console.error('Error:', error);
    });
});