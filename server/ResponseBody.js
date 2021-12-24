class ResponseBody {
  status = 200
  message = ''
  data = null
  constructor (status = 200, message = '', data = null) {
    this.status = status
    this.message = message
    this.data = data
  }
}

module.exports = ResponseBody
