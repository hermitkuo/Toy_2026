#!/usr/bin/env python3
"""
把 OB_Mini2 vault 內所有 html_*.html 收集到 Toy_2026 站台。

流程：
  1. 讀 HTML搜集區/collect_list.md 的勾選狀態決定哪些要上站
  2. 依 _tools/slugmap.json 的 slug 對應，複製到 pages/<slug>/index.html
  3. 重新產生 index.html 中 AUTO:PAGES 區塊的卡片（依來源分區）
  4. 偵測到 slugmap 沒收錄的新檔案時，自動追加到 slugmap 與勾選清單（預設不勾）

用法：
  uv run --no-project _tools/collect.py            # 收集 + 重建 gallery
  uv run --no-project _tools/collect.py --dry-run  # 只看會做什麼，不動檔案
  uv run --no-project _tools/collect.py --push     # 收集後 commit 並 push
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote

REPO = Path(__file__).resolve().parent.parent
VAULT = REPO.parent.parent
CHECKLIST = VAULT / "HTML搜集區" / "collect_list.md"
SLUGMAP = REPO / "_tools" / "slugmap.json"
PAGES_DIR = REPO / "pages"
INDEX = REPO / "index.html"

START_MARK = "<!-- AUTO:PAGES:START -->"
END_MARK = "<!-- AUTO:PAGES:END -->"

TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.I | re.S)
DESC_RE = re.compile(
    r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', re.I | re.S
)
TICK_RE = re.compile(r"^\s*-\s*\[(x| )\]\s*`([a-z0-9-]+)`", re.I | re.M)

ICONS = {
    "shield": '<path d="M12 3l7 3v6c0 4.4-3 8.2-7 9-4-.8-7-4.6-7-9V6l7-3z"/>',
    "pulse": '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    "flask": '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/><path d="M7 15h10"/>',
    "layout": '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    "book": '<path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2z"/><path d="M4 17h15"/>',
}
DEFAULT_ICON = ICONS["layout"]


# ---------- helpers ----------


def norm(raw: str) -> str:
    return re.sub(r"\s+", " ", raw).strip()


def read_head(path: Path, limit: int = 400_000) -> str:
    """讀檔頭；<title> 若落在更後面（例如內嵌大量 base64）就整檔讀。"""
    text = path.read_text(encoding="utf-8", errors="replace")[:limit]
    if TITLE_RE.search(text):
        return text
    return path.read_text(encoding="utf-8", errors="replace")


def meta_of(path: Path) -> tuple[str, str]:
    text = read_head(path)
    title = TITLE_RE.search(text)
    desc = DESC_RE.search(text)
    return (
        norm(title.group(1)) if title else path.stem,
        norm(desc.group(1)) if desc else "",
    )


def auto_slug(name: str) -> str:
    """檔名 -> 英數 slug。中文無法音譯時退回 page-<hash>。"""
    base = re.sub(r"^html_", "", Path(name).stem)
    ascii_only = unicodedata.normalize("NFKD", base).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_only).strip("-").lower()
    slug = re.sub(r"-{2,}", "-", slug)
    if len(slug) < 3:
        digest = abs(hash(base)) % 10_000
        slug = f"page-{digest:04d}"
    return slug[:60]


SKIP_DIRS = {"node_modules", "附件", "Tags", ".venv", "__pycache__"}

LINK_RE = re.compile(r'(?P<attr>\b(?:href|src))=(?P<q>["\'])(?P<url>[^"\']+)(?P=q)')
ABSOLUTE_RE = re.compile(r"^(?:[a-z][a-z0-9+.-]*:|//|#|/)", re.I)


def rewrite_links(
    text: str, src: Path, slug_by_src: dict[str, str], selected: set[str]
) -> tuple[str, list[str]]:
    """把指向其他被收集頁面的相對連結改寫成 ../<slug>/，並回報斷掉的。"""
    warnings: list[str] = []

    def repl(m: re.Match) -> str:
        url = m.group("url")
        if ABSOLUTE_RE.match(url):
            return m.group(0)
        base, sep, frag = url.partition("#")
        target = (src.parent / unquote(base)).resolve()
        try:
            rel = str(target.relative_to(VAULT))
        except ValueError:
            warnings.append(f"連到 vault 外部：{url}")
            return m.group(0)
        slug = slug_by_src.get(rel)
        if slug is None:
            warnings.append(f"連到未收集的檔案：{url}")
            return m.group(0)
        if slug not in selected:
            warnings.append(f"連到未勾選的頁面 `{slug}`：{url}")
            return m.group(0)
        return f'{m.group("attr")}="../{slug}/{sep}{frag}"'

    return LINK_RE.sub(repl, text), warnings


def scan_sources() -> set[str]:
    """走訪 vault 找 html_*.html，跳過點目錄、產出目錄與大型無關目錄。"""
    found: set[str] = set()
    for root, dirs, files in os.walk(VAULT):
        root_path = Path(root)
        dirs[:] = [
            d
            for d in dirs
            if not d.startswith(".")
            and d not in SKIP_DIRS
            and root_path / d != PAGES_DIR
        ]
        for name in files:
            if name.startswith("html_") and name.endswith(".html"):
                found.add(str((root_path / name).relative_to(VAULT)))
    return found


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


# ---------- checklist ----------


def read_selection(path: Path) -> dict[str, bool]:
    if not path.exists():
        sys.exit(f"找不到勾選清單：{path}")
    return {
        slug: mark.lower() == "x"
        for mark, slug in TICK_RE.findall(path.read_text(encoding="utf-8"))
    }


def append_to_checklist(path: Path, entries: list[dict]) -> None:
    lines = ["", "## 新偵測到的頁面（尚未分類）", ""]
    for e in entries:
        lines.append(f"- [ ] `{e['slug']}` — {e['title']} `{e['kb']}KB`")
        lines.append(f"      ↳ `{e['src']}`")
    with path.open("a", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")


# ---------- gallery ----------


def card_html(page: dict, icon: str) -> str:
    return f"""                <a href="./pages/{page['slug']}/" class="toy-card block p-5 rounded-2xl no-underline group" aria-label="開啟 {esc(page['title'])}">
                    <div class="flex items-start justify-between mb-4">
                        <div class="icon-tile">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                {icon}
                            </svg>
                        </div>
                        <span class="badge">{page['mtime']}</span>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-1 text-shadow-sm">{esc(page['title'])}</h3>
                    <p class="text-sm text-white/70 leading-relaxed">{esc(page['desc'])}</p>
                    <div class="mt-4 flex items-center gap-1 text-xs font-semibold text-white/85">
                        <span>開啟</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-0.5">
                            <path d="M5 12h14M13 5l7 7-7 7"/>
                        </svg>
                    </div>
                </a>"""


def gallery_html(groups: list[dict], by_group: dict[str, list[dict]]) -> str:
    blocks = []
    delay = 0.25
    for group in groups:
        pages = by_group.get(group["key"], [])
        if not pages:
            continue
        icon = ICONS.get(group["icon"], DEFAULT_ICON)
        cards = "\n\n".join(card_html(p, icon) for p in pages)
        blocks.append(
            f"""        <section class="glass-card p-5 sm:p-7 rounded-3xl fade-up mt-6" style="animation-delay: {delay:.2f}s;">
            <div class="flex items-center justify-between mb-5 px-1">
                <h2 class="text-sm font-bold uppercase tracking-widest text-white/80">{esc(group['label'])}</h2>
                <span class="text-xs text-white/55">{len(pages)} 頁</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
{cards}
            </div>
        </section>"""
        )
        delay += 0.05
    return "\n\n".join(blocks)


def write_index(html_block: str, dry: bool) -> None:
    text = INDEX.read_text(encoding="utf-8")
    if START_MARK not in text or END_MARK not in text:
        sys.exit(
            f"index.html 缺少 {START_MARK} / {END_MARK} 標記，"
            "請先在 Toys section 後面插入這兩行。"
        )
    head, rest = text.split(START_MARK, 1)
    _, tail = rest.split(END_MARK, 1)
    stamp = datetime.now(timezone.utc).astimezone().strftime("%Y-%m-%d %H:%M")
    new = (
        f"{head}{START_MARK}\n"
        f"        <!-- 由 _tools/collect.py 產生，勿手改。最後更新 {stamp} -->\n"
        f"{html_block}\n"
        f"        {END_MARK}{tail}"
    )
    if dry:
        print("  [dry-run] index.html 不寫入")
        return
    INDEX.write_text(new, encoding="utf-8")


# ---------- main ----------


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="只顯示動作，不寫檔")
    ap.add_argument("--push", action="store_true", help="完成後 git commit + push")
    args = ap.parse_args()
    dry = args.dry_run

    data = json.loads(SLUGMAP.read_text(encoding="utf-8"))
    groups = data["groups"]
    known = {p["src"]: p for p in data["pages"]}
    excluded = {e["src"] for e in data.get("excluded_sources", [])}
    selection = read_selection(CHECKLIST)

    # --- 偵測新檔 ---
    found = scan_sources()
    new_srcs = sorted(found - known.keys() - excluded)
    new_entries = []
    for src in new_srcs:
        path = VAULT / src
        title, desc = meta_of(path)
        slug = auto_slug(path.name)
        while any(p["slug"] == slug for p in data["pages"]) or any(
            e["slug"] == slug for e in new_entries
        ):
            slug += "-2"
        new_entries.append(
            {
                "slug": slug,
                "group": "tools-notes",
                "src": src,
                "title": title,
                "desc": desc,
                "kb": round(path.stat().st_size / 1024),
            }
        )

    if new_entries:
        print(f"偵測到 {len(new_entries)} 個新頁面（預設不上站，請到勾選清單打勾）：")
        for e in new_entries:
            print(f"  + {e['slug']}  ←  {e['src']}")
        if not dry:
            data["pages"].extend(
                {k: v for k, v in e.items() if k != "kb"} for e in new_entries
            )
            SLUGMAP.write_text(
                json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )
            append_to_checklist(CHECKLIST, new_entries)

    # --- 收集 ---
    by_group: dict[str, list[dict]] = {}
    copied, skipped, missing = 0, 0, []
    wanted_slugs = set()
    link_warnings: list[str] = []
    slug_by_src = {p["src"]: p["slug"] for p in data["pages"]}
    selected_slugs = {
        p["slug"] for p in data["pages"] if selection.get(p["slug"], False)
    }

    for page in data["pages"]:
        slug = page["slug"]
        src = VAULT / page["src"]
        if not selection.get(slug, False):
            skipped += 1
            continue
        if not src.exists():
            missing.append(f"{slug}: {page['src']}")
            continue

        wanted_slugs.add(slug)
        title, desc = meta_of(src)
        record = {
            "slug": slug,
            "title": page.get("title") or title,
            "desc": page.get("desc") or desc or "",
            "mtime": datetime.fromtimestamp(src.stat().st_mtime, timezone.utc)
            .astimezone()
            .strftime("%Y-%m-%d"),
        }
        by_group.setdefault(page["group"], []).append(record)

        body = src.read_text(encoding="utf-8", errors="replace")
        body, warns = rewrite_links(body, src, slug_by_src, selected_slugs)
        link_warnings += [f"{slug}: {w}" for w in warns]

        dest = PAGES_DIR / slug / "index.html"
        if not dry:
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(body, encoding="utf-8")
        copied += 1
        print(f"  ✓ {slug}  ({record['mtime']})")

    # --- 清掉取消勾選的 ---
    removed = []
    if PAGES_DIR.exists():
        for d in sorted(PAGES_DIR.iterdir()):
            if d.is_dir() and d.name not in wanted_slugs:
                removed.append(d.name)
                if not dry:
                    shutil.rmtree(d)
    for name in removed:
        print(f"  − 移除 pages/{name}/（未勾選）")

    for group in by_group.values():
        group.sort(key=lambda r: r["mtime"], reverse=True)

    write_index(gallery_html(groups, by_group), dry)

    print(f"\n上站 {copied} 頁 · 未勾選 {skipped} 頁 · 移除 {len(removed)} 頁")
    if missing:
        print("找不到來源檔（可能已改名或搬移）：")
        for m in missing:
            print(f"  ! {m}")
    if link_warnings:
        print("\n頁面內連結需注意：")
        for w in link_warnings:
            print(f"  ! {w}")

    if args.push and not dry:
        # 只 stage 本工具管轄的路徑，避免掃到 repo 內其他未完成的改動
        subprocess.run(
            ["git", "-C", str(REPO), "add", "--", "pages", "index.html", "_tools"],
            check=True,
        )
        subprocess.run(
            ["git", "-C", str(REPO), "commit", "-m", f"chore: 收集 html_ 頁面（{copied} 頁）"],
            check=False,
        )
        subprocess.run(["git", "-C", str(REPO), "push"], check=True)
        print("已 push，GitHub Pages 約 1 分鐘後生效。")


if __name__ == "__main__":
    main()
