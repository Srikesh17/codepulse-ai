import { query } from '../config/db.js';

export class ProblemRepository {
  /**
   * List published problems with optional search/filter/pagination.
   * @param {{ search?: string, difficulty?: string, topic?: string }} filters
   * @param {{ page: number, limit: number }} pagination
   */
  async findAll(filters = {}, pagination = { page: 1, limit: 20 }) {
    const { search, difficulty, topic } = filters;
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const conditions = ['is_published = TRUE'];
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }

    if (difficulty) {
      params.push(difficulty.toLowerCase());
      conditions.push(`difficulty = $${params.length}`);
    }

    if (topic) {
      params.push(topic);
      conditions.push(`$${params.length} = ANY(topics)`);
    }

    const whereClause = conditions.join(' AND ');

    // Count query
    const countRes = await query(
      `SELECT COUNT(*) AS total FROM problems WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countRes.rows[0].total, 10);

    // Data query
    params.push(limit, offset);
    const dataRes = await query(
      `SELECT id, slug, title, difficulty, topics, examples, function_name, created_at
       FROM problems
       WHERE ${whereClause}
       ORDER BY created_at ASC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return {
      problems: dataRes.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Fetch a single problem by its URL slug.
   */
  async findBySlug(slug) {
    const res = await query(
      `SELECT id, slug, title, description, difficulty, topics, constraints, examples, starter_code, function_name, created_at
       FROM problems
       WHERE slug = $1 AND is_published = TRUE`,
      [slug]
    );
    return res.rows[0] || null;
  }

  /**
   * Fetch a single problem by UUID.
   */
  async findById(id) {
    const res = await query(
      `SELECT id, slug, title, description, difficulty, topics, constraints, examples, starter_code, function_name, created_at
       FROM problems
       WHERE id = $1 AND is_published = TRUE`,
      [id]
    );
    return res.rows[0] || null;
  }
}

export const problemRepository = new ProblemRepository();
