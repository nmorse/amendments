import { Machine, assign } from 'xstate';

export 
const amendmentMachine = Machine({
    id: 'amendment',
    initial: 'unaltered',
    context: {
        accept: true,
        originalText: 'Cellphone use while operating a care will be punnishable by $5000 fine.',
        modifiedText: ''
    },
    states: {
        unaltered: {
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
            on: { REVERT: "tabled" }
        },
        editing: {
            entry: ['unaccepting', 'cp_orig_text'],
            on: {
                REVERT: 'unaltered',
                REVIEW: 'review',
                CHANGE: {
                    actions: assign({
                        modifiedText: (ctx, e) => e ? e.value : ctx.modifiedText
                    })
                }
            }
        },
        review: {
            entry: ['unaccepting'],
            on: {
                REVERT: "unaltered", 
                EDIT: 'editing',
                VOTETOPASS: 'forApproval'
            }
        },
        forApproval: {
            entry: 'accepting',
            on: { REVERT: "review" }
        }
    }
}
    , {
        actions: {
            accepting: assign({ accept: true }),
            unaccepting: assign({ accept: false }),
            cp_orig_text: assign((ctx) => ({
                modifiedText: ctx.modifiedText ? ctx.modifiedText : ctx.originalText
            }))
        }
    }
);
