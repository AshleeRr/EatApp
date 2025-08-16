export const HandError = (titulo, status) => {
  const error = new Error(titulo);
  error.status = status;
  throw error;
};

export default HandError;
