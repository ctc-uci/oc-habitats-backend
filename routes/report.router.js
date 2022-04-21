const express = require('express');
const fs = require('fs');
const AdmZip = require('adm-zip');
const monitorLogService = require('../services/monitorLog.service');
const segmentService = require('../services/section.segment.service');

const router = express.Router();

const generalHeaders = [
  'Surveyor Name',
  'Survey Segment',
  'Date',
  'Survey Start Time',
  'Survey End Time',
  'Temperature (F)',
  'Cloud Cover (%)',
  'Precipitation',
  'Wind (Speed/Direction)',
  'Tides(ft)',
  'Overall Habitat Type',
  'Habitat Width (ft)',
  'Partners',
];

const listedAnimalHeaders = [
  'Map #',
  'Adults',
  'Fledges',
  'Chicks',
  'Time',
  'Habitat Description',
  'GPS',
  'Cross Street/Towers',
  '# of Male Adults',
  '# of Male Fledges',
  '# of Male Chicks',
  '# of Female Adults',
  '# of Female Fledges',
  '# of Female Chicks',
  'Nest & Eggs',
  'Behaviors Observed',
  'Banding Code',
  'Additional Notes',
];

const nonListedHeaders = ['Species', 'Total', 'Notes'];

const predatorHeaders = [
  'Corvid: American Crow',
  'Corvid: Common Rave',
  'Raptors',
  'Horse',
  'Coyote',
  'Fox',
  'Cat',
  'Other Predator(s)',
];

const humanHeaders = [
  'Beach Activity',
  'Water Activity',
  'Airborne Activity',
  '[Speeding] Motorized Vehicles',
  '[Non-Speeding] Motorized Vehicles',
  '[Off Leash] Domestic Animals',
  '[On Leash] Domestic Animals',
  'Outreach',
  'Other Notes',
];

const disclaimer =
  'OC Habtiats strives to survey as many of the segments as possible each month. Some segments may not have been surveyed due to volunteer cancellation (due to illness, weather, or some other reason). Some segments are regularly not getting surveyed due to access issues (parking or land structures).  Some segments get more attention than others since we are aware the SNPL use these segments more often or there are issues with these segments that need more regular attention. ';

const reportsDirectory = `${__dirname}\\..\\reports`;
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// const convertToPascal = (text) => {
//   return text.replace(/((?<!^)[A-Z](?![A-Z]))(?=\S)/g, ' $1').replace(/^./, (s) => s.toUpperCase());
// };

const joinValues = (valuesList) => {
  let row = '';
  // let size;
  // if (Array.isArray(valuesList)) {
  //   valuesList.forEach((value) => {
  //     size = Object.values(value).length;
  //     Object.values(value).forEach((entry, index) => {
  //       if (index === size - 2) row += `${entry}\r\n`;
  //       else if (index !== size - 1) {
  //         row += `${entry},`;
  //       }
  //     });
  //   });
  // } else {
  const size = Object.values(valuesList).length;
  Object.values(valuesList).forEach((entry, index) => {
    if (index === size - 2) row += `${entry}\r\n`;
    else if (index !== size - 1) {
      row += `${entry},`;
    }
  });
  // }

  return row;
};

const joinKeys = (keysList) => {
  let row = '';
  // let size;
  // if (Array.isArray(keysList)) {
  //   keysList.forEach((key) => {
  //     size = Object.keys(key).length;
  //     Object.keys(key).forEach((entry, index) => {
  //       if (index === size - 2) row += `${entry}\r\n`;
  //       else if (index !== size - 1) {
  //         row += `${entry},`;
  //       }
  //     });
  //   });
  // } else {
  const size = Object.keys(keysList).length;
  Object.keys(keysList).forEach((entry, index) => {
    if (index === size - 2) row += `${entry}\r\n`;
    else if (index !== size - 1) {
      row += `${entry},`;
    }
  });
  // }
  return row;
};

const convertToCSV = (submission) => {
  // Append General Information Headers
  let csv = `General Information\r\n${generalHeaders.join(',')}`;
  let additionalString = '';

  // Append Additional General Information Headers
  if (submission.generalAdditionalFieldValues) {
    csv += joinKeys(submission.generalAdditionalFieldValues.toJSON());
    additionalString = joinValues(submission.generalAdditionalFieldValues.toJSON());
  }

  // Format + Append General Information Fields
  csv += `\r\n${submission.submitter}`;
  const gfv = submission.generalFieldValues;
  const wind = `${gfv.windSpeed} ${gfv.windDirection}`;
  delete gfv.windDirection;
  gfv.windSpeed = wind;
  gfv.date = formatDate(gfv.date);
  Object.values(gfv).forEach((field) => {
    csv += `,${field}`;
  });

  // Append Additional General Information Fields + Listed Species Headers
  csv += `,"${submission.sessionPartners.toString()}",${additionalString}\r\n\r\n`;
  additionalString = '';

  // Append Listed Species Title, Header, and Fields
  submission.listedSpeciesEntries.forEach((entry) => {
    csv += `${entry.speciesId}\r\n${listedAnimalHeaders.join(',')}\r\n`;
    const gpsIndex = 6;
    const nestAndEggsIndex = 14;
    const entryValues = Object.values(entry.toJSON());
    for (let i = 0; i < nestAndEggsIndex; i += 1) {
      if (i === gpsIndex) {
        // eslint-disable-next-line no-loop-func
        entryValues[i].forEach((set) => {
          const temp = set;
          // eslint-disable-next-line no-underscore-dangle
          delete temp._id;
          csv += `"${JSON.stringify(temp).replace(/"([^"]+)":/g, '$1:')}"`;
        });
        csv += ',';
      } else {
        csv += `${entryValues[i]},`;
      }
    }
    csv += `"${entry.bandsSexBehavior[0].nestAndEggs}",${entry.bandsSexBehavior[0].bandingCode},${entry.accuracyConfidence},${entry.additionalNotes}`;

    csv += `\r\n\r\nInjured ${entry.speciesId}\r\n${entry.injured}\r\n`;
  });

  // TODO: Additional Spcies Entries?

  // Append Non Listed Species Title, Headers, and Fields
  csv += `\r\nNon-Listed Species\r\n${nonListedHeaders.join(',')}\r\n`;
  submission.nonListedSpeciesEntries.forEach((entries) => {
    entries.species.forEach((specie) => {
      csv += `${specie.name},${specie.total},${specie.additionalNotes}\r\n`;
    });
  });
  csv += `\r\nInjured Terrestrial Wildlife\r\n${submission.nonListedSpeciesEntries[0].injured}\r\n`;

  // Append Predator Title + Headers
  csv += `\r\nPredators\r\n${predatorHeaders.join(',')}`;
  // Append Additional Predator Headers

  if (submission.predatorAdditionalFieldValues) {
    csv += joinKeys(submission.predatorAdditionalFieldValues.toJSON());
    additionalString = joinValues(submission.predatorAdditionalFieldValues.toJSON());
  }
  // Append Predator Fields
  csv += '\r\n';
  csv += joinValues(submission.predatorEntries.toJSON());
  // Append Additional Predator Fields
  csv += additionalString;
  additionalString = '';

  // Append Human Activity Title + Headers
  csv += `\r\nHuman Activity\r\n${humanHeaders.join(',')}`;
  // Append Additional Human Activity Headers
  if (submission.humanActivityAdditionalFieldValues) {
    csv += joinKeys(submission.humanActivityAdditionalFieldValues.toJSON());
    additionalString = joinValues(submission.humanActivityAdditionalFieldValues.toJSON());
  }
  // Append Human Activity Fields
  csv += '\r\n';
  csv += joinValues(submission.humanActivityEntries.toJSON());
  // Append Additional Human Activity Fields
  csv += additionalString;
  additionalString = '';

  csv += '\r\n\r\nSegment Totals\r\n';

  return csv;
};

const getSegmentNames = async () => {
  const segments = await segmentService.getSegNames().then((dict) => {
    return dict.map((segment) => {
      return segment.toJSON().segmentId;
    });
  });
  return segments;
};

const getSegmentRow = async (submissions) => {
  let segmentString = '';
  const segments = await getSegmentNames();
  const segmentDictionary = Object.assign({}, ...segments.map((segment) => ({ [segment]: 0 })));
  submissions.forEach((submission) => {
    if (submission.generalFieldValues.surveySegment in segmentDictionary) {
      segmentDictionary[submission.generalFieldValues.surveySegment] += 1;
    }
  });
  segmentString += joinKeys(segmentDictionary);
  segmentString += joinValues(segmentDictionary);
  return segmentString;
};

const createCSV = (data, i) => {
  try {
    fs.writeFileSync(`${reportsDirectory}\\report${i}.csv`, data, { flag: 'wx' });
  } catch (err) {
    console.log('ERR writing csv', err);
  }
};

router.get('/report', async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    const reports = await monitorLogService.getSubmissionsByDates(startDate, endDate);
    if (!reports) {
      res.status(400).json({ message: `Reports from ${startDate} to  ${endDate} doesn't exist` });
    } else {
      const segStr = await getSegmentRow(reports);
      reports.forEach((report, index) => {
        let csvData = convertToCSV(report, index);
        csvData += `${segStr}\r\n${disclaimer}`;
        createCSV(csvData, index);
      });
      const zip = new AdmZip();
      fs.readdirSync(reportsDirectory).forEach((file) => {
        zip.addLocalFile(`${reportsDirectory}\\${file}`);
      });
      res.writeHead(200, {
        'Content-Disposition': `attachment; filename="report.zip"`,
        'Content-Type': 'application/zip',
      });
      const zipFileContents = zip.toBuffer();
      res.end(zipFileContents);
    }
    //   zip.addLocalFile(`${__dirname}\\..\\reports\\monitorReport0.csv`);
    //   const zipFileContents = zip.toBuffer();
    //   res.writeHead(200, {
    //     'Content-Disposition': `attachment; filename="report.zip"`,
    //     'Content-Type': 'application/zip',
    //   });
    //   res.end(zipFileContents);
    // }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  } finally {
    fs.readdirSync(reportsDirectory).forEach((file) => {
      fs.unlink(`${reportsDirectory}\\${file}`, (err) => {
        if (err) throw err;
      });
    });
  }
});
module.exports = router;
