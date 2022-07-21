const { ObjectId } = require('mongoose').Types;
const Submission = require('../models/submission.schema');
const Form = require('../models/form.schema');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const getForm = async () => {
  return Form.findOne({ _id: 0 });
};

const updateForm = async (updatedForm) => {
  return Form.updateOne(
    { _id: 0 },
    {
      $set: updatedForm,
    },
  );
};

const updateSubmission = async (submissionId, updatedSubmission) => {
  return Submission.updateOne(
    { _id: submissionId },
    {
      $set: { ...updatedSubmission, lastEditedAt: new Date() },
    },
  );
};

const getSubmissions = async (filters) => {
  const {
    submitter,
    status,
    segment,
    date: dateFilter,
    pageIndex,
    pageSize,
    sort,
    sortAscending,
  } = filters;
  // make regex out of submitter search query
  const escapedSubmitter = submitter ? escapeRegExp(submitter) : '';
  const submitterRegex = new RegExp(`.*${escapedSubmitter}.*`, 'i');
  // convert sortAscending boolean into mongo 1 or -1
  const sortDirection = Number(sortAscending === 'true') * 2 - 1; // 1 = asc, -1 = desc
  const sortObj = {};
  if (sort) {
    sortObj[sort] = sortDirection;
  }
  // parse page size + index
  const limit = parseInt(pageSize, 10) || 0;
  const pageNum = parseInt(pageIndex, 10) || 0;
  // skip documents to get to correct page
  const skipCount = limit * pageNum;

  // AND clauses for matching fields directly in submission
  const baseAndQuery = [];
  if (status) {
    baseAndQuery.push({ status });
  }
  if (dateFilter) {
    const date = new Date(dateFilter);
    baseAndQuery.push({
      $expr: {
        $and: [
          // js date.getMonth() is 0-indexed
          { $eq: [{ $month: '$submittedAt' }, date.getMonth() + 1] },
          { $eq: [{ $year: '$submittedAt' }, date.getFullYear()] },
        ],
      },
    });
  }

  // after populating segment, filter by segment id if the filter is present
  let segmentMatch = {};
  if (segment) {
    segmentMatch = {
      'segment._id': ObjectId(segment),
    };
  }

  const fullQuery = [];
  // only add match stage if there is a status or date filter
  if (baseAndQuery.length > 0) {
    fullQuery.push({ $match: { $and: baseAndQuery } });
  }

  fullQuery.push(
    // populate submitter
    {
      $lookup: {
        from: 'users',
        localField: 'submitter',
        foreignField: '_id',
        as: 'submitter',
      },
    },
    // take submitter out of array
    {
      $unwind: '$submitter',
    },
    // populate segment
    {
      $lookup: {
        from: 'segments',
        localField: 'segment',
        foreignField: '_id',
        as: 'segment',
      },
    },
    // take segment out of array
    {
      $unwind: '$segment',
    },
    // populate sessionPartners (don't unwind to preserve multiple partners)
    {
      $lookup: {
        from: 'users',
        localField: 'sessionPartners',
        foreignField: '_id',
        as: 'sessionPartners',
      },
    },
    // remove unnecessary fields
    {
      $project: {
        'submitter.segments': 0,
        'submitter.role': 0,
        'submitter.isActive': 0,
        'submitter.registered': 0,
        'submitter.profileImage': 0,
        'segment.volunteers': 0,
        'segment.deadline': 0,
        'segment.mapLink': 0,
        'segment.streets': 0,
        'segment.parking': 0,
        'sessionPartners.profileImage': 0,
        'sessionPartners.segments': 0,
        'sessionPartners.isActive': 0,
        'sessionPartners.isTrainee': 0,
        'sessionPartners.role': 0,
      },
    },
    // match for submitter name/email and segment
    {
      $match: {
        $and: [
          {
            $or: [
              {
                $expr: {
                  $regexMatch: {
                    input: { $concat: ['$submitter.firstName', ' ', '$submitter.lastName'] },
                    regex: escapedSubmitter,
                    options: 'i',
                  },
                },
              },
              {
                'submitter.email': { $regex: submitterRegex },
              },
            ],
          },
          segmentMatch,
        ],
      },
    },
  );
  // sort if sort key was specified
  if (sort) {
    fullQuery.push({ $sort: sortObj });
  }
  fullQuery.push(
    // get total # of results for these filters, put submissions into results array
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        results: {
          $push: '$$ROOT',
        },
      },
    },
    // slice results into the correct page
    {
      $project: {
        _id: 0,
        total: 1,
        results: {
          $slice: ['$results', skipCount, limit > 0 ? limit : '$total'],
        },
      },
    },
  );
  const res = await Submission.aggregate(fullQuery);
  // return res;
  return res[0] || { results: [], total: 0 };
};

const getSubmissionsByMonth = async (query) => {
  return Submission.aggregate([
    // Stage 1 - Get all submissions within date range
    {
      $match: query,
    },
    // Stage 2 - Group all submissions by status and push submission info, injured Terrestrial Count, and speeding vehicles count
    // into array separated by their status
    {
      $group: {
        _id: '$status',
        submissions: {
          $push: {
            submissionId: '$_id',
            date: '$date',
            segment: '$segment',
            submitter: '$submitter',
            injuredAdditional: '$additionalSpecies.injuredCount',
            speedingVehicles: { $sum: '$humanActivity.speedingVehicles' },
          },
        },
      },
    },
    // Stage 3 - Prepare segments for look up
    { $unwind: '$submissions' },
    // Stage 4 - Look up segment info
    {
      $lookup: {
        from: 'segments',
        localField: 'submissions.segment',
        foreignField: '_id',
        as: 'submissions.segment',
      },
    },
    // Stage 5 - Convert segment from array to segement
    { $unwind: '$submissions.segment' },
    // Stage 6  Look up volunteers inside segments
    {
      $lookup: {
        from: 'users',
        localField: 'submissions.segment.volunteers',
        foreignField: '_id',
        as: 'submissions.segment.volunteers',
      },
    },
    // Stage 8 - Group data by submission type via _id
    {
      $group: {
        _id: '$_id',
        submissions: {
          $push: '$submissions',
        },
      },
    },
    // // Stage 9 - Sort Objects containing array of submissions by their status
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
};

const getSubmissionsByDates = async (startDate, endDate) => {
  return Submission.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
    status: 'APPROVED',
  })
    .populate('submitter', 'firstName lastName -_id')
    .populate('segment', '-_id segmentId')
    .populate('sessionPartners', 'firstName lastName -_id')
    .populate('listedSpecies.species', 'name -_id')
    .populate('additionalSpecies.entries.species', 'name -_id')
    .populate('predators.species', '-_id')
    .sort({ date: 'asc' });
};

const getSubmissionsByIds = async (ids) => {
  return Submission.find({
    _id: {
      $in: ids,
    },
    status: 'APPROVED',
  })
    .populate('submitter', 'firstName lastName -_id')
    .populate('segment', '-_id segmentId')
    .populate('sessionPartners', 'firstName lastName -_id')
    .populate('listedSpecies.species', 'name -_id')
    .populate('additionalSpecies.entries.species', 'name -_id')
    .populate('predators.species', '-_id')
    .sort({ date: 'asc' });
};

const getSubmission = async (submissionId) => {
  return Submission.findOne({ _id: submissionId });
};

const getListedByMonth = async (query) => {
  return Submission.aggregate([
    // Stage 1 - Get all submissions within date range
    {
      $match: query,
    },
    // Stage 2 - Get segment info
    {
      $lookup: {
        from: 'segments',
        localField: 'segment',
        foreignField: '_id',
        as: 'segment',
      },
    },
    // Stage 3 - prepare segment for lookup
    { $unwind: '$segment' },
    // Stage 4 - change structure of listedSpecies
    {
      $addFields: {
        listedSpecies: {
          $map: {
            input: { $objectToArray: '$listedSpecies' },
            as: 'ls',
            in: {
              species: { $toObjectId: '$$ls.k' },
              entries: '$$ls.v.entries',
              injuredCount: '$$ls.v.injuredCount',
            },
          },
        },
      },
    },
    // Stage 5 - prepare listedSpecies for lookup
    {
      $unwind: '$listedSpecies',
    },
    // Stage 6 - lookup each listed species info
    {
      $lookup: {
        from: 'species',
        localField: 'listedSpecies.species',
        foreignField: '_id',
        as: 'listedSpecies.species',
      },
    },
    // Stage 7 - turn each listed specie as an object
    {
      $unwind: '$listedSpecies.species',
    },
    // Stage 8 - prepare each listed specie entry for look up
    {
      $unwind: { path: '$listedSpecies.entries', preserveNullAndEmptyArrays: true },
    },
    // Stage 9 - Group listed species by name and get their injured count
    {
      $group: {
        _id: '$listedSpecies.species.name',
        info: {
          $push: {
            entries: '$listedSpecies.entries',
            segment: '$segment.segmentId',
          },
        },
        injured: { $sum: '$listedSpecies.injuredCount' },
      },
    },
    // Stage 10 - sort data by listed specie name
    {
      $sort: { _id: 1 },
    },
  ]);
};

const deleteSubmission = async (submissionId) => {
  return Submission.remove({ _id: submissionId });
};

const createSubmission = async (submission, user) => {
  const createdSubmission = new Submission({
    ...submission,
    segment: submission.segment || null,
    submitter: user,
    lastEditedAt: new Date(),
  });
  return createdSubmission.save();
};

module.exports = {
  getForm,
  updateForm,
  updateSubmission,
  deleteSubmission,
  getSubmission,
  getSubmissionsByMonth,
  getSubmissionsByIds,
  getListedByMonth,
  getSubmissions,
  getSubmissionsByDates,
  createSubmission,
};
