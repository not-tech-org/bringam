import React from 'react';
import { FiPieChart, FiPackage, FiEye, FiShoppingCart, FiActivity } from 'react-icons/fi';

interface ProductOverviewCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const ProductOverviewCard: React.FC<ProductOverviewCardProps> = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center bg-[#F8F9FB] rounded-lg text-blue-600">
          {icon}
        </div>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
};

export const getOverviewCards = (data: {
  salesOverview: number;
  productsInStock: number;
  activeProducts: number;
  productViews: number;
  totalProductsSold: number;
}) => [
  {
    title: 'Sales Overview',
    value: data.salesOverview,
    icon: <FiPieChart size={24} />,
  },
  {
    title: 'Products in Stock',
    value: data.productsInStock,
    icon: <FiPackage size={24} />,
  },
  {
    title: 'Active Products',
    value: data.activeProducts,
    icon: <FiActivity size={24} />,
  },
  {
    title: 'Product Views',
    value: data.productViews,
    icon: <FiEye size={24} />,
  },
  {
    title: 'Total Products Sold',
    value: data.totalProductsSold,
    icon: <FiShoppingCart size={24} />,
  },
];

export default ProductOverviewCard;
