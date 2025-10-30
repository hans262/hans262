```sh
npm run cf-typegen
# 生成 worker-configuration.d.ts 类型文件

npm run check
# 测试部署

npm run build && npm run deploy
# 部署到cloudflare

npx wrangler tail
# 建立一个到 Cloudflare Worker  日志系统的实时连
```