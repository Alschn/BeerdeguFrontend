import { axiosGatewayClient } from "./AxiosClient";
import type { Room, BeerSimplified } from "./types";

interface DashboardStatisticsParams {
  date_from: string;
  date_to: string;
}

// interface RatingWithSimplifiedBeerSerializer {
//   id: number;
//   beer: BeerSimplified;
//   added_by: number;
//   note: number;
//   created_at: string;
//   updated_at: string;
// }

interface DashboardStatistics {
  consumed_beers_count: number;
  average_rating: number;
  rooms_joined_count: number;
  rooms_created_count: number;
  current_rooms: Room[];
  // highest_rating: RatingWithSimplifiedBeerSerializer | null;
  // lowest_rating: RatingWithSimplifiedBeerSerializer | null;
  // recently_consumed_beers: BeerSimplified[];
}

export const getDashboardStatistics = (params: DashboardStatisticsParams) => {
  return axiosGatewayClient.get<DashboardStatistics>(
    "/api/statistics/dashboard/",
    {
      params,
    }
  );
};
