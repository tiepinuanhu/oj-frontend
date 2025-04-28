import instance from "../../axios/request";

export interface Tag {
    id?: number;
    name?: string;
    color?: string;
}
export const getAllTags = () => {
    return instance({
      url: "/tag/list",
      method: "get",
    });
  };