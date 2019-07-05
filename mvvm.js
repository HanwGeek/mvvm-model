function MVVM(options) {
  this.$options = options || {};
  var data = this._data = this.$options.data;
  var _this = this;

  // 数据代理
  Object.keys(data).forEach(function(key) {
    _this._proxyData(key);
  });

  this._initComputed();
  observe(data, this);

  this.$compile = new Compile(options.el || document.body, this);
}

MVVM.prototype = {
  $watch: function(key, cb, options) {
    new Watcher(this. key, cb);
  },
  _proxyData: function(key, setter, getter) {
    var _this = this;
    setter = setter || 
      Object.defineProperty(_this, key, {
        configurable: false,
        enumerable: true,
        get: function proxyGetter() {
          return _this._data[key];
        },
        set: function proxySetter(newVal) {
          _this._data[key] = newVal;
        }
      });
  },
  _initComputed: function() {
    var _this = this;
    var computed = this.$options.computed;
    if (typeof computed === 'object') {
      Object.keys(computed).forEach(function(key) {
        Object.defineProperty(_this, key, {
          get: typeof computed[key] === 'function' ? computed[key] : computed['key'].get,
          set: function() {}
        });
      });
    }
  }
};