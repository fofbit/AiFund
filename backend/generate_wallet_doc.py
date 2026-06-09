"""
Generate PDF version of the Wallet Connect Module Documentation
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, Preformatted
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from io import BytesIO

def generate_wallet_doc_pdf() -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=25*mm, bottomMargin=20*mm, leftMargin=20*mm, rightMargin=20*mm)
    styles = getSampleStyleSheet()

    title_s = ParagraphStyle('T', parent=styles['Title'], fontSize=24, spaceAfter=6, textColor=HexColor('#7C3AED'), alignment=TA_CENTER)
    sub_s = ParagraphStyle('Sub', parent=styles['Normal'], fontSize=11, spaceAfter=15, textColor=HexColor('#6B7280'), alignment=TA_CENTER)
    h1 = ParagraphStyle('H1', parent=styles['Heading1'], fontSize=18, spaceBefore=18, spaceAfter=8, textColor=HexColor('#7C3AED'))
    h2 = ParagraphStyle('H2', parent=styles['Heading2'], fontSize=14, spaceBefore=12, spaceAfter=6, textColor=HexColor('#4F46E5'))
    h3 = ParagraphStyle('H3', parent=styles['Heading3'], fontSize=12, spaceBefore=10, spaceAfter=5, textColor=HexColor('#6366F1'))
    body = ParagraphStyle('B', parent=styles['Normal'], fontSize=9, spaceAfter=5, leading=13)
    body_b = ParagraphStyle('BB', parent=body, fontName='Helvetica-Bold')
    code_s = ParagraphStyle('Code', parent=styles['Normal'], fontName='Courier', fontSize=7.5, leading=10, spaceAfter=8, leftIndent=10, rightIndent=10, backColor=HexColor('#F3F4F6'))
    small = ParagraphStyle('Sm', parent=styles['Normal'], fontSize=7.5, textColor=HexColor('#9CA3AF'))
    center = ParagraphStyle('C', parent=body, alignment=TA_CENTER)

    e = []

    # Cover
    e.append(Spacer(1, 60))
    e.append(Paragraph("AiFund.com", title_s))
    e.append(Paragraph("Wallet Connect / Disconnect Module", ParagraphStyle('X', parent=sub_s, fontSize=16, textColor=HexColor('#4F46E5'))))
    e.append(Spacer(1, 10))
    e.append(Paragraph("Complete Technical Documentation for Reuse", sub_s))
    e.append(HRFlowable(width="50%", thickness=1, color=HexColor('#7C3AED'), spaceAfter=15, hAlign='CENTER'))
    e.append(Paragraph("Version 1.0 | Stack: React + FastAPI + MongoDB", small))
    e.append(Paragraph("No npm wallet libraries required — uses browser-native window.ethereum API", small))
    e.append(Spacer(1, 40))

    toc = ["1. Architecture Overview", "2. App.js — Core State Manager", "3. Landing Page — Connect Button + Wallet Guide",
           "4. Dashboard — Account Menu (Disconnect/Switch)", "5. Backend — Wallet Connect API",
           "6. Complete Flow Diagram", "7. localStorage Keys", "8. Props Interface", "9. Adapting for Other Projects"]
    e.append(Paragraph("<b>Contents</b>", body_b))
    for t in toc:
        e.append(Paragraph(t, body))
    e.append(PageBreak())

    # 1. Architecture
    e.append(Paragraph("1. Architecture Overview", h1))
    arch = """Frontend (React)
├── App.js ─── State: connected, walletAddress, userData, isDemoMode
│   ├── LandingPage.js ─── Connect Wallet / Free Demo buttons
│   │   └── WalletGuideModal ─── For users without wallet extension
│   └── Dashboard.js ─── Account dropdown menu
│       └── Disconnect / Switch Wallet actions
│
│   localStorage keys: aifund_wallet, aifund_demo_mode
│
Backend (FastAPI + MongoDB)
└── POST /api/wallet/connect
    → Creates new user OR returns existing user
    → MongoDB collection: users"""
    e.append(Preformatted(arch, code_s))

    e.append(Paragraph("<b>Key Design Decisions:</b>", body_b))
    for p in [
        "Zero npm wallet dependencies — uses window.ethereum browser API directly",
        "localStorage persistence — user stays logged in across page refreshes",
        "Demo mode — full experience without any wallet, uses a fixed demo address",
        "Chain auto-detection — 0x prefix = EVM, T prefix = Tron, other = Solana",
    ]:
        e.append(Paragraph(f"• {p}", body))

    # 2. App.js
    e.append(Paragraph("2. App.js — Core State Manager", h1))
    e.append(Paragraph("The root component manages all wallet connection state. Five key functions:", body))

    e.append(Paragraph("2.1 State Variables", h3))
    state_code = """const [connected, setConnected] = useState(false);
const [walletAddress, setWalletAddress] = useState(null);
const [userData, setUserData] = useState(null);
const [loading, setLoading] = useState(false);
const [isDemoMode, setIsDemoMode] = useState(false);"""
    e.append(Preformatted(state_code, code_s))

    e.append(Paragraph("2.2 Auto-Reconnect on Page Load", h3))
    e.append(Paragraph("Checks localStorage on mount. If saved session exists, reconnects automatically:", body))
    auto_code = """useEffect(() => {
  const savedWallet = localStorage.getItem('aifund_wallet');
  const savedDemo = localStorage.getItem('aifund_demo_mode');
  if (savedDemo === 'true') {
    enterDemoMode();
  } else if (savedWallet) {
    connectExistingWallet(savedWallet);
  }
}, []);"""
    e.append(Preformatted(auto_code, code_s))

    e.append(Paragraph("2.3 Connect New Wallet (MetaMask/EVM)", h3))
    connect_code = """const connectWallet = async () => {
  setLoading(true);
  try {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      const address = accounts[0];
      const response = await axios.post(`${API}/wallet/connect`, {
        wallet_address: address, wallet_type: 'metamask'
      });
      setWalletAddress(address);
      setUserData(response.data);
      setConnected(true);
      setIsDemoMode(false);
      localStorage.setItem('aifund_wallet', address);
      localStorage.removeItem('aifund_demo_mode');
    } else {
      // No wallet → show WalletGuideModal
    }
  } catch (error) {
    if (error.code === 4001) alert('Connection cancelled.');
    else alert('Failed to connect.');
  } finally { setLoading(false); }
};"""
    e.append(Preformatted(connect_code, code_s))

    e.append(Paragraph("2.4 Demo Mode (No Wallet Required)", h3))
    demo_code = """const enterDemoMode = async () => {
  setLoading(true);
  try {
    const response = await axios.post(`${API}/wallet/connect`, {
      wallet_address: DEMO_WALLET, wallet_type: 'demo'
    });
    // Auto-setup if new user (deposit, create bot, etc.)
    setWalletAddress(DEMO_WALLET);
    setConnected(true);
    setIsDemoMode(true);
    localStorage.setItem('aifund_demo_mode', 'true');
  } catch (error) { alert('Demo failed.'); }
  finally { setLoading(false); }
};"""
    e.append(Preformatted(demo_code, code_s))

    e.append(Paragraph("2.5 Disconnect (True Logout)", h3))
    disc_code = """const disconnectWallet = () => {
  setConnected(false);
  setWalletAddress(null);
  setUserData(null);
  setIsDemoMode(false);
  localStorage.removeItem('aifund_wallet');
  localStorage.removeItem('aifund_demo_mode');
  // User returns to LandingPage → can connect different wallet
};"""
    e.append(Preformatted(disc_code, code_s))

    # 3. Wallet Guide
    e.append(PageBreak())
    e.append(Paragraph("3. Landing Page — Connect + Wallet Guide", h1))
    e.append(Paragraph("When user clicks Connect but has no wallet extension installed:", body))
    guide_code = """const handleConnect = () => {
  if (typeof window.ethereum !== 'undefined') {
    onConnect();              // Wallet exists → connect
  } else {
    setShowWalletGuide(true); // No wallet → guide
  }
};"""
    e.append(Preformatted(guide_code, code_s))

    e.append(Paragraph("Supported Wallets:", h3))
    wallet_data = [
        ['Wallet', 'Chain', 'Type'],
        ['MetaMask', 'EVM (ETH/BSC/ARB)', 'Browser + Mobile'],
        ['OKX Wallet', 'EVM', 'Browser + Mobile'],
        ['WizzWallet', 'Atomicals/ARC-20', 'Browser Extension'],
        ['Trust Wallet', 'EVM', 'Browser + Mobile'],
        ['Coinbase Wallet', 'EVM', 'Browser + Mobile'],
        ['Unisat', 'BTC/BRC-20', 'Browser Extension'],
    ]
    wt = Table(wallet_data, colWidths=[90, 120, 100])
    wt.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#4F46E5')), ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'), ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#D1D5DB')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#F9FAFB'), white]),
        ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    e.append(wt)
    e.append(Spacer(1, 8))
    e.append(Paragraph("Each wallet entry provides: <b>Official Site</b> link + <b>Chrome Extension Store</b> link", body))
    e.append(Paragraph("Chrome browser download link shown at top of guide for extension wallets", body))

    # 4. Dashboard Account Menu
    e.append(Paragraph("4. Dashboard — Account Menu", h1))
    e.append(Paragraph("Replaces simple logout icon with full account management dropdown:", body))
    e.append(Paragraph("<b>Features:</b>", body_b))
    for f in ["Shows connected wallet address + chain icon (EVM/Tron/SOL)",
              "Displays current balance",
              "Demo mode: 'Connect Real Wallet' button",
              "'Disconnect &amp; Switch Wallet' button (red, clear action)",
              "Click-away listener auto-closes dropdown"]:
        e.append(Paragraph(f"• {f}", body))

    e.append(Paragraph("Chain Detection Logic:", h3))
    chain_code = """const chainType = walletAddress?.startsWith('0x')
  ? 'EVM (Ethereum/BSC/ARB)'
  : walletAddress?.startsWith('T')
  ? 'Tron'
  : 'Solana';

// Chain icons: 0x → 🔷, T → 🔴, Demo → 🎮, Other → 🟣"""
    e.append(Preformatted(chain_code, code_s))

    e.append(Paragraph("Click-Away Handler:", h3))
    click_code = """useEffect(() => {
  const handleClick = (e) => {
    if (showAccountMenu
      && !e.target.closest('[data-testid="account-menu-btn"]')
      && !e.target.closest('[data-testid="account-dropdown"]')) {
      setShowAccountMenu(false);
    }
  };
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, [showAccountMenu]);"""
    e.append(Preformatted(click_code, code_s))

    # 5. Backend
    e.append(PageBreak())
    e.append(Paragraph("5. Backend — Wallet Connect API", h1))
    api_code = """# FastAPI — POST /api/wallet/connect

class ConnectWalletRequest(BaseModel):
    wallet_address: str
    wallet_type: str  # metamask, unisat, okx, demo

class User(BaseModel):
    wallet_address: str
    balance_usd: float = 0.0
    tier: str = "inactive"  # inactive, basic, vip
    joined_at: datetime
    referral_code: str
    has_global_vision: bool = False

@api_router.post("/wallet/connect")
async def connect_wallet(req: ConnectWalletRequest):
    wallet_address = req.wallet_address.lower()
    user = await db.users.find_one(
        {"wallet_address": wallet_address})

    if not user:
        new_user = User(wallet_address=wallet_address)
        await db.users.insert_one(new_user.model_dump())
        return {"status": "new_user",
                "user": new_user.model_dump(),
                "has_bot": False}

    return {"status": "existing_user",
            "user": {
              "wallet_address": user["wallet_address"],
              "balance_usd": user.get("balance_usd", 0),
              "tier": user.get("tier", "inactive"),
              "has_global_vision": user.get(
                  "has_global_vision", False)
            },
            "has_bot": bot is not None}"""
    e.append(Preformatted(api_code, code_s))

    e.append(Paragraph("MongoDB Schema:", h3))
    mongo_code = """// Collection: users
{
  wallet_address: "0x71376f...",
  balance_usd: 109.90,
  tier: "vip",
  joined_at: ISODate("2025-12-13"),
  referral_code: "a1b2c3d4",
  has_global_vision: true
}"""
    e.append(Preformatted(mongo_code, code_s))

    # 6. Flow
    e.append(Paragraph("6. Complete Flow Diagram", h1))
    flow = """User visits site
  |
  +-- Has wallet extension?
  |     +-- YES -> Click "Connect Wallet"
  |     |         -> window.ethereum.request(eth_requestAccounts)
  |     |         -> POST /api/wallet/connect
  |     |         -> Save to localStorage
  |     |         -> Show Dashboard
  |     |
  |     +-- NO  -> Show WalletGuideModal
  |               -> Install wallet links
  |               -> OR click "Free Demo"
  |
  +-- Click "Free Demo"
  |     -> POST /api/wallet/connect (demo address)
  |     -> Auto-setup account
  |     -> Show Dashboard (demo banner)
  |
  +-- Page refresh
        -> Check localStorage
        -> Auto-reconnect

In Dashboard:
  +-- Click account button -> Dropdown:
        +-- Address + chain type
        +-- Balance
        +-- "Connect Real Wallet" (demo only)
        +-- "Disconnect & Switch Wallet"
              -> Clear localStorage
              -> Return to Landing
              -> Can connect different wallet"""
    e.append(Preformatted(flow, code_s))

    # 7. localStorage
    e.append(Paragraph("7. localStorage Keys", h1))
    ls_data = [
        ['Key', 'Example Value', 'Purpose'],
        ['aifund_wallet', '"0x71376f..."', 'Persisted wallet address for auto-reconnect'],
        ['aifund_demo_mode', '"true"', 'Indicates demo mode is active'],
    ]
    lst = Table(ls_data, colWidths=[100, 100, 230])
    lst.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#059669')), ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'), ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#D1D5DB')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#F0FDF4'), white]),
        ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    e.append(lst)
    e.append(Paragraph("Both keys are cleared on disconnect.", body))

    # 8. Props
    e.append(Paragraph("8. Props Interface (TypeScript)", h1))
    props_code = """// LandingPage
interface LandingPageProps {
  onConnect: () => Promise<void>;
  onDemoMode: () => Promise<void>;
  loading: boolean;
}

// Dashboard
interface DashboardProps {
  walletAddress: string;
  userData: {
    status: string;
    user: UserData;
    has_bot: boolean;
  };
  onDisconnect: () => void;
  onRefresh: () => Promise<void>;
  isDemoMode: boolean;
  onExitDemo: () => void;
  onConnectReal: () => Promise<void>;
}"""
    e.append(Preformatted(props_code, code_s))

    # 9. Adapting
    e.append(Paragraph("9. Adapting for Other Projects", h1))
    e.append(Paragraph("To reuse this module:", body))
    for i, step in enumerate([
        "Copy App.js wallet logic (connect/disconnect/demo/localStorage)",
        "Copy WalletGuideModal component from LandingPage.js",
        "Copy Account dropdown from Dashboard.js",
        "Implement POST /api/wallet/connect on your backend",
        "Customize: DEMO_WALLET address, wallet list, localStorage key names",
    ], 1):
        e.append(Paragraph(f"<b>{i}.</b> {step}", body))

    e.append(Spacer(1, 10))
    e.append(Paragraph("Minimum Viable Wallet Connect (simplified):", h3))
    min_code = """const connectWallet = async () => {
  if (!window.ethereum) return alert('Install MetaMask');
  const [address] = await window.ethereum.request({
    method: 'eth_requestAccounts' });
  localStorage.setItem('wallet', address);
  // POST to your backend to register user
};

const disconnect = () => {
  localStorage.removeItem('wallet');
  // Reset state, show login page
};"""
    e.append(Preformatted(min_code, code_s))

    e.append(Spacer(1, 20))
    e.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#D1D5DB'), spaceAfter=8))
    e.append(Paragraph("AiFund.com — Wallet Connect Module Documentation v1.0", center))

    doc.build(e)
    buffer.seek(0)
    return buffer

if __name__ == "__main__":
    pdf = generate_wallet_doc_pdf()
    with open("/tmp/AiFund_Wallet_Connect_Module.pdf", "wb") as f:
        f.write(pdf.getvalue())
    print("PDF generated: /tmp/AiFund_Wallet_Connect_Module.pdf")
