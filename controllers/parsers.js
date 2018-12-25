const fs = require('fs');
const es = require('event-stream');
const validator = require("email-validator");
const os = require('os');

const path = require('path');
let  totalLines = 0;
let  totalWithEmailLines = 0;
let to;
let destinyArray=[];

let from = path.join(__dirname, '../data/in/try.csv');
to = path.join(__dirname, '../data/out/tryout.csv');

let readOpts = {
  highWaterMark: Math.pow(2, 16)
};
let writeOpts = {
  highWaterMark: Math.pow(2, 16)
};

fs.closeSync(fs.openSync(to, 'w'));

destinyArray.push(fs.createWriteStream(to, writeOpts));
let source = fs.createReadStream(from, readOpts);

const  workAbout = (line) => {
  // get all emails
  let lineArray = line.split(',');
  let email = lineArray[8];
  let companyName = lineArray[1];
  //console.log(totalWithEmailLines);
  if (email && validator.validate(email)) {
    console.log(++totalWithEmailLines);
    console.log(`${email},${companyName}`);
    if (totalWithEmailLines % 700 === 0) {
      to = path.join(__dirname, `../data/out/tryout${totalWithEmailLines}.csv`);
      fs.closeSync(fs.openSync(to, 'w'));
      destinyArray.push(fs.createWriteStream(to, writeOpts));
    }
    return `${totalWithEmailLines},${email},${companyName}${os.EOL}`;
  }
};


const doParserWork = () => {
  source
    .pipe(es.split())
    .pipe(es.mapSync(workAbout))
    .pipe(destinyArray[0])
    .on('error', (err) => {
      console.error(err);
    })
    .on('end', () => {
      console.log('end of the file')
    });
 };



module.exports = {
  doParserWork
 };
