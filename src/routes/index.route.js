import authRouter from './auth.route.js';
import homeRouter from './home.route.js';
import shopRouter from './shop.route.js';
const baseURL = process.env.BASE_URL;

function route (app) {

    app.use(`${baseURL}/auth`, authRouter);

    app.use(`${baseURL}/home`, homeRouter);

    app.use(`${baseURL}/shop`, shopRouter);
}

export default route;
