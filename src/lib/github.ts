import { GITHUB_URL, GITHUB_USERNAME } from '../consts';

interface GitHubUserApi {
	login: string;
	name: string | null;
	avatar_url: string;
	html_url: string;
	bio: string | null;
	public_repos: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
}

interface GitHubRepoApi {
	id: number;
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
	fork: boolean;
	language: string | null;
	topics: string[];
	stargazers_count: number;
	forks_count: number;
	pushed_at: string;
	updated_at: string;
	homepage: string | null;
}

export interface GitHubProfile {
	login: string;
	name: string;
	avatarUrl: string;
	url: string;
	bio: string;
	publicRepos: number;
	followers: number;
	following: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface GitHubRepo {
	id: number;
	name: string;
	fullName: string;
	url: string;
	description: string;
	fork: boolean;
	language: string | null;
	topics: string[];
	stars: number;
	forks: number;
	pushedAt: Date;
	updatedAt: Date;
	homepage: string | null;
}

export interface GitHubSnapshot {
	profile: GitHubProfile;
	repos: GitHubRepo[];
	featuredRepos: GitHubRepo[];
	totalStars: number;
	topLanguages: Array<{ language: string; count: number }>;
	lastPushAt: Date | null;
}

const API_BASE = 'https://api.github.com';

const fallbackSnapshot: GitHubSnapshot = {
	profile: {
		login: GITHUB_USERNAME,
		name: GITHUB_USERNAME,
		avatarUrl: 'https://github.com/identicons/emqo.png',
		url: GITHUB_URL,
		bio: 'AI 与二进制工程方向开发者。',
		publicRepos: 0,
		followers: 0,
		following: 0,
		createdAt: new Date('2024-01-01T00:00:00.000Z'),
		updatedAt: new Date('2024-01-01T00:00:00.000Z'),
	},
	repos: [],
	featuredRepos: [],
	totalStars: 0,
	topLanguages: [],
	lastPushAt: null,
};

let snapshotCache: Promise<GitHubSnapshot> | null = null;

async function fetchJson<T>(url: string): Promise<T | null> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 8000);

	try {
		const response = await fetch(url, {
			headers: {
				Accept: 'application/vnd.github+json',
				'User-Agent': `blog-${GITHUB_USERNAME.toLowerCase()}`,
				'X-GitHub-Api-Version': '2022-11-28',
			},
			signal: controller.signal,
		});

		if (!response.ok) {
			return null;
		}

		return (await response.json()) as T;
	} catch {
		return null;
	} finally {
		clearTimeout(timeout);
	}
}

function toProfile(data: GitHubUserApi): GitHubProfile {
	return {
		login: data.login,
		name: data.name ?? data.login,
		avatarUrl: data.avatar_url,
		url: data.html_url,
		bio: data.bio ?? 'AI 与二进制工程方向开发者。',
		publicRepos: data.public_repos,
		followers: data.followers,
		following: data.following,
		createdAt: new Date(data.created_at),
		updatedAt: new Date(data.updated_at),
	};
}

function toRepo(data: GitHubRepoApi): GitHubRepo {
	return {
		id: data.id,
		name: data.name,
		fullName: data.full_name,
		url: data.html_url,
		description: data.description ?? '暂无描述。',
		fork: data.fork,
		language: data.language,
		topics: data.topics ?? [],
		stars: data.stargazers_count,
		forks: data.forks_count,
		pushedAt: new Date(data.pushed_at),
		updatedAt: new Date(data.updated_at),
		homepage: data.homepage,
	};
}

function calculateTopLanguages(repos: GitHubRepo[]): Array<{ language: string; count: number }> {
	const counts = new Map<string, number>();

	for (const repo of repos) {
		if (!repo.language) {
			continue;
		}
		counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
	}

	return [...counts.entries()]
		.map(([language, count]) => ({ language, count }))
		.sort((a, b) => b.count - a.count || a.language.localeCompare(b.language))
		.slice(0, 8);
}

function computeSnapshot(profile: GitHubProfile, repos: GitHubRepo[]): GitHubSnapshot {
	const sortedRepos = repos.sort((a, b) => b.pushedAt.valueOf() - a.pushedAt.valueOf());
	const featuredRepos = sortedRepos.filter((repo) => !repo.fork).slice(0, 6);
	const totalStars = sortedRepos.reduce((sum, repo) => sum + repo.stars, 0);
	const topLanguages = calculateTopLanguages(sortedRepos.filter((repo) => !repo.fork));

	return {
		profile,
		repos: sortedRepos,
		featuredRepos,
		totalStars,
		topLanguages,
		lastPushAt: sortedRepos[0]?.pushedAt ?? null,
	};
}

async function loadGitHubSnapshot(): Promise<GitHubSnapshot> {
	const [userApi, reposApi] = await Promise.all([
		fetchJson<GitHubUserApi>(`${API_BASE}/users/${GITHUB_USERNAME}`),
		fetchJson<GitHubRepoApi[]>(`${API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
	]);

	if (!userApi || !reposApi) {
		return fallbackSnapshot;
	}

	const profile = toProfile(userApi);
	const repos = reposApi.map(toRepo);
	return computeSnapshot(profile, repos);
}

export async function getGitHubSnapshot(): Promise<GitHubSnapshot> {
	if (!snapshotCache) {
		snapshotCache = loadGitHubSnapshot();
	}
	return snapshotCache;
}
