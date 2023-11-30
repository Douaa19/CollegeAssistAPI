module.exports.blog = (content, post) => {
  const dynamicContent = content
    .replace("${post.title}", post.title)
    .replace("${post.content}", post.content)
    .replace("${post.image}", post.image);

  return dynamicContent;
};
