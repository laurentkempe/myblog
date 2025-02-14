import { getCollection } from 'astro:content';
import markdownit from 'markdown-it'

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
  const moreIndex = content.indexOf('{/* <!-- more --> */}');
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
<title>Laurent Kempé</title>
<subtitle>One of the Tech Head Brothers</subtitle>
<link href="https://laurentkempe.com/atom.xml" rel="self"/>
<link href="https://laurentkempe.com/"/>
<updated>${new Date().toISOString()}</updated>
<id>https://laurentkempe.com/</id>
<author>
<name>Laurent Kempé</name>
</author>
<generator uri="https://astro.build/">Astro</generator>`

  sortedPosts.slice(0, 20).map((post, index) => {
    atom += `
  <entry>
    <title>${post.data.title}</title>
    <link href="https://laurentkempe.com${post.data.permalink}"/>
    <id>https://laurentkempe.com${post.data.permalink}</id>
    <published>${new Date(post.data.date).toISOString()}</published>
    <updated>${new Date(post.data.date).toISOString()}</updated>
    <summary type="html">${getExcerpt(post.body)}</summary>`

    post.data.tags.map((tag) => {
      atom += `
    <category term="${tag}" scheme="https://laurentkempe.com/tags/${tag}" />`
    });

    atom += `
  </entry>`

  });

  atom += `</feed>`;

  return new Response(atom, {
    headers: {
      'content-type': 'application/xml;charset=UTF-8'
    }
  });
}
