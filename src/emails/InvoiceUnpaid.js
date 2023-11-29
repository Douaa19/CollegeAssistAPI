module.exports.invoiceUnpaid = (
  content,
  user,
  course,
  payment,
  remaining_amount
) => {
  const dynamicContent = content
    .replace("${user.firstName}", user.firstName)
    .replace("${user.lastName}", user.lastName)
    .replace("${course.title}", course.title)
    .replace("${payment.given_price}", payment.given_price)
    .replace("${remaining_amount}", remaining_amount);

  return dynamicContent;
};
