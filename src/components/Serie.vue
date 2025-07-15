<template>
  <div>
    <h1>{{ titulo }}</h1>
    <router-link to="/" class="btn-home">🏠 Volver al Inicio</router-link>

    <div v-if="capitulos.length > 0">
      <h2>Capítulos disponibles</h2>
      <ul>
        <li v-for="cap in capitulos" :key="cap">
          <router-link :to="cap === 'Unico' ? `/leer/${serieId}` : `/leer/${serieId}/${encodeURIComponent(cap)}`">
            {{ cap }}
          </router-link>
        </li>
      </ul>
    </div>

    <div v-else>
      <p>Cargando capítulos o la serie no existe.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      series: [],
      serieId: '',
      titulo: '',
      capitulos: [],
    };
  },
  methods: {
    async cargarSeries() {
      try {
        const res = await fetch(fetch(`${import.meta.env.BASE_URL}series.json`));
        this.series = await res.json();

        const serie = this.series.find(s => s.id === this.serieId);
        if (serie) {
          this.titulo = serie.titulo;

          if (serie.capitulos) {
            this.capitulos = Object.keys(serie.capitulos).sort();
          } else if (serie.total) {
            this.capitulos = ['Unico'];
          } else {
            this.capitulos = [];
          }
        } else {
          console.warn('No se encontró la serie con id:', this.serieId);
        }
      } catch (error) {
        console.error('Error cargando series.json:', error);
      }
    },
  },
  mounted() {
    this.serieId = this.$route.params.id;
    if (this.serieId) {
      this.cargarSeries();
    }
  },
};
</script>
