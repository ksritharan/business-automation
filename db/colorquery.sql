WITH receipt_package_grouped as (
SELECT rp.filename
  FROM receipts r
  JOIN receipt_packages rp
       ON r.receipt_id = rp.receipt_id
 WHERE r.group_id = 'tectle-2021-03-27-1'
 GROUP BY r.receipt_id, rp.package_id, rp.filename
)
SELECT COUNT(filename) num_complete,
       COUNT(1) total_num_labels
  FROM receipt_package_grouped