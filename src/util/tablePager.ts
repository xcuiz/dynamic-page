/*
 * @Author: your name
 * @Date: 2021-12-02 17:23:00
 * @LastEditTime: 2021-12-02 17:25:11
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \dynamic-page\src\util\tablePager.ts
 */
import { reactive } from 'vue'

export enum PAGER_YPE {
  /**
   * 远程分页
   */
  'REMOTE' = 'remote',
  /**
   * 本地分页
   */
  'LOCAL' = 'local'
}

export interface PagerOption {
  $data?: Array<unknown>;
  pageNum?: number;
  pageSize?: number;
  total?: number;
  $total?: number;
  pagerType?: PAGER_YPE;
}

export interface TablePagerOption extends PagerOption {
  sortField?: string;
  sortType?: string;
  loading?: boolean;
  getData?: Function | null;
  filterKey?: string | null;
  filterValue?: string | null;
}

const DEFAULT_PAGE_NUM = 1
const DEFAULT_PAGE_SIZE = 10
class Pager {
  pageNum = DEFAULT_PAGE_NUM
  pageSize = DEFAULT_PAGE_SIZE
  total = 0
  $total = 0
  $data: Array<unknown> = []
  pagerType = PAGER_YPE.REMOTE

  static DefaultPagerOptions = {
    $data: [],
    pageNum: DEFAULT_PAGE_NUM,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    $total: 0,
    pagerType: PAGER_YPE.REMOTE
  }

  constructor (options: PagerOption) {
    const $options = Object.assign({}, Pager.DefaultPagerOptions, options)
    const {
      $data,
      pageNum,
      pageSize,
      total,
      $total,
      pagerType
    } = $options

    this.$data = $data
    this.pageNum = pageNum
    this.pageSize = pageSize
    this.total = total
    this.$total = $total
    this.pagerType = pagerType
  }
}

export class TablePager extends Pager {
  sortField?: string = ''
  sortType?: string = ''
  loading?: boolean = false
  getData?: Function | null

  body?: any

  filterKey?: string | null = null
  filterValue?: string | null = null

  static DefaultTablePagerOption: TablePagerOption = {
    $data: [],
    pageNum: DEFAULT_PAGE_NUM,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    sortField: '',
    sortType: '',
    loading: false,
    getData: null,
    pagerType: PAGER_YPE.REMOTE,
    filterKey: null,
    filterValue: null
  }

  constructor (options?: TablePagerOption) {
    const $options = Object.assign({}, TablePager.DefaultTablePagerOption, options)
    const {
      $data,
      pageNum,
      pageSize,
      total,
      sortField,
      sortType,
      loading,
      getData,
      pagerType,
      filterKey,
      filterValue
    } = $options

    super({
      $data,
      pageNum,
      pageSize,
      total,
      pagerType
    })

    this.sortField = sortField
    this.sortType = sortType
    this.loading = loading
    this.getData = getData
    this.filterKey = filterKey
    this.filterValue = filterValue
  }

  /**
   * 获取数据时区分远程分页和本地分页
   */
  get data (): Array<unknown> {
    let _data = this.$data

    if (this.filterKey && this.filterValue) {
      _data = this.$data.filter((row: any) => row[this.filterKey as string].includes(this.filterValue))
    }

    if (this.pagerType === PAGER_YPE.REMOTE) {
      this.total = this.$total
      return _data
    } else {
      this.total = _data.length
    }

    return _data.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize)
  }

  set data (val: Array<unknown>) {
    this.$data = val
  }

  async doGetData () {
    this.loading = true
    try {
      if (this.getData) {
        const { content, total }: { content: Array<unknown>; total: number } = await this.getData(this.body)

        this.data = content || []

        if (this.pagerType === PAGER_YPE.REMOTE) {
          this.total = total || 0
        } else {
          this.total = content?.length || 0
        }
      }
    } catch (e: any) {
      this.data = []
    } finally {
      this.loading = false
    }
  }

  pageNumChange (pageNum: number) {
    this.pageNum = pageNum

    if (this.pagerType === PAGER_YPE.REMOTE) {
      this.doGetData()
    }
  }

  pageSizeChange (pageSize: number) {
    // 此处重置pageNum
    this.pageNumChange(DEFAULT_PAGE_NUM)

    this.pageSize = pageSize
  }

  reset () {
    this.pageNum = 1
    this.$data = []
    this.total = 0
    this.$total = 0
  }
}

export const createTablePager = (options?: TablePagerOption) => {
  const _tablePager = new TablePager(options)
  const tablePager = reactive(_tablePager)

  const pageSizeChange = (pageSize: number) => {
    tablePager.pageSizeChange(pageSize)
  }

  const pageNumChange = (pageNum: number) => {
    tablePager.pageNumChange(pageNum)
  }

  return {
    tablePager,
    pageSizeChange,
    pageNumChange
  }
}
