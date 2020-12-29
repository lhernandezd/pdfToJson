const getDesciption = (raw, data, startIndex, endIndex, undesiredString = '----------------Page') => {
  const description = raw.slice(startIndex, endIndex).replace(/\r\n/g, ' ').trim();
  if (description.includes(undesiredString)) {
    const undesiredStringIndex = description.indexOf('----------------Page');
    const newEndIndex = description[undesiredStringIndex + (description.length - undesiredStringIndex)];
    const test = description.slice(undesiredStringIndex, newEndIndex);
    return description.replace(test, '').replace(data.code, '').replace('A00', '').trim();
  }
  return description.replace(data.code, '').replace('A00', '').trim();
};

module.exports = {
  getDesciption,
};
