import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";
import toast from 'react-hot-toast'
//Artical Quary

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationDate = {};

type Request = {
  _id: string;
  userId: string;
  status: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

type Bins = {
  _id: string;
  userId: string;
  location: string;
  size: string;
  isCollected: boolean;
  createdAt: string;
};

type BinsResponse = {
  success: boolean;
  bins: Bins[];
};

type BinStatusUpdateResponse = {
  message: string;
  bin: Bins;
};

type BinStatusReportResponse = {
  binId: string;
  startDate: string;
  endDate: string;
  trueCount: number;
  falseCount: number;
  totalChanges: number;
};

//Request collect garbage
type CreateRequestData = {
  binId: string;
  message: string;
};



export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationResponse, RegistrationDate>({
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log(error.message);
          } else {
            console.log("An unexpected error occurred.");
          }
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "activate-user",
        method: "POST",
        body: {
          activation_token,
          activation_code,
        },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: {
          email,
          password,
        },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log(error.message);
          } else {
            console.log("An unexpected error occurred.");
          }
        }
      },
    }),
    socialAuth: builder.mutation({
      query: ({ email, name, avatar }) => ({
        url: "social-auth",
        method: "POST",
        body: {
          email,
          name,
          avatar,
        },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log(error.message);
          } else {
            console.log("An unexpected error occurred.");
          }
        }
      },
    }),
    logOut: builder.query({
      query: () => ({
        url: "logout",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log(error.message);
          } else {
            console.log("An unexpected error occurred.");
          }
        }
      },
    }),
    getUsers: builder.query({
      query: () => ({
        url: "get-users",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log(result.data);
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    updateUserRole: builder.mutation({
      query: (userData) => ({
        url: '/update-user',
        method: 'PUT',
        body: userData,
      }),
      async onQueryStarted(userData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authApi.util.invalidateTags(['User']));
        } catch (error) {
          console.error('Error updating user role:', error);
        }
      },
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/delete-user/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authApi.util.invalidateTags(['User']));
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      },
    }),
    getRequests: builder.query<{ success: boolean; requests: Request[] }, void>({
      query: () => ({
        url: "/get-reqs",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    updateRequest: builder.mutation({
      query: ({ requestId, updates }) => ({
        url: `/update-req/${requestId}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    getBins: builder.query<{ success: boolean; bins: Bins[] }, void>({
      query: () => ({
        url: '/get-bins',
        method: 'GET',
        credentials: "include" as const,
      }),
    }),
    createBin: builder.mutation({
      query: (newBinData) => ({
        url: '/create-bin',
        method: 'POST',
        body: newBinData,
      }),
    }),

    updateBin: builder.mutation({
      query: ({ binId, updatedBinData }) => ({
        url: `/update-bin/${binId}`,
        method: 'PUT',
        body: updatedBinData,
      }),
    }),

    deleteBin: builder.mutation({
      query: (binId) => ({
        url: `/del-bin/${binId}`,
        method: 'DELETE',
      }),
    }),
    getBinsById: builder.query<BinsResponse, string>({
      query: (userId) => ({
        url: `/get-bins/${userId}`,
        method: 'GET',
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data.bins);
        } catch (error: any) {
          console.error("Error fetching bins by user ID:", error);
          toast.error("Failed to fetch bins.");
        }
      },
    }),
    updateBinStatus: builder.mutation<BinStatusUpdateResponse, { binId: string; isCollected: boolean }>({
      query: ({ binId, isCollected }) => ({
        url: `/bins/${binId}/status`,
        method: 'PUT',
        body: { isCollected },
        credentials: "include" as const,
      }),
      async onQueryStarted({ binId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message);

          dispatch(authApi.util.invalidateTags(['Bin']));
        } catch (error) {
          console.error('Error updating bin status:', error);
          toast.error("Failed to update bin status.");
        }
      },
    }),

    getBinStatusReport: builder.query<BinStatusReportResponse, { binId: string; startDate: string; endDate: string }>({
      query: ({ binId, startDate, endDate }) => ({
        url: `/bins/${binId}/status-report`,
        method: 'GET',
        params: { startDate, endDate },
        credentials: "include" as const,
      }),
      async onQueryStarted({ binId }, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Bin status report:', data);
        } catch (error) {
          console.error('Error fetching bin status report:', error);
          toast.error("Failed to fetch bin status report.");
        }
      },
    }),
    getAllComplaints: builder.query({
      query: () => ({
        url: "/get-All-compls",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Complaints fetched:', data.complaints);
        } catch (error) {
          console.error('Error fetching complaints:', error);
        }
      },
    }),

    updateComplaint: builder.mutation({
      query: ({ complaintId, updates }) => ({
        url: `/update-compl/${complaintId}`,
        method: 'PUT',
        body: updates,
      }),
    }),

    createComplaint: builder.mutation<{ success: boolean; complaint: any }, { message: string }>({
      query: (data) => ({
        url: '/create-compl',
        method: 'POST',
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ['Complaint'],
    }),
    getComplaints: builder.query({
      query: (userId: string) => ({
        url: `/get-compls/${userId}`,
        method: 'GET',
      }),
    }),

    //----------------------
    createRequest: builder.mutation<{ success: boolean; request: Request }, { userId: string; data: CreateRequestData }>({
      query: ({ userId, data }) => ({
        url: `/rc/${userId}`,
        method: 'POST',
        body: data,
        credentials: "include" as const,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          toast.success("Request created successfully!");

        } catch (error) {
          console.error('Error creating request:', error);
          toast.error("Failed to create request.");
        }
      },
    }),

    fetchCollectRequests: builder.query({
      query: () => ({
        url: '/rc',
        method: 'GET',
      }),
    }),

    modifyRequest: builder.mutation({
      query: ({ requestId, updates }) => ({
        url: `/rc/${requestId}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    getAllBinsStatusReport: builder.query<{
      totalTrueCount: number;
      totalFalseCount: number;
      totalChanges: number;
      totalBins: number;
    }, { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => ({
        url: `/bins/status-report`,
        method: 'POST',
        body: { startDate, endDate },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('All bins status report:', data);
        } catch (error) {
          console.error('Error fetching all bins status report:', error);
          toast.error("Failed to fetch all bins status report.");
        }
      },
    }),

  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useLogOutQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetRequestsQuery,
  useUpdateRequestMutation,
  useGetBinsQuery,
  useCreateBinMutation,
  useUpdateBinMutation,
  useDeleteBinMutation,
  useGetBinsByIdQuery,
  useUpdateBinStatusMutation,
  useGetBinStatusReportQuery,
  useGetAllComplaintsQuery,
  useUpdateComplaintMutation,

  useCreateComplaintMutation,
  useGetComplaintsQuery,

  useCreateRequestMutation,
  useFetchCollectRequestsQuery,
  useModifyRequestMutation,

  useGetAllBinsStatusReportQuery

} = authApi;
