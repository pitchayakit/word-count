const fs = require('fs');
const csv = require('csv-parser'); 
const https = require('https');
const path = require('path');

let fields = ['word','count','file']
let newLine= "\r\n";

fs.writeFile('output/output.csv', fields+newLine, function (err) {
  if (err) throw err;
  console.log('file write');
});

//remove all file in directory
const directory = 'output/url_output';
fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
        });
    }
});

fs.createReadStream('input/word.csv')  
  .pipe(csv())
  .on('data', (row) => {
    let word = row.word
    let regex = new RegExp(word,"gi");
    
    fs.createReadStream('input/url_list.csv')  
        .pipe(csv())
        .on('data', (row) => {
            let url = row.url
            https.get(url, (resp) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
        
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                let count = (data.match(regex) || []).length;
                let csv_data = word + ',' + count + ',' + url;
                let url_name = url.replace(/(^\w+:|^)\/\//, '');
                url_name = url_name.replace(/\//g,'-')
                //console.log(url_name)
                fs.writeFile("output/url_output/"+url_name, data, (err) => {
                    if (err) console.log(err);
                    console.log("Successfully Written to File.");
                });
                fs.appendFile('output/output.csv', csv_data + newLine, function (err) {
                    if (err) throw err;
                    console.log('The "data to append" was appended to file! : ' + csv_data);
                });
            });
        
            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        })
  })

  
  