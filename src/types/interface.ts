import { NextApiRequest } from "next";
import { NextRequest } from "next/server";

export interface AppNextApiRequest extends NextRequest {
  user?: any;
  // nextUrl?: any;
  dbConn?: any;
  mqttClient?: any;
  business?: any;
}

export interface PaginationResponse {
  per_page: number;
  total_page?: number;
  total_result?: number;
  current_page: number;
  items?: any;
}
