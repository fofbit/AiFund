#!/bin/bash
# AIfund.com MVP Test Script

echo "🚀 AIfund.com MVP 测试脚本"
echo "================================"
echo ""

API="http://localhost:8001/api"

echo "1️⃣ 测试 API 健康检查..."
curl -s $API/ | python -m json.tool
echo ""

echo "2️⃣ 测试加密货币价格获取..."
curl -s $API/prices | python -m json.tool | head -20
echo ""

echo "3️⃣ 模拟用户连接钱包..."
WALLET="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4"
curl -s -X POST $API/wallet/connect \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\": \"$WALLET\", \"wallet_type\": \"metamask\"}" | python -m json.tool
echo ""

echo "4️⃣ 模拟用户充值 10 USDT..."
curl -s -X POST $API/deposit \
  -H "Content-Type: application/json" \
  -d "{
    \"wallet_address\": \"$WALLET\",
    \"currency\": \"USDT\",
    \"amount\": 10.0,
    \"tx_hash\": \"test_tx_001\"
  }" | python -m json.tool
echo ""

echo "5️⃣ 创建 AI Bot..."
curl -s -X POST $API/bot/create \
  -H "Content-Type: application/json" \
  -d "{
    \"wallet_address\": \"$WALLET\",
    \"bot_name\": \"Alpha Bot\"
  }" | python -m json.tool
echo ""

echo "6️⃣ 获取 Bot 信息..."
curl -s $API/bot/$WALLET | python -m json.tool
echo ""

echo "✅ 所有测试完成!"
echo ""
echo "🌐 打开浏览器访问: http://localhost:3000"
echo "📊 查看您的AI交易Bot开始工作!"
