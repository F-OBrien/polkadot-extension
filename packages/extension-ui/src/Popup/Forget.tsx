// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types.js';

import React, { useCallback, useContext, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { ActionBar, ActionContext, ActionText, Address, Button, Warning } from '../components/index.js';
import useTranslation from '../hooks/useTranslation.js';
import { forgetAccount } from '../messaging.js';
import { Header } from '../partials/index.js';
import { styled } from '../styled.js';

interface Props extends RouteComponentProps<{ address: string }>, ThemeProps {
  className?: string;
}

function Forget ({ className, match: { params: { address } } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const onAction = useContext(ActionContext);
  const [isBusy, setIsBusy] = useState(false);

  const _goHome = useCallback(
    () => onAction('/'),
    [onAction]
  );

  const _onClick = useCallback(
    (): void => {
      setIsBusy(true);
      forgetAccount(address)
        .then(() => {
          setIsBusy(false);
          onAction('/');
        })
        .catch((error: Error) => {
          setIsBusy(false);
          console.error(error);
        });
    },
    [address, onAction]
  );

  return (
    <>
      <Header
        showBackArrow
        text={t<string>('Forget account')}
      />
      <div className={className}>
        <Address address={address}>
          <Warning className='movedWarning'>
            {t<string>('You are about to remove the account. This means that you will not be able to access it via this extension anymore. If you wish to recover it, you would need to use the seed.')}
          </Warning>
          <div className='actionArea'>
            <Button
              isBusy={isBusy}
              isDanger
              onClick={_onClick}
            >
              {t<string>('I want to forget this account')}
            </Button>
            <ActionBar className='withMarginTop'>
              <ActionText
                className='center'
                onClick={_goHome}
                text={t<string>('Cancel')}
              />
            </ActionBar>
          </div>
        </Address>
      </div>
    </>
  );
}

export default withRouter(styled(Forget)`
  .actionArea {
    padding: 10px 24px;
  }

  .center {
    margin: auto;
  }

  .movedWarning {
    margin-top: 8px;
  }

  .withMarginTop {
    margin-top: 4px;
  }
`);
