//  function wrapper(orgFunc) {

//    return async (...args)=> {
//       try {
//         console.log("inside wrapper");
//           await orgFunc(...args);
//       } catch (error) {
//         console.error(error);
//         throw error;
//       }
//     }
  
// }


const wrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}
export default wrapper;