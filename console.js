// vim: tw=120 softtabstop=4 shiftwidth=4

let fs = require('fs')
let tracer = require('tracer');

let config = require('./config');

let console_fmt = "{{timestamp}} {{title}} {{message}}";
if (config.DEBUG)
    console_fmt = "{{timestamp}} {{title}} {{file}}:{{line}}{{space}} {{message}}";

let console_config = {
    format : [ console_fmt ],
    dateformat: 'mmm dd HH:MM:ss',
    preprocess :  function(data){
        switch (data.title) {
            case 'debug': data.title = ' '; break;
            case 'log': data.title = ' '; break;
            case 'info': data.title = ' '; break;
            case 'warn': data.title = '!'; break;
            case 'error': data.title = '!!!!!'; break;
        }
        if (config.DEBUG) data.space = " ".repeat(Math.max(0, 30 - `${data.file}:${data.line}`.length));
    }
};

if (config.logfile) {
    let real_console = require('console');
    console_config.transport = (data) => {
        real_console.log(data.output);
        fs.open(config.logfile, 'a', parseInt('0644', 8), function(e, id) {
            fs.write(id, data.output+"\n", null, 'utf8', function() {
                fs.close(id, () => { });
            });
        });
    }
}

exports.console = tracer.colorConsole(console_config);
