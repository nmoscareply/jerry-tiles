/* Jerry the Berry - tiles renderer v1
   Usage in the artifact:
   <div id="jerry"></div>
   <script>window.JERRY={...}</script>
   <script src="https://<host>/jerry-tiles.js"></script>
*/
(function () {
  "use strict";

  var TOPICS = {
    ai: ["\ud83e\udde0", "AI & Machine Learning"],
    data: ["\ud83d\udcca", "Data & Analytics"],
    cloud: ["\u2601\ufe0f", "Cloud Computing"],
    sec: ["\ud83d\udd10", "Cybersecurity"],
    swe: ["\u2699\ufe0f", "Software Engineering"],
    ux: ["\ud83d\udc7e", "Design & UX"],
    prod: ["\ud83d\udce6", "Product Management"],
    proj: ["\ud83d\uddc2\ufe0f", "Project Management"],
    lead: ["\ud83e\udded", "Leadership"],
    biz: ["\u265f\ufe0f", "Business Strategy"],
    inno: ["\ud83d\ude80", "Innovation & Entrepreneurship"],
    fin: ["\ud83c\udfe6", "Finance & Fintech"],
    soft: ["\ud83d\udcac", "Soft Skills"]
  };
  var TOPIC_ORDER = Object.keys(TOPICS);

  var CLUSTERS = {
    conf: { e: "\ud83c\udfa4", n: "Conferences", bg: "linear-gradient(135deg,#FF1A71,#322A7F)", kind: "event" },
    att: { e: "\ud83d\udcdc", n: "Certificates of Attendance", bg: "#00D8B4", kind: "event" },
    course: { e: "\ud83c\udf93", n: "Online Courses", bg: "linear-gradient(135deg,#322A7F,#00D8B4)", kind: "course" },
    cert: { e: "\ud83c\udfc5", n: "Certifications", bg: "linear-gradient(135deg,#00D8B4,#EAFF26)", kind: "course" },
    soft: { e: "\ud83d\udcac", n: "Soft Skills Courses", bg: "linear-gradient(135deg,#EAFF26,#FF1A71)", kind: "course" },
    sub: { e: "\ud83d\udd04", n: "Subscriptions", bg: "linear-gradient(135deg,#322A7F,#EAFF26)", kind: "course" },
    book: { e: "\ud83d\udcda", n: "Books", bg: "#322A7F", kind: "book" }
  };
  var CLUSTER_ORDER = ["conf", "att", "course", "cert", "soft", "sub", "book"];
  var FORMATS = { online: "\ud83d\udcbb Online", presence: "\ud83d\udccd In presence", paper: "\ud83d\udcc4 Paper" };
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var NOTICE = "\ud83c\udf53 The Berries shown are indicative and refer to the conference ticket only: the final value depends on the ticket chosen (number of days, options and add-ons, early bird or standard rate). Flights and accommodation are not included in this estimate: please check with the Reply Social Network team.";

  var CSS = [
    "#jerry{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#1f2937;max-width:1100px;margin:0 auto;padding:16px}",
    "#jerry *{box-sizing:border-box}",
    ".j-h1{font-size:1.6rem;font-weight:800;margin:0 0 12px}",
    ".j-bal{display:inline-block;background:#FF1A71;color:#fff;border-radius:999px;padding:10px 20px;font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.08);margin-bottom:12px}",
    ".j-notice{background:#fff1f2;border:1px solid #fecdd3;color:#be123c;font-size:.85rem;border-radius:10px;padding:10px 12px;margin-bottom:12px}",
    ".j-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}",
    ".j-chip{border:1px solid #d1d5db;background:#fff;border-radius:999px;padding:6px 14px;font-size:.85rem;cursor:pointer}",
    ".j-chip.on{background:#322A7F;color:#fff;border-color:#322A7F}",
    ".j-grid{display:grid;grid-template-columns:1fr;gap:16px}",
    "@media(min-width:640px){.j-grid{grid-template-columns:repeat(2,1fr)}}",
    "@media(min-width:960px){.j-grid{grid-template-columns:repeat(3,1fr)}}",
    ".j-grid.books{grid-template-columns:repeat(3,1fr);gap:20px}",
    "@media(min-width:640px){.j-grid.books{grid-template-columns:repeat(4,1fr)}}",
    ".j-card{background:#fff;border-radius:16px;box-shadow:0 2px 10px rgba(0,0,0,.08);overflow:hidden;display:flex;flex-direction:column;transition:transform .15s,box-shadow .15s}",
    ".j-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.12)}",
    ".j-cover{display:flex;align-items:center;justify-content:center;font-size:3rem;text-decoration:none;position:relative;overflow:hidden}",
    ".j-cover img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}",
    ".j-body{padding:12px 14px 14px;display:flex;flex-direction:column;gap:6px;flex:1}",
    ".j-title{font-weight:700;color:#111827;text-decoration:none}",
    "a.j-title:hover{text-decoration:underline}",
    ".j-meta{font-size:.85rem;color:#4b5563}",
    ".j-berries{font-size:.9rem;font-weight:600;color:#be185d}",
    ".j-tags{display:flex;flex-wrap:wrap;gap:6px}",
    ".j-pill{font-size:.75rem;background:#eef2ff;color:#322A7F;border-radius:999px;padding:3px 10px}",
    ".j-warn{font-size:.75rem;background:#f3f4f6;color:#6b7280;border-radius:999px;padding:3px 10px}",
    ".j-ask{font-size:.8rem;color:#9ca3af}",
    ".j-trip{margin-top:auto;background:#EAFF26;color:#111827;border:0;border-radius:999px;padding:9px 12px;font-weight:600;cursor:pointer}",
    ".j-trip:hover{filter:brightness(.95)}",
    ".j-book{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px}",
    ".j-bookcover{width:100%;max-width:140px;aspect-ratio:2/3;border-radius:2px 8px 8px 2px;box-shadow:0 10px 15px rgba(0,0,0,.2);position:relative;display:flex;align-items:center;justify-content:center;font-size:2.25rem;overflow:hidden;text-decoration:none}",
    ".j-bookcover img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}",
    ".j-bookcover:before{content:'';position:absolute;left:0;top:0;bottom:0;width:6px;background:rgba(0,0,0,.2);border-right:1px solid rgba(255,255,255,.6);z-index:1}",
    ".j-book .j-title{font-weight:600;font-size:.875rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}",
    ".j-author{font-size:.75rem;color:#6b7280}",
    ".j-more{margin-top:20px;background:#fff;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.06);padding:10px 14px}",
    ".j-more summary{cursor:pointer;font-weight:600}",
    ".j-row{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;padding:8px 0;border-top:1px solid #f3f4f6;font-size:.88rem}",
    ".j-row:first-of-type{border-top:0}",
    ".j-pills{margin-top:24px}",
    ".j-pills h3{font-size:1rem;margin:0 0 8px}",
    ".j-toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#111827;color:#fff;padding:10px 16px;border-radius:10px;font-size:.9rem;max-width:90vw;z-index:50;box-shadow:0 6px 18px rgba(0,0,0,.25)}",
    ".j-empty{border-radius:16px;padding:32px;color:#fff;font-weight:700;font-size:1.1rem;text-align:center;background:linear-gradient(135deg,#FF1A71,#322A7F)}"
  ].join("");

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function topicOf(it) {
    var t = TOPICS[it.tp];
    if (t) return { key: it.tp, e: t[0], n: t[1] };
    var c = CLUSTERS[it.c] || CLUSTERS.course;
    return { key: it.tp || "other", e: it.te || c.e, n: it.tp || "Other" };
  }

  function fmtDate(d) {
    var p = String(d || "").split("-");
    if (p.length !== 3) return d || "";
    return { d: +p[2], m: MONTHS[+p[1] - 1], y: p[0] };
  }

  function fmtRange(s, e) {
    var a = fmtDate(s), b = fmtDate(e);
    if (typeof a === "string") return a;
    if (typeof b === "string" || !e) return a.d + " " + a.m + " " + a.y;
    if (a.y === b.y && a.m === b.m) return a.d === b.d ? a.d + " " + a.m + " " + a.y : a.d + "\u2013" + b.d + " " + b.m + " " + b.y;
    if (a.y === b.y) return a.d + " " + a.m + " \u2013 " + b.d + " " + b.m + " " + b.y;
    return a.d + " " + a.m + " " + a.y + " \u2013 " + b.d + " " + b.m + " " + b.y;
  }

  function berriesText(it) {
    if (it.est === 2 || it.b == null) return "\ud83c\udf53 Berries to be evaluated by RSN";
    var n = Math.ceil(it.b);
    if (it.est === 1) return "\ud83c\udf53 ~" + n + " Berries (estimate)";
    if (it.c === "conf") return "\ud83c\udf53 " + n + " Berries for conference ticket";
    return "\ud83c\udf53 " + n + " Berries";
  }

  function aboveBalance(it) {
    var bal = window.JERRY.bal;
    return typeof bal === "number" && it.b != null && Math.ceil(it.b) > bal;
  }

  function linkOrSpan(it, cls, text) {
    var n;
    if (it.l) {
      n = el("a", cls, text);
      n.href = it.l;
      n.target = "_blank";
      n.rel = "noopener";
    } else {
      n = el("span", cls, text);
    }
    return n;
  }

  function cover(it, cls, height) {
    var c = CLUSTERS[it.c] || CLUSTERS.course;
    var t = topicOf(it);
    var n = linkOrSpan(it, cls, null);
    n.style.background = c.bg;
    if (height) n.style.height = height;
    n.appendChild(document.createTextNode(t.e));
    if (it.img) {
      var img = document.createElement("img");
      img.src = it.img;
      img.alt = "";
      img.loading = "lazy";
      img.onerror = function () { img.remove(); };
      n.appendChild(img);
    }
    return n;
  }

  function tags(it, extra) {
    var w = el("div", "j-tags");
    var t = topicOf(it);
    w.appendChild(el("span", "j-pill", t.e + " " + t.n));
    (extra || []).forEach(function (x) { if (x) w.appendChild(el("span", "j-pill", x)); });
    if (aboveBalance(it)) w.appendChild(el("span", "j-warn", "\u26a0\ufe0f Above your balance"));
    return w;
  }

  function noLink(body, it) {
    if (!it.l) body.appendChild(el("span", "j-ask", "\u2139\ufe0f Ask the RSN team for details"));
  }

  function toast(msg) {
    var old = document.querySelector(".j-toast");
    if (old) old.remove();
    var t = el("div", "j-toast", msg);
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 4000);
  }

  function tripButton(it) {
    var b = el("button", "j-trip", "\u2708\ufe0f Add hotel & flights");
    b.type = "button";
    b.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var txt = "Make an estimate for travel and accommodation expenses for " + it.t +
        " (" + (it.loc || "") + ", " + fmtRange(it.s, it.e) + ")";
      try { window.parent.postMessage({ type: "jerry-trip", text: txt }, "*"); } catch (e) {}
      var ok = function () { toast("\ud83d\udccb Copied! Paste it in the chat \ud83c\udf53"); };
      var ko = function () { toast(txt); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(ok, function () { fallbackCopy(txt) ? ok() : ko(); });
      } else {
        fallbackCopy(txt) ? ok() : ko();
      }
    });
    return b;
  }

  function fallbackCopy(txt) {
    try {
      var ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (e) { return false; }
  }

  function eventTile(it) {
    var card = el("div", "j-card");
    card.appendChild(cover(it, "j-cover", "160px"));
    var body = el("div", "j-body");
    body.appendChild(linkOrSpan(it, "j-title", it.t));
    if (it.loc) body.appendChild(el("div", "j-meta", "\ud83d\udccd " + it.loc));
    if (it.s) body.appendChild(el("div", "j-meta", "\ud83d\udcc5 " + fmtRange(it.s, it.e)));
    body.appendChild(el("div", "j-berries", berriesText(it)));
    body.appendChild(tags(it));
    noLink(body, it);
    if (it.c === "conf") body.appendChild(tripButton(it));
    card.appendChild(body);
    return card;
  }

  function courseTile(it) {
    var card = el("div", "j-card");
    card.appendChild(cover(it, "j-cover", "96px"));
    var body = el("div", "j-body");
    body.appendChild(linkOrSpan(it, "j-title", it.t));
    body.appendChild(el("div", "j-berries", berriesText(it)));
    body.appendChild(tags(it, [FORMATS[it.f] || FORMATS.online]));
    if (it.d && it.c !== "sub") body.appendChild(el("div", "j-meta", "\u23f1\ufe0f " + it.d));
    if (it.s) body.appendChild(el("div", "j-meta", "\ud83d\udcc5 " + fmtRange(it.s, it.e)));
    noLink(body, it);
    card.appendChild(body);
    return card;
  }

  function bookTile(it) {
    var card = el("div", "j-book");
    card.appendChild(cover(it, "j-bookcover", null));
    card.appendChild(linkOrSpan(it, "j-title", it.t));
    if (it.a) card.appendChild(el("div", "j-author", "\u270d\ufe0f " + it.a));
    card.appendChild(el("div", "j-berries", berriesText(it)));
    var t = topicOf(it);
    var w = el("div", "j-tags");
    w.style.justifyContent = "center";
    w.appendChild(el("span", "j-pill", t.e + " " + t.n));
    if (aboveBalance(it)) w.appendChild(el("span", "j-warn", "\u26a0\ufe0f Above your balance"));
    card.appendChild(w);
    noLink(card, it);
    return card;
  }

  function tile(it) {
    var kind = (CLUSTERS[it.c] || CLUSTERS.course).kind;
    if (kind === "event") return eventTile(it);
    if (kind === "book") return bookTile(it);
    return courseTile(it);
  }

  function moreRow(it) {
    var c = CLUSTERS[it.c] || CLUSTERS.course;
    var t = topicOf(it);
    var r = el("div", "j-row");
    r.appendChild(el("span", null, c.e));
    r.appendChild(linkOrSpan(it, "j-title", it.t));
    r.appendChild(el("span", "j-berries", berriesText(it)));
    r.appendChild(el("span", "j-pill", t.e + " " + t.n));
    if (it.s) r.appendChild(el("span", "j-meta", "\ud83d\udcc5 " + fmtRange(it.s, it.e)));
    return r;
  }

  function sortItems(items) {
    var idx = items.map(function (it, i) { return [it, i]; });
    idx.sort(function (A, B) {
      var a = A[0], b = B[0];
      var ca = CLUSTER_ORDER.indexOf(a.c), cb = CLUSTER_ORDER.indexOf(b.c);
      if (ca !== cb) return ca - cb;
      var ab = aboveBalance(a) ? 1 : 0, bb = aboveBalance(b) ? 1 : 0;
      if (ab !== bb) return ab - bb;
      if (a.s && b.s && a.s !== b.s) return a.s < b.s ? -1 : 1;
      return A[1] - B[1];
    });
    return idx.map(function (x) { return x[0]; });
  }

  function render() {
    var D = window.JERRY || {};
    var root = document.getElementById("jerry");
    if (!root) { root = el("div"); root.id = "jerry"; document.body.appendChild(root); }
    root.textContent = "";

    var style = el("style");
    style.textContent = CSS;
    root.appendChild(style);

    var h1 = el("h1", "j-h1", D.title || "\ud83c\udf53 Picked for you");
    root.appendChild(h1);

    if (typeof D.bal === "number") root.appendChild(el("div", "j-bal", "\ud83c\udf53 My Berries: " + Math.max(0, Math.floor(D.bal))));

    if (D.empty || !D.items || !D.items.length) {
      root.appendChild(el("div", "j-empty", "We couldn't load options right now \ud83c\udf53 \u2013 please try again in a moment!"));
      return;
    }

    var notice = el("div", "j-notice", NOTICE);
    root.appendChild(notice);
    var chipsBox = el("div", "j-chips");
    root.appendChild(chipsBox);
    var grid = el("div", "j-grid");
    root.appendChild(grid);
    var more = el("details", "j-more");
    root.appendChild(more);
    var pillsBox = el("div", "j-pills");
    root.appendChild(pillsBox);

    var valid = function (it) { return it && it.t; };
    var items = sortItems(D.items.filter(valid));
    var moreAll = sortItems((D.more || []).filter(valid)).slice(0, 12);
    var mode = D.mode === "topic" ? "topic" : "mix";
    var maxGrid = 6;

    function paint(gridItems, moreItems) {
      grid.textContent = "";
      gridItems.forEach(function (it) { grid.appendChild(tile(it)); });
      grid.className = "j-grid" + (gridItems.length && gridItems.every(function (it) { return it.c === "book"; }) ? " books" : "");
      notice.style.display = gridItems.some(function (it) { return it.c === "conf"; }) ? "" : "none";
      more.textContent = "";
      if (moreItems && moreItems.length) {
        more.style.display = "";
        more.open = false;
        more.appendChild(el("summary", null, "\ud83d\udccb More options (" + moreItems.length + ")"));
        moreItems.forEach(function (it) { more.appendChild(moreRow(it)); });
      } else {
        more.style.display = "none";
      }
    }

    if (mode === "mix") {
      var shown = items.slice(0, maxGrid);
      var extra = moreAll;
      var present = CLUSTER_ORDER.filter(function (c) { return shown.concat(extra).some(function (it) { return it.c === c; }); });
      var current = "all";
      var drawChips = function () {
        chipsBox.textContent = "";
        if (present.length < 2) { chipsBox.style.display = "none"; return; }
        ["all"].concat(present).forEach(function (c) {
          var label = c === "all" ? "All" : CLUSTERS[c].e + " " + CLUSTERS[c].n;
          var b = el("button", "j-chip" + (current === c ? " on" : ""), label);
          b.type = "button";
          b.addEventListener("click", function () {
            current = c;
            drawChips();
            var f = function (it) { return c === "all" || it.c === c; };
            paint(shown.filter(f), extra.filter(f));
          });
          chipsBox.appendChild(b);
        });
      };
      drawChips();
      paint(shown, extra);
      pillsBox.style.display = "none";
      return;
    }

    // topic mode: one cluster, current topic + "More {cluster} you may like" pills
    chipsBox.style.display = "none";
    var cluster = CLUSTERS[items[0].c] || CLUSTERS.course;
    var cur = D.cur || topicOf(items[0]).key;
    var byTopic = {};
    items.forEach(function (it) {
      var k = topicOf(it).key;
      (byTopic[k] = byTopic[k] || []).push(it);
    });
    var others = Object.keys(byTopic).filter(function (k) { return k !== cur && TOPICS[k] && k !== "soft"; });
    others.sort(function (a, b) { return TOPIC_ORDER.indexOf(a) - TOPIC_ORDER.indexOf(b); });
    others = others.slice(0, 3);

    var curItems = byTopic[cur] || items;
    paint(curItems.slice(0, maxGrid), moreAll);

    var showTopic = function (k) {
      var t = TOPICS[k];
      h1.textContent = cluster.e + " " + cluster.n + " \u2013 " + t[0] + " " + t[1];
      paint(byTopic[k].slice(0, 4), []);
      drawPills(k);
      try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { window.scrollTo(0, 0); }
    };
    var allPillTopics = [cur].concat(others);
    var drawPills = function (active) {
      pillsBox.textContent = "";
      var list = allPillTopics.filter(function (k) { return k !== active && TOPICS[k]; });
      if (!list.length || D.pills === false) { pillsBox.style.display = "none"; return; }
      pillsBox.style.display = "";
      pillsBox.appendChild(el("h3", null, "More " + cluster.n.toLowerCase() + " you may like"));
      var w = el("div", "j-chips");
      list.forEach(function (k) {
        var b = el("button", "j-chip", TOPICS[k][0] + " " + TOPICS[k][1]);
        b.type = "button";
        b.addEventListener("click", function () {
          if (k === cur) {
            h1.textContent = D.title || h1.textContent;
            paint(curItems.slice(0, maxGrid), moreAll);
            drawPills(cur);
          } else {
            showTopic(k);
          }
        });
        w.appendChild(b);
      });
      pillsBox.appendChild(w);
    };
    drawPills(cur);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
