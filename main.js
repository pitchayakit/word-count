const fs = require('fs');
const csv = require('csv-parser'); 
const createCsvWriter = require('csv-writer').createObjectCsvWriter; 

const csvWriter = createCsvWriter({  
  path: 'output.csv',
  header: [
  {id: 'word', title: 'Word'},
  {id: 'count', title: 'Count'},
  {id: 'file', title: 'File'},
  ]
});

let csv_data_object=[]
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
        let csv_data = {word: row.word,count: count,file: file}
        csv_data_object.push(csv_data);
    })
    console.log(count)
  })
  .on('end',()=> {
    console.log(csv_data_object)
    csvWriter.writeRecords(csv_data_object)
      .then(()=> console.log('The CSV file was written successfully'));
  })






