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
  // get segments by section
  getSegmentsBySection: async (id) => {
    return Section.aggregate([
      { $match: { name: id } },
      {
        $lookup: {
          from: 'segments',
          localField: 'segments.name',
          foreignField: 'name',
          as: 'sectionSegments',
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          sectionSegments: 1,
        },
      },
    ]);
  },
  createSection: async (section, segmentName) => {
    const newSection = new Section(section);
    const results = { section: null, segment: null };
    results.section = await newSection.save();
    results.segment = await Segment.findOneAndUpdate({ name: segmentName }, { assigned: true });
    return results;
  },
  createSegment: (segment) => {
    const newSegment = new Segment(segment);
    return newSegment.save();
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
