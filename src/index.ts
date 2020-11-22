import {createDb} from './db';
import {createServer} from './server';

createDb();
const server = createServer();
server.listen(8000, () => console.log('Server started on port 8000'));
