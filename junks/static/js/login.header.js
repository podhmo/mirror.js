var header = {};

header.vm = {};
header.vm.init = function(user){
  this.user = user;
};

header.controller = function(user){
  header.vm.init(user);
};

header.view = function(ctrl){
  return m("div", [
    "username: ", header.vm.user.name(),
    ",",
    "password: ", header.vm.user.password()
  ]);
};
