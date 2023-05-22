import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import swal from "sweetalert2";

const Bookingscreen = () => {
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();
  const [room, setroom] = useState();

  const { id, fromdate, todate } = useParams();

  const fromd = moment(fromdate, "DD-MM-YYYY");
  const tod = moment(todate, "DD-MM-YYYY");

  const totaldays = moment.duration(tod.diff(fromd)).asDays() + 1;
  const [totalamount, settotalamount] = useState();

  useEffect(() => {
    if(!localStorage.getItem('currentuser')){
      window.location.reload = '/login'
    }
    const fetchData = async () => {
      try {
        setloading(true);
        const data = (
          await axios.post("/api/rooms/getroombyid", { roomid: id })
        ).data;
        settotalamount(data.rentperday * totaldays);
        setroom(data);
        setloading(false);
        console.log(data);
      } catch (error) {
        seterror(true);
        console.log(error);
        setloading(false);
      }
    };
    fetchData();
  }, []);

  async function onToken(token) {
    const bookingdetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentuser"))._id,
      fromdate: fromd,
      todate: tod,
      totalamount,
      totaldays,
      token,
    };

    try {
      setloading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingdetails);
      setloading(false);
      swal.fire("Congratulations", "Room booked Successfully", "success").then(result => {window.location.href = '/profile'});
    } catch (error) {
      setloading(false);
      swal.fire("Oops", "Something went wrong", "error").then(result => {window.location.href = '/profile'});
    }
  }

  return (
    <div className="m-5">
      {loading ? (
        <Loader />
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-5">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className="bigimg" />
            </div>
            <div className="col-md-5">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>Name:</p>
                  <p>From Date: {fromdate}</p>
                  <p>To Date: {todate}</p>
                  <p>Max Count: {room.maxcount}</p>
                </b>
              </div>
              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p>Total days : {totaldays}</p>
                  <p>Rent per day : {room.rentperday}</p>
                  <p>Total Amount : {totalamount}</p>
                </b>
              </div>
              <div style={{ float: "right" }}>
                <StripeCheckout
                  amount={totalamount * 100}
                  token={onToken}
                  currency="php"
                  stripeKey="pk_test_51MzzS9JdQqwRgXNg9MOSaTWDnIuX3KpCDxjd2l0oeXOHRktdKt9GRbWWeAItViLroJ7jzEGfga4tTURy3SQ9gwQF00ZRBZrxa0"
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
};

export default Bookingscreen;
