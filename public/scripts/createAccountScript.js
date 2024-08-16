//Written by Payton Grundy, Student ID 40101784, for SOEN 287

document.getElementById("create-account-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message");
    document.getElementById("error-message").style.color = 'red';

    // Validate username
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        errorMessage.innerHTML = "Username can contain letters and digits only.";
        return;
    }

    // Validate password
    if (password.length < 4 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
        errorMessage.innerHTML = "Password must be at least 4 characters long, contain only letters and digits, and contain at least one letter and at least one digit.";
        return;
    }

    // Send the data to the server for further validation and account creation
    fetch('/createAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("error-message").style.color = 'green';
            document.getElementById("error-message").innerText = "Account created successfully!";
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