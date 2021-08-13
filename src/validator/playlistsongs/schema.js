const Joi = require('joi');

const SongFromPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { SongFromPlaylistPayloadSchema };
