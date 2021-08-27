import React, {useState, Fragment} from 'react';
// import { Hello } from './Hello.jsx';
// import { Info } from './Info.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import Task from './Task.jsx';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';

// sample collection
// const tasks = [
//     {_id: 1, text: 'First Task'},
//     {_id: 2, text: 'Second Task'},
//     {_id: 3, text: 'Third Task'},
// ];

export const App = () => {
    // get authenticated user or null
    const user = useTracker(() => Meteor.user());

    const [hideComplete, setHideComplete] = useState(false);
    // hide completed tasks; show uncompleted tasks
    const hideCompleteFilter = { isChecked: { $ne: true } }; // filter by isChecked !== true;
                                                             // $ne used b/c isChecked may be undefined
    const userFilter = user ? { userId: user._id } : {};

    // react hook; tracker = reactivity; re-render component on TasksCollection change
    const tasks = useTracker(() => {
        if (!user) {
            return [];
        }

        // return tasks that belong to user
        return TasksCollection.find(hideComplete ? {...hideCompleteFilter, ...userFilter} : userFilter,
            { sort: { createdAt: -1 } }).fetch();
    });

    // count uncompleted tasks that belong to user
    const pendingCount = useTracker(() => {
        if (!user) {
            return 0;
        }

        return TasksCollection.find({ ...hideCompleteFilter, ...userFilter }).count();
    });

    const handleCheck = ({ _id, isChecked }) => {
        TasksCollection.update(_id, {
            $set: {
                isChecked: !isChecked
            }
        });
    };

    const deleteTask = (id) => {
        TasksCollection.remove(id);
    }

    const pendingTitle = pendingCount ? `(${pendingCount})` : '';

    return (
        <div className='app'>
            <header>
                <div className="app-bar">
                    <div className="app-header">
                        <h1>📝️ To Do List {pendingTitle}</h1>
                    </div>
                </div>
            </header>
            <div className='main'>
                {
                    user ?
                    <Fragment>
                        <div className='user'>
                            {user.username}
                            <u onClick={() => Meteor.logout()}>logout</u>
                        </div>
                        <TaskForm user={user} />
                        <div className='filter'>
                        <button onClick={() => setHideComplete(!hideComplete)}>
                            {hideComplete ? 'Show All' : 'Hide Completed'}
                        </button>
                        </div>
                        <ul className='tasks'>
                        {
                            tasks.map(task => <Task key={task._id} task={task}
                                                    handleCheck={handleCheck} deleteTask={deleteTask}/>)
                        }
                        </ul>
                    </Fragment>
                    :
                    <LoginForm />
                }
            </div>
        </div>
    );
}
