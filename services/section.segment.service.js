const Segment = require('../models/segment.schema');
const Section = require('../models/section.schema');

const options = { new: true };

module.exports = {
  getSection: async (id) => {
    return Section.findById(id).populate('segments.name');
  },
  getSegment: async (id) => {
    return Segment.findById(id);
  },
  getUnassignedSegments: async () => {
    return Segment.find({ assigned: false }).select('_id');
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
  deleteSection: async (id) => {
    const results = { section: null, segment: null };
    const res = await Section.findById(id);
    const segList = res.segments.map((seg) => {
      return seg.name;
    });

    results.segment = Promise.all(
      segList.forEach(async (seg) => {
        await Segment.findByIdAndUpdate(seg, { assigned: false });
      }),
    ).catch((err) => {
      return err;
    });
    results.section = await Section.findByIdAndDelete(id);
    return results;
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
