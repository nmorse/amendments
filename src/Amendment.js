import React from 'react';
import { useMachine } from '@xstate/react';
import { amendmentMachine } from './AmendmentMachine';
import { diffText } from './diffHelper'

export function HandlesEvent({ children, event, current }) {
  const expected = Array.isArray(event) ? event : [event];
  return expected.some(expectedEvent => current.nextEvents.some(ne => (ne === expectedEvent)))
    ? <span>{children}</span>
    : null;
};
export function InState({ children, state, current }) {
  const expected = Array.isArray(state) ? state : [state];
  return expected.some(value => current.matches(value))
    ? <div>{children}</div>
    : null;
};

export const Amendment = () => {
  const [current, send] = useMachine(amendmentMachine);

  return (
    <div>
      <div>
        <InState state="editing" current={current}>
          <input value={current.context.modifiedText}
            onChange={e => send("CHANGE", { value: e.target.value })}
          />
        </InState>
        <InState state="review" current={current}>
          <div dangerouslySetInnerHTML={{ __html: diffText(current.context.originalText, current.context.modifiedText)}} />
        </InState>
        diffText()
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