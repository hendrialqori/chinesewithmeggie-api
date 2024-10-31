export function exportToCSV<T extends {}>(data: T[]) {
    // Extract headers from the first object
    const headers = Object.keys(data[0]);
    // Generate csv rows 
    const csvRows = data.map(row =>
        headers.map(field => JSON.stringify(row[field] || '')).join(',')
    );

    // Join headers and rows
    return [headers.join(','), ...csvRows].join('\n');

}