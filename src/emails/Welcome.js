module.exports.welcomeEmail = (content, user) => {
  const dynamicContent = content
    .replace("${user.firstName}", user.firstName)
    .replace("${user.lastName}", user.lastName)
    .replace("${user.date}", user.lastAccess);

  return dynamicContent;
};
