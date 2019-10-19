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
                entry: ['accepting', 'cp_orig_text'],
                on: {
                    TABLE: 'tabled',
                    EDIT: 'amend.editing'
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
            warnRevert: {
                entry: 'unaccepting',
                on: {
                    PROCEED: "unaltered",
                    CANCEL: "amend.history"
                }
            },
            amend: {
                on: {
                    REVERT: [{ target: 'unaltered', cond: 'isUnaltered' }, { target: 'warnRevert' }]
                },
                id: 'amend',
                initial: 'editing',
                states: {
                    editing: {
                        entry: ['unaccepting'],
                        on: {
                            REVIEW: 'review',
                            CHANGE: {
                                actions: assign({
                                    modifiedText: (ctx, e) => e && e.value ? e.value : ctx.modifiedText
                                })
                            }
                        }
                    },
                    review: {
                        entry: ['unaccepting'],
                        on: {
                            EDIT: 'editing',
                            VOTETOPASS: 'forApproval'
                        }
                    },
                    forApproval: {
                        entry: 'accepting',
                        on: { REVERT: "review" }
                    },
                    history: {
                        type: 'history',
                        history: 'shallow' // optional; default is 'shallow'
                    }
                }
            }
        }
    }
        , {
            actions: {
                accepting: assign({ accept: true }),
                unaccepting: assign({ accept: false }),
                cp_orig_text: assign((ctx) => ({
                    modifiedText: ctx.originalText
                }))
            },
            guards: {
                isUnaltered: (ctx, e) => ctx.originalText === ctx.modifiedText
              }
        }
    );
