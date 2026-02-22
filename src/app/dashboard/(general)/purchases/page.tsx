import PurchasesPage from "~/components/dashboard/purchases/PurchasesPage";
import { getPurchases, type PurchasesParams } from "./actions";

const BEER_PURCHASES_PAGE_SIZE = 10;

const initialParams = {
  page: 1,
  page_size: BEER_PURCHASES_PAGE_SIZE,
  ordering: "-purchased_at",
} satisfies PurchasesParams;

export default async function DashboardPurchasesPage() {
  const data = await getPurchases(initialParams);

  return <PurchasesPage initialData={data} initialParams={initialParams}/>;
}
