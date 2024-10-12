const PrintDataGrid = (elementName) => {
  var originalTable = document.getElementById(`${elementName}`);

  // Create a copy of the original table
  var copiedTable = originalTable.cloneNode(true);

  //console.log('print', originalTable);

  // Iterate through rows in the copied table and remove the ones in the thead section

  // var copiedRows = copiedTable.querySelectorAll("thead, thead *");
  // copiedRows.forEach(function (row) {
  //     row.remove();
  // });

  var copiedRows = copiedTable.querySelectorAll("thead, thead *");
  copiedRows.forEach(function (row) {
    var copiedRow = row.querySelectorAll("input, input *");
    copiedRow.forEach(function (input) {
      input.remove();
    });
  });

  const contentToPrint = copiedTable

  const printWindow = window.open('', '', 'width=600,height=600');

  printWindow.document.open();
  printWindow.document.write('<html><head><title>Print</title></head><body>');
  printWindow.document.write(contentToPrint.outerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
  printWindow.close();

}



export default { PrintDataGrid }
