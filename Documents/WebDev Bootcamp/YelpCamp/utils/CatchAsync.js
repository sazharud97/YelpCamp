//? pass in function, return same function 
//? but with try-catch-next implemented for error handling
//? basically error-handling wrapper
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}