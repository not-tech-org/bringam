import OverviewCard from '../common/OverviewCard';

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
    icon: '/icons/orderIcon.svg',
  },
  {
    title: 'Products in Stock',
    value: data.productsInStock,
    icon: '/icons/box.svg',
  },
  {
    title: 'Active Products',
    value: data.activeProducts,
    icon: '/icons/store.svg',
  },
  {
    title: 'Product Views',
    value: data.productViews,
    icon: '/icons/accountIcon.svg',
  },
  {
    title: 'Total Products Sold',
    value: data.totalProductsSold,
    icon: '/icons/cartIcon.svg',
  },
];

// Re-export OverviewCard for backward compatibility
export { default } from '../common/OverviewCard';
