import { defineStore } from 'pinia'
import _ from 'lodash'

// since these are used to initialize the state, they cannot be actions
function addToMap(map, recipe) {
  recipe.output.forEach(o => {
    // this will overwrite if we have the same output in multiple recipes
    // but that's fine because the algorithm only works with 1 recipe for each item
    map[o.name] = recipe
  })
  return map
}
function generateNewMap(recipes) {
  return recipes.reduce(addToMap, {})
}

export const useRecipesStore = defineStore('recipes', {
  state: () => {
    const savedStoreJSON = localStorage.getItem('recipes')
    if (savedStoreJSON) {
      const savedStore = JSON.parse(savedStoreJSON)
      // refresh the recipeMap in case recipes were changed by hand (useful for developer)
      savedStore.recipeMap = generateNewMap(savedStore.recipes)
      return savedStore
    }
    else return {
      recipes: [],
      // the map improves efficiency when searching for recipes for the crafting algorithm,
      // determining recipe order, etc
      recipeMap: {}
    }
    },
  actions: {
    addRecipe(recipe) {
      this.recipes.push(recipe)
      addToMap(this.recipeMap, recipe)
    },
    deleteRecipe(recipe) {
      this.recipes = this.recipes.filter(r => {
        return !_.isEqual(r, recipe)
      })
      this.refreshMap()
    },
    refreshMap() {
      this.recipeMap = generateNewMap(this.recipes)
    },
  }
})
