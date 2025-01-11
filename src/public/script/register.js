const form = document.getElementById("register-form"),
    emailForm = form.querySelector(".form-email"),
    emailInput = emailForm.querySelector("#email"),
    emailError = document.querySelector(".email-error .error-text"),
    passwordForm = form.querySelector(".form-password"),
    passwordInput = passwordForm.querySelector("#password"),
    confirmPasswordForm = form.querySelector(".form-confirm-password"),
    confirmPasswordInput =
        confirmPasswordForm.querySelector("#confirm_password");

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

// Password Validation
function createPassword() {
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordInput.value.match(passwordPattern)) {
        passwordForm.classList.add("invalid");
        return false;
    }
    passwordForm.classList.remove("invalid");
    return true;
}

// Confirm Password Validation
function confirmPassword() {
    if (
        passwordInput.value !== confirmPasswordInput.value ||
        confirmPasswordInput.value === ""
    ) {
        confirmPasswordForm.classList.add("invalid");
        return false;
    }
    confirmPasswordForm.classList.remove("invalid");
    return true;
}

emailInput.addEventListener("keyup", checkEmail);
passwordInput.addEventListener("keyup", createPassword);
confirmPasswordInput.addEventListener("keyup", confirmPassword);

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isEmailValid = checkEmail();
    const isPasswordValid = createPassword();
    const isConfirmPasswordValid = confirmPassword();

    if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
        const formData = {
            email: emailInput.value,
            password: passwordInput.value,
        };

        try {
            const res = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                sessionStorage.setItem(
                    "notification",
                    "Please check your email to verify your account."
                );
                window.location.href = "/login";
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
