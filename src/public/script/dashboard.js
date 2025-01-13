google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawCharts);

let yearlySalesContainer;
let orderTimesContainer;
let numberOfOrdersContainer;

document.addEventListener("DOMContentLoaded", () => {
    yearlySalesContainer = document.getElementById("yearly_sales_chart");
    orderTimesContainer = document.getElementById("order_times_chart");
    numberOfOrdersContainer = document.getElementById("number_of_orders_chart");

    document.getElementById("year").addEventListener("change", () => {
        drawYearlySalesChart();
        drawOrderTimesChart();
        drawNumberOfOrdersChart();
    });
    document.getElementById("month").addEventListener("change", drawNumberOfOrdersChart);

    drawCharts();
});

async function drawCharts() {
    await drawYearlySalesChart();
    await drawOrderTimesChart();
    await drawNumberOfOrdersChart();
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