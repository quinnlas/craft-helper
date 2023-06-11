<template>
  <div>
    <textarea cols="30" rows="10" :placeholder="recipePlaceholder" v-model="recipeText"></textarea> <br>
    <button @click="onClick">Add</button>
    <!-- <h2>Outputs</h2>
      <ItemQuantity></ItemQuantity>
    <h2>Inputs</h2> -->
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useRecipesStore } from '../stores/recipes'
export default {
  data: () => ({
    recipePlaceholder: `plank,4

log`,
    recipeText: ''
  }),
  computed: {
    ...mapStores(useRecipesStore)
  },
  methods: {
    onClick() {
      const lines = this.recipeText.split('\n').map(l => l.trim())
      const divider = lines.indexOf('')
      const outputLines = lines.slice(0, divider)
      const inputLines = lines.slice(divider + 1)
      const output = outputLines.map(this.parseRecipeLine)
      const input = inputLines.map(this.parseRecipeLine)
      this.recipesStore.addRecipe({input, output})
      this.recipeText = ''
    },
    parseRecipeLine(line) {
      const parts = line.split(',').map(p => p.trim())
      return {
        name: parts[0],
        quantity: parseInt(parts[1] || '1') // default quantity is 1
      }
    }
  }
}
</script>