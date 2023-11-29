module.exports.invoicePaid = (content, user, course, payment) => {
  const dynamicContent = content
    .replace("${user.firstName}", user.firstName)
    .replace("${user.lastName}", user.lastName)
    .replace("${payment.givin_price}", payment.givin_price)
    .replace("${course.title}", course.title);

  return dynamicContent;
};
