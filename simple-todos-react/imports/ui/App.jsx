import { Meteor } from 'meteor/meteor';
import React, {useState, Fragment} from 'react';
// import { Hello } from './Hello.jsx';
// import { Info } from './Info.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/db/TasksCollection';
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
    const [hideComplete, setHideComplete] = useState(false);

    // get authenticated user or null
    const user = useTracker(() => Meteor.user());

    // hide completed tasks; show uncompleted tasks
    const hideCompleteFilter = { isChecked: { $ne: true } }; // filter by isChecked !== true;
                                                             // $ne used b/c isChecked may be undefined
    const userFilter = user ? { userId: user._id } : {};

    // // useTracker to get changes from the publication
    // const handler = useTracker(() => Meteor.subscribe('tasks'));
    //
    // // react hook; tracker = reactivity; re-render component on TasksCollection change
    // const tasks = useTracker(() => {
    //     if (!user) {
    //         return [];
    //     }
    //
    //     // return tasks that belong to user
    //     return TasksCollection.find(hideComplete ? {...hideCompleteFilter, ...userFilter} : userFilter,
    //         { sort: { createdAt: -1 } }).fetch();
    // });
    //
    // // count uncompleted tasks that belong to user
    // const pendingCount = useTracker(() => {
    //     if (!user) {
    //         return 0;
    //     }
    //
    //     return TasksCollection.find({ ...hideCompleteFilter, ...userFilter }).count();
    // });

    // bundle useTracker
    // uses obj destructuring; task, pendingCount, and isLoading will get their values from the returned obj
    const { tasks, pendingCount, isLoading } = useTracker(() => {
        // const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
        if (!Meteor.user()) {
            return { tasks: [], pendingCount: 0 };
        }
        const handler = Meteor.subscribe('tasks');

        if (!handler.ready()) {
            return { tasks: [], pendingCount: 0, isLoading: true };
        }

        const tasks = TasksCollection.find(
            hideComplete ? {...hideCompleteFilter, ...userFilter} : userFilter,
            {
                sort: { createdAt: -1 },
            }
        ).fetch();
        const pendingCount = TasksCollection.find({ ...hideCompleteFilter, ...userFilter }).count();

        return { tasks, pendingCount };
    });

    const handleCheck = ({ _id, isChecked }) => {
        // TasksCollection.update(_id, {
        //     $set: {
        //         isChecked: !isChecked
        //     }
        // });
        Meteor.call('tasks.setIsChecked', _id, !isChecked);
    };

    const deleteTask = (id) => {
        // TasksCollection.remove(id);
        Meteor.call('tasks.remove', id);
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
                        <TaskForm />
                        <div className='filter'>
                            <button onClick={() => setHideComplete(!hideComplete)}>
                                {hideComplete ? 'Show All' : 'Hide Completed'}
                            </button>
                        </div>

                        {isLoading && <div className="loading">loading...</div>}

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
