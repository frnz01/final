import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";

const Loginscreen = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();

  async function login() {
    const user = {
      email,
      password,
    };
    try {
      // setloading(true);
      // const result = await axios.post('/api/users/login', user).data
      // setloading(false);

      // localStorage.setItem('currentuser', JSON.stringify(result));

      //   window.location.href ='/home'
      setloading(true);
      const response = await axios.post("/api/users/login", user);
      const result = response.data;
      setloading(false);
      if (result) { //result && result.user
        localStorage.setItem("currentuser", JSON.stringify(result));
        setloading(false);
        window.location.href = "/home";
      } else {
        seterror(true);
      }
    } catch (error) {
      console.log(error);
      setloading(false);
      seterror(true);
    }
  }
  return (
    <div>
      {loading && <Loader />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
        {/* {loading && <Loader />} */}
          {error && <Error message="Invalid Email or Password" />}
          <div className="bs">
            <h2>Login</h2>

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
            <button className="btn btn-primary mt-3" onClick={login}>
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loginscreen;
