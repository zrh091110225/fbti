#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== FBTI 前端一键部署脚本 ===${NC}"
echo "本脚本将构建并部署 FBTI 前端到腾讯云服务器。"
echo ""

# 1. 获取服务器信息
DEFAULT_SERVER_IP="43.156.66.118"
read -p "请输入服务器公网 IP (默认: $DEFAULT_SERVER_IP): " INPUT_IP
SERVER_IP=${INPUT_IP:-$DEFAULT_SERVER_IP}

DEFAULT_KEY_PATH="/Users/hymanhai/Downloads/zrhcc.pem"
read -p "请输入私钥文件路径 (默认: $DEFAULT_KEY_PATH): " INPUT_KEY
PRIVATE_KEY=${INPUT_KEY:-$DEFAULT_KEY_PATH}

DEPLOY_DIR="/home/ubuntu/fbti"

echo -e "${GREEN}目标服务器: ubuntu@$SERVER_IP${NC}"
echo -e "${GREEN}部署目录: $DEPLOY_DIR${NC}"

# SSH 选项
PRIVATE_KEY="${PRIVATE_KEY/#\~/$HOME}"
if [ ! -f "$PRIVATE_KEY" ]; then
    echo -e "${RED}错误: 密钥文件 $PRIVATE_KEY 不存在${NC}"
    exit 1
fi
chmod 600 "$PRIVATE_KEY" 2>/dev/null
SSH_OPTS="-i $PRIVATE_KEY -o StrictHostKeyChecking=no"

# 2. 测试连接
echo -e "\n${YELLOW}正在检查 SSH 连接...${NC}"
if ssh $SSH_OPTS -o ConnectTimeout=5 ubuntu@$SERVER_IP exit 2>/dev/null; then
    echo -e "${GREEN}SSH 连接成功。${NC}"
else
    echo -e "${RED}SSH 连接失败，请检查密钥文件和防火墙设置。${NC}"
    exit 1
fi

# 3. 本地构建
echo -e "\n${YELLOW}正在本地构建前端...${NC}"
cd /Users/hymanhai/fbti/frontend

if ! npm run build > /dev/null 2>&1; then
    echo -e "${RED}前端构建失败，请检查错误信息。${NC}"
    npm run build
    exit 1
fi

echo -e "${GREEN}前端构建成功。${NC}"

# 4. 同步文件到服务器
echo -e "\n${YELLOW}正在同步文件到服务器...${NC}"
ssh $SSH_OPTS ubuntu@$SERVER_IP "mkdir -p $DEPLOY_DIR"

rsync -avz --delete --progress \
    -e "ssh $SSH_OPTS" \
    --exclude '.DS_Store' \
    --exclude 'node_modules' \
    --exclude 'src' \
    --exclude 'public/results_720p' \
    --exclude 'public/results_480p' \
    ./dist/ ubuntu@$SERVER_IP:$DEPLOY_DIR/

# 修复权限（确保 nginx www-data 能读取）
ssh $SSH_OPTS ubuntu@$SERVER_IP "sudo chmod -R o+rx $DEPLOY_DIR && echo '权限修复完成'"

# 5. 部署结果图片（用户上传的封面图）
echo -e "\n${YELLOW}同步结果图片...${NC}"
rsync -avz --progress \
    -e "ssh $SSH_OPTS" \
    --exclude '.DS_Store' \
    ./public/results/ ubuntu@$SERVER_IP:$DEPLOY_DIR/results/

# 6. 配置 Nginx
echo -e "\n${YELLOW}配置 Nginx...${NC}"
ssh $SSH_OPTS ubuntu@$SERVER_IP << 'ENDSSH'
NGINX_CONF="/etc/nginx/sites-available/fbti"
NGINX_ENABLED="/etc/nginx/sites-enabled/fbti"

sudo tee $NGINX_CONF > /dev/null << 'EOF'
server {
    listen 80 default_server;
    server_name fbti.zrhcc.com 43.156.66.118;

    root /home/ubuntu/fbti;
    index index.html;

    # Vite 构建的静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML 不缓存
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 检查是否已启用
if [ -L "$NGINX_ENABLED" ]; then
    echo "Nginx 配置已存在，跳过链接步骤..."
else
    sudo ln -sf $NGINX_CONF $NGINX_ENABLED
    echo "Nginx 配置已链接..."
fi

# 测试并重载 nginx
if sudo nginx -t > /dev/null 2>&1; then
    sudo nginx -s reload
    echo -e "\033[0;32mNginx 重载成功。\033[0m"
else
    echo -e "\033[0;31mNginx 配置有误，请检查。\033[0m"
    sudo nginx -t
fi
ENDSSH

echo -e "\n${GREEN}=== 部署完成 ===${NC}"
