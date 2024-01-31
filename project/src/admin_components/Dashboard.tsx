import React, { useEffect, useState } from 'react';
import { BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill, BsCheckCircle } from 'react-icons/bs';
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function Dashboard() {
  const [numberOfRooms, setNumberOfRooms] = useState(0);
  const [numberOfCustomer, setNumberOfCustomer] = useState(0);
  const [numberOfServe, setNumberOfServe] = useState(0);
  const [numberOfConfirm, setNumberOfConfirm] = useState(0);
  const [numberOfIncome, setNumberOfIncome] = useState(0);
 const [monthlyIncomeData, setMonthlyIncomeData] = useState([]);
 useEffect(() => {
  const fetchData = async () => {
    try {
      const roomResponce = await fetch('http://localhost:8081/total_rooms');
      const roomData = await roomResponce.json();  

      if (roomData.success) {
        setNumberOfRooms(roomData.total_rooms);
      } else {
        console.error('Error fetching total rooms:', roomData);
      }
      const cutomerResponce = await fetch('http://localhost:8081/total_customer');
      const customerData = await cutomerResponce.json();

      if (customerData.success) {
        setNumberOfCustomer(customerData.total_customer); 
      } else {
        console.error('Error fetching total customers:', customerData);
      }

      const cutomerServeResponce = await fetch('http://localhost:8081/total_serve');
      const serveData = await cutomerServeResponce.json();

      if (serveData.success) {
        setNumberOfServe(serveData.total_serve); 
      } else {
        console.error('Error fetching total customers:', serveData);
      }
      const cutomerconfirmResponce = await fetch('http://localhost:8081/total_confirm');
      const confirmData = await cutomerconfirmResponce.json();

      if (confirmData.success) {
        setNumberOfConfirm(confirmData.total_confirm); 
      } else {
        console.error('Error fetching total customers:', confirmData);
      }

      const totalincomeResponce = await fetch('http://localhost:8081/total_income');
      const incomeData = await totalincomeResponce.json();

      if (incomeData.success) {
        setNumberOfIncome(incomeData.total_income); 
      } else {
        console.error('Error fetching total customers:', incomeData);
      }
         const monthlyIncomeResponse = await fetch('http://localhost:8081/fetchMonthlyIncome');
        const monthlyIncomeData = await monthlyIncomeResponse.json();

        if (monthlyIncomeData.success) {
          // If you expect an array of data, use it directly
          setMonthlyIncomeData(monthlyIncomeData.monthlyIncomeData);
        } else {
          console.error('Error fetching monthly income:', monthlyIncomeData);
        }
    } catch (error) {
      console.error('Error fetching total rooms:', error);
    }
  };

  fetchData();
}, []);



  return (
    <main className="main-container">
      <div className="main-title">
        <h3 style={{color: 'black'}}>HOTEL DASHBOARD</h3>
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>ROOMS</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>{numberOfRooms}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Customers</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{numberOfCustomer}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Room Serve</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>{numberOfServe}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Room Confirm</h3>
            <BsCheckCircle  className="card_icon" />
          </div>
          <h1>{numberOfConfirm}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Total Income</h3>
            <BsFillBellFill  className="card_icon" />
          </div>
          <h1>{numberOfIncome}</h1>
        </div>
      </div>

        <div className='charts'>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={monthlyIncomeData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis dataKey="income" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
};

export default Dashboard;
