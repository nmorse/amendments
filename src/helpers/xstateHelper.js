import React from 'react';

export function HandlesEvent({ children, event, current }) {
    const expected = Array.isArray(event) ? event : [event];
    return expected.some(expectedEvent => current.nextEvents.some(evt => (evt === expectedEvent)))
      ? <span>{children}</span>
      : null;
  };
  export function InState({ children, state, current }) {
    const expected = Array.isArray(state) ? state : [state];
    return expected.some(value => current.matches(value))
      ? <div>{children}</div>
      : null;
  };