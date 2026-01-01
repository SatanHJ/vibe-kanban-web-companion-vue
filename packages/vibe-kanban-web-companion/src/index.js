import { default as Component } from './VibeKanbanWebCompanion.vue'
import { h } from 'vue'

export const VibeKanbanWebCompanion =
  process.env.NODE_ENV === 'development' ? Component : { render: () => h('div') }
