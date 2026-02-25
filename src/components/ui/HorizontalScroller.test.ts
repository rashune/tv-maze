import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HorizontalScroller from './HorizontalScroller.vue'

describe('HorizontalScroller', () => {
  it('hides arrow buttons when showButtons is false', () => {
    const wrapper = mount(HorizontalScroller, {
      props: {
        label: 'Test scroller',
        showButtons: false,
      },
      slots: {
        default: '<div>Item</div>',
      },
    })

    expect(wrapper.findAll('button')).toHaveLength(0)
  })

  it('applies hidden scrollbar class when showScrollbar is false', () => {
    const wrapper = mount(HorizontalScroller, {
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
})
