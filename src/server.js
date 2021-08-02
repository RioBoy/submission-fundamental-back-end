const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const SongsService = require('./services/inMemory/SongsService');
const SongsValidator = require('./validator/songs');

const init = async () => {
  const songsService = new SongsService();
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
