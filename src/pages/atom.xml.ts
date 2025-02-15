import { getCollection } from 'astro:content';
import markdownit from 'markdown-it';

const BASE_URL = 'https://laurentkempe.com';
const FEED_TITLE = 'Laurent Kempé';
const FEED_SUBTITLE = 'One of the Tech Head Brothers';
const GENERATOR_URI = 'https://astro.build/';
const MORE_MARKER = '{/* <!-- more --> */}';

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getExcerpt(content: string = '') {
  if (!content) return '';

  const md = markdownit();
  const moreIndex = content.indexOf(MORE_MARKER);
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
<title>${FEED_TITLE}</title>
<subtitle>${FEED_SUBTITLE}</subtitle>
<link href="${BASE_URL}/atom.xml" rel="self"/>
<link href="${BASE_URL}"/>
<updated>${new Date().toISOString()}</updated>
<id>${BASE_URL}/</id>
<author>
<name>${FEED_TITLE}</name>
</author>
<generator uri="${GENERATOR_URI}">Astro</generator>`;

  sortedPosts.slice(0, 20).forEach((post) => {
    atom += `
  <entry>
    <title>${post.data.title}</title>
    <link href="${BASE_URL}${post.data.permalink}"/>
    <id>${BASE_URL}${post.data.permalink}</id>
    <published>${new Date(post.data.date).toISOString()}</published>
    <updated>${new Date(post.data.date).toISOString()}</updated>
    <summary type="html">${getExcerpt(post.body)}</summary>`;

    post.data.tags.forEach((tag) => {
      atom += `
    <category term="${tag}" scheme="${BASE_URL}/tags/${tag}" />`;
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
