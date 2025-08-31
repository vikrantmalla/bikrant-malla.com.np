import DashboardClient from "./DashboardClient";
import { getPortfolioData } from "./actions";

export default async function Dashboard() {
  // Fetch portfolio data on the server
  const portfolioResult = await getPortfolioData();
  
  return <DashboardClient initialPortfolioData={portfolioResult} />;
}
