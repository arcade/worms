http = require('http')
connect = require('connect')
io = require('socket.io')

# Initialize connect
app = connect()
app.use connect.static(__dirname + '/public')
app.use connect.logger('dev')

app.listen(process.env.PORT ? 3000)
io.listen(app)
console.log("Connect server listening on port %d", app.address().port)
