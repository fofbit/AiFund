#!/bin/bash
echo "🧪 AIfund.com 完整用户旅程测试"
echo "================================"
echo ""

API="http://localhost:8001/api"
WALLET="0x123TestWallet456"

echo "✅ Step 1: 连接钱包"
curl -s -X POST $API/wallet/connect \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\": \"$WALLET\", \"wallet_type\": \"metamask\"}" | python -m json.tool | head -20
echo ""

echo "✅ Step 2: 充值10 USDT激活账户"
curl -s -X POST $API/deposit \
  -H "Content-Type: application/json" \
  -d "{
    \"wallet_address\": \"$WALLET\",
    \"currency\": \"USDT\",
    \"amount\": 10.0,
    \"tx_hash\": \"test_journey_001\"
  }" | python -m json.tool
echo ""

echo "✅ Step 3: 获取Bot形象选项"
curl -s $API/gamification/bot-avatars | python -m json.tool | head -15
echo ""

echo "✅ Step 4: 创建Bot (女性Bot)"
curl -s -X POST $API/bot/create \
  -H "Content-Type: application/json" \
  -d "{
    \"wallet_address\": \"$WALLET\",
    \"bot_name\": \"Alpha Queen\",
    \"gender\": \"female\",
    \"avatar_id\": \"female_3\"
  }" | python -m json.tool
echo ""

echo "✅ Step 5: 获取Bot信息"
curl -s $API/bot/$WALLET | python -m json.tool | head -30
echo ""

echo "✅ Step 6: 全球视野 - 查看历史机会"
curl -s $API/global-vision/opportunities | python -m json.tool | head -50
echo ""

echo "✅ Step 7: VIP等级系统"
curl -s $API/gamification/vip-levels | python -m json.tool | head -20
echo ""

echo "✅ Step 8: 虚拟商城"
curl -s $API/gamification/store | python -m json.tool | head -30
echo ""

echo "================================"
echo "🎉 完整测试完成！"
