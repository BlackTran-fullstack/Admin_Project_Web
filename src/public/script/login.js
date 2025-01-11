const message = sessionStorage.getItem("notification");

if (message) {
    const notificationElement = document.querySelector(".notification");
    const messageElement = document.querySelector(".notification-text");
    notificationElement.classList.add("active");
    messageElement.textContent = message;

    setTimeout(() => {
        notificationElement.classList.remove("active");
        sessionStorage.removeItem("notification");
    }, 5000);
}

const form = document.getElementById("login-form");
const emailInput = form.querySelector("#email");
const passwordInput = form.querySelector("#password");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        email: emailInput.value,
        password: passwordInput.value,
    };

    try {
        const res = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        console.log(data);

        if (res.ok && data.success) {
            window.location.href = "/dashboard";
        } else if (data.errors) {
            data.errors.forEach((error) => {
                const notificationElement =
                    document.querySelector(".notification");
                const messageIcon = document.querySelector(".notification i");
                const messageElement =
                    document.querySelector(".notification-text");

                notificationElement.classList.add("active");
                notificationElement.style.color = "#d93025";
                messageIcon.classList.remove("fa-check");
                messageIcon.classList.add("fa-circle-exclamation");
                messageElement.textContent = error;

                setTimeout(() => {
                    notificationElement.classList.remove("active");
                    sessionStorage.removeItem("notification");
                }, 5000);
            });
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error connecting to server. Please try again later.");
    }
});
