const HandControllersAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const HandRepositoriesAsync =
  (fn) =>
  (...args) =>
    Promise.resolve(fn(...args)).catch((err) => {
      throw err;
    });

export { HandControllersAsync, HandRepositoriesAsync };
