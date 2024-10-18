'use client';

import { type UserTrait, getBaseTraits } from '@/helpers/trait.helper';
import ecosystemApps from '@data/ecosystem.json';
import { List } from './List';

export type EcosystemApp = {
  searchName: string;
  name: string;
  url: string;
  description: string;
  tags: string[];
  imageUrl: string;
};

// const tags = ecosystemApps
//   .flatMap((app) => app.tags)
//   .filter((value, index, array) => {
//     return array.indexOf(value.toLocaleLowerCase()) === index;
//   });

function orderedEcosystemAppsAsc() {
  return ecosystemApps.sort((a, b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    }
    if (b.name.toLowerCase() > a.name.toLowerCase()) {
      return -1;
    }
    return 0;
  });
}

const decoratedEcosystemApps: EcosystemApp[] = orderedEcosystemAppsAsc().map(
  (d) => ({
    ...d,
    searchName: d.name.toLowerCase(),
  }),
);

type EcosystemContentProps = {
  firstTrait: UserTrait;
  secondTrait: UserTrait;
  thirdTrait: UserTrait;
};

export default function Content({
  firstTrait,
  secondTrait,
  thirdTrait,
}: EcosystemContentProps) {
  const recommendedTag = getBaseTraits([firstTrait, secondTrait, thirdTrait]);

  // TODO: Load filter result later
  const filteredEcosystemApps = decoratedEcosystemApps.filter((app) =>
    app.tags.includes(recommendedTag),
  );

  return (
    <div className="flex min-h-32 w-full flex-col gap-10 pb-32">
      <List apps={filteredEcosystemApps} />
    </div>
  );
}
