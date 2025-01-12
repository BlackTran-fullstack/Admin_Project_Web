const constLimit = 3;

async function loadBrands(
    page = 1,
    limit = constLimit,
    sortBy = "name",
    order = "asc",
    search = "",
    fields = "name"
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

        const res = await fetch(`/brands/api?${queryParameters.toString()}`);

        if (!res.ok) {
            throw new Error("Internal Server Error");
        }

        const data = await res.json();

        const brandsTable = document.querySelector(".table tbody");
        brandsTable.innerHTML = "";

        data.data.forEach((brand) => {
            const row = `
                <tr data-id="${brand._id}">
                    <td><p class="id">${brand._id}</p></td>
                    <td><p class="name">${brand.name}</p></td>
                    <td>
                        <button class="btn btn-update">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        
                        <button class="btn btn-delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            brandsTable.innerHTML += row;
        });

        const updateButtons = document.querySelectorAll(".btn-update");
        updateButtons.forEach((button) => {
            button.onclick = function () {
                const row = button.closest("tr");
                const id = row.getAttribute("data-id");
                const name = row.querySelector(".name").textContent;

                const updateDialog = document.querySelector("#updateBrandDialog");
                const form = updateDialog.querySelector("#updateBrandForm");

                form.name.value = name;

                const cancelButton = updateDialog.querySelector("#closeDialog");
                cancelButton.onclick = function () {
                    updateDialog.style.display = "none";
                };

                form.onsubmit = async function (event) {
                    event.preventDefault();

                    const name = form.name.value;

                    const res = await fetch(`/brands/api/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ name }),
                    });

                    if (res.ok) {
                        alert("Brand updated successfully");
                        loadBrands();
                        updateDialog.style.display = "none";
                    }
                };

                updateDialog.style.display = "flex";
            };
        });

        const deleteButtons = document.querySelectorAll(".btn-delete");
        deleteButtons.forEach((button) => {
            button.onclick = async function () {
                if (!confirm("Are you sure you want to delete this brand?")) {
                    return;
                }

                const row = button.closest("tr");
                const id = row.getAttribute("data-id");

                const res = await fetch(`/brands/api/${id}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    alert("Brand deleted successfully");
                    loadBrands();
                }
            };
        });

        updatePagination(data.page, data.totalPages);
    } catch (error) {
        console.error("Error loading brands:", error);
    }
}

function updatePagination(currentPage, totalPages) {
    const previousButton = document.querySelector(".btn-prev");
    const nextButton = document.querySelector(".btn-next");

    const paginationText = document.querySelector(".text");
    paginationText.textContent = `Page ${currentPage} of ${totalPages}`;

    if (currentPage > 1) {
        previousButton.classList.remove("disabled");
        previousButton.onclick = () =>
            loadBrands(currentPage - 1, constLimit);
    } else {
        previousButton.classList.add("disabled");
        previousButton.onclick = null;
    }

    if (currentPage < totalPages) {
        nextButton.classList.remove("disabled");
        nextButton.onclick = () =>
            loadBrands(currentPage + 1, constLimit);
    } else {
        nextButton.classList.add("disabled");
        nextButton.onclick = null;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#btn-create").onclick = function () {
        const addDialog = document.querySelector("#addBrandDialog");
        
        const cancelButton = addDialog.querySelector("#closeDialog");
        cancelButton.onclick = function () {
            addDialog.style.display = "none";
        };
        
        const form = addDialog.querySelector("#addBrandForm");
        form.onsubmit = async function (event) {
            event.preventDefault();
            
            const name = form.name.value;
            
            const res = await fetch("/brands/api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            });
            
            if (res.ok) {
                form.reset();
                alert("Brand created successfully");
                loadBrands();
                addDialog.style.display = "none";
            }
        }

        addDialog.style.display = "flex";
    };

    loadBrands();
});