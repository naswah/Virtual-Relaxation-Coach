import { useState } from 'react';
import './Register.css';
function Register (){

    const [form, setForm] = useState({name: "", email: "", password:"",repassword:"", phone:""});

    const handleChange = e =>
        setForm({...form, [e.target.name]: e.target.value});   //...form copies existing valus
    // [e.target.name]: e.target.value => updates only the selected field like either email or password
    //e.target.name: "name"        e.target.value:"nash123"

    const handleSubmit= async (e) =>{   //for sending POST request to backend
        e.preventDefault();
       const res= await fetch("http://localhost:5000/register", {
        method: "POST",
        headers:{ "Content-Type": "application/json"}, //backend lai json data pathauna lako bhaneko
        body: JSON.stringify(form), //form ma bhako elements lai json type ma convert gareko before sending to backend
       });

    const data= await res.text();
    alert(data);
    }

    return(
        <>
        <h2>Register Now!</h2>
        <div className= "container" >
            <div className="box form-box">
                <form onSubmit={handleSubmit}>
                <div className="field input">
                    <label htmlFor="FullName">Your Full Name:</label>
                    <input type="text" name="name" id="name" onChange={handleChange}/>
                </div>

                <div className="field input">
                    <label htmlFor="email">Enter your Email:</label>
                    <input type="email" name="email" id="reggister-email" onChange={handleChange}/>
                </div>

                <div className="field input">
                    <label htmlFor="password"> Create a Password:</label>
                    <input type="password" name="password" id="register-password" onChange={handleChange}/>
                </div>

                <div className="field input">
                    <label htmlFor="repassword"> Retype your password:</label>
                    <input type="password" name="repassword" id="register-repassword" onChange={handleChange}/>
                </div>

                <div className="field input">
                    <label htmlFor="phone">Your phone:</label>
                    <input type="text" name="phone" id="phone" onChange={handleChange}/>
                </div>

                <div className="field">
                    <input type="submit" className="btn" name="submit" value="Sign Up"/>
                </div>

            </form>
            </div>
        </div>
        </>
    );
}
export default Register