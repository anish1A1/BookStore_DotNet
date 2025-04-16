"use client";
import React from 'react'
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
const ButtonComponent = () => {
  return (
    
   <Button onClick={() => toast.info("This is from Component Button")}>Click Me!</Button>
  )
}

export default ButtonComponent
