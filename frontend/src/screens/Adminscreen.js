import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";
import { Modal, Button, Carousel } from "react-bootstrap";

const { TabPane } = Tabs;

function Adminscreen() {
  // useEffect(() => {
  //   if ((!JSON.parse(localStorage.getItem("currentuser")).isAdmin) || (!JSON.parse(localStorage.getItem("currentuser")).isEmployee)) {
  //     window.location.href = "/home";
  //   }
  // }, []);
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentuser"));
    if (!currentUser || (!currentUser.isAdmin && !currentUser.isEmployee)) {
      window.location.href = "/home";
    }
  }, []);

  return (
    <div className="mt-3 ml-3 mr-3 bs">
      <h2 className="text-center" style={{ fontSize: "30px" }}>
        <b>Admin Panel</b>
      </h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bookings" key="1">
          <Bookings />
        </TabPane>
        <TabPane tab="Manage Rooms" key="2">
          {/* <Rooms /> */}
          <Tabs defaultActiveKey="1">
            <TabPane tab="Show Rooms" key="1">
              <Rooms />
            </TabPane>
            <TabPane tab="Add Rooms" key="2">
              <AddRooms />
            </TabPane>
          </Tabs>
        </TabPane>
        {JSON.parse(localStorage.getItem("currentuser")).isAdmin && (
           <TabPane tab="Manage Users" key="4">
           <Tabs defaultActiveKey="1">
             <TabPane tab="Show Users" key="1">
               <Users />
             </TabPane>
             <TabPane tab="Add Users" key="2">
               <AddUsers />
             </TabPane>
           </Tabs>
         </TabPane>
        )}
      </Tabs>
    </div>
  );
}

export default Adminscreen;

export function Bookings() {
  const [bookings, setbookings] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();

  useEffect(() => {
    async function getAllBookings() {
      try {
        const response = await axios.get("/api/bookings/getallbookings");
        const data = response.data;
        setbookings(data);
        setloading(false);
      } catch (error) {
        console.log(error);
        setloading(false);
        seterror(error);
      }
    }
    getAllBookings();
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Bookings</h1>
        {loading && <Loader />}

        <table className="table table-bordered table table-hover table table-striped">
          <thead className="bs thead-dark">
            <tr>
              <th>Booking Id</th>
              <th>User Id</th>
              <th>Room</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length &&
              bookings.map((booking) => {
                return (
                  <tr>
                    <td>{booking._id}</td>
                    <td>{booking.userid}</td>
                    <td>{booking.room}</td>
                    <td>{booking.fromdate}</td>
                    <td>{booking.todate}</td>
                    <td>{booking.status}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {bookings.length && (
          <h1>There are total of {bookings.length} bookings</h1>
        )}
      </div>
    </div>
  );
}

export function Rooms() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();

  // const [update, setupdate] = useState(false)
  const [updateState, setUpdateState] = useState(-1);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);

  function handleEdit(id) {
    setUpdateState(id);
  }

  useEffect(() => {
    async function getAllRooms() {
      try {
        const response = await axios.get("/api/rooms/getallrooms");
        const data = response.data;
        setrooms(data);
        setloading(false);
      } catch (error) {
        console.log(error);
        setloading(false);
        seterror(error);
      }
    }
    getAllRooms();
  }, []);

  function deleteRoom(roomid) {
    axios.delete(`/api/rooms/deleteroom/${roomid}`)
      .then((response) => {
        console.log(response.data);
        // update the users list in your state
        Swal.fire("Congrats", "Room is deleted successfully", "success").then(
          (result) => {
            setrooms(rooms.filter(room => room._id !== roomid));
          });
        

      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Oops", "Something went wrong", "error");
      });
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Rooms</h1>
        {loading && <Loader />}

        <table className="table table-bordered table table-hover table table-striped">
          <thead className="bs thead-dark">
            <tr>
              <th>Room Id</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rent Per Day</th>
              <th>Max Count</th>
              <th>Phone Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length &&
              rooms.map((room) => {
                return updateState === room._id ? (
                  <EditRoom
                    room={room}
                    rooms={rooms}
                    setrooms={setrooms}
                    show={show}
                    handleClose={handleClose}
                  />
                ) : (
                  <tr>
                    <td>{room._id}</td>
                    <td>{room.name}</td>
                    <td>{room.type}</td>
                    <td>{room.rentperday}</td>
                    <td>{room.maxcount}</td>
                    <td>{room.phonenumber}</td>
                    <td>
                      <button class="btn btn-primary" onClick={() => {
                          handleEdit(room._id);
                          handleShow();
                        }}>
                        Update
                      </button>
                      <button class="btn btn-primary" onClick={() => deleteRoom(room._id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AddRooms() {
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();

  const [name, setname] = useState("");
  const [rentperday, setrentperday] = useState();
  const [maxcount, setmaxcount] = useState();
  const [description, setdescription] = useState();
  const [phonenumber, setphonenumber] = useState();
  const [type, settype] = useState();
  const [imageurl1, setimageurl1] = useState();
  const [imageurl2, setimageurl2] = useState();
  const [imageurl3, setimageurl3] = useState();
  console.log(
    name,
    rentperday,
    maxcount,
    description,
    phonenumber,
    type,
    imageurl1,
    imageurl2,
    imageurl3
  );

  async function addRoom() {
    let newroom = {};
    if (
      name &&
      rentperday &&
      maxcount &&
      description &&
      phonenumber &&
      imageurl1 &&
      imageurl2 &&
      imageurl3
    ) {
      newroom = {
        name,
        rentperday,
        maxcount,
        description,
        phonenumber,
        type,
        imageurls: [imageurl1, imageurl2, imageurl3],
      };
    } else {
      alert("Please fill up all the requirements!");
    }

    try {
      setloading(true);
      const response = await axios.post("/api/rooms/addroom", newroom);
      const result = response.data;
      // const result = await(axios.post('/api/rooms/addroom', newroom)).data
      console.log(result);
      Swal.fire("Congrats", "New room is added successfully", "success").then(
        (result) => {
          window.location.href = "/home";
        }
      );
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
      seterror(error);
      Swal.fire("Oops", "Something went wrong", "error");
    }
  }
  return (
    <div className="row-1">
      <h1>Add Rooms</h1>
      {loading && <Loader />}
      <div className="col-mid-5">
        <label for="name">Room name:</label>
        <input
          type="text"
          className="form-control"
          name="name"
          required
          value={name}
          onChange={(e) => {
            setname(e.target.value);
          }}
        />
        <label for="rent">Rent per day:</label>
        <input
          type="text"
          className="form-control"
          name="rent"
          required
          value={rentperday}
          onChange={(e) => {
            setrentperday(e.target.value);
          }}
        />
        <label for="maxcount">Max Count:</label>
        <input
          type="text"
          className="form-control"
          name="maxcount"
          required
          value={maxcount}
          onChange={(e) => {
            setmaxcount(e.target.value);
          }}
        />
        <label for="description">Descrition:</label>
        <input
          type="text"
          className="form-control"
          name="description"
          required
          value={description}
          onChange={(e) => {
            setdescription(e.target.value);
          }}
        />
        <label for="phonenumber">Phone Number:</label>
        <input
          type="text"
          className="form-control"
          name="phonenumber"
          required
          value={phonenumber}
          onChange={(e) => {
            setphonenumber(e.target.value);
          }}
        />
      </div>
      <div classname="col-mid-5">
        <label for="type">Type:</label>
        <select
          className="form-control"
          name="type"
          required
          onChange={(e) => {
            settype(e.target.value);
          }}
        >
          <option value="" disabled selected>
            Select room type
          </option>
          <option value="Delux">Delux</option>
          <option value="Non-Delux">Non-Delux</option>
        </select>
        <label for="imgeurl1">Image URL 1:</label>
        <input
          type="text"
          className="form-control"
          name="imageurl1"
          required
          value={imageurl1}
          onChange={(e) => {
            setimageurl1(e.target.value);
          }}
        />
        <label for="imgeurl2">Image URL 2:</label>
        <input
          type="text"
          className="form-control"
          name="imageurl2"
          required
          value={imageurl2}
          onChange={(e) => {
            setimageurl2(e.target.value);
          }}
        />
        <label for="imgeurl3">Image URL 3:</label>
        <input
          type="text"
          className="form-control"
          name="imageurl3"
          required
          value={imageurl3}
          onChange={(e) => {
            setimageurl3(e.target.value);
          }}
        />
        <div className="text-right">
          <button className="btn btn-primary mt-2" onClick={addRoom}>
            Add Button
          </button>
        </div>
      </div>
    </div>
  );
}

export function EditRoom({ room, rooms, setrooms, show, handleClose }) {

  const [updatedroom, setupdatedroom] = useState({
    name: room.name,
    rentperday: room.rentperday,
    maxcount: room.maxcount,
    description: room.description,
    phonenumber: room.phonenumber,
    type: room.type,
    imageurls: [room.imageurls[1], room.imageurls[2], room.imageurls[3]]
  });
  console.log(updatedroom);

  const handleUpdateRoom = (roomid) => {
    axios
      .put(
        `/api/rooms/updateroom/${room._id}`,
        updatedroom
      )
      .then((response) => {
        // handle success
        console.log(response.data);
        handleClose();
        Swal.fire("Congrats", "Room is updated successfully", "success").then(
          (result) => {
            window.location.href = "/admin";
          });
      })
      .catch((error) => {
        // handle error
        console.log(error);
        Swal.fire("Oops", "Something went wrong", "error");
      });
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false} size="lg">
      <Modal.Header>
        <Modal.Title>Edit Room Here</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Room Name:
        <input
          type="text"
          className="form-control"
          placeholder="Room Name"
          name="name"
          value={updatedroom.name}
          required
          // onChange={(e)=>{setupdateduser({name: e.target.value})}}
          onChange={(e) => {
            setupdatedroom(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
        Rent Per Day:
        <input
          type="text"
          className="form-control"
          placeholder="rent per day"
          name="rentperday"
          value={updatedroom.rentperday}
          required
          // onChange={(e)=>{setupdateduser({address: e.target.value})}}
          onChange={(e) => {
            setupdatedroom(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
        maxcount:
        <input
          type="text"
          className="form-control"
          placeholder="max count"
          name="maxcount"
          value={updatedroom.maxcount}
          required
          // onChange={(e)=>{setupdateduser({username: e.target.value})}}
          onChange={(e) => {
            setupdatedroom(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
        Description:
        <input
          type="text"
          className="form-control"
          placeholder="description"
          name="description"
          value={updatedroom.description}
          required
          // onChange={(e)=>{setupdateduser({email: e.target.value})}}
          onChange={(e) => {
            setupdatedroom(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
        Phonenumber:
        <input
          type="text"
          className="form-control"
          placeholder="Phonenumber"
          name="phonenumber"
          value={updatedroom.phonenumber}
          required
          // onChange={(e)=>{setupdateduser({password: e.target.value})}}
          onChange={(e) => {
            setupdatedroom(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
        Type:
        <select
          className="form-control"
          name="type"
          value={updatedroom.type}
          required
          onChange={(e) => {
            setupdatedroom(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        >
          <option value="" disabled selected>
            Select room type
          </option>
          <option value="Delux">Delux</option>
          <option value="Non-Delux">Non-Delux</option>
        </select>
        image url 1:
         <input
          type="text"
          className="form-control"
          placeholder="image url 1"
          name="imageurl1"
          value={updatedroom.imageurls[0]}
          required
          // onChange={(e)=>{setupdateduser({isEmployee: e.target.value})}}
          onChange={(e) => {
            setupdatedroom(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
        image url 2:
         <input
          type="text"
          className="form-control"
          placeholder="image url 2"
          name="imageurl2"
          value={updatedroom.imageurls[1]}
          required
          // onChange={(e)=>{setupdateduser({isEmployee: e.target.value})}}
          onChange={(e) => {
            setupdatedroom(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
        image url 3:
         <input
          type="text"
          className="form-control"
          placeholder="image url 3"
          name="imageurl3"
          value={updatedroom.imageurls[2]}
          required
          // onChange={(e)=>{setupdateduser({isEmployee: e.target.value})}}
          onChange={(e) => {
            setupdatedroom(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="secondary" type = "submit" onClick={handleUpdateRoom}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export function Users() {
  const [users, setusers] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();

  const [updateState, setUpdateState] = useState(-1);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function getAllUsers() {
      try {
        const response = await axios.get("/api/users/getallusers");
        const data = response.data;
        setusers(data);
        setloading(false);
      } catch (error) {
        console.log(error);
        setloading(false);
        seterror(error);
      }
    }
    getAllUsers();
  }, []);

  function handleEdit(id) {
    setUpdateState(id);
  }
  function deleteUser(userid) {
    axios.delete(`/api/users/deleteuser/${userid}`)
      .then((response) => {
        console.log(response.data);
        // update the users list in your state
        Swal.fire("Congrats", "User is deleted successfully", "success").then(
          (result) => {
            setusers(users.filter(user => user._id !== userid));
          });
        

      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Oops", "Something went wrong", "error");
      });
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Users</h1>
        {loading && <Loader />}

        <table className="table table-bordered table table-hover table table-striped">
          <thead className="bs thead-dark">
            <tr>
              <th>Users Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Employee</th>
              <th>Admin</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length &&
              users.map((user) => {
                return updateState === user._id ? (
                  <EditUser
                    user={user}
                    users={users}
                    setusers={setusers}
                    show={show}
                    handleClose={handleClose}
                  />
                ) : (
                  <tr>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isEmployee ? "Yes" : "No"}</td>
                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                    <td>
                      <button
                        class="btn btn-primary"
                        onClick={() => {
                          handleEdit(user._id);
                          handleShow();
                        }}
                      >
                        Update
                      </button>
                      <button class="btn btn-primary" onClick={() => deleteUser(user._id)}>Delete</button>
                    </td>
                    {/* <td>
                      <button class="btn btn-primary">Delete</button>
                    </td> */}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function EditUser({ user, users, setusers, show, handleClose }) {

  const [updateduser, setupdateduser] = useState({
    name: user.name,
    address: user.address,
    username: user.username,
    email: user.email,
    password: user.password,
    phonenumber: user.phonenumber,
    isEmployee: user.isEmployee
  });
  console.log(updateduser);

  const handleUpdateUser = () => {
    axios
      .put(
        `/api/users/updateuser/${user._id}`,
        updateduser
      )
      .then((response) => {
        // handle success
        console.log(response.data);
        handleClose();
        Swal.fire("Congrats", "User is updated successfully", "success").then(
          (result) => {
            window.location.href = "/admin";
          });
      })
      .catch((error) => {
        // handle error
        console.log(error);
        Swal.fire("Oops", "Something went wrong", "error");
      });
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false} size="lg">
      <Modal.Header>
        <Modal.Title>Edit User Here</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Name:
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          name="name"
          value={updateduser.name}
          required
          // onChange={(e)=>{setupdateduser({name: e.target.value})}}
          onChange={(e) => {
            setupdateduser(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
        Address:
        <input
          type="text"
          className="form-control"
          placeholder="Address"
          name="address"
          value={updateduser.address}
          required
          // onChange={(e)=>{setupdateduser({address: e.target.value})}}
          onChange={(e) => {
            setupdateduser(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
        Username:
        <input
          type="text"
          className="form-control"
          placeholder="Username"
          name="username"
          value={updateduser.username}
          required
          // onChange={(e)=>{setupdateduser({username: e.target.value})}}
          onChange={(e) => {
            setupdateduser(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
        Email:
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          name="email"
          value={updateduser.email}
          required
          // onChange={(e)=>{setupdateduser({email: e.target.value})}}
          onChange={(e) => {
            setupdateduser(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
        Password:
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          name="password"
          value={updateduser.password}
          required
          // onChange={(e)=>{setupdateduser({password: e.target.value})}}
          onChange={(e) => {
            setupdateduser(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
        Phonenumber:
        <input
          type="text"
          className="form-control"
          placeholder="Phone Number"
          name="phonenumber"
          value={updateduser.phonenumber}
          required
          // onChange={(e)=>{setupdateduser({phonenumber: e.target.value})}}
          onChange={(e) => {
            setupdateduser(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
        isEmployee:
         <input
          type="text"
          className="form-control"
          placeholder="Employee?"
          name="isEmployee"
          value={updateduser.isEmployee}
          required
          // onChange={(e)=>{setupdateduser({isEmployee: e.target.value})}}
          onChange={(e) => {
            setupdateduser(prevState => ({
              ...prevState,
              [e.target.name]: e.target.value
            }));
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="secondary" type = "submit" onClick={handleUpdateUser}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export function AddUsers() {
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();

  const [name, setname] = useState("");
  const [address, setaddress] = useState();
  const [username, setusername] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [phonenumber, setphonenumber] = useState();
  const [cpassword, setcpassword] = useState();
  const [access, setaccess] = useState();

  async function addUser() {
    let adminaccess = false;
    let employeeaccess = false;
    if (access == "admin") {
      adminaccess = true;
    } else if (access == "employee") {
      employeeaccess = true;
    }
    let newuser = {};
    if (cpassword === password) {
      newuser = {
        name,
        address,
        username,
        email,
        password,
        phonenumber,
        isAdmin: adminaccess,
        isEmployee: employeeaccess,
      };
    } else {
      alert("Please fill up all the requirements!");
    }

    try {
      setloading(true);
      const response = await axios.post("/api/users/register", newuser);
      const result = response.data;
      // const result = await(axios.post('/api/rooms/addroom', newroom)).data
      console.log(result);
      Swal.fire("Congrats", "New User is added successfully", "success").then(
        (result) => {
          window.location.href = "/admin";
        }
      );
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
      seterror(error);
      Swal.fire("Oops", "Something went wrong", "error");
    }
  }
  return (
    <div className="row-1">
      <h1>Add User</h1>
      {loading && <Loader />}
      <div className="col-mid-5">
        <label for="name">Name:</label>
        <input
          type="text"
          className="form-control"
          name="name"
          required
          value={name}
          onChange={(e) => {
            setname(e.target.value);
          }}
        />
        <label for="address">Address:</label>
        <input
          type="text"
          className="form-control"
          name="address"
          required
          value={address}
          onChange={(e) => {
            setaddress(e.target.value);
          }}
        />
        <label for="username">Username:</label>
        <input
          type="text"
          className="form-control"
          name="username"
          required
          value={username}
          onChange={(e) => {
            setusername(e.target.value);
          }}
        />
        <label for="email">Email:</label>
        <input
          type="email"
          className="form-control"
          name="email"
          required
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
          }}
        />
        <label for="password">Password:</label>
        <input
          type="password"
          className="form-control"
          name="passwrod"
          required
          value={password}
          onChange={(e) => {
            setpassword(e.target.value);
          }}
        />
        <label for="cpassword">Confirm Password:</label>
        <input
          type="password"
          className="form-control"
          name="cpassword"
          required
          value={cpassword}
          onChange={(e) => {
            setcpassword(e.target.value);
          }}
        />
        <label for="phonenumber">Phonenumber:</label>
        <input
          type="text"
          className="form-control"
          name="phonenumber"
          required
          value={phonenumber}
          onChange={(e) => {
            setphonenumber(e.target.value);
          }}
        />
        <label for="access">Access:</label>
        <select
          className="form-control"
          name="access"
          required
          onChange={(e) => {
            setaccess(e.target.value);
          }}
        >
          <option value="" disabled selected>
            Seclect admin/employee/guest
          </option>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
          <option value="guest">Guest</option>
        </select>

        <div className="text-right">
          <button className="btn btn-primary mt-2" onClick={addUser}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
