//Written by Payton Grundy, Student ID 40101784, for SOEN 287

function clearForm() {
    document.getElementById("find-form").reset();
    document.getElementById("error-message").innerText = "";
    document.getElementById("pet-list").innerHTML = ""; // Clear the displayed pets when form is cleared
}

function validateForm() {
    const form = document.getElementById("find-form");
    const petType = form.elements["pettype"].value;
    const age = form.elements["age"].value;
    const gender = form.elements["gender"].value;

    if (petType === "" || age === "" || gender === "") {
        document.getElementById("error-message").innerText = "Please fill out all required fields.";
        return false;
    }

    return true;
}

function retainFormData(formData) {
    const form = document.getElementById("find-form");
    const inputs = form.querySelectorAll("input, select");

    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = formData[input.name] || false;
        } else if (input.type === 'radio') {
            input.checked = formData[input.name] === input.value;
        } else {
            input.value = formData[input.name] || "";
        }
    });
}

function parsePetString(petString) {
    const [id, username, petType, breed, age, gender, getsAlongWithDogs, getsAlongWithCats, suitableForChildren, comments, name, ownerName, ownerEmail] = petString.split(':');
    return {
        id,
        username,
        petType,
        breed,
        age: parseInt(age),
        gender,
        getsAlongWithDogs: getsAlongWithDogs === 'true',
        getsAlongWithCats: getsAlongWithCats === 'true',
        suitableForChildren: suitableForChildren === 'true',
        comments,
        name,
        ownerName,
        ownerEmail
    };
}

function filterPets(pets, formData) {
    return pets.filter(petString => {
        const pet = parsePetString(petString);

        // Ensure petType matches
        if (pet.petType.toLowerCase() !== formData["pettype"].toLowerCase()) {
            return false;
        }

        // Optional filters
        if (formData.breed && formData.breed !== "Doesn't Matter" && pet.breed !== formData.breed) {
            return false;
        }

        // Determine pet age range
        let petAgeRange = '';
        if (0 < pet.age && pet.age <= 2) {
            petAgeRange = "puppy/kitten";
        } else if (2 < pet.age && pet.age <= 6) {
            petAgeRange = "adult";
        } else if (6 < pet.age) {
            petAgeRange = "senior";
        }

        if (formData.age && formData.age !== "any" && petAgeRange !== formData.age) {
            return false;
        }

        if (formData.gender && formData.gender !== "any" && pet.gender.toLowerCase() !== formData.gender.toLowerCase()) {
            return false;
        }

        if (formData["getalongdogs"] && !pet.getsAlongWithDogs) {
            return false;
        }

        if (formData["getalongcats"] && !pet.getsAlongWithCats) {
            return false;
        }

        if (formData["getalongchildren"] && !pet.suitableForChildren) {
            return false;
        }

        return true; // If all checks pass, include this pet
    });
}

function displayPets(pets) {
    const petList = document.getElementById("pet-list");
    petList.innerHTML = ""; // Clear any existing content

    if (pets.length === 0) {
        petList.innerHTML = "<p>No pets match your search criteria.</p>";
        return;
    }

    pets.forEach(petString => {
        const pet = parsePetString(petString);
        const petDiv = document.createElement("div");
        petDiv.className = "pet";

        const petDetails = `
            <h3>${pet.name}</h3>
            <p><b>Type:</b> ${pet.petType}</p>
            <p><b>Breed:</b> ${pet.breed}</p>
            <p><b>Age:</b> ${pet.age}</p>
            <p><b>Gender:</b> ${pet.gender}</p>
            <p><b>Gets Along with Dogs:</b> ${pet.getsAlongWithDogs ? "Yes" : "No"}</p>
            <p><b>Gets Along with Cats:</b> ${pet.getsAlongWithCats ? "Yes" : "No"}</p>
            <p><b>Suitable for Children:</b> ${pet.suitableForChildren ? "Yes" : "No"}</p>
            <p><b>Comments:</b> ${pet.comments}</p>
            <p><b>Owner Name:</b> ${pet.ownerName}</p>
            <a href="mailto:${pet.ownerEmail}?subject=${pet.name}">INTERESTED?</a>
        `;

        petDiv.innerHTML = petDetails;
        petList.appendChild(petDiv);
    });
}

document.getElementById("find-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting normally
    document.getElementById("error-message").innerText = "";
    document.getElementById("error-message").style.color = 'red';

    const form = document.getElementById("find-form");
    const formData = {};
    const inputs = form.querySelectorAll("input, select");

    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        } else if (input.type === 'radio' && input.checked) {
            formData[input.name] = input.value;
        } else if (input.type !== 'radio') {
            formData[input.name] = input.value;
        }
    });

    if (!validateForm()) {
        retainFormData(formData);
        return; // Stop execution if the form is not valid
    }

    // Fetch pets data and filter based on the criteria
    fetch('/path/to/pets.json')
        .then(response => response.json())
        .then(data => {
            const pets = data; // `data` should be an array of pet strings
            const filteredPets = filterPets(pets, formData); // Use filterPets function to filter pets
            displayPets(filteredPets);
        })
        .catch(error => console.error('Error fetching pets:', error));
});