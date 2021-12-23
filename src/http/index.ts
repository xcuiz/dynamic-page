/*
 * @Author: your name
 * @Date: 2021-12-13 11:43:43
 * @LastEditTime: 2021-12-13 11:45:47
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \dynamic-page\src\http\index.ts
 */

import request from "@/request";

export const previewPageAsync = (config: any) => request.post('/api/prevewPage', config)
