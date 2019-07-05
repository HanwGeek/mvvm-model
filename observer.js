// Written by HanwGeek
// observer.js

function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  walk: function(data) {
    var _this = this;
    Object.keys(data).forEach(function(key) {
      _this.convert(key, data[key]);
    });
  },
  convert: function(key, val) {
    this.defineReactive(this.data, key, val);
  },
  defineReactive: function(data, key, val) {
    var dep = new Dep();
    // 递归监听子属性
    var childObj = observe(val);
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: function() {
        Dep.target && dep.depend(Dep.target);
        return val;
      },
      set: function(newVal) {
        if (newVal === val) {return;}
        console.log("Value Change: ", val, " ==> ", newVal);
        val = newVal;
        childObj = observe(newVal);
        dep.notify();
      }
    })
  }
}

function observe(value, vm) {
  if (!value || typeof value != 'object') {
    return;
  }
  return new Observer(value);
};

var uid = 0;

function Dep() {
  this.id = uid++;
  this.subs = [];
}

Dep.prototype = {
  addSub: function(sub) {
    this.subs.push(sub);
  },
  depend: function() {
    Dep.target.addDep(this);
  },
  removeSub: function(sub) {
    var index = this.subs.indexOf(sub);
    if (index != -1) {
      this.subs.splice(index, 1);
    }
  },
  notify: function() {
    this.subs.forEach(function(sub) {
      sub.update();
    });
  }
}

Dep.target = null;