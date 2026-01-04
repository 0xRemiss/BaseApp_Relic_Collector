import { useEffect, useState } from "react";
import sdk, { type Context } from "@farcaster/frame-sdk";

export function useFarcaster() {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [context, setContext] = useState<Context.FrameContext>();

    useEffect(() => {
        const load = async () => {
            setContext(await sdk.context);

            // Auto-resize or notify ready
            sdk.actions.ready({});
        };
        if (sdk && !isSDKLoaded) {
            setIsSDKLoaded(true);
            load();
        }
    }, [isSDKLoaded]);

    return { isSDKLoaded, context };
}
