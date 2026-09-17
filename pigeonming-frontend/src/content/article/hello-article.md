---
title: 第一篇文章
publishedAt: "2026-09-15T00:00:00+08:00"
updatedAt: "2026-09-15T00:00:00+08:00"
summary: 这是一篇用于初始化文章系统的示例文章，可以复制它作为后续文章模板。
tags:
  - 文章
  - 模板
---

# 第一篇文章

这里是正文内容。以后新建文章时，只需要在 `src/content/article` 目录下新增一个 `.md` 文件，并在顶部写好 frontmatter 元信息。

## 可以这样写小节

Markdown 正文会由统一的文章模板渲染，所以每篇文章不需要再单独创建 Vue 页面。

- 支持标题
- 支持段落
- 支持列表
- 支持代码块
- 支持链接

```ts
const message = 'Hello, article!'
console.log(message)
```

更多内容可以继续写在这里。
