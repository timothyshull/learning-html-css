function FluidRows(e) {
  var t = 1;
  return this.reflowRows = function(n) {
    var i = $(".main_content").width(),
      o = i > 1024 ? 3 : i >= 768 ? 2 : 1;
    if (1 === o && $(".main").hasClass("mobile")) {
      var a = $(".card");
      a.each(function(e, t) {
        $(t).hasClass("advertisement") && ($(t).removeClass("gutter_right"), $(t).parent().removeClass("gutter_left"))
      })
    }
    if (t != o || n) {
      var r = $(".card", e),
        s = $(".row", e),
        l = -1;
      r.each(function(t) {
        0 == t % o && (l++, void 0 == s[l] && ($(".posts", e).append('<div class="row gutter_left"></div>'), s = $(".row", e))), $(s[l]).append($(this).detach())
      }), $(".row", e).each(function() {
        0 == $(".card", this).length && $(this).remove()
      }), t = o, window.displayVerticalCardSlots && window.displayVerticalCardSlots(), gaTracking.attachReflowedPostsHandlers()
    }
  }, this
}

function SoundPlayerManager(e) {
  function t(e) {
    $(e).each(function() {
      n.intializePlayer($(this))
    })
  }
  var n = this,
    i = !1;
  return this.currentTrack = null, this.registerPlayers = function(e) {
    i === !1 ? soundManager.onready(function() {
      i = !0, t(e)
    }) : t(e)
  }, this.intializePlayer = function(e) {
    var t, i = e.data("player-type");
    if (void 0 === e.data("player-obj")) return "soundcloud" === i ? t = new SoundCloudPlayerWrapper(e, n) : console.log("Unsupported player type: " + i), e.data("player-obj", t), t
  }, this.advancePlaylist = function(t) {
    var n = t.parents(".playlist"),
      i = t.next(e);
    return n.length > 0 && i ? (i.data("player-obj").playPause(), !0) : !1
  }, void 0 != e && this.registerPlayers(e), this
}

function ArticlePlayerUI(e) {
  var t = $(".artwork", e),
    n = $(".trackdata", e),
    i = $(".tracktime", e),
    o = this;
  this.setArtwork = function(e) {
    t.css("background-image", "url(" + e.replace("-large", "-t300x300") + ")")
  }, this.bindPlayPause = function(e) {
    t.on("click", e)
  }, this.updateUI = function(e, t) {
    var o = e + "% " + "100%";
    n.css("background-size", o), i && i.text(t)
  }, this.resetUI = function() {
    o.updateUI(0), i && i.text("")
  }
}

function CardPlayerUI(e) {
  var t = $(".artwork", e),
    n = $(".progress_overlay", e);
  this.setArtwork = function(e) {
    t.attr("src", e.replace("-large", "-t500x500"))
  }, this.bindPlayPause = function(e) {
    n.add(t).on("click", e)
  }, this.updateUI = function(e) {
    var t = e + "% " + "100%";
    n.css("background-size", t)
  }, this.resetUI = function() {
    n.attr("style", "")
  }
}

function SoundCloudPlayerWrapper(e, t) {
  function n(e) {
    var t = "http://api.soundcloud.com/resolve?url=http://soundcloud.com",
      n = e.replace(/https?\:\/\/soundcloud\.com/gi, ""),
      i = new jQuery.Deferred;
    return jQuery.ajax({
      url: t + n + "&format=json" + "&consumer_key=" + SOUNDCLOUD_CONSUMER_KEY + "&callback=?",
      dataType: "jsonp",
      error: function(e, t, n) {
        i.reject(e, t, n)
      },
      success: function(e) {
        i.resolve(e)
      }
    }), i
  }

  function i(e) {
    var t = e.stream_url + "?consumer_key=" + SOUNDCLOUD_CONSUMER_KEY;
    u = e, l = soundManager.createSound({
      autoLoad: !1,
      id: "track_" + TRACKUID++,
      multiShot: !1,
      loops: 1,
      url: t,
      volume: 100,
      whileplaying: function() {
        var e = Math.round(10 * 100 * (l.position / u.duration)) / 10;
        r(e)
      },
      onfinish: s
    }), p.setArtwork(u.artwork_url), p.bindPlayPause(f.playPause)
  }

  function o() {
    var e = l.position,
      t = Math.floor(e / 1e3 % 60),
      n = Math.floor(e / 6e4 % 60),
      i = Math.floor(e / 36e5 % 24),
      o = a(n) + ":" + a(t);
    return i > 0 && (o = i + ":" + o), o
  }

  function a(e) {
    return (10 > e ? "0" : "") + e
  }

  function r(e) {
    e != h && (h = e, p.updateUI(e, o()))
  }

  function s() {
    t.advancePlaylist(e)
  }
  var l, c = e.data("soundcloud-src"),
    u = null,
    d = e.data("player-ui"),
    p = null,
    h = 0,
    f = this;
  if ("article" === d) p = new ArticlePlayerUI(e);
  else {
    if ("card" !== d) return console.log("Unsupported ui type: " + d), void 0;
    p = new CardPlayerUI(e)
  }
  return n(c).done(i), this.play = function() {
    l.play(), t.currentTrack = f, e.addClass("playing"), e.addClass("current")
  }, this.stop = function() {
    l.stop(), p.resetUI(), e.removeClass("playing"), e.removeClass("current")
  }, this.pause = function() {
    l.pause(), e.removeClass("playing")
  }, this.playPause = function() {
    return 1 != l.playState || l.paused ? (null != t.currentTrack && t.currentTrack != f && t.currentTrack.stop(), f.play()) : f.pause(), !1
  }, this.seek = function(e) {
    var t = Math.round(u.duration * e);
    l.setPosition(t)
  }, this
}

function SoundPlayerManager(e) {
  function t(e) {
    $(e).each(function() {
      n.intializePlayer($(this))
    })
  }
  var n = this,
    i = !1;
  return this.currentTrack = null, this.registerPlayers = function(e) {
    i === !1 ? soundManager.onready(function() {
      i = !0, t(e)
    }) : t(e)
  }, this.intializePlayer = function(e) {
    var t, i = e.data("player-type");
    if (void 0 === e.data("player-obj")) return "soundcloud" === i && (t = new SoundCloudPlayerWrapper(e, n)), e.data("player-obj", t), t
  }, this.next = function() {
    var e = n.getNextTrack();
    return !e && n.allowPlaylistLoop() && (e = n.getFirstTrack()), e.length > 0 ? e.data("player-obj").playPause() : n.currentTrack.stop(), e
  }, this.prev = function() {
    var e = n.getPrevTrack();
    return e && e.data("player-obj").playPause(), e
  }, this.pause = function() {
    n.currentTrack && n.currentTrack.pause()
  }, this.play = function() {
    n.currentTrack && n.currentTrack.playPause()
  }, this.allowPlaylistLoop = function() {
    if (n.currentTrack) {
      var e = n.currentTrack.element,
        t = e.parents(".playlist");
      return t.data("allow-playlist-loop")
    }
  }, this.getFirstTrack = function() {
    if (n.currentTrack) {
      var t = n.currentTrack.element,
        i = t.parents(".playlist"),
        o = i.find(e).first();
      return o
    }
  }, this.getNextTrack = function() {
    if (n.currentTrack) {
      var t = n.currentTrack.element,
        i = (t.parents(".playlist"), t.next(e));
      return i.length ? i : !1
    }
  }, this.getPrevTrack = function() {
    if (n.currentTrack) {
      var t = n.currentTrack.element,
        i = (t.parents(".playlist"), t.prev(e));
      return i.length ? i : !1
    }
  }, this.removeDetachedTrack = function(t) {
    if (n.currentTrack) {
      var i, o = $("#fader_radio .playlist");
      i = t ? o.find(e).filter(".detached") : o.find(e).filter(".detached:not(.current)"), i.length > 0 && i.remove()
    }
  }, this.attachToRadio = function() {
    var e = $("script", n.currentTrack.element).html(),
      t = $(e);
    n.removeDetachedTrack();
    var i = n.intializePlayer(t);
    faderRadio.prepend(t), n.currentTrack.setSlave(i)
  }, this.bindUIEvents = function() {
    $(document).on("radio:next", this.next), $(document).on("radio:prev", this.prev), $(document).on("radio:pause", this.pause), $(document).on("radio:play", this.play)
  }, void 0 != e && this.registerPlayers(e), this
}

function ArticlePlayerUI(e) {
  var t = $(".artwork", e),
    n = $(".trackdata", e),
    i = $(".tracktime", e),
    o = this;
  this.setArtwork = function(e) {
    t.css("background-image", "url(" + e + ")")
  }, this.bindPlayPause = function(e) {
    t.on("click", e)
  }, this.updateUI = function(e, t) {
    var o = e + "% " + "100%";
    n.css("background-size", o), i && i.text(t)
  }, this.resetUI = function() {
    o.updateUI(0), i && i.text("")
  }
}

function RadioPlayerUI(e) {
  var t = $(".artwork", e),
    n = $(".large_artwork", e),
    i = $(".trackdata", e),
    o = $(".tracktime", e),
    a = this;
  this.setArtwork = function(e, i) {
    t.css("background-image", "url(" + e + ")"), $("img", n).attr("src", i)
  }, this.bindPlayPause = function(e) {
    t.on("click", e), i.on("click", e)
  }, this.updateUI = function(e, t) {
    var n = e + "% " + "100%";
    i.css("background-size", n), o && o.text(t)
  }, this.resetUI = function() {
    a.updateUI(0), o && o.text("")
  }
}

function CardPlayerUI(e) {
  var t = $(".artwork", e),
    n = $(".progress_overlay", e);
  this.setArtwork = function(e, n) {
    t.attr("src", n)
  }, this.bindPlayPause = function(e) {
    n.add(t).on("click", e)
  }, this.updateUI = function(e) {
    var t = e + "% " + "100%";
    n.css("background-size", t)
  }, this.resetUI = function() {
    n.attr("style", "")
  }
}

function SoundCloudPlayerWrapper(e, t) {
  function n(e) {
    var t = "http://api.soundcloud.com/resolve?url=http://soundcloud.com",
      n = e.replace(/https?\:\/\/soundcloud\.com/gi, ""),
      i = new $.Deferred;
    return $.ajax({
      url: t + n + "&format=json" + "&consumer_key=" + SOUNDCLOUD_CONSUMER_KEY + "&callback=?",
      dataType: "jsonp",
      crossDomain: !0,
      error: function(e, t, n) {
        i.reject(e, t, n)
      },
      success: function(e) {
        i.resolve(e)
      }
    }), i
  }

  function i(e) {
    d = {
      stream_url: e.stream_url + "?consumer_key=" + SOUNDCLOUD_CONSUMER_KEY,
      small_artwork_url: e.artwork_url.replace("-large", "-t300x300"),
      large_artwork_url: e.artwork_url.replace("-large", "-t500x500"),
      duration: e.duration
    }, a(d)
  }

  function o() {
    d = {
      stream_url: e.data("stream-url"),
      small_artwork_url: e.data("small-artwork-url"),
      large_artwork_url: e.data("large-artwork-url"),
      duration: e.data("duration")
    }, a(d)
  }

  function a(e) {
    c = soundManager.createSound({
      autoLoad: !1,
      id: "track_" + TRACKUID++,
      multiShot: !1,
      loops: 1,
      url: e.stream_url,
      volume: 100,
      whileplaying: function() {
        var e = Math.round(10 * 100 * (c.position / d.duration)) / 10;
        g(e)
      },
      onfinish: l
    }), h.setArtwork(e.small_artwork_url, e.large_artwork_url), h.bindPlayPause(m.playPause)
  }

  function r() {
    var e = c.position,
      t = Math.floor(e / 1e3 % 60),
      n = Math.floor(e / 6e4 % 60),
      i = Math.floor(e / 36e5 % 24),
      o = s(n) + ":" + s(t);
    return i > 0 && (o = i + ":" + o), o
  }

  function s(e) {
    return (10 > e ? "0" : "") + e
  }

  function l() {
    t.next()
  }
  var c, u = e.data("soundcloud-src"),
    d = null,
    p = e.data("player-ui"),
    h = null,
    f = 0,
    m = this;
  this.element = e;
  var g = this.updateUIPosition = function(e) {
    e != f && (f = e, h.updateUI(e, r())), m.slave && m.slave.updateUIPosition(e)
  };
  if (this.resetUIPosition = function() {
      h.resetUI(), m.slave && m.slave.resetUIPosition()
    }, this.play = function() {
      return m.master ? m.master.play() : (mediaManager.pauseNonRadioMedia(), c.play(), t.currentTrack = m, e.addClass("playing"), e.addClass("current"), t.removeDetachedTrack(), "radio" == e.data("player-ui") || this.slave || this.master || t.attachToRadio(), m.slave && (m.slave.element.addClass("playing"), m.slave.element.addClass("current")), void 0)
    }, this.stop = function() {
      return m.master ? m.master.stop() : (c.stop(), h.resetUI(), e.removeClass("playing"), e.removeClass("current"), m.slave && m.slave.element.remove(), m.slave = m.master = null, void 0)
    }, this.pause = function() {
      return m.master ? m.master.pause() : (c.pause(), e.removeClass("playing"), m.slave && m.slave.element.removeClass("playing"), void 0)
    }, this.playPause = function() {
      return m.master ? m.master.playPause() : (1 != c.playState || c.paused ? (null != t.currentTrack && t.currentTrack != m && t.currentTrack.stop(), m.play()) : m.pause(), !1)
    }, this.setSlave = function(e) {
      this.slave = e, e && e.setMaster(this)
    }, this.setMaster = function(e) {
      this.master = e
    }, this.seek = function(e) {
      if (m.master) return m.master.seek(e);
      var t = Math.round(d.duration * e);
      c.setPosition(t)
    }, "article" === p) h = new ArticlePlayerUI(e);
  else if ("card" === p) h = new CardPlayerUI(e);
  else {
    if ("radio" !== p) return;
    h = new RadioPlayerUI(e)
  }
  return void 0 != e.data("stream-url") ? o() : n(u).done(i), this
}

function globalOnPageLoadCallback() {
  fixLegacyPostContentRelativeUrls(), setTimeout(hideLegacySlideshows, 2e3), setTimeout(fitVidsInstagramVideos, 5e3), $("#sitewide_livestream").fitVids({
    customSelector: "iframe[src^='//new.livestream.com']"
  })
}

function fitVidsInstagramVideos() {
  $(".legacy_post_content").fitVids({
    customSelector: "iframe[src^='//instagram.com']"
  }), $(".content_blocks").fitVids({
    customSelector: "iframe[src^='//instagram.com']"
  })
}

function hideLegacySlideshows() {
  $(".legacy_post_content .slideshow").hide()
}

function fixLegacyPostContentRelativeUrls() {
  $(".legacy_post_content img").each(function() {
    var e = $(this).attr("src");
    if (!e.match(/^http.*/)) {
      var t = window.absolutePath(e);
      $(this).attr("src", t)
    }
  })
}

function displayAdSlot(e, t, n) {
  googletag.cmd.push(function() {
    var i = (new Date).getTime(),
      o = e + "-" + i;
    $("#" + e).attr("id", o);
    var a = googletag.defineSlot("/1081121/" + t, n, o).addService(googletag.pubads());
    googletag.display(o), googletag.pubads().refresh([a])
  })
}

function pushAdSlot(e, t, n) {
  var i = (new Date).getTime(),
    o = e + "-" + i;
  $("#" + e).attr("id", o), window.ad_slots_queue[o] = t, googletag.cmd.push(function() {
    var e = googletag.defineSlot("/1081121/" + t, n, o).addService(googletag.pubads());
    window.ad_slots_queue[o] = e
  })
}

function displayVerticalCardSlots() {
  Object.keys(window.ad_slots_queue);
  for (var e in window.ad_slots_queue)
    if (e.match("div-vertical-card")) {
      var t = window.ad_slots_queue[e];
      googletag.cmd.push(function() {
        googletag.display(e), googletag.pubads().refresh([t])
      })
    }
  refreshVerticalCardSlots();
  for (var e in window.ad_slots_queue)
    if (e.match("div-vertical-card")) {
      var t = window.ad_slots_queue[e];
      window.ad_slots[e] = t, delete window.ad_slots_queue[e]
    }
}

function refreshVerticalCardSlots() {
  Object.keys(window.ad_slots);
  for (var e in window.ad_slots)
    if (e.match("div-vertical-card"))
      if ($("#" + e).length > 0) {
        var t = window.ad_slots[e];
        googletag.cmd.push(function() {
          googletag.pubads().refresh([t])
        })
      } else delete window.ad_slots[e]
}

function makeLeaderboardAdResponsive() {}

function copyLeaderboardAd() {
  var e = $(".top-ad .ad-container iframe").first(),
    t = e.contents(),
    n = t.find("a");
  if (null != n.width()) {
    if (n.width() <= 729) return $(".top-ad").addClass("banner_ad"), clearInterval(window.leaderboard_ad_loading), void 0;
    $(".top-ad").removeClass("banner_ad");
    var i = n.parent();
    i.css("width", "100%"), i.css("height", "auto");
    var o = n.find("img");
    o.css("width", "100%"), o.css("height", "auto"), e.css("width", "100%"), clearInterval(window.leaderboard_ad_loading), window.leaderboard_ad_height_fixing = setInterval(fixLeaderboardAdHeight, 1e3)
  }
}

function fixLeaderboardAdHeight() {
  var e = $(".top-ad .ad-container iframe").first(),
    t = $(".top-ad .ad-container iframe").first().contents(),
    n = t.find("a"),
    i = n.find("img");
  i.width() > 728 && i.height() > 0 && (e.height(i.height()), clearInterval(window.leaderboard_ad_height_fixing))
}

function makeFullPageAdResponsive(e) {
  return
}

function copyFullPageAd(e) {
  console.log("copying full page ad: " + e);
  var t = e + "_loading",
    n = $("#" + e + " iframe").first(),
    i = n.contents(),
    o = i.find("a"),
    a = o.find("img");
  if (console.log(a[0]), a[0]) {
    if (console.log("width: " + o.width()), o.width() <= 729) return console.log("full page ad is not responsive, kill responsive setup"), $("#" + e).closest(".parallax_ad").removeClass("parallax_ad").addClass("banner_ad"), clearInterval(window[t]), void 0;
    a.css("width", "100%"), a.css("height", "auto"), $("#" + e).closest(".parallax_ad").css("background-image", "url(" + a.attr("src") + ")"), n.css("width", "100%"), fixFullPageAdHeight(), parallaxAdModule = new ParallaxAdModule, clearInterval(window[t])
  }
}

function fixFullPageAdHeight() {
  $(".full_width_ad").each(function(e, t) {
    var n = $("iframe", $(t)).first(),
      i = $("iframe", $(t)).first().contents(),
      o = i.find("a"),
      a = o.find("img");
    n.height(a.height())
  })
}

function replaceLeaderboardAd() {
  var e = (new Date).getTime(),
    t = "<div class='leaderboard-ad' id='div-leaderboard-ad-" + e + "'></div>";
  $(".leaderboard-ad").replaceWith(t), displayAdSlot("div-leaderboard-ad-" + e, "fader_v3_sitewide_top", [1440, 178]), makeLeaderboardAdResponsive()
}

function allowAjaxOnUrl(e) {
    for (var t = 0; t < ajaxURLs.length; t++)
      if (e.match(ajaxURLs[t])) return !0
  }! function(e, t) {
    function n(e) {
      var t = e.length,
        n = ut.type(e);
      return ut.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || "function" !== n && (0 === t || "number" == typeof t && t > 0 && t - 1 in e)
    }

    function i(e) {
      var t = Tt[e] = {};
      return ut.each(e.match(pt) || [], function(e, n) {
        t[n] = !0
      }), t
    }

    function o(e, n, i, o) {
      if (ut.acceptData(e)) {
        var a, r, s = ut.expando,
          l = e.nodeType,
          c = l ? ut.cache : e,
          u = l ? e[s] : e[s] && s;
        if (u && c[u] && (o || c[u].data) || i !== t || "string" != typeof n) return u || (u = l ? e[s] = tt.pop() || ut.guid++ : s), c[u] || (c[u] = l ? {} : {
          toJSON: ut.noop
        }), ("object" == typeof n || "function" == typeof n) && (o ? c[u] = ut.extend(c[u], n) : c[u].data = ut.extend(c[u].data, n)), r = c[u], o || (r.data || (r.data = {}), r = r.data), i !== t && (r[ut.camelCase(n)] = i), "string" == typeof n ? (a = r[n], null == a && (a = r[ut.camelCase(n)])) : a = r, a
      }
    }

    function a(e, t, n) {
      if (ut.acceptData(e)) {
        var i, o, a = e.nodeType,
          r = a ? ut.cache : e,
          l = a ? e[ut.expando] : ut.expando;
        if (r[l]) {
          if (t && (i = n ? r[l] : r[l].data)) {
            ut.isArray(t) ? t = t.concat(ut.map(t, ut.camelCase)) : t in i ? t = [t] : (t = ut.camelCase(t), t = t in i ? [t] : t.split(" ")), o = t.length;
            for (; o--;) delete i[t[o]];
            if (n ? !s(i) : !ut.isEmptyObject(i)) return
          }(n || (delete r[l].data, s(r[l]))) && (a ? ut.cleanData([e], !0) : ut.support.deleteExpando || r != r.window ? delete r[l] : r[l] = null)
        }
      }
    }

    function r(e, n, i) {
      if (i === t && 1 === e.nodeType) {
        var o = "data-" + n.replace(Ct, "-$1").toLowerCase();
        if (i = e.getAttribute(o), "string" == typeof i) {
          try {
            i = "true" === i ? !0 : "false" === i ? !1 : "null" === i ? null : +i + "" === i ? +i : kt.test(i) ? ut.parseJSON(i) : i
          } catch (a) {}
          ut.data(e, n, i)
        } else i = t
      }
      return i
    }

    function s(e) {
      var t;
      for (t in e)
        if (("data" !== t || !ut.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
      return !0
    }

    function l() {
      return !0
    }

    function c() {
      return !1
    }

    function u() {
      try {
        return Q.activeElement
      } catch (e) {}
    }

    function d(e, t) {
      do e = e[t]; while (e && 1 !== e.nodeType);
      return e
    }

    function p(e, t, n) {
      if (ut.isFunction(t)) return ut.grep(e, function(e, i) {
        return !!t.call(e, i, e) !== n
      });
      if (t.nodeType) return ut.grep(e, function(e) {
        return e === t !== n
      });
      if ("string" == typeof t) {
        if (zt.test(t)) return ut.filter(t, e, n);
        t = ut.filter(t, e)
      }
      return ut.grep(e, function(e) {
        return ut.inArray(e, t) >= 0 !== n
      })
    }

    function h(e) {
      var t = Xt.split("|"),
        n = e.createDocumentFragment();
      if (n.createElement)
        for (; t.length;) n.createElement(t.pop());
      return n
    }

    function f(e, t) {
      return ut.nodeName(e, "table") && ut.nodeName(1 === t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function m(e) {
      return e.type = (null !== ut.find.attr(e, "type")) + "/" + e.type, e
    }

    function g(e) {
      var t = an.exec(e.type);
      return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function v(e, t) {
      for (var n, i = 0; null != (n = e[i]); i++) ut._data(n, "globalEval", !t || ut._data(t[i], "globalEval"))
    }

    function y(e, t) {
      if (1 === t.nodeType && ut.hasData(e)) {
        var n, i, o, a = ut._data(e),
          r = ut._data(t, a),
          s = a.events;
        if (s) {
          delete r.handle, r.events = {};
          for (n in s)
            for (i = 0, o = s[n].length; o > i; i++) ut.event.add(t, n, s[n][i])
        }
        r.data && (r.data = ut.extend({}, r.data))
      }
    }

    function w(e, t) {
      var n, i, o;
      if (1 === t.nodeType) {
        if (n = t.nodeName.toLowerCase(), !ut.support.noCloneEvent && t[ut.expando]) {
          o = ut._data(t);
          for (i in o.events) ut.removeEvent(t, i, o.handle);
          t.removeAttribute(ut.expando)
        }
        "script" === n && t.text !== e.text ? (m(t).text = e.text, g(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), ut.support.html5Clone && e.innerHTML && !ut.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && tn.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
      }
    }

    function b(e, n) {
      var i, o, a = 0,
        r = typeof e.getElementsByTagName !== V ? e.getElementsByTagName(n || "*") : typeof e.querySelectorAll !== V ? e.querySelectorAll(n || "*") : t;
      if (!r)
        for (r = [], i = e.childNodes || e; null != (o = i[a]); a++) !n || ut.nodeName(o, n) ? r.push(o) : ut.merge(r, b(o, n));
      return n === t || n && ut.nodeName(e, n) ? ut.merge([e], r) : r
    }

    function _(e) {
      tn.test(e.type) && (e.defaultChecked = e.checked)
    }

    function x(e, t) {
      if (t in e) return t;
      for (var n = t.charAt(0).toUpperCase() + t.slice(1), i = t, o = Tn.length; o--;)
        if (t = Tn[o] + n, t in e) return t;
      return i
    }

    function $(e, t) {
      return e = t || e, "none" === ut.css(e, "display") || !ut.contains(e.ownerDocument, e)
    }

    function S(e, t) {
      for (var n, i, o, a = [], r = 0, s = e.length; s > r; r++) i = e[r], i.style && (a[r] = ut._data(i, "olddisplay"), n = i.style.display, t ? (a[r] || "none" !== n || (i.style.display = ""), "" === i.style.display && $(i) && (a[r] = ut._data(i, "olddisplay", E(i.nodeName)))) : a[r] || (o = $(i), (n && "none" !== n || !o) && ut._data(i, "olddisplay", o ? n : ut.css(i, "display"))));
      for (r = 0; s > r; r++) i = e[r], i.style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? a[r] || "" : "none"));
      return e
    }

    function T(e, t, n) {
      var i = yn.exec(t);
      return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t
    }

    function k(e, t, n, i, o) {
      for (var a = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, r = 0; 4 > a; a += 2) "margin" === n && (r += ut.css(e, n + Sn[a], !0, o)), i ? ("content" === n && (r -= ut.css(e, "padding" + Sn[a], !0, o)), "margin" !== n && (r -= ut.css(e, "border" + Sn[a] + "Width", !0, o))) : (r += ut.css(e, "padding" + Sn[a], !0, o), "padding" !== n && (r += ut.css(e, "border" + Sn[a] + "Width", !0, o)));
      return r
    }

    function C(e, t, n) {
      var i = !0,
        o = "width" === t ? e.offsetWidth : e.offsetHeight,
        a = dn(e),
        r = ut.support.boxSizing && "border-box" === ut.css(e, "boxSizing", !1, a);
      if (0 >= o || null == o) {
        if (o = pn(e, t, a), (0 > o || null == o) && (o = e.style[t]), wn.test(o)) return o;
        i = r && (ut.support.boxSizingReliable || o === e.style[t]), o = parseFloat(o) || 0
      }
      return o + k(e, t, n || (r ? "border" : "content"), i, a) + "px"
    }

    function E(e) {
      var t = Q,
        n = _n[e];
      return n || (n = P(e, t), "none" !== n && n || (un = (un || ut("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(t.documentElement), t = (un[0].contentWindow || un[0].contentDocument).document, t.write("<!doctype html><html><body>"), t.close(), n = P(e, t), un.detach()), _n[e] = n), n
    }

    function P(e, t) {
      var n = ut(t.createElement(e)).appendTo(t.body),
        i = ut.css(n[0], "display");
      return n.remove(), i
    }

    function M(e, t, n, i) {
      var o;
      if (ut.isArray(t)) ut.each(t, function(t, o) {
        n || Cn.test(e) ? i(e, o) : M(e + "[" + ("object" == typeof o ? t : "") + "]", o, n, i)
      });
      else if (n || "object" !== ut.type(t)) i(e, t);
      else
        for (o in t) M(e + "[" + o + "]", t[o], n, i)
    }

    function H(e) {
      return function(t, n) {
        "string" != typeof t && (n = t, t = "*");
        var i, o = 0,
          a = t.toLowerCase().match(pt) || [];
        if (ut.isFunction(n))
          for (; i = a[o++];) "+" === i[0] ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
      }
    }

    function L(e, t, n, i) {
      function o(s) {
        var l;
        return a[s] = !0, ut.each(e[s] || [], function(e, s) {
          var c = s(t, n, i);
          return "string" != typeof c || r || a[c] ? r ? !(l = c) : void 0 : (t.dataTypes.unshift(c), o(c), !1)
        }), l
      }
      var a = {},
        r = e === Un;
      return o(t.dataTypes[0]) || !a["*"] && o("*")
    }

    function D(e, n) {
      var i, o, a = ut.ajaxSettings.flatOptions || {};
      for (o in n) n[o] !== t && ((a[o] ? e : i || (i = {}))[o] = n[o]);
      return i && ut.extend(!0, e, i), e
    }

    function O(e, n, i) {
      for (var o, a, r, s, l = e.contents, c = e.dataTypes;
        "*" === c[0];) c.shift(), a === t && (a = e.mimeType || n.getResponseHeader("Content-Type"));
      if (a)
        for (s in l)
          if (l[s] && l[s].test(a)) {
            c.unshift(s);
            break
          }
      if (c[0] in i) r = c[0];
      else {
        for (s in i) {
          if (!c[0] || e.converters[s + " " + c[0]]) {
            r = s;
            break
          }
          o || (o = s)
        }
        r = r || o
      }
      return r ? (r !== c[0] && c.unshift(r), i[r]) : void 0
    }

    function N(e, t, n, i) {
      var o, a, r, s, l, c = {},
        u = e.dataTypes.slice();
      if (u[1])
        for (r in e.converters) c[r.toLowerCase()] = e.converters[r];
      for (a = u.shift(); a;)
        if (e.responseFields[a] && (n[e.responseFields[a]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = a, a = u.shift())
          if ("*" === a) a = l;
          else if ("*" !== l && l !== a) {
        if (r = c[l + " " + a] || c["* " + a], !r)
          for (o in c)
            if (s = o.split(" "), s[1] === a && (r = c[l + " " + s[0]] || c["* " + s[0]])) {
              r === !0 ? r = c[o] : c[o] !== !0 && (a = s[0], u.unshift(s[1]));
              break
            }
        if (r !== !0)
          if (r && e["throws"]) t = r(t);
          else try {
            t = r(t)
          } catch (d) {
            return {
              state: "parsererror",
              error: r ? d : "No conversion from " + l + " to " + a
            }
          }
      }
      return {
        state: "success",
        data: t
      }
    }

    function I() {
      try {
        return new e.XMLHttpRequest
      } catch (t) {}
    }

    function A() {
      try {
        return new e.ActiveXObject("Microsoft.XMLHTTP")
      } catch (t) {}
    }

    function j() {
      return setTimeout(function() {
        Zn = t
      }), Zn = ut.now()
    }

    function F(e, t, n) {
      for (var i, o = (ai[t] || []).concat(ai["*"]), a = 0, r = o.length; r > a; a++)
        if (i = o[a].call(n, t, e)) return i
    }

    function R(e, t, n) {
      var i, o, a = 0,
        r = oi.length,
        s = ut.Deferred().always(function() {
          delete l.elem
        }),
        l = function() {
          if (o) return !1;
          for (var t = Zn || j(), n = Math.max(0, c.startTime + c.duration - t), i = n / c.duration || 0, a = 1 - i, r = 0, l = c.tweens.length; l > r; r++) c.tweens[r].run(a);
          return s.notifyWith(e, [c, a, n]), 1 > a && l ? n : (s.resolveWith(e, [c]), !1)
        },
        c = s.promise({
          elem: e,
          props: ut.extend({}, t),
          opts: ut.extend(!0, {
            specialEasing: {}
          }, n),
          originalProperties: t,
          originalOptions: n,
          startTime: Zn || j(),
          duration: n.duration,
          tweens: [],
          createTween: function(t, n) {
            var i = ut.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
            return c.tweens.push(i), i
          },
          stop: function(t) {
            var n = 0,
              i = t ? c.tweens.length : 0;
            if (o) return this;
            for (o = !0; i > n; n++) c.tweens[n].run(1);
            return t ? s.resolveWith(e, [c, t]) : s.rejectWith(e, [c, t]), this
          }
        }),
        u = c.props;
      for (B(u, c.opts.specialEasing); r > a; a++)
        if (i = oi[a].call(c, e, u, c.opts)) return i;
      return ut.map(u, F, c), ut.isFunction(c.opts.start) && c.opts.start.call(e, c), ut.fx.timer(ut.extend(l, {
        elem: e,
        anim: c,
        queue: c.opts.queue
      })), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
    }

    function B(e, t) {
      var n, i, o, a, r;
      for (n in e)
        if (i = ut.camelCase(n), o = t[i], a = e[n], ut.isArray(a) && (o = a[1], a = e[n] = a[0]), n !== i && (e[i] = a, delete e[n]), r = ut.cssHooks[i], r && "expand" in r) {
          a = r.expand(a), delete e[i];
          for (n in a) n in e || (e[n] = a[n], t[n] = o)
        } else t[i] = o
    }

    function z(e, t, n) {
      var i, o, a, r, s, l, c = this,
        u = {},
        d = e.style,
        p = e.nodeType && $(e),
        h = ut._data(e, "fxshow");
      n.queue || (s = ut._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, l = s.empty.fire, s.empty.fire = function() {
        s.unqueued || l()
      }), s.unqueued++, c.always(function() {
        c.always(function() {
          s.unqueued--, ut.queue(e, "fx").length || s.empty.fire()
        })
      })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [d.overflow, d.overflowX, d.overflowY], "inline" === ut.css(e, "display") && "none" === ut.css(e, "float") && (ut.support.inlineBlockNeedsLayout && "inline" !== E(e.nodeName) ? d.zoom = 1 : d.display = "inline-block")), n.overflow && (d.overflow = "hidden", ut.support.shrinkWrapBlocks || c.always(function() {
        d.overflow = n.overflow[0], d.overflowX = n.overflow[1], d.overflowY = n.overflow[2]
      }));
      for (i in t)
        if (o = t[i], ti.exec(o)) {
          if (delete t[i], a = a || "toggle" === o, o === (p ? "hide" : "show")) continue;
          u[i] = h && h[i] || ut.style(e, i)
        }
      if (!ut.isEmptyObject(u)) {
        h ? "hidden" in h && (p = h.hidden) : h = ut._data(e, "fxshow", {}), a && (h.hidden = !p), p ? ut(e).show() : c.done(function() {
          ut(e).hide()
        }), c.done(function() {
          var t;
          ut._removeData(e, "fxshow");
          for (t in u) ut.style(e, t, u[t])
        });
        for (i in u) r = F(p ? h[i] : 0, i, c), i in h || (h[i] = r.start, p && (r.end = r.start, r.start = "width" === i || "height" === i ? 1 : 0))
      }
    }

    function q(e, t, n, i, o) {
      return new q.prototype.init(e, t, n, i, o)
    }

    function U(e, t) {
      var n, i = {
          height: e
        },
        o = 0;
      for (t = t ? 1 : 0; 4 > o; o += 2 - t) n = Sn[o], i["margin" + n] = i["padding" + n] = e;
      return t && (i.opacity = i.width = e), i
    }

    function W(e) {
      return ut.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
    }
    var X, Y, V = typeof t,
      G = e.location,
      Q = e.document,
      K = Q.documentElement,
      J = e.jQuery,
      Z = e.$,
      et = {},
      tt = [],
      nt = "1.10.2",
      it = tt.concat,
      ot = tt.push,
      at = tt.slice,
      rt = tt.indexOf,
      st = et.toString,
      lt = et.hasOwnProperty,
      ct = nt.trim,
      ut = function(e, t) {
        return new ut.fn.init(e, t, Y)
      },
      dt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
      pt = /\S+/g,
      ht = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
      ft = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
      mt = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
      gt = /^[\],:{}\s]*$/,
      vt = /(?:^|:|,)(?:\s*\[)+/g,
      yt = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
      wt = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
      bt = /^-ms-/,
      _t = /-([\da-z])/gi,
      xt = function(e, t) {
        return t.toUpperCase()
      },
      $t = function(e) {
        (Q.addEventListener || "load" === e.type || "complete" === Q.readyState) && (St(), ut.ready())
      },
      St = function() {
        Q.addEventListener ? (Q.removeEventListener("DOMContentLoaded", $t, !1), e.removeEventListener("load", $t, !1)) : (Q.detachEvent("onreadystatechange", $t), e.detachEvent("onload", $t))
      };
    ut.fn = ut.prototype = {
        jquery: nt,
        constructor: ut,
        init: function(e, n, i) {
          var o, a;
          if (!e) return this;
          if ("string" == typeof e) {
            if (o = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : ft.exec(e), !o || !o[1] && n) return !n || n.jquery ? (n || i).find(e) : this.constructor(n).find(e);
            if (o[1]) {
              if (n = n instanceof ut ? n[0] : n, ut.merge(this, ut.parseHTML(o[1], n && n.nodeType ? n.ownerDocument || n : Q, !0)), mt.test(o[1]) && ut.isPlainObject(n))
                for (o in n) ut.isFunction(this[o]) ? this[o](n[o]) : this.attr(o, n[o]);
              return this
            }
            if (a = Q.getElementById(o[2]), a && a.parentNode) {
              if (a.id !== o[2]) return i.find(e);
              this.length = 1, this[0] = a
            }
            return this.context = Q, this.selector = e, this
          }
          return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : ut.isFunction(e) ? i.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), ut.makeArray(e, this))
        },
        selector: "",
        length: 0,
        toArray: function() {
          return at.call(this)
        },
        get: function(e) {
          return null == e ? this.toArray() : 0 > e ? this[this.length + e] : this[e]
        },
        pushStack: function(e) {
          var t = ut.merge(this.constructor(), e);
          return t.prevObject = this, t.context = this.context, t
        },
        each: function(e, t) {
          return ut.each(this, e, t)
        },
        ready: function(e) {
          return ut.ready.promise().done(e), this
        },
        slice: function() {
          return this.pushStack(at.apply(this, arguments))
        },
        first: function() {
          return this.eq(0)
        },
        last: function() {
          return this.eq(-1)
        },
        eq: function(e) {
          var t = this.length,
            n = +e + (0 > e ? t : 0);
          return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        },
        map: function(e) {
          return this.pushStack(ut.map(this, function(t, n) {
            return e.call(t, n, t)
          }))
        },
        end: function() {
          return this.prevObject || this.constructor(null)
        },
        push: ot,
        sort: [].sort,
        splice: [].splice
      }, ut.fn.init.prototype = ut.fn, ut.extend = ut.fn.extend = function() {
        var e, n, i, o, a, r, s = arguments[0] || {},
          l = 1,
          c = arguments.length,
          u = !1;
        for ("boolean" == typeof s && (u = s, s = arguments[1] || {}, l = 2), "object" == typeof s || ut.isFunction(s) || (s = {}), c === l && (s = this, --l); c > l; l++)
          if (null != (a = arguments[l]))
            for (o in a) e = s[o], i = a[o], s !== i && (u && i && (ut.isPlainObject(i) || (n = ut.isArray(i))) ? (n ? (n = !1, r = e && ut.isArray(e) ? e : []) : r = e && ut.isPlainObject(e) ? e : {}, s[o] = ut.extend(u, r, i)) : i !== t && (s[o] = i));
        return s
      }, ut.extend({
        expando: "jQuery" + (nt + Math.random()).replace(/\D/g, ""),
        noConflict: function(t) {
          return e.$ === ut && (e.$ = Z), t && e.jQuery === ut && (e.jQuery = J), ut
        },
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
          e ? ut.readyWait++ : ut.ready(!0)
        },
        ready: function(e) {
          if (e === !0 ? !--ut.readyWait : !ut.isReady) {
            if (!Q.body) return setTimeout(ut.ready);
            ut.isReady = !0, e !== !0 && --ut.readyWait > 0 || (X.resolveWith(Q, [ut]), ut.fn.trigger && ut(Q).trigger("ready").off("ready"))
          }
        },
        isFunction: function(e) {
          return "function" === ut.type(e)
        },
        isArray: Array.isArray || function(e) {
          return "array" === ut.type(e)
        },
        isWindow: function(e) {
          return null != e && e == e.window
        },
        isNumeric: function(e) {
          return !isNaN(parseFloat(e)) && isFinite(e)
        },
        type: function(e) {
          return null == e ? String(e) : "object" == typeof e || "function" == typeof e ? et[st.call(e)] || "object" : typeof e
        },
        isPlainObject: function(e) {
          var n;
          if (!e || "object" !== ut.type(e) || e.nodeType || ut.isWindow(e)) return !1;
          try {
            if (e.constructor && !lt.call(e, "constructor") && !lt.call(e.constructor.prototype, "isPrototypeOf")) return !1
          } catch (i) {
            return !1
          }
          if (ut.support.ownLast)
            for (n in e) return lt.call(e, n);
          for (n in e);
          return n === t || lt.call(e, n)
        },
        isEmptyObject: function(e) {
          var t;
          for (t in e) return !1;
          return !0
        },
        error: function(e) {
          throw new Error(e)
        },
        parseHTML: function(e, t, n) {
          if (!e || "string" != typeof e) return null;
          "boolean" == typeof t && (n = t, t = !1), t = t || Q;
          var i = mt.exec(e),
            o = !n && [];
          return i ? [t.createElement(i[1])] : (i = ut.buildFragment([e], t, o), o && ut(o).remove(), ut.merge([], i.childNodes))
        },
        parseJSON: function(t) {
          return e.JSON && e.JSON.parse ? e.JSON.parse(t) : null === t ? t : "string" == typeof t && (t = ut.trim(t), t && gt.test(t.replace(yt, "@").replace(wt, "]").replace(vt, ""))) ? new Function("return " + t)() : (ut.error("Invalid JSON: " + t), void 0)
        },
        parseXML: function(n) {
          var i, o;
          if (!n || "string" != typeof n) return null;
          try {
            e.DOMParser ? (o = new DOMParser, i = o.parseFromString(n, "text/xml")) : (i = new ActiveXObject("Microsoft.XMLDOM"), i.async = "false", i.loadXML(n))
          } catch (a) {
            i = t
          }
          return i && i.documentElement && !i.getElementsByTagName("parsererror").length || ut.error("Invalid XML: " + n), i
        },
        noop: function() {},
        globalEval: function(t) {
          t && ut.trim(t) && (e.execScript || function(t) {
            e.eval.call(e, t)
          })(t)
        },
        camelCase: function(e) {
          return e.replace(bt, "ms-").replace(_t, xt)
        },
        nodeName: function(e, t) {
          return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t, i) {
          var o, a = 0,
            r = e.length,
            s = n(e);
          if (i) {
            if (s)
              for (; r > a && (o = t.apply(e[a], i), o !== !1); a++);
            else
              for (a in e)
                if (o = t.apply(e[a], i), o === !1) break
          } else if (s)
            for (; r > a && (o = t.call(e[a], a, e[a]), o !== !1); a++);
          else
            for (a in e)
              if (o = t.call(e[a], a, e[a]), o === !1) break; return e
        },
        trim: ct && !ct.call("﻿ ") ? function(e) {
          return null == e ? "" : ct.call(e)
        } : function(e) {
          return null == e ? "" : (e + "").replace(ht, "")
        },
        makeArray: function(e, t) {
          var i = t || [];
          return null != e && (n(Object(e)) ? ut.merge(i, "string" == typeof e ? [e] : e) : ot.call(i, e)), i
        },
        inArray: function(e, t, n) {
          var i;
          if (t) {
            if (rt) return rt.call(t, e, n);
            for (i = t.length, n = n ? 0 > n ? Math.max(0, i + n) : n : 0; i > n; n++)
              if (n in t && t[n] === e) return n
          }
          return -1
        },
        merge: function(e, n) {
          var i = n.length,
            o = e.length,
            a = 0;
          if ("number" == typeof i)
            for (; i > a; a++) e[o++] = n[a];
          else
            for (; n[a] !== t;) e[o++] = n[a++];
          return e.length = o, e
        },
        grep: function(e, t, n) {
          var i, o = [],
            a = 0,
            r = e.length;
          for (n = !!n; r > a; a++) i = !!t(e[a], a), n !== i && o.push(e[a]);
          return o
        },
        map: function(e, t, i) {
          var o, a = 0,
            r = e.length,
            s = n(e),
            l = [];
          if (s)
            for (; r > a; a++) o = t(e[a], a, i), null != o && (l[l.length] = o);
          else
            for (a in e) o = t(e[a], a, i), null != o && (l[l.length] = o);
          return it.apply([], l)
        },
        guid: 1,
        proxy: function(e, n) {
          var i, o, a;
          return "string" == typeof n && (a = e[n], n = e, e = a), ut.isFunction(e) ? (i = at.call(arguments, 2), o = function() {
            return e.apply(n || this, i.concat(at.call(arguments)))
          }, o.guid = e.guid = e.guid || ut.guid++, o) : t
        },
        access: function(e, n, i, o, a, r, s) {
          var l = 0,
            c = e.length,
            u = null == i;
          if ("object" === ut.type(i)) {
            a = !0;
            for (l in i) ut.access(e, n, l, i[l], !0, r, s)
          } else if (o !== t && (a = !0, ut.isFunction(o) || (s = !0), u && (s ? (n.call(e, o), n = null) : (u = n, n = function(e, t, n) {
              return u.call(ut(e), n)
            })), n))
            for (; c > l; l++) n(e[l], i, s ? o : o.call(e[l], l, n(e[l], i)));
          return a ? e : u ? n.call(e) : c ? n(e[0], i) : r
        },
        now: function() {
          return (new Date).getTime()
        },
        swap: function(e, t, n, i) {
          var o, a, r = {};
          for (a in t) r[a] = e.style[a], e.style[a] = t[a];
          o = n.apply(e, i || []);
          for (a in t) e.style[a] = r[a];
          return o
        }
      }), ut.ready.promise = function(t) {
        if (!X)
          if (X = ut.Deferred(), "complete" === Q.readyState) setTimeout(ut.ready);
          else if (Q.addEventListener) Q.addEventListener("DOMContentLoaded", $t, !1), e.addEventListener("load", $t, !1);
        else {
          Q.attachEvent("onreadystatechange", $t), e.attachEvent("onload", $t);
          var n = !1;
          try {
            n = null == e.frameElement && Q.documentElement
          } catch (i) {}
          n && n.doScroll && function o() {
            if (!ut.isReady) {
              try {
                n.doScroll("left")
              } catch (e) {
                return setTimeout(o, 50)
              }
              St(), ut.ready()
            }
          }()
        }
        return X.promise(t)
      }, ut.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        et["[object " + t + "]"] = t.toLowerCase()
      }), Y = ut(Q),
      function(e, t) {
        function n(e, t, n, i) {
          var o, a, r, s, l, c, u, d, f, m;
          if ((t ? t.ownerDocument || t : R) !== L && H(t), t = t || L, n = n || [], !e || "string" != typeof e) return n;
          if (1 !== (s = t.nodeType) && 9 !== s) return [];
          if (O && !i) {
            if (o = wt.exec(e))
              if (r = o[1]) {
                if (9 === s) {
                  if (a = t.getElementById(r), !a || !a.parentNode) return n;
                  if (a.id === r) return n.push(a), n
                } else if (t.ownerDocument && (a = t.ownerDocument.getElementById(r)) && j(t, a) && a.id === r) return n.push(a), n
              } else {
                if (o[2]) return et.apply(n, t.getElementsByTagName(e)), n;
                if ((r = o[3]) && $.getElementsByClassName && t.getElementsByClassName) return et.apply(n, t.getElementsByClassName(r)), n
              }
            if ($.qsa && (!N || !N.test(e))) {
              if (d = u = F, f = t, m = 9 === s && e, 1 === s && "object" !== t.nodeName.toLowerCase()) {
                for (c = p(e), (u = t.getAttribute("id")) ? d = u.replace(xt, "\\$&") : t.setAttribute("id", d), d = "[id='" + d + "'] ", l = c.length; l--;) c[l] = d + h(c[l]);
                f = ht.test(e) && t.parentNode || t, m = c.join(",")
              }
              if (m) try {
                return et.apply(n, f.querySelectorAll(m)), n
              } catch (g) {} finally {
                u || t.removeAttribute("id")
              }
            }
          }
          return _(e.replace(ct, "$1"), t, n, i)
        }

        function i() {
          function e(n, i) {
            return t.push(n += " ") > T.cacheLength && delete e[t.shift()], e[n] = i
          }
          var t = [];
          return e
        }

        function o(e) {
          return e[F] = !0, e
        }

        function a(e) {
          var t = L.createElement("div");
          try {
            return !!e(t)
          } catch (n) {
            return !1
          } finally {
            t.parentNode && t.parentNode.removeChild(t), t = null
          }
        }

        function r(e, t) {
          for (var n = e.split("|"), i = e.length; i--;) T.attrHandle[n[i]] = t
        }

        function s(e, t) {
          var n = t && e,
            i = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || G) - (~e.sourceIndex || G);
          if (i) return i;
          if (n)
            for (; n = n.nextSibling;)
              if (n === t) return -1;
          return e ? 1 : -1
        }

        function l(e) {
          return function(t) {
            var n = t.nodeName.toLowerCase();
            return "input" === n && t.type === e
          }
        }

        function c(e) {
          return function(t) {
            var n = t.nodeName.toLowerCase();
            return ("input" === n || "button" === n) && t.type === e
          }
        }

        function u(e) {
          return o(function(t) {
            return t = +t, o(function(n, i) {
              for (var o, a = e([], n.length, t), r = a.length; r--;) n[o = a[r]] && (n[o] = !(i[o] = n[o]))
            })
          })
        }

        function d() {}

        function p(e, t) {
          var i, o, a, r, s, l, c, u = U[e + " "];
          if (u) return t ? 0 : u.slice(0);
          for (s = e, l = [], c = T.preFilter; s;) {
            (!i || (o = dt.exec(s))) && (o && (s = s.slice(o[0].length) || s), l.push(a = [])), i = !1, (o = pt.exec(s)) && (i = o.shift(), a.push({
              value: i,
              type: o[0].replace(ct, " ")
            }), s = s.slice(i.length));
            for (r in T.filter) !(o = vt[r].exec(s)) || c[r] && !(o = c[r](o)) || (i = o.shift(), a.push({
              value: i,
              type: r,
              matches: o
            }), s = s.slice(i.length));
            if (!i) break
          }
          return t ? s.length : s ? n.error(e) : U(e, l).slice(0)
        }

        function h(e) {
          for (var t = 0, n = e.length, i = ""; n > t; t++) i += e[t].value;
          return i
        }

        function f(e, t, n) {
          var i = t.dir,
            o = n && "parentNode" === i,
            a = z++;
          return t.first ? function(t, n, a) {
            for (; t = t[i];)
              if (1 === t.nodeType || o) return e(t, n, a)
          } : function(t, n, r) {
            var s, l, c, u = B + " " + a;
            if (r) {
              for (; t = t[i];)
                if ((1 === t.nodeType || o) && e(t, n, r)) return !0
            } else
              for (; t = t[i];)
                if (1 === t.nodeType || o)
                  if (c = t[F] || (t[F] = {}), (l = c[i]) && l[0] === u) {
                    if ((s = l[1]) === !0 || s === S) return s === !0
                  } else if (l = c[i] = [u], l[1] = e(t, n, r) || S, l[1] === !0) return !0
          }
        }

        function m(e) {
          return e.length > 1 ? function(t, n, i) {
            for (var o = e.length; o--;)
              if (!e[o](t, n, i)) return !1;
            return !0
          } : e[0]
        }

        function g(e, t, n, i, o) {
          for (var a, r = [], s = 0, l = e.length, c = null != t; l > s; s++)(a = e[s]) && (!n || n(a, i, o)) && (r.push(a), c && t.push(s));
          return r
        }

        function v(e, t, n, i, a, r) {
          return i && !i[F] && (i = v(i)), a && !a[F] && (a = v(a, r)), o(function(o, r, s, l) {
            var c, u, d, p = [],
              h = [],
              f = r.length,
              m = o || b(t || "*", s.nodeType ? [s] : s, []),
              v = !e || !o && t ? m : g(m, p, e, s, l),
              y = n ? a || (o ? e : f || i) ? [] : r : v;
            if (n && n(v, y, s, l), i)
              for (c = g(y, h), i(c, [], s, l), u = c.length; u--;)(d = c[u]) && (y[h[u]] = !(v[h[u]] = d));
            if (o) {
              if (a || e) {
                if (a) {
                  for (c = [], u = y.length; u--;)(d = y[u]) && c.push(v[u] = d);
                  a(null, y = [], c, l)
                }
                for (u = y.length; u--;)(d = y[u]) && (c = a ? nt.call(o, d) : p[u]) > -1 && (o[c] = !(r[c] = d))
              }
            } else y = g(y === r ? y.splice(f, y.length) : y), a ? a(null, r, y, l) : et.apply(r, y)
          })
        }

        function y(e) {
          for (var t, n, i, o = e.length, a = T.relative[e[0].type], r = a || T.relative[" "], s = a ? 1 : 0, l = f(function(e) {
              return e === t
            }, r, !0), c = f(function(e) {
              return nt.call(t, e) > -1
            }, r, !0), u = [function(e, n, i) {
              return !a && (i || n !== P) || ((t = n).nodeType ? l(e, n, i) : c(e, n, i))
            }]; o > s; s++)
            if (n = T.relative[e[s].type]) u = [f(m(u), n)];
            else {
              if (n = T.filter[e[s].type].apply(null, e[s].matches), n[F]) {
                for (i = ++s; o > i && !T.relative[e[i].type]; i++);
                return v(s > 1 && m(u), s > 1 && h(e.slice(0, s - 1).concat({
                  value: " " === e[s - 2].type ? "*" : ""
                })).replace(ct, "$1"), n, i > s && y(e.slice(s, i)), o > i && y(e = e.slice(i)), o > i && h(e))
              }
              u.push(n)
            }
          return m(u)
        }

        function w(e, t) {
          var i = 0,
            a = t.length > 0,
            r = e.length > 0,
            s = function(o, s, l, c, u) {
              var d, p, h, f = [],
                m = 0,
                v = "0",
                y = o && [],
                w = null != u,
                b = P,
                _ = o || r && T.find.TAG("*", u && s.parentNode || s),
                x = B += null == b ? 1 : Math.random() || .1;
              for (w && (P = s !== L && s, S = i); null != (d = _[v]); v++) {
                if (r && d) {
                  for (p = 0; h = e[p++];)
                    if (h(d, s, l)) {
                      c.push(d);
                      break
                    }
                  w && (B = x, S = ++i)
                }
                a && ((d = !h && d) && m--, o && y.push(d))
              }
              if (m += v, a && v !== m) {
                for (p = 0; h = t[p++];) h(y, f, s, l);
                if (o) {
                  if (m > 0)
                    for (; v--;) y[v] || f[v] || (f[v] = J.call(c));
                  f = g(f)
                }
                et.apply(c, f), w && !o && f.length > 0 && m + t.length > 1 && n.uniqueSort(c)
              }
              return w && (B = x, P = b), y
            };
          return a ? o(s) : s
        }

        function b(e, t, i) {
          for (var o = 0, a = t.length; a > o; o++) n(e, t[o], i);
          return i
        }

        function _(e, t, n, i) {
          var o, a, r, s, l, c = p(e);
          if (!i && 1 === c.length) {
            if (a = c[0] = c[0].slice(0), a.length > 2 && "ID" === (r = a[0]).type && $.getById && 9 === t.nodeType && O && T.relative[a[1].type]) {
              if (t = (T.find.ID(r.matches[0].replace($t, St), t) || [])[0], !t) return n;
              e = e.slice(a.shift().value.length)
            }
            for (o = vt.needsContext.test(e) ? 0 : a.length; o-- && (r = a[o], !T.relative[s = r.type]);)
              if ((l = T.find[s]) && (i = l(r.matches[0].replace($t, St), ht.test(a[0].type) && t.parentNode || t))) {
                if (a.splice(o, 1), e = i.length && h(a), !e) return et.apply(n, i), n;
                break
              }
          }
          return E(e, c)(i, t, !O, n, ht.test(e)), n
        }
        var x, $, S, T, k, C, E, P, M, H, L, D, O, N, I, A, j, F = "sizzle" + -new Date,
          R = e.document,
          B = 0,
          z = 0,
          q = i(),
          U = i(),
          W = i(),
          X = !1,
          Y = function(e, t) {
            return e === t ? (X = !0, 0) : 0
          },
          V = typeof t,
          G = 1 << 31,
          Q = {}.hasOwnProperty,
          K = [],
          J = K.pop,
          Z = K.push,
          et = K.push,
          tt = K.slice,
          nt = K.indexOf || function(e) {
            for (var t = 0, n = this.length; n > t; t++)
              if (this[t] === e) return t;
            return -1
          },
          it = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
          ot = "[\\x20\\t\\r\\n\\f]",
          at = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
          rt = at.replace("w", "w#"),
          st = "\\[" + ot + "*(" + at + ")" + ot + "*(?:([*^$|!~]?=)" + ot + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + rt + ")|)|)" + ot + "*\\]",
          lt = ":(" + at + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + st.replace(3, 8) + ")*)|.*)\\)|)",
          ct = new RegExp("^" + ot + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ot + "+$", "g"),
          dt = new RegExp("^" + ot + "*," + ot + "*"),
          pt = new RegExp("^" + ot + "*([>+~]|" + ot + ")" + ot + "*"),
          ht = new RegExp(ot + "*[+~]"),
          ft = new RegExp("=" + ot + "*([^\\]'\"]*)" + ot + "*\\]", "g"),
          mt = new RegExp(lt),
          gt = new RegExp("^" + rt + "$"),
          vt = {
            ID: new RegExp("^#(" + at + ")"),
            CLASS: new RegExp("^\\.(" + at + ")"),
            TAG: new RegExp("^(" + at.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + st),
            PSEUDO: new RegExp("^" + lt),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ot + "*(even|odd|(([+-]|)(\\d*)n|)" + ot + "*(?:([+-]|)" + ot + "*(\\d+)|))" + ot + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + it + ")$", "i"),
            needsContext: new RegExp("^" + ot + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ot + "*((?:-\\d)?\\d*)" + ot + "*\\)|)(?=[^-]|$)", "i")
          },
          yt = /^[^{]+\{\s*\[native \w/,
          wt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
          bt = /^(?:input|select|textarea|button)$/i,
          _t = /^h\d$/i,
          xt = /'|\\/g,
          $t = new RegExp("\\\\([\\da-f]{1,6}" + ot + "?|(" + ot + ")|.)", "ig"),
          St = function(e, t, n) {
            var i = "0x" + t - 65536;
            return i !== i || n ? t : 0 > i ? String.fromCharCode(i + 65536) : String.fromCharCode(55296 | i >> 10, 56320 | 1023 & i)
          };
        try {
          et.apply(K = tt.call(R.childNodes), R.childNodes), K[R.childNodes.length].nodeType
        } catch (Tt) {
          et = {
            apply: K.length ? function(e, t) {
              Z.apply(e, tt.call(t))
            } : function(e, t) {
              for (var n = e.length, i = 0; e[n++] = t[i++];);
              e.length = n - 1
            }
          }
        }
        C = n.isXML = function(e) {
          var t = e && (e.ownerDocument || e).documentElement;
          return t ? "HTML" !== t.nodeName : !1
        }, $ = n.support = {}, H = n.setDocument = function(e) {
          var t = e ? e.ownerDocument || e : R,
            n = t.defaultView;
          return t !== L && 9 === t.nodeType && t.documentElement ? (L = t, D = t.documentElement, O = !C(t), n && n.attachEvent && n !== n.top && n.attachEvent("onbeforeunload", function() {
            H()
          }), $.attributes = a(function(e) {
            return e.className = "i", !e.getAttribute("className")
          }), $.getElementsByTagName = a(function(e) {
            return e.appendChild(t.createComment("")), !e.getElementsByTagName("*").length
          }), $.getElementsByClassName = a(function(e) {
            return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length
          }), $.getById = a(function(e) {
            return D.appendChild(e).id = F, !t.getElementsByName || !t.getElementsByName(F).length
          }), $.getById ? (T.find.ID = function(e, t) {
            if (typeof t.getElementById !== V && O) {
              var n = t.getElementById(e);
              return n && n.parentNode ? [n] : []
            }
          }, T.filter.ID = function(e) {
            var t = e.replace($t, St);
            return function(e) {
              return e.getAttribute("id") === t
            }
          }) : (delete T.find.ID, T.filter.ID = function(e) {
            var t = e.replace($t, St);
            return function(e) {
              var n = typeof e.getAttributeNode !== V && e.getAttributeNode("id");
              return n && n.value === t
            }
          }), T.find.TAG = $.getElementsByTagName ? function(e, t) {
            return typeof t.getElementsByTagName !== V ? t.getElementsByTagName(e) : void 0
          } : function(e, t) {
            var n, i = [],
              o = 0,
              a = t.getElementsByTagName(e);
            if ("*" === e) {
              for (; n = a[o++];) 1 === n.nodeType && i.push(n);
              return i
            }
            return a
          }, T.find.CLASS = $.getElementsByClassName && function(e, t) {
            return typeof t.getElementsByClassName !== V && O ? t.getElementsByClassName(e) : void 0
          }, I = [], N = [], ($.qsa = yt.test(t.querySelectorAll)) && (a(function(e) {
            e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || N.push("\\[" + ot + "*(?:value|" + it + ")"), e.querySelectorAll(":checked").length || N.push(":checked")
          }), a(function(e) {
            var n = t.createElement("input");
            n.setAttribute("type", "hidden"), e.appendChild(n).setAttribute("t", ""), e.querySelectorAll("[t^='']").length && N.push("[*^$]=" + ot + "*(?:''|\"\")"), e.querySelectorAll(":enabled").length || N.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), N.push(",.*:")
          })), ($.matchesSelector = yt.test(A = D.webkitMatchesSelector || D.mozMatchesSelector || D.oMatchesSelector || D.msMatchesSelector)) && a(function(e) {
            $.disconnectedMatch = A.call(e, "div"), A.call(e, "[s!='']:x"), I.push("!=", lt)
          }), N = N.length && new RegExp(N.join("|")), I = I.length && new RegExp(I.join("|")), j = yt.test(D.contains) || D.compareDocumentPosition ? function(e, t) {
            var n = 9 === e.nodeType ? e.documentElement : e,
              i = t && t.parentNode;
            return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
          } : function(e, t) {
            if (t)
              for (; t = t.parentNode;)
                if (t === e) return !0;
            return !1
          }, Y = D.compareDocumentPosition ? function(e, n) {
            if (e === n) return X = !0, 0;
            var i = n.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(n);
            return i ? 1 & i || !$.sortDetached && n.compareDocumentPosition(e) === i ? e === t || j(R, e) ? -1 : n === t || j(R, n) ? 1 : M ? nt.call(M, e) - nt.call(M, n) : 0 : 4 & i ? -1 : 1 : e.compareDocumentPosition ? -1 : 1
          } : function(e, n) {
            var i, o = 0,
              a = e.parentNode,
              r = n.parentNode,
              l = [e],
              c = [n];
            if (e === n) return X = !0, 0;
            if (!a || !r) return e === t ? -1 : n === t ? 1 : a ? -1 : r ? 1 : M ? nt.call(M, e) - nt.call(M, n) : 0;
            if (a === r) return s(e, n);
            for (i = e; i = i.parentNode;) l.unshift(i);
            for (i = n; i = i.parentNode;) c.unshift(i);
            for (; l[o] === c[o];) o++;
            return o ? s(l[o], c[o]) : l[o] === R ? -1 : c[o] === R ? 1 : 0
          }, t) : L
        }, n.matches = function(e, t) {
          return n(e, null, null, t)
        }, n.matchesSelector = function(e, t) {
          if ((e.ownerDocument || e) !== L && H(e), t = t.replace(ft, "='$1']"), !(!$.matchesSelector || !O || I && I.test(t) || N && N.test(t))) try {
            var i = A.call(e, t);
            if (i || $.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
          } catch (o) {}
          return n(t, L, null, [e]).length > 0
        }, n.contains = function(e, t) {
          return (e.ownerDocument || e) !== L && H(e), j(e, t)
        }, n.attr = function(e, n) {
          (e.ownerDocument || e) !== L && H(e);
          var i = T.attrHandle[n.toLowerCase()],
            o = i && Q.call(T.attrHandle, n.toLowerCase()) ? i(e, n, !O) : t;
          return o === t ? $.attributes || !O ? e.getAttribute(n) : (o = e.getAttributeNode(n)) && o.specified ? o.value : null : o
        }, n.error = function(e) {
          throw new Error("Syntax error, unrecognized expression: " + e)
        }, n.uniqueSort = function(e) {
          var t, n = [],
            i = 0,
            o = 0;
          if (X = !$.detectDuplicates, M = !$.sortStable && e.slice(0), e.sort(Y), X) {
            for (; t = e[o++];) t === e[o] && (i = n.push(o));
            for (; i--;) e.splice(n[i], 1)
          }
          return e
        }, k = n.getText = function(e) {
          var t, n = "",
            i = 0,
            o = e.nodeType;
          if (o) {
            if (1 === o || 9 === o || 11 === o) {
              if ("string" == typeof e.textContent) return e.textContent;
              for (e = e.firstChild; e; e = e.nextSibling) n += k(e)
            } else if (3 === o || 4 === o) return e.nodeValue
          } else
            for (; t = e[i]; i++) n += k(t);
          return n
        }, T = n.selectors = {
          cacheLength: 50,
          createPseudo: o,
          match: vt,
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
              return e[1] = e[1].replace($t, St), e[3] = (e[4] || e[5] || "").replace($t, St), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
            },
            CHILD: function(e) {
              return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || n.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && n.error(e[0]), e
            },
            PSEUDO: function(e) {
              var n, i = !e[5] && e[2];
              return vt.CHILD.test(e[0]) ? null : (e[3] && e[4] !== t ? e[2] = e[4] : i && mt.test(i) && (n = p(i, !0)) && (n = i.indexOf(")", i.length - n) - i.length) && (e[0] = e[0].slice(0, n), e[2] = i.slice(0, n)), e.slice(0, 3))
            }
          },
          filter: {
            TAG: function(e) {
              var t = e.replace($t, St).toLowerCase();
              return "*" === e ? function() {
                return !0
              } : function(e) {
                return e.nodeName && e.nodeName.toLowerCase() === t
              }
            },
            CLASS: function(e) {
              var t = q[e + " "];
              return t || (t = new RegExp("(^|" + ot + ")" + e + "(" + ot + "|$)")) && q(e, function(e) {
                return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== V && e.getAttribute("class") || "")
              })
            },
            ATTR: function(e, t, i) {
              return function(o) {
                var a = n.attr(o, e);
                return null == a ? "!=" === t : t ? (a += "", "=" === t ? a === i : "!=" === t ? a !== i : "^=" === t ? i && 0 === a.indexOf(i) : "*=" === t ? i && a.indexOf(i) > -1 : "$=" === t ? i && a.slice(-i.length) === i : "~=" === t ? (" " + a + " ").indexOf(i) > -1 : "|=" === t ? a === i || a.slice(0, i.length + 1) === i + "-" : !1) : !0
              }
            },
            CHILD: function(e, t, n, i, o) {
              var a = "nth" !== e.slice(0, 3),
                r = "last" !== e.slice(-4),
                s = "of-type" === t;
              return 1 === i && 0 === o ? function(e) {
                return !!e.parentNode
              } : function(t, n, l) {
                var c, u, d, p, h, f, m = a !== r ? "nextSibling" : "previousSibling",
                  g = t.parentNode,
                  v = s && t.nodeName.toLowerCase(),
                  y = !l && !s;
                if (g) {
                  if (a) {
                    for (; m;) {
                      for (d = t; d = d[m];)
                        if (s ? d.nodeName.toLowerCase() === v : 1 === d.nodeType) return !1;
                      f = m = "only" === e && !f && "nextSibling"
                    }
                    return !0
                  }
                  if (f = [r ? g.firstChild : g.lastChild], r && y) {
                    for (u = g[F] || (g[F] = {}), c = u[e] || [], h = c[0] === B && c[1], p = c[0] === B && c[2], d = h && g.childNodes[h]; d = ++h && d && d[m] || (p = h = 0) || f.pop();)
                      if (1 === d.nodeType && ++p && d === t) {
                        u[e] = [B, h, p];
                        break
                      }
                  } else if (y && (c = (t[F] || (t[F] = {}))[e]) && c[0] === B) p = c[1];
                  else
                    for (;
                      (d = ++h && d && d[m] || (p = h = 0) || f.pop()) && ((s ? d.nodeName.toLowerCase() !== v : 1 !== d.nodeType) || !++p || (y && ((d[F] || (d[F] = {}))[e] = [B, p]), d !== t)););
                  return p -= o, p === i || 0 === p % i && p / i >= 0
                }
              }
            },
            PSEUDO: function(e, t) {
              var i, a = T.pseudos[e] || T.setFilters[e.toLowerCase()] || n.error("unsupported pseudo: " + e);
              return a[F] ? a(t) : a.length > 1 ? (i = [e, e, "", t], T.setFilters.hasOwnProperty(e.toLowerCase()) ? o(function(e, n) {
                for (var i, o = a(e, t), r = o.length; r--;) i = nt.call(e, o[r]), e[i] = !(n[i] = o[r])
              }) : function(e) {
                return a(e, 0, i)
              }) : a
            }
          },
          pseudos: {
            not: o(function(e) {
              var t = [],
                n = [],
                i = E(e.replace(ct, "$1"));
              return i[F] ? o(function(e, t, n, o) {
                for (var a, r = i(e, null, o, []), s = e.length; s--;)(a = r[s]) && (e[s] = !(t[s] = a))
              }) : function(e, o, a) {
                return t[0] = e, i(t, null, a, n), !n.pop()
              }
            }),
            has: o(function(e) {
              return function(t) {
                return n(e, t).length > 0
              }
            }),
            contains: o(function(e) {
              return function(t) {
                return (t.textContent || t.innerText || k(t)).indexOf(e) > -1
              }
            }),
            lang: o(function(e) {
              return gt.test(e || "") || n.error("unsupported lang: " + e), e = e.replace($t, St).toLowerCase(),
                function(t) {
                  var n;
                  do
                    if (n = O ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-");
                  while ((t = t.parentNode) && 1 === t.nodeType);
                  return !1
                }
            }),
            target: function(t) {
              var n = e.location && e.location.hash;
              return n && n.slice(1) === t.id
            },
            root: function(e) {
              return e === D
            },
            focus: function(e) {
              return e === L.activeElement && (!L.hasFocus || L.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
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
                if (e.nodeName > "@" || 3 === e.nodeType || 4 === e.nodeType) return !1;
              return !0
            },
            parent: function(e) {
              return !T.pseudos.empty(e)
            },
            header: function(e) {
              return _t.test(e.nodeName)
            },
            input: function(e) {
              return bt.test(e.nodeName)
            },
            button: function(e) {
              var t = e.nodeName.toLowerCase();
              return "input" === t && "button" === e.type || "button" === t
            },
            text: function(e) {
              var t;
              return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || t.toLowerCase() === e.type)
            },
            first: u(function() {
              return [0]
            }),
            last: u(function(e, t) {
              return [t - 1]
            }),
            eq: u(function(e, t, n) {
              return [0 > n ? n + t : n]
            }),
            even: u(function(e, t) {
              for (var n = 0; t > n; n += 2) e.push(n);
              return e
            }),
            odd: u(function(e, t) {
              for (var n = 1; t > n; n += 2) e.push(n);
              return e
            }),
            lt: u(function(e, t, n) {
              for (var i = 0 > n ? n + t : n; --i >= 0;) e.push(i);
              return e
            }),
            gt: u(function(e, t, n) {
              for (var i = 0 > n ? n + t : n; ++i < t;) e.push(i);
              return e
            })
          }
        }, T.pseudos.nth = T.pseudos.eq;
        for (x in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
          }) T.pseudos[x] = l(x);
        for (x in {
            submit: !0,
            reset: !0
          }) T.pseudos[x] = c(x);
        d.prototype = T.filters = T.pseudos, T.setFilters = new d, E = n.compile = function(e, t) {
          var n, i = [],
            o = [],
            a = W[e + " "];
          if (!a) {
            for (t || (t = p(e)), n = t.length; n--;) a = y(t[n]), a[F] ? i.push(a) : o.push(a);
            a = W(e, w(o, i))
          }
          return a
        }, $.sortStable = F.split("").sort(Y).join("") === F, $.detectDuplicates = X, H(), $.sortDetached = a(function(e) {
          return 1 & e.compareDocumentPosition(L.createElement("div"))
        }), a(function(e) {
          return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || r("type|href|height|width", function(e, t, n) {
          return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), $.attributes && a(function(e) {
          return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || r("value", function(e, t, n) {
          return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
        }), a(function(e) {
          return null == e.getAttribute("disabled")
        }) || r(it, function(e, t, n) {
          var i;
          return n ? void 0 : (i = e.getAttributeNode(t)) && i.specified ? i.value : e[t] === !0 ? t.toLowerCase() : null
        }), ut.find = n, ut.expr = n.selectors, ut.expr[":"] = ut.expr.pseudos, ut.unique = n.uniqueSort, ut.text = n.getText, ut.isXMLDoc = n.isXML, ut.contains = n.contains
      }(e);
    var Tt = {};
    ut.Callbacks = function(e) {
      e = "string" == typeof e ? Tt[e] || i(e) : ut.extend({}, e);
      var n, o, a, r, s, l, c = [],
        u = !e.once && [],
        d = function(t) {
          for (o = e.memory && t, a = !0, s = l || 0, l = 0, r = c.length, n = !0; c && r > s; s++)
            if (c[s].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
              o = !1;
              break
            }
          n = !1, c && (u ? u.length && d(u.shift()) : o ? c = [] : p.disable())
        },
        p = {
          add: function() {
            if (c) {
              var t = c.length;
              ! function i(t) {
                ut.each(t, function(t, n) {
                  var o = ut.type(n);
                  "function" === o ? e.unique && p.has(n) || c.push(n) : n && n.length && "string" !== o && i(n)
                })
              }(arguments), n ? r = c.length : o && (l = t, d(o))
            }
            return this
          },
          remove: function() {
            return c && ut.each(arguments, function(e, t) {
              for (var i;
                (i = ut.inArray(t, c, i)) > -1;) c.splice(i, 1), n && (r >= i && r--, s >= i && s--)
            }), this
          },
          has: function(e) {
            return e ? ut.inArray(e, c) > -1 : !(!c || !c.length)
          },
          empty: function() {
            return c = [], r = 0, this
          },
          disable: function() {
            return c = u = o = t, this
          },
          disabled: function() {
            return !c
          },
          lock: function() {
            return u = t, o || p.disable(), this
          },
          locked: function() {
            return !u
          },
          fireWith: function(e, t) {
            return !c || a && !u || (t = t || [], t = [e, t.slice ? t.slice() : t], n ? u.push(t) : d(t)), this
          },
          fire: function() {
            return p.fireWith(this, arguments), this
          },
          fired: function() {
            return !!a
          }
        };
      return p
    }, ut.extend({
      Deferred: function(e) {
        var t = [
            ["resolve", "done", ut.Callbacks("once memory"), "resolved"],
            ["reject", "fail", ut.Callbacks("once memory"), "rejected"],
            ["notify", "progress", ut.Callbacks("memory")]
          ],
          n = "pending",
          i = {
            state: function() {
              return n
            },
            always: function() {
              return o.done(arguments).fail(arguments), this
            },
            then: function() {
              var e = arguments;
              return ut.Deferred(function(n) {
                ut.each(t, function(t, a) {
                  var r = a[0],
                    s = ut.isFunction(e[t]) && e[t];
                  o[a[1]](function() {
                    var e = s && s.apply(this, arguments);
                    e && ut.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[r + "With"](this === i ? n.promise() : this, s ? [e] : arguments)
                  })
                }), e = null
              }).promise()
            },
            promise: function(e) {
              return null != e ? ut.extend(e, i) : i
            }
          },
          o = {};
        return i.pipe = i.then, ut.each(t, function(e, a) {
          var r = a[2],
            s = a[3];
          i[a[1]] = r.add, s && r.add(function() {
            n = s
          }, t[1 ^ e][2].disable, t[2][2].lock), o[a[0]] = function() {
            return o[a[0] + "With"](this === o ? i : this, arguments), this
          }, o[a[0] + "With"] = r.fireWith
        }), i.promise(o), e && e.call(o, o), o
      },
      when: function(e) {
        var t, n, i, o = 0,
          a = at.call(arguments),
          r = a.length,
          s = 1 !== r || e && ut.isFunction(e.promise) ? r : 0,
          l = 1 === s ? e : ut.Deferred(),
          c = function(e, n, i) {
            return function(o) {
              n[e] = this, i[e] = arguments.length > 1 ? at.call(arguments) : o, i === t ? l.notifyWith(n, i) : --s || l.resolveWith(n, i)
            }
          };
        if (r > 1)
          for (t = new Array(r), n = new Array(r), i = new Array(r); r > o; o++) a[o] && ut.isFunction(a[o].promise) ? a[o].promise().done(c(o, i, a)).fail(l.reject).progress(c(o, n, t)) : --s;
        return s || l.resolveWith(i, a), l.promise()
      }
    }), ut.support = function(t) {
      var n, i, o, a, r, s, l, c, u, d = Q.createElement("div");
      if (d.setAttribute("className", "t"), d.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = d.getElementsByTagName("*") || [], i = d.getElementsByTagName("a")[0], !i || !i.style || !n.length) return t;
      a = Q.createElement("select"), s = a.appendChild(Q.createElement("option")), o = d.getElementsByTagName("input")[0], i.style.cssText = "top:1px;float:left;opacity:.5", t.getSetAttribute = "t" !== d.className, t.leadingWhitespace = 3 === d.firstChild.nodeType, t.tbody = !d.getElementsByTagName("tbody").length, t.htmlSerialize = !!d.getElementsByTagName("link").length, t.style = /top/.test(i.getAttribute("style")), t.hrefNormalized = "/a" === i.getAttribute("href"), t.opacity = /^0.5/.test(i.style.opacity), t.cssFloat = !!i.style.cssFloat, t.checkOn = !!o.value, t.optSelected = s.selected, t.enctype = !!Q.createElement("form").enctype, t.html5Clone = "<:nav></:nav>" !== Q.createElement("nav").cloneNode(!0).outerHTML, t.inlineBlockNeedsLayout = !1, t.shrinkWrapBlocks = !1, t.pixelPosition = !1, t.deleteExpando = !0, t.noCloneEvent = !0, t.reliableMarginRight = !0, t.boxSizingReliable = !0, o.checked = !0, t.noCloneChecked = o.cloneNode(!0).checked, a.disabled = !0, t.optDisabled = !s.disabled;
      try {
        delete d.test
      } catch (p) {
        t.deleteExpando = !1
      }
      o = Q.createElement("input"), o.setAttribute("value", ""), t.input = "" === o.getAttribute("value"), o.value = "t", o.setAttribute("type", "radio"), t.radioValue = "t" === o.value, o.setAttribute("checked", "t"), o.setAttribute("name", "t"), r = Q.createDocumentFragment(), r.appendChild(o), t.appendChecked = o.checked, t.checkClone = r.cloneNode(!0).cloneNode(!0).lastChild.checked, d.attachEvent && (d.attachEvent("onclick", function() {
        t.noCloneEvent = !1
      }), d.cloneNode(!0).click());
      for (u in {
          submit: !0,
          change: !0,
          focusin: !0
        }) d.setAttribute(l = "on" + u, "t"), t[u + "Bubbles"] = l in e || d.attributes[l].expando === !1;
      d.style.backgroundClip = "content-box", d.cloneNode(!0).style.backgroundClip = "", t.clearCloneStyle = "content-box" === d.style.backgroundClip;
      for (u in ut(t)) break;
      return t.ownLast = "0" !== u, ut(function() {
        var n, i, o, a = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
          r = Q.getElementsByTagName("body")[0];
        r && (n = Q.createElement("div"), n.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", r.appendChild(n).appendChild(d), d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", o = d.getElementsByTagName("td"), o[0].style.cssText = "padding:0;margin:0;border:0;display:none", c = 0 === o[0].offsetHeight, o[0].style.display = "", o[1].style.display = "none", t.reliableHiddenOffsets = c && 0 === o[0].offsetHeight, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", ut.swap(r, null != r.style.zoom ? {
          zoom: 1
        } : {}, function() {
          t.boxSizing = 4 === d.offsetWidth
        }), e.getComputedStyle && (t.pixelPosition = "1%" !== (e.getComputedStyle(d, null) || {}).top, t.boxSizingReliable = "4px" === (e.getComputedStyle(d, null) || {
          width: "4px"
        }).width, i = d.appendChild(Q.createElement("div")), i.style.cssText = d.style.cssText = a, i.style.marginRight = i.style.width = "0", d.style.width = "1px", t.reliableMarginRight = !parseFloat((e.getComputedStyle(i, null) || {}).marginRight)), typeof d.style.zoom !== V && (d.innerHTML = "", d.style.cssText = a + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = 3 === d.offsetWidth, d.style.display = "block", d.innerHTML = "<div></div>", d.firstChild.style.width = "5px", t.shrinkWrapBlocks = 3 !== d.offsetWidth, t.inlineBlockNeedsLayout && (r.style.zoom = 1)), r.removeChild(n), n = d = o = i = null)
      }), n = a = r = s = i = o = null, t
    }({});
    var kt = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
      Ct = /([A-Z])/g;
    ut.extend({
      cache: {},
      noData: {
        applet: !0,
        embed: !0,
        object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
      },
      hasData: function(e) {
        return e = e.nodeType ? ut.cache[e[ut.expando]] : e[ut.expando], !!e && !s(e)
      },
      data: function(e, t, n) {
        return o(e, t, n)
      },
      removeData: function(e, t) {
        return a(e, t)
      },
      _data: function(e, t, n) {
        return o(e, t, n, !0)
      },
      _removeData: function(e, t) {
        return a(e, t, !0)
      },
      acceptData: function(e) {
        if (e.nodeType && 1 !== e.nodeType && 9 !== e.nodeType) return !1;
        var t = e.nodeName && ut.noData[e.nodeName.toLowerCase()];
        return !t || t !== !0 && e.getAttribute("classid") === t
      }
    }), ut.fn.extend({
      data: function(e, n) {
        var i, o, a = null,
          s = 0,
          l = this[0];
        if (e === t) {
          if (this.length && (a = ut.data(l), 1 === l.nodeType && !ut._data(l, "parsedAttrs"))) {
            for (i = l.attributes; s < i.length; s++) o = i[s].name, 0 === o.indexOf("data-") && (o = ut.camelCase(o.slice(5)), r(l, o, a[o]));
            ut._data(l, "parsedAttrs", !0)
          }
          return a
        }
        return "object" == typeof e ? this.each(function() {
          ut.data(this, e)
        }) : arguments.length > 1 ? this.each(function() {
          ut.data(this, e, n)
        }) : l ? r(l, e, ut.data(l, e)) : null
      },
      removeData: function(e) {
        return this.each(function() {
          ut.removeData(this, e)
        })
      }
    }), ut.extend({
      queue: function(e, t, n) {
        var i;
        return e ? (t = (t || "fx") + "queue", i = ut._data(e, t), n && (!i || ut.isArray(n) ? i = ut._data(e, t, ut.makeArray(n)) : i.push(n)), i || []) : void 0
      },
      dequeue: function(e, t) {
        t = t || "fx";
        var n = ut.queue(e, t),
          i = n.length,
          o = n.shift(),
          a = ut._queueHooks(e, t),
          r = function() {
            ut.dequeue(e, t)
          };
        "inprogress" === o && (o = n.shift(), i--), o && ("fx" === t && n.unshift("inprogress"), delete a.stop, o.call(e, r, a)), !i && a && a.empty.fire()
      },
      _queueHooks: function(e, t) {
        var n = t + "queueHooks";
        return ut._data(e, n) || ut._data(e, n, {
          empty: ut.Callbacks("once memory").add(function() {
            ut._removeData(e, t + "queue"), ut._removeData(e, n)
          })
        })
      }
    }), ut.fn.extend({
      queue: function(e, n) {
        var i = 2;
        return "string" != typeof e && (n = e, e = "fx", i--), arguments.length < i ? ut.queue(this[0], e) : n === t ? this : this.each(function() {
          var t = ut.queue(this, e, n);
          ut._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && ut.dequeue(this, e)
        })
      },
      dequeue: function(e) {
        return this.each(function() {
          ut.dequeue(this, e)
        })
      },
      delay: function(e, t) {
        return e = ut.fx ? ut.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
          var i = setTimeout(t, e);
          n.stop = function() {
            clearTimeout(i)
          }
        })
      },
      clearQueue: function(e) {
        return this.queue(e || "fx", [])
      },
      promise: function(e, n) {
        var i, o = 1,
          a = ut.Deferred(),
          r = this,
          s = this.length,
          l = function() {
            --o || a.resolveWith(r, [r])
          };
        for ("string" != typeof e && (n = e, e = t), e = e || "fx"; s--;) i = ut._data(r[s], e + "queueHooks"), i && i.empty && (o++, i.empty.add(l));
        return l(), a.promise(n)
      }
    });
    var Et, Pt, Mt = /[\t\r\n\f]/g,
      Ht = /\r/g,
      Lt = /^(?:input|select|textarea|button|object)$/i,
      Dt = /^(?:a|area)$/i,
      Ot = /^(?:checked|selected)$/i,
      Nt = ut.support.getSetAttribute,
      It = ut.support.input;
    ut.fn.extend({
      attr: function(e, t) {
        return ut.access(this, ut.attr, e, t, arguments.length > 1)
      },
      removeAttr: function(e) {
        return this.each(function() {
          ut.removeAttr(this, e)
        })
      },
      prop: function(e, t) {
        return ut.access(this, ut.prop, e, t, arguments.length > 1)
      },
      removeProp: function(e) {
        return e = ut.propFix[e] || e, this.each(function() {
          try {
            this[e] = t, delete this[e]
          } catch (n) {}
        })
      },
      addClass: function(e) {
        var t, n, i, o, a, r = 0,
          s = this.length,
          l = "string" == typeof e && e;
        if (ut.isFunction(e)) return this.each(function(t) {
          ut(this).addClass(e.call(this, t, this.className))
        });
        if (l)
          for (t = (e || "").match(pt) || []; s > r; r++)
            if (n = this[r], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(Mt, " ") : " ")) {
              for (a = 0; o = t[a++];) i.indexOf(" " + o + " ") < 0 && (i += o + " ");
              n.className = ut.trim(i)
            }
        return this
      },
      removeClass: function(e) {
        var t, n, i, o, a, r = 0,
          s = this.length,
          l = 0 === arguments.length || "string" == typeof e && e;
        if (ut.isFunction(e)) return this.each(function(t) {
          ut(this).removeClass(e.call(this, t, this.className))
        });
        if (l)
          for (t = (e || "").match(pt) || []; s > r; r++)
            if (n = this[r], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(Mt, " ") : "")) {
              for (a = 0; o = t[a++];)
                for (; i.indexOf(" " + o + " ") >= 0;) i = i.replace(" " + o + " ", " ");
              n.className = e ? ut.trim(i) : ""
            }
        return this
      },
      toggleClass: function(e, t) {
        var n = typeof e;
        return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : ut.isFunction(e) ? this.each(function(n) {
          ut(this).toggleClass(e.call(this, n, this.className, t), t)
        }) : this.each(function() {
          if ("string" === n)
            for (var t, i = 0, o = ut(this), a = e.match(pt) || []; t = a[i++];) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
          else(n === V || "boolean" === n) && (this.className && ut._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : ut._data(this, "__className__") || "")
        })
      },
      hasClass: function(e) {
        for (var t = " " + e + " ", n = 0, i = this.length; i > n; n++)
          if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(Mt, " ").indexOf(t) >= 0) return !0;
        return !1
      },
      val: function(e) {
        var n, i, o, a = this[0]; {
          if (arguments.length) return o = ut.isFunction(e), this.each(function(n) {
            var a;
            1 === this.nodeType && (a = o ? e.call(this, n, ut(this).val()) : e, null == a ? a = "" : "number" == typeof a ? a += "" : ut.isArray(a) && (a = ut.map(a, function(e) {
              return null == e ? "" : e + ""
            })), i = ut.valHooks[this.type] || ut.valHooks[this.nodeName.toLowerCase()], i && "set" in i && i.set(this, a, "value") !== t || (this.value = a))
          });
          if (a) return i = ut.valHooks[a.type] || ut.valHooks[a.nodeName.toLowerCase()], i && "get" in i && (n = i.get(a, "value")) !== t ? n : (n = a.value, "string" == typeof n ? n.replace(Ht, "") : null == n ? "" : n)
        }
      }
    }), ut.extend({
      valHooks: {
        option: {
          get: function(e) {
            var t = ut.find.attr(e, "value");
            return null != t ? t : e.text
          }
        },
        select: {
          get: function(e) {
            for (var t, n, i = e.options, o = e.selectedIndex, a = "select-one" === e.type || 0 > o, r = a ? null : [], s = a ? o + 1 : i.length, l = 0 > o ? s : a ? o : 0; s > l; l++)
              if (n = i[l], !(!n.selected && l !== o || (ut.support.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && ut.nodeName(n.parentNode, "optgroup"))) {
                if (t = ut(n).val(), a) return t;
                r.push(t)
              }
            return r
          },
          set: function(e, t) {
            for (var n, i, o = e.options, a = ut.makeArray(t), r = o.length; r--;) i = o[r], (i.selected = ut.inArray(ut(i).val(), a) >= 0) && (n = !0);
            return n || (e.selectedIndex = -1), a
          }
        }
      },
      attr: function(e, n, i) {
        var o, a, r = e.nodeType;
        if (e && 3 !== r && 8 !== r && 2 !== r) return typeof e.getAttribute === V ? ut.prop(e, n, i) : (1 === r && ut.isXMLDoc(e) || (n = n.toLowerCase(), o = ut.attrHooks[n] || (ut.expr.match.bool.test(n) ? Pt : Et)), i === t ? o && "get" in o && null !== (a = o.get(e, n)) ? a : (a = ut.find.attr(e, n), null == a ? t : a) : null !== i ? o && "set" in o && (a = o.set(e, i, n)) !== t ? a : (e.setAttribute(n, i + ""), i) : (ut.removeAttr(e, n), void 0))
      },
      removeAttr: function(e, t) {
        var n, i, o = 0,
          a = t && t.match(pt);
        if (a && 1 === e.nodeType)
          for (; n = a[o++];) i = ut.propFix[n] || n, ut.expr.match.bool.test(n) ? It && Nt || !Ot.test(n) ? e[i] = !1 : e[ut.camelCase("default-" + n)] = e[i] = !1 : ut.attr(e, n, ""), e.removeAttribute(Nt ? n : i)
      },
      attrHooks: {
        type: {
          set: function(e, t) {
            if (!ut.support.radioValue && "radio" === t && ut.nodeName(e, "input")) {
              var n = e.value;
              return e.setAttribute("type", t), n && (e.value = n), t
            }
          }
        }
      },
      propFix: {
        "for": "htmlFor",
        "class": "className"
      },
      prop: function(e, n, i) {
        var o, a, r, s = e.nodeType;
        if (e && 3 !== s && 8 !== s && 2 !== s) return r = 1 !== s || !ut.isXMLDoc(e), r && (n = ut.propFix[n] || n, a = ut.propHooks[n]), i !== t ? a && "set" in a && (o = a.set(e, i, n)) !== t ? o : e[n] = i : a && "get" in a && null !== (o = a.get(e, n)) ? o : e[n]
      },
      propHooks: {
        tabIndex: {
          get: function(e) {
            var t = ut.find.attr(e, "tabindex");
            return t ? parseInt(t, 10) : Lt.test(e.nodeName) || Dt.test(e.nodeName) && e.href ? 0 : -1
          }
        }
      }
    }), Pt = {
      set: function(e, t, n) {
        return t === !1 ? ut.removeAttr(e, n) : It && Nt || !Ot.test(n) ? e.setAttribute(!Nt && ut.propFix[n] || n, n) : e[ut.camelCase("default-" + n)] = e[n] = !0, n
      }
    }, ut.each(ut.expr.match.bool.source.match(/\w+/g), function(e, n) {
      var i = ut.expr.attrHandle[n] || ut.find.attr;
      ut.expr.attrHandle[n] = It && Nt || !Ot.test(n) ? function(e, n, o) {
        var a = ut.expr.attrHandle[n],
          r = o ? t : (ut.expr.attrHandle[n] = t) != i(e, n, o) ? n.toLowerCase() : null;
        return ut.expr.attrHandle[n] = a, r
      } : function(e, n, i) {
        return i ? t : e[ut.camelCase("default-" + n)] ? n.toLowerCase() : null
      }
    }), It && Nt || (ut.attrHooks.value = {
      set: function(e, t, n) {
        return ut.nodeName(e, "input") ? (e.defaultValue = t, void 0) : Et && Et.set(e, t, n)
      }
    }), Nt || (Et = {
      set: function(e, n, i) {
        var o = e.getAttributeNode(i);
        return o || e.setAttributeNode(o = e.ownerDocument.createAttribute(i)), o.value = n += "", "value" === i || n === e.getAttribute(i) ? n : t
      }
    }, ut.expr.attrHandle.id = ut.expr.attrHandle.name = ut.expr.attrHandle.coords = function(e, n, i) {
      var o;
      return i ? t : (o = e.getAttributeNode(n)) && "" !== o.value ? o.value : null
    }, ut.valHooks.button = {
      get: function(e, n) {
        var i = e.getAttributeNode(n);
        return i && i.specified ? i.value : t
      },
      set: Et.set
    }, ut.attrHooks.contenteditable = {
      set: function(e, t, n) {
        Et.set(e, "" === t ? !1 : t, n)
      }
    }, ut.each(["width", "height"], function(e, t) {
      ut.attrHooks[t] = {
        set: function(e, n) {
          return "" === n ? (e.setAttribute(t, "auto"), n) : void 0
        }
      }
    })), ut.support.hrefNormalized || ut.each(["href", "src"], function(e, t) {
      ut.propHooks[t] = {
        get: function(e) {
          return e.getAttribute(t, 4)
        }
      }
    }), ut.support.style || (ut.attrHooks.style = {
      get: function(e) {
        return e.style.cssText || t
      },
      set: function(e, t) {
        return e.style.cssText = t + ""
      }
    }), ut.support.optSelected || (ut.propHooks.selected = {
      get: function(e) {
        var t = e.parentNode;
        return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
      }
    }), ut.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
      ut.propFix[this.toLowerCase()] = this
    }), ut.support.enctype || (ut.propFix.enctype = "encoding"), ut.each(["radio", "checkbox"], function() {
      ut.valHooks[this] = {
        set: function(e, t) {
          return ut.isArray(t) ? e.checked = ut.inArray(ut(e).val(), t) >= 0 : void 0
        }
      }, ut.support.checkOn || (ut.valHooks[this].get = function(e) {
        return null === e.getAttribute("value") ? "on" : e.value
      })
    });
    var At = /^(?:input|select|textarea)$/i,
      jt = /^key/,
      Ft = /^(?:mouse|contextmenu)|click/,
      Rt = /^(?:focusinfocus|focusoutblur)$/,
      Bt = /^([^.]*)(?:\.(.+)|)$/;
    ut.event = {
      global: {},
      add: function(e, n, i, o, a) {
        var r, s, l, c, u, d, p, h, f, m, g, v = ut._data(e);
        if (v) {
          for (i.handler && (c = i, i = c.handler, a = c.selector), i.guid || (i.guid = ut.guid++), (s = v.events) || (s = v.events = {}), (d = v.handle) || (d = v.handle = function(e) {
              return typeof ut === V || e && ut.event.triggered === e.type ? t : ut.event.dispatch.apply(d.elem, arguments)
            }, d.elem = e), n = (n || "").match(pt) || [""], l = n.length; l--;) r = Bt.exec(n[l]) || [], f = g = r[1], m = (r[2] || "").split(".").sort(), f && (u = ut.event.special[f] || {}, f = (a ? u.delegateType : u.bindType) || f, u = ut.event.special[f] || {}, p = ut.extend({
            type: f,
            origType: g,
            data: o,
            handler: i,
            guid: i.guid,
            selector: a,
            needsContext: a && ut.expr.match.needsContext.test(a),
            namespace: m.join(".")
          }, c), (h = s[f]) || (h = s[f] = [], h.delegateCount = 0, u.setup && u.setup.call(e, o, m, d) !== !1 || (e.addEventListener ? e.addEventListener(f, d, !1) : e.attachEvent && e.attachEvent("on" + f, d))), u.add && (u.add.call(e, p), p.handler.guid || (p.handler.guid = i.guid)), a ? h.splice(h.delegateCount++, 0, p) : h.push(p), ut.event.global[f] = !0);
          e = null
        }
      },
      remove: function(e, t, n, i, o) {
        var a, r, s, l, c, u, d, p, h, f, m, g = ut.hasData(e) && ut._data(e);
        if (g && (u = g.events)) {
          for (t = (t || "").match(pt) || [""], c = t.length; c--;)
            if (s = Bt.exec(t[c]) || [], h = m = s[1], f = (s[2] || "").split(".").sort(), h) {
              for (d = ut.event.special[h] || {}, h = (i ? d.delegateType : d.bindType) || h, p = u[h] || [], s = s[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = a = p.length; a--;) r = p[a], !o && m !== r.origType || n && n.guid !== r.guid || s && !s.test(r.namespace) || i && i !== r.selector && ("**" !== i || !r.selector) || (p.splice(a, 1), r.selector && p.delegateCount--, d.remove && d.remove.call(e, r));
              l && !p.length && (d.teardown && d.teardown.call(e, f, g.handle) !== !1 || ut.removeEvent(e, h, g.handle), delete u[h])
            } else
              for (h in u) ut.event.remove(e, h + t[c], n, i, !0);
          ut.isEmptyObject(u) && (delete g.handle, ut._removeData(e, "events"))
        }
      },
      trigger: function(n, i, o, a) {
        var r, s, l, c, u, d, p, h = [o || Q],
          f = lt.call(n, "type") ? n.type : n,
          m = lt.call(n, "namespace") ? n.namespace.split(".") : [];
        if (l = d = o = o || Q, 3 !== o.nodeType && 8 !== o.nodeType && !Rt.test(f + ut.event.triggered) && (f.indexOf(".") >= 0 && (m = f.split("."), f = m.shift(), m.sort()), s = f.indexOf(":") < 0 && "on" + f, n = n[ut.expando] ? n : new ut.Event(f, "object" == typeof n && n), n.isTrigger = a ? 2 : 3, n.namespace = m.join("."), n.namespace_re = n.namespace ? new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, n.result = t, n.target || (n.target = o), i = null == i ? [n] : ut.makeArray(i, [n]), u = ut.event.special[f] || {}, a || !u.trigger || u.trigger.apply(o, i) !== !1)) {
          if (!a && !u.noBubble && !ut.isWindow(o)) {
            for (c = u.delegateType || f, Rt.test(c + f) || (l = l.parentNode); l; l = l.parentNode) h.push(l), d = l;
            d === (o.ownerDocument || Q) && h.push(d.defaultView || d.parentWindow || e)
          }
          for (p = 0;
            (l = h[p++]) && !n.isPropagationStopped();) n.type = p > 1 ? c : u.bindType || f, r = (ut._data(l, "events") || {})[n.type] && ut._data(l, "handle"), r && r.apply(l, i), r = s && l[s], r && ut.acceptData(l) && r.apply && r.apply(l, i) === !1 && n.preventDefault();
          if (n.type = f, !a && !n.isDefaultPrevented() && (!u._default || u._default.apply(h.pop(), i) === !1) && ut.acceptData(o) && s && o[f] && !ut.isWindow(o)) {
            d = o[s], d && (o[s] = null), ut.event.triggered = f;
            try {
              o[f]()
            } catch (g) {}
            ut.event.triggered = t, d && (o[s] = d)
          }
          return n.result
        }
      },
      dispatch: function(e) {
        e = ut.event.fix(e);
        var n, i, o, a, r, s = [],
          l = at.call(arguments),
          c = (ut._data(this, "events") || {})[e.type] || [],
          u = ut.event.special[e.type] || {};
        if (l[0] = e, e.delegateTarget = this, !u.preDispatch || u.preDispatch.call(this, e) !== !1) {
          for (s = ut.event.handlers.call(this, e, c), n = 0;
            (a = s[n++]) && !e.isPropagationStopped();)
            for (e.currentTarget = a.elem, r = 0;
              (o = a.handlers[r++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(o.namespace)) && (e.handleObj = o, e.data = o.data, i = ((ut.event.special[o.origType] || {}).handle || o.handler).apply(a.elem, l), i !== t && (e.result = i) === !1 && (e.preventDefault(), e.stopPropagation()));
          return u.postDispatch && u.postDispatch.call(this, e), e.result
        }
      },
      handlers: function(e, n) {
        var i, o, a, r, s = [],
          l = n.delegateCount,
          c = e.target;
        if (l && c.nodeType && (!e.button || "click" !== e.type))
          for (; c != this; c = c.parentNode || this)
            if (1 === c.nodeType && (c.disabled !== !0 || "click" !== e.type)) {
              for (a = [], r = 0; l > r; r++) o = n[r], i = o.selector + " ", a[i] === t && (a[i] = o.needsContext ? ut(i, this).index(c) >= 0 : ut.find(i, this, null, [c]).length), a[i] && a.push(o);
              a.length && s.push({
                elem: c,
                handlers: a
              })
            }
        return l < n.length && s.push({
          elem: this,
          handlers: n.slice(l)
        }), s
      },
      fix: function(e) {
        if (e[ut.expando]) return e;
        var t, n, i, o = e.type,
          a = e,
          r = this.fixHooks[o];
        for (r || (this.fixHooks[o] = r = Ft.test(o) ? this.mouseHooks : jt.test(o) ? this.keyHooks : {}), i = r.props ? this.props.concat(r.props) : this.props, e = new ut.Event(a), t = i.length; t--;) n = i[t], e[n] = a[n];
        return e.target || (e.target = a.srcElement || Q), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, r.filter ? r.filter(e, a) : e
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
        filter: function(e, n) {
          var i, o, a, r = n.button,
            s = n.fromElement;
          return null == e.pageX && null != n.clientX && (o = e.target.ownerDocument || Q, a = o.documentElement, i = o.body, e.pageX = n.clientX + (a && a.scrollLeft || i && i.scrollLeft || 0) - (a && a.clientLeft || i && i.clientLeft || 0), e.pageY = n.clientY + (a && a.scrollTop || i && i.scrollTop || 0) - (a && a.clientTop || i && i.clientTop || 0)), !e.relatedTarget && s && (e.relatedTarget = s === e.target ? n.toElement : s), e.which || r === t || (e.which = 1 & r ? 1 : 2 & r ? 3 : 4 & r ? 2 : 0), e
        }
      },
      special: {
        load: {
          noBubble: !0
        },
        focus: {
          trigger: function() {
            if (this !== u() && this.focus) try {
              return this.focus(), !1
            } catch (e) {}
          },
          delegateType: "focusin"
        },
        blur: {
          trigger: function() {
            return this === u() && this.blur ? (this.blur(), !1) : void 0
          },
          delegateType: "focusout"
        },
        click: {
          trigger: function() {
            return ut.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
          },
          _default: function(e) {
            return ut.nodeName(e.target, "a")
          }
        },
        beforeunload: {
          postDispatch: function(e) {
            e.result !== t && (e.originalEvent.returnValue = e.result)
          }
        }
      },
      simulate: function(e, t, n, i) {
        var o = ut.extend(new ut.Event, n, {
          type: e,
          isSimulated: !0,
          originalEvent: {}
        });
        i ? ut.event.trigger(o, null, t) : ut.event.dispatch.call(t, o), o.isDefaultPrevented() && n.preventDefault()
      }
    }, ut.removeEvent = Q.removeEventListener ? function(e, t, n) {
      e.removeEventListener && e.removeEventListener(t, n, !1)
    } : function(e, t, n) {
      var i = "on" + t;
      e.detachEvent && (typeof e[i] === V && (e[i] = null), e.detachEvent(i, n))
    }, ut.Event = function(e, t) {
      return this instanceof ut.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? l : c) : this.type = e, t && ut.extend(this, t), this.timeStamp = e && e.timeStamp || ut.now(), this[ut.expando] = !0, void 0) : new ut.Event(e, t)
    }, ut.Event.prototype = {
      isDefaultPrevented: c,
      isPropagationStopped: c,
      isImmediatePropagationStopped: c,
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
    }, ut.each({
      mouseenter: "mouseover",
      mouseleave: "mouseout"
    }, function(e, t) {
      ut.event.special[e] = {
        delegateType: t,
        bindType: t,
        handle: function(e) {
          var n, i = this,
            o = e.relatedTarget,
            a = e.handleObj;
          return (!o || o !== i && !ut.contains(i, o)) && (e.type = a.origType, n = a.handler.apply(this, arguments), e.type = t), n
        }
      }
    }), ut.support.submitBubbles || (ut.event.special.submit = {
      setup: function() {
        return ut.nodeName(this, "form") ? !1 : (ut.event.add(this, "click._submit keypress._submit", function(e) {
          var n = e.target,
            i = ut.nodeName(n, "input") || ut.nodeName(n, "button") ? n.form : t;
          i && !ut._data(i, "submitBubbles") && (ut.event.add(i, "submit._submit", function(e) {
            e._submit_bubble = !0
          }), ut._data(i, "submitBubbles", !0))
        }), void 0)
      },
      postDispatch: function(e) {
        e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && ut.event.simulate("submit", this.parentNode, e, !0))
      },
      teardown: function() {
        return ut.nodeName(this, "form") ? !1 : (ut.event.remove(this, "._submit"), void 0)
      }
    }), ut.support.changeBubbles || (ut.event.special.change = {
      setup: function() {
        return At.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (ut.event.add(this, "propertychange._change", function(e) {
          "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
        }), ut.event.add(this, "click._change", function(e) {
          this._just_changed && !e.isTrigger && (this._just_changed = !1), ut.event.simulate("change", this, e, !0)
        })), !1) : (ut.event.add(this, "beforeactivate._change", function(e) {
          var t = e.target;
          At.test(t.nodeName) && !ut._data(t, "changeBubbles") && (ut.event.add(t, "change._change", function(e) {
            !this.parentNode || e.isSimulated || e.isTrigger || ut.event.simulate("change", this.parentNode, e, !0)
          }), ut._data(t, "changeBubbles", !0))
        }), void 0)
      },
      handle: function(e) {
        var t = e.target;
        return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
      },
      teardown: function() {
        return ut.event.remove(this, "._change"), !At.test(this.nodeName)
      }
    }), ut.support.focusinBubbles || ut.each({
      focus: "focusin",
      blur: "focusout"
    }, function(e, t) {
      var n = 0,
        i = function(e) {
          ut.event.simulate(t, e.target, ut.event.fix(e), !0)
        };
      ut.event.special[t] = {
        setup: function() {
          0 === n++ && Q.addEventListener(e, i, !0)
        },
        teardown: function() {
          0 === --n && Q.removeEventListener(e, i, !0)
        }
      }
    }), ut.fn.extend({
      on: function(e, n, i, o, a) {
        var r, s;
        if ("object" == typeof e) {
          "string" != typeof n && (i = i || n, n = t);
          for (r in e) this.on(r, n, i, e[r], a);
          return this
        }
        if (null == i && null == o ? (o = n, i = n = t) : null == o && ("string" == typeof n ? (o = i, i = t) : (o = i, i = n, n = t)), o === !1) o = c;
        else if (!o) return this;
        return 1 === a && (s = o, o = function(e) {
          return ut().off(e), s.apply(this, arguments)
        }, o.guid = s.guid || (s.guid = ut.guid++)), this.each(function() {
          ut.event.add(this, e, o, i, n)
        })
      },
      one: function(e, t, n, i) {
        return this.on(e, t, n, i, 1)
      },
      off: function(e, n, i) {
        var o, a;
        if (e && e.preventDefault && e.handleObj) return o = e.handleObj, ut(e.delegateTarget).off(o.namespace ? o.origType + "." + o.namespace : o.origType, o.selector, o.handler), this;
        if ("object" == typeof e) {
          for (a in e) this.off(a, n, e[a]);
          return this
        }
        return (n === !1 || "function" == typeof n) && (i = n, n = t), i === !1 && (i = c), this.each(function() {
          ut.event.remove(this, e, i, n)
        })
      },
      trigger: function(e, t) {
        return this.each(function() {
          ut.event.trigger(e, t, this)
        })
      },
      triggerHandler: function(e, t) {
        var n = this[0];
        return n ? ut.event.trigger(e, t, n, !0) : void 0
      }
    });
    var zt = /^.[^:#\[\.,]*$/,
      qt = /^(?:parents|prev(?:Until|All))/,
      Ut = ut.expr.match.needsContext,
      Wt = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
      };
    ut.fn.extend({
      find: function(e) {
        var t, n = [],
          i = this,
          o = i.length;
        if ("string" != typeof e) return this.pushStack(ut(e).filter(function() {
          for (t = 0; o > t; t++)
            if (ut.contains(i[t], this)) return !0
        }));
        for (t = 0; o > t; t++) ut.find(e, i[t], n);
        return n = this.pushStack(o > 1 ? ut.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
      },
      has: function(e) {
        var t, n = ut(e, this),
          i = n.length;
        return this.filter(function() {
          for (t = 0; i > t; t++)
            if (ut.contains(this, n[t])) return !0
        })
      },
      not: function(e) {
        return this.pushStack(p(this, e || [], !0))
      },
      filter: function(e) {
        return this.pushStack(p(this, e || [], !1))
      },
      is: function(e) {
        return !!p(this, "string" == typeof e && Ut.test(e) ? ut(e) : e || [], !1).length
      },
      closest: function(e, t) {
        for (var n, i = 0, o = this.length, a = [], r = Ut.test(e) || "string" != typeof e ? ut(e, t || this.context) : 0; o > i; i++)
          for (n = this[i]; n && n !== t; n = n.parentNode)
            if (n.nodeType < 11 && (r ? r.index(n) > -1 : 1 === n.nodeType && ut.find.matchesSelector(n, e))) {
              n = a.push(n);
              break
            }
        return this.pushStack(a.length > 1 ? ut.unique(a) : a)
      },
      index: function(e) {
        return e ? "string" == typeof e ? ut.inArray(this[0], ut(e)) : ut.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
      },
      add: function(e, t) {
        var n = "string" == typeof e ? ut(e, t) : ut.makeArray(e && e.nodeType ? [e] : e),
          i = ut.merge(this.get(), n);
        return this.pushStack(ut.unique(i))
      },
      addBack: function(e) {
        return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
      }
    }), ut.each({
      parent: function(e) {
        var t = e.parentNode;
        return t && 11 !== t.nodeType ? t : null
      },
      parents: function(e) {
        return ut.dir(e, "parentNode")
      },
      parentsUntil: function(e, t, n) {
        return ut.dir(e, "parentNode", n)
      },
      next: function(e) {
        return d(e, "nextSibling")
      },
      prev: function(e) {
        return d(e, "previousSibling")
      },
      nextAll: function(e) {
        return ut.dir(e, "nextSibling")
      },
      prevAll: function(e) {
        return ut.dir(e, "previousSibling")
      },
      nextUntil: function(e, t, n) {
        return ut.dir(e, "nextSibling", n)
      },
      prevUntil: function(e, t, n) {
        return ut.dir(e, "previousSibling", n)
      },
      siblings: function(e) {
        return ut.sibling((e.parentNode || {}).firstChild, e)
      },
      children: function(e) {
        return ut.sibling(e.firstChild)
      },
      contents: function(e) {
        return ut.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : ut.merge([], e.childNodes)
      }
    }, function(e, t) {
      ut.fn[e] = function(n, i) {
        var o = ut.map(this, t, n);
        return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (o = ut.filter(i, o)), this.length > 1 && (Wt[e] || (o = ut.unique(o)), qt.test(e) && (o = o.reverse())), this.pushStack(o)
      }
    }), ut.extend({
      filter: function(e, t, n) {
        var i = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? ut.find.matchesSelector(i, e) ? [i] : [] : ut.find.matches(e, ut.grep(t, function(e) {
          return 1 === e.nodeType
        }))
      },
      dir: function(e, n, i) {
        for (var o = [], a = e[n]; a && 9 !== a.nodeType && (i === t || 1 !== a.nodeType || !ut(a).is(i));) 1 === a.nodeType && o.push(a), a = a[n];
        return o
      },
      sibling: function(e, t) {
        for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
        return n
      }
    });
    var Xt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
      Yt = / jQuery\d+="(?:null|\d+)"/g,
      Vt = new RegExp("<(?:" + Xt + ")[\\s/>]", "i"),
      Gt = /^\s+/,
      Qt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
      Kt = /<([\w:]+)/,
      Jt = /<tbody/i,
      Zt = /<|&#?\w+;/,
      en = /<(?:script|style|link)/i,
      tn = /^(?:checkbox|radio)$/i,
      nn = /checked\s*(?:[^=]|=\s*.checked.)/i,
      on = /^$|\/(?:java|ecma)script/i,
      an = /^true\/(.*)/,
      rn = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
      sn = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: ut.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
      },
      ln = h(Q),
      cn = ln.appendChild(Q.createElement("div"));
    sn.optgroup = sn.option, sn.tbody = sn.tfoot = sn.colgroup = sn.caption = sn.thead, sn.th = sn.td, ut.fn.extend({
      text: function(e) {
        return ut.access(this, function(e) {
          return e === t ? ut.text(this) : this.empty().append((this[0] && this[0].ownerDocument || Q).createTextNode(e))
        }, null, e, arguments.length)
      },
      append: function() {
        return this.domManip(arguments, function(e) {
          if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
            var t = f(this, e);
            t.appendChild(e)
          }
        })
      },
      prepend: function() {
        return this.domManip(arguments, function(e) {
          if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
            var t = f(this, e);
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
        for (var n, i = e ? ut.filter(e, this) : this, o = 0; null != (n = i[o]); o++) t || 1 !== n.nodeType || ut.cleanData(b(n)), n.parentNode && (t && ut.contains(n.ownerDocument, n) && v(b(n, "script")), n.parentNode.removeChild(n));
        return this
      },
      empty: function() {
        for (var e, t = 0; null != (e = this[t]); t++) {
          for (1 === e.nodeType && ut.cleanData(b(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
          e.options && ut.nodeName(e, "select") && (e.options.length = 0)
        }
        return this
      },
      clone: function(e, t) {
        return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
          return ut.clone(this, e, t)
        })
      },
      html: function(e) {
        return ut.access(this, function(e) {
          var n = this[0] || {},
            i = 0,
            o = this.length;
          if (e === t) return 1 === n.nodeType ? n.innerHTML.replace(Yt, "") : t;
          if (!("string" != typeof e || en.test(e) || !ut.support.htmlSerialize && Vt.test(e) || !ut.support.leadingWhitespace && Gt.test(e) || sn[(Kt.exec(e) || ["", ""])[1].toLowerCase()])) {
            e = e.replace(Qt, "<$1></$2>");
            try {
              for (; o > i; i++) n = this[i] || {}, 1 === n.nodeType && (ut.cleanData(b(n, !1)), n.innerHTML = e);
              n = 0
            } catch (a) {}
          }
          n && this.empty().append(e)
        }, null, e, arguments.length)
      },
      replaceWith: function() {
        var e = ut.map(this, function(e) {
            return [e.nextSibling, e.parentNode]
          }),
          t = 0;
        return this.domManip(arguments, function(n) {
          var i = e[t++],
            o = e[t++];
          o && (i && i.parentNode !== o && (i = this.nextSibling), ut(this).remove(), o.insertBefore(n, i))
        }, !0), t ? this : this.remove()
      },
      detach: function(e) {
        return this.remove(e, !0)
      },
      domManip: function(e, t, n) {
        e = it.apply([], e);
        var i, o, a, r, s, l, c = 0,
          u = this.length,
          d = this,
          p = u - 1,
          h = e[0],
          f = ut.isFunction(h);
        if (f || !(1 >= u || "string" != typeof h || ut.support.checkClone) && nn.test(h)) return this.each(function(i) {
          var o = d.eq(i);
          f && (e[0] = h.call(this, i, o.html())), o.domManip(e, t, n)
        });
        if (u && (l = ut.buildFragment(e, this[0].ownerDocument, !1, !n && this), i = l.firstChild, 1 === l.childNodes.length && (l = i), i)) {
          for (r = ut.map(b(l, "script"), m), a = r.length; u > c; c++) o = l, c !== p && (o = ut.clone(o, !0, !0), a && ut.merge(r, b(o, "script"))), t.call(this[c], o, c);
          if (a)
            for (s = r[r.length - 1].ownerDocument, ut.map(r, g), c = 0; a > c; c++) o = r[c], on.test(o.type || "") && !ut._data(o, "globalEval") && ut.contains(s, o) && (o.src ? ut._evalUrl(o.src) : ut.globalEval((o.text || o.textContent || o.innerHTML || "").replace(rn, "")));
          l = i = null
        }
        return this
      }
    }), ut.each({
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith"
    }, function(e, t) {
      ut.fn[e] = function(e) {
        for (var n, i = 0, o = [], a = ut(e), r = a.length - 1; r >= i; i++) n = i === r ? this : this.clone(!0), ut(a[i])[t](n), ot.apply(o, n.get());
        return this.pushStack(o)
      }
    }), ut.extend({
      clone: function(e, t, n) {
        var i, o, a, r, s, l = ut.contains(e.ownerDocument, e);
        if (ut.support.html5Clone || ut.isXMLDoc(e) || !Vt.test("<" + e.nodeName + ">") ? a = e.cloneNode(!0) : (cn.innerHTML = e.outerHTML, cn.removeChild(a = cn.firstChild)), !(ut.support.noCloneEvent && ut.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || ut.isXMLDoc(e)))
          for (i = b(a), s = b(e), r = 0; null != (o = s[r]); ++r) i[r] && w(o, i[r]);
        if (t)
          if (n)
            for (s = s || b(e), i = i || b(a), r = 0; null != (o = s[r]); r++) y(o, i[r]);
          else y(e, a);
        return i = b(a, "script"), i.length > 0 && v(i, !l && b(e, "script")), i = s = o = null, a
      },
      buildFragment: function(e, t, n, i) {
        for (var o, a, r, s, l, c, u, d = e.length, p = h(t), f = [], m = 0; d > m; m++)
          if (a = e[m], a || 0 === a)
            if ("object" === ut.type(a)) ut.merge(f, a.nodeType ? [a] : a);
            else if (Zt.test(a)) {
          for (s = s || p.appendChild(t.createElement("div")), l = (Kt.exec(a) || ["", ""])[1].toLowerCase(), u = sn[l] || sn._default, s.innerHTML = u[1] + a.replace(Qt, "<$1></$2>") + u[2], o = u[0]; o--;) s = s.lastChild;
          if (!ut.support.leadingWhitespace && Gt.test(a) && f.push(t.createTextNode(Gt.exec(a)[0])), !ut.support.tbody)
            for (a = "table" !== l || Jt.test(a) ? "<table>" !== u[1] || Jt.test(a) ? 0 : s : s.firstChild, o = a && a.childNodes.length; o--;) ut.nodeName(c = a.childNodes[o], "tbody") && !c.childNodes.length && a.removeChild(c);
          for (ut.merge(f, s.childNodes), s.textContent = ""; s.firstChild;) s.removeChild(s.firstChild);
          s = p.lastChild
        } else f.push(t.createTextNode(a));
        for (s && p.removeChild(s), ut.support.appendChecked || ut.grep(b(f, "input"), _), m = 0; a = f[m++];)
          if ((!i || -1 === ut.inArray(a, i)) && (r = ut.contains(a.ownerDocument, a), s = b(p.appendChild(a), "script"), r && v(s), n))
            for (o = 0; a = s[o++];) on.test(a.type || "") && n.push(a);
        return s = null, p
      },
      cleanData: function(e, t) {
        for (var n, i, o, a, r = 0, s = ut.expando, l = ut.cache, c = ut.support.deleteExpando, u = ut.event.special; null != (n = e[r]); r++)
          if ((t || ut.acceptData(n)) && (o = n[s], a = o && l[o])) {
            if (a.events)
              for (i in a.events) u[i] ? ut.event.remove(n, i) : ut.removeEvent(n, i, a.handle);
            l[o] && (delete l[o], c ? delete n[s] : typeof n.removeAttribute !== V ? n.removeAttribute(s) : n[s] = null, tt.push(o))
          }
      },
      _evalUrl: function(e) {
        return ut.ajax({
          url: e,
          type: "GET",
          dataType: "script",
          async: !1,
          global: !1,
          "throws": !0
        })
      }
    }), ut.fn.extend({
      wrapAll: function(e) {
        if (ut.isFunction(e)) return this.each(function(t) {
          ut(this).wrapAll(e.call(this, t))
        });
        if (this[0]) {
          var t = ut(e, this[0].ownerDocument).eq(0).clone(!0);
          this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
            for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
            return e
          }).append(this)
        }
        return this
      },
      wrapInner: function(e) {
        return ut.isFunction(e) ? this.each(function(t) {
          ut(this).wrapInner(e.call(this, t))
        }) : this.each(function() {
          var t = ut(this),
            n = t.contents();
          n.length ? n.wrapAll(e) : t.append(e)
        })
      },
      wrap: function(e) {
        var t = ut.isFunction(e);
        return this.each(function(n) {
          ut(this).wrapAll(t ? e.call(this, n) : e)
        })
      },
      unwrap: function() {
        return this.parent().each(function() {
          ut.nodeName(this, "body") || ut(this).replaceWith(this.childNodes)
        }).end()
      }
    });
    var un, dn, pn, hn = /alpha\([^)]*\)/i,
      fn = /opacity\s*=\s*([^)]*)/,
      mn = /^(top|right|bottom|left)$/,
      gn = /^(none|table(?!-c[ea]).+)/,
      vn = /^margin/,
      yn = new RegExp("^(" + dt + ")(.*)$", "i"),
      wn = new RegExp("^(" + dt + ")(?!px)[a-z%]+$", "i"),
      bn = new RegExp("^([+-])=(" + dt + ")", "i"),
      _n = {
        BODY: "block"
      },
      xn = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
      },
      $n = {
        letterSpacing: 0,
        fontWeight: 400
      },
      Sn = ["Top", "Right", "Bottom", "Left"],
      Tn = ["Webkit", "O", "Moz", "ms"];
    ut.fn.extend({
      css: function(e, n) {
        return ut.access(this, function(e, n, i) {
          var o, a, r = {},
            s = 0;
          if (ut.isArray(n)) {
            for (a = dn(e), o = n.length; o > s; s++) r[n[s]] = ut.css(e, n[s], !1, a);
            return r
          }
          return i !== t ? ut.style(e, n, i) : ut.css(e, n)
        }, e, n, arguments.length > 1)
      },
      show: function() {
        return S(this, !0)
      },
      hide: function() {
        return S(this)
      },
      toggle: function(e) {
        return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
          $(this) ? ut(this).show() : ut(this).hide()
        })
      }
    }), ut.extend({
      cssHooks: {
        opacity: {
          get: function(e, t) {
            if (t) {
              var n = pn(e, "opacity");
              return "" === n ? "1" : n
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
        "float": ut.support.cssFloat ? "cssFloat" : "styleFloat"
      },
      style: function(e, n, i, o) {
        if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
          var a, r, s, l = ut.camelCase(n),
            c = e.style;
          if (n = ut.cssProps[l] || (ut.cssProps[l] = x(c, l)), s = ut.cssHooks[n] || ut.cssHooks[l], i === t) return s && "get" in s && (a = s.get(e, !1, o)) !== t ? a : c[n];
          if (r = typeof i, "string" === r && (a = bn.exec(i)) && (i = (a[1] + 1) * a[2] + parseFloat(ut.css(e, n)), r = "number"), !(null == i || "number" === r && isNaN(i) || ("number" !== r || ut.cssNumber[l] || (i += "px"), ut.support.clearCloneStyle || "" !== i || 0 !== n.indexOf("background") || (c[n] = "inherit"), s && "set" in s && (i = s.set(e, i, o)) === t))) try {
            c[n] = i
          } catch (u) {}
        }
      },
      css: function(e, n, i, o) {
        var a, r, s, l = ut.camelCase(n);
        return n = ut.cssProps[l] || (ut.cssProps[l] = x(e.style, l)), s = ut.cssHooks[n] || ut.cssHooks[l], s && "get" in s && (r = s.get(e, !0, i)), r === t && (r = pn(e, n, o)), "normal" === r && n in $n && (r = $n[n]), "" === i || i ? (a = parseFloat(r), i === !0 || ut.isNumeric(a) ? a || 0 : r) : r
      }
    }), e.getComputedStyle ? (dn = function(t) {
      return e.getComputedStyle(t, null)
    }, pn = function(e, n, i) {
      var o, a, r, s = i || dn(e),
        l = s ? s.getPropertyValue(n) || s[n] : t,
        c = e.style;
      return s && ("" !== l || ut.contains(e.ownerDocument, e) || (l = ut.style(e, n)), wn.test(l) && vn.test(n) && (o = c.width, a = c.minWidth, r = c.maxWidth, c.minWidth = c.maxWidth = c.width = l, l = s.width, c.width = o, c.minWidth = a, c.maxWidth = r)), l
    }) : Q.documentElement.currentStyle && (dn = function(e) {
      return e.currentStyle
    }, pn = function(e, n, i) {
      var o, a, r, s = i || dn(e),
        l = s ? s[n] : t,
        c = e.style;
      return null == l && c && c[n] && (l = c[n]), wn.test(l) && !mn.test(n) && (o = c.left, a = e.runtimeStyle, r = a && a.left, r && (a.left = e.currentStyle.left), c.left = "fontSize" === n ? "1em" : l, l = c.pixelLeft + "px", c.left = o, r && (a.left = r)), "" === l ? "auto" : l
    }), ut.each(["height", "width"], function(e, t) {
      ut.cssHooks[t] = {
        get: function(e, n, i) {
          return n ? 0 === e.offsetWidth && gn.test(ut.css(e, "display")) ? ut.swap(e, xn, function() {
            return C(e, t, i)
          }) : C(e, t, i) : void 0
        },
        set: function(e, n, i) {
          var o = i && dn(e);
          return T(e, n, i ? k(e, t, i, ut.support.boxSizing && "border-box" === ut.css(e, "boxSizing", !1, o), o) : 0)
        }
      }
    }), ut.support.opacity || (ut.cssHooks.opacity = {
      get: function(e, t) {
        return fn.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
      },
      set: function(e, t) {
        var n = e.style,
          i = e.currentStyle,
          o = ut.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
          a = i && i.filter || n.filter || "";
        n.zoom = 1, (t >= 1 || "" === t) && "" === ut.trim(a.replace(hn, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || i && !i.filter) || (n.filter = hn.test(a) ? a.replace(hn, o) : a + " " + o)
      }
    }), ut(function() {
      ut.support.reliableMarginRight || (ut.cssHooks.marginRight = {
        get: function(e, t) {
          return t ? ut.swap(e, {
            display: "inline-block"
          }, pn, [e, "marginRight"]) : void 0
        }
      }), !ut.support.pixelPosition && ut.fn.position && ut.each(["top", "left"], function(e, t) {
        ut.cssHooks[t] = {
          get: function(e, n) {
            return n ? (n = pn(e, t), wn.test(n) ? ut(e).position()[t] + "px" : n) : void 0
          }
        }
      })
    }), ut.expr && ut.expr.filters && (ut.expr.filters.hidden = function(e) {
      return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !ut.support.reliableHiddenOffsets && "none" === (e.style && e.style.display || ut.css(e, "display"))
    }, ut.expr.filters.visible = function(e) {
      return !ut.expr.filters.hidden(e)
    }), ut.each({
      margin: "",
      padding: "",
      border: "Width"
    }, function(e, t) {
      ut.cssHooks[e + t] = {
        expand: function(n) {
          for (var i = 0, o = {}, a = "string" == typeof n ? n.split(" ") : [n]; 4 > i; i++) o[e + Sn[i] + t] = a[i] || a[i - 2] || a[0];
          return o
        }
      }, vn.test(e) || (ut.cssHooks[e + t].set = T)
    });
    var kn = /%20/g,
      Cn = /\[\]$/,
      En = /\r?\n/g,
      Pn = /^(?:submit|button|image|reset|file)$/i,
      Mn = /^(?:input|select|textarea|keygen)/i;
    ut.fn.extend({
      serialize: function() {
        return ut.param(this.serializeArray())
      },
      serializeArray: function() {
        return this.map(function() {
          var e = ut.prop(this, "elements");
          return e ? ut.makeArray(e) : this
        }).filter(function() {
          var e = this.type;
          return this.name && !ut(this).is(":disabled") && Mn.test(this.nodeName) && !Pn.test(e) && (this.checked || !tn.test(e))
        }).map(function(e, t) {
          var n = ut(this).val();
          return null == n ? null : ut.isArray(n) ? ut.map(n, function(e) {
            return {
              name: t.name,
              value: e.replace(En, "\r\n")
            }
          }) : {
            name: t.name,
            value: n.replace(En, "\r\n")
          }
        }).get()
      }
    }), ut.param = function(e, n) {
      var i, o = [],
        a = function(e, t) {
          t = ut.isFunction(t) ? t() : null == t ? "" : t, o[o.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
        };
      if (n === t && (n = ut.ajaxSettings && ut.ajaxSettings.traditional), ut.isArray(e) || e.jquery && !ut.isPlainObject(e)) ut.each(e, function() {
        a(this.name, this.value)
      });
      else
        for (i in e) M(i, e[i], n, a);
      return o.join("&").replace(kn, "+")
    }, ut.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
      ut.fn[t] = function(e, n) {
        return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
      }
    }), ut.fn.extend({
      hover: function(e, t) {
        return this.mouseenter(e).mouseleave(t || e)
      },
      bind: function(e, t, n) {
        return this.on(e, null, t, n)
      },
      unbind: function(e, t) {
        return this.off(e, null, t)
      },
      delegate: function(e, t, n, i) {
        return this.on(t, e, n, i)
      },
      undelegate: function(e, t, n) {
        return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
      }
    });
    var Hn, Ln, Dn = ut.now(),
      On = /\?/,
      Nn = /#.*$/,
      In = /([?&])_=[^&]*/,
      An = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
      jn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
      Fn = /^(?:GET|HEAD)$/,
      Rn = /^\/\//,
      Bn = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
      zn = ut.fn.load,
      qn = {},
      Un = {},
      Wn = "*/".concat("*");
    try {
      Ln = G.href
    } catch (Xn) {
      Ln = Q.createElement("a"), Ln.href = "", Ln = Ln.href
    }
    Hn = Bn.exec(Ln.toLowerCase()) || [], ut.fn.load = function(e, n, i) {
      if ("string" != typeof e && zn) return zn.apply(this, arguments);
      var o, a, r, s = this,
        l = e.indexOf(" ");
      return l >= 0 && (o = e.slice(l, e.length), e = e.slice(0, l)), ut.isFunction(n) ? (i = n, n = t) : n && "object" == typeof n && (r = "POST"), s.length > 0 && ut.ajax({
        url: e,
        type: r,
        dataType: "html",
        data: n
      }).done(function(e) {
        a = arguments, s.html(o ? ut("<div>").append(ut.parseHTML(e)).find(o) : e)
      }).complete(i && function(e, t) {
        s.each(i, a || [e.responseText, t, e])
      }), this
    }, ut.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
      ut.fn[t] = function(e) {
        return this.on(t, e)
      }
    }), ut.extend({
      active: 0,
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: Ln,
        type: "GET",
        isLocal: jn.test(Hn[1]),
        global: !0,
        processData: !0,
        async: !0,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        accepts: {
          "*": Wn,
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
          "text json": ut.parseJSON,
          "text xml": ut.parseXML
        },
        flatOptions: {
          url: !0,
          context: !0
        }
      },
      ajaxSetup: function(e, t) {
        return t ? D(D(e, ut.ajaxSettings), t) : D(ut.ajaxSettings, e)
      },
      ajaxPrefilter: H(qn),
      ajaxTransport: H(Un),
      ajax: function(e, n) {
        function i(e, n, i, o) {
          var a, d, y, w, _, $ = n;
          2 !== b && (b = 2, l && clearTimeout(l), u = t, s = o || "", x.readyState = e > 0 ? 4 : 0, a = e >= 200 && 300 > e || 304 === e, i && (w = O(p, x, i)), w = N(p, w, x, a), a ? (p.ifModified && (_ = x.getResponseHeader("Last-Modified"), _ && (ut.lastModified[r] = _), _ = x.getResponseHeader("etag"), _ && (ut.etag[r] = _)), 204 === e || "HEAD" === p.type ? $ = "nocontent" : 304 === e ? $ = "notmodified" : ($ = w.state, d = w.data, y = w.error, a = !y)) : (y = $, (e || !$) && ($ = "error", 0 > e && (e = 0))), x.status = e, x.statusText = (n || $) + "", a ? m.resolveWith(h, [d, $, x]) : m.rejectWith(h, [x, $, y]), x.statusCode(v), v = t, c && f.trigger(a ? "ajaxSuccess" : "ajaxError", [x, p, a ? d : y]), g.fireWith(h, [x, $]), c && (f.trigger("ajaxComplete", [x, p]), --ut.active || ut.event.trigger("ajaxStop")))
        }
        "object" == typeof e && (n = e, e = t), n = n || {};
        var o, a, r, s, l, c, u, d, p = ut.ajaxSetup({}, n),
          h = p.context || p,
          f = p.context && (h.nodeType || h.jquery) ? ut(h) : ut.event,
          m = ut.Deferred(),
          g = ut.Callbacks("once memory"),
          v = p.statusCode || {},
          y = {},
          w = {},
          b = 0,
          _ = "canceled",
          x = {
            readyState: 0,
            getResponseHeader: function(e) {
              var t;
              if (2 === b) {
                if (!d)
                  for (d = {}; t = An.exec(s);) d[t[1].toLowerCase()] = t[2];
                t = d[e.toLowerCase()]
              }
              return null == t ? null : t
            },
            getAllResponseHeaders: function() {
              return 2 === b ? s : null
            },
            setRequestHeader: function(e, t) {
              var n = e.toLowerCase();
              return b || (e = w[n] = w[n] || e, y[e] = t), this
            },
            overrideMimeType: function(e) {
              return b || (p.mimeType = e), this
            },
            statusCode: function(e) {
              var t;
              if (e)
                if (2 > b)
                  for (t in e) v[t] = [v[t], e[t]];
                else x.always(e[x.status]);
              return this
            },
            abort: function(e) {
              var t = e || _;
              return u && u.abort(t), i(0, t), this
            }
          };
        if (m.promise(x).complete = g.add, x.success = x.done, x.error = x.fail, p.url = ((e || p.url || Ln) + "").replace(Nn, "").replace(Rn, Hn[1] + "//"), p.type = n.method || n.type || p.method || p.type, p.dataTypes = ut.trim(p.dataType || "*").toLowerCase().match(pt) || [""], null == p.crossDomain && (o = Bn.exec(p.url.toLowerCase()), p.crossDomain = !(!o || o[1] === Hn[1] && o[2] === Hn[2] && (o[3] || ("http:" === o[1] ? "80" : "443")) === (Hn[3] || ("http:" === Hn[1] ? "80" : "443")))), p.data && p.processData && "string" != typeof p.data && (p.data = ut.param(p.data, p.traditional)), L(qn, p, n, x), 2 === b) return x;
        c = p.global, c && 0 === ut.active++ && ut.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Fn.test(p.type), r = p.url, p.hasContent || (p.data && (r = p.url += (On.test(r) ? "&" : "?") + p.data, delete p.data), p.cache === !1 && (p.url = In.test(r) ? r.replace(In, "$1_=" + Dn++) : r + (On.test(r) ? "&" : "?") + "_=" + Dn++)), p.ifModified && (ut.lastModified[r] && x.setRequestHeader("If-Modified-Since", ut.lastModified[r]), ut.etag[r] && x.setRequestHeader("If-None-Match", ut.etag[r])), (p.data && p.hasContent && p.contentType !== !1 || n.contentType) && x.setRequestHeader("Content-Type", p.contentType), x.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Wn + "; q=0.01" : "") : p.accepts["*"]);
        for (a in p.headers) x.setRequestHeader(a, p.headers[a]);
        if (p.beforeSend && (p.beforeSend.call(h, x, p) === !1 || 2 === b)) return x.abort();
        _ = "abort";
        for (a in {
            success: 1,
            error: 1,
            complete: 1
          }) x[a](p[a]);
        if (u = L(Un, p, n, x)) {
          x.readyState = 1, c && f.trigger("ajaxSend", [x, p]), p.async && p.timeout > 0 && (l = setTimeout(function() {
            x.abort("timeout")
          }, p.timeout));
          try {
            b = 1, u.send(y, i)
          } catch ($) {
            if (!(2 > b)) throw $;
            i(-1, $)
          }
        } else i(-1, "No Transport");
        return x
      },
      getJSON: function(e, t, n) {
        return ut.get(e, t, n, "json")
      },
      getScript: function(e, n) {
        return ut.get(e, t, n, "script")
      }
    }), ut.each(["get", "post"], function(e, n) {
      ut[n] = function(e, i, o, a) {
        return ut.isFunction(i) && (a = a || o, o = i, i = t), ut.ajax({
          url: e,
          type: n,
          dataType: a,
          data: i,
          success: o
        })
      }
    }), ut.ajaxSetup({
      accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
      },
      contents: {
        script: /(?:java|ecma)script/
      },
      converters: {
        "text script": function(e) {
          return ut.globalEval(e), e
        }
      }
    }), ut.ajaxPrefilter("script", function(e) {
      e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), ut.ajaxTransport("script", function(e) {
      if (e.crossDomain) {
        var n, i = Q.head || ut("head")[0] || Q.documentElement;
        return {
          send: function(t, o) {
            n = Q.createElement("script"), n.async = !0, e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function(e, t) {
              (t || !n.readyState || /loaded|complete/.test(n.readyState)) && (n.onload = n.onreadystatechange = null, n.parentNode && n.parentNode.removeChild(n), n = null, t || o(200, "success"))
            }, i.insertBefore(n, i.firstChild)
          },
          abort: function() {
            n && n.onload(t, !0)
          }
        }
      }
    });
    var Yn = [],
      Vn = /(=)\?(?=&|$)|\?\?/;
    ut.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var e = Yn.pop() || ut.expando + "_" + Dn++;
        return this[e] = !0, e
      }
    }), ut.ajaxPrefilter("json jsonp", function(n, i, o) {
      var a, r, s, l = n.jsonp !== !1 && (Vn.test(n.url) ? "url" : "string" == typeof n.data && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Vn.test(n.data) && "data");
      return l || "jsonp" === n.dataTypes[0] ? (a = n.jsonpCallback = ut.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, l ? n[l] = n[l].replace(Vn, "$1" + a) : n.jsonp !== !1 && (n.url += (On.test(n.url) ? "&" : "?") + n.jsonp + "=" + a), n.converters["script json"] = function() {
        return s || ut.error(a + " was not called"), s[0]
      }, n.dataTypes[0] = "json", r = e[a], e[a] = function() {
        s = arguments
      }, o.always(function() {
        e[a] = r, n[a] && (n.jsonpCallback = i.jsonpCallback, Yn.push(a)), s && ut.isFunction(r) && r(s[0]), s = r = t
      }), "script") : void 0
    });
    var Gn, Qn, Kn = 0,
      Jn = e.ActiveXObject && function() {
        var e;
        for (e in Gn) Gn[e](t, !0)
      };
    ut.ajaxSettings.xhr = e.ActiveXObject ? function() {
      return !this.isLocal && I() || A()
    } : I, Qn = ut.ajaxSettings.xhr(), ut.support.cors = !!Qn && "withCredentials" in Qn, Qn = ut.support.ajax = !!Qn, Qn && ut.ajaxTransport(function(n) {
      if (!n.crossDomain || ut.support.cors) {
        var i;
        return {
          send: function(o, a) {
            var r, s, l = n.xhr();
            if (n.username ? l.open(n.type, n.url, n.async, n.username, n.password) : l.open(n.type, n.url, n.async), n.xhrFields)
              for (s in n.xhrFields) l[s] = n.xhrFields[s];
            n.mimeType && l.overrideMimeType && l.overrideMimeType(n.mimeType), n.crossDomain || o["X-Requested-With"] || (o["X-Requested-With"] = "XMLHttpRequest");
            try {
              for (s in o) l.setRequestHeader(s, o[s])
            } catch (c) {}
            l.send(n.hasContent && n.data || null), i = function(e, o) {
              var s, c, u, d;
              try {
                if (i && (o || 4 === l.readyState))
                  if (i = t, r && (l.onreadystatechange = ut.noop, Jn && delete Gn[r]), o) 4 !== l.readyState && l.abort();
                  else {
                    d = {}, s = l.status, c = l.getAllResponseHeaders(), "string" == typeof l.responseText && (d.text = l.responseText);
                    try {
                      u = l.statusText
                    } catch (p) {
                      u = ""
                    }
                    s || !n.isLocal || n.crossDomain ? 1223 === s && (s = 204) : s = d.text ? 200 : 404
                  }
              } catch (h) {
                o || a(-1, h)
              }
              d && a(s, u, d, c)
            }, n.async ? 4 === l.readyState ? setTimeout(i) : (r = ++Kn, Jn && (Gn || (Gn = {}, ut(e).unload(Jn)), Gn[r] = i), l.onreadystatechange = i) : i()
          },
          abort: function() {
            i && i(t, !0)
          }
        }
      }
    });
    var Zn, ei, ti = /^(?:toggle|show|hide)$/,
      ni = new RegExp("^(?:([+-])=|)(" + dt + ")([a-z%]*)$", "i"),
      ii = /queueHooks$/,
      oi = [z],
      ai = {
        "*": [function(e, t) {
          var n = this.createTween(e, t),
            i = n.cur(),
            o = ni.exec(t),
            a = o && o[3] || (ut.cssNumber[e] ? "" : "px"),
            r = (ut.cssNumber[e] || "px" !== a && +i) && ni.exec(ut.css(n.elem, e)),
            s = 1,
            l = 20;
          if (r && r[3] !== a) {
            a = a || r[3], o = o || [], r = +i || 1;
            do s = s || ".5", r /= s, ut.style(n.elem, e, r + a); while (s !== (s = n.cur() / i) && 1 !== s && --l)
          }
          return o && (r = n.start = +r || +i || 0, n.unit = a, n.end = o[1] ? r + (o[1] + 1) * o[2] : +o[2]), n
        }]
      };
    ut.Animation = ut.extend(R, {
      tweener: function(e, t) {
        ut.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
        for (var n, i = 0, o = e.length; o > i; i++) n = e[i], ai[n] = ai[n] || [], ai[n].unshift(t)
      },
      prefilter: function(e, t) {
        t ? oi.unshift(e) : oi.push(e)
      }
    }), ut.Tween = q, q.prototype = {
      constructor: q,
      init: function(e, t, n, i, o, a) {
        this.elem = e, this.prop = n, this.easing = o || "swing", this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = a || (ut.cssNumber[n] ? "" : "px")
      },
      cur: function() {
        var e = q.propHooks[this.prop];
        return e && e.get ? e.get(this) : q.propHooks._default.get(this)
      },
      run: function(e) {
        var t, n = q.propHooks[this.prop];
        return this.pos = t = this.options.duration ? ut.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : q.propHooks._default.set(this), this
      }
    }, q.prototype.init.prototype = q.prototype, q.propHooks = {
      _default: {
        get: function(e) {
          var t;
          return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = ut.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
        },
        set: function(e) {
          ut.fx.step[e.prop] ? ut.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[ut.cssProps[e.prop]] || ut.cssHooks[e.prop]) ? ut.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
        }
      }
    }, q.propHooks.scrollTop = q.propHooks.scrollLeft = {
      set: function(e) {
        e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
      }
    }, ut.each(["toggle", "show", "hide"], function(e, t) {
      var n = ut.fn[t];
      ut.fn[t] = function(e, i, o) {
        return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(U(t, !0), e, i, o)
      }
    }), ut.fn.extend({
      fadeTo: function(e, t, n, i) {
        return this.filter($).css("opacity", 0).show().end().animate({
          opacity: t
        }, e, n, i)
      },
      animate: function(e, t, n, i) {
        var o = ut.isEmptyObject(e),
          a = ut.speed(t, n, i),
          r = function() {
            var t = R(this, ut.extend({}, e), a);
            (o || ut._data(this, "finish")) && t.stop(!0)
          };
        return r.finish = r, o || a.queue === !1 ? this.each(r) : this.queue(a.queue, r)
      },
      stop: function(e, n, i) {
        var o = function(e) {
          var t = e.stop;
          delete e.stop, t(i)
        };
        return "string" != typeof e && (i = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function() {
          var t = !0,
            n = null != e && e + "queueHooks",
            a = ut.timers,
            r = ut._data(this);
          if (n) r[n] && r[n].stop && o(r[n]);
          else
            for (n in r) r[n] && r[n].stop && ii.test(n) && o(r[n]);
          for (n = a.length; n--;) a[n].elem !== this || null != e && a[n].queue !== e || (a[n].anim.stop(i), t = !1, a.splice(n, 1));
          (t || !i) && ut.dequeue(this, e)
        })
      },
      finish: function(e) {
        return e !== !1 && (e = e || "fx"), this.each(function() {
          var t, n = ut._data(this),
            i = n[e + "queue"],
            o = n[e + "queueHooks"],
            a = ut.timers,
            r = i ? i.length : 0;
          for (n.finish = !0, ut.queue(this, e, []), o && o.stop && o.stop.call(this, !0), t = a.length; t--;) a[t].elem === this && a[t].queue === e && (a[t].anim.stop(!0), a.splice(t, 1));
          for (t = 0; r > t; t++) i[t] && i[t].finish && i[t].finish.call(this);
          delete n.finish
        })
      }
    }), ut.each({
      slideDown: U("show"),
      slideUp: U("hide"),
      slideToggle: U("toggle"),
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
      ut.fn[e] = function(e, n, i) {
        return this.animate(t, e, n, i)
      }
    }), ut.speed = function(e, t, n) {
      var i = e && "object" == typeof e ? ut.extend({}, e) : {
        complete: n || !n && t || ut.isFunction(e) && e,
        duration: e,
        easing: n && t || t && !ut.isFunction(t) && t
      };
      return i.duration = ut.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in ut.fx.speeds ? ut.fx.speeds[i.duration] : ut.fx.speeds._default, (null == i.queue || i.queue === !0) && (i.queue = "fx"), i.old = i.complete, i.complete = function() {
        ut.isFunction(i.old) && i.old.call(this), i.queue && ut.dequeue(this, i.queue)
      }, i
    }, ut.easing = {
      linear: function(e) {
        return e
      },
      swing: function(e) {
        return .5 - Math.cos(e * Math.PI) / 2
      }
    }, ut.timers = [], ut.fx = q.prototype.init, ut.fx.tick = function() {
      var e, n = ut.timers,
        i = 0;
      for (Zn = ut.now(); i < n.length; i++) e = n[i], e() || n[i] !== e || n.splice(i--, 1);
      n.length || ut.fx.stop(), Zn = t
    }, ut.fx.timer = function(e) {
      e() && ut.timers.push(e) && ut.fx.start()
    }, ut.fx.interval = 13, ut.fx.start = function() {
      ei || (ei = setInterval(ut.fx.tick, ut.fx.interval))
    }, ut.fx.stop = function() {
      clearInterval(ei), ei = null
    }, ut.fx.speeds = {
      slow: 600,
      fast: 200,
      _default: 400
    }, ut.fx.step = {}, ut.expr && ut.expr.filters && (ut.expr.filters.animated = function(e) {
      return ut.grep(ut.timers, function(t) {
        return e === t.elem
      }).length
    }), ut.fn.offset = function(e) {
      if (arguments.length) return e === t ? this : this.each(function(t) {
        ut.offset.setOffset(this, e, t)
      });
      var n, i, o = {
          top: 0,
          left: 0
        },
        a = this[0],
        r = a && a.ownerDocument;
      if (r) return n = r.documentElement, ut.contains(n, a) ? (typeof a.getBoundingClientRect !== V && (o = a.getBoundingClientRect()), i = W(r), {
        top: o.top + (i.pageYOffset || n.scrollTop) - (n.clientTop || 0),
        left: o.left + (i.pageXOffset || n.scrollLeft) - (n.clientLeft || 0)
      }) : o
    }, ut.offset = {
      setOffset: function(e, t, n) {
        var i = ut.css(e, "position");
        "static" === i && (e.style.position = "relative");
        var o, a, r = ut(e),
          s = r.offset(),
          l = ut.css(e, "top"),
          c = ut.css(e, "left"),
          u = ("absolute" === i || "fixed" === i) && ut.inArray("auto", [l, c]) > -1,
          d = {},
          p = {};
        u ? (p = r.position(), o = p.top, a = p.left) : (o = parseFloat(l) || 0, a = parseFloat(c) || 0), ut.isFunction(t) && (t = t.call(e, n, s)), null != t.top && (d.top = t.top - s.top + o), null != t.left && (d.left = t.left - s.left + a), "using" in t ? t.using.call(e, d) : r.css(d)
      }
    }, ut.fn.extend({
      position: function() {
        if (this[0]) {
          var e, t, n = {
              top: 0,
              left: 0
            },
            i = this[0];
          return "fixed" === ut.css(i, "position") ? t = i.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), ut.nodeName(e[0], "html") || (n = e.offset()), n.top += ut.css(e[0], "borderTopWidth", !0), n.left += ut.css(e[0], "borderLeftWidth", !0)), {
            top: t.top - n.top - ut.css(i, "marginTop", !0),
            left: t.left - n.left - ut.css(i, "marginLeft", !0)
          }
        }
      },
      offsetParent: function() {
        return this.map(function() {
          for (var e = this.offsetParent || K; e && !ut.nodeName(e, "html") && "static" === ut.css(e, "position");) e = e.offsetParent;
          return e || K
        })
      }
    }), ut.each({
      scrollLeft: "pageXOffset",
      scrollTop: "pageYOffset"
    }, function(e, n) {
      var i = /Y/.test(n);
      ut.fn[e] = function(o) {
        return ut.access(this, function(e, o, a) {
          var r = W(e);
          return a === t ? r ? n in r ? r[n] : r.document.documentElement[o] : e[o] : (r ? r.scrollTo(i ? ut(r).scrollLeft() : a, i ? a : ut(r).scrollTop()) : e[o] = a, void 0)
        }, e, o, arguments.length, null)
      }
    }), ut.each({
      Height: "height",
      Width: "width"
    }, function(e, n) {
      ut.each({
        padding: "inner" + e,
        content: n,
        "": "outer" + e
      }, function(i, o) {
        ut.fn[o] = function(o, a) {
          var r = arguments.length && (i || "boolean" != typeof o),
            s = i || (o === !0 || a === !0 ? "margin" : "border");
          return ut.access(this, function(n, i, o) {
            var a;
            return ut.isWindow(n) ? n.document.documentElement["client" + e] : 9 === n.nodeType ? (a = n.documentElement, Math.max(n.body["scroll" + e], a["scroll" + e], n.body["offset" + e], a["offset" + e], a["client" + e])) : o === t ? ut.css(n, i, s) : ut.style(n, i, o, s)
          }, n, r ? o : t, r, null)
        }
      })
    }), ut.fn.size = function() {
      return this.length
    }, ut.fn.andSelf = ut.fn.addBack, "object" == typeof module && module && "object" == typeof module.exports ? module.exports = ut : (e.jQuery = e.$ = ut, "function" == typeof define && define.amd && define("jquery", [], function() {
      return ut
    }))
  }(window),
  function(e, t) {
    e.rails !== t && e.error("jquery-ujs has already been loaded!");
    var n, i = e(document);
    e.rails = n = {
      linkClickSelector: "a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]",
      buttonClickSelector: "button[data-remote]",
      inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
      formSubmitSelector: "form",
      formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])",
      disableSelector: "input[data-disable-with], button[data-disable-with], textarea[data-disable-with]",
      enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled",
      requiredInputSelector: "input[name][required]:not([disabled]),textarea[name][required]:not([disabled])",
      fileInputSelector: "input[type=file]",
      linkDisableSelector: "a[data-disable-with]",
      CSRFProtection: function(t) {
        var n = e('meta[name="csrf-token"]').attr("content");
        n && t.setRequestHeader("X-CSRF-Token", n)
      },
      fire: function(t, n, i) {
        var o = e.Event(n);
        return t.trigger(o, i), o.result !== !1
      },
      confirm: function(e) {
        return confirm(e)
      },
      ajax: function(t) {
        return e.ajax(t)
      },
      href: function(e) {
        return e.attr("href")
      },
      handleRemote: function(i) {
        var o, a, r, s, l, c, u, d;
        if (n.fire(i, "ajax:before")) {
          if (s = i.data("cross-domain"), l = s === t ? null : s, c = i.data("with-credentials") || null, u = i.data("type") || e.ajaxSettings && e.ajaxSettings.dataType, i.is("form")) {
            o = i.attr("method"), a = i.attr("action"), r = i.serializeArray();
            var p = i.data("ujs:submit-button");
            p && (r.push(p), i.data("ujs:submit-button", null))
          } else i.is(n.inputChangeSelector) ? (o = i.data("method"), a = i.data("url"), r = i.serialize(), i.data("params") && (r = r + "&" + i.data("params"))) : i.is(n.buttonClickSelector) ? (o = i.data("method") || "get", a = i.data("url"), r = i.serialize(), i.data("params") && (r = r + "&" + i.data("params"))) : (o = i.data("method"), a = n.href(i), r = i.data("params") || null);
          d = {
            type: o || "GET",
            data: r,
            dataType: u,
            beforeSend: function(e, o) {
              return o.dataType === t && e.setRequestHeader("accept", "*/*;q=0.5, " + o.accepts.script), n.fire(i, "ajax:beforeSend", [e, o])
            },
            success: function(e, t, n) {
              i.trigger("ajax:success", [e, t, n])
            },
            complete: function(e, t) {
              i.trigger("ajax:complete", [e, t])
            },
            error: function(e, t, n) {
              i.trigger("ajax:error", [e, t, n])
            },
            crossDomain: l
          }, c && (d.xhrFields = {
            withCredentials: c
          }), a && (d.url = a);
          var h = n.ajax(d);
          return i.trigger("ajax:send", h), h
        }
        return !1
      },
      handleMethod: function(i) {
        var o = n.href(i),
          a = i.data("method"),
          r = i.attr("target"),
          s = e("meta[name=csrf-token]").attr("content"),
          l = e("meta[name=csrf-param]").attr("content"),
          c = e('<form method="post" action="' + o + '"></form>'),
          u = '<input name="_method" value="' + a + '" type="hidden" />';
        l !== t && s !== t && (u += '<input name="' + l + '" value="' + s + '" type="hidden" />'), r && c.attr("target", r), c.hide().append(u).appendTo("body"), c.submit()
      },
      disableFormElements: function(t) {
        t.find(n.disableSelector).each(function() {
          var t = e(this),
            n = t.is("button") ? "html" : "val";
          t.data("ujs:enable-with", t[n]()), t[n](t.data("disable-with")), t.prop("disabled", !0)
        })
      },
      enableFormElements: function(t) {
        t.find(n.enableSelector).each(function() {
          var t = e(this),
            n = t.is("button") ? "html" : "val";
          t.data("ujs:enable-with") && t[n](t.data("ujs:enable-with")), t.prop("disabled", !1)
        })
      },
      allowAction: function(e) {
        var t, i = e.data("confirm"),
          o = !1;
        return i ? (n.fire(e, "confirm") && (o = n.confirm(i), t = n.fire(e, "confirm:complete", [o])), o && t) : !0
      },
      blankInputs: function(t, n, i) {
        var o, a, r = e(),
          s = n || "input,textarea",
          l = t.find(s);
        return l.each(function() {
          if (o = e(this), a = o.is("input[type=checkbox],input[type=radio]") ? o.is(":checked") : o.val(), !a == !i) {
            if (o.is("input[type=radio]") && l.filter('input[type=radio]:checked[name="' + o.attr("name") + '"]').length) return !0;
            r = r.add(o)
          }
        }), r.length ? r : !1
      },
      nonBlankInputs: function(e, t) {
        return n.blankInputs(e, t, !0)
      },
      stopEverything: function(t) {
        return e(t.target).trigger("ujs:everythingStopped"), t.stopImmediatePropagation(), !1
      },
      disableElement: function(e) {
        e.data("ujs:enable-with", e.html()), e.html(e.data("disable-with")), e.bind("click.railsDisable", function(e) {
          return n.stopEverything(e)
        })
      },
      enableElement: function(e) {
        e.data("ujs:enable-with") !== t && (e.html(e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.unbind("click.railsDisable")
      }
    }, n.fire(i, "rails:attachBindings") && (e.ajaxPrefilter(function(e, t, i) {
      e.crossDomain || n.CSRFProtection(i)
    }), i.delegate(n.linkDisableSelector, "ajax:complete", function() {
      n.enableElement(e(this))
    }), i.delegate(n.linkClickSelector, "click.rails", function(i) {
      var o = e(this),
        a = o.data("method"),
        r = o.data("params");
      if (!n.allowAction(o)) return n.stopEverything(i);
      if (o.is(n.linkDisableSelector) && n.disableElement(o), o.data("remote") !== t) {
        if (!(!i.metaKey && !i.ctrlKey || a && "GET" !== a || r)) return !0;
        var s = n.handleRemote(o);
        return s === !1 ? n.enableElement(o) : s.error(function() {
          n.enableElement(o)
        }), !1
      }
      return o.data("method") ? (n.handleMethod(o), !1) : void 0
    }), i.delegate(n.buttonClickSelector, "click.rails", function(t) {
      var i = e(this);
      return n.allowAction(i) ? (n.handleRemote(i), !1) : n.stopEverything(t)
    }), i.delegate(n.inputChangeSelector, "change.rails", function(t) {
      var i = e(this);
      return n.allowAction(i) ? (n.handleRemote(i), !1) : n.stopEverything(t)
    }), i.delegate(n.formSubmitSelector, "submit.rails", function(i) {
      var o = e(this),
        a = o.data("remote") !== t,
        r = n.blankInputs(o, n.requiredInputSelector),
        s = n.nonBlankInputs(o, n.fileInputSelector);
      if (!n.allowAction(o)) return n.stopEverything(i);
      if (r && o.attr("novalidate") == t && n.fire(o, "ajax:aborted:required", [r])) return n.stopEverything(i);
      if (a) {
        if (s) {
          setTimeout(function() {
            n.disableFormElements(o)
          }, 13);
          var l = n.fire(o, "ajax:aborted:file", [s]);
          return l || setTimeout(function() {
            n.enableFormElements(o)
          }, 13), l
        }
        return n.handleRemote(o), !1
      }
      setTimeout(function() {
        n.disableFormElements(o)
      }, 13)
    }), i.delegate(n.formInputClickSelector, "click.rails", function(t) {
      var i = e(this);
      if (!n.allowAction(i)) return n.stopEverything(t);
      var o = i.attr("name"),
        a = o ? {
          name: o,
          value: i.val()
        } : null;
      i.closest("form").data("ujs:submit-button", a)
    }), i.delegate(n.formSubmitSelector, "ajax:beforeSend.rails", function(t) {
      this == t.target && n.disableFormElements(e(this))
    }), i.delegate(n.formSubmitSelector, "ajax:complete.rails", function(t) {
      this == t.target && n.enableFormElements(e(this))
    }), e(function() {
      var t = e("meta[name=csrf-token]").attr("content"),
        n = e("meta[name=csrf-param]").attr("content");
      e('form input[name="' + n + '"]').val(t)
    }))
  }(jQuery),
  function() {
    window.SocialShareButton = {
      openUrl: function(e) {
        return window.open(e), !1
      },
      share: function(e) {
        var t, n, i, o, a, r;
        switch (i = $(e).data("site"), o = encodeURIComponent($(e).parent().data("title") || ""), n = encodeURIComponent($(e).parent().data("img") || ""), r = encodeURIComponent($(e).parent().data("url") || ""), 0 === r.length && (r = encodeURIComponent(location.href)), i) {
          case "email":
            location.href = "mailto:?to=&subject=" + o + "&body=" + r;
            break;
          case "weibo":
            SocialShareButton.openUrl("http://service.weibo.com/share/share.php?url=" + r + "&type=3&pic=" + n + "&title=" + o);
            break;
          case "twitter":
            SocialShareButton.openUrl("https://twitter.com/home?status=" + o + ": " + r);
            break;
          case "douban":
            SocialShareButton.openUrl("http://shuo.douban.com/!service/share?href=" + r + "&name=" + o + "&image=" + n);
            break;
          case "facebook":
            SocialShareButton.openUrl("http://www.facebook.com/sharer.php?t=" + o + "&u=" + r);
            break;
          case "qq":
            SocialShareButton.openUrl("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + r + "&title=" + o + "&pics=" + n);
            break;
          case "tqq":
            SocialShareButton.openUrl("http://share.v.t.qq.com/index.php?c=share&a=index&url=" + r + "&title=" + o + "&pic=" + n);
            break;
          case "baidu":
            SocialShareButton.openUrl("http://hi.baidu.com/pub/show/share?url=" + r + "&title=" + o + "&content=");
            break;
          case "kaixin001":
            SocialShareButton.openUrl("http://www.kaixin001.com/rest/records.php?url=" + r + "&content=" + o + "&style=11&pic=" + n);
            break;
          case "renren":
            SocialShareButton.openUrl("http://widget.renren.com/dialog/share?resourceUrl=" + r + "&srcUrl=" + r + "&title=" + o + "&pic=" + n + "&description=");
            break;
          case "google_plus":
            SocialShareButton.openUrl("https://plus.google.com/share?url=" + r + "&t=" + o);
            break;
          case "google_bookmark":
            SocialShareButton.openUrl("https://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk=" + r + "&title=" + o);
            break;
          case "delicious":
            SocialShareButton.openUrl("http://www.delicious.com/save?url=" + r + "&title=" + o + "&jump=yes&pic=" + n);
            break;
          case "plurk":
            SocialShareButton.openUrl("http://www.plurk.com/?status=" + o + ": " + r + "&qualifier=shares");
            break;
          case "tumblr":
            t = function(t) {
              var n;
              return n = $(e).attr("data-" + t), n ? encodeURIComponent(n) : void 0
            }, a = function() {
              var e, i, a, s;
              return i = t("type") || "link", e = function() {
                switch (i) {
                  case "text":
                    return o = t("title") || o, "title=" + o;
                  case "photo":
                    return o = t("caption") || o, s = t("source") || n, "caption=" + o + "&source=" + s;
                  case "quote":
                    return a = t("quote") || o, s = t("source") || "", "quote=" + a + "&source=" + s;
                  default:
                    return o = t("title") || o, r = t("url") || r, "name=" + o + "&url=" + r
                }
              }(), "/" + i + "?" + e
            }, SocialShareButton.openUrl("http://www.tumblr.com/share" + a())
        }
        return !1
      }
    }
  }.call(this),
  function() {
    "use strict";

    function e(e, t) {
      e && (this.el = e, this.container = t && t.container, this.reRender = t && t.reRender)
    }

    function t(t) {
      t.style.display = "none", e.r = t.offsetTop, t.style.display = ""
    }

    function n(e, t) {
      if (e)
        for (var n = t && t.display, i = e.parentNode.children, o = d.call(i, e), a = o + 1, r = i.length; r > a; a++) i[a].style.display = n
    }

    function i(e, t) {
      var n = e.getClientRects(),
        i = 0;
      return u(n, function(e) {
        i += o(e.height, t)
      }), i
    }

    function o(e, t) {
      return Math.floor(e / t)
    }

    function a() {
      var e = document.createElement("test"),
        t = {},
        n = {
          Webkit: ["WebkitColumnCount", "WebkitColumnGap"],
          Moz: ["MozColumnCount", "MozColumnGap"],
          ms: ["msColumnCount", "msColumnGap"],
          "": ["columnCount", "columnGap"]
        };
      for (var i in n) n[i][0] in e.style && (t.columnCount = n[i][0], t.columnGap = n[i][1], t[i.toLowerCase()] = !0);
      return t
    }

    function r(e) {
      return parseInt(e[g.columnCount], 10) || 1
    }

    function s(e) {
      return parseInt(e[g.columnGap], 10) || 0
    }

    function l(e) {
      var t = parseInt(e.lineHeight, 10);
      if (!t) throw Error(m[0]);
      return t
    }

    function c(e) {
      return [e.offsetWidth, e.offsetHeight]
    }

    function u(e, t) {
      for (var n = 0, i = e.length; i > n && !t(e[n]); n++);
    }
    var d = Array.prototype.indexOf,
      p = window.getComputedStyle,
      h = "ellipsis-overflowing-child",
      f = "ellipsis-set",
      m = ["The ellipsis container must have line-height set on it"],
      g = a();
    e.prototype.calc = function() {
      if (!this.el) return this;
      var e = p(this.el),
        t = c(this.el);
      return this.columnHeight = t[1], this.columnCount = r(e), this.columnGap = s(e), this.columnWidth = t[0] / this.columnCount, this.lineHeight = l(e), this.deltaHeight = t[1] % this.lineHeight, this.linesPerColumn = Math.floor(this.columnHeight / this.lineHeight), this.totalLines = this.linesPerColumn * this.columnCount, !this.deltaHeight && this.columnCount > 1 && (this.el.style.height = this.columnHeight + "px"), this.child = this.getOverflowingChild(), this
    }, e.prototype.set = function() {
      return this.el && this.child ? (this.clampChild(), n(this.child.el, {
        display: "none"
      }), this.markContainer(), this) : this
    }, e.prototype.unset = function() {
      return this.el && this.child ? (this.el.style.height = "", this.unclampChild(this.child), n(this.child.el, {
        display: ""
      }), this.unmarkContainer(), this.child = null, this) : this
    }, e.prototype.destroy = function() {
      return this.el = this.child = this.container = null, this
    }, e.prototype.getOverflowingChild = function() {
      var e = this,
        t = {},
        n = 0;
      return u(this.el.children, function(i) {
        var o, a, r, s = Math.floor(n / e.linesPerColumn) || 0;
        return n += o = e.getLineCount(i), n >= e.totalLines ? (a = n - e.totalLines, r = o - a, t.el = i, t.clampedLines = r, t.clampedHeight = t.clampedLines * e.lineHeight, t.visibleColumnSpan = e.columnCount - s, t.gutterSpan = t.visibleColumnSpan - 1, t.applyTopMargin = e.shouldApplyTopMargin(t), g.webkit && t.clampedLines > 1 && (t.clampedHeight += t.gutterSpan * e.deltaHeight), t) : void 0
      }), t
    }, e.prototype.getLineCount = function(e) {
      return e.offsetWidth > this.columnWidth ? i(e, this.lineHeight) : o(e.clientHeight, this.lineHeight)
    }, e.prototype.markContainer = function() {
      this.container && (this.container.classList.add(f), this.reRender && t(this.container))
    }, e.prototype.unmarkContainer = function() {
      this.container && (this.container.classList.remove(f), this.reRender && t(this.container))
    }, e.prototype.shouldApplyTopMargin = function(e) {
      var t = e.el;
      return !g.webkit || 1 === this.columnCount || 3 >= this.deltaHeight || !t.previousElementSibling ? void 0 : 0 === t.offsetTop || t.offsetTop === this.columnHeight
    }, e.prototype.clampChild = function() {
      var e = this.child;
      e && e.el && (e.el.style.height = e.clampedHeight + "px", g.webkit && (e.el.style.webkitLineClamp = e.clampedLines, e.el.style.display = "-webkit-box", e.el.style.webkitBoxOrient = "vertical"), this.shouldHideOverflow() && (e.el.style.overflow = "hidden"), e.applyTopMargin && (e.el.style.marginTop = "2em"), e.el.classList.add(h), g.webkit || (e.el.style.position = "relative", e.helper = e.el.appendChild(this.helperElement())))
    }, e.prototype.unclampChild = function(e) {
      e && e.el && (e.el.style.display = "", e.el.style.height = "", e.el.style.webkitLineClamp = "", e.el.style.webkitBoxOrient = "", e.el.style.marginTop = "", e.el.style.overflow = "", e.el.classList.remove(h), e.helper && e.helper.parentNode.removeChild(e.helper))
    }, e.prototype.helperElement = function() {
      var e, t, n = document.createElement("span"),
        i = this.child.visibleColumnSpan - 1;
      return n.className = "ellipsis-helper", n.style.display = "block", n.style.height = this.lineHeight + "px", n.style.width = "5em", n.style.position = "absolute", n.style.bottom = 0, n.style.right = 0, g.moz && i && (e = -(100 * i), t = -(i * this.columnGap), n.style.right = e + "%", n.style.marginRight = t + "px", n.style.marginBottom = this.deltaHeight + "px"), n
    }, e.prototype.shouldHideOverflow = function() {
      var e = this.columnCount > 1;
      return this.columnHeight < this.lineHeight ? !0 : !e
    }, "object" == typeof exports ? (module.exports = function(t, n) {
      return new e(t, n)
    }, module.exports.Ellipsis = e) : "function" == typeof define && define.amd ? define(function() {
      return e
    }) : window.Ellipsis = e
  }(),
  function() {
    function e() {}

    function t(e, t) {
      for (var n = e.length; n--;)
        if (e[n].listener === t) return n;
      return -1
    }

    function n(e) {
      return function() {
        return this[e].apply(this, arguments)
      }
    }
    var i = e.prototype,
      o = this,
      a = o.EventEmitter;
    i.getListeners = function(e) {
      var t, n, i = this._getEvents();
      if ("object" == typeof e) {
        t = {};
        for (n in i) i.hasOwnProperty(n) && e.test(n) && (t[n] = i[n])
      } else t = i[e] || (i[e] = []);
      return t
    }, i.flattenListeners = function(e) {
      var t, n = [];
      for (t = 0; e.length > t; t += 1) n.push(e[t].listener);
      return n
    }, i.getListenersAsObject = function(e) {
      var t, n = this.getListeners(e);
      return n instanceof Array && (t = {}, t[e] = n), t || n
    }, i.addListener = function(e, n) {
      var i, o = this.getListenersAsObject(e),
        a = "object" == typeof n;
      for (i in o) o.hasOwnProperty(i) && -1 === t(o[i], n) && o[i].push(a ? n : {
        listener: n,
        once: !1
      });
      return this
    }, i.on = n("addListener"), i.addOnceListener = function(e, t) {
      return this.addListener(e, {
        listener: t,
        once: !0
      })
    }, i.once = n("addOnceListener"), i.defineEvent = function(e) {
      return this.getListeners(e), this
    }, i.defineEvents = function(e) {
      for (var t = 0; e.length > t; t += 1) this.defineEvent(e[t]);
      return this
    }, i.removeListener = function(e, n) {
      var i, o, a = this.getListenersAsObject(e);
      for (o in a) a.hasOwnProperty(o) && (i = t(a[o], n), -1 !== i && a[o].splice(i, 1));
      return this
    }, i.off = n("removeListener"), i.addListeners = function(e, t) {
      return this.manipulateListeners(!1, e, t)
    }, i.removeListeners = function(e, t) {
      return this.manipulateListeners(!0, e, t)
    }, i.manipulateListeners = function(e, t, n) {
      var i, o, a = e ? this.removeListener : this.addListener,
        r = e ? this.removeListeners : this.addListeners;
      if ("object" != typeof t || t instanceof RegExp)
        for (i = n.length; i--;) a.call(this, t, n[i]);
      else
        for (i in t) t.hasOwnProperty(i) && (o = t[i]) && ("function" == typeof o ? a.call(this, i, o) : r.call(this, i, o));
      return this
    }, i.removeEvent = function(e) {
      var t, n = typeof e,
        i = this._getEvents();
      if ("string" === n) delete i[e];
      else if ("object" === n)
        for (t in i) i.hasOwnProperty(t) && e.test(t) && delete i[t];
      else delete this._events;
      return this
    }, i.removeAllListeners = n("removeEvent"), i.emitEvent = function(e, t) {
      var n, i, o, a, r = this.getListenersAsObject(e);
      for (o in r)
        if (r.hasOwnProperty(o))
          for (i = r[o].length; i--;) n = r[o][i], n.once === !0 && this.removeListener(e, n.listener), a = n.listener.apply(this, t || []), a === this._getOnceReturnValue() && this.removeListener(e, n.listener);
      return this
    }, i.trigger = n("emitEvent"), i.emit = function(e) {
      var t = Array.prototype.slice.call(arguments, 1);
      return this.emitEvent(e, t)
    }, i.setOnceReturnValue = function(e) {
      return this._onceReturnValue = e, this
    }, i._getOnceReturnValue = function() {
      return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, i._getEvents = function() {
      return this._events || (this._events = {})
    }, e.noConflict = function() {
      return o.EventEmitter = a, e
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
      return e
    }) : "object" == typeof module && module.exports ? module.exports = e : this.EventEmitter = e
  }.call(this),
  function(e) {
    function t(t) {
      var n = e.event;
      return n.target = n.target || n.srcElement || t, n
    }
    var n = document.documentElement,
      i = function() {};
    n.addEventListener ? i = function(e, t, n) {
      e.addEventListener(t, n, !1)
    } : n.attachEvent && (i = function(e, n, i) {
      e[n + i] = i.handleEvent ? function() {
        var n = t(e);
        i.handleEvent.call(i, n)
      } : function() {
        var n = t(e);
        i.call(e, n)
      }, e.attachEvent("on" + n, e[n + i])
    });
    var o = function() {};
    n.removeEventListener ? o = function(e, t, n) {
      e.removeEventListener(t, n, !1)
    } : n.detachEvent && (o = function(e, t, n) {
      e.detachEvent("on" + t, e[t + n]);
      try {
        delete e[t + n]
      } catch (i) {
        e[t + n] = void 0
      }
    });
    var a = {
      bind: i,
      unbind: o
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", a) : e.eventie = a
  }(this),
  function(e) {
    function t(e, t) {
      for (var n in t) e[n] = t[n];
      return e
    }

    function n(e) {
      return "[object Array]" === l.call(e)
    }

    function i(e) {
      var t = [];
      if (n(e)) t = e;
      else if ("number" == typeof e.length)
        for (var i = 0, o = e.length; o > i; i++) t.push(e[i]);
      else t.push(e);
      return t
    }

    function o(e, n) {
      function o(e, n, r) {
        if (!(this instanceof o)) return new o(e, n);
        "string" == typeof e && (e = document.querySelectorAll(e)), this.elements = i(e), this.options = t({}, this.options), "function" == typeof n ? r = n : t(this.options, n), r && this.on("always", r), this.getImages(), a && (this.jqDeferred = new a.Deferred);
        var s = this;
        setTimeout(function() {
          s.check()
        })
      }

      function l(e) {
        this.img = e
      }

      function c(e) {
        this.src = e, u[e] = this
      }
      o.prototype = new e, o.prototype.options = {}, o.prototype.getImages = function() {
        this.images = [];
        for (var e = 0, t = this.elements.length; t > e; e++) {
          var n = this.elements[e];
          "IMG" === n.nodeName && this.addImage(n);
          for (var i = n.querySelectorAll("img"), o = 0, a = i.length; a > o; o++) {
            var r = i[o];
            this.addImage(r)
          }
        }
      }, o.prototype.addImage = function(e) {
        var t = new l(e);
        this.images.push(t)
      }, o.prototype.check = function() {
        function e(e, o) {
          return t.options.debug && s && r.log("confirm", e, o), t.progress(e), n++, n === i && t.complete(), !0
        }
        var t = this,
          n = 0,
          i = this.images.length;
        if (this.hasAnyBroken = !1, !i) return this.complete(), void 0;
        for (var o = 0; i > o; o++) {
          var a = this.images[o];
          a.on("confirm", e), a.check()
        }
      }, o.prototype.progress = function(e) {
        this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded;
        var t = this;
        setTimeout(function() {
          t.emit("progress", t, e), t.jqDeferred && t.jqDeferred.notify(t, e)
        })
      }, o.prototype.complete = function() {
        var e = this.hasAnyBroken ? "fail" : "done";
        this.isComplete = !0;
        var t = this;
        setTimeout(function() {
          if (t.emit(e, t), t.emit("always", t), t.jqDeferred) {
            var n = t.hasAnyBroken ? "reject" : "resolve";
            t.jqDeferred[n](t)
          }
        })
      }, a && (a.fn.imagesLoaded = function(e, t) {
        var n = new o(this, e, t);
        return n.jqDeferred.promise(a(this))
      }), l.prototype = new e, l.prototype.check = function() {
        var e = u[this.img.src] || new c(this.img.src);
        if (e.isConfirmed) return this.confirm(e.isLoaded, "cached was confirmed"), void 0;
        if (this.img.complete && void 0 !== this.img.naturalWidth) return this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), void 0;
        var t = this;
        e.on("confirm", function(e, n) {
          return t.confirm(e.isLoaded, n), !0
        }), e.check()
      }, l.prototype.confirm = function(e, t) {
        this.isLoaded = e, this.emit("confirm", this, t)
      };
      var u = {};
      return c.prototype = new e, c.prototype.check = function() {
        if (!this.isChecked) {
          var e = new Image;
          n.bind(e, "load", this), n.bind(e, "error", this), e.src = this.src, this.isChecked = !0
        }
      }, c.prototype.handleEvent = function(e) {
        var t = "on" + e.type;
        this[t] && this[t](e)
      }, c.prototype.onload = function(e) {
        this.confirm(!0, "onload"), this.unbindProxyEvents(e)
      }, c.prototype.onerror = function(e) {
        this.confirm(!1, "onerror"), this.unbindProxyEvents(e)
      }, c.prototype.confirm = function(e, t) {
        this.isConfirmed = !0, this.isLoaded = e, this.emit("confirm", this, t)
      }, c.prototype.unbindProxyEvents = function(e) {
        n.unbind(e.target, "load", this), n.unbind(e.target, "error", this)
      }, o
    }
    var a = e.jQuery,
      r = e.console,
      s = void 0 !== r,
      l = Object.prototype.toString;
    "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], o) : e.imagesLoaded = o(e.EventEmitter, e.eventie)
  }(window),
  function(e, t, n) {
    function i(e, n) {
      this.wrapper = "string" == typeof e ? t.querySelector(e) : e, this.scroller = this.wrapper.children[0], this.scrollerStyle = this.scroller.style, this.options = {
        resizeScrollbars: !0,
        mouseWheelSpeed: 20,
        snapThreshold: .334,
        startX: 0,
        startY: 0,
        scrollY: !0,
        directionLockThreshold: 5,
        momentum: !0,
        bounce: !0,
        bounceTime: 600,
        bounceEasing: "",
        preventDefault: !0,
        preventDefaultException: {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
        },
        HWCompositing: !0,
        useTransition: !0,
        useTransform: !0
      };
      for (var i in n) this.options[i] = n[i];
      this.translateZ = this.options.HWCompositing && s.hasPerspective ? " translateZ(0)" : "", this.options.useTransition = s.hasTransition && this.options.useTransition, this.options.useTransform = s.hasTransform && this.options.useTransform, this.options.eventPassthrough = this.options.eventPassthrough === !0 ? "vertical" : this.options.eventPassthrough, this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault, this.options.scrollY = "vertical" == this.options.eventPassthrough ? !1 : this.options.scrollY, this.options.scrollX = "horizontal" == this.options.eventPassthrough ? !1 : this.options.scrollX, this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough, this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold, this.options.bounceEasing = "string" == typeof this.options.bounceEasing ? s.ease[this.options.bounceEasing] || s.ease.circular : this.options.bounceEasing, this.options.resizePolling = void 0 === this.options.resizePolling ? 60 : this.options.resizePolling, this.options.tap === !0 && (this.options.tap = "tap"), "scale" == this.options.shrinkScrollbars && (this.options.useTransition = !1), this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1, this.x = 0, this.y = 0, this.directionX = 0, this.directionY = 0, this._events = {}, this._init(), this.refresh(), this.scrollTo(this.options.startX, this.options.startY), this.enable()
    }

    function o(e, n, i) {
      var o = t.createElement("div"),
        a = t.createElement("div");
      return i === !0 && (o.style.cssText = "position:absolute;z-index:9999", a.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"), a.className = "iScrollIndicator", "h" == e ? (i === !0 && (o.style.cssText += ";height:7px;left:2px;right:2px;bottom:0", a.style.height = "100%"), o.className = "iScrollHorizontalScrollbar") : (i === !0 && (o.style.cssText += ";width:7px;bottom:2px;top:2px;right:1px", a.style.width = "100%"), o.className = "iScrollVerticalScrollbar"), o.style.cssText += ";overflow:hidden", n || (o.style.pointerEvents = "none"), o.appendChild(a), o
    }

    function a(n, i) {
      this.wrapper = "string" == typeof i.el ? t.querySelector(i.el) : i.el, this.wrapperStyle = this.wrapper.style, this.indicator = this.wrapper.children[0], this.indicatorStyle = this.indicator.style, this.scroller = n, this.options = {
        listenX: !0,
        listenY: !0,
        interactive: !1,
        resize: !0,
        defaultScrollbars: !1,
        shrink: !1,
        fade: !1,
        speedRatioX: 0,
        speedRatioY: 0
      };
      for (var o in i) this.options[o] = i[o];
      this.sizeRatioX = 1, this.sizeRatioY = 1, this.maxPosX = 0, this.maxPosY = 0, this.options.interactive && (this.options.disableTouch || (s.addEvent(this.indicator, "touchstart", this), s.addEvent(e, "touchend", this)), this.options.disablePointer || (s.addEvent(this.indicator, "MSPointerDown", this), s.addEvent(e, "MSPointerUp", this)), this.options.disableMouse || (s.addEvent(this.indicator, "mousedown", this), s.addEvent(e, "mouseup", this))), this.options.fade && (this.wrapperStyle[s.style.transform] = this.scroller.translateZ, this.wrapperStyle[s.style.transitionDuration] = s.isBadAndroid ? "0.001s" : "0ms", this.wrapperStyle.opacity = "0")
    }
    var r = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function(t) {
        e.setTimeout(t, 1e3 / 60)
      },
      s = function() {
        function i(e) {
          return r === !1 ? !1 : "" === r ? e : r + e.charAt(0).toUpperCase() + e.substr(1)
        }
        var o = {},
          a = t.createElement("div").style,
          r = function() {
            for (var e, t = ["t", "webkitT", "MozT", "msT", "OT"], n = 0, i = t.length; i > n; n++)
              if (e = t[n] + "ransform", e in a) return t[n].substr(0, t[n].length - 1);
            return !1
          }();
        o.getTime = Date.now || function() {
          return (new Date).getTime()
        }, o.extend = function(e, t) {
          for (var n in t) e[n] = t[n]
        }, o.addEvent = function(e, t, n, i) {
          e.addEventListener(t, n, !!i)
        }, o.removeEvent = function(e, t, n, i) {
          e.removeEventListener(t, n, !!i)
        }, o.momentum = function(e, t, i, o, a, r) {
          var s, l, c = e - t,
            u = n.abs(c) / i;
          return r = void 0 === r ? 6e-4 : r, s = e + u * u / (2 * r) * (0 > c ? -1 : 1), l = u / r, o > s ? (s = a ? o - a / 2.5 * (u / 8) : o, c = n.abs(s - e), l = c / u) : s > 0 && (s = a ? a / 2.5 * (u / 8) : 0, c = n.abs(e) + s, l = c / u), {
            destination: n.round(s),
            duration: l
          }
        };
        var s = i("transform");
        return o.extend(o, {
          hasTransform: s !== !1,
          hasPerspective: i("perspective") in a,
          hasTouch: "ontouchstart" in e,
          hasPointer: navigator.msPointerEnabled,
          hasTransition: i("transition") in a
        }), o.isBadAndroid = /Android /.test(e.navigator.appVersion) && !/Chrome\/\d/.test(e.navigator.appVersion), o.extend(o.style = {}, {
          transform: s,
          transitionTimingFunction: i("transitionTimingFunction"),
          transitionDuration: i("transitionDuration"),
          transitionDelay: i("transitionDelay"),
          transformOrigin: i("transformOrigin")
        }), o.hasClass = function(e, t) {
          var n = new RegExp("(^|\\s)" + t + "(\\s|$)");
          return n.test(e.className)
        }, o.addClass = function(e, t) {
          if (!o.hasClass(e, t)) {
            var n = e.className.split(" ");
            n.push(t), e.className = n.join(" ")
          }
        }, o.removeClass = function(e, t) {
          if (o.hasClass(e, t)) {
            var n = new RegExp("(^|\\s)" + t + "(\\s|$)", "g");
            e.className = e.className.replace(n, " ")
          }
        }, o.offset = function(e) {
          for (var t = -e.offsetLeft, n = -e.offsetTop; e = e.offsetParent;) t -= e.offsetLeft, n -= e.offsetTop;
          return {
            left: t,
            top: n
          }
        }, o.preventDefaultException = function(e, t) {
          for (var n in t)
            if (t[n].test(e[n])) return !0;
          return !1
        }, o.extend(o.eventType = {}, {
          touchstart: 1,
          touchmove: 1,
          touchend: 1,
          mousedown: 2,
          mousemove: 2,
          mouseup: 2,
          MSPointerDown: 3,
          MSPointerMove: 3,
          MSPointerUp: 3
        }), o.extend(o.ease = {}, {
          quadratic: {
            style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            fn: function(e) {
              return e * (2 - e)
            }
          },
          circular: {
            style: "cubic-bezier(0.1, 0.57, 0.1, 1)",
            fn: function(e) {
              return n.sqrt(1 - --e * e)
            }
          },
          back: {
            style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            fn: function(e) {
              var t = 4;
              return (e -= 1) * e * ((t + 1) * e + t) + 1
            }
          },
          bounce: {
            style: "",
            fn: function(e) {
              return (e /= 1) < 1 / 2.75 ? 7.5625 * e * e : 2 / 2.75 > e ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : 2.5 / 2.75 > e ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375
            }
          },
          elastic: {
            style: "",
            fn: function(e) {
              var t = .22,
                i = .4;
              return 0 === e ? 0 : 1 == e ? 1 : i * n.pow(2, -10 * e) * n.sin((e - t / 4) * 2 * n.PI / t) + 1
            }
          }
        }), o.tap = function(e, n) {
          var i = t.createEvent("Event");
          i.initEvent(n, !0, !0), i.pageX = e.pageX, i.pageY = e.pageY, e.target.dispatchEvent(i)
        }, o.click = function(e) {
          var n, i = e.target;
          /(SELECT|INPUT|TEXTAREA)/i.test(i.tagName) || (n = t.createEvent("MouseEvents"), n.initMouseEvent("click", !0, !0, e.view, 1, i.screenX, i.screenY, i.clientX, i.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null), n._constructed = !0, i.dispatchEvent(n))
        }, o
      }();
    i.prototype = {
      version: "5.1.1",
      _init: function() {
        this._initEvents(), (this.options.scrollbars || this.options.indicators) && this._initIndicators(), this.options.mouseWheel && this._initWheel(), this.options.snap && this._initSnap(), this.options.keyBindings && this._initKeys()
      },
      destroy: function() {
        this._initEvents(!0), this._execEvent("destroy")
      },
      _transitionEnd: function(e) {
        e.target == this.scroller && this.isInTransition && (this._transitionTime(), this.resetPosition(this.options.bounceTime) || (this.isInTransition = !1, this._execEvent("scrollEnd")))
      },
      _start: function(e) {
        if (!(1 != s.eventType[e.type] && 0 !== e.button || !this.enabled || this.initiated && s.eventType[e.type] !== this.initiated)) {
          !this.options.preventDefault || s.isBadAndroid || s.preventDefaultException(e.target, this.options.preventDefaultException) || e.preventDefault();
          var t, i = e.touches ? e.touches[0] : e;
          this.initiated = s.eventType[e.type], this.moved = !1, this.distX = 0, this.distY = 0, this.directionX = 0, this.directionY = 0, this.directionLocked = 0, this._transitionTime(), this.startTime = s.getTime(), this.options.useTransition && this.isInTransition ? (this.isInTransition = !1, t = this.getComputedPosition(), this._translate(n.round(t.x), n.round(t.y)), this._execEvent("scrollEnd")) : !this.options.useTransition && this.isAnimating && (this.isAnimating = !1, this._execEvent("scrollEnd")), this.startX = this.x, this.startY = this.y, this.absStartX = this.x, this.absStartY = this.y, this.pointX = i.pageX, this.pointY = i.pageY, this._execEvent("beforeScrollStart")
        }
      },
      _move: function(e) {
        if (this.enabled && s.eventType[e.type] === this.initiated) {
          this.options.preventDefault && e.preventDefault();
          var t, i, o, a, r = e.touches ? e.touches[0] : e,
            l = r.pageX - this.pointX,
            c = r.pageY - this.pointY,
            u = s.getTime();
          if (this.pointX = r.pageX, this.pointY = r.pageY, this.distX += l, this.distY += c, o = n.abs(this.distX), a = n.abs(this.distY), !(u - this.endTime > 300 && 10 > o && 10 > a)) {
            if (this.directionLocked || this.options.freeScroll || (this.directionLocked = o > a + this.options.directionLockThreshold ? "h" : a >= o + this.options.directionLockThreshold ? "v" : "n"), "h" == this.directionLocked) {
              if ("vertical" == this.options.eventPassthrough) e.preventDefault();
              else if ("horizontal" == this.options.eventPassthrough) return this.initiated = !1, void 0;
              c = 0
            } else if ("v" == this.directionLocked) {
              if ("horizontal" == this.options.eventPassthrough) e.preventDefault();
              else if ("vertical" == this.options.eventPassthrough) return this.initiated = !1, void 0;
              l = 0
            }
            l = this.hasHorizontalScroll ? l : 0, c = this.hasVerticalScroll ? c : 0, t = this.x + l, i = this.y + c, (t > 0 || t < this.maxScrollX) && (t = this.options.bounce ? this.x + l / 3 : t > 0 ? 0 : this.maxScrollX), (i > 0 || i < this.maxScrollY) && (i = this.options.bounce ? this.y + c / 3 : i > 0 ? 0 : this.maxScrollY), this.directionX = l > 0 ? -1 : 0 > l ? 1 : 0, this.directionY = c > 0 ? -1 : 0 > c ? 1 : 0, this.moved || this._execEvent("scrollStart"), this.moved = !0, this._translate(t, i), u - this.startTime > 300 && (this.startTime = u, this.startX = this.x, this.startY = this.y)
          }
        }
      },
      _end: function(e) {
        if (this.enabled && s.eventType[e.type] === this.initiated) {
          this.options.preventDefault && !s.preventDefaultException(e.target, this.options.preventDefaultException) && e.preventDefault();
          var t, i, o = (e.changedTouches ? e.changedTouches[0] : e, s.getTime() - this.startTime),
            a = n.round(this.x),
            r = n.round(this.y),
            l = n.abs(a - this.startX),
            c = n.abs(r - this.startY),
            u = 0,
            d = "";
          if (this.isInTransition = 0, this.initiated = 0, this.endTime = s.getTime(), !this.resetPosition(this.options.bounceTime)) {
            if (this.scrollTo(a, r), !this.moved) return this.options.tap && s.tap(e, this.options.tap), this.options.click && s.click(e), this._execEvent("scrollCancel"), void 0;
            if (this._events.flick && 200 > o && 100 > l && 100 > c) return this._execEvent("flick"), void 0;
            if (this.options.momentum && 300 > o && (t = this.hasHorizontalScroll ? s.momentum(this.x, this.startX, o, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
                destination: a,
                duration: 0
              }, i = this.hasVerticalScroll ? s.momentum(this.y, this.startY, o, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
                destination: r,
                duration: 0
              }, a = t.destination, r = i.destination, u = n.max(t.duration, i.duration), this.isInTransition = 1), this.options.snap) {
              var p = this._nearestSnap(a, r);
              this.currentPage = p, u = this.options.snapSpeed || n.max(n.max(n.min(n.abs(a - p.x), 1e3), n.min(n.abs(r - p.y), 1e3)), 300), a = p.x, r = p.y, this.directionX = 0, this.directionY = 0, d = this.options.bounceEasing
            }
            return a != this.x || r != this.y ? ((a > 0 || a < this.maxScrollX || r > 0 || r < this.maxScrollY) && (d = s.ease.quadratic), this.scrollTo(a, r, u, d), void 0) : (this._execEvent("scrollEnd"), void 0)
          }
        }
      },
      _resize: function() {
        var e = this;
        clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(function() {
          e.refresh()
        }, this.options.resizePolling)
      },
      resetPosition: function(e) {
        var t = this.x,
          n = this.y;
        return e = e || 0, !this.hasHorizontalScroll || this.x > 0 ? t = 0 : this.x < this.maxScrollX && (t = this.maxScrollX), !this.hasVerticalScroll || this.y > 0 ? n = 0 : this.y < this.maxScrollY && (n = this.maxScrollY), t == this.x && n == this.y ? !1 : (this.scrollTo(t, n, e, this.options.bounceEasing), !0)
      },
      disable: function() {
        this.enabled = !1
      },
      enable: function() {
        this.enabled = !0
      },
      refresh: function() {
        this.wrapper.offsetHeight, this.wrapperWidth = this.wrapper.clientWidth, this.wrapperHeight = this.wrapper.clientHeight, this.scrollerWidth = this.scroller.offsetWidth, this.scrollerHeight = this.scroller.offsetHeight, this.maxScrollX = this.wrapperWidth - this.scrollerWidth, this.maxScrollY = this.wrapperHeight - this.scrollerHeight, this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0, this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0, this.hasHorizontalScroll || (this.maxScrollX = 0, this.scrollerWidth = this.wrapperWidth), this.hasVerticalScroll || (this.maxScrollY = 0, this.scrollerHeight = this.wrapperHeight), this.endTime = 0, this.directionX = 0, this.directionY = 0, this.wrapperOffset = s.offset(this.wrapper), this._execEvent("refresh"), this.resetPosition()
      },
      on: function(e, t) {
        this._events[e] || (this._events[e] = []), this._events[e].push(t)
      },
      off: function(e, t) {
        if (this._events[e]) {
          var n = this._events[e].indexOf(t);
          n > -1 && this._events[e].splice(n, 1)
        }
      },
      _execEvent: function(e) {
        if (this._events[e]) {
          var t = 0,
            n = this._events[e].length;
          if (n)
            for (; n > t; t++) this._events[e][t].apply(this, [].slice.call(arguments, 1))
        }
      },
      scrollBy: function(e, t, n, i) {
        e = this.x + e, t = this.y + t, n = n || 0, this.scrollTo(e, t, n, i)
      },
      scrollTo: function(e, t, n, i) {
        i = i || s.ease.circular, this.isInTransition = this.options.useTransition && n > 0, !n || this.options.useTransition && i.style ? (this._transitionTimingFunction(i.style), this._transitionTime(n), this._translate(e, t)) : this._animate(e, t, n, i.fn)
      },
      scrollToElement: function(e, t, i, o, a) {
        if (e = e.nodeType ? e : this.scroller.querySelector(e)) {
          var r = s.offset(e);
          r.left -= this.wrapperOffset.left, r.top -= this.wrapperOffset.top, i === !0 && (i = n.round(e.offsetWidth / 2 - this.wrapper.offsetWidth / 2)), o === !0 && (o = n.round(e.offsetHeight / 2 - this.wrapper.offsetHeight / 2)), r.left -= i || 0, r.top -= o || 0, r.left = r.left > 0 ? 0 : r.left < this.maxScrollX ? this.maxScrollX : r.left, r.top = r.top > 0 ? 0 : r.top < this.maxScrollY ? this.maxScrollY : r.top, t = void 0 === t || null === t || "auto" === t ? n.max(n.abs(this.x - r.left), n.abs(this.y - r.top)) : t, this.scrollTo(r.left, r.top, t, a)
        }
      },
      _transitionTime: function(e) {
        if (e = e || 0, this.scrollerStyle[s.style.transitionDuration] = e + "ms", !e && s.isBadAndroid && (this.scrollerStyle[s.style.transitionDuration] = "0.001s"), this.indicators)
          for (var t = this.indicators.length; t--;) this.indicators[t].transitionTime(e)
      },
      _transitionTimingFunction: function(e) {
        if (this.scrollerStyle[s.style.transitionTimingFunction] = e, this.indicators)
          for (var t = this.indicators.length; t--;) this.indicators[t].transitionTimingFunction(e)
      },
      _translate: function(e, t) {
        if (this.options.useTransform ? this.scrollerStyle[s.style.transform] = "translate(" + e + "px," + t + "px)" + this.translateZ : (e = n.round(e), t = n.round(t), this.scrollerStyle.left = e + "px", this.scrollerStyle.top = t + "px"), this.x = e, this.y = t, this.indicators)
          for (var i = this.indicators.length; i--;) this.indicators[i].updatePosition()
      },
      _initEvents: function(t) {
        var n = t ? s.removeEvent : s.addEvent,
          i = this.options.bindToWrapper ? this.wrapper : e;
        n(e, "orientationchange", this), n(e, "resize", this), this.options.click && n(this.wrapper, "click", this, !0), this.options.disableMouse || (n(this.wrapper, "mousedown", this), n(i, "mousemove", this), n(i, "mousecancel", this), n(i, "mouseup", this)), s.hasPointer && !this.options.disablePointer && (n(this.wrapper, "MSPointerDown", this), n(i, "MSPointerMove", this), n(i, "MSPointerCancel", this), n(i, "MSPointerUp", this)), s.hasTouch && !this.options.disableTouch && (n(this.wrapper, "touchstart", this), n(i, "touchmove", this), n(i, "touchcancel", this), n(i, "touchend", this)), n(this.scroller, "transitionend", this), n(this.scroller, "webkitTransitionEnd", this), n(this.scroller, "oTransitionEnd", this), n(this.scroller, "MSTransitionEnd", this)
      },
      getComputedPosition: function() {
        var t, n, i = e.getComputedStyle(this.scroller, null);
        return this.options.useTransform ? (i = i[s.style.transform].split(")")[0].split(", "), t = +(i[12] || i[4]), n = +(i[13] || i[5])) : (t = +i.left.replace(/[^-\d.]/g, ""), n = +i.top.replace(/[^-\d.]/g, "")), {
          x: t,
          y: n
        }
      },
      _initIndicators: function() {
        function e(e) {
          for (var t = s.indicators.length; t--;) e.call(s.indicators[t])
        }
        var t, n = this.options.interactiveScrollbars,
          i = "string" != typeof this.options.scrollbars,
          r = [],
          s = this;
        this.indicators = [], this.options.scrollbars && (this.options.scrollY && (t = {
          el: o("v", n, this.options.scrollbars),
          interactive: n,
          defaultScrollbars: !0,
          customStyle: i,
          resize: this.options.resizeScrollbars,
          shrink: this.options.shrinkScrollbars,
          fade: this.options.fadeScrollbars,
          listenX: !1
        }, this.wrapper.appendChild(t.el), r.push(t)), this.options.scrollX && (t = {
          el: o("h", n, this.options.scrollbars),
          interactive: n,
          defaultScrollbars: !0,
          customStyle: i,
          resize: this.options.resizeScrollbars,
          shrink: this.options.shrinkScrollbars,
          fade: this.options.fadeScrollbars,
          listenY: !1
        }, this.wrapper.appendChild(t.el), r.push(t))), this.options.indicators && (r = r.concat(this.options.indicators));
        for (var l = r.length; l--;) this.indicators.push(new a(this, r[l]));
        this.options.fadeScrollbars && (this.on("scrollEnd", function() {
          e(function() {
            this.fade()
          })
        }), this.on("scrollCancel", function() {
          e(function() {
            this.fade()
          })
        }), this.on("scrollStart", function() {
          e(function() {
            this.fade(1)
          })
        }), this.on("beforeScrollStart", function() {
          e(function() {
            this.fade(1, !0)
          })
        })), this.on("refresh", function() {
          e(function() {
            this.refresh()
          })
        }), this.on("destroy", function() {
          e(function() {
            this.destroy()
          }), delete this.indicators
        })
      },
      _initWheel: function() {
        s.addEvent(this.wrapper, "wheel", this), s.addEvent(this.wrapper, "mousewheel", this), s.addEvent(this.wrapper, "DOMMouseScroll", this), this.on("destroy", function() {
          s.removeEvent(this.wrapper, "wheel", this), s.removeEvent(this.wrapper, "mousewheel", this), s.removeEvent(this.wrapper, "DOMMouseScroll", this)
        })
      },
      _wheel: function(e) {
        if (this.enabled) {
          e.preventDefault(), e.stopPropagation();
          var t, i, o, a, r = this;
          if (void 0 === this.wheelTimeout && r._execEvent("scrollStart"), clearTimeout(this.wheelTimeout), this.wheelTimeout = setTimeout(function() {
              r._execEvent("scrollEnd"), r.wheelTimeout = void 0
            }, 400), "deltaX" in e) t = -e.deltaX, i = -e.deltaY;
          else if ("wheelDeltaX" in e) t = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed, i = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
          else if ("wheelDelta" in e) t = i = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
          else {
            if (!("detail" in e)) return;
            t = i = -e.detail / 3 * this.options.mouseWheelSpeed
          }
          if (t *= this.options.invertWheelDirection, i *= this.options.invertWheelDirection, this.hasVerticalScroll || (t = i, i = 0), this.options.snap) return o = this.currentPage.pageX, a = this.currentPage.pageY, t > 0 ? o-- : 0 > t && o++, i > 0 ? a-- : 0 > i && a++, this.goToPage(o, a), void 0;
          o = this.x + n.round(this.hasHorizontalScroll ? t : 0), a = this.y + n.round(this.hasVerticalScroll ? i : 0), o > 0 ? o = 0 : o < this.maxScrollX && (o = this.maxScrollX), a > 0 ? a = 0 : a < this.maxScrollY && (a = this.maxScrollY), this.scrollTo(o, a, 0)
        }
      },
      _initSnap: function() {
        this.currentPage = {}, "string" == typeof this.options.snap && (this.options.snap = this.scroller.querySelectorAll(this.options.snap)), this.on("refresh", function() {
          var e, t, i, o, a, r, s = 0,
            l = 0,
            c = 0,
            u = this.options.snapStepX || this.wrapperWidth,
            d = this.options.snapStepY || this.wrapperHeight;
          if (this.pages = [], this.wrapperWidth && this.wrapperHeight && this.scrollerWidth && this.scrollerHeight) {
            if (this.options.snap === !0)
              for (i = n.round(u / 2), o = n.round(d / 2); c > -this.scrollerWidth;) {
                for (this.pages[s] = [], e = 0, a = 0; a > -this.scrollerHeight;) this.pages[s][e] = {
                  x: n.max(c, this.maxScrollX),
                  y: n.max(a, this.maxScrollY),
                  width: u,
                  height: d,
                  cx: c - i,
                  cy: a - o
                }, a -= d, e++;
                c -= u, s++
              } else
                for (r = this.options.snap, e = r.length, t = -1; e > s; s++)(0 === s || r[s].offsetLeft <= r[s - 1].offsetLeft) && (l = 0, t++), this.pages[l] || (this.pages[l] = []), c = n.max(-r[s].offsetLeft, this.maxScrollX), a = n.max(-r[s].offsetTop, this.maxScrollY), i = c - n.round(r[s].offsetWidth / 2), o = a - n.round(r[s].offsetHeight / 2), this.pages[l][t] = {
                  x: c,
                  y: a,
                  width: r[s].offsetWidth,
                  height: r[s].offsetHeight,
                  cx: i,
                  cy: o
                }, c > this.maxScrollX && l++;
            this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0), 0 === this.options.snapThreshold % 1 ? (this.snapThresholdX = this.options.snapThreshold, this.snapThresholdY = this.options.snapThreshold) : (this.snapThresholdX = n.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold), this.snapThresholdY = n.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold))
          }
        }), this.on("flick", function() {
          var e = this.options.snapSpeed || n.max(n.max(n.min(n.abs(this.x - this.startX), 1e3), n.min(n.abs(this.y - this.startY), 1e3)), 300);
          this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, e)
        })
      },
      _nearestSnap: function(e, t) {
        if (!this.pages.length) return {
          x: 0,
          y: 0,
          pageX: 0,
          pageY: 0
        };
        var i = 0,
          o = this.pages.length,
          a = 0;
        if (n.abs(e - this.absStartX) < this.snapThresholdX && n.abs(t - this.absStartY) < this.snapThresholdY) return this.currentPage;
        for (e > 0 ? e = 0 : e < this.maxScrollX && (e = this.maxScrollX), t > 0 ? t = 0 : t < this.maxScrollY && (t = this.maxScrollY); o > i; i++)
          if (e >= this.pages[i][0].cx) {
            e = this.pages[i][0].x;
            break
          }
        for (o = this.pages[i].length; o > a; a++)
          if (t >= this.pages[0][a].cy) {
            t = this.pages[0][a].y;
            break
          }
        return i == this.currentPage.pageX && (i += this.directionX, 0 > i ? i = 0 : i >= this.pages.length && (i = this.pages.length - 1), e = this.pages[i][0].x), a == this.currentPage.pageY && (a += this.directionY, 0 > a ? a = 0 : a >= this.pages[0].length && (a = this.pages[0].length - 1), t = this.pages[0][a].y), {
          x: e,
          y: t,
          pageX: i,
          pageY: a
        }
      },
      goToPage: function(e, t, i, o) {
        o = o || this.options.bounceEasing, e >= this.pages.length ? e = this.pages.length - 1 : 0 > e && (e = 0), t >= this.pages[e].length ? t = this.pages[e].length - 1 : 0 > t && (t = 0);
        var a = this.pages[e][t].x,
          r = this.pages[e][t].y;
        i = void 0 === i ? this.options.snapSpeed || n.max(n.max(n.min(n.abs(a - this.x), 1e3), n.min(n.abs(r - this.y), 1e3)), 300) : i, this.currentPage = {
          x: a,
          y: r,
          pageX: e,
          pageY: t
        }, this.scrollTo(a, r, i, o)
      },
      next: function(e, t) {
        var n = this.currentPage.pageX,
          i = this.currentPage.pageY;
        n++, n >= this.pages.length && this.hasVerticalScroll && (n = 0, i++), this.goToPage(n, i, e, t)
      },
      prev: function(e, t) {
        var n = this.currentPage.pageX,
          i = this.currentPage.pageY;
        n--, 0 > n && this.hasVerticalScroll && (n = 0, i--), this.goToPage(n, i, e, t)
      },
      _initKeys: function() {
        var t, n = {
          pageUp: 33,
          pageDown: 34,
          end: 35,
          home: 36,
          left: 37,
          up: 38,
          right: 39,
          down: 40
        };
        if ("object" == typeof this.options.keyBindings)
          for (t in this.options.keyBindings) "string" == typeof this.options.keyBindings[t] && (this.options.keyBindings[t] = this.options.keyBindings[t].toUpperCase().charCodeAt(0));
        else this.options.keyBindings = {};
        for (t in n) this.options.keyBindings[t] = this.options.keyBindings[t] || n[t];
        s.addEvent(e, "keydown", this), this.on("destroy", function() {
          s.removeEvent(e, "keydown", this)
        })
      },
      _key: function(e) {
        if (this.enabled) {
          var t, i = this.options.snap,
            o = i ? this.currentPage.pageX : this.x,
            a = i ? this.currentPage.pageY : this.y,
            r = s.getTime(),
            l = this.keyTime || 0,
            c = .25;
          switch (this.options.useTransition && this.isInTransition && (t = this.getComputedPosition(), this._translate(n.round(t.x), n.round(t.y)), this.isInTransition = !1), this.keyAcceleration = 200 > r - l ? n.min(this.keyAcceleration + c, 50) : 0, e.keyCode) {
            case this.options.keyBindings.pageUp:
              this.hasHorizontalScroll && !this.hasVerticalScroll ? o += i ? 1 : this.wrapperWidth : a += i ? 1 : this.wrapperHeight;
              break;
            case this.options.keyBindings.pageDown:
              this.hasHorizontalScroll && !this.hasVerticalScroll ? o -= i ? 1 : this.wrapperWidth : a -= i ? 1 : this.wrapperHeight;
              break;
            case this.options.keyBindings.end:
              o = i ? this.pages.length - 1 : this.maxScrollX, a = i ? this.pages[0].length - 1 : this.maxScrollY;
              break;
            case this.options.keyBindings.home:
              o = 0, a = 0;
              break;
            case this.options.keyBindings.left:
              o += i ? -1 : 5 + this.keyAcceleration >> 0;
              break;
            case this.options.keyBindings.up:
              a += i ? 1 : 5 + this.keyAcceleration >> 0;
              break;
            case this.options.keyBindings.right:
              o -= i ? -1 : 5 + this.keyAcceleration >> 0;
              break;
            case this.options.keyBindings.down:
              a -= i ? 1 : 5 + this.keyAcceleration >> 0;
              break;
            default:
              return
          }
          if (i) return this.goToPage(o, a), void 0;
          o > 0 ? (o = 0, this.keyAcceleration = 0) : o < this.maxScrollX && (o = this.maxScrollX, this.keyAcceleration = 0), a > 0 ? (a = 0, this.keyAcceleration = 0) : a < this.maxScrollY && (a = this.maxScrollY, this.keyAcceleration = 0), this.scrollTo(o, a, 0), this.keyTime = r
        }
      },
      _animate: function(e, t, n, i) {
        function o() {
          var p, h, f, m = s.getTime();
          return m >= d ? (a.isAnimating = !1, a._translate(e, t), a.resetPosition(a.options.bounceTime) || a._execEvent("scrollEnd"), void 0) : (m = (m - u) / n, f = i(m), p = (e - l) * f + l, h = (t - c) * f + c, a._translate(p, h), a.isAnimating && r(o), void 0)
        }
        var a = this,
          l = this.x,
          c = this.y,
          u = s.getTime(),
          d = u + n;
        this.isAnimating = !0, o()
      },
      handleEvent: function(e) {
        switch (e.type) {
          case "touchstart":
          case "MSPointerDown":
          case "mousedown":
            this._start(e);
            break;
          case "touchmove":
          case "MSPointerMove":
          case "mousemove":
            this._move(e);
            break;
          case "touchend":
          case "MSPointerUp":
          case "mouseup":
          case "touchcancel":
          case "MSPointerCancel":
          case "mousecancel":
            this._end(e);
            break;
          case "orientationchange":
          case "resize":
            this._resize();
            break;
          case "transitionend":
          case "webkitTransitionEnd":
          case "oTransitionEnd":
          case "MSTransitionEnd":
            this._transitionEnd(e);
            break;
          case "wheel":
          case "DOMMouseScroll":
          case "mousewheel":
            this._wheel(e);
            break;
          case "keydown":
            this._key(e);
            break;
          case "click":
            e._constructed || (e.preventDefault(), e.stopPropagation())
        }
      }
    }, a.prototype = {
      handleEvent: function(e) {
        switch (e.type) {
          case "touchstart":
          case "MSPointerDown":
          case "mousedown":
            this._start(e);
            break;
          case "touchmove":
          case "MSPointerMove":
          case "mousemove":
            this._move(e);
            break;
          case "touchend":
          case "MSPointerUp":
          case "mouseup":
          case "touchcancel":
          case "MSPointerCancel":
          case "mousecancel":
            this._end(e)
        }
      },
      destroy: function() {
        this.options.interactive && (s.removeEvent(this.indicator, "touchstart", this), s.removeEvent(this.indicator, "MSPointerDown", this), s.removeEvent(this.indicator, "mousedown", this), s.removeEvent(e, "touchmove", this), s.removeEvent(e, "MSPointerMove", this), s.removeEvent(e, "mousemove", this), s.removeEvent(e, "touchend", this), s.removeEvent(e, "MSPointerUp", this), s.removeEvent(e, "mouseup", this)), this.options.defaultScrollbars && this.wrapper.parentNode.removeChild(this.wrapper)
      },
      _start: function(t) {
        var n = t.touches ? t.touches[0] : t;
        t.preventDefault(), t.stopPropagation(), this.transitionTime(), this.initiated = !0, this.moved = !1, this.lastPointX = n.pageX, this.lastPointY = n.pageY, this.startTime = s.getTime(), this.options.disableTouch || s.addEvent(e, "touchmove", this), this.options.disablePointer || s.addEvent(e, "MSPointerMove", this), this.options.disableMouse || s.addEvent(e, "mousemove", this), this.scroller._execEvent("beforeScrollStart")
      },
      _move: function(e) {
        var t, n, i, o, a = e.touches ? e.touches[0] : e;
        s.getTime(), this.moved || this.scroller._execEvent("scrollStart"), this.moved = !0, t = a.pageX - this.lastPointX, this.lastPointX = a.pageX, n = a.pageY - this.lastPointY, this.lastPointY = a.pageY, i = this.x + t, o = this.y + n, this._pos(i, o), e.preventDefault(), e.stopPropagation()
      },
      _end: function(t) {
        if (this.initiated) {
          if (this.initiated = !1, t.preventDefault(), t.stopPropagation(), s.removeEvent(e, "touchmove", this), s.removeEvent(e, "MSPointerMove", this), s.removeEvent(e, "mousemove", this), this.scroller.options.snap) {
            var i = this.scroller._nearestSnap(this.scroller.x, this.scroller.y),
              o = this.options.snapSpeed || n.max(n.max(n.min(n.abs(this.scroller.x - i.x), 1e3), n.min(n.abs(this.scroller.y - i.y), 1e3)), 300);
            (this.scroller.x != i.x || this.scroller.y != i.y) && (this.scroller.directionX = 0, this.scroller.directionY = 0, this.scroller.currentPage = i, this.scroller.scrollTo(i.x, i.y, o, this.scroller.options.bounceEasing))
          }
          this.moved && this.scroller._execEvent("scrollEnd")
        }
      },
      transitionTime: function(e) {
        e = e || 0, this.indicatorStyle[s.style.transitionDuration] = e + "ms", !e && s.isBadAndroid && (this.indicatorStyle[s.style.transitionDuration] = "0.001s")
      },
      transitionTimingFunction: function(e) {
        this.indicatorStyle[s.style.transitionTimingFunction] = e
      },
      refresh: function() {
        this.transitionTime(), this.indicatorStyle.display = this.options.listenX && !this.options.listenY ? this.scroller.hasHorizontalScroll ? "block" : "none" : this.options.listenY && !this.options.listenX ? this.scroller.hasVerticalScroll ? "block" : "none" : this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? "block" : "none", this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ? (s.addClass(this.wrapper, "iScrollBothScrollbars"), s.removeClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "8px" : this.wrapper.style.bottom = "8px")) : (s.removeClass(this.wrapper, "iScrollBothScrollbars"), s.addClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "2px" : this.wrapper.style.bottom = "2px")), this.wrapper.offsetHeight, this.options.listenX && (this.wrapperWidth = this.wrapper.clientWidth, this.options.resize ? (this.indicatorWidth = n.max(n.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8), this.indicatorStyle.width = this.indicatorWidth + "px") : this.indicatorWidth = this.indicator.clientWidth, this.maxPosX = this.wrapperWidth - this.indicatorWidth, "clip" == this.options.shrink ? (this.minBoundaryX = -this.indicatorWidth + 8, this.maxBoundaryX = this.wrapperWidth - 8) : (this.minBoundaryX = 0, this.maxBoundaryX = this.maxPosX), this.sizeRatioX = this.options.speedRatioX || this.scroller.maxScrollX && this.maxPosX / this.scroller.maxScrollX), this.options.listenY && (this.wrapperHeight = this.wrapper.clientHeight, this.options.resize ? (this.indicatorHeight = n.max(n.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8), this.indicatorStyle.height = this.indicatorHeight + "px") : this.indicatorHeight = this.indicator.clientHeight, this.maxPosY = this.wrapperHeight - this.indicatorHeight, "clip" == this.options.shrink ? (this.minBoundaryY = -this.indicatorHeight + 8, this.maxBoundaryY = this.wrapperHeight - 8) : (this.minBoundaryY = 0, this.maxBoundaryY = this.maxPosY), this.maxPosY = this.wrapperHeight - this.indicatorHeight, this.sizeRatioY = this.options.speedRatioY || this.scroller.maxScrollY && this.maxPosY / this.scroller.maxScrollY), this.updatePosition()
      },
      updatePosition: function() {
        var e = this.options.listenX && n.round(this.sizeRatioX * this.scroller.x) || 0,
          t = this.options.listenY && n.round(this.sizeRatioY * this.scroller.y) || 0;
        this.options.ignoreBoundaries || (e < this.minBoundaryX ? ("scale" == this.options.shrink && (this.width = n.max(this.indicatorWidth + e, 8), this.indicatorStyle.width = this.width + "px"), e = this.minBoundaryX) : e > this.maxBoundaryX ? "scale" == this.options.shrink ? (this.width = n.max(this.indicatorWidth - (e - this.maxPosX), 8), this.indicatorStyle.width = this.width + "px", e = this.maxPosX + this.indicatorWidth - this.width) : e = this.maxBoundaryX : "scale" == this.options.shrink && this.width != this.indicatorWidth && (this.width = this.indicatorWidth, this.indicatorStyle.width = this.width + "px"), t < this.minBoundaryY ? ("scale" == this.options.shrink && (this.height = n.max(this.indicatorHeight + 3 * t, 8), this.indicatorStyle.height = this.height + "px"), t = this.minBoundaryY) : t > this.maxBoundaryY ? "scale" == this.options.shrink ? (this.height = n.max(this.indicatorHeight - 3 * (t - this.maxPosY), 8), this.indicatorStyle.height = this.height + "px", t = this.maxPosY + this.indicatorHeight - this.height) : t = this.maxBoundaryY : "scale" == this.options.shrink && this.height != this.indicatorHeight && (this.height = this.indicatorHeight, this.indicatorStyle.height = this.height + "px")), this.x = e, this.y = t, this.scroller.options.useTransform ? this.indicatorStyle[s.style.transform] = "translate(" + e + "px," + t + "px)" + this.scroller.translateZ : (this.indicatorStyle.left = e + "px", this.indicatorStyle.top = t + "px")
      },
      _pos: function(e, t) {
        0 > e ? e = 0 : e > this.maxPosX && (e = this.maxPosX), 0 > t ? t = 0 : t > this.maxPosY && (t = this.maxPosY), e = this.options.listenX ? n.round(e / this.sizeRatioX) : this.scroller.x, t = this.options.listenY ? n.round(t / this.sizeRatioY) : this.scroller.y, this.scroller.scrollTo(e, t)
      },
      fade: function(e, t) {
        if (!t || this.visible) {
          clearTimeout(this.fadeTimeout), this.fadeTimeout = null;
          var n = e ? 250 : 500,
            i = e ? 0 : 300;
          e = e ? "1" : "0", this.wrapperStyle[s.style.transitionDuration] = n + "ms", this.fadeTimeout = setTimeout(function(e) {
            this.wrapperStyle.opacity = e, this.visible = +e
          }.bind(this, e), i)
        }
      }
    }, i.utils = s, "undefined" != typeof module && module.exports ? module.exports = i : e.IScroll = i
  }(window, document, Math),
  function(e) {
    e.fn.curlies = function() {
      function t(e) {
        return e.replace(/(^|[-\u2014\s(\["])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/--/g, "—")
      }
      return this.each(function() {
        var n = e(this),
          i = n.children();
        i.length ? i.each(function() {
          e(this).curlies()
        }) : n.text(t(n.text()))
      })
    }
  }(jQuery),
  function(e) {
    e.fn.fitText = function(t, n) {
      var i = t || 1,
        o = e.extend({
          minFontSize: Number.NEGATIVE_INFINITY,
          maxFontSize: Number.POSITIVE_INFINITY
        }, n);
      return this.each(function() {
        var t = e(this),
          n = function() {
            t.css("font-size", Math.max(Math.min(t.width() / (10 * i), parseFloat(o.maxFontSize)), parseFloat(o.minFontSize)))
          };
        n(), e(window).on("resize.fittext orientationchange.fittext", n)
      })
    }
  }(jQuery),
  function(e) {
    e.flexslider = function(t, n) {
      var i = e(t);
      i.vars = e.extend({}, e.flexslider.defaults, n);
      var o, a = i.vars.namespace,
        r = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
        s = ("ontouchstart" in window || r || window.DocumentTouch && document instanceof DocumentTouch) && i.vars.touch,
        l = "click touchend MSPointerUp",
        c = "",
        u = "vertical" === i.vars.direction,
        d = i.vars.reverse,
        p = i.vars.itemWidth > 0,
        h = "fade" === i.vars.animation,
        f = "" !== i.vars.asNavFor,
        m = {},
        g = !0;
      e.data(t, "flexslider", i), m = {
        init: function() {
          i.animating = !1, i.currentSlide = parseInt(i.vars.startAt ? i.vars.startAt : 0), isNaN(i.currentSlide) && (i.currentSlide = 0), i.animatingTo = i.currentSlide, i.atEnd = 0 === i.currentSlide || i.currentSlide === i.last, i.containerSelector = i.vars.selector.substr(0, i.vars.selector.search(" ")), i.slides = e(i.vars.selector, i), i.container = e(i.containerSelector, i), i.count = i.slides.length, i.syncExists = e(i.vars.sync).length > 0, "slide" === i.vars.animation && (i.vars.animation = "swing"), i.prop = u ? "top" : "marginLeft", i.args = {}, i.manualPause = !1, i.stopped = !1, i.started = !1, i.startTimeout = null, i.transitions = !i.vars.video && !h && i.vars.useCSS && function() {
            var e = document.createElement("div"),
              t = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
            for (var n in t)
              if (void 0 !== e.style[t[n]]) return i.pfx = t[n].replace("Perspective", "").toLowerCase(), i.prop = "-" + i.pfx + "-transform", !0;
            return !1
          }(), "" !== i.vars.controlsContainer && (i.controlsContainer = e(i.vars.controlsContainer).length > 0 && e(i.vars.controlsContainer)), "" !== i.vars.manualControls && (i.manualControls = e(i.vars.manualControls).length > 0 && e(i.vars.manualControls)), i.vars.randomize && (i.slides.sort(function() {
            return Math.round(Math.random()) - .5
          }), i.container.empty().append(i.slides)), i.doMath(), i.setup("init"), i.vars.controlNav && m.controlNav.setup(), i.vars.directionNav && m.directionNav.setup(), i.vars.keyboard && (1 === e(i.containerSelector).length || i.vars.multipleKeyboard) && e(document).bind("keyup", function(e) {
            var t = e.keyCode;
            if (!i.animating && (39 === t || 37 === t)) {
              var n = 39 === t ? i.getTarget("next") : 37 === t ? i.getTarget("prev") : !1;
              i.flexAnimate(n, i.vars.pauseOnAction)
            }
          }), i.vars.mousewheel && i.bind("mousewheel", function(e, t) {
            e.preventDefault();
            var n = 0 > t ? i.getTarget("next") : i.getTarget("prev");
            i.flexAnimate(n, i.vars.pauseOnAction)
          }), i.vars.pausePlay && m.pausePlay.setup(), i.vars.slideshow && i.vars.pauseInvisible && m.pauseInvisible.init(), i.vars.slideshow && (i.vars.pauseOnHover && i.hover(function() {
            i.manualPlay || i.manualPause || i.pause()
          }, function() {
            i.manualPause || i.manualPlay || i.stopped || i.play()
          }), i.vars.pauseInvisible && m.pauseInvisible.isHidden() || (i.vars.initDelay > 0 ? i.startTimeout = setTimeout(i.play, i.vars.initDelay) : i.play())), f && m.asNav.setup(), s && i.vars.touch && m.touch(), (!h || h && i.vars.smoothHeight) && e(window).bind("resize orientationchange focus", m.resize), i.find("img").attr("draggable", "false"), setTimeout(function() {
            i.vars.start(i)
          }, 200)
        },
        asNav: {
          setup: function() {
            i.asNav = !0, i.animatingTo = Math.floor(i.currentSlide / i.move), i.currentItem = i.currentSlide, i.slides.removeClass(a + "active-slide").eq(i.currentItem).addClass(a + "active-slide"), r ? (t._slider = i, i.slides.each(function() {
              var t = this;
              t._gesture = new MSGesture, t._gesture.target = t, t.addEventListener("MSPointerDown", function(e) {
                e.preventDefault(), e.currentTarget._gesture && e.currentTarget._gesture.addPointer(e.pointerId)
              }, !1), t.addEventListener("MSGestureTap", function(t) {
                t.preventDefault();
                var n = e(this),
                  o = n.index();
                e(i.vars.asNavFor).data("flexslider").animating || n.hasClass("active") || (i.direction = i.currentItem < o ? "next" : "prev", i.flexAnimate(o, i.vars.pauseOnAction, !1, !0, !0))
              })
            })) : i.slides.click(function(t) {
              t.preventDefault();
              var n = e(this),
                o = n.index(),
                r = n.offset().left - e(i).scrollLeft();
              0 >= r && n.hasClass(a + "active-slide") ? i.flexAnimate(i.getTarget("prev"), !0) : e(i.vars.asNavFor).data("flexslider").animating || n.hasClass(a + "active-slide") || (i.direction = i.currentItem < o ? "next" : "prev", i.flexAnimate(o, i.vars.pauseOnAction, !1, !0, !0))
            })
          }
        },
        controlNav: {
          setup: function() {
            i.manualControls ? m.controlNav.setupManual() : m.controlNav.setupPaging()
          },
          setupPaging: function() {
            var t, n, o = "thumbnails" === i.vars.controlNav ? "control-thumbs" : "control-paging",
              r = 1;
            if (i.controlNavScaffold = e('<ol class="' + a + "control-nav " + a + o + '"></ol>'), i.pagingCount > 1)
              for (var s = 0; s < i.pagingCount; s++) {
                if (n = i.slides.eq(s), t = "thumbnails" === i.vars.controlNav ? '<img src="' + n.attr("data-thumb") + '"/>' : "<a>" + r + "</a>", "thumbnails" === i.vars.controlNav && !0 === i.vars.thumbCaptions) {
                  var u = n.attr("data-thumbcaption");
                  "" != u && void 0 != u && (t += '<span class="' + a + 'caption">' + u + "</span>")
                }
                i.controlNavScaffold.append("<li>" + t + "</li>"), r++
              }
            i.controlsContainer ? e(i.controlsContainer).append(i.controlNavScaffold) : i.append(i.controlNavScaffold), m.controlNav.set(), m.controlNav.active(), i.controlNavScaffold.delegate("a, img", l, function(t) {
              if (t.preventDefault(), "" === c || c === t.type) {
                var n = e(this),
                  o = i.controlNav.index(n);
                n.hasClass(a + "active") || (i.direction = o > i.currentSlide ? "next" : "prev", i.flexAnimate(o, i.vars.pauseOnAction))
              }
              "" === c && (c = t.type), m.setToClearWatchedEvent()
            })
          },
          setupManual: function() {
            i.controlNav = i.manualControls, m.controlNav.active(), i.controlNav.bind(l, function(t) {
              if (t.preventDefault(), "" === c || c === t.type) {
                var n = e(this),
                  o = i.controlNav.index(n);
                n.hasClass(a + "active") || (i.direction = o > i.currentSlide ? "next" : "prev", i.flexAnimate(o, i.vars.pauseOnAction))
              }
              "" === c && (c = t.type), m.setToClearWatchedEvent()
            })
          },
          set: function() {
            var t = "thumbnails" === i.vars.controlNav ? "img" : "a";
            i.controlNav = e("." + a + "control-nav li " + t, i.controlsContainer ? i.controlsContainer : i)
          },
          active: function() {
            i.controlNav.removeClass(a + "active").eq(i.animatingTo).addClass(a + "active")
          },
          update: function(t, n) {
            i.pagingCount > 1 && "add" === t ? i.controlNavScaffold.append(e("<li><a>" + i.count + "</a></li>")) : 1 === i.pagingCount ? i.controlNavScaffold.find("li").remove() : i.controlNav.eq(n).closest("li").remove(), m.controlNav.set(), i.pagingCount > 1 && i.pagingCount !== i.controlNav.length ? i.update(n, t) : m.controlNav.active()
          }
        },
        directionNav: {
          setup: function() {
            var t = e('<ul class="' + a + 'direction-nav"><li><a class="' + a + 'prev" href="#">' + i.vars.prevText + '</a></li><li><a class="' + a + 'next" href="#">' + i.vars.nextText + "</a></li></ul>");
            i.controlsContainer ? (e(i.controlsContainer).append(t), i.directionNav = e("." + a + "direction-nav li a", i.controlsContainer)) : (i.append(t), i.directionNav = e("." + a + "direction-nav li a", i)), m.directionNav.update(), i.directionNav.bind(l, function(t) {
              t.preventDefault();
              var n;
              ("" === c || c === t.type) && (n = e(this).hasClass(a + "next") ? i.getTarget("next") : i.getTarget("prev"), i.flexAnimate(n, i.vars.pauseOnAction)), "" === c && (c = t.type), m.setToClearWatchedEvent()
            })
          },
          update: function() {
            var e = a + "disabled";
            1 === i.pagingCount ? i.directionNav.addClass(e).attr("tabindex", "-1") : i.vars.animationLoop ? i.directionNav.removeClass(e).removeAttr("tabindex") : 0 === i.animatingTo ? i.directionNav.removeClass(e).filter("." + a + "prev").addClass(e).attr("tabindex", "-1") : i.animatingTo === i.last ? i.directionNav.removeClass(e).filter("." + a + "next").addClass(e).attr("tabindex", "-1") : i.directionNav.removeClass(e).removeAttr("tabindex")
          }
        },
        pausePlay: {
          setup: function() {
            var t = e('<div class="' + a + 'pauseplay"><a></a></div>');
            i.controlsContainer ? (i.controlsContainer.append(t), i.pausePlay = e("." + a + "pauseplay a", i.controlsContainer)) : (i.append(t), i.pausePlay = e("." + a + "pauseplay a", i)), m.pausePlay.update(i.vars.slideshow ? a + "pause" : a + "play"), i.pausePlay.bind(l, function(t) {
              t.preventDefault(), ("" === c || c === t.type) && (e(this).hasClass(a + "pause") ? (i.manualPause = !0, i.manualPlay = !1, i.pause()) : (i.manualPause = !1, i.manualPlay = !0, i.play())), "" === c && (c = t.type), m.setToClearWatchedEvent()
            })
          },
          update: function(e) {
            "play" === e ? i.pausePlay.removeClass(a + "pause").addClass(a + "play").html(i.vars.playText) : i.pausePlay.removeClass(a + "play").addClass(a + "pause").html(i.vars.pauseText)
          }
        },
        touch: function() {
          function e(e) {
            i.animating ? e.preventDefault() : (window.navigator.msPointerEnabled || 1 === e.touches.length) && (i.pause(), g = u ? i.h : i.w, y = Number(new Date), b = e.touches[0].pageX, _ = e.touches[0].pageY, m = p && d && i.animatingTo === i.last ? 0 : p && d ? i.limit - (i.itemW + i.vars.itemMargin) * i.move * i.animatingTo : p && i.currentSlide === i.last ? i.limit : p ? (i.itemW + i.vars.itemMargin) * i.move * i.currentSlide : d ? (i.last - i.currentSlide + i.cloneOffset) * g : (i.currentSlide + i.cloneOffset) * g, c = u ? _ : b, f = u ? b : _, t.addEventListener("touchmove", n, !1), t.addEventListener("touchend", o, !1))
          }

          function n(e) {
            b = e.touches[0].pageX, _ = e.touches[0].pageY, v = u ? c - _ : c - b, w = u ? Math.abs(v) < Math.abs(b - f) : Math.abs(v) < Math.abs(_ - f);
            var t = 500;
            (!w || Number(new Date) - y > t) && (e.preventDefault(), !h && i.transitions && (i.vars.animationLoop || (v /= 0 === i.currentSlide && 0 > v || i.currentSlide === i.last && v > 0 ? Math.abs(v) / g + 2 : 1), i.setProps(m + v, "setTouch")))
          }

          function o() {
            if (t.removeEventListener("touchmove", n, !1), i.animatingTo === i.currentSlide && !w && null !== v) {
              var e = d ? -v : v,
                a = e > 0 ? i.getTarget("next") : i.getTarget("prev");
              i.canAdvance(a) && (Number(new Date) - y < 550 && Math.abs(e) > 50 || Math.abs(e) > g / 2) ? i.flexAnimate(a, i.vars.pauseOnAction) : h || i.flexAnimate(i.currentSlide, i.vars.pauseOnAction, !0)
            }
            t.removeEventListener("touchend", o, !1), c = null, f = null, v = null, m = null
          }

          function a(e) {
            e.stopPropagation(), i.animating ? e.preventDefault() : (i.pause(), t._gesture.addPointer(e.pointerId), x = 0, g = u ? i.h : i.w, y = Number(new Date), m = p && d && i.animatingTo === i.last ? 0 : p && d ? i.limit - (i.itemW + i.vars.itemMargin) * i.move * i.animatingTo : p && i.currentSlide === i.last ? i.limit : p ? (i.itemW + i.vars.itemMargin) * i.move * i.currentSlide : d ? (i.last - i.currentSlide + i.cloneOffset) * g : (i.currentSlide + i.cloneOffset) * g)
          }

          function s(e) {
            e.stopPropagation();
            var n = e.target._slider;
            if (n) {
              var i = -e.translationX,
                o = -e.translationY;
              return x += u ? o : i, v = x, w = u ? Math.abs(x) < Math.abs(-i) : Math.abs(x) < Math.abs(-o), e.detail === e.MSGESTURE_FLAG_INERTIA ? (setImmediate(function() {
                t._gesture.stop()
              }), void 0) : ((!w || Number(new Date) - y > 500) && (e.preventDefault(), !h && n.transitions && (n.vars.animationLoop || (v = x / (0 === n.currentSlide && 0 > x || n.currentSlide === n.last && x > 0 ? Math.abs(x) / g + 2 : 1)), n.setProps(m + v, "setTouch"))), void 0)
            }
          }

          function l(e) {
            e.stopPropagation();
            var t = e.target._slider;
            if (t) {
              if (t.animatingTo === t.currentSlide && !w && null !== v) {
                var n = d ? -v : v,
                  i = n > 0 ? t.getTarget("next") : t.getTarget("prev");
                t.canAdvance(i) && (Number(new Date) - y < 550 && Math.abs(n) > 50 || Math.abs(n) > g / 2) ? t.flexAnimate(i, t.vars.pauseOnAction) : h || t.flexAnimate(t.currentSlide, t.vars.pauseOnAction, !0)
              }
              c = null, f = null, v = null, m = null, x = 0
            }
          }
          var c, f, m, g, v, y, w = !1,
            b = 0,
            _ = 0,
            x = 0;
          r ? (t.style.msTouchAction = "none", t._gesture = new MSGesture, t._gesture.target = t, t.addEventListener("MSPointerDown", a, !1), t._slider = i, t.addEventListener("MSGestureChange", s, !1), t.addEventListener("MSGestureEnd", l, !1)) : t.addEventListener("touchstart", e, !1)
        },
        resize: function() {
          !i.animating && i.is(":visible") && (p || i.doMath(), h ? m.smoothHeight() : p ? (i.slides.width(i.computedW), i.update(i.pagingCount), i.setProps()) : u ? (i.viewport.height(i.h), i.setProps(i.h, "setTotal")) : (i.vars.smoothHeight && m.smoothHeight(), i.newSlides.width(i.computedW), i.setProps(i.computedW, "setTotal")))
        },
        smoothHeight: function(e) {
          if (!u || h) {
            var t = h ? i : i.viewport;
            e ? t.animate({
              height: i.slides.eq(i.animatingTo).height()
            }, e) : t.height(i.slides.eq(i.animatingTo).height())
          }
        },
        sync: function(t) {
          var n = e(i.vars.sync).data("flexslider"),
            o = i.animatingTo;
          switch (t) {
            case "animate":
              n.flexAnimate(o, i.vars.pauseOnAction, !1, !0);
              break;
            case "play":
              n.playing || n.asNav || n.play();
              break;
            case "pause":
              n.pause()
          }
        },
        pauseInvisible: {
          visProp: null,
          init: function() {
            var e = ["webkit", "moz", "ms", "o"];
            if ("hidden" in document) return "hidden";
            for (var t = 0; t < e.length; t++) e[t] + "Hidden" in document && (m.pauseInvisible.visProp = e[t] + "Hidden");
            if (m.pauseInvisible.visProp) {
              var n = m.pauseInvisible.visProp.replace(/[H|h]idden/, "") + "visibilitychange";
              document.addEventListener(n, function() {
                m.pauseInvisible.isHidden() ? i.startTimeout ? clearTimeout(i.startTimeout) : i.pause() : i.started ? i.play() : i.vars.initDelay > 0 ? setTimeout(i.play, i.vars.initDelay) : i.play()
              })
            }
          },
          isHidden: function() {
            return document[m.pauseInvisible.visProp] || !1
          }
        },
        setToClearWatchedEvent: function() {
          clearTimeout(o), o = setTimeout(function() {
            c = ""
          }, 3e3)
        }
      }, i.flexAnimate = function(t, n, o, r, l) {
        if (i.vars.animationLoop || t === i.currentSlide || (i.direction = t > i.currentSlide ? "next" : "prev"), f && 1 === i.pagingCount && (i.direction = i.currentItem < t ? "next" : "prev"), !i.animating && (i.canAdvance(t, l) || o) && i.is(":visible")) {
          if (f && r) {
            var c = e(i.vars.asNavFor).data("flexslider");
            if (i.atEnd = 0 === t || t === i.count - 1, c.flexAnimate(t, !0, !1, !0, l), i.direction = i.currentItem < t ? "next" : "prev", c.direction = i.direction, Math.ceil((t + 1) / i.visible) - 1 === i.currentSlide || 0 === t) return i.currentItem = t, i.slides.removeClass(a + "active-slide").eq(t).addClass(a + "active-slide"), !1;
            i.currentItem = t, i.slides.removeClass(a + "active-slide").eq(t).addClass(a + "active-slide"), t = Math.floor(t / i.visible)
          }
          if (i.animating = !0, i.animatingTo = t, n && i.pause(), i.vars.before(i), i.syncExists && !l && m.sync("animate"), i.vars.controlNav && m.controlNav.active(), p || i.slides.removeClass(a + "active-slide").eq(t).addClass(a + "active-slide"), i.atEnd = 0 === t || t === i.last, i.vars.directionNav && m.directionNav.update(), t === i.last && (i.vars.end(i), i.vars.animationLoop || i.pause()), h) s ? (i.slides.eq(i.currentSlide).css({
            opacity: 0,
            zIndex: 1
          }), i.slides.eq(t).css({
            opacity: 1,
            zIndex: 2
          }), i.wrapup(w)) : (i.slides.eq(i.currentSlide).css({
            zIndex: 1
          }).animate({
            opacity: 0
          }, i.vars.animationSpeed, i.vars.easing), i.slides.eq(t).css({
            zIndex: 2
          }).animate({
            opacity: 1
          }, i.vars.animationSpeed, i.vars.easing, i.wrapup));
          else {
            var g, v, y, w = u ? i.slides.filter(":first").height() : i.computedW;
            p ? (g = i.vars.itemMargin, y = (i.itemW + g) * i.move * i.animatingTo, v = y > i.limit && 1 !== i.visible ? i.limit : y) : v = 0 === i.currentSlide && t === i.count - 1 && i.vars.animationLoop && "next" !== i.direction ? d ? (i.count + i.cloneOffset) * w : 0 : i.currentSlide === i.last && 0 === t && i.vars.animationLoop && "prev" !== i.direction ? d ? 0 : (i.count + 1) * w : d ? (i.count - 1 - t + i.cloneOffset) * w : (t + i.cloneOffset) * w, i.setProps(v, "", i.vars.animationSpeed), i.transitions ? (i.vars.animationLoop && i.atEnd || (i.animating = !1, i.currentSlide = i.animatingTo), i.container.unbind("webkitTransitionEnd transitionend"), i.container.bind("webkitTransitionEnd transitionend", function() {
              i.wrapup(w)
            })) : i.container.animate(i.args, i.vars.animationSpeed, i.vars.easing, function() {
              i.wrapup(w)
            })
          }
          i.vars.smoothHeight && m.smoothHeight(i.vars.animationSpeed)
        }
      }, i.wrapup = function(e) {
        h || p || (0 === i.currentSlide && i.animatingTo === i.last && i.vars.animationLoop ? i.setProps(e, "jumpEnd") : i.currentSlide === i.last && 0 === i.animatingTo && i.vars.animationLoop && i.setProps(e, "jumpStart")), i.animating = !1, i.currentSlide = i.animatingTo, i.vars.after(i)
      }, i.animateSlides = function() {
        !i.animating && g && i.flexAnimate(i.getTarget("next"))
      }, i.pause = function() {
        clearInterval(i.animatedSlides), i.animatedSlides = null, i.playing = !1, i.vars.pausePlay && m.pausePlay.update("play"), i.syncExists && m.sync("pause")
      }, i.play = function() {
        i.playing && clearInterval(i.animatedSlides), i.animatedSlides = i.animatedSlides || setInterval(i.animateSlides, i.vars.slideshowSpeed), i.started = i.playing = !0, i.vars.pausePlay && m.pausePlay.update("pause"), i.syncExists && m.sync("play")
      }, i.stop = function() {
        i.pause(), i.stopped = !0
      }, i.canAdvance = function(e, t) {
        var n = f ? i.pagingCount - 1 : i.last;
        return t ? !0 : f && i.currentItem === i.count - 1 && 0 === e && "prev" === i.direction ? !0 : f && 0 === i.currentItem && e === i.pagingCount - 1 && "next" !== i.direction ? !1 : e !== i.currentSlide || f ? i.vars.animationLoop ? !0 : i.atEnd && 0 === i.currentSlide && e === n && "next" !== i.direction ? !1 : i.atEnd && i.currentSlide === n && 0 === e && "next" === i.direction ? !1 : !0 : !1
      }, i.getTarget = function(e) {
        return i.direction = e, "next" === e ? i.currentSlide === i.last ? 0 : i.currentSlide + 1 : 0 === i.currentSlide ? i.last : i.currentSlide - 1
      }, i.setProps = function(e, t, n) {
        var o = function() {
          var n = e ? e : (i.itemW + i.vars.itemMargin) * i.move * i.animatingTo,
            o = function() {
              if (p) return "setTouch" === t ? e : d && i.animatingTo === i.last ? 0 : d ? i.limit - (i.itemW + i.vars.itemMargin) * i.move * i.animatingTo : i.animatingTo === i.last ? i.limit : n;
              switch (t) {
                case "setTotal":
                  return d ? (i.count - 1 - i.currentSlide + i.cloneOffset) * e : (i.currentSlide + i.cloneOffset) * e;
                case "setTouch":
                  return d ? e : e;
                case "jumpEnd":
                  return d ? e : i.count * e;
                case "jumpStart":
                  return d ? i.count * e : e;
                default:
                  return e
              }
            }();
          return -1 * o + "px"
        }();
        i.transitions && (o = u ? "translate3d(0," + o + ",0)" : "translate3d(" + o + ",0,0)", n = void 0 !== n ? n / 1e3 + "s" : "0s", i.container.css("-" + i.pfx + "-transition-duration", n)), i.args[i.prop] = o, (i.transitions || void 0 === n) && i.container.css(i.args)
      }, i.setup = function(t) {
        if (h) i.slides.css({
          width: "100%",
          "float": "left",
          marginRight: "-100%",
          position: "relative"
        }), "init" === t && (s ? i.slides.css({
          opacity: 0,
          display: "block",
          webkitTransition: "opacity " + i.vars.animationSpeed / 1e3 + "s ease",
          zIndex: 1
        }).eq(i.currentSlide).css({
          opacity: 1,
          zIndex: 2
        }) : i.slides.css({
          opacity: 0,
          display: "block",
          zIndex: 1
        }).eq(i.currentSlide).css({
          zIndex: 2
        }).animate({
          opacity: 1
        }, i.vars.animationSpeed, i.vars.easing)), i.vars.smoothHeight && m.smoothHeight();
        else {
          var n, o;
          "init" === t && (i.viewport = e('<div class="' + a + 'viewport"></div>').css({
            overflow: "hidden",
            position: "relative"
          }).appendTo(i).append(i.container), i.cloneCount = 0, i.cloneOffset = 0, d && (o = e.makeArray(i.slides).reverse(), i.slides = e(o), i.container.empty().append(i.slides))), i.vars.animationLoop && !p && (i.cloneCount = 2, i.cloneOffset = 1, "init" !== t && i.container.find(".clone").remove(), i.container.append(i.slides.first().clone().addClass("clone").attr("aria-hidden", "true")).prepend(i.slides.last().clone().addClass("clone").attr("aria-hidden", "true"))), i.newSlides = e(i.vars.selector, i), n = d ? i.count - 1 - i.currentSlide + i.cloneOffset : i.currentSlide + i.cloneOffset, u && !p ? (i.container.height(200 * (i.count + i.cloneCount) + "%").css("position", "absolute").width("100%"), setTimeout(function() {
            i.newSlides.css({
              display: "block"
            }), i.doMath(), i.viewport.height(i.h), i.setProps(n * i.h, "init")
          }, "init" === t ? 100 : 0)) : (i.container.width(200 * (i.count + i.cloneCount) + "%"), i.setProps(n * i.computedW, "init"), setTimeout(function() {
            i.doMath(), i.newSlides.css({
              width: i.computedW,
              "float": "left",
              display: "block"
            }), i.vars.smoothHeight && m.smoothHeight()
          }, "init" === t ? 100 : 0))
        }
        p || i.slides.removeClass(a + "active-slide").eq(i.currentSlide).addClass(a + "active-slide")
      }, i.doMath = function() {
        var e = i.slides.first(),
          t = i.vars.itemMargin,
          n = i.vars.minItems,
          o = i.vars.maxItems;
        i.w = void 0 === i.viewport ? i.width() : i.viewport.width(), i.h = e.height(), i.boxPadding = e.outerWidth() - e.width(), p ? (i.itemT = i.vars.itemWidth + t, i.minW = n ? n * i.itemT : i.w, i.maxW = o ? o * i.itemT - t : i.w, i.itemW = i.minW > i.w ? (i.w - t * (n - 1)) / n : i.maxW < i.w ? (i.w - t * (o - 1)) / o : i.vars.itemWidth > i.w ? i.w : i.vars.itemWidth, i.visible = Math.floor(i.w / i.itemW), i.move = i.vars.move > 0 && i.vars.move < i.visible ? i.vars.move : i.visible, i.pagingCount = Math.ceil((i.count - i.visible) / i.move + 1), i.last = i.pagingCount - 1, i.limit = 1 === i.pagingCount ? 0 : i.vars.itemWidth > i.w ? i.itemW * (i.count - 1) + t * (i.count - 1) : (i.itemW + t) * i.count - i.w - t) : (i.itemW = i.w, i.pagingCount = i.count, i.last = i.count - 1), i.computedW = i.itemW - i.boxPadding
      }, i.update = function(e, t) {
        i.doMath(), p || (e < i.currentSlide ? i.currentSlide += 1 : e <= i.currentSlide && 0 !== e && (i.currentSlide -= 1), i.animatingTo = i.currentSlide), i.vars.controlNav && !i.manualControls && ("add" === t && !p || i.pagingCount > i.controlNav.length ? m.controlNav.update("add") : ("remove" === t && !p || i.pagingCount < i.controlNav.length) && (p && i.currentSlide > i.last && (i.currentSlide -= 1, i.animatingTo -= 1), m.controlNav.update("remove", i.last))), i.vars.directionNav && m.directionNav.update()
      }, i.addSlide = function(t, n) {
        var o = e(t);
        i.count += 1, i.last = i.count - 1, u && d ? void 0 !== n ? i.slides.eq(i.count - n).after(o) : i.container.prepend(o) : void 0 !== n ? i.slides.eq(n).before(o) : i.container.append(o), i.update(n, "add"), i.slides = e(i.vars.selector + ":not(.clone)", i), i.setup(), i.vars.added(i)
      }, i.removeSlide = function(t) {
        var n = isNaN(t) ? i.slides.index(e(t)) : t;
        i.count -= 1, i.last = i.count - 1, isNaN(t) ? e(t, i.slides).remove() : u && d ? i.slides.eq(i.last).remove() : i.slides.eq(t).remove(), i.doMath(), i.update(n, "remove"), i.slides = e(i.vars.selector + ":not(.clone)", i), i.setup(), i.vars.removed(i)
      }, m.init()
    }, e(window).blur(function() {
      focused = !1
    }).focus(function() {
      focused = !0
    }), e.flexslider.defaults = {
      namespace: "flex-",
      selector: ".slides > li",
      animation: "fade",
      easing: "swing",
      direction: "horizontal",
      reverse: !1,
      animationLoop: !0,
      smoothHeight: !1,
      startAt: 0,
      slideshow: !0,
      slideshowSpeed: 7e3,
      animationSpeed: 600,
      initDelay: 0,
      randomize: !1,
      thumbCaptions: !1,
      pauseOnAction: !0,
      pauseOnHover: !1,
      pauseInvisible: !0,
      useCSS: !0,
      touch: !0,
      video: !1,
      controlNav: !0,
      directionNav: !0,
      prevText: "Previous",
      nextText: "Next",
      keyboard: !0,
      multipleKeyboard: !1,
      mousewheel: !1,
      pausePlay: !1,
      pauseText: "Pause",
      playText: "Play",
      controlsContainer: "",
      manualControls: "",
      sync: "",
      asNavFor: "",
      itemWidth: 0,
      itemMargin: 0,
      minItems: 1,
      maxItems: 0,
      move: 0,
      allowOneSlide: !0,
      start: function() {},
      before: function() {},
      after: function() {},
      end: function() {},
      added: function() {},
      removed: function() {}
    }, e.fn.flexslider = function(t) {
      if (void 0 === t && (t = {}), "object" == typeof t) return this.each(function() {
        var n = e(this),
          i = t.selector ? t.selector : ".slides > li",
          o = n.find(i);
        1 === o.length && t.allowOneSlide === !0 || 0 === o.length ? (o.fadeIn(400), t.start && t.start(n)) : void 0 === n.data("flexslider") && new e.flexslider(this, t)
      });
      var n = e(this).data("flexslider");
      switch (t) {
        case "play":
          n.play();
          break;
        case "pause":
          n.pause();
          break;
        case "stop":
          n.stop();
          break;
        case "next":
          n.flexAnimate(n.getTarget("next"), !0);
          break;
        case "prev":
        case "previous":
          n.flexAnimate(n.getTarget("prev"), !0);
          break;
        default:
          "number" == typeof t && n.flexAnimate(t, !0)
      }
    }
  }(jQuery), "object" != typeof JSON && (JSON = {}),
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
      var n, i, o, a, r, s = gap,
        l = t[e];
      switch (l && "object" == typeof l && "function" == typeof l.toJSON && (l = l.toJSON(e)), "function" == typeof rep && (l = rep.call(t, e, l)), typeof l) {
        case "string":
          return quote(l);
        case "number":
          return isFinite(l) ? String(l) : "null";
        case "boolean":
        case "null":
          return String(l);
        case "object":
          if (!l) return "null";
          if (gap += indent, r = [], "[object Array]" === Object.prototype.toString.apply(l)) {
            for (a = l.length, n = 0; a > n; n += 1) r[n] = str(n, l) || "null";
            return o = 0 === r.length ? "[]" : gap ? "[\n" + gap + r.join(",\n" + gap) + "\n" + s + "]" : "[" + r.join(",") + "]", gap = s, o
          }
          if (rep && "object" == typeof rep)
            for (a = rep.length, n = 0; a > n; n += 1) "string" == typeof rep[n] && (i = rep[n], o = str(i, l), o && r.push(quote(i) + (gap ? ": " : ":") + o));
          else
            for (i in l) Object.prototype.hasOwnProperty.call(l, i) && (o = str(i, l), o && r.push(quote(i) + (gap ? ": " : ":") + o));
          return o = 0 === r.length ? "{}" : gap ? "{\n" + gap + r.join(",\n" + gap) + "\n" + s + "}" : "{" + r.join(",") + "}", gap = s, o
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
    "function" != typeof JSON.stringify && (JSON.stringify = function(e, t, n) {
      var i;
      if (gap = "", indent = "", "number" == typeof n)
        for (i = 0; n > i; i += 1) indent += " ";
      else "string" == typeof n && (indent = n);
      if (rep = t, !t || "function" == typeof t || "object" == typeof t && "number" == typeof t.length) return str("", {
        "": e
      });
      throw new Error("JSON.stringify")
    }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
      function walk(e, t) {
        var n, i, o = e[t];
        if (o && "object" == typeof o)
          for (n in o) Object.prototype.hasOwnProperty.call(o, n) && (i = walk(o, n), void 0 !== i ? o[n] = i : delete o[n]);
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
  }(),
  function(e, t) {
    "use strict";
    var n = e.History = e.History || {},
      i = e.jQuery;
    if ("undefined" != typeof n.Adapter) throw new Error("History.js Adapter has already been loaded...");
    n.Adapter = {
      bind: function(e, t, n) {
        i(e).bind(t, n)
      },
      trigger: function(e, t, n) {
        i(e).trigger(t, n)
      },
      extractEventData: function(e, n, i) {
        var o = n && n.originalEvent && n.originalEvent[e] || i && i[e] || t;
        return o
      },
      onDomLoad: function(e) {
        i(e)
      }
    }, "undefined" != typeof n.init && n.init()
  }(window),
  function(e) {
    "use strict";
    var t = e.document,
      n = e.setTimeout || n,
      i = e.clearTimeout || i,
      o = e.setInterval || o,
      a = e.History = e.History || {};
    if ("undefined" != typeof a.initHtml4) throw new Error("History.js HTML4 Support has already been loaded...");
    a.initHtml4 = function() {
      return "undefined" != typeof a.initHtml4.initialized ? !1 : (a.initHtml4.initialized = !0, a.enabled = !0, a.savedHashes = [], a.isLastHash = function(e) {
        var t, n = a.getHashByIndex();
        return t = e === n
      }, a.isHashEqual = function(e, t) {
        return e = encodeURIComponent(e).replace(/%25/g, "%"), t = encodeURIComponent(t).replace(/%25/g, "%"), e === t
      }, a.saveHash = function(e) {
        return a.isLastHash(e) ? !1 : (a.savedHashes.push(e), !0)
      }, a.getHashByIndex = function(e) {
        var t = null;
        return t = "undefined" == typeof e ? a.savedHashes[a.savedHashes.length - 1] : 0 > e ? a.savedHashes[a.savedHashes.length + e] : a.savedHashes[e]
      }, a.discardedHashes = {}, a.discardedStates = {}, a.discardState = function(e, t, n) {
        var i, o = a.getHashByState(e);
        return i = {
          discardedState: e,
          backState: n,
          forwardState: t
        }, a.discardedStates[o] = i, !0
      }, a.discardHash = function(e, t, n) {
        var i = {
          discardedHash: e,
          backState: n,
          forwardState: t
        };
        return a.discardedHashes[e] = i, !0
      }, a.discardedState = function(e) {
        var t, n = a.getHashByState(e);
        return t = a.discardedStates[n] || !1
      }, a.discardedHash = function(e) {
        var t = a.discardedHashes[e] || !1;
        return t
      }, a.recycleState = function(e) {
        var t = a.getHashByState(e);
        return a.discardedState(e) && delete a.discardedStates[t], !0
      }, a.emulated.hashChange && (a.hashChangeInit = function() {
        a.checkerFunction = null;
        var n, i, r, s, l = "",
          c = Boolean(a.getHash());
        return a.isInternetExplorer() ? (n = "historyjs-iframe", i = t.createElement("iframe"), i.setAttribute("id", n), i.setAttribute("src", "#"), i.style.display = "none", t.body.appendChild(i), i.contentWindow.document.open(), i.contentWindow.document.close(), r = "", s = !1, a.checkerFunction = function() {
          if (s) return !1;
          s = !0;
          var t = a.getHash(),
            n = a.getHash(i.contentWindow.document);
          return t !== l ? (l = t, n !== t && (r = n = t, i.contentWindow.document.open(), i.contentWindow.document.close(), i.contentWindow.document.location.hash = a.escapeHash(t)), a.Adapter.trigger(e, "hashchange")) : n !== r && (r = n, c && "" === n ? a.back() : a.setHash(n, !1)), s = !1, !0
        }) : a.checkerFunction = function() {
          var t = a.getHash() || "";
          return t !== l && (l = t, a.Adapter.trigger(e, "hashchange")), !0
        }, a.intervalList.push(o(a.checkerFunction, a.options.hashChangeInterval)), !0
      }, a.Adapter.onDomLoad(a.hashChangeInit)), a.emulated.pushState && (a.onHashChange = function(t) {
        var n, i = t && t.newURL || a.getLocationHref(),
          o = a.getHashByUrl(i),
          r = null,
          s = null;
        return a.isLastHash(o) ? (a.busy(!1), !1) : (a.doubleCheckComplete(), a.saveHash(o), o && a.isTraditionalAnchor(o) ? (a.Adapter.trigger(e, "anchorchange"), a.busy(!1), !1) : (r = a.extractState(a.getFullUrl(o || a.getLocationHref()), !0), a.isLastSavedState(r) ? (a.busy(!1), !1) : (s = a.getHashByState(r), n = a.discardedState(r), n ? (a.getHashByIndex(-2) === a.getHashByState(n.forwardState) ? a.back(!1) : a.forward(!1), !1) : (a.pushState(r.data, r.title, encodeURI(r.url), !1), !0))))
      }, a.Adapter.bind(e, "hashchange", a.onHashChange), a.pushState = function(t, n, i, o) {
        if (i = encodeURI(i).replace(/%25/g, "%"), a.getHashByUrl(i)) throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");
        if (o !== !1 && a.busy()) return a.pushQueue({
          scope: a,
          callback: a.pushState,
          args: arguments,
          queue: o
        }), !1;
        a.busy(!0);
        var r = a.createStateObject(t, n, i),
          s = a.getHashByState(r),
          l = a.getState(!1),
          c = a.getHashByState(l),
          u = a.getHash(),
          d = a.expectedStateId == r.id;
        return a.storeState(r), a.expectedStateId = r.id, a.recycleState(r), a.setTitle(r), s === c ? (a.busy(!1), !1) : (a.saveState(r), d || a.Adapter.trigger(e, "statechange"), !a.isHashEqual(s, u) && !a.isHashEqual(s, a.getShortUrl(a.getLocationHref())) && a.setHash(s, !1), a.busy(!1), !0)
      }, a.replaceState = function(t, n, i, o) {
        if (i = encodeURI(i).replace(/%25/g, "%"), a.getHashByUrl(i)) throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");
        if (o !== !1 && a.busy()) return a.pushQueue({
          scope: a,
          callback: a.replaceState,
          args: arguments,
          queue: o
        }), !1;
        a.busy(!0);
        var r = a.createStateObject(t, n, i),
          s = a.getHashByState(r),
          l = a.getState(!1),
          c = a.getHashByState(l),
          u = a.getStateByIndex(-2);
        return a.discardState(l, r, u), s === c ? (a.storeState(r), a.expectedStateId = r.id, a.recycleState(r), a.setTitle(r), a.saveState(r), a.Adapter.trigger(e, "statechange"), a.busy(!1)) : a.pushState(r.data, r.title, r.url, !1), !0
      }), a.emulated.pushState && a.getHash() && !a.emulated.hashChange && a.Adapter.onDomLoad(function() {
        a.Adapter.trigger(e, "hashchange")
      }), void 0)
    }, "undefined" != typeof a.init && a.init()
  }(window),
  function(e, t) {
    "use strict";
    var n = e.console || t,
      i = e.document,
      o = e.navigator,
      a = !1,
      r = e.setTimeout,
      s = e.clearTimeout,
      l = e.setInterval,
      c = e.clearInterval,
      u = e.JSON,
      d = e.alert,
      p = e.History = e.History || {},
      h = e.history;
    try {
      a = e.sessionStorage, a.setItem("TEST", "1"), a.removeItem("TEST")
    } catch (f) {
      a = !1
    }
    if (u.stringify = u.stringify || u.encode, u.parse = u.parse || u.decode, "undefined" != typeof p.init) throw new Error("History.js Core has already been loaded...");
    p.init = function() {
      return "undefined" == typeof p.Adapter ? !1 : ("undefined" != typeof p.initCore && p.initCore(), "undefined" != typeof p.initHtml4 && p.initHtml4(), !0)
    }, p.initCore = function() {
      if ("undefined" != typeof p.initCore.initialized) return !1;
      if (p.initCore.initialized = !0, p.options = p.options || {}, p.options.hashChangeInterval = p.options.hashChangeInterval || 100, p.options.safariPollInterval = p.options.safariPollInterval || 500, p.options.doubleCheckInterval = p.options.doubleCheckInterval || 500, p.options.disableSuid = p.options.disableSuid || !1, p.options.storeInterval = p.options.storeInterval || 1e3, p.options.busyDelay = p.options.busyDelay || 250, p.options.debug = p.options.debug || !1, p.options.initialTitle = p.options.initialTitle || i.title, p.options.html4Mode = p.options.html4Mode || !1, p.options.delayInit = p.options.delayInit || !1, p.intervalList = [], p.clearAllIntervals = function() {
          var e, t = p.intervalList;
          if ("undefined" != typeof t && null !== t) {
            for (e = 0; e < t.length; e++) c(t[e]);
            p.intervalList = null
          }
        }, p.debug = function() {
          (p.options.debug || !1) && p.log.apply(p, arguments)
        }, p.log = function() {
          var e, t, o, a, r, s = "undefined" != typeof n && "undefined" != typeof n.log && "undefined" != typeof n.log.apply,
            l = i.getElementById("log");
          for (s ? (a = Array.prototype.slice.call(arguments), e = a.shift(), "undefined" != typeof n.debug ? n.debug.apply(n, [e, a]) : n.log.apply(n, [e, a])) : e = "\n" + arguments[0] + "\n", t = 1, o = arguments.length; o > t; ++t) {
            if (r = arguments[t], "object" == typeof r && "undefined" != typeof u) try {
              r = u.stringify(r)
            } catch (c) {}
            e += "\n" + r + "\n"
          }
          return l ? (l.value += e + "\n-----\n", l.scrollTop = l.scrollHeight - l.clientHeight) : s || d(e), !0
        }, p.getInternetExplorerMajorVersion = function() {
          var e = p.getInternetExplorerMajorVersion.cached = "undefined" != typeof p.getInternetExplorerMajorVersion.cached ? p.getInternetExplorerMajorVersion.cached : function() {
            for (var e = 3, t = i.createElement("div"), n = t.getElementsByTagName("i");
              (t.innerHTML = "<!--[if gt IE " + ++e + "]><i></i><![endif]-->") && n[0];);
            return e > 4 ? e : !1
          }();
          return e
        }, p.isInternetExplorer = function() {
          var e = p.isInternetExplorer.cached = "undefined" != typeof p.isInternetExplorer.cached ? p.isInternetExplorer.cached : Boolean(p.getInternetExplorerMajorVersion());
          return e
        }, p.emulated = p.options.html4Mode ? {
          pushState: !0,
          hashChange: !0
        } : {
          pushState: !Boolean(e.history && e.history.pushState && e.history.replaceState && !/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(o.userAgent) && !/AppleWebKit\/5([0-2]|3[0-2])/i.test(o.userAgent)),
          hashChange: Boolean(!("onhashchange" in e || "onhashchange" in i) || p.isInternetExplorer() && p.getInternetExplorerMajorVersion() < 8)
        }, p.enabled = !p.emulated.pushState, p.bugs = {
          setHash: Boolean(!p.emulated.pushState && "Apple Computer, Inc." === o.vendor && /AppleWebKit\/5([0-2]|3[0-3])/.test(o.userAgent)),
          safariPoll: Boolean(!p.emulated.pushState && "Apple Computer, Inc." === o.vendor && /AppleWebKit\/5([0-2]|3[0-3])/.test(o.userAgent)),
          ieDoubleCheck: Boolean(p.isInternetExplorer() && p.getInternetExplorerMajorVersion() < 8),
          hashEscape: Boolean(p.isInternetExplorer() && p.getInternetExplorerMajorVersion() < 7)
        }, p.isEmptyObject = function(e) {
          for (var t in e)
            if (e.hasOwnProperty(t)) return !1;
          return !0
        }, p.cloneObject = function(e) {
          var t, n;
          return e ? (t = u.stringify(e), n = u.parse(t)) : n = {}, n
        }, p.getRootUrl = function() {
          var e = i.location.protocol + "//" + (i.location.hostname || i.location.host);
          return i.location.port && (e += ":" + i.location.port), e += "/"
        }, p.getBaseHref = function() {
          var e = i.getElementsByTagName("base"),
            t = null,
            n = "";
          return 1 === e.length && (t = e[0], n = t.href.replace(/[^\/]+$/, "")), n = n.replace(/\/+$/, ""), n && (n += "/"), n
        }, p.getBaseUrl = function() {
          var e = p.getBaseHref() || p.getBasePageUrl() || p.getRootUrl();
          return e
        }, p.getPageUrl = function() {
          var e, t = p.getState(!1, !1),
            n = (t || {}).url || p.getLocationHref();
          return e = n.replace(/\/+$/, "").replace(/[^\/]+$/, function(e) {
            return /\./.test(e) ? e : e + "/"
          })
        }, p.getBasePageUrl = function() {
          var e = p.getLocationHref().replace(/[#\?].*/, "").replace(/[^\/]+$/, function(e) {
            return /[^\/]$/.test(e) ? "" : e
          }).replace(/\/+$/, "") + "/";
          return e
        }, p.getFullUrl = function(e, t) {
          var n = e,
            i = e.substring(0, 1);
          return t = "undefined" == typeof t ? !0 : t, /[a-z]+\:\/\//.test(e) || (n = "/" === i ? p.getRootUrl() + e.replace(/^\/+/, "") : "#" === i ? p.getPageUrl().replace(/#.*/, "") + e : "?" === i ? p.getPageUrl().replace(/[\?#].*/, "") + e : t ? p.getBaseUrl() + e.replace(/^(\.\/)+/, "") : p.getBasePageUrl() + e.replace(/^(\.\/)+/, "")), n.replace(/\#$/, "")
        }, p.getShortUrl = function(e) {
          var t = e,
            n = p.getBaseUrl(),
            i = p.getRootUrl();
          return p.emulated.pushState && (t = t.replace(n, "")), t = t.replace(i, "/"), p.isTraditionalAnchor(t) && (t = "./" + t), t = t.replace(/^(\.\/)+/g, "./").replace(/\#$/, "")
        }, p.getLocationHref = function(e) {
          return e = e || i, e.URL === e.location.href ? e.location.href : e.location.href === decodeURIComponent(e.URL) ? e.URL : e.location.hash && decodeURIComponent(e.location.href.replace(/^[^#]+/, "")) === e.location.hash ? e.location.href : -1 == e.URL.indexOf("#") && -1 != e.location.href.indexOf("#") ? e.location.href : e.URL || e.location.href
        }, p.store = {}, p.idToState = p.idToState || {}, p.stateToId = p.stateToId || {}, p.urlToId = p.urlToId || {}, p.storedStates = p.storedStates || [], p.savedStates = p.savedStates || [], p.normalizeStore = function() {
          p.store.idToState = p.store.idToState || {}, p.store.urlToId = p.store.urlToId || {}, p.store.stateToId = p.store.stateToId || {}
        }, p.getState = function(e, t) {
          "undefined" == typeof e && (e = !0), "undefined" == typeof t && (t = !0);
          var n = p.getLastSavedState();
          return !n && t && (n = p.createStateObject()), e && (n = p.cloneObject(n), n.url = n.cleanUrl || n.url), n
        }, p.getIdByState = function(e) {
          var t, n = p.extractId(e.url);
          if (!n)
            if (t = p.getStateString(e), "undefined" != typeof p.stateToId[t]) n = p.stateToId[t];
            else if ("undefined" != typeof p.store.stateToId[t]) n = p.store.stateToId[t];
          else {
            for (; n = (new Date).getTime() + String(Math.random()).replace(/\D/g, ""), "undefined" != typeof p.idToState[n] || "undefined" != typeof p.store.idToState[n];);
            p.stateToId[t] = n, p.idToState[n] = e
          }
          return n
        }, p.normalizeState = function(e) {
          var t, n;
          return e && "object" == typeof e || (e = {}), "undefined" != typeof e.normalized ? e : (e.data && "object" == typeof e.data || (e.data = {}), t = {}, t.normalized = !0, t.title = e.title || "", t.url = p.getFullUrl(e.url ? e.url : p.getLocationHref()), t.hash = p.getShortUrl(t.url), t.data = p.cloneObject(e.data), t.id = p.getIdByState(t), t.cleanUrl = t.url.replace(/\??\&_suid.*/, ""), t.url = t.cleanUrl, n = !p.isEmptyObject(t.data), (t.title || n) && p.options.disableSuid !== !0 && (t.hash = p.getShortUrl(t.url).replace(/\??\&_suid.*/, ""), /\?/.test(t.hash) || (t.hash += "?"), t.hash += "&_suid=" + t.id), t.hashedUrl = p.getFullUrl(t.hash), (p.emulated.pushState || p.bugs.safariPoll) && p.hasUrlDuplicate(t) && (t.url = t.hashedUrl), t)
        }, p.createStateObject = function(e, t, n) {
          var i = {
            data: e,
            title: t,
            url: n
          };
          return i = p.normalizeState(i)
        }, p.getStateById = function(e) {
          e = String(e);
          var n = p.idToState[e] || p.store.idToState[e] || t;
          return n
        }, p.getStateString = function(e) {
          var t, n, i;
          return t = p.normalizeState(e), n = {
            data: t.data,
            title: e.title,
            url: e.url
          }, i = u.stringify(n)
        }, p.getStateId = function(e) {
          var t, n;
          return t = p.normalizeState(e), n = t.id
        }, p.getHashByState = function(e) {
          var t, n;
          return t = p.normalizeState(e), n = t.hash
        }, p.extractId = function(e) {
          var t, n, i, o;
          return o = -1 != e.indexOf("#") ? e.split("#")[0] : e, n = /(.*)\&_suid=([0-9]+)$/.exec(o), i = n ? n[1] || e : e, t = n ? String(n[2] || "") : "", t || !1
        }, p.isTraditionalAnchor = function(e) {
          var t = !/[\/\?\.]/.test(e);
          return t
        }, p.extractState = function(e, t) {
          var n, i, o = null;
          return t = t || !1, n = p.extractId(e), n && (o = p.getStateById(n)), o || (i = p.getFullUrl(e), n = p.getIdByUrl(i) || !1, n && (o = p.getStateById(n)), !o && t && !p.isTraditionalAnchor(e) && (o = p.createStateObject(null, null, i))), o
        }, p.getIdByUrl = function(e) {
          var n = p.urlToId[e] || p.store.urlToId[e] || t;
          return n
        }, p.getLastSavedState = function() {
          return p.savedStates[p.savedStates.length - 1] || t
        }, p.getLastStoredState = function() {
          return p.storedStates[p.storedStates.length - 1] || t
        }, p.hasUrlDuplicate = function(e) {
          var t, n = !1;
          return t = p.extractState(e.url), n = t && t.id !== e.id
        }, p.storeState = function(e) {
          return p.urlToId[e.url] = e.id, p.storedStates.push(p.cloneObject(e)), e
        }, p.isLastSavedState = function(e) {
          var t, n, i, o = !1;
          return p.savedStates.length && (t = e.id, n = p.getLastSavedState(), i = n.id, o = t === i), o
        }, p.saveState = function(e) {
          return p.isLastSavedState(e) ? !1 : (p.savedStates.push(p.cloneObject(e)), !0)
        }, p.getStateByIndex = function(e) {
          var t = null;
          return t = "undefined" == typeof e ? p.savedStates[p.savedStates.length - 1] : 0 > e ? p.savedStates[p.savedStates.length + e] : p.savedStates[e]
        }, p.getCurrentIndex = function() {
          var e = null;
          return e = p.savedStates.length < 1 ? 0 : p.savedStates.length - 1
        }, p.getHash = function(e) {
          var t, n = p.getLocationHref(e);
          return t = p.getHashByUrl(n)
        }, p.unescapeHash = function(e) {
          var t = p.normalizeHash(e);
          return t = decodeURIComponent(t)
        }, p.normalizeHash = function(e) {
          var t = e.replace(/[^#]*#/, "").replace(/#.*/, "");
          return t
        }, p.setHash = function(e, t) {
          var n, o;
          return t !== !1 && p.busy() ? (p.pushQueue({
            scope: p,
            callback: p.setHash,
            args: arguments,
            queue: t
          }), !1) : (p.busy(!0), n = p.extractState(e, !0), n && !p.emulated.pushState ? p.pushState(n.data, n.title, n.url, !1) : p.getHash() !== e && (p.bugs.setHash ? (o = p.getPageUrl(), p.pushState(null, null, o + "#" + e, !1)) : i.location.hash = e), p)
        }, p.escapeHash = function(t) {
          var n = p.normalizeHash(t);
          return n = e.encodeURIComponent(n), p.bugs.hashEscape || (n = n.replace(/\%21/g, "!").replace(/\%26/g, "&").replace(/\%3D/g, "=").replace(/\%3F/g, "?")), n
        }, p.getHashByUrl = function(e) {
          var t = String(e).replace(/([^#]*)#?([^#]*)#?(.*)/, "$2");
          return t = p.unescapeHash(t)
        }, p.setTitle = function(e) {
          var t, n = e.title;
          n || (t = p.getStateByIndex(0), t && t.url === e.url && (n = t.title || p.options.initialTitle));
          try {
            i.getElementsByTagName("title")[0].innerHTML = n.replace("<", "&lt;").replace(">", "&gt;").replace(" & ", " &amp; ")
          } catch (o) {}
          return i.title = n, p
        }, p.queues = [], p.busy = function(e) {
          if ("undefined" != typeof e ? p.busy.flag = e : "undefined" == typeof p.busy.flag && (p.busy.flag = !1), !p.busy.flag) {
            s(p.busy.timeout);
            var t = function() {
              var e, n, i;
              if (!p.busy.flag)
                for (e = p.queues.length - 1; e >= 0; --e) n = p.queues[e], 0 !== n.length && (i = n.shift(), p.fireQueueItem(i), p.busy.timeout = r(t, p.options.busyDelay))
            };
            p.busy.timeout = r(t, p.options.busyDelay)
          }
          return p.busy.flag
        }, p.busy.flag = !1, p.fireQueueItem = function(e) {
          return e.callback.apply(e.scope || p, e.args || [])
        }, p.pushQueue = function(e) {
          return p.queues[e.queue || 0] = p.queues[e.queue || 0] || [], p.queues[e.queue || 0].push(e), p
        }, p.queue = function(e, t) {
          return "function" == typeof e && (e = {
            callback: e
          }), "undefined" != typeof t && (e.queue = t), p.busy() ? p.pushQueue(e) : p.fireQueueItem(e), p
        }, p.clearQueue = function() {
          return p.busy.flag = !1, p.queues = [], p
        }, p.stateChanged = !1, p.doubleChecker = !1, p.doubleCheckComplete = function() {
          return p.stateChanged = !0, p.doubleCheckClear(), p
        }, p.doubleCheckClear = function() {
          return p.doubleChecker && (s(p.doubleChecker), p.doubleChecker = !1), p
        }, p.doubleCheck = function(e) {
          return p.stateChanged = !1, p.doubleCheckClear(), p.bugs.ieDoubleCheck && (p.doubleChecker = r(function() {
            return p.doubleCheckClear(), p.stateChanged || e(), !0
          }, p.options.doubleCheckInterval)), p
        }, p.safariStatePoll = function() {
          var t, n = p.extractState(p.getLocationHref());
          return p.isLastSavedState(n) ? void 0 : (t = n, t || (t = p.createStateObject()), p.Adapter.trigger(e, "popstate"), p)
        }, p.back = function(e) {
          return e !== !1 && p.busy() ? (p.pushQueue({
            scope: p,
            callback: p.back,
            args: arguments,
            queue: e
          }), !1) : (p.busy(!0), p.doubleCheck(function() {
            p.back(!1)
          }), h.go(-1), !0)
        }, p.forward = function(e) {
          return e !== !1 && p.busy() ? (p.pushQueue({
            scope: p,
            callback: p.forward,
            args: arguments,
            queue: e
          }), !1) : (p.busy(!0), p.doubleCheck(function() {
            p.forward(!1)
          }), h.go(1), !0)
        }, p.go = function(e, t) {
          var n;
          if (e > 0)
            for (n = 1; e >= n; ++n) p.forward(t);
          else {
            if (!(0 > e)) throw new Error("History.go: History.go requires a positive or negative integer passed.");
            for (n = -1; n >= e; --n) p.back(t)
          }
          return p
        }, p.emulated.pushState) {
        var f = function() {};
        p.pushState = p.pushState || f, p.replaceState = p.replaceState || f
      } else p.onPopState = function(t, n) {
        var i, o, a = !1,
          r = !1;
        return p.doubleCheckComplete(), i = p.getHash(), i ? (o = p.extractState(i || p.getLocationHref(), !0), o ? p.replaceState(o.data, o.title, o.url, !1) : (p.Adapter.trigger(e, "anchorchange"), p.busy(!1)), p.expectedStateId = !1, !1) : (a = p.Adapter.extractEventData("state", t, n) || !1, r = a ? p.getStateById(a) : p.expectedStateId ? p.getStateById(p.expectedStateId) : p.extractState(p.getLocationHref()), r || (r = p.createStateObject(null, null, p.getLocationHref())), p.expectedStateId = !1, p.isLastSavedState(r) ? (p.busy(!1), !1) : (p.storeState(r), p.saveState(r), p.setTitle(r), p.Adapter.trigger(e, "statechange"), p.busy(!1), !0))
      }, p.Adapter.bind(e, "popstate", p.onPopState), p.pushState = function(t, n, i, o) {
        if (p.getHashByUrl(i) && p.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
        if (o !== !1 && p.busy()) return p.pushQueue({
          scope: p,
          callback: p.pushState,
          args: arguments,
          queue: o
        }), !1;
        p.busy(!0);
        var a = p.createStateObject(t, n, i);
        return p.isLastSavedState(a) ? p.busy(!1) : (p.storeState(a), p.expectedStateId = a.id, h.pushState(a.id, a.title, a.url), p.Adapter.trigger(e, "popstate")), !0
      }, p.replaceState = function(t, n, i, o) {
        if (p.getHashByUrl(i) && p.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
        if (o !== !1 && p.busy()) return p.pushQueue({
          scope: p,
          callback: p.replaceState,
          args: arguments,
          queue: o
        }), !1;
        p.busy(!0);
        var a = p.createStateObject(t, n, i);
        return p.isLastSavedState(a) ? p.busy(!1) : (p.storeState(a), p.expectedStateId = a.id, h.replaceState(a.id, a.title, a.url), p.Adapter.trigger(e, "popstate")), !0
      };
      if (a) {
        try {
          p.store = u.parse(a.getItem("History.store")) || {}
        } catch (m) {
          p.store = {}
        }
        p.normalizeStore()
      } else p.store = {}, p.normalizeStore();
      p.Adapter.bind(e, "unload", p.clearAllIntervals), p.saveState(p.storeState(p.extractState(p.getLocationHref(), !0))), a && (p.onUnload = function() {
        var e, t, n;
        try {
          e = u.parse(a.getItem("History.store")) || {}
        } catch (i) {
          e = {}
        }
        e.idToState = e.idToState || {}, e.urlToId = e.urlToId || {}, e.stateToId = e.stateToId || {};
        for (t in p.idToState) p.idToState.hasOwnProperty(t) && (e.idToState[t] = p.idToState[t]);
        for (t in p.urlToId) p.urlToId.hasOwnProperty(t) && (e.urlToId[t] = p.urlToId[t]);
        for (t in p.stateToId) p.stateToId.hasOwnProperty(t) && (e.stateToId[t] = p.stateToId[t]);
        p.store = e, p.normalizeStore(), n = u.stringify(e);
        try {
          a.setItem("History.store", n)
        } catch (o) {
          if (o.code !== DOMException.QUOTA_EXCEEDED_ERR) throw o;
          a.length && (a.removeItem("History.store"), a.setItem("History.store", n))
        }
      }, p.intervalList.push(l(p.onUnload, p.options.storeInterval)), p.Adapter.bind(e, "beforeunload", p.onUnload), p.Adapter.bind(e, "unload", p.onUnload)), p.emulated.pushState || (p.bugs.safariPoll && p.intervalList.push(l(p.safariStatePoll, p.options.safariPollInterval)), ("Apple Computer, Inc." === o.vendor || "Mozilla" === (o.appCodeName || "")) && (p.Adapter.bind(e, "hashchange", function() {
        p.Adapter.trigger(e, "popstate")
      }), p.getHash() && p.Adapter.onDomLoad(function() {
        p.Adapter.trigger(e, "hashchange")
      })))
    }, (!p.options || !p.options.delayInit) && p.init()
  }(window),
  function(e) {
    function t(t, n) {
      try {
        if (n[p]) {
          t = t || "";
          var i = e(n.ownerNode || n.owningElement);
          return "" === t || "*" === t || "#" + (i.prop("id") || "") == t || (i.prop("href") || "") == c.prop("href", t).prop("href")
        }
        return !1
      } catch (o) {
        return !1
      }
    }

    function n(t) {
      var n = (/.*?{/.exec(t) || ["{"])[0],
        o = /{.*}/g.exec(t);
      if (null === o) {
        var a = t.split("{");
        o = "{" + a[1 == a.length ? 0 : 1].split("}")[0] + "}"
      } else o = o[0];
      return {
        styleSheet: e.trim(n.substr(0, n.length - 1)),
        selectorText: i(o.substr(1, o.length - 2))
      }
    }

    function i(e) {
      var t, n, i = [];
      t = d[p].length, s.call(d, e, ";"), n = d[p].length;
      for (var o = n - 1; o >= t; o--) i.push(d[p][o].selectorText), l.call(d, o);
      return i.reverse().join(", ")
    }

    function o(t, n, i) {
      return "string" !== e.type(t.selectorText) ? !1 : t.selectorText === n ? !0 : i === !0 ? e(e.map(t.selectorText.split(","), e.trim)).filter(function() {
        return this.toString() === n
      }).length > 0 : !1
    }

    function a(e) {
      for (var t, n = e[0].toUpperCase() + e.slice(1), i = h.length; --i;)
        if (t = h[i] + n, t in u) return t;
      return e
    }

    function r(e, t) {
      return e.ownerDocument = e.ownerDocument || document, e.nodeType = e.nodeType || 1, e.nodeName = e.nodeName || "DIV", e.parentNode = e.parentNode || t.ownerNode || t.owningElement, e.parentStyleSheet = e.parentStyleSheet || t, e
    }

    function s(t, n, i) {
      if (!t || !n) return -1;
      var o = this,
        a = o.insertRule ? function(e, t, n) {
          this.insertRule(e + "{" + t + "}", n)
        } : o.addRule;
      i = i || this[p].length;
      try {
        return a.call(o, t, n, i)
      } catch (r) {
        return e.each(t.split(","), function(t, i) {
          a.call(o, e.trim(i), n)
        }), -1
      }
    }

    function l(t) {
      if (t = t && t.rule ? t.rule : t) {
        var n = this,
          i = n.deleteRule || n.removeRule;
        i || e(document.styleSheets).each(function(o, a) {
          return 1 == e(a[p]).filter(function() {
            return this === t
          }).length ? (n = a, i = n.deleteRule || n.removeRule, !1) : void 0
        }), "number" == e.type(t) ? i.call(n, t) : e.each(n[p], function(e, o) {
          return t === o ? (i.call(n, e), !1) : void 0
        })
      }
    }
    var c = e(document.createElement("a")),
      u = c.prop("style"),
      d = function(e) {
        return e.sheet || e.styleSheet
      }(e('<style type="text/css">*{}</style>').appendTo("head")[0]),
      p = "cssRules" in d ? "cssRules" : "rules",
      h = ["Webkit", "O", "Moz", "ms"];
    try {
      r(d[p][0], d), e.support.nativeCSSStyleRule = !0
    } catch (f) {
      e.support.nativeCSSStyleRule = !1, CSSStyleRule = function(t) {
        e.extend(this, t), this.rule = t, this.currentStyle = t.style
      }
    }
    e.stylesheet = function(t, n, i) {
      return this instanceof e.stylesheet ? (this.init(t), this.css(n, i)) : new e.stylesheet(t, n, i)
    }, e.extend(e.stylesheet, {
      cssRules: function(i) {
        var a = [],
          s = n(i);
        return e(document.styleSheets).each(function(n, i) {
          t(s.styleSheet, i) && e.merge(a, e(i[p]).filter(function() {
            return o(this, s.selectorText, "*" === s.styleSheet)
          }).map(function() {
            return r(e.support.nativeCSSStyleRule ? this : new CSSStyleRule(this), i)
          }))
        }), a.reverse()
      },
      camelCase: e.camelCase || function(e) {
        return e.replace(/-([\da-z])/g, function(e) {
          return e.toUpperCase().replace("-", "")
        })
      },
      cssProps: e.cssProps || {},
      cssStyleName: function(t) {
        if (t) {
          var n = e.camelCase(t);
          if (n in u) return n;
          if ((e.cssProps[t] || (e.cssProps[t] = a(n))) in u) return e.cssProps[t]
        }
      }
    }), e.stylesheet.fn = e.stylesheet.prototype = {
      init: function(i) {
        var o = [];
        switch (e.type(i)) {
          case "string":
            o = e.stylesheet.cssRules(i);
            break;
          case "array":
            e.each(i, function(t, n) {
              "string" === e.type(n) ? e.merge(o, e.stylesheet.cssRules(n)) : n instanceof CSSStyleRule && o.push(n)
            });
            break;
          case "object":
            i instanceof CSSStyleRule && o.push(val)
        }
        e.extend(this, {
          rules: function() {
            return o.slice()
          },
          css: function(a, r) {
            var c = this,
              u = void 0;
            switch (e.type(a)) {
              case "null":
                return e.each(o, function(e, t) {
                  l.call(t.parentStyleSheet, t)
                }), o = e.stylesheet.cssRules(i), c;
              case "string":
                var p = e.stylesheet.cssStyleName(a);
                if (p)
                  if (0 === o.length && void 0 !== r) {
                    var h = n(i),
                      f = e(document.styleSheets).filter(function() {
                        return t(h.styleSheet, this)
                      });
                    f = f && 1 == f.length ? f[0] : d, s.call(f, h.selectorText, a + ":" + r + ";"), o = e.stylesheet.cssRules(i), u = c
                  } else e.each(o, function(e, t) {
                    return "" !== t.style[p] ? (void 0 !== r ? (t.style[p] = r, u = c) : u = t.style[p], !1) : void 0
                  }), void 0 === u && void 0 !== r && (o[0].style[p] = r, u = c);
                break;
              case "array":
                u = {}, e.each(a, function(e, t) {
                  u[t] = c.css(t, r)
                }), void 0 !== r && (u = c);
                break;
              case "object":
                return e.each(a, function(e, t) {
                  c.css(e, t)
                }), c;
              default:
                return c
            }
            return u
          }
        })
      }
    }
  }(jQuery), window.Modernizr = function(e, t, n) {
    function i(e) {
      w.cssText = e
    }

    function o(e, t) {
      return i($.join(e + ";") + (t || ""))
    }

    function a(e, t) {
      return typeof e === t
    }

    function r(e, t) {
      return !!~("" + e).indexOf(t)
    }

    function s(e, t) {
      for (var i in e) {
        var o = e[i];
        if (!r(o, "-") && w[o] !== n) return "pfx" == t ? o : !0
      }
      return !1
    }

    function l(e, t, i) {
      for (var o in e) {
        var r = t[e[o]];
        if (r !== n) return i === !1 ? e[o] : a(r, "function") ? r.bind(i || t) : r
      }
      return !1
    }

    function c(e, t, n) {
      var i = e.charAt(0).toUpperCase() + e.slice(1),
        o = (e + " " + T.join(i + " ") + i).split(" ");
      return a(t, "string") || a(t, "undefined") ? s(o, t) : (o = (e + " " + k.join(i + " ") + i).split(" "), l(o, t, n))
    }

    function u() {
      f.input = function(n) {
        for (var i = 0, o = n.length; o > i; i++) M[n[i]] = n[i] in b;
        return M.list && (M.list = !!t.createElement("datalist") && !!e.HTMLDataListElement), M
      }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")), f.inputtypes = function(e) {
        for (var i, o, a, r = 0, s = e.length; s > r; r++) b.setAttribute("type", o = e[r]), i = "text" !== b.type, i && (b.value = _, b.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(o) && b.style.WebkitAppearance !== n ? (g.appendChild(b), a = t.defaultView, i = a.getComputedStyle && "textfield" !== a.getComputedStyle(b, null).WebkitAppearance && 0 !== b.offsetHeight, g.removeChild(b)) : /^(search|tel)$/.test(o) || (i = /^(url|email)$/.test(o) ? b.checkValidity && b.checkValidity() === !1 : b.value != _)), P[e[r]] = !!i;
        return P
      }("search tel url email datetime date month week time datetime-local number range color".split(" "))
    }
    var d, p, h = "2.7.1",
      f = {},
      m = !0,
      g = t.documentElement,
      v = "modernizr",
      y = t.createElement(v),
      w = y.style,
      b = t.createElement("input"),
      _ = ":)",
      x = {}.toString,
      $ = " -webkit- -moz- -o- -ms- ".split(" "),
      S = "Webkit Moz O ms",
      T = S.split(" "),
      k = S.toLowerCase().split(" "),
      C = {
        svg: "http://www.w3.org/2000/svg"
      },
      E = {},
      P = {},
      M = {},
      H = [],
      L = H.slice,
      D = function(e, n, i, o) {
        var a, r, s, l, c = t.createElement("div"),
          u = t.body,
          d = u || t.createElement("body");
        if (parseInt(i, 10))
          for (; i--;) s = t.createElement("div"), s.id = o ? o[i] : v + (i + 1), c.appendChild(s);
        return a = ["&#173;", '<style id="s', v, '">', e, "</style>"].join(""), c.id = v, (u ? c : d).innerHTML += a, d.appendChild(c), u || (d.style.background = "", d.style.overflow = "hidden", l = g.style.overflow, g.style.overflow = "hidden", g.appendChild(d)), r = n(c, e), u ? c.parentNode.removeChild(c) : (d.parentNode.removeChild(d), g.style.overflow = l), !!r
      },
      O = function() {
        function e(e, o) {
          o = o || t.createElement(i[e] || "div"), e = "on" + e;
          var r = e in o;
          return r || (o.setAttribute || (o = t.createElement("div")), o.setAttribute && o.removeAttribute && (o.setAttribute(e, ""), r = a(o[e], "function"), a(o[e], "undefined") || (o[e] = n), o.removeAttribute(e))), o = null, r
        }
        var i = {
          select: "input",
          change: "input",
          submit: "form",
          reset: "form",
          error: "img",
          load: "img",
          abort: "img"
        };
        return e
      }(),
      N = {}.hasOwnProperty;
    p = a(N, "undefined") || a(N.call, "undefined") ? function(e, t) {
      return t in e && a(e.constructor.prototype[t], "undefined")
    } : function(e, t) {
      return N.call(e, t)
    }, Function.prototype.bind || (Function.prototype.bind = function(e) {
      var t = this;
      if ("function" != typeof t) throw new TypeError;
      var n = L.call(arguments, 1),
        i = function() {
          if (this instanceof i) {
            var o = function() {};
            o.prototype = t.prototype;
            var a = new o,
              r = t.apply(a, n.concat(L.call(arguments)));
            return Object(r) === r ? r : a
          }
          return t.apply(e, n.concat(L.call(arguments)))
        };
      return i
    }), E.flexbox = function() {
      return c("flexWrap")
    }, E.flexboxlegacy = function() {
      return c("boxDirection")
    }, E.canvas = function() {
      var e = t.createElement("canvas");
      return !!e.getContext && !!e.getContext("2d")
    }, E.canvastext = function() {
      return !!f.canvas && !!a(t.createElement("canvas").getContext("2d").fillText, "function")
    }, E.webgl = function() {
      return !!e.WebGLRenderingContext
    }, E.touch = function() {
      var n;
      return "ontouchstart" in e || e.DocumentTouch && t instanceof DocumentTouch ? n = !0 : D(["@media (", $.join("touch-enabled),("), v, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function(e) {
        n = 9 === e.offsetTop
      }), n
    }, E.geolocation = function() {
      return "geolocation" in navigator
    }, E.postmessage = function() {
      return !!e.postMessage
    }, E.websqldatabase = function() {
      return !!e.openDatabase
    }, E.indexedDB = function() {
      return !!c("indexedDB", e)
    }, E.hashchange = function() {
      return O("hashchange", e) && (t.documentMode === n || t.documentMode > 7)
    }, E.history = function() {
      return !!e.history && !!history.pushState
    }, E.draganddrop = function() {
      var e = t.createElement("div");
      return "draggable" in e || "ondragstart" in e && "ondrop" in e
    }, E.websockets = function() {
      return "WebSocket" in e || "MozWebSocket" in e
    }, E.rgba = function() {
      return i("background-color:rgba(150,255,150,.5)"), r(w.backgroundColor, "rgba")
    }, E.hsla = function() {
      return i("background-color:hsla(120,40%,100%,.5)"), r(w.backgroundColor, "rgba") || r(w.backgroundColor, "hsla")
    }, E.multiplebgs = function() {
      return i("background:url(https://),url(https://),red url(https://)"), /(url\s*\(.*?){3}/.test(w.background)
    }, E.backgroundsize = function() {
      return c("backgroundSize")
    }, E.borderimage = function() {
      return c("borderImage")
    }, E.borderradius = function() {
      return c("borderRadius")
    }, E.boxshadow = function() {
      return c("boxShadow")
    }, E.textshadow = function() {
      return "" === t.createElement("div").style.textShadow
    }, E.opacity = function() {
      return o("opacity:.55"), /^0.55$/.test(w.opacity)
    }, E.cssanimations = function() {
      return c("animationName")
    }, E.csscolumns = function() {
      return c("columnCount")
    }, E.cssgradients = function() {
      var e = "background-image:",
        t = "gradient(linear,left top,right bottom,from(#9f9),to(white));",
        n = "linear-gradient(left top,#9f9, white);";
      return i((e + "-webkit- ".split(" ").join(t + e) + $.join(n + e)).slice(0, -e.length)), r(w.backgroundImage, "gradient")
    }, E.cssreflections = function() {
      return c("boxReflect")
    }, E.csstransforms = function() {
      return !!c("transform")
    }, E.csstransforms3d = function() {
      var e = !!c("perspective");
      return e && "webkitPerspective" in g.style && D("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function(t) {
        e = 9 === t.offsetLeft && 3 === t.offsetHeight
      }), e
    }, E.csstransitions = function() {
      return c("transition")
    }, E.fontface = function() {
      var e;
      return D('@font-face {font-family:"font";src:url("https://")}', function(n, i) {
        var o = t.getElementById("smodernizr"),
          a = o.sheet || o.styleSheet,
          r = a ? a.cssRules && a.cssRules[0] ? a.cssRules[0].cssText : a.cssText || "" : "";
        e = /src/i.test(r) && 0 === r.indexOf(i.split(" ")[0])
      }), e
    }, E.generatedcontent = function() {
      var e;
      return D(["#", v, "{font:0/0 a}#", v, ':after{content:"', _, '";visibility:hidden;font:3px/1 a}'].join(""), function(t) {
        e = t.offsetHeight >= 3
      }), e
    }, E.video = function() {
      var e = t.createElement("video"),
        n = !1;
      try {
        (n = !!e.canPlayType) && (n = new Boolean(n), n.ogg = e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""), n.h264 = e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""), n.webm = e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, ""))
      } catch (i) {}
      return n
    }, E.audio = function() {
      var e = t.createElement("audio"),
        n = !1;
      try {
        (n = !!e.canPlayType) && (n = new Boolean(n), n.ogg = e.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), n.mp3 = e.canPlayType("audio/mpeg;").replace(/^no$/, ""), n.wav = e.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), n.m4a = (e.canPlayType("audio/x-m4a;") || e.canPlayType("audio/aac;")).replace(/^no$/, ""))
      } catch (i) {}
      return n
    }, E.localstorage = function() {
      try {
        return localStorage.setItem(v, v), localStorage.removeItem(v), !0
      } catch (e) {
        return !1
      }
    }, E.sessionstorage = function() {
      try {
        return sessionStorage.setItem(v, v), sessionStorage.removeItem(v), !0
      } catch (e) {
        return !1
      }
    }, E.webworkers = function() {
      return !!e.Worker
    }, E.applicationcache = function() {
      return !!e.applicationCache
    }, E.svg = function() {
      return !!t.createElementNS && !!t.createElementNS(C.svg, "svg").createSVGRect
    }, E.inlinesvg = function() {
      var e = t.createElement("div");
      return e.innerHTML = "<svg/>", (e.firstChild && e.firstChild.namespaceURI) == C.svg
    }, E.smil = function() {
      return !!t.createElementNS && /SVGAnimate/.test(x.call(t.createElementNS(C.svg, "animate")))
    }, E.svgclippaths = function() {
      return !!t.createElementNS && /SVGClipPath/.test(x.call(t.createElementNS(C.svg, "clipPath")))
    };
    for (var I in E) p(E, I) && (d = I.toLowerCase(), f[d] = E[I](), H.push((f[d] ? "" : "no-") + d));
    return f.input || u(), f.addTest = function(e, t) {
        if ("object" == typeof e)
          for (var i in e) p(e, i) && f.addTest(i, e[i]);
        else {
          if (e = e.toLowerCase(), f[e] !== n) return f;
          t = "function" == typeof t ? t() : t, "undefined" != typeof m && m && (g.className += " " + (t ? "" : "no-") + e), f[e] = t
        }
        return f
      }, i(""), y = b = null,
      function(e, t) {
        function n(e, t) {
          var n = e.createElement("p"),
            i = e.getElementsByTagName("head")[0] || e.documentElement;
          return n.innerHTML = "x<style>" + t + "</style>", i.insertBefore(n.lastChild, i.firstChild)
        }

        function i() {
          var e = y.elements;
          return "string" == typeof e ? e.split(" ") : e
        }

        function o(e) {
          var t = v[e[m]];
          return t || (t = {}, g++, e[m] = g, v[g] = t), t
        }

        function a(e, n, i) {
          if (n || (n = t), u) return n.createElement(e);
          i || (i = o(n));
          var a;
          return a = i.cache[e] ? i.cache[e].cloneNode() : f.test(e) ? (i.cache[e] = i.createElem(e)).cloneNode() : i.createElem(e), !a.canHaveChildren || h.test(e) || a.tagUrn ? a : i.frag.appendChild(a)
        }

        function r(e, n) {
          if (e || (e = t), u) return e.createDocumentFragment();
          n = n || o(e);
          for (var a = n.frag.cloneNode(), r = 0, s = i(), l = s.length; l > r; r++) a.createElement(s[r]);
          return a
        }

        function s(e, t) {
          t.cache || (t.cache = {}, t.createElem = e.createElement, t.createFrag = e.createDocumentFragment, t.frag = t.createFrag()), e.createElement = function(n) {
            return y.shivMethods ? a(n, e, t) : t.createElem(n)
          }, e.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + i().join().replace(/[\w\-]+/g, function(e) {
            return t.createElem(e), t.frag.createElement(e), 'c("' + e + '")'
          }) + ");return n}")(y, t.frag)
        }

        function l(e) {
          e || (e = t);
          var i = o(e);
          return y.shivCSS && !c && !i.hasCSS && (i.hasCSS = !!n(e, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), u || s(e, i), e
        }
        var c, u, d = "3.7.0",
          p = e.html5 || {},
          h = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
          f = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
          m = "_html5shiv",
          g = 0,
          v = {};
        ! function() {
          try {
            var e = t.createElement("a");
            e.innerHTML = "<xyz></xyz>", c = "hidden" in e, u = 1 == e.childNodes.length || function() {
              t.createElement("a");
              var e = t.createDocumentFragment();
              return "undefined" == typeof e.cloneNode || "undefined" == typeof e.createDocumentFragment || "undefined" == typeof e.createElement
            }()
          } catch (n) {
            c = !0, u = !0
          }
        }();
        var y = {
          elements: p.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
          version: d,
          shivCSS: p.shivCSS !== !1,
          supportsUnknownElements: u,
          shivMethods: p.shivMethods !== !1,
          type: "default",
          shivDocument: l,
          createElement: a,
          createDocumentFragment: r
        };
        e.html5 = y, l(t)
      }(this, t), f._version = h, f._prefixes = $, f._domPrefixes = k, f._cssomPrefixes = T, f.hasEvent = O, f.testProp = function(e) {
        return s([e])
      }, f.testAllProps = c, f.testStyles = D, f.prefixed = function(e, t, n) {
        return t ? c(e, t, n) : c(e, "pfx")
      }, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (m ? " js " + H.join(" ") : ""), f
  }(this, this.document),
  function(e, t, n) {
    function i(e) {
      return "[object Function]" == g.call(e)
    }

    function o(e) {
      return "string" == typeof e
    }

    function a() {}

    function r(e) {
      return !e || "loaded" == e || "complete" == e || "uninitialized" == e
    }

    function s() {
      var e = v.shift();
      y = 1, e ? e.t ? f(function() {
        ("c" == e.t ? p.injectCss : p.injectJs)(e.s, 0, e.a, e.x, e.e, 1)
      }, 0) : (e(), s()) : y = 0
    }

    function l(e, n, i, o, a, l, c) {
      function u(t) {
        if (!h && r(d.readyState) && (w.r = h = 1, !y && s(), d.onload = d.onreadystatechange = null, t)) {
          "img" != e && f(function() {
            _.removeChild(d)
          }, 50);
          for (var i in k[n]) k[n].hasOwnProperty(i) && k[n][i].onload()
        }
      }
      var c = c || p.errorTimeout,
        d = t.createElement(e),
        h = 0,
        g = 0,
        w = {
          t: i,
          s: n,
          e: a,
          a: l,
          x: c
        };
      1 === k[n] && (g = 1, k[n] = []), "object" == e ? d.data = n : (d.src = n, d.type = e), d.width = d.height = "0", d.onerror = d.onload = d.onreadystatechange = function() {
        u.call(this, g)
      }, v.splice(o, 0, w), "img" != e && (g || 2 === k[n] ? (_.insertBefore(d, b ? null : m), f(u, c)) : k[n].push(d))
    }

    function c(e, t, n, i, a) {
      return y = 0, t = t || "j", o(e) ? l("c" == t ? $ : x, e, t, this.i++, n, i, a) : (v.splice(this.i++, 0, e), 1 == v.length && s()), this
    }

    function u() {
      var e = p;
      return e.loader = {
        load: c,
        i: 0
      }, e
    }
    var d, p, h = t.documentElement,
      f = e.setTimeout,
      m = t.getElementsByTagName("script")[0],
      g = {}.toString,
      v = [],
      y = 0,
      w = "MozAppearance" in h.style,
      b = w && !!t.createRange().compareNode,
      _ = b ? h : m.parentNode,
      h = e.opera && "[object Opera]" == g.call(e.opera),
      h = !!t.attachEvent && !h,
      x = w ? "object" : h ? "script" : "img",
      $ = h ? "script" : x,
      S = Array.isArray || function(e) {
        return "[object Array]" == g.call(e)
      },
      T = [],
      k = {},
      C = {
        timeout: function(e, t) {
          return t.length && (e.timeout = t[0]), e
        }
      };
    p = function(e) {
      function t(e) {
        var t, n, i, e = e.split("!"),
          o = T.length,
          a = e.pop(),
          r = e.length,
          a = {
            url: a,
            origUrl: a,
            prefixes: e
          };
        for (n = 0; r > n; n++) i = e[n].split("="), (t = C[i.shift()]) && (a = t(a, i));
        for (n = 0; o > n; n++) a = T[n](a);
        return a
      }

      function r(e, o, a, r, s) {
        var l = t(e),
          c = l.autoCallback;
        l.url.split(".").pop().split("?").shift(), l.bypass || (o && (o = i(o) ? o : o[e] || o[r] || o[e.split("/").pop().split("?")[0]]), l.instead ? l.instead(e, o, a, r, s) : (k[l.url] ? l.noexec = !0 : k[l.url] = 1, a.load(l.url, l.forceCSS || !l.forceJS && "css" == l.url.split(".").pop().split("?").shift() ? "c" : n, l.noexec, l.attrs, l.timeout), (i(o) || i(c)) && a.load(function() {
          u(), o && o(l.origUrl, s, r), c && c(l.origUrl, s, r), k[l.url] = 2
        })))
      }

      function s(e, t) {
        function n(e, n) {
          if (e) {
            if (o(e)) n || (d = function() {
              var e = [].slice.call(arguments);
              p.apply(this, e), h()
            }), r(e, d, t, 0, c);
            else if (Object(e) === e)
              for (l in s = function() {
                  var t, n = 0;
                  for (t in e) e.hasOwnProperty(t) && n++;
                  return n
                }(), e) e.hasOwnProperty(l) && (!n && !--s && (i(d) ? d = function() {
                var e = [].slice.call(arguments);
                p.apply(this, e), h()
              } : d[l] = function(e) {
                return function() {
                  var t = [].slice.call(arguments);
                  e && e.apply(this, t), h()
                }
              }(p[l])), r(e[l], d, t, l, c))
          } else !n && h()
        }
        var s, l, c = !!e.test,
          u = e.load || e.both,
          d = e.callback || a,
          p = d,
          h = e.complete || a;
        n(c ? e.yep : e.nope, !!u), u && n(u)
      }
      var l, c, d = this.yepnope.loader;
      if (o(e)) r(e, 0, d, 0);
      else if (S(e))
        for (l = 0; l < e.length; l++) c = e[l], o(c) ? r(c, 0, d, 0) : S(c) ? p(c) : Object(c) === c && s(c, d);
      else Object(e) === e && s(e, d)
    }, p.addPrefix = function(e, t) {
      C[e] = t
    }, p.addFilter = function(e) {
      T.push(e)
    }, p.errorTimeout = 1e4, null == t.readyState && t.addEventListener && (t.readyState = "loading", t.addEventListener("DOMContentLoaded", d = function() {
      t.removeEventListener("DOMContentLoaded", d, 0), t.readyState = "complete"
    }, 0)), e.yepnope = u(), e.yepnope.executeStack = s, e.yepnope.injectJs = function(e, n, i, o, l, c) {
      var u, d, h = t.createElement("script"),
        o = o || p.errorTimeout;
      h.src = e;
      for (d in i) h.setAttribute(d, i[d]);
      n = c ? s : n || a, h.onreadystatechange = h.onload = function() {
        !u && r(h.readyState) && (u = 1, n(), h.onload = h.onreadystatechange = null)
      }, f(function() {
        u || (u = 1, n(1))
      }, o), l ? h.onload() : m.parentNode.insertBefore(h, m)
    }, e.yepnope.injectCss = function(e, n, i, o, r, l) {
      var c, o = t.createElement("link"),
        n = l ? s : n || a;
      o.href = e, o.rel = "stylesheet", o.type = "text/css";
      for (c in i) o.setAttribute(c, i[c]);
      r || (m.parentNode.insertBefore(o, m), f(n, 0))
    }
  }(this, document), Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0))
  }, Modernizr.addTest("cookies", function() {
    if (navigator.cookieEnabled) return !0;
    document.cookie = "cookietest=1";
    var e = -1 != document.cookie.indexOf("cookietest=");
    return document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT", e
  }), Modernizr.addTest("csscalc", function() {
    var e = "width:",
      t = "calc(10px);",
      n = document.createElement("div");
    return n.style.cssText = e + Modernizr._prefixes.join(t + e), !!n.style.length
  }), Modernizr.addTest("cssresize", Modernizr.testAllProps("resize")), Modernizr.addTest("regions", function() {
    var e = Modernizr.prefixed("flowFrom"),
      t = Modernizr.prefixed("flowInto");
    if (!e || !t) return !1;
    var n = document.createElement("div"),
      i = document.createElement("div"),
      o = document.createElement("div"),
      a = "modernizr_flow_for_regions_check";
    i.innerText = "M", n.style.cssText = "top: 150px; left: 150px; padding: 0px;", o.style.cssText = "width: 50px; height: 50px; padding: 42px;", o.style[e] = a, n.appendChild(i), n.appendChild(o), document.documentElement.appendChild(n);
    var r, s, l = i.getBoundingClientRect();
    return i.style[t] = a, r = i.getBoundingClientRect(), s = r.left - l.left, document.documentElement.removeChild(n), i = o = n = void 0, 42 == s
  }), Modernizr.addTest("cssscrollbar", function() {
    var e, t = "#modernizr{overflow: scroll; width: 40px }#" + Modernizr._prefixes.join("scrollbar{width:0px} #modernizr::").split("#").slice(1).join("#") + "scrollbar{width:0px}";
    return Modernizr.testStyles(t, function(t) {
      e = "scrollWidth" in t && 40 == t.scrollWidth
    }), e
  }),
  function() {
    function e() {
      try {
        var e = document.createElement("div"),
          t = document.createElement("span"),
          n = e.style,
          i = 0,
          o = 0,
          a = !1,
          r = document.body.firstElementChild || document.body.firstChild;
        return e.appendChild(t), t.innerHTML = "Bacon ipsum dolor sit amet jerky velit in culpa hamburger et. Laborum dolor proident, enim dolore duis commodo et strip steak. Salami anim et, veniam consectetur dolore qui tenderloin jowl velit sirloin. Et ad culpa, fatback cillum jowl ball tip ham hock nulla short ribs pariatur aute. Pig pancetta ham bresaola, ut boudin nostrud commodo flank esse cow tongue culpa. Pork belly bresaola enim pig, ea consectetur nisi. Fugiat officia turkey, ea cow jowl pariatur ullamco proident do laborum velit sausage. Magna biltong sint tri-tip commodo sed bacon, esse proident aliquip. Ullamco ham sint fugiat, velit in enim sed mollit nulla cow ut adipisicing nostrud consectetur. Proident dolore beef ribs, laborum nostrud meatball ea laboris rump cupidatat labore culpa. Shankle minim beef, velit sint cupidatat fugiat tenderloin pig et ball tip. Ut cow fatback salami, bacon ball tip et in shank strip steak bresaola. In ut pork belly sed mollit tri-tip magna culpa veniam, short ribs qui in andouille ham consequat. Dolore bacon t-bone, velit short ribs enim strip steak nulla. Voluptate labore ut, biltong swine irure jerky. Cupidatat excepteur aliquip salami dolore. Ball tip strip steak in pork dolor. Ad in esse biltong. Dolore tenderloin exercitation ad pork loin t-bone, dolore in chicken ball tip qui pig. Ut culpa tongue, sint ribeye dolore ex shank voluptate hamburger. Jowl et tempor, boudin pork chop labore ham hock drumstick consectetur tri-tip elit swine meatball chicken ground round. Proident shankle mollit dolore. Shoulder ut duis t-bone quis reprehenderit. Meatloaf dolore minim strip steak, laboris ea aute bacon beef ribs elit shank in veniam drumstick qui. Ex laboris meatball cow tongue pork belly. Ea ball tip reprehenderit pig, sed fatback boudin dolore flank aliquip laboris eu quis. Beef ribs duis beef, cow corned beef adipisicing commodo nisi deserunt exercitation. Cillum dolor t-bone spare ribs, ham hock est sirloin. Brisket irure meatloaf in, boudin pork belly sirloin ball tip. Sirloin sint irure nisi nostrud aliqua. Nostrud nulla aute, enim officia culpa ham hock. Aliqua reprehenderit dolore sunt nostrud sausage, ea boudin pork loin ut t-bone ham tempor. Tri-tip et pancetta drumstick laborum. Ham hock magna do nostrud in proident. Ex ground round fatback, venison non ribeye in.", document.body.insertBefore(e, r), n.cssText = "position:absolute;top:0;left:0;width:5em;text-align:justify;text-justification:newspaper;", i = t.offsetHeight, o = t.offsetWidth, n.cssText = "position:absolute;top:0;left:0;width:5em;text-align:justify;text-justification:newspaper;" + Modernizr._prefixes.join("hyphens:auto; "), a = t.offsetHeight != i || t.offsetWidth != o, document.body.removeChild(e), e.removeChild(t), a
      } catch (s) {
        return !1
      }
    }

    function t(e, t) {
      try {
        var n = document.createElement("div"),
          i = document.createElement("span"),
          o = n.style,
          a = 0,
          r = !1,
          s = !1,
          l = !1,
          c = document.body.firstElementChild || document.body.firstChild;
        return o.cssText = "position:absolute;top:0;left:0;overflow:visible;width:1.25em;", n.appendChild(i), document.body.insertBefore(n, c), i.innerHTML = "mm", a = i.offsetHeight, i.innerHTML = "m" + e + "m", s = i.offsetHeight > a, t ? (i.innerHTML = "m<br />m", a = i.offsetWidth, i.innerHTML = "m" + e + "m", l = i.offsetWidth > a) : l = !0, s === !0 && l === !0 && (r = !0), document.body.removeChild(n), n.removeChild(i), r
      } catch (u) {
        return !1
      }
    }

    function n(e) {
      try {
        var t, n = document.createElement("input"),
          i = document.createElement("div"),
          o = "lebowski",
          a = !1,
          r = document.body.firstElementChild || document.body.firstChild;
        if (i.innerHTML = o + e + o, document.body.insertBefore(i, r), document.body.insertBefore(n, i), n.setSelectionRange ? (n.focus(), n.setSelectionRange(0, 0)) : n.createTextRange && (t = n.createTextRange(), t.collapse(!0), t.moveEnd("character", 0), t.moveStart("character", 0), t.select()), window.find) a = window.find(o + o);
        else try {
          t = window.self.document.body.createTextRange(), a = t.findText(o + o)
        } catch (s) {
          a = !1
        }
        return document.body.removeChild(i), document.body.removeChild(n), a
      } catch (s) {
        return !1
      }
    }
    return document.body ? (Modernizr.addTest("csshyphens", function() {
      if (!Modernizr.testAllProps("hyphens")) return !1;
      try {
        return e()
      } catch (t) {
        return !1
      }
    }), Modernizr.addTest("softhyphens", function() {
      try {
        return t("&#173;", !0) && t("&#8203;", !1)
      } catch (e) {
        return !1
      }
    }), Modernizr.addTest("softhyphensfind", function() {
      try {
        return n("&#173;") && n("&#8203;")
      } catch (e) {
        return !1
      }
    }), void 0) : (window.console && console.warn("document.body doesn't exist. Modernizr hyphens test needs it."), void 0)
  }(),
  function(e) {
    "function" == typeof define && define.amd ? define(e) : window.purl = e()
  }(function() {
    function e(e, t) {
      for (var n = decodeURI(e), i = m[t ? "strict" : "loose"].exec(n), o = {
          attr: {},
          param: {},
          seg: {}
        }, r = 14; r--;) o.attr[h[r]] = i[r] || "";
      return o.param.query = a(o.attr.query), o.param.fragment = a(o.attr.fragment), o.seg.path = o.attr.path.replace(/^\/+|\/+$/g, "").split("/"), o.seg.fragment = o.attr.fragment.replace(/^\/+|\/+$/g, "").split("/"), o.attr.base = o.attr.host ? (o.attr.protocol ? o.attr.protocol + "://" + o.attr.host : o.attr.host) + (o.attr.port ? ":" + o.attr.port : "") : "", o
    }

    function t(e) {
      var t = e.tagName;
      return "undefined" != typeof t ? p[t.toLowerCase()] : t
    }

    function n(e, t) {
      if (0 === e[t].length) return e[t] = {};
      var n = {};
      for (var i in e[t]) n[i] = e[t][i];
      return e[t] = n, n
    }

    function i(e, t, o, a) {
      var r = e.shift();
      if (r) {
        var s = t[o] = t[o] || [];
        "]" == r ? c(s) ? "" !== a && s.push(a) : "object" == typeof s ? s[u(s).length] = a : s = t[o] = [t[o], a] : ~r.indexOf("]") ? (r = r.substr(0, r.length - 1), !g.test(r) && c(s) && (s = n(t, o)), i(e, s, r, a)) : (!g.test(r) && c(s) && (s = n(t, o)), i(e, s, r, a))
      } else c(t[o]) ? t[o].push(a) : t[o] = "object" == typeof t[o] ? a : "undefined" == typeof t[o] ? a : [t[o], a]
    }

    function o(e, t, n) {
      if (~t.indexOf("]")) {
        var o = t.split("[");
        i(o, e, "base", n)
      } else {
        if (!g.test(t) && c(e.base)) {
          var a = {};
          for (var s in e.base) a[s] = e.base[s];
          e.base = a
        }
        "" !== t && r(e.base, t, n)
      }
      return e
    }

    function a(e) {
      return l(String(e).split(/&|;/), function(e, t) {
        try {
          t = decodeURIComponent(t.replace(/\+/g, " "))
        } catch (n) {}
        var i = t.indexOf("="),
          a = s(t),
          r = t.substr(0, a || i),
          l = t.substr(a || i, t.length);
        return l = l.substr(l.indexOf("=") + 1, l.length), "" === r && (r = t, l = ""), o(e, r, l)
      }, {
        base: {}
      }).base
    }

    function r(e, t, n) {
      var i = e[t];
      "undefined" == typeof i ? e[t] = n : c(i) ? i.push(n) : e[t] = [i, n]
    }

    function s(e) {
      for (var t, n, i = e.length, o = 0; i > o; ++o)
        if (n = e[o], "]" == n && (t = !1), "[" == n && (t = !0), "=" == n && !t) return o
    }

    function l(e, t) {
      for (var n = 0, i = e.length >> 0, o = arguments[2]; i > n;) n in e && (o = t.call(void 0, o, e[n], n, e)), ++n;
      return o
    }

    function c(e) {
      return "[object Array]" === Object.prototype.toString.call(e)
    }

    function u(e) {
      var t = [];
      for (var n in e) e.hasOwnProperty(n) && t.push(n);
      return t
    }

    function d(t, n) {
      return 1 === arguments.length && t === !0 && (n = !0, t = void 0), n = n || !1, t = t || window.location.toString(), {
        data: e(t, n),
        attr: function(e) {
          return e = f[e] || e, "undefined" != typeof e ? this.data.attr[e] : this.data.attr
        },
        param: function(e) {
          return "undefined" != typeof e ? this.data.param.query[e] : this.data.param.query
        },
        fparam: function(e) {
          return "undefined" != typeof e ? this.data.param.fragment[e] : this.data.param.fragment
        },
        segment: function(e) {
          return "undefined" == typeof e ? this.data.seg.path : (e = 0 > e ? this.data.seg.path.length + e : e - 1, this.data.seg.path[e])
        },
        fsegment: function(e) {
          return "undefined" == typeof e ? this.data.seg.fragment : (e = 0 > e ? this.data.seg.fragment.length + e : e - 1, this.data.seg.fragment[e])
        }
      }
    }
    var p = {
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
      h = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "fragment"],
      f = {
        anchor: "fragment"
      },
      m = {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      },
      g = /^[0-9]+$/;
    return d.jQuery = function(e) {
      null != e && (e.fn.url = function(n) {
        var i = "";
        return this.length && (i = e(this).attr(t(this[0])) || ""), d(i, n)
      }, e.url = d)
    }, d.jQuery(window.jQuery), d
  }), ! function(e) {
    "use strict";
    e.matchMedia = e.matchMedia || function(e) {
      var t, n = e.documentElement,
        i = n.firstElementChild || n.firstChild,
        o = e.createElement("body"),
        a = e.createElement("div");
      return a.id = "mq-test-1", a.style.cssText = "position:absolute;top:-100em", o.style.background = "none", o.appendChild(a),
        function(e) {
          return a.innerHTML = '&shy;<style media="' + e + '"> #mq-test-1 { width: 42px; }</style>', n.insertBefore(o, i), t = 42 === a.offsetWidth, n.removeChild(o), {
            matches: t,
            media: e
          }
        }
    }(e.document)
  }(this),
  function(e) {
    "use strict";

    function t() {
      _(!0)
    }
    var n = {};
    e.respond = n, n.update = function() {};
    var i = [],
      o = function() {
        var t = !1;
        try {
          t = new e.XMLHttpRequest
        } catch (n) {
          t = new e.ActiveXObject("Microsoft.XMLHTTP")
        }
        return function() {
          return t
        }
      }(),
      a = function(e, t) {
        var n = o();
        n && (n.open("GET", e, !0), n.onreadystatechange = function() {
          4 !== n.readyState || 200 !== n.status && 304 !== n.status || t(n.responseText)
        }, 4 !== n.readyState && n.send(null))
      },
      r = function(e) {
        return e.replace(n.regex.minmaxwh, "").match(n.regex.other)
      };
    if (n.ajax = a, n.queue = i, n.unsupportedmq = r, n.regex = {
        media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
        keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
        comments: /\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,
        urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
        findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
        only: /(only\s+)?([a-zA-Z]+)\s?/,
        minw: /\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
        maxw: /\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
        minmaxwh: /\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,
        other: /\([^\)]*\)/g
      }, n.mediaQueriesSupported = e.matchMedia && null !== e.matchMedia("only all") && e.matchMedia("only all").matches, !n.mediaQueriesSupported) {
      var s, l, c, u = e.document,
        d = u.documentElement,
        p = [],
        h = [],
        f = [],
        m = {},
        g = 30,
        v = u.getElementsByTagName("head")[0] || d,
        y = u.getElementsByTagName("base")[0],
        w = v.getElementsByTagName("link"),
        b = function() {
          var e, t = u.createElement("div"),
            n = u.body,
            i = d.style.fontSize,
            o = n && n.style.fontSize,
            a = !1;
          return t.style.cssText = "position:absolute;font-size:1em;width:1em", n || (n = a = u.createElement("body"), n.style.background = "none"), d.style.fontSize = "100%", n.style.fontSize = "100%", n.appendChild(t), a && d.insertBefore(n, d.firstChild), e = t.offsetWidth, a ? d.removeChild(n) : n.removeChild(t), d.style.fontSize = i, o && (n.style.fontSize = o), e = c = parseFloat(e)
        },
        _ = function(t) {
          var n = "clientWidth",
            i = d[n],
            o = "CSS1Compat" === u.compatMode && i || u.body[n] || i,
            a = {},
            r = w[w.length - 1],
            m = (new Date).getTime();
          if (t && s && g > m - s) return e.clearTimeout(l), l = e.setTimeout(_, g), void 0;
          s = m;
          for (var y in p)
            if (p.hasOwnProperty(y)) {
              var x = p[y],
                $ = x.minw,
                S = x.maxw,
                T = null === $,
                k = null === S,
                C = "em";
              $ && ($ = parseFloat($) * ($.indexOf(C) > -1 ? c || b() : 1)), S && (S = parseFloat(S) * (S.indexOf(C) > -1 ? c || b() : 1)), x.hasquery && (T && k || !(T || o >= $) || !(k || S >= o)) || (a[x.media] || (a[x.media] = []), a[x.media].push(h[x.rules]))
            }
          for (var E in f) f.hasOwnProperty(E) && f[E] && f[E].parentNode === v && v.removeChild(f[E]);
          f.length = 0;
          for (var P in a)
            if (a.hasOwnProperty(P)) {
              var M = u.createElement("style"),
                H = a[P].join("\n");
              M.type = "text/css", M.media = P, v.insertBefore(M, r.nextSibling), M.styleSheet ? M.styleSheet.cssText = H : M.appendChild(u.createTextNode(H)), f.push(M)
            }
        },
        x = function(e, t, i) {
          var o = e.replace(n.regex.comments, "").replace(n.regex.keyframes, "").match(n.regex.media),
            a = o && o.length || 0;
          t = t.substring(0, t.lastIndexOf("/"));
          var s = function(e) {
              return e.replace(n.regex.urls, "$1" + t + "$2$3")
            },
            l = !a && i;
          t.length && (t += "/"), l && (a = 1);
          for (var c = 0; a > c; c++) {
            var u, d, f, m;
            l ? (u = i, h.push(s(e))) : (u = o[c].match(n.regex.findStyles) && RegExp.$1, h.push(RegExp.$2 && s(RegExp.$2))), f = u.split(","), m = f.length;
            for (var g = 0; m > g; g++) d = f[g], r(d) || p.push({
              media: d.split("(")[0].match(n.regex.only) && RegExp.$2 || "all",
              rules: h.length - 1,
              hasquery: d.indexOf("(") > -1,
              minw: d.match(n.regex.minw) && parseFloat(RegExp.$1) + (RegExp.$2 || ""),
              maxw: d.match(n.regex.maxw) && parseFloat(RegExp.$1) + (RegExp.$2 || "")
            })
          }
          _()
        },
        $ = function() {
          if (i.length) {
            var t = i.shift();
            a(t.href, function(n) {
              x(n, t.href, t.media), m[t.href] = !0, e.setTimeout(function() {
                $()
              }, 0)
            })
          }
        },
        S = function() {
          for (var t = 0; t < w.length; t++) {
            var n = w[t],
              o = n.href,
              a = n.media,
              r = n.rel && "stylesheet" === n.rel.toLowerCase();
            o && r && !m[o] && (n.styleSheet && n.styleSheet.rawCssText ? (x(n.styleSheet.rawCssText, o, a), m[o] = !0) : (!/^([a-zA-Z:]*\/\/)/.test(o) && !y || o.replace(RegExp.$1, "").split("/")[0] === e.location.host) && ("//" === o.substring(0, 2) && (o = e.location.protocol + o), i.push({
              href: o,
              media: a
            })))
          }
          $()
        };
      S(), n.update = S, n.getEmValue = b, e.addEventListener ? e.addEventListener("resize", t, !1) : e.attachEvent && e.attachEvent("onresize", t)
    }
  }(this),
  function(e, t) {
    "use strict";

    function n(n, i) {
      function o(e) {
        return gt.preferFlash && ct && !gt.ignoreFlash && gt.flash[e] !== t && gt.flash[e]
      }

      function a(e) {
        return function(t) {
          var n, i = this._s;
          return i && i._a ? n = e.call(this, t) : (i && i.id ? gt._wD(i.id + ": Ignoring " + t.type) : gt._wD(_t + "Ignoring " + t.type), n = null), n
        }
      }
      this.setupOptions = {
        url: n || null,
        flashVersion: 8,
        debugMode: !0,
        debugFlash: !1,
        useConsole: !0,
        consoleOnly: !0,
        waitForWindowLoad: !1,
        bgColor: "#ffffff",
        useHighPerformance: !1,
        flashPollingInterval: null,
        html5PollingInterval: null,
        flashLoadTimeout: 1e3,
        wmode: null,
        allowScriptAccess: "always",
        useFlashBlock: !1,
        useHTML5Audio: !0,
        html5Test: /^(probably|maybe)$/i,
        preferFlash: !1,
        noSWFCache: !1,
        idPrefix: "sound"
      }, this.defaultOptions = {
        autoLoad: !1,
        autoPlay: !1,
        from: null,
        loops: 1,
        onid3: null,
        onload: null,
        whileloading: null,
        onplay: null,
        onpause: null,
        onresume: null,
        whileplaying: null,
        onposition: null,
        onstop: null,
        onfailure: null,
        onfinish: null,
        multiShot: !0,
        multiShotEvents: !1,
        position: null,
        pan: 0,
        stream: !0,
        to: null,
        type: null,
        usePolicyFile: !1,
        volume: 100
      }, this.flash9Options = {
        isMovieStar: null,
        usePeakData: !1,
        useWaveformData: !1,
        useEQData: !1,
        onbufferchange: null,
        ondataerror: null
      }, this.movieStarOptions = {
        bufferTime: 3,
        serverURL: null,
        onconnect: null,
        duration: null
      }, this.audioFormats = {
        mp3: {
          type: ['audio/mpeg; codecs="mp3"', "audio/mpeg", "audio/mp3", "audio/MPA", "audio/mpa-robust"],
          required: !0
        },
        mp4: {
          related: ["aac", "m4a", "m4b"],
          type: ['audio/mp4; codecs="mp4a.40.2"', "audio/aac", "audio/x-m4a", "audio/MP4A-LATM", "audio/mpeg4-generic"],
          required: !1
        },
        ogg: {
          type: ["audio/ogg; codecs=vorbis"],
          required: !1
        },
        opus: {
          type: ["audio/ogg; codecs=opus", "audio/opus"],
          required: !1
        },
        wav: {
          type: ['audio/wav; codecs="1"', "audio/wav", "audio/wave", "audio/x-wav"],
          required: !1
        }
      }, this.movieID = "sm2-container", this.id = i || "sm2movie", this.debugID = "soundmanager-debug", this.debugURLParam = /([#?&])debug=1/i, this.versionNumber = "V2.97a.20131201", this.version = null, this.movieURL = null, this.altURL = null, this.swfLoaded = !1, this.enabled = !1, this.oMC = null, this.sounds = {}, this.soundIDs = [], this.muted = !1, this.didFlashBlock = !1, this.filePattern = null, this.filePatterns = {
        flash8: /\.mp3(\?.*)?$/i,
        flash9: /\.mp3(\?.*)?$/i
      }, this.features = {
        buffering: !1,
        peakData: !1,
        waveformData: !1,
        eqData: !1,
        movieStar: !1
      }, this.sandbox = {
        type: null,
        types: {
          remote: "remote (domain-based) rules",
          localWithFile: "local with file access (no internet access)",
          localWithNetwork: "local with network (internet access only, no local access)",
          localTrusted: "local, trusted (local+internet access)"
        },
        description: null,
        noRemote: null,
        noLocal: null
      }, this.html5 = {
        usingFlash: null
      }, this.flash = {}, this.html5Only = !1, this.ignoreFlash = !1;
      var r, s, l, c, u, d, p, h, f, m, g, v, y, w, b, _, x, $, S, T, k, C, E, P, M, H, L, D, O, N, I, A, j, F, R, B, z, q, U, W, X, Y, V, G, Q, K, J, Z, et, tt, nt, it, ot, at, rt, st, lt, ct, ut, dt, pt, ht, ft, mt, gt = this,
        vt = null,
        yt = null,
        wt = "soundManager",
        bt = wt + ": ",
        _t = "HTML5::",
        xt = navigator.userAgent,
        $t = e.location.href.toString(),
        St = document,
        Tt = [],
        kt = !0,
        Ct = !1,
        Et = !1,
        Pt = !1,
        Mt = !1,
        Ht = !1,
        Lt = 0,
        Dt = ["log", "info", "warn", "error"],
        Ot = 8,
        Nt = null,
        It = null,
        At = !1,
        jt = !1,
        Ft = 0,
        Rt = null,
        Bt = [],
        zt = null,
        qt = Array.prototype.slice,
        Ut = !1,
        Wt = 0,
        Xt = xt.match(/(ipad|iphone|ipod)/i),
        Yt = xt.match(/android/i),
        Vt = xt.match(/msie/i),
        Gt = xt.match(/webkit/i),
        Qt = xt.match(/safari/i) && !xt.match(/chrome/i),
        Kt = xt.match(/opera/i),
        Jt = xt.match(/(mobile|pre\/|xoom)/i) || Xt || Yt,
        Zt = !$t.match(/usehtml5audio/i) && !$t.match(/sm2\-ignorebadua/i) && Qt && !xt.match(/silk/i) && xt.match(/OS X 10_6_([3-7])/i),
        en = e.console !== t && console.log !== t,
        tn = St.hasFocus !== t ? St.hasFocus() : null,
        nn = Qt && (St.hasFocus === t || !St.hasFocus()),
        on = !nn,
        an = /(mp3|mp4|mpa|m4a|m4b)/i,
        rn = 1e3,
        sn = "about:blank",
        ln = "data:audio/wave;base64,/UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAD//w==",
        cn = St.location ? St.location.protocol.match(/http/i) : null,
        un = cn ? "" : "http://",
        dn = /^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|m4b|mp4v|3gp|3g2)\s*(?:$|;)/i,
        pn = ["mpeg4", "aac", "flv", "mov", "mp4", "m4v", "f4v", "m4a", "m4b", "mp4v", "3gp", "3g2"],
        hn = new RegExp("\\.(" + pn.join("|") + ")(\\?.*)?$", "i");
      this.mimePattern = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i, this.useAltURL = !cn, q = {
        swfBox: "sm2-object-box",
        swfDefault: "movieContainer",
        swfError: "swf_error",
        swfTimedout: "swf_timedout",
        swfLoaded: "swf_loaded",
        swfUnblocked: "swf_unblocked",
        sm2Debug: "sm2_debug",
        highPerf: "high_performance",
        flashDebug: "flash_debug"
      }, this.hasHTML5 = function() {
        try {
          return Audio !== t && (Kt && opera !== t && opera.version() < 10 ? new Audio(null) : new Audio).canPlayType !== t
        } catch (e) {
          return !1
        }
      }(), this.setup = function(e) {
        var n = !gt.url;
        return e !== t && Pt && zt && gt.ok() && (e.flashVersion !== t || e.url !== t || e.html5Test !== t) && Y(R("setupLate")), g(e), e && (n && H && e.url !== t && gt.beginDelayedInit(), H || e.url === t || "complete" !== St.readyState || setTimeout(P, 1)), gt
      }, this.ok = function() {
        return zt ? Pt && !Mt : gt.useHTML5Audio && gt.hasHTML5
      }, this.supported = this.ok, this.getMovie = function(t) {
        return s(t) || St[t] || e[t]
      }, this.createSound = function(e, n) {
        function i() {
          return s = W(s), gt.sounds[s.id] = new r(s), gt.soundIDs.push(s.id), gt.sounds[s.id]
        }
        var o, a, s, l = null;
        if (o = wt + ".createSound(): ", a = o + R(Pt ? "notOK" : "notReady"), !Pt || !gt.ok()) return Y(a), !1;
        if (n !== t && (e = {
            id: e,
            url: n
          }), s = m(e), s.url = J(s.url), void 0 === s.id && (s.id = gt.setupOptions.idPrefix + Wt++), s.id.toString().charAt(0).match(/^[0-9]$/) && gt._wD(o + R("badID", s.id), 2), gt._wD(o + s.id + (s.url ? " (" + s.url + ")" : ""), 1), V(s.id, !0)) return gt._wD(o + s.id + " exists", 1), gt.sounds[s.id];
        if (tt(s)) l = i(), gt._wD(s.id + ": Using HTML5"), l._setup_html5(s);
        else {
          if (gt.html5Only) return gt._wD(s.id + ": No HTML5 support for this sound, and no Flash. Exiting."), i();
          if (gt.html5.usingFlash && s.url && s.url.match(/data\:/i)) return gt._wD(s.id + ": data: URIs not supported via Flash. Exiting."), i();
          d > 8 && (null === s.isMovieStar && (s.isMovieStar = !!(s.serverURL || (s.type ? s.type.match(dn) : !1) || s.url && s.url.match(hn))), s.isMovieStar && (gt._wD(o + "using MovieStar handling"), s.loops > 1 && h("noNSLoop"))), s = X(s, o), l = i(), 8 === d ? yt._createSound(s.id, s.loops || 1, s.usePolicyFile) : (yt._createSound(s.id, s.url, s.usePeakData, s.useWaveformData, s.useEQData, s.isMovieStar, s.isMovieStar ? s.bufferTime : !1, s.loops || 1, s.serverURL, s.duration || null, s.autoPlay, !0, s.autoLoad, s.usePolicyFile), s.serverURL || (l.connected = !0, s.onconnect && s.onconnect.apply(l))), s.serverURL || !s.autoLoad && !s.autoPlay || l.load(s)
        }
        return !s.serverURL && s.autoPlay && l.play(), l
      }, this.destroySound = function(e, t) {
        if (!V(e)) return !1;
        var n, i = gt.sounds[e];
        for (i._iO = {}, i.stop(), i.unload(), n = 0; n < gt.soundIDs.length; n++)
          if (gt.soundIDs[n] === e) {
            gt.soundIDs.splice(n, 1);
            break
          }
        return t || i.destruct(!0), i = null, delete gt.sounds[e], !0
      }, this.load = function(e, t) {
        return V(e) ? gt.sounds[e].load(t) : !1
      }, this.unload = function(e) {
        return V(e) ? gt.sounds[e].unload() : !1
      }, this.onPosition = function(e, t, n, i) {
        return V(e) ? gt.sounds[e].onposition(t, n, i) : !1
      }, this.onposition = this.onPosition, this.clearOnPosition = function(e, t, n) {
        return V(e) ? gt.sounds[e].clearOnPosition(t, n) : !1
      }, this.play = function(e, t) {
        var n = null,
          i = t && !(t instanceof Object);
        if (!Pt || !gt.ok()) return Y(wt + ".play(): " + R(Pt ? "notOK" : "notReady")), !1;
        if (V(e, i)) i && (t = {
          url: t
        });
        else {
          if (!i) return !1;
          i && (t = {
            url: t
          }), t && t.url && (gt._wD(wt + '.play(): Attempting to create "' + e + '"', 1), t.id = e, n = gt.createSound(t).play())
        }
        return null === n && (n = gt.sounds[e].play(t)), n
      }, this.start = this.play, this.setPosition = function(e, t) {
        return V(e) ? gt.sounds[e].setPosition(t) : !1
      }, this.stop = function(e) {
        return V(e) ? (gt._wD(wt + ".stop(" + e + ")", 1), gt.sounds[e].stop()) : !1
      }, this.stopAll = function() {
        var e;
        gt._wD(wt + ".stopAll()", 1);
        for (e in gt.sounds) gt.sounds.hasOwnProperty(e) && gt.sounds[e].stop()
      }, this.pause = function(e) {
        return V(e) ? gt.sounds[e].pause() : !1
      }, this.pauseAll = function() {
        var e;
        for (e = gt.soundIDs.length - 1; e >= 0; e--) gt.sounds[gt.soundIDs[e]].pause()
      }, this.resume = function(e) {
        return V(e) ? gt.sounds[e].resume() : !1
      }, this.resumeAll = function() {
        var e;
        for (e = gt.soundIDs.length - 1; e >= 0; e--) gt.sounds[gt.soundIDs[e]].resume()
      }, this.togglePause = function(e) {
        return V(e) ? gt.sounds[e].togglePause() : !1
      }, this.setPan = function(e, t) {
        return V(e) ? gt.sounds[e].setPan(t) : !1
      }, this.setVolume = function(e, t) {
        return V(e) ? gt.sounds[e].setVolume(t) : !1
      }, this.mute = function(e) {
        var t = 0;
        if (e instanceof String && (e = null), e) return V(e) ? (gt._wD(wt + '.mute(): Muting "' + e + '"'), gt.sounds[e].mute()) : !1;
        for (gt._wD(wt + ".mute(): Muting all sounds"), t = gt.soundIDs.length - 1; t >= 0; t--) gt.sounds[gt.soundIDs[t]].mute();
        return gt.muted = !0, !0
      }, this.muteAll = function() {
        gt.mute()
      }, this.unmute = function(e) {
        var t;
        if (e instanceof String && (e = null), e) return V(e) ? (gt._wD(wt + '.unmute(): Unmuting "' + e + '"'), gt.sounds[e].unmute()) : !1;
        for (gt._wD(wt + ".unmute(): Unmuting all sounds"), t = gt.soundIDs.length - 1; t >= 0; t--) gt.sounds[gt.soundIDs[t]].unmute();
        return gt.muted = !1, !0
      }, this.unmuteAll = function() {
        gt.unmute()
      }, this.toggleMute = function(e) {
        return V(e) ? gt.sounds[e].toggleMute() : !1
      }, this.getMemoryUse = function() {
        var e = 0;
        return yt && 8 !== d && (e = parseInt(yt._getMemoryUse(), 10)), e
      }, this.disable = function(n) {
        var i;
        if (n === t && (n = !1), Mt) return !1;
        for (Mt = !0, h("shutdown", 1), i = gt.soundIDs.length - 1; i >= 0; i--) A(gt.sounds[gt.soundIDs[i]]);
        return f(n), st.remove(e, "load", b), !0
      }, this.canPlayMIME = function(e) {
        var t;
        return gt.hasHTML5 && (t = nt({
          type: e
        })), !t && zt && (t = e && gt.ok() ? !!((d > 8 ? e.match(dn) : null) || e.match(gt.mimePattern)) : null), t
      }, this.canPlayURL = function(e) {
        var t;
        return gt.hasHTML5 && (t = nt({
          url: e
        })), !t && zt && (t = e && gt.ok() ? !!e.match(gt.filePattern) : null), t
      }, this.canPlayLink = function(e) {
        return e.type !== t && e.type && gt.canPlayMIME(e.type) ? !0 : gt.canPlayURL(e.href)
      }, this.getSoundById = function(e, t) {
        if (!e) return null;
        var n = gt.sounds[e];
        return n || t || gt._wD(wt + '.getSoundById(): Sound "' + e + '" not found.', 2), n
      }, this.onready = function(t, n) {
        var i = "onready",
          o = !1;
        if ("function" != typeof t) throw R("needFunction", i);
        return Pt && gt._wD(R("queue", i)), n || (n = e), y(i, t, n), w(), o = !0, o
      }, this.ontimeout = function(t, n) {
        var i = "ontimeout",
          o = !1;
        if ("function" != typeof t) throw R("needFunction", i);
        return Pt && gt._wD(R("queue", i)), n || (n = e), y(i, t, n), w({
          type: i
        }), o = !0, o
      }, this._writeDebug = function(e, n) {
        var i, o, a = "soundmanager-debug";
        return gt.debugMode ? en && gt.useConsole && (n && "object" == typeof n ? console.log(e, n) : Dt[n] !== t ? console[Dt[n]](e) : console.log(e), gt.consoleOnly) ? !0 : (i = s(a)) ? (o = St.createElement("div"), 0 === ++Lt % 2 && (o.className = "sm2-alt"), n = n === t ? 0 : parseInt(n, 10), o.appendChild(St.createTextNode(e)), n && (n >= 2 && (o.style.fontWeight = "bold"), 3 === n && (o.style.color = "#ff3333")), i.insertBefore(o, i.firstChild), i = null, !0) : !1 : !1
      }, -1 !== $t.indexOf("sm2-debug=alert") && (this._writeDebug = function(t) {
        e.alert(t)
      }), this._wD = this._writeDebug, this._debug = function() {
        var e, t;
        for (h("currentObj", 1), e = 0, t = gt.soundIDs.length; t > e; e++) gt.sounds[gt.soundIDs[e]]._debug()
      }, this.reboot = function(t, n) {
        gt.soundIDs.length && gt._wD("Destroying " + gt.soundIDs.length + " SMSound object" + (1 !== gt.soundIDs.length ? "s" : "") + "...");
        var i, o, a;
        for (i = gt.soundIDs.length - 1; i >= 0; i--) gt.sounds[gt.soundIDs[i]].destruct();
        if (yt) try {
          Vt && (It = yt.innerHTML), Nt = yt.parentNode.removeChild(yt)
        } catch (r) {
          h("badRemove", 2)
        }
        if (It = Nt = zt = yt = null, gt.enabled = H = Pt = At = jt = Ct = Et = Mt = Ut = gt.swfLoaded = !1, gt.soundIDs = [], gt.sounds = {}, Wt = 0, t) Tt = [];
        else
          for (i in Tt)
            if (Tt.hasOwnProperty(i))
              for (o = 0, a = Tt[i].length; a > o; o++) Tt[i][o].fired = !1; return n || gt._wD(wt + ": Rebooting..."), gt.html5 = {
          usingFlash: null
        }, gt.flash = {}, gt.html5Only = !1, gt.ignoreFlash = !1, e.setTimeout(function() {
          E(), n || gt.beginDelayedInit()
        }, 20), gt
      }, this.reset = function() {
        return h("reset"), gt.reboot(!0, !0)
      }, this.getMoviePercent = function() {
        return yt && "PercentLoaded" in yt ? yt.PercentLoaded() : null
      }, this.beginDelayedInit = function() {
        Ht = !0, P(), setTimeout(function() {
          return jt ? !1 : (D(), C(), jt = !0, !0)
        }, 20), _()
      }, this.destruct = function() {
        gt._wD(wt + ".destruct()"), gt.disable(!0)
      }, r = function(e) {
        var n, i, o, a, r, s, l, c, u, f, g = this,
          v = !1,
          y = [],
          w = 0,
          b = null;
        u = {
          duration: null,
          time: null
        }, this.id = e.id, this.sID = this.id, this.url = e.url, this.options = m(e), this.instanceOptions = this.options, this._iO = this.instanceOptions, this.pan = this.options.pan, this.volume = this.options.volume, this.isHTML5 = !1, this._a = null, f = this.url ? !1 : !0, this.id3 = {}, this._debug = function() {
          gt._wD(g.id + ": Merged options:", g.options)
        }, this.load = function(e) {
          var n, i = null;
          if (e !== t ? g._iO = m(e, g.options) : (e = g.options, g._iO = e, b && b !== g.url && (h("manURL"), g._iO.url = g.url, g.url = null)), g._iO.url || (g._iO.url = g.url), g._iO.url = J(g._iO.url), g.instanceOptions = g._iO, n = g._iO, gt._wD(g.id + ": load (" + n.url + ")"), !n.url && !g.url) return gt._wD(g.id + ": load(): url is unassigned. Exiting.", 2), g;
          if (g.isHTML5 || 8 !== d || g.url || n.autoPlay || gt._wD(g.id + ": Flash 8 load() limitation: Wait for onload() before calling play().", 1), n.url === g.url && 0 !== g.readyState && 2 !== g.readyState) return h("onURL", 1), 3 === g.readyState && n.onload && mt(g, function() {
            n.onload.apply(g, [!!g.duration])
          }), g;
          if (g.loaded = !1, g.readyState = 1, g.playState = 0, g.id3 = {}, tt(n)) i = g._setup_html5(n), i._called_load ? gt._wD(g.id + ": Ignoring request to load again") : (g._html5_canplay = !1, g.url !== n.url && (gt._wD(h("manURL") + ": " + n.url), g._a.src = n.url, g.setPosition(0)), g._a.autobuffer = "auto", g._a.preload = "auto", g._a._called_load = !0);
          else {
            if (gt.html5Only) return gt._wD(g.id + ": No flash support. Exiting."), g;
            if (g._iO.url && g._iO.url.match(/data\:/i)) return gt._wD(g.id + ": data: URIs not supported via Flash. Exiting."), g;
            try {
              g.isHTML5 = !1, g._iO = X(W(n)), n = g._iO, 8 === d ? yt._load(g.id, n.url, n.stream, n.autoPlay, n.usePolicyFile) : yt._load(g.id, n.url, !!n.stream, !!n.autoPlay, n.loops || 1, !!n.autoLoad, n.usePolicyFile)
            } catch (o) {
              h("smError", 2), p("onload", !1), O({
                type: "SMSOUND_LOAD_JS_EXCEPTION",
                fatal: !0
              })
            }
          }
          return g.url = n.url, g
        }, this.unload = function() {
          return 0 !== g.readyState && (gt._wD(g.id + ": unload()"), g.isHTML5 ? (a(), g._a && (g._a.pause(), b = ot(g._a))) : 8 === d ? yt._unload(g.id, sn) : yt._unload(g.id), n()), g
        }, this.destruct = function(e) {
          gt._wD(g.id + ": Destruct"), g.isHTML5 ? (a(), g._a && (g._a.pause(), ot(g._a), Ut || o(), g._a._s = null, g._a = null)) : (g._iO.onfailure = null, yt._destroySound(g.id)), e || gt.destroySound(g.id, !0)
        }, this.play = function(e, n) {
          var i, o, a, l, u, p, h, y = !0,
            w = null;
          if (i = g.id + ": play(): ", n = n === t ? !0 : n, e || (e = {}), g.url && (g._iO.url = g.url), g._iO = m(g._iO, g.options), g._iO = m(e, g._iO), g._iO.url = J(g._iO.url), g.instanceOptions = g._iO, !g.isHTML5 && g._iO.serverURL && !g.connected) return g.getAutoPlay() || (gt._wD(i + " Netstream not connected yet - setting autoPlay"), g.setAutoPlay(!0)), g;
          if (tt(g._iO) && (g._setup_html5(g._iO), r()), 1 !== g.playState || g.paused || (o = g._iO.multiShot, o ? gt._wD(i + "Already playing (multi-shot)", 1) : (gt._wD(i + "Already playing (one-shot)", 1), g.isHTML5 && g.setPosition(g._iO.position), w = g)), null !== w) return w;
          if (e.url && e.url !== g.url && (g.readyState || g.isHTML5 || 8 !== d || !f ? g.load(g._iO) : f = !1), g.loaded ? gt._wD(i.substr(0, i.lastIndexOf(":"))) : 0 === g.readyState ? (gt._wD(i + "Attempting to load"), g.isHTML5 || gt.html5Only ? g.isHTML5 ? g.load(g._iO) : (gt._wD(i + "Unsupported type. Exiting."), w = g) : (g._iO.autoPlay = !0, g.load(g._iO)), g.instanceOptions = g._iO) : 2 === g.readyState ? (gt._wD(i + "Could not load - exiting", 2), w = g) : gt._wD(i + "Loading - attempting to play..."), null !== w) return w;
          if (!g.isHTML5 && 9 === d && g.position > 0 && g.position === g.duration && (gt._wD(i + "Sound at end, resetting to position:0"), e.position = 0), g.paused && g.position >= 0 && (!g._iO.serverURL || g.position > 0)) gt._wD(i + "Resuming from paused state", 1), g.resume();
          else {
            if (g._iO = m(e, g._iO), null !== g._iO.from && null !== g._iO.to && 0 === g.instanceCount && 0 === g.playState && !g._iO.serverURL) {
              if (l = function() {
                  g._iO = m(e, g._iO), g.play(g._iO)
                }, g.isHTML5 && !g._html5_canplay ? (gt._wD(i + "Beginning load for from/to case"), g.load({
                  _oncanplay: l
                }), w = !1) : g.isHTML5 || g.loaded || g.readyState && 2 === g.readyState || (gt._wD(i + "Preloading for from/to case"), g.load({
                  onload: l
                }), w = !1), null !== w) return w;
              g._iO = c()
            }(!g.instanceCount || g._iO.multiShotEvents || g.isHTML5 && g._iO.multiShot && !Ut || !g.isHTML5 && d > 8 && !g.getAutoPlay()) && g.instanceCount++, g._iO.onposition && 0 === g.playState && s(g), g.playState = 1, g.paused = !1, g.position = g._iO.position === t || isNaN(g._iO.position) ? 0 : g._iO.position, g.isHTML5 || (g._iO = X(W(g._iO))), g._iO.onplay && n && (g._iO.onplay.apply(g), v = !0), g.setVolume(g._iO.volume, !0), g.setPan(g._iO.pan, !0), g.isHTML5 ? g.instanceCount < 2 ? (r(), a = g._setup_html5(), g.setPosition(g._iO.position), a.play()) : (gt._wD(g.id + ": Cloning Audio() for instance #" + g.instanceCount + "..."), u = new Audio(g._iO.url), p = function() {
              st.remove(u, "ended", p), g._onfinish(g), ot(u), u = null
            }, h = function() {
              st.remove(u, "canplay", h);
              try {
                u.currentTime = g._iO.position / rn
              } catch (e) {
                Y(g.id + ": multiShot play() failed to apply position of " + g._iO.position / rn)
              }
              u.play()
            }, st.add(u, "ended", p), void 0 !== g._iO.volume && (u.volume = Math.max(0, Math.min(1, g._iO.volume / 100))), g.muted && (u.muted = !0), g._iO.position ? st.add(u, "canplay", h) : u.play()) : (y = yt._start(g.id, g._iO.loops || 1, 9 === d ? g.position : g.position / rn, g._iO.multiShot || !1), 9 !== d || y || (gt._wD(i + "No sound hardware, or 32-sound ceiling hit", 2), g._iO.onplayerror && g._iO.onplayerror.apply(g)))
          }
          return g
        }, this.start = this.play, this.stop = function(e) {
          var t, n = g._iO;
          return 1 === g.playState && (gt._wD(g.id + ": stop()"), g._onbufferchange(0), g._resetOnPosition(0), g.paused = !1, g.isHTML5 || (g.playState = 0), l(), n.to && g.clearOnPosition(n.to), g.isHTML5 ? g._a && (t = g.position, g.setPosition(0), g.position = t, g._a.pause(), g.playState = 0, g._onTimer(), a()) : (yt._stop(g.id, e), n.serverURL && g.unload()), g.instanceCount = 0, g._iO = {}, n.onstop && n.onstop.apply(g)), g
        }, this.setAutoPlay = function(e) {
          gt._wD(g.id + ": Autoplay turned " + (e ? "on" : "off")), g._iO.autoPlay = e, g.isHTML5 || (yt._setAutoPlay(g.id, e), e && (g.instanceCount || 1 !== g.readyState || (g.instanceCount++, gt._wD(g.id + ": Incremented instance count to " + g.instanceCount))))
        }, this.getAutoPlay = function() {
          return g._iO.autoPlay
        }, this.setPosition = function(e) {
          e === t && (e = 0);
          var n, i, o = g.isHTML5 ? Math.max(e, 0) : Math.min(g.duration || g._iO.duration, Math.max(e, 0));
          if (g.position = o, i = g.position / rn, g._resetOnPosition(g.position), g._iO.position = o, g.isHTML5) {
            if (g._a) {
              if (g._html5_canplay) {
                if (g._a.currentTime !== i) {
                  gt._wD(g.id + ": setPosition(" + i + ")");
                  try {
                    g._a.currentTime = i, (0 === g.playState || g.paused) && g._a.pause()
                  } catch (a) {
                    gt._wD(g.id + ": setPosition(" + i + ") failed: " + a.message, 2)
                  }
                }
              } else if (i) return gt._wD(g.id + ": setPosition(" + i + "): Cannot seek yet, sound not ready", 2), g;
              g.paused && g._onTimer(!0)
            }
          } else n = 9 === d ? g.position : i, g.readyState && 2 !== g.readyState && yt._setPosition(g.id, n, g.paused || !g.playState, g._iO.multiShot);
          return g
        }, this.pause = function(e) {
          return g.paused || 0 === g.playState && 1 !== g.readyState ? g : (gt._wD(g.id + ": pause()"), g.paused = !0, g.isHTML5 ? (g._setup_html5().pause(), a()) : (e || e === t) && yt._pause(g.id, g._iO.multiShot), g._iO.onpause && g._iO.onpause.apply(g), g)
        }, this.resume = function() {
          var e = g._iO;
          return g.paused ? (gt._wD(g.id + ": resume()"), g.paused = !1, g.playState = 1, g.isHTML5 ? (g._setup_html5().play(), r()) : (e.isMovieStar && !e.serverURL && g.setPosition(g.position), yt._pause(g.id, e.multiShot)), !v && e.onplay ? (e.onplay.apply(g), v = !0) : e.onresume && e.onresume.apply(g), g) : g
        }, this.togglePause = function() {
          return gt._wD(g.id + ": togglePause()"), 0 === g.playState ? (g.play({
            position: 9 !== d || g.isHTML5 ? g.position / rn : g.position
          }), g) : (g.paused ? g.resume() : g.pause(), g)
        }, this.setPan = function(e, n) {
          return e === t && (e = 0), n === t && (n = !1), g.isHTML5 || yt._setPan(g.id, e), g._iO.pan = e, n || (g.pan = e, g.options.pan = e), g
        }, this.setVolume = function(e, n) {
          return e === t && (e = 100), n === t && (n = !1), g.isHTML5 ? g._a && (gt.muted && !g.muted && (g.muted = !0, g._a.muted = !0), g._a.volume = Math.max(0, Math.min(1, e / 100))) : yt._setVolume(g.id, gt.muted && !g.muted || g.muted ? 0 : e), g._iO.volume = e, n || (g.volume = e, g.options.volume = e), g
        }, this.mute = function() {
          return g.muted = !0, g.isHTML5 ? g._a && (g._a.muted = !0) : yt._setVolume(g.id, 0), g
        }, this.unmute = function() {
          g.muted = !1;
          var e = g._iO.volume !== t;
          return g.isHTML5 ? g._a && (g._a.muted = !1) : yt._setVolume(g.id, e ? g._iO.volume : g.options.volume), g
        }, this.toggleMute = function() {
          return g.muted ? g.unmute() : g.mute()
        }, this.onPosition = function(e, n, i) {
          return y.push({
            position: parseInt(e, 10),
            method: n,
            scope: i !== t ? i : g,
            fired: !1
          }), g
        }, this.onposition = this.onPosition, this.clearOnPosition = function(e, t) {
          var n;
          if (e = parseInt(e, 10), isNaN(e)) return !1;
          for (n = 0; n < y.length; n++) e === y[n].position && (t && t !== y[n].method || (y[n].fired && w--, y.splice(n, 1)))
        }, this._processOnPosition = function() {
          var e, t, n = y.length;
          if (!n || !g.playState || w >= n) return !1;
          for (e = n - 1; e >= 0; e--) t = y[e], !t.fired && g.position >= t.position && (t.fired = !0, w++, t.method.apply(t.scope, [t.position]), n = y.length);
          return !0
        }, this._resetOnPosition = function(e) {
          var t, n, i = y.length;
          if (!i) return !1;
          for (t = i - 1; t >= 0; t--) n = y[t], n.fired && e <= n.position && (n.fired = !1, w--);
          return !0
        }, c = function() {
          var e, t, n = g._iO,
            i = n.from,
            o = n.to;
          return t = function() {
            gt._wD(g.id + ': "To" time of ' + o + " reached."), g.clearOnPosition(o, t), g.stop()
          }, e = function() {
            gt._wD(g.id + ': Playing "from" ' + i), null === o || isNaN(o) || g.onPosition(o, t)
          }, null === i || isNaN(i) || (n.position = i, n.multiShot = !1, e()), n
        }, s = function() {
          var e, t = g._iO.onposition;
          if (t)
            for (e in t) t.hasOwnProperty(e) && g.onPosition(parseInt(e, 10), t[e])
        }, l = function() {
          var e, t = g._iO.onposition;
          if (t)
            for (e in t) t.hasOwnProperty(e) && g.clearOnPosition(parseInt(e, 10))
        }, r = function() {
          g.isHTML5 && G(g)
        }, a = function() {
          g.isHTML5 && Q(g)
        }, n = function(e) {
          e || (y = [], w = 0), v = !1, g._hasTimer = null, g._a = null, g._html5_canplay = !1, g.bytesLoaded = null, g.bytesTotal = null, g.duration = g._iO && g._iO.duration ? g._iO.duration : null, g.durationEstimate = null, g.buffered = [], g.eqData = [], g.eqData.left = [], g.eqData.right = [], g.failures = 0, g.isBuffering = !1, g.instanceOptions = {}, g.instanceCount = 0, g.loaded = !1, g.metadata = {}, g.readyState = 0, g.muted = !1, g.paused = !1, g.peakData = {
            left: 0,
            right: 0
          }, g.waveformData = {
            left: [],
            right: []
          }, g.playState = 0, g.position = null, g.id3 = {}
        }, n(), this._onTimer = function(e) {
          var t, n, i = !1,
            o = {};
          return g._hasTimer || e ? (g._a && (e || (g.playState > 0 || 1 === g.readyState) && !g.paused) && (t = g._get_html5_duration(), t !== u.duration && (u.duration = t, g.duration = t, i = !0), g.durationEstimate = g.duration, n = g._a.currentTime * rn || 0, n !== u.time && (u.time = n, i = !0), (i || e) && g._whileplaying(n, o, o, o, o)), i) : void 0
        }, this._get_html5_duration = function() {
          var e = g._iO,
            t = g._a && g._a.duration ? g._a.duration * rn : e && e.duration ? e.duration : null,
            n = t && !isNaN(t) && 1 / 0 !== t ? t : null;
          return n
        }, this._apply_loop = function(e, t) {
          !e.loop && t > 1 && gt._wD("Note: Native HTML5 looping is infinite.", 1), e.loop = t > 1 ? "loop" : ""
        }, this._setup_html5 = function(e) {
          var t, o = m(g._iO, e),
            a = Ut ? vt : g._a,
            r = decodeURI(o.url);
          if (Ut ? r === decodeURI(lt) && (t = !0) : r === decodeURI(b) && (t = !0), a) {
            if (a._s)
              if (Ut) a._s && a._s.playState && !t && a._s.stop();
              else if (!Ut && r === decodeURI(b)) return g._apply_loop(a, o.loops), a;
            t || (b && n(!1), a.src = o.url, g.url = o.url, b = o.url, lt = o.url, a._called_load = !1)
          } else o.autoLoad || o.autoPlay ? (g._a = new Audio(o.url), g._a.load()) : g._a = Kt && opera.version() < 10 ? new Audio(null) : new Audio, a = g._a, a._called_load = !1, Ut && (vt = a);
          return g.isHTML5 = !0, g._a = a, a._s = g, i(), g._apply_loop(a, o.loops), o.autoLoad || o.autoPlay ? g.load() : (a.autobuffer = !1, a.preload = "auto"), a
        }, i = function() {
          function e(e, t, n) {
            return g._a ? g._a.addEventListener(e, t, n || !1) : null
          }
          if (g._a._added_events) return !1;
          var t;
          g._a._added_events = !0;
          for (t in pt) pt.hasOwnProperty(t) && e(t, pt[t]);
          return !0
        }, o = function() {
          function e(e, t, n) {
            return g._a ? g._a.removeEventListener(e, t, n || !1) : null
          }
          var t;
          gt._wD(g.id + ": Removing event listeners"), g._a._added_events = !1;
          for (t in pt) pt.hasOwnProperty(t) && e(t, pt[t])
        }, this._onload = function(e) {
          var t, n = !!e || !g.isHTML5 && 8 === d && g.duration;
          return t = g.id + ": ", gt._wD(t + (n ? "onload()" : "Failed to load / invalid sound?" + (g.duration ? " -" : " Zero-length duration reported.") + " (" + g.url + ")"), n ? 1 : 2), n || g.isHTML5 || (gt.sandbox.noRemote === !0 && gt._wD(t + R("noNet"), 1), gt.sandbox.noLocal === !0 && gt._wD(t + R("noLocal"), 1)), g.loaded = n, g.readyState = n ? 3 : 2, g._onbufferchange(0), g._iO.onload && mt(g, function() {
            g._iO.onload.apply(g, [n])
          }), !0
        }, this._onbufferchange = function(e) {
          return 0 === g.playState ? !1 : e && g.isBuffering || !e && !g.isBuffering ? !1 : (g.isBuffering = 1 === e, g._iO.onbufferchange && (gt._wD(g.id + ": Buffer state change: " + e), g._iO.onbufferchange.apply(g)), !0)
        }, this._onsuspend = function() {
          return g._iO.onsuspend && (gt._wD(g.id + ": Playback suspended"), g._iO.onsuspend.apply(g)), !0
        }, this._onfailure = function(e, t, n) {
          g.failures++, gt._wD(g.id + ": Failures = " + g.failures), g._iO.onfailure && 1 === g.failures ? g._iO.onfailure(g, e, t, n) : gt._wD(g.id + ": Ignoring failure")
        }, this._onfinish = function() {
          var e = g._iO.onfinish;
          g._onbufferchange(0), g._resetOnPosition(0), g.instanceCount && (g.instanceCount--, g.instanceCount || (l(), g.playState = 0, g.paused = !1, g.instanceCount = 0, g.instanceOptions = {}, g._iO = {}, a(), g.isHTML5 && (g.position = 0)), (!g.instanceCount || g._iO.multiShotEvents) && e && (gt._wD(g.id + ": onfinish()"), mt(g, function() {
            e.apply(g)
          })))
        }, this._whileloading = function(e, t, n, i) {
          var o = g._iO;
          g.bytesLoaded = e, g.bytesTotal = t, g.duration = Math.floor(n), g.bufferLength = i, g.durationEstimate = g.isHTML5 || o.isMovieStar ? g.duration : o.duration ? g.duration > o.duration ? g.duration : o.duration : parseInt(g.bytesTotal / g.bytesLoaded * g.duration, 10), g.isHTML5 || (g.buffered = [{
            start: 0,
            end: g.duration
          }]), (3 !== g.readyState || g.isHTML5) && o.whileloading && o.whileloading.apply(g)
        }, this._whileplaying = function(e, n, i, o, a) {
          var r, s = g._iO;
          return isNaN(e) || null === e ? !1 : (g.position = Math.max(0, e), g._processOnPosition(), !g.isHTML5 && d > 8 && (s.usePeakData && n !== t && n && (g.peakData = {
            left: n.leftPeak,
            right: n.rightPeak
          }), s.useWaveformData && i !== t && i && (g.waveformData = {
            left: i.split(","),
            right: o.split(",")
          }), s.useEQData && a !== t && a && a.leftEQ && (r = a.leftEQ.split(","), g.eqData = r, g.eqData.left = r, a.rightEQ !== t && a.rightEQ && (g.eqData.right = a.rightEQ.split(",")))), 1 === g.playState && (g.isHTML5 || 8 !== d || g.position || !g.isBuffering || g._onbufferchange(0), s.whileplaying && s.whileplaying.apply(g)), !0)
        }, this._oncaptiondata = function(e) {
          gt._wD(g.id + ": Caption data received."), g.captiondata = e, g._iO.oncaptiondata && g._iO.oncaptiondata.apply(g, [e])
        }, this._onmetadata = function(e, t) {
          gt._wD(g.id + ": Metadata received.");
          var n, i, o = {};
          for (n = 0, i = e.length; i > n; n++) o[e[n]] = t[n];
          g.metadata = o, g._iO.onmetadata && g._iO.onmetadata.apply(g)
        }, this._onid3 = function(e, t) {
          gt._wD(g.id + ": ID3 data received.");
          var n, i, o = [];
          for (n = 0, i = e.length; i > n; n++) o[e[n]] = t[n];
          g.id3 = m(g.id3, o), g._iO.onid3 && g._iO.onid3.apply(g)
        }, this._onconnect = function(e) {
          e = 1 === e, gt._wD(g.id + ": " + (e ? "Connected." : "Failed to connect? - " + g.url), e ? 1 : 2), g.connected = e, e && (g.failures = 0, V(g.id) && (g.getAutoPlay() ? g.play(t, g.getAutoPlay()) : g._iO.autoLoad && g.load()), g._iO.onconnect && g._iO.onconnect.apply(g, [e]))
        }, this._ondataerror = function(e) {
          g.playState > 0 && (gt._wD(g.id + ": Data error: " + e), g._iO.ondataerror && g._iO.ondataerror.apply(g))
        }, this._debug()
      }, L = function() {
        return St.body || St.getElementsByTagName("div")[0]
      }, s = function(e) {
        return St.getElementById(e)
      }, m = function(e, n) {
        var i, o, a = e || {};
        i = n === t ? gt.defaultOptions : n;
        for (o in i) i.hasOwnProperty(o) && a[o] === t && (a[o] = "object" != typeof i[o] || null === i[o] ? i[o] : m(a[o], i[o]));
        return a
      }, mt = function(t, n) {
        t.isHTML5 || 8 !== d ? n() : e.setTimeout(n, 0)
      }, v = {
        onready: 1,
        ontimeout: 1,
        defaultOptions: 1,
        flash9Options: 1,
        movieStarOptions: 1
      }, g = function(e, n) {
        var i, o = !0,
          a = n !== t,
          r = gt.setupOptions,
          s = v;
        if (e === t) {
          o = [];
          for (i in r) r.hasOwnProperty(i) && o.push(i);
          for (i in s) s.hasOwnProperty(i) && ("object" == typeof gt[i] ? o.push(i + ": {...}") : gt[i] instanceof Function ? o.push(i + ": function() {...}") : o.push(i));
          return gt._wD(R("setup", o.join(", "))), !1
        }
        for (i in e)
          if (e.hasOwnProperty(i))
            if ("object" != typeof e[i] || null === e[i] || e[i] instanceof Array || e[i] instanceof RegExp) a && s[n] !== t ? gt[n][i] = e[i] : r[i] !== t ? (gt.setupOptions[i] = e[i], gt[i] = e[i]) : s[i] === t ? (Y(R(gt[i] === t ? "setupUndef" : "setupError", i), 2), o = !1) : gt[i] instanceof Function ? gt[i].apply(gt, e[i] instanceof Array ? e[i] : [e[i]]) : gt[i] = e[i];
            else {
              if (s[i] !== t) return g(e[i], i);
              Y(R(gt[i] === t ? "setupUndef" : "setupError", i), 2), o = !1
            }
        return o
      }, st = function() {
        function t(e) {
          var t = qt.call(e),
            n = t.length;
          return a ? (t[1] = "on" + t[1], n > 3 && t.pop()) : 3 === n && t.push(!1), t
        }

        function n(e, t) {
          var n = e.shift(),
            i = [r[t]];
          a ? n[i](e[0], e[1]) : n[i].apply(n, e)
        }

        function i() {
          n(t(arguments), "add")
        }

        function o() {
          n(t(arguments), "remove")
        }
        var a = e.attachEvent,
          r = {
            add: a ? "attachEvent" : "addEventListener",
            remove: a ? "detachEvent" : "removeEventListener"
          };
        return {
          add: i,
          remove: o
        }
      }(), pt = {
        abort: a(function() {
          gt._wD(this._s.id + ": abort")
        }),
        canplay: a(function() {
          var e, n = this._s;
          if (n._html5_canplay) return !0;
          if (n._html5_canplay = !0, gt._wD(n.id + ": canplay"), n._onbufferchange(0), e = n._iO.position === t || isNaN(n._iO.position) ? null : n._iO.position / rn, n.position && this.currentTime !== e) {
            gt._wD(n.id + ": canplay: Setting position to " + e);
            try {
              this.currentTime = e
            } catch (i) {
              gt._wD(n.id + ": canplay: Setting position of " + e + " failed: " + i.message, 2)
            }
          }
          n._iO._oncanplay && n._iO._oncanplay()
        }),
        canplaythrough: a(function() {
          var e = this._s;
          e.loaded || (e._onbufferchange(0), e._whileloading(e.bytesLoaded, e.bytesTotal, e._get_html5_duration()), e._onload(!0))
        }),
        ended: a(function() {
          var e = this._s;
          gt._wD(e.id + ": ended"), e._onfinish()
        }),
        error: a(function() {
          gt._wD(this._s.id + ": HTML5 error, code " + this.error.code), this._s._onload(!1)
        }),
        loadeddata: a(function() {
          var e = this._s;
          gt._wD(e.id + ": loadeddata"), e._loaded || Qt || (e.duration = e._get_html5_duration())
        }),
        loadedmetadata: a(function() {
          gt._wD(this._s.id + ": loadedmetadata")
        }),
        loadstart: a(function() {
          gt._wD(this._s.id + ": loadstart"), this._s._onbufferchange(1)
        }),
        play: a(function() {
          this._s._onbufferchange(0)
        }),
        playing: a(function() {
          gt._wD(this._s.id + ": playing"), this._s._onbufferchange(0)
        }),
        progress: a(function(e) {
          var t, n, i, o = this._s,
            a = 0,
            r = "progress" === e.type,
            s = e.target.buffered,
            l = e.loaded || 0,
            c = e.total || 1;
          if (o.buffered = [], s && s.length) {
            for (t = 0, n = s.length; n > t; t++) o.buffered.push({
              start: s.start(t) * rn,
              end: s.end(t) * rn
            });
            if (a = (s.end(0) - s.start(0)) * rn, l = Math.min(1, a / (e.target.duration * rn)), r && s.length > 1) {
              for (i = [], n = s.length, t = 0; n > t; t++) i.push(e.target.buffered.start(t) * rn + "-" + e.target.buffered.end(t) * rn);
              gt._wD(this._s.id + ": progress, timeRanges: " + i.join(", "))
            }
            r && !isNaN(l) && gt._wD(this._s.id + ": progress, " + Math.floor(100 * l) + "% loaded")
          }
          isNaN(l) || (o._onbufferchange(0), o._whileloading(l, c, o._get_html5_duration()), l && c && l === c && pt.canplaythrough.call(this, e))
        }),
        ratechange: a(function() {
          gt._wD(this._s.id + ": ratechange")
        }),
        suspend: a(function(e) {
          var t = this._s;
          gt._wD(this._s.id + ": suspend"), pt.progress.call(this, e), t._onsuspend()
        }),
        stalled: a(function() {
          gt._wD(this._s.id + ": stalled")
        }),
        timeupdate: a(function() {
          this._s._onTimer()
        }),
        waiting: a(function() {
          var e = this._s;
          gt._wD(this._s.id + ": waiting"), e._onbufferchange(1)
        })
      }, tt = function(e) {
        var t;
        return t = e && (e.type || e.url || e.serverURL) ? e.serverURL || e.type && o(e.type) ? !1 : e.type ? nt({
          type: e.type
        }) : nt({
          url: e.url
        }) || gt.html5Only || e.url.match(/data\:/i) : !1
      }, ot = function(e) {
        var t;
        return e && (t = Qt ? sn : gt.html5.canPlayType("audio/wav") ? ln : sn, e.src = t, void 0 !== e._called_unload && (e._called_load = !1)), Ut && (lt = null), t
      }, nt = function(e) {
        if (!gt.useHTML5Audio || !gt.hasHTML5) return !1;
        var n, i, a, r, s = e.url || null,
          l = e.type || null,
          c = gt.audioFormats;
        if (l && gt.html5[l] !== t) return gt.html5[l] && !o(l);
        if (!it) {
          it = [];
          for (r in c) c.hasOwnProperty(r) && (it.push(r), c[r].related && (it = it.concat(c[r].related)));
          it = new RegExp("\\.(" + it.join("|") + ")(\\?.*)?$", "i")
        }
        return a = s ? s.toLowerCase().match(it) : null, a && a.length ? a = a[1] : l ? (i = l.indexOf(";"), a = (-1 !== i ? l.substr(0, i) : l).substr(6)) : n = !1, a && gt.html5[a] !== t ? n = gt.html5[a] && !o(a) : (l = "audio/" + a, n = gt.html5.canPlayType({
          type: l
        }), gt.html5[a] = n, n = n && gt.html5[l] && !o(l)), n
      }, rt = function() {
        function e(e) {
          var t, n, i = !1,
            o = !1;
          if (!r || "function" != typeof r.canPlayType) return i;
          if (e instanceof Array) {
            for (a = 0, n = e.length; n > a; a++)(gt.html5[e[a]] || r.canPlayType(e[a]).match(gt.html5Test)) && (o = !0, gt.html5[e[a]] = !0, gt.flash[e[a]] = !!e[a].match(an));
            i = o
          } else t = r && "function" == typeof r.canPlayType ? r.canPlayType(e) : !1, i = !(!t || !t.match(gt.html5Test));
          return i
        }
        if (!gt.useHTML5Audio || !gt.hasHTML5) return gt.html5.usingFlash = !0, zt = !0, !1;
        var n, i, o, a, r = Audio !== t ? Kt && opera.version() < 10 ? new Audio(null) : new Audio : null,
          s = {};
        o = gt.audioFormats;
        for (n in o)
          if (o.hasOwnProperty(n) && (i = "audio/" + n, s[n] = e(o[n].type), s[i] = s[n], n.match(an) ? (gt.flash[n] = !0, gt.flash[i] = !0) : (gt.flash[n] = !1, gt.flash[i] = !1), o[n] && o[n].related))
            for (a = o[n].related.length - 1; a >= 0; a--) s["audio/" + o[n].related[a]] = s[n], gt.html5[o[n].related[a]] = s[n], gt.flash[o[n].related[a]] = s[n];
        return s.canPlayType = r ? e : null, gt.html5 = m(gt.html5, s), gt.html5.usingFlash = et(), zt = gt.html5.usingFlash, !0
      }, k = {
        notReady: "Unavailable - wait until onready() has fired.",
        notOK: "Audio support is not available.",
        domError: wt + "exception caught while appending SWF to DOM.",
        spcWmode: "Removing wmode, preventing known SWF loading issue(s)",
        swf404: bt + "Verify that %s is a valid path.",
        tryDebug: "Try " + wt + ".debugFlash = true for more security details (output goes to SWF.)",
        checkSWF: "See SWF output for more debug info.",
        localFail: bt + "Non-HTTP page (" + St.location.protocol + " URL?) Review Flash player security settings for this special case:\nhttp://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html\nMay need to add/allow path, eg. c:/sm2/ or /users/me/sm2/",
        waitFocus: bt + "Special case: Waiting for SWF to load with window focus...",
        waitForever: bt + "Waiting indefinitely for Flash (will recover if unblocked)...",
        waitSWF: bt + "Waiting for 100% SWF load...",
        needFunction: bt + "Function object expected for %s",
        badID: 'Sound ID "%s" should be a string, starting with a non-numeric character',
        currentObj: bt + "_debug(): Current sound objects",
        waitOnload: bt + "Waiting for window.onload()",
        docLoaded: bt + "Document already loaded",
        onload: bt + "initComplete(): calling soundManager.onload()",
        onloadOK: wt + ".onload() complete",
        didInit: bt + "init(): Already called?",
        secNote: "Flash security note: Network/internet URLs will not load due to security restrictions. Access can be configured via Flash Player Global Security Settings Page: http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html",
        badRemove: bt + "Failed to remove Flash node.",
        shutdown: wt + ".disable(): Shutting down",
        queue: bt + "Queueing %s handler",
        smError: "SMSound.load(): Exception: JS-Flash communication failed, or JS error.",
        fbTimeout: "No flash response, applying ." + q.swfTimedout + " CSS...",
        fbLoaded: "Flash loaded",
        fbHandler: bt + "flashBlockHandler()",
        manURL: "SMSound.load(): Using manually-assigned URL",
        onURL: wt + ".load(): current URL already assigned.",
        badFV: wt + '.flashVersion must be 8 or 9. "%s" is invalid. Reverting to %s.',
        as2loop: "Note: Setting stream:false so looping can work (flash 8 limitation)",
        noNSLoop: "Note: Looping not implemented for MovieStar formats",
        needfl9: "Note: Switching to flash 9, required for MP4 formats.",
        mfTimeout: "Setting flashLoadTimeout = 0 (infinite) for off-screen, mobile flash case",
        needFlash: bt + "Fatal error: Flash is needed to play some required formats, but is not available.",
        gotFocus: bt + "Got window focus.",
        policy: "Enabling usePolicyFile for data access",
        setup: wt + ".setup(): allowed parameters: %s",
        setupError: wt + '.setup(): "%s" cannot be assigned with this method.',
        setupUndef: wt + '.setup(): Could not find option "%s"',
        setupLate: wt + ".setup(): url, flashVersion and html5Test property changes will not take effect until reboot().",
        noURL: bt + "Flash URL required. Call soundManager.setup({url:...}) to get started.",
        sm2Loaded: "SoundManager 2: Ready.",
        reset: wt + ".reset(): Removing event callbacks",
        mobileUA: "Mobile UA detected, preferring HTML5 by default.",
        globalHTML5: "Using singleton HTML5 Audio() pattern for this device."
      }, R = function() {
        var e, t, n, i, o;
        if (e = qt.call(arguments), i = e.shift(), o = k && k[i] ? k[i] : "", o && e && e.length)
          for (t = 0, n = e.length; n > t; t++) o = o.replace("%s", e[t]);
        return o
      }, W = function(e) {
        return 8 === d && e.loops > 1 && e.stream && (h("as2loop"), e.stream = !1), e
      }, X = function(e, t) {
        return e && !e.usePolicyFile && (e.onid3 || e.usePeakData || e.useWaveformData || e.useEQData) && (gt._wD((t || "") + R("policy")), e.usePolicyFile = !0), e
      }, Y = function(e) {
        en && console.warn !== t ? console.warn(e) : gt._wD(e)
      }, l = function() {
        return !1
      }, A = function(e) {
        var t;
        for (t in e) e.hasOwnProperty(t) && "function" == typeof e[t] && (e[t] = l);
        t = null
      }, j = function(e) {
        e === t && (e = !1), (Mt || e) && gt.disable(e)
      }, F = function(e) {
        var t, n = null;
        if (e)
          if (e.match(/\.swf(\?.*)?$/i)) {
            if (n = e.substr(e.toLowerCase().lastIndexOf(".swf?") + 4)) return e
          } else e.lastIndexOf("/") !== e.length - 1 && (e += "/");
        return t = (e && -1 !== e.lastIndexOf("/") ? e.substr(0, e.lastIndexOf("/") + 1) : "./") + gt.movieURL, gt.noSWFCache && (t += "?ts=" + (new Date).getTime()), t
      }, S = function() {
        d = parseInt(gt.flashVersion, 10), 8 !== d && 9 !== d && (gt._wD(R("badFV", d, Ot)), gt.flashVersion = d = Ot);
        var e = gt.debugMode || gt.debugFlash ? "_debug.swf" : ".swf";
        gt.useHTML5Audio && !gt.html5Only && gt.audioFormats.mp4.required && 9 > d && (gt._wD(R("needfl9")), gt.flashVersion = d = 9), gt.version = gt.versionNumber + (gt.html5Only ? " (HTML5-only mode)" : 9 === d ? " (AS3/Flash 9)" : " (AS2/Flash 8)"), d > 8 ? (gt.defaultOptions = m(gt.defaultOptions, gt.flash9Options), gt.features.buffering = !0, gt.defaultOptions = m(gt.defaultOptions, gt.movieStarOptions), gt.filePatterns.flash9 = new RegExp("\\.(mp3|" + pn.join("|") + ")(\\?.*)?$", "i"), gt.features.movieStar = !0) : gt.features.movieStar = !1, gt.filePattern = gt.filePatterns[8 !== d ? "flash9" : "flash8"], gt.movieURL = (8 === d ? "soundmanager2.swf" : "soundmanager2_flash9.swf").replace(".swf", e), gt.features.peakData = gt.features.waveformData = gt.features.eqData = d > 8
      }, N = function(e, t) {
        return yt ? (yt._setPolling(e, t), void 0) : !1
      }, I = function() {
        if (gt.debugURLParam.test($t) && (gt.debugMode = !0), s(gt.debugID)) return !1;
        var e, t, n, i, o;
        if (!(!gt.debugMode || s(gt.debugID) || en && gt.useConsole && gt.consoleOnly)) {
          e = St.createElement("div"), e.id = gt.debugID + "-toggle", i = {
            position: "fixed",
            bottom: "0px",
            right: "0px",
            width: "1.2em",
            height: "1.2em",
            lineHeight: "1.2em",
            margin: "2px",
            textAlign: "center",
            border: "1px solid #999",
            cursor: "pointer",
            background: "#fff",
            color: "#333",
            zIndex: 10001
          }, e.appendChild(St.createTextNode("-")), e.onclick = U, e.title = "Toggle SM2 debug console", xt.match(/msie 6/i) && (e.style.position = "absolute", e.style.cursor = "hand");
          for (o in i) i.hasOwnProperty(o) && (e.style[o] = i[o]);
          if (t = St.createElement("div"), t.id = gt.debugID, t.style.display = gt.debugMode ? "block" : "none", gt.debugMode && !s(e.id)) {
            try {
              n = L(), n.appendChild(e)
            } catch (a) {
              throw new Error(R("domError") + " \n" + a.toString())
            }
            n.appendChild(t)
          }
        }
        n = null
      }, V = this.getSoundById, h = function(e, t) {
        return e ? gt._wD(R(e), t) : ""
      }, U = function() {
        var e = s(gt.debugID),
          t = s(gt.debugID + "-toggle");
        return e ? (kt ? (t.innerHTML = "+", e.style.display = "none") : (t.innerHTML = "-", e.style.display = "block"), kt = !kt, void 0) : !1
      }, p = function(n, i, o) {
        if (e.sm2Debugger !== t) try {
          sm2Debugger.handleEvent(n, i, o)
        } catch (a) {
          return !1
        }
        return !0
      }, z = function() {
        var e = [];
        return gt.debugMode && e.push(q.sm2Debug), gt.debugFlash && e.push(q.flashDebug), gt.useHighPerformance && e.push(q.highPerf), e.join(" ")
      }, B = function() {
        var e = R("fbHandler"),
          t = gt.getMoviePercent(),
          n = q,
          i = {
            type: "FLASHBLOCK"
          };
        return gt.html5Only ? !1 : (gt.ok() ? (gt.didFlashBlock && gt._wD(e + ": Unblocked"), gt.oMC && (gt.oMC.className = [z(), n.swfDefault, n.swfLoaded + (gt.didFlashBlock ? " " + n.swfUnblocked : "")].join(" "))) : (zt && (gt.oMC.className = z() + " " + n.swfDefault + " " + (null === t ? n.swfTimedout : n.swfError), gt._wD(e + ": " + R("fbTimeout") + (t ? " (" + R("fbLoaded") + ")" : ""))), gt.didFlashBlock = !0, w({
          type: "ontimeout",
          ignoreInit: !0,
          error: i
        }), O(i)), void 0)
      }, y = function(e, n, i) {
        Tt[e] === t && (Tt[e] = []), Tt[e].push({
          method: n,
          scope: i || null,
          fired: !1
        })
      }, w = function(e) {
        if (e || (e = {
            type: gt.ok() ? "onready" : "ontimeout"
          }), !Pt && e && !e.ignoreInit) return !1;
        if ("ontimeout" === e.type && (gt.ok() || Mt && !e.ignoreInit)) return !1;
        var t, n, i = {
            success: e && e.ignoreInit ? gt.ok() : !Mt
          },
          o = e && e.type ? Tt[e.type] || [] : [],
          a = [],
          r = [i],
          s = zt && !gt.ok();
        for (e.error && (r[0].error = e.error), t = 0, n = o.length; n > t; t++) o[t].fired !== !0 && a.push(o[t]);
        if (a.length)
          for (t = 0, n = a.length; n > t; t++) a[t].scope ? a[t].method.apply(a[t].scope, r) : a[t].method.apply(this, r), s || (a[t].fired = !0);
        return !0
      }, b = function() {
        e.setTimeout(function() {
          gt.useFlashBlock && B(), w(), "function" == typeof gt.onload && (h("onload", 1), gt.onload.apply(e), h("onloadOK", 1)), gt.waitForWindowLoad && st.add(e, "load", b)
        }, 1)
      }, ut = function() {
        if (ct !== t) return ct;
        var n, i, o, a = !1,
          r = navigator,
          s = r.plugins,
          l = e.ActiveXObject;
        if (s && s.length) i = "application/x-shockwave-flash", o = r.mimeTypes, o && o[i] && o[i].enabledPlugin && o[i].enabledPlugin.description && (a = !0);
        else if (l !== t && !xt.match(/MSAppHost/i)) {
          try {
            n = new l("ShockwaveFlash.ShockwaveFlash")
          } catch (c) {
            n = null
          }
          a = !!n, n = null
        }
        return ct = a, a
      }, et = function() {
        var e, t, n = gt.audioFormats,
          i = Xt && !!xt.match(/os (1|2|3_0|3_1)/i);
        if (i ? (gt.hasHTML5 = !1, gt.html5Only = !0, gt.oMC && (gt.oMC.style.display = "none")) : gt.useHTML5Audio && (gt.html5 && gt.html5.canPlayType || (gt._wD("SoundManager: No HTML5 Audio() support detected."), gt.hasHTML5 = !1), Zt && gt._wD(bt + "Note: Buggy HTML5 Audio in Safari on this OS X release, see https://bugs.webkit.org/show_bug.cgi?id=32159 - " + (ct ? "will use flash fallback for MP3/MP4, if available" : " would use flash fallback for MP3/MP4, but none detected."), 1)), gt.useHTML5Audio && gt.hasHTML5) {
          Z = !0;
          for (t in n) n.hasOwnProperty(t) && n[t].required && (gt.html5.canPlayType(n[t].type) ? gt.preferFlash && (gt.flash[t] || gt.flash[n[t].type]) && (e = !0) : (Z = !1, e = !0))
        }
        return gt.ignoreFlash && (e = !1, Z = !0), gt.html5Only = gt.hasHTML5 && gt.useHTML5Audio && !e, !gt.html5Only
      }, J = function(e) {
        var t, n, i, o = 0;
        if (e instanceof Array) {
          for (t = 0, n = e.length; n > t; t++)
            if (e[t] instanceof Object) {
              if (gt.canPlayMIME(e[t].type)) {
                o = t;
                break
              }
            } else if (gt.canPlayURL(e[t])) {
            o = t;
            break
          }
          e[o].url && (e[o] = e[o].url), i = e[o]
        } else i = e;
        return i
      }, G = function(e) {
        e._hasTimer || (e._hasTimer = !0, !Jt && gt.html5PollingInterval && (null === Rt && 0 === Ft && (Rt = setInterval(K, gt.html5PollingInterval)), Ft++))
      }, Q = function(e) {
        e._hasTimer && (e._hasTimer = !1, !Jt && gt.html5PollingInterval && Ft--)
      }, K = function() {
        var e;
        if (null !== Rt && !Ft) return clearInterval(Rt), Rt = null, !1;
        for (e = gt.soundIDs.length - 1; e >= 0; e--) gt.sounds[gt.soundIDs[e]].isHTML5 && gt.sounds[gt.soundIDs[e]]._hasTimer && gt.sounds[gt.soundIDs[e]]._onTimer()
      }, O = function(n) {
        n = n !== t ? n : {}, "function" == typeof gt.onerror && gt.onerror.apply(e, [{
          type: n.type !== t ? n.type : null
        }]), n.fatal !== t && n.fatal && gt.disable()
      }, dt = function() {
        if (!Zt || !ut()) return !1;
        var e, t, n = gt.audioFormats;
        for (t in n)
          if (n.hasOwnProperty(t) && ("mp3" === t || "mp4" === t) && (gt._wD(wt + ": Using flash fallback for " + t + " format"), gt.html5[t] = !1, n[t] && n[t].related))
            for (e = n[t].related.length - 1; e >= 0; e--) gt.html5[n[t].related[e]] = !1
      }, this._setSandboxType = function(e) {
        var n = gt.sandbox;
        n.type = e, n.description = n.types[n.types[e] !== t ? e : "unknown"], "localWithFile" === n.type ? (n.noRemote = !0, n.noLocal = !1, h("secNote", 2)) : "localWithNetwork" === n.type ? (n.noRemote = !1, n.noLocal = !0) : "localTrusted" === n.type && (n.noRemote = !1, n.noLocal = !1)
      }, this._externalInterfaceOK = function(e) {
        if (gt.swfLoaded) return !1;
        var t;
        return p("swf", !0), p("flashtojs", !0), gt.swfLoaded = !0, nn = !1, Zt && dt(), e && e.replace(/\+dev/i, "") === gt.versionNumber.replace(/\+dev/i, "") ? (setTimeout(u, Vt ? 100 : 1), void 0) : (t = wt + ': Fatal: JavaScript file build "' + gt.versionNumber + '" does not match Flash SWF build "' + e + '" at ' + gt.url + ". Ensure both are up-to-date.", setTimeout(function() {
          throw new Error(t)
        }, 0), !1)
      }, D = function(e, n) {
        function i() {
          var e, t = [],
            n = [],
            i = " + ";
          e = "SoundManager " + gt.version + (!gt.html5Only && gt.useHTML5Audio ? gt.hasHTML5 ? " + HTML5 audio" : ", no HTML5 audio support" : ""), gt.html5Only ? gt.html5PollingInterval && t.push("html5PollingInterval (" + gt.html5PollingInterval + "ms)") : (gt.preferFlash && t.push("preferFlash"), gt.useHighPerformance && t.push("useHighPerformance"), gt.flashPollingInterval && t.push("flashPollingInterval (" + gt.flashPollingInterval + "ms)"), gt.html5PollingInterval && t.push("html5PollingInterval (" + gt.html5PollingInterval + "ms)"), gt.wmode && t.push("wmode (" + gt.wmode + ")"), gt.debugFlash && t.push("debugFlash"), gt.useFlashBlock && t.push("flashBlock")), t.length && (n = n.concat([t.join(i)])), gt._wD(e + (n.length ? i + n.join(", ") : ""), 1), ht()
        }

        function o(e, t) {
          return '<param name="' + e + '" value="' + t + '" />'
        }
        if (Ct && Et) return !1;
        if (gt.html5Only) return S(), i(), gt.oMC = s(gt.movieID), u(), Ct = !0, Et = !0, !1;
        var a, r, l, c, d, p, h, f, m = n || gt.url,
          g = gt.altURL || m,
          v = "JS/Flash audio component (SoundManager 2)",
          y = L(),
          w = z(),
          b = null,
          _ = St.getElementsByTagName("html")[0];
        if (b = _ && _.dir && _.dir.match(/rtl/i), e = e === t ? gt.id : e, S(), gt.url = F(cn ? m : g), n = gt.url, gt.wmode = !gt.wmode && gt.useHighPerformance ? "transparent" : gt.wmode, null !== gt.wmode && (xt.match(/msie 8/i) || !Vt && !gt.useHighPerformance) && navigator.platform.match(/win32|win64/i) && (Bt.push(k.spcWmode), gt.wmode = null), a = {
            name: e,
            id: e,
            src: n,
            quality: "high",
            allowScriptAccess: gt.allowScriptAccess,
            bgcolor: gt.bgColor,
            pluginspage: un + "www.macromedia.com/go/getflashplayer",
            title: v,
            type: "application/x-shockwave-flash",
            wmode: gt.wmode,
            hasPriority: "true"
          }, gt.debugFlash && (a.FlashVars = "debug=1"), gt.wmode || delete a.wmode, Vt) r = St.createElement("div"), c = ['<object id="' + e + '" data="' + n + '" type="' + a.type + '" title="' + a.title + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="' + un + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0">', o("movie", n), o("AllowScriptAccess", gt.allowScriptAccess), o("quality", a.quality), gt.wmode ? o("wmode", gt.wmode) : "", o("bgcolor", gt.bgColor), o("hasPriority", "true"), gt.debugFlash ? o("FlashVars", a.FlashVars) : "", "</object>"].join("");
        else {
          r = St.createElement("embed");
          for (l in a) a.hasOwnProperty(l) && r.setAttribute(l, a[l])
        }
        if (I(), w = z(), y = L())
          if (gt.oMC = s(gt.movieID) || St.createElement("div"), gt.oMC.id) f = gt.oMC.className, gt.oMC.className = (f ? f + " " : q.swfDefault) + (w ? " " + w : ""), gt.oMC.appendChild(r), Vt && (d = gt.oMC.appendChild(St.createElement("div")), d.className = q.swfBox, d.innerHTML = c), Et = !0;
          else {
            if (gt.oMC.id = gt.movieID, gt.oMC.className = q.swfDefault + " " + w, p = null, d = null, gt.useFlashBlock || (gt.useHighPerformance ? p = {
                position: "fixed",
                width: "8px",
                height: "8px",
                bottom: "0px",
                left: "0px",
                overflow: "hidden"
              } : (p = {
                position: "absolute",
                width: "6px",
                height: "6px",
                top: "-9999px",
                left: "-9999px"
              }, b && (p.left = Math.abs(parseInt(p.left, 10)) + "px"))), Gt && (gt.oMC.style.zIndex = 1e4), !gt.debugFlash)
              for (h in p) p.hasOwnProperty(h) && (gt.oMC.style[h] = p[h]);
            try {
              Vt || gt.oMC.appendChild(r), y.appendChild(gt.oMC), Vt && (d = gt.oMC.appendChild(St.createElement("div")), d.className = q.swfBox, d.innerHTML = c), Et = !0
            } catch (x) {
              throw new Error(R("domError") + " \n" + x.toString())
            }
          }
        return Ct = !0, i(), !0
      }, C = function() {
        return gt.html5Only ? (D(), !1) : yt ? !1 : gt.url ? (yt = gt.getMovie(gt.id), yt || (Nt ? (Vt ? gt.oMC.innerHTML = It : gt.oMC.appendChild(Nt), Nt = null, Ct = !0) : D(gt.id, gt.url), yt = gt.getMovie(gt.id)), "function" == typeof gt.oninitmovie && setTimeout(gt.oninitmovie, 1), ft(), !0) : (h("noURL"), !1)
      }, _ = function() {
        setTimeout(x, 1e3)
      }, $ = function() {
        e.setTimeout(function() {
          Y(bt + "useFlashBlock is false, 100% HTML5 mode is possible. Rebooting with preferFlash: false..."), gt.setup({
            preferFlash: !1
          }).reboot(), gt.didFlashBlock = !0, gt.beginDelayedInit()
        }, 1)
      }, x = function() {
        var t, n = !1;
        return gt.url ? At ? !1 : (At = !0, st.remove(e, "load", _), ct && nn && !tn ? (h("waitFocus"), !1) : (Pt || (t = gt.getMoviePercent(), t > 0 && 100 > t && (n = !0)), setTimeout(function() {
          return t = gt.getMoviePercent(), n ? (At = !1, gt._wD(R("waitSWF")), e.setTimeout(_, 1), !1) : (Pt || (gt._wD(wt + ": No Flash response within expected time. Likely causes: " + (0 === t ? "SWF load failed, " : "") + "Flash blocked or JS-Flash security error." + (gt.debugFlash ? " " + R("checkSWF") : ""), 2), !cn && t && (h("localFail", 2), gt.debugFlash || h("tryDebug", 2)), 0 === t && gt._wD(R("swf404", gt.url), 1), p("flashtojs", !1, " (Check flash security or flash blockers)")), !Pt && on && (null === t ? gt.useFlashBlock || 0 === gt.flashLoadTimeout ? (gt.useFlashBlock && B(), h("waitForever")) : !gt.useFlashBlock && Z ? $() : (h("waitForever"), w({
            type: "ontimeout",
            ignoreInit: !0,
            error: {
              type: "INIT_FLASHBLOCK"
            }
          })) : 0 === gt.flashLoadTimeout ? h("waitForever") : !gt.useFlashBlock && Z ? $() : j(!0)), void 0)
        }, gt.flashLoadTimeout), void 0)) : !1
      }, T = function() {
        function t() {
          st.remove(e, "focus", T)
        }
        return tn || !nn ? (t(), !0) : (on = !0, tn = !0, h("gotFocus"), At = !1, _(), t(), !0)
      }, ft = function() {
        Bt.length && (gt._wD("SoundManager 2: " + Bt.join(" "), 1), Bt = [])
      }, ht = function() {
        ft();
        var e, t = [];
        if (gt.useHTML5Audio && gt.hasHTML5) {
          for (e in gt.audioFormats) gt.audioFormats.hasOwnProperty(e) && t.push(e + " = " + gt.html5[e] + (!gt.html5[e] && zt && gt.flash[e] ? " (using flash)" : gt.preferFlash && gt.flash[e] && zt ? " (preferring flash)" : gt.html5[e] ? "" : " (" + (gt.audioFormats[e].required ? "required, " : "") + "and no flash support)"));
          gt._wD("SoundManager 2 HTML5 support: " + t.join(", "), 1)
        }
      }, f = function(t) {
        if (Pt) return !1;
        if (gt.html5Only) return h("sm2Loaded"), Pt = !0, b(), p("onload", !0), !0;
        var n, i = gt.useFlashBlock && gt.flashLoadTimeout && !gt.getMoviePercent(),
          o = !0;
        return i || (Pt = !0), n = {
          type: !ct && zt ? "NO_FLASH" : "INIT_TIMEOUT"
        }, gt._wD("SoundManager 2 " + (Mt ? "failed to load" : "loaded") + " (" + (Mt ? "Flash security/load error" : "OK") + ")", Mt ? 2 : 1), Mt || t ? (gt.useFlashBlock && gt.oMC && (gt.oMC.className = z() + " " + (null === gt.getMoviePercent() ? q.swfTimedout : q.swfError)), w({
          type: "ontimeout",
          error: n,
          ignoreInit: !0
        }), p("onload", !1), O(n), o = !1) : p("onload", !0), Mt || (gt.waitForWindowLoad && !Ht ? (h("waitOnload"), st.add(e, "load", b)) : (gt.waitForWindowLoad && Ht && h("docLoaded"), b())), o
      }, c = function() {
        var e, n = gt.setupOptions;
        for (e in n) n.hasOwnProperty(e) && (gt[e] === t ? gt[e] = n[e] : gt[e] !== n[e] && (gt.setupOptions[e] = gt[e]))
      }, u = function() {
        function t() {
          st.remove(e, "load", gt.beginDelayedInit)
        }
        if (Pt) return h("didInit"), !1;
        if (gt.html5Only) return Pt || (t(), gt.enabled = !0, f()), !0;
        C();
        try {
          yt._externalInterfaceTest(!1), N(!0, gt.flashPollingInterval || (gt.useHighPerformance ? 10 : 50)), gt.debugMode || yt._disableDebug(), gt.enabled = !0, p("jstoflash", !0), gt.html5Only || st.add(e, "unload", l)
        } catch (n) {
          return gt._wD("js/flash exception: " + n.toString()), p("jstoflash", !1), O({
            type: "JS_TO_FLASH_EXCEPTION",
            fatal: !0
          }), j(!0), f(), !1
        }
        return f(), t(), !0
      }, P = function() {
        return H ? !1 : (H = !0, c(), I(), function() {
          var e = "sm2-usehtml5audio=",
            t = "sm2-preferflash=",
            n = null,
            i = null,
            o = $t.toLowerCase(); - 1 !== o.indexOf(e) && (n = "1" === o.charAt(o.indexOf(e) + e.length), en && console.log((n ? "Enabling " : "Disabling ") + "useHTML5Audio via URL parameter"), gt.setup({
            useHTML5Audio: n
          })), -1 !== o.indexOf(t) && (i = "1" === o.charAt(o.indexOf(t) + t.length), en && console.log((i ? "Enabling " : "Disabling ") + "preferFlash via URL parameter"), gt.setup({
            preferFlash: i
          }))
        }(), !ct && gt.hasHTML5 && (gt._wD("SoundManager 2: No Flash detected" + (gt.useHTML5Audio ? ". Trying HTML5-only mode." : ", enabling HTML5."), 1), gt.setup({
          useHTML5Audio: !0,
          preferFlash: !1
        })), rt(), !ct && zt && (Bt.push(k.needFlash), gt.setup({
          flashLoadTimeout: 1
        })), St.removeEventListener && St.removeEventListener("DOMContentLoaded", P, !1), C(), !0)
      }, at = function() {
        return "complete" === St.readyState && (P(), St.detachEvent("onreadystatechange", at)), !0
      }, M = function() {
        Ht = !0, st.remove(e, "load", M)
      }, E = function() {
        Jt && ((!gt.setupOptions.useHTML5Audio || gt.setupOptions.preferFlash) && Bt.push(k.mobileUA), gt.setupOptions.useHTML5Audio = !0, gt.setupOptions.preferFlash = !1, (Xt || Yt && !xt.match(/android\s2\.3/i)) && (Bt.push(k.globalHTML5), Xt && (gt.ignoreFlash = !0), Ut = !0))
      }, E(), ut(), st.add(e, "focus", T), st.add(e, "load", _), st.add(e, "load", M), St.addEventListener ? St.addEventListener("DOMContentLoaded", P, !1) : St.attachEvent ? St.attachEvent("onreadystatechange", at) : (p("onload", !1), O({
        type: "NO_DOM2_EVENTS",
        fatal: !0
      }))
    }
    var i = null;
    void 0 !== e.SM2_DEFER && SM2_DEFER || (i = new n), e.SoundManager = n, e.soundManager = i
  }(window);
var CustomDropdown = function(e, t, n) {
    var i, o, a, r = $(window).scrollTop(),
      s = $(window).height(),
      l = $(e).outerHeight(),
      c = this,
      u = function() {
        $(t).on("click", d)
      },
      d = function() {
        if (r = $(window).scrollTop(), s = $(window).height(), $(t).find("ul li").length > 0 && ($(e).toggleClass("active"), $(t).toggleClass("open"), $(t).hasClass("open") && (l = $(e).outerHeight(), a = $(t).find("ul").innerHeight(), o = a >= 250 ? 330 : a + l, $(t).height(o), i = $(t)[0].getBoundingClientRect(), i.top + o > s))) {
          var u = $(t).offset().top;
          n && (u = n(c, u)), $("html,body").animate({
            scrollTop: u
          })
        }
      };
    this.init = function() {
      u()
    }, this.destroy = function() {
      $(t).off("click", d)
    }
  },
  ErrorPage = function() {
    var e = function() {
      var e;
      e = $(window).height(), $(".error-page").height(e)
    };
    this.init = function() {
      e(), $(window).on("resize", e)
    }, $(document).ready(function() {
      e()
    })
  },
  FilterModule = function(e) {
    function t(t, i) {
      r = a ? $(".frontpage .latest_feed .latest_post").not(".advertisement").length : 0, s = 0, "all" !== $(this).attr("data-filter") ? ($('.filter_opt[data-filter="all"]').removeClass("active"), $(this).toggleClass("active")) : ($('.filter_opt[data-filter="all"]').addClass("active"), $(".filter_opt").not('[data-filter="all"]').removeClass("active")), 0 == $(".filter_opt.active").length && $('.filter_opt[data-filter="all"]').addClass("active");
      var o = $(".filter_opt.active");
      l = [], $.each(o, function(e, t) {
        l.push($(t).attr("data-filter"))
      }), $(e.target_container).fadeOut(200, function() {
        $(e.target_container).empty()
      }), $(e.load_more_btn).hide(), 0 === $(".loading_icon").length && $(e.load_more_btn).before('<div class="loading_icon"></div>');
      var c = {
        offset: r,
        filters: l
      };
      a && (c.above_fold_count = $(".frontpage .latest_feed .latest_post").not(".advertisement").length);
      var u = 1;
      i > 0 && (u = i), n(c, u)
    }

    function n(t, n) {
      void 0 == n && (n = 1), t.count = n * e.count + 1, $.ajax({
        url: e.endpoint,
        data: t,
        type: "GET",
        success: function(t) {
          if (a) t.length > e.count ? (t.splice(e.count, 1), i.hasNextPage = !0) : i.hasNextPage = !1, e.callback(t);
          else {
            var o = $("<div></div>").append(t),
              r = o.find(".row").filter(function() {
                return 0 === $(".advertisement", this).length
              }).length;
            i.hasNextPage = r > n * e.count, i.hasNextPage === !0 && o.find(".row:last").remove(), setTimeout(function() {
              $(e.target_container).append(o.html()), mediaManager.initPage()
            }, 1e3), void 0 !== e.callback && e.callback()
          }
          s += n
        },
        error: function() {}
      })
    }
    var i = this,
      o = $(".main").attr("data-page-type"),
      a = "home" === o ? !0 : !1,
      r = 0,
      s = 0,
      l = [];
    this.hasNextPage = null, this.refresh = function() {
      t(null, s)
    }, this.loadMore = function() {
      r = a ? $(".frontpage .latest_feed .latest_post").length + $(".featured_posts .posts .featured_post").not(".advertisement").length : $(".posts .card.vertical").not(".advertisement").length;
      var t = $(".filter_opt.active");
      l = [], $.each(t, function(e, t) {
        l.push($(t).attr("data-filter"))
      }), $(e.load_more_btn).hide(), $(e.load_more_btn).before('<div class="loading_icon"></div>');
      var i = {
        offset: r,
        filters: l
      };
      a && (i.above_fold_count = $(".frontpage .latest_feed .latest_post").not(".advertisement").length), n(i, 1)
    }, this.init = function() {
      $(".filter_opt").on("click", t), "" !== e.load_more_btn && $(e.load_more_btn).on("click", function() {
        $(this).hasClass("inactive") || i.loadMore()
      })
    }, this.destroy = function() {
      $(".filter_opt").off("click", t), "" !== e.load_more_btn && $(e.load_more_btn).off("click")
    }, this.init()
  },
  FitText = function(e) {
    var t, n, i, o, a, r, s, l, c, u = this,
      d = !1,
      p = !1,
      h = 1.15,
      f = 7,
      m = !1,
      g = prevWinW = $(window).width();
    this.fitH = e.fitH, checkFit = function() {
      o = $(e.element).css("font-size"), a = parseInt(o.replace("px", "")), r = a * h, s = $(e.element).height() / r, l = u.fitH / r, 0 > l - s ? (n = "decrease", i = a - f, i >= e.minFontSize ? ($(e.element).css("font-size", i), checkFit()) : ($(".card_info .headline_wrapper").removeAttr("style"), $(".card_info p").hide())) : l - s > 2 && (n = "increase", i = a + f, i < e.maxFontSize && ($(e.element).css("font-size", i), $(".card_info p").show()))
    };
    var v = function() {
        o = $(e.element).css("font-size"), a = parseInt(o.replace("px", "")), d = !0, t = a, checkFit()
      },
      y = function() {
        m = !0, g = $(window).width(), clearTimeout(c), c = setTimeout(w, 100)
      },
      w = function() {
        p = g > prevWinW ? !0 : !1, checkFit(), prevWinW = g
      };
    v(), $(window).on("resize", y)
  },
  FlyoutModule = function() {
    var e, t, n, i, o = gridIntance,
      a = $(".popular_wrapper"),
      r = $("#popular_flyout"),
      s = $("body").offset().left,
      l = this,
      c = function() {
        a.css("left", s), r.css("display", "none"), i = !1, setTimeout(function() {
          a.css("visibility", "visible")
        }, 1e3)
      },
      u = function() {
        e = $("body").width(), s = $("body").offset().left, gutter = o.getGutterWidth(), t = .66 * e, n = 2 * gutter + t, a.css("left", s), r.width(n), $(".popular_header").width(n), a.hasClass("open") ? ($(".main_content").css({
          left: n
        }), a.width(n).addClass("open"), $(".header_wrapper").width(n)) : ($(".main_content").css({
          left: 0
        }), a.width(0).removeClass("open"), $(".header_wrapper").width(0))
      },
      d = function() {
        $(".more_popular").on("click", m), $("#popular_flyout .icon_close").on("click", m), $(".main_wrapper").on("click touch", ".overlay.popular", f)
      },
      p = function() {
        $(".more_popular").off("click", m), $("#popular_flyout .icon_close").off("click", m), $(".main_wrapper").off("click touch", ".overlay.popular", f)
      },
      h = this.open = function() {
        r.css("display", "block"), $("html, body").css("overflow", "hidden"), a.width(n).addClass("open"), $(".header_wrapper").width(n), $(".main_content").css({
          left: n
        }), $(".overlay").addClass("popular").fadeIn("fast"), i = !0
      },
      f = this.close = function() {
        $("html, body").css("overflow", "auto"), a.width(0).removeClass("open"), $(".header_wrapper").width(0), $(".main_content").css({
          left: 0,
          position: "relative"
        }), $(".overlay").removeClass("popular").fadeOut("fast"), setTimeout(function() {
          r.css("display", "none")
        }, 500), i = !1
      },
      m = function() {
        $(window).scrollTop(), a.hasClass("open") ? f() : h()
      };
    this.init = function() {
      u(), c(), d(), $(window).on("resize", u)
    }, this.destroy = function() {
      p()
    }, $(window).load(function() {
      l.init()
    })
  },
  FullscreenSlideshowModule = function() {
    function e() {
      $("body").removeAttr("style"), $(".main_content").css({
        "z-index": 1
      }), $(".fullscreen_wrapper").fadeOut(500, function() {
        $(".fullscreen_slideshow_wrapper").empty()
      })
    }

    function t() {
      var e = $(".fullscreen_wrapper").find(".flexslider.fullscreen_flex");
      e.length > 0 && r(e)
    }
    var n, i = [],
      o = [],
      a = [],
      r = function(e) {
        var t, i = [],
          r = $(e).find(".slides li");
        $.each(r, function(e, n) {
          $(n).hasClass("clone") || (t = $(n).find(".flex-caption").outerHeight(), i.push(t))
        }), i = i.sort(function(e, t) {
          return t - e
        });
        var s = $(".fullscreen_slideshow_wrapper").width(),
          l = $(".fullscreen_slideshow_wrapper").height();
        $(e).css({
          maxWidth: s,
          maxHeight: l
        }), $(e).find(".img_wrapper").css({
          height: l - i[0]
        }), $(".fullscreen_slideshow_control a").css({
          height: l - i[0]
        }), n = $(".fullscreen_slideshow_wrapper").innerWidth() / $(".fullscreen_slideshow_wrapper").innerHeight(), $.each(o, function(e, t) {
          a[e] >= n ? $(t).hasClass("fit_h") && $(t).removeClass("fit_h").addClass("fit_w") : $(t).hasClass("fit_w") && $(t).removeClass("fit_w").addClass("fit_h")
        }), $(".fullscreen_slideshow_wrapper .progress").css({
          bottom: i[0] - 30
        })
      },
      s = function() {
        var e = $(this).parent(),
          t = document.createElement("div");
        t.className = "flexslider fullscreen_flex";
        var n = document.createElement("ul");
        n.className = "slides";
        var s = $(e).find(".slides li");
        $.each(s, function(e, t) {
          if (!$(t).hasClass("clone")) {
            var i = $(t).children().clone(),
              o = document.createElement("li");
            $(o).append(i), $(n).append(o)
          }
        }), $(t).append(n), $(".fullscreen_slideshow_wrapper").append(t), void 0 !== r && r(t), $(".fullscreen_slideshow_wrapper").append('<ul class="fullscreen_slideshow_control"></ul><div class="progress"><span class="fullscreen_current_slide">1</span> / <span class="fullscreen_total_slides">1</span></div>'), $(".fullscreen_wrapper").fadeIn(500), $(".flexslider.fullscreen_flex").flexslider({
          animation: "slide",
          controlsContainer: ".fullscreen_slideshow_control",
          controlNav: !1,
          slideshow: !1,
          prevText: "",
          nextText: "",
          keyboard: !0,
          multipleKeyboard: !0,
          video: !0,
          start: function(e) {
            $(".flexslider.fullscreen_flex").addClass("initialized"), $(".fullscreen_slideshow_control .flex-prev").addClass("gutter_left"), $(".fullscreen_slideshow_control .flex-next").addClass("gutter_right"), $(".fullscreen_slideshow_wrapper").fadeIn(function() {
              $(".main_content").css({
                "z-index": 1e4
              }), $("body").css({
                overflow: "hidden"
              })
            }), $(".fullscreen_wrapper").find(".progress").length > 0 && $(".fullscreen_total_slides").text(e.count), i = $(t).find(".slides li img"), o = [], a = [], $.each(i, function(e, t) {
              var n = t.naturalWidth,
                i = t.naturalHeight,
                r = n / i;
              o.push($(t).parent().parent()[0]), a.push(r), r > 1 ? ($(t).parent().parent().addClass("fit_w horizontal"), $(t).addClass("fit_w horizontal")) : 1 > r ? ($(t).parent().parent().addClass("fit_h vertical"), $(t).addClass("fit_h vertical")) : ($(t).parent().parent().addClass("fit_h square"), $(t).addClass("fit_h square"))
            }), r(t)
          },
          after: function(e) {
            $(".fullscreen_wrapper").find(".progress").length > 0 && $(".fullscreen_current_slide").text(e.currentSlide + 1)
          }
        })
      };
    this.init = function() {
      $(".fullscreen").on("click", s), $(".fullscreen_wrapper .close").on("click", e), $(window).on("resize", t)
    }, this.destroy = function() {
      $(".fullscreen").off("click", s), $(".fullscreen_wrapper .close").off("click", e), $(window).off("resize", t)
    }, this.init()
  },
  gridModule = function() {
    function e() {
      var e = n.getGutterWidth();
      n.setGutterStyle(e)
    }
    var t = $(window).width(),
      n = this;
    this.getGutterWidth = function() {
      var e;
      return t = $(window).width(), e = 768 > t ? t * (1 / 16) : 1024 > t ? t * (1 / 24) : 1440 > t ? t * (1 / 32) : 45, Math.round(e)
    }, this.setGutterStyle = function(e) {
      $.stylesheet(".gutter_left", "padding-left", e + "px"), $.stylesheet(".gutter_right", "padding-right", e + "px"), $.stylesheet(".gutter_top", "padding-top", e + "px"), $.stylesheet(".gutter_btm", "padding-bottom", e + "px"), $.stylesheet(".gutter_all", "padding", e + "px"), $.stylesheet(".half_gutter_left", "padding-left", Math.round(e / 2) + "px"), $.stylesheet(".half_gutter_right", "padding-right", Math.round(e / 2) + "px"), $.stylesheet(".double_gutter_left", "padding-left", 2 * e + "px"), $.stylesheet(".double_gutter_right", "padding-right", 2 * e + "px");
      var n = t >= 768 ? 3 * e : e;
      $.stylesheet(".triple_gutter_left", "padding-left", n + "px"), $.stylesheet(".triple_gutter_right", "padding-right", n + "px"), $.stylesheet(".two_thirds", "padding-right", 320 + e + "px"), $.stylesheet(".two_thirds_gutter", "padding-right", 320 + 2 * e + "px"), $.stylesheet(".vertical.even", "padding-right", Math.round(e / 2) + "px"), $.stylesheet(".vertical.odd", "padding-left", Math.round(e / 2) + "px"), $.stylesheet(".gutter_all_margin", "margin", e + "px"), $.stylesheet(".gutter_left_margin", "margin-left", e + "px"), $.stylesheet(".gutter_right_margin", "margin-right", e + "px")
    }, e(), $(window).on("resize", e)
  },
  imageModule = function() {
    this.landscape = function(e, t) {
      return e > t ? !0 : !1
    }
  },
  MediaManager = function() {
    var e;
    this.init = function() {}, this.pauseNonRadioMedia = function() {
      !faderRadio.isPlaying() && e.currentTrack && e.currentTrack.pause(), $(window).trigger("video:pause")
    }, this.pauseAllAudioMedia = function() {
      e.currentTrack && e.currentTrack.pause()
    }, this.initPage = function() {
      e ? e.registerPlayers(".soundplayer") : e = new SoundPlayerManager(".soundplayer"), e.bindUIEvents()
    }, this.init()
  },
  navModule = function(e) {
    var t, n, i, o = !1,
      a = "",
      r = !1,
      s = !1,
      l = !1,
      c = !1,
      u = !1,
      d = !1,
      p = !1,
      h = $(".main_nav").height(),
      f = $(".hamburger_wrap"),
      m = $(document).scrollTop();
    e = e;
    var g = new CustomDropdown(".more_states_btn", ".states_dropdown"),
      v = function() {
        $(".ui_control").on("click", function(e) {
          e.preventDefault();
          var t = $(this).attr("ui-toggle");
          $(".ui_control_element"), y(t), w(t)
        })
      },
      y = function(e) {
        var t = $(".ui_control_element");
        $.each(t, function(t, n) {
          var i = $(n).attr("ui-toggle");
          (void 0 == e || i != e) && w(i, !0)
        })
      },
      w = function(e, t) {
        switch (e) {
          case "collapsedSearch":
            A(t);
            break;
          case "followOverlay":
            nt(t);
            break;
          case "tabletMenu":
            j(t);
            break;
          case "mobileMenu":
            U(t);
            break;
          case "popularFlyout":
            $(".popular_wrapper").hasClass("open") && H();
            break;
          case "faderRadio":
            L(t)
        }
      },
      b = function() {
        function c(e) {
          o && (e ? ($(".war_story").height(n - h), $(".war_story .cover_media").css("background-image", "url(" + a + ")"), $(".cover_info_wrapper").fadeTo(1, 1)) : ($(".war_story").removeAttr("style"), $(".war_story .cover_media").removeAttr("style")))
        }

        function u(e) {
          f.add(".links_wrap").attr("ui-toggle", e)
        }

        function d() {
          $("nav").addClass("mobile"), $("nav").removeClass("tablet"), r = !0, s = !1, x(), u("mobileMenu"), Z(), W(), c()
        }

        function m() {
          $("nav").addClass("tablet"), $("nav").removeClass("mobile"), s = !0, r = !1, o || $(".main_nav").addClass("collapsed"), u("tabletMenu"), J(), X(), c()
        }

        function g() {
          $("nav").removeClass("mobile tablet"), s = !1, r = !1, u(""), J(), X(), c(), ("home" === e || "article" === e && $(".main_nav").hasClass("collapsed")) && $(".main_nav").removeClass("collapsed"), $("nav .links_wrap .links").height("").width("")
        }
        i = $(".expanded").height(), t = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, n = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight, ($(".expanded").hasClass("has_war_story") || $(".main").find(".war_story").length > 0) && (o = !0, a = $(".war_story .cover_media img").attr("src")), l && (r ? U() : s && j()), p && tt(), T(), 768 > t && !r ? (d(), G()) : t >= 768 && 1024 >= t && !s ? (m(), V()) : t > 1024 && (r || s) && g()
      },
      _ = function() {
        i = $(".expanded").height(), h = $(".main_nav").height(), r ? (x(), $(window).off("scroll", C)) : (S(), $(window).on("scroll", C))
      },
      x = function() {
        $("body").addClass("locked"), $(".main_nav").addClass("locked_nav"), $(".collapsed_search").hasClass("forceopen") && "search" === e && (A(), $(".collapsed_search").removeClass("forceopen"), $(".collapsed_search").css({
          position: "relative"
        })), c = !0
      },
      S = function() {
        $(".main_nav").removeClass("locked_nav"), $("body").removeClass("locked"), $(".main_content").css("margin-top", 0), $(".collapsed_search").hasClass("forceopen") || "search" !== e || (A(), $(".collapsed_search").addClass("forceopen"), $(".collapsed_search").css({
          position: "relative"
        })), c = !1
      },
      T = function() {
        p = !1, $("body").removeClass("overflow"), $(".main_content").off("touchmove"), $(".overlay").removeClass("follow").stop(!0, !0).fadeOut("fast")
      },
      k = function(e) {
        $("body").addClass("overflow"), $(".main_content").on("touchmove", function(e) {
          e.preventDefault()
        }), void 0 !== e && $(".overlay").addClass(e), $(".overlay").stop(!0, !0).fadeIn("fast")
      },
      C = function() {
        return i = $(".expanded").height(), scrollTop = $(window).scrollTop(), mainNavTop = i - scrollTop, r ? (x(), void 0) : (0 > mainNavTop && !c && (x(), $(".collapsed_search").removeClass("unlocked"), Modernizr.touch || ($(".article_cards .scrollable_wrapper").addClass("locked"), $(".article_cards .scrollable_wrapper").animate({}))), mainNavTop > 0 && c && (S(), $(".collapsed_search").addClass("unlocked"), Modernizr.touch || ($(".article_cards .scrollable_wrapper").removeClass("locked"), $(".article_cards .scrollable_wrapper").animate({
          scrollTop: 0
        }))), void 0)
      },
      E = function() {
        if ($(".main_content").find(".first_position.non_mobile").length > 0) {
          var e = $(".first_position.non_mobile .pinned_post .headline_wrapper");
          headlineOffset = e.offset().top, cardInfoHeight = $(".first_position.non_mobile .pinned_post .card_info").height(), infoBottom = headlineOffset + cardInfoHeight - 37, headlineOffset + 60 > n && ($(".first_position.non_mobile .pinned_post .bottom").css({
            "vertical-align": "top",
            height: "100%",
            position: "relative",
            top: "0"
          }), P(infoBottom))
        }
      },
      P = function(e) {
        var t = $(".first_position.non_mobile .pinned_post .bottom"),
          i = t.height(),
          o = $(".first_position.non_mobile .pinned_post .card_info").innerHeight(),
          a = i - o;
        $(window).on("scroll", function() {
          var i = e - n,
            o = m - i;
          m = $(document).scrollTop(), o >= 0 && a > o ? t.css({
            top: o,
            "vertical-align": "top"
          }) : 0 > o && a > o ? t.css({
            "vertical-align": "top",
            top: "0"
          }) : o > 0 && o >= a && t.css({
            "vertical-align": "bottom",
            top: "0"
          })
        })
      },
      M = function() {
        var e = $(window).scrollTop(),
          t = i - e,
          o = $(".war_story .cover_info_wrapper"),
          a = $(".has_war_story .header_wrap"),
          s = 1;
        if (a.css({
            position: "fixed",
            top: 0
          }), t > n) o.css({
          position: "fixed"
        }).fadeTo(1, 1);
        else {
          var l = i / 2;
          s = (l - $(window).scrollTop()) / l, window.innerWidth <= 1024 && (s = 1), o.css({
            position: "absolute"
          }).fadeTo(1, s)
        }
        0 > t && !c && x(), t > 0 && c && !r && S()
      },
      H = function() {
        $.each(pageInstances, function(e, t) {
          t instanceof FlyoutModule && t.close()
        })
      },
      L = function(e) {
        faderRadio && faderRadio instanceof FaderRadio && (r && !e && (F(), $(".hamburger_wrap").addClass("radio")), faderRadio.toggle(e, r), $("html, body").off("touchmove", z), $("html, body").off("touchend", q))
      };
    $(".radio_wrap").on("click", function() {
      !$("#fader_radio").hasClass("open") && $(".collapsed_search").hasClass("forceopen") && (A(), $(".collapsed_search").removeClass("forceopen"))
    });
    var D = function() {
        function t() {
          $("#search_form input, #search_form_small input").val("")
        }
        $("#search_form input").focus(t), "search" !== e && $("#search_form_small input").focus(t)
      },
      O = function() {
        $(".expanded .search_wrap").on("click touch tap", function() {
          u ? u && ($(this).removeClass("active"), $(".expanded .logo").removeClass("search"), $(".expanded #search_form").removeClass("open"), $(".expanded #search_form input").blur(), $(".expanded .current_issue_link").show(), u = !1, d = !1) : (d = !0, $(this).addClass("active"), $(".expanded .logo").addClass("search"), $(".expanded #search_form").addClass("open"), $(".expanded .current_issue_link").hide(), $(".expanded #search_form input").on("focus", function() {
            setTimeout(function() {
              d = !1
            }, 500)
          }), $(".expanded #search_form input").focus(), u = !0)
        }), $("#search_form input").blur(function() {
          $(".expanded .logo").removeClass("search"), $(".expanded #search_form").removeClass("open"), $(".expanded .search_wrap").removeClass("active")
        })
      },
      N = function() {
        var e = $(".collapsed_search");
        $(".main_nav .search_wrap").on("click touch tap", function() {}), $("#search_form_small input").on("focus", function() {
          $(".collapsed_search .enter_to_search").show(), $(".collapsed_search .results").hide(), Modernizr.touch && setTimeout(function() {
            $(document).scrollTop(m)
          }, 0)
        }), $("#search_form_small input").on("blur", function() {
          $(".collapsed_search .enter_to_search").hide(), $(".collapsed_search .results").show()
        }), $(window).on("scroll", function() {
          Modernizr.touch && !I || e.hasClass("forceopen") || !u || (A(), d || ($(".expanded #search_form input").blur(), u = !1))
        })
      },
      I = !0,
      A = function(e) {
        if ($cSearch = $(".collapsed_search"), !$cSearch.hasClass("forceopen"))
          if (u || e) $cSearch.removeClass("open"), $(".main_nav .search_wrap").removeClass("active"), $("#search_form_small input").blur(), u = !1;
          else {
            void 0 !== $(".collapsed_search").attr("style") && $(".collapsed_search").removeAttr("style"), $cSearch.addClass("open"), 1 == $(".search_results_page ").length ? $(".main_nav .search_wrap").addClass("search_active") : $(".main_nav .search_wrap").addClass("active"), $("#search_form_small input").focus();
            var t = $("#search_form_small input").val().length;
            $(".collapsed_search input")[0].setSelectionRange(t, t), u = !0, Modernizr.touch && (I = !1, setTimeout(function() {
              I = !0
            }, 1e3))
          }
      },
      j = function(e) {
        (!e || l) && (l = !l, links_width = $(".links_wrap").width(), $(".main_nav .links_wrap .links").width(links_width), $(".links_wrap").toggleClass("open"))
      },
      F = function() {
        $(".hamburger_wrap").addClass("open"), $("nav.mobile .nav_inner_wrap").addClass("mobile"), $(".main_content").addClass("shift"), B = $(window).scrollTop(), $("html, body").on("touchmove", z), $("html, body").on("touchend", q), k()
      },
      R = function() {
        $(".hamburger_wrap").removeClass("open"), $("nav.mobile .nav_inner_wrap").removeClass("mobile"), $(".main_content").removeClass("shift"), $(".mobile_nav_wrapper li.accordion").removeClass("open"), $("#searchinput_small").blur(), $("html, body").off("touchmove", z), $("html, body").off("touchend", q), T()
      },
      B = 0,
      z = function(e) {
        var t = e.target;
        return $(t).is(".mobile_nav_wrapper") || 0 != $(t).parents(".mobile_nav_wrapper").length || $(t).is("#fader_radio") || 0 != $(t).parents("#fader_radio").length ? void 0 : (e.preventDefault(), !1)
      },
      q = function(e) {
        return B != $(window).scrollTop() ? (e.preventDefault(), e.stopPropagation(), setTimeout(function() {
          $(window).scrollTop() > 0 && $(window).scrollTop(B)
        }, 50), !1) : void 0
      },
      U = function(e) {
        function n() {
          l = !0, $(".mobile_nav_wrapper").animate({
            width: t - 40
          }, 200), F()
        }

        function i() {
          l = !1, $(".mobile_nav_wrapper").animate({
            width: 0
          }, 200), R()
        }
        if (!e || l) return faderRadio && faderRadio instanceof FaderRadio && $(".hamburger_wrap").hasClass("radio") ? ($(".hamburger_wrap").removeClass("radio"), i(), void 0) : (l ? i() : n(), void 0)
      },
      W = function() {
        $(".mobile_nav_wrapper li.accordion").on("click", Y)
      },
      X = function() {
        $(".mobile_nav_wrapper li.accordion").off("click", Y)
      },
      Y = function(e) {
        var t = e.target;
        return $(t).is("a") && !$(t).hasClass("active") ? !0 : ($(this).hasClass("follow_mobile") && !$(this).hasClass("open") && $(".mobile_nav_wrapper .links").animate({
          scrollTop: $(this).offset().top - h
        }), $(this).toggleClass("open"), !1)
      },
      V = function() {
        var e;
        e = $(".links_wrap").width(), $(".main_nav .links_wrap .links").width(e)
      },
      G = function() {
        var e = t - 40;
        $(".mobile_nav_wrapper .links_wrapper").width(e), $("#searchinput_small").focus(function() {
          $(this).val(""), setTimeout(function() {
            $(document).scrollTop(m)
          }, 0)
        }), o && ($(".war_story").height(n - h), $(".war_story .cover_media").css("background-image", "url(" + a + ")"))
      },
      Q = function() {
        o && ($(".expanded").removeClass("has_war_story"), $(".war_story").hide())
      },
      K = function() {
        $(".main_nav").addClass("collapsed"), o && ($(".expanded").removeClass("has_war_story"), $(".war_story").hide())
      },
      J = function() {
        $(".follow_overlay .icon_close").on("click", tt)
      },
      Z = function() {
        $(".follow_overlay .icon_close").on("click", tt)
      },
      et = function() {
        var e = $(".follow_overlay").offset().top + 290;
        !p && e - $(window).height() > $(window).scrollTop() && $("html,body").animate({
          scrollTop: $(".main_nav").offset().top
        }), s && $(".links_wrap").removeClass("open"), $("li.follow").addClass("active"), $(".follow_overlay").addClass("open"), k("follow"), p = !0
      },
      tt = function() {
        $("li.follow").removeClass("active"), $(".follow_overlay").removeClass("open"), T(), p = !1
      },
      nt = function(e) {
        e ? tt() : p ? tt() : et()
      },
      it = function() {
        var e = $("form#updates select");
        e.change(function() {
          e.css("color", "#fff")
        })
      },
      ot = function(e) {
        var t = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return t.test(e)
      };
    this.footerValidate = function() {
      var e = {
          firstname: $("#updates input.first_name"),
          lastname: $("#updates input.last_name"),
          email: $("#updates input.email"),
          state: $("#updates #state").find(".selected_state"),
          daily: $("#updates input#daily"),
          events: $("#updates input#events")
        },
        t = e.email.val();
      return ot(t) ? (e.email.css("background-color", "#444"), $.ajax({
        url: "/updates/signup",
        type: "POST",
        data: {
          firstname: e.firstname.val(),
          lastname: e.lastname.val(),
          email: e.email.val(),
          state: null !== e.state.attr("data-state-abbr") ? e.state.attr("data-state-abbr") : "",
          type: {
            daily: e.daily.prop("checked"),
            events: e.events.prop("checked")
          }
        },
        success: function(t) {
          console.log("success"), t.success ? ($("#updates input.submit").val("Thanks!").addClass("active"), setTimeout(function() {
            e.firstname.val(""), e.lastname.val(""), e.email.val(""), e.state.html("State").attr("data-state-abbr", ""), $("#updates input.submit").val("Sign Up").removeClass("active")
          }, 1500)) : console.log(t.error)
        },
        error: function(e) {
          console.log("error"), console.log(e)
        }
      })) : e.email.css("background-color", "#de4040"), !1
    };
    var at = function() {
      $(".states_dropdown ul li").on("click", function() {
        var e = $(this).text(),
          t = $(this).attr("data-state-abbr");
        $(".selected_state").html(e).attr("data-state-abbr", t), $(this).addClass("selected"), $(".states_dropdown ul li").not(this).removeClass("selected")
      })
    };
    this.destroy = function() {
      T(), S(), H(), $(".main_wrapper .overlay").on("click", y)
    }, $(window).load(function() {
      m = $(document).scrollTop(), i = $(".expanded").height(), o && r || "home" == e || "article" == e || K(), o || "home" != e || r || E(), o && !r && ("home" == e ? M() : "article" == e ? Q() : $(".collapsed_search").addClass("unlocked")), y()
    }), $(window).on("scroll", function() {
      o && "home" == e && !r ? M() : C(), s && (V(), j(!0)), m = $(this).scrollTop()
    }), $(window).on("resize", function() {
      b(), _(), M(), r ? R() : N(), o || "home" != e || r || E()
    }), $("form#updates").bind("submit", this.footerValidate), $(".main_wrapper .overlay").on("click", y), $(document).on("mobileNavCloseState", function() {
      R()
    }), $(".mobile_nav_wrapper .links li").on("click", function() {
      $(this).hasClass("accordion") || U()
    }), v(), b(), it(), r || N(), O(), "home" != e && "article" != e && $(".collapsed_search").addClass("unlocked"), D(), J(), g.init(), at(), i = $(".expanded").height()
  },
  ParallaxAdModule = function() {
    var e = this,
      t = $(window).width(),
      n = $(window).height(),
      i = !1,
      o = !1,
      a = !1,
      r = !1,
      s = $(".main_nav").height(),
      l = $(".parallax_ad");
    $.stylesheet(".parallax_ad");
    var c = function() {
        t = $(window).width(), 768 > t && !i ? i = !0 : t >= 768 && i && (i = !1), r || i || p()
      },
      u = function() {
        n = $(window).height(), ad_pos = document.querySelector(".parallax_ad").getBoundingClientRect(), ad_pos.top <= s && ad_pos.bottom > s ? (l.find(".image_wrapper").css({
          position: "fixed",
          top: s
        }), d(), l.height($(".parallax_ad .image_wrapper").height())) : (l.find(".image_wrapper").css("position", "static"), l.height("auto"))
      },
      d = function() {
        l.find(".image_wrapper").css({
          left: $("#main_wrapper").offset().left
        })
      };
    this.destroy = function() {
      $(window).off("resize", c), $(window).off("scrolled", u)
    }, this.init = function() {
      $(window).on("scroll", u), $(document).on("parallax_ad:updateLeftAnchor", d)
    };
    var p = function() {
      a = $(".main").find(".parallax_ad").length > 0 ? !0 : !1, o = $("html").hasClass("touch") ? !0 : !1, 768 > t && !i ? i = !0 : t >= 768 && i && (i = !1), !a || i || o || (ad_pos = document.querySelector(".parallax_ad").getBoundingClientRect(), e.init(), r = !0), a && o && l.height("auto")
    };
    p(), $(window).on("resize", c)
  },
  FaderRadio = function() {
    var e, t, n = $("#fader_radio"),
      i = 360,
      o = !1,
      a = function(i) {
        i || (e = $(".subfilter", n), t = $("li.genres", n), $(".filter li", n).on("click", function() {
          return void 0 !== $(this).data("filter") && s($(this).data("filter")), !1
        }), t.on("click", n, w), $(".icon_info", n).on("click", function() {
          return y($(this).parents(".soundplayer")), !1
        }), $(".close_expanded", n).on("click", function() {
          return y(), !1
        })), $(window).on("resize", g), $(".main_wrapper").on("click", ".overlay.popular", g), $("nav .radio_wrap").mouseenter(b), $("nav .nav_radio_wrap").mouseleave(_), $("nav .nav_radio_controls li").on("click", x)
      },
      r = this.isPlaying = function() {
        return $(".soundplayer.playing", n).length > 0
      },
      s = function(e) {
        y(), $.ajax({
          cache: !1,
          url: "/radio/index?filter=" + e
        }).done(function(e) {
          l(e)
        })
      },
      l = function(e) {
        var t = $(e),
          i = $(".soundplayer.playing", n);
        1 == i.length && i.detach(), n.html(t.html()), 1 == i.length && ($(".soundplayer", n).each(function() {
          return $(this).data("uid") === i.data("uid") ? ($(this).replaceWith(i), i.removeClass("detached"), i = null, !1) : void 0
        }), null !== i && c(i)), a(), mediaManager.initPage()
      },
      c = this.prepend = function(e) {
        e.addClass("detached"), e.addClass("playing"), $(".playlist", n).prepend(e)
      },
      u = (this.detach = function() {
        n.detach()
      }, this.reattach = function() {
        $("#fader_radio").replaceWith(n), a(!0)
      }, 0),
      d = !1,
      p = function(e) {
        var t = e.target;
        return $(t).is("#fader_radio") || 0 != $(t).parents("#fader_radio").length ? void 0 : (e.preventDefault(), !1)
      },
      h = function(e) {
        return u != $(window).scrollTop() ? (e.preventDefault(), e.stopPropagation(), setTimeout(function() {
          d && $(window).scrollTop() > 0 && $(window).scrollTop(u)
        }, 50), !1) : void 0
      },
      f = this.open = function(e) {
        d = e, u = $(window).scrollTop(), o = !0, _(), n.addClass("open"), setTimeout(m, 200), $("html, body").css("overflow", "hidden"), n.scrollTop(0), e || ($(".main_content").css({
          left: -i
        }), $(".overlay").addClass("popular").fadeIn("fast")), $("nav .nav_radio_wrap").addClass("active"), $(document).trigger("parallax_ad:updateLeftAnchor"), $("html, body").on("touchmove", p), $("html, body").on("touchend", h), overlay = !0
      },
      m = function() {
        var e, t;
        o && ($(".main_nav").hasClass("locked_nav") ? (t = $(window).scrollTop() + $(".main_nav").outerHeight(), e = $(window).height() - $(".main_nav").outerHeight(), d && (e = window.innerHeight - $(".main_nav").outerHeight())) : (t = "", e = $(window).height() - n.offset().top + $(window).scrollTop()), 0 == e ? setTimeout(m, 200) : n.css({
          height: e,
          top: t
        }))
      },
      g = this.close = function(e) {
        $("html, body").off("touchmove", p), $("html, body").off("touchend", h), y(), n.removeClass("open"), $("html, body").css("overflow", "auto"), e || ($(".main_content").css({
          left: 0
        }), $(".overlay").removeClass("popular").fadeOut("fast")), $("nav .nav_radio_wrap").removeClass("active"), $(document).trigger("parallax_ad:updateLeftAnchor"), overlay = !1, o = !1
      },
      v = this.isOpen = function() {
        return o
      },
      y = (this.toggle = function(e, t) {
        n.hasClass("open") ? g(t) : e || f(t)
      }, function(e) {
        $(".soundplayer", n).removeClass("expanded"), e && e.addClass("expanded")
      }),
      w = function() {
        return t.css("width", t.outerWidth()), t.toggleClass("open"), !1
      },
      b = function() {
        r() && !v() && ($("nav .main_nav").addClass("show_radio_controls"), $(".nav_radio_controls .toggle").removeClass("play"))
      },
      _ = function() {
        $("nav .main_nav").removeClass("show_radio_controls")
      },
      x = function() {
        $(this).hasClass("prev") ? ($(".nav_radio_controls .toggle").removeClass("play"), $(document).trigger("radio:prev")) : $(this).hasClass("toggle") ? ($(this).hasClass("play") ? $(document).trigger("radio:play") : $(document).trigger("radio:pause"), $(this).toggleClass("play")) : $(this).hasClass("next") && ($(".nav_radio_controls .toggle").removeClass("play"), $(document).trigger("radio:next"))
      };
    a()
  },
  rowHeight = function() {
    var e = $(window).width(),
      t = function() {
        e = $(window).width()
      };
    this.setRowHeight = function(e) {
      $("." + e + " .row").each(function() {
        var e = $(this).height();
        $(this).height(e), $(this).find(".card_info_wrapper").css({
          position: "absolute"
        })
      })
    }, this.revertRowHeight = function(e) {
      $("." + e + " .row").each(function() {
        $(this).removeAttr("style"), $(this).find(".card_info_wrapper").removeAttr("style")
      })
    }, this.destroy = function() {
      $(window).off("resize", t)
    }, this.init = function() {
      $(window).on("resize", t)
    }, this.init()
  },
  SOUNDCLOUD_CONSUMER_KEY = "eccbfafd604189ff53925c139531f776",
  TRACKUID = 1;
"undefined" != typeof soundManager && soundManager.setup({
  url: "/swf/",
  flashVersion: 9,
  useFlashBlock: !1,
  useHighPerformance: !0,
  wmode: "transparent",
  useFastPolling: !0,
  debugFlash: !1,
  debugMode: !1
}), $(document).ready(function() {
  $("#seeker").on("click", function() {
    return $(".soundplayer.current").data("player-obj").seek(.95), !1
  })
});
var slideshowModule = function(e) {
    var t = this,
      n = [],
      i = [];
    this.setFlexsliderDimensions = function(e, t) {
      if (n = $(e).find(".slides li img"), i = [], $.each(n, function(e, t) {
          var n = t.naturalWidth,
            o = t.naturalHeight;
          i.push(n / o)
        }), i = i.sort(function(e, t) {
          return e - t
        }), !$(e).hasClass("fullscreen_flex")) {
        var o = $(t).width();
        if (i[0] > 1) var a = o / i[0];
        else var a = o * i[0];
        $(e).css({
          width: o,
          minHeight: a
        }), $(e).find(".img_wrapper").css({
          height: a
        }), $(e).parent().find(".fullscreen").css({
          top: a
        }), $(e).parent().find(".progress").css({
          top: a
        }), $(e).find(".flex-direction-nav a").css({
          height: a
        })
      }
    };
    var o = function(e) {
      var a = $(e).find(".flexslider");
      n = $(a).find(".slides li img"), i = [], img_loaded = 0, $.each(n, function(e, t) {
        var n = t.naturalWidth,
          o = t.naturalHeight;
        i.push(n / o), n && img_loaded++, n / o > 1 ? ($(t).parent().parent().addClass("fit_w horizontal"), $(t).addClass("fit_w horizontal")) : 1 > n / o ? ($(t).parent().parent().addClass("fit_h vertical"), $(t).addClass("fit_h vertical")) : ($(t).parent().parent().addClass("fit_h square"), $(t).addClass("fit_h square"))
      }), img_loaded != n.length && setTimeout(function() {
        o(e)
      }, 500), i = i.sort(function(e, t) {
        return e - t
      }), t.setFlexsliderDimensions(a, e), $(a).hasClass("initialized") || $(a).flexslider({
        animation: "slide",
        controlNav: !1,
        slideshow: !1,
        prevText: "",
        nextText: "",
        video: !0,
        start: function(n) {
          $(a).addClass("initialized"), $(e).find(".total_slides").text(n.count), t.setFlexsliderDimensions(a, e);
          var i = $(window).width(),
            o = '<div class="mobile_swipe_guide"><span class="inner_wrapper"><span><span class="swipe_img"></span></span></span></div>';
          576 > i && $(a).find(".flex-active-slide .img_wrapper").prepend(o)
        },
        before: function(e) {
          0 === e.currentSlide && $(".mobile_swipe_guide").length > 0 && $(".mobile_swipe_guide").fadeOut().remove()
        },
        after: function(t) {
          $(e).find(".current_slide").text(t.currentSlide + 1), googletag.pubads().refresh()
        },
        end: function() {}
      })
    };
    o(e)
  },
  SOUNDCLOUD_CONSUMER_KEY = "eccbfafd604189ff53925c139531f776",
  TRACKUID = 1;
"undefined" != typeof soundManager && soundManager.setup({
  url: "http://d1b1v78ok49bin.cloudfront.net/soundmanager/",
  flashVersion: 9,
  useFlashBlock: !1,
  useHighPerformance: !0,
  wmode: "transparent",
  useFastPolling: !0,
  debugFlash: !1,
  debugMode: !1,
  waitForWindowLoad: !0,
  useFastPolling: !1
}), $(window).keyup(function(e) {
  83 == e.which && $(".soundplayer.current").data("player-obj").seek(.98)
});
var CardTemplate = function(e, t, n) {
    function i(e, t) {
      t = t ? t : "", $.each(e, function(e, n) {
        "object" == typeof n && n ? i(n, e + ".") : flattened_data[t + e] = n
      })
    }

    function o(e) {
      var n = e.replace(/{tag:(.*?)}/g, "$1"),
        i = new RegExp("{tmpl:if\\((.*?)\\)}([.\n\r]*?)\\{/tmpl:if}", "gmi");
      n = n.replace(i, function(e, t, n) {
        return flattened_data[t] ? n : ""
      });
      var i = new RegExp("{tmpl:include\\((.*?)\\)}", "gmi");
      return n = n.replace(i, function(e, n) {
        return new CardTemplate(n, t).rawhtml
      })
    }
    var a = this,
      r = document.getElementById(e).innerHTML;
    flattened_data = [], media_templates = {
      vcard_template: {
        img: void 0 !== t.vcard_image && "" !== t.vcard_image.src ? '<img class="photo fit_w" src="' + t.vcard_image.src + '" />' : ""
      },
      mcard_template: {
        img: void 0 !== t.mini_card_image && "" !== t.mini_card_image.src ? '<img class="photo fit_h" src="' + t.mini_card_image.src + '" />' : ""
      }
    };
    var s = function(i, o) {
        return result = "card_media" === o ? n ? new CardTemplate("mp3_" + e, t).rawhtml : media_templates[e].img : "category_lowercase" === o ? null !== t.category ? t.category.toLowerCase() : "" : flattened_data[o]
      },
      l = function() {
        var e = r;
        e = o(e), e = e.replace(/{([A-z0-9.]*)}/g, s), a.rawhtml = e, a.card = $(e)
      };
    i(t), l()
  },
  truncateModule = function() {
    var e, t, n, i, o, a = this,
      r = function(e) {
        return n = e.split(/\s/), i = n.pop(), n.join(" ")
      };
    this.truncateByHeight = function(n, i, s) {
      e = $(s).outerHeight(), t = $(s).text(), e > n && (o = r(t), $(s).html(o), e = $(s).outerHeight(), $(i).hasClass("truncated") || $(i).addClass("truncated"), a.truncateByHeight(n, i, s)), $(i).hasClass("truncated") && 0 === $(i).find(".ellipsis").length && $(s).append('<span class="ellipsis">...</span>')
    }, this.truncateByLength = function(e, t, n) {
      var i = $(n).text();
      if (i.length > e) {
        var o = i.slice(0, e);
        $(n).html(o + "...")
      }
    }
  },
  VideoPlayerModule = function(e, t) {
    var n, i, o = "",
      a = function(e) {
        $(".main").hasClass("mobile") || $("html").hasClass("touch") || e.target.playVideo(), i = e.target.id, s(e.target), "" !== o && o.fadeOut()
      },
      r = function(e) {
        if ($target_player = $("#" + e), $target_player.parent().hasClass("initialized")) $(".main").hasClass("mobile") || $("html").hasClass("touch") || (console.log("ytplayers"), console.log(t), t[e].player.playVideo()), "" !== o && o.fadeOut();
        else {
          $target_player.parent().addClass("initialized");
          var r = ($target_player.attr("data-src"), $target_player.attr("id"));
          n = new YT.Player(e, {
            height: "390",
            width: "640",
            videoId: r,
            playerVars: {
              autoplay: 0,
              showinfo: 0,
              autohide: 1
            },
            events: {
              onReady: a
            }
          }), i = e
        }
      },
      s = function(e) {
        var n = $('.image_preview[data-player="' + i + '"]');
        t[i] = {
          player_id: i,
          player: e,
          player_preview: n.length > 0 ? n : "",
          detectStateChanges: function() {
            var e = this;
            e.player.addEventListener("onStateChange", function(n) {
              switch (n.data) {
                case -1:
                  break;
                case 0:
                  break;
                case 1:
                  $.each(t, function(t, n) {
                    n.player_id !== e.player_id && n.player.pauseVideo()
                  }), "" !== e.player_preview && e.player_preview.fadeOut(), mediaManager.pauseAllAudioMedia(), e.player_preview && e.player_preview.fadeOut();
                  break;
                case 2:
                  break;
                case 3:
                  break;
                case 5:
              }
            })
          },
          destroy: function() {
            var e = this;
            e.player.stopVideo(), e.player.clearVideo()
          }
        }, t[i].detectStateChanges()
      },
      l = function() {
        var t = document.createElement("script");
        t.src = "http://www.youtube.com/iframe_api";
        var n = document.getElementsByTagName("script")[0];
        n.parentNode.insertBefore(t, n);
        var i = $(e).find(".video_wrapper .vid");
        $.each(i, function(e, t) {
          $(t).parent().parent().hasClass("clone") && $(t).removeAttr("id")
        }), ($(".main").hasClass("mobile") || $("html").hasClass("touch")) && ("undefined" == typeof YT ? window.onYouTubeIframeAPIReady = function() {
          $.each(i, function(e, t) {
            r(t.id)
          })
        } : $.each(i, function(e, t) {
          r(t.id)
        }), $(e).find(".video_wrapper .image_preview").remove())
      };
    this.destroyAll = function() {
      $.each(t, function(e, t) {
        t.destroy()
      }), t = {}, $(window).off("video:pause")
    };
    var c = function() {
      $.each(t, function(e, t) {
        var n = t.player.getPlayerState();
        (1 == n || 3 == n) && t.player.pauseVideo()
      })
    };
    $(".play_wrapper", e).on("touch click", function() {
      var e = $(this).attr("data-player");
      o = $(this).parent(), r(e);
      var t = $(window).height() / 2,
        n = $(this).innerHeight() / 2;
      $("html,body").animate({
        scrollTop: $(this).offset().top - t + n
      })
    }), $(window).on("video:pause", c), l()
  },
  warStoryModule = function() {},
  bump = 1,
  faderTrackingModule = function() {
    this.trackPageView = function(e) {
      $.post("/stats/track_page_view/" + e + "?referrer=" + document.referrer, function(e) {
        console.log(e)
      })
    }
  },
  gaTrackingModule = function() {
    var e = !0;
    this.attachReflowedPostsHandlers = function() {
      $(".featured_post .card_info_wrapper a").on("click", function(t) {
        t.target.innerText;
        var n = $(".main").data("page-type");
        e && console.log("featured post clicked: " + n), ga("send", "event", "link", "click", "featured_post", n)
      }), $(".latest_feed .latest_post a").on("click", function(t) {
        t.target.innerText;
        var n = $(".main").data("page-type");
        e && console.log("latest post clicked: " + n), ga("send", "event", "link", "click", "latest_post", n)
      })
    }, this.init = function() {
      $(document).ajaxSend(function(t, n, i) {
        if ("undefined" != typeof ga && null !== ga) {
          e && (console.log("firing google analytics ajax tracking"), console.log(i));
          var o = i.url;
          o.match(/.*latest_posts_json\?offset=0/) ? e && console.log("don't fire page views for home page initial ajax load") : o.match(/.*more_latest_posts/) ? e && console.log("don't fire page views for article page more latest posts") : o.match(/\/stats\/track_page_view.*/) ? e && console.log("don't fire page views for stats tracking") : ga("send", "pageview", i.url)
        } else e && console.log("ajax method called where no ga object present: " + i.url)
      }), $(".verticals_links a").on("click", function(t) {
        var n = t.target.innerText;
        e && console.log("main_nav clicked: " + n), ga("send", "event", "link", "click", "main_nav", n)
      }), $(".main_nav .links_wrap .links a").on("click", function(t) {
        var n = t.target.innerText;
        e && console.log("secondary_nav clicked: " + n), ga("send", "event", "link", "click", "secondary_nav", n)
      }), $(".main_nav .search_wrap").on("click", function() {
        e && console.log("search closed: "), ga("send", "event", "button", "click", "secondary_nav", "Search")
      }), $(".main_nav .radio_wrap").on("click", function() {
        e && console.log("radio opened:"), ga("send", "event", "button", "click", "secondary_nav", "Radio")
      }), $("#fader_radio .playlist .radio .expanded_info a").on("click", function() {
        e && console.log("radio item expaneded:"), ga("send", "event", "button", "click", "radio_item_expanded")
      }), $(".pinned_post .card_info_wrapper a").on("click", function(t) {
        var n = t.target.innerText;
        e && console.log("pinned post clicked: " + n), ga("send", "event", "link", "click", "pinned_post", n)
      }), $(".popular_posts .popular_post a").on("click", function(t) {
        var n = t.target.innerText;
        e && console.log("popular post clicked: " + n), ga("send", "event", "popular_post_link", "click", "popular_post_home", n)
      }), $(".popular_posts .more_popular").on("click", function() {
        e && console.log("more popular"), ga("send", "event", "button", "click", "more_popular_home")
      }), $(".filter_options li").on("click", function(t) {
        var n = t.target.innerText,
          i = $(".main").data("page-type");
        e && console.log("filter clicked: " + n + " " + i), ga("send", "event", "filter", "click", i, n)
      }), $(".card_slug a.vertical, .slug a.vertical").on("click", function(t) {
        var n = t.target.innerText;
        e && console.log("vertical slug clicked: " + n), ga("send", "event", "link", "click", "vertical_slug", n)
      }), $(".card_slug a.category, .slug a.category").on("click", function(t) {
        var n = t.target.innerText;
        e && console.log("category slug clicked: " + n), ga("send", "event", "link", "click", "category_slug", n)
      }), $(".more_stories, .load_more, .load_more_button").on("click", function() {
        var t = $(".main").data("page-type");
        e && console.log("more stories clicked: " + t), ga("send", "event", "button", "click", "load_more", t)
      }), $(".social-share-button a").on("click", function() {
        var t = $(this).data("site");
        e && console.log("social share clicked: " + t), ga("send", "event", "button", "click", "social_share", t)
      }), $(".primary_tags a").on("click", function(t) {
        var n = t.target.innerText;
        e && console.log("primary tag clicked: " + n), ga("send", "event", "link", "click", "primary_tag", n)
      }), $(".meta_tags a").on("click", function(t) {
        var n = t.target.innerText;
        e && console.log("meta tag clicked: " + n), ga("send", "event", "link", "click", "meta_tag", n)
      }), $(".recommended_post .card_info_wrapper a").on("click", function(t) {
        var n = t.target.innerText;
        e && console.log("recommended post clicked: " + n), ga("send", "event", "link", "click", "recommended_post", n)
      }), $(".popular_post_article .card_info_wrapper a").on("click", function(t) {
        var n = t.target.innerText;
        e && console.log("popular post clicked: " + n), ga("send", "event", "popular_post_link", "click", "popular_post_article", n)
      }), $(".popular_link .more_popular").on("click", function() {
        e && console.log("more popular article clicked: "), ga("send", "event", "link", "click", "more_popular_link", "article")
      }), $(".highlighted_post .card_info_wrapper a").on("click", function(t) {
        t.target.innerText;
        var n = $(".main").data("page-type");
        e && console.log("highlighted post clicked: " + n), ga("send", "event", "link", "click", "highlighted_post", n)
      }), $(".event_hubs .event_hub a").on("click", function(t) {
        var n = t.target.innerText;
        e && console.log("featured event clicked: " + n), ga("send", "event", "link", "click", "featured_event")
      }), this.attachReflowedPostsHandlers()
    }, this.init()
  };
! function(e) {
  "use strict";
  e.fn.fitVids = function(t) {
    var n = {
      customSelector: null
    };
    if (!document.getElementById("fit-vids-style")) {
      var i = document.createElement("div"),
        o = document.getElementsByTagName("base")[0] || document.getElementsByTagName("script")[0];
      i.className = "fit-vids-style", i.id = "fit-vids-style", i.style.display = "none", i.innerHTML = "&shy;<style>                 .fluid-width-video-wrapper {                   width: 100%;                                position: relative;                         padding: 0;                              }                                                                                       .fluid-width-video-wrapper iframe,          .fluid-width-video-wrapper object,          .fluid-width-video-wrapper embed {             position: absolute;                         top: 0;                                     left: 0;                                    width: 100%;                                height: 100%;                            }                                         </style>", o.parentNode.insertBefore(i, o)
    }
    return t && e.extend(n, t), this.each(function() {
      var t = ["iframe[src*='player.vimeo.com']", "iframe[src*='youtube.com']", "iframe[src*='youtube-nocookie.com']", "iframe[src*='kickstarter.com'][src*='video.html']", "object", "embed"];
      n.customSelector && t.push(n.customSelector);
      var i = e(this).find(t.join(","));
      i = i.not("object object"), i.each(function() {
        var t = e(this);
        if (!("embed" === this.tagName.toLowerCase() && t.parent("object").length || t.parent(".fluid-width-video-wrapper").length)) {
          var n = "object" === this.tagName.toLowerCase() || t.attr("height") && !isNaN(parseInt(t.attr("height"), 10)) ? parseInt(t.attr("height"), 10) : t.height(),
            i = isNaN(parseInt(t.attr("width"), 10)) ? t.width() : parseInt(t.attr("width"), 10),
            o = n / i;
          if (!t.attr("id")) {
            var a = "fitvid" + Math.floor(999999 * Math.random());
            t.attr("id", a)
          }
          t.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", 100 * o + "%"), t.removeAttr("height").removeAttr("width")
        }
      })
    })
  }
}(jQuery);
var absolutePath = function(e) {
  var t = document.createElement("a");
  t.href = e;
  var n = "www.thefader.com";
  return t.protocol + "//" + n + t.pathname + t.search + t.hash
};
$(document).ready(function() {
  globalOnPageLoadCallback()
}), $(document).ready(function() {
  $("#load_page_results_ad").click(function() {
    $.get("/test_ads/load_page_results_ad", function(e) {
      $("#page_results_ad").append(e)
    })
  })
}), void 0 == window.ad_slots && (window.ad_slots = {}), void 0 == window.ad_slots_queue && (window.ad_slots_queue = {});
var articlePage = function() {
    function e() {
      g(), v(), k(), T(), S(), i && i.calc()
    }
    var t, n, i, o, a, r, s = !1,
      l = !1,
      c = !1,
      u = !1,
      d = gridIntance,
      p = $("article"),
      h = [],
      f = [],
      m = new truncateModule,
      g = function() {
        t = $(window).width(), n = $(window).height(), 768 > t && !s ? (s = !0, l = !1) : t >= 768 && 1024 > t && !l ? (l = !0, s = !1) : t >= 1024 && (s || l) && (l = !1, s = !1), $(".article article").hasClass("simple") && !c ? c = !0 : !$(".article article").hasClass("simple") && c && (c = !1), c && l || s ? p.removeClass("two_thirds_gutter") : !c || l || s || p.addClass("two_thirds_gutter")
      },
      v = function() {
        var e = $(".content_block.slideshow");
        $.each(e, function(e, t) {
          if ($(t).find(".flexslider").hasClass("initialized")) {
            var n = $(t).find(".flexslider");
            n.length > 0 && h[e].setFlexsliderDimensions(n, t)
          } else {
            var i = new slideshowModule(t);
            h.push(i)
          }
        })
      },
      y = function() {
        function e() {
          var e = $(window).scrollTop();
          0 > t - e && n - e > 0 ? o.css({
            position: "fixed",
            top: 120,
            bottom: "auto"
          }) : t - e >= 0 ? o.css({
            position: "absolute",
            top: 0,
            bottom: "auto"
          }) : 0 >= n - e && o.css({
            position: "absolute",
            bottom: 0,
            top: "auto"
          })
        }
        var t, n, i = $(".social_share_wrapper.lefthook"),
          o = $(".social_share_icons.lefthook");
        this.init = function() {
          this.calc(), console.log("article init"), window.faderTracking.trackPageView($(".article").data("article-id"))
        }, this.calc = function() {
          var a = d.getGutterWidth();
          o.width(s ? "100%" : a);
          var r = $(".content_blocks").last().innerHeight();
          n = r + $(".sub_header_block").innerHeight(), i.height(n);
          var l = i.offset().top;
          t = l - 150, n = n + t - 120, $(window).off("scroll", e), s ? (i.height("auto"), o.css({
            position: "",
            top: ""
          })) : $(window).on("scroll", e)
        }, this.destroy = function() {
          $(window).off("scroll", e)
        }, this.init()
      },
      w = function() {
        var e = $(".super_feature .content_blocks .content_block:last");
        e.hasClass("left_align") && $(".super_feature .meta_info_block").addClass("left"), e.hasClass("center_align") && $(".super_feature .meta_info_block").addClass("center"), e.hasClass("right_align") && $(".super_feature .meta_info_block").addClass("right")
      },
      b = function() {
        var e = $(".posts_footer .latest_post"),
          n = 110,
          i = $(".posts_footer .article_cards_wrapper").height(),
          o = Math.floor(i / n),
          a = o - e.length;
        if (3 > o && (o = 3, a = o - e.length), (s || $("article").hasClass("simple") && t > 1024) && (o = 4, a = o - e.length), a > 0) offset_num = e.length, _(offset_num, a);
        else if (0 > a) {
          a = -1 * a;
          for (var r = o; o + a > r; r++) $(e[r]).remove()
        }
      },
      _ = function(e, t) {
        u = !0, $.ajax({
          url: window.location.pathname + "/more_latest_posts",
          type: "GET",
          data: {
            offset: e,
            count: t,
            card_type: "mini cards"
          },
          success: function(e) {
            $(".article .posts_footer .latest_feed").append(e), u = !1, k()
          },
          error: function() {}
        })
      },
      x = function() {
        var e = $(".posts_footer .article_cards_wrapper"),
          t = $(".posts_footer .more_posts");
        t.hide(), t.before('<div class="loading_icon"></div>'), $.ajax({
          url: window.location.pathname + "/more_footer_posts",
          type: "GET",
          success: function(t) {
            e.append(t), e = $(".posts_footer .article_cards_wrapper"), T(), $(".posts_footer .loading_icon").remove()
          },
          error: function() {}
        })
      },
      S = function() {
        var e = imagesLoaded($("article .content_blocks"));
        e.on("done", function() {
          a || (a = new y), a.calc()
        })
      },
      T = function() {
        var e = imagesLoaded($(".post_article_cards"));
        e.on("always", function() {
          latest_feed = $(".article .posts_footer .latest_feed .latest_post"), b()
        })
      },
      k = function() {
        var e = imagesLoaded($(".posts_footer .latest_post"));
        e.on("always", function() {
          var e = $(".mini_card");
          $.each(e, function(e, t) {
            m.truncateByHeight(60, t, $(t).find("h3 span"))
          })
        })
      },
      C = function() {
        function e() {
          var e = window.scrollY - i,
            n = (t - 2 * e) / t,
            a = e >= 0 ? n : 1;
          window.innerWidth <= 1024 && (a = 1), o.css("opacity", a)
        }
        var t, i, o = $(".super_feature div.title_block");
        this.init = function() {
          this.calc(), $(document).on("scroll", e)
        }, this.calc = function() {
          var e = o.height(),
            a = o.offset().top;
          t = a + e, i = t - n
        }, this.destroy = function() {
          $(document).off("scroll", e)
        }, $("article").hasClass("super_feature") && !s && this.init()
      },
      E = function() {
        $(".posts_footer .row.post_article_cards").height(), $(".posts_footer .mono_heading").outerHeight(), $(".posts_footer").hasClass("feature")
      },
      P = function() {
        $(".legacy_post_content .content_inner_wrapper div").not(".video_wrapper .image_preview").removeAttr("style"), $(".legacy_post_content p:empty").remove()
      };
    this.init = function() {
      g(), v(), T(), k(), E(), P(), w(), $(".article .posts_footer .more_posts").on("click", x), r = new FullscreenSlideshowModule, $(".main").find(".video_wrapper").length > 0, $(window).load(function() {
        S(), $("body").find(".super_feature").length > 0 && (i = new C)
      }), $(window).on("resize", e)
    }, this.destroy = function() {
      if ($(".article .posts_footer .more_posts").off("click", x), i && i.destroy(), o && o.destroy(), a && a.destroy(), a && r.destroy(), f)
        for (var t = 0; t < f.length; t++) f[t].destroyAll();
      $(window).off("resize", e)
    }, this.init()
  },
  artistHubPage = function() {},
  CollectionsPage = function() {
    var e, t, n, i = $("html").hasClass("touch") ? !0 : !1,
      o = $(".scrollable_wrapper"),
      a = $("footer"),
      r = $(".article_preview"),
      s = $(".mini_card"),
      l = 111,
      c = 0,
      u = $(window).height(),
      d = $(".main_nav").height(),
      p = 0,
      h = 12,
      f = $(".expanded").outerHeight(),
      m = $(".right_rail .square_ad").outerHeight() + $(".right_rail .column_heading").outerHeight(),
      g = new truncateModule,
      v = function(e, t, n) {
        $.ajax({
          url: window.location.pathname + "/more_" + e,
          data: {
            offset: p,
            count: h
          },
          type: "GET",
          success: function(o) {
            setTimeout(function() {
              ("previews" === e || "mini_previews" === e && n) && ($(t).find(".load_more").before(o).show(), $(".loading_icon").remove()), "mini_previews" !== e || n || ($(t).append(o), i || b()), i || w()
            }, 1e3)
          },
          error: function() {}
        })
      },
      y = function() {
        $(".load_more").on("click", function() {
          $(this).hide(), $(".load_more").before('<div class="loading_icon"></div>'), p += h, $(this).hasClass("mobile") ? v("mini_previews", ".collection .mini_cards", !0) : (v("previews", ".article_previews .inner_wrapper", !1), v("mini_previews", ".right_rail .mini_cards", !1))
        })
      },
      w = function() {
        r = $(".article_preview"), s = $(".mini_card"), f = $(".expanded").outerHeight(), u = $(window).height(), o.height(u - d);
        var e = a[0].getBoundingClientRect().top;
        u >= e ? o.hasClass("locked") && o.removeClass("locked").addClass("absolute") : o.hasClass("absolute") && o.removeClass("absolute").addClass("locked")
      },
      b = function() {
        if (e = $(window).scrollTop(), e > 0 && f > e) {
          var i = $(".main_nav");
          i[0].getBoundingClientRect(), t = e / f * m, o.scrollTop(t)
        }
        $.each(r, function(e, t) {
          var i = $(t).outerHeight(),
            a = t.getBoundingClientRect();
          if (a.top <= d && a.bottom >= d) {
            var r = (a.top - d) / i * l;
            n = r - e * l, o.scrollTop(-n + m), $(".mini_card").removeClass("current"), $(s[e]).addClass("current"), c = e
          }
        }), w()
      },
      _ = function() {
        $(".scrollable_wrapper").on("mouseenter", function() {
          $("body").addClass("overflow"), $(this).css("overflow", "scroll")
        }), $(".scrollable_wrapper").on("mouseleave", function() {
          $("body").removeClass("overflow"), $(this).css("overflow", "hidden")
        })
      },
      x = function() {
        var e = imagesLoaded($(".mini_card"));
        e.on("always", function() {
          $.each(s, function(e, t) {
            g.truncateByHeight(60, t, $(t).find("h3 span"))
          })
        })
      },
      S = function() {
        $(".article_cards").on("click", ".mini_card a", function(e) {
          e.preventDefault();
          var t = this.hash;
          $("html,body").animate({
            scrollTop: $(t).offset().top - d
          })
        })
      },
      T = function() {
        i || (w(), b())
      };
    $(document).ready(function() {
      y(), x(), i ? $(".scrollable_wrapper").removeClass("locked").addClass("touch") : (w(), S(), _())
    }), $(window).load(function() {
      i || w()
    }), i || ($(window).on("scroll", b), $(window).on("resize", T))
  },
  eventsLandingPage = function() {
    function e() {
      setTimeout(function() {
        s(), $(".events_wrapper").fadeIn(800), $(".all_events .loading_icon").remove(), $(".all_events .load_more").show(), t.no_results && $(".all_events .load_more").addClass("inactive").text("Sorry, No More Stories")
      }, 1e3)
    }
    var t, n = $(window).width(),
      i = ($(window).height(), new gridModule),
      o = new truncateModule,
      a = {
        endpoint: "/events/more_events",
        count: 12,
        target_container: ".events_wrapper",
        load_more_btn: ".all_events .load_more",
        callback: e
      },
      r = function() {
        $(".event_hubs .flexslider").flexslider({
          animation: "slide",
          directionNav: !1,
          controlNav: !1,
          slideshow: !0,
          prevText: "",
          nextText: "",
          touch: !0,
          keyboard: !0,
          start: function() {
            $(".flexslider").addClass("initialized");
            var e = $(window).width(),
              t = '<div class="mobile_swipe_guide"><span class="inner_wrapper"><span><span class="swipe_img"></span></span></span></div>';
            768 > e && $(".event_hubs .flexslider .flex-active-slide .card_media").prepend(t)
          },
          before: function(e) {
            0 === e.currentSlide && $(".mobile_swipe_guide").length > 0 && $(".mobile_swipe_guide").fadeOut().remove()
          }
        })
      },
      s = function() {
        all_cards = $(".card"), $.each(all_cards, function(e, t) {
          o.truncateByLength(100, t, $(t).find(".card_headline"))
        })
      },
      l = function() {
        gutter = i.getGutterWidth()
      };
    this.destroy = function() {
      t.destroy()
    }, $(document).ready(function() {
      s(), t = new FilterModule(a), !$(".main").hasClass("mobile") || n > 767 || r()
    }), $(window).on("resize", l)
  },
  eventsHubPage = function() {
    var e = function() {
      $(".main").find(".cover_video").length > 0 && $(".hub_cover .play_wrapper").on("click", function() {
        var e = this,
          t = $(this).attr("data-stream-src");
        $(".cover_video iframe").attr("src", t), setTimeout(function() {
          $(e).parent().fadeOut()
        }, 600), $(".hub_info_bar").hasClass("fixed") && $(".hub_info_bar").css({
          position: "static"
        });
        var n = $(window).height() / 2,
          i = $(".hero_media").innerHeight() / 2;
        $("html,body").animate({
          scrollTop: $(".hero_media").offset().top - n + i
        })
      })
    };
    $(document).ready(function() {
      e()
    })
  },
  FaderTVPage = function() {
    function e() {
      setTimeout(function() {
        if ($(".main").hasClass("mobile")) {
          var e = $(".card");
          e.each(function(e, t) {
            $(t).hasClass("advertisement") && ($(t).removeClass("gutter_right"), $(t).parent().removeClass("gutter_left"))
          })
        } else s.reflowRows(!0);
        h(), $(".more_tv_wrapper .posts").fadeIn(800), $(".below_fold .loading_icon").remove(), $(".below_fold .load_more").show(), i.hasNextPage || $(".more_stories").addClass("inactive").text("Sorry, No More Stories")
      }, 1e3)
    }
    var t, n, i, o = ($(window).width(), new gridModule),
      a = o.getGutterWidth(),
      r = {},
      s = new FluidRows(".more_tv_wrapper"),
      l = new truncateModule;
    $(".more_tv_wrapper").data("posts-per-page");
    var c = $(".more_tv_wrapper .posts").length > 0 ? ".more_tv_wrapper .posts" : ".more_tv_wrapper",
      u = {
        endpoint: "/fader-tv/more_fadertv",
        count: 11,
        target_container: c,
        load_more_btn: ".below_fold .load_more",
        callback: e
      },
      d = function() {
        var e, n = $(".flexslider");
        $(n).hasClass("initialized") || $(n).flexslider({
          animation: "slide",
          controlsContainer: ".slideshow_control",
          controlNav: !1,
          slideshow: !0,
          slideshowSpeed: 6e3,
          pauseOnHover: !0,
          prevText: "",
          nextText: "",
          video: !0,
          start: function(e) {
            t = e, $(n).addClass("initialized"), $(".video_wrapper").innerHeight();
            var i = $(window).width(),
              o = '<div class="mobile_swipe_guide"><span class="inner_wrapper"><span class="fadertv"><span class="swipe_img"></span></span></span></div>';
            768 > i && $(".featured_tv .flexslider .flex-active-slide .video_wrapper").prepend(o)
          },
          before: function(t) {
            0 === t.currentSlide && $(".mobile_swipe_guide").length > 0 && $(".mobile_swipe_guide").fadeOut().remove(), e = $('li[data-player-index="' + t.currentSlide + '"]').not("clone").attr("data-player"), void 0 !== r[e] && (r[e].player.pauseVideo(), "" !== r[e].player_preview && r[e].player_preview.fadeIn())
          },
          after: function() {}
        }), $(".play_wrapper").on("click", function() {
          t.pause(), t.manualPause = !0
        })
      },
      p = function() {
        o.setGutterStyle(a), $.stylesheet(".vertical.even_alt", "padding-right", Math.round(a / 2) + "px"), $.stylesheet(".vertical.odd_alt", "padding-left", Math.round(a / 2) + "px")
      };
    $(window).on("scroll", function() {
      document.querySelector(".video_wrapper"), vidCenter = $(".video_wrapper").innerHeight() / 2
    });
    var h = function() {
        all_cards = $(".card"), $.each(all_cards, function(e, t) {
          l.truncateByLength(100, t, $(t).find(".card_headline"))
        })
      },
      f = function() {
        vidCenter = $(".video_wrapper").innerHeight() / 2, a = o.getGutterWidth(), p(), s.reflowRows()
      };
    this.destroy = function() {
      i.destroy(), n.destroyAll()
    }, $(document).ready(function() {
      i = new FilterModule(u), d(), p(), h(), n = new VideoPlayerModule(".slideshow_wrapper", r), s.reflowRows()
    }), $(window).on("resize", f)
  },
  homePaged = function() {
    $(window).width();
    var e = new FluidRows(".featured_posts");
    $(document).ready(function() {
      e.reflowRows()
    }), $(window).on("resize", function() {
      e.reflowRows()
    })
  },
  homePage = function() {
    function e(e) {
      setTimeout(function() {
        card_feed = $(".latest_feed .mini_card").length + $(".featured_posts .card").length, (card_feed < v.length || card_feed > v.length) && (v = v.slice(0, card_feed)), total_feed = $(".latest_feed .mini_card").length + $(".featured_posts .card").length + e.length, v = v.concat(e), t(e), $featured_posts = $(".featured_posts .posts"), $featured_posts.fadeIn(800), $(".below_fold .loading_icon").remove(), $(".below_fold .more_stories").show(), N(), l.hasNextPage === !0 ? $(".below_fold .more_stories").removeClass("inactive").text("More Stories") : $(".below_fold .more_stories").addClass("inactive").text("Sorry, No More Stories"), mediaManager.initPage()
      }, 1e3)
    }

    function t(e) {
      var t, n, i = $(".main_content").width(),
        o = i > 1024 ? 3 : i >= 768 ? 2 : 1,
        a = document.createElement("div");
      a.className = "row";
      for (var r = e.length / g, s = {
          adslot: !0
        }, l = 0; r > l; l++) {
        var c = 12 * l + 2;
        e.splice(c, 0, s)
      }
      $.each(e, function(e, i) {
        if (i.adslot && i.adslot === !0) {
          var r = (new Date).getTime();
          i.id = r, t = new CardTemplate("adcard_template", i, !1).card;
          var s, l = window.location.pathname;
          s = "/" == l ? "home" : l.replace("/", "");
          var c = "fader_v3_page_results_vertical_card_" + s + "_300x250";
          t = new CardTemplate("adcard_template", i, !1).card, t.find(".square_ad #div-vertical-card-" + r).after('<script type="text/javascript">pushAdSlot("div-vertical-card-' + r + '", "' + c + '", [300, 250]); </script>')
        } else n = i.media && "mp3" === i.media.type && "soundcloud" === i.media.src_type ? !0 : !1, t = new CardTemplate("vcard_template", i, n).card;
        0 === e % o ? (a = document.createElement("div"), a.className = "row", $(".below_fold .featured_posts .posts").append(a), $(a).append(t)) : $(a).append(t)
      }), p.reflowRows(!0)
    }

    function n(e) {
      $.each(e, function(e, t) {
        var n = t.media && "mp3" === t.media.type && "soundcloud" === t.media.src_type ? !0 : !1,
          i = new CardTemplate("mcard_template", t, n).card;
        $(".latest_feed").append(i)
      }), D()
    }

    function i(e) {
      e.preventDefault(), P()
    }

    function o(e) {
      e.preventDefault(), $("html,body").animate({
        scrollTop: $(".below_fold").offset().top - $(".main_nav").height()
      })
    }

    function a() {
      location.search.indexOf("prefilter=") > -1 && (y = location.search.replace("?prefilter=", ""), "audio" !== y && "news" !== y && (y += "s"), $(".below_fold").length > 0 && ($("body").css({
        visibility: "hidden",
        "background-color": "#f3f3f3"
      }), setTimeout(function() {
        var e = ($(".parallax_ad").height(), $(".below_fold").offset().top);
        $("html,body").scrollTop(e - 65), $(".filter_opt[data-filter='" + y + "']").trigger("click"), $("body").css({
          visibility: "visible",
          "background-color": "#222"
        })
      }, 100)))
    }

    function r() {
      $(".mobile .more_stories").on("click", i), $(".frontpage .column_footer a").on("click", o), $(window).on("resize", I)
    }

    function s() {
      $(".mobile .more_stories").off("click", i), $(".frontpage .column_footer a").off("click", o), $(window).off("resize", I)
    }
    var l, c;
    new gridModule;
    var u = !0,
      d = !1,
      p = new FluidRows(".featured_posts"),
      h = new truncateModule,
      f = $(".latest_feed .mini_card").length,
      m = $(".featured_posts .card").length,
      g = 11,
      v = [],
      y = "",
      w = window.location.pathname;
    "/" == w && (w = "/home");
    var b = {
        endpoint: w + "/latest_posts_json",
        count: 11,
        target_container: ".below_fold .featured_posts .posts",
        load_more_btn: ".below_fold .more_stories",
        callback: e
      },
      _ = $(window).width(),
      x = _,
      S = !1,
      T = null,
      k = function(e, t, n, i) {
        var o = [];
        $.each($(".filter_opt.active"), function(e, t) {
          o.push($(t).attr("data-filter"))
        }), $.ajax({
          url: w + "/latest_posts_json",
          data: {
            offset: e,
            count: t,
            filters: o
          },
          type: "GET",
          success: function(t) {
            for (var o = e; t.length > 0;) v[o++] = t.shift();
            void 0 != n && void 0 != i ? n(i) : void 0 != n && n()
          },
          error: function() {}
        })
      },
      C = function(e) {
        if (f = $(".latest_feed .mini_card").length, m = $(".featured_posts .card").not(".advertisement").length, void 0 !== e && e) {
          var n = f,
            i = m > 0 ? n + m : n + g;
          if (i > v.length) {
            var o = i - v.length;
            l.hasNextPage !== !1 && k(v.length, o, C, !0)
          } else a = v.slice(n, i), $(".below_fold .featured_posts .posts").empty(), t(a)
        } else {
          var n = f + m,
            i = n + g,
            a = v.slice(n, i);
          t(a)
        }
      },
      E = function(e, t) {
        var i = e + t,
          o = v.slice(e, i);
        n(o), C(!0)
      },
      P = function() {
        var e = $(".all_posts"),
          t = ($(".pinned_post"), $(".featured_post"), $(".latest_post"), e.children().not(".advertisement").length),
          n = [],
          i = window.location.pathname,
          o = window.location.search;
        "/" == i && (i = "/home"), o.search("prefilter") > -1 && (o = o.replace("?", ""), query_arr = o.split("&"), $.each(query_arr, function(e, t) {
          qstr_arr = t.split("="), "prefilter" === qstr_arr[0] && n.push(qstr_arr[1])
        })), $.ajax({
          url: i + "/all_posts",
          data: {
            offset: t,
            filters: n
          },
          type: "GET",
          success: function(t) {
            e.append(t), D()
          },
          error: function() {}
        })
      },
      M = function() {
        console.log("adjustTopLatestFeed");
        var e = $(".frontpage .latest_feed .latest_post"),
          t = $(".featured_posts .card"),
          n = H(),
          i = n - e.length;
        if (3 > n && (n = 3, i = n - e.length), i > 0) offset_num = e.length, E(offset_num, i);
        else if (0 > i) {
          i = -1 * i;
          for (var o = n; n + i > o; o++) $(e[o]).remove();
          C(!0)
        }
        var a = e.length + t.length;
        l.hasNextPage === !1 && a < v.length && (l.hasNextPage = !0, $(".below_fold .more_stories").removeClass("inactive").text("More Stories"))
      },
      H = function() {
        var e = $(".pinned_posts"),
          t = 110,
          n = e.height(),
          i = $(".frontpage .latest_feed").position().top,
          o = $(".column_footer").outerHeight(),
          a = 290;
        return count_possible = Math.floor((n - (i + o + a)) / t)
      },
      L = function() {
        var e = imagesLoaded($(".pinned_posts"));
        e.on("always", function() {
          M(), $(".main_content").find(".first_position.non_mobile").length > 0 && O()
        })
      },
      D = function() {
        var e = imagesLoaded($(".latest_post"));
        e.on("always", function() {
          var e = $(".mini_card");
          $.each(e, function(e, t) {
            h.truncateByHeight(60, t, $(t).find("h3 span"))
          })
        })
      },
      O = function() {
        var e = $(".first_position.non_mobile .pinned_post.horizontal"),
          t = e.find(".card_media img"),
          n = t.height(),
          i = n - e.find(".card_slug").outerHeight(),
          o = i - e.find(".card_summary").height() - 50;
        if (e.find(".card_info").css("max-height", i - i % 7), e.find(".card_info .headline_wrapper").css("max-height", o - o % 7), !d && x >= 768) {
          var a = {
            container: ".first_position.non_mobile .pinned_post.horizontal",
            element: ".first_position.non_mobile h3",
            fitH: o - o % 7,
            maxFontSize: 56,
            minFontSize: 21
          };
          $(".first_position.non_mobile h3").length > 0 && (fit_text = new FitText(a), d = !0)
        } else d && x >= 768 && (fit_text.fitH = o)
      },
      N = function() {
        var e = $(".card");
        $.each(e, function(e, t) {
          h.truncateByLength(100, t, $(t).find(".card_headline"))
        })
      },
      I = function() {
        S = !0, x = $(window).width(), clearTimeout(T), T = setTimeout(A, 100), O(), D(), p.reflowRows()
      },
      A = function() {
        _ = x, S = !1, clearTimeout(T), !$(".main").hasClass("mobile") && x > 767 && (M(), mediaManager.initPage())
      };
    this.destroy = function() {
      u = !1, s(), l && l.destroy(), c && c.destroy()
    }, this.init = function() {
      x = $(window).width(), u = !0, (!$(".main").hasClass("mobile") || x > 767) && (l = new FilterModule(b), k(0, 30, function() {
        L()
      })), a(), N(), D(), r()
    }, this.init()
  },
  hubPage = function() {
    function e() {
      setTimeout(function() {
        (!$(".main").hasClass("mobile") || a > 767) && l.reflowRows(!0), P(), $(".more_hub_posts .posts").fadeIn(800), $(".more_hub_posts .loading_icon").remove(), $(".more_hub_posts .load_more_button").show(), n.no_results && $(".more_hub_posts .load_more_button").addClass("inactive").text("Sorry, No More Stories")
      }, 1e3)
    }
    var t, n, i, o = $(".main").attr("data-page-type"),
      a = $(window).width(),
      r = (new gridModule, $(".hub_info_bar")),
      s = "authorHub" === o || "clientHub" === o ? $(".hub_top").offset().top : $(".highlights").offset().top,
      l = new FluidRows(".more_hub_posts"),
      c = $(".flexslider.fullscreen_flex"),
      u = $(".flexslider.photos"),
      d = $(".flexslider.videos"),
      p = new truncateModule,
      h = function(e, t) {
        return $(".hero_image").length > 0 ? $(".expanded").height() + $(".hero_image").height() : t
      },
      f = new CustomDropdown(".more_hub_button", ".hub_type_dropdown", h),
      m = "",
      g = !1,
      v = {},
      y = $(".main.hub").attr("data-hub-type"),
      w = $(".main.hub").attr("data-hub-name"),
      b = {
        endpoint: "/" + y + "/" + w + "/more_" + y + "_stories",
        count: 11,
        target_container: ".more_hub_posts .posts",
        load_more_btn: ".more_hub_posts .load_more_button",
        callback: e
      },
      _ = [],
      x = function() {
        t = $(window).height(), heightPlaceHolder = $(".hub_info_wrapper").height(r.innerHeight()), s = "authorHub" === o || "clientHub" === o ? $(".hub_top").offset().top : $(".highlights").offset().top
      },
      S = function() {
        var e = r.find("h1 span");
        e.height() > 100 && e.css("font-size", "35px")
      },
      T = function(e) {
        var t = $(e).find(".slides li img"),
          n = [];
        if ($.each(t, function(e, t) {
            var i = t.naturalWidth,
              o = t.naturalHeight;
            n.push(i / o), i / o > 1 ? ($(t).parent().parent().addClass("fit_w horizontal"), $(t).addClass("fit_w horizontal")) : 1 > i / o ? ($(t).parent().parent().addClass("fit_h vertical"), $(t).addClass("fit_h vertical")) : ($(t).parent().parent().addClass("fit_h square"), $(t).addClass("fit_h square"))
          }), n = n.sort(function(e, t) {
            return e - t
          }), !$(e).hasClass("fullscreen_flex")) {
          var i = $(".hub_gallery .slideshow_wrapper").width();
          if (n[0] > 1) var o = i / n[0];
          else var o = i * n[0];
          $(e).css({
            width: i,
            minHeight: o
          }), $(".photos").find(".img_wrapper").css({
            height: o
          }), $(".photos.fullscreen").css({
            top: o
          }), $(".photos.progress").css({
            top: o
          }), $(".photos_control a").css({
            height: o
          })
        }
      },
      k = function() {
        T(u), T(c), $(u).hasClass("initialized") || $(u).flexslider({
          animation: "slide",
          controlsContainer: ".photos_control",
          controlNav: !1,
          slideshow: !1,
          prevText: "",
          nextText: "",
          start: function(e) {
            $(u).addClass("initialized"), $(".photos_gallery").find(".total_slides").text(e.count), T(u), a = $(window).width();
            var t = '<div class="mobile_swipe_guide"><span class="inner_wrapper"><span><span class="swipe_img"></span></span></span></div>';
            576 > a && $(u).find(".flex-active-slide .img_wrapper").prepend(t)
          },
          before: function(e) {
            0 === e.currentSlide && $(".mobile_swipe_guide").length > 0 && $(".mobile_swipe_guide").fadeOut().remove()
          },
          after: function(e) {
            $(".photos_gallery").find(".current_slide").text(e.currentSlide + 1)
          },
          end: function() {}
        })
      },
      C = function() {
        $(d).hasClass("initialized") || $(d).flexslider({
          animation: "slide",
          controlsContainer: ".videos_control",
          controlNav: !1,
          slideshow: !1,
          prevText: "",
          nextText: "",
          video: !0,
          start: function(e) {
            var t = .5625 * $(".videos_gallery").width();
            $(d).addClass("initialized"), $(".videos_gallery").find(".progress").css({
              top: t
            }), $(".videos_gallery").find(".total_slides").text(e.count)
          },
          before: function(e) {
            prev_player = "video_" + e.currentSlide, void 0 !== v[prev_player] && (v[prev_player].pauseVideo(), $(".videos_gallery").find(".image_preview[data-player=" + prev_player + "]").fadeIn())
          },
          after: function(e) {
            $(".videos_gallery").find(".current_slide").text(e.currentSlide + 1)
          },
          end: function() {}
        })
      },
      E = function() {
        $(".slideshow_opt").on("click", function() {
          var e = $(this).attr("data-gallery");
          m !== e && ("videos" === m && $.each(v, function(e, t) {
            t.pauseVideo(), $(".videos_gallery").find(".image_preview").fadeIn()
          }), clearTimeout(i), m = e, $(this).addClass("active"), $(".slideshow_opt").not(this).removeClass("active"), $(".gallery").fadeOut(), g || ($(".all_slideshows_wrapper").append('<div class="loading_icon dark_bg"></div>'), g = !0), i = setTimeout(function() {
            $(".all_slideshows_wrapper .loading_icon").remove(), $("." + e + "_gallery").fadeIn(), $(".gallery").not("." + e + "_gallery").hide(), "videos" !== e || $(d).hasClass("initialized") ? "photos" === e && T(u) : (C(), _.push(new VideoPlayerModule(".videos_gallery", v))), g = !1, clearTimeout(i)
          }, 1e3))
        })
      },
      P = function() {
        all_cards = $(".card"), $.each(all_cards, function(e, t) {
          p.truncateByLength(100, t, $(t).find(".card_headline"))
        })
      },
      M = function() {
        $(".hub_cover .arrow_wrapper").on("click", function() {
          $("html,body").animate({
            scrollTop: $(".expanded").height() + $(".hero_media").height()
          })
        })
      },
      H = function() {
        var e = $(".card");
        e.each(function(e, t) {
          $(t).hasClass("advertisement") && ($(t).removeClass("gutter_right"), $(t).parent().removeClass("gutter_left"))
        })
      },
      L = function() {
        if (x(), l.reflowRows(), S(), "eventHub" === o || "artistHub" === o || "photographerHub" === o)
          if ("photos" === m) T(u);
          else {
            var e = .5625 * $(".videos_gallery").width();
            $(".videos_gallery").find(".progress").css({
              top: e
            })
          }
      };
    this.destroy = function() {
      if (_)
        for (var e = 0; e < _.length; e++) _[e].destroyAll()
    }, $(document).ready(function() {
      S(), n = new FilterModule(b)
    }), $(window).on("load", function() {
      if (x(), E(), ("eventHub" === o || "artistHub" === o || "photographerHub" === o || "clientHub" === o) && ($(".all_slideshows_wrapper").find(".photos_gallery").length > 0 ? (m = "photos", k()) : $(".all_slideshows_wrapper").find(".videos_gallery").length > 0 && (m = "videos", C(), _.push(new VideoPlayerModule(".videos_gallery", v))), $("." + m + "_gallery").show(), $(".gallery").not("." + m + "_gallery").hide(), $('.slideshow_opt[data-gallery="' + m + '"]').addClass("active"), new FullscreenSlideshowModule, M()), ("eventHub" === o || "issue" === o) && f.init(), !Modernizr.touch) {
        var e = imagesLoaded($(".hero_image"));
        e.on("done", function() {
          t = $(window).height(), s = "authorHub" === o || "clientHub" === o ? $(".hub_top").offset().top : $(".highlights").offset().top
        })
      }!$(".main").hasClass("mobile") || a > 767 ? l.reflowRows() : H(), P()
    }), $(window).on("resize", L)
  },
  issueHub = function() {
    new FluidRows(".more_hub_posts"), $(".more_hub_posts .load_more_button"), window.location.pathname;
    var e = new truncateModule,
      t = function() {
        var e = $(".hub_info_bar"),
          t = e.data("color");
        $(".issue_number_big").css({
          color: t,
          "border-color": t
        })
      },
      n = function() {
        all_cards = $(".card"), $.each(all_cards, function(t, n) {
          e.truncateByLength(100, n, $(n).find(".card_headline"))
        })
      };
    $(document).ready(function() {
      n(), t()
    })
  },
  magazinePage = function() {
    $(window).width();
    var e = new FluidRows(".back_issues"),
      t = function() {
        $(".load_more_button").on("click", function(e) {
          e.preventDefault(), $(this).hasClass("inactive") || n()
        })
      },
      n = function() {
        var t = $(".magazine .card").length;
        $.ajax({
          url: "/magazine/more_issues",
          type: "GET",
          data: {
            offset: t
          },
          success: function(t) {
            "" !== t ? ($(".back_issues .posts").append(t), e.reflowRows(!0), i()) : ($(".load_more_button").addClass("inactive"), $(".load_more_button").text("Sorry, no more issues"))
          }
        })
      },
      i = function() {
        $(".magazine .card").each(function() {
          var e = $(this),
            t = e.find(".issue_number_med"),
            n = e.find(".issue_text_wrapper h2, .issue_text_wrapper h3"),
            i = e.data("color");
          t.css({
            color: i,
            "border-color": i
          }), e.hover(function() {
            n.css("color", i)
          }, function() {
            n.css("color", "#222")
          })
        })
      };
    $(document).ready(function() {
      i(), e.reflowRows(), t()
    }), $(window).on("resize", function() {
      e.reflowRows()
    })
  },
  searchPage = function() {
    function e() {
      $(".extra_search_box form").submit()
    }

    function t() {
      return $(this).hasClass("new") ? $("#search_form_small input").val("").focus() : window.history.back(), !1
    }

    function n() {
      setTimeout(function() {
        s.reflowRows(!0), c(), $(".search_results .posts").fadeIn(800), $(".search_results .loading_icon").remove(), $(".more_stories").show(), r.no_results && $(".more_stories").addClass("inactive").text("Sorry, No More Stories")
      }, 1e3)
    }

    function i() {
      $(".hub_results .hub").each(function() {
        var e = $(window).width(),
          t = e >= 768 ? $(".info", $(this)).outerWidth() - 15 : 0;
        $(".images").css("padding-right", t)
      })
    }
    var o = new truncateModule,
      a = location.search;
    "" == a && (a = "?query=" + location.pathname.substring(5).replace(/-/g, "+"));
    var r, s = new FluidRows(".search_results"),
      l = {
        endpoint: "/search/more" + a,
        count: 11,
        target_container: ".search_results .posts",
        load_more_btn: ".more_stories",
        callback: n
      };
    $(".extra_search_box .search_icon").on("click", e), $(".search_no_results a").on("click", t), $(window).on("resize", function() {
      s.reflowRows()
    }), s.reflowRows(), r = new FilterModule(l);
    var c = function() {
      all_cards = $(".card"), $.each(all_cards, function(e, t) {
        o.truncateByLength(100, t, $(t).find(".card_headline"))
      })
    };
    $(window).on("resize", i), i(), c()
  },
  StoryStreamPage = function() {
    var e, t, n, i = $(".scrollable_wrapper"),
      o = $("footer"),
      a = $(".article_preview"),
      r = $(".mini_card"),
      s = 111,
      l = 0,
      c = $(window).height(),
      u = $(".main_nav").height(),
      d = 0,
      p = 12,
      h = $(".expanded").outerHeight(),
      f = $(".right_rail .square_ad").outerHeight() + $(".right_rail .column_heading").outerHeight(),
      m = new truncateModule,
      g = function(e, t) {
        $.ajax({
          url: window.location.pathname + "/more_" + e,
          data: {
            offset: d,
            count: p
          },
          type: "GET",
          success: function(n) {
            setTimeout(function() {
              "previews" === e && ($(".load_more").before(n).show(), $(".article_previews").find(".loading_icon").remove()), "mini_previews" === e && ($(t).append(n), w()), y()
            }, 1e3)
          },
          error: function() {}
        })
      },
      v = function() {
        $(".load_more").on("click", function() {
          $(this).hide(), $(".load_more").before('<div class="loading_icon"></div>'), d += p, g("previews", ".article_previews .inner_wrapper"), g("mini_previews", ".right_rail .mini_cards")
        })
      },
      y = function() {
        a = $(".article_preview"), r = $(".mini_card"), h = $(".expanded").outerHeight(), c = $(window).height(), i.height(c - u);
        var e = o[0].getBoundingClientRect().top;
        c >= e ? i.hasClass("locked") && i.removeClass("locked").addClass("absolute") : i.hasClass("absolute") && i.removeClass("absolute").addClass("locked")
      },
      w = function() {
        if (e = $(window).scrollTop(), e > 0 && h > e) {
          var o = $(".main_nav");
          o[0].getBoundingClientRect(), t = e / h * f, i.scrollTop(t)
        }
        $.each(a, function(e, t) {
          var o = $(t).outerHeight(),
            a = t.getBoundingClientRect();
          if (a.top <= u && a.bottom >= u) {
            var c = (a.top - u) / o * s;
            n = c - e * s, i.scrollTop(-n + f), $(".mini_card").removeClass("current"), $(r[e]).addClass("current"), l = e
          }
        }), y()
      },
      b = function() {
        $(".scrollable_wrapper").on("mouseenter", function() {
          $("body").addClass("overflow"), $(this).css("overflow", "scroll")
        }), $(".scrollable_wrapper").on("mouseleave", function() {
          $("body").removeClass("overflow"), $(this).css("overflow", "hidden")
        })
      },
      _ = function() {
        var e = imagesLoaded($(".mini_card"));
        e.on("always", function() {
          $.each(r, function(e, t) {
            m.truncateByHeight(60, t, $(t).find("h3 span"))
          })
        })
      },
      x = function() {
        $(".article_cards .mini_card a").on("click", function(e) {
          e.preventDefault();
          var t = this.hash;
          $("html,body").animate({
            scrollTop: $(t).offset().top - u
          })
        })
      },
      S = function() {
        y(), w()
      };
    $(document).ready(function() {
      y(), v(), _(), x(), b()
    }), $(window).load(function() {
      y()
    }), $(window).on("scroll", w), $(window).on("resize", S)
  },
  tagPage = function() {
    function e() {
      setTimeout(function() {
        n > 767 && (console.log("reflowing rows on tag page"), o.reflowRows(!0)), r(), $(".tag_results .posts").fadeIn(800), $(".tag_results .loading_icon").remove(), $(".more_stories").show(), t.no_results && $(".more_stories").addClass("inactive").text("Sorry, No More Stories")
      }, 1e3)
    }
    var t, n = $(window).width();
    window.location.pathname.replace("/tag/", "");
    var i = new truncateModule,
      o = new FluidRows(".tag_results"),
      a = {
        endpoint: window.location + "/more",
        count: 11,
        target_container: ".tag_results .posts",
        load_more_btn: ".more_stories",
        callback: e
      },
      r = function() {
        all_cards = $(".card"), $.each(all_cards, function(e, t) {
          i.truncateByLength(100, t, $(t).find(".card_headline"))
        })
      };
    $(window).on("resize", function() {
      o.reflowRows()
    }), t = new FilterModule(a), r(), (!$(".main").hasClass("mobile") || n > 767) && o.reflowRows()
  },
  navmodule, pageInstances, gridIntance, mediaManager, faderRadio, gaTracking, faderTracking, ajaxURLs = ["local.fader.com", "ec2-54-204-135-104.compute-1.amazonaws.com", "localhost:4000", "localhost:3000", "thefader-v3.herokuapp.com", "thefader-v3-staging.herokuapp.com", "thefader.com", "www.thefader.com", "192.168.1.9"],
  enableAjaxNav = allowAjaxOnUrl(top.location.href),
  pageInit = function() {
    console.log("pageInit"), globalOnPageLoadCallback();
    var e = $(".main").attr("data-page-type");
    switch (gridIntance = new gridModule, navmodule = new navModule(e), gaTracking = new gaTrackingModule, faderTracking = new faderTrackingModule, mediaManager || (mediaManager = new MediaManager), mediaManager.initPage(), ajaxNavClickHandler(), searchFormSubmitHandler(), e) {
      case "home":
        pageInstances = [new homePage, new FlyoutModule];
        break;
      case "home-paged":
        pageInstances = [new homePaged, new FlyoutModule];
        break;
      case "search":
        pageInstances = [new searchPage];
        break;
      case "tag":
        pageInstances = [new tagPage];
        break;
      case "article":
        pageInstances = [new articlePage, new FlyoutModule];
        break;
      case "events":
        pageInstances = [new eventsLandingPage];
        break;
      case "eventHub":
        pageInstances = [new hubPage, new eventsHubPage];
        break;
      case "magazine":
        pageInstances = [new magazinePage];
        break;
      case "issue":
        pageInstances = [new hubPage, new issueHub];
        break;
      case "fadertv":
        pageInstances = [new FaderTVPage, new FlyoutModule];
        break;
      case "artistHub":
      case "authorHub":
      case "photographerHub":
      case "clientHub":
        pageInstances = [new hubPage];
        break;
      case "collections":
        pageInstances = [new CollectionsPage];
        break;
      case "errorPage":
        pageInstances = [new ErrorPage];
        break;
      default:
        pageInstances = []
    }
  },
  pageDestroy = function() {
    for (var e = 0; e < pageInstances.length; e++) pageInstances[e].destroy && pageInstances[e].destroy();
    navmodule.destroy()
  },
  scrollTopAfterPageInject = !1,
  historyContents = [],
  historyIndex = 1,
  historyPushDomContent = function() {
    historyContents[historyIndex] = $("#main_wrapper").html(), historyIndex++
  },
  historyPopDomContent = function(e) {
    return historyIndex = e, historyContents[e]
  },
  ajaxNavClickHandler = function() {
    enableAjaxNav && $("body").on("click", "a", function(e) {
      var t = $(this).attr("href");
      t.match(/^[\/\?]/) && (e.preventDefault(), navigateToNewPage(t))
    })
  },
  navigateToNewPage = function(e) {
    scrollTopAfterPageInject = !0, historyPushDomContent(), History.pushState({
      i: historyIndex
    }, null, e)
  },
  searchFormSubmitHandler = function() {
    enableAjaxNav && $('form[data-search="true"]').on("submit", function(e) {
      var t = $(this).attr("action");
      return t += "?query=", t += $('input[name="query"]', this).val(), navigateToNewPage(t), e.preventDefault(), !1
    })
  },
  bindHistoryStateChange = function() {
    History.replaceState({
      i: historyIndex
    }, null, top.location.url), History.Adapter.bind(window, "statechange", historyStateChangeCB)
  },
  historyStateChangeCB = function() {
    var e = History.getState(),
      t = e.url,
      n = e.hash;
    allowAjaxOnUrl(t) && (e.data.i < historyIndex ? (injectNewPage(historyPopDomContent(e.data.i)), googletag.pubads().refresh()) : getPage(n))
  },
  getPage = function(e) {
    pageDestroy(), $.ajax({
      cache: !0,
      type: "GET",
      url: e
    }).done(function(t) {
      injectNewPage(t, e)
    })
  },
  injectNewPage = function(e) {
    mediaManager.pauseNonRadioMedia(), faderRadio.close(), faderRadio.detach(), $(document).add("*").off(), $(window).off("resize"), $(window).off("scroll"), $(window).off("load"), $("#main_wrapper").html(e), scrollTopAfterPageInject && ($("html,body").scrollTop(0), document.body.scrollTop = document.documentElement.scrollTop = 0, scrollTopAfterPageInject = !1), faderRadio.reattach(), faderRadio.close(), pageInit(), setTimeout(function() {
      $(window).trigger("load")
    }, 500)
  };
$(document).ready(function() {
  bindHistoryStateChange(), pageInit(), faderRadio = new FaderRadio
});