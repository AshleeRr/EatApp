export const setLayout = (layoutPath) => {
  return (req, res, next) => {
    res.locals.layout = layoutPath;
    next();
  };
};
