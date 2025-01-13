// Biến toàn cục để lưu trạng thái
let currentPage = 1;
let currentLimit = 5;
let currentSortBy = "name";
let currentOrder = "asc";
let currentSearch = "";
let currentFilter = "";
let currentBrand = "";
let currentCategory = "";

// Hàm để lấy và hiển thị danh sách categories
async function fetchCategories() {
    try {
        const response = await fetch("products/categories");
        const categories = await response.json();
        const categorySelect = document.getElementById("category");
        const productCategory = document.getElementById("productCategory");
        const editProductCategory = document.getElementById(
            "editProductCategory"
        );

        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category._id; // Hoặc category._id tùy vào trường trong MongoDB
            option.textContent = category.name;
            categorySelect.appendChild(option);
            productCategory.appendChild(option.cloneNode(true));
            editProductCategory.appendChild(option.cloneNode(true));
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Hàm để lấy và hiển thị danh sách brands
async function fetchBrands() {
    try {
        const response = await fetch("products/brands");
        const brands = await response.json();
        const brandSelect = document.getElementById("brand");
        const productBrand = document.getElementById("productBrand");
        const editProductBrand = document.getElementById("editProductBrand");

        console.log(brands);

        brands.forEach((brand) => {
            const option = document.createElement("option");
            option.value = brand._id; // Hoặc brand._id tùy vào trường trong MongoDB
            option.textContent = brand.name;
            brandSelect.appendChild(option);
            productBrand.appendChild(option.cloneNode(true));
            editProductBrand.appendChild(option.cloneNode(true));
        });
    } catch (error) {
        console.error("Error fetching brands:", error);
    }
}

// Gọi các hàm khi trang tải xong
document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    fetchBrands();
});

// Input search
document.querySelector(".input-search").addEventListener("input", () => {
    currentSearch = document.querySelector(".input-search").value;
    loadUsers(
        1,
        currentLimit,
        currentSortBy,
        currentOrder,
        currentSearch,
        currentFilter
    );
});

// Sắp xếp theo option
document.querySelector(".select-sort").addEventListener("change", () => {
    currentSortBy = document.querySelector(".select-sort").value;
    loadUsers(
        1,
        currentLimit,
        currentSortBy,
        currentOrder,
        currentSearch,
        currentFilter
    );
});

// Filter theo option
document
    .querySelector(".select-filter-category")
    .addEventListener("change", () => {
        currentCategory = document.querySelector(
            ".select-filter-category"
        ).value;
        console.log(currentFilter);
        console.log(currentCategory);
        console.log(currentBrand);
        console.log(currentSearch);
        console.log(currentSortBy);
        console.log(currentOrder);

        loadUsers(
            1,
            currentLimit,
            currentSortBy,
            currentOrder,
            currentSearch,
            currentFilter,
            currentCategory,
            currentBrand
        );
    });

document
    .querySelector(".select-filter-brand")
    .addEventListener("change", () => {
        currentBrand = document.querySelector(".select-filter-brand").value;
        loadUsers(
            1,
            currentLimit,
            currentSortBy,
            currentOrder,
            currentSearch,
            currentFilter,
            currentCategory,
            currentBrand
        );
    });

//add product
document.getElementById("btn-create").onclick = function () {
    // alert("hello");
    document.getElementById("addProductDialog").style.display = "flex";
};

// Đóng dialog create product
document.getElementById("closeDialog").onclick = function () {
    document.getElementById("addProductDialog").style.display = "none";
};

// Đóng dialog update product
document.getElementById("closeUpdateDialog").onclick = function () {
    document.getElementById("updateProductDialog").style.display = "none";
};

// Add this function to handle file selection and preview
function handleFileSelect(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById("imagePreviewContainer");
    previewContainer.innerHTML = ""; // Clear existing previews

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.className = "preview-image";
                previewContainer.appendChild(img);
            };

            reader.readAsDataURL(file);
        }
    }

    // Display file count
    const fileCount = document.createElement("p");
    fileCount.textContent = `${files.length} file(s) selected`;
    fileCount.className = "file-count";
    previewContainer.appendChild(fileCount);
}

// Add this function to handle file selection and preview
function handleEditFileSelect(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById("EditPreviewContainer");
    previewContainer.innerHTML = ""; // Clear existing previews

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.className = "preview-image";
                previewContainer.appendChild(img);
            };

            reader.readAsDataURL(file);
        }
    }

    // Display file count
    const fileCount = document.createElement("p");
    fileCount.textContent = `${files.length} file(s) selected`;
    fileCount.className = "file-count";
    previewContainer.appendChild(fileCount);
}

document.getElementById("addProductForm").onsubmit = async function (e) {
    e.preventDefault(); // Ngăn reload trang

    const formData = new FormData(document.getElementById("addProductForm"));

    // Kiểm tra điều kiện price và stock phải là số
    const price = parseFloat(document.getElementById("productPrice").value);
    const stock = parseInt(document.getElementById("productStock").value);

    if (isNaN(price) || price <= 0) {
        alert("Price must be a valid number greater than 0.");
        return;
    }

    if (isNaN(stock) || stock < 0) {
        alert("Stock must be a valid non-negative number.");
        return;
    }

    try {
        // Gửi dữ liệu lên server
        const response = await fetch("/products/upload-img", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();

            const imageUrls = data.imageUrls; // Lấy tất cả URL của các ảnh đã upload

            const productData = {
                name: document.getElementById("productName").value,
                description:
                    document.getElementById("productDescription").value,
                price: price,
                category: document.getElementById("productCategory").value,
                brand: document.getElementById("productBrand").value,
                stock: stock,
                long_description: document.getElementById(
                    "productLongDescription"
                ).value,
                imagePath: imageUrls[0], // Lấy URL trả về từ server
                extraImages: imageUrls.slice(1), // Lấy các URL còn lại
                slug: document
                    .getElementById("productName")
                    .value.toLowerCase()
                    .replace(/ /g, "-"),
            };

            // Gửi dữ liệu sản phẩm về MongoDB
            const mongoResponse = await fetch("/products/api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (mongoResponse.ok) {
                const newProduct = await mongoResponse.json();
                addProductToTable(newProduct);
                document.getElementById("addProductDialog").style.display =
                    "none";
                document.getElementById("addProductForm").reset();
                document.getElementById("imagePreviewContainer").innerHTML = ""; // Clear image previews
            } else {
                alert("Failed to add product to MongoDB");
            }
        } else {
            alert("Failed to upload image");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

// Add this event listener to the file input
document
    .getElementById("productImage")
    .addEventListener("change", handleFileSelect);
//document.getElementById('editProductImage').addEventListener('change', handleEditFileSelect);

// Add this function to handle file selection and preview for the edit form
function handleEditFileSelect(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById(
        "editImagePreviewContainer"
    );

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const imgContainer = document.createElement("div");
                imgContainer.className = "image-preview";

                const img = document.createElement("img");
                img.src = e.target.result;
                img.className = "preview-image";

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "x";
                deleteBtn.className = "delete-image";
                deleteBtn.onclick = function () {
                    imgContainer.remove();
                };

                imgContainer.appendChild(img);
                imgContainer.appendChild(deleteBtn);
                previewContainer.appendChild(imgContainer);
            };

            reader.readAsDataURL(file);
        }
    }
}

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
                    loadUsers();
                } else {
                    alert("Failed to delete product");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    }
    // Xử lý sự kiện cập nhật sản phẩm
    if (e.target && e.target.closest(".btn-update")) {
        const row = e.target.closest("tr"); // Lấy hàng chứa nút "Update"
        if (!row) {
            console.error("Không tìm thấy hàng tương ứng.");
            return;
        }

        // Lấy thông tin từ các cột trong hàng
        const productId = row.dataset.productId;
        const name = row.querySelector(".name").textContent.trim();
        const description = document
            .querySelector(".description")
            .textContent.trim();
        const category = row.querySelector(".categoriesId").textContent.trim();
        const brand = row.querySelector(".brand").textContent.trim();
        const price = row.querySelector(".price").id.trim();
        const stock = row.querySelector(".role").textContent.trim();
        const long_description = document
            .querySelector(".long_description")
            .textContent.trim();
        //const imagePath = row.querySelector("img").src;
        const imgElement = row.querySelector("img").src;
        const imagePath =
            imgElement === "http://localhost:3000/products" ? null : imgElement;

        // Điền thông tin vào form dialog
        document.getElementById("editProductId").value = productId;
        document.getElementById("editProductName").value = name;
        document.getElementById("editProductDescription").value = description;
        //document.getElementById("editProductCategory").value = category;
        //document.getElementById("editProductBrand").value = brand;
        document.getElementById("editProductPrice").value = price;
        document.getElementById("editProductStock").value = stock;
        document.getElementById("editProductLongDescription").value =
            long_description;

        //document.getElementById("editProductImage").value = imagePath;

        // So khớp giá trị với các option của category và brand
        const categorySelect = document.getElementById("editProductCategory");
        const brandSelect = document.getElementById("editProductBrand");

        // Tìm và chọn option phù hợp
        Array.from(categorySelect.options).forEach((option) => {
            option.selected = option.textContent.trim() === category;
        });

        Array.from(brandSelect.options).forEach((option) => {
            option.selected = option.textContent.trim() === brand;
        });

        // Clear existing previews
        const previewContainer = document.getElementById(
            "editImagePreviewContainer"
        );
        previewContainer.innerHTML = "";

        // Add preview for the main image
        const mainImgContainer = document.createElement("div");
        mainImgContainer.className = "image-preview";

        console.log(imagePath);

        if (imagePath) {
            const mainImg = document.createElement("img");
            mainImg.src = imagePath;
            mainImg.className = "preview-image";

            const deleteMainBtn = document.createElement("button");
            deleteMainBtn.textContent = "x";
            deleteMainBtn.className = "delete-image";
            deleteMainBtn.onclick = function () {
                mainImgContainer.remove();
            };

            mainImgContainer.appendChild(mainImg);
            mainImgContainer.appendChild(deleteMainBtn);
            previewContainer.appendChild(mainImgContainer);
        }

        // Fetch and display extra images
        try {
            const response = await fetch(`/products/api/${productId}`);
            if (response.ok) {
                const productData = await response.json();
                if (
                    productData.extraImages &&
                    productData.extraImages.length > 0
                ) {
                    productData.extraImages.forEach((imgUrl) => {
                        const imgContainer = document.createElement("div");
                        imgContainer.className = "image-preview";

                        const img = document.createElement("img");
                        img.src = imgUrl;
                        img.className = "preview-image";

                        const deleteBtn = document.createElement("button");
                        deleteBtn.textContent = "x";
                        deleteBtn.className = "delete-image";
                        deleteBtn.onclick = function () {
                            imgContainer.remove();
                        };

                        imgContainer.appendChild(img);
                        imgContainer.appendChild(deleteBtn);
                        previewContainer.appendChild(imgContainer);
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching extra images:", error);
        }

        // Hiển thị dialog
        document.getElementById("updateProductDialog").style.display = "flex";
    }
});

// Xử lý sự kiện cập nhật sản phẩm
document.getElementById("updateProductForm").onsubmit = async function (e) {
    e.preventDefault(); // Ngăn reload trang

    const formData = new FormData(document.getElementById("updateProductForm"));

    // Thu thập thông tin từ form
    const productData = {
        name: document.getElementById("editProductName").value,
        description: document.getElementById("editProductDescription").value,
        price: parseFloat(document.getElementById("editProductPrice").value),
        category: document.getElementById("editProductCategory").value,
        brand: document.getElementById("editProductBrand").value,
        stock: parseInt(document.getElementById("editProductStock").value),
        long_description: document.getElementById("editProductLongDescription")
            .value,
        //imagePath: document.getElementById("editProductImage").value,
    };

    // Kiểm tra điều kiện price và stock phải là số
    if (isNaN(productData.price) || productData.price <= 0) {
        alert("Price must be a valid number greater than 0.");
        return; // Ngừng thực hiện nếu giá không hợp lệ
    }

    if (isNaN(productData.stock) || productData.stock < 0) {
        alert("Stock must be a valid non-negative number.");
        return; // Ngừng thực hiện nếu số lượng không hợp lệ
    }

    const productId = document.getElementById("editProductId").value;

    // Collect all remaining image URLs
    const imageElements = document.querySelectorAll(
        "#editImagePreviewContainer .preview-image"
    );
    const imageUrls = Array.from(imageElements).map((img) => img.src);

    console.log(imageUrls);

    if (imageUrls.length > 0) {
        console.log("Setting image path");
        productData.imagePath = imageUrls[0]; // First image is the main image
        productData.extraImages = imageUrls.slice(1); // Rest are extra images
    } else {
        // Handle case where all images are deleted
        productData.imagePath = "";
        productData.extraImages = [];
    }

    console.log(productData);

    try {
        const uploadResponse = await fetch("/products/upload-img", {
            method: "POST",
            body: formData,
        });

        if (uploadResponse.ok) {
            const data = await uploadResponse.json();

            const imageUrls = data.imageUrls;

            //them tat ca imageUrls vao productData.extraImages
            productData.extraImages = productData.extraImages.concat(imageUrls);

            document.getElementById("editProductImage").value = "";
        } else {
            //alert("Failed to upload image");
        }

        // Gửi dữ liệu đến server qua API
        const response = await fetch(`/products/api/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
        });

        if (response.ok) {
            const updatedProduct = await response.json();

            // Cập nhật thông tin sản phẩm trong bảng hiển thị
            const row = document.querySelector(
                `tr[data-product-id="${productId}"]`
            );

            const categoryName = updatedProduct.categoriesId
                ? updatedProduct.categoriesId.name
                : "Unknown";

            const brandName = updatedProduct.brandsId
                ? updatedProduct.brandsId.name
                : "Unknown";

            const date = new Date(updatedProduct.createdAt);

            const formattedDate = `${date
                .getDate()
                .toString()
                .padStart(2, "0")} - ${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")} - ${date.getFullYear()}`;

            row.innerHTML = `
                <td><img src="${updatedProduct.imagePath}" alt="" class="avatar" /></td>
                <td><p class="name">${updatedProduct.name}</p></td>
                <p class="description" style="display: none">
                    ${updatedProduct.description}
                </p>
                <td><p class="categories
                Id">${categoryName}</p></td>
                <td><p class="brand">${brandName}</p></td>
                <td><p class="price">${updatedProduct.price}</p></td>
                <td><p class="creation-date">${formattedDate}</p></td>
                <td><p class="role">${updatedProduct.stock}</p></td>
                <p class="long_description" style="display: none">
                    ${updatedProduct.long_description}
                </p>

                <td>
                    <button class="btn btn-update">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            loadUsers();
            // Đóng dialog
            document.getElementById("updateProductDialog").style.display =
                "none";
        } else {
            alert("Failed to update product");
        }
    } catch (error) {
        console.error("Error updating product:", error);
    }
};

// Cập nhật hàm addProductToTable để bao gồm data-product-id
function addProductToTable(product) {
    const usersTable = document.querySelector(".table tbody");

    const categoryName = product.categoriesId
        ? product.categoriesId.name
        : "Unknown";
    const brandName = product.brandsId ? product.brandsId.name : "Unknown";

    const date = new Date(product.createdAt);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")} - 
                           ${(date.getMonth() + 1)
                               .toString()
                               .padStart(2, "0")} - 
                           ${date.getFullYear()}`;

    const row = `
        <tr data-product-id="${product._id}">
            <td><img src="${product.imagePath}" alt="" class="avatar" /></td>
            <td><p class="name">${product.name}</p></td>
            <p class="description" style="display: none">
                ${product.description}
            </p>
            <td><p class="categoriesId">${categoryName}</p></td>
            <td><p class="brand">${brandName}</p></td>
            <td><p class="price">${product.price}</p></td>
            <td><p class="creation-date">${formattedDate}</p></td>
            <td><p class="role">${product.stock}</p></td>
            <p class="long_description" style="display: none">
                ${product.long_description}
            </p>
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
    loadUsers();
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
    filter = currentFilter,
    category = currentCategory,
    brand = currentBrand
) {
    try {
        currentPage = page;
        currentLimit = limit;
        currentSortBy = sortBy;
        currentOrder = order;
        currentSearch = search;
        currentFilter = filter;
        currentCategory = category;
        currentBrand = brand;

        const queryParameters = new URLSearchParams({
            page,
            limit,
            sortBy,
            order,
            search,
            filter,
            category,
            brand,
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
            const categoryName = product.categoriesId
                ? product.categoriesId.name
                : "Unknown";

            const brandName = product.brandsId
                ? product.brandsId.name
                : "Unknown";

            const date = new Date(product.createdAt);

            const formattedDate = `${date
                .getDate()
                .toString()
                .padStart(2, "0")} - ${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")} - ${date.getFullYear()}`;

            const rawPrice = parseFloat(product.price);
            const formattedPrice = (() => {
                const number = parseFloat(product.price);
                if (isNaN(number)) return "Rp 0"; // Xử lý nếu `product.price` không phải là số hợp lệ
                return (
                    "Rp " +
                    number.toLocaleString("id-ID", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    })
                );
            })();

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

                        <p class="description" style="display: none">
                            ${product.description}
                        </p>

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
                            <p class="price" id=${product.price}>
                                ${formattedPrice}
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

                        <p class="long_description" style="display: none">
                            ${product.long_description}
                        </p>

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
