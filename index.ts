import { ApiPromise, WsProvider } from '@polkadot/api';

/**
 * The objective of this reproduction is to recreate the following error:
 * 
 * DRR: createType(ExtrinsicStatus):: Cannot map Enum JSON, unable to find 'reason' in future, ready, broadcast, inblock, retracted, finalitytimeout, finalized, usurped, dropped, invalid
 * Error: createType(ExtrinsicStatus):: Cannot map Enum JSON, unable to find 'reason' in future, ready, broadcast, inblock, retracted, finalitytimeout, finalized, usurped, dropped, invalid
 */
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
