import * as cheerio from 'cheerio';
import * as datefns from 'date-fns';
import fetch from 'node-fetch';

export interface Article {
  title: string;
  link: string;
  date: string;
}

const SOURCE_DOMAIN = 'https://www.yugioh-card.com';

export async function generateNewsFeed(): Promise<Article[]> {
  try {
    const response = await fetch('https://www.yugioh-card.com/en/news');
    const $ = cheerio.load(await response.text());

    const feed: Article[] = [];

    $('ul.articles')
      .find('li')
      .each((i, el) => {
        const title = $(el).find('h4').text();
        const link = `${SOURCE_DOMAIN}${$(el).find('a').attr('href')}`;
        const dateString = $(el).find('p').text();
        const date = datefns
          .parse(dateString, 'MMMM dd, yyyy', new Date())
          .toISOString();

        feed.push({ title, link, date });
      });

    feed.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return feed;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}
