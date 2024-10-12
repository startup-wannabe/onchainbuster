import Container from '@components/Container';
import Content from '@components/Ecosystem/Content';
import RotatingCircle from '@components/RotatingCircle';
import Title from '@components/typography/Title';
import { TitleLevel } from '@components/typography/Title/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://base.org'),
  title: 'Base | Ecosystem',
  openGraph: {
    title: 'Base | Ecosystem',
    url: '/ecosystem',
  },
};

async function EcosystemHero() {
  const generateKeys = (prefix: string, count: number) =>
    Array.from(
      { length: count },
      (_, i) => `${prefix}-${i}-${Math.random().toString(36).substr(2, 9)}`,
    );

  const topKeys = generateKeys('top', 4);
  const middleKeys = generateKeys('middle', 5);
  const bottomKeys = generateKeys('bottom', 4);

  return (
    <div className="flex w-full flex-col items-center overflow-hidden pb-20 pt-20">
      <Container>
        <div className="flex w-full  flex-col items-center justify-between gap-12 py-20 md:flex-row">
          <div className="flex w-full flex-col gap-8 md:max-w-lg">
            <Title level={TitleLevel.Display3}>
              Base ecosystem apps and integrations overview.
            </Title>
          </div>
          <div className="flex flex-col ">
            <div className="flex flex-shrink-0 justify-center gap-4">
              {topKeys.map((key, i) => (
                <div key={key} className="w-[80px] md:w-[100px]">
                  <RotatingCircle theme={i % 5} />
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              {middleKeys.map((key, i) => (
                <div key={key} className="w-[80px] md:w-[100px]">
                  <RotatingCircle theme={i % 5} />
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              {bottomKeys.map((key, i) => (
                <div key={key} className="w-[80px] md:w-[100px]">
                  <RotatingCircle theme={i % 5} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default async function Ecosystem() {
  return (
    <main className="flex w-full flex-col items-center">
      <EcosystemHero />

      <Container>
        <Content />
      </Container>
    </main>
  );
}
