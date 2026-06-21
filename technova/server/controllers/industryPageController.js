import IndustryPage from '../models/IndustryPage.js';

export const getIndustryPages = async (req, res, next) => {
  try {
    const pages = await IndustryPage.find().select('-caseStudyRefs');
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    next(error);
  }
};

export const getIndustryPageBySlug = async (req, res, next) => {
  try {
    const page = await IndustryPage.findOne({ slug: req.params.slug })
      .populate('caseStudyRefs');
    
    if (!page) {
      return res.status(404).json({ success: false, message: 'Industry page not found' });
    }

    res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

export const createIndustryPage = async (req, res, next) => {
  try {
    const page = await IndustryPage.create(req.body);
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

export const updateIndustryPage = async (req, res, next) => {
  try {
    const page = await IndustryPage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Industry page not found' });
    }
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

export const deleteIndustryPage = async (req, res, next) => {
  try {
    const page = await IndustryPage.findByIdAndDelete(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Industry page not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
