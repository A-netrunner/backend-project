

const asynchandeler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch
    ((err) => next(err))
    
  } 
  
};



// const asynchandler = (fn) => async (res, req, next) => {
//   try {
//     await fn(res, req, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
export default asynchandeler;
