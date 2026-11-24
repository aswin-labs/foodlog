export type RatingBreakdown = {
  overall: number;
  foodQuality: number;
  valueForMoney: number;
  service: number;
  ambience: number;
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
