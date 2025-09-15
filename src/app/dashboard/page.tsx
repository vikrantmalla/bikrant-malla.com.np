import { PortfolioDetails } from "@/types/data";
import DashboardClient from "./DashboardClient";
import { getPortfolioData } from "./actions";
import { getServerAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  // Check authentication on server side
  const authResult = await getServerAuth();
  
  if (!authResult.isAuthenticated) {
    redirect('/login?redirect=/dashboard');
  }

  // Fetch portfolio data on the server
  const portfolioResult = await getPortfolioData();

  const initialPortfolioDataForClient =
    portfolioResult.success &&
    portfolioResult.data &&
    portfolioResult.data.id === null
      ? { success: true, data: undefined }
      : portfolioResult;
  return (
    <DashboardClient
      initialPortfolioData={
        initialPortfolioDataForClient as {
          success: boolean;
          data?: PortfolioDetails | undefined;
          error?: string | undefined;
          isDatabaseError?: boolean | undefined;
        }
      }
    />
  );
}
