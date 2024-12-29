let data = null;  // Store the loaded data
let chart = null; // Store the chart instance

// Handle file input and parse the file data (Excel or CSV)
function handleFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please upload a file!');
        return;
    }

    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop().toLowerCase();

    reader.onload = function(event) {
        const fileData = event.target.result;

        if (fileExtension === 'csv') {
            // Parse CSV file using PapaParse
            Papa.parse(fileData, {
                header: true,
                dynamicTyping: true,
                complete: function(results) {
                    data = results.data;
                    displayColumns();
                }
            });
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            // Parse Excel file using XLSX library
            const workbook = XLSX.read(fileData, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            displayColumns();
        } else {
            alert('Unsupported file format. Please upload a CSV or Excel file.');
        }
    };

    reader.readAsBinaryString(file);
}

// Display available columns to choose from for visualization
function displayColumns() {
    if (!data) return;

    const columnsDiv = document.getElementById('attributes');
    columnsDiv.innerHTML = '';  // Clear existing columns

    const headers = data[0];

    const columnSelect1 = document.createElement('select');
    const columnSelect2 = document.createElement('select');
    columnSelect1.id = 'column-select-1';
    columnSelect2.id = 'column-select-2';

    headers.forEach((header, index) => {
        const option1 = document.createElement('option');
        option1.value = index;
        option1.innerText = header;
        columnSelect1.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = index;
        option2.innerText = header;
        columnSelect2.appendChild(option2);
    });

    columnsDiv.appendChild(columnSelect1);
    columnsDiv.appendChild(columnSelect2);
}

// Generate the chart based on selected columns
function generateChart() {
    const columnSelect1 = document.getElementById('column-select-1');
    const columnSelect2 = document.getElementById('column-select-2');
    const xColumnIndex = columnSelect1.value;
    const yColumnIndex = columnSelect2.value;

    if (data.length < 2 || xColumnIndex == null || yColumnIndex == null) {
        alert('Please select valid columns.');
        return;
    }

    const xValues = data.slice(1).map(row => row[xColumnIndex]);
    const yValues = data.slice(1).map(row => row[yColumnIndex]);

    const chartType = 'line';  // Default to line chart, can be extended for multiple chart types

    const barColor = document.getElementById('bar-color').value;
    const lineColor = document.getElementById('line-color').value;

    const chartData = {
        labels: xValues,
        datasets: [{
            label: 'Data Visualization',
            data: yValues,
            backgroundColor: chartType === 'bar' ? barColor : 'transparent',
            borderColor: chartType === 'line' ? lineColor : barColor,
            borderWidth: 2,
            fill: chartType === 'line' ? false : true,
        }]
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    if (chart) {
        chart.destroy();  // Destroy previous chart if exists
    }

    chart = new Chart(document.getElementById('myChart'), {
        type: chartType,
        data: chartData,
        options: chartOptions
    });

    // Enable export functionality
    enableExport();
}

// Enable exporting chart as PNG
function enableExport() {
    document.getElementById('download-btn').addEventListener('click', function() {
        const chartImage = chart.toBase64Image();
        const link = document.createElement('a');
        link.href = chartImage;
        link.download = 'chart.png';
        link.click();
    });
}

// Toggle between Dark and Light mode
function toggleMode() {
    document.body.classList.toggle('light-mode');
    document.querySelector('header').classList.toggle('light-mode');
    document.querySelector('footer').classList.toggle('light-mode');
}
