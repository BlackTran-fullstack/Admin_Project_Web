// Biến toàn cục để lưu trạng thái
let currentPage = 1;
let currentLimit = 5;
let currentSortBy = "name";
let currentOrder = "asc";
let currentSearch = "";
let currentFilter = "";

// Input search
document.querySelector(".input-search").addEventListener("input", () => {
    currentSearch = document.querySelector(".input-search").value;
    loadUsers(1, currentLimit, currentSortBy, currentOrder, currentSearch, currentFilter);
});

// Sắp xếp theo option
document.querySelector(".select-sort").addEventListener("change", () => {
    currentSortBy = document.querySelector(".select-sort").value;
    loadUsers(1, currentLimit, currentSortBy, currentOrder, currentSearch, currentFilter);
});

// Filter theo option
document.querySelector(".select-filter").addEventListener("change", () => {
    currentFilter = document.querySelector(".select-filter").value;
    loadUsers(1, currentLimit, currentSortBy, currentOrder, currentSearch, currentFilter);
});


//add product
document.getElementById("btn-create").onclick = function() {
    // alert("hello");
    document.getElementById("addProductDialog").style.display = "block";
};

// Đóng dialog
document.getElementById("closeDialog").onclick = function () {
    document.getElementById("addProductDialog").style.display = "none";
};

document.getElementById("addProductForm").onsubmit = async function (e) {
    e.preventDefault(); // Ngăn reload trang

    // Thu thập thông tin từ form
    const productData = {
        name: document.getElementById("productName").value,
        price: parseFloat(document.getElementById("productPrice").value),
        category: document.getElementById("productCategory").value,
        stock: parseInt(document.getElementById("productStock").value),
        imagePath: document.getElementById("productImage").value,
    };

    try {
        // Gửi dữ liệu đến server qua API
        const response = await fetch("/products/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
        });

        if (response.ok) {
            const newProduct = await response.json();

            // Thêm sản phẩm mới vào bảng hiển thị
            addProductToTable(newProduct);

            // Đóng dialog
            document.getElementById("addProductDialog").style.display = "none";

            // Reset form
            document.getElementById("addProductForm").reset();
        } else {
            alert("Failed to add product");
        }
    } catch (error) {
        console.error("Error adding product:", error);
    }
};

// function addProductToTable(product) {
//     const usersTable = document.querySelector(".table tbody");

//     const categoryName = product.categoriesId ? product.categoriesId.name : "Unknown";
//     const brandName = product.brandsId ? product.brandsId.name : "Unknown";

//     const date = new Date(product.createdAt);
//     const formattedDate = `${date.getDate().toString().padStart(2, "0")} - 
//                            ${(date.getMonth() + 1).toString().padStart(2, "0")} - 
//                            ${date.getFullYear()}`;

//     const row = `
//         <tr>
//             <td><img src="${product.imagePath}" alt="" class="avatar" /></td>
//             <td><p class="name">${product.name}</p></td>
//             <td><p class="categoriesId">${categoryName}</p></td>
//             <td><p class="brand">${brandName}</p></td>
//             <td><p class="price">${product.price}</p></td>
//             <td><p class="creation-date">${formattedDate}</p></td>
//             <td><p class="role">${product.stock}</p></td>
//             <td>
//                 <button class="btn btn-update">
//                     <i class="fa-solid fa-pen"></i>
//                 </button>
//                 <button class="btn btn-delete">
//                     <i class="fa-solid fa-trash"></i>
//                 </button>
//             </td>
//         </tr>
//     `;

//     usersTable.innerHTML += row;
// }


// Hàm xử lý sự kiện xóa sản phẩm
document.querySelector(".table").addEventListener("click", async (e) => {
    if (e.target && e.target.closest(".btn-delete")) {
        const productId = e.target.closest("tr").dataset.productId;

        if (confirm("Are you sure you want to delete this product?")) {
            try {
                // Gửi yêu cầu xóa sản phẩm từ server
                const response = await fetch(`/products/api/${productId}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    // Xóa sản phẩm khỏi bảng hiển thị
                    const row = e.target.closest("tr");
                    row.remove();
                } else {
                    alert("Failed to delete product");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    }
});

// Cập nhật hàm addProductToTable để bao gồm data-product-id
function addProductToTable(product) {
    const usersTable = document.querySelector(".table tbody");

    const categoryName = product.categoriesId ? product.categoriesId.name : "Unknown";
    const brandName = product.brandsId ? product.brandsId.name : "Unknown";

    const date = new Date(product.createdAt);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")} - 
                           ${(date.getMonth() + 1).toString().padStart(2, "0")} - 
                           ${date.getFullYear()}`;

    const row = `
        <tr data-product-id="${product._id}">
            <td><img src="${product.imagePath}" alt="" class="avatar" /></td>
            <td><p class="name">${product.name}</p></td>
            <td><p class="categoriesId">${categoryName}</p></td>
            <td><p class="brand">${brandName}</p></td>
            <td><p class="price">${product.price}</p></td>
            <td><p class="creation-date">${formattedDate}</p></td>
            <td><p class="role">${product.stock}</p></td>
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

    usersTable.innerHTML += row;
}



// Định dạng ngày tháng
document.querySelectorAll(".creation-date").forEach((element) => {
    const dateText = element.textContent;

    const date = new Date(dateText);

    const day = date.getDate().toString().padStart(2, "0");

    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    const year = date.getFullYear();

    element.textContent = `${day} - ${month} - ${year}`;
});

// Hàm tải danh sách người dùng
async function loadUsers(
    page = currentPage,
    limit = currentLimit,
    sortBy = currentSortBy,
    order = currentOrder,
    search = currentSearch,
    filter = currentFilter
) {
    try {
        currentPage = page;
        currentLimit = limit;
        currentSortBy = sortBy;
        currentOrder = order;
        currentSearch = search;
        currentFilter = filter;

        const queryParameters = new URLSearchParams({
            page,
            limit,
            sortBy,
            order,
            search,
            filter,
            fields: "name,email",
        });

        const res = await fetch(`/products/api?${queryParameters.toString()}`);

        if (!res.ok) {
            throw new Error("Internal Server Error");
        }

        const data = await res.json();

        const usersTable = document.querySelector(".table tbody");
        usersTable.innerHTML = "";

        data.data.forEach((product) => {

            const categoryName = product.categoriesId ? product.categoriesId.name : "Unknown";

            const brandName = product.brandsId ? product.brandsId.name : "Unknown";

            const date = new Date(product.createdAt);

            const formattedDate = `${date
                .getDate()
                .toString()
                .padStart(2, "0")} - ${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")} - ${date.getFullYear()}`;

            const row = `
                <tr data-product-id="${product._id}">
                    <td><img
                            src="${product.imagePath}"
                            alt=""
                            class="avatar"
                        /></td>
 
                        <td>
                            <p class="name">
                                ${product.name}
                            </p>
                        </td>

                        <td>
                            <p class="categoriesId">
                                ${categoryName}
                            </p>
                        </td>

                        <td>
                            <p class="brand">
                                ${brandName}
                            </p>
                        </td>

                        <td>
                            <p class="price">
                                ${product.price}
                            </p>
                        </td>

                        <td>
                            <p class="creation-date">
                                ${formattedDate}
                            </p>
                        </td>

                        <td>
                            <p class="role">
                                ${product.stock}
                            </p>
                        </td>

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
            usersTable.innerHTML += row;
        });

        updatePagination(data.page, data.totalPages);
    } catch (error) {
        console.error("Error loading users:", error);
    }
}

// Hàm cập nhật phân trang
function updatePagination(currentPage, totalPages) {

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

// Gọi hàm loadUsers khi trang được tải
loadUsers();
