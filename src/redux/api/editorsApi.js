const { baseApi } = require("./baseApi");

const EditorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEditors: builder.query({
      query: (id) => ({
        url: `/editors`,
        method: "GET",
      }),
      providesTags: ["editor"],
    }),
    addModaretor: builder.mutation({
      query: (data) => ({
        url: "/auth/moderators/signup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["editor"],
    }),
    deleteEditor: builder.mutation({
      query: (id) => ({
        url: `/editors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["editor"],
    }),
    updateEditor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/editors/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["editor"],
    }),

    // change role
    changeRole: builder.mutation({
      query: ({ email, role }) => ({
        url: `/auth/change-role/${email}`,
        method: "PATCH",
        body: { role: role },
      }),
      invalidatesTags: ["editor"],
    }),

    // get admin
    getAdmins: builder.query({
      query: () => ({
        url: `/admins/all`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),

    addAdmin: builder.mutation({
      query: (data) => ({
        url: "/admins",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["admin"],
    }),

    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin"],
    }),
  }),
});

export const {
  useGetEditorsQuery,
  useAddModaretorMutation,
  useDeleteEditorMutation,
  useUpdateEditorMutation,
  useChangeRoleMutation,
  useGetAdminsQuery,
  useAddAdminMutation,
  useDeleteAdminMutation,
} = EditorApi;
