FROM node:20

LABEL authors="Skyrim"

ENV TimeZone=Asia/Shanghai

WORKDIR /app

COPY . .

ENV PYTHONPATH="/home/dependency"

ARG GLOBAL_PORT = 8888

# port 端口号
ENV VITE_PORT = ${GLOBAL_PORT}

# open 运行 npm run dev 时自动打开浏览器
ENV VITE_OPEN = false

# 打包是否开启 cdn（源文件 utils/build.ts），可自行修改
ENV VITE_OPEN_CDN = false

# public path 配置线上环境路径（打包）、本地通过 http-server 访问时，请置空即可
ENV VITE_PUBLIC_PATH = /vue-next-admin-preview/

EXPOSE ${GLOBAL_PORT}

CMD ["npm", "run", "dev"]
