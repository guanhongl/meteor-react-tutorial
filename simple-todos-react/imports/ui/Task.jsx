import React from 'react';

const Task = (props) => {
    return (
        <li>
            <input
                type='checkbox'
                checked={!!props.task.isChecked} //!! converts object to boolean (false if falsey)
                onClick={() => props.handleCheck(props.task)}
                readOnly
            />
            <span>{props.task.text}</span>
            <button onClick={() => props.deleteTask(props.task._id)}>&times;</button>
        </li>
    );
}

export default Task;
