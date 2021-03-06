(function(j, o, ca) {
    function g(a) {
        L(this, a || {});
        this.element = this.getElement()
    }

    function p(a, b) {
        this.components = [];
        g.call(this, b || {});
        Object.isArray(a) && a.each(this.addComponent, this);
        this.__shouldUpdateComponents = this.__needsRender = true
    }

    function z(a, b) {
        p.call(this, a, b);
        this.__shouldUpdateComponents = this.__needsRender = false
    }

    function t(a) {
        g.call(this, a);
        this._t = "";
        this._n = o.createTextNode(this._t);
        this.element.appendChild(this._n)
    }

    function A(a, b) {
        this.spriteset = a;
        this.spritesetImg = a.image.cloneNode(false);
        g.call(this, b)
    }

    function D(a) {
        g.call(this, a)
    }

    function H(a) {
        g.call(this, a)
    }

    function i() {
        this._l = {};
        if (!(this instanceof i))
            for (var a in i.prototype) this[a] = i.prototype[a]
    }

    function n(a) {
        i.call(this);
        this.game = a;
        this._k = {}
    }

    function M(a) {
        var b = f.game.screen.element.cumulativeOffset();
        return {
            x: a.pointerX() - b.left,
            y: a.pointerY() - b.top
        }
    }

    function da(a) {
        if (f) {
            var b = M(a),
                c = f.game.screen;
            b.x >= 0 && b.y >= 0 && b.x <= c.width && b.y <= c.height && a.stop()
        }
    }

    function ea(a) {
        a.ctrlKey || a.metaKey || a.altKey || f && a.stop()
    }

    function fa(a) {
        if (!(a.ctrlKey ||
                a.metaKey || a.altKey))
            if (f) {
                a.stop();
                if (f._k[a.keyCode] !== true) {
                    var b = {
                        keyCode: a.keyCode,
                        shiftKey: a.shiftKey
                    };
                    f._k[a.keyCode] = true;
                    f.emit("keydown", [b])
                }
            }
    }

    function ga(a) {
        if (!(a.ctrlKey || a.metaKey || a.altKey))
            if (f) {
                a.stop();
                if (f._k[a.keyCode] !== false) {
                    var b = {
                        keyCode: a.keyCode,
                        shiftKey: a.shiftKey
                    };
                    f._k[a.keyCode] = false;
                    f.emit("keyup", [b])
                }
            }
    }

    function N(a) {
        if (f) {
            var b = M(a),
                c = f.game.screen;
            b.button = a.button;
            if (b.x >= 0 && b.y >= 0 && b.x <= c.width && b.y <= c.height) {
                f = f;
                a.stop();
                j.focus();
                f.pointerX = b.x;
                f.pointerY =
                    b.y;
                f.emit("mousedown", [b])
            } else {
                f = null;
                N(a)
            }
        } else {
            b = G.length;
            for (var d = c = null, e = a.pointerX(), h = a.pointerY(); b--;) {
                d = G[b].element;
                c = d.cumulativeOffset();
                if (e >= c.left && e <= c.left + d.clientWidth && h >= c.top && h <= c.top + d.clientHeight) {
                    f = G[b].input;
                    N(a)
                }
            }
        }
    }

    function ha(a) {
        if (f) {
            var b = M(a),
                c = f.game.screen;
            b.button = a.button;
            if (b.x >= 0 && b.y >= 0 && b.x <= c.width && b.y <= c.height) {
                a.stop();
                f.pointerX = b.x;
                f.pointerY = b.y;
                f.emit("mouseup", [b])
            }
        }
    }

    function ia(a) {
        if (f) {
            var b = M(a),
                c = f.game.screen;
            if (b.x >= 0 && b.y >= 0 && b.x <= c.width &&
                b.y <= c.height && (f.pointerX !== b.x || f.pointerY !== b.y)) {
                a.stop();
                f.pointerX = b.x;
                f.pointerY = b.y;
                f.emit("mousemove", [b])
            }
        }
    }

    function W(a) {
        if (f) {
            for (var b = 0, c = a.touches.length; b < c; b++);
            f = f;
            a.stop();
            j.focus();
            f.emit("touchstart", [a])
        } else {
            b = G.length;
            var d = null;
            for (var e = c = null, h = null, q = null; b--;) {
                d = G[b];
                c = d.element;
                e = c.cumulativeOffset();
                var O = 0;
                for (c = a.changedTouches.length; O < c; O++) {
                    h = a.changedTouches[O].pageX;
                    q = a.changedTouches[O].pageY;
                    if (h >= e.left && h <= e.left + d.screen.width && q >= e.top && q <= e.top + d.screen.height) {
                        f =
                            d.input;
                        W(a)
                    }
                }
            }
        }
    }

    function ja(a) {
        if (f) {
            a.stop();
            f.pointerX = a.touches[0].x;
            f.pointerY = a.touches[0].y;
            f.emit("touchmove", [a])
        }
    }

    function ka(a) {
        f && a.stop()
    }

    function k(a, b, c) {
        var d = this;
        i.call(d);
        p.call(d, c);
        d.input = new n(d);
        d.screen = new E(d);
        d.screen._bind(b);
        if (a.endsWith("main.js")) a = a.substring(0, a.lastIndexOf("main.js"));
        d.root = a.endsWith("/") ? a : a + "/";
        d.setGameSpeed(d.gameSpeed);
        d.running = false;
        d.startTime = NaN;
        P = d;
        d._s = function() {
            d.step()
        };
        d.getScript("main.js", function() {
            d.loaded = true;
            d.emit("load");
            d.start()
        })
    }

    function I(a, b) {
        i.call(this);
        if (a instanceof k) {
            b = a.root + b;
            this.__fontName = "SGF_font" + Math.round(Math.random() * 1E4);
            var c = '@font-face {  font-family: "' + this.__fontName + '";  src: url("' + b + '");}',
                d = o.createElement("style");
            d.type = "text/css";
            if (d.styleSheet) d.styleSheet.cssText = c;
            else d.appendChild(o.createTextNode(c));
            o.getElementsByTagName("head")[0].appendChild(d);
            this.__styleNode = d
        } else this.__fontName = b = a
    }

    function x(a, b, c) {
        if (a instanceof k) b = a.root + b;
        else {
            c = b;
            b = a
        }
        var d = o.createElement("script"),
            e = this;
        i.call(e);
        c && e.addListener("load", c);
        d.type = "text/javascript";
        d.setAttribute("async", "true");
        d.onload = d.onreadystatechange = function() {
            if (!d.readyState || d.readyState == "loaded" || d.readyState == "complete") {
                d.parentNode && d.parentNode.removeChild(d);
                for (var h in d) delete d[h];
                d = null;
                e.loaded = true;
                e.emit("load")
            }
        };
        d.src = b;
        o.getElementsByTagName("head")[0].appendChild(d);
        e.src = d.src
    }

    function Q() {
        i.call(this)
    }

    function y(a, b, c, d, e) {
        if (a instanceof k) b = a.root + b;
        else {
            e = d;
            d = c;
            c = b;
            b = a
        }
        var h = this;
        i.call(h);
        h.spriteWidth = c;
        h.spriteHeight = d;
        e && h.addListener("load", e);
        var q = new Image;
        q.style.position = "absolute";
        q.onload = function() {
            h.width = q.width;
            h.height = q.height;
            h.loaded = true;
            h.emit("load")
        };
        h.image = q;
        q.src = b;
        h.src = q.src
    }

    function B(a, b) {
        i.call(this);
        L(this, b || {});
        this.URL = a;
        this._O = X(za, this);
        this._C = X(Aa, this);
        this._M = X(Ba, this);
        this.autoconnect && this.connect()
    }

    function za() {
        this.emit("open")
    }

    function Aa() {
        this.emit("close");
        this._w = null
    }

    function Ba(a) {
        this.emit("message", a.data)
    }

    function la() {
        throw Error("The HTML game engine is not capable of starting a `Server`.");
    }

    function J() {
        var a = arguments,
            b = j.console;
        b && b.log && Function.prototype.apply.call(b.log, b, a);
        C.emit("log", a)
    }

    function Y(a, b) {
        return new m.game(a, $(b))
    }

    function ma(a) {
        return Y(a, o.body)
    }

    function R() {
        if (na() && oa() && pa() && "WebSocket" in j) {
            S("All dependant libraries loaded!");
            n.grab();
            S("Load Time: " + ((new Date).getTime() - Ca.getTime()) + " ms");
            if (u.game) u.screen ? Y(u.game, u.screen) : ma(u.game)
        }
    }

    function na() {
        var a = false;
        if ("Prototype" in j) {
            var b = parseFloat(j.Prototype.Version.substring(0, 3));
            if (b > 1.6 || b ==
                1.6 && parseInt(j.Prototype.Version.charAt(4)) >= 1) a = true
        }
        return a
    }

    function Da() {
        R()
    }

    function pa() {
        return "Sound" in j && "SoundChannel" in j
    }

    function qa() {
        j.Sound.swfPath = F(u["soundjs-swf"]);
        S("Setting SoundJS SWF Path: " + j.Sound.swfPath);
        R()
    }

    function oa() {
        return "swfobject" in j && "embedSWF" in j.swfobject
    }

    function ra() {
        if (pa()) qa();
        else new x(F(u.soundjs), qa);
        "WebSocket" in j || new x(F(u.fabridge), function() {
            new x(F(u.websocket), Ea)
        })
    }

    function Ea() {
        j.WebSocket.__swfLocation = F(u["websocket-swf"]);
        j.WebSocket.__initialize();
        R()
    }

    function L(a, b) {
        for (var c in b) a[c] = b[c];
        return a
    }

    function sa(a, b, c) {
        c = a.slice((c || b) + 1 || a.length);
        a.length = b < 0 ? a.length + b : b;
        return a.push.apply(a, c)
    }

    function F(a) {
        return a.substring(0, 7) == "http://" || a.substring(0, 8) == "https://" || a.substring(0, 7) == "file://" ? a : Z + a
    }

    function v(a) {
        a.prototype.initialize = a;
        a.subclasses = []
    }

    function X(a, b) {
        return function() {
            return a.apply(b, arguments)
        }
    }

    function s(a) {
        return function() {
            return a
        }
    }

    function aa(a) {
        return function() {
            return this[a]
        }
    }

    function S() {
        u.debug && J.apply(C,
            arguments)
    }
    var T = null,
        ba = null,
        Z = null,
        w = j.devicePixelRatio || 1;
    o.createElement("canvas").getContext && o.createElement("canvas").getContext("2d");
    var u = {
            prototype: "lib/prototype.js",
            swfobject: "lib/swfobject.js",
            fabridge: "lib/FABridge.js",
            soundjs: "lib/Sound.min.js",
            "soundjs-swf": "lib/Sound.swf",
            websocket: "lib/web_socket.js",
            "websocket-swf": "lib/WebSocketMain.swf"
        },
        Ca = new Date,
        m = {},
        U = navigator.userAgent,
        r = Object.prototype.toString.call(j.opera) == "[object Opera]",
        V = !!j.attachEvent && !r,
        Fa = V && parseFloat(navigator.userAgent.split("MSIE")[1]) <=
        7;
    U = U.indexOf("Gecko") > -1 && U.indexOf("KHTML") === -1;
    var K = Array.prototype.slice;
    r = null;
    if ("create" in Object) r = function(a, b) {
        a.prototype = Object.create(b.prototype, {
            constructor: {
                value: a,
                enumerable: false
            }
        })
    };
    else {
        var ta = function() {};
        r = function(a, b) {
            ta.prototype = b.prototype;
            a.prototype = new ta;
            a.prototype.constructor = a
        }
    }
    var l;
    l = !V && o.documentElement.style.setProperty ? function(a, b, c) {
        a.style.setProperty(b, c, "important")
    } : function(a, b, c) {
        a.style.cssText += ";" + b + ":" + c + " !important;"
    };
    var ua;
    ua = j.CSSMatrix ?
        function(a, b) {
            a.style.transform = "rotate(" + (b || 0) + "rad)";
            return a
        } : j.WebKitCSSMatrix ? function(a, b) {
            a.style.webkitTransform = "rotate(" + (b || 0) + "rad)";
            return a
        } : U ? function(a, b) {
            a.style.MozTransform = "rotate(" + (b || 0) + "rad)";
            return a
        } : V ? function(a, b) {
            if (!a.a) a.a = [a.offsetWidth, a.offsetHeight];
            var c = Math.cos(b || 0) * 1,
                d = Math.sin(b || 0) * 1;
            try {
                var e = a.filters("DXImageTransform.Microsoft.Matrix");
                e.M11 = c;
                e.M21 = -d;
                e.M12 = d;
                e.M22 = c
            } catch (h) {
                a.style.filter += " progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand',M11=" +
                    c + ",M12=" + -d + ",M21=" + d + ",M22=" + c + ")"
            }
            a.style.marginLeft = (a.a[0] - a.offsetWidth) / 2 + "px";
            a.style.marginTop = (a.a[1] - a.offsetHeight) / 2 + "px";
            return a
        } : function(a) {
            return a
        };
    g.prototype.getElement = function() {
        var a = o.createElement("div");
        l(a, "position", "absolute");
        l(a, "overflow", "hidden");
        return function() {
            return a.cloneNode(false)
        }
    }();
    g.prototype.toElement = aa("element");
    g.prototype.left = aa("x");
    g.prototype.top = aa("y");
    g.prototype.right = function() {
        return this.x + this.width - 1
    };
    g.prototype.bottom = function() {
        return this.y +
            this.height - 1
    };
    g.prototype.render = function() {
        if (this.__rotation != this.rotation) {
            ua(this.element, this.rotation);
            this.__rotation = this.rotation
        }
        if (this.__opacity != this.opacity) {
            Element.setOpacity(this.element, this.opacity);
            this.__opacity = this.opacity
        }
        if (this.__zIndex != this.zIndex) {
            this.__fixZIndex();
            this.__zIndex = this.zIndex
        }
        if (this.__width != this.width) {
            l(this.element, "width", this.width / w + "px");
            this.__width = this.width
        }
        if (this.__height != this.height) {
            l(this.element, "height", this.height / w + "px");
            this.__height =
                this.height
        }
        if (this.__x != this.x) {
            l(this.element, "left", this.x / w + "px");
            this.__x = this.x
        }
        if (this.__y != this.y) {
            this.__y = this.y;
            l(this.element, "top", this.y / w + "px")
        }
    };
    g.prototype.update = function() {};
    g.prototype.__fixZIndex = function() {
        var a = this.parent && this.parent.b ? this.parent.b(this.zIndex) : this.zIndex;
        l(this.element, "z-index", a)
    };
    g.prototype.width = 10;
    g.prototype.height = 10;
    g.prototype.x = 0;
    g.prototype.y = 0;
    g.prototype.opacity = 1;
    g.prototype.rotation = 0;
    g.prototype.zIndex = 0;
    g.prototype.parent = null;
    g.prototype.element =
        null;
    g.prototype.toString = s("[object Component]");
    v(g);
    m.component = g;
    r(p, g);
    v(p);
    p.prototype.update = function(a) {
        if (this.__shouldUpdateComponents)
            for (var b = K.call(this.components, 0), c = 0, d = null, e = b.length; c < e; c++) {
                d = b[c];
                d.update && d.update(a)
            }
    };
    p.prototype.render = function(a) {
        g.prototype.render.call(this, a);
        this.__needsRender && this.__renderComponents(a)
    };
    p.prototype.__renderComponents = function(a) {
        for (var b = K.call(this.components, 0), c = 0, d = null, e = b.length; c < e; c++) {
            d = b[c];
            d.render && d.render(a)
        }
    };
    p.prototype.addComponent =
        function(a) {
            if (a.parent !== this) {
                a.parent && a.parent.removeComponent(a);
                this.components.push(a);
                this.element.appendChild(a.element);
                a.parent = this;
                a.__fixZIndex()
            }
            return this
        };
    p.prototype.removeComponent = function(a) {
        var b = this.components.indexOf(a);
        if (b > -1) {
            sa(this.components, b);
            this.element.removeChild(a.element);
            a.parent = null
        }
        return this
    };
    p.prototype.__computeChildZIndex = function(a) {
        return (parseInt(this.element.style.zIndex) || 0) + (parseInt(a) || 0)
    };
    p.prototype.__fixZIndex = function() {
        g.prototype.__fixZIndex.call(this);
        for (var a = 0, b = this.components.length; a < b; a++) this.components[a].__fixZIndex()
    };
    p.prototype.toString = s("[object Container]");
    m.container = p;
    r(z, p);
    v(z);
    z.prototype.addComponent = function(a) {
        p.prototype.addComponent.call(this, a);
        this.__needsRender = true;
        return this
    };
    z.prototype.removeComponent = function(a) {
        p.prototype.removeComponent.call(this, a);
        this.__needsRender = true;
        return this
    };
    z.prototype.render = function(a) {
        if (this.width != this.__width || this.height != this.__height) this.__needsRender = true;
        p.prototype.render.call(this,
            a)
    };
    z.prototype.__renderComponents = function(a) {
        p.prototype.__renderComponents.call(this, a);
        this.__needsRender = false
    };
    z.prototype.renderComponents = function() {
        this.__needsRender = true
    };
    z.prototype.toString = s("[object DumbContainer]");
    m.dumbcontainer = z;
    r(t, g);
    v(t);
    t.prototype.getElement = function() {
        var a = o.createElement("pre"),
            b = {
                border: "none 0px #000000",
                "background-color": "transparent",
                position: "absolute",
                overflow: "hidden",
                margin: "0px",
                padding: "0px"
            };
        for (var c in b) l(a, c, b[c]);
        return function() {
            var d =
                a.cloneNode(false);
            l(d, "color", "#" + this.color);
            this._c = this.color;
            l(d, "font-family", this.font.__fontName);
            this._f = this.font;
            l(d, "font-size", this.size / w + "px");
            l(d, "line-height", this.size / w + "px");
            this._s = this.size;
            return d
        }
    }();
    t.prototype.render = function(a) {
        g.prototype.render.call(this, a);
        if (this.__align !== this.align) {
            l(this.element, "text-align", this.align == 0 ? "left" : this.align == 1 ? "center" : "right");
            this.__align = this.align
        }
        if (this.__font !== this.font) {
            l(this.element, "font-family", this.font.__fontName);
            this.__font = this.font
        }
        if (this.__size !== this.size) {
            a = this.size / w + "px";
            l(this.element, "font-size", a);
            l(this.element, "line-height", a);
            this.__size = this.size
        }
        if (this._c !== this.color) {
            l(this.element, "color", "#" + this.color);
            this._c = this.color
        }
        if (this._U) {
            a = "";
            for (var b = this._t.length, c = 0, d = 0, e, h; c < b; c++) {
                e = this._t.charAt(c);
                if (e === "\n") {
                    d = 0;
                    a += e
                } else if (e === "\t") {
                    e = t.TAB_WIDTH - d % t.TAB_WIDTH;
                    for (h = 0; h < e; h++) a += " ";
                    d += e
                } else {
                    a += e;
                    d++
                }
            }
            if (Fa) a = a.replace(/\n/g, "\r");
            this._n.nodeValue = a;
            this._U = false
        }
    };
    t.prototype.getText =
        function() {
            return this._t
        };
    t.prototype.setText = function(a) {
        this._t = a;
        this._U = true
    };
    t.prototype.align = 0;
    t.prototype.color = "FFFFFF";
    t.prototype.font = new I("monospace");
    t.prototype.size = 12;
    t.prototype.toString = s("[object Label]");
    L(t, {
        LEFT: 0,
        CENTER: 1,
        RIGHT: 2,
        TAB_WIDTH: 4
    });
    m.label = t;
    r(A, g);
    v(A);
    A.prototype.getElement = function() {
        var a = g.prototype.getElement.call(this);
        a.appendChild(this.spritesetImg);
        return a
    };
    A.prototype.render = function(a) {
        var b = this;
        if (b.__spriteX != b.spriteX || b.__spriteY != b.spriteY ||
            b.__width != b.width || b.__height != b.height)
            if (b.spriteset.loaded) b.resetSpriteset();
            else if (!b.__resetOnLoad) {
            b.spriteset.addListener("load", function() {
                b.resetSpriteset()
            });
            b.__resetOnLoad = true
        }
        g.prototype.render.call(b, a)
    };
    A.prototype.resetSpriteset = function() {
        var a = this.spritesetImg;
        l(a, "width", this.spriteset.width * (this.width / this.spriteset.spriteWidth) / w + "px");
        l(a, "height", this.spriteset.height * (this.height / this.spriteset.spriteHeight) / w + "px");
        l(a, "top", -(this.height * this.spriteY / w) + "px");
        l(a, "left",
            -(this.width * this.spriteX / w) + "px");
        this.__spriteX = this.spriteX;
        this.__spriteY = this.spriteY
    };
    A.prototype.spriteX = 0;
    A.prototype.spriteY = 0;
    A.prototype.toString = s("[object Sprite]");
    m.sprite = A;
    r(D, g);
    v(D);
    D.prototype.render = function(a) {
        if (this.__color !== this.color) {
            l(this.element, "background-color", "#" + this.color);
            this.__color = this.color
        }
        g.prototype.render.call(this, a)
    };
    D.prototype.color = "000000";
    D.prototype.toString = s("[object Shape]");
    m.shape = D;
    r(H, D);
    v(H);
    H.prototype.getElement = function() {
        this.__color =
            this.color;
        var a = new Element("div");
        l(a, "position", "absolute");
        l(a, "background-color", "#" + this.color);
        return a
    };
    H.prototype.toString = s("[object Rectangle]");
    m.rectangle = H;
    i.prototype.addListener = function(a, b) {
        var c = this._l;
        if (a in c) c[a].push(b);
        else c[a] = [b];
        return this
    };
    i.prototype.removeListener = function(a, b) {
        var c = this._l[a];
        if (c) {
            var d = c.indexOf(b);
            d >= 0 && sa(c, d)
        }
        return this
    };
    i.prototype.removeAllListeners = function(a) {
        delete this._l[a];
        return this
    };
    i.prototype.emit = function(a, b) {
        var c = this._l[a];
        if (c) {
            c = K.call(c, 0);
            b = b || [];
            for (var d = 0, e = c.length; d < e; d++) c[d].apply(this, b)
        }
        return this
    };
    var va = false;
    i.prototype.fireEvent = function() {
        if (!va) {
            J("DEPRECATED: 'EventEmitter#fireEvent' is deprecated, please use 'EventEmitter#emit' instead.");
            va = true
        }
        return this.emit.apply(this, arguments)
    };
    var wa = false;
    i.prototype.observe = function() {
        if (!wa) {
            J("DEPRECATED: 'EventEmitter#observe' is deprecated, please use 'EventEmitter#addListener' instead.");
            wa = true
        }
        return this.addListener.apply(this, arguments)
    };
    var xa =
        false;
    i.prototype.stopObserving = function() {
        if (!xa) {
            J("DEPRECATED: 'EventEmitter#stopObserving' is deprecated, please use 'EventEmitter#removeListener' instead.");
            xa = true
        }
        return this.removeListener.apply(this, arguments)
    };
    m.eventemitter = i;

    function E(a) {
        var b = this;
        i.call(b);
        b._bind = function(c) {
            var d = c.style;
            d.padding = 0;
            d.overflow = "hidden";
            if (d.MozUserSelect !== ca) d.MozUserSelect = "moz-none";
            else if (d.webkitUserSelect !== ca) d.webkitUserSelect = "none";
            Element.makePositioned(c);
            d = 0;
            for (var e = c.childNodes, h =
                    e.length, q = null; d < h; d++)(q = e[d]) && q.id != "webSocketContainer" && c.removeChild(q);
            b.element !== null && Object.isElement(b.element) && Element.immediateDescendants(b.element).invoke("remove").each(c.insert, c);
            b.element = c;
            a.element = c;
            b.isFullScreen = c === o.body
        };
        b.useNativeCursor = function(c) {
            var d = null;
            if (Boolean(c) == false) c = "none";
            if (Object.isString(c)) {
                c = c.toLowerCase();
                if ("default" == c) d = "default";
                else if ("crosshair" == c) d = "crosshair";
                else if ("hand" == c) d = "pointer";
                else if ("move" == c) d = "move";
                else if ("text" ==
                    c) d = "text";
                else if ("wait" == c) d = "wait";
                else if ("none" == c) d = "url(" + Z + "blank." + (V ? "cur" : "gif") + "), none"
            }
            b.element.style.cursor = d
        }
    }
    r(E, i);
    E.prototype._r = function() {
        var a = this.color,
            b = this.element;
        this._browserWidth = this.isFullScreen && o.documentElement.clientWidth !== 0 ? o.documentElement.clientWidth : this.element.clientWidth;
        this._browserHeight = this.isFullScreen && o.documentElement.clientHeight !== 0 ? o.documentElement.clientHeight : this.element.clientHeight;
        this.width = this._browserWidth * w;
        this.height = this._browserHeight *
            w;
        if (a != this._c) {
            b.style.backgroundColor = "#" + a;
            this._c = a
        }
    };
    E.prototype.color = "000000";
    E.prototype.isFullScreen = false;
    E.prototype.toString = s("[object Screen]");
    m.screen = E;
    var f = null;
    r(n, i);
    n.prototype.pointerX = 0;
    n.prototype.pointerY = 0;
    n.prototype.isKeyDown = function(a) {
        return this._k[a] === true
    };
    n.prototype.toString = s("[object Input]");
    n.MOUSE_PRIMARY = 0;
    n.MOUSE_MIDDLE = 1;
    n.MOUSE_SECONDARY = 2;
    n.KEY_DOWN = 40;
    n.KEY_UP = 38;
    n.KEY_LEFT = 37;
    n.KEY_RIGHT = 39;
    n.KEY_1 = 32;
    n.KEY_2 = 33;
    n.KEY_3 = 34;
    n.KEY_4 = 35;
    n.grab = function() {
        o.observe("keydown",
            fa).observe("keypress", ea).observe("keyup", ga).observe("mousemove", ia).observe("mousedown", N).observe("mouseup", ha).observe("touchstart", W).observe("touchmove", ja).observe("touchend", ka).observe("contextmenu", da);
        n.c = true
    };
    n.release = function() {
        o.stopObserving("keydown", fa).stopObserving("keypress", ea).stopObserving("keyup", ga).stopObserving("mousemove", ia).stopObserving("mousedown", N).stopObserving("mouseup", ha).stopObserving("touchstart", W).stopObserving("touchmove", ja).stopObserving("touchend",
            ka).stopObserving("contextmenu", da);
        n.c = false
    };
    m.input = n;
    var ya = function() {
            return "now" in Date ? Date.now : function() {
                return (new Date).getTime()
            }
        }(),
        P = null,
        G = [];
    r(k, p);
    v(k);
    k.prototype.gameSpeed = 30;
    k.prototype.loaded = false;
    k.prototype.maxFrameSkips = 5;
    k.prototype.renderCount = 0;
    k.prototype.updateCount = 0;
    k.prototype.setGameSpeed = function(a) {
        this.gameSpeed = a;
        this.period = 1E3 / a;
        return this
    };
    k.prototype.start = function() {
        S('Starting "' + this.root + '"');
        this.running = true;
        G.push(this);
        this.startTime = this.nextGamePeriod =
            ya();
        this.updateCount = this.renderCount = 0;
        setTimeout(this._s, 0);
        this.emit("start")
    };
    k.prototype.getFont = function(a, b) {
        return new m.font(this, a, b)
    };
    k.prototype.getScript = function(a, b) {
        return new m.script(this, a, b)
    };
    k.prototype.getSound = function(a, b) {
        return new m.sound(this, a, b)
    };
    k.prototype.getSpriteset = function(a, b, c, d) {
        return new m.spriteset(this, a, b, c, d)
    };
    k.prototype.render = function() {
        for (var a = K.call(this.components, 0), b = 0, c = null, d = this.renderCount++, e = a.length; b < e; b++) {
            c = a[b];
            c.render && c.render(d)
        }
    };
    k.prototype.step = function() {
        if (!this.running) return this.stopped();
        P = this;
        for (var a = 0; ya() > this.nextGamePeriod && a < this.maxFrameSkips;) {
            this.update();
            this.nextGamePeriod += this.period;
            a++
        }
        this.screen._r();
        this.render();
        setTimeout(this._s, 0)
    };
    k.prototype.stop = function() {
        this.emit("stopping");
        this.running = false;
        return this
    };
    k.prototype.stopped = function() {
        this.screen.useNativeCursor(true);
        P = null;
        this.emit("stopped")
    };
    k.prototype.update = function() {
        for (var a = K.call(this.components, 0), b = 0, c = null, d = this.updateCount++,
                e = a.length; b < e; b++) {
            c = a[b];
            c.update && c.update(d)
        }
    };
    k.prototype.__computeChildZIndex = function(a) {
        return ((parseInt(a) || 0) + 1) * 1E3
    };
    k.prototype.toString = s("[object Game]");
    k.getInstance = function() {
        return P
    };
    m.game = k;
    r(I, i);
    v(I);
    I.prototype.toString = s("[object Font]");
    m.font = I;
    r(x, i);
    v(x);
    x.prototype.loaded = false;
    x.prototype.toString = s("[object Script]");
    m.script = x;
    r(Q, i);
    v(Q);
    Q.prototype.toString = s("[object Sound]");
    m.sound = Q;
    r(y, i);
    v(y);
    y.prototype.loaded = false;
    y.prototype.width = NaN;
    y.prototype.height =
        NaN;
    y.prototype.spriteWidth = NaN;
    y.prototype.spriteHeight = NaN;
    y.prototype.src = null;
    y.prototype.toString = s("[object Spriteset]");
    m.spriteset = y;
    r(B, i);
    v(B);
    B.prototype.connect = function() {
        var a = new WebSocket(this.URL);
        a.onopen = this._O;
        a.onclose = this._C;
        a.onmessage = this._M;
        this._w = a
    };
    B.prototype.close = function() {
        this._w && this._w.close()
    };
    B.prototype.send = function(a) {
        this._w.send(a)
    };
    B.prototype.autoconnect = false;
    B.prototype.toString = s("[object Client]");
    L(B, {
        CONNECTING: 0,
        OPEN: 1,
        CLOSED: 2
    });
    m.client = B;
    la.canServe =
        false;
    m.server = la;
    var C = new i;
    C.toString = s("[object SGF]");
    j.SGF = C;
    C.log = J;
    C.inherits = r;
    C.require = function(a) {
        if (typeof a == "string") {
            a = String(a).toLowerCase();
            if (a in m) return m[a];
            throw Error("SGF.require: module name '" + a + "' does not exist");
        }
        throw Error("SGF.require: expected argument typeof 'string', got '" + typeof a + "'");
    };
    C.startWithDiv = Y;
    C.startFullScreen = ma;
    (function(a) {
        try {
            0()
        } catch (b) {
            if (b.fileName) a(b.fileName);
            else if (b.sourceURL) a(b.sourceURL);
            else if (b.arguments) {
                var c = Error.prepareStackTrace;
                Error.prepareStackTrace = function(h, q) {
                    return q[1].getFileName()
                };
                var d = b.stack;
                Error.prepareStackTrace = c;
                a(d)
            } else if (b.stack) {
                c = b.stack;
                c = c.split("\n")[0];
                c = c.substring(c.indexOf("@") + 1);
                a(c.substring(0, c.lastIndexOf(":")))
            } else {
                var e = j.onerror;
                j.onerror = function(h, q) {
                    j.onerror = e;
                    a(q);
                    return true
                };
                throw b;
            }
        }
    })(function(a) {
        T = a;
        Z = T.substring(0, T.lastIndexOf("/") + 1);
        a: {
            a = T;
            var b = o.getElementsByTagName("script"),
                c = b.length,
                d = o.getElementById("SGF-script");
            if (d) ba = d;
            else {
                for (; c--;) {
                    d = b[c];
                    if (d.src ===
                        a) {
                        ba = d;
                        break a
                    }
                }
                throw Error('FATAL: Could not find <script> node with "src" === "' + a + '"\nPlease report this to the SGF issue tracker. You can work around this error by explicitly setting the "id" of the <script> node to "SGF-script".');
            }
        }
        a = ba;
        for (b = a.attributes.length; b--;) {
            c = a.attributes[b].nodeName;
            if (c.indexOf("data-") === 0) u[c.substring(5)] = a.getAttribute(c)
        }
        if (na()) R();
        else new x(F(u.prototype), Da);
        if (oa()) ra();
        else new x(F(u.swfobject), ra)
    })
})(this, document);