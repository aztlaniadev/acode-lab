import { useMemo } from 'react';

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
};

export const DOTS = '...';

interface UsePaginationProps {
  totalPageCount: number;
  currentPage: number;
  siblingCount?: number; // Páginas ao lado da atual
}

export const usePagination = ({
  totalPageCount,
  currentPage,
  siblingCount = 1,
}: UsePaginationProps) => {
  const paginationRange = useMemo(() => {
    // Total de slots visíveis (aproximado)
    const totalPageNumbers = 5 + 2 * siblingCount;

    // Caso 1: Total de páginas é menor que os slots. Mostrar todas.
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // Caso 2: Sem DOTS à esquerda, mas com DOTS à direita (Perto do início)
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, lastPageIndex];
    }

    // Caso 3: Com DOTS à esquerda, mas sem DOTS à direita (Perto do fim)
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(lastPageIndex - rightItemCount + 1, lastPageIndex);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Caso 4: Com DOTS à esquerda e à direita (No meio)
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
    
    return []; // Fallback
  }, [totalPageCount, siblingCount, currentPage]);

  return paginationRange;
};
