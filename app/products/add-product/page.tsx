"use client";

import React, { useState } from "react";
import Wrapper from "@/app/components/wrapper/Wrapper";
import Input from "@/app/components/common/Input";
import TextArea from "@/app/components/common/TextArea";
import Upload from "@/app/components/common/Upload";
import Button from "@/app/components/common/Button";

export default function AddProductPage() {
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <Wrapper>
      <div className="max-w-3xl mt-[-50px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Product title"
            helperText="This will be displayed as the name of your product."
            placeholder="Enter text"
            name={""}
            type={""}
            onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
              throw new Error("Function not implemented.");
            }}
          />

          <TextArea
            label="Description"
            helperText="Describe your product. This can include 'size', specs, colours etc'."
            placeholder="Enter text"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              prefix="NGN"
              type="number"
              placeholder="0.00"
              name={""}
              onChange={function (
                e: React.ChangeEvent<HTMLInputElement>
              ): void {
                throw new Error("Function not implemented.");
              }} // step="0.01"
            />
            <Input
              label="Cost price"
              prefix="NGN"
              type="number"
              placeholder="0.00"
              name={""}
              onChange={function (
                e: React.ChangeEvent<HTMLInputElement>
              ): void {
                throw new Error("Function not implemented.");
              }} // step="0.01"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Product weight"
              type="number"
              placeholder="0.00"
              suffix="kg"
              name={""}
              onChange={function (
                e: React.ChangeEvent<HTMLInputElement>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
            <Input
              label="Product length"
              type="number"
              placeholder="0.00"
              name={""}
              onChange={function (
                e: React.ChangeEvent<HTMLInputElement>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
            <Input
              label="Height"
              type="number"
              placeholder="0.00"
              name={""}
              onChange={function (
                e: React.ChangeEvent<HTMLInputElement>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Choose a category for you product.
            </p>
            <select className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[#2B3B2B] focus:ring-1 focus:ring-[#2B3B2B]">
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="food">Food & Beverages</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity in stock
            </label>
            <p className="text-sm text-gray-500 mb-2">
              What is the quantity available?
            </p>
            <Input
              type="number"
              placeholder="Enter text"
              name={""}
              onChange={function (
                e: React.ChangeEvent<HTMLInputElement>
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add product images
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Upload images of your products
            </p>
            <Upload
              onChange={setFiles}
              maxFiles={10}
              maxSize={10 * 1024 * 1024} // 10MB
            />
          </div>

          <div className="pt-4">
            <Button type="submit" primary className="w-full">
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
}
