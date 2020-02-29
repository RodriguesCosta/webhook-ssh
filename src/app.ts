import './bootstrap';
import './config/auth';
import server from './config/server';
import Routes from './routes/Routes';
server.applyRoute('/', Routes);
server.initServer();
