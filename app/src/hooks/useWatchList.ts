import { useState } from 'preact/hooks'
import { validateISIN } from '../modules/isin';

type WatchErrors = 'duplicated' | 'empty' | 'invalid' | '';
type WatchListHook = {
  /**
   * List of ISINs
   */
  items: string[];
  /**
   * Add an ISIN to the watch list
   * @param isin ISIN code
   * @returns an error type with the reason
   */
  add: (isin: string) => WatchErrors;
  /**
   * Remove an ISIN from the watch list
   * @param isin ISIN code
   * @returns an error type with the reason
   */
  remove: (isin: string) => WatchErrors;
}

export const useWatchList = (): WatchListHook => {
  const [items, setItem] = useState<string[]>([]);

  return {
    items,

    add: (isin: string) => {
      if (!isin) {
        return 'empty';
      }

      if (items.includes(isin)) {
        return 'duplicated';
      }

      if (!validateISIN(isin)) {
        return 'invalid';
      }

      setItem((prev) => [...prev, isin])

      return '';
    },

    remove: (isin: string) => {
      if (!isin) {
        return 'empty';
      }

      if (!validateISIN(isin)) {
        return 'invalid';
      }

      setItem((prev) => prev.filter((item) => item !== isin))

      return '';
    },
  };
}

export const ERRORS: Record<WatchErrors, string> = {
  duplicated: 'ISIN was not added because it already exists',
  empty: 'ISIN is required',
  invalid: 'ISIN is invalid',
  '': '',
}
