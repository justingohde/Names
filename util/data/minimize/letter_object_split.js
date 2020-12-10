const fs = require("fs");
const path = require("path");

const source = '../data/clean/names/gender'
const dest = '../data/clean/names/objects';
const sourcePath = path.join(__dirname, source);
const destPath = path.join(__dirname, dest);
let fileSizeInBytes_after = 0;

//Create an array of all the years represented in the directory
let years = [];
const fileNames = fs.readdirSync(sourcePath);
fileNames.forEach(function(filename) {
  if (filename != ".DS_Store") {
    const fileInfo = filename.split("_");
    const year = parseInt(fileInfo[0].trim());
    if (!years.includes(year)) years.push(year);
  }
});

//Create an object for each letter of the alphabet
for (let letter = 65; letter < 91; letter++) {
  const firstLetter = {};
  firstLetter["years"] = years;
  firstLetter["names"] = {};
  firstLetter["names"]["F"] = {};
  firstLetter["names"]["M"] = {};

  const objectpath = path.join(destPath, String.fromCharCode(letter));

  if (!fs.existsSync(objectpath)) {
    fs.mkdirSync(objectpath);
  }

  fileNames.forEach(function(filename) {
    if (filename != ".DS_Store") {
      const fileSource = path.join(sourcePath, filename);
      const fileContent = fs.readFileSync(fileSource, 'utf-8');

      //get year and gender from filename
      const fileInfo = filename.split("_");
      const fileYear = parseInt(fileInfo[0].trim());
      const fileGender = fileInfo[1].replace(".json", "");

      //turn file content into a JSON object
      const yearNames = JSON.parse(fileContent);

      for (name in yearNames) {
        if (name.substring(0, 1) == String.fromCharCode(letter)) {
          //create array of yearcounts for first occurrence of name
          if (!firstLetter["names"][fileGender][name])
            //A["names"][fileGender][name] = new Array(years.length).fill(0);
            firstLetter["names"][fileGender][name] = {};

          //find index of year in list of years, and add count to that spot
          //const yearIndex = A["years"].indexOf(fileYear);
          firstLetter["names"][fileGender][name][fileYear] = parseInt(yearNames[name]);
        }
      }
    } //exclude .DS_Store processing

  });
  const femalesPath = path.join(objectpath, String.fromCharCode(letter) + "_F.json");
  fs.writeFileSync(femalesPath, JSON.stringify(firstLetter["names"]["F"]));
  const malesPath = path.join(objectpath, String.fromCharCode(letter) + "_M.json");
  fs.writeFileSync(malesPath, JSON.stringify(firstLetter["names"]["M"]));

  fileSizeInBytes_after += fs.statSync(femalesPath).size;
  fileSizeInBytes_after += fs.statSync(malesPath).size;

}

console.log("Total file size after:" + fileSizeInBytes_after / (1024 * 1024) + "Mb");