import Image from 'next/image';
import React from 'react'

const VendorHeader = () => {
  return (
    <div className="w-full flex justify-between items-center p-8 px-16 bg-offWhite border-b-2 border-[#EEEEEE] fixed z-20">
      <div>
        <p className='text-2xl font-semibold'>Stores</p>
      </div>
      <div className='flex items-center gap-4'>
        <Image
          src="/icons/notificationIcon.svg"
          width={25}
          height={25}
          alt="icon"
        />
        <Image src="/icons/Status.png" width={30} height={30} alt="icon" />
      </div>
    </div>
  );
}

export default VendorHeader