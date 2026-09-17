# pigeonming-frontend

This template should help get you started developing with Vue 3 in Vite.

## 文章时间属性

文章位于 `src/content/article/*.md`，顶部元信息使用以下时间字段，旧的 `date` 字段已移除：

```yaml
publishedAt: "2026-09-15T00:00:00+08:00"
updatedAt: "2026-09-15T00:00:00+08:00"
```

- `publishedAt`：发布时间，使用带时区的 ISO 8601 日期时间字符串。
- `updatedAt`：最后更新时间，使用相同格式；首次发布时与发布时间相同，修改文章时手动更新。未填写或无效时回退为发布时间。
- 支持 `YYYY-MM-DDTHH:mm:ss+08:00` 或 UTC 格式 `YYYY-MM-DDTHH:mm:ssZ`，可选 1～3 位毫秒，例如 `2026-09-14T16:00:00.000Z`，与上面的北京时间表示同一时刻。可用 `new Date().toISOString()` 获取当前时间的 UTC 字符串。
- 页面按北京时间显示日期（`YYYY-MM-DD`）：文章列表仅显示更新日期，详情页显示发布日期和更新日期。列表按发布时间降序排列，缺失或无效的发布时间排在有效时间之后。
- 请保留明确的时区（`Z` 或 `±HH:mm`）；不接受纯日期、不带时区的时间或数字时间戳。列表比较实际时刻，因此不同时区的文章也能正确排序。

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```
