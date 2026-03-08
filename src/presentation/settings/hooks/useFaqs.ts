import { useState } from "react";
import { fetchFaqsUseCase } from "../../../domain/usecases/settings.usecase";
import { FAQ } from "../../../domain/entities/faq";

export const useFaqs = () => {
    const [loading, setLoading] = useState(false);
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadFaqs = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await fetchFaqsUseCase();

            setFaqs(data || []);
            return data;

        } catch (err) {
            setError("Failed to load FAQs");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { faqs, loading, error, loadFaqs };
};