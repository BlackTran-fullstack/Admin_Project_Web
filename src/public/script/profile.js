const avatarImg = document.getElementById("avatar-img");
const avatarInput = document.getElementById("avatar-input");

avatarImg.addEventListener("click", () => {
    avatarInput.click();
});

avatarInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            avatarImg.src = e.target.result;
            const formData = new FormData();
            formData.append("avatar", avatarInput.files[0]);

            try {
                const response = await fetch("/profile/update-avatar", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(result.message);
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.error}`);
                }
            } catch (err) {
                console.error("Error updating avatar:", err);
                alert("An error occurred while updating avatar.");
            }
        };
        reader.readAsDataURL(file);
    }
});

const phoneInput = document.getElementById("phone");
const phoneForm = document.querySelector(".form-phone");
const emailInput = document.getElementById("email");
const emailForm = document.querySelector(".form-email");
const emailError = document.querySelector(".email-error .error-text");

const validatePhone = () => {
    const phonePattern = /^[0-9]{10}$/;
    if (!phoneInput.value.match(phonePattern)) {
        phoneForm.classList.add("invalid");
        return false;
    }
    phoneForm.classList.remove("invalid");
    return true;
};

const validateEmail = () => {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailInput.value.match(emailPattern)) {
        emailForm.classList.add("invalid");
        return false;
    }
    emailForm.classList.remove("invalid");
    return true;
};

phoneInput.addEventListener("keyup", validatePhone);
emailInput.addEventListener("keyup", validateEmail);

document.querySelector(".update-btn").addEventListener("click", async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();

    if (isEmailValid && isPhoneValid) {
        const formData = {
            firstName: document.getElementById("first-name").value.trim(),
            lastName: document.getElementById("last-name").value.trim(),
            address: document.getElementById("address").value.trim(),
            city: document.getElementById("city").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
        };

        try {
            const res = await fetch("/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                location.reload();
            } else if (data.errors) {
                data.errors.forEach((error) => {
                    if (error.includes("Email already exists.")) {
                        emailError.textContent = error;
                        emailForm.classList.add("invalid");
                    }
                });
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error connecting to server. Please try again later.");
        }
    }
});
