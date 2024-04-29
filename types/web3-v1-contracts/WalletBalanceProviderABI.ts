/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from "bn.js";
import type { ContractOptions } from "web3-eth-contract";
import type { EventLog } from "web3-core";
import type { EventEmitter } from "events";
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export interface WalletBalanceProviderABI extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): WalletBalanceProviderABI;
  clone(): WalletBalanceProviderABI;
  methods: {
    balanceOf(user: string, token: string): NonPayableTransactionObject<string>;

    batchBalanceOf(
      users: string[],
      tokens: string[]
    ): NonPayableTransactionObject<string[]>;

    getUserWalletBalances(
      provider: string,
      user: string
    ): NonPayableTransactionObject<{
      0: string[];
      1: string[];
    }>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}
