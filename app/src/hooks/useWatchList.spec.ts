import { describe, expect, it } from "vitest";

import { renderHook, act } from "@testing-library/preact";
import { useWatchList } from './useWatchList'

describe('useWatchList', () => {
  describe('add', () => {
    it('allows adding different ISIN to the watchlist', () => {
      const { result } = renderHook(() => useWatchList());

      act(() => {
        const err = result.current?.add("US0378331005");
        expect(err).toBe('');
      });

      expect(result.current?.items).toHaveLength(1);

      act(() => {
        const err = result.current?.add("US0378331006");
        expect(err).toBe('');
      });
    });

    it('does not allow adding duplicated ISINs', () => {
      const { result } = renderHook(() => useWatchList());

      act(() => {
        const err = result.current?.add("US0378331005");
        expect(err).toBe('');
      });
      expect(result.current?.items).toHaveLength(1);

      act(() => {
        const err = result.current?.add("US0378331005");
        expect(err).toBe('duplicated');
      });
      expect(result.current?.items).toHaveLength(1);
    });
  });

  describe('remove', () => {
    it('allows removing ISIN from the watchlist', () => {
      const { result } = renderHook(() => useWatchList());

      act(() => {
        const err = result.current?.add("US0378331005");
        expect(err).toBe('');
      });
      expect(result.current?.items).toHaveLength(1);

      act(() => {
        const err = result.current?.remove("US0378331005");
        expect(err).toBe('');
      });
      expect(result.current?.items).toHaveLength(0);
    });
  });
});
