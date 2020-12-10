const path = require('path');
const fs = require('fs');

const source = '../../../data/clean/density/states'
const dest = '../../../data/clean/density';
const sourcePath = path.join(__dirname, source);
const destPath = path.join(__dirname, dest);

let objectInfo = {};
objectInfo["F"] = {};
objectInfo["M"] = {};
let allYears = [];

const files = fs.readdirSync(sourcePath);
files.forEach(function(file) {
  if (file != ".DS_Store") {
    const filePath = path.join(sourcePath, file);
    const destFileName = file;
    const state = file.replace(".json", "");
    objectInfo["F"][state] = {};
    objectInfo["M"][state] = {};

    const fileObject = JSON.parse(fs.readFileSync(filePath, "utf8"));
    for (key in fileObject) {
      if (!allYears.includes(key)) allYears.push(key)
      objectInfo["F"][state][key] = {};
      objectInfo["M"][state][key] = {};
      objectInfo["F"][state][key]["fDensity"] = fileObject[key]["fDensity"];
      objectInfo["F"][state][key]["fCount"] = fileObject[key]["fCount"];
      objectInfo["F"][state][key]["fNameCount"] = fileObject[key]["F"].length;
      objectInfo["M"][state][key]["mDensity"] = fileObject[key]["mDensity"];
      objectInfo["M"][state][key]["mCount"] = fileObject[key]["mCount"];
      objectInfo["M"][state][key]["mNameCount"] = fileObject[key]["M"].length;
    }
  }
});

let femalesPath = path.join(destPath, "allStates_F.json");
fs.writeFileSync(femalesPath, JSON.stringify(objectInfo["F"]));
let malesPath = path.join(destPath, "allStates_M.json");
fs.writeFileSync(malesPath, JSON.stringify(objectInfo["M"]));

let maleInfo = ",";
let femaleInfo = ",";
for (year of allYears) {
  maleInfo += year + ", ";
  femaleInfo += year + ", "
}
maleInfo += year + "\n";
femaleInfo += year + "\n"

for (state in objectInfo["F"]) {
  maleInfo += state + ", ";
  femaleInfo += state + ", "
  for (year of allYears) {
    femaleInfo += objectInfo["F"][state][year]["fDensity"] + ", ";
    maleInfo += objectInfo["M"][state][year]["mDensity"] + ", ";
  }
  maleInfo += "\n";
  femaleInfo += "\n"
}

femalesPath = path.join(destPath, "allStates_F_density.csv");
fs.writeFileSync(femalesPath, femaleInfo);
malesPath = path.join(destPath, "allStates_M_density.csv");
fs.writeFileSync(malesPath, maleInfo);