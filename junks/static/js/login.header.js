var header = {};
header.view = function(user){
  return m("div", [
    "username: ", user.name(),
    ",",
    "password: ", user.password()
  ]);
};
