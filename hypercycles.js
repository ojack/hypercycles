(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * chroma.js - JavaScript library for color conversions
 *
 * Copyright (c) 2011-2019, Gregor Aisch
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. The name Gregor Aisch may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * -------------------------------------------------------
 *
 * chroma.js includes colors from colorbrewer2.org, which are released under
 * the following license:
 *
 * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
 * and The Pennsylvania State University.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * ------------------------------------------------------
 *
 * Named colors are taken from X11 Color Names.
 * http://www.w3.org/TR/css3-color/#svg-color
 *
 * @preserve
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.chroma = factory());
})(this, (function () { 'use strict';

    var limit$2 = function (x, min, max) {
        if ( min === void 0 ) min=0;
        if ( max === void 0 ) max=1;

        return x < min ? min : x > max ? max : x;
    };

    var limit$1 = limit$2;

    var clip_rgb$3 = function (rgb) {
        rgb._clipped = false;
        rgb._unclipped = rgb.slice(0);
        for (var i=0; i<=3; i++) {
            if (i < 3) {
                if (rgb[i] < 0 || rgb[i] > 255) { rgb._clipped = true; }
                rgb[i] = limit$1(rgb[i], 0, 255);
            } else if (i === 3) {
                rgb[i] = limit$1(rgb[i], 0, 1);
            }
        }
        return rgb;
    };

    // ported from jQuery's $.type
    var classToType = {};
    for (var i$1 = 0, list$1 = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Undefined', 'Null']; i$1 < list$1.length; i$1 += 1) {
        var name = list$1[i$1];

        classToType[("[object " + name + "]")] = name.toLowerCase();
    }
    var type$p = function(obj) {
        return classToType[Object.prototype.toString.call(obj)] || "object";
    };

    var type$o = type$p;

    var unpack$B = function (args, keyOrder) {
        if ( keyOrder === void 0 ) keyOrder=null;

    	// if called with more than 3 arguments, we return the arguments
        if (args.length >= 3) { return Array.prototype.slice.call(args); }
        // with less than 3 args we check if first arg is object
        // and use the keyOrder string to extract and sort properties
    	if (type$o(args[0]) == 'object' && keyOrder) {
    		return keyOrder.split('')
    			.filter(function (k) { return args[0][k] !== undefined; })
    			.map(function (k) { return args[0][k]; });
    	}
    	// otherwise we just return the first argument
    	// (which we suppose is an array of args)
        return args[0];
    };

    var type$n = type$p;

    var last$4 = function (args) {
        if (args.length < 2) { return null; }
        var l = args.length-1;
        if (type$n(args[l]) == 'string') { return args[l].toLowerCase(); }
        return null;
    };

    var PI$2 = Math.PI;

    var utils = {
    	clip_rgb: clip_rgb$3,
    	limit: limit$2,
    	type: type$p,
    	unpack: unpack$B,
    	last: last$4,
    	PI: PI$2,
    	TWOPI: PI$2*2,
    	PITHIRD: PI$2/3,
    	DEG2RAD: PI$2 / 180,
    	RAD2DEG: 180 / PI$2
    };

    var input$h = {
    	format: {},
    	autodetect: []
    };

    var last$3 = utils.last;
    var clip_rgb$2 = utils.clip_rgb;
    var type$m = utils.type;
    var _input = input$h;

    var Color$D = function Color() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var me = this;
        if (type$m(args[0]) === 'object' &&
            args[0].constructor &&
            args[0].constructor === this.constructor) {
            // the argument is already a Color instance
            return args[0];
        }

        // last argument could be the mode
        var mode = last$3(args);
        var autodetect = false;

        if (!mode) {
            autodetect = true;
            if (!_input.sorted) {
                _input.autodetect = _input.autodetect.sort(function (a,b) { return b.p - a.p; });
                _input.sorted = true;
            }
            // auto-detect format
            for (var i = 0, list = _input.autodetect; i < list.length; i += 1) {
                var chk = list[i];

                mode = chk.test.apply(chk, args);
                if (mode) { break; }
            }
        }

        if (_input.format[mode]) {
            var rgb = _input.format[mode].apply(null, autodetect ? args : args.slice(0,-1));
            me._rgb = clip_rgb$2(rgb);
        } else {
            throw new Error('unknown format: '+args);
        }

        // add alpha channel
        if (me._rgb.length === 3) { me._rgb.push(1); }
    };

    Color$D.prototype.toString = function toString () {
        if (type$m(this.hex) == 'function') { return this.hex(); }
        return ("[" + (this._rgb.join(',')) + "]");
    };

    var Color_1 = Color$D;

    var chroma$k = function () {
    	var args = [], len = arguments.length;
    	while ( len-- ) args[ len ] = arguments[ len ];

    	return new (Function.prototype.bind.apply( chroma$k.Color, [ null ].concat( args) ));
    };

    chroma$k.Color = Color_1;
    chroma$k.version = '2.4.2';

    var chroma_1 = chroma$k;

    var unpack$A = utils.unpack;
    var max$2 = Math.max;

    var rgb2cmyk$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$A(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        r = r / 255;
        g = g / 255;
        b = b / 255;
        var k = 1 - max$2(r,max$2(g,b));
        var f = k < 1 ? 1 / (1-k) : 0;
        var c = (1-r-k) * f;
        var m = (1-g-k) * f;
        var y = (1-b-k) * f;
        return [c,m,y,k];
    };

    var rgb2cmyk_1 = rgb2cmyk$1;

    var unpack$z = utils.unpack;

    var cmyk2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$z(args, 'cmyk');
        var c = args[0];
        var m = args[1];
        var y = args[2];
        var k = args[3];
        var alpha = args.length > 4 ? args[4] : 1;
        if (k === 1) { return [0,0,0,alpha]; }
        return [
            c >= 1 ? 0 : 255 * (1-c) * (1-k), // r
            m >= 1 ? 0 : 255 * (1-m) * (1-k), // g
            y >= 1 ? 0 : 255 * (1-y) * (1-k), // b
            alpha
        ];
    };

    var cmyk2rgb_1 = cmyk2rgb;

    var chroma$j = chroma_1;
    var Color$C = Color_1;
    var input$g = input$h;
    var unpack$y = utils.unpack;
    var type$l = utils.type;

    var rgb2cmyk = rgb2cmyk_1;

    Color$C.prototype.cmyk = function() {
        return rgb2cmyk(this._rgb);
    };

    chroma$j.cmyk = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$C, [ null ].concat( args, ['cmyk']) ));
    };

    input$g.format.cmyk = cmyk2rgb_1;

    input$g.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$y(args, 'cmyk');
            if (type$l(args) === 'array' && args.length === 4) {
                return 'cmyk';
            }
        }
    });

    var unpack$x = utils.unpack;
    var last$2 = utils.last;
    var rnd = function (a) { return Math.round(a*100)/100; };

    /*
     * supported arguments:
     * - hsl2css(h,s,l)
     * - hsl2css(h,s,l,a)
     * - hsl2css([h,s,l], mode)
     * - hsl2css([h,s,l,a], mode)
     * - hsl2css({h,s,l,a}, mode)
     */
    var hsl2css$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var hsla = unpack$x(args, 'hsla');
        var mode = last$2(args) || 'lsa';
        hsla[0] = rnd(hsla[0] || 0);
        hsla[1] = rnd(hsla[1]*100) + '%';
        hsla[2] = rnd(hsla[2]*100) + '%';
        if (mode === 'hsla' || (hsla.length > 3 && hsla[3]<1)) {
            hsla[3] = hsla.length > 3 ? hsla[3] : 1;
            mode = 'hsla';
        } else {
            hsla.length = 3;
        }
        return (mode + "(" + (hsla.join(',')) + ")");
    };

    var hsl2css_1 = hsl2css$1;

    var unpack$w = utils.unpack;

    /*
     * supported arguments:
     * - rgb2hsl(r,g,b)
     * - rgb2hsl(r,g,b,a)
     * - rgb2hsl([r,g,b])
     * - rgb2hsl([r,g,b,a])
     * - rgb2hsl({r,g,b,a})
     */
    var rgb2hsl$3 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$w(args, 'rgba');
        var r = args[0];
        var g = args[1];
        var b = args[2];

        r /= 255;
        g /= 255;
        b /= 255;

        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);

        var l = (max + min) / 2;
        var s, h;

        if (max === min){
            s = 0;
            h = Number.NaN;
        } else {
            s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
        }

        if (r == max) { h = (g - b) / (max - min); }
        else if (g == max) { h = 2 + (b - r) / (max - min); }
        else if (b == max) { h = 4 + (r - g) / (max - min); }

        h *= 60;
        if (h < 0) { h += 360; }
        if (args.length>3 && args[3]!==undefined) { return [h,s,l,args[3]]; }
        return [h,s,l];
    };

    var rgb2hsl_1 = rgb2hsl$3;

    var unpack$v = utils.unpack;
    var last$1 = utils.last;
    var hsl2css = hsl2css_1;
    var rgb2hsl$2 = rgb2hsl_1;
    var round$6 = Math.round;

    /*
     * supported arguments:
     * - rgb2css(r,g,b)
     * - rgb2css(r,g,b,a)
     * - rgb2css([r,g,b], mode)
     * - rgb2css([r,g,b,a], mode)
     * - rgb2css({r,g,b,a}, mode)
     */
    var rgb2css$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgba = unpack$v(args, 'rgba');
        var mode = last$1(args) || 'rgb';
        if (mode.substr(0,3) == 'hsl') {
            return hsl2css(rgb2hsl$2(rgba), mode);
        }
        rgba[0] = round$6(rgba[0]);
        rgba[1] = round$6(rgba[1]);
        rgba[2] = round$6(rgba[2]);
        if (mode === 'rgba' || (rgba.length > 3 && rgba[3]<1)) {
            rgba[3] = rgba.length > 3 ? rgba[3] : 1;
            mode = 'rgba';
        }
        return (mode + "(" + (rgba.slice(0,mode==='rgb'?3:4).join(',')) + ")");
    };

    var rgb2css_1 = rgb2css$1;

    var unpack$u = utils.unpack;
    var round$5 = Math.round;

    var hsl2rgb$1 = function () {
        var assign;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack$u(args, 'hsl');
        var h = args[0];
        var s = args[1];
        var l = args[2];
        var r,g,b;
        if (s === 0) {
            r = g = b = l*255;
        } else {
            var t3 = [0,0,0];
            var c = [0,0,0];
            var t2 = l < 0.5 ? l * (1+s) : l+s-l*s;
            var t1 = 2 * l - t2;
            var h_ = h / 360;
            t3[0] = h_ + 1/3;
            t3[1] = h_;
            t3[2] = h_ - 1/3;
            for (var i=0; i<3; i++) {
                if (t3[i] < 0) { t3[i] += 1; }
                if (t3[i] > 1) { t3[i] -= 1; }
                if (6 * t3[i] < 1)
                    { c[i] = t1 + (t2 - t1) * 6 * t3[i]; }
                else if (2 * t3[i] < 1)
                    { c[i] = t2; }
                else if (3 * t3[i] < 2)
                    { c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6; }
                else
                    { c[i] = t1; }
            }
            (assign = [round$5(c[0]*255),round$5(c[1]*255),round$5(c[2]*255)], r = assign[0], g = assign[1], b = assign[2]);
        }
        if (args.length > 3) {
            // keep alpha channel
            return [r,g,b,args[3]];
        }
        return [r,g,b,1];
    };

    var hsl2rgb_1 = hsl2rgb$1;

    var hsl2rgb = hsl2rgb_1;
    var input$f = input$h;

    var RE_RGB = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;
    var RE_RGBA = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/;
    var RE_RGB_PCT = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
    var RE_RGBA_PCT = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
    var RE_HSL = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
    var RE_HSLA = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;

    var round$4 = Math.round;

    var css2rgb$1 = function (css) {
        css = css.toLowerCase().trim();
        var m;

        if (input$f.format.named) {
            try {
                return input$f.format.named(css);
            } catch (e) {
                // eslint-disable-next-line
            }
        }

        // rgb(250,20,0)
        if ((m = css.match(RE_RGB))) {
            var rgb = m.slice(1,4);
            for (var i=0; i<3; i++) {
                rgb[i] = +rgb[i];
            }
            rgb[3] = 1;  // default alpha
            return rgb;
        }

        // rgba(250,20,0,0.4)
        if ((m = css.match(RE_RGBA))) {
            var rgb$1 = m.slice(1,5);
            for (var i$1=0; i$1<4; i$1++) {
                rgb$1[i$1] = +rgb$1[i$1];
            }
            return rgb$1;
        }

        // rgb(100%,0%,0%)
        if ((m = css.match(RE_RGB_PCT))) {
            var rgb$2 = m.slice(1,4);
            for (var i$2=0; i$2<3; i$2++) {
                rgb$2[i$2] = round$4(rgb$2[i$2] * 2.55);
            }
            rgb$2[3] = 1;  // default alpha
            return rgb$2;
        }

        // rgba(100%,0%,0%,0.4)
        if ((m = css.match(RE_RGBA_PCT))) {
            var rgb$3 = m.slice(1,5);
            for (var i$3=0; i$3<3; i$3++) {
                rgb$3[i$3] = round$4(rgb$3[i$3] * 2.55);
            }
            rgb$3[3] = +rgb$3[3];
            return rgb$3;
        }

        // hsl(0,100%,50%)
        if ((m = css.match(RE_HSL))) {
            var hsl = m.slice(1,4);
            hsl[1] *= 0.01;
            hsl[2] *= 0.01;
            var rgb$4 = hsl2rgb(hsl);
            rgb$4[3] = 1;
            return rgb$4;
        }

        // hsla(0,100%,50%,0.5)
        if ((m = css.match(RE_HSLA))) {
            var hsl$1 = m.slice(1,4);
            hsl$1[1] *= 0.01;
            hsl$1[2] *= 0.01;
            var rgb$5 = hsl2rgb(hsl$1);
            rgb$5[3] = +m[4];  // default alpha = 1
            return rgb$5;
        }
    };

    css2rgb$1.test = function (s) {
        return RE_RGB.test(s) ||
            RE_RGBA.test(s) ||
            RE_RGB_PCT.test(s) ||
            RE_RGBA_PCT.test(s) ||
            RE_HSL.test(s) ||
            RE_HSLA.test(s);
    };

    var css2rgb_1 = css2rgb$1;

    var chroma$i = chroma_1;
    var Color$B = Color_1;
    var input$e = input$h;
    var type$k = utils.type;

    var rgb2css = rgb2css_1;
    var css2rgb = css2rgb_1;

    Color$B.prototype.css = function(mode) {
        return rgb2css(this._rgb, mode);
    };

    chroma$i.css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$B, [ null ].concat( args, ['css']) ));
    };

    input$e.format.css = css2rgb;

    input$e.autodetect.push({
        p: 5,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type$k(h) === 'string' && css2rgb.test(h)) {
                return 'css';
            }
        }
    });

    var Color$A = Color_1;
    var chroma$h = chroma_1;
    var input$d = input$h;
    var unpack$t = utils.unpack;

    input$d.format.gl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgb = unpack$t(args, 'rgba');
        rgb[0] *= 255;
        rgb[1] *= 255;
        rgb[2] *= 255;
        return rgb;
    };

    chroma$h.gl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$A, [ null ].concat( args, ['gl']) ));
    };

    Color$A.prototype.gl = function() {
        var rgb = this._rgb;
        return [rgb[0]/255, rgb[1]/255, rgb[2]/255, rgb[3]];
    };

    var unpack$s = utils.unpack;

    var rgb2hcg$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$s(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var delta = max - min;
        var c = delta * 100 / 255;
        var _g = min / (255 - delta) * 100;
        var h;
        if (delta === 0) {
            h = Number.NaN;
        } else {
            if (r === max) { h = (g - b) / delta; }
            if (g === max) { h = 2+(b - r) / delta; }
            if (b === max) { h = 4+(r - g) / delta; }
            h *= 60;
            if (h < 0) { h += 360; }
        }
        return [h, c, _g];
    };

    var rgb2hcg_1 = rgb2hcg$1;

    var unpack$r = utils.unpack;
    var floor$3 = Math.floor;

    /*
     * this is basically just HSV with some minor tweaks
     *
     * hue.. [0..360]
     * chroma .. [0..1]
     * grayness .. [0..1]
     */

    var hcg2rgb = function () {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack$r(args, 'hcg');
        var h = args[0];
        var c = args[1];
        var _g = args[2];
        var r,g,b;
        _g = _g * 255;
        var _c = c * 255;
        if (c === 0) {
            r = g = b = _g;
        } else {
            if (h === 360) { h = 0; }
            if (h > 360) { h -= 360; }
            if (h < 0) { h += 360; }
            h /= 60;
            var i = floor$3(h);
            var f = h - i;
            var p = _g * (1 - c);
            var q = p + _c * (1 - f);
            var t = p + _c * f;
            var v = p + _c;
            switch (i) {
                case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
                case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
                case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
                case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
                case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
                case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
            }
        }
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var hcg2rgb_1 = hcg2rgb;

    var unpack$q = utils.unpack;
    var type$j = utils.type;
    var chroma$g = chroma_1;
    var Color$z = Color_1;
    var input$c = input$h;

    var rgb2hcg = rgb2hcg_1;

    Color$z.prototype.hcg = function() {
        return rgb2hcg(this._rgb);
    };

    chroma$g.hcg = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$z, [ null ].concat( args, ['hcg']) ));
    };

    input$c.format.hcg = hcg2rgb_1;

    input$c.autodetect.push({
        p: 1,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$q(args, 'hcg');
            if (type$j(args) === 'array' && args.length === 3) {
                return 'hcg';
            }
        }
    });

    var unpack$p = utils.unpack;
    var last = utils.last;
    var round$3 = Math.round;

    var rgb2hex$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$p(args, 'rgba');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var a = ref[3];
        var mode = last(args) || 'auto';
        if (a === undefined) { a = 1; }
        if (mode === 'auto') {
            mode = a < 1 ? 'rgba' : 'rgb';
        }
        r = round$3(r);
        g = round$3(g);
        b = round$3(b);
        var u = r << 16 | g << 8 | b;
        var str = "000000" + u.toString(16); //#.toUpperCase();
        str = str.substr(str.length - 6);
        var hxa = '0' + round$3(a * 255).toString(16);
        hxa = hxa.substr(hxa.length - 2);
        switch (mode.toLowerCase()) {
            case 'rgba': return ("#" + str + hxa);
            case 'argb': return ("#" + hxa + str);
            default: return ("#" + str);
        }
    };

    var rgb2hex_1 = rgb2hex$2;

    var RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    var RE_HEXA = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/;

    var hex2rgb$1 = function (hex) {
        if (hex.match(RE_HEX)) {
            // remove optional leading #
            if (hex.length === 4 || hex.length === 7) {
                hex = hex.substr(1);
            }
            // expand short-notation to full six-digit
            if (hex.length === 3) {
                hex = hex.split('');
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            }
            var u = parseInt(hex, 16);
            var r = u >> 16;
            var g = u >> 8 & 0xFF;
            var b = u & 0xFF;
            return [r,g,b,1];
        }

        // match rgba hex format, eg #FF000077
        if (hex.match(RE_HEXA)) {
            if (hex.length === 5 || hex.length === 9) {
                // remove optional leading #
                hex = hex.substr(1);
            }
            // expand short-notation to full eight-digit
            if (hex.length === 4) {
                hex = hex.split('');
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
            }
            var u$1 = parseInt(hex, 16);
            var r$1 = u$1 >> 24 & 0xFF;
            var g$1 = u$1 >> 16 & 0xFF;
            var b$1 = u$1 >> 8 & 0xFF;
            var a = Math.round((u$1 & 0xFF) / 0xFF * 100) / 100;
            return [r$1,g$1,b$1,a];
        }

        // we used to check for css colors here
        // if _input.css? and rgb = _input.css hex
        //     return rgb

        throw new Error(("unknown hex color: " + hex));
    };

    var hex2rgb_1 = hex2rgb$1;

    var chroma$f = chroma_1;
    var Color$y = Color_1;
    var type$i = utils.type;
    var input$b = input$h;

    var rgb2hex$1 = rgb2hex_1;

    Color$y.prototype.hex = function(mode) {
        return rgb2hex$1(this._rgb, mode);
    };

    chroma$f.hex = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$y, [ null ].concat( args, ['hex']) ));
    };

    input$b.format.hex = hex2rgb_1;
    input$b.autodetect.push({
        p: 4,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type$i(h) === 'string' && [3,4,5,6,7,8,9].indexOf(h.length) >= 0) {
                return 'hex';
            }
        }
    });

    var unpack$o = utils.unpack;
    var TWOPI$2 = utils.TWOPI;
    var min$2 = Math.min;
    var sqrt$4 = Math.sqrt;
    var acos = Math.acos;

    var rgb2hsi$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        borrowed from here:
        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
        */
        var ref = unpack$o(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        r /= 255;
        g /= 255;
        b /= 255;
        var h;
        var min_ = min$2(r,g,b);
        var i = (r+g+b) / 3;
        var s = i > 0 ? 1 - min_/i : 0;
        if (s === 0) {
            h = NaN;
        } else {
            h = ((r-g)+(r-b)) / 2;
            h /= sqrt$4((r-g)*(r-g) + (r-b)*(g-b));
            h = acos(h);
            if (b > g) {
                h = TWOPI$2 - h;
            }
            h /= TWOPI$2;
        }
        return [h*360,s,i];
    };

    var rgb2hsi_1 = rgb2hsi$1;

    var unpack$n = utils.unpack;
    var limit = utils.limit;
    var TWOPI$1 = utils.TWOPI;
    var PITHIRD = utils.PITHIRD;
    var cos$4 = Math.cos;

    /*
     * hue [0..360]
     * saturation [0..1]
     * intensity [0..1]
     */
    var hsi2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        borrowed from here:
        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
        */
        args = unpack$n(args, 'hsi');
        var h = args[0];
        var s = args[1];
        var i = args[2];
        var r,g,b;

        if (isNaN(h)) { h = 0; }
        if (isNaN(s)) { s = 0; }
        // normalize hue
        if (h > 360) { h -= 360; }
        if (h < 0) { h += 360; }
        h /= 360;
        if (h < 1/3) {
            b = (1-s)/3;
            r = (1+s*cos$4(TWOPI$1*h)/cos$4(PITHIRD-TWOPI$1*h))/3;
            g = 1 - (b+r);
        } else if (h < 2/3) {
            h -= 1/3;
            r = (1-s)/3;
            g = (1+s*cos$4(TWOPI$1*h)/cos$4(PITHIRD-TWOPI$1*h))/3;
            b = 1 - (r+g);
        } else {
            h -= 2/3;
            g = (1-s)/3;
            b = (1+s*cos$4(TWOPI$1*h)/cos$4(PITHIRD-TWOPI$1*h))/3;
            r = 1 - (g+b);
        }
        r = limit(i*r*3);
        g = limit(i*g*3);
        b = limit(i*b*3);
        return [r*255, g*255, b*255, args.length > 3 ? args[3] : 1];
    };

    var hsi2rgb_1 = hsi2rgb;

    var unpack$m = utils.unpack;
    var type$h = utils.type;
    var chroma$e = chroma_1;
    var Color$x = Color_1;
    var input$a = input$h;

    var rgb2hsi = rgb2hsi_1;

    Color$x.prototype.hsi = function() {
        return rgb2hsi(this._rgb);
    };

    chroma$e.hsi = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$x, [ null ].concat( args, ['hsi']) ));
    };

    input$a.format.hsi = hsi2rgb_1;

    input$a.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$m(args, 'hsi');
            if (type$h(args) === 'array' && args.length === 3) {
                return 'hsi';
            }
        }
    });

    var unpack$l = utils.unpack;
    var type$g = utils.type;
    var chroma$d = chroma_1;
    var Color$w = Color_1;
    var input$9 = input$h;

    var rgb2hsl$1 = rgb2hsl_1;

    Color$w.prototype.hsl = function() {
        return rgb2hsl$1(this._rgb);
    };

    chroma$d.hsl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$w, [ null ].concat( args, ['hsl']) ));
    };

    input$9.format.hsl = hsl2rgb_1;

    input$9.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$l(args, 'hsl');
            if (type$g(args) === 'array' && args.length === 3) {
                return 'hsl';
            }
        }
    });

    var unpack$k = utils.unpack;
    var min$1 = Math.min;
    var max$1 = Math.max;

    /*
     * supported arguments:
     * - rgb2hsv(r,g,b)
     * - rgb2hsv([r,g,b])
     * - rgb2hsv({r,g,b})
     */
    var rgb2hsl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$k(args, 'rgb');
        var r = args[0];
        var g = args[1];
        var b = args[2];
        var min_ = min$1(r, g, b);
        var max_ = max$1(r, g, b);
        var delta = max_ - min_;
        var h,s,v;
        v = max_ / 255.0;
        if (max_ === 0) {
            h = Number.NaN;
            s = 0;
        } else {
            s = delta / max_;
            if (r === max_) { h = (g - b) / delta; }
            if (g === max_) { h = 2+(b - r) / delta; }
            if (b === max_) { h = 4+(r - g) / delta; }
            h *= 60;
            if (h < 0) { h += 360; }
        }
        return [h, s, v]
    };

    var rgb2hsv$1 = rgb2hsl;

    var unpack$j = utils.unpack;
    var floor$2 = Math.floor;

    var hsv2rgb = function () {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack$j(args, 'hsv');
        var h = args[0];
        var s = args[1];
        var v = args[2];
        var r,g,b;
        v *= 255;
        if (s === 0) {
            r = g = b = v;
        } else {
            if (h === 360) { h = 0; }
            if (h > 360) { h -= 360; }
            if (h < 0) { h += 360; }
            h /= 60;

            var i = floor$2(h);
            var f = h - i;
            var p = v * (1 - s);
            var q = v * (1 - s * f);
            var t = v * (1 - s * (1 - f));

            switch (i) {
                case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
                case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
                case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
                case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
                case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
                case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
            }
        }
        return [r,g,b,args.length > 3?args[3]:1];
    };

    var hsv2rgb_1 = hsv2rgb;

    var unpack$i = utils.unpack;
    var type$f = utils.type;
    var chroma$c = chroma_1;
    var Color$v = Color_1;
    var input$8 = input$h;

    var rgb2hsv = rgb2hsv$1;

    Color$v.prototype.hsv = function() {
        return rgb2hsv(this._rgb);
    };

    chroma$c.hsv = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$v, [ null ].concat( args, ['hsv']) ));
    };

    input$8.format.hsv = hsv2rgb_1;

    input$8.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$i(args, 'hsv');
            if (type$f(args) === 'array' && args.length === 3) {
                return 'hsv';
            }
        }
    });

    var labConstants = {
        // Corresponds roughly to RGB brighter/darker
        Kn: 18,

        // D65 standard referent
        Xn: 0.950470,
        Yn: 1,
        Zn: 1.088830,

        t0: 0.137931034,  // 4 / 29
        t1: 0.206896552,  // 6 / 29
        t2: 0.12841855,   // 3 * t1 * t1
        t3: 0.008856452,  // t1 * t1 * t1
    };

    var LAB_CONSTANTS$3 = labConstants;
    var unpack$h = utils.unpack;
    var pow$a = Math.pow;

    var rgb2lab$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$h(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2xyz(r,g,b);
        var x = ref$1[0];
        var y = ref$1[1];
        var z = ref$1[2];
        var l = 116 * y - 16;
        return [l < 0 ? 0 : l, 500 * (x - y), 200 * (y - z)];
    };

    var rgb_xyz = function (r) {
        if ((r /= 255) <= 0.04045) { return r / 12.92; }
        return pow$a((r + 0.055) / 1.055, 2.4);
    };

    var xyz_lab = function (t) {
        if (t > LAB_CONSTANTS$3.t3) { return pow$a(t, 1 / 3); }
        return t / LAB_CONSTANTS$3.t2 + LAB_CONSTANTS$3.t0;
    };

    var rgb2xyz = function (r,g,b) {
        r = rgb_xyz(r);
        g = rgb_xyz(g);
        b = rgb_xyz(b);
        var x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / LAB_CONSTANTS$3.Xn);
        var y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / LAB_CONSTANTS$3.Yn);
        var z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / LAB_CONSTANTS$3.Zn);
        return [x,y,z];
    };

    var rgb2lab_1 = rgb2lab$2;

    var LAB_CONSTANTS$2 = labConstants;
    var unpack$g = utils.unpack;
    var pow$9 = Math.pow;

    /*
     * L* [0..100]
     * a [-100..100]
     * b [-100..100]
     */
    var lab2rgb$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$g(args, 'lab');
        var l = args[0];
        var a = args[1];
        var b = args[2];
        var x,y,z, r,g,b_;

        y = (l + 16) / 116;
        x = isNaN(a) ? y : y + a / 500;
        z = isNaN(b) ? y : y - b / 200;

        y = LAB_CONSTANTS$2.Yn * lab_xyz(y);
        x = LAB_CONSTANTS$2.Xn * lab_xyz(x);
        z = LAB_CONSTANTS$2.Zn * lab_xyz(z);

        r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);  // D65 -> sRGB
        g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
        b_ = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

        return [r,g,b_,args.length > 3 ? args[3] : 1];
    };

    var xyz_rgb = function (r) {
        return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow$9(r, 1 / 2.4) - 0.055)
    };

    var lab_xyz = function (t) {
        return t > LAB_CONSTANTS$2.t1 ? t * t * t : LAB_CONSTANTS$2.t2 * (t - LAB_CONSTANTS$2.t0)
    };

    var lab2rgb_1 = lab2rgb$1;

    var unpack$f = utils.unpack;
    var type$e = utils.type;
    var chroma$b = chroma_1;
    var Color$u = Color_1;
    var input$7 = input$h;

    var rgb2lab$1 = rgb2lab_1;

    Color$u.prototype.lab = function() {
        return rgb2lab$1(this._rgb);
    };

    chroma$b.lab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$u, [ null ].concat( args, ['lab']) ));
    };

    input$7.format.lab = lab2rgb_1;

    input$7.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$f(args, 'lab');
            if (type$e(args) === 'array' && args.length === 3) {
                return 'lab';
            }
        }
    });

    var unpack$e = utils.unpack;
    var RAD2DEG = utils.RAD2DEG;
    var sqrt$3 = Math.sqrt;
    var atan2$2 = Math.atan2;
    var round$2 = Math.round;

    var lab2lch$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$e(args, 'lab');
        var l = ref[0];
        var a = ref[1];
        var b = ref[2];
        var c = sqrt$3(a * a + b * b);
        var h = (atan2$2(b, a) * RAD2DEG + 360) % 360;
        if (round$2(c*10000) === 0) { h = Number.NaN; }
        return [l, c, h];
    };

    var lab2lch_1 = lab2lch$2;

    var unpack$d = utils.unpack;
    var rgb2lab = rgb2lab_1;
    var lab2lch$1 = lab2lch_1;

    var rgb2lch$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$d(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2lab(r,g,b);
        var l = ref$1[0];
        var a = ref$1[1];
        var b_ = ref$1[2];
        return lab2lch$1(l,a,b_);
    };

    var rgb2lch_1 = rgb2lch$1;

    var unpack$c = utils.unpack;
    var DEG2RAD = utils.DEG2RAD;
    var sin$3 = Math.sin;
    var cos$3 = Math.cos;

    var lch2lab$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
        These formulas were invented by David Dalrymple to obtain maximum contrast without going
        out of gamut if the parameters are in the range 0-1.

        A saturation multiplier was added by Gregor Aisch
        */
        var ref = unpack$c(args, 'lch');
        var l = ref[0];
        var c = ref[1];
        var h = ref[2];
        if (isNaN(h)) { h = 0; }
        h = h * DEG2RAD;
        return [l, cos$3(h) * c, sin$3(h) * c]
    };

    var lch2lab_1 = lch2lab$2;

    var unpack$b = utils.unpack;
    var lch2lab$1 = lch2lab_1;
    var lab2rgb = lab2rgb_1;

    var lch2rgb$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$b(args, 'lch');
        var l = args[0];
        var c = args[1];
        var h = args[2];
        var ref = lch2lab$1 (l,c,h);
        var L = ref[0];
        var a = ref[1];
        var b_ = ref[2];
        var ref$1 = lab2rgb (L,a,b_);
        var r = ref$1[0];
        var g = ref$1[1];
        var b = ref$1[2];
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var lch2rgb_1 = lch2rgb$1;

    var unpack$a = utils.unpack;
    var lch2rgb = lch2rgb_1;

    var hcl2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var hcl = unpack$a(args, 'hcl').reverse();
        return lch2rgb.apply(void 0, hcl);
    };

    var hcl2rgb_1 = hcl2rgb;

    var unpack$9 = utils.unpack;
    var type$d = utils.type;
    var chroma$a = chroma_1;
    var Color$t = Color_1;
    var input$6 = input$h;

    var rgb2lch = rgb2lch_1;

    Color$t.prototype.lch = function() { return rgb2lch(this._rgb); };
    Color$t.prototype.hcl = function() { return rgb2lch(this._rgb).reverse(); };

    chroma$a.lch = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$t, [ null ].concat( args, ['lch']) ));
    };
    chroma$a.hcl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$t, [ null ].concat( args, ['hcl']) ));
    };

    input$6.format.lch = lch2rgb_1;
    input$6.format.hcl = hcl2rgb_1;

    ['lch','hcl'].forEach(function (m) { return input$6.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$9(args, m);
            if (type$d(args) === 'array' && args.length === 3) {
                return m;
            }
        }
    }); });

    /**
    	X11 color names

    	http://www.w3.org/TR/css3-color/#svg-color
    */

    var w3cx11$1 = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflower: '#6495ed',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkgrey: '#a9a9a9',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkslategrey: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        grey: '#808080',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        laserlemon: '#ffff54',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrod: '#fafad2',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightgrey: '#d3d3d3',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        maroon2: '#7f0000',
        maroon3: '#b03060',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370db',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#db7093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        purple2: '#7f007f',
        purple3: '#a020f0',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32'
    };

    var w3cx11_1 = w3cx11$1;

    var Color$s = Color_1;
    var input$5 = input$h;
    var type$c = utils.type;

    var w3cx11 = w3cx11_1;
    var hex2rgb = hex2rgb_1;
    var rgb2hex = rgb2hex_1;

    Color$s.prototype.name = function() {
        var hex = rgb2hex(this._rgb, 'rgb');
        for (var i = 0, list = Object.keys(w3cx11); i < list.length; i += 1) {
            var n = list[i];

            if (w3cx11[n] === hex) { return n.toLowerCase(); }
        }
        return hex;
    };

    input$5.format.named = function (name) {
        name = name.toLowerCase();
        if (w3cx11[name]) { return hex2rgb(w3cx11[name]); }
        throw new Error('unknown color name: '+name);
    };

    input$5.autodetect.push({
        p: 5,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type$c(h) === 'string' && w3cx11[h.toLowerCase()]) {
                return 'named';
            }
        }
    });

    var unpack$8 = utils.unpack;

    var rgb2num$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$8(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        return (r << 16) + (g << 8) + b;
    };

    var rgb2num_1 = rgb2num$1;

    var type$b = utils.type;

    var num2rgb = function (num) {
        if (type$b(num) == "number" && num >= 0 && num <= 0xFFFFFF) {
            var r = num >> 16;
            var g = (num >> 8) & 0xFF;
            var b = num & 0xFF;
            return [r,g,b,1];
        }
        throw new Error("unknown num color: "+num);
    };

    var num2rgb_1 = num2rgb;

    var chroma$9 = chroma_1;
    var Color$r = Color_1;
    var input$4 = input$h;
    var type$a = utils.type;

    var rgb2num = rgb2num_1;

    Color$r.prototype.num = function() {
        return rgb2num(this._rgb);
    };

    chroma$9.num = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$r, [ null ].concat( args, ['num']) ));
    };

    input$4.format.num = num2rgb_1;

    input$4.autodetect.push({
        p: 5,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            if (args.length === 1 && type$a(args[0]) === 'number' && args[0] >= 0 && args[0] <= 0xFFFFFF) {
                return 'num';
            }
        }
    });

    var chroma$8 = chroma_1;
    var Color$q = Color_1;
    var input$3 = input$h;
    var unpack$7 = utils.unpack;
    var type$9 = utils.type;
    var round$1 = Math.round;

    Color$q.prototype.rgb = function(rnd) {
        if ( rnd === void 0 ) rnd=true;

        if (rnd === false) { return this._rgb.slice(0,3); }
        return this._rgb.slice(0,3).map(round$1);
    };

    Color$q.prototype.rgba = function(rnd) {
        if ( rnd === void 0 ) rnd=true;

        return this._rgb.slice(0,4).map(function (v,i) {
            return i<3 ? (rnd === false ? v : round$1(v)) : v;
        });
    };

    chroma$8.rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$q, [ null ].concat( args, ['rgb']) ));
    };

    input$3.format.rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgba = unpack$7(args, 'rgba');
        if (rgba[3] === undefined) { rgba[3] = 1; }
        return rgba;
    };

    input$3.autodetect.push({
        p: 3,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$7(args, 'rgba');
            if (type$9(args) === 'array' && (args.length === 3 ||
                args.length === 4 && type$9(args[3]) == 'number' && args[3] >= 0 && args[3] <= 1)) {
                return 'rgb';
            }
        }
    });

    /*
     * Based on implementation by Neil Bartlett
     * https://github.com/neilbartlett/color-temperature
     */

    var log$1 = Math.log;

    var temperature2rgb$1 = function (kelvin) {
        var temp = kelvin / 100;
        var r,g,b;
        if (temp < 66) {
            r = 255;
            g = temp < 6 ? 0 : -155.25485562709179 - 0.44596950469579133 * (g = temp-2) + 104.49216199393888 * log$1(g);
            b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp-10) + 115.67994401066147 * log$1(b);
        } else {
            r = 351.97690566805693 + 0.114206453784165 * (r = temp-55) - 40.25366309332127 * log$1(r);
            g = 325.4494125711974 + 0.07943456536662342 * (g = temp-50) - 28.0852963507957 * log$1(g);
            b = 255;
        }
        return [r,g,b,1];
    };

    var temperature2rgb_1 = temperature2rgb$1;

    /*
     * Based on implementation by Neil Bartlett
     * https://github.com/neilbartlett/color-temperature
     **/

    var temperature2rgb = temperature2rgb_1;
    var unpack$6 = utils.unpack;
    var round = Math.round;

    var rgb2temperature$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgb = unpack$6(args, 'rgb');
        var r = rgb[0], b = rgb[2];
        var minTemp = 1000;
        var maxTemp = 40000;
        var eps = 0.4;
        var temp;
        while (maxTemp - minTemp > eps) {
            temp = (maxTemp + minTemp) * 0.5;
            var rgb$1 = temperature2rgb(temp);
            if ((rgb$1[2] / rgb$1[0]) >= (b / r)) {
                maxTemp = temp;
            } else {
                minTemp = temp;
            }
        }
        return round(temp);
    };

    var rgb2temperature_1 = rgb2temperature$1;

    var chroma$7 = chroma_1;
    var Color$p = Color_1;
    var input$2 = input$h;

    var rgb2temperature = rgb2temperature_1;

    Color$p.prototype.temp =
    Color$p.prototype.kelvin =
    Color$p.prototype.temperature = function() {
        return rgb2temperature(this._rgb);
    };

    chroma$7.temp =
    chroma$7.kelvin =
    chroma$7.temperature = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$p, [ null ].concat( args, ['temp']) ));
    };

    input$2.format.temp =
    input$2.format.kelvin =
    input$2.format.temperature = temperature2rgb_1;

    var unpack$5 = utils.unpack;
    var cbrt = Math.cbrt;
    var pow$8 = Math.pow;
    var sign$1 = Math.sign;

    var rgb2oklab$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        // OKLab color space implementation taken from
        // https://bottosson.github.io/posts/oklab/
        var ref = unpack$5(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = [rgb2lrgb(r / 255), rgb2lrgb(g / 255), rgb2lrgb(b / 255)];
        var lr = ref$1[0];
        var lg = ref$1[1];
        var lb = ref$1[2];
        var l = cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
        var m = cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
        var s = cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

        return [
            0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
        ];
    };

    var rgb2oklab_1 = rgb2oklab$2;

    function rgb2lrgb(c) {
        var abs = Math.abs(c);
        if (abs < 0.04045) {
            return c / 12.92;
        }
        return (sign$1(c) || 1) * pow$8((abs + 0.055) / 1.055, 2.4);
    }

    var unpack$4 = utils.unpack;
    var pow$7 = Math.pow;
    var sign = Math.sign;

    /*
     * L* [0..100]
     * a [-100..100]
     * b [-100..100]
     */
    var oklab2rgb$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$4(args, 'lab');
        var L = args[0];
        var a = args[1];
        var b = args[2];

        var l = pow$7(L + 0.3963377774 * a + 0.2158037573 * b, 3);
        var m = pow$7(L - 0.1055613458 * a - 0.0638541728 * b, 3);
        var s = pow$7(L - 0.0894841775 * a - 1.291485548 * b, 3);

        return [
            255 * lrgb2rgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
            255 * lrgb2rgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
            255 * lrgb2rgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
            args.length > 3 ? args[3] : 1
        ];
    };

    var oklab2rgb_1 = oklab2rgb$1;

    function lrgb2rgb(c) {
        var abs = Math.abs(c);
        if (abs > 0.0031308) {
            return (sign(c) || 1) * (1.055 * pow$7(abs, 1 / 2.4) - 0.055);
        }
        return c * 12.92;
    }

    var unpack$3 = utils.unpack;
    var type$8 = utils.type;
    var chroma$6 = chroma_1;
    var Color$o = Color_1;
    var input$1 = input$h;

    var rgb2oklab$1 = rgb2oklab_1;

    Color$o.prototype.oklab = function () {
        return rgb2oklab$1(this._rgb);
    };

    chroma$6.oklab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$o, [ null ].concat( args, ['oklab']) ));
    };

    input$1.format.oklab = oklab2rgb_1;

    input$1.autodetect.push({
        p: 3,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$3(args, 'oklab');
            if (type$8(args) === 'array' && args.length === 3) {
                return 'oklab';
            }
        }
    });

    var unpack$2 = utils.unpack;
    var rgb2oklab = rgb2oklab_1;
    var lab2lch = lab2lch_1;

    var rgb2oklch$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$2(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2oklab(r, g, b);
        var l = ref$1[0];
        var a = ref$1[1];
        var b_ = ref$1[2];
        return lab2lch(l, a, b_);
    };

    var rgb2oklch_1 = rgb2oklch$1;

    var unpack$1 = utils.unpack;
    var lch2lab = lch2lab_1;
    var oklab2rgb = oklab2rgb_1;

    var oklch2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$1(args, 'lch');
        var l = args[0];
        var c = args[1];
        var h = args[2];
        var ref = lch2lab(l, c, h);
        var L = ref[0];
        var a = ref[1];
        var b_ = ref[2];
        var ref$1 = oklab2rgb(L, a, b_);
        var r = ref$1[0];
        var g = ref$1[1];
        var b = ref$1[2];
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var oklch2rgb_1 = oklch2rgb;

    var unpack = utils.unpack;
    var type$7 = utils.type;
    var chroma$5 = chroma_1;
    var Color$n = Color_1;
    var input = input$h;

    var rgb2oklch = rgb2oklch_1;

    Color$n.prototype.oklch = function () {
        return rgb2oklch(this._rgb);
    };

    chroma$5.oklch = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$n, [ null ].concat( args, ['oklch']) ));
    };

    input.format.oklch = oklch2rgb_1;

    input.autodetect.push({
        p: 3,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack(args, 'oklch');
            if (type$7(args) === 'array' && args.length === 3) {
                return 'oklch';
            }
        }
    });

    var Color$m = Color_1;
    var type$6 = utils.type;

    Color$m.prototype.alpha = function(a, mutate) {
        if ( mutate === void 0 ) mutate=false;

        if (a !== undefined && type$6(a) === 'number') {
            if (mutate) {
                this._rgb[3] = a;
                return this;
            }
            return new Color$m([this._rgb[0], this._rgb[1], this._rgb[2], a], 'rgb');
        }
        return this._rgb[3];
    };

    var Color$l = Color_1;

    Color$l.prototype.clipped = function() {
        return this._rgb._clipped || false;
    };

    var Color$k = Color_1;
    var LAB_CONSTANTS$1 = labConstants;

    Color$k.prototype.darken = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	var me = this;
    	var lab = me.lab();
    	lab[0] -= LAB_CONSTANTS$1.Kn * amount;
    	return new Color$k(lab, 'lab').alpha(me.alpha(), true);
    };

    Color$k.prototype.brighten = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	return this.darken(-amount);
    };

    Color$k.prototype.darker = Color$k.prototype.darken;
    Color$k.prototype.brighter = Color$k.prototype.brighten;

    var Color$j = Color_1;

    Color$j.prototype.get = function (mc) {
        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
            var i = mode.indexOf(channel) - (mode.substr(0, 2) === 'ok' ? 2 : 0);
            if (i > -1) { return src[i]; }
            throw new Error(("unknown channel " + channel + " in mode " + mode));
        } else {
            return src;
        }
    };

    var Color$i = Color_1;
    var type$5 = utils.type;
    var pow$6 = Math.pow;

    var EPS = 1e-7;
    var MAX_ITER = 20;

    Color$i.prototype.luminance = function(lum) {
        if (lum !== undefined && type$5(lum) === 'number') {
            if (lum === 0) {
                // return pure black
                return new Color$i([0,0,0,this._rgb[3]], 'rgb');
            }
            if (lum === 1) {
                // return pure white
                return new Color$i([255,255,255,this._rgb[3]], 'rgb');
            }
            // compute new color using...
            var cur_lum = this.luminance();
            var mode = 'rgb';
            var max_iter = MAX_ITER;

            var test = function (low, high) {
                var mid = low.interpolate(high, 0.5, mode);
                var lm = mid.luminance();
                if (Math.abs(lum - lm) < EPS || !max_iter--) {
                    // close enough
                    return mid;
                }
                return lm > lum ? test(low, mid) : test(mid, high);
            };

            var rgb = (cur_lum > lum ? test(new Color$i([0,0,0]), this) : test(this, new Color$i([255,255,255]))).rgb();
            return new Color$i(rgb.concat( [this._rgb[3]]));
        }
        return rgb2luminance.apply(void 0, (this._rgb).slice(0,3));
    };


    var rgb2luminance = function (r,g,b) {
        // relative luminance
        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        r = luminance_x(r);
        g = luminance_x(g);
        b = luminance_x(b);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    var luminance_x = function (x) {
        x /= 255;
        return x <= 0.03928 ? x/12.92 : pow$6((x+0.055)/1.055, 2.4);
    };

    var interpolator$1 = {};

    var Color$h = Color_1;
    var type$4 = utils.type;
    var interpolator = interpolator$1;

    var mix$1 = function (col1, col2, f) {
        if ( f === void 0 ) f=0.5;
        var rest = [], len = arguments.length - 3;
        while ( len-- > 0 ) rest[ len ] = arguments[ len + 3 ];

        var mode = rest[0] || 'lrgb';
        if (!interpolator[mode] && !rest.length) {
            // fall back to the first supported mode
            mode = Object.keys(interpolator)[0];
        }
        if (!interpolator[mode]) {
            throw new Error(("interpolation mode " + mode + " is not defined"));
        }
        if (type$4(col1) !== 'object') { col1 = new Color$h(col1); }
        if (type$4(col2) !== 'object') { col2 = new Color$h(col2); }
        return interpolator[mode](col1, col2, f)
            .alpha(col1.alpha() + f * (col2.alpha() - col1.alpha()));
    };

    var Color$g = Color_1;
    var mix = mix$1;

    Color$g.prototype.mix =
    Color$g.prototype.interpolate = function(col2, f) {
    	if ( f === void 0 ) f=0.5;
    	var rest = [], len = arguments.length - 2;
    	while ( len-- > 0 ) rest[ len ] = arguments[ len + 2 ];

    	return mix.apply(void 0, [ this, col2, f ].concat( rest ));
    };

    var Color$f = Color_1;

    Color$f.prototype.premultiply = function(mutate) {
    	if ( mutate === void 0 ) mutate=false;

    	var rgb = this._rgb;
    	var a = rgb[3];
    	if (mutate) {
    		this._rgb = [rgb[0]*a, rgb[1]*a, rgb[2]*a, a];
    		return this;
    	} else {
    		return new Color$f([rgb[0]*a, rgb[1]*a, rgb[2]*a, a], 'rgb');
    	}
    };

    var Color$e = Color_1;
    var LAB_CONSTANTS = labConstants;

    Color$e.prototype.saturate = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	var me = this;
    	var lch = me.lch();
    	lch[1] += LAB_CONSTANTS.Kn * amount;
    	if (lch[1] < 0) { lch[1] = 0; }
    	return new Color$e(lch, 'lch').alpha(me.alpha(), true);
    };

    Color$e.prototype.desaturate = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	return this.saturate(-amount);
    };

    var Color$d = Color_1;
    var type$3 = utils.type;

    Color$d.prototype.set = function (mc, value, mutate) {
        if ( mutate === void 0 ) mutate = false;

        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
            var i = mode.indexOf(channel) - (mode.substr(0, 2) === 'ok' ? 2 : 0);
            if (i > -1) {
                if (type$3(value) == 'string') {
                    switch (value.charAt(0)) {
                        case '+':
                            src[i] += +value;
                            break;
                        case '-':
                            src[i] += +value;
                            break;
                        case '*':
                            src[i] *= +value.substr(1);
                            break;
                        case '/':
                            src[i] /= +value.substr(1);
                            break;
                        default:
                            src[i] = +value;
                    }
                } else if (type$3(value) === 'number') {
                    src[i] = value;
                } else {
                    throw new Error("unsupported value for Color.set");
                }
                var out = new Color$d(src, mode);
                if (mutate) {
                    this._rgb = out._rgb;
                    return this;
                }
                return out;
            }
            throw new Error(("unknown channel " + channel + " in mode " + mode));
        } else {
            return src;
        }
    };

    var Color$c = Color_1;

    var rgb = function (col1, col2, f) {
        var xyz0 = col1._rgb;
        var xyz1 = col2._rgb;
        return new Color$c(
            xyz0[0] + f * (xyz1[0]-xyz0[0]),
            xyz0[1] + f * (xyz1[1]-xyz0[1]),
            xyz0[2] + f * (xyz1[2]-xyz0[2]),
            'rgb'
        )
    };

    // register interpolator
    interpolator$1.rgb = rgb;

    var Color$b = Color_1;
    var sqrt$2 = Math.sqrt;
    var pow$5 = Math.pow;

    var lrgb = function (col1, col2, f) {
        var ref = col1._rgb;
        var x1 = ref[0];
        var y1 = ref[1];
        var z1 = ref[2];
        var ref$1 = col2._rgb;
        var x2 = ref$1[0];
        var y2 = ref$1[1];
        var z2 = ref$1[2];
        return new Color$b(
            sqrt$2(pow$5(x1,2) * (1-f) + pow$5(x2,2) * f),
            sqrt$2(pow$5(y1,2) * (1-f) + pow$5(y2,2) * f),
            sqrt$2(pow$5(z1,2) * (1-f) + pow$5(z2,2) * f),
            'rgb'
        )
    };

    // register interpolator
    interpolator$1.lrgb = lrgb;

    var Color$a = Color_1;

    var lab = function (col1, col2, f) {
        var xyz0 = col1.lab();
        var xyz1 = col2.lab();
        return new Color$a(
            xyz0[0] + f * (xyz1[0]-xyz0[0]),
            xyz0[1] + f * (xyz1[1]-xyz0[1]),
            xyz0[2] + f * (xyz1[2]-xyz0[2]),
            'lab'
        )
    };

    // register interpolator
    interpolator$1.lab = lab;

    var Color$9 = Color_1;

    var _hsx = function (col1, col2, f, m) {
        var assign, assign$1;

        var xyz0, xyz1;
        if (m === 'hsl') {
            xyz0 = col1.hsl();
            xyz1 = col2.hsl();
        } else if (m === 'hsv') {
            xyz0 = col1.hsv();
            xyz1 = col2.hsv();
        } else if (m === 'hcg') {
            xyz0 = col1.hcg();
            xyz1 = col2.hcg();
        } else if (m === 'hsi') {
            xyz0 = col1.hsi();
            xyz1 = col2.hsi();
        } else if (m === 'lch' || m === 'hcl') {
            m = 'hcl';
            xyz0 = col1.hcl();
            xyz1 = col2.hcl();
        } else if (m === 'oklch') {
            xyz0 = col1.oklch().reverse();
            xyz1 = col2.oklch().reverse();
        }

        var hue0, hue1, sat0, sat1, lbv0, lbv1;
        if (m.substr(0, 1) === 'h' || m === 'oklch') {
            (assign = xyz0, hue0 = assign[0], sat0 = assign[1], lbv0 = assign[2]);
            (assign$1 = xyz1, hue1 = assign$1[0], sat1 = assign$1[1], lbv1 = assign$1[2]);
        }

        var sat, hue, lbv, dh;

        if (!isNaN(hue0) && !isNaN(hue1)) {
            // both colors have hue
            if (hue1 > hue0 && hue1 - hue0 > 180) {
                dh = hue1 - (hue0 + 360);
            } else if (hue1 < hue0 && hue0 - hue1 > 180) {
                dh = hue1 + 360 - hue0;
            } else {
                dh = hue1 - hue0;
            }
            hue = hue0 + f * dh;
        } else if (!isNaN(hue0)) {
            hue = hue0;
            if ((lbv1 == 1 || lbv1 == 0) && m != 'hsv') { sat = sat0; }
        } else if (!isNaN(hue1)) {
            hue = hue1;
            if ((lbv0 == 1 || lbv0 == 0) && m != 'hsv') { sat = sat1; }
        } else {
            hue = Number.NaN;
        }

        if (sat === undefined) { sat = sat0 + f * (sat1 - sat0); }
        lbv = lbv0 + f * (lbv1 - lbv0);
        return m === 'oklch' ? new Color$9([lbv, sat, hue], m) : new Color$9([hue, sat, lbv], m);
    };

    var interpolate_hsx$5 = _hsx;

    var lch = function (col1, col2, f) {
    	return interpolate_hsx$5(col1, col2, f, 'lch');
    };

    // register interpolator
    interpolator$1.lch = lch;
    interpolator$1.hcl = lch;

    var Color$8 = Color_1;

    var num = function (col1, col2, f) {
        var c1 = col1.num();
        var c2 = col2.num();
        return new Color$8(c1 + f * (c2-c1), 'num')
    };

    // register interpolator
    interpolator$1.num = num;

    var interpolate_hsx$4 = _hsx;

    var hcg = function (col1, col2, f) {
    	return interpolate_hsx$4(col1, col2, f, 'hcg');
    };

    // register interpolator
    interpolator$1.hcg = hcg;

    var interpolate_hsx$3 = _hsx;

    var hsi = function (col1, col2, f) {
    	return interpolate_hsx$3(col1, col2, f, 'hsi');
    };

    // register interpolator
    interpolator$1.hsi = hsi;

    var interpolate_hsx$2 = _hsx;

    var hsl = function (col1, col2, f) {
    	return interpolate_hsx$2(col1, col2, f, 'hsl');
    };

    // register interpolator
    interpolator$1.hsl = hsl;

    var interpolate_hsx$1 = _hsx;

    var hsv = function (col1, col2, f) {
    	return interpolate_hsx$1(col1, col2, f, 'hsv');
    };

    // register interpolator
    interpolator$1.hsv = hsv;

    var Color$7 = Color_1;

    var oklab = function (col1, col2, f) {
        var xyz0 = col1.oklab();
        var xyz1 = col2.oklab();
        return new Color$7(
            xyz0[0] + f * (xyz1[0] - xyz0[0]),
            xyz0[1] + f * (xyz1[1] - xyz0[1]),
            xyz0[2] + f * (xyz1[2] - xyz0[2]),
            'oklab'
        );
    };

    // register interpolator
    interpolator$1.oklab = oklab;

    var interpolate_hsx = _hsx;

    var oklch = function (col1, col2, f) {
        return interpolate_hsx(col1, col2, f, 'oklch');
    };

    // register interpolator
    interpolator$1.oklch = oklch;

    var Color$6 = Color_1;
    var clip_rgb$1 = utils.clip_rgb;
    var pow$4 = Math.pow;
    var sqrt$1 = Math.sqrt;
    var PI$1 = Math.PI;
    var cos$2 = Math.cos;
    var sin$2 = Math.sin;
    var atan2$1 = Math.atan2;

    var average = function (colors, mode, weights) {
        if ( mode === void 0 ) mode='lrgb';
        if ( weights === void 0 ) weights=null;

        var l = colors.length;
        if (!weights) { weights = Array.from(new Array(l)).map(function () { return 1; }); }
        // normalize weights
        var k = l / weights.reduce(function(a, b) { return a + b; });
        weights.forEach(function (w,i) { weights[i] *= k; });
        // convert colors to Color objects
        colors = colors.map(function (c) { return new Color$6(c); });
        if (mode === 'lrgb') {
            return _average_lrgb(colors, weights)
        }
        var first = colors.shift();
        var xyz = first.get(mode);
        var cnt = [];
        var dx = 0;
        var dy = 0;
        // initial color
        for (var i=0; i<xyz.length; i++) {
            xyz[i] = (xyz[i] || 0) * weights[0];
            cnt.push(isNaN(xyz[i]) ? 0 : weights[0]);
            if (mode.charAt(i) === 'h' && !isNaN(xyz[i])) {
                var A = xyz[i] / 180 * PI$1;
                dx += cos$2(A) * weights[0];
                dy += sin$2(A) * weights[0];
            }
        }

        var alpha = first.alpha() * weights[0];
        colors.forEach(function (c,ci) {
            var xyz2 = c.get(mode);
            alpha += c.alpha() * weights[ci+1];
            for (var i=0; i<xyz.length; i++) {
                if (!isNaN(xyz2[i])) {
                    cnt[i] += weights[ci+1];
                    if (mode.charAt(i) === 'h') {
                        var A = xyz2[i] / 180 * PI$1;
                        dx += cos$2(A) * weights[ci+1];
                        dy += sin$2(A) * weights[ci+1];
                    } else {
                        xyz[i] += xyz2[i] * weights[ci+1];
                    }
                }
            }
        });

        for (var i$1=0; i$1<xyz.length; i$1++) {
            if (mode.charAt(i$1) === 'h') {
                var A$1 = atan2$1(dy / cnt[i$1], dx / cnt[i$1]) / PI$1 * 180;
                while (A$1 < 0) { A$1 += 360; }
                while (A$1 >= 360) { A$1 -= 360; }
                xyz[i$1] = A$1;
            } else {
                xyz[i$1] = xyz[i$1]/cnt[i$1];
            }
        }
        alpha /= l;
        return (new Color$6(xyz, mode)).alpha(alpha > 0.99999 ? 1 : alpha, true);
    };


    var _average_lrgb = function (colors, weights) {
        var l = colors.length;
        var xyz = [0,0,0,0];
        for (var i=0; i < colors.length; i++) {
            var col = colors[i];
            var f = weights[i] / l;
            var rgb = col._rgb;
            xyz[0] += pow$4(rgb[0],2) * f;
            xyz[1] += pow$4(rgb[1],2) * f;
            xyz[2] += pow$4(rgb[2],2) * f;
            xyz[3] += rgb[3] * f;
        }
        xyz[0] = sqrt$1(xyz[0]);
        xyz[1] = sqrt$1(xyz[1]);
        xyz[2] = sqrt$1(xyz[2]);
        if (xyz[3] > 0.9999999) { xyz[3] = 1; }
        return new Color$6(clip_rgb$1(xyz));
    };

    // minimal multi-purpose interface

    // @requires utils color analyze

    var chroma$4 = chroma_1;
    var type$2 = utils.type;

    var pow$3 = Math.pow;

    var scale$2 = function(colors) {

        // constructor
        var _mode = 'rgb';
        var _nacol = chroma$4('#ccc');
        var _spread = 0;
        // const _fixed = false;
        var _domain = [0, 1];
        var _pos = [];
        var _padding = [0,0];
        var _classes = false;
        var _colors = [];
        var _out = false;
        var _min = 0;
        var _max = 1;
        var _correctLightness = false;
        var _colorCache = {};
        var _useCache = true;
        var _gamma = 1;

        // private methods

        var setColors = function(colors) {
            colors = colors || ['#fff', '#000'];
            if (colors && type$2(colors) === 'string' && chroma$4.brewer &&
                chroma$4.brewer[colors.toLowerCase()]) {
                colors = chroma$4.brewer[colors.toLowerCase()];
            }
            if (type$2(colors) === 'array') {
                // handle single color
                if (colors.length === 1) {
                    colors = [colors[0], colors[0]];
                }
                // make a copy of the colors
                colors = colors.slice(0);
                // convert to chroma classes
                for (var c=0; c<colors.length; c++) {
                    colors[c] = chroma$4(colors[c]);
                }
                // auto-fill color position
                _pos.length = 0;
                for (var c$1=0; c$1<colors.length; c$1++) {
                    _pos.push(c$1/(colors.length-1));
                }
            }
            resetCache();
            return _colors = colors;
        };

        var getClass = function(value) {
            if (_classes != null) {
                var n = _classes.length-1;
                var i = 0;
                while (i < n && value >= _classes[i]) {
                    i++;
                }
                return i-1;
            }
            return 0;
        };

        var tMapLightness = function (t) { return t; };
        var tMapDomain = function (t) { return t; };

        // const classifyValue = function(value) {
        //     let val = value;
        //     if (_classes.length > 2) {
        //         const n = _classes.length-1;
        //         const i = getClass(value);
        //         const minc = _classes[0] + ((_classes[1]-_classes[0]) * (0 + (_spread * 0.5)));  // center of 1st class
        //         const maxc = _classes[n-1] + ((_classes[n]-_classes[n-1]) * (1 - (_spread * 0.5)));  // center of last class
        //         val = _min + ((((_classes[i] + ((_classes[i+1] - _classes[i]) * 0.5)) - minc) / (maxc-minc)) * (_max - _min));
        //     }
        //     return val;
        // };

        var getColor = function(val, bypassMap) {
            var col, t;
            if (bypassMap == null) { bypassMap = false; }
            if (isNaN(val) || (val === null)) { return _nacol; }
            if (!bypassMap) {
                if (_classes && (_classes.length > 2)) {
                    // find the class
                    var c = getClass(val);
                    t = c / (_classes.length-2);
                } else if (_max !== _min) {
                    // just interpolate between min/max
                    t = (val - _min) / (_max - _min);
                } else {
                    t = 1;
                }
            } else {
                t = val;
            }

            // domain map
            t = tMapDomain(t);

            if (!bypassMap) {
                t = tMapLightness(t);  // lightness correction
            }

            if (_gamma !== 1) { t = pow$3(t, _gamma); }

            t = _padding[0] + (t * (1 - _padding[0] - _padding[1]));

            t = Math.min(1, Math.max(0, t));

            var k = Math.floor(t * 10000);

            if (_useCache && _colorCache[k]) {
                col = _colorCache[k];
            } else {
                if (type$2(_colors) === 'array') {
                    //for i in [0.._pos.length-1]
                    for (var i=0; i<_pos.length; i++) {
                        var p = _pos[i];
                        if (t <= p) {
                            col = _colors[i];
                            break;
                        }
                        if ((t >= p) && (i === (_pos.length-1))) {
                            col = _colors[i];
                            break;
                        }
                        if (t > p && t < _pos[i+1]) {
                            t = (t-p)/(_pos[i+1]-p);
                            col = chroma$4.interpolate(_colors[i], _colors[i+1], t, _mode);
                            break;
                        }
                    }
                } else if (type$2(_colors) === 'function') {
                    col = _colors(t);
                }
                if (_useCache) { _colorCache[k] = col; }
            }
            return col;
        };

        var resetCache = function () { return _colorCache = {}; };

        setColors(colors);

        // public interface

        var f = function(v) {
            var c = chroma$4(getColor(v));
            if (_out && c[_out]) { return c[_out](); } else { return c; }
        };

        f.classes = function(classes) {
            if (classes != null) {
                if (type$2(classes) === 'array') {
                    _classes = classes;
                    _domain = [classes[0], classes[classes.length-1]];
                } else {
                    var d = chroma$4.analyze(_domain);
                    if (classes === 0) {
                        _classes = [d.min, d.max];
                    } else {
                        _classes = chroma$4.limits(d, 'e', classes);
                    }
                }
                return f;
            }
            return _classes;
        };


        f.domain = function(domain) {
            if (!arguments.length) {
                return _domain;
            }
            _min = domain[0];
            _max = domain[domain.length-1];
            _pos = [];
            var k = _colors.length;
            if ((domain.length === k) && (_min !== _max)) {
                // update positions
                for (var i = 0, list = Array.from(domain); i < list.length; i += 1) {
                    var d = list[i];

                  _pos.push((d-_min) / (_max-_min));
                }
            } else {
                for (var c=0; c<k; c++) {
                    _pos.push(c/(k-1));
                }
                if (domain.length > 2) {
                    // set domain map
                    var tOut = domain.map(function (d,i) { return i/(domain.length-1); });
                    var tBreaks = domain.map(function (d) { return (d - _min) / (_max - _min); });
                    if (!tBreaks.every(function (val, i) { return tOut[i] === val; })) {
                        tMapDomain = function (t) {
                            if (t <= 0 || t >= 1) { return t; }
                            var i = 0;
                            while (t >= tBreaks[i+1]) { i++; }
                            var f = (t - tBreaks[i]) / (tBreaks[i+1] - tBreaks[i]);
                            var out = tOut[i] + f * (tOut[i+1] - tOut[i]);
                            return out;
                        };
                    }

                }
            }
            _domain = [_min, _max];
            return f;
        };

        f.mode = function(_m) {
            if (!arguments.length) {
                return _mode;
            }
            _mode = _m;
            resetCache();
            return f;
        };

        f.range = function(colors, _pos) {
            setColors(colors);
            return f;
        };

        f.out = function(_o) {
            _out = _o;
            return f;
        };

        f.spread = function(val) {
            if (!arguments.length) {
                return _spread;
            }
            _spread = val;
            return f;
        };

        f.correctLightness = function(v) {
            if (v == null) { v = true; }
            _correctLightness = v;
            resetCache();
            if (_correctLightness) {
                tMapLightness = function(t) {
                    var L0 = getColor(0, true).lab()[0];
                    var L1 = getColor(1, true).lab()[0];
                    var pol = L0 > L1;
                    var L_actual = getColor(t, true).lab()[0];
                    var L_ideal = L0 + ((L1 - L0) * t);
                    var L_diff = L_actual - L_ideal;
                    var t0 = 0;
                    var t1 = 1;
                    var max_iter = 20;
                    while ((Math.abs(L_diff) > 1e-2) && (max_iter-- > 0)) {
                        (function() {
                            if (pol) { L_diff *= -1; }
                            if (L_diff < 0) {
                                t0 = t;
                                t += (t1 - t) * 0.5;
                            } else {
                                t1 = t;
                                t += (t0 - t) * 0.5;
                            }
                            L_actual = getColor(t, true).lab()[0];
                            return L_diff = L_actual - L_ideal;
                        })();
                    }
                    return t;
                };
            } else {
                tMapLightness = function (t) { return t; };
            }
            return f;
        };

        f.padding = function(p) {
            if (p != null) {
                if (type$2(p) === 'number') {
                    p = [p,p];
                }
                _padding = p;
                return f;
            } else {
                return _padding;
            }
        };

        f.colors = function(numColors, out) {
            // If no arguments are given, return the original colors that were provided
            if (arguments.length < 2) { out = 'hex'; }
            var result = [];

            if (arguments.length === 0) {
                result = _colors.slice(0);

            } else if (numColors === 1) {
                result = [f(0.5)];

            } else if (numColors > 1) {
                var dm = _domain[0];
                var dd = _domain[1] - dm;
                result = __range__(0, numColors, false).map(function (i) { return f( dm + ((i/(numColors-1)) * dd) ); });

            } else { // returns all colors based on the defined classes
                colors = [];
                var samples = [];
                if (_classes && (_classes.length > 2)) {
                    for (var i = 1, end = _classes.length, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
                        samples.push((_classes[i-1]+_classes[i])*0.5);
                    }
                } else {
                    samples = _domain;
                }
                result = samples.map(function (v) { return f(v); });
            }

            if (chroma$4[out]) {
                result = result.map(function (c) { return c[out](); });
            }
            return result;
        };

        f.cache = function(c) {
            if (c != null) {
                _useCache = c;
                return f;
            } else {
                return _useCache;
            }
        };

        f.gamma = function(g) {
            if (g != null) {
                _gamma = g;
                return f;
            } else {
                return _gamma;
            }
        };

        f.nodata = function(d) {
            if (d != null) {
                _nacol = chroma$4(d);
                return f;
            } else {
                return _nacol;
            }
        };

        return f;
    };

    function __range__(left, right, inclusive) {
      var range = [];
      var ascending = left < right;
      var end = !inclusive ? right : ascending ? right + 1 : right - 1;
      for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
        range.push(i);
      }
      return range;
    }

    //
    // interpolates between a set of colors uzing a bezier spline
    //

    // @requires utils lab
    var Color$5 = Color_1;

    var scale$1 = scale$2;

    // nth row of the pascal triangle
    var binom_row = function(n) {
        var row = [1, 1];
        for (var i = 1; i < n; i++) {
            var newrow = [1];
            for (var j = 1; j <= row.length; j++) {
                newrow[j] = (row[j] || 0) + row[j - 1];
            }
            row = newrow;
        }
        return row;
    };

    var bezier = function(colors) {
        var assign, assign$1, assign$2;

        var I, lab0, lab1, lab2;
        colors = colors.map(function (c) { return new Color$5(c); });
        if (colors.length === 2) {
            // linear interpolation
            (assign = colors.map(function (c) { return c.lab(); }), lab0 = assign[0], lab1 = assign[1]);
            I = function(t) {
                var lab = ([0, 1, 2].map(function (i) { return lab0[i] + (t * (lab1[i] - lab0[i])); }));
                return new Color$5(lab, 'lab');
            };
        } else if (colors.length === 3) {
            // quadratic bezier interpolation
            (assign$1 = colors.map(function (c) { return c.lab(); }), lab0 = assign$1[0], lab1 = assign$1[1], lab2 = assign$1[2]);
            I = function(t) {
                var lab = ([0, 1, 2].map(function (i) { return ((1-t)*(1-t) * lab0[i]) + (2 * (1-t) * t * lab1[i]) + (t * t * lab2[i]); }));
                return new Color$5(lab, 'lab');
            };
        } else if (colors.length === 4) {
            // cubic bezier interpolation
            var lab3;
            (assign$2 = colors.map(function (c) { return c.lab(); }), lab0 = assign$2[0], lab1 = assign$2[1], lab2 = assign$2[2], lab3 = assign$2[3]);
            I = function(t) {
                var lab = ([0, 1, 2].map(function (i) { return ((1-t)*(1-t)*(1-t) * lab0[i]) + (3 * (1-t) * (1-t) * t * lab1[i]) + (3 * (1-t) * t * t * lab2[i]) + (t*t*t * lab3[i]); }));
                return new Color$5(lab, 'lab');
            };
        } else if (colors.length >= 5) {
            // general case (degree n bezier)
            var labs, row, n;
            labs = colors.map(function (c) { return c.lab(); });
            n = colors.length - 1;
            row = binom_row(n);
            I = function (t) {
                var u = 1 - t;
                var lab = ([0, 1, 2].map(function (i) { return labs.reduce(function (sum, el, j) { return (sum + row[j] * Math.pow( u, (n - j) ) * Math.pow( t, j ) * el[i]); }, 0); }));
                return new Color$5(lab, 'lab');
            };
        } else {
            throw new RangeError("No point in running bezier with only one color.")
        }
        return I;
    };

    var bezier_1 = function (colors) {
        var f = bezier(colors);
        f.scale = function () { return scale$1(f); };
        return f;
    };

    /*
     * interpolates between a set of colors uzing a bezier spline
     * blend mode formulas taken from http://www.venture-ware.com/kevin/coding/lets-learn-math-photoshop-blend-modes/
     */

    var chroma$3 = chroma_1;

    var blend = function (bottom, top, mode) {
        if (!blend[mode]) {
            throw new Error('unknown blend mode ' + mode);
        }
        return blend[mode](bottom, top);
    };

    var blend_f = function (f) { return function (bottom,top) {
            var c0 = chroma$3(top).rgb();
            var c1 = chroma$3(bottom).rgb();
            return chroma$3.rgb(f(c0, c1));
        }; };

    var each = function (f) { return function (c0, c1) {
            var out = [];
            out[0] = f(c0[0], c1[0]);
            out[1] = f(c0[1], c1[1]);
            out[2] = f(c0[2], c1[2]);
            return out;
        }; };

    var normal = function (a) { return a; };
    var multiply = function (a,b) { return a * b / 255; };
    var darken = function (a,b) { return a > b ? b : a; };
    var lighten = function (a,b) { return a > b ? a : b; };
    var screen = function (a,b) { return 255 * (1 - (1-a/255) * (1-b/255)); };
    var overlay = function (a,b) { return b < 128 ? 2 * a * b / 255 : 255 * (1 - 2 * (1 - a / 255 ) * ( 1 - b / 255 )); };
    var burn = function (a,b) { return 255 * (1 - (1 - b / 255) / (a/255)); };
    var dodge = function (a,b) {
        if (a === 255) { return 255; }
        a = 255 * (b / 255) / (1 - a / 255);
        return a > 255 ? 255 : a
    };

    // # add = (a,b) ->
    // #     if (a + b > 255) then 255 else a + b

    blend.normal = blend_f(each(normal));
    blend.multiply = blend_f(each(multiply));
    blend.screen = blend_f(each(screen));
    blend.overlay = blend_f(each(overlay));
    blend.darken = blend_f(each(darken));
    blend.lighten = blend_f(each(lighten));
    blend.dodge = blend_f(each(dodge));
    blend.burn = blend_f(each(burn));
    // blend.add = blend_f(each(add));

    var blend_1 = blend;

    // cubehelix interpolation
    // based on D.A. Green "A colour scheme for the display of astronomical intensity images"
    // http://astron-soc.in/bulletin/11June/289392011.pdf

    var type$1 = utils.type;
    var clip_rgb = utils.clip_rgb;
    var TWOPI = utils.TWOPI;
    var pow$2 = Math.pow;
    var sin$1 = Math.sin;
    var cos$1 = Math.cos;
    var chroma$2 = chroma_1;

    var cubehelix = function(start, rotations, hue, gamma, lightness) {
        if ( start === void 0 ) start=300;
        if ( rotations === void 0 ) rotations=-1.5;
        if ( hue === void 0 ) hue=1;
        if ( gamma === void 0 ) gamma=1;
        if ( lightness === void 0 ) lightness=[0,1];

        var dh = 0, dl;
        if (type$1(lightness) === 'array') {
            dl = lightness[1] - lightness[0];
        } else {
            dl = 0;
            lightness = [lightness, lightness];
        }

        var f = function(fract) {
            var a = TWOPI * (((start+120)/360) + (rotations * fract));
            var l = pow$2(lightness[0] + (dl * fract), gamma);
            var h = dh !== 0 ? hue[0] + (fract * dh) : hue;
            var amp = (h * l * (1-l)) / 2;
            var cos_a = cos$1(a);
            var sin_a = sin$1(a);
            var r = l + (amp * ((-0.14861 * cos_a) + (1.78277* sin_a)));
            var g = l + (amp * ((-0.29227 * cos_a) - (0.90649* sin_a)));
            var b = l + (amp * (+1.97294 * cos_a));
            return chroma$2(clip_rgb([r*255,g*255,b*255,1]));
        };

        f.start = function(s) {
            if ((s == null)) { return start; }
            start = s;
            return f;
        };

        f.rotations = function(r) {
            if ((r == null)) { return rotations; }
            rotations = r;
            return f;
        };

        f.gamma = function(g) {
            if ((g == null)) { return gamma; }
            gamma = g;
            return f;
        };

        f.hue = function(h) {
            if ((h == null)) { return hue; }
            hue = h;
            if (type$1(hue) === 'array') {
                dh = hue[1] - hue[0];
                if (dh === 0) { hue = hue[1]; }
            } else {
                dh = 0;
            }
            return f;
        };

        f.lightness = function(h) {
            if ((h == null)) { return lightness; }
            if (type$1(h) === 'array') {
                lightness = h;
                dl = h[1] - h[0];
            } else {
                lightness = [h,h];
                dl = 0;
            }
            return f;
        };

        f.scale = function () { return chroma$2.scale(f); };

        f.hue(hue);

        return f;
    };

    var Color$4 = Color_1;
    var digits = '0123456789abcdef';

    var floor$1 = Math.floor;
    var random = Math.random;

    var random_1 = function () {
        var code = '#';
        for (var i=0; i<6; i++) {
            code += digits.charAt(floor$1(random() * 16));
        }
        return new Color$4(code, 'hex');
    };

    var type = type$p;
    var log = Math.log;
    var pow$1 = Math.pow;
    var floor = Math.floor;
    var abs$1 = Math.abs;


    var analyze = function (data, key) {
        if ( key === void 0 ) key=null;

        var r = {
            min: Number.MAX_VALUE,
            max: Number.MAX_VALUE*-1,
            sum: 0,
            values: [],
            count: 0
        };
        if (type(data) === 'object') {
            data = Object.values(data);
        }
        data.forEach(function (val) {
            if (key && type(val) === 'object') { val = val[key]; }
            if (val !== undefined && val !== null && !isNaN(val)) {
                r.values.push(val);
                r.sum += val;
                if (val < r.min) { r.min = val; }
                if (val > r.max) { r.max = val; }
                r.count += 1;
            }
        });

        r.domain = [r.min, r.max];

        r.limits = function (mode, num) { return limits(r, mode, num); };

        return r;
    };


    var limits = function (data, mode, num) {
        if ( mode === void 0 ) mode='equal';
        if ( num === void 0 ) num=7;

        if (type(data) == 'array') {
            data = analyze(data);
        }
        var min = data.min;
        var max = data.max;
        var values = data.values.sort(function (a,b) { return a-b; });

        if (num === 1) { return [min,max]; }

        var limits = [];

        if (mode.substr(0,1) === 'c') { // continuous
            limits.push(min);
            limits.push(max);
        }

        if (mode.substr(0,1) === 'e') { // equal interval
            limits.push(min);
            for (var i=1; i<num; i++) {
                limits.push(min+((i/num)*(max-min)));
            }
            limits.push(max);
        }

        else if (mode.substr(0,1) === 'l') { // log scale
            if (min <= 0) {
                throw new Error('Logarithmic scales are only possible for values > 0');
            }
            var min_log = Math.LOG10E * log(min);
            var max_log = Math.LOG10E * log(max);
            limits.push(min);
            for (var i$1=1; i$1<num; i$1++) {
                limits.push(pow$1(10, min_log + ((i$1/num) * (max_log - min_log))));
            }
            limits.push(max);
        }

        else if (mode.substr(0,1) === 'q') { // quantile scale
            limits.push(min);
            for (var i$2=1; i$2<num; i$2++) {
                var p = ((values.length-1) * i$2)/num;
                var pb = floor(p);
                if (pb === p) {
                    limits.push(values[pb]);
                } else { // p > pb
                    var pr = p - pb;
                    limits.push((values[pb]*(1-pr)) + (values[pb+1]*pr));
                }
            }
            limits.push(max);

        }

        else if (mode.substr(0,1) === 'k') { // k-means clustering
            /*
            implementation based on
            http://code.google.com/p/figue/source/browse/trunk/figue.js#336
            simplified for 1-d input values
            */
            var cluster;
            var n = values.length;
            var assignments = new Array(n);
            var clusterSizes = new Array(num);
            var repeat = true;
            var nb_iters = 0;
            var centroids = null;

            // get seed values
            centroids = [];
            centroids.push(min);
            for (var i$3=1; i$3<num; i$3++) {
                centroids.push(min + ((i$3/num) * (max-min)));
            }
            centroids.push(max);

            while (repeat) {
                // assignment step
                for (var j=0; j<num; j++) {
                    clusterSizes[j] = 0;
                }
                for (var i$4=0; i$4<n; i$4++) {
                    var value = values[i$4];
                    var mindist = Number.MAX_VALUE;
                    var best = (void 0);
                    for (var j$1=0; j$1<num; j$1++) {
                        var dist = abs$1(centroids[j$1]-value);
                        if (dist < mindist) {
                            mindist = dist;
                            best = j$1;
                        }
                        clusterSizes[best]++;
                        assignments[i$4] = best;
                    }
                }

                // update centroids step
                var newCentroids = new Array(num);
                for (var j$2=0; j$2<num; j$2++) {
                    newCentroids[j$2] = null;
                }
                for (var i$5=0; i$5<n; i$5++) {
                    cluster = assignments[i$5];
                    if (newCentroids[cluster] === null) {
                        newCentroids[cluster] = values[i$5];
                    } else {
                        newCentroids[cluster] += values[i$5];
                    }
                }
                for (var j$3=0; j$3<num; j$3++) {
                    newCentroids[j$3] *= 1/clusterSizes[j$3];
                }

                // check convergence
                repeat = false;
                for (var j$4=0; j$4<num; j$4++) {
                    if (newCentroids[j$4] !== centroids[j$4]) {
                        repeat = true;
                        break;
                    }
                }

                centroids = newCentroids;
                nb_iters++;

                if (nb_iters > 200) {
                    repeat = false;
                }
            }

            // finished k-means clustering
            // the next part is borrowed from gabrielflor.it
            var kClusters = {};
            for (var j$5=0; j$5<num; j$5++) {
                kClusters[j$5] = [];
            }
            for (var i$6=0; i$6<n; i$6++) {
                cluster = assignments[i$6];
                kClusters[cluster].push(values[i$6]);
            }
            var tmpKMeansBreaks = [];
            for (var j$6=0; j$6<num; j$6++) {
                tmpKMeansBreaks.push(kClusters[j$6][0]);
                tmpKMeansBreaks.push(kClusters[j$6][kClusters[j$6].length-1]);
            }
            tmpKMeansBreaks = tmpKMeansBreaks.sort(function (a,b){ return a-b; });
            limits.push(tmpKMeansBreaks[0]);
            for (var i$7=1; i$7 < tmpKMeansBreaks.length; i$7+= 2) {
                var v = tmpKMeansBreaks[i$7];
                if (!isNaN(v) && (limits.indexOf(v) === -1)) {
                    limits.push(v);
                }
            }
        }
        return limits;
    };

    var analyze_1 = {analyze: analyze, limits: limits};

    var Color$3 = Color_1;


    var contrast = function (a, b) {
        // WCAG contrast ratio
        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
        a = new Color$3(a);
        b = new Color$3(b);
        var l1 = a.luminance();
        var l2 = b.luminance();
        return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
    };

    var Color$2 = Color_1;
    var sqrt = Math.sqrt;
    var pow = Math.pow;
    var min = Math.min;
    var max = Math.max;
    var atan2 = Math.atan2;
    var abs = Math.abs;
    var cos = Math.cos;
    var sin = Math.sin;
    var exp = Math.exp;
    var PI = Math.PI;

    var deltaE = function(a, b, Kl, Kc, Kh) {
        if ( Kl === void 0 ) Kl=1;
        if ( Kc === void 0 ) Kc=1;
        if ( Kh === void 0 ) Kh=1;

        // Delta E (CIE 2000)
        // see http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
        var rad2deg = function(rad) {
            return 360 * rad / (2 * PI);
        };
        var deg2rad = function(deg) {
            return (2 * PI * deg) / 360;
        };
        a = new Color$2(a);
        b = new Color$2(b);
        var ref = Array.from(a.lab());
        var L1 = ref[0];
        var a1 = ref[1];
        var b1 = ref[2];
        var ref$1 = Array.from(b.lab());
        var L2 = ref$1[0];
        var a2 = ref$1[1];
        var b2 = ref$1[2];
        var avgL = (L1 + L2)/2;
        var C1 = sqrt(pow(a1, 2) + pow(b1, 2));
        var C2 = sqrt(pow(a2, 2) + pow(b2, 2));
        var avgC = (C1 + C2)/2;
        var G = 0.5*(1-sqrt(pow(avgC, 7)/(pow(avgC, 7) + pow(25, 7))));
        var a1p = a1*(1+G);
        var a2p = a2*(1+G);
        var C1p = sqrt(pow(a1p, 2) + pow(b1, 2));
        var C2p = sqrt(pow(a2p, 2) + pow(b2, 2));
        var avgCp = (C1p + C2p)/2;
        var arctan1 = rad2deg(atan2(b1, a1p));
        var arctan2 = rad2deg(atan2(b2, a2p));
        var h1p = arctan1 >= 0 ? arctan1 : arctan1 + 360;
        var h2p = arctan2 >= 0 ? arctan2 : arctan2 + 360;
        var avgHp = abs(h1p - h2p) > 180 ? (h1p + h2p + 360)/2 : (h1p + h2p)/2;
        var T = 1 - 0.17*cos(deg2rad(avgHp - 30)) + 0.24*cos(deg2rad(2*avgHp)) + 0.32*cos(deg2rad(3*avgHp + 6)) - 0.2*cos(deg2rad(4*avgHp - 63));
        var deltaHp = h2p - h1p;
        deltaHp = abs(deltaHp) <= 180 ? deltaHp : h2p <= h1p ? deltaHp + 360 : deltaHp - 360;
        deltaHp = 2*sqrt(C1p*C2p)*sin(deg2rad(deltaHp)/2);
        var deltaL = L2 - L1;
        var deltaCp = C2p - C1p;    
        var sl = 1 + (0.015*pow(avgL - 50, 2))/sqrt(20 + pow(avgL - 50, 2));
        var sc = 1 + 0.045*avgCp;
        var sh = 1 + 0.015*avgCp*T;
        var deltaTheta = 30*exp(-pow((avgHp - 275)/25, 2));
        var Rc = 2*sqrt(pow(avgCp, 7)/(pow(avgCp, 7) + pow(25, 7)));
        var Rt = -Rc*sin(2*deg2rad(deltaTheta));
        var result = sqrt(pow(deltaL/(Kl*sl), 2) + pow(deltaCp/(Kc*sc), 2) + pow(deltaHp/(Kh*sh), 2) + Rt*(deltaCp/(Kc*sc))*(deltaHp/(Kh*sh)));
        return max(0, min(100, result));
    };

    var Color$1 = Color_1;

    // simple Euclidean distance
    var distance = function(a, b, mode) {
        if ( mode === void 0 ) mode='lab';

        // Delta E (CIE 1976)
        // see http://www.brucelindbloom.com/index.html?Equations.html
        a = new Color$1(a);
        b = new Color$1(b);
        var l1 = a.get(mode);
        var l2 = b.get(mode);
        var sum_sq = 0;
        for (var i in l1) {
            var d = (l1[i] || 0) - (l2[i] || 0);
            sum_sq += d*d;
        }
        return Math.sqrt(sum_sq);
    };

    var Color = Color_1;

    var valid = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        try {
            new (Function.prototype.bind.apply( Color, [ null ].concat( args) ));
            return true;
        } catch (e) {
            return false;
        }
    };

    // some pre-defined color scales:
    var chroma$1 = chroma_1;

    var scale = scale$2;

    var scales = {
    	cool: function cool() { return scale([chroma$1.hsl(180,1,.9), chroma$1.hsl(250,.7,.4)]) },
    	hot: function hot() { return scale(['#000','#f00','#ff0','#fff']).mode('rgb') }
    };

    /**
        ColorBrewer colors for chroma.js

        Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The
        Pennsylvania State University.

        Licensed under the Apache License, Version 2.0 (the "License");
        you may not use this file except in compliance with the License.
        You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0

        Unless required by applicable law or agreed to in writing, software distributed
        under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
        CONDITIONS OF ANY KIND, either express or implied. See the License for the
        specific language governing permissions and limitations under the License.
    */

    var colorbrewer = {
        // sequential
        OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
        PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
        BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
        Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
        BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
        YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
        YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
        Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
        RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
        Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
        YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
        Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
        GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
        Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
        YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
        PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
        Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
        PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
        Viridis: ['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'],

        // diverging

        Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
        RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
        RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
        PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
        PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
        RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
        BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
        RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
        PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],

        // qualitative

        Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
        Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
        Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
        Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
        Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
        Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
        Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
        Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2'],
    };

    // add lowercase aliases for case-insensitive matches
    for (var i = 0, list = Object.keys(colorbrewer); i < list.length; i += 1) {
        var key = list[i];

        colorbrewer[key.toLowerCase()] = colorbrewer[key];
    }

    var colorbrewer_1 = colorbrewer;

    var chroma = chroma_1;

    // feel free to comment out anything to rollup
    // a smaller chroma.js built

    // io --> convert colors

















    // operators --> modify existing Colors










    // interpolators












    // generators -- > create new colors
    chroma.average = average;
    chroma.bezier = bezier_1;
    chroma.blend = blend_1;
    chroma.cubehelix = cubehelix;
    chroma.mix = chroma.interpolate = mix$1;
    chroma.random = random_1;
    chroma.scale = scale$2;

    // other utility methods
    chroma.analyze = analyze_1.analyze;
    chroma.contrast = contrast;
    chroma.deltaE = deltaE;
    chroma.distance = distance;
    chroma.limits = analyze_1.limits;
    chroma.valid = valid;

    // scale
    chroma.scales = scales;

    // colors
    chroma.colors = w3cx11_1;
    chroma.brewer = colorbrewer_1;

    var chroma_js = chroma;

    return chroma_js;

}));

},{}],2:[function(require,module,exports){
const canvasBackground = require('./config.js').colors.empty

module.exports = ({ width, scale }, controls) => {
  //  const showMajority = controls.toggles[0]
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = width

  canvas.style.backgroundColor = canvasBackground
  canvas.style.width = `${width * scale}px`
  canvas.style.height = `${width * scale}px`
  canvas.style.imageRendering = 'pixelated'
  canvas.setAttribute("class", 'explorable_display')

  const ctx = canvas.getContext('2d')

  // function that receives a model and renders it to the canvas
  const render = (model) => {
    const SPECIES = model.SPECIES()
    const colorFromState = (state) => SPECIES[state].color

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const showMajority = controls.toggles[0].value()
    const currState = model.lattice.nodes.map((node) => {


      let speciesIndex = node.state
      let numEmpty = 0
      // show color of majority of neighbors rather than actual cell state
      if (showMajority === true) {
        const nCount = new Array(SPECIES.length).fill(0)
        node.neighbors.forEach((neighbor) => { nCount[neighbor.state]++ })
        nCount[node.state]++

        let largest = 0
        speciesIndex = 0
        nCount.forEach((numSpecies, i) => {
          if (i === 0) {
            numEmpty = numSpecies
          } else if (numSpecies > largest) {
            // if (numSpecies > largest) { // include empty state within color by majority
            largest = numSpecies
            speciesIndex = i
          }
        })
      } else {
        numEmpty = node.state === 0 ? 8 : 0
      }
     // numEmpty = 0
      let a = 255

      // fade empty pixels with few neighbors
      if(node.state === 0 && numEmpty > 6) {
        a = 255 * node.fade
        speciesIndex = node.fadeState
      } 
      // if(numEmpty < 6) {
      //   a = 255
      // }
      return Object.assign({}, colorFromState(speciesIndex),
        { 
         // a: node.state == 0 ? 255 * (12 - numEmpty) / 12 : 255 
         a
        })
    })

    for (var i = 0; i < data.length; i += 4) {
      const { r, g, b, a} = currState[i/4]
      data[i] = r     // red
      data[i + 1] = g // Math.random()*255; // green
      data[i + 2] = b// Math.random()*255; // blue
      // data[i + 3] = 255 // alpha
      // use numEmpty in neighborhood to determine alpha
      data[i + 3] = a
    }
    ctx.putImageData(imageData, 0, 0);
  }

  return { render: render, canvas: canvas }
}
},{"./config.js":4}],3:[function(require,module,exports){
const chroma = require('chroma-js')
const { colors } = require('./config.js')

const colorToObj = (color) => {
  const c0 = chroma(color)
  const c = c0['_rgb']
  return  { r: c[0], g: c[1], b: c[2] , hex: c0.hex() }
}

const colorMaps = {
  'd3': (index, numSpecies, id) => d3[id](index/numSpecies),
  'crameri': (index, numSpecies, id) => crameri[id][numSpecies + 1][index]
}

module.exports.speciesColor = (index = 0, numSpecies = 9) => {
  const { id, type } = colors.speciesColorMap
  const color = colorMaps[type](index, numSpecies, id)
// const color = d3.interpolateRainbow(index/numSpecies)
  // const color = crameri['romaO'][numSpecies+1][index]
  //const color = crameri['brocO'][numSpecies+1][index]
  // const color = d3.interpolateSinebow(index/numSpecies)
//   console.log('hex', color, index)
//  // const c = color.replace('rgb(', '').replace(')', '').split(',').map((s) => parseFloat(s))
 
//   console.log('color', c0)
//   const c = c0['_rgb']
  return colorToObj(color)
}

module.exports.emptyColor = colorToObj(colors.empty)
module.exports.parasiteColor = colorToObj(colors.parasite)

// https://observablehq.com/@nitaku/fabio-crameris-color-schemes
const crameri = {
    "vanimo": {
      "2": [
        "#ffcdfd",
        "#befda5"
      ],
      "3": [
        "#ffcdfd",
        "#191513",
        "#befda5"
      ],
      "4": [
        "#ffcdfd",
        "#5c244f",
        "#35491a",
        "#befda5"
      ],
      "5": [
        "#ffcdfd",
        "#923e80",
        "#191513",
        "#527226",
        "#befda5"
      ],
      "6": [
        "#ffcdfd",
        "#ad539a",
        "#33172b",
        "#222b13",
        "#61872e",
        "#befda5"
      ],
      "7": [
        "#ffcdfd",
        "#bd63aa",
        "#5c244f",
        "#191513",
        "#35491a",
        "#6e9737",
        "#befda5"
      ],
      "8": [
        "#ffcdfd",
        "#c76fb5",
        "#7c326b",
        "#271421",
        "#1d2211",
        "#456020",
        "#77a43e",
        "#befda5"
      ],
      "9": [
        "#ffcdfd",
        "#cd78bd",
        "#923e80",
        "#401b36",
        "#191513",
        "#293715",
        "#527226",
        "#7fae47",
        "#befda5"
      ],
      "10": [
        "#ffcdfd",
        "#d481c5",
        "#a34a90",
        "#5c244f",
        "#22141c",
        "#1b1e11",
        "#35491a",
        "#5b7e2b",
        "#85b54c",
        "#befda5"
      ],
      "11": [
        "#ffcdfd",
        "#d889ca",
        "#ad539a",
        "#742e64",
        "#33172b",
        "#191513",
        "#222b13",
        "#415a1f",
        "#61872e",
        "#8abc53",
        "#befda5"
      ],
      "12": [
        "#ffcdfd",
        "#dc8ece",
        "#b65ba3",
        "#863775",
        "#471d3d",
        "#1f131a",
        "#1a1b11",
        "#2c3a16",
        "#4a6723",
        "#689033",
        "#8ec158",
        "#befda5"
      ],
      "tags": [
        "diverging"
      ]
    },
    "bilbao": {
      "2": [
        "#ffffff",
        "#4c0001"
      ],
      "3": [
        "#ffffff",
        "#aa8665",
        "#4c0001"
      ],
      "4": [
        "#ffffff",
        "#baaf8b",
        "#9f6155",
        "#4c0001"
      ],
      "5": [
        "#ffffff",
        "#c2bca6",
        "#aa8665",
        "#934a46",
        "#4c0001"
      ],
      "6": [
        "#ffffff",
        "#c8c5b8",
        "#b29f76",
        "#a4705c",
        "#883c3b",
        "#4c0001"
      ],
      "7": [
        "#ffffff",
        "#ceccc5",
        "#baaf8b",
        "#aa8665",
        "#9f6155",
        "#7e3231",
        "#4c0001"
      ],
      "8": [
        "#ffffff",
        "#d4d2ce",
        "#beb79a",
        "#b09870",
        "#a5775e",
        "#99554e",
        "#772b2a",
        "#4c0001"
      ],
      "9": [
        "#ffffff",
        "#d8d7d4",
        "#c2bca6",
        "#b5a57c",
        "#aa8665",
        "#a26a59",
        "#934a46",
        "#722525",
        "#4c0001"
      ],
      "10": [
        "#ffffff",
        "#dcdcd9",
        "#c6c1b1",
        "#baaf8b",
        "#ae946d",
        "#a67a60",
        "#9f6155",
        "#8c4240",
        "#6e2222",
        "#4c0001"
      ],
      "11": [
        "#ffffff",
        "#e0dfde",
        "#c8c5b8",
        "#bdb596",
        "#b29f76",
        "#aa8665",
        "#a4705c",
        "#9b5850",
        "#883c3b",
        "#6b1f1e",
        "#4c0001"
      ],
      "12": [
        "#ffffff",
        "#e2e2e0",
        "#cbc9bf",
        "#c0b9a0",
        "#b6a880",
        "#ad916b",
        "#a77d61",
        "#a16858",
        "#97514b",
        "#823635",
        "#681c1c",
        "#4c0001"
      ],
      "tags": [
        "sequential"
      ]
    },
    "bilbaoS": {
      "2": [
        "#f9f9f9",
        "#4c0001"
      ],
      "3": [
        "#f9f9f9",
        "#4c0001",
        "#a98565"
      ],
      "4": [
        "#f9f9f9",
        "#4c0001",
        "#a98565",
        "#c1baa2"
      ],
      "5": [
        "#f9f9f9",
        "#4c0001",
        "#a98565",
        "#c1baa2",
        "#924945"
      ],
      "6": [
        "#f9f9f9",
        "#4c0001",
        "#a98565",
        "#c1baa2",
        "#924945",
        "#a16959"
      ],
      "7": [
        "#f9f9f9",
        "#4c0001",
        "#a98565",
        "#c1baa2",
        "#924945",
        "#a16959",
        "#b4a279"
      ],
      "8": [
        "#f9f9f9",
        "#4c0001",
        "#a98565",
        "#c1baa2",
        "#924945",
        "#a16959",
        "#b4a279",
        "#722525"
      ],
      "9": [
        "#f9f9f9",
        "#4c0001",
        "#a98565",
        "#c1baa2",
        "#924945",
        "#a16959",
        "#b4a279",
        "#722525",
        "#d4d2ce"
      ],
      "10": [
        "#f9f9f9",
        "#4c0001",
        "#a98565",
        "#c1baa2",
        "#924945",
        "#a16959",
        "#b4a279",
        "#722525",
        "#d4d2ce",
        "#9c5a51"
      ],
      "11": [
        "#f9f9f9",
        "#4c0001",
        "#a98565",
        "#c1baa2",
        "#924945",
        "#a16959",
        "#b4a279",
        "#722525",
        "#d4d2ce",
        "#9c5a51",
        "#bab08d"
      ],
      "12": [
        "#f9f9f9",
        "#4c0001",
        "#a98565",
        "#c1baa2",
        "#924945",
        "#a16959",
        "#b4a279",
        "#722525",
        "#d4d2ce",
        "#9c5a51",
        "#bab08d",
        "#ae936c"
      ],
      "tags": [
        "categorical"
      ]
    },
    "budaS": {
      "2": [
        "#b300b3",
        "#ffff66"
      ],
      "3": [
        "#b300b3",
        "#ffff66",
        "#ce857e"
      ],
      "4": [
        "#b300b3",
        "#ffff66",
        "#ce857e",
        "#bc4e90"
      ],
      "5": [
        "#b300b3",
        "#ffff66",
        "#ce857e",
        "#bc4e90",
        "#dcbe70"
      ],
      "6": [
        "#b300b3",
        "#ffff66",
        "#ce857e",
        "#bc4e90",
        "#dcbe70",
        "#d5a177"
      ],
      "7": [
        "#b300b3",
        "#ffff66",
        "#ce857e",
        "#bc4e90",
        "#dcbe70",
        "#d5a177",
        "#b32f9c"
      ],
      "8": [
        "#b300b3",
        "#ffff66",
        "#ce857e",
        "#bc4e90",
        "#dcbe70",
        "#d5a177",
        "#b32f9c",
        "#c56a87"
      ],
      "9": [
        "#b300b3",
        "#ffff66",
        "#ce857e",
        "#bc4e90",
        "#dcbe70",
        "#d5a177",
        "#b32f9c",
        "#c56a87",
        "#e4dc69"
      ],
      "10": [
        "#b300b3",
        "#ffff66",
        "#ce857e",
        "#bc4e90",
        "#dcbe70",
        "#d5a177",
        "#b32f9c",
        "#c56a87",
        "#e4dc69",
        "#b73f95"
      ],
      "11": [
        "#b300b3",
        "#ffff66",
        "#ce857e",
        "#bc4e90",
        "#dcbe70",
        "#d5a177",
        "#b32f9c",
        "#c56a87",
        "#e4dc69",
        "#b73f95",
        "#d8af74"
      ],
      "12": [
        "#b300b3",
        "#ffff66",
        "#ce857e",
        "#bc4e90",
        "#dcbe70",
        "#d5a177",
        "#b32f9c",
        "#c56a87",
        "#e4dc69",
        "#b73f95",
        "#d8af74",
        "#ca7882"
      ],
      "tags": [
        "categorical"
      ]
    },
    "buda": {
      "2": [
        "#b300b3",
        "#ffff66"
      ],
      "3": [
        "#b300b3",
        "#ce857e",
        "#ffff66"
      ],
      "4": [
        "#b300b3",
        "#c2618a",
        "#d7aa75",
        "#ffff66"
      ],
      "5": [
        "#b300b3",
        "#bc4e90",
        "#ce857e",
        "#dcbe70",
        "#ffff66"
      ],
      "6": [
        "#b300b3",
        "#b84294",
        "#c76f85",
        "#d39b79",
        "#dfc96d",
        "#ffff66"
      ],
      "7": [
        "#b300b3",
        "#b53998",
        "#c2618a",
        "#ce857e",
        "#d7aa75",
        "#e1d16b",
        "#ffff66"
      ],
      "8": [
        "#b300b3",
        "#b4339a",
        "#bf568d",
        "#c97583",
        "#d2957a",
        "#dab572",
        "#e2d76a",
        "#ffff66"
      ],
      "9": [
        "#b300b3",
        "#b32f9c",
        "#bc4e90",
        "#c56a87",
        "#ce857e",
        "#d5a177",
        "#dcbe70",
        "#e4dc69",
        "#ffff66"
      ],
      "10": [
        "#b300b3",
        "#b32a9e",
        "#b94793",
        "#c2618a",
        "#ca7982",
        "#d1917b",
        "#d7aa75",
        "#dec46e",
        "#e5df68",
        "#ffff66"
      ],
      "11": [
        "#b300b3",
        "#b327a0",
        "#b84294",
        "#bf598c",
        "#c76f85",
        "#ce857e",
        "#d39b79",
        "#d9b273",
        "#dfc96d",
        "#e7e268",
        "#ffff66"
      ],
      "12": [
        "#b300b3",
        "#b325a1",
        "#b63d96",
        "#bd538f",
        "#c46888",
        "#cb7b81",
        "#d08f7c",
        "#d5a377",
        "#dbb871",
        "#e0ce6c",
        "#e8e467",
        "#ffff66"
      ],
      "tags": [
        "sequential"
      ]
    },
    "bam": {
      "2": [
        "#65024b",
        "#0c4b00"
      ],
      "3": [
        "#65024b",
        "#f6f2f1",
        "#0c4b00"
      ],
      "4": [
        "#65024b",
        "#e5aed7",
        "#c1daa2",
        "#0c4b00"
      ],
      "5": [
        "#65024b",
        "#d17fbc",
        "#f6f2f1",
        "#8ab363",
        "#0c4b00"
      ],
      "6": [
        "#65024b",
        "#c164a9",
        "#f0d2e8",
        "#e2eed1",
        "#6f9e4b",
        "#0c4b00"
      ],
      "7": [
        "#65024b",
        "#b5539c",
        "#e5aed7",
        "#f6f2f1",
        "#c1daa2",
        "#5e903d",
        "#0c4b00"
      ],
      "8": [
        "#65024b",
        "#ac4993",
        "#da93c8",
        "#f4deed",
        "#ebf2df",
        "#a3c67d",
        "#538734",
        "#0c4b00"
      ],
      "9": [
        "#65024b",
        "#a6428c",
        "#d17fbc",
        "#edc6e3",
        "#f6f2f1",
        "#d7e7c0",
        "#8ab363",
        "#4a7f2e",
        "#0c4b00"
      ],
      "10": [
        "#65024b",
        "#9f3c85",
        "#c86db1",
        "#e5aed7",
        "#f5e4f0",
        "#eff3e5",
        "#c1daa2",
        "#7aa754",
        "#457b2a",
        "#0c4b00"
      ],
      "11": [
        "#65024b",
        "#99367f",
        "#c164a9",
        "#dd9acc",
        "#f0d2e8",
        "#f6f2f1",
        "#e2eed1",
        "#abcb86",
        "#6f9e4b",
        "#407626",
        "#0c4b00"
      ],
      "12": [
        "#65024b",
        "#95337c",
        "#bb5aa2",
        "#d68ac3",
        "#ebc0df",
        "#f6e7f1",
        "#f1f4e9",
        "#d3e5ba",
        "#99bf72",
        "#659643",
        "#3c7323",
        "#0c4b00"
      ],
      "tags": [
        "diverging"
      ]
    },
    "davosS": {
      "2": [
        "#00054a",
        "#fdfdf5"
      ],
      "3": [
        "#00054a",
        "#fdfdf5",
        "#688b94"
      ],
      "4": [
        "#00054a",
        "#fdfdf5",
        "#688b94",
        "#2d5895"
      ],
      "5": [
        "#00054a",
        "#fdfdf5",
        "#688b94",
        "#2d5895",
        "#b2c08f"
      ],
      "6": [
        "#00054a",
        "#fdfdf5",
        "#688b94",
        "#2d5895",
        "#b2c08f",
        "#4b769d"
      ],
      "7": [
        "#00054a",
        "#fdfdf5",
        "#688b94",
        "#2d5895",
        "#b2c08f",
        "#4b769d",
        "#133075"
      ],
      "8": [
        "#00054a",
        "#fdfdf5",
        "#688b94",
        "#2d5895",
        "#b2c08f",
        "#4b769d",
        "#133075",
        "#87a089"
      ],
      "9": [
        "#00054a",
        "#fdfdf5",
        "#688b94",
        "#2d5895",
        "#b2c08f",
        "#4b769d",
        "#133075",
        "#87a089",
        "#e9ebc0"
      ],
      "10": [
        "#00054a",
        "#fdfdf5",
        "#688b94",
        "#2d5895",
        "#b2c08f",
        "#4b769d",
        "#133075",
        "#87a089",
        "#e9ebc0",
        "#081c61"
      ],
      "11": [
        "#00054a",
        "#fdfdf5",
        "#688b94",
        "#2d5895",
        "#b2c08f",
        "#4b769d",
        "#133075",
        "#87a089",
        "#e9ebc0",
        "#081c61",
        "#9aae88"
      ],
      "12": [
        "#00054a",
        "#fdfdf5",
        "#688b94",
        "#2d5895",
        "#b2c08f",
        "#4b769d",
        "#133075",
        "#87a089",
        "#e9ebc0",
        "#081c61",
        "#9aae88",
        "#76958e"
      ],
      "tags": [
        "categorical"
      ]
    },
    "davos": {
      "2": [
        "#00054a",
        "#ffffff"
      ],
      "3": [
        "#00054a",
        "#6c8e93",
        "#ffffff"
      ],
      "4": [
        "#00054a",
        "#43709d",
        "#99ad88",
        "#ffffff"
      ],
      "5": [
        "#00054a",
        "#2f5a96",
        "#6c8e93",
        "#bec995",
        "#ffffff"
      ],
      "6": [
        "#00054a",
        "#234a8c",
        "#537d9c",
        "#849e89",
        "#d4dba8",
        "#ffffff"
      ],
      "7": [
        "#00054a",
        "#1c3f83",
        "#43709d",
        "#6c8e93",
        "#99ad88",
        "#e3e7b9",
        "#ffffff"
      ],
      "8": [
        "#00054a",
        "#17377c",
        "#37649b",
        "#5a829a",
        "#7d998c",
        "#abbb8c",
        "#ebedc4",
        "#ffffff"
      ],
      "9": [
        "#00054a",
        "#143177",
        "#2f5a96",
        "#4e799d",
        "#6c8e93",
        "#8ca488",
        "#bec995",
        "#f0f1cd",
        "#ffffff"
      ],
      "10": [
        "#00054a",
        "#112c71",
        "#275190",
        "#43709d",
        "#5e8598",
        "#79978d",
        "#99ad88",
        "#cbd49f",
        "#f3f4d3",
        "#ffffff"
      ],
      "11": [
        "#00054a",
        "#0f286d",
        "#234a8c",
        "#3a679c",
        "#537d9c",
        "#6c8e93",
        "#849e89",
        "#a6b78a",
        "#d4dba8",
        "#f5f6d8",
        "#ffffff"
      ],
      "12": [
        "#00054a",
        "#0d256b",
        "#1f4487",
        "#336099",
        "#4b769d",
        "#618697",
        "#76958e",
        "#8fa588",
        "#b2c08f",
        "#dde2b1",
        "#f7f7db",
        "#ffffff"
      ],
      "tags": [
        "sequential"
      ]
    },
    "oleron": {
      "2": [
        "#192659",
        "#fdfde6"
      ],
      "3": [
        "#192659",
        "#194c00",
        "#fdfde6"
      ],
      "4": [
        "#192659",
        "#aab7e8",
        "#7a711e",
        "#fdfde6"
      ],
      "5": [
        "#192659",
        "#8390c3",
        "#194c00",
        "#aa9050",
        "#fdfde6"
      ],
      "6": [
        "#192659",
        "#6c79ac",
        "#c5d1f7",
        "#535e02",
        "#c5a56c",
        "#fdfde6"
      ],
      "7": [
        "#192659",
        "#5d699d",
        "#aab7e8",
        "#194c00",
        "#7a711e",
        "#dab581",
        "#fdfde6"
      ],
      "8": [
        "#192659",
        "#525f92",
        "#94a1d4",
        "#cedbf9",
        "#445900",
        "#948239",
        "#e6c090",
        "#fdfde6"
      ],
      "9": [
        "#192659",
        "#4c588c",
        "#8390c3",
        "#bcc9f4",
        "#194c00",
        "#63640a",
        "#aa9050",
        "#eec99d",
        "#fdfde6"
      ],
      "10": [
        "#192659",
        "#455285",
        "#7582b5",
        "#aab7e8",
        "#d3e0fb",
        "#3c5600",
        "#7a711e",
        "#ba9c60",
        "#f1cfa4",
        "#fdfde6"
      ],
      "11": [
        "#192659",
        "#404d80",
        "#6c79ac",
        "#99a6d9",
        "#c5d1f7",
        "#194c00",
        "#535e02",
        "#8e7d33",
        "#c5a56c",
        "#f4d4ac",
        "#fdfde6"
      ],
      "12": [
        "#192659",
        "#3d4a7d",
        "#6470a3",
        "#8d99cd",
        "#b8c4f1",
        "#d7e4fc",
        "#355400",
        "#67670e",
        "#9d8742",
        "#d1ae78",
        "#f5d7b0",
        "#fdfde6"
      ],
      "tags": [
        "multi-sequential"
      ]
    },
    "lisbon": {
      "2": [
        "#e6e6ff",
        "#ffffd9"
      ],
      "3": [
        "#e6e6ff",
        "#161819",
        "#ffffd9"
      ],
      "4": [
        "#e6e6ff",
        "#1e4368",
        "#565133",
        "#ffffd9"
      ],
      "5": [
        "#e6e6ff",
        "#416a97",
        "#161819",
        "#817a4e",
        "#ffffd9"
      ],
      "6": [
        "#e6e6ff",
        "#6083ae",
        "#132a42",
        "#383522",
        "#9a915f",
        "#ffffd9"
      ],
      "7": [
        "#e6e6ff",
        "#7794bd",
        "#1e4368",
        "#161819",
        "#565133",
        "#ada570",
        "#ffffd9"
      ],
      "8": [
        "#e6e6ff",
        "#86a0c6",
        "#2e5884",
        "#112233",
        "#2d2a1c",
        "#6d6741",
        "#b9b17d",
        "#ffffd9"
      ],
      "9": [
        "#e6e6ff",
        "#91a7cd",
        "#416a97",
        "#15324f",
        "#161819",
        "#444029",
        "#817a4e",
        "#c3bc89",
        "#ffffd9"
      ],
      "10": [
        "#e6e6ff",
        "#9bafd3",
        "#5479a6",
        "#1e4368",
        "#111e2c",
        "#272519",
        "#565133",
        "#8f8757",
        "#c9c390",
        "#ffffd9"
      ],
      "11": [
        "#e6e6ff",
        "#a3b5d8",
        "#6083ae",
        "#29537d",
        "#132a42",
        "#161819",
        "#383522",
        "#67613e",
        "#9a915f",
        "#cfc998",
        "#ffffd9"
      ],
      "12": [
        "#e6e6ff",
        "#a8b9db",
        "#6c8db6",
        "#36608d",
        "#173756",
        "#111b26",
        "#222118",
        "#48442b",
        "#756e46",
        "#a49c68",
        "#d3ce9d",
        "#ffffd9"
      ],
      "tags": [
        "diverging"
      ]
    },
    "bamakoS": {
      "2": [
        "#00404c",
        "#ffe699"
      ],
      "3": [
        "#00404c",
        "#ffe699",
        "#607d14"
      ],
      "4": [
        "#00404c",
        "#ffe699",
        "#607d14",
        "#b9a525"
      ],
      "5": [
        "#00404c",
        "#ffe699",
        "#607d14",
        "#b9a525",
        "#2a5a33"
      ],
      "6": [
        "#00404c",
        "#ffe699",
        "#607d14",
        "#b9a525",
        "#2a5a33",
        "#e3c961"
      ],
      "7": [
        "#00404c",
        "#ffe699",
        "#607d14",
        "#b9a525",
        "#2a5a33",
        "#e3c961",
        "#154c40"
      ],
      "8": [
        "#00404c",
        "#ffe699",
        "#607d14",
        "#b9a525",
        "#2a5a33",
        "#e3c961",
        "#154c40",
        "#878e02"
      ],
      "9": [
        "#00404c",
        "#ffe699",
        "#607d14",
        "#b9a525",
        "#2a5a33",
        "#e3c961",
        "#154c40",
        "#878e02",
        "#426a25"
      ],
      "10": [
        "#00404c",
        "#ffe699",
        "#607d14",
        "#b9a525",
        "#2a5a33",
        "#e3c961",
        "#154c40",
        "#878e02",
        "#426a25",
        "#0b4646"
      ],
      "11": [
        "#00404c",
        "#ffe699",
        "#607d14",
        "#b9a525",
        "#2a5a33",
        "#e3c961",
        "#154c40",
        "#878e02",
        "#426a25",
        "#0b4646",
        "#73880a"
      ],
      "12": [
        "#00404c",
        "#ffe699",
        "#607d14",
        "#b9a525",
        "#2a5a33",
        "#e3c961",
        "#154c40",
        "#878e02",
        "#426a25",
        "#0b4646",
        "#73880a",
        "#9e950b"
      ],
      "tags": [
        "categorical"
      ]
    },
    "bamako": {
      "2": [
        "#00404c",
        "#ffe699"
      ],
      "3": [
        "#00404c",
        "#617e14",
        "#ffe699"
      ],
      "4": [
        "#00404c",
        "#3a652a",
        "#969206",
        "#ffe699"
      ],
      "5": [
        "#00404c",
        "#2a5a33",
        "#617e14",
        "#bba626",
        "#ffe699"
      ],
      "6": [
        "#00404c",
        "#215439",
        "#486e22",
        "#808d04",
        "#ceb63d",
        "#ffe699"
      ],
      "7": [
        "#00404c",
        "#1b503c",
        "#3a652a",
        "#617e14",
        "#969206",
        "#d9c04e",
        "#ffe699"
      ],
      "8": [
        "#00404c",
        "#184e3f",
        "#315f2f",
        "#4e721e",
        "#768908",
        "#aa9b16",
        "#dfc65a",
        "#ffe699"
      ],
      "9": [
        "#00404c",
        "#154c40",
        "#2a5a33",
        "#436a25",
        "#617e14",
        "#898f02",
        "#bba626",
        "#e4ca63",
        "#ffe699"
      ],
      "10": [
        "#00404c",
        "#134b42",
        "#255737",
        "#3a652a",
        "#52741c",
        "#71870a",
        "#969206",
        "#c6af33",
        "#e7cd68",
        "#ffe699"
      ],
      "11": [
        "#00404c",
        "#114943",
        "#215439",
        "#33602e",
        "#486e22",
        "#617e14",
        "#808d04",
        "#a59811",
        "#ceb63d",
        "#ead06e",
        "#ffe699"
      ],
      "12": [
        "#00404c",
        "#0f4944",
        "#1e523b",
        "#2e5d31",
        "#406926",
        "#55761a",
        "#6e850c",
        "#8b8f02",
        "#b19f1c",
        "#d4bb47",
        "#ebd271",
        "#ffe699"
      ],
      "tags": [
        "sequential"
      ]
    },
    "batlowW": {
      "2": [
        "#011959",
        "#fffefe"
      ],
      "3": [
        "#011959",
        "#7e8737",
        "#fffefe"
      ],
      "4": [
        "#011959",
        "#396e58",
        "#d0a35a",
        "#fffefe"
      ],
      "5": [
        "#011959",
        "#205f61",
        "#7e8737",
        "#e9ac86",
        "#fffefe"
      ],
      "6": [
        "#011959",
        "#175462",
        "#52784c",
        "#b1993a",
        "#f3b49f",
        "#fffefe"
      ],
      "7": [
        "#011959",
        "#134c61",
        "#396e58",
        "#7e8737",
        "#d0a35a",
        "#fac0b5",
        "#fffefe"
      ],
      "8": [
        "#011959",
        "#114661",
        "#29665f",
        "#5e7c46",
        "#a29433",
        "#dfa872",
        "#fdcac4",
        "#fffefe"
      ],
      "9": [
        "#011959",
        "#104360",
        "#205f61",
        "#497450",
        "#7e8737",
        "#c09d45",
        "#e9ac86",
        "#fed3d0",
        "#fffefe"
      ],
      "10": [
        "#011959",
        "#103f5f",
        "#1a5862",
        "#396e58",
        "#647e43",
        "#9a9132",
        "#d0a35a",
        "#efb094",
        "#ffd8d6",
        "#fffefe"
      ],
      "11": [
        "#011959",
        "#0f3b5f",
        "#175462",
        "#2d685d",
        "#52784c",
        "#7e8737",
        "#b1993a",
        "#dca76c",
        "#f3b49f",
        "#ffdddc",
        "#fffefe"
      ],
      "12": [
        "#011959",
        "#0e395f",
        "#154f62",
        "#256360",
        "#447353",
        "#698040",
        "#948f32",
        "#c39f49",
        "#e3a97a",
        "#f7baab",
        "#ffe1df",
        "#fffefe"
      ],
      "tags": [
        "sequential"
      ]
    },
    "roma": {
      "2": [
        "#7e1700",
        "#023198"
      ],
      "3": [
        "#7e1700",
        "#c0ebc4",
        "#023198"
      ],
      "4": [
        "#7e1700",
        "#c9b555",
        "#5dc1d4",
        "#023198"
      ],
      "5": [
        "#7e1700",
        "#b68c32",
        "#c0ebc4",
        "#389cc6",
        "#023198"
      ],
      "6": [
        "#7e1700",
        "#ac7725",
        "#d2d584",
        "#89dbd7",
        "#2d89be",
        "#023198"
      ],
      "7": [
        "#7e1700",
        "#a5681f",
        "#c9b555",
        "#c0ebc4",
        "#5dc1d4",
        "#277ab8",
        "#023198"
      ],
      "8": [
        "#7e1700",
        "#a05f1a",
        "#be9d3e",
        "#d2df99",
        "#9be2d6",
        "#46adcd",
        "#2471b4",
        "#023198"
      ],
      "9": [
        "#7e1700",
        "#9d5818",
        "#b68c32",
        "#d0ca72",
        "#c0ebc4",
        "#76d1d7",
        "#389cc6",
        "#2169b1",
        "#023198"
      ],
      "10": [
        "#7e1700",
        "#9a5215",
        "#b07f2a",
        "#c9b555",
        "#d0e3a3",
        "#a4e6d3",
        "#5dc1d4",
        "#3190c2",
        "#2064ae",
        "#023198"
      ],
      "11": [
        "#7e1700",
        "#974c13",
        "#ac7725",
        "#c1a343",
        "#d2d584",
        "#c0ebc4",
        "#89dbd7",
        "#4bb2cf",
        "#2d89be",
        "#1e5fac",
        "#023198"
      ],
      "12": [
        "#7e1700",
        "#954911",
        "#a86f22",
        "#bb9538",
        "#cfc46a",
        "#cee6ab",
        "#abe8d1",
        "#71ced7",
        "#3fa6ca",
        "#2a81bb",
        "#1d5bab",
        "#023198"
      ],
      "tags": [
        "diverging"
      ]
    },
    "hawaii": {
      "2": [
        "#8c0173",
        "#b4f2fe"
      ],
      "3": [
        "#8c0173",
        "#9c961c",
        "#b4f2fe"
      ],
      "4": [
        "#8c0173",
        "#99632f",
        "#80c55f",
        "#b4f2fe"
      ],
      "5": [
        "#8c0173",
        "#974d3d",
        "#9c961c",
        "#6bd58e",
        "#b4f2fe"
      ],
      "6": [
        "#8c0173",
        "#954147",
        "#9c7524",
        "#8fb63c",
        "#62dda9",
        "#b4f2fe"
      ],
      "7": [
        "#8c0173",
        "#94384d",
        "#99632f",
        "#9c961c",
        "#80c55f",
        "#5fe3be",
        "#b4f2fe"
      ],
      "8": [
        "#8c0173",
        "#933252",
        "#985637",
        "#9c7e20",
        "#94ae30",
        "#74ce78",
        "#61e6cb",
        "#b4f2fe"
      ],
      "9": [
        "#8c0173",
        "#922e55",
        "#974d3d",
        "#9b6f28",
        "#9c961c",
        "#89bd4a",
        "#6bd58e",
        "#67e9d5",
        "#b4f2fe"
      ],
      "10": [
        "#8c0173",
        "#922a59",
        "#964643",
        "#99632f",
        "#9d831e",
        "#97a929",
        "#80c55f",
        "#65d99e",
        "#6bebdb",
        "#b4f2fe"
      ],
      "11": [
        "#8c0173",
        "#91275b",
        "#954147",
        "#985935",
        "#9c7524",
        "#9c961c",
        "#8fb63c",
        "#77cc72",
        "#62dda9",
        "#71ece0",
        "#b4f2fe"
      ],
      "12": [
        "#8c0173",
        "#91245d",
        "#943c4a",
        "#97523a",
        "#9b6b2a",
        "#9d871d",
        "#98a525",
        "#87bf4e",
        "#70d181",
        "#5fe0b5",
        "#76ede4",
        "#b4f2fe"
      ],
      "tags": [
        "sequential"
      ]
    },
    "hawaiiS": {
      "2": [
        "#8c0173",
        "#b4f2fe"
      ],
      "3": [
        "#8c0173",
        "#b4f2fe",
        "#9c951c"
      ],
      "4": [
        "#8c0173",
        "#b4f2fe",
        "#9c951c",
        "#6cd48c"
      ],
      "5": [
        "#8c0173",
        "#b4f2fe",
        "#9c951c",
        "#6cd48c",
        "#974d3d"
      ],
      "6": [
        "#8c0173",
        "#b4f2fe",
        "#9c951c",
        "#6cd48c",
        "#974d3d",
        "#65e9d3"
      ],
      "7": [
        "#8c0173",
        "#b4f2fe",
        "#9c951c",
        "#6cd48c",
        "#974d3d",
        "#65e9d3",
        "#8abc48"
      ],
      "8": [
        "#8c0173",
        "#b4f2fe",
        "#9c951c",
        "#6cd48c",
        "#974d3d",
        "#65e9d3",
        "#8abc48",
        "#922e55"
      ],
      "9": [
        "#8c0173",
        "#b4f2fe",
        "#9c951c",
        "#6cd48c",
        "#974d3d",
        "#65e9d3",
        "#8abc48",
        "#922e55",
        "#9b6f28"
      ],
      "10": [
        "#8c0173",
        "#b4f2fe",
        "#9c951c",
        "#6cd48c",
        "#974d3d",
        "#65e9d3",
        "#8abc48",
        "#922e55",
        "#9b6f28",
        "#953e49"
      ],
      "11": [
        "#8c0173",
        "#b4f2fe",
        "#9c951c",
        "#6cd48c",
        "#974d3d",
        "#65e9d3",
        "#8abc48",
        "#922e55",
        "#9b6f28",
        "#953e49",
        "#96aa2b"
      ],
      "12": [
        "#8c0173",
        "#b4f2fe",
        "#9c951c",
        "#6cd48c",
        "#974d3d",
        "#65e9d3",
        "#8abc48",
        "#922e55",
        "#9b6f28",
        "#953e49",
        "#96aa2b",
        "#60dfb0"
      ],
      "tags": [
        "categorical"
      ]
    },
    "bamO": {
      "2": [
        "#4f2f43",
        "#4e2f42"
      ],
      "3": [
        "#4f2f43",
        "#cfcdbb",
        "#4e2f42"
      ],
      "4": [
        "#4f2f43",
        "#d8b0ca",
        "#839165",
        "#4e2f42"
      ],
      "5": [
        "#4f2f43",
        "#c285b2",
        "#cfcdbb",
        "#676e4d",
        "#4e2f42"
      ],
      "6": [
        "#4f2f43",
        "#af6d9e",
        "#dac6cb",
        "#a2b185",
        "#5b5c44",
        "#4e2f42"
      ],
      "7": [
        "#4f2f43",
        "#a05e91",
        "#d8b0ca",
        "#cfcdbb",
        "#839165",
        "#53503f",
        "#4e2f42"
      ],
      "8": [
        "#4f2f43",
        "#965587",
        "#ce98be",
        "#d8cac9",
        "#b2be97",
        "#737d56",
        "#4f493d",
        "#4e2f42"
      ],
      "9": [
        "#4f2f43",
        "#8f4f80",
        "#c285b2",
        "#dac0cc",
        "#cfcdbb",
        "#94a376",
        "#676e4d",
        "#4d443b",
        "#4e2f42"
      ],
      "10": [
        "#4f2f43",
        "#874979",
        "#b675a6",
        "#d8b0ca",
        "#d7cbc7",
        "#bac4a1",
        "#839165",
        "#606347",
        "#4c423b",
        "#4e2f42"
      ],
      "11": [
        "#4f2f43",
        "#814573",
        "#af6d9e",
        "#d19ec2",
        "#dac6cb",
        "#cfcdbb",
        "#a2b185",
        "#778259",
        "#5b5c44",
        "#4b3f3a",
        "#4e2f42"
      ],
      "12": [
        "#4f2f43",
        "#7d426f",
        "#a76497",
        "#c98fb9",
        "#dabdcc",
        "#d6ccc5",
        "#c0c7a8",
        "#91a072",
        "#6e7752",
        "#565541",
        "#4a3e3a",
        "#4e2f42"
      ],
      "tags": [
        "cyclic"
      ]
    },
    "imolaS": {
      "2": [
        "#1933b3",
        "#ffff66"
      ],
      "3": [
        "#1933b3",
        "#ffff66",
        "#53857f"
      ],
      "4": [
        "#1933b3",
        "#ffff66",
        "#53857f",
        "#91c46f"
      ],
      "5": [
        "#1933b3",
        "#ffff66",
        "#53857f",
        "#91c46f",
        "#305e9d"
      ],
      "6": [
        "#1933b3",
        "#ffff66",
        "#53857f",
        "#91c46f",
        "#305e9d",
        "#2549a8"
      ],
      "7": [
        "#1933b3",
        "#ffff66",
        "#53857f",
        "#91c46f",
        "#305e9d",
        "#2549a8",
        "#70a377"
      ],
      "8": [
        "#1933b3",
        "#ffff66",
        "#53857f",
        "#91c46f",
        "#305e9d",
        "#2549a8",
        "#70a377",
        "#bde667"
      ],
      "9": [
        "#1933b3",
        "#ffff66",
        "#53857f",
        "#91c46f",
        "#305e9d",
        "#2549a8",
        "#70a377",
        "#bde667",
        "#3e708f"
      ],
      "10": [
        "#1933b3",
        "#ffff66",
        "#53857f",
        "#91c46f",
        "#305e9d",
        "#2549a8",
        "#70a377",
        "#bde667",
        "#3e708f",
        "#def466"
      ],
      "11": [
        "#1933b3",
        "#ffff66",
        "#53857f",
        "#91c46f",
        "#305e9d",
        "#2549a8",
        "#70a377",
        "#bde667",
        "#3e708f",
        "#def466",
        "#61937b"
      ],
      "12": [
        "#1933b3",
        "#ffff66",
        "#53857f",
        "#91c46f",
        "#305e9d",
        "#2549a8",
        "#70a377",
        "#bde667",
        "#3e708f",
        "#def466",
        "#61937b",
        "#2a53a2"
      ],
      "tags": [
        "categorical"
      ]
    },
    "imola": {
      "2": [
        "#1933b3",
        "#ffff66"
      ],
      "3": [
        "#1933b3",
        "#54867f",
        "#ffff66"
      ],
      "4": [
        "#1933b3",
        "#396b94",
        "#7bae74",
        "#ffff66"
      ],
      "5": [
        "#1933b3",
        "#305e9d",
        "#54867f",
        "#92c56e",
        "#ffff66"
      ],
      "6": [
        "#1933b3",
        "#2b55a1",
        "#42748b",
        "#6a9d78",
        "#9fd26b",
        "#ffff66"
      ],
      "7": [
        "#1933b3",
        "#284fa4",
        "#396b94",
        "#54867f",
        "#7bae74",
        "#acdc69",
        "#ffff66"
      ],
      "8": [
        "#1933b3",
        "#264ba6",
        "#336399",
        "#467987",
        "#64967a",
        "#87ba71",
        "#b6e268",
        "#ffff66"
      ],
      "9": [
        "#1933b3",
        "#2549a8",
        "#305e9d",
        "#3f718e",
        "#54867f",
        "#71a477",
        "#92c56e",
        "#bfe767",
        "#ffff66"
      ],
      "10": [
        "#1933b3",
        "#2446a9",
        "#2d59a0",
        "#396b94",
        "#497b85",
        "#60937b",
        "#7bae74",
        "#9acc6d",
        "#c5ea67",
        "#ffff66"
      ],
      "11": [
        "#1933b3",
        "#2344aa",
        "#2b55a1",
        "#356598",
        "#42748b",
        "#54867f",
        "#6a9d78",
        "#84b772",
        "#9fd26b",
        "#cbed66",
        "#ffff66"
      ],
      "12": [
        "#1933b3",
        "#2243ab",
        "#2a52a3",
        "#32619b",
        "#3d6f90",
        "#4b7d84",
        "#5d907c",
        "#73a676",
        "#8bbe70",
        "#a6d76a",
        "#cfee66",
        "#ffff66"
      ],
      "tags": [
        "sequential"
      ]
    },
    "batlow": {
      "2": [
        "#011959",
        "#fbccfb"
      ],
      "3": [
        "#011959",
        "#828231",
        "#fbccfb"
      ],
      "4": [
        "#011959",
        "#3c6d55",
        "#d39343",
        "#fbccfb"
      ],
      "5": [
        "#011959",
        "#226061",
        "#828231",
        "#f39d6d",
        "#fbccfb"
      ],
      "6": [
        "#011959",
        "#185562",
        "#567647",
        "#b38e2f",
        "#fba689",
        "#fbccfb"
      ],
      "7": [
        "#011959",
        "#144c62",
        "#3c6d55",
        "#828231",
        "#d39343",
        "#fdad9e",
        "#fbccfb"
      ],
      "8": [
        "#011959",
        "#124761",
        "#2c665d",
        "#627941",
        "#a58b2b",
        "#e69858",
        "#feb1ab",
        "#fbccfb"
      ],
      "9": [
        "#011959",
        "#114360",
        "#226061",
        "#4d734c",
        "#828231",
        "#c19036",
        "#f39d6d",
        "#feb5b6",
        "#fbccfb"
      ],
      "10": [
        "#011959",
        "#103f60",
        "#1b5962",
        "#3c6d55",
        "#687b3d",
        "#9d892b",
        "#d39343",
        "#f9a27e",
        "#feb7bc",
        "#fbccfb"
      ],
      "11": [
        "#011959",
        "#0f3b5f",
        "#185562",
        "#30685c",
        "#567647",
        "#828231",
        "#b38e2f",
        "#e29752",
        "#fba689",
        "#fdb9c3",
        "#fbccfb"
      ],
      "12": [
        "#011959",
        "#0e395f",
        "#155062",
        "#27635f",
        "#48714f",
        "#6d7c3b",
        "#97882b",
        "#c49138",
        "#ec9a60",
        "#fdaa95",
        "#fdbbc7",
        "#fbccfb"
      ],
      "tags": [
        "sequential"
      ]
    },
    "batlowS": {
      "2": [
        "#011959",
        "#fbccfb"
      ],
      "3": [
        "#011959",
        "#fbccfb",
        "#828231"
      ],
      "4": [
        "#011959",
        "#fbccfb",
        "#828231",
        "#226061"
      ],
      "5": [
        "#011959",
        "#fbccfb",
        "#828231",
        "#226061",
        "#f29d6b"
      ],
      "6": [
        "#011959",
        "#fbccfb",
        "#828231",
        "#226061",
        "#f29d6b",
        "#4d734c"
      ],
      "7": [
        "#011959",
        "#fbccfb",
        "#828231",
        "#226061",
        "#f29d6b",
        "#4d734c",
        "#114360"
      ],
      "8": [
        "#011959",
        "#fbccfb",
        "#828231",
        "#226061",
        "#f29d6b",
        "#4d734c",
        "#114360",
        "#feb4b4"
      ],
      "9": [
        "#011959",
        "#fbccfb",
        "#828231",
        "#226061",
        "#f29d6b",
        "#4d734c",
        "#114360",
        "#feb4b4",
        "#c19036"
      ],
      "10": [
        "#011959",
        "#fbccfb",
        "#828231",
        "#226061",
        "#f29d6b",
        "#4d734c",
        "#114360",
        "#feb4b4",
        "#c19036",
        "#165262"
      ],
      "11": [
        "#011959",
        "#fbccfb",
        "#828231",
        "#226061",
        "#f29d6b",
        "#4d734c",
        "#114360",
        "#feb4b4",
        "#c19036",
        "#165262",
        "#fdc0d6"
      ],
      "12": [
        "#011959",
        "#fbccfb",
        "#828231",
        "#226061",
        "#f29d6b",
        "#4d734c",
        "#114360",
        "#feb4b4",
        "#c19036",
        "#165262",
        "#fdc0d6",
        "#fca890"
      ],
      "tags": [
        "categorical"
      ]
    },
    "corkO": {
      "2": [
        "#3f3e3a",
        "#3f3e39"
      ],
      "3": [
        "#3f3e3a",
        "#afcbbc",
        "#3f3e39"
      ],
      "4": [
        "#3f3e3a",
        "#849eba",
        "#73a36e",
        "#3f3e39"
      ],
      "5": [
        "#3f3e3a",
        "#5f7a9f",
        "#afcbbc",
        "#547d43",
        "#3f3e39"
      ],
      "6": [
        "#3f3e3a",
        "#4c6389",
        "#a1b8c7",
        "#90ba91",
        "#4a6934",
        "#3f3e39"
      ],
      "7": [
        "#3f3e3a",
        "#445578",
        "#849eba",
        "#afcbbc",
        "#73a36e",
        "#465d2e",
        "#3f3e39"
      ],
      "8": [
        "#3f3e3a",
        "#404c6c",
        "#6e8aac",
        "#aac0c8",
        "#9bc19f",
        "#608f56",
        "#44562c",
        "#3f3e39"
      ],
      "9": [
        "#3f3e3a",
        "#3f4764",
        "#5f7a9f",
        "#97afc4",
        "#afcbbc",
        "#84b183",
        "#547d43",
        "#43512c",
        "#3f3e39"
      ],
      "10": [
        "#3f3e3a",
        "#3e435d",
        "#536c92",
        "#849eba",
        "#adc4c8",
        "#a1c5a6",
        "#73a36e",
        "#4e7139",
        "#424e2c",
        "#3f3e39"
      ],
      "11": [
        "#3f3e3a",
        "#3e4158",
        "#4c6389",
        "#738fb0",
        "#a1b8c7",
        "#afcbbc",
        "#90ba91",
        "#65945c",
        "#4a6934",
        "#424c2d",
        "#3f3e39"
      ],
      "12": [
        "#3f3e3a",
        "#3d4055",
        "#475b80",
        "#6783a7",
        "#92abc1",
        "#afc7c7",
        "#a5c7ac",
        "#80af7f",
        "#5b874e",
        "#486230",
        "#424a2d",
        "#3f3e39"
      ],
      "tags": [
        "cyclic"
      ]
    },
    "tokyoS": {
      "2": [
        "#1a0e33",
        "#ffffd9"
      ],
      "3": [
        "#1a0e33",
        "#ffffd9",
        "#908786"
      ],
      "4": [
        "#1a0e33",
        "#ffffd9",
        "#908786",
        "#76466c"
      ],
      "5": [
        "#1a0e33",
        "#ffffd9",
        "#908786",
        "#76466c",
        "#a2c699"
      ],
      "6": [
        "#1a0e33",
        "#ffffd9",
        "#908786",
        "#76466c",
        "#a2c699",
        "#95a58e"
      ],
      "7": [
        "#1a0e33",
        "#ffffd9",
        "#908786",
        "#76466c",
        "#a2c699",
        "#95a58e",
        "#89697d"
      ],
      "8": [
        "#1a0e33",
        "#ffffd9",
        "#908786",
        "#76466c",
        "#a2c699",
        "#95a58e",
        "#89697d",
        "#4b2350"
      ],
      "9": [
        "#1a0e33",
        "#ffffd9",
        "#908786",
        "#76466c",
        "#a2c699",
        "#95a58e",
        "#89697d",
        "#4b2350",
        "#d0efb9"
      ],
      "10": [
        "#1a0e33",
        "#ffffd9",
        "#908786",
        "#76466c",
        "#a2c699",
        "#95a58e",
        "#89697d",
        "#4b2350",
        "#d0efb9",
        "#92968a"
      ],
      "11": [
        "#1a0e33",
        "#ffffd9",
        "#908786",
        "#76466c",
        "#a2c699",
        "#95a58e",
        "#89697d",
        "#4b2350",
        "#d0efb9",
        "#92968a",
        "#63335f"
      ],
      "12": [
        "#1a0e33",
        "#ffffd9",
        "#908786",
        "#76466c",
        "#a2c699",
        "#95a58e",
        "#89697d",
        "#4b2350",
        "#d0efb9",
        "#92968a",
        "#63335f",
        "#321741"
      ],
      "tags": [
        "categorical"
      ]
    },
    "tokyo": {
      "2": [
        "#1a0e33",
        "#ffffd9"
      ],
      "3": [
        "#1a0e33",
        "#908786",
        "#ffffd9"
      ],
      "4": [
        "#1a0e33",
        "#855e78",
        "#97ae91",
        "#ffffd9"
      ],
      "5": [
        "#1a0e33",
        "#76466c",
        "#908786",
        "#a2c699",
        "#ffffd9"
      ],
      "6": [
        "#1a0e33",
        "#673762",
        "#8b6f7f",
        "#949e8c",
        "#aed6a2",
        "#ffffd9"
      ],
      "7": [
        "#1a0e33",
        "#5a2c59",
        "#855e78",
        "#908786",
        "#97ae91",
        "#bce2ab",
        "#ffffd9"
      ],
      "8": [
        "#1a0e33",
        "#512654",
        "#7e5172",
        "#8c7681",
        "#92988b",
        "#9bbb95",
        "#c7eab3",
        "#ffffd9"
      ],
      "9": [
        "#1a0e33",
        "#4b2350",
        "#76466c",
        "#89697d",
        "#908786",
        "#95a58e",
        "#a2c699",
        "#d0efb9",
        "#ffffd9"
      ],
      "10": [
        "#1a0e33",
        "#451f4c",
        "#6d3d66",
        "#855e78",
        "#8d7982",
        "#92948a",
        "#97ae91",
        "#a8cf9e",
        "#d6f2bc",
        "#ffffd9"
      ],
      "11": [
        "#1a0e33",
        "#401d49",
        "#673762",
        "#805474",
        "#8b6f7f",
        "#908786",
        "#949e8c",
        "#9ab894",
        "#aed6a2",
        "#dbf5c0",
        "#ffffd9"
      ],
      "12": [
        "#1a0e33",
        "#3d1b47",
        "#60315d",
        "#7a4c70",
        "#88667b",
        "#8e7c83",
        "#919189",
        "#95a78f",
        "#9ebf96",
        "#b6dda7",
        "#def6c2",
        "#ffffd9"
      ],
      "tags": [
        "sequential"
      ]
    },
    "actonS": {
      "2": [
        "#2e214c",
        "#e6e6f0"
      ],
      "3": [
        "#2e214c",
        "#e6e6f0",
        "#c36d9b"
      ],
      "4": [
        "#2e214c",
        "#e6e6f0",
        "#c36d9b",
        "#d4a7c4"
      ],
      "5": [
        "#2e214c",
        "#e6e6f0",
        "#c36d9b",
        "#d4a7c4",
        "#775986"
      ],
      "6": [
        "#2e214c",
        "#e6e6f0",
        "#c36d9b",
        "#d4a7c4",
        "#775986",
        "#4f3e6a"
      ],
      "7": [
        "#2e214c",
        "#e6e6f0",
        "#c36d9b",
        "#d4a7c4",
        "#775986",
        "#4f3e6a",
        "#d58cb1"
      ],
      "8": [
        "#2e214c",
        "#e6e6f0",
        "#c36d9b",
        "#d4a7c4",
        "#775986",
        "#4f3e6a",
        "#d58cb1",
        "#dac5da"
      ],
      "9": [
        "#2e214c",
        "#e6e6f0",
        "#c36d9b",
        "#d4a7c4",
        "#775986",
        "#4f3e6a",
        "#d58cb1",
        "#dac5da",
        "#9e6593"
      ],
      "10": [
        "#2e214c",
        "#e6e6f0",
        "#c36d9b",
        "#d4a7c4",
        "#775986",
        "#4f3e6a",
        "#d58cb1",
        "#dac5da",
        "#9e6593",
        "#e0d5e5"
      ],
      "11": [
        "#2e214c",
        "#e6e6f0",
        "#c36d9b",
        "#d4a7c4",
        "#775986",
        "#4f3e6a",
        "#d58cb1",
        "#dac5da",
        "#9e6593",
        "#e0d5e5",
        "#3e2f5b"
      ],
      "12": [
        "#2e214c",
        "#e6e6f0",
        "#c36d9b",
        "#d4a7c4",
        "#775986",
        "#4f3e6a",
        "#d58cb1",
        "#dac5da",
        "#9e6593",
        "#e0d5e5",
        "#3e2f5b",
        "#d499bb"
      ],
      "tags": [
        "categorical"
      ]
    },
    "acton": {
      "2": [
        "#2e214c",
        "#e6e6f0"
      ],
      "3": [
        "#2e214c",
        "#c46e9b",
        "#e6e6f0"
      ],
      "4": [
        "#2e214c",
        "#926390",
        "#d495b8",
        "#e6e6f0"
      ],
      "5": [
        "#2e214c",
        "#775986",
        "#c46e9b",
        "#d4a7c5",
        "#e6e6f0"
      ],
      "6": [
        "#2e214c",
        "#664f7b",
        "#a66694",
        "#d586ad",
        "#d5b2cd",
        "#e6e6f0"
      ],
      "7": [
        "#2e214c",
        "#5b4773",
        "#926390",
        "#c46e9b",
        "#d495b8",
        "#d7bbd3",
        "#e6e6f0"
      ],
      "8": [
        "#2e214c",
        "#54426e",
        "#835f8b",
        "#ae6695",
        "#d37fa8",
        "#d49fbf",
        "#d9c1d7",
        "#e6e6f0"
      ],
      "9": [
        "#2e214c",
        "#4f3e6a",
        "#775986",
        "#9f6593",
        "#c46e9b",
        "#d58cb2",
        "#d4a7c5",
        "#dbc6da",
        "#e6e6f0"
      ],
      "10": [
        "#2e214c",
        "#4b3a66",
        "#6d5380",
        "#926390",
        "#b26795",
        "#d17ba5",
        "#d495b8",
        "#d5aeca",
        "#dcc9dc",
        "#e6e6f0"
      ],
      "11": [
        "#2e214c",
        "#483863",
        "#664f7b",
        "#87608d",
        "#a66694",
        "#c46e9b",
        "#d586ad",
        "#d49cbd",
        "#d5b2cd",
        "#ddccde",
        "#e6e6f0"
      ],
      "12": [
        "#2e214c",
        "#463662",
        "#604b77",
        "#7e5d89",
        "#9c6592",
        "#b66896",
        "#cf78a3",
        "#d58eb3",
        "#d4a2c1",
        "#d6b7d0",
        "#ddcee0",
        "#e6e6f0"
      ],
      "tags": [
        "sequential"
      ]
    },
    "vik": {
      "2": [
        "#001161",
        "#590007"
      ],
      "3": [
        "#001161",
        "#ede5e1",
        "#590007"
      ],
      "4": [
        "#001161",
        "#70a8c4",
        "#d49774",
        "#590007"
      ],
      "5": [
        "#001161",
        "#307da7",
        "#ede5e1",
        "#c37041",
        "#590007"
      ],
      "6": [
        "#001161",
        "#116496",
        "#a7cadb",
        "#e2b8a0",
        "#b85a25",
        "#590007"
      ],
      "7": [
        "#001161",
        "#05548b",
        "#70a8c4",
        "#ede5e1",
        "#d49774",
        "#a94512",
        "#590007"
      ],
      "8": [
        "#001161",
        "#034a85",
        "#4a90b3",
        "#bdd7e3",
        "#e7c6b2",
        "#ca8258",
        "#9c3708",
        "#590007"
      ],
      "9": [
        "#001161",
        "#024481",
        "#307da7",
        "#94bed3",
        "#ede5e1",
        "#dcaa8e",
        "#c37041",
        "#922c05",
        "#590007"
      ],
      "10": [
        "#001161",
        "#023d7d",
        "#1b6d9c",
        "#70a8c4",
        "#cadde7",
        "#ebcebd",
        "#d49774",
        "#bd6331",
        "#8b2705",
        "#590007"
      ],
      "11": [
        "#001161",
        "#02397a",
        "#116496",
        "#5496b7",
        "#a7cadb",
        "#ede5e1",
        "#e2b8a0",
        "#cd875f",
        "#b85a25",
        "#852205",
        "#590007"
      ],
      "12": [
        "#001161",
        "#023678",
        "#095b90",
        "#3e87ae",
        "#8ab8cf",
        "#d3e2e9",
        "#edd4c6",
        "#daa688",
        "#c77b4e",
        "#b04e1a",
        "#811f05",
        "#590007"
      ],
      "tags": [
        "diverging"
      ]
    },
    "devon": {
      "2": [
        "#2b194c",
        "#ffffff"
      ],
      "3": [
        "#2b194c",
        "#7e8fdd",
        "#ffffff"
      ],
      "4": [
        "#2b194c",
        "#3569ad",
        "#bab4f1",
        "#ffffff"
      ],
      "5": [
        "#2b194c",
        "#28588f",
        "#7e8fdd",
        "#cbc7f5",
        "#ffffff"
      ],
      "6": [
        "#2b194c",
        "#264a7e",
        "#4b77c4",
        "#a9a5ed",
        "#d5d1f7",
        "#ffffff"
      ],
      "7": [
        "#2b194c",
        "#274174",
        "#3569ad",
        "#7e8fdd",
        "#bab4f1",
        "#dcd9f8",
        "#ffffff"
      ],
      "8": [
        "#2b194c",
        "#283b6e",
        "#2d609c",
        "#597dcd",
        "#9f9ee9",
        "#c3bef3",
        "#e1dff9",
        "#ffffff"
      ],
      "9": [
        "#2b194c",
        "#28376a",
        "#28588f",
        "#4271bc",
        "#7e8fdd",
        "#b1abef",
        "#cbc7f5",
        "#e5e3fa",
        "#ffffff"
      ],
      "10": [
        "#2b194c",
        "#293367",
        "#275084",
        "#3569ad",
        "#6181d1",
        "#989be7",
        "#bab4f1",
        "#d1cdf6",
        "#e8e6fb",
        "#ffffff"
      ],
      "11": [
        "#2b194c",
        "#293164",
        "#264a7e",
        "#2f62a0",
        "#4b77c4",
        "#7e8fdd",
        "#a9a5ed",
        "#c1bbf3",
        "#d5d1f7",
        "#eae9fb",
        "#ffffff"
      ],
      "12": [
        "#2b194c",
        "#292f62",
        "#274579",
        "#2a5c96",
        "#3e6fb8",
        "#6784d4",
        "#9398e5",
        "#b3adef",
        "#c7c1f4",
        "#d9d6f8",
        "#eceafc",
        "#ffffff"
      ],
      "tags": [
        "sequential"
      ]
    },
    "devonS": {
      "2": [
        "#2b194c",
        "#f9f8fe"
      ],
      "3": [
        "#2b194c",
        "#f9f8fe",
        "#778bda"
      ],
      "4": [
        "#2b194c",
        "#f9f8fe",
        "#778bda",
        "#28568c"
      ],
      "5": [
        "#2b194c",
        "#f9f8fe",
        "#778bda",
        "#28568c",
        "#c7c1f4"
      ],
      "6": [
        "#2b194c",
        "#f9f8fe",
        "#778bda",
        "#28568c",
        "#c7c1f4",
        "#aba6ed"
      ],
      "7": [
        "#2b194c",
        "#f9f8fe",
        "#778bda",
        "#28568c",
        "#c7c1f4",
        "#aba6ed",
        "#283669"
      ],
      "8": [
        "#2b194c",
        "#f9f8fe",
        "#778bda",
        "#28568c",
        "#c7c1f4",
        "#aba6ed",
        "#283669",
        "#3e6fb8"
      ],
      "9": [
        "#2b194c",
        "#f9f8fe",
        "#778bda",
        "#28568c",
        "#c7c1f4",
        "#aba6ed",
        "#283669",
        "#3e6fb8",
        "#e0ddf9"
      ],
      "10": [
        "#2b194c",
        "#f9f8fe",
        "#778bda",
        "#28568c",
        "#c7c1f4",
        "#aba6ed",
        "#283669",
        "#3e6fb8",
        "#e0ddf9",
        "#2f63a2"
      ],
      "11": [
        "#2b194c",
        "#f9f8fe",
        "#778bda",
        "#28568c",
        "#c7c1f4",
        "#aba6ed",
        "#283669",
        "#3e6fb8",
        "#e0ddf9",
        "#2f63a2",
        "#9599e6"
      ],
      "12": [
        "#2b194c",
        "#f9f8fe",
        "#778bda",
        "#28568c",
        "#c7c1f4",
        "#aba6ed",
        "#283669",
        "#3e6fb8",
        "#e0ddf9",
        "#2f63a2",
        "#9599e6",
        "#eceafc"
      ],
      "tags": [
        "categorical"
      ]
    },
    "turkuS": {
      "2": [
        "#070706",
        "#ffe6e6"
      ],
      "3": [
        "#070706",
        "#ffe6e6",
        "#948d5b"
      ],
      "4": [
        "#070706",
        "#ffe6e6",
        "#948d5b",
        "#e5ab90"
      ],
      "5": [
        "#070706",
        "#ffe6e6",
        "#948d5b",
        "#e5ab90",
        "#4c4c3b"
      ],
      "6": [
        "#070706",
        "#ffe6e6",
        "#948d5b",
        "#e5ab90",
        "#4c4c3b",
        "#6d6c4a"
      ],
      "7": [
        "#070706",
        "#ffe6e6",
        "#948d5b",
        "#e5ab90",
        "#4c4c3b",
        "#6d6c4a",
        "#c3a374"
      ],
      "8": [
        "#070706",
        "#ffe6e6",
        "#948d5b",
        "#e5ab90",
        "#4c4c3b",
        "#6d6c4a",
        "#c3a374",
        "#fbc3bd"
      ],
      "9": [
        "#070706",
        "#ffe6e6",
        "#948d5b",
        "#e5ab90",
        "#4c4c3b",
        "#6d6c4a",
        "#c3a374",
        "#fbc3bd",
        "#2b2b26"
      ],
      "10": [
        "#070706",
        "#ffe6e6",
        "#948d5b",
        "#e5ab90",
        "#4c4c3b",
        "#6d6c4a",
        "#c3a374",
        "#fbc3bd",
        "#2b2b26",
        "#3c3c31"
      ],
      "11": [
        "#070706",
        "#ffe6e6",
        "#948d5b",
        "#e5ab90",
        "#4c4c3b",
        "#6d6c4a",
        "#c3a374",
        "#fbc3bd",
        "#2b2b26",
        "#3c3c31",
        "#d6a780"
      ],
      "12": [
        "#070706",
        "#ffe6e6",
        "#948d5b",
        "#e5ab90",
        "#4c4c3b",
        "#6d6c4a",
        "#c3a374",
        "#fbc3bd",
        "#2b2b26",
        "#3c3c31",
        "#d6a780",
        "#ffd5d3"
      ],
      "tags": [
        "categorical"
      ]
    },
    "turku": {
      "2": [
        "#000000",
        "#ffe6e6"
      ],
      "3": [
        "#000000",
        "#938c5b",
        "#ffe6e6"
      ],
      "4": [
        "#000000",
        "#5f5f44",
        "#cfa67b",
        "#ffe6e6"
      ],
      "5": [
        "#000000",
        "#494939",
        "#938c5b",
        "#e5ab90",
        "#ffe6e6"
      ],
      "6": [
        "#000000",
        "#3c3c31",
        "#71704c",
        "#baa06e",
        "#f0b1a1",
        "#ffe6e6"
      ],
      "7": [
        "#000000",
        "#32322b",
        "#5f5f44",
        "#938c5b",
        "#cfa67b",
        "#f6b9ae",
        "#ffe6e6"
      ],
      "8": [
        "#000000",
        "#2c2c26",
        "#53523e",
        "#79774f",
        "#af9c68",
        "#dca886",
        "#f9bfb8",
        "#ffe6e6"
      ],
      "9": [
        "#000000",
        "#282823",
        "#494939",
        "#6b6a49",
        "#938c5b",
        "#c3a374",
        "#e5ab90",
        "#fcc4bf",
        "#ffe6e6"
      ],
      "10": [
        "#000000",
        "#242320",
        "#414135",
        "#5f5f44",
        "#7e7c52",
        "#a99965",
        "#cfa67b",
        "#ecae99",
        "#fcc8c3",
        "#ffe6e6"
      ],
      "11": [
        "#000000",
        "#20201d",
        "#3c3c31",
        "#565540",
        "#71704c",
        "#938c5b",
        "#baa06e",
        "#d9a783",
        "#f0b1a1",
        "#fdcbc7",
        "#ffe6e6"
      ],
      "12": [
        "#000000",
        "#1e1e1c",
        "#36362e",
        "#4e4e3c",
        "#676748",
        "#827f53",
        "#a49663",
        "#c6a475",
        "#e0a98a",
        "#f4b5a8",
        "#fecdca",
        "#ffe6e6"
      ],
      "tags": [
        "sequential"
      ]
    },
    "berlin": {
      "2": [
        "#9eb0ff",
        "#ffaeae"
      ],
      "3": [
        "#9eb0ff",
        "#190c08",
        "#ffaeae"
      ],
      "4": [
        "#9eb0ff",
        "#194256",
        "#501703",
        "#ffaeae"
      ],
      "5": [
        "#9eb0ff",
        "#286786",
        "#190c08",
        "#7d341e",
        "#ffaeae"
      ],
      "6": [
        "#9eb0ff",
        "#3280a6",
        "#112732",
        "#361000",
        "#964936",
        "#ffaeae"
      ],
      "7": [
        "#9eb0ff",
        "#3d90bc",
        "#194256",
        "#190c08",
        "#501703",
        "#a85a4a",
        "#ffaeae"
      ],
      "8": [
        "#9eb0ff",
        "#489acb",
        "#215771",
        "#101d24",
        "#2d0e00",
        "#67240e",
        "#b46658",
        "#ffaeae"
      ],
      "9": [
        "#9eb0ff",
        "#519fd3",
        "#286786",
        "#13303e",
        "#190c08",
        "#401200",
        "#7d341e",
        "#be6f63",
        "#ffaeae"
      ],
      "10": [
        "#9eb0ff",
        "#5ba4db",
        "#2e7699",
        "#194256",
        "#10181d",
        "#280d00",
        "#501703",
        "#8c402c",
        "#c4756a",
        "#ffaeae"
      ],
      "11": [
        "#9eb0ff",
        "#62a6e1",
        "#3280a6",
        "#1f526a",
        "#112732",
        "#190c08",
        "#361000",
        "#61200b",
        "#964936",
        "#ca7b71",
        "#ffaeae"
      ],
      "12": [
        "#9eb0ff",
        "#67a8e4",
        "#3889b2",
        "#245e7a",
        "#153544",
        "#101519",
        "#250c01",
        "#431301",
        "#702914",
        "#a05341",
        "#cf7f76",
        "#ffaeae"
      ],
      "tags": [
        "diverging"
      ]
    },
    "tofino": {
      "2": [
        "#ded9ff",
        "#dce69c"
      ],
      "3": [
        "#ded9ff",
        "#0c1513",
        "#dce69c"
      ],
      "4": [
        "#ded9ff",
        "#273c65",
        "#244d28",
        "#dce69c"
      ],
      "5": [
        "#ded9ff",
        "#3e5e9b",
        "#0c1513",
        "#37753d",
        "#dce69c"
      ],
      "6": [
        "#ded9ff",
        "#5777bb",
        "#18253c",
        "#17311a",
        "#498d4b",
        "#dce69c"
      ],
      "7": [
        "#ded9ff",
        "#6e89cc",
        "#273c65",
        "#0c1513",
        "#244d28",
        "#5fa059",
        "#dce69c"
      ],
      "8": [
        "#ded9ff",
        "#7e95d4",
        "#334f83",
        "#131d2e",
        "#132715",
        "#2e6233",
        "#70ab62",
        "#dce69c"
      ],
      "9": [
        "#ded9ff",
        "#889dda",
        "#3e5e9b",
        "#1d2c4a",
        "#0c1513",
        "#1c3c1f",
        "#37753d",
        "#7fb46b",
        "#dce69c"
      ],
      "10": [
        "#ded9ff",
        "#93a4df",
        "#4c6daf",
        "#273c65",
        "#111926",
        "#112213",
        "#244d28",
        "#418345",
        "#88ba6f",
        "#dce69c"
      ],
      "11": [
        "#ded9ff",
        "#9baae2",
        "#5777bb",
        "#304a7b",
        "#18253c",
        "#0c1513",
        "#17311a",
        "#2b5d30",
        "#498d4b",
        "#91bf74",
        "#dce69c"
      ],
      "12": [
        "#ded9ff",
        "#a0aee5",
        "#6481c5",
        "#38558d",
        "#1f3151",
        "#101721",
        "#101e12",
        "#1e4021",
        "#316a36",
        "#549852",
        "#97c277",
        "#dce69c"
      ],
      "tags": [
        "diverging"
      ]
    },
    "cork": {
      "2": [
        "#2b194c",
        "#0f2903"
      ],
      "3": [
        "#2b194c",
        "#e7eeec",
        "#0f2903"
      ],
      "4": [
        "#2b194c",
        "#83a1be",
        "#8eb48d",
        "#0f2903"
      ],
      "5": [
        "#2b194c",
        "#567fa6",
        "#e7eeec",
        "#5b925b",
        "#0f2903"
      ],
      "6": [
        "#2b194c",
        "#3d6b98",
        "#adc1d4",
        "#b8d0b7",
        "#438142",
        "#0f2903"
      ],
      "7": [
        "#2b194c",
        "#2f5c8d",
        "#83a1be",
        "#e7eeec",
        "#8eb48d",
        "#317430",
        "#0f2903"
      ],
      "8": [
        "#2b194c",
        "#295284",
        "#688db0",
        "#c0cfde",
        "#c9dbc9",
        "#71a171",
        "#266a24",
        "#0f2903"
      ],
      "9": [
        "#2b194c",
        "#284b7e",
        "#567fa6",
        "#9eb5cc",
        "#e7eeec",
        "#a6c4a6",
        "#5b925b",
        "#1e611c",
        "#0f2903"
      ],
      "10": [
        "#2b194c",
        "#284578",
        "#46739e",
        "#83a1be",
        "#cbd7e4",
        "#d2e1d2",
        "#8eb48d",
        "#4d884c",
        "#1b5b18",
        "#0f2903"
      ],
      "11": [
        "#2b194c",
        "#284073",
        "#3d6b98",
        "#6f92b3",
        "#adc1d4",
        "#e7eeec",
        "#b8d0b7",
        "#78a578",
        "#438142",
        "#195615",
        "#0f2903"
      ],
      "12": [
        "#2b194c",
        "#283d70",
        "#346392",
        "#6086ac",
        "#96b0c8",
        "#d3dee8",
        "#d9e6d9",
        "#a1c1a1",
        "#689a68",
        "#397a38",
        "#175213",
        "#0f2903"
      ],
      "tags": [
        "diverging"
      ]
    },
    "grayC": {
      "2": [
        "#ffffff",
        "#000000"
      ],
      "3": [
        "#ffffff",
        "#767676",
        "#000000"
      ],
      "4": [
        "#ffffff",
        "#a2a2a2",
        "#4e4e4e",
        "#000000"
      ],
      "5": [
        "#ffffff",
        "#b9b9b9",
        "#767676",
        "#3a3a3a",
        "#000000"
      ],
      "6": [
        "#ffffff",
        "#c7c7c7",
        "#919191",
        "#5e5e5e",
        "#303030",
        "#000000"
      ],
      "7": [
        "#ffffff",
        "#d0d0d0",
        "#a2a2a2",
        "#767676",
        "#4e4e4e",
        "#282828",
        "#000000"
      ],
      "8": [
        "#ffffff",
        "#d7d7d7",
        "#afafaf",
        "#898989",
        "#656565",
        "#434343",
        "#232323",
        "#000000"
      ],
      "9": [
        "#ffffff",
        "#dbdbdb",
        "#b9b9b9",
        "#979797",
        "#767676",
        "#575757",
        "#3a3a3a",
        "#1f1f1f",
        "#000000"
      ],
      "10": [
        "#ffffff",
        "#e0e0e0",
        "#c1c1c1",
        "#a2a2a2",
        "#858585",
        "#696969",
        "#4e4e4e",
        "#343434",
        "#1d1d1d",
        "#000000"
      ],
      "11": [
        "#ffffff",
        "#e3e3e3",
        "#c7c7c7",
        "#acacac",
        "#919191",
        "#767676",
        "#5e5e5e",
        "#464646",
        "#303030",
        "#1b1b1b",
        "#000000"
      ],
      "12": [
        "#ffffff",
        "#e6e6e6",
        "#cccccc",
        "#b3b3b3",
        "#9a9a9a",
        "#828282",
        "#6c6c6c",
        "#565656",
        "#404040",
        "#2c2c2c",
        "#191919",
        "#000000"
      ],
      "tags": [
        "sequential"
      ]
    },
    "grayCS": {
      "2": [
        "#fafafa",
        "#050505"
      ],
      "3": [
        "#fafafa",
        "#050505",
        "#767676"
      ],
      "4": [
        "#fafafa",
        "#050505",
        "#767676",
        "#b6b6b6"
      ],
      "5": [
        "#fafafa",
        "#050505",
        "#767676",
        "#b6b6b6",
        "#3c3c3c"
      ],
      "6": [
        "#fafafa",
        "#050505",
        "#767676",
        "#b6b6b6",
        "#3c3c3c",
        "#585858"
      ],
      "7": [
        "#fafafa",
        "#050505",
        "#767676",
        "#b6b6b6",
        "#3c3c3c",
        "#585858",
        "#969696"
      ],
      "8": [
        "#fafafa",
        "#050505",
        "#767676",
        "#b6b6b6",
        "#3c3c3c",
        "#585858",
        "#969696",
        "#232323"
      ],
      "9": [
        "#fafafa",
        "#050505",
        "#767676",
        "#b6b6b6",
        "#3c3c3c",
        "#585858",
        "#969696",
        "#232323",
        "#d7d7d7"
      ],
      "10": [
        "#fafafa",
        "#050505",
        "#767676",
        "#b6b6b6",
        "#3c3c3c",
        "#585858",
        "#969696",
        "#232323",
        "#d7d7d7",
        "#676767"
      ],
      "11": [
        "#fafafa",
        "#050505",
        "#767676",
        "#b6b6b6",
        "#3c3c3c",
        "#585858",
        "#969696",
        "#232323",
        "#d7d7d7",
        "#676767",
        "#c7c7c7"
      ],
      "12": [
        "#fafafa",
        "#050505",
        "#767676",
        "#b6b6b6",
        "#3c3c3c",
        "#585858",
        "#969696",
        "#232323",
        "#d7d7d7",
        "#676767",
        "#c7c7c7",
        "#e9e9e9"
      ],
      "tags": [
        "categorical"
      ]
    },
    "bukavu": {
      "2": [
        "#193333",
        "#eeedfd"
      ],
      "3": [
        "#193333",
        "#004026",
        "#eeedfd"
      ],
      "4": [
        "#193333",
        "#66b5cb",
        "#697328",
        "#eeedfd"
      ],
      "5": [
        "#193333",
        "#3f92c8",
        "#004026",
        "#9c7e43",
        "#eeedfd"
      ],
      "6": [
        "#193333",
        "#2e7ab6",
        "#8bd1cf",
        "#326412",
        "#b68f60",
        "#eeedfd"
      ],
      "7": [
        "#193333",
        "#2969a1",
        "#66b5cb",
        "#004026",
        "#697328",
        "#c3a37c",
        "#eeedfd"
      ],
      "8": [
        "#193333",
        "#255e92",
        "#50a1c9",
        "#a4dfd5",
        "#1c5914",
        "#867836",
        "#cab08f",
        "#eeedfd"
      ],
      "9": [
        "#193333",
        "#235786",
        "#3f92c8",
        "#7ac7cc",
        "#004026",
        "#4b6d1a",
        "#9c7e43",
        "#d0bca0",
        "#eeedfd"
      ],
      "10": [
        "#193333",
        "#215078",
        "#3283c1",
        "#66b5cb",
        "#b3e6d9",
        "#135317",
        "#697328",
        "#ac8652",
        "#d3c2aa",
        "#eeedfd"
      ],
      "11": [
        "#193333",
        "#204c6e",
        "#2e7ab6",
        "#56a6ca",
        "#8bd1cf",
        "#004026",
        "#326412",
        "#7f7733",
        "#b68f60",
        "#d6c8b4",
        "#eeedfd"
      ],
      "12": [
        "#193333",
        "#1f4968",
        "#2b71ab",
        "#489bc9",
        "#74c2cc",
        "#beebdc",
        "#0d4e1b",
        "#516e1c",
        "#8f7a3b",
        "#be9a6f",
        "#d8ccbb",
        "#eeedfd"
      ],
      "tags": [
        "multi-sequential"
      ]
    },
    "fes": {
      "2": [
        "#0c0c0c",
        "#ededfc"
      ],
      "3": [
        "#0c0c0c",
        "#024026",
        "#ededfc"
      ],
      "4": [
        "#0c0c0c",
        "#979797",
        "#75642a",
        "#ededfc"
      ],
      "5": [
        "#0c0c0c",
        "#777777",
        "#024026",
        "#ab773d",
        "#ededfc"
      ],
      "6": [
        "#0c0c0c",
        "#646464",
        "#b7b7b7",
        "#4d5923",
        "#be905f",
        "#ededfc"
      ],
      "7": [
        "#0c0c0c",
        "#565656",
        "#979797",
        "#024026",
        "#75642a",
        "#c7a47c",
        "#ededfc"
      ],
      "8": [
        "#0c0c0c",
        "#4d4d4d",
        "#848484",
        "#c6c6c6",
        "#395420",
        "#926b30",
        "#ccb18f",
        "#ededfc"
      ],
      "9": [
        "#0c0c0c",
        "#464646",
        "#777777",
        "#ababab",
        "#024026",
        "#5e5e26",
        "#ab773d",
        "#d1bca0",
        "#ededfc"
      ],
      "10": [
        "#0c0c0c",
        "#3f3f3f",
        "#6b6b6b",
        "#979797",
        "#cfcfcf",
        "#2d501f",
        "#75642a",
        "#b88550",
        "#d4c3aa",
        "#ededfc"
      ],
      "11": [
        "#0c0c0c",
        "#3a3a3a",
        "#646464",
        "#888888",
        "#b7b7b7",
        "#024026",
        "#4d5923",
        "#8b692e",
        "#be905f",
        "#d7c9b4",
        "#ededfc"
      ],
      "12": [
        "#0c0c0c",
        "#373737",
        "#5c5c5c",
        "#7e7e7e",
        "#a5a5a5",
        "#d6d6d6",
        "#244c20",
        "#635f27",
        "#9c6f34",
        "#c39b6f",
        "#d9ccba",
        "#ededfc"
      ],
      "tags": [
        "multi-sequential"
      ]
    },
    "romaO": {
      "2": [
        "#733957",
        "#723959"
      ],
      "3": [
        "#733957",
        "#cbe2b3",
        "#723959"
      ],
      "4": [
        "#733957",
        "#c3a34b",
        "#74bbce",
        "#723959"
      ],
      "5": [
        "#733957",
        "#aa752f",
        "#cbe2b3",
        "#5393bf",
        "#723959"
      ],
      "6": [
        "#733957",
        "#9c5d2b",
        "#d3c876",
        "#9bd4ce",
        "#4e7cb2",
        "#723959"
      ],
      "7": [
        "#733957",
        "#944f2d",
        "#c3a34b",
        "#cbe2b3",
        "#74bbce",
        "#516ba5",
        "#723959"
      ],
      "8": [
        "#733957",
        "#8e4830",
        "#b58837",
        "#d6d389",
        "#abdbca",
        "#5ea6c8",
        "#55609a",
        "#723959"
      ],
      "9": [
        "#733957",
        "#8b4433",
        "#aa752f",
        "#cfbc66",
        "#cbe2b3",
        "#8bcbcf",
        "#5393bf",
        "#595891",
        "#723959"
      ],
      "10": [
        "#733957",
        "#874036",
        "#a2662b",
        "#c3a34b",
        "#d6d893",
        "#b4dec6",
        "#74bbce",
        "#4f86b8",
        "#5b538b",
        "#723959"
      ],
      "11": [
        "#733957",
        "#853e39",
        "#9c5d2b",
        "#b88f3b",
        "#d3c876",
        "#cbe2b3",
        "#9bd4ce",
        "#63abc9",
        "#4e7cb2",
        "#5e4e85",
        "#723959"
      ],
      "12": [
        "#733957",
        "#843d3b",
        "#97552c",
        "#b07f33",
        "#ccb65e",
        "#d5db9a",
        "#bae0c3",
        "#86c8cf",
        "#599ec5",
        "#4f73ab",
        "#604c81",
        "#723959"
      ],
      "tags": [
        "cyclic"
      ]
    },
    "nuuk": {
      "2": [
        "#04598c",
        "#ffffb2"
      ],
      "3": [
        "#04598c",
        "#a1a698",
        "#ffffb2"
      ],
      "4": [
        "#04598c",
        "#6f878d",
        "#baba8d",
        "#ffffb2"
      ],
      "5": [
        "#04598c",
        "#537785",
        "#a1a698",
        "#c4c385",
        "#ffffb2"
      ],
      "6": [
        "#04598c",
        "#436e82",
        "#859494",
        "#b2b393",
        "#cbca83",
        "#ffffb2"
      ],
      "7": [
        "#04598c",
        "#386982",
        "#6f878d",
        "#a1a698",
        "#baba8d",
        "#d2d284",
        "#ffffb2"
      ],
      "8": [
        "#04598c",
        "#316682",
        "#5f7d88",
        "#8d9996",
        "#aeaf95",
        "#bfbf88",
        "#d8d787",
        "#ffffb2"
      ],
      "9": [
        "#04598c",
        "#2d6483",
        "#537785",
        "#7d8f91",
        "#a1a698",
        "#b5b691",
        "#c4c385",
        "#dddd8b",
        "#ffffb2"
      ],
      "10": [
        "#04598c",
        "#296284",
        "#497183",
        "#6f878d",
        "#929c97",
        "#acad96",
        "#baba8d",
        "#c7c784",
        "#e1e08e",
        "#ffffb2"
      ],
      "11": [
        "#04598c",
        "#266184",
        "#436e82",
        "#638089",
        "#859494",
        "#a1a698",
        "#b2b393",
        "#bebd8a",
        "#cbca83",
        "#e4e491",
        "#ffffb2"
      ],
      "12": [
        "#04598c",
        "#236085",
        "#3d6b82",
        "#5a7a87",
        "#798d90",
        "#959e97",
        "#aaac97",
        "#b6b690",
        "#c1c087",
        "#cece83",
        "#e6e693",
        "#ffffb2"
      ],
      "tags": [
        "sequential"
      ]
    },
    "nuukS": {
      "2": [
        "#04598c",
        "#ffffb2"
      ],
      "3": [
        "#04598c",
        "#ffffb2",
        "#a1a698"
      ],
      "4": [
        "#04598c",
        "#ffffb2",
        "#a1a698",
        "#537785"
      ],
      "5": [
        "#04598c",
        "#ffffb2",
        "#a1a698",
        "#537785",
        "#c3c385"
      ],
      "6": [
        "#04598c",
        "#ffffb2",
        "#a1a698",
        "#537785",
        "#c3c385",
        "#2d6483"
      ],
      "7": [
        "#04598c",
        "#ffffb2",
        "#a1a698",
        "#537785",
        "#c3c385",
        "#2d6483",
        "#dcdc8a"
      ],
      "8": [
        "#04598c",
        "#ffffb2",
        "#a1a698",
        "#537785",
        "#c3c385",
        "#2d6483",
        "#dcdc8a",
        "#7d8f91"
      ],
      "9": [
        "#04598c",
        "#ffffb2",
        "#a1a698",
        "#537785",
        "#c3c385",
        "#2d6483",
        "#dcdc8a",
        "#7d8f91",
        "#b5b591"
      ],
      "10": [
        "#04598c",
        "#ffffb2",
        "#a1a698",
        "#537785",
        "#c3c385",
        "#2d6483",
        "#dcdc8a",
        "#7d8f91",
        "#b5b591",
        "#eeee9c"
      ],
      "11": [
        "#04598c",
        "#ffffb2",
        "#a1a698",
        "#537785",
        "#c3c385",
        "#2d6483",
        "#dcdc8a",
        "#7d8f91",
        "#b5b591",
        "#eeee9c",
        "#bcbc8b"
      ],
      "12": [
        "#04598c",
        "#ffffb2",
        "#a1a698",
        "#537785",
        "#c3c385",
        "#2d6483",
        "#dcdc8a",
        "#7d8f91",
        "#b5b591",
        "#eeee9c",
        "#bcbc8b",
        "#68838b"
      ],
      "tags": [
        "categorical"
      ]
    },
    "brocO": {
      "2": [
        "#362f37",
        "#372f36"
      ],
      "3": [
        "#362f37",
        "#cfd4c5",
        "#372f36"
      ],
      "4": [
        "#362f37",
        "#8aa4bf",
        "#9f9e6c",
        "#372f36"
      ],
      "5": [
        "#362f37",
        "#617fa5",
        "#cfd4c5",
        "#757445",
        "#372f36"
      ],
      "6": [
        "#362f37",
        "#4c6791",
        "#adbfce",
        "#bdbd92",
        "#615f35",
        "#372f36"
      ],
      "7": [
        "#362f37",
        "#415780",
        "#8aa4bf",
        "#cfd4c5",
        "#9f9e6c",
        "#53512d",
        "#372f36"
      ],
      "8": [
        "#362f37",
        "#3c4d75",
        "#728fb1",
        "#bac8d0",
        "#c6c7a2",
        "#888755",
        "#4c482a",
        "#372f36"
      ],
      "9": [
        "#362f37",
        "#3a476c",
        "#617fa5",
        "#a1b6ca",
        "#cfd4c5",
        "#b1b182",
        "#757445",
        "#474229",
        "#372f36"
      ],
      "10": [
        "#362f37",
        "#384164",
        "#537099",
        "#8aa4bf",
        "#c1ccd0",
        "#cbcbab",
        "#9f9e6c",
        "#69683b",
        "#443f28",
        "#372f36"
      ],
      "11": [
        "#362f37",
        "#373d5e",
        "#4c6791",
        "#7894b5",
        "#adbfce",
        "#cfd4c5",
        "#bdbd92",
        "#8d8d5a",
        "#615f35",
        "#413c28",
        "#372f36"
      ],
      "12": [
        "#362f37",
        "#363b5a",
        "#455e88",
        "#6a88ac",
        "#9bb1c7",
        "#c5cfd0",
        "#cdceb1",
        "#adad7d",
        "#807f4e",
        "#595731",
        "#403a29",
        "#372f36"
      ],
      "tags": [
        "cyclic"
      ]
    },
    "vikO": {
      "2": [
        "#4f193d",
        "#50193b"
      ],
      "3": [
        "#4f193d",
        "#d5bfb3",
        "#50193b"
      ],
      "4": [
        "#4f193d",
        "#759ebc",
        "#c57b56",
        "#50193b"
      ],
      "5": [
        "#4f193d",
        "#4575a1",
        "#d5bfb3",
        "#a14b2b",
        "#50193b"
      ],
      "6": [
        "#4f193d",
        "#355c8d",
        "#a4b9c8",
        "#d59c7d",
        "#8a3320",
        "#50193b"
      ],
      "7": [
        "#4f193d",
        "#334b7f",
        "#759ebc",
        "#d5bfb3",
        "#c57b56",
        "#7a251e",
        "#50193b"
      ],
      "8": [
        "#4f193d",
        "#354174",
        "#5787ad",
        "#b5c0c8",
        "#d9a88e",
        "#b3613c",
        "#711e1f",
        "#50193b"
      ],
      "9": [
        "#4f193d",
        "#373a6e",
        "#4575a1",
        "#93b1c6",
        "#d5bfb3",
        "#d08f6d",
        "#a14b2b",
        "#6b1a21",
        "#50193b"
      ],
      "10": [
        "#4f193d",
        "#3a3467",
        "#396595",
        "#759ebc",
        "#bec2c6",
        "#daae97",
        "#c57b56",
        "#933c23",
        "#681822",
        "#50193b"
      ],
      "11": [
        "#4f193d",
        "#3c3061",
        "#355c8d",
        "#5e8db1",
        "#a4b9c8",
        "#d5bfb3",
        "#d59c7d",
        "#b86842",
        "#8a3320",
        "#641724",
        "#50193b"
      ],
      "12": [
        "#4f193d",
        "#3e2e5e",
        "#335285",
        "#4e7fa8",
        "#8bacc4",
        "#c4c3c3",
        "#dab29d",
        "#ce8c68",
        "#ac5835",
        "#812b1e",
        "#621626",
        "#50193b"
      ],
      "tags": [
        "cyclic"
      ]
    },
    "lapaz": {
      "2": [
        "#1a0c64",
        "#fff3f3"
      ],
      "3": [
        "#1a0c64",
        "#5c8ca3",
        "#fff3f3"
      ],
      "4": [
        "#1a0c64",
        "#36679d",
        "#94a398",
        "#fff3f3"
      ],
      "5": [
        "#1a0c64",
        "#2c5293",
        "#5c8ca3",
        "#b5ad96",
        "#fff3f3"
      ],
      "6": [
        "#1a0c64",
        "#28458b",
        "#4177a2",
        "#7c9b9e",
        "#cbb79d",
        "#fff3f3"
      ],
      "7": [
        "#1a0c64",
        "#263c85",
        "#36679d",
        "#5c8ca3",
        "#94a398",
        "#dbc1a9",
        "#fff3f3"
      ],
      "8": [
        "#1a0c64",
        "#243681",
        "#305b98",
        "#477da3",
        "#7398a0",
        "#a5a795",
        "#e4c9b2",
        "#fff3f3"
      ],
      "9": [
        "#1a0c64",
        "#23317e",
        "#2c5293",
        "#3d71a0",
        "#5c8ca3",
        "#869f9b",
        "#b5ad96",
        "#ebcfbb",
        "#fff3f3"
      ],
      "10": [
        "#1a0c64",
        "#222d7b",
        "#2a4a8e",
        "#36679d",
        "#4b80a3",
        "#6e96a1",
        "#94a398",
        "#c1b299",
        "#efd3c0",
        "#fff3f3"
      ],
      "11": [
        "#1a0c64",
        "#222a79",
        "#28458b",
        "#315e99",
        "#4177a2",
        "#5c8ca3",
        "#7c9b9e",
        "#a1a696",
        "#cbb79d",
        "#f2d7c6",
        "#fff3f3"
      ],
      "12": [
        "#1a0c64",
        "#212877",
        "#274088",
        "#2e5796",
        "#3b6fa0",
        "#4e83a4",
        "#6a94a2",
        "#899f9b",
        "#aba995",
        "#d4bca3",
        "#f4d9ca",
        "#fff3f3"
      ],
      "tags": [
        "sequential"
      ]
    },
    "lapazS": {
      "2": [
        "#1a0c64",
        "#fff3f3"
      ],
      "3": [
        "#1a0c64",
        "#fff3f3",
        "#5c8ca3"
      ],
      "4": [
        "#1a0c64",
        "#fff3f3",
        "#5c8ca3",
        "#2c5293"
      ],
      "5": [
        "#1a0c64",
        "#fff3f3",
        "#5c8ca3",
        "#2c5293",
        "#b5ad96"
      ],
      "6": [
        "#1a0c64",
        "#fff3f3",
        "#5c8ca3",
        "#2c5293",
        "#b5ad96",
        "#3d71a0"
      ],
      "7": [
        "#1a0c64",
        "#fff3f3",
        "#5c8ca3",
        "#2c5293",
        "#b5ad96",
        "#3d71a0",
        "#23317e"
      ],
      "8": [
        "#1a0c64",
        "#fff3f3",
        "#5c8ca3",
        "#2c5293",
        "#b5ad96",
        "#3d71a0",
        "#23317e",
        "#869f9b"
      ],
      "9": [
        "#1a0c64",
        "#fff3f3",
        "#5c8ca3",
        "#2c5293",
        "#b5ad96",
        "#3d71a0",
        "#23317e",
        "#869f9b",
        "#ebcfbb"
      ],
      "10": [
        "#1a0c64",
        "#fff3f3",
        "#5c8ca3",
        "#2c5293",
        "#b5ad96",
        "#3d71a0",
        "#23317e",
        "#869f9b",
        "#ebcfbb",
        "#d2bba2"
      ],
      "11": [
        "#1a0c64",
        "#fff3f3",
        "#5c8ca3",
        "#2c5293",
        "#b5ad96",
        "#3d71a0",
        "#23317e",
        "#869f9b",
        "#ebcfbb",
        "#d2bba2",
        "#7097a0"
      ],
      "12": [
        "#1a0c64",
        "#fff3f3",
        "#5c8ca3",
        "#2c5293",
        "#b5ad96",
        "#3d71a0",
        "#23317e",
        "#869f9b",
        "#ebcfbb",
        "#d2bba2",
        "#7097a0",
        "#33629b"
      ],
      "tags": [
        "categorical"
      ]
    },
    "broc": {
      "2": [
        "#2b194c",
        "#262600"
      ],
      "3": [
        "#2b194c",
        "#ecefec",
        "#262600"
      ],
      "4": [
        "#2b194c",
        "#8ba7c2",
        "#c5c58f",
        "#262600"
      ],
      "5": [
        "#2b194c",
        "#5b82a9",
        "#ecefec",
        "#999960",
        "#262600"
      ],
      "6": [
        "#2b194c",
        "#3f6b99",
        "#b3c6d8",
        "#dcdcb8",
        "#81814c",
        "#262600"
      ],
      "7": [
        "#2b194c",
        "#305c8c",
        "#8ba7c2",
        "#ecefec",
        "#c5c58f",
        "#70703d",
        "#262600"
      ],
      "8": [
        "#2b194c",
        "#2a5183",
        "#6f92b4",
        "#c4d3e0",
        "#e4e4c9",
        "#aeae73",
        "#646433",
        "#262600"
      ],
      "9": [
        "#2b194c",
        "#284a7d",
        "#5b82a9",
        "#a5bbd0",
        "#ecefec",
        "#d3d3a7",
        "#999960",
        "#5b5b2c",
        "#262600"
      ],
      "10": [
        "#2b194c",
        "#284477",
        "#49749f",
        "#8ba7c2",
        "#cedae5",
        "#e8e8d2",
        "#c5c58f",
        "#8b8b54",
        "#555527",
        "#262600"
      ],
      "11": [
        "#2b194c",
        "#283f72",
        "#3f6b99",
        "#7697b7",
        "#b3c6d8",
        "#ecefec",
        "#dcdcb8",
        "#b4b479",
        "#81814c",
        "#505023",
        "#262600"
      ],
      "12": [
        "#2b194c",
        "#283c6f",
        "#356392",
        "#668baf",
        "#9eb5cc",
        "#d5dfe8",
        "#ebecd9",
        "#d1d1a2",
        "#a6a66b",
        "#777743",
        "#4c4c20",
        "#262600"
      ],
      "tags": [
        "diverging"
      ]
    },
    "osloS": {
      "2": [
        "#030509",
        "#f9f9fa"
      ],
      "3": [
        "#030509",
        "#f9f9fa",
        "#4e79bb"
      ],
      "4": [
        "#030509",
        "#f9f9fa",
        "#4e79bb",
        "#9fafca"
      ],
      "5": [
        "#030509",
        "#f9f9fa",
        "#4e79bb",
        "#9fafca",
        "#15395c"
      ],
      "6": [
        "#030509",
        "#f9f9fa",
        "#4e79bb",
        "#9fafca",
        "#15395c",
        "#7a98ca"
      ],
      "7": [
        "#030509",
        "#f9f9fa",
        "#4e79bb",
        "#9fafca",
        "#15395c",
        "#7a98ca",
        "#c9cdd5"
      ],
      "8": [
        "#030509",
        "#f9f9fa",
        "#4e79bb",
        "#9fafca",
        "#15395c",
        "#7a98ca",
        "#c9cdd5",
        "#26578c"
      ],
      "9": [
        "#030509",
        "#f9f9fa",
        "#4e79bb",
        "#9fafca",
        "#15395c",
        "#7a98ca",
        "#c9cdd5",
        "#26578c",
        "#0e1f30"
      ],
      "10": [
        "#030509",
        "#f9f9fa",
        "#4e79bb",
        "#9fafca",
        "#15395c",
        "#7a98ca",
        "#c9cdd5",
        "#26578c",
        "#0e1f30",
        "#658ac7"
      ],
      "11": [
        "#030509",
        "#f9f9fa",
        "#4e79bb",
        "#9fafca",
        "#15395c",
        "#7a98ca",
        "#c9cdd5",
        "#26578c",
        "#0e1f30",
        "#658ac7",
        "#e0e2e4"
      ],
      "12": [
        "#030509",
        "#f9f9fa",
        "#4e79bb",
        "#9fafca",
        "#15395c",
        "#7a98ca",
        "#c9cdd5",
        "#26578c",
        "#0e1f30",
        "#658ac7",
        "#e0e2e4",
        "#3566a5"
      ],
      "tags": [
        "categorical"
      ]
    },
    "oslo": {
      "2": [
        "#000100",
        "#ffffff"
      ],
      "3": [
        "#000100",
        "#4f7bbd",
        "#ffffff"
      ],
      "4": [
        "#000100",
        "#1f4c7b",
        "#89a1ca",
        "#ffffff"
      ],
      "5": [
        "#000100",
        "#15385b",
        "#4f7bbd",
        "#a3b1ca",
        "#ffffff"
      ],
      "6": [
        "#000100",
        "#112d48",
        "#2b5d96",
        "#7494ca",
        "#b2bccc",
        "#ffffff"
      ],
      "7": [
        "#000100",
        "#0f253b",
        "#1f4c7b",
        "#4f7bbd",
        "#89a1ca",
        "#bfc5d0",
        "#ffffff"
      ],
      "8": [
        "#000100",
        "#0e2033",
        "#194169",
        "#3364a1",
        "#6b8ec8",
        "#97a9ca",
        "#c8ccd4",
        "#ffffff"
      ],
      "9": [
        "#000100",
        "#0d1d2e",
        "#15385b",
        "#26578c",
        "#4f7bbd",
        "#7d99ca",
        "#a3b1ca",
        "#cfd2d8",
        "#ffffff"
      ],
      "10": [
        "#000100",
        "#0d1a29",
        "#13314f",
        "#1f4c7b",
        "#3868a8",
        "#658ac7",
        "#89a1ca",
        "#acb7cb",
        "#d4d6db",
        "#ffffff"
      ],
      "11": [
        "#000100",
        "#0d1825",
        "#112d48",
        "#1a446d",
        "#2b5d96",
        "#4f7bbd",
        "#7494ca",
        "#93a7ca",
        "#b2bccc",
        "#d9dbde",
        "#ffffff"
      ],
      "12": [
        "#000100",
        "#0c1722",
        "#102841",
        "#173d62",
        "#245488",
        "#3c6cac",
        "#6187c6",
        "#7f9bca",
        "#9cadca",
        "#b9c1ce",
        "#dcdde0",
        "#ffffff"
      ],
      "tags": [
        "sequential"
      ]
    },
    "batlowK": {
      "2": [
        "#020305",
        "#fbccfb"
      ],
      "3": [
        "#020305",
        "#908032",
        "#fbccfb"
      ],
      "4": [
        "#020305",
        "#536549",
        "#db9752",
        "#fbccfb"
      ],
      "5": [
        "#020305",
        "#3c5851",
        "#908032",
        "#f4a27d",
        "#fbccfb"
      ],
      "6": [
        "#020305",
        "#2d4c50",
        "#686f3f",
        "#bf8f3b",
        "#fbaa95",
        "#fbccfb"
      ],
      "7": [
        "#020305",
        "#234149",
        "#536549",
        "#908032",
        "#db9752",
        "#fdb0a7",
        "#fbccfb"
      ],
      "8": [
        "#020305",
        "#1d3942",
        "#455e4f",
        "#72733b",
        "#b28b36",
        "#eb9d68",
        "#fdb4b3",
        "#fbccfb"
      ],
      "9": [
        "#020305",
        "#1a333c",
        "#3c5851",
        "#606b42",
        "#908032",
        "#cb9243",
        "#f4a27d",
        "#feb7bc",
        "#fbccfb"
      ],
      "10": [
        "#020305",
        "#172d36",
        "#335151",
        "#536549",
        "#787638",
        "#aa8933",
        "#db9752",
        "#f8a78b",
        "#feb9c2",
        "#fbccfb"
      ],
      "11": [
        "#020305",
        "#152931",
        "#2d4c50",
        "#495f4d",
        "#686f3f",
        "#908032",
        "#bf8f3b",
        "#e79b63",
        "#fbaa95",
        "#febbc8",
        "#fbccfb"
      ],
      "12": [
        "#020305",
        "#14262e",
        "#27464d",
        "#415b50",
        "#5c6944",
        "#7c7837",
        "#a48732",
        "#ce9346",
        "#ef9f70",
        "#fcad9f",
        "#fdbccc",
        "#fbccfb"
      ],
      "tags": [
        "sequential"
      ]
    },
    "lajolla": {
      "2": [
        "#ffffcc",
        "#191900"
      ],
      "3": [
        "#ffffcc",
        "#de744f",
        "#191900"
      ],
      "4": [
        "#ffffcc",
        "#eca854",
        "#a54742",
        "#191900"
      ],
      "5": [
        "#ffffcc",
        "#f2c35f",
        "#de744f",
        "#7d3b33",
        "#191900"
      ],
      "6": [
        "#ffffcc",
        "#f6d570",
        "#e89452",
        "#c25549",
        "#68342a",
        "#191900"
      ],
      "7": [
        "#ffffcc",
        "#f9df80",
        "#eca854",
        "#de744f",
        "#a54742",
        "#592f22",
        "#191900"
      ],
      "8": [
        "#ffffcc",
        "#fae68b",
        "#efb759",
        "#e68c51",
        "#cd5d4b",
        "#8f403b",
        "#4f2c1e",
        "#191900"
      ],
      "9": [
        "#ffffcc",
        "#fbe992",
        "#f2c35f",
        "#e99b53",
        "#de744f",
        "#b74e47",
        "#7d3b33",
        "#47291a",
        "#191900"
      ],
      "10": [
        "#ffffcc",
        "#fcec9a",
        "#f5ce69",
        "#eca854",
        "#e58751",
        "#d2624c",
        "#a54742",
        "#71372e",
        "#422818",
        "#191900"
      ],
      "11": [
        "#ffffcc",
        "#fcef9f",
        "#f6d570",
        "#efb357",
        "#e89452",
        "#de744f",
        "#c25549",
        "#95413d",
        "#68342a",
        "#3d2616",
        "#191900"
      ],
      "12": [
        "#ffffcc",
        "#fdf0a3",
        "#f8db79",
        "#f1bc5b",
        "#ea9e53",
        "#e48350",
        "#d5664d",
        "#b34c46",
        "#883e38",
        "#603226",
        "#3a2514",
        "#191900"
      ],
      "tags": [
        "sequential"
      ]
    },
    "lajollaS": {
      "2": [
        "#ffffcc",
        "#191900"
      ],
      "3": [
        "#ffffcc",
        "#191900",
        "#df754f"
      ],
      "4": [
        "#ffffcc",
        "#191900",
        "#df754f",
        "#7f3b34"
      ],
      "5": [
        "#ffffcc",
        "#191900",
        "#df754f",
        "#7f3b34",
        "#f2c35f"
      ],
      "6": [
        "#ffffcc",
        "#191900",
        "#df754f",
        "#7f3b34",
        "#f2c35f",
        "#482a1b"
      ],
      "7": [
        "#ffffcc",
        "#191900",
        "#df754f",
        "#7f3b34",
        "#f2c35f",
        "#482a1b",
        "#b84f47"
      ],
      "8": [
        "#ffffcc",
        "#191900",
        "#df754f",
        "#7f3b34",
        "#f2c35f",
        "#482a1b",
        "#b84f47",
        "#fbe992"
      ],
      "9": [
        "#ffffcc",
        "#191900",
        "#df754f",
        "#7f3b34",
        "#f2c35f",
        "#482a1b",
        "#b84f47",
        "#fbe992",
        "#e99b53"
      ],
      "10": [
        "#ffffcc",
        "#191900",
        "#df754f",
        "#7f3b34",
        "#f2c35f",
        "#482a1b",
        "#b84f47",
        "#fbe992",
        "#e99b53",
        "#633327"
      ],
      "11": [
        "#ffffcc",
        "#191900",
        "#df754f",
        "#7f3b34",
        "#f2c35f",
        "#482a1b",
        "#b84f47",
        "#fbe992",
        "#e99b53",
        "#633327",
        "#fef5b0"
      ],
      "12": [
        "#ffffcc",
        "#191900",
        "#df754f",
        "#7f3b34",
        "#f2c35f",
        "#482a1b",
        "#b84f47",
        "#fbe992",
        "#e99b53",
        "#633327",
        "#fef5b0",
        "#2f220f"
      ],
      "tags": [
        "categorical"
      ]
    }
  }


},{"./config.js":4,"chroma-js":1}],4:[function(require,module,exports){
module.exports = {
    speed: 5,
    width: 161,
    scale: 400/161,
    numParasites: 60,
    fadeSpeed: 0.01, // higher is faster
    colors: {
        // speciesColorMap: {
 //            type: 'd3',
 //            id: 'interpolateRainbow'
 //        },
        speciesColorMap: {
            type: 'crameri',
            id: 'romaO'
        },
        parasite: 'black',
        // empty:  "#dfceaa"
        empty: 'rgb(240, 240, 240)'
    },
    controlbox: {
        width: 400,
        height: 400,
        gridX: 12,
        gridY: 12,
        margin: 10
    }
}

},{}],5:[function(require,module,exports){
const createDiagram = require('./diagram.js')

const sliders = {
    decay: { id: "decay-slider", default: 0.075, range: [0, .1] },
    replication: { id: "replication-slider", default: 0.3, range: [0, 1] },
    catalyticSupport: { id: "catalytic-support-slider", name: "catalytic support", range: [0, 100], default: 50 },
    speed: {id: "speed-slider", name: "speed", range: [0, 1], default: .8},
    // diffusion: { id: 'diffusion-probability-slider', name: "diffusion probability", range: [0, 1], default: 0.4 },
    diffusionSteps: { id: 'diffusion-steps-slider', name: "diffusion", range: [0, 1], default: 0.33 },
    initialDensity: { id: 'density-slider', name: 'initial density', range: [0.005, 0.7], default: 0.6, value: 0.6}
}

const visibleSliders = [ 'decay', 'replication', 'catalyticSupport', 'diffusionSteps','speed' ]

module.exports = ({ reset, runpause, render, addRandomParasites, addParasitesToCenter } = {}, { width, scale }) => {
    const controlbox_width = 400,
        // controlbox_height = width * scale,
        controlbox_height = 400,
        n_grid_x = 12,
        n_grid_y = 14,
        margin = 10;

    const controls = d3.select("#cxpbox_hypercycles_controls").append("svg")
        .attr("width", controlbox_width)
        .attr("height", controlbox_height)
        .attr("class", "explorable_widgets")

    const g = widget.grid(controlbox_width, controlbox_height, n_grid_x, n_grid_y);



    // diagram.draw({ parent: controls, x: 200, y: 330})

    // old layout
    // const buttonblock = g.block({ x0: 1, y0: 8.5, width: 2, height: 0 }).Nx(2);
    // const sliderblock = g.block({ x0: 0.5, y0: 1, width: 5, height: 3 }).Ny(3);
    // const switchblock = g.block({ x0: 6.5, y0: 8.5, width: 3, height: 3.5 }).Ny(3);
    // const radioblock = g.block({x0:8,y0:0.5,width:0,height:6});
    const playblock = g.block({ x0: 1.75, y0: 11.5, width: 0, height: 0 });
    const buttonblock = g.block({ x0: 0.75, y0: 8.5, width: 2, height: 0 }).Nx(2);
    const sliderblock = g.block({ x0: 6, y0: 5.5, width: 5.25, height: 5 }).Ny(4);
    const triggerblock = g.block({ x0: 1.75, y0: 3, width: 3, height: 4.5 }).Ny(3);
    const switchblock = g.block({ x0: 1.5, y0: 1.5, width: 3, height: 2.5 }).Ny(2);
    const radioblock = g.block({x0:9.5,y0:0,width:0,height:3.5}).Ny(2);

    const diagramParams = { parent: controls, x: 200, y: 330}

    const diagram = createDiagram(diagramParams)


    // buttons
    const playpause = { id: "b1", name: "", actions: ["play", "pause"], value: 0 };

    const playbutton = [
        widget.button(playpause).size(g.x(3)).symbolSize(0.6 * g.x(3)).update(runpause)
    ]

    const buttons = [
        widget.button({ id: "b2", name: "", actions: ["back"], value: 0 }).update(() => { reset(radioData[radioOptions.value].val)}),
        widget.button({ id: "b3", name: "", actions: ["rewind"], value: 0 }).update(resetControls),
    ]

    const parasiteButton = [
        // widget.button({ id: "b5", name: "add parasites to center", actions: ["record"], value: 0 }).label("right").update(addParasitesToCenter),
        widget.button({ id: "b4", name: "add parasites", actions: ["record"], value: 0 }).label("bottom").update(addRandomParasites).size(80).symbolSize(50)
    ]

    const toggles = [
        widget.toggle({ id: "t1", name: "smooth", value: false }).update(render).label("bottom").size(10)
    ]

    const radioData =  [3, 6, 9].map((v) => ({label: `${v} species`, val: v}))
    const radioOptions = { id: "c1", name: "Select number of species", choices: radioData.map((v) => v.label), value: 2}

    const radios = [
        widget.radio(radioOptions).size(radioblock.h()).label("right").shape("rect").update((e) => {
            reset(radioData[radioOptions.value].val)
            // console.log('radio updated', e.value, radioOptions.value)
        })
    ]

    const sliderwidth = sliderblock.w(),
        handleSize = 12,
        trackSize = 8;

    // Object.entries(sliders).forEach(([name, slider]) => {

    visibleSliders.forEach((name) => {
        const slider = sliders[name]
        console.log(name, slider)
        !('name' in slider) && (slider.name = name)
        slider.value = slider.default
        slider.el = widget.slider(slider).width(sliderwidth).trackSize(trackSize).handleSize(handleSize)
    })

    function resetControls() {
        visibleSliders.forEach((name) =>  {
            slider = sliders[name]
            slider.el.click(slider.default)
        })
    }

    const pb = controls.selectAll(".button .playbutton").data(playbutton).enter().append(widget.buttonElement).attr("transform", function (d, i) { return "translate(" + playblock.x(0) + "," + playblock.y(i) + ")" });

    const bu = controls.selectAll(".button .others").data(buttons).enter().append(widget.buttonElement).attr("transform", function (d, i) {
        return "translate(" + buttonblock.x(i) + "," + buttonblock.y(0) + ")"
    });

    const bu1 = controls.selectAll(".button .others1").data(parasiteButton).enter().append(widget.buttonElement).attr("transform", function (d, i) {
        return "translate(" + triggerblock.x(0) + "," + triggerblock.y(i + 1) + ")"
    });

    const spsl = controls.selectAll(".slider").data(visibleSliders.map((name) => sliders[name]).map((s) => s.el).reverse()).enter().append(widget.sliderElement)
        .attr("transform", function (d, i) {
            return "translate(" + sliderblock.x(0) + "," + sliderblock.y(i) + ")"
        })

    const tg = controls.selectAll(".toggle").data(toggles).enter().append(widget.toggleElement)
        .attr("transform", function (d, i) { return "translate(" + switchblock.x(0) + "," + switchblock.y(0) + ")" });

        var rad = controls.selectAll(".radio .input").data(radios).enter().append(widget.radioElement)
        .attr("transform",function(d,i){return "translate("+radioblock.x(0)+","+radioblock.y(0)+")"});	
    return {
        sliders: sliders,
        buttons: buttons,
        toggles: toggles,
        updateDiagram: (SPECIES) => { diagram.draw(SPECIES) },
        updateDiagramOpacity: diagram.updateOpacity
    }
}
},{"./diagram.js":6}],6:[function(require,module,exports){
var world_width = 400
var world_height = 400

module.exports = ({ parent, x, y }) => {
    var origin = parent.append("g")
        .attr("class", "diagram")
        .attr("transform", "translate(" + x + "," + y + ")");
    // var origin = display
    let layer0, defector, defectorlink, defectorlinkhead, layer1

    const draw = (species) => {
        const speciesWithoutParasite = species.filter((s) => Object.keys(s.catalyticSupport).length > 0)
        origin.selectAll("*").remove()

        var L = 1
        var N = speciesWithoutParasite.length
        var R = 0.2
        var Q = N < 5 ? 0.4 : 0.65
        var phi = 1.4
        var knobsize = 4;

        var X = d3.scaleLinear().domain([-L, L]).range([-world_width / 2, world_width / 2]);
        var Y = d3.scaleLinear().domain([-L, L]).range([-world_height / 2, world_height / 2]);
        var line = d3.line().x(function (d) { return X(d.x); }).y(function (d) { return Y(d.y); });

        function z() {
            return R * (Math.cos(Q * Math.PI / N))
        }

        function noderadius() {
            return R * Math.sin(Q * Math.PI / N)
        }

        function A() {
            return R * Math.sin(Q * Math.PI / N) * Math.tan(phi / 2)
        }

        function D() {
            return Math.sqrt(R * Math.sin(Q * Math.PI / N) * R * Math.sin(Q * Math.PI / N) + A() * A())
        }

        var alpha = d3.range(Q * Math.PI / N, Math.PI / N * (2 - Q), (1 - Q) * 2 * Math.PI / N / 100);
        var beta = d3.range(-(Math.PI + phi) / 2, +(Math.PI + phi) / 2, (Math.PI + phi) / 200);
        var circ = alpha.map(function (a) { return { x: -R + z() * Math.cos(a), y: z() * Math.sin(a) } })
        var kopp = beta.map(function (b) { return { x: D() + A() * Math.cos(b), y: A() * Math.sin(b) } })

        var nodes = d3.range(N);

        var linkSource = { x: X(R), y: Y(noderadius()) }
        var linkTarget = {
            x: X(1.8 * R * Math.cos(Math.PI / 5)),
            y: Y(1.8 * R * Math.sin(Math.PI / 5) - noderadius())
        }

        var link = d3
            .linkVertical()
            .x(d => d.x)
            .y(d => d.y)({
                source: linkSource,
                target: linkTarget
            });



        layer0 = origin.selectAll(".kopp").data(nodes).enter().append("g").attr("class", "kopp")
            .attr("transform", function (d, i) {
                return "rotate(" + i * (360 / N) + ")translate(" + X(R) + ")"
            })

        layer1 = origin.selectAll(".node").data(nodes).enter().append("g").attr("class", "node")
            .attr("transform", function (d, i) {
                return "rotate(" + i * (360 / N) + ")translate(" + X(R) + ")"
            })


        defectorlink = origin.append('path').attr("class", "link")
            .attr('d', link)
            .style("stroke", "black")
            .attr('fill', 'none');

        defectorlinkhead = origin.append("circle").attr("class", "head")
            .attr("r", knobsize)
            .attr("cx", linkTarget.x)
            .attr("cy", linkTarget.y)

        defector = origin.append("g")
            .attr("transform", "translate(" + X(1.8 * R * Math.cos(Math.PI / 5)) + "," + Y(1.8 * R * Math.sin(Math.PI / 5)) + ")")

        defector.append("circle").attr("class", "head").attr("id", "defector")
            .attr("r", knobsize)
            .attr("cx", X(kopp[kopp.length - 1].x))
            .attr("cy", Y(kopp[kopp.length - 1].y))

        defector.append("circle").attr("class", "circle").attr("id", "defector")
            .attr("r", X(noderadius()))
            .attr("stroke", "rgb(100,100,100)")

        defector.append("path").datum(kopp).attr("d", line).attr("class", "link")
            .style("stroke", "black")
            .style("fill", "none")


        layer1.append("circle")
            .attr("class", "circle")
            .attr("r", X(noderadius()))
            .attr("cx", 0)
            .attr("cy", 0)
            // .style("fill", function (d, i) { return d3.interpolateRainbow(i / N) })
            .style("fill", (d, i) => {
                // if(speciesWithoutParasite[i].catalyticSupport[1]) return "#f00"
                // if(speciesWithoutParasite[i].index == 3) return "#0f0"
                return speciesWithoutParasite[i].color.hex
            })


        layer1.append("path").datum(circ).attr("d", line).attr("class", "link").attr("id", "link")
            .style("stroke", "black")
            .style("fill", "none")


        layer1.append("path").datum(kopp).attr("d", line).attr("class", "link").attr("id", "selflink")
            .style("stroke", "black")
            .style("fill", "none")


        layer0.append("circle").attr("class", "head").attr("id", "link")
            .attr("r", knobsize)
            .attr("cx", X(circ[circ.length - 1].x))
            .attr("cy", Y(circ[circ.length - 1].y))

        layer0.append("circle").attr("class", "head").attr("id", "selflink")
            .attr("r", knobsize)
            .attr("cx", X(kopp[kopp.length - 1].x))
            .attr("cy", Y(kopp[kopp.length - 1].y))
       
        defector.style("opacity", 0)
        defectorlink.style("opacity", 0)
        defectorlinkhead.style("opacity", 0)
    }

    const updateOpacity = (parasiteOpacity = 1, speciesOpacity = []) => {
        defector.style("opacity", parasiteOpacity)
        defectorlink.style("opacity", parasiteOpacity)
        defectorlinkhead.style("opacity", parasiteOpacity)

        layer1.style("opacity", (d, i) => speciesOpacity[i])
        layer0.style("opacity", (d, i) => speciesOpacity[i])
    }

    return { draw, updateOpacity }
}
},{}],7:[function(require,module,exports){
const createCanvas = require('./canvas.js')
const { createModel } = require('./model.js')
const createControls = require('./controls.js')
const config = require('./config.js')

const controls = createControls({
    runpause: runpause,
    reset: reset,
    addRandomParasites: addRandomParasites,
    addParasitesToCenter: addParasitesToCenter,
    render: render
}, config)
const model = createModel((config.width - 1) / 2, controls)
const canvas = createCanvas(config, controls)


document.getElementById("cxpbox_hypercycles_display").appendChild(canvas.canvas)

canvas.render(model)

let interval

function addRandomParasites() {
    model.addRandomParasites(30)
    canvas.render(model)
}

function addParasitesToCenter() {
    model.addParasitesToCenter(30)
    canvas.render(model)
}

function render() {
    canvas.render(model)
}

function runpause(d) {
    if (d.value == 1) {
        interval = setInterval(() => {
            model.update()
            canvas.render(model)
        }, config.speed)
    } else {
        clearInterval(interval)
    }
}

function reset(numSpecies = 9) {
    model.init(numSpecies)
    canvas.render(model)
}





},{"./canvas.js":2,"./config.js":4,"./controls.js":5,"./model.js":8}],8:[function(require,module,exports){
const { getOutcomeFromProbabilities } = require('./util.js')
const { fadeSpeed } = require('./config.js')
const { speciesColor, parasiteColor, emptyColor } = require('./colormaps.js')
const CLAIM_EMPTY = 11

const STATES = {
    EMPTY: 0,
    PARASITE: 1
}
const speciesStartIndex = 2



module.exports.createModel = (w = 50, controls) => {
    const { initialDensity, speed: updateProbability, replication: replicationAmount, catalyticSupport: catalyticSupportAmount, decay: decayAmount, diffusionSteps, /*diffusion: diffusionAmount*/ } = controls.sliders
    console.log('sliders', controls.sliders, updateProbability)
    const diffusionAmount = { value: 0.4 }
	
    const num_parasites = Math.floor(w / 3)
    let l = lattice.square(w).boundary("periodic")
    let SPECIES

    // colors and replication parameters for each species
    const createSpeciesArray = (numSpecies = 9) => new Array(numSpecies + speciesStartIndex).fill(0).map((_, i) => {
        // initial state, catalyticSupport is an object containing the other species that this molecule will help catalyze
        const s = { index: i, catalyticSupport: {}, count: 0 }
        // first state is "EMPTY" state
        if (i === STATES.EMPTY) {
            s.color = emptyColor
            s.replication = 0
            s.initialProbability = 0.1
        } else if (i === STATES.PARASITE) { // parasite state
            s.color = parasiteColor
            s.replication = 1
            s.initialProbability = 0
        } else {
            // generate species color from colormap
            // const index = () / (numSpecies)
            s.color = speciesColor(i - speciesStartIndex, numSpecies)
            s.replication = 1
            s.initialProbability = initialDensity.value / numSpecies

            // choose one species that this species will catalyze
            const cs = i >= numSpecies + speciesStartIndex - 1 ? speciesStartIndex : i + 1
            s.catalyticSupport[cs] = 1

            // also give catalytic support to parasite if species 1
            if (i === 2) s.catalyticSupport[STATES.PARASITE] = 1 * 2
        }
      //  s.colorHSL = RGBToHSL(s.color)
        return s
    })

    window.lattice = l
     /* 
        Given row x and y, calculate node index
    */
        const indexFromCoords = (x, y, n) => y * n + x;

        const coordsFromIndex = (i, n) => ({
            x: i%n, 
            y: Math.floor(i/n)
        })

    function init(numSpecies = 9) {
        SPECIES = createSpeciesArray(numSpecies)
      //  console.log('initing with', numSpecies, SPECIES)

        const outcomes = SPECIES.map((s) => s.index)
        const probabilities = SPECIES.map((s) => s.initialProbability)

        const n = l.L * 2 + 1 // width / height of lattice
        const center = n / 2 // center assuming square lattice

        // initialize node state
        l.nodes.forEach((node, i) => {
            const { x, y } = coordsFromIndex(i, n)
            //const i2 = indexFromCoords(x, y, n)
            const a = x - center
            const b = y - center
            const distanceFromCenter = Math.sqrt(a*a + b*b)
           
            node.prevState = STATES.EMPTY
            node.fade = 0 // amount to fade out
            node.fadeState = 0 // last color showing before fade
            if(distanceFromCenter < n/3) {
                node.state = getOutcomeFromProbabilities(outcomes, probabilities)
            } else {
                node.state = STATES.EMPTY
            }
        })

        controls.updateDiagram(SPECIES.filter((s) => s.index !== STATES.EMPTY))
    }

    function addParasite(index) {
        l.nodes[index].state = STATES.PARASITE
    }

    function addRandomParasites(nParasites = 50) {
        for (let i = 0; i < nParasites; i++) {
            let index = Math.floor(Math.random() * l.nodes.length)
            // add parasite at index
            l.nodes[index].state = STATES.PARASITE
        }
    }

   
    /* 
        Add N parasites to the center of the lattice.
    */
    function addParasitesToCenter(nParasites = 50) {
        const n = l.L * 2 + 1
        const w = Math.floor(Math.sqrt(nParasites))
        const center = n / 2
        const corner = center - w / 2
        for (let i = 0; i < nParasites; i++) {
            const x = corner + (i % w)
            const y = corner + Math.floor(i / w)
            const index = indexFromCoords(x, y, n)
            l.nodes[index].state = STATES.PARASITE
        }
    }

    init()

    const decay = (state) => Math.random() < decayAmount.value ? STATES.EMPTY : state

    // from paper, c[x,y] is the catalytic support x gets from y 
    // if x is empty, gets no catalytic support from neighbors
    const c = (x, y) => {
        const yS = SPECIES[y.state]
        return yS.catalyticSupport[x.state] ? yS.catalyticSupport[x.state] * catalyticSupportAmount.value : 0
    }

    // swap positions with a random neighbor
    const diffusion = (node) => {
       if(node.state === STATES.EMPTY) {
         if (Math.random() < diffusionAmount.value) {
            const n = node.neighbors[Math.floor(Math.random() * node.neighbors.length)]
            const newState = node.state
            node.prevState = node.state
            node.state = n.state

            n.prevState = n.state
            n.state = newState
         }
        }
    }

    const replicate = (node) => {
        let newState = node.state
        let replication = replicationAmount.value
        if (node.neighborsObject) {
            const { n, nw, ne, w, e, sw, s, se } = node.neighborsObject
            const cN = SPECIES[n.state].replication * replication + c(n, ne) + c(n, nw) + c(n, w) + c(n, e)
            const cS = SPECIES[s.state].replication * replication + c(s, se) + c(s, sw) + c(s, w) + c(s, e)
            const cE = SPECIES[e.state].replication * replication + c(e, ne) + c(e, se) + c(e, n) + c(e, s)
            const cW = SPECIES[w.state].replication * replication + c(w, nw) + c(w, sw) + c(w, n) + c(w, s)

            const cSum = cN + cS + cE + cW + CLAIM_EMPTY

            // calculate probabilities of next state based on claims from neighboring states
            const pEmpty = CLAIM_EMPTY / cSum
            const pN = cN / cSum
            const pS = cS / cSum
            const pE = cE / cSum
            const pW = cW / cSum

            const r = Math.random()

            newState = getOutcomeFromProbabilities([STATES.EMPTY, n.state, s.state, e.state, w.state], [pEmpty, pN, pS, pE, pW])
        }
        return newState
    }

    const update = () => {
        const numDiffusionSteps = Math.round(diffusionSteps.value)
        const updateProb = 1 - updateProbability.value
        const empty = STATES.EMPTY
        
        // reset species count
        SPECIES.forEach((s) => { s.count = 0 })
        // const newNodeState = new Array(l.nodes.length)
        l.nodes.forEach((node, i) => {
            const { state } = node
            let newState = state
          //  if(Math.random() > (1 - UPDATE_PROBABILITY)) {
            if(Math.random() > updateProb) {
                if (state !== empty) {
                    newState = decay(state)
                } else {
                    newState = replicate(node)
                }
            }
          //  newNodeState[i] = newState
            node.prevState = node.state
            node.state = newState
            SPECIES[node.state].count ++
        })

        // l.nodes.forEach((node, i) => {
           
        // })

        for (let i = 0; i < numDiffusionSteps; i++) {
            l.nodes.forEach((node, i) => {
                diffusion(node)
            })
        }

        l.nodes.forEach((node, i) => {
           // if transtitioning to empty, start fade
           if(node.prevState !== STATES.EMPTY && node.state === STATES.EMPTY) {
            node.fade = 1
            node.fadeState = node.prevState
           } else if (node.fade > 0) {
            node.fade -= fadeSpeed
           }
        })

    //    console.log('species counts', SPECIES)
        const speciesCounts = SPECIES.slice(2).map((s) => s.count === 0 ? 0 : 1)
        controls.updateDiagramOpacity(SPECIES[1].count === 0 ? 0 : 1, speciesCounts)
    }

    return {
        lattice: l,
        update: update,
        SPECIES: () => SPECIES,
        init: init,
        addRandomParasites: addRandomParasites,
        addParasitesToCenter: addParasitesToCenter
    }

}



},{"./colormaps.js":3,"./config.js":4,"./util.js":9}],9:[function(require,module,exports){
module.exports.HSLToRGB = ( h,s,l) => {
    // Must be fractions of 1
    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
    
        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;  
          } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
          } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
          } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
          } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
          } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
          }
          r = Math.round((r + m) * 255);
          g = Math.round((g + m) * 255);
          b = Math.round((b + m) * 255);
    return { r, g, b }
  }

module.exports.RGBToHSL = ({r, g, b} = {}) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return {
      h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
      s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      l: (100 * (2 * l - s)) / 2
    };
  }

  // function that accepts an array of possible outcomes, and a set of probabilites for each outcome
module.exports.getOutcomeFromProbabilities = (outcomes = [], probabilities = []) => {
    const sum = probabilities.reduce((a, b) => a + b, 0)
    const scaledProbs = probabilities.map((p) => p/sum)
    const r = Math.random()
    let index = outcomes.length - 1
    let thresh = 0
    scaledProbs.forEach((p, i) => {
        if( r < p + thresh && i < index) {
            index = i
        }
        thresh += p
    })
    return outcomes[index]
}
},{}]},{},[7]);
