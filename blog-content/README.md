# Blog Content

This folder stores the source files for the statically generated blog.

`blog-content` is a better fit than `blogmd` because it describes the role of the folder, not just the file format. If you ever decide to include images, drafts, or supporting assets here later, the name still makes sense.

## Build command

Run the generator from the project root:

```powershell
python scripts/build_blog.py
```

That command reads every Markdown post in this folder and regenerates the static site output under `/blog/`.

## Post format

Each post must start with frontmatter delimited by `---` lines, followed by normal Markdown content.

Example:

```md
---
title: Building a Static Blog for GitHub Pages
slug: building-a-static-blog-for-github-pages
date: 2026-04-02
summary: Why I chose a local build step instead of client-side Markdown rendering.
tags: web, python, github-pages
published: true
---

## Intro

Write the body of the post here in Markdown.
```

## Frontmatter fields

`title`
: Required. Display title used in the blog index and the post page.

`slug`
: Optional but recommended. Controls the final URL path. A post with `slug: my-post` will be generated at `/blog/my-post/`.

`date`
: Required. Use `YYYY-MM-DD`. Posts are sorted newest first.

`summary`
: Optional. Short description shown on the blog index and in metadata. If omitted, the generator creates one from the first paragraph.

`tags`
: Optional. Comma-separated list like `python, web, portfolio`.

`published`
: Optional. Use `true` or `false`. Posts marked `false` are skipped during the build.

## Markdown features

The builder supports:

- headings
- paragraphs
- images
- links
- fenced code blocks with syntax highlighting
- inline code
- bullet and numbered lists
- tables
- blockquotes

## File naming guidance

- Keep one post per Markdown file.
- Use lowercase, hyphenated filenames when possible.
- If `slug` is omitted, the filename stem will be used.

## Heading guidance

The page title already comes from frontmatter, so the first heading inside the Markdown body should usually start at `##` instead of `#`.

## Images

Images work with normal Markdown syntax:

```md
![A description of the image](/blog-assets/my-post/example.jpg)
```

For blog posts, the cleanest convention is to place post images under `/blog-assets/<slug>/` and reference them with a root-relative path.

If you want a captioned image, use raw HTML inside the Markdown:

```html
<figure>
  <img src="/blog-assets/my-post/example.jpg" alt="A description of the image">
  <figcaption>A short caption under the image.</figcaption>
</figure>
```

You can also place two images side by side with:

```html
<div class="image-grid">
  <figure>
    <img src="/blog-assets/my-post/example-1.jpg" alt="Example one">
    <figcaption>Example one</figcaption>
  </figure>
  <figure>
    <img src="/blog-assets/my-post/example-2.jpg" alt="Example two">
    <figcaption>Example two</figcaption>
  </figure>
</div>
```

## Code blocks

For syntax highlighting, use fenced code blocks and include the language when you can:

````md
```python
def greet(name: str) -> str:
    return f"Hello, {name}"
```
````

If you leave off the language, the code block still renders, but without language-specific highlighting.

## Theme updates

You should not need to modify the Python script to restyle the blog.

- Update `/blog-templates/base.html` for shared structure
- Update `/blog-templates/index.html` for the listing layout
- Update `/blog-templates/post.html` for individual post layout
- Update `/blog/blog.css` or `/portfolio.css` for styling
