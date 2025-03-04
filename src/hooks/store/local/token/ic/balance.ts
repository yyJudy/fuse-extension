import { anonymous } from '@choptop/haw';
import { useCallback, useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import type { Storage } from '@plasmohq/storage';

import { useCachedStoreData, type DataMetadata } from '~hooks/store/metadata';
import { icrc1_balance_of } from '~lib/canisters/icrc1';

import { LOCAL_KEY_TOKEN_BALANCE_IC } from '../../../keys';

// ! always try to use this value to avoid BLINK
type DataType = Record<string, string>; // <prefix>:balance:ic:address => [canister_id => balance]
const get_key = (principal: string): string => LOCAL_KEY_TOKEN_BALANCE_IC(principal);
const get_default_value = (): DataType => ({});
const cached_value: Record<string, DataType> = {};
const get_cached_value = (principal: string): DataType => cached_value[principal] ?? get_default_value();
const set_cached_value = (value: DataType, principal: string): DataType => (cached_value[principal] = value);
const meta: DataMetadata<DataType, string> = {
    get_key,
    get_default_value,
    get_cached_value,
    set_cached_value,
};

// token balance ic -> // * local
export const useTokenBalanceIcInner = (
    storage: Storage,
    principal: string,
): [DataType, (value: DataType) => Promise<void>] => useCachedStoreData(storage, meta, principal);

export const useTokenBalanceIcByRefreshingInner = (
    storage: Storage,
    principal: string | undefined,
    canister_id: string,
): [string | undefined, { refreshBalance: () => void }] => {
    const [balances, setBalances] = useTokenBalanceIcInner(storage, principal ?? '');

    const [balance, setBalance] = useState<string>(balances[canister_id]);

    // init
    useEffect(() => {
        if (!storage) return;
        if (balance !== undefined) return;
        if (principal === undefined) return;
        icrc1_balance_of(anonymous, canister_id, { owner: principal }).then((balance) => {
            setBalance(balance);
            setBalances({ ...balances, [canister_id]: balance });
        });
    }, [storage, balance, balances, setBalances, canister_id, principal]);

    // refresh
    const refreshBalance = useCallback(() => {
        if (!storage) return;
        if (!principal) return;
        icrc1_balance_of(anonymous, canister_id, { owner: principal }).then((balance) => {
            setBalance(balance);
            setBalances({ ...balances, [canister_id]: balance });
        });
    }, [storage, principal, balances, setBalances, canister_id]);

    // schedule
    useInterval(() => refreshBalance(), 5000);

    return [balance, { refreshBalance }];
};
