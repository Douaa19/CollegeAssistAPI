module.exports.resetPassword = (content, link) => {
  const dynamicContent = content.replace("${link}", link);

  return dynamicContent;
};
