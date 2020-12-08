const fs = require("fs");
const path = require("path");

const source = '../data/clean/names/gender'
const dest = '../data/clean/names/objects';
const sourcePath = path.join(__dirname, source);
const destPath = path.join(__dirname, dest);

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
const A = {};
A["years"] = years;
A["names"] = {};
A["names"]["F"] = {};
A["names"]["M"] = {};

const Apath = path.join(destPath, "A");
if (!fs.existsSync(Apath)) {
  fs.mkdirSync(Apath);
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
      if (name.substring(0, 1) == "A") {
        //create array of yearcounts for first occurrence of name
        if (!A["names"][fileGender][name])
          //A["names"][fileGender][name] = new Array(years.length).fill(0);
          A["names"][fileGender][name] = {};

        //find index of year in list of years, and add count to that spot
        //const yearIndex = A["years"].indexOf(fileYear);
        A["names"][fileGender][name][fileYear] = parseInt(yearNames[name]);
      }
    }
  } //exclude .DS_Store processing

});
const femalesPath = path.join(Apath, "A.json");
fs.writeFileSync(femalesPath, JSON.stringify(A["names"]["F"]));


/*
const malesPath = path.join(destPath, filename.replace(".txt", "_M.json"));

fs.writeFileSync(malesPath, JSON.stringify(males));
*/