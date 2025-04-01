"use client";

import React from "react";
import Wrapper from "../components/wrapper/Wrapper";

const SettingsPage = () => {
  return (
    <Wrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-gray-600">Your account settings will appear here.</p>
      </div>
    </Wrapper>
  );
};

export default SettingsPage;
