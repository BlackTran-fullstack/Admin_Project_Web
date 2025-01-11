const form = document.getElementById("new-password-form"),
    passwordForm = form.querySelector(".form-password"),
    passwordInput = passwordForm.querySelector("#password"),
    confirmPasswordForm = form.querySelector(".form-confirm-password"),
    confirmPasswordInput =
        confirmPasswordForm.querySelector("#confirm_password"),
    passwordError = document.querySelector(".password-error .error-text"),
    confirmPasswordError = document.querySelector(
        ".confirm-password-error .error-text"
    );

const userId = new URLSearchParams(window.location.search).get("userId");

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

passwordInput.addEventListener("keyup", createPassword);
confirmPasswordInput.addEventListener("keyup", confirmPassword);

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isPasswordValid = createPassword();
    const isConfirmPasswordValid = confirmPassword();

    if (isPasswordValid && isConfirmPasswordValid) {
        const formData = {
            userId: userId,
            password: passwordInput.value,
        };

        const res = await fetch("/new-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok && data.success) {
            window.location.href = "/login";
        } else {
            const data = await res.json();
            passwordError.textContent = data.password;
        }
    }
});
