# EduPay Global

A full-stack education finance platform for managing institutional treasury, cross-border student payments, grant disbursements, and on-chain course credentials.

Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, **Drizzle ORM** (PostgreSQL), and a **Solidity** smart contract on Stellar/EVM.

---

## Features

| Section | Description |
|---|---|
| **Overview** | Live treasury dashboard with FX rates, asset reserves, and real-time inflow feed |
| **Treasury** | Multi-rail vault management (USDC, XLM) and transfer history |
| **Students** | Learner progress tracking with live data from the database |
| **Grants** | Donor grant and scholarship disbursement tracking |
| **Payouts** | Outbound payments to faculty, vendors, and bursary recipients |
| **Compliance** | Regulatory checks, audit trails, and policy status |
| **EduCredential** | Non-transferable on-chain course completion credentials (EVM smart contract) |

---

## Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org) (App Router)
- **UI** — React 19, Tailwind CSS v4, Lucide icons, shadcn/ui primitives
- **Database** — PostgreSQL via [Drizzle ORM](https://orm.drizzle.team)
- **Blockchain** — Solidity 0.8.24, [Hardhat](https://hardhat.org), ethers v6
- **Analytics** — Vercel Analytics
- **Package manager** — pnpm

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/joshfatoye0011-bit/edu-tech-app-creation.git
cd edu-tech-app-creation
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/edutech
AUTH_SECRET=your-long-random-secret

# Optional — only needed for Sepolia contract deployment
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
DEPLOYER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

### 3. Set up the database

```bash
# Push the schema to your PostgreSQL database
pnpm db:push
```

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Scripts

| Command | Description |
|---|---|
| `pnpm db:push` | Push schema changes directly to the database |
| `pnpm db:generate` | Generate SQL migration files |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm db:studio` | Open Drizzle Studio (visual DB browser) |

---

## Smart Contract (EduCredential)

The `EduCredential` contract issues non-transferable (soul-bound) course completion credentials on-chain.

### Local development

```bash
# 1. Compile
pnpm chain:compile

# 2. Start a local Hardhat node (keep running in a separate terminal)
pnpm chain:node

# 3. Deploy to local node
pnpm chain:deploy:local

# 4. Export ABI for the frontend
pnpm chain:export-abi
```

### Testnet deployment (Sepolia)

Make sure `SEPOLIA_RPC_URL` and `DEPLOYER_PRIVATE_KEY` are set in `.env.local`, then:

```bash
pnpm chain:deploy:sepolia
pnpm chain:export-abi
```

Deployment addresses are saved to `lib/contracts/deployments.json` per chain ID.

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `GET /api/learning` | GET | Fetch last 50 learning activity records |
| `POST /api/learning` | POST | Upsert a learner's course progress |
| `GET /api/auth` | GET | Return current session |
| `POST /api/auth` | POST | Sign in (email + password) |
| `DELETE /api/auth` | DELETE | Sign out |

### POST /api/learning — request body

```json
{
  "learnerId": "student-001",
  "courseSlug": "intro-to-blockchain",
  "progress": 75,
  "streakDays": 14
}
```

---

## Project Structure

```
├── app/
│   ├── page.tsx              # Overview dashboard
│   ├── treasury/page.tsx     # Treasury vaults
│   ├── students/page.tsx     # Student activity (live DB)
│   ├── grants/page.tsx       # Grant programs
│   ├── payouts/page.tsx      # Outbound payments
│   ├── compliance/page.tsx   # Compliance center
│   ├── api/
│   │   ├── auth/route.ts     # Session auth
│   │   └── learning/route.ts # Learning activity API
│   └── globals.css           # All app styles
├── contracts/
│   └── EduCredential.sol     # Soul-bound credential contract
├── lib/
│   ├── db.ts                 # Drizzle + pg pool
│   ├── schema.ts             # Drizzle schema
│   ├── useEduCredential.ts   # React hook for contract interaction
│   └── contracts/
│       ├── README.md
│       ├── EduCredential.abi.json  # Generated — run chain:export-abi
│       └── deployments.json        # Generated — run chain:deploy:*
├── scripts/
│   ├── deploy.ts             # Hardhat deploy script
│   └── export-abi.ts         # ABI export script
├── hardhat.config.ts
├── drizzle.config.ts
└── .env.example
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard:
   - `DATABASE_URL`
   - `AUTH_SECRET`
4. Deploy — Vercel auto-detects Next.js and runs `pnpm build`

---

## License

MIT
