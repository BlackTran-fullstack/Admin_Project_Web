const form = document.getElementById("reset-code-form"),
    codeForm = form.querySelector(".form-code-verification"),
    codeInput = codeForm.querySelector("#code-verification"),
    codeError = document.querySelector(".code-error .error-text");

const userId = new URLSearchParams(window.location.search).get("userId");

let attemptCount = 0;
const maxAttempts = 5;

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (attemptCount >= maxAttempts) {
        alert("Too many failed attempts. Please try again later.");
        return;
    }

    const formData = { userId, otp: codeInput.value };

    try {
        const res = await fetch("/reset-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok && data.success) {
            window.location.href = `/new-password?userId=${data.userId}`;
        } else if (data.errors) {
            data.errors.forEach((error) => {
                if (error.includes("OTP")) {
                    codeError.textContent = error;
                    codeForm.classList.add("invalid");
                }
            });
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error connecting to server. Please try again later.");
    }
});
