<script>
import { mapFields } from "vuex-map-fields"
export default {
  name: "draggableContainer",
  computed: {
    ...mapFields({
      ZeileEinfügenZeile: "bearbeiten.zeilen.zeilen",

      ZeileEinfügenAnzahl: "bearbeiten.zeilen.anzahl",

      ZeileTauschenErste: "bearbeiten.tauschen.zeilen.erste",

      ZeileTauschenZweite: "bearbeiten.tauschen.zeilen.zweite",

      SpalteEinfügeSpalte: "bearbeiten.spalten.spalten",

      SpalteEinfügenAnzahl: "bearbeiten.spalten.anzahl",

      SpalteTauschenErste: "bearbeiten.tauschen.spalten.erste",

      SpalteTauschenZweite: "bearbeiten.tauschen.spalten.zweite",
    }),
  },
  props: {
    open: Boolean,
  },
  data() {
    return {
      check: {
        zeile: {
          einfügen: {
            inputZeile: false,
            anzahl: false,
          },
          tauschen: {
            inputOben: false,
            inputUnten: false,
          },
        },
        spalten: {
          einfügen: {
            inputZeile: false,
            anzahl: false,
          },
          tauschen: {
            inputOben: false,
            inputUnten: false,
          },
        },
      },

      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0,
      },
    }
  },

  methods: {
    dragMouseDown(event) {
      event.preventDefault()
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      document.onmousemove = this.elementDrag
      document.onmouseup = this.closeDragElement
    },
    elementDrag(event) {
      event.preventDefault()
      this.positions.movementX = this.positions.clientX - event.clientX
      this.positions.movementY = this.positions.clientY - event.clientY
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      // set the element's new position:
      this.$refs.draggableContainer.style.top =
        this.$refs.draggableContainer.offsetTop -
        this.positions.movementY +
        "px"
      this.$refs.draggableContainer.style.left =
        this.$refs.draggableContainer.offsetLeft -
        this.positions.movementX +
        "px"
    },
    closeDragElement() {
      document.onmouseup = null
      document.onmousemove = null
    },

    getOptionZeile(e) {
      this.$store.commit("GetOptionZeile", e.target.value)
    },

    zeilenEinfügen() {
      if (
        this.$store.getters.ZeileEinfügenZeile <= 0 ||
        this.$store.getters.ZeileEinfügenZeile >
          this.$store.getters.TabelenHöhe ||
        this.$store.getters.ZeileEinfügenZeile == undefined
      ) {
        this.check.zeile.einfügen.inputZeile = true
      } else {
        this.check.zeile.einfügen.inputZeile = false
      }

      if (
        this.$store.getters.ZeileEinfügenAnzahl <= 0 ||
        this.$store.getters.ZeileEinfügenAnzahl == undefined
      ) {
        this.check.zeile.einfügen.anzahl = true
      } else {
        this.check.zeile.einfügen.anzahl = false
      }

      if (
        this.check.zeile.einfügen.inputZeile == false &&
        this.check.zeile.einfügen.anzahl == false
      ) {
        this.$store.commit("ZeilenEinfügen")
      }
    },

    zeilenTauschen() {
      if (
        this.$store.getters.ZeileTauschenErste <= 0 ||
        this.$store.getters.ZeileTauschenErste >
          this.$store.getters.TabelenHöhe ||
        this.$store.getters.ZeileTauschenErste == undefined
      ) {
        this.check.zeile.tauschen.inputOben = true
      } else {
        this.check.zeile.tauschen.inputOben = false
      }
      if (
        this.$store.getters.ZeileTauschenZweite <= 0 ||
        this.$store.getters.ZeileTauschenZweite >
          this.$store.getters.TabelenHöhe ||
        this.$store.getters.ZeileTauschenZweite == undefined
      ) {
        this.check.zeile.tauschen.inputUnten = true
      } else {
        this.check.zeile.tauschen.inputUnten = false
      }
      if (
        this.check.zeile.tauschen.inputOben == false &&
        this.check.zeile.tauschen.inputUnten == false
      ) {
        this.$store.commit("ZeilenTauschen")
      }
    },
    getOptionSpalte(e) {
      this.$store.commit("GetOptionSpalte", e.target.value)
    },
    spaltenEinfügen() {
      console.log("ok")
      if (
        this.$store.getters.SpalteEinfügeSpalte <= 0 ||
        this.$store.getters.SpalteEinfügeSpalte >
          this.$store.getters.TabelenBreite ||
        this.$store.getters.SpalteEinfügeSpalte == undefined
      ) {
        this.check.spalten.einfügen.inputZeile = true
      } else {
        this.check.spalten.einfügen.inputZeile = false
      }

      if (
        this.$store.getters.SpalteEinfügenAnzahl <= 0 ||
        this.$store.getters.SpalteEinfügenAnzahl == undefined
      ) {
        this.check.spalten.einfügen.anzahl = true
      } else {
        this.check.spalten.einfügen.anzahl = false
      }

      if (
        this.check.spalten.einfügen.inputZeile == false &&
        this.check.spalten.einfügen.anzahl == false
      ) {
        this.$store.commit("SpaltenEinfügen")
      }
    },
    spaltenTauschen() {
      if (
        this.$store.getters.SpalteTauschenErste <= 0 ||
        this.$store.getters.SpalteTauschenErste >
          this.$store.getters.TabelenHöhe
      ) {
        this.check.spalten.tauschen.inputOben = true
      } else {
        this.check.spalten.tauschen.inputOben = false
      }
      if (
        this.$store.getters.SpalteTauschenZweite <= 0 ||
        this.$store.getters.SpalteTauschenZweite >
          this.$store.getters.TabelenHöhe
      ) {
        this.check.spalten.tauschen.inputUnten = true
      } else {
        this.check.spalten.tauschen.inputUnten = false
      }
      if (
        this.check.spalten.tauschen.inputOben == false &&
        this.check.spalten.tauschen.inputUnten == false
      ) {
        this.$store.commit("SpaltenTauschen")
      }
    },
  },
}
</script>
<template>
  <Teleport to="#Tbearbeiten">
    <Transition>
      <div
        v-if="open"
        ref="draggableContainer"
        class="draggable-container">
        <div
          class="draggable-header"
          @mousedown="dragMouseDown">
          <slot name="header"><ion-icon name="keypad-outline"></ion-icon></slot>
        </div>
        <slot name="main">
          <div class="menü-rapper">
            <div class="section-rapper">
              <div class="b1 box">
                <h2>Zeilen Einfügen</h2>
                <input
                  :class="check.zeile.einfügen.inputZeile ? 'invalid' : ''"
                  v-model="ZeileEinfügenZeile"
                  placeholder="Welche zeile"
                  type="number" />
                <select @change="getOptionZeile">
                  <option value="Ü">Über</option>
                  <option value="U">Unter</option>
                </select>
                <input
                  :class="check.zeile.einfügen.anzahl ? 'invalid' : ''"
                  v-model="ZeileEinfügenAnzahl"
                  placeholder="Anzahl"
                  type="number" />
                <button @click="zeilenEinfügen()">Einfügen</button>
              </div>
              <div class="b2 box">
                <h2>Spalten Einfügen</h2>
                <input
                  :class="check.spalten.einfügen.inputZeile ? 'invalid' : ''"
                  v-model="SpalteEinfügeSpalte"
                  placeholder="Welche spalte"
                  type="number" />
                <select @change="getOptionSpalte">
                  <option value="L">Links</option>
                  <option value="R">Rechts</option>
                </select>
                <input
                  :class="check.spalten.einfügen.anzahl ? 'invalid' : ''"
                  v-model="SpalteEinfügenAnzahl"
                  placeholder="Anzahl"
                  type="number" />
                <button @click="spaltenEinfügen()">Einfügen</button>
              </div>
            </div>
            <div class="section-rapper se2">
              <div class="b3 box">
                <h2>Zeilen Tauschen</h2>
                <input
                  :class="check.zeile.tauschen.inputOben ? 'invalid' : ''"
                  v-model="ZeileTauschenErste"
                  placeholder="zeile eintragen"
                  type="number" />
                <input
                  :class="check.zeile.tauschen.inputUnten ? 'invalid' : ''"
                  v-model="ZeileTauschenZweite"
                  placeholder="zeile eintragen"
                  type="number" />
                <button @click="zeilenTauschen">Tauschen</button>
              </div>
              <div class="b4 box">
                <h2>Spalte Tauschen</h2>
                <input
                  :class="check.spalten.tauschen.inputOben ? 'invalid' : ''"
                  v-model="SpalteTauschenErste"
                  placeholder="spalte eintragen"
                  type="number" />
                <input
                  :class="check.spalten.tauschen.inputUnten ? 'invalid' : ''"
                  v-model="SpalteTauschenZweite"
                  placeholder="spalte eintragen"
                  type="number" />
                <button @click="spaltenTauschen">Tauschen</button>
              </div>
            </div>
          </div>
        </slot>
        <slot name="footer"
          ><button
            class="btnclose"
            @click="$emit('closeTabelBearbeiten')">
            <ion-icon name="close-outline"></ion-icon></button
        ></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
.hidde {
  display: none;
}
.draggable-container {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  border-radius: 11px;
  position: absolute;
  z-index: 99;
  border: 2px solid var(--SecondaryColor);
  background-color: var(--MainColor);
  width: 50rem;
  height: 70rem;
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
.section-rapper {
  display: flex;
  height: 50%;
}
.se2 {
  border-top: 2px solid var(--SecondaryColor);
}

.b1,
.b3 {
  border-right: 1px solid var(--SecondaryColor);
}
.b2,
.b4 {
  border-left: 1px solid var(--SecondaryColor);
}

.box {
  background-color: var(--MainColor);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: 50%;
  padding: 3rem 1.5rem;
}

ion-icon {
  padding: 2px;
  font-size: 25px;
  color: var(--SecondaryColor);
}
[name="close-outline"] {
  color: #c92a2a;
}
input {
  background-color: var(--MainColor);
  border: 2px solid var(--SecondaryColor);
  border-radius: 11px;
  font-size: 1.5rem;
  padding: 0.5rem 0.5rem;
}
.invalid {
  border: 2px solid #c92a2a;
}
select {
  background-color: var(--MainColor);
  border: 2px solid;
  border-radius: 11px;
  font-size: 1.5rem;
  padding: 0.5rem 0.5rem;
}
button {
  border: 2px solid var(--SecondaryColor);
  padding: 0.2rem 0.2rem;
  border-radius: 11px;
  background-color: var(--MainColor);
  font-size: 1.5rem;
}
.btnclose {
  border-radius: 9px;
}
</style>
