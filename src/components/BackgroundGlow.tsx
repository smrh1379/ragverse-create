import { useEffect, useRef } from "react";

const BackgroundGlow = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handler = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      node.style.setProperty('--pointer-x', `${x}%`);
      node.style.setProperty('--pointer-y', `${y}%`);
    };

    node.addEventListener('mousemove', handler);
    return () => node.removeEventListener('mousemove', handler);
  }, []);

  return <div ref={ref} className="aurora-sheen" aria-hidden="true" />;
};

export default BackgroundGlow;
