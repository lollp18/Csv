<script>
import "./assets/main.css"
import papa from "papaparse"
import btnDelet from "./components/t_btnDelet.vue"
import newTabel from "./components/t_newTabel.vue"
import bearbeiten from "./components/t_Bearbeiten.vue"
import ZellenTauschen from "./components/t_ZellenTauschen.vue"
import { extend, isArray } from "@vue/shared"
import { ref } from "vue"

export default {
  async created() {
    await this.getTabels()
    this.HasTabels()
    this.setTabelSize()
    this.seitenBerechnen()
    this.seite.ende = this.Max
    console.log(this.seite)
  },
  async updated() {
    await this.saveTabels()
    this.HasTabels()
    this.setTabelSize()
    this.seitenBerechnen()
    console.log(this.seite)
  },
  components: {
    btnDelet,
    newTabel,
    bearbeiten,
    ZellenTauschen,
  },
  data() {
    return {
      Zelle: class {
        activ
        constructor(zellenInhalt = "") {
          this.zellenInhalt = zellenInhalt

          this.activ = false
        }
      },
      Tabel: class {
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
      },

      Tabelle: {
        tname: "No Tabel",
        data: [
          [
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
          ],
          [
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
          ],

          [
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
            { activ: false, zellenInhalt: "" },
          ],
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

      seiten: [],
      Max: 21,
      min: 0,
      seite: {
        Zahl: 1,
        start: 0,
        ende: undefined,
      },
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
      Tbearbeiten: ref(false),
      ZellenTauschen: ref(false),
      btnSeitenLinks: false,
      btnseitenRechts: true,
    }
  },
  methods: {
    // requests

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

    // Uploade File

    async getFile(e) {
      const data = await this.getData(e)

      const tabelle = this.createTabel(data)

      this.currentTabelle.push(tabelle)

      this.Tabelle = tabelle

      console.log(this.currentTabelle)
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
    FormatFilename(fileName) {
      const newFilename = fileName.slice(0, -4)
      return newFilename
    },
    createTabel(data) {
      const Tdata = this.cerateTabelldata(data.data)
      const Tabell = new this.Tabel(data.fileName, Tdata)
      return Tabell
    },
    cerateTabelldata(data) {
      const Tdata = []
      data.forEach((zeile) => {
        const Tzeile = []
        Tdata.push(Tzeile)
        zeile.forEach((item) => {
          const zelle = new this.Zelle(item)
          Tzeile.push(zelle)
        })
      })
      return Tdata
    },
    // Tabel Select

    getSelectTabel(e) {
      this.selectTabelId = e.target.value
      console.log(this.selectTabelId)
      this.Tabelle = this.currentTabelle[this.selectTabelId]
      console.log(this.Tabelle)
    },

    //Tabelle bearbeiten

    //Zeilen bearbeiten

    zeilenEinfügen(zeile) {
      this.zeile = zeile
      console.log(this.zeile)

      const zeilen = this.GeneratZeile()

      const zeilePos = this.zeile.zeilen - 1
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

    createZeile() {
      this.setTabelSize()

      const zeile = []

      for (let i = 0; i < this.TabelenGröße.breite; i++) {
        const zelle = new this.Zelle("")
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

    //Spalten bearbeiten

    spaltenEinfügen(spalte) {
      console.log(spalte)
      const zeilePos = spalte.spalten - 1
      if (zeilePos == 0 && spalte.position == "L") {
        for (let i = 0; i < spalte.anzahl; i++) {
          this.Tabelle.data.forEach((zeilen, i) => {
            const zelle = new this.Zelle("")
            zeilen.unshift(zelle)
          })
        }
      } else if (
        zeilePos == this.TabelenGröße.breite - 1 &&
        spalte.position == "R"
      ) {
        for (let i = 0; i < spalte.anzahl; i++) {
          this.Tabelle.data.forEach((zeilen, i) => {
            const zelle = new this.Zelle("")
            zeilen.push(zelle)
          })
        }
      } else {
        const pos = this.getIsertIndexSpalte(zeilePos)
        for (let i = 0; i < spalte.anzahl; i++) {
          this.Tabelle.data.forEach((zeilen, i) => {
            const zelle = new this.Zelle("")
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

    // Neue Tabelle erstellen

    insertTabel(tabelle) {
      this.newTabelopen = false
      this.currentTabelle.unshift(tabelle)
      this.Tabelle = tabelle
    },

    // Download File

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
          const Zellen = Object.entries(item).flat()
          const zellenInhalt = Zellen[3]
          zeilen.push(zellenInhalt)
        })
      })
      return Tdata
    },

    // Tabelle löschen

    async DeletTabel() {
      await this.Delettabel()

      await this.getTabels()
      this.HasTabels()
      console.log(this.currentTabelle)
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

    // Zellen bearbeiten

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

    // Seiten erstellen

    seitenBerechnen() {
      this.seiten = []
      const seiteErste = {
        Zahl: 1,
        start: 0,
        ende: this.Max,
      }
      this.seiten.push(seiteErste)
      const seitenAnzahl = this.seitenAnzahl()

      for (let i = 0; i < seitenAnzahl; i++) {
        const seite = {
          Zahl: this.seiten[i].Zahl + 1,
          start: this.seiten[i].ende,
          ende: this.seiten[i].ende + this.Max,
        }
        this.seiten.push(seite)
      }
      console.log(this.seiten)
    },
    seitenAnzahl() {
      let TabellenGröße = this.TabelenGröße.breite,
        seitenAnzahl = 1
      while (TabellenGröße >= this.Max) {
        seitenAnzahl++
        let seiten = TabellenGröße - this.Max

        TabellenGröße = seiten
      }
      return seitenAnzahl - 1
    },

    //Seiten wechseln

    controlBtnSeiten() {
      if (this.seite.Zahl == 1) {
        this.btnSeitenLinks = false
        this.btnseitenRechts = true
      } else if (this.seite.Zahl == this.seiten.length) {
        this.btnSeitenLinks = true
        this.btnseitenRechts = false
      } else {
        this.btnSeitenLinks = true
        this.btnseitenRechts = true
      }
    },
    seiteZurück() {
      this.seite = this.seiten[this.seite.Zahl - 2]
      this.controlBtnSeiten()
    },
    seiteVor() {
      this.seite = this.seiten[this.seite.Zahl]
      this.controlBtnSeiten()
    },

    // check and set

    HasTabels() {
      if (this.currentTabelle.length == 0) {
        this.tabelhidde = true
        this.noTabelhidde = false
      } else {
        this.tabelhidde = false
        this.noTabelhidde = true
      }
    },

    setTabelSize() {
      this.TabelenGröße.hohe = this.Tabelle.data.length
      this.TabelenGröße.breite = this.Tabelle.data[0].length
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
    @zeilenEinfügen="zeilenEinfügen($event)"
    @zeilenTauschen="zeilenTauschen"
    @spaltenEinfügen="spaltenEinfügen($event)"
    @spaltenTauschen="spaltenTauschen"
    @closeTabelBearbeiten="Tbearbeiten = false"
    :TabellenGröße="TabelenGröße" />
  <newTabel
    :open="newTabelopen"
    :classen="{ Tabel, Zelle }"
    @close="newTabelopen = false"
    @NewTabel="insertTabel" />
  <ZellenTauschen
    :open="ZellenTauschen"
    @closeZellenTauschen="ZellenTauschen = false" />
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
    <button
      class="btn-download"
      @click="Tbearbeiten = true">
      Tabelle Bearbeiten
    </button>
    <button
      class="btn-download"
      @click="ZellenTauschen = true">
      Zellen Tauschen
    </button>
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
      <tr>
        <div class="rapperTop-btnDelet">
          <div class="zelle-placeholder"></div>
          <div class="zelle-placeholder"></div>
          <btnDelet @click="spalteLöschen(0)" />
          <div v-for="(item, i) in Tabelle.data[0]">
            <btnDelet
              @click="spalteLöschen(i)"
              v-if="i > 0 && i >= seite.start && i < seite.ende" />
          </div>
        </div>
        <div class="rapperTop-btnDelet">
          <div class="zelle-placeholder"></div>
          <div class="zelle-placeholder"></div>
          <div class="zelle-nummer">1</div>
          <div v-for="(item, i) in Tabelle.data[0]">
            <div
              class="zelle-nummer"
              v-if="i > 0 && i >= seite.start && i < seite.ende">
              {{ i + 1 }}
            </div>
          </div>
        </div>
        <td class="t-header">
          <btnDelet @click="zeileLöschen(0)" />
          <div class="zelle-nummer">1</div>
          <div class="t-header">
            <div
              :class="Tabelle.data[0][0].activ ? 'zelle-activ' : 'zelle'"
              @click="getClickedItem(0, 0, Tabelle.data[0][0].zellenInhalt)">
              {{ Tabelle.data[0][0].zellenInhalt }}
            </div>
            <div v-for="(item, i) in Tabelle.data[0]">
              <div
                v-if="i > 0 && i >= seite.start && i < seite.ende"
                :class="item.activ ? 'zelle-activ' : 'zelle'"
                @click="getClickedItem(0, i, item.zellenInhalt)">
                {{ item.zellenInhalt }}
              </div>
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
                  v-if="elI > 0 && elI >= seite.start && elI < seite.ende">
                  {{ el.zellenInhalt }}
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
    <div class="seiten-rapper">
      <button
        :class="btnSeitenLinks ? 'btn-seiten' : 'hidde'"
        @click="seiteZurück()">
        <ion-icon name="chevron-back-outline"></ion-icon>
      </button>
      <div class="btn-seiten zahl">
        {{ seite.Zahl }}
      </div>
      <button
        :class="btnseitenRechts ? 'btn-seiten' : 'hidde'"
        @click="seiteVor()">
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </button>
    </div>
  </table>
</template>

<style>
.zahl {
  width: 2.5rem;
}
.seiten-rapper {
  padding: 1rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
ion-icon {
  padding: 2px;
  font-size: 20px;
  color: var(--black);
}
.btn-seiten {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--black);

  border-radius: 50%;
  background-color: var(--white);
  font-size: 1.5rem;
}
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
  height: 100%;
  width: 100vw;
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
