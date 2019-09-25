import React from 'react';
import { useMachine } from '@xstate/react';
import { amendmentMachine } from './AmendmentMachine';
import { diffText } from './helpers/diffHelper'
import { InState, HandlesEvent } from './helpers/xstateHelper'


export const Amendment = () => {
  const [current, send] = useMachine(amendmentMachine);

  return (
    <div>
      <div>
        <InState state="editing" current={current}>
          <textarea 
            onChange={e => send("CHANGE", { value: e.target.value })}
          children={current.context.modifiedText}></textarea>
        </InState>
        <InState state="review" current={current}>
          <div className="review" dangerouslySetInnerHTML={{ __html: diffText(current.context.originalText, current.context.modifiedText)}} />
        </InState>
      </div>
      <div>
        <HandlesEvent event="REVERT" current={current}>
          <button onClick={() => send('REVERT')}>
            Undo
        </button>
        </HandlesEvent>
        <HandlesEvent event="EDIT" current={current}>
          <button onClick={() => send('EDIT')}>
            Edit
        </button>
        </HandlesEvent>
      </div>
      <div>Now in state: {current.value}</div>
      <div>context: {JSON.stringify(current.context, null, " ")}</div>
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
    </div>
  );
}