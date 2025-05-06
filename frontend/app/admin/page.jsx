'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axios from '../../utils/axios';
import AdminDashboardPage from './dashboard/page';

export default function AdminHome() {

  

  return (
    <AdminDashboardPage />
  );
}