<script>
export default {
  name: "draggableContainer",

  props: { open: Boolean },
  data() {
    return {
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
                v-model="zellenTauschen.ersteZelle.zeile"
                type="number"
                placeholder="Zeile" />
              <input
                v-model="zellenTauschen.ersteZelle.spalte"
                type="number"
                placeholder="Spalte" />
            </div>
            <div class="container">
              <input
                v-model="zellenTauschen.zweiteZelle.zeile"
                type="number"
                placeholder="Zeile" />
              <input
                v-model="zellenTauschen.zweiteZelle.spalte"
                type="number"
                placeholder="Spalte" />
            </div>
            <button @click="zellenTauschen">Tauschen</button>
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
  border: 2px solid var(--black);
  background-color: var(--white);
  width: 25rem;
  height: 35rem;
}
.draggable-header {
  z-index: 99;
  width: 1rem;
  margin: 2px;
  background-color: var(--white);
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
  color: var(--black);
}
[name="close-outline"] {
  color: #c92a2a;
}
input {
  background-color: var(--white);
  border: 2px solid var(--black);
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
  background-color: var(--white);
  border: 2px solid;
  border-radius: 11px;
  font-size: 1.5rem;
  padding: 0.5rem 0.5rem;
}
button {
  border: 2px solid var(--black);
  padding: 0.5rem 0.5rem;
  border-radius: 11px;
  background-color: var(--white);
  font-size: 1.5rem;
}
.btnclose {
  border-radius: 9px;
}
</style>
