const signinBtn = document.getElementById("btn-signin");
const signupBtn = document.getElementById("btn-signup");
const myform = document.getElementById("myform")
const partOne = document.getElementById("part-one")
const partTwo = document.getElementById("part-two")
const p12 = document.getElementById("p12")
const signin = document.getElementById("signin")
const signup = document.getElementById("register")
signinBtn.addEventListener("click" , ()=>{
    partOne.style.transform="translateX(100%)";
    partTwo.style.transform="translateX(-100%)";    
    p12.style.display="flex"
    myform.style.display="none"
    signup.style.display="none"
    signin.style.display="flex"
})
signupBtn.addEventListener("click" , ()=>{
    partOne.style.transform="translateX(0)";
    partTwo.style.transform="translateX(0)"; 
    p12.style.display="none"
    myform.style.display="flex"
    signup.style.display="flex"
    signin.style.display="none"
 })