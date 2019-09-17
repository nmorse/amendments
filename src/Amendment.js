import React from 'react';
import { useMachine } from '@xstate/react';
import { amendmentMachine } from './AmendmentMachine';

export function HandlesEvent({ children, event, current }) {
  const expected = Array.isArray(event) ? event : [event];
  return expected.some(expectedEvent => current.nextEvents.some(ne => (ne === expectedEvent)))
    ? <div>{children}</div>
    : null;
};

export const Amendment = () => {
  const [current, send] = useMachine(amendmentMachine);

  return (
    <div>
      <div>
      <HandlesEvent event="REVERT" current={current}>
        <button onClick={() => send('REVERT')}>
        REVERT
        </button>
      </HandlesEvent>
      </div>
      <div>
        {
          current.nextEvents.map(evt =>
            (<span>
              <button onClick={() => send(evt)}>
                {evt}
              </button>
            </span>
            )
          )
        }
      </div>
      <div>Now in state: {current.value}</div>
      <div>context: {JSON.stringify(current.context, null, " ")}</div>
    </div>
  );
}