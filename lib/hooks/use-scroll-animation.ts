"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
    threshold?: number;
    delay?: number;
}

export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
    options: UseScrollAnimationOptions = {}
) {
    const { threshold = 0.15, delay = 0 } = options;
    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (delay > 0) {
                        const timer = window.setTimeout(() => setIsVisible(true), delay);
                        return () => window.clearTimeout(timer);
                    }
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold, delay]);

    return { ref, isVisible };
}
