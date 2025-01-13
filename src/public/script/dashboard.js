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

    document.getElementById("startDate").addEventListener("change", () => {
        drawYearlySalesChart();
        drawOrderTimesChart();
        drawNumberOfOrdersChart();
        drawRevenueChart();
        drawTopRevenueProductsChart();
    });
    
    document.getElementById("endDate").addEventListener("change", () => {
        drawYearlySalesChart();
        drawOrderTimesChart();
        drawNumberOfOrdersChart();
        drawRevenueChart();
        drawTopRevenueProductsChart();
    });

    drawCharts();
});

async function drawCharts() {
    await drawYearlySalesChart();
    await drawOrderTimesChart();
    await drawNumberOfOrdersChart();
    await drawRevenueChart();
    await drawTopRevenueProductsChart();
}

async function getYearlySales(startDate, endDate) {
    const response = await fetch(`/orders/api/yearlySales?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();
    return data;
}

async function drawYearlySalesChart() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    const salesData = await getYearlySales(startDate, endDate);

    // Check if there is no data
    if (salesData.length === 0) {
        yearlySalesContainer.innerHTML = "<p>No data available for the selected period.</p>";
        return;
    }

    // Format the data for Google Charts
    const dataArray = [['Month', 'Sales']];
    salesData.forEach(sale => {
        dataArray.push([`Month ${sale._id.month}/${sale._id.year}`, sale.total]);
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

async function getOrderTimes(startDate, endDate) {
    const response = await fetch(`/orders/api/orderTimes?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();
    return data;
}

async function drawOrderTimesChart() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    const orderTimes = await getOrderTimes(startDate, endDate);

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

async function getNumberOfOrders(startDate, endDate) {
    const response = await fetch(`/orders/api/numberOfOrders?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();
    return data;
}

async function drawNumberOfOrdersChart() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    const numberOfOrders = await getNumberOfOrders(startDate, endDate);

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

async function getRevenue(startDate, endDate) {
    const response = await fetch(`/orders/api/revenue?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();
    return data;
}

async function drawRevenueChart() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    const revenue = await getRevenue(startDate, endDate);

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

async function getTopRevenueProducts(startDate, endDate) {
    const response = await fetch(`/orders/api/topRevenueProducts?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();
    return data;
}

async function drawTopRevenueProductsChart() {
    // draw bar chart
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    const topProducts = await getTopRevenueProducts(startDate, endDate);

    // Check if there is no data
    if (topProducts.length === 0) {
        topProductsContainer.innerHTML = "<p>No data available for the selected period.</p>";
        return;
    }

    // Format the data for Google Charts
    const dataArray = [['Product', 'Quantity']];    
    topProducts.forEach(product => {
        dataArray.push([product.product.name, product.total]);
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