module.exports = obj => Object.keys(obj)
  .sort((a, b) => a.slice(0, 2)
    .localeCompare(b.slice(0, 2), undefined, { sensitivity: 'base' }));
