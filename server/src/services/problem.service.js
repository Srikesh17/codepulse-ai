import { problemRepository } from '../repositories/problem.repository.js';

export class ProblemService {
  async listProblems(filters, pagination) {
    const result = await problemRepository.findAll(filters, pagination);
    return result;
  }

  async getProblemBySlug(slug) {
    const problem = await problemRepository.findBySlug(slug);
    if (!problem) {
      const err = new Error(`Problem not found: ${slug}`);
      err.status = 404;
      err.isPublic = true;
      throw err;
    }
    return problem;
  }
}

export const problemService = new ProblemService();
