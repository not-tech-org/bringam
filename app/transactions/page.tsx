"use client";

import React from "react";
import Wrapper from "../components/wrapper/Wrapper";

const TransactionsPage = () => {
  return (
    <Wrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="text-gray-600">
          Your transaction history will appear here.
        </p>
      </div>
    </Wrapper>
  );
};

export default TransactionsPage;
