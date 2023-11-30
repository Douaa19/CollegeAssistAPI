module.exports.attendence = (content, user, course, date) => {
  const dynamicContent = content
    .replace("${user.firstName}", user.firstName)
    .replace("${user.lastName}", user.lastName)
    .replace("${course.title}", course.title)
    .replace("${date}", date);

  return dynamicContent;
};
