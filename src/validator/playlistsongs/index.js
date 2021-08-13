const InvariantError = require('../../exceptions/InvariantError');
const { SongFromPlaylistPayloadSchema } = require('./schema');

const PlaylistSongsValidator = {
  validateSongFromPlaylistPayload: (payload) => {
    const validationResult = SongFromPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongsValidator;
