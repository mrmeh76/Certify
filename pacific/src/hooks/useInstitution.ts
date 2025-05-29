// pacific/src/hooks/useInstitution.ts
"use client"
import { useEffect, useState } from 'react';
import { useWallet } from '@txnlab/use-wallet';
import { getInstitutionByWallet } from '@/db/getions';
import { TeachingInstitution } from '@/types/teaching-institution';

export function useInstitution() {
    const { activeAddress } = useWallet();
    const [institution, setInstitution] = useState<TeachingInstitution | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstitution = async () => {
            if (activeAddress) {
                setLoading(true);
                try {
                    const data = await getInstitutionByWallet(activeAddress);
                    if (data) {
                        setInstitution({
                            ...data,
                            image_url: data.image_url || ""
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch institution:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchInstitution();
    }, [activeAddress]);

    return { institution, loading };
}