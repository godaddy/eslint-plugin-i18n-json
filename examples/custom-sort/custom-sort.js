/*
  An example descending sort function. 
  Return the keys in the order you want them to be sorted.
*/

module.exports = (translations) => {
  return Object.keys(translations).sort((keyA, keyB) => {
    if (keyA == keyB) {
      return 0;
    } else if (keyA < keyB) {
      return -1;
    } else {
      return 1;
    }
  })
};