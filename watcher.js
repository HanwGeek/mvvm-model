// Written by HanwGeek
// watcher.js

function Watcher(vm, expOrFn, cb) {
  this.vm = vm;
  this.expOrFn = expOrFn;
  this.cb = cb;
  this.depIds = {};

  if (typeof expOrFn === 'function') {
    this.getter = expOrFn; 
  } else {
    this.getter = this.parseGetter(expOrFn.trim());
  }
  this.value = this.get();
}

Watcher.prototype = {
  update: function() {
    this.run();
  },
  run: function() {
    var val = this.get();
    var oldVal = this.val;
    if (val != oldVal) {
      this.val = val;
      this.cb.call(this.vm, val, oldVal);
    }
  },
  addDep: function(dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this);
      this.depIds[dep.id] = dep;
    }
  },
  get: function() {
    Dep.target = this; // 将订阅者指向自身
    var val = this.getter.call(this.vm, this.vm);; //触发属性getter，添加自身
    Dep.target = null; //清除
    return val;
  },
  parseGetter: function(exp) {
    if (/[^\w.$]/.test(exp)) return;

    var exps = exp.split('.');

    return function(obj) {
      for (var i = 0; i < exps.length; i++) {
        if (!obj) return;
        obj = obj[exps[i]];
      }
      return obj;
    }
  }
};