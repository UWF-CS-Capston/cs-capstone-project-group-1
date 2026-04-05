# Network Configuration Architecture

## File Structure

```
cs-capstone-project-group-1/
│
├──  QUICK_START.md                    ← Start here!
├──  NETWORK_SETUP.md                  ← Detailed setup guide
├──  CHANGES.md                        ← What changed
├──  config.template.ts                ← Quick reference template
│
├── GymBuddy/
│   └── src/
│       ├── config/
│       │   └──  network.config.ts    ← **MAIN CONFIG** (edit this!)
│       │
│       ├── utils/
│       │   └── api.ts                  ← Uses NetworkConfig
│       │
│       ├── actions/
│       │   ├── server.ts               ← Uses DerivedConfig.CORS_ORIGINS
│       │   └── db.ts                   ← Uses NetworkConfig.DATABASE
│       │
│       └── app/
│           └── api/
│               └── machines/
│                   └── routes.ts        ← Uses NetworkConfig.API_PORT
│
└── Backend/
    ├── .env                             ← Environment variables (gitignored)
    └── .env.example                     ← Template with instructions
```

## Configuration Flow

```
┌─────────────────────────────────────────────────────────────┐
│  GymBuddy/src/config/network.config.ts                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ NetworkConfig (Primary)                                │ │
│  │  • COMPUTER_IP = '192.168.1.182'                       │ │
│  │  • PHONE_IP = '192.168.1.162'                          │ │
│  │  • API_PORT = 5000                                     │ │
│  │  • EXPO_DEV_PORT = 8081                                │ │
│  │  • DATABASE { HOST, PORT, USER, PASSWORD, DATABASE }   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ DerivedConfig (Auto-computed)                          │ │
│  │  • API_BASE_URL  → from COMPUTER_IP + API_PORT         │ │
│  │  • CORS_ORIGINS  → from IPs + EXPO_DEV_PORT            │ │
│  │  • DATABASE_URL  → from DATABASE.*                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
     ┌──────────┐    ┌──────────┐   ┌──────────┐
     │ api.ts   │    │server.ts │   │  db.ts   │
     │          │    │          │   │          │
     │ API_BASE │    │   CORS   │   │ Database │
     │   URL    │    │ Origins  │   │ Config   │
     └──────────┘    └──────────┘   └──────────┘
```

## Before vs After

### ❌ Before (Scattered Configuration)

```
api.ts:           const COMPUTER_IP = '192.168.1.182';
api.ts:           const PORT = '5000';
server.ts:        origin: ["http://localhost:8081", ...]
server.ts:        const PORT = process.env.PORT || 5000;
db.ts:            host: "192.168.1.182"
db.ts:            port: 5432
routes.ts:        fetch("http://localhost:5000/api/machines")
```

**Problems:**
- Multiple files to edit
- Easy to miss values
- Inconsistency risk
- Hard to maintain

### ✅ After (Centralized Configuration)

```
network.config.ts:
  export const NetworkConfig = {
    COMPUTER_IP: '192.168.1.182',
    API_PORT: 5000,
    DATABASE: { HOST: '...', PORT: 5432, ... }
  }

All other files:
  import { NetworkConfig } from '../config/network.config';
  // Use: NetworkConfig.COMPUTER_IP
  //      NetworkConfig.API_PORT
  //      DerivedConfig.CORS_ORIGINS
```

**Benefits:**
- ✅ Single file to edit
- ✅ Easy to find
- ✅ Type-safe
- ✅ Well-documented
- ✅ Automatic propagation

## Usage Examples

### API Calls
```typescript
// src/utils/api.ts
import { NetworkConfig } from '../config/network.config';

export const API_BASE_URL =
  Platform.OS === 'web'
    ? `http://localhost:${NetworkConfig.API_PORT}`
    : `http://${NetworkConfig.COMPUTER_IP}:${NetworkConfig.API_PORT}`;
```

### CORS Configuration
```typescript
// src/actions/server.ts
import { DerivedConfig } from "../config/network.config";

app.use(cors({
    origin: [
        ...DerivedConfig.CORS_ORIGINS,  // Automatically includes all dev URLs
        /\.exp\.direct$/
    ],
    credentials: true,
}));
```

### Database Connection
```typescript
// src/actions/db.ts
import { NetworkConfig } from "../config/network.config";

export const pool = new Pool({
    host: process.env.PGHOST || NetworkConfig.DATABASE.HOST,
    port: Number(process.env.PGPORT || NetworkConfig.DATABASE.PORT),
    // ...
});
```

## Environment Variable Override

Configuration priority:
1. Environment variables (`.env` file) - **HIGHEST PRIORITY**
2. `NetworkConfig` defaults
3. Hardcoded fallbacks (removed!)

```typescript
// Example: Port selection
const PORT = process.env.PORT || NetworkConfig.API_PORT;
//           ^^^^^^^^^^^^^^^^^    ^^^^^^^^^^^^^^^^^^^^^^
//           .env file takes       Fallback to config
//           precedence
```

## Security Model

```
┌─────────────────────────────────────────────────────────┐
│ Committed to Git (Public)                               │
│  • network.config.ts ✅                                 │
│  • .env.example ✅                                      │
│                                                          │
│ Contains: Default dev values, NO SECRETS                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Gitignored (Private)                                    │
│  • .env ❌                                              │
│  • .env.local ❌                                        │
│                                                          │
│ Contains: Actual credentials, production config         │
└─────────────────────────────────────────────────────────┘
```

## Developer Workflow

```
┌─────────────────┐
│ New Developer   │
│ Joins Team      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 1. Clone Repository                 │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 2. Run ipconfig/ifconfig            │
│    Get IP: 192.168.1.XXX            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 3. Edit network.config.ts           │
│    COMPUTER_IP: '192.168.1.XXX'     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 4. Copy .env.example → .env         │
│    Update DB password               │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 5. npm install && npm start         │
│    ✅ Everything works!             │
└─────────────────────────────────────┘
```

## Troubleshooting Reference

| Issue | Check | Fix |
|-------|-------|-----|
| Can't connect to API | IP address | Update `COMPUTER_IP` in `network.config.ts` |
| CORS error | Dev server URL | Verify IPs match in `network.config.ts` |
| DB connection fails | PostgreSQL running | Check `DATABASE` config & `.env` file |
| Wrong port | Port config | Update `API_PORT` in `network.config.ts` |
| Network changed | IP changed | Update `COMPUTER_IP` & restart servers |

## Key Principles

1. **Single Source of Truth**: One file for all network config
2. **Type Safety**: TypeScript ensures correct usage
3. **Environment Override**: `.env` can override defaults
4. **Auto-Derivation**: Complex values computed automatically
5. **Clear Documentation**: TODOs and comments guide developers
6. **Security First**: Secrets in `.env`, not in committed code
