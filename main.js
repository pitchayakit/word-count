const fs = require('fs');
const csv = require('csv-parser'); 

let fields = ['word','count','file']
let newLine= "\r\n";
fs.writeFile('output.csv', fields+newLine, function (err) {
  if (err) throw err;
  console.log('file write');
});

fs.createReadStream('sample.csv')  
  .pipe(csv())
  .on('data', (row) => {
    let dir = 'txt'
    let files = fs.readdirSync(dir);
    let word = row.word
    let regex = new RegExp("\\b("+ word + ")\\b","g");
    let count = 0;

    files.forEach(file => {
        data = fs.readFileSync(dir+'/'+file, 'utf8');
        count += (data.match(regex) || []).length;
        //let csv_data = {word: row.word,count: count,file: file}
        let csv_data = row.word + ',' + count + ',' + file
        fs.appendFile('output.csv', csv_data + newLine, function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file! : ' + csv_data);
        });
    })
    console.log(count)
  })






