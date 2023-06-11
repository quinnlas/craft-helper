import { defineStore } from 'pinia'
import _ from 'lodash'

export const useRecipesStore = defineStore('recipes', {
  state: () => {
    const savedRecipes = localStorage.getItem('recipes')
    if (savedRecipes) return { recipes: JSON.parse(savedRecipes) }
    else return { recipes: [] }
    },
  actions: {
    addRecipe(recipe) {
      this.recipes.push(recipe)
    },
    deleteRecipe(recipe) {
      this.recipes = this.recipes.filter(r => {
        return !_.isEqual(r, recipe)
      })
    }
  }
})
