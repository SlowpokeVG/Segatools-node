import { app } from './app';
import { getMongoClient } from './mongo';
import './passport';

import { IUser } from './models/user';

/* tslint:disable:interface-name */
declare module 'koa' {
  interface Context {
    state: {
      user: IUser;
      [key: string]: any;
    };
  }
}

import { config } from './config';

process.on('unhandledRejection', (reason, p) => {
  throw reason;
});

(async () => {
  await getMongoClient();

  app.listen(config.server.port, config.server.host, () => {
    console.log('server is running...');
  });
})();
