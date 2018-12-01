const server = require('http').createServer();
const io = require('socket.io')(server, { origins: (orig, call) => call(null, true) });
const jsonfile = require('jsonfile');
const path = require('path').dirname(require.main.filename);
const file = path + '/tasks.json';
const tasks = [];
let users = [];

function addUser(id) {
    const randonAvatar = Math.floor(Math.random() * 100);
    const user = {
        id: id,
        avatar: `https://api.adorable.io/avatars/${randonAvatar}`
    }
    users.push(user);
}

io.on('connection', client => {
    console.log((new Date()) + ' new client connected!');

    addUser(client.id);
    io.emit('users', users);
    client.emit('tasks', tasks);

    client.on('tasks', (task) => {
        const index = tasks.findIndex(e => e.id === task.id);
        if (index !== undefined) {
            tasks[index] = task;
            tasks.sort(a => {
                if (a.status === 'todo') return 1;
                else if (a.status === 'done') return -1;
                else return 0;
            });
            jsonfile.writeFile(file, tasks, err => {
                if (err) console.error(err)
                else io.emit('tasks', tasks);
            });
        }
    });

    client.on('add', task => {
        if (task !== undefined) {
            const len = tasks.length;
            task.id = tasks[len - 1].id + 1;
            tasks.push(task);
            io.emit('tasks', task);
        }
    });

    client.on('remove', task => {
        if (task !== undefined) {
            const index = tasks.findIndex(e => e.id === task.id);
            if (index) {
                task.splice(index, 1);
                io.emit('tasks', tasks);
            }
        }
    });

    client.on('users', obj => {
        console.log('a');
    });
    client.on('disconnect', obj => {
        console.log('client disconnected', obj);
        users = users.filter(u => u.id !== client.id);
        io.emit('users', users);
    });
});

jsonfile.readFile(file, (err, obj) => {
    if (err) console.log(err, 'Not found task.json');
    else {
        tasks.push(...obj);
        io.emit('tasks', tasks);
    }
});

server.listen(3000, () => console.log('Server starting listen port 3000')); 