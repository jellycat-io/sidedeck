'use server';

import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';
import { Article, generateNewsFeed } from '@/lib/news';

async function handler(): Promise<FetchState<Article[]>> {
  const feed = await generateNewsFeed();

  return { data: feed };
}

export const getNews = createSafeFetch(handler);
