fs = require 'fs'
{spawn, exec} = require 'child_process'

run = (args) ->
    proc = spawn 'coffee', args
    proc.stderr.on 'data', (buffer) -> console.log buffer.toString()
    proc.on 'exit', (status) ->
        process.exit(1) if status != 0

task 'build', 'build the client side scripts', build = (cb) ->
    files = fs.readdirSync 'src'
    run ['-c', '-o', 'public/scripts', 'src']
