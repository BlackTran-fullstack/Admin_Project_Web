document.querySelectorAll(".creation-date").forEach((element) => {
    const dateText = element.textContent;

    const date = new Date(dateText);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    element.textContent = `${day} - ${month} - ${year}`;
});

const page = 1,
    limit = 8;

const currentUserId = document
    .querySelector("tbody")
    .getAttribute("data-current-user-id");

async function loadUsers(
    page = 1,
    limit = 8,
    sortBy = "createdAt",
    order = "desc",
    search = "",
    fields = "firstName,lastName,email"
) {
    try {
        const queryParameters = new URLSearchParams({
            page,
            limit,
            sortBy,
            order,
            search,
            fields,
        });

        const res = await fetch(`/users/api?${queryParameters.toString()}`);

        if (!res.ok) {
            throw new Error("Internal Server Error");
        }

        const data = await res.json();

        const usersTable = document.querySelector(".table tbody");
        usersTable.innerHTML = "";

        data.data.forEach((user) => {
            const date = new Date(user.createdAt);
            const formattedDate = `${date
                .getDate()
                .toString()
                .padStart(2, "0")} - 
                ${(date.getMonth() + 1).toString().padStart(2, "0")} - 
                ${date.getFullYear()}`;

            const firstName = user.firstName || "";
            const lastName = user.lastName || "";

            const row = `
                <tr data-id="${user._id}">
                    <td><img
                            src="${user.avatar}"
                            alt=""
                            class="avatar"
                        /></td>
 
                        <td><p class="name">${firstName}
                                ${lastName}</p></td>

                        <td><p class="email">${user.email}</p></td>

                        <td><p
                                class="creation-date"
                            >${formattedDate}</p></td>

                        <td><p class="role">${user.role}</p></td>

                        <td>
                        ${
                            user._id !== currentUserId
                                ? user.isBanned
                                    ? `<button class="btn btn-unban">
                                             <i class="fa-solid fa-check"></i> Unban
                                        </button>`
                                    : `<button class="btn btn-ban">
                                             <i class="fa-solid fa-ban"></i> Ban
                                        </button>`
                                : ""
                        }
                        </td>
                    </tr>
            `;
            usersTable.innerHTML += row;
        });

        updatePagination(data.page, data.totalPages);
    } catch (error) {
        console.error("Error loading users:", error);
    }
}

let searchKeyword = "",
    sortBy = "createdAt",
    order = "desc";

document.querySelector(".search").addEventListener("input", (event) => {
    searchKeyword = event.target.value;
    loadUsers(1, limit, sortBy, order, searchKeyword);
});

function updatePagination(currentPage, totalPages) {
    const previousButton = document.querySelector(".btn-prev");
    const nextButton = document.querySelector(".btn-next");

    const paginationText = document.querySelector(".text");
    paginationText.textContent = `Page ${currentPage} of ${totalPages}`;

    if (currentPage > 1) {
        previousButton.classList.remove("disabled");
        previousButton.onclick = () =>
            loadUsers(currentPage - 1, limit, sortBy, order, searchKeyword);
    } else {
        previousButton.classList.add("disabled");
        previousButton.onclick = null;
    }

    if (currentPage < totalPages) {
        nextButton.classList.remove("disabled");
        nextButton.onclick = () =>
            loadUsers(currentPage + 1, limit, sortBy, order, searchKeyword);
    } else {
        nextButton.classList.add("disabled");
        nextButton.onclick = null;
    }
}

document.querySelectorAll(".table tbody").forEach((element) => {
    element.addEventListener("click", (event) => {
        if (!event.target.classList.contains("btn")) {
            const userId = event.target.closest("tr").dataset.id;
            window.location.href = `/users/${userId}`;
        } else if (event.target.classList.contains("btn-ban")) {
            const userId = event.target.closest("tr").dataset.id;
            updateUserStatus(userId, true);
        } else if (event.target.classList.contains("btn-unban")) {
            const userId = event.target.closest("tr").dataset.id;
            updateUserStatus(userId, false);
        }
    });
});

async function updateUserStatus(userId, isBanned) {
    try {
        const res = await fetch(
            `/users/${userId}/${isBanned ? "ban" : "unban"}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isBanned }),
            }
        );

        const data = await res.json();
        if (res.ok && data.success) {
            location.reload();
        } else {
            console.error("Failed to update user status");
        }
    } catch (error) {
        console.error("Error updating user status:", error);
    }
}

function toggle() {
    const dropdown = document.querySelector(".dropdown-list");
    const icon = document.querySelector(".fa-caret-down");
    if (dropdown) {
        dropdown.classList.toggle("show");
        icon.classList.toggle("rotate");
    }
}

document.addEventListener("click", (event) => {
    const dropdown = document.querySelector(".dropdown-list");
    const icon = document.querySelector(".fa-caret-down");

    if (
        dropdown &&
        !dropdown.contains(event.target) &&
        !icon.contains(event.target)
    ) {
        dropdown.classList.remove("show");
    }
});

document.querySelectorAll(".dropdown-list .dropdown-item").forEach((item) => {
    item.addEventListener("click", (event) => {
        const selected = document.querySelector(".filter .selected b");
        selected.textContent = event.target.textContent;

        const dropdown = document.querySelector(".dropdown-list");
        dropdown.classList.remove("show");
        const icon = document.querySelector(".fa-caret-down");
        icon.classList.remove("rotate");

        if (selected.textContent === "Newest") {
            sortBy = "createdAt";
            order = "desc";
        } else if (selected.textContent === "Latest") {
            sortBy = "createdAt";
            order = "asc";
        }

        console.log("Sort By:", sortBy, "Order:", order);
        loadUsers(page, limit, sortBy, order, searchKeyword);
    });
});

loadUsers();
