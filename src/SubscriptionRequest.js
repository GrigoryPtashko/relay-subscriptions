/* @flow */

import printQuery from 'react-relay/lib/printRelayQuery';
import RelayQuery from 'react-relay/lib/RelayQuery';

import type {
  PrintedQuery,
  SubscriptionRequestObserver,
  SubscriptionResult,
  Variables,
} from './types';
import type Subscription from './Subscription';

export default class SubscriptionRequest {
  _printedQuery: ?PrintedQuery;
  _subscription: RelayQuery.Subscription;
  _observer: SubscriptionRequestObserver;
  _originalSubscription: Subscription<any>;

  constructor(
    subscription: RelayQuery.Subscription,
    observer: SubscriptionRequestObserver,
    originalSubscription: Subscription<any>
  ) {
    this._printedQuery = null;
    this._subscription = subscription;
    this._observer = observer;
    this._originalSubscription = originalSubscription;
  }

  getDebugName(): string {
    return this._subscription.getName();
  }

  getVariables(): Variables {
    return this._getPrintedQuery().variables;
  }

  getQueryString(): string {
    return this._getPrintedQuery().text;
  }

  _getPrintedQuery(): PrintedQuery {
    if (!this._printedQuery) {
      this._printedQuery = printQuery(this._subscription);
    }

    return this._printedQuery;
  }

  getClientSubscriptionId(): string {
    return this._subscription.getVariables().input.clientSubscriptionId;
  }

  getOriginalSubscription(): Subscription<any> {
    return this._originalSubscription;
  }

  onNext(payload: SubscriptionResult) {
    this._observer.onNext(payload);
  }

  onError(error: any) {
    this._observer.onError(error);
  }

  onCompleted(value: any) {
    this._observer.onCompleted(value);
  }
}
