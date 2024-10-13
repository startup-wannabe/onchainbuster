'use client';

import ErrorImg from '/public/images/error.png';
import ImageAdaptive from '../ImageAdaptive';
import EcosystemCard from './Card';
import type { EcosystemApp } from './Content';

export function List({
  apps,
}: {
  apps: EcosystemApp[];
}) {
  const showEmptyState = apps.length === 0;
  const truncatedApps = apps.slice(0, 3);

  return (
    <>
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3">
        {truncatedApps.map((app) => (
          <EcosystemCard {...app} key={app.url} />
        ))}
      </div>
      {showEmptyState && (
        <div className="flex flex-col items-center gap-12">
          <ImageAdaptive src={ErrorImg} alt="No search results" />
        </div>
      )}
    </>
  );
}
