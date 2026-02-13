import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export async function getPublishedPosts(): Promise<BlogPost[]> {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function listTags(posts: BlogPost[]): Array<{ tag: string; count: number }> {
	const tags = new Map<string, number>();

	for (const post of posts) {
		for (const tag of post.data.tags) {
			tags.set(tag, (tags.get(tag) ?? 0) + 1);
		}
	}

	return [...tags.entries()]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}
