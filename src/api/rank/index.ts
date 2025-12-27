import instance from "../../axios/request";
import type { UserRank } from "./type";

export const getDailyRank = () => {
  return instance({
    url: "/submission/dailyRank",
    method: "get"
  });
};