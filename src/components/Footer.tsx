'use client';

import ArrowSvg from '@assets/svg/ArrowSvg';
import { GITHUB_LINK, ONCHAINKIT_LINK } from '@constants/links';
import { Separator } from '@radix-ui/themes';
import React from 'react';

const docLinks = [{ href: GITHUB_LINK, title: 'Github' }];

export default function Footer() {
  return (
    <React.Fragment>
      <footer>
        <Separator size={'4'} className="mt-[40px]" />
        <div className="mt-auto mb-2 flex w-full flex-col-reverse justify-between gap-2 md:mt-8 md:mb-6 md:flex-row">
          <aside className="flex items-center pt-2 md:pt-0">
            <h3 className="mr-2 mb-2 text-m md:mb-0">
              Built with{' '}
              <a
                href={ONCHAINKIT_LINK}
                target="_blank"
                rel="noreferrer"
                title="OnchainKit"
                className="font-semibold hover:text-indigo-600"
              >
                OnchainKit
              </a>
            </h3>
          </aside>
          <ul className="mt-4 flex max-w-full flex-col flex-wrap justify-center gap-3 md:mt-0 md:flex-row md:justify-start md:gap-6">
            {docLinks.map(({ href, title }) => (
              <li className="flex" key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  title={title}
                  className="flex items-center gap-1"
                >
                  <p>{title}</p>
                  <ArrowSvg />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </React.Fragment>
  );
}
