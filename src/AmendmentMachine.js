import { Machine, assign } from 'xstate';

export const amendmentMachine = Machine({
    id: 'amendment',
    initial: 'unaltered',
    context: { accept: true },
    states: {
        unaltered: {
            // type: 'final',
            entry: 'accepting',
            on: {
                TABLE: 'tabled',
                EDIT: 'editing'
            }
        },
        tabled: {
            entry: 'unaccepting',
            on: {
                REVERT: 'unaltered',
                VOTETOKILL: 'forRetraction'
            }

        },
        forRetraction: {
            entry: 'accepting',
            // type: 'final',
            on: { REVERT: "tabled" }
        },
        editing: {
            entry: 'unaccepting',
            on: {
                REVERT: 'unaltered',
                REVIEW: 'review'
            }
        },
        review: {
            entry: 'unaccepting',
            on: {
                REVERT: "unaltered", EDIT: 'editing',
                VOTETOPASS: 'forApproval'
            }
        },
        forApproval: {
            entry: 'accepting',
            // type: 'final',
            accepting: true,
            on: { REVERT: "review" }
        }
    }
}
, {
    actions: {
      accepting: assign({ accept: true }),
      unaccepting: assign({  accept: false })
    }
  }
);
