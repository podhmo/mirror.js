function Collection(items){
  this.items = items;
}

Collection.prototype.toJSON = function(){
  return this.items.map(function(e){return !!e.toJSON? e.toJSON() : e;});
};

Collection.prototype.bind = function(e){
  e.toJSON = this.toJSON.bind(this);
};

Collection.prototype.add = function(e){
  if(this.items.indexOf(e) < 0){
    this.items.push(e);
  }
};

Collection.prototype.remove = function(e){
  this.items = this.items.filter(function(e2){return e !== e2;}); //xxx;
};

Collection.prototype.change = function(e, checked){
  if(checked){
    return this.add(e);
  }else{
    return this.remove(e);
  }
};
//for node.
if(typeof module != "undefined" && module !== null){
  module.exports = Collection;
}
