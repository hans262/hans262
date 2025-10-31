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

## 为worker配置自定义域

如果在其他地方购买域名
需要在域名服务商修改域名的解析服务器地址
改为 cloudflare的域名服务器地址

phoenix.ns.cloudflare.com
sullivan.ns.cloudflare.com

在worker中自定义域名后，cloudflare将自动配置解析路径

关键：自己注册的域名，不能被 GFW 备案
因为xx.xx.workers.dev就是被 GFW 认证了，所以，国内无法访问

