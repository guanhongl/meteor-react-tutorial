import React from 'react';

const Task = (props) => {
    return (
        <li>{props.task.text}</li>
    );
}

export default Task;
