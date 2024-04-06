import React from "react";
import { fetchPortfolioDetailsData } from "@/service/apiService";
import SignUp from "@/components/adminDashboard/auth/SignUp";

const SignUpPage = async () => {
  const portfolioDetails = await fetchPortfolioDetailsData();
  const { config } = portfolioDetails;
  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp config={config} />
    </div>
  );
};

export default SignUpPage;
