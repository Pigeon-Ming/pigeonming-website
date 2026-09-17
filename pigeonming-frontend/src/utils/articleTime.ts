const formatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export const formatArticleTime = (dateTime: string) =>
  formatter.format(new Date(dateTime)).replaceAll('/', '-')
