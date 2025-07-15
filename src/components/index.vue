<template>
  <div>
    <h1>Series disponibles</h1>
    <button @click="mostrarAdultos = !mostrarAdultos" style="margin-bottom:1rem;">
      {{ mostrarAdultos ? 'Ocultar contenido +18' : 'Mostrar contenido +18' }}
    </button>
    <div v-for="(seriesGrupo, tipo) in seriesFiltradasPorTipo" :key="tipo" class="seccion-tipo">
      <h2>{{ tipo }}</h2>
      <div class="tarjeta-grid">
        <div v-for="serie in seriesGrupo" :key="serie.id" class="tarjeta-serie">
          <router-link :to="`/serie/${serie.id}`" class="tarjeta-link">
            <img :src="serie.portada" :alt="serie.titulo" class="tarjeta-imagen" />
            <div class="tarjeta-texto"><h3>{{ serie.titulo }}</h3></div>
            <div class="estado-tag" :class="estadoClass(serie.estado)">
              {{ estadoTexto(serie.estado) }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mostrarAdultos: false,
      series: [],
    };
  },
  computed: {
    seriesFiltradasPorTipo() {
      const grupos = {};
      for (const serie of this.series) {
        const tipo = serie.tipo_historieta || 'Sin categoría';
        if (!this.mostrarAdultos && tipo === '+18') continue;
        if (!grupos[tipo]) grupos[tipo] = [];
        grupos[tipo].push(serie);
      }
      return grupos;
    },
  },
  methods: {
    estadoTexto(estado) {
      switch (estado) {
        case 'finalizado': return 'Finalizado';
        case 'publicandose': return 'Publicándose';
        case 'pausa': return 'En pausa';
        default: return '';
      }
    },
    estadoClass(estado) {
      return {
        finalizado: estado === 'finalizado',
        publicandose: estado === 'publicandose',
        pausa: estado === 'pausa',
      };
    },
    async cargarSeries() {
      try {
        const res = await fetch('series.json');
        this.series = await res.json();
      } catch (error) {
        console.error('Error cargando series.json:', error);
      }
    },
  },
  mounted() {
    this.cargarSeries();
  },
};
</script>
