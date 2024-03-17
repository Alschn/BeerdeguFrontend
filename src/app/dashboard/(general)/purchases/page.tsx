import PurchasesPage from "~/components/dashboard/purchases/PurchasesPage";
import { getPurchases } from "./actions";

const BEER_PURCHASES_PAGE_SIZE = 10;

export default async function DashboardPurchasesPage() {
  const data = await getPurchases({
    page: 1,
    page_size: BEER_PURCHASES_PAGE_SIZE,
  });

  return <PurchasesPage initialData={data} />;
}
