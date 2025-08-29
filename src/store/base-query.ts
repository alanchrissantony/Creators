import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL as string,
  credentials: "include",
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If access token expired
  if (result.error && result.error.status === 401) {
    console.log('Access token expired, attempting refresh...');

    // Call refresh endpoint
    const refreshResult = await baseQuery(
      { url: 'auth/refresh/', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Retry original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, log out
      api.dispatch({ type: 'auth/logout' });
    }
  }

  return result;
};
