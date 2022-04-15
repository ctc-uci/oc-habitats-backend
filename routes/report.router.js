const express = require('express');
const fs = require('fs');
const AdmZip = require('adm-zip');
const monitorLogService = require('../services/monitorLog.service');

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

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// const convertToPascal = (text) => {
//   return text.replace(/((?<!^)[A-Z](?![A-Z]))(?=\S)/g, ' $1').replace(/^./, (s) => s.toUpperCase());
// };

const convertToCSV = (submission) => {
  let csv = `General Information\r\n${generalHeaders.join(',')}\r\n${submission.submitter}`;
  const gfv = submission.generalFieldValues;
  const wind = `${gfv.windSpeed} ${gfv.windDirection}`;
  delete gfv.windDirection;
  gfv.windSpeed = wind;
  gfv.date = formatDate(gfv.date);
  Object.values(gfv).forEach((field) => {
    csv += `,${field}`;
  });
  csv += `,${submission.sessionPartners.toString()}\r\n\r\n${listedAnimalHeaders.join(',')}\r\n`;
  submission.listedSpeciesEntries.forEach((entry) => {
    csv += `${entry.map},${entry.numAdults},${entry.numFledges},${entry.numChicks},${
      entry.habitatDescription
    },"",${
      entry.crossStreet
    },"","","","","","",${entry.bandsSexBehavior[0].nestAndEggs.toString()},${entry.bandsSexBehavior[0].behaviors.toString()},${
      entry.bandsSexBehavior[0].bandingCode
    },${entry.additionalNotes}\r\n`;
  });
  csv += '\r\nNon-Listed Species\r\n';
  csv += `${nonListedHeaders.join(',')}\r\n`;

  // TODO: Insert Non-Listed Species

  csv += '\r\nInjured Terrestrial Wildlife\r\n';
  csv += '\r\nPredators\r\n';

  // TODO: Insert Predators

  csv += '\r\nHuman Activity\r\n';
  csv += `${humanHeaders.join(',')}\r\n`;
  // TODO: Human Activity Data

  csv += '\r\nSegment Totals\r\n\r\n';
  // TODO: Segment Totals Data

  csv += `\r\n\r\n${disclaimer}`;

  return csv;
};

const createCSV = (data, i) => {
  try {
    fs.writeFileSync(`${__dirname}\\..\\reports\\monitorReport${i}.csv`, data, { flag: 'wx' });
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
      reports.forEach((report, index) => {
        const csvData = convertToCSV(report, index);
        createCSV(csvData, index);
      });
      const zip = new AdmZip();
      fs.readdirSync(`${__dirname}\\..\\reports`).forEach((name) => {
        zip.addLocalFile(`${__dirname}\\..\\reports\\${name}`);
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
  }
});

module.exports = router;
