// Pure "are any live signals present" check for the trending route, split out so
// it can be unit-tested without React.

export type SignalState = {
  votes?: boolean;
  community?: boolean;
  intent?: boolean;
};

/** True when any of the vote / community / intent live signals are available. */
export function hasLiveSignals(signals?: SignalState): boolean {
  return Boolean(signals?.votes || signals?.community || signals?.intent);
}
