let jsonData = [];

// Handle the file upload and parsing
function handleFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload a file.");
        return;
    }

    const fileType = file.type;

    // Check if the file is an Excel file
    if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
        fileType === "application/vnd.ms-excel" || 
        fileType === "application/vnd.ms-office") {
        // Read Excel file (xlsx, xls)
        readExcel(file);
    } 
    // Check if the file is a CSV file
    else if (fileType === "text/csv") {
        // Read CSV file
        readCSV(file);
    } 
    else {
        alert("Please upload a valid Excel or CSV file.");
    }
}

// Function to read Excel file
function readExcel(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON format
        jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log("Excel Data:", jsonData);

        // Display the available columns for visualization
        displayAttributes(jsonData);
    };

    reader.readAsBinaryString(file);
}

// Function to read CSV file
function readCSV(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = e.target.result;

        // Parse CSV data using PapaParse
        const parsedData = Papa.parse(data, {
            header: true,  // Use the first row as column names
            skipEmptyLines: true
        });

        jsonData = parsedData.data;
        console.log("CSV Data:", jsonData);

        // Display the available columns for visualization
        displayAttributes(jsonData);
    };

    reader.readAsText(file);
}

// Display the available columns (attributes) for visualization
function displayAttributes(data) {
    const attributesDiv = document.getElementById('attributes');
    attributesDiv.innerHTML = '';

    const columns = Object.keys(data[0]);
    columns.forEach(col => {
        const label = document.createElement('label');
        label.innerText = col;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = col;
        checkbox.value = col;

        const div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(checkbox);
        attributesDiv.appendChild(div);
    });
}

// Generate the chart based on selected attributes
function generateChart() {
    const selectedColumns = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    checkboxes.forEach(checkbox => {
        selectedColumns.push(checkbox.value);
    });

    if (selectedColumns.length < 2) {
        alert("Please select at least two columns to visualize.");
        return;
    }

    const labels = jsonData.map(item => item[selectedColumns[0]]);
    const dataValues = jsonData.map(item => item[selectedColumns[1]]);

    const ctx = document.getElementById('myChart').getContext('2d');
    const chartData = {
        labels: labels,
        datasets: [{
            label: `${selectedColumns[0]} vs ${selectedColumns[1]}`,
            data: dataValues,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
        }]
    };

    const config = {
        type: 'line',  // Change this to 'bar' or 'pie' for different types of charts
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${selectedColumns[0]}: ${tooltipItem.label}, ${selectedColumns[1]}: ${tooltipItem.raw}`;
                        }
                    }
                }
            }
        }
    };

    // Create the chart
    new Chart(ctx, config);
}
