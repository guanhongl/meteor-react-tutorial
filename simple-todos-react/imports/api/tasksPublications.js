import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/db/TasksCollection';

// 'tasks' = collection name, func = called on subscribe
Meteor.publish('tasks', function publishTasks() { // use function to access 'this'
    return TasksCollection.find({ userId: this.userId }); // publish current user tasks
});
