import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const adminBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/",
  credentials: "include",
});

export const adminBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await adminBaseQuery(args, api, extraOptions);

  // If access token expired
  if (result.error && result.error.status === 401) {
    console.log("Admin access token expired, attempting refresh...");

    // Call admin refresh endpoint
    const refreshResult = await adminBaseQuery(
      { url: "auth/admin/refresh/", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {

      result = await adminBaseQuery(args, api, extraOptions);
    } else {
      
      api.dispatch({ type: "admin/logout" });
    }
  }

  return result;
};
