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

const getSubmission = async (submissionId) => {
  return Submission.findOne({ _id: submissionId });
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
  getSubmissions,
  createSubmission,
};
