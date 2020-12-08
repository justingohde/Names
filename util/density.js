//requiring path and fs modules
const path = require('path');
const fs = require('fs');

const source = '../data/original/namesbystate'
const dest = '../data/clean/density';
const sourcePath = path.join(__dirname, source);
const destPath = path.join(__dirname, dest);

const files = fs.readdirSync(sourcePath);

files.forEach(function(file) {

  if (file != ".DS_Store") {


    const filePath = path.join(sourcePath, file);
    const destFileName = file;

    const contents = fs.readFileSync(filePath, "utf8");

    let densityInfo = {};
    densityInfo["allTime"] = {};
    densityInfo["allTime"]["F"] = [];
    densityInfo["allTime"]["M"] = [];
    densityInfo["allTime"]["mCount"] = 0;
    densityInfo["allTime"]["fCount"] = 0;

    const contentsArray = contents.split("\r\n");

    contentsArray.forEach(function(line) {
      if (line.length > 0) {
        const data = line.split(",");

        const gender = data[1].trim();
        const year = data[2].trim();
        const name = data[3].trim();
        const count = parseInt(data[4].trim());

        if (!densityInfo[year]) {
          densityInfo[year] = {};
          densityInfo[year]["F"] = [];
          densityInfo[year]["M"] = [];
          densityInfo[year]["totalCount"] = 0;
          densityInfo[year]["fCount"] = 0;
          densityInfo[year]["mCount"] = 0;
        }
        if (gender == "F") {
          densityInfo[year]["fCount"] += count;
          if (!densityInfo["allTime"]["F"].includes(name)) {
            densityInfo["allTime"]["F"].push(name);
            densityInfo["allTime"]["fCount"] += count;
          }
        } else {
          densityInfo[year]["mCount"] += count;
          if (!densityInfo["allTime"]["M"].includes(name)) {
            densityInfo["allTime"]["M"].push(name);
            densityInfo["allTime"]["mCount"] += count;

          }
        }
        densityInfo[year][gender].push(name);
        densityInfo[year]["totalCount"] += count;
      }
    });

    for (year in densityInfo) {
      densityInfo[year]["fDensity"] = densityInfo[year]["F"].length / densityInfo[year]["fCount"];
      densityInfo[year]["mDensity"] = densityInfo[year]["M"].length / densityInfo[year]["mCount"];
    }

    const statePath = path.join(destPath, destFileName.replace(".TXT", ".json"));
    fs.writeFileSync(statePath, JSON.stringify(densityInfo));

  }
});