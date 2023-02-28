const express = require('express');
const authRoute = require('./authRoute');
const tableRoute = require('./tableRoute');
const resultRoute = require('./resultRoute');
const studentRoute = require('./studentRoute');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/table',
        route: tableRoute,
    },
    {
        path: '/result',
        route: resultRoute,
    },
    {
        path: '/student',
        route: studentRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
