
        WITH required_skus as (
            SELECT r.receipt_id,
                   pq.sku,
                   r.order_time,
                   ('[' || group_concat(pq.id, ',') || ']') items,
                   COUNT(1) required_amt
              FROM RECEIPTS r
                   JOIN PRINTER_QUEUE pq
                        ON r.receipt_id = pq.receipt_id
             WHERE r.group_id IS NULL
             GROUP BY r.receipt_id, pq.sku, r.order_time
             ORDER BY r.order_time ASC
        ), unsatisfied_receipts as (
            SELECT rs.receipt_id,
                   rs.order_time,
                   group_concat('''' || rs.sku || ''': ' || rs.items, ',') queue_items,
                   group_concat('''' || rs.sku || ''': ' || rs.required_amt, ',') order_info
              FROM required_skus rs
             GROUP BY rs.receipt_id,
                      rs.order_time
             ORDER BY rs.order_time ASC
        )
        SELECT ur.receipt_id,
               ur.order_time,
               '{ ' || ur.queue_items || ' }' as queue_items,
               '{ ' || ur.order_info || ' }' as order_info
          FROM unsatisfied_receipts ur
         ORDER BY ur.order_time ASC