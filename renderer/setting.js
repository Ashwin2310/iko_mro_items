const { dialog } = require('electron').remote

document.getElementById("update-manu").addEventListener("click", updateManuf);
document.getElementById("update-abbr").addEventListener("click", updateAbbre);
document.getElementById("export-all").addEventListener("click", exportTables);
document.getElementById("create-tables").addEventListener("click", createTables);

function updateManuf() {
    let result = update('manufacturer');
}

function updateAbbre() {
    let result = update('abbreviations');
}

function exportTables() {
    // TODO
}

function createTables() {
    const worker = new Worker('./worker.js');
    worker.postMessage(['createDatabase']);
    worker.onmessage = function (e) {
        console.log('message from worker');
        if (e.data[0] === 'result') {
            // showResult(e.data[1]);
        } else {
            console.log('unimplemented worker message');
        }
        console.log(e);
    }
}

function update(updateType) {
    dialog.showOpenDialog([], {
        title: "Select Spreadsheet with ".concat(updateType),
        filters: [
            { name: 'Spreadsheet', extensions: ['xls', 'xlsx', 'xlsm', 'xlsb', 'csv'] },
        ],
        properties: [
            'openFile'
        ]
    }).then(result => {
        if (!result.canceled) {
            console.log(result.filePaths);
            const worker = new Worker('./worker.js');
            worker.postMessage(['update', updateType, result.filePaths[0]]);
            worker.onmessage = function (e) {
                console.log('message from worker');
                if (e.data[0] === 'result') {
                    // showResult(e.data[1]);
                } else {
                    console.log('unimplemented worker message');
                }
                console.log(e);
            }
        } else {
            console.log('file picker cancelled');
        }
    })
}