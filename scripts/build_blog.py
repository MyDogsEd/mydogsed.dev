from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from html import escape
from pathlib import Path
import re
import shutil

import markdown
from pygments.formatters import HtmlFormatter


ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "blog-content"
OUTPUT_DIR = ROOT / "blog"
TEMPLATE_DIR = ROOT / "blog-templates"
CODE_THEME_PATH = OUTPUT_DIR / "code-theme.css"


@dataclass
class Post:
    title: str
    slug: str
    date_value: date
    date_display: str
    summary: str
    tags: list[str]
    body_html: str
    source_path: Path


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "post"


def parse_frontmatter(raw_text: str, source_path: Path) -> tuple[dict[str, str], str]:
    if not raw_text.startswith("---\n"):
        raise ValueError(f"{source_path} is missing frontmatter opening delimiter.")

    parts = raw_text.split("\n---\n", 1)
    if len(parts) != 2:
        raise ValueError(f"{source_path} is missing frontmatter closing delimiter.")

    frontmatter_block = parts[0][4:]
    body = parts[1].lstrip()
    metadata: dict[str, str] = {}

    for line in frontmatter_block.splitlines():
        if not line.strip():
            continue
        if ":" not in line:
            raise ValueError(f"Invalid frontmatter line in {source_path}: {line}")
        key, value = line.split(":", 1)
        metadata[key.strip().lower()] = value.strip()

    return metadata, body


def parse_tags(raw_tags: str) -> list[str]:
    if not raw_tags:
        return []
    return [tag.strip() for tag in raw_tags.split(",") if tag.strip()]


def summarize_markdown(markdown_body: str) -> str:
    paragraphs = [part.strip() for part in markdown_body.split("\n\n") if part.strip()]
    for paragraph in paragraphs:
        cleaned = re.sub(r"^#+\s*", "", paragraph)
        cleaned = re.sub(r"`([^`]+)`", r"\1", cleaned)
        cleaned = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cleaned)
        cleaned = " ".join(cleaned.split())
        if cleaned:
            return cleaned[:180].rstrip() + ("..." if len(cleaned) > 180 else "")
    return "New blog post."


def load_post(path: Path) -> Post | None:
    metadata, body_markdown = parse_frontmatter(read_text(path), path)

    if metadata.get("published", "true").lower() == "false":
        return None

    title = metadata.get("title")
    raw_date = metadata.get("date")
    if not title or not raw_date:
        raise ValueError(f"{path} must include both 'title' and 'date' in frontmatter.")

    try:
        parsed_date = date.fromisoformat(raw_date)
    except ValueError as exc:
        raise ValueError(f"{path} has an invalid date '{raw_date}'. Use YYYY-MM-DD.") from exc

    slug = slugify(metadata.get("slug", path.stem))
    summary = metadata.get("summary") or summarize_markdown(body_markdown)
    tags = parse_tags(metadata.get("tags", ""))

    body_html = markdown.markdown(
        body_markdown,
        extensions=["fenced_code", "tables", "sane_lists", "codehilite"],
        extension_configs={
            "codehilite": {
                "guess_lang": False,
                "linenums": False,
                "css_class": "codehilite",
            }
        },
        output_format="html5",
    )

    return Post(
        title=title,
        slug=slug,
        date_value=parsed_date,
        date_display=parsed_date.strftime("%B %d, %Y"),
        summary=summary,
        tags=tags,
        body_html=body_html,
        source_path=path,
    )


def render_template(template_name: str, context: dict[str, str]) -> str:
    output = read_text(TEMPLATE_DIR / template_name)
    for key, value in context.items():
        output = output.replace(f"{{{{ {key} }}}}", value)
    return output


def build_post_card(post: Post) -> str:
    tags_markup = "".join(f'<span class="tag-pill">{escape(tag)}</span>' for tag in post.tags)
    return (
        '<a class="blog-post-card" href="./{slug}/">'
        '<div class="blog-post-card-header"><span>{date}</span><span>{source}</span></div>'
        "<h3>{title}</h3>"
        "<p>{summary}</p>"
        '<div class="tag-list">{tags}</div>'
        "</a>"
    ).format(
        slug=escape(post.slug),
        date=escape(post.date_display),
        source=escape(post.source_path.name),
        title=escape(post.title),
        summary=escape(post.summary),
        tags=tags_markup,
    )


def build_tags_markup(tags: list[str]) -> str:
    if not tags:
        return ""
    pills = "".join(f'<span class="tag-pill">{escape(tag)}</span>' for tag in tags)
    return f'<div class="tag-list">{pills}</div>'


def render_page(content_html: str, *, page_title: str, meta_description: str, root_path: str) -> str:
    return render_template(
        "base.html",
        {
            "page_title": escape(page_title),
            "meta_description": escape(meta_description),
            "page_content": content_html,
            "root_path": root_path,
            "home_href": f"{root_path}index.html",
            "blog_index_href": f"{root_path}blog/",
        },
    )


def clean_output_dir() -> None:
    if OUTPUT_DIR.exists():
        for child in OUTPUT_DIR.iterdir():
            if child.is_dir():
                shutil.rmtree(child)
            else:
                if child.name not in {"blog.css", "code-theme.css"}:
                    child.unlink()


def write_code_theme() -> None:
    formatter = HtmlFormatter(style="material", cssclass="codehilite")
    css = formatter.get_style_defs(".codehilite")
    write_text(CODE_THEME_PATH, css)


def build_blog() -> None:
    # get the paths of all markdown files that are not readme and don't start with underscore
    source_files = [
        path
        for path in sorted(CONTENT_DIR.glob("*.md"))
        if path.name.lower() != "readme.md" and not path.name.startswith("_")
    ]
    posts = [post for post in (load_post(path) for path in source_files) if post is not None]
    posts.sort(key=lambda post: post.date_value, reverse=True)

    OUTPUT_DIR.mkdir(exist_ok=True)
    clean_output_dir()
    write_code_theme()

    index_html = render_template(
        "index.html",
        {
            "posts_list": "\n".join(build_post_card(post) for post in posts),
        },
    )
    write_text(
        OUTPUT_DIR / "index.html",
        render_page(
            index_html,
            page_title="Blog | James Radomski",
            meta_description="Notes, project writeups, and technical reflections from James Radomski.",
            root_path="../",
        ),
    )

    for post in posts:
        post_html = render_template(
            "post.html",
            {
                "blog_index_href": "../../blog/",
                "post_title": escape(post.title),
                "post_date": escape(post.date_display),
                "post_summary": escape(post.summary),
                "tags_markup": build_tags_markup(post.tags),
                "post_body": post.body_html,
            },
        )
        write_text(
            OUTPUT_DIR / post.slug / "index.html",
            render_page(
                post_html,
                page_title=f"{post.title} | Blog",
                meta_description=post.summary,
                root_path="../../",
            ),
        )

    print(f"Built {len(posts)} post(s) into {OUTPUT_DIR}")


if __name__ == "__main__":
    build_blog()
