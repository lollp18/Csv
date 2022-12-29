<script>
import "./assets/main.css"
import papa from "papaparse"
import btnDelet from "./components/t_btnDelet.vue"
import newTabel from "./components/t_newTabel.vue"
import bearbeiten from "./components/t_Bearbeiten.vue"

import { extend, isArray } from "@vue/shared"
import { ref } from "vue"

class Zelle {
  activ
  constructor(zellenInhalt = "") {
    this.zellenInhalt = zellenInhalt

    this.activ = false
  }
}

class Tabelle {
  lastZelle = {
    zeile: undefined,
    spalten: undefined,
    zellenInhalt: "",
    activ: false,
  }
  currentZelle = {
    zeile: undefined,
    spalten: undefined,
    zellenInhalt: "",
    activ: false,
  }
  constructor(tname, data) {
    this.tname = tname
    this.data = data
  }
}

export default {
  async created() {
    await this.getTabels()
    this.HasTabels()
    this.setTabelSize()
  },
  async updated() {
    await this.saveTabels()
    this.HasTabels()
    this.setTabelSize()
  },
  components: {
    btnDelet,
    newTabel,
    bearbeiten,
  },
  data() {
    return {
      drag: false,
      Tabelle: {
        tname: "Plazhalter",
        data: [
          ["a", "b", "c", "d", "e", "f", "g", "h"],
          ["a", "b", "c", "d", "e", "f", "g", "h"],
          ["a", "b", "c", "d", "e", "f", "g", "h"],
        ],
        lastZelle: {
          zeile: undefined,
          spalten: undefined,
          zellenInhalt: "",
          activ: false,
        },
        currentZelle: {
          zeile: undefined,
          spalten: undefined,
          zellenInhalt: "",
          activ: false,
        },
      },
      TabelenGröße: {
        hohe: 0,
        breite: 0,
      },
      currentTabelle: [],

      TDownload: [],
      href: "",
      filename: "",
      darkMode: false,
      SelektetEL: "zeile",
      zeile: {},
      spalte: {},
      apiURL: "http://localhost/",
      tabelhidde: true,
      noTabelhidde: false,
      newTabelopen: ref(false),
      Tbearbeiten:ref( false),
    }
  },
  methods: {
    HasTabels() {
      if (this.currentTabelle.length == 0) {
        this.tabelhidde = true
        this.noTabelhidde = false
      } else {
        this.tabelhidde = false
        this.noTabelhidde = true
      }
    },
    async getFile(e) {
      const data = await this.getData(e)

      const tabelle = this.createTabel(data)

      this.currentTabelle.push(tabelle)

      this.Tabelle = tabelle

      console.log(this.currentTabelle)
    },
    cerateTabelldata(data) {
      const Tdata = []
      data.forEach((zeile) => {
        const Tzeile = []
        Tdata.push(Tzeile)
        zeile.forEach((item) => {
          const zelle = new Zelle(item)
          Tzeile.push(zelle)
        })
      })
      return Tdata
    },
    createTabel(data) {
      const Tdata = this.cerateTabelldata(data.data)
      const Tabell = new Tabelle(data.fileName, Tdata)
      return Tabell
    },
    async getData(e) {
      const [file] = await e.target.files
      const fileName = this.FormatFilename(file.name)
      const content = await file.text()

      const datas = papa.parse(content)
      const data = datas.data

      return {
        fileName,
        data,
      }
    },
    getClickedItem(zeile, spalte, zelleninhalt) {
      this.SaveLastZelle()

      this.SetCurrentZelle(zeile, spalte, zelleninhalt)

      this.SetFocusedZelle()
    },
    SaveLastZelle() {
      this.Tabelle.lastZelle.zeile = this.Tabelle.currentZelle.zeile
      this.Tabelle.lastZelle.spalten = this.Tabelle.currentZelle.spalten
      this.Tabelle.lastZelle.zellenInhalt =
        this.Tabelle.currentZelle.zellenInhalt
      this.Tabelle.lastZelle.activ = this.Tabelle.currentZelle.activ
    },
    SetCurrentZelle(zeile, spalte, zelleninhalt) {
      this.Tabelle.currentZelle.zeile = zeile
      this.Tabelle.currentZelle.spalten = spalte
      this.Tabelle.currentZelle.zellenInhalt = zelleninhalt
    },
    SetFocusedZelle() {
      this.Tabelle.data[this.Tabelle.currentZelle.zeile][
        this.Tabelle.currentZelle.spalten
      ].activ = true
      this.Tabelle.data[this.Tabelle.lastZelle.zeile][
        this.Tabelle.lastZelle.spalten
      ].activ = false
    },
    setZellenValue() {
      this.Tabelle.data[this.Tabelle.currentZelle.zeile][
        this.Tabelle.currentZelle.spalten
      ].zellenInhalt = this.Tabelle.currentZelle.zellenInhalt
    },

    async saveTabels() {
      try {
        const tabels = this.currentTabelle
        const json = JSON.stringify(tabels)

        const optons = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: json,
        }

        const res = await fetch(this.apiURL, optons)
        console.log(res, "post")
      } catch (error) {
        console.log(e.message)
      }
    },
    async getTabels() {
      try {
        const res = await fetch(this.apiURL)
        const data = await res.json()
        console.log(data)

        if (data.length == 0) {
          this.currentTabelle = data
          this.tabelhidde = true
          this.noTabelhidde = false
        } else {
          this.currentTabelle = data
          this.Tabelle = this.currentTabelle[0]
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    getSelectTabel(e) {
      this.selectTabelId = e.target.value
      console.log(this.selectTabelId)
      this.Tabelle = this.currentTabelle[this.selectTabelId]
      console.log(this.Tabelle)
    },
    getTabelOption(e) {
      this.Tabelle = this.currentTabelle[this.selectTabelId]
    },
    FormatFilename(fileName) {
      const newFilename = fileName.slice(0, -4)
      return newFilename
    },
    downlodFile() {
      const data = this.FormatData()
      const csv = papa.unparse(data)
      console.log(csv)
      this.href = `data:text/csv;charset=utf-8,${csv}`
      this.filename = this.Tabelle.tname
    },
    FormatData() {
      const Tdata = []
      this.Tabelle.data.forEach((item) => {
        const zeilen = []

        Tdata.push(zeilen)
        item.forEach((item) => {
          const e = Object.entries(item).flat()
          const a = e[3]
          zeilen.push(a)
        })
      })
      return Tdata
    },

    darkMode() {
      document.body.classList.add("darkMode")
    },
    spalteLöschen(i) {
      this.Tabelle.data.forEach((zeile) => {
        zeile.splice(i, 1)
      })
      console.log(this.Tabelle.data)
    },
    zeileLöschen(i) {
      this.Tabelle.data.splice(i, 1)
      console.log(this.Tabelle.data)
    },
    async DeletTabel() {
      await this.Delettabel()

      await this.getTabels()
      this.HasTabels()
      console.log(this.currentTabelle)
    },
    async Delettabel() {
      try {
        const TabelleInfo = {
          id: this.selectTabelId,
        }
        const json = JSON.stringify(TabelleInfo)

        const optons = {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: json,
        }

        const res = await fetch(this.apiURL, optons)
        console.log(res)
      } catch (e) {
        console.log(e.message)
      }
    },
    insertTabel(tabelle) {
      this.newTabelopen = false
      this.currentTabelle.unshift(tabelle)
      this.Tabelle = tabelle
    },

    setTabelSize() {
      this.TabelenGröße.hohe = this.Tabelle.data.length
      this.TabelenGröße.breite = this.Tabelle.data[0].length
    },
    createZeile() {
      this.setTabelSize()

      const zeile = []

      for (let i = 0; i < this.TabelenGröße.breite; i++) {
        const zelle = new Zelle("")
        zeile.push(zelle)
      }
      return zeile
    },
    GeneratZeile() {
      const zeilen = []
      for (let i = 0; i < this.zeile.anzahl; i++) {
        const zeile = this.createZeile()
        zeilen.push(zeile)
      }
      return zeilen
    },

    zeilenEinfügen(zeile) {
      this.zeile = zeile
      console.log(this.zeile)

      const zeilen = this.GeneratZeile()

      const zeilePos = this.zeile.zeile - 1
      if (zeilePos == 0 && this.zeile.position == "Ü") {
        zeilen.forEach((zeile) => {
          this.Tabelle.data.unshift(zeile)
        })
      } else if (
        zeilePos == this.TabelenGröße.hohe - 1 &&
        this.zeile.position == "U"
      ) {
        zeilen.forEach((zeile) => {
          this.Tabelle.data.push(zeile)
        })
      } else {
        const Pos = this.getIsertIndexZeile(zeilePos)
        zeilen.forEach((zeile) => {
          this.Tabelle.data.splice(Pos, 0, zeile)
        })
      }

      console.log(this.Tabelle.data)
    },
    getIsertIndexZeile(pos) {
      if (this.zeile.position == "Ü") {
        return pos
      } else {
        const newPos = pos + 1
        return newPos
      }
    },
    zeilenTauschen(zeilen) {
      let temp = []
      this.Tabelle.data[zeilen.erste - 1].forEach((item, i) => {
        temp.push(item.zellenInhalt)
        item.zellenInhalt = this.Tabelle.data[zeilen.zweite - 1][i].zellenInhalt
        this.Tabelle.data[zeilen.zweite - 1][i].zellenInhalt = temp[i]
      })
    },
    spaltenEinfügen(spalte) {
      console.log(spalte)
      const zeilePos = spalte.spalte - 1
      if (zeilePos == 0 && spalte.position == "L") {
        for (let i = 0; i < spalte.anzahl; i++) {
          this.Tabelle.data.forEach((zeilen, i) => {
            const zelle = new Zelle("")
            zeilen.unshift(zelle)
          })
        }
      } else if (
        zeilePos == this.TabelenGröße.breite - 1 &&
        spalte.position == "R"
      ) {
        for (let i = 0; i < spalte.anzahl; i++) {
          this.Tabelle.data.forEach((zeilen, i) => {
            const zelle = new Zelle("")
            zeilen.push(zelle)
          })
        }
      } else {
        const pos = this.getIsertIndexSpalte(zeilePos)
        for (let i = 0; i < spalte.anzahl; i++) {
          this.Tabelle.data.forEach((zeilen, i) => {
            const zelle = new Zelle("")
            zeilen.splice(pos, 0, zelle)
          })
        }
      }
    },
    getIsertIndexSpalte(pos) {
      if (this.spalte.position == "L") {
        return pos
      } else {
        const newPos = pos + 1
        return newPos
      }
    },
    spaltenTauschen(spalten) {
      let temp = []
      this.Tabelle.data.forEach((zeile, i) => {
        temp.push(zeile[spalten.erste - 1].zellenInhalt)
        zeile[spalten.erste - 1].zellenInhalt =
          zeile[spalten.zweite - 1].zellenInhalt
        zeile[spalten.zweite - 1].zellenInhalt = temp[i]
      })
      console.log(temp)
    },
  },
}
</script>

<template>
  <bearbeiten
  :open="Tbearbeiten"
    @zeilenEinfügen="zeilenEinfügen"
    @zeilenTauschen="zeilenTauschen"
    @spaltenEinfügen="spaltenEinfügen"
    @spaltenTauschen="spaltenTauschen"
    @closeTabelBearbeiten="Tbearbeiten = false"
    :TabellenGröße="TabelenGröße" />
  <newTabel
    :open="newTabelopen"
    @close="newTabelopen = false"
    @NewTabel="insertTabel" />

  <header>
    <input
      class="file-input"
      type="file"
      @change="getFile"
      accept=".csv" />
    <select
      class="auswahl-container"
      @change="getSelectTabel">
      <option
        v-for="(tabel, i) in currentTabelle"
        :key="i"
        :value="i">
        {{ tabel.tname }}
      </option>
    </select>
    <button class="btn-download" @click="Tbearbeiten = true">Tabelle Bearbeiten</button>
    <button
      class="btn-download"
      @click="newTabelopen = true">
      Neue Tabelle erstellen
    </button>

    <a
      class="btn-download"
      @click="downlodFile"
      :href="href"
      :download="filename"
      >Download</a
    >
    <button
      class="btn-download"
      @click="DeletTabel">
      Tabelle Löschen
    </button>

    <label class="switch">
      <input
        type="checkbox"
        @click="darkMode" />
      <span class="slider round"></span>
    </label>
  </header>
  <div class="tabel-wraper">
    <div :class="noTabelhidde ? 'hidde' : 'noTabel'">
      <p class="noTabel-text">Hir Erscheinen ihre Tabelle</p>
    </div>
    <table :class="tabelhidde ? 'hidde' : ''">
      <div class="tabel-info">
        <input
          class="tabel-name"
          v-model="Tabelle.tname" />
        <input
          class="zellen-inhalt"
          type="text"
          @input="setZellenValue"
          v-model="Tabelle.currentZelle.zellenInhalt" />
      </div>

      <tbody>
        <div class="rapperTop-btnDelet">
          <div class="zelle-placeholder"></div>
          <div class="zelle-placeholder"></div>
          <btnDelet
            v-for="(item, i) in Tabelle.data[0]"
            @click="spalteLöschen(i)" />
        </div>
        <div class="rapperTop-btnDelet">
          <div class="zelle-placeholder"></div>
          <div class="zelle-placeholder"></div>
          <div
            class="zelle-nummer"
            v-for="(item, i) in Tabelle.data[0]">
            {{ i + 1 }}
          </div>
        </div>
        <tr>
          <td class="t-header">
            <btnDelet @click="zeileLöschen(0)" />
            <div class="zelle-nummer">1</div>
            <div class="t-header">
              <div
                v-for="(item, i) in Tabelle.data[0]"
                :class="item.activ ? 'zelle-activ' : 'zelle'"
                @click="getClickedItem(0, i, item.zellenInhalt)">
                {{ item.zellenInhalt }}
              </div>
            </div>
          </td>
        </tr>

        <tr class="t-ab-raper">
          <div>
            <div
              class="rapperSide-btnDelet"
              v-for="(item, i) in Tabelle.data">
              <btnDelet
                v-if="Tabelle.data[i] != Tabelle.data[0]"
                @click="zeileLöschen(i)" />
            </div>
          </div>
          <div>
            <div
              class="rapperSide-btnDelet"
              v-for="(item, i) in Tabelle.data">
              <div
                class="zelle-nummer"
                v-if="Tabelle.data[i] != Tabelle.data[0]">
                {{ i + 1 }}
              </div>
            </div>
          </div>
          <td class="t-aside">
            <div v-for="(item, i) in Tabelle.data">
              <div v-if="Tabelle.data[i] != Tabelle.data[0]">
                <div v-for="(el, elI) in item">
                  <div
                    :class="el.activ ? 'zelle-activ' : 'zelle'"
                    @click="getClickedItem(i, elI, el.zellenInhalt)"
                    v-if="elI < 1">
                    {{ el.zellenInhalt }}
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td class="t-body">
            <div v-for="(item, i) in Tabelle.data">
              <div
                class="zeile"
                v-if="Tabelle.data[i] != Tabelle.data[0]">
                <div v-for="(el, elI) in item">
                  <div
                    :class="el.activ ? 'zelle-activ' : 'zelle'"
                    @click="getClickedItem(i, elI, el.zellenInhalt)"
                    v-if="elI > 0">
                    {{ el.zellenInhalt }}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
header {
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid var(--black);
  padding: 2rem 4rem;
}
::-webkit-file-upload-button {
  padding: 0.5rem 1rem;
  border-radius: 11px;
  background-color: var(--white);
  font-size: 1.5rem;
}
.auswahl-container {
  background-color: var(--white);
  border: 2px solid;
  width: 20rem;
}
.add-tabellEL {
  height: 100%;
}
.btn-download {
  border: 2px solid var(--black);
  padding: 0.5rem 1rem;
  border-radius: 11px;
  background-color: var(--white);
  font-size: 1.5rem;
}
.btn-download:link {
  text-decoration: none;
  color: var(--black);
}
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #82c91e;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: var(--white);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider:before {
  -webkit-transform: translateX(2.6rem);
  -ms-transform: translateX(2.6rem);
  transform: translateX(2.6rem);
  background-color: var(--black);
}

/* Rounded sliders */
.slider.round {
  border-radius: 9px;
}

.slider.round:before {
  border-radius: 50%;
}
.tabel-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.tabel-name {
  padding: 0.5rem 0.5rem;
  background-color: var(--white);
  border: 1px solid var(--black);

  width: 10%;
}
.zellen-inhalt {
  padding: 0.5rem 0.5rem;

  width: 90%;
}
.tabel-wraper {
  display: flex;
  height: 100%;
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
.rapperTop-btnDelet {
  display: flex;
}
.rapperSide-btnDelet {
  display: flex;
  flex-direction: column;
}
table {
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-collapse: collapse;
  font-size: 10pt;
  padding: 0;
  margin: 0;
}
tbody {
  border: 2px solid var(--table-border-color);
}
.t-header {
  display: flex;
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
.zelle {
  overflow: hidden;
  text-align: center;
  border: 1px solid var(--table-border-color);

  height: 2.5rem;
  width: 7.9rem;
  transition: all 0.3ms;
}

.zelle:hover {
  border: 1px solid var(--black);
}
.zelle-activ {
  overflow: hidden;
  text-align: center;
  border: 2px solid var(--black);

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
</style>
