var repository = {
  users: {}
};

repository.saveUser = function(user){
  return new Promise(function(resolve, reject){
    user.id(Math.random());
    this.users[user.id()] = user;
    resolve(user.id());
  }.bind(this));
};

repository.loadUser = function(user_id){
  return new Promise(function(resolve, reject){
    var user = this.users[user_id];
    if(!!user){
      resolve(user);
    }
    reject(new Error("user is not found"));
  }.bind(this));
};
