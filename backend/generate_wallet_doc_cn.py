"""
钱包连接+支付验证模块 中文版PDF
使用WenQuanYi中文字体
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, Preformatted
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO

# Register Chinese font
pdfmetrics.registerFont(TTFont('WQY', '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc', subfontIndex=0))

def generate_wallet_doc_cn_pdf() -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=25*mm, bottomMargin=20*mm, leftMargin=20*mm, rightMargin=20*mm)

    # Styles with Chinese font
    cn = 'WQY'
    title_s = ParagraphStyle('T', fontName=cn, fontSize=22, spaceAfter=6, textColor=HexColor('#7C3AED'), alignment=TA_CENTER)
    sub_s = ParagraphStyle('Sub', fontName=cn, fontSize=11, spaceAfter=12, textColor=HexColor('#6B7280'), alignment=TA_CENTER)
    h1 = ParagraphStyle('H1', fontName=cn, fontSize=16, spaceBefore=16, spaceAfter=8, textColor=HexColor('#7C3AED'))
    h2 = ParagraphStyle('H2', fontName=cn, fontSize=13, spaceBefore=12, spaceAfter=6, textColor=HexColor('#4F46E5'))
    body = ParagraphStyle('B', fontName=cn, fontSize=9, spaceAfter=4, leading=14)
    body_b = ParagraphStyle('BB', fontName=cn, fontSize=9, spaceAfter=4, leading=14)
    code_s = ParagraphStyle('Code', fontName='Courier', fontSize=7.5, leading=10, spaceAfter=8, leftIndent=10, backColor=HexColor('#F3F4F6'))
    small = ParagraphStyle('Sm', fontName=cn, fontSize=7.5, textColor=HexColor('#9CA3AF'))
    center = ParagraphStyle('C', fontName=cn, fontSize=9, alignment=TA_CENTER)

    e = []

    # ===== 封面 =====
    e.append(Spacer(1, 50))
    e.append(Paragraph("AiFund.com", title_s))
    e.append(Spacer(1, 8))
    e.append(Paragraph("加密钱包连接 + USDT支付验证 技术模块文档", ParagraphStyle('X', fontName=cn, fontSize=14, textColor=HexColor('#4F46E5'), alignment=TA_CENTER)))
    e.append(Spacer(1, 8))
    e.append(Paragraph("中文版 v1.0 | 零依赖方案 | React + FastAPI + MongoDB", sub_s))
    e.append(HRFlowable(width="50%", thickness=1, color=HexColor('#7C3AED'), spaceAfter=20, hAlign='CENTER'))
    e.append(Spacer(1, 30))

    toc = ["第一部分：钱包连接模块", "  1. 智能检测机制", "  2. 钱包安装引导", "  3. 会话持久化", "  4. 账户管理菜单", "  5. 公链自动识别", "  6. 后端API",
           "第二部分：支付验证模块", "  7. 三步支付流程", "  8. 链上自动验证", "  9. 安全功能", "  10. 自动权限开通",
           "第三部分：开源价值分析"]
    e.append(Paragraph("目录", h1))
    for t in toc:
        e.append(Paragraph(t, body))
    e.append(PageBreak())

    # ===== 第一部分 =====
    e.append(Paragraph("第一部分：钱包连接模块", h1))
    e.append(Paragraph("零依赖的加密钱包连接方案，不需要任何npm钱包库（如RainbowKit、Web3Modal、ethers.js等），仅使用浏览器原生的 window.ethereum API。", body))

    e.append(Paragraph("1. 智能检测机制", h2))
    e.append(Paragraph("当用户点击「连接钱包」按钮时，系统自动检测浏览器是否安装了钱包扩展程序：", body))
    e.append(Paragraph("• 检测到钱包：调用 window.ethereum.request({method: 'eth_requestAccounts'})，弹出MetaMask等钱包授权窗口", body))
    e.append(Paragraph("• 未检测到钱包：弹出「钱包安装引导」模态框，列出6个主流钱包的下载链接", body))
    e.append(Paragraph("• 用户拒绝连接：捕获错误码4001，显示友好提示「连接已取消」而非报错崩溃", body))
    e.append(Paragraph("• Demo模式：不需要任何钱包，用固定Demo地址登录，体验全部功能", body))
    det_code = """// 核心检测逻辑
const handleConnect = () => {
  if (typeof window.ethereum !== 'undefined') {
    onConnect();              // 有钱包 → 直接连接
  } else {
    setShowWalletGuide(true); // 无钱包 → 引导安装
  }
};"""
    e.append(Preformatted(det_code, code_s))

    e.append(Paragraph("2. 钱包安装引导", h2))
    e.append(Paragraph("为没有安装钱包的用户提供详细的安装指引，每个钱包提供两个独立按钮：", body))
    wallet_data = [
        ['钱包', '支持链', '类型', '提供链接'],
        ['MetaMask', 'EVM (ETH/BSC/ARB)', '浏览器+手机', '官网 + Chrome商店'],
        ['OKX Wallet', 'EVM', '浏览器+手机', '官网 + Chrome商店'],
        ['WizzWallet', 'Atomicals/ARC-20', '浏览器插件', '官网 + Chrome商店'],
        ['Trust Wallet', 'EVM', '浏览器+手机', '官网 + Chrome商店'],
        ['Coinbase', 'EVM', '插件+手机', '官网 + Chrome商店'],
        ['Unisat', 'BTC/BRC-20', '浏览器插件', '官网 + Chrome商店'],
    ]
    wt = Table(wallet_data, colWidths=[65, 100, 70, 100])
    wt.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#4F46E5')), ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, -1), cn), ('FONTSIZE', (0, 0), (-1, -1), 7.5),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#D1D5DB')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#F9FAFB'), white]),
        ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    e.append(wt)
    e.append(Paragraph("顶部还提供Chrome浏览器下载链接（浏览器插件钱包需要Chrome）", body))
    e.append(Paragraph("底部「不想装钱包？」提示引导用户使用免费Demo模式", body))

    e.append(Paragraph("3. 会话持久化（localStorage）", h2))
    e.append(Paragraph("连接成功后，钱包地址保存在localStorage中。页面刷新或重新访问时自动重连，用户无感：", body))
    ls_data = [
        ['存储键', '示例值', '用途'],
        ['cwl_wallet', '"0x71376f..."', '已连接的钱包地址，用于自动重连'],
        ['cwl_demo_mode', '"true"', 'Demo模式标识'],
    ]
    lst = Table(ls_data, colWidths=[80, 100, 220])
    lst.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#059669')), ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, -1), cn), ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#D1D5DB')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#F0FDF4'), white]),
        ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    e.append(lst)
    e.append(Paragraph("断开连接时自动清除两个键。如果后端重连失败，也自动清除，防止卡在错误状态。", body))

    e.append(Paragraph("4. 账户管理下拉菜单", h2))
    e.append(Paragraph("替代简单的登出按钮，提供完整的账户管理界面：", body))
    e.append(Paragraph("• 点击Header右侧的[VIP 0x71...523]按钮展开下拉菜单", body))
    e.append(Paragraph("• 显示完整钱包地址、链类型、账户余额", body))
    e.append(Paragraph("• Demo模式额外显示「连接真实钱包」按钮", body))
    e.append(Paragraph("• 红色「断开并切换钱包」按钮 — 真正断开，清除所有状态，返回首页重新连接", body))
    e.append(Paragraph("• 点击菜单外部自动关闭（document级click事件监听）", body))

    e.append(Paragraph("5. 公链自动识别", h2))
    e.append(Paragraph("根据钱包地址格式自动判断所在链：", body))
    chain_code = """0x开头  →  EVM (以太坊/BSC/Arbitrum)  →  图标: 蓝色菱形
T开头   →  Tron (波场)              →  图标: 红色圆
其他    →  Solana                   →  图标: 紫色圆
Demo   →  演示模式                  →  图标: 游戏手柄"""
    e.append(Preformatted(chain_code, code_s))

    e.append(Paragraph("6. 后端API", h2))
    api_code = """POST /api/wallet/connect
  请求体: { wallet_address: "0x...", wallet_type: "metamask" }
  
  响应（新用户）:
    { status: "new_user", user: {地址, 余额, 等级, 推荐码} }
  
  响应（老用户）:
    { status: "existing_user", user: {地址, 余额, 等级, 推荐码} }

  MongoDB集合: users
    { wallet_address, balance_usd, tier, joined_at, referral_code }"""
    e.append(Preformatted(api_code, code_s))

    # ===== 第二部分 =====
    e.append(PageBreak())
    e.append(Paragraph("第二部分：支付验证模块", h1))
    e.append(Paragraph("完整的USDT链上支付收款+自动验证方案，支持5条链。", body))

    e.append(Paragraph("7. 三步支付流程", h2))
    e.append(Paragraph("用户体验清晰的3步引导：", body))
    e.append(Paragraph("第一步「选择链」：展示5条链（TRC20/ERC20/BSC/ARB/SOL），每条显示Gas费和确认速度。提醒用户用登录钱包的相同地址支付。", body))
    e.append(Paragraph("第二步「展示地址+二维码」：显示收款地址文本 + 自动生成的QR二维码。提供一键复制按钮（复制成功绿色✓反馈）。警告Gas费可能从转账金额扣除。", body))
    e.append(Paragraph("第三步「自动验证」：每10秒自动轮询区块链API，旋转动画表示正在检查。最多30次（5分钟）。支持手动粘贴TX Hash作为备选方案。", body))

    e.append(Paragraph("8. 链上自动验证", h2))
    e.append(Paragraph("核心技术实现：", body))
    e.append(Paragraph("• 每10秒调用区块链浏览器API（TronScan/Etherscan/BscScan/Arbiscan）", body))
    e.append(Paragraph("• 匹配条件：发送地址 == 用户钱包 且 金额 >= 要求金额 × 0.9（90%容差）", body))
    e.append(Paragraph("• 匹配成功：自动确认支付，更新用户余额/等级，开通权限", body))
    e.append(Paragraph("• 防重复：同一TX Hash不会被处理两次", body))
    e.append(Paragraph("• 手动备选：用户可粘贴交易哈希直接确认", body))

    e.append(Paragraph("9. 安全功能", h2))
    safety_data = [
        ['功能', '说明'],
        ['同钱包提示', '第一步提醒用户用登录钱包的相同地址支付，验证身份一致性'],
        ['Gas费警告', '提醒钱包可能从转账金额扣除Gas，导致实际到账少于预期'],
        ['错链警告', '红色警告：发错链 = 资金丢失'],
        ['区块链浏览器链接', '每条链提供浏览器链接，用户可自行验证地址真实性'],
        ['90%容差', '接受要求金额90%以上即算有效，兼容Gas扣费'],
        ['TX去重', '同一交易哈希不会被重复处理'],
    ]
    st = Table(safety_data, colWidths=[80, 340])
    st.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#DC2626')), ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, -1), cn), ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#D1D5DB')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#FEF2F2'), white]),
        ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    e.append(st)

    e.append(Paragraph("10. 自动权限开通", h2))
    e.append(Paragraph("支付验证成功后，根据payment_type参数自动执行对应操作：", body))
    e.append(Paragraph("• deposit → 增加用户余额", body))
    e.append(Paragraph("• 可扩展任意类型（如会员解锁、功能付费等）", body))
    e.append(Paragraph("后端自动更新MongoDB中的用户记录，前端刷新即可看到新状态。", body))

    # ===== 第三部分 =====
    e.append(PageBreak())
    e.append(Paragraph("第三部分：开源价值分析", h1))
    e.append(Paragraph("本模块的独特价值在于：钱包连接 + 支付验证 + 无钱包引导 三合一，且零npm依赖。", body))
    e.append(Spacer(1, 8))

    comp_data = [
        ['对比项', '本模块', 'RainbowKit/Web3Modal'],
        ['npm依赖', '零（仅axios）', '10+包（wagmi/viem等）'],
        ['打包体积增加', '约5KB', '200-500KB+'],
        ['无钱包用户引导', '内置（6个钱包+Chrome链接）', '不包含'],
        ['Demo模式', '内置', '不包含'],
        ['USDT支付验证', '内置（5条链）', '不包含'],
        ['QR码生成', '内置', '不包含'],
        ['Gas费容差', '内置（90%）', '不包含'],
        ['中英双语', '内置', '部分'],
        ['手机适配', '内置', '视情况'],
    ]
    ct = Table(comp_data, colWidths=[100, 140, 160])
    ct.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#7C3AED')), ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, -1), cn), ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#D1D5DB')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#F5F3FF'), white]),
        ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    e.append(ct)
    e.append(Spacer(1, 10))

    e.append(Paragraph("适用人群：", h2))
    e.append(Paragraph("• 独立开发者/小团队的Web3项目", body))
    e.append(Paragraph("• 需要接受USDT收款的电商、SaaS、内容付费平台", body))
    e.append(Paragraph("• 不想引入重型Web3库的轻量级项目", body))
    e.append(Paragraph("• 需要钱包连接+支付一体化方案的任何项目", body))
    e.append(Spacer(1, 10))
    e.append(Paragraph("建议GitHub仓库名：crypto-wallet-lite", body))
    e.append(Paragraph("开源协议：MIT（最大化采用率）", body))

    e.append(Spacer(1, 30))
    e.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#D1D5DB'), spaceAfter=8))
    e.append(Paragraph("AiFund.com | 钱包连接+支付验证模块文档 v1.0", center))

    doc.build(e)
    buffer.seek(0)
    return buffer

if __name__ == "__main__":
    pdf = generate_wallet_doc_cn_pdf()
    with open("/tmp/test_cn.pdf", "wb") as f:
        f.write(pdf.getvalue())
    print("OK")
