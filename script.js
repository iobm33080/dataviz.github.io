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

        // Log all sheet names
        console.log("Sheet Names: ", workbook.SheetNames);

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON format
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log("Excel Data:", jsonData);

        // Display the data in a readable format
        document.getElementById('output').textContent = JSON.stringify(jsonData, null, 2);
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

        console.log("CSV Data:", parsedData.data);

        // Display the data in a readable format
        document.getElementById('output').textContent = JSON.stringify(parsedData.data, null, 2);
    };

    reader.readAsText(file);
}
