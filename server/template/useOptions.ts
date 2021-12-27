import { reactive } from 'vue'
import { dynamicOptionsAsync } from './http'

const syncSelectSearchOptions = [<% _.forEach(search.fieldInfos, field => { %>
  <% if (field.formType === 'select' && field.sourceFrom === 'api') { %>
    <%= JSON.stringify(field) %>,
  <% } %>
<% }) %>]

export default () => {

  /**
   * 查询组件是select时的下拉数据
   */
  const searchOptions: { [x: string]: { label: string; value: string | number }[] } = reactive({
    <% _.forEach(search.fieldInfos, field => { %>
      <% if (field.formType === 'select') { %>
        <%= field.name %>: <% if(field.options) { %> <%= JSON.stringify(field.options) %> <% } %> <% if(!field.options) { %>[]<% } %>,
      <% } %>
    <% }) %>
  })

  const getOptions = async (optionName: string, url: string, formatter: string | null) => {
    try {
      const { data } = await dynamicOptionsAsync(url)

      if (Array.isArray(data)) {

        if (formatter) {
          const fn = new Function('list', formatter)

          searchOptions[optionName] = fn(data)
        } else {
          searchOptions[optionName] = data
        }
      }
    } catch (e) {}
  }

  const getAllSyncOptions = () => {
    syncSelectSearchOptions.forEach(({ name, optionsApi, optionsApiFunction }) => {
      getOptions(name, optionsApi as string, optionsApiFunction as string)
    })
  }

  getAllSyncOptions()

  return searchOptions
}
