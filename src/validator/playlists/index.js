const InvariantError = require('../../exceptions/InvariantError');
const {
  PlaylistPayloadSchema,
  SongFromPlaylistPayloadSchema,
} = require('./schema');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongFromPlaylistPayload: (payload) => {
    const validationResult = SongFromPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
