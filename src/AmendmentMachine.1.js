import { Machine, assign } from 'xstate';


const makeChanges = {
    id: 'makeChanges',
    initial: 'editing',
    context: {
        modifiedText: ''
    },
    states: {
        editing: {
            entry: ['unaccepting', 'cp_orig_text'],
            on: {
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
                EDIT: 'editing'
            }
        }
    }
};

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
                EDIT: 'makeChanges'
            }
        },
        makeChanges: {
            on: {
                REVERT: 'unaltered',
                VOTETOPASS: 'forApproval'
            },
            ...makeChanges
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
        forApproval: {
            entry: 'accepting',
            on: { REVERT: "makeChanges.review" }
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
