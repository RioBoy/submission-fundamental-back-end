const { nanoid } = require('nanoid');
const songs = require('./songs');

const addSongHandler = (request, h) => {
  const { title, year, performer, genre, duration } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newSong = {
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt,
    updatedAt,
  };

  songs.push(newSong);

  const isSuccess = songs.filter((song) => song.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Lagu gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllSongsHandler = () => ({
  status: 'success',
  data: {
    songs: songs.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    })),
  },
});

const getSongByIdHandler = (request, h) => {
  const { songId } = request.params;
  const song = songs.filter((n) => n.id === songId)[0];

  if (song !== undefined) {
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Lagu tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editSongByIdHandler = (request, h) => {
  const { songId } = request.params;
  const { title, year, performer, genre, duration } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = songs.findIndex((song) => song.id === songId);

  if (index !== -1) {
    songs[index] = {
      ...songs[index],
      title,
      year,
      performer,
      genre,
      duration,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui lagu. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteSongByIdHandler = (request, h) => {
  const { songId } = request.params;
  const index = songs.findIndex((song) => song.id === songId);

  if (index !== -1) {
    songs.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Lagu gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addSongHandler,
  getAllSongsHandler,
  getSongByIdHandler,
  editSongByIdHandler,
  deleteSongByIdHandler,
};
