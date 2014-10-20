var dashboard = {};

dashboard.vm = {};
dashboard.vm.init = function(user){
  this.user = user;
};

dashboard.controller = function(){
  user = repository.loadUser(m.route.param("user_id"));
  dashboard.vm.init(user);
  this.header = new header.controller(user);
};

dashboard.view = function(ctrl){
  return m("div", [
    header.view(ctrl.header),
    m("h1", ["login"]),
    m("a[href='/login']", {config: m.route}, ["logout"])
  ]);
};
