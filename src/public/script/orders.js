function formattedDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function formattedTotal(total) {
    // format total to xxx.xxx.xxx Rp
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(total);
}

async function loadOrders(
    page = 1,
    limit = 1,
    sortBy = "createdAt",
    order = "asc",
    search = "",
    fields = "deliveryUnit,paymentMethod,status"
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

        const res = await fetch(`/orders/api?${queryParameters.toString()}`);

        if (!res.ok) {
            throw new Error("Internal Server Error");
        }

        const data = await res.json();

        const ordersTable = document.querySelector(".table tbody");
        ordersTable.innerHTML = "";

        for(let i = 0; i < data.data.length; i++) {
            const order = data.data[i];
            const user = await fetch(`/users/api/${order.userId}`);
            const userData = await user.json();
            data.data[i].user = userData;
        }

        data.data.forEach((order) => {
            const row = `
                <tr>
                    <td><p class="user-id">${order.user.email}</p></td>
                    <td><p class="creation-date">${formattedDate(order.createdAt)}</p></td>
                    <td><p class="status">${order.status}</p></td>
                    <td><p class="total">${formattedTotal(order.total)}</p></td>
                    <td><p class="delivery-unit">${order.deliveryUnit}</p></td>
                    <td><p class="payment-method">${order.paymentMethod}</p></td>
                    <td><a href="/orders/${order._id}" class="btn btn-primary">View</a></td>
                </tr>
            `;

            ordersTable.insertAdjacentHTML("beforeend", row);
        });

        updatePagination(data.page, data.totalPages);
    } catch (error) {
        console.error("Error loading orders:", error);
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
        previousButton.onclick = () => loadOrders(currentPage - 1);
    } else {
        previousButton.classList.add("disabled");
        previousButton.onclick = null;
    }

    if (currentPage < totalPages) {
        nextButton.classList.remove("disabled");
        nextButton.onclick = () => loadOrders(currentPage + 1);
    } else {
        nextButton.classList.add("disabled");
        nextButton.onclick = null;
    }
}

loadOrders();
