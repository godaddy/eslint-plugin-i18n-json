/*
  An example ascending (a -> z) sort function. 
  Return the keys in the order you want them to be sorted.

  The sort function is called at each level of the translations object. 
  The sort function MUST ALWAYS return the same sorted order of keys. 
*/

module.exports = (translations) => {
  return Object.keys(translations).sort((keyA, keyB) => {
    if (keyA === keyB) {
      return 0;
    } else if (keyA < keyB) {
      return -1;
    } else {
      return 1;
    }
  })
};
