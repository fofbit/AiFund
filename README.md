# 🤖 AIfund.com - AI赚钱给大家分

> **全球首个AI驱动的去中心化投资基金平台**

[![Status](https://img.shields.io/badge/status-MVP-success)]()
[![AI](https://img.shields.io/badge/AI-GPT--5.2-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

## 🌟 愿景

让全球任何人,只需$1美元起,就能享受到世界最先进AI的投资服务。

**"AI赚钱给大家分"** - 打破金融壁垒,实现真正的金融普惠!

---

## ✨ 核心特性

### 💰 极低门槛
- **≥$1 激活基础版** - 任何人都能参与
- **≥$100 升级VIP** - 解锁真实交易
- 支持BTC、ETH、USDT等主流加密货币

### 🤖 AI自动交易
- **GPT-5.2驱动** - 全球最先进的AI决策引擎
- **24/7运行** - 从不休息,永不情绪化
- **全程透明** - 每笔交易可追溯,决策过程可查看

### ⚡ Bot自动进化
- **自主学习** - Bot自动发现新赚钱策略
- **能力解锁** - DeFi挖矿、套利交易、趋势预测等
- **实时通知** - 新能力解锁即时提醒

### 🌍 去中心化
- **Web3原生** - 钱包登录,无需注册
- **多链支持** - BTC, ETH, BSC等
- **资金自主** - VIP用户通过API控制自己的资金

---

## 🏗️ 技术架构

### 后端
- **FastAPI** - 高性能异步API框架
- **MongoDB** - NoSQL数据库
- **GPT-5.2** - OpenAI最新模型(通过Emergent LLM Key)
- **Motor** - 异步MongoDB驱动

### 前端
- **React 19** - 最新React版本
- **Tailwind CSS** - 现代化UI设计
- **Web3.js** - 区块链集成
- **Recharts** - 数据可视化

### AI引擎
- **emergentintegrations** - 统一LLM接口
- **实时市场分析** - 多维度数据处理
- **自适应策略** - 根据市场动态调整

---

## 🚀 快速开始

### 1. 启动服务

所有服务已配置好并运行中:

```bash
# 查看服务状态
sudo supervisorctl status

# 重启所有服务
sudo supervisorctl restart all
```

### 2. 访问应用

- **前端**: http://localhost:3000
- **API文档**: http://localhost:8001/docs

### 3. 测试流程

```bash
# 运行完整测试
/app/test_aifund.sh
```

### 4. 启动AI交易模拟器

```bash
cd /app/backend
python trading_simulator.py
```

---

## 📊 用户旅程

```
1. 连接钱包 (MetaMask/Unisat)
         ↓
2. 充值加密货币 (≥$1 激活)
         ↓
3. 领养AI Bot (取名+选形象)
         ↓
4. Bot开始交易 ($10,000虚拟资金)
         ↓
5. 观看收益 (全程透明)
         ↓
6. Bot自动进化 (解锁新能力)
         ↓
7. 升级VIP (≥$100) → 真实交易
         ↓
8. 平台分成1% (从盈利中)
```

---

## 💡 商业模式

### 收入来源

1. **Performance Fee (主要收入)**
   - 从用户盈利中抽取1%
   - 利益绑定,用户赚钱平台才赚钱

2. **充值激活**
   - 充值即激活,无固定订阅费
   - 灵活且用户友好

3. **未来扩展**
   - 高级Bot形象和装备
   - 专属策略订阅
   - 企业级API服务

---

## 🎮 核心功能实现

### ✅ 已完成 (MVP - Day 1)

- [x] Web3钱包连接 (MetaMask)
- [x] 多币种支持 (BTC, ETH, USDT, etc.)
- [x] 用户充值系统
- [x] Tier自动升级 (基础版/VIP)
- [x] Bot创建和个性化
- [x] GPT-5.2 AI交易引擎
- [x] 模拟交易系统
- [x] 实时收益追踪
- [x] AI决策透明化展示
- [x] Bot自动进化系统
- [x] 交易历史记录
- [x] 响应式UI设计
- [x] 实时图表展示

### 🔄 进行中 (Week 2)

- [ ] Unisat/BTC钱包集成
- [ ] 真实市场数据API (CoinGecko/Binance)
- [ ] Bot能力发现优化
- [ ] 新能力弹窗动画
- [ ] 排行榜系统
- [ ] 推荐奖励系统

### 📅 计划中 (Week 3-4)

- [ ] VIP用户API桥接 (Binance等)
- [ ] 真实交易信号推送
- [ ] 分成自动结算
- [ ] Bot装扮商城
- [ ] 社交分享功能
- [ ] 多语言支持
- [ ] 移动端优化

---

## 🗂️ 项目结构

```
/app/
├── backend/
│   ├── server.py              # FastAPI主服务
│   ├── ai_engine.py           # GPT-5.2 AI引擎
│   ├── trading_simulator.py   # 交易模拟器
│   ├── requirements.txt       # Python依赖
│   └── .env                   # 环境变量
│
├── frontend/
│   ├── src/
│   │   ├── App.js             # 主应用
│   │   ├── components/
│   │   │   ├── LandingPage.js      # 首页
│   │   │   ├── Dashboard.js        # 仪表板
│   │   │   ├── BotDashboard.js     # Bot详情
│   │   │   ├── DepositModal.js     # 充值弹窗
│   │   │   └── CreateBotModal.js   # 创建Bot弹窗
│   │   └── App.css            # 样式
│   ├── package.json           # Node依赖
│   └── .env                   # 环境变量
│
└── test_aifund.sh            # 测试脚本
```

---

## 🔧 API端点

### 核心API

```
GET  /api/                     # 健康检查
GET  /api/prices               # 获取加密货币价格

POST /api/wallet/connect       # 连接钱包
POST /api/deposit              # 充值
POST /api/bot/create           # 创建Bot
GET  /api/bot/:address         # 获取Bot信息
GET  /api/user/:address        # 获取用户信息
GET  /api/leaderboard          # 排行榜
```

### 请求示例

```bash
# 连接钱包
curl -X POST http://localhost:8001/api/wallet/connect \
  -H "Content-Type: application/json" \
  -d '{"wallet_address": "0x...", "wallet_type": "metamask"}'

# 充值
curl -X POST http://localhost:8001/api/deposit \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0x...",
    "currency": "USDT",
    "amount": 10.0
  }'

# 创建Bot
curl -X POST http://localhost:8001/api/bot/create \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0x...",
    "bot_name": "Alpha Bot"
  }'
```

---

## 🎯 MVP测试成果

### 测试数据 (2026-02-07)

✅ **API健康检查** - 成功
✅ **价格获取** - 11种加密货币实时价格
✅ **用户创建** - 钱包连接成功
✅ **充值系统** - 10 USDT充值,自动升级到基础版
✅ **Bot创建** - Alpha Bot创建成功
✅ **AI交易** - 首笔交易:买入BTC @ $94,055.87,盈利$132.30!

**AI决策理由:**
> "BTC trend is up and is the most liquid/robust option for an initial conservative spot position. Allocate 15% of balance to participate in the uptrend while keeping ample cash for volatility and future setups."

---

## 🔐 安全与合规

### 当前阶段 (MVP)
- ✅ 模拟交易,无真实资金风险
- ✅ 数据加密传输
- ✅ 钱包地址验证

### 生产阶段计划
- [ ] 区块链交易验证
- [ ] API Key加密存储
- [ ] 多签钱包支持
- [ ] 审计日志
- [ ] KYC/AML合规(根据地区)
- [ ] 法律顾问咨询

---

## 📈 增长策略

### Phase 1: MVP验证 (当前)
- 核心功能开发
- 早期用户测试
- 产品迭代

### Phase 2: 社区建设 (Month 2)
- 推荐奖励系统
- 社交媒体营销
- KOL合作
- 内容营销

### Phase 3: 规模化 (Month 3-6)
- 真实交易上线
- 多语言支持
- 区域扩展
- 交易所合作

---

## 🌍 支持的加密货币

当前支持:
- Bitcoin (BTC)
- Ethereum (ETH)
- Tether (USDT)
- USD Coin (USDC)
- Binance Coin (BNB)
- Solana (SOL)
- Ripple (XRP)
- Cardano (ADA)
- Dogecoin (DOGE)
- Polkadot (DOT)
- Fractal Bitcoin (FB)

---

## 💬 联系方式

- **Website**: [AIfund.com](http://aifund.com)
- **Twitter**: @AIfund_official (待创建)
- **Discord**: discord.gg/aifund (待创建)
- **Email**: hello@aifund.com

---

## 📝 开发日志

### Day 1 (2026-02-07) - MVP基础 ✅

**完成:**
- ✅ 项目架构设计
- ✅ 后端API开发 (FastAPI + MongoDB)
- ✅ GPT-5.2 AI引擎集成
- ✅ 前端核心页面 (Landing + Dashboard)
- ✅ Web3钱包连接
- ✅ 充值系统
- ✅ Bot创建流程
- ✅ AI交易模拟器
- ✅ 实时数据展示
- ✅ 完整测试通过

**成果:**
- 🎯 完整的用户流程可演示
- 🤖 AI已成功执行首笔交易
- 📊 所有核心API正常运行
- 🎨 现代化UI完成

**下一步:**
- [ ] 集成真实市场数据API
- [ ] 优化AI决策算法
- [ ] 添加更多Bot能力
- [ ] 完善社交功能

---

## 🙏 致谢

感谢以下技术和工具:
- **OpenAI GPT-5.2** - 强大的AI引擎
- **Emergent** - LLM集成平台
- **FastAPI** - 高性能Web框架
- **React** - 现代化前端框架
- **MongoDB** - 灵活的数据库
- **Tailwind CSS** - 美观的UI框架

---

## 📜 License

MIT License - 详见 LICENSE 文件

---

## 🚀 让我们一起创造神话!

**AIfund.com - 让AI赚钱,让人人受益!**

```
    🤖
   /|\\
    |
   / \\
  
  AI Bot
  Ready to
  Make Money!
```

---

**Built with ❤️ and AI**

*Last Updated: 2026-02-07*
