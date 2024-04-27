'use client';

import * as dateFns from 'date-fns';
import { Calendar, Rocket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';

import { getNews } from '@/actions/news/get-news';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetch } from '@/hooks/use-fetch';
import { Routes } from '@/routes';

const features: Array<{
  title: string;
  description: string;
}> = [
  {
    title: 'Build Decks',
    description:
      'Efficiently create and manage your decks with our intuitive interface.',
  },
  {
    title: 'Manage Cards',
    description:
      'Keep track of your card collection and easily integrate them into new or existing decks.',
  },
  {
    title: 'Explore Strategies',
    description: 'Learn from the community and discover new strategies to win.',
  },
];

export default function LandingPage() {
  const [isPending, startTransition] = useTransition();

  const { data: news, loading: loadingNews } = useFetch(getNews);

  return (
    <div className='h-full'>
      <div className='flex flex-col text-sm'>
        {/* Hero Section */}
        <div className='flex flex-col items-center justify-center space-y-6 p-12'>
          <Logo width={96} height={96} className='animate-pulse' />
          <h1 className='text-4xl font-bold'>Welcome to SideDeck</h1>
          <p className='text-xl'>
            The ultimate tool for Yu-Gi-Oh! deck building and management.
          </p>
          <Link href={Routes.auth.register}>
            <Button size='lg'>
              <Rocket className='w-4 h-4 mr-2' />
              Get Started
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className='p-12 flex flex-col items-center text-center space-y-6'>
          <h2 className='text-2xl font-bold'>Features</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {features.map((feature, i) => (
              <div
                key={`feature-${i}`}
                className='p-4 bg-primary text-primary-foreground shadow-sm rounded-sm space-y-4'
              >
                <h3 className='text-xl font-semibold'>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='p-12 flex flex-col space-y-6'>
          <h2 className='text-2xl text-center font-bold'>
            Latest Yu-Gi-Oh! news
          </h2>
          <div className='flex flex-col space-y-4'>
            {loadingNews ? (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className='h-[98px] w-full' />
                ))}
              </>
            ) : (
              <>
                {news?.map((article, i) => (
                  <div
                    key={`article-${i}`}
                    className='p-4 border shadow-sm rounded-sm space-y-4'
                  >
                    <Link href={article.link} target='_blank'>
                      <h3 className='text-lg font-semibold'>{article.title}</h3>
                    </Link>
                    <p className='flex items-center'>
                      <Calendar className='w-4 h-4 mr-2' />
                      {dateFns.format(new Date(article.date), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
