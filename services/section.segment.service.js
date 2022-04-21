const Segment = require('../models/segment.schema');
const Section = require('../models/section.schema');
const User = require('../models/user.schema');

const options = { new: true };

module.exports = {
  getSection: async (id) => {
    return Section.findById(id).populate({
      path: 'segments',
      options: { sort: { segmentId: 1 } },
    });
  },

  getSegment: async (id) => {
    return Segment.findOne({ segmentId: id }).populate({
      path: 'volunteerData',
      select: 'id segments firebaseId firstName lastName email role isActive isTrainee',
    });
  },

  getSegments: async () => {
    return Segment.find({}).populate({
      path: 'volunteerData',
      select: 'id segments firebaseId firstName lastName email role isActive isTrainee',
    });
  },

  getUnassignedSegments: async () => {
    return Segment.find({ assigned: false }).select('_id');
  },

  getSegNames: async () => {
    return Segment.find({}, { _id: 0, segmentId: 1 });
  },

  getSections: async (populateVolunteers = false) => {
    return populateVolunteers
      ? Section.find({}).populate({ path: 'segments', populate: { path: 'volunteerData' } })
      : Section.find({}).populate({
          path: 'segments',
          options: { sort: { segmentId: 1 } },
        });
  },

  getUnassigned: async () => {
    return Segment.find({ volunteers: { $size: 0 } }, { _id: 0, segmentId: 1, volunteers: 1 });
  },

  createSection: async (section) => {
    // eslint-disable-next-line no-underscore-dangle
    if (!section._id || !section.name || !section.map) {
      throw new Error('Arguments missing in section');
    }
    // eslint-disable-next-line no-underscore-dangle
    const sectionExists = await Section.findOne({ _id: section._id });
    if (sectionExists) {
      throw new Error('This section already exists');
    }
    const newSection = new Section(section);
    return newSection.save();
  },

  createSegment: async (segment, section) => {
    if (
      !segment.segmentId ||
      !segment.name ||
      !segment.mapLink ||
      !segment.parking ||
      !segment.streets
    ) {
      throw new Error('Arguments missing in segment');
    }
    if (!section) {
      throw new Error('Missing section argument');
    }
    const segmentExists = await Segment.findOne({ segmentId: segment.segmentId });
    if (segmentExists) {
      throw new Error('This segment already exists');
    }
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
    const sectionExists = await Section.findById(section);
    if (!sectionExists) {
      throw new Error('This section does not exist');
    }

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
    results.segment = await Segment.findByIdAndUpdate(id, updatedSegment, options);
    return results;
  },

  deleteSection: (id) => {
    // TO-DO: What happens to the segments in the section
    return Section.findByIdAndDelete(id);
  },

  deleteSegment: async (segmentID, sectionId) => {
    const results = { section: null, segment: null, volunteers: null };
    const volunteers = await Segment.findOne({ _id: segmentID }, { _id: 0, volunteers: 1 });

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
    if (volunteers && volunteers.volunteers.length !== 0) {
      try {
        results.volunteers = await User.updateMany(
          { firebaseId: { $in: volunteers.volunteers } },
          { $pull: { segments: segmentID } },
        );
      } catch (err) {
        console.log(err);
      }
    }

    return results;
  },
};
  getUnassignedSegments: async () => {
    return Segment.find({ assigned: false }).select('_id');
