import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import Image from './Image.vue'

describe('Image', () => {
  it('shows fallback text when src is missing', () => {
    const wrapper = mount(Image, {
      props: {
        alt: 'Poster',
        src: null,
      },
    })

    expect(wrapper.find('.poster-image-error').text()).toBe('No Image')
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('shows shimmer-only loading state by default', () => {
    const wrapper = mount(Image, {
      props: {
        alt: 'Poster',
        src: 'poster.jpg',
      },
    })

    expect(wrapper.find('.poster-image-loading').exists()).toBe(true)
    expect(wrapper.find('.poster-image-surface').exists()).toBe(true)
    expect(wrapper.find('.poster-image-spinner').exists()).toBe(false)
    expect(wrapper.find('.poster-image-loading-text').exists()).toBe(false)
  })

  it('shows spinner and loading text when requested', () => {
    const wrapper = mount(Image, {
      props: {
        alt: 'Poster',
        src: 'poster.jpg',
        showSpinner: true,
        loadingText: 'loading poster...',
      },
    })

    expect(wrapper.find('.poster-image-spinner').exists()).toBe(true)
    expect(wrapper.find('.poster-image-loading-text').text()).toBe('loading poster...')
  })

  it('reveals image after load event and hides loading overlay', async () => {
    const wrapper = mount(Image, {
      props: {
        alt: 'Poster',
        src: 'poster.jpg',
      },
    })

    await wrapper.find('img').trigger('load')
    await nextTick()

    expect(wrapper.find('.poster-image-loading').exists()).toBe(false)
    expect(wrapper.find('img').classes()).toContain('poster-image-media--visible')
    expect(wrapper.find('.poster-image-error').exists()).toBe(false)
  })

  it('shows custom error text when image fails', async () => {
    const wrapper = mount(Image, {
      props: {
        alt: 'Poster',
        src: 'broken.jpg',
        errorText: 'Poster unavailable',
      },
    })

    await wrapper.find('img').trigger('error')
    await nextTick()

    expect(wrapper.find('.poster-image-loading').exists()).toBe(false)
    expect(wrapper.find('.poster-image-error').text()).toBe('Poster unavailable')
    expect(wrapper.find('img').classes()).toContain('poster-image-media--hidden')
  })

  it('resets loading state when src changes', async () => {
    const wrapper = mount(Image, {
      props: {
        alt: 'Poster',
        src: 'poster-a.jpg',
      },
    })

    await wrapper.find('img').trigger('error')
    await nextTick()
    expect(wrapper.find('.poster-image-error').exists()).toBe(true)

    await wrapper.setProps({ src: 'poster-b.jpg' })
    await nextTick()

    expect(wrapper.find('.poster-image-loading').exists()).toBe(true)
    expect(wrapper.find('.poster-image-error').exists()).toBe(false)
  })
})
