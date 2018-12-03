const server = require('http').createServer();
const io = require('socket.io')(server, { origins: (orig, call) => call(null, true) });
const uuid = require('uuid/v1');
var JsonDB = require('node-json-db');
var db = new JsonDB("planning", true, false);

// db.push("/tasks", [], true);
// db.push("/users", [], true);

const path = require('path').dirname(require.main.filename);
const file = path + '/tasks.json';
let tasks = [];
let users = [];

io.on('connection', client => {
    console.log((new Date()) + ' new client connected!');

    client.emit('tasks', tasks);
    client.on('tasks', (task) => {
        const index = tasks.findIndex(e => e.id === task.id);
        if (index !== undefined) {
            tasks[index] = task;
            db.push(`/tasks[${index}]`, task, true);
            io.emit('tasks', tasks);
        }
    });

    client.on('addTasks', (newTask) => {
        console.log('add task', newTask.name);
        if (newTask.label && newTask.label !== '') {
            newTask.id = uuid();
            db.push("/tasks[]", newTask, true);
            tasks = db.getData('/tasks');
            io.emit('tasks', tasks);
        }
    });

    client.on('rmTasks', (task) => {
        console.log('rm task', task.name);
        if (task.id && task.id !== '') {
            const storedTasks = db.getData('/tasks');
            const idxMatch = storedTasks.findIndex(s => s.id === task.id);
            if (idxMatch > -1) {
                db.delete(`/tasks[${idxMatch}]`);
                tasks = db.getData('/tasks');
                io.emit('tasks', tasks);
            }
        }
    });

    client.on('registerUser', user => {
        console.log('register user', user.name, user.id);
        if (user.name) {
            const index = users.findIndex(u => u.id === user.id);
            if (index < 0) { // put in session
                user.connectionId = client.id;
                users.push(user);
            } else {
                users[index] = user;
            }
            
            const storedUsers = db.getData('/users');
            const idxStored = storedUsers.findIndex(u => u.id === user.id && u.name === user.name);
            if (idxStored) {
                db.push(`/users[${idxStored}]`, user, true);
            } else {
                db.push("/users[]", user, true);
            }

            user.connectionId = client.id;
        } else {
            user.connectionId = client.id;
            users.push(user);
        }
        io.emit('users', users);
    });
    client.on('disconnect', obj => {
        console.log('client disconnected', obj);
        users = users.filter(u => u.connectionId !== client.id);
        io.emit('users', users);
    });
});

server.listen(3000, () => console.log('Server starting listen port 3000')); 