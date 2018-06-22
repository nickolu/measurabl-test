const htmlTemplate = function(tableRows) {
    return `
<!DOCTYPE html>
<html>
    <head>
    <style>
        td {border: 1px solid #cccccc}
    </style>
    </head>
    <body>
    
        <table>
            <tr><td>User ID</td><td>First Name</td><td>Last Name</td><td>Age</td></tr>
            ${tableRows}
        </table>
    
    </body>
</html>
    `;
};

module.exports = htmlTemplate;