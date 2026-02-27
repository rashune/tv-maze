import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import SearchBar from './SearchBar.vue'

const Host = defineComponent({
  components: { SearchBar },
  props: {
    initialQuery: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const query = ref(props.initialQuery)
    return { query }
  },
  template: '<SearchBar v-model="query" />',
})

describe('SearchBar', () => {
  it('binds v-model to the search input', async () => {
    const wrapper = mount(Host, {
      props: {
        initialQuery: 'game',
      },
    })

    const input = wrapper.find('input.search-input')
    expect((input.element as HTMLInputElement).value).toBe('game')

    await input.setValue('lost')
    expect((wrapper.vm as { query: string }).query).toBe('lost')
  })

  it('does not render a clear button', () => {
    const wrapper = mount(Host, {
      props: {
        initialQuery: '',
      },
    })

    expect(wrapper.find('button.search-clear').exists()).toBe(false)
  })
})
