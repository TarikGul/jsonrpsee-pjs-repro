import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async (): Promise<void> => {
    const api = await ApiPromise.create({
        provider: new WsProvider('ws://127.0.0.1:9944'),
    });

    const txStr = '';

    let tx;
    try {
        tx = api.tx(txStr)
    } catch {
        throw 'failed to parse tx'
    }

    const unsub = await api.rpc.author.submitAndWatchExtrinsic(tx, (res) => {
        console.log(`Incoming result: ${res}` );

        if (res.isInBlock) {
            console.log(`Transaction included at blockHash ${res.asInBlock}`);
        } else if (res.isFinalized) {
            console.log(`Transaction finalized at blockHash ${res.asFinalized}`);
            unsub();
        }
    });
};

main().catch(err => console.log(err)).finally(() => process.exit());
