# Vibe Kanban Web Companion

This package adds point-and-click edit functionality to web apps, when used with [Vibe Kanban](https://vibekanban.com).

Works with Vue 3 applications using [Vite](https://vitejs.dev/) or other build tools that support source map generation.

## Installation

Even though `vibe-kanban-web-companion` is added to `dependencies`, [tree-shaking](https://esbuild.github.io/api/#tree-shaking) will remove `vibe-kanban-web-companion` from `production` builds.

Add this dependency to your project:
```shell
npm i vibe-kanban-web-companion
```

## Usage

<details>
<summary>Vue 3 with Vite</summary>

In your `main.ts` or `main.js` file:

```typescript
import { createApp } from 'vue'
import { VibeKanbanWebCompanion } from 'vibe-kanban-web-companion'
import App from './App.vue'

const app = createApp(App)
app.component('VibeKanbanWebCompanion', VibeKanbanWebCompanion)
app.mount('#app')
```

Then add the component to your root `App.vue`:

```vue
<template>
  <VibeKanbanWebCompanion />
  <router-view />
</template>
```

</details>

<details>
<summary>Nuxt 3</summary>

Create a plugin file `plugins/vibe-kanban.client.ts`:

```typescript
import { VibeKanbanWebCompanion } from 'vibe-kanban-web-companion'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VibeKanbanWebCompanion', VibeKanbanWebCompanion)
})
```

Then add the component to your `app.vue`:

```vue
<template>
  <VibeKanbanWebCompanion />
  <NuxtPage />
</template>
```

</details>

## Credits

Thanks to [Eric Clemmons](https://github.com/ericclemmons) for creating the original [Click-To-Component](https://github.com/ericclemmons/click-to-component) library, from which our helper is forked from.