module.exports = function(err, req, res, next) {
    const code = err.code || 500;
    const error = code === 500 ? 'Internal Server Error' : err.error; //if code is 500, then inteneral server err, else err.error
    console.log(err.error || err.message);
    res.status(code).send({error});
};
