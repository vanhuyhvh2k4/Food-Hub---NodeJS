import authRouter from './auth.route.js';
const baseURL = process.env.BASE_URL;

function route (app) {
    app.use(`${baseURL}/auth`, authRouter);
}

export default route;
