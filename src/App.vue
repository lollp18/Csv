<script>
// Librarys

import { mapFields } from "vuex-map-fields"

// Compnents

import btnDelet from "./components/t_btnDelet.vue"
import newTabel from "./components/t_newTabel.vue"
import bearbeiten from "./components/t_Bearbeiten.vue"
import ZellenTauschen from "./components/t_ZellenTauschen.vue"

// Others

import { ref } from "vue"

export default {
  async created() {
    await this.$store.dispatch("GetTabels")
    this.HasTabels()
  },
  async updated() {
    await this.$nextTick(async () => {
      await this.$store.dispatch("SaveTabels")
      this.HasTabels()
      this.$store.commit("InitSeitenBerechnen")
    })
  },
  mounted() {
    this.$store.commit("InitSeitenBerechnen")

    this.$store.commit("SetCurrentSeiteFirst")
    window.addEventListener("resize", () => {
      this.$store.commit("ResizeWindow")
    })
    this.$store.commit("SetFileInput", this.$refs.fileInput)
  },
  unmounted() {
    window.removeEventListener("resize")
  },

  components: {
    btnDelet,
    newTabel,
    bearbeiten,
    ZellenTauschen,
  },
  computed: {
    ...mapFields({
      CurrentTabelName: "currentTabelle.TabelName",
      CurrentZelleninhalt: "currentTabelle.currentZelle.zellenInhalt",
    }),
  },
  data() {
    return {
      darkMode: false,

      tabelhidde: true,
      noTabelhidde: false,
      newTabelopen: ref(false),
      Tbearbeiten: ref(false),
      ZellenTauschen: ref(false),
    }
  },
  methods: {
    async DeletTabel() {
      if (this.$store.getters.UploadFilename == this.$store.getters.TabelName) {
        this.ResteFile()

        await this.$store.dispatch("InitDelet")
      } else {
        await this.$store.dispatch("InitDelet")
      }
    },

    getSelectTabel(e) {
      this.$store.commit("getSelectTabel", e)
    },

    // Uploade File

    async getFile(e) {
      await this.$store.dispatch("GetData", e)

      this.$store.commit("CreateTabel")
    },

    // Zellen bearbeiten

    getClickedItem(zeile, spalte, zelleninhalt) {
      const SelectetZelle = {
        zeile,
        spalte,
        zelleninhalt,
      }

      this.$store.commit("InitZelleBerarbeiten", SelectetZelle)
    },

    // Ghost Zellen

    creatGhostZeile() {
      createElement("div")
    },

    // check and set

    ResteFile() {
      this.$refs.fileInput.value = null
    },

    HasTabels() {
      if (this.$store.getters.currentTabellesLength == 0) {
        this.tabelhidde = true
        this.noTabelhidde = false
      } else {
        this.tabelhidde = false
        this.noTabelhidde = true
      }
    },

    darkMode() {
      document.body.classList.add("darkMode")
    },
  },
}
</script>

<template>
  <bearbeiten
    :open="Tbearbeiten"
    @closeTabelBearbeiten="Tbearbeiten = false" />
  <newTabel
    :open="newTabelopen"
    @close="newTabelopen = false" />
  <ZellenTauschen
    :open="ZellenTauschen"
    @closeZellenTauschen="ZellenTauschen = false" />
  <header>
    <input
      class="file-input"
      type="file"
      ref="fileInput"
      @change="getFile"
      accept=".csv" />
    <select
      class="auswahl-container"
      @change="getSelectTabel">
      <option
        v-for="(tabel, i) in $store.getters.currentTabelles"
        :key="i"
        :value="i">
        {{ tabel.TabelName }}
      </option>
    </select>
    <button
      class="btn"
      @click="Tbearbeiten = true">
      Tabelle Bearbeiten
    </button>
    <button
      class="btn"
      @click="ZellenTauschen = true">
      Zellen Tauschen
    </button>
    <button
      class="btn"
      @click="newTabelopen = true">
      Neue Tabelle erstellen
    </button>
    <a
      class="btn"
      @click="$store.commit('downlodFile')"
      :href="$store.getters.href"
      :download="TabelName"
      >Download</a
    >
    <button
      class="btn"
      @click="DeletTabel">
      Tabelle Löschen
    </button>
  </header>

  <div :class="noTabelhidde ? 'hidde' : 'noTabel'">
    <p class="noTabel-text">Hir Erscheinen ihre Tabelle</p>
  </div>
  <table :class="tabelhidde ? 'hidde' : ''">
    <div class="tabel-info">
      <input
        class="tabel-name"
        @input="$store.commit('SetCurrentTabelName')"
        v-model="CurrentTabelName" />
      <input
        class="zellen-inhalt"
        type="text"
        @input="$store.commit('SetZellenValue')"
        v-model="CurrentZelleninhalt" />
    </div>

    <tbody>
      <tr>
        <!-- Tabel Header BTN Delet -->
        <div class="rapperTop-btnDelet">
          <div class="zelle-placeholder"></div>
          <div class="zelle-placeholder"></div>
          <btnDelet @click="$store.commit('spalteLöschen', 0)" />
          <div
            v-for="i in $store.getters.currentTabelleFirstZeile.length - 1"
            :key="i">
            <btnDelet
              @click="$store.commit('spalteLöschen', i)"
              v-if="
                i > 0 &&
                i >= $store.getters.CurrentSeiteStart &&
                i <= $store.getters.CurrentSeiteEnde
              " />
          </div>
        </div>
        <!-- Tabel Header Spalten Nummern -->
        <div class="rapperTop-btnDelet">
          <div class="zelle-placeholder"></div>
          <div class="zelle-placeholder"></div>
          <div class="zelle-nummer">1</div>
          <div
            v-for="i in $store.getters.currentTabelleFirstZeile.length - 1"
            :key="i">
            <div
              class="zelle-nummer"
              v-if="
                i > 0 &&
                i >= $store.getters.CurrentSeiteStart &&
                i <= $store.getters.CurrentSeiteEnde
              ">
              {{ i + 1 }}
            </div>
          </div>
        </div>
        <!-- Tabel Header Data -->
        <td class="t-header">
          <btnDelet @click="$store.commit('zeileLöschen', 0)" />
          <div class="zelle-nummer">1</div>
          <div class="t-header">
            <div
              ref="zelle"
              :class="
                $store.getters.currentTabelleFirstZelle.activ
                  ? 'zelle-activ'
                  : 'zelle'
              "
              @click="
                getClickedItem(
                  0,
                  0,
                  $store.getters.currentTabelleFirstZelle.zellenInhalt
                )
              ">
              {{ $store.getters.currentTabelleFirstZelle.zellenInhalt }}
            </div>
            <div
              v-for="(Zelle, i) in $store.getters.currentTabelleFirstZeile"
              :key="i">
              <div
                v-if="
                  i > 0 &&
                  i >= $store.getters.CurrentSeiteStart &&
                  i <= $store.getters.CurrentSeiteEnde
                "
                :class="Zelle.activ ? 'zelle-activ' : 'zelle'"
                @click="getClickedItem(0, i, Zelle.zellenInhalt)">
                {{ Zelle.zellenInhalt }}
              </div>
            </div>
          </div>
        </td>
      </tr>
      <!-- Tabel Seitenleiste -->
      <tr class="t-ab-raper">
        <!-- Tabel Seitenleiste BTN Delet -->
        <div>
          <div
            class="rapperSide-btnDelet"
            v-for="i in $store.getters.currentTabelleData.length - 1"
            :key="i">
            <btnDelet
              v-if="i != 0"
              @click="$store.commit('zeileLöschen', i)" />
          </div>
        </div>
        <!-- Tabel Seitenleiste Zeilen Nummern -->
        <div>
          <div
            class="rapperSide-btnDelet"
            v-for="i in $store.getters.currentTabelleData.length - 1"
            :key="i">
            <div
              class="zelle-nummer"
              v-if="i != 0">
              {{ i + 1 }}
            </div>
          </div>
        </div>
        <!-- Tabel Seitenleiste  Data-->
        <td class="t-aside">
          <div
            v-for="(Zeile, i) in $store.getters.currentTabelleData"
            :key="i">
            <div v-if="i != 0">
              <div
                v-for="(Zelle, I) in Zeile"
                :key="I">
                <div
                  :class="Zelle.activ ? 'zelle-activ' : 'zelle'"
                  @click="getClickedItem(i, I, Zelle.zellenInhalt)"
                  v-if="I < 1">
                  {{ Zelle.zellenInhalt }}
                </div>
              </div>
            </div>
          </div>
        </td>
        <!-- Tabel Body Data -->
        <td class="t-body">
          <div
            v-for="(Zeile, i) in $store.getters.currentTabelleData"
            :key="i">
            <div
              class="zeile"
              v-if="i != 0">
              <div
                v-for="(Zelle, I) in Zeile"
                :key="I">
                <div
                  :class="Zelle.activ ? 'zelle-activ' : 'zelle'"
                  @click="getClickedItem(i, I, Zelle.zellenInhalt)"
                  v-if="
                    I > 0 &&
                    I >= $store.getters.CurrentSeiteStart &&
                    I <= $store.getters.CurrentSeiteEnde
                  ">
                  {{ Zelle.zellenInhalt }}
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
    <!-- Seiten Wechseln -->
    <div class="seiten-rapper">
      <button
        :class="$store.getters.BtnSeitenLinks ? 'btn-seiten-FL' : 'hidde'"
        @click="$store.commit('SeiteFirst')">
        First
      </button>
      <button
        :class="$store.getters.BtnSeitenLinks ? 'btn-seiten' : 'hidde'"
        @click="$store.commit('SeiteZurück')">
        <ion-icon name="chevron-back-outline"></ion-icon>
      </button>
      <div class="btn-seiten zahl">
        {{ $store.getters.CurrentSeiteZahl }}
      </div>
      <button
        :class="$store.getters.BtnSeitenRechts ? 'btn-seiten' : 'hidde'"
        @click="$store.commit('SeiteVor')">
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </button>
      <button
        :class="$store.getters.BtnSeitenRechts ? 'btn-seiten-FL' : 'hidde'"
        @click="$store.commit('SeiteLast')">
        Last
      </button>
    </div>
  </table>
</template>

<style>
/* --- Global Styls --- */
:root {
  --MainColor: #fff;

  --SecondaryColor: #000;

  --table-border-color: #e9ecef;

  --Invalide-CloseColor: #c92a2a;
}

#app {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
html {
  font-size: 62.5%;
  overflow: hidden;
}
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  padding: 0;
  margin: 0;
  height: 100vh;
  overflow: hidden;
  color: var(--SecondaryColor);
  background: var(--MainColor);
  transition: color 0.5s, background-color 0.5s;
  line-height: 1.6;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;

  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

ion-icon {
  padding: 2px;
  font-size: 20px;
  color: var(--SecondaryColor);
}

.hidde {
  display: none;
}

.noTabel {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.noTabel-text {
  font-size: xx-large;
}

/* --- components --- */

.draggable-container {
  top: 50%;
  left: 50%;

  display: flex;
  flex-direction: column;
  border-radius: 11px;
  position: absolute;
  z-index: 99;
  border: 2px solid var(--SecondaryColor);
  background-color: var(--MainColor);
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
.draggable-header {
  z-index: 99;
  width: 1rem;
  margin: 2px;
  background-color: var(--MainColor);
}
.menü-rapper {
  display: flex;
  flex-direction: column;

  height: 90%;
}

.btnclose {
  border-radius: 9px;
}

.btnclose ion-icon {
  color: var(--Invalide-CloseColor);
}
.invalid {
  border: 2px solid var(--Invalide-CloseColor);
}
/* --- Header --- */
header {
  display: flex;
  gap: 1rem;

  padding: 2rem 4rem;
}
::-webkit-file-upload-button {
  padding: 0.5rem 1rem;
  border-radius: 11px;
  background-color: var(--MainColor);
  font-size: 1.5rem;
  border: 0.5px solid var(--SecondaryColor);
}
.auswahl-container {
  background-color: var(--MainColor);
  border: 0.5px solid var(--SecondaryColor);
  width: 20rem;
}
.add-tabellEL {
  height: 100%;
}
.btn {
  border: 0.5px solid var(--SecondaryColor);
  padding: 0.5rem 1rem;
  border-radius: 1.2rem;
  background-color: var(--MainColor);
  font-size: 1.5rem;
  color: var(--SecondaryColor);
}
.btn:link {
  text-decoration: none;
}

/* Tabel Header */

.tabel-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.tabel-name {
  padding: 0.5rem 0.5rem;
  background-color: var(--MainColor);
  border: 0.5px solid var(--SecondaryColor);

  width: 10%;
}
.zellen-inhalt {
  padding: 0.5rem 0.5rem;

  width: 90%;
}

/* Main Tabel */

.rapperTop-btnDelet {
  display: flex;
  overflow: hidden;
}
.rapperSide-btnDelet {
  display: flex;
  flex-direction: column;
}
table {
  display: flex;

  flex-direction: column;
  border-collapse: collapse;
  height: 100%;
  width: 100vw;
  font-size: 10pt;
  padding: 0;
  margin: 0;
}
tbody {
  border: 2px solid var(--table-border-color);
}
.t-header {
  display: flex;
  overflow: hidden;
}
.header-zeile {
  overflow: hidden;
  text-align: center;
  border: 1px solid var(--table-border-color);

  height: 2.5rem;
  width: 7.9rem;
}
.t-ab-raper {
  display: flex;
  height: 70vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.t-aside {
  display: flex;
  flex-direction: column;
  width: 7.9rem;
  height: 100%;
}
.aside {
  display: flex;
  flex-direction: column;
}
.aside-zeile {
  display: flex;
  flex-direction: column;
  text-align: center;
  border: 1px solid var(--table-border-color);
}
.t-body {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.zeile {
  display: flex;
}
/* --- Zellen ---  */
.zelle {
  overflow: hidden;
  text-align: center;
  border: 1px solid var(--table-border-color);

  height: 2.5rem;
  width: 7.9rem;
  transition: all 0.3ms;
}

.zelle:hover {
  border: 1px solid var(--SecondaryColor);
}
.zelle-activ {
  overflow: hidden;
  text-align: center;
  border: 1.9px solid var(--SecondaryColor);

  height: 2.5rem;
  width: 7.9rem;
  transition: all 0.3ms;
}
.zelle-placeholder {
  border: 1px solid var(--table-border-color);
  background-color: #f8f9fa;
  height: 2.5rem;
  width: 7.9rem;
}
.zelle-nummer {
  text-align: center;
  border: 1px solid var(--table-border-color);

  height: 2.5rem;
  width: 7.9rem;
}

/* --- Seiten Wechseln --- */

.seiten-rapper {
  padding: 1rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-seiten {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--SecondaryColor);

  border-radius: 50%;
  background-color: var(--MainColor);
  font-size: 1.5rem;
}
.btn-seiten-FL {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--SecondaryColor);
  padding: 0.5rem 1rem;
  border-radius: 11px;
  background-color: var(--MainColor);
  font-size: 1.5rem;
}
.zahl {
  width: 2.5rem;
  padding: 0 0.5rem;
}
</style>
