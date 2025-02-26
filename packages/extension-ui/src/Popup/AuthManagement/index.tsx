// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../../types.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { AuthUrlInfo, AuthUrls } from '@polkadot/extension-base/background/handlers/State';

import InputFilter from '../../components/InputFilter.js';
import useTranslation from '../../hooks/useTranslation.js';
import { getAuthList, removeAuthorization } from '../../messaging.js';
import { Header } from '../../partials/index.js';
import { styled } from '../../styled.js';
import WebsiteEntry from './WebsiteEntry.js';

interface Props extends ThemeProps {
  className?: string;
}

function AuthManagement ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [authList, setAuthList] = useState<AuthUrls | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getAuthList()
      .then(({ list }) => setAuthList(list))
      .catch((e) => console.error(e));
  }, []);

  const hasAuthList = useMemo(
    () => !!authList && !!Object.keys(authList).length,
    [authList]
  );

  const _onChangeFilter = useCallback((filter: string) => {
    setFilter(filter);
  }, []);

  const removeAuth = useCallback((url: string) => {
    removeAuthorization(url)
      .then(({ list }) => setAuthList(list))
      .catch(console.error);
  }, []);

  return (
    <>
      <Header
        showBackArrow
        smallMargin
        text={t<string>('Manage Website Access')}
      />
      <div className={className}>
        <InputFilter
          className='inputFilter'
          onChange={_onChangeFilter}
          placeholder={t<string>('example.com')}
          value={filter}
          withReset
        />
        {
          !authList || !hasAuthList
            ? <div className='empty-list'>{t<string>('No website request yet!')}</div>
            : (
              <>
                <div className='website-list'>
                  {Object
                    .entries<AuthUrlInfo>(authList)
                    .filter(([url]) => url.includes(filter))
                    .map(([url, info]) =>
                      <WebsiteEntry
                        info={info}
                        key={url}
                        removeAuth={removeAuth}
                        url={url}
                      />
                    )}
                </div>
              </>
            )
        }
      </div>
    </>
  );
}

export default styled(AuthManagement)`
  height: calc(100vh - 2px);
  overflow-y: auto;

  .empty-list{
    text-align: center;
  }

  .inputFilter{
    margin-bottom: 0.8rem;
    padding: 0 !important;
  }
`;
