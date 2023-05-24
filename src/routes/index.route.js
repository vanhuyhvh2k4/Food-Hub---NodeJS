import authRouter from './auth.route.js';
import homeRouter from './home.route.js';
import shopRouter from './shop.route.js';
import foodRouter from './food.route.js';
import checkoutRouter from './checkout.route.js';
import searchRouter from './search.route.js';
const baseURL = process.env.BASE_URL;

function route (app) {

    app.use(`${baseURL}/auth`, authRouter);

    app.use(`${baseURL}/checkout`, checkoutRouter);

    app.use(`${baseURL}/home`, homeRouter);

    app.use(`${baseURL}/search`, searchRouter);

    app.use(`${baseURL}/shop`, shopRouter);

    app.use(`${baseURL}/food`, foodRouter);

}

export default route;
