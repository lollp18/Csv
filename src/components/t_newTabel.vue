<script>
class Zelle {
  activ;
  constructor(zeile = Number, spalte = Number, zellenInhalt = "") {
    this.zeile = zeile;
    this.spalte = spalte;
    this.zellenInhalt = zellenInhalt;

    this.activ = false;
  }
}

class Tabelle {
  lastZelle = new Zelle();
  currentZelle = new Zelle();
  constructor(tname, data) {
    this.tname = tname;
    this.data = data;
  }
}

export default {
  props: {
    open: Boolean,
  },
  data() {
    return {
      newTabell: {
        Tname: "",
        zeilen: 2,
        spalten: 4,
        data: [],
      },
    };
  },
  methods: {
    tabellErstellen() {
      this.createData();
      const Tabel = this.createTabel();
      this.$emit("NewTabel", Tabel);
    },
    createTabel() {
      const Tdata = [];
      this.newTabell.data.forEach((zeile, zeileID) => {
        const Tzeile = [];
        Tdata.push(Tzeile);
        zeile.forEach((item, spalteID) => {
          const zelle = new Zelle(zeileID, spalteID, item);
          Tzeile.push(zelle);
        });
      });
      const Tabell = new Tabelle(this.newTabell.Tname, Tdata);
      return Tabell;
    },
    createData() {
      const Zeile = Array(this.newTabell.spalten);
      const zeile = Zeile.fill("", 0, this.newTabell.spalten);

      for (let i = 0; i < this.newTabell.zeilen; i++) {
        this.newTabell.data.push(zeile);
      }
    },
  },
};
</script>
<template>
  <Teleport to="#new-Tabel">
    <div class="new-Tabel-bg" v-if="open">
      <div class="new-Tabel">
        <div class="new-Tabel-Input-rapper">
          <input
            class="new-Tabel-input"
            v-model="newTabell.Tname"
            placeholder="Tabellen Name"
          />
          <input
            class="new-Tabel-input"
            v-model="newTabell.zeilen"
            placeholder="Anzahl der Zeilen"
          />
          <input
            class="new-Tabel-input"
            v-model="newTabell.spalten"
            placeholder="Anzahl der spalten"
          />
        </div>
        <div class="new-Tabel-btnRapper">
          <button @click="tabellErstellen" class="btn-download font">
            Tabelle Generiren
          </button>
          <button @click="$emit('close')" class="btn-download font">
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
.new-Tabel-btnRapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.font {
  font-size: 1.8rem;
}
</style>
