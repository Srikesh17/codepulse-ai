import { problemService } from '../services/problem.service.js';
import { listProblemsQuerySchema } from '../validators/problem.validator.js';

export const listProblems = async (req, res, next) => {
  try {
    const parsed = listProblemsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters.',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { search, difficulty, topic, page, limit } = parsed.data;
    const result = await problemService.listProblems(
      { search, difficulty, topic },
      { page, limit }
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getProblem = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const problem = await problemService.getProblemBySlug(slug);
    res.json({ success: true, data: problem });
  } catch (err) {
    next(err);
  }
};
