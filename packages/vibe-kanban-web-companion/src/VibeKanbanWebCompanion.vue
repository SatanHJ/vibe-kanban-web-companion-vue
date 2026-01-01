<template>
  <div>
    <style>
      [data-click-to-component] * {
        pointer-events: auto !important;
      }

      [data-click-to-component-target] {
        cursor: var(--click-to-component-cursor, crosshair) !important;
        outline: auto 1px;
        outline: var(
          --click-to-component-outline,
          -webkit-focus-ring-color auto 1px
        ) !important;
      }
    </style>

    <Teleport to="body" v-if="showButton">
      <button
        @click.stop="toggleTargeting"
        :aria-pressed="state === State.HOVER && trigger === Trigger.BUTTON"
        :style="{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: state === State.HOVER && trigger === Trigger.BUTTON ? 'royalblue' : 'white',
          color: state === State.HOVER && trigger === Trigger.BUTTON ? 'white' : 'black',
          border: '1px solid #ccc',
          boxShadow: '0 2px 6px rgba(0,0,0,.3)',
          zIndex: 2147483647,
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
        }"
        title="Toggle targeting mode"
      >
        <img
          :src="'data:image/svg+xml;utf8,' + encodeURIComponent(vkIcon)"
          alt="VK Icon"
          :style="{
            width: '32px',
            height: '32px',
            filter: state === State.HOVER && trigger === Trigger.BUTTON ? 'brightness(0) invert(1)' : 'none',
          }"
        />
      </button>
    </Teleport>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { getDisplayNameForInstance } from './getDisplayNameFromVueInstance.js'
import { getPathToSource } from './getPathToSource.js'
import { getPropsForInstance } from './getPropsForVueInstance.js'
import { getVueInstancesForElement } from './getVueInstancesForElement.js'
import { getSourceForInstance } from './getSourceForVueInstance.js'
import { getUrl } from './getUrl.js'

const State = {
  IDLE: 'IDLE',
  HOVER: 'HOVER',
  SELECT: 'SELECT',
}

const Trigger = {
  ALT_KEY: 'alt-key',
  BUTTON: 'button',
}

const MESSAGE_SOURCE = 'click-to-component'
const MESSAGE_VERSION = 1

function getComponentInstances(target, pathModifier) {
  if (!target) return []

  const instances = getVueInstancesForElement(target).filter((instance) =>
    getSourceForInstance(instance)
  )

  return instances.map((instance) => {
    const name = getDisplayNameForInstance(instance)
    const source = getSourceForInstance(instance)
    const path = getPathToSource(source, pathModifier)
    const props = getPropsForInstance(instance)

    return {
      name,
      props,
      source: {
        fileName: source.fileName,
        lineNumber: source.lineNumber,
        columnNumber: source.columnNumber
      },
      pathToSource: path
    }
  })
}

function postOpenToParent({ editor, pathToSource, url, trigger, event, element, pathModifier, selectedComponent }) {
  try {
    const el = element || (event && event.target instanceof HTMLElement ? event.target : null)

    const allComponents = el ? getComponentInstances(el, pathModifier) : []

    const selected = selectedComponent
      ? allComponents.find(comp => comp.name === selectedComponent)
      : allComponents.find(comp => comp.pathToSource === pathToSource) || allComponents[0]

    const elementInfo = el
      ? {
        tag: el.tagName?.toLowerCase?.() || undefined,
        id: el.id || undefined,
        className:
          typeof el.className === 'string'
            ? el.className
            : String(el.className || ''),
        role: el.getAttribute('role') || undefined,
        dataset: { ...el.dataset },
      }
      : undefined

    const message = {
      source: MESSAGE_SOURCE,
      version: MESSAGE_VERSION,
      type: 'open-in-editor',
      payload: {
        selected: selected ? {
          editor,
          pathToSource: selected.pathToSource,
          url,
          name: selected.name,
          props: selected.props,
          source: selected.source
        } : {
          editor,
          pathToSource,
          url,
          name: selectedComponent || 'Unknown',
          props: {},
          source: {}
        },
        components: allComponents,
        trigger,
        coords: event
          ? { x: event.clientX ?? undefined, y: event.clientY ?? undefined }
          : undefined,
        clickedElement: elementInfo,
      },
    }

    if (
      typeof window !== 'undefined' &&
      window.parent &&
      window.parent !== window &&
      typeof window.parent.postMessage === 'function'
    ) {
      window.parent.postMessage(message, '*')
    }
  } catch (err) {
    console.warn('[click-to-component] postMessage failed', err)
  }
}

export default {
  name: 'VibeKanbanWebCompanion',
  setup() {
    const editor = 'vscode'
    const pathModifier = (path) => path
    
    const state = ref(State.IDLE)
    const trigger = ref(null)
    const target = ref(null)
    const showButton = ref(false)

    const vkIcon = `<svg width="435" height="257" viewBox="0 0 435 257" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M51.4385 19.4795H68.8164V136.314H76.6152V155.719H93.9932V181.729H126.59V136.314H151.766V0.0751953H202.498V19.4795H219.876V165.677H194.699V211.091H169.522V256.505H58.8584V229.616H51.0596V211.091H33.6816V184.201H25.8828V165.677H8.50488V138.788H0.707031V0.0751953H51.4385V19.4795ZM291.169 19.4795H308.548V90.9014H341.143V45.4883H366.319V0.0751953H417.051V19.4795H434.43V74.8506H409.253V120.264H384.077V136.314H391.874V155.719H409.253V181.729H417.051V201.133H434.43V256.505H374.12V229.616H366.319V184.201H341.143V165.677H308.548V256.505H248.235V229.616H240.438V0.0751953H291.169V19.4795ZM202.498 26.0293H213.326V159.127H188.149V204.541H162.973V249.954H65.4082V229.616H62.2666V253.094H166.114V207.683H191.291V162.27H216.468V22.8877H202.498V26.0293ZM301.998 249.954H254.785V229.616H251.644V253.094H305.137V162.27H341.143V159.127H301.998V249.954ZM417.051 207.683H427.88V249.954H380.67V229.616H377.527V253.094H431.022V204.541H417.051V207.683ZM202.498 138.788H177.321V184.201H152.145V229.616H68.8164V246.544H159.564V201.133H184.741V155.719H209.918V29.4375H202.498V138.788ZM291.169 229.616H258.194V246.544H298.589V155.719H341.143V138.788H291.169V229.616ZM417.051 229.616H384.077V246.544H424.473V211.091H417.051V229.616ZM37.0898 207.683H51.0596V204.541H40.2324V184.201H37.0898V207.683ZM43.6396 201.133H51.0596V184.201H43.6396V201.133ZM76.6152 181.729H84.0352V165.677H76.6152V181.729ZM76.6152 162.27H87.4434V181.729H90.585V159.127H76.6152V162.27ZM391.874 181.729H399.297V165.677H391.874V181.729ZM391.874 162.27H402.703V181.729H405.847V159.127H391.874V162.27ZM11.9131 162.27H25.8828V159.127H15.0547V138.788H11.9131V162.27ZM18.4639 155.719H25.8828V138.788H18.4639V155.719ZM51.4385 136.314H58.8584V29.4375H51.4385V136.314ZM51.4385 26.0293H62.2666V136.314H65.4082V22.8877H51.4385V26.0293ZM417.051 47.9609H391.874V93.375H366.697V136.314H374.12V110.306H399.297V64.8926H424.473V29.4375H417.051V47.9609ZM417.051 26.0293H427.88V68.3008H402.703V113.714H377.527V136.314H380.67V116.855H405.847V71.4424H431.022V22.8877H417.051V26.0293ZM291.169 90.9014H298.589V29.4375H291.169V90.9014ZM291.169 26.0293H301.998V90.9014H305.137V22.8877H291.169V26.0293Z" fill="black"/>
</svg>`

    const toggleTargeting = () => {
      if (state.value === State.HOVER && trigger.value === Trigger.BUTTON) {
        state.value = State.IDLE
        trigger.value = null
      } else {
        state.value = State.HOVER
        trigger.value = Trigger.BUTTON
      }
    }

    const handleContextMenu = (event) => {
      if (state.value !== State.IDLE && event.target instanceof HTMLElement) {
        event.preventDefault()

        postOpenToParent({
          editor,
          pathToSource: '',
          url: '',
          trigger: 'context-menu',
          event,
          element: event.target,
          pathModifier
        })
      }
    }

    const handleClick = (event) => {
      if (state.value === State.HOVER) {
        event.preventDefault()
        event.stopPropagation()
      }

      if (state.value === State.HOVER && trigger.value === Trigger.BUTTON && target.value instanceof HTMLElement) {
        postOpenToParent({
          editor,
          pathToSource: '',
          url: '',
          trigger: 'context-menu',
          event,
          element: target.value,
          pathModifier,
        })

        state.value = State.IDLE
        trigger.value = null
        return
      }

      if (state.value === State.HOVER && trigger.value === Trigger.ALT_KEY && target.value instanceof HTMLElement) {
        const instance = getVueInstancesForElement(target.value).find((instance) =>
          getSourceForInstance(instance)
        )

        if (!instance) {
          return console.warn(
            'Could not find Vue instance for element',
            target.value
          )
        }

        const source = getSourceForInstance(instance)

        if (!source) {
          return console.warn(
            'Could not find source for Vue instance',
            instance
          )
        }
        const path = getPathToSource(source, pathModifier)
        const url = getUrl({
          editor,
          pathToSource: path,
        })

        event.preventDefault()

        postOpenToParent({
          editor,
          pathToSource: path,
          url,
          trigger: 'alt-click',
          event,
          element: target.value,
          pathModifier
        })

        state.value = State.IDLE
        trigger.value = null
      }
    }

    const handleKeyDown = (event) => {
      switch (state.value) {
        case State.IDLE:
          if (event.altKey) {
            state.value = State.HOVER
            trigger.value = Trigger.ALT_KEY
          }
          break

        case State.HOVER:
          if (event.key === 'Escape' && trigger.value === Trigger.BUTTON) {
            state.value = State.IDLE
            trigger.value = null
          }
          break
      }
    }

    const handleKeyUp = (event) => {
      switch (state.value) {
        case State.HOVER:
          if (trigger.value === Trigger.ALT_KEY) {
            state.value = State.IDLE
            trigger.value = null
          }
          break
      }
    }

    const handleMouseMove = (event) => {
      if (!(event.target instanceof HTMLElement)) {
        return
      }

      switch (state.value) {
        case State.IDLE:
        case State.HOVER:
          target.value = event.target
          break
      }
    }

    const handleBlur = () => {
      switch (state.value) {
        case State.HOVER:
          state.value = State.IDLE
          trigger.value = null
          break
      }
    }

    watch([state, target, trigger], () => {
      for (const element of Array.from(
        document.querySelectorAll('[data-click-to-component-target]')
      )) {
        if (element instanceof HTMLElement) {
          delete element.dataset.clickToComponentTarget
        }
      }

      if (state.value === State.IDLE) {
        delete window.document.body.dataset.clickToComponent
        window.document.body.style.removeProperty('--click-to-component-cursor')
        if (target.value) {
          delete target.value.dataset.clickToComponentTarget
        }
        return
      }

      if (target.value instanceof HTMLElement) {
        window.document.body.dataset.clickToComponent = state.value
        target.value.dataset.clickToComponentTarget = state.value

        window.document.body.style.setProperty(
          '--click-to-component-cursor',
          'crosshair'
        )
      }
    })

    onMounted(() => {
      const onMessage = (event) => {
        const data = event?.data
        if (
          data &&
          data.source === MESSAGE_SOURCE &&
          data.version === MESSAGE_VERSION &&
          data.type === 'enable-button'
        ) {
          showButton.value = true
        }
      }
      window.addEventListener('message', onMessage)

      if (
        typeof window !== 'undefined' &&
        window.parent &&
        window.parent !== window &&
        typeof window.parent.postMessage === 'function'
      ) {
        try {
          window.parent.postMessage(
            {
              source: MESSAGE_SOURCE,
              version: MESSAGE_VERSION,
              type: 'ready'
            },
            '*'
          )
        } catch (err) {
          console.warn('[click-to-component] ready message failed', err)
        }
      }

      window.addEventListener('click', handleClick, { capture: true })
      window.addEventListener('contextmenu', handleContextMenu, { capture: true })
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('blur', handleBlur)

      return () => {
        window.removeEventListener('message', onMessage)
      }
    })

    onUnmounted(() => {
      window.removeEventListener('click', handleClick, { capture: true })
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true })
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('blur', handleBlur)
    })

    return {
      State,
      Trigger,
      state,
      trigger,
      showButton,
      vkIcon,
      toggleTargeting
    }
  }
}
</script>
