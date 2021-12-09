import { API, graphqlOperation, Storage } from "aws-amplify";
import {
  createAlbum as createAlbumMutation,
  createPhoto as createPhotoMutation,
} from "@/graphql/mutations";
import { getAlbum as getAlbumQuery } from "../../graphql/queries";
import { listAlbums as listAlbumsQuery } from "../../graphql/queries";
import { uuid } from "uuid/v4";
import awsconfig from "@/aws-exports";

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
    async createPhoto(_, data) {
      const {
        aws_user_files_s3_bucket_region: region,
        aws_user_files_s3_bucket: bucket,
      } = awsconfig;
      const { file, type: mimeType, id } = data;
      const extension = file.name.substr(file.name.lastIndexOf(".") + 1);
      const photoId = uuid();
      const key = `images/${photoId}.${extension}`;
      const inputData = {
        id: photoId,
        photoAlbumId: id,
        contentType: mimeType,
        fullsize: {
          key,
          region,
          bucket,
        },
      };
      // s3 bucket storage. Add file ot it!
      try {
        await Storage.put(key, file, {
          level: "protected",
          contentType: mimeType,
          metadata: { albumId: id, photoId },
        });
        await API.graphql(
          graphqlOperation(createPhotoMutation, {
            input: inputData,
          })
        );
        return Promise.resolve("success");
      } catch (error) {
        console.log("createPhotoError", error);
        return Promise.reject(error);
      }
    },
  },
  getters: {
    albums: (state) => state.albums,
  },
};
