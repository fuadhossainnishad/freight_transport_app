import { useCallback, useEffect, useRef, useState } from "react"
import { logger } from "../../../shared/utils/logger"
import { getDriverByIdsUseCase } from "../../../domain/usecases/driver.usecase"
import { Driver } from "../types"

export type StatStatus = 'idle' | 'loading' | 'fetching' | 'success' | 'error'

export type UseStatResult = {
    data: Driver | null;
    status: StatStatus;
    error: string | null;
    refresh: () => void
};

export default function useDriver(driverId: string | undefined): UseStatResult {

    const [data, setData] = useState<Driver | null>(null);
    const [status, setStatus] = useState<StatStatus>('idle');
    const [trigger, setTrigger] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)
    const requestIdRef = useRef<number>(0)
    const dataRef = useRef<Driver | null>(null)
    dataRef.current = data

    const refresh = useCallback(() => {
        setTrigger((n) => n + 1)
    }, [])
    useEffect(() => {

        if (!driverId) {
            setStatus('idle')
            setData(null)
            setError(null);
            return
        };

        let cancelled = false;

        const run = async () => {
            const currentId = ++requestIdRef.current
            // setData(null);
            setStatus(dataRef.current ? 'fetching' : 'loading'); // ← shows skeleton only on first load
            setError(null);

            try {
                const res = await getDriverByIdsUseCase(driverId);
                if (cancelled || currentId !== requestIdRef.current) return
                setData(res);
                setStatus('success');
            } catch (err) {
                const er = err instanceof Error ? err : new Error('Unknown error');
                if (cancelled || currentId !== requestIdRef.current) return
                setError(er.message);
                setStatus('error');
                logger.error("Failed to fetch driver details:", er);

            }
        }

        run()
        return () => { cancelled = true }

    }, [driverId, trigger])


    return { data, status, error, refresh }
}