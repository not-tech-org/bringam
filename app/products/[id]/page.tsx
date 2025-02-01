"use client"

import Button from "@/app/components/common/Button";
import Wrapper from "@/app/components/wrapper/Wrapper";
import Image from "next/image";
import React from "react";
import { FaHeart } from "react-icons/fa";

const ProductDetails = () => {
  return (
    <Wrapper>
      <div className="text-bgArmy">
        <div className="w-3/5 h-[540px] bg-red-200 flex gap-3 justify-start">
          <div className="w-1/2">
            <Image
              src="/images/product-cover-5.png"
              alt="Product image"
              className="rounded-xl"
              height={465}
              width={460}
            />
          </div>
          <div className="w-1/2 text-left p-8">
            <p className="font-semibold text-5xl">Beats Headset</p>
            <p className="my-4 text-2xl">$45.00</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="">Avaialability</p>
                <p>IN STOCK</p>
              </div>
              <div className="flex items-center gap-2">
                <p>Add to wishlist</p>
                <FaHeart />
              </div>
            </div>

            <div>
              <p>Description</p>
              <p>
                Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                vulputate libero et velit interdum, ac aliquet odio mattis.
                Class aptent taciti sociosqu ad litora torquent per... see more
              </p>
              <Button primary style="p-3">
                Buy Now
                <Image
                  src="/icons/all.svg"
                  alt="All Icon"
                  width={20}
                  height={20}
                />
              </Button>
              <Button secondary style="p-3">
                Add to Cart
                <Image
                  src="/icons/all.svg"
                  alt="All Icon"
                  width={20}
                  height={20}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ProductDetails;
