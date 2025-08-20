const toTitleCase = (str) => {
  return str ? str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) : "";
};

export default toTitleCase;
