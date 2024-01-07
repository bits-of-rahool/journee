const render = function (allPosts) {
  res.render("home", {
    homeContent: homeStartingContent,
    allPost: allPosts,
  });
};
export default render;
