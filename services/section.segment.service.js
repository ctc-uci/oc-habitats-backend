const Segment = require('../models/segment.schema');
const Section = require('../models/section.schema');

// TODO: Implement checking if deleted/get nothing

module.exports = {
  getSection: async (id) => {
    return Section.findById(id);
  },
  getSegment: async (id) => {
    return Segment.findById(id);
  },
  createSection: async (section) => {
    const newSection = new Section(section);
    return newSection.save();
  },
  createSegment: async () => {},
  updateSection: async (id, updatedSection) => {
    return Section.findByIdAndUpdate(id, updatedSection);
  },
  // When we update segment, we need to update in section too
  updateSegment: async () => {},
  deleteSection: async (id) => {
    return Section.findByIdAndDelete(id);
  },
  //   deleteSegment: async (segment) => {},
};

// Andrea: createSegment, editSegment
