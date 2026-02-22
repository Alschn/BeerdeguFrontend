import { axiosGatewayClient } from "./AxiosClient";
import type {
  Room,
  BeerSimplified,
  BeerStyleEmbedded,
  BreweryDetail,
} from "./types";

interface DashboardStatisticsParams {
  date_from: string;
  date_to: string;
}

export interface RatingWithSimplifiedBeer {
  id: number;
  beer: BeerSimplified;
  added_by: number;
  note: number;
  created_at: string;
  updated_at: string;
}

export type EntityDistributionStat = {
  name: string;
  count: number;
};

export interface DashboardStatistics {
  consumed_beers_count: number;
  average_rating: number | null;
  rooms_joined_count: number;
  rooms_created_count: number;
  current_rooms: Room[];
  recently_consumed_beers: BeerSimplified[];
  highest_rating: RatingWithSimplifiedBeer | null;
  lowest_rating: RatingWithSimplifiedBeer | null;
  beer_styles_count: number;
  favourite_beer_style: BeerStyleEmbedded | null;
  breweries_count: number;
  favourite_brewery: BreweryDetail | null;
  beer_styles_distribution_chart: EntityDistributionStat[];
  breweries_distribution_chart: EntityDistributionStat[];
}

export const getDashboardStatistics = (params: DashboardStatisticsParams) => {
  return axiosGatewayClient.get<DashboardStatistics>(
    "/api/statistics/dashboard/",
    {
      params,
    }
  );
};
