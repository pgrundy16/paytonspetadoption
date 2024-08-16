//Written by Payton Grundy, Student ID 40101784, for SOEN 287

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message");
    document.getElementById("error-message").style.color = 'red';

    // Validate username and password
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        errorMessage.innerText = "Username can contain letters and digits only.";
        return;
    }
    if (password.length < 4 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
        errorMessage.innerText = "Password must be at least 4 characters long, contain only letters and digits, and contain at least one letter and at least one digit.";
        return;
    }

    // Send the data to the server for validation
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/give'; // Redirect to the pet giveaway form
        } else {
            errorMessage.innerText = data.message || "Login failed. Please try again.";
        }
    })
    .catch(error => {
        errorMessage.innerText = "An error occurred.";
        console.error('Error:', error);
    });
});