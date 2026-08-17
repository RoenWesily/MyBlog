import nextMDX from '@next/mdx'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... 你现有的配置
}

export default withMDX(nextConfig)