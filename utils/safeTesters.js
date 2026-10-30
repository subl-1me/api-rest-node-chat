const safeTester = (user) => {
  return {
    username: user.username,
    createdAt: user.createdAt,
    avatar: user.avatar,
  };
};

module.exports = {
  safeTester,
};
