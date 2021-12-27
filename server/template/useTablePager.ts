import { reactive, ref, toRefs } from 'vue'
import { createTablePager, PAGER_YPE } from '@/util/tablePager'
import { tableListAsync } from './http'

const createSearchModel = () => ({
  <% _.forEach(search.fieldInfos, field => { %>
    <%= field.name %>: '<%= field.defaultValue %>',
  <% }) %>
})

const fn = () => {
  const searchDom = ref(null)
  /**
    * 搜索表单
    */
  const searchModel = reactive(createSearchModel())

  const {
    tablePager,
    pageSizeChange,
    pageNumChange,
    sortChange,
    selectionChange
  } = createTablePager({
    pagerType: PAGER_YPE.REMOTE,
    getData: tableListAsync
  })
  
  const { pageNum, pageSize, sortField, sortType } = toRefs(tablePager)
  
  tablePager.body = {
    ...toRefs(searchModel),
    pageNum,
    pageSize,
    sortField,
    sortType
  }
  
  /**
   * 查询
   */
  const toSearch = () => {
    tablePager.doGetData()
  }
  
  /**
   * 重置查询表单
   */
  const toReset = () => {
    const dom: any = searchDom.value
  
    dom?.resetFields();
  
    toSearch()
  }

  toSearch()

  return {
    tablePager,
    pageSizeChange,
    pageNumChange,
    sortChange,
    selectionChange,

    searchModel,

    toSearch,
    toReset
  }
}

export default fn
