import express from 'express';
const Routes = express.Router();
import sSHController from '../controllers/SSHController';
import auth from '../middlewares/auth';

Routes.post('/ssh', auth, sSHController.store);
Routes.get('/ssh', auth, sSHController.index);

Routes.post('/ssh/:id', sSHController.show);

export default Routes;
