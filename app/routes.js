export default [
    { path: '/', file: 'routes/_index.jsx' },
    { path: '/libros', file: 'routes/_libros.jsx' },
    { path: '/autores', file: 'routes/_autores.jsx' },
    { path: '/generosTodos', file: 'routes/_generosTodos.jsx' },
    { path: '/genero', file: 'routes/_genero.jsx' },
    { path: '/detalle', file: 'routes/_detalle.jsx' },
    { path: '/users', file: 'routes/users.jsx' },
    { path: '/contact', file: 'routes/contact.jsx' },
    { path: '/login', file: 'routes/login.jsx' },
    { path: '/register', file: 'routes/register.jsx' },
    { path: '/resena', file: 'routes/_resena.jsx' },
    { path: '/users', file: 'routes/users.jsx' },
    { path: '/biblioteca', file: 'routes/_bibliotecaUsuario.jsx' },
    {path: '/contact', file: 'routes/contact.jsx'},
    { path: '/login', file: 'routes/login.jsx' },          // Nueva ruta
    { path: '/register', file: 'routes/register.jsx' },    // Nueva ruta
    { path: '/admin/login', file: 'routes/admin-login.jsx' },
    { path: '/admin', file: 'routes/admin-dashboard.jsx' },
    { path: '/admin/users', file: 'routes/admin-users.jsx' },
    { path: '/admin/books', file: 'routes/admin-books.jsx' },
    { path: '/admin/authors', file: 'routes/admin-authors.jsx' },
    { path: '/admin/books/new', file: 'routes/admin-new-book.jsx' },
    { path: '/admin/authors/new', file: 'routes/admin-new-author.jsx' },
    
    // Rutas dinámicas
    //{ path: '/admin/books/edit/:id', file: 'routes/admin-edit-book.jsx' },
    //{ path: '/admin/authors/:id', file: 'routes/admin-author-detail.jsx' },
    //{ path: '/admin/users/:id', file: 'routes/admin-user-detail.jsx' },
    //{ path: '/admin/authors/:id/books', file: 'routes/admin-author-books.jsx' },

   
]
