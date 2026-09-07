"""Check local static-page links, clean URLs and fragment targets without a server.

Usage: uv run --no-project python scripts/check_site_links.py methods/index.html
Dashboard URLs use the separate application rewrite declared in vercel.json.
"""

from __future__ import annotations

import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, filename: Path):
        super().__init__(convert_charrefs=True)
        self.links: list[str] = []
        self.ids: set[str] = set()
        self.duplicate_ids: set[str] = set()
        self.feed(filename.read_text())

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]):
        values = dict(attrs)
        if identifier := values.get("id"):
            if identifier in self.ids:
                self.duplicate_ids.add(identifier)
            self.ids.add(identifier)
        if tag in {"a", "link", "script", "img", "iframe"} and (
            target := values.get("href") or values.get("src")
        ):
            self.links.append(target)


def check(filenames: list[str]) -> list[str]:
    failures: list[str] = []
    pages: dict[Path, Page] = {}
    config = json.loads((ROOT / "vercel.json").read_text())
    external_mounts = [
        item["source"].removesuffix("/:path*")
        for item in config.get("rewrites", [])
        if item.get("destination", "").startswith("https://")
        and item["source"].endswith("/:path*")
    ]
    for name in filenames:
        source = ROOT / name
        page = pages.setdefault(source, Page(source))
        for identifier in sorted(page.duplicate_ids):
            failures.append(f"{name}: duplicate id {identifier}")
        for href in page.links:
            url = urlsplit(href)
            if url.scheme or url.netloc:
                continue
            if any(
                url.path == mount or url.path.startswith(mount + "/")
                for mount in external_mounts
            ):
                continue
            target = (
                (ROOT / unquote(url.path).lstrip("/"))
                if url.path.startswith("/")
                else source.parent / unquote(url.path)
            )
            if not url.path:
                target = source
            target = target.resolve()
            if not target.is_relative_to(ROOT):
                failures.append(f"{name}: link escapes site root: {href}")
                continue
            choices = [target]
            if target.is_dir():
                choices = [target / "index.html"]
            elif not target.suffix:
                choices.append(target.with_suffix(".html"))
            resolved = next(
                (candidate for candidate in choices if candidate.is_file()), None
            )
            if resolved is None:
                failures.append(f"{name}: missing local target: {href}")
            elif url.fragment and resolved.suffix == ".html":
                destination = pages.setdefault(resolved, Page(resolved))
                if unquote(url.fragment) not in destination.ids:
                    failures.append(f"{name}: missing fragment: {href}")
    return failures


if __name__ == "__main__":
    filenames = sys.argv[1:] or ["methods/index.html"]
    errors = check(filenames)
    if errors:
        print("\n".join(errors))
        raise SystemExit(1)
    print(f"Local links and fragment targets passed for {len(filenames)} pages.")
