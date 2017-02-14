(function(exports){
    'use strict';

    exports.__esModule = true;
    var apply = function apply(target, source) {
        Object.keys(source).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });

        return target;
    };

    var Make = function Make(object, prototype) {
        if (arguments.length < 2) {
            prototype = object;
            object = null;
        }

        if (object === null) {
            object = Object.create(prototype);
        } else {
            object = apply(Object.create(prototype), object);
        }

        var m = function m() {
            var make = prototype.make || prototype._make || function () {};

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            make.apply(object, args);

            return object;
        };

        m.get = function () {
            return object;
        };

        return m;
    };

    exports.Make = Make;
    var hasPrototype = function hasPrototype(object, prototype) {
        var p = Object.getPrototypeOf(object);

        while (p !== null) {
            if (typeof prototype == 'function') prototype = prototype.prototype;

            if (p == prototype) return true;else p = Object.getPrototypeOf(p);
        }

        return false;
    };
    exports.hasPrototype = hasPrototype;
})(window);
