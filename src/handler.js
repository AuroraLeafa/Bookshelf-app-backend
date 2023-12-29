const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if(name === undefined) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400);
    return response;
  }

  if(pageCount < readPage){
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id == id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    }).code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  }).code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {

    const response = h.response({
        status: 'success',
        data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      }).code(200);
    return response;
  };

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  }).code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  if(name === undefined) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400);
    return response;
  }

  if(pageCount < readPage){
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id == id);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    }).code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  }).code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    }).code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  }).code(404);
  return response;
};
  
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
