// Handles saving and loading data via localStorage

export function saveRegistration(formData) {
    let registrations = JSON.parse(localStorage.getItem("spotterRegistrations")) || [];
    registrations.push(formData);
    localStorage.setItem("spotterRegistrations", JSON.stringify(registrations));
}

export function getRegistrations() {
    return JSON.parse(localStorage.getItem("spotterRegistrations")) || [];
}

export function clearRegistrations() {
    localStorage.removeItem("spotterRegistrations");
}

import { saveRegistration, getRegistrations, clearRegistrations } from "./storage.js";

document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("signup-form");
    
    // Age note interaction (only runs if form exists on page)
    var ageSelect = document.getElementById("age");
    if (ageSelect) {
        var ageNote = document.createElement("p");
        ageNote.className = "hint";
        ageNote.hidden = true;
        ageNote.textContent = "Spotters under 13 must attend class with a parent or guardian.";
        ageSelect.parentNode.appendChild(ageNote);

        ageSelect.addEventListener("change", function () {
            ageNote.hidden = !ageSelect.value.startsWith("Under 13");
        });
    }

    // Local Storage Display updater
    var storageList = document.getElementById("storage-list");
    function updateStorageDisplay() {
        if (!storageList) return;
        var data = getRegistrations();
        storageList.innerHTML = "";
        if (data.length === 0) {
            storageList.innerHTML = "<li>No registrations saved yet.</li>";
            return;
        }
        data.forEach(function (item, index) {
            var li = document.createElement("li");
            li.textContent = `Reg #${index + 1}: ${item.name} (${item.email}) - Session: ${item.session}`;
            storageList.appendChild(li);
        });
    }

    updateStorageDisplay();

    // Clear storage button functionality
    var clearBtn = document.getElementById("clear-storage");
    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            clearRegistrations();
            updateStorageDisplay();
        });
    }

    if (!form) return;

    var submitButton = form.querySelector("button[type='submit']");
    var status = document.createElement("p");
    status.setAttribute("role", "status");
    submitButton.parentNode.appendChild(status);

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent page reload to save data locally

        var formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            age: document.getElementById("age").value,
            session: document.getElementById("session").value
        };

        // Save to Local Storage
        saveRegistration(formData);
        updateStorageDisplay();

        status.textContent = "Success! Your registration has been saved to local storage.";
        form.reset();
        if (ageNote) ageNote.hidden = true;
    });
});