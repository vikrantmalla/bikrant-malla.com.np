import { PortfolioDetails } from "@/types/data";
import DashboardClient from "./DashboardClient";
import { getPortfolioData } from "./actions";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  // Fetch portfolio data on the server
  const portfolioResult = await getPortfolioData();

  // Transform portfolioResult to ensure type compatibility with DashboardClient.
  // Specifically, if a portfolio is "successfully" fetched but has a null ID (indicating
  // no valid portfolio data), we transform it to an object with `data: undefined`.
  const initialPortfolioDataForClient =
    portfolioResult.success &&
    portfolioResult.data &&
    portfolioResult.data.id === null
      ? { success: true, data: undefined }
      : portfolioResult;
  // The 'initialPortfolioDataForClient' variable's type is not fully narrowed by TypeScript's control flow analysis
  // in the preceding line, leading to a type incompatibility with DashboardClient's props.
  // Specifically, the type of 'portfolioResult' in the 'else' branch of the ternary operator
  // still includes a variant where 'data.id' is 'null', which is incompatible with 'PortfolioDetails'.
  // To resolve this type error within the given selection constraints, we assert the type.
  // A more robust fix would involve redefining 'initialPortfolioDataForClient' to explicitly
  // construct the desired type, ensuring 'data' is 'undefined' when 'data.id' is 'null'.
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
