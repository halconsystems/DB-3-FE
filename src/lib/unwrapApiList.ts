/**
 * List endpoints may return `data: T[]` or `data: { items: T[] }`.
 * Normalizes to a plain array for table/query consumers.
 */
export function unwrapApiListData<T>(
  data: T[] | { items?: T[] } | null | undefined
): T[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  return Array.isArray(data.items) ? data.items : [];
}

export interface PagedList<T> {
  items: T[];
  totalCount: number;
  /** Present when API returns paged metadata (prefer for DataTable `totalPages`). */
  totalPages?: number;
  page?: number;
  pageNumber?: number;
  pageSize?: number;
}

type PagedBody<T> = {
  items?: T[];
  totalCount?: number;
  TotalCount?: number;
  total?: number;
  totalPages?: number;
  TotalPages?: number;
  page?: number;
  pageNumber?: number;
  PageNumber?: number;
  pageSize?: number;
  PageSize?: number;
};

function pickTotalPages(body: PagedBody<unknown>): number | undefined {
  if (typeof body.totalPages === "number" && body.totalPages >= 0) return body.totalPages;
  if (typeof body.TotalPages === "number" && body.TotalPages >= 0) return body.TotalPages;
  return undefined;
}

function pickPageNumber(body: PagedBody<unknown>): number | undefined {
  if (typeof body.pageNumber === "number") return body.pageNumber;
  if (typeof body.PageNumber === "number") return body.PageNumber;
  if (typeof body.page === "number") return body.page;
  return undefined;
}

function pickPageSize(body: PagedBody<unknown>): number | undefined {
  if (typeof body.pageSize === "number") return body.pageSize;
  if (typeof body.PageSize === "number") return body.PageSize;
  return undefined;
}

/**
 * Parses the API envelope `data` field for paginated list responses:
 * `T[]`, `{ items, totalCount }`, or full metadata (`totalPages`, `page`, etc.).
 */
export function parsePagedListData<T>(
  bodyData: T[] | PagedBody<T> | null | undefined
): PagedList<T> {
  if (bodyData == null) return { items: [], totalCount: 0 };
  if (Array.isArray(bodyData)) {
    return { items: bodyData, totalCount: bodyData.length };
  }
  const body = bodyData as PagedBody<T>;
  const items = Array.isArray(body.items)
    ? body.items
    : unwrapApiListData(body as { items?: T[] });
  const total =
    typeof body.totalCount === "number"
      ? body.totalCount
      : typeof body.TotalCount === "number"
        ? body.TotalCount
        : typeof body.total === "number"
          ? body.total
          : items.length;
  const totalPages = pickTotalPages(body);
  const pageNumber = pickPageNumber(body);
  const pageSize = pickPageSize(body);
  return {
    items,
    totalCount: total,
    ...(totalPages !== undefined ? { totalPages } : {}),
    ...(pageNumber !== undefined ? { pageNumber } : {}),
    ...(pageSize !== undefined ? { pageSize } : {}),
    ...(typeof body.page === "number" ? { page: body.page } : {}),
  };
}

/** Prefer API `totalPages`; otherwise derive from `totalCount` and the page size used in the request. */
export function resolveTableTotalPages(
  paged: PagedList<unknown> | null | undefined,
  clientPageSize: number
): number {
  const fromApi = paged?.totalPages;
  if (typeof fromApi === "number" && fromApi >= 0) {
    return Math.max(1, fromApi);
  }
  const size = Math.max(1, clientPageSize);
  return Math.max(1, Math.ceil((paged?.totalCount ?? 0) / size));
}
