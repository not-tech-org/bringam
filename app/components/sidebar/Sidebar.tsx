import Image from 'next/image'
import React from 'react'

const Sidebar = () => {
  return (
    <div className="w-[280px] h-full bg-bgArmy px-8 py-12">
      <div className="flex items-center gap-2">
        <Image
          src="/icons/brand-logo.svg"
          alt="Brand Logo"
          width={30}
          height={30}
        />
        <p className="text-lg font-bold">BringAm</p>
      </div>
      <div className="mt-16">
        <p className="text-sm text-lightArmy font-medium mb-6">Categories</p>
        <div className="pl-4 text-sm">
          <div className="flex items-center gap-2 my-6">
            <Image src="/icons/all.svg" alt="All Icon" width={20} height={20} />
            <p className="text-white font-bold">All</p>
          </div>
          <div className="flex items-center gap-2 my-6">
            <Image
              src="/icons/headset.svg"
              alt="All Icon"
              width={16}
              height={16}
            />
            <p className="text-lighterArmy font-medium">Gadgets</p>
          </div>
          <div className="flex items-center gap-2 my-6">
            <Image
              src="/icons/heart.svg"
              alt="All Icon"
              width={16}
              height={16}
            />
            <p className="text-lighterArmy font-medium">Health & beauty</p>
          </div>
          <div className="flex items-center gap-2 my-6">
            <Image
              src="/icons/electronics.svg"
              alt="All Icon"
              width={16}
              height={16}
            />
            <p className="text-lighterArmy font-medium">Electronics</p>
          </div>
          <div className="flex items-center gap-2 my-6">
            <Image
              src="/icons/phone.svg"
              alt="All Icon"
              width={16}
              height={16}
            />
            <p className="text-lighterArmy font-medium">Phones and tablets</p>
          </div>
          <div className="flex items-center gap-2 my-6">
            <Image
              src="/icons/fashion.svg"
              alt="All Icon"
              width={16}
              height={16}
            />
            <p className="text-lighterArmy font-medium">Fashion</p>
          </div>
          <div className="flex items-center gap-2 my-6">
            <Image
              src="/icons/gaming.svg"
              alt="All Icon"
              width={16}
              height={16}
            />
            <p className="text-lighterArmy font-medium">Gaming</p>
          </div>
          <div className="flex items-center gap-2 my-6">
            <Image
              src="/icons/coffee.svg"
              alt="All Icon"
              width={16}
              height={16}
            />
            <p className="text-lighterArmy font-medium">Groceries</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar