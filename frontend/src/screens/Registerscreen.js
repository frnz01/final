import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

const Registerscreen = () => {
  const [name, setname] = useState("");
  const [address, setaddress] = useState("");
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [phonenumber, setphonenumber] = useState("");

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const [success, setsuccess] =useState();

  async function register(){
    if(password ===confirmpassword){
        const user={
            name,
            address,
            username,
            email,
            password,
            confirmpassword,
            phonenumber
        }
        try {
          setloading(true);
          const result = await axios.post('/api/users/register', user).data
          setsuccess(true);
          setloading(false);

          setname('');
          setaddress('');
          setusername('');
          setemail('');
          setpassword('');
          setconfirmpassword('');
          setphonenumber('');
        } catch (error) {
          console.log(error);
          setloading(false);
          seterror(true);
        }
    }else{
        alert('Password not match!')
    }
  }

  return (
    <div>
      {loading && (<Loader/>)}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
        {error && (<Error/>)}
        {success && (<Success message = "Registration Success"/>)}
          <div className="bs">
            <h2>Register</h2>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              required
              onChange={(e) => {
                setname(e.target.value);
              }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              value={address}
              required
              onChange={(e) => {
                setaddress(e.target.value);
              }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              required
              onChange={(e) => {
                setusername(e.target.value);
              }}
            />
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmpassword}
              required
              onChange={(e) => {
                setconfirmpassword(e.target.value);
              }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Phone Number"
              value={phonenumber}
              required
              onChange={(e) => {
                setphonenumber(e.target.value);
              }}
            />
            <button className="btn btn-primary mt-3" onClick={register}>REGISTER</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registerscreen;
