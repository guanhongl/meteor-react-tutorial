import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
// import { LinksCollection } from '/imports/api/links';
import { TasksCollection } from '../imports/db/TasksCollection';
import '/imports/api/tasksMethods';
import '/imports/api/tasksPublications';

// function insertLink({ title, url }) {
//   LinksCollection.insert({title, url, createdAt: new Date()});
// }

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

const insertTask = (taskText, user) => TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date()
});

Meteor.startup(() => {
  // // If the Links collection is empty, add some data.
  // if (LinksCollection.find().count() === 0) {
  //   insertLink({
  //     title: 'Do the Tutorial',
  //     url: 'https://www.meteor.com/tutorials/react/creating-an-app'
  //   });
  //
  //   insertLink({
  //     title: 'Follow the Guide',
  //     url: 'http://guide.meteor.com'
  //   });
  //
  //   insertLink({
  //     title: 'Read the Docs',
  //     url: 'https://docs.meteor.com'
  //   });
  //
  //   insertLink({
  //     title: 'Discussions',
  //     url: 'https://forums.meteor.com'
  //   });
  // }
    if (!Accounts.findUserByUsername(SEED_USERNAME)) {
        Accounts.createUser({
            username: SEED_USERNAME,
            password: SEED_PASSWORD
        });
    }

    if (!Accounts.findUserByUsername('steven')) {
        Accounts.createUser({
            username: 'steven',
            password: '123'
        });
    }

    const user = Accounts.findUserByUsername(SEED_USERNAME);

    // initialize 'meteorite' w/ 7 tasks
    if (TasksCollection.find().count() === 0) {
        [
            'First Task',
            'Second Task',
            'Third Task',
            'Fourth Task',
            'Fifth Task',
            'Sixth Task',
            'Seventh Task'
        ].forEach(text => insertTask(text, user));
    }
});
