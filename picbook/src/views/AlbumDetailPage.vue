<template>
  <div>
    <h3>Album Detail Page</h3>
  </div>
</template>
<script>
export default {
  data: () => ({
    photos: [],
    albumName: "",
  }),
  mounted() {
    this.getPhotos();
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    async getPhotos() {
      const album = await this.$store.dispatch("albumInfo/getAlbum", this.id);
      this.photos = album.data.getAlbum.photos.items;
      this.albumName = album.data.getAlbum.name;
    },
    async onFile(file) {
      if (!file.target || !file.target.files[0]) {
        return;
      }
      try {
        await this.$store.dispatch("albumInfo/createPhoto", {
          file: file.target.files[0],
          id: this.id,
        });
        this.getPhotos();
      } catch (error) {
        console.log("create photo error", error);
      }
    },
  },
};
</script>
<style lang=""></style>
