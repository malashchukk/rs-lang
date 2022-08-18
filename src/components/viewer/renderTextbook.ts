import crudApi from '../controller/CRUD/CrudApi';

crudApi.createItem({endpoint: "/users"}, {
  name: "fuckYou333",
  email: "reject@gmail.com",
  password: "assWorld"
})