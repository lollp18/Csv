<script>
export default {
  props: {
    open: Boolean,
    classen: Object,
  },
  data() {
    return {
      newTabell: {
        Tname: "",
        zeilen: undefined,
        spalten: undefined,
        data: [],
      },
      invalidZeile: false,
      invalidSpalte: false,
    }
  },
  methods: {
    tabellErstellen() {
      if (this.newTabell.zeilen == 0) {
        this.invalidZeile = true
      } else {
        this.invalidZeile = false
      }

      if (this.newTabell.spalten == 0) {
        this.invalidSpalte = true
      } else {
        this.invalidSpalte = false
      }

      if (this.invalidZeile == false && this.invalidSpalte == false) {
        this.createData()
        const Tabel = this.createTabel()
        this.$emit("NewTabel", Tabel)
        this.newTabell.data = []
      }
    },
    createTabel() {
      const Tabell = new this.classen.Tabel(
        this.newTabell.Tname,
        this.newTabell.data
      )
      return Tabell
    },
    createData() {
      for (let i = 1; i <= this.newTabell.zeilen; i++) {
        const zeile = []
        this.newTabell.data.push(zeile)
        for (let I = 1; I <= this.newTabell.spalten; I++) {
          const zelle = new this.classen.Zelle("")
          zeile.push(zelle)
        }
      }
      console.log(this.newTabell.data)
    },
  },
}
</script>
<template>
  <Teleport to="#new-Tabel">
    <div
      class="new-Tabel-bg"
      v-if="open">
      <div class="new-Tabel">
        <div class="new-Tabel-Input-rapper">
          <input
            class="new-Tabel-input"
            v-model="newTabell.Tname"
            placeholder="Tabellen Name" />
          <input
            :class="
              invalidZeile ? 'new-Tabel-input-invalid' : 'new-Tabel-input'
            "
            v-model="newTabell.zeilen"
            placeholder="Anzahl der Zeilen" />
          <input
            :class="
              invalidSpalte ? 'new-Tabel-input-invalid' : 'new-Tabel-input'
            "
            v-model="newTabell.spalten"
            placeholder="Anzahl der spalten" />
        </div>
        <div class="new-Tabel-btnRapper">
          <button
            @click="tabellErstellen"
            class="btn-download font">
            Tabelle Generiren
          </button>
          <button
            @click="$emit('close')"
            class="btn-download font">
            Abrechen
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
.new-Tabel-bg {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}
.new-Tabel {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  border: 2px solid var(--black);
  gap: 3rem;
  padding: 4rem 4rem;
  height: 40rem;
  width: 50rem;
  border-radius: 5px;
}

.new-Tabel-Input-rapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.new-Tabel-input {
  background-color: var(--white);
  border: 2px solid var(--black);
  font-size: 1.8rem;
  padding: 0.5rem 0.5rem;
}
.new-Tabel-input-invalid {
  background-color: var(--white);
  border: 2px solid #c92a2a;
  font-size: 1.8rem;
  padding: 0.5rem 0.5rem;
}
.new-Tabel-btnRapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.font {
  font-size: 1.8rem;
}
</style>
