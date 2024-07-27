import { useEffect, useState } from "preact/hooks";
import { StockData, useStockLiveStream } from "../hooks/useStockLiveStream";

export const WatchListItem = ({ isin }: { isin: string }) => {
  const { subscribeTo } = useStockLiveStream();
  const [lastStockState, setLastStockState] = useState<StockData | null>(null);
  useEffect(() => subscribeTo(isin, setLastStockState), [subscribeTo]);

  return (
    <tr class="mover">
      <td class="name">{isin}</td>
      <td class="price">{lastStockState?.price}</td>
      <td class="percentage">{"2.43%"}</td>
    </tr>
  );
}

type WatchListProps = {
  items: string[];
}

export const WatchList = ({ items }: WatchListProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th class="name">Name</th>
          <th class="price">Price</th>
          <th class="percentage">Diff%</th>
        </tr>
      </thead>
      <tbody data-testid="watch-list">
        {items.map((isin: string) => (
          <WatchListItem isin={isin} />
        ))}
      </tbody>
    </table>
  )
};
