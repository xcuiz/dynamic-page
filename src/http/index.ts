import request from "@/request";

export const previewPageAsync = (config: any) => request.post('/api/prevewPage', config)

export const previewPageConfigAsync = () => request.get('/api/previewConfig')

export const dynamicOptionsAsync = (url: string) => request.get(url)

export const tableListAsync = (url: string, body: any) => request.post(url, body)
