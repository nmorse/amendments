import React from 'react';
import { useMachine } from '@xstate/react';
import { amendmentMachine } from './AmendmentMachine';


export const Amendment = () => {
  const [current, send] = useMachine(amendmentMachine);

  return (
    <div>
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