"""
AIFund.com Whitepaper Generator
Generates PDF whitepaper with vision, rules, and VIP level system
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from io import BytesIO
import os

VERSION = "1.0.0"

def generate_whitepaper_pdf() -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=30*mm, bottomMargin=25*mm, leftMargin=25*mm, rightMargin=25*mm)

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle('CustomTitle', parent=styles['Title'], fontSize=28, spaceAfter=6, textColor=HexColor('#7C3AED'), alignment=TA_CENTER)
    subtitle_style = ParagraphStyle('Subtitle', parent=styles['Normal'], fontSize=14, spaceAfter=20, textColor=HexColor('#6B7280'), alignment=TA_CENTER)
    h1 = ParagraphStyle('H1', parent=styles['Heading1'], fontSize=20, spaceBefore=20, spaceAfter=10, textColor=HexColor('#7C3AED'))
    h2 = ParagraphStyle('H2', parent=styles['Heading2'], fontSize=16, spaceBefore=15, spaceAfter=8, textColor=HexColor('#4F46E5'))
    h3 = ParagraphStyle('H3', parent=styles['Heading3'], fontSize=13, spaceBefore=10, spaceAfter=6, textColor=HexColor('#6366F1'))
    body = ParagraphStyle('Body', parent=styles['Normal'], fontSize=10, spaceAfter=6, leading=15, alignment=TA_JUSTIFY)
    body_bold = ParagraphStyle('BodyBold', parent=body, fontName='Helvetica-Bold')
    small = ParagraphStyle('Small', parent=styles['Normal'], fontSize=8, textColor=HexColor('#9CA3AF'))
    center = ParagraphStyle('Center', parent=body, alignment=TA_CENTER)
    quote_style = ParagraphStyle('Quote', parent=body, fontSize=11, leftIndent=20, rightIndent=20, textColor=HexColor('#7C3AED'), fontName='Helvetica-Oblique', spaceAfter=10)

    elements = []

    # ===== COVER PAGE =====
    elements.append(Spacer(1, 80))
    elements.append(Paragraph("AIFund.com", title_style))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("Let AI Earn For You", ParagraphStyle('BigSub', parent=subtitle_style, fontSize=18, textColor=HexColor('#4F46E5'))))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("Equal access to AI-powered wealth for everyone", subtitle_style))
    elements.append(Spacer(1, 30))
    elements.append(HRFlowable(width="60%", thickness=1, color=HexColor('#7C3AED'), spaceAfter=10, spaceBefore=10, hAlign='CENTER'))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("WHITEPAPER", ParagraphStyle('WP', parent=subtitle_style, fontSize=12, textColor=HexColor('#9CA3AF'))))
    elements.append(Paragraph(f"Version {VERSION}", small))
    elements.append(Spacer(1, 60))
    elements.append(Paragraph("AI equalizes knowledge. Bot equalizes labor.", quote_style))
    elements.append(Paragraph("AI + Bot equalizes wealth for all.", quote_style))
    elements.append(Spacer(1, 40))
    elements.append(Paragraph("This document describes the vision, mechanism, and rules of the AIFund.com platform.", center))
    elements.append(PageBreak())

    # ===== TABLE OF CONTENTS =====
    elements.append(Paragraph("Table of Contents", h1))
    toc_items = [
        "1. Mission & Vision",
        "2. Core Values",
        "3. How It Works",
        "4. VIP Level System (100 Levels)",
        "5. Profit Distribution Rules",
        "6. Supported Markets & Platforms",
        "7. Security & Safety",
        "8. Pricing",
        "9. Disclaimer",
    ]
    for item in toc_items:
        elements.append(Paragraph(item, body))
    elements.append(PageBreak())

    # ===== 1. MISSION & VISION =====
    elements.append(Paragraph("1. Mission & Vision", h1))
    elements.append(Paragraph(
        "AIFund.com is built on a simple belief: <b>the wealth-building power of AI should not be a privilege of the few</b>. "
        "In a world where algorithmic trading, quantitative analysis, and AI-driven investment strategies are dominated by institutions "
        "and the ultra-wealthy, billions of ordinary people are left behind.", body))
    elements.append(Paragraph(
        "Our mission is to democratize AI-powered wealth creation. We build the bridge that connects cutting-edge artificial intelligence "
        "with anyone who has as little as $1 — regardless of their nationality, education, or banking status.", body))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("Our Vision:", h3))
    elements.append(Paragraph("A world where every person — from a farmer in rural Africa to a factory worker in Southeast Asia — "
        "has an AI-powered Bot working 24/7 to grow their savings. <b>No barriers. No borders. Equal opportunity for all.</b>", body))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph(
        '"This time, YOU are the hero of the $100 to $1,000,000 story."', quote_style))

    # ===== 2. CORE VALUES =====
    elements.append(Paragraph("2. Core Values", h1))
    values = [
        ("AI Equalizes Knowledge", "AI makes the world's financial intelligence available to everyone, not just Wall Street. Your personal Bot has the same analytical power as billion-dollar hedge funds."),
        ("Bot Equalizes Labor", "Your Bot works 24/7, never sleeps, never gets emotional. It monitors global markets around the clock — doing the work of a full-time trader, for free."),
        ("AI + Bot Equalizes Wealth", "When knowledge and labor are equalized, wealth follows. We believe every person deserves the chance to benefit from the AI revolution."),
        ("Start Small, Dream Big", "With a minimum of just $1, anyone can begin. The 100-level VIP system ensures that even the smallest capital has a growth path to $10,000 and beyond."),
        ("Transparency & Safety", "Your funds stay in YOUR exchange account. Bot only has trading permissions — never withdrawal access. All fees are transparent: 10% of profits, zero when there's no profit."),
    ]
    for title, desc in values:
        elements.append(Paragraph(f"<b>{title}</b>", body_bold))
        elements.append(Paragraph(desc, body))
        elements.append(Spacer(1, 4))

    # ===== 3. HOW IT WORKS =====
    elements.append(Paragraph("3. How It Works", h1))
    steps = [
        ("Step 1: Connect Wallet", "Create a crypto wallet (MetaMask, OKX, WizzWallet, etc.) and connect it to AIFund.com. Takes about 3 minutes."),
        ("Step 2: Deposit & Activate", "Send as little as $1 worth of crypto (BTC, ETH, USDT, etc.) to activate your account."),
        ("Step 3: Adopt Your Bot", "Give your AI trading Bot a name. It starts learning and analyzing markets immediately."),
        ("Step 4: Follow Bot", "Your Bot sends daily buy/sell signals. You decide whether to follow them. Bot NEVER touches your funds or trading accounts at this stage."),
        ("Step 5: Go VIP — Bot Earns For You", "Pay 99U to upgrade to VIP. Connect your exchange API (trading-only permissions). Your Bot automatically trades 24/7, starting with 100U maximum managed capital."),
    ]
    for title, desc in steps:
        elements.append(Paragraph(f"<b>{title}</b>", body_bold))
        elements.append(Paragraph(desc, body))

    # ===== 4. VIP LEVEL SYSTEM =====
    elements.append(PageBreak())
    elements.append(Paragraph("4. VIP Level System (100 Levels)", h1))
    elements.append(Paragraph(
        "The VIP level system is designed for <b>fairness</b>. Every VIP user starts at Level 1 with a maximum managed capital of 100U. "
        "This ensures that even users with very small capital have a fair starting point alongside wealthier users.", body))
    elements.append(Paragraph(
        "Each time you fulfill your obligation (returning 10% profit share to the platform), your level increases by 1. "
        "After 100 level-ups, your Bot can manage up to <b>10,000U</b> of your capital.", body))
    elements.append(Spacer(1, 10))

    # Level tiers table
    tier_data = [
        ['Tier', 'Levels', 'Max Managed Capital', 'Compute Power', 'Milestone Reward'],
        ['Bronze', '1 - 10', '100U - 990U', '1% - 10%', 'Starter Skin, Bronze Armor'],
        ['Silver', '11 - 25', '1,090U - 2,476U', '11% - 25%', 'Silver Wings'],
        ['Gold', '26 - 50', '2,575U - 4,951U', '26% - 50%', 'Golden Crown'],
        ['Platinum', '51 - 75', '5,050U - 7,426U', '51% - 75%', 'Platinum Shield'],
        ['Diamond', '76 - 95', '7,525U - 9,406U', '76% - 95%', '-'],
        ['Legend', '96 - 100', '9,505U - 10,000U', '96% - 100%', 'Legendary Aura'],
    ]
    t = Table(tier_data, colWidths=[60, 55, 110, 80, 130])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#4F46E5')),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#D1D5DB')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#F9FAFB'), white]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(t)

    # ===== 5. PROFIT DISTRIBUTION =====
    elements.append(Paragraph("5. Profit Distribution Rules", h1))
    elements.append(Paragraph("<b>The 50/50 Rule — Grow Wealth AND Improve Life</b>", body_bold))
    elements.append(Paragraph(
        "We believe wealth should improve lives, not just grow numbers on a screen. "
        "That's why we enforce the 50/50 rule:", body))
    elements.append(Spacer(1, 6))

    profit_data = [
        ['Portion', 'Percentage', 'What Happens'],
        ['Snowball', 'Up to 50%', 'Stays in account. Bot uses it to compound returns (default).'],
        ['Life Improvement', '50%', 'Must be withdrawn. Use it to improve your actual life.'],
        ['Platform Fee', '10% of profits', 'Charged only when Bot earns profit. Zero when no profit.'],
    ]
    pt = Table(profit_data, colWidths=[90, 80, 260])
    pt.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#059669')),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#D1D5DB')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#F0FDF4'), white]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(pt)

    # ===== 6. SUPPORTED MARKETS =====
    elements.append(Paragraph("6. Supported Markets & Platforms", h1))
    elements.append(Paragraph("AIFund supports both centralized exchanges (CEX) and decentralized platforms (DEX):", body))

    elements.append(Paragraph("Centralized Exchanges (API Auto-Trading):", h3))
    cex_list = ["Binance", "OKX", "Bybit", "Coinbase", "Interactive Brokers (IBKR)", "Futu Securities", "Tiger Brokers"]
    for c in cex_list:
        elements.append(Paragraph(f"  - {c}", body))

    elements.append(Paragraph("DEX & Meme Platforms (API or Alert-Based):", h3))
    dex_list = [
        "Unisat Marketplace — BTC inscriptions, runes & BRC-20",
        "WiZZ / Atomicals — ARC-20 tokens & Atomicals protocol",
        "Pump.fun — Solana meme coin launchpad",
        "GMGN.ai — Meme coin discovery & analytics",
        "Birdeye — Solana DEX aggregator",
        "Uniswap — Ethereum DEX",
        "Jupiter — Solana DEX aggregator",
        "Raydium — Solana AMM",
        "PancakeSwap — BNB Chain DEX",
        "Moonshot — New meme coin launcher",
        "DEXTOOLS — Multi-chain DEX explorer",
    ]
    for d in dex_list:
        elements.append(Paragraph(f"  - {d}", body))

    elements.append(Paragraph(
        "Platforms with API support allow Bot to trade automatically. "
        "Platforms without API — Bot sends buy/sell alerts and users execute manually.", body))

    # ===== 7. SECURITY =====
    elements.append(Paragraph("7. Security & Safety", h1))
    security_points = [
        "Your funds NEVER leave your exchange account. Bot only has trading-level API access.",
        "API keys are stored with encryption. We recommend enabling ONLY trade permissions (no withdrawal).",
        "All transactions are transparent and auditable in your exchange history.",
        "Platform has no custody of user funds at any point.",
        "Users control their own crypto wallet private keys at all times.",
    ]
    for s in security_points:
        elements.append(Paragraph(f"  - {s}", body))

    # ===== 8. PRICING =====
    elements.append(Paragraph("8. Pricing", h1))
    pricing_data = [
        ['Plan', 'Cost', 'Features'],
        ['Basic', '>= 1U', 'AI Bot (simulated), $10K virtual funds, real-time P&L, Bot evolution'],
        ['Global Vision', '9.9U (one-time)', 'Historical wealth stories, time-travel animations, all 26+ case studies'],
        ['VIP', '99U', 'Real trading via API, 100-level system, 10% profit share, 24/7 automation'],
    ]
    prt = Table(pricing_data, colWidths=[80, 90, 260])
    prt.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#7C3AED')),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#D1D5DB')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#F5F3FF'), white]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(prt)

    # ===== 9. DISCLAIMER =====
    elements.append(Paragraph("9. Disclaimer", h1))
    elements.append(Paragraph(
        "Cryptocurrency and financial trading involve significant risk. Past performance does not guarantee future results. "
        "Users should only invest what they can afford to lose. AIFund.com provides AI-powered analysis and automation tools — "
        "it does not provide financial advice. Users are responsible for their own trading decisions. "
        "The platform operates on a best-effort basis and does not guarantee any specific returns.", body))
    elements.append(Spacer(1, 20))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#D1D5DB'), spaceAfter=10))
    elements.append(Paragraph(f"AIFund.com Whitepaper v{VERSION} | aifund.com", center))

    doc.build(elements)
    buffer.seek(0)
    return buffer

# Pre-generate and cache
_cached_pdf = None

def get_whitepaper_pdf() -> BytesIO:
    global _cached_pdf
    if _cached_pdf is None:
        _cached_pdf = generate_whitepaper_pdf()
    return _cached_pdf

def invalidate_cache():
    global _cached_pdf
    _cached_pdf = None
