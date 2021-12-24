import request from "@/request";

export const dynamicOptionsAsync = (url: string) => request.get(url)

export const tableListAsync = (body: any) => request.post("<%= table.api %>", body)
