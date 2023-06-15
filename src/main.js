// Librarys

import papa from "papaparse"
import { getField, updateField } from "vuex-map-fields"
import { createStore } from "vuex"

// Others

import { Zelle, Tabel } from "./components/Classes.js"
import { createApp } from "vue"
import App from "./App.vue"

const Store = createStore({
  state: {
    currentTabelle: {
      TabelName: "no Tabel",
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
    currentTabelles: [],
    currentTabelleID: undefined,

    TabelenGröße: {
      höhe: 0,
      breite: 0,
    },

    // Uploade Download CSV File

    UploadeFile: {
      fileName: "",
      data: [],
    },
    DownloadFile: {
      href: "",
      data: undefined,
    },

    //Tabelle bearbeiten

    bearbeiten: {
      zeilen: {
        zeilen: undefined,
        position: "Ü",
        anzahl: undefined,
      },
      spalten: { spalten: undefined, position: "L", anzahl: undefined },
      tauschen: {
        zeilen: {
          erste: undefined,
          zweite: undefined,
        },
        spalten: {
          erste: undefined,
          zweite: undefined,
        },
      },
      ZeileTemp: {
        zeilen: [],
        InsertPositon: undefined,
      },
      SpalteTemp: {
        spalten: [],
        InsertPositon: undefined,
      },
    },
    zellenTauschen: {
      ersteZelle: {
        zeile: undefined,
        spalte: undefined,
      },
      zweiteZelle: {
        zeile: undefined,
        spalte: undefined,
      },
    },

    // Neue Tabelle erstellen

    newTabell: {
      name: "",
      zeilen: undefined,
      spalten: undefined,
      data: [],
      checkTabellName: false,
    },

    // Registrieren
    Registrieren: {
      Username: undefined,
      Email: undefined,
      Password: undefined,
      PasswordWiederholen: undefined,
    },
    RegistrierenCheck: {
      Username: false,
      Email: false,
      Password: false,
      PasswordWiederholen: false,
    },
    // Login

    Anmelden: {
      Username: undefined,
      Password: undefined,
    },
    AnmeldenCheck: {
      Username: false,
      Password: false,
    },
    // Seiten

    SeitenVerwenden: {
      currentSeiten: [],
      seitenLängeMax: 0,
      seitenLängeMin: 0,
      zellenWidth: 77,
      seitenAnzahl: 0,
      windowHeight: document.documentElement.clientWidth,
      btnSeitenLinks: false,
      btnSeitenRechts: true,

      currentSeite: {
        Zahl: 1,
        start: 0,
        ende: undefined,
      },
    },

    ApiURLs: {
      ApiUrlUsersRegistrieren: "https://csvdb.onrender.com/users/Registrieren",
      ApiUrlUsersAnmelden: "https://csvdb.onrender.com/users/Anmelden",
      ApiUrlUserTabellen: undefined,
    },

    SingelUp: false,
    Login: false,
    SingelUpBTN: true,
    LoginBTN: true,
    LogoutBTN: false,
  },

  getters: {
    getField,

    LogoutBTN: (state) => state.LogoutBTN,

    //Login

    LoginBTN: (state) => state.LoginBTN,

    LoginGet: (state) => state.Login,

    AnmeldenCheckUsername: (state) => state.AnmeldenCheck.Username,

    AnmeldenCheckPassword: (state) => state.AnmeldenCheck.Password,

    AnmeldenUsername: (state) => state.Anmelden.Username,

    AnmeldenPassword: (state) => state.Anmelden.Password,

    // Registrieren

    SingelUpBTN: (state) => state.SingelUpBTN,

    SingelUpGet: (state) => state.SingelUp,

    RegistrierenCheckUsername: (state) => state.RegistrierenCheck.Username,

    RegistrierenCheckEmail: (state) => state.RegistrierenCheck.Email,

    RegistrierenCheckPassword: (state) => state.RegistrierenCheck.Password,

    RegistrierenCheckPasswordWiederholen: (state) =>
      state.RegistrierenCheck.PasswordWiederholen,

    RegistrierenUsername: (state) => state.Registrieren.Username,

    RegistrierenEmail: (state) => state.Registrieren.Email,

    RegistrierenPassword: (state) => state.Registrieren.Password,

    RegistrierenPasswordWiederholen: (state) =>
      state.Registrieren.PasswordWiederholen,

    // Seiten

    CurrentSeiteZahl: (state) => state.SeitenVerwenden.currentSeite.Zahl,

    CurrentSeiteStart: (state) => state.SeitenVerwenden.currentSeite.start,

    CurrentSeiteEnde: (state) => state.SeitenVerwenden.currentSeite.ende,

    BtnSeitenLinks: (state) => state.SeitenVerwenden.btnSeitenLinks,

    BtnSeitenRechts: (state) => state.SeitenVerwenden.btnSeitenRechts,

    // Tabellen Größe

    TabelenHöhe: (state) => state.TabelenGröße.höhe,

    TabelenBreite: (state) => state.TabelenGröße.breite,

    // Tabelle erstellen

    NewTabellName: (state) => state.newTabell.name,

    NewTabellZeile: (state) => state.newTabell.zeilen,

    NewTabellSpalte: (state) => state.newTabell.spalten,

    CheckTabellName: (state) => state.newTabell.checkTabellName,

    // Zellen Tauschen

    ZellenTauschenErsteZeile: (state) => state.zellenTauschen.ersteZelle.zeile,

    ZellenTauschenErsteSpalte: (state) =>
      state.zellenTauschen.ersteZelle.spalte,

    ZellenTauschenZweiteZeile: (state) =>
      state.zellenTauschen.zweiteZelle.zeile,

    ZellenTauschenZweiteSpalte: (state) =>
      state.zellenTauschen.zweiteZelle.spalte,

    // Tabelle bearbeiten

    ZeileEinfügenZeile: (state) => state.bearbeiten.zeilen.zeilen,

    ZeileEinfügenAnzahl: (state) => state.bearbeiten.zeilen.anzahl,

    ZeileTauschenErste: (state) => state.bearbeiten.tauschen.zeilen.erste,

    ZeileTauschenZweite: (state) => state.bearbeiten.tauschen.zeilen.zweite,

    SpalteEinfügeSpalte: (state) => state.bearbeiten.spalten.spalten,

    SpalteEinfügenAnzahl: (state) => state.bearbeiten.spalten.anzahl,

    SpalteTauschenErste: (state) => state.bearbeiten.tauschen.spalten.erste,

    SpalteTauschenZweite: (state) => state.bearbeiten.tauschen.spalten.zweite,

    // UploadFile

    UploadFilename: (state) => state.UploadeFile.fileName,

    // Download CSV

    href: (state) => state.DownloadFile.href,

    // Display Tabeldata

    currentTabellesLength: (state) => state.currentTabelles.length,

    CurrentTabelName: (state) => state.currentTabelle.TabelName,

    currentTabelleData: (state) => state.currentTabelle.data,

    currentTabelleFirstZeile: (state) => state.currentTabelle.data[0],

    currentTabelleFirstZelle: (state) => state.currentTabelle.data[0][0],

    currentZelleninhalt: (state) =>
      state.currentTabelle.currentZelle.zellenInhalt,

    currentTabelleTaside(state) {
      for (let i = 1; i < state.currentTabelle.data.length; i++) {
        return state.currentTabelle.data[i]
      }
    },

    currentTabelles: (state) => state.currentTabelles,
  },

  mutations: {
    updateField,

    //Anmelden

    LoginClose(state) {
      state.Login = false
    },

    LoginOpen(state) {
      state.Login = true
    },

    // Registrieren

    SingelUpclose(state) {
      state.SingelUp = false
    },
    SingelUpOpen(state) {
      state.SingelUp = true
    },

    // Seiten erstellen

    InitSeitenBerechnen() {
      Store.commit("SetTabelSize")
      Store.commit("BrechneMax")
      Store.commit("SeitenBerechnen")
    },

    SetCurrentSeiteFirst(state) {
      state.SeitenVerwenden.currentSeite =
        state.SeitenVerwenden.currentSeiten[0]
    },

    BrechneMax(state) {
      state.SeitenVerwenden.seitenLängeMax = Math.round(
        (state.SeitenVerwenden.windowHeight - 300) /
          state.SeitenVerwenden.zellenWidth
      )
    },
    ResizeWindow(state) {
      state.SeitenVerwenden.windowHeight = document.documentElement.clientWidth
      Store.commit("BrechneMax")
      Store.commit("SeitenBerechnen")

      state.SeitenVerwenden.currentSeite =
        state.SeitenVerwenden.currentSeiten[
          state.SeitenVerwenden.currentSeite.Zahl - 1
        ]
      Store.commit("ControlBtnSeiten")
    },
    SeitenBerechnen(state) {
      state.SeitenVerwenden.currentSeiten = []
      const seiteErste = {
        Zahl: 1,
        start: 0,
        ende: state.SeitenVerwenden.seitenLängeMax - 1,
      }
      state.SeitenVerwenden.currentSeiten.push(seiteErste)
      Store.commit("SeitenAnzahl")
      for (let i = 0; i < state.SeitenVerwenden.seitenAnzahl; i++) {
        const seite = {
          Zahl: state.SeitenVerwenden.currentSeiten[i].Zahl + 1,
          start: state.SeitenVerwenden.currentSeiten[i].ende + 1,
          ende:
            state.SeitenVerwenden.currentSeiten[i].ende +
            state.SeitenVerwenden.seitenLängeMax -
            1,
        }
        state.SeitenVerwenden.currentSeiten.push(seite)
      }
    },
    SeitenAnzahl(state) {
      let TabellenGröße = state.TabelenGröße.breite,
        seitenAnzahl = 1
      while (TabellenGröße >= state.SeitenVerwenden.seitenLängeMax) {
        seitenAnzahl++
        let seiten = TabellenGröße - state.SeitenVerwenden.seitenLängeMax

        TabellenGröße = seiten
      }
      state.SeitenVerwenden.seitenAnzahl = seitenAnzahl - 1
    },

    //Seiten wechseln

    ControlBtnSeiten(state) {
      if (state.SeitenVerwenden.currentSeite.Zahl == 1) {
        state.SeitenVerwenden.btnSeitenLinks = false
        state.SeitenVerwenden.btnSeitenRechts = true
      } else if (
        state.SeitenVerwenden.currentSeite.Zahl ==
        state.SeitenVerwenden.currentSeiten.length
      ) {
        state.SeitenVerwenden.btnSeitenLinks = true
        state.SeitenVerwenden.btnSeitenRechts = false
      } else {
        state.SeitenVerwenden.btnSeitenLinks = true
        state.SeitenVerwenden.btnSeitenRechts = true
      }
    },
    SeiteZurück(state) {
      state.SeitenVerwenden.currentSeite =
        state.SeitenVerwenden.currentSeiten[
          state.SeitenVerwenden.currentSeite.Zahl - 2
        ]
      Store.commit("ControlBtnSeiten")
    },
    SeiteVor(state) {
      state.SeitenVerwenden.currentSeite =
        state.SeitenVerwenden.currentSeiten[
          state.SeitenVerwenden.currentSeite.Zahl
        ]
      Store.commit("ControlBtnSeiten")
    },
    SeiteFirst(state) {
      state.SeitenVerwenden.currentSeite =
        state.SeitenVerwenden.currentSeiten[0]
      Store.commit("ControlBtnSeiten")
    },
    SeiteLast(state) {
      state.SeitenVerwenden.currentSeite =
        state.SeitenVerwenden.currentSeiten[
          state.SeitenVerwenden.currentSeiten.length - 1
        ]
      Store.commit("ControlBtnSeiten")
    },

    // Tabelle erstellen

    InserteNewTabellTabel(state) {
      const Tabell = new Tabel(state.newTabell.name, state.newTabell.data)

      state.currentTabelles.unshift(Tabell)

      state.currentTabelle.TabelName = Tabell.TabelName

      state.currentTabelle.data = Tabell.data
    },
    CreateNewTabellData(state) {
      state.newTabell.data = []
      for (let i = 1; i <= state.newTabell.zeilen; i++) {
        const zeile = []
        state.newTabell.data.push(zeile)
        for (let I = 1; I <= state.newTabell.spalten; I++) {
          zeile.push(new Zelle(""))
        }
      }
    },
    ChecknewTabellName(state) {
      state.currentTabelles.forEach((tabell) => {
        if (tabell.TabelName === state.newTabell.name) {
          state.newTabell.checkTabellName = true
        } else {
          state.newTabell.checkTabellName = false
        }
      })
    },
    // Zellen tauschen

    ZellenTauschen(state) {
      let temp = ""

      // save erste zelle temp
      temp =
        state.currentTabelle.data[state.zellenTauschen.ersteZelle.zeile - 1][
          state.zellenTauschen.ersteZelle.spalte - 1
        ].zellenInhalt

      // erste zelle mit zweiter zelle ersetzen
      state.currentTabelle.data[state.zellenTauschen.ersteZelle.zeile - 1][
        state.zellenTauschen.ersteZelle.spalte - 1
      ].zellenInhalt =
        state.currentTabelle.data[state.zellenTauschen.zweiteZelle.zeile - 1][
          state.zellenTauschen.zweiteZelle.spalte - 1
        ].zellenInhalt

      // zweite zelle mit temp ersetzen
      state.currentTabelle.data[state.zellenTauschen.zweiteZelle.zeile - 1][
        state.zellenTauschen.zweiteZelle.spalte - 1
      ].zellenInhalt = temp
    },

    // Tabelle bearbeiten

    //Zeilen bearbeiten

    ZeilenEinfügen(state) {
      Store.commit("CreateZeile")

      const zeilePos = state.bearbeiten.zeilen.zeilen - 1
      if (zeilePos == 0 && state.bearbeiten.zeilen.position == "Ü") {
        state.bearbeiten.ZeileTemp.zeilen.forEach((zeile) => {
          state.currentTabelle.data.unshift(zeile)
        })
      } else if (
        zeilePos == state.TabelenGröße.höhe - 1 &&
        state.bearbeiten.zeilen.position == "U"
      ) {
        state.bearbeiten.ZeileTemp.zeilen.forEach((zeile) => {
          state.currentTabelle.data.push(zeile)
        })
      } else {
        Store.commit("GetIsertIndexZeile", zeilePos)
        state.bearbeiten.ZeileTemp.zeilen.forEach((zeile) => {
          state.currentTabelle.data.splice(
            state.bearbeiten.ZeileTemp.InsertPositon,
            0,
            zeile
          )
        })
      }
    },

    CreateZeile(state) {
      for (let i = 0; i < state.bearbeiten.zeilen.anzahl; i++) {
        const zeile = []

        state.bearbeiten.ZeileTemp.zeilen.push(zeile)

        for (let i = 0; i < state.TabelenGröße.breite; i++) {
          zeile.push(new Zelle(""))
        }
      }
    },

    GetIsertIndexZeile(state, pos) {
      if (state.bearbeiten.zeilen.position == "Ü") {
        state.bearbeiten.ZeileTemp.InsertPositon = pos
      } else {
        state.bearbeiten.ZeileTemp.InsertPositon = pos + 1
      }
    },
    GetOptionZeile: (state, NewPosition) => {
      state.bearbeiten.zeilen.position = NewPosition
    },

    ZeilenTauschen(state) {
      let temp = []

      state.currentTabelle.data[
        state.bearbeiten.tauschen.zeilen.erste - 1
      ].forEach((item, i) => {
        temp.push(item.zellenInhalt)

        item.zellenInhalt =
          state.currentTabelle.data[
            state.bearbeiten.tauschen.zeilen.zweite - 1
          ][i].zellenInhalt

        state.currentTabelle.data[state.bearbeiten.tauschen.zeilen.zweite - 1][
          i
        ].zellenInhalt = temp[i]
      })
    },

    // Spalten bearbeiten

    GetOptionSpalte: (state, NewPosition) => {
      state.bearbeiten.spalten.position = NewPosition
    },
    SpaltenEinfügen(state) {
      console.log(state.bearbeiten.spalten)
      const spaltenPos = state.bearbeiten.spalten.spalten - 1
      if (spaltenPos == 0 && state.bearbeiten.spalten.position == "L") {
        for (let i = 0; i < state.bearbeiten.spalten.anzahl; i++) {
          state.currentTabelle.data.forEach((zeilen, i) => {
            zeilen.unshift(new Zelle(""))
          })
        }
      } else if (
        spaltenPos == state.TabelenGröße.breite - 1 &&
        state.bearbeiten.spalten.position == "R"
      ) {
        for (let i = 0; i < state.bearbeiten.spalten.anzahl; i++) {
          state.currentTabelle.data.forEach((zeilen, i) => {
            zeilen.push(new Zelle(""))
          })
        }
      } else {
        Store.commit("GetIsertIndexSpalte", spaltenPos)
        for (let i = 0; i < state.bearbeiten.spalten.anzahl; i++) {
          state.currentTabelle.data.forEach((zeilen, i) => {
            zeilen.splice(
              state.bearbeiten.SpalteTemp.InsertPositon,
              0,
              new Zelle("")
            )
          })
        }
      }
    },
    GetIsertIndexSpalte(state, pos) {
      if (state.bearbeiten.spalten.position == "L") {
        state.bearbeiten.SpalteTemp.InsertPositon = pos
      } else {
        state.bearbeiten.SpalteTemp.InsertPositon = pos + 1
      }
    },
    SpaltenTauschen(state) {
      let temp = []
      state.currentTabelle.data.forEach((zeile, i) => {
        temp.push(
          zeile[state.bearbeiten.tauschen.spalten.erste - 1].zellenInhalt
        )
        zeile[state.bearbeiten.tauschen.spalten.erste - 1].zellenInhalt =
          zeile[state.bearbeiten.tauschen.spalten.zweite - 1].zellenInhalt
        zeile[state.bearbeiten.tauschen.spalten.zweite - 1].zellenInhalt =
          temp[i]
      })
    },

    // Download File

    downlodFile(state) {
      state.DownloadFile.data = state.currentTabelle.data

      Store.commit("FormatData", state.DownloadFile.data)

      papa.unparse(state.DownloadFile.data)

      state.DownloadFile.href = `data:text/csv;charset=utf-8,${state.DownloadFile.data}`
    },
    FormatData(state, data) {
      const Formatdata = []

      data.forEach((Zeile) => {
        const zeilen = []

        Formatdata.push(zeilen)

        Zeile.forEach((Zelle) => {
          zeilen.push(Zelle.zellenInhalt)
        })
      })
      state.DownloadFile.data = Formatdata
    },
    //Tabelle Löschen

    spalteLöschen(state, i) {
      state.currentTabelle.data.forEach((zeile) => {
        zeile.splice(i, 1)
      })
    },
    zeileLöschen(state, i) {
      state.currentTabelle.data.splice(i, 1)
    },

    // Uploade File

    CreateTabel(state) {
      const data = []
      state.UploadeFile.data.forEach((zeile) => {
        const Tzeile = []
        data.push(Tzeile)
        zeile.forEach((item) => {
          Tzeile.push(new Zelle(item))
        })
      })

      const Tabell = new Tabel(state.UploadeFile.fileName, data)
      state.currentTabelles.unshift(Tabell)

      state.currentTabelleID = 0
      state.currentTabelle.TabelName = Tabell.TabelName
      state.currentTabelle.data = Tabell.data
    },

    // Zellen bearbeiten

    InitZelleBerarbeiten(state, SelectetZelle) {
      Store.commit("SaveLastZelle")

      Store.commit("SetCurrentZelle", SelectetZelle)

      Store.commit("SetFocusedZelle")
    },

    SaveLastZelle(state) {
      // Übergebe werte an Last Zeile

      state.currentTabelle.lastZelle.zeile =
        state.currentTabelle.currentZelle.zeile

      state.currentTabelle.lastZelle.spalten =
        state.currentTabelle.currentZelle.spalten

      state.currentTabelle.lastZelle.zellenInhalt =
        state.currentTabelle.currentZelle.zellenInhalt

      state.currentTabelle.lastZelle.activ =
        state.currentTabelle.currentZelle.activ
    },
    SetCurrentZelle(state, SelectetZelle) {
      state.currentTabelle.currentZelle.zeile = SelectetZelle.zeile

      state.currentTabelle.currentZelle.spalten = SelectetZelle.spalte

      state.currentTabelle.currentZelle.zellenInhalt =
        SelectetZelle.zelleninhalt
    },
    SetFocusedZelle(state) {
      state.currentTabelle.data[state.currentTabelle.currentZelle.zeile][
        state.currentTabelle.currentZelle.spalten
      ].activ = true

      state.currentTabelle.data[state.currentTabelle.lastZelle.zeile][
        state.currentTabelle.lastZelle.spalten
      ].activ = false
    },
    SetZellenValue(state) {
      state.currentTabelle.data[state.currentTabelle.currentZelle.zeile][
        state.currentTabelle.currentZelle.spalten
      ].zellenInhalt = state.currentTabelle.currentZelle.zellenInhalt
    },

    // selcet get set values

    SetCurrentTabelName(state) {
      console.log(state.currentTabelleID)
      state.currentTabelles[state.currentTabelleID].TabelName =
        state.currentTabelle.TabelName
    },

    SetTabelSize(state) {
      state.TabelenGröße.höhe = state.currentTabelle.data.length
      state.TabelenGröße.breite = state.currentTabelle.data[0].length
    },
    getSelectTabel(state, e) {
      state.currentTabelleID = e.target.value

      state.currentTabelle = state.currentTabelles[state.currentTabelleID]
    },

    SetApiUrlUserTabellen(state) {
      if (localStorage.length > 0) {
        this.state.LoginBTN = false
        this.state.SingelUpBTN = false
        this.state.LogoutBTN = true
        const User = JSON.parse(localStorage.getItem("User"))

        state.ApiURLs.ApiUrlUserTabellen = `https://csvdb.onrender.com/users/${User.Username}/Tabellen`
      }
    },
  },
  actions: {
    // Abmelden

    async Abmelden() {
      localStorage.clear()

      this.state.SingelUpBTN = true
      this.state.LoginBTN = true
      this.state.LogoutBTN = false
    },

    //Anmelden
    async Anmelden() {
      try {
        if (
          this.state.Anmelden.Username == "" ||
          this.state.Anmelden.Username == undefined
        ) {
          this.state.AnmeldenCheck.Username = true

          this.state.Anmelden.Password = undefined
        } else {
          this.state.AnmeldenCheck.Username = false
        }

        if (
          this.state.Anmelden.Password == "" ||
          this.state.Anmelden.Password == undefined
        ) {
          this.state.AnmeldenCheck.Password = true
        } else {
          this.state.AnmeldenCheck.Password = false
        }

        if (
          this.state.AnmeldenCheck.Username == false &&
          this.state.AnmeldenCheck.Password == false
        ) {
          const UserData = this.state.Anmelden
          const Json = JSON.stringify(UserData)

          const optons = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "no-cors",
            body: Json,
          }

          const res = await fetch(
            this.state.ApiURLs.ApiUrlUsersAnmelden,
            optons
          )
          const data = await res.json()

          if (data === "NoUser") {
            this.state.AnmeldenCheck.Username = false
            this.state.Anmelden.Password = undefined
          } else {
            this.state.AnmeldenCheck.Username = true
          }

          if (data === "Password") {
            this.state.AnmeldenCheck.Password = false
          } else {
            this.state.AnmeldenCheck.Username = true
          }
          if (data.Angemeldet === true) {
            localStorage.setItem("User", JSON.stringify(data))
            this.state.LoginBTN = false
            this.state.SingelUpBTN = false
            this.state.LogoutBTN = true
            Store.commit("LoginClose")
          }
        }
      } catch (e) {
        console.error(e.message)
      }
    },

    // Registrieren
    async Registrieren() {
      try {
        if (
          this.state.Registrieren.Username == "" ||
          this.state.Registrieren.Username == undefined
        ) {
          this.state.RegistrierenCheck.Username = true

          this.state.Registrieren.Password = undefined
          this.state.Registrieren.PasswordWiederholen = undefined
        } else {
          this.state.RegistrierenCheck.Username = false
        }

        if (
          this.state.Registrieren.Email == "" ||
          this.state.Registrieren.Email == undefined
        ) {
          this.state.RegistrierenCheck.Email = true

          this.state.Registrieren.Password = undefined
          this.state.Registrieren.PasswordWiederholen = undefined
        } else {
          this.state.RegistrierenCheck.Email = false
        }

        if (
          this.state.Registrieren.Password == "" ||
          this.state.Registrieren.Password == undefined
        ) {
          this.state.RegistrierenCheck.Password = true

          this.state.Registrieren.Password = undefined
          this.state.Registrieren.PasswordWiederholen = undefined
        } else {
          this.state.RegistrierenCheck.Password = false
        }

        if (
          this.state.Registrieren.PasswordWiederholen == "" ||
          this.state.Registrieren.PasswordWiederholen == undefined
        ) {
          this.state.RegistrierenCheck.PasswordWiederholen = true

          this.state.Registrieren.Password = undefined
          this.state.Registrieren.PasswordWiederholen = undefined
        } else {
          this.state.RegistrierenCheck.PasswordWiederholen = false
        }

        if (
          this.state.RegistrierenCheck.Username == false &&
          this.state.RegistrierenCheck.Email == false &&
          this.state.RegistrierenCheck.Password == false &&
          this.state.RegistrierenCheck.PasswordWiederholen == false
        ) {
          const UserData = this.state.Registrieren
          const Json = JSON.stringify(UserData)

          const optons = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: 'no-cors',
            body: Json,
          }

          const res = await fetch(
            this.state.ApiURLs.ApiUrlUsersRegistrieren,
            optons
          )
          const data = await res.json()

          if (data === "UserTaken") {
            this.state.RegistrierenCheck.Username = true
            this.state.Registrieren.Password = undefined
            this.state.Registrieren.PasswordWiederholen = undefined
          } else {
            this.state.RegistrierenCheck.Username = false
          }
          if (data === "EmailInvalid") {
            this.state.RegistrierenCheck.Email = true
            this.state.Registrieren.Password = undefined
            this.state.Registrieren.PasswordWiederholen = undefined
          } else {
            this.state.RegistrierenCheck.Email = false
          }
          if (data === "PasswordWiederholen") {
            this.state.RegistrierenCheck.Password = true
            this.state.RegistrierenCheck.PasswordWiederholen = true
            this.state.Registrieren.Password = undefined
            this.state.Registrieren.PasswordWiederholen = undefined
          } else {
            this.state.RegistrierenCheck.Password = false
            this.state.RegistrierenCheck.PasswordWiederholen = false
          }

          if (data === "UserErstelt") {
            Store.commit("SingelUpclose")

            Store.commit("LoginOpen")
          }
        }
      } catch (e) {
        console.error(e.message)
      }
    },

    // Uploade File

    async GetData(state, e) {
      const [file] = await e.target.files

      this.state.UploadeFile.fileName = await file.name.slice(0, -4)

      const content = await file.text()

      const datas = papa.parse(content)

      this.state.UploadeFile.data = datas.data
    },

    // Requests

    async GetTabels() {
      try {
        const res = await fetch(this.state.ApiURLs.ApiUrlUserTabellen,{mode: 'no-cors'})

        this.state.currentTabelles = await res.json()

        this.state.currentTabelle.TabelName =
          this.state.currentTabelles[0].TabelName

        this.state.currentTabelle.data = this.state.currentTabelles[0].data

        this.state.currentTabelle.currentZelle =
          this.state.currentTabelles[0].currentZelle

        this.state.currentTabelle.lastZelle =
          this.state.currentTabelles[0].lastZelle
      } catch (e) {
        console.error(e.message)
      }
    },

    async SaveTabels() {
      try {
        const tabels = this.state.currentTabelles
        const json = JSON.stringify(tabels)

        const optons = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          mode: 'no-cors',
          body: json,
        }

        const res = await fetch(this.state.ApiURLs.ApiUrlUserTabellen, optons)
        console.log(res)
      } catch (e) {
        console.error(e.message)
      }
    },

    async Delettabel() {
      try {
        const TabelleInfo = {
          id: this.state.currentTabelleID,
        }
        const json = JSON.stringify(TabelleInfo)

        const optons = {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          mode: 'no-cors',
          body: json,
        }

        const res = await fetch(this.state.ApiURLs.ApiUrlUserTabellen, optons)
      } catch (e) {
        console.log(e.message)
      }
    },

    async InitDelet() {
      await Store.dispatch("Delettabel")

      await Store.dispatch("GetTabels")
    },
  },
  modules: {},
})

const app = createApp(App)
app.use(Store)
app.mount("#app")
