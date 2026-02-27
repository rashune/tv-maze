import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { horizontalScrollResetKey } from '../../injectionKeys'
import ScrollableContainer from './ScrollableContainer.vue'

describe('ScrollableContainer', () => {
  it('does not show arrow buttons when content does not overflow', async () => {
    const wrapper = mount(ScrollableContainer, {
      props: {
        label: 'Test scroller',
      },
      slots: {
        default: '<div>Item</div>',
      },
    })

    await nextTick()
    expect(wrapper.findAll('button')).toHaveLength(0)
  })

  it('shows arrow buttons when content overflows', async () => {
    const wrapper = mount(ScrollableContainer, {
      props: {
        label: 'Test scroller',
      },
      slots: {
        default: '<div>Item</div>',
      },
    })

    const scroller = wrapper.find('.scroller').element as HTMLElement
    Object.defineProperty(scroller, 'clientWidth', {
      configurable: true,
      value: 100,
    })
    Object.defineProperty(scroller, 'scrollWidth', {
      configurable: true,
      value: 500,
    })

    window.dispatchEvent(new Event('resize'))
    await nextTick()

    expect(wrapper.findAll('button')).toHaveLength(2)
  })

  it('hides arrow buttons when showButtons is false', async () => {
    const wrapper = mount(ScrollableContainer, {
      props: {
        label: 'Test scroller',
        showButtons: false,
      },
      slots: {
        default: '<div>Item</div>',
      },
    })

    await nextTick()
    expect(wrapper.findAll('button')).toHaveLength(0)
  })

  it('applies hidden scrollbar class when showScrollbar is false', () => {
    const wrapper = mount(ScrollableContainer, {
      props: {
        label: 'Test scroller',
        showScrollbar: false,
      },
      slots: {
        default: '<div>Item</div>',
      },
    })

    expect(wrapper.find('.scroller').classes()).toContain('scroller-no-scrollbar')
  })

  it('applies overlay class when overlayButtons is true', () => {
    const wrapper = mount(ScrollableContainer, {
      props: {
        label: 'Test scroller',
        overlayButtons: true,
      },
      slots: {
        default: '<div>Item</div>',
      },
    })

    expect(wrapper.find('.scroller-wrapper').classes()).toContain('scroller-wrapper-overlay')
  })

  it('resets horizontal scroll when injected reset signal changes', async () => {
    const resetSignal = ref(0)

    const wrapper = mount(ScrollableContainer, {
      props: {
        label: 'Test scroller',
      },
      global: {
        provide: {
          [horizontalScrollResetKey as symbol]: resetSignal,
        },
      },
      slots: {
        default: '<div>Item</div>',
      },
    })

    const scroller = wrapper.find('.scroller').element as HTMLElement
    scroller.scrollLeft = 180

    resetSignal.value = 1
    await nextTick()

    expect(scroller.scrollLeft).toBe(0)
  })
})
