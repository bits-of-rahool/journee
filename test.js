import wrapper from "./src/utils/wrapper.js";

function add (a,b,c){
    const res=a+b+c;
    console.log(res)
    return null;
}   

const wrappedAdd = wrapper(add);
console.log(wrappedAdd (1,2,3))
