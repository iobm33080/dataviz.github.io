// Handle file input and parse the file data (Excel or CSV)
let data = null;  // Store the loaded data

// Function to handle file input and parse it
function handleFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please upload a file!');
        return;
    }

    const reader = new FileReader();

    // Determine if the file is an Excel or CSV file
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
            data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert to 2D array
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

    // Get the header (first row) for column names (assuming data is in a tabular format)
    const headers = data[0];

    const columnSelect1 = document.createElement('select');
    const columnSelect2 = document.createElement('select');
    columnSelect1.id = 'column-select-1';
    columnSelect2.id = 'column-select-2';

    // Populate the dropdown options with the column names
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

    columnsDiv.appendChild(document.createTextNode('Select X-Axis Column: '));
    columnsDiv.appendChild(columnSelect1);
    columnsDiv.appendChild(document.createElement('br'));

    columnsDiv.appendChild(document.createTextNode('Select Y-Axis Column: '));
    columnsDiv.appendChild(columnSelect2);

    // Create chart type selection dropdown
    const chartTypeSelect = document.createElement('select');
    chartTypeSelect.id = 'chart-type';
    const chartTypes = ['Bar', 'Line', 'Pie'];
    chartTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.toLowerCase();
        option.innerText = type;
        chartTypeSelect.appendChild(option);
    });
    columnsDiv.appendChild(document.createElement('br'));
    columnsDiv.appendChild(document.createTextNode('Select Chart Type: '));
    columnsDiv.appendChild(chartTypeSelect);
}

// Generate chart based on user-selected columns and chart type
function generateChart() {
    if (!data) return;

    const xAxisColumn = document.getElementById('column-select-1').value;
    const yAxisColumn = document.getElementById('column-select-2').value;
    const chartType = document.getElementById('chart-type').value;

    const labels = data.slice(1).map(row => row[xAxisColumn]);
    const values = data.slice(1).map(row => row[yAxisColumn]);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Data Visualization',
            data: values,
            backgroundColor: chartType === 'pie' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }]
    };

    const chartConfig = {
        type: chartType,  // Bar, Line, Pie
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, chartConfig);
}
