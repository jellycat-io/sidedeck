import Link from 'next/link';

import { cn } from '@/lib/utils';

interface LogoProps {
  withLabel?: boolean;
  hideOnMobile?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({
  withLabel = false,
  hideOnMobile = false,
  width = 32,
  height = 32,
  className,
}: LogoProps) {
  return (
    <Link href='/'>
      <div
        className={cn(
          'hover:opacity-75 transition items-center gap-x-2 flex',
          hideOnMobile && 'hidden md:flex',
        )}
      >
        <LogoSvg
          width={width}
          height={height}
          className={cn('fill-foreground', className)}
        />
        {withLabel && (
          <p className='text-lg tracking-wide'>
            <span>Side</span>
            <span className='font-bold'>Deck</span>
          </p>
        )}
      </div>
    </Link>
  );
}

function LogoSvg({
  width,
  height,
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      version='1.1'
      id='svg1'
      width={width}
      height={height}
      className={className}
      viewBox='0 0 659.34387 672.57184'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <defs id='defs1' />
      <g id='g1' transform='translate(-183.65554,-181.85113)'>
        <path
          d='M 188.47896,303.2233 421.69579,348.78964 514.0712,181.85113 605.20388,347.96117 837.43411,304.3351 682.19099,571.76334 619.21501,558.58232 724.07734,379.32045 568.54131,410.9549 514.35268,307.55712 458.99239,410.9549 304.3351,380.19919 407.73287,558.28941 345.34271,572.05625 Z'
          id='path1'
        />
        <path
          d='m 607.06796,292.45307 75.80583,-49.70873 v 60.06472 l -63.58576,13.04855 z'
          id='path2'
        />
        <path
          d='m 343.81877,241.91586 76.42719,50.74433 -12.53075,23.19742 -63.68932,-12.94499 z'
          id='path3'
        />
        <path
          d='m 514.27832,400.2589 -30.34304,56.23301 -96,-19.8835 126.34304,217.26861 125.30744,-216.02589 -95.06796,18.01942 z'
          id='path4'
        />
        <path
          d='m 258.6409,479.4962 -63.2689,33.97774 65.9051,42.47218 -77.62156,144.6983 217.34037,-42.17926 112.76461,195.95782 112.19146,-195.66491 217.04745,41.00762 -77.62156,-144.11248 66.19801,-42.17927 -63.5618,-34.27065 -55.36029,96.3679 25.77622,48.62332 -143.52666,-29.58407 -81.14283,144.69831 -82.0089,-145.28413 -143.52666,29.58406 26.65495,-48.03749 z'
          id='path5'
        />
        <path
          d='m 387.93528,691.98706 20.91909,33.34627 -64.62136,44.11651 -0.20712,-68.76375 z'
          id='path6'
        />
        <path
          d='m 638.84008,691.56416 -19.62507,34.1242 63.85472,43.49736 v -68.24839 z'
          id='path7'
        />
      </g>
    </svg>
  );
}
