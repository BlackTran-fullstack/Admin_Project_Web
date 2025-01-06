document.querySelector(".input-search").addEventListener("input", () => {
    const search = document.querySelector(".input-search").value;
    loadUsers(1, 5, "name", "asc", search);
});


//sap xep theo option
document.querySelector(".select-sort").addEventListener("change", () => {
    const sortBy = document.querySelector(".select-sort").value;
    loadUsers(1, 5, sortBy, "asc");
});


document.querySelectorAll(".creation-date").forEach((element) => {
    const dateText = element.textContent;

    const date = new Date(dateText);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    element.textContent = `${day} - ${month} - ${year}`;
});

async function loadUsers(
    page = 1,
    limit = 5,
    sortBy = "name",
    order = "asc",
    search = "",
    fields = "name,email"
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

        const res = await fetch(`/products/api?${queryParameters.toString()}`);

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

            const row = `
                <tr>
                    <td><img
                            src="${user.imagePath}"
                            alt=""
                            class="avatar"
                        /></td>
 
                        <td>
                            <p class="name">
                                ${user.name}
                            </p>
                        </td>

                        <td>
                            <p class="categoriesId">
                                ${user.categoriesId}
                            </p>
                        </td>

                        <td>
                            <p class="brand">
                                ${user.brandId}
                            </p>
                        </td>

                        <td>
                            <p class="price">
                                ${user.price}
                            </p>
                        </td>

                        <td>
                            <p class="creation-date">
                                ${formattedDate}
                            </p>
                        </td>

                        <td>
                            <p class="role">
                                ${user.stock}
                            </p>
                        </td>

                        <td>
                            <button class="btn btn-ban">
                                <i class="fa-solid fa-ban"></i>
                            </button>
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

function updatePagination(currentPage, totalPages) {
    const pagination = document.querySelector(".pagination");
    const previousButton = document.querySelector(".btn-prev");
    const nextButton = document.querySelector(".btn-next");

    const paginationText = document.querySelector(".text");
    paginationText.textContent = `Page ${currentPage} of ${totalPages}`;

    if (currentPage > 1) {
        previousButton.classList.remove("disabled");
        previousButton.onclick = () => loadUsers(currentPage - 1);
    } else {
        previousButton.classList.add("disabled"); 
        previousButton.onclick = null;
    }

    if (currentPage < totalPages) {
        nextButton.classList.remove("disabled");
        nextButton.onclick = () => loadUsers(currentPage + 1);
    } else {
        nextButton.classList.add("disabled");
        nextButton.onclick = null;
    }
}

loadUsers();
