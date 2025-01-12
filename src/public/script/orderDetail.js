async function loadOrderDetail(
    page = 1,
    limit = 1,
    sortBy = "createdAt",
    order = "asc",
    search = "",
    fields = "orderId"
) {
    try {
        const orderId = window.location.pathname.split("/").pop();
        const queryParameters = new URLSearchParams({
            page,
            limit,
            sortBy,
            order,
            search: orderId,
            fields,
        });

        const res = await fetch(`/orders/api/orderDetails/${orderId}?${queryParameters.toString()}`);

        if (!res.ok) {
            throw new Error("Internal Server Error");
        }

        const data = await res.json();

        const orderDetailTable = document.querySelector(".table tbody");
        orderDetailTable.innerHTML = "";

        data.data.forEach((orderDetail) => {
            const row = `
                <tr>
                    <td><img
                            src="${orderDetail.product.imagePath}"
                            alt=""
                            class="avatar"
                        /></td>
 
                        <td><p class="name">${orderDetail.product.name}</p></td>

                        <td><p class="price">${orderDetail.product.price}</p></td>

                        <td><p
                                class="quantity"
                            >${orderDetail.quantity}</p></td>
                </tr>
            `;

            orderDetailTable.insertAdjacentHTML("beforeend", row);
        });

        updatePagination(data.page, data.totalPages);
    } catch (error) {
        console.error("Error loading order details:", error);
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
        previousButton.onclick = () => loadOrderDetail(currentPage - 1);
    } else {
        previousButton.classList.add("disabled");
        previousButton.onclick = null;
    }

    if (currentPage < totalPages) {
        nextButton.classList.remove("disabled");
        nextButton.onclick = () => loadOrderDetail(currentPage + 1);
    } else {
        nextButton.classList.add("disabled");
        nextButton.onclick = null;
    }
}

loadOrderDetail();
