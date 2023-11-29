module.exports.courseExpiring = (content, user, course) => {
  const dynamicContent = content
    .replace("${user.firstName}", user.firstName)
    .replace("${user.lastName}", user.lastName)
    .replace("${course.title}", course.title);

  return dynamicContent;
};
