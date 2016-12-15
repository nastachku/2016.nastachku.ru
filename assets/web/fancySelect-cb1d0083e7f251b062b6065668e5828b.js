(function(){var e;e=window.jQuery||window.Zepto||window.$,e.fn.fancySelect=function(n){var t,r;return null==n&&(n={}),r=e.extend({forceiOS:!1,includeBlank:!1,optionTemplate:function(e){return e.text()},triggerTemplate:function(e){return e.text()}},n),t=!!navigator.userAgent.match(/iP(hone|od|ad)/i),this.each(function(){var n,s,i,o,a,l,d;return o=e(this),o.hasClass("fancified")||"SELECT"!==o[0].tagName?void 0:(o.addClass("fancified"),o.css({width:1,height:1,display:"block",position:"absolute",top:0,left:0,opacity:0}),o.wrap('<div class="fancy-select">'),d=o.parent(),o.data("class")&&d.addClass(o.data("class")),d.append('<div class="trigger">'),(!t||r.forceiOS)&&d.append('<ul class="options">'),a=d.find(".trigger"),i=d.find(".options"),s=o.prop("disabled"),s&&d.addClass("disabled"),l=function(){var e;return e=r.triggerTemplate(o.find(":selected")),a.html(e)},o.on("blur.fs",function(){return a.hasClass("open")?setTimeout(function(){return a.trigger("close.fs")},120):void 0}),a.on("close.fs",function(){return a.removeClass("open"),i.removeClass("open")}),a.on("click.fs",function(){var n,l;if(!s)if(a.toggleClass("open"),t&&!r.forceiOS){if(a.hasClass("open"))return o.focus()}else if(a.hasClass("open")&&(l=a.parent(),n=l.offsetParent(),l.offset().top+l.outerHeight()+i.outerHeight()+20>e(window).height()+e(window).scrollTop()||i.removeClass("overflowing")),i.toggleClass("open"),!t)return o.focus()}),o.on("enable",function(){return o.prop("disabled",!1),d.removeClass("disabled"),s=!1,n()}),o.on("disable",function(){return o.prop("disabled",!0),d.addClass("disabled"),s=!0}),o.on("change.fs",function(e){return e.originalEvent&&e.originalEvent.isTrusted?e.stopPropagation():l()}),o.on("keydown",function(e){var n,t,r;if(r=e.which,n=i.find(".hover"),n.removeClass("hover"),i.hasClass("open")){if(38===r?(e.preventDefault(),n.length&&n.index()>0?n.prev().addClass("hover"):i.find("li:last-child").addClass("hover")):40===r?(e.preventDefault(),n.length&&n.index()<i.find("li").length-1?n.next().addClass("hover"):i.find("li:first-child").addClass("hover")):27===r?(e.preventDefault(),a.trigger("click.fs")):13===r||32===r?(e.preventDefault(),n.trigger("click.fs")):9===r&&a.hasClass("open")&&a.trigger("close.fs"),t=i.find(".hover"),t.length)return i.scrollTop(0),i.scrollTop(t.position().top-12)}else if(13===r||32===r||38===r||40===r)return e.preventDefault(),a.trigger("click.fs")}),i.on("click.fs","li",function(){var n;return n=e(this),o.val(n.data("raw-value")),t||o.trigger("blur.fs").trigger("focus.fs"),i.find(".selected").removeClass("selected"),n.addClass("selected"),o.val(n.data("raw-value")).trigger("change.fs").trigger("blur.fs").trigger("focus.fs")}),i.on("mouseenter.fs","li",function(){var n,t;return t=e(this),n=i.find(".hover"),n.removeClass("hover"),t.addClass("hover")}),i.on("mouseleave.fs","li",function(){return i.find(".hover").removeClass("hover")}),n=function(){var n;return l(),!t||r.forceiOS?(n=o.find("option"),o.find("option").each(function(n,t){var s;return t=e(t),t.prop("disabled")||!t.val()&&!r.includeBlank?void 0:(s=r.optionTemplate(t),i.append(t.prop("selected")?'<li data-raw-value="'+t.val()+'" class="selected">'+s+"</li>":'<li data-raw-value="'+t.val()+'">'+s+"</li>"))})):void 0},o.on("update.fs",function(){return d.find(".options").empty(),n()}),n())})}}).call(this);