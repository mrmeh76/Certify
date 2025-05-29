"use client"
import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

function BackButton() {
    const { back } = useRouter()
  return (
    <Button onClick={()=>back()} variant={"ghost"} className='text-gray-400 gap-x-3' >
        <ArrowLeft/>
        <span>
            Back
        </span>
    </Button>
  )
}

export default BackButton