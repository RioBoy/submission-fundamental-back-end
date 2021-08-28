const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    await this._cacheService.delete(`playlists:${playlistId}`);
    return result.rows[0].id;
  }

  async getSongsPlaylist(playlistId) {
    try {
      // mendapatkan catatan dari cache
      const result = await this._pool.get(`playlists:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      // bila gagal, diteruskan dengan mendapatkan playlist dari database
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer FROM songs 
        INNER JOIN playlistsongs ON playlistsongs.song_id = songs.id
        INNER JOIN playlists ON playlistsongs.playlist_id = playlists.id
        WHERE playlists.id = $1`,
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      if (!result.rows) {
        throw new InvariantError('Gagal menampilkan lagu dari playlist');
      }

      // playlist akan disimpan pada cache sebelum fungsi getSongPlaylist dikembalikan
      await this._cacheService.set(
        `playlists:${playlistId}`,
        JSON.stringify(result),
      );

      return result.rows;
    }
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }

    await this._cacheService.delete(`playlists:${playlistId}`);
  }
}

module.exports = PlaylistSongsService;
