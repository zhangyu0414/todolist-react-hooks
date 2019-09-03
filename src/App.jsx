import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from 'react';
import {
    createSet,
    createAdd,
    createRemove,
    createToggle,
} from './actions';
import { bindActionCreators, createStore } from 'redux';
import { connect } from 'react-redux';
import reducer from './reducers';
import './App.css';

const Control = memo(function Control(props) {
    const { addTodo } = props;
    const inputRef = useRef();

    const onSubmit = (e) => {
        e.preventDefault();

        const newText = inputRef.current.value.trim();

        if (newText.length === 0) {
            return;
        }

        addTodo(newText);

        inputRef.current.value = '';
    };

    return (
        <div className="control">
            <h1>
                todos
            </h1>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    ref={inputRef}
                    className="new-todo"
                    placeholder="What needs to be done?"
                />
            </form>
        </div>
    );
});

const TodoItem = memo(function TodoItem(props) {
    const {
        todo: {
            id,
            text,
            complete,
        },
        removeTodo,
        toggleTodo
    } = props;

    const onChange = () => {
        toggleTodo(id);
    };

    const onRemove = () => {
        removeTodo(id);
    };

    return (
        <li className="todo-item">
            <input
                type="checkbox"
                onChange={onChange}
                checked={complete}
            />
            <label className={complete ? 'complete' : ''}>{ text }</label>
            <button onClick={onRemove}>&#xd7;</button>
        </li>
    );
});

const Todos = memo(function Todos(props) {
    const { todos, removeTodo, toggleTodo } = props;
    return (
        <ul>
        {
            todos.map(todo => {
                return (<TodoItem
                    key={todo.id}
                    todo={todo}
                    removeTodo={removeTodo}
                    toggleTodo={toggleTodo}
                />);
            })
        }
        </ul>
    );
});

const LS_KEY = '_$-todos_';


// const store = createStore(reducer, {
//     todos: [],
//     incrementCount: 0,
// });

const App = connect(
    function mapStateToProps(state) {
        return {
            todos: state.todos,
        };
    },
    function mapDispatchToProps(dispatch) {
        return bindActionCreators({
            addTodo: createAdd,
            removeTodo: createRemove,
            toggleTodo: createToggle,
            setTodos: createSet,
        }, dispatch);
    }
    )(TodoList);

function TodoList(props) {
    const {
        todos,
        addTodo,
        removeTodo,
        toggleTodo,
        setTodos,
    } = props;

    useEffect(() => {
        const todos = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        setTodos(todos);
    }, []);

    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(todos));
    }, [todos]);

    return (
        <div className="todo-list">
            <Control addTodo={addTodo}/>
            <Todos
                removeTodo={removeTodo}
                toggleTodo={toggleTodo}
                todos={todos}
            />
        </div>
    );
}

export default App;
