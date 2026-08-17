import { remark } from 'remark'
import html from 'remark-html'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'

export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkMath)              // 解析 LaTeX 公式
    .use(remarkRehype)            // 转换为 HTML 语法树
    .use(rehypeKatex)             // 渲染 LaTeX 公式为 HTML
    .use(rehypeStringify)         // 转换为 HTML 字符串
    .process(markdown)
  return result.toString()
}