import { useState } from 'preact/hooks'

type WatchErrors = 'duplicated' | '';
type WatchListHook = {
  /**
   * List of ISINs
   */
  items: string[];
  /**
   * Add an ISIN to the watch list
   * @param isin ISIN code
   * @returns an error type if the was not added with the reason
   */
  add: (isin: string) => WatchErrors;
  /**
   * Remove an ISIN from the watch list
   * @param isin ISIN code
   * @returns an error type if the was not removed with the reason
   */
  remove: (isin: string) => WatchErrors;
}

export const useWatchList = (): WatchListHook => {
  const [items, setItem] = useState<string[]>([]);

  return {
    items,

    add: (isin: string) => {
      if (items.includes(isin)) {
      return 'duplicated';
      }

      setItem((prev) => [...prev, isin])

      return '';
    },

    remove: (isin: string) => {
      setItem((prev) => prev.filter((item) => item !== isin))

      return '';
    },
  };
}

export const ERRORS: Record<WatchErrors, string> = {
  duplicated: 'ISIN was not added because it already exists',
  '': '',
}

