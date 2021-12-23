/*
 * @Author: your name
 * @Date: 2021-12-13 13:41:39
 * @LastEditTime: 2021-12-13 17:09:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \dynamic-page\server\router\index.js
 */

const path = require('path')
const { Router } = require('express')
const { readFile, writeFile } = require('fs-extra')
const prettier = require('prettier')
const { template } = require('lodash')

const router = Router()

const readFileData = async (filePath, config) => {
  const result = await readFile(filePath, 'utf-8')

  const compiled = template(result)

  const page = compiled(config)

  return page
}

const writeFileData = async (data, filePath) => {
  await writeFile(filePath, data)
}

const previewPath = path.resolve(__dirname, '../../src/preview/index.vue')

router.use('/prevewPage', async (req, res) => {
  res.setHeader('Content-Type', 'text/html;charset=UTF-8')

  const data = await readFileData(path.resolve(__dirname, '../template.vue'), req.body)

  const afterPrettierData = prettier.format(data, {
    parser: 'vue'
  })
  
  await writeFileData(afterPrettierData, previewPath)

  res.json({
    errCode: 0,
    status: 200,
    message: ''
  })
})

module.exports = router
