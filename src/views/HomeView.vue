<script setup>
  import RecipeAdder from '../components/RecipeAdder.vue'
  import RecipeCrafter from '../components/RecipeCrafter.vue';
  import RecipeViewer from '../components/RecipeViewer.vue';
</script>

<template>
  <main>
    <h1>Add Recipe</h1>
    <RecipeAdder/>
    <h1>Craft</h1>
    <RecipeCrafter/>
    <h1>View Recipes</h1>
    <RecipeViewer/>
  </main>
</template>
