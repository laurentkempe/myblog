import { getCollection } from 'astro:content';
import markdownit from 'markdown-it';

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
  const excerpt = moreIndex === -1 ? content : content.slice(0, moreIndex);
  const htmlContent = md.render(excerpt);

  return escapeHtml(htmlContent);
}

function generateAtomEntry(post) {
  const { title, permalink, date, tags, body } = post.data;
  const publishedDate = new Date(date).toISOString();
  const summary = getExcerpt(body);

  let entry = `
  <entry>
    <title>${title}</title>
    <link href="https://laurentkempe.com${permalink}"/>
    <id>https://laurentkempe.com${permalink}</id>
    <published>${publishedDate}</published>
    <updated>${publishedDate}</updated>
    <summary type="html">${summary}</summary>`;

  tags.forEach(tag => {
    entry += `
    <category term="${tag}" scheme="https://laurentkempe.com/tags/${tag}" />`;
  });

  entry += `
  </entry>`;

  return entry;
}

export async function GET() {
  const posts = await getCollection('posts');
  const sortedPosts = posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

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
<generator uri="https://astro.build/">Astro</generator>`;

  sortedPosts.slice(0, 20).forEach(post => {
    atom += generateAtomEntry(post);
  });

  atom += `</feed>`;

  return new Response(atom, {
    headers: {
      'content-type': 'application/xml;charset=UTF-8'
    }
  });
}
