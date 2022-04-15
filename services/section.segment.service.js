const Segment = require('../models/segment.schema');
const Section = require('../models/section.schema');

const options = { new: true };

module.exports = {
  getSection: async (id) => {
    return Section.findById(id);
  },
  getSegment: async (id) => {
    return Segment.findById(id);
  },
  getSegments: async () => {
    return Segment.find({});
  },
  getUnassignedSegments: async () => {
    return Segment.find({ assigned: false }).select('_id');
  },
  getSegmentsBySection: async (id) => {
    return Section.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: 'segments',
          localField: 'segments',
          foreignField: 'segmentId',
          as: 'sectionSegments',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          sectionSegments: 1,
        },
      },
    ]);
  },
  createSection: (section) => {
    const newSection = new Section(section);
    return newSection.save();
  },
  createSegment: async (segment, section) => {
    const newSegment = new Segment(segment);
    const results = { section: null, segment: null };
    results.segment = await newSegment.save();
    results.section = await Section.findOneAndUpdate(
      { _id: section },
      { $push: { segments: newSegment.segmentId } },
    );
    return results;
  },
  updateSection: (id, updatedSection) => {
    return Section.findByIdAndUpdate(id, updatedSection, options);
  },
  updateSegment: (id, updatedSegment) => {
    return Segment.findByIdAndUpdate(id, updatedSegment, options);
  },
  deleteSection: (id) => {
    return Section.findByIdAndDelete(id);
  },
  deleteSegment: async (segmentID, sectionName) => {
    const results = { section: null, segment: null };
    results.segment = await Segment.findByIdAndDelete(segmentID);
    results.section = await Section.findOneAndUpdate(
      { name: sectionName },
      {
        $pull: {
          segments: { name: segmentID },
        },
      },
    );
    return results;
  },
};
