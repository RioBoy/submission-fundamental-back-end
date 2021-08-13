const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  register: async (
    server,
    { playlistSongsService, playlistsService, validator },
  ) => {
    const playlistSongsHadler = new PlaylistSongsHandler(
      playlistSongsService,
      playlistsService,
      validator,
    );
    server.route(routes(playlistSongsHadler));
  },
};
