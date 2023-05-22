import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import "antd/dist/reset.css";
import { DatePicker, Space } from "antd";
// import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

const Homescreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);

  const user = JSON.parse(localStorage.getItem('currentuser'));

  const [fromdate, setfromdate] = useState("11-11-1111");
  const [todate, settodate] = useState(
    moment().add(1, "day").format("DD-MM-YYYY")
  );
  const [duplicaterooms, setduplicaterooms] = useState([]);
  const[searchkey, setsearchkey] = useState('');
  const[type, settype] = useState('all');
  useEffect(() => {
    async function getResults() {
      try {
        setloading(true);
        const data = (await axios("/api/rooms/getallrooms")).data;
        setRooms(data);
        setduplicaterooms(data);
        setloading(false);
      } catch (error) {
        seterror(true);
        console.log(error);
        setloading(false);
      }
    }
    getResults();
  }, []);

  const filterByDate = (dates) => {
    if (dates) {
      const fromDate = new Date(dates[0]);
      const toDate = new Date(dates[1]);
      const from_date = new Date(fromDate).toLocaleDateString("en-GB");
      const to_date = new Date(toDate).toLocaleDateString("en-GB");
      setfromdate(from_date.replace(/\//g, "-"));
      settodate(to_date.replace(/\//g, "-"));
  
      let tempRooms = [];
      let availability = false;
  
      for (const room of duplicaterooms) {
        if (room.currentbookings.length > 0) {
          for (const booking of room.currentbookings) {
            const bookingFromDate = new Date(booking.fromdate);
            const bookingToDate = new Date(booking.todate);
  
            if (
              fromDate.getTime() < bookingFromDate.getTime() &&
              toDate.getTime() < bookingFromDate.getTime()
            ) {
              availability = true;
            } else if (
              fromDate.getTime() > bookingToDate.getTime() &&
              toDate.getTime() > bookingToDate.getTime()
            ) {
              availability = true;
            }
          }
        }
  
        if (availability == true || room.currentbookings.length == 0) {
          tempRooms.push(room);
        }
  
        setRooms(tempRooms);
      }
    } else {
      setfromdate(null);
      settodate(null);
    }
  };

  function filterBySearch(){
    const temprooms = duplicaterooms.filter(room => room.name.toLowerCase().includes(searchkey.toLowerCase()))
    setRooms(temprooms);
  }

  function filterByType(e){
    settype(e);
    if(e !== "all"){
      const temprooms = duplicaterooms.filter(room =>room.type.toLowerCase() === e.toLowerCase())
    setRooms(temprooms);
    }
    else{
      setRooms(duplicaterooms);
    }
  }
  

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          {(user)&&(
            <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
          )}
          
        </div>
        <div className="col-md-5">
          <input type="text" className="form-control" placeholder='search rooms' 
          value={searchkey} onChange = {(e) => {setsearchkey(e.target.value)}} onKeyUp = {filterBySearch}
          />
        </div>
        <div className="col-md-3">
        <select className="form-control" value = {type} onChange={(e)=>{filterByType(e.target.value)}}>
          <option value="all">All</option>
          <option value="delux">Delux</option>
          <option value="non-delux">Non-Delux</option>
        </select>
        </div>
       


      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : (
          rooms.map((room) => {
            return (
              <div className="col-md-9 mt-3">
                {" "}
                <Room room={room} fromdate={fromdate} todate={todate} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Homescreen;
