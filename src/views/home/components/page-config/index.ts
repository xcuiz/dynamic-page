import { SearchField, SearchSourceFrom, FormRule } from '../../interface'

export const addFieldInfoRule = (rules: FormRule, index: number) => {
  rules[`search.fieldInfos.${index}.label`] = [{
    required: true,
    message: '搜索名必填'
  }]
  rules[`search.fieldInfos.${index}.name`] = [{
    required: true,
    message: '搜索字段必填'
  }]
  rules[`search.fieldInfos.${index}.options`] = [{
    message: '选择框值必须是json数据',
    validator: (rule: any, value: any, callback: Function) => {
      if (value && typeof value === 'string') {
        try {
          JSON.parse(value)

          callback()
        } catch (e) {
          callback(new Error(rule.message))
        }
      } else {
        callback()
      }
    }
  }]
}

export const optionsToJson = (jsObj: unknown) => {
  if (typeof jsObj !== 'string') {
    try {
      const json = JSON.stringify(jsObj)

      return json
    } catch (e) {
      return jsObj
    }
  }

  return jsObj
}

export const optionsToJs = (json: string) => {
  if (json && typeof json === 'string') {
    try {
      const js = JSON.parse(json)

      return js
    } catch (e) {
      return json
    }
  }

  return json
}

export const sourceFromChange = (fieldInfo: SearchField, value: string) => {
  if (value === SearchSourceFrom.LOCAL) {
    fieldInfo.optionsApi = ''
    fieldInfo.optionsApiFunction = ''
  } else if (value === SearchSourceFrom.API) {
    fieldInfo.options = ''
  }
}

