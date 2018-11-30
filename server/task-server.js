const server = require('http').createServer();
const io = require('socket.io')(server);
const jsonfile = require('jsonfile');
const path = require('path').dirname(require.main.filename);
const file = path +'/tasks.json';
const tasks = [];

io.on('connection', client => {
    console.log((new Date()) + ' new client connected!');
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
            jsonfile.writeFile(file, tasks,  err => {
                if (err) console.error(err)
                else io.emit('tasks', tasks);
              });            
        } 
    });

  client.on('add', task => { 
        if (task !== undefined) {
            const len = tasks.length;
            task.id = tasks[len-1].id + 1;
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
  client.on('disconnect', client =>  console.log('client disconnected', client.origin));
});

jsonfile.readFile( file, (err, obj) => {
    if (err) console.log(err, 'Not found task.json');
    else {
        tasks.push(...obj);
        io.emit('tasks', tasks);
    }
 });

server.listen(3000, () => console.log('Server starting listen port 3000'));