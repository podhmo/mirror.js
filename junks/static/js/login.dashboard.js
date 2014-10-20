var dashboard = {};

dashboard.vm = {};
dashboard.vm.init = function(user){
  this.user = user;
};

dashboard.controller = function(){
  user = repository.loadUser(m.route.param("user_id"));
  dashboard.vm.init(user);
};

dashboard.view = function(ctrl){
  return m("div", [
    header.view(dashboard.vm.user),
    m("h1", ["login"]),
    m("a[href='/login']", {config: m.route}, ["logout"])
  ]);
};
