import { combineReducers } from 'redux';
    const reducers = {
        todos(state = [], action) {
            const {type, payload} = action;

            switch(type) {
                case 'set':
                    return payload;
                case 'add':
                    return [...state, payload];
                case 'remove':
                    return state.filter(todo => {
                            return todo.id !== payload;
                        });
                case 'toggle':
                    return state.map(todo => {
                            return todo.id === payload
                                ? {
                                    ...todo,
                                    complete: !todo.complete,
                                }
                                : todo;
                        });
            }

            return state;
        },
        incrementCount(state = 0, action) {
            const {type} = action;
            switch(type) {
                case 'set':
                case 'add':
                    return state + 1;
            }

            return state;
        },
    };

export default combineReducers(reducers);