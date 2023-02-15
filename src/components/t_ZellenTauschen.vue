<script>
import { mapFields } from "vuex-map-fields"
export default {
  name: "draggableContainer",
  computed: {
    ...mapFields({
      ZellenTauschenErsteZeile: "zellenTauschen.ersteZelle.zeile",

      ZellenTauschenErsteSpalte: "zellenTauschen.ersteZelle.spalte",

      ZellenTauschenZweiteZeile: "zellenTauschen.zweiteZelle.zeile",

      ZellenTauschenZweiteSpalte: "zellenTauschen.zweiteZelle.spalte",
    }),
  },
  props: { open: Boolean },
  data() {
    return {
      check: {
        ersteZelle: {
          zeile: false,
          spalte: false,
        },
        zweiteZelle: {
          zeile: false,
          spalte: false,
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
    ZellenTauschen() {
      // Check Erste Zelle

      if (
        this.$store.getters.ZellenTauschenErsteZeile <= 0 ||
        this.$store.getters.ZellenTauschenErsteZeile >
          this.$store.getters.TabelenHöhe ||
        this.$store.getters.ZellenTauschenErsteZeile == undefined
      ) {
        this.check.ersteZelle.zeile = true
      } else {
        this.check.ersteZelle.zeile = false
      }

      if (
        this.$store.getters.ZellenTauschenErsteSpalte <= 0 ||
        this.$store.getters.ZellenTauschenErsteSpalte >
          this.$store.getters.TabelenBreite ||
        this.$store.getters.ZellenTauschenErsteSpalte == undefined
      ) {
        this.check.ersteZelle.spalte = true
      } else {
        this.check.ersteZelle.spalte = false
      }

      // Check Zweite Zelle

      if (
        this.$store.getters.ZellenTauschenZweiteZeile <= 0 ||
        this.$store.getters.ZellenTauschenZweiteZeile >
          this.$store.getters.TabelenHöhe ||
        this.$store.getters.ZellenTauschenZweiteZeile == undefined
      ) {
        this.check.zweiteZelle.zeile = true
      } else {
        this.check.zweiteZelle.zeile = false
      }

      if (
        this.$store.getters.ZellenTauschenZweiteSpalte <= 0 ||
        this.$store.getters.ZellenTauschenZweiteSpalte >
          this.$store.getters.TabelenBreite ||
        this.$store.getters.ZellenTauschenZweiteSpalte == undefined
      ) {
        this.check.zweiteZelle.spalte = true
      } else {
        this.check.zweiteZelle.spalte = false
      }

      // check All Validation

      if (
        this.check.ersteZelle.zeile == false &&
        this.check.ersteZelle.spalte == false &&
        this.check.zweiteZelle.zeile == false &&
        this.check.zweiteZelle.spalte == false
      ) {
        this.$store.commit("ZellenTauschen")
      }
    },
  },
}
</script>
<template>
  <Teleport to="#ZellenTauschen">
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
            <h2>Zellen Tauschen</h2>
            <div class="container">
              <input
                :class="check.ersteZelle.zeile ? 'invalid' : ''"
                v-model="ZellenTauschenErsteZeile"
                type="number"
                placeholder="Zeile" />
              <input
                :class="check.ersteZelle.spalte ? 'invalid' : ''"
                v-model="ZellenTauschenErsteSpalte"
                type="number"
                placeholder="Spalte" />
            </div>
            <div class="container">
              <input
                :class="check.zweiteZelle.zeile ? 'invalid' : ''"
                v-model="ZellenTauschenZweiteZeile"
                type="number"
                placeholder="Zeile" />
              <input
                :class="check.zweiteZelle.spalte ? 'invalid' : ''"
                v-model="ZellenTauschenZweiteSpalte"
                type="number"
                placeholder="Spalte" />
            </div>
            <button @click="ZellenTauschen">Tauschen</button>
          </div>
        </slot>
        <slot name="footer"
          ><button
            class="btnclose"
            @click="$emit('closeZellenTauschen')">
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
  width: 25rem;
  height: 35rem;
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
  align-items: center;
  height: 90%;
  gap: 4rem;
}
.container {
  display: flex;
  gap: 1rem;
  width: 100%;
  padding: 0 2rem;
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
  width: 100%;
  height: 100%;
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
  padding: 0.5rem 0.5rem;
  border-radius: 11px;
  background-color: var(--MainColor);
  font-size: 1.5rem;
}
.btnclose {
  border-radius: 9px;
}
</style>
