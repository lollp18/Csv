export const Tabel = class {
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
  constructor(TabelName, data) {
    this.TabelName = TabelName
    this.data = data
  }
}

export const Zelle = class {
  activ
  constructor(zellenInhalt = "") {
    this.zellenInhalt = zellenInhalt

    this.activ = false
  }
}
