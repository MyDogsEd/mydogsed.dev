---
title: My Custom Blog Build System
slug: my-custom-blog-build-system
date: 2026-04-02
summary: A quick note on why this blog uses Markdown source files and a local Python build step.
tags: portfolio, python, github-pages
published: true
---

## What is this setup?

First off, welcome to my blog!

This is kind of an unorthodox setup. I have a folder, `/blog-content` with a bunch of Markdown source files in it, which you can [see for yourself](https://github.com/MyDogsEd/mydogsed.dev/blob/master/blog-content/my-custom-blog-build-system.md) if you really want to. 

In order to render these files to browser-legible HTML, I use a custom [Python script](https://github.com/MyDogsEd/mydogsed.dev/blob/master/scripts/build_blog.py) to read the Markdown files, and insert the content into some template files. These finished files then get inserted into `/blog/`, where you can read them!

That gives me a few nice benefits:

- clean URLs like `/blog/my-custom-blog-build-system/`
- better performance because the browser receives ready-to-render HTML
- better SEO because the content exists in the final page source
- a simpler writing workflow where each post is just a Markdown file with frontmatter

## Why this setup exists

I wanted a blog that stays easy to write, but still deploys cleanly on GitHub Pages. I didn't want to deal with setting up a proper build system or static site generator for just a simple blog, so I decided to make my own! 

I'm also a big fan of the simplicity of Markdown, and found it very compatible with my workflow.

## How I write a new post

The workflow is intentionally small:

1. Create a new Markdown file in `blog-content/`
2. Add frontmatter with the title, slug, date, and summary
3. Write the post body in normal Markdown
4. Run `python scripts/build_blog.py`
5. Commit and push the generated files under `/blog/`

And from there, GitHub Actions takes care of the rest!

## Additional Features

There are a few features that I thought necessary to explicitly include:

### Images

My generator supports rendering images from regular markdown embeds, with just a little added CSS magic to make them fit with the rest of the site. Have a look below:

![A cat hiding in paper with a 200 not found caption](/blog-assets/image-styling-demo/cat-200.jpg)

I can even add images with captions, for more of an editorial feel:

<figure>
  <img src="/blog-assets/image-styling-demo/cat-404.jpg" alt="A cat hiding under paper with a 404 not found caption">
  <figcaption>The current mood when a bug disappears the second I start debugging it.</figcaption>
</figure>

### Code Blocks

As this is a dev blog, I will likely include code blocks from time to time. I even decided to spice things up a little more with some syntax highlighting. Here's an excerpt from my Python build script:

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

As I said earlier, for this small portfolio blog, a lightweight generator feels like the right tradeoff.

It keeps the site fully static, works with GitHub Pages, and avoids introducing a larger toolchain unless I actually need one later. A fully-fledged static site generator felt like a little bit of overkill for a few markdown pages containing the ramblings of some undergrad.

