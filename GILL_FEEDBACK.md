# Gill SDK Feedback

I am a 6+ year full stack engineer, and have 3+ years experience with
web applications and react libraries.

I have little to no experience with blockchain development. Its possible
I am not using Gill for its ideal use cases. I saw in the docs examples 
for minting, so i will try that next.

I wrote this feedback with the help of AI.

## How This Project Uses Gill SDK

This Next.js 15 Solana payment application attempted to use Gill SDK 
for transaction creation and RPC operations on mainnet.

### Core Integration Pattern

```typescript
import {createTransaction} from 'gill';
import {getTransferSolInstruction} from 'gill/programs';
import {createSolanaClient} from 'gill';

// RPC operations (works well)
const {rpc} = createSolanaClient({urlOrMoniker: "devnet"});
const {value: latestBlockhash} = await (rpc as any).getLatestBlockhash().send();

// Transaction creation (compatibility issues with wallet adapters)
const transaction = createTransaction({
    version: "legacy",
    feePayer: wallet.publicKey.toBase58() as Address,
    instructions: [getTransferSolInstruction({...})],
    latestBlockhash,
});
```

## Issues (i think)

### Critical Wallet Adapter Incompatibility

**Gill transactions are fundamentally incompatible with `@solana/wallet-adapter-react`** due to web3.js version
differences:

- Gill uses web3.js v2 format (`lifetimeConstraint`, modern structure)
- Wallet adapters expect web3.js v1 format (`recentBlockhash`, legacy Transaction objects)
- Results in `TypeError: buffer is not iterable` when attempting integration

i think my lack of knowledge here may have affected my ability to integrate these better. 
I wasn't able to find any information about wallet integration with gill in the docs. 

### TypeScript & Development Issues

- **Type assertions required**: Complex casting between Gill types and wallet adapter expectations
- **IDE resolution problems**: RPC methods show as unresolved, requiring `(rpc as any)` workarounds
- **Missing documentation**: `gill/programs` exports not well-documented or discoverable

### React Integration Challenges

**`@gillsdk/react` hooks fail with TanStack Query configuration errors:**

```typescript
// ❌ Broken: @gillsdk/react hooks
const {balance} = useBalance({address}); // Error: No queryFn was passed

// ✅ Working: Direct integration
const {data: balance} = useQuery({
    queryKey: ['balance', address],
    queryFn: () => gillClient.rpc.getBalance(address).send(),
});
```

##  Suggestions

1. **Wallet adapter compatibility bridge** for web3.js v1 ecosystem integration
2. **Transaction serialization methods** for legacy compatibility
3. **Better type compatibility** with `@solana/wallet-adapter-*` and `@solana/web3.js`
4. **Fix `@gillsdk/react` TanStack Query integration** with proper provider documentation
5. **Comprehensive API reference** for `gill/programs` exports
6. **Clear documentation** about wallet adapter limitations and migration strategies
