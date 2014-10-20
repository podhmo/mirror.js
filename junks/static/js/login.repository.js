var repository = {
  users: {}
};

repository.saveUser = function(user){
  user.id(Math.random());
  this.users[user.id()] = user;
  return user.id();
};

repository.loadUser = function(user_id){
  var user = this.users[user_id];
  return user;
};
