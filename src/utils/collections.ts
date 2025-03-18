import { getCollection, type CollectionEntry, type DataEntryMap } from 'astro:content';

export async function getAllPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  // Sort posts by date in descending order
  return posts.sort((a, b) => 
    new Date(b.data.date as Date).getTime() - new Date(a.data.date as Date).getTime()
  );
}

export async function getAllPresentations(): Promise<CollectionEntry<'presentations'>[]> {
  const presentations = await getCollection('presentations', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  // Sort presentations by date in descending order
  return presentations.sort((a, b) => 
    new Date(b.data.date as Date).getTime() - new Date(a.data.date as Date).getTime()
  );
}

export async function getPaginatedPosts(paginate: any, pageSize: number) {
  const sortedPosts = await getAllPosts();
  return paginate(sortedPosts, { pageSize });
}

export async function getLatestPosts(limit: number = 8): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getAllPosts();
  return allPosts.slice(0, limit);
}

export async function getLatestPresentations(limit: number = 8): Promise<CollectionEntry<'presentations'>[]> {
  const allPresentations = await getAllPresentations();
  return allPresentations.slice(0, limit);
}