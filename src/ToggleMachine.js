import { Machine } from 'xstate';


// This machine is decoupled from React (aka the UI)
export const toggleMachine = Machine({
  id: 'toggle',
  initial: 'inactive',
  context: { limit: 5 },
  states: {
    inactive: {
      on: { TOGGLE: 'active', OTHER: 'other' }
    },
    active: {
      on: { TOGGLE: 'inactive', OTHER: 'other' }
    },
    other: {
      on: { ACTIVE: 'active', INACTIVE: 'inactive' }
    }
  }
});