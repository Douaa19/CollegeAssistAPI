module.exports.courseUpdates = (content, course) => {
  const dynamicContent = content
    .replace("${course.title}", course.title)
    .replace("${course.start_date}", course.start_date)
    .replace("${course.duration}", course.duration)
    .replace("${course.description}", course.description)
    .replace("${course.price}", course.price);

  return dynamicContent;
};
