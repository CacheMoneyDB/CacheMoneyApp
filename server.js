const http = require('http');
const port = process.env.PORT || 9001;
const app = require('./lib/app');
require('./lib/setup-mongoose');

const server = http.createServer(app);
server.listen(port, () => {
    console.log('server currently listening on', server.address().port);
});