
const setCorsHeaders = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://housing-unit-bill-record.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
};

export default setCorsHeaders;
