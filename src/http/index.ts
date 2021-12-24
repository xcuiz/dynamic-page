import request from "@/request";

export const previewPageAsync = (config: any) => request.post('/api/prevewPage', config)

export const previewPageConfigAsync = () => request.get('/api/previewConfig')
