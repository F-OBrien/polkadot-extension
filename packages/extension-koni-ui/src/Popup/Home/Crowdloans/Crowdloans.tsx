import CrowdloanItem from "@polkadot/extension-koni-ui/Popup/Home/Crowdloans/CrowdloanItem";
import {CrowdloanItemType} from "@polkadot/extension-koni-ui/Popup/Home/types";
import {ThemeProps} from "@polkadot/extension-koni-ui/types";
import CrowdloanEmptyList from './EmptyList';
import React from "react";
import styled from "styled-components";
import {BalanceValueType, BN_ZERO, getLogoByNetworkKey} from "@polkadot/extension-koni-ui/util";
import BigN from "bignumber.js";
import NETWORKS from '@polkadot/extension-koni-base/api/endpoints';

interface Props extends ThemeProps {
  className?: string;
}

interface ContentProp {
  className?: string;
  items: CrowdloanItemType[];
}

const GroupDisplayNameMap: Record<string, string> = {
  'POLKADOT_PARACHAIN': 'Polkadot\'s parachain',
  'KUSAMA_PARACHAIN': 'Kusama\'s parachain'
}

function getItem(networkKey: string, contributeValueInfo: BalanceValueType): CrowdloanItemType {
  const networkInfo = NETWORKS[networkKey];
  const groupDisplayName = GroupDisplayNameMap[networkInfo.group] || '';
  const {
    balanceValue,
    convertedBalanceValue,
    symbol
  } = contributeValueInfo;

  return {
    contribute: balanceValue,
    contributeToUsd: convertedBalanceValue,
    logo: getLogoByNetworkKey(networkKey),
    networkDisplayName: networkInfo.chain,
    networkKey,
    symbol,
    groupDisplayName
  }
}

function getItems(networkKeys: string[], crowdloanContributeMap: Record<string, BalanceValueType>, includeZeroBalance: boolean = false): CrowdloanItemType[] {
  const result: CrowdloanItemType[] = [];

  networkKeys.forEach(n => {
    const contributeValueInfo: BalanceValueType = crowdloanContributeMap[n]
      || {balanceValue: new BigN(0), convertedBalanceValue: new BigN(0)};

    if (!includeZeroBalance && !BN_ZERO.lt(new BigN(contributeValueInfo.convertedBalanceValue))) {
      return;
    }

    result.push(getItem(n, contributeValueInfo));
  })

  return result;
}

function getmockCrowdloanContributeMap(networkKeys: string[]): Record<string, BalanceValueType> {
  const result: Record<string, BalanceValueType> = {};

  networkKeys.forEach(n => {
    result[n] = {
      balanceValue: new BigN(50),
      convertedBalanceValue: new BigN(50),
      symbol: 'DOT'
    }
  })

  return result;
}

function Wrapper({className}: Props): React.ReactElement<Props> {
  const mockNetworks = [
    'statemint',
    'acala',
    'moonbeam',
    'clover',
    'hydradx',
    'statemine',
    'karura',
    'moonriver',
    'shiden',
    'khala',
    'bifrost',
  ];

  const items: CrowdloanItemType[] = [];

  if (!items.length) {
    return <CrowdloanEmptyList/>
  }

  return <Crowdloans className={className} items={items}/>
}

function Crowdloans({items, className}: ContentProp): React.ReactElement<ContentProp> {
  return (
    <div className={`crowdloan-items-container ${className}`}>
      {items.map(item => (
        <CrowdloanItem key={item.networkKey} item={item}/>
      ))}
    </div>
  )
}

export default styled(Wrapper)(({theme}: Props) => ``);
