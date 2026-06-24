import { RegisterForm } from './components/RegisterForm.js';
import { FormValidator } from './validators/FormValidator.js';
import { ApiService } from './services/ApiService.js';

// Dependency Injection — wire everything here, not inside the classes.
const api       = new ApiService('http://localhost:8080');
const validator = new FormValidator();

new RegisterForm('register-form', validator, api);
