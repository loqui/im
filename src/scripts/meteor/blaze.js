Meteor = {};
! function() {
    var e, t;
    (function() {
        t = {}
    }).call(this),
        function() {
            (function() {
                var e = this,
                    r = e._,
                    n = {},
                    o = Array.prototype,
                    a = Object.prototype,
                    c = Function.prototype,
                    s = o.push,
                    i = o.slice,
                    u = o.concat,
                    d = a.toString,
                    p = a.hasOwnProperty,
                    l = o.forEach,
                    h = o.map,
                    f = o.reduce,
                    g = o.reduceRight,
                    m = o.filter,
                    v = o.every,
                    y = o.some,
                    E = o.indexOf,
                    b = o.lastIndexOf,
                    A = Array.isArray,
                    C = Object.keys,
                    w = c.bind,
                    _ = function(e) {
                        return e instanceof _ ? e : this instanceof _ ? void(this._wrapped = e) : new _(e)
                    };
                "undefined" != typeof t ? ("undefined" != typeof module && module.exports && (t = module.exports = _), t._ = _) : e._ = _, _.VERSION = "1.5.2";
                var x = function(e) {
                    return "[object Arguments]" === d.call(e)
                };
                x(arguments) || (x = function(e) {
                    return !(!e || !p.call(e, "callee") || "function" != typeof e.callee)
                });
                var D = function(e) {
                        return e.length === +e.length && (x(e) || e.constructor !== Object)
                    },
                    T = _.each = _.forEach = function(e, t, r) {
                        if (null != e)
                            if (l && e.forEach === l) e.forEach(t, r);
                            else if (D(e)) {
                            for (var o = 0, a = e.length; a > o; o++)
                                if (t.call(r, e[o], o, e) === n) return
                        } else
                            for (var c = _.keys(e), o = 0, a = c.length; a > o; o++)
                                if (t.call(r, e[c[o]], c[o], e) === n) return
                    };
                _.map = _.collect = function(e, t, r) {
                    var n = [];
                    return null == e ? n : h && e.map === h ? e.map(t, r) : (T(e, function(e, o, a) {
                        n.push(t.call(r, e, o, a))
                    }), n)
                };
                var k = "Reduce of empty array with no initial value";
                _.reduce = _.foldl = _.inject = function(e, t, r, n) {
                    var o = arguments.length > 2;
                    if (null == e && (e = []), f && e.reduce === f) return n && (t = _.bind(t, n)), o ? e.reduce(t, r) : e.reduce(t);
                    if (T(e, function(e, a, c) {
                            o ? r = t.call(n, r, e, a, c) : (r = e, o = !0)
                        }), !o) throw new TypeError(k);
                    return r
                }, _.reduceRight = _.foldr = function(e, t, r, n) {
                    var o = arguments.length > 2;
                    if (null == e && (e = []), g && e.reduceRight === g) return n && (t = _.bind(t, n)), o ? e.reduceRight(t, r) : e.reduceRight(t);
                    var a = e.length;
                    if (!D(e)) {
                        var c = _.keys(e);
                        a = c.length
                    }
                    if (T(e, function(s, i, u) {
                            i = c ? c[--a] : --a, o ? r = t.call(n, r, e[i], i, u) : (r = e[i], o = !0)
                        }), !o) throw new TypeError(k);
                    return r
                }, _.find = _.detect = function(e, t, r) {
                    var n;
                    return B(e, function(e, o, a) {
                        return t.call(r, e, o, a) ? (n = e, !0) : void 0
                    }), n
                }, _.filter = _.select = function(e, t, r) {
                    var n = [];
                    return null == e ? n : m && e.filter === m ? e.filter(t, r) : (T(e, function(e, o, a) {
                        t.call(r, e, o, a) && n.push(e)
                    }), n)
                }, _.reject = function(e, t, r) {
                    return _.filter(e, function(e, n, o) {
                        return !t.call(r, e, n, o)
                    }, r)
                }, _.every = _.all = function(e, t, r) {
                    t || (t = _.identity);
                    var o = !0;
                    return null == e ? o : v && e.every === v ? e.every(t, r) : (T(e, function(e, a, c) {
                        return (o = o && t.call(r, e, a, c)) ? void 0 : n
                    }), !!o)
                };
                var B = _.some = _.any = function(e, t, r) {
                    t || (t = _.identity);
                    var o = !1;
                    return null == e ? o : y && e.some === y ? e.some(t, r) : (T(e, function(e, a, c) {
                        return o || (o = t.call(r, e, a, c)) ? n : void 0
                    }), !!o)
                };
                _.contains = _.include = function(e, t) {
                    return null == e ? !1 : E && e.indexOf === E ? -1 != e.indexOf(t) : B(e, function(e) {
                        return e === t
                    })
                }, _.invoke = function(e, t) {
                    var r = i.call(arguments, 2),
                        n = _.isFunction(t);
                    return _.map(e, function(e) {
                        return (n ? t : e[t]).apply(e, r)
                    })
                }, _.pluck = function(e, t) {
                    return _.map(e, function(e) {
                        return e[t]
                    })
                }, _.where = function(e, t, r) {
                    return _.isEmpty(t) ? r ? void 0 : [] : _[r ? "find" : "filter"](e, function(e) {
                        for (var r in t)
                            if (t[r] !== e[r]) return !1;
                        return !0
                    })
                }, _.findWhere = function(e, t) {
                    return _.where(e, t, !0)
                }, _.max = function(e, t, r) {
                    if (!t && _.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.max.apply(Math, e);
                    if (!t && _.isEmpty(e)) return -1 / 0;
                    var n = {
                        computed: -1 / 0,
                        value: -1 / 0
                    };
                    return T(e, function(e, o, a) {
                        var c = t ? t.call(r, e, o, a) : e;
                        c > n.computed && (n = {
                            value: e,
                            computed: c
                        })
                    }), n.value
                }, _.min = function(e, t, r) {
                    if (!t && _.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.min.apply(Math, e);
                    if (!t && _.isEmpty(e)) return 1 / 0;
                    var n = {
                        computed: 1 / 0,
                        value: 1 / 0
                    };
                    return T(e, function(e, o, a) {
                        var c = t ? t.call(r, e, o, a) : e;
                        c < n.computed && (n = {
                            value: e,
                            computed: c
                        })
                    }), n.value
                }, _.shuffle = function(e) {
                    var t, r = 0,
                        n = [];
                    return T(e, function(e) {
                        t = _.random(r++), n[r - 1] = n[t], n[t] = e
                    }), n
                }, _.sample = function(e, t, r) {
                    return arguments.length < 2 || r ? e[_.random(e.length - 1)] : _.shuffle(e).slice(0, Math.max(0, t))
                };
                var F = function(e) {
                    return _.isFunction(e) ? e : function(t) {
                        return t[e]
                    }
                };
                _.sortBy = function(e, t, r) {
                    var n = F(t);
                    return _.pluck(_.map(e, function(e, t, o) {
                        return {
                            value: e,
                            index: t,
                            criteria: n.call(r, e, t, o)
                        }
                    }).sort(function(e, t) {
                        var r = e.criteria,
                            n = t.criteria;
                        if (r !== n) {
                            if (r > n || void 0 === r) return 1;
                            if (n > r || void 0 === n) return -1
                        }
                        return e.index - t.index
                    }), "value")
                };
                var S = function(e) {
                    return function(t, r, n) {
                        var o = {},
                            a = null == r ? _.identity : F(r);
                        return T(t, function(r, c) {
                            var s = a.call(n, r, c, t);
                            e(o, s, r)
                        }), o
                    }
                };
                _.groupBy = S(function(e, t, r) {
                    (_.has(e, t) ? e[t] : e[t] = []).push(r)
                }), _.indexBy = S(function(e, t, r) {
                    e[t] = r
                }), _.countBy = S(function(e, t) {
                    _.has(e, t) ? e[t] ++ : e[t] = 1
                }), _.sortedIndex = function(e, t, r, n) {
                    r = null == r ? _.identity : F(r);
                    for (var o = r.call(n, t), a = 0, c = e.length; c > a;) {
                        var s = a + c >>> 1;
                        r.call(n, e[s]) < o ? a = s + 1 : c = s
                    }
                    return a
                }, _.toArray = function(e) {
                    return e ? _.isArray(e) ? i.call(e) : D(e) ? _.map(e, _.identity) : _.values(e) : []
                }, _.size = function(e) {
                    return null == e ? 0 : D(e) ? e.length : _.keys(e).length
                }, _.first = _.head = _.take = function(e, t, r) {
                    return null == e ? void 0 : null == t || r ? e[0] : i.call(e, 0, t)
                }, _.initial = function(e, t, r) {
                    return i.call(e, 0, e.length - (null == t || r ? 1 : t))
                }, _.last = function(e, t, r) {
                    return null == e ? void 0 : null == t || r ? e[e.length - 1] : i.call(e, Math.max(e.length - t, 0))
                }, _.rest = _.tail = _.drop = function(e, t, r) {
                    return i.call(e, null == t || r ? 1 : t)
                }, _.compact = function(e) {
                    return _.filter(e, _.identity)
                };
                var N = function(e, t, r) {
                    return t && _.every(e, _.isArray) ? u.apply(r, e) : (T(e, function(e) {
                        _.isArray(e) || _.isArguments(e) ? t ? s.apply(r, e) : N(e, t, r) : r.push(e)
                    }), r)
                };
                _.flatten = function(e, t) {
                    return N(e, t, [])
                }, _.without = function(e) {
                    return _.difference(e, i.call(arguments, 1))
                }, _.uniq = _.unique = function(e, t, r, n) {
                    _.isFunction(t) && (n = r, r = t, t = !1);
                    var o = r ? _.map(e, r, n) : e,
                        a = [],
                        c = [];
                    return T(o, function(r, n) {
                        (t ? n && c[c.length - 1] === r : _.contains(c, r)) || (c.push(r), a.push(e[n]))
                    }), a
                }, _.union = function() {
                    return _.uniq(_.flatten(arguments, !0))
                }, _.intersection = function(e) {
                    var t = i.call(arguments, 1);
                    return _.filter(_.uniq(e), function(e) {
                        return _.every(t, function(t) {
                            return _.indexOf(t, e) >= 0
                        })
                    })
                }, _.difference = function(e) {
                    var t = u.apply(o, i.call(arguments, 1));
                    return _.filter(e, function(e) {
                        return !_.contains(t, e)
                    })
                }, _.zip = function() {
                    for (var e = _.max(_.pluck(arguments, "length").concat(0)), t = new Array(e), r = 0; e > r; r++) t[r] = _.pluck(arguments, "" + r);
                    return t
                }, _.object = function(e, t) {
                    if (null == e) return {};
                    for (var r = {}, n = 0, o = e.length; o > n; n++) t ? r[e[n]] = t[n] : r[e[n][0]] = e[n][1];
                    return r
                }, _.indexOf = function(e, t, r) {
                    if (null == e) return -1;
                    var n = 0,
                        o = e.length;
                    if (r) {
                        if ("number" != typeof r) return n = _.sortedIndex(e, t), e[n] === t ? n : -1;
                        n = 0 > r ? Math.max(0, o + r) : r
                    }
                    if (E && e.indexOf === E) return e.indexOf(t, r);
                    for (; o > n; n++)
                        if (e[n] === t) return n;
                    return -1
                }, _.lastIndexOf = function(e, t, r) {
                    if (null == e) return -1;
                    var n = null != r;
                    if (b && e.lastIndexOf === b) return n ? e.lastIndexOf(t, r) : e.lastIndexOf(t);
                    for (var o = n ? r : e.length; o--;)
                        if (e[o] === t) return o;
                    return -1
                }, _.range = function(e, t, r) {
                    arguments.length <= 1 && (t = e || 0, e = 0), r = arguments[2] || 1;
                    for (var n = Math.max(Math.ceil((t - e) / r), 0), o = 0, a = new Array(n); n > o;) a[o++] = e, e += r;
                    return a
                };
                var O = function() {};
                _.bind = function(e, t) {
                    var r, n;
                    if (w && e.bind === w) return w.apply(e, i.call(arguments, 1));
                    if (!_.isFunction(e)) throw new TypeError;
                    return r = i.call(arguments, 2), n = function() {
                        if (!(this instanceof n)) return e.apply(t, r.concat(i.call(arguments)));
                        O.prototype = e.prototype;
                        var o = new O;
                        O.prototype = null;
                        var a = e.apply(o, r.concat(i.call(arguments)));
                        return Object(a) === a ? a : o
                    }
                }, _.partial = function(e) {
                    var t = i.call(arguments, 1);
                    return function() {
                        return e.apply(this, t.concat(i.call(arguments)))
                    }
                }, _.bindAll = function(e) {
                    var t = i.call(arguments, 1);
                    if (0 === t.length) throw new Error("bindAll must be passed function names");
                    return T(t, function(t) {
                        e[t] = _.bind(e[t], e)
                    }), e
                }, _.memoize = function(e, t) {
                    var r = {};
                    return t || (t = _.identity),
                        function() {
                            var n = t.apply(this, arguments);
                            return _.has(r, n) ? r[n] : r[n] = e.apply(this, arguments)
                        }
                }, _.delay = function(e, t) {
                    var r = i.call(arguments, 2);
                    return setTimeout(function() {
                        return e.apply(null, r)
                    }, t)
                }, _.defer = function(e) {
                    return _.delay.apply(_, [e, 1].concat(i.call(arguments, 1)))
                }, _.throttle = function(e, t, r) {
                    var n, o, a, c = null,
                        s = 0;
                    r || (r = {});
                    var i = function() {
                        s = r.leading === !1 ? 0 : new Date, c = null, a = e.apply(n, o)
                    };
                    return function() {
                        var u = new Date;
                        s || r.leading !== !1 || (s = u);
                        var d = t - (u - s);
                        return n = this, o = arguments, 0 >= d ? (clearTimeout(c), c = null, s = u, a = e.apply(n, o)) : c || r.trailing === !1 || (c = setTimeout(i, d)), a
                    }
                }, _.debounce = function(e, t, r) {
                    var n, o, a, c, s;
                    return function() {
                        a = this, o = arguments, c = new Date;
                        var i = function() {
                                var u = new Date - c;
                                t > u ? n = setTimeout(i, t - u) : (n = null, r || (s = e.apply(a, o)))
                            },
                            u = r && !n;
                        return n || (n = setTimeout(i, t)), u && (s = e.apply(a, o)), s
                    }
                }, _.once = function(e) {
                    var t, r = !1;
                    return function() {
                        return r ? t : (r = !0, t = e.apply(this, arguments), e = null, t)
                    }
                }, _.wrap = function(e, t) {
                    return function() {
                        var r = [e];
                        return s.apply(r, arguments), t.apply(this, r)
                    }
                }, _.compose = function() {
                    var e = arguments;
                    return function() {
                        for (var t = arguments, r = e.length - 1; r >= 0; r--) t = [e[r].apply(this, t)];
                        return t[0]
                    }
                }, _.after = function(e, t) {
                    return function() {
                        return --e < 1 ? t.apply(this, arguments) : void 0
                    }
                }, _.keys = C || function(e) {
                    if (e !== Object(e)) throw new TypeError("Invalid object");
                    var t = [];
                    for (var r in e) _.has(e, r) && t.push(r);
                    return t
                }, _.values = function(e) {
                    for (var t = _.keys(e), r = t.length, n = new Array(r), o = 0; r > o; o++) n[o] = e[t[o]];
                    return n
                }, _.pairs = function(e) {
                    for (var t = _.keys(e), r = t.length, n = new Array(r), o = 0; r > o; o++) n[o] = [t[o], e[t[o]]];
                    return n
                }, _.invert = function(e) {
                    for (var t = {}, r = _.keys(e), n = 0, o = r.length; o > n; n++) t[e[r[n]]] = r[n];
                    return t
                }, _.functions = _.methods = function(e) {
                    var t = [];
                    for (var r in e) _.isFunction(e[r]) && t.push(r);
                    return t.sort()
                }, _.extend = function(e) {
                    return T(i.call(arguments, 1), function(t) {
                        if (t)
                            for (var r in t) e[r] = t[r]
                    }), e
                }, _.pick = function(e) {
                    var t = {},
                        r = u.apply(o, i.call(arguments, 1));
                    return T(r, function(r) {
                        r in e && (t[r] = e[r])
                    }), t
                }, _.omit = function(e) {
                    var t = {},
                        r = u.apply(o, i.call(arguments, 1));
                    for (var n in e) _.contains(r, n) || (t[n] = e[n]);
                    return t
                }, _.defaults = function(e) {
                    return T(i.call(arguments, 1), function(t) {
                        if (t)
                            for (var r in t) void 0 === e[r] && (e[r] = t[r])
                    }), e
                }, _.clone = function(e) {
                    return _.isObject(e) ? _.isArray(e) ? e.slice() : _.extend({}, e) : e
                }, _.tap = function(e, t) {
                    return t(e), e
                };
                var I = function(e, t, r, n) {
                    if (e === t) return 0 !== e || 1 / e == 1 / t;
                    if (null == e || null == t) return e === t;
                    e instanceof _ && (e = e._wrapped), t instanceof _ && (t = t._wrapped);
                    var o = d.call(e);
                    if (o != d.call(t)) return !1;
                    switch (o) {
                        case "[object String]":
                            return e == String(t);
                        case "[object Number]":
                            return e != +e ? t != +t : 0 == e ? 1 / e == 1 / t : e == +t;
                        case "[object Date]":
                        case "[object Boolean]":
                            return +e == +t;
                        case "[object RegExp]":
                            return e.source == t.source && e.global == t.global && e.multiline == t.multiline && e.ignoreCase == t.ignoreCase
                    }
                    if ("object" != typeof e || "object" != typeof t) return !1;
                    for (var a = r.length; a--;)
                        if (r[a] == e) return n[a] == t;
                    var c = e.constructor,
                        s = t.constructor;
                    if (c !== s && !(_.isFunction(c) && c instanceof c && _.isFunction(s) && s instanceof s)) return !1;
                    r.push(e), n.push(t);
                    var i = 0,
                        u = !0;
                    if ("[object Array]" == o) {
                        if (i = e.length, u = i == t.length)
                            for (; i-- && (u = I(e[i], t[i], r, n)););
                    } else {
                        for (var p in e)
                            if (_.has(e, p) && (i++, !(u = _.has(t, p) && I(e[p], t[p], r, n)))) break;
                        if (u) {
                            for (p in t)
                                if (_.has(t, p) && !i--) break;
                            u = !i
                        }
                    }
                    return r.pop(), n.pop(), u
                };
                _.isEqual = function(e, t) {
                    return I(e, t, [], [])
                }, _.isEmpty = function(e) {
                    if (null == e) return !0;
                    if (_.isArray(e) || _.isString(e)) return 0 === e.length;
                    for (var t in e)
                        if (_.has(e, t)) return !1;
                    return !0
                }, _.isElement = function(e) {
                    return !(!e || 1 !== e.nodeType)
                }, _.isArray = A || function(e) {
                    return "[object Array]" == d.call(e)
                }, _.isObject = function(e) {
                    return e === Object(e)
                }, T(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(e) {
                    _["is" + e] = function(t) {
                        return d.call(t) == "[object " + e + "]"
                    }
                }), _.isArguments(arguments) || (_.isArguments = function(e) {
                    return !(!e || !_.has(e, "callee"))
                }), "function" != typeof /./ && (_.isFunction = function(e) {
                    return "function" == typeof e
                }), _.isFinite = function(e) {
                    return isFinite(e) && !isNaN(parseFloat(e))
                }, _.isNaN = function(e) {
                    return _.isNumber(e) && e != +e
                }, _.isBoolean = function(e) {
                    return e === !0 || e === !1 || "[object Boolean]" == d.call(e)
                }, _.isNull = function(e) {
                    return null === e
                }, _.isUndefined = function(e) {
                    return void 0 === e
                }, _.has = function(e, t) {
                    return p.call(e, t)
                }, _.noConflict = function() {
                    return e._ = r, this
                }, _.identity = function(e) {
                    return e
                }, _.times = function(e, t, r) {
                    for (var n = Array(Math.max(0, e)), o = 0; e > o; o++) n[o] = t.call(r, o);
                    return n
                }, _.random = function(e, t) {
                    return null == t && (t = e, e = 0), e + Math.floor(Math.random() * (t - e + 1))
                };
                var L = {
                    escape: {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#x27;"
                    }
                };
                L.unescape = _.invert(L.escape);
                var q = {
                    escape: new RegExp("[" + _.keys(L.escape).join("") + "]", "g"),
                    unescape: new RegExp("(" + _.keys(L.unescape).join("|") + ")", "g")
                };
                _.each(["escape", "unescape"], function(e) {
                    _[e] = function(t) {
                        return null == t ? "" : ("" + t).replace(q[e], function(t) {
                            return L[e][t]
                        })
                    }
                }), _.result = function(e, t) {
                    if (null == e) return void 0;
                    var r = e[t];
                    return _.isFunction(r) ? r.call(e) : r
                }, _.mixin = function(e) {
                    T(_.functions(e), function(t) {
                        var r = _[t] = e[t];
                        _.prototype[t] = function() {
                            var e = [this._wrapped];
                            return s.apply(e, arguments), $.call(this, r.apply(_, e))
                        }
                    })
                };
                var M = 0;
                _.uniqueId = function(e) {
                    var t = ++M + "";
                    return e ? e + t : t
                }, _.templateSettings = {
                    evaluate: /<%([\s\S]+?)%>/g,
                    interpolate: /<%=([\s\S]+?)%>/g,
                    escape: /<%-([\s\S]+?)%>/g
                };
                var P = /(.)^/,
                    j = {
                        "'": "'",
                        "\\": "\\",
                        "\r": "r",
                        "\n": "n",
                        "	": "t",
                        "\u2028": "u2028",
                        "\u2029": "u2029"
                    },
                    R = /\\|'|\r|\n|\t|\u2028|\u2029/g;
                _.template = function(e, t, r) {
                    var n;
                    r = _.defaults({}, r, _.templateSettings);
                    var o = new RegExp([(r.escape || P).source, (r.interpolate || P).source, (r.evaluate || P).source].join("|") + "|$", "g"),
                        a = 0,
                        c = "__p+='";
                    e.replace(o, function(t, r, n, o, s) {
                        return c += e.slice(a, s).replace(R, function(e) {
                            return "\\" + j[e]
                        }), r && (c += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'"), n && (c += "'+\n((__t=(" + n + "))==null?'':__t)+\n'"), o && (c += "';\n" + o + "\n__p+='"), a = s + t.length, t
                    }), c += "';\n", r.variable || (c = "with(obj||{}){\n" + c + "}\n"), c = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + c + "return __p;\n";
                    try {
                        n = new Function(r.variable || "obj", "_", c)
                    } catch (s) {
                        throw s.source = c, s
                    }
                    if (t) return n(t, _);
                    var i = function(e) {
                        return n.call(this, e, _)
                    };
                    return i.source = "function(" + (r.variable || "obj") + "){\n" + c + "}", i
                }, _.chain = function(e) {
                    return _(e).chain()
                };
                var $ = function(e) {
                    return this._chain ? _(e).chain() : e
                };
                _.mixin(_), T(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(e) {
                    var t = o[e];
                    _.prototype[e] = function() {
                        var r = this._wrapped;
                        return t.apply(r, arguments), "shift" != e && "splice" != e || 0 !== r.length || delete r[0], $.call(this, r)
                    }
                }), T(["concat", "join", "slice"], function(e) {
                    var t = o[e];
                    _.prototype[e] = function() {
                        return $.call(this, t.apply(this._wrapped, arguments))
                    }
                }), _.extend(_.prototype, {
                    chain: function() {
                        return this._chain = !0, this
                    },
                    value: function() {
                        return this._wrapped
                    }
                })
            }).call(this)
        }.call(this),
        function() {
            e = t._
        }.call(this), "undefined" == typeof Package && (Package = {}), Package.underscore = {
            _: e
        }
}(),
function() {
    var e, t = Package.underscore._;
    (function() {
        e = {
            isClient: !0,
            isServer: !1
        }, "object" == typeof __meteor_runtime_config__ && __meteor_runtime_config__.PUBLIC_SETTINGS && (e.settings = {
            "public": __meteor_runtime_config__.PUBLIC_SETTINGS
        })
    }).call(this),
        function() {
            if (e.isServer) var r = Npm.require("fibers/future");
            "object" == typeof __meteor_runtime_config__ && __meteor_runtime_config__.meteorRelease && (e.release = __meteor_runtime_config__.meteorRelease), t.extend(e, {
                _get: function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        if (!(arguments[t] in e)) return void 0;
                        e = e[arguments[t]]
                    }
                    return e
                },
                _ensure: function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var r = arguments[t];
                        r in e || (e[r] = {}), e = e[r]
                    }
                    return e
                },
                _delete: function(e) {
                    for (var t = [e], r = !0, n = 1; n < arguments.length - 1; n++) {
                        var o = arguments[n];
                        if (!(o in e)) {
                            r = !1;
                            break
                        }
                        if (e = e[o], "object" != typeof e) break;
                        t.push(e)
                    }
                    for (var n = t.length - 1; n >= 0; n--) {
                        var o = arguments[n + 1];
                        if (r) r = !1;
                        else
                            for (var a in t[n][o]) return;
                        delete t[n][o]
                    }
                },
                _wrapAsync: function(n) {
                    return function() {
                        for (var o, a, c = this, s = t.toArray(arguments), i = function(t) {
                                return t ? e._debug("Exception in callback of async function", t.stack ? t.stack : t) : void 0
                            }; s.length > 0 && "undefined" == typeof s[s.length - 1];) s.pop();
                        s.length > 0 && s[s.length - 1] instanceof Function ? o = s.pop() : e.isClient ? o = i : (a = new r, o = a.resolver()), s.push(e.bindEnvironment(o));
                        var u = n.apply(c, s);
                        return a ? a.wait() : u
                    }
                },
                _inherits: function(e, r) {
                    t.each(r, function(t, r) {
                        e[r] = t
                    });
                    var n = function() {
                        this.constructor = e
                    };
                    return n.prototype = r.prototype, e.prototype = new n, e.__super__ = r.prototype, e
                }
            })
        }.call(this),
        function() {
            "use strict";

            function t() {
                if (o.setImmediate) {
                    var e = function(e) {
                        o.setImmediate(e)
                    };
                    return e.implementation = "setImmediate", e
                }
                return null
            }

            function r() {
                function e(e, t) {
                    return "string" == typeof e && e.substring(0, t.length) === t
                }

                function t(t) {
                    if (t.source === o && e(t.data, s)) {
                        var r = t.data.substring(s.length);
                        try {
                            c[r] && c[r]()
                        } finally {
                            delete c[r]
                        }
                    }
                }
                if (!o.postMessage || o.importScripts) return null;
                var r = !0,
                    n = o.onmessage;
                if (o.onmessage = function() {
                        r = !1
                    }, o.postMessage("", "*"), o.onmessage = n, !r) return null;
                var a = 0,
                    c = {},
                    s = "Meteor._setImmediate." + Math.random() + ".";
                o.addEventListener ? o.addEventListener("message", t, !1) : o.attachEvent("onmessage", t);
                var i = function(e) {
                    ++a, c[a] = e, o.postMessage(s + a, "*")
                };
                return i.implementation = "postMessage", i
            }

            function n() {
                var e = function(e) {
                    o.setTimeout(e, 0)
                };
                return e.implementation = "setTimeout", e
            }
            var o = this;
            e._setImmediate = t() || r() || n()
        }.call(this),
        function() {
            var r = function(e) {
                    if (Package.livedata) {
                        var t = Package.livedata.DDP._CurrentInvocation;
                        if (t.get() && t.get().isSimulation) throw new Error("Can't set timers inside simulations");
                        return function() {
                            t.withValue(null, e)
                        }
                    }
                    return e
                },
                n = function(t, n) {
                    return e.bindEnvironment(r(n), t)
                };
            t.extend(e, {
                setTimeout: function(e, t) {
                    return setTimeout(n("setTimeout callback", e), t)
                },
                setInterval: function(e, t) {
                    return setInterval(n("setInterval callback", e), t)
                },
                clearInterval: function(e) {
                    return clearInterval(e)
                },
                clearTimeout: function(e) {
                    return clearTimeout(e)
                },
                defer: function(t) {
                    e._setImmediate(n("defer callback", t))
                }
            })
        }.call(this),
        function() {
            e.makeErrorType = function(t, r) {
                var n = function() {
                    var e = this;
                    if (Error.captureStackTrace) Error.captureStackTrace(e, n);
                    else {
                        var o = new Error;
                        o.__proto__ = n.prototype, o instanceof n && (e = o)
                    }
                    return r.apply(e, arguments), e.errorType = t, e
                };
                return e._inherits(n, Error), n
            }, e.Error = e.makeErrorType("Meteor.Error", function(e, t, r) {
                var n = this;
                n.error = e, n.reason = t, n.details = r, n.message = n.reason ? n.reason + " [" + n.error + "]" : "[" + n.error + "]"
            }), e.Error.prototype.clone = function() {
                var t = this;
                return new e.Error(t.error, t.reason, t.details)
            }
        }.call(this),
        function() {
            e._noYieldsAllowed = function(e) {
                return e()
            }, e._SynchronousQueue = function() {
                var e = this;
                e._tasks = [], e._running = !1
            }, t.extend(e._SynchronousQueue.prototype, {
                runTask: function(r) {
                    var n = this;
                    if (!n.safeToRunTask()) throw new Error("Could not synchronously run a task from a running task");
                    n._tasks.push(r);
                    var o = n._tasks;
                    n._tasks = [], n._running = !0;
                    try {
                        for (; !t.isEmpty(o);) {
                            var a = o.shift();
                            try {
                                a()
                            } catch (c) {
                                if (t.isEmpty(o)) throw c;
                                e._debug("Exception in queued task: " + c.stack)
                            }
                        }
                    } finally {
                        n._running = !1
                    }
                },
                queueTask: function(e) {
                    var r = this,
                        n = t.isEmpty(r._tasks);
                    r._tasks.push(e), n && setTimeout(t.bind(r.flush, r), 0)
                },
                flush: function() {
                    var e = this;
                    e.runTask(function() {})
                },
                drain: function() {
                    var e = this;
                    if (e.safeToRunTask())
                        for (; !t.isEmpty(e._tasks);) e.flush()
                },
                safeToRunTask: function() {
                    var e = this;
                    return !e._running
                }
            })
        }.call(this),
        function() {
            var t = [],
                r = "loaded" === document.readyState || "complete" == document.readyState,
                n = function() {
                    for (r = !0; t.length;) t.shift()()
                };
            document.addEventListener ? (document.addEventListener("DOMContentLoaded", n, !1), window.addEventListener("load", n, !1)) : (document.attachEvent("onreadystatechange", function() {
                "complete" === document.readyState && n()
            }), window.attachEvent("load", n)), e.startup = function(n) {
                var o = !document.addEventListener && document.documentElement.doScroll;
                if (o && window === top) {
                    try {
                        o("left")
                    } catch (a) {
                        return void setTimeout(function() {
                            e.startup(n)
                        }, 50)
                    }
                    n()
                } else r ? n() : t.push(n)
            }
        }.call(this),
        function() {
            var t = 0;
            e._debug = function() {
                if (t) return void t--;
                if ("undefined" != typeof console && "undefined" != typeof console.log)
                    if (0 == arguments.length) console.log("");
                    else if ("function" == typeof console.log.apply) {
                    for (var e = !0, r = 0; r < arguments.length; r++) "string" != typeof arguments[r] && (e = !1);
                    e ? console.log.apply(console, [Array.prototype.join.call(arguments, " ")]) : console.log.apply(console, arguments)
                } else if ("function" == typeof Function.prototype.bind) {
                    var n = Function.prototype.bind.call(console.log, console);
                    n.apply(console, arguments)
                } else Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments))
            }, e._suppress_log = function(e) {
                t += e
            }
        }.call(this),
        function() {
            var r = 0,
                n = [];
            e.EnvironmentVariable = function() {
                this.slot = r++
            }, t.extend(e.EnvironmentVariable.prototype, {
                get: function() {
                    return n[this.slot]
                },
                getOrNullIfOutsideFiber: function() {
                    return this.get()
                },
                withValue: function(e, t) {
                    var r = n[this.slot];
                    try {
                        n[this.slot] = e;
                        var o = t()
                    } finally {
                        n[this.slot] = r
                    }
                    return o
                }
            }), e.bindEnvironment = function(r, o, a) {
                var c = t.clone(n);
                if (!o || "string" == typeof o) {
                    var s = o || "callback of async function";
                    o = function(t) {
                        e._debug("Exception in " + s + ":", t && t.stack || t)
                    }
                }
                return function() {
                    var e = n;
                    try {
                        n = c;
                        var s = r.apply(a, t.toArray(arguments))
                    } catch (i) {
                        o(i)
                    } finally {
                        n = e
                    }
                    return s
                }
            }, e._nodeCodeMustBeInFiber = function() {}
        }.call(this),
        function() {
            e.absoluteUrl = function(r, n) {
                n || "object" != typeof r || (n = r, r = void 0), n = t.extend({}, e.absoluteUrl.defaultOptions, n || {});
                var o = n.rootUrl;
                if (!o) throw new Error("Must pass options.rootUrl or set ROOT_URL in the server environment");
                return /^http[s]?:\/\//i.test(o) || (o = "http://" + o), /\/$/.test(o) || (o += "/"), r && (o += r), n.secure && /^http:/.test(o) && !/http:\/\/localhost[:\/]/.test(o) && !/http:\/\/127\.0\.0\.1[:\/]/.test(o) && (o = o.replace(/^http:/, "https:")), n.replaceLocalhost && (o = o.replace(/^http:\/\/localhost([:\/].*)/, "http://127.0.0.1$1")), o
            }, e.absoluteUrl.defaultOptions = {}, "object" == typeof __meteor_runtime_config__ && __meteor_runtime_config__.ROOT_URL && (e.absoluteUrl.defaultOptions.rootUrl = __meteor_runtime_config__.ROOT_URL), e._relativeToSiteRootUrl = function(e) {
                return "object" == typeof __meteor_runtime_config__ && "/" === e.substr(0, 1) && (e = (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX || "") + e), e
            }
        }.call(this), "undefined" == typeof Package && (Package = {}), Package.meteor = {
            Meteor: e
        }
}(),
function() {
    Package.meteor.Meteor;
    "undefined" == typeof Package && (Package = {}), Package.autopublish = {}
}(),
function() {
    Package.meteor.Meteor;
    "undefined" == typeof Package && (Package = {}), Package.insecure = {}
}(),
function() {
    {
        var e, t;
        Package.meteor.Meteor
    }(function() {
        ! function(e, t) {
            "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
                if (!e.document) throw new Error("jQuery requires a window with a document");
                return t(e)
            } : t(e)
        }("undefined" != typeof window ? window : this, function(e, t) {
            function r(e) {
                var t = e.length,
                    r = at.type(e);
                return "function" === r || at.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === r || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
            }

            function n(e, t, r) {
                if (at.isFunction(t)) return at.grep(e, function(e, n) {
                    return !!t.call(e, n, e) !== r
                });
                if (t.nodeType) return at.grep(e, function(e) {
                    return e === t !== r
                });
                if ("string" == typeof t) {
                    if (ht.test(t)) return at.filter(t, e, r);
                    t = at.filter(t, e)
                }
                return at.grep(e, function(e) {
                    return at.inArray(e, t) >= 0 !== r
                })
            }

            function o(e, t) {
                do e = e[t]; while (e && 1 !== e.nodeType);
                return e
            }

            function a(e) {
                var t = At[e] = {};
                return at.each(e.match(bt) || [], function(e, r) {
                    t[r] = !0
                }), t
            }

            function c() {
                gt.addEventListener ? (gt.removeEventListener("DOMContentLoaded", s, !1), e.removeEventListener("load", s, !1)) : (gt.detachEvent("onreadystatechange", s), e.detachEvent("onload", s))
            }

            function s() {
                (gt.addEventListener || "load" === event.type || "complete" === gt.readyState) && (c(), at.ready())
            }

            function i(e, t, r) {
                if (void 0 === r && 1 === e.nodeType) {
                    var n = "data-" + t.replace(Dt, "-$1").toLowerCase();
                    if (r = e.getAttribute(n), "string" == typeof r) {
                        try {
                            r = "true" === r ? !0 : "false" === r ? !1 : "null" === r ? null : +r + "" === r ? +r : xt.test(r) ? at.parseJSON(r) : r
                        } catch (o) {}
                        at.data(e, t, r)
                    } else r = void 0
                }
                return r
            }

            function u(e) {
                var t;
                for (t in e)
                    if (("data" !== t || !at.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
                return !0
            }

            function d(e, t, r, n) {
                if (at.acceptData(e)) {
                    var o, a, c = at.expando,
                        s = e.nodeType,
                        i = s ? at.cache : e,
                        u = s ? e[c] : e[c] && c;
                    if (u && i[u] && (n || i[u].data) || void 0 !== r || "string" != typeof t) return u || (u = s ? e[c] = G.pop() || at.guid++ : c), i[u] || (i[u] = s ? {} : {
                        toJSON: at.noop
                    }), ("object" == typeof t || "function" == typeof t) && (n ? i[u] = at.extend(i[u], t) : i[u].data = at.extend(i[u].data, t)), a = i[u], n || (a.data || (a.data = {}), a = a.data), void 0 !== r && (a[at.camelCase(t)] = r), "string" == typeof t ? (o = a[t], null == o && (o = a[at.camelCase(t)])) : o = a, o
                }
            }

            function p(e, t, r) {
                if (at.acceptData(e)) {
                    var n, o, a = e.nodeType,
                        c = a ? at.cache : e,
                        s = a ? e[at.expando] : at.expando;
                    if (c[s]) {
                        if (t && (n = r ? c[s] : c[s].data)) {
                            at.isArray(t) ? t = t.concat(at.map(t, at.camelCase)) : t in n ? t = [t] : (t = at.camelCase(t), t = t in n ? [t] : t.split(" ")), o = t.length;
                            for (; o--;) delete n[t[o]];
                            if (r ? !u(n) : !at.isEmptyObject(n)) return
                        }(r || (delete c[s].data, u(c[s]))) && (a ? at.cleanData([e], !0) : nt.deleteExpando || c != c.window ? delete c[s] : c[s] = null)
                    }
                }
            }

            function l() {
                return !0
            }

            function h() {
                return !1
            }

            function f() {
                try {
                    return gt.activeElement
                } catch (e) {}
            }

            function g(e) {
                var t = Mt.split("|"),
                    r = e.createDocumentFragment();
                if (r.createElement)
                    for (; t.length;) r.createElement(t.pop());
                return r
            }

            function m(e, t) {
                var r, n, o = 0,
                    a = typeof e.getElementsByTagName !== _t ? e.getElementsByTagName(t || "*") : typeof e.querySelectorAll !== _t ? e.querySelectorAll(t || "*") : void 0;
                if (!a)
                    for (a = [], r = e.childNodes || e; null != (n = r[o]); o++) !t || at.nodeName(n, t) ? a.push(n) : at.merge(a, m(n, t));
                return void 0 === t || t && at.nodeName(e, t) ? at.merge([e], a) : a
            }

            function v(e) {
                St.test(e.type) && (e.defaultChecked = e.checked)
            }

            function y(e, t) {
                return at.nodeName(e, "table") && at.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
            }

            function E(e) {
                return e.type = (null !== at.find.attr(e, "type")) + "/" + e.type, e
            }

            function b(e) {
                var t = Gt.exec(e.type);
                return t ? e.type = t[1] : e.removeAttribute("type"), e
            }

            function A(e, t) {
                for (var r, n = 0; null != (r = e[n]); n++) at._data(r, "globalEval", !t || at._data(t[n], "globalEval"))
            }

            function C(e, t) {
                if (1 === t.nodeType && at.hasData(e)) {
                    var r, n, o, a = at._data(e),
                        c = at._data(t, a),
                        s = a.events;
                    if (s) {
                        delete c.handle, c.events = {};
                        for (r in s)
                            for (n = 0, o = s[r].length; o > n; n++) at.event.add(t, r, s[r][n])
                    }
                    c.data && (c.data = at.extend({}, c.data))
                }
            }

            function w(e, t) {
                var r, n, o;
                if (1 === t.nodeType) {
                    if (r = t.nodeName.toLowerCase(), !nt.noCloneEvent && t[at.expando]) {
                        o = at._data(t);
                        for (n in o.events) at.removeEvent(t, n, o.handle);
                        t.removeAttribute(at.expando)
                    }
                    "script" === r && t.text !== e.text ? (E(t).text = e.text, b(t)) : "object" === r ? (t.parentNode && (t.outerHTML = e.outerHTML), nt.html5Clone && e.innerHTML && !at.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === r && St.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === r ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === r || "textarea" === r) && (t.defaultValue = e.defaultValue)
                }
            }

            function _(t, r) {
                var n = at(r.createElement(t)).appendTo(r.body),
                    o = e.getDefaultComputedStyle ? e.getDefaultComputedStyle(n[0]).display : at.css(n[0], "display");
                return n.detach(), o
            }

            function x(e) {
                var t = gt,
                    r = er[e];
                return r || (r = _(e, t), "none" !== r && r || (Zt = (Zt || at("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = (Zt[0].contentWindow || Zt[0].contentDocument).document, t.write(), t.close(), r = _(e, t), Zt.detach()), er[e] = r), r
            }

            function D(e, t) {
                return {
                    get: function() {
                        var r = e();
                        if (null != r) return r ? void delete this.get : (this.get = t).apply(this, arguments)
                    }
                }
            }

            function T(e, t) {
                if (t in e) return t;
                for (var r = t.charAt(0).toUpperCase() + t.slice(1), n = t, o = hr.length; o--;)
                    if (t = hr[o] + r, t in e) return t;
                return n
            }

            function k(e, t) {
                for (var r, n, o, a = [], c = 0, s = e.length; s > c; c++) n = e[c], n.style && (a[c] = at._data(n, "olddisplay"), r = n.style.display, t ? (a[c] || "none" !== r || (n.style.display = ""), "" === n.style.display && Bt(n) && (a[c] = at._data(n, "olddisplay", x(n.nodeName)))) : a[c] || (o = Bt(n), (r && "none" !== r || !o) && at._data(n, "olddisplay", o ? r : at.css(n, "display"))));
                for (c = 0; s > c; c++) n = e[c], n.style && (t && "none" !== n.style.display && "" !== n.style.display || (n.style.display = t ? a[c] || "" : "none"));
                return e
            }

            function B(e, t, r) {
                var n = ur.exec(t);
                return n ? Math.max(0, n[1] - (r || 0)) + (n[2] || "px") : t
            }

            function F(e, t, r, n, o) {
                for (var a = r === (n ? "border" : "content") ? 4 : "width" === t ? 1 : 0, c = 0; 4 > a; a += 2) "margin" === r && (c += at.css(e, r + kt[a], !0, o)), n ? ("content" === r && (c -= at.css(e, "padding" + kt[a], !0, o)), "margin" !== r && (c -= at.css(e, "border" + kt[a] + "Width", !0, o))) : (c += at.css(e, "padding" + kt[a], !0, o), "padding" !== r && (c += at.css(e, "border" + kt[a] + "Width", !0, o)));
                return c
            }

            function S(e, t, r) {
                var n = !0,
                    o = "width" === t ? e.offsetWidth : e.offsetHeight,
                    a = tr(e),
                    c = nt.boxSizing() && "border-box" === at.css(e, "boxSizing", !1, a);
                if (0 >= o || null == o) {
                    if (o = rr(e, t, a), (0 > o || null == o) && (o = e.style[t]), or.test(o)) return o;
                    n = c && (nt.boxSizingReliable() || o === e.style[t]), o = parseFloat(o) || 0
                }
                return o + F(e, t, r || (c ? "border" : "content"), n, a) + "px"
            }

            function N(e, t, r, n, o) {
                return new N.prototype.init(e, t, r, n, o)
            }

            function O() {
                return setTimeout(function() {
                    fr = void 0
                }), fr = at.now()
            }

            function I(e, t) {
                var r, n = {
                        height: e
                    },
                    o = 0;
                for (t = t ? 1 : 0; 4 > o; o += 2 - t) r = kt[o], n["margin" + r] = n["padding" + r] = e;
                return t && (n.opacity = n.width = e), n
            }

            function L(e, t, r) {
                for (var n, o = (br[t] || []).concat(br["*"]), a = 0, c = o.length; c > a; a++)
                    if (n = o[a].call(r, t, e)) return n
            }

            function q(e, t, r) {
                var n, o, a, c, s, i, u, d, p = this,
                    l = {},
                    h = e.style,
                    f = e.nodeType && Bt(e),
                    g = at._data(e, "fxshow");
                r.queue || (s = at._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, i = s.empty.fire, s.empty.fire = function() {
                    s.unqueued || i()
                }), s.unqueued++, p.always(function() {
                    p.always(function() {
                        s.unqueued--, at.queue(e, "fx").length || s.empty.fire()
                    })
                })), 1 === e.nodeType && ("height" in t || "width" in t) && (r.overflow = [h.overflow, h.overflowX, h.overflowY], u = at.css(e, "display"), d = x(e.nodeName), "none" === u && (u = d), "inline" === u && "none" === at.css(e, "float") && (nt.inlineBlockNeedsLayout && "inline" !== d ? h.zoom = 1 : h.display = "inline-block")), r.overflow && (h.overflow = "hidden", nt.shrinkWrapBlocks() || p.always(function() {
                    h.overflow = r.overflow[0], h.overflowX = r.overflow[1], h.overflowY = r.overflow[2]
                }));
                for (n in t)
                    if (o = t[n], mr.exec(o)) {
                        if (delete t[n], a = a || "toggle" === o, o === (f ? "hide" : "show")) {
                            if ("show" !== o || !g || void 0 === g[n]) continue;
                            f = !0
                        }
                        l[n] = g && g[n] || at.style(e, n)
                    }
                if (!at.isEmptyObject(l)) {
                    g ? "hidden" in g && (f = g.hidden) : g = at._data(e, "fxshow", {}), a && (g.hidden = !f), f ? at(e).show() : p.done(function() {
                        at(e).hide()
                    }), p.done(function() {
                        var t;
                        at._removeData(e, "fxshow");
                        for (t in l) at.style(e, t, l[t])
                    });
                    for (n in l) c = L(f ? g[n] : 0, n, p), n in g || (g[n] = c.start, f && (c.end = c.start, c.start = "width" === n || "height" === n ? 1 : 0))
                }
            }

            function M(e, t) {
                var r, n, o, a, c;
                for (r in e)
                    if (n = at.camelCase(r), o = t[n], a = e[r], at.isArray(a) && (o = a[1], a = e[r] = a[0]), r !== n && (e[n] = a, delete e[r]), c = at.cssHooks[n], c && "expand" in c) {
                        a = c.expand(a), delete e[n];
                        for (r in a) r in e || (e[r] = a[r], t[r] = o)
                    } else t[n] = o
            }

            function P(e, t, r) {
                var n, o, a = 0,
                    c = Er.length,
                    s = at.Deferred().always(function() {
                        delete i.elem
                    }),
                    i = function() {
                        if (o) return !1;
                        for (var t = fr || O(), r = Math.max(0, u.startTime + u.duration - t), n = r / u.duration || 0, a = 1 - n, c = 0, i = u.tweens.length; i > c; c++) u.tweens[c].run(a);
                        return s.notifyWith(e, [u, a, r]), 1 > a && i ? r : (s.resolveWith(e, [u]), !1)
                    },
                    u = s.promise({
                        elem: e,
                        props: at.extend({}, t),
                        opts: at.extend(!0, {
                            specialEasing: {}
                        }, r),
                        originalProperties: t,
                        originalOptions: r,
                        startTime: fr || O(),
                        duration: r.duration,
                        tweens: [],
                        createTween: function(t, r) {
                            var n = at.Tween(e, u.opts, t, r, u.opts.specialEasing[t] || u.opts.easing);
                            return u.tweens.push(n), n
                        },
                        stop: function(t) {
                            var r = 0,
                                n = t ? u.tweens.length : 0;
                            if (o) return this;
                            for (o = !0; n > r; r++) u.tweens[r].run(1);
                            return t ? s.resolveWith(e, [u, t]) : s.rejectWith(e, [u, t]), this
                        }
                    }),
                    d = u.props;
                for (M(d, u.opts.specialEasing); c > a; a++)
                    if (n = Er[a].call(u, e, d, u.opts)) return n;
                return at.map(d, L, u), at.isFunction(u.opts.start) && u.opts.start.call(e, u), at.fx.timer(at.extend(i, {
                    elem: e,
                    anim: u,
                    queue: u.opts.queue
                })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
            }

            function j(e) {
                return function(t, r) {
                    "string" != typeof t && (r = t, t = "*");
                    var n, o = 0,
                        a = t.toLowerCase().match(bt) || [];
                    if (at.isFunction(r))
                        for (; n = a[o++];) "+" === n.charAt(0) ? (n = n.slice(1) || "*", (e[n] = e[n] || []).unshift(r)) : (e[n] = e[n] || []).push(r)
                }
            }

            function R(e, t, r, n) {
                function o(s) {
                    var i;
                    return a[s] = !0, at.each(e[s] || [], function(e, s) {
                        var u = s(t, r, n);
                        return "string" != typeof u || c || a[u] ? c ? !(i = u) : void 0 : (t.dataTypes.unshift(u), o(u), !1)
                    }), i
                }
                var a = {},
                    c = e === Vr;
                return o(t.dataTypes[0]) || !a["*"] && o("*")
            }

            function $(e, t) {
                var r, n, o = at.ajaxSettings.flatOptions || {};
                for (n in t) void 0 !== t[n] && ((o[n] ? e : r || (r = {}))[n] = t[n]);
                return r && at.extend(!0, e, r), e
            }

            function H(e, t, r) {
                for (var n, o, a, c, s = e.contents, i = e.dataTypes;
                    "*" === i[0];) i.shift(), void 0 === o && (o = e.mimeType || t.getResponseHeader("Content-Type"));
                if (o)
                    for (c in s)
                        if (s[c] && s[c].test(o)) {
                            i.unshift(c);
                            break
                        }
                if (i[0] in r) a = i[0];
                else {
                    for (c in r) {
                        if (!i[0] || e.converters[c + " " + i[0]]) {
                            a = c;
                            break
                        }
                        n || (n = c)
                    }
                    a = a || n
                }
                return a ? (a !== i[0] && i.unshift(a), r[a]) : void 0
            }

            function U(e, t, r, n) {
                var o, a, c, s, i, u = {},
                    d = e.dataTypes.slice();
                if (d[1])
                    for (c in e.converters) u[c.toLowerCase()] = e.converters[c];
                for (a = d.shift(); a;)
                    if (e.responseFields[a] && (r[e.responseFields[a]] = t), !i && n && e.dataFilter && (t = e.dataFilter(t, e.dataType)), i = a, a = d.shift())
                        if ("*" === a) a = i;
                        else if ("*" !== i && i !== a) {
                    if (c = u[i + " " + a] || u["* " + a], !c)
                        for (o in u)
                            if (s = o.split(" "), s[1] === a && (c = u[i + " " + s[0]] || u["* " + s[0]])) {
                                c === !0 ? c = u[o] : u[o] !== !0 && (a = s[0], d.unshift(s[1]));
                                break
                            }
                    if (c !== !0)
                        if (c && e["throws"]) t = c(t);
                        else try {
                            t = c(t)
                        } catch (p) {
                            return {
                                state: "parsererror",
                                error: c ? p : "No conversion from " + i + " to " + a
                            }
                        }
                }
                return {
                    state: "success",
                    data: t
                }
            }

            function V(e, t, r, n) {
                var o;
                if (at.isArray(t)) at.each(t, function(t, o) {
                    r || Gr.test(e) ? n(e, o) : V(e + "[" + ("object" == typeof o ? t : "") + "]", o, r, n)
                });
                else if (r || "object" !== at.type(t)) n(e, t);
                else
                    for (o in t) V(e + "[" + o + "]", t[o], r, n)
            }

            function z() {
                try {
                    return new e.XMLHttpRequest
                } catch (t) {}
            }

            function J() {
                try {
                    return new e.ActiveXObject("Microsoft.XMLHTTP")
                } catch (t) {}
            }

            function W(e) {
                return at.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
            }
            var G = [],
                X = G.slice,
                K = G.concat,
                Q = G.push,
                Y = G.indexOf,
                Z = {},
                et = Z.toString,
                tt = Z.hasOwnProperty,
                rt = "".trim,
                nt = {},
                ot = "1.11.0",
                at = function(e, t) {
                    return new at.fn.init(e, t)
                },
                ct = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
                st = /^-ms-/,
                it = /-([\da-z])/gi,
                ut = function(e, t) {
                    return t.toUpperCase()
                };
            at.fn = at.prototype = {
                jquery: ot,
                constructor: at,
                selector: "",
                length: 0,
                toArray: function() {
                    return X.call(this)
                },
                get: function(e) {
                    return null != e ? 0 > e ? this[e + this.length] : this[e] : X.call(this)
                },
                pushStack: function(e) {
                    var t = at.merge(this.constructor(), e);
                    return t.prevObject = this, t.context = this.context, t
                },
                each: function(e, t) {
                    return at.each(this, e, t)
                },
                map: function(e) {
                    return this.pushStack(at.map(this, function(t, r) {
                        return e.call(t, r, t)
                    }))
                },
                slice: function() {
                    return this.pushStack(X.apply(this, arguments))
                },
                first: function() {
                    return this.eq(0)
                },
                last: function() {
                    return this.eq(-1)
                },
                eq: function(e) {
                    var t = this.length,
                        r = +e + (0 > e ? t : 0);
                    return this.pushStack(r >= 0 && t > r ? [this[r]] : [])
                },
                end: function() {
                    return this.prevObject || this.constructor(null)
                },
                push: Q,
                sort: G.sort,
                splice: G.splice
            }, at.extend = at.fn.extend = function() {
                var e, t, r, n, o, a, c = arguments[0] || {},
                    s = 1,
                    i = arguments.length,
                    u = !1;
                for ("boolean" == typeof c && (u = c, c = arguments[s] || {}, s++), "object" == typeof c || at.isFunction(c) || (c = {}), s === i && (c = this, s--); i > s; s++)
                    if (null != (o = arguments[s]))
                        for (n in o) e = c[n], r = o[n], c !== r && (u && r && (at.isPlainObject(r) || (t = at.isArray(r))) ? (t ? (t = !1, a = e && at.isArray(e) ? e : []) : a = e && at.isPlainObject(e) ? e : {}, c[n] = at.extend(u, a, r)) : void 0 !== r && (c[n] = r));
                return c
            }, at.extend({
                expando: "jQuery" + (ot + Math.random()).replace(/\D/g, ""),
                isReady: !0,
                error: function(e) {
                    throw new Error(e)
                },
                noop: function() {},
                isFunction: function(e) {
                    return "function" === at.type(e)
                },
                isArray: Array.isArray || function(e) {
                    return "array" === at.type(e)
                },
                isWindow: function(e) {
                    return null != e && e == e.window
                },
                isNumeric: function(e) {
                    return e - parseFloat(e) >= 0
                },
                isEmptyObject: function(e) {
                    var t;
                    for (t in e) return !1;
                    return !0
                },
                isPlainObject: function(e) {
                    var t;
                    if (!e || "object" !== at.type(e) || e.nodeType || at.isWindow(e)) return !1;
                    try {
                        if (e.constructor && !tt.call(e, "constructor") && !tt.call(e.constructor.prototype, "isPrototypeOf")) return !1
                    } catch (r) {
                        return !1
                    }
                    if (nt.ownLast)
                        for (t in e) return tt.call(e, t);
                    for (t in e);
                    return void 0 === t || tt.call(e, t)
                },
                type: function(e) {
                    return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? Z[et.call(e)] || "object" : typeof e
                },
                globalEval: function(t) {
                    t && at.trim(t) && (e.execScript || function(t) {
                        e.eval.call(e, t)
                    })(t)
                },
                camelCase: function(e) {
                    return e.replace(st, "ms-").replace(it, ut)
                },
                nodeName: function(e, t) {
                    return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
                },
                each: function(e, t, n) {
                    var o, a = 0,
                        c = e.length,
                        s = r(e);
                    if (n) {
                        if (s)
                            for (; c > a && (o = t.apply(e[a], n), o !== !1); a++);
                        else
                            for (a in e)
                                if (o = t.apply(e[a], n), o === !1) break
                    } else if (s)
                        for (; c > a && (o = t.call(e[a], a, e[a]), o !== !1); a++);
                    else
                        for (a in e)
                            if (o = t.call(e[a], a, e[a]), o === !1) break; return e
                },
                trim: rt && !rt.call("﻿ ") ? function(e) {
                    return null == e ? "" : rt.call(e)
                } : function(e) {
                    return null == e ? "" : (e + "").replace(ct, "")
                },
                makeArray: function(e, t) {
                    var n = t || [];
                    return null != e && (r(Object(e)) ? at.merge(n, "string" == typeof e ? [e] : e) : Q.call(n, e)), n
                },
                inArray: function(e, t, r) {
                    var n;
                    if (t) {
                        if (Y) return Y.call(t, e, r);
                        for (n = t.length, r = r ? 0 > r ? Math.max(0, n + r) : r : 0; n > r; r++)
                            if (r in t && t[r] === e) return r
                    }
                    return -1
                },
                merge: function(e, t) {
                    for (var r = +t.length, n = 0, o = e.length; r > n;) e[o++] = t[n++];
                    if (r !== r)
                        for (; void 0 !== t[n];) e[o++] = t[n++];
                    return e.length = o, e
                },
                grep: function(e, t, r) {
                    for (var n, o = [], a = 0, c = e.length, s = !r; c > a; a++) n = !t(e[a], a), n !== s && o.push(e[a]);
                    return o
                },
                map: function(e, t, n) {
                    var o, a = 0,
                        c = e.length,
                        s = r(e),
                        i = [];
                    if (s)
                        for (; c > a; a++) o = t(e[a], a, n), null != o && i.push(o);
                    else
                        for (a in e) o = t(e[a], a, n), null != o && i.push(o);
                    return K.apply([], i)
                },
                guid: 1,
                proxy: function(e, t) {
                    var r, n, o;
                    return "string" == typeof t && (o = e[t], t = e, e = o), at.isFunction(e) ? (r = X.call(arguments, 2), n = function() {
                        return e.apply(t || this, r.concat(X.call(arguments)))
                    }, n.guid = e.guid = e.guid || at.guid++, n) : void 0
                },
                now: function() {
                    return +new Date
                },
                support: nt
            }), at.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
                Z["[object " + t + "]"] = t.toLowerCase()
            });
            var dt = function(e) {
                function t(e, t, r, n) {
                    var o, a, c, s, i, u, p, f, g, m;
                    if ((t ? t.ownerDocument || t : R) !== N && S(t), t = t || N, r = r || [], !e || "string" != typeof e) return r;
                    if (1 !== (s = t.nodeType) && 9 !== s) return [];
                    if (I && !n) {
                        if (o = yt.exec(e))
                            if (c = o[1]) {
                                if (9 === s) {
                                    if (a = t.getElementById(c), !a || !a.parentNode) return r;
                                    if (a.id === c) return r.push(a), r
                                } else if (t.ownerDocument && (a = t.ownerDocument.getElementById(c)) && P(t, a) && a.id === c) return r.push(a), r
                            } else {
                                if (o[2]) return Z.apply(r, t.getElementsByTagName(e)), r;
                                if ((c = o[3]) && w.getElementsByClassName && t.getElementsByClassName) return Z.apply(r, t.getElementsByClassName(c)), r
                            }
                        if (w.qsa && (!L || !L.test(e))) {
                            if (f = p = j, g = t, m = 9 === s && e, 1 === s && "object" !== t.nodeName.toLowerCase()) {
                                for (u = l(e), (p = t.getAttribute("id")) ? f = p.replace(bt, "\\$&") : t.setAttribute("id", f), f = "[id='" + f + "'] ", i = u.length; i--;) u[i] = f + h(u[i]);
                                g = Et.test(e) && d(t.parentNode) || t, m = u.join(",")
                            }
                            if (m) try {
                                return Z.apply(r, g.querySelectorAll(m)), r
                            } catch (v) {} finally {
                                p || t.removeAttribute("id")
                            }
                        }
                    }
                    return A(e.replace(it, "$1"), t, r, n)
                }

                function r() {
                    function e(r, n) {
                        return t.push(r + " ") > _.cacheLength && delete e[t.shift()], e[r + " "] = n
                    }
                    var t = [];
                    return e
                }

                function n(e) {
                    return e[j] = !0, e
                }

                function o(e) {
                    var t = N.createElement("div");
                    try {
                        return !!e(t)
                    } catch (r) {
                        return !1
                    } finally {
                        t.parentNode && t.parentNode.removeChild(t), t = null
                    }
                }

                function a(e, t) {
                    for (var r = e.split("|"), n = e.length; n--;) _.attrHandle[r[n]] = t
                }

                function c(e, t) {
                    var r = t && e,
                        n = r && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || G) - (~e.sourceIndex || G);
                    if (n) return n;
                    if (r)
                        for (; r = r.nextSibling;)
                            if (r === t) return -1;
                    return e ? 1 : -1
                }

                function s(e) {
                    return function(t) {
                        var r = t.nodeName.toLowerCase();
                        return "input" === r && t.type === e
                    }
                }

                function i(e) {
                    return function(t) {
                        var r = t.nodeName.toLowerCase();
                        return ("input" === r || "button" === r) && t.type === e
                    }
                }

                function u(e) {
                    return n(function(t) {
                        return t = +t, n(function(r, n) {
                            for (var o, a = e([], r.length, t), c = a.length; c--;) r[o = a[c]] && (r[o] = !(n[o] = r[o]))
                        })
                    })
                }

                function d(e) {
                    return e && typeof e.getElementsByTagName !== W && e
                }

                function p() {}

                function l(e, r) {
                    var n, o, a, c, s, i, u, d = V[e + " "];
                    if (d) return r ? 0 : d.slice(0);
                    for (s = e, i = [], u = _.preFilter; s;) {
                        (!n || (o = ut.exec(s))) && (o && (s = s.slice(o[0].length) || s), i.push(a = [])), n = !1, (o = dt.exec(s)) && (n = o.shift(), a.push({
                            value: n,
                            type: o[0].replace(it, " ")
                        }), s = s.slice(n.length));
                        for (c in _.filter) !(o = ft[c].exec(s)) || u[c] && !(o = u[c](o)) || (n = o.shift(), a.push({
                            value: n,
                            type: c,
                            matches: o
                        }), s = s.slice(n.length));
                        if (!n) break
                    }
                    return r ? s.length : s ? t.error(e) : V(e, i).slice(0)
                }

                function h(e) {
                    for (var t = 0, r = e.length, n = ""; r > t; t++) n += e[t].value;
                    return n
                }

                function f(e, t, r) {
                    var n = t.dir,
                        o = r && "parentNode" === n,
                        a = H++;
                    return t.first ? function(t, r, a) {
                        for (; t = t[n];)
                            if (1 === t.nodeType || o) return e(t, r, a)
                    } : function(t, r, c) {
                        var s, i, u = [$, a];
                        if (c) {
                            for (; t = t[n];)
                                if ((1 === t.nodeType || o) && e(t, r, c)) return !0
                        } else
                            for (; t = t[n];)
                                if (1 === t.nodeType || o) {
                                    if (i = t[j] || (t[j] = {}), (s = i[n]) && s[0] === $ && s[1] === a) return u[2] = s[2];
                                    if (i[n] = u, u[2] = e(t, r, c)) return !0
                                }
                    }
                }

                function g(e) {
                    return e.length > 1 ? function(t, r, n) {
                        for (var o = e.length; o--;)
                            if (!e[o](t, r, n)) return !1;
                        return !0
                    } : e[0]
                }

                function m(e, t, r, n, o) {
                    for (var a, c = [], s = 0, i = e.length, u = null != t; i > s; s++)(a = e[s]) && (!r || r(a, n, o)) && (c.push(a), u && t.push(s));
                    return c
                }

                function v(e, t, r, o, a, c) {
                    return o && !o[j] && (o = v(o)), a && !a[j] && (a = v(a, c)), n(function(n, c, s, i) {
                        var u, d, p, l = [],
                            h = [],
                            f = c.length,
                            g = n || b(t || "*", s.nodeType ? [s] : s, []),
                            v = !e || !n && t ? g : m(g, l, e, s, i),
                            y = r ? a || (n ? e : f || o) ? [] : c : v;
                        if (r && r(v, y, s, i), o)
                            for (u = m(y, h), o(u, [], s, i), d = u.length; d--;)(p = u[d]) && (y[h[d]] = !(v[h[d]] = p));
                        if (n) {
                            if (a || e) {
                                if (a) {
                                    for (u = [], d = y.length; d--;)(p = y[d]) && u.push(v[d] = p);
                                    a(null, y = [], u, i)
                                }
                                for (d = y.length; d--;)(p = y[d]) && (u = a ? tt.call(n, p) : l[d]) > -1 && (n[u] = !(c[u] = p))
                            }
                        } else y = m(y === c ? y.splice(f, y.length) : y), a ? a(null, c, y, i) : Z.apply(c, y)
                    })
                }

                function y(e) {
                    for (var t, r, n, o = e.length, a = _.relative[e[0].type], c = a || _.relative[" "], s = a ? 1 : 0, i = f(function(e) {
                            return e === t
                        }, c, !0), u = f(function(e) {
                            return tt.call(t, e) > -1
                        }, c, !0), d = [function(e, r, n) {
                            return !a && (n || r !== k) || ((t = r).nodeType ? i(e, r, n) : u(e, r, n))
                        }]; o > s; s++)
                        if (r = _.relative[e[s].type]) d = [f(g(d), r)];
                        else {
                            if (r = _.filter[e[s].type].apply(null, e[s].matches), r[j]) {
                                for (n = ++s; o > n && !_.relative[e[n].type]; n++);
                                return v(s > 1 && g(d), s > 1 && h(e.slice(0, s - 1).concat({
                                    value: " " === e[s - 2].type ? "*" : ""
                                })).replace(it, "$1"), r, n > s && y(e.slice(s, n)), o > n && y(e = e.slice(n)), o > n && h(e))
                            }
                            d.push(r)
                        }
                    return g(d)
                }

                function E(e, r) {
                    var o = r.length > 0,
                        a = e.length > 0,
                        c = function(n, c, s, i, u) {
                            var d, p, l, h = 0,
                                f = "0",
                                g = n && [],
                                v = [],
                                y = k,
                                E = n || a && _.find.TAG("*", u),
                                b = $ += null == y ? 1 : Math.random() || .1,
                                A = E.length;
                            for (u && (k = c !== N && c); f !== A && null != (d = E[f]); f++) {
                                if (a && d) {
                                    for (p = 0; l = e[p++];)
                                        if (l(d, c, s)) {
                                            i.push(d);
                                            break
                                        }
                                    u && ($ = b)
                                }
                                o && ((d = !l && d) && h--, n && g.push(d))
                            }
                            if (h += f, o && f !== h) {
                                for (p = 0; l = r[p++];) l(g, v, c, s);
                                if (n) {
                                    if (h > 0)
                                        for (; f--;) g[f] || v[f] || (v[f] = Q.call(i));
                                    v = m(v)
                                }
                                Z.apply(i, v), u && !n && v.length > 0 && h + r.length > 1 && t.uniqueSort(i)
                            }
                            return u && ($ = b, k = y), g
                        };
                    return o ? n(c) : c
                }

                function b(e, r, n) {
                    for (var o = 0, a = r.length; a > o; o++) t(e, r[o], n);
                    return n
                }

                function A(e, t, r, n) {
                    var o, a, c, s, i, u = l(e);
                    if (!n && 1 === u.length) {
                        if (a = u[0] = u[0].slice(0), a.length > 2 && "ID" === (c = a[0]).type && w.getById && 9 === t.nodeType && I && _.relative[a[1].type]) {
                            if (t = (_.find.ID(c.matches[0].replace(At, Ct), t) || [])[0], !t) return r;
                            e = e.slice(a.shift().value.length)
                        }
                        for (o = ft.needsContext.test(e) ? 0 : a.length; o-- && (c = a[o], !_.relative[s = c.type]);)
                            if ((i = _.find[s]) && (n = i(c.matches[0].replace(At, Ct), Et.test(a[0].type) && d(t.parentNode) || t))) {
                                if (a.splice(o, 1), e = n.length && h(a), !e) return Z.apply(r, n), r;
                                break
                            }
                    }
                    return T(e, u)(n, t, !I, r, Et.test(e) && d(t.parentNode) || t), r
                }
                var C, w, _, x, D, T, k, B, F, S, N, O, I, L, q, M, P, j = "sizzle" + -new Date,
                    R = e.document,
                    $ = 0,
                    H = 0,
                    U = r(),
                    V = r(),
                    z = r(),
                    J = function(e, t) {
                        return e === t && (F = !0), 0
                    },
                    W = "undefined",
                    G = 1 << 31,
                    X = {}.hasOwnProperty,
                    K = [],
                    Q = K.pop,
                    Y = K.push,
                    Z = K.push,
                    et = K.slice,
                    tt = K.indexOf || function(e) {
                        for (var t = 0, r = this.length; r > t; t++)
                            if (this[t] === e) return t;
                        return -1
                    },
                    rt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                    nt = "[\\x20\\t\\r\\n\\f]",
                    ot = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                    at = ot.replace("w", "w#"),
                    ct = "\\[" + nt + "*(" + ot + ")" + nt + "*(?:([*^$|!~]?=)" + nt + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + at + ")|)|)" + nt + "*\\]",
                    st = ":(" + ot + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + ct.replace(3, 8) + ")*)|.*)\\)|)",
                    it = new RegExp("^" + nt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + nt + "+$", "g"),
                    ut = new RegExp("^" + nt + "*," + nt + "*"),
                    dt = new RegExp("^" + nt + "*([>+~]|" + nt + ")" + nt + "*"),
                    pt = new RegExp("=" + nt + "*([^\\]'\"]*?)" + nt + "*\\]", "g"),
                    lt = new RegExp(st),
                    ht = new RegExp("^" + at + "$"),
                    ft = {
                        ID: new RegExp("^#(" + ot + ")"),
                        CLASS: new RegExp("^\\.(" + ot + ")"),
                        TAG: new RegExp("^(" + ot.replace("w", "w*") + ")"),
                        ATTR: new RegExp("^" + ct),
                        PSEUDO: new RegExp("^" + st),
                        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + nt + "*(even|odd|(([+-]|)(\\d*)n|)" + nt + "*(?:([+-]|)" + nt + "*(\\d+)|))" + nt + "*\\)|)", "i"),
                        bool: new RegExp("^(?:" + rt + ")$", "i"),
                        needsContext: new RegExp("^" + nt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + nt + "*((?:-\\d)?\\d*)" + nt + "*\\)|)(?=[^-]|$)", "i")
                    },
                    gt = /^(?:input|select|textarea|button)$/i,
                    mt = /^h\d$/i,
                    vt = /^[^{]+\{\s*\[native \w/,
                    yt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                    Et = /[+~]/,
                    bt = /'|\\/g,
                    At = new RegExp("\\\\([\\da-f]{1,6}" + nt + "?|(" + nt + ")|.)", "ig"),
                    Ct = function(e, t, r) {
                        var n = "0x" + t - 65536;
                        return n !== n || r ? t : 0 > n ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320)
                    };
                try {
                    Z.apply(K = et.call(R.childNodes), R.childNodes), K[R.childNodes.length].nodeType
                } catch (wt) {
                    Z = {
                        apply: K.length ? function(e, t) {
                            Y.apply(e, et.call(t))
                        } : function(e, t) {
                            for (var r = e.length, n = 0; e[r++] = t[n++];);
                            e.length = r - 1
                        }
                    }
                }
                w = t.support = {}, D = t.isXML = function(e) {
                    var t = e && (e.ownerDocument || e).documentElement;
                    return t ? "HTML" !== t.nodeName : !1
                }, S = t.setDocument = function(e) {
                    var t, r = e ? e.ownerDocument || e : R,
                        n = r.defaultView;
                    return r !== N && 9 === r.nodeType && r.documentElement ? (N = r, O = r.documentElement, I = !D(r), n && n !== n.top && (n.addEventListener ? n.addEventListener("unload", function() {
                        S()
                    }, !1) : n.attachEvent && n.attachEvent("onunload", function() {
                        S()
                    })), w.attributes = o(function(e) {
                        return e.className = "i", !e.getAttribute("className")
                    }), w.getElementsByTagName = o(function(e) {
                        return e.appendChild(r.createComment("")), !e.getElementsByTagName("*").length
                    }), w.getElementsByClassName = vt.test(r.getElementsByClassName) && o(function(e) {
                        return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length
                    }), w.getById = o(function(e) {
                        return O.appendChild(e).id = j, !r.getElementsByName || !r.getElementsByName(j).length
                    }), w.getById ? (_.find.ID = function(e, t) {
                        if (typeof t.getElementById !== W && I) {
                            var r = t.getElementById(e);
                            return r && r.parentNode ? [r] : []
                        }
                    }, _.filter.ID = function(e) {
                        var t = e.replace(At, Ct);
                        return function(e) {
                            return e.getAttribute("id") === t
                        }
                    }) : (delete _.find.ID, _.filter.ID = function(e) {
                        var t = e.replace(At, Ct);
                        return function(e) {
                            var r = typeof e.getAttributeNode !== W && e.getAttributeNode("id");
                            return r && r.value === t
                        }
                    }), _.find.TAG = w.getElementsByTagName ? function(e, t) {
                        return typeof t.getElementsByTagName !== W ? t.getElementsByTagName(e) : void 0
                    } : function(e, t) {
                        var r, n = [],
                            o = 0,
                            a = t.getElementsByTagName(e);
                        if ("*" === e) {
                            for (; r = a[o++];) 1 === r.nodeType && n.push(r);
                            return n
                        }
                        return a
                    }, _.find.CLASS = w.getElementsByClassName && function(e, t) {
                        return typeof t.getElementsByClassName !== W && I ? t.getElementsByClassName(e) : void 0
                    }, q = [], L = [], (w.qsa = vt.test(r.querySelectorAll)) && (o(function(e) {
                        e.innerHTML = "<select t=''><option selected=''></option></select>", e.querySelectorAll("[t^='']").length && L.push("[*^$]=" + nt + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || L.push("\\[" + nt + "*(?:value|" + rt + ")"), e.querySelectorAll(":checked").length || L.push(":checked")
                    }), o(function(e) {
                        var t = r.createElement("input");
                        t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && L.push("name" + nt + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || L.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), L.push(",.*:")
                    })), (w.matchesSelector = vt.test(M = O.webkitMatchesSelector || O.mozMatchesSelector || O.oMatchesSelector || O.msMatchesSelector)) && o(function(e) {
                        w.disconnectedMatch = M.call(e, "div"), M.call(e, "[s!='']:x"), q.push("!=", st)
                    }), L = L.length && new RegExp(L.join("|")), q = q.length && new RegExp(q.join("|")), t = vt.test(O.compareDocumentPosition), P = t || vt.test(O.contains) ? function(e, t) {
                        var r = 9 === e.nodeType ? e.documentElement : e,
                            n = t && t.parentNode;
                        return e === n || !(!n || 1 !== n.nodeType || !(r.contains ? r.contains(n) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(n)))
                    } : function(e, t) {
                        if (t)
                            for (; t = t.parentNode;)
                                if (t === e) return !0;
                        return !1
                    }, J = t ? function(e, t) {
                        if (e === t) return F = !0, 0;
                        var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                        return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & n || !w.sortDetached && t.compareDocumentPosition(e) === n ? e === r || e.ownerDocument === R && P(R, e) ? -1 : t === r || t.ownerDocument === R && P(R, t) ? 1 : B ? tt.call(B, e) - tt.call(B, t) : 0 : 4 & n ? -1 : 1)
                    } : function(e, t) {
                        if (e === t) return F = !0, 0;
                        var n, o = 0,
                            a = e.parentNode,
                            s = t.parentNode,
                            i = [e],
                            u = [t];
                        if (!a || !s) return e === r ? -1 : t === r ? 1 : a ? -1 : s ? 1 : B ? tt.call(B, e) - tt.call(B, t) : 0;
                        if (a === s) return c(e, t);
                        for (n = e; n = n.parentNode;) i.unshift(n);
                        for (n = t; n = n.parentNode;) u.unshift(n);
                        for (; i[o] === u[o];) o++;
                        return o ? c(i[o], u[o]) : i[o] === R ? -1 : u[o] === R ? 1 : 0
                    }, r) : N
                }, t.matches = function(e, r) {
                    return t(e, null, null, r)
                }, t.matchesSelector = function(e, r) {
                    if ((e.ownerDocument || e) !== N && S(e), r = r.replace(pt, "='$1']"), !(!w.matchesSelector || !I || q && q.test(r) || L && L.test(r))) try {
                        var n = M.call(e, r);
                        if (n || w.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n
                    } catch (o) {}
                    return t(r, N, null, [e]).length > 0
                }, t.contains = function(e, t) {
                    return (e.ownerDocument || e) !== N && S(e), P(e, t)
                }, t.attr = function(e, t) {
                    (e.ownerDocument || e) !== N && S(e);
                    var r = _.attrHandle[t.toLowerCase()],
                        n = r && X.call(_.attrHandle, t.toLowerCase()) ? r(e, t, !I) : void 0;
                    return void 0 !== n ? n : w.attributes || !I ? e.getAttribute(t) : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
                }, t.error = function(e) {
                    throw new Error("Syntax error, unrecognized expression: " + e)
                }, t.uniqueSort = function(e) {
                    var t, r = [],
                        n = 0,
                        o = 0;
                    if (F = !w.detectDuplicates, B = !w.sortStable && e.slice(0), e.sort(J), F) {
                        for (; t = e[o++];) t === e[o] && (n = r.push(o));
                        for (; n--;) e.splice(r[n], 1)
                    }
                    return B = null, e
                }, x = t.getText = function(e) {
                    var t, r = "",
                        n = 0,
                        o = e.nodeType;
                    if (o) {
                        if (1 === o || 9 === o || 11 === o) {
                            if ("string" == typeof e.textContent) return e.textContent;
                            for (e = e.firstChild; e; e = e.nextSibling) r += x(e)
                        } else if (3 === o || 4 === o) return e.nodeValue
                    } else
                        for (; t = e[n++];) r += x(t);
                    return r
                }, _ = t.selectors = {
                    cacheLength: 50,
                    createPseudo: n,
                    match: ft,
                    attrHandle: {},
                    find: {},
                    relative: {
                        ">": {
                            dir: "parentNode",
                            first: !0
                        },
                        " ": {
                            dir: "parentNode"
                        },
                        "+": {
                            dir: "previousSibling",
                            first: !0
                        },
                        "~": {
                            dir: "previousSibling"
                        }
                    },
                    preFilter: {
                        ATTR: function(e) {
                            return e[1] = e[1].replace(At, Ct), e[3] = (e[4] || e[5] || "").replace(At, Ct), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                        },
                        CHILD: function(e) {
                            return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                        },
                        PSEUDO: function(e) {
                            var t, r = !e[5] && e[2];
                            return ft.CHILD.test(e[0]) ? null : (e[3] && void 0 !== e[4] ? e[2] = e[4] : r && lt.test(r) && (t = l(r, !0)) && (t = r.indexOf(")", r.length - t) - r.length) && (e[0] = e[0].slice(0, t), e[2] = r.slice(0, t)), e.slice(0, 3))
                        }
                    },
                    filter: {
                        TAG: function(e) {
                            var t = e.replace(At, Ct).toLowerCase();
                            return "*" === e ? function() {
                                return !0
                            } : function(e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            }
                        },
                        CLASS: function(e) {
                            var t = U[e + " "];
                            return t || (t = new RegExp("(^|" + nt + ")" + e + "(" + nt + "|$)")) && U(e, function(e) {
                                return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== W && e.getAttribute("class") || "")
                            })
                        },
                        ATTR: function(e, r, n) {
                            return function(o) {
                                var a = t.attr(o, e);
                                return null == a ? "!=" === r : r ? (a += "", "=" === r ? a === n : "!=" === r ? a !== n : "^=" === r ? n && 0 === a.indexOf(n) : "*=" === r ? n && a.indexOf(n) > -1 : "$=" === r ? n && a.slice(-n.length) === n : "~=" === r ? (" " + a + " ").indexOf(n) > -1 : "|=" === r ? a === n || a.slice(0, n.length + 1) === n + "-" : !1) : !0
                            }
                        },
                        CHILD: function(e, t, r, n, o) {
                            var a = "nth" !== e.slice(0, 3),
                                c = "last" !== e.slice(-4),
                                s = "of-type" === t;
                            return 1 === n && 0 === o ? function(e) {
                                return !!e.parentNode
                            } : function(t, r, i) {
                                var u, d, p, l, h, f, g = a !== c ? "nextSibling" : "previousSibling",
                                    m = t.parentNode,
                                    v = s && t.nodeName.toLowerCase(),
                                    y = !i && !s;
                                if (m) {
                                    if (a) {
                                        for (; g;) {
                                            for (p = t; p = p[g];)
                                                if (s ? p.nodeName.toLowerCase() === v : 1 === p.nodeType) return !1;
                                            f = g = "only" === e && !f && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (f = [c ? m.firstChild : m.lastChild], c && y) {
                                        for (d = m[j] || (m[j] = {}), u = d[e] || [], h = u[0] === $ && u[1], l = u[0] === $ && u[2], p = h && m.childNodes[h]; p = ++h && p && p[g] || (l = h = 0) || f.pop();)
                                            if (1 === p.nodeType && ++l && p === t) {
                                                d[e] = [$, h, l];
                                                break
                                            }
                                    } else if (y && (u = (t[j] || (t[j] = {}))[e]) && u[0] === $) l = u[1];
                                    else
                                        for (;
                                            (p = ++h && p && p[g] || (l = h = 0) || f.pop()) && ((s ? p.nodeName.toLowerCase() !== v : 1 !== p.nodeType) || !++l || (y && ((p[j] || (p[j] = {}))[e] = [$, l]), p !== t)););
                                    return l -= o, l === n || l % n === 0 && l / n >= 0
                                }
                            }
                        },
                        PSEUDO: function(e, r) {
                            var o, a = _.pseudos[e] || _.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                            return a[j] ? a(r) : a.length > 1 ? (o = [e, e, "", r], _.setFilters.hasOwnProperty(e.toLowerCase()) ? n(function(e, t) {
                                for (var n, o = a(e, r), c = o.length; c--;) n = tt.call(e, o[c]), e[n] = !(t[n] = o[c])
                            }) : function(e) {
                                return a(e, 0, o)
                            }) : a
                        }
                    },
                    pseudos: {
                        not: n(function(e) {
                            var t = [],
                                r = [],
                                o = T(e.replace(it, "$1"));
                            return o[j] ? n(function(e, t, r, n) {
                                for (var a, c = o(e, null, n, []), s = e.length; s--;)(a = c[s]) && (e[s] = !(t[s] = a))
                            }) : function(e, n, a) {
                                return t[0] = e, o(t, null, a, r), !r.pop()
                            }
                        }),
                        has: n(function(e) {
                            return function(r) {
                                return t(e, r).length > 0
                            }
                        }),
                        contains: n(function(e) {
                            return function(t) {
                                return (t.textContent || t.innerText || x(t)).indexOf(e) > -1
                            }
                        }),
                        lang: n(function(e) {
                            return ht.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(At, Ct).toLowerCase(),
                                function(t) {
                                    var r;
                                    do
                                        if (r = I ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return r = r.toLowerCase(), r === e || 0 === r.indexOf(e + "-");
                                    while ((t = t.parentNode) && 1 === t.nodeType);
                                    return !1
                                }
                        }),
                        target: function(t) {
                            var r = e.location && e.location.hash;
                            return r && r.slice(1) === t.id
                        },
                        root: function(e) {
                            return e === O
                        },
                        focus: function(e) {
                            return e === N.activeElement && (!N.hasFocus || N.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                        },
                        enabled: function(e) {
                            return e.disabled === !1
                        },
                        disabled: function(e) {
                            return e.disabled === !0
                        },
                        checked: function(e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && !!e.checked || "option" === t && !!e.selected
                        },
                        selected: function(e) {
                            return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                        },
                        empty: function(e) {
                            for (e = e.firstChild; e; e = e.nextSibling)
                                if (e.nodeType < 6) return !1;
                            return !0
                        },
                        parent: function(e) {
                            return !_.pseudos.empty(e)
                        },
                        header: function(e) {
                            return mt.test(e.nodeName)
                        },
                        input: function(e) {
                            return gt.test(e.nodeName)
                        },
                        button: function(e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && "button" === e.type || "button" === t
                        },
                        text: function(e) {
                            var t;
                            return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                        },
                        first: u(function() {
                            return [0]
                        }),
                        last: u(function(e, t) {
                            return [t - 1]
                        }),
                        eq: u(function(e, t, r) {
                            return [0 > r ? r + t : r]
                        }),
                        even: u(function(e, t) {
                            for (var r = 0; t > r; r += 2) e.push(r);
                            return e
                        }),
                        odd: u(function(e, t) {
                            for (var r = 1; t > r; r += 2) e.push(r);
                            return e
                        }),
                        lt: u(function(e, t, r) {
                            for (var n = 0 > r ? r + t : r; --n >= 0;) e.push(n);
                            return e
                        }),
                        gt: u(function(e, t, r) {
                            for (var n = 0 > r ? r + t : r; ++n < t;) e.push(n);
                            return e
                        })
                    }
                }, _.pseudos.nth = _.pseudos.eq;
                for (C in {
                        radio: !0,
                        checkbox: !0,
                        file: !0,
                        password: !0,
                        image: !0
                    }) _.pseudos[C] = s(C);
                for (C in {
                        submit: !0,
                        reset: !0
                    }) _.pseudos[C] = i(C);
                return p.prototype = _.filters = _.pseudos, _.setFilters = new p, T = t.compile = function(e, t) {
                    var r, n = [],
                        o = [],
                        a = z[e + " "];
                    if (!a) {
                        for (t || (t = l(e)), r = t.length; r--;) a = y(t[r]), a[j] ? n.push(a) : o.push(a);
                        a = z(e, E(o, n))
                    }
                    return a
                }, w.sortStable = j.split("").sort(J).join("") === j, w.detectDuplicates = !!F, S(), w.sortDetached = o(function(e) {
                    return 1 & e.compareDocumentPosition(N.createElement("div"))
                }), o(function(e) {
                    return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
                }) || a("type|href|height|width", function(e, t, r) {
                    return r ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
                }), w.attributes && o(function(e) {
                    return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
                }) || a("value", function(e, t, r) {
                    return r || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
                }), o(function(e) {
                    return null == e.getAttribute("disabled")
                }) || a(rt, function(e, t, r) {
                    var n;
                    return r ? void 0 : e[t] === !0 ? t.toLowerCase() : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
                }), t
            }(e);
            at.find = dt, at.expr = dt.selectors, at.expr[":"] = at.expr.pseudos, at.unique = dt.uniqueSort, at.text = dt.getText, at.isXMLDoc = dt.isXML, at.contains = dt.contains;
            var pt = at.expr.match.needsContext,
                lt = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
                ht = /^.[^:#\[\.,]*$/;
            at.filter = function(e, t, r) {
                var n = t[0];
                return r && (e = ":not(" + e + ")"), 1 === t.length && 1 === n.nodeType ? at.find.matchesSelector(n, e) ? [n] : [] : at.find.matches(e, at.grep(t, function(e) {
                    return 1 === e.nodeType
                }))
            }, at.fn.extend({
                find: function(e) {
                    var t, r = [],
                        n = this,
                        o = n.length;
                    if ("string" != typeof e) return this.pushStack(at(e).filter(function() {
                        for (t = 0; o > t; t++)
                            if (at.contains(n[t], this)) return !0
                    }));
                    for (t = 0; o > t; t++) at.find(e, n[t], r);
                    return r = this.pushStack(o > 1 ? at.unique(r) : r), r.selector = this.selector ? this.selector + " " + e : e, r
                },
                filter: function(e) {
                    return this.pushStack(n(this, e || [], !1))
                },
                not: function(e) {
                    return this.pushStack(n(this, e || [], !0))
                },
                is: function(e) {
                    return !!n(this, "string" == typeof e && pt.test(e) ? at(e) : e || [], !1).length
                }
            });
            var ft, gt = e.document,
                mt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
                vt = at.fn.init = function(e, t) {
                    var r, n;
                    if (!e) return this;
                    if ("string" == typeof e) {
                        if (r = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : mt.exec(e), !r || !r[1] && t) return !t || t.jquery ? (t || ft).find(e) : this.constructor(t).find(e);
                        if (r[1]) {
                            if (t = t instanceof at ? t[0] : t, at.merge(this, at.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : gt, !0)), lt.test(r[1]) && at.isPlainObject(t))
                                for (r in t) at.isFunction(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                            return this
                        }
                        if (n = gt.getElementById(r[2]), n && n.parentNode) {
                            if (n.id !== r[2]) return ft.find(e);
                            this.length = 1, this[0] = n
                        }
                        return this.context = gt, this.selector = e, this
                    }
                    return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : at.isFunction(e) ? "undefined" != typeof ft.ready ? ft.ready(e) : e(at) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), at.makeArray(e, this))
                };
            vt.prototype = at.fn, ft = at(gt);
            var yt = /^(?:parents|prev(?:Until|All))/,
                Et = {
                    children: !0,
                    contents: !0,
                    next: !0,
                    prev: !0
                };
            at.extend({
                dir: function(e, t, r) {
                    for (var n = [], o = e[t]; o && 9 !== o.nodeType && (void 0 === r || 1 !== o.nodeType || !at(o).is(r));) 1 === o.nodeType && n.push(o), o = o[t];
                    return n
                },
                sibling: function(e, t) {
                    for (var r = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && r.push(e);
                    return r
                }
            }), at.fn.extend({
                has: function(e) {
                    var t, r = at(e, this),
                        n = r.length;
                    return this.filter(function() {
                        for (t = 0; n > t; t++)
                            if (at.contains(this, r[t])) return !0
                    })
                },
                closest: function(e, t) {
                    for (var r, n = 0, o = this.length, a = [], c = pt.test(e) || "string" != typeof e ? at(e, t || this.context) : 0; o > n; n++)
                        for (r = this[n]; r && r !== t; r = r.parentNode)
                            if (r.nodeType < 11 && (c ? c.index(r) > -1 : 1 === r.nodeType && at.find.matchesSelector(r, e))) {
                                a.push(r);
                                break
                            }
                    return this.pushStack(a.length > 1 ? at.unique(a) : a)
                },
                index: function(e) {
                    return e ? "string" == typeof e ? at.inArray(this[0], at(e)) : at.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
                },
                add: function(e, t) {
                    return this.pushStack(at.unique(at.merge(this.get(), at(e, t))))
                },
                addBack: function(e) {
                    return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
                }
            }), at.each({
                parent: function(e) {
                    var t = e.parentNode;
                    return t && 11 !== t.nodeType ? t : null
                },
                parents: function(e) {
                    return at.dir(e, "parentNode")
                },
                parentsUntil: function(e, t, r) {
                    return at.dir(e, "parentNode", r)
                },
                next: function(e) {
                    return o(e, "nextSibling")
                },
                prev: function(e) {
                    return o(e, "previousSibling")
                },
                nextAll: function(e) {
                    return at.dir(e, "nextSibling")
                },
                prevAll: function(e) {
                    return at.dir(e, "previousSibling")
                },
                nextUntil: function(e, t, r) {
                    return at.dir(e, "nextSibling", r)
                },
                prevUntil: function(e, t, r) {
                    return at.dir(e, "previousSibling", r)
                },
                siblings: function(e) {
                    return at.sibling((e.parentNode || {}).firstChild, e)
                },
                children: function(e) {
                    return at.sibling(e.firstChild)
                },
                contents: function(e) {
                    return at.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : at.merge([], e.childNodes)
                }
            }, function(e, t) {
                at.fn[e] = function(r, n) {
                    var o = at.map(this, t, r);
                    return "Until" !== e.slice(-5) && (n = r), n && "string" == typeof n && (o = at.filter(n, o)), this.length > 1 && (Et[e] || (o = at.unique(o)), yt.test(e) && (o = o.reverse())), this.pushStack(o)
                }
            });
            var bt = /\S+/g,
                At = {};
            at.Callbacks = function(e) {
                e = "string" == typeof e ? At[e] || a(e) : at.extend({}, e);
                var t, r, n, o, c, s, i = [],
                    u = !e.once && [],
                    d = function(a) {
                        for (r = e.memory && a, n = !0, c = s || 0, s = 0, o = i.length, t = !0; i && o > c; c++)
                            if (i[c].apply(a[0], a[1]) === !1 && e.stopOnFalse) {
                                r = !1;
                                break
                            }
                        t = !1, i && (u ? u.length && d(u.shift()) : r ? i = [] : p.disable())
                    },
                    p = {
                        add: function() {
                            if (i) {
                                var n = i.length;
                                ! function a(t) {
                                    at.each(t, function(t, r) {
                                        var n = at.type(r);
                                        "function" === n ? e.unique && p.has(r) || i.push(r) : r && r.length && "string" !== n && a(r)
                                    })
                                }(arguments), t ? o = i.length : r && (s = n, d(r))
                            }
                            return this
                        },
                        remove: function() {
                            return i && at.each(arguments, function(e, r) {
                                for (var n;
                                    (n = at.inArray(r, i, n)) > -1;) i.splice(n, 1), t && (o >= n && o--, c >= n && c--)
                            }), this
                        },
                        has: function(e) {
                            return e ? at.inArray(e, i) > -1 : !(!i || !i.length)
                        },
                        empty: function() {
                            return i = [], o = 0, this
                        },
                        disable: function() {
                            return i = u = r = void 0, this
                        },
                        disabled: function() {
                            return !i
                        },
                        lock: function() {
                            return u = void 0, r || p.disable(), this
                        },
                        locked: function() {
                            return !u
                        },
                        fireWith: function(e, r) {
                            return !i || n && !u || (r = r || [], r = [e, r.slice ? r.slice() : r], t ? u.push(r) : d(r)), this
                        },
                        fire: function() {
                            return p.fireWith(this, arguments), this
                        },
                        fired: function() {
                            return !!n
                        }
                    };
                return p
            }, at.extend({
                Deferred: function(e) {
                    var t = [
                            ["resolve", "done", at.Callbacks("once memory"), "resolved"],
                            ["reject", "fail", at.Callbacks("once memory"), "rejected"],
                            ["notify", "progress", at.Callbacks("memory")]
                        ],
                        r = "pending",
                        n = {
                            state: function() {
                                return r
                            },
                            always: function() {
                                return o.done(arguments).fail(arguments), this
                            },
                            then: function() {
                                var e = arguments;
                                return at.Deferred(function(r) {
                                    at.each(t, function(t, a) {
                                        var c = at.isFunction(e[t]) && e[t];
                                        o[a[1]](function() {
                                            var e = c && c.apply(this, arguments);
                                            e && at.isFunction(e.promise) ? e.promise().done(r.resolve).fail(r.reject).progress(r.notify) : r[a[0] + "With"](this === n ? r.promise() : this, c ? [e] : arguments)
                                        })
                                    }), e = null
                                }).promise()
                            },
                            promise: function(e) {
                                return null != e ? at.extend(e, n) : n
                            }
                        },
                        o = {};
                    return n.pipe = n.then, at.each(t, function(e, a) {
                        var c = a[2],
                            s = a[3];
                        n[a[1]] = c.add, s && c.add(function() {
                            r = s
                        }, t[1 ^ e][2].disable, t[2][2].lock), o[a[0]] = function() {
                            return o[a[0] + "With"](this === o ? n : this, arguments), this
                        }, o[a[0] + "With"] = c.fireWith
                    }), n.promise(o), e && e.call(o, o), o
                },
                when: function(e) {
                    var t, r, n, o = 0,
                        a = X.call(arguments),
                        c = a.length,
                        s = 1 !== c || e && at.isFunction(e.promise) ? c : 0,
                        i = 1 === s ? e : at.Deferred(),
                        u = function(e, r, n) {
                            return function(o) {
                                r[e] = this, n[e] = arguments.length > 1 ? X.call(arguments) : o, n === t ? i.notifyWith(r, n) : --s || i.resolveWith(r, n)
                            }
                        };
                    if (c > 1)
                        for (t = new Array(c), r = new Array(c), n = new Array(c); c > o; o++) a[o] && at.isFunction(a[o].promise) ? a[o].promise().done(u(o, n, a)).fail(i.reject).progress(u(o, r, t)) : --s;
                    return s || i.resolveWith(n, a), i.promise()
                }
            });
            var Ct;
            at.fn.ready = function(e) {
                return at.ready.promise().done(e), this
            }, at.extend({
                isReady: !1,
                readyWait: 1,
                holdReady: function(e) {
                    e ? at.readyWait++ : at.ready(!0)
                },
                ready: function(e) {
                    if (e === !0 ? !--at.readyWait : !at.isReady) {
                        if (!gt.body) return setTimeout(at.ready);
                        at.isReady = !0, e !== !0 && --at.readyWait > 0 || (Ct.resolveWith(gt, [at]), at.fn.trigger && at(gt).trigger("ready").off("ready"))
                    }
                }
            }), at.ready.promise = function(t) {
                if (!Ct)
                    if (Ct = at.Deferred(), "complete" === gt.readyState) setTimeout(at.ready);
                    else if (gt.addEventListener) gt.addEventListener("DOMContentLoaded", s, !1), e.addEventListener("load", s, !1);
                else {
                    gt.attachEvent("onreadystatechange", s), e.attachEvent("onload", s);
                    var r = !1;
                    try {
                        r = null == e.frameElement && gt.documentElement
                    } catch (n) {}
                    r && r.doScroll && ! function o() {
                        if (!at.isReady) {
                            try {
                                r.doScroll("left")
                            } catch (e) {
                                return setTimeout(o, 50)
                            }
                            c(), at.ready()
                        }
                    }()
                }
                return Ct.promise(t)
            };
            var wt, _t = "undefined";
            for (wt in at(nt)) break;
            nt.ownLast = "0" !== wt, nt.inlineBlockNeedsLayout = !1, at(function() {
                    var e, t, r = gt.getElementsByTagName("body")[0];
                    r && (e = gt.createElement("div"), e.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", t = gt.createElement("div"), r.appendChild(e).appendChild(t), typeof t.style.zoom !== _t && (t.style.cssText = "border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1", (nt.inlineBlockNeedsLayout = 3 === t.offsetWidth) && (r.style.zoom = 1)), r.removeChild(e), e = t = null)
                }),
                function() {
                    var e = gt.createElement("div");
                    if (null == nt.deleteExpando) {
                        nt.deleteExpando = !0;
                        try {
                            delete e.test
                        } catch (t) {
                            nt.deleteExpando = !1
                        }
                    }
                    e = null
                }(), at.acceptData = function(e) {
                    var t = at.noData[(e.nodeName + " ").toLowerCase()],
                        r = +e.nodeType || 1;
                    return 1 !== r && 9 !== r ? !1 : !t || t !== !0 && e.getAttribute("classid") === t
                };
            var xt = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
                Dt = /([A-Z])/g;
            at.extend({
                cache: {},
                noData: {
                    "applet ": !0,
                    "embed ": !0,
                    "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
                },
                hasData: function(e) {
                    return e = e.nodeType ? at.cache[e[at.expando]] : e[at.expando], !!e && !u(e)
                },
                data: function(e, t, r) {
                    return d(e, t, r)
                },
                removeData: function(e, t) {
                    return p(e, t)
                },
                _data: function(e, t, r) {
                    return d(e, t, r, !0)
                },
                _removeData: function(e, t) {
                    return p(e, t, !0)
                }
            }), at.fn.extend({
                data: function(e, t) {
                    var r, n, o, a = this[0],
                        c = a && a.attributes;
                    if (void 0 === e) {
                        if (this.length && (o = at.data(a), 1 === a.nodeType && !at._data(a, "parsedAttrs"))) {
                            for (r = c.length; r--;) n = c[r].name, 0 === n.indexOf("data-") && (n = at.camelCase(n.slice(5)), i(a, n, o[n]));
                            at._data(a, "parsedAttrs", !0)
                        }
                        return o
                    }
                    return "object" == typeof e ? this.each(function() {
                        at.data(this, e)
                    }) : arguments.length > 1 ? this.each(function() {
                        at.data(this, e, t)
                    }) : a ? i(a, e, at.data(a, e)) : void 0
                },
                removeData: function(e) {
                    return this.each(function() {
                        at.removeData(this, e)
                    })
                }
            }), at.extend({
                queue: function(e, t, r) {
                    var n;
                    return e ? (t = (t || "fx") + "queue", n = at._data(e, t), r && (!n || at.isArray(r) ? n = at._data(e, t, at.makeArray(r)) : n.push(r)), n || []) : void 0
                },
                dequeue: function(e, t) {
                    t = t || "fx";
                    var r = at.queue(e, t),
                        n = r.length,
                        o = r.shift(),
                        a = at._queueHooks(e, t),
                        c = function() {
                            at.dequeue(e, t)
                        };
                    "inprogress" === o && (o = r.shift(), n--), o && ("fx" === t && r.unshift("inprogress"), delete a.stop, o.call(e, c, a)), !n && a && a.empty.fire()
                },
                _queueHooks: function(e, t) {
                    var r = t + "queueHooks";
                    return at._data(e, r) || at._data(e, r, {
                        empty: at.Callbacks("once memory").add(function() {
                            at._removeData(e, t + "queue"), at._removeData(e, r)
                        })
                    })
                }
            }), at.fn.extend({
                queue: function(e, t) {
                    var r = 2;
                    return "string" != typeof e && (t = e, e = "fx", r--), arguments.length < r ? at.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                        var r = at.queue(this, e, t);
                        at._queueHooks(this, e), "fx" === e && "inprogress" !== r[0] && at.dequeue(this, e)
                    })
                },
                dequeue: function(e) {
                    return this.each(function() {
                        at.dequeue(this, e)
                    })
                },
                clearQueue: function(e) {
                    return this.queue(e || "fx", [])
                },
                promise: function(e, t) {
                    var r, n = 1,
                        o = at.Deferred(),
                        a = this,
                        c = this.length,
                        s = function() {
                            --n || o.resolveWith(a, [a])
                        };
                    for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; c--;) r = at._data(a[c], e + "queueHooks"), r && r.empty && (n++, r.empty.add(s));
                    return s(), o.promise(t)
                }
            });
            var Tt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
                kt = ["Top", "Right", "Bottom", "Left"],
                Bt = function(e, t) {
                    return e = t || e, "none" === at.css(e, "display") || !at.contains(e.ownerDocument, e)
                },
                Ft = at.access = function(e, t, r, n, o, a, c) {
                    var s = 0,
                        i = e.length,
                        u = null == r;
                    if ("object" === at.type(r)) {
                        o = !0;
                        for (s in r) at.access(e, t, s, r[s], !0, a, c)
                    } else if (void 0 !== n && (o = !0, at.isFunction(n) || (c = !0), u && (c ? (t.call(e, n), t = null) : (u = t, t = function(e, t, r) {
                            return u.call(at(e), r)
                        })), t))
                        for (; i > s; s++) t(e[s], r, c ? n : n.call(e[s], s, t(e[s], r)));
                    return o ? e : u ? t.call(e) : i ? t(e[0], r) : a
                },
                St = /^(?:checkbox|radio)$/i;
            ! function() {
                var e = gt.createDocumentFragment(),
                    t = gt.createElement("div"),
                    r = gt.createElement("input");
                if (t.setAttribute("className", "t"), t.innerHTML = "  <link/><table></table><a href='/a'>a</a>", nt.leadingWhitespace = 3 === t.firstChild.nodeType, nt.tbody = !t.getElementsByTagName("tbody").length, nt.htmlSerialize = !!t.getElementsByTagName("link").length, nt.html5Clone = "<:nav></:nav>" !== gt.createElement("nav").cloneNode(!0).outerHTML, r.type = "checkbox", r.checked = !0, e.appendChild(r), nt.appendChecked = r.checked, t.innerHTML = "<textarea>x</textarea>", nt.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue, e.appendChild(t), t.innerHTML = "<input type='radio' checked='checked' name='t'/>", nt.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, nt.noCloneEvent = !0, t.attachEvent && (t.attachEvent("onclick", function() {
                        nt.noCloneEvent = !1
                    }), t.cloneNode(!0).click()), null == nt.deleteExpando) {
                    nt.deleteExpando = !0;
                    try {
                        delete t.test
                    } catch (n) {
                        nt.deleteExpando = !1
                    }
                }
                e = t = r = null
            }(),
            function() {
                var t, r, n = gt.createElement("div");
                for (t in {
                        submit: !0,
                        change: !0,
                        focusin: !0
                    }) r = "on" + t, (nt[t + "Bubbles"] = r in e) || (n.setAttribute(r, "t"), nt[t + "Bubbles"] = n.attributes[r].expando === !1);
                n = null
            }();
            var Nt = /^(?:input|select|textarea)$/i,
                Ot = /^key/,
                It = /^(?:mouse|contextmenu)|click/,
                Lt = /^(?:focusinfocus|focusoutblur)$/,
                qt = /^([^.]*)(?:\.(.+)|)$/;
            at.event = {
                global: {},
                add: function(e, t, r, n, o) {
                    var a, c, s, i, u, d, p, l, h, f, g, m = at._data(e);
                    if (m) {
                        for (r.handler && (i = r, r = i.handler, o = i.selector), r.guid || (r.guid = at.guid++), (c = m.events) || (c = m.events = {}), (d = m.handle) || (d = m.handle = function(e) {
                                return typeof at === _t || e && at.event.triggered === e.type ? void 0 : at.event.dispatch.apply(d.elem, arguments)
                            }, d.elem = e), t = (t || "").match(bt) || [""], s = t.length; s--;) a = qt.exec(t[s]) || [], h = g = a[1], f = (a[2] || "").split(".").sort(), h && (u = at.event.special[h] || {}, h = (o ? u.delegateType : u.bindType) || h, u = at.event.special[h] || {}, p = at.extend({
                            type: h,
                            origType: g,
                            data: n,
                            handler: r,
                            guid: r.guid,
                            selector: o,
                            needsContext: o && at.expr.match.needsContext.test(o),
                            namespace: f.join(".")
                        }, i), (l = c[h]) || (l = c[h] = [], l.delegateCount = 0, u.setup && u.setup.call(e, n, f, d) !== !1 || (e.addEventListener ? e.addEventListener(h, d, !1) : e.attachEvent && e.attachEvent("on" + h, d))), u.add && (u.add.call(e, p), p.handler.guid || (p.handler.guid = r.guid)), o ? l.splice(l.delegateCount++, 0, p) : l.push(p), at.event.global[h] = !0);
                        e = null
                    }
                },
                remove: function(e, t, r, n, o) {
                    var a, c, s, i, u, d, p, l, h, f, g, m = at.hasData(e) && at._data(e);
                    if (m && (d = m.events)) {
                        for (t = (t || "").match(bt) || [""], u = t.length; u--;)
                            if (s = qt.exec(t[u]) || [], h = g = s[1], f = (s[2] || "").split(".").sort(), h) {
                                for (p = at.event.special[h] || {}, h = (n ? p.delegateType : p.bindType) || h, l = d[h] || [], s = s[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = a = l.length; a--;) c = l[a], !o && g !== c.origType || r && r.guid !== c.guid || s && !s.test(c.namespace) || n && n !== c.selector && ("**" !== n || !c.selector) || (l.splice(a, 1), c.selector && l.delegateCount--, p.remove && p.remove.call(e, c));
                                i && !l.length && (p.teardown && p.teardown.call(e, f, m.handle) !== !1 || at.removeEvent(e, h, m.handle), delete d[h])
                            } else
                                for (h in d) at.event.remove(e, h + t[u], r, n, !0);
                        at.isEmptyObject(d) && (delete m.handle, at._removeData(e, "events"))
                    }
                },
                trigger: function(t, r, n, o) {
                    var a, c, s, i, u, d, p, l = [n || gt],
                        h = tt.call(t, "type") ? t.type : t,
                        f = tt.call(t, "namespace") ? t.namespace.split(".") : [];
                    if (s = d = n = n || gt, 3 !== n.nodeType && 8 !== n.nodeType && !Lt.test(h + at.event.triggered) && (h.indexOf(".") >= 0 && (f = h.split("."), h = f.shift(), f.sort()), c = h.indexOf(":") < 0 && "on" + h, t = t[at.expando] ? t : new at.Event(h, "object" == typeof t && t), t.isTrigger = o ? 2 : 3, t.namespace = f.join("."), t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = n), r = null == r ? [t] : at.makeArray(r, [t]), u = at.event.special[h] || {}, o || !u.trigger || u.trigger.apply(n, r) !== !1)) {
                        if (!o && !u.noBubble && !at.isWindow(n)) {
                            for (i = u.delegateType || h, Lt.test(i + h) || (s = s.parentNode); s; s = s.parentNode) l.push(s), d = s;
                            d === (n.ownerDocument || gt) && l.push(d.defaultView || d.parentWindow || e)
                        }
                        for (p = 0;
                            (s = l[p++]) && !t.isPropagationStopped();) t.type = p > 1 ? i : u.bindType || h, a = (at._data(s, "events") || {})[t.type] && at._data(s, "handle"), a && a.apply(s, r), a = c && s[c], a && a.apply && at.acceptData(s) && (t.result = a.apply(s, r), t.result === !1 && t.preventDefault());
                        if (t.type = h, !o && !t.isDefaultPrevented() && (!u._default || u._default.apply(l.pop(), r) === !1) && at.acceptData(n) && c && n[h] && !at.isWindow(n)) {
                            d = n[c], d && (n[c] = null), at.event.triggered = h;
                            try {
                                n[h]()
                            } catch (g) {}
                            at.event.triggered = void 0, d && (n[c] = d)
                        }
                        return t.result
                    }
                },
                dispatch: function(e) {
                    e = at.event.fix(e);
                    var t, r, n, o, a, c = [],
                        s = X.call(arguments),
                        i = (at._data(this, "events") || {})[e.type] || [],
                        u = at.event.special[e.type] || {};
                    if (s[0] = e, e.delegateTarget = this, !u.preDispatch || u.preDispatch.call(this, e) !== !1) {
                        for (c = at.event.handlers.call(this, e, i), t = 0;
                            (o = c[t++]) && !e.isPropagationStopped();)
                            for (e.currentTarget = o.elem, a = 0;
                                (n = o.handlers[a++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(n.namespace)) && (e.handleObj = n, e.data = n.data, r = ((at.event.special[n.origType] || {}).handle || n.handler).apply(o.elem, s), void 0 !== r && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation()));
                        return u.postDispatch && u.postDispatch.call(this, e), e.result
                    }
                },
                handlers: function(e, t) {
                    var r, n, o, a, c = [],
                        s = t.delegateCount,
                        i = e.target;
                    if (s && i.nodeType && (!e.button || "click" !== e.type))
                        for (; i != this; i = i.parentNode || this)
                            if (1 === i.nodeType && (i.disabled !== !0 || "click" !== e.type)) {
                                for (o = [], a = 0; s > a; a++) n = t[a], r = n.selector + " ", void 0 === o[r] && (o[r] = n.needsContext ? at(r, this).index(i) >= 0 : at.find(r, this, null, [i]).length), o[r] && o.push(n);
                                o.length && c.push({
                                    elem: i,
                                    handlers: o
                                })
                            }
                    return s < t.length && c.push({
                        elem: this,
                        handlers: t.slice(s)
                    }), c
                },
                fix: function(e) {
                    if (e[at.expando]) return e;
                    var t, r, n, o = e.type,
                        a = e,
                        c = this.fixHooks[o];
                    for (c || (this.fixHooks[o] = c = It.test(o) ? this.mouseHooks : Ot.test(o) ? this.keyHooks : {}), n = c.props ? this.props.concat(c.props) : this.props, e = new at.Event(a), t = n.length; t--;) r = n[t], e[r] = a[r];
                    return e.target || (e.target = a.srcElement || gt), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, c.filter ? c.filter(e, a) : e
                },
                props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
                fixHooks: {},
                keyHooks: {
                    props: "char charCode key keyCode".split(" "),
                    filter: function(e, t) {
                        return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
                    }
                },
                mouseHooks: {
                    props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                    filter: function(e, t) {
                        var r, n, o, a = t.button,
                            c = t.fromElement;
                        return null == e.pageX && null != t.clientX && (n = e.target.ownerDocument || gt, o = n.documentElement, r = n.body, e.pageX = t.clientX + (o && o.scrollLeft || r && r.scrollLeft || 0) - (o && o.clientLeft || r && r.clientLeft || 0), e.pageY = t.clientY + (o && o.scrollTop || r && r.scrollTop || 0) - (o && o.clientTop || r && r.clientTop || 0)), !e.relatedTarget && c && (e.relatedTarget = c === e.target ? t.toElement : c), e.which || void 0 === a || (e.which = 1 & a ? 1 : 2 & a ? 3 : 4 & a ? 2 : 0), e
                    }
                },
                special: {
                    load: {
                        noBubble: !0
                    },
                    focus: {
                        trigger: function() {
                            if (this !== f() && this.focus) try {
                                return this.focus(), !1
                            } catch (e) {}
                        },
                        delegateType: "focusin"
                    },
                    blur: {
                        trigger: function() {
                            return this === f() && this.blur ? (this.blur(), !1) : void 0
                        },
                        delegateType: "focusout"
                    },
                    click: {
                        trigger: function() {
                            return at.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                        },
                        _default: function(e) {
                            return at.nodeName(e.target, "a")
                        }
                    },
                    beforeunload: {
                        postDispatch: function(e) {
                            void 0 !== e.result && (e.originalEvent.returnValue = e.result)
                        }
                    }
                },
                simulate: function(e, t, r, n) {
                    var o = at.extend(new at.Event, r, {
                        type: e,
                        isSimulated: !0,
                        originalEvent: {}
                    });
                    n ? at.event.trigger(o, null, t) : at.event.dispatch.call(t, o), o.isDefaultPrevented() && r.preventDefault()
                }
            }, at.removeEvent = gt.removeEventListener ? function(e, t, r) {
                e.removeEventListener && e.removeEventListener(t, r, !1)
            } : function(e, t, r) {
                var n = "on" + t;
                e.detachEvent && (typeof e[n] === _t && (e[n] = null), e.detachEvent(n, r))
            }, at.Event = function(e, t) {
                return this instanceof at.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && (e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault()) ? l : h) : this.type = e, t && at.extend(this, t), this.timeStamp = e && e.timeStamp || at.now(), void(this[at.expando] = !0)) : new at.Event(e, t)
            }, at.Event.prototype = {
                isDefaultPrevented: h,
                isPropagationStopped: h,
                isImmediatePropagationStopped: h,
                preventDefault: function() {
                    var e = this.originalEvent;
                    this.isDefaultPrevented = l, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
                },
                stopPropagation: function() {
                    var e = this.originalEvent;
                    this.isPropagationStopped = l, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
                },
                stopImmediatePropagation: function() {
                    this.isImmediatePropagationStopped = l, this.stopPropagation()
                }
            }, at.each({
                mouseenter: "mouseover",
                mouseleave: "mouseout"
            }, function(e, t) {
                at.event.special[e] = {
                    delegateType: t,
                    bindType: t,
                    handle: function(e) {
                        var r, n = this,
                            o = e.relatedTarget,
                            a = e.handleObj;
                        return (!o || o !== n && !at.contains(n, o)) && (e.type = a.origType, r = a.handler.apply(this, arguments), e.type = t), r
                    }
                }
            }), nt.submitBubbles || (at.event.special.submit = {
                setup: function() {
                    return at.nodeName(this, "form") ? !1 : void at.event.add(this, "click._submit keypress._submit", function(e) {
                        var t = e.target,
                            r = at.nodeName(t, "input") || at.nodeName(t, "button") ? t.form : void 0;
                        r && !at._data(r, "submitBubbles") && (at.event.add(r, "submit._submit", function(e) {
                            e._submit_bubble = !0
                        }), at._data(r, "submitBubbles", !0))
                    })
                },
                postDispatch: function(e) {
                    e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && at.event.simulate("submit", this.parentNode, e, !0))
                },
                teardown: function() {
                    return at.nodeName(this, "form") ? !1 : void at.event.remove(this, "._submit")
                }
            }), nt.changeBubbles || (at.event.special.change = {
                setup: function() {
                    return Nt.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (at.event.add(this, "propertychange._change", function(e) {
                        "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
                    }), at.event.add(this, "click._change", function(e) {
                        this._just_changed && !e.isTrigger && (this._just_changed = !1), at.event.simulate("change", this, e, !0)
                    })), !1) : void at.event.add(this, "beforeactivate._change", function(e) {
                        var t = e.target;
                        Nt.test(t.nodeName) && !at._data(t, "changeBubbles") && (at.event.add(t, "change._change", function(e) {
                            !this.parentNode || e.isSimulated || e.isTrigger || at.event.simulate("change", this.parentNode, e, !0)
                        }), at._data(t, "changeBubbles", !0))
                    })
                },
                handle: function(e) {
                    var t = e.target;
                    return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
                },
                teardown: function() {
                    return at.event.remove(this, "._change"), !Nt.test(this.nodeName)
                }
            }), nt.focusinBubbles || at.each({
                focus: "focusin",
                blur: "focusout"
            }, function(e, t) {
                var r = function(e) {
                    at.event.simulate(t, e.target, at.event.fix(e), !0)
                };
                at.event.special[t] = {
                    setup: function() {
                        var n = this.ownerDocument || this,
                            o = at._data(n, t);
                        o || n.addEventListener(e, r, !0), at._data(n, t, (o || 0) + 1)
                    },
                    teardown: function() {
                        var n = this.ownerDocument || this,
                            o = at._data(n, t) - 1;
                        o ? at._data(n, t, o) : (n.removeEventListener(e, r, !0), at._removeData(n, t))
                    }
                }
            }), at.fn.extend({
                on: function(e, t, r, n, o) {
                    var a, c;
                    if ("object" == typeof e) {
                        "string" != typeof t && (r = r || t, t = void 0);
                        for (a in e) this.on(a, t, r, e[a], o);
                        return this
                    }
                    if (null == r && null == n ? (n = t, r = t = void 0) : null == n && ("string" == typeof t ? (n = r, r = void 0) : (n = r, r = t, t = void 0)), n === !1) n = h;
                    else if (!n) return this;
                    return 1 === o && (c = n, n = function(e) {
                        return at().off(e), c.apply(this, arguments)
                    }, n.guid = c.guid || (c.guid = at.guid++)), this.each(function() {
                        at.event.add(this, e, n, r, t)
                    })
                },
                one: function(e, t, r, n) {
                    return this.on(e, t, r, n, 1)
                },
                off: function(e, t, r) {
                    var n, o;
                    if (e && e.preventDefault && e.handleObj) return n = e.handleObj, at(e.delegateTarget).off(n.namespace ? n.origType + "." + n.namespace : n.origType, n.selector, n.handler), this;
                    if ("object" == typeof e) {
                        for (o in e) this.off(o, t, e[o]);
                        return this
                    }
                    return (t === !1 || "function" == typeof t) && (r = t, t = void 0), r === !1 && (r = h), this.each(function() {
                        at.event.remove(this, e, r, t)
                    })
                },
                trigger: function(e, t) {
                    return this.each(function() {
                        at.event.trigger(e, t, this)
                    })
                },
                triggerHandler: function(e, t) {
                    var r = this[0];
                    return r ? at.event.trigger(e, t, r, !0) : void 0
                }
            });
            var Mt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
                Pt = / jQuery\d+="(?:null|\d+)"/g,
                jt = new RegExp("<(?:" + Mt + ")[\\s/>]", "i"),
                Rt = /^\s+/,
                $t = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
                Ht = /<([\w:]+)/,
                Ut = /<tbody/i,
                Vt = /<|&#?\w+;/,
                zt = /<(?:script|style|link)/i,
                Jt = /checked\s*(?:[^=]|=\s*.checked.)/i,
                Wt = /^$|\/(?:java|ecma)script/i,
                Gt = /^true\/(.*)/,
                Xt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
                Kt = {
                    option: [1, "<select multiple='multiple'>", "</select>"],
                    legend: [1, "<fieldset>", "</fieldset>"],
                    area: [1, "<map>", "</map>"],
                    param: [1, "<object>", "</object>"],
                    thead: [1, "<table>", "</table>"],
                    tr: [2, "<table><tbody>", "</tbody></table>"],
                    col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                    _default: nt.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
                },
                Qt = g(gt),
                Yt = Qt.appendChild(gt.createElement("div"));
            Kt.optgroup = Kt.option, Kt.tbody = Kt.tfoot = Kt.colgroup = Kt.caption = Kt.thead, Kt.th = Kt.td, at.extend({
                clone: function(e, t, r) {
                    var n, o, a, c, s, i = at.contains(e.ownerDocument, e);
                    if (nt.html5Clone || at.isXMLDoc(e) || !jt.test("<" + e.nodeName + ">") ? a = e.cloneNode(!0) : (Yt.innerHTML = e.outerHTML, Yt.removeChild(a = Yt.firstChild)), !(nt.noCloneEvent && nt.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || at.isXMLDoc(e)))
                        for (n = m(a), s = m(e), c = 0; null != (o = s[c]); ++c) n[c] && w(o, n[c]);
                    if (t)
                        if (r)
                            for (s = s || m(e), n = n || m(a), c = 0; null != (o = s[c]); c++) C(o, n[c]);
                        else C(e, a);
                    return n = m(a, "script"), n.length > 0 && A(n, !i && m(e, "script")), n = s = o = null, a
                },
                buildFragment: function(e, t, r, n) {
                    for (var o, a, c, s, i, u, d, p = e.length, l = g(t), h = [], f = 0; p > f; f++)
                        if (a = e[f], a || 0 === a)
                            if ("object" === at.type(a)) at.merge(h, a.nodeType ? [a] : a);
                            else if (Vt.test(a)) {
                        for (s = s || l.appendChild(t.createElement("div")), i = (Ht.exec(a) || ["", ""])[1].toLowerCase(), d = Kt[i] || Kt._default, s.innerHTML = d[1] + a.replace($t, "<$1></$2>") + d[2], o = d[0]; o--;) s = s.lastChild;
                        if (!nt.leadingWhitespace && Rt.test(a) && h.push(t.createTextNode(Rt.exec(a)[0])), !nt.tbody)
                            for (a = "table" !== i || Ut.test(a) ? "<table>" !== d[1] || Ut.test(a) ? 0 : s : s.firstChild, o = a && a.childNodes.length; o--;) at.nodeName(u = a.childNodes[o], "tbody") && !u.childNodes.length && a.removeChild(u);
                        for (at.merge(h, s.childNodes), s.textContent = ""; s.firstChild;) s.removeChild(s.firstChild);
                        s = l.lastChild
                    } else h.push(t.createTextNode(a));
                    for (s && l.removeChild(s), nt.appendChecked || at.grep(m(h, "input"), v), f = 0; a = h[f++];)
                        if ((!n || -1 === at.inArray(a, n)) && (c = at.contains(a.ownerDocument, a), s = m(l.appendChild(a), "script"), c && A(s), r))
                            for (o = 0; a = s[o++];) Wt.test(a.type || "") && r.push(a);
                    return s = null, l
                },
                cleanData: function(e, t) {
                    for (var r, n, o, a, c = 0, s = at.expando, i = at.cache, u = nt.deleteExpando, d = at.event.special; null != (r = e[c]); c++)
                        if ((t || at.acceptData(r)) && (o = r[s], a = o && i[o])) {
                            if (a.events)
                                for (n in a.events) d[n] ? at.event.remove(r, n) : at.removeEvent(r, n, a.handle);
                            i[o] && (delete i[o], u ? delete r[s] : typeof r.removeAttribute !== _t ? r.removeAttribute(s) : r[s] = null, G.push(o))
                        }
                }
            }), at.fn.extend({
                text: function(e) {
                    return Ft(this, function(e) {
                        return void 0 === e ? at.text(this) : this.empty().append((this[0] && this[0].ownerDocument || gt).createTextNode(e))
                    }, null, e, arguments.length)
                },
                append: function() {
                    return this.domManip(arguments, function(e) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var t = y(this, e);
                            t.appendChild(e)
                        }
                    })
                },
                prepend: function() {
                    return this.domManip(arguments, function(e) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var t = y(this, e);
                            t.insertBefore(e, t.firstChild)
                        }
                    })
                },
                before: function() {
                    return this.domManip(arguments, function(e) {
                        this.parentNode && this.parentNode.insertBefore(e, this)
                    })
                },
                after: function() {
                    return this.domManip(arguments, function(e) {
                        this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                    })
                },
                remove: function(e, t) {
                    for (var r, n = e ? at.filter(e, this) : this, o = 0; null != (r = n[o]); o++) t || 1 !== r.nodeType || at.cleanData(m(r)), r.parentNode && (t && at.contains(r.ownerDocument, r) && A(m(r, "script")), r.parentNode.removeChild(r));
                    return this
                },
                empty: function() {
                    for (var e, t = 0; null != (e = this[t]); t++) {
                        for (1 === e.nodeType && at.cleanData(m(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                        e.options && at.nodeName(e, "select") && (e.options.length = 0)
                    }
                    return this
                },
                clone: function(e, t) {
                    return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
                        return at.clone(this, e, t)
                    })
                },
                html: function(e) {
                    return Ft(this, function(e) {
                        var t = this[0] || {},
                            r = 0,
                            n = this.length;
                        if (void 0 === e) return 1 === t.nodeType ? t.innerHTML.replace(Pt, "") : void 0;
                        if (!("string" != typeof e || zt.test(e) || !nt.htmlSerialize && jt.test(e) || !nt.leadingWhitespace && Rt.test(e) || Kt[(Ht.exec(e) || ["", ""])[1].toLowerCase()])) {
                            e = e.replace($t, "<$1></$2>");
                            try {
                                for (; n > r; r++) t = this[r] || {}, 1 === t.nodeType && (at.cleanData(m(t, !1)), t.innerHTML = e);
                                t = 0
                            } catch (o) {}
                        }
                        t && this.empty().append(e)
                    }, null, e, arguments.length)
                },
                replaceWith: function() {
                    var e = arguments[0];
                    return this.domManip(arguments, function(t) {
                        e = this.parentNode, at.cleanData(m(this)), e && e.replaceChild(t, this)
                    }), e && (e.length || e.nodeType) ? this : this.remove()
                },
                detach: function(e) {
                    return this.remove(e, !0)
                },
                domManip: function(e, t) {
                    e = K.apply([], e);
                    var r, n, o, a, c, s, i = 0,
                        u = this.length,
                        d = this,
                        p = u - 1,
                        l = e[0],
                        h = at.isFunction(l);
                    if (h || u > 1 && "string" == typeof l && !nt.checkClone && Jt.test(l)) return this.each(function(r) {
                        var n = d.eq(r);
                        h && (e[0] = l.call(this, r, n.html())), n.domManip(e, t)
                    });
                    if (u && (s = at.buildFragment(e, this[0].ownerDocument, !1, this), r = s.firstChild, 1 === s.childNodes.length && (s = r), r)) {
                        for (a = at.map(m(s, "script"), E), o = a.length; u > i; i++) n = s, i !== p && (n = at.clone(n, !0, !0), o && at.merge(a, m(n, "script"))), t.call(this[i], n, i);
                        if (o)
                            for (c = a[a.length - 1].ownerDocument, at.map(a, b), i = 0; o > i; i++) n = a[i], Wt.test(n.type || "") && !at._data(n, "globalEval") && at.contains(c, n) && (n.src ? at._evalUrl && at._evalUrl(n.src) : at.globalEval((n.text || n.textContent || n.innerHTML || "").replace(Xt, "")));
                        s = r = null
                    }
                    return this
                }
            }), at.each({
                appendTo: "append",
                prependTo: "prepend",
                insertBefore: "before",
                insertAfter: "after",
                replaceAll: "replaceWith"
            }, function(e, t) {
                at.fn[e] = function(e) {
                    for (var r, n = 0, o = [], a = at(e), c = a.length - 1; c >= n; n++) r = n === c ? this : this.clone(!0), at(a[n])[t](r), Q.apply(o, r.get());
                    return this.pushStack(o)
                }
            });
            var Zt, er = {};
            ! function() {
                var e, t, r = gt.createElement("div"),
                    n = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
                r.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", e = r.getElementsByTagName("a")[0], e.style.cssText = "float:left;opacity:.5", nt.opacity = /^0.5/.test(e.style.opacity), nt.cssFloat = !!e.style.cssFloat, r.style.backgroundClip = "content-box", r.cloneNode(!0).style.backgroundClip = "", nt.clearCloneStyle = "content-box" === r.style.backgroundClip, e = r = null, nt.shrinkWrapBlocks = function() {
                    var e, r, o, a;
                    if (null == t) {
                        if (e = gt.getElementsByTagName("body")[0], !e) return;
                        a = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px", r = gt.createElement("div"), o = gt.createElement("div"), e.appendChild(r).appendChild(o), t = !1, typeof o.style.zoom !== _t && (o.style.cssText = n + ";width:1px;padding:1px;zoom:1", o.innerHTML = "<div></div>", o.firstChild.style.width = "5px", t = 3 !== o.offsetWidth), e.removeChild(r), e = r = o = null
                    }
                    return t
                }
            }();
            var tr, rr, nr = /^margin/,
                or = new RegExp("^(" + Tt + ")(?!px)[a-z%]+$", "i"),
                ar = /^(top|right|bottom|left)$/;
            e.getComputedStyle ? (tr = function(e) {
                    return e.ownerDocument.defaultView.getComputedStyle(e, null)
                }, rr = function(e, t, r) {
                    var n, o, a, c, s = e.style;
                    return r = r || tr(e), c = r ? r.getPropertyValue(t) || r[t] : void 0, r && ("" !== c || at.contains(e.ownerDocument, e) || (c = at.style(e, t)), or.test(c) && nr.test(t) && (n = s.width, o = s.minWidth, a = s.maxWidth, s.minWidth = s.maxWidth = s.width = c, c = r.width, s.width = n, s.minWidth = o, s.maxWidth = a)), void 0 === c ? c : c + ""
                }) : gt.documentElement.currentStyle && (tr = function(e) {
                    return e.currentStyle
                }, rr = function(e, t, r) {
                    var n, o, a, c, s = e.style;
                    return r = r || tr(e), c = r ? r[t] : void 0, null == c && s && s[t] && (c = s[t]), or.test(c) && !ar.test(t) && (n = s.left, o = e.runtimeStyle, a = o && o.left, a && (o.left = e.currentStyle.left), s.left = "fontSize" === t ? "1em" : c, c = s.pixelLeft + "px", s.left = n, a && (o.left = a)), void 0 === c ? c : c + "" || "auto"
                }),
                function() {
                    function t() {
                        var t, r, n = gt.getElementsByTagName("body")[0];
                        n && (t = gt.createElement("div"), r = gt.createElement("div"), t.style.cssText = u, n.appendChild(t).appendChild(r), r.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;display:block;padding:1px;border:1px;width:4px;margin-top:1%;top:1%", at.swap(n, null != n.style.zoom ? {
                            zoom: 1
                        } : {}, function() {
                            o = 4 === r.offsetWidth
                        }), a = !0, c = !1, s = !0, e.getComputedStyle && (c = "1%" !== (e.getComputedStyle(r, null) || {}).top, a = "4px" === (e.getComputedStyle(r, null) || {
                            width: "4px"
                        }).width), n.removeChild(t), r = n = null)
                    }
                    var r, n, o, a, c, s, i = gt.createElement("div"),
                        u = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px",
                        d = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
                    i.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", r = i.getElementsByTagName("a")[0], r.style.cssText = "float:left;opacity:.5", nt.opacity = /^0.5/.test(r.style.opacity), nt.cssFloat = !!r.style.cssFloat, i.style.backgroundClip = "content-box", i.cloneNode(!0).style.backgroundClip = "", nt.clearCloneStyle = "content-box" === i.style.backgroundClip, r = i = null, at.extend(nt, {
                        reliableHiddenOffsets: function() {
                            if (null != n) return n;
                            var e, t, r, o = gt.createElement("div"),
                                a = gt.getElementsByTagName("body")[0];
                            if (a) return o.setAttribute("className", "t"), o.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", e = gt.createElement("div"), e.style.cssText = u, a.appendChild(e).appendChild(o), o.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", t = o.getElementsByTagName("td"), t[0].style.cssText = "padding:0;margin:0;border:0;display:none", r = 0 === t[0].offsetHeight, t[0].style.display = "", t[1].style.display = "none", n = r && 0 === t[0].offsetHeight, a.removeChild(e), o = a = null, n
                        },
                        boxSizing: function() {
                            return null == o && t(), o
                        },
                        boxSizingReliable: function() {
                            return null == a && t(), a
                        },
                        pixelPosition: function() {
                            return null == c && t(), c
                        },
                        reliableMarginRight: function() {
                            var t, r, n, o;
                            if (null == s && e.getComputedStyle) {
                                if (t = gt.getElementsByTagName("body")[0], !t) return;
                                r = gt.createElement("div"), n = gt.createElement("div"), r.style.cssText = u, t.appendChild(r).appendChild(n), o = n.appendChild(gt.createElement("div")), o.style.cssText = n.style.cssText = d, o.style.marginRight = o.style.width = "0", n.style.width = "1px", s = !parseFloat((e.getComputedStyle(o, null) || {}).marginRight), t.removeChild(r)
                            }
                            return s
                        }
                    })
                }(), at.swap = function(e, t, r, n) {
                    var o, a, c = {};
                    for (a in t) c[a] = e.style[a], e.style[a] = t[a];
                    o = r.apply(e, n || []);
                    for (a in t) e.style[a] = c[a];
                    return o
                };
            var cr = /alpha\([^)]*\)/i,
                sr = /opacity\s*=\s*([^)]*)/,
                ir = /^(none|table(?!-c[ea]).+)/,
                ur = new RegExp("^(" + Tt + ")(.*)$", "i"),
                dr = new RegExp("^([+-])=(" + Tt + ")", "i"),
                pr = {
                    position: "absolute",
                    visibility: "hidden",
                    display: "block"
                },
                lr = {
                    letterSpacing: 0,
                    fontWeight: 400
                },
                hr = ["Webkit", "O", "Moz", "ms"];
            at.extend({
                cssHooks: {
                    opacity: {
                        get: function(e, t) {
                            if (t) {
                                var r = rr(e, "opacity");
                                return "" === r ? "1" : r
                            }
                        }
                    }
                },
                cssNumber: {
                    columnCount: !0,
                    fillOpacity: !0,
                    fontWeight: !0,
                    lineHeight: !0,
                    opacity: !0,
                    order: !0,
                    orphans: !0,
                    widows: !0,
                    zIndex: !0,
                    zoom: !0
                },
                cssProps: {
                    "float": nt.cssFloat ? "cssFloat" : "styleFloat"
                },
                style: function(e, t, r, n) {
                    if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                        var o, a, c, s = at.camelCase(t),
                            i = e.style;
                        if (t = at.cssProps[s] || (at.cssProps[s] = T(i, s)), c = at.cssHooks[t] || at.cssHooks[s], void 0 === r) return c && "get" in c && void 0 !== (o = c.get(e, !1, n)) ? o : i[t];
                        if (a = typeof r, "string" === a && (o = dr.exec(r)) && (r = (o[1] + 1) * o[2] + parseFloat(at.css(e, t)), a = "number"), null != r && r === r && ("number" !== a || at.cssNumber[s] || (r += "px"), nt.clearCloneStyle || "" !== r || 0 !== t.indexOf("background") || (i[t] = "inherit"), !(c && "set" in c && void 0 === (r = c.set(e, r, n))))) try {
                            i[t] = "", i[t] = r
                        } catch (u) {}
                    }
                },
                css: function(e, t, r, n) {
                    var o, a, c, s = at.camelCase(t);
                    return t = at.cssProps[s] || (at.cssProps[s] = T(e.style, s)), c = at.cssHooks[t] || at.cssHooks[s], c && "get" in c && (a = c.get(e, !0, r)), void 0 === a && (a = rr(e, t, n)), "normal" === a && t in lr && (a = lr[t]), "" === r || r ? (o = parseFloat(a), r === !0 || at.isNumeric(o) ? o || 0 : a) : a
                }
            }), at.each(["height", "width"], function(e, t) {
                at.cssHooks[t] = {
                    get: function(e, r, n) {
                        return r ? 0 === e.offsetWidth && ir.test(at.css(e, "display")) ? at.swap(e, pr, function() {
                            return S(e, t, n)
                        }) : S(e, t, n) : void 0
                    },
                    set: function(e, r, n) {
                        var o = n && tr(e);
                        return B(e, r, n ? F(e, t, n, nt.boxSizing() && "border-box" === at.css(e, "boxSizing", !1, o), o) : 0)
                    }
                }
            }), nt.opacity || (at.cssHooks.opacity = {
                get: function(e, t) {
                    return sr.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
                },
                set: function(e, t) {
                    var r = e.style,
                        n = e.currentStyle,
                        o = at.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                        a = n && n.filter || r.filter || "";
                    r.zoom = 1, (t >= 1 || "" === t) && "" === at.trim(a.replace(cr, "")) && r.removeAttribute && (r.removeAttribute("filter"), "" === t || n && !n.filter) || (r.filter = cr.test(a) ? a.replace(cr, o) : a + " " + o)
                }
            }), at.cssHooks.marginRight = D(nt.reliableMarginRight, function(e, t) {
                return t ? at.swap(e, {
                    display: "inline-block"
                }, rr, [e, "marginRight"]) : void 0
            }), at.each({
                margin: "",
                padding: "",
                border: "Width"
            }, function(e, t) {
                at.cssHooks[e + t] = {
                    expand: function(r) {
                        for (var n = 0, o = {}, a = "string" == typeof r ? r.split(" ") : [r]; 4 > n; n++) o[e + kt[n] + t] = a[n] || a[n - 2] || a[0];
                        return o
                    }
                }, nr.test(e) || (at.cssHooks[e + t].set = B)
            }), at.fn.extend({
                css: function(e, t) {
                    return Ft(this, function(e, t, r) {
                        var n, o, a = {},
                            c = 0;
                        if (at.isArray(t)) {
                            for (n = tr(e), o = t.length; o > c; c++) a[t[c]] = at.css(e, t[c], !1, n);
                            return a
                        }
                        return void 0 !== r ? at.style(e, t, r) : at.css(e, t)
                    }, e, t, arguments.length > 1)
                },
                show: function() {
                    return k(this, !0)
                },
                hide: function() {
                    return k(this)
                },
                toggle: function(e) {
                    return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                        Bt(this) ? at(this).show() : at(this).hide()
                    })
                }
            }), at.Tween = N, N.prototype = {
                constructor: N,
                init: function(e, t, r, n, o, a) {
                    this.elem = e, this.prop = r, this.easing = o || "swing", this.options = t, this.start = this.now = this.cur(), this.end = n, this.unit = a || (at.cssNumber[r] ? "" : "px")
                },
                cur: function() {
                    var e = N.propHooks[this.prop];
                    return e && e.get ? e.get(this) : N.propHooks._default.get(this)
                },
                run: function(e) {
                    var t, r = N.propHooks[this.prop];
                    return this.pos = t = this.options.duration ? at.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), r && r.set ? r.set(this) : N.propHooks._default.set(this), this
                }
            }, N.prototype.init.prototype = N.prototype, N.propHooks = {
                _default: {
                    get: function(e) {
                        var t;
                        return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = at.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
                    },
                    set: function(e) {
                        at.fx.step[e.prop] ? at.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[at.cssProps[e.prop]] || at.cssHooks[e.prop]) ? at.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
                    }
                }
            }, N.propHooks.scrollTop = N.propHooks.scrollLeft = {
                set: function(e) {
                    e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
                }
            }, at.easing = {
                linear: function(e) {
                    return e
                },
                swing: function(e) {
                    return .5 - Math.cos(e * Math.PI) / 2
                }
            }, at.fx = N.prototype.init, at.fx.step = {};
            var fr, gr, mr = /^(?:toggle|show|hide)$/,
                vr = new RegExp("^(?:([+-])=|)(" + Tt + ")([a-z%]*)$", "i"),
                yr = /queueHooks$/,
                Er = [q],
                br = {
                    "*": [function(e, t) {
                        var r = this.createTween(e, t),
                            n = r.cur(),
                            o = vr.exec(t),
                            a = o && o[3] || (at.cssNumber[e] ? "" : "px"),
                            c = (at.cssNumber[e] || "px" !== a && +n) && vr.exec(at.css(r.elem, e)),
                            s = 1,
                            i = 20;
                        if (c && c[3] !== a) {
                            a = a || c[3], o = o || [], c = +n || 1;
                            do s = s || ".5", c /= s, at.style(r.elem, e, c + a); while (s !== (s = r.cur() / n) && 1 !== s && --i)
                        }
                        return o && (c = r.start = +c || +n || 0, r.unit = a, r.end = o[1] ? c + (o[1] + 1) * o[2] : +o[2]), r
                    }]
                };
            at.Animation = at.extend(P, {
                    tweener: function(e, t) {
                        at.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
                        for (var r, n = 0, o = e.length; o > n; n++) r = e[n], br[r] = br[r] || [], br[r].unshift(t)
                    },
                    prefilter: function(e, t) {
                        t ? Er.unshift(e) : Er.push(e)
                    }
                }), at.speed = function(e, t, r) {
                    var n = e && "object" == typeof e ? at.extend({}, e) : {
                        complete: r || !r && t || at.isFunction(e) && e,
                        duration: e,
                        easing: r && t || t && !at.isFunction(t) && t
                    };
                    return n.duration = at.fx.off ? 0 : "number" == typeof n.duration ? n.duration : n.duration in at.fx.speeds ? at.fx.speeds[n.duration] : at.fx.speeds._default, (null == n.queue || n.queue === !0) && (n.queue = "fx"), n.old = n.complete, n.complete = function() {
                        at.isFunction(n.old) && n.old.call(this), n.queue && at.dequeue(this, n.queue)
                    }, n
                }, at.fn.extend({
                    fadeTo: function(e, t, r, n) {
                        return this.filter(Bt).css("opacity", 0).show().end().animate({
                            opacity: t
                        }, e, r, n)
                    },
                    animate: function(e, t, r, n) {
                        var o = at.isEmptyObject(e),
                            a = at.speed(t, r, n),
                            c = function() {
                                var t = P(this, at.extend({}, e), a);
                                (o || at._data(this, "finish")) && t.stop(!0)
                            };
                        return c.finish = c, o || a.queue === !1 ? this.each(c) : this.queue(a.queue, c)
                    },
                    stop: function(e, t, r) {
                        var n = function(e) {
                            var t = e.stop;
                            delete e.stop, t(r)
                        };
                        return "string" != typeof e && (r = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                            var t = !0,
                                o = null != e && e + "queueHooks",
                                a = at.timers,
                                c = at._data(this);
                            if (o) c[o] && c[o].stop && n(c[o]);
                            else
                                for (o in c) c[o] && c[o].stop && yr.test(o) && n(c[o]);
                            for (o = a.length; o--;) a[o].elem !== this || null != e && a[o].queue !== e || (a[o].anim.stop(r), t = !1, a.splice(o, 1));
                            (t || !r) && at.dequeue(this, e)
                        })
                    },
                    finish: function(e) {
                        return e !== !1 && (e = e || "fx"), this.each(function() {
                            var t, r = at._data(this),
                                n = r[e + "queue"],
                                o = r[e + "queueHooks"],
                                a = at.timers,
                                c = n ? n.length : 0;
                            for (r.finish = !0, at.queue(this, e, []), o && o.stop && o.stop.call(this, !0), t = a.length; t--;) a[t].elem === this && a[t].queue === e && (a[t].anim.stop(!0), a.splice(t, 1));
                            for (t = 0; c > t; t++) n[t] && n[t].finish && n[t].finish.call(this);
                            delete r.finish
                        })
                    }
                }), at.each(["toggle", "show", "hide"], function(e, t) {
                    var r = at.fn[t];
                    at.fn[t] = function(e, n, o) {
                        return null == e || "boolean" == typeof e ? r.apply(this, arguments) : this.animate(I(t, !0), e, n, o)
                    }
                }), at.each({
                    slideDown: I("show"),
                    slideUp: I("hide"),
                    slideToggle: I("toggle"),
                    fadeIn: {
                        opacity: "show"
                    },
                    fadeOut: {
                        opacity: "hide"
                    },
                    fadeToggle: {
                        opacity: "toggle"
                    }
                }, function(e, t) {
                    at.fn[e] = function(e, r, n) {
                        return this.animate(t, e, r, n)
                    }
                }), at.timers = [], at.fx.tick = function() {
                    var e, t = at.timers,
                        r = 0;
                    for (fr = at.now(); r < t.length; r++) e = t[r], e() || t[r] !== e || t.splice(r--, 1);
                    t.length || at.fx.stop(), fr = void 0
                }, at.fx.timer = function(e) {
                    at.timers.push(e), e() ? at.fx.start() : at.timers.pop()
                }, at.fx.interval = 13, at.fx.start = function() {
                    gr || (gr = setInterval(at.fx.tick, at.fx.interval))
                }, at.fx.stop = function() {
                    clearInterval(gr), gr = null
                }, at.fx.speeds = {
                    slow: 600,
                    fast: 200,
                    _default: 400
                }, at.fn.delay = function(e, t) {
                    return e = at.fx ? at.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, r) {
                        var n = setTimeout(t, e);
                        r.stop = function() {
                            clearTimeout(n)
                        }
                    })
                },
                function() {
                    var e, t, r, n, o = gt.createElement("div");
                    o.setAttribute("className", "t"), o.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", e = o.getElementsByTagName("a")[0], r = gt.createElement("select"), n = r.appendChild(gt.createElement("option")), t = o.getElementsByTagName("input")[0], e.style.cssText = "top:1px", nt.getSetAttribute = "t" !== o.className, nt.style = /top/.test(e.getAttribute("style")), nt.hrefNormalized = "/a" === e.getAttribute("href"), nt.checkOn = !!t.value, nt.optSelected = n.selected, nt.enctype = !!gt.createElement("form").enctype, r.disabled = !0, nt.optDisabled = !n.disabled, t = gt.createElement("input"), t.setAttribute("value", ""), nt.input = "" === t.getAttribute("value"), t.value = "t", t.setAttribute("type", "radio"), nt.radioValue = "t" === t.value, e = t = r = n = o = null
                }();
            var Ar = /\r/g;
            at.fn.extend({
                val: function(e) {
                    var t, r, n, o = this[0]; {
                        if (arguments.length) return n = at.isFunction(e), this.each(function(r) {
                            var o;
                            1 === this.nodeType && (o = n ? e.call(this, r, at(this).val()) : e, null == o ? o = "" : "number" == typeof o ? o += "" : at.isArray(o) && (o = at.map(o, function(e) {
                                return null == e ? "" : e + ""
                            })), t = at.valHooks[this.type] || at.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, o, "value") || (this.value = o))
                        });
                        if (o) return t = at.valHooks[o.type] || at.valHooks[o.nodeName.toLowerCase()], t && "get" in t && void 0 !== (r = t.get(o, "value")) ? r : (r = o.value, "string" == typeof r ? r.replace(Ar, "") : null == r ? "" : r)
                    }
                }
            }), at.extend({
                valHooks: {
                    option: {
                        get: function(e) {
                            var t = at.find.attr(e, "value");
                            return null != t ? t : at.text(e)
                        }
                    },
                    select: {
                        get: function(e) {
                            for (var t, r, n = e.options, o = e.selectedIndex, a = "select-one" === e.type || 0 > o, c = a ? null : [], s = a ? o + 1 : n.length, i = 0 > o ? s : a ? o : 0; s > i; i++)
                                if (r = n[i], !(!r.selected && i !== o || (nt.optDisabled ? r.disabled : null !== r.getAttribute("disabled")) || r.parentNode.disabled && at.nodeName(r.parentNode, "optgroup"))) {
                                    if (t = at(r).val(), a) return t;
                                    c.push(t)
                                }
                            return c
                        },
                        set: function(e, t) {
                            for (var r, n, o = e.options, a = at.makeArray(t), c = o.length; c--;)
                                if (n = o[c], at.inArray(at.valHooks.option.get(n), a) >= 0) try {
                                    n.selected = r = !0
                                } catch (s) {
                                    n.scrollHeight
                                } else n.selected = !1;
                            return r || (e.selectedIndex = -1), o
                        }
                    }
                }
            }), at.each(["radio", "checkbox"], function() {
                at.valHooks[this] = {
                    set: function(e, t) {
                        return at.isArray(t) ? e.checked = at.inArray(at(e).val(), t) >= 0 : void 0
                    }
                }, nt.checkOn || (at.valHooks[this].get = function(e) {
                    return null === e.getAttribute("value") ? "on" : e.value
                })
            });
            var Cr, wr, _r = at.expr.attrHandle,
                xr = /^(?:checked|selected)$/i,
                Dr = nt.getSetAttribute,
                Tr = nt.input;
            at.fn.extend({
                attr: function(e, t) {
                    return Ft(this, at.attr, e, t, arguments.length > 1)
                },
                removeAttr: function(e) {
                    return this.each(function() {
                        at.removeAttr(this, e)
                    })
                }
            }), at.extend({
                attr: function(e, t, r) {
                    var n, o, a = e.nodeType;
                    if (e && 3 !== a && 8 !== a && 2 !== a) return typeof e.getAttribute === _t ? at.prop(e, t, r) : (1 === a && at.isXMLDoc(e) || (t = t.toLowerCase(), n = at.attrHooks[t] || (at.expr.match.bool.test(t) ? wr : Cr)), void 0 === r ? n && "get" in n && null !== (o = n.get(e, t)) ? o : (o = at.find.attr(e, t), null == o ? void 0 : o) : null !== r ? n && "set" in n && void 0 !== (o = n.set(e, r, t)) ? o : (e.setAttribute(t, r + ""), r) : void at.removeAttr(e, t))
                },
                removeAttr: function(e, t) {
                    var r, n, o = 0,
                        a = t && t.match(bt);
                    if (a && 1 === e.nodeType)
                        for (; r = a[o++];) n = at.propFix[r] || r, at.expr.match.bool.test(r) ? Tr && Dr || !xr.test(r) ? e[n] = !1 : e[at.camelCase("default-" + r)] = e[n] = !1 : at.attr(e, r, ""), e.removeAttribute(Dr ? r : n)
                },
                attrHooks: {
                    type: {
                        set: function(e, t) {
                            if (!nt.radioValue && "radio" === t && at.nodeName(e, "input")) {
                                var r = e.value;
                                return e.setAttribute("type", t), r && (e.value = r), t
                            }
                        }
                    }
                }
            }), wr = {
                set: function(e, t, r) {
                    return t === !1 ? at.removeAttr(e, r) : Tr && Dr || !xr.test(r) ? e.setAttribute(!Dr && at.propFix[r] || r, r) : e[at.camelCase("default-" + r)] = e[r] = !0, r
                }
            }, at.each(at.expr.match.bool.source.match(/\w+/g), function(e, t) {
                var r = _r[t] || at.find.attr;
                _r[t] = Tr && Dr || !xr.test(t) ? function(e, t, n) {
                    var o, a;
                    return n || (a = _r[t], _r[t] = o, o = null != r(e, t, n) ? t.toLowerCase() : null, _r[t] = a), o
                } : function(e, t, r) {
                    return r ? void 0 : e[at.camelCase("default-" + t)] ? t.toLowerCase() : null
                }
            }), Tr && Dr || (at.attrHooks.value = {
                set: function(e, t, r) {
                    return at.nodeName(e, "input") ? void(e.defaultValue = t) : Cr && Cr.set(e, t, r)
                }
            }), Dr || (Cr = {
                set: function(e, t, r) {
                    var n = e.getAttributeNode(r);
                    return n || e.setAttributeNode(n = e.ownerDocument.createAttribute(r)), n.value = t += "", "value" === r || t === e.getAttribute(r) ? t : void 0
                }
            }, _r.id = _r.name = _r.coords = function(e, t, r) {
                var n;
                return r ? void 0 : (n = e.getAttributeNode(t)) && "" !== n.value ? n.value : null
            }, at.valHooks.button = {
                get: function(e, t) {
                    var r = e.getAttributeNode(t);
                    return r && r.specified ? r.value : void 0
                },
                set: Cr.set
            }, at.attrHooks.contenteditable = {
                set: function(e, t, r) {
                    Cr.set(e, "" === t ? !1 : t, r)
                }
            }, at.each(["width", "height"], function(e, t) {
                at.attrHooks[t] = {
                    set: function(e, r) {
                        return "" === r ? (e.setAttribute(t, "auto"), r) : void 0
                    }
                }
            })), nt.style || (at.attrHooks.style = {
                get: function(e) {
                    return e.style.cssText || void 0
                },
                set: function(e, t) {
                    return e.style.cssText = t + ""
                }
            });
            var kr = /^(?:input|select|textarea|button|object)$/i,
                Br = /^(?:a|area)$/i;
            at.fn.extend({
                prop: function(e, t) {
                    return Ft(this, at.prop, e, t, arguments.length > 1)
                },
                removeProp: function(e) {
                    return e = at.propFix[e] || e, this.each(function() {
                        try {
                            this[e] = void 0, delete this[e]
                        } catch (t) {}
                    })
                }
            }), at.extend({
                propFix: {
                    "for": "htmlFor",
                    "class": "className"
                },
                prop: function(e, t, r) {
                    var n, o, a, c = e.nodeType;
                    if (e && 3 !== c && 8 !== c && 2 !== c) return a = 1 !== c || !at.isXMLDoc(e), a && (t = at.propFix[t] || t, o = at.propHooks[t]), void 0 !== r ? o && "set" in o && void 0 !== (n = o.set(e, r, t)) ? n : e[t] = r : o && "get" in o && null !== (n = o.get(e, t)) ? n : e[t]
                },
                propHooks: {
                    tabIndex: {
                        get: function(e) {
                            var t = at.find.attr(e, "tabindex");
                            return t ? parseInt(t, 10) : kr.test(e.nodeName) || Br.test(e.nodeName) && e.href ? 0 : -1
                        }
                    }
                }
            }), nt.hrefNormalized || at.each(["href", "src"], function(e, t) {
                at.propHooks[t] = {
                    get: function(e) {
                        return e.getAttribute(t, 4)
                    }
                }
            }), nt.optSelected || (at.propHooks.selected = {
                get: function(e) {
                    var t = e.parentNode;
                    return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
                }
            }), at.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
                at.propFix[this.toLowerCase()] = this
            }), nt.enctype || (at.propFix.enctype = "encoding");
            var Fr = /[\t\r\n\f]/g;
            at.fn.extend({
                addClass: function(e) {
                    var t, r, n, o, a, c, s = 0,
                        i = this.length,
                        u = "string" == typeof e && e;
                    if (at.isFunction(e)) return this.each(function(t) {
                        at(this).addClass(e.call(this, t, this.className))
                    });
                    if (u)
                        for (t = (e || "").match(bt) || []; i > s; s++)
                            if (r = this[s], n = 1 === r.nodeType && (r.className ? (" " + r.className + " ").replace(Fr, " ") : " ")) {
                                for (a = 0; o = t[a++];) n.indexOf(" " + o + " ") < 0 && (n += o + " ");
                                c = at.trim(n), r.className !== c && (r.className = c)
                            }
                    return this
                },
                removeClass: function(e) {
                    var t, r, n, o, a, c, s = 0,
                        i = this.length,
                        u = 0 === arguments.length || "string" == typeof e && e;
                    if (at.isFunction(e)) return this.each(function(t) {
                        at(this).removeClass(e.call(this, t, this.className))
                    });
                    if (u)
                        for (t = (e || "").match(bt) || []; i > s; s++)
                            if (r = this[s], n = 1 === r.nodeType && (r.className ? (" " + r.className + " ").replace(Fr, " ") : "")) {
                                for (a = 0; o = t[a++];)
                                    for (; n.indexOf(" " + o + " ") >= 0;) n = n.replace(" " + o + " ", " ");
                                c = e ? at.trim(n) : "", r.className !== c && (r.className = c)
                            }
                    return this
                },
                toggleClass: function(e, t) {
                    var r = typeof e;
                    return "boolean" == typeof t && "string" === r ? t ? this.addClass(e) : this.removeClass(e) : this.each(at.isFunction(e) ? function(r) {
                        at(this).toggleClass(e.call(this, r, this.className, t), t)
                    } : function() {
                        if ("string" === r)
                            for (var t, n = 0, o = at(this), a = e.match(bt) || []; t = a[n++];) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                        else(r === _t || "boolean" === r) && (this.className && at._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : at._data(this, "__className__") || "")
                    })
                },
                hasClass: function(e) {
                    for (var t = " " + e + " ", r = 0, n = this.length; n > r; r++)
                        if (1 === this[r].nodeType && (" " + this[r].className + " ").replace(Fr, " ").indexOf(t) >= 0) return !0;
                    return !1
                }
            }), at.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
                at.fn[t] = function(e, r) {
                    return arguments.length > 0 ? this.on(t, null, e, r) : this.trigger(t)
                }
            }), at.fn.extend({
                hover: function(e, t) {
                    return this.mouseenter(e).mouseleave(t || e)
                },
                bind: function(e, t, r) {
                    return this.on(e, null, t, r)
                },
                unbind: function(e, t) {
                    return this.off(e, null, t)
                },
                delegate: function(e, t, r, n) {
                    return this.on(t, e, r, n)
                },
                undelegate: function(e, t, r) {
                    return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", r)
                }
            });
            var Sr = at.now(),
                Nr = /\?/,
                Or = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
            at.parseJSON = function(t) {
                if (e.JSON && e.JSON.parse) return e.JSON.parse(t + "");
                var r, n = null,
                    o = at.trim(t + "");
                return o && !at.trim(o.replace(Or, function(e, t, o, a) {
                    return r && t && (n = 0), 0 === n ? e : (r = o || t, n += !a - !o, "")
                })) ? Function("return " + o)() : at.error("Invalid JSON: " + t)
            }, at.parseXML = function(t) {
                var r, n;
                if (!t || "string" != typeof t) return null;
                try {
                    e.DOMParser ? (n = new DOMParser, r = n.parseFromString(t, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(t))
                } catch (o) {
                    r = void 0
                }
                return r && r.documentElement && !r.getElementsByTagName("parsererror").length || at.error("Invalid XML: " + t), r
            };
            var Ir, Lr, qr = /#.*$/,
                Mr = /([?&])_=[^&]*/,
                Pr = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
                jr = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
                Rr = /^(?:GET|HEAD)$/,
                $r = /^\/\//,
                Hr = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
                Ur = {},
                Vr = {},
                zr = "*/".concat("*");
            try {
                Lr = location.href
            } catch (Jr) {
                Lr = gt.createElement("a"), Lr.href = "", Lr = Lr.href
            }
            Ir = Hr.exec(Lr.toLowerCase()) || [], at.extend({
                active: 0,
                lastModified: {},
                etag: {},
                ajaxSettings: {
                    url: Lr,
                    type: "GET",
                    isLocal: jr.test(Ir[1]),
                    global: !0,
                    processData: !0,
                    async: !0,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    accepts: {
                        "*": zr,
                        text: "text/plain",
                        html: "text/html",
                        xml: "application/xml, text/xml",
                        json: "application/json, text/javascript"
                    },
                    contents: {
                        xml: /xml/,
                        html: /html/,
                        json: /json/
                    },
                    responseFields: {
                        xml: "responseXML",
                        text: "responseText",
                        json: "responseJSON"
                    },
                    converters: {
                        "* text": String,
                        "text html": !0,
                        "text json": at.parseJSON,
                        "text xml": at.parseXML
                    },
                    flatOptions: {
                        url: !0,
                        context: !0
                    }
                },
                ajaxSetup: function(e, t) {
                    return t ? $($(e, at.ajaxSettings), t) : $(at.ajaxSettings, e)
                },
                ajaxPrefilter: j(Ur),
                ajaxTransport: j(Vr),
                ajax: function(e, t) {
                    function r(e, t, r, n) {
                        var o, d, v, y, b, C = t;
                        2 !== E && (E = 2, s && clearTimeout(s), u = void 0, c = n || "", A.readyState = e > 0 ? 4 : 0, o = e >= 200 && 300 > e || 304 === e, r && (y = H(p, A, r)), y = U(p, y, A, o), o ? (p.ifModified && (b = A.getResponseHeader("Last-Modified"), b && (at.lastModified[a] = b), b = A.getResponseHeader("etag"), b && (at.etag[a] = b)), 204 === e || "HEAD" === p.type ? C = "nocontent" : 304 === e ? C = "notmodified" : (C = y.state, d = y.data, v = y.error, o = !v)) : (v = C, (e || !C) && (C = "error", 0 > e && (e = 0))), A.status = e, A.statusText = (t || C) + "", o ? f.resolveWith(l, [d, C, A]) : f.rejectWith(l, [A, C, v]), A.statusCode(m), m = void 0, i && h.trigger(o ? "ajaxSuccess" : "ajaxError", [A, p, o ? d : v]), g.fireWith(l, [A, C]), i && (h.trigger("ajaxComplete", [A, p]), --at.active || at.event.trigger("ajaxStop")))
                    }
                    "object" == typeof e && (t = e, e = void 0), t = t || {};
                    var n, o, a, c, s, i, u, d, p = at.ajaxSetup({}, t),
                        l = p.context || p,
                        h = p.context && (l.nodeType || l.jquery) ? at(l) : at.event,
                        f = at.Deferred(),
                        g = at.Callbacks("once memory"),
                        m = p.statusCode || {},
                        v = {},
                        y = {},
                        E = 0,
                        b = "canceled",
                        A = {
                            readyState: 0,
                            getResponseHeader: function(e) {
                                var t;
                                if (2 === E) {
                                    if (!d)
                                        for (d = {}; t = Pr.exec(c);) d[t[1].toLowerCase()] = t[2];
                                    t = d[e.toLowerCase()]
                                }
                                return null == t ? null : t
                            },
                            getAllResponseHeaders: function() {
                                return 2 === E ? c : null
                            },
                            setRequestHeader: function(e, t) {
                                var r = e.toLowerCase();
                                return E || (e = y[r] = y[r] || e, v[e] = t), this
                            },
                            overrideMimeType: function(e) {
                                return E || (p.mimeType = e), this
                            },
                            statusCode: function(e) {
                                var t;
                                if (e)
                                    if (2 > E)
                                        for (t in e) m[t] = [m[t], e[t]];
                                    else A.always(e[A.status]);
                                return this
                            },
                            abort: function(e) {
                                var t = e || b;
                                return u && u.abort(t), r(0, t), this
                            }
                        };
                    if (f.promise(A).complete = g.add, A.success = A.done, A.error = A.fail, p.url = ((e || p.url || Lr) + "").replace(qr, "").replace($r, Ir[1] + "//"), p.type = t.method || t.type || p.method || p.type, p.dataTypes = at.trim(p.dataType || "*").toLowerCase().match(bt) || [""], null == p.crossDomain && (n = Hr.exec(p.url.toLowerCase()), p.crossDomain = !(!n || n[1] === Ir[1] && n[2] === Ir[2] && (n[3] || ("http:" === n[1] ? "80" : "443")) === (Ir[3] || ("http:" === Ir[1] ? "80" : "443")))), p.data && p.processData && "string" != typeof p.data && (p.data = at.param(p.data, p.traditional)), R(Ur, p, t, A), 2 === E) return A;
                    i = p.global, i && 0 === at.active++ && at.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Rr.test(p.type), a = p.url, p.hasContent || (p.data && (a = p.url += (Nr.test(a) ? "&" : "?") + p.data, delete p.data), p.cache === !1 && (p.url = Mr.test(a) ? a.replace(Mr, "$1_=" + Sr++) : a + (Nr.test(a) ? "&" : "?") + "_=" + Sr++)), p.ifModified && (at.lastModified[a] && A.setRequestHeader("If-Modified-Since", at.lastModified[a]), at.etag[a] && A.setRequestHeader("If-None-Match", at.etag[a])), (p.data && p.hasContent && p.contentType !== !1 || t.contentType) && A.setRequestHeader("Content-Type", p.contentType), A.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + zr + "; q=0.01" : "") : p.accepts["*"]);
                    for (o in p.headers) A.setRequestHeader(o, p.headers[o]);
                    if (p.beforeSend && (p.beforeSend.call(l, A, p) === !1 || 2 === E)) return A.abort();
                    b = "abort";
                    for (o in {
                            success: 1,
                            error: 1,
                            complete: 1
                        }) A[o](p[o]);
                    if (u = R(Vr, p, t, A)) {
                        A.readyState = 1, i && h.trigger("ajaxSend", [A, p]), p.async && p.timeout > 0 && (s = setTimeout(function() {
                            A.abort("timeout")
                        }, p.timeout));
                        try {
                            E = 1, u.send(v, r)
                        } catch (C) {
                            if (!(2 > E)) throw C;
                            r(-1, C)
                        }
                    } else r(-1, "No Transport");
                    return A
                },
                getJSON: function(e, t, r) {
                    return at.get(e, t, r, "json")
                },
                getScript: function(e, t) {
                    return at.get(e, void 0, t, "script")
                }
            }), at.each(["get", "post"], function(e, t) {
                at[t] = function(e, r, n, o) {
                    return at.isFunction(r) && (o = o || n, n = r, r = void 0), at.ajax({
                        url: e,
                        type: t,
                        dataType: o,
                        data: r,
                        success: n
                    })
                }
            }), at.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
                at.fn[t] = function(e) {
                    return this.on(t, e)
                }
            }), at._evalUrl = function(e) {
                return at.ajax({
                    url: e,
                    type: "GET",
                    dataType: "script",
                    async: !1,
                    global: !1,
                    "throws": !0
                })
            }, at.fn.extend({
                wrapAll: function(e) {
                    if (at.isFunction(e)) return this.each(function(t) {
                        at(this).wrapAll(e.call(this, t))
                    });
                    if (this[0]) {
                        var t = at(e, this[0].ownerDocument).eq(0).clone(!0);
                        this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                            for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                            return e
                        }).append(this)
                    }
                    return this
                },
                wrapInner: function(e) {
                    return this.each(at.isFunction(e) ? function(t) {
                        at(this).wrapInner(e.call(this, t))
                    } : function() {
                        var t = at(this),
                            r = t.contents();
                        r.length ? r.wrapAll(e) : t.append(e)
                    })
                },
                wrap: function(e) {
                    var t = at.isFunction(e);
                    return this.each(function(r) {
                        at(this).wrapAll(t ? e.call(this, r) : e)
                    })
                },
                unwrap: function() {
                    return this.parent().each(function() {
                        at.nodeName(this, "body") || at(this).replaceWith(this.childNodes)
                    }).end()
                }
            }), at.expr.filters.hidden = function(e) {
                return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !nt.reliableHiddenOffsets() && "none" === (e.style && e.style.display || at.css(e, "display"))
            }, at.expr.filters.visible = function(e) {
                return !at.expr.filters.hidden(e)
            };
            var Wr = /%20/g,
                Gr = /\[\]$/,
                Xr = /\r?\n/g,
                Kr = /^(?:submit|button|image|reset|file)$/i,
                Qr = /^(?:input|select|textarea|keygen)/i;
            at.param = function(e, t) {
                var r, n = [],
                    o = function(e, t) {
                        t = at.isFunction(t) ? t() : null == t ? "" : t, n[n.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
                    };
                if (void 0 === t && (t = at.ajaxSettings && at.ajaxSettings.traditional), at.isArray(e) || e.jquery && !at.isPlainObject(e)) at.each(e, function() {
                    o(this.name, this.value)
                });
                else
                    for (r in e) V(r, e[r], t, o);
                return n.join("&").replace(Wr, "+")
            }, at.fn.extend({
                serialize: function() {
                    return at.param(this.serializeArray())
                },
                serializeArray: function() {
                    return this.map(function() {
                        var e = at.prop(this, "elements");
                        return e ? at.makeArray(e) : this
                    }).filter(function() {
                        var e = this.type;
                        return this.name && !at(this).is(":disabled") && Qr.test(this.nodeName) && !Kr.test(e) && (this.checked || !St.test(e))
                    }).map(function(e, t) {
                        var r = at(this).val();
                        return null == r ? null : at.isArray(r) ? at.map(r, function(e) {
                            return {
                                name: t.name,
                                value: e.replace(Xr, "\r\n")
                            }
                        }) : {
                            name: t.name,
                            value: r.replace(Xr, "\r\n")
                        }
                    }).get()
                }
            }), at.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function() {
                return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && z() || J()
            } : z;
            var Yr = 0,
                Zr = {},
                en = at.ajaxSettings.xhr();
            e.ActiveXObject && at(e).on("unload", function() {
                for (var e in Zr) Zr[e](void 0, !0)
            }), nt.cors = !!en && "withCredentials" in en, en = nt.ajax = !!en, en && at.ajaxTransport(function(e) {
                if (!e.crossDomain || nt.cors) {
                    var t;
                    return {
                        send: function(r, n) {
                            var o, a = e.xhr(),
                                c = ++Yr;
                            if (a.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                                for (o in e.xhrFields) a[o] = e.xhrFields[o];
                            e.mimeType && a.overrideMimeType && a.overrideMimeType(e.mimeType), e.crossDomain || r["X-Requested-With"] || (r["X-Requested-With"] = "XMLHttpRequest");
                            for (o in r) void 0 !== r[o] && a.setRequestHeader(o, r[o] + "");
                            a.send(e.hasContent && e.data || null), t = function(r, o) {
                                var s, i, u;
                                if (t && (o || 4 === a.readyState))
                                    if (delete Zr[c], t = void 0, a.onreadystatechange = at.noop, o) 4 !== a.readyState && a.abort();
                                    else {
                                        u = {}, s = a.status, "string" == typeof a.responseText && (u.text = a.responseText);
                                        try {
                                            i = a.statusText
                                        } catch (d) {
                                            i = ""
                                        }
                                        s || !e.isLocal || e.crossDomain ? 1223 === s && (s = 204) : s = u.text ? 200 : 404
                                    }
                                u && n(s, i, u, a.getAllResponseHeaders())
                            }, e.async ? 4 === a.readyState ? setTimeout(t) : a.onreadystatechange = Zr[c] = t : t()
                        },
                        abort: function() {
                            t && t(void 0, !0)
                        }
                    }
                }
            }), at.ajaxSetup({
                accepts: {
                    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                },
                contents: {
                    script: /(?:java|ecma)script/
                },
                converters: {
                    "text script": function(e) {
                        return at.globalEval(e), e
                    }
                }
            }), at.ajaxPrefilter("script", function(e) {
                void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
            }), at.ajaxTransport("script", function(e) {
                if (e.crossDomain) {
                    var t, r = gt.head || at("head")[0] || gt.documentElement;
                    return {
                        send: function(n, o) {
                            t = gt.createElement("script"), t.async = !0, e.scriptCharset && (t.charset = e.scriptCharset), t.src = e.url, t.onload = t.onreadystatechange = function(e, r) {
                                (r || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null, t.parentNode && t.parentNode.removeChild(t), t = null, r || o(200, "success"))
                            }, r.insertBefore(t, r.firstChild)
                        },
                        abort: function() {
                            t && t.onload(void 0, !0)
                        }
                    }
                }
            });
            var tn = [],
                rn = /(=)\?(?=&|$)|\?\?/;
            at.ajaxSetup({
                jsonp: "callback",
                jsonpCallback: function() {
                    var e = tn.pop() || at.expando + "_" + Sr++;
                    return this[e] = !0, e
                }
            }), at.ajaxPrefilter("json jsonp", function(t, r, n) {
                var o, a, c, s = t.jsonp !== !1 && (rn.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && rn.test(t.data) && "data");
                return s || "jsonp" === t.dataTypes[0] ? (o = t.jsonpCallback = at.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(rn, "$1" + o) : t.jsonp !== !1 && (t.url += (Nr.test(t.url) ? "&" : "?") + t.jsonp + "=" + o), t.converters["script json"] = function() {
                    return c || at.error(o + " was not called"), c[0]
                }, t.dataTypes[0] = "json", a = e[o], e[o] = function() {
                    c = arguments
                }, n.always(function() {
                    e[o] = a, t[o] && (t.jsonpCallback = r.jsonpCallback, tn.push(o)), c && at.isFunction(a) && a(c[0]), c = a = void 0
                }), "script") : void 0
            }), at.parseHTML = function(e, t, r) {
                if (!e || "string" != typeof e) return null;
                "boolean" == typeof t && (r = t, t = !1), t = t || gt;
                var n = lt.exec(e),
                    o = !r && [];
                return n ? [t.createElement(n[1])] : (n = at.buildFragment([e], t, o), o && o.length && at(o).remove(), at.merge([], n.childNodes))
            };
            var nn = at.fn.load;
            at.fn.load = function(e, t, r) {
                if ("string" != typeof e && nn) return nn.apply(this, arguments);
                var n, o, a, c = this,
                    s = e.indexOf(" ");
                return s >= 0 && (n = e.slice(s, e.length), e = e.slice(0, s)), at.isFunction(t) ? (r = t, t = void 0) : t && "object" == typeof t && (a = "POST"), c.length > 0 && at.ajax({
                    url: e,
                    type: a,
                    dataType: "html",
                    data: t
                }).done(function(e) {
                    o = arguments, c.html(n ? at("<div>").append(at.parseHTML(e)).find(n) : e)
                }).complete(r && function(e, t) {
                    c.each(r, o || [e.responseText, t, e])
                }), this
            }, at.expr.filters.animated = function(e) {
                return at.grep(at.timers, function(t) {
                    return e === t.elem
                }).length
            };
            var on = e.document.documentElement;
            at.offset = {
                setOffset: function(e, t, r) {
                    var n, o, a, c, s, i, u, d = at.css(e, "position"),
                        p = at(e),
                        l = {};
                    "static" === d && (e.style.position = "relative"), s = p.offset(), a = at.css(e, "top"), i = at.css(e, "left"), u = ("absolute" === d || "fixed" === d) && at.inArray("auto", [a, i]) > -1, u ? (n = p.position(), c = n.top, o = n.left) : (c = parseFloat(a) || 0, o = parseFloat(i) || 0), at.isFunction(t) && (t = t.call(e, r, s)), null != t.top && (l.top = t.top - s.top + c), null != t.left && (l.left = t.left - s.left + o), "using" in t ? t.using.call(e, l) : p.css(l)
                }
            }, at.fn.extend({
                offset: function(e) {
                    if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                        at.offset.setOffset(this, e, t)
                    });
                    var t, r, n = {
                            top: 0,
                            left: 0
                        },
                        o = this[0],
                        a = o && o.ownerDocument;
                    if (a) return t = a.documentElement, at.contains(t, o) ? (typeof o.getBoundingClientRect !== _t && (n = o.getBoundingClientRect()), r = W(a), {
                        top: n.top + (r.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                        left: n.left + (r.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
                    }) : n
                },
                position: function() {
                    if (this[0]) {
                        var e, t, r = {
                                top: 0,
                                left: 0
                            },
                            n = this[0];
                        return "fixed" === at.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), at.nodeName(e[0], "html") || (r = e.offset()), r.top += at.css(e[0], "borderTopWidth", !0), r.left += at.css(e[0], "borderLeftWidth", !0)), {
                            top: t.top - r.top - at.css(n, "marginTop", !0),
                            left: t.left - r.left - at.css(n, "marginLeft", !0)
                        }
                    }
                },
                offsetParent: function() {
                    return this.map(function() {
                        for (var e = this.offsetParent || on; e && !at.nodeName(e, "html") && "static" === at.css(e, "position");) e = e.offsetParent;
                        return e || on
                    })
                }
            }), at.each({
                scrollLeft: "pageXOffset",
                scrollTop: "pageYOffset"
            }, function(e, t) {
                var r = /Y/.test(t);
                at.fn[e] = function(n) {
                    return Ft(this, function(e, n, o) {
                        var a = W(e);
                        return void 0 === o ? a ? t in a ? a[t] : a.document.documentElement[n] : e[n] : void(a ? a.scrollTo(r ? at(a).scrollLeft() : o, r ? o : at(a).scrollTop()) : e[n] = o)
                    }, e, n, arguments.length, null)
                }
            }), at.each(["top", "left"], function(e, t) {
                at.cssHooks[t] = D(nt.pixelPosition, function(e, r) {
                    return r ? (r = rr(e, t), or.test(r) ? at(e).position()[t] + "px" : r) : void 0
                })
            }), at.each({
                Height: "height",
                Width: "width"
            }, function(e, t) {
                at.each({
                    padding: "inner" + e,
                    content: t,
                    "": "outer" + e
                }, function(r, n) {
                    at.fn[n] = function(n, o) {
                        var a = arguments.length && (r || "boolean" != typeof n),
                            c = r || (n === !0 || o === !0 ? "margin" : "border");
                        return Ft(this, function(t, r, n) {
                            var o;
                            return at.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement, Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === n ? at.css(t, r, c) : at.style(t, r, n, c)
                        }, t, a ? n : void 0, a, null)
                    }
                })
            }), at.fn.size = function() {
                return this.length
            }, at.fn.andSelf = at.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
                return at
            });
            var an = e.jQuery,
                cn = e.$;
            return at.noConflict = function(t) {
                return e.$ === at && (e.$ = cn), t && e.jQuery === at && (e.jQuery = an), at
            }, typeof t === _t && (e.jQuery = e.$ = at), at
        })
    }).call(this),
        function() {
            e = t = window.jQuery.noConflict()
        }.call(this), "undefined" == typeof Package && (Package = {}), Package.jquery = {
            $: e,
            jQuery: t
        }
}(),
function() {
    var e, t = Package.meteor.Meteor;
    (function() {
        e = {}, e.active = !1, e.currentComputation = null;
        var r = function(t) {
                e.currentComputation = t, e.active = !!t
            },
            n = Object.prototype.hasOwnProperty,
            o = function(e, t) {
                for (var r in t) n.call(t, r) && (e[r] = t[r]);
                return e
            },
            a = function() {
                return "undefined" != typeof t ? t._debug : "undefined" != typeof console && console.log ? function() {
                    console.log.apply(console, arguments)
                } : function() {}
            },
            c = function(e, t) {
                if (h) throw t;
                a()("Exception from Deps " + e + " function:", t.stack || t.message)
            },
            s = function(e, r) {
                "undefined" == typeof t || t.isClient ? e(r) : t._noYieldsAllowed(function() {
                    e(r)
                })
            },
            i = 1,
            u = [],
            d = !1,
            p = !1,
            l = !1,
            h = !1,
            f = [],
            g = function() {
                d || (setTimeout(e.flush, 0), d = !0)
            },
            m = !1;
        e.Computation = function(e, t) {
            if (!m) throw new Error("Deps.Computation constructor is private; use Deps.autorun");
            m = !1;
            var r = this;
            r.stopped = !1, r.invalidated = !1, r.firstRun = !0, r._id = i++, r._onInvalidateCallbacks = [], r._parent = t, r._func = e, r._recomputing = !1;
            var n = !0;
            try {
                r._compute(), n = !1
            } finally {
                r.firstRun = !1, n && r.stop()
            }
        }, o(e.Computation.prototype, {
            onInvalidate: function(t) {
                var r = this;
                if ("function" != typeof t) throw new Error("onInvalidate requires a function");
                r.invalidated ? e.nonreactive(function() {
                    s(t, r)
                }) : r._onInvalidateCallbacks.push(t)
            },
            invalidate: function() {
                var t = this;
                if (!t.invalidated) {
                    t._recomputing || t.stopped || (g(), u.push(this)), t.invalidated = !0;
                    for (var r, n = 0; r = t._onInvalidateCallbacks[n]; n++) e.nonreactive(function() {
                        s(r, t)
                    });
                    t._onInvalidateCallbacks = []
                }
            },
            stop: function() {
                this.stopped || (this.stopped = !0, this.invalidate())
            },
            _compute: function() {
                var t = this;
                t.invalidated = !1;
                var n = e.currentComputation;
                r(t);
                l = !0;
                try {
                    s(t._func, t)
                } finally {
                    r(n), l = !1
                }
            },
            _recompute: function() {
                var e = this;
                e._recomputing = !0;
                try {
                    for (; e.invalidated && !e.stopped;) try {
                        e._compute()
                    } catch (t) {
                        c("recompute", t)
                    }
                } finally {
                    e._recomputing = !1
                }
            }
        }), e.Dependency = function() {
            this._dependentsById = {}
        }, o(e.Dependency.prototype, {
            depend: function(t) {
                if (!t) {
                    if (!e.active) return !1;
                    t = e.currentComputation
                }
                var r = this,
                    n = t._id;
                return n in r._dependentsById ? !1 : (r._dependentsById[n] = t, t.onInvalidate(function() {
                    delete r._dependentsById[n]
                }), !0)
            },
            changed: function() {
                var e = this;
                for (var t in e._dependentsById) e._dependentsById[t].invalidate()
            },
            hasDependents: function() {
                var e = this;
                for (var t in e._dependentsById) return !0;
                return !1
            }
        }), o(e, {
            flush: function(t) {
                if (p) throw new Error("Can't call Deps.flush while flushing");
                if (l) throw new Error("Can't flush inside Deps.autorun");
                p = !0, d = !0, h = !(!t || !t._throwFirstError);
                var r = !1;
                try {
                    for (; u.length || f.length;) {
                        for (; u.length;) {
                            var n = u.shift();
                            n._recompute()
                        }
                        if (f.length) {
                            var o = f.shift();
                            try {
                                o()
                            } catch (a) {
                                c("afterFlush function", a)
                            }
                        }
                    }
                    r = !0
                } finally {
                    r || (p = !1, e.flush({
                        _throwFirstError: !1
                    })), d = !1, p = !1
                }
            },
            autorun: function(t) {
                if ("function" != typeof t) throw new Error("Deps.autorun requires a function argument");
                m = !0;
                var r = new e.Computation(t, e.currentComputation);
                return e.active && e.onInvalidate(function() {
                    r.stop()
                }), r
            },
            nonreactive: function(t) {
                var n = e.currentComputation;
                r(null);
                try {
                    return t()
                } finally {
                    r(n)
                }
            },
            onInvalidate: function(t) {
                if (!e.active) throw new Error("Deps.onInvalidate requires a currentComputation");
                e.currentComputation.onInvalidate(t)
            },
            afterFlush: function(e) {
                f.push(e), g()
            }
        })
    }).call(this),
        function() {
            t.flush = e.flush, t.autorun = e.autorun, t.autosubscribe = e.autorun, e.depend = function(e) {
                return e.depend()
            }
        }.call(this), "undefined" == typeof Package && (Package = {}), Package.deps = {
            Deps: e
        }
}(),
function() {
    {
        var e, t = Package.meteor.Meteor;
        Package.underscore._
    }(function() {
        if (t.isServer) var r = Npm.require("crypto");
        var n = function() {
                function e() {
                    var e = 4022871197,
                        t = function(t) {
                            t = t.toString();
                            for (var r = 0; r < t.length; r++) {
                                e += t.charCodeAt(r);
                                var n = .02519603282416938 * e;
                                e = n >>> 0, n -= e, n *= e, e = n >>> 0, n -= e, e += 4294967296 * n
                            }
                            return 2.3283064365386963e-10 * (e >>> 0)
                        };
                    return t.version = "Mash 0.9", t
                }
                return function(t) {
                    var r = 0,
                        n = 0,
                        o = 0,
                        a = 1;
                    0 == t.length && (t = [+new Date]);
                    var c = e();
                    r = c(" "), n = c(" "), o = c(" ");
                    for (var s = 0; s < t.length; s++) r -= c(t[s]), 0 > r && (r += 1), n -= c(t[s]), 0 > n && (n += 1), o -= c(t[s]), 0 > o && (o += 1);
                    c = null;
                    var i = function() {
                        var e = 2091639 * r + 2.3283064365386963e-10 * a;
                        return r = n, n = o, o = e - (a = 0 | e)
                    };
                    return i.uint32 = function() {
                        return 4294967296 * i()
                    }, i.fract53 = function() {
                        return i() + 1.1102230246251565e-16 * (2097152 * i() | 0)
                    }, i.version = "Alea 0.9", i.args = t, i
                }(Array.prototype.slice.call(arguments))
            },
            o = "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz",
            a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_",
            c = function(e) {
                var t = this;
                void 0 !== e && (t.alea = n.apply(null, e))
            };
        c.prototype.fraction = function() {
            var e = this;
            if (e.alea) return e.alea();
            if (r) {
                var t = parseInt(e.hexString(8), 16);
                return 2.3283064365386963e-10 * t
            }
            if ("undefined" != typeof window && window.crypto && window.crypto.getRandomValues) {
                var n = new Uint32Array(1);
                return window.crypto.getRandomValues(n), 2.3283064365386963e-10 * n[0]
            }
            throw new Error("No random generator available")
        }, c.prototype.hexString = function(e) {
            var t = this;
            if (r && !t.alea) {
                var n, o = Math.ceil(e / 2);
                try {
                    n = r.randomBytes(o)
                } catch (a) {
                    n = r.pseudoRandomBytes(o)
                }
                var c = n.toString("hex");
                return c.substring(0, e)
            }
            for (var s = [], i = 0; e > i; ++i) s.push(t.choice("0123456789abcdef"));
            return s.join("")
        }, c.prototype._randomString = function(e, t) {
            for (var r = this, n = [], o = 0; e > o; o++) n[o] = r.choice(t);
            return n.join("")
        }, c.prototype.id = function(e) {
            var t = this;
            return void 0 === e && (e = 17), t._randomString(e, o)
        }, c.prototype.secret = function(e) {
            var t = this;
            return void 0 === e && (e = 43), t._randomString(e, a)
        }, c.prototype.choice = function(e) {
            var t = Math.floor(this.fraction() * e.length);
            return "string" == typeof e ? e.substr(t, 1) : e[t]
        };
        var s = "undefined" != typeof window && window.innerHeight || "undefined" != typeof document && document.documentElement && document.documentElement.clientHeight || "undefined" != typeof document && document.body && document.body.clientHeight || 1,
            i = "undefined" != typeof window && window.innerWidth || "undefined" != typeof document && document.documentElement && document.documentElement.clientWidth || "undefined" != typeof document && document.body && document.body.clientWidth || 1,
            u = "undefined" != typeof navigator && navigator.userAgent || "";
        e = r || "undefined" != typeof window && window.crypto && window.crypto.getRandomValues ? new c : new c([new Date, s, i, u, Math.random()]), e.createWithSeeds = function() {
            if (0 === arguments.length) throw new Error("No seeds were provided");
            return new c(arguments)
        }
    }).call(this),
        function() {
            t.uuid = function() {
                for (var t = "0123456789abcdef", r = [], n = 0; 36 > n; n++) r[n] = e.choice(t);
                r[14] = "4", r[19] = t.substr(3 & parseInt(r[19], 16) | 8, 1), r[8] = r[13] = r[18] = r[23] = "-";
                var o = r.join("");
                return o
            }
        }.call(this), "undefined" == typeof Package && (Package = {}), Package.random = {
            Random: e
        }
}(),
function() {
    var Meteor = Package.meteor.Meteor,
        JSON;
    (function() {
        window.JSON && (JSON = window.JSON)
    }).call(this),
        function() {
            "object" != typeof JSON && (JSON = {}),
                function() {
                    "use strict";

                    function f(e) {
                        return 10 > e ? "0" + e : e
                    }

                    function quote(e) {
                        return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function(e) {
                            var t = meta[e];
                            return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                        }) + '"' : '"' + e + '"'
                    }

                    function str(e, t) {
                        var r, n, o, a, c, s = gap,
                            i = t[e];
                        switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(e)), "function" == typeof rep && (i = rep.call(t, e, i)), typeof i) {
                            case "string":
                                return quote(i);
                            case "number":
                                return isFinite(i) ? String(i) : "null";
                            case "boolean":
                            case "null":
                                return String(i);
                            case "object":
                                if (!i) return "null";
                                if (gap += indent, c = [], "[object Array]" === Object.prototype.toString.apply(i)) {
                                    for (a = i.length, r = 0; a > r; r += 1) c[r] = str(r, i) || "null";
                                    return o = 0 === c.length ? "[]" : gap ? "[\n" + gap + c.join(",\n" + gap) + "\n" + s + "]" : "[" + c.join(",") + "]", gap = s, o
                                }
                                if (rep && "object" == typeof rep)
                                    for (a = rep.length, r = 0; a > r; r += 1) "string" == typeof rep[r] && (n = rep[r], o = str(n, i), o && c.push(quote(n) + (gap ? ": " : ":") + o));
                                else
                                    for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = str(n, i), o && c.push(quote(n) + (gap ? ": " : ":") + o));
                                return o = 0 === c.length ? "{}" : gap ? "{\n" + gap + c.join(",\n" + gap) + "\n" + s + "}" : "{" + c.join(",") + "}", gap = s, o
                        }
                    }
                    "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
                        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
                    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
                        return this.valueOf()
                    });
                    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                        gap, indent, meta = {
                            "\b": "\\b",
                            "	": "\\t",
                            "\n": "\\n",
                            "\f": "\\f",
                            "\r": "\\r",
                            '"': '\\"',
                            "\\": "\\\\"
                        },
                        rep;
                    "function" != typeof JSON.stringify && (JSON.stringify = function(e, t, r) {
                        var n;
                        if (gap = "", indent = "", "number" == typeof r)
                            for (n = 0; r > n; n += 1) indent += " ";
                        else "string" == typeof r && (indent = r);
                        if (rep = t, t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length)) throw new Error("JSON.stringify");
                        return str("", {
                            "": e
                        })
                    }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
                        function walk(e, t) {
                            var r, n, o = e[t];
                            if (o && "object" == typeof o)
                                for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (n = walk(o, r), void 0 !== n ? o[r] = n : delete o[r]);
                            return reviver.call(e, t, o)
                        }
                        var j;
                        if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(e) {
                                return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                            })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                            "": j
                        }, "") : j;
                        throw new SyntaxError("JSON.parse")
                    })
                }()
        }.call(this), "undefined" == typeof Package && (Package = {}), Package.json = {
            JSON: JSON
        }
}(),
function() {
    var e, t, r, n, o = Package.meteor.Meteor,
        a = Package.json.JSON,
        c = Package.underscore._;
    (function() {
        e = {}, t = {};
        var s = {};
        e.addType = function(e, t) {
            if (c.has(s, e)) throw new Error("Type " + e + " already present");
            s[e] = t
        };
        var i = function(e) {
                return c.isNaN(e) || 1 / 0 === e || e === -1 / 0
            },
            u = [{
                matchJSONValue: function(e) {
                    return c.has(e, "$date") && 1 === c.size(e)
                },
                matchObject: function(e) {
                    return e instanceof Date
                },
                toJSONValue: function(e) {
                    return {
                        $date: e.getTime()
                    }
                },
                fromJSONValue: function(e) {
                    return new Date(e.$date)
                }
            }, {
                matchJSONValue: function(e) {
                    return c.has(e, "$InfNaN") && 1 === c.size(e)
                },
                matchObject: i,
                toJSONValue: function(e) {
                    var t;
                    return t = c.isNaN(e) ? 0 : 1 / 0 === e ? 1 : -1, {
                        $InfNaN: t
                    }
                },
                fromJSONValue: function(e) {
                    return e.$InfNaN / 0
                }
            }, {
                matchJSONValue: function(e) {
                    return c.has(e, "$binary") && 1 === c.size(e)
                },
                matchObject: function(e) {
                    return "undefined" != typeof Uint8Array && e instanceof Uint8Array || e && c.has(e, "$Uint8ArrayPolyfill")
                },
                toJSONValue: function(e) {
                    return {
                        $binary: r(e)
                    }
                },
                fromJSONValue: function(e) {
                    return n(e.$binary)
                }
            }, {
                matchJSONValue: function(e) {
                    return c.has(e, "$escape") && 1 === c.size(e)
                },
                matchObject: function(e) {
                    return c.isEmpty(e) || c.size(e) > 2 ? !1 : c.any(u, function(t) {
                        return t.matchJSONValue(e)
                    })
                },
                toJSONValue: function(t) {
                    var r = {};
                    return c.each(t, function(t, n) {
                        r[n] = e.toJSONValue(t)
                    }), {
                        $escape: r
                    }
                },
                fromJSONValue: function(t) {
                    var r = {};
                    return c.each(t.$escape, function(t, n) {
                        r[n] = e.fromJSONValue(t)
                    }), r
                }
            }, {
                matchJSONValue: function(e) {
                    return c.has(e, "$type") && c.has(e, "$value") && 2 === c.size(e)
                },
                matchObject: function(t) {
                    return e._isCustomType(t)
                },
                toJSONValue: function(e) {
                    var t = o._noYieldsAllowed(function() {
                        return e.toJSONValue()
                    });
                    return {
                        $type: e.typeName(),
                        $value: t
                    }
                },
                fromJSONValue: function(e) {
                    var t = e.$type;
                    if (!c.has(s, t)) throw new Error("Custom EJSON type " + t + " is not defined");
                    var r = s[t];
                    return o._noYieldsAllowed(function() {
                        return r(e.$value)
                    })
                }
            }];
        e._isCustomType = function(e) {
            return e && "function" == typeof e.toJSONValue && "function" == typeof e.typeName && c.has(s, e.typeName())
        };
        var d = e._adjustTypesToJSONValue = function(e) {
                if (null === e) return null;
                var t = p(e);
                return void 0 !== t ? t : "object" != typeof e ? e : (c.each(e, function(t, r) {
                    if ("object" == typeof t || void 0 === t || i(t)) {
                        var n = p(t);
                        return n ? void(e[r] = n) : void d(t)
                    }
                }), e)
            },
            p = function(e) {
                for (var t = 0; t < u.length; t++) {
                    var r = u[t];
                    if (r.matchObject(e)) return r.toJSONValue(e)
                }
                return void 0
            };
        e.toJSONValue = function(t) {
            var r = p(t);
            return void 0 !== r ? r : ("object" == typeof t && (t = e.clone(t), d(t)), t)
        };
        var l = e._adjustTypesFromJSONValue = function(e) {
                if (null === e) return null;
                var t = h(e);
                return t !== e ? t : "object" != typeof e ? e : (c.each(e, function(t, r) {
                    if ("object" == typeof t) {
                        var n = h(t);
                        if (t !== n) return void(e[r] = n);
                        l(t)
                    }
                }), e)
            },
            h = function(e) {
                if ("object" == typeof e && null !== e && c.size(e) <= 2 && c.all(e, function(e, t) {
                        return "string" == typeof t && "$" === t.substr(0, 1)
                    }))
                    for (var t = 0; t < u.length; t++) {
                        var r = u[t];
                        if (r.matchJSONValue(e)) return r.fromJSONValue(e)
                    }
                return e
            };
        e.fromJSONValue = function(t) {
            var r = h(t);
            return r === t && "object" == typeof t ? (t = e.clone(t), l(t), t) : r
        }, e.stringify = function(t, r) {
            var n = e.toJSONValue(t);
            return r && (r.canonical || r.indent) ? e._canonicalStringify(n, r) : a.stringify(n)
        }, e.parse = function(t) {
            if ("string" != typeof t) throw new Error("EJSON.parse argument should be a string");
            return e.fromJSONValue(a.parse(t))
        }, e.isBinary = function(e) {
            return !!("undefined" != typeof Uint8Array && e instanceof Uint8Array || e && e.$Uint8ArrayPolyfill)
        }, e.equals = function(t, r, n) {
            var o, a = !(!n || !n.keyOrderSensitive);
            if (t === r) return !0;
            if (c.isNaN(t) && c.isNaN(r)) return !0;
            if (!t || !r) return !1;
            if ("object" != typeof t || "object" != typeof r) return !1;
            if (t instanceof Date && r instanceof Date) return t.valueOf() === r.valueOf();
            if (e.isBinary(t) && e.isBinary(r)) {
                if (t.length !== r.length) return !1;
                for (o = 0; o < t.length; o++)
                    if (t[o] !== r[o]) return !1;
                return !0
            }
            if ("function" == typeof t.equals) return t.equals(r, n);
            if ("function" == typeof r.equals) return r.equals(t, n);
            if (t instanceof Array) {
                if (!(r instanceof Array)) return !1;
                if (t.length !== r.length) return !1;
                for (o = 0; o < t.length; o++)
                    if (!e.equals(t[o], r[o], n)) return !1;
                return !0
            }
            switch (e._isCustomType(t) + e._isCustomType(r)) {
                case 1:
                    return !1;
                case 2:
                    return e.equals(e.toJSONValue(t), e.toJSONValue(r))
            }
            var s;
            if (a) {
                var i = [];
                return c.each(r, function(e, t) {
                    i.push(t)
                }), o = 0, s = c.all(t, function(t, a) {
                    return o >= i.length ? !1 : a !== i[o] ? !1 : e.equals(t, r[i[o]], n) ? (o++, !0) : !1
                }), s && o === i.length
            }
            return o = 0, s = c.all(t, function(t, a) {
                return c.has(r, a) && e.equals(t, r[a], n) ? (o++, !0) : !1
            }), s && c.size(r) === o
        }, e.clone = function(t) {
            var r;
            if ("object" != typeof t) return t;
            if (null === t) return null;
            if (t instanceof Date) return new Date(t.getTime());
            if (t instanceof RegExp) return t;
            if (e.isBinary(t)) {
                r = e.newBinary(t.length);
                for (var n = 0; n < t.length; n++) r[n] = t[n];
                return r
            }
            if (c.isArray(t) || c.isArguments(t)) {
                for (r = [], n = 0; n < t.length; n++) r[n] = e.clone(t[n]);
                return r
            }
            return "function" == typeof t.clone ? t.clone() : e._isCustomType(t) ? e.fromJSONValue(e.clone(e.toJSONValue(t)), !0) : (r = {}, c.each(t, function(t, n) {
                r[n] = e.clone(t)
            }), r)
        }
    }).call(this),
        function() {
            function t(e) {
                return a.stringify(e)
            }
            var r = function(e, n, o, a, s) {
                var i, u, d, p, l = a,
                    h = n[e];
                switch (typeof h) {
                    case "string":
                        return t(h);
                    case "number":
                        return isFinite(h) ? String(h) : "null";
                    case "boolean":
                        return String(h);
                    case "object":
                        if (!h) return "null";
                        if (l = a + o, p = [], c.isArray(h) || c.isArguments(h)) {
                            for (d = h.length, i = 0; d > i; i += 1) p[i] = r(i, h, o, l, s) || "null";
                            return u = 0 === p.length ? "[]" : l ? "[\n" + l + p.join(",\n" + l) + "\n" + a + "]" : "[" + p.join(",") + "]"
                        }
                        var f = c.keys(h);
                        return s && (f = f.sort()), c.each(f, function(e) {
                            u = r(e, h, o, l, s), u && p.push(t(e) + (l ? ": " : ":") + u)
                        }), u = 0 === p.length ? "{}" : l ? "{\n" + l + p.join(",\n" + l) + "\n" + a + "}" : "{" + p.join(",") + "}"
                }
            };
            e._canonicalStringify = function(e, t) {
                if (t = c.extend({
                        indent: "",
                        canonical: !1
                    }, t), t.indent === !0) t.indent = "  ";
                else if ("number" == typeof t.indent) {
                    for (var n = "", o = 0; o < t.indent; o++) n += " ";
                    t.indent = n
                }
                return r("", {
                    "": e
                }, t.indent, "", t.canonical)
            }
        }.call(this),
        function() {
            for (var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = {}, c = 0; c < o.length; c++) a[o.charAt(c)] = c;
            r = function(e) {
                for (var t = [], r = null, n = null, o = null, a = null, c = 0; c < e.length; c++) switch (c % 3) {
                    case 0:
                        r = e[c] >> 2 & 63, n = (3 & e[c]) << 4;
                        break;
                    case 1:
                        n |= e[c] >> 4 & 15, o = (15 & e[c]) << 2;
                        break;
                    case 2:
                        o |= e[c] >> 6 & 3, a = 63 & e[c], t.push(s(r)), t.push(s(n)), t.push(s(o)), t.push(s(a)), r = null, n = null, o = null, a = null
                }
                return null != r && (t.push(s(r)), t.push(s(n)), t.push(null == o ? "=" : s(o)), null == a && t.push("=")), t.join("")
            };
            var s = function(e) {
                    return o.charAt(e)
                },
                i = function(e) {
                    return "=" === e ? -1 : a[e]
                };
            e.newBinary = function(e) {
                if ("undefined" == typeof Uint8Array || "undefined" == typeof ArrayBuffer) {
                    for (var t = [], r = 0; e > r; r++) t.push(0);
                    return t.$Uint8ArrayPolyfill = !0, t
                }
                return new Uint8Array(new ArrayBuffer(e))
            }, n = function(t) {
                var r = Math.floor(3 * t.length / 4);
                "=" == t.charAt(t.length - 1) && (r--, "=" == t.charAt(t.length - 2) && r--);
                for (var n = e.newBinary(r), o = null, a = null, c = null, s = 0, u = 0; u < t.length; u++) {
                    var d = t.charAt(u),
                        p = i(d);
                    switch (u % 4) {
                        case 0:
                            if (0 > p) throw new Error("invalid base64 string");
                            o = p << 2;
                            break;
                        case 1:
                            if (0 > p) throw new Error("invalid base64 string");
                            o |= p >> 4, n[s++] = o, a = (15 & p) << 4;
                            break;
                        case 2:
                            p >= 0 && (a |= p >> 2, n[s++] = a, c = (3 & p) << 6);
                            break;
                        case 3:
                            p >= 0 && (n[s++] = c | p)
                    }
                }
                return n
            }, t.base64Encode = r, t.base64Decode = n
        }.call(this), "undefined" == typeof Package && (Package = {}), Package.ejson = {
            EJSON: e,
            EJSONTest: t
        }
}(),
function() {
    var e, t = (Package.meteor.Meteor, Package.underscore._);
    (function() {
        var r = function(e, t, r, n) {
            return {
                key: e,
                value: t,
                next: r,
                prev: n
            }
        };
        e = function() {
            var e = this;
            e._dict = {}, e._first = null, e._last = null, e._size = 0;
            var r = t.toArray(arguments);
            e._stringify = function(e) {
                return e
            }, "function" == typeof r[0] && (e._stringify = r.shift()), t.each(r, function(t) {
                e.putBefore(t[0], t[1], null)
            })
        }, t.extend(e.prototype, {
            _k: function(e) {
                return " " + this._stringify(e)
            },
            empty: function() {
                var e = this;
                return !e._first
            },
            size: function() {
                var e = this;
                return e._size
            },
            _linkEltIn: function(e) {
                var t = this;
                e.next ? (e.prev = e.next.prev, e.next.prev = e, e.prev && (e.prev.next = e)) : (e.prev = t._last, t._last && (t._last.next = e), t._last = e), (null === t._first || t._first === e.next) && (t._first = e)
            },
            _linkEltOut: function(e) {
                var t = this;
                e.next && (e.next.prev = e.prev), e.prev && (e.prev.next = e.next), e === t._last && (t._last = e.prev), e === t._first && (t._first = e.next)
            },
            putBefore: function(e, t, n) {
                var o = this;
                if (o._dict[o._k(e)]) throw new Error("Item " + e + " already present in OrderedDict");
                var a = n ? r(e, t, o._dict[o._k(n)]) : r(e, t, null);
                if (void 0 === a.next) throw new Error("could not find item to put this one before");
                o._linkEltIn(a), o._dict[o._k(e)] = a, o._size++
            },
            append: function(e, t) {
                var r = this;
                r.putBefore(e, t, null)
            },
            remove: function(e) {
                var t = this,
                    r = t._dict[t._k(e)];
                if (void 0 === r) throw new Error("Item " + e + " not present in OrderedDict");
                return t._linkEltOut(r), t._size--, delete t._dict[t._k(e)], r.value
            },
            get: function(e) {
                var t = this;
                return t.has(e) ? t._dict[t._k(e)].value : void 0
            },
            has: function(e) {
                var r = this;
                return t.has(r._dict, r._k(e))
            },
            forEach: function(t) {
                for (var r = this, n = 0, o = r._first; null !== o;) {
                    var a = t(o.value, o.key, n);
                    if (a === e.BREAK) return;
                    o = o.next, n++
                }
            },
            first: function() {
                var e = this;
                return e.empty() ? void 0 : e._first.key
            },
            firstValue: function() {
                var e = this;
                return e.empty() ? void 0 : e._first.value
            },
            last: function() {
                var e = this;
                return e.empty() ? void 0 : e._last.key
            },
            lastValue: function() {
                var e = this;
                return e.empty() ? void 0 : e._last.value
            },
            prev: function(e) {
                var t = this;
                if (t.has(e)) {
                    var r = t._dict[t._k(e)];
                    if (r.prev) return r.prev.key
                }
                return null
            },
            next: function(e) {
                var t = this;
                if (t.has(e)) {
                    var r = t._dict[t._k(e)];
                    if (r.next) return r.next.key
                }
                return null
            },
            moveBefore: function(e, t) {
                var r = this,
                    n = r._dict[r._k(e)],
                    o = t ? r._dict[r._k(t)] : null;
                if (void 0 === n) throw new Error("Item to move is not present");
                if (void 0 === o) throw new Error("Could not find element to move this one before");
                o !== n.next && (r._linkEltOut(n), n.next = o, r._linkEltIn(n))
            },
            indexOf: function(t) {
                var r = this,
                    n = null;
                return r.forEach(function(o, a, c) {
                    return r._k(a) === r._k(t) ? (n = c, e.BREAK) : void 0
                }), n
            },
            _checkRep: function() {
                var e = this;
                t.each(e._dict, function(e, t) {
                    if (t.next === t) throw new Error("Next is a loop");
                    if (t.prev === t) throw new Error("Prev is a loop")
                })
            }
        }), e.BREAK = {
            "break": !0
        }
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["ordered-dict"] = {
        OrderedDict: e
    }
}(),
function() {
    var e, t = (Package.meteor.Meteor, Package.underscore._),
        r = Package.json.JSON,
        n = Package.ejson.EJSON;
    (function() {
        e = function(e, t) {
            var n = this;
            n._map = {}, n._idStringify = e || r.stringify, n._idParse = t || r.parse
        }, t.extend(e.prototype, {
            get: function(e) {
                var t = this,
                    r = t._idStringify(e);
                return t._map[r]
            },
            set: function(e, t) {
                var r = this,
                    n = r._idStringify(e);
                r._map[n] = t
            },
            remove: function(e) {
                var t = this,
                    r = t._idStringify(e);
                delete t._map[r]
            },
            has: function(e) {
                var r = this,
                    n = r._idStringify(e);
                return t.has(r._map, n)
            },
            empty: function() {
                var e = this;
                return t.isEmpty(e._map)
            },
            clear: function() {
                var e = this;
                e._map = {}
            },
            forEach: function(e) {
                for (var r = this, n = t.keys(r._map), o = 0; o < n.length; o++) {
                    var a = e.call(null, r._map[n[o]], r._idParse(n[o]));
                    if (a === !1) return
                }
            },
            size: function() {
                var e = this;
                return t.size(e._map)
            },
            setDefault: function(e, r) {
                var n = this,
                    o = n._idStringify(e);
                return t.has(n._map, o) ? n._map[o] : (n._map[o] = r, r)
            },
            clone: function() {
                var t = this,
                    r = new e(t._idStringify, t._idParse);
                return t.forEach(function(e, t) {
                    r.set(t, n.clone(e))
                }), r
            }
        })
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["id-map"] = {
        IdMap: e
    }
}(),
function() {
    {
        var e, t;
        Package.meteor.Meteor
    }(function() {
        t = {
            exports: {}
        }
    }).call(this),
        function() {
            ! function() {
                function e(e) {
                    for (var t = [], r = [], n = 0; n < e[0].length; n++) t.push(e[0][n][1]), r.push(e[0][n][0]);
                    return t = t.sort(function(e, t) {
                        return e - t
                    }), r = r.sort(function(e, t) {
                        return e - t
                    }), [
                        [t[0], r[0]],
                        [t[t.length - 1], r[r.length - 1]]
                    ]
                }

                function r(e, t, r) {
                    for (var n = [
                            [0, 0]
                        ], o = 0; o < r.length; o++) {
                        for (var a = 0; a < r[o].length; a++) n.push(r[o][a]);
                        n.push([0, 0])
                    }
                    for (var c = !1, o = 0, a = n.length - 1; o < n.length; a = o++) n[o][0] > t != n[a][0] > t && e < (n[a][1] - n[o][1]) * (t - n[o][0]) / (n[a][0] - n[o][0]) + n[o][1] && (c = !c);
                    return c
                }
                var n = {};
                "undefined" != typeof t && t.exports && (t.exports = n), n.lineStringsIntersect = function(e, t) {
                    for (var r = [], n = 0; n <= e.coordinates.length - 2; ++n)
                        for (var o = 0; o <= t.coordinates.length - 2; ++o) {
                            var a = {
                                    x: e.coordinates[n][1],
                                    y: e.coordinates[n][0]
                                },
                                c = {
                                    x: e.coordinates[n + 1][1],
                                    y: e.coordinates[n + 1][0]
                                },
                                s = {
                                    x: t.coordinates[o][1],
                                    y: t.coordinates[o][0]
                                },
                                i = {
                                    x: t.coordinates[o + 1][1],
                                    y: t.coordinates[o + 1][0]
                                },
                                u = (i.x - s.x) * (a.y - s.y) - (i.y - s.y) * (a.x - s.x),
                                d = (c.x - a.x) * (a.y - s.y) - (c.y - a.y) * (a.x - s.x),
                                p = (i.y - s.y) * (c.x - a.x) - (i.x - s.x) * (c.y - a.y);
                            if (0 != p) {
                                var l = u / p,
                                    h = d / p;
                                l >= 0 && 1 >= l && h >= 0 && 1 >= h && r.push({
                                    type: "Point",
                                    coordinates: [a.x + l * (c.x - a.x), a.y + l * (c.y - a.y)]
                                })
                            }
                        }
                    return 0 == r.length && (r = !1), r
                }, n.pointInBoundingBox = function(e, t) {
                    return !(e.coordinates[1] < t[0][0] || e.coordinates[1] > t[1][0] || e.coordinates[0] < t[0][1] || e.coordinates[0] > t[1][1])
                }, n.pointInPolygon = function(t, o) {
                    for (var a = "Polygon" == o.type ? [o.coordinates] : o.coordinates, c = !1, s = 0; s < a.length; s++) n.pointInBoundingBox(t, e(a[s])) && (c = !0);
                    if (!c) return !1;
                    for (var i = !1, s = 0; s < a.length; s++) r(t.coordinates[1], t.coordinates[0], a[s]) && (i = !0);
                    return i
                }, n.numberToRadius = function(e) {
                    return e * Math.PI / 180
                }, n.numberToDegree = function(e) {
                    return 180 * e / Math.PI
                }, n.drawCircle = function(e, t, r) {
                    for (var o = [t.coordinates[1], t.coordinates[0]], a = e / 1e3 / 6371, c = [n.numberToRadius(o[0]), n.numberToRadius(o[1])], r = r || 15, s = [
                            [o[0], o[1]]
                        ], i = 0; r > i; i++) {
                        var u = 2 * Math.PI * i / r,
                            d = Math.asin(Math.sin(c[0]) * Math.cos(a) + Math.cos(c[0]) * Math.sin(a) * Math.cos(u)),
                            p = c[1] + Math.atan2(Math.sin(u) * Math.sin(a) * Math.cos(c[0]), Math.cos(a) - Math.sin(c[0]) * Math.sin(d));
                        s[i] = [], s[i][1] = n.numberToDegree(d), s[i][0] = n.numberToDegree(p)
                    }
                    return {
                        type: "Polygon",
                        coordinates: [s]
                    }
                }, n.rectangleCentroid = function(e) {
                    var t = e.coordinates[0],
                        r = t[0][0],
                        n = t[0][1],
                        o = t[2][0],
                        a = t[2][1],
                        c = o - r,
                        s = a - n;
                    return {
                        type: "Point",
                        coordinates: [r + c / 2, n + s / 2]
                    }
                }, n.pointDistance = function(e, t) {
                    var r = e.coordinates[0],
                        o = e.coordinates[1],
                        a = t.coordinates[0],
                        c = t.coordinates[1],
                        s = n.numberToRadius(c - o),
                        i = n.numberToRadius(a - r),
                        u = Math.pow(Math.sin(s / 2), 2) + Math.cos(n.numberToRadius(o)) * Math.cos(n.numberToRadius(c)) * Math.pow(Math.sin(i / 2), 2),
                        d = 2 * Math.atan2(Math.sqrt(u), Math.sqrt(1 - u));
                    return 6371 * d * 1e3
                }, n.geometryWithinRadius = function(e, t, r) {
                    if ("Point" == e.type) return n.pointDistance(e, t) <= r;
                    if ("LineString" == e.type || "Polygon" == e.type) {
                        var o, a = {};
                        o = "Polygon" == e.type ? e.coordinates[0] : e.coordinates;
                        for (var c in o)
                            if (a.coordinates = o[c], n.pointDistance(a, t) > r) return !1
                    }
                    return !0
                }, n.area = function(e) {
                    for (var t, r, n = 0, o = e.coordinates[0], a = o.length - 1, c = 0; c < o.length; a = c++) {
                        var t = {
                                x: o[c][1],
                                y: o[c][0]
                            },
                            r = {
                                x: o[a][1],
                                y: o[a][0]
                            };
                        n += t.x * r.y, n -= t.y * r.x
                    }
                    return n /= 2
                }, n.centroid = function(e) {
                    for (var t, r, o, a = 0, c = 0, s = e.coordinates[0], i = s.length - 1, u = 0; u < s.length; i = u++) {
                        var r = {
                                x: s[u][1],
                                y: s[u][0]
                            },
                            o = {
                                x: s[i][1],
                                y: s[i][0]
                            };
                        t = r.x * o.y - o.x * r.y, a += (r.x + o.x) * t, c += (r.y + o.y) * t
                    }
                    return t = 6 * n.area(e), {
                        type: "Point",
                        coordinates: [c / t, a / t]
                    }
                }, n.simplify = function(e, t) {
                    t = t || 20, e = e.map(function(e) {
                        return {
                            lng: e.coordinates[0],
                            lat: e.coordinates[1]
                        }
                    });
                    var r, n, o, a, c, s, i, u, d, p, l, h, f, g, m, v, y, E, b, A = Math.PI / 180 * .5,
                        C = new Array,
                        w = new Array,
                        _ = new Array;
                    if (e.length < 3) return e;
                    for (r = e.length, p = 360 * t / (2 * Math.PI * 6378137), p *= p, o = 0, w[0] = 0, _[0] = r - 1, n = 1; n > 0;)
                        if (a = w[n - 1], c = _[n - 1], n--, c - a > 1) {
                            for (l = e[c].lng() - e[a].lng(), h = e[c].lat() - e[a].lat(), Math.abs(l) > 180 && (l = 360 - Math.abs(l)), l *= Math.cos(A * (e[c].lat() + e[a].lat())), f = l * l + h * h, s = a + 1, i = a, d = -1; c > s; s++) g = e[s].lng() - e[a].lng(), m = e[s].lat() - e[a].lat(), Math.abs(g) > 180 && (g = 360 - Math.abs(g)), g *= Math.cos(A * (e[s].lat() + e[a].lat())), v = g * g + m * m, y = e[s].lng() - e[c].lng(), E = e[s].lat() - e[c].lat(), Math.abs(y) > 180 && (y = 360 - Math.abs(y)), y *= Math.cos(A * (e[s].lat() + e[c].lat())), b = y * y + E * E, u = v >= f + b ? b : b >= f + v ? v : (g * h - m * l) * (g * h - m * l) / f, u > d && (i = s, d = u);
                            p > d ? (C[o] = a, o++) : (n++, w[n - 1] = i, _[n - 1] = c, n++, w[n - 1] = a, _[n - 1] = i)
                        } else C[o] = a, o++;
                    C[o] = r - 1, o++;
                    for (var x = new Array, s = 0; o > s; s++) x.push(e[C[s]]);
                    return x.map(function(e) {
                        return {
                            type: "Point",
                            coordinates: [e.lng, e.lat]
                        }
                    })
                }, n.destinationPoint = function(e, t, r) {
                    r /= 6371, t = n.numberToRadius(t);
                    var o = n.numberToRadius(e.coordinates[0]),
                        a = n.numberToRadius(e.coordinates[1]),
                        c = Math.asin(Math.sin(o) * Math.cos(r) + Math.cos(o) * Math.sin(r) * Math.cos(t)),
                        s = a + Math.atan2(Math.sin(t) * Math.sin(r) * Math.cos(o), Math.cos(r) - Math.sin(o) * Math.sin(c));
                    return s = (s + 3 * Math.PI) % (2 * Math.PI) - Math.PI, {
                        type: "Point",
                        coordinates: [n.numberToDegree(c), n.numberToDegree(s)]
                    }
                }
            }()
        }.call(this),
        function() {
            e = t.exports
        }.call(this), "undefined" == typeof Package && (Package = {}), Package["geojson-utils"] = {
            GeoJSON: e
        }
}(),
function() {
    var e, t, r, n, o, a, c, s, i, u, d, p, l, h, f, g, m = Package.meteor.Meteor,
        v = Package.underscore._,
        y = Package.json.JSON,
        E = Package.ejson.EJSON,
        b = Package["id-map"].IdMap,
        A = Package["ordered-dict"].OrderedDict,
        C = Package.deps.Deps,
        w = Package.random.Random,
        _ = Package["geojson-utils"].GeoJSON;
    (function() {
        e = function(t) {
            var r = this;
            r.name = t, r._docs = new e._IdMap, r._observeQueue = new m._SynchronousQueue, r.next_qid = 1, r.queries = {}, r._savedOriginals = null, r.paused = !1
        }, t = {}, r = {}, e._applyChanges = function(e, t) {
            v.each(t, function(t, r) {
                void 0 === t ? delete e[r] : e[r] = t
            })
        }, n = function(e) {
            var t = new Error(e);
            return t.name = "MinimongoError", t
        }, e.prototype.find = function(t, r) {
            return 0 === arguments.length && (t = {}), new e.Cursor(this, t, r)
        }, e.Cursor = function(r, n, o) {
            var a = this;
            o || (o = {}), a.collection = r, a.sorter = null, e._selectorIsId(n) ? (a._selectorId = n, a.matcher = new t.Matcher(n, a)) : (a._selectorId = void 0, a.matcher = new t.Matcher(n, a), (a.matcher.hasGeoQuery() || o.sort) && (a.sorter = new t.Sorter(o.sort || [], {
                matcher: a.matcher
            }))), a.skip = o.skip, a.limit = o.limit, a.fields = o.fields, a.fields && (a.projectionFn = e._compileProjection(a.fields)), a._transform = e.wrapTransform(o.transform), a.db_objects = null, a.cursor_pos = 0, "undefined" != typeof C && (a.reactive = void 0 === o.reactive ? !0 : o.reactive)
        }, e.Cursor.prototype.rewind = function() {
            var e = this;
            e.db_objects = null, e.cursor_pos = 0
        }, e.prototype.findOne = function(e, t) {
            return 0 === arguments.length && (e = {}), t = t || {}, t.limit = 1, this.find(e, t).fetch()[0]
        }, e.Cursor.prototype.forEach = function(e, t) {
            var r = this;
            for (null === r.db_objects && (r.db_objects = r._getRawObjects({
                    ordered: !0
                })), r.reactive && r._depend({
                    addedBefore: !0,
                    removed: !0,
                    changed: !0,
                    movedBefore: !0
                }); r.cursor_pos < r.db_objects.length;) {
                var n = E.clone(r.db_objects[r.cursor_pos]);
                r.projectionFn && (n = r.projectionFn(n)), r._transform && (n = r._transform(n)), e.call(t, n, r.cursor_pos, r), ++r.cursor_pos
            }
        }, e.Cursor.prototype.getTransform = function() {
            return this._transform
        }, e.Cursor.prototype.map = function(e, t) {
            var r = this,
                n = [];
            return r.forEach(function(o, a) {
                n.push(e.call(t, o, a, r))
            }), n
        }, e.Cursor.prototype.fetch = function() {
            var e = this,
                t = [];
            return e.forEach(function(e) {
                t.push(e)
            }), t
        }, e.Cursor.prototype.count = function() {
            var e = this;
            return e.reactive && e._depend({
                added: !0,
                removed: !0
            }, !0), null === e.db_objects && (e.db_objects = e._getRawObjects({
                ordered: !0
            })), e.db_objects.length
        }, e.Cursor.prototype._publishCursor = function(e) {
            var t = this;
            if (!t.collection.name) throw new Error("Can't publish a cursor from a collection without a name.");
            var r = t.collection.name;
            return m.Collection._publishCursor(t, e, r)
        }, e.Cursor.prototype._getCollectionName = function() {
            var e = this;
            return e.collection.name
        }, e._observeChangesCallbacksAreOrdered = function(e) {
            if (e.added && e.addedBefore) throw new Error("Please specify only one of added() and addedBefore()");
            return !(!e.addedBefore && !e.movedBefore)
        }, e._observeCallbacksAreOrdered = function(e) {
            if (e.addedAt && e.added) throw new Error("Please specify only one of added() and addedAt()");
            if (e.changedAt && e.changed) throw new Error("Please specify only one of changed() and changedAt()");
            if (e.removed && e.removedAt) throw new Error("Please specify only one of removed() and removedAt()");
            return !!(e.addedAt || e.movedTo || e.changedAt || e.removedAt)
        }, e.ObserveHandle = function() {}, v.extend(e.Cursor.prototype, {
            observe: function(t) {
                var r = this;
                return e._observeFromObserveChanges(r, t)
            },
            observeChanges: function(t) {
                var r = this,
                    n = e._observeChangesCallbacksAreOrdered(t);
                if (!t._allow_unordered && !n && (r.skip || r.limit)) throw new Error("must use ordered observe with skip or limit");
                if (r.fields && (0 === r.fields._id || r.fields._id === !1)) throw Error("You may not observe a cursor with {fields: {_id: 0}}");
                var o, a = {
                    matcher: r.matcher,
                    sorter: n && r.sorter,
                    distances: r.matcher.hasGeoQuery() && n && new e._IdMap,
                    resultsSnapshot: null,
                    ordered: n,
                    cursor: r,
                    projectionFn: r.projectionFn
                };
                r.reactive && (o = r.collection.next_qid++, r.collection.queries[o] = a), a.results = r._getRawObjects({
                    ordered: n,
                    distances: a.distances
                }), r.collection.paused && (a.resultsSnapshot = n ? [] : new e._IdMap);
                var c = function(e, t, n) {
                    return e ? function() {
                        var o = this,
                            a = arguments;
                        r.collection.paused || void 0 !== t && r.projectionFn && (a[t] = r.projectionFn(a[t]), n && v.isEmpty(a[t])) || r.collection._observeQueue.queueTask(function() {
                            e.apply(o, a)
                        })
                    } : function() {}
                };
                if (a.added = c(t.added, 1), a.changed = c(t.changed, 1, !0), a.removed = c(t.removed), n && (a.addedBefore = c(t.addedBefore, 1), a.movedBefore = c(t.movedBefore)), !t._suppress_initial && !r.collection.paused) {
                    var s = n ? v.bind(v.each, null, a.results) : v.bind(a.results.forEach, a.results);
                    s(function(e) {
                        var t = E.clone(e);
                        delete t._id, n && a.addedBefore(e._id, t, null), a.added(e._id, t)
                    })
                }
                var i = new e.ObserveHandle;
                return v.extend(i, {
                    collection: r.collection,
                    stop: function() {
                        r.reactive && delete r.collection.queries[o]
                    }
                }), r.reactive && C.active && C.onInvalidate(function() {
                    i.stop()
                }), r.collection._observeQueue.drain(), i
            }
        }), e.Cursor.prototype._getRawObjects = function(t) {
            var r = this;
            t = t || {};
            var n = t.ordered ? [] : new e._IdMap;
            if (void 0 !== r._selectorId) {
                if (r.skip) return n;
                var o = r.collection._docs.get(r._selectorId);
                return o && (t.ordered ? n.push(o) : n.set(r._selectorId, o)), n
            }
            var a;
            if (r.matcher.hasGeoQuery() && t.ordered && (t.distances ? (a = t.distances, a.clear()) : a = new e._IdMap), r.collection._docs.forEach(function(e, o) {
                    var c = r.matcher.documentMatches(e);
                    return c.result && (t.ordered ? (n.push(e), a && void 0 !== c.distance && a.set(o, c.distance)) : n.set(o, e)), !r.limit || r.skip || r.sorter || n.length !== r.limit ? !0 : !1
                }), !t.ordered) return n;
            if (r.sorter) {
                var c = r.sorter.getComparator({
                    distances: a
                });
                n.sort(c)
            }
            var s = r.skip || 0,
                i = r.limit ? r.limit + s : n.length;
            return n.slice(s, i)
        }, e.Cursor.prototype._depend = function(e, t) {
            var r = this;
            if (C.active) {
                var n = new C.Dependency;
                n.depend();
                var o = v.bind(n.changed, n),
                    a = {
                        _suppress_initial: !0,
                        _allow_unordered: t
                    };
                v.each(["added", "changed", "removed", "addedBefore", "movedBefore"], function(t) {
                    e[t] && (a[t] = o)
                }), r.observeChanges(a)
            }
        }, e.prototype.insert = function(t, r) {
            var o = this;
            t = E.clone(t), v.has(t, "_id") || (t._id = e._useOID ? new e._ObjectID : w.id());
            var a = t._id;
            if (o._docs.has(a)) throw n("Duplicate _id '" + a + "'");
            o._saveOriginal(a, void 0), o._docs.set(a, t);
            var c = [];
            for (var s in o.queries) {
                var i = o.queries[s],
                    u = i.matcher.documentMatches(t);
                u.result && (i.distances && void 0 !== u.distance && i.distances.set(a, u.distance), i.cursor.skip || i.cursor.limit ? c.push(s) : e._insertInResults(i, t))
            }
            return v.each(c, function(t) {
                o.queries[t] && e._recomputeResults(o.queries[t])
            }), o._observeQueue.drain(), r && m.defer(function() {
                r(null, a)
            }), a
        }, e.prototype._eachPossiblyMatchingDoc = function(t, r) {
            var n = this,
                o = e._idsMatchedBySelector(t);
            if (o)
                for (var a = 0; a < o.length; ++a) {
                    var c = o[a],
                        s = n._docs.get(c);
                    if (s) {
                        var i = r(s, c);
                        if (i === !1) break
                    }
                } else n._docs.forEach(r)
        }, e.prototype.remove = function(r, n) {
            var o = this;
            if (o.paused && !o._savedOriginals && E.equals(r, {})) {
                var a = o._docs.size();
                return o._docs.clear(), v.each(o.queries, function(e) {
                    e.ordered ? e.results = [] : e.results.clear()
                }), n && m.defer(function() {
                    n(null, a)
                }), a
            }
            var c = new t.Matcher(r, o),
                s = [];
            o._eachPossiblyMatchingDoc(r, function(e, t) {
                c.documentMatches(e).result && s.push(t)
            });
            for (var i = [], u = [], d = 0; d < s.length; d++) {
                var p = s[d],
                    l = o._docs.get(p);
                v.each(o.queries, function(e, t) {
                    e.matcher.documentMatches(l).result && (e.cursor.skip || e.cursor.limit ? i.push(t) : u.push({
                        qid: t,
                        doc: l
                    }))
                }), o._saveOriginal(p, l), o._docs.remove(p)
            }
            return v.each(u, function(t) {
                var r = o.queries[t.qid];
                r && (r.distances && r.distances.remove(t.doc._id), e._removeFromResults(r, t.doc))
            }), v.each(i, function(t) {
                var r = o.queries[t];
                r && e._recomputeResults(r)
            }), o._observeQueue.drain(), a = s.length, n && m.defer(function() {
                n(null, a)
            }), a
        }, e.prototype.update = function(r, n, o, a) {
            var c = this;
            !a && o instanceof Function && (a = o, o = null), o || (o = {});
            var s = new t.Matcher(r, c),
                i = {};
            v.each(c.queries, function(e, t) {
                !e.cursor.skip && !e.cursor.limit || e.paused || (i[t] = E.clone(e.results))
            });
            var u = {},
                d = 0;
            c._eachPossiblyMatchingDoc(r, function(e, t) {
                var r = s.documentMatches(e);
                return r.result && (c._saveOriginal(t, e), c._modifyAndNotify(e, n, u, r.arrayIndices), ++d, !o.multi) ? !1 : !0
            }), v.each(u, function(t, r) {
                var n = c.queries[r];
                n && e._recomputeResults(n, i[r])
            }), c._observeQueue.drain();
            var p;
            if (0 === d && o.upsert) {
                var l = e._removeDollarOperators(r);
                e._modify(l, n, {
                    isInsert: !0
                }), !l._id && o.insertedId && (l._id = o.insertedId), p = c.insert(l), d = 1
            }
            var h;
            return o._returnObject ? (h = {
                numberAffected: d
            }, void 0 !== p && (h.insertedId = p)) : h = d, a && m.defer(function() {
                a(null, h)
            }), h
        }, e.prototype.upsert = function(e, t, r, n) {
            var o = this;
            return n || "function" != typeof r || (n = r, r = {}), o.update(e, t, v.extend({}, r, {
                upsert: !0,
                _returnObject: !0
            }), n)
        }, e.prototype._modifyAndNotify = function(t, r, n, o) {
            var a = this,
                c = {};
            for (var s in a.queries) {
                var i = a.queries[s];
                c[s] = i.ordered ? i.matcher.documentMatches(t).result : i.results.has(t._id)
            }
            var u = E.clone(t);
            e._modify(t, r, {
                arrayIndices: o
            });
            for (s in a.queries) {
                i = a.queries[s];
                var d = c[s],
                    p = i.matcher.documentMatches(t),
                    l = p.result;
                l && i.distances && void 0 !== p.distance && i.distances.set(t._id, p.distance), i.cursor.skip || i.cursor.limit ? (d || l) && (n[s] = !0) : d && !l ? e._removeFromResults(i, t) : !d && l ? e._insertInResults(i, t) : d && l && e._updateInResults(i, t, u)
            }
        }, e._insertInResults = function(t, r) {
            var n = E.clone(r);
            if (delete n._id, t.ordered) {
                if (t.sorter) {
                    var o = e._insertInSortedList(t.sorter.getComparator({
                            distances: t.distances
                        }), t.results, r),
                        a = t.results[o + 1];
                    a = a ? a._id : null, t.addedBefore(r._id, n, a)
                } else t.addedBefore(r._id, n, null), t.results.push(r);
                t.added(r._id, n)
            } else t.added(r._id, n), t.results.set(r._id, r)
        }, e._removeFromResults = function(t, r) {
            if (t.ordered) {
                var n = e._findInOrderedResults(t, r);
                t.removed(r._id), t.results.splice(n, 1)
            } else {
                var o = r._id;
                t.removed(r._id), t.results.remove(o)
            }
        }, e._updateInResults = function(t, r, n) {
            if (!E.equals(r._id, n._id)) throw new Error("Can't change a doc's _id while updating");
            var o = e._makeChangedFields(r, n);
            if (!t.ordered) return void(v.isEmpty(o) || (t.changed(r._id, o), t.results.set(r._id, r)));
            var a = e._findInOrderedResults(t, r);
            if (v.isEmpty(o) || t.changed(r._id, o), t.sorter) {
                t.results.splice(a, 1);
                var c = e._insertInSortedList(t.sorter.getComparator({
                    distances: t.distances
                }), t.results, r);
                if (a !== c) {
                    var s = t.results[c + 1];
                    s = s ? s._id : null, t.movedBefore && t.movedBefore(r._id, s)
                }
            }
        }, e._recomputeResults = function(t, r) {
            r || (r = t.results), t.distances && t.distances.clear(), t.results = t.cursor._getRawObjects({
                ordered: t.ordered,
                distances: t.distances
            }), t.paused || e._diffQueryChanges(t.ordered, r, t.results, t)
        }, e._findInOrderedResults = function(e, t) {
            if (!e.ordered) throw new Error("Can't call _findInOrderedResults on unordered query");
            for (var r = 0; r < e.results.length; r++)
                if (e.results[r] === t) return r;
            throw Error("object missing from query")
        }, e._binarySearch = function(e, t, r) {
            for (var n = 0, o = t.length; o > 0;) {
                var a = Math.floor(o / 2);
                e(r, t[n + a]) >= 0 ? (n += a + 1, o -= a + 1) : o = a
            }
            return n
        }, e._insertInSortedList = function(t, r, n) {
            if (0 === r.length) return r.push(n), 0;
            var o = e._binarySearch(t, r, n);
            return r.splice(o, 0, n), o
        }, e.prototype.saveOriginals = function() {
            var t = this;
            if (t._savedOriginals) throw new Error("Called saveOriginals twice without retrieveOriginals");
            t._savedOriginals = new e._IdMap
        }, e.prototype.retrieveOriginals = function() {
            var e = this;
            if (!e._savedOriginals) throw new Error("Called retrieveOriginals without saveOriginals");
            var t = e._savedOriginals;
            return e._savedOriginals = null, t
        }, e.prototype._saveOriginal = function(e, t) {
            var r = this;
            r._savedOriginals && (r._savedOriginals.has(e) || r._savedOriginals.set(e, E.clone(t)))
        }, e.prototype.pauseObservers = function() {
            if (!this.paused) {
                this.paused = !0;
                for (var e in this.queries) {
                    var t = this.queries[e];
                    t.resultsSnapshot = E.clone(t.results)
                }
            }
        }, e.prototype.resumeObservers = function() {
            var t = this;
            if (this.paused) {
                this.paused = !1;
                for (var r in this.queries) {
                    var n = t.queries[r];
                    e._diffQueryChanges(n.ordered, n.resultsSnapshot, n.results, n), n.resultsSnapshot = null
                }
                t._observeQueue.drain()
            }
        }, e._idStringify = function(t) {
            if (t instanceof e._ObjectID) return t.valueOf();
            if ("string" == typeof t) return "" === t ? t : "-" === t.substr(0, 1) || "~" === t.substr(0, 1) || e._looksLikeObjectID(t) || "{" === t.substr(0, 1) ? "-" + t : t;
            if (void 0 === t) return "-";
            if ("object" == typeof t && null !== t) throw new Error("Meteor does not currently support objects other than ObjectID as ids");
            return "~" + y.stringify(t)
        }, e._idParse = function(t) {
            return "" === t ? t : "-" === t ? void 0 : "-" === t.substr(0, 1) ? t.substr(1) : "~" === t.substr(0, 1) ? y.parse(t.substr(1)) : e._looksLikeObjectID(t) ? new e._ObjectID(t) : t
        }, e._makeChangedFields = function(t, r) {
            var n = {};
            return e._diffObjects(r, t, {
                leftOnly: function(e) {
                    n[e] = void 0
                },
                rightOnly: function(e, t) {
                    n[e] = t
                },
                both: function(e, t, r) {
                    E.equals(t, r) || (n[e] = r)
                }
            }), n
        }
    }).call(this),
        function() {
            e.wrapTransform = function(e) {
                return e ? function(t) {
                    if (!v.has(t, "_id")) throw new Error("can only transform documents with _id");
                    var r = t._id,
                        n = C.nonreactive(function() {
                            return e(t)
                        });
                    if (!a(n)) throw new Error("transform must return object");
                    if (v.has(n, "_id")) {
                        if (!E.equals(n._id, r)) throw new Error("transformed document can't have different _id")
                    } else n._id = r;
                    return n
                } : null
            }
        }.call(this),
        function() {
            o = function(e) {
                return v.isArray(e) && !E.isBinary(e)
            }, a = e._isPlainObject = function(t) {
                return t && 3 === e._f._type(t)
            }, c = function(e) {
                return o(e) || a(e)
            }, s = function(e, t) {
                if (!a(e)) return !1;
                var r = void 0;
                return v.each(e, function(n, o) {
                    var a = "$" === o.substr(0, 1);
                    if (void 0 === r) r = a;
                    else if (r !== a) {
                        if (!t) throw new Error("Inconsistent operator: " + y.stringify(e));
                        r = !1
                    }
                }), !!r
            }, i = function(e) {
                return /^[0-9]+$/.test(e)
            }
        }.call(this),
        function() {
            t.Matcher = function(e) {
                var t = this;
                t._paths = {}, t._hasGeoQuery = !1, t._hasWhere = !1, t._isSimple = !0, t._matchingDocument = void 0, t._selector = null, t._docMatcher = t._compileSelector(e)
            }, v.extend(t.Matcher.prototype, {
                documentMatches: function(e) {
                    if (!e || "object" != typeof e) throw Error("documentMatches needs a document");
                    return this._docMatcher(e)
                },
                hasGeoQuery: function() {
                    return this._hasGeoQuery
                },
                hasWhere: function() {
                    return this._hasWhere
                },
                isSimple: function() {
                    return this._isSimple
                },
                _compileSelector: function(t) {
                    var r = this;
                    if (t instanceof Function) return r._isSimple = !1, r._selector = t, r._recordPathUsed(""),
                        function(e) {
                            return {
                                result: !!t.call(e)
                            }
                        };
                    if (e._selectorIsId(t)) return r._selector = {
                            _id: t
                        }, r._recordPathUsed("_id"),
                        function(e) {
                            return {
                                result: E.equals(e._id, t)
                            }
                        };
                    if (!t || "_id" in t && !t._id) return r._isSimple = !1, T;
                    if ("boolean" == typeof t || o(t) || E.isBinary(t)) throw new Error("Invalid selector: " + t);
                    return r._selector = E.clone(t), n(t, r, {
                        isRoot: !0
                    })
                },
                _recordPathUsed: function(e) {
                    this._paths[e] = !0
                },
                _getPaths: function() {
                    return v.keys(this._paths)
                }
            });
            var n = function(e, t, r) {
                    r = r || {};
                    var n = [];
                    return v.each(e, function(e, o) {
                        if ("$" === o.substr(0, 1)) {
                            if (!v.has(b, o)) throw new Error("Unrecognized logical operator: " + o);
                            t._isSimple = !1, n.push(b[o](e, t, r.inElemMatch))
                        } else {
                            r.inElemMatch || t._recordPathUsed(o);
                            var a = l(o),
                                c = f(e, t, r.isRoot);
                            n.push(function(e) {
                                var t = a(e);
                                return c(t)
                            })
                        }
                    }), F(n)
                },
                f = function(e, t, r) {
                    return e instanceof RegExp ? (t._isSimple = !1, g(u(e))) : s(e) ? m(e, t, r) : g(d(e))
                },
                g = function(e, t) {
                    return t = t || {},
                        function(r) {
                            var n = r;
                            t.dontExpandLeafArrays || (n = h(r, t.dontIncludeLeafArrays));
                            var o = {};
                            return o.result = v.any(n, function(t) {
                                var r = e(t.value);
                                return "number" == typeof r && (t.arrayIndices || (t.arrayIndices = [r]), r = !0), r && t.arrayIndices && (o.arrayIndices = t.arrayIndices), r
                            }), o
                        }
                };
            u = function(e) {
                return function(t) {
                    return t instanceof RegExp ? v.isEqual(t, e) : "string" != typeof t ? !1 : e.test(t)
                }
            }, d = function(t) {
                if (s(t)) throw Error("Can't create equalityValueSelector for operator object");
                return null == t ? function(e) {
                    return null == e
                } : function(r) {
                    return e._f._equal(t, r)
                }
            };
            var m = function(e, t, r) {
                    var n = [];
                    return v.each(e, function(o, a) {
                        var c = v.contains(["$lt", "$lte", "$gt", "$gte"], a) && v.isNumber(o),
                            s = "$ne" === a && !v.isObject(o),
                            i = v.contains(["$in", "$nin"], a) && v.isArray(o) && !v.any(o, v.isObject);
                        if ("$eq" === a || c || i || s || (t._isSimple = !1), v.has(C, a)) n.push(C[a](o, e, t, r));
                        else {
                            if (!v.has(p, a)) throw new Error("Unrecognized operator: " + a);
                            var u = p[a];
                            n.push(g(u.compileElementSelector(o, e, t), u))
                        }
                    }), S(n)
                },
                y = function(e, t, r) {
                    if (!o(e) || v.isEmpty(e)) throw Error("$and/$or/$nor must be nonempty array");
                    return v.map(e, function(e) {
                        if (!a(e)) throw Error("$or/$and/$nor entries need to be full objects");
                        return n(e, t, {
                            inElemMatch: r
                        })
                    })
                },
                b = {
                    $and: function(e, t, r) {
                        var n = y(e, t, r);
                        return F(n)
                    },
                    $or: function(e, t, r) {
                        var n = y(e, t, r);
                        return 1 === n.length ? n[0] : function(e) {
                            var t = v.any(n, function(t) {
                                return t(e).result
                            });
                            return {
                                result: t
                            }
                        }
                    },
                    $nor: function(e, t, r) {
                        var n = y(e, t, r);
                        return function(e) {
                            var t = v.all(n, function(t) {
                                return !t(e).result
                            });
                            return {
                                result: t
                            }
                        }
                    },
                    $where: function(e, t) {
                        return t._recordPathUsed(""), t._hasWhere = !0, e instanceof Function || (e = Function("obj", "return " + e)),
                            function(t) {
                                return {
                                    result: e.call(t, t)
                                }
                            }
                    },
                    $comment: function() {
                        return function() {
                            return {
                                result: !0
                            }
                        }
                    }
                },
                A = function(e) {
                    return function(t) {
                        var r = e(t);
                        return {
                            result: !r.result
                        }
                    }
                },
                C = {
                    $not: function(e, t, r) {
                        return A(f(e, r))
                    },
                    $ne: function(e) {
                        return A(g(d(e)))
                    },
                    $nin: function(e) {
                        return A(g(p.$in.compileElementSelector(e)))
                    },
                    $exists: function(e) {
                        var t = g(function(e) {
                            return void 0 !== e
                        });
                        return e ? t : A(t)
                    },
                    $options: function(e, t) {
                        if (!v.has(t, "$regex")) throw Error("$options needs a $regex");
                        return k
                    },
                    $maxDistance: function(e, t) {
                        if (!t.$near) throw Error("$maxDistance needs a $near");
                        return k
                    },
                    $all: function(e, t, r) {
                        if (!o(e)) throw Error("$all requires array");
                        if (v.isEmpty(e)) return T;
                        var n = [];
                        return v.each(e, function(e) {
                            if (s(e)) throw Error("no $ expressions in $all");
                            n.push(f(e, r))
                        }), S(n)
                    },
                    $near: function(e, t, r, n) {
                        if (!n) throw Error("$near can't be inside another $ operator");
                        r._hasGeoQuery = !0;
                        var c, s, i;
                        if (a(e) && v.has(e, "$geometry")) c = e.$maxDistance, s = e.$geometry, i = function(e) {
                            return e && e.type ? "Point" === e.type ? _.pointDistance(s, e) : _.geometryWithinRadius(e, s, c) ? 0 : c + 1 : null
                        };
                        else {
                            if (c = t.$maxDistance, !o(e) && !a(e)) throw Error("$near argument must be coordinate pair or GeoJSON");
                            s = x(e), i = function(e) {
                                return o(e) || a(e) ? w(s, e) : null
                            }
                        }
                        return function(e) {
                            e = h(e);
                            var t = {
                                result: !1
                            };
                            return v.each(e, function(e) {
                                var r = i(e.value);
                                null === r || r > c || void 0 !== t.distance && t.distance <= r || (t.result = !0, t.distance = r, e.arrayIndices ? t.arrayIndices = e.arrayIndices : delete t.arrayIndices)
                            }), t
                        }
                    }
                },
                w = function(e, t) {
                    e = x(e), t = x(t);
                    var r = e[0] - t[0],
                        n = e[1] - t[1];
                    return v.isNaN(r) || v.isNaN(n) ? null : Math.sqrt(r * r + n * n)
                },
                x = function(e) {
                    return v.map(e, v.identity)
                },
                D = function(t) {
                    return {
                        compileElementSelector: function(r) {
                            if (o(r)) return function() {
                                return !1
                            };
                            void 0 === r && (r = null);
                            var n = e._f._type(r);
                            return function(o) {
                                return void 0 === o && (o = null), e._f._type(o) !== n ? !1 : t(e._f._cmp(o, r))
                            }
                        }
                    }
                };
            p = {
                $lt: D(function(e) {
                    return 0 > e
                }),
                $gt: D(function(e) {
                    return e > 0
                }),
                $lte: D(function(e) {
                    return 0 >= e
                }),
                $gte: D(function(e) {
                    return e >= 0
                }),
                $mod: {
                    compileElementSelector: function(e) {
                        if (!o(e) || 2 !== e.length || "number" != typeof e[0] || "number" != typeof e[1]) throw Error("argument to $mod must be an array of two numbers");
                        var t = e[0],
                            r = e[1];
                        return function(e) {
                            return "number" == typeof e && e % t === r
                        }
                    }
                },
                $in: {
                    compileElementSelector: function(e) {
                        if (!o(e)) throw Error("$in needs an array");
                        var t = [];
                        return v.each(e, function(e) {
                                if (e instanceof RegExp) t.push(u(e));
                                else {
                                    if (s(e)) throw Error("cannot nest $ under $in");
                                    t.push(d(e))
                                }
                            }),
                            function(e) {
                                return void 0 === e && (e = null), v.any(t, function(t) {
                                    return t(e)
                                })
                            }
                    }
                },
                $size: {
                    dontExpandLeafArrays: !0,
                    compileElementSelector: function(e) {
                        if ("string" == typeof e) e = 0;
                        else if ("number" != typeof e) throw Error("$size needs a number");
                        return function(t) {
                            return o(t) && t.length === e
                        }
                    }
                },
                $type: {
                    dontIncludeLeafArrays: !0,
                    compileElementSelector: function(t) {
                        if ("number" != typeof t) throw Error("$type needs a number");
                        return function(r) {
                            return void 0 !== r && e._f._type(r) === t
                        }
                    }
                },
                $regex: {
                    compileElementSelector: function(e, t) {
                        if (!("string" == typeof e || e instanceof RegExp)) throw Error("$regex has to be a string or RegExp");
                        var r;
                        if (void 0 !== t.$options) {
                            if (/[^gim]/.test(t.$options)) throw new Error("Only the i, m, and g regexp options are supported");
                            var n = e instanceof RegExp ? e.source : e;
                            r = new RegExp(n, t.$options)
                        } else r = e instanceof RegExp ? e : new RegExp(e);
                        return u(r)
                    }
                },
                $elemMatch: {
                    dontExpandLeafArrays: !0,
                    compileElementSelector: function(e, t, r) {
                        if (!a(e)) throw Error("$elemMatch need an object");
                        var c, i;
                        return s(e, !0) ? (c = f(e, r), i = !1) : (c = n(e, r, {
                                inElemMatch: !0
                            }), i = !0),
                            function(e) {
                                if (!o(e)) return !1;
                                for (var t = 0; t < e.length; ++t) {
                                    var r, n = e[t];
                                    if (i) {
                                        if (!a(n) && !o(n)) return !1;
                                        r = n
                                    } else r = [{
                                        value: n,
                                        dontIterate: !0
                                    }];
                                    if (c(r).result) return t
                                }
                                return !1
                            }
                    }
                }
            }, l = function(e) {
                var t, r = e.split("."),
                    n = r.length ? r[0] : "",
                    s = i(n);
                r.length > 1 && (t = l(r.slice(1).join(".")));
                var u = function(e) {
                    return e.dontIterate || delete e.dontIterate, e.arrayIndices && !e.arrayIndices.length && delete e.arrayIndices, e
                };
                return function(e, r) {
                    if (r || (r = []), o(e)) {
                        if (!(s && n < e.length)) return [];
                        r = r.concat(+n, "x")
                    }
                    var i = e[n];
                    if (!t) return [u({
                        value: i,
                        dontIterate: o(e) && o(i),
                        arrayIndices: r
                    })];
                    if (!c(i)) return o(e) ? [] : [u({
                        value: void 0,
                        arrayIndices: r
                    })];
                    var d = [],
                        p = function(e) {
                            Array.prototype.push.apply(d, e)
                        };
                    return p(t(i, r)), o(i) && v.each(i, function(e, n) {
                        a(e) && p(t(e, r.concat(n)))
                    }), d
                }
            }, r.makeLookupFunction = l, h = function(e, t) {
                var r = [];
                return v.each(e, function(e) {
                    var n = o(e.value);
                    t && n && !e.dontIterate || r.push({
                        value: e.value,
                        arrayIndices: e.arrayIndices
                    }), n && !e.dontIterate && v.each(e.value, function(t, n) {
                        r.push({
                            value: t,
                            arrayIndices: (e.arrayIndices || []).concat(n)
                        })
                    })
                }), r
            };
            var T = function() {
                    return {
                        result: !1
                    }
                },
                k = function() {
                    return {
                        result: !0
                    }
                },
                B = function(e) {
                    return 0 === e.length ? k : 1 === e.length ? e[0] : function(t) {
                        var r = {};
                        return r.result = v.all(e, function(e) {
                            var n = e(t);
                            return n.result && void 0 !== n.distance && void 0 === r.distance && (r.distance = n.distance), n.result && n.arrayIndices && (r.arrayIndices = n.arrayIndices), n.result
                        }), r.result || (delete r.distance, delete r.arrayIndices), r
                    }
                },
                F = B,
                S = B;
            e._f = {
                _type: function(t) {
                    return "number" == typeof t ? 1 : "string" == typeof t ? 2 : "boolean" == typeof t ? 8 : o(t) ? 4 : null === t ? 10 : t instanceof RegExp ? 11 : "function" == typeof t ? 13 : t instanceof Date ? 9 : E.isBinary(t) ? 5 : t instanceof e._ObjectID ? 7 : 3
                },
                _equal: function(e, t) {
                    return E.equals(e, t, {
                        keyOrderSensitive: !0
                    })
                },
                _typeorder: function(e) {
                    return [-1, 1, 2, 3, 4, 5, -1, 6, 7, 8, 0, 9, -1, 100, 2, 100, 1, 8, 1][e]
                },
                _cmp: function(t, r) {
                    if (void 0 === t) return void 0 === r ? 0 : -1;
                    if (void 0 === r) return 1;
                    var n = e._f._type(t),
                        o = e._f._type(r),
                        a = e._f._typeorder(n),
                        c = e._f._typeorder(o);
                    if (a !== c) return c > a ? -1 : 1;
                    if (n !== o) throw Error("Missing type coercion logic in _cmp");
                    if (7 === n && (n = o = 2, t = t.toHexString(), r = r.toHexString()), 9 === n && (n = o = 1, t = t.getTime(), r = r.getTime()), 1 === n) return t - r;
                    if (2 === o) return r > t ? -1 : t === r ? 0 : 1;
                    if (3 === n) {
                        var s = function(e) {
                            var t = [];
                            for (var r in e) t.push(r), t.push(e[r]);
                            return t
                        };
                        return e._f._cmp(s(t), s(r))
                    }
                    if (4 === n)
                        for (var i = 0;; i++) {
                            if (i === t.length) return i === r.length ? 0 : -1;
                            if (i === r.length) return 1;
                            var u = e._f._cmp(t[i], r[i]);
                            if (0 !== u) return u
                        }
                    if (5 === n) {
                        if (t.length !== r.length) return t.length - r.length;
                        for (i = 0; i < t.length; i++) {
                            if (t[i] < r[i]) return -1;
                            if (t[i] > r[i]) return 1
                        }
                        return 0
                    }
                    if (8 === n) return t ? r ? 0 : 1 : r ? -1 : 0;
                    if (10 === n) return 0;
                    if (11 === n) throw Error("Sorting not supported on regular expression");
                    if (13 === n) throw Error("Sorting not supported on Javascript code");
                    throw Error("Unknown type to sort")
                }
            }, e._removeDollarOperators = function(e) {
                var t = {};
                for (var r in e) "$" !== r.substr(0, 1) && (t[r] = e[r]);
                return t
            }
        }.call(this),
        function() {
            t.Sorter = function(e, n) {
                var o = this;
                n = n || {}, o._sortSpecParts = [];
                var a = function(e, t) {
                    if (!e) throw Error("sort keys must be non-empty");
                    if ("$" === e.charAt(0)) throw Error("unsupported sort key: " + e);
                    o._sortSpecParts.push({
                        path: e,
                        lookup: l(e),
                        ascending: t
                    })
                };
                if (e instanceof Array)
                    for (var c = 0; c < e.length; c++) "string" == typeof e[c] ? a(e[c], !0) : a(e[c][0], "desc" !== e[c][1]);
                else {
                    if ("object" != typeof e) throw Error("Bad sort specification: " + y.stringify(e));
                    v.each(e, function(e, t) {
                        a(t, e >= 0)
                    })
                }
                if (o.affectedByModifier) {
                    var s = {};
                    v.each(o._sortSpecParts, function(e) {
                        s[e.path] = 1
                    }), o._selectorForAffectedByModifier = new t.Matcher(s)
                }
                o._keyComparator = r(v.map(o._sortSpecParts, function(e, t) {
                    return o._keyFieldComparator(t)
                })), o._keyFilter = null, n.matcher && o._useWithMatcher(n.matcher)
            }, v.extend(t.Sorter.prototype, {
                getComparator: function(e) {
                    var t = this;
                    if (!e || !e.distances) return t._getBaseComparator();
                    var n = e.distances;
                    return r([t._getBaseComparator(), function(e, t) {
                        if (!n.has(e._id)) throw Error("Missing distance for " + e._id);
                        if (!n.has(t._id)) throw Error("Missing distance for " + t._id);
                        return n.get(e._id) - n.get(t._id)
                    }])
                },
                _getPaths: function() {
                    var e = this;
                    return v.pluck(e._sortSpecParts, "path")
                },
                _getMinKeyFromDoc: function(e) {
                    var t = this,
                        r = null;
                    if (t._generateKeysFromDoc(e, function(e) {
                            return t._keyCompatibleWithSelector(e) ? null === r ? void(r = e) : void(t._compareKeys(e, r) < 0 && (r = e)) : void 0
                        }), null === r) throw Error("sort selector found no keys in doc?");
                    return r
                },
                _keyCompatibleWithSelector: function(e) {
                    var t = this;
                    return !t._keyFilter || t._keyFilter(e)
                },
                _generateKeysFromDoc: function(e, t) {
                    var r = this;
                    if (0 === r._sortSpecParts.length) throw new Error("can't generate keys without a spec");
                    var n = [],
                        o = function(e) {
                            return e.join(",") + ","
                        },
                        a = null;
                    if (v.each(r._sortSpecParts, function(t, r) {
                            var c = h(t.lookup(e), !0);
                            c.length || (c = [{
                                value: null
                            }]);
                            var s = !1;
                            if (n[r] = {}, v.each(c, function(e) {
                                    if (!e.arrayIndices) {
                                        if (c.length > 1) throw Error("multiple branches but no array used?");
                                        return void(n[r][""] = e.value)
                                    }
                                    s = !0;
                                    var t = o(e.arrayIndices);
                                    if (v.has(n[r], t)) throw Error("duplicate path: " + t);
                                    if (n[r][t] = e.value, a && !v.has(a, t)) throw Error("cannot index parallel arrays")
                                }), a) {
                                if (!v.has(n[r], "") && v.size(a) !== v.size(n[r])) throw Error("cannot index parallel arrays!")
                            } else s && (a = {}, v.each(n[r], function(e, t) {
                                a[t] = !0
                            }))
                        }), !a) {
                        var c = v.map(n, function(e) {
                            if (!v.has(e, "")) throw Error("no value in sole key case?");
                            return e[""]
                        });
                        return void t(c)
                    }
                    v.each(a, function(e, r) {
                        var o = v.map(n, function(e) {
                            if (v.has(e, "")) return e[""];
                            if (!v.has(e, r)) throw Error("missing path?");
                            return e[r]
                        });
                        t(o)
                    })
                },
                _compareKeys: function(e, t) {
                    var r = this;
                    if (e.length !== r._sortSpecParts.length || t.length !== r._sortSpecParts.length) throw Error("Key has wrong length");
                    return r._keyComparator(e, t)
                },
                _keyFieldComparator: function(t) {
                    var r = this,
                        n = !r._sortSpecParts[t].ascending;
                    return function(r, o) {
                        var a = e._f._cmp(r[t], o[t]);
                        return n && (a = -a), a
                    }
                },
                _getBaseComparator: function() {
                    var e = this;
                    return e._sortSpecParts.length ? function(t, r) {
                        var n = e._getMinKeyFromDoc(t),
                            o = e._getMinKeyFromDoc(r);
                        return e._compareKeys(n, o)
                    } : function() {
                        return 0
                    }
                },
                _useWithMatcher: function(e) {
                    var t = this;
                    if (t._keyFilter) throw Error("called _useWithMatcher twice?");
                    if (!v.isEmpty(t._sortSpecParts)) {
                        var r = e._selector;
                        if (!(r instanceof Function)) {
                            var n = {};
                            v.each(t._sortSpecParts, function(e) {
                                n[e.path] = []
                            }), v.each(r, function(e, t) {
                                var r = n[t];
                                if (r) {
                                    if (e instanceof RegExp) {
                                        if (e.ignoreCase || e.multiline) return;
                                        return void r.push(u(e))
                                    }
                                    return s(e) ? void v.each(e, function(t, n) {
                                        v.contains(["$lt", "$lte", "$gt", "$gte"], n) && r.push(p[n].compileElementSelector(t)), "$regex" !== n || e.$options || r.push(p.$regex.compileElementSelector(t, e))
                                    }) : void r.push(d(e))
                                }
                            }), v.isEmpty(n[t._sortSpecParts[0].path]) || (t._keyFilter = function(e) {
                                return v.all(t._sortSpecParts, function(t, r) {
                                    return v.all(n[t.path], function(t) {
                                        return t(e[r])
                                    })
                                })
                            })
                        }
                    }
                }
            });
            var r = function(e) {
                return function(t, r) {
                    for (var n = 0; n < e.length; ++n) {
                        var o = e[n](t, r);
                        if (0 !== o) return o
                    }
                    return 0
                }
            }
        }.call(this),
        function() {
            e._compileProjection = function(t) {
                e._checkSupportedProjection(t);
                var r = v.isUndefined(t._id) ? !0 : t._id,
                    n = f(t),
                    o = function(e, t) {
                        if (v.isArray(e)) return v.map(e, function(e) {
                            return o(e, t)
                        });
                        var r = n.including ? {} : E.clone(e);
                        return v.each(t, function(t, a) {
                            v.has(e, a) && (v.isObject(t) ? v.isObject(e[a]) && (r[a] = o(e[a], t)) : n.including ? r[a] = E.clone(e[a]) : delete r[a])
                        }), r
                    };
                return function(e) {
                    var t = o(e, n.tree);
                    return r && v.has(e, "_id") && (t._id = e._id), !r && v.has(t, "_id") && delete t._id, t
                }
            }, f = function(e) {
                var t = v.keys(e).sort();
                t.length > 0 && (1 !== t.length || "_id" !== t[0]) && (t = v.reject(t, function(e) {
                    return "_id" === e
                }));
                var r = null;
                v.each(t, function(t) {
                    var o = !!e[t];
                    if (null === r && (r = o), r !== o) throw n("You cannot currently mix including and excluding fields.")
                });
                var o = g(t, function() {
                    return r
                }, function(e, t, r) {
                    var o = r,
                        a = t;
                    throw n("both " + o + " and " + a + " found in fields option, using both of them may trigger unexpected behavior. Did you mean to use only one of them?")
                });
                return {
                    tree: o,
                    including: r
                }
            }, g = function(e, t, r, n) {
                return n = n || {}, v.each(e, function(e) {
                    var o = n,
                        a = e.split("."),
                        c = v.all(a.slice(0, -1), function(t, n) {
                            if (v.has(o, t)) {
                                if (!v.isObject(o[t]) && (o[t] = r(o[t], a.slice(0, n + 1).join("."), e), !v.isObject(o[t]))) return !1
                            } else o[t] = {};
                            return o = o[t], !0
                        });
                    if (c) {
                        var s = v.last(a);
                        o[s] = v.has(o, s) ? r(o[s], e, e) : t(e)
                    }
                }), n
            }, e._checkSupportedProjection = function(e) {
                if (!v.isObject(e) || v.isArray(e)) throw n("fields option must be an object");
                v.each(e, function(e, t) {
                    if (v.contains(t.split("."), "$")) throw n("Minimongo doesn't support $ operator in projections yet.");
                    if (-1 === v.indexOf([1, 0, !0, !1], e)) throw n("Projection values should be one of 1, 0, true, or false")
                })
            }
        }.call(this),
        function() {
            e._modify = function(e, t, c) {
                if (c = c || {}, !a(t)) throw n("Modifier must be an object");
                var i, d = s(t);
                if (d) i = E.clone(e), v.each(t, function(e, t) {
                    var a = u[t];
                    if (c.isInsert && "$setOnInsert" === t && (a = u.$set), !a) throw n("Invalid modifier specified " + t);
                    v.each(e, function(e, s) {
                        if (s.length && "." === s[s.length - 1]) throw n("Invalid mod field name, may not end in a period");
                        if ("_id" === s) throw n("Mod on _id not allowed");
                        var u = s.split("."),
                            d = (v.has(o, t), r(i, u, {
                                noCreate: o[t],
                                forbidArray: "$rename" === t,
                                arrayIndices: c.arrayIndices
                            })),
                            p = u.pop();
                        a(d, p, e, s, i)
                    })
                });
                else {
                    if (t._id && !E.equals(e._id, t._id)) throw n("Cannot change the _id of a document");
                    for (var p in t)
                        if (/\./.test(p)) throw n("When replacing document, field name may not contain '.'");
                    i = t
                }
                v.each(v.keys(e), function(t) {
                    ("_id" !== t || c.isInsert) && delete e[t]
                }), v.each(i, function(t, r) {
                    e[r] = t
                })
            };
            var r = function(e, t, r) {
                    r = r || {};
                    for (var o = !1, a = 0; a < t.length; a++) {
                        var s = a === t.length - 1,
                            u = t[a],
                            d = c(e);
                        if (!d) {
                            if (r.noCreate) return void 0;
                            var p = n("cannot use the part '" + u + "' to traverse " + e);
                            throw p.setPropertyError = !0, p
                        }
                        if (e instanceof Array) {
                            if (r.forbidArray) return null;
                            if ("$" === u) {
                                if (o) throw n("Too many positional (i.e. '$') elements");
                                if (!r.arrayIndices || !r.arrayIndices.length) throw n("The positional operator did not find the match needed from the query");
                                u = r.arrayIndices[0], o = !0
                            } else {
                                if (!i(u)) {
                                    if (r.noCreate) return void 0;
                                    throw n("can't append to array using string field name [" + u + "]")
                                }
                                u = parseInt(u)
                            }
                            if (s && (t[a] = u), r.noCreate && u >= e.length) return void 0;
                            for (; e.length < u;) e.push(null);
                            if (!s)
                                if (e.length === u) e.push({});
                                else if ("object" != typeof e[u]) throw n("can't modify field '" + t[a + 1] + "' of list value " + y.stringify(e[u]))
                        } else {
                            if (u.length && "$" === u.substr(0, 1)) throw n("can't set field named " + u);
                            if (!(u in e)) {
                                if (r.noCreate) return void 0;
                                s || (e[u] = {})
                            }
                        }
                        if (s) return e;
                        e = e[u]
                    }
                },
                o = {
                    $unset: !0,
                    $pop: !0,
                    $rename: !0,
                    $pull: !0,
                    $pullAll: !0
                },
                u = {
                    $inc: function(e, t, r) {
                        if ("number" != typeof r) throw n("Modifier $inc allowed for numbers only");
                        if (t in e) {
                            if ("number" != typeof e[t]) throw n("Cannot apply $inc modifier to non-number");
                            e[t] += r
                        } else e[t] = r
                    },
                    $set: function(e, t, r) {
                        if (!v.isObject(e)) {
                            var o = n("Cannot set property on non-object field");
                            throw o.setPropertyError = !0, o
                        }
                        if (null === e) {
                            var o = n("Cannot set property on null");
                            throw o.setPropertyError = !0, o
                        }
                        e[t] = E.clone(r)
                    },
                    $setOnInsert: function() {},
                    $unset: function(e, t) {
                        void 0 !== e && (e instanceof Array ? t in e && (e[t] = null) : delete e[t])
                    },
                    $push: function(r, o, a) {
                        if (void 0 === r[o] && (r[o] = []), !(r[o] instanceof Array)) throw n("Cannot apply $push modifier to non-array");
                        if (!a || !a.$each) return void r[o].push(E.clone(a));
                        var c = a.$each;
                        if (!(c instanceof Array)) throw n("$each must be an array");
                        var s = void 0;
                        if ("$slice" in a) {
                            if ("number" != typeof a.$slice) throw n("$slice must be a numeric value");
                            if (a.$slice > 0) throw n("$slice in $push must be zero or negative");
                            s = a.$slice
                        }
                        var i = void 0;
                        if (a.$sort) {
                            if (void 0 === s) throw n("$sort requires $slice to be present");
                            i = new t.Sorter(a.$sort).getComparator();
                            for (var u = 0; u < c.length; u++)
                                if (3 !== e._f._type(c[u])) throw n("$push like modifiers using $sort require all elements to be objects")
                        }
                        for (var d = 0; d < c.length; d++) r[o].push(E.clone(c[d]));
                        i && r[o].sort(i), void 0 !== s && (r[o] = 0 === s ? [] : r[o].slice(s))
                    },
                    $pushAll: function(e, t, r) {
                        if (!("object" == typeof r && r instanceof Array)) throw n("Modifier $pushAll/pullAll allowed for arrays only");
                        var o = e[t];
                        if (void 0 === o) e[t] = r;
                        else {
                            if (!(o instanceof Array)) throw n("Cannot apply $pushAll modifier to non-array");
                            for (var a = 0; a < r.length; a++) o.push(r[a])
                        }
                    },
                    $addToSet: function(t, r, o) {
                        var a = t[r];
                        if (void 0 === a) t[r] = [o];
                        else {
                            if (!(a instanceof Array)) throw n("Cannot apply $addToSet modifier to non-array");
                            var c = !1;
                            if ("object" == typeof o)
                                for (var s in o) {
                                    "$each" === s && (c = !0);
                                    break
                                }
                            var i = c ? o.$each : [o];
                            v.each(i, function(t) {
                                for (var r = 0; r < a.length; r++)
                                    if (e._f._equal(t, a[r])) return;
                                a.push(E.clone(t))
                            })
                        }
                    },
                    $pop: function(e, t, r) {
                        if (void 0 !== e) {
                            var o = e[t];
                            if (void 0 !== o) {
                                if (!(o instanceof Array)) throw n("Cannot apply $pop modifier to non-array");
                                "number" == typeof r && 0 > r ? o.splice(0, 1) : o.pop()
                            }
                        }
                    },
                    $pull: function(r, o, a) {
                        if (void 0 !== r) {
                            var c = r[o];
                            if (void 0 !== c) {
                                if (!(c instanceof Array)) throw n("Cannot apply $pull/pullAll modifier to non-array");
                                var s = [];
                                if ("object" != typeof a || a instanceof Array)
                                    for (var i = 0; i < c.length; i++) e._f._equal(c[i], a) || s.push(c[i]);
                                else
                                    for (var u = new t.Matcher(a), i = 0; i < c.length; i++) u.documentMatches(c[i]).result || s.push(c[i]);
                                r[o] = s
                            }
                        }
                    },
                    $pullAll: function(t, r, o) {
                        if (!("object" == typeof o && o instanceof Array)) throw n("Modifier $pushAll/pullAll allowed for arrays only");
                        if (void 0 !== t) {
                            var a = t[r];
                            if (void 0 !== a) {
                                if (!(a instanceof Array)) throw n("Cannot apply $pull/pullAll modifier to non-array");
                                for (var c = [], s = 0; s < a.length; s++) {
                                    for (var i = !1, u = 0; u < o.length; u++)
                                        if (e._f._equal(a[s], o[u])) {
                                            i = !0;
                                            break
                                        }
                                    i || c.push(a[s])
                                }
                                t[r] = c
                            }
                        }
                    },
                    $rename: function(e, t, o, a, c) {
                        if (a === o) throw n("$rename source must differ from target");
                        if (null === e) throw n("$rename source field invalid");
                        if ("string" != typeof o) throw n("$rename target must be a string");
                        if (void 0 !== e) {
                            var s = e[t];
                            delete e[t];
                            var i = o.split("."),
                                u = r(c, i, {
                                    forbidArray: !0
                                });
                            if (null === u) throw n("$rename target field invalid");
                            var d = i.pop();
                            u[d] = s
                        }
                    },
                    $bit: function() {
                        throw n("$bit is not supported")
                    }
                }
        }.call(this),
        function() {
            e._diffQueryChanges = function(t, r, n, o) {
                t ? e._diffQueryOrderedChanges(r, n, o) : e._diffQueryUnorderedChanges(r, n, o)
            }, e._diffQueryUnorderedChanges = function(t, r, n) {
                if (n.movedBefore) throw new Error("_diffQueryUnordered called with a movedBefore observer!");
                r.forEach(function(r, o) {
                    var a = t.get(o);
                    if (a) n.changed && !E.equals(a, r) && n.changed(o, e._makeChangedFields(r, a));
                    else if (n.added) {
                        var c = E.clone(r);
                        delete c._id, n.added(r._id, c)
                    }
                }), n.removed && t.forEach(function(e, t) {
                    r.has(t) || n.removed(t)
                })
            }, e._diffQueryOrderedChanges = function(t, r, n) {
                var o = {};
                v.each(r, function(e) {
                    o[e._id] && m._debug("Duplicate _id in new_results"), o[e._id] = !0
                });
                var a = {};
                v.each(t, function(e, t) {
                    e._id in a && m._debug("Duplicate _id in old_results"), a[e._id] = t
                });
                for (var c = [], s = 0, i = r.length, u = new Array(i), d = new Array(i), p = function(e) {
                        return a[r[e]._id]
                    }, l = 0; i > l; l++)
                    if (void 0 !== a[r[l]._id]) {
                        for (var h = s; h > 0 && !(p(u[h - 1]) < p(l));) h--;
                        d[l] = 0 === h ? -1 : u[h - 1], u[h] = l, h + 1 > s && (s = h + 1)
                    }
                for (var f = 0 === s ? -1 : u[s - 1]; f >= 0;) c.push(f), f = d[f];
                c.reverse(), c.push(r.length), v.each(t, function(e) {
                    o[e._id] || n.removed && n.removed(e._id)
                });
                var g = 0;
                v.each(c, function(o) {
                    for (var c, s, i, u = r[o] ? r[o]._id : null, d = g; o > d; d++) s = r[d], v.has(a, s._id) ? (c = t[a[s._id]], i = e._makeChangedFields(s, c), v.isEmpty(i) || n.changed && n.changed(s._id, i), n.movedBefore && n.movedBefore(s._id, u)) : (i = E.clone(s), delete i._id, n.addedBefore && n.addedBefore(s._id, i, u), n.added && n.added(s._id, i));
                    u && (s = r[o], c = t[a[s._id]], i = e._makeChangedFields(s, c), v.isEmpty(i) || n.changed && n.changed(s._id, i)), g = o + 1
                })
            }, e._diffObjects = function(e, t, r) {
                v.each(e, function(e, n) {
                    v.has(t, n) ? r.both && r.both(n, e, t[n]) : r.leftOnly && r.leftOnly(n, e)
                }), r.rightOnly && v.each(t, function(t, n) {
                    v.has(e, n) || r.rightOnly(n, t)
                })
            }
        }.call(this),
        function() {
            e._IdMap = function() {
                var t = this;
                b.call(t, e._idStringify, e._idParse)
            }, m._inherits(e._IdMap, b)
        }.call(this),
        function() {
            e._CachingChangeObserver = function(t) {
                var r = this;
                t = t || {};
                var n = t.callbacks && e._observeChangesCallbacksAreOrdered(t.callbacks);
                if (v.has(t, "ordered")) {
                    if (r.ordered = t.ordered, t.callbacks && t.ordered !== n) throw Error("ordered option doesn't match callbacks")
                } else {
                    if (!t.callbacks) throw Error("must provide ordered or callbacks");
                    r.ordered = n
                }
                var o = t.callbacks || {};
                r.ordered ? (r.docs = new A(e._idStringify), r.applyChange = {
                    addedBefore: function(e, t, n) {
                        var a = E.clone(t);
                        a._id = e, o.addedBefore && o.addedBefore.call(r, e, t, n), o.added && o.added.call(r, e, t), r.docs.putBefore(e, a, n || null)
                    },
                    movedBefore: function(e, t) {
                        r.docs.get(e);
                        o.movedBefore && o.movedBefore.call(r, e, t), r.docs.moveBefore(e, t || null)
                    }
                }) : (r.docs = new e._IdMap, r.applyChange = {
                    added: function(e, t) {
                        var n = E.clone(t);
                        o.added && o.added.call(r, e, t), n._id = e, r.docs.set(e, n)
                    }
                }), r.applyChange.changed = function(t, n) {
                    var a = r.docs.get(t);
                    if (!a) throw new Error("Unknown id for changed: " + t);
                    o.changed && o.changed.call(r, t, E.clone(n)), e._applyChanges(a, n)
                }, r.applyChange.removed = function(e) {
                    o.removed && o.removed.call(r, e), r.docs.remove(e)
                }
            }, e._observeFromObserveChanges = function(t, r) {
                var n, o = t.getTransform() || function(e) {
                        return e
                    },
                    a = !!r._suppress_initial;
                if (e._observeCallbacksAreOrdered(r)) {
                    var c = !r._no_indices;
                    n = {
                        addedBefore: function(e, t, n) {
                            var s = this;
                            if (!a && (r.addedAt || r.added)) {
                                var i = o(v.extend(t, {
                                    _id: e
                                }));
                                if (r.addedAt) {
                                    var u = c ? n ? s.docs.indexOf(n) : s.docs.size() : -1;
                                    r.addedAt(i, u, n)
                                } else r.added(i)
                            }
                        },
                        changed: function(t, n) {
                            var a = this;
                            if (r.changedAt || r.changed) {
                                var s = E.clone(a.docs.get(t));
                                if (!s) throw new Error("Unknown id for changed: " + t);
                                var i = o(E.clone(s));
                                if (e._applyChanges(s, n), s = o(s), r.changedAt) {
                                    var u = c ? a.docs.indexOf(t) : -1;
                                    r.changedAt(s, i, u)
                                } else r.changed(s, i)
                            }
                        },
                        movedBefore: function(e, t) {
                            var n = this;
                            if (r.movedTo) {
                                var a = c ? n.docs.indexOf(e) : -1,
                                    s = c ? t ? n.docs.indexOf(t) : n.docs.size() : -1;
                                s > a && --s, r.movedTo(o(E.clone(n.docs.get(e))), a, s, t || null)
                            }
                        },
                        removed: function(e) {
                            var t = this;
                            if (r.removedAt || r.removed) {
                                var n = o(t.docs.get(e));
                                if (r.removedAt) {
                                    var a = c ? t.docs.indexOf(e) : -1;
                                    r.removedAt(n, a)
                                } else r.removed(n)
                            }
                        }
                    }
                } else n = {
                    added: function(e, t) {
                        if (!a && r.added) {
                            var n = v.extend(t, {
                                _id: e
                            });
                            r.added(o(n))
                        }
                    },
                    changed: function(t, n) {
                        var a = this;
                        if (r.changed) {
                            var c = a.docs.get(t),
                                s = E.clone(c);
                            e._applyChanges(s, n), r.changed(o(s), o(c))
                        }
                    },
                    removed: function(e) {
                        var t = this;
                        r.removed && r.removed(o(t.docs.get(e)))
                    }
                };
                var s = new e._CachingChangeObserver({
                        callbacks: n
                    }),
                    i = t.observeChanges(s.applyChange);
                return a = !1, s.ordered && (i._fetch = function() {
                    var e = [];
                    return s.docs.forEach(function(t) {
                        e.push(o(E.clone(t)))
                    }), e
                }), i
            }
        }.call(this),
        function() {
            e._looksLikeObjectID = function(e) {
                return 24 === e.length && e.match(/^[0-9a-f]*$/)
            }, e._ObjectID = function(t) {
                var r = this;
                if (t) {
                    if (t = t.toLowerCase(), !e._looksLikeObjectID(t)) throw new Error("Invalid hexadecimal string for creating an ObjectID");
                    r._str = t
                } else r._str = w.hexString(24)
            }, e._ObjectID.prototype.toString = function() {
                var e = this;
                return 'ObjectID("' + e._str + '")'
            }, e._ObjectID.prototype.equals = function(t) {
                var r = this;
                return t instanceof e._ObjectID && r.valueOf() === t.valueOf()
            }, e._ObjectID.prototype.clone = function() {
                var t = this;
                return new e._ObjectID(t._str)
            }, e._ObjectID.prototype.typeName = function() {
                return "oid"
            }, e._ObjectID.prototype.getTimestamp = function() {
                var e = this;
                return parseInt(e._str.substr(0, 8), 16)
            }, e._ObjectID.prototype.valueOf = e._ObjectID.prototype.toJSONValue = e._ObjectID.prototype.toHexString = function() {
                return this._str
            }, e._selectorIsId = function(t) {
                return "string" == typeof t || "number" == typeof t || t instanceof e._ObjectID
            }, e._selectorIsIdPerhapsAsObject = function(t) {
                return e._selectorIsId(t) || t && "object" == typeof t && t._id && e._selectorIsId(t._id) && 1 === v.size(t)
            }, e._idsMatchedBySelector = function(t) {
                if (e._selectorIsId(t)) return [t];
                if (!t) return null;
                if (v.has(t, "_id")) return e._selectorIsId(t._id) ? [t._id] : t._id && t._id.$in && v.isArray(t._id.$in) && !v.isEmpty(t._id.$in) && v.all(t._id.$in, e._selectorIsId) ? t._id.$in : null;
                if (t.$and && v.isArray(t.$and))
                    for (var r = 0; r < t.$and.length; ++r) {
                        var n = e._idsMatchedBySelector(t.$and[r]);
                        if (n) return n
                    }
                return null
            }, E.addType("oid", function(t) {
                return new e._ObjectID(t)
            })
        }.call(this), "undefined" == typeof Package && (Package = {}), Package.minimongo = {
            LocalCollection: e,
            Minimongo: t,
            MinimongoTest: r
        }
}(),
function() {
    var e, t = (Package.meteor.Meteor, Package.deps.Deps),
        r = Package.minimongo.LocalCollection,
        n = (Package.minimongo.Minimongo, Package.underscore._),
        o = Package.random.Random;
    (function() {
        var a = function() {
                e._suppressWarnings ? e._suppressWarnings-- : ("undefined" != typeof console && console.warn && console.warn.apply(console, arguments), e._loggedWarnings++)
            },
            c = r._idStringify,
            s = r._idParse;
        e = {
            _suppressWarnings: 0,
            _loggedWarnings: 0,
            observe: function(e, r) {
                var s = null,
                    p = null,
                    l = [],
                    h = t.autorun(function() {
                        var h = e();
                        t.nonreactive(function() {
                            var e;
                            if (p && (l = n.map(p._fetch(), function(e) {
                                    return {
                                        _id: e._id,
                                        item: e
                                    }
                                }), p.stop(), p = null), h)
                                if (h instanceof Array) {
                                    var t = {};
                                    e = n.map(h, function(e, r) {
                                        var n;
                                        if ("string" == typeof e) n = "-" + e;
                                        else if ("number" == typeof e || "boolean" == typeof e || void 0 === e) n = e;
                                        else {
                                            if ("object" != typeof e) throw new Error("{{#each}} doesn't support arrays with elements of type " + typeof e);
                                            n = e && e._id || r
                                        }
                                        var s = c(n);
                                        return t[s] ? (a("duplicate id " + n + " in", h), n = o.id()) : t[s] = !0, {
                                            _id: n,
                                            item: e
                                        }
                                    }), d(l, e, r)
                                } else {
                                    if (!u(h)) throw i();
                                    var f = h;
                                    e = [];
                                    var g = !0;
                                    p = f.observe({
                                        addedAt: function(t, n, o) {
                                            if (g) {
                                                if (null !== o) throw new Error("Expected initial data from observe in order");
                                                e.push({
                                                    _id: t._id,
                                                    item: t
                                                })
                                            } else r.addedAt(t._id, t, n, o)
                                        },
                                        changedAt: function(e, t, n) {
                                            r.changedAt(e._id, e, t, n)
                                        },
                                        removedAt: function(e, t) {
                                            r.removedAt(e._id, e, t)
                                        },
                                        movedTo: function(e, t, n, o) {
                                            r.movedTo(e._id, e, t, n, o)
                                        }
                                    }), g = !1, d(l, e, r)
                                } else e = [], d(l, e, r);
                            s = h, l = e
                        })
                    });
                return {
                    stop: function() {
                        h.stop(), p && p.stop()
                    }
                }
            },
            fetch: function(e) {
                if (e) {
                    if (e instanceof Array) return e;
                    if (u(e)) return e.fetch();
                    throw i()
                }
                return []
            }
        };
        var i = function() {
                return new Error("{{#each}} currently only accepts arrays, cursors or falsey values.")
            },
            u = function(e) {
                var t = Package.minimongo;
                return !!t && e instanceof t.LocalCollection.Cursor
            },
            d = function(e, t, r) {
                var o = Package.minimongo.LocalCollection._diffQueryOrderedChanges,
                    a = [],
                    i = [],
                    u = {},
                    d = {},
                    p = {},
                    l = e.length;
                n.each(t, function(e, t) {
                    i.push({
                        _id: e._id
                    }), d[c(e._id)] = t
                }), n.each(e, function(e, t) {
                    a.push({
                        _id: e._id
                    }), u[c(e._id)] = t, p[c(e._id)] = t
                }), o(a, i, {
                    addedBefore: function(e, o, a) {
                        var s = a ? p[c(a)] : l;
                        n.each(p, function(e, t) {
                            e >= s && p[t] ++
                        }), l++, p[c(e)] = s, r.addedAt(e, t[d[c(e)]].item, s, a)
                    },
                    movedBefore: function(e, o) {
                        var a = p[c(e)],
                            s = o ? p[c(o)] : l - 1;
                        n.each(p, function(e, t) {
                            e >= a && s >= e ? p[t] -- : a >= e && e >= s && p[t] ++
                        }), p[c(e)] = s, r.movedTo(e, t[d[c(e)]].item, a, s, o)
                    },
                    removed: function(t) {
                        var o = p[c(t)];
                        n.each(p, function(e, t) {
                            e >= o && p[t] --
                        }), delete p[c(t)], l--, r.removedAt(t, e[u[c(t)]].item, o)
                    }
                }), n.each(d, function(o, a) {
                    var c = s(a);
                    if (n.has(u, a)) {
                        var i = t[o].item,
                            d = e[u[a]].item;
                        ("object" == typeof i || i !== d) && r.changedAt(c, i, d, o)
                    }
                })
            }
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["observe-sequence"] = {
        ObserveSequence: e
    }
}(),
function() {
    {
        var e, t, r;
        Package.meteor.Meteor
    }(function() {
        e = {}, e.isNully = function(t) {
            if (null == t) return !0;
            if (t instanceof Array) {
                for (var r = 0; r < t.length; r++)
                    if (!e.isNully(t[r])) return !1;
                return !0
            }
            return !1
        }, e.escapeData = function(e) {
            return e.replace(/&/g, "&amp;").replace(/</g, "&lt;")
        }, e.isValidAttributeName = function(e) {
            return /^[:_A-Za-z][:_A-Za-z0-9.\-]*/.test(e)
        }
    }).call(this),
        function() {
            e.Tag = function() {}, e.Tag.prototype.tagName = "", e.Tag.prototype.attrs = null, e.Tag.prototype.children = Object.freeze ? Object.freeze([]) : [], e.getTag = function(t) {
                var r = e.getSymbolName(t);
                if (r === t) throw new Error("Use the lowercase or camelCase form of '" + t + "' here");
                return e[r] || (e[r] = n(t)), e[r]
            }, e.ensureTag = function(t) {
                e.getTag(t)
            };
            var n = function(t) {
                    var r = function() {
                        var t = this instanceof e.Tag ? this : new r,
                            n = 0,
                            o = arguments.length && arguments[0];
                        return o && "object" == typeof o && o.constructor === Object && (t.attrs = o, n++), n < arguments.length && (t.children = Array.prototype.slice.call(arguments, n)), t
                    };
                    return r.prototype = new e.Tag, r.prototype.constructor = r, r.prototype.tagName = t, r
                },
                o = e.CharRef = function(e) {
                    if (!(this instanceof o)) return new o(e);
                    if (!(e && e.html && e.str)) throw new Error("HTML.CharRef must be constructed with ({html:..., str:...})");
                    this.html = e.html, this.str = e.str
                },
                a = e.Comment = function(e) {
                    if (!(this instanceof a)) return new a(e);
                    if ("string" != typeof e) throw new Error("HTML.Comment must be constructed with a string");
                    this.value = e, this.sanitizedValue = e.replace(/^-|--+|-$/g, "")
                };
            e.knownElementNames = "a abbr acronym address applet area b base basefont bdo big blockquote body br button caption center cite code col colgroup dd del dfn dir div dl dt em fieldset font form frame frameset h1 h2 h3 h4 h5 h6 head hr html i iframe img input ins isindex kbd label legend li link map menu meta noframes noscript object ol optgroup option p param pre q s samp script select small span strike strong style sub sup table tbody td textarea tfoot th thead title tr tt u ul var article aside audio bdi canvas command data datagrid datalist details embed eventsource figcaption figure footer header hgroup keygen mark meter nav output progress ruby rp rt section source summary time track video wbr".split(" "), e.knownSVGElementNames = "altGlyph altGlyphDef altGlyphItem animate animateColor animateMotion animateTransform circle clipPath color-profile cursor defs desc ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter font font-face font-face-format font-face-name font-face-src font-face-uri foreignObject g glyph glyphRef hkern image line linearGradient marker mask metadata missing-glyph path pattern polygon polyline radialGradient rect script set stop style svg switch symbol text textPath title tref tspan use view vkern".split(" "), e.knownElementNames = e.knownElementNames.concat(e.knownSVGElementNames), e.voidElementNames = "area base br col command embed hr img input keygen link meta param source track wbr".split(" ");
            var c = {
                    yes: !0
                },
                s = function(e) {
                    for (var t = {}, r = 0; r < e.length; r++) t[e[r]] = c;
                    return t
                },
                i = s(e.voidElementNames),
                u = s(e.knownElementNames),
                d = s(e.knownSVGElementNames);
            e.isKnownElement = function(e) {
                return u[e] === c
            }, e.isVoidElement = function(e) {
                return i[e] === c
            }, e.isKnownSVGElement = function(e) {
                return d[e] === c
            }, e.isTagEnsured = function(t) {
                return e.isKnownElement(t)
            }, e.getSymbolName = function(e) {
                return e.toUpperCase().replace(/-/g, "_")
            };
            for (var p = 0; p < e.knownElementNames.length; p++) e.ensureTag(e.knownElementNames[p]);
            t = function(e) {
                var t, r = Deps.currentComputation,
                    n = Deps.autorun(function() {
                        t = e()
                    });
                return n.onInvalidate(function() {
                    r && r.invalidate()
                }), Deps.active ? Deps.onInvalidate(function() {
                    n.stop(), e.stop && e.stop()
                }) : (n.stop(), e.stop && e.stop()), t
            }, r = function(e) {
                e.materialized && e.materialized.isWith && (Deps.active ? e.materialized() : e.data ? e.data.stop() : e.v && e.v.stop())
            }, e.evaluate = function(n, o) {
                if (null == n) return n;
                if ("function" == typeof n) return e.evaluate(t(n), o);
                if (n instanceof Array) {
                    for (var a = [], c = 0; c < n.length; c++) a.push(e.evaluate(n[c], o));
                    return a
                }
                if ("function" == typeof n.instantiate) {
                    var s = n.instantiate(o || null),
                        i = s.render("STATIC");
                    return r(s), e.evaluate(i, s)
                }
                if (n instanceof e.Tag) {
                    for (var u = [], c = 0; c < n.children.length; c++) u.push(e.evaluate(n.children[c], o));
                    var d = e.getTag(n.tagName).apply(null, u);
                    d.attrs = {};
                    for (var p in n.attrs) d.attrs[p] = e.evaluate(n.attrs[p], o);
                    return d
                }
                return n
            };
            var l = function(t, r, n) {
                for (var o in r)
                    if ("$dynamic" !== o) {
                        if (!e.isValidAttributeName(o)) throw new Error("Illegal HTML attribute name: " + o);
                        var a = e.evaluate(r[o], n);
                        e.isNully(a) || (t[o] = a)
                    }
            };
            e.evaluateAttributes = function(e, t) {
                if (!e) return e;
                var r = {};
                if (l(r, e, t), "$dynamic" in e) {
                    if (!(e.$dynamic instanceof Array)) throw new Error("$dynamic must be an array");
                    for (var n = e.$dynamic, o = 0; o < n.length; o++) {
                        var a = n[o];
                        "function" == typeof a && (a = a()), l(r, a, t)
                    }
                }
                return r
            }, e.Tag.prototype.evaluateAttributes = function(t) {
                return e.evaluateAttributes(this.attrs, t)
            }, e.Raw = function(t) {
                if (!(this instanceof e.Raw)) return new e.Raw(t);
                if ("string" != typeof t) throw new Error("HTML.Raw must be constructed with a string");
                this.value = t
            }, e.EmitCode = function(t) {
                if (!(this instanceof e.EmitCode)) return new e.EmitCode(t);
                if ("string" != typeof t) throw new Error("HTML.EmitCode must be constructed with a string");
                this.value = t
            }
        }.call(this),
        function() {
            e.toHTML = function(n, o) {
                if (null == n) return "";
                if ("string" == typeof n || "boolean" == typeof n || "number" == typeof n) return e.escapeData(String(n));
                if (n instanceof Array) {
                    for (var a = [], c = 0; c < n.length; c++) a.push(e.toHTML(n[c], o));
                    return a.join("")
                }
                if ("function" == typeof n.instantiate) {
                    var s = n.instantiate(o || null),
                        i = s.render("STATIC");
                    return r(s), e.toHTML(i, s)
                }
                if ("function" == typeof n) return e.toHTML(t(n), o);
                if (n.toHTML) return n.toHTML(o);
                throw new Error("Expected tag, string, array, component, null, undefined, or object with a toHTML method; found: " + n)
            }, e.Comment.prototype.toHTML = function() {
                return "<!--" + this.sanitizedValue + "-->"
            }, e.CharRef.prototype.toHTML = function() {
                return this.html
            }, e.Raw.prototype.toHTML = function() {
                return this.value
            }, e.Tag.prototype.toHTML = function(t) {
                var r = [],
                    n = this.evaluateAttributes(t);
                if (n)
                    for (var o in n) {
                        var a = e.toText(n[o], e.TEXTMODE.ATTRIBUTE, t);
                        r.push(" " + o + '="' + a + '"')
                    }
                var c, s = this.tagName,
                    i = "<" + s + r.join("") + ">",
                    u = [];
                if ("textarea" === s) {
                    for (var d = 0; d < this.children.length; d++) u.push(e.toText(this.children[d], e.TEXTMODE.RCDATA, t));
                    c = u.join(""), "\n" === c.slice(0, 1) && (c = "\n" + c)
                } else {
                    for (var d = 0; d < this.children.length; d++) u.push(e.toHTML(this.children[d], t));
                    c = u.join("")
                }
                var p = i + c;
                return (this.children.length || !e.isVoidElement(s)) && (p += "</" + s + ">"), p
            }, e.TEXTMODE = {
                ATTRIBUTE: 1,
                RCDATA: 2,
                STRING: 3
            }, e.toText = function(n, o, a) {
                if (null == n) return "";
                if ("string" == typeof n || "boolean" == typeof n || "number" == typeof n) {
                    if (n = String(n), o === e.TEXTMODE.STRING) return n;
                    if (o === e.TEXTMODE.RCDATA) return e.escapeData(n);
                    if (o === e.TEXTMODE.ATTRIBUTE) return n.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
                    throw new Error("Unknown TEXTMODE: " + o)
                }
                if (n instanceof Array) {
                    for (var c = [], s = 0; s < n.length; s++) c.push(e.toText(n[s], o, a));
                    return c.join("")
                }
                if ("function" == typeof n) return e.toText(t(n), o, a);
                if ("function" == typeof n.instantiate) {
                    var i = n.instantiate(a || null),
                        u = i.render("STATIC"),
                        d = e.toText(u, o, i);
                    return r(i), d
                }
                if (n.toText) return n.toText(o, a);
                throw new Error("Expected tag, string, array, component, null, undefined, or object with a toText method; found: " + n)
            }, e.Raw.prototype.toText = function() {
                return this.value
            }, e.Tag.prototype.toText = function(t, r) {
                if (t === e.TEXTMODE.STRING) return e.toText(this.toHTML(r), t);
                throw new Error("Can't insert tags in attributes or TEXTAREA elements")
            }, e.CharRef.prototype.toText = function(t) {
                if (t === e.TEXTMODE.STRING) return this.str;
                if (t === e.TEXTMODE.RCDATA) return this.html;
                if (t === e.TEXTMODE.ATTRIBUTE) return this.html;
                throw new Error("Unknown TEXTMODE: " + t)
            }
        }.call(this), "undefined" == typeof Package && (Package = {}), Package.htmljs = {
            HTML: e
        }
}(),
function() {
    var e, t, r, n, o, a, c, s, i, u, d, p, l = Package.meteor.Meteor,
        h = (Package.jquery.$, Package.jquery.jQuery, Package.deps.Deps),
        f = (Package.random.Random, Package.ejson.EJSON, Package.underscore._),
        g = (Package["ordered-dict"].OrderedDict, Package.minimongo.LocalCollection),
        m = (Package.minimongo.Minimongo, Package["observe-sequence"].ObserveSequence),
        v = Package.htmljs.HTML;
    (function() {
        var e;
        r = function(t, r) {
            e || (e = function() {
                return "undefined" != typeof l ? l._debug : "undefined" != typeof console && console.log ? console.log : function() {}
            }), e()(r || "Exception in Meteor UI:", t.stack || t.message)
        }
    }).call(this),
        function() {
            e = {}, n = function(e, t) {
                for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
                return e
            };
            var t = function(e, t, r) {
                try {
                    Object.defineProperty(e, t, {
                        value: r
                    })
                } catch (n) {
                    e[t] = r
                }
                return e
            };
            ! function() {
                e.Component = function(e) {
                    var r = new e;
                    return t(r, "_constr", e), t(r, "_super", null), r
                }(function() {})
            }(), n(e, {
                nextGuid: 2,
                isComponent: function(t) {
                    return t && e.isKindOf(t, e.Component)
                },
                isKindOf: function(e, t) {
                    for (; e;) {
                        if (e === t) return !0;
                        e = e._super
                    }
                    return !1
                },
                _requireNotDestroyed: function(e) {
                    if (e.isDestroyed) throw new Error("Component has been destroyed; can't perform this operation")
                },
                _requireInited: function(e) {
                    if (!e.isInited) throw new Error("Component must be inited to perform this operation")
                },
                _requireDom: function(e) {
                    if (!e.dom) throw new Error("Component must be built into DOM to perform this operation")
                }
            }), o = e.Component, n(e.Component, {
                kind: "Component",
                guid: "1",
                dom: null,
                isInited: !1,
                isDestroyed: !1,
                parent: null,
                extend: function(r) {
                    if (this.isInited) throw new Error("Can't extend an inited Component");
                    var o, a = !1;
                    r && r.kind ? (o = function() {}, a = !0) : o = this._constr, o.prototype = this;
                    var c = new o;
                    return a && (c._constr = o), r && n(c, r), t(c, "_super", this), c.guid = String(e.nextGuid++), c
                }
            });
            a = function(e, t) {
                for (; t;) {
                    if ("undefined" != typeof t[e]) return t;
                    t = t.parent
                }
                return null
            }, c = function(e, t) {
                for (; t;) {
                    if (t.__helperHost) return "undefined" != typeof t[e] ? t : null;
                    t = t.parent
                }
                return null
            }, s = function(e) {
                return e = a("data", e), e ? "function" == typeof e.data ? e.data() : e.data : null
            }, i = function(e) {
                var t = e.templateInstance;
                t.data = s(e), e.dom && !e.isDestroyed ? (t.firstNode = e.dom.startNode().nextSibling, t.lastNode = e.dom.endNode().previousSibling, t.lastNode && t.lastNode.nextSibling === t.firstNode && (t.lastNode = t.firstNode)) : (t.firstNode = null, t.lastNode = null)
            }, n(e.Component, {
                helpers: function(e) {
                    n(this, e)
                },
                events: function(e) {
                    var t;
                    t = this.hasOwnProperty("_events") ? this._events : this._events = [], f.each(e, function(e, r) {
                        var n = r.split(/,\s+/);
                        f.each(n, function(r) {
                            var n = r.split(/\s+/);
                            if (0 !== n.length) {
                                var o = n.shift(),
                                    a = n.join(" ");
                                t.push({
                                    events: o,
                                    selector: a,
                                    handler: e
                                })
                            }
                        })
                    })
                }
            }), e.Component.notifyParented = function() {
                for (var t = this, r = t; r; r = r._super) {
                    var n = r.hasOwnProperty("_events") && r._events || null;
                    !n && r.hasOwnProperty("events") && "object" == typeof r.events && (e.Component.events.call(r, r.events), n = r._events), f.each(n, function(r) {
                        var n = function(n) {
                            var o = e.DomRange.getContainingComponent(n.currentTarget),
                                a = o && s(o),
                                c = f.toArray(arguments);
                            return i(t), h.nonreactive(function() {
                                return c.splice(1, 0, t.templateInstance), r.handler.apply(null === a ? {} : a, c)
                            })
                        };
                        t.dom.on(r.events, r.selector, n)
                    })
                }
                t.rendered && h.afterFlush(function() {
                    t.isDestroyed || (i(t), t.rendered.call(t.templateInstance))
                })
            }, e.Component.preserve = function() {
                l._debug("The 'preserve' method on templates is now unnecessary and deprecated.")
            }, e.getElementData = function(t) {
                var r = e.DomRange.getContainingComponent(t);
                return r && s(r)
            };
            var r = !1;
            e._allowJavascriptUrls = function() {
                r = !0
            }, e._javascriptUrlsAllowed = function() {
                return r
            }
        }.call(this),
        function() {
            if (l.isClient) {
                if (!Package.jquery) throw new Error("Meteor UI jQuery adapter: jQuery not found.");
                var t = Package.jquery.jQuery,
                    r = {};
                e.DomBackend = r;
                var n = "meteor_ui_removal_watcher",
                    o = "$meteor_ui_removal_callbacks",
                    a = function() {};
                r.removeElement = function(e) {
                    t(e).remove()
                }, r.onRemoveElement = function(e, r) {
                    e[o] || (e[o] = [], t(e).on(n, a)), e[o].push(r)
                }, t.event.special[n] = {
                    teardown: function() {
                        var e = this,
                            t = e[o];
                        if (t) {
                            for (var r = 0; r < t.length; r++) t[r](e);
                            e[o] = null
                        }
                    }
                }, r.parseHTML = function(e) {
                    return t.parseHTML(e) || []
                }, r.findBySelector = function(e, r) {
                    return t(e, r)
                }, r.newFragment = function(e) {
                    for (var t = document.createDocumentFragment(), r = 0; r < e.length; r++) t.appendChild(e[r]);
                    return t
                }, r.delegateEvents = function(e, r, n, o) {
                    t(e).on(r, n, o)
                }, r.undelegateEvents = function(e, r, n) {
                    t(e).off(r, n)
                }, r.bindEventCapturer = function(e, r, n, o) {
                    var a = t(e),
                        c = function(r) {
                            r = t.event.fix(r), r.currentTarget = r.target;
                            var c = t(r.currentTarget);
                            c.is(a.find(n)) && o.call(e, r)
                        };
                    o._meteorui_wrapper = c, r = this.parseEventType(r), e.addEventListener(r, c, !0)
                }, r.unbindEventCapturer = function(e, t, r) {
                    t = this.parseEventType(t), e.removeEventListener(t, r._meteorui_wrapper, !0)
                }, r.parseEventType = function(e) {
                    var t = e.indexOf(".");
                    return t >= 0 ? e.slice(0, t) : e
                }
            }
        }.call(this),
        function() {
            var t = e.DomBackend,
                r = function(e) {
                    e.parentNode.removeChild(e)
                },
                n = function(e, t, r) {
                    t.insertBefore(e, r || null)
                },
                o = function(e, t, r) {
                    t.insertBefore(e, r || null)
                },
                a = function(e, t) {
                    for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
                    return e
                },
                c = function(e, t) {
                    if (!e) return !1;
                    for (var r = 0, n = e.length; n > r; r++)
                        if (e[r] === t) return !0;
                    return !1
                },
                s = function(e) {
                    return !("number" != typeof e.length || !e.sort && !e.splice)
                },
                i = function(e) {
                    return !(3 === e.nodeType && (!e.nodeValue || /^\s+$/.test(e.nodeValue)))
                },
                u = function(e) {
                    if ("string" != typeof e) throw new Error("id must be a string");
                    if (!e) throw new Error("id may not be empty")
                },
                d = function() {
                    var e = document.createTextNode("");
                    try {
                        return e.blahblah = !0, !0
                    } catch (t) {
                        return !1
                    }
                }(),
                p = d ? function() {
                    return document.createTextNode("")
                } : function() {
                    return document.createComment("IE")
                },
                l = function(e) {
                    if (!e.isParented) {
                        if (e.isParented = !0, !e.owner) {
                            var r = e.parentNode(),
                                n = r.$_uiranges || (r.$_uiranges = {});
                            n[e._rangeId] = e, e._rangeDict = n, t.onRemoveElement(r, function() {
                                h(e)
                            })
                        }
                        e.component && e.component.notifyParented && e.component.notifyParented();
                        var o = e.members;
                        for (var a in o) {
                            var c = o[a];
                            c instanceof v && l(c)
                        }
                    }
                },
                h = function(e) {
                    if (!e.isRemoved) {
                        if (e.isRemoved = !0, e._rangeDict && delete e._rangeDict[e._rangeId], e.stopHandles) {
                            for (var t = 0; t < e.stopHandles.length; t++) e.stopHandles[t].stop();
                            e.stopHandles = null
                        }
                        e.removed && e.removed(), g(e)
                    }
                },
                f = function(e, r) {
                    if (1 === e.nodeType) {
                        for (var n = v.getComponents(e), o = 0, a = n.length; a > o; o++) h(n[o]);
                        r || t.removeElement(e)
                    }
                },
                g = function(e) {
                    var t = e.members;
                    for (var r in t) {
                        var n = t[r];
                        n instanceof v ? h(n) : f(n)
                    }
                },
                m = 1,
                v = function() {
                    var e = p(),
                        r = p(),
                        n = t.newFragment([e, r]);
                    n.$_uiIsOffscreen = !0, this.start = e, this.end = r, e.$ui = this, r.$ui = this, this.members = {}, this.nextMemberId = 1, this.owner = null, this._rangeId = m++, this._rangeDict = null, this.isParented = !1, this.isRemoved = !1, this.stopHandles = null
                };
            a(v.prototype, {
                getNodes: function() {
                    if (!this.parentNode()) return [];
                    this.refresh();
                    for (var e = this.end.nextSibling, t = [], r = this.start; r && r !== e; r = r.nextSibling) t.push(r);
                    return t
                },
                removeAll: function() {
                    if (this.parentNode()) {
                        this.refresh();
                        for (var e = this.end, t = [], n = this.start.nextSibling; n && n !== e; n = n.nextSibling) t.push(n);
                        for (var o = 0, a = t.length; a > o; o++) r(t[o]);
                        g(this), this.members = {}
                    }
                },
                add: function(e, t, r, o) {
                    if (null != e && "string" != typeof e) {
                        if ("object" != typeof e) throw new Error("id must be a string");
                        r = t, t = e, e = null
                    }
                    if (!t || "object" != typeof t) throw new Error("Expected component, node, or array");
                    if (s(t)) {
                        if (1 !== t.length) {
                            if (null != e) throw new Error("Can only add one node or one component if id is given");
                            var a = t;
                            o = this.getInsertionPoint(r);
                            for (var c = 0; c < a.length; c++) this.add(null, a[c], r, o);
                            return
                        }
                        t = t[0]
                    }
                    var i = this.parentNode();
                    if (i) {
                        var d = o || this.getInsertionPoint(r),
                            p = t;
                        null == e ? e = this.nextMemberId++ : (u(e), e = " " + e);
                        var g = this.members;
                        if (g.hasOwnProperty(e)) {
                            var m = g[e];
                            if (m instanceof v) {
                                var y = m;
                                if (y.start.parentNode === i) throw new Error("Member already exists: " + e.slice(1));
                                delete g[e], y.owner = null, h(y)
                            } else {
                                var E = m;
                                if (E.parentNode === i) throw new Error("Member already exists: " + e.slice(1));
                                f(E), delete g[e]
                            }
                        }
                        if (p instanceof v) {
                            var b = p;
                            b.owner = this;
                            var A = b.getNodes();
                            g[e] = p;
                            for (var c = 0; c < A.length; c++) n(A[c], i, d);
                            this.isParented && l(b)
                        } else {
                            if ("number" != typeof p.nodeType) throw new Error("Expected Component or Node");
                            var C = p;
                            3 !== C.nodeType && (C.$ui = this), g[e] = p, n(C, i, d)
                        }
                    }
                },
                remove: function(e) {
                    if (null == e) return this.removeAll(), r(this.start), r(this.end), this.owner = null, void h(this);
                    u(e), e = " " + e;
                    var t = this.members,
                        n = t.hasOwnProperty(e) && t[e];
                    if (delete t[e], n) {
                        var o = this.parentNode();
                        if (o)
                            if (n instanceof v) {
                                var a = n;
                                a.owner = null, a.start.parentNode === o && n.remove()
                            } else {
                                var c = n;
                                c.parentNode === o && r(c)
                            }
                    }
                },
                moveBefore: function(e, t) {
                    var r = this.getInsertionPoint(t);
                    u(e), e = " " + e;
                    var n = this.members,
                        a = n.hasOwnProperty(e) && n[e];
                    if (a) {
                        var c = this.parentNode();
                        if (c)
                            if (a instanceof v) {
                                var s = a;
                                if (s.start.parentNode === c) {
                                    s.refresh();
                                    for (var i = s.getNodes(), d = 0; d < i.length; d++) o(i[d], c, r)
                                }
                            } else {
                                var p = a;
                                o(p, c, r)
                            }
                    }
                },
                get: function(e) {
                    u(e), e = " " + e;
                    var t = this.members;
                    return t.hasOwnProperty(e) ? t[e] : null
                },
                parentNode: function() {
                    return this.start.parentNode
                },
                startNode: function() {
                    return this.start
                },
                endNode: function() {
                    return this.end
                },
                eachMember: function(e, t) {
                    var r = this.members,
                        n = this.parentNode();
                    for (var o in r) {
                        var a = r[o];
                        if (a instanceof v) {
                            var c = a;
                            c.start.parentNode === n ? t && t(c) : (c.owner = null, delete r[o], h(c))
                        } else {
                            var s = a;
                            s.parentNode === n ? e && e(s) : (delete r[o], f(s))
                        }
                    }
                },
                refresh: function() {
                    var e = this.parentNode();
                    if (e) {
                        var t = null,
                            r = null,
                            o = 0,
                            a = null;
                        this.eachMember(function(e) {
                            t = e, o++, 3 === e.nodeType && (a = a || [], a.push(e))
                        }, function(e) {
                            e.refresh(), r = e, o++
                        });
                        var s = null,
                            u = null;
                        if (0 === o);
                        else if (1 === o) t ? (s = t, u = t) : r && (s = r.start, u = r.end);
                        else
                            for (var d = e.firstChild; d; d = d.nextSibling) {
                                var p;
                                if (d.$ui && (p = d.$ui) && (p === this && d !== this.start && d !== this.end && i(d) || p !== this && p.owner === this && p.start === d)) {
                                    if (s)
                                        for (var l = s.previousSibling; l && !l.$ui; l = l.previousSibling) this.members[this.nextMemberId++] = l, 3 !== l.nodeType && (l.$ui = this);
                                    d.$ui === this ? (s = s || d, u = d) : (s = s || d, d = d.$ui.end, u = d)
                                }
                            }
                        if (s) {
                            for (var l;
                                (l = s.previousSibling) && (l.$ui && l.$ui === this || c(a, l));) s = l;
                            for (var l;
                                (l = u.nextSibling) && (l.$ui && l.$ui === this || c(a, l));) u = l;
                            s !== this.start && n(this.start, e, s), u !== this.end && n(this.end, e, u.nextSibling)
                        }
                    }
                },
                getInsertionPoint: function(e) {
                    var t = this.members,
                        r = this.parentNode();
                    if (!e) return this.end;
                    u(e), e = " " + e;
                    var n = t[e];
                    if (n instanceof v) {
                        var o = n;
                        if (o.start.parentNode === r) return o.refresh(), o.start;
                        o.owner = null, h(o)
                    } else {
                        var a = n;
                        if (a.parentNode === r) return a;
                        f(a)
                    }
                    return delete t[e], this.end
                }
            }), v.prototype.elements = function(e) {
                return e = e || [], this.eachMember(function(t) {
                    1 === t.nodeType && e.push(t)
                }, function(t) {
                    t.elements(e)
                }), e
            }, v.refresh = function(e) {
                for (var t = v.getComponents(e), r = 0, n = t.length; n > r; r++) t[r].refresh()
            }, v.getComponents = function(e) {
                for (var t = [], r = e.firstChild; r; r = r.nextSibling) r.$ui && r === r.$ui.start && !r.$ui.owner && t.push(r.$ui);
                return t
            }, v.insert = function(e, t, r) {
                for (var o = e.getNodes(), a = 0; a < o.length; a++) n(o[a], t, r);
                l(e)
            }, v.getContainingComponent = function(e) {
                for (; e && !e.$ui;) e = e.parentNode;
                for (var t = e && e.$ui; t;) {
                    if (t.component) return t.component;
                    t = t.owner
                }
                return null
            }, v.prototype.contains = function(e) {
                if (!e) throw new Error("Expected Component or Node");
                var t = this.parentNode();
                if (!t) return !1;
                var r;
                if (e instanceof v) {
                    r = e;
                    var n = r.parentNode();
                    if (!n) return !1;
                    if (n !== t) return this.contains(n);
                    if (r === this) return !1
                } else {
                    var o = e;
                    if (!w(t, o)) return !1;
                    for (; o.parentNode !== t;) o = o.parentNode;
                    r = o.$ui
                }
                for (; r && r !== this;) r = r.owner;
                return r === this
            }, v.prototype.$ = function(e) {
                var r = this,
                    n = this.parentNode();
                if (!n) throw new Error("Can't select in removed DomRange");
                if (11 === n.nodeType || n.$_uiIsOffscreen) throw new Error("Can't use $ on an offscreen component");
                var o = t.findBySelector(e, n),
                    a = function(e) {
                        return "number" == typeof e && (e = this), r.contains(e)
                    };
                if (o.filter) o = o.filter(a);
                else {
                    for (var c = [], s = 0; s < o.length; s++) {
                        var i = o[s];
                        a(i) && c.push(i)
                    }
                    o = c
                }
                return o
            };
            var y = {
                    blur: 1,
                    change: 1,
                    click: 1,
                    focus: 1,
                    focusin: 1,
                    focusout: 1,
                    reset: 1,
                    submit: 1
                },
                E = 0,
                b = 1,
                A = 2,
                C = function(e, r, n, o, a) {
                    this.elem = e, this.type = r, this.selector = n, this.handler = o, this.$ui = a, this.mode = E, this.delegatedHandler = function(e) {
                        return function(t) {
                            return (e.selector || t.currentTarget === t.target) && e.$ui.contains(t.currentTarget) ? e.handler.apply(e.$ui, arguments) : void 0
                        }
                    }(this);
                    var c = e.addEventListener && !y.hasOwnProperty(t.parseEventType(r));
                    c ? this.capturingHandler = function(e) {
                        return function(r) {
                            if (e.mode === E) {
                                if (r.bubbles) return e.mode = b, void t.unbindEventCapturer(e.elem, e.type, e.capturingHandler);
                                e.mode = A, t.undelegateEvents(e.elem, e.type, e.delegatedHandler)
                            }
                            e.delegatedHandler(r)
                        }
                    }(this) : this.mode = b
                };
            C.prototype.bind = function() {
                this.mode !== b && t.bindEventCapturer(this.elem, this.type, this.selector || "*", this.capturingHandler), this.mode !== A && t.delegateEvents(this.elem, this.type, this.selector || "*", this.delegatedHandler)
            }, C.prototype.unbind = function() {
                this.mode !== b && t.unbindEventCapturer(this.elem, this.type, this.capturingHandler), this.mode !== A && t.undelegateEvents(this.elem, this.type, this.delegatedHandler)
            }, v.prototype.on = function(e, t, r) {
                var n = this.parentNode();
                if (n) {
                    if (n.$_uiIsOffscreen) throw new Error("Can't bind events before DomRange is inserted");
                    var o = [];
                    e.replace(/[^ /]+/g, function(e) {
                        o.push(e)
                    }), r || "function" != typeof t ? t || (t = null) : (r = t, t = null);
                    for (var a = [], c = 0, s = o.length; s > c; c++) {
                        var i = o[c],
                            u = n.$_uievents;
                        u || (u = n.$_uievents = {});
                        var d = u[i];
                        d || (d = u[i] = {}, d.handlers = []);
                        var p = d.handlers,
                            l = new C(n, i, t, r, this);
                        a.push(l), l.bind(), p.push(l);
                        for (var h = this.owner; h; h = h.owner)
                            for (var f = 0, g = p.length; g > f; f++) {
                                var m = p[f];
                                m.$ui === h && (m.unbind(), m.bind(), p.splice(f, 1), p.push(m), f--, g--)
                            }
                    }
                    this.stopHandles = this.stopHandles || [], this.stopHandles.push({
                        stop: function() {
                            var e = n.$_uievents;
                            if (e) {
                                for (var t = 0; t < a.length; t++) {
                                    var r = a[t],
                                        o = e[r.type];
                                    if (o)
                                        for (var c = o.handlers, s = c.length - 1; s >= 0; s--) c[s] === r && (r.unbind(), c.splice(s, 1))
                                }
                                a.length = 0
                            }
                        }
                    })
                }
            };
            var w = function(e, t) {
                return 1 !== e.nodeType ? !1 : e === t ? !1 : e.compareDocumentPosition ? 16 & e.compareDocumentPosition(t) : (t = t.parentNode, t && 1 === t.nodeType ? e === t ? !0 : e.contains(t) : !1)
            };
            e.DomRange = v
        }.call(this),
        function() {
            u = function(e, t) {
                this.name = e, this.value = t
            }, u.prototype.update = function(e, t, r) {
                null === r ? null !== t && e.removeAttribute(this.name) : e.setAttribute(this.name, r)
            }, u.extend = function(e) {
                var t = this,
                    r = function() {
                        u.apply(this, arguments)
                    };
                return r.prototype = new t, r.extend = t.extend, e && f.extend(r.prototype, e), r
            };
            var t = u.extend({
                    update: function(e, t, r) {
                        if (!this.getCurrentValue || !this.setValue) throw new Error("Missing methods in subclass of 'BaseClassHandler'");
                        for (var n = t ? f.compact(t.split(" ")) : [], o = r ? f.compact(r.split(" ")) : [], a = f.compact(this.getCurrentValue(e).split(" ")), c = 0; c < n.length; c++) {
                            var s = n[c];
                            f.contains(o, s) || (a = f.without(a, s))
                        }
                        for (var c = 0; c < o.length; c++) {
                            var s = o[c];
                            f.contains(n, s) || f.contains(a, s) || a.push(s)
                        }
                        this.setValue(e, a.join(" "))
                    }
                }),
                r = t.extend({
                    getCurrentValue: function(e) {
                        return e.className
                    },
                    setValue: function(e, t) {
                        e.className = t
                    }
                }),
                n = t.extend({
                    getCurrentValue: function(e) {
                        return e.className.baseVal
                    },
                    setValue: function(e, t) {
                        e.setAttribute("class", t)
                    }
                }),
                o = u.extend({
                    update: function(e, t, r) {
                        var n = this.focused(e);
                        if (!n) {
                            var o = this.name;
                            null == r ? null != t && (e[o] = !1) : e[o] = !0
                        }
                    },
                    focused: function(e) {
                        if ("INPUT" === e.tagName) return e === document.activeElement;
                        if ("OPTION" === e.tagName) {
                            for (var t = e; t && "SELECT" !== t.tagName;) t = t.parentNode;
                            return t ? t === document.activeElement : !1
                        }
                        throw new Error("Expected INPUT or OPTION element")
                    }
                }),
                a = u.extend({
                    update: function(e, t, r) {
                        var n = e === document.activeElement;
                        n || (e.value = r)
                    }
                }),
                c = u.extend({
                    update: function(e, t, r) {
                        var n = "http://www.w3.org/1999/xlink";
                        null === r ? null !== t && e.removeAttributeNS(n, this.name) : e.setAttributeNS(n, this.name, this.value)
                    }
                }),
                s = function(e) {
                    return "ownerSVGElement" in e
                },
                i = function(e, t) {
                    var r = {
                        FORM: ["action"],
                        BODY: ["background"],
                        BLOCKQUOTE: ["cite"],
                        Q: ["cite"],
                        DEL: ["cite"],
                        INS: ["cite"],
                        OBJECT: ["classid", "codebase", "data", "usemap"],
                        APPLET: ["codebase"],
                        A: ["href"],
                        AREA: ["href"],
                        LINK: ["href"],
                        BASE: ["href"],
                        IMG: ["longdesc", "src", "usemap"],
                        FRAME: ["longdesc", "src"],
                        IFRAME: ["longdesc", "src"],
                        HEAD: ["profile"],
                        SCRIPT: ["src"],
                        INPUT: ["src", "usemap", "formaction"],
                        BUTTON: ["formaction"],
                        BASE: ["href"],
                        MENUITEM: ["icon"],
                        HTML: ["manifest"],
                        VIDEO: ["poster"]
                    };
                    if ("itemid" === t) return !0;
                    var n = r[e] || [];
                    return f.contains(n, t)
                };
            if (l.isClient) var h = document.createElement("A");
            var g = function(e) {
                    if (l.isClient) return h.href = e, h.href;
                    throw new Error("normalizeUrl not implemented on the server")
                },
                m = u.prototype.update,
                v = u.extend({
                    update: function(t, r, n) {
                        var o = this,
                            a = arguments;
                        if (e._javascriptUrlsAllowed()) m.apply(o, a);
                        else {
                            var c = 0 === g(n).indexOf("javascript:");
                            c ? (l._debug("URLs that use the 'javascript:' protocol are not allowed in URL attribute values. Call UI._allowJavascriptUrls() to enable them."), m.apply(o, [t, r, null])) : m.apply(o, a)
                        }
                    }
                });
            d = function(e, t, d) {
                return "class" === t ? s(e) ? new n(t, d) : new r(t, d) : "OPTION" === e.tagName && "selected" === t || "INPUT" === e.tagName && "checked" === t ? new o(t, d) : "TEXTAREA" !== e.tagName && "INPUT" !== e.tagName || "value" !== t ? "xlink:" === t.substring(0, 6) ? new c(t.substring(6), d) : i(e.tagName, t) ? new v(t, d) : new u(t, d) : new a(t, d)
            }, p = function(e) {
                this.elem = e, this.handlers = {}
            }, p.prototype.update = function(e) {
                var t = this.elem,
                    r = this.handlers;
                for (var n in r)
                    if (!e.hasOwnProperty(n)) {
                        var o = r[n],
                            a = o.value;
                        o.value = null, o.update(t, a, null), delete r[n]
                    }
                for (var n in e) {
                    var a, o = null,
                        c = e[n];
                    r.hasOwnProperty(n) ? (o = r[n], a = o.value) : null !== c && (o = d(t, n, c), r[n] = o, a = null), a !== c && (o.value = c, o.update(t, a, c), null === c && delete r[n])
                }
            }
        }.call(this),
        function() {
            e.Component.instantiate = function(t) {
                var r = this;
                if (!e.isComponent(r)) throw new Error("Expected Component kind");
                if (r.isInited) throw new Error("A component kind is required, not an instance");
                var n = r.extend();
                return n.isInited = !0, n.templateInstance = {
                    findAll: function(e) {
                        return n.dom.$(e)
                    },
                    find: function(e) {
                        var t = this.findAll(e);
                        return t[0] || null
                    },
                    firstNode: null,
                    lastNode: null,
                    data: null,
                    __component__: n
                }, n.templateInstance.$ = n.templateInstance.findAll, n.parent = t || null, n.init && n.init(), n.created && (i(n), n.created.call(n.templateInstance)), n
            }, e.Component.render = function() {
                return null
            };
            var t = function(e, t) {
                var r = this;
                r.func = e, r.equals = t, r.curResult = null, r.dep = new h.Dependency, r.resultComputation = h.nonreactive(function() {
                    return h.autorun(function(e) {
                        var t = r.func,
                            n = t();
                        if (!e.firstRun) {
                            var o = r.equals,
                                a = r.curResult;
                            if (o ? o(n, a) : n === a) return
                        }
                        r.curResult = n, r.dep.changed()
                    })
                })
            };
            t.prototype.stop = function() {
                this.resultComputation.stop()
            }, t.prototype.get = function() {
                return h.active && !this.resultComputation.stopped && this.dep.depend(), this.curResult
            }, e.emboxValue = function(e, r) {
                if ("function" == typeof e) {
                    var n = e,
                        o = new t(n, r),
                        a = function() {
                            return o.get()
                        };
                    return a.stop = function() {
                        o.stop()
                    }, a
                }
                var c = e,
                    s = function() {
                        return c
                    };
                return s._isEmboxedConstant = !0, s
            }, e.namedEmboxValue = function(t, r, n) {
                if (!h.active) {
                    var o = e.emboxValue(r, n);
                    return o.stop(), o
                }
                var a = h.currentComputation;
                return a[t] || (a[t] = e.emboxValue(r, n)), a[t]
            }, e.insert = function(t, r, n) {
                if (!t.dom) throw new Error("Expected template rendered with UI.render");
                e.DomRange.insert(t.dom, r, n)
            };
            var n = function(t, r, n) {
                if (!r) throw new Error("Materialization parent required");
                r instanceof e.DomRange ? r.add(t, n) : t instanceof e.DomRange ? e.DomRange.insert(t, r, n) : r.insertBefore(t, n || null)
            };
            e.render = function(t, r) {
                if (t.isInited) throw new Error("Can't render component instance, only component kind");
                var n, o, c;
                return h.nonreactive(function() {
                    n = t.instantiate(r), o = n.render && n.render(), c = new e.DomRange, n.dom = c, c.component = n
                }), a(o, c, null, n), c.removed = function() {
                    n.isDestroyed = !0, n.destroyed && h.nonreactive(function() {
                        i(n), n.destroyed.call(n.templateInstance)
                    })
                }, n
            }, e.renderWithData = function(t, r, n) {
                if (!e.isComponent(t)) throw new Error("Component required here");
                if (t.isInited) throw new Error("Can't render component instance, only component kind");
                if ("function" == typeof r) throw new Error("Data argument can't be a function");
                return e.render(t.extend({
                    data: function() {
                        return r
                    }
                }), n)
            };
            var o = function(e, t) {
                return e instanceof v.Raw ? t instanceof v.Raw && e.value === t.value : null == e ? null == t : e === t && ("number" == typeof e || "boolean" == typeof e || "string" == typeof e)
            };
            e.InTemplateScope = function(t, r) {
                if (!(this instanceof e.InTemplateScope)) return new e.InTemplateScope(t, r);
                var n = t.parent;
                n.__isTemplateWith && (n = n.parent), this.parentPtr = n, this.content = r
            }, e.InTemplateScope.prototype.toHTML = function() {
                return v.toHTML(this.content, this.parentPtr)
            }, e.InTemplateScope.prototype.toText = function(e) {
                return v.toText(this.content, e, this.parentPtr)
            };
            var a = function(t, c, s, i) {
                if (null == t);
                else if ("string" == typeof t || "boolean" == typeof t || "number" == typeof t) t = String(t), n(document.createTextNode(t), c, s);
                else if (t instanceof Array)
                    for (var u = 0; u < t.length; u++) a(t[u], c, s, i);
                else if ("function" == typeof t) {
                    var d = new e.DomRange,
                        l = null,
                        f = h.autorun(function(e) {
                            var r = t();
                            v.isNully(r) ? r = null : r instanceof Array && 1 === r.length && (r = r[0]), o(r, l) || (l = r, e.firstRun || d.removeAll(), a(r, d, null, i))
                        });
                    d.removed = function() {
                        f.stop(), t.stop && t.stop()
                    }, h.active && t.stop && h.onInvalidate(function() {
                        t.stop()
                    }), n(d, c, s)
                } else if (t instanceof v.Tag) {
                    var g, m = t.tagName;
                    g = v.isKnownSVGElement(m) && document.createElementNS ? document.createElementNS("http://www.w3.org/2000/svg", m) : document.createElement(t.tagName);
                    var y = t.attrs,
                        E = t.children;
                    if ("textarea" === t.tagName && (y = y || {}, y.value = E, E = []), y) {
                        var b = h.autorun(function(e) {
                            var t = e.updater;
                            t || (t = e.updater = new p(g));
                            try {
                                var n = v.evaluateAttributes(y, i),
                                    o = {};
                                if (n) {
                                    for (var a in n) o[a] = v.toText(n[a], v.TEXTMODE.STRING, i);
                                    t.update(o)
                                }
                            } catch (c) {
                                r(c)
                            }
                        });
                        e.DomBackend.onRemoveElement(g, function() {
                            b.stop()
                        })
                    }
                    a(E, g, null, i), n(g, c, s)
                } else if ("function" == typeof t.instantiate) {
                    var A = e.render(t, i);
                    A.materialized && A.materialized(), n(A.dom, c, s)
                } else if (t instanceof v.CharRef) n(document.createTextNode(t.str), c, s);
                else if (t instanceof v.Comment) n(document.createComment(t.sanitizedValue), c, s);
                else if (t instanceof v.Raw)
                    for (var C = e.DomBackend.parseHTML(t.value), u = 0; u < C.length; u++) n(C[u], c, s);
                else {
                    if (Package["html-tools"] && t instanceof Package["html-tools"].HTMLTools.Special) throw new Error("Can't materialize Special tag, it's just an intermediate rep");
                    if (!(t instanceof e.InTemplateScope)) throw new Error("Unexpected node in htmljs: " + t);
                    a(t.content, c, s, t.parentPtr)
                }
            };
            e.materialize = a, e.body = e.Component.extend({
                kind: "body",
                contentParts: [],
                render: function() {
                    return this.contentParts
                },
                INSTANTIATED: !1,
                __helperHost: !0
            }), e.block = function(t) {
                return e.Component.extend({
                    render: t
                })
            }, e.toHTML = function(e, t) {
                return v.toHTML(e, t)
            }, e.toRawText = function(e, t) {
                return v.toText(e, v.TEXTMODE.STRING, t)
            }
        }.call(this),
        function() {
            e.If = function(e, n, o) {
                t("If", e, n, o);
                var a = function() {
                    var t = r(e);
                    return a.stop = function() {
                        t.stop()
                    }, t() ? n : o || null
                };
                return a
            }, e.Unless = function(e, n, o) {
                t("Unless", e, n, o);
                var a = function() {
                    var t = r(e);
                    return a.stop = function() {
                        t.stop()
                    }, t() ? o || null : n
                };
                return a
            }, e.safeEquals = function(e, t) {
                return e !== t ? !1 : !e || "number" == typeof e || "boolean" == typeof e || "string" == typeof e
            }, e.With = function(r, n) {
                t("With", r, n);
                var o = n;
                return "data" in o && (o = e.block(function() {
                    return n
                })), o.data = function() {
                    throw new Error("Can't get data for component kind")
                }, o.init = function() {
                    this.data = e.emboxValue(r, e.safeEquals)
                }, o.materialized = function() {
                    var e = this;
                    h.active && h.onInvalidate(function() {
                        e.data.stop()
                    })
                }, o.materialized.isWith = !0, o
            }, e.Each = function(r, n, o) {
                return t("Each", r, n, o), e.EachImpl.extend({
                    __sequence: r,
                    __content: n,
                    __elseContent: o
                })
            };
            var t = function(t, r, n, o) {
                    if ("function" != typeof r) throw new Error("First argument to " + t + " must be a function");
                    if (!e.isComponent(n)) throw new Error("Second argument to " + t + " must be a template or UI.block");
                    if (o && !e.isComponent(o)) throw new Error("Third argument to " + t + " must be a template or UI.block if present")
                },
                r = function(t) {
                    return e.namedEmboxValue("if/unless", function() {
                        var e = t();
                        return e instanceof Array && 0 === e.length ? !1 : !!e
                    })
                }
        }.call(this),
        function() {
            e.EachImpl = o.extend({
                typeName: "Each",
                render: function(e) {
                    var t = this,
                        r = t.__content,
                        n = t.__elseContent;
                    if ("STATIC" === e) {
                        var o = f.map(m.fetch(t.__sequence()), function(e) {
                            return r.extend({
                                data: function() {
                                    return e
                                }
                            })
                        });
                        return o.length ? o : n
                    }
                    return null
                },
                materialized: function() {
                    var t = this,
                        r = t.dom,
                        n = t.__content,
                        o = t.__elseContent,
                        a = 0,
                        c = function(n) {
                            if (o) {
                                if (0 > a + n) throw new Error("count should never become negative");
                                0 === a && r.removeAll(), a += n, 0 === a && e.materialize(o, r, null, t)
                            }
                        };
                    this.observeHandle = m.observe(function() {
                        return t.__sequence()
                    }, {
                        addedAt: function(o, a, s, i) {
                            c(1), o = g._idStringify(o);
                            var u = a,
                                d = new h.Dependency,
                                p = function() {
                                    return d.depend(), u
                                };
                            p.$set = function(e) {
                                u = e, d.changed()
                            }, i && (i = g._idStringify(i));
                            var l = e.render(n.extend({
                                data: p
                            }), t);
                            r.add(o, l.dom, i)
                        },
                        removedAt: function(e) {
                            c(-1), r.remove(g._idStringify(e))
                        },
                        movedTo: function(e, t, n, o, a) {
                            r.moveBefore(g._idStringify(e), a && g._idStringify(a))
                        },
                        changedAt: function(e, t) {
                            r.get(g._idStringify(e)).component.data.$set(t)
                        }
                    }), c(0)
                },
                destroyed: function() {
                    this.__component__.observeHandle && this.__component__.observeHandle.stop()
                }
            })
        }.call(this),
        function() {
            var t = (function() {
                    return this
                }(), function(e) {
                    return o.extend({
                        kind: "NoOp",
                        render: function() {
                            return l._debug("{{#" + e + "}} is now unnecessary and deprecated."), this.__content
                        }
                    })
                }),
                r = {
                    constant: t("constant"),
                    isolate: t("isolate")
                };
            n(e.Component, {
                lookup: function(t, n) {
                    var o, i, u = this,
                        d = n && n.template;
                    if (!t) throw new Error("must pass id to lookup");
                    if (/^\./.test(t)) {
                        if (!/^(\.)+$/.test(t)) throw new Error("id starting with dot must be a series of dots");
                        for (var p = a("data", u), l = 1; l < t.length; l++) p = p ? a("data", p.parent) : null;
                        return p ? p.data : null
                    }
                    if (i = c(t, u)) var o = i[t];
                    else {
                        if (f.has(r, t)) return r[t];
                        if (d && f.has(Template, t)) return Template[t];
                        if (!(o = e._globalHelper(t))) return function() {
                            var e = s(u);
                            if (d && (!e || !f.has(e, t))) throw new Error("Can't find template, helper or data context key: " + t);
                            if (!e) return e;
                            var r = e[t];
                            return "function" == typeof r ? r.apply(e, arguments) : r
                        }
                    }
                    return "function" != typeof o || o._isEmboxedConstant ? o : function() {
                        var e = s(u);
                        return o.apply(null === e ? {} : e, arguments)
                    }
                },
                lookupTemplate: function(e) {
                    return this.lookup(e, {
                        template: !0
                    })
                },
                get: function(e) {
                    void 0 === e && (e = ".");
                    var t = this.lookup(e);
                    return "function" == typeof t ? t() : t
                },
                set: function(e, t) {
                    var r = a(e, this);
                    if (!r || !r[e]) throw new Error("Can't find field: " + e);
                    if ("function" != typeof r[e]) throw new Error("Not a settable field: " + e);
                    r[e](t)
                }
            })
        }.call(this),
        function() {
            var r = {};
            e.registerHelper = function(e, t) {
                r[e] = t
            }, e._globalHelper = function(e) {
                return r[e]
            }, t = {}, t.registerHelper = e.registerHelper, e._escape = t._escape = function() {
                var e = {
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#x27;",
                        "`": "&#x60;",
                        "&": "&amp;"
                    },
                    t = function(t) {
                        return e[t]
                    };
                return function(e) {
                    return e.replace(/[&<>"'`]/g, t)
                }
            }(), t.SafeString = function(e) {
                this.string = e
            }, t.SafeString.prototype.toString = function() {
                return this.string.toString()
            }
        }.call(this), "undefined" == typeof Package && (Package = {}), Package.ui = {
            UI: e,
            Handlebars: t
        }
}(),
function() {
    {
        var e, t = (Package.meteor.Meteor, Package.ui.UI);
        Package.ui.Handlebars, Package.htmljs.HTML
    }(function() {
        e = {}, e.__define__ = function(r, n) {
            if (e.hasOwnProperty(r)) throw new Error("There are multiple templates named '" + r + "'. Each template needs a unique name.");
            e[r] = t.Component.extend({
                kind: "Template_" + r,
                render: n,
                __helperHost: !0
            })
        }
    }).call(this), "undefined" == typeof Package && (Package = {}), Package.templating = {
        Template: e
    }
}(),
function() {
    var e, t = (Package.meteor.Meteor, Package.htmljs.HTML),
        r = Package.ui.UI,
        n = Package.ui.Handlebars;
    (function() {
        e = {}, e.include = function(e, t, n) {
            if (t && !r.isComponent(t)) throw new Error("Second argument to Spacebars.include must be a template or UI.block if present");
            if (n && !r.isComponent(n)) throw new Error("Third argument to Spacebars.include must be a template or UI.block if present");
            var o = null;
            if (t && (o = o || {}, o.__content = t), n && (o = o || {}, o.__elseContent = n), r.isComponent(e)) return e.extend(o);
            var a = e,
                c = function() {
                    var e = r.namedEmboxValue("Spacebars.include", a);
                    c.stop = function() {
                        e.stop()
                    };
                    var t = e();
                    if (null === t) return null;
                    if (!r.isComponent(t)) throw new Error("Expected null or template in return value from inclusion function, found: " + t);
                    return t.extend(o)
                };
            return c
        }, e.mustacheImpl = function() {
            var t = arguments;
            if (t.length > 1) {
                var r = t[t.length - 1];
                if (r instanceof e.kw) {
                    var n = {};
                    for (var o in r.hash) {
                        var a = r.hash[o];
                        n[o] = "function" == typeof a ? a() : a
                    }
                    t[t.length - 1] = e.kw(n)
                } else r = e.kw(), t = Array.prototype.slice.call(arguments), t.push(r)
            }
            return e.call.apply(null, t)
        }, e.mustache = function() {
            var r = e.mustacheImpl.apply(null, arguments);
            return r instanceof e.SafeString ? t.Raw(r.toString()) : null == r || r === !1 ? null : String(r)
        }, e.attrMustache = function() {
            var r = e.mustacheImpl.apply(null, arguments);
            if (null == r || "" === r) return null;
            if ("object" == typeof r) return r;
            if ("string" == typeof r && t.isValidAttributeName(r)) {
                var n = {};
                return n[r] = "", n
            }
            throw new Error("Expected valid attribute name, '', null, or object")
        }, e.dataMustache = function() {
            var t = e.mustacheImpl.apply(null, arguments);
            return t
        }, e.makeRaw = function(e) {
            return null == e ? null : e instanceof t.Raw ? e : t.Raw(e)
        }, e.call = function(e) {
            if ("function" == typeof e) {
                for (var t = [], r = 1; r < arguments.length; r++) {
                    var n = arguments[r];
                    t[r - 1] = "function" == typeof n ? n() : n
                }
                return e.apply(null, t)
            }
            if (arguments.length > 1) throw new Error("Can't call non-function: " + e);
            return e
        }, e.kw = function(t) {
            return this instanceof e.kw ? void(this.hash = t || {}) : new e.kw(t)
        }, e.SafeString = function(t) {
            return this instanceof e.SafeString ? new n.SafeString(t) : new e.SafeString(t)
        }, e.SafeString.prototype = n.SafeString.prototype, e.dot = function(t, r) {
            if (arguments.length > 2) {
                var n = [];
                return n.push(e.dot(t, r)), n.push.apply(n, Array.prototype.slice.call(arguments, 2)), e.dot.apply(null, n)
            }
            if ("function" == typeof t && (t = t()), !t) return t;
            var o = t[r];
            return "function" != typeof o ? o : function() {
                return o.apply(t, arguments)
            }
        }, e.With = function(e, t, n) {
            return r.Component.extend({
                init: function() {
                    this.v = r.emboxValue(e, r.safeEquals)
                },
                render: function() {
                    return r.If(this.v, r.With(this.v, t), n)
                },
                materialized: function() {
                    var e = function() {
                        var e = this;
                        Deps.active && Deps.onInvalidate(function() {
                            e.v.stop()
                        })
                    };
                    return e.isWith = !0, e
                }()
            })
        }, e.TemplateWith = function(e, t) {
            var n = r.With(e, t);
            return n.__isTemplateWith = !0, n
        }
    }).call(this), "undefined" == typeof Package && (Package = {}), Package.spacebars = {
        Spacebars: e
    }
}(),
function() {
    var e, t, r, n, o, a, c, s, i, u, d, p, l, h = (Package.meteor.Meteor, Package.htmljs.HTML);
    (function() {
        e = {}, e.Parse = {};
        var t = e.asciiLowerCase = function(e) {
                return e.replace(/[A-Z]/g, function(e) {
                    return String.fromCharCode(e.charCodeAt(0) + 32)
                })
            },
            r = "attributeName attributeType baseFrequency baseProfile calcMode clipPathUnits contentScriptType contentStyleType diffuseConstant edgeMode externalResourcesRequired filterRes filterUnits glyphRef glyphRef gradientTransform gradientTransform gradientUnits gradientUnits kernelMatrix kernelUnitLength kernelUnitLength kernelUnitLength keyPoints keySplines keyTimes lengthAdjust limitingConeAngle markerHeight markerUnits markerWidth maskContentUnits maskUnits numOctaves pathLength patternContentUnits patternTransform patternUnits pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits refX refY repeatCount repeatDur requiredExtensions requiredFeatures specularConstant specularExponent specularExponent spreadMethod spreadMethod startOffset stdDeviation stitchTiles surfaceScale surfaceScale systemLanguage tableValues targetX targetY textLength textLength viewBox viewTarget xChannelSelector yChannelSelector zoomAndPan".split(" "),
            n = function(e) {
                for (var n = 0; n < r.length; n++) {
                    var o = r[n];
                    e[t(o)] = o
                }
                return e
            }({}),
            o = function(e) {
                for (var r = h.knownElementNames, n = 0; n < r.length; n++) {
                    var o = r[n];
                    e[t(o)] = o
                }
                return e
            }({});
        e.properCaseTagName = function(e) {
            var r = t(e);
            return o.hasOwnProperty(r) ? o[r] : r
        }, e.properCaseAttributeName = function(e) {
            var r = t(e);
            return n.hasOwnProperty(r) ? n[r] : r
        }
    }).call(this),
        function() {
            t = e.Scanner = function(e) {
                this.input = e, this.pos = 0
            }, t.prototype.rest = function() {
                return this.input.slice(this.pos)
            }, t.prototype.isEOF = function() {
                return this.pos >= this.input.length
            }, t.prototype.fatal = function(e) {
                e = e || "Parse error";
                var t = 20,
                    r = this.input,
                    n = this.pos,
                    o = r.substring(n - t - 1, n);
                o.length > t && (o = "..." + o.substring(-t));
                var a = r.substring(n, n + t + 1);
                a.length > t && (a = a.substring(0, t) + "...");
                var c = (o + a).replace(/\n/g, " ") + "\n" + new Array(o.length + 1).join(" ") + "^",
                    s = new Error(e + "\n" + c);
                s.offset = n;
                var i = r.substring(0, n);
                throw s.line = 1 + (i.match(/\n/g) || []).length, s.col = 1 + n - i.lastIndexOf("\n"), s.scanner = this, s
            }, t.prototype.peek = function() {
                return this.input.charAt(this.pos)
            }, r = function(e) {
                return function(t) {
                    var r = e.exec(t.rest());
                    return r ? (t.pos += r[0].length, r[1] || r[0]) : null
                }
            }
        }.call(this),
        function() {
            var t = {
                    "&Aacute;": {
                        codepoints: [193],
                        characters: "Á"
                    },
                    "&Aacute": {
                        codepoints: [193],
                        characters: "Á"
                    },
                    "&aacute;": {
                        codepoints: [225],
                        characters: "á"
                    },
                    "&aacute": {
                        codepoints: [225],
                        characters: "á"
                    },
                    "&Abreve;": {
                        codepoints: [258],
                        characters: "Ă"
                    },
                    "&abreve;": {
                        codepoints: [259],
                        characters: "ă"
                    },
                    "&ac;": {
                        codepoints: [8766],
                        characters: "∾"
                    },
                    "&acd;": {
                        codepoints: [8767],
                        characters: "∿"
                    },
                    "&acE;": {
                        codepoints: [8766, 819],
                        characters: "∾̳"
                    },
                    "&Acirc;": {
                        codepoints: [194],
                        characters: "Â"
                    },
                    "&Acirc": {
                        codepoints: [194],
                        characters: "Â"
                    },
                    "&acirc;": {
                        codepoints: [226],
                        characters: "â"
                    },
                    "&acirc": {
                        codepoints: [226],
                        characters: "â"
                    },
                    "&acute;": {
                        codepoints: [180],
                        characters: "´"
                    },
                    "&acute": {
                        codepoints: [180],
                        characters: "´"
                    },
                    "&Acy;": {
                        codepoints: [1040],
                        characters: "А"
                    },
                    "&acy;": {
                        codepoints: [1072],
                        characters: "а"
                    },
                    "&AElig;": {
                        codepoints: [198],
                        characters: "Æ"
                    },
                    "&AElig": {
                        codepoints: [198],
                        characters: "Æ"
                    },
                    "&aelig;": {
                        codepoints: [230],
                        characters: "æ"
                    },
                    "&aelig": {
                        codepoints: [230],
                        characters: "æ"
                    },
                    "&af;": {
                        codepoints: [8289],
                        characters: "⁡"
                    },
                    "&Afr;": {
                        codepoints: [120068],
                        characters: "𝔄"
                    },
                    "&afr;": {
                        codepoints: [120094],
                        characters: "𝔞"
                    },
                    "&Agrave;": {
                        codepoints: [192],
                        characters: "À"
                    },
                    "&Agrave": {
                        codepoints: [192],
                        characters: "À"
                    },
                    "&agrave;": {
                        codepoints: [224],
                        characters: "à"
                    },
                    "&agrave": {
                        codepoints: [224],
                        characters: "à"
                    },
                    "&alefsym;": {
                        codepoints: [8501],
                        characters: "ℵ"
                    },
                    "&aleph;": {
                        codepoints: [8501],
                        characters: "ℵ"
                    },
                    "&Alpha;": {
                        codepoints: [913],
                        characters: "Α"
                    },
                    "&alpha;": {
                        codepoints: [945],
                        characters: "α"
                    },
                    "&Amacr;": {
                        codepoints: [256],
                        characters: "Ā"
                    },
                    "&amacr;": {
                        codepoints: [257],
                        characters: "ā"
                    },
                    "&amalg;": {
                        codepoints: [10815],
                        characters: "⨿"
                    },
                    "&amp;": {
                        codepoints: [38],
                        characters: "&"
                    },
                    "&amp": {
                        codepoints: [38],
                        characters: "&"
                    },
                    "&AMP;": {
                        codepoints: [38],
                        characters: "&"
                    },
                    "&AMP": {
                        codepoints: [38],
                        characters: "&"
                    },
                    "&andand;": {
                        codepoints: [10837],
                        characters: "⩕"
                    },
                    "&And;": {
                        codepoints: [10835],
                        characters: "⩓"
                    },
                    "&and;": {
                        codepoints: [8743],
                        characters: "∧"
                    },
                    "&andd;": {
                        codepoints: [10844],
                        characters: "⩜"
                    },
                    "&andslope;": {
                        codepoints: [10840],
                        characters: "⩘"
                    },
                    "&andv;": {
                        codepoints: [10842],
                        characters: "⩚"
                    },
                    "&ang;": {
                        codepoints: [8736],
                        characters: "∠"
                    },
                    "&ange;": {
                        codepoints: [10660],
                        characters: "⦤"
                    },
                    "&angle;": {
                        codepoints: [8736],
                        characters: "∠"
                    },
                    "&angmsdaa;": {
                        codepoints: [10664],
                        characters: "⦨"
                    },
                    "&angmsdab;": {
                        codepoints: [10665],
                        characters: "⦩"
                    },
                    "&angmsdac;": {
                        codepoints: [10666],
                        characters: "⦪"
                    },
                    "&angmsdad;": {
                        codepoints: [10667],
                        characters: "⦫"
                    },
                    "&angmsdae;": {
                        codepoints: [10668],
                        characters: "⦬"
                    },
                    "&angmsdaf;": {
                        codepoints: [10669],
                        characters: "⦭"
                    },
                    "&angmsdag;": {
                        codepoints: [10670],
                        characters: "⦮"
                    },
                    "&angmsdah;": {
                        codepoints: [10671],
                        characters: "⦯"
                    },
                    "&angmsd;": {
                        codepoints: [8737],
                        characters: "∡"
                    },
                    "&angrt;": {
                        codepoints: [8735],
                        characters: "∟"
                    },
                    "&angrtvb;": {
                        codepoints: [8894],
                        characters: "⊾"
                    },
                    "&angrtvbd;": {
                        codepoints: [10653],
                        characters: "⦝"
                    },
                    "&angsph;": {
                        codepoints: [8738],
                        characters: "∢"
                    },
                    "&angst;": {
                        codepoints: [197],
                        characters: "Å"
                    },
                    "&angzarr;": {
                        codepoints: [9084],
                        characters: "⍼"
                    },
                    "&Aogon;": {
                        codepoints: [260],
                        characters: "Ą"
                    },
                    "&aogon;": {
                        codepoints: [261],
                        characters: "ą"
                    },
                    "&Aopf;": {
                        codepoints: [120120],
                        characters: "𝔸"
                    },
                    "&aopf;": {
                        codepoints: [120146],
                        characters: "𝕒"
                    },
                    "&apacir;": {
                        codepoints: [10863],
                        characters: "⩯"
                    },
                    "&ap;": {
                        codepoints: [8776],
                        characters: "≈"
                    },
                    "&apE;": {
                        codepoints: [10864],
                        characters: "⩰"
                    },
                    "&ape;": {
                        codepoints: [8778],
                        characters: "≊"
                    },
                    "&apid;": {
                        codepoints: [8779],
                        characters: "≋"
                    },
                    "&apos;": {
                        codepoints: [39],
                        characters: "'"
                    },
                    "&ApplyFunction;": {
                        codepoints: [8289],
                        characters: "⁡"
                    },
                    "&approx;": {
                        codepoints: [8776],
                        characters: "≈"
                    },
                    "&approxeq;": {
                        codepoints: [8778],
                        characters: "≊"
                    },
                    "&Aring;": {
                        codepoints: [197],
                        characters: "Å"
                    },
                    "&Aring": {
                        codepoints: [197],
                        characters: "Å"
                    },
                    "&aring;": {
                        codepoints: [229],
                        characters: "å"
                    },
                    "&aring": {
                        codepoints: [229],
                        characters: "å"
                    },
                    "&Ascr;": {
                        codepoints: [119964],
                        characters: "𝒜"
                    },
                    "&ascr;": {
                        codepoints: [119990],
                        characters: "𝒶"
                    },
                    "&Assign;": {
                        codepoints: [8788],
                        characters: "≔"
                    },
                    "&ast;": {
                        codepoints: [42],
                        characters: "*"
                    },
                    "&asymp;": {
                        codepoints: [8776],
                        characters: "≈"
                    },
                    "&asympeq;": {
                        codepoints: [8781],
                        characters: "≍"
                    },
                    "&Atilde;": {
                        codepoints: [195],
                        characters: "Ã"
                    },
                    "&Atilde": {
                        codepoints: [195],
                        characters: "Ã"
                    },
                    "&atilde;": {
                        codepoints: [227],
                        characters: "ã"
                    },
                    "&atilde": {
                        codepoints: [227],
                        characters: "ã"
                    },
                    "&Auml;": {
                        codepoints: [196],
                        characters: "Ä"
                    },
                    "&Auml": {
                        codepoints: [196],
                        characters: "Ä"
                    },
                    "&auml;": {
                        codepoints: [228],
                        characters: "ä"
                    },
                    "&auml": {
                        codepoints: [228],
                        characters: "ä"
                    },
                    "&awconint;": {
                        codepoints: [8755],
                        characters: "∳"
                    },
                    "&awint;": {
                        codepoints: [10769],
                        characters: "⨑"
                    },
                    "&backcong;": {
                        codepoints: [8780],
                        characters: "≌"
                    },
                    "&backepsilon;": {
                        codepoints: [1014],
                        characters: "϶"
                    },
                    "&backprime;": {
                        codepoints: [8245],
                        characters: "‵"
                    },
                    "&backsim;": {
                        codepoints: [8765],
                        characters: "∽"
                    },
                    "&backsimeq;": {
                        codepoints: [8909],
                        characters: "⋍"
                    },
                    "&Backslash;": {
                        codepoints: [8726],
                        characters: "∖"
                    },
                    "&Barv;": {
                        codepoints: [10983],
                        characters: "⫧"
                    },
                    "&barvee;": {
                        codepoints: [8893],
                        characters: "⊽"
                    },
                    "&barwed;": {
                        codepoints: [8965],
                        characters: "⌅"
                    },
                    "&Barwed;": {
                        codepoints: [8966],
                        characters: "⌆"
                    },
                    "&barwedge;": {
                        codepoints: [8965],
                        characters: "⌅"
                    },
                    "&bbrk;": {
                        codepoints: [9141],
                        characters: "⎵"
                    },
                    "&bbrktbrk;": {
                        codepoints: [9142],
                        characters: "⎶"
                    },
                    "&bcong;": {
                        codepoints: [8780],
                        characters: "≌"
                    },
                    "&Bcy;": {
                        codepoints: [1041],
                        characters: "Б"
                    },
                    "&bcy;": {
                        codepoints: [1073],
                        characters: "б"
                    },
                    "&bdquo;": {
                        codepoints: [8222],
                        characters: "„"
                    },
                    "&becaus;": {
                        codepoints: [8757],
                        characters: "∵"
                    },
                    "&because;": {
                        codepoints: [8757],
                        characters: "∵"
                    },
                    "&Because;": {
                        codepoints: [8757],
                        characters: "∵"
                    },
                    "&bemptyv;": {
                        codepoints: [10672],
                        characters: "⦰"
                    },
                    "&bepsi;": {
                        codepoints: [1014],
                        characters: "϶"
                    },
                    "&bernou;": {
                        codepoints: [8492],
                        characters: "ℬ"
                    },
                    "&Bernoullis;": {
                        codepoints: [8492],
                        characters: "ℬ"
                    },
                    "&Beta;": {
                        codepoints: [914],
                        characters: "Β"
                    },
                    "&beta;": {
                        codepoints: [946],
                        characters: "β"
                    },
                    "&beth;": {
                        codepoints: [8502],
                        characters: "ℶ"
                    },
                    "&between;": {
                        codepoints: [8812],
                        characters: "≬"
                    },
                    "&Bfr;": {
                        codepoints: [120069],
                        characters: "𝔅"
                    },
                    "&bfr;": {
                        codepoints: [120095],
                        characters: "𝔟"
                    },
                    "&bigcap;": {
                        codepoints: [8898],
                        characters: "⋂"
                    },
                    "&bigcirc;": {
                        codepoints: [9711],
                        characters: "◯"
                    },
                    "&bigcup;": {
                        codepoints: [8899],
                        characters: "⋃"
                    },
                    "&bigodot;": {
                        codepoints: [10752],
                        characters: "⨀"
                    },
                    "&bigoplus;": {
                        codepoints: [10753],
                        characters: "⨁"
                    },
                    "&bigotimes;": {
                        codepoints: [10754],
                        characters: "⨂"
                    },
                    "&bigsqcup;": {
                        codepoints: [10758],
                        characters: "⨆"
                    },
                    "&bigstar;": {
                        codepoints: [9733],
                        characters: "★"
                    },
                    "&bigtriangledown;": {
                        codepoints: [9661],
                        characters: "▽"
                    },
                    "&bigtriangleup;": {
                        codepoints: [9651],
                        characters: "△"
                    },
                    "&biguplus;": {
                        codepoints: [10756],
                        characters: "⨄"
                    },
                    "&bigvee;": {
                        codepoints: [8897],
                        characters: "⋁"
                    },
                    "&bigwedge;": {
                        codepoints: [8896],
                        characters: "⋀"
                    },
                    "&bkarow;": {
                        codepoints: [10509],
                        characters: "⤍"
                    },
                    "&blacklozenge;": {
                        codepoints: [10731],
                        characters: "⧫"
                    },
                    "&blacksquare;": {
                        codepoints: [9642],
                        characters: "▪"
                    },
                    "&blacktriangle;": {
                        codepoints: [9652],
                        characters: "▴"
                    },
                    "&blacktriangledown;": {
                        codepoints: [9662],
                        characters: "▾"
                    },
                    "&blacktriangleleft;": {
                        codepoints: [9666],
                        characters: "◂"
                    },
                    "&blacktriangleright;": {
                        codepoints: [9656],
                        characters: "▸"
                    },
                    "&blank;": {
                        codepoints: [9251],
                        characters: "␣"
                    },
                    "&blk12;": {
                        codepoints: [9618],
                        characters: "▒"
                    },
                    "&blk14;": {
                        codepoints: [9617],
                        characters: "░"
                    },
                    "&blk34;": {
                        codepoints: [9619],
                        characters: "▓"
                    },
                    "&block;": {
                        codepoints: [9608],
                        characters: "█"
                    },
                    "&bne;": {
                        codepoints: [61, 8421],
                        characters: "=⃥"
                    },
                    "&bnequiv;": {
                        codepoints: [8801, 8421],
                        characters: "≡⃥"
                    },
                    "&bNot;": {
                        codepoints: [10989],
                        characters: "⫭"
                    },
                    "&bnot;": {
                        codepoints: [8976],
                        characters: "⌐"
                    },
                    "&Bopf;": {
                        codepoints: [120121],
                        characters: "𝔹"
                    },
                    "&bopf;": {
                        codepoints: [120147],
                        characters: "𝕓"
                    },
                    "&bot;": {
                        codepoints: [8869],
                        characters: "⊥"
                    },
                    "&bottom;": {
                        codepoints: [8869],
                        characters: "⊥"
                    },
                    "&bowtie;": {
                        codepoints: [8904],
                        characters: "⋈"
                    },
                    "&boxbox;": {
                        codepoints: [10697],
                        characters: "⧉"
                    },
                    "&boxdl;": {
                        codepoints: [9488],
                        characters: "┐"
                    },
                    "&boxdL;": {
                        codepoints: [9557],
                        characters: "╕"
                    },
                    "&boxDl;": {
                        codepoints: [9558],
                        characters: "╖"
                    },
                    "&boxDL;": {
                        codepoints: [9559],
                        characters: "╗"
                    },
                    "&boxdr;": {
                        codepoints: [9484],
                        characters: "┌"
                    },
                    "&boxdR;": {
                        codepoints: [9554],
                        characters: "╒"
                    },
                    "&boxDr;": {
                        codepoints: [9555],
                        characters: "╓"
                    },
                    "&boxDR;": {
                        codepoints: [9556],
                        characters: "╔"
                    },
                    "&boxh;": {
                        codepoints: [9472],
                        characters: "─"
                    },
                    "&boxH;": {
                        codepoints: [9552],
                        characters: "═"
                    },
                    "&boxhd;": {
                        codepoints: [9516],
                        characters: "┬"
                    },
                    "&boxHd;": {
                        codepoints: [9572],
                        characters: "╤"
                    },
                    "&boxhD;": {
                        codepoints: [9573],
                        characters: "╥"
                    },
                    "&boxHD;": {
                        codepoints: [9574],
                        characters: "╦"
                    },
                    "&boxhu;": {
                        codepoints: [9524],
                        characters: "┴"
                    },
                    "&boxHu;": {
                        codepoints: [9575],
                        characters: "╧"
                    },
                    "&boxhU;": {
                        codepoints: [9576],
                        characters: "╨"
                    },
                    "&boxHU;": {
                        codepoints: [9577],
                        characters: "╩"
                    },
                    "&boxminus;": {
                        codepoints: [8863],
                        characters: "⊟"
                    },
                    "&boxplus;": {
                        codepoints: [8862],
                        characters: "⊞"
                    },
                    "&boxtimes;": {
                        codepoints: [8864],
                        characters: "⊠"
                    },
                    "&boxul;": {
                        codepoints: [9496],
                        characters: "┘"
                    },
                    "&boxuL;": {
                        codepoints: [9563],
                        characters: "╛"
                    },
                    "&boxUl;": {
                        codepoints: [9564],
                        characters: "╜"
                    },
                    "&boxUL;": {
                        codepoints: [9565],
                        characters: "╝"
                    },
                    "&boxur;": {
                        codepoints: [9492],
                        characters: "└"
                    },
                    "&boxuR;": {
                        codepoints: [9560],
                        characters: "╘"
                    },
                    "&boxUr;": {
                        codepoints: [9561],
                        characters: "╙"
                    },
                    "&boxUR;": {
                        codepoints: [9562],
                        characters: "╚"
                    },
                    "&boxv;": {
                        codepoints: [9474],
                        characters: "│"
                    },
                    "&boxV;": {
                        codepoints: [9553],
                        characters: "║"
                    },
                    "&boxvh;": {
                        codepoints: [9532],
                        characters: "┼"
                    },
                    "&boxvH;": {
                        codepoints: [9578],
                        characters: "╪"
                    },
                    "&boxVh;": {
                        codepoints: [9579],
                        characters: "╫"
                    },
                    "&boxVH;": {
                        codepoints: [9580],
                        characters: "╬"
                    },
                    "&boxvl;": {
                        codepoints: [9508],
                        characters: "┤"
                    },
                    "&boxvL;": {
                        codepoints: [9569],
                        characters: "╡"
                    },
                    "&boxVl;": {
                        codepoints: [9570],
                        characters: "╢"
                    },
                    "&boxVL;": {
                        codepoints: [9571],
                        characters: "╣"
                    },
                    "&boxvr;": {
                        codepoints: [9500],
                        characters: "├"
                    },
                    "&boxvR;": {
                        codepoints: [9566],
                        characters: "╞"
                    },
                    "&boxVr;": {
                        codepoints: [9567],
                        characters: "╟"
                    },
                    "&boxVR;": {
                        codepoints: [9568],
                        characters: "╠"
                    },
                    "&bprime;": {
                        codepoints: [8245],
                        characters: "‵"
                    },
                    "&breve;": {
                        codepoints: [728],
                        characters: "˘"
                    },
                    "&Breve;": {
                        codepoints: [728],
                        characters: "˘"
                    },
                    "&brvbar;": {
                        codepoints: [166],
                        characters: "¦"
                    },
                    "&brvbar": {
                        codepoints: [166],
                        characters: "¦"
                    },
                    "&bscr;": {
                        codepoints: [119991],
                        characters: "𝒷"
                    },
                    "&Bscr;": {
                        codepoints: [8492],
                        characters: "ℬ"
                    },
                    "&bsemi;": {
                        codepoints: [8271],
                        characters: "⁏"
                    },
                    "&bsim;": {
                        codepoints: [8765],
                        characters: "∽"
                    },
                    "&bsime;": {
                        codepoints: [8909],
                        characters: "⋍"
                    },
                    "&bsolb;": {
                        codepoints: [10693],
                        characters: "⧅"
                    },
                    "&bsol;": {
                        codepoints: [92],
                        characters: "\\"
                    },
                    "&bsolhsub;": {
                        codepoints: [10184],
                        characters: "⟈"
                    },
                    "&bull;": {
                        codepoints: [8226],
                        characters: "•"
                    },
                    "&bullet;": {
                        codepoints: [8226],
                        characters: "•"
                    },
                    "&bump;": {
                        codepoints: [8782],
                        characters: "≎"
                    },
                    "&bumpE;": {
                        codepoints: [10926],
                        characters: "⪮"
                    },
                    "&bumpe;": {
                        codepoints: [8783],
                        characters: "≏"
                    },
                    "&Bumpeq;": {
                        codepoints: [8782],
                        characters: "≎"
                    },
                    "&bumpeq;": {
                        codepoints: [8783],
                        characters: "≏"
                    },
                    "&Cacute;": {
                        codepoints: [262],
                        characters: "Ć"
                    },
                    "&cacute;": {
                        codepoints: [263],
                        characters: "ć"
                    },
                    "&capand;": {
                        codepoints: [10820],
                        characters: "⩄"
                    },
                    "&capbrcup;": {
                        codepoints: [10825],
                        characters: "⩉"
                    },
                    "&capcap;": {
                        codepoints: [10827],
                        characters: "⩋"
                    },
                    "&cap;": {
                        codepoints: [8745],
                        characters: "∩"
                    },
                    "&Cap;": {
                        codepoints: [8914],
                        characters: "⋒"
                    },
                    "&capcup;": {
                        codepoints: [10823],
                        characters: "⩇"
                    },
                    "&capdot;": {
                        codepoints: [10816],
                        characters: "⩀"
                    },
                    "&CapitalDifferentialD;": {
                        codepoints: [8517],
                        characters: "ⅅ"
                    },
                    "&caps;": {
                        codepoints: [8745, 65024],
                        characters: "∩︀"
                    },
                    "&caret;": {
                        codepoints: [8257],
                        characters: "⁁"
                    },
                    "&caron;": {
                        codepoints: [711],
                        characters: "ˇ"
                    },
                    "&Cayleys;": {
                        codepoints: [8493],
                        characters: "ℭ"
                    },
                    "&ccaps;": {
                        codepoints: [10829],
                        characters: "⩍"
                    },
                    "&Ccaron;": {
                        codepoints: [268],
                        characters: "Č"
                    },
                    "&ccaron;": {
                        codepoints: [269],
                        characters: "č"
                    },
                    "&Ccedil;": {
                        codepoints: [199],
                        characters: "Ç"
                    },
                    "&Ccedil": {
                        codepoints: [199],
                        characters: "Ç"
                    },
                    "&ccedil;": {
                        codepoints: [231],
                        characters: "ç"
                    },
                    "&ccedil": {
                        codepoints: [231],
                        characters: "ç"
                    },
                    "&Ccirc;": {
                        codepoints: [264],
                        characters: "Ĉ"
                    },
                    "&ccirc;": {
                        codepoints: [265],
                        characters: "ĉ"
                    },
                    "&Cconint;": {
                        codepoints: [8752],
                        characters: "∰"
                    },
                    "&ccups;": {
                        codepoints: [10828],
                        characters: "⩌"
                    },
                    "&ccupssm;": {
                        codepoints: [10832],
                        characters: "⩐"
                    },
                    "&Cdot;": {
                        codepoints: [266],
                        characters: "Ċ"
                    },
                    "&cdot;": {
                        codepoints: [267],
                        characters: "ċ"
                    },
                    "&cedil;": {
                        codepoints: [184],
                        characters: "¸"
                    },
                    "&cedil": {
                        codepoints: [184],
                        characters: "¸"
                    },
                    "&Cedilla;": {
                        codepoints: [184],
                        characters: "¸"
                    },
                    "&cemptyv;": {
                        codepoints: [10674],
                        characters: "⦲"
                    },
                    "&cent;": {
                        codepoints: [162],
                        characters: "¢"
                    },
                    "&cent": {
                        codepoints: [162],
                        characters: "¢"
                    },
                    "&centerdot;": {
                        codepoints: [183],
                        characters: "·"
                    },
                    "&CenterDot;": {
                        codepoints: [183],
                        characters: "·"
                    },
                    "&cfr;": {
                        codepoints: [120096],
                        characters: "𝔠"
                    },
                    "&Cfr;": {
                        codepoints: [8493],
                        characters: "ℭ"
                    },
                    "&CHcy;": {
                        codepoints: [1063],
                        characters: "Ч"
                    },
                    "&chcy;": {
                        codepoints: [1095],
                        characters: "ч"
                    },
                    "&check;": {
                        codepoints: [10003],
                        characters: "✓"
                    },
                    "&checkmark;": {
                        codepoints: [10003],
                        characters: "✓"
                    },
                    "&Chi;": {
                        codepoints: [935],
                        characters: "Χ"
                    },
                    "&chi;": {
                        codepoints: [967],
                        characters: "χ"
                    },
                    "&circ;": {
                        codepoints: [710],
                        characters: "ˆ"
                    },
                    "&circeq;": {
                        codepoints: [8791],
                        characters: "≗"
                    },
                    "&circlearrowleft;": {
                        codepoints: [8634],
                        characters: "↺"
                    },
                    "&circlearrowright;": {
                        codepoints: [8635],
                        characters: "↻"
                    },
                    "&circledast;": {
                        codepoints: [8859],
                        characters: "⊛"
                    },
                    "&circledcirc;": {
                        codepoints: [8858],
                        characters: "⊚"
                    },
                    "&circleddash;": {
                        codepoints: [8861],
                        characters: "⊝"
                    },
                    "&CircleDot;": {
                        codepoints: [8857],
                        characters: "⊙"
                    },
                    "&circledR;": {
                        codepoints: [174],
                        characters: "®"
                    },
                    "&circledS;": {
                        codepoints: [9416],
                        characters: "Ⓢ"
                    },
                    "&CircleMinus;": {
                        codepoints: [8854],
                        characters: "⊖"
                    },
                    "&CirclePlus;": {
                        codepoints: [8853],
                        characters: "⊕"
                    },
                    "&CircleTimes;": {
                        codepoints: [8855],
                        characters: "⊗"
                    },
                    "&cir;": {
                        codepoints: [9675],
                        characters: "○"
                    },
                    "&cirE;": {
                        codepoints: [10691],
                        characters: "⧃"
                    },
                    "&cire;": {
                        codepoints: [8791],
                        characters: "≗"
                    },
                    "&cirfnint;": {
                        codepoints: [10768],
                        characters: "⨐"
                    },
                    "&cirmid;": {
                        codepoints: [10991],
                        characters: "⫯"
                    },
                    "&cirscir;": {
                        codepoints: [10690],
                        characters: "⧂"
                    },
                    "&ClockwiseContourIntegral;": {
                        codepoints: [8754],
                        characters: "∲"
                    },
                    "&CloseCurlyDoubleQuote;": {
                        codepoints: [8221],
                        characters: "”"
                    },
                    "&CloseCurlyQuote;": {
                        codepoints: [8217],
                        characters: "’"
                    },
                    "&clubs;": {
                        codepoints: [9827],
                        characters: "♣"
                    },
                    "&clubsuit;": {
                        codepoints: [9827],
                        characters: "♣"
                    },
                    "&colon;": {
                        codepoints: [58],
                        characters: ":"
                    },
                    "&Colon;": {
                        codepoints: [8759],
                        characters: "∷"
                    },
                    "&Colone;": {
                        codepoints: [10868],
                        characters: "⩴"
                    },
                    "&colone;": {
                        codepoints: [8788],
                        characters: "≔"
                    },
                    "&coloneq;": {
                        codepoints: [8788],
                        characters: "≔"
                    },
                    "&comma;": {
                        codepoints: [44],
                        characters: ","
                    },
                    "&commat;": {
                        codepoints: [64],
                        characters: "@"
                    },
                    "&comp;": {
                        codepoints: [8705],
                        characters: "∁"
                    },
                    "&compfn;": {
                        codepoints: [8728],
                        characters: "∘"
                    },
                    "&complement;": {
                        codepoints: [8705],
                        characters: "∁"
                    },
                    "&complexes;": {
                        codepoints: [8450],
                        characters: "ℂ"
                    },
                    "&cong;": {
                        codepoints: [8773],
                        characters: "≅"
                    },
                    "&congdot;": {
                        codepoints: [10861],
                        characters: "⩭"
                    },
                    "&Congruent;": {
                        codepoints: [8801],
                        characters: "≡"
                    },
                    "&conint;": {
                        codepoints: [8750],
                        characters: "∮"
                    },
                    "&Conint;": {
                        codepoints: [8751],
                        characters: "∯"
                    },
                    "&ContourIntegral;": {
                        codepoints: [8750],
                        characters: "∮"
                    },
                    "&copf;": {
                        codepoints: [120148],
                        characters: "𝕔"
                    },
                    "&Copf;": {
                        codepoints: [8450],
                        characters: "ℂ"
                    },
                    "&coprod;": {
                        codepoints: [8720],
                        characters: "∐"
                    },
                    "&Coproduct;": {
                        codepoints: [8720],
                        characters: "∐"
                    },
                    "&copy;": {
                        codepoints: [169],
                        characters: "©"
                    },
                    "&copy": {
                        codepoints: [169],
                        characters: "©"
                    },
                    "&COPY;": {
                        codepoints: [169],
                        characters: "©"
                    },
                    "&COPY": {
                        codepoints: [169],
                        characters: "©"
                    },
                    "&copysr;": {
                        codepoints: [8471],
                        characters: "℗"
                    },
                    "&CounterClockwiseContourIntegral;": {
                        codepoints: [8755],
                        characters: "∳"
                    },
                    "&crarr;": {
                        codepoints: [8629],
                        characters: "↵"
                    },
                    "&cross;": {
                        codepoints: [10007],
                        characters: "✗"
                    },
                    "&Cross;": {
                        codepoints: [10799],
                        characters: "⨯"
                    },
                    "&Cscr;": {
                        codepoints: [119966],
                        characters: "𝒞"
                    },
                    "&cscr;": {
                        codepoints: [119992],
                        characters: "𝒸"
                    },
                    "&csub;": {
                        codepoints: [10959],
                        characters: "⫏"
                    },
                    "&csube;": {
                        codepoints: [10961],
                        characters: "⫑"
                    },
                    "&csup;": {
                        codepoints: [10960],
                        characters: "⫐"
                    },
                    "&csupe;": {
                        codepoints: [10962],
                        characters: "⫒"
                    },
                    "&ctdot;": {
                        codepoints: [8943],
                        characters: "⋯"
                    },
                    "&cudarrl;": {
                        codepoints: [10552],
                        characters: "⤸"
                    },
                    "&cudarrr;": {
                        codepoints: [10549],
                        characters: "⤵"
                    },
                    "&cuepr;": {
                        codepoints: [8926],
                        characters: "⋞"
                    },
                    "&cuesc;": {
                        codepoints: [8927],
                        characters: "⋟"
                    },
                    "&cularr;": {
                        codepoints: [8630],
                        characters: "↶"
                    },
                    "&cularrp;": {
                        codepoints: [10557],
                        characters: "⤽"
                    },
                    "&cupbrcap;": {
                        codepoints: [10824],
                        characters: "⩈"
                    },
                    "&cupcap;": {
                        codepoints: [10822],
                        characters: "⩆"
                    },
                    "&CupCap;": {
                        codepoints: [8781],
                        characters: "≍"
                    },
                    "&cup;": {
                        codepoints: [8746],
                        characters: "∪"
                    },
                    "&Cup;": {
                        codepoints: [8915],
                        characters: "⋓"
                    },
                    "&cupcup;": {
                        codepoints: [10826],
                        characters: "⩊"
                    },
                    "&cupdot;": {
                        codepoints: [8845],
                        characters: "⊍"
                    },
                    "&cupor;": {
                        codepoints: [10821],
                        characters: "⩅"
                    },
                    "&cups;": {
                        codepoints: [8746, 65024],
                        characters: "∪︀"
                    },
                    "&curarr;": {
                        codepoints: [8631],
                        characters: "↷"
                    },
                    "&curarrm;": {
                        codepoints: [10556],
                        characters: "⤼"
                    },
                    "&curlyeqprec;": {
                        codepoints: [8926],
                        characters: "⋞"
                    },
                    "&curlyeqsucc;": {
                        codepoints: [8927],
                        characters: "⋟"
                    },
                    "&curlyvee;": {
                        codepoints: [8910],
                        characters: "⋎"
                    },
                    "&curlywedge;": {
                        codepoints: [8911],
                        characters: "⋏"
                    },
                    "&curren;": {
                        codepoints: [164],
                        characters: "¤"
                    },
                    "&curren": {
                        codepoints: [164],
                        characters: "¤"
                    },
                    "&curvearrowleft;": {
                        codepoints: [8630],
                        characters: "↶"
                    },
                    "&curvearrowright;": {
                        codepoints: [8631],
                        characters: "↷"
                    },
                    "&cuvee;": {
                        codepoints: [8910],
                        characters: "⋎"
                    },
                    "&cuwed;": {
                        codepoints: [8911],
                        characters: "⋏"
                    },
                    "&cwconint;": {
                        codepoints: [8754],
                        characters: "∲"
                    },
                    "&cwint;": {
                        codepoints: [8753],
                        characters: "∱"
                    },
                    "&cylcty;": {
                        codepoints: [9005],
                        characters: "⌭"
                    },
                    "&dagger;": {
                        codepoints: [8224],
                        characters: "†"
                    },
                    "&Dagger;": {
                        codepoints: [8225],
                        characters: "‡"
                    },
                    "&daleth;": {
                        codepoints: [8504],
                        characters: "ℸ"
                    },
                    "&darr;": {
                        codepoints: [8595],
                        characters: "↓"
                    },
                    "&Darr;": {
                        codepoints: [8609],
                        characters: "↡"
                    },
                    "&dArr;": {
                        codepoints: [8659],
                        characters: "⇓"
                    },
                    "&dash;": {
                        codepoints: [8208],
                        characters: "‐"
                    },
                    "&Dashv;": {
                        codepoints: [10980],
                        characters: "⫤"
                    },
                    "&dashv;": {
                        codepoints: [8867],
                        characters: "⊣"
                    },
                    "&dbkarow;": {
                        codepoints: [10511],
                        characters: "⤏"
                    },
                    "&dblac;": {
                        codepoints: [733],
                        characters: "˝"
                    },
                    "&Dcaron;": {
                        codepoints: [270],
                        characters: "Ď"
                    },
                    "&dcaron;": {
                        codepoints: [271],
                        characters: "ď"
                    },
                    "&Dcy;": {
                        codepoints: [1044],
                        characters: "Д"
                    },
                    "&dcy;": {
                        codepoints: [1076],
                        characters: "д"
                    },
                    "&ddagger;": {
                        codepoints: [8225],
                        characters: "‡"
                    },
                    "&ddarr;": {
                        codepoints: [8650],
                        characters: "⇊"
                    },
                    "&DD;": {
                        codepoints: [8517],
                        characters: "ⅅ"
                    },
                    "&dd;": {
                        codepoints: [8518],
                        characters: "ⅆ"
                    },
                    "&DDotrahd;": {
                        codepoints: [10513],
                        characters: "⤑"
                    },
                    "&ddotseq;": {
                        codepoints: [10871],
                        characters: "⩷"
                    },
                    "&deg;": {
                        codepoints: [176],
                        characters: "°"
                    },
                    "&deg": {
                        codepoints: [176],
                        characters: "°"
                    },
                    "&Del;": {
                        codepoints: [8711],
                        characters: "∇"
                    },
                    "&Delta;": {
                        codepoints: [916],
                        characters: "Δ"
                    },
                    "&delta;": {
                        codepoints: [948],
                        characters: "δ"
                    },
                    "&demptyv;": {
                        codepoints: [10673],
                        characters: "⦱"
                    },
                    "&dfisht;": {
                        codepoints: [10623],
                        characters: "⥿"
                    },
                    "&Dfr;": {
                        codepoints: [120071],
                        characters: "𝔇"
                    },
                    "&dfr;": {
                        codepoints: [120097],
                        characters: "𝔡"
                    },
                    "&dHar;": {
                        codepoints: [10597],
                        characters: "⥥"
                    },
                    "&dharl;": {
                        codepoints: [8643],
                        characters: "⇃"
                    },
                    "&dharr;": {
                        codepoints: [8642],
                        characters: "⇂"
                    },
                    "&DiacriticalAcute;": {
                        codepoints: [180],
                        characters: "´"
                    },
                    "&DiacriticalDot;": {
                        codepoints: [729],
                        characters: "˙"
                    },
                    "&DiacriticalDoubleAcute;": {
                        codepoints: [733],
                        characters: "˝"
                    },
                    "&DiacriticalGrave;": {
                        codepoints: [96],
                        characters: "`"
                    },
                    "&DiacriticalTilde;": {
                        codepoints: [732],
                        characters: "˜"
                    },
                    "&diam;": {
                        codepoints: [8900],
                        characters: "⋄"
                    },
                    "&diamond;": {
                        codepoints: [8900],
                        characters: "⋄"
                    },
                    "&Diamond;": {
                        codepoints: [8900],
                        characters: "⋄"
                    },
                    "&diamondsuit;": {
                        codepoints: [9830],
                        characters: "♦"
                    },
                    "&diams;": {
                        codepoints: [9830],
                        characters: "♦"
                    },
                    "&die;": {
                        codepoints: [168],
                        characters: "¨"
                    },
                    "&DifferentialD;": {
                        codepoints: [8518],
                        characters: "ⅆ"
                    },
                    "&digamma;": {
                        codepoints: [989],
                        characters: "ϝ"
                    },
                    "&disin;": {
                        codepoints: [8946],
                        characters: "⋲"
                    },
                    "&div;": {
                        codepoints: [247],
                        characters: "÷"
                    },
                    "&divide;": {
                        codepoints: [247],
                        characters: "÷"
                    },
                    "&divide": {
                        codepoints: [247],
                        characters: "÷"
                    },
                    "&divideontimes;": {
                        codepoints: [8903],
                        characters: "⋇"
                    },
                    "&divonx;": {
                        codepoints: [8903],
                        characters: "⋇"
                    },
                    "&DJcy;": {
                        codepoints: [1026],
                        characters: "Ђ"
                    },
                    "&djcy;": {
                        codepoints: [1106],
                        characters: "ђ"
                    },
                    "&dlcorn;": {
                        codepoints: [8990],
                        characters: "⌞"
                    },
                    "&dlcrop;": {
                        codepoints: [8973],
                        characters: "⌍"
                    },
                    "&dollar;": {
                        codepoints: [36],
                        characters: "$"
                    },
                    "&Dopf;": {
                        codepoints: [120123],
                        characters: "𝔻"
                    },
                    "&dopf;": {
                        codepoints: [120149],
                        characters: "𝕕"
                    },
                    "&Dot;": {
                        codepoints: [168],
                        characters: "¨"
                    },
                    "&dot;": {
                        codepoints: [729],
                        characters: "˙"
                    },
                    "&DotDot;": {
                        codepoints: [8412],
                        characters: "⃜"
                    },
                    "&doteq;": {
                        codepoints: [8784],
                        characters: "≐"
                    },
                    "&doteqdot;": {
                        codepoints: [8785],
                        characters: "≑"
                    },
                    "&DotEqual;": {
                        codepoints: [8784],
                        characters: "≐"
                    },
                    "&dotminus;": {
                        codepoints: [8760],
                        characters: "∸"
                    },
                    "&dotplus;": {
                        codepoints: [8724],
                        characters: "∔"
                    },
                    "&dotsquare;": {
                        codepoints: [8865],
                        characters: "⊡"
                    },
                    "&doublebarwedge;": {
                        codepoints: [8966],
                        characters: "⌆"
                    },
                    "&DoubleContourIntegral;": {
                        codepoints: [8751],
                        characters: "∯"
                    },
                    "&DoubleDot;": {
                        codepoints: [168],
                        characters: "¨"
                    },
                    "&DoubleDownArrow;": {
                        codepoints: [8659],
                        characters: "⇓"
                    },
                    "&DoubleLeftArrow;": {
                        codepoints: [8656],
                        characters: "⇐"
                    },
                    "&DoubleLeftRightArrow;": {
                        codepoints: [8660],
                        characters: "⇔"
                    },
                    "&DoubleLeftTee;": {
                        codepoints: [10980],
                        characters: "⫤"
                    },
                    "&DoubleLongLeftArrow;": {
                        codepoints: [10232],
                        characters: "⟸"
                    },
                    "&DoubleLongLeftRightArrow;": {
                        codepoints: [10234],
                        characters: "⟺"
                    },
                    "&DoubleLongRightArrow;": {
                        codepoints: [10233],
                        characters: "⟹"
                    },
                    "&DoubleRightArrow;": {
                        codepoints: [8658],
                        characters: "⇒"
                    },
                    "&DoubleRightTee;": {
                        codepoints: [8872],
                        characters: "⊨"
                    },
                    "&DoubleUpArrow;": {
                        codepoints: [8657],
                        characters: "⇑"
                    },
                    "&DoubleUpDownArrow;": {
                        codepoints: [8661],
                        characters: "⇕"
                    },
                    "&DoubleVerticalBar;": {
                        codepoints: [8741],
                        characters: "∥"
                    },
                    "&DownArrowBar;": {
                        codepoints: [10515],
                        characters: "⤓"
                    },
                    "&downarrow;": {
                        codepoints: [8595],
                        characters: "↓"
                    },
                    "&DownArrow;": {
                        codepoints: [8595],
                        characters: "↓"
                    },
                    "&Downarrow;": {
                        codepoints: [8659],
                        characters: "⇓"
                    },
                    "&DownArrowUpArrow;": {
                        codepoints: [8693],
                        characters: "⇵"
                    },
                    "&DownBreve;": {
                        codepoints: [785],
                        characters: "̑"
                    },
                    "&downdownarrows;": {
                        codepoints: [8650],
                        characters: "⇊"
                    },
                    "&downharpoonleft;": {
                        codepoints: [8643],
                        characters: "⇃"
                    },
                    "&downharpoonright;": {
                        codepoints: [8642],
                        characters: "⇂"
                    },
                    "&DownLeftRightVector;": {
                        codepoints: [10576],
                        characters: "⥐"
                    },
                    "&DownLeftTeeVector;": {
                        codepoints: [10590],
                        characters: "⥞"
                    },
                    "&DownLeftVectorBar;": {
                        codepoints: [10582],
                        characters: "⥖"
                    },
                    "&DownLeftVector;": {
                        codepoints: [8637],
                        characters: "↽"
                    },
                    "&DownRightTeeVector;": {
                        codepoints: [10591],
                        characters: "⥟"
                    },
                    "&DownRightVectorBar;": {
                        codepoints: [10583],
                        characters: "⥗"
                    },
                    "&DownRightVector;": {
                        codepoints: [8641],
                        characters: "⇁"
                    },
                    "&DownTeeArrow;": {
                        codepoints: [8615],
                        characters: "↧"
                    },
                    "&DownTee;": {
                        codepoints: [8868],
                        characters: "⊤"
                    },
                    "&drbkarow;": {
                        codepoints: [10512],
                        characters: "⤐"
                    },
                    "&drcorn;": {
                        codepoints: [8991],
                        characters: "⌟"
                    },
                    "&drcrop;": {
                        codepoints: [8972],
                        characters: "⌌"
                    },
                    "&Dscr;": {
                        codepoints: [119967],
                        characters: "𝒟"
                    },
                    "&dscr;": {
                        codepoints: [119993],
                        characters: "𝒹"
                    },
                    "&DScy;": {
                        codepoints: [1029],
                        characters: "Ѕ"
                    },
                    "&dscy;": {
                        codepoints: [1109],
                        characters: "ѕ"
                    },
                    "&dsol;": {
                        codepoints: [10742],
                        characters: "⧶"
                    },
                    "&Dstrok;": {
                        codepoints: [272],
                        characters: "Đ"
                    },
                    "&dstrok;": {
                        codepoints: [273],
                        characters: "đ"
                    },
                    "&dtdot;": {
                        codepoints: [8945],
                        characters: "⋱"
                    },
                    "&dtri;": {
                        codepoints: [9663],
                        characters: "▿"
                    },
                    "&dtrif;": {
                        codepoints: [9662],
                        characters: "▾"
                    },
                    "&duarr;": {
                        codepoints: [8693],
                        characters: "⇵"
                    },
                    "&duhar;": {
                        codepoints: [10607],
                        characters: "⥯"
                    },
                    "&dwangle;": {
                        codepoints: [10662],
                        characters: "⦦"
                    },
                    "&DZcy;": {
                        codepoints: [1039],
                        characters: "Џ"
                    },
                    "&dzcy;": {
                        codepoints: [1119],
                        characters: "џ"
                    },
                    "&dzigrarr;": {
                        codepoints: [10239],
                        characters: "⟿"
                    },
                    "&Eacute;": {
                        codepoints: [201],
                        characters: "É"
                    },
                    "&Eacute": {
                        codepoints: [201],
                        characters: "É"
                    },
                    "&eacute;": {
                        codepoints: [233],
                        characters: "é"
                    },
                    "&eacute": {
                        codepoints: [233],
                        characters: "é"
                    },
                    "&easter;": {
                        codepoints: [10862],
                        characters: "⩮"
                    },
                    "&Ecaron;": {
                        codepoints: [282],
                        characters: "Ě"
                    },
                    "&ecaron;": {
                        codepoints: [283],
                        characters: "ě"
                    },
                    "&Ecirc;": {
                        codepoints: [202],
                        characters: "Ê"
                    },
                    "&Ecirc": {
                        codepoints: [202],
                        characters: "Ê"
                    },
                    "&ecirc;": {
                        codepoints: [234],
                        characters: "ê"
                    },
                    "&ecirc": {
                        codepoints: [234],
                        characters: "ê"
                    },
                    "&ecir;": {
                        codepoints: [8790],
                        characters: "≖"
                    },
                    "&ecolon;": {
                        codepoints: [8789],
                        characters: "≕"
                    },
                    "&Ecy;": {
                        codepoints: [1069],
                        characters: "Э"
                    },
                    "&ecy;": {
                        codepoints: [1101],
                        characters: "э"
                    },
                    "&eDDot;": {
                        codepoints: [10871],
                        characters: "⩷"
                    },
                    "&Edot;": {
                        codepoints: [278],
                        characters: "Ė"
                    },
                    "&edot;": {
                        codepoints: [279],
                        characters: "ė"
                    },
                    "&eDot;": {
                        codepoints: [8785],
                        characters: "≑"
                    },
                    "&ee;": {
                        codepoints: [8519],
                        characters: "ⅇ"
                    },
                    "&efDot;": {
                        codepoints: [8786],
                        characters: "≒"
                    },
                    "&Efr;": {
                        codepoints: [120072],
                        characters: "𝔈"
                    },
                    "&efr;": {
                        codepoints: [120098],
                        characters: "𝔢"
                    },
                    "&eg;": {
                        codepoints: [10906],
                        characters: "⪚"
                    },
                    "&Egrave;": {
                        codepoints: [200],
                        characters: "È"
                    },
                    "&Egrave": {
                        codepoints: [200],
                        characters: "È"
                    },
                    "&egrave;": {
                        codepoints: [232],
                        characters: "è"
                    },
                    "&egrave": {
                        codepoints: [232],
                        characters: "è"
                    },
                    "&egs;": {
                        codepoints: [10902],
                        characters: "⪖"
                    },
                    "&egsdot;": {
                        codepoints: [10904],
                        characters: "⪘"
                    },
                    "&el;": {
                        codepoints: [10905],
                        characters: "⪙"
                    },
                    "&Element;": {
                        codepoints: [8712],
                        characters: "∈"
                    },
                    "&elinters;": {
                        codepoints: [9191],
                        characters: "⏧"
                    },
                    "&ell;": {
                        codepoints: [8467],
                        characters: "ℓ"
                    },
                    "&els;": {
                        codepoints: [10901],
                        characters: "⪕"
                    },
                    "&elsdot;": {
                        codepoints: [10903],
                        characters: "⪗"
                    },
                    "&Emacr;": {
                        codepoints: [274],
                        characters: "Ē"
                    },
                    "&emacr;": {
                        codepoints: [275],
                        characters: "ē"
                    },
                    "&empty;": {
                        codepoints: [8709],
                        characters: "∅"
                    },
                    "&emptyset;": {
                        codepoints: [8709],
                        characters: "∅"
                    },
                    "&EmptySmallSquare;": {
                        codepoints: [9723],
                        characters: "◻"
                    },
                    "&emptyv;": {
                        codepoints: [8709],
                        characters: "∅"
                    },
                    "&EmptyVerySmallSquare;": {
                        codepoints: [9643],
                        characters: "▫"
                    },
                    "&emsp13;": {
                        codepoints: [8196],
                        characters: " "
                    },
                    "&emsp14;": {
                        codepoints: [8197],
                        characters: " "
                    },
                    "&emsp;": {
                        codepoints: [8195],
                        characters: " "
                    },
                    "&ENG;": {
                        codepoints: [330],
                        characters: "Ŋ"
                    },
                    "&eng;": {
                        codepoints: [331],
                        characters: "ŋ"
                    },
                    "&ensp;": {
                        codepoints: [8194],
                        characters: " "
                    },
                    "&Eogon;": {
                        codepoints: [280],
                        characters: "Ę"
                    },
                    "&eogon;": {
                        codepoints: [281],
                        characters: "ę"
                    },
                    "&Eopf;": {
                        codepoints: [120124],
                        characters: "𝔼"
                    },
                    "&eopf;": {
                        codepoints: [120150],
                        characters: "𝕖"
                    },
                    "&epar;": {
                        codepoints: [8917],
                        characters: "⋕"
                    },
                    "&eparsl;": {
                        codepoints: [10723],
                        characters: "⧣"
                    },
                    "&eplus;": {
                        codepoints: [10865],
                        characters: "⩱"
                    },
                    "&epsi;": {
                        codepoints: [949],
                        characters: "ε"
                    },
                    "&Epsilon;": {
                        codepoints: [917],
                        characters: "Ε"
                    },
                    "&epsilon;": {
                        codepoints: [949],
                        characters: "ε"
                    },
                    "&epsiv;": {
                        codepoints: [1013],
                        characters: "ϵ"
                    },
                    "&eqcirc;": {
                        codepoints: [8790],
                        characters: "≖"
                    },
                    "&eqcolon;": {
                        codepoints: [8789],
                        characters: "≕"
                    },
                    "&eqsim;": {
                        codepoints: [8770],
                        characters: "≂"
                    },
                    "&eqslantgtr;": {
                        codepoints: [10902],
                        characters: "⪖"
                    },
                    "&eqslantless;": {
                        codepoints: [10901],
                        characters: "⪕"
                    },
                    "&Equal;": {
                        codepoints: [10869],
                        characters: "⩵"
                    },
                    "&equals;": {
                        codepoints: [61],
                        characters: "="
                    },
                    "&EqualTilde;": {
                        codepoints: [8770],
                        characters: "≂"
                    },
                    "&equest;": {
                        codepoints: [8799],
                        characters: "≟"
                    },
                    "&Equilibrium;": {
                        codepoints: [8652],
                        characters: "⇌"
                    },
                    "&equiv;": {
                        codepoints: [8801],
                        characters: "≡"
                    },
                    "&equivDD;": {
                        codepoints: [10872],
                        characters: "⩸"
                    },
                    "&eqvparsl;": {
                        codepoints: [10725],
                        characters: "⧥"
                    },
                    "&erarr;": {
                        codepoints: [10609],
                        characters: "⥱"
                    },
                    "&erDot;": {
                        codepoints: [8787],
                        characters: "≓"
                    },
                    "&escr;": {
                        codepoints: [8495],
                        characters: "ℯ"
                    },
                    "&Escr;": {
                        codepoints: [8496],
                        characters: "ℰ"
                    },
                    "&esdot;": {
                        codepoints: [8784],
                        characters: "≐"
                    },
                    "&Esim;": {
                        codepoints: [10867],
                        characters: "⩳"
                    },
                    "&esim;": {
                        codepoints: [8770],
                        characters: "≂"
                    },
                    "&Eta;": {
                        codepoints: [919],
                        characters: "Η"
                    },
                    "&eta;": {
                        codepoints: [951],
                        characters: "η"
                    },
                    "&ETH;": {
                        codepoints: [208],
                        characters: "Ð"
                    },
                    "&ETH": {
                        codepoints: [208],
                        characters: "Ð"
                    },
                    "&eth;": {
                        codepoints: [240],
                        characters: "ð"
                    },
                    "&eth": {
                        codepoints: [240],
                        characters: "ð"
                    },
                    "&Euml;": {
                        codepoints: [203],
                        characters: "Ë"
                    },
                    "&Euml": {
                        codepoints: [203],
                        characters: "Ë"
                    },
                    "&euml;": {
                        codepoints: [235],
                        characters: "ë"
                    },
                    "&euml": {
                        codepoints: [235],
                        characters: "ë"
                    },
                    "&euro;": {
                        codepoints: [8364],
                        characters: "€"
                    },
                    "&excl;": {
                        codepoints: [33],
                        characters: "!"
                    },
                    "&exist;": {
                        codepoints: [8707],
                        characters: "∃"
                    },
                    "&Exists;": {
                        codepoints: [8707],
                        characters: "∃"
                    },
                    "&expectation;": {
                        codepoints: [8496],
                        characters: "ℰ"
                    },
                    "&exponentiale;": {
                        codepoints: [8519],
                        characters: "ⅇ"
                    },
                    "&ExponentialE;": {
                        codepoints: [8519],
                        characters: "ⅇ"
                    },
                    "&fallingdotseq;": {
                        codepoints: [8786],
                        characters: "≒"
                    },
                    "&Fcy;": {
                        codepoints: [1060],
                        characters: "Ф"
                    },
                    "&fcy;": {
                        codepoints: [1092],
                        characters: "ф"
                    },
                    "&female;": {
                        codepoints: [9792],
                        characters: "♀"
                    },
                    "&ffilig;": {
                        codepoints: [64259],
                        characters: "ﬃ"
                    },
                    "&fflig;": {
                        codepoints: [64256],
                        characters: "ﬀ"
                    },
                    "&ffllig;": {
                        codepoints: [64260],
                        characters: "ﬄ"
                    },
                    "&Ffr;": {
                        codepoints: [120073],
                        characters: "𝔉"
                    },
                    "&ffr;": {
                        codepoints: [120099],
                        characters: "𝔣"
                    },
                    "&filig;": {
                        codepoints: [64257],
                        characters: "ﬁ"
                    },
                    "&FilledSmallSquare;": {
                        codepoints: [9724],
                        characters: "◼"
                    },
                    "&FilledVerySmallSquare;": {
                        codepoints: [9642],
                        characters: "▪"
                    },
                    "&fjlig;": {
                        codepoints: [102, 106],
                        characters: "fj"
                    },
                    "&flat;": {
                        codepoints: [9837],
                        characters: "♭"
                    },
                    "&fllig;": {
                        codepoints: [64258],
                        characters: "ﬂ"
                    },
                    "&fltns;": {
                        codepoints: [9649],
                        characters: "▱"
                    },
                    "&fnof;": {
                        codepoints: [402],
                        characters: "ƒ"
                    },
                    "&Fopf;": {
                        codepoints: [120125],
                        characters: "𝔽"
                    },
                    "&fopf;": {
                        codepoints: [120151],
                        characters: "𝕗"
                    },
                    "&forall;": {
                        codepoints: [8704],
                        characters: "∀"
                    },
                    "&ForAll;": {
                        codepoints: [8704],
                        characters: "∀"
                    },
                    "&fork;": {
                        codepoints: [8916],
                        characters: "⋔"
                    },
                    "&forkv;": {
                        codepoints: [10969],
                        characters: "⫙"
                    },
                    "&Fouriertrf;": {
                        codepoints: [8497],
                        characters: "ℱ"
                    },
                    "&fpartint;": {
                        codepoints: [10765],
                        characters: "⨍"
                    },
                    "&frac12;": {
                        codepoints: [189],
                        characters: "½"
                    },
                    "&frac12": {
                        codepoints: [189],
                        characters: "½"
                    },
                    "&frac13;": {
                        codepoints: [8531],
                        characters: "⅓"
                    },
                    "&frac14;": {
                        codepoints: [188],
                        characters: "¼"
                    },
                    "&frac14": {
                        codepoints: [188],
                        characters: "¼"
                    },
                    "&frac15;": {
                        codepoints: [8533],
                        characters: "⅕"
                    },
                    "&frac16;": {
                        codepoints: [8537],
                        characters: "⅙"
                    },
                    "&frac18;": {
                        codepoints: [8539],
                        characters: "⅛"
                    },
                    "&frac23;": {
                        codepoints: [8532],
                        characters: "⅔"
                    },
                    "&frac25;": {
                        codepoints: [8534],
                        characters: "⅖"
                    },
                    "&frac34;": {
                        codepoints: [190],
                        characters: "¾"
                    },
                    "&frac34": {
                        codepoints: [190],
                        characters: "¾"
                    },
                    "&frac35;": {
                        codepoints: [8535],
                        characters: "⅗"
                    },
                    "&frac38;": {
                        codepoints: [8540],
                        characters: "⅜"
                    },
                    "&frac45;": {
                        codepoints: [8536],
                        characters: "⅘"
                    },
                    "&frac56;": {
                        codepoints: [8538],
                        characters: "⅚"
                    },
                    "&frac58;": {
                        codepoints: [8541],
                        characters: "⅝"
                    },
                    "&frac78;": {
                        codepoints: [8542],
                        characters: "⅞"
                    },
                    "&frasl;": {
                        codepoints: [8260],
                        characters: "⁄"
                    },
                    "&frown;": {
                        codepoints: [8994],
                        characters: "⌢"
                    },
                    "&fscr;": {
                        codepoints: [119995],
                        characters: "𝒻"
                    },
                    "&Fscr;": {
                        codepoints: [8497],
                        characters: "ℱ"
                    },
                    "&gacute;": {
                        codepoints: [501],
                        characters: "ǵ"
                    },
                    "&Gamma;": {
                        codepoints: [915],
                        characters: "Γ"
                    },
                    "&gamma;": {
                        codepoints: [947],
                        characters: "γ"
                    },
                    "&Gammad;": {
                        codepoints: [988],
                        characters: "Ϝ"
                    },
                    "&gammad;": {
                        codepoints: [989],
                        characters: "ϝ"
                    },
                    "&gap;": {
                        codepoints: [10886],
                        characters: "⪆"
                    },
                    "&Gbreve;": {
                        codepoints: [286],
                        characters: "Ğ"
                    },
                    "&gbreve;": {
                        codepoints: [287],
                        characters: "ğ"
                    },
                    "&Gcedil;": {
                        codepoints: [290],
                        characters: "Ģ"
                    },
                    "&Gcirc;": {
                        codepoints: [284],
                        characters: "Ĝ"
                    },
                    "&gcirc;": {
                        codepoints: [285],
                        characters: "ĝ"
                    },
                    "&Gcy;": {
                        codepoints: [1043],
                        characters: "Г"
                    },
                    "&gcy;": {
                        codepoints: [1075],
                        characters: "г"
                    },
                    "&Gdot;": {
                        codepoints: [288],
                        characters: "Ġ"
                    },
                    "&gdot;": {
                        codepoints: [289],
                        characters: "ġ"
                    },
                    "&ge;": {
                        codepoints: [8805],
                        characters: "≥"
                    },
                    "&gE;": {
                        codepoints: [8807],
                        characters: "≧"
                    },
                    "&gEl;": {
                        codepoints: [10892],
                        characters: "⪌"
                    },
                    "&gel;": {
                        codepoints: [8923],
                        characters: "⋛"
                    },
                    "&geq;": {
                        codepoints: [8805],
                        characters: "≥"
                    },
                    "&geqq;": {
                        codepoints: [8807],
                        characters: "≧"
                    },
                    "&geqslant;": {
                        codepoints: [10878],
                        characters: "⩾"
                    },
                    "&gescc;": {
                        codepoints: [10921],
                        characters: "⪩"
                    },
                    "&ges;": {
                        codepoints: [10878],
                        characters: "⩾"
                    },
                    "&gesdot;": {
                        codepoints: [10880],
                        characters: "⪀"
                    },
                    "&gesdoto;": {
                        codepoints: [10882],
                        characters: "⪂"
                    },
                    "&gesdotol;": {
                        codepoints: [10884],
                        characters: "⪄"
                    },
                    "&gesl;": {
                        codepoints: [8923, 65024],
                        characters: "⋛︀"
                    },
                    "&gesles;": {
                        codepoints: [10900],
                        characters: "⪔"
                    },
                    "&Gfr;": {
                        codepoints: [120074],
                        characters: "𝔊"
                    },
                    "&gfr;": {
                        codepoints: [120100],
                        characters: "𝔤"
                    },
                    "&gg;": {
                        codepoints: [8811],
                        characters: "≫"
                    },
                    "&Gg;": {
                        codepoints: [8921],
                        characters: "⋙"
                    },
                    "&ggg;": {
                        codepoints: [8921],
                        characters: "⋙"
                    },
                    "&gimel;": {
                        codepoints: [8503],
                        characters: "ℷ"
                    },
                    "&GJcy;": {
                        codepoints: [1027],
                        characters: "Ѓ"
                    },
                    "&gjcy;": {
                        codepoints: [1107],
                        characters: "ѓ"
                    },
                    "&gla;": {
                        codepoints: [10917],
                        characters: "⪥"
                    },
                    "&gl;": {
                        codepoints: [8823],
                        characters: "≷"
                    },
                    "&glE;": {
                        codepoints: [10898],
                        characters: "⪒"
                    },
                    "&glj;": {
                        codepoints: [10916],
                        characters: "⪤"
                    },
                    "&gnap;": {
                        codepoints: [10890],
                        characters: "⪊"
                    },
                    "&gnapprox;": {
                        codepoints: [10890],
                        characters: "⪊"
                    },
                    "&gne;": {
                        codepoints: [10888],
                        characters: "⪈"
                    },
                    "&gnE;": {
                        codepoints: [8809],
                        characters: "≩"
                    },
                    "&gneq;": {
                        codepoints: [10888],
                        characters: "⪈"
                    },
                    "&gneqq;": {
                        codepoints: [8809],
                        characters: "≩"
                    },
                    "&gnsim;": {
                        codepoints: [8935],
                        characters: "⋧"
                    },
                    "&Gopf;": {
                        codepoints: [120126],
                        characters: "𝔾"
                    },
                    "&gopf;": {
                        codepoints: [120152],
                        characters: "𝕘"
                    },
                    "&grave;": {
                        codepoints: [96],
                        characters: "`"
                    },
                    "&GreaterEqual;": {
                        codepoints: [8805],
                        characters: "≥"
                    },
                    "&GreaterEqualLess;": {
                        codepoints: [8923],
                        characters: "⋛"
                    },
                    "&GreaterFullEqual;": {
                        codepoints: [8807],
                        characters: "≧"
                    },
                    "&GreaterGreater;": {
                        codepoints: [10914],
                        characters: "⪢"
                    },
                    "&GreaterLess;": {
                        codepoints: [8823],
                        characters: "≷"
                    },
                    "&GreaterSlantEqual;": {
                        codepoints: [10878],
                        characters: "⩾"
                    },
                    "&GreaterTilde;": {
                        codepoints: [8819],
                        characters: "≳"
                    },
                    "&Gscr;": {
                        codepoints: [119970],
                        characters: "𝒢"
                    },
                    "&gscr;": {
                        codepoints: [8458],
                        characters: "ℊ"
                    },
                    "&gsim;": {
                        codepoints: [8819],
                        characters: "≳"
                    },
                    "&gsime;": {
                        codepoints: [10894],
                        characters: "⪎"
                    },
                    "&gsiml;": {
                        codepoints: [10896],
                        characters: "⪐"
                    },
                    "&gtcc;": {
                        codepoints: [10919],
                        characters: "⪧"
                    },
                    "&gtcir;": {
                        codepoints: [10874],
                        characters: "⩺"
                    },
                    "&gt;": {
                        codepoints: [62],
                        characters: ">"
                    },
                    "&gt": {
                        codepoints: [62],
                        characters: ">"
                    },
                    "&GT;": {
                        codepoints: [62],
                        characters: ">"
                    },
                    "&GT": {
                        codepoints: [62],
                        characters: ">"
                    },
                    "&Gt;": {
                        codepoints: [8811],
                        characters: "≫"
                    },
                    "&gtdot;": {
                        codepoints: [8919],
                        characters: "⋗"
                    },
                    "&gtlPar;": {
                        codepoints: [10645],
                        characters: "⦕"
                    },
                    "&gtquest;": {
                        codepoints: [10876],
                        characters: "⩼"
                    },
                    "&gtrapprox;": {
                        codepoints: [10886],
                        characters: "⪆"
                    },
                    "&gtrarr;": {
                        codepoints: [10616],
                        characters: "⥸"
                    },
                    "&gtrdot;": {
                        codepoints: [8919],
                        characters: "⋗"
                    },
                    "&gtreqless;": {
                        codepoints: [8923],
                        characters: "⋛"
                    },
                    "&gtreqqless;": {
                        codepoints: [10892],
                        characters: "⪌"
                    },
                    "&gtrless;": {
                        codepoints: [8823],
                        characters: "≷"
                    },
                    "&gtrsim;": {
                        codepoints: [8819],
                        characters: "≳"
                    },
                    "&gvertneqq;": {
                        codepoints: [8809, 65024],
                        characters: "≩︀"
                    },
                    "&gvnE;": {
                        codepoints: [8809, 65024],
                        characters: "≩︀"
                    },
                    "&Hacek;": {
                        codepoints: [711],
                        characters: "ˇ"
                    },
                    "&hairsp;": {
                        codepoints: [8202],
                        characters: " "
                    },
                    "&half;": {
                        codepoints: [189],
                        characters: "½"
                    },
                    "&hamilt;": {
                        codepoints: [8459],
                        characters: "ℋ"
                    },
                    "&HARDcy;": {
                        codepoints: [1066],
                        characters: "Ъ"
                    },
                    "&hardcy;": {
                        codepoints: [1098],
                        characters: "ъ"
                    },
                    "&harrcir;": {
                        codepoints: [10568],
                        characters: "⥈"
                    },
                    "&harr;": {
                        codepoints: [8596],
                        characters: "↔"
                    },
                    "&hArr;": {
                        codepoints: [8660],
                        characters: "⇔"
                    },
                    "&harrw;": {
                        codepoints: [8621],
                        characters: "↭"
                    },
                    "&Hat;": {
                        codepoints: [94],
                        characters: "^"
                    },
                    "&hbar;": {
                        codepoints: [8463],
                        characters: "ℏ"
                    },
                    "&Hcirc;": {
                        codepoints: [292],
                        characters: "Ĥ"
                    },
                    "&hcirc;": {
                        codepoints: [293],
                        characters: "ĥ"
                    },
                    "&hearts;": {
                        codepoints: [9829],
                        characters: "♥"
                    },
                    "&heartsuit;": {
                        codepoints: [9829],
                        characters: "♥"
                    },
                    "&hellip;": {
                        codepoints: [8230],
                        characters: "…"
                    },
                    "&hercon;": {
                        codepoints: [8889],
                        characters: "⊹"
                    },
                    "&hfr;": {
                        codepoints: [120101],
                        characters: "𝔥"
                    },
                    "&Hfr;": {
                        codepoints: [8460],
                        characters: "ℌ"
                    },
                    "&HilbertSpace;": {
                        codepoints: [8459],
                        characters: "ℋ"
                    },
                    "&hksearow;": {
                        codepoints: [10533],
                        characters: "⤥"
                    },
                    "&hkswarow;": {
                        codepoints: [10534],
                        characters: "⤦"
                    },
                    "&hoarr;": {
                        codepoints: [8703],
                        characters: "⇿"
                    },
                    "&homtht;": {
                        codepoints: [8763],
                        characters: "∻"
                    },
                    "&hookleftarrow;": {
                        codepoints: [8617],
                        characters: "↩"
                    },
                    "&hookrightarrow;": {
                        codepoints: [8618],
                        characters: "↪"
                    },
                    "&hopf;": {
                        codepoints: [120153],
                        characters: "𝕙"
                    },
                    "&Hopf;": {
                        codepoints: [8461],
                        characters: "ℍ"
                    },
                    "&horbar;": {
                        codepoints: [8213],
                        characters: "―"
                    },
                    "&HorizontalLine;": {
                        codepoints: [9472],
                        characters: "─"
                    },
                    "&hscr;": {
                        codepoints: [119997],
                        characters: "𝒽"
                    },
                    "&Hscr;": {
                        codepoints: [8459],
                        characters: "ℋ"
                    },
                    "&hslash;": {
                        codepoints: [8463],
                        characters: "ℏ"
                    },
                    "&Hstrok;": {
                        codepoints: [294],
                        characters: "Ħ"
                    },
                    "&hstrok;": {
                        codepoints: [295],
                        characters: "ħ"
                    },
                    "&HumpDownHump;": {
                        codepoints: [8782],
                        characters: "≎"
                    },
                    "&HumpEqual;": {
                        codepoints: [8783],
                        characters: "≏"
                    },
                    "&hybull;": {
                        codepoints: [8259],
                        characters: "⁃"
                    },
                    "&hyphen;": {
                        codepoints: [8208],
                        characters: "‐"
                    },
                    "&Iacute;": {
                        codepoints: [205],
                        characters: "Í"
                    },
                    "&Iacute": {
                        codepoints: [205],
                        characters: "Í"
                    },
                    "&iacute;": {
                        codepoints: [237],
                        characters: "í"
                    },
                    "&iacute": {
                        codepoints: [237],
                        characters: "í"
                    },
                    "&ic;": {
                        codepoints: [8291],
                        characters: "⁣"
                    },
                    "&Icirc;": {
                        codepoints: [206],
                        characters: "Î"
                    },
                    "&Icirc": {
                        codepoints: [206],
                        characters: "Î"
                    },
                    "&icirc;": {
                        codepoints: [238],
                        characters: "î"
                    },
                    "&icirc": {
                        codepoints: [238],
                        characters: "î"
                    },
                    "&Icy;": {
                        codepoints: [1048],
                        characters: "И"
                    },
                    "&icy;": {
                        codepoints: [1080],
                        characters: "и"
                    },
                    "&Idot;": {
                        codepoints: [304],
                        characters: "İ"
                    },
                    "&IEcy;": {
                        codepoints: [1045],
                        characters: "Е"
                    },
                    "&iecy;": {
                        codepoints: [1077],
                        characters: "е"
                    },
                    "&iexcl;": {
                        codepoints: [161],
                        characters: "¡"
                    },
                    "&iexcl": {
                        codepoints: [161],
                        characters: "¡"
                    },
                    "&iff;": {
                        codepoints: [8660],
                        characters: "⇔"
                    },
                    "&ifr;": {
                        codepoints: [120102],
                        characters: "𝔦"
                    },
                    "&Ifr;": {
                        codepoints: [8465],
                        characters: "ℑ"
                    },
                    "&Igrave;": {
                        codepoints: [204],
                        characters: "Ì"
                    },
                    "&Igrave": {
                        codepoints: [204],
                        characters: "Ì"
                    },
                    "&igrave;": {
                        codepoints: [236],
                        characters: "ì"
                    },
                    "&igrave": {
                        codepoints: [236],
                        characters: "ì"
                    },
                    "&ii;": {
                        codepoints: [8520],
                        characters: "ⅈ"
                    },
                    "&iiiint;": {
                        codepoints: [10764],
                        characters: "⨌"
                    },
                    "&iiint;": {
                        codepoints: [8749],
                        characters: "∭"
                    },
                    "&iinfin;": {
                        codepoints: [10716],
                        characters: "⧜"
                    },
                    "&iiota;": {
                        codepoints: [8489],
                        characters: "℩"
                    },
                    "&IJlig;": {
                        codepoints: [306],
                        characters: "Ĳ"
                    },
                    "&ijlig;": {
                        codepoints: [307],
                        characters: "ĳ"
                    },
                    "&Imacr;": {
                        codepoints: [298],
                        characters: "Ī"
                    },
                    "&imacr;": {
                        codepoints: [299],
                        characters: "ī"
                    },
                    "&image;": {
                        codepoints: [8465],
                        characters: "ℑ"
                    },
                    "&ImaginaryI;": {
                        codepoints: [8520],
                        characters: "ⅈ"
                    },
                    "&imagline;": {
                        codepoints: [8464],
                        characters: "ℐ"
                    },
                    "&imagpart;": {
                        codepoints: [8465],
                        characters: "ℑ"
                    },
                    "&imath;": {
                        codepoints: [305],
                        characters: "ı"
                    },
                    "&Im;": {
                        codepoints: [8465],
                        characters: "ℑ"
                    },
                    "&imof;": {
                        codepoints: [8887],
                        characters: "⊷"
                    },
                    "&imped;": {
                        codepoints: [437],
                        characters: "Ƶ"
                    },
                    "&Implies;": {
                        codepoints: [8658],
                        characters: "⇒"
                    },
                    "&incare;": {
                        codepoints: [8453],
                        characters: "℅"
                    },
                    "&in;": {
                        codepoints: [8712],
                        characters: "∈"
                    },
                    "&infin;": {
                        codepoints: [8734],
                        characters: "∞"
                    },
                    "&infintie;": {
                        codepoints: [10717],
                        characters: "⧝"
                    },
                    "&inodot;": {
                        codepoints: [305],
                        characters: "ı"
                    },
                    "&intcal;": {
                        codepoints: [8890],
                        characters: "⊺"
                    },
                    "&int;": {
                        codepoints: [8747],
                        characters: "∫"
                    },
                    "&Int;": {
                        codepoints: [8748],
                        characters: "∬"
                    },
                    "&integers;": {
                        codepoints: [8484],
                        characters: "ℤ"
                    },
                    "&Integral;": {
                        codepoints: [8747],
                        characters: "∫"
                    },
                    "&intercal;": {
                        codepoints: [8890],
                        characters: "⊺"
                    },
                    "&Intersection;": {
                        codepoints: [8898],
                        characters: "⋂"
                    },
                    "&intlarhk;": {
                        codepoints: [10775],
                        characters: "⨗"
                    },
                    "&intprod;": {
                        codepoints: [10812],
                        characters: "⨼"
                    },
                    "&InvisibleComma;": {
                        codepoints: [8291],
                        characters: "⁣"
                    },
                    "&InvisibleTimes;": {
                        codepoints: [8290],
                        characters: "⁢"
                    },
                    "&IOcy;": {
                        codepoints: [1025],
                        characters: "Ё"
                    },
                    "&iocy;": {
                        codepoints: [1105],
                        characters: "ё"
                    },
                    "&Iogon;": {
                        codepoints: [302],
                        characters: "Į"
                    },
                    "&iogon;": {
                        codepoints: [303],
                        characters: "į"
                    },
                    "&Iopf;": {
                        codepoints: [120128],
                        characters: "𝕀"
                    },
                    "&iopf;": {
                        codepoints: [120154],
                        characters: "𝕚"
                    },
                    "&Iota;": {
                        codepoints: [921],
                        characters: "Ι"
                    },
                    "&iota;": {
                        codepoints: [953],
                        characters: "ι"
                    },
                    "&iprod;": {
                        codepoints: [10812],
                        characters: "⨼"
                    },
                    "&iquest;": {
                        codepoints: [191],
                        characters: "¿"
                    },
                    "&iquest": {
                        codepoints: [191],
                        characters: "¿"
                    },
                    "&iscr;": {
                        codepoints: [119998],
                        characters: "𝒾"
                    },
                    "&Iscr;": {
                        codepoints: [8464],
                        characters: "ℐ"
                    },
                    "&isin;": {
                        codepoints: [8712],
                        characters: "∈"
                    },
                    "&isindot;": {
                        codepoints: [8949],
                        characters: "⋵"
                    },
                    "&isinE;": {
                        codepoints: [8953],
                        characters: "⋹"
                    },
                    "&isins;": {
                        codepoints: [8948],
                        characters: "⋴"
                    },
                    "&isinsv;": {
                        codepoints: [8947],
                        characters: "⋳"
                    },
                    "&isinv;": {
                        codepoints: [8712],
                        characters: "∈"
                    },
                    "&it;": {
                        codepoints: [8290],
                        characters: "⁢"
                    },
                    "&Itilde;": {
                        codepoints: [296],
                        characters: "Ĩ"
                    },
                    "&itilde;": {
                        codepoints: [297],
                        characters: "ĩ"
                    },
                    "&Iukcy;": {
                        codepoints: [1030],
                        characters: "І"
                    },
                    "&iukcy;": {
                        codepoints: [1110],
                        characters: "і"
                    },
                    "&Iuml;": {
                        codepoints: [207],
                        characters: "Ï"
                    },
                    "&Iuml": {
                        codepoints: [207],
                        characters: "Ï"
                    },
                    "&iuml;": {
                        codepoints: [239],
                        characters: "ï"
                    },
                    "&iuml": {
                        codepoints: [239],
                        characters: "ï"
                    },
                    "&Jcirc;": {
                        codepoints: [308],
                        characters: "Ĵ"
                    },
                    "&jcirc;": {
                        codepoints: [309],
                        characters: "ĵ"
                    },
                    "&Jcy;": {
                        codepoints: [1049],
                        characters: "Й"
                    },
                    "&jcy;": {
                        codepoints: [1081],
                        characters: "й"
                    },
                    "&Jfr;": {
                        codepoints: [120077],
                        characters: "𝔍"
                    },
                    "&jfr;": {
                        codepoints: [120103],
                        characters: "𝔧"
                    },
                    "&jmath;": {
                        codepoints: [567],
                        characters: "ȷ"
                    },
                    "&Jopf;": {
                        codepoints: [120129],
                        characters: "𝕁"
                    },
                    "&jopf;": {
                        codepoints: [120155],
                        characters: "𝕛"
                    },
                    "&Jscr;": {
                        codepoints: [119973],
                        characters: "𝒥"
                    },
                    "&jscr;": {
                        codepoints: [119999],
                        characters: "𝒿"
                    },
                    "&Jsercy;": {
                        codepoints: [1032],
                        characters: "Ј"
                    },
                    "&jsercy;": {
                        codepoints: [1112],
                        characters: "ј"
                    },
                    "&Jukcy;": {
                        codepoints: [1028],
                        characters: "Є"
                    },
                    "&jukcy;": {
                        codepoints: [1108],
                        characters: "є"
                    },
                    "&Kappa;": {
                        codepoints: [922],
                        characters: "Κ"
                    },
                    "&kappa;": {
                        codepoints: [954],
                        characters: "κ"
                    },
                    "&kappav;": {
                        codepoints: [1008],
                        characters: "ϰ"
                    },
                    "&Kcedil;": {
                        codepoints: [310],
                        characters: "Ķ"
                    },
                    "&kcedil;": {
                        codepoints: [311],
                        characters: "ķ"
                    },
                    "&Kcy;": {
                        codepoints: [1050],
                        characters: "К"
                    },
                    "&kcy;": {
                        codepoints: [1082],
                        characters: "к"
                    },
                    "&Kfr;": {
                        codepoints: [120078],
                        characters: "𝔎"
                    },
                    "&kfr;": {
                        codepoints: [120104],
                        characters: "𝔨"
                    },
                    "&kgreen;": {
                        codepoints: [312],
                        characters: "ĸ"
                    },
                    "&KHcy;": {
                        codepoints: [1061],
                        characters: "Х"
                    },
                    "&khcy;": {
                        codepoints: [1093],
                        characters: "х"
                    },
                    "&KJcy;": {
                        codepoints: [1036],
                        characters: "Ќ"
                    },
                    "&kjcy;": {
                        codepoints: [1116],
                        characters: "ќ"
                    },
                    "&Kopf;": {
                        codepoints: [120130],
                        characters: "𝕂"
                    },
                    "&kopf;": {
                        codepoints: [120156],
                        characters: "𝕜"
                    },
                    "&Kscr;": {
                        codepoints: [119974],
                        characters: "𝒦"
                    },
                    "&kscr;": {
                        codepoints: [12e4],
                        characters: "𝓀"
                    },
                    "&lAarr;": {
                        codepoints: [8666],
                        characters: "⇚"
                    },
                    "&Lacute;": {
                        codepoints: [313],
                        characters: "Ĺ"
                    },
                    "&lacute;": {
                        codepoints: [314],
                        characters: "ĺ"
                    },
                    "&laemptyv;": {
                        codepoints: [10676],
                        characters: "⦴"
                    },
                    "&lagran;": {
                        codepoints: [8466],
                        characters: "ℒ"
                    },
                    "&Lambda;": {
                        codepoints: [923],
                        characters: "Λ"
                    },
                    "&lambda;": {
                        codepoints: [955],
                        characters: "λ"
                    },
                    "&lang;": {
                        codepoints: [10216],
                        characters: "⟨"
                    },
                    "&Lang;": {
                        codepoints: [10218],
                        characters: "⟪"
                    },
                    "&langd;": {
                        codepoints: [10641],
                        characters: "⦑"
                    },
                    "&langle;": {
                        codepoints: [10216],
                        characters: "⟨"
                    },
                    "&lap;": {
                        codepoints: [10885],
                        characters: "⪅"
                    },
                    "&Laplacetrf;": {
                        codepoints: [8466],
                        characters: "ℒ"
                    },
                    "&laquo;": {
                        codepoints: [171],
                        characters: "«"
                    },
                    "&laquo": {
                        codepoints: [171],
                        characters: "«"
                    },
                    "&larrb;": {
                        codepoints: [8676],
                        characters: "⇤"
                    },
                    "&larrbfs;": {
                        codepoints: [10527],
                        characters: "⤟"
                    },
                    "&larr;": {
                        codepoints: [8592],
                        characters: "←"
                    },
                    "&Larr;": {
                        codepoints: [8606],
                        characters: "↞"
                    },
                    "&lArr;": {
                        codepoints: [8656],
                        characters: "⇐"
                    },
                    "&larrfs;": {
                        codepoints: [10525],
                        characters: "⤝"
                    },
                    "&larrhk;": {
                        codepoints: [8617],
                        characters: "↩"
                    },
                    "&larrlp;": {
                        codepoints: [8619],
                        characters: "↫"
                    },
                    "&larrpl;": {
                        codepoints: [10553],
                        characters: "⤹"
                    },
                    "&larrsim;": {
                        codepoints: [10611],
                        characters: "⥳"
                    },
                    "&larrtl;": {
                        codepoints: [8610],
                        characters: "↢"
                    },
                    "&latail;": {
                        codepoints: [10521],
                        characters: "⤙"
                    },
                    "&lAtail;": {
                        codepoints: [10523],
                        characters: "⤛"
                    },
                    "&lat;": {
                        codepoints: [10923],
                        characters: "⪫"
                    },
                    "&late;": {
                        codepoints: [10925],
                        characters: "⪭"
                    },
                    "&lates;": {
                        codepoints: [10925, 65024],
                        characters: "⪭︀"
                    },
                    "&lbarr;": {
                        codepoints: [10508],
                        characters: "⤌"
                    },
                    "&lBarr;": {
                        codepoints: [10510],
                        characters: "⤎"
                    },
                    "&lbbrk;": {
                        codepoints: [10098],
                        characters: "❲"
                    },
                    "&lbrace;": {
                        codepoints: [123],
                        characters: "{"
                    },
                    "&lbrack;": {
                        codepoints: [91],
                        characters: "["
                    },
                    "&lbrke;": {
                        codepoints: [10635],
                        characters: "⦋"
                    },
                    "&lbrksld;": {
                        codepoints: [10639],
                        characters: "⦏"
                    },
                    "&lbrkslu;": {
                        codepoints: [10637],
                        characters: "⦍"
                    },
                    "&Lcaron;": {
                        codepoints: [317],
                        characters: "Ľ"
                    },
                    "&lcaron;": {
                        codepoints: [318],
                        characters: "ľ"
                    },
                    "&Lcedil;": {
                        codepoints: [315],
                        characters: "Ļ"
                    },
                    "&lcedil;": {
                        codepoints: [316],
                        characters: "ļ"
                    },
                    "&lceil;": {
                        codepoints: [8968],
                        characters: "⌈"
                    },
                    "&lcub;": {
                        codepoints: [123],
                        characters: "{"
                    },
                    "&Lcy;": {
                        codepoints: [1051],
                        characters: "Л"
                    },
                    "&lcy;": {
                        codepoints: [1083],
                        characters: "л"
                    },
                    "&ldca;": {
                        codepoints: [10550],
                        characters: "⤶"
                    },
                    "&ldquo;": {
                        codepoints: [8220],
                        characters: "“"
                    },
                    "&ldquor;": {
                        codepoints: [8222],
                        characters: "„"
                    },
                    "&ldrdhar;": {
                        codepoints: [10599],
                        characters: "⥧"
                    },
                    "&ldrushar;": {
                        codepoints: [10571],
                        characters: "⥋"
                    },
                    "&ldsh;": {
                        codepoints: [8626],
                        characters: "↲"
                    },
                    "&le;": {
                        codepoints: [8804],
                        characters: "≤"
                    },
                    "&lE;": {
                        codepoints: [8806],
                        characters: "≦"
                    },
                    "&LeftAngleBracket;": {
                        codepoints: [10216],
                        characters: "⟨"
                    },
                    "&LeftArrowBar;": {
                        codepoints: [8676],
                        characters: "⇤"
                    },
                    "&leftarrow;": {
                        codepoints: [8592],
                        characters: "←"
                    },
                    "&LeftArrow;": {
                        codepoints: [8592],
                        characters: "←"
                    },
                    "&Leftarrow;": {
                        codepoints: [8656],
                        characters: "⇐"
                    },
                    "&LeftArrowRightArrow;": {
                        codepoints: [8646],
                        characters: "⇆"
                    },
                    "&leftarrowtail;": {
                        codepoints: [8610],
                        characters: "↢"
                    },
                    "&LeftCeiling;": {
                        codepoints: [8968],
                        characters: "⌈"
                    },
                    "&LeftDoubleBracket;": {
                        codepoints: [10214],
                        characters: "⟦"
                    },
                    "&LeftDownTeeVector;": {
                        codepoints: [10593],
                        characters: "⥡"
                    },
                    "&LeftDownVectorBar;": {
                        codepoints: [10585],
                        characters: "⥙"
                    },
                    "&LeftDownVector;": {
                        codepoints: [8643],
                        characters: "⇃"
                    },
                    "&LeftFloor;": {
                        codepoints: [8970],
                        characters: "⌊"
                    },
                    "&leftharpoondown;": {
                        codepoints: [8637],
                        characters: "↽"
                    },
                    "&leftharpoonup;": {
                        codepoints: [8636],
                        characters: "↼"
                    },
                    "&leftleftarrows;": {
                        codepoints: [8647],
                        characters: "⇇"
                    },
                    "&leftrightarrow;": {
                        codepoints: [8596],
                        characters: "↔"
                    },
                    "&LeftRightArrow;": {
                        codepoints: [8596],
                        characters: "↔"
                    },
                    "&Leftrightarrow;": {
                        codepoints: [8660],
                        characters: "⇔"
                    },
                    "&leftrightarrows;": {
                        codepoints: [8646],
                        characters: "⇆"
                    },
                    "&leftrightharpoons;": {
                        codepoints: [8651],
                        characters: "⇋"
                    },
                    "&leftrightsquigarrow;": {
                        codepoints: [8621],
                        characters: "↭"
                    },
                    "&LeftRightVector;": {
                        codepoints: [10574],
                        characters: "⥎"
                    },
                    "&LeftTeeArrow;": {
                        codepoints: [8612],
                        characters: "↤"
                    },
                    "&LeftTee;": {
                        codepoints: [8867],
                        characters: "⊣"
                    },
                    "&LeftTeeVector;": {
                        codepoints: [10586],
                        characters: "⥚"
                    },
                    "&leftthreetimes;": {
                        codepoints: [8907],
                        characters: "⋋"
                    },
                    "&LeftTriangleBar;": {
                        codepoints: [10703],
                        characters: "⧏"
                    },
                    "&LeftTriangle;": {
                        codepoints: [8882],
                        characters: "⊲"
                    },
                    "&LeftTriangleEqual;": {
                        codepoints: [8884],
                        characters: "⊴"
                    },
                    "&LeftUpDownVector;": {
                        codepoints: [10577],
                        characters: "⥑"
                    },
                    "&LeftUpTeeVector;": {
                        codepoints: [10592],
                        characters: "⥠"
                    },
                    "&LeftUpVectorBar;": {
                        codepoints: [10584],
                        characters: "⥘"
                    },
                    "&LeftUpVector;": {
                        codepoints: [8639],
                        characters: "↿"
                    },
                    "&LeftVectorBar;": {
                        codepoints: [10578],
                        characters: "⥒"
                    },
                    "&LeftVector;": {
                        codepoints: [8636],
                        characters: "↼"
                    },
                    "&lEg;": {
                        codepoints: [10891],
                        characters: "⪋"
                    },
                    "&leg;": {
                        codepoints: [8922],
                        characters: "⋚"
                    },
                    "&leq;": {
                        codepoints: [8804],
                        characters: "≤"
                    },
                    "&leqq;": {
                        codepoints: [8806],
                        characters: "≦"
                    },
                    "&leqslant;": {
                        codepoints: [10877],
                        characters: "⩽"
                    },
                    "&lescc;": {
                        codepoints: [10920],
                        characters: "⪨"
                    },
                    "&les;": {
                        codepoints: [10877],
                        characters: "⩽"
                    },
                    "&lesdot;": {
                        codepoints: [10879],
                        characters: "⩿"
                    },
                    "&lesdoto;": {
                        codepoints: [10881],
                        characters: "⪁"
                    },
                    "&lesdotor;": {
                        codepoints: [10883],
                        characters: "⪃"
                    },
                    "&lesg;": {
                        codepoints: [8922, 65024],
                        characters: "⋚︀"
                    },
                    "&lesges;": {
                        codepoints: [10899],
                        characters: "⪓"
                    },
                    "&lessapprox;": {
                        codepoints: [10885],
                        characters: "⪅"
                    },
                    "&lessdot;": {
                        codepoints: [8918],
                        characters: "⋖"
                    },
                    "&lesseqgtr;": {
                        codepoints: [8922],
                        characters: "⋚"
                    },
                    "&lesseqqgtr;": {
                        codepoints: [10891],
                        characters: "⪋"
                    },
                    "&LessEqualGreater;": {
                        codepoints: [8922],
                        characters: "⋚"
                    },
                    "&LessFullEqual;": {
                        codepoints: [8806],
                        characters: "≦"
                    },
                    "&LessGreater;": {
                        codepoints: [8822],
                        characters: "≶"
                    },
                    "&lessgtr;": {
                        codepoints: [8822],
                        characters: "≶"
                    },
                    "&LessLess;": {
                        codepoints: [10913],
                        characters: "⪡"
                    },
                    "&lesssim;": {
                        codepoints: [8818],
                        characters: "≲"
                    },
                    "&LessSlantEqual;": {
                        codepoints: [10877],
                        characters: "⩽"
                    },
                    "&LessTilde;": {
                        codepoints: [8818],
                        characters: "≲"
                    },
                    "&lfisht;": {
                        codepoints: [10620],
                        characters: "⥼"
                    },
                    "&lfloor;": {
                        codepoints: [8970],
                        characters: "⌊"
                    },
                    "&Lfr;": {
                        codepoints: [120079],
                        characters: "𝔏"
                    },
                    "&lfr;": {
                        codepoints: [120105],
                        characters: "𝔩"
                    },
                    "&lg;": {
                        codepoints: [8822],
                        characters: "≶"
                    },
                    "&lgE;": {
                        codepoints: [10897],
                        characters: "⪑"
                    },
                    "&lHar;": {
                        codepoints: [10594],
                        characters: "⥢"
                    },
                    "&lhard;": {
                        codepoints: [8637],
                        characters: "↽"
                    },
                    "&lharu;": {
                        codepoints: [8636],
                        characters: "↼"
                    },
                    "&lharul;": {
                        codepoints: [10602],
                        characters: "⥪"
                    },
                    "&lhblk;": {
                        codepoints: [9604],
                        characters: "▄"
                    },
                    "&LJcy;": {
                        codepoints: [1033],
                        characters: "Љ"
                    },
                    "&ljcy;": {
                        codepoints: [1113],
                        characters: "љ"
                    },
                    "&llarr;": {
                        codepoints: [8647],
                        characters: "⇇"
                    },
                    "&ll;": {
                        codepoints: [8810],
                        characters: "≪"
                    },
                    "&Ll;": {
                        codepoints: [8920],
                        characters: "⋘"
                    },
                    "&llcorner;": {
                        codepoints: [8990],
                        characters: "⌞"
                    },
                    "&Lleftarrow;": {
                        codepoints: [8666],
                        characters: "⇚"
                    },
                    "&llhard;": {
                        codepoints: [10603],
                        characters: "⥫"
                    },
                    "&lltri;": {
                        codepoints: [9722],
                        characters: "◺"
                    },
                    "&Lmidot;": {
                        codepoints: [319],
                        characters: "Ŀ"
                    },
                    "&lmidot;": {
                        codepoints: [320],
                        characters: "ŀ"
                    },
                    "&lmoustache;": {
                        codepoints: [9136],
                        characters: "⎰"
                    },
                    "&lmoust;": {
                        codepoints: [9136],
                        characters: "⎰"
                    },
                    "&lnap;": {
                        codepoints: [10889],
                        characters: "⪉"
                    },
                    "&lnapprox;": {
                        codepoints: [10889],
                        characters: "⪉"
                    },
                    "&lne;": {
                        codepoints: [10887],
                        characters: "⪇"
                    },
                    "&lnE;": {
                        codepoints: [8808],
                        characters: "≨"
                    },
                    "&lneq;": {
                        codepoints: [10887],
                        characters: "⪇"
                    },
                    "&lneqq;": {
                        codepoints: [8808],
                        characters: "≨"
                    },
                    "&lnsim;": {
                        codepoints: [8934],
                        characters: "⋦"
                    },
                    "&loang;": {
                        codepoints: [10220],
                        characters: "⟬"
                    },
                    "&loarr;": {
                        codepoints: [8701],
                        characters: "⇽"
                    },
                    "&lobrk;": {
                        codepoints: [10214],
                        characters: "⟦"
                    },
                    "&longleftarrow;": {
                        codepoints: [10229],
                        characters: "⟵"
                    },
                    "&LongLeftArrow;": {
                        codepoints: [10229],
                        characters: "⟵"
                    },
                    "&Longleftarrow;": {
                        codepoints: [10232],
                        characters: "⟸"
                    },
                    "&longleftrightarrow;": {
                        codepoints: [10231],
                        characters: "⟷"
                    },
                    "&LongLeftRightArrow;": {
                        codepoints: [10231],
                        characters: "⟷"
                    },
                    "&Longleftrightarrow;": {
                        codepoints: [10234],
                        characters: "⟺"
                    },
                    "&longmapsto;": {
                        codepoints: [10236],
                        characters: "⟼"
                    },
                    "&longrightarrow;": {
                        codepoints: [10230],
                        characters: "⟶"
                    },
                    "&LongRightArrow;": {
                        codepoints: [10230],
                        characters: "⟶"
                    },
                    "&Longrightarrow;": {
                        codepoints: [10233],
                        characters: "⟹"
                    },
                    "&looparrowleft;": {
                        codepoints: [8619],
                        characters: "↫"
                    },
                    "&looparrowright;": {
                        codepoints: [8620],
                        characters: "↬"
                    },
                    "&lopar;": {
                        codepoints: [10629],
                        characters: "⦅"
                    },
                    "&Lopf;": {
                        codepoints: [120131],
                        characters: "𝕃"
                    },
                    "&lopf;": {
                        codepoints: [120157],
                        characters: "𝕝"
                    },
                    "&loplus;": {
                        codepoints: [10797],
                        characters: "⨭"
                    },
                    "&lotimes;": {
                        codepoints: [10804],
                        characters: "⨴"
                    },
                    "&lowast;": {
                        codepoints: [8727],
                        characters: "∗"
                    },
                    "&lowbar;": {
                        codepoints: [95],
                        characters: "_"
                    },
                    "&LowerLeftArrow;": {
                        codepoints: [8601],
                        characters: "↙"
                    },
                    "&LowerRightArrow;": {
                        codepoints: [8600],
                        characters: "↘"
                    },
                    "&loz;": {
                        codepoints: [9674],
                        characters: "◊"
                    },
                    "&lozenge;": {
                        codepoints: [9674],
                        characters: "◊"
                    },
                    "&lozf;": {
                        codepoints: [10731],
                        characters: "⧫"
                    },
                    "&lpar;": {
                        codepoints: [40],
                        characters: "("
                    },
                    "&lparlt;": {
                        codepoints: [10643],
                        characters: "⦓"
                    },
                    "&lrarr;": {
                        codepoints: [8646],
                        characters: "⇆"
                    },
                    "&lrcorner;": {
                        codepoints: [8991],
                        characters: "⌟"
                    },
                    "&lrhar;": {
                        codepoints: [8651],
                        characters: "⇋"
                    },
                    "&lrhard;": {
                        codepoints: [10605],
                        characters: "⥭"
                    },
                    "&lrm;": {
                        codepoints: [8206],
                        characters: "‎"
                    },
                    "&lrtri;": {
                        codepoints: [8895],
                        characters: "⊿"
                    },
                    "&lsaquo;": {
                        codepoints: [8249],
                        characters: "‹"
                    },
                    "&lscr;": {
                        codepoints: [120001],
                        characters: "𝓁"
                    },
                    "&Lscr;": {
                        codepoints: [8466],
                        characters: "ℒ"
                    },
                    "&lsh;": {
                        codepoints: [8624],
                        characters: "↰"
                    },
                    "&Lsh;": {
                        codepoints: [8624],
                        characters: "↰"
                    },
                    "&lsim;": {
                        codepoints: [8818],
                        characters: "≲"
                    },
                    "&lsime;": {
                        codepoints: [10893],
                        characters: "⪍"
                    },
                    "&lsimg;": {
                        codepoints: [10895],
                        characters: "⪏"
                    },
                    "&lsqb;": {
                        codepoints: [91],
                        characters: "["
                    },
                    "&lsquo;": {
                        codepoints: [8216],
                        characters: "‘"
                    },
                    "&lsquor;": {
                        codepoints: [8218],
                        characters: "‚"
                    },
                    "&Lstrok;": {
                        codepoints: [321],
                        characters: "Ł"
                    },
                    "&lstrok;": {
                        codepoints: [322],
                        characters: "ł"
                    },
                    "&ltcc;": {
                        codepoints: [10918],
                        characters: "⪦"
                    },
                    "&ltcir;": {
                        codepoints: [10873],
                        characters: "⩹"
                    },
                    "&lt;": {
                        codepoints: [60],
                        characters: "<"
                    },
                    "&lt": {
                        codepoints: [60],
                        characters: "<"
                    },
                    "&LT;": {
                        codepoints: [60],
                        characters: "<"
                    },
                    "&LT": {
                        codepoints: [60],
                        characters: "<"
                    },
                    "&Lt;": {
                        codepoints: [8810],
                        characters: "≪"
                    },
                    "&ltdot;": {
                        codepoints: [8918],
                        characters: "⋖"
                    },
                    "&lthree;": {
                        codepoints: [8907],
                        characters: "⋋"
                    },
                    "&ltimes;": {
                        codepoints: [8905],
                        characters: "⋉"
                    },
                    "&ltlarr;": {
                        codepoints: [10614],
                        characters: "⥶"
                    },
                    "&ltquest;": {
                        codepoints: [10875],
                        characters: "⩻"
                    },
                    "&ltri;": {
                        codepoints: [9667],
                        characters: "◃"
                    },
                    "&ltrie;": {
                        codepoints: [8884],
                        characters: "⊴"
                    },
                    "&ltrif;": {
                        codepoints: [9666],
                        characters: "◂"
                    },
                    "&ltrPar;": {
                        codepoints: [10646],
                        characters: "⦖"
                    },
                    "&lurdshar;": {
                        codepoints: [10570],
                        characters: "⥊"
                    },
                    "&luruhar;": {
                        codepoints: [10598],
                        characters: "⥦"
                    },
                    "&lvertneqq;": {
                        codepoints: [8808, 65024],
                        characters: "≨︀"
                    },
                    "&lvnE;": {
                        codepoints: [8808, 65024],
                        characters: "≨︀"
                    },
                    "&macr;": {
                        codepoints: [175],
                        characters: "¯"
                    },
                    "&macr": {
                        codepoints: [175],
                        characters: "¯"
                    },
                    "&male;": {
                        codepoints: [9794],
                        characters: "♂"
                    },
                    "&malt;": {
                        codepoints: [10016],
                        characters: "✠"
                    },
                    "&maltese;": {
                        codepoints: [10016],
                        characters: "✠"
                    },
                    "&Map;": {
                        codepoints: [10501],
                        characters: "⤅"
                    },
                    "&map;": {
                        codepoints: [8614],
                        characters: "↦"
                    },
                    "&mapsto;": {
                        codepoints: [8614],
                        characters: "↦"
                    },
                    "&mapstodown;": {
                        codepoints: [8615],
                        characters: "↧"
                    },
                    "&mapstoleft;": {
                        codepoints: [8612],
                        characters: "↤"
                    },
                    "&mapstoup;": {
                        codepoints: [8613],
                        characters: "↥"
                    },
                    "&marker;": {
                        codepoints: [9646],
                        characters: "▮"
                    },
                    "&mcomma;": {
                        codepoints: [10793],
                        characters: "⨩"
                    },
                    "&Mcy;": {
                        codepoints: [1052],
                        characters: "М"
                    },
                    "&mcy;": {
                        codepoints: [1084],
                        characters: "м"
                    },
                    "&mdash;": {
                        codepoints: [8212],
                        characters: "—"
                    },
                    "&mDDot;": {
                        codepoints: [8762],
                        characters: "∺"
                    },
                    "&measuredangle;": {
                        codepoints: [8737],
                        characters: "∡"
                    },
                    "&MediumSpace;": {
                        codepoints: [8287],
                        characters: " "
                    },
                    "&Mellintrf;": {
                        codepoints: [8499],
                        characters: "ℳ"
                    },
                    "&Mfr;": {
                        codepoints: [120080],
                        characters: "𝔐"
                    },
                    "&mfr;": {
                        codepoints: [120106],
                        characters: "𝔪"
                    },
                    "&mho;": {
                        codepoints: [8487],
                        characters: "℧"
                    },
                    "&micro;": {
                        codepoints: [181],
                        characters: "µ"
                    },
                    "&micro": {
                        codepoints: [181],
                        characters: "µ"
                    },
                    "&midast;": {
                        codepoints: [42],
                        characters: "*"
                    },
                    "&midcir;": {
                        codepoints: [10992],
                        characters: "⫰"
                    },
                    "&mid;": {
                        codepoints: [8739],
                        characters: "∣"
                    },
                    "&middot;": {
                        codepoints: [183],
                        characters: "·"
                    },
                    "&middot": {
                        codepoints: [183],
                        characters: "·"
                    },
                    "&minusb;": {
                        codepoints: [8863],
                        characters: "⊟"
                    },
                    "&minus;": {
                        codepoints: [8722],
                        characters: "−"
                    },
                    "&minusd;": {
                        codepoints: [8760],
                        characters: "∸"
                    },
                    "&minusdu;": {
                        codepoints: [10794],
                        characters: "⨪"
                    },
                    "&MinusPlus;": {
                        codepoints: [8723],
                        characters: "∓"
                    },
                    "&mlcp;": {
                        codepoints: [10971],
                        characters: "⫛"
                    },
                    "&mldr;": {
                        codepoints: [8230],
                        characters: "…"
                    },
                    "&mnplus;": {
                        codepoints: [8723],
                        characters: "∓"
                    },
                    "&models;": {
                        codepoints: [8871],
                        characters: "⊧"
                    },
                    "&Mopf;": {
                        codepoints: [120132],
                        characters: "𝕄"
                    },
                    "&mopf;": {
                        codepoints: [120158],
                        characters: "𝕞"
                    },
                    "&mp;": {
                        codepoints: [8723],
                        characters: "∓"
                    },
                    "&mscr;": {
                        codepoints: [120002],
                        characters: "𝓂"
                    },
                    "&Mscr;": {
                        codepoints: [8499],
                        characters: "ℳ"
                    },
                    "&mstpos;": {
                        codepoints: [8766],
                        characters: "∾"
                    },
                    "&Mu;": {
                        codepoints: [924],
                        characters: "Μ"
                    },
                    "&mu;": {
                        codepoints: [956],
                        characters: "μ"
                    },
                    "&multimap;": {
                        codepoints: [8888],
                        characters: "⊸"
                    },
                    "&mumap;": {
                        codepoints: [8888],
                        characters: "⊸"
                    },
                    "&nabla;": {
                        codepoints: [8711],
                        characters: "∇"
                    },
                    "&Nacute;": {
                        codepoints: [323],
                        characters: "Ń"
                    },
                    "&nacute;": {
                        codepoints: [324],
                        characters: "ń"
                    },
                    "&nang;": {
                        codepoints: [8736, 8402],
                        characters: "∠⃒"
                    },
                    "&nap;": {
                        codepoints: [8777],
                        characters: "≉"
                    },
                    "&napE;": {
                        codepoints: [10864, 824],
                        characters: "⩰̸"
                    },
                    "&napid;": {
                        codepoints: [8779, 824],
                        characters: "≋̸"
                    },
                    "&napos;": {
                        codepoints: [329],
                        characters: "ŉ"
                    },
                    "&napprox;": {
                        codepoints: [8777],
                        characters: "≉"
                    },
                    "&natural;": {
                        codepoints: [9838],
                        characters: "♮"
                    },
                    "&naturals;": {
                        codepoints: [8469],
                        characters: "ℕ"
                    },
                    "&natur;": {
                        codepoints: [9838],
                        characters: "♮"
                    },
                    "&nbsp;": {
                        codepoints: [160],
                        characters: " "
                    },
                    "&nbsp": {
                        codepoints: [160],
                        characters: " "
                    },
                    "&nbump;": {
                        codepoints: [8782, 824],
                        characters: "≎̸"
                    },
                    "&nbumpe;": {
                        codepoints: [8783, 824],
                        characters: "≏̸"
                    },
                    "&ncap;": {
                        codepoints: [10819],
                        characters: "⩃"
                    },
                    "&Ncaron;": {
                        codepoints: [327],
                        characters: "Ň"
                    },
                    "&ncaron;": {
                        codepoints: [328],
                        characters: "ň"
                    },
                    "&Ncedil;": {
                        codepoints: [325],
                        characters: "Ņ"
                    },
                    "&ncedil;": {
                        codepoints: [326],
                        characters: "ņ"
                    },
                    "&ncong;": {
                        codepoints: [8775],
                        characters: "≇"
                    },
                    "&ncongdot;": {
                        codepoints: [10861, 824],
                        characters: "⩭̸"
                    },
                    "&ncup;": {
                        codepoints: [10818],
                        characters: "⩂"
                    },
                    "&Ncy;": {
                        codepoints: [1053],
                        characters: "Н"
                    },
                    "&ncy;": {
                        codepoints: [1085],
                        characters: "н"
                    },
                    "&ndash;": {
                        codepoints: [8211],
                        characters: "–"
                    },
                    "&nearhk;": {
                        codepoints: [10532],
                        characters: "⤤"
                    },
                    "&nearr;": {
                        codepoints: [8599],
                        characters: "↗"
                    },
                    "&neArr;": {
                        codepoints: [8663],
                        characters: "⇗"
                    },
                    "&nearrow;": {
                        codepoints: [8599],
                        characters: "↗"
                    },
                    "&ne;": {
                        codepoints: [8800],
                        characters: "≠"
                    },
                    "&nedot;": {
                        codepoints: [8784, 824],
                        characters: "≐̸"
                    },
                    "&NegativeMediumSpace;": {
                        codepoints: [8203],
                        characters: "​"
                    },
                    "&NegativeThickSpace;": {
                        codepoints: [8203],
                        characters: "​"
                    },
                    "&NegativeThinSpace;": {
                        codepoints: [8203],
                        characters: "​"
                    },
                    "&NegativeVeryThinSpace;": {
                        codepoints: [8203],
                        characters: "​"
                    },
                    "&nequiv;": {
                        codepoints: [8802],
                        characters: "≢"
                    },
                    "&nesear;": {
                        codepoints: [10536],
                        characters: "⤨"
                    },
                    "&nesim;": {
                        codepoints: [8770, 824],
                        characters: "≂̸"
                    },
                    "&NestedGreaterGreater;": {
                        codepoints: [8811],
                        characters: "≫"
                    },
                    "&NestedLessLess;": {
                        codepoints: [8810],
                        characters: "≪"
                    },
                    "&NewLine;": {
                        codepoints: [10],
                        characters: "\n"
                    },
                    "&nexist;": {
                        codepoints: [8708],
                        characters: "∄"
                    },
                    "&nexists;": {
                        codepoints: [8708],
                        characters: "∄"
                    },
                    "&Nfr;": {
                        codepoints: [120081],
                        characters: "𝔑"
                    },
                    "&nfr;": {
                        codepoints: [120107],
                        characters: "𝔫"
                    },
                    "&ngE;": {
                        codepoints: [8807, 824],
                        characters: "≧̸"
                    },
                    "&nge;": {
                        codepoints: [8817],
                        characters: "≱"
                    },
                    "&ngeq;": {
                        codepoints: [8817],
                        characters: "≱"
                    },
                    "&ngeqq;": {
                        codepoints: [8807, 824],
                        characters: "≧̸"
                    },
                    "&ngeqslant;": {
                        codepoints: [10878, 824],
                        characters: "⩾̸"
                    },
                    "&nges;": {
                        codepoints: [10878, 824],
                        characters: "⩾̸"
                    },
                    "&nGg;": {
                        codepoints: [8921, 824],
                        characters: "⋙̸"
                    },
                    "&ngsim;": {
                        codepoints: [8821],
                        characters: "≵"
                    },
                    "&nGt;": {
                        codepoints: [8811, 8402],
                        characters: "≫⃒"
                    },
                    "&ngt;": {
                        codepoints: [8815],
                        characters: "≯"
                    },
                    "&ngtr;": {
                        codepoints: [8815],
                        characters: "≯"
                    },
                    "&nGtv;": {
                        codepoints: [8811, 824],
                        characters: "≫̸"
                    },
                    "&nharr;": {
                        codepoints: [8622],
                        characters: "↮"
                    },
                    "&nhArr;": {
                        codepoints: [8654],
                        characters: "⇎"
                    },
                    "&nhpar;": {
                        codepoints: [10994],
                        characters: "⫲"
                    },
                    "&ni;": {
                        codepoints: [8715],
                        characters: "∋"
                    },
                    "&nis;": {
                        codepoints: [8956],
                        characters: "⋼"
                    },
                    "&nisd;": {
                        codepoints: [8954],
                        characters: "⋺"
                    },
                    "&niv;": {
                        codepoints: [8715],
                        characters: "∋"
                    },
                    "&NJcy;": {
                        codepoints: [1034],
                        characters: "Њ"
                    },
                    "&njcy;": {
                        codepoints: [1114],
                        characters: "њ"
                    },
                    "&nlarr;": {
                        codepoints: [8602],
                        characters: "↚"
                    },
                    "&nlArr;": {
                        codepoints: [8653],
                        characters: "⇍"
                    },
                    "&nldr;": {
                        codepoints: [8229],
                        characters: "‥"
                    },
                    "&nlE;": {
                        codepoints: [8806, 824],
                        characters: "≦̸"
                    },
                    "&nle;": {
                        codepoints: [8816],
                        characters: "≰"
                    },
                    "&nleftarrow;": {
                        codepoints: [8602],
                        characters: "↚"
                    },
                    "&nLeftarrow;": {
                        codepoints: [8653],
                        characters: "⇍"
                    },
                    "&nleftrightarrow;": {
                        codepoints: [8622],
                        characters: "↮"
                    },
                    "&nLeftrightarrow;": {
                        codepoints: [8654],
                        characters: "⇎"
                    },
                    "&nleq;": {
                        codepoints: [8816],
                        characters: "≰"
                    },
                    "&nleqq;": {
                        codepoints: [8806, 824],
                        characters: "≦̸"
                    },
                    "&nleqslant;": {
                        codepoints: [10877, 824],
                        characters: "⩽̸"
                    },
                    "&nles;": {
                        codepoints: [10877, 824],
                        characters: "⩽̸"
                    },
                    "&nless;": {
                        codepoints: [8814],
                        characters: "≮"
                    },
                    "&nLl;": {
                        codepoints: [8920, 824],
                        characters: "⋘̸"
                    },
                    "&nlsim;": {
                        codepoints: [8820],
                        characters: "≴"
                    },
                    "&nLt;": {
                        codepoints: [8810, 8402],
                        characters: "≪⃒"
                    },
                    "&nlt;": {
                        codepoints: [8814],
                        characters: "≮"
                    },
                    "&nltri;": {
                        codepoints: [8938],
                        characters: "⋪"
                    },
                    "&nltrie;": {
                        codepoints: [8940],
                        characters: "⋬"
                    },
                    "&nLtv;": {
                        codepoints: [8810, 824],
                        characters: "≪̸"
                    },
                    "&nmid;": {
                        codepoints: [8740],
                        characters: "∤"
                    },
                    "&NoBreak;": {
                        codepoints: [8288],
                        characters: "⁠"
                    },
                    "&NonBreakingSpace;": {
                        codepoints: [160],
                        characters: " "
                    },
                    "&nopf;": {
                        codepoints: [120159],
                        characters: "𝕟"
                    },
                    "&Nopf;": {
                        codepoints: [8469],
                        characters: "ℕ"
                    },
                    "&Not;": {
                        codepoints: [10988],
                        characters: "⫬"
                    },
                    "&not;": {
                        codepoints: [172],
                        characters: "¬"
                    },
                    "&not": {
                        codepoints: [172],
                        characters: "¬"
                    },
                    "&NotCongruent;": {
                        codepoints: [8802],
                        characters: "≢"
                    },
                    "&NotCupCap;": {
                        codepoints: [8813],
                        characters: "≭"
                    },
                    "&NotDoubleVerticalBar;": {
                        codepoints: [8742],
                        characters: "∦"
                    },
                    "&NotElement;": {
                        codepoints: [8713],
                        characters: "∉"
                    },
                    "&NotEqual;": {
                        codepoints: [8800],
                        characters: "≠"
                    },
                    "&NotEqualTilde;": {
                        codepoints: [8770, 824],
                        characters: "≂̸"
                    },
                    "&NotExists;": {
                        codepoints: [8708],
                        characters: "∄"
                    },
                    "&NotGreater;": {
                        codepoints: [8815],
                        characters: "≯"
                    },
                    "&NotGreaterEqual;": {
                        codepoints: [8817],
                        characters: "≱"
                    },
                    "&NotGreaterFullEqual;": {
                        codepoints: [8807, 824],
                        characters: "≧̸"
                    },
                    "&NotGreaterGreater;": {
                        codepoints: [8811, 824],
                        characters: "≫̸"
                    },
                    "&NotGreaterLess;": {
                        codepoints: [8825],
                        characters: "≹"
                    },
                    "&NotGreaterSlantEqual;": {
                        codepoints: [10878, 824],
                        characters: "⩾̸"
                    },
                    "&NotGreaterTilde;": {
                        codepoints: [8821],
                        characters: "≵"
                    },
                    "&NotHumpDownHump;": {
                        codepoints: [8782, 824],
                        characters: "≎̸"
                    },
                    "&NotHumpEqual;": {
                        codepoints: [8783, 824],
                        characters: "≏̸"
                    },
                    "&notin;": {
                        codepoints: [8713],
                        characters: "∉"
                    },
                    "&notindot;": {
                        codepoints: [8949, 824],
                        characters: "⋵̸"
                    },
                    "&notinE;": {
                        codepoints: [8953, 824],
                        characters: "⋹̸"
                    },
                    "&notinva;": {
                        codepoints: [8713],
                        characters: "∉"
                    },
                    "&notinvb;": {
                        codepoints: [8951],
                        characters: "⋷"
                    },
                    "&notinvc;": {
                        codepoints: [8950],
                        characters: "⋶"
                    },
                    "&NotLeftTriangleBar;": {
                        codepoints: [10703, 824],
                        characters: "⧏̸"
                    },
                    "&NotLeftTriangle;": {
                        codepoints: [8938],
                        characters: "⋪"
                    },
                    "&NotLeftTriangleEqual;": {
                        codepoints: [8940],
                        characters: "⋬"
                    },
                    "&NotLess;": {
                        codepoints: [8814],
                        characters: "≮"
                    },
                    "&NotLessEqual;": {
                        codepoints: [8816],
                        characters: "≰"
                    },
                    "&NotLessGreater;": {
                        codepoints: [8824],
                        characters: "≸"
                    },
                    "&NotLessLess;": {
                        codepoints: [8810, 824],
                        characters: "≪̸"
                    },
                    "&NotLessSlantEqual;": {
                        codepoints: [10877, 824],
                        characters: "⩽̸"
                    },
                    "&NotLessTilde;": {
                        codepoints: [8820],
                        characters: "≴"
                    },
                    "&NotNestedGreaterGreater;": {
                        codepoints: [10914, 824],
                        characters: "⪢̸"
                    },
                    "&NotNestedLessLess;": {
                        codepoints: [10913, 824],
                        characters: "⪡̸"
                    },
                    "&notni;": {
                        codepoints: [8716],
                        characters: "∌"
                    },
                    "&notniva;": {
                        codepoints: [8716],
                        characters: "∌"
                    },
                    "&notnivb;": {
                        codepoints: [8958],
                        characters: "⋾"
                    },
                    "&notnivc;": {
                        codepoints: [8957],
                        characters: "⋽"
                    },
                    "&NotPrecedes;": {
                        codepoints: [8832],
                        characters: "⊀"
                    },
                    "&NotPrecedesEqual;": {
                        codepoints: [10927, 824],
                        characters: "⪯̸"
                    },
                    "&NotPrecedesSlantEqual;": {
                        codepoints: [8928],
                        characters: "⋠"
                    },
                    "&NotReverseElement;": {
                        codepoints: [8716],
                        characters: "∌"
                    },
                    "&NotRightTriangleBar;": {
                        codepoints: [10704, 824],
                        characters: "⧐̸"
                    },
                    "&NotRightTriangle;": {
                        codepoints: [8939],
                        characters: "⋫"
                    },
                    "&NotRightTriangleEqual;": {
                        codepoints: [8941],
                        characters: "⋭"
                    },
                    "&NotSquareSubset;": {
                        codepoints: [8847, 824],
                        characters: "⊏̸"
                    },
                    "&NotSquareSubsetEqual;": {
                        codepoints: [8930],
                        characters: "⋢"
                    },
                    "&NotSquareSuperset;": {
                        codepoints: [8848, 824],
                        characters: "⊐̸"
                    },
                    "&NotSquareSupersetEqual;": {
                        codepoints: [8931],
                        characters: "⋣"
                    },
                    "&NotSubset;": {
                        codepoints: [8834, 8402],
                        characters: "⊂⃒"
                    },
                    "&NotSubsetEqual;": {
                        codepoints: [8840],
                        characters: "⊈"
                    },
                    "&NotSucceeds;": {
                        codepoints: [8833],
                        characters: "⊁"
                    },
                    "&NotSucceedsEqual;": {
                        codepoints: [10928, 824],
                        characters: "⪰̸"
                    },
                    "&NotSucceedsSlantEqual;": {
                        codepoints: [8929],
                        characters: "⋡"
                    },
                    "&NotSucceedsTilde;": {
                        codepoints: [8831, 824],
                        characters: "≿̸"
                    },
                    "&NotSuperset;": {
                        codepoints: [8835, 8402],
                        characters: "⊃⃒"
                    },
                    "&NotSupersetEqual;": {
                        codepoints: [8841],
                        characters: "⊉"
                    },
                    "&NotTilde;": {
                        codepoints: [8769],
                        characters: "≁"
                    },
                    "&NotTildeEqual;": {
                        codepoints: [8772],
                        characters: "≄"
                    },
                    "&NotTildeFullEqual;": {
                        codepoints: [8775],
                        characters: "≇"
                    },
                    "&NotTildeTilde;": {
                        codepoints: [8777],
                        characters: "≉"
                    },
                    "&NotVerticalBar;": {
                        codepoints: [8740],
                        characters: "∤"
                    },
                    "&nparallel;": {
                        codepoints: [8742],
                        characters: "∦"
                    },
                    "&npar;": {
                        codepoints: [8742],
                        characters: "∦"
                    },
                    "&nparsl;": {
                        codepoints: [11005, 8421],
                        characters: "⫽⃥"
                    },
                    "&npart;": {
                        codepoints: [8706, 824],
                        characters: "∂̸"
                    },
                    "&npolint;": {
                        codepoints: [10772],
                        characters: "⨔"
                    },
                    "&npr;": {
                        codepoints: [8832],
                        characters: "⊀"
                    },
                    "&nprcue;": {
                        codepoints: [8928],
                        characters: "⋠"
                    },
                    "&nprec;": {
                        codepoints: [8832],
                        characters: "⊀"
                    },
                    "&npreceq;": {
                        codepoints: [10927, 824],
                        characters: "⪯̸"
                    },
                    "&npre;": {
                        codepoints: [10927, 824],
                        characters: "⪯̸"
                    },
                    "&nrarrc;": {
                        codepoints: [10547, 824],
                        characters: "⤳̸"
                    },
                    "&nrarr;": {
                        codepoints: [8603],
                        characters: "↛"
                    },
                    "&nrArr;": {
                        codepoints: [8655],
                        characters: "⇏"
                    },
                    "&nrarrw;": {
                        codepoints: [8605, 824],
                        characters: "↝̸"
                    },
                    "&nrightarrow;": {
                        codepoints: [8603],
                        characters: "↛"
                    },
                    "&nRightarrow;": {
                        codepoints: [8655],
                        characters: "⇏"
                    },
                    "&nrtri;": {
                        codepoints: [8939],
                        characters: "⋫"
                    },
                    "&nrtrie;": {
                        codepoints: [8941],
                        characters: "⋭"
                    },
                    "&nsc;": {
                        codepoints: [8833],
                        characters: "⊁"
                    },
                    "&nsccue;": {
                        codepoints: [8929],
                        characters: "⋡"
                    },
                    "&nsce;": {
                        codepoints: [10928, 824],
                        characters: "⪰̸"
                    },
                    "&Nscr;": {
                        codepoints: [119977],
                        characters: "𝒩"
                    },
                    "&nscr;": {
                        codepoints: [120003],
                        characters: "𝓃"
                    },
                    "&nshortmid;": {
                        codepoints: [8740],
                        characters: "∤"
                    },
                    "&nshortparallel;": {
                        codepoints: [8742],
                        characters: "∦"
                    },
                    "&nsim;": {
                        codepoints: [8769],
                        characters: "≁"
                    },
                    "&nsime;": {
                        codepoints: [8772],
                        characters: "≄"
                    },
                    "&nsimeq;": {
                        codepoints: [8772],
                        characters: "≄"
                    },
                    "&nsmid;": {
                        codepoints: [8740],
                        characters: "∤"
                    },
                    "&nspar;": {
                        codepoints: [8742],
                        characters: "∦"
                    },
                    "&nsqsube;": {
                        codepoints: [8930],
                        characters: "⋢"
                    },
                    "&nsqsupe;": {
                        codepoints: [8931],
                        characters: "⋣"
                    },
                    "&nsub;": {
                        codepoints: [8836],
                        characters: "⊄"
                    },
                    "&nsubE;": {
                        codepoints: [10949, 824],
                        characters: "⫅̸"
                    },
                    "&nsube;": {
                        codepoints: [8840],
                        characters: "⊈"
                    },
                    "&nsubset;": {
                        codepoints: [8834, 8402],
                        characters: "⊂⃒"
                    },
                    "&nsubseteq;": {
                        codepoints: [8840],
                        characters: "⊈"
                    },
                    "&nsubseteqq;": {
                        codepoints: [10949, 824],
                        characters: "⫅̸"
                    },
                    "&nsucc;": {
                        codepoints: [8833],
                        characters: "⊁"
                    },
                    "&nsucceq;": {
                        codepoints: [10928, 824],
                        characters: "⪰̸"
                    },
                    "&nsup;": {
                        codepoints: [8837],
                        characters: "⊅"
                    },
                    "&nsupE;": {
                        codepoints: [10950, 824],
                        characters: "⫆̸"
                    },
                    "&nsupe;": {
                        codepoints: [8841],
                        characters: "⊉"
                    },
                    "&nsupset;": {
                        codepoints: [8835, 8402],
                        characters: "⊃⃒"
                    },
                    "&nsupseteq;": {
                        codepoints: [8841],
                        characters: "⊉"
                    },
                    "&nsupseteqq;": {
                        codepoints: [10950, 824],
                        characters: "⫆̸"
                    },
                    "&ntgl;": {
                        codepoints: [8825],
                        characters: "≹"
                    },
                    "&Ntilde;": {
                        codepoints: [209],
                        characters: "Ñ"
                    },
                    "&Ntilde": {
                        codepoints: [209],
                        characters: "Ñ"
                    },
                    "&ntilde;": {
                        codepoints: [241],
                        characters: "ñ"
                    },
                    "&ntilde": {
                        codepoints: [241],
                        characters: "ñ"
                    },
                    "&ntlg;": {
                        codepoints: [8824],
                        characters: "≸"
                    },
                    "&ntriangleleft;": {
                        codepoints: [8938],
                        characters: "⋪"
                    },
                    "&ntrianglelefteq;": {
                        codepoints: [8940],
                        characters: "⋬"
                    },
                    "&ntriangleright;": {
                        codepoints: [8939],
                        characters: "⋫"
                    },
                    "&ntrianglerighteq;": {
                        codepoints: [8941],
                        characters: "⋭"
                    },
                    "&Nu;": {
                        codepoints: [925],
                        characters: "Ν"
                    },
                    "&nu;": {
                        codepoints: [957],
                        characters: "ν"
                    },
                    "&num;": {
                        codepoints: [35],
                        characters: "#"
                    },
                    "&numero;": {
                        codepoints: [8470],
                        characters: "№"
                    },
                    "&numsp;": {
                        codepoints: [8199],
                        characters: " "
                    },
                    "&nvap;": {
                        codepoints: [8781, 8402],
                        characters: "≍⃒"
                    },
                    "&nvdash;": {
                        codepoints: [8876],
                        characters: "⊬"
                    },
                    "&nvDash;": {
                        codepoints: [8877],
                        characters: "⊭"
                    },
                    "&nVdash;": {
                        codepoints: [8878],
                        characters: "⊮"
                    },
                    "&nVDash;": {
                        codepoints: [8879],
                        characters: "⊯"
                    },
                    "&nvge;": {
                        codepoints: [8805, 8402],
                        characters: "≥⃒"
                    },
                    "&nvgt;": {
                        codepoints: [62, 8402],
                        characters: ">⃒"
                    },
                    "&nvHarr;": {
                        codepoints: [10500],
                        characters: "⤄"
                    },
                    "&nvinfin;": {
                        codepoints: [10718],
                        characters: "⧞"
                    },
                    "&nvlArr;": {
                        codepoints: [10498],
                        characters: "⤂"
                    },
                    "&nvle;": {
                        codepoints: [8804, 8402],
                        characters: "≤⃒"
                    },
                    "&nvlt;": {
                        codepoints: [60, 8402],
                        characters: "<⃒"
                    },
                    "&nvltrie;": {
                        codepoints: [8884, 8402],
                        characters: "⊴⃒"
                    },
                    "&nvrArr;": {
                        codepoints: [10499],
                        characters: "⤃"
                    },
                    "&nvrtrie;": {
                        codepoints: [8885, 8402],
                        characters: "⊵⃒"
                    },
                    "&nvsim;": {
                        codepoints: [8764, 8402],
                        characters: "∼⃒"
                    },
                    "&nwarhk;": {
                        codepoints: [10531],
                        characters: "⤣"
                    },
                    "&nwarr;": {
                        codepoints: [8598],
                        characters: "↖"
                    },
                    "&nwArr;": {
                        codepoints: [8662],
                        characters: "⇖"
                    },
                    "&nwarrow;": {
                        codepoints: [8598],
                        characters: "↖"
                    },
                    "&nwnear;": {
                        codepoints: [10535],
                        characters: "⤧"
                    },
                    "&Oacute;": {
                        codepoints: [211],
                        characters: "Ó"
                    },
                    "&Oacute": {
                        codepoints: [211],
                        characters: "Ó"
                    },
                    "&oacute;": {
                        codepoints: [243],
                        characters: "ó"
                    },
                    "&oacute": {
                        codepoints: [243],
                        characters: "ó"
                    },
                    "&oast;": {
                        codepoints: [8859],
                        characters: "⊛"
                    },
                    "&Ocirc;": {
                        codepoints: [212],
                        characters: "Ô"
                    },
                    "&Ocirc": {
                        codepoints: [212],
                        characters: "Ô"
                    },
                    "&ocirc;": {
                        codepoints: [244],
                        characters: "ô"
                    },
                    "&ocirc": {
                        codepoints: [244],
                        characters: "ô"
                    },
                    "&ocir;": {
                        codepoints: [8858],
                        characters: "⊚"
                    },
                    "&Ocy;": {
                        codepoints: [1054],
                        characters: "О"
                    },
                    "&ocy;": {
                        codepoints: [1086],
                        characters: "о"
                    },
                    "&odash;": {
                        codepoints: [8861],
                        characters: "⊝"
                    },
                    "&Odblac;": {
                        codepoints: [336],
                        characters: "Ő"
                    },
                    "&odblac;": {
                        codepoints: [337],
                        characters: "ő"
                    },
                    "&odiv;": {
                        codepoints: [10808],
                        characters: "⨸"
                    },
                    "&odot;": {
                        codepoints: [8857],
                        characters: "⊙"
                    },
                    "&odsold;": {
                        codepoints: [10684],
                        characters: "⦼"
                    },
                    "&OElig;": {
                        codepoints: [338],
                        characters: "Œ"
                    },
                    "&oelig;": {
                        codepoints: [339],
                        characters: "œ"
                    },
                    "&ofcir;": {
                        codepoints: [10687],
                        characters: "⦿"
                    },
                    "&Ofr;": {
                        codepoints: [120082],
                        characters: "𝔒"
                    },
                    "&ofr;": {
                        codepoints: [120108],
                        characters: "𝔬"
                    },
                    "&ogon;": {
                        codepoints: [731],
                        characters: "˛"
                    },
                    "&Ograve;": {
                        codepoints: [210],
                        characters: "Ò"
                    },
                    "&Ograve": {
                        codepoints: [210],
                        characters: "Ò"
                    },
                    "&ograve;": {
                        codepoints: [242],
                        characters: "ò"
                    },
                    "&ograve": {
                        codepoints: [242],
                        characters: "ò"
                    },
                    "&ogt;": {
                        codepoints: [10689],
                        characters: "⧁"
                    },
                    "&ohbar;": {
                        codepoints: [10677],
                        characters: "⦵"
                    },
                    "&ohm;": {
                        codepoints: [937],
                        characters: "Ω"
                    },
                    "&oint;": {
                        codepoints: [8750],
                        characters: "∮"
                    },
                    "&olarr;": {
                        codepoints: [8634],
                        characters: "↺"
                    },
                    "&olcir;": {
                        codepoints: [10686],
                        characters: "⦾"
                    },
                    "&olcross;": {
                        codepoints: [10683],
                        characters: "⦻"
                    },
                    "&oline;": {
                        codepoints: [8254],
                        characters: "‾"
                    },
                    "&olt;": {
                        codepoints: [10688],
                        characters: "⧀"
                    },
                    "&Omacr;": {
                        codepoints: [332],
                        characters: "Ō"
                    },
                    "&omacr;": {
                        codepoints: [333],
                        characters: "ō"
                    },
                    "&Omega;": {
                        codepoints: [937],
                        characters: "Ω"
                    },
                    "&omega;": {
                        codepoints: [969],
                        characters: "ω"
                    },
                    "&Omicron;": {
                        codepoints: [927],
                        characters: "Ο"
                    },
                    "&omicron;": {
                        codepoints: [959],
                        characters: "ο"
                    },
                    "&omid;": {
                        codepoints: [10678],
                        characters: "⦶"
                    },
                    "&ominus;": {
                        codepoints: [8854],
                        characters: "⊖"
                    },
                    "&Oopf;": {
                        codepoints: [120134],
                        characters: "𝕆"
                    },
                    "&oopf;": {
                        codepoints: [120160],
                        characters: "𝕠"
                    },
                    "&opar;": {
                        codepoints: [10679],
                        characters: "⦷"
                    },
                    "&OpenCurlyDoubleQuote;": {
                        codepoints: [8220],
                        characters: "“"
                    },
                    "&OpenCurlyQuote;": {
                        codepoints: [8216],
                        characters: "‘"
                    },
                    "&operp;": {
                        codepoints: [10681],
                        characters: "⦹"
                    },
                    "&oplus;": {
                        codepoints: [8853],
                        characters: "⊕"
                    },
                    "&orarr;": {
                        codepoints: [8635],
                        characters: "↻"
                    },
                    "&Or;": {
                        codepoints: [10836],
                        characters: "⩔"
                    },
                    "&or;": {
                        codepoints: [8744],
                        characters: "∨"
                    },
                    "&ord;": {
                        codepoints: [10845],
                        characters: "⩝"
                    },
                    "&order;": {
                        codepoints: [8500],
                        characters: "ℴ"
                    },
                    "&orderof;": {
                        codepoints: [8500],
                        characters: "ℴ"
                    },
                    "&ordf;": {
                        codepoints: [170],
                        characters: "ª"
                    },
                    "&ordf": {
                        codepoints: [170],
                        characters: "ª"
                    },
                    "&ordm;": {
                        codepoints: [186],
                        characters: "º"
                    },
                    "&ordm": {
                        codepoints: [186],
                        characters: "º"
                    },
                    "&origof;": {
                        codepoints: [8886],
                        characters: "⊶"
                    },
                    "&oror;": {
                        codepoints: [10838],
                        characters: "⩖"
                    },
                    "&orslope;": {
                        codepoints: [10839],
                        characters: "⩗"
                    },
                    "&orv;": {
                        codepoints: [10843],
                        characters: "⩛"
                    },
                    "&oS;": {
                        codepoints: [9416],
                        characters: "Ⓢ"
                    },
                    "&Oscr;": {
                        codepoints: [119978],
                        characters: "𝒪"
                    },
                    "&oscr;": {
                        codepoints: [8500],
                        characters: "ℴ"
                    },
                    "&Oslash;": {
                        codepoints: [216],
                        characters: "Ø"
                    },
                    "&Oslash": {
                        codepoints: [216],
                        characters: "Ø"
                    },
                    "&oslash;": {
                        codepoints: [248],
                        characters: "ø"
                    },
                    "&oslash": {
                        codepoints: [248],
                        characters: "ø"
                    },
                    "&osol;": {
                        codepoints: [8856],
                        characters: "⊘"
                    },
                    "&Otilde;": {
                        codepoints: [213],
                        characters: "Õ"
                    },
                    "&Otilde": {
                        codepoints: [213],
                        characters: "Õ"
                    },
                    "&otilde;": {
                        codepoints: [245],
                        characters: "õ"
                    },
                    "&otilde": {
                        codepoints: [245],
                        characters: "õ"
                    },
                    "&otimesas;": {
                        codepoints: [10806],
                        characters: "⨶"
                    },
                    "&Otimes;": {
                        codepoints: [10807],
                        characters: "⨷"
                    },
                    "&otimes;": {
                        codepoints: [8855],
                        characters: "⊗"
                    },
                    "&Ouml;": {
                        codepoints: [214],
                        characters: "Ö"
                    },
                    "&Ouml": {
                        codepoints: [214],
                        characters: "Ö"
                    },
                    "&ouml;": {
                        codepoints: [246],
                        characters: "ö"
                    },
                    "&ouml": {
                        codepoints: [246],
                        characters: "ö"
                    },
                    "&ovbar;": {
                        codepoints: [9021],
                        characters: "⌽"
                    },
                    "&OverBar;": {
                        codepoints: [8254],
                        characters: "‾"
                    },
                    "&OverBrace;": {
                        codepoints: [9182],
                        characters: "⏞"
                    },
                    "&OverBracket;": {
                        codepoints: [9140],
                        characters: "⎴"
                    },
                    "&OverParenthesis;": {
                        codepoints: [9180],
                        characters: "⏜"
                    },
                    "&para;": {
                        codepoints: [182],
                        characters: "¶"
                    },
                    "&para": {
                        codepoints: [182],
                        characters: "¶"
                    },
                    "&parallel;": {
                        codepoints: [8741],
                        characters: "∥"
                    },
                    "&par;": {
                        codepoints: [8741],
                        characters: "∥"
                    },
                    "&parsim;": {
                        codepoints: [10995],
                        characters: "⫳"
                    },
                    "&parsl;": {
                        codepoints: [11005],
                        characters: "⫽"
                    },
                    "&part;": {
                        codepoints: [8706],
                        characters: "∂"
                    },
                    "&PartialD;": {
                        codepoints: [8706],
                        characters: "∂"
                    },
                    "&Pcy;": {
                        codepoints: [1055],
                        characters: "П"
                    },
                    "&pcy;": {
                        codepoints: [1087],
                        characters: "п"
                    },
                    "&percnt;": {
                        codepoints: [37],
                        characters: "%"
                    },
                    "&period;": {
                        codepoints: [46],
                        characters: "."
                    },
                    "&permil;": {
                        codepoints: [8240],
                        characters: "‰"
                    },
                    "&perp;": {
                        codepoints: [8869],
                        characters: "⊥"
                    },
                    "&pertenk;": {
                        codepoints: [8241],
                        characters: "‱"
                    },
                    "&Pfr;": {
                        codepoints: [120083],
                        characters: "𝔓"
                    },
                    "&pfr;": {
                        codepoints: [120109],
                        characters: "𝔭"
                    },
                    "&Phi;": {
                        codepoints: [934],
                        characters: "Φ"
                    },
                    "&phi;": {
                        codepoints: [966],
                        characters: "φ"
                    },
                    "&phiv;": {
                        codepoints: [981],
                        characters: "ϕ"
                    },
                    "&phmmat;": {
                        codepoints: [8499],
                        characters: "ℳ"
                    },
                    "&phone;": {
                        codepoints: [9742],
                        characters: "☎"
                    },
                    "&Pi;": {
                        codepoints: [928],
                        characters: "Π"
                    },
                    "&pi;": {
                        codepoints: [960],
                        characters: "π"
                    },
                    "&pitchfork;": {
                        codepoints: [8916],
                        characters: "⋔"
                    },
                    "&piv;": {
                        codepoints: [982],
                        characters: "ϖ"
                    },
                    "&planck;": {
                        codepoints: [8463],
                        characters: "ℏ"
                    },
                    "&planckh;": {
                        codepoints: [8462],
                        characters: "ℎ"
                    },
                    "&plankv;": {
                        codepoints: [8463],
                        characters: "ℏ"
                    },
                    "&plusacir;": {
                        codepoints: [10787],
                        characters: "⨣"
                    },
                    "&plusb;": {
                        codepoints: [8862],
                        characters: "⊞"
                    },
                    "&pluscir;": {
                        codepoints: [10786],
                        characters: "⨢"
                    },
                    "&plus;": {
                        codepoints: [43],
                        characters: "+"
                    },
                    "&plusdo;": {
                        codepoints: [8724],
                        characters: "∔"
                    },
                    "&plusdu;": {
                        codepoints: [10789],
                        characters: "⨥"
                    },
                    "&pluse;": {
                        codepoints: [10866],
                        characters: "⩲"
                    },
                    "&PlusMinus;": {
                        codepoints: [177],
                        characters: "±"
                    },
                    "&plusmn;": {
                        codepoints: [177],
                        characters: "±"
                    },
                    "&plusmn": {
                        codepoints: [177],
                        characters: "±"
                    },
                    "&plussim;": {
                        codepoints: [10790],
                        characters: "⨦"
                    },
                    "&plustwo;": {
                        codepoints: [10791],
                        characters: "⨧"
                    },
                    "&pm;": {
                        codepoints: [177],
                        characters: "±"
                    },
                    "&Poincareplane;": {
                        codepoints: [8460],
                        characters: "ℌ"
                    },
                    "&pointint;": {
                        codepoints: [10773],
                        characters: "⨕"
                    },
                    "&popf;": {
                        codepoints: [120161],
                        characters: "𝕡"
                    },
                    "&Popf;": {
                        codepoints: [8473],
                        characters: "ℙ"
                    },
                    "&pound;": {
                        codepoints: [163],
                        characters: "£"
                    },
                    "&pound": {
                        codepoints: [163],
                        characters: "£"
                    },
                    "&prap;": {
                        codepoints: [10935],
                        characters: "⪷"
                    },
                    "&Pr;": {
                        codepoints: [10939],
                        characters: "⪻"
                    },
                    "&pr;": {
                        codepoints: [8826],
                        characters: "≺"
                    },
                    "&prcue;": {
                        codepoints: [8828],
                        characters: "≼"
                    },
                    "&precapprox;": {
                        codepoints: [10935],
                        characters: "⪷"
                    },
                    "&prec;": {
                        codepoints: [8826],
                        characters: "≺"
                    },
                    "&preccurlyeq;": {
                        codepoints: [8828],
                        characters: "≼"
                    },
                    "&Precedes;": {
                        codepoints: [8826],
                        characters: "≺"
                    },
                    "&PrecedesEqual;": {
                        codepoints: [10927],
                        characters: "⪯"
                    },
                    "&PrecedesSlantEqual;": {
                        codepoints: [8828],
                        characters: "≼"
                    },
                    "&PrecedesTilde;": {
                        codepoints: [8830],
                        characters: "≾"
                    },
                    "&preceq;": {
                        codepoints: [10927],
                        characters: "⪯"
                    },
                    "&precnapprox;": {
                        codepoints: [10937],
                        characters: "⪹"
                    },
                    "&precneqq;": {
                        codepoints: [10933],
                        characters: "⪵"
                    },
                    "&precnsim;": {
                        codepoints: [8936],
                        characters: "⋨"
                    },
                    "&pre;": {
                        codepoints: [10927],
                        characters: "⪯"
                    },
                    "&prE;": {
                        codepoints: [10931],
                        characters: "⪳"
                    },
                    "&precsim;": {
                        codepoints: [8830],
                        characters: "≾"
                    },
                    "&prime;": {
                        codepoints: [8242],
                        characters: "′"
                    },
                    "&Prime;": {
                        codepoints: [8243],
                        characters: "″"
                    },
                    "&primes;": {
                        codepoints: [8473],
                        characters: "ℙ"
                    },
                    "&prnap;": {
                        codepoints: [10937],
                        characters: "⪹"
                    },
                    "&prnE;": {
                        codepoints: [10933],
                        characters: "⪵"
                    },
                    "&prnsim;": {
                        codepoints: [8936],
                        characters: "⋨"
                    },
                    "&prod;": {
                        codepoints: [8719],
                        characters: "∏"
                    },
                    "&Product;": {
                        codepoints: [8719],
                        characters: "∏"
                    },
                    "&profalar;": {
                        codepoints: [9006],
                        characters: "⌮"
                    },
                    "&profline;": {
                        codepoints: [8978],
                        characters: "⌒"
                    },
                    "&profsurf;": {
                        codepoints: [8979],
                        characters: "⌓"
                    },
                    "&prop;": {
                        codepoints: [8733],
                        characters: "∝"
                    },
                    "&Proportional;": {
                        codepoints: [8733],
                        characters: "∝"
                    },
                    "&Proportion;": {
                        codepoints: [8759],
                        characters: "∷"
                    },
                    "&propto;": {
                        codepoints: [8733],
                        characters: "∝"
                    },
                    "&prsim;": {
                        codepoints: [8830],
                        characters: "≾"
                    },
                    "&prurel;": {
                        codepoints: [8880],
                        characters: "⊰"
                    },
                    "&Pscr;": {
                        codepoints: [119979],
                        characters: "𝒫"
                    },
                    "&pscr;": {
                        codepoints: [120005],
                        characters: "𝓅"
                    },
                    "&Psi;": {
                        codepoints: [936],
                        characters: "Ψ"
                    },
                    "&psi;": {
                        codepoints: [968],
                        characters: "ψ"
                    },
                    "&puncsp;": {
                        codepoints: [8200],
                        characters: " "
                    },
                    "&Qfr;": {
                        codepoints: [120084],
                        characters: "𝔔"
                    },
                    "&qfr;": {
                        codepoints: [120110],
                        characters: "𝔮"
                    },
                    "&qint;": {
                        codepoints: [10764],
                        characters: "⨌"
                    },
                    "&qopf;": {
                        codepoints: [120162],
                        characters: "𝕢"
                    },
                    "&Qopf;": {
                        codepoints: [8474],
                        characters: "ℚ"
                    },
                    "&qprime;": {
                        codepoints: [8279],
                        characters: "⁗"
                    },
                    "&Qscr;": {
                        codepoints: [119980],
                        characters: "𝒬"
                    },
                    "&qscr;": {
                        codepoints: [120006],
                        characters: "𝓆"
                    },
                    "&quaternions;": {
                        codepoints: [8461],
                        characters: "ℍ"
                    },
                    "&quatint;": {
                        codepoints: [10774],
                        characters: "⨖"
                    },
                    "&quest;": {
                        codepoints: [63],
                        characters: "?"
                    },
                    "&questeq;": {
                        codepoints: [8799],
                        characters: "≟"
                    },
                    "&quot;": {
                        codepoints: [34],
                        characters: '"'
                    },
                    "&quot": {
                        codepoints: [34],
                        characters: '"'
                    },
                    "&QUOT;": {
                        codepoints: [34],
                        characters: '"'
                    },
                    "&QUOT": {
                        codepoints: [34],
                        characters: '"'
                    },
                    "&rAarr;": {
                        codepoints: [8667],
                        characters: "⇛"
                    },
                    "&race;": {
                        codepoints: [8765, 817],
                        characters: "∽̱"
                    },
                    "&Racute;": {
                        codepoints: [340],
                        characters: "Ŕ"
                    },
                    "&racute;": {
                        codepoints: [341],
                        characters: "ŕ"
                    },
                    "&radic;": {
                        codepoints: [8730],
                        characters: "√"
                    },
                    "&raemptyv;": {
                        codepoints: [10675],
                        characters: "⦳"
                    },
                    "&rang;": {
                        codepoints: [10217],
                        characters: "⟩"
                    },
                    "&Rang;": {
                        codepoints: [10219],
                        characters: "⟫"
                    },
                    "&rangd;": {
                        codepoints: [10642],
                        characters: "⦒"
                    },
                    "&range;": {
                        codepoints: [10661],
                        characters: "⦥"
                    },
                    "&rangle;": {
                        codepoints: [10217],
                        characters: "⟩"
                    },
                    "&raquo;": {
                        codepoints: [187],
                        characters: "»"
                    },
                    "&raquo": {
                        codepoints: [187],
                        characters: "»"
                    },
                    "&rarrap;": {
                        codepoints: [10613],
                        characters: "⥵"
                    },
                    "&rarrb;": {
                        codepoints: [8677],
                        characters: "⇥"
                    },
                    "&rarrbfs;": {
                        codepoints: [10528],
                        characters: "⤠"
                    },
                    "&rarrc;": {
                        codepoints: [10547],
                        characters: "⤳"
                    },
                    "&rarr;": {
                        codepoints: [8594],
                        characters: "→"
                    },
                    "&Rarr;": {
                        codepoints: [8608],
                        characters: "↠"
                    },
                    "&rArr;": {
                        codepoints: [8658],
                        characters: "⇒"
                    },
                    "&rarrfs;": {
                        codepoints: [10526],
                        characters: "⤞"
                    },
                    "&rarrhk;": {
                        codepoints: [8618],
                        characters: "↪"
                    },
                    "&rarrlp;": {
                        codepoints: [8620],
                        characters: "↬"
                    },
                    "&rarrpl;": {
                        codepoints: [10565],
                        characters: "⥅"
                    },
                    "&rarrsim;": {
                        codepoints: [10612],
                        characters: "⥴"
                    },
                    "&Rarrtl;": {
                        codepoints: [10518],
                        characters: "⤖"
                    },
                    "&rarrtl;": {
                        codepoints: [8611],
                        characters: "↣"
                    },
                    "&rarrw;": {
                        codepoints: [8605],
                        characters: "↝"
                    },
                    "&ratail;": {
                        codepoints: [10522],
                        characters: "⤚"
                    },
                    "&rAtail;": {
                        codepoints: [10524],
                        characters: "⤜"
                    },
                    "&ratio;": {
                        codepoints: [8758],
                        characters: "∶"
                    },
                    "&rationals;": {
                        codepoints: [8474],
                        characters: "ℚ"
                    },
                    "&rbarr;": {
                        codepoints: [10509],
                        characters: "⤍"
                    },
                    "&rBarr;": {
                        codepoints: [10511],
                        characters: "⤏"
                    },
                    "&RBarr;": {
                        codepoints: [10512],
                        characters: "⤐"
                    },
                    "&rbbrk;": {
                        codepoints: [10099],
                        characters: "❳"
                    },
                    "&rbrace;": {
                        codepoints: [125],
                        characters: "}"
                    },
                    "&rbrack;": {
                        codepoints: [93],
                        characters: "]"
                    },
                    "&rbrke;": {
                        codepoints: [10636],
                        characters: "⦌"
                    },
                    "&rbrksld;": {
                        codepoints: [10638],
                        characters: "⦎"
                    },
                    "&rbrkslu;": {
                        codepoints: [10640],
                        characters: "⦐"
                    },
                    "&Rcaron;": {
                        codepoints: [344],
                        characters: "Ř"
                    },
                    "&rcaron;": {
                        codepoints: [345],
                        characters: "ř"
                    },
                    "&Rcedil;": {
                        codepoints: [342],
                        characters: "Ŗ"
                    },
                    "&rcedil;": {
                        codepoints: [343],
                        characters: "ŗ"
                    },
                    "&rceil;": {
                        codepoints: [8969],
                        characters: "⌉"
                    },
                    "&rcub;": {
                        codepoints: [125],
                        characters: "}"
                    },
                    "&Rcy;": {
                        codepoints: [1056],
                        characters: "Р"
                    },
                    "&rcy;": {
                        codepoints: [1088],
                        characters: "р"
                    },
                    "&rdca;": {
                        codepoints: [10551],
                        characters: "⤷"
                    },
                    "&rdldhar;": {
                        codepoints: [10601],
                        characters: "⥩"
                    },
                    "&rdquo;": {
                        codepoints: [8221],
                        characters: "”"
                    },
                    "&rdquor;": {
                        codepoints: [8221],
                        characters: "”"
                    },
                    "&rdsh;": {
                        codepoints: [8627],
                        characters: "↳"
                    },
                    "&real;": {
                        codepoints: [8476],
                        characters: "ℜ"
                    },
                    "&realine;": {
                        codepoints: [8475],
                        characters: "ℛ"
                    },
                    "&realpart;": {
                        codepoints: [8476],
                        characters: "ℜ"
                    },
                    "&reals;": {
                        codepoints: [8477],
                        characters: "ℝ"
                    },
                    "&Re;": {
                        codepoints: [8476],
                        characters: "ℜ"
                    },
                    "&rect;": {
                        codepoints: [9645],
                        characters: "▭"
                    },
                    "&reg;": {
                        codepoints: [174],
                        characters: "®"
                    },
                    "&reg": {
                        codepoints: [174],
                        characters: "®"
                    },
                    "&REG;": {
                        codepoints: [174],
                        characters: "®"
                    },
                    "&REG": {
                        codepoints: [174],
                        characters: "®"
                    },
                    "&ReverseElement;": {
                        codepoints: [8715],
                        characters: "∋"
                    },
                    "&ReverseEquilibrium;": {
                        codepoints: [8651],
                        characters: "⇋"
                    },
                    "&ReverseUpEquilibrium;": {
                        codepoints: [10607],
                        characters: "⥯"
                    },
                    "&rfisht;": {
                        codepoints: [10621],
                        characters: "⥽"
                    },
                    "&rfloor;": {
                        codepoints: [8971],
                        characters: "⌋"
                    },
                    "&rfr;": {
                        codepoints: [120111],
                        characters: "𝔯"
                    },
                    "&Rfr;": {
                        codepoints: [8476],
                        characters: "ℜ"
                    },
                    "&rHar;": {
                        codepoints: [10596],
                        characters: "⥤"
                    },
                    "&rhard;": {
                        codepoints: [8641],
                        characters: "⇁"
                    },
                    "&rharu;": {
                        codepoints: [8640],
                        characters: "⇀"
                    },
                    "&rharul;": {
                        codepoints: [10604],
                        characters: "⥬"
                    },
                    "&Rho;": {
                        codepoints: [929],
                        characters: "Ρ"
                    },
                    "&rho;": {
                        codepoints: [961],
                        characters: "ρ"
                    },
                    "&rhov;": {
                        codepoints: [1009],
                        characters: "ϱ"
                    },
                    "&RightAngleBracket;": {
                        codepoints: [10217],
                        characters: "⟩"
                    },
                    "&RightArrowBar;": {
                        codepoints: [8677],
                        characters: "⇥"
                    },
                    "&rightarrow;": {
                        codepoints: [8594],
                        characters: "→"
                    },
                    "&RightArrow;": {
                        codepoints: [8594],
                        characters: "→"
                    },
                    "&Rightarrow;": {
                        codepoints: [8658],
                        characters: "⇒"
                    },
                    "&RightArrowLeftArrow;": {
                        codepoints: [8644],
                        characters: "⇄"
                    },
                    "&rightarrowtail;": {
                        codepoints: [8611],
                        characters: "↣"
                    },
                    "&RightCeiling;": {
                        codepoints: [8969],
                        characters: "⌉"
                    },
                    "&RightDoubleBracket;": {
                        codepoints: [10215],
                        characters: "⟧"
                    },
                    "&RightDownTeeVector;": {
                        codepoints: [10589],
                        characters: "⥝"
                    },
                    "&RightDownVectorBar;": {
                        codepoints: [10581],
                        characters: "⥕"
                    },
                    "&RightDownVector;": {
                        codepoints: [8642],
                        characters: "⇂"
                    },
                    "&RightFloor;": {
                        codepoints: [8971],
                        characters: "⌋"
                    },
                    "&rightharpoondown;": {
                        codepoints: [8641],
                        characters: "⇁"
                    },
                    "&rightharpoonup;": {
                        codepoints: [8640],
                        characters: "⇀"
                    },
                    "&rightleftarrows;": {
                        codepoints: [8644],
                        characters: "⇄"
                    },
                    "&rightleftharpoons;": {
                        codepoints: [8652],
                        characters: "⇌"
                    },
                    "&rightrightarrows;": {
                        codepoints: [8649],
                        characters: "⇉"
                    },
                    "&rightsquigarrow;": {
                        codepoints: [8605],
                        characters: "↝"
                    },
                    "&RightTeeArrow;": {
                        codepoints: [8614],
                        characters: "↦"
                    },
                    "&RightTee;": {
                        codepoints: [8866],
                        characters: "⊢"
                    },
                    "&RightTeeVector;": {
                        codepoints: [10587],
                        characters: "⥛"
                    },
                    "&rightthreetimes;": {
                        codepoints: [8908],
                        characters: "⋌"
                    },
                    "&RightTriangleBar;": {
                        codepoints: [10704],
                        characters: "⧐"
                    },
                    "&RightTriangle;": {
                        codepoints: [8883],
                        characters: "⊳"
                    },
                    "&RightTriangleEqual;": {
                        codepoints: [8885],
                        characters: "⊵"
                    },
                    "&RightUpDownVector;": {
                        codepoints: [10575],
                        characters: "⥏"
                    },
                    "&RightUpTeeVector;": {
                        codepoints: [10588],
                        characters: "⥜"
                    },
                    "&RightUpVectorBar;": {
                        codepoints: [10580],
                        characters: "⥔"
                    },
                    "&RightUpVector;": {
                        codepoints: [8638],
                        characters: "↾"
                    },
                    "&RightVectorBar;": {
                        codepoints: [10579],
                        characters: "⥓"
                    },
                    "&RightVector;": {
                        codepoints: [8640],
                        characters: "⇀"
                    },
                    "&ring;": {
                        codepoints: [730],
                        characters: "˚"
                    },
                    "&risingdotseq;": {
                        codepoints: [8787],
                        characters: "≓"
                    },
                    "&rlarr;": {
                        codepoints: [8644],
                        characters: "⇄"
                    },
                    "&rlhar;": {
                        codepoints: [8652],
                        characters: "⇌"
                    },
                    "&rlm;": {
                        codepoints: [8207],
                        characters: "‏"
                    },
                    "&rmoustache;": {
                        codepoints: [9137],
                        characters: "⎱"
                    },
                    "&rmoust;": {
                        codepoints: [9137],
                        characters: "⎱"
                    },
                    "&rnmid;": {
                        codepoints: [10990],
                        characters: "⫮"
                    },
                    "&roang;": {
                        codepoints: [10221],
                        characters: "⟭"
                    },
                    "&roarr;": {
                        codepoints: [8702],
                        characters: "⇾"
                    },
                    "&robrk;": {
                        codepoints: [10215],
                        characters: "⟧"
                    },
                    "&ropar;": {
                        codepoints: [10630],
                        characters: "⦆"
                    },
                    "&ropf;": {
                        codepoints: [120163],
                        characters: "𝕣"
                    },
                    "&Ropf;": {
                        codepoints: [8477],
                        characters: "ℝ"
                    },
                    "&roplus;": {
                        codepoints: [10798],
                        characters: "⨮"
                    },
                    "&rotimes;": {
                        codepoints: [10805],
                        characters: "⨵"
                    },
                    "&RoundImplies;": {
                        codepoints: [10608],
                        characters: "⥰"
                    },
                    "&rpar;": {
                        codepoints: [41],
                        characters: ")"
                    },
                    "&rpargt;": {
                        codepoints: [10644],
                        characters: "⦔"
                    },
                    "&rppolint;": {
                        codepoints: [10770],
                        characters: "⨒"
                    },
                    "&rrarr;": {
                        codepoints: [8649],
                        characters: "⇉"
                    },
                    "&Rrightarrow;": {
                        codepoints: [8667],
                        characters: "⇛"
                    },
                    "&rsaquo;": {
                        codepoints: [8250],
                        characters: "›"
                    },
                    "&rscr;": {
                        codepoints: [120007],
                        characters: "𝓇"
                    },
                    "&Rscr;": {
                        codepoints: [8475],
                        characters: "ℛ"
                    },
                    "&rsh;": {
                        codepoints: [8625],
                        characters: "↱"
                    },
                    "&Rsh;": {
                        codepoints: [8625],
                        characters: "↱"
                    },
                    "&rsqb;": {
                        codepoints: [93],
                        characters: "]"
                    },
                    "&rsquo;": {
                        codepoints: [8217],
                        characters: "’"
                    },
                    "&rsquor;": {
                        codepoints: [8217],
                        characters: "’"
                    },
                    "&rthree;": {
                        codepoints: [8908],
                        characters: "⋌"
                    },
                    "&rtimes;": {
                        codepoints: [8906],
                        characters: "⋊"
                    },
                    "&rtri;": {
                        codepoints: [9657],
                        characters: "▹"
                    },
                    "&rtrie;": {
                        codepoints: [8885],
                        characters: "⊵"
                    },
                    "&rtrif;": {
                        codepoints: [9656],
                        characters: "▸"
                    },
                    "&rtriltri;": {
                        codepoints: [10702],
                        characters: "⧎"
                    },
                    "&RuleDelayed;": {
                        codepoints: [10740],
                        characters: "⧴"
                    },
                    "&ruluhar;": {
                        codepoints: [10600],
                        characters: "⥨"
                    },
                    "&rx;": {
                        codepoints: [8478],
                        characters: "℞"
                    },
                    "&Sacute;": {
                        codepoints: [346],
                        characters: "Ś"
                    },
                    "&sacute;": {
                        codepoints: [347],
                        characters: "ś"
                    },
                    "&sbquo;": {
                        codepoints: [8218],
                        characters: "‚"
                    },
                    "&scap;": {
                        codepoints: [10936],
                        characters: "⪸"
                    },
                    "&Scaron;": {
                        codepoints: [352],
                        characters: "Š"
                    },
                    "&scaron;": {
                        codepoints: [353],
                        characters: "š"
                    },
                    "&Sc;": {
                        codepoints: [10940],
                        characters: "⪼"
                    },
                    "&sc;": {
                        codepoints: [8827],
                        characters: "≻"
                    },
                    "&sccue;": {
                        codepoints: [8829],
                        characters: "≽"
                    },
                    "&sce;": {
                        codepoints: [10928],
                        characters: "⪰"
                    },
                    "&scE;": {
                        codepoints: [10932],
                        characters: "⪴"
                    },
                    "&Scedil;": {
                        codepoints: [350],
                        characters: "Ş"
                    },
                    "&scedil;": {
                        codepoints: [351],
                        characters: "ş"
                    },
                    "&Scirc;": {
                        codepoints: [348],
                        characters: "Ŝ"
                    },
                    "&scirc;": {
                        codepoints: [349],
                        characters: "ŝ"
                    },
                    "&scnap;": {
                        codepoints: [10938],
                        characters: "⪺"
                    },
                    "&scnE;": {
                        codepoints: [10934],
                        characters: "⪶"
                    },
                    "&scnsim;": {
                        codepoints: [8937],
                        characters: "⋩"
                    },
                    "&scpolint;": {
                        codepoints: [10771],
                        characters: "⨓"
                    },
                    "&scsim;": {
                        codepoints: [8831],
                        characters: "≿"
                    },
                    "&Scy;": {
                        codepoints: [1057],
                        characters: "С"
                    },
                    "&scy;": {
                        codepoints: [1089],
                        characters: "с"
                    },
                    "&sdotb;": {
                        codepoints: [8865],
                        characters: "⊡"
                    },
                    "&sdot;": {
                        codepoints: [8901],
                        characters: "⋅"
                    },
                    "&sdote;": {
                        codepoints: [10854],
                        characters: "⩦"
                    },
                    "&searhk;": {
                        codepoints: [10533],
                        characters: "⤥"
                    },
                    "&searr;": {
                        codepoints: [8600],
                        characters: "↘"
                    },
                    "&seArr;": {
                        codepoints: [8664],
                        characters: "⇘"
                    },
                    "&searrow;": {
                        codepoints: [8600],
                        characters: "↘"
                    },
                    "&sect;": {
                        codepoints: [167],
                        characters: "§"
                    },
                    "&sect": {
                        codepoints: [167],
                        characters: "§"
                    },
                    "&semi;": {
                        codepoints: [59],
                        characters: ";"
                    },
                    "&seswar;": {
                        codepoints: [10537],
                        characters: "⤩"
                    },
                    "&setminus;": {
                        codepoints: [8726],
                        characters: "∖"
                    },
                    "&setmn;": {
                        codepoints: [8726],
                        characters: "∖"
                    },
                    "&sext;": {
                        codepoints: [10038],
                        characters: "✶"
                    },
                    "&Sfr;": {
                        codepoints: [120086],
                        characters: "𝔖"
                    },
                    "&sfr;": {
                        codepoints: [120112],
                        characters: "𝔰"
                    },
                    "&sfrown;": {
                        codepoints: [8994],
                        characters: "⌢"
                    },
                    "&sharp;": {
                        codepoints: [9839],
                        characters: "♯"
                    },
                    "&SHCHcy;": {
                        codepoints: [1065],
                        characters: "Щ"
                    },
                    "&shchcy;": {
                        codepoints: [1097],
                        characters: "щ"
                    },
                    "&SHcy;": {
                        codepoints: [1064],
                        characters: "Ш"
                    },
                    "&shcy;": {
                        codepoints: [1096],
                        characters: "ш"
                    },
                    "&ShortDownArrow;": {
                        codepoints: [8595],
                        characters: "↓"
                    },
                    "&ShortLeftArrow;": {
                        codepoints: [8592],
                        characters: "←"
                    },
                    "&shortmid;": {
                        codepoints: [8739],
                        characters: "∣"
                    },
                    "&shortparallel;": {
                        codepoints: [8741],
                        characters: "∥"
                    },
                    "&ShortRightArrow;": {
                        codepoints: [8594],
                        characters: "→"
                    },
                    "&ShortUpArrow;": {
                        codepoints: [8593],
                        characters: "↑"
                    },
                    "&shy;": {
                        codepoints: [173],
                        characters: "­"
                    },
                    "&shy": {
                        codepoints: [173],
                        characters: "­"
                    },
                    "&Sigma;": {
                        codepoints: [931],
                        characters: "Σ"
                    },
                    "&sigma;": {
                        codepoints: [963],
                        characters: "σ"
                    },
                    "&sigmaf;": {
                        codepoints: [962],
                        characters: "ς"
                    },
                    "&sigmav;": {
                        codepoints: [962],
                        characters: "ς"
                    },
                    "&sim;": {
                        codepoints: [8764],
                        characters: "∼"
                    },
                    "&simdot;": {
                        codepoints: [10858],
                        characters: "⩪"
                    },
                    "&sime;": {
                        codepoints: [8771],
                        characters: "≃"
                    },
                    "&simeq;": {
                        codepoints: [8771],
                        characters: "≃"
                    },
                    "&simg;": {
                        codepoints: [10910],
                        characters: "⪞"
                    },
                    "&simgE;": {
                        codepoints: [10912],
                        characters: "⪠"
                    },
                    "&siml;": {
                        codepoints: [10909],
                        characters: "⪝"
                    },
                    "&simlE;": {
                        codepoints: [10911],
                        characters: "⪟"
                    },
                    "&simne;": {
                        codepoints: [8774],
                        characters: "≆"
                    },
                    "&simplus;": {
                        codepoints: [10788],
                        characters: "⨤"
                    },
                    "&simrarr;": {
                        codepoints: [10610],
                        characters: "⥲"
                    },
                    "&slarr;": {
                        codepoints: [8592],
                        characters: "←"
                    },
                    "&SmallCircle;": {
                        codepoints: [8728],
                        characters: "∘"
                    },
                    "&smallsetminus;": {
                        codepoints: [8726],
                        characters: "∖"
                    },
                    "&smashp;": {
                        codepoints: [10803],
                        characters: "⨳"
                    },
                    "&smeparsl;": {
                        codepoints: [10724],
                        characters: "⧤"
                    },
                    "&smid;": {
                        codepoints: [8739],
                        characters: "∣"
                    },
                    "&smile;": {
                        codepoints: [8995],
                        characters: "⌣"
                    },
                    "&smt;": {
                        codepoints: [10922],
                        characters: "⪪"
                    },
                    "&smte;": {
                        codepoints: [10924],
                        characters: "⪬"
                    },
                    "&smtes;": {
                        codepoints: [10924, 65024],
                        characters: "⪬︀"
                    },
                    "&SOFTcy;": {
                        codepoints: [1068],
                        characters: "Ь"
                    },
                    "&softcy;": {
                        codepoints: [1100],
                        characters: "ь"
                    },
                    "&solbar;": {
                        codepoints: [9023],
                        characters: "⌿"
                    },
                    "&solb;": {
                        codepoints: [10692],
                        characters: "⧄"
                    },
                    "&sol;": {
                        codepoints: [47],
                        characters: "/"
                    },
                    "&Sopf;": {
                        codepoints: [120138],
                        characters: "𝕊"
                    },
                    "&sopf;": {
                        codepoints: [120164],
                        characters: "𝕤"
                    },
                    "&spades;": {
                        codepoints: [9824],
                        characters: "♠"
                    },
                    "&spadesuit;": {
                        codepoints: [9824],
                        characters: "♠"
                    },
                    "&spar;": {
                        codepoints: [8741],
                        characters: "∥"
                    },
                    "&sqcap;": {
                        codepoints: [8851],
                        characters: "⊓"
                    },
                    "&sqcaps;": {
                        codepoints: [8851, 65024],
                        characters: "⊓︀"
                    },
                    "&sqcup;": {
                        codepoints: [8852],
                        characters: "⊔"
                    },
                    "&sqcups;": {
                        codepoints: [8852, 65024],
                        characters: "⊔︀"
                    },
                    "&Sqrt;": {
                        codepoints: [8730],
                        characters: "√"
                    },
                    "&sqsub;": {
                        codepoints: [8847],
                        characters: "⊏"
                    },
                    "&sqsube;": {
                        codepoints: [8849],
                        characters: "⊑"
                    },
                    "&sqsubset;": {
                        codepoints: [8847],
                        characters: "⊏"
                    },
                    "&sqsubseteq;": {
                        codepoints: [8849],
                        characters: "⊑"
                    },
                    "&sqsup;": {
                        codepoints: [8848],
                        characters: "⊐"
                    },
                    "&sqsupe;": {
                        codepoints: [8850],
                        characters: "⊒"
                    },
                    "&sqsupset;": {
                        codepoints: [8848],
                        characters: "⊐"
                    },
                    "&sqsupseteq;": {
                        codepoints: [8850],
                        characters: "⊒"
                    },
                    "&square;": {
                        codepoints: [9633],
                        characters: "□"
                    },
                    "&Square;": {
                        codepoints: [9633],
                        characters: "□"
                    },
                    "&SquareIntersection;": {
                        codepoints: [8851],
                        characters: "⊓"
                    },
                    "&SquareSubset;": {
                        codepoints: [8847],
                        characters: "⊏"
                    },
                    "&SquareSubsetEqual;": {
                        codepoints: [8849],
                        characters: "⊑"
                    },
                    "&SquareSuperset;": {
                        codepoints: [8848],
                        characters: "⊐"
                    },
                    "&SquareSupersetEqual;": {
                        codepoints: [8850],
                        characters: "⊒"
                    },
                    "&SquareUnion;": {
                        codepoints: [8852],
                        characters: "⊔"
                    },
                    "&squarf;": {
                        codepoints: [9642],
                        characters: "▪"
                    },
                    "&squ;": {
                        codepoints: [9633],
                        characters: "□"
                    },
                    "&squf;": {
                        codepoints: [9642],
                        characters: "▪"
                    },
                    "&srarr;": {
                        codepoints: [8594],
                        characters: "→"
                    },
                    "&Sscr;": {
                        codepoints: [119982],
                        characters: "𝒮"
                    },
                    "&sscr;": {
                        codepoints: [120008],
                        characters: "𝓈"
                    },
                    "&ssetmn;": {
                        codepoints: [8726],
                        characters: "∖"
                    },
                    "&ssmile;": {
                        codepoints: [8995],
                        characters: "⌣"
                    },
                    "&sstarf;": {
                        codepoints: [8902],
                        characters: "⋆"
                    },
                    "&Star;": {
                        codepoints: [8902],
                        characters: "⋆"
                    },
                    "&star;": {
                        codepoints: [9734],
                        characters: "☆"
                    },
                    "&starf;": {
                        codepoints: [9733],
                        characters: "★"
                    },
                    "&straightepsilon;": {
                        codepoints: [1013],
                        characters: "ϵ"
                    },
                    "&straightphi;": {
                        codepoints: [981],
                        characters: "ϕ"
                    },
                    "&strns;": {
                        codepoints: [175],
                        characters: "¯"
                    },
                    "&sub;": {
                        codepoints: [8834],
                        characters: "⊂"
                    },
                    "&Sub;": {
                        codepoints: [8912],
                        characters: "⋐"
                    },
                    "&subdot;": {
                        codepoints: [10941],
                        characters: "⪽"
                    },
                    "&subE;": {
                        codepoints: [10949],
                        characters: "⫅"
                    },
                    "&sube;": {
                        codepoints: [8838],
                        characters: "⊆"
                    },
                    "&subedot;": {
                        codepoints: [10947],
                        characters: "⫃"
                    },
                    "&submult;": {
                        codepoints: [10945],
                        characters: "⫁"
                    },
                    "&subnE;": {
                        codepoints: [10955],
                        characters: "⫋"
                    },
                    "&subne;": {
                        codepoints: [8842],
                        characters: "⊊"
                    },
                    "&subplus;": {
                        codepoints: [10943],
                        characters: "⪿"
                    },
                    "&subrarr;": {
                        codepoints: [10617],
                        characters: "⥹"
                    },
                    "&subset;": {
                        codepoints: [8834],
                        characters: "⊂"
                    },
                    "&Subset;": {
                        codepoints: [8912],
                        characters: "⋐"
                    },
                    "&subseteq;": {
                        codepoints: [8838],
                        characters: "⊆"
                    },
                    "&subseteqq;": {
                        codepoints: [10949],
                        characters: "⫅"
                    },
                    "&SubsetEqual;": {
                        codepoints: [8838],
                        characters: "⊆"
                    },
                    "&subsetneq;": {
                        codepoints: [8842],
                        characters: "⊊"
                    },
                    "&subsetneqq;": {
                        codepoints: [10955],
                        characters: "⫋"
                    },
                    "&subsim;": {
                        codepoints: [10951],
                        characters: "⫇"
                    },
                    "&subsub;": {
                        codepoints: [10965],
                        characters: "⫕"
                    },
                    "&subsup;": {
                        codepoints: [10963],
                        characters: "⫓"
                    },
                    "&succapprox;": {
                        codepoints: [10936],
                        characters: "⪸"
                    },
                    "&succ;": {
                        codepoints: [8827],
                        characters: "≻"
                    },
                    "&succcurlyeq;": {
                        codepoints: [8829],
                        characters: "≽"
                    },
                    "&Succeeds;": {
                        codepoints: [8827],
                        characters: "≻"
                    },
                    "&SucceedsEqual;": {
                        codepoints: [10928],
                        characters: "⪰"
                    },
                    "&SucceedsSlantEqual;": {
                        codepoints: [8829],
                        characters: "≽"
                    },
                    "&SucceedsTilde;": {
                        codepoints: [8831],
                        characters: "≿"
                    },
                    "&succeq;": {
                        codepoints: [10928],
                        characters: "⪰"
                    },
                    "&succnapprox;": {
                        codepoints: [10938],
                        characters: "⪺"
                    },
                    "&succneqq;": {
                        codepoints: [10934],
                        characters: "⪶"
                    },
                    "&succnsim;": {
                        codepoints: [8937],
                        characters: "⋩"
                    },
                    "&succsim;": {
                        codepoints: [8831],
                        characters: "≿"
                    },
                    "&SuchThat;": {
                        codepoints: [8715],
                        characters: "∋"
                    },
                    "&sum;": {
                        codepoints: [8721],
                        characters: "∑"
                    },
                    "&Sum;": {
                        codepoints: [8721],
                        characters: "∑"
                    },
                    "&sung;": {
                        codepoints: [9834],
                        characters: "♪"
                    },
                    "&sup1;": {
                        codepoints: [185],
                        characters: "¹"
                    },
                    "&sup1": {
                        codepoints: [185],
                        characters: "¹"
                    },
                    "&sup2;": {
                        codepoints: [178],
                        characters: "²"
                    },
                    "&sup2": {
                        codepoints: [178],
                        characters: "²"
                    },
                    "&sup3;": {
                        codepoints: [179],
                        characters: "³"
                    },
                    "&sup3": {
                        codepoints: [179],
                        characters: "³"
                    },
                    "&sup;": {
                        codepoints: [8835],
                        characters: "⊃"
                    },
                    "&Sup;": {
                        codepoints: [8913],
                        characters: "⋑"
                    },
                    "&supdot;": {
                        codepoints: [10942],
                        characters: "⪾"
                    },
                    "&supdsub;": {
                        codepoints: [10968],
                        characters: "⫘"
                    },
                    "&supE;": {
                        codepoints: [10950],
                        characters: "⫆"
                    },
                    "&supe;": {
                        codepoints: [8839],
                        characters: "⊇"
                    },
                    "&supedot;": {
                        codepoints: [10948],
                        characters: "⫄"
                    },
                    "&Superset;": {
                        codepoints: [8835],
                        characters: "⊃"
                    },
                    "&SupersetEqual;": {
                        codepoints: [8839],
                        characters: "⊇"
                    },
                    "&suphsol;": {
                        codepoints: [10185],
                        characters: "⟉"
                    },
                    "&suphsub;": {
                        codepoints: [10967],
                        characters: "⫗"
                    },
                    "&suplarr;": {
                        codepoints: [10619],
                        characters: "⥻"
                    },
                    "&supmult;": {
                        codepoints: [10946],
                        characters: "⫂"
                    },
                    "&supnE;": {
                        codepoints: [10956],
                        characters: "⫌"
                    },
                    "&supne;": {
                        codepoints: [8843],
                        characters: "⊋"
                    },
                    "&supplus;": {
                        codepoints: [10944],
                        characters: "⫀"
                    },
                    "&supset;": {
                        codepoints: [8835],
                        characters: "⊃"
                    },
                    "&Supset;": {
                        codepoints: [8913],
                        characters: "⋑"
                    },
                    "&supseteq;": {
                        codepoints: [8839],
                        characters: "⊇"
                    },
                    "&supseteqq;": {
                        codepoints: [10950],
                        characters: "⫆"
                    },
                    "&supsetneq;": {
                        codepoints: [8843],
                        characters: "⊋"
                    },
                    "&supsetneqq;": {
                        codepoints: [10956],
                        characters: "⫌"
                    },
                    "&supsim;": {
                        codepoints: [10952],
                        characters: "⫈"
                    },
                    "&supsub;": {
                        codepoints: [10964],
                        characters: "⫔"
                    },
                    "&supsup;": {
                        codepoints: [10966],
                        characters: "⫖"
                    },
                    "&swarhk;": {
                        codepoints: [10534],
                        characters: "⤦"
                    },
                    "&swarr;": {
                        codepoints: [8601],
                        characters: "↙"
                    },
                    "&swArr;": {
                        codepoints: [8665],
                        characters: "⇙"
                    },
                    "&swarrow;": {
                        codepoints: [8601],
                        characters: "↙"
                    },
                    "&swnwar;": {
                        codepoints: [10538],
                        characters: "⤪"
                    },
                    "&szlig;": {
                        codepoints: [223],
                        characters: "ß"
                    },
                    "&szlig": {
                        codepoints: [223],
                        characters: "ß"
                    },
                    "&Tab;": {
                        codepoints: [9],
                        characters: "	"
                    },
                    "&target;": {
                        codepoints: [8982],
                        characters: "⌖"
                    },
                    "&Tau;": {
                        codepoints: [932],
                        characters: "Τ"
                    },
                    "&tau;": {
                        codepoints: [964],
                        characters: "τ"
                    },
                    "&tbrk;": {
                        codepoints: [9140],
                        characters: "⎴"
                    },
                    "&Tcaron;": {
                        codepoints: [356],
                        characters: "Ť"
                    },
                    "&tcaron;": {
                        codepoints: [357],
                        characters: "ť"
                    },
                    "&Tcedil;": {
                        codepoints: [354],
                        characters: "Ţ"
                    },
                    "&tcedil;": {
                        codepoints: [355],
                        characters: "ţ"
                    },
                    "&Tcy;": {
                        codepoints: [1058],
                        characters: "Т"
                    },
                    "&tcy;": {
                        codepoints: [1090],
                        characters: "т"
                    },
                    "&tdot;": {
                        codepoints: [8411],
                        characters: "⃛"
                    },
                    "&telrec;": {
                        codepoints: [8981],
                        characters: "⌕"
                    },
                    "&Tfr;": {
                        codepoints: [120087],
                        characters: "𝔗"
                    },
                    "&tfr;": {
                        codepoints: [120113],
                        characters: "𝔱"
                    },
                    "&there4;": {
                        codepoints: [8756],
                        characters: "∴"
                    },
                    "&therefore;": {
                        codepoints: [8756],
                        characters: "∴"
                    },
                    "&Therefore;": {
                        codepoints: [8756],
                        characters: "∴"
                    },
                    "&Theta;": {
                        codepoints: [920],
                        characters: "Θ"
                    },
                    "&theta;": {
                        codepoints: [952],
                        characters: "θ"
                    },
                    "&thetasym;": {
                        codepoints: [977],
                        characters: "ϑ"
                    },
                    "&thetav;": {
                        codepoints: [977],
                        characters: "ϑ"
                    },
                    "&thickapprox;": {
                        codepoints: [8776],
                        characters: "≈"
                    },
                    "&thicksim;": {
                        codepoints: [8764],
                        characters: "∼"
                    },
                    "&ThickSpace;": {
                        codepoints: [8287, 8202],
                        characters: "  "
                    },
                    "&ThinSpace;": {
                        codepoints: [8201],
                        characters: " "
                    },
                    "&thinsp;": {
                        codepoints: [8201],
                        characters: " "
                    },
                    "&thkap;": {
                        codepoints: [8776],
                        characters: "≈"
                    },
                    "&thksim;": {
                        codepoints: [8764],
                        characters: "∼"
                    },
                    "&THORN;": {
                        codepoints: [222],
                        characters: "Þ"
                    },
                    "&THORN": {
                        codepoints: [222],
                        characters: "Þ"
                    },
                    "&thorn;": {
                        codepoints: [254],
                        characters: "þ"
                    },
                    "&thorn": {
                        codepoints: [254],
                        characters: "þ"
                    },
                    "&tilde;": {
                        codepoints: [732],
                        characters: "˜"
                    },
                    "&Tilde;": {
                        codepoints: [8764],
                        characters: "∼"
                    },
                    "&TildeEqual;": {
                        codepoints: [8771],
                        characters: "≃"
                    },
                    "&TildeFullEqual;": {
                        codepoints: [8773],
                        characters: "≅"
                    },
                    "&TildeTilde;": {
                        codepoints: [8776],
                        characters: "≈"
                    },
                    "&timesbar;": {
                        codepoints: [10801],
                        characters: "⨱"
                    },
                    "&timesb;": {
                        codepoints: [8864],
                        characters: "⊠"
                    },
                    "&times;": {
                        codepoints: [215],
                        characters: "×"
                    },
                    "&times": {
                        codepoints: [215],
                        characters: "×"
                    },
                    "&timesd;": {
                        codepoints: [10800],
                        characters: "⨰"
                    },
                    "&tint;": {
                        codepoints: [8749],
                        characters: "∭"
                    },
                    "&toea;": {
                        codepoints: [10536],
                        characters: "⤨"
                    },
                    "&topbot;": {
                        codepoints: [9014],
                        characters: "⌶"
                    },
                    "&topcir;": {
                        codepoints: [10993],
                        characters: "⫱"
                    },
                    "&top;": {
                        codepoints: [8868],
                        characters: "⊤"
                    },
                    "&Topf;": {
                        codepoints: [120139],
                        characters: "𝕋"
                    },
                    "&topf;": {
                        codepoints: [120165],
                        characters: "𝕥"
                    },
                    "&topfork;": {
                        codepoints: [10970],
                        characters: "⫚"
                    },
                    "&tosa;": {
                        codepoints: [10537],
                        characters: "⤩"
                    },
                    "&tprime;": {
                        codepoints: [8244],
                        characters: "‴"
                    },
                    "&trade;": {
                        codepoints: [8482],
                        characters: "™"
                    },
                    "&TRADE;": {
                        codepoints: [8482],
                        characters: "™"
                    },
                    "&triangle;": {
                        codepoints: [9653],
                        characters: "▵"
                    },
                    "&triangledown;": {
                        codepoints: [9663],
                        characters: "▿"
                    },
                    "&triangleleft;": {
                        codepoints: [9667],
                        characters: "◃"
                    },
                    "&trianglelefteq;": {
                        codepoints: [8884],
                        characters: "⊴"
                    },
                    "&triangleq;": {
                        codepoints: [8796],
                        characters: "≜"
                    },
                    "&triangleright;": {
                        codepoints: [9657],
                        characters: "▹"
                    },
                    "&trianglerighteq;": {
                        codepoints: [8885],
                        characters: "⊵"
                    },
                    "&tridot;": {
                        codepoints: [9708],
                        characters: "◬"
                    },
                    "&trie;": {
                        codepoints: [8796],
                        characters: "≜"
                    },
                    "&triminus;": {
                        codepoints: [10810],
                        characters: "⨺"
                    },
                    "&TripleDot;": {
                        codepoints: [8411],
                        characters: "⃛"
                    },
                    "&triplus;": {
                        codepoints: [10809],
                        characters: "⨹"
                    },
                    "&trisb;": {
                        codepoints: [10701],
                        characters: "⧍"
                    },
                    "&tritime;": {
                        codepoints: [10811],
                        characters: "⨻"
                    },
                    "&trpezium;": {
                        codepoints: [9186],
                        characters: "⏢"
                    },
                    "&Tscr;": {
                        codepoints: [119983],
                        characters: "𝒯"
                    },
                    "&tscr;": {
                        codepoints: [120009],
                        characters: "𝓉"
                    },
                    "&TScy;": {
                        codepoints: [1062],
                        characters: "Ц"
                    },
                    "&tscy;": {
                        codepoints: [1094],
                        characters: "ц"
                    },
                    "&TSHcy;": {
                        codepoints: [1035],
                        characters: "Ћ"
                    },
                    "&tshcy;": {
                        codepoints: [1115],
                        characters: "ћ"
                    },
                    "&Tstrok;": {
                        codepoints: [358],
                        characters: "Ŧ"
                    },
                    "&tstrok;": {
                        codepoints: [359],
                        characters: "ŧ"
                    },
                    "&twixt;": {
                        codepoints: [8812],
                        characters: "≬"
                    },
                    "&twoheadleftarrow;": {
                        codepoints: [8606],
                        characters: "↞"
                    },
                    "&twoheadrightarrow;": {
                        codepoints: [8608],
                        characters: "↠"
                    },
                    "&Uacute;": {
                        codepoints: [218],
                        characters: "Ú"
                    },
                    "&Uacute": {
                        codepoints: [218],
                        characters: "Ú"
                    },
                    "&uacute;": {
                        codepoints: [250],
                        characters: "ú"
                    },
                    "&uacute": {
                        codepoints: [250],
                        characters: "ú"
                    },
                    "&uarr;": {
                        codepoints: [8593],
                        characters: "↑"
                    },
                    "&Uarr;": {
                        codepoints: [8607],
                        characters: "↟"
                    },
                    "&uArr;": {
                        codepoints: [8657],
                        characters: "⇑"
                    },
                    "&Uarrocir;": {
                        codepoints: [10569],
                        characters: "⥉"
                    },
                    "&Ubrcy;": {
                        codepoints: [1038],
                        characters: "Ў"
                    },
                    "&ubrcy;": {
                        codepoints: [1118],
                        characters: "ў"
                    },
                    "&Ubreve;": {
                        codepoints: [364],
                        characters: "Ŭ"
                    },
                    "&ubreve;": {
                        codepoints: [365],
                        characters: "ŭ"
                    },
                    "&Ucirc;": {
                        codepoints: [219],
                        characters: "Û"
                    },
                    "&Ucirc": {
                        codepoints: [219],
                        characters: "Û"
                    },
                    "&ucirc;": {
                        codepoints: [251],
                        characters: "û"
                    },
                    "&ucirc": {
                        codepoints: [251],
                        characters: "û"
                    },
                    "&Ucy;": {
                        codepoints: [1059],
                        characters: "У"
                    },
                    "&ucy;": {
                        codepoints: [1091],
                        characters: "у"
                    },
                    "&udarr;": {
                        codepoints: [8645],
                        characters: "⇅"
                    },
                    "&Udblac;": {
                        codepoints: [368],
                        characters: "Ű"
                    },
                    "&udblac;": {
                        codepoints: [369],
                        characters: "ű"
                    },
                    "&udhar;": {
                        codepoints: [10606],
                        characters: "⥮"
                    },
                    "&ufisht;": {
                        codepoints: [10622],
                        characters: "⥾"
                    },
                    "&Ufr;": {
                        codepoints: [120088],
                        characters: "𝔘"
                    },
                    "&ufr;": {
                        codepoints: [120114],
                        characters: "𝔲"
                    },
                    "&Ugrave;": {
                        codepoints: [217],
                        characters: "Ù"
                    },
                    "&Ugrave": {
                        codepoints: [217],
                        characters: "Ù"
                    },
                    "&ugrave;": {
                        codepoints: [249],
                        characters: "ù"
                    },
                    "&ugrave": {
                        codepoints: [249],
                        characters: "ù"
                    },
                    "&uHar;": {
                        codepoints: [10595],
                        characters: "⥣"
                    },
                    "&uharl;": {
                        codepoints: [8639],
                        characters: "↿"
                    },
                    "&uharr;": {
                        codepoints: [8638],
                        characters: "↾"
                    },
                    "&uhblk;": {
                        codepoints: [9600],
                        characters: "▀"
                    },
                    "&ulcorn;": {
                        codepoints: [8988],
                        characters: "⌜"
                    },
                    "&ulcorner;": {
                        codepoints: [8988],
                        characters: "⌜"
                    },
                    "&ulcrop;": {
                        codepoints: [8975],
                        characters: "⌏"
                    },
                    "&ultri;": {
                        codepoints: [9720],
                        characters: "◸"
                    },
                    "&Umacr;": {
                        codepoints: [362],
                        characters: "Ū"
                    },
                    "&umacr;": {
                        codepoints: [363],
                        characters: "ū"
                    },
                    "&uml;": {
                        codepoints: [168],
                        characters: "¨"
                    },
                    "&uml": {
                        codepoints: [168],
                        characters: "¨"
                    },
                    "&UnderBar;": {
                        codepoints: [95],
                        characters: "_"
                    },
                    "&UnderBrace;": {
                        codepoints: [9183],
                        characters: "⏟"
                    },
                    "&UnderBracket;": {
                        codepoints: [9141],
                        characters: "⎵"
                    },
                    "&UnderParenthesis;": {
                        codepoints: [9181],
                        characters: "⏝"
                    },
                    "&Union;": {
                        codepoints: [8899],
                        characters: "⋃"
                    },
                    "&UnionPlus;": {
                        codepoints: [8846],
                        characters: "⊎"
                    },
                    "&Uogon;": {
                        codepoints: [370],
                        characters: "Ų"
                    },
                    "&uogon;": {
                        codepoints: [371],
                        characters: "ų"
                    },
                    "&Uopf;": {
                        codepoints: [120140],
                        characters: "𝕌"
                    },
                    "&uopf;": {
                        codepoints: [120166],
                        characters: "𝕦"
                    },
                    "&UpArrowBar;": {
                        codepoints: [10514],
                        characters: "⤒"
                    },
                    "&uparrow;": {
                        codepoints: [8593],
                        characters: "↑"
                    },
                    "&UpArrow;": {
                        codepoints: [8593],
                        characters: "↑"
                    },
                    "&Uparrow;": {
                        codepoints: [8657],
                        characters: "⇑"
                    },
                    "&UpArrowDownArrow;": {
                        codepoints: [8645],
                        characters: "⇅"
                    },
                    "&updownarrow;": {
                        codepoints: [8597],
                        characters: "↕"
                    },
                    "&UpDownArrow;": {
                        codepoints: [8597],
                        characters: "↕"
                    },
                    "&Updownarrow;": {
                        codepoints: [8661],
                        characters: "⇕"
                    },
                    "&UpEquilibrium;": {
                        codepoints: [10606],
                        characters: "⥮"
                    },
                    "&upharpoonleft;": {
                        codepoints: [8639],
                        characters: "↿"
                    },
                    "&upharpoonright;": {
                        codepoints: [8638],
                        characters: "↾"
                    },
                    "&uplus;": {
                        codepoints: [8846],
                        characters: "⊎"
                    },
                    "&UpperLeftArrow;": {
                        codepoints: [8598],
                        characters: "↖"
                    },
                    "&UpperRightArrow;": {
                        codepoints: [8599],
                        characters: "↗"
                    },
                    "&upsi;": {
                        codepoints: [965],
                        characters: "υ"
                    },
                    "&Upsi;": {
                        codepoints: [978],
                        characters: "ϒ"
                    },
                    "&upsih;": {
                        codepoints: [978],
                        characters: "ϒ"
                    },
                    "&Upsilon;": {
                        codepoints: [933],
                        characters: "Υ"
                    },
                    "&upsilon;": {
                        codepoints: [965],
                        characters: "υ"
                    },
                    "&UpTeeArrow;": {
                        codepoints: [8613],
                        characters: "↥"
                    },
                    "&UpTee;": {
                        codepoints: [8869],
                        characters: "⊥"
                    },
                    "&upuparrows;": {
                        codepoints: [8648],
                        characters: "⇈"
                    },
                    "&urcorn;": {
                        codepoints: [8989],
                        characters: "⌝"
                    },
                    "&urcorner;": {
                        codepoints: [8989],
                        characters: "⌝"
                    },
                    "&urcrop;": {
                        codepoints: [8974],
                        characters: "⌎"
                    },
                    "&Uring;": {
                        codepoints: [366],
                        characters: "Ů"
                    },
                    "&uring;": {
                        codepoints: [367],
                        characters: "ů"
                    },
                    "&urtri;": {
                        codepoints: [9721],
                        characters: "◹"
                    },
                    "&Uscr;": {
                        codepoints: [119984],
                        characters: "𝒰"
                    },
                    "&uscr;": {
                        codepoints: [120010],
                        characters: "𝓊"
                    },
                    "&utdot;": {
                        codepoints: [8944],
                        characters: "⋰"
                    },
                    "&Utilde;": {
                        codepoints: [360],
                        characters: "Ũ"
                    },
                    "&utilde;": {
                        codepoints: [361],
                        characters: "ũ"
                    },
                    "&utri;": {
                        codepoints: [9653],
                        characters: "▵"
                    },
                    "&utrif;": {
                        codepoints: [9652],
                        characters: "▴"
                    },
                    "&uuarr;": {
                        codepoints: [8648],
                        characters: "⇈"
                    },
                    "&Uuml;": {
                        codepoints: [220],
                        characters: "Ü"
                    },
                    "&Uuml": {
                        codepoints: [220],
                        characters: "Ü"
                    },
                    "&uuml;": {
                        codepoints: [252],
                        characters: "ü"
                    },
                    "&uuml": {
                        codepoints: [252],
                        characters: "ü"
                    },
                    "&uwangle;": {
                        codepoints: [10663],
                        characters: "⦧"
                    },
                    "&vangrt;": {
                        codepoints: [10652],
                        characters: "⦜"
                    },
                    "&varepsilon;": {
                        codepoints: [1013],
                        characters: "ϵ"
                    },
                    "&varkappa;": {
                        codepoints: [1008],
                        characters: "ϰ"
                    },
                    "&varnothing;": {
                        codepoints: [8709],
                        characters: "∅"
                    },
                    "&varphi;": {
                        codepoints: [981],
                        characters: "ϕ"
                    },
                    "&varpi;": {
                        codepoints: [982],
                        characters: "ϖ"
                    },
                    "&varpropto;": {
                        codepoints: [8733],
                        characters: "∝"
                    },
                    "&varr;": {
                        codepoints: [8597],
                        characters: "↕"
                    },
                    "&vArr;": {
                        codepoints: [8661],
                        characters: "⇕"
                    },
                    "&varrho;": {
                        codepoints: [1009],
                        characters: "ϱ"
                    },
                    "&varsigma;": {
                        codepoints: [962],
                        characters: "ς"
                    },
                    "&varsubsetneq;": {
                        codepoints: [8842, 65024],
                        characters: "⊊︀"
                    },
                    "&varsubsetneqq;": {
                        codepoints: [10955, 65024],
                        characters: "⫋︀"
                    },
                    "&varsupsetneq;": {
                        codepoints: [8843, 65024],
                        characters: "⊋︀"
                    },
                    "&varsupsetneqq;": {
                        codepoints: [10956, 65024],
                        characters: "⫌︀"
                    },
                    "&vartheta;": {
                        codepoints: [977],
                        characters: "ϑ"
                    },
                    "&vartriangleleft;": {
                        codepoints: [8882],
                        characters: "⊲"
                    },
                    "&vartriangleright;": {
                        codepoints: [8883],
                        characters: "⊳"
                    },
                    "&vBar;": {
                        codepoints: [10984],
                        characters: "⫨"
                    },
                    "&Vbar;": {
                        codepoints: [10987],
                        characters: "⫫"
                    },
                    "&vBarv;": {
                        codepoints: [10985],
                        characters: "⫩"
                    },
                    "&Vcy;": {
                        codepoints: [1042],
                        characters: "В"
                    },
                    "&vcy;": {
                        codepoints: [1074],
                        characters: "в"
                    },
                    "&vdash;": {
                        codepoints: [8866],
                        characters: "⊢"
                    },
                    "&vDash;": {
                        codepoints: [8872],
                        characters: "⊨"
                    },
                    "&Vdash;": {
                        codepoints: [8873],
                        characters: "⊩"
                    },
                    "&VDash;": {
                        codepoints: [8875],
                        characters: "⊫"
                    },
                    "&Vdashl;": {
                        codepoints: [10982],
                        characters: "⫦"
                    },
                    "&veebar;": {
                        codepoints: [8891],
                        characters: "⊻"
                    },
                    "&vee;": {
                        codepoints: [8744],
                        characters: "∨"
                    },
                    "&Vee;": {
                        codepoints: [8897],
                        characters: "⋁"
                    },
                    "&veeeq;": {
                        codepoints: [8794],
                        characters: "≚"
                    },
                    "&vellip;": {
                        codepoints: [8942],
                        characters: "⋮"
                    },
                    "&verbar;": {
                        codepoints: [124],
                        characters: "|"
                    },
                    "&Verbar;": {
                        codepoints: [8214],
                        characters: "‖"
                    },
                    "&vert;": {
                        codepoints: [124],
                        characters: "|"
                    },
                    "&Vert;": {
                        codepoints: [8214],
                        characters: "‖"
                    },
                    "&VerticalBar;": {
                        codepoints: [8739],
                        characters: "∣"
                    },
                    "&VerticalLine;": {
                        codepoints: [124],
                        characters: "|"
                    },
                    "&VerticalSeparator;": {
                        codepoints: [10072],
                        characters: "❘"
                    },
                    "&VerticalTilde;": {
                        codepoints: [8768],
                        characters: "≀"
                    },
                    "&VeryThinSpace;": {
                        codepoints: [8202],
                        characters: " "
                    },
                    "&Vfr;": {
                        codepoints: [120089],
                        characters: "𝔙"
                    },
                    "&vfr;": {
                        codepoints: [120115],
                        characters: "𝔳"
                    },
                    "&vltri;": {
                        codepoints: [8882],
                        characters: "⊲"
                    },
                    "&vnsub;": {
                        codepoints: [8834, 8402],
                        characters: "⊂⃒"
                    },
                    "&vnsup;": {
                        codepoints: [8835, 8402],
                        characters: "⊃⃒"
                    },
                    "&Vopf;": {
                        codepoints: [120141],
                        characters: "𝕍"
                    },
                    "&vopf;": {
                        codepoints: [120167],
                        characters: "𝕧"
                    },
                    "&vprop;": {
                        codepoints: [8733],
                        characters: "∝"
                    },
                    "&vrtri;": {
                        codepoints: [8883],
                        characters: "⊳"
                    },
                    "&Vscr;": {
                        codepoints: [119985],
                        characters: "𝒱"
                    },
                    "&vscr;": {
                        codepoints: [120011],
                        characters: "𝓋"
                    },
                    "&vsubnE;": {
                        codepoints: [10955, 65024],
                        characters: "⫋︀"
                    },
                    "&vsubne;": {
                        codepoints: [8842, 65024],
                        characters: "⊊︀"
                    },
                    "&vsupnE;": {
                        codepoints: [10956, 65024],
                        characters: "⫌︀"
                    },
                    "&vsupne;": {
                        codepoints: [8843, 65024],
                        characters: "⊋︀"
                    },
                    "&Vvdash;": {
                        codepoints: [8874],
                        characters: "⊪"
                    },
                    "&vzigzag;": {
                        codepoints: [10650],
                        characters: "⦚"
                    },
                    "&Wcirc;": {
                        codepoints: [372],
                        characters: "Ŵ"
                    },
                    "&wcirc;": {
                        codepoints: [373],
                        characters: "ŵ"
                    },
                    "&wedbar;": {
                        codepoints: [10847],
                        characters: "⩟"
                    },
                    "&wedge;": {
                        codepoints: [8743],
                        characters: "∧"
                    },
                    "&Wedge;": {
                        codepoints: [8896],
                        characters: "⋀"
                    },
                    "&wedgeq;": {
                        codepoints: [8793],
                        characters: "≙"
                    },
                    "&weierp;": {
                        codepoints: [8472],
                        characters: "℘"
                    },
                    "&Wfr;": {
                        codepoints: [120090],
                        characters: "𝔚"
                    },
                    "&wfr;": {
                        codepoints: [120116],
                        characters: "𝔴"
                    },
                    "&Wopf;": {
                        codepoints: [120142],
                        characters: "𝕎"
                    },
                    "&wopf;": {
                        codepoints: [120168],
                        characters: "𝕨"
                    },
                    "&wp;": {
                        codepoints: [8472],
                        characters: "℘"
                    },
                    "&wr;": {
                        codepoints: [8768],
                        characters: "≀"
                    },
                    "&wreath;": {
                        codepoints: [8768],
                        characters: "≀"
                    },
                    "&Wscr;": {
                        codepoints: [119986],
                        characters: "𝒲"
                    },
                    "&wscr;": {
                        codepoints: [120012],
                        characters: "𝓌"
                    },
                    "&xcap;": {
                        codepoints: [8898],
                        characters: "⋂"
                    },
                    "&xcirc;": {
                        codepoints: [9711],
                        characters: "◯"
                    },
                    "&xcup;": {
                        codepoints: [8899],
                        characters: "⋃"
                    },
                    "&xdtri;": {
                        codepoints: [9661],
                        characters: "▽"
                    },
                    "&Xfr;": {
                        codepoints: [120091],
                        characters: "𝔛"
                    },
                    "&xfr;": {
                        codepoints: [120117],
                        characters: "𝔵"
                    },
                    "&xharr;": {
                        codepoints: [10231],
                        characters: "⟷"
                    },
                    "&xhArr;": {
                        codepoints: [10234],
                        characters: "⟺"
                    },
                    "&Xi;": {
                        codepoints: [926],
                        characters: "Ξ"
                    },
                    "&xi;": {
                        codepoints: [958],
                        characters: "ξ"
                    },
                    "&xlarr;": {
                        codepoints: [10229],
                        characters: "⟵"
                    },
                    "&xlArr;": {
                        codepoints: [10232],
                        characters: "⟸"
                    },
                    "&xmap;": {
                        codepoints: [10236],
                        characters: "⟼"
                    },
                    "&xnis;": {
                        codepoints: [8955],
                        characters: "⋻"
                    },
                    "&xodot;": {
                        codepoints: [10752],
                        characters: "⨀"
                    },
                    "&Xopf;": {
                        codepoints: [120143],
                        characters: "𝕏"
                    },
                    "&xopf;": {
                        codepoints: [120169],
                        characters: "𝕩"
                    },
                    "&xoplus;": {
                        codepoints: [10753],
                        characters: "⨁"
                    },
                    "&xotime;": {
                        codepoints: [10754],
                        characters: "⨂"
                    },
                    "&xrarr;": {
                        codepoints: [10230],
                        characters: "⟶"
                    },
                    "&xrArr;": {
                        codepoints: [10233],
                        characters: "⟹"
                    },
                    "&Xscr;": {
                        codepoints: [119987],
                        characters: "𝒳"
                    },
                    "&xscr;": {
                        codepoints: [120013],
                        characters: "𝓍"
                    },
                    "&xsqcup;": {
                        codepoints: [10758],
                        characters: "⨆"
                    },
                    "&xuplus;": {
                        codepoints: [10756],
                        characters: "⨄"
                    },
                    "&xutri;": {
                        codepoints: [9651],
                        characters: "△"
                    },
                    "&xvee;": {
                        codepoints: [8897],
                        characters: "⋁"
                    },
                    "&xwedge;": {
                        codepoints: [8896],
                        characters: "⋀"
                    },
                    "&Yacute;": {
                        codepoints: [221],
                        characters: "Ý"
                    },
                    "&Yacute": {
                        codepoints: [221],
                        characters: "Ý"
                    },
                    "&yacute;": {
                        codepoints: [253],
                        characters: "ý"
                    },
                    "&yacute": {
                        codepoints: [253],
                        characters: "ý"
                    },
                    "&YAcy;": {
                        codepoints: [1071],
                        characters: "Я"
                    },
                    "&yacy;": {
                        codepoints: [1103],
                        characters: "я"
                    },
                    "&Ycirc;": {
                        codepoints: [374],
                        characters: "Ŷ"
                    },
                    "&ycirc;": {
                        codepoints: [375],
                        characters: "ŷ"
                    },
                    "&Ycy;": {
                        codepoints: [1067],
                        characters: "Ы"
                    },
                    "&ycy;": {
                        codepoints: [1099],
                        characters: "ы"
                    },
                    "&yen;": {
                        codepoints: [165],
                        characters: "¥"
                    },
                    "&yen": {
                        codepoints: [165],
                        characters: "¥"
                    },
                    "&Yfr;": {
                        codepoints: [120092],
                        characters: "𝔜"
                    },
                    "&yfr;": {
                        codepoints: [120118],
                        characters: "𝔶"
                    },
                    "&YIcy;": {
                        codepoints: [1031],
                        characters: "Ї"
                    },
                    "&yicy;": {
                        codepoints: [1111],
                        characters: "ї"
                    },
                    "&Yopf;": {
                        codepoints: [120144],
                        characters: "𝕐"
                    },
                    "&yopf;": {
                        codepoints: [120170],
                        characters: "𝕪"
                    },
                    "&Yscr;": {
                        codepoints: [119988],
                        characters: "𝒴"
                    },
                    "&yscr;": {
                        codepoints: [120014],
                        characters: "𝓎"
                    },
                    "&YUcy;": {
                        codepoints: [1070],
                        characters: "Ю"
                    },
                    "&yucy;": {
                        codepoints: [1102],
                        characters: "ю"
                    },
                    "&yuml;": {
                        codepoints: [255],
                        characters: "ÿ"
                    },
                    "&yuml": {
                        codepoints: [255],
                        characters: "ÿ"
                    },
                    "&Yuml;": {
                        codepoints: [376],
                        characters: "Ÿ"
                    },
                    "&Zacute;": {
                        codepoints: [377],
                        characters: "Ź"
                    },
                    "&zacute;": {
                        codepoints: [378],
                        characters: "ź"
                    },
                    "&Zcaron;": {
                        codepoints: [381],
                        characters: "Ž"
                    },
                    "&zcaron;": {
                        codepoints: [382],
                        characters: "ž"
                    },
                    "&Zcy;": {
                        codepoints: [1047],
                        characters: "З"
                    },
                    "&zcy;": {
                        codepoints: [1079],
                        characters: "з"
                    },
                    "&Zdot;": {
                        codepoints: [379],
                        characters: "Ż"
                    },
                    "&zdot;": {
                        codepoints: [380],
                        characters: "ż"
                    },
                    "&zeetrf;": {
                        codepoints: [8488],
                        characters: "ℨ"
                    },
                    "&ZeroWidthSpace;": {
                        codepoints: [8203],
                        characters: "​"
                    },
                    "&Zeta;": {
                        codepoints: [918],
                        characters: "Ζ"
                    },
                    "&zeta;": {
                        codepoints: [950],
                        characters: "ζ"
                    },
                    "&zfr;": {
                        codepoints: [120119],
                        characters: "𝔷"
                    },
                    "&Zfr;": {
                        codepoints: [8488],
                        characters: "ℨ"
                    },
                    "&ZHcy;": {
                        codepoints: [1046],
                        characters: "Ж"
                    },
                    "&zhcy;": {
                        codepoints: [1078],
                        characters: "ж"
                    },
                    "&zigrarr;": {
                        codepoints: [8669],
                        characters: "⇝"
                    },
                    "&zopf;": {
                        codepoints: [120171],
                        characters: "𝕫"
                    },
                    "&Zopf;": {
                        codepoints: [8484],
                        characters: "ℤ"
                    },
                    "&Zscr;": {
                        codepoints: [119989],
                        characters: "𝒵"
                    },
                    "&zscr;": {
                        codepoints: [120015],
                        characters: "𝓏"
                    },
                    "&zwj;": {
                        codepoints: [8205],
                        characters: "‍"
                    },
                    "&zwnj;": {
                        codepoints: [8204],
                        characters: "‌"
                    }
                },
                o = /^[a-zA-Z0-9]/,
                a = r(/^&[a-zA-Z0-9]/),
                c = r(/^&[a-zA-Z0-9]+;/),
                s = {};
            ! function() {
                var e = {};
                for (var n in t) {
                    var o = n.charAt(1);
                    e[o] = e[o] || [], e[o].push(n.slice(2))
                }
                for (var o in e) s[o] = r(new RegExp("^&" + o + "(?:" + e[o].join("|") + ")"))
            }();
            var i = function(e, t) {
                    var r = e.pos,
                        n = t(e);
                    return e.pos = r, n
                },
                u = function(e, t) {
                    if (!i(e, a)) return null;
                    var r = s[e.rest().charAt(1)],
                        n = null;
                    if (r && (n = i(e, r)), !n) {
                        var u = i(e, c);
                        return u && e.fatal("Invalid character reference: " + u), null
                    }
                    return ";" === n.slice(-1) ? (e.pos += n.length, n) : t && o.test(e.rest().charAt(n.length)) ? null : void e.fatal("Character reference requires semicolon: " + n)
                },
                d = function(e) {
                    return t[e].codepoints
                },
                p = /^[\u0009\u000a\u000c <&]/,
                l = r(/^(?:[xX][0-9a-fA-F]+|[0-9]+);/),
                h = function(e) {
                    for (var t = [131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111], r = 0; r < t.length; r++) e[t[r]] = !0;
                    return e
                }({}),
                f = function(e) {
                    return 0 === e || e >= 128 && 159 >= e || e >= 55296 && 57343 >= e || e >= 1114111 || e >= 1 && 8 >= e || 11 === e || e >= 13 && 31 >= e || e >= 127 && 159 >= e || e >= 64976 && 65007 >= e || 65534 === e || 65535 === e || e >= 65536 && h[e] ? !1 : !0
                };
            n = e.Parse.getCharacterReference = function(e, t, r) {
                if ("&" !== e.peek()) return null;
                var n = e.rest().charAt(1);
                if ("#" === n) {
                    e.pos += 2;
                    var o = l(e);
                    o || e.fatal("Invalid numerical character reference starting with &#");
                    var a;
                    if ("x" === o.charAt(0) || "X" === o.charAt(0)) {
                        for (var c = o.slice(1, -1);
                            "0" === c.charAt(0);) c = c.slice(1);
                        c.length > 6 && e.fatal("Numerical character reference too large: 0x" + c), a = parseInt(c || "0", 16)
                    } else {
                        for (var s = o.slice(0, -1);
                            "0" === s.charAt(0);) s = s.slice(1);
                        s.length > 7 && e.fatal("Numerical character reference too large: " + s), a = parseInt(s || "0", 10)
                    }
                    return f(a) || e.fatal("Illegal codepoint in numerical character reference: &#" + o), {
                        t: "CharRef",
                        v: "&#" + o,
                        cp: [a]
                    }
                }
                if (!n || r && n === r || p.test(n)) return null;
                var i = u(e, t);
                return i ? {
                    t: "CharRef",
                    v: i,
                    cp: d(i)
                } : null
            }
        }.call(this),
        function() {
            var t = /^[\f\n\r\t ]/,
                d = function(e) {
                    return e.replace(/\r\n?/g, "\n")
                };
            o = e.Parse.getComment = function(e) {
                if ("<!--" !== e.rest().slice(0, 4)) return null;
                e.pos += 4;
                var t = e.rest();
                (">" === t.charAt(0) || "->" === t.slice(0, 2)) && e.fatal("HTML comment can't start with > or ->");
                var r = t.indexOf("-->");
                0 > r && e.fatal("Unclosed HTML comment");
                var n = t.slice(0, r);
                return "-" === n.slice(-1) && e.fatal("HTML comment must end at first `--`"), n.indexOf("--") >= 0 && e.fatal("HTML comment cannot contain `--` anywhere"), n.indexOf("\x00") >= 0 && e.fatal("HTML comment cannot contain NULL"), e.pos += r + 3, {
                    t: "Comment",
                    v: d(n)
                }
            };
            var p = function(e) {
                    for (; t.test(e.peek());) e.pos++
                },
                l = function(e) {
                    t.test(e.peek()) || e.fatal("Expected space"), p(e)
                },
                h = function(e) {
                    var t = e.peek();
                    '"' !== t && "'" !== t && e.fatal("Expected single or double quote in DOCTYPE"), e.pos++, e.peek() === t && e.fatal("Malformed DOCTYPE");
                    for (var r, n = ""; r = e.peek(), r !== t;) r && "\x00" !== r && ">" !== r || e.fatal("Malformed DOCTYPE"), n += r, e.pos++;
                    return e.pos++, n
                };
            a = e.Parse.getDoctype = function(r) {
                if ("<!doctype" !== e.asciiLowerCase(r.rest().slice(0, 9))) return null;
                var n = r.pos;
                r.pos += 9, l(r);
                var o = r.peek();
                o && ">" !== o && "\x00" !== o || r.fatal("Malformed DOCTYPE");
                var a = o;
                for (r.pos++; o = r.peek(), !(t.test(o) || ">" === o);) o && "\x00" !== o || r.fatal("Malformed DOCTYPE"), a += o, r.pos++;
                a = e.asciiLowerCase(a), p(r);
                var c = null,
                    s = null;
                if (">" !== r.peek()) {
                    var i = e.asciiLowerCase(r.rest().slice(0, 6));
                    "system" === i ? (r.pos += 6, l(r), c = h(r), p(r), ">" !== r.peek() && r.fatal("Malformed DOCTYPE")) : "public" === i ? (r.pos += 6, l(r), s = h(r), ">" !== r.peek() && (l(r), ">" !== r.peek() && (c = h(r), p(r), ">" !== r.peek() && r.fatal("Malformed DOCTYPE")))) : r.fatal("Expected PUBLIC or SYSTEM in DOCTYPE")
                }
                r.pos++;
                var u = {
                    t: "Doctype",
                    v: r.input.slice(n, r.pos),
                    name: a
                };
                return c && (u.systemId = c), s && (u.publicId = s), u
            };
            var f = r(/^[^&<\u0000][^&<\u0000{]*/);
            c = e.Parse.getHTMLToken = function(e, t) {
                var r = null;
                if (e.getSpecialTag) {
                    for (var c = -1; !r && e.pos > c;) c = e.pos, r = e.getSpecialTag(e, "rcdata" === t ? i.IN_RCDATA : "rawtext" === t ? i.IN_RAWTEXT : i.ELEMENT);
                    if (r) return {
                        t: "Special",
                        v: r
                    }
                }
                var u = f(e);
                if (u) return {
                    t: "Chars",
                    v: d(u)
                };
                var p = e.peek();
                if (!p) return null;
                if ("\x00" === p && e.fatal("Illegal NULL character"), "&" === p) {
                    if ("rawtext" !== t) {
                        var l = n(e);
                        if (l) return l
                    }
                    return e.pos++, {
                        t: "Chars",
                        v: "&"
                    }
                }
                return "<" === e.peek() && t ? (e.pos++, {
                    t: "Chars",
                    v: "<"
                }) : (r = s(e) || o(e) || a(e)) ? r : void e.fatal("Unexpected `<!` directive.")
            };
            var g = r(/^[a-zA-Z][^\f\n\r\t />{]*/),
                m = r(/^>/),
                v = r(/^\//),
                y = r(/^[^>/\u0000"'<=\f\n\r\t ][^\f\n\r\t /=>"'<\u0000]*/),
                E = function(e, t) {
                    return m(e) ? t : v(e) ? (m(e) || e.fatal("Expected `>` after `/`"), t.isSelfClosing = !0, t) : null
                },
                b = function(e, t) {
                    if (e.peek() !== t) return null;
                    e.pos++;
                    for (var r, o = [], a = null;;) {
                        var c, s = e.peek(),
                            u = e.pos;
                        if (s === t) return e.pos++, o;
                        s ? "\x00" === s ? e.fatal("Unexpected NULL character in attribute value") : "&" === s && (r = n(e, !0, t)) ? (o.push(r), a = null) : e.getSpecialTag && ((c = e.getSpecialTag(e, i.IN_ATTRIBUTE)) || e.pos > u) ? c && (o.push({
                            t: "Special",
                            v: c
                        }), a = null) : (a || (a = {
                            t: "Chars",
                            v: ""
                        }, o.push(a)), a.v += "\r" === s ? "\n" : s, e.pos++, "\r" === s && "\n" === e.peek() && e.pos++) : e.fatal("Unclosed quoted attribute in tag")
                    }
                },
                A = function(e) {
                    for (var r, o = [], a = null;;) {
                        var c, s = e.peek(),
                            u = e.pos;
                        if (t.test(s) || ">" === s) return o;
                        s ? "\x00\"'<=`".indexOf(s) >= 0 ? e.fatal("Unexpected character in attribute value") : "&" === s && (r = n(e, !0, ">")) ? (o.push(r), a = null) : e.getSpecialTag && ((c = e.getSpecialTag(e, i.IN_ATTRIBUTE)) || e.pos > u) ? c && (o.push({
                            t: "Special",
                            v: c
                        }), a = null) : (a || (a = {
                            t: "Chars",
                            v: ""
                        }, o.push(a)), a.v += s, e.pos++) : e.fatal("Unclosed attribute in tag")
                    }
                };
            s = e.Parse.getTagToken = function(r) {
                if ("<" !== r.peek() || "!" === r.rest().charAt(1)) return null;
                r.pos++;
                var n = {
                    t: "Tag"
                };
                "/" === r.peek() && (n.isEnd = !0, r.pos++);
                var o = g(r);
                if (o || r.fatal("Expected tag name after `<`"), n.n = e.properCaseTagName(o), "/" === r.peek() && n.isEnd && r.fatal("End tag can't have trailing slash"), E(r, n)) return n;
                if (r.isEOF() && r.fatal("Unclosed `<`"), t.test(r.peek()) || r.fatal("Expected space after tag name"), p(r), "/" === r.peek() && n.isEnd && r.fatal("End tag can't have trailing slash"), E(r, n)) return n;
                for (n.isEnd && r.fatal("End tag can't have attributes"), n.attrs = {};;) {
                    var a = !1,
                        c = r.pos,
                        s = r.getSpecialTag && r.getSpecialTag(r, i.IN_START_TAG);
                    if (s || r.pos > c) s && (n.attrs.$specials = n.attrs.$specials || [], n.attrs.$specials.push({
                        t: "Special",
                        v: s
                    })), a = !0;
                    else {
                        var u = y(r);
                        if (u || r.fatal("Expected attribute name in tag"), u.indexOf("{") >= 0 && r.fatal("Unexpected `{` in attribute name."), u = e.properCaseAttributeName(u), n.attrs.hasOwnProperty(u) && r.fatal("Duplicate attribute in tag: " + u), n.attrs[u] = [], p(r), E(r, n)) return n;
                        var d = r.peek();
                        d || r.fatal("Unclosed <"), "\x00\"'<".indexOf(d) >= 0 && r.fatal("Unexpected character after attribute name in tag"), "=" === d && (r.pos++, p(r), d = r.peek(), d || r.fatal("Unclosed <"), "\x00><=`".indexOf(d) >= 0 && r.fatal("Unexpected character after = in tag"), n.attrs[u] = '"' === d || "'" === d ? b(r, d) : A(r), a = !0)
                    }
                    if (E(r, n)) return n;
                    if (r.isEOF() && r.fatal("Unclosed `<`"), a ? l(r) : p(r), E(r, n)) return n
                }
            }, i = e.TEMPLATE_TAG_POSITION = {
                ELEMENT: 1,
                IN_START_TAG: 2,
                IN_ATTRIBUTE: 3,
                IN_RCDATA: 4,
                IN_RAWTEXT: 5
            }, u = function(r, n) {
                var o = r.rest(),
                    a = 0,
                    c = /^<\/([a-zA-Z]+)/.exec(o);
                if (c && e.properCaseTagName(c[1]) === n) {
                    for (a += c[0].length; a < o.length && t.test(o.charAt(a));) a++;
                    if (a < o.length && ">" === o.charAt(a)) return !0
                }
                return !1
            }
        }.call(this),
        function() {
            e.Special = function(t) {
                return this instanceof e.Special ? void(this.value = t) : new e.Special(t)
            }, e.Special.prototype.toJS = function(e) {
                return h.Tag.prototype.toJS.call({
                    tagName: "HTMLTools.Special",
                    attrs: this.value,
                    children: []
                }, e)
            }, e.parseFragment = function(e, r) {
                var o;
                o = "string" == typeof e ? new t(e) : e, r && r.getSpecialTag && (o.getSpecialTag = r.getSpecialTag);
                var a, s = r && r.shouldStop;
                if (r && r.textMode)
                    if (r.textMode === h.TEXTMODE.STRING) a = n(o, null, s);
                    else {
                        if (r.textMode !== h.TEXTMODE.RCDATA) throw new Error("Unsupported textMode: " + r.textMode);
                        a = l(o, null, s)
                    } else a = p(o, s);
                if (!o.isEOF()) {
                    var i = o.pos;
                    try {
                        var u = c(o)
                    } catch (d) {}
                    if (u && "Tag" === u.t && u.isEnd) {
                        var f = u.n,
                            g = h.isVoidElement(f);
                        o.fatal("Unexpected HTML close tag" + (g ? ".  <" + u.n + "> should have no close tag." : ""))
                    }
                    o.pos = i, s || o.fatal("Expected EOF")
                }
                return a
            }, d = e.codePointToString = function(e) {
                if (e >= 0 && 55295 >= e || e >= 57344 && 65535 >= e) return String.fromCharCode(e);
                if (e >= 65536 && 1114111 >= e) {
                    e -= 65536;
                    var t = ((1047552 & e) >> 10) + 55296,
                        r = (1023 & e) + 56320;
                    return String.fromCharCode(t) + String.fromCharCode(r)
                }
                return ""
            }, p = e.Parse.getContent = function(t, n) {
                for (var s = []; !(t.isEOF() || n && n(t));) {
                    var i = t.pos,
                        u = c(t);
                    if (u)
                        if ("Doctype" === u.t) t.fatal("Unexpected Doctype");
                        else if ("Chars" === u.t) r(s, u.v);
                    else if ("CharRef" === u.t) s.push(o(u));
                    else if ("Comment" === u.t) s.push(h.Comment(u.v));
                    else if ("Special" === u.t) s.push(e.Special(u.v));
                    else if ("Tag" === u.t) {
                        if (u.isEnd) {
                            t.pos = i;
                            break
                        }
                        var d = u.n,
                            f = h.isVoidElement(d);
                        u.isSelfClosing && (f || h.isKnownSVGElement(d) || d.indexOf(":") >= 0 || t.fatal("Only certain elements like BR, HR, IMG, etc. (and foreign elements like SVG) are allowed to self-close"));
                        var g = a(u.attrs),
                            m = h.getTag(d);
                        if (f || u.isSelfClosing) s.push(g ? m(g) : m());
                        else {
                            var v, y = "/>" === t.input.substr(t.pos - 2, 2);
                            "textarea" === u.n ? ("\n" === t.peek() && t.pos++, v = l(t, u.n, n)) : v = p(t, n);
                            var E = c(t);
                            E && "Tag" === E.t && E.isEnd && E.n === d || t.fatal('Expected "' + d + '" end tag' + (y ? ' -- if the "<' + u.n + ' />" tag was supposed to self-close, try adding a space before the "/"' : "")), null == v ? v = [] : v instanceof Array || (v = [v]), s.push(h.getTag(d).apply(null, (g ? [g] : []).concat(v)))
                        }
                    } else t.fatal("Unknown token type: " + u.t)
                }
                return 0 === s.length ? null : 1 === s.length ? s[0] : s
            };
            var r = function(e, t) {
                e.length && "string" == typeof e[e.length - 1] ? e[e.length - 1] += t : e.push(t)
            };
            l = e.Parse.getRCData = function(t, n, a) {
                for (var s = []; !(t.isEOF() || n && u(t, n) || a && a(t));) {
                    var i = c(t, "rcdata");
                    i && ("Chars" === i.t ? r(s, i.v) : "CharRef" === i.t ? s.push(o(i)) : "Special" === i.t ? s.push(e.Special(i.v)) : t.fatal("Unknown or unexpected token type: " + i.t))
                }
                return 0 === s.length ? null : 1 === s.length ? s[0] : s
            };
            var n = function(t, n, o) {
                    for (var a = []; !(t.isEOF() || n && u(t, n) || o && o(t));) {
                        var s = c(t, "rawtext");
                        s && ("Chars" === s.t ? r(a, s.v) : "Special" === s.t ? a.push(e.Special(s.v)) : t.fatal("Unknown or unexpected token type: " + s.t))
                    }
                    return 0 === a.length ? null : 1 === a.length ? a[0] : a
                },
                o = function(e) {
                    for (var t = e.cp, r = "", n = 0; n < t.length; n++) r += d(t[n]);
                    return h.CharRef({
                        html: e.v,
                        str: r
                    })
                },
                a = function(t) {
                    var n = null;
                    for (var a in t) {
                        n || (n = {});
                        for (var c = t[a], s = [], i = 0; i < c.length; i++) {
                            var u = c[i];
                            "CharRef" === u.t ? s.push(o(u)) : "Special" === u.t ? s.push(e.Special(u.v)) : "Chars" === u.t && r(s, u.v)
                        }
                        if ("$specials" === a) n[a] = s;
                        else {
                            var d = 0 === c.length ? "" : 1 === s.length ? s[0] : s,
                                p = e.properCaseAttributeName(a);
                            n[p] = d
                        }
                    }
                    return n
                }
        }.call(this), "undefined" == typeof Package && (Package = {}), Package["html-tools"] = {
            HTMLTools: e
        }
}(),
function() {
    var e, t, r, n, o, a, c = (Package.meteor.Meteor, Package.spacebars.Spacebars),
        s = Package["html-tools"].HTMLTools,
        i = Package.underscore._,
        u = (Package.ui.UI, Package.ui.Handlebars, Package.htmljs.HTML);
    (function() {
        var n = {
                Ll: "0061-007A00B500DF-00F600F8-00FF01010103010501070109010B010D010F01110113011501170119011B011D011F01210123012501270129012B012D012F01310133013501370138013A013C013E014001420144014601480149014B014D014F01510153015501570159015B015D015F01610163016501670169016B016D016F0171017301750177017A017C017E-0180018301850188018C018D019201950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E501E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209020B020D020F02110213021502170219021B021D021F02210223022502270229022B022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-02AF037103730377037B-037D039003AC-03CE03D003D103D5-03D703D903DB03DD03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F04610463046504670469046B046D046F04710473047504770479047B047D047F0481048B048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F104F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513051505170519051B051D051F05210523052505270561-05871D00-1D2B1D6B-1D771D79-1D9A1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E611E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E831E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB41FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF61FF7210A210E210F2113212F21342139213C213D2146-2149214E21842C30-2C5E2C612C652C662C682C6A2C6C2C712C732C742C76-2C7B2C812C832C852C872C892C8B2C8D2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD12CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2CF32D00-2D252D272D2DA641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA661A663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763A765A767A769A76BA76DA76FA771-A778A77AA77CA77FA781A783A785A787A78CA78EA791A793A7A1A7A3A7A5A7A7A7A9A7FAFB00-FB06FB13-FB17FF41-FF5A",
                Lm: "02B0-02C102C6-02D102E0-02E402EC02EE0374037A0559064006E506E607F407F507FA081A0824082809710E460EC610FC17D718431AA71C78-1C7D1D2C-1D6A1D781D9B-1DBF2071207F2090-209C2C7C2C7D2D6F2E2F30053031-3035303B309D309E30FC-30FEA015A4F8-A4FDA60CA67FA717-A71FA770A788A7F8A7F9A9CFAA70AADDAAF3AAF4FF70FF9EFF9F",
                Lo: "00AA00BA01BB01C0-01C3029405D0-05EA05F0-05F20620-063F0641-064A066E066F0671-06D306D506EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA0800-08150840-085808A008A2-08AC0904-0939093D09500958-09610972-09770979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10CF10CF20D05-0D0C0D0E-0D100D12-0D3A0D3D0D4E0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E450E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EDC-0EDF0F000F40-0F470F49-0F6C0F88-0F8C1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10D0-10FA10FD-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317DC1820-18421844-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541B05-1B331B45-1B4B1B83-1BA01BAE1BAF1BBA-1BE51C00-1C231C4D-1C4F1C5A-1C771CE9-1CEC1CEE-1CF11CF51CF62135-21382D30-2D672D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE3006303C3041-3096309F30A1-30FA30FF3105-312D3131-318E31A0-31BA31F0-31FF3400-4DB54E00-9FCCA000-A014A016-A48CA4D0-A4F7A500-A60BA610-A61FA62AA62BA66EA6A0-A6E5A7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2AA00-AA28AA40-AA42AA44-AA4BAA60-AA6FAA71-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADBAADCAAE0-AAEAAAF2AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA6DFA70-FAD9FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF66-FF6FFF71-FF9DFFA0-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
                Lt: "01C501C801CB01F21F88-1F8F1F98-1F9F1FA8-1FAF1FBC1FCC1FFC",
                Lu: "0041-005A00C0-00D600D8-00DE01000102010401060108010A010C010E01100112011401160118011A011C011E01200122012401260128012A012C012E01300132013401360139013B013D013F0141014301450147014A014C014E01500152015401560158015A015C015E01600162016401660168016A016C016E017001720174017601780179017B017D018101820184018601870189-018B018E-0191019301940196-0198019C019D019F01A001A201A401A601A701A901AC01AE01AF01B1-01B301B501B701B801BC01C401C701CA01CD01CF01D101D301D501D701D901DB01DE01E001E201E401E601E801EA01EC01EE01F101F401F6-01F801FA01FC01FE02000202020402060208020A020C020E02100212021402160218021A021C021E02200222022402260228022A022C022E02300232023A023B023D023E02410243-02460248024A024C024E03700372037603860388-038A038C038E038F0391-03A103A3-03AB03CF03D2-03D403D803DA03DC03DE03E003E203E403E603E803EA03EC03EE03F403F703F903FA03FD-042F04600462046404660468046A046C046E04700472047404760478047A047C047E0480048A048C048E04900492049404960498049A049C049E04A004A204A404A604A804AA04AC04AE04B004B204B404B604B804BA04BC04BE04C004C104C304C504C704C904CB04CD04D004D204D404D604D804DA04DC04DE04E004E204E404E604E804EA04EC04EE04F004F204F404F604F804FA04FC04FE05000502050405060508050A050C050E05100512051405160518051A051C051E05200522052405260531-055610A0-10C510C710CD1E001E021E041E061E081E0A1E0C1E0E1E101E121E141E161E181E1A1E1C1E1E1E201E221E241E261E281E2A1E2C1E2E1E301E321E341E361E381E3A1E3C1E3E1E401E421E441E461E481E4A1E4C1E4E1E501E521E541E561E581E5A1E5C1E5E1E601E621E641E661E681E6A1E6C1E6E1E701E721E741E761E781E7A1E7C1E7E1E801E821E841E861E881E8A1E8C1E8E1E901E921E941E9E1EA01EA21EA41EA61EA81EAA1EAC1EAE1EB01EB21EB41EB61EB81EBA1EBC1EBE1EC01EC21EC41EC61EC81ECA1ECC1ECE1ED01ED21ED41ED61ED81EDA1EDC1EDE1EE01EE21EE41EE61EE81EEA1EEC1EEE1EF01EF21EF41EF61EF81EFA1EFC1EFE1F08-1F0F1F18-1F1D1F28-1F2F1F38-1F3F1F48-1F4D1F591F5B1F5D1F5F1F68-1F6F1FB8-1FBB1FC8-1FCB1FD8-1FDB1FE8-1FEC1FF8-1FFB21022107210B-210D2110-211221152119-211D212421262128212A-212D2130-2133213E213F214521832C00-2C2E2C602C62-2C642C672C692C6B2C6D-2C702C722C752C7E-2C802C822C842C862C882C8A2C8C2C8E2C902C922C942C962C982C9A2C9C2C9E2CA02CA22CA42CA62CA82CAA2CAC2CAE2CB02CB22CB42CB62CB82CBA2CBC2CBE2CC02CC22CC42CC62CC82CCA2CCC2CCE2CD02CD22CD42CD62CD82CDA2CDC2CDE2CE02CE22CEB2CED2CF2A640A642A644A646A648A64AA64CA64EA650A652A654A656A658A65AA65CA65EA660A662A664A666A668A66AA66CA680A682A684A686A688A68AA68CA68EA690A692A694A696A722A724A726A728A72AA72CA72EA732A734A736A738A73AA73CA73EA740A742A744A746A748A74AA74CA74EA750A752A754A756A758A75AA75CA75EA760A762A764A766A768A76AA76CA76EA779A77BA77DA77EA780A782A784A786A78BA78DA790A792A7A0A7A2A7A4A7A6A7A8A7AAFF21-FF3A",
                Mc: "0903093B093E-09400949-094C094E094F0982098309BE-09C009C709C809CB09CC09D70A030A3E-0A400A830ABE-0AC00AC90ACB0ACC0B020B030B3E0B400B470B480B4B0B4C0B570BBE0BBF0BC10BC20BC6-0BC80BCA-0BCC0BD70C01-0C030C41-0C440C820C830CBE0CC0-0CC40CC70CC80CCA0CCB0CD50CD60D020D030D3E-0D400D46-0D480D4A-0D4C0D570D820D830DCF-0DD10DD8-0DDF0DF20DF30F3E0F3F0F7F102B102C10311038103B103C105610571062-10641067-106D108310841087-108C108F109A-109C17B617BE-17C517C717C81923-19261929-192B193019311933-193819B0-19C019C819C91A19-1A1B1A551A571A611A631A641A6D-1A721B041B351B3B1B3D-1B411B431B441B821BA11BA61BA71BAA1BAC1BAD1BE71BEA-1BEC1BEE1BF21BF31C24-1C2B1C341C351CE11CF21CF3302E302FA823A824A827A880A881A8B4-A8C3A952A953A983A9B4A9B5A9BAA9BBA9BD-A9C0AA2FAA30AA33AA34AA4DAA7BAAEBAAEEAAEFAAF5ABE3ABE4ABE6ABE7ABE9ABEAABEC",
                Mn: "0300-036F0483-04870591-05BD05BF05C105C205C405C505C70610-061A064B-065F067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0859-085B08E4-08FE0900-0902093A093C0941-0948094D0951-095709620963098109BC09C1-09C409CD09E209E30A010A020A3C0A410A420A470A480A4B-0A4D0A510A700A710A750A810A820ABC0AC1-0AC50AC70AC80ACD0AE20AE30B010B3C0B3F0B41-0B440B4D0B560B620B630B820BC00BCD0C3E-0C400C46-0C480C4A-0C4D0C550C560C620C630CBC0CBF0CC60CCC0CCD0CE20CE30D41-0D440D4D0D620D630DCA0DD2-0DD40DD60E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F71-0F7E0F80-0F840F860F870F8D-0F970F99-0FBC0FC6102D-10301032-10371039103A103D103E10581059105E-10601071-1074108210851086108D109D135D-135F1712-17141732-1734175217531772177317B417B517B7-17BD17C617C9-17D317DD180B-180D18A91920-19221927192819321939-193B1A171A181A561A58-1A5E1A601A621A65-1A6C1A73-1A7C1A7F1B00-1B031B341B36-1B3A1B3C1B421B6B-1B731B801B811BA2-1BA51BA81BA91BAB1BE61BE81BE91BED1BEF-1BF11C2C-1C331C361C371CD0-1CD21CD4-1CE01CE2-1CE81CED1CF41DC0-1DE61DFC-1DFF20D0-20DC20E120E5-20F02CEF-2CF12D7F2DE0-2DFF302A-302D3099309AA66FA674-A67DA69FA6F0A6F1A802A806A80BA825A826A8C4A8E0-A8F1A926-A92DA947-A951A980-A982A9B3A9B6-A9B9A9BCAA29-AA2EAA31AA32AA35AA36AA43AA4CAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1AAECAAEDAAF6ABE5ABE8ABEDFB1EFE00-FE0FFE20-FE26",
                Nd: "0030-00390660-066906F0-06F907C0-07C90966-096F09E6-09EF0A66-0A6F0AE6-0AEF0B66-0B6F0BE6-0BEF0C66-0C6F0CE6-0CEF0D66-0D6F0E50-0E590ED0-0ED90F20-0F291040-10491090-109917E0-17E91810-18191946-194F19D0-19D91A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C59A620-A629A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
                Nl: "16EE-16F02160-21822185-218830073021-30293038-303AA6E6-A6EF",
                Pc: "005F203F20402054FE33FE34FE4D-FE4FFF3F"
            },
            o = function(e) {
                return "[" + n[e].replace(/[0-9A-F]{4}/gi, "\\u$&") + "]"
            },
            a = new RegExp("^([a-zA-Z$_]+|\\\\u[0-9a-fA-F]{4}|" + [o("Lu"), o("Ll"), o("Lt"), o("Lm"), o("Lo"), o("Nl")].join("|") + ")+"),
            s = new RegExp("^([0-9]|" + [o("Mn"), o("Mc"), o("Nd"), o("Pc")].join("|") + ")+"),
            i = /^0[xX][0-9a-fA-F]+(?!\w)/,
            u = /^(((0|[1-9][0-9]*)(\.[0-9]*)?)|\.[0-9]+)([Ee][+-]?[0-9]+)?(?!\w)/,
            d = /^["']/,
            p = /^(?=.)[^"'\\]+?((?!.)|(?=["'\\]))/,
            l = /^\\(['"\\bfnrtv]|0(?![0-9])|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|(?=.)[^ux0-9])/,
            h = /^\\(\r\n|[\u000A\u000D\u2028\u2029])/;
        e = function(e) {
            var t = e.pos,
                r = !1;
            "-" === e.peek() && (e.pos++, r = !0);
            var n = e.rest(),
                o = u.exec(n) || i.exec(n);
            if (!o) return e.pos = t, null;
            var a = o[0];
            e.pos += a.length;
            var c = (r ? "-" : "") + a,
                s = Number(a);
            return s = r ? -s : s, {
                text: c,
                value: s
            }
        }, t = function(e) {
            var t = e.pos,
                r = e.rest(),
                n = a.exec(r);
            if (!n) return null;
            e.pos += n[0].length, r = e.rest();
            for (var o = !0; o;) o = !1, n = s.exec(r), n && (o = !0, e.pos += n[0].length, r = e.rest()), n = a.exec(r), n && (o = !0, e.pos += n[0].length, r = e.rest());
            return e.input.substring(t, e.pos)
        }, r = function(e) {
            var t = e.pos,
                r = e.rest(),
                n = d.exec(r);
            if (!n) return null;
            var o = n[0];
            e.pos++, r = e.rest();
            for (var a = '"'; n;) {
                if (n = p.exec(r)) a += n[0];
                else if (n = l.exec(r)) {
                    var c = n[0];
                    a += "\\0" === c ? "\\u0000" : "\\v" === c ? "\\u000b" : "x" === c.charAt(1) ? "\\u00" + c.slice(2) : "\\'" === c ? "'" : c
                } else if (n = h.exec(r), !n && (n = d.exec(r))) {
                    var s = n[0];
                    s !== o && ('"' === s && (a += "\\"), a += s)
                }
                if (n && (e.pos += n[0].length, r = e.rest(), n[0] === o)) break
            }
            n[0] !== o && e.fatal("Unterminated string literal"), a += '"';
            var i = e.input.substring(t, e.pos),
                u = JSON.parse(a);
            return {
                text: i,
                value: u
            }
        }, c._$ = {
            parseNumber: e,
            parseIdentifierName: t,
            parseStringLiteral: r
        }
    }).call(this),
        function() {
            n = function(e) {
                return JSON.stringify(e).replace(/[\u2028\u2029\ud800-\udfff]/g, function(e) {
                    return "\\u" + ("000" + e.charCodeAt(0).toString(16)).slice(-4)
                })
            };
            var e = function(e) {
                return i.each("abstract else instanceof super boolean enum int switch break export interface synchronized byte extends let this case false long throw catch final native throws char finally new transient class float null true const for package try continue function private typeof debugger goto protected var default if public void delete implements return volatile do import short while double in static with".split(" "), function(t) {
                    e[t] = 1
                }), e
            }({});
            o = function(t) {
                return /^[a-zA-Z$_][a-zA-Z$0-9_]*$/.test(t) && 1 !== e[t] ? t : n(t)
            }, u.Tag.prototype.toJS = function(e) {
                var t = [];
                if (this.attrs) {
                    var r = [];
                    for (var a in this.attrs) u.isNully(this.attrs[a]) || r.push(o(a) + ": " + u.toJS(this.attrs[a], e));
                    r.length && t.push("{" + r.join(", ") + "}")
                }
                for (var c = 0; c < this.children.length; c++) t.push(u.toJS(this.children[c], e));
                var s, i = this.tagName;
                return s = this instanceof u.Tag ? u.isTagEnsured(i) ? "HTML." + u.getSymbolName(i) : "HTML.getTag(" + n(i) + ")" : i.indexOf(".") >= 0 ? i : "HTML." + i, s + "(" + t.join(", ") + ")"
            }, u.CharRef.prototype.toJS = function(e) {
                return u.Tag.prototype.toJS.call({
                    tagName: "CharRef",
                    attrs: {
                        html: this.html,
                        str: this.str
                    },
                    children: []
                }, e)
            }, u.Comment.prototype.toJS = function(e) {
                return u.Tag.prototype.toJS.call({
                    tagName: "Comment",
                    attrs: null,
                    children: [this.value]
                }, e)
            }, u.Raw.prototype.toJS = function(e) {
                return u.Tag.prototype.toJS.call({
                    tagName: "Raw",
                    attrs: null,
                    children: [this.value]
                }, e)
            }, u.EmitCode.prototype.toJS = function() {
                return this.value
            }, u.toJS = function(e, t) {
                if (null == e) return "null";
                if ("string" == typeof e || "boolean" == typeof e || "number" == typeof e) return n(e);
                if (e instanceof Array) {
                    for (var r = [], o = 0; o < e.length; o++) r.push(u.toJS(e[o], t));
                    return "[" + r.join(", ") + "]"
                }
                if (e.toJS) return e.toJS(t);
                throw new Error("Expected tag, string, array, null, undefined, or object with a toJS method; found: " + e)
            }
        }.call(this),
        function() {
            var n = s.TEMPLATE_TAG_POSITION;
            a = c.TemplateTag = function() {};
            var o = function(e) {
                    return new RegExp(e.source + /(?![{>!#/])/.source, e.ignoreCase ? "i" : "")
                },
                d = {
                    ELSE: o(/^\{\{\s*else(?=[\s}])/i),
                    DOUBLE: o(/^\{\{\s*(?!\s)/),
                    TRIPLE: o(/^\{\{\{\s*(?!\s)/),
                    BLOCKCOMMENT: o(/^\{\{\s*!--/),
                    COMMENT: o(/^\{\{\s*!/),
                    INCLUSION: o(/^\{\{\s*>\s*(?!\s)/),
                    BLOCKOPEN: o(/^\{\{\s*#\s*(?!\s)/),
                    BLOCKCLOSE: o(/^\{\{\s*\/\s*(?!\s)/)
                },
                p = {
                    DOUBLE: /^\s*\}\}/,
                    TRIPLE: /^\s*\}\}\}/
                };
            a.parse = function(n) {
                var o = n;
                if ("string" == typeof o && (o = new s.Scanner(n)), "{" !== o.peek() || "{{" !== o.rest().slice(0, 2)) return null;
                var c, u = function(e) {
                        var t = e.exec(o.rest());
                        if (!t) return null;
                        var r = t[0];
                        return o.pos += r.length, r
                    },
                    l = function(e) {
                        var r = t(o);
                        return r || y("IDENTIFIER"), !e || "null" !== r && "true" !== r && "false" !== r || o.fatal("Can't use null, true, or false, as an identifier at start of path"), r
                    },
                    h = function() {
                        var e, t = [];
                        if (e = u(/^[\.\/]+/)) {
                            var r = ".",
                                n = /\/$/.test(e);
                            if (n && (e = e.slice(0, -1)), i.each(e.split("/"), function(e, t) {
                                    0 === t ? "." !== e && ".." !== e && y("`.`, `..`, `./` or `../`") : ".." !== e && y("`..` or `../`"), ".." === e && (r += ".")
                                }), t.push(r), !n) return t
                        }
                        for (;;) {
                            if (u(/^\[/)) {
                                var o = u(/^[\s\S]*?\]/);
                                o || v("Unterminated path segment"), o = o.slice(0, -1), o || t.length || v("Path can't start with empty string"), t.push(o)
                            } else {
                                var a = l(!t.length);
                                "this" === a ? t.length ? v("Can only use `this` at the beginning of a path.\nInstead of `foo.this` or `../this`, just write `foo` or `..`.") : t.push(".") : t.push(a)
                            }
                            var c = u(/^[\.\/]/);
                            if (!c) break
                        }
                        return t
                    },
                    f = function() {
                        var e = /^([^\{\}\(\)\>#=\s]+)\s*=\s*/.exec(o.rest());
                        return e ? (o.pos += e[0].length, e[1]) : null
                    },
                    g = function() {
                        var e = f(),
                            t = m();
                        return e ? t.concat(e) : t
                    },
                    m = function() {
                        var n, a = o.pos;
                        if (n = e(o)) return ["NUMBER", n.value];
                        if (n = r(o)) return ["STRING", n.value];
                        if (/^[\.\[]/.test(o.peek())) return ["PATH", h()];
                        if (n = t(o)) {
                            var c = n;
                            return "null" === c ? ["NULL", null] : "true" === c || "false" === c ? ["BOOLEAN", "true" === c] : (o.pos = a, ["PATH", h()])
                        }
                        y("identifier, number, string, boolean, or null")
                    },
                    v = function(e) {
                        o.fatal(e)
                    },
                    y = function(e) {
                        v("Expected " + e)
                    };
                u(d.ELSE) ? c = "ELSE" : u(d.DOUBLE) ? c = "DOUBLE" : u(d.TRIPLE) ? c = "TRIPLE" : u(d.BLOCKCOMMENT) ? c = "BLOCKCOMMENT" : u(d.COMMENT) ? c = "COMMENT" : u(d.INCLUSION) ? c = "INCLUSION" : u(d.BLOCKOPEN) ? c = "BLOCKOPEN" : u(d.BLOCKCLOSE) ? c = "BLOCKCLOSE" : v("Unknown stache tag");
                var E = new a;
                if (E.type = c, "BLOCKCOMMENT" === c) {
                    var b = u(/^[\s\S]*?--\s*?\}\}/);
                    b || v("Unclosed block comment"), E.value = b.slice(0, b.lastIndexOf("--"))
                } else if ("COMMENT" === c) {
                    var b = u(/^[\s\S]*?\}\}/);
                    b || v("Unclosed comment"), E.value = b.slice(0, -2)
                } else if ("BLOCKCLOSE" === c) E.path = h(), u(p.DOUBLE) || y("`}}`");
                else if ("ELSE" === c) u(p.DOUBLE) || y("`}}`");
                else {
                    E.path = h(), E.args = [];
                    for (var A = !1;;) {
                        if (u(/^\s*/), "TRIPLE" === c) {
                            if (u(p.TRIPLE)) break;
                            "}" === o.peek() && y("`}}}`")
                        } else {
                            if (u(p.DOUBLE)) break;
                            "}" === o.peek() && y("`}}`")
                        }
                        var C = g();
                        3 === C.length ? A = !0 : A && v("Can't have a non-keyword argument after a keyword argument"), E.args.push(C), "" !== u(/^(?=[\s}])/) && y("space")
                    }
                }
                return E
            }, a.peek = function(e) {
                var t = e.pos,
                    r = a.parse(e);
                return e.pos = t, r
            }, a.parseCompleteTag = function(e, t) {
                var r = e;
                "string" == typeof r && (r = new s.Scanner(e));
                var o = r.pos,
                    c = a.parse(e);
                if (!c) return c;
                if ("BLOCKCOMMENT" === c.type) return null;
                if ("COMMENT" === c.type) return null;
                if ("ELSE" === c.type && r.fatal("Unexpected {{else}}"), "BLOCKCLOSE" === c.type && r.fatal("Unexpected closing template tag"), t = t || n.ELEMENT, t !== n.ELEMENT && (c.position = t), "BLOCKOPEN" === c.type) {
                    var i = c.path.join(","),
                        d = null;
                    "markdown" === i || t === n.IN_RAWTEXT ? d = u.TEXTMODE.STRING : (t === n.IN_RCDATA || t === n.IN_ATTRIBUTE) && (d = u.TEXTMODE.RCDATA);
                    var p = {
                        getSpecialTag: a.parseCompleteTag,
                        shouldStop: l,
                        textMode: d
                    };
                    c.content = s.parseFragment(r, p), "{{" !== r.rest().slice(0, 2) && r.fatal("Expected {{else}} or block close for " + i);
                    var f = r.pos,
                        g = a.parse(r);
                    if ("ELSE" === g.type && (c.elseContent = s.parseFragment(r, p), "{{" !== r.rest().slice(0, 2) && r.fatal("Expected block close for " + i), f = r.pos, g = a.parse(r)), "BLOCKCLOSE" === g.type) {
                        var m = g.path.join(",");
                        i !== m && (r.pos = f, r.fatal("Expected tag to close " + i + ", found " + m))
                    } else r.pos = f, r.fatal("Expected tag to close " + i + ", found " + g.type)
                }
                var v = r.pos;
                return r.pos = o, h(c, r), r.pos = v, c
            };
            var l = function(e) {
                    var t, r;
                    return "{" === e.peek() && "{{" === (t = e.rest()).slice(0, 2) && /^\{\{\s*(\/|else\b)/.test(t) && (r = a.peek(e).type) && ("BLOCKCLOSE" === r || "ELSE" === r)
                },
                h = function(e, t) {
                    if ("INCLUSION" === e.type || "BLOCKOPEN" === e.type) {
                        var r = e.args;
                        r.length > 1 && 2 === r[0].length && "PATH" !== r[0][0] && t.fatal("First argument must be a function, to be called on the rest of the arguments; found " + r[0][0])
                    }
                    var o = e.position || n.ELEMENT;
                    if (o === n.IN_ATTRIBUTE) {
                        if ("DOUBLE" === e.type) return;
                        if ("BLOCKOPEN" === e.type) {
                            var a = e.path,
                                c = a[0];
                            (1 !== a.length || "if" !== c && "unless" !== c && "with" !== c && "each" !== c) && t.fatal("Custom block helpers are not allowed in an HTML attribute, only built-in ones like #each and #if")
                        } else t.fatal(e.type + " template tag is not allowed in an HTML attribute")
                    } else o === n.IN_START_TAG && ("DOUBLE" !== e.type && t.fatal("Reactive HTML attributes must either have a constant name or consist of a single {{helper}} providing a dictionary of names and values.  A template tag of type " + e.type + " is not allowed here."), "=" === t.peek() && t.fatal("Template tags are not allowed in attribute names, only in attribute values or in the form of a single {{helper}} that evaluates to a dictionary of name=value pairs."))
                }
        }.call(this),
        function() {
            c.parse = function(e) {
                var t = s.parseFragment(e, {
                    getSpecialTag: a.parseCompleteTag
                });
                return t
            };
            var e = function(e) {
                    var t = function(e, t) {
                            var r = e.length;
                            r > 0 && e[r - 1] instanceof u.Raw ? e[r - 1] = u.Raw(e[r - 1].value + t) : e.push(u.Raw(t))
                        },
                        r = function(e) {
                            return e.indexOf("&") < 0 && e.indexOf("<") < 0
                        },
                        n = function(e, n, o) {
                            var a = null;
                            o && (a = []);
                            for (var c = 0, s = e.length; s > c; c++) {
                                var i = n(e[c]);
                                if (null !== i) {
                                    if (null === a) {
                                        a = [];
                                        for (var d = 0; c > d; d++) t(a, u.toHTML(e[d]))
                                    }
                                    a.push(i)
                                } else null !== a && t(a, u.toHTML(e[c]))
                            }
                            if (null !== a)
                                for (var d = 0; d < a.length; d++) a[d] instanceof u.Raw && r(a[d].value) && (a[d] = a[d].value);
                            return a
                        },
                        o = function(e) {
                            if (e instanceof s.Special) return !0;
                            if ("function" == typeof e) return !0;
                            if (e instanceof Array) {
                                for (var t = 0; t < e.length; t++)
                                    if (o(e[t])) return !0;
                                return !1
                            }
                            return !1
                        },
                        a = function(e) {
                            if (null == e || "string" == typeof e || e instanceof u.CharRef || e instanceof u.Comment || e instanceof u.Raw) return null;
                            if (e instanceof u.Tag) {
                                var t = e.tagName;
                                if ("textarea" === t || !u.isKnownElement(t) || u.isKnownSVGElement(t)) return e;
                                var r = !1;
                                if ("table" === t && (r = !0), e.attrs && !r) {
                                    var c = e.attrs;
                                    for (var s in c)
                                        if (o(c[s])) {
                                            r = !0;
                                            break
                                        }
                                }
                                var i = n(e.children, a, r);
                                if (null === i) return null;
                                var d = u.getTag(e.tagName).apply(null, i);
                                return d.attrs = e.attrs, d
                            }
                            return e instanceof Array ? n(e, a) : e
                        },
                        c = a(e);
                    return null !== c ? c : (c = u.Raw(u.toHTML(e)), r(c.value) ? c.value : c)
                },
                t = {
                    "if": "UI.If",
                    unless: "UI.Unless",
                    "with": "Spacebars.With",
                    each: "UI.Each"
                },
                r = {
                    contentBlock: "template.__content",
                    elseBlock: "template.__elseContent"
                };
            c.isReservedName = function(e) {
                return t.hasOwnProperty(e)
            };
            var d = function(e) {
                    if (e.position === s.TEMPLATE_TAG_POSITION.IN_START_TAG) return u.EmitCode("function () { return " + f(e.path, e.args, "attrMustache") + "; }");
                    if ("DOUBLE" === e.type) return u.EmitCode("function () { return " + f(e.path, e.args) + "; }");
                    if ("TRIPLE" === e.type) return u.EmitCode("function () { return Spacebars.makeRaw(" + f(e.path, e.args) + "); }");
                    if ("INCLUSION" === e.type || "BLOCKOPEN" === e.type) {
                        var r = e.path;
                        if ("BLOCKOPEN" === e.type && t.hasOwnProperty(r[0])) {
                            if (r.length > 1) throw new Error("Unexpected dotted path beginning with " + r[0]);
                            if (!e.args.length) throw new Error("#" + r[0] + " requires an argument");
                            var n = m(e),
                                o = n.dataFunc,
                                a = n.content,
                                i = n.elseContent,
                                d = [o, a];
                            return i && d.push(i), u.EmitCode(t[r[0]] + "(" + d.join(", ") + ")")
                        }
                        var p = l(r, {
                            lookupTemplate: !0
                        });
                        1 !== r.length && (p = "function () { return " + p + "; }");
                        var n = m(e),
                            o = n.dataFunc,
                            h = n.content,
                            g = n.elseContent,
                            v = [p];
                        h && (v.push(h), g && v.push(g));
                        var y = "Spacebars.include(" + v.join(", ") + ")";
                        return o && (y = "Spacebars.TemplateWith(" + o + ", UI.block(" + c.codeGen(u.EmitCode(y)) + "))"), "UI" !== r[0] || "contentBlock" !== r[1] && "elseBlock" !== r[1] || (y = "UI.InTemplateScope(template, " + y + ")"), u.EmitCode(y)
                    }
                    throw new Error("Unexpected template tag type: " + e.type)
                },
                p = function(e) {
                    var t = [];
                    for (var r in e) t.push(o(r) + ": " + e[r]);
                    return "{" + t.join(", ") + "}"
                },
                l = function(e, o) {
                    if (t.hasOwnProperty(e[0])) throw new Error("Can't use the built-in '" + e[0] + "' here");
                    if (e.length >= 2 && "UI" === e[0] && r.hasOwnProperty(e[1])) {
                        if (e.length > 2) throw new Error("Unexpected dotted path beginning with " + e[0] + "." + e[1]);
                        return r[e[1]]
                    }
                    var a = [n(e[0])],
                        c = "lookup";
                    o && o.lookupTemplate && 1 === e.length && (c = "lookupTemplate");
                    var s = "self." + c + "(" + a.join(", ") + ")";
                    return e.length > 1 && (s = "Spacebars.dot(" + s + ", " + i.map(e.slice(1), n).join(", ") + ")"), s
                },
                h = function(e) {
                    var t, r = e[0],
                        o = e[1];
                    switch (r) {
                        case "STRING":
                        case "NUMBER":
                        case "BOOLEAN":
                        case "NULL":
                            t = n(o);
                            break;
                        case "PATH":
                            t = l(o);
                            break;
                        default:
                            throw new Error("Unexpected arg type: " + r)
                    }
                    return t
                },
                f = function(e, t, r) {
                    var n = l(e),
                        o = g(t),
                        a = r || "mustache";
                    return "Spacebars." + a + "(" + n + (o ? ", " + o.join(", ") : "") + ")"
                },
                g = function(e) {
                    var t = null,
                        r = null;
                    return i.each(e, function(e) {
                        var n = h(e);
                        e.length > 2 ? (t = t || {}, t[e[2]] = n) : (r = r || [], r.push(n))
                    }), t && (r = r || [], r.push("Spacebars.kw(" + p(t) + ")")), r
                },
                m = function(e) {
                    var t = {};
                    "content" in e && (t.content = "UI.block(" + c.codeGen(e.content) + ")"), "elseContent" in e && (t.elseContent = "UI.block(" + c.codeGen(e.elseContent) + ")");
                    var r = null,
                        n = e.args;
                    if (!n.length) return t;
                    if (3 === n[0].length) {
                        var o = {};
                        i.each(n, function(e) {
                            var t = e[2];
                            o[t] = "Spacebars.call(" + h(e) + ")"
                        }), r = p(o)
                    } else r = "PATH" !== n[0][0] ? h(n[0]) : 1 === n.length ? "Spacebars.call(" + l(n[0][1]) + ")" : f(n[0][1], n.slice(1), "dataMustache");
                    return t.dataFunc = "function () { return " + r + "; }", t
                },
                v = function(e) {
                    if (e instanceof u.Tag) {
                        var t = i.map(e.children, v),
                            r = u.getTag(e.tagName).apply(null, t),
                            n = e.attrs,
                            o = null;
                        return n && (i.each(n, function(e, t) {
                            "$" !== t.charAt(0) && (o = o || {}, o[t] = v(e))
                        }), n.$specials && n.$specials.length && (o = o || {}, o.$dynamic = i.map(n.$specials, function(e) {
                            return d(e.value)
                        }))), r.attrs = o, r
                    }
                    return e instanceof Array ? i.map(e, v) : e instanceof s.Special ? d(e.value) : e
                };
            c.compile = function(e, t) {
                var r = c.parse(e);
                return c.codeGen(r, t)
            }, c.codeGen = function(t, r) {
                var n = r && r.isTemplate,
                    o = t;
                (n || r && r.isBody) && (o = e(o)), o = v(o);
                var a = "(function () { var self = this; ";
                return n && (a += "var template = this; "), a += "return ", a += u.toJS(o), a += "; })", a = y(a)
            };
            var y = function(e) {
                if (Package.minifiers && Package.minifiers.UglifyJSMinify) {
                    var t = UglifyJSMinify(e, {
                            fromString: !0,
                            mangle: !1,
                            compress: !1,
                            output: {
                                beautify: !0,
                                indent_level: 2,
                                width: 80
                            }
                        }),
                        r = t.code;
                    return r = r.replace(/;$/, "")
                }
                return e
            };
            c._beautify = y
        }.call(this), "undefined" == typeof Package && (Package = {}), Package["spacebars-compiler"] = {}
}(), Template = Package.templating.Template, $ = Package.jquery.$, jQuery = Package.jquery.jQuery, Meteor = Package.meteor.Meteor, UI = Package.ui.UI, Handlebars = Package.ui.Handlebars, Spacebars = Package.spacebars.Spacebars, HTMLTools = Package["html-tools"].HTMLTools, HTML = Package.htmljs.HTML;
$("script[type='text/spacebars']").each(function(index, script) {
    var name = script.getAttribute('name');
    Template.__define__(name, Renderers[name]);
});

$(document).ready(function() {
    if (Template.main) {
        UI.insert(UI.render(Template.main), document.body);
    }
});

Deps = Package.deps.Deps;
Blaze = {};
Blaze.Var = function(initVal) {
    if (!(this instanceof Blaze.Var))
        return new Blaze.Var(initVal);
    this._dep = new Deps.Dependency;
    this._value = initVal;
};

Blaze.Var.prototype.get = function() {
    this._dep.depend();
    return this._value;
};

Blaze.Var.prototype.set = function(val) {
    if (this._value === val)
        return val;
    this._dep.changed();
    this._value = val;
};
