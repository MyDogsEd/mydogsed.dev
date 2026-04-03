---
title: Welcome to the Blog
slug: welcome-to-the-blog
date: 2026-04-02
summary: A quick note on why this blog uses Markdown source files and a local Python build step.
tags: portfolio, python, github-pages
published: true
---

## Why this setup exists

I wanted a blog that stays easy to write, but still deploys cleanly on GitHub Pages.

Instead of rendering Markdown in the browser with JavaScript, this site now uses a small Python build script that turns Markdown files into static HTML pages ahead of time.

That gives me a few nice benefits:

- clean URLs like `/blog/welcome-to-the-blog/`
- better performance because the browser receives ready-to-render HTML
- better SEO because the content exists in the final page source
- a simpler writing workflow where each post is just a Markdown file with frontmatter

## How I write a new post

The workflow is intentionally small:

1. Create a new Markdown file in `blog-content/`
2. Add frontmatter with the title, slug, date, and summary
3. Write the post body in normal Markdown
4. Run `python scripts/build_blog.py`
5. Commit the generated files under `/blog/`

## Images

My generator also supports rendering images from regular markdown embeds, with just a little added CSS magic to make them fit with the rest of the site. Have a look below:

![A cat hiding in paper with a 200 not found caption](/blog-assets/image-styling-demo/cat-200.jpg)

I can even add images with captions, for more of an editorial feel:

<figure>
  <img src="/blog-assets/image-styling-demo/cat-404.jpg" alt="A cat hiding under paper with a 404 not found caption">
  <figcaption>The current mood when a bug disappears the second I start debugging it.</figcaption>
</figure>

## Code Blocks

As this is a dev blog, it will be important to include code blocks from time to time. I even decided to spice things up a little more with some syntax highlighting:

```python
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
```

## Why not use a bigger framework?

For this small portfolio blog, a lightweight generator feels like the right tradeoff.

It keeps the site fully static, works with GitHub Pages, and avoids introducing a larger toolchain unless I actually need one later. A fully-fledged static site generator felt like a little bit of overkill for a few markdown pages containing the ramblings of some undergrad.

