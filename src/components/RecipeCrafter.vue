<template>
  <div>
    <input type="text" v-model="item" placeholder="ladder" />&nbsp;
    <input type="number" v-model="quantity" style="width: 50px" />
    <br />
    <button @click="onClick">Craft</button> <br />
    <template v-if="netItems">
      <h2>Needed Materials</h2>
      <div v-for="item in neededItems" :key="item.item">
        {{ item.quantity }}x {{ item.item }}
      </div>
      <h2>Craft Order</h2>
      <div v-for="step in recipeOrder" :key="step.item">
        {{ step.quantity }}x {{ step.item }}
      </div>
    </template>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useRecipesStore } from '../stores/recipes'
import { toRaw } from 'vue'
export default {
  data: () => ({
    item: '',
    quantity: 1,
    netItems: null,
    recipeCrafts: null
  }),
  computed: {
    ...mapStores(useRecipesStore),
    recipeOrder() {
      return Object.entries(this.recipeCrafts)
        .reverse() // TODO this doesn't always give a possible order
        .map(([item, quantity]) => ({ item, quantity }))
    },
    neededItems() {
      return Object.entries(this.netItems)
        .filter(([, quantity]) => quantity < 0)
        .map(([item, quantity]) => ({ item, quantity: -quantity }))
        .sort((a, b) => b.quantity - a.quantity)
    }
  },
  methods: {
    onClick() {
      // you could add support for already owned items by setting them as positive in netItems
      const netItems = { [this.item]: -this.quantity }
      const recipeCrafts = {}
      const itemRecipes = {}

      // find something that needs to be crafted (order doesn't matter right now since we can go negative)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        let crafted = false
        for (let item in netItems) {
          // create a map of recipes for efficiency
          if (itemRecipes[item] === undefined) {
            const foundRecipe = this.recipesStore.recipes.find((r) =>
              r.output.some((o) => o.name === item)
            )
            itemRecipes[item] = foundRecipe ? toRaw(foundRecipe) : false
          }
          const recipe = itemRecipes[item]
          const quantity = netItems[item]
          const shouldCraftItem = recipe && quantity < 0 // craft final product/intermediates (not raw materials, since raw materials don't have a recipe)
          if (shouldCraftItem) {
            crafted = true
            const desiredQuantity = -quantity
            const recipeOutputQuantity = recipe.output.find((o) => o.name === item).quantity
            const neededCrafts = Math.ceil(desiredQuantity / recipeOutputQuantity)
            recipeCrafts[item] = (recipeCrafts[item] || 0) + neededCrafts
            // adjust net quantities of inputs and outputs
            recipe.output.forEach((o) => {
              netItems[o.name] = (netItems[o.name] || 0) + o.quantity * neededCrafts
            })
            recipe.input.forEach((o) => {
              netItems[o.name] = (netItems[o.name] || 0) - o.quantity * neededCrafts
            })
            break // this restarts the search from the top but it's not actually necessary since we will start again at the top due to the while loop
          }
        }
        if (!crafted) break
      }
      this.netItems = netItems
      this.recipeCrafts = recipeCrafts
    }
  }
}
</script>
