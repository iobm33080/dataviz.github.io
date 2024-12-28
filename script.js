document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally
    const file = document.getElementById('file-input').files[0]; // Get the file

    if (file) {
        // Check file type
        const fileType = file.type;
        if (fileType === "text/csv") {
            // Parse CSV file
            parseCSV(file);
        } else if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || fileType === "application/vnd.ms-excel") {
            // Parse Excel file
            parseExcel(file);
        } else {
            alert("Please upload a CSV or Excel file.");
        }
    }
});

// Parse CSV using PapaParse
function parseCSV(file) {
    Papa.parse(file, {
        complete: function(results) {
            console.log("CSV Data Parsed: ", results);
            generateVisualization(results.data); // Pass parsed data to generate visualization
        },
        header: true // Assuming the first row is a header
    });
}

// Parse Excel using SheetJS
function parseExcel(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log("Excel Data Parsed: ", jsonData);
        generateVisualization(jsonData); // Pass parsed data to generate visualization
    };
    reader.readAsBinaryString(file);
}

// Function to generate visualization using Chart.js
function generateVisualization(data) {
    // For this example, we'll assume the data has a "ColumnName" and "ValueColumn"
    const labels = data.map(row => row['ColumnName']); // Replace with actual column name
    const values = data.map(row => row['ValueColumn']); // Replace with actual column name

    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Dataset Label',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
