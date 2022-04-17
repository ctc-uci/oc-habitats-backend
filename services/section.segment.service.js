const Segment = require('../models/segment.schema');
const Section = require('../models/section.schema');

const options = { new: true };

module.exports = {
  getSection: async (id) => {
    return Section.findById(id);
  },
  getSegment: async (id) => {
    return Segment.findOne({ segmentId: id });
  },
  getSegments: async () => {
    return Segment.find({});
  },
  getSections: async () => {
    return Section.find({}).populate('segments');
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
      { $push: { segments: newSegment } },
    );
    return results;
  },
  updateSection: (id, updatedSection) => {
    return Section.findByIdAndUpdate(id, updatedSection, options);
  },
  updateSegment: (id, updatedSegment) => {
    // TO-DO: update section if segments are moved to different section
    return Segment.findByIdAndUpdate(id, updatedSegment, options);
  },
  deleteSection: (id) => {
    return Section.findByIdAndDelete(id);
  },
  deleteSegment: async (segmentID, sectionId) => {
    // delete form user array
    const results = { section: null, segment: null };
    results.segment = await Segment.findByIdAndDelete(segmentID);
    results.section = await Section.findOneAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          segments: { segmentID },
        },
      },
    );
    return results;
  },
};
