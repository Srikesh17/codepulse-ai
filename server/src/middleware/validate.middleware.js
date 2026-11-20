export function validate(schema) {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        err.errors.forEach((e) => {
          const field = e.path.join('.');
          if (!fieldErrors[field]) {
            fieldErrors[field] = e.message;
          }
        });
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: fieldErrors,
        });
      }
      next(err);
    }
  };
}
