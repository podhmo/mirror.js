var todo = {};

// models

todo.Todo = function(data){
  this.description = m.prop(data.description);
  this.done = m.prop(false);
};

todo.TodoList = Array;


// view models

todo.vm = {};
todo.vm.init = function(){
  this.list = new todo.TodoList();
  this.description = m.prop("");

  // add todo
  this.add = function(){
    if(this.description()){
      this.list.push(new todo.Todo({description: this.description()}));
      this.description("");
    }
  }.bind(this);

  this.changeDescription = function(text){
    this.description(text);
    this.add();
  }.bind(this);
};



// controller

todo.controller = function(){
  todo.vm.init();
};


// views
todo.view = function(){
  return m("html", [
    m("body",[
      m("input", {onchange: m.withAttr("value", todo.vm.description),
                  value: todo.vm.description()}),
      m("button", {onclick: todo.vm.add}, "Add"),
      m("table", [
        todo.vm.list.map(function(task, i){
          return m("tr", [
            m("td", [
              m("input[type=checkbox]", {onclick: m.withAttr("checked", task.done), checked: task.done()}),
            ]),
            m("td", {style: {textDecoration: task.done() ? "line-through" : "none"}}, task.description())
          ]);
        })
      ])
    ])
  ]);
};

// initialize the application
m.module(document, todo);

