module.exports.invoicePaid = (content, user, course, payment) => {
  const dynamicContent = content
    .replace("${user.firstName}", user.firstName)
    .replace("${user.lastName}", user.lastName)
    .replace("${payment.given_price}", payment.given_price)
    .replace("${course.title}", course.title);

  return dynamicContent;
};
