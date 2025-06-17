# Dockerfile

FROM node:18

# Definindo diretório de trabalho
WORKDIR /app

# Copiar apenas o package.json e o package-lock.json primeiro (melhor para cache)
COPY package*.json ./

# Instalar as dependências DENTRO do container
RUN npm install

# Agora copiar o restante do código
COPY . .

# Expor a porta
EXPOSE 9091

# Start
CMD ["node", "index.js"]