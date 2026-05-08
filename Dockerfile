# Gunakan image dasar Node.js
FROM node:18

# Tentukan direktori kerja di dalam kontainer
WORKDIR /usr/src/app

# Salin file package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin semua kode aplikasi
COPY . .

# Aplikasi jalan di port 80 (biasanya untuk Load Balancer)
EXPOSE 80

# Jalankan aplikasi
CMD [ "node", "index.js" ]