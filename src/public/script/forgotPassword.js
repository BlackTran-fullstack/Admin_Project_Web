const form = document.getElementById("forgot-password-form"),
    emailForm = form.querySelector(".form-email"),
    emailInput = emailForm.querySelector("#email"),
    emailError = document.querySelector(".email-error .error-text");

// Email Validation
function checkEmail() {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailInput.value.match(emailPattern)) {
        emailError.textContent = "Please enter a valid email.";
        emailForm.classList.add("invalid");
        return false;
    }
    emailForm.classList.remove("invalid");
    return true;
}

emailInput.addEventListener("keyup", checkEmail);

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isEmailValid = checkEmail();

    if (isEmailValid) {
        const formData = {
            email: emailInput.value,
        };

        try {
            const res = await fetch("/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                window.location.href = `/reset-code?userId=${data.userId}`;
            } else if (data.errors) {
                data.errors.forEach((error) => {
                    if (error.includes("Email")) {
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
