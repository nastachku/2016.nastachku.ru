function ticketChanged() {
    var t = $("#ticket").is(":checked") ? 1 : 0,
        e = $("#afterparty").is(":checked") ? 1 : 0;
    calculatePrices(t, e, function(t) {
        t.campaign && t.campaign_discount_value > 0 ? ($("#campaign_discount").show(), $("#campaign_name").html("\u201c" + t.campaign.name + "\u201d:"), $("#campaign_discount_value").html(t.campaign_discount_value)) : $("#campaign_discount").hide(), t.coupon && t.coupon_discount_value > 0 ? ($("#coupon_discount").show(), $("#coupon_discount_value").html(t.coupon_discount_value)) : $("#coupon_discount").hide(), $("#total-price").html(t.cost)
    })
}

function SliderColleagues() {
    function t() {
        s++, s >= o - 3 && (s = 0), r.animate({
            marginLeft: "-" + 202 * s + "px"
        }, 300)
    }

    function e() {
        s--, -1 == s && (s = o - 4), r.animate({
            marginLeft: "-" + 202 * s + "px"
        }, 300)
    }
    var n = $(".slider_colleagues .controls.next"),
        i = $(".slider_colleagues .controls.preview"),
        r = $(".slider_colleagues .slider_big_box"),
        a = r.find(".item"),
        o = a.length,
        s = 0;
    n.click(t), i.click(e)
}

function changeTicketPrice(t) {
    var e = $("#ticketPrice");
    e.html(t * e.data("price")), changeAllPrice()
}

function changeAfterpartyPrice(t) {
    var e = $("#afterpartyPrice");
    e.html(t * e.data("price")), changeAllPrice()
}

function changeAllPrice() {
    var t = $("#allPrice"),
        e = parseInt($("#ticketPrice").html()),
        n = parseInt($("#afterpartyPrice").html());
    t.html(e + n)
}

function calculatePrices(t, e, n) {
    var i = {
        tickets_count: t,
        afterparty_tickets_count: e
    };
    $.ajax({
        url: Routes.prices_api_order_path(),
        data: i,
        success: function(t) {
            n(t.prices)
        }
    })
}

function display_hide(t) {
    "none" == $(t).css("display") ? $(t).animate({
        height: "show"
    }, 500) : $(t).animate({
        height: "hide"
    }, 500)
}

function check_my_program_slots() {
    $("#my_programm").on("change", function() {
        self = this, $.get(Routes.my_programm_api_events_path({
            format: "json"
        }), function(t) {
            var e = t.events.map(function(t) {
                return t.voteable_id
            });
            $(self).is(":checked") ? ($(".schedule__filter").prop("checked", !1).change(), $(".programm__schedule__lectures__lecture").addClass("disable"), $.each(e, function(t, e) {
                $("#lecture-" + e).addClass("enable")
            })) : ($(".programm__schedule__lectures__lecture").removeClass("disable"), $.each(e, function(t, e) {
                $("#lecture-" + e).removeClass("enable")
            }))
        })
    })
}

function lectureClick(t, e) {
    window.location.href = ("/lectures.html#lecture_" + $(e).data("id"))
}

function showPassedClick(t) {
    $(t).closest("tbody").toggleClass("force_show_passed"), changeCurrentTimeLine()
}

function hallCount() {
    return !_.isUndefined(window.gon) && window.gon.hall_count
}

function hallIdArray() {
    return _.isUndefined(hallCount()) ? [] : _.range(1, hallCount() + 1)
}

function setNextAndPrevButtons(t, e, n) {
    var i = $(".programm__next"),
        r = $(".programm__prev");
    i.attr("data-page", t), r.attr("data-page", t), e ? (r.removeClass("disable").attr("data-page", t), i.removeClass("disable").attr("data-page", t)) : n ? (r.addClass("disable").attr("data-page", t), i.removeClass("disable").attr("data-page", t)) : (i.addClass("disable").attr("data-page", t), r.removeClass("disable").attr("data-page", t))
}

function chunkArray(t, e) {
    return t.reduce(function(t, n, i) {
        return i % e === 0 && t.push([]), t[t.length - 1].push(n), t
    }, [])
}

function hallPages() {
    var t = Math.ceil(hallCount() / 2);
    return chunkArray(hallIdArray(), t)
}

function showAdapticTable() {
    changeCurrentTimeLine();
    var t = $("dd.selected table").attr("class");
    if (t) {
        var e = Number(t.split("page-")[1]),
            n = function() {
                e = 1;
                var t = $("dd.selected table");
                t.removeClass(), t.addClass("page-1"), setNextAndPrevButtons(e, !1, 1 == e)
            };
        if (isNaN(e) && n(), hideAllTd(), check_width(mobileBreakpoint)) setNextAndPrevButtons(e, 1 != e && e != hallCount(), 1 == e), showTdOfTable([e]);
        else if (check_width(midScreenBreakpoint)) {
            e > 2 && n(); {
                Math.ceil(hallCount() / 2)
            }
            if (1 == e) {
                var i = hallPages()[0];
                showTdOfTable(i)
            } else if (2 == e) {
                var r = hallPages()[1];
                showTdOfTable(r)
            }
        } else n(), showTdOfTable(hallIdArray())
    }
}

function close_popup(t, e, n) {
    var i = -parseInt(t.css("top"));
    t.removeClass("noscroll").css("top", ""), $(window).scrollTop(i), e.fadeOut(150), n.fadeOut(150).removeClass("open")
}

function open_popup(t, e, n) {
    var i = $(window),
        r = i.scrollTop();
    e.addClass("noscroll").css("top", -r + "px"), $("#popup_" + t).fadeIn(150).addClass("open"), n.fadeIn(150), i.scrollTop(0)
}

function check_width(t) {
    return $(window).width() <= t ? !0 : !1
}

function programm_next(t, e) {
    var n = Number(t.attr("data-page"));
    check_width(mobileBreakpoint) ? n < hallCount() && (n == hallCount() - 1 && t.addClass("disable"), t.attr("data-page", n + 1), e.removeClass("disable").attr("data-page", n + 1), t.parents("table").attr("class", "page-" + (n + 1)), showTdOfTable([n + 1])) : check_width(midScreenBreakpoint) && (console.log("next", n), t.addClass("disable").attr("data-page", 2), e.removeClass("disable").attr("data-page", 2), t.parents("table").attr("class", "page-2"), showTdOfTable(hallPages()[1]))
}

function programm_prev(t, e) {
    var n = Number(t.attr("data-page"));
    check_width(mobileBreakpoint) ? n > 1 && (2 == n && t.addClass("disable"), t.attr("data-page", n - 1), e.removeClass("disable").attr("data-page", n - 1), t.parents("table").attr("class", "page-" + (n - 1)), showTdOfTable([n - 1])) : check_width(midScreenBreakpoint) && (console.log("prev", n), e.removeClass("disable").attr("data-page", 1), t.addClass("disable").attr("data-page", 1), e.parents("table").attr("class", "page-1"), showTdOfTable(hallPages()[0]))
}

function showTdOfTable(t) {
    showHeadOfTable(t), hideAllTd(), t.map(function(t) {
        $("td[data-hall=" + t + "]").show()
    }), hidePassedForHalls(t)
}

function hideAllHeads() {
    $("th[data-hall]").hide()
}

function showHeadOfTable(t) {
    hideAllHeads(), t.map(function(t) {
        $("th[data-hall=" + t + "]").show()
    })
}

function hidePassedForHalls(t) {
    $(".programm__schedule__lectures").removeClass("passed_tr");
    var e, n = parseInt($(".current_time_line").closest("tr").data("time")),
        i = [];
    t.map(function(t) {
        var e, r;
        $(".programm__schedule__lectures td[data-hall=" + t + "]").each(function(t, i) {
            var a = $(i).closest("tr"),
                o = a.data("time"),
                s = $(i).find(".programm__schedule__lectures__lecture"),
                u = a.find(".programm__time");
            return o > n ? !1 : void(s.length ? s.hasClass("passed") || e || (e = s, r = a) : u.length && n > o && !e && (r = a))
        }), i.push(r)
    }), i.forEach(function(t) {
        _.isUndefined(t) || (e ? t.data("time") < e.data("time") && (e = t) : e = t)
    }), e ? e.prevAll().addClass("passed_tr") : $(".show_passed").hide(), changeCurrentTimeLine()
}

function hideAllTd() {
    $("td[data-hall]").hide()
}

function showUser(t) {
    $(t).parent().toggleClass("open")
}

function startShare42() {
    $(function() {
        $("div.share42init").each(function() {
            function t(t) {
                for (var e = document.getElementsByTagName("script"), n = new RegExp("^(.*/|)(" + t + ")([#?]|$)"), i = 0, r = e.length; r > i; i++) {
                    var a = String(e[i].src).match(n);
                    if (a) return a[1].match(/^((https?|file)\:\/{2,}|\w:[\/\\])/) ? a[1] : 0 == a[1].indexOf("/") ? a[1] : (b = document.getElementsByTagName("base"), b[0] && b[0].href ? b[0].href + a[1] : document.location.pathname.match(/(.*[\/\\])/)[0] + a[1])
                }
                return null
            }
            var e = $(this),
                n = e.attr("data-url"),
                i = e.attr("data-title"),
                r = e.attr("data-image"),
                a = e.attr("data-description"),
                o = e.attr("data-path"),
                s = e.attr("data-zero-counter");
            if (n || (n = location.href), s || (s = 0), o || (o = t("share42.js")), i || (i = document.title), !a) {
                var u = $('meta[name="description"]').attr("content");
                a = void 0 !== u ? u : ""
            }
            n = encodeURIComponent(n), i = encodeURIComponent(i), i = i.replace(/\'/g, "%27"), r = encodeURIComponent(r), a = encodeURIComponent(a), a = a.replace(/\'/g, "%27");
            var l = "u=" + n;
            "null" != r && "" != r && (l = "s=100&p[url]=" + n + "&p[title]=" + i + "&p[summary]=" + a + "&p[images][0]=" + r);
            var c = "";
            "null" != r && "" != r && (c = "&image=" + r);
            var d = new Array('"#" data-count="twi" onclick="window.open(\'https://twitter.com/intent/tweet?text=' + i + "&url=" + n + "', '_blank', 'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0');return false\" title=\"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432 Twitter\"", '"#" data-count="fb" onclick="window.open(\'http://www.facebook.com/sharer.php?' + l + "', '_blank', 'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0');return false\" title=\"\u041f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f \u0432 Facebook\"", '"#" data-count="vk" onclick="window.open(\'http://vk.com/share.php?url=' + n + "&title=" + i + c + "&description=" + a + "', '_blank', 'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0');return false\" title=\"\u041f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f \u0412 \u041a\u043e\u043d\u0442\u0430\u043a\u0442\u0435\"", '"#" data-count="odkl" onclick="window.open(\'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st._surl=' + n + "&title=" + i + "', '_blank', 'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0');return false\" title=\"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432 \u041e\u0434\u043d\u043e\u043a\u043b\u0430\u0441\u0441\u043d\u0438\u043a\u0438\""),
                h = "";
            for (j = 0; j < d.length; j++) h += '<span class="share42-item" style="display:inline-block;margin:0 6px 6px 0;height:32px;"><a rel="nofollow" style="display:inline-block;width:32px;height:32px;margin:0;padding:0;outline:none;background:url(' + o + "icons.png) -" + 32 * j + 'px 0 no-repeat" href=' + d[j] + ' target="_blank"></a></span>';
            e.html('<span id="share42">' + h + "</span>")
        })
    })
}

function render_lectures(t) {
    function e(t, e) {
        if (e) {
            for (var n, i = [], r = t.length - 1; r >= 0 && e > 0; r--, e--) n = Math.floor(Math.random() * r), i.push(t[n]), t.splice(n, 1);
            return i
        }
        for (var n, a, r = t.length; r; n = Math.floor(Math.random() * r), a = t[--r], t[r] = t[n], t[n] = a);
        return t
    }
    var n = JST["welcome/lectures"],
        i = e(t, 4),
        r = n({
            four_lectures: i
        });
    $("#lectures").html(r)
}! function(t, e) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = t.document ? e(t, !0) : function(t) {
        if (!t.document) throw new Error("jQuery requires a window with a document");
        return e(t)
    } : e(t)
}("undefined" != typeof window ? window : this, function(t, e) {
    function n(t) {
        var e = t.length,
            n = re.type(t);
        return "function" === n || re.isWindow(t) ? !1 : 1 === t.nodeType && e ? !0 : "array" === n || 0 === e || "number" == typeof e && e > 0 && e - 1 in t
    }

    function i(t, e, n) {
        if (re.isFunction(e)) return re.grep(t, function(t, i) {
            return !!e.call(t, i, t) !== n
        });
        if (e.nodeType) return re.grep(t, function(t) {
            return t === e !== n
        });
        if ("string" == typeof e) {
            if (he.test(e)) return re.filter(e, t, n);
            e = re.filter(e, t)
        }
        return re.grep(t, function(t) {
            return re.inArray(t, e) >= 0 !== n
        })
    }

    function r(t, e) {
        do t = t[e]; while (t && 1 !== t.nodeType);
        return t
    }

    function a(t) {
        var e = be[t] = {};
        return re.each(t.match(_e) || [], function(t, n) {
            e[n] = !0
        }), e
    }

    function o() {
        pe.addEventListener ? (pe.removeEventListener("DOMContentLoaded", s, !1), t.removeEventListener("load", s, !1)) : (pe.detachEvent("onreadystatechange", s), t.detachEvent("onload", s))
    }

    function s() {
        (pe.addEventListener || "load" === event.type || "complete" === pe.readyState) && (o(), re.ready())
    }

    function u(t, e, n) {
        if (void 0 === n && 1 === t.nodeType) {
            var i = "data-" + e.replace(Te, "-$1").toLowerCase();
            if (n = t.getAttribute(i), "string" == typeof n) {
                try {
                    n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : Ce.test(n) ? re.parseJSON(n) : n
                } catch (r) {}
                re.data(t, e, n)
            } else n = void 0
        }
        return n
    }

    function l(t) {
        var e;
        for (e in t)
            if (("data" !== e || !re.isEmptyObject(t[e])) && "toJSON" !== e) return !1;
        return !0
    }

    function c(t, e, n, i) {
        if (re.acceptData(t)) {
            var r, a, o = re.expando,
                s = t.nodeType,
                u = s ? re.cache : t,
                l = s ? t[o] : t[o] && o;
            if (l && u[l] && (i || u[l].data) || void 0 !== n || "string" != typeof e) return l || (l = s ? t[o] = J.pop() || re.guid++ : o), u[l] || (u[l] = s ? {} : {
                toJSON: re.noop
            }), ("object" == typeof e || "function" == typeof e) && (i ? u[l] = re.extend(u[l], e) : u[l].data = re.extend(u[l].data, e)), a = u[l], i || (a.data || (a.data = {}), a = a.data), void 0 !== n && (a[re.camelCase(e)] = n), "string" == typeof e ? (r = a[e], null == r && (r = a[re.camelCase(e)])) : r = a, r
        }
    }

    function d(t, e, n) {
        if (re.acceptData(t)) {
            var i, r, a = t.nodeType,
                o = a ? re.cache : t,
                s = a ? t[re.expando] : re.expando;
            if (o[s]) {
                if (e && (i = n ? o[s] : o[s].data)) {
                    re.isArray(e) ? e = e.concat(re.map(e, re.camelCase)) : e in i ? e = [e] : (e = re.camelCase(e), e = e in i ? [e] : e.split(" ")), r = e.length;
                    for (; r--;) delete i[e[r]];
                    if (n ? !l(i) : !re.isEmptyObject(i)) return
                }(n || (delete o[s].data, l(o[s]))) && (a ? re.cleanData([t], !0) : ne.deleteExpando || o != o.window ? delete o[s] : o[s] = null)
            }
        }
    }

    function h() {
        return !0
    }

    function f() {
        return !1
    }

    function p() {
        try {
            return pe.activeElement
        } catch (t) {}
    }

    function m(t) {
        var e = qe.split("|"),
            n = t.createDocumentFragment();
        if (n.createElement)
            for (; e.length;) n.createElement(e.pop());
        return n
    }

    function g(t, e) {
        var n, i, r = 0,
            a = typeof t.getElementsByTagName !== ke ? t.getElementsByTagName(e || "*") : typeof t.querySelectorAll !== ke ? t.querySelectorAll(e || "*") : void 0;
        if (!a)
            for (a = [], n = t.childNodes || t; null != (i = n[r]); r++) !e || re.nodeName(i, e) ? a.push(i) : re.merge(a, g(i, e));
        return void 0 === e || e && re.nodeName(t, e) ? re.merge([t], a) : a
    }

    function v(t) {
        Ae.test(t.type) && (t.defaultChecked = t.checked)
    }

    function y(t, e) {
        return re.nodeName(t, "table") && re.nodeName(11 !== e.nodeType ? e : e.firstChild, "tr") ? t.getElementsByTagName("tbody")[0] || t.appendChild(t.ownerDocument.createElement("tbody")) : t
    }

    function _(t) {
        return t.type = (null !== re.find.attr(t, "type")) + "/" + t.type, t
    }

    function b(t) {
        var e = Ue.exec(t.type);
        return e ? t.type = e[1] : t.removeAttribute("type"), t
    }

    function w(t, e) {
        for (var n, i = 0; null != (n = t[i]); i++) re._data(n, "globalEval", !e || re._data(e[i], "globalEval"))
    }

    function x(t, e) {
        if (1 === e.nodeType && re.hasData(t)) {
            var n, i, r, a = re._data(t),
                o = re._data(e, a),
                s = a.events;
            if (s) {
                delete o.handle, o.events = {};
                for (n in s)
                    for (i = 0, r = s[n].length; r > i; i++) re.event.add(e, n, s[n][i])
            }
            o.data && (o.data = re.extend({}, o.data))
        }
    }

    function k(t, e) {
        var n, i, r;
        if (1 === e.nodeType) {
            if (n = e.nodeName.toLowerCase(), !ne.noCloneEvent && e[re.expando]) {
                r = re._data(e);
                for (i in r.events) re.removeEvent(e, i, r.handle);
                e.removeAttribute(re.expando)
            }
            "script" === n && e.text !== t.text ? (_(e).text = t.text, b(e)) : "object" === n ? (e.parentNode && (e.outerHTML = t.outerHTML), ne.html5Clone && t.innerHTML && !re.trim(e.innerHTML) && (e.innerHTML = t.innerHTML)) : "input" === n && Ae.test(t.type) ? (e.defaultChecked = e.checked = t.checked, e.value !== t.value && (e.value = t.value)) : "option" === n ? e.defaultSelected = e.selected = t.defaultSelected : ("input" === n || "textarea" === n) && (e.defaultValue = t.defaultValue)
        }
    }

    function C(e, n) {
        var i, r = re(n.createElement(e)).appendTo(n.body),
            a = t.getDefaultComputedStyle && (i = t.getDefaultComputedStyle(r[0])) ? i.display : re.css(r[0], "display");
        return r.detach(), a
    }

    function T(t) {
        var e = pe,
            n = Ze[t];
        return n || (n = C(t, e), "none" !== n && n || (Ge = (Ge || re("<iframe frameborder='0' width='0' height='0'/>")).appendTo(e.documentElement), e = (Ge[0].contentWindow || Ge[0].contentDocument).document, e.write(), e.close(), n = C(t, e), Ge.detach()), Ze[t] = n), n
    }

    function $(t, e) {
        return {
            get: function() {
                var n = t();
                if (null != n) return n ? void delete this.get : (this.get = e).apply(this, arguments)
            }
        }
    }

    function j(t, e) {
        if (e in t) return e;
        for (var n = e.charAt(0).toUpperCase() + e.slice(1), i = e, r = fn.length; r--;)
            if (e = fn[r] + n, e in t) return e;
        return i
    }

    function S(t, e) {
        for (var n, i, r, a = [], o = 0, s = t.length; s > o; o++) i = t[o], i.style && (a[o] = re._data(i, "olddisplay"), n = i.style.display, e ? (a[o] || "none" !== n || (i.style.display = ""), "" === i.style.display && Se(i) && (a[o] = re._data(i, "olddisplay", T(i.nodeName)))) : (r = Se(i), (n && "none" !== n || !r) && re._data(i, "olddisplay", r ? n : re.css(i, "display"))));
        for (o = 0; s > o; o++) i = t[o], i.style && (e && "none" !== i.style.display && "" !== i.style.display || (i.style.display = e ? a[o] || "" : "none"));
        return t
    }

    function E(t, e, n) {
        var i = ln.exec(e);
        return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : e
    }

    function A(t, e, n, i, r) {
        for (var a = n === (i ? "border" : "content") ? 4 : "width" === e ? 1 : 0, o = 0; 4 > a; a += 2) "margin" === n && (o += re.css(t, n + je[a], !0, r)), i ? ("content" === n && (o -= re.css(t, "padding" + je[a], !0, r)), "margin" !== n && (o -= re.css(t, "border" + je[a] + "Width", !0, r))) : (o += re.css(t, "padding" + je[a], !0, r), "padding" !== n && (o += re.css(t, "border" + je[a] + "Width", !0, r)));
        return o
    }

    function N(t, e, n) {
        var i = !0,
            r = "width" === e ? t.offsetWidth : t.offsetHeight,
            a = tn(t),
            o = ne.boxSizing && "border-box" === re.css(t, "boxSizing", !1, a);
        if (0 >= r || null == r) {
            if (r = en(t, e, a), (0 > r || null == r) && (r = t.style[e]), rn.test(r)) return r;
            i = o && (ne.boxSizingReliable() || r === t.style[e]), r = parseFloat(r) || 0
        }
        return r + A(t, e, n || (o ? "border" : "content"), i, a) + "px"
    }

    function D(t, e, n, i, r) {
        return new D.prototype.init(t, e, n, i, r)
    }

    function I() {
        return setTimeout(function() {
            pn = void 0
        }), pn = re.now()
    }

    function L(t, e) {
        var n, i = {
                height: t
            },
            r = 0;
        for (e = e ? 1 : 0; 4 > r; r += 2 - e) n = je[r], i["margin" + n] = i["padding" + n] = t;
        return e && (i.opacity = i.width = t), i
    }

    function P(t, e, n) {
        for (var i, r = (bn[e] || []).concat(bn["*"]), a = 0, o = r.length; o > a; a++)
            if (i = r[a].call(n, e, t)) return i
    }

    function q(t, e, n) {
        var i, r, a, o, s, u, l, c, d = this,
            h = {},
            f = t.style,
            p = t.nodeType && Se(t),
            m = re._data(t, "fxshow");
        n.queue || (s = re._queueHooks(t, "fx"), null == s.unqueued && (s.unqueued = 0, u = s.empty.fire, s.empty.fire = function() {
            s.unqueued || u()
        }), s.unqueued++, d.always(function() {
            d.always(function() {
                s.unqueued--, re.queue(t, "fx").length || s.empty.fire()
            })
        })), 1 === t.nodeType && ("height" in e || "width" in e) && (n.overflow = [f.overflow, f.overflowX, f.overflowY], l = re.css(t, "display"), c = "none" === l ? re._data(t, "olddisplay") || T(t.nodeName) : l, "inline" === c && "none" === re.css(t, "float") && (ne.inlineBlockNeedsLayout && "inline" !== T(t.nodeName) ? f.zoom = 1 : f.display = "inline-block")), n.overflow && (f.overflow = "hidden", ne.shrinkWrapBlocks() || d.always(function() {
            f.overflow = n.overflow[0], f.overflowX = n.overflow[1], f.overflowY = n.overflow[2]
        }));
        for (i in e)
            if (r = e[i], gn.exec(r)) {
                if (delete e[i], a = a || "toggle" === r, r === (p ? "hide" : "show")) {
                    if ("show" !== r || !m || void 0 === m[i]) continue;
                    p = !0
                }
                h[i] = m && m[i] || re.style(t, i)
            } else l = void 0;
        if (re.isEmptyObject(h)) "inline" === ("none" === l ? T(t.nodeName) : l) && (f.display = l);
        else {
            m ? "hidden" in m && (p = m.hidden) : m = re._data(t, "fxshow", {}), a && (m.hidden = !p), p ? re(t).show() : d.done(function() {
                re(t).hide()
            }), d.done(function() {
                var e;
                re._removeData(t, "fxshow");
                for (e in h) re.style(t, e, h[e])
            });
            for (i in h) o = P(p ? m[i] : 0, i, d), i in m || (m[i] = o.start, p && (o.end = o.start, o.start = "width" === i || "height" === i ? 1 : 0))
        }
    }

    function O(t, e) {
        var n, i, r, a, o;
        for (n in t)
            if (i = re.camelCase(n), r = e[i], a = t[n], re.isArray(a) && (r = a[1], a = t[n] = a[0]), n !== i && (t[i] = a, delete t[n]), o = re.cssHooks[i], o && "expand" in o) {
                a = o.expand(a), delete t[i];
                for (n in a) n in t || (t[n] = a[n], e[n] = r)
            } else e[i] = r
    }

    function M(t, e, n) {
        var i, r, a = 0,
            o = _n.length,
            s = re.Deferred().always(function() {
                delete u.elem
            }),
            u = function() {
                if (r) return !1;
                for (var e = pn || I(), n = Math.max(0, l.startTime + l.duration - e), i = n / l.duration || 0, a = 1 - i, o = 0, u = l.tweens.length; u > o; o++) l.tweens[o].run(a);
                return s.notifyWith(t, [l, a, n]), 1 > a && u ? n : (s.resolveWith(t, [l]), !1)
            },
            l = s.promise({
                elem: t,
                props: re.extend({}, e),
                opts: re.extend(!0, {
                    specialEasing: {}
                }, n),
                originalProperties: e,
                originalOptions: n,
                startTime: pn || I(),
                duration: n.duration,
                tweens: [],
                createTween: function(e, n) {
                    var i = re.Tween(t, l.opts, e, n, l.opts.specialEasing[e] || l.opts.easing);
                    return l.tweens.push(i), i
                },
                stop: function(e) {
                    var n = 0,
                        i = e ? l.tweens.length : 0;
                    if (r) return this;
                    for (r = !0; i > n; n++) l.tweens[n].run(1);
                    return e ? s.resolveWith(t, [l, e]) : s.rejectWith(t, [l, e]), this
                }
            }),
            c = l.props;
        for (O(c, l.opts.specialEasing); o > a; a++)
            if (i = _n[a].call(l, t, c, l.opts)) return i;
        return re.map(c, P, l), re.isFunction(l.opts.start) && l.opts.start.call(t, l), re.fx.timer(re.extend(u, {
            elem: t,
            anim: l,
            queue: l.opts.queue
        })), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always)
    }

    function R(t) {
        return function(e, n) {
            "string" != typeof e && (n = e, e = "*");
            var i, r = 0,
                a = e.toLowerCase().match(_e) || [];
            if (re.isFunction(n))
                for (; i = a[r++];) "+" === i.charAt(0) ? (i = i.slice(1) || "*", (t[i] = t[i] || []).unshift(n)) : (t[i] = t[i] || []).push(n)
        }
    }

    function H(t, e, n, i) {
        function r(s) {
            var u;
            return a[s] = !0, re.each(t[s] || [], function(t, s) {
                var l = s(e, n, i);
                return "string" != typeof l || o || a[l] ? o ? !(u = l) : void 0 : (e.dataTypes.unshift(l), r(l), !1)
            }), u
        }
        var a = {},
            o = t === Wn;
        return r(e.dataTypes[0]) || !a["*"] && r("*")
    }

    function F(t, e) {
        var n, i, r = re.ajaxSettings.flatOptions || {};
        for (i in e) void 0 !== e[i] && ((r[i] ? t : n || (n = {}))[i] = e[i]);
        return n && re.extend(!0, t, n), t
    }

    function z(t, e, n) {
        for (var i, r, a, o, s = t.contents, u = t.dataTypes;
            "*" === u[0];) u.shift(), void 0 === r && (r = t.mimeType || e.getResponseHeader("Content-Type"));
        if (r)
            for (o in s)
                if (s[o] && s[o].test(r)) {
                    u.unshift(o);
                    break
                }
        if (u[0] in n) a = u[0];
        else {
            for (o in n) {
                if (!u[0] || t.converters[o + " " + u[0]]) {
                    a = o;
                    break
                }
                i || (i = o)
            }
            a = a || i
        }
        return a ? (a !== u[0] && u.unshift(a), n[a]) : void 0
    }

    function B(t, e, n, i) {
        var r, a, o, s, u, l = {},
            c = t.dataTypes.slice();
        if (c[1])
            for (o in t.converters) l[o.toLowerCase()] = t.converters[o];
        for (a = c.shift(); a;)
            if (t.responseFields[a] && (n[t.responseFields[a]] = e), !u && i && t.dataFilter && (e = t.dataFilter(e, t.dataType)), u = a, a = c.shift())
                if ("*" === a) a = u;
                else if ("*" !== u && u !== a) {
            if (o = l[u + " " + a] || l["* " + a], !o)
                for (r in l)
                    if (s = r.split(" "), s[1] === a && (o = l[u + " " + s[0]] || l["* " + s[0]])) {
                        o === !0 ? o = l[r] : l[r] !== !0 && (a = s[0], c.unshift(s[1]));
                        break
                    }
            if (o !== !0)
                if (o && t["throws"]) e = o(e);
                else try {
                    e = o(e)
                } catch (d) {
                    return {
                        state: "parsererror",
                        error: o ? d : "No conversion from " + u + " to " + a
                    }
                }
        }
        return {
            state: "success",
            data: e
        }
    }

    function W(t, e, n, i) {
        var r;
        if (re.isArray(e)) re.each(e, function(e, r) {
            n || Jn.test(t) ? i(t, r) : W(t + "[" + ("object" == typeof r ? e : "") + "]", r, n, i)
        });
        else if (n || "object" !== re.type(e)) i(t, e);
        else
            for (r in e) W(t + "[" + r + "]", e[r], n, i)
    }

    function X() {
        try {
            return new t.XMLHttpRequest
        } catch (e) {}
    }

    function Q() {
        try {
            return new t.ActiveXObject("Microsoft.XMLHTTP")
        } catch (e) {}
    }

    function U(t) {
        return re.isWindow(t) ? t : 9 === t.nodeType ? t.defaultView || t.parentWindow : !1
    }
    var J = [],
        V = J.slice,
        K = J.concat,
        Y = J.push,
        G = J.indexOf,
        Z = {},
        te = Z.toString,
        ee = Z.hasOwnProperty,
        ne = {},
        ie = "1.11.2",
        re = function(t, e) {
            return new re.fn.init(t, e)
        },
        ae = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        oe = /^-ms-/,
        se = /-([\da-z])/gi,
        ue = function(t, e) {
            return e.toUpperCase()
        };
    re.fn = re.prototype = {
        jquery: ie,
        constructor: re,
        selector: "",
        length: 0,
        toArray: function() {
            return V.call(this)
        },
        get: function(t) {
            return null != t ? 0 > t ? this[t + this.length] : this[t] : V.call(this)
        },
        pushStack: function(t) {
            var e = re.merge(this.constructor(), t);
            return e.prevObject = this, e.context = this.context, e
        },
        each: function(t, e) {
            return re.each(this, t, e)
        },
        map: function(t) {
            return this.pushStack(re.map(this, function(e, n) {
                return t.call(e, n, e)
            }))
        },
        slice: function() {
            return this.pushStack(V.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(t) {
            var e = this.length,
                n = +t + (0 > t ? e : 0);
            return this.pushStack(n >= 0 && e > n ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: Y,
        sort: J.sort,
        splice: J.splice
    }, re.extend = re.fn.extend = function() {
        var t, e, n, i, r, a, o = arguments[0] || {},
            s = 1,
            u = arguments.length,
            l = !1;
        for ("boolean" == typeof o && (l = o, o = arguments[s] || {}, s++), "object" == typeof o || re.isFunction(o) || (o = {}), s === u && (o = this, s--); u > s; s++)
            if (null != (r = arguments[s]))
                for (i in r) t = o[i], n = r[i], o !== n && (l && n && (re.isPlainObject(n) || (e = re.isArray(n))) ? (e ? (e = !1, a = t && re.isArray(t) ? t : []) : a = t && re.isPlainObject(t) ? t : {}, o[i] = re.extend(l, a, n)) : void 0 !== n && (o[i] = n));
        return o
    }, re.extend({
        expando: "jQuery" + (ie + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(t) {
            throw new Error(t)
        },
        noop: function() {},
        isFunction: function(t) {
            return "function" === re.type(t)
        },
        isArray: Array.isArray || function(t) {
            return "array" === re.type(t)
        },
        isWindow: function(t) {
            return null != t && t == t.window
        },
        isNumeric: function(t) {
            return !re.isArray(t) && t - parseFloat(t) + 1 >= 0
        },
        isEmptyObject: function(t) {
            var e;
            for (e in t) return !1;
            return !0
        },
        isPlainObject: function(t) {
            var e;
            if (!t || "object" !== re.type(t) || t.nodeType || re.isWindow(t)) return !1;
            try {
                if (t.constructor && !ee.call(t, "constructor") && !ee.call(t.constructor.prototype, "isPrototypeOf")) return !1
            } catch (n) {
                return !1
            }
            if (ne.ownLast)
                for (e in t) return ee.call(t, e);
            for (e in t);
            return void 0 === e || ee.call(t, e)
        },
        type: function(t) {
            return null == t ? t + "" : "object" == typeof t || "function" == typeof t ? Z[te.call(t)] || "object" : typeof t
        },
        globalEval: function(e) {
            e && re.trim(e) && (t.execScript || function(e) {
                t.eval.call(t, e)
            })(e)
        },
        camelCase: function(t) {
            return t.replace(oe, "ms-").replace(se, ue)
        },
        nodeName: function(t, e) {
            return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
        },
        each: function(t, e, i) {
            var r, a = 0,
                o = t.length,
                s = n(t);
            if (i) {
                if (s)
                    for (; o > a && (r = e.apply(t[a], i), r !== !1); a++);
                else
                    for (a in t)
                        if (r = e.apply(t[a], i), r === !1) break
            } else if (s)
                for (; o > a && (r = e.call(t[a], a, t[a]), r !== !1); a++);
            else
                for (a in t)
                    if (r = e.call(t[a], a, t[a]), r === !1) break;
            return t
        },
        trim: function(t) {
            return null == t ? "" : (t + "").replace(ae, "")
        },
        makeArray: function(t, e) {
            var i = e || [];
            return null != t && (n(Object(t)) ? re.merge(i, "string" == typeof t ? [t] : t) : Y.call(i, t)), i
        },
        inArray: function(t, e, n) {
            var i;
            if (e) {
                if (G) return G.call(e, t, n);
                for (i = e.length, n = n ? 0 > n ? Math.max(0, i + n) : n : 0; i > n; n++)
                    if (n in e && e[n] === t) return n
            }
            return -1
        },
        merge: function(t, e) {
            for (var n = +e.length, i = 0, r = t.length; n > i;) t[r++] = e[i++];
            if (n !== n)
                for (; void 0 !== e[i];) t[r++] = e[i++];
            return t.length = r, t
        },
        grep: function(t, e, n) {
            for (var i, r = [], a = 0, o = t.length, s = !n; o > a; a++) i = !e(t[a], a), i !== s && r.push(t[a]);
            return r
        },
        map: function(t, e, i) {
            var r, a = 0,
                o = t.length,
                s = n(t),
                u = [];
            if (s)
                for (; o > a; a++) r = e(t[a], a, i), null != r && u.push(r);
            else
                for (a in t) r = e(t[a], a, i), null != r && u.push(r);
            return K.apply([], u)
        },
        guid: 1,
        proxy: function(t, e) {
            var n, i, r;
            return "string" == typeof e && (r = t[e], e = t, t = r), re.isFunction(t) ? (n = V.call(arguments, 2), i = function() {
                return t.apply(e || this, n.concat(V.call(arguments)))
            }, i.guid = t.guid = t.guid || re.guid++, i) : void 0
        },
        now: function() {
            return +new Date
        },
        support: ne
    }), re.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(t, e) {
        Z["[object " + e + "]"] = e.toLowerCase()
    });
    var le = function(t) {
        function e(t, e, n, i) {
            var r, a, o, s, u, l, d, f, p, m;
            if ((e ? e.ownerDocument || e : H) !== D && N(e), e = e || D, n = n || [], s = e.nodeType, "string" != typeof t || !t || 1 !== s && 9 !== s && 11 !== s) return n;
            if (!i && L) {
                if (11 !== s && (r = ye.exec(t)))
                    if (o = r[1]) {
                        if (9 === s) {
                            if (a = e.getElementById(o), !a || !a.parentNode) return n;
                            if (a.id === o) return n.push(a), n
                        } else if (e.ownerDocument && (a = e.ownerDocument.getElementById(o)) && M(e, a) && a.id === o) return n.push(a), n
                    } else {
                        if (r[2]) return G.apply(n, e.getElementsByTagName(t)), n;
                        if ((o = r[3]) && w.getElementsByClassName) return G.apply(n, e.getElementsByClassName(o)), n
                    }
                if (w.qsa && (!P || !P.test(t))) {
                    if (f = d = R, p = e, m = 1 !== s && t, 1 === s && "object" !== e.nodeName.toLowerCase()) {
                        for (l = T(t), (d = e.getAttribute("id")) ? f = d.replace(be, "\\$&") : e.setAttribute("id", f), f = "[id='" + f + "'] ", u = l.length; u--;) l[u] = f + h(l[u]);
                        p = _e.test(t) && c(e.parentNode) || e, m = l.join(",")
                    }
                    if (m) try {
                        return G.apply(n, p.querySelectorAll(m)), n
                    } catch (g) {} finally {
                        d || e.removeAttribute("id")
                    }
                }
            }
            return j(t.replace(ue, "$1"), e, n, i)
        }

        function n() {
            function t(n, i) {
                return e.push(n + " ") > x.cacheLength && delete t[e.shift()], t[n + " "] = i
            }
            var e = [];
            return t
        }

        function i(t) {
            return t[R] = !0, t
        }

        function r(t) {
            var e = D.createElement("div");
            try {
                return !!t(e)
            } catch (n) {
                return !1
            } finally {
                e.parentNode && e.parentNode.removeChild(e), e = null
            }
        }

        function a(t, e) {
            for (var n = t.split("|"), i = t.length; i--;) x.attrHandle[n[i]] = e
        }

        function o(t, e) {
            var n = e && t,
                i = n && 1 === t.nodeType && 1 === e.nodeType && (~e.sourceIndex || U) - (~t.sourceIndex || U);
            if (i) return i;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === e) return -1;
            return t ? 1 : -1
        }

        function s(t) {
            return function(e) {
                var n = e.nodeName.toLowerCase();
                return "input" === n && e.type === t
            }
        }

        function u(t) {
            return function(e) {
                var n = e.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && e.type === t
            }
        }

        function l(t) {
            return i(function(e) {
                return e = +e, i(function(n, i) {
                    for (var r, a = t([], n.length, e), o = a.length; o--;) n[r = a[o]] && (n[r] = !(i[r] = n[r]))
                })
            })
        }

        function c(t) {
            return t && "undefined" != typeof t.getElementsByTagName && t
        }

        function d() {}

        function h(t) {
            for (var e = 0, n = t.length, i = ""; n > e; e++) i += t[e].value;
            return i
        }

        function f(t, e, n) {
            var i = e.dir,
                r = n && "parentNode" === i,
                a = z++;
            return e.first ? function(e, n, a) {
                for (; e = e[i];)
                    if (1 === e.nodeType || r) return t(e, n, a)
            } : function(e, n, o) {
                var s, u, l = [F, a];
                if (o) {
                    for (; e = e[i];)
                        if ((1 === e.nodeType || r) && t(e, n, o)) return !0
                } else
                    for (; e = e[i];)
                        if (1 === e.nodeType || r) {
                            if (u = e[R] || (e[R] = {}), (s = u[i]) && s[0] === F && s[1] === a) return l[2] = s[2];
                            if (u[i] = l, l[2] = t(e, n, o)) return !0
                        }
            }
        }

        function p(t) {
            return t.length > 1 ? function(e, n, i) {
                for (var r = t.length; r--;)
                    if (!t[r](e, n, i)) return !1;
                return !0
            } : t[0]
        }

        function m(t, n, i) {
            for (var r = 0, a = n.length; a > r; r++) e(t, n[r], i);
            return i
        }

        function g(t, e, n, i, r) {
            for (var a, o = [], s = 0, u = t.length, l = null != e; u > s; s++)(a = t[s]) && (!n || n(a, i, r)) && (o.push(a), l && e.push(s));
            return o
        }

        function v(t, e, n, r, a, o) {
            return r && !r[R] && (r = v(r)), a && !a[R] && (a = v(a, o)), i(function(i, o, s, u) {
                var l, c, d, h = [],
                    f = [],
                    p = o.length,
                    v = i || m(e || "*", s.nodeType ? [s] : s, []),
                    y = !t || !i && e ? v : g(v, h, t, s, u),
                    _ = n ? a || (i ? t : p || r) ? [] : o : y;
                if (n && n(y, _, s, u), r)
                    for (l = g(_, f), r(l, [], s, u), c = l.length; c--;)(d = l[c]) && (_[f[c]] = !(y[f[c]] = d));
                if (i) {
                    if (a || t) {
                        if (a) {
                            for (l = [], c = _.length; c--;)(d = _[c]) && l.push(y[c] = d);
                            a(null, _ = [], l, u)
                        }
                        for (c = _.length; c--;)(d = _[c]) && (l = a ? te(i, d) : h[c]) > -1 && (i[l] = !(o[l] = d))
                    }
                } else _ = g(_ === o ? _.splice(p, _.length) : _), a ? a(null, o, _, u) : G.apply(o, _)
            })
        }

        function y(t) {
            for (var e, n, i, r = t.length, a = x.relative[t[0].type], o = a || x.relative[" "], s = a ? 1 : 0, u = f(function(t) {
                    return t === e
                }, o, !0), l = f(function(t) {
                    return te(e, t) > -1
                }, o, !0), c = [function(t, n, i) {
                    var r = !a && (i || n !== S) || ((e = n).nodeType ? u(t, n, i) : l(t, n, i));
                    return e = null, r
                }]; r > s; s++)
                if (n = x.relative[t[s].type]) c = [f(p(c), n)];
                else {
                    if (n = x.filter[t[s].type].apply(null, t[s].matches), n[R]) {
                        for (i = ++s; r > i && !x.relative[t[i].type]; i++);
                        return v(s > 1 && p(c), s > 1 && h(t.slice(0, s - 1).concat({
                            value: " " === t[s - 2].type ? "*" : ""
                        })).replace(ue, "$1"), n, i > s && y(t.slice(s, i)), r > i && y(t = t.slice(i)), r > i && h(t))
                    }
                    c.push(n)
                }
            return p(c)
        }

        function _(t, n) {
            var r = n.length > 0,
                a = t.length > 0,
                o = function(i, o, s, u, l) {
                    var c, d, h, f = 0,
                        p = "0",
                        m = i && [],
                        v = [],
                        y = S,
                        _ = i || a && x.find.TAG("*", l),
                        b = F += null == y ? 1 : Math.random() || .1,
                        w = _.length;
                    for (l && (S = o !== D && o); p !== w && null != (c = _[p]); p++) {
                        if (a && c) {
                            for (d = 0; h = t[d++];)
                                if (h(c, o, s)) {
                                    u.push(c);
                                    break
                                }
                            l && (F = b)
                        }
                        r && ((c = !h && c) && f--, i && m.push(c))
                    }
                    if (f += p, r && p !== f) {
                        for (d = 0; h = n[d++];) h(m, v, o, s);
                        if (i) {
                            if (f > 0)
                                for (; p--;) m[p] || v[p] || (v[p] = K.call(u));
                            v = g(v)
                        }
                        G.apply(u, v), l && !i && v.length > 0 && f + n.length > 1 && e.uniqueSort(u)
                    }
                    return l && (F = b, S = y), m
                };
            return r ? i(o) : o
        }
        var b, w, x, k, C, T, $, j, S, E, A, N, D, I, L, P, q, O, M, R = "sizzle" + 1 * new Date,
            H = t.document,
            F = 0,
            z = 0,
            B = n(),
            W = n(),
            X = n(),
            Q = function(t, e) {
                return t === e && (A = !0), 0
            },
            U = 1 << 31,
            J = {}.hasOwnProperty,
            V = [],
            K = V.pop,
            Y = V.push,
            G = V.push,
            Z = V.slice,
            te = function(t, e) {
                for (var n = 0, i = t.length; i > n; n++)
                    if (t[n] === e) return n;
                return -1
            },
            ee = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            ne = "[\\x20\\t\\r\\n\\f]",
            ie = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            re = ie.replace("w", "w#"),
            ae = "\\[" + ne + "*(" + ie + ")(?:" + ne + "*([*^$|!~]?=)" + ne + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + re + "))|)" + ne + "*\\]",
            oe = ":(" + ie + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ae + ")*)|.*)\\)|)",
            se = new RegExp(ne + "+", "g"),
            ue = new RegExp("^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$", "g"),
            le = new RegExp("^" + ne + "*," + ne + "*"),
            ce = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"),
            de = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]", "g"),
            he = new RegExp(oe),
            fe = new RegExp("^" + re + "$"),
            pe = {
                ID: new RegExp("^#(" + ie + ")"),
                CLASS: new RegExp("^\\.(" + ie + ")"),
                TAG: new RegExp("^(" + ie.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + ae),
                PSEUDO: new RegExp("^" + oe),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ne + "*(even|odd|(([+-]|)(\\d*)n|)" + ne + "*(?:([+-]|)" + ne + "*(\\d+)|))" + ne + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + ee + ")$", "i"),
                needsContext: new RegExp("^" + ne + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ne + "*((?:-\\d)?\\d*)" + ne + "*\\)|)(?=[^-]|$)", "i")
            },
            me = /^(?:input|select|textarea|button)$/i,
            ge = /^h\d$/i,
            ve = /^[^{]+\{\s*\[native \w/,
            ye = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            _e = /[+~]/,
            be = /'|\\/g,
            we = new RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)", "ig"),
            xe = function(t, e, n) {
                var i = "0x" + e - 65536;
                return i !== i || n ? e : 0 > i ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
            },
            ke = function() {
                N()
            };
        try {
            G.apply(V = Z.call(H.childNodes), H.childNodes), V[H.childNodes.length].nodeType
        } catch (Ce) {
            G = {
                apply: V.length ? function(t, e) {
                    Y.apply(t, Z.call(e))
                } : function(t, e) {
                    for (var n = t.length, i = 0; t[n++] = e[i++];);
                    t.length = n - 1
                }
            }
        }
        w = e.support = {}, C = e.isXML = function(t) {
            var e = t && (t.ownerDocument || t).documentElement;
            return e ? "HTML" !== e.nodeName : !1
        }, N = e.setDocument = function(t) {
            var e, n, i = t ? t.ownerDocument || t : H;
            return i !== D && 9 === i.nodeType && i.documentElement ? (D = i, I = i.documentElement, n = i.defaultView, n && n !== n.top && (n.addEventListener ? n.addEventListener("unload", ke, !1) : n.attachEvent && n.attachEvent("onunload", ke)), L = !C(i), w.attributes = r(function(t) {
                return t.className = "i", !t.getAttribute("className")
            }), w.getElementsByTagName = r(function(t) {
                return t.appendChild(i.createComment("")), !t.getElementsByTagName("*").length
            }), w.getElementsByClassName = ve.test(i.getElementsByClassName), w.getById = r(function(t) {
                return I.appendChild(t).id = R, !i.getElementsByName || !i.getElementsByName(R).length
            }), w.getById ? (x.find.ID = function(t, e) {
                if ("undefined" != typeof e.getElementById && L) {
                    var n = e.getElementById(t);
                    return n && n.parentNode ? [n] : []
                }
            }, x.filter.ID = function(t) {
                var e = t.replace(we, xe);
                return function(t) {
                    return t.getAttribute("id") === e
                }
            }) : (delete x.find.ID, x.filter.ID = function(t) {
                var e = t.replace(we, xe);
                return function(t) {
                    var n = "undefined" != typeof t.getAttributeNode && t.getAttributeNode("id");
                    return n && n.value === e
                }
            }), x.find.TAG = w.getElementsByTagName ? function(t, e) {
                return "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t) : w.qsa ? e.querySelectorAll(t) : void 0
            } : function(t, e) {
                var n, i = [],
                    r = 0,
                    a = e.getElementsByTagName(t);
                if ("*" === t) {
                    for (; n = a[r++];) 1 === n.nodeType && i.push(n);
                    return i
                }
                return a
            }, x.find.CLASS = w.getElementsByClassName && function(t, e) {
                return L ? e.getElementsByClassName(t) : void 0
            }, q = [], P = [], (w.qsa = ve.test(i.querySelectorAll)) && (r(function(t) {
                I.appendChild(t).innerHTML = "<a id='" + R + "'></a><select id='" + R + "-\f]' msallowcapture=''><option selected=''></option></select>", t.querySelectorAll("[msallowcapture^='']").length && P.push("[*^$]=" + ne + "*(?:''|\"\")"), t.querySelectorAll("[selected]").length || P.push("\\[" + ne + "*(?:value|" + ee + ")"), t.querySelectorAll("[id~=" + R + "-]").length || P.push("~="), t.querySelectorAll(":checked").length || P.push(":checked"), t.querySelectorAll("a#" + R + "+*").length || P.push(".#.+[+~]")
            }), r(function(t) {
                var e = i.createElement("input");
                e.setAttribute("type", "hidden"), t.appendChild(e).setAttribute("name", "D"), t.querySelectorAll("[name=d]").length && P.push("name" + ne + "*[*^$|!~]?="), t.querySelectorAll(":enabled").length || P.push(":enabled", ":disabled"), t.querySelectorAll("*,:x"), P.push(",.*:")
            })), (w.matchesSelector = ve.test(O = I.matches || I.webkitMatchesSelector || I.mozMatchesSelector || I.oMatchesSelector || I.msMatchesSelector)) && r(function(t) {
                w.disconnectedMatch = O.call(t, "div"), O.call(t, "[s!='']:x"), q.push("!=", oe)
            }), P = P.length && new RegExp(P.join("|")), q = q.length && new RegExp(q.join("|")), e = ve.test(I.compareDocumentPosition), M = e || ve.test(I.contains) ? function(t, e) {
                var n = 9 === t.nodeType ? t.documentElement : t,
                    i = e && e.parentNode;
                return t === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : t.compareDocumentPosition && 16 & t.compareDocumentPosition(i)))
            } : function(t, e) {
                if (e)
                    for (; e = e.parentNode;)
                        if (e === t) return !0;
                return !1
            }, Q = e ? function(t, e) {
                if (t === e) return A = !0, 0;
                var n = !t.compareDocumentPosition - !e.compareDocumentPosition;
                return n ? n : (n = (t.ownerDocument || t) === (e.ownerDocument || e) ? t.compareDocumentPosition(e) : 1, 1 & n || !w.sortDetached && e.compareDocumentPosition(t) === n ? t === i || t.ownerDocument === H && M(H, t) ? -1 : e === i || e.ownerDocument === H && M(H, e) ? 1 : E ? te(E, t) - te(E, e) : 0 : 4 & n ? -1 : 1)
            } : function(t, e) {
                if (t === e) return A = !0, 0;
                var n, r = 0,
                    a = t.parentNode,
                    s = e.parentNode,
                    u = [t],
                    l = [e];
                if (!a || !s) return t === i ? -1 : e === i ? 1 : a ? -1 : s ? 1 : E ? te(E, t) - te(E, e) : 0;
                if (a === s) return o(t, e);
                for (n = t; n = n.parentNode;) u.unshift(n);
                for (n = e; n = n.parentNode;) l.unshift(n);
                for (; u[r] === l[r];) r++;
                return r ? o(u[r], l[r]) : u[r] === H ? -1 : l[r] === H ? 1 : 0
            }, i) : D
        }, e.matches = function(t, n) {
            return e(t, null, null, n)
        }, e.matchesSelector = function(t, n) {
            if ((t.ownerDocument || t) !== D && N(t), n = n.replace(de, "='$1']"), !(!w.matchesSelector || !L || q && q.test(n) || P && P.test(n))) try {
                var i = O.call(t, n);
                if (i || w.disconnectedMatch || t.document && 11 !== t.document.nodeType) return i
            } catch (r) {}
            return e(n, D, null, [t]).length > 0
        }, e.contains = function(t, e) {
            return (t.ownerDocument || t) !== D && N(t), M(t, e)
        }, e.attr = function(t, e) {
            (t.ownerDocument || t) !== D && N(t);
            var n = x.attrHandle[e.toLowerCase()],
                i = n && J.call(x.attrHandle, e.toLowerCase()) ? n(t, e, !L) : void 0;
            return void 0 !== i ? i : w.attributes || !L ? t.getAttribute(e) : (i = t.getAttributeNode(e)) && i.specified ? i.value : null
        }, e.error = function(t) {
            throw new Error("Syntax error, unrecognized expression: " + t)
        }, e.uniqueSort = function(t) {
            var e, n = [],
                i = 0,
                r = 0;
            if (A = !w.detectDuplicates, E = !w.sortStable && t.slice(0), t.sort(Q), A) {
                for (; e = t[r++];) e === t[r] && (i = n.push(r));
                for (; i--;) t.splice(n[i], 1)
            }
            return E = null, t
        }, k = e.getText = function(t) {
            var e, n = "",
                i = 0,
                r = t.nodeType;
            if (r) {
                if (1 === r || 9 === r || 11 === r) {
                    if ("string" == typeof t.textContent) return t.textContent;
                    for (t = t.firstChild; t; t = t.nextSibling) n += k(t)
                } else if (3 === r || 4 === r) return t.nodeValue
            } else
                for (; e = t[i++];) n += k(e);
            return n
        }, x = e.selectors = {
            cacheLength: 50,
            createPseudo: i,
            match: pe,
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
                ATTR: function(t) {
                    return t[1] = t[1].replace(we, xe), t[3] = (t[3] || t[4] || t[5] || "").replace(we, xe), "~=" === t[2] && (t[3] = " " + t[3] + " "), t.slice(0, 4)
                },
                CHILD: function(t) {
                    return t[1] = t[1].toLowerCase(), "nth" === t[1].slice(0, 3) ? (t[3] || e.error(t[0]), t[4] = +(t[4] ? t[5] + (t[6] || 1) : 2 * ("even" === t[3] || "odd" === t[3])), t[5] = +(t[7] + t[8] || "odd" === t[3])) : t[3] && e.error(t[0]), t
                },
                PSEUDO: function(t) {
                    var e, n = !t[6] && t[2];
                    return pe.CHILD.test(t[0]) ? null : (t[3] ? t[2] = t[4] || t[5] || "" : n && he.test(n) && (e = T(n, !0)) && (e = n.indexOf(")", n.length - e) - n.length) && (t[0] = t[0].slice(0, e), t[2] = n.slice(0, e)), t.slice(0, 3))
                }
            },
            filter: {
                TAG: function(t) {
                    var e = t.replace(we, xe).toLowerCase();
                    return "*" === t ? function() {
                        return !0
                    } : function(t) {
                        return t.nodeName && t.nodeName.toLowerCase() === e
                    }
                },
                CLASS: function(t) {
                    var e = B[t + " "];
                    return e || (e = new RegExp("(^|" + ne + ")" + t + "(" + ne + "|$)")) && B(t, function(t) {
                        return e.test("string" == typeof t.className && t.className || "undefined" != typeof t.getAttribute && t.getAttribute("class") || "")
                    })
                },
                ATTR: function(t, n, i) {
                    return function(r) {
                        var a = e.attr(r, t);
                        return null == a ? "!=" === n : n ? (a += "", "=" === n ? a === i : "!=" === n ? a !== i : "^=" === n ? i && 0 === a.indexOf(i) : "*=" === n ? i && a.indexOf(i) > -1 : "$=" === n ? i && a.slice(-i.length) === i : "~=" === n ? (" " + a.replace(se, " ") + " ").indexOf(i) > -1 : "|=" === n ? a === i || a.slice(0, i.length + 1) === i + "-" : !1) : !0
                    }
                },
                CHILD: function(t, e, n, i, r) {
                    var a = "nth" !== t.slice(0, 3),
                        o = "last" !== t.slice(-4),
                        s = "of-type" === e;
                    return 1 === i && 0 === r ? function(t) {
                        return !!t.parentNode
                    } : function(e, n, u) {
                        var l, c, d, h, f, p, m = a !== o ? "nextSibling" : "previousSibling",
                            g = e.parentNode,
                            v = s && e.nodeName.toLowerCase(),
                            y = !u && !s;
                        if (g) {
                            if (a) {
                                for (; m;) {
                                    for (d = e; d = d[m];)
                                        if (s ? d.nodeName.toLowerCase() === v : 1 === d.nodeType) return !1;
                                    p = m = "only" === t && !p && "nextSibling"
                                }
                                return !0
                            }
                            if (p = [o ? g.firstChild : g.lastChild], o && y) {
                                for (c = g[R] || (g[R] = {}), l = c[t] || [], f = l[0] === F && l[1], h = l[0] === F && l[2], d = f && g.childNodes[f]; d = ++f && d && d[m] || (h = f = 0) || p.pop();)
                                    if (1 === d.nodeType && ++h && d === e) {
                                        c[t] = [F, f, h];
                                        break
                                    }
                            } else if (y && (l = (e[R] || (e[R] = {}))[t]) && l[0] === F) h = l[1];
                            else
                                for (;
                                    (d = ++f && d && d[m] || (h = f = 0) || p.pop()) && ((s ? d.nodeName.toLowerCase() !== v : 1 !== d.nodeType) || !++h || (y && ((d[R] || (d[R] = {}))[t] = [F, h]), d !== e)););
                            return h -= r, h === i || h % i === 0 && h / i >= 0
                        }
                    }
                },
                PSEUDO: function(t, n) {
                    var r, a = x.pseudos[t] || x.setFilters[t.toLowerCase()] || e.error("unsupported pseudo: " + t);
                    return a[R] ? a(n) : a.length > 1 ? (r = [t, t, "", n], x.setFilters.hasOwnProperty(t.toLowerCase()) ? i(function(t, e) {
                        for (var i, r = a(t, n), o = r.length; o--;) i = te(t, r[o]), t[i] = !(e[i] = r[o])
                    }) : function(t) {
                        return a(t, 0, r)
                    }) : a
                }
            },
            pseudos: {
                not: i(function(t) {
                    var e = [],
                        n = [],
                        r = $(t.replace(ue, "$1"));
                    return r[R] ? i(function(t, e, n, i) {
                        for (var a, o = r(t, null, i, []), s = t.length; s--;)(a = o[s]) && (t[s] = !(e[s] = a))
                    }) : function(t, i, a) {
                        return e[0] = t, r(e, null, a, n), e[0] = null, !n.pop()
                    }
                }),
                has: i(function(t) {
                    return function(n) {
                        return e(t, n).length > 0
                    }
                }),
                contains: i(function(t) {
                    return t = t.replace(we, xe),
                        function(e) {
                            return (e.textContent || e.innerText || k(e)).indexOf(t) > -1
                        }
                }),
                lang: i(function(t) {
                    return fe.test(t || "") || e.error("unsupported lang: " + t), t = t.replace(we, xe).toLowerCase(),
                        function(e) {
                            var n;
                            do
                                if (n = L ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) return n = n.toLowerCase(), n === t || 0 === n.indexOf(t + "-"); while ((e = e.parentNode) && 1 === e.nodeType);
                            return !1
                        }
                }),
                target: function(e) {
                    var n = t.location && t.location.hash;
                    return n && n.slice(1) === e.id
                },
                root: function(t) {
                    return t === I
                },
                focus: function(t) {
                    return t === D.activeElement && (!D.hasFocus || D.hasFocus()) && !!(t.type || t.href || ~t.tabIndex)
                },
                enabled: function(t) {
                    return t.disabled === !1
                },
                disabled: function(t) {
                    return t.disabled === !0
                },
                checked: function(t) {
                    var e = t.nodeName.toLowerCase();
                    return "input" === e && !!t.checked || "option" === e && !!t.selected
                },
                selected: function(t) {
                    return t.parentNode && t.parentNode.selectedIndex, t.selected === !0
                },
                empty: function(t) {
                    for (t = t.firstChild; t; t = t.nextSibling)
                        if (t.nodeType < 6) return !1;
                    return !0
                },
                parent: function(t) {
                    return !x.pseudos.empty(t)
                },
                header: function(t) {
                    return ge.test(t.nodeName)
                },
                input: function(t) {
                    return me.test(t.nodeName)
                },
                button: function(t) {
                    var e = t.nodeName.toLowerCase();
                    return "input" === e && "button" === t.type || "button" === e
                },
                text: function(t) {
                    var e;
                    return "input" === t.nodeName.toLowerCase() && "text" === t.type && (null == (e = t.getAttribute("type")) || "text" === e.toLowerCase())
                },
                first: l(function() {
                    return [0]
                }),
                last: l(function(t, e) {
                    return [e - 1]
                }),
                eq: l(function(t, e, n) {
                    return [0 > n ? n + e : n]
                }),
                even: l(function(t, e) {
                    for (var n = 0; e > n; n += 2) t.push(n);
                    return t
                }),
                odd: l(function(t, e) {
                    for (var n = 1; e > n; n += 2) t.push(n);
                    return t
                }),
                lt: l(function(t, e, n) {
                    for (var i = 0 > n ? n + e : n; --i >= 0;) t.push(i);
                    return t
                }),
                gt: l(function(t, e, n) {
                    for (var i = 0 > n ? n + e : n; ++i < e;) t.push(i);
                    return t
                })
            }
        }, x.pseudos.nth = x.pseudos.eq;
        for (b in {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) x.pseudos[b] = s(b);
        for (b in {
                submit: !0,
                reset: !0
            }) x.pseudos[b] = u(b);
        return d.prototype = x.filters = x.pseudos, x.setFilters = new d, T = e.tokenize = function(t, n) {
            var i, r, a, o, s, u, l, c = W[t + " "];
            if (c) return n ? 0 : c.slice(0);
            for (s = t, u = [], l = x.preFilter; s;) {
                (!i || (r = le.exec(s))) && (r && (s = s.slice(r[0].length) || s), u.push(a = [])), i = !1, (r = ce.exec(s)) && (i = r.shift(), a.push({
                    value: i,
                    type: r[0].replace(ue, " ")
                }), s = s.slice(i.length));
                for (o in x.filter) !(r = pe[o].exec(s)) || l[o] && !(r = l[o](r)) || (i = r.shift(), a.push({
                    value: i,
                    type: o,
                    matches: r
                }), s = s.slice(i.length));
                if (!i) break
            }
            return n ? s.length : s ? e.error(t) : W(t, u).slice(0)
        }, $ = e.compile = function(t, e) {
            var n, i = [],
                r = [],
                a = X[t + " "];
            if (!a) {
                for (e || (e = T(t)), n = e.length; n--;) a = y(e[n]), a[R] ? i.push(a) : r.push(a);
                a = X(t, _(r, i)), a.selector = t
            }
            return a
        }, j = e.select = function(t, e, n, i) {
            var r, a, o, s, u, l = "function" == typeof t && t,
                d = !i && T(t = l.selector || t);
            if (n = n || [], 1 === d.length) {
                if (a = d[0] = d[0].slice(0), a.length > 2 && "ID" === (o = a[0]).type && w.getById && 9 === e.nodeType && L && x.relative[a[1].type]) {
                    if (e = (x.find.ID(o.matches[0].replace(we, xe), e) || [])[0], !e) return n;
                    l && (e = e.parentNode), t = t.slice(a.shift().value.length)
                }
                for (r = pe.needsContext.test(t) ? 0 : a.length; r-- && (o = a[r], !x.relative[s = o.type]);)
                    if ((u = x.find[s]) && (i = u(o.matches[0].replace(we, xe), _e.test(a[0].type) && c(e.parentNode) || e))) {
                        if (a.splice(r, 1), t = i.length && h(a), !t) return G.apply(n, i), n;
                        break
                    }
            }
            return (l || $(t, d))(i, e, !L, n, _e.test(t) && c(e.parentNode) || e), n
        }, w.sortStable = R.split("").sort(Q).join("") === R, w.detectDuplicates = !!A, N(), w.sortDetached = r(function(t) {
            return 1 & t.compareDocumentPosition(D.createElement("div"))
        }), r(function(t) {
            return t.innerHTML = "<a href='#'></a>", "#" === t.firstChild.getAttribute("href")
        }) || a("type|href|height|width", function(t, e, n) {
            return n ? void 0 : t.getAttribute(e, "type" === e.toLowerCase() ? 1 : 2)
        }), w.attributes && r(function(t) {
            return t.innerHTML = "<input/>", t.firstChild.setAttribute("value", ""), "" === t.firstChild.getAttribute("value")
        }) || a("value", function(t, e, n) {
            return n || "input" !== t.nodeName.toLowerCase() ? void 0 : t.defaultValue
        }), r(function(t) {
            return null == t.getAttribute("disabled")
        }) || a(ee, function(t, e, n) {
            var i;
            return n ? void 0 : t[e] === !0 ? e.toLowerCase() : (i = t.getAttributeNode(e)) && i.specified ? i.value : null
        }), e
    }(t);
    re.find = le, re.expr = le.selectors, re.expr[":"] = re.expr.pseudos, re.unique = le.uniqueSort, re.text = le.getText, re.isXMLDoc = le.isXML, re.contains = le.contains;
    var ce = re.expr.match.needsContext,
        de = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        he = /^.[^:#\[\.,]*$/;
    re.filter = function(t, e, n) {
        var i = e[0];
        return n && (t = ":not(" + t + ")"), 1 === e.length && 1 === i.nodeType ? re.find.matchesSelector(i, t) ? [i] : [] : re.find.matches(t, re.grep(e, function(t) {
            return 1 === t.nodeType
        }))
    }, re.fn.extend({
        find: function(t) {
            var e, n = [],
                i = this,
                r = i.length;
            if ("string" != typeof t) return this.pushStack(re(t).filter(function() {
                for (e = 0; r > e; e++)
                    if (re.contains(i[e], this)) return !0
            }));
            for (e = 0; r > e; e++) re.find(t, i[e], n);
            return n = this.pushStack(r > 1 ? re.unique(n) : n), n.selector = this.selector ? this.selector + " " + t : t, n
        },
        filter: function(t) {
            return this.pushStack(i(this, t || [], !1))
        },
        not: function(t) {
            return this.pushStack(i(this, t || [], !0))
        },
        is: function(t) {
            return !!i(this, "string" == typeof t && ce.test(t) ? re(t) : t || [], !1).length
        }
    });
    var fe, pe = t.document,
        me = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        ge = re.fn.init = function(t, e) {
            var n, i;
            if (!t) return this;
            if ("string" == typeof t) {
                if (n = "<" === t.charAt(0) && ">" === t.charAt(t.length - 1) && t.length >= 3 ? [null, t, null] : me.exec(t), !n || !n[1] && e) return !e || e.jquery ? (e || fe).find(t) : this.constructor(e).find(t);
                if (n[1]) {
                    if (e = e instanceof re ? e[0] : e, re.merge(this, re.parseHTML(n[1], e && e.nodeType ? e.ownerDocument || e : pe, !0)), de.test(n[1]) && re.isPlainObject(e))
                        for (n in e) re.isFunction(this[n]) ? this[n](e[n]) : this.attr(n, e[n]);
                    return this
                }
                if (i = pe.getElementById(n[2]), i && i.parentNode) {
                    if (i.id !== n[2]) return fe.find(t);
                    this.length = 1, this[0] = i
                }
                return this.context = pe, this.selector = t, this
            }
            return t.nodeType ? (this.context = this[0] = t, this.length = 1, this) : re.isFunction(t) ? "undefined" != typeof fe.ready ? fe.ready(t) : t(re) : (void 0 !== t.selector && (this.selector = t.selector, this.context = t.context), re.makeArray(t, this))
        };
    ge.prototype = re.fn, fe = re(pe);
    var ve = /^(?:parents|prev(?:Until|All))/,
        ye = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    re.extend({
        dir: function(t, e, n) {
            for (var i = [], r = t[e]; r && 9 !== r.nodeType && (void 0 === n || 1 !== r.nodeType || !re(r).is(n));) 1 === r.nodeType && i.push(r), r = r[e];
            return i
        },
        sibling: function(t, e) {
            for (var n = []; t; t = t.nextSibling) 1 === t.nodeType && t !== e && n.push(t);
            return n
        }
    }), re.fn.extend({
        has: function(t) {
            var e, n = re(t, this),
                i = n.length;
            return this.filter(function() {
                for (e = 0; i > e; e++)
                    if (re.contains(this, n[e])) return !0
            })
        },
        closest: function(t, e) {
            for (var n, i = 0, r = this.length, a = [], o = ce.test(t) || "string" != typeof t ? re(t, e || this.context) : 0; r > i; i++)
                for (n = this[i]; n && n !== e; n = n.parentNode)
                    if (n.nodeType < 11 && (o ? o.index(n) > -1 : 1 === n.nodeType && re.find.matchesSelector(n, t))) {
                        a.push(n);
                        break
                    }
            return this.pushStack(a.length > 1 ? re.unique(a) : a)
        },
        index: function(t) {
            return t ? "string" == typeof t ? re.inArray(this[0], re(t)) : re.inArray(t.jquery ? t[0] : t, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(t, e) {
            return this.pushStack(re.unique(re.merge(this.get(), re(t, e))))
        },
        addBack: function(t) {
            return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
        }
    }), re.each({
        parent: function(t) {
            var e = t.parentNode;
            return e && 11 !== e.nodeType ? e : null
        },
        parents: function(t) {
            return re.dir(t, "parentNode")
        },
        parentsUntil: function(t, e, n) {
            return re.dir(t, "parentNode", n)
        },
        next: function(t) {
            return r(t, "nextSibling")
        },
        prev: function(t) {
            return r(t, "previousSibling")
        },
        nextAll: function(t) {
            return re.dir(t, "nextSibling")
        },
        prevAll: function(t) {
            return re.dir(t, "previousSibling")
        },
        nextUntil: function(t, e, n) {
            return re.dir(t, "nextSibling", n)
        },
        prevUntil: function(t, e, n) {
            return re.dir(t, "previousSibling", n)
        },
        siblings: function(t) {
            return re.sibling((t.parentNode || {}).firstChild, t)
        },
        children: function(t) {
            return re.sibling(t.firstChild)
        },
        contents: function(t) {
            return re.nodeName(t, "iframe") ? t.contentDocument || t.contentWindow.document : re.merge([], t.childNodes)
        }
    }, function(t, e) {
        re.fn[t] = function(n, i) {
            var r = re.map(this, e, n);
            return "Until" !== t.slice(-5) && (i = n), i && "string" == typeof i && (r = re.filter(i, r)), this.length > 1 && (ye[t] || (r = re.unique(r)), ve.test(t) && (r = r.reverse())), this.pushStack(r)
        }
    });
    var _e = /\S+/g,
        be = {};
    re.Callbacks = function(t) {
        t = "string" == typeof t ? be[t] || a(t) : re.extend({}, t);
        var e, n, i, r, o, s, u = [],
            l = !t.once && [],
            c = function(a) {
                for (n = t.memory && a, i = !0, o = s || 0, s = 0, r = u.length, e = !0; u && r > o; o++)
                    if (u[o].apply(a[0], a[1]) === !1 && t.stopOnFalse) {
                        n = !1;
                        break
                    }
                e = !1, u && (l ? l.length && c(l.shift()) : n ? u = [] : d.disable())
            },
            d = {
                add: function() {
                    if (u) {
                        var i = u.length;
                        ! function a(e) {
                            re.each(e, function(e, n) {
                                var i = re.type(n);
                                "function" === i ? t.unique && d.has(n) || u.push(n) : n && n.length && "string" !== i && a(n)
                            })
                        }(arguments), e ? r = u.length : n && (s = i, c(n))
                    }
                    return this
                },
                remove: function() {
                    return u && re.each(arguments, function(t, n) {
                        for (var i;
                            (i = re.inArray(n, u, i)) > -1;) u.splice(i, 1), e && (r >= i && r--, o >= i && o--)
                    }), this
                },
                has: function(t) {
                    return t ? re.inArray(t, u) > -1 : !(!u || !u.length)
                },
                empty: function() {
                    return u = [], r = 0, this
                },
                disable: function() {
                    return u = l = n = void 0, this
                },
                disabled: function() {
                    return !u
                },
                lock: function() {
                    return l = void 0, n || d.disable(), this
                },
                locked: function() {
                    return !l
                },
                fireWith: function(t, n) {
                    return !u || i && !l || (n = n || [], n = [t, n.slice ? n.slice() : n], e ? l.push(n) : c(n)), this
                },
                fire: function() {
                    return d.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!i
                }
            };
        return d
    }, re.extend({
        Deferred: function(t) {
            var e = [
                    ["resolve", "done", re.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", re.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", re.Callbacks("memory")]
                ],
                n = "pending",
                i = {
                    state: function() {
                        return n
                    },
                    always: function() {
                        return r.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var t = arguments;
                        return re.Deferred(function(n) {
                            re.each(e, function(e, a) {
                                var o = re.isFunction(t[e]) && t[e];
                                r[a[1]](function() {
                                    var t = o && o.apply(this, arguments);
                                    t && re.isFunction(t.promise) ? t.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[a[0] + "With"](this === i ? n.promise() : this, o ? [t] : arguments)
                                })
                            }), t = null
                        }).promise()
                    },
                    promise: function(t) {
                        return null != t ? re.extend(t, i) : i
                    }
                },
                r = {};
            return i.pipe = i.then, re.each(e, function(t, a) {
                var o = a[2],
                    s = a[3];
                i[a[1]] = o.add, s && o.add(function() {
                    n = s
                }, e[1 ^ t][2].disable, e[2][2].lock), r[a[0]] = function() {
                    return r[a[0] + "With"](this === r ? i : this, arguments), this
                }, r[a[0] + "With"] = o.fireWith
            }), i.promise(r), t && t.call(r, r), r
        },
        when: function(t) {
            var e, n, i, r = 0,
                a = V.call(arguments),
                o = a.length,
                s = 1 !== o || t && re.isFunction(t.promise) ? o : 0,
                u = 1 === s ? t : re.Deferred(),
                l = function(t, n, i) {
                    return function(r) {
                        n[t] = this, i[t] = arguments.length > 1 ? V.call(arguments) : r, i === e ? u.notifyWith(n, i) : --s || u.resolveWith(n, i)
                    }
                };
            if (o > 1)
                for (e = new Array(o), n = new Array(o), i = new Array(o); o > r; r++) a[r] && re.isFunction(a[r].promise) ? a[r].promise().done(l(r, i, a)).fail(u.reject).progress(l(r, n, e)) : --s;
            return s || u.resolveWith(i, a), u.promise()
        }
    });
    var we;
    re.fn.ready = function(t) {
        return re.ready.promise().done(t), this
    }, re.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(t) {
            t ? re.readyWait++ : re.ready(!0)
        },
        ready: function(t) {
            if (t === !0 ? !--re.readyWait : !re.isReady) {
                if (!pe.body) return setTimeout(re.ready);
                re.isReady = !0, t !== !0 && --re.readyWait > 0 || (we.resolveWith(pe, [re]), re.fn.triggerHandler && (re(pe).triggerHandler("ready"), re(pe).off("ready")))
            }
        }
    }), re.ready.promise = function(e) {
        if (!we)
            if (we = re.Deferred(), "complete" === pe.readyState) setTimeout(re.ready);
            else if (pe.addEventListener) pe.addEventListener("DOMContentLoaded", s, !1), t.addEventListener("load", s, !1);
        else {
            pe.attachEvent("onreadystatechange", s), t.attachEvent("onload", s);
            var n = !1;
            try {
                n = null == t.frameElement && pe.documentElement
            } catch (i) {}
            n && n.doScroll && ! function r() {
                if (!re.isReady) {
                    try {
                        n.doScroll("left")
                    } catch (t) {
                        return setTimeout(r, 50)
                    }
                    o(), re.ready()
                }
            }()
        }
        return we.promise(e)
    };
    var xe, ke = "undefined";
    for (xe in re(ne)) break;
    ne.ownLast = "0" !== xe, ne.inlineBlockNeedsLayout = !1, re(function() {
            var t, e, n, i;
            n = pe.getElementsByTagName("body")[0], n && n.style && (e = pe.createElement("div"), i = pe.createElement("div"), i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(e), typeof e.style.zoom !== ke && (e.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", ne.inlineBlockNeedsLayout = t = 3 === e.offsetWidth, t && (n.style.zoom = 1)), n.removeChild(i))
        }),
        function() {
            var t = pe.createElement("div");
            if (null == ne.deleteExpando) {
                ne.deleteExpando = !0;
                try {
                    delete t.test
                } catch (e) {
                    ne.deleteExpando = !1
                }
            }
            t = null
        }(), re.acceptData = function(t) {
            var e = re.noData[(t.nodeName + " ").toLowerCase()],
                n = +t.nodeType || 1;
            return 1 !== n && 9 !== n ? !1 : !e || e !== !0 && t.getAttribute("classid") === e
        };
    var Ce = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Te = /([A-Z])/g;
    re.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(t) {
            return t = t.nodeType ? re.cache[t[re.expando]] : t[re.expando], !!t && !l(t)
        },
        data: function(t, e, n) {
            return c(t, e, n)
        },
        removeData: function(t, e) {
            return d(t, e)
        },
        _data: function(t, e, n) {
            return c(t, e, n, !0)
        },
        _removeData: function(t, e) {
            return d(t, e, !0)
        }
    }), re.fn.extend({
        data: function(t, e) {
            var n, i, r, a = this[0],
                o = a && a.attributes;
            if (void 0 === t) {
                if (this.length && (r = re.data(a), 1 === a.nodeType && !re._data(a, "parsedAttrs"))) {
                    for (n = o.length; n--;) o[n] && (i = o[n].name, 0 === i.indexOf("data-") && (i = re.camelCase(i.slice(5)), u(a, i, r[i])));
                    re._data(a, "parsedAttrs", !0)
                }
                return r
            }
            return "object" == typeof t ? this.each(function() {
                re.data(this, t)
            }) : arguments.length > 1 ? this.each(function() {
                re.data(this, t, e)
            }) : a ? u(a, t, re.data(a, t)) : void 0
        },
        removeData: function(t) {
            return this.each(function() {
                re.removeData(this, t)
            })
        }
    }), re.extend({
        queue: function(t, e, n) {
            var i;
            return t ? (e = (e || "fx") + "queue", i = re._data(t, e), n && (!i || re.isArray(n) ? i = re._data(t, e, re.makeArray(n)) : i.push(n)), i || []) : void 0
        },
        dequeue: function(t, e) {
            e = e || "fx";
            var n = re.queue(t, e),
                i = n.length,
                r = n.shift(),
                a = re._queueHooks(t, e),
                o = function() {
                    re.dequeue(t, e)
                };
            "inprogress" === r && (r = n.shift(), i--), r && ("fx" === e && n.unshift("inprogress"), delete a.stop, r.call(t, o, a)), !i && a && a.empty.fire()
        },
        _queueHooks: function(t, e) {
            var n = e + "queueHooks";
            return re._data(t, n) || re._data(t, n, {
                empty: re.Callbacks("once memory").add(function() {
                    re._removeData(t, e + "queue"), re._removeData(t, n)
                })
            })
        }
    }), re.fn.extend({
        queue: function(t, e) {
            var n = 2;
            return "string" != typeof t && (e = t, t = "fx", n--), arguments.length < n ? re.queue(this[0], t) : void 0 === e ? this : this.each(function() {
                var n = re.queue(this, t, e);
                re._queueHooks(this, t), "fx" === t && "inprogress" !== n[0] && re.dequeue(this, t)
            })
        },
        dequeue: function(t) {
            return this.each(function() {
                re.dequeue(this, t)
            })
        },
        clearQueue: function(t) {
            return this.queue(t || "fx", [])
        },
        promise: function(t, e) {
            var n, i = 1,
                r = re.Deferred(),
                a = this,
                o = this.length,
                s = function() {
                    --i || r.resolveWith(a, [a])
                };
            for ("string" != typeof t && (e = t, t = void 0), t = t || "fx"; o--;) n = re._data(a[o], t + "queueHooks"), n && n.empty && (i++, n.empty.add(s));
            return s(), r.promise(e)
        }
    });
    var $e = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        je = ["Top", "Right", "Bottom", "Left"],
        Se = function(t, e) {
            return t = e || t, "none" === re.css(t, "display") || !re.contains(t.ownerDocument, t)
        },
        Ee = re.access = function(t, e, n, i, r, a, o) {
            var s = 0,
                u = t.length,
                l = null == n;
            if ("object" === re.type(n)) {
                r = !0;
                for (s in n) re.access(t, e, s, n[s], !0, a, o)
            } else if (void 0 !== i && (r = !0, re.isFunction(i) || (o = !0), l && (o ? (e.call(t, i), e = null) : (l = e, e = function(t, e, n) {
                    return l.call(re(t), n)
                })), e))
                for (; u > s; s++) e(t[s], n, o ? i : i.call(t[s], s, e(t[s], n)));
            return r ? t : l ? e.call(t) : u ? e(t[0], n) : a
        },
        Ae = /^(?:checkbox|radio)$/i;
    ! function() {
        var t = pe.createElement("input"),
            e = pe.createElement("div"),
            n = pe.createDocumentFragment();
        if (e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", ne.leadingWhitespace = 3 === e.firstChild.nodeType, ne.tbody = !e.getElementsByTagName("tbody").length, ne.htmlSerialize = !!e.getElementsByTagName("link").length, ne.html5Clone = "<:nav></:nav>" !== pe.createElement("nav").cloneNode(!0).outerHTML, t.type = "checkbox", t.checked = !0, n.appendChild(t), ne.appendChecked = t.checked, e.innerHTML = "<textarea>x</textarea>", ne.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue, n.appendChild(e), e.innerHTML = "<input type='radio' checked='checked' name='t'/>", ne.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked, ne.noCloneEvent = !0, e.attachEvent && (e.attachEvent("onclick", function() {
                ne.noCloneEvent = !1
            }), e.cloneNode(!0).click()), null == ne.deleteExpando) {
            ne.deleteExpando = !0;
            try {
                delete e.test
            } catch (i) {
                ne.deleteExpando = !1
            }
        }
    }(),
    function() {
        var e, n, i = pe.createElement("div");
        for (e in {
                submit: !0,
                change: !0,
                focusin: !0
            }) n = "on" + e, (ne[e + "Bubbles"] = n in t) || (i.setAttribute(n, "t"), ne[e + "Bubbles"] = i.attributes[n].expando === !1);
        i = null
    }();
    var Ne = /^(?:input|select|textarea)$/i,
        De = /^key/,
        Ie = /^(?:mouse|pointer|contextmenu)|click/,
        Le = /^(?:focusinfocus|focusoutblur)$/,
        Pe = /^([^.]*)(?:\.(.+)|)$/;
    re.event = {
        global: {},
        add: function(t, e, n, i, r) {
            var a, o, s, u, l, c, d, h, f, p, m, g = re._data(t);
            if (g) {
                for (n.handler && (u = n, n = u.handler, r = u.selector), n.guid || (n.guid = re.guid++), (o = g.events) || (o = g.events = {}), (c = g.handle) || (c = g.handle = function(t) {
                        return typeof re === ke || t && re.event.triggered === t.type ? void 0 : re.event.dispatch.apply(c.elem, arguments)
                    }, c.elem = t), e = (e || "").match(_e) || [""], s = e.length; s--;) a = Pe.exec(e[s]) || [], f = m = a[1], p = (a[2] || "").split(".").sort(), f && (l = re.event.special[f] || {}, f = (r ? l.delegateType : l.bindType) || f, l = re.event.special[f] || {}, d = re.extend({
                    type: f,
                    origType: m,
                    data: i,
                    handler: n,
                    guid: n.guid,
                    selector: r,
                    needsContext: r && re.expr.match.needsContext.test(r),
                    namespace: p.join(".")
                }, u), (h = o[f]) || (h = o[f] = [], h.delegateCount = 0, l.setup && l.setup.call(t, i, p, c) !== !1 || (t.addEventListener ? t.addEventListener(f, c, !1) : t.attachEvent && t.attachEvent("on" + f, c))), l.add && (l.add.call(t, d), d.handler.guid || (d.handler.guid = n.guid)), r ? h.splice(h.delegateCount++, 0, d) : h.push(d), re.event.global[f] = !0);
                t = null
            }
        },
        remove: function(t, e, n, i, r) {
            var a, o, s, u, l, c, d, h, f, p, m, g = re.hasData(t) && re._data(t);
            if (g && (c = g.events)) {
                for (e = (e || "").match(_e) || [""], l = e.length; l--;)
                    if (s = Pe.exec(e[l]) || [], f = m = s[1], p = (s[2] || "").split(".").sort(), f) {
                        for (d = re.event.special[f] || {}, f = (i ? d.delegateType : d.bindType) || f, h = c[f] || [], s = s[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), u = a = h.length; a--;) o = h[a], !r && m !== o.origType || n && n.guid !== o.guid || s && !s.test(o.namespace) || i && i !== o.selector && ("**" !== i || !o.selector) || (h.splice(a, 1), o.selector && h.delegateCount--, d.remove && d.remove.call(t, o));
                        u && !h.length && (d.teardown && d.teardown.call(t, p, g.handle) !== !1 || re.removeEvent(t, f, g.handle), delete c[f])
                    } else
                        for (f in c) re.event.remove(t, f + e[l], n, i, !0);
                re.isEmptyObject(c) && (delete g.handle, re._removeData(t, "events"))
            }
        },
        trigger: function(e, n, i, r) {
            var a, o, s, u, l, c, d, h = [i || pe],
                f = ee.call(e, "type") ? e.type : e,
                p = ee.call(e, "namespace") ? e.namespace.split(".") : [];
            if (s = c = i = i || pe, 3 !== i.nodeType && 8 !== i.nodeType && !Le.test(f + re.event.triggered) && (f.indexOf(".") >= 0 && (p = f.split("."), f = p.shift(), p.sort()), o = f.indexOf(":") < 0 && "on" + f, e = e[re.expando] ? e : new re.Event(f, "object" == typeof e && e), e.isTrigger = r ? 2 : 3, e.namespace = p.join("."), e.namespace_re = e.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = i), n = null == n ? [e] : re.makeArray(n, [e]), l = re.event.special[f] || {}, r || !l.trigger || l.trigger.apply(i, n) !== !1)) {
                if (!r && !l.noBubble && !re.isWindow(i)) {
                    for (u = l.delegateType || f, Le.test(u + f) || (s = s.parentNode); s; s = s.parentNode) h.push(s), c = s;
                    c === (i.ownerDocument || pe) && h.push(c.defaultView || c.parentWindow || t)
                }
                for (d = 0;
                    (s = h[d++]) && !e.isPropagationStopped();) e.type = d > 1 ? u : l.bindType || f, a = (re._data(s, "events") || {})[e.type] && re._data(s, "handle"), a && a.apply(s, n), a = o && s[o], a && a.apply && re.acceptData(s) && (e.result = a.apply(s, n), e.result === !1 && e.preventDefault());
                if (e.type = f, !r && !e.isDefaultPrevented() && (!l._default || l._default.apply(h.pop(), n) === !1) && re.acceptData(i) && o && i[f] && !re.isWindow(i)) {
                    c = i[o], c && (i[o] = null), re.event.triggered = f;
                    try {
                        i[f]()
                    } catch (m) {}
                    re.event.triggered = void 0, c && (i[o] = c)
                }
                return e.result
            }
        },
        dispatch: function(t) {
            t = re.event.fix(t);
            var e, n, i, r, a, o = [],
                s = V.call(arguments),
                u = (re._data(this, "events") || {})[t.type] || [],
                l = re.event.special[t.type] || {};
            if (s[0] = t, t.delegateTarget = this, !l.preDispatch || l.preDispatch.call(this, t) !== !1) {
                for (o = re.event.handlers.call(this, t, u), e = 0;
                    (r = o[e++]) && !t.isPropagationStopped();)
                    for (t.currentTarget = r.elem, a = 0;
                        (i = r.handlers[a++]) && !t.isImmediatePropagationStopped();)(!t.namespace_re || t.namespace_re.test(i.namespace)) && (t.handleObj = i, t.data = i.data, n = ((re.event.special[i.origType] || {}).handle || i.handler).apply(r.elem, s), void 0 !== n && (t.result = n) === !1 && (t.preventDefault(), t.stopPropagation()));
                return l.postDispatch && l.postDispatch.call(this, t), t.result
            }
        },
        handlers: function(t, e) {
            var n, i, r, a, o = [],
                s = e.delegateCount,
                u = t.target;
            if (s && u.nodeType && (!t.button || "click" !== t.type))
                for (; u != this; u = u.parentNode || this)
                    if (1 === u.nodeType && (u.disabled !== !0 || "click" !== t.type)) {
                        for (r = [], a = 0; s > a; a++) i = e[a], n = i.selector + " ", void 0 === r[n] && (r[n] = i.needsContext ? re(n, this).index(u) >= 0 : re.find(n, this, null, [u]).length), r[n] && r.push(i);
                        r.length && o.push({
                            elem: u,
                            handlers: r
                        })
                    }
            return s < e.length && o.push({
                elem: this,
                handlers: e.slice(s)
            }), o
        },
        fix: function(t) {
            if (t[re.expando]) return t;
            var e, n, i, r = t.type,
                a = t,
                o = this.fixHooks[r];
            for (o || (this.fixHooks[r] = o = Ie.test(r) ? this.mouseHooks : De.test(r) ? this.keyHooks : {}), i = o.props ? this.props.concat(o.props) : this.props, t = new re.Event(a), e = i.length; e--;) n = i[e], t[n] = a[n];
            return t.target || (t.target = a.srcElement || pe), 3 === t.target.nodeType && (t.target = t.target.parentNode), t.metaKey = !!t.metaKey, o.filter ? o.filter(t, a) : t
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(t, e) {
                return null == t.which && (t.which = null != e.charCode ? e.charCode : e.keyCode), t
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(t, e) {
                var n, i, r, a = e.button,
                    o = e.fromElement;
                return null == t.pageX && null != e.clientX && (i = t.target.ownerDocument || pe, r = i.documentElement, n = i.body, t.pageX = e.clientX + (r && r.scrollLeft || n && n.scrollLeft || 0) - (r && r.clientLeft || n && n.clientLeft || 0), t.pageY = e.clientY + (r && r.scrollTop || n && n.scrollTop || 0) - (r && r.clientTop || n && n.clientTop || 0)), !t.relatedTarget && o && (t.relatedTarget = o === t.target ? e.toElement : o), t.which || void 0 === a || (t.which = 1 & a ? 1 : 2 & a ? 3 : 4 & a ? 2 : 0), t
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== p() && this.focus) try {
                        return this.focus(), !1
                    } catch (t) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === p() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return re.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                },
                _default: function(t) {
                    return re.nodeName(t.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(t) {
                    void 0 !== t.result && t.originalEvent && (t.originalEvent.returnValue = t.result)
                }
            }
        },
        simulate: function(t, e, n, i) {
            var r = re.extend(new re.Event, n, {
                type: t,
                isSimulated: !0,
                originalEvent: {}
            });
            i ? re.event.trigger(r, null, e) : re.event.dispatch.call(e, r), r.isDefaultPrevented() && n.preventDefault()
        }
    }, re.removeEvent = pe.removeEventListener ? function(t, e, n) {
        t.removeEventListener && t.removeEventListener(e, n, !1)
    } : function(t, e, n) {
        var i = "on" + e;
        t.detachEvent && (typeof t[i] === ke && (t[i] = null), t.detachEvent(i, n))
    }, re.Event = function(t, e) {
        return this instanceof re.Event ? (t && t.type ? (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented || void 0 === t.defaultPrevented && t.returnValue === !1 ? h : f) : this.type = t, e && re.extend(this, e), this.timeStamp = t && t.timeStamp || re.now(), void(this[re.expando] = !0)) : new re.Event(t, e)
    }, re.Event.prototype = {
        isDefaultPrevented: f,
        isPropagationStopped: f,
        isImmediatePropagationStopped: f,
        preventDefault: function() {
            var t = this.originalEvent;
            this.isDefaultPrevented = h, t && (t.preventDefault ? t.preventDefault() : t.returnValue = !1)
        },
        stopPropagation: function() {
            var t = this.originalEvent;
            this.isPropagationStopped = h, t && (t.stopPropagation && t.stopPropagation(), t.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var t = this.originalEvent;
            this.isImmediatePropagationStopped = h, t && t.stopImmediatePropagation && t.stopImmediatePropagation(), this.stopPropagation()
        }
    }, re.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(t, e) {
        re.event.special[t] = {
            delegateType: e,
            bindType: e,
            handle: function(t) {
                var n, i = this,
                    r = t.relatedTarget,
                    a = t.handleObj;
                return (!r || r !== i && !re.contains(i, r)) && (t.type = a.origType, n = a.handler.apply(this, arguments), t.type = e), n
            }
        }
    }), ne.submitBubbles || (re.event.special.submit = {
        setup: function() {
            return re.nodeName(this, "form") ? !1 : void re.event.add(this, "click._submit keypress._submit", function(t) {
                var e = t.target,
                    n = re.nodeName(e, "input") || re.nodeName(e, "button") ? e.form : void 0;
                n && !re._data(n, "submitBubbles") && (re.event.add(n, "submit._submit", function(t) {
                    t._submit_bubble = !0
                }), re._data(n, "submitBubbles", !0))
            })
        },
        postDispatch: function(t) {
            t._submit_bubble && (delete t._submit_bubble, this.parentNode && !t.isTrigger && re.event.simulate("submit", this.parentNode, t, !0))
        },
        teardown: function() {
            return re.nodeName(this, "form") ? !1 : void re.event.remove(this, "._submit")
        }
    }), ne.changeBubbles || (re.event.special.change = {
        setup: function() {
            return Ne.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (re.event.add(this, "propertychange._change", function(t) {
                "checked" === t.originalEvent.propertyName && (this._just_changed = !0)
            }), re.event.add(this, "click._change", function(t) {
                this._just_changed && !t.isTrigger && (this._just_changed = !1), re.event.simulate("change", this, t, !0)
            })), !1) : void re.event.add(this, "beforeactivate._change", function(t) {
                var e = t.target;
                Ne.test(e.nodeName) && !re._data(e, "changeBubbles") && (re.event.add(e, "change._change", function(t) {
                    !this.parentNode || t.isSimulated || t.isTrigger || re.event.simulate("change", this.parentNode, t, !0)
                }), re._data(e, "changeBubbles", !0))
            })
        },
        handle: function(t) {
            var e = t.target;
            return this !== e || t.isSimulated || t.isTrigger || "radio" !== e.type && "checkbox" !== e.type ? t.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return re.event.remove(this, "._change"), !Ne.test(this.nodeName)
        }
    }), ne.focusinBubbles || re.each({
        focus: "focusin",
        blur: "focusout"
    }, function(t, e) {
        var n = function(t) {
            re.event.simulate(e, t.target, re.event.fix(t), !0)
        };
        re.event.special[e] = {
            setup: function() {
                var i = this.ownerDocument || this,
                    r = re._data(i, e);
                r || i.addEventListener(t, n, !0), re._data(i, e, (r || 0) + 1)
            },
            teardown: function() {
                var i = this.ownerDocument || this,
                    r = re._data(i, e) - 1;
                r ? re._data(i, e, r) : (i.removeEventListener(t, n, !0), re._removeData(i, e))
            }
        }
    }), re.fn.extend({
        on: function(t, e, n, i, r) {
            var a, o;
            if ("object" == typeof t) {
                "string" != typeof e && (n = n || e, e = void 0);
                for (a in t) this.on(a, e, n, t[a], r);
                return this
            }
            if (null == n && null == i ? (i = e, n = e = void 0) : null == i && ("string" == typeof e ? (i = n, n = void 0) : (i = n, n = e, e = void 0)), i === !1) i = f;
            else if (!i) return this;
            return 1 === r && (o = i, i = function(t) {
                return re().off(t), o.apply(this, arguments)
            }, i.guid = o.guid || (o.guid = re.guid++)), this.each(function() {
                re.event.add(this, t, i, n, e)
            })
        },
        one: function(t, e, n, i) {
            return this.on(t, e, n, i, 1)
        },
        off: function(t, e, n) {
            var i, r;
            if (t && t.preventDefault && t.handleObj) return i = t.handleObj, re(t.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
            if ("object" == typeof t) {
                for (r in t) this.off(r, e, t[r]);
                return this
            }
            return (e === !1 || "function" == typeof e) && (n = e, e = void 0), n === !1 && (n = f), this.each(function() {
                re.event.remove(this, t, n, e)
            })
        },
        trigger: function(t, e) {
            return this.each(function() {
                re.event.trigger(t, e, this)
            })
        },
        triggerHandler: function(t, e) {
            var n = this[0];
            return n ? re.event.trigger(t, e, n, !0) : void 0
        }
    });
    var qe = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        Oe = / jQuery\d+="(?:null|\d+)"/g,
        Me = new RegExp("<(?:" + qe + ")[\\s/>]", "i"),
        Re = /^\s+/,
        He = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        Fe = /<([\w:]+)/,
        ze = /<tbody/i,
        Be = /<|&#?\w+;/,
        We = /<(?:script|style|link)/i,
        Xe = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Qe = /^$|\/(?:java|ecma)script/i,
        Ue = /^true\/(.*)/,
        Je = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        Ve = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: ne.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        },
        Ke = m(pe),
        Ye = Ke.appendChild(pe.createElement("div"));
    Ve.optgroup = Ve.option, Ve.tbody = Ve.tfoot = Ve.colgroup = Ve.caption = Ve.thead, Ve.th = Ve.td, re.extend({
        clone: function(t, e, n) {
            var i, r, a, o, s, u = re.contains(t.ownerDocument, t);
            if (ne.html5Clone || re.isXMLDoc(t) || !Me.test("<" + t.nodeName + ">") ? a = t.cloneNode(!0) : (Ye.innerHTML = t.outerHTML, Ye.removeChild(a = Ye.firstChild)), !(ne.noCloneEvent && ne.noCloneChecked || 1 !== t.nodeType && 11 !== t.nodeType || re.isXMLDoc(t)))
                for (i = g(a), s = g(t), o = 0; null != (r = s[o]); ++o) i[o] && k(r, i[o]);
            if (e)
                if (n)
                    for (s = s || g(t), i = i || g(a), o = 0; null != (r = s[o]); o++) x(r, i[o]);
                else x(t, a);
            return i = g(a, "script"), i.length > 0 && w(i, !u && g(t, "script")), i = s = r = null, a
        },
        buildFragment: function(t, e, n, i) {
            for (var r, a, o, s, u, l, c, d = t.length, h = m(e), f = [], p = 0; d > p; p++)
                if (a = t[p], a || 0 === a)
                    if ("object" === re.type(a)) re.merge(f, a.nodeType ? [a] : a);
                    else if (Be.test(a)) {
                for (s = s || h.appendChild(e.createElement("div")), u = (Fe.exec(a) || ["", ""])[1].toLowerCase(), c = Ve[u] || Ve._default, s.innerHTML = c[1] + a.replace(He, "<$1></$2>") + c[2], r = c[0]; r--;) s = s.lastChild;
                if (!ne.leadingWhitespace && Re.test(a) && f.push(e.createTextNode(Re.exec(a)[0])), !ne.tbody)
                    for (a = "table" !== u || ze.test(a) ? "<table>" !== c[1] || ze.test(a) ? 0 : s : s.firstChild, r = a && a.childNodes.length; r--;) re.nodeName(l = a.childNodes[r], "tbody") && !l.childNodes.length && a.removeChild(l);
                for (re.merge(f, s.childNodes), s.textContent = ""; s.firstChild;) s.removeChild(s.firstChild);
                s = h.lastChild
            } else f.push(e.createTextNode(a));
            for (s && h.removeChild(s), ne.appendChecked || re.grep(g(f, "input"), v), p = 0; a = f[p++];)
                if ((!i || -1 === re.inArray(a, i)) && (o = re.contains(a.ownerDocument, a), s = g(h.appendChild(a), "script"), o && w(s), n))
                    for (r = 0; a = s[r++];) Qe.test(a.type || "") && n.push(a);
            return s = null, h
        },
        cleanData: function(t, e) {
            for (var n, i, r, a, o = 0, s = re.expando, u = re.cache, l = ne.deleteExpando, c = re.event.special; null != (n = t[o]); o++)
                if ((e || re.acceptData(n)) && (r = n[s], a = r && u[r])) {
                    if (a.events)
                        for (i in a.events) c[i] ? re.event.remove(n, i) : re.removeEvent(n, i, a.handle);
                    u[r] && (delete u[r], l ? delete n[s] : typeof n.removeAttribute !== ke ? n.removeAttribute(s) : n[s] = null, J.push(r))
                }
        }
    }), re.fn.extend({
        text: function(t) {
            return Ee(this, function(t) {
                return void 0 === t ? re.text(this) : this.empty().append((this[0] && this[0].ownerDocument || pe).createTextNode(t))
            }, null, t, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(t) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var e = y(this, t);
                    e.appendChild(t)
                }
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(t) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var e = y(this, t);
                    e.insertBefore(t, e.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(t) {
                this.parentNode && this.parentNode.insertBefore(t, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(t) {
                this.parentNode && this.parentNode.insertBefore(t, this.nextSibling)
            })
        },
        remove: function(t, e) {
            for (var n, i = t ? re.filter(t, this) : this, r = 0; null != (n = i[r]); r++) e || 1 !== n.nodeType || re.cleanData(g(n)), n.parentNode && (e && re.contains(n.ownerDocument, n) && w(g(n, "script")), n.parentNode.removeChild(n));
            return this
        },
        empty: function() {
            for (var t, e = 0; null != (t = this[e]); e++) {
                for (1 === t.nodeType && re.cleanData(g(t, !1)); t.firstChild;) t.removeChild(t.firstChild);
                t.options && re.nodeName(t, "select") && (t.options.length = 0)
            }
            return this
        },
        clone: function(t, e) {
            return t = null == t ? !1 : t, e = null == e ? t : e, this.map(function() {
                return re.clone(this, t, e)
            })
        },
        html: function(t) {
            return Ee(this, function(t) {
                var e = this[0] || {},
                    n = 0,
                    i = this.length;
                if (void 0 === t) return 1 === e.nodeType ? e.innerHTML.replace(Oe, "") : void 0;
                if (!("string" != typeof t || We.test(t) || !ne.htmlSerialize && Me.test(t) || !ne.leadingWhitespace && Re.test(t) || Ve[(Fe.exec(t) || ["", ""])[1].toLowerCase()])) {
                    t = t.replace(He, "<$1></$2>");
                    try {
                        for (; i > n; n++) e = this[n] || {}, 1 === e.nodeType && (re.cleanData(g(e, !1)), e.innerHTML = t);
                        e = 0
                    } catch (r) {}
                }
                e && this.empty().append(t)
            }, null, t, arguments.length)
        },
        replaceWith: function() {
            var t = arguments[0];
            return this.domManip(arguments, function(e) {
                t = this.parentNode, re.cleanData(g(this)), t && t.replaceChild(e, this)
            }), t && (t.length || t.nodeType) ? this : this.remove()
        },
        detach: function(t) {
            return this.remove(t, !0)
        },
        domManip: function(t, e) {
            t = K.apply([], t);
            var n, i, r, a, o, s, u = 0,
                l = this.length,
                c = this,
                d = l - 1,
                h = t[0],
                f = re.isFunction(h);
            if (f || l > 1 && "string" == typeof h && !ne.checkClone && Xe.test(h)) return this.each(function(n) {
                var i = c.eq(n);
                f && (t[0] = h.call(this, n, i.html())), i.domManip(t, e)
            });
            if (l && (s = re.buildFragment(t, this[0].ownerDocument, !1, this), n = s.firstChild, 1 === s.childNodes.length && (s = n), n)) {
                for (a = re.map(g(s, "script"), _), r = a.length; l > u; u++) i = s, u !== d && (i = re.clone(i, !0, !0), r && re.merge(a, g(i, "script"))), e.call(this[u], i, u);
                if (r)
                    for (o = a[a.length - 1].ownerDocument, re.map(a, b), u = 0; r > u; u++) i = a[u], Qe.test(i.type || "") && !re._data(i, "globalEval") && re.contains(o, i) && (i.src ? re._evalUrl && re._evalUrl(i.src) : re.globalEval((i.text || i.textContent || i.innerHTML || "").replace(Je, "")));
                s = n = null
            }
            return this
        }
    }), re.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(t, e) {
        re.fn[t] = function(t) {
            for (var n, i = 0, r = [], a = re(t), o = a.length - 1; o >= i; i++) n = i === o ? this : this.clone(!0), re(a[i])[e](n), Y.apply(r, n.get());
            return this.pushStack(r)
        }
    });
    var Ge, Ze = {};
    ! function() {
        var t;
        ne.shrinkWrapBlocks = function() {
            if (null != t) return t;
            t = !1;
            var e, n, i;
            return n = pe.getElementsByTagName("body")[0], n && n.style ? (e = pe.createElement("div"), i = pe.createElement("div"), i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(e), typeof e.style.zoom !== ke && (e.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", e.appendChild(pe.createElement("div")).style.width = "5px", t = 3 !== e.offsetWidth), n.removeChild(i), t) : void 0
        }
    }();
    var tn, en, nn = /^margin/,
        rn = new RegExp("^(" + $e + ")(?!px)[a-z%]+$", "i"),
        an = /^(top|right|bottom|left)$/;
    t.getComputedStyle ? (tn = function(e) {
            return e.ownerDocument.defaultView.opener ? e.ownerDocument.defaultView.getComputedStyle(e, null) : t.getComputedStyle(e, null)
        }, en = function(t, e, n) {
            var i, r, a, o, s = t.style;
            return n = n || tn(t), o = n ? n.getPropertyValue(e) || n[e] : void 0, n && ("" !== o || re.contains(t.ownerDocument, t) || (o = re.style(t, e)), rn.test(o) && nn.test(e) && (i = s.width, r = s.minWidth, a = s.maxWidth, s.minWidth = s.maxWidth = s.width = o, o = n.width, s.width = i, s.minWidth = r, s.maxWidth = a)), void 0 === o ? o : o + ""
        }) : pe.documentElement.currentStyle && (tn = function(t) {
            return t.currentStyle
        }, en = function(t, e, n) {
            var i, r, a, o, s = t.style;
            return n = n || tn(t), o = n ? n[e] : void 0, null == o && s && s[e] && (o = s[e]), rn.test(o) && !an.test(e) && (i = s.left, r = t.runtimeStyle, a = r && r.left, a && (r.left = t.currentStyle.left), s.left = "fontSize" === e ? "1em" : o, o = s.pixelLeft + "px", s.left = i, a && (r.left = a)), void 0 === o ? o : o + "" || "auto"
        }),
        function() {
            function e() {
                var e, n, i, r;
                n = pe.getElementsByTagName("body")[0], n && n.style && (e = pe.createElement("div"), i = pe.createElement("div"), i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(e), e.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", a = o = !1, u = !0, t.getComputedStyle && (a = "1%" !== (t.getComputedStyle(e, null) || {}).top, o = "4px" === (t.getComputedStyle(e, null) || {
                    width: "4px"
                }).width, r = e.appendChild(pe.createElement("div")), r.style.cssText = e.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", r.style.marginRight = r.style.width = "0", e.style.width = "1px", u = !parseFloat((t.getComputedStyle(r, null) || {}).marginRight), e.removeChild(r)), e.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", r = e.getElementsByTagName("td"), r[0].style.cssText = "margin:0;border:0;padding:0;display:none", s = 0 === r[0].offsetHeight, s && (r[0].style.display = "", r[1].style.display = "none", s = 0 === r[0].offsetHeight), n.removeChild(i))
            }
            var n, i, r, a, o, s, u;
            n = pe.createElement("div"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", r = n.getElementsByTagName("a")[0], i = r && r.style, i && (i.cssText = "float:left;opacity:.5", ne.opacity = "0.5" === i.opacity, ne.cssFloat = !!i.cssFloat, n.style.backgroundClip = "content-box", n.cloneNode(!0).style.backgroundClip = "", ne.clearCloneStyle = "content-box" === n.style.backgroundClip, ne.boxSizing = "" === i.boxSizing || "" === i.MozBoxSizing || "" === i.WebkitBoxSizing, re.extend(ne, {
                reliableHiddenOffsets: function() {
                    return null == s && e(), s
                },
                boxSizingReliable: function() {
                    return null == o && e(), o
                },
                pixelPosition: function() {
                    return null == a && e(), a
                },
                reliableMarginRight: function() {
                    return null == u && e(), u
                }
            }))
        }(), re.swap = function(t, e, n, i) {
            var r, a, o = {};
            for (a in e) o[a] = t.style[a], t.style[a] = e[a];
            r = n.apply(t, i || []);
            for (a in e) t.style[a] = o[a];
            return r
        };
    var on = /alpha\([^)]*\)/i,
        sn = /opacity\s*=\s*([^)]*)/,
        un = /^(none|table(?!-c[ea]).+)/,
        ln = new RegExp("^(" + $e + ")(.*)$", "i"),
        cn = new RegExp("^([+-])=(" + $e + ")", "i"),
        dn = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        hn = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        fn = ["Webkit", "O", "Moz", "ms"];
    re.extend({
        cssHooks: {
            opacity: {
                get: function(t, e) {
                    if (e) {
                        var n = en(t, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
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
            "float": ne.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(t, e, n, i) {
            if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
                var r, a, o, s = re.camelCase(e),
                    u = t.style;
                if (e = re.cssProps[s] || (re.cssProps[s] = j(u, s)), o = re.cssHooks[e] || re.cssHooks[s], void 0 === n) return o && "get" in o && void 0 !== (r = o.get(t, !1, i)) ? r : u[e];
                if (a = typeof n, "string" === a && (r = cn.exec(n)) && (n = (r[1] + 1) * r[2] + parseFloat(re.css(t, e)), a = "number"), null != n && n === n && ("number" !== a || re.cssNumber[s] || (n += "px"), ne.clearCloneStyle || "" !== n || 0 !== e.indexOf("background") || (u[e] = "inherit"), !(o && "set" in o && void 0 === (n = o.set(t, n, i))))) try {
                    u[e] = n
                } catch (l) {}
            }
        },
        css: function(t, e, n, i) {
            var r, a, o, s = re.camelCase(e);
            return e = re.cssProps[s] || (re.cssProps[s] = j(t.style, s)), o = re.cssHooks[e] || re.cssHooks[s], o && "get" in o && (a = o.get(t, !0, n)), void 0 === a && (a = en(t, e, i)), "normal" === a && e in hn && (a = hn[e]), "" === n || n ? (r = parseFloat(a), n === !0 || re.isNumeric(r) ? r || 0 : a) : a
        }
    }), re.each(["height", "width"], function(t, e) {
        re.cssHooks[e] = {
            get: function(t, n, i) {
                return n ? un.test(re.css(t, "display")) && 0 === t.offsetWidth ? re.swap(t, dn, function() {
                    return N(t, e, i)
                }) : N(t, e, i) : void 0
            },
            set: function(t, n, i) {
                var r = i && tn(t);
                return E(t, n, i ? A(t, e, i, ne.boxSizing && "border-box" === re.css(t, "boxSizing", !1, r), r) : 0)
            }
        }
    }), ne.opacity || (re.cssHooks.opacity = {
        get: function(t, e) {
            return sn.test((e && t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : e ? "1" : ""
        },
        set: function(t, e) {
            var n = t.style,
                i = t.currentStyle,
                r = re.isNumeric(e) ? "alpha(opacity=" + 100 * e + ")" : "",
                a = i && i.filter || n.filter || "";
            n.zoom = 1, (e >= 1 || "" === e) && "" === re.trim(a.replace(on, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === e || i && !i.filter) || (n.filter = on.test(a) ? a.replace(on, r) : a + " " + r)
        }
    }), re.cssHooks.marginRight = $(ne.reliableMarginRight, function(t, e) {
        return e ? re.swap(t, {
            display: "inline-block"
        }, en, [t, "marginRight"]) : void 0
    }), re.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(t, e) {
        re.cssHooks[t + e] = {
            expand: function(n) {
                for (var i = 0, r = {}, a = "string" == typeof n ? n.split(" ") : [n]; 4 > i; i++) r[t + je[i] + e] = a[i] || a[i - 2] || a[0];
                return r
            }
        }, nn.test(t) || (re.cssHooks[t + e].set = E)
    }), re.fn.extend({
        css: function(t, e) {
            return Ee(this, function(t, e, n) {
                var i, r, a = {},
                    o = 0;
                if (re.isArray(e)) {
                    for (i = tn(t), r = e.length; r > o; o++) a[e[o]] = re.css(t, e[o], !1, i);
                    return a
                }
                return void 0 !== n ? re.style(t, e, n) : re.css(t, e)
            }, t, e, arguments.length > 1)
        },
        show: function() {
            return S(this, !0)
        },
        hide: function() {
            return S(this)
        },
        toggle: function(t) {
            return "boolean" == typeof t ? t ? this.show() : this.hide() : this.each(function() {
                Se(this) ? re(this).show() : re(this).hide()
            })
        }
    }), re.Tween = D, D.prototype = {
        constructor: D,
        init: function(t, e, n, i, r, a) {
            this.elem = t, this.prop = n, this.easing = r || "swing", this.options = e, this.start = this.now = this.cur(), this.end = i, this.unit = a || (re.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var t = D.propHooks[this.prop];
            return t && t.get ? t.get(this) : D.propHooks._default.get(this)
        },
        run: function(t) {
            var e, n = D.propHooks[this.prop];
            return this.pos = e = this.options.duration ? re.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration) : t, this.now = (this.end - this.start) * e + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : D.propHooks._default.set(this), this
        }
    }, D.prototype.init.prototype = D.prototype, D.propHooks = {
        _default: {
            get: function(t) {
                var e;
                return null == t.elem[t.prop] || t.elem.style && null != t.elem.style[t.prop] ? (e = re.css(t.elem, t.prop, ""), e && "auto" !== e ? e : 0) : t.elem[t.prop]
            },
            set: function(t) {
                re.fx.step[t.prop] ? re.fx.step[t.prop](t) : t.elem.style && (null != t.elem.style[re.cssProps[t.prop]] || re.cssHooks[t.prop]) ? re.style(t.elem, t.prop, t.now + t.unit) : t.elem[t.prop] = t.now
            }
        }
    }, D.propHooks.scrollTop = D.propHooks.scrollLeft = {
        set: function(t) {
            t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now)
        }
    }, re.easing = {
        linear: function(t) {
            return t
        },
        swing: function(t) {
            return .5 - Math.cos(t * Math.PI) / 2
        }
    }, re.fx = D.prototype.init, re.fx.step = {};
    var pn, mn, gn = /^(?:toggle|show|hide)$/,
        vn = new RegExp("^(?:([+-])=|)(" + $e + ")([a-z%]*)$", "i"),
        yn = /queueHooks$/,
        _n = [q],
        bn = {
            "*": [function(t, e) {
                var n = this.createTween(t, e),
                    i = n.cur(),
                    r = vn.exec(e),
                    a = r && r[3] || (re.cssNumber[t] ? "" : "px"),
                    o = (re.cssNumber[t] || "px" !== a && +i) && vn.exec(re.css(n.elem, t)),
                    s = 1,
                    u = 20;
                if (o && o[3] !== a) {
                    a = a || o[3], r = r || [], o = +i || 1;
                    do s = s || ".5", o /= s, re.style(n.elem, t, o + a); while (s !== (s = n.cur() / i) && 1 !== s && --u)
                }
                return r && (o = n.start = +o || +i || 0, n.unit = a, n.end = r[1] ? o + (r[1] + 1) * r[2] : +r[2]), n
            }]
        };
    re.Animation = re.extend(M, {
            tweener: function(t, e) {
                re.isFunction(t) ? (e = t, t = ["*"]) : t = t.split(" ");
                for (var n, i = 0, r = t.length; r > i; i++) n = t[i], bn[n] = bn[n] || [], bn[n].unshift(e)
            },
            prefilter: function(t, e) {
                e ? _n.unshift(t) : _n.push(t)
            }
        }), re.speed = function(t, e, n) {
            var i = t && "object" == typeof t ? re.extend({}, t) : {
                complete: n || !n && e || re.isFunction(t) && t,
                duration: t,
                easing: n && e || e && !re.isFunction(e) && e
            };
            return i.duration = re.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in re.fx.speeds ? re.fx.speeds[i.duration] : re.fx.speeds._default, (null == i.queue || i.queue === !0) && (i.queue = "fx"), i.old = i.complete, i.complete = function() {
                re.isFunction(i.old) && i.old.call(this), i.queue && re.dequeue(this, i.queue)
            }, i
        }, re.fn.extend({
            fadeTo: function(t, e, n, i) {
                return this.filter(Se).css("opacity", 0).show().end().animate({
                    opacity: e
                }, t, n, i)
            },
            animate: function(t, e, n, i) {
                var r = re.isEmptyObject(t),
                    a = re.speed(e, n, i),
                    o = function() {
                        var e = M(this, re.extend({}, t), a);
                        (r || re._data(this, "finish")) && e.stop(!0)
                    };
                return o.finish = o, r || a.queue === !1 ? this.each(o) : this.queue(a.queue, o)
            },
            stop: function(t, e, n) {
                var i = function(t) {
                    var e = t.stop;
                    delete t.stop, e(n)
                };
                return "string" != typeof t && (n = e, e = t, t = void 0), e && t !== !1 && this.queue(t || "fx", []), this.each(function() {
                    var e = !0,
                        r = null != t && t + "queueHooks",
                        a = re.timers,
                        o = re._data(this);
                    if (r) o[r] && o[r].stop && i(o[r]);
                    else
                        for (r in o) o[r] && o[r].stop && yn.test(r) && i(o[r]);
                    for (r = a.length; r--;) a[r].elem !== this || null != t && a[r].queue !== t || (a[r].anim.stop(n), e = !1, a.splice(r, 1));
                    (e || !n) && re.dequeue(this, t)
                })
            },
            finish: function(t) {
                return t !== !1 && (t = t || "fx"), this.each(function() {
                    var e, n = re._data(this),
                        i = n[t + "queue"],
                        r = n[t + "queueHooks"],
                        a = re.timers,
                        o = i ? i.length : 0;
                    for (n.finish = !0, re.queue(this, t, []), r && r.stop && r.stop.call(this, !0), e = a.length; e--;) a[e].elem === this && a[e].queue === t && (a[e].anim.stop(!0), a.splice(e, 1));
                    for (e = 0; o > e; e++) i[e] && i[e].finish && i[e].finish.call(this);
                    delete n.finish
                })
            }
        }), re.each(["toggle", "show", "hide"], function(t, e) {
            var n = re.fn[e];
            re.fn[e] = function(t, i, r) {
                return null == t || "boolean" == typeof t ? n.apply(this, arguments) : this.animate(L(e, !0), t, i, r)
            }
        }), re.each({
            slideDown: L("show"),
            slideUp: L("hide"),
            slideToggle: L("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(t, e) {
            re.fn[t] = function(t, n, i) {
                return this.animate(e, t, n, i)
            }
        }), re.timers = [], re.fx.tick = function() {
            var t, e = re.timers,
                n = 0;
            for (pn = re.now(); n < e.length; n++) t = e[n], t() || e[n] !== t || e.splice(n--, 1);
            e.length || re.fx.stop(), pn = void 0
        }, re.fx.timer = function(t) {
            re.timers.push(t), t() ? re.fx.start() : re.timers.pop()
        }, re.fx.interval = 13, re.fx.start = function() {
            mn || (mn = setInterval(re.fx.tick, re.fx.interval))
        }, re.fx.stop = function() {
            clearInterval(mn), mn = null
        }, re.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, re.fn.delay = function(t, e) {
            return t = re.fx ? re.fx.speeds[t] || t : t, e = e || "fx", this.queue(e, function(e, n) {
                var i = setTimeout(e, t);
                n.stop = function() {
                    clearTimeout(i)
                }
            })
        },
        function() {
            var t, e, n, i, r;
            e = pe.createElement("div"), e.setAttribute("className", "t"), e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", i = e.getElementsByTagName("a")[0], n = pe.createElement("select"), r = n.appendChild(pe.createElement("option")), t = e.getElementsByTagName("input")[0], i.style.cssText = "top:1px", ne.getSetAttribute = "t" !== e.className, ne.style = /top/.test(i.getAttribute("style")), ne.hrefNormalized = "/a" === i.getAttribute("href"), ne.checkOn = !!t.value, ne.optSelected = r.selected, ne.enctype = !!pe.createElement("form").enctype, n.disabled = !0, ne.optDisabled = !r.disabled, t = pe.createElement("input"), t.setAttribute("value", ""), ne.input = "" === t.getAttribute("value"), t.value = "t", t.setAttribute("type", "radio"), ne.radioValue = "t" === t.value
        }();
    var wn = /\r/g;
    re.fn.extend({
        val: function(t) {
            var e, n, i, r = this[0]; {
                if (arguments.length) return i = re.isFunction(t), this.each(function(n) {
                    var r;
                    1 === this.nodeType && (r = i ? t.call(this, n, re(this).val()) : t, null == r ? r = "" : "number" == typeof r ? r += "" : re.isArray(r) && (r = re.map(r, function(t) {
                        return null == t ? "" : t + ""
                    })), e = re.valHooks[this.type] || re.valHooks[this.nodeName.toLowerCase()], e && "set" in e && void 0 !== e.set(this, r, "value") || (this.value = r))
                });
                if (r) return e = re.valHooks[r.type] || re.valHooks[r.nodeName.toLowerCase()], e && "get" in e && void 0 !== (n = e.get(r, "value")) ? n : (n = r.value, "string" == typeof n ? n.replace(wn, "") : null == n ? "" : n)
            }
        }
    }), re.extend({
        valHooks: {
            option: {
                get: function(t) {
                    var e = re.find.attr(t, "value");
                    return null != e ? e : re.trim(re.text(t))
                }
            },
            select: {
                get: function(t) {
                    for (var e, n, i = t.options, r = t.selectedIndex, a = "select-one" === t.type || 0 > r, o = a ? null : [], s = a ? r + 1 : i.length, u = 0 > r ? s : a ? r : 0; s > u; u++)
                        if (n = i[u], !(!n.selected && u !== r || (ne.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && re.nodeName(n.parentNode, "optgroup"))) {
                            if (e = re(n).val(), a) return e;
                            o.push(e)
                        }
                    return o
                },
                set: function(t, e) {
                    for (var n, i, r = t.options, a = re.makeArray(e), o = r.length; o--;)
                        if (i = r[o], re.inArray(re.valHooks.option.get(i), a) >= 0) try {
                            i.selected = n = !0
                        } catch (s) {
                            i.scrollHeight
                        } else i.selected = !1;
                    return n || (t.selectedIndex = -1), r
                }
            }
        }
    }), re.each(["radio", "checkbox"], function() {
        re.valHooks[this] = {
            set: function(t, e) {
                return re.isArray(e) ? t.checked = re.inArray(re(t).val(), e) >= 0 : void 0
            }
        }, ne.checkOn || (re.valHooks[this].get = function(t) {
            return null === t.getAttribute("value") ? "on" : t.value
        })
    });
    var xn, kn, Cn = re.expr.attrHandle,
        Tn = /^(?:checked|selected)$/i,
        $n = ne.getSetAttribute,
        jn = ne.input;
    re.fn.extend({
        attr: function(t, e) {
            return Ee(this, re.attr, t, e, arguments.length > 1)
        },
        removeAttr: function(t) {
            return this.each(function() {
                re.removeAttr(this, t)
            })
        }
    }), re.extend({
        attr: function(t, e, n) {
            var i, r, a = t.nodeType;
            if (t && 3 !== a && 8 !== a && 2 !== a) return typeof t.getAttribute === ke ? re.prop(t, e, n) : (1 === a && re.isXMLDoc(t) || (e = e.toLowerCase(), i = re.attrHooks[e] || (re.expr.match.bool.test(e) ? kn : xn)), void 0 === n ? i && "get" in i && null !== (r = i.get(t, e)) ? r : (r = re.find.attr(t, e), null == r ? void 0 : r) : null !== n ? i && "set" in i && void 0 !== (r = i.set(t, n, e)) ? r : (t.setAttribute(e, n + ""), n) : void re.removeAttr(t, e))
        },
        removeAttr: function(t, e) {
            var n, i, r = 0,
                a = e && e.match(_e);
            if (a && 1 === t.nodeType)
                for (; n = a[r++];) i = re.propFix[n] || n, re.expr.match.bool.test(n) ? jn && $n || !Tn.test(n) ? t[i] = !1 : t[re.camelCase("default-" + n)] = t[i] = !1 : re.attr(t, n, ""), t.removeAttribute($n ? n : i)
        },
        attrHooks: {
            type: {
                set: function(t, e) {
                    if (!ne.radioValue && "radio" === e && re.nodeName(t, "input")) {
                        var n = t.value;
                        return t.setAttribute("type", e), n && (t.value = n), e
                    }
                }
            }
        }
    }), kn = {
        set: function(t, e, n) {
            return e === !1 ? re.removeAttr(t, n) : jn && $n || !Tn.test(n) ? t.setAttribute(!$n && re.propFix[n] || n, n) : t[re.camelCase("default-" + n)] = t[n] = !0, n
        }
    }, re.each(re.expr.match.bool.source.match(/\w+/g), function(t, e) {
        var n = Cn[e] || re.find.attr;
        Cn[e] = jn && $n || !Tn.test(e) ? function(t, e, i) {
            var r, a;
            return i || (a = Cn[e], Cn[e] = r, r = null != n(t, e, i) ? e.toLowerCase() : null, Cn[e] = a), r
        } : function(t, e, n) {
            return n ? void 0 : t[re.camelCase("default-" + e)] ? e.toLowerCase() : null
        }
    }), jn && $n || (re.attrHooks.value = {
        set: function(t, e, n) {
            return re.nodeName(t, "input") ? void(t.defaultValue = e) : xn && xn.set(t, e, n)
        }
    }), $n || (xn = {
        set: function(t, e, n) {
            var i = t.getAttributeNode(n);
            return i || t.setAttributeNode(i = t.ownerDocument.createAttribute(n)), i.value = e += "", "value" === n || e === t.getAttribute(n) ? e : void 0
        }
    }, Cn.id = Cn.name = Cn.coords = function(t, e, n) {
        var i;
        return n ? void 0 : (i = t.getAttributeNode(e)) && "" !== i.value ? i.value : null
    }, re.valHooks.button = {
        get: function(t, e) {
            var n = t.getAttributeNode(e);
            return n && n.specified ? n.value : void 0
        },
        set: xn.set
    }, re.attrHooks.contenteditable = {
        set: function(t, e, n) {
            xn.set(t, "" === e ? !1 : e, n)
        }
    }, re.each(["width", "height"], function(t, e) {
        re.attrHooks[e] = {
            set: function(t, n) {
                return "" === n ? (t.setAttribute(e, "auto"), n) : void 0
            }
        }
    })), ne.style || (re.attrHooks.style = {
        get: function(t) {
            return t.style.cssText || void 0
        },
        set: function(t, e) {
            return t.style.cssText = e + ""
        }
    });
    var Sn = /^(?:input|select|textarea|button|object)$/i,
        En = /^(?:a|area)$/i;
    re.fn.extend({
        prop: function(t, e) {
            return Ee(this, re.prop, t, e, arguments.length > 1)
        },
        removeProp: function(t) {
            return t = re.propFix[t] || t, this.each(function() {
                try {
                    this[t] = void 0, delete this[t]
                } catch (e) {}
            })
        }
    }), re.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(t, e, n) {
            var i, r, a, o = t.nodeType;
            if (t && 3 !== o && 8 !== o && 2 !== o) return a = 1 !== o || !re.isXMLDoc(t), a && (e = re.propFix[e] || e, r = re.propHooks[e]), void 0 !== n ? r && "set" in r && void 0 !== (i = r.set(t, n, e)) ? i : t[e] = n : r && "get" in r && null !== (i = r.get(t, e)) ? i : t[e]
        },
        propHooks: {
            tabIndex: {
                get: function(t) {
                    var e = re.find.attr(t, "tabindex");
                    return e ? parseInt(e, 10) : Sn.test(t.nodeName) || En.test(t.nodeName) && t.href ? 0 : -1
                }
            }
        }
    }), ne.hrefNormalized || re.each(["href", "src"], function(t, e) {
        re.propHooks[e] = {
            get: function(t) {
                return t.getAttribute(e, 4)
            }
        }
    }), ne.optSelected || (re.propHooks.selected = {
        get: function(t) {
            var e = t.parentNode;
            return e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex), null
        }
    }), re.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        re.propFix[this.toLowerCase()] = this
    }), ne.enctype || (re.propFix.enctype = "encoding");
    var An = /[\t\r\n\f]/g;
    re.fn.extend({
        addClass: function(t) {
            var e, n, i, r, a, o, s = 0,
                u = this.length,
                l = "string" == typeof t && t;
            if (re.isFunction(t)) return this.each(function(e) {
                re(this).addClass(t.call(this, e, this.className))
            });
            if (l)
                for (e = (t || "").match(_e) || []; u > s; s++)
                    if (n = this[s], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(An, " ") : " ")) {
                        for (a = 0; r = e[a++];) i.indexOf(" " + r + " ") < 0 && (i += r + " ");
                        o = re.trim(i), n.className !== o && (n.className = o)
                    }
            return this
        },
        removeClass: function(t) {
            var e, n, i, r, a, o, s = 0,
                u = this.length,
                l = 0 === arguments.length || "string" == typeof t && t;
            if (re.isFunction(t)) return this.each(function(e) {
                re(this).removeClass(t.call(this, e, this.className))
            });
            if (l)
                for (e = (t || "").match(_e) || []; u > s; s++)
                    if (n = this[s], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(An, " ") : "")) {
                        for (a = 0; r = e[a++];)
                            for (; i.indexOf(" " + r + " ") >= 0;) i = i.replace(" " + r + " ", " ");
                        o = t ? re.trim(i) : "", n.className !== o && (n.className = o)
                    }
            return this
        },
        toggleClass: function(t, e) {
            var n = typeof t;
            return "boolean" == typeof e && "string" === n ? e ? this.addClass(t) : this.removeClass(t) : this.each(re.isFunction(t) ? function(n) {
                re(this).toggleClass(t.call(this, n, this.className, e), e)
            } : function() {
                if ("string" === n)
                    for (var e, i = 0, r = re(this), a = t.match(_e) || []; e = a[i++];) r.hasClass(e) ? r.removeClass(e) : r.addClass(e);
                else(n === ke || "boolean" === n) && (this.className && re._data(this, "__className__", this.className), this.className = this.className || t === !1 ? "" : re._data(this, "__className__") || "")
            })
        },
        hasClass: function(t) {
            for (var e = " " + t + " ", n = 0, i = this.length; i > n; n++)
                if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(An, " ").indexOf(e) >= 0) return !0;
            return !1
        }
    }), re.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(t, e) {
        re.fn[e] = function(t, n) {
            return arguments.length > 0 ? this.on(e, null, t, n) : this.trigger(e)
        }
    }), re.fn.extend({
        hover: function(t, e) {
            return this.mouseenter(t).mouseleave(e || t)
        },
        bind: function(t, e, n) {
            return this.on(t, null, e, n)
        },
        unbind: function(t, e) {
            return this.off(t, null, e)
        },
        delegate: function(t, e, n, i) {
            return this.on(e, t, n, i)
        },
        undelegate: function(t, e, n) {
            return 1 === arguments.length ? this.off(t, "**") : this.off(e, t || "**", n)
        }
    });
    var Nn = re.now(),
        Dn = /\?/,
        In = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    re.parseJSON = function(e) {
        if (t.JSON && t.JSON.parse) return t.JSON.parse(e + "");
        var n, i = null,
            r = re.trim(e + "");
        return r && !re.trim(r.replace(In, function(t, e, r, a) {
            return n && e && (i = 0), 0 === i ? t : (n = r || e, i += !a - !r, "")
        })) ? Function("return " + r)() : re.error("Invalid JSON: " + e)
    }, re.parseXML = function(e) {
        var n, i;
        if (!e || "string" != typeof e) return null;
        try {
            t.DOMParser ? (i = new DOMParser, n = i.parseFromString(e, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(e))
        } catch (r) {
            n = void 0
        }
        return n && n.documentElement && !n.getElementsByTagName("parsererror").length || re.error("Invalid XML: " + e), n
    };
    var Ln, Pn, qn = /#.*$/,
        On = /([?&])_=[^&]*/,
        Mn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        Rn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Hn = /^(?:GET|HEAD)$/,
        Fn = /^\/\//,
        zn = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        Bn = {},
        Wn = {},
        Xn = "*/".concat("*");
    try {
        Pn = location.href
    } catch (Qn) {
        Pn = pe.createElement("a"), Pn.href = "", Pn = Pn.href
    }
    Ln = zn.exec(Pn.toLowerCase()) || [], re.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Pn,
            type: "GET",
            isLocal: Rn.test(Ln[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Xn,
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
                "text json": re.parseJSON,
                "text xml": re.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(t, e) {
            return e ? F(F(t, re.ajaxSettings), e) : F(re.ajaxSettings, t)
        },
        ajaxPrefilter: R(Bn),
        ajaxTransport: R(Wn),
        ajax: function(t, e) {
            function n(t, e, n, i) {
                var r, c, v, y, b, x = e;
                2 !== _ && (_ = 2, s && clearTimeout(s), l = void 0, o = i || "", w.readyState = t > 0 ? 4 : 0, r = t >= 200 && 300 > t || 304 === t, n && (y = z(d, w, n)), y = B(d, y, w, r), r ? (d.ifModified && (b = w.getResponseHeader("Last-Modified"), b && (re.lastModified[a] = b), b = w.getResponseHeader("etag"), b && (re.etag[a] = b)), 204 === t || "HEAD" === d.type ? x = "nocontent" : 304 === t ? x = "notmodified" : (x = y.state, c = y.data, v = y.error, r = !v)) : (v = x, (t || !x) && (x = "error", 0 > t && (t = 0))), w.status = t, w.statusText = (e || x) + "", r ? p.resolveWith(h, [c, x, w]) : p.rejectWith(h, [w, x, v]), w.statusCode(g), g = void 0, u && f.trigger(r ? "ajaxSuccess" : "ajaxError", [w, d, r ? c : v]), m.fireWith(h, [w, x]), u && (f.trigger("ajaxComplete", [w, d]), --re.active || re.event.trigger("ajaxStop")))
            }
            "object" == typeof t && (e = t, t = void 0), e = e || {};
            var i, r, a, o, s, u, l, c, d = re.ajaxSetup({}, e),
                h = d.context || d,
                f = d.context && (h.nodeType || h.jquery) ? re(h) : re.event,
                p = re.Deferred(),
                m = re.Callbacks("once memory"),
                g = d.statusCode || {},
                v = {},
                y = {},
                _ = 0,
                b = "canceled",
                w = {
                    readyState: 0,
                    getResponseHeader: function(t) {
                        var e;
                        if (2 === _) {
                            if (!c)
                                for (c = {}; e = Mn.exec(o);) c[e[1].toLowerCase()] = e[2];
                            e = c[t.toLowerCase()]
                        }
                        return null == e ? null : e
                    },
                    getAllResponseHeaders: function() {
                        return 2 === _ ? o : null
                    },
                    setRequestHeader: function(t, e) {
                        var n = t.toLowerCase();
                        return _ || (t = y[n] = y[n] || t, v[t] = e), this
                    },
                    overrideMimeType: function(t) {
                        return _ || (d.mimeType = t), this
                    },
                    statusCode: function(t) {
                        var e;
                        if (t)
                            if (2 > _)
                                for (e in t) g[e] = [g[e], t[e]];
                            else w.always(t[w.status]);
                        return this
                    },
                    abort: function(t) {
                        var e = t || b;
                        return l && l.abort(e), n(0, e), this
                    }
                };
            if (p.promise(w).complete = m.add, w.success = w.done, w.error = w.fail, d.url = ((t || d.url || Pn) + "").replace(qn, "").replace(Fn, Ln[1] + "//"), d.type = e.method || e.type || d.method || d.type, d.dataTypes = re.trim(d.dataType || "*").toLowerCase().match(_e) || [""], null == d.crossDomain && (i = zn.exec(d.url.toLowerCase()), d.crossDomain = !(!i || i[1] === Ln[1] && i[2] === Ln[2] && (i[3] || ("http:" === i[1] ? "80" : "443")) === (Ln[3] || ("http:" === Ln[1] ? "80" : "443")))), d.data && d.processData && "string" != typeof d.data && (d.data = re.param(d.data, d.traditional)), H(Bn, d, e, w), 2 === _) return w;
            u = re.event && d.global, u && 0 === re.active++ && re.event.trigger("ajaxStart"), d.type = d.type.toUpperCase(), d.hasContent = !Hn.test(d.type), a = d.url, d.hasContent || (d.data && (a = d.url += (Dn.test(a) ? "&" : "?") + d.data, delete d.data), d.cache === !1 && (d.url = On.test(a) ? a.replace(On, "$1_=" + Nn++) : a + (Dn.test(a) ? "&" : "?") + "_=" + Nn++)), d.ifModified && (re.lastModified[a] && w.setRequestHeader("If-Modified-Since", re.lastModified[a]), re.etag[a] && w.setRequestHeader("If-None-Match", re.etag[a])), (d.data && d.hasContent && d.contentType !== !1 || e.contentType) && w.setRequestHeader("Content-Type", d.contentType), w.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", " + Xn + "; q=0.01" : "") : d.accepts["*"]);
            for (r in d.headers) w.setRequestHeader(r, d.headers[r]);
            if (d.beforeSend && (d.beforeSend.call(h, w, d) === !1 || 2 === _)) return w.abort();
            b = "abort";
            for (r in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) w[r](d[r]);
            if (l = H(Wn, d, e, w)) {
                w.readyState = 1, u && f.trigger("ajaxSend", [w, d]), d.async && d.timeout > 0 && (s = setTimeout(function() {
                    w.abort("timeout")
                }, d.timeout));
                try {
                    _ = 1, l.send(v, n)
                } catch (x) {
                    if (!(2 > _)) throw x;
                    n(-1, x)
                }
            } else n(-1, "No Transport");
            return w
        },
        getJSON: function(t, e, n) {
            return re.get(t, e, n, "json")
        },
        getScript: function(t, e) {
            return re.get(t, void 0, e, "script")
        }
    }), re.each(["get", "post"], function(t, e) {
        re[e] = function(t, n, i, r) {
            return re.isFunction(n) && (r = r || i, i = n, n = void 0), re.ajax({
                url: t,
                type: e,
                dataType: r,
                data: n,
                success: i
            })
        }
    }), re._evalUrl = function(t) {
        return re.ajax({
            url: t,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    }, re.fn.extend({
        wrapAll: function(t) {
            if (re.isFunction(t)) return this.each(function(e) {
                re(this).wrapAll(t.call(this, e))
            });
            if (this[0]) {
                var e = re(t, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && e.insertBefore(this[0]), e.map(function() {
                    for (var t = this; t.firstChild && 1 === t.firstChild.nodeType;) t = t.firstChild;
                    return t
                }).append(this)
            }
            return this
        },
        wrapInner: function(t) {
            return this.each(re.isFunction(t) ? function(e) {
                re(this).wrapInner(t.call(this, e))
            } : function() {
                var e = re(this),
                    n = e.contents();
                n.length ? n.wrapAll(t) : e.append(t)
            })
        },
        wrap: function(t) {
            var e = re.isFunction(t);
            return this.each(function(n) {
                re(this).wrapAll(e ? t.call(this, n) : t)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                re.nodeName(this, "body") || re(this).replaceWith(this.childNodes)
            }).end()
        }
    }), re.expr.filters.hidden = function(t) {
        return t.offsetWidth <= 0 && t.offsetHeight <= 0 || !ne.reliableHiddenOffsets() && "none" === (t.style && t.style.display || re.css(t, "display"))
    }, re.expr.filters.visible = function(t) {
        return !re.expr.filters.hidden(t)
    };
    var Un = /%20/g,
        Jn = /\[\]$/,
        Vn = /\r?\n/g,
        Kn = /^(?:submit|button|image|reset|file)$/i,
        Yn = /^(?:input|select|textarea|keygen)/i;
    re.param = function(t, e) {
        var n, i = [],
            r = function(t, e) {
                e = re.isFunction(e) ? e() : null == e ? "" : e, i[i.length] = encodeURIComponent(t) + "=" + encodeURIComponent(e)
            };
        if (void 0 === e && (e = re.ajaxSettings && re.ajaxSettings.traditional), re.isArray(t) || t.jquery && !re.isPlainObject(t)) re.each(t, function() {
            r(this.name, this.value)
        });
        else
            for (n in t) W(n, t[n], e, r);
        return i.join("&").replace(Un, "+")
    }, re.fn.extend({
        serialize: function() {
            return re.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var t = re.prop(this, "elements");
                return t ? re.makeArray(t) : this
            }).filter(function() {
                var t = this.type;
                return this.name && !re(this).is(":disabled") && Yn.test(this.nodeName) && !Kn.test(t) && (this.checked || !Ae.test(t))
            }).map(function(t, e) {
                var n = re(this).val();
                return null == n ? null : re.isArray(n) ? re.map(n, function(t) {
                    return {
                        name: e.name,
                        value: t.replace(Vn, "\r\n")
                    }
                }) : {
                    name: e.name,
                    value: n.replace(Vn, "\r\n")
                }
            }).get()
        }
    }), re.ajaxSettings.xhr = void 0 !== t.ActiveXObject ? function() {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && X() || Q()
    } : X;
    var Gn = 0,
        Zn = {},
        ti = re.ajaxSettings.xhr();
    t.attachEvent && t.attachEvent("onunload", function() {
        for (var t in Zn) Zn[t](void 0, !0)
    }), ne.cors = !!ti && "withCredentials" in ti, ti = ne.ajax = !!ti, ti && re.ajaxTransport(function(t) {
        if (!t.crossDomain || ne.cors) {
            var e;
            return {
                send: function(n, i) {
                    var r, a = t.xhr(),
                        o = ++Gn;
                    if (a.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
                        for (r in t.xhrFields) a[r] = t.xhrFields[r];
                    t.mimeType && a.overrideMimeType && a.overrideMimeType(t.mimeType), t.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                    for (r in n) void 0 !== n[r] && a.setRequestHeader(r, n[r] + "");
                    a.send(t.hasContent && t.data || null), e = function(n, r) {
                        var s, u, l;
                        if (e && (r || 4 === a.readyState))
                            if (delete Zn[o], e = void 0, a.onreadystatechange = re.noop, r) 4 !== a.readyState && a.abort();
                            else {
                                l = {}, s = a.status, "string" == typeof a.responseText && (l.text = a.responseText);
                                try {
                                    u = a.statusText
                                } catch (c) {
                                    u = ""
                                }
                                s || !t.isLocal || t.crossDomain ? 1223 === s && (s = 204) : s = l.text ? 200 : 404
                            }
                        l && i(s, u, l, a.getAllResponseHeaders())
                    }, t.async ? 4 === a.readyState ? setTimeout(e) : a.onreadystatechange = Zn[o] = e : e()
                },
                abort: function() {
                    e && e(void 0, !0)
                }
            }
        }
    }), re.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(t) {
                return re.globalEval(t), t
            }
        }
    }), re.ajaxPrefilter("script", function(t) {
        void 0 === t.cache && (t.cache = !1), t.crossDomain && (t.type = "GET", t.global = !1)
    }), re.ajaxTransport("script", function(t) {
        if (t.crossDomain) {
            var e, n = pe.head || re("head")[0] || pe.documentElement;
            return {
                send: function(i, r) {
                    e = pe.createElement("script"), e.async = !0, t.scriptCharset && (e.charset = t.scriptCharset), e.src = t.url, e.onload = e.onreadystatechange = function(t, n) {
                        (n || !e.readyState || /loaded|complete/.test(e.readyState)) && (e.onload = e.onreadystatechange = null, e.parentNode && e.parentNode.removeChild(e), e = null, n || r(200, "success"))
                    }, n.insertBefore(e, n.firstChild)
                },
                abort: function() {
                    e && e.onload(void 0, !0)
                }
            }
        }
    });
    var ei = [],
        ni = /(=)\?(?=&|$)|\?\?/;
    re.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var t = ei.pop() || re.expando + "_" + Nn++;
            return this[t] = !0, t
        }
    }), re.ajaxPrefilter("json jsonp", function(e, n, i) {
        var r, a, o, s = e.jsonp !== !1 && (ni.test(e.url) ? "url" : "string" == typeof e.data && !(e.contentType || "").indexOf("application/x-www-form-urlencoded") && ni.test(e.data) && "data");
        return s || "jsonp" === e.dataTypes[0] ? (r = e.jsonpCallback = re.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, s ? e[s] = e[s].replace(ni, "$1" + r) : e.jsonp !== !1 && (e.url += (Dn.test(e.url) ? "&" : "?") + e.jsonp + "=" + r), e.converters["script json"] = function() {
            return o || re.error(r + " was not called"), o[0]
        }, e.dataTypes[0] = "json", a = t[r], t[r] = function() {
            o = arguments
        }, i.always(function() {
            t[r] = a, e[r] && (e.jsonpCallback = n.jsonpCallback, ei.push(r)), o && re.isFunction(a) && a(o[0]), o = a = void 0
        }), "script") : void 0
    }), re.parseHTML = function(t, e, n) {
        if (!t || "string" != typeof t) return null;
        "boolean" == typeof e && (n = e, e = !1), e = e || pe;
        var i = de.exec(t),
            r = !n && [];
        return i ? [e.createElement(i[1])] : (i = re.buildFragment([t], e, r), r && r.length && re(r).remove(), re.merge([], i.childNodes))
    };
    var ii = re.fn.load;
    re.fn.load = function(t, e, n) {
        if ("string" != typeof t && ii) return ii.apply(this, arguments);
        var i, r, a, o = this,
            s = t.indexOf(" ");
        return s >= 0 && (i = re.trim(t.slice(s, t.length)), t = t.slice(0, s)), re.isFunction(e) ? (n = e, e = void 0) : e && "object" == typeof e && (a = "POST"), o.length > 0 && re.ajax({
            url: t,
            type: a,
            dataType: "html",
            data: e
        }).done(function(t) {
            r = arguments, o.html(i ? re("<div>").append(re.parseHTML(t)).find(i) : t)
        }).complete(n && function(t, e) {
            o.each(n, r || [t.responseText, e, t])
        }), this
    }, re.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(t, e) {
        re.fn[e] = function(t) {
            return this.on(e, t)
        }
    }), re.expr.filters.animated = function(t) {
        return re.grep(re.timers, function(e) {
            return t === e.elem
        }).length
    };
    var ri = t.document.documentElement;
    re.offset = {
        setOffset: function(t, e, n) {
            var i, r, a, o, s, u, l, c = re.css(t, "position"),
                d = re(t),
                h = {};
            "static" === c && (t.style.position = "relative"), s = d.offset(), a = re.css(t, "top"), u = re.css(t, "left"), l = ("absolute" === c || "fixed" === c) && re.inArray("auto", [a, u]) > -1, l ? (i = d.position(), o = i.top, r = i.left) : (o = parseFloat(a) || 0, r = parseFloat(u) || 0), re.isFunction(e) && (e = e.call(t, n, s)), null != e.top && (h.top = e.top - s.top + o), null != e.left && (h.left = e.left - s.left + r), "using" in e ? e.using.call(t, h) : d.css(h)
        }
    }, re.fn.extend({
        offset: function(t) {
            if (arguments.length) return void 0 === t ? this : this.each(function(e) {
                re.offset.setOffset(this, t, e)
            });
            var e, n, i = {
                    top: 0,
                    left: 0
                },
                r = this[0],
                a = r && r.ownerDocument;
            if (a) return e = a.documentElement, re.contains(e, r) ? (typeof r.getBoundingClientRect !== ke && (i = r.getBoundingClientRect()), n = U(a), {
                top: i.top + (n.pageYOffset || e.scrollTop) - (e.clientTop || 0),
                left: i.left + (n.pageXOffset || e.scrollLeft) - (e.clientLeft || 0)
            }) : i
        },
        position: function() {
            if (this[0]) {
                var t, e, n = {
                        top: 0,
                        left: 0
                    },
                    i = this[0];
                return "fixed" === re.css(i, "position") ? e = i.getBoundingClientRect() : (t = this.offsetParent(), e = this.offset(), re.nodeName(t[0], "html") || (n = t.offset()), n.top += re.css(t[0], "borderTopWidth", !0), n.left += re.css(t[0], "borderLeftWidth", !0)), {
                    top: e.top - n.top - re.css(i, "marginTop", !0),
                    left: e.left - n.left - re.css(i, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var t = this.offsetParent || ri; t && !re.nodeName(t, "html") && "static" === re.css(t, "position");) t = t.offsetParent;
                return t || ri
            })
        }
    }), re.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, e) {
        var n = /Y/.test(e);
        re.fn[t] = function(i) {
            return Ee(this, function(t, i, r) {
                var a = U(t);
                return void 0 === r ? a ? e in a ? a[e] : a.document.documentElement[i] : t[i] : void(a ? a.scrollTo(n ? re(a).scrollLeft() : r, n ? r : re(a).scrollTop()) : t[i] = r)
            }, t, i, arguments.length, null)
        }
    }), re.each(["top", "left"], function(t, e) {
        re.cssHooks[e] = $(ne.pixelPosition, function(t, n) {
            return n ? (n = en(t, e), rn.test(n) ? re(t).position()[e] + "px" : n) : void 0
        })
    }), re.each({
        Height: "height",
        Width: "width"
    }, function(t, e) {
        re.each({
            padding: "inner" + t,
            content: e,
            "": "outer" + t
        }, function(n, i) {
            re.fn[i] = function(i, r) {
                var a = arguments.length && (n || "boolean" != typeof i),
                    o = n || (i === !0 || r === !0 ? "margin" : "border");
                return Ee(this, function(e, n, i) {
                    var r;
                    return re.isWindow(e) ? e.document.documentElement["client" + t] : 9 === e.nodeType ? (r = e.documentElement, Math.max(e.body["scroll" + t], r["scroll" + t], e.body["offset" + t], r["offset" + t], r["client" + t])) : void 0 === i ? re.css(e, n, o) : re.style(e, n, i, o)
                }, e, a ? i : void 0, a, null)
            }
        })
    }), re.fn.size = function() {
        return this.length
    }, re.fn.andSelf = re.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return re
    });
    var ai = t.jQuery,
        oi = t.$;
    return re.noConflict = function(e) {
        return t.$ === re && (t.$ = oi), e && t.jQuery === re && (t.jQuery = ai), re
    }, typeof e === ke && (t.jQuery = t.$ = re), re
}),
function(t) {
    if ("object" == typeof exports) {
        var e = require("jquery");
        module.exports = t(e || $)
    } else "function" == typeof define && define.amd ? define(["jquery"], t) : t(e || $)
}(function(t) {
    function e(t) {
        var e = this.data(),
            i = this.find("ul");
        if (e.vals && 0 !== i.length) {
            t || (t = e.seconds);
            var r = !1;
            e.intervalId && (r = !0, clearTimeout(e.intervalId));
            var a = Math.floor(t / 86400),
                o = 86400 * a,
                s = Math.floor((t - o) / 3600),
                o = o + 3600 * s,
                u = Math.floor((t - o) / 60);
            for (t -= o + 60 * u, a = (100 > a ? "0" + (10 > a ? "0" : "") : "") + a + (10 > s ? "0" : "") + s + (10 > u ? "0" : "") + u + (10 > t ? "0" : "") + t, s = e.vals.length - 1, u = a.length - 1; s >= 0; s--, u--) t = parseInt(a.substr(u, 1)), e.vals[s] = t, i.eq(s).children().html(t);
            if (r) {
                var l = this;
                e.ttStartTime = Date.now(), e.intervalId = setTimeout(function() {
                    n.call(l)
                }, 1e3), this.data("intervalId", e.intervalId)
            }
        }
    }

    function n(e) {
        var i = this.find("ul"),
            r = this.data();
        if (r.vals && 0 != i.length) {
            void 0 == e && (e = r.iSec);
            var a = r.vals[e],
                o = i.eq(e),
                s = o.children(),
                u = r.countdown ? -1 : 1;
            if (s.eq(1).html(a), a += u, e == r.iSec) {
                var l = r.tickTimeout,
                    c = (new Date).getTime() - r.ttStartTime;
                r.sec += u, l += Math.abs(r.seconds - r.sec) * l - c, r.intervalId = setTimeout(function() {
                    n.call(d)
                }, l)
            }(0 > a || a > r.limits[e]) && (0 > a ? (a = r.limits[e], e == r.iHour && 0 < r.displayDays && e > 0 && 0 == r.vals[e - 1] && (a = 3)) : a = 0, e > 0 && n.call(this, e - 1)), s.eq(0).html(a);
            var d = this;
            t.support.transition ? (o.addClass("transition"), o.css({
                top: 0
            }), setTimeout(function() {
                o.removeClass("transition"), s.eq(1).html(a), o.css({
                    top: "-" + r.height + "px"
                }), u > 0 || e != r.iSec || (r.sec == r.countdownAlertLimit && i.parent().addClass("timeTo-alert"), 0 === r.sec && (i.parent().removeClass("timeTo-alert"), r.intervalId && (clearTimeout(r.intervalId), d.data("intervalId", null)), "function" == typeof r.callback && r.callback()))
            }, 410)) : o.stop().animate({
                top: 0
            }, 400, e != r.iSec ? null : function() {
                s.eq(1).html(a), o.css({
                    top: "-" + r.height + "px"
                }), u > 0 || e != r.iSec || (r.sec == r.countdownAlertLimit ? i.parent().addClass("timeTo-alert") : 0 == r.sec && (i.parent().removeClass("timeTo-alert"), r.intervalId && (clearTimeout(r.intervalId), d.data("intervalId", null)), "function" == typeof r.callback && r.callback()))
            }), r.vals[e] = a
        } else r.intervalId && (clearTimeout(r.intervalId), this.data("intervalId", null)), r.callback && r.callback()
    }
    var i = {
            start: function(t) {
                t && e.call(this, t);
                var i = this;
                t = setTimeout(function() {
                    n.call(i)
                }, 1e3), this.data("ttStartTime", (new Date).getTime()), this.data("intervalId", t)
            },
            stop: function() {
                var t = this.data();
                return t.intervalId && (clearTimeout(t.intervalId), this.data("intervalId", null)), t
            },
            reset: function(t) {
                var n = i.stop.call(this);
                this.find("div").css({
                    backgroundPosition: "left center"
                }), this.find("ul").parent().removeClass("timeTo-alert"), "undefined" == typeof t && (t = n.value), n.vals && (n.vals = null), e.call(this, t)
            }
        },
        r = {
            en: {
                days: "days",
                hours: "hours",
                min: "minutes",
                sec: "seconds"
            },
            ru: {
                days: "\u0434\u043d\u0435\u0439",
                hours: "\u0447\u0430\u0441\u043e\u0432",
                min: "\u043c\u0438\u043d\u0443\u0442",
                sec: "\u0441\u0435\u043a\u0443\u043d\u0434"
            },
            ua: {
                days: "\u0434\u043di\u0432",
                hours: "\u0433\u043e\u0434\u0438\u043d",
                min: "\u0445\u0432\u0438\u043b\u0438\u043d",
                sec: "\u0441\u0435\u043a\u0443\u043d\u0434"
            },
            de: {
                days: "Tag",
                hours: "Uhr",
                min: "Minuten",
                sec: "Secunden"
            },
            fr: {
                days: "jours",
                hours: "heures",
                min: "minutes",
                sec: "secondes"
            },
            sp: {
                days: "d\xedas",
                hours: "reloj",
                min: "minutos",
                sec: "segundos"
            },
            it: {
                days: "giorni",
                hours: "ore",
                min: "minuti",
                sec: "secondi"
            },
            nl: {
                days: "dagen",
                hours: "uren",
                min: "minuten",
                sec: "seconden"
            },
            no: {
                days: "dager",
                hours: "timer",
                min: "minutter",
                sec: "sekunder"
            },
            pt: {
                days: "dias",
                hours: "horas",
                min: "minutos",
                sec: "segundos"
            }
        };
    return "undefined" == typeof t.support.transition && (t.support.transition = function() {
        var t = (document.body || document.documentElement).style;
        return void 0 !== t.transition || void 0 !== t.WebkitTransition || void 0 !== t.MozTransition || void 0 !== t.MsTransition || void 0 !== t.OTransition
    }()), t.fn.timeTo = function() {
        for (var n, a, o = {
                callback: null,
                captionSize: 0,
                countdown: !0,
                countdownAlertLimit: 10,
                displayCaptions: !1,
                displayDays: 0,
                displayHours: !0,
                fontFamily: "Verdana, sans-serif",
                fontSize: 28,
                lang: "en",
                seconds: 0,
                start: !0,
                theme: "white",
                vals: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                limits: [9, 9, 9, 2, 9, 5, 9, 5, 9],
                iSec: 8,
                iHour: 4,
                tickTimeout: 1e3,
                intervalId: null
            }, s = {}, u = 0; a = arguments[u]; ++u) 0 == u && "string" == typeof a ? n = a : "object" == typeof a ? "function" == typeof a.getTime ? s.timeTo = a : s = t.extend(s, a) : "function" == typeof a ? s.callback = a : (a = parseInt(a), isNaN(a) || (s.seconds = a));
        if (s.timeTo) {
            var l, u = (new Date).getTime();
            s.timeTo.getTime ? l = s.timeTo.getTime() : "number" == typeof s.timeTo && (l = s.timeTo), s.timeTo > u && (s.seconds = Math.floor((l - u) / 1e3))
        } else if (s.time || !s.seconds)
            if ((l = s.time) || (l = new Date), "object" == typeof l && l.getTime) s.seconds = 3600 * l.getHours() + 60 * l.getMinutes() + l.getSeconds(), s.countdown = !1;
            else if ("string" == typeof l) {
            l = l.split(":"), u = 0, a = 1;
            for (var c; c = l.pop();) u += c * a, a *= 60;
            s.seconds = u, s.countdown = !1
        }
        return !1 !== s.countdown && 86400 < s.seconds && "undefined" == typeof s.displayDays ? (l = Math.floor(s.seconds / 86400), s.displayDays = 10 > l && 1 || 100 > l && 2 || 3) : !0 === s.displayDays ? s.displayDays = 3 : s.displayDays && (s.displayDays = 0 < s.displayDays ? Math.floor(s.displayDays) : 3), this.each(function() {
            var a, u = t(this),
                l = u.data();
            if (l.vals) l.intervalId && (clearInterval(l.intervalId), l.intervalId = null), t.extend(l, s);
            else {
                l = t.extend(o, s), l.height = Math.round(100 * l.fontSize / 93), l.width = Math.round(.8 * l.fontSize + .13 * l.height), l.displayHours = !(!l.displayDays && !l.displayHours), u.addClass("timeTo").addClass("timeTo-" + l.theme).css({
                    fontFamily: l.fontFamily,
                    fontSize: l.fontSize + "px"
                });
                var c = '<ul style="left:' + Math.round(l.height / 10) + "px; top:-" + l.height + 'px"><li>0</li><li>0</li></ul></div>',
                    d = ' style="width:' + l.width + "px; height:" + l.height + 'px;"';
                a = '<div class="first"' + d + ">" + c;
                var c = "<div" + d + ">" + c,
                    h = Math.round(2 * l.width + 3),
                    d = l.captionSize || Math.round(.43 * l.fontSize);
                if (thtml = (l.displayCaptions ? (l.displayHours ? '<figure style="max-width:' + h + 'px">$1<figcaption style="font-size:' + d + 'px">' + r[l.lang].hours + "</figcaption></figure><span>:</span>" : "") + '<figure style="max-width:' + h + 'px">$1<figcaption style="font-size:' + d + 'px">' + r[l.lang].min + '</figcaption></figure><span>:</span><figure style="max-width:' + h + 'px">$1<figcaption style="font-size:' + d + 'px">' + r[l.lang].sec + "</figcaption></figure>" : (l.displayHours ? "$1<span>:</span>" : "") + "$1<span>:</span>$1").replace(/\$1/g, a + c), 0 < l.displayDays) {
                    var h = .4 * l.fontSize,
                        f = a;
                    for (a = l.displayDays - 1; a > 0; a--) f += 1 === a ? c.replace('">', " margin-right:" + Math.round(h) + 'px">') : c;
                    thtml = (l.displayCaptions ? '<figure style="width:' + Math.round(l.width * l.displayDays + h + 4) + 'px">$1<figcaption style="font-size:' + d + "px; padding-right:" + Math.round(h) + 'px">' + r[l.lang].days + "</figcaption></figure>" : "$1").replace(/\$1/, f) + thtml
                }
                u.html(thtml)
            }
            if (c = u.find("div"), c.length < l.vals.length) {
                for (d = l.vals.length - c.length, h = l.vals, f = l.limits, l.vals = [], l.limits = [], a = 0; a < c.length; a++) l.vals[a] = h[d + a], l.limits[a] = f[d + a];
                l.iSec = l.vals.length - 1, l.iHour = l.vals.length - 5
            }
            l.sec = l.seconds, u.data(l), n && i[n] ? i[n].call(u, l.seconds) : l.start ? i.start.call(u, l.seconds) : e.call(u, l.seconds)
        })
    }, jQuery
}),
function(t, e) {
    t.rails !== e && t.error("jquery-ujs has already been loaded!");
    var n, i = t(document);
    t.rails = n = {
        linkClickSelector: "a[data-confirm], a[data-method], a[data-remote], a[data-disable-with], a[data-disable]",
        buttonClickSelector: "button[data-remote]:not(form button), button[data-confirm]:not(form button)",
        inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
        formSubmitSelector: "form",
        formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
        disableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
        enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
        requiredInputSelector: "input[name][required]:not([disabled]),textarea[name][required]:not([disabled])",
        fileInputSelector: "input[type=file]",
        linkDisableSelector: "a[data-disable-with], a[data-disable]",
        buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]",
        CSRFProtection: function(e) {
            var n = t('meta[name="csrf-token"]').attr("content");
            n && e.setRequestHeader("X-CSRF-Token", n)
        },
        refreshCSRFTokens: function() {
            var e = t("meta[name=csrf-token]").attr("content"),
                n = t("meta[name=csrf-param]").attr("content");
            t('form input[name="' + n + '"]').val(e)
        },
        fire: function(e, n, i) {
            var r = t.Event(n);
            return e.trigger(r, i), r.result !== !1
        },
        confirm: function(t) {
            return confirm(t)
        },
        ajax: function(e) {
            return t.ajax(e)
        },
        href: function(t) {
            return t.attr("href")
        },
        handleRemote: function(i) {
            var r, a, o, s, u, l, c, d;
            if (n.fire(i, "ajax:before")) {
                if (s = i.data("cross-domain"), u = s === e ? null : s, l = i.data("with-credentials") || null, c = i.data("type") || t.ajaxSettings && t.ajaxSettings.dataType, i.is("form")) {
                    r = i.attr("method"), a = i.attr("action"), o = i.serializeArray();
                    var h = i.data("ujs:submit-button");
                    h && (o.push(h), i.data("ujs:submit-button", null))
                } else i.is(n.inputChangeSelector) ? (r = i.data("method"), a = i.data("url"), o = i.serialize(), i.data("params") && (o = o + "&" + i.data("params"))) : i.is(n.buttonClickSelector) ? (r = i.data("method") || "get", a = i.data("url"), o = i.serialize(), i.data("params") && (o = o + "&" + i.data("params"))) : (r = i.data("method"), a = n.href(i), o = i.data("params") || null);
                return d = {
                    type: r || "GET",
                    data: o,
                    dataType: c,
                    beforeSend: function(t, r) {
                        return r.dataType === e && t.setRequestHeader("accept", "*/*;q=0.5, " + r.accepts.script), n.fire(i, "ajax:beforeSend", [t, r]) ? void i.trigger("ajax:send", t) : !1
                    },
                    success: function(t, e, n) {
                        i.trigger("ajax:success", [t, e, n])
                    },
                    complete: function(t, e) {
                        i.trigger("ajax:complete", [t, e])
                    },
                    error: function(t, e, n) {
                        i.trigger("ajax:error", [t, e, n])
                    },
                    crossDomain: u
                }, l && (d.xhrFields = {
                    withCredentials: l
                }), a && (d.url = a), n.ajax(d)
            }
            return !1
        },
        handleMethod: function(i) {
            var r = n.href(i),
                a = i.data("method"),
                o = i.attr("target"),
                s = t("meta[name=csrf-token]").attr("content"),
                u = t("meta[name=csrf-param]").attr("content"),
                l = t('<form method="post" action="' + r + '"></form>'),
                c = '<input name="_method" value="' + a + '" type="hidden" />';
            u !== e && s !== e && (c += '<input name="' + u + '" value="' + s + '" type="hidden" />'), o && l.attr("target", o), l.hide().append(c).appendTo("body"), l.submit()
        },
        formElements: function(e, n) {
            return e.is("form") ? t(e[0].elements).filter(n) : e.find(n)
        },
        disableFormElements: function(e) {
            n.formElements(e, n.disableSelector).each(function() {
                n.disableFormElement(t(this))
            })
        },
        disableFormElement: function(t) {
            var n, i;
            n = t.is("button") ? "html" : "val", i = t.data("disable-with"), t.data("ujs:enable-with", t[n]()), i !== e && t[n](i), t.prop("disabled", !0)
        },
        enableFormElements: function(e) {
            n.formElements(e, n.enableSelector).each(function() {
                n.enableFormElement(t(this))
            })
        },
        enableFormElement: function(t) {
            var e = t.is("button") ? "html" : "val";
            t.data("ujs:enable-with") && t[e](t.data("ujs:enable-with")), t.prop("disabled", !1)
        },
        allowAction: function(t) {
            var e, i = t.data("confirm"),
                r = !1;
            return i ? (n.fire(t, "confirm") && (r = n.confirm(i), e = n.fire(t, "confirm:complete", [r])), r && e) : !0
        },
        blankInputs: function(e, n, i) {
            var r, a, o = t(),
                s = n || "input,textarea",
                u = e.find(s);
            return u.each(function() {
                if (r = t(this), a = r.is("input[type=checkbox],input[type=radio]") ? r.is(":checked") : r.val(), !a == !i) {
                    if (r.is("input[type=radio]") && u.filter('input[type=radio]:checked[name="' + r.attr("name") + '"]').length) return !0;
                    o = o.add(r)
                }
            }), o.length ? o : !1
        },
        nonBlankInputs: function(t, e) {
            return n.blankInputs(t, e, !0)
        },
        stopEverything: function(e) {
            return t(e.target).trigger("ujs:everythingStopped"), e.stopImmediatePropagation(), !1
        },
        disableElement: function(t) {
            var i = t.data("disable-with");
            t.data("ujs:enable-with", t.html()), i !== e && t.html(i), t.bind("click.railsDisable", function(t) {
                return n.stopEverything(t)
            })
        },
        enableElement: function(t) {
            t.data("ujs:enable-with") !== e && (t.html(t.data("ujs:enable-with")), t.removeData("ujs:enable-with")), t.unbind("click.railsDisable")
        }
    }, n.fire(i, "rails:attachBindings") && (t.ajaxPrefilter(function(t, e, i) {
        t.crossDomain || n.CSRFProtection(i)
    }), t(window).on("pageshow.rails", function() {
        t(t.rails.enableSelector).each(function() {
            var e = t(this);
            e.data("ujs:enable-with") && t.rails.enableFormElement(e)
        }), t(t.rails.linkDisableSelector).each(function() {
            var e = t(this);
            e.data("ujs:enable-with") && t.rails.enableElement(e)
        })
    }), i.delegate(n.linkDisableSelector, "ajax:complete", function() {
        n.enableElement(t(this))
    }), i.delegate(n.buttonDisableSelector, "ajax:complete", function() {
        n.enableFormElement(t(this))
    }), i.delegate(n.linkClickSelector, "click.rails", function(i) {
        var r = t(this),
            a = r.data("method"),
            o = r.data("params"),
            s = i.metaKey || i.ctrlKey;
        if (!n.allowAction(r)) return n.stopEverything(i);
        if (!s && r.is(n.linkDisableSelector) && n.disableElement(r), r.data("remote") !== e) {
            if (s && (!a || "GET" === a) && !o) return !0;
            var u = n.handleRemote(r);
            return u === !1 ? n.enableElement(r) : u.fail(function() {
                n.enableElement(r)
            }), !1
        }
        return a ? (n.handleMethod(r), !1) : void 0
    }), i.delegate(n.buttonClickSelector, "click.rails", function(e) {
        var i = t(this);
        if (!n.allowAction(i)) return n.stopEverything(e);
        i.is(n.buttonDisableSelector) && n.disableFormElement(i);
        var r = n.handleRemote(i);
        return r === !1 ? n.enableFormElement(i) : r.fail(function() {
            n.enableFormElement(i)
        }), !1
    }), i.delegate(n.inputChangeSelector, "change.rails", function(e) {
        var i = t(this);
        return n.allowAction(i) ? (n.handleRemote(i), !1) : n.stopEverything(e)
    }), i.delegate(n.formSubmitSelector, "submit.rails", function(i) {
        var r, a, o = t(this),
            s = o.data("remote") !== e;
        if (!n.allowAction(o)) return n.stopEverything(i);
        if (o.attr("novalidate") == e && (r = n.blankInputs(o, n.requiredInputSelector), r && n.fire(o, "ajax:aborted:required", [r]))) return n.stopEverything(i);
        if (s) {
            if (a = n.nonBlankInputs(o, n.fileInputSelector)) {
                setTimeout(function() {
                    n.disableFormElements(o)
                }, 13);
                var u = n.fire(o, "ajax:aborted:file", [a]);
                return u || setTimeout(function() {
                    n.enableFormElements(o)
                }, 13), u
            }
            return n.handleRemote(o), !1
        }
        setTimeout(function() {
            n.disableFormElements(o)
        }, 13)
    }), i.delegate(n.formInputClickSelector, "click.rails", function(e) {
        var i = t(this);
        if (!n.allowAction(i)) return n.stopEverything(e);
        var r = i.attr("name"),
            a = r ? {
                name: r,
                value: i.val()
            } : null;
        i.closest("form").data("ujs:submit-button", a)
    }), i.delegate(n.formSubmitSelector, "ajax:send.rails", function(e) {
        this == e.target && n.disableFormElements(t(this))
    }), i.delegate(n.formSubmitSelector, "ajax:complete.rails", function(e) {
        this == e.target && n.enableFormElements(t(this))
    }), t(function() {
        n.refreshCSRFTokens()
    }))
}(jQuery), ! function(t) {
    "use strict";
    t(function() {
        t.support.transition = function() {
            var t = function() {
                var t, e = document.createElement("bootstrap"),
                    n = {
                        WebkitTransition: "webkitTransitionEnd",
                        MozTransition: "transitionend",
                        OTransition: "oTransitionEnd otransitionend",
                        transition: "transitionend"
                    };
                for (t in n)
                    if (void 0 !== e.style[t]) return n[t]
            }();
            return t && {
                end: t
            }
        }()
    })
}(window.jQuery), ! function(t) {
    "use strict";
    var e = '[data-dismiss="alert"]',
        n = function(n) {
            t(n).on("click", e, this.close)
        };
    n.prototype.close = function(e) {
        function n() {
            i.trigger("closed").remove()
        }
        var i, r = t(this),
            a = r.attr("data-target");
        a || (a = r.attr("href"), a = a && a.replace(/.*(?=#[^\s]*$)/, "")), i = t(a), e && e.preventDefault(), i.length || (i = r.hasClass("alert") ? r : r.parent()), i.trigger(e = t.Event("close")), e.isDefaultPrevented() || (i.removeClass("in"), t.support.transition && i.hasClass("fade") ? i.on(t.support.transition.end, n) : n())
    };
    var i = t.fn.alert;
    t.fn.alert = function(e) {
        return this.each(function() {
            var i = t(this),
                r = i.data("alert");
            r || i.data("alert", r = new n(this)), "string" == typeof e && r[e].call(i)
        })
    }, t.fn.alert.Constructor = n, t.fn.alert.noConflict = function() {
        return t.fn.alert = i, this
    }, t(document).on("click.alert.data-api", e, n.prototype.close)
}(window.jQuery), ! function(t) {
    "use strict";
    var e = function(e, n) {
        this.options = n, this.$element = t(e).delegate('[data-dismiss="modal"]', "click.dismiss.modal", t.proxy(this.hide, this)), this.options.remote && this.$element.find(".modal-body").load(this.options.remote)
    };
    e.prototype = {
        constructor: e,
        toggle: function() {
            return this[this.isShown ? "hide" : "show"]()
        },
        show: function() {
            var e = this,
                n = t.Event("show");
            this.$element.trigger(n), this.isShown || n.isDefaultPrevented() || (this.isShown = !0, this.escape(), this.backdrop(function() {
                var n = t.support.transition && e.$element.hasClass("fade");
                e.$element.parent().length || e.$element.appendTo(document.body), e.$element.show(), n && e.$element[0].offsetWidth, e.$element.addClass("in").attr("aria-hidden", !1), e.enforceFocus(), n ? e.$element.one(t.support.transition.end, function() {
                    e.$element.focus().trigger("shown")
                }) : e.$element.focus().trigger("shown")
            }))
        },
        hide: function(e) {
            e && e.preventDefault();
            e = t.Event("hide"), this.$element.trigger(e), this.isShown && !e.isDefaultPrevented() && (this.isShown = !1, this.escape(), t(document).off("focusin.modal"), this.$element.removeClass("in").attr("aria-hidden", !0), t.support.transition && this.$element.hasClass("fade") ? this.hideWithTransition() : this.hideModal())
        },
        enforceFocus: function() {
            var e = this;
            t(document).on("focusin.modal", function(t) {
                e.$element[0] === t.target || e.$element.has(t.target).length || e.$element.focus()
            })
        },
        escape: function() {
            var t = this;
            this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.modal", function(e) {
                27 == e.which && t.hide()
            }) : this.isShown || this.$element.off("keyup.dismiss.modal")
        },
        hideWithTransition: function() {
            var e = this,
                n = setTimeout(function() {
                    e.$element.off(t.support.transition.end), e.hideModal()
                }, 500);
            this.$element.one(t.support.transition.end, function() {
                clearTimeout(n), e.hideModal()
            })
        },
        hideModal: function() {
            var t = this;
            this.$element.hide(), this.backdrop(function() {
                t.removeBackdrop(), t.$element.trigger("hidden")
            })
        },
        removeBackdrop: function() {
            this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
        },
        backdrop: function(e) {
            var n = this.$element.hasClass("fade") ? "fade" : "";
            if (this.isShown && this.options.backdrop) {
                var i = t.support.transition && n;
                if (this.$backdrop = t('<div class="modal-backdrop ' + n + '" />').appendTo(document.body), this.$backdrop.click("static" == this.options.backdrop ? t.proxy(this.$element[0].focus, this.$element[0]) : t.proxy(this.hide, this)), i && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !e) return;
                i ? this.$backdrop.one(t.support.transition.end, e) : e()
            } else !this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), t.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(t.support.transition.end, e) : e()) : e && e()
        }
    };
    var n = t.fn.modal;
    t.fn.modal = function(n) {
        return this.each(function() {
            var i = t(this),
                r = i.data("modal"),
                a = t.extend({}, t.fn.modal.defaults, i.data(), "object" == typeof n && n);
            r || i.data("modal", r = new e(this, a)), "string" == typeof n ? r[n]() : a.show && r.show()
        })
    }, t.fn.modal.defaults = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    }, t.fn.modal.Constructor = e, t.fn.modal.noConflict = function() {
        return t.fn.modal = n, this
    }, t(document).on("click.modal.data-api", '[data-toggle="modal"]', function(e) {
        var n = t(this),
            i = n.attr("href"),
            r = t(n.attr("data-target") || i && i.replace(/.*(?=#[^\s]+$)/, "")),
            a = r.data("modal") ? "toggle" : t.extend({
                remote: !/#/.test(i) && i
            }, r.data(), n.data());
        e.preventDefault(), r.modal(a).one("hide", function() {
            n.focus()
        })
    })
}(window.jQuery), ! function(t) {
    "use strict";

    function e() {
        t(".dropdown-backdrop").remove(), t(i).each(function() {
            n(t(this)).removeClass("open")
        })
    }

    function n(e) {
        var n, i = e.attr("data-target");
        return i || (i = e.attr("href"), i = i && /#/.test(i) && i.replace(/.*(?=#[^\s]*$)/, "")), n = i && t(i), n && n.length || (n = e.parent()), n
    }
    var i = "[data-toggle=dropdown]",
        r = function(e) {
            var n = t(e).on("click.dropdown.data-api", this.toggle);
            t("html").on("click.dropdown.data-api", function() {
                n.parent().removeClass("open")
            })
        };
    r.prototype = {
        constructor: r,
        toggle: function() {
            var i, r, a = t(this);
            if (!a.is(".disabled, :disabled")) return i = n(a), r = i.hasClass("open"), e(), r || ("ontouchstart" in document.documentElement && t('<div class="dropdown-backdrop"/>').insertBefore(t(this)).on("click", e), i.toggleClass("open")), a.focus(), !1
        },
        keydown: function(e) {
            var r, a, o, s, u;
            if (/(38|40|27)/.test(e.keyCode) && (r = t(this), e.preventDefault(), e.stopPropagation(), !r.is(".disabled, :disabled"))) {
                if (o = n(r), s = o.hasClass("open"), !s || s && 27 == e.keyCode) return 27 == e.which && o.find(i).focus(), r.click();
                a = t("[role=menu] li:not(.divider):visible a", o), a.length && (u = a.index(a.filter(":focus")), 38 == e.keyCode && u > 0 && u--, 40 == e.keyCode && u < a.length - 1 && u++, ~u || (u = 0), a.eq(u).focus())
            }
        }
    };
    var a = t.fn.dropdown;
    t.fn.dropdown = function(e) {
        return this.each(function() {
            var n = t(this),
                i = n.data("dropdown");
            i || n.data("dropdown", i = new r(this)), "string" == typeof e && i[e].call(n)
        })
    }, t.fn.dropdown.Constructor = r, t.fn.dropdown.noConflict = function() {
        return t.fn.dropdown = a, this
    }, t(document).on("click.dropdown.data-api", e).on("click.dropdown.data-api", ".dropdown form", function(t) {
        t.stopPropagation()
    }).on("click.dropdown.data-api", i, r.prototype.toggle).on("keydown.dropdown.data-api", i + ", [role=menu]", r.prototype.keydown)
}(window.jQuery), ! function(t) {
    "use strict";

    function e(e, n) {
        var i, r = t.proxy(this.process, this),
            a = t(t(e).is("body") ? window : e);
        this.options = t.extend({}, t.fn.scrollspy.defaults, n), this.$scrollElement = a.on("scroll.scroll-spy.data-api", r), this.selector = (this.options.target || (i = t(e).attr("href")) && i.replace(/.*(?=#[^\s]+$)/, "") || "") + " .nav li > a", this.$body = t("body"), this.refresh(), this.process()
    }
    e.prototype = {
        constructor: e,
        refresh: function() {
            var e, n = this;
            this.offsets = t([]), this.targets = t([]), e = this.$body.find(this.selector).map(function() {
                var e = t(this),
                    i = e.data("target") || e.attr("href"),
                    r = /^#\w/.test(i) && t(i);
                return r && r.length && [
                    [r.position().top + (!t.isWindow(n.$scrollElement.get(0)) && n.$scrollElement.scrollTop()), i]
                ] || null
            }).sort(function(t, e) {
                return t[0] - e[0]
            }).each(function() {
                n.offsets.push(this[0]), n.targets.push(this[1])
            })
        },
        process: function() {
            var t, e = this.$scrollElement.scrollTop() + this.options.offset,
                n = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight,
                i = n - this.$scrollElement.height(),
                r = this.offsets,
                a = this.targets,
                o = this.activeTarget;
            if (e >= i) return o != (t = a.last()[0]) && this.activate(t);
            for (t = r.length; t--;) o != a[t] && e >= r[t] && (!r[t + 1] || e <= r[t + 1]) && this.activate(a[t])
        },
        activate: function(e) {
            var n, i;
            this.activeTarget = e, t(this.selector).parent(".active").removeClass("active"), i = this.selector + '[data-target="' + e + '"],' + this.selector + '[href="' + e + '"]', n = t(i).parent("li").addClass("active"), n.parent(".dropdown-menu").length && (n = n.closest("li.dropdown").addClass("active")), n.trigger("activate")
        }
    };
    var n = t.fn.scrollspy;
    t.fn.scrollspy = function(n) {
        return this.each(function() {
            var i = t(this),
                r = i.data("scrollspy"),
                a = "object" == typeof n && n;
            r || i.data("scrollspy", r = new e(this, a)), "string" == typeof n && r[n]()
        })
    }, t.fn.scrollspy.Constructor = e, t.fn.scrollspy.defaults = {
        offset: 10
    }, t.fn.scrollspy.noConflict = function() {
        return t.fn.scrollspy = n, this
    }, t(window).on("load", function() {
        t('[data-spy="scroll"]').each(function() {
            var e = t(this);
            e.scrollspy(e.data())
        })
    })
}(window.jQuery), ! function(t) {
    "use strict";
    var e = function(e) {
        this.element = t(e)
    };
    e.prototype = {
        constructor: e,
        show: function() {
            var e, n, i, r = this.element,
                a = r.closest("ul:not(.dropdown-menu)"),
                o = r.attr("data-target");
            o || (o = r.attr("href"), o = o && o.replace(/.*(?=#[^\s]*$)/, "")), r.parent("li").hasClass("active") || (e = a.find(".active:last a")[0], i = t.Event("show", {
                relatedTarget: e
            }), r.trigger(i), i.isDefaultPrevented() || (n = t(o), this.activate(r.parent("li"), a), this.activate(n, n.parent(), function() {
                r.trigger({
                    type: "shown",
                    relatedTarget: e
                })
            })))
        },
        activate: function(e, n, i) {
            function r() {
                a.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"), e.addClass("active"), o ? (e[0].offsetWidth, e.addClass("in")) : e.removeClass("fade"), e.parent(".dropdown-menu") && e.closest("li.dropdown").addClass("active"), i && i()
            }
            var a = n.find("> .active"),
                o = i && t.support.transition && a.hasClass("fade");
            o ? a.one(t.support.transition.end, r) : r(), a.removeClass("in")
        }
    };
    var n = t.fn.tab;
    t.fn.tab = function(n) {
        return this.each(function() {
            var i = t(this),
                r = i.data("tab");
            r || i.data("tab", r = new e(this)), "string" == typeof n && r[n]()
        })
    }, t.fn.tab.Constructor = e, t.fn.tab.noConflict = function() {
        return t.fn.tab = n, this
    }, t(document).on("click.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function(e) {
        e.preventDefault(), t(this).tab("show")
    })
}(window.jQuery), ! function(t) {
    "use strict";
    var e = function(t, e) {
        this.init("tooltip", t, e)
    };
    e.prototype = {
        constructor: e,
        init: function(e, n, i) {
            var r, a, o, s, u;
            for (this.type = e, this.$element = t(n), this.options = this.getOptions(i), this.enabled = !0, o = this.options.trigger.split(" "), u = o.length; u--;) s = o[u], "click" == s ? this.$element.on("click." + this.type, this.options.selector, t.proxy(this.toggle, this)) : "manual" != s && (r = "hover" == s ? "mouseenter" : "focus", a = "hover" == s ? "mouseleave" : "blur", this.$element.on(r + "." + this.type, this.options.selector, t.proxy(this.enter, this)), this.$element.on(a + "." + this.type, this.options.selector, t.proxy(this.leave, this)));
            this.options.selector ? this._options = t.extend({}, this.options, {
                trigger: "manual",
                selector: ""
            }) : this.fixTitle()
        },
        getOptions: function(e) {
            return e = t.extend({}, t.fn[this.type].defaults, this.$element.data(), e), e.delay && "number" == typeof e.delay && (e.delay = {
                show: e.delay,
                hide: e.delay
            }), e
        },
        enter: function(e) {
            var n, i = t.fn[this.type].defaults,
                r = {};
            return this._options && t.each(this._options, function(t, e) {
                i[t] != e && (r[t] = e)
            }, this), n = t(e.currentTarget)[this.type](r).data(this.type), n.options.delay && n.options.delay.show ? (clearTimeout(this.timeout), n.hoverState = "in", void(this.timeout = setTimeout(function() {
                "in" == n.hoverState && n.show()
            }, n.options.delay.show))) : n.show()
        },
        leave: function(e) {
            var n = t(e.currentTarget)[this.type](this._options).data(this.type);
            return this.timeout && clearTimeout(this.timeout), n.options.delay && n.options.delay.hide ? (n.hoverState = "out", void(this.timeout = setTimeout(function() {
                "out" == n.hoverState && n.hide()
            }, n.options.delay.hide))) : n.hide()
        },
        show: function() {
            var e, n, i, r, a, o, s = t.Event("show");
            if (this.hasContent() && this.enabled) {
                if (this.$element.trigger(s), s.isDefaultPrevented()) return;
                switch (e = this.tip(), this.setContent(), this.options.animation && e.addClass("fade"), a = "function" == typeof this.options.placement ? this.options.placement.call(this, e[0], this.$element[0]) : this.options.placement, e.detach().css({
                    top: 0,
                    left: 0,
                    display: "block"
                }), this.options.container ? e.appendTo(this.options.container) : e.insertAfter(this.$element), n = this.getPosition(), i = e[0].offsetWidth, r = e[0].offsetHeight, a) {
                    case "bottom":
                        o = {
                            top: n.top + n.height,
                            left: n.left + n.width / 2 - i / 2
                        };
                        break;
                    case "top":
                        o = {
                            top: n.top - r,
                            left: n.left + n.width / 2 - i / 2
                        };
                        break;
                    case "left":
                        o = {
                            top: n.top + n.height / 2 - r / 2,
                            left: n.left - i
                        };
                        break;
                    case "right":
                        o = {
                            top: n.top + n.height / 2 - r / 2,
                            left: n.left + n.width
                        }
                }
                this.applyPlacement(o, a), this.$element.trigger("shown")
            }
        },
        applyPlacement: function(t, e) {
            var n, i, r, a, o = this.tip(),
                s = o[0].offsetWidth,
                u = o[0].offsetHeight;
            o.offset(t).addClass(e).addClass("in"), n = o[0].offsetWidth, i = o[0].offsetHeight, "top" == e && i != u && (t.top = t.top + u - i, a = !0), "bottom" == e || "top" == e ? (r = 0, t.left < 0 && (r = -2 * t.left, t.left = 0, o.offset(t), n = o[0].offsetWidth, i = o[0].offsetHeight), this.replaceArrow(r - s + n, n, "left")) : this.replaceArrow(i - u, i, "top"), a && o.offset(t)
        },
        replaceArrow: function(t, e, n) {
            this.arrow().css(n, t ? 50 * (1 - t / e) + "%" : "")
        },
        setContent: function() {
            var t = this.tip(),
                e = this.getTitle();
            t.find(".tooltip-inner")[this.options.html ? "html" : "text"](e), t.removeClass("fade in top bottom left right")
        },
        hide: function() {
            function e() {
                var e = setTimeout(function() {
                    n.off(t.support.transition.end).detach()
                }, 500);
                n.one(t.support.transition.end, function() {
                    clearTimeout(e), n.detach()
                })
            }
            var n = this.tip(),
                i = t.Event("hide");
            return this.$element.trigger(i), i.isDefaultPrevented() ? void 0 : (n.removeClass("in"), t.support.transition && this.$tip.hasClass("fade") ? e() : n.detach(), this.$element.trigger("hidden"), this)
        },
        fixTitle: function() {
            var t = this.$element;
            (t.attr("title") || "string" != typeof t.attr("data-original-title")) && t.attr("data-original-title", t.attr("title") || "").attr("title", "")
        },
        hasContent: function() {
            return this.getTitle()
        },
        getPosition: function() {
            var e = this.$element[0];
            return t.extend({}, "function" == typeof e.getBoundingClientRect ? e.getBoundingClientRect() : {
                width: e.offsetWidth,
                height: e.offsetHeight
            }, this.$element.offset())
        },
        getTitle: function() {
            var t, e = this.$element,
                n = this.options;
            return t = e.attr("data-original-title") || ("function" == typeof n.title ? n.title.call(e[0]) : n.title)
        },
        tip: function() {
            return this.$tip = this.$tip || t(this.options.template)
        },
        arrow: function() {
            return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
        },
        validate: function() {
            this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)
        },
        enable: function() {
            this.enabled = !0
        },
        disable: function() {
            this.enabled = !1
        },
        toggleEnabled: function() {
            this.enabled = !this.enabled
        },
        toggle: function(e) {
            var n = e ? t(e.currentTarget)[this.type](this._options).data(this.type) : this;
            n.tip().hasClass("in") ? n.hide() : n.show()
        },
        destroy: function() {
            this.hide().$element.off("." + this.type).removeData(this.type)
        }
    };
    var n = t.fn.tooltip;
    t.fn.tooltip = function(n) {
        return this.each(function() {
            var i = t(this),
                r = i.data("tooltip"),
                a = "object" == typeof n && n;
            r || i.data("tooltip", r = new e(this, a)), "string" == typeof n && r[n]()
        })
    }, t.fn.tooltip.Constructor = e, t.fn.tooltip.defaults = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1
    }, t.fn.tooltip.noConflict = function() {
        return t.fn.tooltip = n, this
    }
}(window.jQuery), ! function(t) {
    "use strict";
    var e = function(t, e) {
        this.init("popover", t, e)
    };
    e.prototype = t.extend({}, t.fn.tooltip.Constructor.prototype, {
        constructor: e,
        setContent: function() {
            var t = this.tip(),
                e = this.getTitle(),
                n = this.getContent();
            t.find(".popover-title")[this.options.html ? "html" : "text"](e), t.find(".popover-content")[this.options.html ? "html" : "text"](n), t.removeClass("fade top bottom left right in")
        },
        hasContent: function() {
            return this.getTitle() || this.getContent()
        },
        getContent: function() {
            var t, e = this.$element,
                n = this.options;
            return t = ("function" == typeof n.content ? n.content.call(e[0]) : n.content) || e.attr("data-content")
        },
        tip: function() {
            return this.$tip || (this.$tip = t(this.options.template)), this.$tip
        },
        destroy: function() {
            this.hide().$element.off("." + this.type).removeData(this.type)
        }
    });
    var n = t.fn.popover;
    t.fn.popover = function(n) {
        return this.each(function() {
            var i = t(this),
                r = i.data("popover"),
                a = "object" == typeof n && n;
            r || i.data("popover", r = new e(this, a)), "string" == typeof n && r[n]()
        })
    }, t.fn.popover.Constructor = e, t.fn.popover.defaults = t.extend({}, t.fn.tooltip.defaults, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }), t.fn.popover.noConflict = function() {
        return t.fn.popover = n, this
    }
}(window.jQuery), ! function(t) {
    "use strict";
    var e = function(e, n) {
        this.$element = t(e), this.options = t.extend({}, t.fn.button.defaults, n)
    };
    e.prototype.setState = function(t) {
        var e = "disabled",
            n = this.$element,
            i = n.data(),
            r = n.is("input") ? "val" : "html";
        t += "Text", i.resetText || n.data("resetText", n[r]()), n[r](i[t] || this.options[t]), setTimeout(function() {
            "loadingText" == t ? n.addClass(e).attr(e, e) : n.removeClass(e).removeAttr(e)
        }, 0)
    }, e.prototype.toggle = function() {
        var t = this.$element.closest('[data-toggle="buttons-radio"]');
        t && t.find(".active").removeClass("active"), this.$element.toggleClass("active")
    };
    var n = t.fn.button;
    t.fn.button = function(n) {
        return this.each(function() {
            var i = t(this),
                r = i.data("button"),
                a = "object" == typeof n && n;
            r || i.data("button", r = new e(this, a)), "toggle" == n ? r.toggle() : n && r.setState(n)
        })
    }, t.fn.button.defaults = {
        loadingText: "loading..."
    }, t.fn.button.Constructor = e, t.fn.button.noConflict = function() {
        return t.fn.button = n, this
    }, t(document).on("click.button.data-api", "[data-toggle^=button]", function(e) {
        var n = t(e.target);
        n.hasClass("btn") || (n = n.closest(".btn")), n.button("toggle")
    })
}(window.jQuery), ! function(t) {
    "use strict";
    var e = function(e, n) {
        this.$element = t(e), this.options = t.extend({}, t.fn.collapse.defaults, n), this.options.parent && (this.$parent = t(this.options.parent)), this.options.toggle && this.toggle()
    };
    e.prototype = {
        constructor: e,
        dimension: function() {
            var t = this.$element.hasClass("width");
            return t ? "width" : "height"
        },
        show: function() {
            var e, n, i, r;
            if (!this.transitioning && !this.$element.hasClass("in")) {
                if (e = this.dimension(), n = t.camelCase(["scroll", e].join("-")), i = this.$parent && this.$parent.find("> .accordion-group > .in"), i && i.length) {
                    if (r = i.data("collapse"), r && r.transitioning) return;
                    i.collapse("hide"), r || i.data("collapse", null)
                }
                this.$element[e](0), this.transition("addClass", t.Event("show"), "shown"), t.support.transition && this.$element[e](this.$element[0][n])
            }
        },
        hide: function() {
            var e;
            !this.transitioning && this.$element.hasClass("in") && (e = this.dimension(), this.reset(this.$element[e]()), this.transition("removeClass", t.Event("hide"), "hidden"), this.$element[e](0))
        },
        reset: function(t) {
            var e = this.dimension();
            return this.$element.removeClass("collapse")[e](t || "auto")[0].offsetWidth, this.$element[null !== t ? "addClass" : "removeClass"]("collapse"), this
        },
        transition: function(e, n, i) {
            var r = this,
                a = function() {
                    "show" == n.type && r.reset(), r.transitioning = 0, r.$element.trigger(i)
                };
            this.$element.trigger(n), n.isDefaultPrevented() || (this.transitioning = 1, this.$element[e]("in"), t.support.transition && this.$element.hasClass("collapse") ? this.$element.one(t.support.transition.end, a) : a())
        },
        toggle: function() {
            this[this.$element.hasClass("in") ? "hide" : "show"]()
        }
    };
    var n = t.fn.collapse;
    t.fn.collapse = function(n) {
        return this.each(function() {
            var i = t(this),
                r = i.data("collapse"),
                a = t.extend({}, t.fn.collapse.defaults, i.data(), "object" == typeof n && n);
            r || i.data("collapse", r = new e(this, a)), "string" == typeof n && r[n]()
        })
    }, t.fn.collapse.defaults = {
        toggle: !0
    }, t.fn.collapse.Constructor = e, t.fn.collapse.noConflict = function() {
        return t.fn.collapse = n, this
    }, t(document).on("click.collapse.data-api", "[data-toggle=collapse]", function(e) {
        var n, i = t(this),
            r = i.attr("data-target") || e.preventDefault() || (n = i.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, ""),
            a = t(r).data("collapse") ? "toggle" : i.data();
        i[t(r).hasClass("in") ? "addClass" : "removeClass"]("collapsed"), t(r).collapse(a)
    })
}(window.jQuery), ! function(t) {
    "use strict";
    var e = function(e, n) {
        this.$element = t(e), this.$indicators = this.$element.find(".carousel-indicators"), this.options = n, "hover" == this.options.pause && this.$element.on("mouseenter", t.proxy(this.pause, this)).on("mouseleave", t.proxy(this.cycle, this))
    };
    e.prototype = {
        cycle: function(e) {
            return e || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(t.proxy(this.next, this), this.options.interval)), this
        },
        getActiveIndex: function() {
            return this.$active = this.$element.find(".item.active"), this.$items = this.$active.parent().children(), this.$items.index(this.$active)
        },
        to: function(e) {
            var n = this.getActiveIndex(),
                i = this;
            if (!(e > this.$items.length - 1 || 0 > e)) return this.sliding ? this.$element.one("slid", function() {
                i.to(e)
            }) : n == e ? this.pause().cycle() : this.slide(e > n ? "next" : "prev", t(this.$items[e]))
        },
        pause: function(e) {
            return e || (this.paused = !0), this.$element.find(".next, .prev").length && t.support.transition.end && (this.$element.trigger(t.support.transition.end), this.cycle(!0)), clearInterval(this.interval), this.interval = null, this
        },
        next: function() {
            return this.sliding ? void 0 : this.slide("next")
        },
        prev: function() {
            return this.sliding ? void 0 : this.slide("prev")
        },
        slide: function(e, n) {
            var i, r = this.$element.find(".item.active"),
                a = n || r[e](),
                o = this.interval,
                s = "next" == e ? "left" : "right",
                u = "next" == e ? "first" : "last",
                l = this;
            if (this.sliding = !0, o && this.pause(), a = a.length ? a : this.$element.find(".item")[u](), i = t.Event("slide", {
                    relatedTarget: a[0],
                    direction: s
                }), !a.hasClass("active")) {
                if (this.$indicators.length && (this.$indicators.find(".active").removeClass("active"), this.$element.one("slid", function() {
                        var e = t(l.$indicators.children()[l.getActiveIndex()]);
                        e && e.addClass("active")
                    })), t.support.transition && this.$element.hasClass("slide")) {
                    if (this.$element.trigger(i), i.isDefaultPrevented()) return;
                    a.addClass(e), a[0].offsetWidth, r.addClass(s), a.addClass(s), this.$element.one(t.support.transition.end, function() {
                        a.removeClass([e, s].join(" ")).addClass("active"), r.removeClass(["active", s].join(" ")), l.sliding = !1, setTimeout(function() {
                            l.$element.trigger("slid")
                        }, 0)
                    })
                } else {
                    if (this.$element.trigger(i), i.isDefaultPrevented()) return;
                    r.removeClass("active"), a.addClass("active"), this.sliding = !1, this.$element.trigger("slid")
                }
                return o && this.cycle(), this
            }
        }
    };
    var n = t.fn.carousel;
    t.fn.carousel = function(n) {
        return this.each(function() {
            var i = t(this),
                r = i.data("carousel"),
                a = t.extend({}, t.fn.carousel.defaults, "object" == typeof n && n),
                o = "string" == typeof n ? n : a.slide;
            r || i.data("carousel", r = new e(this, a)), "number" == typeof n ? r.to(n) : o ? r[o]() : a.interval && r.pause().cycle()
        })
    }, t.fn.carousel.defaults = {
        interval: 5e3,
        pause: "hover"
    }, t.fn.carousel.Constructor = e, t.fn.carousel.noConflict = function() {
        return t.fn.carousel = n, this
    }, t(document).on("click.carousel.data-api", "[data-slide], [data-slide-to]", function(e) {
        var n, i, r = t(this),
            a = t(r.attr("data-target") || (n = r.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, "")),
            o = t.extend({}, a.data(), r.data());
        a.carousel(o), (i = r.attr("data-slide-to")) && a.data("carousel").pause().to(i).cycle(), e.preventDefault()
    })
}(window.jQuery), ! function(t) {
    "use strict";
    var e = function(e, n) {
        this.$element = t(e), this.options = t.extend({}, t.fn.typeahead.defaults, n), this.matcher = this.options.matcher || this.matcher, this.sorter = this.options.sorter || this.sorter, this.highlighter = this.options.highlighter || this.highlighter, this.updater = this.options.updater || this.updater, this.source = this.options.source, this.$menu = t(this.options.menu), this.shown = !1, this.listen()
    };
    e.prototype = {
        constructor: e,
        select: function() {
            var t = this.$menu.find(".active").attr("data-value");
            return this.$element.val(this.updater(t)).change(), this.hide()
        },
        updater: function(t) {
            return t
        },
        show: function() {
            var e = t.extend({}, this.$element.position(), {
                height: this.$element[0].offsetHeight
            });
            return this.$menu.insertAfter(this.$element).css({
                top: e.top + e.height,
                left: e.left
            }).show(), this.shown = !0, this
        },
        hide: function() {
            return this.$menu.hide(), this.shown = !1, this
        },
        lookup: function() {
            var e;
            return this.query = this.$element.val(), !this.query || this.query.length < this.options.minLength ? this.shown ? this.hide() : this : (e = t.isFunction(this.source) ? this.source(this.query, t.proxy(this.process, this)) : this.source, e ? this.process(e) : this)
        },
        process: function(e) {
            var n = this;
            return e = t.grep(e, function(t) {
                return n.matcher(t)
            }), e = this.sorter(e), e.length ? this.render(e.slice(0, this.options.items)).show() : this.shown ? this.hide() : this
        },
        matcher: function(t) {
            return ~t.toLowerCase().indexOf(this.query.toLowerCase())
        },
        sorter: function(t) {
            for (var e, n = [], i = [], r = []; e = t.shift();) e.toLowerCase().indexOf(this.query.toLowerCase()) ? ~e.indexOf(this.query) ? i.push(e) : r.push(e) : n.push(e);
            return n.concat(i, r)
        },
        highlighter: function(t) {
            var e = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            return t.replace(new RegExp("(" + e + ")", "ig"), function(t, e) {
                return "<strong>" + e + "</strong>"
            })
        },
        render: function(e) {
            var n = this;
            return e = t(e).map(function(e, i) {
                return e = t(n.options.item).attr("data-value", i), e.find("a").html(n.highlighter(i)), e[0]
            }), e.first().addClass("active"), this.$menu.html(e), this
        },
        next: function() {
            var e = this.$menu.find(".active").removeClass("active"),
                n = e.next();
            n.length || (n = t(this.$menu.find("li")[0])), n.addClass("active")
        },
        prev: function() {
            var t = this.$menu.find(".active").removeClass("active"),
                e = t.prev();
            e.length || (e = this.$menu.find("li").last()), e.addClass("active")
        },
        listen: function() {
            this.$element.on("focus", t.proxy(this.focus, this)).on("blur", t.proxy(this.blur, this)).on("keypress", t.proxy(this.keypress, this)).on("keyup", t.proxy(this.keyup, this)), this.eventSupported("keydown") && this.$element.on("keydown", t.proxy(this.keydown, this)), this.$menu.on("click", t.proxy(this.click, this)).on("mouseenter", "li", t.proxy(this.mouseenter, this)).on("mouseleave", "li", t.proxy(this.mouseleave, this))
        },
        eventSupported: function(t) {
            var e = t in this.$element;
            return e || (this.$element.setAttribute(t, "return;"), e = "function" == typeof this.$element[t]), e
        },
        move: function(t) {
            if (this.shown) {
                switch (t.keyCode) {
                    case 9:
                    case 13:
                    case 27:
                        t.preventDefault();
                        break;
                    case 38:
                        t.preventDefault(), this.prev();
                        break;
                    case 40:
                        t.preventDefault(), this.next()
                }
                t.stopPropagation()
            }
        },
        keydown: function(e) {
            this.suppressKeyPressRepeat = ~t.inArray(e.keyCode, [40, 38, 9, 13, 27]), this.move(e)
        },
        keypress: function(t) {
            this.suppressKeyPressRepeat || this.move(t)
        },
        keyup: function(t) {
            switch (t.keyCode) {
                case 40:
                case 38:
                case 16:
                case 17:
                case 18:
                    break;
                case 9:
                case 13:
                    if (!this.shown) return;
                    this.select();
                    break;
                case 27:
                    if (!this.shown) return;
                    this.hide();
                    break;
                default:
                    this.lookup()
            }
            t.stopPropagation(), t.preventDefault()
        },
        focus: function() {
            this.focused = !0
        },
        blur: function() {
            this.focused = !1, !this.mousedover && this.shown && this.hide()
        },
        click: function(t) {
            t.stopPropagation(), t.preventDefault(), this.select(), this.$element.focus()
        },
        mouseenter: function(e) {
            this.mousedover = !0, this.$menu.find(".active").removeClass("active"), t(e.currentTarget).addClass("active")
        },
        mouseleave: function() {
            this.mousedover = !1, !this.focused && this.shown && this.hide()
        }
    };
    var n = t.fn.typeahead;
    t.fn.typeahead = function(n) {
        return this.each(function() {
            var i = t(this),
                r = i.data("typeahead"),
                a = "object" == typeof n && n;
            r || i.data("typeahead", r = new e(this, a)), "string" == typeof n && r[n]()
        })
    }, t.fn.typeahead.defaults = {
        source: [],
        items: 8,
        menu: '<ul class="typeahead dropdown-menu"></ul>',
        item: '<li><a href="#"></a></li>',
        minLength: 1
    }, t.fn.typeahead.Constructor = e, t.fn.typeahead.noConflict = function() {
        return t.fn.typeahead = n, this
    }, t(document).on("focus.typeahead.data-api", '[data-provide="typeahead"]', function() {
        var e = t(this);
        e.data("typeahead") || e.typeahead(e.data())
    })
}(window.jQuery), ! function(t) {
    "use strict";
    var e = function(e, n) {
        this.options = t.extend({}, t.fn.affix.defaults, n), this.$window = t(window).on("scroll.affix.data-api", t.proxy(this.checkPosition, this)).on("click.affix.data-api", t.proxy(function() {
            setTimeout(t.proxy(this.checkPosition, this), 1)
        }, this)), this.$element = t(e), this.checkPosition()
    };
    e.prototype.checkPosition = function() {
        if (this.$element.is(":visible")) {
            var e, n = t(document).height(),
                i = this.$window.scrollTop(),
                r = this.$element.offset(),
                a = this.options.offset,
                o = a.bottom,
                s = a.top,
                u = "affix affix-top affix-bottom";
            "object" != typeof a && (o = s = a), "function" == typeof s && (s = a.top()), "function" == typeof o && (o = a.bottom()), e = null != this.unpin && i + this.unpin <= r.top ? !1 : null != o && r.top + this.$element.height() >= n - o ? "bottom" : null != s && s >= i ? "top" : !1, this.affixed !== e && (this.affixed = e, this.unpin = "bottom" == e ? r.top - i : null, this.$element.removeClass(u).addClass("affix" + (e ? "-" + e : "")))
        }
    };
    var n = t.fn.affix;
    t.fn.affix = function(n) {
        return this.each(function() {
            var i = t(this),
                r = i.data("affix"),
                a = "object" == typeof n && n;
            r || i.data("affix", r = new e(this, a)), "string" == typeof n && r[n]()
        })
    }, t.fn.affix.Constructor = e, t.fn.affix.defaults = {
        offset: 0
    }, t.fn.affix.noConflict = function() {
        return t.fn.affix = n, this
    }, t(window).on("load", function() {
        t('[data-spy="affix"]').each(function() {
            var e = t(this),
                n = e.data();
            n.offset = n.offset || {}, n.offsetBottom && (n.offset.bottom = n.offsetBottom), n.offsetTop && (n.offset.top = n.offsetTop), e.affix(n)
        })
    })
}(window.jQuery),
function() {
    var t, e, n, i, r, a, o = {}.hasOwnProperty;
    a = "undefined" != typeof exports && null !== exports ? exports : this, e = function(t) {
        this.message = t
    }, e.prototype = new Error, r = {
        prefix: "",
        default_url_options: {}
    }, t = {
        GROUP: 1,
        CAT: 2,
        SYMBOL: 3,
        OR: 4,
        STAR: 5,
        LITERAL: 6,
        SLASH: 7,
        DOT: 8
    }, n = {
        serialize: function(t, e) {
            var n, i, r, s, u, l, c, d;
            if (null == e && (e = null), !t) return "";
            if (!e && "object" !== this.get_object_type(t)) throw new Error("Url parameters should be a javascript hash");
            if (a.jQuery) return u = a.jQuery.param(t), u ? u : "";
            switch (l = [], this.get_object_type(t)) {
                case "array":
                    for (i = c = 0, d = t.length; d > c; i = ++c) n = t[i], l.push(this.serialize(n, e + "[]"));
                    break;
                case "object":
                    for (r in t) o.call(t, r) && (s = t[r], null != s && (null != e && (r = "" + e + "[" + r + "]"), l.push(this.serialize(s, r))));
                    break;
                default:
                    t && l.push("" + encodeURIComponent(e.toString()) + "=" + encodeURIComponent(t.toString()))
            }
            return l.length ? l.join("&") : ""
        },
        clean_path: function(t) {
            var e;
            return t = t.split("://"), e = t.length - 1, t[e] = t[e].replace(/\/+/g, "/"), t.join("://")
        },
        set_default_url_options: function(t, e) {
            var n, i, a, o, s;
            for (s = [], n = a = 0, o = t.length; o > a; n = ++a) i = t[n], !e.hasOwnProperty(i) && r.default_url_options.hasOwnProperty(i) && s.push(e[i] = r.default_url_options[i]);
            return s
        },
        extract_anchor: function(t) {
            var e;
            return e = "", t.hasOwnProperty("anchor") && (e = "#" + t.anchor, delete t.anchor), e
        },
        extract_trailing_slash: function(t) {
            var e;
            return e = !1, r.default_url_options.hasOwnProperty("trailing_slash") && (e = r.default_url_options.trailing_slash), t.hasOwnProperty("trailing_slash") && (e = t.trailing_slash, delete t.trailing_slash), e
        },
        extract_options: function(t, e) {
            var n;
            return n = e[e.length - 1], e.length > t || null != n && "object" === this.get_object_type(n) && !this.look_like_serialized_model(n) ? e.pop() : {}
        },
        look_like_serialized_model: function(t) {
            return "id" in t || "to_param" in t
        },
        path_identifier: function(t) {
            var e;
            return 0 === t ? "0" : t ? (e = t, "object" === this.get_object_type(t) && (e = "to_param" in t ? t.to_param : "id" in t ? t.id : t, "function" === this.get_object_type(e) && (e = e.call(t))), e.toString()) : ""
        },
        clone: function(t) {
            var e, n, i;
            if (null == t || "object" !== this.get_object_type(t)) return t;
            n = t.constructor();
            for (i in t) o.call(t, i) && (e = t[i], n[i] = e);
            return n
        },
        prepare_parameters: function(t, e, n) {
            var i, r, a, o, s;
            for (r = this.clone(n) || {}, i = o = 0, s = t.length; s > o; i = ++o) a = t[i], i < e.length && (r[a] = e[i]);
            return r
        },
        build_path: function(t, e, i, r) {
            var a, o, s, u, l, c, d;
            if (r = Array.prototype.slice.call(r), o = this.extract_options(t.length, r), r.length > t.length) throw new Error("Too many parameters provided for path");
            return s = this.prepare_parameters(t, r, o), this.set_default_url_options(e, s), a = this.extract_anchor(s), l = this.extract_trailing_slash(s), u = "" + this.get_prefix() + this.visit(i, s), c = n.clean_path("" + u), l === !0 && (c = c.replace(/(.*?)[\/]?$/, "$1/")), (d = this.serialize(s)).length && (c += "?" + d), c += a
        },
        visit: function(n, i, r) {
            var a, o, s, u, l, c;
            switch (null == r && (r = !1), l = n[0], a = n[1], s = n[2], l) {
                case t.GROUP:
                    return this.visit(a, i, !0);
                case t.STAR:
                    return this.visit_globbing(a, i, !0);
                case t.LITERAL:
                case t.SLASH:
                case t.DOT:
                    return a;
                case t.CAT:
                    return o = this.visit(a, i, r), u = this.visit(s, i, r), !r || o && u ? "" + o + u : "";
                case t.SYMBOL:
                    if (c = i[a], null != c) return delete i[a], this.path_identifier(c);
                    if (r) return "";
                    throw new e("Route parameter missing: " + a);
                default:
                    throw new Error("Unknown Rails node type")
            }
        },
        build_path_spec: function(e, n) {
            var i, r, a;
            switch (null == n && (n = !1), a = e[0], i = e[1], r = e[2], a) {
                case t.GROUP:
                    return "(" + this.build_path_spec(i) + ")";
                case t.CAT:
                    return "" + this.build_path_spec(i) + this.build_path_spec(r);
                case t.STAR:
                    return this.build_path_spec(i, !0);
                case t.SYMBOL:
                    return n === !0 ? "" + ("*" === i[0] ? "" : "*") + i : ":" + i;
                case t.SLASH:
                case t.DOT:
                case t.LITERAL:
                    return i;
                default:
                    throw new Error("Unknown Rails node type")
            }
        },
        visit_globbing: function(t, e, n) {
            var i, r, a, o;
            return a = t[0], i = t[1], r = t[2], i.replace(/^\*/i, "") !== i && (t[1] = i = i.replace(/^\*/i, "")), o = e[i], null == o ? this.visit(t, e, n) : (e[i] = function() {
                switch (this.get_object_type(o)) {
                    case "array":
                        return o.join("/");
                    default:
                        return o
                }
            }.call(this), this.visit(t, e, n))
        },
        get_prefix: function() {
            var t;
            return t = r.prefix, "" !== t && (t = t.match("/$") ? t : "" + t + "/"), t
        },
        route: function(t, e, i) {
            var r;
            return r = function() {
                return n.build_path(t, e, i, arguments)
            }, r.required_params = t, r.toString = function() {
                return n.build_path_spec(i)
            }, r
        },
        _classToTypeCache: null,
        _classToType: function() {
            var t, e, n, i;
            if (null != this._classToTypeCache) return this._classToTypeCache;
            for (this._classToTypeCache = {}, i = "Boolean Number String Function Array Date RegExp Object Error".split(" "), e = 0, n = i.length; n > e; e++) t = i[e], this._classToTypeCache["[object " + t + "]"] = t.toLowerCase();
            return this._classToTypeCache
        },
        get_object_type: function(t) {
            return a.jQuery && null != a.jQuery.type ? a.jQuery.type(t) : null == t ? "" + t : "object" == typeof t || "function" == typeof t ? this._classToType()[Object.prototype.toString.call(t)] || "object" : typeof t
        }
    }, i = function() {
        var t;
        return t = function(e, n) {
            var i, r;
            return r = n ? n.split(".") : [], r.length ? (i = r.shift(), e[i] = e[i] || {}, t(e[i], r.join("."))) : void 0
        }, t(a, "Routes"), a.Routes = {
            accept_account_promo_code_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "promo_codes", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "accept", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            accept_admin_users_list_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users_lists", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "accept", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            account_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            account_lecture_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            account_lectures_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            account_order_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "orders", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            account_order_options_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "order_options", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            account_password_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "password", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            account_shirt_orders_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "shirt_orders", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            account_shop_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "shop", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            activate_account_tickets_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "tickets", !1],
                            [2, [7, "/", !1],
                                [2, [6, "activate", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            activate_admin_ticket_code_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "ticket_codes", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "activate", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            activate_code_admin_user_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "activate_code", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            activate_user_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "user", !1],
                    [2, [7, "/", !1],
                        [2, [6, "activate", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            activation_account_tickets_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "tickets", !1],
                            [2, [7, "/", !1],
                                [2, [6, "activation", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_afterparty_ticket_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "afterparty_tickets", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_afterparty_tickets_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "afterparty_tickets", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_audits_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "audits", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_campaign_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "campaigns", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_campaigns_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "campaigns", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_coupon_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "coupons", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_coupons_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "coupons", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_distributor_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "distributors", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_distributors_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "distributors", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_event_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "events", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_event_break_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "event_breaks", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_event_breaks_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "event_breaks", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_events_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "events", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_hall_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "halls", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_halls_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "halls", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_lecture_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_lectures_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_mailers_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "mailers", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_news_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "news", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_news_index_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "news", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_order_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "orders", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_orders_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "orders", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_page_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "pages", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_pages_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "pages", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_report_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "reports", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_reports_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "reports", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_resque_path: n.route([], [], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [6, "resque", !1]
                    ]
                ]
            ], arguments),
            admin_root_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            admin_ticket_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "tickets", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_ticket_code_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "ticket_codes", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_ticket_codes_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "ticket_codes", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_tickets_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "tickets", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_topic_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "topics", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_topics_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "topics", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_user_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_users_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_users_list_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users_lists", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_users_lists_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users_lists", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            admin_workshop_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "workshops", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            admin_workshops_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "workshops", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            api_cities_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "cities", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            api_city_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "cities", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            api_companies_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "companies", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            api_company_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "companies", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            api_event_event_votings_path: n.route(["event_id"], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "events", !1],
                            [2, [7, "/", !1],
                                [2, [3, "event_id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "event_votings", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            api_events_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "events", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            api_lecture_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            api_lecture_feedbacks_path: n.route(["lecture_id"], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [2, [7, "/", !1],
                                [2, [3, "lecture_id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "feedbacks", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            api_lecture_lecture_votings_path: n.route(["lecture_id"], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [2, [7, "/", !1],
                                [2, [3, "lecture_id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "lecture_votings", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            api_lecture_listener_votings_path: n.route(["lecture_id"], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [2, [7, "/", !1],
                                [2, [3, "lecture_id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "listener_votings", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            api_lectures_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            approve_account_orders_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "orders", !1],
                            [2, [7, "/", !1],
                                [2, [6, "approve", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            audits_index_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "audits", !1],
                    [2, [7, "/", !1],
                        [2, [6, "index", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            auth_failure_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "auth", !1],
                    [2, [7, "/", !1],
                        [2, [6, "failure", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            authorization_social_networks_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "social_networks", !1],
                    [2, [7, "/", !1],
                        [2, [6, "authorization", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            banned_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "banned", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            broadcast_admin_mailers_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "mailers", !1],
                            [2, [7, "/", !1],
                                [2, [6, "broadcast", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            broadcast_to_admins_admin_mailers_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "mailers", !1],
                            [2, [7, "/", !1],
                                [2, [6, "broadcast_to_admins", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            broadcast_to_not_attended_admin_mailers_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "mailers", !1],
                            [2, [7, "/", !1],
                                [2, [6, "broadcast_to_not_attended", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            buy_now_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "buy_now", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            cancel_account_orders_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "orders", !1],
                            [2, [7, "/", !1],
                                [2, [6, "cancel", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            cancel_ticket_admin_user_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "cancel_ticket", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            ckeditor_pictures_path: n.route([], ["format"], [2, [2, [2, [7, "/", !1],
                        [6, "ckeditor", !1]
                    ],
                    [7, "/", !1]
                ],
                [2, [6, "pictures", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            ckeditor_picture_path: n.route(["id"], ["format"], [2, [2, [2, [7, "/", !1],
                        [6, "ckeditor", !1]
                    ],
                    [7, "/", !1]
                ],
                [2, [6, "pictures", !1],
                    [2, [7, "/", !1],
                        [2, [3, "id", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            ckeditor_attachment_files_path: n.route([], ["format"], [2, [2, [2, [7, "/", !1],
                        [6, "ckeditor", !1]
                    ],
                    [7, "/", !1]
                ],
                [2, [6, "attachment_files", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            ckeditor_attachment_file_path: n.route(["id"], ["format"], [2, [2, [2, [7, "/", !1],
                        [6, "ckeditor", !1]
                    ],
                    [7, "/", !1]
                ],
                [2, [6, "attachment_files", !1],
                    [2, [7, "/", !1],
                        [2, [3, "id", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            contacts_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "contacts", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            coupon_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "coupons", !1],
                    [2, [7, "/", !1],
                        [2, [3, "id", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            coupons_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "coupons", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            create_paid_part_admin_users_list_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users_lists", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "create_paid_part", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            decline_account_orders_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "orders", !1],
                            [2, [7, "/", !1],
                                [2, [6, "decline", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            discount_account_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "discount", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            download_admin_report_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "reports", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "download", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_account_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "edit", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            edit_account_lecture_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_account_password_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "password", !1],
                            [2, [7, "/", !1],
                                [2, [6, "edit", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_admin_campaign_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "campaigns", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_admin_coupon_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "coupons", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_admin_distributor_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "distributors", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_admin_event_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "events", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_admin_event_break_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "event_breaks", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_admin_hall_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "halls", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_admin_lecture_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_admin_news_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "news", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_admin_order_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "orders", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_admin_page_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "pages", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_admin_topic_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "topics", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_admin_user_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_admin_workshop_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "workshops", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_api_city_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "cities", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_api_company_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "companies", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            edit_api_lecture_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "edit", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            give_badge_registrator_users_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "registrator", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users", !1],
                            [2, [7, "/", !1],
                                [2, [6, "give_badge", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            lectors_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "lectors", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            lectures_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "lectures", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            my_programm_api_events_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "events", !1],
                            [2, [7, "/", !1],
                                [2, [6, "my_programm", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_account_lecture_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_account_shirt_order_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "shirt_orders", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_admin_campaign_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "campaigns", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_admin_coupon_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "coupons", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_admin_distributor_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "distributors", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_admin_event_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "events", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_admin_event_break_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "event_breaks", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_admin_hall_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "halls", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_admin_lecture_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_admin_news_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "news", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_admin_page_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "pages", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_admin_ticket_code_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "ticket_codes", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_admin_topic_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "topics", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_admin_users_list_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users_lists", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_admin_workshop_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "workshops", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_api_city_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "cities", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_api_company_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "companies", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_api_lecture_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_buy_now_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "buy_now", !1],
                    [2, [7, "/", !1],
                        [2, [6, "new", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            new_registrator_users_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "registrator", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users", !1],
                            [2, [7, "/", !1],
                                [2, [6, "new", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            new_remind_password_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "remind_password", !1],
                    [2, [7, "/", !1],
                        [2, [6, "new", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            new_session_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "session", !1],
                    [2, [7, "/", !1],
                        [2, [6, "new", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            new_user_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "users", !1],
                    [2, [7, "/", !1],
                        [2, [6, "new", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            news_index_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "news", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            page_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "pages", !1],
                    [2, [7, "/", !1],
                        [2, [3, "id", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            pay_account_buy_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "buy", !1],
                            [2, [7, "/", !1],
                                [2, [6, "pay", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            pay_account_order_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "account", !1],
                    [2, [7, "/", !1],
                        [2, [6, "orders", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "pay", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            payments_cancel_payanyway_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "payments", !1],
                    [2, [7, "/", !1],
                        [2, [6, "cancel", !1],
                            [2, [7, "/", !1],
                                [2, [6, "payanyway", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            payments_check_order_yandexkassa_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "payments", !1],
                    [2, [7, "/", !1],
                        [2, [6, "check_order", !1],
                            [2, [7, "/", !1],
                                [2, [6, "yandexkassa", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            payments_decline_payanyway_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "payments", !1],
                    [2, [7, "/", !1],
                        [2, [6, "decline", !1],
                            [2, [7, "/", !1],
                                [2, [6, "payanyway", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            payments_fail_yandexkassa_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "payments", !1],
                    [2, [7, "/", !1],
                        [2, [6, "fail", !1],
                            [2, [7, "/", !1],
                                [2, [6, "yandexkassa", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            payments_paid_payanyway_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "payments", !1],
                    [2, [7, "/", !1],
                        [2, [6, "paid", !1],
                            [2, [7, "/", !1],
                                [2, [6, "payanyway", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            payments_payment_aviso_yandexkassa_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "payments", !1],
                    [2, [7, "/", !1],
                        [2, [6, "payment_aviso", !1],
                            [2, [7, "/", !1],
                                [2, [6, "yandexkassa", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            payments_success_payanyway_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "payments", !1],
                    [2, [7, "/", !1],
                        [2, [6, "success", !1],
                            [2, [7, "/", !1],
                                [2, [6, "payanyway", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            payments_success_yandexkassa_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "payments", !1],
                    [2, [7, "/", !1],
                        [2, [6, "success", !1],
                            [2, [7, "/", !1],
                                [2, [6, "yandexkassa", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            preview_path: n.route([], [], [2, [7, "/", !1],
                [6, "mailer_preview", !1]
            ], arguments),
            preview_admin_mailers_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "mailers", !1],
                            [2, [7, "/", !1],
                                [2, [6, "preview", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            prices_api_order_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "order", !1],
                            [2, [7, "/", !1],
                                [2, [6, "prices", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            promo_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "promo", !1],
                    [2, [7, "/", !1],
                        [2, [3, "id", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            registrator_root_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "registrator", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            registrator_users_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "registrator", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            remind_password_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "remind_password", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            report_admin_lectures_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "lectures", !1],
                            [2, [7, "/", !1],
                                [2, [6, "report", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            reports_admin_coupons_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "coupons", !1],
                            [2, [7, "/", !1],
                                [2, [6, "reports", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            root_path: n.route([], [], [7, "/", !1], arguments),
            schedule_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "schedule", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            session_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "session", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            social_wall_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "social_wall", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            sort_api_halls_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "api", !1],
                    [2, [7, "/", !1],
                        [2, [6, "halls", !1],
                            [2, [7, "/", !1],
                                [2, [6, "sort", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            speaker_index_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "speaker", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            success_buy_now_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "buy_now", !1],
                    [2, [7, "/", !1],
                        [2, [6, "success", !1],
                            [1, [2, [8, ".", !1],
                                [3, "format", !1]
                            ], !1]
                        ]
                    ]
                ]
            ], arguments),
            tickets_admin_user_path: n.route(["id"], ["format"], [2, [7, "/", !1],
                [2, [6, "admin", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users", !1],
                            [2, [7, "/", !1],
                                [2, [3, "id", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "tickets", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            user_lectures_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "user_lectures", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            users_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "users", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            web_admin_afterparty_tickets_index_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "web", !1],
                    [2, [7, "/", !1],
                        [2, [6, "admin", !1],
                            [2, [7, "/", !1],
                                [2, [6, "afterparty_tickets", !1],
                                    [2, [7, "/", !1],
                                        [2, [6, "index", !1],
                                            [1, [2, [8, ".", !1],
                                                [3, "format", !1]
                                            ], !1]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments),
            welcome_index_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "welcome", !1],
                    [1, [2, [8, ".", !1],
                        [3, "format", !1]
                    ], !1]
                ]
            ], arguments),
            with_badge_registrator_users_path: n.route([], ["format"], [2, [7, "/", !1],
                [2, [6, "registrator", !1],
                    [2, [7, "/", !1],
                        [2, [6, "users", !1],
                            [2, [7, "/", !1],
                                [2, [6, "with_badge", !1],
                                    [1, [2, [8, ".", !1],
                                        [3, "format", !1]
                                    ], !1]
                                ]
                            ]
                        ]
                    ]
                ]
            ], arguments)
        }, a.Routes.options = r, a.Routes
    }, "function" == typeof define && define.amd ? define([], function() {
        return i()
    }) : i()
}.call(this),
    function() {
        function t(t) {
            function e(e, n, i, r, a, o) {
                for (; a >= 0 && o > a; a += t) {
                    var s = r ? r[a] : a;
                    i = n(i, e[s], s, e)
                }
                return i
            }
            return function(n, i, r, a) {
                i = _(i, a, 4);
                var o = !$(n) && y.keys(n),
                    s = (o || n).length,
                    u = t > 0 ? 0 : s - 1;
                return arguments.length < 3 && (r = n[o ? o[u] : u], u += t), e(n, i, r, o, u, s)
            }
        }

        function e(t) {
            return function(e, n, i) {
                n = b(n, i);
                for (var r = T(e), a = t > 0 ? 0 : r - 1; a >= 0 && r > a; a += t)
                    if (n(e[a], a, e)) return a;
                return -1
            }
        }

        function n(t, e, n) {
            return function(i, r, a) {
                var o = 0,
                    s = T(i);
                if ("number" == typeof a) t > 0 ? o = a >= 0 ? a : Math.max(a + s, o) : s = a >= 0 ? Math.min(a + 1, s) : a + s + 1;
                else if (n && a && s) return a = n(i, r), i[a] === r ? a : -1;
                if (r !== r) return a = e(c.call(i, o, s), y.isNaN), a >= 0 ? a + o : -1;
                for (a = t > 0 ? o : s - 1; a >= 0 && s > a; a += t)
                    if (i[a] === r) return a;
                return -1
            }
        }

        function i(t, e) {
            var n = N.length,
                i = t.constructor,
                r = y.isFunction(i) && i.prototype || s,
                a = "constructor";
            for (y.has(t, a) && !y.contains(e, a) && e.push(a); n--;) a = N[n], a in t && t[a] !== r[a] && !y.contains(e, a) && e.push(a)
        }
        var r = this,
            a = r._,
            o = Array.prototype,
            s = Object.prototype,
            u = Function.prototype,
            l = o.push,
            c = o.slice,
            d = s.toString,
            h = s.hasOwnProperty,
            f = Array.isArray,
            p = Object.keys,
            m = u.bind,
            g = Object.create,
            v = function() {},
            y = function(t) {
                return t instanceof y ? t : this instanceof y ? void(this._wrapped = t) : new y(t)
            };
        "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = y), exports._ = y) : r._ = y, y.VERSION = "1.8.3";
        var _ = function(t, e, n) {
                if (void 0 === e) return t;
                switch (null == n ? 3 : n) {
                    case 1:
                        return function(n) {
                            return t.call(e, n)
                        };
                    case 2:
                        return function(n, i) {
                            return t.call(e, n, i)
                        };
                    case 3:
                        return function(n, i, r) {
                            return t.call(e, n, i, r)
                        };
                    case 4:
                        return function(n, i, r, a) {
                            return t.call(e, n, i, r, a)
                        }
                }
                return function() {
                    return t.apply(e, arguments)
                }
            },
            b = function(t, e, n) {
                return null == t ? y.identity : y.isFunction(t) ? _(t, e, n) : y.isObject(t) ? y.matcher(t) : y.property(t)
            };
        y.iteratee = function(t, e) {
            return b(t, e, 1 / 0)
        };
        var w = function(t, e) {
                return function(n) {
                    var i = arguments.length;
                    if (2 > i || null == n) return n;
                    for (var r = 1; i > r; r++)
                        for (var a = arguments[r], o = t(a), s = o.length, u = 0; s > u; u++) {
                            var l = o[u];
                            e && void 0 !== n[l] || (n[l] = a[l])
                        }
                    return n
                }
            },
            x = function(t) {
                if (!y.isObject(t)) return {};
                if (g) return g(t);
                v.prototype = t;
                var e = new v;
                return v.prototype = null, e
            },
            k = function(t) {
                return function(e) {
                    return null == e ? void 0 : e[t]
                }
            },
            C = Math.pow(2, 53) - 1,
            T = k("length"),
            $ = function(t) {
                var e = T(t);
                return "number" == typeof e && e >= 0 && C >= e
            };
        y.each = y.forEach = function(t, e, n) {
            e = _(e, n);
            var i, r;
            if ($(t))
                for (i = 0, r = t.length; r > i; i++) e(t[i], i, t);
            else {
                var a = y.keys(t);
                for (i = 0, r = a.length; r > i; i++) e(t[a[i]], a[i], t)
            }
            return t
        }, y.map = y.collect = function(t, e, n) {
            e = b(e, n);
            for (var i = !$(t) && y.keys(t), r = (i || t).length, a = Array(r), o = 0; r > o; o++) {
                var s = i ? i[o] : o;
                a[o] = e(t[s], s, t)
            }
            return a
        }, y.reduce = y.foldl = y.inject = t(1), y.reduceRight = y.foldr = t(-1), y.find = y.detect = function(t, e, n) {
            var i;
            return i = $(t) ? y.findIndex(t, e, n) : y.findKey(t, e, n), void 0 !== i && -1 !== i ? t[i] : void 0
        }, y.filter = y.select = function(t, e, n) {
            var i = [];
            return e = b(e, n), y.each(t, function(t, n, r) {
                e(t, n, r) && i.push(t)
            }), i
        }, y.reject = function(t, e, n) {
            return y.filter(t, y.negate(b(e)), n)
        }, y.every = y.all = function(t, e, n) {
            e = b(e, n);
            for (var i = !$(t) && y.keys(t), r = (i || t).length, a = 0; r > a; a++) {
                var o = i ? i[a] : a;
                if (!e(t[o], o, t)) return !1
            }
            return !0
        }, y.some = y.any = function(t, e, n) {
            e = b(e, n);
            for (var i = !$(t) && y.keys(t), r = (i || t).length, a = 0; r > a; a++) {
                var o = i ? i[a] : a;
                if (e(t[o], o, t)) return !0
            }
            return !1
        }, y.contains = y.includes = y.include = function(t, e, n, i) {
            return $(t) || (t = y.values(t)), ("number" != typeof n || i) && (n = 0), y.indexOf(t, e, n) >= 0
        }, y.invoke = function(t, e) {
            var n = c.call(arguments, 2),
                i = y.isFunction(e);
            return y.map(t, function(t) {
                var r = i ? e : t[e];
                return null == r ? r : r.apply(t, n)
            })
        }, y.pluck = function(t, e) {
            return y.map(t, y.property(e))
        }, y.where = function(t, e) {
            return y.filter(t, y.matcher(e))
        }, y.findWhere = function(t, e) {
            return y.find(t, y.matcher(e))
        }, y.max = function(t, e, n) {
            var i, r, a = -1 / 0,
                o = -1 / 0;
            if (null == e && null != t) {
                t = $(t) ? t : y.values(t);
                for (var s = 0, u = t.length; u > s; s++) i = t[s], i > a && (a = i)
            } else e = b(e, n), y.each(t, function(t, n, i) {
                r = e(t, n, i), (r > o || r === -1 / 0 && a === -1 / 0) && (a = t, o = r)
            });
            return a
        }, y.min = function(t, e, n) {
            var i, r, a = 1 / 0,
                o = 1 / 0;
            if (null == e && null != t) {
                t = $(t) ? t : y.values(t);
                for (var s = 0, u = t.length; u > s; s++) i = t[s], a > i && (a = i)
            } else e = b(e, n), y.each(t, function(t, n, i) {
                r = e(t, n, i), (o > r || 1 / 0 === r && 1 / 0 === a) && (a = t, o = r)
            });
            return a
        }, y.shuffle = function(t) {
            for (var e, n = $(t) ? t : y.values(t), i = n.length, r = Array(i), a = 0; i > a; a++) e = y.random(0, a), e !== a && (r[a] = r[e]), r[e] = n[a];
            return r
        }, y.sample = function(t, e, n) {
            return null == e || n ? ($(t) || (t = y.values(t)), t[y.random(t.length - 1)]) : y.shuffle(t).slice(0, Math.max(0, e))
        }, y.sortBy = function(t, e, n) {
            return e = b(e, n), y.pluck(y.map(t, function(t, n, i) {
                return {
                    value: t,
                    index: n,
                    criteria: e(t, n, i)
                }
            }).sort(function(t, e) {
                var n = t.criteria,
                    i = e.criteria;
                if (n !== i) {
                    if (n > i || void 0 === n) return 1;
                    if (i > n || void 0 === i) return -1
                }
                return t.index - e.index
            }), "value")
        };
        var j = function(t) {
            return function(e, n, i) {
                var r = {};
                return n = b(n, i), y.each(e, function(i, a) {
                    var o = n(i, a, e);
                    t(r, i, o)
                }), r
            }
        };
        y.groupBy = j(function(t, e, n) {
            y.has(t, n) ? t[n].push(e) : t[n] = [e]
        }), y.indexBy = j(function(t, e, n) {
            t[n] = e
        }), y.countBy = j(function(t, e, n) {
            y.has(t, n) ? t[n]++ : t[n] = 1
        }), y.toArray = function(t) {
            return t ? y.isArray(t) ? c.call(t) : $(t) ? y.map(t, y.identity) : y.values(t) : []
        }, y.size = function(t) {
            return null == t ? 0 : $(t) ? t.length : y.keys(t).length
        }, y.partition = function(t, e, n) {
            e = b(e, n);
            var i = [],
                r = [];
            return y.each(t, function(t, n, a) {
                (e(t, n, a) ? i : r).push(t)
            }), [i, r]
        }, y.first = y.head = y.take = function(t, e, n) {
            return null == t ? void 0 : null == e || n ? t[0] : y.initial(t, t.length - e)
        }, y.initial = function(t, e, n) {
            return c.call(t, 0, Math.max(0, t.length - (null == e || n ? 1 : e)))
        }, y.last = function(t, e, n) {
            return null == t ? void 0 : null == e || n ? t[t.length - 1] : y.rest(t, Math.max(0, t.length - e))
        }, y.rest = y.tail = y.drop = function(t, e, n) {
            return c.call(t, null == e || n ? 1 : e)
        }, y.compact = function(t) {
            return y.filter(t, y.identity)
        };
        var S = function(t, e, n, i) {
            for (var r = [], a = 0, o = i || 0, s = T(t); s > o; o++) {
                var u = t[o];
                if ($(u) && (y.isArray(u) || y.isArguments(u))) {
                    e || (u = S(u, e, n));
                    var l = 0,
                        c = u.length;
                    for (r.length += c; c > l;) r[a++] = u[l++]
                } else n || (r[a++] = u)
            }
            return r
        };
        y.flatten = function(t, e) {
            return S(t, e, !1)
        }, y.without = function(t) {
            return y.difference(t, c.call(arguments, 1))
        }, y.uniq = y.unique = function(t, e, n, i) {
            y.isBoolean(e) || (i = n, n = e, e = !1), null != n && (n = b(n, i));
            for (var r = [], a = [], o = 0, s = T(t); s > o; o++) {
                var u = t[o],
                    l = n ? n(u, o, t) : u;
                e ? (o && a === l || r.push(u), a = l) : n ? y.contains(a, l) || (a.push(l), r.push(u)) : y.contains(r, u) || r.push(u)
            }
            return r
        }, y.union = function() {
            return y.uniq(S(arguments, !0, !0))
        }, y.intersection = function(t) {
            for (var e = [], n = arguments.length, i = 0, r = T(t); r > i; i++) {
                var a = t[i];
                if (!y.contains(e, a)) {
                    for (var o = 1; n > o && y.contains(arguments[o], a); o++);
                    o === n && e.push(a)
                }
            }
            return e
        }, y.difference = function(t) {
            var e = S(arguments, !0, !0, 1);
            return y.filter(t, function(t) {
                return !y.contains(e, t)
            })
        }, y.zip = function() {
            return y.unzip(arguments)
        }, y.unzip = function(t) {
            for (var e = t && y.max(t, T).length || 0, n = Array(e), i = 0; e > i; i++) n[i] = y.pluck(t, i);
            return n
        }, y.object = function(t, e) {
            for (var n = {}, i = 0, r = T(t); r > i; i++) e ? n[t[i]] = e[i] : n[t[i][0]] = t[i][1];
            return n
        }, y.findIndex = e(1), y.findLastIndex = e(-1), y.sortedIndex = function(t, e, n, i) {
            n = b(n, i, 1);
            for (var r = n(e), a = 0, o = T(t); o > a;) {
                var s = Math.floor((a + o) / 2);
                n(t[s]) < r ? a = s + 1 : o = s
            }
            return a
        }, y.indexOf = n(1, y.findIndex, y.sortedIndex), y.lastIndexOf = n(-1, y.findLastIndex), y.range = function(t, e, n) {
            null == e && (e = t || 0, t = 0), n = n || 1;
            for (var i = Math.max(Math.ceil((e - t) / n), 0), r = Array(i), a = 0; i > a; a++, t += n) r[a] = t;
            return r
        };
        var E = function(t, e, n, i, r) {
            if (!(i instanceof e)) return t.apply(n, r);
            var a = x(t.prototype),
                o = t.apply(a, r);
            return y.isObject(o) ? o : a
        };
        y.bind = function(t, e) {
            if (m && t.bind === m) return m.apply(t, c.call(arguments, 1));
            if (!y.isFunction(t)) throw new TypeError("Bind must be called on a function");
            var n = c.call(arguments, 2),
                i = function() {
                    return E(t, i, e, this, n.concat(c.call(arguments)))
                };
            return i
        }, y.partial = function(t) {
            var e = c.call(arguments, 1),
                n = function() {
                    for (var i = 0, r = e.length, a = Array(r), o = 0; r > o; o++) a[o] = e[o] === y ? arguments[i++] : e[o];
                    for (; i < arguments.length;) a.push(arguments[i++]);
                    return E(t, n, this, this, a)
                };
            return n
        }, y.bindAll = function(t) {
            var e, n, i = arguments.length;
            if (1 >= i) throw new Error("bindAll must be passed function names");
            for (e = 1; i > e; e++) n = arguments[e], t[n] = y.bind(t[n], t);
            return t
        }, y.memoize = function(t, e) {
            var n = function(i) {
                var r = n.cache,
                    a = "" + (e ? e.apply(this, arguments) : i);
                return y.has(r, a) || (r[a] = t.apply(this, arguments)), r[a]
            };
            return n.cache = {}, n
        }, y.delay = function(t, e) {
            var n = c.call(arguments, 2);
            return setTimeout(function() {
                return t.apply(null, n)
            }, e)
        }, y.defer = y.partial(y.delay, y, 1), y.throttle = function(t, e, n) {
            var i, r, a, o = null,
                s = 0;
            n || (n = {});
            var u = function() {
                s = n.leading === !1 ? 0 : y.now(), o = null, a = t.apply(i, r), o || (i = r = null)
            };
            return function() {
                var l = y.now();
                s || n.leading !== !1 || (s = l);
                var c = e - (l - s);
                return i = this, r = arguments, 0 >= c || c > e ? (o && (clearTimeout(o), o = null), s = l, a = t.apply(i, r), o || (i = r = null)) : o || n.trailing === !1 || (o = setTimeout(u, c)), a
            }
        }, y.debounce = function(t, e, n) {
            var i, r, a, o, s, u = function() {
                var l = y.now() - o;
                e > l && l >= 0 ? i = setTimeout(u, e - l) : (i = null, n || (s = t.apply(a, r), i || (a = r = null)))
            };
            return function() {
                a = this, r = arguments, o = y.now();
                var l = n && !i;
                return i || (i = setTimeout(u, e)), l && (s = t.apply(a, r), a = r = null), s
            }
        }, y.wrap = function(t, e) {
            return y.partial(e, t)
        }, y.negate = function(t) {
            return function() {
                return !t.apply(this, arguments)
            }
        }, y.compose = function() {
            var t = arguments,
                e = t.length - 1;
            return function() {
                for (var n = e, i = t[e].apply(this, arguments); n--;) i = t[n].call(this, i);
                return i
            }
        }, y.after = function(t, e) {
            return function() {
                return --t < 1 ? e.apply(this, arguments) : void 0
            }
        }, y.before = function(t, e) {
            var n;
            return function() {
                return --t > 0 && (n = e.apply(this, arguments)), 1 >= t && (e = null), n
            }
        }, y.once = y.partial(y.before, 2);
        var A = !{
                toString: null
            }.propertyIsEnumerable("toString"),
            N = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
        y.keys = function(t) {
            if (!y.isObject(t)) return [];
            if (p) return p(t);
            var e = [];
            for (var n in t) y.has(t, n) && e.push(n);
            return A && i(t, e), e
        }, y.allKeys = function(t) {
            if (!y.isObject(t)) return [];
            var e = [];
            for (var n in t) e.push(n);
            return A && i(t, e), e
        }, y.values = function(t) {
            for (var e = y.keys(t), n = e.length, i = Array(n), r = 0; n > r; r++) i[r] = t[e[r]];
            return i
        }, y.mapObject = function(t, e, n) {
            e = b(e, n);
            for (var i, r = y.keys(t), a = r.length, o = {}, s = 0; a > s; s++) i = r[s], o[i] = e(t[i], i, t);
            return o
        }, y.pairs = function(t) {
            for (var e = y.keys(t), n = e.length, i = Array(n), r = 0; n > r; r++) i[r] = [e[r], t[e[r]]];
            return i
        }, y.invert = function(t) {
            for (var e = {}, n = y.keys(t), i = 0, r = n.length; r > i; i++) e[t[n[i]]] = n[i];
            return e
        }, y.functions = y.methods = function(t) {
            var e = [];
            for (var n in t) y.isFunction(t[n]) && e.push(n);
            return e.sort()
        }, y.extend = w(y.allKeys), y.extendOwn = y.assign = w(y.keys), y.findKey = function(t, e, n) {
            e = b(e, n);
            for (var i, r = y.keys(t), a = 0, o = r.length; o > a; a++)
                if (i = r[a], e(t[i], i, t)) return i
        }, y.pick = function(t, e, n) {
            var i, r, a = {},
                o = t;
            if (null == o) return a;
            y.isFunction(e) ? (r = y.allKeys(o), i = _(e, n)) : (r = S(arguments, !1, !1, 1), i = function(t, e, n) {
                return e in n
            }, o = Object(o));
            for (var s = 0, u = r.length; u > s; s++) {
                var l = r[s],
                    c = o[l];
                i(c, l, o) && (a[l] = c)
            }
            return a
        }, y.omit = function(t, e, n) {
            if (y.isFunction(e)) e = y.negate(e);
            else {
                var i = y.map(S(arguments, !1, !1, 1), String);
                e = function(t, e) {
                    return !y.contains(i, e)
                }
            }
            return y.pick(t, e, n)
        }, y.defaults = w(y.allKeys, !0), y.create = function(t, e) {
            var n = x(t);
            return e && y.extendOwn(n, e), n
        }, y.clone = function(t) {
            return y.isObject(t) ? y.isArray(t) ? t.slice() : y.extend({}, t) : t
        }, y.tap = function(t, e) {
            return e(t), t
        }, y.isMatch = function(t, e) {
            var n = y.keys(e),
                i = n.length;
            if (null == t) return !i;
            for (var r = Object(t), a = 0; i > a; a++) {
                var o = n[a];
                if (e[o] !== r[o] || !(o in r)) return !1
            }
            return !0
        };
        var D = function(t, e, n, i) {
            if (t === e) return 0 !== t || 1 / t === 1 / e;
            if (null == t || null == e) return t === e;
            t instanceof y && (t = t._wrapped), e instanceof y && (e = e._wrapped);
            var r = d.call(t);
            if (r !== d.call(e)) return !1;
            switch (r) {
                case "[object RegExp]":
                case "[object String]":
                    return "" + t == "" + e;
                case "[object Number]":
                    return +t !== +t ? +e !== +e : 0 === +t ? 1 / +t === 1 / e : +t === +e;
                case "[object Date]":
                case "[object Boolean]":
                    return +t === +e
            }
            var a = "[object Array]" === r;
            if (!a) {
                if ("object" != typeof t || "object" != typeof e) return !1;
                var o = t.constructor,
                    s = e.constructor;
                if (o !== s && !(y.isFunction(o) && o instanceof o && y.isFunction(s) && s instanceof s) && "constructor" in t && "constructor" in e) return !1
            }
            n = n || [], i = i || [];
            for (var u = n.length; u--;)
                if (n[u] === t) return i[u] === e;
            if (n.push(t), i.push(e), a) {
                if (u = t.length, u !== e.length) return !1;
                for (; u--;)
                    if (!D(t[u], e[u], n, i)) return !1
            } else {
                var l, c = y.keys(t);
                if (u = c.length, y.keys(e).length !== u) return !1;
                for (; u--;)
                    if (l = c[u], !y.has(e, l) || !D(t[l], e[l], n, i)) return !1
            }
            return n.pop(), i.pop(), !0
        };
        y.isEqual = function(t, e) {
            return D(t, e)
        }, y.isEmpty = function(t) {
            return null == t ? !0 : $(t) && (y.isArray(t) || y.isString(t) || y.isArguments(t)) ? 0 === t.length : 0 === y.keys(t).length
        }, y.isElement = function(t) {
            return !(!t || 1 !== t.nodeType)
        }, y.isArray = f || function(t) {
            return "[object Array]" === d.call(t)
        }, y.isObject = function(t) {
            var e = typeof t;
            return "function" === e || "object" === e && !!t
        }, y.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function(t) {
            y["is" + t] = function(e) {
                return d.call(e) === "[object " + t + "]"
            }
        }), y.isArguments(arguments) || (y.isArguments = function(t) {
            return y.has(t, "callee")
        }), "function" != typeof /./ && "object" != typeof Int8Array && (y.isFunction = function(t) {
            return "function" == typeof t || !1
        }), y.isFinite = function(t) {
            return isFinite(t) && !isNaN(parseFloat(t))
        }, y.isNaN = function(t) {
            return y.isNumber(t) && t !== +t
        }, y.isBoolean = function(t) {
            return t === !0 || t === !1 || "[object Boolean]" === d.call(t)
        }, y.isNull = function(t) {
            return null === t
        }, y.isUndefined = function(t) {
            return void 0 === t
        }, y.has = function(t, e) {
            return null != t && h.call(t, e)
        }, y.noConflict = function() {
            return r._ = a, this
        }, y.identity = function(t) {
            return t
        }, y.constant = function(t) {
            return function() {
                return t
            }
        }, y.noop = function() {}, y.property = k, y.propertyOf = function(t) {
            return null == t ? function() {} : function(e) {
                return t[e]
            }
        }, y.matcher = y.matches = function(t) {
            return t = y.extendOwn({}, t),
                function(e) {
                    return y.isMatch(e, t)
                }
        }, y.times = function(t, e, n) {
            var i = Array(Math.max(0, t));
            e = _(e, n, 1);
            for (var r = 0; t > r; r++) i[r] = e(r);
            return i
        }, y.random = function(t, e) {
            return null == e && (e = t, t = 0), t + Math.floor(Math.random() * (e - t + 1))
        }, y.now = Date.now || function() {
            return (new Date).getTime()
        };
        var I = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            },
            L = y.invert(I),
            P = function(t) {
                var e = function(e) {
                        return t[e]
                    },
                    n = "(?:" + y.keys(t).join("|") + ")",
                    i = RegExp(n),
                    r = RegExp(n, "g");
                return function(t) {
                    return t = null == t ? "" : "" + t, i.test(t) ? t.replace(r, e) : t
                }
            };
        y.escape = P(I), y.unescape = P(L), y.result = function(t, e, n) {
            var i = null == t ? void 0 : t[e];
            return void 0 === i && (i = n), y.isFunction(i) ? i.call(t) : i
        };
        var q = 0;
        y.uniqueId = function(t) {
            var e = ++q + "";
            return t ? t + e : e
        }, y.templateSettings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        };
        var O = /(.)^/,
            M = {
                "'": "'",
                "\\": "\\",
                "\r": "r",
                "\n": "n",
                "\u2028": "u2028",
                "\u2029": "u2029"
            },
            R = /\\|'|\r|\n|\u2028|\u2029/g,
            H = function(t) {
                return "\\" + M[t]
            };
        y.template = function(t, e, n) {
            !e && n && (e = n), e = y.defaults({}, e, y.templateSettings);
            var i = RegExp([(e.escape || O).source, (e.interpolate || O).source, (e.evaluate || O).source].join("|") + "|$", "g"),
                r = 0,
                a = "__p+='";
            t.replace(i, function(e, n, i, o, s) {
                return a += t.slice(r, s).replace(R, H), r = s + e.length, n ? a += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'" : i ? a += "'+\n((__t=(" + i + "))==null?'':__t)+\n'" : o && (a += "';\n" + o + "\n__p+='"), e
            }), a += "';\n", e.variable || (a = "with(obj||{}){\n" + a + "}\n"), a = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + a + "return __p;\n";
            try {
                var o = new Function(e.variable || "obj", "_", a)
            } catch (s) {
                throw s.source = a, s
            }
            var u = function(t) {
                    return o.call(this, t, y)
                },
                l = e.variable || "obj";
            return u.source = "function(" + l + "){\n" + a + "}", u
        }, y.chain = function(t) {
            var e = y(t);
            return e._chain = !0, e
        };
        var F = function(t, e) {
            return t._chain ? y(e).chain() : e
        };
        y.mixin = function(t) {
            y.each(y.functions(t), function(e) {
                var n = y[e] = t[e];
                y.prototype[e] = function() {
                    var t = [this._wrapped];
                    return l.apply(t, arguments), F(this, n.apply(y, t))
                }
            })
        }, y.mixin(y), y.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(t) {
            var e = o[t];
            y.prototype[t] = function() {
                var n = this._wrapped;
                return e.apply(n, arguments), "shift" !== t && "splice" !== t || 0 !== n.length || delete n[0], F(this, n)
            }
        }), y.each(["concat", "join", "slice"], function(t) {
            var e = o[t];
            y.prototype[t] = function() {
                return F(this, e.apply(this._wrapped, arguments))
            }
        }), y.prototype.value = function() {
            return this._wrapped
        }, y.prototype.valueOf = y.prototype.toJSON = y.prototype.value, y.prototype.toString = function() {
            return "" + this._wrapped
        }, "function" == typeof define && define.amd && define("underscore", [], function() {
            return y
        })
    }.call(this),
    function() {}.call(this),
    function() {
        null == window.JST && (window.JST = {}), window.JST["welcome/lectures"] = function(t) {
            return function() {
                var t, e, n, i, r, a, o;
                if (e = window.HAML.escape, t = window.HAML.cleanValue, n = [], this.four_lectures) {
                    for (n.push("<div class='mainpage__title pagetitle'>\n  <div class='layout-line'>\n    <h1 class='pagetitle__title'>\u0421\u0430\u043c\u044b\u0435 \u043b\u0443\u0447\u0448\u0438\u0435 \u0441\u043f\u0438\u043a\u0435\u0440\u044b (\u0441\u043b\u0443\u0447\u0430\u0439\u043d\u0430\u044f \u0432\u044b\u0431\u043e\u0440\u043a\u0430)</h1>\n  </div>\n</div>\n<div class='mainpage__speakers'>\n  <div class='layout-line'>\n    <ul>"), o = this.four_lectures, r = 0, a = o.length; a > r; r++) i = o[r], n.push("      <li>\n        <div class='mainpage__speakers-img'>\n          <img src='" + e(t(i.lector.user_pic)) + "' alt='" + e(t(i.lector.reverse_full_name)) + "," + e(t(i.lector.company)) +"' >\n          <span class='icon_lectures icon_section' style='background-image: url(" + e(t(i.workshop_icon)) + ")'></span>"), n.push("          " + e(t(i.workshop_color_icon))), n.push("        </div>\n        <div class='mainpage__speakers__about-mini'>\n          <h4>\n            <b>"), n.push("              " + e(t(i.lector.reverse_full_name))), n.push("            </b>"), n.push("            " + e(t(i.lector.position))), n.push("            " + e(t(i.lector.company))), n.push("          </h4>\n        </div>"), i && (n.push("        <div class='mainpage__speakers__about'>\n          <h4>"), n.push("            " + e(t(i.title))), n.push("          </h4>\n          <h5>"), n.push("            " + e(t(i.lector.position))), n.push("            " + e(t(i.lector.company))), n.push("            ,"), n.push("            " + e(t(i.lector.reverse_full_name))), n.push("          </h5>\n        </div>\n        <div class='mainpage__speakers__desc'>\n          <p class='open_this'>"), n.push("            " + e(t(i.thesises))), n.push("          </p>\n        </div>")), n.push("      </li>");
                    n.push("    </ul>\n  </div>\n</div>")
                }
                return n.join("\n").replace(/\s([\w-]+)='\x93true'/gm, " $1").replace(/\s([\w-]+)='\x93false'/gm, "").replace(/\s(?:id|class)=(['"])(\1)/gm, "")
            }.call(window.HAML.context(t))
        }
    }.call(this), jQuery(document).ready(function(t) {
        function e(e) {
            if (e.files && e.files[0] && ("image/png" == e.files[0].type || "image/jpeg" == e.files[0].type)) {
                var n = new FileReader;
                n.onload = function(e) {
                    t("#user_photo_preview").attr("src", e.target.result)
                }, n.readAsDataURL(e.files[0])
            }
        }
        t(".form_showpass").on("click", function() {
            var e = t("#user_old_password");
            t(this).hasClass("active") ? e.attr("type", "password") : e.attr("type", "text"), t(this).toggleClass("active")
        }), t(".tabs__title").click(function() {
            t(this).siblings().removeClass("selected").end().next("dd").andSelf().addClass("selected")
        }), t("#false_photo_input").click(function() {
            return t("#user_photo").click(), !1
        }), t("#user_photo").change(function() {
            e(this)
        }), t(".ticket").change(function() {
            ticketChanged()
        })
    }), $(function() {
        setTimeout(function() {
            $(".alert").fadeOut("slow")
        }, 1e4)
    }), $(document).ready(function() {
        $('input[name="radioFace"]').change(function() {
            "forFizicFace" == $('input[name="radioFace"]:checked').val() ? ($(".forYuricFace").hide(), $(".forFizicFace").show()) : "forYuricFace" == $('input[name="radioFace"]:checked').val() && ($(".forFizicFace").hide(), $(".forYuricFace").show())
        }).change()
    }),
    function() {
        var t;
        t = window.jQuery || window.Zepto || window.$, t.fn.fancySelect = function(e) {
            var n, i;
            return null == e && (e = {}), i = t.extend({
                forceiOS: !1,
                includeBlank: !1,
                optionTemplate: function(t) {
                    return t.text()
                },
                triggerTemplate: function(t) {
                    return t.text()
                }
            }, e), n = !!navigator.userAgent.match(/iP(hone|od|ad)/i), this.each(function() {
                var e, r, a, o, s, u, l;
                return o = t(this), o.hasClass("fancified") || "SELECT" !== o[0].tagName ? void 0 : (o.addClass("fancified"), o.css({
                    width: 1,
                    height: 1,
                    display: "block",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: 0
                }), o.wrap('<div class="fancy-select">'), l = o.parent(), o.data("class") && l.addClass(o.data("class")), l.append('<div class="trigger">'), (!n || i.forceiOS) && l.append('<ul class="options">'), s = l.find(".trigger"), a = l.find(".options"), r = o.prop("disabled"), r && l.addClass("disabled"), u = function() {
                    var t;
                    return t = i.triggerTemplate(o.find(":selected")), s.html(t)
                }, o.on("blur.fs", function() {
                    return s.hasClass("open") ? setTimeout(function() {
                        return s.trigger("close.fs")
                    }, 120) : void 0
                }), s.on("close.fs", function() {
                    return s.removeClass("open"), a.removeClass("open")
                }), s.on("click.fs", function() {
                    var e, u;
                    if (!r)
                        if (s.toggleClass("open"), n && !i.forceiOS) {
                            if (s.hasClass("open")) return o.focus()
                        } else if (s.hasClass("open") && (u = s.parent(), e = u.offsetParent(), u.offset().top + u.outerHeight() + a.outerHeight() + 20 > t(window).height() + t(window).scrollTop() || a.removeClass("overflowing")), a.toggleClass("open"), !n) return o.focus()
                }), o.on("enable", function() {
                    return o.prop("disabled", !1), l.removeClass("disabled"), r = !1, e()
                }), o.on("disable", function() {
                    return o.prop("disabled", !0), l.addClass("disabled"), r = !0
                }), o.on("change.fs", function(t) {
                    return t.originalEvent && t.originalEvent.isTrusted ? t.stopPropagation() : u()
                }), o.on("keydown", function(t) {
                    var e, n, i;
                    if (i = t.which, e = a.find(".hover"), e.removeClass("hover"), a.hasClass("open")) {
                        if (38 === i ? (t.preventDefault(), e.length && e.index() > 0 ? e.prev().addClass("hover") : a.find("li:last-child").addClass("hover")) : 40 === i ? (t.preventDefault(), e.length && e.index() < a.find("li").length - 1 ? e.next().addClass("hover") : a.find("li:first-child").addClass("hover")) : 27 === i ? (t.preventDefault(), s.trigger("click.fs")) : 13 === i || 32 === i ? (t.preventDefault(), e.trigger("click.fs")) : 9 === i && s.hasClass("open") && s.trigger("close.fs"), n = a.find(".hover"), n.length) return a.scrollTop(0), a.scrollTop(n.position().top - 12)
                    } else if (13 === i || 32 === i || 38 === i || 40 === i) return t.preventDefault(), s.trigger("click.fs")
                }), a.on("click.fs", "li", function() {
                    var e;
                    return e = t(this), o.val(e.data("raw-value")), n || o.trigger("blur.fs").trigger("focus.fs"), a.find(".selected").removeClass("selected"), e.addClass("selected"), o.val(e.data("raw-value")).trigger("change.fs").trigger("blur.fs").trigger("focus.fs")
                }), a.on("mouseenter.fs", "li", function() {
                    var e, n;
                    return n = t(this), e = a.find(".hover"), e.removeClass("hover"), n.addClass("hover")
                }), a.on("mouseleave.fs", "li", function() {
                    return a.find(".hover").removeClass("hover")
                }), e = function() {
                    var e;
                    return u(), !n || i.forceiOS ? (e = o.find("option"), o.find("option").each(function(e, n) {
                        var r;
                        return n = t(n), n.prop("disabled") || !n.val() && !i.includeBlank ? void 0 : (r = i.optionTemplate(n), a.append(n.prop("selected") ? '<li data-raw-value="' + n.val() + '" class="selected">' + r + "</li>" : '<li data-raw-value="' + n.val() + '">' + r + "</li>"))
                    })) : void 0
                }, o.on("update.fs", function() {
                    return l.find(".options").empty(), e()
                }), e())
            })
        }
    }.call(this),
    function(t) {
        function e(e, n) {
            var i, r;
            this.carouselRoot = t(e);
            var a = this;
            this._b = this._a = !1, this._e = this._d = this._c = "", this._f, this._g, this._h, this._i, this._j, this._k = 0, this.settings = t.extend({}, t.fn.touchCarousel.defaults, n), this._l = this.carouselRoot.find(".touchcarousel-container"), this._m = this._l[0].style, this._n = this._l.wrap(t('<div class="touchcarousel-wrapper" />')).parent();
            var o = this._l.find(".touchcarousel-item");
            this.items = [], this.numItems = o.length, i = navigator.userAgent.toLowerCase(), r = /(chrome)[ \/]([\w.]+)/.exec(i) || /(webkit)[ \/]([\w.]+)/.exec(i) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(i) || /(msie) ([\w.]+)/.exec(i) || 0 > i.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(i) || [], i = r[1] || "", r = r[2] || "0";
            var s = {};
            i && (s[i] = !0, s.version = r), s.chrome && (s.webkit = !0), a._o = s, this._p, this._q = !1, this._t = this._s = this._r = 0, this._w = this._v = this._u = !1, "ontouchstart" in window ? (this.hasTouch = !0, this._c = "touchstart.rs", this._d = "touchmove.rs", this._e = "touchend.rs", this._x = this.settings.baseTouchFriction) : (this.hasTouch = !1, this._x = this.settings.baseMouseFriction, this.settings.dragUsingMouse ? (this._c = "mousedown.rs", this._d = "mousemove.rs", this._e = "mouseup.rs", this._y, this._z, i = a._o, i.msie || i.opera ? this._y = this._z = "move" : i.mozilla && (this._y = "-moz-grab", this._z = "-moz-grabbing"), this._a1()) : this._n.addClass("auto-cursor")), (this.hasTouch || this.settings.useWebkit3d) && "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix && (this._l.css({
                "-webkit-transform-origin": "0 0",
                "-webkit-transform": "translateZ(0)"
            }), this._w = !0), this._w ? (this._b1 = "-webkit-transform", this._c1 = "translate3d(", this._d1 = "px, 0, 0)") : (this._b1 = "left", this._c1 = "", this._d1 = "px"), this.hasTouch && (this.settings.directionNavAutoHide = !1), this.settings.directionNav || (this._f1 = this._e1 = this.settings.loopItems ? !0 : !1, this.settings.loopItems = !0);
            var u, l, c = 0;
            if (o.eq(this.numItems - 1).addClass("last"), o.each(function(e) {
                    if (l = t(this), u = {}, u.item = l, u.index = e, u.posX = c, u.width = l.outerWidth(!0) || a.settings.itemFallbackWidth, c += u.width, this.hasTouch) {
                        var n;
                        l.find("a").each(function() {
                            n = t(this), n.data("tc-href", n.attr("href")), n.data("tc-target", n.attr("target")), n.attr("href", "#"), n.bind("click", function(e) {
                                if (e.preventDefault(), a._q) return !1;
                                e = t(this).data("tc-href");
                                var n = t(this).data("tc-target");
                                n && "_g1" !== n.toLowerCase() ? window.open(e) : window.location.href = e
                            })
                        })
                    } else l.find("a").bind("click.touchcarousel", function(t) {
                        return a._q ? (t.preventDefault(), !1) : void 0
                    });
                    l.find(".non-draggable").bind(a._c, function(t) {
                        a._q = !1, t.stopImmediatePropagation()
                    }), a.items.push(u)
                }), this._h1 = this._f = c, this._i1 = 0 < this.settings.itemsPerMove ? this.settings.itemsPerMove : 1, this.settings.pagingNav) {
                if (this._j1 = this.settings.snapToItems = !0, this._k1 = Math.ceil(this.numItems / this._i1), this._l1 = 0, this.settings.pagingNavControls) {
                    for (this._m1 = t('<div class="tc-paging-container"><div class="tc-paging-centerer"><div class="tc-paging-centerer-inside"></div></div></div>'), o = this._m1.find(".tc-paging-centerer-inside"), r = 1; r <= this._k1; r++) i = t('<a class="tc-paging-item" href="#">' + r + "</a>").data("tc-id", r), r === this._l1 + 1 && i.addClass("current"), o.append(i);
                    this._n1 = o.find(".tc-paging-item").click(function(e) {
                        e.preventDefault(), a.goTo((t(e.currentTarget).data("tc-id") - 1) * a._i1)
                    }), this._n.after(this._m1)
                }
            } else this._j1 = !1;
            this._l.css({
                width: c
            }), this.settings.directionNav && (this._n.after("<a href='#' class='arrow-holder left'><span class='arrow-icon left'></span></a> <a href='#' class='arrow-holder right'><span class='arrow-icon right'></span></a>"), this.arrowLeft = this.carouselRoot.find(".arrow-holder.left"), this.arrowRight = this.carouselRoot.find(".arrow-holder.right"), 1 > this.arrowLeft.length || 1 > this.arrowRight.length ? this.settings.directionNav = !1 : this.settings.directionNavAutoHide && (this.arrowLeft.hide(), this.arrowRight.hide(), this.carouselRoot.one("mousemove.arrowshover", function() {
                a.arrowLeft.fadeIn("fast"), a.arrowRight.fadeIn("fast")
            }), this.carouselRoot.hover(function() {
                a.arrowLeft.fadeIn("fast"), a.arrowRight.fadeIn("fast")
            }, function() {
                a.arrowLeft.fadeOut("fast"), a.arrowRight.fadeOut("fast")
            })), this._p1(0), this.settings.directionNav && (this.arrowRight.click(function(t) {
                t.preventDefault(), (a.settings.loopItems && !a._u || !a._f1) && a.next()
            }), this.arrowLeft.click(function(t) {
                t.preventDefault(), (a.settings.loopItems && !a._u || !a._e1) && a.prev()
            }))), this.carouselWidth, this._q1 = "onorientationchange" in window ? "orientationchange.touchcarousel" : "resize.touchcarousel";
            var d;
            t(window).bind(this._q1, function() {
                d && clearTimeout(d), d = setTimeout(function() {
                    a.updateCarouselSize(!1)
                }, 100)
            }), this.settings.scrollbar ? (this._r1 = t("<div class='scrollbar-holder'><div class='scrollbar" + ("light" === this.settings.scrollbarTheme.toLowerCase() ? " light" : " dark") + "'></div></div>"), this._r1.appendTo(this.carouselRoot), this.scrollbarJQ = this._r1.find(".scrollbar"), this._s1 = "", this._t1 = this.scrollbarJQ[0].style, this._u1 = 0, this.settings.scrollbarAutoHide ? (this._v1 = !1, this.scrollbarJQ.css("opacity", 0)) : this._v1 = !0) : this.settings.scrollbarAutoHide = !1, this.updateCarouselSize(!0), this._n.bind(this._c, function(t) {
                a._w1(t)
            }), this.settings.autoplay && 0 < this.settings.autoplayDelay ? (this._x1 = !1, this.autoplayTimer = "", this.wasAutoplayRunning = !0, this.hasTouch || this.carouselRoot.hover(function() {
                a._x1 = !0, a._y1()
            }, function() {
                a._x1 = !1, a._z1()
            }), this.autoplay = !0, this._a2()) : this.autoplay = !1, this.settings.keyboardNav && t(document).bind("keydown.touchcarousel", function(t) {
                a._u || (37 === t.keyCode ? a.prev() : 39 === t.keyCode && a.next())
            }), this.carouselRoot.css("overflow", "visible")
        }
        e.prototype = {
            goTo: function(t, e) {
                var n = this.items[t];
                n && (!e && this.autoplay && this.settings.autoplayStopAtAction && this.stopAutoplay(), this._b2(t), this.endPos = this._c2(), n = -n.posX, n > 0 ? n = 0 : n < this.carouselWidth - this._h1 && (n = this.carouselWidth - this._h1), this.animateTo(n, this.settings.transitionSpeed, "easeInOutSine"))
            },
            next: function(t) {
                var e = this._c2(),
                    n = this._d2(e).index;
                this._j1 ? (e = this._l1 + 1, n = e > this._k1 - 1 ? this.settings.loopItems ? 0 : (this._k1 - 1) * this._i1 : e * this._i1) : (n += this._i1, this.settings.loopItems && e <= this.carouselWidth - this._h1 && (n = 0), n > this.numItems - 1 && (n = this.numItems - 1)), this.goTo(n, t)
            },
            prev: function(t) {
                var e = this._c2(),
                    n = this._d2(e).index;
                this._j1 ? (e = this._l1 - 1, n = 0 > e ? this.settings.loopItems ? (this._k1 - 1) * this._i1 : 0 : e * this._i1) : (n -= this._i1, 0 > n && (n = this.settings.loopItems ? 0 > e ? 0 : this.numItems - 1 : 0)), this.goTo(n, t)
            },
            getCurrentId: function() {
                return this._d2(this._c2()).index
            },
            setXPos: function(t, e) {
                e ? this._t1[this._b1] = this._c1 + t + this._d1 : this._m[this._b1] = this._c1 + t + this._d1
            },
            stopAutoplay: function() {
                this._y1(), this.wasAutoplayRunning = this.autoplay = !1
            },
            resumeAutoplay: function() {
                this.autoplay = !0, this.wasAutoplayRunning || this._z1()
            },
            updateCarouselSize: function(t) {
                if (this.carouselWidth = this.carouselRoot.width(), this.settings.scrollToLast) {
                    var e = 0;
                    if (this._j1) {
                        var n = this.numItems % this._i1;
                        if (n > 0)
                            for (n = this.numItems - n; n < this.numItems; n++) e += this.items[n].width;
                        else e = this.carouselWidth
                    } else e = this.items[this.numItems - 1].width;
                    this._h1 = this._f + this.carouselWidth - e
                } else this._h1 = this._f;
                if (this.settings.scrollbar && (e = Math.round(this._r1.width() / (this._h1 / this.carouselWidth)), this.scrollbarJQ.css("width", e), this._u1 = this._r1.width() - e), !this.settings.scrollToLast) {
                    if (this.carouselWidth >= this._f) return this._v = !0, this.settings.loopItems || (this._f1 = !0, this.arrowRight.addClass("disabled"), this._e1 = !0, this.arrowLeft.addClass("disabled")), void this.setXPos(0);
                    this._v && (this._e1 = this._f1 = this._v = !1, this.arrowRight.removeClass("disabled"), this.arrowLeft.removeClass("disabled"))
                }
                t || (t = this.endPos = this._c2(), t > 0 ? t = 0 : t < this.carouselWidth - this._h1 && (t = this.carouselWidth - this._h1), this.animateTo(t, 300, "easeInOutSine"))
            },
            animateTo: function(e, n, i, r, a, o, s) {
                function u() {
                    l._b = !1, l._a2(), l.settings.scrollbarAutoHide && l._g2(), null !== l.settings.onAnimComplete && l.settings.onAnimComplete.call(l)
                }
                null !== this.settings.onAnimStart && this.settings.onAnimStart.call(this), this.autoplay && this.autoplayTimer && (this.wasAutoplayRunning = !0, this._y1()), this._e2();
                var l = this,
                    c = this.settings.scrollbar,
                    d = l._b1,
                    h = l._c1,
                    f = l._d1,
                    p = {
                        containerPos: this.endPos
                    },
                    m = {
                        containerPos: e
                    },
                    g = {
                        containerPos: a
                    };
                a = r ? a : e;
                var v = l._m;
                if (l._b = !0, c) {
                    var y = this._t1,
                        _ = l._h1 - l.carouselWidth;
                    this.settings.scrollbarAutoHide && (this._v1 || this._f2())
                }
                this._p1(a), this._p = t(p).animate(m, {
                    duration: n,
                    easing: i,
                    step: function() {
                        c && (y[d] = h + Math.round(l._u1 * (-this.containerPos / _)) + f), v[d] = h + Math.round(this.containerPos) + f
                    },
                    complete: function() {
                        r ? l._p = t(m).animate(g, {
                            duration: o,
                            easing: s,
                            step: function() {
                                c && (y[d] = h + Math.round(l._u1 * (-this.containerPos / _)) + f), v[d] = h + Math.round(this.containerPos) + f
                            },
                            complete: function() {
                                c && (y[d] = h + Math.round(l._u1 * (-g.containerPos / _)) + f), v[d] = h + Math.round(g.containerPos) + f, u()
                            }
                        }) : (c && (y[d] = h + Math.round(l._u1 * (-m.containerPos / _)) + f), v[d] = h + Math.round(m.containerPos) + f, u())
                    }
                })
            },
            destroy: function() {
                this.stopAutoplay(), this._n.unbind(this._c), t(document).unbind(this._d).unbind(this._e), t(window).unbind(this._q1), this.settings.keyboardNav && t(document).unbind("keydown.touchcarousel"), this.carouselRoot.remove()
            },
            _b2: function(t) {
                this._j1 && (this._l1 = t = this._h2(t), this.settings.pagingNavControls && (this._n1.removeClass("current"), this._n1.eq(t).addClass("current")))
            },
            _h2: function(t) {
                for (var e = this._i1, n = 0; n < this._k1; n++)
                    if (t >= n * e && n * e + e > t) return n;
                return 0 > t ? 0 : t >= this._k1 ? this._k1 - 1 : !1
            },
            _i2: function() {
                this.settings.loopItems || (this._e1 ? (this._e1 = !1, this.arrowLeft.removeClass("disabled")) : this._f1 && (this._f1 = !1, this.arrowRight.removeClass("disabled")))
            },
            _o1: function() {
                !this._e1 && !this.settings.loopItems && (this._e1 = !0, this.arrowLeft.addClass("disabled"), this._f1 && (this._f1 = !1, this.arrowRight.removeClass("disabled")))
            },
            _j2: function() {
                !this._f1 && !this.settings.loopItems && (this._f1 = !0, this.arrowRight.addClass("disabled"), this._e1 && (this._e1 = !1, this.arrowLeft.removeClass("disabled")))
            },
            _d2: function(t) {
                t = -t;
                for (var e, n = 0; n < this.numItems; n++)
                    if (e = this.items[n], t >= e.posX && t < e.posX + e.width) return e;
                return -1
            },
            _a2: function() {
                this.autoplay && this.wasAutoplayRunning && (this._x1 || this._z1(), this.wasAutoplayRunning = !1)
            },
            _g2: function() {
                var t = this;
                this._v1 = !1, this._s1 && clearTimeout(this._s1), this._s1 = setTimeout(function() {
                    t.scrollbarJQ.animate({
                        opacity: 0
                    }, 150, "linear")
                }, 450)
            },
            _f2: function() {
                this._v1 = !0, this._s1 && clearTimeout(this._s1), this.scrollbarJQ.stop().animate({
                    opacity: 1
                }, 150, "linear")
            },
            _e2: function() {
                this._p && this._p.stop()
            },
            _z1: function() {
                if (this.autoplay) {
                    var t = this;
                    this.autoplayTimer || (this.autoplayTimer = setInterval(function() {
                        !t._k2 && !t._b && t.next(!0)
                    }, this.settings.autoplayDelay))
                }
            },
            _y1: function() {
                this.autoplayTimer && (clearInterval(this.autoplayTimer), this.autoplayTimer = "")
            },
            _c2: function(t) {
                return t = t ? this.scrollbarJQ : this._l, this._w ? (t = t.css("-webkit-transform").replace(/^matrix\(/i, "").split(/, |\)$/g), parseInt(t[4], 10)) : Math.round(t.position().left)
            },
            _w1: function(e) {
                if (!this._k2) {
                    this.autoplay && this.settings.autoplayStopAtAction && this.stopAutoplay(), this._e2(), this.settings.scrollbarAutoHide && this._f2();
                    var n;
                    if (this.hasTouch) {
                        if (this._a = !1, !((n = e.originalEvent.touches) && 0 < n.length)) return !1;
                        n = n[0]
                    } else n = e, e.preventDefault();
                    this._l2(), this._k2 = !0;
                    var i = this;
                    this._w && i._l.css({
                        "-webkit-transition-duration": "0",
                        "-webkit-transition-property": "none"
                    }), t(document).bind(this._d, function(t) {
                        i._m2(t)
                    }), t(document).bind(this._e, function(t) {
                        i._n2(t)
                    }), this._o2 = this._c2(), this._i = n.clientX, this._q = !1, this._k = e.timeStamp || (new Date).getTime(), this._t = 0, this._s = this._r = n.clientX, this._p2 = n.clientY
                }
            },
            _m2: function(t) {
                var e, n = t.timeStamp || (new Date).getTime();
                if (this.hasTouch) {
                    if (this._a) return !1;
                    if (e = t.originalEvent.touches, 1 < e.length) return !1;
                    if (e = e[0], Math.abs(e.clientY - this._p2) > Math.abs(e.clientX - this._r) + 3) return this.settings.lockAxis && (this._a = !0), !1
                } else e = t;
                if (t.preventDefault(), this._j = e.clientX, this._q2 = this._r2, t = e.clientX - this._s, this._q2 != t && (this._r2 = t), 0 != t) {
                    var i = this._o2 + this._t;
                    i >= 0 ? (t /= 4, this._o1()) : i <= this.carouselWidth - this._h1 ? (this._j2(), t /= 4) : this._i2(), this._t += t, this.setXPos(i), this.settings.scrollbar && this.setXPos(this._u1 * (-i / (this._h1 - this.carouselWidth)), !0)
                }
                return this._s = e.clientX, 350 < n - this._k && (this._k = n, this._i = e.clientX), null !== this.settings.onDragStart && this.settings.onDragStart.call(this), !1
            },
            _n2: function(e) {
                if (this._k2) {
                    var n = this;
                    if (this._k2 = !1, this._a1(), this.endPos = this._c2(), this.isdrag = !1, t(document).unbind(this._d).unbind(this._e), this.endPos == this._o2) return this._q = !1, void(this.settings.scrollbarAutoHide && this._g2());
                    this._q = !0;
                    var i = this._j - this._i;
                    e = Math.max(40, (e.timeStamp || (new Date).getTime()) - this._k);
                    var r = .5;
                    e = Math.abs(i) / e;
                    var a = function(t) {
                        return t > 0 ? t = 0 : t < n.carouselWidth - n._h1 && (t = n.carouselWidth - n._h1), t
                    };
                    if (this.settings.snapToItems) {
                        this.autoplay && this.settings.autoplayStopAtAction && this.stopAutoplay();
                        var i = Boolean(0 < this._r - this._s),
                            r = a(this._c2()),
                            o = this._d2(r).index;
                        this._j1 ? (i && (r = Math.max(r - this.carouselWidth - 1, 1 - n._h1), o = this._d2(r).index, void 0 === o && (o = this.numItems - 1)), o = this._h2(o) * this._i1) : o += i ? this._i1 : -this._i1 + 1, o = i ? Math.min(o, this.numItems - 1) : Math.max(o, 0), r = this.items[o], this._b2(o), r && (r = a(-r.posX), a = Math.abs(this.endPos - r), e = Math.max(1.08 * a / e, 150), o = Boolean(180 > e), a *= .08, i && (a *= -1), this.animateTo(o ? r + a : r, Math.min(e, 400), "easeOutSine", o, r, 300, "easeOutCubic"))
                    } else a = 0, 2 >= e ? (r = 3.5 * this._x, a = 0) : e > 2 && 3 >= e ? (r = 4 * this._x, a = 200) : e > 3 && (a = 300, e > 4 && (e = 4, a = 400, r = 6 * this._x), r = 5 * this._x), i = 2 * e * e / (2 * r) * (0 > i ? -1 : 1), r = 2 * e / r + a, 0 < this.endPos + i ? 0 < this.endPos ? this.animateTo(0, 800, "easeOutCubic") : this.animateTo(this.carouselWidth / 10 * ((a + 200) / 1e3), 1.1 * Math.abs(this.endPos) / e, "easeOutSine", !0, 0, 400, "easeOutCubic") : this.endPos + i < this.carouselWidth - this._h1 ? this.endPos < this.carouselWidth - this._h1 ? this.animateTo(this.carouselWidth - this._h1, 800, "easeOutCubic") : this.animateTo(this.carouselWidth - this._h1 - this.carouselWidth / 10 * ((a + 200) / 1e3), 1.1 * Math.abs(this.carouselWidth - this._h1 - this.endPos) / e, "easeOutSine", !0, this.carouselWidth - this._h1, 400, "easeOutCubic") : this.animateTo(this.endPos + i, r, "easeOutCubic");
                    null !== this.settings.onDragRelease && this.settings.onDragRelease.call(this)
                }
                return !1
            },
            _p1: function(t) {
                void 0 === t && (t = this._c2()), this.settings.loopItems || (t >= 0 ? this._o1() : t <= this.carouselWidth - this._h1 ? this._j2() : this._i2())
            },
            _a1: function() {
                this._y ? this._n.css("cursor", this._y) : (this._n.removeClass("grabbing-cursor"), this._n.addClass("grab-cursor"))
            },
            _l2: function() {
                this._z ? this._n.css("cursor", this._z) : (this._n.removeClass("grab-cursor"), this._n.addClass("grabbing-cursor"))
            }
        }, t.fn.touchCarousel = function(n) {
            return this.each(function() {
                var i = new e(t(this), n);
                t(this).data("touchCarousel", i)
            })
        }, t.fn.touchCarousel.defaults = {
            itemsPerMove: 1,
            snapToItems: !1,
            pagingNav: !1,
            pagingNavControls: !0,
            autoplay: !1,
            autoplayDelay: 3e3,
            autoplayStopAtAction: !0,
            scrollbar: !0,
            scrollbarAutoHide: !1,
            scrollbarTheme: "dark",
            transitionSpeed: 600,
            directionNav: !0,
            directionNavAutoHide: !1,
            loopItems: !1,
            keyboardNav: !1,
            dragUsingMouse: !0,
            scrollToLast: !1,
            itemFallbackWidth: 500,
            baseMouseFriction: .0012,
            baseTouchFriction: 8e-4,
            lockAxis: !0,
            useWebkit3d: !1,
            onAnimStart: null,
            onAnimComplete: null,
            onDragStart: null,
            onDragRelease: null
        }, t.fn.touchCarousel.settings = {}, t.extend(jQuery.easing, {
            easeInOutSine: function(t, e, n, i, r) {
                return -i / 2 * (Math.cos(Math.PI * e / r) - 1) + n
            },
            easeOutSine: function(t, e, n, i, r) {
                return i * Math.sin(e / r * (Math.PI / 2)) + n
            },
            easeOutCubic: function(t, e, n, i, r) {
                return i * ((e = e / r - 1) * e * e + 1) + n
            }
        })
    }(jQuery), jQuery(document).ready(function(t) {
        t(".custom_select").fancySelect({
            legacyEvents: !0,
            optionTemplate: function(t) {
                return '<span class="before_select_option" style="background-image: url(\'' + t.data("icon") + '\');"></span><span class="select_option">' + t.text() + "</span>"
            }
        }), t("#filter_by_workshop option[value=" + t.url().param("workshop_id_eq") + "]").prop("selected", !0).trigger("change"), t("#filter_by_workshop").on("change.fs", function() {
            t.ajax({
                url: Routes.lectures_path(),
                type: "GET",
                dataType: "script",
                data: {
                    q: {
                        workshop_id_eq: t("#filter_by_workshop option:selected").val()
                    }
                },
                success: function() {
                    startShare42(), window.history.pushState("string", "\u0414\u043e\u043a\u043b\u0430\u0434\u044b", Routes.lectures_path() + "?q[workshop_id_eq]=" + t("#filter_by_workshop option:selected").val())
                }
            })
        }), t("#lectures").on("click", ".sorting a", function() {
            return t.getScript(this.href, function() {
                startShare42()
            }), !1
        })
    }), eval(function(t, e, n, i, r, a) {
        if (r = function(t) {
                return (e > t ? "" : r(parseInt(t / e))) + ((t %= e) > 35 ? String.fromCharCode(t + 29) : t.toString(36))
            }, !"".replace(/^/, String)) {
            for (; n--;) a[r(n)] = i[n] || r(n);
            i = [function(t) {
                return a[t]
            }], r = function() {
                return "\\w+"
            }, n = 1
        }
        for (; n--;) i[n] && (t = t.replace(new RegExp("\\b" + r(n) + "\\b", "g"), i[n]));
        return t
    }('7(A 3c.3q!=="9"){3c.3q=9(e){9 t(){}t.5S=e;p 5R t}}(9(e,t,n){h r={1N:9(t,n){h r=c;r.$k=e(n);r.6=e.4M({},e.37.2B.6,r.$k.v(),t);r.2A=t;r.4L()},4L:9(){9 r(e){h n,r="";7(A t.6.33==="9"){t.6.33.R(c,[e])}l{1A(n 38 e.d){7(e.d.5M(n)){r+=e.d[n].1K}}t.$k.2y(r)}t.3t()}h t=c,n;7(A t.6.2H==="9"){t.6.2H.R(c,[t.$k])}7(A t.6.2O==="2Y"){n=t.6.2O;e.5K(n,r)}l{t.3t()}},3t:9(){h e=c;e.$k.v("d-4I",e.$k.2x("2w")).v("d-4F",e.$k.2x("H"));e.$k.z({2u:0});e.2t=e.6.q;e.4E();e.5v=0;e.1X=14;e.23()},23:9(){h e=c;7(e.$k.25().N===0){p b}e.1M();e.4C();e.$S=e.$k.25();e.E=e.$S.N;e.4B();e.$G=e.$k.17(".d-1K");e.$K=e.$k.17(".d-1p");e.3u="U";e.13=0;e.26=[0];e.m=0;e.4A();e.4z()},4z:9(){h e=c;e.2V();e.2W();e.4t();e.30();e.4r();e.4q();e.2p();e.4o();7(e.6.2o!==b){e.4n(e.6.2o)}7(e.6.O===j){e.6.O=4Q}e.19();e.$k.17(".d-1p").z("4i","4h");7(!e.$k.2m(":3n")){e.3o()}l{e.$k.z("2u",1)}e.5O=b;e.2l();7(A e.6.3s==="9"){e.6.3s.R(c,[e.$k])}},2l:9(){h e=c;7(e.6.1Z===j){e.1Z()}7(e.6.1B===j){e.1B()}e.4g();7(A e.6.3w==="9"){e.6.3w.R(c,[e.$k])}},3x:9(){h e=c;7(A e.6.3B==="9"){e.6.3B.R(c,[e.$k])}e.3o();e.2V();e.2W();e.4f();e.30();e.2l();7(A e.6.3D==="9"){e.6.3D.R(c,[e.$k])}},3F:9(){h e=c;t.1c(9(){e.3x()},0)},3o:9(){h e=c;7(e.$k.2m(":3n")===b){e.$k.z({2u:0});t.18(e.1C);t.18(e.1X)}l{p b}e.1X=t.4d(9(){7(e.$k.2m(":3n")){e.3F();e.$k.4b({2u:1},2M);t.18(e.1X)}},5x)},4B:9(){h e=c;e.$S.5n(\'<L H="d-1p">\').4a(\'<L H="d-1K"></L>\');e.$k.17(".d-1p").4a(\'<L H="d-1p-49">\');e.1H=e.$k.17(".d-1p-49");e.$k.z("4i","4h")},1M:9(){h e=c,t=e.$k.1I(e.6.1M),n=e.$k.1I(e.6.2i);7(!t){e.$k.I(e.6.1M)}7(!n){e.$k.I(e.6.2i)}},2V:9(){h t=c,n,r;7(t.6.2Z===b){p b}7(t.6.48===j){t.6.q=t.2t=1;t.6.1h=b;t.6.1s=b;t.6.1O=b;t.6.22=b;t.6.1Q=b;t.6.1R=b;p b}n=e(t.6.47).1f();7(n>(t.6.1s[0]||t.2t)){t.6.q=t.2t}7(t.6.1h!==b){t.6.1h.5g(9(e,t){p e[0]-t[0]});1A(r=0;r<t.6.1h.N;r+=1){7(t.6.1h[r][0]<=n){t.6.q=t.6.1h[r][1]}}}l{7(n<=t.6.1s[0]&&t.6.1s!==b){t.6.q=t.6.1s[1]}7(n<=t.6.1O[0]&&t.6.1O!==b){t.6.q=t.6.1O[1]}7(n<=t.6.22[0]&&t.6.22!==b){t.6.q=t.6.22[1]}7(n<=t.6.1Q[0]&&t.6.1Q!==b){t.6.q=t.6.1Q[1]}7(n<=t.6.1R[0]&&t.6.1R!==b){t.6.q=t.6.1R[1]}}7(t.6.q>t.E&&t.6.46===j){t.6.q=t.E}},4r:9(){h n=c,r,i;7(n.6.2Z!==j){p b}i=e(t).1f();n.3d=9(){7(e(t).1f()!==i){7(n.6.O!==b){t.18(n.1C)}t.5d(r);r=t.1c(9(){i=e(t).1f();n.3x()},n.6.45)}};e(t).44(n.3d)},4f:9(){h e=c;e.2g(e.m);7(e.6.O!==b){e.3j()}},43:9(){h t=c,n=0,r=t.E-t.6.q;t.$G.2f(9(i){h s=e(c);s.z({1f:t.M}).v("d-1K",3p(i));7(i%t.6.q===0||i===r){7(!(i>r)){n+=1}}s.v("d-24",n)})},42:9(){h e=c,t=e.$G.N*e.M;e.$K.z({1f:t*2,T:0});e.43()},2W:9(){h e=c;e.40();e.42();e.3Z();e.3v()},40:9(){h e=c;e.M=1F.4O(e.$k.1f()/e.6.q)},3v:9(){h e=c,t=(e.E*e.M-e.6.q*e.M)*-1;7(e.6.q>e.E){e.D=0;t=0;e.3z=0}l{e.D=e.E-e.6.q;e.3z=t}p t},3Y:9(){p 0},3Z:9(){h t=c,n=0,r=0,i,s,o;t.J=[0];t.3E=[];1A(i=0;i<t.E;i+=1){r+=t.M;t.J.2D(-r);7(t.6.12===j){s=e(t.$G[i]);o=s.v("d-24");7(o!==n){t.3E[n]=t.J[i];n=o}}}},4t:9(){h t=c;7(t.6.2a===j||t.6.1v===j){t.B=e(\'<L H="d-5A"/>\').5m("5l",!t.F.15).5c(t.$k)}7(t.6.1v===j){t.3T()}7(t.6.2a===j){t.3S()}},3S:9(){h t=c,n=e(\'<L H="d-4U"/>\');t.B.1o(n);t.1u=e("<L/>",{"H":"d-1n",2y:t.6.2U[0]||""});t.1q=e("<L/>",{"H":"d-U",2y:t.6.2U[1]||""});n.1o(t.1u).1o(t.1q);n.w("2X.B 21.B",\'L[H^="d"]\',9(e){e.1l()});n.w("2n.B 28.B",\'L[H^="d"]\',9(n){n.1l();7(e(c).1I("d-U")){t.U()}l{t.1n()}})},3T:9(){h t=c;t.1k=e(\'<L H="d-1v"/>\');t.B.1o(t.1k);t.1k.w("2n.B 28.B",".d-1j",9(n){n.1l();7(3p(e(c).v("d-1j"))!==t.m){t.1g(3p(e(c).v("d-1j")),j)}})},3P:9(){h t=c,n,r,i,s,o,u;7(t.6.1v===b){p b}t.1k.2y("");n=0;r=t.E-t.E%t.6.q;1A(s=0;s<t.E;s+=1){7(s%t.6.q===0){n+=1;7(r===s){i=t.E-t.6.q}o=e("<L/>",{"H":"d-1j"});u=e("<3N></3N>",{4R:t.6.39===j?n:"","H":t.6.39===j?"d-59":""});o.1o(u);o.v("d-1j",r===s?i:s);o.v("d-24",n);t.1k.1o(o)}}t.35()},35:9(){h t=c;7(t.6.1v===b){p b}t.1k.17(".d-1j").2f(9(){7(e(c).v("d-24")===e(t.$G[t.m]).v("d-24")){t.1k.17(".d-1j").Z("2d");e(c).I("2d")}})},3e:9(){h e=c;7(e.6.2a===b){p b}7(e.6.2e===b){7(e.m===0&&e.D===0){e.1u.I("1b");e.1q.I("1b")}l 7(e.m===0&&e.D!==0){e.1u.I("1b");e.1q.Z("1b")}l 7(e.m===e.D){e.1u.Z("1b");e.1q.I("1b")}l 7(e.m!==0&&e.m!==e.D){e.1u.Z("1b");e.1q.Z("1b")}}},30:9(){h e=c;e.3P();e.3e();7(e.B){7(e.6.q>=e.E){e.B.3K()}l{e.B.3J()}}},55:9(){h e=c;7(e.B){e.B.3k()}},U:9(e){h t=c;7(t.1E){p b}t.m+=t.6.12===j?t.6.q:1;7(t.m>t.D+(t.6.12===j?t.6.q-1:0)){7(t.6.2e===j){t.m=0;e="2k"}l{t.m=t.D;p b}}t.1g(t.m,e)},1n:9(e){h t=c;7(t.1E){p b}7(t.6.12===j&&t.m>0&&t.m<t.6.q){t.m=0}l{t.m-=t.6.12===j?t.6.q:1}7(t.m<0){7(t.6.2e===j){t.m=t.D;e="2k"}l{t.m=0;p b}}t.1g(t.m,e)},1g:9(e,n,r){h i=c,s;7(i.1E){p b}7(A i.6.1Y==="9"){i.6.1Y.R(c,[i.$k])}7(e>=i.D){e=i.D}l 7(e<=0){e=0}i.m=i.d.m=e;7(i.6.2o!==b&&r!=="4e"&&i.6.q===1&&i.F.1x===j){i.1t(0);7(i.F.1x===j){i.1L(i.J[e])}l{i.1r(i.J[e],1)}i.2r();i.4l();p b}s=i.J[e];7(i.F.1x===j){i.1T=b;7(n===j){i.1t("1w");t.1c(9(){i.1T=j},i.6.1w)}l 7(n==="2k"){i.1t(i.6.2v);t.1c(9(){i.1T=j},i.6.2v)}l{i.1t("1m");t.1c(9(){i.1T=j},i.6.1m)}i.1L(s)}l{7(n===j){i.1r(s,i.6.1w)}l 7(n==="2k"){i.1r(s,i.6.2v)}l{i.1r(s,i.6.1m)}}i.2r()},2g:9(e){h t=c;7(A t.6.1Y==="9"){t.6.1Y.R(c,[t.$k])}7(e>=t.D||e===-1){e=t.D}l 7(e<=0){e=0}t.1t(0);7(t.F.1x===j){t.1L(t.J[e])}l{t.1r(t.J[e],1)}t.m=t.d.m=e;t.2r()},2r:9(){h e=c;e.26.2D(e.m);e.13=e.d.13=e.26[e.26.N-2];e.26.5f(0);7(e.13!==e.m){e.35();e.3e();e.2l();7(e.6.O!==b){e.3j()}}7(A e.6.3y==="9"&&e.13!==e.m){e.6.3y.R(c,[e.$k])}},X:9(){h e=c;e.3A="X";t.18(e.1C)},3j:9(){h e=c;7(e.3A!=="X"){e.19()}},19:9(){h e=c;e.3A="19";7(e.6.O===b){p b}t.18(e.1C);e.1C=t.4d(9(){e.U(j)},e.6.O)},1t:9(e){h t=c;7(e==="1m"){t.$K.z(t.2z(t.6.1m))}l 7(e==="1w"){t.$K.z(t.2z(t.6.1w))}l 7(A e!=="2Y"){t.$K.z(t.2z(e))}},2z:9(e){p{"-1G-1a":"2C "+e+"1z 2s","-1W-1a":"2C "+e+"1z 2s","-o-1a":"2C "+e+"1z 2s",1a:"2C "+e+"1z 2s"}},3H:9(){p{"-1G-1a":"","-1W-1a":"","-o-1a":"",1a:""}},3I:9(e){p{"-1G-P":"1i("+e+"V, C, C)","-1W-P":"1i("+e+"V, C, C)","-o-P":"1i("+e+"V, C, C)","-1z-P":"1i("+e+"V, C, C)",P:"1i("+e+"V, C,C)"}},1L:9(e){h t=c;t.$K.z(t.3I(e))},3L:9(e){h t=c;t.$K.z({T:e})},1r:9(e,t){h n=c;n.29=b;n.$K.X(j,j).4b({T:e},{54:t||n.6.1m,3M:9(){n.29=j}})},4E:9(){h e=c,r="1i(C, C, C)",i=n.56("L"),s,o,u,a;i.2w.3O="  -1W-P:"+r+"; -1z-P:"+r+"; -o-P:"+r+"; -1G-P:"+r+"; P:"+r;s=/1i\\(C, C, C\\)/g;o=i.2w.3O.5i(s);u=o!==14&&o.N===1;a="5z"38 t||t.5Q.4P;e.F={1x:u,15:a}},4q:9(){h e=c;7(e.6.27!==b||e.6.1U!==b){e.3Q();e.3R()}},4C:9(){h e=c,t=["s","e","x"];e.16={};7(e.6.27===j&&e.6.1U===j){t=["2X.d 21.d","2N.d 3U.d","2n.d 3V.d 28.d"]}l 7(e.6.27===b&&e.6.1U===j){t=["2X.d","2N.d","2n.d 3V.d"]}l 7(e.6.27===j&&e.6.1U===b){t=["21.d","3U.d","28.d"]}e.16.3W=t[0];e.16.2K=t[1];e.16.2J=t[2]},3R:9(){h t=c;t.$k.w("5y.d",9(e){e.1l()});t.$k.w("21.3X",9(t){p e(t.1d).2m("5C, 5E, 5F, 5N")})},3Q:9(){9 s(e){7(e.2b!==W){p{x:e.2b[0].2c,y:e.2b[0].41}}7(e.2b===W){7(e.2c!==W){p{x:e.2c,y:e.41}}7(e.2c===W){p{x:e.52,y:e.53}}}}9 o(t){7(t==="w"){e(n).w(r.16.2K,a);e(n).w(r.16.2J,f)}l 7(t==="Q"){e(n).Q(r.16.2K);e(n).Q(r.16.2J)}}9 u(n){h u=n.3h||n||t.3g,a;7(u.5a===3){p b}7(r.E<=r.6.q){p}7(r.29===b&&!r.6.3f){p b}7(r.1T===b&&!r.6.3f){p b}7(r.6.O!==b){t.18(r.1C)}7(r.F.15!==j&&!r.$K.1I("3b")){r.$K.I("3b")}r.11=0;r.Y=0;e(c).z(r.3H());a=e(c).2h();i.2S=a.T;i.2R=s(u).x-a.T;i.2P=s(u).y-a.5o;o("w");i.2j=b;i.2L=u.1d||u.4c}9 a(o){h u=o.3h||o||t.3g,a,f;r.11=s(u).x-i.2R;r.2I=s(u).y-i.2P;r.Y=r.11-i.2S;7(A r.6.2E==="9"&&i.3C!==j&&r.Y!==0){i.3C=j;r.6.2E.R(r,[r.$k])}7((r.Y>8||r.Y<-8)&&r.F.15===j){7(u.1l!==W){u.1l()}l{u.5L=b}i.2j=j}7((r.2I>10||r.2I<-10)&&i.2j===b){e(n).Q("2N.d")}a=9(){p r.Y/5};f=9(){p r.3z+r.Y/5};r.11=1F.3v(1F.3Y(r.11,a()),f());7(r.F.1x===j){r.1L(r.11)}l{r.3L(r.11)}}9 f(n){h s=n.3h||n||t.3g,u,a,f;s.1d=s.1d||s.4c;i.3C=b;7(r.F.15!==j){r.$K.Z("3b")}7(r.Y<0){r.1y=r.d.1y="T"}l{r.1y=r.d.1y="3i"}7(r.Y!==0){u=r.4j();r.1g(u,b,"4e");7(i.2L===s.1d&&r.F.15!==j){e(s.1d).w("3a.4k",9(t){t.4S();t.4T();t.1l();e(t.1d).Q("3a.4k")});a=e.4N(s.1d,"4V").3a;f=a.4W();a.4X(0,0,f)}}o("Q")}h r=c,i={2R:0,2P:0,4Y:0,2S:0,2h:14,4Z:14,50:14,2j:14,51:14,2L:14};r.29=j;r.$k.w(r.16.3W,".d-1p",u)},4j:9(){h e=c,t=e.4m();7(t>e.D){e.m=e.D;t=e.D}l 7(e.11>=0){t=0;e.m=0}p t},4m:9(){h t=c,n=t.6.12===j?t.3E:t.J,r=t.11,i=14;e.2f(n,9(s,o){7(r-t.M/20>n[s+1]&&r-t.M/20<o&&t.34()==="T"){i=o;7(t.6.12===j){t.m=e.4p(i,t.J)}l{t.m=s}}l 7(r+t.M/20<o&&r+t.M/20>(n[s+1]||n[s]-t.M)&&t.34()==="3i"){7(t.6.12===j){i=n[s+1]||n[n.N-1];t.m=e.4p(i,t.J)}l{i=n[s+1];t.m=s+1}}});p t.m},34:9(){h e=c,t;7(e.Y<0){t="3i";e.3u="U"}l{t="T";e.3u="1n"}p t},4A:9(){h e=c;e.$k.w("d.U",9(){e.U()});e.$k.w("d.1n",9(){e.1n()});e.$k.w("d.19",9(t,n){e.6.O=n;e.19();e.32="19"});e.$k.w("d.X",9(){e.X();e.32="X"});e.$k.w("d.1g",9(t,n){e.1g(n)});e.$k.w("d.2g",9(t,n){e.2g(n)})},2p:9(){h e=c;7(e.6.2p===j&&e.F.15!==j&&e.6.O!==b){e.$k.w("57",9(){e.X()});e.$k.w("58",9(){7(e.32!=="X"){e.19()}})}},1Z:9(){h t=c,n,r,i,s,o;7(t.6.1Z===b){p b}1A(n=0;n<t.E;n+=1){r=e(t.$G[n]);7(r.v("d-1e")==="1e"){4s}i=r.v("d-1K");s=r.17(".5b");7(A s.v("1J")!=="2Y"){r.v("d-1e","1e");4s}7(r.v("d-1e")===W){s.3K();r.I("4u").v("d-1e","5e")}7(t.6.4v===j){o=i>=t.m}l{o=j}7(o&&i<t.m+t.6.q&&s.N){t.4w(r,s)}}},4w:9(e,n){9 o(){e.v("d-1e","1e").Z("4u");n.5h("v-1J");7(r.6.4x==="4y"){n.5j(5k)}l{n.3J()}7(A r.6.2T==="9"){r.6.2T.R(c,[r.$k])}}9 u(){i+=1;7(r.2Q(n.3l(0))||s===j){o()}l 7(i<=2q){t.1c(u,2q)}l{o()}}h r=c,i=0,s;7(n.5p("5q")==="5r"){n.z("5s-5t","5u("+n.v("1J")+")");s=j}l{n[0].1J=n.v("1J")}u()},1B:9(){9 s(){h r=e(n.$G[n.m]).2G();n.1H.z("2G",r+"V");7(!n.1H.1I("1B")){t.1c(9(){n.1H.I("1B")},0)}}9 o(){i+=1;7(n.2Q(r.3l(0))){s()}l 7(i<=2q){t.1c(o,2q)}l{n.1H.z("2G","")}}h n=c,r=e(n.$G[n.m]).17("5w"),i;7(r.3l(0)!==W){i=0;o()}l{s()}},2Q:9(e){h t;7(!e.3M){p b}t=A e.4D;7(t!=="W"&&e.4D===0){p b}p j},4g:9(){h t=c,n;7(t.6.2F===j){t.$G.Z("2d")}t.1D=[];1A(n=t.m;n<t.m+t.6.q;n+=1){t.1D.2D(n);7(t.6.2F===j){e(t.$G[n]).I("2d")}}t.d.1D=t.1D},4n:9(e){h t=c;t.4G="d-"+e+"-5B";t.4H="d-"+e+"-38"},4l:9(){9 a(e){p{2h:"5D",T:e+"V"}}h e=c,t=e.4G,n=e.4H,r=e.$G.1S(e.m),i=e.$G.1S(e.13),s=1F.4J(e.J[e.m])+e.J[e.13],o=1F.4J(e.J[e.m])+e.M/2,u="5G 5H 5I 5J";e.1E=j;e.$K.I("d-1P").z({"-1G-P-1P":o+"V","-1W-4K-1P":o+"V","4K-1P":o+"V"});i.z(a(s,10)).I(t).w(u,9(){e.3m=j;i.Q(u);e.31(i,t)});r.I(n).w(u,9(){e.36=j;r.Q(u);e.31(r,n)})},31:9(e,t){h n=c;e.z({2h:"",T:""}).Z(t);7(n.3m&&n.36){n.$K.Z("d-1P");n.3m=b;n.36=b;n.1E=b}},4o:9(){h e=c;e.d={2A:e.2A,5P:e.$k,S:e.$S,G:e.$G,m:e.m,13:e.13,1D:e.1D,15:e.F.15,F:e.F,1y:e.1y}},3G:9(){h r=c;r.$k.Q(".d d 21.3X");e(n).Q(".d d");e(t).Q("44",r.3d)},1V:9(){h e=c;7(e.$k.25().N!==0){e.$K.3r();e.$S.3r().3r();7(e.B){e.B.3k()}}e.3G();e.$k.2x("2w",e.$k.v("d-4I")||"").2x("H",e.$k.v("d-4F"))},5T:9(){h e=c;e.X();t.18(e.1X);e.1V();e.$k.5U()},5V:9(t){h n=c,r=e.4M({},n.2A,t);n.1V();n.1N(r,n.$k)},5W:9(e,t){h n=c,r;7(!e){p b}7(n.$k.25().N===0){n.$k.1o(e);n.23();p b}n.1V();7(t===W||t===-1){r=-1}l{r=t}7(r>=n.$S.N||r===-1){n.$S.1S(-1).5X(e)}l{n.$S.1S(r).5Y(e)}n.23()},5Z:9(e){h t=c,n;7(t.$k.25().N===0){p b}7(e===W||e===-1){n=-1}l{n=e}t.1V();t.$S.1S(n).3k();t.23()}};e.37.2B=9(t){p c.2f(9(){7(e(c).v("d-1N")===j){p b}e(c).v("d-1N",j);h n=3c.3q(r);n.1N(t,c);e.v(c,"2B",n)})};e.37.2B.6={q:5,1h:b,1s:[60,4],1O:[61,3],22:[62,2],1Q:b,1R:[63,1],48:b,46:b,1m:2M,1w:64,2v:65,O:b,2p:b,2a:b,2U:["1n","U"],2e:j,12:b,1v:j,39:b,2Z:j,45:2M,47:t,1M:"d-66",2i:"d-2i",1Z:b,4v:j,4x:"4y",1B:b,2O:b,33:b,3f:j,27:j,1U:j,2F:b,2o:b,3B:b,3D:b,2H:b,3s:b,1Y:b,3y:b,3w:b,2E:b,2T:b}})(67,68,69)', 62, 382, "||||||options|if||function||false|this|owl||||var||true|elem|else|currentItem|||return|items|||||data|on|||css|typeof|owlControls|0px|maximumItem|itemsAmount|browser|owlItems|class|addClass|positionsInArray|owlWrapper|div|itemWidth|length|autoPlay|transform|off|apply|userItems|left|next|px|undefined|stop|newRelativeX|removeClass||newPosX|scrollPerPage|prevItem|null|isTouch|ev_types|find|clearInterval|play|transition|disabled|setTimeout|target|loaded|width|goTo|itemsCustom|translate3d|page|paginationWrapper|preventDefault|slideSpeed|prev|append|wrapper|buttonNext|css2slide|itemsDesktop|swapSpeed|buttonPrev|pagination|paginationSpeed|support3d|dragDirection|ms|for|autoHeight|autoPlayInterval|visibleItems|isTransition|Math|webkit|wrapperOuter|hasClass|src|item|transition3d|baseClass|init|itemsDesktopSmall|origin|itemsTabletSmall|itemsMobile|eq|isCss3Finish|touchDrag|unWrap|moz|checkVisible|beforeMove|lazyLoad||mousedown|itemsTablet|setVars|roundPages|children|prevArr|mouseDrag|mouseup|isCssFinish|navigation|touches|pageX|active|rewindNav|each|jumpTo|position|theme|sliding|rewind|eachMoveUpdate|is|touchend|transitionStyle|stopOnHover|100|afterGo|ease|orignalItems|opacity|rewindSpeed|style|attr|html|addCssSpeed|userOptions|owlCarousel|all|push|startDragging|addClassActive|height|beforeInit|newPosY|end|move|targetElement|200|touchmove|jsonPath|offsetY|completeImg|offsetX|relativePos|afterLazyLoad|navigationText|updateItems|calculateAll|touchstart|string|responsive|updateControls|clearTransStyle|hoverStatus|jsonSuccess|moveDirection|checkPagination|endCurrent|fn|in|paginationNumbers|click|grabbing|Object|resizer|checkNavigation|dragBeforeAnimFinish|event|originalEvent|right|checkAp|remove|get|endPrev|visible|watchVisibility|Number|create|unwrap|afterInit|logIn|playDirection|max|afterAction|updateVars|afterMove|maximumPixels|apStatus|beforeUpdate|dragging|afterUpdate|pagesInArray|reload|clearEvents|removeTransition|doTranslate|show|hide|css2move|complete|span|cssText|updatePagination|gestures|disabledEvents|buildButtons|buildPagination|mousemove|touchcancel|start|disableTextSelect|min|loops|calculateWidth|pageY|appendWrapperSizes|appendItemsSizes|resize|responsiveRefreshRate|itemsScaleUp|responsiveBaseWidth|singleItem|outer|wrap|animate|srcElement|setInterval|drag|updatePosition|onVisibleItems|block|display|getNewPosition|disable|singleItemTransition|closestItem|transitionTypes|owlStatus|inArray|moveEvents|response|continue|buildControls|loading|lazyFollow|lazyPreload|lazyEffect|fade|onStartup|customEvents|wrapItems|eventTypes|naturalWidth|checkBrowser|originalClasses|outClass|inClass|originalStyles|abs|perspective|loadContent|extend|_data|round|msMaxTouchPoints|5e3|text|stopImmediatePropagation|stopPropagation|buttons|events|pop|splice|baseElWidth|minSwipe|maxSwipe|dargging|clientX|clientY|duration|destroyControls|createElement|mouseover|mouseout|numbers|which|lazyOwl|appendTo|clearTimeout|checked|shift|sort|removeAttr|match|fadeIn|400|clickable|toggleClass|wrapAll|top|prop|tagName|DIV|background|image|url|wrapperWidth|img|500|dragstart|ontouchstart|controls|out|input|relative|textarea|select|webkitAnimationEnd|oAnimationEnd|MSAnimationEnd|animationend|getJSON|returnValue|hasOwnProperty|option|onstartup|baseElement|navigator|new|prototype|destroy|removeData|reinit|addItem|after|before|removeItem|1199|979|768|479|800|1e3|carousel|jQuery|window|document".split("|"), 0, {})),
    function(t) {
        "function" == typeof define && define.amd ? define(t) : window.purl = t()
    }(function() {
        function t(t, e) {
            for (var n = decodeURI(t), i = m[e ? "strict" : "loose"].exec(n), r = {
                    attr: {},
                    param: {},
                    seg: {}
                }, o = 14; o--;) r.attr[f[o]] = i[o] || "";
            return r.param.query = a(r.attr.query), r.param.fragment = a(r.attr.fragment), r.seg.path = r.attr.path.replace(/^\/+|\/+$/g, "").split("/"), r.seg.fragment = r.attr.fragment.replace(/^\/+|\/+$/g, "").split("/"), r.attr.base = r.attr.host ? (r.attr.protocol ? r.attr.protocol + "://" + r.attr.host : r.attr.host) + (r.attr.port ? ":" + r.attr.port : "") : "", r
        }

        function e(t) {
            var e = t.tagName;
            return "undefined" != typeof e ? h[e.toLowerCase()] : e
        }

        function n(t, e) {
            if (0 === t[e].length) return t[e] = {};
            var n = {};
            for (var i in t[e]) n[i] = t[e][i];
            return t[e] = n, n
        }

        function i(t, e, r, a) {
            var o = t.shift();
            if (o) {
                var s = e[r] = e[r] || [];
                "]" == o ? l(s) ? "" !== a && s.push(a) : "object" == typeof s ? s[c(s).length] = a : s = e[r] = [e[r], a] : ~o.indexOf("]") ? (o = o.substr(0, o.length - 1), !g.test(o) && l(s) && (s = n(e, r)), i(t, s, o, a)) : (!g.test(o) && l(s) && (s = n(e, r)), i(t, s, o, a))
            } else l(e[r]) ? e[r].push(a) : e[r] = "object" == typeof e[r] ? a : "undefined" == typeof e[r] ? a : [e[r], a]
        }

        function r(t, e, n) {
            if (~e.indexOf("]")) {
                var r = e.split("[");
                i(r, t, "base", n)
            } else {
                if (!g.test(e) && l(t.base)) {
                    var a = {};
                    for (var s in t.base) a[s] = t.base[s];
                    t.base = a
                }
                "" !== e && o(t.base, e, n)
            }
            return t
        }

        function a(t) {
            return u(String(t).split(/&|;/), function(t, e) {
                try {
                    e = decodeURIComponent(e.replace(/\+/g, " "))
                } catch (n) {}
                var i = e.indexOf("="),
                    a = s(e),
                    o = e.substr(0, a || i),
                    u = e.substr(a || i, e.length);
                return u = u.substr(u.indexOf("=") + 1, u.length), "" === o && (o = e, u = ""), r(t, o, u)
            }, {
                base: {}
            }).base
        }

        function o(t, e, n) {
            var i = t[e];
            "undefined" == typeof i ? t[e] = n : l(i) ? i.push(n) : t[e] = [i, n]
        }

        function s(t) {
            for (var e, n, i = t.length, r = 0; i > r; ++r)
                if (n = t[r], "]" == n && (e = !1), "[" == n && (e = !0), "=" == n && !e) return r
        }

        function u(t, e) {
            for (var n = 0, i = t.length >> 0, r = arguments[2]; i > n;) n in t && (r = e.call(void 0, r, t[n], n, t)), ++n;
            return r
        }

        function l(t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        }

        function c(t) {
            var e = [];
            for (var n in t) t.hasOwnProperty(n) && e.push(n);
            return e
        }

        function d(e, n) {
            return 1 === arguments.length && e === !0 && (n = !0, e = void 0), n = n || !1, e = e || window.location.toString(), {
                data: t(e, n),
                attr: function(t) {
                    return t = p[t] || t, "undefined" != typeof t ? this.data.attr[t] : this.data.attr
                },
                param: function(t) {
                    return "undefined" != typeof t ? this.data.param.query[t] : this.data.param.query
                },
                fparam: function(t) {
                    return "undefined" != typeof t ? this.data.param.fragment[t] : this.data.param.fragment
                },
                segment: function(t) {
                    return "undefined" == typeof t ? this.data.seg.path : (t = 0 > t ? this.data.seg.path.length + t : t - 1, this.data.seg.path[t])
                },
                fsegment: function(t) {
                    return "undefined" == typeof t ? this.data.seg.fragment : (t = 0 > t ? this.data.seg.fragment.length + t : t - 1, this.data.seg.fragment[t])
                }
            }
        }
        var h = {
                a: "href",
                img: "src",
                form: "action",
                base: "href",
                script: "src",
                iframe: "src",
                link: "href",
                embed: "src",
                object: "data"
            },
            f = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "fragment"],
            p = {
                anchor: "fragment"
            },
            m = {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            },
            g = /^[0-9]+$/;
        return d.jQuery = function(t) {
            null != t && (t.fn.url = function(n) {
                var i = "";
                return this.length && (i = t(this).attr(e(this[0])) || ""), d(i, n)
            }, t.url = d)
        }, d.jQuery(window.jQuery), d
    }), $(function() {
        setTimeout(changeCurrentTimeLine, 1e3);
        var t = $(".current_time_line");
        if (t) {
            var e = parseInt(t.closest("tr").data("time"));
            $(".programm__schedule__lectures__lecture").each(function(t, n) {
                var i = $(n).data("time-to");
                e > i && e - i > 600 && $(n).addClass("passed")
            })
        }
    });
var changeCurrentTimeLine = function() {
        var t = $(".current_time_line");
        if (t.length) {
            var e, n, i, r, a = parseInt(t.closest("tr").data("time")),
                o = 0;
            $(".programm__schedule tr").each(function(t, n) {
                var i = $(n).data("time");
                i > a && !e && (e = $(n).prev())
            }), e && (i = e.data("time"), n = e.next().data("time"), r = 100 - (n - a) / ((n - i) / 100), o += e.position().top, o += e.height() / 100 * r, o -= t.height(), t.css("top", o + "px"))
        }
    },
    mobileBreakpoint = 900,
    midScreenBreakpoint = 1440;
jQuery(document).ready(function(t) {
        var e = t("#layout"),
            n = t("#overlay"),
            i = t(".popup");
        t("body").on("click", ".open_this", function() {
            t(this).toggleClass("open")
        }), t("body").on("click", ".programm__filter__checkboxs-title", function() {
            t(this).toggleClass("active")
        }), t(window).resize(function() {
            showAdapticTable()
        }), showAdapticTable(), t(window).on("load resize", function() {
            if (check_width(mobileBreakpoint)) {
                var e = {
                    pagingNav: !1,
                    scrollbar: !1,
                    directionNavAutoHide: !1,
                    itemsPerMove: 1,
                    loopItems: !0,
                    directionNav: !0,
                    autoplay: !1,
                    autoplayDelay: 2e3,
                    useWebkit3d: !0,
                    transitionSpeed: 400
                };
                t(".touchcarousel").touchCarousel(e).data("touchCarousel")
            }
        }), t(".touchcarousel-container").each(function() {
            1 == t(this).find("li").length && t(this).parents(".touchcarousel").addClass("touchcarousel--min")
        }), t(document).on("click", ".open_popup", function() {
            open_popup(t(this).data("popup"), e, n)
        }), t(document).on("click", ".close_popup", function() {
            n.click()
        }), n.on("click", function() {
            close_popup(e, n, i)
        })
    }),
    function() {
        startShare42()
    }(), jQuery(document).ready(function(t) {
        function e() {
            t(".feedback_result").each(function(e, i) {
                var r = parseInt(t(i).data("average-result"));
                r && n(r, t(i).closest(".lectures__item_feedback"))
            })
        }

        function n(t, e) {
            var n = e.find(".feedback_button_" + Math.round(t));
            e.find(".feedback_result").html(t), n.addClass("voted"), n.prevAll().addClass("voted"), n.nextAll().removeClass("voted")
        }
        t(".custom_select").fancySelect({
            legacyEvents: !0,
            optionTemplate: function(t) {
                return '<span class="before_select_option" style="background-image: url(\'' + t.data("icon") + '\');"></span><span class="select_option">' + t.text() + "</span>"
            }
        }), t("#filter_user_lectures_by_workshop option[value=" + t.url().param("workshop_id_eq") + "]").prop("selected", !0).trigger("change"), t("#filter_user_lectures_by_workshop").on("change.fs", function() {
            t.ajax({
                url: Routes.user_lectures_path(),
                type: "GET",
                dataType: "script",
                data: {
                    q: {
                        workshop_id_eq: t("#filter_user_lectures_by_workshop option:selected").val()
                    }
                },
                success: function() {
                    startShare42(), window.history.pushState("string", "\u0414\u043e\u043a\u043b\u0430\u0434\u044b 2.0", Routes.user_lectures_path() + "?q[workshop_id_eq]=" + t("#filter_user_lectures_by_workshop option:selected").val())
                }
            })
        }), t("#lectures").on("click", ".sorting a", function() {
            return t.getScript(this.href, function() {
                startShare42()
            }), !1
        }), t(document).on("click", '.voting_button:not(".added")', function() {
            var e = this;
            t.ajax({
                url: Routes.api_lecture_lecture_votings_path(t(this).data("id")),
                type: "POST",
                dataType: "json",
                success: function() {
                    var n = t(e).siblings(".lecture_voting_count");
                    n.html(parseInt(n.html(), 10) + 1), t(e).html("\u0423\u0431\u0440\u0430\u0442\u044c"), t(e).addClass("added"), t(e).siblings(".lecture_added").show()
                }
            })
        }), t(document).on("click", ".voting_button.added", function() {
            var e = this;
            t.ajax({
                url: Routes.api_lecture_lecture_votings_path(t(this).data("id")),
                type: "DELETE",
                dataType: "json",
                success: function() {
                    var n = t(e).siblings(".lecture_voting_count");
                    n.html(parseInt(n.html(), 10) - 1), t(e).html("\u042f \u043f\u043e\u0439\u0434\u0443 \u043d\u0430 \u0434\u043e\u043a\u043b\u0430\u0434"), t(e).removeClass("added"), t(e).siblings(".lecture_added").hide()
                }
            })
        }), e(), t(document).on("mouseover", ".feedback_button", function() {
            var e = t(this);
            e.addClass("hover"), e.prevAll().addClass("hover"), e.nextAll().removeClass("hover")
        }), t(document).on("mouseout", ".lectures__item__adding", function() {
            t(this).find(".feedback_button").removeClass("hover")
        }), t(document).on("click", ".feedback_button", function() {
            var e = t(this).data("value"),
                i = t(this).closest(".lectures__item").data("id"),
                r = t(this).parent();
            t.ajax({
                url: Routes.api_lecture_feedbacks_path(i),
                data: {
                    vote: e
                },
                type: "POST",
                dataType: "json",
                success: function(t) {
                    r.find(".feedback_no_vote_text").hide(), r.find(".feedback_text").show(), n(t.average_feedback_vote, r), r.find(".feedback_success").fadeIn(500), setTimeout(function() {
                        r.find(".feedback_success").fadeOut(500)
                    }, 2e3)
                }
            })
        })
    }), jQuery(document).ready(function(t) {
        t(".custom_select").fancySelect({
            legacyEvents: !0
        }), t("#filter_for_users").on("change.fs", function() {
            return t.getScript(t("#filter_for_users option:selected").data("href")), !1
        }), t("#submit").attr("disabled", !0), t("#privacy").click(function() {
            t("#submit").attr("disabled", !this.checked)
        })
    }),
    function() {
        var t = [].slice;
        window.HAML = function() {
            function e() {}
            return e.escape = function(t) {
                return ("" + t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\//g, "&#47;")
            }, e.cleanValue = function(t) {
                switch (t) {
                    case null:
                    case void 0:
                        return "";
                    case !0:
                    case !1:
                        return "\x93" + t;
                    default:
                        return t
                }
            }, e.extend = function() {
                var e, n, i, r, a, o, s;
                for (n = arguments[0], r = 2 <= arguments.length ? t.call(arguments, 1) : [], o = 0, s = r.length; s > o; o++) {
                    i = r[o];
                    for (e in i) a = i[e], n[e] = a
                }
                return n
            }, e.globals = function() {
                return {}
            }, e.context = function(t) {
                return this.extend({}, e.globals(), t)
            }, e.preserve = function(t) {
                return t.replace(/\n/g, "&#x000A;")
            }, e.findAndPreserve = function(t) {
                var e;
                return e = "textarea,pre".split(",").join("|"), t = t.replace(/\r/g, "").replace(RegExp("<(" + e + ")>([\\s\\S]*?)</\\1>", "g"), function(t, e, n) {
                    return "<" + e + ">" + window.HAML.preserve(n) + "</" + e + ">"
                })
            }, e.surround = function(t, e, n) {
                var i;
                return t + (null != (i = n.call(this)) ? i.replace(/^\s+|\s+$/g, "") : void 0) + e
            }, e.succeed = function(t, e) {
                var n;
                return (null != (n = e.call(this)) ? n.replace(/\s+$/g, "") : void 0) + t
            }, e.precede = function(t, e) {
                var n;
                return t + (null != (n = e.call(this)) ? n.replace(/^\s+/g, "") : void 0)
            }, e.reference = function(t, e) {
                var n, i, r, a;
                return i = e ? e + "_" : "", i += "function" == typeof t.hamlObjectRef ? t.hamlObjectRef() : ((null != (a = t.constructor) ? a.name : void 0) || "object").replace(/\W+/g, "_").replace(/([a-z\d])([A-Z])/g, "$1_$2").toLowerCase(), n = "function" == typeof t.to_key ? t.to_key() : "function" == typeof t.id ? t.id() : t.id ? t.id : t, r = "class='" + i + "'", n ? r += " id='" + i + "_" + n + "'" : void 0
            }, e
        }()
    }.call(this), $(function() {
        if ((!window.pluso || "function" != typeof window.pluso.start) && void 0 == window.ifpluso) {
            window.ifpluso = 1;
            var t = document,
                e = t.createElement("script"),
                n = "getElementsByTagName";
            e.type = "text/javascript", e.charset = "UTF-8", e.async = !0, e.src = ("https:" == window.location.protocol ? "https" : "http") + "://share.pluso.ru/pluso-like.js";
            var i = t[n]("body")[0];
            i.appendChild(e)
        }
    });