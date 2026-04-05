import { useCallback, useEffect, useRef, useState } from "react"
import { logger } from "../../../shared/utils/logger"
import { getTransporterShipmentsUseCase } from "../../../domain/usecases/shipment.usecase"
import { Shipment } from "../../../domain/entities/shipment.entity"

export type StatStatus = 'idle' | 'loading' | 'fetching' | 'success' | 'error'

export type TransporterStats = {
    shipmentsInProgress: number
    completedShipments: number
    totalEarnings: number
}

export type ActiveShipmentResult = {
    data: Shipment[] | null;
    status: StatStatus;
    error: string | null;
    refresh: () => void
};

export default function useActiveShipments(transporterId: string | undefined): ActiveShipmentResult {

    const [data, setData] = useState<Shipment[] | null>(null);
    const [status, setStatus] = useState<StatStatus>('idle');
    const [trigger, setTrigger] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)
    const requestIdRef = useRef<number>(0)
    const dataRef = useRef<Shipment[] | null>(null)
    dataRef.current = data

    const refresh = useCallback(() => {
        setTrigger((n) => n + 1)
    }, [])
    useEffect(() => {

        if (!transporterId) {
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
                const res = await getTransporterShipmentsUseCase(transporterId)
                if (cancelled || currentId !== requestIdRef.current) return
                setData(res?.shipments);
                setStatus('success');
            } catch (err) {
                const er = err instanceof Error ? err : new Error('Unknown error');
                if (cancelled || currentId !== requestIdRef.current) return
                setError(er.message);
                setStatus('error');
                logger.error("Failed to fetch transporter stats:", er);

            }
        }

        run()
        return () => { cancelled = true }

    }, [transporterId, trigger])


    return { data, status, error, refresh }
}