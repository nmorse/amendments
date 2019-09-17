import React from 'react';
import { useMachine } from '@xstate/react';
import { toggleMachine } from './ToggleMachine';

export function InState({ children, state, current }) {
  // const [current] = useMachine(toggleMachine);
  const expected = Array.isArray(state) ? state : [state];

  return expected.some(value => current.matches(value))
    ? <div>{children}</div>
    : null;
};

export const Toggle = () => {
  const [current, send] = useMachine(toggleMachine);

  return (
    <div>
      <div>
        {
          current.nextEvents.map(e =>
            (<div>
              <button onClick={() => send(e)}>
                {e}
              </button>
            </div>
            )
          )
        }
      </div>
      <div>This thing is in the state: {current.value}</div>

      <InState state={['active', 'inactive']} current={current}>
        <button onClick={() => send('TOGGLE')}>
          {current.matches('inactive') ? 'On' : 'Off'}
        </button>
      </InState>

      <InState state="inactive" current={current}>
        <button onClick={() => send('OTHER')}>
          Other
        </button>
      </InState>

      <InState state="other" current={current}>
        <button onClick={() => send('INACTIVE')}>
          Off
        </button>
        <button onClick={() => send('ACTIVE')}>
          On
        </button>
      </InState>
    </div>
  );
}