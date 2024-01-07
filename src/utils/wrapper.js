function wrapper(orgFunc){
    return function(...args)
    {   
        try {
           orgFunc(...args);
        } catch (error) {
           return console.log("error in wrapper is : "+error)
        }
    }
}
export default wrapper;