export enum SearchFormType {
  SELECT = 'select',
  INPUT = 'input'
}

export enum SearchSourceFrom {
  API = 'api',
  LOCAL = 'local'
}

export interface SearchSelectOptions {
  label: string,
  value: string | number
}

export interface SearchField {
  /**
   * 唯一值
   */
  unique: number,
  label: string,
  name: string,
  formType: SearchFormType,
  clearable: boolean,
  defaultValue: string,
  sourceFrom: SearchSourceFrom | null,
  options: Array<SearchSelectOptions> | string,
  optionsApi: string | null,
  optionsApiFunction: string | null
}

export interface Search {
  labelWidth: number | string,
  labelPosition: string,
  fieldInfos: Array<SearchField>
}

export interface Column {
  label: string,
  prop: string,
  width: number | string,
  sortable: boolean,
  showOverflowTooltip: boolean
}

export interface DynamicPageConfig {
  pageTitle: string,
  pageName: string,
  search: Search | null,
  table: Array<Column>
}
