"use client";
import React, { useEffect } from 'react'
import axios from 'axios'
const Home = () => {

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data')
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
      fetchData();
    }
    },[])




  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      This is the home page.
      <p>Welcome to the home page!</p>
    </div>
  )
}

export default Home;
