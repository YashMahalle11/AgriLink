import React from 'react'
import {TbBrandMeta} from "react-icons/tb"
import {IoLogoInstagram } from "react-icons/io"
import {RiTwitterXLine} from "react-icons/ri"

const Topbar = () => {
  return (
    <div className='bg-rabbit-red text-white'>
        <div className='container mx-auto flex justify-between items-center py-3 px-4'>
            <div className='hidden md:flex items-center space-x-4' >
                <a href="https://www.instagram.com/yash_mahalle_?igsh=Z2RpcTRtcXVqbnJ0" className='hover:text-gray-300'>
                    <TbBrandMeta className='h-5 w-5' />
                </a>
                <a href="https://www.instagram.com/yash_mahalle_?igsh=Z2RpcTRtcXVqbnJ0" className='hover:text-gray-300'>
                    <IoLogoInstagram className='h-5 w-5' />
                </a>
                <a href="https://x.com/YashMahalle_11?t=m8_h9nt7GP7sIjE6e-cRHA&s=09" className='hover:text-gray-300'>
                    <RiTwitterXLine className='h-4 w-4' />
                </a>
            </div>
            <div className='text-sm text-center flex-grow'>
                <span>Bridging Farmers & Consumers – Quality, Freshness, Fairness!</span>
            </div>
            <div className='text-sm hidden md:block'>
                <a href="tel:+1234567890" className='hover:text-gray-300'>
                    +91 8329695309
                </a>
            </div>
        </div>
    </div>
  )
}

export default Topbar