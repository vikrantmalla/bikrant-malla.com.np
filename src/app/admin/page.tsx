import AuthModal from "@/components/adminDashboard/auth/AuthModal";
import { fetchPortfolioDetailsData } from "@/service/apiService";
import React from "react";

const Admin = async () => {
  const portfolioDetails = await fetchPortfolioDetailsData();
  const { config } = portfolioDetails;
  return (
    <div>
      <AuthModal config={config} />
    </div>
  );
};

export default Admin;
