<script>
import { mapFields } from "vuex-map-fields"

export default {
  props: {},
  computed: {
    ...mapFields({
      AnmeldenUsername: "Anmelden.Username",

      AnmeldenPassword: "Anmelden.Password",
    }),
  },
  data() {
    return {}
  },
  methods: {},
}
</script>
<template>
  <Teleport to="#Login">
    <Transition>
      <div
        class="new-Tabel-bg"
        v-if="$store.getters.LoginGet">
        <div class="new-Tabel">
          <div class="new-Tabel-Input-rapper">
            <input
              :class="
                $store.getters.AnmeldenCheckUsername
                  ? 'new-Tabel-input-invalid'
                  : 'new-Tabel-input'
              "
              v-model="AnmeldenUsername"
              placeholder="Username" />
            <input
              :class="
                $store.getters.AnmeldenCheckPassword
                  ? 'new-Tabel-input-invalid'
                  : 'new-Tabel-input'
              "
              v-model="AnmeldenPassword"
              placeholder="Passwort" />
          </div>
          <div class="new-Tabel-btnRapper">
            <button
              @click="$store.dispatch('Anmelden')"
              class="btn font">
              Anmelden
            </button>
            <button
              @click="this.$store.commit('LoginClose')"
              class="btn font">
              Abrechen
            </button>
          </div>
        </div>
      </div>
    </Transition>
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
  background-color: var(--MainColor);
  border: 2px solid var(--SecondaryColor);
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
  background-color: var(--MainColor);
  border: 2px solid var(--SecondaryColor);
  font-size: 1.8rem;
  padding: 0.5rem 0.5rem;
}
.new-Tabel-input-invalid {
  background-color: var(--MainColor);
  border: 2px solid var(--Invalide-CloseColor);
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
