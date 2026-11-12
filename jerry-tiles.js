/* Jerry the Berry - tiles renderer v2 (ASCII only: emoji as \uXXXX)
   Usage in the artifact:
   <div id="jerry"></div>
   <script>window.JERRY={...}</script>
   <script src="https://<host>/jerry-tiles.js"></script>
   Same data contract as v1. Inline build: jerry-tiles.min.js
*/
(() => {
  "use strict";

  const TOPICS = {
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
  const TOPIC_ORDER = Object.keys(TOPICS);

  const PINK = "#FF1A71", INDIGO = "#322A7F", TEAL = "#00D8B4", LIME = "#EAFF26";
  const grad = (a, b) => `linear-gradient(135deg,${a},${b})`;
  // lt: light cover, needs dark text
  const CLUSTERS = {
    conf: { e: "\ud83c\udfa4", n: "Conferences", bg: grad(PINK, INDIGO), kind: "event" },
    att: { e: "\ud83d\udcdc", n: "Certificates of Attendance", bg: TEAL, kind: "event", lt: 1 },
    course: { e: "\ud83c\udf93", n: "Online Courses", bg: grad(INDIGO, TEAL), kind: "course" },
    cert: { e: "\ud83c\udfc5", n: "Certifications", bg: grad(TEAL, LIME), kind: "course" },
    soft: { e: "\ud83d\udcac", n: "Soft Skills Courses", bg: grad(LIME, PINK), kind: "course" },
    sub: { e: "\ud83d\udd04", n: "Subscriptions", bg: grad(INDIGO, LIME), kind: "course" },
    book: { e: "\ud83d\udcda", n: "Books", bg: INDIGO, kind: "book" }
  };
  const CLUSTER_ORDER = Object.keys(CLUSTERS);
  const FORMATS = { online: "\ud83d\udcbb Online", presence: "\ud83d\udccd In presence", paper: "\ud83d\udcc4 Paper" };
  const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
  const NOTICE = "The Berries shown are indicative and refer to the conference ticket only: the final value depends on the ticket chosen (number of days, options and add-ons, early bird or standard rate). Flights and accommodation are not included in this estimate: please check with the Reply Social Network team.";

  const DARK = "--bg:#100e22;--cd:#1b1837;--ik:#f2f1fb;--mu:#a9a6c6;--ln:#2e2a54;--sf:#28245a;--pk:#ff6aa1";
  const CSS =
    ":root{--bg:#f5f4fb;--cd:#fff;--ik:#1b1840;--mu:#65627f;--ln:#e4e1f2;--sf:#eeecfa;--pk:#d4105c}" +
    `@media(prefers-color-scheme:dark){:root:not([data-theme=light]){${DARK}}}` +
    `:root[data-theme=dark]{${DARK}}` +
    "body{margin:0;background:var(--bg)}" +
    "#jerry{font:15px/1.4 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ik);max-width:1100px;margin:auto;padding:20px 16px 32px}" +
    "#jerry *{box-sizing:border-box}" +
    "#jerry [hidden]{display:none}" +
    "#jerry button{font:inherit;cursor:pointer}" +
    "#jerry :focus-visible{outline:2px solid #FF1A71;outline-offset:2px}" +
    ".j-hd{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 16px;margin-bottom:14px}" +
    ".j-h1{font-size:clamp(1.4rem,4vw,1.9rem);font-weight:800;letter-spacing:-.02em;line-height:1.15;margin:0}" +
    ".j-bal{background:#322A7F;color:#fff;border-radius:99px;padding:7px 16px 7px 12px;font-weight:600;white-space:nowrap}" +
    ".j-bal b{color:#EAFF26;font-size:1.1em}" +
    ".j-notice{color:var(--mu);font-size:.8rem;border-left:3px solid #FF1A71;padding:1px 0 1px 10px;margin-bottom:16px;max-width:85ch}" +
    ".j-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}" +
    ".j-chip{border:1px solid var(--ln);background:var(--cd);color:inherit;border-radius:99px;padding:6px 14px;font-size:.85rem}" +
    ".j-chip:hover{border-color:var(--mu)}" +
    ".j-chip.on{background:var(--ik);color:var(--cd);border-color:var(--ik)}" +
    ".j-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,270px),1fr));gap:16px}" +
    ".j-grid.books{grid-template-columns:repeat(auto-fill,minmax(max(96px,22%),1fr));gap:24px 16px}" +
    ".j-card{background:var(--cd);border:1px solid var(--ln);border-radius:18px;overflow:hidden;display:flex;flex-direction:column;transition:transform .15s,box-shadow .15s}" +
    ".j-card:hover{transform:translateY(-3px);box-shadow:0 14px 28px -14px rgba(50,42,127,.5)}" +
    "@media(prefers-reduced-motion:reduce){.j-card{transition:none}.j-card:hover{transform:none}}" +
    ".j-cover,.j-bookcover{position:relative;overflow:hidden;display:flex;text-decoration:none;color:#fff}" +
    ".j-cover{flex-direction:column;justify-content:flex-end;height:72px;padding:12px 14px}" +
    ".j-cover.ev{height:112px}" +
    ".j-cover.lt{color:#1b1840}" +
    ".j-cover img,.j-bookcover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}" +
    ".j-cover .j-em{position:absolute;right:4px;bottom:-.22em;font-size:4rem;line-height:1;transform:rotate(-12deg)}" +
    ".j-cover.ev .j-em{font-size:5.4rem}" +
    ".j-cover.im{color:#fff}" +
    ".j-cover.im .j-em{display:none}" +
    ".j-cover.im:after{content:'';position:absolute;inset:0;background:linear-gradient(transparent 15%,rgba(16,14,34,.78))}" +
    ".j-day,.j-mon{position:relative;z-index:1;font-weight:800;line-height:1;letter-spacing:-.03em;font-size:2.2rem}" +
    ".j-mon{font-size:.85rem;font-weight:600;letter-spacing:0;margin-top:4px}" +
    ".j-body{padding:14px;display:flex;flex-direction:column;gap:7px;flex:1}" +
    ".j-title{font-weight:700;line-height:1.25;color:inherit;text-decoration:none}" +
    "a.j-title:hover{text-decoration:underline}" +
    ".j-meta,.j-b,.j-ask,.j-author{font-size:.85rem;color:var(--mu)}" +
    ".j-b b{font-size:1.15rem;font-weight:800;color:var(--pk)}" +
    ".j-tags{display:flex;flex-wrap:wrap;gap:6px}" +
    ".j-pill,.j-warn{font-size:.75rem;border-radius:99px;padding:3px 10px;background:var(--sf)}" +
    ".j-warn{background:0;border:1px dashed var(--mu);color:var(--mu);padding:2px 9px}" +
    ".j-ask,.j-author{font-size:.78rem}" +
    ".j-trip{margin-top:auto;background:#EAFF26;color:#1b1840;border:0;border-radius:99px;padding:9px 12px;font-weight:700}" +
    ".j-trip:hover{background:#dcf000}" +
    ".j-book{display:flex;flex-direction:column;align-items:center;text-align:center;gap:5px}" +
    ".j-bookcover{width:100%;max-width:140px;aspect-ratio:2/3;border-radius:3px 9px 9px 3px;box-shadow:0 14px 20px -10px rgba(16,14,34,.55);align-items:center;justify-content:center;font-size:2.4rem;margin-bottom:6px}" +
    ".j-bookcover:before{content:'';position:absolute;left:0;top:0;bottom:0;width:6px;background:rgba(0,0,0,.22);border-right:1px solid rgba(255,255,255,.5);z-index:1}" +
    ".j-book .j-title{font-size:.875rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}" +
    ".j-book .j-tags{justify-content:center}" +
    ".j-more{margin-top:20px;background:var(--cd);border:1px solid var(--ln);border-radius:14px;padding:0 14px}" +
    ".j-more summary{cursor:pointer;font-weight:700;padding:12px 0}" +
    ".j-row{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:baseline;padding:9px 0;border-top:1px solid var(--ln);font-size:.88rem}" +
    ".j-row .j-b{margin-left:auto}" +
    ".j-row .j-b b{font-size:1em}" +
    ".j-pills{margin-top:28px}" +
    ".j-pills h3{font-size:1rem;margin:0 0 10px}" +
    ".j-toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#1b1840;color:#fff;padding:10px 16px;border-radius:12px;font-size:.9rem;max-width:90vw;z-index:50;box-shadow:0 8px 24px rgba(0,0,0,.3)}" +
    `.j-empty{border-radius:18px;padding:36px 24px;color:#fff;font-weight:700;font-size:1.1rem;text-align:center;background:${grad(PINK, INDIGO)}}`;

  let ROOT, BAL;

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const clusterOf = it => CLUSTERS[it.c] || CLUSTERS.course;

  const topicOf = it => {
    const t = TOPICS[it.tp];
    return t
      ? { key: it.tp, e: t[0], n: t[1] }
      : { key: it.tp || "other", e: it.te || clusterOf(it).e, n: it.tp || "Other" };
  };

  const parseDate = d => {
    const p = String(d || "").split("-");
    return p.length === 3 && { d: +p[2], m: MONTHS[+p[1] - 1], y: p[0] };
  };

  // "14\u201315 Nov 2026", "30 Nov \u2013 4 Dec 2026"
  const fmtRange = (s, e) => {
    const a = parseDate(s), b = e && parseDate(e);
    if (!a) return s || "";
    const one = `${a.d} ${a.m} ${a.y}`;
    if (!b) return one;
    if (a.y === b.y && a.m === b.m) return a.d === b.d ? one : `${a.d}\u2013${b.d} ${b.m} ${b.y}`;
    return (a.y === b.y ? `${a.d} ${a.m}` : one) + ` \u2013 ${b.d} ${b.m} ${b.y}`;
  };

  // Cover date: [big line, small line]
  const dateBlock = (s, e) => {
    const a = parseDate(s), b = e && parseDate(e);
    if (!a) return [s || "", ""];
    const my = `${a.m} ${a.y}`;
    if (!b || (a.y === b.y && a.m === b.m)) return [b && b.d !== a.d ? `${a.d}\u2013${b.d}` : a.d, my];
    return [a.d, (a.y === b.y ? a.m : my) + ` \u2013 ${b.d} ${b.m} ${b.y}`];
  };

  const berries = it => {
    const n = el("div", "j-b");
    if (it.est === 2 || it.b == null) n.textContent = "\ud83c\udf53 Berries to be evaluated by RSN";
    else n.append(
      "\ud83c\udf53 ",
      el("b", 0, (it.est === 1 ? "~" : "") + Math.ceil(it.b).toLocaleString("en")),
      " Berries" + (it.est === 1 ? " (estimate)" : it.c === "conf" ? " for conference ticket" : "")
    );
    return n;
  };

  const above = it => typeof BAL === "number" && it.b != null && Math.ceil(it.b) > BAL;

  const hasLink = it => /^https?:\/\//i.test(it.l || "");

  const link = (it, cls, text) => {
    const ok = hasLink(it), n = el(ok ? "a" : "span", cls, text);
    if (ok) { n.href = it.l; n.target = "_blank"; n.rel = "noopener"; }
    return n;
  };

  const cover = (it, cls) => {
    const c = clusterOf(it), n = link(it, cls + (c.lt ? " lt" : ""));
    n.style.background = `radial-gradient(circle at 100% 0,rgba(255,255,255,.3),transparent 60%),${c.bg}`;
    if (n.href) n.tabIndex = -1; // the title link is the keyboard target
    n.append(el("span", "j-em", topicOf(it).e));
    if (it.img) {
      const img = el("img");
      img.alt = "";
      img.loading = "lazy";
      img.onload = () => n.classList.add("im");
      img.onerror = () => img.remove();
      img.src = it.img;
      n.prepend(img);
    }
    return n;
  };

  const tags = (it, extra) => {
    const w = el("div", "j-tags"), t = topicOf(it);
    w.append(el("span", "j-pill", `${t.e} ${t.n}`));
    if (extra) w.append(el("span", "j-pill", extra));
    if (above(it)) w.append(el("span", "j-warn", "Above your balance"));
    return w;
  };

  const ask = (box, it) => {
    if (!hasLink(it)) box.append(el("span", "j-ask", "\u2139\ufe0f Ask the RSN team for details"));
  };

  let toastTimer;
  const toast = msg => {
    let t = ROOT.querySelector(".j-toast");
    if (!t) { t = el("div", "j-toast"); t.setAttribute("role", "status"); ROOT.append(t); }
    t.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), 4000);
  };

  const fallbackCopy = txt => {
    try {
      const ta = el("textarea");
      ta.value = txt;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (e) { return false; }
  };

  const tripButton = it => {
    const b = el("button", "j-trip", "\u2708\ufe0f Add hotel & flights");
    b.type = "button";
    b.onclick = () => {
      const txt = `Make an estimate for travel and accommodation expenses for ${it.t} (${it.loc || ""}, ${fmtRange(it.s, it.e)})`;
      try { window.parent.postMessage({ type: "jerry-trip", text: txt }, "*"); } catch (e) {}
      const done = ok => toast(ok ? "\ud83d\udccb Copied! Paste it in the chat \ud83c\udf53" : txt);
      const fb = () => done(fallbackCopy(txt));
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => done(1), fb);
      else fb();
    };
    return b;
  };

  const eventTile = it => {
    const card = el("div", "j-card"), cv = cover(it, "j-cover ev"), body = el("div", "j-body");
    if (it.s) {
      const d = dateBlock(it.s, it.e);
      cv.append(el("span", "j-day", d[0]), el("span", "j-mon", d[1]));
    }
    body.append(link(it, "j-title", it.t));
    if (it.loc) body.append(el("div", "j-meta", "\ud83d\udccd " + it.loc));
    body.append(berries(it), tags(it));
    ask(body, it);
    if (it.c === "conf") body.append(tripButton(it));
    card.append(cv, body);
    return card;
  };

  const courseTile = it => {
    const card = el("div", "j-card"), body = el("div", "j-body");
    body.append(link(it, "j-title", it.t), berries(it), tags(it, FORMATS[it.f] || FORMATS.online));
    if (it.d && it.c !== "sub") body.append(el("div", "j-meta", "\u23f1\ufe0f " + it.d));
    if (it.s) body.append(el("div", "j-meta", "\ud83d\udcc5 " + fmtRange(it.s, it.e)));
    ask(body, it);
    card.append(cover(it, "j-cover"), body);
    return card;
  };

  const bookTile = it => {
    const card = el("div", "j-book");
    card.append(cover(it, "j-bookcover"), link(it, "j-title", it.t));
    if (it.a) card.append(el("div", "j-author", it.a));
    card.append(berries(it), tags(it));
    ask(card, it);
    return card;
  };

  const TILES = { event: eventTile, course: courseTile, book: bookTile };
  const tile = it => TILES[clusterOf(it).kind](it);

  const moreRow = it => {
    const r = el("div", "j-row"), t = topicOf(it);
    r.append(clusterOf(it).e + " ", link(it, "j-title", it.t), el("span", "j-pill", `${t.e} ${t.n}`));
    if (it.s) r.append(el("span", "j-meta", fmtRange(it.s, it.e)));
    r.append(berries(it));
    return r;
  };

  // cluster order, then affordable first, then by start date, then original order
  const sortItems = items =>
    items
      .map((it, i) => [it, i])
      .sort((A, B) => {
        const a = A[0], b = B[0];
        return (
          CLUSTER_ORDER.indexOf(a.c) - CLUSTER_ORDER.indexOf(b.c) ||
          above(a) - above(b) ||
          (a.s && b.s && a.s !== b.s ? (a.s < b.s ? -1 : 1) : A[1] - B[1])
        );
      })
      .map(x => x[0]);

  const chip = (label, on, fn) => {
    const b = el("button", "j-chip" + (on ? " on" : ""), label);
    b.type = "button";
    b.setAttribute("aria-pressed", !!on);
    b.onclick = fn;
    return b;
  };

  function render() {
    const D = window.JERRY || {};
    BAL = D.bal;
    ROOT = document.getElementById("jerry");
    if (!ROOT) { ROOT = el("div"); ROOT.id = "jerry"; document.body.append(ROOT); }

    const frag = document.createDocumentFragment();
    const hd = el("div", "j-hd"), h1 = el("h1", "j-h1", D.title || "\ud83c\udf53 Picked for you");
    hd.append(h1);
    if (typeof BAL === "number") {
      const bal = el("div", "j-bal", "\ud83c\udf53 My Berries ");
      bal.append(el("b", 0, Math.max(0, Math.floor(BAL)).toLocaleString("en")));
      hd.append(bal);
    }
    frag.append(el("style", 0, CSS), hd);

    const valid = it => it && it.t;
    const items = sortItems((D.items || []).filter(valid));
    if (D.empty || !items.length) {
      frag.append(el("div", "j-empty", "We couldn't load options right now \ud83c\udf53 \u2013 please try again in a moment!"));
      ROOT.replaceChildren(frag);
      return;
    }

    const notice = el("div", "j-notice", NOTICE), chipsBox = el("div", "j-chips"), grid = el("div", "j-grid"),
      more = el("details", "j-more"), pillsBox = el("div", "j-pills");
    frag.append(notice, chipsBox, grid, more, pillsBox);

    const moreAll = sortItems((D.more || []).filter(valid)).slice(0, 12);
    const maxGrid = 6;

    const paint = (gridItems, moreItems) => {
      grid.replaceChildren(...gridItems.map(tile));
      grid.className = "j-grid" + (gridItems.length && gridItems.every(it => it.c === "book") ? " books" : "");
      notice.hidden = !gridItems.some(it => it.c === "conf");
      more.hidden = !moreItems.length;
      more.open = false;
      more.replaceChildren(el("summary", 0, `More options (${moreItems.length})`), ...moreItems.map(moreRow));
    };

    if (D.mode !== "topic") {
      // mix mode: cluster filter chips
      const shown = items.slice(0, maxGrid);
      const present = CLUSTER_ORDER.filter(c => shown.concat(moreAll).some(it => it.c === c));
      const draw = cur => {
        const f = it => cur === "all" || it.c === cur;
        chipsBox.replaceChildren(...["all"].concat(present).map(c =>
          chip(c === "all" ? "All" : `${CLUSTERS[c].e} ${CLUSTERS[c].n}`, cur === c, () => draw(c))));
        paint(shown.filter(f), moreAll.filter(f));
      };
      chipsBox.hidden = present.length < 2;
      pillsBox.hidden = true;
      draw("all");
    } else {
      // topic mode: one cluster, current topic + "More {cluster} you may like" pills
      chipsBox.hidden = true;
      const cluster = clusterOf(items[0]);
      const cur = D.cur || topicOf(items[0]).key;
      const byTopic = {};
      items.forEach(it => {
        const k = topicOf(it).key;
        (byTopic[k] = byTopic[k] || []).push(it);
      });
      const others = Object.keys(byTopic)
        .filter(k => k !== cur && TOPICS[k] && k !== "soft")
        .sort((a, b) => TOPIC_ORDER.indexOf(a) - TOPIC_ORDER.indexOf(b))
        .slice(0, 3);
      const curItems = byTopic[cur] || items;
      const title = h1.textContent;

      const pills = active => {
        const list = [cur].concat(others).filter(x => x !== active && TOPICS[x]);
        pillsBox.hidden = !list.length || D.pills === false;
        const w = el("div", "j-chips");
        w.append(...list.map(x => chip(`${TOPICS[x][0]} ${TOPICS[x][1]}`, 0, () => show(x))));
        pillsBox.replaceChildren(el("h3", 0, `More ${cluster.n.toLowerCase()} you may like`), w);
      };
      const show = k => {
        if (k === cur) {
          h1.textContent = title;
          paint(curItems.slice(0, maxGrid), moreAll);
        } else {
          h1.textContent = `${cluster.e} ${cluster.n} \u2013 ${TOPICS[k][0]} ${TOPICS[k][1]}`;
          paint(byTopic[k].slice(0, 4), []);
          try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { window.scrollTo(0, 0); }
        }
        pills(k);
      };
      show(cur);
    }

    ROOT.replaceChildren(frag);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
