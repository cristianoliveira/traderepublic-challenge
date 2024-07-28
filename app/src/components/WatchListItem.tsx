import { useEffect, useState } from "preact/hooks";
import { StockData } from "../hooks/useStockLiveStream";

import styles from './WatchListItem.module.css';

export type WatchListItemProps = {
  isin: string;
  onUnwatch: () => void;
  subscribeTo: (isin: string, callback: (stock: StockData) => void) => void;
}

const changePercentage = (stock: StockData) => {
  const change = Number((stock.price - stock.bid).toFixed(2));
  return Number(((change / stock.bid) * 100).toFixed(2));
}

export const WatchListItem = ({ isin, onUnwatch, subscribeTo }: WatchListItemProps) => {
  const [stock, setStock] = useState<StockData | null>(null);

  useEffect(() => subscribeTo(isin, setStock), []);

  return (
    <tr data-testid={`${isin}-item`} className={styles.watchListItem}>
      {!stock
        ? <>
          <td className="skeleton skeletonText">`${isin}`</td>
          <td className="skeleton skeletonText">$x.xx</td>
          <td className="skeleton skeletonText">x.xx%</td>
        </>
        : <>
          <td className="name">{isin}</td>
          <td className="price">{`$${stock.price.toFixed(2)}`}</td>
          <td className="percentage">{`${changePercentage(stock)}%`}</td>
        </>
      }
      <td className={styles.watchListItemActions}>
        <button
          title="Unwatch this item"
          className={styles.itemActionUnwatch}
          data-testid={`${isin}-unwatch-btn`}
          onClick={onUnwatch}>x</button>
      </td>
    </tr>
  );
}
