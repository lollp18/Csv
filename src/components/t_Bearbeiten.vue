<script>
export default {
  name: "DraggableDiv",
  props: {
    TabellenGröße: Object,
  },
  data() {
    return {
      bearbeiten: {
        zeilen: {
          zeile: undefined,
          position: "Ü",
          anzahl: undefined,
        },
        spalten: {},
        tauschen: {
          zeilen: {
            erste: undefined,
            zweiete: undefined,
          },
          spalten: {
            erste: undefined,
            zweiete: undefined,
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
    getOption(e) {
      this.bearbeiten.zeilen.position = e.target.value
      console.log(this.bearbeiten.zeilen.position)
    },
    einfügen() {
      this.$emit("data", this.bearbeiten.zeilen)
    },
  },
}
</script>
<template>
  <div
    ref="draggableContainer"
    id="draggable-container">
    <div
      id="draggable-header"
      @mousedown="dragMouseDown">
      <slot name="header"><ion-icon name="keypad-outline"></ion-icon></slot>
    </div>
    <slot name="main">
      <div class="menü-rapper">
        <div class="section-rapper">
          <div class="b1 box">
            <h2>Zeilen Einfügen</h2>
            <input
              v-model="bearbeiten.zeilen.zeile"
              placeholder="Welche zeile"
              type="number" />
            <select @change="getOption">
              <option value="Ü">Über</option>
              <option value="U">Unter</option>
            </select>
            <input
              v-model="bearbeiten.zeilen.anzahl"
              placeholder="Anzahl"
              type="number" />
            <button @click="einfügen">Einfügen</button>
          </div>
          <div class="b2 box"></div>
        </div>
        <div class="section-rapper se2">
          <div class="b3 box">
            <h2>Zeilen Tauschen</h2>
            <input
              v-model="bearbeiten.tauschen.zeilen.erste"
              placeholder="zeile eintragen"
              type="number" />
            <input
              v-model="bearbeiten.tauschen.zeilen.zweiete"
              placeholder="zeile eintragen"
              type="number" />
            <button @click="zeilenTauschen">Tauschen</button>
          </div>
          <div class="b4 box"></div>
        </div>
      </div>
    </slot>
    <slot name="footer"></slot>
  </div>
</template>

<style scoped>
form {
  height: 100%;
}
#draggable-container {
  border-radius: 11px;
  position: absolute;
  z-index: 99;
  border: 2px solid var(--black);
  background-color: var(--white);
  width: 50rem;
  height: 70rem;
}
#draggable-header {
  z-index: 99;
  width: 1rem;
  margin: 2px;
  background-color: var(--white);
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
  border-top: 2px solid var(--black);
}
.b1,
.b3 {
  border-right: 1px solid var(--black);
}
.b2,
.b4 {
  border-left: 1px solid var(--black);
}

.box {
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: 50%;
  padding: 5rem 1.5rem;
}

ion-icon {
  padding: 2px;
  font-size: 25px;
  color: var(--black);
}
input {
  background-color: var(--white);
  border: 2px solid var(--black);
  border-radius: 11px;
  font-size: 1.5rem;
  padding: 0.5rem 0.5rem;
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
  padding: 0.2rem 0.2rem;
  border-radius: 11px;
  background-color: var(--white);
  font-size: 1.5rem;
}
</style>
