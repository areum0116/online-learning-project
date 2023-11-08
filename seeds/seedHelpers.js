const fs = require('fs');
const path = require('path');
const FILE_NAME = "Youtube_search_df.csv"

const csvPath = path.join(__dirname, '../..', 'data', FILE_NAME);
const csv = fs.readFileSync(csvPath, "utf-8");

const rows = csv.split('\n');

if (rows[rows.length - 1] === '') {
    // console.log("'' has been found.");
    rows.pop();
}

function splitCSV(str) {
    //split the str first  
    //then merge the elments between two double quotes  
    var delimiter = ',';
    var quotes = '"';
    var elements = str.split(delimiter);
    var newElements = [];
    for (var i = 0; i < elements.length; ++i) {
        if (elements[i].indexOf(quotes) >= 0) {//the left double quotes is found  
            var indexOfRightQuotes = -1;
            var tmp = elements[i];
            //find the right double quotes  
            for (var j = i + 1; j < elements.length; ++j) {
                if (elements[j].indexOf(quotes) >= 0) {
                    indexOfRightQuotes = j;
                    break;
                }
            }
            //found the right double quotes  
            //merge all the elements between double quotes  
            if (-1 != indexOfRightQuotes) {
                for (var j = i + 1; j <= indexOfRightQuotes; ++j) {
                    tmp = tmp + delimiter + elements[j];
                }
                newElements.push(tmp);
                i = indexOfRightQuotes;
            }
            else { //right double quotes is not found  
                newElements.push(elements[i]);
            }
        }
        else {//no left double quotes is found  
            newElements.push(elements[i]);
        }
    }
    return newElements;
}

let results = [];
let columnTitle = [];
for (const i in rows) {
    const row = rows[i];
    const data = splitCSV(row);
    if (i === "0") {
        columnTitle = data;
    }
    else {
        let row_data = {};
        for (const index in columnTitle) {
            const title = columnTitle[index];
            if (index === "1") row_data[title] = data[index].replaceAll('"', '');
            else row_data[title] = data[index];
        }
        results.push(row_data);
    }
}
module.exports.results;

for (result of results) {
    // console.log(JSON.stringify(result, null, '  ').replace("\\r", "") ) 

}