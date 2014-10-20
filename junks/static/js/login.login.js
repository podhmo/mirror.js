var login = {};

login.User = function(){
  this.name = m.prop("");
  this.password = m.prop("");
  this.id = m.prop();

  this.assertName = function(name){
    console.log(name);
    return name === "admin";
  }.bind(this);

  this.assertPassword = function(password){
    console.log(password);
    return password === "admin";
  }.bind(this);

  this.submit = function(name, password){
    this.name(name);
    this.password(password);
    return repository.saveUser(this);
  }.bind(this);
};


login.vm = {};

login.vm.init = function(cb){
  this.user = new login.User();
  this.message = m.prop("入力してください");
  this.name = m.prop("admin");
  this.password = m.prop("");

  this.submit = function(){
    if(this.user.assertName(this.name()) && this.user.assertPassword(this.password())){
      this.message("ok");
      cb(this.user.submit(this.name(), this.password()));
    }else{
      this.message("ユーザー名かpasswordが間違っています");
    }
  }.bind(this);
};

login.controller = function(){
  login.vm.init(function(user_id){
    m.route("/dashboard/"+user_id);
  });
};

login.view = function(ctrl){
  var vm = login.vm;
  return m("div", [
    m("h1", [vm.message()]),
    m("div", [
      m("label", ["name:", m("input[type=name]", {value:vm.name(), onchange:m.withAttr("value", vm.name)})]),
      m("label", ["password:", m("input[type=password][type=password]", {value:vm.password(), onchange:m.withAttr("value", vm.password)}),]),
      m("button", {onclick: vm.submit.bind(vm)}, ["submit"])
    ])
  ]);
};
