import Blog from '../models/Blog.js';

// @desc    Get all blogs (Admin)
// @route   GET /api/v1/blogs/admin
// @access  Private/Admin
export const getAdminBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a blog post
// @route   POST /api/v1/blogs
// @access  Private/Admin
export const createBlog = async (req, res, next) => {
  try {
    req.body.author = req.user._id;
    if (req.file) {
      req.body.coverImage = req.file.path || req.file.location;
    }

    const blog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog post
// @route   PUT /api/v1/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }

    if (req.file) {
      req.body.coverImage = req.file.path || req.file.location;
    }

    // Handle tags if sent as string
    if (typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/v1/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get published blogs (Public)
// @route   GET /api/v1/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate('author', 'name avatar')
      .sort('-publishedAt');

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug (Public)
// @route   GET /api/v1/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'name avatar');

    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};
