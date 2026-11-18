"""Minimal Markdown -> HTML for the A5 report (headings, tables, lists, code, bold, links, hr, quotes)."""
import html
import re
import sys


def inline(text: str) -> str:
    codes = []
    def keep(m):
        codes.append("<code>" + html.escape(m.group(1)) + "</code>")
        return "\x00%d\x00" % (len(codes) - 1)
    t = re.sub(r"`([^`]+)`", keep, text)
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", t)
    t = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', t)
    return re.sub(r"\x00(\d+)\x00", lambda m: codes[int(m.group(1))], t)


def cells(row: str) -> list[str]:
    row = row.strip()
    if row.startswith("|"):
        row = row[1:]
    if row.endswith("|"):
        row = row[:-1]
    # split on | not inside backticks
    res, cur, tick = [], "", False
    for ch in row:
        if ch == "`":
            tick = not tick
        if ch == "|" and not tick:
            res.append(cur.strip())
            cur = ""
        else:
            cur += ch
    res.append(cur.strip())
    return res


def render_list(items):
    html_out, stack = [], []  # stack of (indent, tag)
    for indent, ordered, text in items:
        tag = "ol" if ordered else "ul"
        while stack and indent < stack[-1][0]:
            html_out.append("</li></%s>" % stack.pop()[1])
        if not stack or indent > stack[-1][0]:
            stack.append((indent, tag)); html_out.append("<%s><li>" % tag)
        else:
            html_out.append("</li><li>")
        html_out.append(inline(text))
    while stack:
        html_out.append("</li></%s>" % stack.pop()[1])
    return "".join(html_out)


def convert(md: str) -> str:
    lines = md.split("\n")
    out, i = [], 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("```"):
            i += 1
            buf = []
            while i < len(lines) and not lines[i].startswith("```"):
                buf.append(lines[i])
                i += 1
            out.append("<pre>" + html.escape("\n".join(buf)) + "</pre>")
            i += 1
            continue
        m = re.match(r"^(#{1,4})\s+(.*)", line)
        if m:
            n = len(m.group(1))
            out.append(f"<h{n}>{inline(m.group(2))}</h{n}>")
            i += 1
            continue
        if line.strip() == "---":
            out.append("<hr>")
            i += 1
            continue
        if line.startswith("|") and i + 1 < len(lines) and re.match(r"^\|[\s:|-]+\|$", lines[i + 1].strip()):
            head = cells(line)
            i += 2
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append(cells(lines[i]))
                i += 1
            t = ["<table><thead><tr>" + "".join(f"<th>{inline(c)}</th>" for c in head) + "</tr></thead><tbody>"]
            for r in rows:
                t.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>")
            tbl = "".join(t) + "</tbody></table>"
            out.append(f'<div class="land">{tbl}</div>' if len(head) >= 10 else tbl)
            continue
        if line.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].startswith(">"):
                buf.append(lines[i].lstrip(">").strip())
                i += 1
            out.append("<blockquote>" + "<br>".join(inline(b) for b in buf) + "</blockquote>")
            continue
        if re.match(r"^([-*]|\d+\.)\s+", line):
            items = []  # (indent, ordered, text)
            while i < len(lines):
                l = lines[i]
                m2 = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)", l)
                if m2:
                    items.append([len(m2.group(1)), m2.group(2)[0].isdigit(), m2.group(3)])
                elif l.startswith("  ") and l.strip() and items:
                    items[-1][2] += " " + l.strip()
                else:
                    break
                i += 1
            out.append(render_list(items))
            continue
        if not line.strip():
            i += 1
            continue
        buf = []
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#|\||```|>|---|\s*([-*]|\d+\.)\s)", lines[i]):
            buf.append(lines[i])
            i += 1
        out.append("<p>" + inline(" ".join(b.strip() for b in buf)) + "</p>")
    return "\n".join(out)


if __name__ == "__main__":
    src, css, title, dst = sys.argv[1:5]
    extra = sys.argv[5] if len(sys.argv) > 5 else ""
    body = convert(open(src, encoding="utf-8").read())
    if extra:
        body = body.replace("<p>&lt;!--FIGURES--&gt;</p>", open(extra, encoding="utf-8").read())
    style = open(css, encoding="utf-8").read()
    doc = f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{html.escape(title)}</title>{style}<style>blockquote{{color:#5b6675;border-left:3px solid #d5dbe3;margin:6pt 0;padding:2pt 8pt;font-size:9.5pt}} table{{font-size:8.6pt}} td,th{{padding:3pt 4pt}} @page land{{size:A4 landscape;margin:12mm}} .land{{page:land}} .land table{{font-size:7.4pt;table-layout:auto}} .land code{{font-size:6.8pt;word-break:break-all}} .land td{{padding:2pt 3pt}} hr{{border:0;border-top:1px solid #d5dbe3;margin:10pt 0}}</style></head><body>{body}</body></html>'
    open(dst, "w", encoding="utf-8").write(doc)
