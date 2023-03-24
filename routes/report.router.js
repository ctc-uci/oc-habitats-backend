/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const fs = require('fs');
const XlsxTemplate = require('xlsx-template');
const moment = require('moment');
const { intToExcelCol } = require('excel-column-name');
const monitorLogService = require('../services/monitorLog.service');
const segmentService = require('../services/section.segment.service');
const Species = require('../models/species.schema');
const formService = require('../services/form.service');

const router = express.Router();

const HUMAN_ACTIVITIES = [
  [
    'Humans Sitting',
    'Human Sitting/Walking/Running, Sports, Bikes (Non-Motorized), Fires, Fishing',
    'beachActivity',
  ],
  [
    'Humans Walking/Running/Surfing',
    'Surfers, Windsurfers, Kite Sailing, Kayakers, SUPs, Other',
    'waterActivity',
  ],
  ['Equipment', 'Drone in Use, Fan Paragliding, Kite Flying', 'airborneActivity'],
  ['Vehicles under 10mph', 'ATV & Equipment, Bikes, Boards, Other', 'speedingVehicles'],
  ['Vehicles over 10mph', 'Cars, ATV & Equipment, Bikes, Boards, Other', 'nonSpeedingVehicles'],
  ['Dogs: Off Leash', 'Dogs, Cats, Other', 'offLeashAnimals'],
  ['Dogs: On Leash', 'Dogs, Cats, Other', 'onLeashAnimals'],
].map(([a, _, c]) => [a, c]);

// const convertToPascal = (text) => {
//   return text.replace(/((?<!^)[A-Z](?![A-Z]))(?=\S)/g, ' $1').replace(/^./, (s) => s.toUpperCase());
// };

const getSegmentNames = async () => {
  const dict = await segmentService.getSegNames();
  return dict.map((segment) => {
    return segment.toJSON().segmentId;
  });
};

const convertTime = (militaryTime) => {
  return moment(militaryTime, 'HH:mm').format('hh:mm a');
};

const getSegmentCounts = async (submissions) => {
  const segments = await getSegmentNames();
  const segmentDictionary = Object.assign({}, ...segments.map((segment) => ({ [segment]: 0 })));
  submissions.forEach((submission) => {
    if (submission.segment.segmentId in segmentDictionary) {
      segmentDictionary[submission.segment.segmentId] += 1;
    }
  });
  const keys = Object.keys(segmentDictionary);
  keys.sort((a, b) => a.length - b.length || a.localeCompare(b));
  const values = keys.map((k) => segmentDictionary[k]);
  return [keys, values];
};

const getLocation = (listedSpeciesEntry) => {
  const { gps, crossStreet } = listedSpeciesEntry;
  if (gps.some((c) => c && c.longitude && c.latitude)) {
    return (
      gps
        .map((c) => `${c.latitude}/${c.longitude}`)
        .filter((s) => s !== '/')
        .join(', ') + (crossStreet ? ` | ${crossStreet}` : '')
    );
  }
  return crossStreet;
};

const getSpecies = async () => {
  return Species.find();
};

const formatLogs = async (reports, birds, activities) => {
  // console.log(JSON.stringify(reports, null, 4));
  const allSpecies = await getSpecies();
  return reports.map(async (report) => {
    // report.listedSpecies.keys().map((id) => {
    //   return console.log(id);
    // });
    const speciesIds = Array.from(report.listedSpecies?.keys() || []);
    speciesIds.sort();
    const listedSpecies = await Promise.all(
      speciesIds.map(async (id, idx) => {
        const { entries } = report.listedSpecies.get(id);

        const res = [];
        res.push([
          `count${idx + 1}`,
          entries.reduce(
            (sum, { totalAdults, totalFledges }) => sum + totalAdults + totalFledges,
            0,
          ),
        ]);
        res.push([
          `chicks${idx + 1}`,
          entries.reduce((sum, { totalChicks }) => sum + totalChicks, 0),
        ]);
        res.push([`time${idx + 1}`, entries.map((e) => convertTime(e.time)).join(', ')]);
        res.push([
          `banding${idx + 1}`,
          entries.map((e) => e.bandTabs.map((tab) => tab.code).join(', ')).join(', '),
        ]);
        const locations = entries.map(getLocation);
        res.push([`locationa${idx + 1}`, locations[0] || '']);
        res.push([`locationb${idx + 1}`, locations[1] || '']);
        return res;
      }),
    );
    const listedObj = Object.fromEntries(listedSpecies.reduce((a, b) => a.concat(b), []));

    const birdCounts = new Array(birds.length).fill(0);
    const additionalSpecies = Array.from(report.additionalSpecies.entries?.keys() || []);
    const speciesIndexes = new Map();
    birds.forEach((b, idx) => speciesIndexes.set(b._id.toString(), idx));
    additionalSpecies.forEach((id) => {
      const species = report.additionalSpecies.entries.get(id);
      if (id === String(allSpecies.find((i) => i.code === 'Other')._id)) {
        birdCounts[speciesIndexes.get(id)] += species.reduce((prev, next) => prev + next.count, 0);
      } else {
        birdCounts[speciesIndexes.get(id)] += species.count;
      }
    });

    const humanActivityCounts = new Array(activities.length).fill(0);
    const humanActivity = Array.from(report.humanActivity?.keys() || []);
    const activityIndexes = new Map();
    activities.forEach((a, idx) => activityIndexes.set(a[1], idx));
    humanActivity.forEach((id) => {
      humanActivityCounts[activityIndexes.get(id)] += report.humanActivity.get(id);
    });

    return {
      date: moment(report.date).format('MM/DD/yyyy'),
      segment: report.segment?.segmentId,
      ...listedObj,
      beachCast: report.additionalSpecies?.beachCast ?? 0,
      issues: report.humanActivityOtherNotes,
      birds: birdCounts.map((c) => (c === 0 ? '' : c)),
      humanActivity: humanActivityCounts.map((c) => (c === 0 ? '' : c)),
    };
  });
};

const getHumanActivities = async () => {
  return (await formService.getFormByType('human-activity'))?.additionalFields;
};

router.post('/report', async (req, res) => {
  const { date } = req.body;
  const { logIds } = req.body;
  let [startDate, endDate] = [null, null];
  if (date) {
    startDate = moment(date).startOf('month');
    endDate = moment(date).endOf('month').endOf('day');
  }
  try {
    let reports;
    if (logIds) {
      reports = await monitorLogService.getSubmissionsByIds(logIds);
    } else {
      reports = await monitorLogService.getSubmissionsByDates(startDate, endDate);
    }

    if (!reports.length) {
      res.status(400).json({ message: `Reports from ${startDate} to ${endDate} doesn't exist` });
    } else {
      const allSpecies = await getSpecies();
      allSpecies.sort((a, b) => (a.name < b.name ? -1 : 1));
      const birds = allSpecies.filter(
        (s) =>
          s.category === 'NON_LISTED' ||
          s.category === 'LISTED' ||
          s.category === 'NON_LISTED_PREDATOR',
      );
      const activities = (await getHumanActivities())
        .map((a) => [a.title, a._id.toString()])
        .concat(HUMAN_ACTIVITIES)
        .sort();
      if (startDate === null) {
        startDate = new Date();
      }
      const month = `- ${moment(startDate).format('MMMM YYYY')}`;
      const logs = await Promise.all(await formatLogs(reports, birds, activities));
      const [segmentNames, segmentCounts] = await getSegmentCounts(reports);

      const sheetData = {
        logs,
        month,
        birds: birds.map((b) => b.name),
        humanActivity: activities.map((a) => a[0]),
        sums: new Array(activities.length + 1)
          .fill('')
          .map(
            (_, idx) =>
              `=SUM(${intToExcelCol(15 + idx)}4:${intToExcelCol(15 + idx)}${3 + logs.length})`,
          )
          .concat(['', 'Total:'])
          .concat(
            new Array(birds.length)
              .fill(0)
              .map(
                (_, idx) =>
                  `=SUM(${intToExcelCol(18 + activities.length + idx)}4:${intToExcelCol(
                    18 + activities.length + idx,
                  )}${4 + logs.length - 1})`,
              ),
          ),
        segments: segmentNames.map((_, idx) => ({
          name: segmentNames[idx],
          count: segmentCounts[idx],
        })),
      };

      // Create a template
      fs.readFile('template.xlsx', (err, data) => {
        const template = new XlsxTemplate(data);

        // Replacements take place on first sheet
        const sheetNumber = 1;

        // Perform substitution
        template.substitute(sheetNumber, sheetData);

        // Get binary data
        const output = template.generate({ type: 'base64' });
        // fs.createWriteStream('test.xlsx').write(output);
        // fs.writeFileSync('test.xlsx', output);
        res.writeHead(200, {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=report.xlsx',
        });
        res.end(Buffer.from(output, 'base64'));
        // res.status(200).send('good');
        // const segStr = await getSegmentRow(reports);

        // reports.forEach(async (report) => {
        //   let csvData = await convertToCSV(report);
        //   csvData += `${segStr}\r\n${disclaimer}`;
        //   createCSV(csvData, report._id.toString());
        // });
        // const zip = new AdmZip();
        // fs.readdirSync(reportsDirectory).forEach((file) => {
        //   zip.addLocalFile(`${reportsDirectory}\\${file}`);
        // });
        // res.writeHead(200, {
        //   'Content-Disposition': `attachment; filename="${new Date(
        //     startDate,
        //   ).toLocaleDateString()}_${new Date(endDate).toLocaleDateString()}_reports.zip"`,
        //   'Content-Type': 'application/zip',
        // });
        // const zipFileContents = zip.toBuffer();
        // res.end(zipFileContents);

        // res.status(200).send('good');
      });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});
module.exports = router;
