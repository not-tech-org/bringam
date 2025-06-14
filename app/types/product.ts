// Product-related types and interfaces

export interface ProductCategory {
  uuid: string;
  name: string;
  description?: string;
}

export interface ProductFormData {
  productName: string;
  productDescription: string;
  productCategory: string;
  productImage: string;
  productBrand: string;
  productSize: string;
  productMaterial: string;
  productWeightPerUnit: string;
  productSoldInPacks: boolean;
  productUnitsPerPack: number;
  productWeightPerPack: string;
  productLength: string;
  productWidth: string;
  productHeight: string;
}

export interface Product {
  id?: string;
  uuid?: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  size: string;
  material: string;
  weightPerUnit: string;
  soldInPacks: boolean;
  unitsPerPack?: number;
  weightPerPack?: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}
