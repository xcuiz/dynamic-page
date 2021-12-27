const path = require('path')
const { Router } = require('express')
const { readFile, writeFile, readdirSync } = require('fs-extra')
const prettier = require('prettier')
const { template } = require('lodash')
const ResponseBody = require('../ResponseBody')

const router = Router()

// 模板文件位置
const templatePath = path.resolve(__dirname, '../template')
// 预览文件位置
const previewPath = path.resolve(__dirname, '../../src/preview')
// 配置文件(用于生成预览文件)
const configFile = path.resolve(__dirname, '../config/index.json')

router.use('/prevewPage', async (req, res) => {
  res.setHeader('Content-Type', 'text/html;charset=UTF-8')

  const { body } = req

  const fileNames = readdirSync(templatePath)
  const map = {
    js: 'typescript',
    ts: 'typescript',
    vue: 'vue',
    json: 'json'
  }
  for (let i = 0, len = fileNames.length; i < len; ++i) {
    const fileName = fileNames[i]
    const filePath = path.resolve(templatePath, fileName)

    const fileSplits = fileName.split('.')
    // 获取文件后缀
    const fileExtension = fileSplits[fileSplits.length - 1]

    // 读模块文件
    const templateFileData = await readFile(filePath, 'utf-8')

    const compiled = template(templateFileData)

    const compiledPage = compiled(body)
    // 格式化文件
    const prettierPage = prettier.format(compiledPage, {
      parser: map[fileExtension]
    })

    const previewWritePath = path.resolve(previewPath, fileName)
    await writeFile(previewWritePath, prettierPage)
  }

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

router.use('/dbs', async (req, res) => {
  const responseBody = new ResponseBody(200, '', [{
    label: 'oracle',
    value: 'oracle'
  }, {
    label: 'mysql',
    value: 'mysql'
  }, {
    label: 'ch',
    value: 'ch'
  }])
  res.json(responseBody)
})

router.use('/list', async (req, res) => {
  const { pageNum, pageSize } = req.body

  const result = Array.from({ length: 100 }).map((item, index) => ({
    userName: `哈哈${index + 1}`,
    gender: '男',
    remark: '',
    createTime: '2021-01-01'
  }))

  const sliceResult = result.slice((pageNum - 1) * pageSize, pageNum * pageSize)

  const responseBody = new ResponseBody(200, '', {
    content: sliceResult,
    total: result.length,
    pageNum: pageNum, 
    pageSize: pageSize
  })
  res.json(responseBody)
})

module.exports = router
