"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chart_js_1 = require("chart.js");
chart_js_1.Chart.register(...chart_js_1.registerables);
const ctx = document.getElementById('productionChart');
console.log(ctx);
const myChart = new chart_js_1.Chart(ctx, {
    type: 'line',
    data: {
        labels: productionData.map(data => data.date),
        datasets: [{
                label: '# produksi',
                data: productionData.map(data => data.amount),
                borderWidth: 1
            }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            },
            x: {
                ticks: {
                    maxTicksLimit: 8
                }
            }
        }
    }
});
