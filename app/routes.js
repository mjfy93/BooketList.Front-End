export default [
    { path: '/', file: 'routes/_index.jsx' },
    { path: '/libros', file: 'routes/_libros.jsx' },
    { path: '/autores', file: 'routes/_autores.jsx' },
    { path: '/autores/:authorId', file: 'routes/autor.$authorId.jsx' },
    { path: '/generosTodos', file: 'routes/_generosTodos.jsx' },
    { path: '/genero/:slug', file: 'routes/genero.$slug.jsx' },
    { path: '/detalle/:bookId', file: 'routes/detalle.$bookId.jsx' },
    { path: '/login', file: 'routes/login.jsx' },
    { path: '/register', file: 'routes/register.jsx' },
    { path: '/libros/:bookId/resena', file: 'routes/$bookId.resena.jsx' }, 
    { path: '/biblioteca', file: 'routes/_bibliotecaUsuario.jsx' },
    { path: '/profile', file: 'routes/user-profile.jsx' },
    { path: '/admin/login', file: 'routes/admin-login.jsx' },
    { path: '/admin', file: 'routes/admin-dashboard.jsx' },
    { path: '/admin/users', file: 'routes/admin-users.jsx' },
    { path: '/admin/books', file: 'routes/admin-books.jsx' },
    { path: '/admin/authors', file: 'routes/admin-authors.jsx' },
    { path: '/admin/books/new', file: 'routes/admin-new-book.jsx' },
    { path: '/admin/authors/new', file: 'routes/admin-new-author.jsx' },
    { path: '/admin/books/edit/:id', file: 'routes/admin-edit-book.jsx' },
    { path: '/admin/authors/:id/edit', file: 'routes/admin-edit-author.jsx' },
    { path: '/admin/authors/:id', file: 'routes/admin-author-detail.jsx' },
    { path: '/admin/users/:id', file: 'routes/admin-user-detail.jsx' },
    { path: '/admin/authors/:id/books', file: 'routes/admin-author-books.jsx' },
    

   
]
