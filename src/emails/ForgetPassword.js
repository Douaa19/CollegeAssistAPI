module.exports.forgetPassword = (content, resetLink) => {
  const dynamicContent = content.replace("${resetLink}", resetLink);

  return dynamicContent;
};
