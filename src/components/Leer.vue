<template>
  <div :class="`tipo-${tipo_historieta.toLowerCase()}`" id="app">
    <h1>
      <router-link
        :to="`/serie/${id}`"
        style="color: inherit; text-decoration: none;"
        title="Volver al listado de capítulos"
      >
        {{ titulo }} — {{ capitulo }}
      </router-link>
    </h1>

    <!-- Navegación arriba -->
    <div class="navegacion-capitulos">
      <button @click="cambiarCapitulo(-1)" :disabled="!puedeCambiarCapitulo(-1)">⏮️ Anterior</button>

      <select v-if="listaCapitulos.length > 0" v-model="capitulo" @change="seleccionarCapitulo">
        <option v-for="cap in listaCapitulos" :key="cap" :value="cap">{{ cap }}</option>
      </select>

      <button @click="cambiarCapitulo(1)" :disabled="!puedeCambiarCapitulo(1)">Siguiente ⏭️</button>
    </div>

    <!-- Lector de imágenes -->
    <div class="lector">
      <img
        v-for="(img, index) in imagenes"
        :key="index"
        :src="img"
        loading="lazy"
        alt="Página del manga"
      />
    </div>

    <!-- Navegación abajo -->
    <div class="navegacion-capitulos inferior">
      <button @click="cambiarCapitulo(-1)" :disabled="!puedeCambiarCapitulo(-1)">⏮️ Anterior</button>

      <select v-if="listaCapitulos.length > 0" v-model="capitulo" @change="seleccionarCapitulo">
        <option v-for="cap in listaCapitulos" :key="cap" :value="cap">{{ cap }}</option>
      </select>

      <button @click="cambiarCapitulo(1)" :disabled="!puedeCambiarCapitulo(1)">Siguiente ⏭️</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      capitulo: '',
      titulo: '',
      tipo_historieta: '+18',
      imagenes: [],
      urlsPendientes: [],
      baseURL: 'https://f005.backblazeb2.com/file/ComicsMangas',
      series: [],
      listaCapitulos: []
    };
  },
  methods: {
    async existeImagen(url) {
      try {
        const resp = await fetch(url, { method: 'HEAD' });
        return resp.ok;
      } catch {
        return false;
      }
    },
    async generarUrls(totalImgs, ruta, nombreBase = 'image') {
      const urlCero = `${this.baseURL}/${ruta}/${nombreBase}_000.webp`;
      const urlAltCero = `${this.baseURL}/${ruta}/${nombreBase}_0.webp`;

      const empiezaEnCero = await this.existeImagen(urlCero);
      const empiezaEnAlt = !empiezaEnCero && await this.existeImagen(urlAltCero);

      this.urlsPendientes = [];

      const startIndex = empiezaEnCero ? 0 : (empiezaEnAlt ? 0 : 1);
      const pad = empiezaEnAlt ? 1 : 3;

      for (let i = startIndex; i < totalImgs + startIndex; i++) {
        const num = i.toString().padStart(pad, '0');
        const url = `${this.baseURL}/${ruta}/${nombreBase}_${num}.webp`;
        this.urlsPendientes.push(url);
      }
    },
    cargarImagenSecuencial() {
      if (this.urlsPendientes.length === 0) return;

      const url = this.urlsPendientes.shift();
      const img = new Image();

      img.onload = () => {
        this.imagenes.push(url);
        this.cargarImagenSecuencial();
      };

      img.onerror = () => {
        console.warn('Error cargando imagen:', url);
        this.urlsPendientes = [];
      };

      img.src = url;
    },
    async fetchSerieInfo() {
      try {
        const res = await fetch('series.json');
        this.series = await res.json();
        const serie = this.series.find(s => s.id === this.id);

        if (serie) {
          this.titulo = serie.titulo;
          this.tipo_historieta = serie.tipo_historieta || '+18';

          if (serie.capitulos) {
            this.listaCapitulos = Object.keys(serie.capitulos).sort((a, b) => {
              const numA = parseFloat(a);
              const numB = parseFloat(b);
              if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
              return a.localeCompare(b);
            });
          }

          if (this.capitulo && serie.capitulos?.[this.capitulo]) {
            const totalImgs = serie.capitulos[this.capitulo];
            const ruta = `chapter/${encodeURIComponent(this.tipo_historieta)}/${encodeURIComponent(this.id)}/${encodeURIComponent(this.capitulo)}`;
            await this.generarUrls(totalImgs, ruta);
            this.cargarImagenSecuencial();
          } else if (serie.total) {
            const totalImgs = serie.total;
            const ruta = `chapter/${encodeURIComponent(this.tipo_historieta)}/${encodeURIComponent(this.id)}`;
            await this.generarUrls(totalImgs, ruta);
            this.cargarImagenSecuencial();
          } else {
            console.warn('No se encontraron capítulos ni total para la serie');
          }
        } else {
          console.warn('Serie no encontrada con id:', this.id);
        }
      } catch (error) {
        console.error('Error cargando series.json:', error);
      }
    },
    cambiarCapitulo(offset) {
      const index = this.listaCapitulos.indexOf(this.capitulo);
      const nuevoIndex = index + offset;

      if (nuevoIndex >= 0 && nuevoIndex < this.listaCapitulos.length) {
        this.capitulo = this.listaCapitulos[nuevoIndex];
        this.redirigirCapitulo(this.capitulo);
      }
    },
    seleccionarCapitulo(event) {
      this.redirigirCapitulo(this.capitulo);
    },
    redirigirCapitulo(nuevoCap) {
      this.$router.push({ path: `/leer/${this.id}/${nuevoCap}` });
    },
    puedeCambiarCapitulo(offset) {
      const index = this.listaCapitulos.indexOf(this.capitulo);
      const nuevoIndex = index + offset;
      return nuevoIndex >= 0 && nuevoIndex < this.listaCapitulos.length;
    }
  },
  watch: {
    // Cuando cambia capitulo, recarga imágenes
    capitulo(newCap) {
      this.imagenes = [];
      this.urlsPendientes = [];
      this.fetchSerieInfo();
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.capitulo = this.$route.params.cap || '';

    if (this.id) {
      this.fetchSerieInfo();
    }
  }
};
</script>
