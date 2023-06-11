<template>
  <div>
    <template v-for="(r, i) in recipesStore.recipes" :key="i">
      <span>{{ recipeStr(r) }}</span
      >&nbsp;
      <button @click="deleteRecipe(r)">Delete</button> <br>
    </template>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useRecipesStore } from '../stores/recipes'
export default {
  data: () => ({
    recipePlaceholder: `ladder, 3

stick, 7`,
    recipeText: ''
  }),
  computed: {
    ...mapStores(useRecipesStore)
  },
  methods: {
    recipeStr(r) {
      return (
        r.output.map((o) => this.itemQuantityStr(o)).join(', ') +
        ' <- ' +
        r.input.map((i) => this.itemQuantityStr(i)).join(', ')
      )
    },
    itemQuantityStr(i) {
      return `${i.name}(${i.quantity})`
    },
    deleteRecipe(r) {
      this.recipesStore.deleteRecipe(r)
    }
  }
}
</script>
