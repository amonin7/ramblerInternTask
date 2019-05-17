!function() {
    "use strict";
    function o(t) {
        throw new Error('"' + t + '" is read-only')
    }
    function d(t, e) {
        return function(t) {
                if (Array.isArray(t))
                    return t
            }(t) || function(t, e) {
                var n = [],
                    o = !0,
                    r = !1,
                    i = void 0;
                try {
                    for (var a, s = t[Symbol.iterator](); !(o = (a = s.next()).done) && (n.push(a.value), !e || n.length !== e); o = !0)
                        ;
                } catch (t) {
                    r = !0, i = t
                } finally {
                    try {
                        o || null == s.return || s.return()
                    } finally {
                        if (r)
                            throw i
                    }
                }
                return n
            }(t, e) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }()
    }
    !function(v, m) {
        function u(t) {
            this.time = t.time, this.target = t.target, this.rootBounds = t.rootBounds, this.boundingClientRect = t.boundingClientRect, this.intersectionRect = t.intersectionRect || {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: 0,
                height: 0
            }, this.isIntersecting = !!t.intersectionRect;
            var e = this.boundingClientRect,
                n = e.width * e.height,
                o = this.intersectionRect,
                r = o.width * o.height;
            this.intersectionRatio = n ? Number((r / n).toFixed(4)) : this.isIntersecting ? 1 : 0
        }
        function t(t, e) {
            var n,
                o,
                r,
                i = e || {};
            if ("function" != typeof t)
                throw new Error("callback must be a function");
            if (i.root && 1 != i.root.nodeType)
                throw new Error("root must be an Element");
            this._checkForIntersections = (n = this._checkForIntersections.bind(this), o = this.THROTTLE_TIMEOUT, r = null, function() {
                r || (r = setTimeout(function() {
                    n(), r = null
                }, o))
            }), this._callback = t, this._observationTargets = [], this._queuedEntries = [], this._rootMarginValues = this._parseRootMargin(i.rootMargin), this.thresholds = this._initThresholds(i.threshold), this.root = i.root || null, this.rootMargin = this._rootMarginValues.map(function(t) {
                return t.value + t.unit
            }).join(" ")
        }
        function e(t, e, n, o) {
            "function" == typeof t.addEventListener ? t.addEventListener(e, n, o || !1) : "function" == typeof t.attachEvent && t.attachEvent("on" + e, n)
        }
        function n(t, e, n, o) {
            "function" == typeof t.removeEventListener ? t.removeEventListener(e, n, o || !1) : "function" == typeof t.detatchEvent && t.detatchEvent("on" + e, n)
        }
        function y(t) {
            var e;
            try {
                e = t.getBoundingClientRect()
            } catch (t) {}
            return e ? (e.width && e.height || (e = {
                top: e.top,
                right: e.right,
                bottom: e.bottom,
                left: e.left,
                width: e.right - e.left,
                height: e.bottom - e.top
            }), e) : {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: 0,
                height: 0
            }
        }
        function o(t, e) {
            for (var n = e; n;) {
                if (n == t)
                    return !0;
                n = g(n)
            }
            return !1
        }
        function g(t) {
            var e = t.parentNode;
            return e && 11 == e.nodeType && e.host ? e.host : e
        }
        "IntersectionObserver" in v && "IntersectionObserverEntry" in v && "intersectionRatio" in v.IntersectionObserverEntry.prototype ? "isIntersecting" in v.IntersectionObserverEntry.prototype || Object.defineProperty(v.IntersectionObserverEntry.prototype, "isIntersecting", {
            get: function() {
                return 0 < this.intersectionRatio
            }
        }) : (t.prototype.THROTTLE_TIMEOUT = 100, t.prototype.POLL_INTERVAL = null, t.prototype.USE_MUTATION_OBSERVER = !0, t.prototype.observe = function(e) {
            if (!this._observationTargets.some(function(t) {
                return t.element == e
            })) {
                if (!e || 1 != e.nodeType)
                    throw new Error("target must be an Element");
                this._registerInstance(), this._observationTargets.push({
                    element: e,
                    entry: null
                }), this._monitorIntersections(), this._checkForIntersections()
            }
        }, t.prototype.unobserve = function(e) {
            this._observationTargets = this._observationTargets.filter(function(t) {
                return t.element != e
            }), this._observationTargets.length || (this._unmonitorIntersections(), this._unregisterInstance())
        }, t.prototype.disconnect = function() {
            this._observationTargets = [], this._unmonitorIntersections(), this._unregisterInstance()
        }, t.prototype.takeRecords = function() {
            var t = this._queuedEntries.slice();
            return this._queuedEntries = [], t
        }, t.prototype._initThresholds = function(t) {
            var e = t || [0];
            return Array.isArray(e) || (e = [e]), e.sort().filter(function(t, e, n) {
                if ("number" != typeof t || isNaN(t) || t < 0 || 1 < t)
                    throw new Error("threshold must be a number between 0 and 1 inclusively");
                return t !== n[e - 1]
            })
        }, t.prototype._parseRootMargin = function(t) {
            var e = (t || "0px").split(/\s+/).map(function(t) {
                var e = /^(-?\d*\.?\d+)(px|%)$/.exec(t);
                if (!e)
                    throw new Error("rootMargin must be specified in pixels or percent");
                return {
                    value: parseFloat(e[1]),
                    unit: e[2]
                }
            });
            return e[1] = e[1] || e[0], e[2] = e[2] || e[0], e[3] = e[3] || e[1], e
        }, t.prototype._monitorIntersections = function() {
            this._monitoringIntersections || (this._monitoringIntersections = !0, this.POLL_INTERVAL ? this._monitoringInterval = setInterval(this._checkForIntersections, this.POLL_INTERVAL) : (e(v, "resize", this._checkForIntersections, !0), e(m, "scroll", this._checkForIntersections, !0), this.USE_MUTATION_OBSERVER && "MutationObserver" in v && (this._domObserver = new MutationObserver(this._checkForIntersections), this._domObserver.observe(m, {
                attributes: !0,
                childList: !0,
                characterData: !0,
                subtree: !0
            }))))
        }, t.prototype._unmonitorIntersections = function() {
            this._monitoringIntersections && (this._monitoringIntersections = !1, clearInterval(this._monitoringInterval), this._monitoringInterval = null, n(v, "resize", this._checkForIntersections, !0), n(m, "scroll", this._checkForIntersections, !0), this._domObserver && (this._domObserver.disconnect(), this._domObserver = null))
        }, t.prototype._checkForIntersections = function() {
            var s = this._rootIsInDom(),
                c = s ? this._getRootRect() : {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: 0,
                    height: 0
                };
            this._observationTargets.forEach(function(t) {
                var e = t.element,
                    n = y(e),
                    o = this._rootContainsTarget(e),
                    r = t.entry,
                    i = s && o && this._computeTargetAndRootIntersection(e, c),
                    a = t.entry = new u({
                        time: v.performance && performance.now && performance.now(),
                        target: e,
                        boundingClientRect: n,
                        rootBounds: c,
                        intersectionRect: i
                    });
                r ? s && o ? this._hasCrossedThreshold(r, a) && this._queuedEntries.push(a) : r && r.isIntersecting && this._queuedEntries.push(a) : this._queuedEntries.push(a)
            }, this), this._queuedEntries.length && this._callback(this.takeRecords(), this)
        }, t.prototype._computeTargetAndRootIntersection = function(t, e) {
            if ("none" != v.getComputedStyle(t).display) {
                for (var n, o, r, i, a, s, c, u, l = y(t), d = g(t), h = !1; !h;) {
                    var f = null,
                        p = 1 == d.nodeType ? v.getComputedStyle(d) : {};
                    if ("none" == p.display)
                        return;
                    if (d == this.root || d == m ? (h = !0, f = e) : d != m.body && d != m.documentElement && "visible" != p.overflow && (f = y(d)), f && (n = f, o = l, void 0, r = Math.max(n.top, o.top), i = Math.min(n.bottom, o.bottom), a = Math.max(n.left, o.left), s = Math.min(n.right, o.right), u = i - r, !(l = 0 <= (c = s - a) && 0 <= u && {
                        top: r,
                        bottom: i,
                        left: a,
                        right: s,
                        width: c,
                        height: u
                    })))
                        break;
                    d = g(d)
                }
                return l
            }
        }, t.prototype._getRootRect = function() {
            var t;
            if (this.root)
                t = y(this.root);
            else {
                var e = m.documentElement,
                    n = m.body;
                t = {
                    top: 0,
                    left: 0,
                    right: e.clientWidth || n.clientWidth,
                    width: e.clientWidth || n.clientWidth,
                    bottom: e.clientHeight || n.clientHeight,
                    height: e.clientHeight || n.clientHeight
                }
            }
            return this._expandRectByRootMargin(t)
        }, t.prototype._expandRectByRootMargin = function(n) {
            var t = this._rootMarginValues.map(function(t, e) {
                    return "px" == t.unit ? t.value : t.value * (e % 2 ? n.width : n.height) / 100
                }),
                e = {
                    top: n.top - t[0],
                    right: n.right + t[1],
                    bottom: n.bottom + t[2],
                    left: n.left - t[3]
                };
            return e.width = e.right - e.left, e.height = e.bottom - e.top, e
        }, t.prototype._hasCrossedThreshold = function(t, e) {
            var n = t && t.isIntersecting ? t.intersectionRatio || 0 : -1,
                o = e.isIntersecting ? e.intersectionRatio || 0 : -1;
            if (n !== o)
                for (var r = 0; r < this.thresholds.length; r++) {
                    var i = this.thresholds[r];
                    if (i == n || i == o || i < n != i < o)
                        return !0
                }
        }, t.prototype._rootIsInDom = function() {
            return !this.root || o(m, this.root)
        }, t.prototype._rootContainsTarget = function(t) {
            return o(this.root || m, t)
        }, t.prototype._registerInstance = function() {}, t.prototype._unregisterInstance = function() {}, v.IntersectionObserver = t, v.IntersectionObserverEntry = u)
    }(window, document);
    var T = function(t, e, n) {
            var o = !(3 < arguments.length && void 0 !== arguments[3]) || arguments[3];
            null != t && t.addEventListener(e, n, {
                passive: o,
                useCapture: !1
            })
        },
        l = function(t, e, n) {
            null != t && t.removeEventListener(e, n)
        },
        r = function(t, e, n, o) {
            var r;
            "add" === t && (r = T), "remove" === t && (r = l);
            for (var i = document.querySelectorAll(e), a = n.split(" "), s = 0; s < i.length; s++) {
                var c = i[s];
                if (null != c)
                    if (1 === a.length)
                        r(c, n, o);
                    else
                        for (var u = 0; u < a.length; u++)
                            r(c, a[u], o)
            }
        },
        E = function(t, e, n) {
            !(3 < arguments.length && void 0 !== arguments[3]) || arguments[3];
            return r("add", t, e, n)
        },
        i = function(t) {
            var e,
                n = (e = t, {
                    year: parseInt(e.substr(0, 4)),
                    month: parseInt(e.substr(4, 2), 10),
                    day: parseInt(e.substr(6, 2))
                });
            return new Date(n.year, n.month - 1, n.day)
        },
        D = function(t) {
            return t.getBoundingClientRect()
        },
        S = function(t) {
            var e = !1;
            return function() {
                e || (e = !0, window.requestAnimationFrame(function() {
                    t(), e = !1
                }))
            }
        },
        a = function(t, e) {
            var n,
                o,
                r,
                i,
                a,
                s,
                c = t,
                u = e || function(t) {};
            T(c, "touchstart", function(t) {
                var e = t.changedTouches[0];
                n = "none", o = e.pageX, r = e.pageY, s = (new Date).getTime()
            }), T(c, "touchend", function(t) {
                var e = t.changedTouches[0];
                i = e.pageX - o, a = e.pageY - r, (new Date).getTime() - s <= 300 && (150 <= Math.abs(i) && Math.abs(a) <= 100 ? n = i < 0 ? "left" : "right" : 150 <= Math.abs(a) && Math.abs(i) <= 100 && (n = a < 0 ? "up" : "down")), u(t, n)
            })
        },
        h = function() {
            var i = new IntersectionObserver(function(t) {
                    for (var e = 0; e < t.length; e++) {
                        var n = t[e];
                        0 < n.intersectionRatio && (i.unobserve(n.target), o = n.target, void 0 !== (r = o.dataset.src) && (o.setAttribute("src", r), o.removeAttribute("data-src")), o.onerror = function(t) {
                            t.currentTarget.style.opacity = 0
                        })
                    }
                    var o,
                        r
                }, {
                    root: null,
                    rootMargin: "20px 0px",
                    threshold: .9
                }),
                t = document.querySelectorAll("[data-src]");
            if (t.length)
                for (var e = 0; e < t.length; e++)
                    i.observe(t[e])
        },
        n = "URLSearchParams" in self,
        s = "Symbol" in self && "iterator" in Symbol,
        c = "FileReader" in self && "Blob" in self && function() {
            try {
                return new Blob, !0
            } catch (t) {
                return !1
            }
        }(),
        u = "FormData" in self,
        f = "ArrayBuffer" in self;
    if (f)
        var e = ["[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]"],
            p = ArrayBuffer.isView || function(t) {
                return t && -1 < e.indexOf(Object.prototype.toString.call(t))
            };
    function v(t) {
        if ("string" != typeof t && (t = String(t)), /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t))
            throw new TypeError("Invalid character in header field name");
        return t.toLowerCase()
    }
    function m(t) {
        return "string" != typeof t && (t = String(t)), t
    }
    function t(e) {
        var t = {
            next: function() {
                var t = e.shift();
                return {
                    done: void 0 === t,
                    value: t
                }
            }
        };
        return s && (t[Symbol.iterator] = function() {
            return t
        }), t
    }
    function y(e) {
        this.map = {}, e instanceof y ? e.forEach(function(t, e) {
            this.append(e, t)
        }, this) : Array.isArray(e) ? e.forEach(function(t) {
            this.append(t[0], t[1])
        }, this) : e && Object.getOwnPropertyNames(e).forEach(function(t) {
            this.append(t, e[t])
        }, this)
    }
    function g(t) {
        if (t.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
        t.bodyUsed = !0
    }
    function b(n) {
        return new Promise(function(t, e) {
            n.onload = function() {
                t(n.result)
            }, n.onerror = function() {
                e(n.error)
            }
        })
    }
    function w(t) {
        var e = new FileReader,
            n = b(e);
        return e.readAsArrayBuffer(t), n
    }
    function _(t) {
        if (t.slice)
            return t.slice(0);
        var e = new Uint8Array(t.byteLength);
        return e.set(new Uint8Array(t)), e.buffer
    }
    function I() {
        return this.bodyUsed = !1, this._initBody = function(t) {
            var e;
            (this._bodyInit = t) ? "string" == typeof t ? this._bodyText = t : c && Blob.prototype.isPrototypeOf(t) ? this._bodyBlob = t : u && FormData.prototype.isPrototypeOf(t) ? this._bodyFormData = t : n && URLSearchParams.prototype.isPrototypeOf(t) ? this._bodyText = t.toString() : f && c && ((e = t) && DataView.prototype.isPrototypeOf(e)) ? (this._bodyArrayBuffer = _(t.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : f && (ArrayBuffer.prototype.isPrototypeOf(t) || p(t)) ? this._bodyArrayBuffer = _(t) : this._bodyText = t = Object.prototype.toString.call(t) : this._bodyText = "", this.headers.get("content-type") || ("string" == typeof t ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : n && URLSearchParams.prototype.isPrototypeOf(t) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"))
        }, c && (this.blob = function() {
            var t = g(this);
            if (t)
                return t;
            if (this._bodyBlob)
                return Promise.resolve(this._bodyBlob);
            if (this._bodyArrayBuffer)
                return Promise.resolve(new Blob([this._bodyArrayBuffer]));
            if (this._bodyFormData)
                throw new Error("could not read FormData body as blob");
            return Promise.resolve(new Blob([this._bodyText]))
        }, this.arrayBuffer = function() {
            return this._bodyArrayBuffer ? g(this) || Promise.resolve(this._bodyArrayBuffer) : this.blob().then(w)
        }), this.text = function() {
            var t,
                e,
                n,
                o = g(this);
            if (o)
                return o;
            if (this._bodyBlob)
                return t = this._bodyBlob, e = new FileReader, n = b(e), e.readAsText(t), n;
            if (this._bodyArrayBuffer)
                return Promise.resolve(function(t) {
                    for (var e = new Uint8Array(t), n = new Array(e.length), o = 0; o < e.length; o++)
                        n[o] = String.fromCharCode(e[o]);
                    return n.join("")
                }(this._bodyArrayBuffer));
            if (this._bodyFormData)
                throw new Error("could not read FormData body as text");
            return Promise.resolve(this._bodyText)
        }, u && (this.formData = function() {
            return this.text().then(L)
        }), this.json = function() {
            return this.text().then(JSON.parse)
        }, this
    }
    y.prototype.append = function(t, e) {
        t = v(t), e = m(e);
        var n = this.map[t];
        this.map[t] = n ? n + ", " + e : e
    }, y.prototype.delete = function(t) {
        delete this.map[v(t)]
    }, y.prototype.get = function(t) {
        return t = v(t), this.has(t) ? this.map[t] : null
    }, y.prototype.has = function(t) {
        return this.map.hasOwnProperty(v(t))
    }, y.prototype.set = function(t, e) {
        this.map[v(t)] = m(e)
    }, y.prototype.forEach = function(t, e) {
        for (var n in this.map)
            this.map.hasOwnProperty(n) && t.call(e, this.map[n], n, this)
    }, y.prototype.keys = function() {
        var n = [];
        return this.forEach(function(t, e) {
            n.push(e)
        }), t(n)
    }, y.prototype.values = function() {
        var e = [];
        return this.forEach(function(t) {
            e.push(t)
        }), t(e)
    }, y.prototype.entries = function() {
        var n = [];
        return this.forEach(function(t, e) {
            n.push([e, t])
        }), t(n)
    }, s && (y.prototype[Symbol.iterator] = y.prototype.entries);
    var x = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
    function A(t, e) {
        var n,
            o,
            r = (e = e || {}).body;
        if (t instanceof A) {
            if (t.bodyUsed)
                throw new TypeError("Already read");
            this.url = t.url, this.credentials = t.credentials, e.headers || (this.headers = new y(t.headers)), this.method = t.method, this.mode = t.mode, this.signal = t.signal, r || null == t._bodyInit || (r = t._bodyInit, t.bodyUsed = !0)
        } else
            this.url = String(t);
        if (this.credentials = e.credentials || this.credentials || "same-origin", !e.headers && this.headers || (this.headers = new y(e.headers)), this.method = (n = e.method || this.method || "GET", o = n.toUpperCase(), -1 < x.indexOf(o) ? o : n), this.mode = e.mode || this.mode || null, this.signal = e.signal || this.signal, this.referrer = null, ("GET" === this.method || "HEAD" === this.method) && r)
            throw new TypeError("Body not allowed for GET or HEAD requests");
        this._initBody(r)
    }
    function L(t) {
        var r = new FormData;
        return t.trim().split("&").forEach(function(t) {
            if (t) {
                var e = t.split("="),
                    n = e.shift().replace(/\+/g, " "),
                    o = e.join("=").replace(/\+/g, " ");
                r.append(decodeURIComponent(n), decodeURIComponent(o))
            }
        }), r
    }
    function O(t, e) {
        e || (e = {}), this.type = "default", this.status = void 0 === e.status ? 200 : e.status, this.ok = 200 <= this.status && this.status < 300, this.statusText = "statusText" in e ? e.statusText : "OK", this.headers = new y(e.headers), this.url = e.url || "", this._initBody(t)
    }
    A.prototype.clone = function() {
        return new A(this, {
            body: this._bodyInit
        })
    }, I.call(A.prototype), I.call(O.prototype), O.prototype.clone = function() {
        return new O(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new y(this.headers),
            url: this.url
        })
    }, O.error = function() {
        var t = new O(null, {
            status: 0,
            statusText: ""
        });
        return t.type = "error", t
    };
    var R = [301, 302, 303, 307, 308];
    O.redirect = function(t, e) {
        if (-1 === R.indexOf(e))
            throw new RangeError("Invalid status code");
        return new O(null, {
            status: e,
            headers: {
                location: t
            }
        })
    };
    var M = self.DOMException;
    try {
        new M
    } catch (t) {
        (M = function(t, e) {
            this.message = t, this.name = e;
            var n = Error(t);
            this.stack = n.stack
        }).prototype = Object.create(Error.prototype), M.prototype.constructor = M
    }
    function q(r, a) {
        return new Promise(function(o, t) {
            var e = new A(r, a);
            if (e.signal && e.signal.aborted)
                return t(new M("Aborted", "AbortError"));
            var i = new XMLHttpRequest;
            function n() {
                i.abort()
            }
            i.onload = function() {
                var t,
                    r,
                    e = {
                        status: i.status,
                        statusText: i.statusText,
                        headers: (t = i.getAllResponseHeaders() || "", r = new y, t.replace(/\r?\n[\t ]+/g, " ").split(/\r?\n/).forEach(function(t) {
                            var e = t.split(":"),
                                n = e.shift().trim();
                            if (n) {
                                var o = e.join(":").trim();
                                r.append(n, o)
                            }
                        }), r)
                    };
                e.url = "responseURL" in i ? i.responseURL : e.headers.get("X-Request-URL");
                var n = "response" in i ? i.response : i.responseText;
                o(new O(n, e))
            }, i.onerror = function() {
                t(new TypeError("Network request failed"))
            }, i.ontimeout = function() {
                t(new TypeError("Network request failed"))
            }, i.onabort = function() {
                t(new M("Aborted", "AbortError"))
            }, i.open(e.method, e.url, !0), "include" === e.credentials ? i.withCredentials = !0 : "omit" === e.credentials && (i.withCredentials = !1), "responseType" in i && c && (i.responseType = "blob"), e.headers.forEach(function(t, e) {
                i.setRequestHeader(e, t)
            }), e.signal && (e.signal.addEventListener("abort", n), i.onreadystatechange = function() {
                4 === i.readyState && e.signal.removeEventListener("abort", n)
            }), i.send(void 0 === e._bodyInit ? null : e._bodyInit)
        })
    }
    q.polyfill = !0, self.fetch || (self.fetch = q, self.Headers = y, self.Request = A, self.Response = O);
    "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self && self;
    function F(t, e) {
        return t(e = {
            exports: {}
        }, e.exports), e.exports
    }
    F(function(t) {
        var f = !1,
            p = !1;
        function v() {}
        try {
            var e = Object.create({}, {
                passive: {
                    get: function() {
                        f = !0
                    }
                },
                once: {
                    get: function() {
                        p = !0
                    }
                }
            });
            window.addEventListener("test", v, e), window.removeEventListener("test", v, e)
        } catch (t) {}
        var n = t.exports = function(t) {
            var d = t.addEventListener,
                c = t.removeEventListener,
                h = new WeakMap;
            t.addEventListener = function(e, n, t) {
                if (void 0 === t || !0 === t || !1 === t || !n || "function" != typeof n && "object" != typeof n)
                    return d.call(this, e, n, t);
                var o = n,
                    r = "boolean" == typeof t ? {
                        capture: t
                    } : t || {},
                    i = Boolean(r.passive),
                    a = Boolean(r.once),
                    s = Boolean(r.capture),
                    c = o;
                !p && a && (o = function(t) {
                    this.removeEventListener(e, n, r), c.call(this, t)
                }), !f && i && (o = function(t) {
                    t.preventDefault = v, c.call(this, t)
                }), h.has(this) || h.set(this, new WeakMap);
                var u = h.get(this);
                u.has(n) || u.set(n, []);
                var l = 1 * i + 2 * a + 4 * s;
                u.get(n)[l] = o, d.call(this, e, o, s)
            }, t.removeEventListener = function(t, e, n) {
                var o = Boolean("object" == typeof n ? n.capture : n),
                    r = h.get(this);
                if (!r)
                    return c.call(this, t, e, n);
                var i = r.get(e);
                if (!i)
                    return c.call(this, t, e, n);
                for (var a in i) {
                    var s = Boolean(4 & a);
                    s === o && c.call(this, t, i[a], s)
                }
            }
        };
        f && p || ("undefined" != typeof EventTarget ? n(EventTarget.prototype) : (n(Text.prototype), n(HTMLElement.prototype), n(HTMLDocument.prototype), n(Window.prototype), n(XMLHttpRequest.prototype)))
    });
    var k,
        C,
        B = null,
        P = {},
        j = function(t) {
            Y(t), P.destroy()
        },
        N = function(t) {
            t.preventDefault(), t.stopPropagation(), window.scrollTo(0, k)
        },
        H = function(t) {
            var e = {
                    content: {
                        url: "".concat(location.protocol, "//").concat(location.hostname, "/").concat(t.url),
                        description: t.description,
                        title: t.title
                    },
                    theme: {
                        direction: "vertical",
                        lang: "ru",
                        services: "vkontakte,facebook,twitter,telegram,odnoklassniki"
                    }
                },
                n = t.id ? "цитатой #".concat(t.id) : "комиксом",
                o = '<div class="dialog__backdrop" data-dialog="close"></div>\n                    <div class="dialog__frame">\n                      <div class="header__title_wrap">\n                        <span class="header__title_name" href="/">Bash.im</span>&nbsp;— Цитатник Рунета\n                      </div>\n                      <button class="dialog__close" data-dialog="close">\n                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n                          <path d="M15 17l10 10m0-10L15 27" stroke="currentColor" stroke-width="1"/>\n                        </svg>\n                      </button>\n                      <div class="dialog__body" data-dialog="body">\n                        <div class="dialog__title">\n                          Поделиться '.concat(n, ' в&nbsp;социальных сетях:\n                        </div>\n                        <div class="dialog__share">\n                          <div class="dialog__description">\n                            ').concat(t.description, '\n                          </div>\n                          <a href="').concat(e.content.url, '">').concat(e.content.url, "</a>\n                        </div>\n                      </div>\n                    </div>");
            k = window.pageYOffset;
            var r,
                i;
            r = o, i = function() {
                var t = B.querySelector(".dialog__share");
                (P = Ya.share2(t, e)).updateContent()
            }, (B = document.createElement("div")).classList.add("dialog"), B.innerHTML = r, document.body.appendChild(B), document.documentElement.classList.add("overflow"), setTimeout(function() {
                B.classList.add("active")
            }, 150), i(), E('[data-dialog="close"]', "mouseup", j), T(document, "scroll", N, !1), T(window, "DOMMouseScroll", N, !1)
        },
        U = function(t) {
            (null != window.Ya && null != window.Ya.share2 ? Promise.resolve() : new Promise(function(t, e) {
                var n = document.createElement("script");
                n.onload = t, n.onerror = e, n.src = "//yastatic.net/share2/share.js", document.getElementsByTagName("head")[0].appendChild(n)
            })).then(function() {
                return H(t)
            })
        },
        Y = function(t, e) {
            t.stopImmediatePropagation(), B.classList.remove("active"), B.parentNode.removeChild(B), B = null, document.documentElement.classList.remove("overflow"), r("remove", '[data-dialog="close"]', "mouseup", j), l(document, "scroll", N), l(window, "DOMMouseScroll", N), e && e()
        },
        V = [],
        J = {
            action: ["rulez", "sux", "bayan"],
            className: ["up", "down", "dismiss"],
            path: ["quote", "abyss"],
            figures: ["&#65381;_&#65381", "&not;_&not;", "&#3232;_&#3232;", "&#3232;&#65343;&#3232;", "&#3232;&#30410;&#3232;", ">&#65343;<", "=&#65343;="]
        },
        W = function(t) {
            var e = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
                n = d(t, 2),
                o = n[0],
                r = n[1],
                i = document.querySelector('[data-quote="'.concat(o, '"]')),
                a = J.className[r];
            if (null != i && !i.classList.contains("voted")) {
                var s = i.querySelector("[data-vote-counter]"),
                    c = parseInt(s.textContent),
                    u = s.textContent;
                switch (r) {
                case 0:
                    u = c ? ++c : ":-)";
                    break;
                case 1:
                    u = c ? --c : ":-("
                }
                if (e) {
                    var l = "animate--".concat(a);
                    s.classList.add(l), setTimeout(function() {
                        s.innerHTML = u, setTimeout(function() {
                            s.classList.remove(l)
                        }, 1e3)
                    }, 500)
                } else
                    s.innerHTML = u;
                i.classList.add("voted"), i.dataset.voted = a, h()
            }
        },
        z = function(r, i) {
            var t = d(i, 3),
                e = t[0],
                n = t[1],
                o = t[2],
                a = J.path[o],
                s = J.action[n],
                c = "/".concat(a, "/").concat(e, "/").concat(s),
                u = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    credentials: "include",
                    body: "quote=".concat(e, "&act=").concat(s)
                };
            fetch(c, u).then(function(t) {
                var e,
                    n,
                    o;
                200 <= t.status && t.status < 300 && (r.removeAttribute("disabled"), W(i, !0), e = d(i, 2), n = e[0], o = e[1], 100 === V.length && V.pop(), V.push([n, o]), localStorage.setItem("votes", JSON.stringify(V)))
            })
        },
        K = function(t, e) {
            if (null != t && (e = t.target.closest('[role="button"]')), null != e && !e.getAttribute("disabled") && (null == t || 0 == t.button)) {
                var n = e.dataset,
                    o = n.vote,
                    r = n.share;
                if (null != o) {
                    var i = JSON.parse(o);
                    V.some(function(t) {
                        return i[0] === t[0]
                    }) ? (s = i[0], c = document.querySelector('[data-quote="'.concat(s, '"]')), u = c.dataset.clicks, l = void 0 === u ? [] : u, d = c.querySelector("[data-vote-counter]"), h = d.textContent, f = parseInt(l), f = l.length ? ++f : 1, c.setAttribute("data-clicks", f), 3 <= f && f < 5 && (h = J.figures[0]), 5 <= f && f < 7 && (h = J.figures[1]), 7 <= f && f < 10 && (h = J.figures[2]), 10 <= f && f < 13 && (h = J.figures[3]), 13 <= f && f < 19 && (h = J.figures[4]), 19 <= f && f < 26 && (h = J.figures[5]), 26 <= f && (h = J.figures[6]), d.innerHTML = h) : (e.setAttribute("disabled", !0), z(e, i))
                } else if (null != r) {
                    var a = JSON.parse(r);
                    U(a)
                }
            }
            var s,
                c,
                u,
                l,
                d,
                h,
                f
        },
        X = function(t, e) {
            var n = t.target.closest("[data-quote]");
            if (null != n && !n.dataset.voted) {
                var o = n && n.querySelector('[data-swipe="'.concat({
                    left: 1,
                    right: 0
                }[e], '"]'));
                null != o && K(null, o), n.classList.add("touch")
            }
        },
        G = function() {
            h(), function() {
                for (var t = 0; t < V.length; t++)
                    W(V[t])
            }(), E(".quote", "mouseup", K), function(t, e) {
                for (var n = document.querySelectorAll(t), o = 0; o < n.length; o++) {
                    var r = n[o];
                    a(r, e)
                }
            }(".quote__body", X)
        },
        $ = function() {
            if (null == window.Ya)
                for (var t = "data-share", e = document.querySelectorAll("[".concat(t, "]")), n = 0; n < e.length; n++) {
                    var o = e[n];
                    o.removeAttribute(t), o.setAttribute("disabled", !0)
                }
        },
        Q = function() {
            var t,
                e;
            t = localStorage.getItem("votes"), e = [], null != t && t.length && (e = JSON.parse(t)), V = e, G(), T(window, "load", $)
        },
        Z = function() {
            var r = document.querySelector(".columns__aside"),
                i = r && r.querySelector(".columns__aside_wrap"),
                a = 0,
                t = function() {
                    var t = D(r),
                        e = D(i),
                        n = window.pageYOffset,
                        o = null;
                    t.height > 2 * e.height && (a < n ? (i.classList.remove("padded"), t.top <= 20 ? (o = t.height - Math.abs(t.top) - e.height, i.classList.add("sticky"), o <= 0 ? r.classList.add("reverse") : r.classList.remove("reverse")) : (i.classList.remove("sticky"), o = null)) : (r.classList.remove("reverse"), i.classList.add("padded"))), a = n
                };
            null != r && (t(), T(window, "scroll", S(t)), T(window, "resize", function(r) {
                var i,
                    a = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 10,
                    s = 0,
                    c = function() {
                        s = 0, i = null
                    },
                    t = function() {
                        for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
                            e[n] = arguments[n];
                        var o = this;
                        null != i && (cancelAnimationFrame(i), c()), i = requestAnimationFrame(function t() {
                            ++s === a ? (c(), r.apply(o, e)) : i = requestAnimationFrame(t)
                        })
                    };
                return t.cancel = function() {
                    cancelAnimationFrame(i), c()
                }, t
            }(t)), T(window, "load", function() {
                var t = (null != window.Ya).toString();
                null != localStorage && localStorage.setItem("aside", t), document.documentElement.setAttribute("aside", t)
            }))
        },
        tt = F(function(t, e) {
            t.exports = function() {
                function r() {
                    var t = new Date;
                    return t.setHours(0, 0, 0, 0), t
                }
                function d(t, e) {
                    return (t && t.toDateString()) === (e && e.toDateString())
                }
                function i(t, e, n) {
                    var o = (t = new Date(t)).getDate(),
                        r = t.getMonth() + e;
                    return t.setDate(1), t.setMonth(n ? (12 + r) % 12 : r), t.setDate(o), t.getDate() < o && t.setDate(0), t
                }
                function a(t, e) {
                    return (t = new Date(t)).setFullYear(t.getFullYear() + e), t
                }
                function s(n) {
                    return function(t) {
                        return e = "string" == typeof t ? n(t) : t, (e = new Date(e)).setHours(0, 0, 0, 0), e;
                        var e
                    }
                }
                function h(t, e, n) {
                    return t < e ? e : n < t ? n : t
                }
                function f(t, e) {
                    var n = void 0;
                    return function() {
                        clearTimeout(n), n = setTimeout(e, t)
                    }
                }
                function p() {}
                function c() {
                    for (var t = arguments, e = t[0], n = 1; n < t.length; ++n) {
                        var o = t[n] || {};
                        for (var r in o)
                            e[r] = o[r]
                    }
                    return e
                }
                var u = {
                    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    today: "Today",
                    clear: "Clear",
                    close: "Close"
                };
                function l(t) {
                    t = t || {};
                    var n,
                        o,
                        e = s((t = c({
                            lang: u,
                            mode: "dp-modal",
                            hilightedDate: r(),
                            format: function(t) {
                                return t.getMonth() + 1 + "/" + t.getDate() + "/" + t.getFullYear()
                            },
                            parse: function(t) {
                                var e = new Date(t);
                                return isNaN(e) ? r() : e
                            },
                            dateClass: function() {},
                            inRange: function() {
                                return !0
                            }
                        }, t)).parse);
                    return t.lang = c(u, t.lang), t.parse = e, t.inRange = (o = (n = t).inRange, function(t, e) {
                        return o(t, e) && n.min <= t && n.max >= t
                    }), t.min = e(t.min || a(r(), -100)), t.max = e(t.max || a(r(), 100)), t.hilightedDate = t.parse(t.hilightedDate), t
                }
                var v = {
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40,
                    enter: 13,
                    esc: 27
                };
                function m(t, e, n) {
                    return e.addEventListener(t, n, !0), function() {
                        e.removeEventListener(t, n, !0)
                    }
                }
                var t,
                    y = ("function" != typeof (t = window.CustomEvent) && ((t = function(t, e) {
                        e = e || {
                            bubbles: !1,
                            cancelable: !1,
                            detail: void 0
                        };
                        var n = document.createEvent("CustomEvent");
                        return n.initCustomEvent(t, e.bubbles, e.cancelable, e.detail), n
                    }).prototype = window.Event.prototype), t);
                function g(t, e, n) {
                    var o = "",
                        r = new Date(t);
                    r.setDate(1), r.setDate(1 - r.getDay() + e), e && r.getDate() === e + 1 && r.setDate(e - 6);
                    for (var i = 0; i < 42; ++i)
                        o += n(r), r.setDate(r.getDate() + 1);
                    return o
                }
                function b(t, e) {
                    for (var n = "", o = t.opts.max.getFullYear(), r = o; r >= t.opts.min.getFullYear(); --r)
                        n += e(r);
                    return n
                }
                var w = {
                    day: {
                        onKeyDown: function(t, e) {
                            var n,
                                o,
                                r = t.keyCode,
                                i = r === v.left ? -1 : r === v.right ? 1 : r === v.up ? -7 : r === v.down ? 7 : 0;
                            r === v.esc ? e.close() : i && (t.preventDefault(), e.setState({
                                hilightedDate: (n = e.state.hilightedDate, o = i, (n = new Date(n)).setDate(n.getDate() + o), n),
                                adjust: !0
                            }))
                        },
                        onClick: {
                            "dp-day": function(t, e) {
                                e.setState({
                                    selectedDate: new Date(parseInt(t.target.getAttribute("data-date")))
                                })
                            },
                            "dp-next": function(t, e) {
                                var n = e.state.hilightedDate;
                                e.setState({
                                    hilightedDate: i(n, 1)
                                })
                            },
                            "dp-prev": function(t, e) {
                                var n = e.state.hilightedDate;
                                e.setState({
                                    hilightedDate: i(n, -1)
                                })
                            },
                            "dp-today": function(t, e) {
                                e.setState({
                                    selectedDate: r()
                                })
                            },
                            "dp-clear": function(t, e) {
                                e.setState({
                                    selectedDate: null
                                })
                            },
                            "dp-close": function(t, e) {
                                e.close()
                            },
                            "dp-cal-month": function(t, e) {
                                e.setState({
                                    view: "month",
                                    adjust: !1
                                })
                            },
                            "dp-cal-year": function(t, e) {
                                e.setState({
                                    view: "year",
                                    adjust: !1
                                })
                            }
                        },
                        render: function(i) {
                            var a = i.opts,
                                t = a.lang,
                                e = i.state,
                                n = (i.adjust, t.days),
                                o = a.dayOffset || 0,
                                s = e.selectedDate,
                                c = e.hilightedDate,
                                u = c.getMonth(),
                                l = r().getTime();
                            return '<div class="dp-cal"><header class="dp-cal-header"><button tabindex="-1" type="button" class="dp-prev">Prev</button><button tabindex="-1" type="button" class="dp-cal-month">' + t.months[u] + '</button><button tabindex="-1" type="button" class="dp-cal-year">' + c.getFullYear() + '</button><button tabindex="-1" type="button" class="dp-next">Next</button></header><div class="dp-days">' + n.map(function(t, e) {
                                return '<span class="dp-col-header">' + n[(e + o) % n.length] + "</span>"
                            }).join("") + g(c, o, function(t) {
                                var e = t.getMonth() !== u,
                                    n = !a.inRange(t),
                                    o = t.getTime() === l,
                                    r = "dp-day";
                                return r += e ? " dp-edge-day" : "", r += d(t, c) ? " dp-current" : "", r += d(t, s) ? " dp-selected" : "", r += n ? " dp-day-disabled" : "", r += o ? " dp-day-today" : "", '<button tabindex="-1" type="button" class="' + (r += " " + a.dateClass(t, i)) + '" data-date="' + t.getTime() + '">' + t.getDate() + "</button>"
                            }) + "</div></div>"
                        }
                    },
                    year: {
                        render: function(t) {
                            var e = t.state,
                                n = e.hilightedDate.getFullYear(),
                                o = e.selectedDate.getFullYear();
                            return '<div class="dp-years">' + b(t, function(t) {
                                var e = "dp-year";
                                return e += t === n ? " dp-current" : "", '<button tabindex="-1" type="button" class="' + (e += t === o ? " dp-selected" : "") + '" data-year="' + t + '">' + t + "</button>"
                            }) + "</div>"
                        },
                        onKeyDown: function(t, e) {
                            var n = t.keyCode,
                                o = e.opts,
                                r = n === v.left || n === v.up ? 1 : n === v.right || n === v.down ? -1 : 0;
                            if (n === v.esc)
                                e.setState({
                                    view: "day",
                                    adjust: !1
                                });
                            else if (r) {
                                t.preventDefault();
                                var i = a(e.state.hilightedDate, r);
                                e.setState({
                                    hilightedDate: h(i, o.min, o.max)
                                })
                            }
                        },
                        onClick: {
                            "dp-year": function(t, e) {
                                var n,
                                    o;
                                e.setState({
                                    hilightedDate: (n = e.state.hilightedDate, o = parseInt(t.target.getAttribute("data-year")), (n = new Date(n)).setFullYear(o), n),
                                    view: "day",
                                    adjust: !1
                                })
                            }
                        }
                    },
                    month: {
                        onKeyDown: function(t, e) {
                            var n = t.keyCode,
                                o = n === v.left ? -1 : n === v.right ? 1 : n === v.up ? -3 : n === v.down ? 3 : 0;
                            n === v.esc ? e.setState({
                                view: "day",
                                adjust: !1
                            }) : o && (t.preventDefault(), e.setState({
                                hilightedDate: i(e.state.hilightedDate, o, !0)
                            }))
                        },
                        onClick: {
                            "dp-month": function(t, e) {
                                var n,
                                    o;
                                e.setState({
                                    hilightedDate: (n = e.state.hilightedDate, o = parseInt(t.target.getAttribute("data-month")), i(n, o - n.getMonth())),
                                    view: "day",
                                    adjust: !1
                                })
                            }
                        },
                        render: function(t) {
                            var e = t.opts.lang.months,
                                o = t.state.hilightedDate.getMonth();
                            return '<div class="dp-months">' + e.map(function(t, e) {
                                var n = "dp-month";
                                return '<button tabindex="-1" type="button" class="' + (n += o === e ? " dp-current" : "") + '" data-month="' + e + '">' + t + "</button>"
                            }).join("") + "</div>"
                        }
                    }
                };
                function _(r, i, o) {
                    var t,
                        a,
                        e,
                        n,
                        s,
                        c,
                        u = "INPUT" === r.tagName,
                        l = !1,
                        d = {
                            adjust: !0,
                            el: void 0,
                            opts: o,
                            shouldFocusOnBlur: !0,
                            shouldFocusOnRender: !0,
                            state: {
                                get selectedDate() {
                                    return a
                                },
                                set selectedDate(t) {
                                    t && !o.inRange(t) || (t ? (a = new Date(t), d.state.hilightedDate = a) : a = t, d.updateInput(a), i("select"), d.close())
                                },
                                adjust: !0,
                                view: "day"
                            },
                            adjustPosition: p,
                            containerHTML: '<div class="dp"></div>',
                            attachToDom: function() {
                                var t = null != d.opts.appendTo ? d.opts.appendTo : document.body;
                                t.appendChild(d.el)
                            },
                            updateInput: function(t) {
                                var e = new y("change", {
                                    bubbles: !0
                                });
                                e.simulated = !0, u ? r.value = t ? o.format(t) : "" : r.innerText = t ? o.format(t) : "", r.dispatchEvent(e)
                            },
                            computeSelectedDate: function() {
                                return o.parse(u ? r.value : r.dataset.value)
                            },
                            currentView: function() {
                                return w[d.state.view]
                            },
                            open: function() {
                                var t,
                                    e,
                                    n;
                                l || (d.el || (d.el = (t = o, e = d.containerHTML, (n = document.createElement("div")).className = t.mode, n.innerHTML = e, n), function(o) {
                                    var t = o.el,
                                        e = t.querySelector(".dp");
                                    function n(n) {
                                        n.target.className.split(" ").forEach(function(t) {
                                            var e = o.currentView().onClick[t];
                                            e && e(n, o)
                                        })
                                    }
                                    t.ontouchstart = p, m("blur", e, f(150, function() {
                                        o.hasFocus() || o.close(!0)
                                    })), m("keydown", t, function(t) {
                                        t.keyCode === v.enter ? n(t) : o.currentView().onKeyDown(t, o)
                                    }), m("mousedown", e, function(t) {
                                        t.target.focus && t.target.focus(), document.activeElement !== t.target && (t.preventDefault(), T(o))
                                    }), m("click", t, n)
                                }(d)), a = h(d.computeSelectedDate(), o.min, o.max), d.state.hilightedDate = a || o.hilightedDate, d.state.view = "day", d.attachToDom(), d.render(), document.addEventListener("scroll", d.adjustPosition), window.addEventListener("resize", d.adjustPosition), i("open"))
                            },
                            isVisible: function() {
                                return !!d.el && !!d.el.parentNode
                            },
                            hasFocus: function() {
                                var t = document.activeElement;
                                return d.el && d.el.contains(t) && t.className.indexOf("dp-focuser") < 0
                            },
                            shouldHide: function() {
                                return d.isVisible()
                            },
                            close: function(t) {
                                var e = d.el;
                                if (d.isVisible()) {
                                    if (e) {
                                        var n = e.parentNode;
                                        n && n.removeChild(e)
                                    }
                                    var o;
                                    l = !0, t && d.shouldFocusOnBlur && ((o = r).focus(), /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && o.blur()), setTimeout(function() {
                                        l = !1
                                    }, 100), i("close")
                                }
                            },
                            destroy: function() {
                                d.close(), t()
                            },
                            render: function() {
                                if (d.el && d.el.firstChild) {
                                    var t = d.hasFocus(),
                                        e = d.currentView().render(d);
                                    e && (d.el.firstChild.innerHTML = e), d.state.adjust && d.adjustPosition(), (t || d.shouldFocusOnRender) && T(d)
                                }
                            },
                            setState: function(t) {
                                for (var e in t)
                                    d.state[e] = t[e];
                                i("statechange"), d.render()
                            }
                        };
                    return e = r, n = d, s = f(5, function() {
                        n.shouldHide() ? n.close() : n.open()
                    }), c = [m("blur", e, f(150, function() {
                        n.hasFocus() || n.close(!0)
                    })), m("mousedown", e, function() {
                        e === document.activeElement && s()
                    }), m("focus", e, s), m("input", e, function(t) {
                        var e = n.opts.parse(t.target.value);
                        isNaN(e) || n.setState({
                            hilightedDate: e
                        })
                    })], t = function() {
                        c.forEach(function(t) {
                            t()
                        })
                    }, d
                }
                function T(t) {
                    var e = t.el.querySelector(".dp-current");
                    return e && e.focus()
                }
                function E(d, t, e) {
                    var h = _(d, t, e);
                    return h.shouldFocusOnBlur = !1, Object.defineProperty(h, "shouldFocusOnRender", {
                        get: function() {
                            return d !== document.activeElement
                        }
                    }), h.adjustPosition = function() {
                        var t,
                            e,
                            n,
                            o,
                            r,
                            i,
                            a,
                            s,
                            c,
                            u,
                            l;
                        t = h, e = d.getBoundingClientRect(), n = window, o = e, r = n, i = t.el, a = r.pageYOffset, s = a + o.top, c = i.offsetHeight, u = s + o.height, l = 0 < s - c && u + c > a + r.innerHeight ? -Math.abs(c) : o.height, i.style.top = "".concat(l, "px"), t.el.style.visibility = ""
                    }, h
                }
                function D(t, e, n) {
                    return t = t && t.tagName ? t : document.querySelector(t), "dp-modal" === n.mode ? (r = _(o = t, e, n), o.readonly = !0, r.containerHTML += '<a href="#" class="dp-focuser">.</a>', r) : "dp-below" === n.mode ? E(t, e, n) : "dp-permanent" === n.mode ? ((s = _(i = t, e, a = n)).close = p, s.updateInput = p, s.shouldFocusOnRender = a.shouldFocusOnRender, s.computeSelectedDate = function() {
                        return a.hilightedDate
                    }, s.attachToDom = function() {
                        i.appendChild(s.el)
                    }, s.open(), s) : void 0;
                    var o,
                        r,
                        i,
                        a,
                        s
                }
                function S() {
                    var o = {};
                    function n(t, e) {
                        (o[t] = o[t] || []).push(e)
                    }
                    return {
                        on: function(t, e) {
                            return e ? n(t, e) : function(t) {
                                for (var e in t)
                                    n(e, t[e])
                            }(t), this
                        },
                        emit: function(e, n) {
                            (o[e] || []).forEach(function(t) {
                                t(e, n)
                            })
                        },
                        off: function(t, e) {
                            return t ? o[t] = e ? (o[t] || []).filter(function(t) {
                                return t !== e
                            }) : [] : o = {}, this
                        }
                    }
                }
                return function(t, e) {
                    var n = S(),
                        o = l(e),
                        r = D(t, a, o),
                        i = {
                            get state() {
                                return r.state
                            },
                            on: n.on,
                            off: n.off,
                            setState: r.setState,
                            open: r.open,
                            close: r.close,
                            destroy: r.destroy
                        };
                    function a(t) {
                        n.emit(t, i)
                    }
                    return i
                }
            }()
        }),
        et = {
            lang: {
                days: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                months: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
            },
            appendTo: null,
            mode: "dp-below",
            format: function(t) {
                return "".concat(t.getDate(), " ").concat(et.lang.months[t.getMonth()].toLowerCase())
            },
            dayOffset: 1,
            parse: function() {
                return C
            },
            min: null,
            max: null
        },
        nt = function(t) {
            null != window.Turbolinks ? window.Turbolinks.visit(t) : window.location.href = t
        },
        ot = function(t) {
            t.target.select()
        },
        rt = function(t) {
            var e = t.target,
                n = e.min,
                o = e.max,
                r = e.value,
                i = e.dataset.path;
            13 === t.which && parseInt(r, 10) >= parseInt(n, 10) && r <= parseInt(o, 10) && nt("/".concat(i, "/").concat(r))
        },
        it = function() {
            !function() {
                for (var t = document.querySelectorAll("[data-date]"), e = 0; e < t.length; e++) {
                    var n = t[e];
                    et.appendTo = n.closest(".pager"), C = i(n.dataset.date), et.min = i(n.dataset.min), et.max = i(n.dataset.max), tt(n, et).on("select", function(t, e) {
                        var n,
                            o,
                            r;
                        nt("/abyssbest/".concat((n = e.state.selectedDate, o = n.getMonth() + 1, r = n.getDate(), [n.getFullYear(), (9 < o ? "" : "0") + o, (9 < r ? "" : "0") + r].join(""))))
                    })
                }
            }(), E("input[data-page]", "focus", ot), E("input[data-page]", "keydown", rt)
        };
    Element.prototype.matches || (Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(t) {
        for (var e = (this.document || this.ownerDocument).querySelectorAll(t), n = e.length; o("i"), 0 <= --n && e.item(n) !== this;)
            ;
        return -1 < n
    }), Element.prototype.closest || (Element.prototype.closest = function(t) {
        for (; this;) {
            var e = this.parentElement;
            return this.matches(t) && (e = this), e
        }
        return null
    });
    var at = function() {
        var s,
            c,
            u,
            l,
            d,
            h,
            f,
            p,
            v,
            t,
            e,
            n,
            o,
            r,
            i,
            a,
            m,
            y,
            g,
            b,
            w,
            _;
        s = document.querySelector(".header"), c = document.querySelector(".columns"), u = document.body, l = s.querySelector(".header__projects"), d = s.querySelector(".header__title"), h = s.querySelector(".sections"), f = 0, p = window.getComputedStyle(c).marginTop, v = !1, t = function() {
            var t = 1024 <= window.screen.width,
                e = t ? window.screen.height / 3 : window.screen.height / 2,
                n = D(l).height,
                o = D(d).height,
                r = window.pageYOffset,
                i = D(s).height,
                a = t ? 0 : n;
            i <= r ? (u.classList.add("fixed"), c.style.marginTop = "".concat(i, "px"), f < r ? ((t || o + (null != h && n) <= r) && u.classList.add("collapsed"), v = !1) : (r < f - e || r <= o + e) && (u.classList.add("animated"), u.classList.remove("collapsed"), v = !0)) : r <= a && (u.classList.remove("fixed"), u.classList.remove("animated"), u.classList.remove("collapsed"), c.style.marginTop = p), (f < r || v) && (f = r)
        }, T(window, "scroll", S(function() {
            t()
        })), E(".theme", "click", function() {
            var t = document.documentElement,
                e = window,
                n = e.nextTheme,
                o = e.colors,
                r = t.getAttribute("theme"),
                i = document.querySelector('[name="theme-color"]'),
                a = n[r];
            t.setAttribute("theme", a), i.setAttribute("content", o[a]);
            try {
                localStorage.setItem("theme", n[r])
            } catch (t) {}
        }), t(), Q(), E("[data-archive]", "change", function(t) {
            var e,
                n = t.target.dataset.archive,
                o = (e = t.target).options[e.selectedIndex].value;
            null != o && (document.location.href = "/".concat(n, "/").concat(o))
        }), n = document.querySelector(".form__textarea"), o = document.querySelector(".form"), r = document.querySelector(".error"), i = document.querySelector(".nav.mobile"), e = function() {
            n.style.height = "auto", n.style.height = "".concat(n.scrollHeight, "px")
        }, null != n && (T(n, "change", e), T(n, "drop", e), T(n, "keydown", e), T(n, "cut", e), T(n, "paste", e)), null != o && T(o, "submit", function(t) {
            r.innerText = "";
            var e = n.value.split("\n").length;
            32 < e && (r.innerHTML = "В вашей цитате слишком много строк (".concat(e, ", максимум же - 32).<br>И не надо отправлять нам её почтой, всё равно не опубликуем.")), n.value.length < 40 && (r.innerText = "Ваша цитата слишком короткая!"), 1500 < n.value.length && (r.innerHTML = "Ваша цитата слишком длинная!<br>И не надо отправлять нам её почтой, всё равно не опубликуем.<br>Кстати, об этом написано на этой странице."), "" !== r.innerText && (r.scrollIntoView({
                block: "center"
            }), t.preventDefault())
        }), null != i && null != n && (T(n, "focus", function() {
            i.style.position = "inherit", i.style.marginTop = "-60px"
        }), T(n, "blur", function() {
            i.style.position = null, i.style.marginTop = null
        })), a = document.querySelector(".search"), m = a && a.querySelector(".search__input"), y = a && a.querySelector(".search__button"), a && T(m, "input", function(t) {
            t.target.value.length ? y.removeAttribute("disabled") : y.setAttribute("disabled", !0)
        }), Z(), g = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, b = window.devicePixelRatio || 1, w = window.screen.width * b, _ = window.screen.height * b, g && 1125 <= w && 2436 <= _ && document.querySelector(".nav.mobile").classList.add("iphonex"), it()
    };
    at(), T(document, "turbolinks:load", at)
}();

