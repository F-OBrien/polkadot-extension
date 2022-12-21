// Copyright 2019-2022 @subwallet/extension-koni-base authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint @typescript-eslint/no-empty-interface: "off" */

import { _ChainInfo } from '@subwallet/extension-koni-base/services/chain-list/types';
import Web3 from 'web3';

import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsicFunction } from '@polkadot/api/promise/types';
import { ChainProperties, ChainType } from '@polkadot/types/interfaces';
import { Registry } from '@polkadot/types/types';

export interface _DataMap {
  chainInfoMap: Record<string, _ChainInfo>,
  chainStateMap: Record<string, _ChainState>
}

export enum _ConnectionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  UNSTABLE = 'UNSTABLE'
}

export interface _ChainState {
  slug: string,
  active: boolean,
  currentProvider: string,
  connectionStatus: _ConnectionStatus
}

export interface _SubstrateDefaultFormatBalance {
  decimals?: number[] | number;
  unit?: string[] | string;
}

export interface _ChainBaseApi {
  chainSlug: string;
  apiUrl: string;

  apiError?: string;
  apiRetry?: number;
  isApiReady: boolean;
  isApiReadyOnce: boolean;
  isApiConnected: boolean; // might be redundant
  isApiInitialized: boolean;
  isDevelopment?: boolean;
  recoverConnect?: () => void;

  isReady: Promise<any>; // to be overwritten by child interface
}

export interface _SubstrateChainMetadata {
  properties: ChainProperties;
  systemChain: string;
  systemChainType: ChainType;
  systemName: string;
  systemVersion: string;
}

export interface _SubstrateApiState {
  apiDefaultTx?: SubmittableExtrinsicFunction;
  apiDefaultTxSudo?: SubmittableExtrinsicFunction;
  defaultFormatBalance?: _SubstrateDefaultFormatBalance;
}

export interface _SubstrateApi extends _SubstrateApiState, _ChainBaseApi {
  api: ApiPromise;
  isNotSupport?: boolean;

  isReady: Promise<_SubstrateApi>;

  specName: string;
  specVersion: string;
  systemChain: string;
  systemName: string;
  systemVersion: string;
  registry: Registry;
}

export interface _EvmApi extends _ChainBaseApi {
  api: Web3;

  isReady: Promise<_EvmApi>;
}

export type _NetworkUpsertParams = {
  chainEditInfo: {
    chainType: string,
    currentProvider: string,
    name: string,
    providers: Record<string, string>,
    slug: string,
    symbol: string,
    blockExplorer?: string,
    crowdloanUrl?: string,
    priceId?: string
  },
  chainSpec: {
    // Substrate
    genesisHash: string,
    paraId: number | null
    addressPrefix: number,

    // EVM
    evmChainId: number | null,

    // Common
    existentialDeposit: string,
    decimals: number
  }
}

export const _CUSTOM_NETWORK_PREFIX = 'custom-';
