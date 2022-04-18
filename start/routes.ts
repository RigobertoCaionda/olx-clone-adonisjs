import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/user', 'UsersController.getUsers');
Route.get('/user/me', 'UsersController.me').middleware('auth');
Route.get('/user/:id', 'UsersController.getUser');
Route.delete('/user/me', 'UsersController.deleteAction').middleware('auth');
Route.put('/user/me', 'UsersController.editAction').middleware('auth');

Route.post('/user/signout', 'AuthController.signout').middleware('auth');
Route.post('/user/signup', 'AuthController.signup');
Route.post('/user/signin', 'AuthController.signin');

Route.get('/states', 'StatesController.getStates');

Route.get('/categories', 'CategoriesController.getCategories');

Route.get('/ad/list', 'AdsController.getList');
Route.get('/search', 'AdsController.search');
Route.get('/ad/:id', 'AdsController.getItem');
Route.post('/ad/add', 'AdsController.addAction').middleware('auth');
Route.put('/ad/:id', 'AdsController.editAction').middleware('auth');
Route.delete('/ad/:id', 'AdsController.deleteAction').middleware('auth');