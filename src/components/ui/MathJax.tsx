import { useEffect, useRef, useState, memo } from 'react'

declare global { interface Window { MathJax: any } }

let isScriptLoading = false;

// Оборачиваем в memo, чтобы компонент не перерендеривался 
// при изменении userAnswer в родительском компоненте
export const MathJaxComponent = memo(({ children, className = '' }: { children: string, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // 1. Загрузка скрипта (без изменений)
  useEffect(() => {
    if (window.MathJax?.typesetPromise) {
      setReady(true);
      return;
    }
    if (isScriptLoading) return;
    isScriptLoading = true;

    window.MathJax = {
      tex: { 
        inlineMath: [['$', '$'], ['\\(', '\\)']], 
        displayMath: [['$$', '$$'], ['\\[', '\\]']] 
      },
      startup: { typeset: false }
    };

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  // 2. Рендер формул
  useEffect(() => {
    if (ready && ref.current && window.MathJax?.typesetPromise) {
      const node = ref.current;
      
      // Чтобы не было мигания, работаем через промис
      window.MathJax.typesetClear([node]);
      window.MathJax.typesetPromise([node]).catch((e: any) => console.error(e));
    }
  }, [children, ready]); // Сработает ТОЛЬКО если изменится текст задачи

  return (
    <div
      ref={ref}
      className={className}
      // Это критически важно: React отрисует это один раз, 
      // а дальше memo будет блокировать обновления, пока children идентичны
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}, (prevProps, nextProps) => {
  // Кастомная проверка: перерисовывать только если реально изменился текст
  return prevProps.children === nextProps.children;
});