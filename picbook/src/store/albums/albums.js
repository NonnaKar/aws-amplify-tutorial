import { API, graphqlOperation } from "@aws-amplify/api";
import { createAlbum as createAlbumMutation } from "../../graphql/mutations";
import { getAlbum as getAlbumQuery } from "../../graphql/queries";
import { listAlbums as listAlbumsQuery } from "../../graphql/queries";
export const albumInfo = {
  namespaced: true,
  state: { error: null, albums: null },
  mutations: {
    setAlbums(state, payload) {
      state.albums = payload;
    },
  },
  actions: {
    async createAlbum({ dispatch }, newAlbum) {
      try {
        await API.graphql(
          graphqlOperation(createAlbumMutation, { input: newAlbum })
        );
        dispatch("getAlbumsList");
      } catch (error) {
        console.error("createalbum", error);
      }
    },
    async getAlbum(_, albumId) {
      try {
        await API.graphql(graphqlOperation(getAlbumQuery, { id: albumId }));
      } catch (error) {
        console.error("getAlbum", error);
      }
    },
    async getAlbumsList({ commit }) {
      const listAlbumsData = await API.graphql(
        graphqlOperation(listAlbumsQuery)
      );
      commit("setAlbums", listAlbumsData.data.listAlbums.items);
    },
  },
  getters: {
    albums: (state) => state.albums,
  },
};
