import React, { useState } from 'react';
import { TasksCollection } from '../api/TasksCollection';

export const TaskForm = (props) => {
    const [text, setText] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault(); //prevent reload

        if (text) {
            TasksCollection.insert({
                text: text.trim(),
                userId: props.user._id,
                createdAt: new Date()
            });
        }

        setText('');
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Type to add new tasks"
                value={text}
                onChange={(event) => setText(event.target.value)}
            />

            <button type="submit">Add Task</button>
        </form>
    );
};
