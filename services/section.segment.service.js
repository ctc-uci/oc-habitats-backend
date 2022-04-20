const Segment = require('../models/segment.schema');
const Section = require('../models/section.schema');
const User = require('../models/user.schema');

const options = { new: true };

module.exports = {
  getSection: async (id) => {
    return Section.findById(id).populate('segments');
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
  updateSegment: async (id, updatedSegment, section) => {
    const results = { oldSection: null, newSection: null, segment: null };
    // get the section the segment is currently in
    const currentSection = await Section.findOne({ segments: id }, { _id: 1 });
    // eslint-disable-next-line no-underscore-dangle
    if (currentSection._id !== section) {
      results.oldSection = await Section.updateOne(
        { _id: currentSection },
        { $pull: { segments: id } },
      );
      results.newSection = await Section.updateOne(
        { _id: section },
        { $addToSet: { segments: id } },
      );
    }
    results.segment = await Segment.updateOne({ _id: id }, { $set: updatedSegment });
    return results;
  },
  deleteSection: (id) => {
    // TO-DO: What happens to the segments in the section
    return Section.findByIdAndDelete(id);
  },
  deleteSegment: async (segmentID, sectionId) => {
    const results = { section: null, segment: null, volunteers: null };
    results.segment = await Segment.findByIdAndDelete(segmentID);
    // delete from Section
    results.section = await Section.findOneAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          segments: segmentID,
        },
      },
    );
    // delete form Users that are assigned this segment
    results.volunteers = await User.updateMany(
      { firebaseId: { $in: results.segment.volunteers } },
      { $pull: { segments: segmentID } },
    );
    return results;
  },
};
