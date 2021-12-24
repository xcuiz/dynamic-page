const path = require('path')
const { Router } = require('express')
const { readFile, writeFile } = require('fs-extra')
const prettier = require('prettier')
const { template } = require('lodash')
const ResponseBody = require('../ResponseBody')

const router = Router()

// 模板文件
const templateFile = path.resolve(__dirname, '../template/index.vue')
// 预览文件
const previewFile = path.resolve(__dirname, '../../src/preview/index.vue')
// 配置文件(用于生成预览文件)
const configFile = path.resolve(__dirname, '../template/config.json')

router.use('/prevewPage', async (req, res) => {
  res.setHeader('Content-Type', 'text/html;charset=UTF-8')

  const { body } = req
  // 读模块文件
  const templateFileData = await readFile(templateFile, 'utf-8')

  const compiled = template(templateFileData)

  const compiledPage = compiled(body)
  // 格式化文件
  const prettierPage = prettier.format(compiledPage, {
    parser: 'vue'
  })
  
  await writeFile(previewFile, prettierPage)

  const configJson = JSON.stringify(body)

  const prettierConfigJson = prettier.format(configJson, {
    parser: 'json'
  })
  await writeFile(configFile, prettierConfigJson)

  const responseBody = new ResponseBody(200, '')
  res.json(responseBody)
})

router.use('/previewConfig', async (req, res) => {
  const result = await readFile(configFile, 'utf-8')

  const data = JSON.parse(result)

  const responseBody = new ResponseBody(200, '', data)
  res.json(responseBody)
})

router.use('/source', async (req, res) => {
  const responseBody = new ResponseBody(200, '', [{
    name: '上海',
    code: 'shanghai'
  }, {
    name: '北京',
    code: 'beijing'
  }])
  res.json(responseBody)
})

module.exports = router
