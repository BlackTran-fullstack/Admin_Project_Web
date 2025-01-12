const constLimit = 3;

async function loadCategories(
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

        const res = await fetch(`/categories/api?${queryParameters.toString()}`);

        if (!res.ok) {
            throw new Error("Internal Server Error");
        }

        const data = await res.json();

        const categoriesTable = document.querySelector(".table tbody");
        categoriesTable.innerHTML = "";

        data.data.forEach((cate) => {
            const row = `
                <tr data-id="${cate._id}"> 
                    <td><p class="id">${cate._id}</p></td>
                    <td><p class="name">${cate.name}</p></td>
                    <td><p class="description">${cate.desc}</p></td>
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
            categoriesTable.innerHTML += row;
        });

        const updateButtons = document.querySelectorAll(".btn-update");
        updateButtons.forEach((button) => {
            button.onclick = function () {
                const row = button.closest("tr");
                const id = row.getAttribute("data-id");
                const name = row.querySelector(".name").textContent;
                const desc = row.querySelector(".description").textContent;

                const updateDialog = document.querySelector("#updateCategoriesDialog");
                const form = updateDialog.querySelector("#updateCateForm");

                form.name.value = name;
                form.description.value = desc;

                const cancelButton = updateDialog.querySelector("#closeDialog");
                cancelButton.onclick = function () {
                    updateDialog.style.display = "none";
                };

                form.onsubmit = async function (event) {
                    event.preventDefault();

                    const name = form.name.value;
                    const desc = form.description.value;

                    const res = await fetch(`/categories/api/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ name, desc }),
                    });

                    if (res.ok) {
                        alert("Category updated successfully");
                        loadCategories();
                        updateDialog.style.display = "none";
                    }
                };

                updateDialog.style.display = "flex";
            };
        });

        const deleteButtons = document.querySelectorAll(".btn-delete");
        deleteButtons.forEach((button) => {
            button.onclick = async function () {
                if (!confirm("Are you sure you want to delete this category?")) {
                    return;
                }

                const row = button.closest("tr");
                const id = row.getAttribute("data-id");

                const res = await fetch(`/categories/api/${id}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    alert("Category deleted successfully");
                    loadCategories();
                }
            };
        });

        updatePagination(data.page, data.totalPages);
    } catch (error) {
        console.error("Error loading users:", error);
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
            loadCategories(currentPage - 1, constLimit);
    } else {
        previousButton.classList.add("disabled");
        previousButton.onclick = null;
    }

    if (currentPage < totalPages) {
        nextButton.classList.remove("disabled");
        nextButton.onclick = () =>
            loadCategories(currentPage + 1, constLimit);
    } else {
        nextButton.classList.add("disabled");
        nextButton.onclick = null;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#btn-create").onclick = function () {
        const addDialog = document.querySelector("#addCategoriesDialog");
        
        const cancelButton = addDialog.querySelector("#closeDialog");
        cancelButton.onclick = function () {
            addDialog.style.display = "none";
        };
        
        const form = addDialog.querySelector("#addCateForm");
        form.onsubmit = async function (event) {
            event.preventDefault();
            
            const name = form.name.value;
            const desc = form.description.value;
            
            const res = await fetch("/categories/api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, desc }),
            });
            
            if (res.ok) {
                form.reset();
                alert("Category created successfully");
                loadCategories();
                addDialog.style.display = "none";
            }
        }

        addDialog.style.display = "flex";
    };

    loadCategories();
});