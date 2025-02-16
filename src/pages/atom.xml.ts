import { getCollection } from 'astro:content';
import markdownit from 'markdown-it';
import { Blog } from '../utils/constants';

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Add a helper function to format tags for URI scheme
function formatTag(tag: string): string {
  if (tag === '.NET') return 'dotnet';
  if (tag === '.NET SDK') return 'dotnet-sdk';
  if (tag === 'ASP.NET Core') return 'asp-dotnet-core';
  if (tag === 'C#') return 'csharp';
  return tag.toLowerCase().replace(/\s+/g, '-');
}

function getExcerpt(content: string = '') {
  if (!content) return '';

  const md = markdownit();
  const moreIndex = content.indexOf(Blog.MORE_MARKER);
  let htmlContent;
  if (moreIndex === -1) {
    htmlContent = md.render(content);
  } else {
    const excerpt = content.slice(0, moreIndex);
    htmlContent = md.render(excerpt);
  }
  return escapeHtml(htmlContent);
}

export async function GET({ }) {
  const posts = await getCollection('posts');
  const sortedPosts = posts
    .sort(
      (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    );

  let atom = `<feed xmlns="http://www.w3.org/2005/Atom">
<title>${Blog.SITE_TITLE}</title>
<subtitle>${Blog.SITE_SUBTITLE}</subtitle>
<link href="${Blog.BASE_URL}/atom.xml" rel="self"/>
<link href="${Blog.BASE_URL}"/>
<updated>${new Date().toISOString()}</updated>
<id>${Blog.BASE_URL}/</id>
<author>
<name>${Blog.SITE_TITLE}</name>
</author>
<generator uri="https://astro.build/">Astro</generator>`;

  sortedPosts.slice(0, 20).forEach((post) => {
    atom += `
  <entry>
    <title>${post.data.title}</title>
    <link href="${Blog.BASE_URL}${post.data.permalink}"/>
    <id>${Blog.BASE_URL}${post.data.permalink}</id>
    <published>${new Date(post.data.date).toISOString()}</published>
    <updated>${new Date(post.data.date).toISOString()}</updated>
    <summary type="html">${getExcerpt(post.body)}</summary>`;

    post.data.tags?.forEach((tag) => {
      // Updated scheme URI with tag formatting
      atom += `
    <category term="${tag}" scheme="${Blog.BASE_URL}/tags/${formatTag(tag)}" />`;
    });

    atom += `
  </entry>`;
  });

  atom += `</feed>`;

  return new Response(atom, {
    headers: {
      'content-type': 'application/xml;charset=UTF-8'
    }
  });
}
