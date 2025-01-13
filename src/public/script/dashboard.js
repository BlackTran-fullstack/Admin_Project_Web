google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawCharts);

let yearlySalesContainer;
let orderTimesContainer;
let numberOfOrdersContainer;
let revenueContainer;
let topProductsContainer;

document.addEventListener("DOMContentLoaded", () => {
    yearlySalesContainer = document.getElementById("yearly_sales_chart");
    orderTimesContainer = document.getElementById("order_times_chart");
    numberOfOrdersContainer = document.getElementById("number_of_orders_chart");
    revenueContainer = document.getElementById("total_revenue_chart");
    topProductsContainer = document.getElementById("top_products_chart");

    document.getElementById("year").addEventListener("change", () => {
        drawYearlySalesChart();
        drawOrderTimesChart();
        drawNumberOfOrdersChart();
        drawRevenueChart();
        drawTopProductsChart();
    });
    document.getElementById("month").addEventListener("change", () => {
        drawNumberOfOrdersChart();
        drawRevenueChart();
        drawTopProductsChart();
    });
    document.getElementById("day").addEventListener("change", drawTopProductsChart);

    drawCharts();
});

async function drawCharts() {
    await drawYearlySalesChart();
    await drawOrderTimesChart();
    await drawNumberOfOrdersChart();
    await drawRevenueChart();
    await drawTopProductsChart();
}

async function getYearlySales(year) {
    const response = await fetch(`/orders/api/yearly_sales?year=${year}`);
    const data = await response.json();
    return data;
}

async function drawYearlySalesChart() {
    const yearInput = document.getElementById("year");
    const year = yearInput.value;

    const salesData = await getYearlySales(year);

    // Check if there is no data
    if (salesData.length === 0) {
        yearlySalesContainer.innerHTML = "<p>No data available for the selected period.</p>";
        return;
    }

    // Format the data for Google Charts
    const dataArray = [['Month', 'Sales']];
    salesData.forEach(sale => {
        dataArray.push([`Month ${sale._id}`, sale.total]);
    });

    const data = google.visualization.arrayToDataTable(dataArray);

    const options = {
        title: 'Monthly Sales',
        hAxis: { title: 'Month' },
        vAxis: { title: 'Sales' },
        legend: { position: 'none' },
        chartArea: { width: '70%', height: '70%' }
    };

    const chart = new google.visualization.ColumnChart(yearlySalesContainer);
    chart.draw(data, options);
}

async function getOrderTimes(year) {
    const response = await fetch(`/orders/api/orderTimes?year=${year}`);
    const data = await response.json();
    return data;
}

async function drawOrderTimesChart() {
    const yearInput = document.getElementById("year");
    const year = yearInput.value;

    const orderTimes = await getOrderTimes(year);

    // Check if there is no data
    if (orderTimes.length === 0) {
        orderTimesContainer.innerHTML = "<p>No data available for the selected period.</p>";
        return;
    }

    // Format the data for Google Charts
    const dataArray = [['Time', 'Orders']];
    orderTimes.forEach(orderTime => {
        dataArray.push([orderTime._id, orderTime.count]);
    });

    const data = google.visualization.arrayToDataTable(dataArray);

    const options = {
        title: 'Orders by Time of Day',
        chartArea: { width: '70%', height: '70%' },
        legend: { position: 'right' }
    };

    const chart = new google.visualization.PieChart(orderTimesContainer);
    chart.draw(data, options);
}

async function getNumberOfOrders(year, month) {
    const response = await fetch(`/orders/api/numberOfOrders?year=${year}&month=${month}`);
    const data = await response.json();
    return data;
}

async function drawNumberOfOrdersChart() {
    const yearInput = document.getElementById("year");
    const monthInput = document.getElementById("month");

    const year = yearInput.value;
    const month = monthInput.value;

    const numberOfOrders = await getNumberOfOrders(year, month);

    // Check if there is no data
    if (numberOfOrders.length === 0) {
        numberOfOrdersContainer.innerHTML = "<p>No data available for the selected period.</p>";
        return;
    }

    // Format the data for Google Charts
    const dataArray = [['Date', 'Orders']];
    numberOfOrders.forEach(order => {
        dataArray.push([order._id, order.count]); // Convert _id to Date object
    });

    const data = google.visualization.arrayToDataTable(dataArray);

    const options = {
        title: 'Number of Orders',
        hAxis: { title: 'Date' },
        vAxis: { title: 'Orders' },
        legend: { position: 'none' },
        chartArea: { width: '70%', height: '70%' }
    };

    const chart = new google.visualization.LineChart(numberOfOrdersContainer);
    chart.draw(data, options);
}

async function getRevenue(month, year) {
    const response = await fetch(`/orders/api/revenue?month=${month}&year=${year}`);
    const data = await response.json();
    return data;
}

async function drawRevenueChart() {
    const monthInput = document.getElementById("month");
    const yearInput = document.getElementById("year");

    const month = monthInput.value;
    const year = yearInput.value;

    const revenue = await getRevenue(month, year);

    // Check if there is no data
    if (revenue.length === 0) {
        revenueContainer.innerHTML = "<p>No data available for the selected period.</p>";
        return;
    }

    // Format the data for Google Charts
    const dataArray = [['Date', 'Revenue']];
    revenue.forEach(rev => {
        dataArray.push([rev._id, rev.total]);
    });

    const data = google.visualization.arrayToDataTable(dataArray);

    const options = {
        title: 'Revenue',
        hAxis: { title: 'Date' },
        vAxis: { title: 'Revenue' },
        legend: { position: 'none' },
        chartArea: { width: '70%', height: '70%' }
    };

    const chart = new google.visualization.LineChart(revenueContainer);
    chart.draw(data, options);
}

async function getTopProducts(day, month, year) {
    const response = await fetch(`/orders/api/topProducts?day=${day}&month=${month}&year=${year}`);
    const data = await response.json();
    return data;
}

async function drawTopProductsChart() {
    // draw bar chart
    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    const topProducts = await getTopProducts(day, month, year);

    console.log("topProducts", topProducts);

    // Check if there is no data
    if (topProducts.length === 0) {
        topProductsContainer.innerHTML = "<p>No data available for the selected period.</p>";
        return;
    }

    // Format the data for Google Charts
    const dataArray = [['Product', 'Quantity']];    
    topProducts.forEach(product => {
        dataArray.push([product.product.name, product.count]);
    });

    const data = google.visualization.arrayToDataTable(dataArray);

    const options = {
        title: 'Top Products',
        hAxis: { title: 'Product' },
        vAxis: { title: 'Quantity' },
        legend: { position: 'none' },
        chartArea: { width: '70%', height: '70%' }
    };

    const chart = new google.visualization.BarChart(topProductsContainer);
    chart.draw(data, options);
}